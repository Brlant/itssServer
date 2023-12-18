<template>
  <el-form ref="form" :model="formData" :rules="formRules" label-width="120px">
    <!--    基本信息-->
    <div class="JiBenXinXi">
      基本信息
    </div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="供应商编号" prop="supplierCode">
          <el-input v-model="formData.supplierCode" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="供应商名称" prop="supplierName">
          <el-input v-model="formData.supplierName"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="企业类型" prop="supplierTypeName">/
          <el-input v-model="formData.supplierTypeName"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="供应商有效期" prop="validityDate">
          <el-date-picker v-model="formData.validityDate" type="date"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="办公室地址" prop="supplierAddress">
          <el-input v-model="formData.supplierAddress"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="仓库地址" prop="warehouseAddress">
          <el-input v-model="formData.warehouseAddress"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <!--    工商信息-->
    <div class="GongShangXinXi">
      工商信息
    </div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="法人" prop="legalPerson">
          <el-input v-model="formData.legalPerson"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="法人身份证号" prop="idCardNumber">
          <el-input v-model="formData.idCardNumber"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="公司成立时间" prop="establishDate">
          <el-date-picker v-model="formData.establishDate" type="date"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="开户行" prop="bankName">
          <el-input v-model="formData.bankName"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="收款账号" prop="accountNumber">
          <el-input v-model="formData.accountNumber"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="经营范围" prop="businessScope">
          <el-input v-model="formData.businessScope"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <!--    联系人-->
    <div class="lainXiRen">
      联系人
    </div>
    <div v-for="(contact, index) in formData.contacts" :key="index">
      <el-row :gutter="20" align="middle" type="flex">
        <el-col :span="5">
          <el-form-item :label="'联系人' + (index + 1)" prop="contactsName">
            <el-input v-model="contact.contactsName" placeholder="请输入联系人姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="职位" prop="positions">
            <el-input v-model="contact.positions" placeholder="请输入职位"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="手机号" prop="contactsPhone">
            <el-input v-model="contact.contactsPhone" placeholder="请输入手机号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="邮箱" prop="contactsMailbox">
            <el-input v-model="contact.contactsMailbox" placeholder="请输入邮箱"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
  </el-form>
</template>

<script>
import { getQueryDetail } from '@/api/auditCenter/initiated/initiated'

export default {
  name: 'fileInfo',
  props: ['detailsRow'],
  watch: {
    detailsRow: {
      handler(newVal, oldVal) {
        if (newVal.relationId && newVal.modelType) {
          let params = {
            id: newVal.relationId,
            type: newVal.modelType
          }
          getQueryDetail(params).then((res) => {
            this.formData = res.data
            this.formData.legalPerson = res.data.businessInfo.legalPerson,
              this.formData.idCardNumber = res.data.businessInfo.legalPersonID,
              this.formData.establishDate = res.data.businessInfo.foundingDate,
              this.formData.bankName = res.data.businessInfo.openingBank,
              this.formData.accountNumber = res.data.businessInfo.accountNumber,
              this.formData.businessScope = res.data.businessInfo.businessScope,
              this.formData.contacts = res.data.contactsList
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {

  },
  data() {
    return {
      formData: {
        //基本信息
        supplierCode: '',
        supplierName: '',
        supplierTypeName: '',
        validityDate: '',
        supplierAddress: '',
        warehouseAddress: '',
        //工商信息
        legalPerson: '',
        idCardNumber: '',
        establishDate: '',
        bankName: '',
        accountNumber: '',
        businessScope: '',
        //联系人
        contacts: [
        ]
      },
      //表单校验
      formRules: {
        supplierNo: [{ required: true, message: '请输入供应商编号', trigger: 'blur' }],
        supplierName: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
        supplierTypeName: [{ required: true, message: '请输入企业类型', trigger: 'blur' }],
        validityDate: [{ required: true, message: '请选择供应商日期', trigger: 'change' }],
        supplierAddress: [{ required: true, message: '请输入办公室地址', trigger: 'blur' }],
        warehouseAddress: [{ required: true, message: '请输入仓库地址', trigger: 'blur' }],
        //工商信息
        legalPerson: [{ required: true, message: '请输入法人', trigger: 'blur' }],
        idCardNumber: [{ required: true, message: '请输入法人身份证号', trigger: 'blur' }],
        establishDate: [{ required: true, message: '请选择公司成立时间', trigger: 'change' }],
        bankName: [{ required: true, message: '请输入开户行', trigger: 'blur' }],
        accountNumber: [{ required: true, message: '请输入收款账号', trigger: 'blur' }],
        businessScope: [{ required: true, message: '请输入经营范围', trigger: 'blur' }],

        //联系人
        contactsName: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        contactsPhone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ]
      }
    }
  }

}
</script>

<style scoped>
/deep/ .el-input__inner {
  border: none;
  background-color: rgba(255, 255, 255, 0);
}

.JiBenXinXi {
  font-weight: bolder;
  font-size: 14px;
  width: 100%;
  border-bottom: 1px solid #F2F2F2;
  margin-bottom: 20px;
  padding-bottom: 10px;
  box-sizing: content-box;
}

.GongShangXinXi {
  font-weight: bolder;
  font-size: 14px;
  width: 100%;
  border-bottom: 1px solid #F2F2F2;
  margin-bottom: 20px;
  padding-bottom: 10px;
  box-sizing: content-box;
}

.lainXiRen {
  font-weight: bolder;
  font-size: 14px;
  width: 100%;
  border-bottom: 1px solid #F2F2F2;
  margin-bottom: 20px;
  padding-bottom: 10px;
  box-sizing: content-box;
}
</style>
