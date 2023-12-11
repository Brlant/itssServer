<template>
  <div>
    <el-form ref="formData" :model="formData" label-width="120px" :rules="formRules">
      <el-row>
        <el-col :span="8">
          <el-form-item label="物品编号" prop="itemNo">
            <el-input v-model="formData.itemNo"></el-input>
          </el-form-item>
        </el-col>
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
      </el-row>
      <!--      第二行-->
      <el-row>
        <el-col :span="8">
          <el-form-item label="供应商" prop="supplier">
            <el-input v-model="formData.supplier"></el-input>
          </el-form-item>
        </el-col>
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
      </el-row>
      <!--      第三行-->
      <el-row>
        <el-col :span="8">
          <el-form-item label="单位" prop="unit">
            <el-input v-model="formData.unit"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="含税进价" prop="priceWithTax">
            <el-input v-model="formData.priceWithTax">
              <span slot="append">元</span>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="税率" prop="taxRate">
            <el-input v-model="formData.taxRate"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!--      第四行-->
      <el-row>
        <el-col :span="8">
          <el-form-item label="不含税进价" prop="priceWithoutTax">
            <el-input v-model="formData.priceWithoutTax">
              <span slot="append">元</span>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="物品分类" prop="itemCategory">
            <el-input v-model="formData.itemCategory"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="箱规" prop="packageSpec">
            <el-input v-model="formData.packageSpec">
              <span slot="append">/箱</span>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!--      第五行-->
      <el-row>
        <el-col :span="8">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!--      第六行-->
      <el-row>
        <el-col :span="8">
          <el-form-item label="文件下载" prop="downloadUrl">
            <el-input v-model="formData.downloadUrl"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!--      第七行-->
      <el-row>
        <el-col :span="24" style="text-align: center; margin-top: 20px;">
          <el-button type="primary" @click="submitForm">提交</el-button>
        </el-col>
      </el-row>

    </el-form>
  </div>
</template>

<script>
export default {
  name: "fileManagerInfo",
  props: {
    tabName: {
      type: String,
      default: '',
    }
  },
  watch: {
    tabName: {
      handler(newVal, oldVal) {
        console.log('档案信息', newVal);
      },
      immediate: true,
      deep: true,
    }
  },
  data() {
    return {
      formData: {
        itemNo: '100001',
        itemType: '固定资产',
        itemName: '电脑',
        supplier: '供应商1',
        model: 'HDISNIDM',
        specification: '1349284',
        unit: '套',
        priceWithTax: '13894.32',
        taxRate: '12365.2',
        priceWithoutTax: '1526634.8',
        itemCategory: '物品分类',
        packageSpec: '30',
        remark: '',
        downloadUrl: ''
      },
      formRules: {
        itemNo: [
          {required: true, message: '请输入物品编号', trigger: 'blur'}
        ],
        itemType: [
          {required: true, message: '请输入物品类型', trigger: 'blur'}
        ],
        itemName: [
          {required: true, message: '请输入物品名称', trigger: 'blur'}
        ],
        supplier: [
          {required: true, message: '请输入供应商', trigger: 'blur'}
        ],
        model: [
          {required: true, message: '请输入型号', trigger: 'blur'}
        ],
        specification: [
          {required: true, message: '请输入规格', trigger: 'blur'}
        ],
        unit: [
          {required: true, message: '请输入单位', trigger: 'blur'}
        ],
        priceWithTax: [
          {required: true, message: '请输入含税进价', trigger: 'blur'}
        ],
        taxRate: [
          {required: true, message: '请输入税率', trigger: 'blur'}
        ],
        priceWithoutTax: [
          {required: true, message: '请输入不含税进价', trigger: 'blur'}
        ],
        itemCategory: [
          {required: true, message: '请输入物品分类', trigger: 'blur'}
        ],
        packageSpec: [
          {required: true, message: '请输入箱规', trigger: 'blur'}
        ]
      }
    }
  },
  created() {

  },
  methods: {
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
  },
}
</script>

<style scoped>
/deep/ .el-input__inner {
  border: none;
  background-color: rgba(255, 255, 255, 0);
}
/deep/ .el-input-group__append {
  border: none; /* 去除边框 */
  background: none;
}
/deep/.no-border-span {
  background-color: transparent; /* 去除背景颜色 */
  border-left: none; /* 去除左边框 */
}
</style>
