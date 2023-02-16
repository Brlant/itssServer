<template>
  <div class="app-container">
    <div class="process-title">
      <div style="font-size: 18px">审批流程管理</div>
      <div style="color: #1c6cf7;cursor:pointer" @click="add">+添加</div>
    </div>
    <el-table :data="processData">
      <el-table-column label="流程组ID" align="center" prop="id" />
      <el-table-column label="流程组名称" align="center" prop="groupName" />
      <el-table-column
        label="适用范围描述"
        align="center"
        prop="groupDescription"
      />
      <el-table-column label="当前在用类型" align="center" prop="assetTypeList">
        <template slot-scope="scope">
          <span v-for="(item, index) in scope.row.assetTypeList" :key="index">{{
            item.allName + "；"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上次修改时间" align="center" prop="updateTime">
      </el-table-column>
      <el-table-column label="上次修改人" align="center" prop="updatorName">
      </el-table-column>
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
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import {
  getapprovalProcess,
  deleteGroup,
  isUserGroup,
} from "@/api/assetManagement/assetManagementSet";
export default {
  data() {
    return {
      processData: [],
      page: {
        pageSize: 10,
        pageNum: 1,
      },
      total: 0,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getapprovalProcess(this.page).then((res) => {
        this.processData = res.rows;
        this.total = res.total;
      });
    },
    //添加
    add() {
      const obj = {
        path: "/assetManagement/assetManagementSet/process/addApprovalProcess",
        query: { isCopy: 1 },
      };
      // getToday()
      this.$tab.closeOpenPage(obj);
    },
    //复制
    copy(data) {
      const obj = {
        path: "/assetManagement/assetManagementSet/process/addApprovalProcess",
        query: { detailId: data.id, isCopy: 2 },
      };
      // getToday()
      this.$tab.closeOpenPage(obj);
    },
    //详情
    detail(data) {
      const obj = {
        path: "/assetManagement/assetManagementSet/process/detailApprovalProcess",
        query: { detailId: data.id },
      };
      // getToday()
      this.$tab.closeOpenPage(obj);
    },
    //编辑
    edit(data) {
      const obj = {
        path: "/assetManagement/assetManagementSet/process/editApprovalProcess",
        query: { detailId: data.id },
      };
      // getToday()
      this.$tab.closeOpenPage(obj);
    },
    //停用启用
    stopOrUse(id, item) {
      let data;
      if (item == 0) {
        data = {
          id,
          status: 0,
        };
      } else {
        data = {
          id,
          status: 1,
        };
      }
      isUserGroup(data).then((res) => {
        if (res.code == 200) {
          this.$message.success("操作成功");
          this.getList();
        }
      });
    },
    //删除
    del(id) {
      deleteGroup(id).then((res) => {
        if (res.code == 200) {
          this.$message.success("删除成功");
          this.getList()
        }
      });
    },
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
