<template>
  <div class="app-container">
    <div class="routerBar">
      <router-link :to="'/projectManager/proManager'"> < 新建项目</router-link>
      <span> （仅项目负责人可对此项目下列对内进行编辑）</span>
      <div class="rightBox">
        <el-button size="mini" @click="submitForm" type="primary">保存</el-button>
        <el-button size="mini" @click="resetForm" type="default">取消</el-button>
      </div>
    </div>
    <div class="titleBar">项目基础信息</div>

    <el-form
      ref="elForm"
      :model="formData"
      :rules="rules"
      size="medium"
      label-width="100px"
    >
      <div class="whiteBox">
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item label="项目编号：" prop="projectCode">
              <el-input
                v-model="formData.projectCode"
                placeholder="请输入项目编号"
                show-word-limit
                maxlength="20"
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="项目名称：" prop="projectName">
              <el-input
                v-model="formData.projectName"
                placeholder="请输入项目名称"
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
            <el-form-item label="项目阶段：" prop="projectStage">
              <el-select
                v-model="formData.projectStage"
                placeholder="请选择项目阶段"
                filterable
                clearable
                :style="{ width: '100%' }"
              >
                <el-option
                  v-for="(dict, index) in projectStageOptions"
                  :key="dict.dictCode"
                  :label="dict.dictLabel"
                  :value="dict.dictCode"
                  :disabled="dict.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="项目类型：" prop="projectType">
              <el-select
                v-model="formData.projectType"
                placeholder="请选择项目类型"
                filterable
                clearable
                :style="{ width: '100%' }"
              >
                <el-option
                  v-for="(dict, index) in projectTypeOptions"
                  :key="dict.dictCode"
                  :label="dict.dictLabel"
                  :value="dict.dictCode"
                  :disabled="dict.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item label="优先级：" prop="priority">
              <el-radio-group v-model="formData.priority" size="medium">
                <el-radio
                  v-for="(item, index) in priorityOptions"
                  :key="index"
                  :label="item.value"
                  :disabled="item.disabled"
                >
                  <b :class="['priority' + item.value]">
                    {{ item.label }}
                  </b>
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item
              label="项目负责人"
              prop="projectUserId"
              style="position: relative"
            >
              <el-select
                v-model="formData.projectUserId"
                placeholder="请选择项目负责人"
                clearable
                :style="{ width: '100%' }"
              >
                <el-option
                  v-for="(user, index) in projectUserIdOptions"
                  :key="user.userId"
                  :label="user.nickName"
                  :value="user.userId"
                  :disabled="user.disabled"
                ></el-option>
              </el-select>
              <span class="myTag"
                >(负责关联此项目的工时的最终审批；可对关联此项目的工单进行编辑和人员指派)</span
              >
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item label="服务对象" prop="projectService">
              <el-select
                v-model="formData.projectService"
                placeholder="请选择服务对象"
                clearable
                :style="{ width: '100%' }"
              >
                <el-option
                  v-for="(dict, index) in projectServiceOptions"
                  :key="index"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="GitLab地址" prop="projectGitUrl">
              <el-input
                v-model="formData.projectGitUrl"
                placeholder="请输入GitLab地址"
                show-word-limit
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item label="项目有效期" prop="projectTimeArea">
              <el-date-picker
                type="daterange"
                v-model="formData.projectTimeArea"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :style="{ width: '100%' }"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                range-separator="至"
                clearable
                @change="getProjectTimeArea"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <!-- <el-form-item label="关联机会" prop="projectChance">
                  <el-select
                    v-model="formData.projectChance"
                    placeholder="请选择关联机会"
                    clearable
                    :style="{ width: '100%' }"
                  >
                    <el-option
                      v-for="(item, index) in projectChanceOptions"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled"
                    ></el-option>
                  </el-select>
                </el-form-item> -->
          </el-col>
        </el-row>
      </div>
      <div class="titleBar">
        项目成员安排
        <div class="rightBox">
          <el-button size="mini" @click="addUserListHandel" type="primary"
            >添加成员</el-button
          >
        </div>
      </div>
      <div class="whiteBox UserListBox">
        <div
          class="UserLine"
          v-for="(addUserList, addUserListindex) in formData.projectUserList"
          :key="addUserListindex"
        >
          <el-row>
            <el-col :span="3">
              <el-form-item
                :prop="`projectUserList.${addUserListindex}.userId`"
                :rules="rules.projectUserListAllUserId"
                label-width="30px"
              >
                <el-select
                  v-model="addUserList.userId"
                  placeholder="请选择项目成员"
                  clearable
                  @change="
                    (userId) => {
                      getUserCost(userId, addUserListindex);
                    }
                  "
                  @clear="releaseUser(addUserListindex)"
                  :style="{ width: '100%' }"
                >
                  <el-option
                    v-for="user in userOptions"
                    :key="user.userId"
                    :label="user.userNameAndPost"
                    :value="user.userId"
                    :disabled="user.disabled"
                  ></el-option>
                </el-select> </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label=""
                :prop="`projectUserList.${addUserListindex}.startEndTime`"
                :rules="rules.projectUserListAllStartEndTime"
                label-width="50px"
              >
                <el-date-picker
                  type="daterange"
                  v-model="addUserList.startEndTime"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :style="{ width: '100%' }"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  range-separator="至"
                  :picker-options="childDateArea"
                  @change="(dates) => getTimeArea(dates, addUserListindex)"
                  clearable
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <div class="colText">
                共 <span>{{ addUserList.workTime }}</span> 小时（
                <span>{{ addUserList.workDay }}</span> 人日）
              </div></el-col
            >
            <el-col :span="5"
              ><div class="colText">
                计划负荷：<span>{{ addUserList.planLoad }}</span> %
              </div></el-col
            >
            <el-col :span="4"
              ><div class="colText">
                预计成本：<span>{{ addUserList.expectedCost }}</span> 元
              </div></el-col
            >
            <el-col :span="3"
              ><div class="colText2">
                <el-button size="mini" @click="DelUserList(addUserListindex)" type="error"
                  >删除</el-button>
              </div>
            </el-col>
          </el-row>
          <!----------------------内部-start------------------------------>
          <el-row
            v-for="(
              UserScheduleList, UserScheduleListIndex
            ) in addUserList.projectUserScheduleList"
            :key="UserScheduleListIndex"
          >
            <el-col :offset="5" :span="4">
              <div class="colText" style="text-indent: 30px">
                {{ UserScheduleList.startTime + "-" + UserScheduleList.endTime }}
              </div></el-col
            >
            <el-col :span="3">
              <div class="colText">
                每日
                <el-input-number
                  size="mini"
                  :style="{ width: '100px' }"
                  v-model="UserScheduleList.workTime"
                  :min="0"
                  :max="24"
                  @input.native="changeInput($event)"
                  @change="
                    (number) => {
                      changeDayTime(
                        number,
                        UserScheduleList.day,
                        addUserListindex,
                        UserScheduleListIndex
                      );
                    }
                  "
                ></el-input-number>
                小时
              </div>
            </el-col>
            <el-col :span="5"
              ><div class="colText">
                期间计划负荷：<span>{{ UserScheduleList.planLoad }}</span> %
              </div></el-col
            >
            <el-col :span="3"><div class="colText2"></div> </el-col>
          </el-row>
          <!----------------------内部-end------------------------------>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import {
  getTimeProcess,
  queryUserlist,
  queryDict,
  addProjectList,
  searchProjectList,
  queryUserlistByRole,
} from "@/api/proManager/proManager";

