<template>
  <div class="app-container">
    <!--表格-->
    <el-table v-loading="loading" :data="processManagerList">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column label="流程名称" align="center" prop="processName" />
      <el-table-column label="修改人" align="center" prop="modifiedBy" />
      <el-table-column label="修改时间" align="center" prop="modifiedTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-order"
            @click="editDetails"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="showEditProcessDialog()"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
<!--    翻页-->
    <pagination
      v-show="pageParams.total>0"
      :total="pageParams.total"
      :page.sync="pageParams.page"
      :limit.sync="pageParams.limit"
      @pagination="getProcessManagerList"
    />

<!--    详情弹框内容-->
    <el-dialog :visible.sync="dialogDetailsProcessDialog" :title="detailsTitle" width="60%">
      <template v-slot:title>
        <div style="font-weight: bold;font-size: 15px">{{ detailsTitle }}</div>
      </template>
<!--      详情弹框表格内容-->
      <el-table v-loading="detailsLoading" :data="detailsDataList">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="节点名称" align="center" prop="nodeName" />
        <el-table-column label="审批人类型" align="center" prop="approvedType" />
        <el-table-column label="审批人" align="center" prop="approvedBy" />
      </el-table>
    </el-dialog>

<!--    编辑弹框内容-->
    <!--    详情弹框内容-->
    <el-dialog :visible.sync="dialogEditProcessDialog" :title="editTitle" width="60%">
      <template v-slot:title>
        <div style="font-weight: bold;font-size: 15px">{{ editTitle }}</div>
      </template>
      <el-table :data="tableData" style="width: 100%">
        <!-- 序号列 -->
        <el-table-column type="index" label="序号"></el-table-column>

        <!-- 节点名称列，使用 el-input -->
        <el-table-column label="节点名称">
          <template slot-scope="scope">
            <el-input
              v-if="!scope.row.isStart && !scope.row.isEnd"
              v-model="scope.row.nodeName"
              placeholder="请输入节点名称"
            ></el-input>
            <span v-else>{{ scope.row.nodeName }}</span>
          </template>
        </el-table-column>

        <!-- 审批人类型列，使用 el-select -->
        <el-table-column label="审批人类型">
          <template slot-scope="scope">
            <el-select
              v-if="!scope.row.isStart && !scope.row.isEnd"
              v-model="scope.row.approverType"
              placeholder="请选择审批人类型"
            >
              <el-option
                v-for="item in approverTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span v-else>/</span>
          </template>
        </el-table-column>

        <!-- 审批人列，使用 el-input，并添加点击事件 -->
        <el-table-column label="审批人">
          <template slot-scope="scope">
            <el-input
              v-if="!scope.row.isStart && !scope.row.isEnd"
              readonly
              v-model="scope.row.approver"
              placeholder="点击选择审批人"
              @click.native="handleApproverClick(scope.$index)"
            ></el-input>
            <span v-else>/</span>
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.isStart"
              type="text"
              icon="el-icon-plus"
              @click="addRow(scope.$index)"
            ></el-button>
            <template v-else-if="!scope.row.isEnd">
              <el-button
                type="text"
                icon="el-icon-plus"
                @click="addRow(scope.$index)"
              ></el-button>
              <el-button
                type="text"
                icon="el-icon-minus"
                @click="removeRow(scope.$index)"
              ></el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <el-button @click="print">打印</el-button>

    </el-dialog>


