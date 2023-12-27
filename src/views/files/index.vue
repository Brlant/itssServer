<template>
  <div class="app-container">
    <!--    搜索-->
    <el-row>
      <!--      搜索内容-->
      <el-col :span="16">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
          <!--      物品编号/名称-->
          <el-form-item prop="key">
            <el-input
              prefix-icon="el-icon-search"
              v-model="queryParams.key"
              placeholder="物品编号/名称"
              clearable
              @keyup.enter.native="getFilesList"
            />
          </el-form-item>
          <!--      物品类型-->
          <el-form-item prop="goodsType">
            <el-select v-model="queryParams.goodsType" placeholder="物品类型" clearable>
              <el-option
                v-for="(item,index) in goodsTypes"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictCode"
                :disabled="item.status !== '0'"
              />
            </el-select>
          </el-form-item>
          <!--      供应商-->
          <el-form-item prop="supplierId">
            <el-select v-model="queryParams.supplierId" filterable :filter-method="getSupplierList" placeholder="供应商" clearable>
              <el-option
                v-for="(item,index) in supplierList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <!--搜索重置-->
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getFilesList">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!--      新建导出-->
      <el-col :span="8">
        <el-form>
          <!--       新建 -->
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addFilesForm"
            v-hasPermi="['pms:goods:add']"
          >新建
          </el-button>
          <!--        导入新建/修改-->
          <el-button
            type="primary"
            icon="el-icon-upload2"
            @click="supplierImport"
          >导入新建/修改
          </el-button>
          <!--        导出-->
          <el-button
            type="primary"
            icon="el-icon-download"
            @click="exportFiles"
          >导出
          </el-button>
        </el-form>
      </el-col>
    </el-row>
    <!--    切换-->
    <el-row class="SwitchTypes">
      <el-button
        class="btnSwitch"
        v-for="(item,index) in switchType"
        :key="index"
        :class="{ 'is-active': activeFilterIndex === index }"
        @click="setActiveFilter(item,index)"
      >
        {{ item.label }}
      </el-button>
    </el-row>

    <!--    查询表格-->
    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="goodsCode" label="物品编号"></el-table-column>
      <el-table-column prop="goodsName" label="物品名称"></el-table-column>
      <el-table-column prop="goodsType" label="物品类型">
        <template slot-scope="scope">
          <span v-if="scope.row.goodsType === 1">固定资产</span>
          <span v-if="scope.row.goodsType === 2">消耗品</span>
          <span v-if="scope.row.goodsType === 3">服务</span>
          <span v-if="scope.row.goodsType === 4">销售品</span>
        </template>
      </el-table-column>
      <el-table-column prop="goodsModel" label="型号"></el-table-column>
      <el-table-column prop="goodsSpecifications" label="规格"></el-table-column>
      <el-table-column prop="goodsUnit" label="单位"></el-table-column>
      <el-table-column prop="taxBid" label="含税进价(元)"></el-table-column>
      <el-table-column prop="supplierName" label="供应商"></el-table-column>
      <el-table-column prop="goodsStatus" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.goodsStatus === 0" style="color: #F79B22">待审核</span>
          <span v-if="scope.row.goodsStatus === 1" style="color: #F79B22">审核中</span>
          <span v-if="scope.row.goodsStatus === 2" style="color: black">审核未通过</span>
          <span v-if="scope.row.goodsStatus === 3" style="color: green">启用</span>
          <span v-if="scope.row.goodsStatus === 4" style="color: black">已撤回</span>
          <span v-if="scope.row.goodsStatus === 5" style="color: red">停用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-data"
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
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      @pagination="getFilesList"
    />
    <!--    详情弹框-->
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

    <!--    新建弹框内容-->
    <files-form :dialogAddFiles="dialogAddFiles" @closeAddFiles="closeAddFiles"></files-form>

    <el-dialog :visible.sync="supplierImportDialog.showFlag" :title="supplierImportDialog.title" width="400px"
               center
               @close="closeSupplierImportDialog">
      <div style="margin-bottom: 22px;">
        <el-button
          type="primary"
          icon="el-icon-download"
          @click="downloadTemplate"
        >
          下载模板
        </el-button>
      </div>
      <div>
        <el-upload drag :action="importSupplierAction"
                   :on-change="importSuccessHandler"
                   :auto-upload="false"
                   :on-error="importErrorHandler"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传excel文件，且必须符合模板要求</div>
        </el-upload>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import filesApi from '@/api/Files/files'
//物品档案管理页面
import filesForm from "@/common/Files/filesForm";
import fileAuditInfo from "@/common/fileManager/fileAuditInfo";
import fileManagerInfo from "@/common/fileManager/fileManagerInfo";
import fileOperationLog from "@/common/fileManager/fileOperationLog";
import supplierApi from '@/api/supplier/supplier'
import { getDealtWithList } from '@/api/auditCenter/dealtWith/dealtWith'
import {getDicts} from '@/api/system/dict/data'
import request from '@/utils/request'

