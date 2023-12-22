<template>
  <div class="app-container">
    <el-row>
      <!--      输入框-->
      <el-col >
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
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

          <!--     时间搜索 -->
            <el-form-item prop="rangeDate">
              <el-date-picker
                style="width: 100%"
                v-model="queryParams.rangeDate"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                :default-time="['00:00:00', '23:59:59']"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              ></el-date-picker>
            </el-form-item>

            <!-- 订单类型-->
            <el-form-item prop="orderBizType">
              <el-select v-model="queryParams.orderBizType" placeholder="请选择出库单类型" clearable>
                <el-option
                  v-for="item in orderBizTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>


          <!--      发起部门-->
          <el-form-item prop="applyDepart">
            <el-cascader
              v-model="queryParams.applyDepart"
              placeholder="发起部门"
              :options="deptList"
              :props="{ checkStrictly: true,emitPath:false, value: 'id' }"
              clearable filterable
              @change="getUserList"></el-cascader>
          </el-form-item>

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
            @click="addOutBoundOrder"
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
        @click="setActiveFilter(item,index)"
      >
        {{ item.text }}
      </el-button>
    </el-row>
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
          <span v-if="row.pmsOrderStatus === 6" style="color: black">已淘汰</span>
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
    <pagination
      v-show="queryParams.total>0"
      :total="queryParams.total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getOutBoundOrder"
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
    <outbound-order :dialogAddOutBoundOrder="dialogAddOutBoundOrder"
                    @handleOutBoundOrderClose="handleOutBoundOrderClose"></outbound-order>
  </div>
</template>

<script>
import outboundOrder from "@/common/outboundOrder/outboundOrder";

import boundAuditInfo from "@/common/outBoundForm/boundAuditInfo";
import boundInfo from "@/common/outBoundForm/boundInfo";
import boundOperationLog from "@/common/outBoundForm/boundOperationLog";
import { treeselect } from '@/api/system/dept'
import { queryUserlist } from '@/api/system/user'

import outBoundOrderApi from '@/api/outBoundOrder/outBoundOrder'

export default {
  name: "index",
  components: {
    outboundOrder,
  },
  data() {
    return {
      activeTab: 'fileInfo',
      tabs: [
        {label: '档案信息', name: 'fileInfo', component: boundInfo},
        {label: '审核信息', name: 'auditInfo', component: boundAuditInfo},
        {label: '操作日志', name: 'operationLog', component: boundOperationLog}
      ],
      tabName: null,
      //详情信息
      detailsTitle: "详情信息",
      //详情信息弹框
      dialogDetailsProcessDialog: false,

      dialogAddOutBoundOrder: false,//新建弹框
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
        orderBizType: "",
        pmsOrderStatus: '',
        pageNum: 1,
        pageSize: 20,
        // 订单类型(0-入库；1-出库)
        orderType: '1',
        rangeDate: [],
        total: 0,
      },
      //供应商
      supplierArray: [],

      //切换按钮
      filters: [
        {text: "全部", status: ''},
        {text: "待审核", status: 0},
        {text: "审核未通过", status: 2},
        {text: "已完成", status: 3},
        {text: "已撤回", status: 4},
        {text: "已取消", status: 5},
      ],
      activeFilterIndex: 0,
      tableData: [],
      orderBizTypes: [
        {label: '采购入库', value: '1-0'},
        {label: '盘盈入库', value: '1-2'},
        {label: '领用入库', value: '1-4'},
      ],
      // 发起部门（多层级）
      deptList: [],
      // 发起人，按部门筛选
      userList: []
    }
  },
  created() {
    this.getOutBoundOrder();
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
          status:filter.status,
        }
      })
    },
  },
  methods: {
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
    /*新增表单*/
    addOutBoundOrder() {
      this.dialogAddOutBoundOrder = true;
    },
    handleOutBoundOrderClose() {
      this.dialogAddOutBoundOrder = false;
    },
    /*查询列表内容*/
    getOutBoundOrder() {
      const  params = this.queryParams;
      params.startDate = this.queryParams.rangeDate[0]
      params.endDate = this.queryParams.rangeDate[1]
      outBoundOrderApi.queryList(params).then(res=>{
        this.tableData = res.data.rows;
        this.queryParams.total = res.data.total;
      }).catch(err => {
        console.log("查询出库单列表接口报错：", err)
      }).finally(() => {
        this.loading = false;
      })

    },
    /*搜索查询*/
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getOutBoundOrder();
    },
    /*重置*/
    resetQuery() {
      this.$refs.queryForm.resetFields();
      this.queryParams= {
        pmsOrderNo: '',
        startDate: "",
        endDate: "",
        applyDepart: '',
        applyUserId: '',
        orderBizType: "",
        pmsOrderStatus: '',
        pageNum: 1,
        pageSize: 20,
        // 订单类型(0-入库；1-出库)
        orderType: '1',
        rangeDate: [],
        total: 0,
      };
      this.getOutBoundOrder();
    },
    /*切换按钮查询列表*/
    setActiveFilter(item,index) {
      this.queryParams.pmsOrderStatus = item.status;
      this.activeFilterIndex = index;
      this.getOutBoundOrder();
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
