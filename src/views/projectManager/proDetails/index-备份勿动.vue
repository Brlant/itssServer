<template>
  <div class="app-container">
    <div class="routerBar">
      <b>{{ projectName }}详情</b
      ><span>（仅项目负责人可对此项目下列对内进行编辑）</span>
      <div class="rightBox">
        <el-button size="mini" type="success">导出excel</el-button>
      </div>
    </div>
    <div class="routerBar">
      <div class="backBar">
        <router-link :to="'/projectManager/proManager'"> < 返回</router-link>
        <div class="rightLink">
          <router-link :to="'/ProjectManager/AddProject'">编辑</router-link>|
          <span @click="stopProject" :class="[projectTable.projectStatus== 4 ? 'color5' : 'color4']">
            {{projectTable.projectStatus==4?'开启':'终止'}}
            </span>
        </div>
      </div>
    </div>

    <div class="whiteBox" style="padding:1%">
      <b>| 项目基础信息</b>
      <p></p>
           <el-form
        ref="elForm"
        :model="formData"
         :rules="rules"
        size="medium"
        label-width="100px"
      >
            <el-row>
              <el-col :span="7" :offset="1">
                <el-form-item label="项目编号：" prop="projectCode">
                  {{formData.projectCode}}
                </el-form-item>
              </el-col>
              <el-col :span="7" :offset="1">
                <el-form-item label="项目名称：" prop="projectName">
                  {{formData.projectName}}
                </el-form-item>
              </el-col>
              <el-col :span="7" :offset="1">
                <el-form-item label="项目阶段：" prop="projectStage">
                 {{formData.projectStageName}}
                </el-form-item>
              </el-col>
              <el-col :span="7" :offset="1">
                <el-form-item label="项目类型：" prop="projectType">
                 {{formData.projectTypeName}}
                </el-form-item>
              </el-col>
              <el-col :span="7" :offset="1">
              <el-form-item label="优先级：" prop="priority">
              <!-- // 低（灰色）、普通（蓝色）、紧急（橙色）、非常紧急（红色）显示； -->
              <span :class="['yuan','priorityBg'+formData.priority]"></span>
               <span :class="['priority'+formData.priority]">{{formData.priority|toPriority}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="7" :offset="1">
                <el-form-item label="服务对象" prop="projectService">
                {{formData.projectService | toProjectService}}
                </el-form-item>
              </el-col>
              <el-col :span="7" :offset="1">
                <el-form-item
                  label="负责人"
                  prop="projectUserId"
                >
                  {{formData.projectUserName}}
                </el-form-item>
              </el-col>
            
            
              <el-col :span="7" :offset="1">
                <el-form-item label="项目有效期" prop="projectTimeArea">
                {{formData.projectTimeArea}}
                </el-form-item>
              </el-col>
               <el-col :span="7" :offset="1">
                  
                <el-form-item label="GitLab地址" prop="projectGitUrl">
                  {{formData.projectGitUrl}}
                </el-form-item>
              </el-col>
              <!-- <el-col :span="7" :offset="1">
                <el-form-item label="关联机会" prop="projectChance">
                  {{formData.projectChanceName}}
                </el-form-item>  
              </el-col> -->
            </el-row>
        </el-form>
      <!--------------------------------------------------------------------------->
    </div>

    <div class="whiteBox">
      <div class="basicLine">
        <el-row>
          <el-col :span="4">
            <el-button size="mini" type="text" style="margin-top: 4px"
              >+添加成员</el-button
            >
          </el-col>
          <el-col :span="10" :offset="10">
            <el-row>
              <el-form
                ref="elForm"
                :model="checkFormData"
                size="medium"
                label-width="100px"
              >
                <el-col :span="12">
                  <el-form-item label="统计范围" prop="projectStartEndTime">
                    <el-date-picker
                      type="daterange"
                      v-model="checkFormData.projectStartEndTime"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      :style="{ width: '100%' }"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      range-separator="至"
                      size="mini"
                      clearable
                      @change="init()"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="统计范围" prop="totalArea">
                    <el-select
                      v-model="checkFormData.totalArea"
                      placeholder="请选择统计范围"
                      clearable
                      size="mini"
                      :style="{ width: '100%' }"
                      @change="init()"
                    >
                      <el-option
                        v-for="(item, index) in countScopeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        :disabled="item.disabled"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>
    <!---项目成员安排--------------------------------------------->
    <div class="whiteBox" style="padding: 1%">
       <b>| 项目成员安排</b>
       <p></p>
      <el-table
        :data="projectTable.projectUserList"
        show-summary :cell-style="columnStyle" 
        :summary-method="totalOutYear"
        border :header-row-style="{'height':'14px','line-height':'14px'}"
        style="width: 100%"
        max-height="650"
      >
        <el-table-column
          fixed
          prop="userName"
          
          label="执行人员"
          width="120"
        >
        </el-table-column>
        <el-table-column
          fixed
          prop="planLoad"
          
          label="计划负荷"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.planLoad + "%" }}
          </template>
        </el-table-column>
        <el-table-column
          fixed
          prop="planLoadWorkDay"
          
          label="计划负荷人日"
          width="120"
        >
          <template slot-scope="scope">
            <span class="color1">{{ scope.row.planLoadWorkDay + "人日"}}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          prop="realLoad"
          
          label="实际负荷"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.realLoad + "%" }}
          </template>
        </el-table-column>
        <el-table-column
          fixed
          prop="realLoadWorkDay"
          
          label="实际负荷人日"
          width="120"
        >
          <template slot-scope="scope">
            <span class="color1">{{scope.row.realLoadWorkDay + "人日"}}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          prop="planCost"
          
          label="计划投入"
          width="120"
        >
        </el-table-column>
        <el-table-column
          fixed
          prop="realCost"
          
          label="实际投入"
          width="120"
        >
        </el-table-column>
        <!-- 滑动的内容块 start  -->
          <template v-if="projectTable.projectUserList"  v-for="(item,i) in  projectTable.projectUserList">
            <template   v-for="(jtem,j) in  item.projectUserScheduleList">

              <el-table-column :label="jtem.weekMonth+'月- '+jtem.week+'周 ('+jtem.weekTimeArea+')'" align="center" style="height:15px">
                    <el-table-column class="dynamicColumn"  :prop="'planLoadCh'+i+j"        
                      label="计划负荷" >
                      <span > {{jtem.planLoadCh+ "%" }}</span>
                    </el-table-column>  
                    <el-table-column class="dynamicColumn"  :prop="'planLoadWorkDayCh'+i+j"            
                      label="计划负荷人日" width="112" >
                      <span > {{jtem.planLoadWorkDayCh+ "人日" }}</span>
                    </el-table-column>  
                    
                    <el-table-column class="dynamicColumn"  :prop="'realLoadCh'+i+j"            
                      label="实际负荷"  >
                    <span > {{ jtem.realLoadCh + "%" }}</span>                            
                    </el-table-column>  
                    <el-table-column class="dynamicColumn"  :prop="'realLoadWorkDayCh'+i+j"            
                        label="实际负荷人日"  width="112" >
                      <span > {{ jtem.realLoadWorkDayCh + "人日" }}</span>                            
                    </el-table-column>  
              </el-table-column>       
            </template>
          </template>

        <!-- 滑动的内容块 end  -->
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <!-- @click.native.prevent="detailProject(scope.$index, scope.row)" -->
            <el-button type="text" size="small"> 修改 </el-button>
            <el-button type="text" size="small"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="hr"></div>
    <!---项目信息修改--------------------------------------------->
    
     <div class="whiteBox" style="  padding: 1%">
      <b>| 项目信息修改
          <div class="rightBar">
              <el-tabs v-model="auditStatus" size="mini"  @tab-click="handleClick">
                  <el-tab-pane
                    :key="item.name"
                    v-for="(item, index) in auditStatusTabs"
                    :label="item.title"
                    :name="item.name"
                  >
                  </el-tab-pane>
              </el-tabs>
          </div>
    </b>
    <p></p>
      <el-table
        :data="projectAuditTable"
        border
        style="width: 100%"
        max-height="650"
      >
        <el-table-column
          prop="applyDate"
          label="申请日期"
          width="150"
        >
        </el-table-column>
         <el-table-column
          prop="applyUserName"
          label="申请人"
          width="150"
        >
        </el-table-column>
         <el-table-column
          prop="relatePeople"
          label="涉及成员"
          width="250"
        >
        </el-table-column>
         <el-table-column
          prop="updateScope"
          label="修改范围"
          width="150"
        >
        <template slot-scope="scope">
         {{scope.row.updateScope | toUpdateScope}}
        </template>
        </el-table-column>
         <el-table-column
          prop="updateContent"
          label="修改内容"
        >
        </el-table-column>
            <el-table-column
          prop="status"
          label="状态"
          width="150"
        >
          <template slot-scope="scope">
         {{scope.row.status | toStatus}}
        </template>
        </el-table-column>
         <el-table-column   label="操作" width="120">
          <template slot-scope="scope">
            <!-- @click.native.prevent="detailProject(scope.$index, scope.row)" -->
            <el-button type="text" size="small" @click="updateAuditPro(scope.row,'4')"><span class="color1"> 取消 </span></el-button>
            <el-button type="text" size="small" @click="updateAuditPro(scope.row,'2')"><span class="color2"> 通过 </span></el-button>
            <el-button type="text" size="small" @click="updateAuditPro(scope.row,'3')"><span class="color3"> 拒绝 </span></el-button>
            
            
          </template>
        </el-table-column>
      </el-table>

    </div>
  </div>
