<template>
  <el-dialog :visible="dialogInputProcessDialog" title="选择审批人" width="60%">
    <el-form :model="queryForm" ref="queryForm" size="small" :inline="true" v-show="showSearch"
             label-width="68px">
      <el-form-item prop="searchValue">
        <el-input v-model="queryForm.searchValue" prefix-icon="el-icon-search" placeholder="请输入姓名或职位"></el-input>
      </el-form-item>
    </el-form>

    <el-table :data="members" highlight-current-row @row-click="selectMember">
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="职位" prop="position"></el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogInputProcessDialog = false">取消</el-button>
      <el-button type="primary">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'processInput',
  props:['dialogInputProcessDialog'],
  watch:{

  },
  data(){
    return{
      queryForm:{
        searchValue: '',
      },
      showSearch:true,
      members: [
        { name: '张三', position: '采购专员', department: '采购一部' },
        { name: '李四', position: '开发工程师', department: '开发部' },
        { name: '王五', position: '测试工程师', department: '测试部' },
        { name: '赵六', position: '采购经理', department: '采购部' },
        { name: '钱七', position: '采购专员', department: '采购二部' },
        { name: '孙八', position: '仓储经理', department: '仓储部' },
        { name: '周九', position: '运输经理', department: '运输部' },
        { name: '吴十', position: '配送经理', department: '配送部' }
      ],
    }
  },
  created() {

  },
  mounted() {

  },
  methods:{
    selectMember(row) {
      console.log(row)
    },
  }
}
</script>

<style scoped>

</style>
