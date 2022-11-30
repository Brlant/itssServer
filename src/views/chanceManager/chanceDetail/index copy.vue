<template>
  <div class="app-container">
    <div class="routerBar">
      <router-link :to="'/chanceManager/chanceList'" class="priority3">
        < 机会详情</router-link
      >
      <div class="rightBox">
        <!-- <router-link class="priority3 ft13" :to="'/chanceManager/chanceEdit'"
          >编辑基本信息</router-link
        > -->
        <a href="javascript:;" class="priority3 ft13" @click="enterChanceEdict"  v-hasPermi="['chanceManage:chance:duty']"
          >编辑基本信息</a
        >
        <span class="priority3 ft13" style="cursor: pointer;" @click="addFollow"  v-hasPermi="['chanceManage:chance:duty']">| 添加跟进记录</span>
        <!-- <router-link class="priority3 ft13" :to="'/chanceManager/addChance'">| 机会详情</router-link> -->
        <!--   转为正式  需要 项目创建权限    ( 项目创建    projectManager:proManager:create   )  -->
        <span v-hasPermi="['projectManager:proManager:create']">
          <span class="priority3 ft13"  style="cursor: pointer;" @click="transformProject" v-hasPermi="['chanceManage:chance:duty']">| 转为正式项目</span>
        </span>
      </div>
    </div>
    <div class="titleBar">机会基础信息</div>
    <div class="whiteBox">
      <el-form ref="elForm" :model="formData" size="medium" label-width="110px">
        <el-row>
          <el-col :span="7" :offset="1">
            <el-form-item label="机会名称：" prop="chanceName">
              {{ formData.chanceName }}
            </el-form-item>
          </el-col>

          <el-col :span="7" :offset="1">
            <el-form-item label="机会状态" prop="chanceStatus">
              {{ formData.chanceStatus | toChanceStatus }}
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="负责人" prop="chanceUserId">
              {{ formData.chanceUserName }}
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
            <el-form-item label="客户：" prop="customer">
              {{ formData.customer }}
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="客户联系人" prop="customerLink">
              {{ formData.customerLink }}
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="联系方式：" prop="tel">
              {{ formData.tel }}
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="客户预算：" prop="budget">
              {{ formData.budget }}
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="成功率：" prop="successRate">
              {{ formData.successRate }}
              <span class="priority4"> &nbsp;&nbsp;&nbsp;&nbsp;%</span>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="预计起始日：" prop="expectStartTime">
              {{ formData.expectStartTime }}
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="预计结束日：" prop="expectEndTime">
              {{ formData.expectEndTime }}
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="预计工时：" prop="expectWork">
              {{ formData.expectWork }}
              <span class="priority4"> &nbsp;&nbsp;&nbsp;&nbsp;人日</span>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="预计报价：" prop="expectOffer">
              {{ formData.expectOffer }}
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="服务对象：" prop="chanceService">
              {{ formData.chanceService | toProjectService }}
            </el-form-item>
          </el-col>
          <el-col :span="21" :offset="1">
            <el-form-item label="备注：" prop="remark">
              {{ formData.remark }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="toggleBar">
      <!-- 资源配置和跟进记录的切换 -->
      <template v-for="(item, i) in BarList">
        <span :class="[nowActive == i ? 'nowActive' : '']" @click="toggleWho(i)"  v-hasPermi="['chanceManage:chance:duty']">
          {{ item }}
        </span>
      </template>
      <div class="rightBox">
        <el-button
          size="mini"
          v-show="nowActive == 0"
          @click="addConfigListHandel"  v-hasPermi="['chanceManage:chance:duty']"
          type="primary"
          >+ 添加配置</el-button
        >
      </div>
    </div>
    <!-- 资源配置表格  nowActive 0 => 显示资源配置-->
    <div class="whiteBox mmTable gaoliang" v-show="nowActive == 0" style="padding: 1%">
      <el-table
        :data="tableData"
        class="myTable"
        border
        style="width: 100%"
        max-height="650"
        :row-class-name="tableRowClassName"
        @row-click="showRowDetail"
        :row-style="rowStyle"
      >
        <el-table-column prop="postName" label="职位" width="120"></el-table-column>
        <el-table-column prop="regionName" label="区域" width="120"></el-table-column>
        <el-table-column prop="postLevelName" label="等级" width="120"></el-table-column>
        <el-table-column prop="skillList" label="技能需求" min-width="120">
          <template slot-scope="scope">
            <span
              v-for="(item, i) in scope.row.skillList"
              :class="['skillBox', 'skill' + item.cssClass]"
              >{{ item.skillName }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" width="120"></el-table-column>
        <el-table-column prop="endTime" label="结束时间" width="120"></el-table-column>
        <el-table-column prop="planLoad" label="计划负荷" width="120"></el-table-column>
        <el-table-column prop="workDay" label="总人日" width="120"></el-table-column>
        <el-table-column prop="chanceConfigUserList" label="最终人选" width="120">
          <template slot-scope="scope">
            <span v-for="(item, i) in scope.row.chanceConfigUserList" class="priority3">{{
              item.nickName
            }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              class="priority3"
              @click.native.stop="editResourceRow(scope.row, scope.$index)"  v-hasPermi="['chanceManage:chance:duty']"
            >
              修改
            </el-button>
            <el-button
              type="text"
              size="small"
              class="priority1"
              @click.native.stop="delResourceRow(scope.row, scope.$index)"  v-hasPermi="['chanceManage:chance:duty']"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 资源配置单行的信息 纯展示 没有编辑-->
      <div class="resourceLineDetail" v-show="resourceDetailActive">
        <div class="jiange"></div>

        <el-form :model="formData" size="medium" label-width="110px">
          <div v-for="(chanceConfigItem, chanceConfigIndex) in formData.chanceConfigList">
            <el-row>
              <el-col :span="5">
                <el-form-item label="区域：">
                  {{ chanceConfigItem.regionName }}
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="职位类型：">
                  {{ chanceConfigItem.postTypeName }}
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="职位：">
                  {{ chanceConfigItem.postName }}
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="等级：">
                  {{ chanceConfigItem.postLevelName }}
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <div class="zhanwei"></div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="18">
                <el-form-item label="技能需求：">
                  <div>
                    <span
                      v-for="(item, i) in chanceConfigItem.skillList"
                      :class="['skillBox', 'skill' + item.cssClass]"
                      >{{ item.skillName }}</span
                    >
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="配置安排：">
                  {{ chanceConfigItem.startTime + "--" + chanceConfigItem.startTime }}
                </el-form-item>
              </el-col>
              <el-col :span="3" :offset="1" class="lineTT">
                <div class="colText">
                  共 <span>{{ chanceConfigItem.workTime }}</span> 小时（
                  <span>{{ chanceConfigItem.workDay }}</span> 人日）
                </div>
              </el-col>
              <el-col :span="3" class="lineTT">
                计划负荷：<span class="priority3">{{ chanceConfigItem.planLoad }}%</span>
              </el-col>
              <el-col :span="4" :offset="1" class="lineTT">
                预计成本：<span class="priority3"  v-hasPermi="['chanceManage:chance:viewCost']" >{{
                  chanceConfigItem.expectedCost
                }}</span
                >元
              </el-col>
            </el-row>
            <!-- 动态生成的内部 strat  -->
            <el-row
              v-for="(
                chanceConfigScheduleItem, chanceConfigScheduleIndex
              ) in chanceConfigItem.chanceConfigScheduleList"
              :key="chanceConfigScheduleIndex"
            >
              <el-col :span="3" :offset="2" class="lineTT">
                {{ chanceConfigScheduleItem.startTime }} --
                {{ chanceConfigScheduleItem.endTime }}
              </el-col>
              <el-col :span="4" :offset="1" class="lineTT">
                <div>
                  期间计划负荷
                  {{ chanceConfigScheduleItem.planLoad }}%
                </div>
              </el-col>
              <el-col :span="5" class="lineTT">
                <div>
                  <span>{{ chanceConfigScheduleItem.workDay }}</span> 人日
                </div>
              </el-col>
              <el-col :span="3" class="lineTT">
                <div>
                  平均每日工作<span> {{ chanceConfigScheduleItem.workTime }} </span>小时
                </div>
              </el-col>
            </el-row>
            <!-- 动态生成的内部 end  -->
          </div>
        </el-form>
      </div>
      <!-- 我是编辑的 和新增的  单行 -->
      <div class="resourceEdit" v-show="resourceEditActive">
        <div class="jiange"></div>

        <el-form
          ref="elFormChanceConfig"
          :model="formData"
          :rules="rules"
          size="medium"
          label-width="110px"
        >
          <div v-for="(chanceConfigItem, chanceConfigIndex) in formData.chanceConfigList">
            <el-row>
              <el-col :span="5">
                <el-form-item
                  label="区域："
                  :prop="'chanceConfigList.'+chanceConfigIndex+'.regionId'"
                  :rules="rules.chanceConfigItemAreaId"
                >
                  <el-select
                    v-model="chanceConfigItem.regionId"
                    placeholder="请选择区域"
                    :style="{ width: '100%' }"
                    @change="(dates) => editNext('region', dates, chanceConfigIndex)"
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
              <!-- 111:{{rules.chanceConfigItemPostTypeId}}
              222：{{formData.chanceConfigList[chanceConfigIndex].postTypeId}} -->
              <el-col :span="5">
                <el-form-item
                  label="职位类型："
                  :prop="'chanceConfigList.'+chanceConfigIndex+'.postTypeId'"
                  :rules="rules.chanceConfigItemPostTypeId"
                >
                  <el-select
                    v-model="chanceConfigItem.postTypeId"
                    placeholder="请选择职位类型"
                    :disabled="chanceConfigItem.postTypeActive"
                    :style="{ width: '100%' }"
                    @change="(dates) => editNext('postType', dates, chanceConfigIndex)"
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
                  label="职位："
                 :prop="'chanceConfigList.'+chanceConfigIndex+'.postNameId'"
                  :rules="rules.chanceConfigItempostNameId"
                >
                  <el-select
                    v-model="chanceConfigItem.postNameId"
                    placeholder="请选择职位"
                    :disabled="chanceConfigItem.postNameIdActive"
                    :style="{ width: '100%' }"
                    @change="(dates) => editNext('postNameId', dates, chanceConfigIndex)"
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
                  :prop="'chanceConfigList.'+chanceConfigIndex+'.postLevelId'"
                  :rules="rules.chanceConfigItempostLevelId"
                >
                  <el-select
                    v-model="chanceConfigItem.postLevelId"
                    placeholder="请选择等级"
                    :disabled="chanceConfigItem.postLevelIdActive"
                    :style="{ width: '100%' }"
                    @change="(dates) => editNext('postLevelId', dates, chanceConfigIndex)"
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
                <el-form-item label="">
                  <el-button
                    type="primary"
                    size="mini"
                    v-show="editOrAdd == 1 || editOrAdd == 2"
                    @click="saveConfigList(chanceConfigIndex)"  v-hasPermi="['chanceManage:chance:duty']"
                  >
                    保存
                  </el-button>
                  <el-button
                    type="info"
                    size="mini"
                    v-show="editOrAdd == 1 || editOrAdd == 2"
                    @click="cancelConfigList(chanceConfigIndex)"  v-hasPermi="['chanceManage:chance:duty']"
                  >
                    取消
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="18">
                <el-form-item
                  label="技能需求："
                  :prop="`chanceConfigList.${chanceConfigIndex}.skillIdList`"
                 
                >
                  <el-select
                    v-model="chanceConfigItem.skillIdList"
                    multiple
                    placeholder="请选择技能需求"
                    @change="changeTextColor($event, 'mySkillIdList')"
                    ref="mySkillIdList"
                    :disabled="chanceConfigItem.nextActive"
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
                  :prop="`chanceConfigList.${chanceConfigIndex}.startEndTime`"
                  :rules="rules.chanceConfigItemStartEndTime"
                >
                  <el-date-picker
                    type="daterange"
                    v-model="chanceConfigItem.startEndTime"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :style="{ width: '100%' }"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    range-separator="至"
                    :disabled="chanceConfigItem.nextActive"
                    @change="(dates) => constAll(dates, chanceConfigIndex)"
                    :picker-options="childDateArea"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="3" :offset="1" class="lineTT">
                <!-- 共<span class="priority3">{{chanceConfigItem.workTime}}</span>小时(
            <span class="priority3">{{chanceConfigItem.workDay}}</span>)天 -->
                <div class="colText">
                  共 <span>{{ chanceConfigItem.workTime }}</span> 小时（
                  <span>{{ chanceConfigItem.workDay }}</span> 人日）
                </div>
              </el-col>
              <el-col :span="3" class="lineTT">
                计划负荷：<span class="priority3">{{ chanceConfigItem.planLoad }}%</span>
              </el-col>
              <el-col :span="4" :offset="1" class="lineTT">
                预计成本：<span class="priority3">{{
                  chanceConfigItem.expectedCost
                }}</span
                >元
              </el-col>
            </el-row>
            <!-- 动态生成的内部 strat  -->
            <el-row
              v-for="(
                chanceConfigScheduleItem, chanceConfigScheduleIndex
              ) in chanceConfigItem.chanceConfigScheduleList"
              :key="chanceConfigScheduleIndex"
            >
              <el-col :span="3" :offset="2" class="lineTT">
                {{ chanceConfigScheduleItem.startTime }} --
                {{ chanceConfigScheduleItem.endTime }}
              </el-col>
              <el-col :span="4" :offset="1" class="lineTT">
                <div>
                  期间计划负荷
                  <el-input-number
                    size="mini"
                    :style="{ width: '120px' }"
                    v-model="chanceConfigScheduleItem.planLoad"
                    :min="0"
                    :max="100"
                    :precision="0"
                    @change="
                      (number) => {
                        changePlanLoad(
                          number,
                          chanceConfigScheduleItem.weekDay,
                          chanceConfigIndex,
                          chanceConfigScheduleIndex
                        );
                      }
                    "
                  ></el-input-number>
                  %
                </div>
              </el-col>
              <el-col :span="5" class="lineTT">
                <div>
                  <span>{{ chanceConfigScheduleItem.workDay }}</span> 人日
                </div>
              </el-col>
              <el-col :span="3" class="lineTT">
                <div>
                  平均每日工作<span> {{ chanceConfigScheduleItem.workTime }} </span>小时
                </div>
              </el-col>
            </el-row>
            <!-- 动态生成的内部 end  -->
          </div>
        </el-form>
      </div>
    </div>

    <!-- 跟进记录 流程图 -->
    <div class="whiteBox mmTable left-lineBox" v-show="nowActive == 1">
      <el-timeline>
        <el-timeline-item
          v-for="(follow, index) in followData"
          :key="index"
          :type="follow.type"
          :size="follow.size"
        >
          <span class="follow follow1">{{
            follow.createTime + "   " + follow.createName
          }}</span>
          <span class="follow follow2">跟进记录：{{ follow.followRecord }}</span>
          <span class="follow follow3">跟进方式：{{ follow.followType }}</span>
          <span class="follow follow4">下次跟进时间：{{ follow.nextDate }}</span>
        </el-timeline-item>
      </el-timeline>
    </div>
    <!-- 添加跟进记录的弹出层 -->
    <el-dialog :visible.sync="followActive" title="添加跟进记录">
      <el-form
        ref="followElForm"
        :model="followFormData"
        :rules="followRules"
        size="medium"
        label-width="150px"
      >
        <el-form-item label="跟进记录：" prop="followRecord">
          <el-input
            v-model="followFormData.followRecord"
            type="textarea"
            placeholder="请输入跟进记录"
            :autosize="{ minRows: 4, maxRows: 4 }"
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="跟进方式：" prop="followType">
          <el-input
            v-model="followFormData.followType"
            placeholder="请输入跟进方式"
            clearable
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="下次跟进时间：" prop="nextDate">
          <el-date-picker
            v-model="followFormData.nextDate"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :style="{ width: '100%' }"
            placeholder="请选择下次跟进时间"
            clearable
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="close"  v-hasPermi="['chanceManage:chance:duty']">取消</el-button>
        <el-button type="primary" @click="handleConfirm"  v-hasPermi="['chanceManage:chance:duty']">确定</el-button>
      </div>
    </el-dialog>
    <!-- 人选推荐 表格 0 => 显示资源配置 -->
    <div class="titleBar" v-show="recommendUserActive">人选推荐</div>
    <div
      class="whiteBox myUserTable"
      v-show="nowActive == 0 && recommendUserActive"
      style="padding: 1%"
    >
      <el-table
        :data="recommendUserTableData"
        border
        class="myTable "
        :header-row-style="{ height: '14px', 'line-height': '14px' }"
        :header-cell-class-name="headerUserClassName"
        style="width: 100%"
        max-height="650"
        :row-style="rowUserStyle"
      >
        <el-table-column prop="nickName" label="姓名"></el-table-column>
        <el-table-column prop="regionName" label="区域"></el-table-column>
        <el-table-column prop="postName" label="职位"></el-table-column>
        <el-table-column prop="postLevelName" label="等级"></el-table-column>
        <el-table-column prop="skillList" label="工作技能">
          <template slot-scope="scope">
            <div>
              <span
                v-for="(item, i) in scope.row.skillList"
                :class="['skillBox', 'skill' + item.cssClass]"
                >{{ item.skillName }}</span
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="freeLoad" label="空闲负荷"></el-table-column>
        <el-table-column prop="price" label="单价"></el-table-column>
        <el-table-column prop="allPrice" label="总价"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div>
               <el-button type="text" size="mini" >
                <span class="priority3" @click="detail(scope.row.userId)"  v-hasPermi="['chanceManage:chance:duty']"
                  >详情
                </span>
              </el-button>
              <!-- 1 不显示 有审核记录，0显示  没有审核记录 -->
              <el-button type="text" size="mini" v-if="scope.row.showOrCancel == 1">
                <span class="priority3" @click="addUserToProject(scope.row, scope.$index)"  v-hasPermi="['chanceManage:chance:duty']"
                  >添加
                </span>
              </el-button>
              <el-button type="text" size="mini" v-if="scope.row.showOrCancel == 2">
                <span class="priority4" @click="delUserToProject(scope.row, scope.index)"  v-hasPermi="['chanceManage:chance:duty']"
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
  </div>
</template>
<script>
import {
  queryDict, // 字典查询 传入字典名称
  addChance,
  chanceDetail,
  getFollowList,
  getResourceLineDetail,
  updateChanceConfig,
  addChanceConfig,
  delChanceConfigLine,
  addChanceRecord,
  getRecommendUserList,
  getLevelCostNum,
  updateConfigUser,
  getPostName,
  toProject,
} from "@/api/chanceManager/chanceManager";
import { getTimeProcess } from "@/api/proManager/proManager";
import { queryUserlist } from "@/api/system/user";

import followIcon from "@/assets/images/followIcon.png";
export default {
  data() {
    return {
      childDateArea: {
        // 机会配置安排的的 可选时间区间
        disabledDate: (time) => {
          if (this.formData.expectStartTime && this.formData.expectEndTime) {
            // 设置可以选择的区间 时间为项目的 起始日期和结束日期
            return (
              time.getTime() > new Date(this.formData.expectEndTime).getTime() ||
              time.getTime() < new Date(this.formData.expectStartTime).getTime() - 8.64e7
            );
          }
        },
      },
      recommendUserActive: false, // 默认隐藏 人选推荐
      recommendUserTableData: [],
      // 新增编辑的初始化 数据结构集合
      addEditFormData: {}, // 存储 详情 编辑 新增的表单
      resourceDetailActive: false,
      resourceEditActive: false,
      editOrAdd: 1, // 1是修改 2 是新增
      followFormData: {
        followRecord: "",
        followType: "",
        nextDate: "",
      },
      ///---------------------
      followActive: false,
      followRules: {
        followRecord: [
          {
            required: true,
            message: "请输入跟进记录",
            trigger: "blur",
          },
        ],
        followType: [
          {
            required: true,
            message: "请输入跟进方式：",
            trigger: "blur",
          },
        ],
        nextDate: [
          {
            required: true,
            message: "请选择下次跟进时间",
            trigger: "change",
          },
        ],
      },
      followData: [
        {
          followRecord: "", //跟进记录
          followType: "", //跟进方式
          nextDate: "", //下次跟进时间
          createName: "", //创建人
          createTime: "", //创建时间
        },
      ],
      BarList: ["资源配置 |", "跟进记录"],
      nowActive: 0,
      tableData: [
        {
          id: "", //"机会配置表主键"
          chanceId: "", //"机会id"
          postId: "", //"职位名称id"
          postName: "", //"职位名称"
          areaId: "", //"区域名称id"
          areaName: "", //"区域名称"
          gradeId: "", //"等级名称id"
          gradeName: "", //"等级名称"
          skillIds: "", //"技能id;用逗号分割"
          startTime: "", //"开始时间"
          endTime: "", //"结束时间"
          workTime: "", //"总工时"
          workDay: "", //"总人日"
          planLoad: "", //"计划负荷"
          expectedCost: "", //"预计成本"
          skillList: [], //"配置中的技能"
          chanceConfigScheduleList: [], //"配置的排期"
          chanceConfigUserList: [], //"最终人选"
        },
      ],
      formData: {
        chanceName: "", //          机会名称
        chanceStatus: "", //          机会状态：1.新建、2.跟进中、3.已结束、4.已转项目
        priority: 3, //          优先级（1.最高;2.高，3.普通，4.较低）
        projectId: null, //      已转项目
        projectName: null, //      已转项目
        chanceUserId: "", //       机会负责人id
        chanceUserName: "", //          机会负责人
        customer: "", //          客户
        customerLink: "", //          客户联系人
        tel: "", //          联系方式
        budget: undefined, //          客户预算
        successRate: undefined, //          成功率
        expectStartTime: "", //          预计开始时间
        expectEndTime: "", //          预计结束时间
        expectWork: undefined, //          预计工时（人日）
        expectOffer: undefined, //          预计报价
        chanceService: "", //          服务对象(1.对内;2.对外)
        remark: "", //          备注
        chanceConfigList: [],
      },
      chanceStatusOptions: [
        {
          label: "新建",
          value: 1,
        },
        {
          label: "跟进中",
          value: 2,
        },
        {
          label: "已结束",
          value: 3,
        },
        {
          label: "已转项目",
          value: 4,
        },
      ],
      chanceUserIdOptions: [],
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
      chanceServiceOptions: [
        {
          label: "对内",
          value: 1,
        },
        {
          label: "对外",
          value: 2,
        },
      ],
      rules: {
      },
      rulesTemp: {
        chanceName: [
          {
            required: true,
            message: "请输入机会名称",
            trigger: "blur",
          },
        ],
        chanceStatus: [
          {
            required: true,
            message: "请选择机会状态",
            trigger: "change",
          },
        ],
        chanceUserId: [
          {
            required: true,
            message: "请输入负责人",
            trigger: "change",
          },
        ],
        priority: [
          {
            required: true,
            message: "请选择优先级",
            trigger: "change",
          },
        ],
        customer: [],
        customerLink: [],
        tel: [
          {
            pattern: /^1(3|4|5|7|8|9)\d{9}$/,
            message: "请输入正确的手机号！",
            trigger: "blur",
          },
        ],
        budget: [],
        successRate: [],
        expectStartTime: [],
        expectEndTime: [],
        expectOffer: [],
        expectOffer: [],
        chanceService: [
          {
            required: true,
            message: "请选择对内/对外",
            trigger: "change",
          },
        ],
        remark: [],
        // 配置信息的
          // 配置信息的
        chanceConfigItemAreaId: [
          {
            required: true,
            message: "请选择区域!",
            trigger: "change",
          },
        ],
        chanceConfigItemPostTypeId: [
          {
            required: true,
            message: "请选择职位类型!",
            trigger: "change",
          },
        ],
        chanceConfigItempostNameId: [
          {
            required: true,
            message: "请选择职位!",
            trigger: "change",
          },
        ],
        chanceConfigItempostLevelId: [
          {
            required: true,
            message: "请选择等级!",
            trigger: "change",
          },
        ],
        chanceConfigItemSkillIdList: [
          {
            required: true,
            message: "请选择技能需求!",
            trigger: "change",
          },
        ],
        chanceConfigItemStartEndTime: [
          {
            required: true,
            message: "请选择配置时间安排!",
            trigger: "change",
          },
        ],
      },
      techniqueOptions: [], // 技能需求
      regionOptions: [], // 区域
      postTypeOptions: [], // 职位类型
      postNameIdOptions: [], // 职位名称
      postLevelIdOptions: [], // 职位等级
      // 配置的基本信息
      chanceConfigList: {
        postNameId: "", //职位id
        postTypeId:"",// 职位类型id
        regionId: "", //区域id
        postLevelId: "", //等级id
        skillIdList: [], //技能id
        startTime: "", //开始时间
        endTime: "", //结束时间
        workTime: "", //总工时
        workDay: "", //总人日（工作日*工时/8）
        planLoad: "", //计划负荷
        expectedCost: "", //预计成本
        chanceConfigScheduleList: [], //
        week: "", //周数
        startTime: "", //开始时间
        startEndTime: [],
        postLevelIdActive: true,
        postNameIdActive: true,
        postTypeActive: true,
        nextActive: true,
        chanceConfigScheduleList: [],
      },
      nowIndex: "", // 点击修改和点击单行的时候 记录当前选择的是哪一行，不然无法添加人选
      id: "",
      userId:""
    };
  },
  mounted() {
    this.init(this.$route.query.chanceId);
    this.followInit(this.$route.query.chanceId);
    this.getDictList("post_type"); //职位类型
    this.getDictList("region"); //区域
    this.getDictList("post_level"); // 等级
    this.getDictList("skill_type"); // 技能 technique
   this.queryAllUser()
  },
  methods: {
    queryAllUser(){
      let data = {status:0};
      queryUserlist(data).then((res) => {
            res.data.map(item=>{
              item.label=item.nickName
              item.value=item.userId
            })
            this.chanceUserIdOptions = res.data
      })
    },
    detail(id) {
    // window.localStorage.setItem('depttId',this.queryParams.deptId)
    // window.localStorage.setItem('deptTitle',this.deptTitle)
      // const obj = { path: "/system/user-auth/userInfo", query: { userId: id , deptId:this.queryParams.deptId,deptTitle:this.deptTitle} };
      const obj = { path: "/system/user-auth/userInfo", query: { userId: id  } };
      // getToday()
      this.$tab.closeOpenPage(obj);
    },
    rowUserStyle({row}){
      // 人选推荐的 高亮行
       if (this.userId === row.userId) {
        return {
          background: "#f7f4d3",
        };
      }
    },
    rowStyle({ row }) {
      // 资源配置的高亮行
      if (this.id === row.id) {
        return {
          background: "#f7f4d3",
        };
      }
    },
    // 动态生成 表头样式
    headerUserClassName(row) {
      // console.log(row.column)
      // if(row.column.property=='total')
      return "recommendHeader";
    },
    enterChanceEdict() {
      this.$store.commit("setRegionOptions", this.regionOptions);
      this.$store.commit("setPostTypeOptions", this.postTypeOptions);
      this.$store.commit("setTechniqueOptions", this.techniqueOptions);
      this.$store.commit("setPostLevelIOptions", this.postLevelIdOptions);
      this.$store.commit("setChanceDetail", {
        formData: this.formData,
        chanceConfigList: this.tableData,
      });
      this.$router.push({
        path: "/chanceManager/chanceManager-auth/chanceEdit",
        query: {
          chanceId: this.$route.query.chanceId,
        },
      });
    },
    // 点击 新增配置的
    addConfigListHandel() {
      this.formData.chanceConfigList = [];
      this.resourceDetailActive = false;
      this.resourceEditActive = true;
      this.recommendUserActive = false;
      this.editOrAdd = 2; // 1是修改 2 是新增
      //  if(this.formData.chanceService==""){
      //         this.$message.error("请您先完整填写项目基础信息！");
      //   }
      let oneUser = this.deepClone(this.chanceConfigList);
      oneUser.startTime = this.formData.expectStartTime;
      oneUser.endTime = this.formData.expectEndTime;
      oneUser.startEndTime = [this.formData.expectStartTime, this.formData.expectEndTime];
      this.formData.chanceConfigList.push(oneUser);
      // this.$refs["elFormChanceConfig"].clearValidate();
      console.log('this.rulesTemp :>> ', this.rulesTemp);
      this.rules = this.rulesTemp;
      this.$forceUpdate();
    },
    changePlanLoad(number, weekDay, fatherIndex, myIndex){
      console.log("changePlanLoad");
      // 修改每周期间 计划负荷
      // 工作时间为固定的8
      if(number!=0){// 不等于0  就拿修改之后的百分比 除以 100 拿到比例
        this.formData.chanceConfigList[fatherIndex].chanceConfigScheduleList[myIndex].workDay = ((number/100)*weekDay).toFixed(2) //人日==> 现有百分比除以100 乘以天数
        this.formData.chanceConfigList[fatherIndex].chanceConfigScheduleList[myIndex].workTime = ((number/100)*8).toFixed(2)      //每日工时==> 现有百分比除以100 乘以 8
      }else{
       this.formData.chanceConfigList[fatherIndex].chanceConfigScheduleList[myIndex].workDay = 0
        this.formData.chanceConfigList[fatherIndex].chanceConfigScheduleList[myIndex].workTime = 0
      }
      /*----------------以上是 配置安排的具体计算-------------------*/
      // 循环 取出每周的工作时长
      let totalTime = 0,
        totalDay = 0;
     this.formData.chanceConfigList[fatherIndex].chanceConfigScheduleList.map(
        (item, i) => {
            // 其他的没有修改的 直接 拿天数累加
            totalDay += parseFloat(item.workDay); // 总天数 == 每周人日累计
            totalTime += parseFloat(item.workDay*8);// 总时长 == 每周人日*8
          })
          this.formData.chanceConfigList[fatherIndex].workTime = totalTime.toFixed(2)
          this.formData.chanceConfigList[fatherIndex].workDay = totalDay.toFixed(2)
          const tempWorkDay = this.formData.chanceConfigList[fatherIndex].workDayTemp; // 之前的总天数
          console.log(tempWorkDay);
           if (totalDay === 0) { // 防止憨批选到 节假日
            this.formData.chanceConfigList[fatherIndex].planLoad = 0;
          } else {
            this.formData.chanceConfigList[fatherIndex].planLoad = ((totalDay/tempWorkDay)*100).toFixed(2) //计划负荷 == 实际人日/计划的人日 *100%
          }
          this.formData.chanceConfigList[fatherIndex].expectedCost = (totalDay*this.formData.chanceConfigList[fatherIndex].costNum).toFixed(2) /**预计成本*/

      /*----------------以上是 总计的安排的具体计算-------------------*/

    },
    /*根据起始和结束 生成下面表格*/
    constAll(dates, index) {
      let params = {
        startDate: dates[0],
        endDate: dates[1],
      };
      getTimeProcess(params).then((res) => {
        this.formData.chanceConfigList[index].workDay = res.data.day.toFixed(2); // 总共多少人日
        this.formData.chanceConfigList[index].workTime = (res.data.day * 8).toFixed(2); // 总共多少工时
        if (res.data.day === 0) {
          this.formData.chanceConfigList[index].planLoad = 0;
        } else {
          this.formData.chanceConfigList[index].planLoad = (
            ((8 * res.data.day) / (res.data.day * 8)) *
            100
          ).toFixed(2); // 计划负荷
        }
        this.formData.chanceConfigList[index].expectedCost = ( // 预计成本
          res.data.day * this.formData.chanceConfigList[index].costNum
        ).toFixed(2);
        /*---------第一行的数据-----------------*/

        this.formData.chanceConfigList[index].workDayTemp = res.data.day; // 临时存一下后面有用
        this.formData.chanceConfigList[index].startTime = dates[0]; // 开始时间 留给后面的传值
        this.formData.chanceConfigList[index].endTime = dates[1]; // 结束时间 留给后面的传值
        res.data.list.map((item) => {
          item.startTime = item.startDate;
          item.endTime = item.endDate;
          item.workTime = item.weekDay != 0 ? "8" : 0; // 内部的每周时长
          item.workDay = item.weekDay; // 内部的每周人日
          item.planLoad = (((item.weekDay * 8) / (item.weekDay * 8)) * 100 || 0).toFixed(
            2
          );
        });
        this.formData.chanceConfigList[index].chanceConfigScheduleList = res.data.list; // 此人的 每周安排
      });
      this.$forceUpdate();
    },
    // 单行信息的保存
    saveConfigList(index) {
      this.$refs["elFormChanceConfig"].validate((valid) => {
        if (!valid) return;
        // TODO 上面基础信息填写好 再填写下面，因为需要用到上面的 服务对象和项目有效期
        if (valid) {
          let chanceConfigListTemp = this.deepClone(
            this.formData.chanceConfigList[index]
          );
          chanceConfigListTemp.chanceId = this.formData.chanceId;
          if (this.editOrAdd == 1) {
            // 1是修改 2 是新增
            updateChanceConfig(chanceConfigListTemp).then((res) => {
              let { code, msg } = res;
              this.$message.success(msg);
              // 保存之后 立即刷新 资源配置 跟进记录 人选推荐
              // this.$router.go(0)// 刷新当前页面
              this.resourceEditActive = false;
              this.formData.chanceConfigList = [];
              this.init(this.$route.query.chanceId);
              this.followInit(this.$route.query.chanceId);
            });
          }
          if (this.editOrAdd == 2) {
            // 1是修改 2 是新增
            addChanceConfig(chanceConfigListTemp).then((res) => {
              let { code, msg } = res;
              this.$message.success(msg);
              // 保存之后 立即刷新 资源配置 跟进记录 人选推荐
              // this.$router.go(0)// 刷新当前页面
              this.resourceEditActive = false;
              this.formData.chanceConfigList = [];
              this.init(this.$route.query.chanceId);
              this.followInit(this.$route.query.chanceId);
            });
          }
        }
      });
    },
    // 点击删除 单行数据
    delResourceRow(row) {
      this.$confirm(`确定删除当前配置吗？`, "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(111);
          delChanceConfigLine(row.id).then((res) => {
            let { code, msg } = res;
            this.$message.success(msg);
            this.recommendUserActive = false; // 隐藏人选推荐
            this.init(this.$route.query.chanceId);
            //  this.formData.chanceConfigList =[]
            //   setTimeout(() => {
            //     this.formData.chanceConfigList = this.formData.chanceConfigList.slice(this.nowIndex,this.nowIndex+1);
            //   console.log(this.formData.chanceConfigList);
            //   this.$forceUpdate()
            // },800)
          });
        })
        .catch(() => {});
    },
    // 取消当前编辑
    cancelConfigList(index) {
      this.$confirm(`确定取消吗？`, "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.formData.chanceConfigList.splice(index, 1);
        })
        .catch(() => {});
    },
    // delConfigList(index) {},
    // 选择技能之后 的变色逻辑
    // listData
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
    // 判断当前这个值是否选中了
    editNext(who, data, index) {
      // console.log(who,data,index);
      let parame = {}; // 入参
      switch (who) {
        case "region": // 选择区域
          this.formData.chanceConfigList[index].postTypeActive = false; // 初始化展示下一个
          // this.formData.projectUserList[index].regionId=undefined // 区域
          this.formData.chanceConfigList[index].postTypeId = ""; // 职位类型
          this.formData.chanceConfigList[index].postNameId = ""; // 职位名称
          this.formData.chanceConfigList[index].postLevelId = ""; // 等级
          this.formData.chanceConfigList[index].expectedCost = "--"; //// 预计成本
          this.postNameIdOptions = []; // 清空下拉
          this.postLevelIdOptions = []; // 清空下拉
          break;
        case "postType": // 选择 职位类型
          this.formData.chanceConfigList[index].postNameIdActive = false; // 初始化展示下一个
          // this.formData.chanceConfigList[index].regionId="" // 区域
          // this.formData.chanceConfigList[index].postTypeId="" // 职位类型
          this.formData.chanceConfigList[index].postNameId = ""; // 职位名称
          this.formData.chanceConfigList[index].postLevelId = ""; // 等级
          this.formData.chanceConfigList[index].expectedCost = "--"; //// 预计成本

          this.postNameIdOptions = [];
          this.postLevelIdOptions = [];
          parame = {
            regionId: this.formData.chanceConfigList[index].regionId,
            postTypeId: this.formData.chanceConfigList[index].postTypeId,
          };
          getPostName(parame).then((res) => {
            this.postNameIdOptions = res.data;
          });
          break;
        case "postNameId": // 选择职位名称
          this.formData.chanceConfigList[index].postLevelIdActive = false; // 初始化展示下一个
          // this.formData.chanceConfigList[index].regionId="" // 区域
          // this.formData.chanceConfigList[index].postTypeId="" // 职位类型
          // this.formData.chanceConfigList[index].postNameId="" // 职位名称
          this.formData.chanceConfigList[index].postLevelId = ""; // 等级
          this.formData.chanceConfigList[index].expectedCost = "--"; //// 预计成本

          // this.postNameIdOptions= []
          this.postLevelIdOptions = [];
          parame = {
            regionId: this.formData.chanceConfigList[index].regionId,
            postTypeId: this.formData.chanceConfigList[index].postTypeId,
            postNameId: this.formData.chanceConfigList[index].postNameId,
          };
          getLevelCostNum(parame).then((res) => {
            this.postLevelIdOptions = res.data;
          });
          break;
        case "postLevelId": // 选择职位等级
          this.formData.chanceConfigList[index].nextActive = false; // 初始化展示下面的所有

          // 选择 等级之后，拿到成本下拉 根据选择的等级id 拿到成本
          let costNumArry = this.postLevelIdOptions.find((item) => {
            return this.formData.chanceConfigList[index].postLevelId == item.postLevelId;
          });
          // 2对外      // 1 对内
          if (costNumArry) {
            if (this.formData.chanceService == 2) {
              this.formData.chanceConfigList[index].costNum = costNumArry.costOut;
            } else {
              this.formData.chanceConfigList[index].costNum = costNumArry.costIn;
            }
          } else {
            // 没有拿到成本 查找出来的数据返回的是undefined
            console.log(" 没有拿到成本 查找出来的数据返回的是undefined ---editNext");
          }
          console.log(
            `你好，我是第（${index})条资源配置，我的成本是 +${this.formData.chanceConfigList[index].costNum}`
          );
          // 并计算 下面的周排期
          this.constAll(this.formData.chanceConfigList[index].startEndTime, index);

          break;
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
      });
    },
    //点击取消 从 资源配置 删除人员
    delUserToProject(row, index) {
      // 后端做了判断 2次提交为删除
      let data = {
        chanceConfigId: this.formData.chanceConfigList[0].id, //机会配置表主键
        userId: row.userId, //用户id
      };
      updateConfigUser(data).then((res) => {
        let { code, msg } = res;
        this.$message.success(msg);
        this.init(this.$route.query.chanceId);
        this.formData.chanceConfigList = [];
        setTimeout(() => {
          this.formData.chanceConfigList = this.formData.chanceConfigList.slice(
            this.nowIndex,
            this.nowIndex + 1
          );
          console.log(this.formData.chanceConfigList);
          this.$forceUpdate();

          this.getRecommendUserHandel(0, this.formData.chanceConfigList[0]);
        }, 800);
        this.followInit(this.$route.query.chanceId);
        console.log(this.formData.chanceConfigList);
      });
    },
    //点击添加人员到 资源配置中 去
    addUserToProject(row, index) {
      this.userId = row.userId
      // 下面是塞入数据 对已有的那条数据进行了操作
      // 修改类型（1.新增,2.删除,3.修改原数据）

      // 点击添加成功后 显示取消按钮
      // 此处拿第一条 是因为 修改和查看详情都会吧chanceConfigList 设置为1条 即下标为0
      let data = {
        chanceConfigId: this.formData.chanceConfigList[0].id, //机会配置表主键
        userId: row.userId, //用户id
      };
      updateConfigUser(data).then((res) => {
        let { code, msg } = res;
        this.$message.success(msg);
        this.init(this.$route.query.chanceId);
        setTimeout(() => {
          this.formData.chanceConfigList = this.formData.chanceConfigList.slice(
            this.nowIndex,
            this.nowIndex + 1
          );
          console.log(this.formData.chanceConfigList);
          this.$forceUpdate();

          this.getRecommendUserHandel(0, this.formData.chanceConfigList[0]);
        }, 800);
        this.followInit(this.$route.query.chanceId);
        console.log(this.formData.chanceConfigList);
      });
    },
    // 用于对资源配置的 单条记录的回显
    // 无论从 修改  删除 添加 人选和取消人选
    refreshOneUser(row) {
      this.formData.chanceConfigList = [];
      getResourceLineDetail(row.id).then((res) => {
        res.data.postLevelIdActive = false;
        res.data.postNameIdActive = false;
        res.data.postTypeActive = false;
        res.data.nextActive = false;
        res.data.startEndTime = [res.data.startTime, res.data.endTime];
        this.formData.chanceConfigList = [res.data];
        res.data.costNum = res.data.expectedCost / res.data.workDay;
        this.constAll([res.data.startTime, res.data.endTime], 0);
        this.getRecommendUserHandel(0, res.data); // 因为无论是 查看详情的单行 还是 点击修改的单行 始终都是0 第一条
        // 请求人选推荐
      });
    },
    // 点击修改
    editResourceRow(row, index) {
      this.id = row.id;
      this.nowIndex = index;
      this.refreshOneUser(row);
      this.resourceDetailActive = false; //
      this.resourceEditActive = true;
      this.editOrAdd = 1; // 1是修改 2 是新增

      // 填充 职位名称 和 等级的下拉菜单
      let parame = {
        regionId: row.regionId,
        postTypeId: row.postTypeId,
        postNameId: row.postNameId,
      };
      getLevelCostNum(parame).then((res) => {
        this.postLevelIdOptions = res.data;
      });
      getPostName(parame).then((res) => {
        this.postNameIdOptions = res.data;
      });
      // 拿到成本
      let costNumArry = this.postLevelIdOptions.find((item) => {
        return row.postLevelId == item.postLevelId;
      });
      // 2对外      // 1 对内
      if (costNumArry) {
        // console.log(row);
        if (this.formData.chanceService == 2) {
          row.costNum = costNumArry.costOut;
        } else {
          row.costNum = costNumArry.costIn;
        }
      } else {
        // 没有拿到成本 查找出来的数据返回的是undefined
        console.log(" 没有拿到成本 查找出来的数据返回的是undefined ---editNext");
      }
      console.log(`你好，我是第（${index})条资源配置，我的成本是 +${row.costNum}`);
      console.log(row);
      // row.skillIdList.map((item) => {
      this.changeTextColor(row.skillIdList, "mySkillIdList");
      // });
    },
    // 存储下标 单击行的下标
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
    },
    // 单机行 查看详情
    showRowDetail(row) {
      this.id = row.id;
      this.nowIndex = row.index;
      this.resourceEditActive = false;
      this.resourceDetailActive = true;
      this.refreshOneUser(row);
    },
    // 获取推荐人选的
    getRecommendUserHandel(index, row) {
      this.recommendUserActive = true; // 显示人选推荐
      let params = {
        id: row.id, //机会配置表的主键
        chanceId: row.chanceId, //机会id
        postNameId: row.postNameId, //职位id
        regionId: row.regionId, //区域id
        postTypeId: row.postTypeId, //职位类型id
        postLevelId: row.postLevelId, //等级id
        skillIdList: row.skillIdList, //技能id
        startTime: row.startTime, //开始时间
        endTime: row.endTime, //结束时间
        workDay: row.workDay, //总人日
      };
      let _this = this;
      getRecommendUserList(params).then((res) => {
        res.data.map((item) => {
          item.showOrCancel = 1; // 默认显示  添加
          // chanceConfigUserList:Array
          if (
            _this.formData.chanceConfigList[index].chanceConfigUserList.length &&
            _this.formData.chanceConfigList[index].chanceConfigUserList.length > 0
          ) {
            _this.formData.chanceConfigList[index].chanceConfigUserList.map((user, u) => {
              if (user.userId == item.userId) {
                // 如果 当前点击的行的userID === 当前行id 就显示取消
                item.showOrCancel = 2;
              }
            });
          }
        });
        this.recommendUserTableData = res.data;
      });
    },
    // tab 切换
    toggleWho(i) {
      this.nowActive = i;
    },
    //跟进记录的初始化方法
    followInit(chanceId) {
      getFollowList(chanceId).then((res) => {
        res.data.map((item) => {
          (item.size = "large"), (item.type = "primary"), (item.color = "#557cb5");
        });
        this.followData = res.data;
      });
    },
    // 机会详情页的 主方法 初始化
    init(chanceId) {
      chanceDetail(chanceId).then((res) => {
        this.formData = res.data;
        this.tableData = res.data.chanceConfigList;
      });
    },
    // 转换为正式项目
    transformProject() {
      // 跳转到项目详情页 再转换
      const obj = {
        path: "/projectManager/proManager-auth/addProject",
        query: { chanceId: this.formData.chanceId },
      };
      this.$tab.closeOpenPage(obj);
    },
    // 添加 跟进记录
    addFollow() {
      this.nowActive = 1;
      this.followActive = true;
      if (this.$refs.followElForm !== undefined) {
        this.$refs['followElForm'].resetFields()
      }
    },
    onClose() {},
    close() {
      this.followActive = false;
      if (this.$refs.followElForm !== undefined) {
        this.$refs['followElForm'].resetFields()
      }
    },
    // 保存 跟进记录的
    handleConfirm() {
      this.$refs["followElForm"].validate((valid) => {
        if (!valid) return;
        if (valid) {
          let followFormDataTemp = {
            chanceId: this.formData.chanceId,
            ...this.followFormData,
          };
          addChanceRecord(followFormDataTemp).then((res) => {
            let { code, msg } = res;
            this.$message.success(msg);
            this.close();
            this.followInit(this.$route.query.chanceId);
          });
        }
      });
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
.mmTable {
  padding: 20px;
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
.ft13 {
  font-size: 13px;
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
.toggleBar {
  height: 50px;
  font-size: 13px;
  width: 100%;
  padding-left: 20px;
  line-height: 50px;
  background-color: #e8e8f4;
  position: relative;
  span {
    cursor: pointer;
    font-size: 14px;
  }
}
.nowActive {
  color: #409eff;
  font-weight: bold;
}
.follow1 {
  color: #ccc;
}
.follow2 {
  color: #333;
}
.follow3 {
  color: #333;
}
.follow4 {
  color: #333;
}
.follow {
  width: 100%;
  display: block;
  padding: 5px 0;
}
.lineTT {
  // margin-left:40px;
  font-size: 14px;
  color: #adb3b9;
  line-height: 40px;
}
.configFont {
  color: #adb3b9;
}
.UserListBox .el-form-item {
  margin-bottom: 0px;
}
</style>
<style scoped>
.myTable /deep/ .el-table__header-wrapper .recommendHeader {
  background: #5a7db9 !important;
  height: 30px;
  padding: 5px 0px;
  color: white !important;
}

.left-lineBox /deep/ .el-timeline-item__node--large {
  background-color: transparent;
  background-image: url("../../../assets/images/followIcon.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
.left-lineBox /deep/ .el-timeline-item__node--normal {
  background-color: #cee2ff;
}
.left-lineBox /deep/ .el-timeline-item__tail {
  border-left: 2px solid #ced7e9;
  top: 4px;
}
.gaoliang /deep/ .el-table__body tr.hover-row > td.el-table__cell,
.gaoliang /deep/ .el-table__body tr.hover-row.current-row > td.el-table__cell,
.gaoliang /deep/ .el-table__body tr.hover-row.el-table__row--striped > td.el-table__cell,
.gaoliang
  /deep/
  .el-table__body
  tr.hover-row.el-table__row--striped.current-row
  > td.el-table__cell {
  background-color: #f7f4d3;
}
.myUserTable /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
  background-color: #f7f4d3;
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
.skillBox {
  padding: 4px 8px;
  border: 1px white solid;
  border-radius: 5px;
  margin-left: 4px;
}
.nickNameBox {
  padding: 4px;
  display: inline-block;
}
.colText2 {
  height: inherit;
  line-height: 150%;
  margin-top: 8.5px;
  font-size: 13px;
  color: #999;
  text-align: left;
}
.resourceEdit {
  min-height: 120px;
}

/* //高亮点击的行 */
/* .gaoliang .el-table__body tr.current-row>td {
  background: rgb(77, 195, 255, 0.5) !important;
}
.gaoliang .el-table__body tr:hover>td{
  background: rgb(77, 195, 255, 0.2);
} */
/* //鼠标滑过时高亮行 */
</style>
