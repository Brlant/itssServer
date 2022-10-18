<template>
    <div>
        <el-row  v-if='mangerJurisdiction || selfJurisdiction'>
            <el-col :span='15'>
                 <div class='header' >
                    <div>
                        <i class='el-icon-arrow-left' v-if='selfJurisdiction && drillDowm' @click='goBack'></i>
                        <div style="font-size:16px;color:#666666;display:inline-block"><i  @click="showMorTime" class='el-icon-date'></i><span v-if='dateRange' style="margin-left:15px;">{{dateRange}}</span></div>
                        <el-date-picker
                            class='timePickCss'
                            v-model="selectTimes"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            ref='timePick'                  
                            :clearable="false"
                            @change="pickerChange">
                        </el-date-picker>
                    </div>
                     </div>
            </el-col>
            <el-col :span='8'>
                <div style="font-size:16px;color:#666666;">
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-row>
                            <el-col :span="12"  v-if='mangerJurisdiction || drillDowm'>
                                <el-form-item label="人员" prop="userId" >
                                    <el-select v-model="form.userId"  size="medium"  placeholder="请选择人员" filterable clearable  @change='searchUser'>
                                        <el-option v-for='(item) in users' :key='item.userId' :value='item.userId' :label='item.userName'></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12"  v-if="mangerJurisdiction">
                                <el-form-item label="部门" prop="deptId">
                                    <treeselect v-model="form.deptId" :options="deptOptions" :show-count="true" placeholder="请选择部门" @input='searchDept'  @change='searchDept'/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </el-col>
        </el-row>        
        <!-- 部门效率 -->
        <div v-if="mangerJurisdiction">
            <div v-for="(item,index) in deptData" :key='index' class='table-style'>
                <div class='name'>{{item.deptName}}</div>
                <el-table v-if='item' :data="item.userList" border class="tableData" style="width:100%">
                    <el-table-column label="执行人员" align="center" fixed  min-width='150'>
                        <template  slot-scope="scope">
                            <span @click='nameClick(scope.row)' :class="[scope.row.username != '总计' ? 'colorname' : '']">{{scope.row.username}}</span>
                        </template>

                    </el-table-column>
                    <el-table-column :label="item" align="center" v-for="(item,indexs) in months" :key='indexs'>
                        <el-table-column label="计划负荷" align="center"   min-width='150'>
                            <template  slot-scope="scope">
                                <span>{{scope.row.monthEfficiencyList[indexs].scheduleLoad+'%'}}</span><span>{{'('+scope.row.monthEfficiencyList[indexs].scheduleDay+'人日)'}}</span>
                            
                            </template>
                        </el-table-column>
                        <el-table-column label="实际负荷" align="center"   min-width='150'>
                          <template slot-scope="{row}">
                                <span :class="[workLoadStyle(row.monthEfficiencyList[indexs])]">
                                    <span>{{row.monthEfficiencyList[indexs].workLoad+'%'}}</span><span>{{'('+row.monthEfficiencyList[indexs].workDay+'人日)'}}</span>
                                </span>
                                <!-- <span  v-if='workLoadStyle(row.monthEfficiencyList[index])' class='piancha1'>
                                    <span>{{row.monthEfficiencyList[index].workLoad+'%'}}</span><span>{{'('+row.monthEfficiencyList[index].workDay+'人日)'}}</span>
                                </span>
                                 <span  v-else>
                                    <span>{{row.monthEfficiencyList[index].workLoad+'%'}}</span><span>{{'('+row.monthEfficiencyList[index].workDay+'人日)'}}</span>
                                </span>                                 -->
                            </template>
                        </el-table-column>
                        <el-table-column label="问题数量" align="center">
                            <template slot-scope="scope">
                                <span>{{scope.row.monthEfficiencyList[indexs].mistakeNum}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="出产量" align="center">
                            <template slot-scope="scope">
                                <span>{{scope.row.monthEfficiencyList[indexs].yieldNum}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="出产问题率" align="center">
                            <template slot-scope="scope">
                                <span>{{scope.row.monthEfficiencyList[indexs].errorRate}}</span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table>
            </div>
           
        </div>
        <!-- 个人效率 -->
        <div v-if='selfJurisdiction'>
            <div v-for="(item,index) in userData" :key='index'  class='table-style'>
                <div class='name'>{{item.username}}</div>
                <el-table :data="item.projectEfficiencyList" border class="tableData" style="width:100%" :span-method="arraySpanMethod">
                    <el-table-column label="项目" align="center" fixed  min-width='150' prop='projectName'>
                         <template slot-scope="scope">
                            <span :class="['yuan','yuan'+scope.row.priority]"></span>
                            {{ scope.row.projectName }}
                        </template>

                    </el-table-column>
                     <el-table-column label="项目状态" align="center" fixed  min-width='150' prop='projectStatus'>
                         <template slot-scope="scope">
                            <span :class="[scope.row.projectStatus== 4 ? 'color4' : '']">{{ scope.row.projectStatus | filterProjectStatus }}</span>        
                        </template>

                    </el-table-column>

                    <el-table-column :label="item" align="center" v-for="(item,indexs) in months" :key='indexs'>

                         <el-table-column label="计划负荷" align="center"   min-width='150'>
                            <template  slot-scope="{row}">
                                <span>{{row.monthEfficiencyList[indexs].scheduleLoad+'%'}}</span><span>{{'('+row.monthEfficiencyList[indexs].scheduleDay+'人日)'}}</span>
                            
                            </template>
                        </el-table-column>
                        <el-table-column label="实际负荷" align="center"   min-width='150'>
                            <template slot-scope="{row}">
                                <span :class="[workLoadStyle(row.monthEfficiencyList[indexs])]">
                                    <span>{{row.monthEfficiencyList[indexs].workLoad+'%'}}</span><span>{{'('+row.monthEfficiencyList[indexs].workDay+'人日)'}}</span>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="问题数量" align="center">
                             <template slot-scope="scope">
                                <span>{{scope.row.monthEfficiencyList[indexs].mistakeNum}}</span>
                            </template>
                        </el-table-column>
                         <el-table-column label="出产量" align="center">
                            <template slot-scope="scope">
                                <span>{{scope.row.monthEfficiencyList[indexs].yieldNum}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="出产问题率" align="center">
                            <template slot-scope="scope">
                                <span>{{scope.row.monthEfficiencyList[indexs].errorRate}}</span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import moment from "moment";
import "moment/locale/zh-cn";
import { departmentQuery,queryUserlist,userQuery } from '@/api/proManager/efficiencyStatistics.js'
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: { Treeselect },
    data(){
        return {
            dateRange:'',//时间范围
            form:{
                userId:null,
                deptId:null
            },
            selectTimes:'',
            title:'',
            beginDate:'',
            endDate:'',
            userId:'',
            deptId:'',
            departmentName:'',
            adultName:'',
            userInfo:{},
            userData:[],
            deptData:[],
            selfJurisdiction:false,//根据用户的角色判断是展示哪个表格
            mangerJurisdiction:false,
            drillDowm:false,//是否展示返回按钮
            months:[],
            users:[],
            depts:[],
            deptOptions:[]
        }
    },
    created(){       
        console.log(this.$store.state.user.user.userId)    
        this.queryUser() 
        this.getDeptTree()   
        this.drillDowm=this.isJurisdiction('common') ? false : true      
        this.selfJurisdiction=this.isJurisdiction('common')
        this.mangerJurisdiction=this.isJurisdiction('deptdirector') || this.isJurisdiction('operatemanage') || this.isJurisdiction('admin')
        //   this.mangerJurisdiction=this.isJurisdiction('admin') || this.isJurisdiction('operatemanage')
        this.defaultDate()
    },
    methods:{   
        workLoadStyle(data){
            if(data.workLoad>data.scheduleLoad){
                return 'piancha2'
            }else if(data.workLoad<data.scheduleLoad){
                return 'piancha1'
            }else {
                return ''
            }
        },
         /** 查询部门下拉树结构 */
        getDeptTree() {
            treeselect().then(response => {
                this.deptOptions = response.data;
            });
        },
        //获取用户
        queryUser(){
            queryUserlist({}).then(res=>{
                this.users=res.data
            })
        },
        //初始时间
        defaultDate(){
            let preOne=moment().subtract(1,'month').startOf('month').format('YYYY/MM/DD')
            let today=moment().format('YYYY/MM/DD')
            this.dateRange=`${preOne}-${today}`
            this.beginDate=moment(preOne).format('YYYY-MM-DD')
            this.endDate=moment(today,'YYYY/MM/DD').format('YYYY-MM-DD')
            this.userInfo=this.$store.state.user.user          
           if(this.mangerJurisdiction){
            this.queryTable()
           }else if(this.selfJurisdiction && this.drillDowm){
           
            this.userId=this.form.userId
            this.queryTableBySelf()
           }else{
            this.userId=this.userInfo.userId
            this.queryTableBySelf()
           }
        },
        //时间选择器
        showMorTime(){
            this.$refs.timePick.$refs.reference.childNodes[1].focus()
            this.$refs.timePick.$refs.reference.childNodes[3].focus()
        },
        //选择时间调用
        pickerChange(val){   
            let value=[]
                val.forEach(v=>{
                    value.push(moment(v).format('YYYY/MM/DD'))
            })
            if(value[0]==value[1]){
                    this.dateRange=''
            }else{
                this.dateRange=`${value[0]}-${value[1]}`
            }
            this.beginDate=moment(val[0]).format('YYYY-MM-DD')
            this.endDate=moment(val[1]).format('YYYY-MM-DD')
            if(this.mangerJurisdiction){            
            this.queryTable()

            }else if(this.selfJurisdiction && this.drillDowm){
                this.queryTableBySelf()
           }else {
               this.userId=this.userInfo.userId
                this.queryTableBySelf()
           }           
        },
        //通过人员搜索
        searchUser(){
            if(this.mangerJurisdiction){
                this.queryTable()
            }else{
               this.userId=this.form.userId
                this.queryTableBySelf()
            }           
        },
        //通过部门搜索
        searchDept(){
            this.queryTable()
        },
        //查询部门表格方法
        queryTable(){
            this.months=[]
            let data={
                startDate:this.beginDate,
                endDate:this.endDate,
                userId:this.form.userId,
                deptId:this.form.deptId,
            }
            departmentQuery(data).then(res=>{
                if(res.code==200){
                    if(res.data){
                        this.deptData=res.data
                            let value1 = res.data.find(item => item.userList.length)
                             if(value1){
                                let value2 = value1.userList.find(item => item.monthEfficiencyList.length)
                                if (value2.monthEfficiencyList) {
                                    value2.monthEfficiencyList.forEach((v,i)=>{  
                                    this.months.push(v.month)   
                                    })
                                }
                            }
                            // let monthDate=res.data[0].userList[0].monthEfficiencyList
                            // monthDate.forEach((v,i)=>{   
                            //     this.months.push(v.month)   
                            // })
                            // console.log(this.months)
                        }
                       
                }
              
            })
        },
        //查询个人效率表格方法
        queryTableBySelf(){
            this.months=[]
             let data={
                startDate:this.beginDate,
                endDate:this.endDate,
                userId:this.userId,
            }
            userQuery(data).then(res=>{
                if(res.code==200){
                    if(res.data){
                        this.userData=res.data
                         let value1 = res.data.find(item => item.projectEfficiencyList.length)
                             if(value1){
                                let value2 = value1.projectEfficiencyList.find(item => item.monthEfficiencyList.length)
                                if (value2.monthEfficiencyList) {
                                    value2.monthEfficiencyList.forEach((v,i)=>{  
                                    this.months.push(v.month)   
                                    })
                                }
                            }
                        // if(res.data[0]){
                        //     let monthDate=res.data[0].projectEfficiencyList[0].monthEfficiencyList
                        //     monthDate.forEach((v,i)=>{   
                        //         this.months.push(v.month)   
                        //     })
                        // }
                       
                    }
                    
                }
              
            })
        },
        //下钻
        nameClick(val){
            console.log(val)
            this.form.userId=''
            if(val.username == '总计'){
                return;
            }
            this.selfJurisdiction=true
            this.mangerJurisdiction=false
            this.drillDowm=true
           this.userId=val.userId
           this.queryTableBySelf()
        },
        searchQuery(val){
            console.log(val)
        },
        //返回部门表格
        goBack(){
            this.selfJurisdiction=false
            this.mangerJurisdiction=true
            this.drillDowm=false
            this.form.userId=''
            this.queryTable()
        },
        //合计列合并
        arraySpanMethod({ row, column, rowIndex, columnIndex }){
            console.log(rowIndex)
            console.log(this.userData[0].projectEfficiencyList)
            if(rowIndex == this.userData[0].projectEfficiencyList.length-1){
                console.log('qqqqq')
                if (columnIndex === 0) {
                    return [1, 2];
                } else if (columnIndex === 1) {
                    return [0, 0];
                }
            }
        }

   
    }
}
</script>
<style lang="scss" scoped>
.header{
        display: inline-block;
        height:37px;
        width:100%;
        line-height: 37px;
        padding:0 10px;
    }
.timePickCss{
    position: absolute;
    top:0px;
    z-index: -1;
}
.name{
    padding:10px;
}
.color4 {
  color: #f56c6c;
}
.piancha1 {
  color: #26b0a8;
}
.piancha2 {
  color: #f56c6c;
}
.yuan{
  width: 8px;
  height: 8px;
  border-radius: 10px;
  border: none;
  display: inline-block;
  margin-left: 8px;
}
.yuan4 {
  background-color: #909399;
}
.yuan3 {
  background-color: #409eff;
}
.yuan2 {
  background-color: #e6a23c;
}
.yuan1 {
  background-color: #f56c6c;
}
.colorname{
color:#3D7DFF
}
.table-style{
    background:#ffffff;
    padding:0 5px 20px 5px;
    margin-bottom:30px;
}
</style>