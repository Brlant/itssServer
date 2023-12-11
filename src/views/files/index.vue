<template>
  <div class="app-container">
    <!--    搜索-->
    <el-row>
      <!--      搜索内容-->
      <el-col :span="16">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
          <!--      物品编号/名称-->
          <el-form-item prop="num">
            <el-input
              prefix-icon="el-icon-search"
              v-model="queryParams.num"
              placeholder="物品编号/名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <!--      物品类型-->
          <el-form-item prop="house_id">
            <el-select v-model="queryParams.house_id" placeholder="物品类型" clearable>
              <el-option
                v-for="u in itemType"
                :key="u.value"
                :label="u.label"
                :value="u.value"
              />
            </el-select>
          </el-form-item>
          <!--      供应商-->
          <el-form-item prop="house_id">
            <el-select v-model="queryParams.house_id" placeholder="供应商" clearable>
              <el-option
                v-for="u in itemType"
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
      <!--      新建导出-->
      <el-col :span="8">
        <el-form>
          <!--       新建 -->
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addFilesForm"
          >新建
          </el-button>
          <!--        导入新建/修改-->
          <el-button
            type="primary"
            icon="el-icon-upload2"
          >导入新建/修改
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
      <el-table-column prop="name" label="供应商名称"></el-table-column>
      <el-table-column prop="supplierNo" label="供应商编号"></el-table-column>
      <el-table-column prop="enterpriseType" label="企业类型"></el-table-column>
      <el-table-column prop="contacts" label="联系人"></el-table-column>
      <el-table-column prop="cellphoneNumber" label="手机号"></el-table-column>
      <el-table-column prop="" label="创建时间"></el-table-column>
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
      @pagination="getFilesList"
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
    <!--    新建弹框内容-->
    <files-form :dialogAddFiles="dialogAddFiles" @closeAddFiles="closeAddFiles"></files-form>
  </div>
</template>

<script>
//物品档案管理页面
import filesForm from "@/common/Files/filesForm";
import fileAuditInfo from "@/common/fileManager/fileAuditInfo";
import fileManagerInfo from "@/common/fileManager/fileManagerInfo";
import fileOperationLog from "@/common/fileManager/fileOperationLog";

export default {
  name: "index",
  components: {
    filesForm,
  },
  data() {
    return {
      activeTab: 'fileInfo',
      tabs: [
        {label: '档案信息', name: 'fileInfo', component: fileManagerInfo},
        {label: '审核信息', name: 'auditInfo', component: fileAuditInfo},
        {label: '操作日志', name: 'operationLog', component: fileOperationLog}
      ],
      tabName: null,
      //详情信息
      detailsTitle: "详情信息",
      //详情信息弹框
      dialogDetailsProcessDialog: false,
      // 遮罩层
      loading: true,
      // 查询参数
      queryParams: {},
      // 显示搜索条件
      showSearch: true,
      //物品类型
      itemType: [],
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
        {text: "审核未通过", status: "rejected"},
        {text: "已撤回", status: "revoked"},
        {text: "启用", status: "enabled"},
        {text: "停用", status: "disabled"},
        {text: "已淘汰", status: "obsolete"},
      ],
      activeFilterIndex: 0,
      tableData: [
        {
          name: "项目A",
          supplierNo: 1,
          enterpriseType: "国营",
          contacts: "小王",
          cellphoneNumber: '18855162653',
          status: "pending"
        },
        {
          name: "项目B",
          supplierNo: 2,
          enterpriseType: "国营",
          contacts: "小王",
          cellphoneNumber: '18855162653',
          status: "processing"
        },
        {
          name: "项目C",
          supplierNo: 3,
          enterpriseType: "国营",
          contacts: "小王",
          cellphoneNumber: '18855162653',
          status: "rejected"
        },
        {
          name: "项目D",
          supplierNo: 4,
          enterpriseType: "国营",
          contacts: "小王",
          cellphoneNumber: '18855162653',
          status: "revoked"
        },
        {
          name: "项目E",
          supplierNo: 5,
          enterpriseType: "国营",
          contacts: "小王",
          cellphoneNumber: '18855162653',
          status: "enabled"
        },
        {
          name: "项目F",
          supplierNo: 6,
          enterpriseType: "国营",
          contacts: "小王",
          cellphoneNumber: '18855162653',
          status: "disabled"
        },
        {
          name: "项目G",
          supplierNo: 7,
          enterpriseType: "国营",
          contacts: "小王",
          cellphoneNumber: '18855162653',
          status: "obsolete"
        },
      ],
      dialogAddFiles: false,//弹出新建框
    }
  },
  created() {
    this.getFilesList();
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
    closeDialog() {
      this.tabName = null;
      this.activeTab = "fileInfo";
      this.dialogDetailsProcessDialog = false;
    },
    /*获取查询列表*/
    getFilesList() {
      let params = {};
      this.loading = false;
    },
    /*搜索按钮设置*/
    handleQuery() {

    },
    /*重置按钮*/
    resetQuery() {

    },
    /*切换按钮查询列表*/
    setActiveFilter(index) {
      this.activeFilterIndex = index;
    },
    /*新建物品档案管理*/
    addFilesForm() {
      this.dialogAddFiles = true;
    },
    /*关闭弹框*/
    closeAddFiles() {
      this.dialogAddFiles = false;
    },
    /*详情弹框*/
    handleDetails(row) {
      this.dialogDetailsProcessDialog = true
    },
    /*处理标签页信息*/
    handleTabClick(tab, event) {

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

