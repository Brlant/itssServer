<template>
  <div class="app-container">
    <el-row>
      <!--      搜索内容-->
      <el-col :span="12">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px"
        >
          <!--      供应商编号/名称-->
          <el-form-item prop="codeNameKey">
            <el-input
              prefix-icon="el-icon-search"
              v-model="queryParams.codeNameKey"
              placeholder="供应商编号/名称"
              clearable
              @keyup.enter.native="getSupplierList"
            />
          </el-form-item>
          <!--      联系人/手机号搜索-->
          <el-form-item prop="contacts">
            <el-input
              prefix-icon="el-icon-search"
              v-model="queryParams.contacts"
              placeholder="联系人/手机号搜索"
              clearable
              @keyup.enter.native="getSupplierList"
            />
          </el-form-item>
          <!--      企业类型-->
          <el-form-item prop="supplierType">
            <el-select v-model="queryParams.supplierType" placeholder="企业类型" clearable>
              <el-option
                v-for="(item,index) in supplierTypeArray"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <!--搜索重置-->
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getSupplierList">搜索</el-button>
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
              @click="setActiveFilterMenu(item,index)"
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
        @click="setActiveFilter(item,index)"
      >
        {{ item.text }}
      </el-button>
    </el-row>
    <!--    查询表格-->
    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="supplierName" label="供应商名称"></el-table-column>
      <el-table-column prop="supplierCode" label="供应商编号"></el-table-column>
      <el-table-column prop="supplierType" label="企业类型">
        <template slot-scope="scope">
          <span v-if="scope.row.supplierType === 1">内部企业</span>
          <span v-if="scope.row.supplierType === 2">外部企业</span>
        </template>
      </el-table-column>
      <el-table-column prop="contactsName" label="联系人"></el-table-column>
      <el-table-column prop="contactsPhone" label="手机号"></el-table-column>
      <el-table-column prop="createTime" label="创建时间">
        <template  slot-scope="scope">
          {{new Date(scope.row.createTime).toLocaleString()}}
        </template>
      </el-table-column>
      <el-table-column prop="validityDate" label="供应商到期时间">
        <template  slot-scope="scope">
          {{scope.row.validityDate}}
        </template>
      </el-table-column>

      <el-table-column prop="supplierStatus" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.supplierStatus === ''">全部</span>
          <span v-if="scope.row.supplierStatus === 0">待审核</span>
          <span v-if="scope.row.supplierStatus === 1">审核中</span>
          <span v-if="scope.row.supplierStatus === 2">审核未通过</span>
          <span v-if="scope.row.supplierStatus === 3">启用</span>
          <span v-if="scope.row.supplierStatus === 4">已撤回</span>
          <span v-if="scope.row.supplierStatus === 5">停用</span>
          <span v-if="scope.row.supplierStatus === 6">已淘汰</span>
        </template>
      </el-table-column>
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
      v-show="queryParams.total>0"
      :total="queryParams.total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getSupplierList"
    />


    <!--    新增弹框信息-->
    <supplier-form :dialogAddSupplier="dialogAddSupplierDialog"
                   @handleSupplierClose="handleSupplierClose"
    ></supplier-form>
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
            :name="tab.name"
          >
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
import { getSupplierList } from '@/api/supplier/supplier'
import supplierForm from '@/common/supplier/supplierForm'
import supplierAuditInfo from '@/common/supplierDetails/supplierAuditInfo'
import supplierInfo from '@/common/supplierDetails/supplierInfo'
import supplierOperationLog from '@/common/supplierDetails/supplierOperationLog'

export default {
  name: 'index',
  components: {
    supplierForm
  },
  data() {
    return {
      activeTab: 'fileInfo',
      tabs: [
        { label: '档案信息', name: 'fileInfo', component: supplierInfo },
        { label: '审核信息', name: 'auditInfo', component: supplierAuditInfo },
        { label: '操作日志', name: 'operationLog', component: supplierOperationLog }
      ],
      tabName: null,
      dialogDetailsSupplierDialog: false,//详情弹框
      //详情信息
      detailsTitle: '详情信息',
      dialogAddSupplierDialog: false,//新建弹出框
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 查询参数
      queryParams: {
        codeNameKey: '',
        contacts: '',
        supplierType: '',
        days:'',
        supplierStatus:'',
        total: 10,
        pageNum: 1,
        pageSize: 10
      },
      //企业类型
      enterpriseType: [],

      supplierTypeArray: [
        { label: '内部企业', value: 1 },
        { label: '外部企业', value: 2 }
      ],
      //切换按钮
      filtersMenu: [
        { text: '全部', value: null },
        { text: '近30天', value: '30' },
        { text: '近7天', value: '7' }
      ],
      //切换按钮
      filters: [
        { text: '全部', value: '' },
        { text: '待审核', value: 0 },
        { text: '审核中', value: 1 },
        { text: '审核未通过', value: 2 },
        { text: '启用', value: 3 },
        { text: '已撤回', value: 4 },
        { text: '停用', value: 5 },
        { text: '已淘汰', value: 6 }
      ],
      activeFilterIndex: 0,
      activeFilterMenuIndex: 0,
      tableData: [],

    }
  },
  created() {

  },
  mounted() {
    this.getSupplierList()
  },
  computed: {
    switchMenu() {
      return this.filtersMenu.map((menu) => {
        return {
          text: menu.text,
          value: menu.value
        }
      })
    },

    switchType() {
      return this.filters.map((filter) => {
        return {
          text: filter.text,
          value: filter.value
        }
      })
    }
  },
  methods: {
    closeDialog() {
      this.tabName = null
      this.activeTab = 'fileInfo'
      this.dialogDetailsSupplierDialog = false
    },
    handleAddForm() {
      this.dialogAddSupplierDialog = true
    },
    handleSupplierClose() {
      this.dialogAddSupplierDialog = false
    },
    /*供应商列表查询*/
    getSupplierList() {
      let params = {
        codeNameKey: this.queryParams.codeNameKey,
        contacts: this.queryParams.contacts,
        supplierType: this.queryParams.supplierType,
        days: this.queryParams.days,
        supplierStatus: this.queryParams.supplierStatus,
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize
      }
      getSupplierList(params).then((res) => {
        this.loading = false
        this.queryParams.total = res.data.total
        this.tableData = res.data.rows
      })
    },
    /*重置搜索内容*/
    resetQuery() {
      this.$refs.queryForm.resetFields();
      this.getSupplierList();
    },
    /*按钮切换*/
    setActiveFilter(row,index) {
      this.queryParams.supplierStatus = row.value
      this.activeFilterIndex = index;
      this.getSupplierList();
    },
    setActiveFilterMenu(row, index) {
      this.queryParams.days = row.value
      this.activeFilterMenuIndex = index
      this.getSupplierList();
    },
    /*详情*/
    handleDetails(row) {
      this.tabName = '1',
      this.dialogDetailsSupplierDialog = true
    },
    /*编辑*/
    handleEdit(row) {

    },
    /*删除*/
    handleDelete(row) {

    },
    /*处理标签页信息*/
    handleTabClick(tab, event) {

    }
  }

}
</script>

<style scoped>
.is-active {
  background-color: #3D7DFF;
  color: #fff;
}

.is-active-menu {
  background-color: #3D7DFF;
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
