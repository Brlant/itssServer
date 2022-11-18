<template>
  <div class="app-container">
    <div class="routerBar">
      <!-- <router-link :to="'/projectManager/proManager'"> < 编辑项目</router-link> -->
      <span @click="goManagerPage" style="cursor: pointer; color: #409eff">
        &lt; 编辑项目
      </span>

      <span> （仅项目负责人可对此项目下列对内进行编辑）</span>
      <div class="rightBox">
        <el-button size="mini" @click="submitForm" type="primary">提交审核</el-button>
        <el-button size="mini" @click="backDetail" type="default">取消</el-button>
      </div>
    </div>
    <div class="titleBar">项目基础信息</div>

    <el-form
      ref="elForm"
      :model="formData"
      :rules="rules"
      size="medium"
      label-width="130px"
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
            <el-form-item label="项目有效期" prop="projectTimeArea" class="date-style">
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
            <i
              class="el-icon-warning"
              style="color: red; padding-left: 10px"
              v-if="redShow"
            ></i>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="关联机会" prop="projectChance">
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
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item label="归属项目组" prop="projectGroupId">
              <el-select
                v-model="formData.projectGroupId"
                placeholder="请选择归属项目组"
                clearable
                :style="{ width: '100%' }"
                @change="teamChange"
              >
                <el-option
                  v-for="(item, index) in projectTeams"
                  :key="index"
                  :value="item.projectGroupId"
                  :label="item.projectGroupName+ '   (' + item.startDate + ' 至 ' + item.endDate +')'"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="TB项目ID" prop="tbProjectId">
              <el-input
                v-model="formData.tbProjectId"
                placeholder="请输入TB项目ID"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row>
            <el-col :span="10" :offset="1">
            <el-form-item label="缺陷管理ID" prop="bugId">
              <el-input
                v-model="formData.bugId"
                placeholder="缺陷管理ID"
              ></el-input>
            </el-form-item>
          </el-col>

        </el-row>
      </div>
      <div class="titleBar">
        项目资源配置
        <div class="rightBox">
          <el-button size="mini" @click="addUserListHandel" type="primary"
            >添加配置</el-button
          >
        </div>
      </div>
      <div class="whiteBox UserListBox">
        <div
          v-for="(addUserList, addUserListindex) in formData.projectUserList"
          :key="addUserListindex"
          style="padding: 10px 20px"
        >
          <el-row>
            <el-col :span="5">
              <el-form-item
                label="区域："
                :prop="`projectUserList.${addUserListindex}.regionId`"
                :rules="rules.addUserListregionId"
              >
                <el-select
                  v-model="addUserList.regionId"
                  placeholder="请选择区域"
                  :style="{ width: '100%' }"
                  @change="(dates) => editNext('region', dates, addUserListindex)"
                >
                  <el-option
                    v-for="(dict, index) in regionOptions"
                    :key="dict.dictCode"
                    :label="dict.dictLabel"
                    :value="dict.dictCode"
                    :disabled="dict.disabled"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item
                label="职位类型："
                :prop="`projectUserList.${addUserListindex}.postTypeId`"
                :rules="rules.addUserListPostTypeId"
              >
                <el-select
                  v-model="addUserList.postTypeId"
                  placeholder="请选择职位类型"
                  :disabled="addUserList.postTypeActive"
                  :style="{ width: '100%' }"
                  @change="(dates) => editNext('postType', dates, addUserListindex)"
                >
                  <el-option
                    v-for="(dict, index) in postTypeOptions"
                    :key="dict.dictCode"
                    :label="dict.dictLabel"
                    :value="dict.dictCode"
                    :disabled="dict.disabled"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item
                label="职位名称："
                :prop="`projectUserList.${addUserListindex}.postNameId`"
                :rules="rules.addUserListpostNameId"
              >
                <el-select
                  v-model="addUserList.postNameId"
                  placeholder="请选择职位名称"
                  :disabled="addUserList.postNameIdActive"
                  :key="addUserListindex"
                  :style="{ width: '100%' }"
                  @change="(dates) => editNext('postNameId', dates, addUserListindex)"
                >
                  <el-option
                    v-for="(dict, index) in addUserList.postNameIdOptions"
                    :key="dict.postNameId"
                    :label="dict.postName"
                    :value="dict.postNameId"
                    :disabled="dict.disabled"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item
                label="等级："
                :prop="`projectUserList.${addUserListindex}.postLevelId`"
                :rules="rules.addUserListpostLevelId"
              >
                <el-select
                  v-model="addUserList.postLevelId"
                  placeholder="请选择等级"
                  :key="addUserListindex"
                  :disabled="addUserList.postLevelIdActive"
                  :style="{ width: '100%' }"
                  @change="(dates) => editNext('postLevelId', dates, addUserListindex)"
                >
                  <el-option
                    v-for="(dict, index) in  addUserList.postLevelIdOptions"
                    :key="dict.postLevelId"
                    :label="dict.postLevelName"
                    :value="dict.postLevelId"
                    :disabled="dict.disabled"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="">
                <el-button
                  type="primary"
                  size="mini"
                  @click="DelPostList(addUserListindex,addUserList)"
                >
                  删除
                </el-button>
                <!-- <el-button type="info" size="mini"> 取消 </el-button> -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item
                label="技能需求："
                :prop="`projectUserList.${addUserListindex}.skillIdList`"
                :rules="rules.addUserListSkillIdList"
              >
                <el-select
                  v-model="addUserList.skillIdList"
                  multiple
                  placeholder="请选择技能需求"
                  @change="changeTextColor($event, 'mySkillIdList')"
                  ref="mySkillIdList"
                  :disabled="addUserList.nextActive"
                  :style="{ width: '100%' }"
                >
                  <el-option
                    v-for="(dict, index) in techniqueOptions"
                    :key="dict.dictCode"
                    :label="dict.dictLabel"
                    :value="dict.dictCode"
                    :disabled="dict.disabled"
                  >
                    <span>{{ dict.dictLabel }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item
                label="配置安排："
                :prop="`projectUserList.${addUserListindex}.startEndTime`"
                :rules="rules.projectUserListAllStartEndTime"
                label-width="130px"
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
                  @change="(dates) => constAll(dates, addUserListindex)"
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
            <el-col :span="3"
              ><div class="colText">
                预计成本：<span>{{ addUserList.expectedCost }}</span> 元
              </div></el-col
            >

          </el-row>
          <!----------------------内部-start------------------------------>
          <el-row
            v-for="(
              UserScheduleList, UserScheduleListIndex
            ) in addUserList.projectUserScheduleList"
            :key="UserScheduleListIndex"
          >
            <el-col :span="3" :offset="2">
              <div class="colText" style="text-indent: 30px">
                {{ UserScheduleList.startTime + "---" + UserScheduleList.endTime }}
              </div>
            </el-col>
            <el-col :span="4" :offset="1">
              <div class="colText">
                期间计划负荷
                <el-input-number
                  size="mini"
                  :style="{ width: '120px' }"
                  v-model="UserScheduleList.planLoad"
                  :min="0"
                  :max="100"
                  :precision="0"
                  @change="
                    (number) => {
                      changePlanLoad(
                        number,
                        UserScheduleList.weekDay,
                        addUserListindex,
                        UserScheduleListIndex
                      );
                    }
                  "
                ></el-input-number>
                %
              </div>
            </el-col>
            <el-col :span="5">
              <div class="colText">
                <span>{{ UserScheduleList.workDay }}</span> 人日
              </div>
            </el-col>
            <el-col :span="3">
              <div class="colText">
                平均每日工作<span> {{ UserScheduleList.workTime }} </span>小时
              </div>
            </el-col>
          </el-row>
          <!----------------------内部-end------------------------------>
            <div class="jiange"></div>
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
  getLevelCostNum,
  getPostName,
  teamQuery,
  getPostOptions,
} from "@/api/proManager/proManager";
import { queryUserlistByRole } from "@/api/system/user";
import { getChanceList } from "@/api/chanceManager/chanceManager";
import { getToday } from "@/utils/index";
import moment from "moment";
import "moment/locale/zh-cn";
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
      /*------------------------*/
      techniqueOptions: [], // 技能需求
      regionOptions: [], // 区域
      postTypeOptions: [], // 职位类型
      postNameIdOptions: [], // 职位名称
      postLevelIdOptions: [], // 职位等级
      /*------------------------*/
      // 人员 列表
      userOptions: [],
      projectTeams: [],
      projectTeam: "",
      redShow: false,
      formData: {
        priority: 3 /**优先级（1.最高，2.高，3.普通，4.较低）*/,
        projectChance: "" /**关联机会*/,
        projectCode: "" /**项目编号*/,
        projectEndTime: "" /**项目结束时间*/,
        projectGitUrl: "", // 项目git 地址
        projectGroupId: "", // 项目组
        projectName: "" /**项目名称*/,
        projectService: "" /**服务对象*/,
        projectStage: "" /**项目阶段*/,
        projectStartTime: "" /**项目开始时间*/,
        projectTimeArea: ["", ""],
        projectType: "" /**项目类型*/,
        projectUserId: "" /**项目负责人*/,
        projectUserList: [] /**项目成员列表*/,
        tbProjectId: "",
        bugId:''
      },
      rules: {
        // 配置信息的
        addUserListPostTypeId: [
          {
            required: true,
            message: "请选择职位类型!",
            trigger: "change",
          },
        ],
        addUserListregionId: [
          {
            required: true,
            message: "请选择区域!",
            trigger: "change",
          },
        ],
        addUserListpostNameId: [
          {
            required: true,
            message: "请选择职位!",
            trigger: "change",
          },
        ],
        addUserListpostLevelId: [
          {
            required: true,
            message: "请选择等级!",
            trigger: "change",
          },
        ],
        addUserListSkillIdList: [
          {
            required: true,
            message: "请选择技能需求!",
            trigger: "change",
          },
        ],
        addUserListStartEndTime: [
          {
            required: true,
            message: "请选择配置时间安排!",
            trigger: "change",
          },
        ],
        //
        projectUserListAllStartEndTime: [
          {
            required: true,
            message: "请选择配置安排",
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

      },
      // 单独的 用户列表
      projectUserList: {
        postNameId: "", //职位id
        regionId: "", //区域id
        postTypeId: "", //职位类型id
        postLevelId: "", //职位等级id
        skillIdList: [], //技能id
        startTime: "", //开始时间
        endTime: "", //结束时间
        workTime: "", //总工时
        workDay: "", //总人日
        planLoad: "", //计划负荷
        expectedCost: "", //预计成本
        projectUserScheduleList: "", //项目成员排期
        postLevelIdActive: true,
        postNameIdActive: true,
        postTypeActive: true,
        nextActive: true,
        postNameIdOptions:[],
        postLevelIdOptions:[],
      },
      // projectUserScheduleList: {
      //   startTime: "" /**周期*/,
      //   endTime: "",
      //   planLoad: "" /**计划负荷*/,
      //   workTime: "" /**工时*/,
      // },
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
      projectChanceOptions: [],
      DelUserListTemp: [], //存储删除用户的
    };
  },

  mounted() {
    this.team();
    this.getChanceList(); //拿到机会列表
    this.queryUserlistByRole(); // 查询是 项目主管的用户集合
    this.getDictList("project_phase"); // 项目阶段 project_phase
    this.getDictList("project_type"); // 项目类型 project_type
    // 二期的
    this.getDictList("region"); //区域
    this.getDictList("post_type"); //职位类型
    this.getDictList("skill_type"); // 技能 technique
    // this.getDictList("post_name");   // 职位名称 post_name
    // this.getDictList("post_level"); // 职位等级 post_level

    this.init();
    // 页面默认点击一下  添加成员
    // this.addUserListHandel()
     this.childDateArea = {
      // 项目成员安排的 可选时间区间
      disabledDate: (time) => {
        if (this.formData.projectEndTime != "" && this.formData.projectStartTime != "") {
          // 设置可以选择的区间 时间为项目的 起始日期和结束日期
          return (
            time.getTime() > new Date(this.formData.projectEndTime).getTime() ||
            time.getTime() < new Date(this.formData.projectStartTime).getTime() - 8.64e7
          );
        }
      },
    };
  },
  methods: {
    init() {
      let projectId = this.$route.query.projectId;
      proDetailBFEdit(projectId).then((res) => {
        // this.projectTable = res.data;
        // this.projectTable.projectUserList = res.data.projectUserList;
        // 在有项目成员之后  再 过滤已经有的人
        // 获取并过滤用户的下拉
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
          res.data.projectUserList.map((item, index) => {
        

         // 循环 回显 职位名称和职位等级
          this.constAll(item.startEndTime, index);
          let parame = {
            regionId: res.data.projectUserList[index].regionId,
            postTypeId: res.data.projectUserList[index].postTypeId,
            postNameId: res.data.projectUserList[index].postNameId,
          };
          getLevelCostNum(parame).then((LevelCostres) => {
            item.postLevelIdOptions = LevelCostres.data;
          });
          getPostName(parame).then((PostNameres) => {
            item.postNameIdOptions = PostNameres.data;
          });
            this.changeTextColor(item.skillIdList, "mySkillIdList");
        });

        this.formData = res.data; // 填充详情的 projectTimeArea

        this.team();
        this.$set(this.formData, "projectTimeArea", [
          res.data.projectStartTime,
          res.data.projectEndTime,
        ]);
        });
    },
    // 选择技能之后 的变色逻辑
    changeTextColor(listData, refName) {
      this.$nextTick(() => {
        setTimeout(() => {
          let arr = []; // 对应数据对象数组

          listData.map((ind) => {
            this.techniqueOptions.map((v) => {
              if (v.dictCode === +ind) {
                arr.push(v);
              }
            });
          });

          let eles = this.$refs[refName][0].$el.querySelectorAll(
            ".el-select__tags .el-tag"
          ); // 获取节点

          eles.forEach((v, i) => {
            if (arr[i].dictCode === +listData[i]) {
              // 'skill' skillcc
              v.classList && v.classList.add("skillcc"); // 添加类名
              v.classList && v.classList.add("skill" + arr[i]["cssClass"]); // 添加类名
            }
          });
        }, 800);
      });
    },
    /**
     *  切换任一 下拉，清空以及重新计算的逻辑 非常复杂
     *  初始化的新增也使用了此方法
     *  区域 职位类型 职位名称 等级 的任一选项  切换选择
     *  切换区域  清空  职位类型 职位名称 等级 的值以及 清空  成本  + 预计成本  职位类型的下拉内容不清空，因为无级联关系
     *  切换职位类型  清空   职位名称 等级 的值以及下拉内容 清空成本+ 预计成本
     *  切换职位名称  清空   等级 的值以及下拉内容 清空成本+ 预计成本
     *  切换等级  切换成本 + 预计成本
     */
    editNext(who, data, index) {
      switch (who) {
        case "region": // 选择区域
          this.formData.projectUserList[index].postTypeActive = false; // 初始化展示下一个
          // this.formData.projectUserList[index].regionId=undefined // 区域
          this.formData.projectUserList[index].postTypeId = ""; // 职位类型
          this.formData.projectUserList[index].postNameId = ""; // 职位名称
          this.formData.projectUserList[index].postLevelId = ""; // 等级
          this.formData.projectUserList[index].expectedCost = "--"; //// 预计成本
          this.formData.projectUserList[index].postNameIdOptions = []; // 清空下拉
          this.formData.projectUserList[index].postLevelIdOptions = []; // 清空下拉
          break;
        case "postType": // 选择 职位类型
          this.formData.projectUserList[index].postNameIdActive = false; // 初始化展示下一个
          // this.formData.projectUserList[index].regionId="" // 区域
          // this.formData.projectUserList[index].postTypeId="" // 职位类型
          this.formData.projectUserList[index].postNameId = ""; // 职位名称
          this.formData.projectUserList[index].postLevelId = ""; // 等级
          this.formData.projectUserList[index].expectedCost = "--"; //// 预计成本
          this.formData.projectUserList[index].postNameIdOptions = [];
          this.formData.projectUserList[index].postLevelIdOptions = [];
          let parame1 = {
            regionId: this.formData.projectUserList[index].regionId,
            postTypeId: this.formData.projectUserList[index].postTypeId,
          };
        //  this.formData.projectUserList[index].postNameIdOptions =  this.getPostNameIdOptions(parame1)
          getPostName(parame1).then((res) => {
              console.log(res.data,"getPostName");
              this.formData.projectUserList[index].postNameIdOptions= res.data
              this.$forceUpdate()
            });
          break;
        case "postNameId": // 选择职位名称
          this.formData.projectUserList[index].postLevelIdActive = false; // 初始化展示下一个
          // this.formData.projectUserList[index].regionId="" // 区域
          // this.formData.projectUserList[index].postTypeId="" // 职位类型
          // this.formData.projectUserList[index].postNameId="" // 职位名称
          this.formData.projectUserList[index].postLevelId = ""; // 等级
          this.formData.projectUserList[index].expectedCost = "--"; //// 预计成本
          this.formData.projectUserList[index].postLevelIdOptions = [];
          let parame2 = {
            regionId: this.formData.projectUserList[index].regionId,
            postTypeId: this.formData.projectUserList[index].postTypeId,
            postNameId: this.formData.projectUserList[index].postNameId,
          };
            getLevelCostNum(parame2).then((LevelCostNumres) => {
            console.log(LevelCostNumres.data,"getLevelCostNum");
            this.formData.projectUserList[index].postLevelIdOptions = LevelCostNumres.data;
            this.$forceUpdate()
          })
          break;
        case "postLevelId": // 选择职位等级
          this.formData.projectUserList[index].nextActive = false; // 初始化展示下面的所有
          // 选择 等级之后，拿到成本下拉 根据选择的等级id 拿到成本
          let costNumArry = this.formData.projectUserList[index].postLevelIdOptions.find((item) => {
            return this.formData.projectUserList[index].postLevelId == item.postLevelId;
          });
          // 2对外      // 1 对内
          if (costNumArry) {
            console.log(this.formData.projectUserList[index]);
            if( this.formData.projectService == 2){
              this.formData.projectUserList[index].costNum = costNumArry.costOut
            }else{
                this.formData.projectUserList[index].costNum =costNumArry.costIn;
            }

          } else {
            // 没有拿到成本 查找出来的数据返回的是undefined
            console.log(" 没有拿到成本 查找出来的数据返回的是undefined ---editNext");
          }
          console.log(`你好，我是第（${index})条资源配置，我的成本是 +${this.formData.projectUserList[index].costNum}`);
          this.constAll(this.formData.projectUserList[index].startEndTime, index);

          break;
      }
    },
    // 删除单行用户的
    DelPostList(index, row) {
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
    /*修改每周计划负荷*/
    /*
     * number 计划负荷的百分比 总天数 父级的下标 和自己的下标
     */
    changePlanLoad(number, weekDay, fatherIndex, myIndex) {
      // 修改每周期间 计划负荷
      // 工作时间为固定的8
      if (number != 0) {
        // 不等于0  就拿修改之后的百分比 除以 100 拿到比例
        this.formData.projectUserList[fatherIndex].projectUserScheduleList[
          myIndex
        ].workDay = this.autoFixed((number / 100) * weekDay); //人日==> 现有百分比除以100 乘以天数
        this.formData.projectUserList[fatherIndex].projectUserScheduleList[
          myIndex
        ].workTime = this.autoFixed((number / 100) * 8); //每日工时==> 现有百分比除以100 乘以 8
      } else {
        this.formData.projectUserList[fatherIndex].projectUserScheduleList[
          myIndex
        ].workDay = 0;
        this.formData.projectUserList[fatherIndex].projectUserScheduleList[
          myIndex
        ].workTime = 0;
      }
      /*----------------以上是 配置安排的具体计算-------------------*/
      // 循环 取出每周的工作时长
      let totalTime = 0,
        totalDay = 0;
      this.formData.projectUserList[fatherIndex].projectUserScheduleList.map(
        (item, i) => {
          // 其他的没有修改的 直接 拿天数累加
          totalDay += parseFloat(item.workDay); // 总天数 == 每周人日累计
          totalTime += parseFloat(item.workDay * 8); // 总时长 == 每周人日*8
        }
      );
      this.formData.projectUserList[fatherIndex].workTime = totalTime;
      this.formData.projectUserList[fatherIndex].workDay = totalDay;
      const tempWorkDay = this.formData.projectUserList[fatherIndex].workDayTemp; // 之前的总天数
      console.log(tempWorkDay);
      if (totalDay === 0) {
        // 防止憨批选到 节假日
        this.formData.projectUserList[fatherIndex].planLoad = 0;
      } else {
        this.formData.projectUserList[fatherIndex].planLoad = this.autoFixed(
          (totalDay / tempWorkDay) * 100
        ); //计划负荷 == 实际人日/计划的人日 *100%
      }
      this.formData.projectUserList[fatherIndex].expectedCost = this.autoFixed(
        totalDay * this.formData.projectUserList[fatherIndex].costNum
      ); /**预计成本*/

      /*----------------以上是 总计的安排的具体计算-------------------*/
    },
    // 修改配置安排

    constAll(dates, index) {
      let params = {
        startDate: dates[0],
        endDate: dates[1],
      };
      getTimeProcess(params).then((res) => {
        this.formData.projectUserList[index].workDay = res.data.day; // 总共多少人日
        this.formData.projectUserList[index].workTime = res.data.day * 8; // 总共多少工时
        if (res.data.day === 0) {
          this.formData.projectUserList[index].planLoad = 0;
        } else {
          this.formData.projectUserList[index].planLoad = this.autoFixed(
            ((8 * res.data.day) / (res.data.day * 8)) * 100
          ); // 计划负荷
        }
        if (
          this.formData.projectUserList[index].costNum == null ||
          this.formData.projectUserList[index].costNum == undefined
        ) {
          this.formData.projectUserList[index].expectedCost = "--";
        } else {
          this.formData.projectUserList[index].expectedCost = this.autoFixed(
            // 预计成本
            res.data.day * this.formData.projectUserList[index].costNum
          );
        }
        /*---------第一行的数据-----------------*/

        this.formData.projectUserList[index].workDayTemp = res.data.day; // 临时存一下后面有用
        this.formData.projectUserList[index].startTime = dates[0]; // 开始时间 留给后面的传值
        this.formData.projectUserList[index].endTime = dates[1]; // 结束时间 留给后面的传值
        res.data.list.map((item) => {
          item.startTime = item.startDate;
          item.endTime = item.endDate;
          item.workTime = item.weekDay != 0 ? "8" : 0; // 内部的每周时长
          item.workDay = item.weekDay; // 内部的每周人日
          item.planLoad = this.autoFixed(
            ((item.weekDay * 8) / (item.weekDay * 8)) * 100 || 0
          );
        });
        this.formData.projectUserList[index].projectUserScheduleList = res.data.list; // 此人的 每周安排
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
    getChanceList() {
      getChanceList({}).then((res) => {
        res.data.map((item) => {
          item.label = item.chanceName;
          item.value = item.chanceId;
        });
        this.projectChanceOptions = res.data;
      });
    },
    team() {
      let data = {
        startDate: this.formData.projectStartTime
          ? moment(this.formData.projectStartTime).format("YYYY-MM-DD")
          : "",
        endDate: this.formData.projectEndTime
          ? moment(this.formData.projectEndTime).format("YYYY-MM-DD")
          : "",
      };
      teamQuery(data).then((res) => {
        this.projectTeams = res.data;
      });
    },
    teamChange() {
      console.log(this.formData.projectGroupId, "fffff");
      let aa = this.projectTeams.filter((v) => {
        return v.projectGroupId == this.formData.projectGroupId;
      });
      this.date1 = aa[0].startDate;
      this.date2 = aa[0].endDate;
      if (
        moment(this.date1, "YYYY-MM-DD").valueOf() <=
          moment(this.formData.projectStartTime, "YYYY-MM-DD").valueOf() &&
        moment(this.date2, "YYYY-MM-DD").valueOf() >=
          moment(this.formData.projectEndTime, "YYYY-MM-DD").valueOf()
      ) {
        this.redShow = false;
      } else {
        this.redShow = true;
      }
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
    /*选择项目有效期*/
    getProjectTimeArea(dates) {
      // this.formData.projectTimeArea=[]
      console.log(dates, "sssssssss");
      this.formData.projectStartTime = dates[0];
      this.formData.projectEndTime = dates[1];
      this.team();
      if (this.date1 && this.date2) {
        // console.log(this.date1,'sssssssss')
        if (
          moment(this.date1, "YYYY-MM-DD").valueOf() <=
            moment(this.formData.projectStartTime, "YYYY-MM-DD").valueOf() &&
          moment(this.date2, "YYYY-MM-DD").valueOf() >=
            moment(this.formData.projectEndTime, "YYYY-MM-DD").valueOf()
        ) {
          this.redShow = false;
        } else {
          this.redShow = true;
        }
      }
    },
    /*查询字典的接口*/
    getDictList(dictCode) {
      queryDict(dictCode).then((res) => {
        if (dictCode == "post_type") {
          // 职位类型
          this.postTypeOptions = res.data;
        }
        if (dictCode == "region") {
          // 人员区域
          this.regionOptions = res.data;
        }
        if (dictCode == "skill_type") {
          // 人员技能
          this.techniqueOptions = res.data;
        }
        if (dictCode == "project_phase") {
          this.projectStageOptions = res.data;
        }
        if (dictCode == "project_type") {
          this.projectTypeOptions = res.data;
        }
      });
    },
    /* 查询是项目主管的用户列表 */
    queryUserlistByRole() {
      let data = {};
      queryUserlistByRole(data).then((res) => {
        // res.data.map((item) => {
        //   item.userNameAndPost = item.nickName + "（" + item.postName + "）";
        // });
        this.projectUserIdOptions = res.data; // 初始化填充给 项目负责人的 永远是所有用户
      });
    },
    // 保存 updateProjectUserAddEdit 新增用户信息的
    submitForm() {
      if (this.redShow) {
        this.$message.error("项目时间超出项目组限制时间!");
      } else {
        this.$refs["elForm"].validate((valid) => {
          if (!valid) return;
          // TODO 提交表单
          if (valid) {
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
                // this.$router.push("/projectManager/proManager");    path: "/projectManager/proDetails/",
                this.$router.push({
                  path: "/projectManager/proManager-auth/proDetails",
                  query: {
                    projectId: this.formData.projectId,
                    projectName: this.formData.projectName,
                    countScope: this.$route.query.countScope,
                    startTime:this.formData.projectStartTime,
                    endTime:this.formData.projectEndTime
                  },
                });
              }
            });
          }
        });
      }
    },
    // 取消重置表单的
    resetForm() {
      this.$refs["elForm"].resetFields();
    },
    backDetail() {
      this.$confirm(`当前页面修改内容尚未保存，是否确认退出？`, "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const obj = {
            path: "/projectManager/proManager-auth/proDetails",
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
.date-style {
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
.skillcolor1 {
  background: rgb(0, 113, 189) !important;
  color: white !important;
}
.skillcolor2 {
  background: rgb(77, 171, 119) !important;
  color: white !important;
}
.skillcolor3 {
  background: rgb(21, 206, 190) !important;
  color: white !important;
}
.skillcolor4 {
  background: rgb(147, 106, 184) !important;
  color: white !important;
}
.skillcolor5 {
  background: rgb(254, 213, 27) !important;
  color: white !important;
}
.skillcolor6 {
  background: rgb(246, 147, 28) !important;
  color: white !important;
}
.skillcolor7 {
  background: rgb(255, 67, 89) !important;
  color: white !important;
}
/* //   { cssClass: 'color1', color: 'rgb(0,113,189)' },
          //   { cssClass: 'color2', color: 'rgb(77,171,119)' },
          //   { cssClass: 'color3', color: 'rgb(21,206,190)' },
          //   { cssClass: 'color4', color: 'rgb(147,106,184)' },
          //   { cssClass: 'color5', color: 'rgb(254,213,27)' },
          //   { cssClass: 'color6', color: 'rgb(246,147,28)' },
          //   { cssClass: 'color7', color: 'rgb(255,67,89)' }, */
.skillcc .el-tag__close {
  background-color: transparent !important;
}
.UserLine /deep/.el-form-item {
  margin-bottom: 2px;
}
</style>
