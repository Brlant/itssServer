<template>
    <div class='efficiency'>
        <!-- <el-row  v-if='mangerJurisdiction || selfJurisdiction'>

            <el-col :span='13'> -->
        <div style='display:flex;justify-content:space-between;' v-if='mangerJurisdiction || selfJurisdiction'>

                 <div class='header'  style='width:40%'>
                    <div>
                        <i class='el-icon-arrow-left point' v-if='selfJurisdiction && drillDowm' @click='goBack'></i>
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

            <el-col :span='11'> -->

                <div style="font-size:16px;color:#666666;width:50%"  v-hasPermi="['efficiencyStatistics:stat:dept', 'efficiencyStatistics:stat:all']">
                    <el-form ref="form" :model="form" label-width="20%">
                        <el-row >
                            <el-col :span="10">
                                <el-form-item label="人员" prop="userId"  width='30%'>
                                    <el-select v-model="form.userId"  size="medium"  placeholder="请选择人员" filterable clearable  @change='searchUser'>
                                        <el-option v-for='(item) in users' :key='item.userId' :value='item.userId' :label='item.nickName'></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="部门" prop="deptId" width='30%'>
                                    <treeselect v-model="form.deptId" :options="deptOptions" :show-count="true" placeholder="请选择部门" @input='searchDept'  @change='searchDept'/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4" >
                                <el-form-item label="" align="center" justify="center">
                                 <!-- -->
                                 <el-button @click="exportExcelHandel" type="success" :loading="btnLoading">导出Excel</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>

                    </el-form>

                </div>
                <div  v-if='selfJurisdiction' style="font-size:16px;color:#666666;width:30%">
                         <el-form  inline>
                          <el-form-item label="人员" prop="userId" width='20%'>
                                    <el-select v-model="form.userId"  size="medium"  placeholder="请选择人员" filterable clearable  @change='searchUser'>
                                        <el-option v-for='(item) in users' :key='item.userId' :value='item.userId' :label='item.nickName'></el-option>
                                    </el-select>
                                </el-form-item>
                    </el-form>
                </div>
            </div>
            <!-- </el-col>
        </el-row>         -->

        <div class="newRow" v-hasPermi="['threeInterface:gitlabAndTb:stat']">
            <!-- 配置相关 -->
            <el-button type="success" @click="getConfig">修改配置</el-button>
            <!-- 实时统计 -->
            <div class="myWrap">
                <div class="time">
                    <b class="label">时间</b>
                    <el-date-picker
                        v-model="times"
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    />
                </div>
                <el-button 
                    type="primary"
                    :disabled="disabled"
                    @click="onClick"
                >
                {{ btnTxt }}
                <span v-if="this.progress">
                    {{ this.progress }}%
                </span>
                </el-button>
            </div>
        </div>
        <!-- 配置弹窗 -->
        <el-dialog
            title="配置信息"
            :visible.sync="dialogVisible"
            width="30%"
            destroy-on-close
        >
            <el-input
                type="textarea"
                :autosize="{ maxRows: 20}"
                placeholder="请输入配置信息"
                v-model="configInfo"
            />
            <div slot="footer" style="display:flex; justify-content:flex-end">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateConfig">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 部门效率 -->
        <div v-if="mangerJurisdiction">
            <div v-for="(item,index) in deptData" :key='index' class='table-style'>
                <div class='name'>{{item.deptName}}</div>
                <el-table v-if='item' :data="item.userList" border class="tableData" style="width:100%">
                    <el-table-column label="执行人员" align="center"   min-width='150' fixed="left">
                        <template  slot-scope="scope">
                            <span @click='nameClick(scope.row)' :class="[scope.row.username != '总计' ? 'colorname' : '']">{{scope.row.username}}</span>
                        </template>

                    </el-table-column>
                    <el-table-column :label="item" align="center" v-for="(item,indexs) in months" :key='indexs'>
                        <el-table-column label="计划负荷" align="center"   min-width='150'>
                            <template  slot-scope="scope" v-if='scope.row.monthEfficiencyList[indexs]'>
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
                        <!-- 新增bug重开数量/bug重开率 -->
                        <el-table-column label="bug重开数量" align="center">
                            <template slot-scope="scope">
                                <span>{{scope.row.monthEfficiencyList[indexs].bugRerunNum}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="bug重开率" align="center">
                            <template slot-scope="scope">
                                <span>{{scope.row.monthEfficiencyList[indexs].bugRerunRate}}%</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="出产量" align="center">
                            <template slot-scope="scope">
                                <span>{{scope.row.monthEfficiencyList[indexs].yieldNum}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="出产问题率" align="center">
                            <template slot-scope="scope">
                                <span>{{scope.row.monthEfficiencyList[indexs].errorRate}}‰</span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table>
            </div>

        </div>
        <!-- 个人效率 -->
        <div v-if='selfJurisdiction'>
            <div v-for="(item,index) in userData" :key='index'  class='table-style'>
                <div class='name' @click='userInfoId(item.userId)' style='cursor:pointer;color:#3D7DFF;'>{{item.username}}</div>
                <el-table :data="item.projectEfficiencyList" border class="tableData" style="width:100%" :span-method="arraySpanMethod">
                    <el-table-column label="项目" align="center"   min-width='150' prop='projectName' fixed="left">
                         <template slot-scope="scope">
                            <span :class="['yuan','yuan'+scope.row.priority]"></span>
                            {{ scope.row.projectName }}
                        </template>

                    </el-table-column>
                     <el-table-column label="项目状态" align="center"   min-width='150' prop='projectStatus' fixed="left">
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
                         <!-- 新增bug重开数量/bug重开率 -->
                        <el-table-column label="bug重开数量" align="center">
                            <template slot-scope="scope">
                                <span>{{scope.row.monthEfficiencyList[indexs].bugRerunNum}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="bug重开率" align="center">
                            <template slot-scope="scope">
                                <span>{{scope.row.monthEfficiencyList[indexs].bugRerunRate}}%</span>
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
                                <span>{{scope.row.monthEfficiencyList[indexs].errorRate}}‰</span>
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
import { 
    departmentQuery,
    queryUserlist,
    userQuery,
    statJob,
    getTbConf,
    updateTbConf,
    exportExcel
} from '@/api/proManager/efficiencyStatistics.js'
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: { Treeselect },
    name:"EfficiencyStatistics",
    data(){
        return {
            times: null,
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
            deptOptions:[],
            dialogVisible: false,
            configInfo: '',
            data: null,
            tableData: [],
            btnLoading: false,
            type: '0',
            progress: 0,
            timer: null,
            disabled: false,
            btnTxt: '统计',
            flag: false
        }
    },
    created(){
        console.log(this.$store.state.user.user.userId)
        
        // this.drillDowm=this.isJurisdiction('common') ? false : true
        // this.selfJurisdiction=this.isJurisdiction('common')
        // this.mangerJurisdiction=this.isJurisdiction('deptdirector') || this.isJurisdiction('operatemanage') || this.isJurisdiction('admin')
        // permissions   是否包含  workloadStatistics:stat:all  或 workloadStatistics:stat:dept
         if(this.isJurisdiction('efficiencyStatistics:stat:all') || this.isJurisdiction('efficiencyStatistics:stat:dept')){
            // 可查询部门成员或全部人员
            this.queryUser()
            this.getDeptTree()
            this.mangerJurisdiction=true
            this.drillDowm=true
        }else if(this.isJurisdiction('efficiencyStatistics:stat:self')){
            this.drillDowm=false
            this.selfJurisdiction=true
        }
        //   this.mangerJurisdiction=this.isJurisdiction('admin') || this.isJurisdiction('operatemanage')
        this.defaultDate()
    },
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer)
        }
    },
    methods:{

        // 导出
    exportExcelHandel(){
    //   if(this.searchForm.projectStartEndTime){
    //      // if(this.searchForm.projectStartEndTime&&this.searchForm.projectStartEndTime.length>0){
    //      this.searchForm.projectStartTime = this.searchForm.projectStartEndTime[0];
    //      this.searchForm.projectEndTime = this.searchForm.projectStartEndTime[1];
    //    }else{
    //      this.searchForm.projectStartTime = "";
    //      this.searchForm.projectEndTime = "";
    //    }
    //    let params ={
    //     ...this.searchForm
    //    }
    //      exportExcel(params).then((res) => {
    //       console.log(res);
    //         let blob = new Blob([res], {
    //           // type:"application/vnd.ms-excel",
    //             type: "application/octet-stream;charset=UTF-8",
    //         });
    //         console.log(blob);
    //         let timeString =  moment().format("YYYYMMDDhhmmss");
    //         const fileName = `项目管理${timeString}.xlsx` // 下载文件名称
    //         const elink = document.createElement('a')
    //         elink.download = fileName
    //         elink.style.display = 'none'
    //         elink.href = URL.createObjectURL(blob)
    //         document.body.appendChild(elink)
    //         elink.click()
    //         URL.revokeObjectURL(elink.href) // 释放URL 对象
    //         document.body.removeChild(elink)
    //       this.$message.success("导出成功！");
         
    //     });
        // /projectManage/project/export
        if (!this.tableData.length) {
            return this.$message.warning('暂无可导出内容')
        }
        this.btnLoading = true
        exportExcel(this.data).then(res => {
            let blob = new Blob([res], {
              // type:"application/vnd.ms-excel",
                type: "application/octet-stream;charset=UTF-8",
            });
            console.log(blob);
            let timeString =  moment().format("YYYYMMDDhhmmss");
            const fileName = `效率统计${timeString}.xlsx` // 下载文件名称
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
            this.btnLoading = false
        }).catch(() => {
            this.btnLoading = false
        })
    },
        // 实时统计
        onClick() {
            if (!this.times) {
                return this.$message.warning('请选择时间范围')
            }
            const params = {
                startDate: this.times[0],
                endDate: this.times[1],
                type: this.type
            }
            this.handleStatJOb(params)
            // statJob(params).then(res => {
            //     if (res.code === 200) {
            //         this.$message.success(res.msg)
            //         if(this.mangerJurisdiction){
            //             this.queryTable()
            //             // this.queryTablehasYieldNum()
            //         }else if(this.selfJurisdiction && this.drillDowm){

            //             this.userId=this.form.userId
            //             this.queryTableBySelf()
            //         }else{
            //             this.userId=this.userInfo.userId
            //             this.queryTableBySelf()
            //         }
            //     }
            // })
        },
        handleStatJOb(params) {
            this.disabled = true
            this.btnTxt = '正在统计...'
            if (this.flag === true) {
                this.progress = 0
            }
            statJob(params).then(res => {
                if (res.data === true) {
                    this.flag = true
                    this.disabled = false
                    this.progress = 100
                    this.btnTxt = '统计成功'
                    this.type = '1'
                } else {
                    this.progress = res.data
                    if (this.progress == 100) {
                        this.flag = true
                        this.disabled = false
                        this.btnTxt = '统计成功'    
                        this.type = '1'
                        if (this.mangerJurisdiction) {
                            this.queryTable()
                        } else if (this.selfJurisdiction && this.drillDowm) {
                            this.userId=this.form.userId
                            this.queryTableBySelf()
                        } else {
                            this.userId=this.userInfo.userId
                            this.queryTableBySelf()
                        }
                    }
                }
                // 递归
                if (res.data !== true && res.data !== 100) {
                    this.handleStatJOb(params)
                }
            }).catch(() => {
                this.disabled = false
                this.btnTxt = '统计'
                this.$message.error(res.msg)
            })
        },
        // 查询配置
        getConfig() {
            getTbConf().then(res => {
                this.dialogVisible = true
                this.$nextTick(() => {
                    this.configInfo = res.msg
                })
            })
        },
        updateConfig() {
            const params = {
                cookie: this.configInfo
            }
            updateTbConf(params).then(res => {
                this.dialogVisible = false
                if (res.code === 200) {
                    this.$message.success(res.msg)
                }
            })
        },
        userInfoId(id){
            const obj = { path: "/system/user-auth/userInfo", query: { userId: id }};
            // getToday()
            this.$tab.closeOpenPage(obj);
        },

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
            queryUserlist().then(res=>{
                this.users=res.data
            })
        },
        //初始时间
        defaultDate(){
            // let preOne=moment().subtract(1,'month').startOf('month').format('YYYY/MM/DD')
            let preOne = moment().subtract(1, 'months').format('YYYY/MM/DD');
            let today=moment().format('YYYY/MM/DD')
            this.dateRange=`${preOne}-${today}`
            this.beginDate=moment(preOne).format('YYYY-MM-DD')
            this.endDate=moment(today,'YYYY/MM/DD').format('YYYY-MM-DD')
            this.userInfo=this.$store.state.user.user
           if(this.mangerJurisdiction){
            this.queryTable()
            // this.queryTablehasYieldNum()
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
            // if(value[0]==value[1]){
            //         this.dateRange=''
            // }else{
                this.dateRange=`${value[0]}-${value[1]}`
            // }
            this.beginDate=moment(val[0]).format('YYYY-MM-DD')
            this.endDate=moment(val[1]).format('YYYY-MM-DD')
            if(this.mangerJurisdiction){
            this.queryTable()
            // this.queryTablehasYieldNum()

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
                // this.queryTablehasYieldNum()
            }else{
               this.userId=this.form.userId
                this.queryTableBySelf()
            }
        },
        //通过部门搜索
        searchDept(){
            this.queryTable()
            // this.queryTablehasYieldNum()
        },
        //查询部门表格方法
        queryTablehasYieldNum(){
            this.months=[]
            let data={
                startDate:this.beginDate,
                endDate:this.endDate,
                userId:this.form.userId,
                deptId:this.form.deptId,
                hasYieldNum:true
            }
            departmentQuery(data).then(res=>{
                if(res.code==200){
                    // 保存查询参数
                    this.data = data
                    console.log('查询参数', this.data)

                    if(res.data){
                        this.deptData=[]
                        this.months=[]
                        console.log( this.deptData,' this.deptData')
                        this.deptData=res.data
                        console.log(this.deptData,'2222222222222')
                            let value1 = res.data.find(item => item.userList.length)
                             if(value1){
                                let value2 = value1.userList.find(item => item.monthEfficiencyList.length)
                                if (value2) {
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
         queryTable(){
            this.months=[]
            this.deptData=[]
            let data={
                startDate:this.beginDate,
                endDate:this.endDate,
                userId:this.form.userId,
                deptId:this.form.deptId,
                 hasYieldNum:false
            }
            departmentQuery(data).then(res=>{
                if(res.code==200){
                    // 保存查询参数
                    this.data = data
                    console.log('查询参数', this.data)

                    this.months=[]
                    if(res.data){
                        this.deptData=res.data
                        this.tableData = res.data
                         console.log(this.deptData,'1111111')
                            let value1 = res.data.find(item => item.userList.length)
                             if(value1){
                                let value2 = value1.userList.find(item => item.monthEfficiencyList.length)
                                if (value2) {
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
                            //this.queryTablehasYieldNum()
                        }

                }

            })
            //this.queryTablehasYieldNum()
        },
        //查询个人效率表格方法
        queryTableBySelf(){
            this.months=[]
             let data={
                startDate:this.beginDate,
                endDate:this.endDate,
                userId:this.userId,
                hasYieldNum:false
            }
            userQuery(data).then(res=>{
                if(res.code==200){
                    if(res.data){
                         this.months=[]
                        this.userData=res.data
                        this.tableData = res.data
                          console.log( this.userData,111111111111)
                         let value1 = res.data.find(item => item.projectEfficiencyList.length)
                             if(value1){
                                let value2 = value1.projectEfficiencyList.find(item => item.monthEfficiencyList.length)
                                // console.log(value2,11111)
                                if (value2) {
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
                    //this.queryTableBySelfYieldNum()
                }

            })
            //this.queryTableBySelfYieldNum()
        },
         queryTableBySelfYieldNum(){
            this.months=[]
             let data={
                startDate:this.beginDate,
                endDate:this.endDate,
                userId:this.userId,
                hasYieldNum:true

            }
            userQuery(data).then(res=>{
                if(res.code==200){
                     this.months=[]
                    if(res.data){
                        this.userData=res.data
                         console.log( this.userData,2222222222)
                         let value1 = res.data.find(item => item.projectEfficiencyList.length)
                             if(value1){
                                let value2 = value1.projectEfficiencyList.find(item => item.monthEfficiencyList.length)
                                // console.log(value2,11111)
                                if (value2) {
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
            // this.queryTablehasYieldNum()
        },
        //合计列合并
        arraySpanMethod({ row, column, rowIndex, columnIndex }){
            if(rowIndex == this.userData[0].projectEfficiencyList.length-1){
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
.newRow {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 20px;
}
.myWrap {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-left: 20px;
    .time {
        margin-right: 20px;
        .label {
            color: #606266;
            font-size: 14px;
            margin-right: 10px;
        }
    }
}

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
cursor:pointer;
}
.table-style{
    background:#ffffff;
    padding:0 5px 20px 5px;
    margin-bottom:30px;
}
</style>
<style lang="scss">
.efficiency{
    thead>:first-child  .is-leaf{
    background:#E8E8F4!important;
    // .myTable .el-table__body-wrapper {
//   margin-top: 0px;
  // z-index: 2;
// }
// .myTable .el-table__fixed {
  // z-index: 5;
//  bottom: 0px !important;
//  margin-top: 0px;
//        box-sizing: content-box;
//         padding-bottom: 20px;
// height:220px!important;
    // }
// .myTable .el-table__fixed-right {
//   // z-index: 5;
//  bottom: 0px !important;
// }
// .myTable .el-table__fixed .el-table__fixed-body-wrapper{
//   padding: 5px 0;
// }
// .myTable .el-table__fixed-right .el-table__fixed-body-wrapper{
//   padding: 5px 0;
// }
  }
}

</style>
