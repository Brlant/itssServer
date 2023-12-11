<template>
  <div class="app-container">
    <el-row>
      <!--      搜索内容-->
      <el-col :span="12">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
          <!--      供应商编号/名称-->
          <el-form-item prop="num">
            <el-input
              prefix-icon="el-icon-search"
              v-model="queryParams.num"
              placeholder="供应商编号/名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <!--      联系人/手机号搜索-->
          <el-form-item prop="num">
            <el-input
              prefix-icon="el-icon-search"
              v-model="queryParams.num"
              placeholder="联系人/手机号搜索"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <!--      企业类型-->
          <el-form-item prop="house_id">
            <el-select v-model="queryParams.house_id" placeholder="企业类型" clearable>
              <el-option
                v-for="u in enterpriseType"
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
      <el-col :span="6">
        <div class="CentralSearch">
          <el-form>
            <el-form-item label="到期时间"></el-form-item>
          </el-form>
          <el-form>
            <el-button
              v-for="(item,index) in switchMenu"
              :key="index"
              :class="{ 'is-active-menu': activeFilterMenuIndex === index }"
              @click="setActiveFilterMenu(index)"
            >
              {{ item.text }}
            </el-button>
          </el-form>
        </div>

      </el-col>
      <!--      上传内容-->
      <el-col :span="6">
        <!--       新建 -->
        <el-button
          type="primary"
          @click="handleAddForm"
          icon="el-icon-plus"
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
      </el-col>
    </el-row>
    <!--    切换按钮-->
    <el-row class="SwitchTypes">
      <el-button
        class="btnSwitch"
        v-for="(item, index) in switchType"
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
      <el-table-column prop="" label="手机号"></el-table-column>
      <el-table-column prop="" label="创建时间"></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
      <el-table-column prop="" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-data"
            @click="handleDetails(scope.row)"
          >详情
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
          >编辑
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除
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
      @pagination="getSupplierList"
    />


    <!--    新增弹框信息-->
    <supplier-form :dialogAddSupplier="dialogAddSupplierDialog"
                   @handleSupplierClose="handleSupplierClose"></supplier-form>
    <!--详情-->
    <el-dialog :visible="dialogDetailsSupplierDialog" :title="detailsTitle" width="75%" @close="closeDialog">
      <template v-slot:title>
        <div style="font-weight: bold;font-size: 15px">{{ detailsTitle }}</div>
      </template>
      <!--      标签页-->
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
      </template>
    </el-dialog>

  </div>
</template>

<script>
import supplierForm from "@/common/supplier/supplierForm";
import supplierAuditInfo from "@/common/supplierDetails/supplierAuditInfo";
import supplierInfo from "@/common/supplierDetails/supplierInfo";
import supplierOperationLog from "@/common/supplierDetails/supplierOperationLog";

export default {
  name: "index",
  components: {
    supplierForm,
  },
  data() {
    return {
      activeTab: 'fileInfo',
      tabs: [
        {label: '档案信息', name: 'fileInfo',component:supplierInfo},
        {label: '审核信息', name: 'auditInfo',component:supplierAuditInfo},
        {label: '操作日志', name: 'operationLog',component:supplierOperationLog}
      ],
      tabName:null,
      dialogDetailsSupplierDialog: false,//详情弹框
      //详情信息
      detailsTitle: "详情信息",
      dialogAddSupplierDialog: false,//新建弹出框
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 查询参数
      queryParams: {},
      //企业类型
      enterpriseType: [],
      //翻页参数
      pageParams: {
        total: 10,
        page: 1,
        limit: 10,
        order: "id desc",
      },
      //切换按钮
      filtersMenu: [
        {text: "全部", time: null},
        {text: "近30天", time: "30"},
        {text: "近7天", time: "7"},
      ],
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
      activeFilterMenuIndex:0,
      flag:true,

      tableData: [
        {
          name: "项目A",
          supplierNo: 1,
          enterpriseType: "国营",
          contacts: "小王",
          cellphoneNumber: '18855162653',
          status: "pending",
          time:'30',
        },
        {
          name: "项目B",
          supplierNo: 2,
          enterpriseType: "国营",
          contacts: "小王",
          cellphoneNumber: '18855162653',
          status: "processing",
          time:'30',
        },
        {
          name: "项目C",
          supplierNo: 3,
          enterpriseType: "国营",
          contacts: "小王",
          cellphoneNumber: '18855162653',
          status: "rejected",
          time:'30',
        },
        {
          name: "项目D",
          supplierNo: 4,
          enterpriseType: "国营",
          contacts: "小王",
          cellphoneNumber: '18855162653',
          status: "revoked",
          time:'30',
        },
        {
          name: "项目E",
          supplierNo: 5,
          enterpriseType: "国营",
          contacts: "小王",
          cellphoneNumber: '18855162653',
          status: "enabled",
          time:'7',
        },
        {
          time:'7',
          name: "项目F",
          supplierNo: 6,
          enterpriseType: "国营",
          contacts: "小王",
          cellphoneNumber: '18855162653',
          status: "disabled"
        },
        {
          time:'7',
          name: "项目G",
          supplierNo: 7,
          enterpriseType: "国营",
          contacts: "小王",
          cellphoneNumber: '18855162653',
          status: "obsolete"
        },
      ],
    }
  },
  created() {
    this.getSupplierList();
  },
  computed: {
    filteredData() {
      if(this.flag){
        const activeFilter = this.filters[this.activeFilterIndex];
        if (!activeFilter.status) {
          return this.tableData;
        }
        return this.tableData.filter((item) => item.status === activeFilter.status);
      }else{
        const activeFilterMenu = this.filtersMenu[this.activeFilterMenuIndex];
        if (!activeFilterMenu.time) {
          return this.tableData;
        }
        return this.tableData.filter((item) => item.time === activeFilterMenu.time);
      }

    },

    switchMenu() {
      return this.filtersMenu.map((menu) => {
        return {
          text: menu.text,
        }
      })
    },

    switchType() {
      return this.filters.map((filter) => {
        return {
          text: filter.text,
        };
      });
    },
  },
  methods: {
    closeDialog(){
      this.tabName = null;
      this.activeTab = "fileInfo";
      this.dialogDetailsSupplierDialog = false;
    },
    handleAddForm() {
      this.dialogAddSupplierDialog = true;
    },
    handleSupplierClose() {
      this.dialogAddSupplierDialog = false;
    },
    /*供应商列表查询*/
    getSupplierList() {
      let params = {};
      this.loading = false;
    },
    /*搜索按钮操作*/
    handleQuery() {

    },
    /*重置搜索内容*/
    resetQuery() {

    },
    /*按钮切换*/
    setActiveFilter(index) {
      this.flag = true;
      this.activeFilterIndex = index;
    },
    setActiveFilterMenu(index){
      this.flag = false;
      this.activeFilterMenuIndex = index
    },
    /*详情*/
    handleDetails(row) {
      this.tabName="1",
        this.dialogDetailsSupplierDialog = true;
    },
    /*编辑*/
    handleEdit(row) {

    },
    /*删除*/
    handleDelete(row) {

    },
    /*处理标签页信息*/
    handleTabClick(tab, event) {

    },
  },
  mounted() {

  }
}
</script>

<style scoped>
.is-active {
  background-color: #409eff;
  color: #fff;
}
.is-active-menu{
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
.CentralSearch {
  display: flex
}
</style>
