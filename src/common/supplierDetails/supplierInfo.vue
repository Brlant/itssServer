<template>
  <el-form ref="form" :model="formData" :rules="formRules" label-width="120px">
    <!--    基本信息-->
    <div class="JiBenXinXi">
      基本信息
    </div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="供应商编号" prop="supplierNo" >
          <el-input v-model="formData.supplierNo" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="供应商名称" prop="supplierName"  >
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
      </el-row>
    </div>
  </el-form>
</template>

<script>
export default {
  name: "supplierInfo",
  props:{
    tabName: {
      type:String,
      default:'',
    }
  },
  watch:{
    tabName: {
      handler(newVal, oldVal) {
        console.log('档案信息',newVal);
      },
      immediate:true,
      deep: true,
    }
  },
  data(){
    return{
      formData: {
        //基本信息
        supplierNo:20231208,
        supplierName: '供应商1',
        companyType: '外部企业',
        supplierDate: '2023-12-19',
        officeAddress: '上海市松江区新海关商检大楼400',
        warehouseAddress: '上海市松江区新海关商检大楼400',
        //工商信息
        legalPerson: '某人',
        idCardNumber: '302930292938293',
        establishDate: '2023-12-19',
        bankName: '工商银行',
        accountNumber: '60484938473847',
        businessScope: '这是经营范围呀这是经营范围呀这是经营范围呀这是经营范围呀这是经营范围呀这是经营范围呀这是经营范围呀这是经营范围呀',
        //联系人
        contacts: [
          {
            id: Date.now(),
            contactName: '牛香卉',
            position: '销售经理',
            cellPhoneNumber: '17317628049',
            email: '1728372847@qq.com'
          },
          {
            id: Date.now(),
            contactName: '殷半雪',
            position: '销售经理',
            cellPhoneNumber: '17317628049',
            email: '1728372847@qq.com'
          },
        ],
      },
      //表单校验
      formRules:{
        supplierNo: [{required: true, message: '请输入供应商编号', trigger: 'blur'}],
        supplierName: [{required: true, message: '请输入供应商名称', trigger: 'blur'}],
        companyType: [{required: true, message: '请输入企业类型', trigger: 'blur'}],
        supplierDate: [{required: true, message: '请选择供应商日期', trigger: 'change'}],
        officeAddress: [{required: true, message: '请输入办公室地址', trigger: 'blur'}],
        warehouseAddress: [{required: true, message: '请输入仓库地址', trigger: 'blur'}],
        //工商信息
        legalPerson: [{ required: true, message: '请输入法人', trigger: 'blur' }],
        idCardNumber: [{ required: true, message: '请输入法人身份证号', trigger: 'blur' }],
        establishDate: [{ required: true, message: '请选择公司成立时间', trigger: 'change' }],
        bankName: [{ required: true, message: '请输入开户行', trigger: 'blur' }],
        accountNumber: [{ required: true, message: '请输入收款账号', trigger: 'blur' }],
        businessScope: [{ required: true, message: '请输入经营范围', trigger: 'blur' }],

        //联系人
        contactName: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        cellPhoneNumber: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ]
      }
    }
  },
  created() {

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
