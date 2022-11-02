<template>
  <div class="app-container">
    <div class="routerBar">
      <!-- <router-link :to="'/projectManager/proManager'"> < 编辑项目</router-link> -->
      <span @click="goManagerPage" style="cursor: pointer; color: #409eff">
        &lt; 编辑项目
      </span>

      <span> （仅项目负责人可对此项目下列对内进行编辑）</span>
      <div class="rightBox">
        <el-button size="mini" @click="submitForm" type="primary">保存</el-button>
        <el-button size="mini" @click="backDetail" type="default">取消</el-button>
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
                  v-for="dict in projectStageOptions"
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
                  v-for="dict in projectTypeOptions"
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
                  v-for="user in projectUserIdOptions"
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
            <el-form-item label="项目有效期" prop="projectTimeArea" class='date-style'>
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
             <i class='el-icon-warning' style='color:red;'></i>
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
          <el-row>
            <el-col :span="10" :offset="1">
              <el-form-item label="归属项目组" prop="projectChance">
                <el-select
                  v-model="formData.projectTeam"
                  placeholder="请选择归属项目组"
                  clearable
                  :style="{ width: '100%' }"
                >
                  <el-option
                    v-for="(item, index) in projectTeams"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  ></el-option>
                </el-select>
            </el-form-item>
          </el-col>
          </el-row>
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
                <template
                  v-if="addUserList.updateType == 3 || addUserList.updateType == 2"
                >
                  <!-- 我是修改的 -->
                  <span style="margin-left: 30px"> {{ addUserList.userName }}</span>
                </template>

                <template v-if="addUserList.updateType == 1">
                  <!-- 我是新增的 -->
                  <el-select
                    v-model="addUserList.userId"
                    placeholder="请选择项目成员"
                    clearable filterable
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
                  </el-select>
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label=""
                :prop="`projectUserList.${addUserListindex}.startEndTime`"
                :rules="rules.projectUserListAllStartEndTime"
                label-width="30px"
              >
                <el-date-picker
                  type="daterange"
                  v-model="addUserList.startEndTime"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :style="{ width: '90%' }"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  range-separator="至"
                  :picker-options="childDateArea"
                  @focus="(dates) => changeTimeArea(dates, addUserListindex)"
                  @change="(dates) => getTimeArea(dates, addUserListindex)"
                  clearable
                ></el-date-picker>
                &nbsp;&nbsp;
                <i
                  v-show="addUserList.isShow == 1"
                  class="el-icon-warning color4 ft18"
                  title="此用户已离职！"
                ></i>
                <!-- @focus="(dates) => userIsNull(dates, addUserListindex)" -->
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
                <el-button
                  v-show="addUserList.updateType != 2"
                  size="mini"
                  @click="DelUserList(addUserListindex, addUserList)"
                  type="error"
                  >删除</el-button
                >
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
  updateProjectUserAddEdit,
  searchProjectList,
  proDetailBFEdit,
  queryUserlistByRole,
} from "@/api/proManager/proManager";
import { getToday } from "@/utils/index";

