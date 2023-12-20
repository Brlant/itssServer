<template>
  <el-form ref="formData"
    :model="formData"
    :rules="formRules"
    label-width="120px">
    <!--    基本信息-->
    <div class="JiBenXinXi">
      基本信息
    </div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="合同档案编号"
          prop="contractRecordCode">
          {{ formData.contractRecordCode }}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="合同编号"
          prop="contractCode">
          {{ formData.contractCode }}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="合同名称"
          prop="contractName">
          {{ formData.contractName }}
        </el-form-item>
      </el-col>
    </el-row>
    <!--  第二行-->
    <el-row>
      <el-col :span="8">
        <el-form-item label="合同类型"
          prop="contractType">
          {{ formData.contractType === 1 ? '采购合同' : '框架合同' }}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="供应商名称"
          prop="supplierName">
          {{ formData.supplierName }}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="合同金额"
          prop="contractAmount">
          {{ formData.contractAmount }}
        </el-form-item>
      </el-col>
    </el-row>
    <!--        第三行-->
    <el-row>
      <el-col :span="8">
        <el-form-item label="签订日期"
          prop="signingDate">
          {{ formData.signingDate }}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="到期日期"
          prop="dueDate">
          {{ formData.dueDate }}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="合同签署人"
          prop="contractSignatory">
          {{ formData.contractSignatory }}
        </el-form-item>
      </el-col>
    </el-row>
    <!--        第四行-->
    <el-row>
      <el-col :span="24">
        <el-form-item label="备注"
          prop="remark">
          {{ formData.remark }}
        </el-form-item>
      </el-col>
    </el-row>
    <!--        第五行-->
    <el-row>
      <el-col :span="24">
        <el-form-item label="文件下载">
          <el-link :href="formData.scanningCopyUrl"
            target="_blank">{{ formData.scanningCopyUrl }}
          </el-link>
        </el-form-item>
      </el-col>
    </el-row>

    <!--        提交-->
    <el-row>
      <el-col :span="24"
        style="text-align: center; margin-top: 20px;">
        <template v-if="formData.examineButton === 1">
          <el-button type="primary"
            @click="auditContract(1)">通过</el-button>
          <el-button type="primary"
            @click="auditContract(2)">不通过</el-button>
        </template>
        <el-button v-if="formData.returnButton === 1" type="primary"
          @click="auditContract(3)">撤回</el-button>
        <el-button v-if="formData.contractStatus === 5" type="primary"
          @click="submitForm">启用</el-button>
        <el-button v-if="formData.contractStatus === 3" type="primary"
          @click="submitForm">停用</el-button>
        <el-button @click="() => $emit('closeDetail')">返回</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { queryByContractId, examineContractInfo, editStatus  } from '@/api/contractFilesManagement/contractFilesManagement'

export default {
  name: "managerInfo",
  props:{
    // tabName: {
    //   type:String,
    //   default:'',
    // },
    contractId: {
      type: String
    }
  },
  watch:{
    // tabName: {
    //   handler(newVal, oldVal) {
    //     console.log('档案信息',newVal);
    //   },
    //   immediate:true,
    //   deep: true,
    // },
    contractId(val) {
      val && this.queryContract(val);
    }
  },
  data() {
    return {
      formTitle: "基本信息",
      formData: {
        contractRecordCode: null,
        contractCode: null,
        contractName: null,
        contractType: null,
        supplierName: null,
        contractAmount: null,
        signingDate: null,
        dueDate: null,
        contractSignatory: null,
        remark: null,
        scanningCopyUrl: null,
        renewalFlag: null
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
  mounted() {
    this.queryContract();
  },
  methods: {
    queryContract() {
      queryByContractId({ contractId: this.contractId}).then(res => {
        if (res.code === 200) {
          this.formData = res.data;
        }
      });
    },
    /*组件传递,关闭表单*/
    closeAddForm() {
      this.$emit("closeAddForm")
    },
    /* 合同审核 */
    auditContract(examineType) {
      if (examineType === 2) {
        this.$prompt('请填写审批不通过原因', '审批不通过', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /.+/,
          inputErrorMessage: '审批不通过必须填写原因'
        }).then(({ value }) => {
          this.examineContract(examineType, value);
        });
      } else {
        this.examineContract(examineType);
      }
    },
    examineContract(examineType, remark) {
      examineContractInfo(Object.assign({ ...this.formData }, { examineType, remark })).then(res => {
        if (res.code === 200) {
          this.$emit('closeDetail', true);
        }
      })
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
</style>
