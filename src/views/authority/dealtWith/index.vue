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
        <el-button type="primary" icon="el-icon-search"  @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh"  @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

<!--表格-->
    <el-table v-loading="loading" :data="dealtWithList">
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
      @pagination="getDealtWithList"
    />
    <!--    详情弹框内容-->
    <el-dialog :visible="dialogDetailsProcessDialog" :title="detailsTitle" width="75%" @close="closeDialog">
      <template v-slot:title>
        <div style="font-weight: bold;font-size: 15px">{{ detailsTitle }}</div>
      </template>
      <!--      标签页-->
      <template class="templateDialogStyle">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
          <el-tab-pane
            v-for="tab in tabs"
            :key="tab.name"
            :label="tab.label"
            :name="tab.name"
          >
            <!-- 使用组件作为标签页内容 -->
            <component :is="tab.component" :tabName="tabName"></component>
          </el-tab-pane>
        </el-tabs>
        <div class="tabStatus">
          状态
        </div>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//我的待办页面
import fileInfo from '@/common/details/fileInfo'
import auditInfo from '@/common/details/auditInfo'
import operationLog from '@/common/details/operationLog'

export default {
  name: "index",
  components:{

  },
  data(){
    return{
      activeTab: 'fileInfo',
      tabs: [
        { label: '档案信息', name: 'fileInfo', component: fileInfo },
        { label: '审核信息', name: 'auditInfo', component: auditInfo },
        { label: '操作日志', name: 'operationLog', component: operationLog }
      ],
      tabName: null,
      houseOptions: [],
      //详情信息
      detailsTitle: '详情信息',
      //详情信息弹框
      dialogDetailsProcessDialog: false,
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
      // 我发起的表格数据
      dealtWithList: [
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
  watch:{

  },
  created() {
    this.getDealtWithList();
  },
  methods:{
    closeDialog() {
      this.tabName = null
      this.activeTab = 'fileInfo'
      this.dialogDetailsProcessDialog = false
    },
    /* 详情弹框 */
    handleDetails(row){
      this.dialogDetailsProcessDialog = true;
    },
    /*处理标签页信息*/
    handleTabClick(tab, event) {

    },
    /** 查询我的发起记录列表 */
    getDealtWithList(){
      let params = {};
      this.loading = false;
    },
    /** 搜索按钮操作 */
    handleQuery() {

    },
    /** 重置按钮操作 */
    resetQuery() {

    },
  },
  mounted() {
    // 通过查询参数接收参数,测试
    const queryParam = this.$route.query.id;
  }
}
</script>

<style scoped>
.templateDialogStyle {
  position: relative;
}

.tabStatus {
  position: absolute;
  top: 90px;
  left: 300px;
  width: 80px;
  height: 20px;
  text-align: center;
  color: #F79B22;
}
</style>
