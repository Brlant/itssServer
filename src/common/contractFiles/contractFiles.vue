<template>
  <el-dialog :visible="dialogContractFilesFiles"
             :title="formTitle"
             width="60%"
             @open="open"
             @close="closeAddFiles">
    <template v-slot:title>
      <div style="font-weight: bold;font-size: 15px">{{ formTitle }}</div>
    </template>
    <div class="jiBenXinXi">
      基本信息
    </div>
    <el-form ref="contractForm"
             :model="formData"
             label-width="120px"
             :rules="rules">
      <!-- 第一行 -->
      <el-row>
        <el-col :span="8">
          <el-form-item label="合同编号"
                        prop="contractCode">
            <el-input v-model="formData.contractCode"
                      maxlength="50"
                      placeholder="请输入合同编号"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同名称"
                        prop="contractName"
                        :rules="rules.contractName">
            <el-input v-model="formData.contractName"
                      maxlength="50"
                      placeholder="请输入合同名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同类型"
                        prop="contractType">
            <el-select v-model="formData.contractType"
                       placeholder="请选择合同类型">
              <el-option
                v-for="(item,index) in contractTypeList"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictCode"
                :disabled="item.status !== '0'"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第二行 -->
      <el-row>
        <el-col :span="8">
          <el-form-item label="供应商名称"
                        prop="supplierId">
            <el-select v-model="formData.supplierId"
                       filterable
                       placeholder="请选择供应商">
              <el-option v-for="supplier in supplierList"
                         :key="supplier.supplierId"
                         :value="supplier.supplierId"
                         :label="supplier.supplierName"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同金额"
                        prop="contractAmount">
            <el-input v-model.number="formData.contractAmount" type="number"
                      @input="changeAmount"
                      placeholder="请输入合同金额"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="签订日期"
                        prop="signingDate">
            <el-date-picker v-model="formData.signingDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期"
                            style="width: 100%"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第三行 -->
      <el-row>
        <el-col :span="8">
          <el-form-item label="到期日期"
                        prop="dueDate">
            <el-date-picker v-model="formData.dueDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期"
                            style="width: 100%"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同签署人"
                        prop="contractSignatory">
            <el-input v-model="formData.contractSignatory"
                      maxlength="20"
                      placeholder="请输入合同签署人"/>
          </el-form-item>
        </el-col>
        <el-col :span="8"></el-col>
      </el-row>

      <!-- 第四行 -->
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注"
                        prop="remark">
            <el-input v-model="formData.remark"
                      maxlength="1000"
                      type="textarea"
                      placeholder="请输入备注"/>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第五行 -->
      <el-row>
        <el-col :span="24">
          <el-form-item label="文件上传">
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="handleSuccess"
              accept=".png,.jpg,application/pdf"
            >
              <el-button size="small"
                         type="primary"
                         icon="el-icon-upload">选择文件
              </el-button>
              <!--              <i v-if="!formData.scanningCopyUrl" class="el-icon-plus"></i>-->
              <!--              <img v-else :src="formData.scanningCopyUrl" alt="合同扫描件"/>-->
            </el-upload>
            <el-input v-if="fileName"
                      v-model="fileName"
                      readonly
                      style="margin-top: 20px;">
              <template v-if="fileName"
                        slot="append">
                <el-button>
                  <el-link :href="formData.scanningCopyUrl"
                           :underline="false"
                           icon="el-icon-download"></el-link>
                </el-button>
                <el-button @click="fileDelete">
                  <el-link :underline="false"
                           icon="el-icon-delete"></el-link>
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 表单按钮 -->
      <el-form-item>
        <el-button type="primary"
                   @click="submitForm" :disabled="doing">提交
        </el-button>
        <el-button @click="closeAddFiles">返回</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import {addContractFile} from '@/api/contractFilesManagement/contractFilesManagement';
import supplierApi from '@/api/supplier/supplier';
import request, {uploadUrl} from '@/utils/request'
import {getDicts} from '@/api/system/dict/data'

