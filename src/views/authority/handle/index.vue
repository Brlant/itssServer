<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <!--      流程标题搜索-->
      <el-form-item  prop="key">
        <el-input
          prefix-icon="el-icon-search"
          v-model="queryParams.key"
          placeholder="档案/单据编号/名称搜索"
          clearable
          @keyup.enter.native="getHandleList"
        />
      </el-form-item>
      <!--     时间搜索 -->
      <el-form-item  prop="applyTime">
        <el-date-picker  style="width: 300px"
          v-model="queryParams.applyTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
         :default-time="['00:00:00', '23:59:59']"
          start-placeholder="请选择开始时间"
          end-placeholder="请选择结束时间"
          @change="changeHandleTime"
        ></el-date-picker>
      </el-form-item>
      <!--      流程名称-->
      <el-form-item prop="modelName">
        <el-select v-model="queryParams.modelName" placeholder="流程名称" clearable>
          <el-option
            v-for="(item,index) in modelNameArray"
            :key="index"
            :label="item.label"
            :value="item.label"
          />
        </el-select>
      </el-form-item>
<!--发起人-->
      <el-form-item prop="promoterId">
        <el-select v-model="queryParams.promoterId"
                   remote
                   clearable
                   @clear="setValueNull"
                   filterable
                   :remote-method="getUserList"
                   placeholder="发起人">
          <el-option
            v-for="item in createList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>


      <!--搜索重置-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search"  @click="getHandleList">搜索</el-button>
        <el-button icon="el-icon-refresh"  @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!--表格-->
    <el-table v-loading="loading" :data="handleList">
      <el-table-column label="流程名称" align="center" prop="modelName"/>
      <el-table-column label="档案/单据编号" align="center" prop="relationCode"/>
      <el-table-column label="档案/单据名称" align="center" prop="relationName"/>
      <el-table-column label="发起人" align="center" prop="promoterName">
