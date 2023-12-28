<template>
  <el-dialog :visible="dialogAdd" :title="formTitle" width="80%" @close="handleEntryClose">
    <template v-slot:title>
      <div style="font-weight: bold;font-size: 15px">{{ formTitle }}</div>
    </template>

    <el-form ref="form" :model="formData" :rules="rules" label-width="100px">
      <!--    联系人-->
      <div class="jiBenXinXi">
        基本信息
      </div>
      <!-- 第一行：订单类型 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="订单类型" prop="orderBizType" :rules="rules.orderBizType">

            <el-select v-model="formData.orderBizType" placeholder="请选择入库单类型">
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
      <!-- 第二行：申请人、申请部门、申请日期 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="申请人" prop="applyName" :rules="rules.applyName">
            <el-input v-model="formData.applyName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="申请部门" prop="applyDepartName" :rules="rules.applyDepartName">
            <el-input v-model="formData.applyDepartName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="申请日期" prop="applyDate" :rules="rules.applyDate">
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
                       remote :remote-method="getRecipientUserList" @change="recipientChange">
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
                         clearable filterable></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 申请原由 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="申请原由">
            <el-input v-model="formData.applyReason"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="jiBenXinXi">
        订单明细
      </div>
      <el-table :data="formData.orderDetailList" border>
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column prop="supplier" label="供应商名称" min-width="100px">
          <template v-slot="scope">
            <el-form-item :prop="`orderDetailList.${scope.$index}.supplierId`" label-width="0"
                          style="margin-top: 22px"
                          :rules="[{required: true, message: '请选择供应商名称', trigger: 'change'}]">
              <el-select v-model="scope.row.supplierId" placeholder="请选择供应商名称"
                         filterable :disabled="readonly"
                         @change="setGoodsList(scope.$index)">
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
        <el-table-column prop="type" label="物品类型">
          <template v-slot="scope">
            <el-form-item :prop="`orderDetailList.${scope.$index}.goodsType`" label-width="0"
                          style="margin-top: 22px"
                          :rules="[{required: true, message: '请选择物品类型', trigger: 'change'}]">
              <el-select v-model="scope.row.goodsType" placeholder="请选择物品类型" style="width: 100%" :disabled="readonly"
                         @change="setGoodsList(scope.$index)">
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
        <el-table-column prop="code" label="物品编号">
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
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="物品名称">
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
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="含税进价">
          <template v-slot="scope">
            <span>{{ scope.row.taxBid }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="taxRate" label="税率">
          <template v-slot="scope">
            <span>{{ scope.row.taxRate }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="priceWithoutTax" label="不含税进价">
          <template v-slot="scope">
            <span>{{ scope.row.nonTaxBid }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stockNum" label="库存数量">
          <template v-slot="scope">
            <span>{{ scope.row.stockNum }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="availableNum" label="可用数量">
          <template v-slot="scope">
            <span>{{ scope.row.availableNum }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="数量">
          <template v-slot="scope">
            <el-form-item :prop="`orderDetailList.${scope.$index}.amount`" label-width="0"
                          style="margin-top: 22px"
                          :rules="[{ required: true, message: '请输入数量', trigger: 'blur'},{type: 'number',min:1,max:999999999,  message: '数量必须介于 1 到 999999999 之间', trigger: 'blur'}]">
              <el-input @input="calculateTotal(scope.row)"
                        v-model.number="scope.row.amount" placeholder="请输入数量"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="totalPrice" label="含税总进价">
          <template v-slot="scope">
            <span>{{ scope.row.totalTaxBid }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalPriceWithoutTax" label="不含税总进价">
          <template v-slot="scope">
            <span>{{ scope.row.nonTotalTaxBid }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalPrice" label="含税售价"
                         v-if="formData.orderBizType === '2-0'">
          <template v-slot="scope">
            <el-input v-model.number="scope.row.taxPrice" placeholder="请输入含税售价"
                      @input="calculatePrice(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="taxRate" label="税率" v-if="formData.orderBizType === '2-0'">
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
        <el-table-column prop="totalPriceWithoutTax" label="不含税售价" v-if="formData.orderBizType === '2-0'">
          <template v-slot="scope">
            <span>{{ scope.row.nonTaxPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalPriceWithoutTax" label="毛利率" v-if="formData.orderBizType === '2-0'">
          <template v-slot="scope">
            <span>{{ scope.row.grossMargin }}</span>
          </template>
        </el-table-column>
      <el-table-column width="50px" v-if="!readonly">
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
        <el-button type="primary" @click="submitForm" :disabled="doing">提交</el-button>
        <el-button @click="handleEntryClose">返回</el-button>
      </el-form-item>

    </el-form>
  </el-dialog>
</template>

<script>
import request from '@/utils/request'
import {addPmsOrder} from '@/api/pms/order'
import {treeselect} from '@/api/system/dept'
import {queryUserlist} from '@/api/system/user'
import {getDicts} from '@/api/system/dict/data'

export default {
  name: "OutOrderAdd",
  props: {
    dialogAdd: {
      type: Boolean,
      default: '',
    }
  },
  data() {
    return {
      doing:false,
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
          "taxRateId": "",
          sellingTaxRate:'',
          sellingTaxRateId:'',
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
      rules: {
        applyName: [{required: true, message: '请选择申请人', trigger: 'blur'}],
        applyDepartName: [{required: true, message: '请选择申请人部门', trigger: 'blur'}],
        applyDate: [{required: true, message: '请选择申请日期', trigger: 'blur'}],
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
      goodsListOptions: {
        '': []
      },
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
    calculateTotal(row) {
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
    submitForm() {
      if (this.doing) return;
      this.doing = true;
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 在这里处理表单提交逻辑
          this.addOrder()
        }else{
          this.doing = false;
        }
      });
    },
    addOrder() {
      let params = this.formData
      let recipientId = params.recipientId
      let user = this.recipientUserList.find(one => one.userId === recipientId)
      if (user) {
        params.recipientName = user.nickName
      }

      this.formData.goodsTypeName = this.goodsTypes.find(item => item.dictCode === params.goodsType)?.dictLabel;
      params.sellingTaxRate = this.taxRateList.find(one => one.value === params.sellingTaxRateId).dictLabel

      addPmsOrder(params).then((res) => {
        this.$message({
          type: 'success',
          message: '提交成功'
        });
        this.doing = false;
        this.handleEntryClose()
      }).catch(err => {
        this.doing = false;
        this.$message({
          type: 'error',
          message: err.message
        });
      })
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
    setGoodsList(index) {
      this.formData.orderDetailList[index].goodsId = ''
      let supplierId = this.formData.orderDetailList[index].supplierId
      if (!supplierId) {
        return
      }

      this.formData.orderDetailList[index].supplierName = this.supplierMap[supplierId]
      let goodsType = this.formData.orderDetailList[index].goodsType
      if (!goodsType) {
        return
      }

      let key = supplierId +'_'+ goodsType
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
        this.formData.orderDetailList[index].totalTaxBid = taxBid * parseFloat(taxRate)/100
        this.formData.orderDetailList[index].nonTotalTaxBid = nonTaxBid * parseFloat(taxRate)/100
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
        let deptId = this.recipientUserList.find(one => one.userId === val)?.deptId
        this.formData.recipientDepartId = deptId
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
  },
  computed: {
    // 当前登录用户
    currUser() {
      return this.$store.state.user.user
    },
    readonly() {
      return false
    },
  },
  mounted() {
    this.getGoodsTypes()
    this.getTaxRateList()
  },
  watch: {
    dialogAdd(val) {
      if (val) {
        this.formTitle = "新增出库单"
        this.formData.orderType = '1'
        this.formData.applyUserId = this.currUser.userId
        this.formData.applyName = this.currUser.nickName
        this.formData.applyDepart = this.currUser.deptId
        this.formData.applyDepartName = this.currUser.deptName
        this.formData.applyDate = this.monent().format('YYYY-MM-DD')

        this.getBudgetTypeList()
        this.getSupplierList()
        this.getRecipientUserList('')
        this.getDeptList('')
      } else {
        this.$refs.form.resetFields()
      }
    },
  }
}
</script>

<style scoped>
.jiBenXinXi {
  font-weight: bolder;
  font-size: 14px;
  width: 100%;
  border-bottom: 1px solid #F2F2F2;
  margin-bottom: 20px;
  padding-bottom: 10px;
  box-sizing: content-box;
}

>>> .el-form-item {
  margin-left: 0;
}
</style>
