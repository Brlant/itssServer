<template>
  <div class="app-container">
    <el-row>
      <!--      输入框-->
      <el-col :span="18">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
          <!--      订单编号-->
          <el-form-item prop="num">
            <el-input
              prefix-icon="el-icon-search"
              v-model="queryParams.num"
              placeholder="订单编号"
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
          <!--      申请部门-->
          <el-form-item prop="house_id">
            <el-select v-model="queryParams.house_id" placeholder="申请部门" clearable>
              <el-option
                v-for="u in supplierArray"
                :key="u.value"
                :label="u.label"
                :value="u.value"
              />
            </el-select>
          </el-form-item>
          <!--      申请人-->
          <el-form-item prop="house_id">
            <el-select v-model="queryParams.house_id" placeholder="申请人" clearable>
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
            @click="addEntryForm"
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
      <el-table-column prop="name" label="订单编号"></el-table-column>
      <el-table-column prop="orderType" label="订单类型"></el-table-column>
      <el-table-column prop="orderItems" label="订单物品"></el-table-column>
      <el-table-column prop="applicant" label="申请人"></el-table-column>
      <el-table-column prop="applicationDepartment" label="申请部门"></el-table-column>
      <el-table-column prop="applicationDate" label="申请日期"></el-table-column>
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
      @pagination="getWareHousingEntry"
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
    <!--    新增弹框信息-->
    <ware-house-entry :dialogAddEntry="dialogAddEntry" @handleEntryClose="handleEntryClose"></ware-house-entry>
  </div>
</template>

<script>
import wareHouseEntry from "@/common/wareHouseEntry/wareHouseEntry";

import entryAuditInfo from "@/common/entryForm/entryAuditInfo";
import entryInfo from "@/common/entryForm/entryInfo";
import entryOperationLog from "@/common/entryForm/entryOperationLog";

export default {
  name: "index",
  components: {
    wareHouseEntry,
  },
  data() {
    return {
      activeTab: 'fileInfo',
      tabs: [
        {label: '档案信息', name: 'fileInfo', component: entryInfo},
        {label: '审核信息', name: 'auditInfo', component: entryAuditInfo},
        {label: '操作日志', name: 'operationLog', component: entryOperationLog}
      ],
      tabName: null,
      //详情信息
      detailsTitle: "详情信息",
      //详情信息弹框
      dialogDetailsProcessDialog: false,


      //新建弹框
      dialogAddEntry: false,
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
        {text: "审核不通过", status: "rejected"},
        {text: "待收货", status: "processing"},
        {text: "已完成", status: "enabled"},
        {text: "已取消", status: "disabled"},
      ],
      activeFilterIndex: 0,
      tableData: [
        {
          name: "项目A",
          orderType: "国有",
          orderItems: "私有",
          applicant: "郑浩",
          applicationDepartment: "研发部",
          applicationDate: "2023/12/07",
          status: "pending"
        },
        {
          name: "项目B",
          orderType: "国有",
          orderItems: "私有",
          applicant: "郑浩",
          applicationDepartment: "研发部",
          applicationDate: "2023/12/07",
          status: "processing"
        },
        {
          name: "项目C",
          orderType: "国有",
          orderItems: "私有",
          applicant: "郑浩",
          applicationDepartment: "研发部",
          applicationDate: "2023/12/07",
          status: "rejected"
        },
        {
          name: "项目D",
          orderType: "国有",
          orderItems: "私有",
          applicant: "郑浩",
          applicationDepartment: "研发部",
          applicationDate: "2023/12/07",
          status: "revoked"
        },
        {
          name: "项目E",
          orderType: "国有",
          orderItems: "私有",
          applicant: "郑浩",
          applicationDepartment: "研发部",
          applicationDate: "2023/12/07",
          status: "enabled"
        },
        {
          name: "项目F",
          orderType: "国有",
          orderItems: "私有",
          applicant: "郑浩",
          applicationDepartment: "研发部",
          applicationDate: "2023/12/07",
          status: "disabled"
        },
        {
          name: "项目G",
          orderType: "国有",
          orderItems: "私有",
          applicant: "郑浩",
          applicationDepartment: "研发部",
          applicationDate: "2023/12/07",
          status: "obsolete"
        },
      ],
    }
  },
  created() {
    this.getWareHousingEntry();
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
    /*查询列表内容*/
    getWareHousingEntry() {
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
    /*新建表单*/
    addEntryForm() {
      this.dialogAddEntry = true;
    },
    /*关闭表单*/
    handleEntryClose() {
      this.dialogAddEntry = false;
    },
    /*详情*/
    handleDetails(row) {
      this.dialogDetailsProcessDialog = true;
    },
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
