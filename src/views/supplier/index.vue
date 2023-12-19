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
        <!-- 新建 -->
        <el-button
          type="primary"
          @click="supplierAdd"
          icon="el-icon-plus"
        >
          新建
        </el-button>
        <!-- 导入新建/修改-->
        <el-button
          type="primary"
          icon="el-icon-upload2"
          @click="supplierImport"
        >
          导入新建/修改
        </el-button>
        <!--        导出-->
        <el-button
          type="primary"
          icon="el-icon-download"
          @click="exportSupplier"
        >
          导出
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
        <template v-slot="scope">
          <span v-if="scope.row.supplierType === 1">内部企业</span>
          <span v-if="scope.row.supplierType === 2">外部企业</span>
        </template>
      </el-table-column>
      <el-table-column prop="contactsName" label="联系人"></el-table-column>
      <el-table-column prop="contactsPhone" label="手机号"></el-table-column>
      <el-table-column prop="createTime" label="创建时间">
        <template v-slot="scope">
          {{ new Date(scope.row.createTime).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column prop="validityDate" label="供应商到期时间">
        <template v-slot="scope">
          {{ scope.row.validityDate }}
        </template>
      </el-table-column>

      <el-table-column prop="supplierStatus" label="状态">
        <template v-slot="scope">
          <span v-if="scope.row.supplierStatus === 0" style="color: #F79B22">待审核</span>
          <span v-if="scope.row.supplierStatus === 1" style="color: #F79B22">审核中</span>
          <span v-if="scope.row.supplierStatus === 2" style="color: black">审核未通过</span>
          <span v-if="scope.row.supplierStatus === 3" style="color: green">启用</span>
          <span v-if="scope.row.supplierStatus === 4" style="color: black">已撤回</span>
          <span v-if="scope.row.supplierStatus === 5" style="color: red">停用</span>
          <span v-if="scope.row.supplierStatus === 6" style="color: black">已淘汰</span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作">
        <template v-slot="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-data"
            @click="handleDetails(scope.row)"
          >详情
          </el-button>
          <!--          <el-button v-has-permi="['pms:supplier:edit']"-->
          <!--                     size="mini"-->
          <!--                     type="text"-->
          <!--                     icon="el-icon-edit"-->
          <!--                     @click="supplierEdit(scope.row)"-->
          <!--          >编辑-->
          <!--          </el-button>-->
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

    <!--    新增/编辑弹框信息-->
    <supplier-form :form-title="supplierFormData.formTitle"
                   :show-flag="supplierFormData.showFlag"
                   :supplier-id="supplierFormData.supplierId"
                   @close="closeSupplierForm"
    />
    <!--详情-->
    <el-dialog :visible="dialogDetailsSupplierDialog" :title="detailsTitle" width="75%" @close="closeDetailDialog">
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
          <supplier-info :supplier-data="detailsSupplierData"></supplier-info>
        </el-tab-pane>
        <el-tab-pane label="审核信息" name="auditInfo">
          <supplier-audit-info :supplierId="supplierId"></supplier-audit-info>
        </el-tab-pane>
        <el-tab-pane label="操作日志" name="operationLog">
          <supplier-operation-log :supplierId="supplierId"></supplier-operation-log>
        </el-tab-pane>
      </el-tabs>

    </el-dialog>

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
                   :show-file-list="false"
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
import supplierApi from '@/api/supplier/supplier'
import supplierForm from '@/common/supplier/supplierForm'
import supplierAuditInfo from '@/common/supplierDetails/supplierAuditInfo'
import supplierInfo from '@/common/supplierDetails/supplierInfo'
import supplierOperationLog from '@/common/supplierDetails/supplierOperationLog'

export default {
  name: 'index',
  components: {
    supplierForm,
    supplierAuditInfo,
    supplierInfo,
    supplierOperationLog
  },
  data() {
    return {
      // 详情页展示的tab
      activeTab: 'fileInfo',
      // tabs: [
      //   {label: '档案信息', name: 'fileInfo', component: supplierInfo},
      //   {label: '审核信息', name: 'auditInfo', component: supplierAuditInfo},
      //   {label: '操作日志', name: 'operationLog', component: supplierOperationLog}
      // ],
      tabName: null,
      dialogDetailsSupplierDialog: false,//详情弹框
      //详情信息
      detailsTitle: '详情信息',
      detailsSupplierData: {},
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 查询参数
      queryParams: {
        codeNameKey: '',
        contacts: '',
        supplierType: '',
        days: '',
        supplierStatus: '',
        total: 10,
        pageNum: 1,
        pageSize: 10
      },
      //企业类型
      supplierTypeArray: [
        {label: '内部企业', value: 1},
        {label: '外部企业', value: 2}
      ],
      //切换按钮
      filtersMenu: [
        {text: '全部', value: null},
        {text: '近30天', value: '30'},
        {text: '近7天', value: '7'}
      ],
      //切换按钮
      filters: [
        {text: '全部', value: ''},
        {text: '待审核', value: 0},
        {text: '审核中', value: 1},
        {text: '审核未通过', value: 2},
        {text: '启用', value: 3},
        {text: '已撤回', value: 4},
        {text: '停用', value: 5},
        {text: '已淘汰', value: 6}
      ],
      activeFilterIndex: 0,
      activeFilterMenuIndex: 0,
      tableData: [],
      // 档案新增/编辑的数据
      supplierFormData: {
        formTitle: '新建档案',
        showFlag: false,
        supplierId: '',
      },
      // 导入的对话框
      supplierImportDialog: {
        showFlag: false
      }
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
    },
    importSupplierAction() {
      return supplierApi.importSupplierUrl
    },
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
    }
  },
  methods: {
    closeDetailDialog() {
      this.activeTab = 'fileInfo'
      this.dialogDetailsSupplierDialog = false
      this.detailsSupplierData = null
    },
    // 打开新增/编辑弹框
    showSupplierForm() {
      this.supplierFormData.showFlag = true
    },
    // 关闭新增/编辑弹框
    closeSupplierForm() {
      this.supplierFormData.showFlag = false
    },
    /**供应商列表查询*/
    getSupplierList() {
      // let params = {
      //   codeNameKey: this.queryParams.codeNameKey,
      //   contacts: this.queryParams.contacts,
      //   supplierType: this.queryParams.supplierType,
      //   days: this.queryParams.days,
      //   supplierStatus: this.queryParams.supplierStatus,
      //   pageNum: this.queryParams.pageNum,
      //   pageSize: this.queryParams.pageSize
      // }

      this.loading = true
      supplierApi.getSupplierList(this.queryParams).then((res) => {
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
    setActiveFilter(row, index) {
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
      this.detailsSupplierData = null
      supplierApi.getSupplierDetails(row.supplierId).then((res) => {
        this.detailsSupplierData = res.data
        this.tabName = '1'
        this.dialogDetailsSupplierDialog = true
      })
    },
    /*新增*/
    supplierAdd(row) {
      this.supplierFormData = {
        formTitle: '新建档案',
        showFlag: true,
        supplierId: '',
      }
    }, /*编辑*/
    supplierEdit(row) {
      this.supplierFormData = {
        formTitle: '编辑档案',
        showFlag: true,
        supplierId: row.supplierId,
      }
    },
    exportSupplier() {
      supplierApi.exportSupplier(this.queryParams).then()
    },
    downloadTemplate() {
      supplierApi.downloadTemplate().then()
    },
    // 供应商导入
    supplierImport() {
      this.supplierImportDialog = {
        showFlag: true,
        title: '导入'
      }
    },
    closeSupplierImportDialog() {
      this.supplierImportDialog.showFlag = false
    },
    /*处理标签页信息*/
    handleTabClick(tab, event) {
      console.log(tab)
    },
    importSuccessHandler(file) {

      let formData = new FormData()
      formData.append('file', file.raw)
      supplierApi.importSupplier(formData).then((res) => {
        this.$message({
          type: 'success',
          message: '导入成功'
        })
        this.getSupplierList()
      })
      //
      // if (res.code === 200) {
      //   this.$message({
      //     type:'success',
      //     message: '导入成功'
      //   })
      //   // 导入成功以后，需要重新获取列表
      //   this.getSupplierList()
      // }
    },
    importErrorHandler(err, file) {
      console.log(err)
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
  top: 10px;
  left: 300px;
  width: 80px;
  height: 20px;
  text-align: center;
  color: #F79B22;
}

.tabBtn {
  position: fixed;
  top: 90px;
  left: 300px;
  width: 80px;
  height: 20px;
  text-align: center;
  color: #F79B22;
  float: right;
}

.CentralSearch {
  display: flex
}
</style>
