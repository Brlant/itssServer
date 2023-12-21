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
          <el-input v-model="formData.pmsOrderNo" placeholder="请选择入订单编号" disabled></el-input>
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
    <!-- 第三行 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="预算类型" prop="budgetTypes" :rules="rules.budgetTypes">
          <el-cascader
            v-model="formData.budgetTypes"
            placeholder="请选择预算类型"
            :options="budgetTypes"
            :props="{ label: 'budgetName', value: 'budgetId',children: 'childList'}"
            filterable :disabled="readonly"></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="申请原由">
          <el-input v-model="formData.applyReason" :readonly="readonly"></el-input>
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
    <el-table :data="formData.orderDetailList" border>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="supplier" label="供应商名称">
        <template v-slot="scope">
          <el-form-item :prop="`orderDetailList.${scope.$index}.supplierId`" label-width="0"
                        style="margin-top: 22px"
                        :rules="[{required: true, message: '请选择供应商名称', trigger: 'change'}]">
            <el-select v-model="scope.row.supplierId" placeholder="请选择供应商名称"
                       filterable :disabled="readonly"
                       @change="getGoodsList(scope.row.supplierId,scope.$index)">
              <el-option v-for="(option,index) in supplierOptions" :key="option.value" :label="option.label"
                         :value="option.value"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="物品类型">
        <template v-slot="scope">
          <el-form-item :prop="`orderDetailList.${scope.$index}.goodsType`" label-width="0"
                        style="margin-top: 22px"
                        :rules="[{required: true, message: '请选择物品类型', trigger: 'change'}]">
            <el-select v-model="scope.row.goodsType" placeholder="请选择物品类型" style="width: 100%" :disabled="readonly">
              <el-option v-for="option in typeOptions" :key="option.value" :label="option.label"
                         :value="option.value"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="code" label="物品编号">
        <template v-slot="scope">
          <el-form-item :prop="`orderDetailList.${scope.$index}.goodsCode`" label-width="0"
                        style="margin-top: 22px"
                        :rules="[{required: true, message: '请选择物品编号'}]">
            <el-select v-model="scope.row.goodsInfo" placeholder="请选择物品编号" style="width: 100%"
                       filterable :disabled="readonly"
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
                        style="margin-top: 22px"
                        :rules="[{required: true, message: '请选择物品名称'}]">
            <el-select v-model="scope.row.goodsInfo" placeholder="请选择物品名称" style="width: 100%"
                       filterable :disabled="readonly"
                       @change="goodsChangeHandler(scope.row.goodsInfo,scope.$index)">
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
                        style="margin-top: 22px"
                        :rules="[{ required: true, message: '请输入数量', trigger: 'blur'},{type: 'number',min:1,  message: '数量必须大于0（正整数）', trigger: 'blur'}]">
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
      <el-table-column width="100px">
        <template v-slot="scope">
          <el-button circle size="small" icon="el-icon-plus" type="primary" @click="addRow"
                     v-if="scope.$index === 0 && !readonly"></el-button>
          <el-button circle size="small" icon="el-icon-minus" type="danger" @click="deleteRow(scope.$index)"
                     v-if="formData.orderDetailList.length > 1 && !readonly"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 提交按钮 -->
    <el-form-item style="margin-top: 22px">
      <el-button
        v-show="formData.supplierStatus === 5"
        icon="el-icon-delete"
        @click="enableSupplier(formData.supplierId, 3)"
      >启用
      </el-button>
      <el-button
        v-show="formData.supplierStatus === 3"
        icon="el-icon-delete"
        @click="enableSupplier(formData.supplierId, 5)"
      >停用
      </el-button>
      <el-button
        v-show="formData.supplierStatus === 5 || formData.supplierStatus === 3"
        icon="el-icon-delete"
        @click="enableSupplier(formData.supplierId, 6)"
      >淘汰
      </el-button>
      <el-button
        v-show="formData.returnButton && (formData.supplierStatus === 2 || formData.supplierStatus === 4)"
        icon="el-icon-delete"
        @click="handleDelete"
      >删除
      </el-button>
      <el-button icon="el-icon-edit"
                 v-show="formData.supplierStatus === 2 || formData.supplierStatus === 3 || formData.supplierStatus === 4"
                 @click="submitForm"
      >重新提交
      </el-button>
      <el-button type="success"
                 v-show="formData.examineButton && (formData.supplierStatus === 0 || formData.supplierStatus === 1)"
                 @click="auditPass"
      >审核通过
      </el-button>
      <el-button type="danger"
                 v-show="formData.examineButton && (formData.supplierStatus === 0 || formData.supplierStatus === 1)"
                 @click="auditNoPass"
      >审核不通过
      </el-button>
      <el-button v-show="formData.supplierStatus === 0 || formData.supplierStatus === 1"
                 type="danger"
                 @click="revocation"
      >撤回
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {getOrderDetail} from '@/api/pms/order'
import request from '@/utils/request'

