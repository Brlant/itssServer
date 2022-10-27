<template>
    <div class="compact">
        <div class="header">
            <div class='left'></div>
            <div class="select-date">
                <div>  
                    <el-button round @click='pre' style='color:#409EFF;'><i class='el-icon-arrow-left'></i>上一周</el-button>
                    <span style='margin:0 5px;font-size:18px;'>
                        <span>{{childData.year1}}</span>
                        <span v-if='childData.year1 != childData.year2'>{{'、'+childData.year2}}</span>
                        年
                        <span>{{childData.month1}}</span>
                        <span v-if="childData.month1 != childData.month2">{{'、'+childData.month2}}</span>月 
                        <span style="margin-left:5px">{{childData.week}}周</span></span>
                    <el-button round @click='next' style='color:#409EFF;'>下一周<i class='el-icon-arrow-right'></i></el-button></div>  
                </div>
            <div class="select-input">
                <span>搜索</span> 
                <el-input
                    placeholder="请输入项目名称"
                    v-model="inputProject" @blur='search'>
                    <i slot="prefix" class="el-input__icon el-icon-search" @click="search"></i>
                </el-input>
            </div>
           
        </div>
        <div v-if='childData.list'>
            <div class="project-list" v-for='(item,index) in childData.list' :key='index'>
                <div class="project">
                    <div @click='show(index)'><span>{{item.projectName}}</span><i class="el-icon-arrow-down" v-if='thisIndex.indexOf (index)!=-1' style='font-size: 14px;'></i><i class="el-icon-arrow-up" style='font-size: 14px;' v-else></i></div>
                    <div>
                        <span class='span1'>计划
                            <span class='span2'>{{item.scheduleWorkTimeTotal}}</span>小时</span>
                        <span class='span1'>已审
                            <span class='span2'>{{item.approvedWorkTimeTotal}}</span>小时</span>
                        <span class='span1'>待审
                            <span class='span2'>{{item.approvalPendingWorkTimeTotal}}</span>小时</span>
                    </div>
                </div>
                <el-table :data="item.memberList" border  v-if='thisIndex.indexOf (index)!=-1' style="width: 100%"   :header-cell-style="{'text-align':'center'}"
                    :cell-style="{'text-align':'center'}">
                    <el-table-column  v-for="(i,index) in tableHead" :key="index" :label="i.label" :property='i.property' :min-width='i.label=="所属部门"? "250" : "200"'> 
                        <template slot-scope="scope">
                            <div class="row">
                                <!-- <div v-html="matchData(scope.row, index).content" class="html"></div> -->
                                <div class="left" v-if='index<=4'>
                                    {{matchData(scope.row, index).content}}
                                </div>
                                <div class='right' v-else>
                                    <span style="color:#cfc5c5;" v-if="matchData(scope.row, index).approvedWorkTime">{{matchData(scope.row, index).approvedWorkTime}}</span>
                                    <span v-if="matchData(scope.row, index).approvalPendingWorkTime">
                                        <span v-if="matchData(scope.row, index).approvedWorkTime" style='margin:0 10px;'>|</span>
                                        <span  style="color:#333;">{{matchData(scope.row, index).approvalPendingWorkTime}}</span></span>
                                    <span v-if="matchData(scope.row, index).approvalRejectionWorkTime">
                                        <span v-if='matchData(scope.row, index).approvalPendingWorkTime || !matchData(scope.row, index).approvalPendingWorkTime && matchData(scope.row, index).approvedWorkTime'  style='margin:0 10px;'>|</span>
                                        <span  style="color:red">{{matchData(scope.row, index).approvalRejectionWorkTime}}</span></span>
                                </div>
                                <div v-if='projectdirector'>
                                    <div class="icon" v-if="matchData(scope.row, index).show" style='margin-top:10px;'>
                                        <div class="pass" @click='agree(matchData(scope.row, index).workDate,scope.row,item.projectId)'>
                                            <i class="el-icon-check"></i>
                                        </div>
                                        <div class="reject" @click='reject(matchData(scope.row, index).workDate,scope.row,item.projectId)'>
                                            <i class="el-icon-close"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
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
                <el-button type="primary" @click="sureJect">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import moment from "moment";