<!--        <template slot-scope="scope">-->
<!--          <div v-if="scope.row.reviewedId === queryParams.reviewedId">-->
<!--            {{queryParams.remark}}-->
<!--          </div>-->
<!--        </template>-->
      </el-table-column>
      <el-table-column label="申请时间" align="center" prop="applyTime"/>
      <el-table-column label="状态" align="center" prop="examineStatus">
        <template slot-scope="scope">
          <span v-if="scope.row.examineStatus === 0" style="color: #F79B22">
            待审核
          </span>
          <span v-if="scope.row.examineStatus === 1" style="color: #F79B22">
            审核中
          </span>
          <span v-if="scope.row.examineStatus === 2" style="color: black">
            审核不通过
          </span>
          <span v-if="scope.row.examineStatus === 3">
            已完成
          </span>
          <span v-if="scope.row.examineStatus === 4" style="color: black">
            已撤回
          </span>
        </template>
      </el-table-column>>
      <el-table-column label="审核节点" align="center" prop="modelNode"/>
      <el-table-column label="审核人" align="center" prop="reviewedName"/>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDetails(scope.row)"
          >详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--    翻页-->
    <pagination
      v-show="queryParams.total>0"
      :total="queryParams.total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getHandleList"
    />
    <!--    详情弹框内容-->
    <el-dialog :visible="dialogDetailsProcessDialog" :title="detailsTitle" width="75%" @close="closeDialog">
      <div style="position: relative">
        <div class="tabStatus">
          <span v-if="activeStatus === 0" style="color: #F79B22">待审核</span>
          <span v-if="activeStatus === 1" style="color: #F79B22">审核中</span>
          <span v-if="activeStatus === 2" style="color: black">审核未通过</span>
          <span v-if="activeStatus === 3" style="color: green">启用</span>
          <span v-if="activeStatus === 4" style="color: black">已撤回</span>
          <span v-if="activeStatus === 5" style="color: red">停用</span>
          <span v-if="activeStatus === 6" style="color: black">已淘汰</span>
        </div>
      </div>

      <!--      标签页-->
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="档案信息" name="fileInfo">
          <supplier-info :supplier-data="detailsSupplierData" @closeHandlerInfo="closeHandlerInfo"></supplier-info>
        </el-tab-pane>
        <el-tab-pane label="审核信息" name="auditInfo">
          <supplier-audit-info :supplierId="supplierId"></supplier-audit-info>
        </el-tab-pane>
        <el-tab-pane label="操作日志" name="operationLog">
          <supplier-operation-log :supplierId="supplierId"></supplier-operation-log>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>


    <!--    goods弹框内容-->
    <el-dialog :visible="dialogDetailsProcessGoodsDialog" :title="detailsGoodsTitle" width="75%" @close="closeGoodsDialog">
      <div style="position: relative">
        <div class="tabStatus">
          <span v-if="activeGoodsStatus === 0" style="color: #F79B22">待审核</span>
          <span v-if="activeGoodsStatus === 1" style="color: #F79B22">审核中</span>
          <span v-if="activeGoodsStatus === 2" style="color: black">审核未通过</span>
          <span v-if="activeGoodsStatus === 3" style="color: green">启用</span>
          <span v-if="activeGoodsStatus === 4" style="color: black">已撤回</span>
          <span v-if="activeGoodsStatus === 5" style="color: red">停用</span>
          <span v-if="activeGoodsStatus === 6" style="color: black">已淘汰</span>
        </div>
      </div>
      <!--      标签页-->
      <el-tabs v-model="activeGoodsTab" @tab-click="handleTabClick">
        <el-tab-pane label="档案信息" name="fileManagerInfo">
          <file-manager-info :detailsGoodsData="detailsGoodsData" @closeHandler="closeHandler"></file-manager-info>
        </el-tab-pane>
        <el-tab-pane label="审核信息" name="fileAuditInfo">
          <file-audit-info :goodsId = 'goodsId'></file-audit-info>
        </el-tab-pane>
        <el-tab-pane label="操作日志" name="fileOperationLog">
          <file-operation-log :goodsId = 'goodsId'></file-operation-log>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!--    合同弹框信息-->
    <el-dialog :visible="dialogDetailsContractDialog"
               :title="detailsContractTitle"
               width="75%"
               @close="closeContractDialog"
    >
      <template v-slot:title>
        <div style="font-weight: bold;font-size: 15px">{{ detailsContractTitle }}</div>
      </template>
      <template class="templateDialogStyle">
        <el-tabs v-model="activeContractTab"
                 @tab-click="handleContractTabClick"
        >
          <el-tab-pane
            v-for="tab in tabsContract"
            :key="tab.name"
            :label="tab.label"
            :name="tab.name"
          >
            <!-- 使用组件作为标签页内容 -->
            <component :is="tab.component"
                       :contractId="contractId"
                       @closeDetail="closeContractDialog"
            ></component>
          </el-tab-pane>
        </el-tabs>
        <div class="contractStatusStyle">
          <span v-if="contractStatus === 0" style="color: #f59b22; font-weight: bold;">待审核</span>
          <span v-if="contractStatus === 1" style="color: #f59b22; font-weight: bold;">审核中</span>
          <span v-if="contractStatus === 2" style="color: #000000; font-weight: bold;">审核不通过</span>
          <span v-if="contractStatus === 3" style="color: #70b503; font-weight: bold;">启用</span>
          <span v-if="contractStatus === 5" style="color: #d8001b; font-weight: bold;">停用</span>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getHandleList} from '@/api/auditCenter/handle/handle'
import { getContractFileList,getUserList } from '@/api/contractFilesManagement/contractFilesManagement'
//我的待办页面
// import fileInfo from '@/common/details/fileInfo'
// import auditInfo from '@/common/details/auditInfo'
// import operationLog from '@/common/details/operationLog'
import supplierApi from '@/api/supplier/supplier'
import supplierAuditInfo from '@/common/supplierDetails/supplierAuditInfo'
import supplierInfo from '@/common/supplierDetails/supplierInfo'
import supplierOperationLog from '@/common/supplierDetails/supplierOperationLog'

//物品
import fileAuditInfo from "@/common/fileManager/fileAuditInfo";
import fileManagerInfo from "@/common/fileManager/fileManagerInfo";
import fileOperationLog from "@/common/fileManager/fileOperationLog";

