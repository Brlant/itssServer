<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <!--      流程标题搜索-->
      <el-form-item  prop="num">
        <el-input
          prefix-icon="el-icon-search"
          v-model="queryParams.num"
          placeholder="流程标题搜索"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--     时间搜索 -->
      <el-form-item  prop="recv_time">
        <el-date-picker
          v-model="queryParams.recv_time"
          style="width: 300px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="请选择开始时间"
          end-placeholder="请选择结束时间"
        ></el-date-picker>
      </el-form-item>
      <!--      流程名称-->
      <el-form-item prop="house_id">
        <el-select v-model="queryParams.house_id" placeholder="流程名称" clearable>
          <el-option
            v-for="u in flowPathName"
            :key="u.value"
            :label="u.label"
            :value="u.value"
          />
        </el-select>
      </el-form-item>
      <!--      发起人-->
      <el-form-item prop="house_id">
        <el-select v-model="queryParams.house_id" placeholder="发起人" clearable>
          <el-option
            v-for="u in flowPathName"
            :key="u.value"
            :label="u.label"
            :value="u.value"
          />
        </el-select>
      </el-form-item>
      <!--搜索重置-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!--表格-->
    <el-table v-loading="loading" :data="handleList">
      <el-table-column label="流程名称" align="center" prop="processName"/>
      <el-table-column label="编号" align="center" prop="number"/>
      <el-table-column label="流程标题" align="center" prop="processTitle"/>
      <el-table-column label="发起人" align="center" prop="promoter"/>
      <el-table-column label="申请时间" align="center" prop="applyTime"/>
      <el-table-column label="状态" align="center" prop="status"/>
      <el-table-column label="审核节点" align="center" prop="reviewNodes"/>
      <el-table-column label="审核人" align="center" prop="reviewBy"/>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDetails(scope.row)"
          >详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--    翻页-->
    <pagination
      v-show="pageParams.total>0"
      :total="pageParams.total"
      :page.sync="pageParams.page"
      :limit.sync="pageParams.limit"
      @pagination="getHandleList"
    />
  </div>
</template>

<script>
//我的办理页面
export default {
  name: "index",
  data(){
    return{
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 查询参数
      queryParams: {

      },
      //翻页参数
      pageParams:{
        total:10,
        page: 1,
        limit: 10,
        order: "id desc",
      },
      //流程名称
      flowPathName: [],
      //查询列表数据
      handleList:[
        {
          id:"1",
          processName: '采购',
          number: '1',
          processTitle: "采购",
          promoter: "郑浩",
          applyTime: "2023/12/04",
          status: "在线",
          reviewNodes: "上级审批",
          reviewBy: "郑浩",
        }
      ],
    }
  },
  created() {
    this.getHandleList();
  },
  methods:{
    /** 获取我办理的列表数据 */
    getHandleList(){
      let params = {};
      this.loading = false;
    },
    /** 搜索按钮操作 */
    handleQuery() {

    },
    /** 重置按钮*/
    resetQuery(){

    },

  }
}
</script>

<style scoped>

</style>
