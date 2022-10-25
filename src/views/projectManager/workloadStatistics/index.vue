<template>
    <div class='work'>
        <!-- <el-row  v-if='mangerJurisdiction || selfJurisdiction'>
            <el-col :span='17'> -->
         <div style='display:flex;justify-content:space-between;' v-if='mangerJurisdiction || selfJurisdiction'>
                 <div class='header'   style='width:40%' >
                    <div>
                        <i class='el-icon-arrow-left point color2' style="margin-right:10px" v-if='selfJurisdiction && drillDowm'  @click='goBack'></i> 
                        <div style="font-size:16px;color:#666666;display:inline-block"><i  @click="showMorTime" class='el-icon-date point'></i><span v-if='dateRange' style="margin-left:15px;">{{dateRange}}</span></div>
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
            <!-- </el-col>
            <el-col :span='7'> -->
                <div style="font-size:16px;color:#666666;width:50%">
                    <el-form ref="form" :model="form" label-width="80px"   v-if="mangerJurisdiction">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="人员" prop="userId" >
                                    <el-select v-model="form.userId" placeholder="请选择人员"  size="medium" filterable clearable  @change='searchUser'>
                                        <el-option v-for='(item) in users' :key='item.userId' :value='item.userId' :label='item.nickName'></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="部门" prop="deptId">
                                    <treeselect v-model="form.deptId"   :options="deptOptions" :show-count="true" placeholder="请选择部门" @input='searchDept' @change='searchDept'/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <span v-else style='float:right;padding-right:20px;'>
                        <span style='margin-right:20px;'>
                            <span>计划负荷</span><span>{{userData.planLoad+'%('+userData.planLoadWorkDay+'人日)'}}</span>
                        </span>
                        <span>
                            <span>实际负荷</span><span>{{userData.realLoad+'%('+userData.realLoadWorkDay+'人日)'}}</span>
                        </span>
                    </span>
                </div>
         </div>
            <!-- </el-col> -->
        <!-- </el-row>         -->
        <!-- 部门效率 -->
        <div v-if="mangerJurisdiction">
            <div v-for="(i,index) in deptData" :key='index' class='table-style'>
                <div class='name'>{{i.deptName}}</div>
                <el-table :data="i.workLoadUserVoList" border class="tableData "
                         :header-row-style="{ height: '14px', 'line-height': '14px' }"
        :header-cell-class-name="headerClassName" style="width:100%">
                    <el-table-column label="执行人员" align="center"  min-width='150' fixed>
                        <template  slot-scope="scope">
                            <span  @click='nameClick(scope.row)' :class="[scope.row.userName != '总计' ? 'colorname' : '']">{{scope.row.userName}}</span>
                        </template>

                    </el-table-column>
                     <el-table-column label="计划负荷" align="center"  min-width='150' fixed>
                        <template  slot-scope="scope">
                            {{ scope.row.planLoad }}%
                            <span class="color1">（{{ scope.row.planLoadWorkDay }}人日）</span>
                        </template>

                    </el-table-column>
                     <el-table-column label="实际负荷" align="center"  min-width='150' fixed>
                        <template  slot-scope="scope">
                            <span :class="['loadType' + scope.row.loadType]">
                        {{ scope.row.realLoad+"%（"+scope.row.realLoadWorkDay + "人日）" }}</span
                      >
                        </template>

                    </el-table-column>
                     <el-table-column label="空闲负荷" align="center"   min-width='150' fixed>
                        <template  slot-scope="scope">
                             <span :class="['loadType' + scope.row.loadType]">
                        {{ scope.row.freeLoad+"%（"+scope.row.freeLoadWorkDay + "人日）" }}</span
                      >
                        </template>

                    </el-table-column>
                    <template v-if='i.workLoadUserVoList&&i.workLoadUserVoList.length>0'>
                         <el-table-column :label="item" align="center" v-for="(item,index) in months" :key='index'>
                        <el-table-column label="计划负荷" align="center"   min-width='150'>
                            <template  slot-scope="scope" v-if='scope.row.workLoadUserWeekVoList[index]'>
                                <span>{{scope.row.workLoadUserWeekVoList[index].planLoadCh+'%'}}</span><span>{{'('+scope.row.workLoadUserWeekVoList[index].planLoadWorkDayCh+'人日)'}}</span>
                            
                            </template>
                        </el-table-column>
                        <el-table-column label="实际负荷" align="center"   min-width='150'>
                          <template slot-scope="{row}">
                                <span :class="[workLoadStyle(row.workLoadUserWeekVoList[index])]">
                                    <span>{{row.workLoadUserWeekVoList[index].realLoadCh+'%'}}</span><span>{{'('+row.workLoadUserWeekVoList[index].realLoadWorkDayCh+'人日)'}}</span>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="空闲负荷" align="center"  min-width='150'>
                           <template  slot-scope="{row}">
                                <span>{{row.workLoadUserWeekVoList[index].freeLoadCh+'%'}}</span><span>{{'('+row.workLoadUserWeekVoList[index].freeLoadWorkDayCh+'人日)'}}</span>
                            
                            </template>
                        </el-table-column>
                    </el-table-column>
                    </template>
                   
                </el-table>
            </div>
           
        </div>
        <!-- 个人效率 -->
        <div v-if='selfJurisdiction'>
            <div class='table-style'>
                <div class='name'>{{userData.userName}}</div>
                <el-table :data="userData.workUserProjectVoList" border class="tableData" style="width:100%" :span-method="arraySpanMethod">
                    <el-table-column label="项目" align="center"  min-width='150' prop='projectName' fixed>
                         <template slot-scope="scope">
                            <span :class="['yuan','yuan'+scope.row.priority]"></span>
                            {{ scope.row.projectName }}
                        </template>

                    </el-table-column>
                     <el-table-column label="项目状态" align="center"   min-width='150' prop='projectStatus' fixed>
                         <template slot-scope="scope">
                            <span :class="[scope.row.projectStatus== 4 ? 'color4' : '']">{{ scope.row.projectStatus | filterProjectStatus }}</span>        
                        </template>

                    </el-table-column>
                    <template v-if='userData.workUserProjectVoList'>
                           <el-table-column :label="item" align="center" v-for="(item,index) in months" :key='index'>

                         <el-table-column label="计划" align="center"   min-width='150'>
                            <template  slot-scope="{row}">
                                <span>{{row.workUserProjectWeekVoList[index].planLoadCh+'%'}}</span><span>{{'('+row.workUserProjectWeekVoList[index].planLoadWorkDayCh+'人日)'}}</span>
                            
                            </template>
                        </el-table-column>
                        <el-table-column label="实际" align="center"   min-width='150'>
                            <template slot-scope="{row}">
                                <span :class="[workLoadStyle(row.workUserProjectWeekVoList[index])]">
                                    <span>{{row.workUserProjectWeekVoList[index].realLoadCh+'%'}}</span><span>{{'('+row.workUserProjectWeekVoList[index].realLoadWorkDayCh+'人日)'}}</span>
                                </span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    </template>
                 
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import moment from "moment";
import "moment/locale/zh-cn";
import { departmentQuery,userQuery } from '@/api/proManager/workloadStatistics.js'
import { queryUserlist} from '@/api/proManager/efficiencyStatistics.js'
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
        // this.drillDowm=this.isJurisdiction('common') ? false : true      
        // this.selfJurisdiction=this.isJurisdiction('common')
        // this.mangerJurisdiction=this.isJurisdiction('deptdirector') || this.isJurisdiction('operatemanage') || this.isJurisdiction('admin')
        if(this.isJurisdiction('deptdirector') || this.isJurisdiction('operatemanage') || this.isJurisdiction('admin')){
            this.mangerJurisdiction=true
            this.drillDowm=true
        }else{
            this.drillDowm=false
            this.selfJurisdiction=true
        }
        //   this.mangerJurisdiction=this.isJurisdiction('admin') || this.isJurisdiction('operatemanage')
        this.defaultDate()
    },
    methods:{  
            // 动态生成 表头样式
    headerClassName(row) {
      // console.log(row.column)
      // if(row.column.property=='total')
      return "proUserList";
    }, 
        workLoadStyle(data){
            if(data.planLoadCh<data.realLoadCh){
                return 'piancha2'
            }else if(data.planLoadCh>data.realLoadCh){
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
            let preOne=moment().subtract(6, "months").format('YYYY/MM/DD')
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
                        if(res.data){
                            let value1 = res.data.find(item => item.workLoadUserVoList.length)
                            if(value1){
                                let value2 = value1.workLoadUserVoList.find(item => item.workLoadUserWeekVoList.length)
                                if (value2.workLoadUserWeekVoList) {
                                    value2.workLoadUserWeekVoList.forEach((v,i)=>{  
                                    let startTime=moment(v.startTime,'YYYY-MM-DD').format('YYYY/MM/DD')
                                    let endTime=moment(v.endTime,'YYYY-MM-DD').format('YYYY/MM/DD')
                                    let time=`${v.weekMonth}月-${v.week}周（${startTime}-${endTime}）`
                                    this.months.push(time)   
                                     })
                                }
                            }
                        }                      
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
                        //  console.log(res.data,'rrrrr')
                        this.userData=res.data
                        if(res.data){
                            if(res.data.workUserProjectVoList.length>0){
                                 let monthDate=res.data.workUserProjectVoList[0].workUserProjectWeekVoList
                                monthDate.forEach((v,i)=>{  
                                      let startTime=moment(v.startTime,'YYYY-MM-DD').format('YYYY/MM/DD')
                                    let endTime=moment(v.endTime,'YYYY-MM-DD').format('YYYY/MM/DD')
                                    let time=`${v.weekMonth}月-${v.week}周（${startTime}-${endTime}）` 
                                    this.months.push(time)   
                            })
                            }
                           
                        }
                       
                    }
                }
              
            })
        },
        //下钻
        nameClick(val){
            console.log(val)
            this.form.userId=''
            if(val.userName == '总计'){ 
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
            // console.log(this.userData[0].workUserProjectVoList)
            if(rowIndex == this.userData.workUserProjectVoList.length-1){
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
color:#3D7DFF;
cursor: pointer;
}
.table-style{
    background:#ffffff;
    padding:0 5px 20px 5px;
    margin-bottom:30px;
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
  .color1 {
    color: #909399;
  }
    .color2 {
    color: #409eff;
  }
</style>
<style lang="scss">
.work{
    thead>:first-child  .is-leaf{
    background:#E8E8F4!important;
    // .myTable .el-table__body-wrapper {
//   margin-top: 0px;
//   // z-index: 2;
// }
.tableData .el-table__fixed {
  // z-index: 5;
//  bottom: 0px !important;
//  margin-top: 0px;
//        box-sizing: content-box;
height: 195px!important;
//         padding-bottom: 10px;
    }
// .myTable .el-table__fixed-right {
//   // z-index: 5;
//  bottom: 0px !important;
// }
// .myTable .el-table__fixed .el-table__fixed-body-wrapper{
//   padding: 5px 0;
// }
 
// .proUserList {
//   height: 20px !important;
//   padding: 2px 0 !important;
// }
  }
}

</style>

