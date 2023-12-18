<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <!--      流程标题搜索-->
      <el-form-item prop="key">
        <el-input
          prefix-icon="el-icon-search"
          v-model="queryParams.key"
          placeholder="档案/单据编号/名称搜索"
          clearable
          @keyup.enter.native="getInitiateList"
        />
      </el-form-item>
      <!--     时间搜索 -->
      <el-form-item prop="time">
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
      <!--      发起人-->
      <el-form-item prop="remark">
        <el-input
          :disabled="true"
          v-model="queryParams.remark"
          placeholder="发起人"
          clearable
        />
      </el-form-item>
      <!--      状态-->
      <el-form-item prop="examineStatus">
        <el-select v-model="queryParams.examineStatus" placeholder="审核状态" clearable>
          <el-option
            v-for="(item,index) in examineStatusArray"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!--搜索重置-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getInitiateList">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="initiateList">
      <el-table-column label="流程名称" align="center" prop="modelName"/>
      <el-table-column label="档案/单据编号" align="center" prop="relationCode"/>
      <el-table-column label="档案/单据名称" align="center" prop="relationName"/>
      <el-table-column label="发起人" align="center" prop="promoterId">
        <template slot-scope="scope">
          <div v-if="scope.row.promoterId === queryParams.promoterId">
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

    <pagination
      v-show="queryParams.total>0"
      :total="queryParams.total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getInitiateList"
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
    <!--   提示信息 -->
    <prompt-info :promptInfoForm="promptInfoForm" @handleClosePrompt="handleClosePrompt"></prompt-info>
  </div>
</template>

<script>
import {getInitiatedList} from "@/api/auditCenter/initiated/initiated";
//我发起的页面
import fileInfo from '@/common/details/fileInfo.vue'
import auditInfo from '@/common/details/auditInfo.vue'
import operationLog from '@/common/details/operationLog'
//提醒消息
import promptInfo from '@/common/promptInfo/promptInfo'

export default {
  name: 'index',
  components:{
    promptInfo
  },
  data() {
    return {
      //提醒消息
      promptInfoForm:false,
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
        promoterId:'',
        examineStatus:"",
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
      examineStatusArray:[
        {label:"待审核",value:0},
        {label:"审核中",value:1},
        {label:"已完成",value:3},
        {label:"已撤回",value:4},
        {label:"审核不通过",value:2},
      ],
      //流程名称
      flowPathName: [],
      objectRow: {
        id: ''
      },
      // 我发起的表格数据
      initiateList: []
    }
  },
  created() {
    let userInfo = window.localStorage.getItem("user");
    let userInfoParse = JSON.parse(userInfo);
    this.queryParams.remark = userInfoParse.remark;
    this.queryParams.promoterId = userInfoParse.userId;
  },
  mounted() {
    //调用查询接口
    this.getInitiateList()
  },
  methods: {
    changeHandleTime(row){
      if(this.queryParams.applyTime === ""){
        this.queryParams.pageSize = 1;  //将页码设置为第一页
      }
      this.queryParams.applyTime = row;
      this.getInitiateList();
    },


    /* 关闭消息提醒 */
    handleClosePrompt(){
      this.promptInfoForm = false;
    },
    closeDialog() {
      this.tabName = null
      this.activeTab = 'fileInfo'
      this.dialogDetailsProcessDialog = false
    },
    /*处理标签页信息*/
    handleTabClick(tab, event) {

    },
    /** 查询我的发起记录列表 */
    getInitiateList() {
      const params = {
        key:this.queryParams.key,
        startDate:this.queryParams.applyTime[0],
        endDate:this.queryParams.applyTime[1],
        modelName:this.queryParams.modelName,
        promoterId:this.queryParams.promoterId,
        examineStatus:this.queryParams.examineStatus,
        pageNum:this.queryParams.pageNum,
        pageSize:this.queryParams.pageSize,
        queryType:1,
      }
      getInitiatedList(params).then((res) => {
        this.loading = false
        this.initiateList = res.data.rows;
        this.queryParams.total = res.data.total;
      })
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.applyTime = '';
      this.$refs.queryForm.resetFields();
      this.getInitiateList();
    },
    /*测试跳转*/
    pageJump() {
      this.$router.push({
        path: '/examine/dealtWith',
        query: {
          id: '1'
        }
      })
    },
    /*详情*/
    handleDetails(row) {
      this.objectRow = row.id
      this.tabName = row.id
      this.dialogDetailsProcessDialog = true
    }
  }
}
</script>

<style scoped>
.log-status {
  margin-top: 20px;
  text-align: right;
}

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
