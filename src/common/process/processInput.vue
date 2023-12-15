<template>
  <el-dialog :visible="dialogInputProcessDialog" title="选择审批人" width="70%" @close="closeInputProcess">
    <el-form :model="queryForm" ref="queryForm" size="small" :inline="true" v-show="showSearch"
             label-width="68px">
      <el-form-item prop="nickName">
        <el-input v-model="queryForm.nickName" prefix-icon="el-icon-search" @keyup.enter.native="getInputList" placeholder="请输入姓名或职位"></el-input>
      </el-form-item>
      <el-form-item prop="deptId">
        <el-select v-model="queryForm.deptId" placeholder="部门搜索" clearable>
          <el-option
            v-for="(item,index) in modelNameArray"
            :key="index"
            :label="item.deptName"
            :value="item.deptId"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getInputList" >搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetList">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="members" highlight-current-row @row-click="selectMember">
      <el-table-column label="姓名" prop="nickName"></el-table-column>
      <el-table-column label="部门" prop="deptName"></el-table-column>
      <el-table-column label="职位" prop="postName"></el-table-column>
    </el-table>

    <pagination
      v-show="queryForm.total>0"
      :total="queryForm.total"
      :page.sync="queryForm.pageNum"
      :limit.sync="queryForm.pageSize"
      @pagination="getInputList"
    />
  </el-dialog>
</template>

<script>
import { getDeptList,getQueryUserInfoList} from '@/api/auditCenter/process/process'

export default {
  name: 'processInput',
  props:['dialogInputProcessDialog'],
  watch:{

  },
  data(){
    return{
      queryForm:{
        nickName: '',
        deptId:'',
        total: 10,
        pageNum: 1,
        pageSize: 10,
      },
      showSearch:true,
      members: [],
      modelNameArray:[],
    }
  },
  created() {

  },
  mounted() {
    //获取部门列表
    this.getDeptList()
    //获取列表
    this.getInputList()
  },
  methods:{
    getDeptList(){
      getDeptList().then(res=>{
        this.modelNameArray = res.data
      })
    },
    getInputList(){
      let params = {
        nickName:this.queryForm.nickName,
        deptId:this.queryForm.deptId,
        pageNum: this.queryForm.pageNum,
        pageSize: this.queryForm.pageSize,
      }
      getQueryUserInfoList(params).then(res=>{
        this.members = res.rows
        this.queryForm.total = res.total;
      })
    },
    selectMember(row) {
      this.$emit('selectMember',row.nickName,row.userId)
    },
    closeInputProcess(){
      this.$emit('closeInputProcess')
    },
    resetList(){
      this.$refs.queryForm.resetFields();
      this.getInputList();
    }
  }
}
</script>

<style scoped>

</style>
