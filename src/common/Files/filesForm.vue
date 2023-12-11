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
              <el-input v-model="formData.itemType"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物品名称" prop="itemName">
              <el-input v-model="formData.itemName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商" prop="supplier">
              <el-select v-model="formData.supplier">
                <el-option label="供应商A" value="supplierA"></el-option>
                <el-option label="供应商B" value="supplierB"></el-option>
                <el-option label="供应商C" value="supplierC"></el-option>
              </el-select>
            </el-form-item>
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
              <el-select v-model="formData.unit">
                <el-option label="个" value="个"></el-option>
                <el-option label="箱" value="箱"></el-option>
                <el-option label="件" value="件"></el-option>
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
              <el-select v-model="formData.taxRate">
                <el-option label="0%" value="0"></el-option>
                <el-option label="3%" value="3"></el-option>
                <el-option label="6%" value="6"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="不含税进价" prop="untaxedPrice">
              <el-input v-model="formData.untaxedPrice">
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
              <span slot="append">元</span>
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
          <!-- 第六行 -->
          <el-col :span="24">
            <el-form-item label="文件上传" prop="file">
              <el-upload
                action="/upload"
                :on-success="handleUploadSuccess"
                :on-error="handleUploadError"
                :file-list="formData.fileList"
                list-type="text"
              >
                <el-button size="small" type="primary">选择文件</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>




        <el-row :gutter="20">
          <!-- 提交按钮 -->
          <el-col :span="24" style="text-align: right">
            <el-button type="primary" @click="submitForm">提交</el-button>
          </el-col>
        </el-row>
      </el-form>
    </template>
  </el-dialog>
</template>

<script>
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
        fileList: []
      },
      rules: {
        itemType: [{required: true, message: '请输入物品类型', trigger: 'blur'}],
        itemName: [{required: true, message: '请输入物品名称', trigger: 'blur'}],
        supplier: [{required: true, message: '请选择供应商', trigger: 'change'}],
        model: [{required: true, message: '请输入型号', trigger: 'blur'}],
        specification: [{required: true, message: '请输入规格', trigger: 'blur'}],
        unit: [{required: true, message: '请选择单位', trigger: 'change'}],
        purchasePrice: [{required: true, message: '请输入采购价', trigger: 'blur'}],
        taxRate: [{required: true, message: '请选择税率', trigger: 'change'}],
        untaxedPrice: [{required: true, message: '请输入不含税进价', trigger: 'blur'}],
        category: [{required: true, message: '请输入采购价', trigger: 'blur'}],
        cartonSpec: [{required: true, message: '请选择税率', trigger: 'change'}],
      }
    }
  },
  methods: {
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
