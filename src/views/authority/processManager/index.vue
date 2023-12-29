<template>
  <div class="app-container">
    <!--表格-->
    <el-table v-loading="loading" :data="processManagerList">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column label="流程名称" align="center" prop="modelName"/>
      <el-table-column label="修改人" align="center" prop="updateBy"/>
      <el-table-column label="修改时间" align="center" prop="updateTime">
        <template slot-scope="scope">
          {{ new Date(scope.row.updateTime).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-order"
            @click="editDetails(scope.row,scope.row.activeModelId)"
          >详情
          </el-button>
          <el-button
            size="mini"
            type="text"
            v-hasPermi="['pms:examine:edit']"
            icon="el-icon-edit"
            @click="showEditProcessDialog(scope.row,scope.row.activeModelId)"
          >编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <!--    详情弹框内容-->
    <process-detail :dialogDetailsProcessDialog="dialogDetailsProcessDialog" :detailsTitle="modelNameProcess" :modelId="modelId"
                    @handleCloseProcess="handleCloseProcess"></process-detail>

    <!--    编辑弹框-->
    <process-edit :dialogEditProcessDialog="dialogEditProcessDialog" :detailsTitle="modelNameProcess" :activeModelId="activeModelId"
                  @handleClose="handleClose" @handleApproverClick="handleApproverClick"
                  :processObj="processObj"></process-edit>

    <!--    审批人弹框-->
    <process-input :dialogInputProcessDialog="dialogInputProcessDialog" @closeInputProcess="closeInputProcess"
                   @selectMember="selectMember"></process-input>
  </div>
</template>

<script>
//流程管理页面
import {getProcessList} from '@/api/auditCenter/process/process';
import processDetail from '@/common/process/processDetail';
import processEdit from '@/common/process/processEdit';
import processInput from '@/common/process/processInput';

export default {
  name: "index",
  components: {
    processDetail,
    processEdit,
    processInput,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      //编辑审核中心的详情
      dialogEditProcessDialog: false,
      //详情展示
      dialogDetailsProcessDialog: false,
      //审批人弹框
      dialogInputProcessDialog: false,
      modelId: '',
      activeModelId: '',
      //查询列表
      processManagerList: [],
      processObj: null,
      //详情流程名称
      modelNameProcess:'',
    }
  },
  created() {

  },
  mounted() {
    this.getProcessManagerList();
  },
  computed: {},
  methods: {
    /*获取流程列表的查询管理*/
    getProcessManagerList() {
      getProcessList().then((res) => {
        this.loading = false;
        this.processManagerList = res.data
      })
    },
    /*编辑审核中心*/
    showEditProcessDialog(row,index) {
      this.activeModelId = index
      this.modelNameProcess = row.modelName;
      this.dialogEditProcessDialog = true;

    },
    /* 关闭编辑弹框 */
    handleClose() {
      this.getProcessManagerList();
      this.dialogEditProcessDialog = false;
      this.modelId = "";
      this.activeModelId = "";
      this.processObj = "";
      this.modelNameProcess = "";
    },
    /* 审批人弹框 */
    handleApproverClick() {
      this.dialogInputProcessDialog = true;
    },

    /*详情弹框*/
    editDetails(row,modelId) {
      this.modelNameProcess  = row.modelName;
      this.modelId = modelId;
      this.dialogDetailsProcessDialog = true;
    },
    /* 关闭详情 */
    handleCloseProcess() {
      this.dialogDetailsProcessDialog = false;
      this.processObj = "";
      this.modelNameProcess = "";
    },
    closeInputProcess() {
      this.dialogInputProcessDialog = false;
    },
    selectMember(nickName, userId) {
      this.processObj = {userId,nickName};
      // this.processObj.nickName = nickName
      // this.processObj.userId = userId
      this.dialogInputProcessDialog = false;
    }
  },
}
</script>

<style scoped>

</style>