import filesApi from '@/api/Files/files'
import managerInfo from '@/common/contractManager/managerInfo'
import managerAuditInfo from '@/common/contractManager/managerAuditInfo'
import managerOperationLog from '@/common/contractManager/managerOperationLog'

export default {
  name: "index",
  components:{
    supplierAuditInfo,
    supplierInfo,
    supplierOperationLog,

    fileAuditInfo,
    fileManagerInfo,
    fileOperationLog,
  },
  data(){
    return{
      createList: [],
      detailsSupplierData: {},
      activeTab: 'fileInfo',
      // tabs: [
      //   { label: '档案信息', name: 'fileInfo', component: fileInfo },
      //   { label: '审核信息', name: 'auditInfo', component: auditInfo },
      //   { label: '操作日志', name: 'operationLog', component: operationLog }
      // ],
      tabName: null,
      houseOptions: [],
      //详情信息
      detailsTitle: '详情信息',
      //详情信息弹框
      dialogDetailsProcessDialog: false,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 查询参数
      queryParams: {
        key:"",
        applyTime:"",
        modelName:"",
        remark:"",
        reviewedId:'',
        promoterId:'',
        //分页
        total: 10,
        pageNum: 1,
        pageSize: 10,
        order: 'id desc'
      },
      modelNameArray:[
        { label: '供应商档案审核流程' },
        { label: '物品档案审核流程' },
        { label: '合同档案审核流程' },
        { label: '入库单审核流程' },
        { label: '出库单审核流程' },
      ],
      handleList: [],

      detailsRow:{
        modelType:"",
        relationId:"",
      },
      examineStatusArray:[
        {label:"待审核",value:0},
        {label:"审核中",value:1},
        {label:"已完成",value:3},
        {label:"已撤回",value:4},
        {label:"审核不通过",value:2},
      ],
      //状态
      tabStatus:'',

      //goods弹框
      dialogDetailsProcessGoodsDialog: false,
      detailsGoodsTitle: "详情信息",
      detailsGoodsData: {},
      activeGoodsTab: 'fileManagerInfo',

      //contract弹框
      activeContractTab: 'fileInfo',
      tabsContract: [
        { label: '档案信息', name: 'fileInfo', component: managerInfo },
        { label: '审核信息', name: 'auditInfo', component: managerAuditInfo },
        { label: '操作日志', name: 'operationLog', component: managerOperationLog }
      ],
      dialogDetailsContractDialog: false,
      detailsContractTitle: '详情信息',
      contractId: null,
      contractStatus: null
    }
  },
  watch:{

  },
  computed:{
    activeStatus() {
      if (!this.detailsSupplierData) {
        return ''
      }

      let status = this.detailsSupplierData && this.detailsSupplierData.supplierStatus
      return status
    },
    supplierId(){
      if (this.detailsSupplierData){
        return this.detailsSupplierData.supplierId
      }

      return ''
    },

    activeGoodsStatus(){
      if (!this.detailsGoodsData) {
        return ''
      }
      let status = this.detailsGoodsData && this.detailsGoodsData.goodsStatus;
      return status;
    },
    goodsId(){
      if (this.detailsGoodsData){
        return this.detailsGoodsData.goodsId
      }
      return ''
    }
  },
  created() {
    let userInfo = window.localStorage.getItem("user");
    let userInfoParse = JSON.parse(userInfo);
    this.queryParams.remark = userInfoParse.remark;
    this.queryParams.reviewedId = userInfoParse.userId;
    this.getUserList();
  },
  mounted() {
    // 通过查询参数接收参数,测试
    const queryParam = this.$route.query.id;
    this.getHandleList();
  },
  methods:{
    getUserList(query){
      let params = {
        pageNum: 1,
        pageSize: 10,
        nickName:query,
      }
      getUserList(params).then((res) => {
        this.createList = res.rows.map(item => {
          return {
            value: item.userId,
            label: item.nickName
          }
        })
      })
    },
    changeHandleTime(row){
      // if(this.queryParams.applyTime === ""){
      //   this.queryParams.pageSize = 1;  //将页码设置为第一页
      // }
      this.queryParams.applyTime = row;
      this.getHandleList();
    },
    closeDialog() {
      this.tabName = null
      this.activeTab = 'fileInfo'
      this.dialogDetailsProcessDialog = false
      this.detailsRow.modelType = ''
      this.detailsRow.relationId = ''
    },
    closeHandlerInfo(){
      this.dialogDetailsProcessDialog = false;
    },

    /* 详情弹框 */
    handleDetails(row){
      console.log(row.modelType)
      this.detailsSupplierData = null
      if(row.modelType === "supplier"){
        supplierApi.getSupplierDetails(row.relationId).then((res) => {
          this.detailsSupplierData = res.data
          this.tabName = '1'
          this.dialogDetailsProcessDialog = true
        })
      }

      this.detailsGoodsData = null
      if(row.modelType === "goods"){
        filesApi.getDetailFiles({goodsId:row.relationId}).then((res) => {
          this.detailsGoodsData = res.data;
          // this.goodsId = row.goodsId;
          this.tabName = '1'
          this.dialogDetailsProcessGoodsDialog = true
        })
      }
      if(row.modelType === "contract"){
        this.contractId = row.relationId
        this.contractStatus = row.examineStatus
        this.dialogDetailsContractDialog = true
      }

      if(row.modelType === "inOrder"){

      }
      if(row.modelType === "outOrder"){

      }




      // this.detailsSupplierData = null
      // if(row.modelType === "supplier" || row.modelType === "goods" || row.modelType === "contract"|| row.modelType === "inOrder" || row.modelType === "outOrder"){
      //   supplierApi.getSupplierDetails(row.relationId).then((res) => {
      //     this.detailsSupplierData = res.data
      //     this.tabName = '1'
      //     this.dialogDetailsProcessDialog = true
      //   })
      // }

      // this.detailsRow.modelType = row.modelType
      // this.detailsRow.relationId = row.relationId
      // this.examineStatusArray.forEach((item)=>{
      //   if(item.value === row.examineStatus){
      //     this.tabStatus = item.label
      //   }
      // })
      // this.dialogDetailsProcessDialog = true;
    },
    /*处理标签页信息*/
    handleTabClick(tab, event) {

    },
    /** 查询我的发起记录列表 */
    getHandleList(){
      const params = {
        key:this.queryParams.key,
        startDate:this.queryParams.applyTime[0],
        endDate:this.queryParams.applyTime[1],
        modelName:this.queryParams.modelName,
        reviewedId:this.queryParams.reviewedId,
        pageNum:this.queryParams.pageNum,
        pageSize:this.queryParams.pageSize,
        promoterId:this.queryParams.promoterId,
        queryType:3,
      }
      getHandleList(params).then((res)=>{
        this.loading = false;
        this.queryParams.total = res.data.total;
        this.handleList = res.data.rows;
      })
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.$refs.queryForm.resetFields();
      // this.queryParams.applyTime = "";
      this.getHandleList();
      this.getUserList();
    },
    setValueNull(){
      this.getUserList();
    },

    closeGoodsDialog() {
      this.activeGoodsTab = "fileManagerInfo";
      this.dialogDetailsProcessGoodsDialog = false;
      this.getHandleList();
    },
    closeHandler(){
      this.tabName = null;
      this.activeGoodsTab = "fileManagerInfo";
      this.dialogDetailsProcessGoodsDialog = false;
      this.getHandleList();
    },

    closeContractDialog() {
      // this.tabName = null;
      this.activeContractTab = 'fileInfo'
      this.contractId = null
      this.contractStatus = null
      this.dialogDetailsContractDialog = false
    },

    /*处理标签页信息*/
    handleContractTabClick(tab, event) {

    }
  },

}
</script>

<style scoped>
.templateDialogStyle {
  position: relative;
}

.tabStatus {
  position: absolute;
  top: 10px;
  left: 300px;
  width: 80px;
  height: 20px;
  text-align: center;
  color: #F79B22;
}

.contractStatusStyle{
  position: absolute;
  top: 90px;
  left: 300px;
  width: 80px;
  height: 20px;
  text-align: center;
  color: #F79B22;
}
</style>
