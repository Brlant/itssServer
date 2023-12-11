<template>
  <div class="app-container">
    <el-row>
      <!--      输入框-->
      <el-col :span="18">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
          <!--      合同编号-->
          <el-form-item prop="num">
            <el-input
              prefix-icon="el-icon-search"
              v-model="queryParams.num"
              placeholder="合同编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <!--     时间搜索 -->
          <el-form-item prop="recv_time">
            <el-date-picker
              v-model="queryParams.recv_time"
              style="width: 300px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="请选择开始时间"
              end-placeholder="请选择结束时间"
            ></el-date-picker>
          </el-form-item>
          <!--      供应商-->
          <el-form-item prop="house_id">
            <el-select v-model="queryParams.house_id" placeholder="供应商" clearable>
              <el-option
                v-for="u in supplierArray"
                :key="u.value"
                :label="u.label"
                :value="u.value"
              />
            </el-select>
          </el-form-item>
          <!--搜索重置-->
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
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
          >新建
          </el-button>
          <!--        导出-->
          <el-button
            type="primary"
            icon="el-icon-download"
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
        @click="setActiveFilter(index)"
      >
        {{ item.text }}
      </el-button>
    </el-row>
    <!--    查询表格-->
    <el-table v-loading="loading" :data="filteredData" style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="name" label="合同编号"></el-table-column>
      <el-table-column prop="contractType" label="合同类型"></el-table-column>
      <el-table-column prop="contractName" label="合同名称"></el-table-column>
      <el-table-column prop="supplier" label="供应商"></el-table-column>
      <el-table-column prop="contractMoney" label="合同金额"></el-table-column>
      <el-table-column prop="contractTime" label="签订日期"></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
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
      v-show="pageParams.total>0"
      :total="pageParams.total"
      :page.sync="pageParams.page"
      :limit.sync="pageParams.limit"
      @pagination="getContractFiles"
    />

    <!--    详情弹框-->
    <el-dialog :visible="dialogDetailsProcessDialog" :title="detailsTitle" width="75%" @close="closeDialog">
      <template v-slot:title>
        <div style="font-weight: bold;font-size: 15px">{{ detailsTitle }}</div>
      </template>
      <template class="templateDialogStyle">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
          <el-tab-pane
            v-for="tab in tabs"
            :key="tab.name"
            :label="tab.label"
            :name="tab.name">
            <!-- 使用组件作为标签页内容 -->
            <component :is="tab.component" :tabName="tabName"></component>
          </el-tab-pane>
        </el-tabs>
        <div class="tabStatus">
          状态
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary">确定</el-button>
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

export default {
  name: "index",
  components: {
    contractFiles,
  },
  data() {
    return {
      activeTab: 'fileInfo',
      tabs: [
        {label: '档案信息', name: 'fileInfo',component:managerInfo },
        {label: '审核信息', name: 'auditInfo',component:managerAuditInfo },
        {label: '操作日志', name: 'operationLog',component:managerOperationLog }
      ],
      tabName: null,
      //详情信息
      detailsTitle: "详情信息",
      //详情信息弹框
      dialogDetailsProcessDialog: false,

      dialogContractFilesFiles: false,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 查询参数
      queryParams: {},
      //供应商
      supplierArray: [],
      //翻页参数
      pageParams: {
        total: 10,
        page: 1,
        limit: 10,
        order: "id desc",
      },
      //切换按钮
      filters: [
        {text: "全部", status: null},
        {text: "待审核", status: "pending"},
        {text: "审核中", status: "processing"},
        {text: "审核不通过", status: "rejected"},
        {text: "启用", status: "enabled"},
        {text: "停用", status: "disabled"},
      ],
      activeFilterIndex: 0,
      tableData: [
        {
          name: "项目A",
          contractType: "平常",
          contractName: "三方",
          supplier: "国药",
          contractMoney: "100",
          contractTime: "2023/12/07",
          status: "pending"
        },
        {
          name: "项目B",
          contractType: "平常",
          contractName: "三方",
          supplier: "国药",
          contractMoney: "100",
          contractTime: "2023/12/07",
          status: "processing"
        },
        {
          name: "项目C",
          contractType: "平常",
          contractName: "三方",
          supplier: "国药",
          contractMoney: "100",
          contractTime: "2023/12/07",
          status: "rejected"
        },
        {
          name: "项目D",
          contractType: "平常",
          contractName: "三方",
          supplier: "国药",
          contractMoney: "100",
          contractTime: "2023/12/07",
          status: "revoked"
        },
        {
          name: "项目E",
          contractType: "平常",
          contractName: "三方",
          supplier: "国药",
          contractMoney: "100",
          contractTime: "2023/12/07",
          status: "enabled"
        },
        {
          name: "项目F",
          contractType: "平常",
          contractName: "三方",
          supplier: "国药",
          contractMoney: "100",
          contractTime: "2023/12/07",
          status: "disabled"
        },
        {
          name: "项目G",
          contractType: "平常",
          contractName: "三方",
          supplier: "国药",
          contractMoney: "100",
          contractTime: "2023/12/07",
          status: "obsolete"
        },
      ],
    }
  },
  created() {
    this.getContractFiles();
  },
  mounted() {

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
          text: filter.text,
        }
      })
    },
  },
  methods: {
    /*处理标签页信息*/
    handleTabClick(tab, event) {

    },
    closeDialog() {
      this.tabName = null;
      this.activeTab = "fileInfo";
      this.dialogDetailsProcessDialog = false;
    },
    /*详情*/
    handleDetails(row) {
      this.dialogDetailsProcessDialog = true;
    },
    /*查询列表内容*/
    getContractFiles() {
      let params = {};
      this.loading = false;
    },
    /*搜索查询*/
    handleQuery() {

    },
    /*重置*/
    resetQuery() {

    },
    /*切换按钮查询列表*/
    setActiveFilter(index) {
      this.activeFilterIndex = index;
    },
    /*新增表单*/
    addFiles() {
      this.dialogContractFilesFiles = true;
    },
    closeAddFiles() {
      this.dialogContractFilesFiles = false;
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
  top: 90px;
  left: 300px;
  width: 80px;
  height: 20px;
  text-align: center;
  color: #F79B22;
}
</style>