export default {
  name: "entryInfo",
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
      return !(this.formData.supplierStatus === 2
        || this.formData.supplierStatus === 4)
    },
  },
  watch: {
    orderId: {
      handler(newVal) {
        if (newVal) {
          console.log('订单详情', newVal);
          // 每次重新进入订单详情后需要重新清空表单校验
          if (this.$refs.form){
            this.$refs.form.clearValidate()
          }

          this.getSupplierList()
          this.getBudgetTypeList()

          this.getOrderDetail(newVal)
        }
      },
      immediate: true,
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
        orderType: '',
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
        budgetTypes: [{required: true, message: '请输入预算类型', trigger: 'blur'}],
      },
      supplierMap: {},
      supplierOptions: [],
      // 物品类型:固定资产、消耗品、服务、销售品
      typeOptions: [
        {value: 1, label: '固定资产'},
        {value: 2, label: '消耗品'},
        {value: 3, label: '服务'},
        {value: 4, label: '销售品'},
      ],
      goodsListOption: {
        'supplierId': []
      },
      orderBizTypes: [
        {label: '采购入库', value: '1-0'},
        {label: '盘盈入库', value: '1-2'},
        {label: '领用入库', value: '1-4'},
      ],
      budgetTypes: []
    }
  },
  methods: {
    getOrderDetail(orderId) {
      getOrderDetail(orderId).then(res => {
        res.data.orderDetailList = res.data.orderDetailList.map((item, index) => {
          return {
            ...item,
            taxRateName: Number(item.taxRate) + '%',
            goodsInfo: item.goodsId + '__' + item.goodsCode + '__' + item.goodsName + '__' + item.taxBid + '__' + item.nonTaxBid + '__' + item.taxRate
          }
        })

        if (res.data.budgetType){
          let budgetType = res.data.budgetType.split("-")
          if(budgetType.length === 3){
            let budgetTypes = []
            budgetTypes.push(parseInt(budgetType[0]))
            budgetTypes.push(parseInt(budgetType[1]))
            budgetTypes.push(parseInt(budgetType[2]))
            res.data.budgetTypes = budgetTypes
          }
        }

        this.formData = res.data
        this.formData.orderDetailList.forEach((item, index) => {
          this.getGoodsList(item.supplierId, index)
        })
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
    // 编辑供应商
    editOrder() {
      this.formData.changeFlag = this.needAudit
      editOrder(this.formData).then(res => {
        if (res.data.code === 200) {
          this.$message.success('编辑成功')
          this.closeHandlerInfo()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    enableSupplier(supplierId, status) {
      this.$confirm('是否确定启用?', '二次确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          supplierId: supplierId,
          supplierStatus: status,
        }
        enableSupplier(params).then((res) => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.closeHandlerInfo();
        })
      })
    },
    /*删除*/
    handleDelete() {
      this.$confirm('此操作将永久删除该供应商档案, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSupplier(this.formData.supplierId).then((res) => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.closeHandlerInfo();
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
          supplierId: this.formData.supplierId,
          examineType: 1,
        }
        auditSupplier(params).then((res) => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.closeHandlerInfo();
        })
      })
    },
    /*审核不通过*/
    auditNoPass() {
      this.$prompt('请填写审核不通过的原因', "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        inputErrorMessage: "原因不能为空"
      }).then(({value}) => {
        let params = {
          supplierId: this.formData.supplierId,
          examineType: 2,
          remark: value,
        }

        auditSupplier(params).then((res) => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.closeHandlerInfo();
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
          supplierId: this.formData.supplierId,
          examineType: 3
        }

        auditSupplier(params).then((res) => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.closeHandlerInfo()
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
    getSupplierList(keyword = '') {
      request.post('/pms/supplier/queryOverview', {
        codeNameKey: keyword,
        pageNum: 1,
        pageSize: 1000
      }).then((res) => {
        this.supplierOptions = res.data.rows.map(item => {
          this.supplierMap[item.supplierId] = item.supplierName
          return {
            value: item.supplierId,
            label: item.supplierName
          }
        });
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
    getGoodsList(supplierId, index) {
      // this.formData.orderDetailList[index].goodsId = ''
      // this.formData.orderDetailList[index].goodsList = []
      // this.$set(this.goodsListOption, `${index.goodsList}`, [])
      this.formData.orderDetailList[index].supplierId = supplierId
      this.formData.orderDetailList[index].supplierName = this.supplierMap[supplierId]

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
      console.log(goodsInfo)
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

/*/deep/ .el-input__inner {*/
/*  border: none;*/
/*  background-color: rgba(255, 255, 255, 0);*/
/*}*/

>>> .el-form-item {
  margin-left: 0;
}

</style>
