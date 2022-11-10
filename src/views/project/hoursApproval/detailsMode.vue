<template>
    <div class="details">
        <div class='header'>
            <div>
                <div style="font-size:16px;color:#666666;"><i  @click="showMorTime" class='el-icon-date'></i><span style="margin-left:15px;">{{dateRange}}</span></div>
                <el-date-picker
                    class='timePickCss'
                    v-model="selectTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    ref='timePick'
                    :clearable="false"
                     @change="pickerChange">
                </el-date-picker>
            </div>
            <div style="font-size:16px;color:#666666;">
                <span @click="select(0)" :class='{curren:n==0}'>待审批</span>|
                <span @click="select(1)" :class='{curren:n==1}'>已审批</span>|
                <span @click="select(2)" :class='{curren:n==2}'>审批拒绝</span>|
                <span @click="select(3)" :class='{curren:n==3}'>全部</span>
            </div>
        </div>
        <div v-for='(item1,index) in detailDatas' :key='index'>
            <div class="project-date">{{item1.workDate}}</div>
            <div  v-for='(item2,index) in item1.memberList' :key='index'>
                <div class="project-head">
                    <el-row type="flex" class="row-bg" justify="center" style="margin-bottom:20px;">
                        <el-col :span="7">
                            <span>项目名称：{{item2.projectName}}</span>
                        </el-col>
                        <el-col :span="4">
                            <span>姓名：{{item2.userName}}</span></el-col
                        >
                        <el-col :span="7">
                            <span>当日排期工时：{{item2.scheduleWorkTime}}</span></el-col
                        >
                        <el-col :span="6">
                            <span>当前对比：
                                <span v-if='item2.projectScheduleWorkTime<item2.projectWorkTime' style="color:#FF435A">+{{item2.comparison + '小时'}}</span>
                                <span v-else-if='item2.projectWorkTime<item2.projectScheduleWorkTime' style="color:#75f1e8">-{{item2.comparison +'小时'}}</span>
                                <span v-else>--</span>
                            </span>
                        </el-col>
                    </el-row>
                </div>
                <div class="list" v-for='(item3,index) in item2.timeTrackList' :key='index'>
                     <div>
                        <div style="width: 95%; display:inline-block;padding:20px;">
                            <el-row type="flex" class="row-bg" justify="center" style="margin-bottom:20px;">
                            <!-- <el-col :span="4">
                                <span>项目名称：{{item2.projectName}}</span>
                            </el-col> -->
                            <el-col :span="8">
                                <span>标题：{{item3.workTitle}}</span></el-col
                            >
                            <el-col :span="6">
                                <span>工作类型：{{item3.workTypeName}}</span></el-col
                            >
                            <el-col :span="5">
                                <span>工作时长：{{item3.workTime}}</span></el-col
                            >
                            <el-col :span="4">
                                <span>状态：{{filterStatus(item3.status)}}</span></el-col
                            >
                            </el-row>
                            <el-row type="flex" class="row-bg" justify="center">
                            <el-col :span="24">
                                <span>工作内容：{{item3.workContent}}</span></el-col
                            >
                            </el-row>
                        </div>
                        <div style="width: 5%; text-align: center; border-left: 1px solid #ddd;display:inline-block;padding:20px;" v-if='item3.status==0 && projectdirector'>
                            <div v-hasPermi="['project:approval:leader']"> <el-button class="editBtn" type="text" @click='pass(item3)'>通过</el-button></div>
                            <div v-hasPermi="['project:approval:leader']"> <el-button type="text" class="rejectBtn" @click='noPass(item3)'>拒绝</el-button></div>
                        </div>

                        <div style='background:#f7d3d3;color:red;padding:5px 20px' v-if="item3.status==2 && item3.rejectReason">{{item3.rejectReason}}</div>
                    </div>
                </div>
            </div>
        </div>
          <el-dialog
            :visible.sync="dialogVisible"
            width="30%" title='请输入拒绝理由'>
            <el-form :model="form">
                <el-form-item>
                    <el-input v-model="form.reason" type="input" placeholder="请输入"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="surenoPass">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import moment from "moment";
import "moment/locale/zh-cn";
import { datailApproval } from '@/api/workproject/approval.js'
export default{
    props:['detailDatas','queryId','start','end'],
    data(){
        return{
            selectTime:'',
            n:0,
            dateRange:'',
            beginDate:moment().format('YYYY-MM-DD'),
            endDate:moment().format('YYYY-MM-DD'),
            status:0,
            dialogVisible:false,
            trackId:'',
            form:{reason:''},
            projectdirector:''

        }
    },
   created(){
     this.projectdirector=this.isJurisdiction('projectdirector')
     let a=moment(this.start,'YYYY-MM-DD').format('YYYY/MM/DD')
    let b=moment(this.end,'YYYY-MM-DD').format('YYYY/MM/DD')
     this.dateRange=a+'-'+b
   },
    methods:{
            filterStatus(item){
                if(item==0){
                    return '待审批'
                }else if(item == 1){
                    return '主管已审批'
                }else if(item == 2){
                    return '审批拒绝'
                }

            },
        select(index){
            this.n=index
            if(index!=3){
                this.status=index
            }else{
                this.status=''
            }

            this.searchParent()

        },
        showMorTime(){
            this.$refs.timePick.$refs.reference.childNodes[1].focus()
             this.$refs.timePick.$refs.reference.childNodes[3].focus()
        },
        pickerChange(val){
            console.log(val,'aaa')
            let value=[]
            val.forEach(v=>{
                value.push(moment(v).format('YYYY/MM/DD'))
            })

            this.dateRange=`${value[0]}-${value[1]}`
           this.beginDate=moment(val[0]).format('YYYY-MM-DD')
           this.endDate=moment(val[1]).format('YYYY-MM-DD')
          this.searchParent()
        },
        searchParent(){
           let query={
           startDate:this.beginDate,
           endDate:this.endDate,
           status:this.status
           }
           this.$emit('datailParent',query)
        },
         pass(val){
             if(this.queryId.includes(val.projectId)){
                 let data={
                    trackId:val.id,
                    approved:true
                }
             this.approval2(data)
             }else{
               this.$message.error('没有审批权限')
             }


        },
        noPass(val){
            if(this.queryId.includes(val.projectId)){
            this.trackId=val.id
            this.dialogVisible=true
            }else{
                 this.$message.error('没有审批权限')
            }
        },
        surenoPass(){
            let data={
                trackId:this.trackId,
                approved:false,
                reason:this.form.reason

            }
            this.approval2(data)
            this.dialogVisible=false
        },
        approval2(data){
               datailApproval(data).then(res=>{
                if(res.code==200){
                    this.$message.success(res.msg)
                    this.$emit('datailParent',{startDate:this.beginDate,endDate:this.endDate,status:this.status
           })
                }else{
                    this.$message.error(res.msg)
                }
            })
        },
    }

}
</script>
<style lang="scss" scoped>
.details{
    .header{
        background:#ffffff;
        display: flex;
        justify-content: space-between;
        height:37px;
        line-height: 37px;
        padding:0 10px;
    }
    .project-date{
        font-size:20px;
        margin:15px 10px;
    }
    .project-head{

        background:#8295A8;
        height:40px;
        line-height:40px;
        padding: 0 30px;
        color:#ffffff;
    }
    .list{
         background:#ffffff;
         margin-bottom:20px;
    }
    .rejectBtn{
         color:#FF435A;
    }
}
.timePickCss{
    position: absolute;
    top:0px;
    // right: 100px;
    z-index: -1;
}
</style>
