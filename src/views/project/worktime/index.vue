<template>
  <div class="">
    <div style="padding: 10px">
      <div @click="showMorTime" style='width:105px;'><i class='el-icon-date'></i><span style="color:#557CB5;margin-left:10px;font-size:14px;cursor:pointer;">日历查看<i class='el-icon-arrow-down'></i></span></div>
      <el-date-picker
      class='timePickCss'
        v-model="selectTime"
        type="date"
        ref="timePick"
        @change="pickerChange"
        @blur='clickDate'
        :clearable="false"
        :editable="false"
        placeholder="选择日期"
        :picker-options="customPickerOptions"
        @focus="initCustomDate"
      >
      </el-date-picker>
    </div>
    <div>
      <div class="content">
        <div class="hidden-sm-and-down" @click="weekPre">
          <i class="el-icon-arrow-left" style="color: #ffffff"></i>
        </div>

        <div
          v-for="(item, index) in weekList"
          :key="index"
          @click="onTabClick(index, item)"
          :class="['date-item', { current: index === n }]"
          style="color: #ffffff;cursor:pointer;"
        >
          {{ item.date + item.name }}
        </div>
        <div class="hidden-sm-and-down" @click="weekNext">
          <i class="el-icon-arrow-right" style="color: #ffffff"></i>
        </div>
      </div>
      <div class="plan-title">
        <span>当日排期计划：
          <span v-if="plan.length != 0">
            <span v-for='(item,index) in plan' :key='index'>
              {{item.projectName}}{{`(${item.currentDayScheduleTime}h)`}}
              <span v-if='item.currentProjectTotalWorkTime<item.currentProjectScheduleTime'>
                  <span style="color:#00A99D">{{',总体-'+(item.comparison)}}</span>
                  <span>小时</span>
              </span>
             <span  v-if='item.currentProjectTotalWorkTime>item.currentProjectScheduleTime'>
                <span style="color:#FF435A">{{',总体+'+(item.comparison)}}</span>
                <span>小时</span></span><span v-show="index < plan.length - 1">;</span>
            </span>
          </span>
          <span v-if="plan.length == 0">无</span>
        </span>
      </div>
    </div>
    <div class="submitted-time">
      <div>已提交工时</div>
      <div>
        <span>当日工时：{{data.currentDayTotalTime}}</span>
        <span>本周工时：{{data.currentWeekTotalTime}}</span>
        <span>已审核完成：{{data.currentWeekApprovedTotalTime}}</span>
      </div>
    </div>
    <div style="width: 100%" v-if="list.length>0">
      <div  v-for="(item, index) in listOne" :key="index"  class="time-style">
        <div   v-if='item.id!=editId' style="min-height:120px;">
          <div style="width: 90%; border-right: 1px solid #ddd;display:inline-block;padding-left:20px;">
            <el-row type="flex" class="row-bg" justify="center" style="margin-bottom:20px;">
              <el-col :span="4">
                <span class="star">*</span><span>项目名称：</span
                ><span>{{item.projectName}}</span>
              </el-col>
              <el-col :span="7">
                <span class="star">*</span><span>标题：</span
                ><span>{{item.workTitle}}</span></el-col
              >
              <el-col :span="5">
                <span class="star">*</span><span>工作类型：</span
                ><span>{{item.workTypeName}}</span></el-col
              >
              <el-col :span="4">
                <span class="star">*</span><span>工作时长：</span
                ><span>{{item.workTime}}</span></el-col
              >
              <el-col :span="4">
                <span class="star">*</span><span>状态：</span
                ><span :class="[{ status: item.status == 2 }]">{{filterStatus(item.status)}}</span></el-col
              >
            </el-row>
            <el-row type="flex" class="row-bg" justify="center">
              <el-col :span="24">
                <span class="star">*</span><span>工作内容：</span
                ><span>{{item.workContent}}</span></el-col
              >
            </el-row>
          </div>
          <div style="width: 10%; text-align: center; display:inline-block">
            <div> <el-button class="editBtn" type="text"  @click="edit(item)" :disabled='item.status==1'>编辑</el-button></div>
            <div > <el-button type="text" class="delBtn"  @click='del(item)'  :disabled='item.status==1'>删除</el-button></div>
          </div>
          <div style='background:#f7d3d3;color:red;padding:5px 20px' v-if='item.status == 2 && item.rejectReason'>{{item.rejectReason}}</div>
        </div>
      </div>
      <div>
         <div v-for="(item, index) in listTwo" :key="index" class="time-style">
          <div  v-if='item.id!=editId'   style="min-height:120px;">
            <div style="width: 90%; border-right: 1px solid #ddd;display:inline-block;padding-left:20px;">
              <el-row type="flex" class="row-bg" justify="center" style="margin-bottom:20px;">
                <el-col :span="4">
                  <span class="star">*</span><span>项目名称：</span
                  ><span>{{item.projectName}}</span>
                </el-col>
                <el-col :span="7">
                  <span class="star">*</span><span>标题：</span
                  ><span>{{item.workTitle}}</span></el-col
                >
                <el-col :span="5">
                  <span class="star">*</span><span>工作类型：</span
                  ><span>{{item.workTypeName}}</span></el-col
                >
                <el-col :span="4">
                  <span class="star">*</span><span>工作时长：</span
                  ><span>{{item.workTime}}</span></el-col
                >
                <el-col :span="4">
                  <span class="star">*</span><span>状态：</span
                  ><span  :class="[{ status: item.status == 2 }]">{{filterStatus(item.status)}}</span></el-col
                >
              </el-row>
              <el-row type="flex" class="row-bg" justify="center">
                <el-col :span="24">
                  <span class="star">*</span><span>工作：</span
                  ><span>{{item.workContent}}</span></el-col
                >
              </el-row>
            </div>
            <div style="width: 10%; text-align: center;display:inline-block">
             <div> <el-button class="editBtn" type="text"  @click="edit(item)" :disabled='item.status==1'>编辑</el-button></div>
            <div > <el-button type="text" class="delBtn"  @click='del(item)'  :disabled='item.status==1'>删除</el-button></div>
            </div>
            <div style='background:#f7d3d3;color:red;padding:5px 20px' v-if='item.status == 2 && item.rejectReason'>{{item.rejectReason}}</div>
          </div>
      </div>
      </div>
    </div>
     <div @click='more' v-if="show" class='more'><span>展开显示更多<i class='el-icon-arrow-down'></i></span></div>
    <div v-if='list.length==0' class="not-submitted">尚未提交</div>
     <div style="margin:10px 20px; color:#708399">
      {{editId==-1 ? '新增' : '编辑'}}工时
    </div>
     <div style="width: 100%">

        <div style="padding: 20px; display: flex;margin:10px 0;" v-for='(item,index) in datalist' :key="index"  class='time-style'>
          <div style="width: 90%;">
            <my-form :formList='item' :projectName='projectName' :workName='workName' :ref="index"></my-form>
          </div>
          <div class="parent" v-if='editId == -1' style=" border-left: 1px solid #ddd">
            <div @click="add" class="child">添加</div>
            <div @click="remove(index)" class="child" v-if='datalist.length>1'>删除</div>
          </div>
        </div>
      </div>
      <div style="text-align:center">
         <el-button type="primary" @click='submit'>提交审核</el-button>
      </div>
  </div>
