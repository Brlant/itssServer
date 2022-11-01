<template>
  <div class="app-container">
     <div class="routerBar">
      <router-link :to="'/chanceManager/chanceList'"> < 机会详情</router-link>
      <div class="rightBox">
        <router-link :to="'/chanceManager/chanceEdit'"> 编辑基本信息</router-link>
        <router-link :to="'/chanceManager/addChance'"> < 机会详情</router-link>
        <span class="priority3" @click="transformProject">转为正式项目</span>
      </div>
    </div>
    <div class="titleBar">机会基础信息</div>
      <div class="whiteBox">
    <el-form ref="elForm" :model="formData"   size="medium" label-width="110px">
      <el-row  >
        <el-col :span="10" :offset="1">
          <el-form-item label="机会名称：" prop="chanceName">
            <el-input v-model="formData.chanceName" placeholder="请输入机会名称" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="机会状态" prop="chanceStatus">
            <el-select v-model="formData.chanceStatus" placeholder="请选择机会状态" clearable
              :style="{width: '100%'}">
              <el-option v-for="(item, index) in chanceStatusOptions" :key="index" :label="item.label"
                :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="负责人" prop="chanceUserId">
            <el-select v-model="formData.chanceUserId" placeholder="请输入负责人" clearable
              :style="{width: '100%'}">
              <el-option v-for="(item, index) in chanceUserIdOptions" :key="index" :label="item.label"
                :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="优先级：" prop="priority">
            <!-- <el-select v-model="formData.priority" placeholder="请选择优先级" clearable :style="{width: '100%'}">
              <el-option v-for="(item, index) in priorityOptions" :key="index" :label="item.label"
                :value="item.value" :disabled="item.disabled"></el-option>
            </el-select> -->
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
          <el-form-item label="客户：" prop="customer">
            <el-input v-model="formData.customer" placeholder="请输入客户" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="客户联系人" prop="customerLink">
            <el-input v-model="formData.customerLink" placeholder="请输入客户联系人" clearable
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="联系方式：" prop="tel">
            <el-input v-model="formData.tel" placeholder="请输入联系方式" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="客户预算：" prop="budget">
            <el-input-number v-model="formData.budget" placeholder="请输入金额" :precision='2'></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="成功率：" prop="successRate">
            <el-input-number v-model="formData.successRate" placeholder="请输入" :precision='0'>
            </el-input-number>
            <span class="priority4"> &nbsp;&nbsp;&nbsp;&nbsp;%</span>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="预计起始日：" prop="expectStartTime">
            <el-date-picker v-model="formData.expectStartTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              :style="{width: '100%'}" placeholder="请选择预计起始日" clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="预计结束日：" prop="expectEndTime">
            <el-date-picker v-model="formData.expectEndTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              :style="{width: '100%'}" placeholder="请选择预计结束日" clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="预计工时：" prop="expectWork">
            <el-input-number v-model="formData.expectWork" placeholder="请输入预计工时" :precision='1'>
            </el-input-number>
            <span class="priority4"> &nbsp;&nbsp;&nbsp;&nbsp;人日</span>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="预计报价：" prop="expectOffer">
             <el-input-number v-model="formData.expectOffer" placeholder="请输入预计报价" :precision='2'></el-input-number>
            <!-- <el-input v-model="formData.expectOffer" placeholder="请输入预计报价" clearable :style="{width: '100%'}"> -->
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="服务对象：" prop="chanceService">
            <el-select v-model="formData.chanceService" placeholder="请选择对内/对外" clearable
              :style="{width: '100%'}">
              <el-option v-for="(item, index) in chanceServiceOptions" :key="index" :label="item.label"
                :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="21" :offset="1">
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注"
              :autosize="{minRows: 2, maxRows: 2}" :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="titleBar">
        资源配置
        <div class="rightBox">
          <el-button size="mini" @click="addConfigListHandel" type="primary">添加配置</el-button>
        </div>
      </div>
      <div class="whiteBox UserListBox configFont" style="padding-left:70px">
        <div v-for="(chanceConfigItem,chanceConfigIndex) in formData.chanceConfigList">

      <el-row >
        <el-col :span="6">
          
          <el-form-item label="区域：" :prop="`chanceConfigList.${chanceConfigIndex}.areaId`" :rules="rules.chanceConfigItemAreaId">
            <el-select v-model="chanceConfigItem.areaId" placeholder="请选择区域" 
              :style="{width: '100%'}"
             @change="(dates) => editNext('region',dates, chanceConfigIndex)">
              <el-option v-for="(dict, index) in regionOptions"   
                  :key="dict.dictCode"
                  :label="dict.dictLabel"
                  :value="dict.dictCode"
                  :disabled="dict.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="职位：" :prop="`chanceConfigList.${chanceConfigIndex}.postId`" :rules="rules.chanceConfigItemPostId">
            <el-select v-model="chanceConfigItem.postId" placeholder="请选择职位" 
            :disabled="chanceConfigItem.postTypeActive"   :style="{width: '100%'}"
             @change="(dates) => editNext('postType',dates, chanceConfigIndex)">
              <el-option v-for="(dict, index) in postTypeOptions"  :key="dict.dictCode"
                  :label="dict.dictLabel"
                  :value="dict.dictCode"
                  :disabled="dict.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="等级：" :prop="`chanceConfigList.${chanceConfigIndex}.gradeId`" :rules="rules.chanceConfigItemGradeId">
            <el-select v-model="chanceConfigItem.gradeId" placeholder="请选择等级"  
            :disabled="chanceConfigItem.gradeIdActive"   :style="{width: '100%'}"
             @change="(dates) => editNext('gradeId',dates, chanceConfigIndex)">
              <el-option v-for="(dict, index) in gradeIdOptions"  :key="dict.dictCode"
                  :label="dict.dictLabel"
                  :value="dict.dictCode"
                  :disabled="dict.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label=""  >
            <el-button type="primary" size="mini"  @click="DelConfigList(chanceConfigIndex)"> 删除 </el-button>
          </el-form-item>
        </el-col>
      </el-row>
        <el-row>
        <el-col :span="18">
          <el-form-item label="技能需求：" :prop="`chanceConfigList.${chanceConfigIndex}.skillIdList`" :rules="rules.chanceConfigItemSkillIdList">
            <el-select v-model="chanceConfigItem.skillIdList" multiple  placeholder="请选择技能需求"
            :disabled="chanceConfigItem.nextActive"    :style="{width: '100%'}">
              <el-option v-for="(dict, index) in techniqueOptions"  
                  :key="dict.dictCode"
                  :label="dict.dictLabel"
                  :value="dict.dictCode"
                  :disabled="dict.disabled">
                    <span>{{ dict.dictLabel}}</span>
                  </el-option>
            </el-select>
          </el-form-item>
        </el-col>
       </el-row>
        <el-row>
        <el-col :span="6">
          <el-form-item label="配置安排：" :prop="`chanceConfigList.${chanceConfigIndex}.startEndTime`"   :rules="rules.chanceConfigItemStartEndTime" >
            <el-date-picker type="daterange" v-model="chanceConfigItem.startEndTime" format="yyyy-MM-dd"
              value-format="yyyy-MM-dd" :style="{width: '100%'}" start-placeholder="开始日期"
              end-placeholder="结束日期" range-separator="至" :disabled="chanceConfigItem.nextActive" 
              @change="(dates) => getTimeArea(dates, chanceConfigIndex)"
              :picker-options="childDateArea"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="3" :offset="1" class="lineTT">
          共<span class="priority3">{{chanceConfigItem.workTime}}</span>小时(
            <span class="priority3">{{chanceConfigItem.workDay}}</span>)天
        </el-col>
         <el-col :span="3"   class="lineTT">
          计划负荷：<span class="priority3">{{chanceConfigItem.planLoad}}%</span>
        </el-col>
         <el-col :span="4" :offset="1" class="lineTT">
          预计成本：<span class="priority3">{{chanceConfigItem.expectedCost}}</span>元
        </el-col>
        </el-row>
        <!-- 动态生成的内部 strat  -->
        <el-row v-for="(chanceConfigScheduleItem,chanceConfigScheduleIndex) in chanceConfigItem.chanceConfigScheduleList">
         <el-col :span="3" :offset="2"  class="lineTT">
          {{chanceConfigScheduleItem.startTime}} -- {{chanceConfigScheduleItem.endTime}}
         </el-col>
        <el-col :span="6" :offset="2" class="lineTT">
          <div class="colText">
                每日
                <el-input-number
                  size="mini"
                  :style="{ width: '100px' }"
                  :min="0"
                  :max="24"
                  v-model="chanceConfigScheduleItem.workTime"
                   :precision='1'
                  @change="
                    (number) => {
                      changeDayTime(
                        number,
                        chanceConfigScheduleItem.weekDay,
                        chanceConfigIndex,
                        chanceConfigScheduleIndex
                      );
                    }
                  " 
                ></el-input-number>
                 小时 
              </div>
        </el-col>
        <el-col :span="3" class="lineTT">
          期间计划负荷：<span class="priority3">{{chanceConfigScheduleItem.planLoad}}%</span>
        </el-col>
        </el-row>
      <!-- 动态生成的内部 end  -->
         </div>
        </div>

    </el-form>
    </div>
  </div>
