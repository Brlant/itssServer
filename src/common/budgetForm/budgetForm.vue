<template>
  <el-dialog :visible="dialogbudgetFrom" :title="formTitle" width="50%" @close="closeAddEditForm">
    <template v-slot:title>
      <div style="font-size: 16px;text-align: center">{{ formTitle }}</div>
    </template>
    <el-form :model="formData" ref="form" :rules="formDataRef" label-width="120px">
      <el-form-item label="上级类目">
        <el-cascader
          v-model="formData.parentId"
          :filter-method="getbudgetList"
          :options="budgetList"
          :props="{ value: 'budgetId', label: 'budgetName', children: 'childList',checkStrictly: true  }"
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
        @click="submitForm">
        提交
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
          this.parentId = val.budgetId
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

        }
      },
    }
  },
  computed:{

  },
  data() {
    return {
      budgetList: [],
      formData: {
        budgetName:'',
      },
      formDataRef: {
        budgetName: [{ required: true, message: '请输入类目名称', trigger: 'blur' }]
      },
      cascaderLength:'',
      parentId:''
    }
  },
  methods: {
    /* 获取上级类目列表 */
    getbudgetList(){
      budgetApi.queryBudget().then(res=>{
        this.budgetList = res.rows.map(item=>{
          return {
            budgetId: item.budgetId,
            budgetName: item.budgetName,
            disabled: item.budgetId === this.parentId,
            childList: item.childList?.map(childItem=>{
              return {
                budgetId: childItem.budgetId,
                budgetName: childItem.budgetName,
                disabled: childItem.budgetId === this.parentId,
              }
            })
          }
        });
      })
    },

    /* 提交 */
    submitForm() {
      if(this.editRowContent.budgetId){
        this.$refs.formData.validate(valid => {
          if (valid) {
            if(this.cascaderLength > 2){
              return this.$notify.error('限制只能三级')
            }
            budgetApi.updateBudget(this.formData).then(res=>{
              this.$notify.success('编辑成功')
              this.closeAddEditForm();
            })
          } else {
            return false
          }
        })
      }else{
        this.$refs.formData.validate(valid => {
          if (valid) {
            if(this.cascaderLength > 2){
              return this.$notify.error('限制只能三级')
            }
            budgetApi.addBudget(this.formData).then(res=>{
              this.$notify.success('添加成功')
              this.closeAddEditForm();
            })
          } else {
            return false
          }
        })
      }

    },
    /* 编辑 */
    editRow(){
      this.$refs.formData.validate(valid => {
        if (valid) {
          if(this.cascaderLength > 2){
            return this.$notify.error('限制只能三级')
          }
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
      this.$refs.form.resetFields();
      this.cascaderLength = ''
      this.formData.parentId = ''
      this.formData.budgetName = ''
      this.formData.budgetId = ''
    },
    handleChange(query){
      const queryLength = query.length;
      this.cascaderLength = queryLength;
      this.formData.parentId = query[query.length - 1];
    }
  },
  created() {

  },
  mounted() {

  }
}
</script>


<style scoped>

</style>
