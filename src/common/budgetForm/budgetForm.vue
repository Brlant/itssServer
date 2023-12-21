<template>
  <el-dialog :visible="dialogbudgetFrom" :title="formTitle" width="50%" @close="closeAddEditForm">
    <template v-slot:title>
      <div style="font-size: 16px;text-align: center">{{ formTitle }}</div>
    </template>
    <el-form :model="formData" ref="formData" :rules="formDataRef" label-width="120px">
      <el-form-item label="上级类目">
        <el-cascader
          v-model="formData.parentId"
          :filter-method="getbudgetList"
          :options="budgetList"
          :props="{ value: 'budgetId', label: 'budgetName', children: 'childList',checkStrictly: true,emitPath:false,  }"
          placeholder="请选择上级类目"
          :filterable="true"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="类目名称" prop="budgetName">
        <el-input v-model="formData.budgetName" ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        v-show="addForm === '提交'"
        @click="submitForm">
        提交
      </el-button>
      <el-button
        @click="editRow"
        v-show="formData.budgetId"
      >编辑
      </el-button>
      <el-button
        @click="closeAddEditForm"
      >取消
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import budgetApi from '@/api/budget/budget'
export default {
  name: 'budgetForm',
  props: {
    dialogbudgetFrom: {
      type: Boolean
    },
    formTitle: {
      type: String
    },
    editRowContent:{
      type:Object
    },
    addForm:{
      type:String
    }
  },
  watch:{
    editRowContent:{
      handler(val){
        if(val.budgetId){
          this.formData = val
          this.getbudgetList();
        }else{
          this.formData={}
        }
      },
      immediate:true,
      deep:true,
    },
    dialogbudgetFrom:{
      handler(val){
        if(val){
          this.getbudgetList();
        }
      },
    }
  },
  computed:{

  },
  data() {
    return {
      budgetList: [],
      formData: {},
      formDataRef: {
        budgetName: [{ required: true, message: '请输入类目名称', trigger: 'blur' }]
      },
    }
  },
  methods: {
    /* 获取上级类目列表 */
    getbudgetList(){
      budgetApi.queryBudget().then(res=>{
        this.budgetList = res.rows;
      })
    },

    /* 提交 */
    submitForm() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          budgetApi.addBudget(this.formData).then(res=>{
            this.$notify.success('添加成功')
            this.closeAddEditForm();
          })
        } else {
          return false
        }
      })
    },
    /* 编辑 */
    editRow(){
      this.$refs.formData.validate(valid => {
        if (valid) {
          budgetApi.updateBudget(this.formData).then(res=>{
            this.$notify.success('编辑成功')
            this.closeAddEditForm();
          })
        } else {
          return false
        }
      })
    },
    closeAddEditForm() {
      this.$emit('closeAddEditForm')
      this.formData ={}
    },
    handleChange(query){
      this.formData.parentId = query;
    }
  },
  created() {
    this.getbudgetList()
  },
  mounted() {
    this.getbudgetList()
  }
}
</script>


<style scoped>

</style>
