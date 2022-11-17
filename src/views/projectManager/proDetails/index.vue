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
          class="rightLink" v-show="isProjectByUser(formData)"
        >
        <!-- v-show="isProjectByUser(formData) || isJurisdiction('admin')" -->
          <span
            v-hasPermi="['projectManager:proManager:handle']"
            @click="goEditPage"
            style="cursor: pointer"
            v-show="isShowActive == 0 && !isUpdateActive"
            class="color2"
          >
            编辑 |</span
          >

          <span
            v-hasPermi="['projectManager:proManager:handle']"
            @click="stopProject"
            style="cursor: pointer"
            v-show="isShowActive == 0 && !isUpdateActive"
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
            <el-form-item label="关联机会" prop="projectChance">
              {{ formData.projectChanceName }}
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
             <el-form-item label="项目组" prop="projectGroupName">
              {{ formData.projectGroupName }}
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="TB项目ID" prop="tbProjectId">
              {{ formData.tbProjectId }}
            </el-form-item>
          </el-col>
        </el-row>
         <el-row>
          <el-col :span="7" :offset="1">
            <el-form-item label="缺陷管理ID" prop="bugId">
              {{ formData.bugId }}
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
            <div v-show="isShowActive == 0">
              <el-button
                v-show="isProjectByUser(formData) || isJurisdiction('admin')"
                v-if=""
                size="mini"
                type="text"
                style="margin-top: 4px"
                @click="initaddEditUserList"
                >+ 资源配置</el-button
              >
            </div>
          </el-col>
          <el-col :span="11" :offset="5">
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
          <el-col :span="4" style="text-align: right; padding-top: 3px">
            <el-button
              size="mini"
              type="primary"
              v-show="isShowActive == 0 && isUpdateActive"
              @click="goAudit"
              >提交审核</el-button
            >
            <el-button
              size="mini"
              type="default"
              v-show="isShowActive == 0 && isUpdateActive"
              @click="cancelSave"
              >取消</el-button
            >
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
        :row-style="rowStyle"
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
            <span :class="[scope.row.updateType==1?'isNew':'']">{{scope.row.updateType}}</span>
            <span :class="[scope.row.userName == '无' ? '' : 'priority3']">{{
              scope.row.userName ? scope.row.userName : "无"
            }}</span>
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
          v-if="isProjectByUser(formData) && isJurisdiction('projectManager:proManager:handle')"
        >
          <!-- v-if="isProjectByUser(formData) || isJurisdiction('admin')"  // 暂时注释掉 是否为项目拥有者和超管 -->
          <template slot-scope="scope">
            <!-- @click.native.prevent="detailProject(scope.$index, scope.row)" -->
            <el-button
              v-show="
                scope.$index != projectTable.projectUserList.length - 1 &&
                isShowActive == 0
              "
              type="text"
              size="small"
              @click.native.stop="updateProjectOne(scope.$index, scope.row)"
            >
              修改
            </el-button>
            <el-button
              v-show="
                scope.$index != projectTable.projectUserList.length - 1 &&
                isShowActive == 0
              "
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
        ref="defaultForm"
        :model="addEditFormData"
        :rules="rules"
        size="medium"
        label-width="130px"
      >
        <div
          class="UserLine"
          v-for="(addUserList, addUserListindex) in addEditFormData.projectUserList"
        >
                <el-row>
            <el-col :span="5">
              <el-form-item
                label="区域："
              >
               <div class="colText2">
                  <span>
                    {{ addUserList.regionName }}
                  </span>
                </div>

              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item
                label="职位类型："
              >
              <div class="colText2">
                  <span>
                    {{ addUserList.postTypeName }}
                  </span>
                </div>

              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item
                label="职位名称："
              >
               <div class="colText2">
                  <span>
                    {{ addUserList.postName }}
                  </span>
                </div>

              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item
                label="等级："
              >
               <div class="colText2">
                  <span>
                    {{ addUserList.postLevelName }}
                  </span>
                </div>

              </el-form-item>
            </el-col>
            <el-col :span="4">
              <!-- <el-form-item label="">
                <el-button
                  type="primary"
                  size="mini"
                  @click="DelConfigList(addUserListindex)"
                >
                  删除
                </el-button>
              </el-form-item> -->
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item
                label="技能需求："
              >
               <div class="colText2">
                  <span v-for="skill in addUserList.skillList" :class="['skillBox','skill'+skill.cssClass]">
                    {{ skill.skillName }}
                  </span>
                </div>
              </el-form-item>
            </el-col>
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
        label-width="130px"
      >
        <div
          v-for="(addUserList, addUserListindex) in addEditFormData.projectUserList"
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
                  :style="{ width: '100%' }"
                  @change="(dates) => editNext('postNameId', dates, addUserListindex)"
                >
                  <el-option
                    v-for="(dict, index) in postNameIdOptions"
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
                  :disabled="addUserList.postLevelIdActive"
                  :style="{ width: '100%' }"
                  @change="(dates) => editNext('postLevelId', dates, addUserListindex)"
                >
                  <el-option
                    v-for="(dict, index) in postLevelIdOptions"
                    :key="dict.postLevelId"
                    :label="dict.postLevelName"
                    :value="dict.postLevelId"
                    :disabled="dict.disabled"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <!-- <el-form-item label="">
                <el-button
                  type="primary"
                  size="mini"
                  @click="DelConfigList(addUserListindex)"
                >
                  删除
                </el-button>
              </el-form-item> -->
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
                  @change="changeTextColor($event, 'mySkillIdList',addUserListindex)"
                  ref="mySkillIdList"
                 
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
            <el-col :span="3" :offset="3">

                  <div class="colText3" v-show="resouceBtnActive">
                    <el-button size="mini"  @click="addUserListHandel(addUserListindex)" :disabled="addUserActive" type="primary" >暂存</el-button>
                    <el-button size="mini" @click="DelUserList(addUserList, addUserListindex)" type="error" >取消</el-button>
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
        <el-table-column prop="postName" label="职位"></el-table-column>
        <el-table-column prop="postLevelName" label="等级"></el-table-column>
        <el-table-column prop="skillList" label="工作技能">
            <template slot-scope="scope">
            <div v-for="(item, i) in scope.row.skillList">
              <span :class="['skillBox','skill' + item.cssClass]">{{ item.skillName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="freeLoad" label="空闲负荷"></el-table-column>
        <el-table-column prop="price" label="单价"></el-table-column>
        <el-table-column prop="allPrice" label="总价"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div v-show="isShowActive == 0">
              <!-- 1 不显示 有审核记录，0显示  没有审核记录 -->
              <el-button
                type="text"
                size="mini"
                v-if="scope.row.showOrCancel == 1 && resouceBtnActive"
              >
                <span class="color2" @click="addUserToProject(scope.row, scope.index)"
                  >添加
                </span>
              </el-button>
              <el-button
                type="text"
                size="mini"
                v-if="scope.row.showOrCancel == 2 && resouceBtnActive"
              >
                <span
                  class="color1"
                  @click="delUserToProject(scope.row, scope.index) && resouceBtnActive"
                  >取消
                </span>
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
      <el-table
        :data="projectAuditTable"
        border
        style="width: 100%"
        class="myAuditTable"
        max-height="650"
      >
        <el-table-column prop="applyDate" label="申请日期" width="150"> </el-table-column>
        <el-table-column prop="applyUserName" label="申请人" width="150">
        </el-table-column>
        <el-table-column prop="relatePeople" label="涉及对象" width="250">
           <template slot-scope="scope">
            <div v-html="scope.row.relatePeople"></div>
          </template>
        </el-table-column>
        <el-table-column prop="updateScopeName" label="变更事项" width="150">
          <template slot-scope="scope">
            <div v-html="scope.row.updateScopeName"></div>
          </template>
        </el-table-column>
        <el-table-column prop="updateContent" label="修改内容">
           <template slot-scope="scope">
            <div v-html="scope.row.updateContent"></div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="150">
          <template slot-scope="scope">
            {{ scope.row.status | toStatus }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" >
          <template slot-scope="scope">
            <!-- @click.native.prevent="detailProject(scope.$index, scope.row)" -->
            <!-- 他必须是项目主管和项目负责人 才可以点击取消 -->
            <div v-show="auditStatus == 1">
              <el-button
                type="text"
                size="small"
                v-show="isProjectByUser(formData) && isJurisdiction('projectManager:proManager:handle')"
                @click="updateAuditPro(scope.row, '4')"
                ><span class="color1"> 取消 </span></el-button
              >
              <el-button
                type="text"
                size="small"
                @click="updateAuditPro(scope.row, '2')"
                v-show="isJurisdiction('projectManager:proManager:modify')"
                ><span class="color2"> 通过 </span></el-button
              >
              <el-button
                type="text"
                size="small"
                @click="updateAuditPro(scope.row, '3')"
                v-show="isJurisdiction('projectManager:proManager:modify')"
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
  getLevelCostNum,
  getPostName,
  getPostOptions,
} from "@/api/proManager/proManager";
import Vue from "vue";
export default {
  name: "ProDetail",
  components: {},
  props: {},
  data: () => ({
    addUserActive:false, // 新增情况下，点击暂存禁用
    id: "",
    monthArrTemp: [],
     /*------------------------*/
      techniqueOptions: [], // 技能需求
      regionOptions: [], // 区域
      postTypeOptions: [], // 职位类型
      postNameIdOptions: [], // 职位名称
      postLevelIdOptions: [], // 职位等级
      /*------------------------*/
    userOptions: [],
    addEditUserActive: false, // 添加的资源配置 编辑的资源配置
    detailUserActive: false, //  默认是详情页 不可以编辑
    delBtn: true,
    rules: {
      projectUserListAllStartEndTime: [
        {
          required: true,
          message: "请选择配置安排",
          trigger: "change",
        },
      ],
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
        // addUserListSkillIdList: [
        //   {
        //     required: true,
        //     message: "请选择技能需求!",
        //     trigger: "change",
        //   },
        // ],
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
    skillList:[{
    "cssClass": "color1",
    "skillId": 48,
    "skillName": "web前端1"
},
{
    "cssClass": "color2",
    "skillId": 48,
    "skillName": "web前端2"
},
{
    "cssClass": "color3",
    "skillId": 48,
    "skillName": "web前端3"
},
{
    "cssClass": "color4",
    "skillId": 48,
    "skillName": "web前端4"
}],
    // 新增编辑的初始化 数据结构集合
    addEditFormData: {},
    resouceBtnActive: true, // 是否展示 暂存和取消

    // 详情页面显示的
    formData: {
      priority: 3 /*优先级（1.最高，2.高，3.普通，4.较低）*/,
      projectChance: "" /* 关联机会*/,
      projectCode: "" /* 项目编号*/,
      projectEndTime: "" /* 项目结束时间*/,
      projectGitUrl: "", // 项目git 地址
      projectGroupId: "", // 项目组
      projectName: "" /* 项目名称*/,
      projectService: "" /* 服务对象*/,
      projectStage: "" /* 项目阶段*/,
      projectStartTime: "" /* 项目开始时间*/,
      projectTimeArea: ["", ""],
      projectType: "" /* 项目类型*/,
      projectUserId: "" /* 项目负责人*/,
      projectUserList: [] /* 项目成员列表*/,
      tbProjectId:'',
    },
    recommendUserActive: false, // 是否展示人选推荐
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
    nowIndex: 0, // 记录当前修改的那一条职位记录 资源
    isShowActive: 1, //isShow;  //是否显示按钮 1 不显示，0显示 标识是否有审核记录在
    isUpdateActive: false, //是否点击了 添加  和暂存 的内容
    nowAction: "", // 存储他是新增还是编辑
    holdUserList:[],// 解决 添加资源的时候，影响到项目资源配置
  }),
  computed: {},
  watch: {},

  created() {
     let scopeOptions = []
    const all_permission = "*:*:*"; // 我是超管
    const options = [
      { permi: 'projectManager:proManager:viewAllPro', label: '全部', value: 1 },
      { permi: 'projectManager:proManager:viewMyPro', label: '仅我负责', value: 2 },
      { permi: 'projectManager:proManager:viewMemberPro', label: '仅部门成员', value: 3 },
      { permi: '*:*:*', label: '全部', value: 1 }
    ]
    options.forEach(v1 => {
      this.$store.getters.permissions.forEach(v2 => {
        if (v1.permi === v2) {
          scopeOptions.push(v1)
        }
      })
    })
    console.log(scopeOptions);
    this.countScopeOptions = scopeOptions
    console.log(scopeOptions);
    if (scopeOptions.length) {
      this.checkFormData.countScope = parseInt(scopeOptions[0].value)
    }
    // 额外的判断 页面初始化 判断用户的角色  isJurisdiction 判断当前的值是否存在 返回true or false
    // 部门主管 deptdirector  3
    // 项目主管 projectdirector 2
    // 项目监管 管理员 projectsupervision || admin ==>  1
 
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
    this.getDictList("project_phase"); // 项目阶段 project_phase
    this.getDictList("project_type"); // 项目类型 project_type
    // 二期的
    this.getDictList("region"); //区域
    this.getDictList("post_type"); //职位类型
    this.getDictList("skill_type"); // 技能 technique
  },

  methods: {
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
      let parame = {}; // 入参
       
      switch (who) {
        case "region": // 选择区域
          this.addEditFormData.projectUserList[index].postTypeActive = false; // 初始化展示下一个
          // this.formData.projectUserList[index].regionId=undefined // 区域
          this.addEditFormData.projectUserList[index].postTypeId = ""; // 职位类型
          this.addEditFormData.projectUserList[index].postNameId = ""; // 职位名称
          this.addEditFormData.projectUserList[index].postLevelId = ""; // 等级
          this.addEditFormData.projectUserList[index].expectedCost = "--"; //// 预计成本
          this.postNameIdOptions = []; // 清空下拉
          this.postLevelIdOptions = []; // 清空下拉
          break;
        case "postType": // 选择 职位类型
          this.addEditFormData.projectUserList[index].postNameIdActive = false; // 初始化展示下一个
          // this.addEditFormData.projectUserList[index].regionId="" // 区域
          // this.addEditFormData.projectUserList[index].postTypeId="" // 职位类型
          this.addEditFormData.projectUserList[index].postNameId = ""; // 职位名称
          this.addEditFormData.projectUserList[index].postLevelId = ""; // 等级
          this.addEditFormData.projectUserList[index].expectedCost = "--"; //// 预计成本
          this.postNameIdOptions = [];
          this.postLevelIdOptions = [];
          parame = {
            regionId: this.addEditFormData.projectUserList[index].regionId,
            postTypeId: this.addEditFormData.projectUserList[index].postTypeId,
          };
          getPostName(parame).then((res) => {
            this.postNameIdOptions = res.data;
          });
          break;
        case "postNameId": // 选择职位名称
          this.addEditFormData.projectUserList[index].postLevelIdActive = false; // 初始化展示下一个
          // this.addEditFormData.projectUserList[index].regionId="" // 区域
          // this.addEditFormData.projectUserList[index].postTypeId="" // 职位类型
          // this.addEditFormData.projectUserList[index].postNameId="" // 职位名称
          this.addEditFormData.projectUserList[index].postLevelId = ""; // 等级
          this.addEditFormData.projectUserList[index].expectedCost = "--"; //// 预计成本
          // this.postNameIdOptions= []
          this.postLevelIdOptions = [];
          parame = {
            regionId: this.addEditFormData.projectUserList[index].regionId,
            postTypeId: this.addEditFormData.projectUserList[index].postTypeId,
            postNameId: this.addEditFormData.projectUserList[index].postNameId,
          };
          getLevelCostNum(parame).then((res) => {
            this.postLevelIdOptions = res.data;
          });
          break;
        case "postLevelId": // 选择职位等级
          this.addEditFormData.projectUserList[index].nextActive = false; // 初始化展示下面的所有
          // 选择 等级之后，拿到成本下拉 根据选择的等级id 拿到成本
          let costNumArry = this.postLevelIdOptions.find((item) => {
            return this.addEditFormData.projectUserList[index].postLevelId == item.postLevelId;
          });
          // 2对外      // 1 对内
          if (costNumArry) {
            if( this.addEditFormData.projectService == 2){
              this.addEditFormData.projectUserList[index].costNum = costNumArry.costOut
            }else{
                this.addEditFormData.projectUserList[index].costNum =costNumArry.costIn;
            }

          } else {
            // 没有拿到成本 查找出来的数据返回的是undefined
            console.log(" 没有拿到成本 查找出来的数据返回的是undefined ---editNext");
          }
          console.log(`你好，我是第（${index})条资源配置，我的成本是 +${this.addEditFormData.projectUserList[index].costNum}`);
          this.constAll(this.addEditFormData.projectUserList[index].startEndTime, index);
          setTimeout(() => {
          this.getRecommendUserHandel(0, this.addEditFormData.projectUserList[0]);
           },500);
          break;
      }
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
             this.getRecommendUserHandel(0, this.addEditFormData.projectUserList[0]);
        }, 800);
      });
    },
    // 顶部的点击提交审核
    goAudit() {
      // 此处提交的是 全量数据
      // 下面是塞入数据
      if(this.projectTable.projectUserList && this.projectTable.projectUserList[this.nowIndex].userId){
        this.formData.projectUserList[
        this.nowIndex
      ].userId = this.projectTable.projectUserList[this.nowIndex].userId;
      this.formData.projectUserList[
        this.nowIndex
      ].userName = this.projectTable.projectUserList[this.nowIndex].userName;
      }
      
      // 提交审核之前 ，处理一下 刚刚添加的资源
      let parame = this.deepClone(this.formData)
      parame.projectUserList.unshift(...this.holdUserList)
      let projectUserListTemp =[]
      parame.projectUserList.map((item,i)=>{
        // 删除没有修改过的 没有新增的 updateType为空的
        if(item.updateType!=null){
          projectUserListTemp.push(item)
        }
      })
      parame.projectUserList=projectUserListTemp
      console.log(parame.projectUserList.length);
      updateProjectUserAddEdit(parame).then((res) => {
        let { code, msg } = res;
        this.$message.success(msg);
        if (+code == 200) {
          // 添加成功 只会去查询 审核的方法
          this.auditStatus = "1"; // 初始化 显示 待审核
          this.proAuditInit();
          this.init("init");
          this.addEditFormData = {};
          this.addEditUserActive = false;
          this.detailUserActive = false;
          this.recommendUserActive = false;
          this.isUpdateActive = false; // 点击了立即审批 就删除编辑状态
        }
      });
    },
    // 顶部的点击取消
    cancelSave() {
      this.$confirm(`当前内容尚未保存，是否退出?`, "温馨提示", {
        confirmButtonText: "退出",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$router.go(0);
        })
        .catch(() => {});
    },
      // 取消当前的人
    delUserToProject(row, index) {
      this.addEditFormData.projectUserList[0].userId = "";
      this.addEditFormData.projectUserList[0].userName = "";
      this.$forceUpdate();

      this.projectTable.projectUserList[this.nowIndex].userId = "";
      this.projectTable.projectUserList[this.nowIndex].userName = "";
      this.$nextTick(() => {
        this.$set(this.projectTable.projectUserList[this.nowIndex], "userId", "");
        this.$set(this.projectTable.projectUserList[this.nowIndex], "userName", "");
      });
      this.$forceUpdate();

      //  以上是展示
      // 下面是塞入数据
      this.formData.projectUserList[this.nowIndex].userId = "";
      this.formData.projectUserList[this.nowIndex].userName = "";
      this.formData.projectUserList[this.nowIndex].updateType = 3;
      this.$forceUpdate();
      this.isUpdateActive = true; // 我删除了用户
      // 点击添加成功后 显示取消按钮
      this.recommendUserTableData.map((item) => {
        item.showOrCancel = 1; // 全部 显示添加
        if (this.projectTable.projectUserList[this.nowIndex].userId === item.userId) {
          item.showOrCancel = 2;
        }
      });
    },
      //点击添加人员到 资源配置中 去
    addUserToProject(row, index) {
      // projectTable.projectUserList projectTable.projectUserList
      this.addEditFormData.projectUserList[0].userId = row.userId;
      this.addEditFormData.projectUserList[0].userName = row.nickName;
      this.projectTable.projectUserList[this.nowIndex].userId = row.userId;
      this.projectTable.projectUserList[this.nowIndex].userName = row.nickName;
      // let tempLine = this.deepClone(this.projectTable.projectUserList[this.nowIndex])
      // this.projectTable.splice(this.nowIndex,1,tempLine)
        // this.$set(this.projectTable.projectUserList[this.nowIndex], "userId", row.userId);

      this.$nextTick(() => {
        this.$set(this.projectTable.projectUserList[this.nowIndex], "userId", row.userId);
        this.$set(this.projectTable.projectUserList[this.nowIndex],"userName",row.nickName);
      });


      //  以上是展示
      // 下面是塞入数据 对已有的那条数据进行了操作
      // 修改类型（1.新增,2.删除,3.修改原数据）
      this.formData.projectUserList[this.nowIndex].updateType = 3;
      this.formData.projectUserList[this.nowIndex].userId = row.userId;
      this.formData.projectUserList[this.nowIndex].userName = row.nickName;
      this.$forceUpdate();
      this.isUpdateActive = true; // 我添加了用户
      // 点击添加成功后 显示取消按钮
      this.recommendUserTableData.map((item) => {
        item.showOrCancel = 1; // 全部 显示添加
        if (this.projectTable.projectUserList[this.nowIndex].userId === item.userId) {
          item.showOrCancel = 2;
        }
      });
    },

    tableRowClassName({ row, rowIndex }) {
      // 存储下标
      row.index = rowIndex;
    },
    rowStyle({ row }) {
      if (this.id === row.id) {
        return {
          background: "#f7f4d3",
        };
      }
    },
    del() {
      this.addEditUserActive = false;
    },
    showRowDetail(row) {
      // this.delBtn = false;
      // if (this.id === row.id) return;
      this.id = row.id;

      // 点击单行 显示信息
      //  console.log(row.index,this.projectTable.projectUserList.length-1);  // 当前点击的行数据
      //  console.log(row.index);   // 当前点击的行的索引值
      if (row.index == this.projectTable.projectUserList.length - 1) {
        // 防止点击到 总计哪一行
        return false;
      }
      this.nowIndex = row.index; // 存储刚刚点击是那一条
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
          this.formData.projectUserList[row.index] = oneUser; //因为后台对于生成的三级数据没有id
          this.recommendUserActive = false; //显示人选推荐

          this.getRecommendUserHandel(row.index, row);
          // }
          // // 删除成功 只会去查询 审核的方法
          // this.auditStatus = "1"; // 初始化 显示 待审核
          // this.proAuditInit();
        }
      });
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
        ].workDay = this.autoFixed((number / 100) * weekDay); //人日==> 现有百分比除以100 乘以天数
        this.addEditFormData.projectUserList[fatherIndex].projectUserScheduleList[
          myIndex
        ].workTime = this.autoFixed((number / 100) * 8); //每日工时==> 现有百分比除以100 乘以 8
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
      this.addEditFormData.projectUserList[fatherIndex].workTime = this.autoFixed(
        totalTime
      );
      this.addEditFormData.projectUserList[fatherIndex].workDay = this.autoFixed(
        totalDay
      );
      const tempWorkDay = this.addEditFormData.projectUserList[fatherIndex].workDayTemp; // 之前的总天数
      // console.log(tempWorkDay);
      if (totalDay === 0) {
        // 防止憨批选到 节假日
        this.addEditFormData.projectUserList[fatherIndex].planLoad = 0;
      } else {
        this.addEditFormData.projectUserList[fatherIndex].planLoad = this.autoFixed(
          (totalDay / tempWorkDay) * 100
        ); //计划负荷 == 实际人日/计划的人日 *100%
      }
      this.addEditFormData.projectUserList[fatherIndex].expectedCost = this.autoFixed(
        totalDay * this.addEditFormData.projectUserList[fatherIndex].costNum
      ); /**预计成本*/

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
      // 拿到成本之后，自动计算出 下面的期间负荷
      let dates = this.addEditFormData.projectUserList[index].startEndTime;
      this.constAll(dates, index);

      // 需要更新一下  人选推荐的接口
      setTimeout(() => {
        let params = {
          postId: postId, //职位id
          projectService: this.formData.projectService, //服务对象
          workDay: this.addEditFormData.projectUserList[index].workDay, // 总人日
        };
        console.log(params);
        queryUserByPostId(params).then((res) => {
          res.data.map((item) => {
            item.showOrCancel = 1; // 默认显示  添加
            if (this.projectTable.projectUserList[this.nowIndex].userId == item.userId) {
              // 如果 当前点击的行的userID === 当前行id 就显示取消
              item.showOrCancel = 2;
            }
          });
          this.recommendUserTableData = res.data;
        });
      }, 1300);
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
      // this.delBtn = true;
      // this.formData.projectUserList =[]
      //点资源配置放开暂存按钮
      this.detailUserActive = false;
      this.addEditUserActive = true;
      this.isUpdateActive = false; // 我修改了 并且暂存了
      this.recommendUserActive = false; // 点击添加 人选需要隐藏
      this.nowAction = "add"; // 记录下他是什么
      // if(this.detailUserActive){
      //   this.$refs["addEditForm"].resetFields()
      // }

      // 我是新增
      this.addEditFormData = {
      };
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
      // this.changeChildDateArea(oneUser,index);// 新增的时候 是否控制
      this.$forceUpdate();
        if (this.$refs['addEditForm']) {
          this.$refs['addEditForm'].resetFields();
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
    // 修改一个 项目成员的 工作计划
    updateProjectOne(index, row) {
      this.addUserActive =false;
      // if (this.id === row.id) return; // 此行先点击详情 再点击修改无作用
      this.id = row.id;
      this.delBtn = false;
      this.detailUserActive = false;
      this.addEditUserActive = true;
      this.resouceBtnActive = true; // 隐藏按钮的逻辑
      this.nowIndex = index; // 存储刚刚点击是那一条

      this.nowAction = "update"; // 记录我是修改操作
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
          // res.data.projectUserScheduleList.map((item) => {
          //   item.day = item.weekDay;
          // });
          let oneUser = this.deepClone(res.data);
          // 修改类型（1.新增,2.删除,3.修改原数据）
          oneUser.updateType = 3;
          oneUser.startEndTime = [oneUser.startTime, oneUser.endTime];
          // 填充 职位名称 和 等级的下拉菜单
          let parame = {
            regionId: oneUser.regionId,
            postTypeId: oneUser.postTypeId,
            postNameId: oneUser.postNameId,
          };
          getLevelCostNum(parame).then((res) => {
            this.postLevelIdOptions = res.data;
          });
          getPostName(parame).then((res) => {
            this.postNameIdOptions = res.data;
          });
          // 拿到成本
            let costNumArry = this.postLevelIdOptions.find((item) => {
            return oneUser.postLevelId == item.postLevelId;
          });
          // 2对外      // 1 对内
          if (costNumArry) {
            // console.log(oneUser);
            if( this.formData.projectService == 2){
              oneUser.costNum = costNumArry.costOut
            }else{
                oneUser.costNum =costNumArry.costIn;
            }

          } else {
            // 没有拿到成本 查找出来的数据返回的是undefined
            console.log(" 没有拿到成本 查找出来的数据返回的是undefined ---editNext");
          }
          console.log(`你好，我是第（${index})条资源配置，我的成本是 +${oneUser.costNum}`);
          this.addEditFormData.projectUserList.push(oneUser);
          this.formData.projectUserList[index] = oneUser; //因为后台对于生成的三级数据没有id
          // console.log(JSON.stringify(oneUser));
          this.changeChildDateArea(oneUser,index);
          this.recommendUserActive = true; //显示人选推荐

          this.getRecommendUserHandel(index, row);

          // }
          // // 删除成功 只会去查询 审核的方法
          // this.auditStatus = "1"; // 初始化 显示 待审核
          // this.proAuditInit();
        this.changeTextColor(row.skillIdList, "mySkillIdList");
        }
      });
    },
    // 拿到 并 显示 推荐人选
    getRecommendUserHandel(index, row) {
      console.log(row,index);
      let params = {
        id:row?.id||this.formData.projectUserList[index]?.id||"", //项目配置表主键第二级的主键
        postNameId:row.postNameId,//职位id
        regionId:row.regionId,//区域id
        postTypeId:row.postTypeId,//职位类型id
        postLevelId:row.postLevelId,//职位等级id
        skillIdList:row.skillIdList,//技能id
        startTime:row.startTime,//开始时间
        endTime:row.endTime,//结束时间
        projectService:this.formData.projectService,//服务对象
        workDay:row.workDay,//总人日
      };
      queryUserByPostId(params).then((res) => {
        res.data.map((item) => {
          item.showOrCancel = 1; // 默认显示  添加
          if (this.projectTable.projectUserList[this.nowIndex].userId == item.userId) {
            // 如果 当前点击的行的userID === 当前行id 就显示取消
            item.showOrCancel = 2;
          }
        });
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
          this.recommendUserActive = false;
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
           this.isUpdateActive = true; // 点击了暂存了 立即隐藏编辑 终止 和展示提交审核
          // 需要额外的判断他是 新增的暂存还是修改的暂存
          if (this.nowAction == "add") {
            // 点击暂存 需要立即禁用按钮 测试希望不管他 就先打开
            // this.addUserActive = true;
            console.log(this.addEditFormData.projectUserList[0],'this.addEditFormData.projectUserList[0]')
            // 此处修改为 暂存 , 数据丢进去即可
            let oneUser = this.deepClone(this.addEditFormData.projectUserList[0]);
            oneUser.startTime = this.addEditFormData.projectUserList[index].startTime;
            oneUser.endTime = this.addEditFormData.projectUserList[index].endTime;
            oneUser.startEndTime = this.addEditFormData.projectUserList[index].startEndTime;
            oneUser.userName =""
            // 修改类型（1.新增,2.删除,3.修改原数据）
            oneUser.updateType = 1;

            // this.formData.projectUserList.push(oo);
            this.holdUserList.push(oneUser); // 上面的代码会影响其他的内容
            // 新增代码块  start
            // this.addEditFormData.projectUserList[0].unshift(this.projectTable.projectUserList)
            console.log(oneUser);
            // this.projectTable.projectUserList.unshift(oneUser)
            // this.formData.projectUserList.unshift(oneUser)
            // 新增代码块  end
            this.$forceUpdate();
            this.$message.success("新增暂存成功！");
            // this.$refs["addEditForm"].resetFields()
            console.log("add");
          }
          if (this.nowAction == "update") {
            console.log("update");
            // 此处修改为 暂存 , 数据丢进去即可
            this.formData.projectUserList[
              this.nowIndex
            ].userId = this.addEditFormData.projectUserList[0].userId;
            this.formData.projectUserList[
              this.nowIndex
            ].userName = this.addEditFormData.projectUserList[0].userName;
              // 修改类型（1.新增,2.删除,3.修改原数据）
            this.formData.projectUserList[this.nowIndex].updateType = 3;
            this.formData.projectUserList[this.nowIndex] = this.deepClone(
              this.addEditFormData.projectUserList[0]
            );
            this.$message.success("暂存成功！");
          }
          // this.resouceBtnActive = false; // 隐藏按钮的逻辑
        }
      });
    },
    // 暂存旁边的取消
    DelUserList(row, index) {
      // this.addEditFormData.projectUserList.splice(index, 1);
      // this.addEditFormData = {};
      // this.addEditUserActive = false;
      // this.detailUserActive = false;
      // this.recommendUserActive = false;
      // this.resouceBtnActive = false; // 隐藏按钮的逻辑
      if( this.delBtn){
        this.addEditUserActive=false
      }else{
          this.detailUserActive = true;
          this.addEditUserActive = false;
          this.recommendUserActive = false;// 先给人选给隐藏
          console.log(row);
          this.showRowDetail(row);
      }

    },

    /*根据起始和结束 生成下面表格*/
    // 公共计算方法
    constAll(dates, index) {
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
          this.addEditFormData.projectUserList[index].planLoad = this.autoFixed(
            ((8 * res.data.day) / (res.data.day * 8)) * 100
          ); // 计划负荷
        }
        if (
          this.addEditFormData.projectUserList[index].costNum == null ||
          this.addEditFormData.projectUserList[index].costNum == undefined
        ) {
          this.addEditFormData.projectUserList[index].expectedCost = "--";
        } else {
          this.addEditFormData.projectUserList[index].expectedCost = this.autoFixed(
            // 预计成本
            res.data.day * this.addEditFormData.projectUserList[index].costNum
          );
        }
        /*---------第一行的数据-----------------*/

        this.addEditFormData.projectUserList[index].workDayTemp = res.data.day; // 临时存一下后面有用
        this.addEditFormData.projectUserList[index].startTime = dates[0]; // 开始时间 留给后面的传值
        this.addEditFormData.projectUserList[index].endTime = dates[1]; // 结束时间 留给后面的传值
        res.data.list.map((item) => {
          item.startTime = item.startDate;
          item.endTime = item.endDate;
          item.workTime = item.weekDay != 0 ? "8" : 0; // 内部的每周时长
          item.workDay = item.weekDay; // 内部的每周人日
          item.planLoad = this.autoFixed(
            ((item.weekDay * 8) / (item.weekDay * 8)) * 100 || 0
          );
        });
        this.addEditFormData.projectUserList[index].projectUserScheduleList = res.data.list; // 此人的 每周安排
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
      if (type == 4) {
        this.$confirm(`是否清空待审内容`, "温馨提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let params = {
              projectId: rowData.projectId,
              status: parseInt(type),
            };
            updateAuditProById(params).then((res) => {
              let { msg } = res;
              this.$message.success(msg);
              // this.init("init");
              // this.auditStatus = "1"; // 初始化 显示 待审核
              // this.proAuditInit();
              this.$router.go(0);
            });
          })
          .catch(() => {});
      } else {
        let params = {
          projectId: rowData.projectId,
          status: parseInt(type),
        };
        updateAuditProById(params).then((res) => {
          let { msg } = res;
          this.$message.success(msg);
          // this.init("init");
          // this.auditStatus = "1"; // 初始化 显示 待审核
          // this.proAuditInit();
          this.$router.go(0);
        });
      }
      console.log("刷新");
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
        if (res.data.length > 1 && this.auditStatus == 1) {
          let updateContentTemp = ""; // updateScopeName
          let relatePeopleTemp ="";
          let updateScopeNameTemp =""
          // 当前项目的审核记录 大于1  才需要拼接
          res.data.map((item) => {
            updateContentTemp += `${item.updateContent}`;
            relatePeopleTemp += `${item.relatePeople}`;
            updateScopeNameTemp+=`${item.updateScopeName}`;
            // updateContentTemp += item.updateContent + "\n\r";
          });
          newArr = res.data.slice(0, 1);
          newArr[0].updateContent = updateContentTemp;
          newArr[0].relatePeople = relatePeopleTemp;
          newArr[0].updateScopeName = updateScopeNameTemp;
          this.projectAuditTable = newArr;
        } else {
          this.projectAuditTable = res.data;
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
        this.constAll(this.checkFormData.projectStartEndTime, this.nowIndex);
      }
      queryInfoById(this.checkFormData).then((res) => {
        //isShow;  //是否显示按钮 1 不显示，0显示
        this.isShowActive = res.data.isShow;
        // this.projectTable = res.data;
        if(res.data.projectUserList.length>0){
           this.projectTable.projectUserList = res.data.projectUserList;
        }
        // 拼接列名
        this.monthArrTemp = [];
        // 动态生成 合计天数周数 日期区间
         let params = {
        startDate: this.checkFormData.startTime,
        endDate: this.checkFormData.endTime,
      };
      /**
       * 生成 动态表头
       */
      console.log(this.checkFormData);
      if(this.checkFormData.startTime&&this.checkFormData.endTime){

        getTimeProcess(params).then((res) => {
          res.data.list.map((item,i)=>{
              let pp = `${item.startDate.substring(0, 4)}年
                      ${item.startDate.substring(5, 7)}月
                      ${item.week}周
                      ${item.startDate.substring(5, 7)}/${item.startDate.substring(8)}-
                      ${item.startDate.substring(5, 7)}/${item.endDate.substring(8)}`;
              this.monthArrTemp.push(pp.toString());
          })
        })
      }
        if (res.data.projectUserList.length > 0) {
          res.data.projectUserList.map((item, i) => {
            item.projectUserScheduleList.map((jtem, j) => {
              // 最后一条 不处理
              if (i < res.data.projectUserList.length - 1) {
                jtem.weekTimeArea =
                  jtem.startTime.substring(5) + "-" + jtem.endTime.substring(5);
              }
            });
          });
        }
      //------------------------------
        this.formData = res.data; // 填充详情的
        this.formData.projectTimeArea =
          res.data.projectStartTime + "-" + res.data.projectEndTime;
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
    if (this.isUpdateActive) {
      // 修改了 就提示
      this.$confirm(`当前内容尚未提交审批?`, "温馨提示", {
        confirmButtonText: "立即审批",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.goAudit();
          next();
        })
        .catch(() => {});
    } else {
      // 没修改直接跳转
      next();
    }
  },

  destroyed() {
    // if (this.isUpdateActive) {
    //   // 修改了 就提示
    //   this.$confirm(`当前内容尚未提交审批?`, "温馨提示", {
    //     confirmButtonText: "立即审批",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(() => {
    //       this.goAudit();
    //       next();
    //     })
    //     .catch(() => {});
    // }
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
.zhanwei {
  border: 1px transparent solid;
}
</style>

<style scoped>
.UserLine /deep/.el-form-item {
  margin-bottom: 2px;
}
.myAuditTable /deep/ .cell {
  white-space: pre-wrap; /*这是重点。文本换行*/
}
.proUserList {
  height: 20px !important;
  padding: 2px 0 !important;
}
.myTable /deep/ .el-table__body tr.hover-row > td.el-table__cell,
.myTable /deep/ .el-table__body tr.hover-row.current-row > td.el-table__cell,
 .myTable /deep/ .el-table__body tr.hover-row.el-table__row--striped > td.el-table__cell,
 .myTable /deep/ .el-table__body tr.hover-row.el-table__row--striped.current-row > td.el-table__cell{
  background-color: #f7f4d3;
}

</style>
<style lang="scss">
.isNew{
  background-image: url('../../../assets/images/newIco.png');
    background-position: left top;
    background-repeat: no-repeat;
    background-size: 20px 20px;
    width: 20px;
    height: 20px;
    left: 2px;
    top: 2px;
    display: inline-block;
    position: absolute;
}
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
.skillBox{
padding: 4px 8px;
    border: 1px white solid;
    border-radius: 5px;
    margin-left: 4px;
}
.colText2{
   height: inherit;
  line-height: 150%;
  // background-color: beige;
  // border: 1px red solid;
  margin-top: 8.5px;
  font-size: 13px;
  color: #999;
  text-align: left;
  span {
    color: #333;
    font-weight: bold;
  }
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
