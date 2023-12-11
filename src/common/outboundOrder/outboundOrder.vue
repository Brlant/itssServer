<template>
  <el-dialog  :visible="dialogAddOutBoundOrder" :title="formTitle" width="80%" @close="handleOutBoundOrderClose">
    <template v-slot:title>
      <div style="font-weight: bold;font-size: 15px">{{ formTitle }}</div>
    </template>
    <div class="jiBenXinXi">
        基本信息
    </div>
    <template>
      <el-form ref="form" :model="formData"  :rules="rules">
        <!-- 第一行 -->
        <el-form-item label="订单类型" label-width="80px" prop="orderType" :rules="rules.orderType">
          <el-input v-model="formData.orderType"></el-input>
        </el-form-item>

        <!-- 第二行 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="申请人" label-width="80px" prop="applicant" :rules="rules.applicant">
              <el-input v-model="formData.applicant"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请部门" label-width="80px" prop="department" :rules="rules.department">
              <el-input v-model="formData.department"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日期" label-width="80px" prop="applicationDate" :rules="rules.applicationDate">
              <el-date-picker v-model="formData.applicationDate" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第三行 -->
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label-width="80px" label="申请原由">
              <el-input v-model="formData.reason"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--订单编号-->
        <el-row :gutter="20">
          <el-col >
            <el-form-item label-width="80px" label="订单明细" required></el-form-item>
          </el-col>
          <el-col>
            <el-table :data="formData.details" border>
              <el-table-column type="index" width="60"></el-table-column>
              <el-table-column prop="supplier" label="供应商名称">
                <template slot-scope="scope">
                  <el-form-item :prop="`details.${scope.$index}.supplier`" :rules="rules.supplier">
                    <el-select v-model="scope.row.supplier" placeholder="请选择供应商名称" style="width: 100%">
                      <el-option v-for="option in supplierOptions" :key="option.value" :label="option.label"
                                 :value="option.value"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="type" label="物品类型">
                <template slot-scope="scope">
                  <el-form-item :prop="`details.${scope.$index}.type`" :rules="rules.type">
                    <el-select v-model="scope.row.type" placeholder="请选择物品类型" style="width: 100%"
                               :rules="rules.type">
                      <el-option v-for="option in typeOptions" :key="option.value" :label="option.label"
                                 :value="option.value"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="code" label="物品编号">
                <template slot-scope="scope">
                  <el-form-item :prop="`details.${scope.$index}.code`" :rules="rules.code">
                    <el-select v-model="scope.row.code" placeholder="请选择物品编号" style="width: 100%"
                               :rules="rules.code">
                      <el-option v-for="option in codeOptions" :key="option.value" :label="option.label"
                                 :value="option.value"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="物品名称">
                <template slot-scope="scope">
                  <el-form-item :prop="`details.${scope.$index}.name`" :rules="rules.name">
                    <el-select v-model="scope.row.name" placeholder="请选择物品名称" style="width: 100%"
                               :rules="rules.name">
                      <el-option v-for="option in nameOptions" :key="option.value" :label="option.label"
                                 :value="option.value"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="price" label="含税进价">
                <template slot-scope="scope">
                  <el-input :readonly="true" :disabled="true" @input="calculateTotal(scope.row)" v-model.number="scope.row.price"
                            placeholder="请输入含税进价" style="width: 100%"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="taxRate" label="税率">
                <template slot-scope="scope">
                  <el-input :readonly="true" :disabled="true" @input="calculateTotal(scope.row)" v-model.number="scope.row.taxRate"
                            placeholder="请输入税率" style="width: 100%"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="priceWithoutTax" label="不含税进价">
                <template slot-scope="scope">
                  <el-input :readonly="true" :disabled="true" @input="calculateTotal(scope.row)" v-model.number="scope.row.priceWithoutTax"
                            placeholder="请输入不含税进价"
                            style="width: 100%"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="inventoryQuantity" label="库存数量">
                <template slot-scope="scope">
                  <el-input :readonly="true" :disabled="true"  v-model.number="scope.row.inventoryQuantity"
                            placeholder="请输入库存数量"
                            style="width: 100%"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="availableQuantity" label="可用数量">
                <template slot-scope="scope">
                  <el-input :readonly="true" :disabled="true"  v-model.number="scope.row.availableQuantity"
                            placeholder="请输入库存数量"
                            style="width: 100%"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="quantity" label="数量">
                <template slot-scope="scope">
                  <el-form-item :prop="`details.${scope.$index}.quantity`" :rules="rules.quantity">
                    <el-input :rules="rules.quantity" @input="calculateTotal(scope.row)"
                              v-model.number="scope.row.quantity" placeholder="请输入数量"
                              style="width: 100%"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="totalPrice" label="含税总进价">
                <template slot-scope="scope">
                  <span>{{ scope.row.price * scope.row.quantity }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="totalPriceWithoutTax" label="不含税总进价">
                <template slot-scope="scope">
                  <span>{{ scope.row.totalPrice / (1 + scope.row.taxRate) }}</span>
                </template>
              </el-table-column>

              <el-table-column prop="sellingPriceIncludingTax" label="含税售价">
                <template slot-scope="scope">
                  <el-form-item :prop="`details.${scope.$index}.sellingPriceIncludingTax`" :rules="rules.sellingPriceIncludingTax">
                    <el-input :rules="rules.sellingPriceIncludingTax" @input="calculateCountTotal(scope.row)"
                              v-model.number="scope.row.sellingPriceIncludingTax" placeholder="请输入含税售价"
                              style="width: 100%"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column prop="taxRateIncluding" label="税率">
                <template slot-scope="scope">
                  <el-form-item :prop="`details.${scope.$index}.taxRateIncluding`" :rules="rules.taxRateIncluding">
                    <el-input :rules="rules.taxRateIncluding" @input="calculateCountTotal(scope.row)"
                              v-model.number="scope.row.taxRateIncluding" placeholder="请输入税率"
                              style="width: 100%"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column prop="salesPriceExcludingTax" label="不含税售价">
                <template slot-scope="scope">
                  <span>{{ scope.row.sellingPriceIncludingTax / (1 + scope.row.taxRateIncluding) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="grossMargin" label="毛利率">
                <template slot-scope="scope">
                  <span>{{ (scope.row.sellingPriceIncludingTax - scope.row.price ) / scope.row.sellingPriceIncludingTax }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" v-if="scope.$index === 0" size="mini" circle @click="addRow"
                             icon="el-icon-plus"></el-button>
                  <el-button type="danger" v-else size="mini" circle icon="el-icon-minus"
                             @click="deleteRow(scope.$index)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <!-- 提交按钮 -->
        <el-row :gutter="20">
          <el-col :span="24" style="text-align: center;">
            <el-button type="primary" @click="submitForm">提交</el-button>
          </el-col>
        </el-row>
      </el-form>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "outboundOrder",
  props:{
    dialogAddOutBoundOrder:{
      type:Boolean,
      default:""
    }
  },
  data(){
    return{
      formTitle:"基本信息",
      formData: {
        orderType: '',
        applicant: '',
        department: '',
        applicationDate: '',
        reason: '',
        details: [
          {
            supplier: '',
            type: '',
            code: '',
            name: '',
            price: 5,//
            taxRate: 10,
            priceWithoutTax: 10,
            inventoryQuantity:10,
            availableQuantity:10,
            quantity: null,
            totalPrice: 0,
            totalPriceWithoutTax: 0,
            sellingPriceIncludingTax:null,
            taxRateIncluding:null,
            salesPriceExcludingTax: 0,
            grossMargin: 0,
          }
        ]
      },
      rules: {
        orderType: [{required: true, message: '请选择订单类型', trigger: 'blur'}],
        applicant: [{required: true, message: '请输入申请人', trigger: 'blur'}],
        department: [{required: true, message: '请输入申请部门', trigger: 'blur'}],
        applicationDate: [{required: true, message: '请选择申请日期', trigger: 'change'}],

        supplier: [{required: true, message: '请选择供应商名称', trigger: 'blur'}],
        type: [{required: true, message: '请选择物品类型', trigger: 'blur'}],
        code: [{required: true, message: '请选择物品编号', trigger: 'blur'}],
        name: [{required: true, message: '请选择物品名称', trigger: 'blur'}],
        quantity: [{required: true, message: '请输入数量', trigger: 'blur'}],
        sellingPriceIncludingTax:[{required: true, message: '请输入含税售价', trigger: 'blur'}],
        taxRateIncluding:[{required: true, message: '请输入税率', trigger: 'blur'}],
      },

      supplierOptions: [
        {value: 'supplier1', label: '供应商1'},
        {value: 'supplier2', label: '供应商2'},
        {value: 'supplier3', label: '供应商3'}
      ],
      typeOptions: [
        {value: 'type1', label: '物品类型1'},
        {value: 'type2', label: '物品类型2'},
        {value: 'type3', label: '物品类型3'}
      ],
      codeOptions: [
        {value: 'code1', label: '物品编号1'},
        {value: 'code2', label: '物品编号2'},
        {value: 'code3', label: '物品编号3'}
      ],
      nameOptions: [
        {value: 'name1', label: '物品名称1'},
        {value: 'name2', label: '物品名称2'},
        {value: 'name3', label: '物品名称3'}
      ]
    }
  },
  methods:{
    /*关闭弹框*/
    handleOutBoundOrderClose(){
      this.$emit('handleOutBoundOrderClose')
    },
    /*订单明细表格函数*/
    addRow() {
      this.formData.details.push({
        supplier: '',
        type: '',
        code: '',
        name: '',
        price: 0,
        taxRate: 0,
        priceWithoutTax: 0,
        inventoryQuantity:0,
        availableQuantity:0,
        quantity: null,
        totalPrice: 0,
        totalPriceWithoutTax: 0,
        sellingPriceIncludingTax:null,
        taxRateIncluding:null,
        salesPriceExcludingTax: 0,
        grossMargin: 0,
      });
    },
    deleteRow(index) {
      this.formData.details.splice(index, 1);
    },
    calculateTotal(row) {
      row.totalPrice = row.price * row.quantity;
      row.totalPriceWithoutTax = row.totalPrice / (1 + row.taxRate);
    },
    calculateCountTotal(row){
      row.salesPriceExcludingTax = row.sellingPriceIncludingTax / (1 + row.taxRateIncluding)
      row.grossMargin = (row.sellingPriceIncludingTax - row.price ) / row.sellingPriceIncludingTax
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 在这里处理表单提交逻辑
          console.log(this.formData);
        } else {
          console.log('表单校验不通过');
          return false;
        }
      });
    }
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
