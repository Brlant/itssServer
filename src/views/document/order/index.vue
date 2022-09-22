<template>
  <div class="app-container">
    <div class="plateInfo">
      <el-form :model="filterForm" ref="filterForm" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="货主订单号" prop="orderNo">
              <el-input v-model="filterForm.orderNo" clearable placeholder="请输入货主订单号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="货主" prop="orgName">
              <el-input v-model="filterForm.orgName" placeholder="请输入货主" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="调度单号" prop="controlNo">
              <el-input v-model="filterForm.controlNo" clearable placeholder="请输入调度单号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" prop="orderStatus">
              <el-select v-model="filterForm.orderStatus" placeholder="请选择状态" clearable>
                <el-option v-for="(item,index) of stateList" :key="index" :value="item.value" :label="item.label">
                  {{ item.label }}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label-width="20px">
              <el-button type="primary" v-hasPermi="['tdp:order:list','system:unit:list']" @click="searchFn">查询</el-button>
              <el-button plain @click="resetFeildFn">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div>
      <div class="headerBtn">
        <el-button type="primary" v-hasPermi="['tdp:order:add']" @click="addFormFile">新增</el-button>
        <el-button type="warning" v-hasPermi="['tdp:order:export']" @click="batchImport">批量导入</el-button>
      </div>
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        @selection-change="selectionChange"
        border
      >
        <el-table-column label="货主/订单号">
          <template slot-scope="{row}">
            <div>{{row.orgName}}</div>
            <div>{{ row.orderNo }}</div>
          </template>
        </el-table-column>

        <el-table-column label="调度单号" width="220">
          <template slot-scope="{ row }">
            {{ row.controlNo }}
          </template>
        </el-table-column>

        <el-table-column label="运输条件/订单货品类型" prop="managerName">
          <template slot-scope="{ row }">
            <div>
              <dict-tag :options="dict.type.transportation_condition" :value="row.transportationCondition"/>
            </div>
            <div>
              <dict-tag :options="dict.type.order_goods_type" :value="row.orderGoodsType"/>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="去向单位/地址">
          <template slot-scope="{ row }">
            <div>{{ row.receiverName }}</div>
            <div>{{ row.senderAddress }}</div>
          </template>
        </el-table-column>

        <el-table-column label="承运商" width="200">
          <template slot-scope="scope">
            {{ scope.row.carrierName }}
          </template>
        </el-table-column>

        <el-table-column label="时间" width="260">
          <template slot-scope="scope">
            <div>
              <span>下单：</span>
              {{ scope.row.createTime }}
            </div>
            <div>
              <span>预计送货时间：</span>
              {{ scope.row.deliveryTime }}
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="updateBy" label="状态" width="150">
          <template slot-scope="{ row }">
            <span v-if="row.orderStatus === -2">异常</span>
            <span v-if="row.orderStatus === -1">拒收</span>
            <span v-if="row.orderStatus === 0">已取消</span>
            <span v-if="row.orderStatus === 1">待分配</span>
            <span v-if="row.orderStatus === 2">待确认</span>
            <span v-if="row.orderStatus === 3">待收货</span>
            <span v-if="row.orderStatus === 4">已签收</span>
            <span v-if="row.orderStatus === 5">已完成</span>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="text-primary cursor" style="margin-right:20px" v-hasPermi="['tdp:order:query']" @click="editDetail( scope.row )">查看详情</span>
            <span class="text-danger cursor" v-if="scope.row.orderStatus === 1" style="margin-right:20px"
                  v-hasPermi="['tdp:order:edit']"
                  @click="fenPeiDetail(scope.row)"
            >分配</span>
            <span class="text-danger cursor" v-if="scope.row.orderStatus === 2" style="margin-right:20px"
                  v-hasPermi="['tdp:order:edit']"
                  @click="resetDetailFn(scope.row)"
            >重新分配</span>
            <span class="text-danger cursor" v-if="scope.row.orderStatus == 1 || scope.row.orderStatus == 2 || scope.row.orderStatus == 3" @click="quXiaoReset(scope.row)"
                  v-hasPermi="['tdp:order:cancel']"
            >取消</span>
          </template>
        </el-table-column>

        <template slot="empty">
          <el-empty description="暂无数据"></el-empty>
        </template>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="currentPage"
        :limit.sync="pageSize"
        @pagination="queryPageFn"
      />
      <!-- 批量导入 -->
      <base-upload :isShow="isShow" @uploadClose="uploadClose" @searchFn="searchFn"></base-upload>
      <!-- 新增弹框信息-->
      <msg-form :dialogVisibleForm.sync="dialogVisibleForm" :action="action"
                @handleCloseVisible="handleCloseVisible"
                @handleRefreshFn="handleRefreshFn"
      ></msg-form>
      <!--查看详情-->
      <detail-form :detailVisibleForm="detailVisibleForm"
                   :formItem="formItem"
                   :orderLog="orderLog"
                   :orderPushLog="orderPushLog"
                   :actionDetail="actionDetail"
                   @handleCloseDetail="handleCloseDetail"
      ></detail-form>
      <fen-pei-form :detailVisibleFenPeiForm="detailVisibleFenPeiForm"
                    @handleCloseFenPeiForm="handleCloseFenPeiForm"
                    @refreshSubmitForm="refreshSubmitForm"
                    :formItemFenPeiForm="formItemFenPeiForm"
                    :actionDetailFenPeiForm="actionDetailFenPeiForm"
      ></fen-pei-form>
    </div>
  </div>
</template>

<script>
import { baseUploadImport, orderList } from '../../../api/order/import'
import msgForm from '../components/msgForm'
import detailForm from '../components/detailForm'
import fenPeiForm from '../components/fenPeiForm'

