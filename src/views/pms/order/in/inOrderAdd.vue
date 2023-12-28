<template>
  <el-dialog :visible="dialogAddEntry" :title="formTitle" width="80%" @close="handleEntryClose">
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
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="收货人" prop="consigneeName">
            <el-input v-model="formData.consigneeName" :readonly="readonly"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="收货人电话" prop="consigneePhone">
            <el-input v-model="formData.consigneePhone" :readonly="readonly"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="收货人地址" prop="consigneeAddress">
            <el-input v-model="formData.consigneeAddress" :readonly="readonly"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 预算类型&申请原由 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="预算类型" prop="budgetTypes" :rules="rules.budgetTypes">
            <el-cascader
              v-model="formData.budgetTypes"
              placeholder="请选择预算类型"
              :options="budgetTypes"
              :props="{ label: 'budgetName', value: 'budgetId',children: 'childList'}"
              filterable></el-cascader>
          </el-form-item>
        </el-col>
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
        <el-table-column prop="supplier" label="供应商名称" min-width="100px">
          <template v-slot="scope">
            <el-form-item :prop="`orderDetailList.${scope.$index}.supplierId`" label-width="0"
                          style="margin-top: 22px"
                          :rules="[{required: true, message: '请选择供应商名称', trigger: 'change'},
                          {validator: supplierValidator, trigger: 'change'}]">
              <el-select v-model="scope.row.supplierId" placeholder="请选择供应商名称"
                         filterable :disabled="readonly"
                         @change="setGoodsList(scope.$index)">
                <el-option v-for="(option,index) in supplierOptions" :key="option.supplierId"
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
        <el-table-column prop="amount" label="数量">
          <template v-slot="scope">
            <el-form-item :prop="`orderDetailList.${scope.$index}.amount`" label-width="0"
                          style="margin-top: 22px"
                          :rules="[{ required: true, message: '请输入数量', trigger: 'blur'},{type: 'number',min:1,max:999999999,  message: '数量必须介于 1 到 999999999 之间', trigger: 'blur'}]">
              <el-input @input="calculateTotal(scope.row)"
                        v-model.number="scope.row.amount" placeholder="请输入数量" :readonly="readonly"></el-input>
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
        <el-table-column width="50px">
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
import {getDicts} from '@/api/system/dict/data'

export default {
  name: "InOrderAdd",
  props: {
    dialogAddEntry: {
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
        orderType: '0',
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
        invoiceNum: '',
        invoiceName: '',
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
          "grossMargin": ""
        }],
        // 按钮权限标识
        examineButton: 0,// 审核：判断是否有审核权限，0否1是
        returnButton: 0,// 撤回：判断是否有撤回权限，0否1是
        receiptButton: 0,// 签收：判断是否有收货权限，0否1是
      },
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
      goodsListOptions: {
        '': []
      },
      goodsMap: {},
      orderBizTypes: [
        {label: '采购入库', value: '1-0'},
        {label: '盘盈入库', value: '1-2'},
        {label: '领用入库', value: '1-4'},
      ],
      budgetTypes: [],
      // 无需效期，有效期
      validityFlagOptions: [
        {label: '无需效期', value: '1'},
        {label: '有效期', value: '2'},
      ]
    }
  },
  methods: {
    getGoodsTypes() {
      return getDicts('goods_types').then((res) => {
        this.goodsTypes = res.data
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
        "grossMargin": ""
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
      params.budgetType = params.budgetTypes.join("-")
      let budgetTypeNames = []
      this.budgetTypes.forEach(one => {
        if (params.budgetTypes[0] === one.budgetId) {
          budgetTypeNames.push(one.budgetName)
          if (one.childList) {
            one.childList.forEach(two => {
              if (params.budgetTypes[0] === one.budgetId) {
                budgetTypeNames.push(two.budgetName)
                if (two.childList) {
                  two.childList.forEach(three => {
                    if (params.budgetTypes[0] === one.budgetId) {
                      budgetTypeNames.push(three.budgetName)
                    }
                  })
                }
              }
            })
          }
        }
      })

      params.budgetTypeName = budgetTypeNames.join("-")

      params.goodsTypeName = this.goodsTypes.find(one => one.dictCode === params.goodsType)?.dictLabel
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

      // debugger
      this.formData.orderDetailList[index].supplierName = this.supplierMap[supplierId].supplierName
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
    },
    goBack() {
      this.$emit('closeOrderDetail')
    },
    isOverDate(dateStr) {
      return this.monent(dateStr).isBefore(this.monent()) ? '已到期' : ''
    },
    supplierValidator(rule, value, callback){
      let supplierId = value
      if (value === '') {
        callback(new Error('请选择供应商'))
      } else {
        let supplier = this.supplierOptions.find(one => one.supplierId === supplierId)
        let validityDate = supplier.validityDate
        if (this.isOverDate(validityDate)){
          callback(new Error('供应商已到期'))
        }else {
          callback()
        }
      }
    }
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
  },
  watch: {
    dialogAddEntry(val) {
      if (val) {
        this.formTitle = "新增入库单"
        this.formData.orderType = '0'
        this.formData.applyUserId = this.currUser.userId
        this.formData.applyName = this.currUser.nickName
        this.formData.applyDepart = this.currUser.deptId
        this.formData.applyDepartName = this.currUser.deptName
        this.formData.applyDate=this.monent().format('YYYY-MM-DD')

        this.getBudgetTypeList()
        this.getSupplierList()
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
