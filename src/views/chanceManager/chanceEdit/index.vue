<template>
  <div class="app-container">
    <div class="routerBar">
      <a href="javascript:;" @click="$router.go(-1)"> &lt; 编辑机会</a>
      <div class="rightBox">
        <el-button size="mini" @click="submitForm" type="primary">保存</el-button>
        <el-button size="mini" type="default" @click="resetForm">取消</el-button>
      </div>
    </div>
    <div class="titleBar">机会基础信息</div>
    <div class="whiteBox">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="110px">
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item label="机会名称：" prop="chanceName">
              <el-input v-model="formData.chanceName" placeholder="请输入机会名称" clearable :style="{width: '100%'}" />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="机会状态" prop="chanceStatus">
              <el-select v-model="formData.chanceStatus" placeholder="请选择机会状态" clearable :style="{width: '100%'}">
                <el-option v-for="(item, index) in chanceStatusOptions" 
                  :key="index" 
                  :label="item.label"
                  :value="item.value" 
                  :disabled="item.disabled"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="负责人" prop="chanceUserId">
              <el-select v-model="formData.chanceUserId" placeholder="请输入负责人" clearable :style="{width: '100%'}">
                <el-option v-for="(item, index) in chanceUserIdOptions" 
                  :key="index" :label="item.label"
                  :value="item.value" 
                  :disabled="item.disabled"
                />
              </el-select>
            </el-form-item>
          </el-col>
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
            <el-form-item label="客户：" prop="customer">
              <el-input v-model="formData.customer" placeholder="请输入客户" clearable :style="{width: '100%'}" />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="客户联系人" prop="customerLink">
              <el-input v-model="formData.customerLink" placeholder="请输入客户联系人" clearable :style="{width: '100%'}" />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="联系方式：" prop="tel">
              <el-input v-model="formData.tel" placeholder="请输入联系方式" clearable :style="{width: '100%'}" />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="客户预算：" prop="budget">
              <el-input-number v-model="formData.budget" placeholder="请输入金额" :precision='2' />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="成功率：" prop="successRate">
              <el-input-number v-model="formData.successRate" placeholder="请输入" :precision='0' />
              <span class="priority4"> &nbsp;&nbsp;&nbsp;&nbsp;%</span>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="预计起始日：" prop="expectStartTime">
              <el-date-picker v-model="formData.expectStartTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="请选择预计起始日" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="预计结束日：" prop="expectEndTime">
              <el-date-picker v-model="formData.expectEndTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="请选择预计结束日" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="预计工时：" prop="expectWork">
              <el-input-number v-model="formData.expectWork" placeholder="请输入预计工时" :precision='1' />
              <span class="priority4"> &nbsp;&nbsp;&nbsp;&nbsp;人日</span>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="预计报价：" prop="expectOffer">
              <el-input-number v-model="formData.expectOffer" placeholder="请输入预计报价" :precision='2' />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="服务对象：" prop="chanceService">
              <el-select v-model="formData.chanceService" placeholder="请选择对内/对外" clearable :style="{width: '100%'}">
                <el-option v-for="(item, index) in chanceServiceOptions" 
                  :key="index" 
                  :label="item.label"
                  :value="item.value" 
                  :disabled="item.disabled"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="备注：" prop="remark">
              <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注" :autosize="{minRows: 2, maxRows: 2}" :style="{width: '100%'}" />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="titleBar">
          资源配置
          <div class="rightBox">
            <el-button size="mini" type="primary">添加配置</el-button>
          </div>
        </div>
        <div class="whiteBox UserListBox configFont" style="padding-left:70px">
          <div v-for="(chanceConfigItem, chanceConfigIndex) in formData.chanceConfigList" :key="chanceConfigIndex">
            <el-row>
              <el-col :span="5">
                <el-form-item label="区域：" :prop="`chanceConfigList.${chanceConfigIndex}.areaId`" :rules="rules.chanceConfigItemAreaId">
                  <el-select v-model="chanceConfigItem.areaId" placeholder="请选择区域" :style="{width: '100%'}" @change="(dates) => editNext('region',dates, chanceConfigIndex)">
                    <el-option v-for="(dict, index) in regionOptions"   
                      :key="index"
                      :label="dict.dictLabel"
                      :value="dict.dictCode"
                      :disabled="dict.disabled"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="职位类型：" :prop="`chanceConfigList.${chanceConfigIndex}.postTypeId`" :rules="rules.chanceConfigItemPostTypeId">
                  <el-select v-model="chanceConfigItem.postTypeId" placeholder="请选择职位类型" :disabled="chanceConfigItem.postTypeActive"  :style="{width: '100%'}" @change="(dates) => editNext('postType',dates, chanceConfigIndex)">
                    <el-option v-for="(dict, index) in postTypeOptions" :key="index"
                      :label="dict.dictLabel"
                      :value="dict.dictCode"
                      :disabled="dict.disabled"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="职位名称：" :prop="`chanceConfigList.${chanceConfigIndex}.postId`" :rules="rules.chanceConfigItemPostId">
                  <el-select v-model="chanceConfigItem.postId" placeholder="请选择职位名称" :disabled="chanceConfigItem.postIdActive" :style="{width: '100%'}" @change="(dates) => editNext('postId',dates, chanceConfigIndex)">
                    <el-option v-for="(dict, index) in postIdOptions"  
                      :key="index"
                      :label="dict.dictLabel"
                      :value="dict.dictCode"
                      :disabled="dict.disabled"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="等级：" :prop="`chanceConfigList.${chanceConfigIndex}.gradeId`" :rules="rules.chanceConfigItemGradeId">
                  <el-select v-model="chanceConfigItem.gradeId" placeholder="请选择等级" :disabled="chanceConfigItem.gradeIdActive" :style="{width: '100%'}" @change="(dates) => editNext('gradeId',dates, chanceConfigIndex)">
                    <el-option v-for="(dict, index) in gradeIdOptions" 
                      :key="index"
                      :label="dict.dictLabel"
                      :value="dict.dictCode"
                      :disabled="dict.disabled"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <el-button type="primary" size="mini" @click="DelConfigList(chanceConfigIndex)">删除</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="18">
                <el-form-item label="技能需求：" :prop="`chanceConfigList.${chanceConfigIndex}.skillIdList`" :rules="rules.chanceConfigItemSkillIdList" >
                  <el-select 
                    v-model="chanceConfigItem.skillIdList"
                    multiple placeholder="请选择技能需求"  
                    @change="chageTextColor($event,'mySkillIdList')" 
                    ref="mySkillIdList"
                    :disabled="chanceConfigItem.nextActive"    
                    :style="{width: '100%'}" 
                  >
                    <el-option v-for="(dict, index) in techniqueOptions" :key="index" :label="dict.dictLabel" :value="dict.dictCode" :disabled="dict.disabled">
                      <span>{{ dict.dictLabel}}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="配置安排：" :prop="`chanceConfigList.${chanceConfigIndex}.startEndTime`" :rules="rules.chanceConfigItemStartEndTime">
                  <el-date-picker 
                    type="daterange" 
                    v-model="chanceConfigItem.startEndTime"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd" 
                    :style="{width: '100%'}"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期" 
                    range-separator="至" 
                    :disabled="chanceConfigItem.nextActive" 
                    @change="(dates) => getTimeArea(dates, chanceConfigIndex)"
                    :picker-options="childDateArea"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="3" :offset="1" class="lineTT">
                共<span class="priority3">{{chanceConfigItem.workTime}}</span>小时
                (<span class="priority3">{{chanceConfigItem.workDay}}</span>)天
              </el-col>
              <el-col :span="3" class="lineTT">
                计划负荷：<span class="priority3">{{chanceConfigItem.planLoad}}%</span>
              </el-col>
              <el-col :span="4" :offset="1" class="lineTT">
                预计成本：<span class="priority3">{{chanceConfigItem.expectedCost}}</span>元
              </el-col>
            </el-row>
            <!-- 动态生成的内部 strat  -->
            <el-row v-for="(chanceConfigScheduleItem, chanceConfigScheduleIndex) in chanceConfigItem.chanceConfigScheduleList" :key="chanceConfigScheduleIndex">
              <el-col :span="3" :offset="2"  class="lineTT">
                {{chanceConfigScheduleItem.startTime}} -- {{chanceConfigScheduleItem.endTime}}
              </el-col>
              <el-col :span="6" :offset="2" class="lineTT">
                <div class="colText">
                  每日
                  <el-input-number size="mini" :style="{width: '100px'}" :min="0" :max="24" :precision='1'
                    v-model="chanceConfigScheduleItem.workTime"
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
                  />
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
import { formData, rules, chanceStatusOptions, chanceUserIdOptions, priorityOptions, chanceServiceOptions } from './options'
export default {
  data() {
    return {
      formData,
      rules,
      chanceStatusOptions,
      chanceUserIdOptions,
      priorityOptions,
      chanceServiceOptions,
      regionOptions: this.$store.state.regionOptions,
      postTypeOptions: this.$store.state.postTypeOptions,
      postIdOptions: [],
      gradeIdOptions: [],
      techniqueOptions: [],
      childDateArea:{
        // 机会配置安排的的 可选时间区间
        disabledDate: (time) => {
          if (this.formData.expectStartTime && this.formData.expectEndTime) {
            // 设置可以选择的区间 时间为项目的 起始日期和结束日期
            return (
              time.getTime() > new Date(this.formData.expectEndTime).getTime() ||
              time.getTime() <
                new Date(this.formData.expectStartTime).getTime() - 8.64e7
            );
          }
        },
      }
    }
  },
  mounted() {
    
  },
  methods: {
    submitForm() {
      this.$refs.elForm.validate(valid => {
        if (!valid) return
        console.log(this.formData)
      })
    },
    resetForm() {
      this.$router.go(-1)
    },
    // 删除单行用户
    DelConfigList(index){
      this.formData.chanceConfigList.splice(index, 1);
    },
    /*根据起始和结束 生成下面表格*/
    getTimeArea(dates, index) {
      this.constAll(dates, index)
    },
    constAll(dates, index) {
      let params = {
        startDate: dates[0],
        endDate: dates[1],
      };
      getTimeProcess(params).then((res) => {
        this.formData.chanceConfigList[index].workDay = res.data.day;
        this.formData.chanceConfigList[index].workDayTemp = res.data.day;
        this.formData.chanceConfigList[index].workTime = res.data.day * 8;
        this.formData.chanceConfigList[index].startTime = dates[0];
        this.formData.chanceConfigList[index].endTime = dates[1];
        this.formData.chanceConfigList[index].expectedCost = (
          res.data.day * this.formData.chanceConfigList[index].costNum
        ).toFixed(2);
        if (res.data.day === 0) {
          this.formData.chanceConfigList[index].planLoad = 0;
        } else {
          this.formData.chanceConfigList[index].planLoad = (
            ((8 * res.data.day) / (res.data.day * 8)) *
            100
          ).toFixed(2); // 计划负荷
        }
        res.data.list.map((item) => {
          item.startTime = item.startDate;
          item.endTime = item.endDate;
          item.workTime = "8";
          item.planLoad = (((item.day * 8) / (item.day * 8)) * 100 || 0).toFixed(2);
        });
        this.formData.chanceConfigList[index].chanceConfigScheduleList = res.data.list; // 此人的 每周安排
      });
      this.$forceUpdate()
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
  a {
    color: #557db3;
  }
  span {
    font-size: 12px;
    color: #999;
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

.lineTT{
  font-size:14px;
  color:#ADB3B9;
  line-height: 40px;
}

.el-form-item {
  margin-bottom: 20px;
}
.el-row {
  display: flex;
  flex-wrap: wrap;
}
</style>
 
