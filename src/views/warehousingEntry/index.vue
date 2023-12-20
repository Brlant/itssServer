<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm">
      <el-row :gutter="20">
        <el-col :span="3">
          <!--      订单编号-->
          <el-form-item prop="pmsOrderNo">
            <el-input
              prefix-icon="el-icon-search"
              v-model="queryParams.pmsOrderNo"
              placeholder="订单编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <!--     时间搜索 -->
          <el-form-item prop="rangeDate">
            <el-date-picker style="width: 100%"
                            v-model="queryParams.rangeDate"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="datetimerange"
                            :default-time="['00:00:00', '23:59:59']"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <!-- 订单类型-->
          <el-form-item prop="orderBizType">
            <el-select v-model="queryParams.orderBizType" placeholder="请选择入库单类型" clearable>
              <el-option
                v-for="item in orderBizTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item prop="paymentFlag">
            <el-select v-model="queryParams.paymentFlag" placeholder="是否已付款" clearable>
              <el-option
                v-for="item in paymentFlags"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item prop="invoiceNum">
            <el-input
              v-model="queryParams.invoiceNum"
              placeholder="发票号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="applyDepart">
            <el-cascader
              v-model="queryParams.applyDepart"
              placeholder="发起部门"
              :options="deptList"
              :props="{ checkStrictly: true,emitPath:false, value: 'id' }"
              clearable filterable
              @change="getUserList"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <!-- 申请人-->
          <el-form-item prop="applyUserId">
            <el-select v-model="queryParams.applyUserId" placeholder="发起人" clearable filterable>
              <el-option
                v-for="item in userList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-col>
        <el-col :span="12">
          <el-form-item class="pull-right">
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="addEntryForm"
            >新建
            </el-button>
            <el-button
              type="primary"
              icon="el-icon-upload2"
              @click="importOrder"
            >
              导入新建/修改
            </el-button>
            <!--        导出-->
            <el-button
              type="primary"
              icon="el-icon-download"
              @click="exportOrder"
            >导出
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item>
            <el-button
              class="btnSwitch"
              v-for="(item,index) in switchType"
              :key="index"
              :class="{ 'is-active': activeFilterIndex === index }"
              @click="setActiveFilter(index)"
            >
              {{ item.text }}
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--    查询表格-->
    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="pmsOrderNo" label="订单编号"></el-table-column>
      <el-table-column prop="orderBizType" label="订单类型">
        <template v-slot="{ row }">
          <span v-if="row.orderBizType === '1-0'">采购入库</span>
          <span v-if="row.orderBizType === '1-2'">盘盈入库</span>
          <span v-if="row.orderBizType === '1-4'">领用入库</span>
        </template>
      </el-table-column>
      <el-table-column prop="orderGoodsNames" label="订单物品"></el-table-column>
      <el-table-column prop="orderTotalAmount" label="订单总金额"></el-table-column>
      <el-table-column prop="applyName" label="发起人"></el-table-column>
      <el-table-column prop="applicationDepartment" label="发起部门"></el-table-column>
      <el-table-column prop="applyDate" label="发起日期"></el-table-column>
      <el-table-column prop="paymentFlag" label="是否已付款"></el-table-column>
      <el-table-column prop="invoiceNum" label="发票号"></el-table-column>
      <el-table-column prop="pmsOrderStatus" label="状态">
        <template v-slot="{ row }">
          <span>{{ filters[row.pmsOrderStatus + 1].text }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
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
    <pagination v-show="pageParams.total > 0"
                :total="pageParams.total"
                :page.sync="pageParams.page"
                :limit.sync="pageParams.limit"
                @pagination="pageHandler"
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

    <el-dialog :visible.sync="importOrderDialogShowFlag" title="导入" width="410px" center>
      <div style="margin-bottom: 22px;">
        <el-button
          type="primary"
          icon="el-icon-download"
          @click="downloadOrderTemplate"
        >
          下载模板
        </el-button>
      </div>

      <div>
        <el-upload drag action="#"
                   :auto-upload="false"
                   :show-file-list="false"
                   :on-change="fileChangeHandler"
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
import wareHouseEntry from "@/common/wareHouseEntry/wareHouseEntry";

import entryAuditInfo from "@/common/entryForm/entryAuditInfo";
import entryInfo from "@/common/entryForm/entryInfo";
import entryOperationLog from "@/common/entryForm/entryOperationLog";

import orderApi from "@/api/pms/order";
import {queryUserlist} from "@/api/system/user";
import {treeselect} from "@/api/system/dept";
import {download} from '@/utils/request'
import supplierApi from '@/api/supplier/supplier'

export default {
  name: "in-order",
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
      importOrderDialogShowFlag: false,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 查询参数
      queryParams: {
        pmsOrderNo: '',
        startDate: "",
        endDate: "",
        applyDepart: '',
        applyUserId: '',
        pmsOrderStatus: '',
        orderBizType: "",
        pageNum: 1,
        pageSize: 20,
        // 订单类型(0-入库；1-出库)
        orderType: '0',
        rangeDate: []
      },
      //供应商
      supplierArray: [],
      //翻页参数
      pageParams: {
        total: 0,
        page: 1,
        limit: 10
      },
      //切换按钮
    //   AUDIT(0, "待审核"),
    // IN_REVIEW(1, "审核中"),
    //   REVIEW_FAILED(2, "审核未通过"),
    //   WAIT_RECEIVE(3, "待收货"),
    //   WITHDRAWN(4, "已撤回"),
    //   CANCELED(5, "已取消"),
    //   ELIMINATED(6, "已淘汰"),
    //   COMPLETED(7, "已完成");
      filters: [
        {text: "全部", status: null},
        {text: "待审核", status: 0},
        {text: "审核中", status: 1},
        {text: "审核未通过", status: 2},
        {text: "待收货", status: 3},
        {text: "已撤回", status: 4},
        {text: "已取消", status: 5},
        {text: "已淘汰", status: 6},
        {text: "已完成", status: 7},
      ],
      activeFilterIndex: 0,
      tableData: [],
      orderBizTypes: [
        {label: '采购入库', value: '1-0'},
        {label: '盘盈入库', value: '1-2'},
        {label: '领用入库', value: '1-4'},
      ],
      paymentFlags: [
        {label: '是', value: 1},
        {label: '否', value: 0},
      ],
      // 发起部门（多层级）
      deptList: [],
      // 发起人，按部门筛选
      userList: []
    }
  },
  created() {
    this.getList()
    this.getDeptList('')
    this.getUserList('')
  },
  mounted() {

  },
  computed: {
    switchType() {
      return this.filters.map((filter) => {
        return {
          text: filter.text,
        }
      })
    }
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
    getList() {
      let params = this.queryParams;
      params.startDate = params.rangeDate[0]
      params.endDate = params.rangeDate[1]

      this.loading = true;
      orderApi.getOrderList(params).then(res => {
        this.tableData = res.data.rows;
        this.pageParams.total = res.data.total;
      }).catch(err => {
        console.log("查询入库单列表接口报错：", err)
      }).finally(() => {
        this.loading = false;
      })
    },
    /*搜索查询*/
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList()
    },
    pageHandler(pageNum, pageSize) {
      this.queryParams.pageNum = pageNum;
      this.queryParams.pageSize = pageSize;
      this.getList()
    },
    /*重置*/
    resetQuery() {
      this.queryParams = {
        pmsOrderNo: '',
        startDate: "",
        endDate: "",
        applyDepart: '',
        applyUserId: '',
        pmsOrderStatus: '',
        orderBizType: "",
        pageNum: 1,
        pageSize: 20,
        // 订单类型(0-入库；1-出库)
        orderType: '0',
        rangeDate: []
      }

      this.getList()
    },
    /*切换按钮查询列表*/
    setActiveFilter(index) {
      this.queryParams.pmsOrderStatus = index;
      this.getList();
    },
    /*新建表单*/
    addEntryForm() {
      this.dialogAddEntry = true;
    },
    importOrder() {
      this.importOrderDialogShowFlag = true;
    },
    exportOrder() {
      orderApi.exportOrder(this.queryParams)
    },
    /*关闭表单*/
    handleEntryClose() {
      this.dialogAddEntry = false;
    },
    /*详情*/
    handleDetails(row) {
      this.dialogDetailsProcessDialog = true;
    },
    getDeptList(query) {
      treeselect(query).then(res => {
        this.deptList = res.data
      })
    },
    getUserList(deptId) {
      queryUserlist({deptId}).then(res => {
        this.userList = res.data.map(item => {
          return {
            label: item.nickName,
            value: item.userId
          }
        })
      })
    },
    downloadOrderTemplate() {
      return download(`/pms/examine/downloadTemplate?type=2`, {}, `订单导入模板_${new Date().getTime()}.xlsx`)
    },
    fileChangeHandler(file) {
      let formData = new FormData()
      formData.append('file', file.raw)
      orderApi.importInOrderInfo(formData).then((res) => {
        this.$message({
          type: 'success',
          message: '导入成功'
        })

        this.getList()
      })
    },
    importErrorHandler(err, file) {
      console.log('导入订单失败：', ...err)
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
