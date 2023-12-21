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
      <!-- 第一行 -->
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
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="收货人" prop="consigneeName">
            <el-input v-model="formData.consigneeName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="收货人电话" prop="consigneePhone">
            <el-input v-model="formData.consigneePhone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="收货人地址" prop="consigneeAddress">
            <el-input v-model="formData.consigneeAddress"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 第三行 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="预算类型" prop="budgetType" :rules="rules.budgetType">
            <el-cascader
              v-model="formData.budgetType"
              placeholder="请选择预算类型"
              :options="budgeTypes"
              :props="{ label: 'budgetName', value: 'budgetId',children: 'childList'}"
              filterable @change="handlerBudgetTypeChange"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请原由">
            <el-input v-model="formData.reason"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!--订单明细-->
      <!--        <el-form-item label="订单明细" required>-->
      <!--          -->
      <!--        </el-form-item>-->
      <div class="jiBenXinXi">
        订单明细
      </div>
      <div style="margin-bottom: 22px">
        <el-table :data="formData.orderDetailList" border>
          <el-table-column type="index" width="60"></el-table-column>
          <el-table-column prop="supplier" label="供应商名称">
            <template v-slot="scope">
              <el-form-item :prop="`orderDetailList.${scope.$index}.supplierId`" label-width="0"
                            :rules="[{required: true, message: '请选择供应商名称', trigger: 'change'}]">
                <el-select v-model="scope.row.supplier" placeholder="请选择供应商名称"
                           filterable
                           @change="getGoodsList(scope.row.supplier,scope.$index)">
                  <el-option v-for="(option,index) in supplierOptions" :key="option.value" :label="option.label"
                             :value="option.value+'__'+option.label"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="物品类型">
            <template v-slot="scope">
              <el-form-item :prop="`orderDetailList.${scope.$index}.type`" label-width="0"
                            :rules="[{required: true, message: '请选择物品类型', trigger: 'change'}]">
                <el-select v-model="scope.row.type" placeholder="请选择物品类型" style="width: 100%"
                           :rules="rules.type">
                  <el-option v-for="option in typeOptions" :key="option.value" :label="option.label"
                             :value="option.value"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="code" label="物品编号">
            <template v-slot="scope">
              <el-form-item :prop="`orderDetailList.${scope.$index}.goodsCode`" label-width="0"
                            :rules="[{required: true, message: '请选择物品编号'}]">
                <el-select v-model="scope.row.goodsInfo" placeholder="请选择物品编号" style="width: 100%"
                           :rules="rules.code" filterable
                           @change="goodsChangeHandler(scope.row.goodsInfo,scope.$index)">
                  <el-option v-for="option in formData.orderDetailList[scope.$index].goodsList"
                             :key="option.value"
                             :label="option.goodsCode"
                             :value="option.goodsId+'__'+option.goodsCode+'__'+option.goodsName+'__'+option.taxBid+'__'+option.nonTaxBid+'__'+option.taxRate"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="物品名称">
            <template v-slot="scope">
              <el-form-item :prop="`orderDetailList.${scope.$index}.goodsName`" label-width="0"
                            :rules="[{required: true, message: '请选择物品名称'}]">
                <el-select v-model="scope.row.goodsInfo" placeholder="请选择物品名称" style="width: 100%"
                           :rules="rules.name" @change="goodsChangeHandler(scope.row.goodsInfo,scope.$index)">
                  <el-option v-for="option in formData.orderDetailList[scope.$index].goodsList"
                             :key="option.value"
                             :label="option.goodsName"
                             :value="option.goodsId+'__'+option.goodsCode+'__'+option.goodsName+'__'+option.taxBid+'__'+option.nonTaxBid+'__'+option.taxRate"
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
              <span>{{ scope.row.taxRateName }}</span>
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
                            :rules="[{ required: true, message: '请输入数量', trigger: 'blur'},{type: 'number',min:1,  message: '数量必须大于0（正整数）', trigger: 'blur'}]">
                <el-input @change="calculateTotal(scope.row)"
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
          <el-table-column width="100px">
            <template v-slot="scope">
              <el-button circle size="small" icon="el-icon-plus" type="primary" @click="addRow"
                         v-if="scope.$index === 0"></el-button>
              <el-button circle size="small" icon="el-icon-minus" type="danger" @click="deleteRow(scope.index)"
                         v-if="formData.orderDetailList.length > 1"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 提交按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="handleEntryClose">返回</el-button>
      </el-form-item>

    </el-form>
  </el-dialog>
</template>

<script>
import request from '@/utils/request'
import orderApi from '@/api/pms/order'

