<template>
  <el-dialog :visible="dialogAddSupplier" :title="formTitle" width="80%" @close="handleSupplierClose">
    <template v-slot:title>
      <div style="font-weight: bold;font-size: 15px">{{ formTitle }}</div>
    </template>
    <el-form ref="form" :model="formData" :rules="formRules" label-width="120px">
      <!--    基本信息-->
      <div class="JiBenXinXi">
        基本信息
      </div>
      <el-row>
        <el-col :span="8">
          <el-form-item label="供应商名称" prop="supplierName" >
            <el-input v-model="formData.supplierName" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="企业类型" prop="companyType">
            <el-input v-model="formData.companyType"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商日期" prop="supplierDate">
            <el-date-picker v-model="formData.supplierDate" type="date"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="办公室地址" prop="officeAddress">
            <el-input v-model="formData.officeAddress"></el-input>
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
          <el-form-item label="统一社会信用代码" prop="creditCode">
            <el-input v-model="formData.creditCode"></el-input>
          </el-form-item>
        </el-col>
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
<!--      图片上传-->
      <el-row>
        <el-col :span="24">
          <el-form-item label="营业执照" prop="businessLicense">
            <el-upload
              action="/api/upload"
              :show-file-list="false"
              :on-success="handleBusinessLicenseSuccess"
              :before-upload="beforeBusinessLicenseUpload"
            >
              <el-button slot="trigger" size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
<!--      附件上传-->
      <el-form-item label="附件上传">
        <el-upload
          action="/api/upload"
          :on-success="handleAttachmentSuccess"
          :before-upload="beforeAttachmentUpload"
          multiple
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        <div v-if="formData.attachments.length > 0">
          <div v-for="(attachment, index) in formData.attachments" :key="index">
            <el-input
              v-model="attachment.name"
              placeholder="请输入附件名称"
              style="margin-top: 10px"
              :rules="[{ required: true, message: '请输入附件名称', trigger: 'blur' }]"
            ></el-input>
            <el-date-picker
              v-model="attachment.validity"
              type="date"
              placeholder="请选择有效期"
              style="margin-top: 10px"
            ></el-date-picker>
          </div>
        </div>
      </el-form-item>
      <!--    联系人-->
      <div class="lainXiRen">
        联系人
      </div>
      <div v-for="(contact, index) in formData.contacts" :key="contact.id">
        <el-row :gutter="20" align="middle" type="flex">
          <el-col :span="5">
            <el-form-item :label="'联系人' + (index + 1)" prop="contactName" >
              <el-input v-model="contact.contactName" placeholder="请输入联系人姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="职位" prop="position">
              <el-input v-model="contact.position" placeholder="请输入职位"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="手机号" prop="cellPhoneNumber">
              <el-input v-model="contact.cellPhoneNumber" placeholder="请输入手机号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="contact.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="text" @click="addContact" v-if="index === 0">+</el-button>
              <el-button type="text" @click="removeContact(index)" v-else>-</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: "supplierForm",
  props: {
    dialogAddSupplier: {
      type: Boolean,
      default: "",
    }
  },
  data() {
    return {
      formTitle: "新建档案",
      formData: {
        //基本信息
        supplierName: '',
        companyType: '',
        supplierDate: '',
        officeAddress: '',
        warehouseAddress: '',
        //工商信息
        legalPerson: '',
        idCardNumber: '',
        establishDate: '',
        creditCode: '',
        bankName: '',
        accountNumber: '',
        businessScope: '',
        //工商信息的文件上传
        businessLicense: '',
        attachments: [],

        //联系人
        contacts: [
          {
            id: Date.now(),
            contactName: '',
            position: '',
            cellPhoneNumber: '',
            email: ''
          }
        ],

      },
      //表单校验
      formRules: {
        supplierName: [{required: true, message: '请输入供应商名称', trigger: 'blur'}],
        companyType: [{required: true, message: '请输入企业类型', trigger: 'blur'}],
        supplierDate: [{required: true, message: '请选择供应商日期', trigger: 'change'}],
        officeAddress: [{required: true, message: '请输入办公室地址', trigger: 'blur'}],
        warehouseAddress: [{required: true, message: '请输入仓库地址', trigger: 'blur'}],
        //工商信息
        legalPerson: [{ required: true, message: '请输入法人', trigger: 'blur' }],
        idCardNumber: [{ required: true, message: '请输入法人身份证号', trigger: 'blur' }],
        establishDate: [{ required: true, message: '请选择公司成立时间', trigger: 'change' }],
        creditCode: [{ required: true, message: '请输入统一社会信用代码', trigger: 'blur' }],
        bankName: [{ required: true, message: '请输入开户行', trigger: 'blur' }],
        accountNumber: [{ required: true, message: '请输入收款账号', trigger: 'blur' }],
        businessScope: [{ required: true, message: '请输入经营范围', trigger: 'blur' }],
        //工商信息的文件上传校验
        businessLicense: [{ required: true, message: '请上传营业执照', trigger: 'change' }],

        contactName: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        cellPhoneNumber: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ]
      },
      params: {
        id: 1
      }
    }
  },
  created() {

  },
  methods: {
    addContact() {
      this.formData.contacts.push({
        id: Date.now(),
        name: '',
        position: '',
        phone: '',
        email: ''
      });
    },
    removeContact(index) {
      if (this.formData.contacts.length > 1) {
        this.formData.contacts.splice(index, 1);
      } else {
        this.$message.error('至少需要保留一个联系人');
      }
    },
    //关闭弹框
    handleSupplierClose() {
      this.$emit('handleSupplierClose',)
    },
    /*表单校验提交*/
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 表单验证通过，可以在这里进行提交操作
          console.log('表单提交成功');
        } else {
          console.log('表单验证失败');
          return false;
        }
      });
    },
    beforeBusinessLicenseUpload(file) {
      // 营业执照上传前的处理
      return true;
    },
    handleBusinessLicenseSuccess(response, file) {
      // 营业执照上传成功后的处理
      this.formData.businessLicense = file.response.url;
    },
    beforeAttachmentUpload(file) {
      // 附件上传前的处理
      const attachmentNameRule = { required: true, message: '请输入附件名称', trigger: 'blur' };
      this.formRules.attachments = [{ name: attachmentNameRule }];
      return true;
    },
    handleAttachmentSuccess(response, file) {
      // 附件上传成功后的处理
      this.formData.attachments.push({ name: '', validity: '' });
    },
  },
  mounted() {

  },
}
</script>

<style scoped>
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