<!--    编辑弹框内容-->
    <el-dialog :visible.sync="dialogInputProcessDialog" title="选择审批人" width="60%">
      <div class="dialog-content">
        <div class="left-column">
          <el-tree :data="treeData"
                   :props="treeProps"
                   expand-on-click-node
                   @node-click="handleNodeClick">
          </el-tree>
        </div>
        <div class="right-column">
          <el-input v-model="searchValue"  prefix-icon="el-icon-search" placeholder="请输入姓名或职位"></el-input>
          <el-table :data="filteredMembers" highlight-current-row @row-click="selectMember">
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="职位" prop="position"></el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogInputProcessDialog = false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//流程管理页面
export default {
  name: "index",
  data(){
    return{
      tableData: [
        { nodeName: '开始', isStart: true, isEnd: false },
        { nodeName: '结束', isStart: false, isEnd: true }
      ],
      approverTypes: [
        { value: 'type1', label: '审批类型1' },
        { value: 'type2', label: '审批类型2' },
        // 更多审批类型...
      ],
      //详情加载
      detailsLoading:false,
      //弹框详情
      detailsTitle:'供应商档案审核流程',
      editTitle:'供应商档案审核流程',
      // 遮罩层
      loading: true,
      //编辑审核中心的详情
      dialogInputProcessDialog:false,

      //编辑审核中心的详情
      dialogEditProcessDialog:false,
      //详情展示
      dialogDetailsProcessDialog:false,
      //查询列表
      processManagerList:[
        { processName:"项目A",modifiedBy:"郑浩",modifiedTime:"2023/12/04 15:23", status: "pending" },
      ],
      //翻页参数
      pageParams:{
        total:10,
        page: 1,
        limit: 10,
        order: "id desc",
      },
      //详情列表
      detailsDataList:[
        {nodeName:"开始",approvedType:"/",approvedBy:"/"},
        {nodeName:"上级审批",approvedType:"上级领导",approvedBy:"上级领导"},
        {nodeName:"采购专员审批",approvedType:"指定人员",approvedBy:"郑浩"},
        {nodeName:"结束",approvedType:"/",approvedBy:"/"},
      ],
      //折叠数据
      treeData: [
        {
          label: '数字化中心',
          children: [
            { label: '开发部' },
            { label: '测试部' },
            { label: '市场部' },
          ],
        },
        {
          label: '采购部',
          children: [
            { label: '采购一部' },
            { label: '采购二部' },
            { label: '采购三部' },
          ],
        },
        {
          label: '物流中心',
          children: [
            { label: '仓储部' },
            { label: '运输部' },
            { label: '配送部' },
          ],
        },
      ],
      treeProps: {
        children: 'children',
        label: 'label',
      },
      members: [
        { name: '张三', position: '采购专员', department: '采购一部' },
        { name: '李四', position: '开发工程师', department: '开发部' },
        { name: '王五', position: '测试工程师', department: '测试部' },
        { name: '赵六', position: '采购经理', department: '采购部' },
        { name: '钱七', position: '采购专员', department: '采购二部' },
        { name: '孙八', position: '仓储经理', department: '仓储部' },
        { name: '周九', position: '运输经理', department: '运输部' },
        { name: '吴十', position: '配送经理', department: '配送部' },
      ],
      filteredMembers: [],
      searchValue: '',
      currentRowIndex: null, // 当前操作的行索引
    }
  },
  created() {
    this.getProcessManagerList();
  },
  computed:{
    filteredMembers() {
      return this.members.filter(
        member =>
          member.name.includes(this.searchValue) ||
          member.position.includes(this.searchValue)
      );
    },
  },
  methods:{
    /*增加行数*/
    addRow(index) {
      const newRow = { nodeName: '', approverType: '', approver: '', isStart: false, isEnd: false };
      this.tableData.splice(index + 1, 0, newRow);
    },
    /*减少行数*/
    removeRow(index) {
      if (!this.tableData[index].isStart && !this.tableData[index].isEnd) {
        this.tableData.splice(index, 1);
      }
    },

    handleApproverClick(index) {
      // 记录当前行索引并打开对话框
      this.currentRowIndex = index;
      this.dialogInputProcessDialog = true;

    },
    print(){

      console.log(this.tableData);
    },

    /*获取流程列表的查询管理*/
    getProcessManagerList(){
      let params = {};
      this.loading = false;
    },
    /*编辑审核中心*/
    showEditProcessDialog(){
      this.dialogEditProcessDialog = true;
      this.filteredMembers = this.members;
    },
    /*点击树事件触发*/
    handleNodeClick(node) {
      if (!node.children || node.children.length === 0) {
        this.filteredMembers = this.members.filter(
          member => member.department === node.label
        );
      }
    },
    selectMember(row) {
      console.info(row,'===========')
      // 用户选择了一个审批人，更新相应行的审批人字段并关闭对话框
      if (this.currentRowIndex !== null) {
        this.tableData[this.currentRowIndex].approver = row.name;
      }
      this.dialogInputProcessDialog = false;
    },
    /*详情弹框*/
    editDetails(){
      this.dialogDetailsProcessDialog = true;
    },
  },
}
</script>

<style scoped>
.el-tree {
  width: 200px;
  margin-right: 20px;
}
.right-column {
  width: 80%;
  flex: 1;
  padding-left: 20px;
}
.dialog-content {
  display: flex;
}
.dialog-content .el-tree {
  height: 400px;
  overflow-y: auto;
  border-right: 1px solid #ccc;
  padding-right: 10px;
}
.dialog-content .right-column {
  padding-left: 20px;
}
</style>
