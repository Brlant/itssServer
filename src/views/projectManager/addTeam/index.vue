<template>
  <div class="app-container">
    <div class="routerBar">
      <!-- <router-link :to="'/projectManager/proManager'"> < 编辑项目</router-link> -->
      <span @click="goManagerPage" style="cursor: pointer; color: #409eff">
        &lt; 新建项目组
      </span>
      <!-- 
      <span> （仅项目负责人可对此项目下列对内进行编辑）</span> -->
      <div class="rightBox">
        <el-button size="mini" @click="submitForm" type="primary"
          >保存</el-button
        >
        <el-button size="mini" @click="backDetail" type="default"
          >取消</el-button
        >
      </div>
    </div>
    <div class="titleBar">项目组信息</div>

    <el-form
      ref="elForm"
      :model="formData"
      :rules="rules"
      size="medium"
      label-width="150px"
    >
      <div class="whiteBox">
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item label="项目组名称：" prop="teamName">
              <el-input
                v-model="formData.teamName"
                placeholder="请输入项目组名称"
                show-word-limit
                maxlength="20"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item label="项目组有效期" prop="teamTimeArea">
              <el-date-picker
                type="daterange"
                v-model="formData.teamTimeArea"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :style="{ width: '100%' }"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                range-separator="至"
                clearable
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item
              label="项目组负责人"
              prop="teamUserId"
              style="position: relative"
            >
              <el-select
                v-model="formData.teamUserId"
                placeholder="请选择项目组负责人"
                clearable
                :style="{ width: '100%' }"
              >
                <el-option
                  v-for="user in teamUserIdOptions"
                  :key="user.userId"
                  :label="user.nickName"
                  :value="user.userId"
                  :disabled="user.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>
<script>
import { teamAdd, queryUserlist } from "@/api/proManager/teamMange";

export default {
  data() {
    return {
      childDateArea: {
        // 项目成员安排的 可选时间区间
        disabledDate: (time) => {
          if (
            this.formData.projectTimeArea &&
            this.formData.projectTimeArea.length > 1
          ) {
            // 设置可以选择的区间 时间为项目的 起始日期和结束日期
            return (
              time.getTime() >
                new Date(this.formData.projectTimeArea[1]).getTime() ||
              time.getTime() <
                new Date(this.formData.projectTimeArea[0]).getTime() - 8.64e7
            );
          }
        },
      },
      // 人员 列表
      teamUserIdOptions: [{ nickName: "aa", userId: "1" }],
      formData: {
        teamName:'',
        teamName:[],
        teamUserId:''
      },
      rules: {
        teamName: [
          {
            required: true,
            message: "请输入项目组名称",
            trigger: "blur",
          },
        ],
        teamTimeArea: [
          {
            required: true,
            message: "请选择项目组有效期",
            trigger: "change",
          },
        ],
        teamUserId: [
          {
            required: true,
            message: "请选择项目组负责人",
            trigger: "change",
          },
        ],
      },
    };
  },
  mounted() {
    this.userList();
  },
  methods: {
    userList() {
      queryUserlist({}).then((res) => {
        this.teamUserIdOptions = res.data;
      });
    },
    // 保存 updateProjectUserAddEdit 新增用户信息的
    submitForm() {
      this.$refs["elForm"].validate((valid) => {
        if (valid) {
          let data = {
            projectGroupName: this.formData.teamName,
            startDate: this.formData.teamTimeArea[0],
            endDate: this.formData.teamTimeArea[1],
            projectGroupUserId: this.formData.teamUserId,
          };
          teamAdd(data).then((res) => {
            if (res.code == 200) {
              this.$message.success(res.msg);
              const obj = { path: "/projectManager/projectTeam" };
              this.$tab.closeOpenPage(obj);
            }
          });
        }
      });
    },
    backDetail() {
       this.$refs["elForm"].resetFields();
    },
    goManagerPage() {
      const obj = { path: "/projectManager/projectTeam" };
      this.$tab.closeOpenPage(obj);
    },
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  padding: 0;
}
.UserLine {
  border-bottom: 1px #efefef solid;
  padding-bottom: 10px;
  margin-bottom: 10px;
}
.routerBar {
  a {
    color: #557db3;
  }
  span {
    font-size: 12px;
    color: #999;
  }
}
.myTag {
  color: rgb(204, 204, 204);
  font-size: 12px;
  position: absolute;
  top: 40px;
  /* border: 1px solid red; */
  width: initial;
  display: inline-block;
  right: 8px;
  height: 14px;
  line-height: 14px;
}
.colText {
  height: inherit;
  line-height: 150%;
  // background-color: beige;
  // border: 1px red solid;
  margin-top: 8.5px;
  font-size: 12px;
  color: #999;
  text-align: center;
  span {
    color: #557db3;
  }
}
.priority4 {
  color: #909399;
}
.priority3 {
  color: #409eff;
}
.priority2 {
  color: #e6a23c;
}
.priority1 {
  color: #f56c6c;
}
.color4 {
  color: #f56c6c;
}
</style>
<style>
.UserLine /deep/.el-form-item {
  margin-bottom: 2px;
}
</style>
