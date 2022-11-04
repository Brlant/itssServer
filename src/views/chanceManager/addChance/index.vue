<template>
  <div class="app-container">
    <div class="routerBar">
      <router-link :to="'/projectManager/proManager'"> &lt; 新建机会</router-link>
      <div class="rightBox">
        <el-button size="mini" @click="submitForm" type="primary">保存</el-button>
        <el-button size="mini" @click="resetForm" type="default">取消</el-button>
      </div>
    </div>
    <div class="titleBar">机会基础信息</div>
      <div class="whiteBox">
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="110px">
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
          <el-col :span="5">
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
            <el-form-item label="职位名称：" :prop="`chanceConfigList.${chanceConfigIndex}.postId`" :rules="rules.chanceConfigItemPostId">
              <el-select v-model="chanceConfigItem.postId" placeholder="请选择职位名称" 
              :disabled="chanceConfigItem.postIdActive"   :style="{width: '100%'}"
              @change="(dates) => editNext('postId',dates, chanceConfigIndex)">
                <el-option v-for="(dict, index) in postIdOptions"  :key="dict.dictCode"
                    :label="dict.dictLabel"
                    :value="dict.dictCode"
                    :disabled="dict.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
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
          <el-col :span="4">
            <el-form-item label=""  >
              <el-button type="primary" size="mini"  @click="DelConfigList(chanceConfigIndex)"> 删除 </el-button>
              <!-- <el-button type="info" size="mini"> 取消 </el-button> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
        <el-col :span="18">
          <el-form-item label="技能需求：" :prop="`chanceConfigList.${chanceConfigIndex}.skillIdList`" :rules="rules.chanceConfigItemSkillIdList" >
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
                  <!-- 
                  @input.native="changeInput($event)"
                 -->
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
} from "@/api/chanceManager/chanceManager";
import {
  getTimeProcess,
} from "@/api/proManager/proManager";
export default {
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
      postIdOptions:[], // 职位名称
      gradeIdOptions:[],  // 职位等级  
      formData: {
        // chanceName: "", //          机会名称
          // chanceStatus: "", //          机会状态：1.新建、2.跟进中、3.已结束、4.已转项目
          // priority: 3, //          优先级（1.最高;2.高，3.普通，4.较低）
          // projectId:null, //      已转项目
          // projectName:null, //      已转项目
          // chanceUserId: "",//       机会负责人id
          // chanceUserName:"", //          机会负责人
          // customer: "", //          客户
          // customerLink: "", //          客户联系人
          // tel: "", //          联系方式
          // budget: undefined, //          客户预算
          // successRate: undefined, //          成功率
          // expectStartTime: "", //          预计开始时间
          // expectEndTime: "", //          预计结束时间
          // expectWork: undefined, //          预计工时（人日）
          // expectOffer: undefined, //          预计报价
          // chanceService: "", //          服务对象(1.对内;2.对外)
          // remark: "", //          备注
          /*------------测试用-----------------*/
          chanceName: "机会测试1", 
          chanceStatus: 1, 
          priority: 3, 
          // projectId:null, 
          // projectName:null, 
          chanceUserId: 2,
          // chanceUserName:"测试", 
          customer: "国药控股合肥奇兵有限公司", 
          customerLink: "周佩煌", 
          tel: "13817242305", 
          budget: 250000, 
          successRate: 85, 
          expectStartTime: "2022-10-01", 
          expectEndTime: "2022-11-20", 
          expectWork: 66, 
          expectOffer: 660000, 
          chanceService: 1, 
          remark: "都很棒", 
          chanceConfigList:[]
      },
      // 配置的基本信息
      chanceConfigList: 
      {
        postId: "", //职位id
        postTypeId:"",//职位类型id
        areaId: "", //区域id
        gradeId: "", //等级id
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
        gradeIdActive:true,
        postIdActive:true,
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
        expectStartTime: [],
        expectEndTime: [],
        expectOffer: [],
        expectOffer: [],
        chanceService: [{
          required: true,
          message: '请选择对内/对外',
          trigger: 'change'
        }],
        remark: [],
        // 配置信息的
        chanceConfigItemAreaId:[{
          required: true,
          message: '请选择区域!',
          trigger: 'change'
        }],
        chanceConfigItemPostId:[{
          required: true,
          message: '请选择职位!',
          trigger: 'change'
        }],
        chanceConfigItemGradeId:[{
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
    this.init();
    this.getDictList("post_type");  //职位类型
    this.getDictList("skill_type");  // 技能 technique 
    this.getDictList("post_name");   // 职位名称 post_name
    this.getDictList("region");     //区域
    this.getDictList("post_level"); // 职位等级 post_level
  },
  methods: {
    chageTextColor(listData, refName) {
      // [
      //   { cssClass: 'color1', color: 'rgb(0,113,189)' },
      //   { cssClass: 'color2', color: 'rgb(77,171,119)' },
      //   { cssClass: 'color3', color: 'rgb(21,206,190)' },
      //   { cssClass: 'color4', color: 'rgb(147,106,184)' },
      //   { cssClass: 'color5', color: 'rgb(254,213,27)' },
      //   { cssClass: 'color6', color: 'rgb(246,147,28)' },
      //   { cssClass: 'color7', color: 'rgb(255,67,89)' },
      // ]
    // // 改变下拉框颜色值
        // console.log(listData);
          // console.log(this.$refs[refName][0]);
          // console.log(this.$refs[refName][0].$el.children[0].children[0]);
          // console.log(this.$refs[refName][0].$el.children[0].children[0].children[0]);

              
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
                    v.classList && v.classList.add( arr[i]['cssClass'] ) ; // 添加类名
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
          this.gradeIdOptions = res.data;
        }
        if (dictCode == "skill_type") { // 人员技能
          this.techniqueOptions = res.data;
        }
        if(dictCode =="post_name"){ // 职位名称
          this.postIdOptions = res.data
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
          addChance(parame).then((res) => {
            let { code, msg } = res;
            this.$message.success(msg);
            if (+code == 200) {
              this.$router.push("/chanceManager/chanceList");
            }
          });
      })
    },
    resetForm() {
      // this.$refs['elForm'].resetFields()
      // 产品要返回
      // 新增 机会
      const obj = { path: "/chanceManager/chanceList" };
      this.$tab.closeOpenPage(obj);
    },
    // 判断当前这个值是否选中了
    editNext(who,data,index){
      // console.log(who,data,index);
      console.log(who);
      if(who=='region'){
        this.formData.chanceConfigList[index].postTypeActive = false
      }
      if(who=='postType'){
        this.formData.chanceConfigList[index].postIdActive = false
      }
      if(who=='postId'){
        this.formData.chanceConfigList[index].gradeIdActive = false
      }
       if(who=='gradeId'){
         this.formData.chanceConfigList[index].nextActive = false
        // 此处去请求 成本
        this.formData.chanceConfigList[index].costNum =  1000// 写死成本为 1000
        // 并计算 下面的周排期
        this.getTimeArea(this.formData.chanceConfigList[index].startEndTime,index)
      }
    },
     /*根据起始和结束 生成下面表格*/
    getTimeArea(dates, index) {
      //  if(this.formData.projectUserList[index].userId==""){
      //   this.$message.error("请先选择项目成员！");
      //   return false
      // }
      this.constAll(dates, index);
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

<style >
.color4 {
  background: #409eff!important; color:white!important;
}
.color2 {
  background: #e6a23c!important; color:white!important;
}
.color1 {
  background: #f56c6c!important; color:white!important;
}
</style>