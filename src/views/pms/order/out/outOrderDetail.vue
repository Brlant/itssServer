<template>
  <el-form ref="form" :model="formData" :rules="rules" label-width="100px">
    <!--    联系人-->
    <div class="jiBenXinXi">
      基本信息
    </div>
    <!-- 第一行 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="订单编号" prop="pmsOrderNo" required>
          <el-input v-model="formData.pmsOrderNo" placeholder="请选择入库单编号" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="订单类型" prop="orderBizType" :rules="rules.orderBizType">

          <el-select v-model="formData.orderBizType" placeholder="请选择入库单类型" :disabled="readonly">
            <el-option
              v-for="item in orderBizTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

        </el-form-item>
      </el-col>
    </el-row>
    <!-- 第二行 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="发起人" prop="applyName" :rules="rules.applyName">
          <el-input v-model="formData.applyName" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="发起部门" prop="applyDepartName" :rules="rules.applyDepartName">
          <el-input v-model="formData.applyDepartName" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="发起日期" prop="applyDate" :rules="rules.applyDate">
          <el-input v-model="formData.applyDate" placeholder="选择日期" disabled></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- 领用出库时，展示领用人和领用部门，可以下拉选择且有联动效果：选了领用人自动带出领用部门，选了领用部门自动带出部门下的人员信息 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="领用人" prop="applyName" :rules="rules.applyName"
                      v-show="formData.orderBizType === '2-3'">
          <el-select v-model="formData.recipientId" placeholder="请选择领用人" clearable filterable
                     remote :remote-method="getRecipientUserList" @change="recipientChange"
                     :disabled="readonly">
            <el-option
              v-for="item in recipientUserList"
              :key="item.userId"
              :disabled="item.status==='1'"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="领用部门" prop="applyDepartName" :rules="rules.applyDepartName"
                      v-show="formData.orderBizType === '2-3'">
          <el-cascader @change="recipientDepartmentChange"
                       v-model="formData.recipientDepartId"
                       placeholder="请选择领用部门"
                       :options="recipientDeptList"
                       :props="{ checkStrictly: true,emitPath:false, value: 'id' }"
                       :disabled="readonly"
                       clearable filterable></el-cascader>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- 申请原由 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="申请原由">
          <el-input v-model="formData.applyReason" :readonly="readonly"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <div class="jiBenXinXi">
      订单明细
    </div>
    <el-table :data="formData.orderDetailList" border>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="supplier" label="供应商名称" min-width="150px">
        <template v-slot="scope">
          <el-form-item :prop="`orderDetailList.${scope.$index}.supplierId`" label-width="0"
                        style="margin-top: 22px"
                        :rules="[{required: true, message: '请选择供应商名称', trigger: 'change'}]">
            <el-select v-model="scope.row.supplierId" placeholder="请选择供应商名称"
                       filterable :disabled="readonly"
                       @change="supplierChangeHandler(scope.$index)">
              <el-option v-for="(option,index) in supplierOptions"
                         :key="option.supplierId"
                         :label="option.supplierName"
                         :value="option.supplierId"
                         :disabled="option.disabaled"
                         :title="isOverDate(option.validityDate)">
                <span style="float: left;color: red" v-if="isOverDate(option.validityDate)">{{
                    option.supplierName
                  }}</span>
                <span style="float: left" v-else>{{ option.supplierName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ option.supplierCode }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="物品类型" min-width="150px">
        <template v-slot="scope">
          <el-form-item :prop="`orderDetailList.${scope.$index}.goodsType`" label-width="0"
                        style="margin-top: 22px"
                        :rules="[{required: true, message: '请选择物品类型', trigger: 'change'}]">
            <el-select v-model="scope.row.goodsType" placeholder="请选择物品类型" style="width: 100%" :disabled="readonly"
                       @change="supplierChangeHandler(scope.$index)">
              <el-option
                v-for="(item,index) in goodsTypes"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictCode"
                :disabled="item.status !== '0'"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="code" label="物品编号" min-width="150px">
        <template v-slot="scope">
          <el-form-item :prop="`orderDetailList.${scope.$index}.goodsCode`" label-width="0"
                        style="margin-top: 22px"
                        :rules="[{required: true, message: '请选择物品编号'}]">
            <el-select v-model="scope.row.goodsId" placeholder="请选择物品编号" style="width: 100%"
                       filterable :disabled="readonly"
                       @change="goodsChangeHandler(scope.row.goodsId,scope.$index)">
              <el-option v-for="option in goodsListOptions[scope.row.supplierId + '_' + scope.row.goodsType]"
                         :key="option.goodsId"
                         :label="option.goodsCode"
                         :value="option.goodsId"
                         :disabled="option.disabled"
              ></el-option>
              <el-option
                v-if="!hasGoods(scope.row)"
                :key="scope.row.goodsId"
                :label="scope.row.goodsCode"
                :value="scope.row.goodsId"
                :disabled="true"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="物品名称" min-width="150px">
        <template v-slot="scope">
          <el-form-item :prop="`orderDetailList.${scope.$index}.goodsName`" label-width="0"
                        style="margin-top: 22px"
                        :rules="[{required: true, message: '请选择物品名称'}]">
            <el-select v-model="scope.row.goodsId" placeholder="请选择物品名称" style="width: 100%"
                       filterable :disabled="readonly"
                       @change="goodsChangeHandler(scope.row.goodsId,scope.$index)">
              <el-option v-for="option in goodsListOptions[scope.row.supplierId + '_' + scope.row.goodsType]"
                         :key="option.goodsId"
                         :label="option.goodsName"
                         :value="option.goodsId"
                         :disabled="option.disabled"
              ></el-option>
              <el-option
                v-if="!hasGoods(scope.row)"
                :key="scope.row.goodsId"
                :label="scope.row.goodsName"
                :value="scope.row.goodsId"
                :disabled="true"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="含税进价" min-width="150px">
        <template v-slot="scope">
          <span>{{ scope.row.taxBid }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxRate" label="税率" min-width="150px">
        <template v-slot="scope">
          <span>{{ scope.row.taxRate }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="priceWithoutTax" label="不含税进价" min-width="150px">
        <template v-slot="scope">
          <span>{{ scope.row.nonTaxBid }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="stockNum" label="库存数量" min-width="150px">
        <template v-slot="scope">
          <span>{{ scope.row.stockNum }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="availableNum" label="可用数量" min-width="150px">
        <template v-slot="scope">
          <span>{{ scope.row.availableNum }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="数量" min-width="150px">
        <template v-slot="scope">
          <el-form-item :prop="`orderDetailList.${scope.$index}.amount`" label-width="0"
                        style="margin-top: 22px"
                        :rules="[
                          {required: true, message: '请输入数量', trigger: 'blur'},
                          {type: 'number',min:1,max:999999999,  message: '数量必须介于 1 到 999999999 之间', trigger: 'blur'},
                           {validator: checkAmount, trigger: 'blur'}]">
            <el-input @input="calculateTotal(scope.row,scope.$index)"
                      v-model.number="scope.row.amount" placeholder="请输入数量" :readonly="readonly"></el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="totalPrice" label="含税总进价" min-width="150px">
        <template v-slot="scope">
          <span>{{ scope.row.totalTaxBid }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalPriceWithoutTax" label="不含税总进价" min-width="150px">
        <template v-slot="scope">
          <span>{{ scope.row.nonTotalTaxBid }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalPrice" label="含税售价" min-width="150px"
                       v-if="formData.orderBizType === '2-0'">
        <template v-slot="scope">
          <el-input v-model.number="scope.row.taxPrice" placeholder="请输入含税售价"
                    :readonly="readonly"
                    @input="calculatePrice(scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="taxRate" label="税率" v-if="formData.orderBizType === '2-0'" min-width="150px">
        <template v-slot="scope">
          <el-select v-model.number="scope.row.sellingTaxRateId" placeholder="请选择税率" clearable
                     @change="calculatePrice(scope.row)">
            <el-option
              v-for="(item,index) in taxRateList"
              :key="index"
              :label="item.dictLabel"
              :value="item.dictCode"
              :disabled="item.status !== '0'"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="totalPriceWithoutTax" label="不含税售价" v-if="formData.orderBizType === '2-0'" min-width="150px">
        <template v-slot="scope">
          <span>{{ scope.row.nonTaxPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalPriceWithoutTax" label="毛利率" v-if="formData.orderBizType === '2-0'" min-width="150px">
        <template v-slot="scope">
          <span>{{ scope.row.grossMargin }}</span>
        </template>
      </el-table-column>
      <el-table-column width="50px" v-if="!readonly" min-width="150px">
        <template v-slot="scope">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-button circle size="small" icon="el-icon-plus" type="primary" @click="addRow"
                         v-if="scope.$index === 0 && !readonly"></el-button>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px">
            <el-col :span="24">
              <el-button circle size="small" icon="el-icon-minus" type="danger" @click="deleteRow(scope.$index)"
                         v-if="formData.orderDetailList.length > 1 && !readonly"></el-button>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 提交按钮 -->
    <el-form-item style="margin-top: 22px">
      <el-button
        class="pull-right"
        type="danger"
        v-has-permi="['pms:out-order:cancel']"
        v-show="formData.cancelButton && formData.pmsOrderStatus !== 3 && formData.pmsOrderStatus !== 5"
        @click="cancelOrder"
      >取消订单
      </el-button>
      <el-button icon="el-icon-edit"
                 v-has-permi="['pms:out-order:edit']"
                 v-show="!readonly"
                 @click="submitForm"
      >重新提交
      </el-button>
      <el-button type="success"
                 v-show="formData.examineButton && (formData.pmsOrderStatus === 0 || formData.pmsOrderStatus === 1)"
                 @click="auditPass"
      >审核通过
      </el-button>
      <el-button type="danger"
                 v-show="formData.examineButton && (formData.pmsOrderStatus === 0 || formData.pmsOrderStatus === 1)"
                 @click="auditNoPass"
      >审核不通过
      </el-button>
      <el-button v-show="formData.returnButton && (formData.pmsOrderStatus === 0 || formData.pmsOrderStatus === 1)"
                 type="primary"
                 @click="revocation"
      >撤回
      </el-button>
      <el-button @click="handleEntryClose">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {cancelOrderInfo, editOrderInfo, examineOrderInfo, getOrderDetail} from '@/api/pms/order'
import request from '@/utils/request'
import {getDicts} from '@/api/system/dict/data'
import {treeselect} from '@/api/system/dept'

export default {
  name: "OutOrderDetail",
  props: {
    tabName: {
      type: String,
      default: '',
    },
    orderId: {
      type: String,
      default: '',
    }
  },
  computed: {
    // 当前登录用户
    currUser() {
      return this.$store.state.user.user
    },
    readonly() {
      return !(this.formData.pmsOrderStatus === 2
        || this.formData.pmsOrderStatus === 4)
    },
    oldStr() {
      let {orderBizType, budgetType, orderDetailList} = this.orderDetail
      let details = orderDetailList.map(item => {
        return item.supplierId + '__' + item.goodsType + '__' + item.goodsId + '__' + item.amount
      }).join(',')
      return orderBizType + '__' + budgetType + '__' + details
    },
    newStr() {
      let {orderBizType, budgetType, orderDetailList} = this.formData
      let details = orderDetailList.map(item => {
        return item.supplierId + '__' + item.goodsType + '__' + item.goodsId + '__' + item.amount
      }).join(',')
      return orderBizType + '__' + budgetType + '__' + details
    },
    needAudit() {
      return this.oldStr != this.newStr
    }
  },
  watch: {
    orderId: {
      handler(newVal) {
        if (newVal) {
          console.log('订单详情', newVal);
          // 每次重新进入订单详情后需要重新清空表单校验
          if (this.$refs.form) {
            this.$refs.form.clearValidate()
          }

          this.getSupplierList()
          this.getBudgetTypeList()

          this.getOrderDetail(newVal)
        }
      },
      immediate: true,
    },
    recipientDepartmentId(val) {
      this.formData.recipientDepartId = val
    }
  },
  data() {
    return {
      formTitle: "基本信息",
      formData: {
        applyDepart: '',
        applyDepartName: '',
        applyName: '',
        applyUserId: '',
        orderType: '1',
        pmsOrderStatus: '',
        applyDate: '',
        // 预算类型
        budgetType: '',
        budgetTypeName: '',
        applyReason: '',
        paymentFlag: '',
        orderBizType: '',
        recipientId: '',
        recipientName: '',
        // 领用部门id
        recipientDepartId: '',
        recipientDepartName: '',
        receiptUrl: '',
        receiptName: '',
        invoiceNum: '',
        paymentUrl: '',
        invoiceUrl: '',
        consigneeName: '',
        consigneePhone: '',
        consigneeAddress: '',
        orderDetailList: [{
          "orderDetailId": "",
          "pmsOrderId": "",
          "goodsId": "",
          "goodsType": '',
          "goodsCode": "",
          "goodsName": "",
          "supplierId": "",
          "supplierName": "",
          "unitPrice": '',
          "taxRate": "",
          "amount": '',
          "totalPrice": '',
          "taxBid": '',
          "nonTaxBid": '',
          "totalTaxBid": '',
          "nonTotalTaxBid": '',
          "deleteFlag": '',
          "actualReceiptAmount": '',
          "actualReceiptPrice": '',
          "receiptRemark": "",
          "validityFlag": "",
          "validityDate": "",
          "grossMargin": "",
          availableNum: '',
          stockNum: ''
        }],
        // 按钮权限标识
        examineButton: 0,// 审核：判断是否有审核权限，0否1是
        returnButton: 0,// 撤回：判断是否有撤回权限，0否1是
        receiptButton: 0,// 签收：判断是否有收货权限，0否1是
      },
      orderDetail: {},
      rules: {
        applyName: [{required: true, message: '请选择发起人', trigger: 'blur'}],
        applyDepartName: [{required: true, message: '请选择发起人部门', trigger: 'blur'}],
        applyDate: [{required: true, message: '请选择发起日期', trigger: 'blur'}],
        orderBizType: [{required: true, message: '请选择订单类型', trigger: 'blur'}],
        budgetTypes: [{required: true, message: '请输入预算类型', trigger: 'blur'}],
      },
      supplierMap: {},
      supplierOptions: [],
      // 物品类型:固定资产、消耗品、服务、销售品
      goodsTypes: [
        // {value: 1, label: '固定资产'},
        // {value: 2, label: '消耗品'},
        // {value: 3, label: '服务'},
        // {value: 4, label: '销售品'},
      ],
      // { supplierId:goodsList}
      goodsListOptions: {},
      goodsMap: {},
      orderBizTypes: [
        {label: '销售出库', value: '2-0'},
        {label: '退货出库', value: '2-1'},
        {label: '盘亏出库', value: '2-2'},
        {label: '领用出库', value: '2-3'},
      ],
      budgetTypes: [],
      // 发起部门（多层级）
      recipientDeptList: [],
      // 发起人，按部门筛选
      recipientUserList: [],
      //税率
      taxRateList: [
        // {label: '1%', value: 0.01},
        // {label: '3%', value: 0.03},
        // {label: '6%', value: 0.06},
        // {label: '12%', value: 0.12},
        // {label: '15%', value: 0.15},
      ]
    }
  },
  methods: {
    getGoodsTypes() {
      return getDicts('goods_types').then((res) => {
        this.goodsTypes = res.data
      })
    },
    getTaxRateList() {
      return getDicts('tax_rate').then((res) => {
        this.taxRateList = res.data
      })
    },
    /*关闭弹框*/
    handleEntryClose() {
      this.$refs.form.resetFields()
      this.$emit('close', {refresh: true})
    },
    getOrderDetail(orderId) {
      getOrderDetail(orderId).then(res => {
        this.getRecipientUserList(res.data.recipientName)
        this.getDeptList({deptId: res.data.recipientDepartId})
        res.data.orderDetailList = res.data.orderDetailList.map((item, index) => {
          if (!this.supplierOptions.some(supplier => supplier.supplierId === item.supplierId)) {
            this.supplierOptions.push({
              supplierId: item.supplierId,
              supplierCode: item.supplierCode,
              supplierName: item.supplierName,
              disabled: true
            })
          }

          return {
            ...item,
          }
        })

        if (res.data.budgetType) {
          let budgetType = res.data.budgetType.split("-")
          let budgetTypes = []
          for (let i = 0; i < budgetType.length; i++) {
            budgetTypes.push(Number.parseInt(budgetType[i]))
          }
          res.data.budgetTypes = budgetTypes
        }

        this.orderDetail = JSON.parse(JSON.stringify(res.data))
        this.formData = res.data
        for (let index = 0; index < this.formData.orderDetailList.length; index++) {
          this.setGoodsList(index)
        }
      })
    },
    /*表单校验提交*/
    submitForm() {
      this.$confirm('是否重新提交?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.form.validate(valid => {
          if (valid) {
            // 表单验证通过，可以在这里进行提交操作
            this.editOrder()
          }
        });
      })
    },
    // 编辑订单
    editOrder() {
      this.formData.changeFlag = this.needAudit

      let params = this.formData
      params.applyDepart = this.currUser.deptId
      params.applyDepartName = this.currUser.deptName
      params.applyName = this.currUser.nickName
      params.applyUserId = this.currUser.userId

      editOrderInfo(params).then(res => {
        if (res.code === 200) {
          this.$message.success('编辑成功')
          this.$emit('closeOrderDetail')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 取消订单
    cancelOrder() {
      this.$confirm('此操作将取消订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancelOrderInfo(this.formData.pmsOrderId, 1).then((res) => {
          this.$message({
            type: 'success',
            message: '取消订单成功'
          })
          this.$emit('closeOrderDetail')
        })
      })
    },
    /*审核通过*/
    auditPass() {
      this.$confirm('是否确定审核通过?', '二次确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          pmsOrderId: this.formData.pmsOrderId,
          orderType: 1,
          examineType: 1,
        }
        examineOrderInfo(params).then((res) => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.$emit('closeOrderDetail')
        })
      })
    },
    /*审核不通过*/
    auditNoPass() {
      this.$prompt('请填写审核不通过的原因', "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        inputValidator: value => !!value,
        inputErrorMessage: "原因不能为空"
      }).then(({value}) => {
        let params = {
          pmsOrderId: this.formData.pmsOrderId,
          orderType: 1,
          examineType: 2,
          remark: value,
        }

        examineOrderInfo(params).then((res) => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })

          this.$emit('closeOrderDetail')
        })
      }).catch(() => {
      });
    },
    /*撤回*/
    revocation() {
      this.$confirm('是否确定撤回?', '二次确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          pmsOrderId: this.formData.pmsOrderId,
          orderType: 1,
          examineType: 3
        }

        examineOrderInfo(params).then((res) => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })

          this.$emit('closeOrderDetail')
        })
      })
    },
    /*订单明细表格函数*/
    addRow() {
      this.formData.orderDetailList.push({
        "orderDetailId": "",
        "pmsOrderId": "",
        "goodsId": "",
        "goodsType": '',
        "goodsCode": "",
        "goodsName": "",
        "supplierId": "",
        "supplierName": "",
        "unitPrice": '',
        "taxRate": "",
        "amount": '',
        "totalPrice": '',
        "taxBid": '',
        "nonTaxBid": '',
        "totalTaxBid": '',
        "nonTotalTaxBid": '',
        "deleteFlag": '',
        "actualReceiptAmount": '',
        "actualReceiptPrice": '',
        "receiptRemark": "",
        "validityFlag": "",
        "validityDate": "",
        "grossMargin": "",
        availableNum: '',
        stockNum: ''
      });
    },
    deleteRow(index) {
      this.formData.orderDetailList.splice(index, 1);
    },
    calculateTotal(row, index) {
      const regex = /^\d+$/;
      if (!regex.test(row.amount)) {
        this.formData.orderDetailList[index].amount = '';
        return this.$notify.error('只能输入整数')
      }
      // row.totalTaxBid = row.taxBid * row.taxRate * row.amount;
      row.totalTaxBid = row.taxBid * row.amount;
      // row.nonTotalTaxBid = row.nonTaxBid * row.taxRate * row.amount;
      row.nonTotalTaxBid = row.nonTaxBid * row.amount;
    },
    calculatePrice(row) {
      let {taxPrice, sellingTaxRateId, taxBid} = row
      if (taxPrice) {
        let taxRate = this.taxRateList.find(one => one.dictCode === sellingTaxRateId)?.dictLabel
        if (taxRate) {
          taxRate = Number.parseFloat(taxRate) / 100
          // 不含税售价：系统自动计算,不含税售价=含税售价÷（1+税率）
          row.nonTaxPrice = (taxPrice / (1 + taxRate)).toFixed(2);
        }
        if (taxBid) {
          // 毛利率：系统自动计算，毛利率=（含税售价-含税进价）÷含税售价
          row.grossMargin = ((taxPrice - Number(taxBid)) / taxPrice * 100).toFixed(2) + '%';
        }
      }

    },
    getSupplierList(keyword = '') {
      let params = {
        codeNameKey: keyword,
        supplierStatus: 3,
      }
      // 查询供应商下拉列表
      request.post('pms/supplier/getSupplierList', params).then((res) => {
        this.supplierOptions = res.data
        this.supplierOptions.forEach(one => {
          this.supplierMap[one.supplierId] = one.supplierName
        })
      })
    },
    getBudgetTypeList(keyword = '') {
      request.get('/system/budget/getList', {
        params: {
          budgetName: keyword
        }
      }).then(({data}) => {
        this.budgetTypes = data;
      })
    },
    supplierChangeHandler(index) {
      this.formData.orderDetailList[index].goodsId = ''
      this.setGoodsList(index)
    },
    setGoodsList(index) {
      let supplierId = this.formData.orderDetailList[index].supplierId
      if (!supplierId) {
        return
      }

      this.formData.orderDetailList[index].supplierName = this.supplierMap[supplierId]
      let goodsType = this.formData.orderDetailList[index].goodsType
      if (!goodsType) {
        return
      }

      let key = supplierId + '_' + goodsType
      let goodsList = this.goodsListOptions[key]
      if (!goodsList) {
        request.get('/pms/goods/queryAllList', {
          params: {
            supplierId, goodsType,
            goodsStatus: 3,
          }
        }).then(res => {
          goodsList = res.data
          this.$set(this.goodsListOptions, key, goodsList)
          goodsList.forEach(goods => {
            this.goodsMap[goods.goodsId] = goods
          })
        })
      } else {
        this.$set(this.goodsListOptions, key, goodsList)
      }
    },
    goodsChangeHandler(goodsId, index) {
      let goodsInfo = this.goodsMap[goodsId]
      let goodsCode = goodsInfo.goodsCode
      let goodsName = goodsInfo.goodsName
      let taxBid = goodsInfo.taxBid
      let nonTaxBid = goodsInfo.nonTaxBid
      let taxRate = goodsInfo.taxRate

      this.formData.orderDetailList[index].goodsId = goodsId
      this.formData.orderDetailList[index].goodsCode = goodsCode
      this.formData.orderDetailList[index].goodsName = goodsName
      this.formData.orderDetailList[index].taxBid = taxBid
      this.formData.orderDetailList[index].nonTaxBid = nonTaxBid
      this.formData.orderDetailList[index].taxRate = taxRate
      if (taxRate) {
        this.formData.orderDetailList[index].totalTaxBid = taxBid * parseFloat(taxRate) / 100
        this.formData.orderDetailList[index].nonTotalTaxBid = nonTaxBid * parseFloat(taxRate) / 100
      }

      this.queryStockCount(goodsId, index)
    },
    // 查询库存的数量以及可用库存
    queryStockCount(goodsId, index = 0) {
      this.formData.orderDetailList[index].stockId = ''
      this.formData.orderDetailList[index].stockNum = ''
      this.formData.orderDetailList[index].availableNum = ''

      // 当选择货品以后，需要查询货品的库存，按供应商id、部门id、货品id查询，返回库存数量
      let departId = this.formData.applyDepart
      let supplierId = this.formData.orderDetailList[index].supplierId
      request.post('/pms/order/queryStockAmount', {goodsId, supplierId, departId}).then(res => {
        let {stockId, stockNum, availableNum} = res.data
        this.formData.orderDetailList[index].stockId = stockId
        this.formData.orderDetailList[index].stockNum = stockNum
        this.formData.orderDetailList[index].availableNum = availableNum
      })
    },
    isOverDate(dateStr) {
      return this.monent(dateStr).isBefore(this.monent()) ? '已到期' : ''
    },
    getDeptList(query) {
      this.recipientDeptList = []
      treeselect(query).then(res => {
        this.recipientDeptList = res.data
      })
    },
    recipientChange(val) {
      // 当领用人变化的时候，自动获取到部门
      if (val) {
        this.formData.recipientDepartId = this.recipientUserList.find(one => one.userId === val)?.deptId
      }
    },
    getRecipientUserList(keyword) {
      let params = {
        deptId: this.formData.recipientDepartId,
        nickName: keyword,
        // 用户状态（0正常 1停用）
        status: 0
      }

      request.get('system/user/selectUserList', {
        params
      }).then(res => {
        this.recipientUserList = res.rows
      })
    },
    recipientDepartmentChange(deptId) {
      this.formData.recipientId = ''
      this.getRecipientUserList('')
    },
    checkAmount(rule, value, callback) {
      const regex = /^\d+$/;
      if (!regex.test(value)) {
        return callback(new Error('请输入正整数'))
      }

      return callback()
    },
    hasGoods(row) {
      let list = this.goodsListOptions[row.supplierId + '_' + row.goodsType]
      if (!list) {
        return false
      }

      return this.goodsListOptions[row.supplierId + '_' + row.goodsType].some(goods => goods.goodsId === row.goodsId)
    },
  },
  mounted() {
    this.getGoodsTypes()
    this.getTaxRateList()
  }
}
</script>

<style scoped>
.jiBenXinXi {
  font-weight: bolder;
  font-size: 14px;
  width: 100%;
  border-bottom: 1px solid #F2F2F2;
  margin-bottom: 22px;
  padding-bottom: 10px;
  box-sizing: content-box;
}

>>> .el-form-item {
  margin-left: 0;
}

</style>