</template>
<script>
import moment from "moment";
import "moment/locale/zh-cn";
import MyForm from './MyForm'
import { queryTime,projectList,workType,addworkingHour,editworkingHour,delHour,queryDate} from '@/api/workproject/worktime'
moment.locale("zh-cn");
export default {
  components: {
    MyForm
  },
  data() {
    return {
      selectTime: "",
      customDateArr: [],
      weekList: [],
      activeName: "1",
      n: -1,
      days: [],
      weekStart: "",
      lastWeekStart: "",
      lastWeekLast: "",
      weekLast: "",
      show: false,
      list:[],
      listOne:[],
      listTwo:[],
      datalist:[{
        projectId:'',
        workTypeId:'',
        workTime:'',
        workContent:'',
        workTitle:''
      }],
      plan:[],
      editId:-1,
      projectName:[],
      workName:[],
      data:{},
      workDate:'',
      setClick:false
    };
  },
   computed:{
      customPickerOptions () {
        let that = this
          return {
            cellClassName (Date) {
              if (that.customDateArr.includes(moment(Date).format('YYYY-MM-DD'))) {
              // 自定义的类名, 自行确保这个类型的唯一性,以免覆盖样式
                return 'custom_date_class'
              }
            }
          }
        }
    },
  created() {
    // 本周周一
    this.weekStart = moment().startOf("week").format("YYYY/M/D");
    //本周周日
    this.weekLast = moment().endOf("week").format("YYYY/M/D");
    this.pickerChange(new Date());
    let defaultTime=moment().format('YYYY-MM-DD');
    this.workDate=defaultTime
    // this.queryProject(defaultTime)
    let defaultDate=moment().format('YYYY-MM')
    this.getMarkDate(defaultDate)
    this.getProject()
    this.workTypes()
  },

  methods: {
    //工作类型
    workTypes(){
      workType('work_type').then(res=>{
        this.workName=res.data
      })
    },
    //获取项目
    getProject(){
      let workDate =  this.workDate
        projectList(workDate).then(res=>{
          this.projectName=res.data
        })
    },
    filterStatus(item){
      if(item==0){
        return '待审批'
      }else if(item == 1){
        return '主管已审批'
      }else {
        return '审批拒绝'
      }

    },
    showMorTime(){
        this.$refs.timePick.$refs.reference.$refs.input.focus();
    },
    //获取工时
    queryProject(time){
      let data={workDate:time}
      this.listTwo=[]
      this.show=true
      queryTime(data).then(res=>{
          this.data=res.data
          this.list=res.data.currentDayTimeTrackList
          this.plan=res.data.projectScheduleTimeList
          if(this.list.length>2){
            this.show=true
            this.listOne=this.list.filter((item,index)=>{
                return index<2
            })
          }else{
          this.show=false
          this.listOne= this.list
        }
      })
    },
   async addEvent() {
    await this.$nextTick()
    if (this.setClick) return
    // document.querySelector('.el-month-table').addEventListener('click', () => {
    //   this.monthChange()
    // })

    document.querySelectorAll("[aria-label='下个月'],[aria-label='上个月'],[aria-label='后一年'],[aria-label='前一年']")
      .forEach(item => item.addEventListener('click', () => {
      this.monthChange()
    }))
    this.setClick = true
  },
  monthChange() {

    let dateClick=this.$refs['elPicker'].picker.date
    let timeDate=moment(dateClick).format('YYYY-MM')

   this.getMarkDate(timeDate)
  },
  //获取日期
  getMarkDate(time){
     queryDate({month:time}).then(res=>{
      this.customDateArr=res.data
    })
  },
//日期标记
     async initCustomDate (Date) {
       setTimeout(() => {

         this.addEvent()
        //  this.customDateArr = ['2022-08-24', '2022-08-27', '2022-09-10', '2022-08-15']
       }, 100)
     },
    more(){
      if(this.list.length>2){
      this.show=false
      this.listTwo=this.list.filter((item,index)=>{
          return index>=2
      })
    }
    },
    watch() {
      this.$refs.datePickerRef.$el.click();
    },
    pickerChange(value, item) {
      console.log(111)
      this.listTwo=[]
      let time=moment(value).format('YYYY-MM-DD')
       this.weekStart=time
      this.weekLast=time
      this.workDate=moment(time, 'YYYY/M/D').format('YYYY-MM-DD')
      this.queryProject(time)
      if (value.getDay() === 0) {
        this.n = 6;
      } else {
        this.n = value.getDay() - 1;

      }
      this.projectList = [];
      this.ticketList = [];
      if (item != 1) {
        this.selectTime = value;
      }

      let result = this.getWeekNumber(this.selectTime);
      let year = result[0];
      let weeks = result[1];
      if (this.currentWeeks !== weeks) {
        this.currentWeeks = weeks;
        this.getWeekList(
          new Date(
            Date.UTC(value.getFullYear(), value.getMonth(), value.getDate())
          )
        );
      } else {
        this.getWeekList(
          new Date(
            Date.UTC(value.getFullYear(), value.getMonth(), value.getDate())
          )
        );
      }
    },
    clickDate(aa){
      console.log('aa',aa.picker.date)
        // let time=moment(aa.picker.date).format('YYYY-MM-DD')
       this.pickerChange(aa.picker.date)
    },
    getWeekNumber(d) {
      let date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
      var yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
      var weekNo = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
      return [date.getUTCFullYear(), weekNo];
    },
    getMonthDate(time) {
      let d = time,
        day = d.getDay(),
        date = d.getDate();
      if (day === 1) {
        return d;
      }
      if (day === 0) {
        d.setDate(date - 6);
      } else {
        d.setDate(date - day + 1);
      }
      return d;
    },
    onTabClick(tab, event) {
      if (this.n === tab) return;
      this.n = tab;
      let time = this.weekList[tab].date;
      this.workDate=moment(time, 'YYYY/M/D').format('YYYY-MM-DD')
       this.queryProject(this.workDate)
       this.getProject()
      this.pickerChange(new Date(time));
      this.listTwo=[]
    },
    // 0-6转换成中文名称
    getDayName(date) {
      let day = parseInt(date);
      if (isNaN(day) || day < 0 || day > 6) {
        return false;
      }
      let weekday = [
        "星期天",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      return weekday[day];
    },
    getWeekList(date) {
      // d是当前星期一的日期对象
      let d = this.getMonthDate(date);
      this.weekList = [];
      for (let i = 0; i < 7; i++) {
        this.weekList.push({
          date: d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate(),
          name: this.getDayName(d.getDay()),
        });
        d.setDate(d.getDate() + 1);
      }
    },
    weekPre() {
      this.lastWeekStart = moment(this.weekStart, "YYYY/M/D").subtract(7, "days").format("YYYY/M/D");
      this.weekStart = this.lastWeekStart;
      this.pickerChange(new Date(this.lastWeekStart), 1);
       this.weekLast = moment(this.weekStart).endOf("week").format("YYYY/M/D");
      this.n = -1;
    },
    // // 下个星期
    weekNext() {
      this.lastWeekLast = moment(this.weekLast, "YYYY/M/D").add(7, "days").format("YYYY/M/D");
      this.weekLast = this.lastWeekLast;
       this.weekStart = moment(this.weekLast).startOf("week").format("YYYY/M/D");
      this.pickerChange(new Date(this.lastWeekLast), 1);
      this.n = -1;
    },
    //添加
    add(){
      let form={
        projectId:'',
        workTypeId:'',
        workTime:'',
        workContent:'',
        workTitle:''
      }
      this.datalist.push(form)
    },
    remove(index){
      console.log(index)

      this.datalist.splice(index,1)
        // this.datalist=[{}]
          this.datalist.forEach((v, i) => {
            this.$refs[i][0].reset()
          })
    },
    //编辑
  edit(item){

    this.editId=item.id
    this.datalist.length=0
    this.datalist.push(item)
  },
  //删除
  del(item){
    console.log(item.id,'aaaa')
    delHour(item.id).then(res=>{
      if(res.code==200){
        this.$message.success(res.msg)
        this.queryProject(item.workDate)
         this.editId=-1
        this.listTwo=[]
      }else{
        this.$message.error(res.msg)
      }
    })
  },
     //添加,编辑工时
  submit(){
    let flagList = []
    console.log('datalist',this.datalist)
    this.datalist.forEach((v, i) => {
      flagList.push(this.$refs[i][0].validate())
    })
    const flag = flagList.every(v => v)
    if (!flag) return


    if(this.editId == -1){
        this.datalist.forEach(v=>{
          v.workDate=this.workDate
        })
       addworkingHour(this.datalist).then(res=>{
        if(res.code==200){
          this.$message.success('提交成功')
          this.queryProject(this.datalist[0].workDate)
          // this.datalist=[{}]
          this.datalist.forEach((v, i) => {
            this.$refs[i][0].reset()
          })
        }else {
          this.$message.error(res.msg)
        }
      })
    }else{
       this.datalist.forEach(v=>{
          v.workDate=this.workDate
          v.id=this.editId
        })
       editworkingHour(this.datalist[0]).then(res=>{
        if(res.code==200){
          this.$message.success('编辑成功')
          this.queryProject(this.datalist[0].workDate)
          this.datalist.forEach((v, i) => {
            this.$refs[i][0].reset()
          })
          this.editId=-1
           this.listTwo=[]
        }else {
          this.$message.error(res.msg)
        }
      })
    }
  }
  },

};
</script>
<style lang='scss'>
.content {
  background: #547cb8;
  height: 52px;
  line-height: 52px;
  display: flex;
  justify-content: space-around;
}
.plan-title {
  background: #acbddb;
  height: 32px;
  line-height: 32px;
  color: #ffffff;
  padding-left: 45px;
}
.date-item {
  width: 180px;
  height: 42px;
  margin-top: 5px;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.current {
  background: rgba(255, 255, 255, 0.3);
}
.status{
   color: red;
}
.star {
  color: red;
}
.time-style{
  background:#ffffff;
  margin-bottom:10px;
}
.not-submitted{
width:100%;
height:100px;
text-align:center;
line-height:100px;
}
.parent {display: table;
width:10%;
.child {
display: table-cell;
vertical-align: middle;
text-align: center;
color:#557CB5;
cursor:pointer;
}}
.more{
  text-align: center;
  margin:10px 0;
  color:#557CB5;
}
.submitted-time{
 color:#708399;
 padding:10px 20px;
display: flex;
justify-content: space-between;
div{
margin:10px 0;
span{
  margin-left:10px;
}
}
}
.editBtn{
  color:#557CB5;
  margin-bottom:20px;
}
.delBtn{
  color:#FF435A;
}
.custom_date_class {
  &::after {
    content: "";
    width:4px;
    height:4px;
    border-radius: 2px;
    display: inline-block;
    position: absolute;
    // width: 100%;
    font-size: 12px;
    // color: red;
    bottom: -4px;
    left: 20px;
    text-align: center;
    white-space: nowrap;
    background:#557CB5;
  }
}

.el-date-picker-custom {
// 用了/deep/后不兼容ie,所以还是不要随便加上样式穿透,vue-cli3以上也不支持/deep/
// /deep/
.el-date-table td {
    padding: 10px 0;
  }
}
.timePickCss{
    position: absolute;
    top:0px;
    // right: 100px;
    z-index: -1;
}
</style>
