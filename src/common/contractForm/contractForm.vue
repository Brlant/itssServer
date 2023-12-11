<template>
  <el-dialog :visible="dialogContractForm" :title="formTitle" width="60%" @close="closeAddForm">
    <template v-slot:title>
      <div style="font-weight: bold;font-size: 15px">{{ formTitle }}</div>
    </template>
    <div class="jiBenXinXi">
      基本信息
    </div>
    <!--绘制基本信息表单-->
    <el-form ref="formData" :model="formData" label-width="120px" :rules="formRules">
      <el-row>
        <el-col :span="8">
          <el-form-item label="合同档案编号" prop="contractArchiveNo">
            <el-input v-model="formData.contractArchiveNo" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同编号" prop="contractNo">
            <el-input v-model="formData.contractNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同名称" prop="contractName">
            <el-input v-model="formData.contractName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!--      第二行-->
      <el-row>
        <el-col :span="8">
          <el-form-item label="合同类型" prop="contractType">
            <el-select v-model="formData.contractType" placeholder="请选择">
              <el-option label="采购合同" value="purchase"></el-option>
              <el-option label="销售合同" value="sale"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商名称" prop="supplierName">
            <el-input v-model="formData.supplierName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同金额" prop="contractAmount">
            <el-input-number v-model="formData.contractAmount" :precision="2"
                             controls-position="right"></el-input-number>
          </el-form-item>
        </el-col>
        <!--        第三行-->
        <el-row>
          <el-col :span="8">
            <el-form-item label="签订日期" prop="signDate">
              <el-date-picker v-model="formData.signDate" type="date" placeholder="请选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到期日期" prop="expireDate">
              <el-date-picker v-model="formData.expireDate" type="date" placeholder="请选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同签署人" prop="signer">
              <el-input v-model="formData.signer"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        第四行-->
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="formData.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        第五行-->
        <el-row>
          <el-col :span="24">
            <el-form-item label="文件下载">
              <el-link :href="formData.downloadUrl" target="_blank">{{ formData.downloadUrl }}</el-link>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        第六行-->
        <el-row>
          <el-col :span="24">
            <el-form-item label="合同续签" prop="isRenew">
              <el-radio-group v-model="formData.isRenew">
                <el-radio label="yes">是</el-radio>
                <el-radio label="no">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        提交-->
        <el-row>
          <el-col :span="24" style="text-align: center; margin-top: 20px;">
            <el-button type="primary" @click="submitForm">提交</el-button>
          </el-col>
        </el-row>
      </el-row>
    </el-form>
  </el-dialog>

</template>

<script>
export default {
  name: "contractForm",
  props: {
    dialogContractForm: {
      type: Boolean,
      default: ""
    }
  },
  data() {
    return {
      formTitle: "基本信息",
      formData: {
        contractArchiveNo: '1000001',
        contractNo: '20230402030',
        contractName: 'XXX供应商采购电脑',
        contractType: 'purchase',
        supplierName: '供应商1',
        contractAmount: '2384.32',
        signDate: '2023/12/10',
        expireDate: '2023/12/10',
        signer: '郑浩',
        remark: '',
        downloadUrl: '',
        isRenew: 'yes'
      },
      formRules: {
        contractArchiveNo: [
          {required: true, message: '请输入合同档案编号', trigger: 'blur'}
        ],
        contractNo: [
          {required: true, message: '请输入合同编号', trigger: 'blur'}
        ],
        contractName: [
          {required: true, message: '请输入合同名称', trigger: 'blur'}
        ],
        contractType: [
          {required: true, message: '请选择合同类型', trigger: 'change'}
        ],
        supplierName: [
          {required: true, message: '请输入供应商名称', trigger: 'blur'}
        ],
        contractAmount: [
          {required: true, message: '请输入合同金额', trigger: 'blur'}
        ],
        signDate: [
          {required: true, message: '请选择签订日期', trigger: 'change'}
        ],
        expireDate: [
          {required: true, message: '请选择到期日期', trigger: 'change'}
        ],
        signer: [
          {required: true, message: '请输入合同签署人', trigger: 'blur'}
        ],
        isRenew: [
          {required: true, message: '请选择合同续签', trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    /*组件传递,关闭表单*/
    closeAddForm() {
      this.$emit("closeAddForm")
    },
    /*文件提交*/
    submitForm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          // 在这里可以进行表单提交操作，比如调用接口提交数据
          this.$message({
            message: '表单提交成功',
            type: 'success'
          });
        } else {
          this.$message.error('表单验证失败，请检查输入内容');
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

/deep/ .el-input__inner {
  border: none;
  background-color: rgba(255, 255, 255, 0);
}
</style>