export default {
  name: "index",
  components: {
    filesForm,
    fileAuditInfo,
    fileManagerInfo,
    fileOperationLog,
  },
  data() {
    return {
      // goodsId:'',
      activeGoodsTab: 'fileManagerInfo',
      // tabs: [
      //   {label: '档案信息', name: 'fileInfo', component: fileManagerInfo},
      //   {label: '审核信息', name: 'auditInfo', component: fileAuditInfo},
      //   {label: '操作日志', name: 'operationLog', component: fileOperationLog}
      // ],
      tabName: null,
      //详情信息
      detailsGoodsTitle: "详情信息",
      //详情信息弹框
      dialogDetailsProcessGoodsDialog: false,
      // 遮罩层
      loading: true,
      // 查询参数
      queryParams: {
        key:'',
        goodsType:'',
        supplierId:'',
        goodsStatus:'',
        //翻页
        total: 10,
        page: 1,
        limit: 10,
        order: "id desc",
      },
      // 显示搜索条件
      showSearch: true,
      //物品类型
      goodsTypes: [
        // {label:'固定资产',value:1},
        // {label:'消耗品',value:2},
        // {label:'服务',value:3},
        // {label:'销售品',value:4},
      ],
      supplierList:[],

      //切换按钮
      filters: [
        {label: "全部", value: ''},
        {label: "待审核", value: 0},
        {label: "审核中", value: 1},
        {label: "审核未通过", value: 2},
        {label: "已撤回", value: 4},
        {label: "启用", value: 3},
        {label: "停用", value: 5},
      ],
      activeFilterIndex: 0,
      tableData: [],
      dialogAddFiles: false,//弹出新建框
      // 导入的对话框
      supplierImportDialog: {
        showFlag: false
      },
      detailsGoodsData: {},
      reviewedId:'', //用户id
    }
  },
  created() {
    let userInfo = window.localStorage.getItem('user')
    let userInfoParse = JSON.parse(userInfo)
    this.reviewedId = userInfoParse.userId

    this.getFilesList();
    this.getSupplierList();
    this.getGoodsTypes()
  },
  computed: {
    switchType() {
      return this.filters.map((filter) => {
        return {
          label: filter.label,
          value:filter.value,
        }
      })
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
  methods: {
    /* 导入新建修改 */
    supplierImport(){
      this.supplierImportDialog = {
        showFlag: true,
        title: '导入'
      }
    },
    /* 关闭新建 */
    closeSupplierImportDialog() {
      this.supplierImportDialog.showFlag = false
    },
    /* 下载模板 */
    downloadTemplate(){
      supplierApi.downloadSupperlierTemplate().then()
    },
    /* 导出 */
    exportFiles(){
      supplierApi.exportFiles(this.queryParams).then()
    },
    importSupplierAction() {
      return supplierApi.importSupplierUrl
    },
    importSuccessHandler(file) {
      let formData = new FormData()
      formData.append('file', file.raw)
      supplierApi.importSupplierInfo(formData).then((res) => {
        this.$message({
          type: 'success',
          message: '导入成功'
        })
        this.getFilesList();
      })
    },
    importErrorHandler(err, file) {

    },
    getSupplierList(query) {
      let params = {
        codeNameKey: query,
        supplierStatus: 3,
      }
      // 查询供应商下拉列表
      request.post('pms/supplier/getSupplierList',params).then((res) => {
        this.supplierList = res.data.map(item => {
          return {
            value: item.supplierId,
            label: item.supplierName
          }
        })
      })
    },
    closeGoodsDialog() {
      this.tabName = null;
      this.activeGoodsTab = "fileManagerInfo";
      this.dialogDetailsProcessGoodsDialog = false;
      this.getFilesList();
    },
    closeHandler(){
      this.tabName = null;
      this.activeGoodsTab = "fileManagerInfo";
      this.dialogDetailsProcessGoodsDialog = false;
      this.getFilesList();
    },
    /*获取查询列表*/
    getFilesList() {
      let params = {
        key: this.queryParams.key,
        goodsType: this.queryParams.goodsType,
        supplierId: this.queryParams.supplierId,
        goodsStatus:this.queryParams.goodsStatus,
        pageNum: this.queryParams.page,
        pageSize: this.queryParams.limit,
      };
      filesApi.queryFiles(params).then(res=>{
        this.loading = false;
        this.tableData = res.rows;
        this.queryParams.total = res.total;
        //更新下角标
        const updateParams =
          {
            key: "",
            modelName: "",
            reviewedId: this.reviewedId,
            pageNum: 1,
            pageSize: 10,
            promoterId: "",
            queryType: 2
          }
        getDealtWithList(updateParams).then((res) => {
          this.$store.dispatch('updateItem', res.data.total);
        })

      })

    },
    /*搜索按钮设置*/
    handleQuery() {

    },
    /*重置按钮*/
    resetQuery() {
      this.$refs.queryForm.resetFields();
      this.getFilesList();
    },
    /*切换按钮查询列表*/
    setActiveFilter(item,index) {
      this.queryParams.goodsStatus = item.value;
      this.getFilesList();
      this.activeFilterIndex = index;
    },
    /*新建物品档案管理*/
    addFilesForm() {
      this.dialogAddFiles = true;
      // this.goodsId = '';
    },
    /*关闭弹框*/
    closeAddFiles() {
      this.dialogAddFiles = false;
      this.getFilesList();
    },
    /*详情弹框*/
    handleDetails(row) {
      this.detailsGoodsData = null
      filesApi.getDetailFiles({goodsId:row.goodsId}).then(res=>{
        this.detailsGoodsData = res.data;
        // this.goodsId = row.goodsId;
        this.tabName = '1'
        this.dialogDetailsProcessGoodsDialog = true
      })
    },
    /*处理标签页信息*/
    handleTabClick(tab, event) {

    },
    getGoodsTypes(){
      return getDicts('goods_types').then((res) => {
        this.goodsTypes = res.data
      })
    }
  }
}
</script>

<style scoped>
.is-active {
  background-color: #409eff;
  color: #fff;
}

.btnSwitch {
  border-radius: 20px;
  margin: 0px 5px;
}

.SwitchTypes {
  margin: 10px 0px;
}

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
</style>