</template>

<script>
import { queryInfoById,queryProjectAudit,updateAuditProById ,  getTimeProcess,
  queryUserlist,
  queryDict,
  addProjectList,searchProjectList,updateProjectStatus } from "@/api/proManager/proManager";
export default {
  name: "ProDetail",
  components: {},
  props: {},
  data: () => ({
  editActive:true,// 默认是详情页 不可以编辑
     rules: {
         "projectUserListAllUserId": [
          {
            required: true,
            message: "请选择项目成员",
            trigger: "change",
          },
        ],
           "projectGitUrl": [
          {
            required: true,
            message: "请输入GitLab地址",
            trigger: "blur",
          },
        ],
        "projectUserListAllStartEndTime": [
          {
            required: true,
            message: "请选择参与时间",
            trigger: "change",
          },
        ],
          
        projectCode: [
          {
            required: true,
            message: "请输入项目编号：",
            trigger: "blur",
          },
        ],
        projectName: [
          {
            required: true,
            message: "请输入项目名称：",
            trigger: "blur",
          },
        ],
        projectStage: [
          {
            required: true,
            message: "请输入项目阶段：",
            trigger: "change",
          },
        ],
        projectType: [
          {
            required: true,
            message: "请选择项目类型：",
            trigger: "change",
          },
        ],
        priority: [
          {
            required: true,
            message: "优先级：不能为空",
            trigger: "change",
          },
        ],
        projectUserId: [
          {
            required: true,
            message: "请选择项目负责人",
            trigger: "change",
          },
        ],
        projectService: [
          {
            required: true,
            message: "请选择服务对象",
            trigger: "change",
          },
        ],
      
        // projectChance: [
        //   {
        //     required: true,
        //     message: "请选择关联机会",
        //     trigger: "change",
        //   },
        // ],
      },
      projectUserIdOptions: [],
     formData: {
        /**
         * 优先级（1.最高，2.高，3.普通，4.较低）
         */
        priority: 3,
        /**
         * 关联机会
         */
        projectChance: "",
        /**
         * 项目编号
         */
        projectCode: "",
        /**
         * 项目结束时间
         */
        projectEndTime: "",
        /**
         * 项目名称
         */
        projectName: "",
        /**
         * 服务对象
         */
        projectService: "",
        /**
         * 项目阶段
         */
        projectStage: "",
        /**
         * 项目开始时间
         */
        projectStartTime: "",
        /**
         * 项目类型
         */
        projectType: "",
        /**
         * 项目负责人
         */
        projectUserId: "",
        /**
         * 项目成员列表
         */
        projectUserList: [],
        projectGitUrl:"",// 项目git 地址
      },
      
    checkFormData: {
      projectId: "",//项目id
      startTime: null,//统计开始时间
      endTime: "",//统计结束时间
      countScope: undefined,//统计范围 1.全部，2.仅我负责，3.仅部门成员
    },
    projectName: "",
    countScopeOptions: [], //统计范围 1.全部，2.仅我负责，3.仅部门成员
    countScopeInit: "",
    projectTable: [
      {projectUserList:[{
        projectUserScheduleList:[]}
      ]}
    ],
    labelArr: [],
    projectAuditTable:[], // 项目的信息修改的  历史记录
    checkAuditFormData:{ // 项目修改的日志
          status:'1',  //状态（1.待审核,2.已通过,3.已拒绝)
          projectId:''
    },
    auditStatus:'1', // 默认选择的
    auditStatusTabs:[
      {  title: '待审核',
          name: '1',},
      {  title: '已通过',
          name: '2',},
      {  title: '已拒绝',
          name: '3',},
    ]
  }),
  computed: {},
  watch: {},
  created() {
    this.projectName = this.$route.query.projectName;
    this.init();
  },
  mounted() {
    this.proAuditInit();
    // this.getDictList("project_phase"); // 项目阶段 project_phase
    // this.getDictList("project_type"); // 项目类型 project_type
    // this.getDictList("serivce_obj_type"); // 服务对象 serivce_obj_type
    // this.getUserList();

  },
  
  methods: {
    // 设置生成 列的背景色
     columnStyle({ row, column, rowIndex, columnIndex }) {
	           if (column.width != 120 && column.width != 100) {  
	            return 'background:	#f4f4ff;'
	  		  	}
	   	 },

    stopProject(){
      // 终止项目
         this.$confirm(`此操作将${this.projectTable.projectStatus==4?'开启':'终止'}项目：${this.projectName}, 是否继续?`, '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
              projectId: this.$route.query.projectId,
            };
           updateProjectStatus(params).then((res) => {
                console.log(res);
                let { msg } = res;
                this.$message.success(msg);
                this.$router.push("/projectManager/proManager")
              });
         
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });          
        });
    },
       /* 查询用户列表 */
    getUserList() {
      let data = {}
      queryUserlist(data).then((res) => {
        res.data.map((item) => {
          item.userNameAndPost = item.userName + "（" + item.postName + "）";
        });
        this.projectUserIdOptions = res.data;
        this.userOptions = res.data;
      });
    },
    
        // 点击 新增用户的
    addUserListHandel() {
       if(this.formData.projectService==""){
              this.$message.error("请您先选择项目基础信息内-服务对象！");

        }else{
      let oneUser = this.deepClone(this.projectUserList);
      this.formData.projectUserList.push(oneUser);
        }
    },
        /*选择项目有效期*/
    getProjectTimeArea(dates) {
      this.formData.projectStartTime = dates[0];
      this.formData.projectEndTime = dates[1];
    },
    // 点击取消  删除  提交
    updateAuditPro(rowData,type){
        let params ={
            projectId: rowData.id,
            status:type
        }
        updateAuditProById(params).then((res) => {
             let { msg } = res;
            this.$message.success(msg);
            this.proAuditInit()

        });
    },
    // 点击上面的 项目修改记录的 状态切换
    handleClick(tab, event) {
        // console.log(tab);
        this.auditStatus = tab.name
        this.proAuditInit()
    },
    proAuditInit(){
        // 初始化查询 项目修改记录 的日志
        this.checkAuditFormData.projectId = this.$route.query.projectId;
        this.checkAuditFormData.status = this.auditStatus;
        queryProjectAudit(this.checkAuditFormData).then((res) => {
          this.projectAuditTable = res.data
        });
    },
    init() {
      // 初始化传 项目截止时间
      this.checkFormData.startTime = this.$route.query.startTime
      this.checkFormData.endTime = this.$route.query.endTime
      this.checkFormData.projectId = this.$route.query.projectId;
      this.checkFormData.countScope = this.$route.query.countScope;
      queryInfoById(this.checkFormData).then((res) => {
        this.projectTable = res.data;
        this.projectTable.projectUserList = res.data.projectUserList;
        // 把最长的 放置在第一条 因为需要用第一条的生成 label
        res.data.projectUserList.sort((a,b)=>{
           return b.projectUserScheduleList.length - a.projectUserScheduleList.length 
        })
         res.data.projectUserList.map((item,i)=>{
            item.projectUserScheduleList.map((jtem,j)=>{
              item['planLoadCh'+i+j] = jtem.planLoadCh
              item['planLoadWorkDayCh'+i+j] = jtem.planLoadWorkDayCh
              item['realLoadCh'+i+j] = jtem.realLoadCh
              item['realLoadWorkDayCh'+i+j] = jtem.realLoadWorkDayCh
              jtem.weekTimeArea = jtem.startTime.substring(5)+'-'+jtem.endTime.substring(5)
            })
         })
        this.formData = res.data
        this.formData.projectTimeArea = res.data.projectStartTime+"-"+res.data.projectEndTime
        // 之前的做法 动态生成 表格列
        // if (res.data.projectUserList[0].projectUserScheduleList.length != 0) {
        //   this.labelArr = this.createLabel(
        //     res.data.projectUserList[0].projectUserScheduleList.length
        //   );
        // }
      });
    },
    // 动态生成 label
    // createLabel(len) {
    //   let a = [];
    //   let oneArr = [{ label: "计划负荷" }, { label: "实际负荷" }];
    //   for (let i = 0; i < len; i++) {
    //     a = a.concat(oneArr);
    //   }
    //   return a;
    // },
     // 设置生成 列的背景色
     columnStyle({ row, column, rowIndex, columnIndex }) {
	           if (column.width != 120 && column.width != 100) {  
	            return 'background:	#f4f4ff;'
	  		  	}
	   	 },
    // 总计的计算方法 
    totalOutYear(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        // 第一行现实 合计
        if (index === 0) {
          sums[index] = "总计";
          return;
        }
        // if (index === 2 || index === 3) {
        //   sums[index] = "--";
        // }
        const values = data.map((item,i) =>{ 
                return Number(item[column.property])
        });
        // 非动态列
        if (!values.every((value) => isNaN(value))&&(column.width == 120 || column.width == 100)) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
           if (
            column.property == "planLoadWorkDay"||column.property == "realLoadWorkDay"
          ) {
            sums[index] += "人日";
          } else {
            sums[index] = sums[index].toFixed(2);
          }
        }
        // 动态列
        if (!values.every((value) => isNaN(value))&&(column.width != 120 && column.width != 100)) {
            let renri = /WorkDay/i;
            let load = /realLoadCh|planLoadCh/i;
             sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr/data.length;
            } else {
              return prev;
            }
          }, 0);
          if (load.test(column.property)) {
            sums[index] += "%";
          } else if (renri.test(column.property)) {
            sums[index] += "人日";
          }else{
           sums[index] = sums[index].toFixed(2);
          }
        }
            // 总计核心代码块
      });
      return sums;
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
.basicLine {
  background-color: #e8e8f4;
  display: block;
  height: 40px;
  // line-height: 28px;
  width: 100%;
  // position: relative;
  // margin: 0 auto;
  font-size: 12px;
  padding: 3px 20px 10px 20px;
}
.routerBar {
  position: relative;
  .backBar {
    color: #557db3;
    background-color: #e8e8f4;
    display: block;
    width: 98%;
    height: 28px;
    line-height: 28px;
    position: relative;
    margin: 0 auto;
    font-size: 12px;
  }
  span {
    font-size: 12px;
    color: #999;
  }
}
.color1 {
  color: #909399;
}
.color2 {
  color: #409eff;
}
.color3 {
  color: #e6a23c;
}
.color4 {
  color: #f56c6c;
}
.piancha0 {
  color: #333;
}
.piancha1 {
  color: #26b0a8;
}
.piancha2 {
  color: #f56c6c;
}
.myTag {
  color: rgb(204, 204, 204);
  font-size: 12px;
  position: absolute;
  top: 40px;
  /* border: 1px solid red; */
  width: initial;
  display: inline-block;
  right: 8px;
  height: 14px;
  line-height: 14px;
}
.colText {
  height: inherit;
  line-height: 150%;
  // background-color: beige;
  // border: 1px red solid;
  margin-top: 8.5px;
  font-size: 12px;
  color: #999;
  text-align: center;
  span {
    color: #557db3;
  }
}
.rightLink {
    top: 1px;
    right: 30px;
    width: 150px;
    position: absolute;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    justify-content: flex-end;
    .color1 {
      color: #909399;
    }
    .color2 {
      color: #409eff;
    }
    .color3 {
      color: #e6a23c;
    }
    .color4 {
      color: #f56c6c;
    }
    .color5 {
      color: #26b0a8;
    }
}
// 低（灰色）4、普通（蓝色）3、紧急（橙色）2、非常紧急（红色）1显示；
// 1:"最高",
// 2:"高",
// 3:"普通",
// 4:"较低"
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
    .yuan{
      border-radius: 20px;
      height: 10px;
      width: 10px;
      display: inline-block;
      margin-right: 10px;
    }
    .priorityBg4 {
      background-color: #909399;
    }
    .priorityBg3 {
      background-color: #409eff;
    }
    .priorityBg2 {
      background-color: #e6a23c;
    }
    .priorityBg1 {
      background-color: #f56c6c;
    }
    .dynamicColumn{
      background-color: #ccc;
    }
</style>
<style>
.UserLine /deep/.el-form-item {
  margin-bottom: 2px;
}
</style>
