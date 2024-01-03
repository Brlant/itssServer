<template>
  <div class="app-container">
    <el-row>
      <el-col :span="20">
        <el-form :model="formData" ref="formData" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
          <el-form-item  prop="categoryName">
            <el-input v-model="formData.categoryName" placeholder="请输入类目名称" prefix-icon="el-icon-search" @enter.native=""></el-input>
          </el-form-item>
          <el-button type="primary" @click="categoryList" icon="el-icon-search">搜索</el-button>
          <el-button type="primary"   icon="el-icon-refresh" @click="resetForm">重置</el-button>
        </el-form>
      </el-col>
      <el-col :span="4">
        <el-button type="primary"   icon="el-icon-plus" @click="addCategoryForm" v-hasPermi="['system:category:add']">添加</el-button>
      </el-col>
    </el-row>

    <el-table :data="tableData"
              style="width: 100%"
              :row-key="getRowKeys"
              v-loading="loading"
              :tree-props="{children: 'childList'}"
    >
      <el-table-column label="类目名称" prop="categoryName"></el-table-column>
      <el-table-column label="状态" prop="categoryStatus">
        <template slot-scope="scope">
          <el-switch :active-value="1"
                     :inactive-value="0"
                     v-model="scope.row.categoryStatus"
                     @change="handleStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime">
        <template v-slot="scope">
          {{ new Date(scope.row.createTime).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-hasPermi="['system:category:edit']"
            @click="editCategoryForm(scope.row)"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            v-if="!scope.row.childList || scope.row.childList.length === 0"
            icon="el-icon-delete"
            v-hasPermi="['system:category:delete']"
            @click="deleteCategoryForm(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--    翻页-->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="formData.pageNum"
      :limit.sync="formData.pageSize"
      @pagination="categoryList"
    />
    <category-form :dialogCategoryFrom="dialogCategoryFrom" :editRowContent="editRowContent" @closeCategoryEditForm="closeCategoryEditForm" :formTitle="formTitle"></category-form>

  </div>
</template>

<script>
import categoryApi from '@/api/category/category'
import categoryForm from '@/common/categoryForm/categoryForm'
export default {
  name: 'index',
  data() {
    return {
      loading:true,
      //查询参数
      formData:{
        categoryName:'',
        //翻页

        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      showSearch:true,
      //新建编辑弹框
      dialogCategoryFrom:false,
      //弹框标题
      formTitle:'类目',
      tableData:[],
      editRowContent:{},
    }
  },
  components: {
    categoryForm,
  },
  created() {
  /* 查询列表 */
    this.categoryList();
  },
  methods: {
    getRowKeys(row){
      return row.categoryId;
    },
    /* 修改状态值 */
    handleStatusChange(query){
      let params = {
        categoryStatus:query.categoryStatus,
        categoryId:query.categoryId
      }
      categoryApi.updateCategory(params).then(res=>{
        this.categoryList();
      })
    },
    editCategoryForm(row){
      this.editRowContent = row;
      this.dialogCategoryFrom = true;
    },
    deleteCategoryForm(row){
      this.$confirm(`确认删除${row.categoryName}行？`, '提示',  {
        type: 'warning'
      }).then(() => {
        categoryApi.deleteCategory({categoryId:row.categoryId}).then(res=>{
          this.categoryList();
          this.$notify.success('删除成功')
        })
      }).catch(() => {})

    },
    categoryList(){
      const params = {
        categoryName:this.formData.categoryName,
        pageNum: this.formData.pageNum,
        pageSize: this.formData.pageSize,
      }
      categoryApi.getCategoryList(params).then(res=>{
        this.loading = false;
        this.tableData = res.rows;
        this.total = res.total;
      })
    },
    resetForm(){
      this.formData.pageNum = 1;
      this.$refs.formData.resetFields();
      this.categoryList();
    },
    addCategoryForm(){
      this.dialogCategoryFrom = true;
    },
    //关闭弹框
    closeCategoryEditForm(){
      this.dialogCategoryFrom = false;
      this.categoryList();
    }

  }
}
</script>

<style scoped>

</style>