export default {
  components: {
    msgForm,
    detailForm,
    fenPeiForm
  },
  dicts: ['order_type', 'transportation_condition', 'deliver_way','order_goods_type'],
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: -1,
      tableLoading: false,
      tableData: [],
      selectList: [],//勾选的数据
      filterForm: {
        orderNo: '', //货主订单号
        orgName: '', //货主
        controlNo: '', //调度单号
        orderStatus: ''//状态
      },
      stateList: [
        { label: '待分配', value: 1 },
        { label: '待确认', value: 2 },
        { label: '待收货', value: 3 },
        { label: '已签收', value: 4 },
        { label: '已完成', value: 5 },
        { label: '已取消', value: 0 },
        { label: '拒收', value: -1 },
        { label: '异常', value: -2 }
      ],
      //批量导入
      isShow: false,
      //添加表单
      dialogVisibleForm: false,
      action: '',
      //详情表单信息
      formItem: {},
      orderPushLog: [],
      orderLog: [],
      detailVisibleForm: false,
      actionDetail: '',
      //分配表单
      formItemFenPeiForm:{},
      detailVisibleFenPeiForm: false,
      actionDetailFenPeiForm: ''
    }
  },
  created() {
    this.queryPageFn()
  },
  methods: {
    /* 重新分配*/
    resetDetailFn(row){
      this.$confirm('是否重新分配"'+row.orderNo+'"?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        let query = {
          orderId:row.orderId
        }
        new orderList().resetOrder(query).then(res=>{
          this.$notify.success({
            duration: 2000,
            name: '成功',
            message: '成功重新分配'
          })
          this.queryPageFn()
        }).catch(error=>{
          this.$notify.info({
            duration: 2000,
            name: '失败',
            message: error.response.data
          })
          this.queryPageFn()
        })
      })
    },
    /* 取消*/
    quXiaoReset(row){
      this.$confirm('是否取消"'+row.orderNo+'"?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        new orderList().quXiaoOrder(row.orderId).then(res=>{
          this.$notify.success({
            duration: 2000,
            name: '成功',
            message: '已取消'
          })
          this.queryPageFn()
        }).catch(error=>{
          this.$notify.info({
            duration: 2000,
            name: '失败',
            message: error.response.data
          })
          this.queryPageFn()
        })
      })
    },
    /* 关闭分配表单*/
    refreshSubmitForm(){
      this.detailVisibleFenPeiForm = false
      this.queryPageFn()
    },
    /** 新增表单文件 **/
    addFormFile() {
      this.dialogVisibleForm = true
      this.action = 'add'
    },
    /** 关闭表单文件**/
    handleCloseVisible() {
      this.dialogVisibleForm = false
      this.action = ''
    },
    /* 关闭新增表单刷新页面*/
    handleRefreshFn() {
      this.queryPageFn()
      this.dialogVisibleForm = false
      this.action = ''
    },
    /* 初始化表格*/
    queryPageFn() {
      let params = {
        orgName: this.filterForm.orgName,
        orderNo: this.filterForm.orderNo,
        controlNo: this.filterForm.controlNo,
        orderStatus: this.filterForm.orderStatus,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      this.tableLoading = true
      new orderList().queryOrderList(params).then(res => {
        this.tableLoading = false
        this.tableData = res.rows
        this.total = res.total
      })
    },
    /* 查询*/
    searchFn() {
      this.currentPage = 1
      this.queryPageFn()
    },
    /* 重置*/
    resetFeildFn() {
      let that = this
      that.filterForm.orderNo = ''
      that.filterForm.orgName = ''
      that.filterForm.controlNo = ''
      that.filterForm.orderStatus = ''
      this.queryPageFn()
    },
    selectionChange(selection) {
      this.selectList = selection
    },
    /*批量导入*/
    batchImport() {
      this.isShow = true
    },
    uploadClose() {
      this.isShow = false
    },
    /*查看详情*/
    editDetail(row) {
      this.detailVisibleForm = true
      this.actionDetail = 'detail'
      new orderList().detailOrder(row.orderId).then(res => {
        this.formItem = res.data
      }).catch(error => {
        this.$notify.info({
          duration: 2000,
          name: '失败',
          message: error.response.data
        })
      })
      let query = {
        logRecordObjectId: row.orderId,
        logRecordObjectType: 'tdp-order'
      }
      new orderList().detailOrderLog(query).then(res => {
        this.orderLog = res.data
      }).catch(error => {
        this.$notify.success({
          duration: 2000,
          name: '失败',
          message: error.response.data
        })
      })
      let params = {
        pushObjectId:row.orderId,
        pushObjectType:'tdp-order'
      }
      new orderList().pushOrderLog(params).then(res => {
        this.orderPushLog = res.data
      }).catch(error => {
        this.$notify.info({
          duration: 2000,
          name: '失败',
          message: error.response.data
        })
      })
    },
    /* 分配*/
    fenPeiDetail(row) {
      this.detailVisibleFenPeiForm = true
      this.actionDetailFenPeiForm = 'detailFenPeiForm'
      new orderList().detailOrder(row.orderId).then(res => {
        this.formItemFenPeiForm = res.data
      }).catch(error => {
        this.$notify.info({
          duration: 2000,
          name: '失败',
          message: error.response.data
        })
      })
    },
    /* 关闭分配弹框*/
    handleCloseFenPeiForm() {
      this.detailVisibleFenPeiForm = false
    },
    /* 关闭详情*/
    handleCloseDetail() {
      this.detailVisibleForm = false
      this.queryPageFn()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
