<template>
  <el-dialog :visible="dialogContractFilesFiles" :title="formTitle" width="60%" @close="closeAddFiles">
    <template v-slot:title>
      <div style="font-weight: bold;font-size: 15px">{{ formTitle }}</div>
    </template>
    <div class="jiBenXinXi">
      基本信息
    </div>
    <el-form ref="contractForm" :model="formData" label-width="120px" :rules="rules">
      <!-- 第一行 -->
      <el-row>
        <el-col :span="8">
          <el-form-item label="合同编号" prop="contractCode" :rules="rules.contractCode">
            <el-input v-model="formData.contractCode" placeholder="请输入合同编号"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同名称" prop="contractName" :rules="rules.contractName">
            <el-input v-model="formData.contractName" placeholder="请输入合同名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同类型" prop="contractType">
            <el-select v-model="formData.contractType" placeholder="请选择合同类型">
              <el-option label="类型1" value="1"></el-option>
              <el-option label="类型2" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第二行 -->
      <el-row>
        <el-col :span="8">
          <el-form-item label="供应商名称" prop="supplierName">
            <el-input v-model="formData.supplierName" placeholder="请输入供应商名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同金额" prop="contractAmount">
            <el-input v-model="formData.contractAmount" placeholder="请输入合同金额"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="签订日期" prop="signDate">
            <el-date-picker v-model="formData.signDate" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第三行 -->
      <el-row>
        <el-col :span="8">
          <el-form-item label="到期日期" prop="expireDate">
            <el-date-picker v-model="formData.expireDate" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同签署人" prop="signer">
            <el-input v-model="formData.signer" placeholder="请输入合同签署人"/>
          </el-form-item>
        </el-col>
        <el-col :span="8"></el-col>
      </el-row>

      <!-- 第四行 -->
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input v-model="formData.comment" type="textarea" placeholder="请输入备注"/>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第五行 -->
      <el-row>
        <el-col :span="24">
          <el-form-item label="文件上传">
            <el-upload
              class="upload-demo"
              action="/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture-card"
              :show-file-list="false"
              multiple>
              <i class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 表单按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: "contractFiles",
  props:{
    dialogContractFilesFiles:{
      type:Boolean,
      default:""
    }
  },
  data(){
    return{
      formTitle:"基本信息",
      formData: {
        contractCode: '',
        contractName: '',
        contractType: '',
        supplierName: '',
        contractAmount: '',
        signDate: '',
        expireDate: '',
        signer: '',
        comment: '',
      },
      fileList: [],
      rules: {
        contractCode: [{required: true, message: '请输入合同编号', trigger: 'blur'}],
        contractName:[{required: true, message: '请输入合同名称', trigger: 'blur'}],
      }
    }
  },
  methods:{
    /*关闭弹框*/
    closeAddFiles(){
      this.$emit('closeAddFiles')
    },
    submitForm() {
      this.$refs.contractForm.validate(valid => {
        if (valid) {
          // 表单验证通过
          console.log(this.formData);
        } else {
          // 表单验证失败
          console.log('error submit');
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.contractForm.resetFields();
      this.fileList = [];
    },
    handlePreview(file) {
      console.log(file);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
  },
  created() {

  },
  mounted() {

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
</style>
