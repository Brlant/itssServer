<template>
  <el-dialog :visible="dialogContractForm"
    :title="formTitle"
    width="60%"
    @open="open"
    @close="closeAddForm">
    <template v-slot:title>
      <div style="font-weight: bold;font-size: 15px;display: none">{{ formTitle }}</div>
    </template>
    <div class="jiBenXinXi">
      <span>基本信息</span>
      <span style="margin-left: 10px" v-if="expireDays" :style="expireColor(expireDays)">{{ expireText(expireDays) }}</span>
    </div>
    <!--绘制基本信息表单-->
    <el-form ref="formData"
      :model="formData"
      :rules="formRules"
      label-width="120px">
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
      <!--      第二行-->
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
            <span v-if="formData.contractAmount">{{ formData.contractAmount.toFixed(2) }}</span>
          </el-form-item>
        </el-col>
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
              <el-input v-model="fileName"
                readonly>
                <template v-if="fileName"
                  slot="append">
                  <el-button>
                    <el-link :href="formData.scanningCopyUrl"
                      :underline="false"
                      icon="el-icon-download"></el-link>
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        第六行-->
        <el-row>
          <el-col :span="8">
            <el-form-item label="合同续签"
              prop="renewalFlag">
              <el-select v-model="formData.renewalFlag">
                <el-option :value="1" label="续签"></el-option>
                <el-option :value="0" label="不续签"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        提交-->
        <el-row>
          <el-col :span="24"
            style="text-align: center; margin-top: 20px;">
            <el-button type="primary"
              @click="submitForm">提交</el-button>
            <el-button @click="closeAddForm">返回</el-button>
          </el-col>
        </el-row>
      </el-row>
    </el-form>
  </el-dialog>

</template>

<script>
import { queryByContractId, renewal } from '@/api/contractFilesManagement/contractFilesManagement'

export default {
  name: "contractForm",
  props: {
    dialogContractForm: {
      type: Boolean,
      default: false
    },
    contractId: {
      type: String
    }
  },
  data() {
    return {
      formTitle: "基本信息",
      expireDays:'',
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
        contractRecordCode: [
          {required: true, message: '请输入合同档案编号', trigger: 'blur'}
        ],
        // contractCode: [
        //   {required: true, message: '请输入合同编号', trigger: 'blur'}
        // ],
        contractName: [
          {required: true, message: '请输入合同名称', trigger: 'blur'}
        ],
        contractType: [
          {required: true, message: '请选择合同类型', trigger: 'change'}
        ],
        supplierName: [
          {required: true, message: '请输入供应商名称', trigger: 'blur'}
        ],
        // contractAmount: [
        //   {required: true, message: '请输入合同金额', trigger: 'blur'}
        // ],
        signingDate: [
          {required: true, message: '请选择签订日期', trigger: 'change'}
        ],
        dueDate: [
          {required: true, message: '请选择到期日期', trigger: 'change'}
        ],
        signer: [
          {required: true, message: '请输入合同签署人', trigger: 'blur'}
        ],
        renewalFlag: [
          {required: true, message: '请选择是否续签', trigger: 'blur'}
        ]
      }
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
  methods: {
    expireColor(days) {
      let style = {};
      if (days > 30) {
        style.color = '#000000';
      } else if (days > 7) {
        style.color = '#f59b22'
      } else {
        style.color = '#d8001b'
      }
      return style;
    },
    expireText(days) {
      if (days >=0) {
        return `${days}天后`;
      } else {
        return `已过期${-days}天`;
      }
    },
    open() {
      queryByContractId({ contractId: this.contractId}).then(res => {
        if (res.code === 200) {
          this.formData = res.data;
          this.expireDays = res.data.expireDays;
          console.log(this.formData)
        }
      });
    },
    /*组件传递,关闭表单*/
    closeAddForm() {
      this.$emit("closeAddForm")
    },
    /*文件提交*/
    submitForm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          renewal(this.formData).then(res => {
            if (res.code === 200) {
              this.$message.success(res.msg);
              this.$emit('closeAddForm', true);
            }
          })
        } else {
          this.$message.error('表单验证失败，请检查输入内容');
        }
      });
    }
  }
}
</script>

<style scoped>
  .jiBenXinXi {
    display: flex;
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