export default {
  name:"BaseComponents",
  data() {
    return {
      childDateArea: {
        // 项目成员安排的 可选时间区间
        disabledDate: (time) => {
          if (this.formData.projectTimeArea && this.formData.projectTimeArea.length > 1) {
            // 设置可以选择的区间 时间为项目的 起始日期和结束日期
            return (
              time.getTime() > new Date(this.formData.projectTimeArea[1]).getTime() ||
              time.getTime() <
                new Date(this.formData.projectTimeArea[0]).getTime() - 8.64e7
            );
          }
        },
      },
      // 人员 列表
      userOptions: [],
      formData: {
        priority: 3,/**优先级（1.最高，2.高，3.普通，4.较低）*/
        projectChance: "",/**关联机会*/
        projectCode: "",/**项目编号*/
        projectEndTime: "",/**项目结束时间*/
        projectName: "",/**项目名称*/
        projectService: "",/**服务对象*/
        projectStage: "",/**项目阶段*/
        projectStartTime: "",/**项目开始时间*/
        projectType: "",/**项目类型*/
        projectUserId: "",/**项目负责人*/
        projectUserList: [],/**项目成员列表*/
        projectGitUrl:"",// 项目git 地址
        // priority: 3, //快速调试
        // projectChance: "",
        // projectCode: "123",
        // projectEndTime: "2022-11-30",
        // projectName: "123",
        // projectService: 1,
        // projectStage: 128,
        // projectStartTime: "2022-10-01",
        // projectType: 123,
        // projectUserId: 113,
        // projectUserList: [],
        // projectGitUrl: "123",
        // projectTimeArea: ["2022-10-01", "2022-11-30"],
      },
      rules: {
        projectUserListAllUserId: [
          {
            required: true,
            message: "请选择项目成员",
            trigger: "change",
          },
        ],
        projectGitUrl: [
          {
            required: true,
            message: "请输入GitLab地址",
            trigger: "blur",
          },
        ],
        projectUserListAllStartEndTime: [
          {
            required: true,
            message: "请选择参与时间",
            trigger: "change",
          },
        ],

        projectCode: [
          {
            required: true,
            message: "请输入项目编号：",
            trigger: "blur",
          },
        ],
        projectName: [
          {
            required: true,
            message: "请输入项目名称：",
            trigger: "blur",
          },
        ],
        projectStage: [
          {
            required: true,
            message: "请输入项目阶段：",
            trigger: "change",
          },
        ],
        projectType: [
          {
            required: true,
            message: "请选择项目类型：",
            trigger: "change",
          },
        ],
        priority: [
          {
            required: true,
            message: "优先级：不能为空",
            trigger: "change",
          },
        ],
        projectUserId: [
          {
            required: true,
            message: "请选择项目负责人",
            trigger: "change",
          },
        ],
        projectService: [
          {
            required: true,
            message: "请选择服务对象",
            trigger: "change",
          },
        ],
        projectTimeArea: [
          {
            required: true,
            message: "项目有效期不能为空",
            trigger: "change",
          },
        ],
        // projectChance: [
        //   {
        //     required: true,
        //     message: "请选择关联机会",
        //     trigger: "change",
        //   },
        // ],
      },
      // 单独的 用户列表
      projectUserList: {
        endTime: "" /**结束时间*/,
        expectedCost: "" /**预计成本*/,
        planLoad: "" /**计划负荷*/,
        startTime: "" /**开始时间*/,
        userId: "" /**用户id*/,
        workDay: "" /**总天数*/,
        workTime: "" /**总工时*/,
        projectUserScheduleList: [] /**项目成员排期*/,
      },
      projectUserScheduleList: {
        /**
         * 周期
         */
        startTime: "",
        endTime: "",
        /**
         * 计划负荷
         */
        planLoad: "",
        /**
         * 工时
         */
        workTime: "",
      },
      projectStageOptions: [],
      projectTypeOptions: [],
      priorityOptions: [
        {
          label: "最高",
          value: 1,
        },
        {
          label: "高",
          value: 2,
        },
        {
          label: "普通",
          value: 3,
        },
        {
          label: "较低",
          value: 4,
        },
      ],
      projectUserIdOptions: [],
      projectServiceOptions: [
        {
          label: "对内",
          value: 1,
        },
        {
          label: "对外",
          value: 2,
        },
      ],
      projectChanceOptions: [
        {
          label: "选项一",
          value: 1,
        },
        {
          label: "选项二",
          value: 2,
        },
      ],
    };
  },
  mounted() {
    this.getDictList("project_phase"); // 项目阶段 project_phase
    this.getDictList("project_type"); // 项目类型 project_type
    // this.getDictList("serivce_obj_type"); // 服务对象 serivce_obj_type
    // this.getDictList("project_priority"); // 项目优先级
  },
  methods: {
  
    /*查询字典的接口*/
    getDictList(dictCode) {
      queryDict(dictCode).then((res) => {
        if (dictCode == "project_phase") {
          this.projectStageOptions = res.data;
        }
        if (dictCode == "project_type") {
          this.projectTypeOptions = res.data;
        }
        // if (dictCode == "serivce_obj_type") {
        //   this.projectServiceOptions = res.data;
        // }
        // if(dictCode=="project_priority"){
        //   this.priorityOptions= res.data
        // }
      });
    },
    // 过滤 当前已经选中的用户
    filterUserList() {
      let data = {};
      queryUserlist(data).then((res) => {
        res.data.map((item) => {
          item.userNameAndPost = item.nickName + "（" + item.postName + "）";
          item.disabled = false;
        });
        this.formData.projectUserList.map((item, i) => {
          res.data.map((user, u) => {
            if (item.userId != "" && item.userId == user.userId) {
              res.data.splice(u, 1);
            }
          });
        });
        this.userOptions = res.data; // 需要根据已经选择的人 来过滤
      });
    },

     
    // 删除单行用户的
    DelUserList(index) {
      // 点击删除之后，重新获取userOptions 做一次剔除
      let data = {};
      queryUserlist(data).then((res) => {
        res.data.map((item) => {
          item.userNameAndPost = item.nickName + "（" + item.postName + "）";
          item.disabled = false;
        });
        this.userOptions = res.data; // 需要根据已经选择的人 来过滤
      });
      this.formData.projectUserList.map((item, i) => {
        this.userOptions.map((user, u) => {
          if (item.userId == user.userId) {
            this.userOptions.splice(u, 1);
          }
        });
      });
      this.formData.projectUserList.splice(index, 1);
    },
    // 保存 addProjectList 新增用户信息的
    submitForm() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        // TODO 提交表单
        if (valid) {
          this.formData.projectUserList.map((item, i) => {
            // 存储的字段被架构师修改掉 导致 提交的时候 需要修改一下
            item.projectUserScheduleList.map((jtem) => {
              // jtem.week = jtem?.weekOfYear
              jtem.weekDay = jtem.day;
            });
          });
          let parame = {
            ...this.formData,
            // carrierId:this.temData.carrierId,
            // status:0
          };
          addProjectList(parame).then((res) => {
            let { code, msg } = res;
            this.$message.success(msg);
            if (+code == 200) {
              this.$router.push("/projectManager/proManager");
            }
          });
        }
      });
    },
    // 取消重置表单的
    resetForm() {
      this.$confirm(`此操作会重置本页面所有填写的内容!`, "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$refs["elForm"].resetFields();
        })
        .catch(() => {});
    },
  },

  beforeCreate() {
    document
      .querySelector("body,html")
      .setAttribute("style", "background-color:#E8E8F4;");
  },

  beforeDestroy() {
    document.querySelector("body,html").removeAttribute("style");
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
</style>
<style>
.UserLine /deep/.el-form-item {
  margin-bottom: 2px;
}
</style>
