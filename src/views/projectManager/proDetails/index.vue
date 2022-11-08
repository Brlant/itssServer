<template>
  <div class="app-container containers">
    <div class="routerBar">
      <b>{{ projectName }}详情</b><span>（仅项目负责人可对此项目下列对内进行编辑）</span>
      <div class="rightBox">
        <!-- <el-button size="mini" type="success">导出excel</el-button> -->
      </div>
    </div>
    <div class="routerBar">
      <div class="backBar">
        <!-- <router-link :to=""> < 返回</router-link> -->
        <span @click="goManagerPage" style="cursor: pointer; color: #409eff">
          < 返回
        </span>
        <div
          class="rightLink"
          v-show="isProjectByUser(formData) || isJurisdiction('admin')"
        >                  
          <span @click="goEditPage" style="cursor: pointer"  v-show="isShowActive==0&&!isUpdateActive" class="color2"> 编辑 |</span>
          
          <span
            @click="stopProject"
            style="cursor: pointer"  v-show="isShowActive==0&&!isUpdateActive"
            :class="[projectTable.projectStatus == 4 ? 'color5' : 'color4']"
          >
            {{ projectTable.projectStatus == 4 ? "开启" : "终止" }}
          </span>
        </div>
      </div>
    </div>

    <div class="whiteBox" style="padding: 1%">
      <b>| 项目基础信息</b>
      <p style="height: 10px"></p>
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
          <el-col :span="7" :offset="1">
            <!-- <el-form-item label="关联机会" prop="projectChance">
              {{ formData.projectChanceName }}
            </el-form-item> -->
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="项目组" prop="projectGroupName">
              {{ formData.projectGroupName }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!--------------------------------------------------------------------------->
    </div>

    <div class="whiteBox">
      <div class="basicLine">
        <el-row>
          <el-col :span="4">
            <div class="zhanwei"></div>
            <div v-show="isShowActive==0">
            <el-button 
              v-show="isProjectByUser(formData) || isJurisdiction('admin')"
              v-if=""
              size="mini"
              type="text"
              style="margin-top: 4px"
              @click="initaddEditUserList"
              >+ 资源配置</el-button>
            </div>
          </el-col>
          <el-col :span="10" :offset="7">
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
                      :picker-options="childDateArea"
                      @change="init('search')"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="统计范围" prop="countScope">
                    <el-select
                      v-model="checkFormData.countScope"
                      placeholder="请选择统计范围"
                      clearable
                      size="mini"
                      :style="{ width: '100%' }"
                      @change="init('search')"
                    >
                      <el-option
                        v-for="(item, index) in countScopeOptions"
                        :key="item.value"
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
          <el-col :span="3" style="    text-align: right;padding-top: 3px;">
            <el-button size="mini" type="primary" v-show="isShowActive==0&&isUpdateActive"  @click="goAudit">提交审核</el-button>
            <el-button size="mini" type="default" v-show="isShowActive==0&&isUpdateActive" @click="cancelSave">取消</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <!---项目成员安排--------------------------------------------->
    <div class="whiteBox" style="padding: 1%">
      <b>| 项目资源配置</b>
      <p style="height: 10px"></p>
      <p
        v-show="projectTable.projectUserList && projectTable.projectUserList.length == 0"
      >
        <center><span class="color1">暂无资源配置</span></center>
      </p>

      <el-table
        v-show="projectTable.projectUserList && projectTable.projectUserList.length > 0"
        :data="projectTable.projectUserList"
        border
        class="myTable"
        :header-row-style="{ height: '14px', 'line-height': '14px' }"
        :header-cell-class-name="headerClassName"
        style="width: 100%"
        max-height="650"
        :row-class-name="tableRowClassName"
        @row-click="showRowDetail"
      >
        <el-table-column prop="userName" label="执行人员" width="120" fixed="left">
          <template slot-scope="scope">
              <span :class="[scope.row.userName=='无'?'':'priority3']">{{scope.row.userName?scope.row.userName:"无"}}</span>            
          </template>
        </el-table-column>
        <el-table-column prop="planLoad" label="计划负荷" width="120" fixed="left">
          <template slot-scope="scope">
            {{ scope.row.planLoad + "%" }}
            <span class="color1">（{{ scope.row.planLoadWorkDay + "人日" }}）</span>
          </template>
        </el-table-column>
        <el-table-column prop="realLoad" label="实际负荷" width="100" fixed="left">
          <template slot-scope="scope">
            <span :class="['loadType' + scope.row.loadType]">{{
              scope.row.realLoad + "%"
            }}</span>
            <span :class="['loadType' + scope.row.loadType]"
              >（{{ scope.row.realLoadWorkDay + "人日" }}）</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="planCost" label="计划投入" width="120" fixed="left">
        </el-table-column>
        <el-table-column prop="realCost" label="实际投入" width="120" fixed="left">
          <template slot-scope="scope">
            <span :class="['loadType' + scope.row.costType]">{{
              scope.row.realCost
            }}</span>
          </template>
        </el-table-column>
        <!-- 滑动的内容块 start  -->
        <el-table-column
          v-for="(months, m) in monthArrTemp"
          align="center"
          style="height: 15px"
          :label="months"
        >
          <el-table-column label="计划负荷" min-width="130" align="center">
            <template slot-scope="{ row }">
              <span>
                {{
                  row.projectUserScheduleList[m].planLoadCh +
                  "%（" +
                  row.projectUserScheduleList[m].planLoadWorkDayCh +
                  "人日）"
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="实际负荷" min-width="130" align="center">
            <template slot-scope="{ row }">
              <span :class="['loadType' + row.projectUserScheduleList[m].loadType]">
                {{
                  row.projectUserScheduleList[m].realLoadCh +
                  "%（" +
                  row.projectUserScheduleList[m].realLoadWorkDayCh +
                  "人日）"
                }}</span
              >
            </template>
          </el-table-column>
        </el-table-column>

        <!-- 滑动的内容块 end  -->
        <el-table-column
          label="操作"
          width="120"
          fixed="right"
          v-if="isProjectByUser(formData) || isJurisdiction('admin')"
        >
          <template slot-scope="scope">
            <!-- @click.native.prevent="detailProject(scope.$index, scope.row)" -->
            <el-button
              v-show="scope.$index != projectTable.projectUserList.length - 1 && isShowActive==0"
              type="text"
              size="small"
              @click.native.stop="updateProjectOne(scope.$index, scope.row)"
            >
              修改
            </el-button>
            <el-button
              v-show="scope.$index != projectTable.projectUserList.length - 1 && isShowActive==0"
              type="text"
              size="small"
              @click.native.stop="delProjectOne(scope.$index, scope.row)"
            >
              删除
            </el-button>
            <!-- <span v-show="scope.$index==projectTable.projectUserList.length-1">--</span> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!---项目成员 添加 or 编辑--------------------------------------------->
    <div v-if="addEditUserActive || detailUserActive" class="hr"></div>

    <div class="whiteBox" v-if="detailUserActive" style="padding: 1%">
      <el-form
        ref="addEditForm"
        :model="addEditFormData"
        :rules="rules"
        size="medium"
        label-width="30px"
      >
        <div
          class="UserLine"
          v-for="(addUserList, addUserListindex) in addEditFormData.projectUserList"
        >
          <el-row>
            <el-col :span="4">
              <el-form-item label-width="130px" label="区域-职位-级别：">
                <div class="colText">
                  <span>
                    {{ addUserList.postName }}
                  </span>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="2">
              <el-form-item label-width="130px" label="执行人员：">
                <div class="checkUser">
                  {{ addUserList.userName?addUserList.userName:'无' }}
                </div>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="3" :offset="12">
              <el-button size="mini" type="primary">提交审核</el-button>
              <el-button size="mini" type="default">取消</el-button>
            </el-col> -->
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-form-item label="配置安排：" label-width="130px">
                <div class="colText" style="text-indent: 30px">
                  <span>{{ addUserList.startTime + "---" + addUserList.endTime }}</span>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="3" :offset="1">
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
              <div class="colText" style="text-indent: 40px">
                {{ UserScheduleList.startTime + "---" + UserScheduleList.endTime }}
              </div>
            </el-col>
            <el-col :span="3" :offset="1">
              <div class="colText">
                期间计划负荷
                <span>
                  {{ UserScheduleList.planLoad }}
                </span>
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
        </div>
      </el-form>
    </div>
    <div class="whiteBox" v-if="addEditUserActive">
      <el-form
        ref="addEditForm"
        :model="addEditFormData"
        :rules="rules"
        size="medium"
        label-width="30px"
      >
        <div
          v-for="(addUserList, addUserListindex) in addEditFormData.projectUserList"
          :key="addUserListindex"
          style="padding: 10px 20px"
        >
          <el-row>
            <el-col :span="6">
              <el-form-item
                :prop="`projectUserList.${addUserListindex}.postId`"
                :rules="rules.projectUserListAllPostId"
                label-width="130px"
                label="区域-职位-级别："
              >
                <el-select
                  v-model="addUserList.postId"
                  placeholder="请选择职位"
                  filterable
                  :style="{ width: '100%' }"
                  @change="
                    (postId) => {
                      getPostId(postId, addUserListindex);
                    }
                  "
                >
                  <el-option
                    v-for="user in postIdOptions"
                    :key="user.postId"
                    :label="user.postIdOptions"
                    :value="user.postId"
                    :disabled="user.disabled"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
             <el-col :span="6" :offset="2">
              <el-form-item label-width="130px" label="执行人员：">
                <div class="checkUser">
                  {{ addUserList.userName?addUserList.userName:"无"}}
                </div>
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
                  @change="(dates) => getTimeArea(dates, addUserListindex)"
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
            <el-col :span="3" :offset="3"
              ><div class="colText2">
                <el-button
                  size="mini"
                  @click="addUserListHandel(addUserListindex)"
                  type="primary"
                  >暂存</el-button
                >
                <el-button size="mini" @click="DelUserList(addUserListindex)" type="error"
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
                  :style="{ width: '110px' }"
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
        </div>
      </el-form>
    </div>
    <!---点击职业的修改---人员推荐------------------------------------------>
    <div class="hr" v-show="recommendUserActive"></div>
    <div class="whiteBox" v-show="recommendUserActive" style="padding: 1%">
      <b>| 人选推荐</b>
      <p style="height: 10px"></p>
      <el-table
        :data="recommendUserTableData"
        border
        class="myTable"
        :header-row-style="{ height: '14px', 'line-height': '14px' }"
        :header-cell-class-name="headerUserClassName"
        style="width: 100%"
        max-height="650"
      >
        <el-table-column prop="nickName" label="姓名"></el-table-column>
        <el-table-column prop="regionName" label="区域"></el-table-column>
        <el-table-column prop="postName" label="职位名称"></el-table-column>
        <el-table-column prop="postLevel" label="等级"></el-table-column>
        <el-table-column prop="price" label="单价"></el-table-column>
        <el-table-column prop="allPrice" label="总价"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div v-show="isShowActive==0">
                <!-- 1 不显示 有审核记录，0显示  没有审核记录 -->
            <el-button type="text" size="mini" v-if="showAddOrCancel(scope.row)">
              <span class="color2"  @click="addUserToProject(scope.row)">添加 </span>
            </el-button>
            <el-button type="text" size="mini" v-else>
              <span class="color1"  @click="delUserToProject(scope.row)">取消 </span>
            </el-button>
            </div>
          </template>
        </el-table-column>
        <!-- nickName:"",//姓名
      regionName:"",//区域
      postName:"",//职位名称
      postLevel:"",//等级
      price:"",//单价
      allPrice:"",//总价 -->
      </el-table>
    </div>

    <!---项目信息修改---其实就是审核列表------------------------------------------>
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
      <el-table :data="projectAuditTable" border style="width: 100%" class="myAuditTable" max-height="650">
        <el-table-column prop="applyDate" label="申请日期" width="150"> </el-table-column>
        <el-table-column prop="applyUserName" label="申请人" width="150">
        </el-table-column>
        <el-table-column prop="relatePeople" label="涉及对象" width="250">
        </el-table-column>
        <el-table-column prop="updateScope" label="变更事项" width="150">
          <template slot-scope="scope">
            {{ scope.row.updateScope | toUpdateScope }}
          </template>
        </el-table-column>
        <el-table-column prop="updateContent" label="修改内容"> </el-table-column>
        <el-table-column prop="status" label="状态" width="150">
          <template slot-scope="scope">
            {{ scope.row.status | toStatus }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <!-- @click.native.prevent="detailProject(scope.$index, scope.row)" -->
            <!-- 他必须是项目主管和项目负责人 才可以点击取消 -->
            <div v-show="auditStatus == 1">
              <el-button
                type="text"
                size="small"
                v-show="isProjectByUser(formData) || isJurisdiction('admin')"
                @click="updateAuditPro(scope.row, '4')"
                ><span class="color1"> 取消 </span></el-button
              >
              <el-button
                type="text"
                size="small"
                @click="updateAuditPro(scope.row, '2')"
                v-show="isJurisdiction('projectsupervision', 'admin')"
                ><span class="color2"> 通过 </span></el-button
              >
              <el-button
                type="text"
                size="small"
                @click="updateAuditPro(scope.row, '3')"
                v-show="isJurisdiction('projectsupervision', 'admin')"
                ><span class="color3"> 拒绝 </span></el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import "moment/locale/zh-cn";
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
  queryUserByPostId,
  getPostOptions,
} from "@/api/proManager/proManager";
import Vue from 'vue'
export default {
  name: "ProDetail",
  components: {},
  props: {},
  data: () => ({
    monthArrTemp: [],
    userOptions: [],
    postIdOptions: [],
    addEditUserActive: false, // 添加的资源配置 编辑的资源配置
    detailUserActive: false, //  默认是详情页 不可以编辑
    rules: {
      projectUserListAllStartEndTime: [
        {
          required: true,
          message: "请选择配置安排",
          trigger: "change",
        },
      ],
      projectUserListAllPostId: [
        {
          required: true,
          message: "请选择职位",
          trigger: "change",
        },
      ],
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
      day: "", // 同 workDay
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
    recommendUserActive: false,
    recommendUserTableData: [
      // {
      //   nickName: "", //姓名
      //   regionName: "", //区域
      //   postName: "", //职位名称
      //   postLevel: "", //等级
      //   price: "", //单价
      //   allPrice: "", //总价
      // },
    ],
    checkFormData: {
      projectId: "", //项目id
      startTime: null, //统计开始时间
      endTime: "", //统计结束时间
      countScope: undefined, //统计范围 1.全部，2.仅我负责，3.仅部门成员
    },
    projectName: "",
    projectId: "",
    countScope: "",
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
    childDateArea: null,
    nowIndex:0,// 记录当前修改的那一条职位记录 资源
    isShowActive: 1,//isShow;  //是否显示按钮 1 不显示，0显示 标识是否有审核记录在
    isUpdateActive:false //是否点击了 添加  和暂存 的内容
  }),
  computed: {},
  watch: {},

  created() {
    // 额外的判断 页面初始化 判断用户的角色  isJurisdiction 判断当前的值是否存在 返回true or false
    // 部门主管 deptdirector  3
    // 项目主管 projectdirector 2
    // 项目监管 管理员 projectsupervision || admin ==>  1
    let deptdirector = this.isJurisdiction("deptdirector"); // 部门主管
    let projectdirector = this.isJurisdiction("projectdirector"); // 项目主管
    let projectsupervision = this.isJurisdiction("projectsupervision"); // 项目监管
    let operatemanage = this.isJurisdiction("operatemanage"); // 运营管理
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

    if (projectsupervision || admin || operatemanage) {
      // 项目监管
      this.countScopeInit = 1;
      countScopeOptionsTemp.push({
        label: "全部",
        value: 1,
      });
    }
    this.countScopeOptions = countScopeOptionsTemp;
    // 统计范围的-------------------------------------------
    this.projectName = this.$route.query.projectName;
    this.projectId = this.$route.query.projectId;
    this.countScope = this.$route.query.countScope;
    this.init("init");
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
  mounted() {
    this.proAuditInit();
    // this.getDictList("project_phase"); // 项目阶段 project_phase
    // this.getDictList("project_type"); // 项目类型 project_type
    // this.getDictList("serivce_obj_type"); // 服务对象 serivce_obj_type
    this.getPostOptions(); // 职位类型的
    // Vue.prototype.goAuditHandel = this.goAudit()
  },

  methods: {
    showAddOrCancel(row){
      // 显示取消还是 添加
      let showOrCancel = true; // 默认展示 添加按钮
      if(this.projectTable.projectUserList[this.nowIndex].userId==row.userId){
        showOrCancel =false
      }
      return showOrCancel
    },
    // 顶部的点击提交审核
    goAudit(){
      // 此处提交的是 全量数据
           // 下面是塞入数据
      this.formData.projectUserList[this.nowIndex].userId = this.projectTable.projectUserList[this.nowIndex].userId
      this.formData.projectUserList[this.nowIndex].userName = this.projectTable.projectUserList[this.nowIndex].userName
                let parame = {
            ...this.formData,
          };
          updateProjectUserAddEdit(parame).then((res) => {
            let { code, msg } = res;
            this.$message.success(msg);
            if (+code == 200) {
              // 添加成功 只会去查询 审核的方法
              this.auditStatus = "1"; // 初始化 显示 待审核
              this.proAuditInit();
              this.init("init")
              this.addEditFormData = {};
              this.addEditUserActive = false;
              this.detailUserActive = false;
              this.recommendUserActive = false;
            }
          });
    },
    // 顶部的点击取消
    cancelSave() {
      this.$confirm(`是否清空待审批内容?`, "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$router.go(0);
        })
        .catch(() => {});
    },
    delUserToProject(row){
      // 取消当前的人 
      console.log(row.userId,row.nickName);
      this.addEditFormData.projectUserList[0].userId = ""
      this.addEditFormData.projectUserList[0].userName = ""
      this.$forceUpdate()

      this.projectTable.projectUserList[this.nowIndex].userId =  ""
      this.projectTable.projectUserList[this.nowIndex].userName =  ""
      this.$nextTick(()=>{
        this.$set(this.projectTable.projectUserList[this.nowIndex],'userId', "")
        this.$set(this.projectTable.projectUserList[this.nowIndex],'userName', "")
      })
      this.$forceUpdate()

      //  以上是展示
                 // 下面是塞入数据
      this.formData.projectUserList[this.nowIndex].userId =  ""
      this.formData.projectUserList[this.nowIndex].userName =  ""
      this.$forceUpdate()
      this.isUpdateActive=true // 我删除了用户
    },
    addUserToProject(row) {
      //点击添加人员到 资源配置中 去
      // projectTable.projectUserList
      console.log(row.userId,row.nickName);
      this.addEditFormData.projectUserList[0].userId = row.userId
      this.addEditFormData.projectUserList[0].userName = row.nickName
      this.$forceUpdate()

      this.projectTable.projectUserList[this.nowIndex].userId = row.userId
      this.projectTable.projectUserList[this.nowIndex].userName = row.nickName
      this.$nextTick(()=>{
        this.$set(this.projectTable.projectUserList[this.nowIndex],'userId',row.userId)
        this.$set(this.projectTable.projectUserList[this.nowIndex],'userName',row.nickName)
      })
      this.$forceUpdate()

      //  以上是展示
                 // 下面是塞入数据
      this.formData.projectUserList[this.nowIndex].userId = row.userId
      this.formData.projectUserList[this.nowIndex].userName = row.nickName
      this.$forceUpdate()
      this.isUpdateActive=true // 我添加了用户
    },

    tableRowClassName({ row, rowIndex }) {
      // 存储下标
      row.index = rowIndex;
    },
    showRowDetail(row) {
      // 点击单行 显示信息
      //  console.log(row.index,this.projectTable.projectUserList.length-1);  // 当前点击的行数据
      //  console.log(row.index);   // 当前点击的行的索引值
      if (row.index == this.projectTable.projectUserList.length - 1) {
        // 防止点击到 总计哪一行
        return false;
      }
      this.nowIndex = row.index // 存储刚刚点击是那一条
      this.detailUserActive = true;
      this.addEditUserActive = false;
      // 我是修改
      this.addEditFormData = {};
      let params = {
        id: row.id,
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
            this.formData.projectService == 1 ? res.data.costIn : res.data.costOut;
          res.data.projectUserScheduleList.map((item) => {
            item.day = item.weekDay;
          });
          let oneUser = this.deepClone(res.data);
          // 修改类型（1.新增,2.删除,3.修改原数据）
          oneUser.updateType = 3;
          oneUser.startEndTime = [oneUser.startTime, oneUser.endTime];

          this.addEditFormData.projectUserList.push(oneUser);
          this.formData.projectUserList[row.index] = oneUser //因为后台对于生成的三级数据没有id
          // console.log(oneUser);
          this.changeChildDateArea(oneUser);
          this.getRecommendUserList(row.index, row);
          // }
          // // 删除成功 只会去查询 审核的方法
          // this.auditStatus = "1"; // 初始化 显示 待审核
          // this.proAuditInit();
        }
      });
    },
    /* 查询所有职位下拉*/
    getPostOptions() {
      getPostOptions().then((res) => {
        res.data.map((item) => {
          // regionName
          item.postIdOptions = `${item.regionName}-${item.postName}-${item.postLevel}`;

          // item.disabled = false;
        });
        this.postIdOptions = res.data; // 需要根据已经选择的人 来过滤
      });
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
        this.addEditFormData.projectUserList[fatherIndex].projectUserScheduleList[
          myIndex
        ].workDay = ((number / 100) * weekDay).toFixed(2); //人日==> 现有百分比除以100 乘以天数
        this.addEditFormData.projectUserList[fatherIndex].projectUserScheduleList[
          myIndex
        ].workTime = ((number / 100) * 8).toFixed(2); //每日工时==> 现有百分比除以100 乘以 8
      } else {
        this.addEditFormData.projectUserList[fatherIndex].projectUserScheduleList[
          myIndex
        ].workDay = 0;
        this.addEditFormData.projectUserList[fatherIndex].projectUserScheduleList[
          myIndex
        ].workTime = 0;
      }
      /*----------------以上是 配置安排的具体计算-------------------*/
      // 循环 取出每周的工作时长
      let totalTime = 0,
        totalDay = 0;
      this.addEditFormData.projectUserList[fatherIndex].projectUserScheduleList.map(
        (item, i) => {
          // 其他的没有修改的 直接 拿天数累加
          totalDay += parseFloat(item.workDay); // 总天数 == 每周人日累计
          totalTime += parseFloat(item.workDay * 8); // 总时长 == 每周人日*8
        }
      );
      this.addEditFormData.projectUserList[fatherIndex].workTime = totalTime;
      this.addEditFormData.projectUserList[fatherIndex].workDay = totalDay;
      const tempWorkDay = this.addEditFormData.projectUserList[fatherIndex].workDayTemp; // 之前的总天数
      // console.log(tempWorkDay);
      if (totalDay === 0) {
        // 防止憨批选到 节假日
        this.addEditFormData.projectUserList[fatherIndex].planLoad = 0;
      } else {
        this.addEditFormData.projectUserList[fatherIndex].planLoad = (
          (totalDay / tempWorkDay) *
          100
        ).toFixed(2); //计划负荷 == 实际人日/计划的人日 *100%
      }
      this.addEditFormData.projectUserList[fatherIndex].expectedCost = (
        totalDay * this.addEditFormData.projectUserList[fatherIndex].costNum
      ).toFixed(2); /**预计成本*/

      /*----------------以上是 总计的安排的具体计算-------------------*/
    },
    // 选择职位之后的逻辑
    getPostId(postId, index) {
      // console.log(postId, index);

      // 选择职位之后
      this.postIdOptions.map((item) => {
        if (postId == item.postId) {
          // 选择 职位之后，拿到成本
          if (this.formData.projectService == 2) {
            //对外
            this.addEditFormData.projectUserList[index].costNum = item.costOut;
          } else {
            // 对内
            this.addEditFormData.projectUserList[index].costNum = item.costIn;
          }
        }
      });
      // 需要更新一下  人选推荐的接口
        let params = {
          postId: postId, //职位id
          projectService: this.formData.projectService, //服务对象
          workDay: this.addEditFormData.projectUserList[index].workDay, // 总人日
        };
        queryUserByPostId(params).then((res) => {
          this.recommendUserTableData = res.data;
        });
      // 拿到成本之后，自动计算出 下面的期间负荷
      let dates = this.addEditFormData.projectUserList[index].startEndTime;
      this.constAll(dates, index);
    },
    // 动态生成 表头样式
    headerClassName(row) {
      // console.log(row.column)
      // if(row.column.property=='total')
      return "proUserList";
    },
    // 动态生成 表头样式
    headerUserClassName(row) {
      // console.log(row.column)                                                                                                                                                                                                                                                          
      // if(row.column.property=='total')
      return "recommendHeader";
    },
    // 初始化 新增成员
    initaddEditUserList() {
      // this.formData.projectUserList =[]
      this.detailUserActive = false;
      this.addEditUserActive = true;
      // 我是新增
      this.addEditFormData = {};
      this.addEditFormData = this.deepClone(this.formData); // 填充新增的
      this.addEditFormData.projectUserList = []; // 先清空，只留一个空数组
      let oneUser = this.deepClone(this.projectUserList);
      oneUser.startTime = this.formData.projectStartTime;
      oneUser.endTime = this.formData.projectEndTime;
      oneUser.startEndTime = [
        this.formData.projectStartTime,
        this.formData.projectEndTime,
      ];
      oneUser.updateType = 1;
      this.addEditFormData.projectUserList.push(oneUser);
      this.$forceUpdate();
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
    // 修改一个 项目成员的 工作计划
    updateProjectOne(index, row) {
      this.detailUserActive = false;
      this.addEditUserActive = true;
      this.nowIndex = index // 存储刚刚点击是那一条

      // 我是修改
      this.addEditFormData = {};
      let params = {
        id: row.id,
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
            this.formData.projectService == 1 ? res.data.costIn : res.data.costOut;
          res.data.projectUserScheduleList.map((item) => {
            item.day = item.weekDay;
          });
          let oneUser = this.deepClone(res.data);
          // 修改类型（1.新增,2.删除,3.修改原数据）
          oneUser.updateType = 3;
          oneUser.startEndTime = [oneUser.startTime, oneUser.endTime];

          this.addEditFormData.projectUserList.push(oneUser);
          this.formData.projectUserList[index] = oneUser //因为后台对于生成的三级数据没有id
          // console.log(oneUser);
          this.changeChildDateArea(oneUser);
          this.getRecommendUserList(index, row);
          // }
          // // 删除成功 只会去查询 审核的方法
          // this.auditStatus = "1"; // 初始化 显示 待审核
          // this.proAuditInit();
        }
      });
    },
    // 拿到 并 显示 推荐人选
    getRecommendUserList(index, row) {
      this.recommendUserActive = true;
      let params = {
        postId: row.postId, //职位id
        projectService: this.formData.projectService, //服务对象
        workDay: row.workDay, // 总人日
      };
      queryUserByPostId(params).then((res) => {
        this.recommendUserTableData = res.data;
      });
    },
    // 删除一个 项目成员
    delProjectOne(index, row) {
      console.log(row);
      this.$confirm(`您确定要删除资源配置：(${row.postName}) 吗?`, "温馨提示", {
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
          this.addEditUserActive = false;
          this.detailUserActive = false;
          this.recommendUserActive=false
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
    // 项目成员的添加的 保存 提交方法 暂存
    addUserListHandel(index) {
      this.$refs["addEditForm"].validate((valid) => {
        if (!valid) return;
        // TODO 提交表单
        if (valid) {
          // 此处修改为 暂存 , 数据丢进去即可
          this.formData.projectUserList[this.nowIndex].userId = this.addEditFormData.projectUserList[0].userId
          this.formData.projectUserList[this.nowIndex].userName = this.addEditFormData.projectUserList[0].userName
          this.formData.projectUserList[this.nowIndex] = this.deepClone(this.addEditFormData.projectUserList[0])
          this.isUpdateActive=true // 我修改了 并且暂存了
          this.$message.success("暂存成功！");
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

    /*根据起始和结束 生成下面表格*/
    getTimeArea(dates, index) {
      this.constAll(dates, index);
    },
    // 公共计算方法
    constAll(dates, index) {
      console.log(dates, index);
      let params = {
        startDate: dates[0],
        endDate: dates[1],
      };
      getTimeProcess(params).then((res) => {
        this.addEditFormData.projectUserList[index].workDay = res.data.day; // 总共多少人日
        this.addEditFormData.projectUserList[index].workTime = res.data.day * 8; // 总共多少工时
        if (res.data.day === 0) {
          this.addEditFormData.projectUserList[index].planLoad = 0;
        } else {
          this.addEditFormData.projectUserList[index].planLoad = (
            ((8 * res.data.day) / (res.data.day * 8)) *
            100
          ).toFixed(2); // 计划负荷
        }
        this.addEditFormData.projectUserList[index].expectedCost = ( // 预计成本
          res.data.day * this.addEditFormData.projectUserList[index].costNum
        ).toFixed(2);
        /*---------第一行的数据-----------------*/

        this.addEditFormData.projectUserList[index].workDayTemp = res.data.day; // 临时存一下后面有用
        this.addEditFormData.projectUserList[index].startTime = dates[0]; // 开始时间 留给后面的传值
        this.addEditFormData.projectUserList[index].endTime = dates[1]; // 结束时间 留给后面的传值
        res.data.list.map((item) => {
          item.startTime = item.startDate;
          item.endTime = item.endDate;
          item.workTime = item.weekDay != 0 ? "8" : 0; // 内部的每周时长
          item.workDay = item.weekDay; // 内部的每周人日
          item.planLoad = (((item.weekDay * 8) / (item.weekDay * 8)) * 100 || 0).toFixed(
            2
          );
        });
        this.addEditFormData.projectUserList[index].projectUserScheduleList =
          res.data.list; // 此人的 每周安排
      });
    },

    //*--------以上是添加和编辑 项目成员的方法----------------------------------------------------------------------
    // 设置生成 列的背景色
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (column.width != 120 && column.width != 100) {
        return "background:	#f4f4ff;";
      }
    },
    goManagerPage() {
      const obj = { path: "/projectManager/proManager" };
      this.$tab.closeOpenPage(obj);
    },
    goEditPage() {
      // :to="'?projectId=' + projectId+'&countScope='+countScope"
      const obj = {
        path: "/projectManager/proManager-auth/proEdit",
        query: { projectId: this.projectId, countScope: this.countScope },
      };
      this.$tab.closeOpenPage(obj);
    },
    stopProject() {
      // 终止项目
      this.$confirm(
        `此操作将${this.projectTable.projectStatus == 4 ? "开启" : "终止"}项目：${
          this.projectName
        }, 是否继续?`,
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
    // 点击取消  删除  提交
    updateAuditPro(rowData, type) {
      let params = {
        projectId: rowData.projectId,
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
        // 因为现在逻辑控制 导致每次审核记录只存储一条。
        // 如果多条，咱就拼接成一条
        // 只针对于 待审批

        let newArr = [];
        if (res.data.length > 1&&this.auditStatus==1) {
          let updateContentTemp = ""; //
          // 当前项目的审核记录 大于1  才需要拼接
          res.data.map((item) => {
            updateContentTemp += item.updateContent + "\n\r";
          });
          newArr = res.data.slice(0, 1);
          newArr[0].updateContent = updateContentTemp;
          this.projectAuditTable = newArr;
        }else{
          this.projectAuditTable =res.data
        }
      });
    },
    init(type) {
      if (type == "init") {
        // 初始化传 项目截止时间
        this.checkFormData.startTime = this.$route.query.startTime;
        this.checkFormData.endTime = this.$route.query.endTime;
        this.checkFormData.projectId = this.$route.query.projectId;
        this.checkFormData.countScope = parseInt(this.$route.query.countScope);
      } else {
        // search 选择时间 或者范围的时候
        this.checkFormData.startTime = this.checkFormData.projectStartEndTime
          ? this.checkFormData.projectStartEndTime[0]
          : "";
        this.checkFormData.endTime = this.checkFormData.projectStartEndTime
          ? this.checkFormData.projectStartEndTime[1]
          : "";
        this.checkFormData.projectId = this.$route.query.projectId;
        // this.checkFormData.countScope = this.checkFormData.totalArea;
      }
      queryInfoById(this.checkFormData).then((res) => {
         //isShow;  //是否显示按钮 1 不显示，0显示
        this.isShowActive = res.data.isShow
        this.projectTable = res.data;
        this.projectTable.projectUserList = res.data.projectUserList;
        // 拼接列名
        this.monthArrTemp = [];
        // 动态生成 合计天数周数 日期区间
        if (res.data.projectUserList.length > 0) {
          res.data.projectUserList[0].projectUserScheduleList.forEach((v, i) => {
            // console.log(v); //2022年1月 24周  01/01-01/07

            let startTime = moment(v.startTime, "YYYY-MM-DD").format("YYYY/MM/DD");
            let endTime = moment(v.endTime, "YYYY-MM-DD").format("YYYY/MM/DD");

            // console.log(startTime,'dddddd')
            let pp = `${v.startTime.substring(0, 4)}年${v.weekMonth}月 ${
              v.week
            }周       ${startTime.substring(5) + "-" + endTime.substring(5)}`;
            //  console.log(pp,'ddd')
            this.monthArrTemp.push(pp.toString());
            //  this.monthArrTemp.push((v.weekMonth +'月- ' +v.week +'周 (' +v.startTime + "-" + v.endTime +')').toString())
          });
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
        }

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
    // 设置生成 列的背景色
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (column.width != 120 && column.width != 100) {
        return "background:	#f4f4ff;";
      }
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
  beforeRouteLeave(to, from, next) {
      if(this.isUpdateActive){ // 修改了 就提示
              this.$confirm(`当前内容尚未提交审批?`, "温馨提示", {
                      confirmButtonText: "立即审批",
                      cancelButtonText: "取消",
                      type: "warning",
                    })
                      .then(() => {
                        this.goAudit()
                      })
                      .catch(() => {});
            }else{ // 没修改直接跳转
              next()
            }
},

  destroyed() {
      if(this.isUpdateActive){ // 修改了 就提示
        this.$confirm(`当前内容尚未提交审批?`, "温馨提示", {
                confirmButtonText: "立即审批",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  this.goAudit()
                })
                .catch(() => {});
      }
   }
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
.zhanwei{
  border: 1px transparent solid;
}
</style>
 
<style scoped>
.UserLine /deep/.el-form-item {
  margin-bottom: 2px;
}
.myAuditTable /deep/  .cell {
  white-space: pre-wrap;   /*这是重点。文本换行*/
}
.proUserList {
  height: 20px !important;
  padding: 2px 0 !important;
}
</style>
<style lang="scss">
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
.checkUser {
    // border: 1px #409eff solid;
    text-align: center;
    height: 23px;
    line-height: 22px;
    color: #409eff;
    font-weight: bold;
    border-radius: 2px;
    margin-top: 6px;
    text-align: left;
}

.containers {
  thead > :first-child .is-leaf {
    background: #e8e8f4 !important;
  }

  thead > :first-child .recommendHeader {
    background: #5a7db9 !important;
    height: 30px;
    padding: 5px 0px;
    color: white !important;
  }

  .el-form-item__content {
    word-break: break-word !important;
  }
  .myTable .el-table__body-wrapper {
    margin-top: 0px;
    z-index: 2;
  }
  .myTable .el-table__fixed {
    // z-index: 5;
    // bottom: 0px !important;
    margin-top: 2px;
  }
  // .myTable .el-table__fixed-right {
  //   // z-index: 5;
  //   bottom: 0px !important;
  // }
  // .myTable .el-table__fixed .el-table__fixed-body-wrapper {
  //   padding: 5px 0;
  // }
  // .myTable .el-table__fixed-right .el-table__fixed-body-wrapper {
  //   padding: 5px 0; 1
  // }

  .ft18 {
    font-size: 18px;
  }
}
</style>