</template>
<script>
 import {
  queryDict,// 字典查询 传入字典名称 
  addChance,
  chanceDetail,toProject
} from "@/api/chanceManager/chanceManager";
import {
  getTimeProcess,
} from "@/api/proManager/proManager";

export default {
  data() {
    return {
          formData: {
          chanceName: "", //          机会名称
          chanceStatus: "", //          机会状态：1.新建、2.跟进中、3.已结束、4.已转项目
          priority: 3, //          优先级（1.最高;2.高，3.普通，4.较低）
          projectId:null, //      已转项目
          projectName:null, //      已转项目
          chanceUserId: "",//       机会负责人id
          chanceUserName:"", //          机会负责人
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
          chanceConfigList:[]
      },
         
      chanceStatusOptions: [{
        "label": "新建",
        "value": 1
      }, {
        "label": "跟进中",
        "value": 2
      }, {
        "label": "已结束",
        "value": 3
      }, {
        "label": "已转项目",
        "value": 4
      }],
      chanceUserIdOptions: [{
        "label": "周佩煌",
        "value": 1
      }, {
        "label": "张帆",
        "value": 2
      }],
      priorityOptions: [{
        "label": "最高",
        "value": 1
      }, {
        "label": "高",
        "value": 2
      }, {
        "label": "普通",
        "value": 3
      }, {
        "label": "较低",
        "value": 4
      }],
      chanceServiceOptions: [{
        "label": "对内",
        "value": 1
      }, {
        "label": "对外",
        "value": 2
      }],
     }
  },
  mounted() {
    this.init(this.$route.query.chanceId)
  },
  methods: {
   init(chanceId){
    chanceDetail(chanceId).then((res)=>{
      console.log(res.data);
      this.formData = res.data
    })
   },
   // 转换为正式项目
   transformProject(){
    toProject(this.formData.chanceId).then((res)=>{
         let { code, msg } = res;
            this.$message.success(msg);
            if (+code == 200) {
              this.$router.push("/chanceManager/chanceList");
            }
    })
   }
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
 
