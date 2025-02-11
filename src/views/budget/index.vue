<template>
  <div class="app-container">
    <el-row>
      <el-col :span="20">
        <el-form :model="formData" ref="formData" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
          <el-form-item  prop="budgetName">
            <el-input v-model="formData.budgetName" placeholder="请输入类目名称" prefix-icon="el-icon-search" @enter.native=""></el-input>
          </el-form-item>
          <el-button type="primary" @click="budgetList" icon="el-icon-search">搜索</el-button>
          <el-button type="primary"   icon="el-icon-refresh" @click="resetForm">重置</el-button>
        </el-form>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" v-hasPermi="['system:budget:add']"  icon="el-icon-plus" @click="addbudgetForm">添加</el-button>
      </el-col>
    </el-row>

    <el-table :data="tableData"
              style="width: 100%"
              :row-key="getRowKeys"
              v-loading="loading"
              :tree-props="{children: 'childList'}"
    >
      <el-table-column label="类目名称" prop="budgetName"></el-table-column>
      <el-table-column label="状态" prop="budgetStatus">
        <template slot-scope="scope">
          <el-switch :active-value="1"
                     :inactive-value="0"
                     v-model="scope.row.budgetStatus"
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
            v-hasPermi="['system:budget:edit']"
            @click="editbudgetForm(scope.row)"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            v-if="!scope.row.childList || scope.row.childList.length === 0"
            v-hasPermi="['system:budget:delete']"
            @click="deletebudgetForm(scope.row)"
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
      @pagination="budgetList"
    />

    <budget-form :dialogbudgetFrom="dialogbudgetFrom" :editRowContent="editRowContent"  @closeAddEditForm="closeAddEditForm" :formTitle="formTitle"></budget-form>
  </div>
</template>

<script>
import budgetApi from '@/api/budget/budget'
import budgetForm from '@/common/budgetForm/budgetForm'
export default {
  name: 'index',
  data() {
    return {
      loading:true,
      //查询参数
      formData:{
        budgetName:'',
        //翻页
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      showSearch:true,
      //新建编辑弹框
      dialogbudgetFrom:false,
      //弹框标题
      formTitle:'预算类型',
      tableData:[],
      editRowContent:{},

    }
  },
  components: {
    budgetForm,
  },
  created() {
    /* 查询列表 */
    this.budgetList();
  },
  methods: {
    getRowKeys(row){
      return row.budgetId;
    },
    /* 修改状态值 */
    handleStatusChange(query){
      let params = {
        budgetStatus:query.budgetStatus,
        budgetId:query.budgetId
      }
      budgetApi.updateBudget(params).then(res=>{
        this.budgetList();
      })
    },
    editbudgetForm(row){
      this.editRowContent = row;
      this.dialogbudgetFrom = true;
    },
    deletebudgetForm(row){
      this.$confirm(`确认删除${row.budgetName}行？`, '提示',  {
        type: 'warning'
      }).then(() => {
        budgetApi.deleteBudget({budgetId:row.budgetId}).then(res=>{
          this.budgetList();
          this.$notify.success('删除成功')
        })
      }).catch(() => {})

    },
    budgetList(){
      const params = {
        budgetName:this.formData.budgetName,
        pageNum: this.formData.pageNum,
        pageSize: this.formData.pageSize,
      }
      budgetApi.queryBudget(params).then(res=>{
        this.loading = false;
        this.tableData = res.rows;
        this.total= res.total;
      })
    },
    addbudgetForm(){
      this.dialogbudgetFrom = true;
    },
    resetForm(){
      this.formData.pageNum = 1;
      this.$refs.formData.resetFields();
      this.budgetList();
    },
    //关闭弹框
    closeAddEditForm(){
      this.dialogbudgetFrom = false;
      this.budgetList();
    }
  }
}
</script>

<style scoped>

</style>
