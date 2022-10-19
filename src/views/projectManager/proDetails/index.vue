<template>
  <div class="app-container">
    <div class="routerBar">
      <b>{{ projectName }}详情</b
      ><span>（仅项目负责人可对此项目下列对内进行编辑）</span>
      <div class="rightBox">
        <el-button size="mini" type="success">导出excel</el-button>
      </div>
    </div>
    <div class="routerBar">
      <div class="backBar">
        <!-- <router-link :to=""> < 返回</router-link> -->
        <span
            @click="goManagerPage" style="cursor: pointer;color: #409eff;">
             < 返回
        </span>
        <div class="rightLink">
          <!-- <router-link :to="'/projectManager/proEdit?projectId=' + projectId+'&countScope='+countScope"  
            >编辑</router-link
          > -->
            <span
            @click="goEditPage" style="cursor: pointer;" class="color2">
            编辑
            </span>
          |

          <span
            @click="stopProject" style="cursor: pointer;"
            :class="[projectTable.projectStatus == 4 ? 'color5' : 'color4']"
          >
            {{ projectTable.projectStatus == 4 ? "开启" : "终止" }}
          </span>
        </div>
      </div>
    </div>

    <div class="whiteBox" style="padding: 1%">
      <b>| 项目基础信息</b>
      <p></p>
      <el-form ref="elForm" :model="formData" size="medium" label-width="100px">
        <el-row>
          <el-col :span="7" :offset="1">
            <el-form-item label="项目编号：" prop="projectCode">
              {{ formData.projectCode }}
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="项目名称：" prop="projectName">
              {{ formData.projectName }}
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="项目阶段：" prop="projectStage">
              {{ formData.projectStageName }}
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="项目类型：" prop="projectType">
              {{ formData.projectTypeName }}
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="优先级：" prop="priority">
              <!-- // 低（灰色）、普通（蓝色）、紧急（橙色）、非常紧急（红色）显示； -->
              <span :class="['yuan', 'priorityBg' + formData.priority]"></span>
              <span :class="['priority' + formData.priority]">{{
                formData.priority | toPriority
              }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="服务对象" prop="projectService">
              {{ formData.projectService | toProjectService }}
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="负责人" prop="projectUserId">
              {{ formData.projectUserName }}
            </el-form-item>
          </el-col>

          <el-col :span="7" :offset="1">
            <el-form-item label="项目有效期" prop="projectTimeArea">
              {{ formData.projectTimeArea }}
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="GitLab地址" prop="projectGitUrl">
              {{ formData.projectGitUrl }}
            </el-form-item>
          </el-col>
          <!-- <el-col :span="7" :offset="1">
                <el-form-item label="关联机会" prop="projectChance">
                  {{formData.projectChanceName}}
                </el-form-item>  
              </el-col> -->
        </el-row>
      </el-form>
      <!--------------------------------------------------------------------------->
    </div>

    <div class="whiteBox">
      <div class="basicLine">
        <el-row>
          <el-col :span="4">
            <el-button
              size="mini"
              type="text"
              style="margin-top: 4px"
              @click="initaddEditUserList"
              >+添加成员</el-button
            >
          </el-col>
          <el-col :span="10" :offset="10">
            <el-row>
              <el-form
                ref="checkForm"
                :model="checkFormData"
                size="medium"
                label-width="100px"
              >
                <el-col :span="12">
                  <el-form-item label="统计时间" prop="projectStartEndTime">
                    <el-date-picker
                      type="daterange"
                      v-model="checkFormData.projectStartEndTime"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      :style="{ width: '100%' }"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      range-separator="至"
                      size="mini"
                      clearable
                      @change="init('search')"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="统计范围" prop="totalArea">
                    <el-select
                      v-model="checkFormData.totalArea"
                      placeholder="请选择统计范围"
                      clearable
                      size="mini"
                      :style="{ width: '100%' }"
                      @change="init('search')"
                    >
                      <el-option
                        v-for="(item, index) in countScopeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        :disabled="item.disabled"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>
    <!---项目成员安排--------------------------------------------->
    <div class="whiteBox" style="padding: 1%">
      <b>| 项目成员安排</b>
      <p></p>
      <p
        v-show="
          projectTable.projectUserList &&
          projectTable.projectUserList.length == 0
        "
      >
        <center><span class="color1">暂无项目成员</span></center>
      </p>
      <!-- :summary-method="totalOutYear" 
              show-summary
        -->

      <el-table
        v-show="
          projectTable.projectUserList &&
          projectTable.projectUserList.length > 0
        "
        :data="projectTable.projectUserList"
        :cell-style="columnStyle"
        border
        :header-row-style="{ height: '14px', 'line-height': '14px' }"
        :header-cell-class-name="headerClassName"
        style="width: 100%"
        max-height="650"
      >
        <el-table-column fixed prop="userName" label="执行人员" width="120">
        </el-table-column>
        <el-table-column fixed prop="planLoad" label="计划负荷" width="100">
          <template slot-scope="scope">
            {{ scope.row.planLoad + "%" }}
          </template>
        </el-table-column>
        <el-table-column
          fixed
          prop="planLoadWorkDay"
          label="计划负荷人日"
          width="120"
        >
          <template slot-scope="scope">
            {{ scope.row.planLoadWorkDay + "人日" }}
          </template>
        </el-table-column>
        <el-table-column fixed prop="realLoad" label="实际负荷" width="100">
          <template slot-scope="scope">
            <span :class="['loadType' + scope.row.loadType]">{{
              scope.row.realLoad + "%"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          prop="realLoadWorkDay"
          label="实际负荷人日"
          width="120"
        >
          <template slot-scope="scope">
            <span :class="['loadType' + scope.row.loadType]">{{
              scope.row.realLoadWorkDay + "人日"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed prop="planCost" label="计划投入" width="120">
        </el-table-column>
        <el-table-column fixed prop="realCost" label="实际投入" width="120">
          <template slot-scope="scope">
            <span :class="['loadType' + scope.row.costType]">{{
              scope.row.realCost + "%"
            }}</span>
          </template>
        </el-table-column>
        <!-- 滑动的内容块 start  -->
       <el-table-column
               v-for="(months, m) in monthArrTemp" 
              align="center"
              style="height: 15px"
              :label="months" >  
              <el-table-column label="计划负荷"   align="center">
                  <template slot-scope="{row}">
                      <span>
                        {{ row.projectUserScheduleList[m]
                        .planLoadCh+"%（"+row.projectUserScheduleList[m].planLoadWorkDayCh + "人日）" }}
                      </span>
                  </template>
              </el-table-column>
              <el-table-column label="实际负荷"   align="center">
                  <template slot-scope="{row}">
                    <span :class="['loadType' + row.projectUserScheduleList[m].loadType]">
                        {{ row.projectUserScheduleList[m].realLoadCh+"%（"+row.projectUserScheduleList[m].realLoadWorkDayCh + "人日）" }}</span
                      >
                  </template>
              </el-table-column> 


        </el-table-column>

        <!-- 滑动的内容块 end  -->
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <!-- @click.native.prevent="detailProject(scope.$index, scope.row)" -->
            <el-button
            v-show="scope.$index!=projectTable.projectUserList.length-1"
              type="text"
              size="small"
              @click="updateProjectOne(scope.$index, scope.row)"
            >
              修改
            </el-button>
            <el-button
             v-show="scope.$index!=projectTable.projectUserList.length-1"
              type="text"
              size="small"
              @click="delProjectOne(scope.$index, scope.row)"
            >
              删除
            </el-button>
            <!-- <span v-show="scope.$index==projectTable.projectUserList.length-1">--</span> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!---项目成员 添加 or 编辑--------------------------------------------->
    <div v-if="addEditUserActive" class="hr"></div>

    <div class="whiteBox" v-if="addEditUserActive" style="padding: 1%">
      <el-form
        ref="addEditForm"
        :model="addEditFormData"
        :rules="rules"
        size="medium"
        label-width="100px"
      >
        <div
          class="UserLine"
          v-for="(
            addUserList, addUserListindex
          ) in addEditFormData.projectUserList"
        >
          <el-row>
            <el-col :span="4">
              <el-form-item
                :prop="`projectUserList.${addUserListindex}.userId`"
                :rules="rules.projectUserListAllUserId"
              >
                <template v-if="addUserList.updateType == 3">
                  <!-- 我是修改的 -->
                  {{ addUserList.userName }}
                </template>

                <template v-if="addUserList.updateType == 1">
                  <!-- 我是新增的 -->
                  <el-select
                    v-model="addUserList.userId"
                    placeholder="请选择项目成员"
                    clearable
                    @change="
                      (userId) => {
                        getUserCost(userId, addUserListindex);
                      }
                    "
                    :style="{ width: '100%' }"
                  >
                    <el-option
                      v-for="user in userOptions"
                      :key="user.userId"
                      :label="user.userNameAndPost"
                      :value="user.userId"
                    ></el-option>
                  </el-select>
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item
                label=""
                :prop="`projectUserList.${addUserListindex}.startEndTime`"
                :rules="rules.projectUserListAllStartEndTime"
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
                <span>{{ addUserList.workDay }}</span> 天）
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
                  size="mini"
                  @click="addUserListHandel(addUserListindex)"
                  type="primary"
                  >提交</el-button
                >
                <el-button
                  size="mini"
                  @click="DelUserList(addUserListindex)"
                  type="error"
                  >取消</el-button
                >
              </div>
            </el-col>
          </el-row>
          <!----------------------内部-start------------------------------>
          <el-row
            v-for="(
              UserScheduleList, UserScheduleListIndex
            ) in addUserList.projectUserScheduleList"
          >
            <el-col :offset="5" :span="4">
              <div class="colText" style="text-indent: 30px">
                {{
                  UserScheduleList.startTime + "-" + UserScheduleList.endTime
                }}
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
      </el-form>
    </div>

    <!---项目信息修改--------------------------------------------->
    <div class="hr"></div>
    <div class="whiteBox" style="padding: 1%">
      <b
        >| 项目信息修改
        <div class="rightBar">
          <el-tabs v-model="auditStatus" size="mini" @tab-click="handleClick">
            <el-tab-pane
              :key="item.name"
              v-for="(item, index) in auditStatusTabs"
              :label="item.title"
              :name="item.name"
            >
            </el-tab-pane>
          </el-tabs>
        </div>
      </b>
      <p></p>
      <el-table
        :data="projectAuditTable"
        border
        style="width: 100%"
        max-height="650"
      >
        <el-table-column prop="applyDate" label="申请日期" width="150">
        </el-table-column>
        <el-table-column prop="applyUserName" label="申请人" width="150">
        </el-table-column>
        <el-table-column prop="relatePeople" label="涉及成员" width="250">
        </el-table-column>
        <el-table-column prop="updateScope" label="修改范围" width="150">
          <template slot-scope="scope">
            {{ scope.row.updateScope | toUpdateScope }}
          </template>
        </el-table-column>
        <el-table-column prop="updateContent" label="修改内容">
        </el-table-column>
        <el-table-column prop="status" label="状态" width="150">
          <template slot-scope="scope">
            {{ scope.row.status | toStatus }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope" >
            <!-- @click.native.prevent="detailProject(scope.$index, scope.row)" -->
            <!-- 他必须是项目主管和项目负责人 才可以点击取消 -->
            <div v-show="auditStatus==1">

            <el-button
              type="text"
              size="small" v-show="isProjectByUser(formData)||isJurisdiction('admin')"             
              @click="updateAuditPro(scope.row, '4')"
              ><span class="color1"> 取消 </span></el-button>
            <el-button
              type="text"
              size="small"
              @click="updateAuditPro(scope.row, '2')" v-show="isJurisdiction('projectsupervision','admin')"
              ><span class="color2"> 通过 </span></el-button>
            <el-button
              type="text"
              size="small"
              @click="updateAuditPro(scope.row, '3')"  v-show="isJurisdiction('projectsupervision','admin')"
              ><span class="color3"> 拒绝 </span></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {
  queryInfoById,
  queryProjectAudit,
  updateAuditProById,
  getTimeProcess,
  queryUserlist,
  queryDict,
  addProjectList,
  searchProjectList,
  updateProjectStatus,
  updateProjectUserAddEdit,
  updateQueryUserById,
} from "@/api/proManager/proManager";
export default {
  name: "ProDetail",
  components: {},
  props: {},
  data: () => ({
    childDateArea: {
      // 项目成员安排的 可选时间区间
      disabledDate: (time) => {
        if (
          this.formData.projectEndTime != "" &&
          this.formData.projectStartTime
        ) {
          // 设置可以选择的区间 时间为项目的 起始日期和结束日期
          return (
            time.getTime() > new Date(this.formData.projectEndTime).getTime() ||
            time.getTime() <
              new Date(this.formData.projectStartTime).getTime() - 8.64e7
          );
        }
      },
    },
    monthArrTemp:[],
    userOptions: [],
    addEditUserActive: false, // 默认是详情页 不可以编辑
    rules: {
      projectUserListAllUserId: [
        {
          required: true,
          message: "请选择项目成员",
          trigger: "change",
        },
      ],
      projectUserListAllStartEndTime: [
        {
          required: true,
          message: "请选择参与时间",
          trigger: "change",
        },
      ],
    },
    projectUserIdOptions: [],
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
    // 新增编辑的初始化 数据结构集合
    addEditFormData: {},
    // 详情页面显示的
    formData: {
      priority: 3 /*优先级（1.最高，2.高，3.普通，4.较低）*/,
      projectChance: "" /* 关联机会*/,
      projectCode: "" /* 项目编号*/,
      projectEndTime: "" /* 项目结束时间*/,
      projectName: "" /* 项目名称*/,
      projectService: "" /* 服务对象*/,
      projectStage: "" /* 项目阶段*/,
      projectStartTime: "" /* 项目开始时间*/,
      projectType: "" /* 项目类型*/,
      projectUserId: "" /* 项目负责人*/,
      projectUserList: [] /* 项目成员列表*/,
      projectGitUrl: "", // 项目git 地址
    },
    checkFormData: {
      projectId: "", //项目id
      startTime: null, //统计开始时间
      endTime: "", //统计结束时间
      countScope: undefined, //统计范围 1.全部，2.仅我负责，3.仅部门成员
    },
    projectName: "",
    projectId: "",
    countScope:"",
    countScopeOptions: [], //统计范围 1.全部，2.仅我负责，3.仅部门成员
    countScopeInit: "",
    projectTable: [
      {
        projectUserList: [
          {
            projectUserScheduleList: [],
          },
        ],
      },
    ],
    labelArr: [],
    projectAuditTable: [], // 项目的信息修改的  历史记录
    checkAuditFormData: {
      // 项目修改的日志
      status: "1", //状态（1.待审核,2.已通过,3.已拒绝)
      projectId: "",
    },
    auditStatus: "1", // 默认选择的
    auditStatusTabs: [
      { title: "待审核", name: "1" },
      { title: "已通过", name: "2" },
      { title: "已拒绝", name: "3" },
    ],
  }),
  computed: {},
  watch: {},
  created() {
    this.projectName = this.$route.query.projectName;
    this.projectId = this.$route.query.projectId;
    this.countScope = this.$route.query.countScope;
    this.init("init");
  },
  mounted() {
    // 额外的判断 页面初始化 判断用户的角色  isJurisdiction 判断当前的值是否存在 返回true or false
    // 部门主管 deptdirector  3
    // 项目主管 projectdirector 2
    // 项目监管 管理员 projectsupervision || admin ==>  1
    let deptdirector = this.isJurisdiction("deptdirector"); // 部门主管
    let projectdirector = this.isJurisdiction("projectdirector"); // 项目主管
    let projectsupervision = this.isJurisdiction("projectsupervision"); // 项目监管
    let admin = this.isJurisdiction("admin"); // 管理员
    let countScopeOptionsTemp = [];
    if (projectdirector) {
      // 项目主管
      this.countScopeInit = 2;
      countScopeOptionsTemp.push({
        label: "仅我负责",
        value: 2,
      });
    }
    if (deptdirector) {
      // 部门主管
      this.countScopeInit = 3;
      countScopeOptionsTemp.push({
        label: "仅部门成员",
        value: 3,
      });
    }

    if (projectsupervision || admin) {
      // 项目监管
      this.countScopeInit = 1;
      countScopeOptionsTemp.push({
        label: "全部",
        value: 1,
      });
    }
    this.countScopeOptions = countScopeOptionsTemp;
    // 统计范围的-------------------------------------------
    this.proAuditInit();
    // this.getDictList("project_phase"); // 项目阶段 project_phase
    // this.getDictList("project_type"); // 项目类型 project_type
    // this.getDictList("serivce_obj_type"); // 服务对象 serivce_obj_type
  },

  methods: {
    // 动态生成 表头样式
    headerClassName(row) {
      // console.log(row.column)
      // if(row.column.property=='total')
      return "proUserList";
    },
    // 初始化 新增成员
    initaddEditUserList() {
      this.addEditUserActive = true;
      // 我是新增
      this.addEditFormData = {};
      this.addEditFormData = this.deepClone(this.formData); // 填充编辑和新增的
      this.addEditFormData.projectUserList = []; // 先清空，只留一个空数组

      let oneUser = this.deepClone(this.projectUserList);
      oneUser.updateType = 1;
      this.addEditFormData.projectUserList.push(oneUser);
    },
    // 修改一个 项目成员的 工作计划
    updateProjectOne(index, row) {
      this.addEditUserActive = true;
      // 我是修改
      this.addEditFormData = {};
      let params = {
        projectId: this.formData.projectId,
        userId: row.userId,
      };
      updateQueryUserById(params).then((res) => {
        let { code, msg } = res;

        if (+code == 200) {
          this.addEditFormData = this.deepClone(this.formData); // 填充项目的基础数据
          this.addEditFormData.projectUserList = []; // 先清空，只留一个空数组
          // if (this.formData.projectService == "") {
          //   this.$message.error("请您先选择项目基础信息内-服务对象！");
          // } else {
          // console.log(res);
          res.data.workDayTemp = res.data.workDay;
          // 点击修改，拿到此项目的 项目类型 对内对外
          //  1:'对内', costIn
          //  2:'对外' costOut
          res.data.costNum =
            this.formData.projectService == 1
              ? res.data.costIn
              : res.data.costOut;
          res.data.projectUserScheduleList.map((item) => {
            item.day = item.weekDay;
          });
          let oneUser = this.deepClone(res.data);
          // 修改类型（1.新增,2.删除,3.修改原数据）
          oneUser.updateType = 3;
          oneUser.startEndTime = [oneUser.startTime, oneUser.endTime];

          this.addEditFormData.projectUserList.push(oneUser);
          // }
          // // 删除成功 只会去查询 审核的方法
          // this.auditStatus = "1"; // 初始化 显示 待审核
          // this.proAuditInit();
        }
      });
    },
    // 删除一个 项目成员
    delProjectOne(index, row) {
      this.$confirm(`您确定要删除${row.userName}吗?`, "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = this.deepClone(this.formData);
          params.projectUserList = [];
          params.projectUserList.push(row);
          // 修改类型（1.新增,2.删除,3.修改原数据）
          params.projectUserList[0].updateType = 2;

          updateProjectUserAddEdit(params).then((res) => {
            let { code, msg } = res;
            this.$message.success(msg);
            if (+code == 200) {
              // 提交删除成功  需要审核
              this.auditStatus = "1"; // 初始化 显示 待审核
              this.proAuditInit();
            }
          });
        })
        .catch(() => {});
      // console.log(index,row);
    },
    // 项目成员的添加的 保存 提交方法
    addUserListHandel(index) {
      // this.addEditFormData.projectUserList.splice(index, 1);
      this.$refs["addEditForm"].validate((valid) => {
        if (!valid) return;
        // TODO 提交表单
        if (valid) {
          this.addEditFormData.projectUserList[
            index
          ].projectUserScheduleList.map((item, i) => {
            item.weekDay = item.day;
            // item.week = item.weekOfYear;
          });
          let parame = {
            ...this.addEditFormData,
          };
          updateProjectUserAddEdit(parame).then((res) => {
            let { code, msg } = res;
            this.$message.success(msg);
            if (+code == 200) {
              // 添加成功 只会去查询 审核的方法
              this.auditStatus = "1"; // 初始化 显示 待审核
              this.proAuditInit();
              this.addEditFormData = {};
              this.addEditUserActive = false;
            }
          });
        }
      });
    },
    // 删除单行用户的
    DelUserList(index) {
      // this.$confirm(`您确定要删除这条记录吗?`, "温馨提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning",
      // })
      //   .then(() => {
          this.addEditFormData.projectUserList.splice(index, 1);
          this.addEditFormData = {};
          this.addEditUserActive = false;
        // })
        // .catch(() => {});
    },
    /*修改每日工时*/
    changeDayTime(number, day, fatherIndex, myIndex) {
      // 期间计划负荷 = 当前行的总天数day*number  /  当前行的总天数day * 8
      this.addEditFormData.projectUserList[fatherIndex].projectUserScheduleList[
        myIndex
      ].planLoad = (((day * number) / (day * 8)) * 100 || 0).toFixed(2);
      // 循环 取出每周的工作时长
      let totalTime = 0,
        totalDay = 0;
      this.addEditFormData.projectUserList[
        fatherIndex
      ].projectUserScheduleList.map((item, i) => {
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
        // item.week = item.weekOfYear;
      });

      // 暂存一下 实际的天数
      // console.log(totalDay);
      // console.log(this.addEditFormData.projectUserList[fatherIndex].workDayTemp);
      const tempWorkDay =
        this.addEditFormData.projectUserList[fatherIndex].workDayTemp;
      // 顶部的 共计多少小时  多少天
      this.addEditFormData.projectUserList[fatherIndex].workDay = totalDay / 8;
      this.addEditFormData.projectUserList[fatherIndex].workTime = totalTime;
      // 顶部的 计划负荷 预计成本

      this.addEditFormData.projectUserList[fatherIndex].planLoad = (
        (totalDay / (tempWorkDay * 8)) *
        100
      ).toFixed(2);
      this.addEditFormData.projectUserList[fatherIndex].expectedCost = (
        this.addEditFormData.projectUserList[fatherIndex].workDay *
        this.addEditFormData.projectUserList[fatherIndex].costNum
      ).toFixed(2);
    },

    /*根据起始和结束 生成下面表格*/
    getTimeArea(dates, index) {
      let params = {
        startDate: dates[0],
        endDate: dates[1],
      };
      getTimeProcess(params).then((res) => {
        this.addEditFormData.projectUserList[index].workDay = res.data.day;
        this.addEditFormData.projectUserList[index].workDayTemp = res.data.day;
        this.addEditFormData.projectUserList[index].workTime = res.data.day * 8;
        this.addEditFormData.projectUserList[index].startTime = dates[0];
        this.addEditFormData.projectUserList[index].endTime = dates[1];
        this.addEditFormData.projectUserList[index].expectedCost = (
          res.data.day * this.addEditFormData.projectUserList[index].costNum
        ).toFixed(2);
        res.data.list.map((item) => {
          item.startTime = item.startDate;
          item.endTime = item.endDate;
          item.workTime = "8";
          item.planLoad = (
            ((item.day * 8) / (item.day * 8)) * 100 || 0
          ).toFixed(2);
        });
        this.addEditFormData.projectUserList[index].projectUserScheduleList =
          res.data.list; // 此人的 每周安排
        this.addEditFormData.projectUserList[index].planLoad = (
          ((8 * res.data.day) / (res.data.day * 8)) *
          100
        ).toFixed(2); // 计划负荷
      });
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
          item.userNameAndPost = item.userName + "（" + item.postName + "）";
        });
        // addEditFormData.projectUserList[index].costNum
        // costNum 是我自己设置第一个值 用于存储 成本的单位
        //  对外
        // 服务对象(1.对内，2.对外)
        if (this.addEditFormData.projectService == 2) {
          //对外
          this.addEditFormData.projectUserList[index].costNum =
            res.data[0].costOut;
        } else {
          // 对内
          this.addEditFormData.projectUserList[index].costNum =
            res.data[0].costIn;
        }

        this.projectUserIdOptions = res.data;
      });
    },
    /* 查询用户列表 */
    getUserList() {
      let userIdsTemp = [];
      this.projectTable.projectUserList.map((item, i) => {
        // 因为此处增加了  总计的行
        if (i < this.projectTable.projectUserList.length - 1) {
          userIdsTemp.push(item.userId);
        }
      });
      let data = {
        userIds: userIdsTemp,
      };
      queryUserlist(data).then((res) => {
        res.data.map((item) => {
          item.userNameAndPost = item.userName + "（" + item.postName + "）";
        });
        this.projectUserIdOptions = res.data;
        this.userOptions = res.data;
      });
    },
    //*--------以上是添加和编辑 项目成员的方法----------------------------------------------------------------------
    // 设置生成 列的背景色
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (column.width != 120 && column.width != 100) {
        return "background:	#f4f4ff;";
      }
    },
    goManagerPage(){
         const obj = { path:'/projectManager/proManager'};
        this.$tab.closeOpenPage(obj);
    },
    goEditPage(){
      // :to="'?projectId=' + projectId+'&countScope='+countScope"  
      const obj = { path:'/projectManager/proEdit', query:{ projectId:this.projectId,countScope:this.countScope}};
        this.$tab.closeOpenPage(obj);
    },
    stopProject() {
      // 终止项目
      this.$confirm(
        `此操作将${
          this.projectTable.projectStatus == 4 ? "开启" : "终止"
        }项目：${this.projectName}, 是否继续?`,
        "温馨提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          let params = {
            projectId: this.$route.query.projectId,
          };
          updateProjectStatus(params).then((res) => {
            console.log(res);
            let { msg } = res;
            this.$message.success(msg);
            this.$router.push("/projectManager/proManager");
          });
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        });
    },

    /*选择项目有效期*/
    getProjectTimeArea(dates) {
      this.formData.projectStartTime = dates[0];
      this.formData.projectEndTime = dates[1];
    },
    // 点击取消  删除  提交
    updateAuditPro(rowData, type) {
      let params = {
        id: rowData.id,
        status: parseInt(type),
      };
      updateAuditProById(params).then((res) => {
        let { msg } = res;
        this.$message.success(msg);
        this.init("init");
        this.auditStatus = "1"; // 初始化 显示 待审核
        this.proAuditInit();
      });
    },
    // 点击上面的 项目修改记录的 状态切换
    handleClick(tab, event) {
      // console.log(tab);
      this.auditStatus = tab.name;
      this.proAuditInit();
    },
    proAuditInit() {
      // 初始化查询 项目修改记录 的日志
      this.checkAuditFormData.projectId = this.$route.query.projectId;
      this.checkAuditFormData.status = this.auditStatus;
      queryProjectAudit(this.checkAuditFormData).then((res) => {
        this.projectAuditTable = res.data;
      });
    },
    init(type) {
      if (type == "init") {
        // 初始化传 项目截止时间
        this.checkFormData.startTime = this.$route.query.startTime;
        this.checkFormData.endTime = this.$route.query.endTime;
        this.checkFormData.projectId = this.$route.query.projectId;
        this.checkFormData.countScope = this.$route.query.countScope;
      } else {
        // search 选择时间 或者范围的时候
        this.checkFormData.startTime = this.checkFormData.projectStartEndTime
          ? this.checkFormData.projectStartEndTime[0]
          : "";
        this.checkFormData.endTime = this.checkFormData.projectStartEndTime
          ? this.checkFormData.projectStartEndTime[1]
          : "";
        this.checkFormData.projectId = this.$route.query.projectId;
        this.checkFormData.countScope = this.checkFormData.totalArea;
      }
      queryInfoById(this.checkFormData).then((res) => {
        this.projectTable = res.data;
        this.projectTable.projectUserList = res.data.projectUserList;
        // 在有项目成员之后  再 过滤已经有的人
        // 获取并过滤用户的下拉
        // if(res.data.projectUserList.length>0){
        // 如果 某个操作触发了 初始化，
        this.getUserList();
        // }
        // 拼接列名
        this.monthArrTemp =[]
        // 动态生成 合计天数周数 日期区间
        res.data.projectUserList[0].projectUserScheduleList.forEach((v,i)=>{   
            this.monthArrTemp.push((v.weekMonth +'月- ' +v.week +'周 (' +v.startTime + "-" + v.endTime +')').toString())
                        })
        res.data.projectUserList.map((item, i) => {
          item.projectUserScheduleList.map((jtem, j) => {
            // item["planLoadCh" + i + j] = jtem.planLoadCh;
            // item["planLoadWorkDayCh" + i + j] = jtem.planLoadWorkDayCh;
            // item["realLoadCh" + i + j] = jtem.realLoadCh;
            // item["realLoadWorkDayCh" + i + j] = jtem.realLoadWorkDayCh;
            // 最后一条 不处理
            if (i < res.data.projectUserList.length - 1) {
              jtem.weekTimeArea =
                jtem.startTime.substring(5) + "-" + jtem.endTime.substring(5);
            }
          });
        });


        this.formData = res.data; // 填充详情的
        this.formData.projectTimeArea =
          res.data.projectStartTime + "-" + res.data.projectEndTime;
        // 之前的做法 动态生成 表格列
        // if (res.data.projectUserList[0].projectUserScheduleList.length != 0) {
        //   this.labelArr = this.createLabel(
        //     res.data.projectUserList[0].projectUserScheduleList.length
        //   );
        // }
      });
    },
    // 动态生成 label
    // createLabel(len) {
    //   let a = [];
    //   let oneArr = [{ label: "计划负荷" }, { label: "实际负荷" }];
    //   for (let i = 0; i < len; i++) {
    //     a = a.concat(oneArr);
    //   }
    //   return a;
    // },
    // 设置生成 列的背景色
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (column.width != 120 && column.width != 100) {
        return "background:	#f4f4ff;";
      }
    },
    // 总计的计算方法
    totalOutYear(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        // 第一行现实 合计
        if (index === 0) {
          sums[index] = "总计";
          return;
        }
        // if (index === 2 || index === 3) {
        //   sums[index] = "--";
        // }
        const values = data.map((item, i) => {
          return Number(item[column.property]);
        });

        if (!values.every((value) => isNaN(value))) {
          /**------------------------总计的计算方法start-----------------------------**/
          if (column.width == 120) {
            // 非动态列 除了 计划负荷 实际负荷
            // 普通数值 直接相加
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          }
          if (column.width != 120) {
            // 动态列 + 计划负荷 实际负荷
            // 百分比的数值，需要除以 数据长度
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr / data.length;
              } else {
                return prev;
              }
            }, 0);
          }
          /**------------------------总计的计算方法end-----------------------------**/
          /**------------------------结果的动态 单位方法-----------------------------**/
          let renri = /WorkDay/i;
          let load = /realLoadCh|planLoadCh/i;
          sums[index] = sums[index].toFixed(2);

          if (load.test(column.property)) {
            sums[index] += "%";
          } else if (renri.test(column.property)) {
            sums[index] += "人日";
          } else {
            sums[index];
          }
        }
        // 总计核心代码块
      });
      return sums;
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
.basicLine {
  background-color: #e8e8f4;
  display: block;
  height: 40px;
  // line-height: 28px;
  width: 100%;
  // position: relative;
  // margin: 0 auto;
  font-size: 12px;
  padding: 3px 20px 10px 20px;
}
.routerBar {
  position: relative;
  .backBar {
    color: #557db3;
    background-color: #e8e8f4;
    display: block;
    width: 98%;
    height: 28px;
    line-height: 28px;
    position: relative;
    margin: 0 auto;
    font-size: 12px;
  }
  span {
    font-size: 12px;
    color: #999;
  }
}
.color1 {
  color: #909399;
}
.color2 {
  color: #409eff;
}
.color3 {
  color: #e6a23c;
}
.color4 {
  color: #f56c6c;
}
.piancha0 {
  color: #333;
}
.piancha1 {
  color: #26b0a8;
}
.piancha2 {
  color: #f56c6c;
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
.rightLink {
  top: 1px;
  right: 30px;
  width: 150px;
  position: absolute;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: flex-end;
  .color1 {
    color: #909399;
  }
  .color2 {
    color: #409eff;
  }
  .color3 {
    color: #e6a23c;
  }
  .color4 {
    color: #f56c6c;
  }
  .color5 {
    color: #26b0a8;
  }
}
// 低（灰色）4、普通（蓝色）3、紧急（橙色）2、非常紧急（红色）1显示；
// 1:"最高",
// 2:"高",
// 3:"普通",
// 4:"较低"
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
.yuan {
  border-radius: 20px;
  height: 10px;
  width: 10px;
  display: inline-block;
  margin-right: 10px;
}
.priorityBg4 {
  background-color: #909399;
}
.priorityBg3 {
  background-color: #409eff;
}
.priorityBg2 {
  background-color: #e6a23c;
}
.priorityBg1 {
  background-color: #f56c6c;
}
.dynamicColumn {
  background-color: #ccc;
}
//1 红  2 黑 3 绿
.loadType1 {
  color: #f56c6c;
}
.loadType2 {
  color: #333;
}
.loadType3 {
  color: #26b0a8;
}
</style>
<style>
.UserLine /deep/.el-form-item {
  margin-bottom: 2px;
}
.proUserList {
  height: 20px !important;
  padding: 2px 0 !important;
}
</style>
