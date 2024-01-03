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
          :props="{ value: 'categoryId', label: 'categoryName', children: 'childList',checkStrictly: true,  }"
          placeholder="请选择上级类目"
          :filterable="true"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="类目名称" prop="categoryName">
        <el-input v-model="formData.categoryName"></el-input>
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
          this.parentId = val.categoryId
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

        }
      },
    }
  },
  computed:{

  },
  data() {
    return {
      categoryList: [],
      formData: {
        categoryName:'',
      },
      formDataRef: {
        categoryName: [{ required: true, message: '请输入类目名称', trigger: 'blur' }]
      },
      cascaderLength:'',
      parentId:''
    }
  },
  methods: {
    /* 获取上级类目列表 */
    getCategoryList(){
      categoryApi.getCategoryList().then(res=>{
        this.categoryList = res.rows.map(item=>{
          return {
            categoryId: item.categoryId,
            categoryName: item.categoryName,
            disabled: item.categoryId === this.parentId,
            childList: item.childList?.map(childItem=>{
              return {
                categoryId: childItem.categoryId,
                categoryName: childItem.categoryName,
                disabled: childItem.categoryId === this.parentId,
              }
            })
          }
        });

        // if(val){
        //   for(let i = 0;i<this.categoryList.length;i++){
        //     if(this.categoryList[i].categoryId === this.formData.parentId){
        //       this.categoryList[i].disabled = true
        //     }
        //     if(this.categoryList[i].childList){
        //       for(let j = 0;j<this.categoryList[i].childList.length;j++){
        //         if(this.categoryList[i].childList[j].categoryId === this.formData.parentId){
        //           this.categoryList[i].childList[j].disabled = true
        //         }
        //       }
        //     }
        //   }
        // }

      })
    },

    /* 提交 */
    submitForm() {
      if(this.editRowContent.categoryId){
        this.$refs.formData.validate(valid => {
          if (valid) {
            if(this.cascaderLength > 2){
              return this.$notify.error('限制只能三级')
            }
            categoryApi.updateCategory(this.formData).then(res=>{
              this.$notify.success('编辑成功')
              this.closeAddEditForm();
            })
          } else {
            return false
          }
        })
      }else {
        this.$refs.formData.validate(valid => {
          if (valid) {
            if(this.cascaderLength > 2){
              return this.$notify.error('限制只能三级')
            }
            categoryApi.addCategory(this.formData).then(res=>{
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
      this.$emit('closeAddEditForm');
      this.$refs.formData.resetFields();
      this.cascaderLength = ''
      this.formData.parentId = ''
      this.formData.categoryName = ''
      this.formData.categoryId = ''
      // this.formData = {}
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
