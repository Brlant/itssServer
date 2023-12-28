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
                            :clearable="false"
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
              clearable filterable @change="deptChangeHandler"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <!-- 申请人-->
          <el-form-item prop="applyUserId">
            <el-select v-model="queryParams.applyUserId" placeholder="发起人" clearable filterable remote
                       :remote-method="getUserList">
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
              v-has-permi="['pms:order:import']"
              type="primary"
              icon="el-icon-upload2"
              @click="importOrder"
            >
              导入新建/修改
            </el-button>
            <!--        导出-->
            <el-button
              v-has-permi="['pms:order:export']"
              type="primary"
              icon="el-icon-download"
              @click="exportOrder"
            >导出
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="SwitchTypes">
        <el-col :span="24">
          <el-form-item>
            <el-button
              class="btnSwitch"
              v-for="(item,index) in filters"
              :key="index"
              :class="{ 'is-active': activeFilterIndex === index }"
              @click="setActiveFilter(item,index)"
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
      <el-table-column prop="totalGoodsName" label="订单物品"></el-table-column>
      <el-table-column prop="orderTotalAmount" label="订单总金额"></el-table-column>
      <el-table-column prop="applyName" label="发起人"></el-table-column>
      <el-table-column prop="applyDepartName" label="发起部门"></el-table-column>
      <el-table-column prop="applyDate" label="发起日期"></el-table-column>
      <el-table-column prop="paymentFlag" label="是否已付款">
        <template v-slot="{ row }">
          <span v-if="row.paymentFlag">已付款</span>
          <span v-else>未付款</span>
        </template>
      </el-table-column>
      <el-table-column prop="invoiceNum" label="发票号"></el-table-column>
      <el-table-column prop="pmsOrderStatus" label="状态">
        <template v-slot="{ row }">
          <span v-if="row.pmsOrderStatus === 0" style="color: #F79B22">待审核</span>
          <span v-if="row.pmsOrderStatus === 1" style="color: #F79B22">审核中</span>
          <span v-if="row.pmsOrderStatus === 2" style="color: black">审核未通过</span>
          <span v-if="row.pmsOrderStatus === 3" style="color: #F79B22">待收货</span>
          <span v-if="row.pmsOrderStatus === 4" style="color: black">已撤回</span>
          <span v-if="row.pmsOrderStatus === 5" style="color: black">已取消</span>
          <span v-if="row.pmsOrderStatus === 7" style="color: green">已完成</span>
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
    <el-dialog :visible="dialogEntryDetailsProcessDialog" :title="detailsEntryTitle" width="80%"
               @close="closeEntryDialog">
      <template v-slot:title>
        <div style="font-weight: bold;font-size: 15px">{{ detailsEntryTitle }}</div>
      </template>
      <template class="templateEntryDialogStyle">
        <div style="position: relative">
          <div class="tabEntryStatus">
            <span v-if="activeEntryStatus === 0" style="color: #F79B22">待审核</span>
            <span v-if="activeEntryStatus === 1" style="color: #F79B22">审核中</span>
            <span v-if="activeEntryStatus === 2" style="color: black">审核未通过</span>
            <span v-if="activeEntryStatus === 3" style="color: #F79B22">待收货</span>
            <span v-if="activeEntryStatus === 4" style="color: black">已撤回</span>
            <span v-if="activeEntryStatus === 5" style="color: black">已取消</span>
            <span v-if="activeEntryStatus === 7" style="color: green">已完成</span>
          </div>
        </div>
        <el-tabs v-model="activeEntryTab" @tab-click="handleEntryTabClick">
          <el-tab-pane
            v-for="tab in tabs"
            :key="tab.name"
            :label="tab.label"
            :name="tab.name">
            <!-- 使用组件作为标签页内容 -->
            <component :is="tab.component"
                       :tabName="tabName"
                       :orderId="currOrderId"
                       :orderType="0"
                       @closeOrderDetail="closeOrderDetailHandler"
            ></component>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-dialog>
    <!--    新增弹框信息-->
    <in-order-add :dialogAddEntry="dialogAddEntry" @close="handleEntryClose"></in-order-add>

    <!-- 导入对话框-->
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

import InOrderAdd from "@/views/pms/order/in/inOrderAdd";
import InOrderDetail from "@/views/pms/order/in/inOrderDetail";
import OrderLog from "@/common/order/log/orderLog";
import OrderAuditInfo from "@/common/order/audit/orderAuditInfo";

