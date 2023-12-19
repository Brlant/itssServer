<template>
  <el-dialog :visible="dialogAddFiles" :title="formTitle" width="60%" @close="closeAddFiles">
    <template v-slot:title>
      <div style="font-weight: bold;font-size: 15px">{{ formTitle }}</div>
    </template>
    <template>
      <el-form ref="form" :model="formData" label-width="100px" :rules="rules">
        <el-row :gutter="20">
          <!-- 第一行 -->
          <el-col :span="8">
            <el-form-item label="物品类型" prop="itemType">
              <el-select v-model="formData.itemType" placeholder="物品类型" clearable>
                <el-option
                  v-for="(item,index) in listOfItemTypes"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物品名称" prop="itemName">
              <el-input v-model="formData.itemName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="supplier" label="供应商">
              <el-select v-model="formData.supplier" filterable :filter-method="getSupplierList" placeholder="供应商" clearable>
                <el-option
                  v-for="(item,index) in supplierList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

<!--            <el-form-item label="供应商" prop="supplier">-->
<!--              <el-select v-model="formData.supplier">-->
<!--                <el-option label="供应商A" value="supplierA"></el-option>-->
<!--                <el-option label="供应商B" value="supplierB"></el-option>-->
<!--                <el-option label="供应商C" value="supplierC"></el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <!-- 第二行 -->
          <el-col :span="8">
            <el-form-item label="型号" prop="model">
              <el-input v-model="formData.model"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="规格" prop="specification">
              <el-input v-model="formData.specification"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位" prop="unit">
              <el-select v-model="formData.unit" placeholder="物品类型" clearable>
                <el-option
                  v-for="(item,index) in unitList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <!-- 第三行 -->
          <el-col :span="8">
            <el-form-item label="采购价" prop="purchasePrice">
              <el-input v-model="formData.purchasePrice">
                <span slot="append">元</span>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="税率" prop="taxRate">
              <el-select v-model="formData.taxRate" placeholder="物品类型" clearable>
                <el-option
                  v-for="(item,index) in taxRateList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="不含税进价" prop="untaxedPrice">
              <el-input v-model="untaxedPrice" :disabled="true"  readonly >
                <span slot="append">元</span>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <!-- 第四行 -->
          <el-col :span="8">
            <el-form-item label="物品分类" prop="category">
              <el-select v-model="formData.category">
                <el-option label="分类A" value="categoryA"></el-option>
                <el-option label="分类B" value="categoryB"></el-option>
                <el-option label="分类C" value="categoryC"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="箱规" prop="cartonSpec">
              <el-input v-model="formData.cartonSpec"></el-input>
              <span slot="append">/箱</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌" prop="brand">
              <el-input v-model="formData.brand"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <!-- 第五行 -->
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="formData.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>


        <el-row :gutter="20">

        </el-row>

        <el-row :gutter="20">
          <!-- 提交按钮 -->
          <el-col >
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button>返回</el-button>
          </el-col>
        </el-row>
      </el-form>
    </template>
  </el-dialog>
</template>

<script>
import filesApi from '@/api/Files/files'
import supplierApi from '@/api/supplier/supplier'
export default {
  name: "filesForm",
  props: {
    dialogAddFiles: {
      type: Boolean,
      default: "",
    }
  },
  data() {
    return {
      formTitle: "基本信息",//弹框标题名
      formData: {
        itemType: '',
        itemName: '',
        supplier: '',
        model: '',
        specification: '',
        unit: '',
        purchasePrice: '',
        taxRate: '',
        untaxedPrice: '',
        category: '',
        cartonSpec: '',
        brand: '',
        remark: '',
        fileList: [],
      },
      rules: {
        itemType: [{required: true, message: '请输入物品类型', trigger: 'blur'}],
        itemName: [{required: true, message: '请输入物品名称', trigger: 'blur'}],
        supplier: [{required: true, message: '请选择供应商', trigger: 'change'}],
        // model: [{required: true, message: '请输入型号', trigger: 'blur'}],
        // specification: [{required: true, message: '请输入规格', trigger: 'blur'}],
        unit: [{required: true, message: '请选择单位', trigger: 'change'}],
        purchasePrice: [{required: true, message: '请输入采购价', trigger: 'blur'}],
        taxRate: [{required: true, message: '请选择税率', trigger: 'change'}],
        untaxedPrice: [{required: true, message: '请输入不含税进价', trigger: 'blur'}],
        category: [{required: true, message: '请输入采购价', trigger: 'blur'}],
        cartonSpec: [{required: true, message: '请选择税率', trigger: 'change'}],
      },
      //物品类型
      listOfItemTypes: [
        {label:'固定资产',value:1},
        {label:'消耗品',value:2},
        {label:'服务',value:3},
        {label:'销售品',value:4},
      ],
      //单位
      unitList:[
        {label:'支',value:1},
        {label:'套',value:2},
        {label:'个',value:3},
        {label:'盒',value:4},
      ],
      //税率
      taxRateList:[
        {label:'1%',value:1},
        {label:'3%',value:2},
        {label:'6%',value:3},
        {label:'12%',value:4},
      ],
      //供应商
      supplierList:[],
    }
  },
  computed:{
    untaxedPrice(){
      return this.formData.purchasePrice / (1 + this.formData.taxRate);
    }
  },
  methods: {
    getSupplierList(query){
      let params = {
        codeNameKey: query,
        pageNum: 1,
        pageSize: 10,
      }
      supplierApi.getSupplierList(params).then((res) => {
        this.supplierList = res.data.rows.map(item => {
          return {
            value: item.supplierId,
            label: item.supplierName
          }
        })
      })
    },
    /*关闭新建弹框*/
    closeAddFiles() {
      this.$emit('closeAddFiles');
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 表单验证通过，提交表单
          console.log(this.formData);
        } else {
          // 表单验证失败
          return false;
        }
      });
    },
    handleUploadSuccess(response, file, fileList) {
      // 文件上传成功回调函数
      this.formData.fileList = fileList;
    },
    handleUploadError(error, file, fileList) {
      // 文件上传失败回调函数
      console.error(error);
    }
  }
}
</script>

<style scoped>

</style>