export default {
  name: "wareHouseEntry",
  props: {
    dialogAddEntry: {
      type: Boolean,
      default: '',
    }
  },
  data() {
    return {
      formTitle: "基本信息",
      formData: {
        applyDepart: 1,
        applyDepartName: '',
        applyName: '',
        applyUserId: 1,
        orderType: '',
        pmsOrderStatus: 1,
        applyDate: '',
        // 预算类型
        budgeType: 1,
        applyReason: '',
        paymentFlag: 1,
        orderBizType: '',
        recipientId: 1,
        recipientName: '',
        // 领用部门id
        recipientDepartId: '',
        recipientDepartName: '',
        receiptUrl: '',
        invoiceNum: '',
        paymentUrl: '',
        invoiceUrl: '',
        consigneeName: '',
        consigneePhone: '',
        consigneeAddress: '',
        orderDetailList: [],
      },
      rules: {
        applyName: [{required: true, message: '请选择发起人', trigger: 'blur'}],
        applyDepartName: [{required: true, message: '请选择发起人部门', trigger: 'blur'}],
        applyDate: [{required: true, message: '请选择发起日期', trigger: 'blur'}],
        orderBizType: [{required: true, message: '请选择订单类型', trigger: 'blur'}],
        budgetType: [{required: true, message: '请输入预算类型', trigger: 'blur'}],
      },
      supplierOptions: [],
      // 物品类型:固定资产、消耗品、服务、销售品
      typeOptions: [
        {value: '1', label: '固定资产'},
        {value: '2', label: '消耗品'},
        {value: '3', label: '服务'},
        {value: '4', label: '销售品'},
      ],
      goodsListOption: {
        'supplierId': []
      },
      orderBizTypes: [
        {label: '采购入库', value: '1-0'},
        {label: '盘盈入库', value: '1-2'},
        {label: '领用入库', value: '1-4'},
      ],
      budgeTypes: []
    }
  },
  methods: {
    /*关闭弹框*/
    handleEntryClose() {
      this.$refs.form.resetFields()
      this.$emit('handleEntryClose')
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
      row.totalTaxBid = row.taxBid * row.taxRate * row.amount;
      row.nonTotalTaxBid = row.nonTaxBid * row.taxRate * row.amount;
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 在这里处理表单提交逻辑
          this.addOrder()
        }
      });
    },
    addOrder() {
      orderApi.addPmsOrder(this.formData).then((res) => {
        this.$message({
          type: 'success',
          message: '提交成功'
        });
        this.handleEntryClose()
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.message
        });
      })
    },
    getSupplierList(keyword = '') {
      request.post('/pms/supplier/queryOverview', {
        codeNameKey: keyword,
        pageNum: 1,
        pageSize: 1000
      }).then((res) => {
        this.supplierOptions = res.data.rows.map(item => {
          return {
            value: item.supplierId,
            label: item.supplierName
          }
        });
      })
    },
    getBudgeTypeList(keyword = '') {
      request.get('/system/budget/getList', {
        params: {
          budgetName: keyword
        }
      }).then(({data}) => {
        this.budgeTypes = data;
      })
    },
    handlerBudgetTypeChange(value) {
      console.log(value);
    },
    getGoodsList(supplier, index) {
      this.formData.orderDetailList[index].goodsId = ''
      this.formData.orderDetailList[index].goodsList = []
      this.$set(this.goodsListOption, `${index.goodsList}`, [])
      let supplierId = supplier.split('__')[0]
      let supplierName = supplier.split('__')[1]
      this.formData.orderDetailList[index].supplierId = supplierId
      this.formData.orderDetailList[index].supplierName = supplierName

      let goodsList = this.goodsListOption[supplierId]
      if (!goodsList) {
        request.get('/pms/goods/queryAllList', {
          params: {
            supplierId: supplierId
          }
        }).then(res => {
          this.goodsListOption[supplierId] = res.data
          this.formData.orderDetailList[index].goodsList = res.data
          this.$set(this.formData.orderDetailList, `${index.goodsList}`, res.data)
        })
      } else {
        this.goodsListOption[supplierId] = goodsList
        this.formData.orderDetailList[index].goodsList = goodsList
      }


    },
    goodsChangeHandler(goodsInfo, index) {
      let goodsSplit = goodsInfo.split('__')
      let goodsId = goodsSplit[0]
      let goodsCode = goodsSplit[1]
      let goodsName = goodsSplit[2]
      let taxBid = goodsSplit[3]
      let nonTaxBid = goodsSplit[4]
      let taxRate = Number(goodsSplit[5])

      if (goodsInfo) {
        this.formData.orderDetailList[index].goodsId = goodsId
        this.formData.orderDetailList[index].goodsCode = goodsCode
        this.formData.orderDetailList[index].goodsName = goodsName
        this.formData.orderDetailList[index].taxBid = taxBid
        this.formData.orderDetailList[index].nonTaxBid = nonTaxBid
        this.formData.orderDetailList[index].taxRate = taxRate
        if (taxRate) {
          this.formData.orderDetailList[index].taxRateName = (taxRate * 100) + '%'
        }

        this.formData.orderDetailList[index].totalTaxBid = taxBid * taxRate
        this.formData.orderDetailList[index].nonTotalTaxBid = nonTaxBid * taxRate
      }
    },
  },
  computed: {
    // 当前登录用户
    currUser() {
      return this.$store.state.user.user
    }
  },
  mounted() {

  },
  watch: {
    dialogAddEntry(val) {
      if (val) {
        this.formTitle = "新增入库单"
        this.formData = {
          applyDepart: this.currUser.deptId,
          applyDepartName: this.currUser.deptName,
          applyName: this.currUser.nickName,
          applyUserId: this.currUser.userId,
          orderType: '0',
          pmsOrderStatus: '',
          applyDate: this.monent().format('YYYY-MM-DD'),
          // 预算类型
          budgeType: '',
          applyReason: '',
          orderBizType: '',
          recipientId: '',
          recipientName: '',
          // 领用部门id
          recipientDepartId: '',
          recipientDepartName: '',
          receiptUrl: '',
          invoiceNum: '',
          paymentUrl: '',
          invoiceUrl: '',
          consigneeName: '',
          consigneePhone: '',
          consigneeAddress: '',
          orderDetailList: [],
        }

        // 默认有一条数据
        this.addRow()
        this.getBudgeTypeList()
        this.getSupplierList()
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
