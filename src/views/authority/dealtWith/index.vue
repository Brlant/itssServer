<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <!--      流程标题搜索-->
      <el-form-item  prop="key">
        <el-input
          prefix-icon="el-icon-search"
          v-model="queryParams.key"
          placeholder="档案/单据编号/名称搜索"
          clearable
          @keyup.enter.native="getDealtWithList"
        />
      </el-form-item>
      <!--     时间搜索 -->
      <el-form-item  prop="applyTime">
        <el-date-picker
          v-model="queryParams.applyTime"
          style="width: 300px"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          type="daterange"
          @change="changeHandleTime"
          range-separator="-"
          start-placeholder="请选择开始时间"
          end-placeholder="请选择结束时间"
        ></el-date-picker>
      </el-form-item>
      <!--      流程名称-->
      <el-form-item prop="modelName">
        <el-select v-model="queryParams.modelName" placeholder="流程名称" clearable>
          <el-option
            v-for="(item,index) in modelNameArray"
            :key="index"
            :label="item.label"
            :value="item.label"
          />
        </el-select>
      </el-form-item>
      <!--搜索重置-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search"  @click="getDealtWithList">搜索</el-button>
        <el-button icon="el-icon-refresh"  @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

<!--表格-->
    <el-table v-loading="loading" :data="dealtWithList">
      <el-table-column label="流程名称" align="center" prop="modelName"/>
      <el-table-column label="档案/单据编号" align="center" prop="relationCode"/>
      <el-table-column label="档案/单据名称" align="center" prop="relationName"/>
      <el-table-column label="发起人" align="center" prop="reviewedId">
        <template slot-scope="scope">
          <div v-if="scope.row.reviewedId === queryParams.reviewedId">
            {{queryParams.remark}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center" prop="applyTime"/>
      <el-table-column label="状态" align="center" prop="examineStatus">
        <template slot-scope="scope">
          <span v-if="scope.row.examineStatus === 0">
            待审核
          </span>
          <span v-if="scope.row.examineStatus === 1">
            审核中
          </span>
          <span v-if="scope.row.examineStatus === 2">
            审核不通过
          </span>
          <span v-if="scope.row.examineStatus === 3">
            已完成
          </span>
          <span v-if="scope.row.examineStatus === 4">
            已撤回
          </span>
        </template>
      </el-table-column>>
      <el-table-column label="审核节点" align="center" prop="modelNode"/>
      <el-table-column label="审核人" align="center" prop="reviewedName"/>
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
      v-show="queryParams.total>0"
      :total="queryParams.total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
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
import { getDealtWithList} from '@/api/auditCenter/dealtWith/dealtWith'
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
        key:"",
        applyTime:"",
        modelName:"",
        remark:"",
        reviewedId:'',
        //分页
        total: 10,
        pageNum: 1,
        pageSize: 10,
        order: 'id desc'
      },
      modelNameArray:[
        { label: '供应商档案审批流程' },
        { label: '物品档案审批流程' },
        { label: '合同档案审批流程' }
      ],
      // 我发起的表格数据
      dealtWithList: [],
    }
  },
  watch:{

  },
  created() {
    let userInfo = window.localStorage.getItem("user");
    let userInfoParse = JSON.parse(userInfo);
    this.queryParams.remark = userInfoParse.remark;
    this.queryParams.reviewedId = userInfoParse.userId;
  },
  mounted() {
    // 通过查询参数接收参数,测试
    const queryParam = this.$route.query.id;
    this.getDealtWithList();
  },
  methods:{
    changeHandleTime(row){
      if(this.queryParams.applyTime === ""){
        this.queryParams.pageSize = 1;  //将页码设置为第一页
      }
      this.queryParams.applyTime = row;
      this.getDealtWithList();
    },
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
      const params = {
        key:this.queryParams.key,
        startDate:this.queryParams.applyTime[0],
        endDate:this.queryParams.applyTime[1],
        modelName:this.queryParams.modelName,
        reviewedId:this.queryParams.reviewedId,
        pageNum:this.queryParams.pageNum,
        pageSize:this.queryParams.pageSize,
        queryType:2,
      }
      getDealtWithList(params).then((res)=>{
        this.loading = false;
        this.queryParams.total = res.data.total;
        this.dealtWithList = res.data.rows;
      })
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.$refs.queryForm.resetFields();
      this.queryParams.applyTime = "";
      this.getDealtWithList();
    },
  },

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
