<template>
  <div class="app-container">
    <div class="routerBar">
      <router-link :to="'/chanceManager/chanceList'"> &lt; 新建机会</router-link>
      <div class="rightBox">
        <el-button
          size="mini"
          @click="submitForm"
          type="primary"
          :disabled="submitLoading"
        >
          保存
        </el-button>
        <el-button size="mini" @click="resetForm" type="default">取消</el-button>
      </div>
    </div>
    <div class="titleBar">机会基础信息</div>
      <div class="whiteBox">
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="110px">
      <el-row  >
        <el-col :span="10" :offset="1">
          <el-form-item label="机会名称：" prop="chanceName">
            <el-input v-model="formData.chanceName" placeholder="请输入机会名称" :maxlength="20" clearable :style="{width: '100%'}">
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
            <el-input v-model="formData.customer" placeholder="请输入客户" :maxlength="20" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="客户联系人" prop="customerLink">
            <el-input v-model="formData.customerLink" placeholder="请输入客户联系人" :maxlength="20" clearable
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
            <el-input-number v-model="formData.successRate" placeholder="请输入" :precision='0' :min="0" :max="100">
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
          <el-col :span="5">
            <el-form-item label="区域：" :prop="`chanceConfigList.${chanceConfigIndex}.regionId`"
             :rules="rules.chanceConfigItemregionId">
              <el-select v-model="chanceConfigItem.regionId" placeholder="请选择区域"
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
          <el-col :span="5">
            <el-form-item label="职位类型：" :prop="`chanceConfigList.${chanceConfigIndex}.postTypeId`" :rules="rules.chanceConfigItemPostTypeId">
              <el-select v-model="chanceConfigItem.postTypeId" placeholder="请选择职位类型"
              :disabled="chanceConfigItem.postTypeActive"   :style="{width: '100%'}"
              @change="(dates) => editNext('postType',dates, chanceConfigIndex)">
                <el-option v-for="(dict, index) in postTypeOptions"  :key="dict.dictCode"
                    :label="dict.dictLabel"
                    :value="dict.dictCode"
                    :disabled="dict.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="5">
            <el-form-item label="职位名称：" :prop="`chanceConfigList.${chanceConfigIndex}.postNameId`" :rules="rules.chanceConfigItempostNameId">
              <el-select v-model="chanceConfigItem.postNameId" placeholder="请选择职位名称"
              :disabled="chanceConfigItem.postNameIdActive"   :style="{width: '100%'}"
              @change="(dates) => editNext('postNameId',dates, chanceConfigIndex)">
                <el-option v-for="(dict, index) in postNameIdOptions"  :key="dict.postNameId"
                    :label="dict.postName"
                    :value="dict.postNameId"
                    :disabled="dict.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="等级：" :prop="`chanceConfigList.${chanceConfigIndex}.postLevelId`" :rules="rules.chanceConfigItempostLevelId">
              <el-select v-model="chanceConfigItem.postLevelId" placeholder="请选择等级"
              :disabled="chanceConfigItem.postLevelIdActive"   :style="{width: '100%'}"
              @change="(dates) => editNext('postLevelId',dates, chanceConfigIndex)">
                <el-option v-for="(dict, index) in postLevelIdOptions"  :key="dict.postLevelId"
                    :label="dict.postLevelName"
                    :value="dict.postLevelId"
                    :disabled="dict.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label=""  >
              <el-button type="primary" size="mini"  @click="DelConfigList(chanceConfigIndex)"> 删除 </el-button>
              <!-- <el-button type="info" size="mini"> 取消 </el-button> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
        <el-col :span="18">
          <el-form-item label="技能需求：" :prop="`chanceConfigList.${chanceConfigIndex}.skillIdList`"   >
            <el-select v-model="chanceConfigItem.skillIdList" multiple  placeholder="请选择技能需求"  @change="chageTextColor($event,'mySkillIdList')" ref="mySkillIdList"
            :disabled="chanceConfigItem.nextActive"    :style="{width: '100%',}" >
              <el-option v-for="(dict, index) in techniqueOptions"
                  :key="dict.dictCode"
                  :label="dict.dictLabel"
                  :value="dict.dictCode"
                  :disabled="dict.disabled">
                    <span  >{{ dict.dictLabel}}</span>
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
              @change="(dates) => constAll(dates, chanceConfigIndex)"
              :picker-options="childDateArea"></el-date-picker>
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
         <el-col :span="3"   class="lineTT">
          计划负荷：<span class="priority3">{{chanceConfigItem.planLoad}}%</span>
        </el-col>
         <el-col :span="4" :offset="1" class="lineTT">
          预计成本：<span class="priority3" v-hasPermi="['chanceManage:chance:viewCost']" >{{chanceConfigItem.expectedCost}}</span>元
        </el-col>
        </el-row>
        <!-- 动态生成的内部 strat  -->
        <!-- <el-row v-for="(chanceConfigScheduleItem,chanceConfigScheduleIndex) in chanceConfigItem.chanceConfigScheduleList">
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
                ></el-input-number> -->
                  <!--
                  @input.native="changeInput($event)"
                 -->
                 <!-- 小时  -->
              <!-- </div>
        </el-col>
        <el-col :span="3" class="lineTT">
          期间计划负荷：<span class="priority3">{{chanceConfigScheduleItem.planLoad}}%</span>
        </el-col>
        </el-row> -->
           <el-row
           v-for="(chanceConfigScheduleItem,chanceConfigScheduleIndex) in chanceConfigItem.chanceConfigScheduleList"
            :key="chanceConfigScheduleIndex"
          >
            <el-col :span="3" :offset="2"  class="lineTT">

                {{chanceConfigScheduleItem.startTime}} -- {{chanceConfigScheduleItem.endTime}}

            </el-col>
            <el-col :span="4" :offset="1" class="lineTT">
              <div>
                期间计划负荷
                <el-input-number
                  size="mini"
                  :style="{ width: '120px' }"
                  v-model="chanceConfigScheduleItem.planLoad"
                  :min="0"
                  :max="100" :precision='0'
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
        </div>

    </el-form>
    </div>
    </div>
