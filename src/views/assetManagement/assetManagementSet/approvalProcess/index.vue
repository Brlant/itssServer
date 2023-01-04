<template>
  <div class="app-container">
    <div class="process-title">
      <div style="font-size: 18px">审批流程管理</div>
      <div style="color: #1c6cf7" @click="add">+添加</div>
    </div>
    <el-table :data="processData">
      <el-table-column label="流程组ID" align="center" prop="id" />
      <el-table-column label="流程组名称" align="center" prop="typeName" />
      <el-table-column
        label="适用范围描述"
        align="center"
        prop="typePinyinAbbr"
      />
      <el-table-column label="当前在用类型" align="center" prop="createTime" />
      <el-table-column label="上次修改时间" align="center" prop="manageType" />
      <el-table-column label="上次修改人" align="center" prop="remark" />
      <el-table-column
        label="操作"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px" v-hasPermi="['system:user:add']">
            <el-button size="mini" type="text" @click="copy(scope.row)"
              >复制</el-button
            >
          </span>
          <span style="margin-left: 10px" v-hasPermi="['system:user:add']">
            <el-button size="mini" type="text" @click="edit(scope.row)"
              >编辑</el-button
            >
          </span>
           <span style="margin-left: 10px" v-hasPermi="['system:user:add']">
            <el-button size="mini" type="text" @click="detail(scope.row)"
              >详情</el-button
            >
          </span>
          <span style="margin-left: 10px" v-hasPermi="['system:user:add']">
            <el-button
              size="mini"
              type="text"
              style="color: red"
              @click="stopOrUse(scope.row.id, 1)"
              v-if="scope.row.status == 0"
              >停用</el-button
            >
          </span>
          <span style="margin-left: 10px" v-hasPermi="['system:user:add']">
            <el-button
              size="mini"
              type="text"
              @click="stopOrUse(scope.row.id, 0)"
              v-if="scope.row.status == 1"
              >启用</el-button
            >
          </span>
          <span style="margin-left: 10px" v-hasPermi="['system:user:add']">
            <el-button size="mini" type="text" @click="del(scope.row.id, 0)"
              >删除</el-button
            >
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      processData: [{ id: 1, status: 0 }],
    };
  },
  methods: {
    //添加
    add() {
      const obj = {
        path: "/assetManagement/assetManagementSet/process/addApprovalProcess",
      };
      // getToday()
      this.$tab.closeOpenPage(obj);
    },
    //复制
    copy() {
        const obj = {
        path: "/assetManagement/assetManagementSet/process/addApprovalProcess",
      };
      // getToday()
      this.$tab.closeOpenPage(obj);
    },
    //详情
    detail(){
         const obj = {
        path: "/assetManagement/assetManagementSet/process/detailApprovalProcess",
      };
      // getToday()
      this.$tab.closeOpenPage(obj);
    },
    //编辑
    edit() {
      const obj = {
        path: "/assetManagement/assetManagementSet/process/editApprovalProcess",
      };
      // getToday()
      this.$tab.closeOpenPage(obj);
    },
    //停用启用
    stopOrUse() {},
    //删除
    del() {},
  },
};
</script>
<style lang="scss" scoped>
.process-title {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}
</style>