import {downloadOrderTemplate, exportInOrder, getOrderList, importInOrderInfo} from "@/api/pms/order";
import {treeselect} from "@/api/system/dept";
import {getDealtWithList} from '@/api/auditCenter/dealtWith/dealtWith'
import request from '@/utils/request'

export default {
  name: "InOrderList",
  components: {
    InOrderAdd,
  },
  data() {
    return {
      // 当前订单的订单id，切换不同订单详情会变化
      currOrderId: '',
      activeEntryTab: 'orderInfo',
      tabs: [
        {label: '订单信息', name: 'orderInfo', component: InOrderDetail},
        {label: '审核信息', name: 'auditInfo', component: OrderAuditInfo},
        {label: '操作日志', name: 'orderLog', component: OrderLog}
      ],
      tabName: null,
      //详情信息
      detailsEntryTitle: "详情信息",
      //详情信息弹框
      dialogEntryDetailsProcessDialog: false,
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
      filters: [
        {text: "全部", status: ''},
        {text: "待审核", status: 0},
        {text: "审核中", status: 1},
        {text: "审核未通过", status: 2},
        {text: "待收货", status: 3},
        {text: "已撤回", status: 4},
        {text: "已取消", status: 5},
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
      userList: [],
      //状态
      activeEntryStatus: '',
      reviewedId: '',
    }
  },
  created() {
    let userInfo = window.localStorage.getItem('user');
    let userInfoParse = JSON.parse(userInfo);
    this.reviewedId = userInfoParse.userId

    this.getList()
    this.getDeptList('')
    this.getUserList('')
  },
  mounted() {

  },
  computed: {
    // activeEntryStatus() {
    //   if (!this.detailsSupplierData) {
    //     return ''
    //   }
    //
    //   return this.detailsSupplierData.supplierStatus
    // },
  },
  methods: {
    /*处理标签页信息*/
    handleEntryTabClick(tab, event) {

    },
    // 关闭详情对话框
    closeEntryDialog() {
      this.currOrderId = ''
      this.dialogEntryDetailsProcessDialog = false;
    },
    // 关闭订单详情对话框并刷新订单列表
    closeOrderDetailHandler() {
      this.closeEntryDialog()
      this.getList()
    },
    /* 获取我的待办总数 */
    getDealtWithListCount() {
      const params =
        {
          key: "",
          modelName: "",
          reviewedId: this.reviewedId,
          pageNum: 1,
          pageSize: 10,
          promoterId: "",
          queryType: 2
        }
      getDealtWithList(params).then((res) => {
        this.$store.dispatch('updateItem', res.data.total);
      })
    },
    /*查询列表内容*/
    getList() {
      let params = this.queryParams;
      if (params.rangeDate && params.rangeDate.length === 2) {
        params.startDate = params.rangeDate[0]
        params.endDate = params.rangeDate[1]
      }

      this.loading = true;
      getOrderList(params).then(res => {
        this.tableData = res.data.rows;
        this.pageParams.total = res.data.total;
        this.getDealtWithListCount();
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
    pageHandler({page, limit}) {
      this.queryParams.pageNum = page
      this.queryParams.pageSize = limit

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
    setActiveFilter(item, index) {
      this.queryParams.pmsOrderStatus = item.status;
      this.activeFilterIndex = index;
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
      exportInOrder(this.queryParams)
    },
    /*关闭表单*/
    handleEntryClose({refresh = false}) {
      this.dialogAddEntry = false;
      if (refresh) {
        // 如果需要刷新，那么刷新列表
        this.getList()
      }
    },
    /*详情*/
    handleDetails(row) {
      this.activeEntryStatus = row.pmsOrderStatus
      this.currOrderId = row.pmsOrderId;
      this.dialogEntryDetailsProcessDialog = true;
    },
    getDeptList(query) {
      treeselect(query).then(res => {
        this.deptList = res.data
      })
    },
    deptChangeHandler(value) {
      this.queryParams.applyUserId = ''
      this.getUserList('')
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
    downloadOrderTemplate() {
      return downloadOrderTemplate()
    },
    fileChangeHandler(file) {
      let formData = new FormData()
      formData.append('file', file.raw)
      importInOrderInfo(formData).then((res) => {
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

.templateEntryDialogStyle {
  position: relative;
}

.tabEntryStatus {
  position: absolute;
  top: 10px;
  left: 300px;
  width: 80px;
  height: 20px;
  text-align: center;
}
</style>