export default {
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
       projectTeams:[],
      projectTeam:'',
      formData: {
        priority: 3 /**优先级（1.最高，2.高，3.普通，4.较低）*/,
        projectChance: "" /**关联机会*/,
        projectCode: "" /**项目编号*/,
        projectEndTime: "" /**项目结束时间*/,
        projectName: "" /**项目名称*/,
        projectService: "" /**服务对象*/,
        projectStage: "" /**项目阶段*/,
        projectStartTime: "" /**项目开始时间*/,
        projectType: "" /**项目类型*/,
        projectUserId: "" /**项目负责人*/,
        projectUserList: [] /**项目成员列表*/,
        projectGitUrl: "", // 项目git 地址
        projectTimeArea: [],
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
        startTime: "" /**周期*/,
        endTime: "",
        planLoad: "" /**计划负荷*/,
        workTime: "" /**工时*/,
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
        //服务对象(1.对内，2.对外)
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
      DelUserListTemp: [], //存储删除用户的
    };
  },
  mounted() {
    // this.getUserList();
    this.queryUserlistByRole(); // 查询是 项目主管的用户集合
    this.getDictList("project_phase"); // 项目阶段 project_phase
    this.getDictList("project_type"); // 项目类型 project_type
    // this.getDictList("serivce_obj_type"); // 服务对象 serivce_obj_type
    // this.getDictList("project_priority"); // 项目优先级
    this.init();
    // 页面默认点击一下  添加成员
    // this.addUserListHandel()
  },
  methods: {
      changeInput(e) {
            if (e.target.value.indexOf('.') >= 0) {
                e.target.value = e.target.value.substring(0, e.target.value.indexOf('.') + 2);
                console.log( e.target.value,'ssssssss')
            }
        },
    init() {
      let projectId = this.$route.query.projectId;
      proDetailBFEdit(projectId).then((res) => {
        // this.projectTable = res.data;
        // this.projectTable.projectUserList = res.data.projectUserList;
        // 在有项目成员之后  再 过滤已经有的人
        // 获取并过滤用户的下拉
        this.getUserList();
        res.data.projectUserList.map((item, i) => {
          // 修改类型（1.新增,2.删除,3.修改原数据）
          // oneUser.updateType = 1
          item.startEndTime = [item.startTime, item.endTime];
          item.updateType = 3;
          item.workDayTemp = item.workDay;
          item.costNum = res.data.projectService == 1 ? item.costIn : item.costOut;
          item.projectUserScheduleList.map((jtem, j) => {
            item["planLoadCh" + i + j] = jtem.planLoadCh;
            item["planLoadWorkDayCh" + i + j] = jtem.planLoadWorkDayCh;
            item["realLoadCh" + i + j] = jtem.realLoadCh;
            item["realLoadWorkDayCh" + i + j] = jtem.realLoadWorkDayCh;
            jtem.weekTimeArea =
              jtem.startTime.substring(5) + "-" + jtem.endTime.substring(5);
            jtem.day = jtem.weekDay;
          });
        });
        this.formData = res.data; // 填充详情的 projectTimeArea
        this.$set(this.formData, "projectTimeArea", [
          res.data.projectStartTime,
          res.data.projectEndTime,
        ]);

        // 之前的做法 动态生成 表格列
        // if (res.data.projectUserList[0].projectUserScheduleList.length != 0) {
        //   this.labelArr = this.createLabel(
        //     res.data.projectUserList[0].projectUserScheduleList.length
        //   );
        // }
      });
    },
    // 动态修改 时间选择器的区间值
    changeChildDateArea(userInfo, index) {
      // 项目成员安排的 可选时间区间
      this.childDateArea = {
        disabledDate: (time) => {
          if (
            this.formData.projectEndTime != "" &&
            this.formData.projectStartTime != ""
          ) {
            // 判断此人是否已经在职在职在职
            if (userInfo.status == 0) {
              if (
                this.date2Number(userInfo.inTime) >
                this.date2Number(this.formData.projectStartTime + " 23:59:59")
              ) {
                // 如果入职时间是否 大于 项目起始时间
                // 就采用 该人的入职日期 和 项目结束日期
                // console.log("入职时间晚于项目起始时间")
                return (
                  time.getTime() > new Date(this.formData.projectEndTime).getTime() ||
                  time.getTime() < new Date(userInfo.inTime).getTime() - 8.64e7
                );
              } else {
                // 如果入职时间是否 小于 项目起始时间
                return (
                  // 就采用 项目开始日期 和 项目结束日期
                  time.getTime() > new Date(this.formData.projectEndTime).getTime() ||
                  time.getTime() <
                    new Date(this.formData.projectStartTime).getTime() - 8.64e7
                );
              }
            }
            // 判断此人是否已经离职
            if (userInfo.status == 1) {
              if (
                this.date2Number(userInfo.outTime) >
                this.date2Number(this.formData.projectEndTime)
              ) {
                // 如果离职时间是否 大于 项目结束时间
                return (
                  // 就采用 项目开始日期 和 项目结束日期
                  time.getTime() > new Date(this.formData.projectEndTime).getTime() ||
                  time.getTime() <
                    new Date(this.formData.projectStartTime).getTime() - 8.64e7
                );
              } else {
                // 如果离职时间 小于 项目结束时间
                // 就采用 项目起始时间 该人的离职日期
                return (
                  time.getTime() > new Date(userInfo.outTime).getTime() ||
                  time.getTime() <
                    new Date(this.formData.projectStartTime).getTime() - 8.64e7
                );
              }
            }
          }
        },
      };
    },
    // 动态修改 默认的日期区间
    changeAddUserDateArea(userInfo, index) {
      // 项目成员安排的 可选时间区间
      if (this.formData.projectEndTime != "" && this.formData.projectStartTime != "") {
        console.log("有项目开始和结束日期");
        // 判断此人是否已经在职在职在职
        if (userInfo.status == 0) {
          console.log("是在职");
          if (
            this.date2Number(userInfo.inTime) >
            this.date2Number(this.formData.projectStartTime + " 23:59:59")
          ) {
            // 如果入职时间是否 大于 项目起始时间
            // 就采用 该人的入职日期 和 项目结束日期
            console.log("入职时间晚于项目起始时间");
            //  this.addEditFormData.projectUserList[index].startEndTime = [userInfo.inTime,this.formData.projectEndTime]
            return [userInfo.inTime, this.formData.projectEndTime];
          } else {
            console.log("入职时间早于项目起始时间");
            // 如果入职时间是否 小于 项目起始时间
            return [this.formData.projectStartTime, this.formData.projectEndTime];
          }
        }
        // 实际上此段判断无用，原因是 查询用户的接口已经把
        // 离职的员工给隔离了
        // 判断此人是否已经离职
        if (userInfo.status == 1) {
          console.log("是离职");
          if (
            this.date2Number(userInfo.outTime) >
            this.date2Number(this.formData.projectEndTime)
          ) {
            console.log("离职时间晚于项目结束时间，就拿项目结束时间");
            // console.log("晚于项目起始时间")
            // 如果离职时间是否 大于 项目结束时间
            return [this.formData.projectStartTime, this.formData.projectEndTime];
          } else {
            // 如果离职时间 小于 项目结束时间
            // 就采用 项目起始时间 该人的离职日期
            console.log("离职时间早于项目起始时间，就拿最后的离职时间作为服务时间");
            return [this.formData.projectStartTime, userInfo.outTime];
          }
        }
      }
    },
    filterUserList() {
      // 过滤 当前已经选中的用户
      let data = {};
      queryUserlist(data).then((res) => {
        res.data.map((item) => {
          item.userNameAndPost = item.nickName + "（" + item.postName + "）";
          item.disabled = false;
        });
        this.formData.projectUserList.map((item, i) => {
          res.data.map((user, u) => {
            if (item.userId != "" && item.userId == user.userId) {
              // res.data.splice(u, 1);
              user.disabled=true
            }
          });
        });
        // res.data[index].disabled=true
        this.userOptions = res.data; // 需要根据已经选择的人 来过滤
      });
    },
    // 点击选择人员的 删除事件，释放人员回到下拉内
    releaseUser(index) {
      this.filterUserList();
    },
    // 添加人员之后  根据 对内 还是对外  设置 选择人员的成本
    // 存储到 单行的 新建字段 costNum 内 用于下一步存储  计算
    getUserCost(userId, index) {
      //  此处 故意调用一次 用户的请求，用于规避 回显用户列表的bug
      let data = {
        userId: userId,
      };
      queryUserlist(data).then((res) => {
        res.data.map((item) => {
          item.userNameAndPost = item.nickName + "（" + item.postName + "）";
          item.disabled = false;
        });
        this.changeChildDateArea(res.data[0]);
        // formData.projectUserList[index].costNum
        // costNum 是我自己设置第一个值 用于存储 成本的单位
        //  对外 服务对象(1.对内，2.对外)
        if (this.formData.projectService == 2) {
          //对外
          this.formData.projectUserList[index].costNum = res.data[0].costOut;
        } else {
          // 对内
          this.formData.projectUserList[index].costNum = res.data[0].costIn;
        }
        //   let oneUser = this.deepClone(this.projectUserList);
        //   // 修改类型（1.新增,2.删除,3.修改原数据）
        //   oneUser.updateType = 1;
        //  this.formData.projectUserList[index] = oneUser
        if (this.formData.projectUserList[index].startEndTime?.length > 0) {
          this.formData.projectUserList[index].startEndTime = this.changeAddUserDateArea(
            res.data[0],
            index
          );
          let dates = this.formData.projectUserList[index].startEndTime;
          this.constAll(dates, index);
        }

        if (this.formData.projectUserList[index].userId != "") {
          // 添加成员之后，未选择用户的情况下 不筛选
          let userIdsTemp = [];
          this.formData.projectUserList.map((item) => {
            // 拿到已经存在的用户id
            userIdsTemp.push(item.userId);
          });
          console.log(userIdsTemp);
          this.userOptions.map((user, u) => {
            userIdsTemp.map((userId, i) => {
              if (user.userId == userId) {
                // 双层循环 去掉已经选择的用户
                // this.userOptions.splice(u, 1);
                user.disabled=true
              }
            });
          });
        }
        // this.userOptions = res.data;
      });
    },
    /*修改每日工时*/
    changeDayTime(number, day, fatherIndex, myIndex) {
      console.log(number, day, fatherIndex, myIndex);
      // 期间计划负荷 = 当前行的总天数day*number  /  当前行的总天数day * 8
      this.formData.projectUserList[fatherIndex].projectUserScheduleList[
        myIndex
      ].planLoad = (((day * number) / (day * 8)) * 100 || 0).toFixed(2);
      // 循环 取出每周的工作时长
      let totalTime = 0,
        totalDay = 0;
      this.formData.projectUserList[fatherIndex].projectUserScheduleList.map(
        (item, i) => {
          if (myIndex == i) {
            // 当前周的工时 转换为天数  计算一下
            // 当前周的天数* 实际工作时长 除以8
            // 等于 实际工作天数

            totalDay += parseFloat(item.day * number);
          } else {
            // 其他的没有修改的 直接 拿天数累加
            totalDay += parseFloat(item.day * item.workTime);
          }
          totalTime += parseFloat(item.workTime) * parseFloat(item.day);
          item.weekDay = item.day;
        }
      );

      // 暂存一下 实际的天数
      const tempWorkDay = this.formData.projectUserList[fatherIndex].workDayTemp;
      // console.log(tempWorkDay);
      // 顶部的 共计多少小时  多少天
      this.formData.projectUserList[fatherIndex].workDay = (totalDay / 8).toFixed(2);
      this.formData.projectUserList[fatherIndex].workTime = totalTime.toFixed(2);
      // 顶部的 计划负荷 预计成本
      // console.log(totalDay);
      // console.log(tempWorkDay);
      if (totalDay === 0) {
        this.formData.projectUserList[fatherIndex].planLoad = 0;
      } else {
        this.formData.projectUserList[fatherIndex].planLoad = (
          (totalDay / (tempWorkDay * 8)) *
          100
        ).toFixed(2);
      }
      console.log(
        this.formData.projectUserList[fatherIndex].workDay,
        this.formData.projectUserList[fatherIndex].costNum
      );
      this.formData.projectUserList[fatherIndex].expectedCost = (
        this.formData.projectUserList[fatherIndex].workDay *
        this.formData.projectUserList[fatherIndex].costNum
      ).toFixed(2);
    },
    /*选择项目有效期*/
    getProjectTimeArea(dates) {
      // this.formData.projectTimeArea=[]
      console.log(dates, "sssssssss");
      this.formData.projectStartTime = dates[0];
      this.formData.projectEndTime = dates[1];
    },
    /* 时间区间选择之前 请判断 是否选择了前面的用户 成员*/
    userIsNull(dates, index) {
      if (this.formData.projectUserList[index].userId == "") {
        this.$message.error("请先选择项目成员！");
        return false;
      }
    },
    /* 鼠标点击 日期触发 日期区间限制的方法*/
    changeTimeArea(dates, index) {
      // console.log(this.formData.projectUserList[index]);
      this.changeChildDateArea(this.formData.projectUserList[index]);
    },
    /*根据起始和结束 生成下面表格*/
    getTimeArea(dates, index) {
      // if(this.formData.projectUserList[index].userId==""){
      //   this.$message.error("请先选择项目成员！");
      //   return false
      // }
      this.constAll(dates, index);
    },
    // 公共计算方法
    constAll(dates, index) {
      let params = {
        startDate: dates[0],
        endDate: dates[1],
      };
      getTimeProcess(params).then((res) => {
        this.formData.projectUserList[index].workDay = res.data.day;
        this.formData.projectUserList[index].workDayTemp = res.data.day;
        this.formData.projectUserList[index].workTime = res.data.day * 8;
        this.formData.projectUserList[index].startTime = dates[0];
        this.formData.projectUserList[index].endTime = dates[1];
        this.formData.projectUserList[index].expectedCost = (
          res.data.day * this.formData.projectUserList[index].costNum
        ).toFixed(2);
        res.data.list.map((item) => {
          item.startTime = item.startDate;
          item.endTime = item.endDate;
          item.workTime = "8";
          item.planLoad = (((item.day * 8) / (item.day * 8)) * 100 || 0).toFixed(2);
        });
        this.formData.projectUserList[index].projectUserScheduleList = res.data.list; // 此人的 每周安排
        if (res.data.day === 0) {
          this.formData.projectUserList[index].planLoad = 0;
        } else {
          this.formData.projectUserList[index].planLoad = (
            ((8 * res.data.day) / (res.data.day * 8)) *
            100
          ).toFixed(2); // 计划负荷
        }
      });
    },
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
    /* 查询用户列表 */
    getUserList() {
      let data = {};
      queryUserlist(data).then((res) => {
        res.data.map((item) => {
          item.userNameAndPost = item.nickName + "（" + item.postName + "）";
          item.disabled = false;
        });
        //---------------------------------------------------------
        //  初始化用户列表之后， 需要剔除已经存在的userID
        let userIdsTemp = [];
        this.formData.projectUserList.map((item) => {
          // 拿到已经存在的用户id
          userIdsTemp.push(item.userId);
        });
        res.data.map((user, u) => {
          userIdsTemp.map((userId, i) => {
            if (user.userId == userId) {
              // 双层循环 去掉已经选择的用户
              // res.data.splice(u, 1);
              user.disabled = true;
            }
          });
        });
        this.userOptions = res.data; // 需要根据已经选择的人 来过滤
      });
    },
    /* 查询是项目主管的用户列表 */
    queryUserlistByRole() {
      let data = {};
      queryUserlistByRole(data).then((res) => {
        res.data.map((item) => {
          item.userNameAndPost = item.nickName + "（" + item.postName + "）";
        });
        this.projectUserIdOptions = res.data; // 初始化填充给 项目负责人的 永远是所有用户
      });
    },
    // 点击 新增用户的
    addUserListHandel() {
      //  if(this.formData.projectService==""){
      //         this.$message.error("请您先完整填写项目基础信息！");
      //   }
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        // TODO 上面基础信息填写好 再填写下面，因为需要用到上面的 服务对象和项目有效期
        if (valid) {
          let oneUser = this.deepClone(this.projectUserList);
          oneUser.startTime = this.formData.projectStartTime;
          oneUser.endTime = this.formData.projectEndTime;
          oneUser.startEndTime = this.formData.projectTimeArea;
          // 修改类型（1.新增,2.删除,3.修改原数据）
          oneUser.updateType = 1;
          this.formData.projectUserList.push(oneUser);
          this.$forceUpdate();
        }
      });
    },
    // 删除单行用户的
    DelUserList(index, row) {
      // 修改类型（1.新增,2.删除,3.修改原数据）
      // oneUser.updateType = 1
      this.$confirm(`您确定要删除这条数据吗?`, "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 修改类型（1.新增,2.删除,3.修改原数据）
          if (row.updateType == 3) {
            // 修改 就提交接口
            let params = this.deepClone(this.formData);
            params.projectUserList = [];
            params.projectUserList.push(row);
            params.projectUserList[0].updateType = 2;

            // updateProjectUserAddEdit(params).then((res) => {
            //   let { code, msg } = res;
            //   this.$message.success(msg);
            //   if (+code == 200) {
            //     // 提交删除成功 无需操作什么 因为 需要审核
            //   }
            // });
            this.DelUserListTemp.push(...params.projectUserList);
            this.formData.projectUserList.splice(index, 1);
            // this.formData.projectUserList[index].updateType=2;
          }
          if (row.updateType == 1) {
            // 新增的就前端删除
            this.formData.projectUserList.splice(index, 1);
            this.filterUserList()
          }
        })
        .catch(() => {});
    },
    // 保存 updateProjectUserAddEdit 新增用户信息的
    submitForm() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        // TODO 提交表单
        if (valid) {
          this.formData.projectUserList.map((item, i) => {
            // 存储的字段被架构师修改掉 导致 提交的时候 需要修改一下
            item.projectUserScheduleList.map((jtem) => {
              jtem.weekDay = jtem.day;
              // jtem.week = jtem?.weekOfYear;
            });
          });
          // 把删除的用户也添加进去
          let parame = {
            ...this.formData,
            // carrierId:this.temData.carrierId,
            // status:0
          };
          parame.projectUserList.push(...this.DelUserListTemp);
          updateProjectUserAddEdit(parame).then((res) => {
            let { code, msg } = res;
            this.$message.success(msg);
            if (+code == 200) {
              // this.$router.push("/projectManager/proManager");
              this.$router.push({
                path: "/projectManager/proDetails/",
                query: {
                  projectId: this.formData.projectId,
                  projectName: this.formData.projectName,
                  countScope: this.$route.query.countScope,
                },
              });
            }
          });
        }
      });
    },
    // 取消重置表单的
    resetForm() {
      this.$refs["elForm"].resetFields();
    },
    backDetail() {
      this.$confirm(`您确定要返回详情页吗?刚刚修改的数据将不会被保存！`, "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const obj = {
            path: "/projectManager/proDetails/",
            query: {
              projectId: this.formData.projectId,
              projectName: this.formData.projectName,
              countScope: this.$route.query.countScope,
              startTime: this.formData.projectStartTime,
              endTime: this.formData.projectEndTime,
            },
          };
          this.$tab.closeOpenPage(obj);
        })
        .catch(() => {});
    },
    goManagerPage() {
      const obj = { path: "/projectManager/proManager" };
      this.$tab.closeOpenPage(obj);
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
.date-style{
  display: inline-block;
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