export default {
  name: "contractFiles",
  props: {
    dialogContractFilesFiles: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      doing:false,
      uploadUrl: uploadUrl,
      formTitle: "合同档案信息",
      supplierList: [],
      formData: {
        contractCode: null,
        contractName: null,
        contractType: null,
        contractAmount: null,
        contractSignatory: null,
        remark: null,
        signingDate: null,
        dueDate: null,
        supplierId: null,
        supplierName: null,
        scanningCopyUrl: null
      },
      rules: {
        // contractCode: [{required: true, message: '请输入合同编号', trigger: 'blur'}],
        contractName: [{required: true, message: '请输入合同名称', trigger: 'blur'}],
        supplierId: [{required: true, message: '请选择供应商', trigger: 'change'}],
        // contractAmount:[
        //   {required: true, message: '请输入合同金额', trigger: 'blur'},
        //   {type: 'number', message: '合同金额必须是数字', trigger: 'blur'}
        // ],
        signingDate: [{required: true, message: '请选择合同签订日期', trigger: 'change'}],
        dueDate: [{required: true, message: '请选择合同到期日期', trigger: 'change'}],
        contractType: [{required: true, message: '请选择合同类型', trigger: 'change'}],
        // contractSignatory:[{required: true, message: '请填写合同签署人', trigger: 'blur'}]
      },
      loadSupplier: false,
      contractTypeList: []
    }
  },
  computed: {
    fileName() {
      let start = this.formData.scanningCopyUrl?.lastIndexOf('/');
      if (start > -1) {
        return this.formData.scanningCopyUrl.substr(start + 1);
      }
      return null;
    }
  },
  watch: {
    dialogContractFilesFiles(val){
      if (val){
        this.$refs.contractForm && this.$refs.contractForm.resetFields();
        this.selectSupplier = {};
      }
    }
  },
  methods: {
    changeAmount(value) {
      const reg = /^\d+(\.\d+)?$/;
      if (!reg.test(value)) {
        this.formData.contractAmount = value.replace(/[^\d]/g, '');
      }
      //如果长度大于10位，提示长度超长
      if (value.length > 10) {
        this.$notify.warning('合同金额最多10位');
        this.formData.contractAmount = ''
      }
    },
    open() {
      this.resetForm('contractForm');
      this.getSupplierList();
    },
    /*关闭弹框*/
    closeAddFiles() {
      this.formData.scanningCopyUrl = '';
      this.doing = false;
      this.$emit('closeAddFiles')
    },
    getSupplierList(query) {
      let params = {
        codeNameKey: query,
        supplierStatus: 3,
      }
      // 查询供应商下拉列表
      request.post('pms/supplier/getSupplierList', params).then((res) => {
        this.supplierList = res.data
      })
    },
    fileDelete() {
      this.formData.scanningCopyUrl = null;
    },
    submitForm() {
      if (this.doing) return;
      this.doing = true;
      this.$refs.contractForm.validate(valid => {
        if (valid) {
          // 表单验证通过
          let params = this.formData;
          params.contractTypeName = this.contractTypeList.find(item => item.dictCode === this.formData.contractType)?.dictLabel;
          params.supplierName = this.supplierList.find(item => item.supplierId === this.formData.supplierId)?.supplierName;

          addContractFile(params).then(res => {
            // console.log(res);
            if (res.code === 200) {
              this.$message.success(res.msg);
              this.doing = false;
              this.$emit('closeAddFiles', true);
            }
          }).catch(err => {
            this.doing = false;
            console.error(err);
          });
          //
          //   console.log(this.formData);
          // } else {
          //   // 表单验证失败
          //   console.log('error submit');
          //   return false;
        }else{
          this.doing = false;
        }
      });
    },
    // resetForm() {
    //   this.$refs.contractForm.resetFields();
    //   this.fileList = [];
    // },
    // handleRemove(file, fileList) {
    //   console.log(file, fileList);
    // },
    handleSuccess(res, file) {
      const isPNG = file.raw.type === 'image/png';
      const isJPG = file.raw.type === 'image/jpg';
      const isJPEG = file.raw.type === 'image/jpeg';
      const isPDF = file.raw.type === 'application/pdf';

      if (!isPNG && !isJPG && !isJPEG && !isPDF) {
        this.$message.error('只能上传PNG、JPG图片或PDF文件');
        return false;
      }
      this.formData.scanningCopyUrl = res.data.url;
    },
    getContractTypeList() {
      return getDicts('contract_type').then((res) => {
        this.contractTypeList = res.data
      })
    },
  },
  created() {
    this.getContractTypeList()
  },
  // mounted() {
  //
  // }
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

/deep/ .el-input-group__append {
  background-color: #ffffff;
}
</style>
