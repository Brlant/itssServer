<template>
  <el-dialog :visible="dialogCategoryFrom" :title="formTitle" width="50%" @close="closeAddEditForm">
    <template v-slot:title>
      <div style="font-size: 16px;text-align: center">{{ formTitle }}</div>
    </template>
    <el-form :model="formData" ref="formData" :rules="formDataRef" label-width="120px">
      <el-form-item label="上级类目">
        <el-cascader
          v-model="formData.parentId"
          :filter-method="getCategoryList"
          :options="categoryList"
          :props="{ value: 'categoryId', label: 'categoryName', children: 'childList',checkStrictly: true,emitPath:false,  }"
          placeholder="请选择上级类目"
          :filterable="true"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="类目名称" prop="categoryName">
        <el-input v-model="formData.categoryName" ></el-input>
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
          v-show="formData.categoryId"
        >编辑
        </el-button>
        <el-button
        >取消
        </el-button>
    </div>
  </el-dialog>
</template>

<script>
import categoryApi from '@/api/category/category'
export default {
  name: 'categoryForm',
  props: {
    dialogCategoryFrom: {
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
        if(val.categoryId){
          this.formData = val
          this.getCategoryList();
        }else{
          this.formData={}
        }
      },
      immediate:true,
      deep:true,
    },
    dialogCategoryFrom:{
      handler(val){
        if(val){
          this.getCategoryList();
        }
      },
    }
  },
  computed:{

  },
  data() {
    return {
      categoryList: [],
      formData: {},
      formDataRef: {
        categoryName: [{ required: true, message: '请输入类目名称', trigger: 'blur' }]
      },
    }
  },
  methods: {
    /* 获取上级类目列表 */
    getCategoryList(){
      categoryApi.getCategoryList().then(res=>{
        this.categoryList = res.rows;
      })
    },

    /* 提交 */
    submitForm() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          categoryApi.addCategory(this.formData).then(res=>{
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
          categoryApi.updateCategory(this.formData).then(res=>{
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
    this.getCategoryList()
  },
  mounted() {
    this.getCategoryList()
  }
}
</script>


<style scoped>

</style>