</template>
<script>
import {
  queryDict,// 字典查询 传入字典名称
  addChance,
} from "@/api/chanceManager/chanceManager";
import {
  getTimeProcess,
} from "@/api/proManager/proManager";
import {
  positionName,
  levelList,
  queryUserlist
} from "@/api/system/user";
export default {
  name:"AddChance",
  data() {
    return {
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
      },
      techniqueOptions:[], // 技能需求
      regionOptions:[], // 区域
      postTypeOptions:[], // 职位类型
      postNameIdOptions:[], // 职位名称
      postLevelIdOptions:[],  // 职位等级
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
          expectStartTime: undefined, //          预计开始时间
          expectEndTime: undefined, //          预计结束时间
          expectWork: undefined, //          预计工时（人日）
          expectOffer: undefined, //          预计报价
          chanceService: "", //          服务对象(1.对内;2.对外)
          remark: "", //          备注
          chanceConfigList:[]

          /*------------测试用-----------------*/
          // chanceName: "机会测试1",
          // chanceStatus: 1,
          // priority: 3,
          // // projectId:null,
          // // projectName:null,
          // chanceUserId: 2,
          // // chanceUserName:"测试",
          // customer: "国药控股合肥奇兵有限公司",
          // customerLink: "周佩煌",
          // tel: "13817242305",
          // budget: 250000,
          // successRate: 85,
          // expectStartTime: "2022-10-01",
          // expectEndTime: "2022-11-20",
          // expectWork: 66,
          // expectOffer: 660000,
          // chanceService: 1,
          // remark: "都很棒",
          // chanceConfigList:[]
      },
      // 配置的基本信息
      chanceConfigList:
      {
        postTypeId:"",//职位类型id
        postNameId: "", //职位id 老字段  postId
        regionId: "", //区域id  老字段  areaId
        postLevelId: "", //等级id 老字段  gradeId
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
        startEndTime:[],
        postLevelIdActive:true,
        postNameIdActive:true,
        postTypeActive:true,
        nextActive:true,
        chanceConfigScheduleList:[]
      },
      chanceConfigScheduleList:{
        week:"",//周数
        startTime:"",//开始时间
        endTime:"",//结束时间
        workTime:"",//工时
        weekDay:"",//工作日
        planLoad:"",//计划负荷
      },
      rules: {
        chanceName: [{
          required: true,
          message: '请输入机会名称',
          trigger: 'blur'
        }],
        expectStartTime: [{
          required: true,
          message: '请选择预计起始日',
          trigger: 'change'
        }],
        expectEndTime: [{
          required: true,
          message: '请选择预计结束日',
          trigger: 'change'
        }],
        chanceStatus: [{
          required: true,
          message: '请选择机会状态',
          trigger: 'change'
        }],
        chanceUserId: [{
          required: true,
          message: '请输入负责人',
          trigger: 'change'
        }],
        priority: [{
          required: true,
          message: '请选择优先级',
          trigger: 'change'
        }],
        customer: [],
        customerLink: [],
        tel: [{
          pattern: /^1(3|4|5|7|8|9)\d{9}$/,
          message: '请输入正确的手机号！',
          trigger: 'blur'
        }],
        budget: [],
        successRate: [],
        expectOffer: [],
        expectOffer: [],
        chanceService: [{
          required: true,
          message: '请选择对内/对外',
          trigger: 'change'
        }],
        remark: [],
        postTypeId:'',//职位类型id
        regionId:'',//区域id
        postNameId:'',//职位名称ID
        // 配置信息的
        chanceConfigItemregionId:[{
          required: true,
          message: '请选择区域!',
          trigger: 'change'
        }],
        chanceConfigItempostNameId:[{
          required: true,
          message: '请选择职位!',
          trigger: 'change'
        }],
        chanceConfigItempostLevelId:[{
          required: true,
          message: '请选择等级!',
          trigger: 'change'
        }],
        chanceConfigItemSkillIdList:[{
          required: true,
          message: '请选择技能需求!',
          trigger: 'change'
        }],
        chanceConfigItemStartEndTime:[{
          required: true,
          message: '请选择配置时间安排!',
          trigger: 'change'
        }],
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
      chanceUserIdOptions: [],
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
      submitLoading: false
    }
  },
  mounted() {
    // 表单数据回显
    const formData = sessionStorage.getItem('addProject')
    if (formData) {
      this.formData = JSON.parse(formData)
    }

    this.getDictList("post_type");  //职位类型
    this.getDictList("skill_type");  // 技能 technique
    // this.getDictList("post_name");   // 职位名称 post_name
    this.getDictList("region");     //区域
    // this.getDictList("post_level"); // 职位等级 post_level
    this.init();
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
    //职位名称
     position() {

        let data = {
          regionId: this.regionId,
          postTypeId: this.postTypeId,
        };
        positionName(data).then((res) => {
         this.postNameIdOptions = res.data;
        });

    },
    //等级
    level() {

        let data = {
          regionId: this.regionId,
          postTypeId: this.postTypeId,
          postNameId: this.postNameId,
        };
        levelList(data).then((res) => {
          this.postLevelIdOptions = res.data;
        });

    },

    chageTextColor(listData, refName) {
        /**
         * 之前逻辑
         */

        //   this.techniqueOptions.map(item=>{
        //   listData.map((jtem,j)=>{
        //       console.log(item.dictCode==jtem)
        //       if(item.dictCode==jtem){
        //           console.log(this.$refs[refName][0].$el.children[0].children[0].children[j],j);
        //         this.addClassName(this.$refs[refName][0].$el.children[0].children[0].children[j],item.cssClass)
        //       }
        //   })
        //  })


            this.$nextTick( () => {
              setTimeout( () => {
                let arr = [] ; // 对应数据对象数组

                listData.map( ind => {
                  this.techniqueOptions.map( v => {
                    if( v.dictCode === +ind ){
                    arr.push( v ) ;
                    }
                  } ) ;
                } ) ;

                let eles = this.$refs[refName][0].$el.querySelectorAll( '.el-select__tags .el-tag' ) ; // 获取节点

                eles.forEach( ( v, i ) => {
                  if( arr[i].dictCode === +listData[i] ){
                    // 'skill' skillcc
                     v.classList && v.classList.add( 'skillcc' ) ; // 添加类名
                    v.classList && v.classList.add( 'skill'+arr[i]['cssClass'] ) ; // 添加类名
                  }
                } ) ;

              }, 100 ) ;

            } ) ;


    },
    /*查询字典的接口*/
    getDictList(dictCode) {
      queryDict(dictCode).then((res) => {
        if (dictCode == "post_type") { // 职位类型
          this.postTypeOptions = res.data;
        }
        if (dictCode == "region") { // 人员区域
          this.regionOptions = res.data;
        }
        if (dictCode == "post_level") { // 职位等级
          this.postLevelIdOptions = res.data;
        }
        if (dictCode == "skill_type") { // 人员技能
          this.techniqueOptions = res.data;
        }
        if(dictCode =="post_name"){ // 职位名称
          this.postNameIdOptions = res.data
        }

      });
    },
    init() {},
        submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        // TODO 提交表单
        console.log(this.formData);

          let parame = {
            ...this.formData,
            // carrierId:this.temData.carrierId,
            // status:0
          };
        this.submitLoading = true
          addChance(parame).then((res) => {
            this.submitLoading = false
            let { code, msg } = res;
            this.$message.success(msg);
            this.$refs.elForm.resetFields();
            if (+code == 200) {
              this.$router.push("/chanceManager/chanceList");
            }
          }).catch(()=>{
            this.submitLoading = false
          });
      })
    },
    resetForm() {
      // this.$refs['elForm'].resetFields()
      // 产品要返回
      // 新增 机会
      // const obj = { path: "/chanceManager/chanceList" };
      // this.$tab.closeOpenPage(obj);
        this.$confirm(`确定返回列表页？`, "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // this.$refs["elForm"].resetFields();
            //  this.$router.go(-1)
             const obj = { path: "/chanceManager/ChanceList" };
      this.$tab.closeOpenPage(obj);
        })
        .catch(() => {});
    },
    // 判断当前这个值是否选中了
    editNext(who,data,index){
      // console.log(who,data,index);
      if(who=='region'){
        this.formData.chanceConfigList[index].postTypeActive = false
         this.formData.chanceConfigList[index].postTypeId="" // 职位类型
          this.formData.chanceConfigList[index].postNameId="" // 职位名称
          this.formData.chanceConfigList[index].postLevelId="" // 等级
          this.formData.chanceConfigList[index].expectedCost="--" //// 预计成本
          this.postNameIdOptions= []  // 清空下拉
          this.postLevelIdOptions =[]
        this.regionId=data
      }
      if(who=='postType'){
        this.formData.chanceConfigList[index].postNameIdActive = false
         this.formData.chanceConfigList[index].postNameId="" // 职位名称
          this.formData.chanceConfigList[index].postLevelId="" // 等级
          this.formData.chanceConfigList[index].expectedCost="--" //// 预计成本
          this.postNameIdOptions= []
          this.postLevelIdOptions =[]
        console.log(data,'data')
        this.postTypeId=data
        this.position()

      }
      if(who=='postNameId'){
        this.formData.chanceConfigList[index].postLevelIdActive = false
         this.formData.chanceConfigList[index].postLevelId="" // 等级
          this.formData.chanceConfigList[index].expectedCost="--" //// 预计成本
        this.postNameId=data
        this.level()
      }
       if(who=='postLevelId'){
         this.formData.chanceConfigList[index].nextActive = false
         console.log(this.postLevelIdOptions,'this.postLevelIdOptions')
         this.postLevelIdOptions.map(item=>{
        if(data == item.postLevelId){
           // 选择 职位之后，拿到成本
              if(this.formData.chanceService == 2) {
                //对外
                this.formData.chanceConfigList[index].costNum = item.costOut;
              } else {
                // 对内
                this.formData.chanceConfigList[index].costNum = item.costIn;
              }
        }
         })
        // 此处去请求 成本
        // this.formData.chanceConfigList[index].costNum =  1000// 写死成本为 1000
        // 并计算 下面的周排期
        this.constAll(this.formData.chanceConfigList[index].startEndTime,index)
      }
    },
     /*根据起始和结束 生成下面表格*/
    constAll(dates, index) {
      let params = {
        startDate: dates[0],
        endDate: dates[1],
      };
      getTimeProcess(params).then((res) => {
        // this.formData.chanceConfigList[index].workDay = res.data.day;
        // this.formData.chanceConfigList[index].workDayTemp = res.data.day;
        // this.formData.chanceConfigList[index].workTime = (res.data.day * 8).toFixed(2);
        // this.formData.chanceConfigList[index].startTime = dates[0];
        // this.formData.chanceConfigList[index].endTime = dates[1];
        // this.formData.chanceConfigList[index].expectedCost = (
        //   res.data.day * this.formData.chanceConfigList[index].costNum
        // ).toFixed(2);
        // if (res.data.day === 0) {
        //   this.formData.chanceConfigList[index].planLoad = 0;
        // } else {
        //   this.formData.chanceConfigList[index].planLoad = (
        //     ((8 * res.data.day) / (res.data.day * 8)) *
        //     100
        //   ).toFixed(2); // 计划负荷
        // }
        // res.data.list.map((item) => {
        //   item.startTime = item.startDate;
        //   item.endTime = item.endDate;
        //   item.workTime = item.weekDay!=0?"8":0; // 内部的每周时长
        //   item.workDay = item.weekDay; // 内部的每周人日
        //   item.planLoad = (((item.day * 8) / (item.day * 8)) * 100 || 0).toFixed(2);
        // });
        // this.formData.chanceConfigList[index].chanceConfigScheduleList = res.data.list; // 此人的 每周安排
         this.formData.chanceConfigList[index].workDay = (res.data.day).toFixed(2); // 总共多少人日
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
          item.workTime = item.weekDay!=0?"8":0; // 内部的每周时长
          item.workDay = item.weekDay; // 内部的每周人日
          item.planLoad = (((item.weekDay * 8) / (item.weekDay * 8)) * 100 || 0).toFixed(2);
        });
        this.formData.chanceConfigList[index].chanceConfigScheduleList = res.data.list; // 此人的 每周安排

      });
      this.$forceUpdate()
    },
    changePlanLoad(number, weekDay, fatherIndex, myIndex){
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
    /*修改每日工时*/
    changeDayTime(number, weekDay, fatherIndex, myIndex) {
      // 期间计划负荷 = 当前行的总天数weekDay*number  /  当前行的总天数weekDay * 8
      this.formData.chanceConfigList[fatherIndex].chanceConfigScheduleList[
        myIndex
      ].planLoad = (((weekDay * number) / (weekDay * 8)) * 100 || 0).toFixed(2);
      // 循环 取出每周的工作时长
      let totalTime = 0,
        totalDay = 0;
      this.formData.chanceConfigList[fatherIndex].chanceConfigScheduleList.map(
        (item, i) => {
          if (myIndex == i) {
            // 当前周的工时 转换为天数  计算一下
            // 当前周的天数* 实际工作时长 除以8
            // 等于 实际工作天数

            totalDay += parseFloat(item.weekDay * number);
          } else {
            // 其他的没有修改的 直接 拿天数累加
            totalDay += parseFloat(item.weekDay * item.workTime);
          }
            totalTime += parseFloat(item.workTime) * parseFloat(item.weekDay);
          // item.weekDay = item.day;
          // item.week = item?.weekOfYear
        }
      );
      // 暂存一下 实际的天数
      const tempWorkDay = this.formData.chanceConfigList[fatherIndex].workDayTemp;
      // 顶部的 共计多少小时  多少天
      this.formData.chanceConfigList[fatherIndex].workDay = (totalDay / 8).toFixed(2);
      this.formData.chanceConfigList[fatherIndex].workTime = totalTime.toFixed(2);
      // 顶部的 计划负荷 预计成本
      if (totalDay === 0) {
        this.formData.chanceConfigList[fatherIndex].planLoad = 0;
      } else {
        this.formData.chanceConfigList[fatherIndex].planLoad = (
          (totalDay / (tempWorkDay * 8)) *
          100
        ).toFixed(2);
      }
      this.formData.chanceConfigList[fatherIndex].expectedCost = (
        this.formData.chanceConfigList[fatherIndex].workDay *
        this.formData.chanceConfigList[fatherIndex].costNum
      ).toFixed(2);
    },
    // 删除单行用户
    DelConfigList(index){
      this.formData.chanceConfigList.splice(index, 1);
    },
    // 点击 新增配置的
    addConfigListHandel() {
      //  if(this.formData.projectService==""){
      //         this.$message.error("请您先完整填写项目基础信息！");
      //   }
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        // TODO 上面基础信息填写好 再填写下面，因为需要用到上面的 服务对象和项目有效期
        if (valid) {
          let oneUser = this.deepClone(this.chanceConfigList);
          oneUser.startTime = this.formData.expectStartTime;
          oneUser.endTime = this.formData.expectEndTime;
          oneUser.startEndTime =[this.formData.expectStartTime, this.formData.expectEndTime]

          this.formData.chanceConfigList.push(oneUser);
          this.$forceUpdate();
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
    // 表单数据存储
    sessionStorage.setItem('addProject', JSON.stringify(this.formData))
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  padding: 0;
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
  // margin-left:40px;
  font-size:14px;
  color:#ADB3B9;
  line-height: 40px;
}
.configFont{
  color:#ADB3B9
}
.UserListBox .el-form-item{
  // margin-bottom: 0px;
}


</style>

<style>
    .skillcolor1 {
      background: rgb(0,113,189) !important; color:white!important;
    }
    .skillcolor2 {
      background: rgb(77,171,119) !important; color:white!important;
    }
    .skillcolor3 {
      background: rgb(21,206,190) !important; color:white!important;
    }
    .skillcolor4 {
      background: rgb(147,106,184) !important; color:white!important;
    }
    .skillcolor5 {
      background: rgb(254,213,27) !important; color:white!important;
    }
    .skillcolor6 {
      background: rgb(246,147,28) !important; color:white!important;
    }
    .skillcolor7 {
      background: rgb(255,67,89) !important; color:white!important;
    }
          /* //   { cssClass: 'color1', color: 'rgb(0,113,189)' },
          //   { cssClass: 'color2', color: 'rgb(77,171,119)' },
          //   { cssClass: 'color3', color: 'rgb(21,206,190)' },
          //   { cssClass: 'color4', color: 'rgb(147,106,184)' },
          //   { cssClass: 'color5', color: 'rgb(254,213,27)' },
          //   { cssClass: 'color6', color: 'rgb(246,147,28)' },
          //   { cssClass: 'color7', color: 'rgb(255,67,89)' }, */
  .skillcc .el-tag__close{
    background-color: transparent !important;
  }
</style>
