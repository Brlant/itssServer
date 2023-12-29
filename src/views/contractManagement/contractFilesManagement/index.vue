<template>
  <div class="app-container">
    <el-row>
      <!--      输入框-->
      <el-col :span="18">
        <el-form :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          v-show="showSearch"
          label-width="68px">
          <!--      合同编号-->
          <el-form-item prop="key">
            <el-input
              prefix-icon="el-icon-search"
              v-model="queryParams.key"
              placeholder="合同编号/合同搜索"
              clearable
              @keyup.enter.native="getContractFiles"
            />
          </el-form-item>
          <!--     时间搜索 -->
          <el-form-item prop="applyTime">
            <el-date-picker
              v-model="queryParams.applyTime"
              style="width: 300px"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="请选择开始时间"
              end-placeholder="请选择结束时间"
            ></el-date-picker>
          </el-form-item>

          <el-form-item prop="contractType">
            <el-select v-model="queryParams.contractType"
              placeholder="合同类型"
              clearable>
              <el-option
                v-for="(item,index) in contractTypeList"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictCode"
                :disabled="item.state === '0'"
              />
            </el-select>
          </el-form-item>

          <el-form-item prop="supplierId">
            <el-select v-model="queryParams.supplierId"
              remote
              clearable
              filterable
              :remote-method="getSupplierList"
              placeholder="供应商">
              <el-option v-for="supplier in supplierList"
                :key="supplier.supplierId"
                :value="supplier.supplierId"
                :label="supplier.supplierName"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="createId">
            <el-select v-model="queryParams.createId"
              remote
              clearable
              filterable
              :remote-method="getUserList"
              placeholder="创建人">
              <el-option
                v-for="item in userList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
          <!--搜索重置-->
          <el-form-item>
            <el-button type="primary"
              icon="el-icon-search"
              @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh"
              @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!--      按钮-->
      <el-col :span="6">
        <el-form>
          <!--       新建 -->
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addFiles"
            v-hasPermi="['pms:contract:add']"
          >新建
          </el-button>
          <!--        导出-->
          <el-button
            type="primary"
            icon="el-icon-download"
            @click="exportContract"
            v-hasPermi="['pms:contract:export']"
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
        :class="{ 'type-active': activeFilterIndex === index }"
        @click="setActiveFilter(item,index)"
      >
        {{ item.label }}
      </el-button>
    </el-row>
    <!--    查询表格-->
    <el-table v-loading="loading"
      :data="filteredData"
              v-hasPermi="['pms:contract:list']"
      style="width: 100%">
      <el-table-column type="index"
        label="序号"></el-table-column>
      <el-table-column prop="contractRecordCode"
        label="合同系统编号"></el-table-column>
      <el-table-column prop="contractCode"
        label="合同编号"></el-table-column>
      <el-table-column prop="contractType"
        label="合同类型">
        <template slot-scope="scope">
          <span>{{ scope.row.contractType === 1? '采购合同' : '框架合同' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="contractName"
        label="合同名称"></el-table-column>
      <el-table-column prop="supplierName"
        label="供应商"></el-table-column>
      <el-table-column prop="contractAmount"
        label="合同金额"></el-table-column>
      <el-table-column prop="signingDate"
        label="签订日期"></el-table-column>
      <el-table-column prop="contractStatus"
        label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.contractStatus === 0" style="color: #f59b22; font-weight: bold;">待审核</span>
          <span v-if="scope.row.contractStatus === 1" style="color: #f59b22; font-weight: bold;">审核中</span>
          <span v-if="scope.row.contractStatus === 2" style="color: #000000; font-weight: bold;">审核不通过</span>
          <span v-if="scope.row.contractStatus === 3" style="color: #70b503; font-weight: bold;">启用</span>
          <span v-if="scope.row.contractStatus === 4" >已撤回</span>
          <span v-if="scope.row.contractStatus === 5" style="color: #d8001b; font-weight: bold;">停用</span>
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
      @pagination="getContractFiles"
    />

    <!--    详情弹框-->
    <el-dialog :visible="dialogDetailsContractDialog"
      :title="detailsContractTitle"
      width="75%"
      @close="closeContractDialog">
      <template v-slot:title>
        <div style="font-weight: bold;font-size: 15px">{{ detailsContractTitle }}</div>
      </template>
      <template class="templateDialogStyle">
        <el-tabs v-model="activeContractTab"
          @tab-click="handleContractTabClick">
          <el-tab-pane
            v-for="tab in tabsContract"
            :key="tab.name"
            :label="tab.label"
            :name="tab.name">
            <!-- 使用组件作为标签页内容 -->
            <component :is="tab.component"
              :contractId="contractId"
              @closeDetail="closeContractDialog"></component>
          </el-tab-pane>
        </el-tabs>
        <div class="tabStatus">
          <span v-if="contractStatus === 0" style="color: #f59b22; font-weight: bold;">待审核</span>
          <span v-if="contractStatus === 1" style="color: #f59b22; font-weight: bold;">审核中</span>
          <span v-if="contractStatus === 2" style="color: #000000; font-weight: bold;">审核不通过</span>
          <span v-if="contractStatus === 3" style="color: #70b503; font-weight: bold;">启用</span>
          <span v-if="contractStatus === 4" style="color: black; font-weight: bold;">已撤回</span>
          <span v-if="contractStatus === 5" style="color: #d8001b; font-weight: bold;">停用</span>
        </div>
      </template>
    </el-dialog>

    <!--    新建弹框-->
    <contract-files :dialogContractFilesFiles="dialogContractFilesFiles"
      @closeAddFiles="closeAddFiles"></contract-files>
  </div>
</template>

<script>
import contractFiles from "@/common/contractFiles/contractFiles";

import managerAuditInfo from "@/common/contractManager/managerAuditInfo";
import managerInfo from "@/common/contractManager/managerInfo";
import managerOperationLog from "@/common/contractManager/managerOperationLog";

import { getContractFileList,getUserList } from '@/api/contractFilesManagement/contractFilesManagement'
import supplierApi from '@/api/supplier/supplier'
import request, { download } from '@/utils/request'
import { getDealtWithList } from '@/api/auditCenter/dealtWith/dealtWith'

export default {
  name: "index",
  components: {
    contractFiles,
  },
  data() {
    return {
      activeContractTab: 'fileInfo',
      tabsContract: [
        {label: '档案信息', name: 'fileInfo',component:managerInfo },
        {label: '审核信息', name: 'auditInfo',component:managerAuditInfo },
        {label: '操作日志', name: 'operationLog',component:managerOperationLog }
      ],
      // tabName: null,
      //详情信息
      detailsContractTitle: "详情信息",
      //详情信息弹框
      dialogDetailsContractDialog: false,

      dialogContractFilesFiles: false,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 查询参数
      queryParams: {
        key:"",
        applyTime:"",
        contractType:"",
        supplierId:'',
        createId:'',
        contractStatus:"",
        //分页
        total: 10,
        page: 1,
        limit: 10,
      },
      //供应商
      supplierArray: [],
      //创建人
      userList:[],
      //切换按钮
      filters: [
        {label: "全部", value: null},
        {label: "待审核", value: 0},
        {label: "审核中", value: 1},
        {label: "审核不通过", value: 2},
        {label: "已撤回", value: 4},
        {label: "启用", value: 3},
        {label: "停用", value: 5},
      ],
      activeFilterIndex: 0,
      supplierList:[],
      //合同类型
      contractTypeList:[
        // {label:'采购合同',value:1},
        // {label:'框架合同',value:2},
      ],
      tableData: [],
      contractId: null,
      contractStatus: null,
      reviewedId:'', //用户id
    }
  },
  created() {
    let userInfo = window.localStorage.getItem('user')
    let userInfoParse = JSON.parse(userInfo)
    this.reviewedId = userInfoParse.userId
    this.getContractFiles();
    this.getSupplierList();
    this.getUserList();
  },
  computed: {
    filteredData() {
      const activeFilter = this.filters[this.activeFilterIndex];
      if (!activeFilter.status) {
        return this.tableData;
      }
      return this.tableData.filter((item) => item.status === activeFilter.status);
    },
    switchType() {
      return this.filters.map((filter) => {
        return {
          label: filter.label,
          value:filter.value
        }
      })
    },
  },
  methods: {
    getSupplierList(query) {
      let params = {
        codeNameKey: query,
        supplierStatus: 3,
      }
      // 查询供应商下拉列表
      request.post('pms/supplier/getSupplierList',params).then((res) => {
        this.supplierList = res.data
      })
    },
    getUserList(keyword) {
      let params = {
        deptId: this.queryParams.applyDepart,
        nickName: keyword,
        // 用户状态（0正常 1停用）
        status: 0
      }

      request.get('system/user/selectUserList', {
        params
      }).then(res => {
        this.userList = res.rows.map(item => {
          return {
            label: item.nickName,
            value: item.userId
          }
        })
      })
    },

    /*处理标签页信息*/
    handleContractTabClick(tab, event) {

    },
    closeContractDialog(flg) {
      // this.tabName = null;
      this.activeContractTab = "fileInfo";
      this.contractId = null;
      this.contractStatus = null;
      this.dialogDetailsContractDialog = false;
      if (flg) {
        this.handleQuery();
      }
    },
    /*详情*/
    handleDetails(row) {
      this.contractId = row.contractId;
      this.contractStatus = row.contractStatus;
      this.dialogDetailsContractDialog = true;
    },
    /*查询列表内容*/
    getContractFiles() {
      let params = {
        key:this.queryParams.key,
        startDate:this.queryParams.applyTime?.[0],
        endDate:this.queryParams.applyTime?.[1],
        contractType:this.queryParams.contractType,
        supplierId:this.queryParams.supplierId,
        createId:this.queryParams.createId,
        pageNum: this.queryParams.page,
        pageSize: this.queryParams.limit,
        contractStatus:this.queryParams.contractStatus,
      };

      getContractFileList(params).then(res=>{
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
    /*搜索查询*/
    handleQuery() {
      this.queryParams.page = 1;
      this.getContractFiles();
    },
    /*重置*/
    resetQuery() {
      this.$refs.queryForm.resetFields();
      this.getContractFiles();
    },
    /*切换按钮查询列表*/
    setActiveFilter(row,index) {
      this.queryParams.contractStatus = row.value;
      this.getContractFiles();
      this.activeFilterIndex = index;
    },
    /*新增表单*/
    addFiles() {
      this.dialogContractFilesFiles = true;
    },
    closeAddFiles(flg) {
      this.dialogContractFilesFiles = false;
      if (flg) {
        this.handleQuery();
      }
    },
    exportContract() {
      download(`/pms/contract/export`,this.queryParams,`合同档案信息-${new Date().getTime()}.xlsx`)
    }
  }
}
</script>

<style scoped>
.type-active {
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
  top: 90px;
  left: 300px;
  width: 80px;
  height: 20px;
  text-align: center;
  color: #F79B22;
}
>>>.el-tabs__content{
  height:450px;
  overflow-y: auto;
}
</style>