import "moment/locale/zh-cn";
import handleTableData from '@/utils/handleTableData'
import { approval } from '@/api/workproject/approval.js'
export default {
    props:['childData','queryId'],
    data(){
        return {
            today:'',
            zhankai:false,
             thisIndex: [],
            tableHead:[],
            inputProject:'',
            preDate:'',
            nextDate:'',
            dialogVisible:false,
            form:{reason:''},
            val:{},
            row:{},
            id:-1,
            projectdirectior:false

        }
    },
    created(){
            // this.tableTitle()
            this.today=moment().format('YYYY-MM-DD') 
            this.projectdirector=this.isJurisdiction('projectdirector')
            console.log(this.projectdirector)
    },
    watch: {
        childData: {
            handler(val) {
                console.log('sssss',val.list.length)
                if(val.list.length>0){
                    this.tableTitle()
                }
                
            },
            deep: true,
        }
    },
    methods:{
        matchData(row, index) {        
            return handleTableData(row, index)
        },
        tableTitle(){
            const anotherTableHead = [
                {
                    label: '执行人员',
                    property: 'username'
                },
                {
                    label: '所属部门',
                    property: 'deptName'
                },
                 {
                    label: '计划（小时）',
                    property: 'scheduleWorkTime'
                },
                 {
                    label: '已审（小时）',
                    property: 'approvedWorkTime'
                },
                {
                    label: '待审（小时）',
                    property: 'approvalPendingWorkTime'
                }
            ];
            let tableHead2=this.childData.list[0].memberList[0].timeTrackList
            let head=[]
            tableHead2.forEach((item,index) => {
                // console.log(item,index)
               head.push({label:item.workDate,property:`workDate${index}`})

            });
            this.tableHead=[...anotherTableHead,...head]
           
        },
         show(index) {
            if(this.thisIndex.indexOf(index) == -1){
                this.thisIndex.push(index)
            }else{
                this.thisIndex = this.thisIndex.filter(item => item != index)
            }
        },
        agree(val,row,id){
            if(this.queryId.includes(id)){
                let data={
                    userId:row.userId,
                    workDate:val.workDate,
                    workTime:val.approvalPendingWorkTime,
                    approved:true,
                    projectId:id
                }   
            this.approval1(data)
            }else{
                this.$message.error('没有审批权限')
            }
          
         
        },

        reject(val,row,id){
            if(this.queryId.includes(id)){
                 this.val=val
                this.row=row
                this.id=id
                this.dialogVisible=true
               }else{
                 this.$message.error('没有审批权限')
               }
           
        },
        sureJect(){
             let data={
                userId:this.row.userId,
                workDate:this.val.workDate,
                workTime:this.val.approvalPendingWorkTime,
                approved:false,
                projectId:this.id,
                reason:this.form.reason

            }   
            this.approval1(data)
            this.dialogVisible=false
        },
        approval1(data){
               approval(data).then(res=>{
                if(res.code==200){
                    this.$message.success(res.msg)
                     this.$emit('parentSearch',{time:this.today,name:this.inputProject})
                }else{
                    this.$message.error(res.msg)
                }
            })
        },
        //搜索
        search(){
            this.$emit('parentSearch',{time:this.today,name:this.inputProject})
        },
        //上一周
        pre(){
            this.preDate = moment(this.today, "YYYY/M/D").subtract(7, "days").format("YYYY-MM-DD");
            this.today = this.preDate
            console.log(this.preDate)
            this.$emit('parentSearch',{time:this.preDate,name:this.inputProject})
        },
        //下一周
        next(){
             this.nextDate = moment(this.today, "YYYY/M/D").add(7, "days").format("YYYY-MM-DD");
             this.today = this.nextDate
              console.log(this.nextDate,)
               this.$emit('parentSearch',{time:this.nextDate,name:this.inputProject})
        }
    }
   
}
</script>
<style lang="scss" scoped>
.compact{
    // min-width:750px;
    .header{
    background:#ffffff;
    padding:25px;
    width:100%;
    display: flex;
    justify-content: space-between;
    .left{
        width:20%;
    }
    .select-date{
        width:60%;
       text-align: center;
    }
    .select-input{
        width:20%;
    //    text-align: right;
        .el-input--prefix{
            width:70%;
             display:inline-block!important;
        }
    }
}
.project-list{
    background:#ffffff;
    margin-top:20px;
    padding:10px;
}
.project{
    
    display: flex; 
    justify-content: space-between;
    div{
        margin:10px 0;
        .span1{
            margin-left:20px;
            color:#858181;
            .span2{
                color:#000000;
                margin:0 10px;
            }
        }
    }
}
.icon{
    text-align: center;
    div{
        display: inline-block;
        width:60px;
        height:20px;
        line-height:20px;
        margin-top:10px;
    }
    .pass{
       color:#409EFF;
       background:#E7E9F2;
       margin-right:10px;
    }
    .reject{
        color:#FF435A;
       background:#E7E9F2;
    }
}
.row{
    min-height:30px;
    // line-height:60px;
}
//  .left,.right{
//     height: 15px;
   
// }
}

</style>

