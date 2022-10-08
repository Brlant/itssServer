<template>
  <div class="app-container">
    <div class="routerBar">
      <b>{{ projectName }} 项目详情</b
      ><span>（仅项目负责人可对此项目下列对内进行编辑）</span>
      <div class="rightBox">
        <el-button size="mini" type="success">导出excel</el-button>
      </div>
    </div>
    <div class="routerBar">
      <div class="backBar">
        <router-link :to="'/projectManager/proManager'"> < 返回</router-link>
      </div>
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
    <div class="titleBar">项目成员安排</div>
    <div class="whiteBox" style="padding: 1%">
      <el-table
        :data="projectTable.projectUserList"
        show-summary
        :summary-method="totalOutYear"
        border
        style="width: 100%"
        max-height="650"
      >
        <el-table-column
          fixed
          prop="userName"
          sortable
          label="执行人员"
          width="150"
        >
        </el-table-column>
        <el-table-column
          fixed
          prop="planLoad"
          sortable
          label="计划负荷"
          width="150"
        >
          <template slot-scope="scope">
            {{ scope.row.planLoad + "%" }}
            <span class="color1">{{
              "(" + scope.row.planLoadWorkDay + "人日)"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          prop="realLoad"
          sortable
          label="实际负荷"
          width="150"
        >
          <template slot-scope="scope">
            {{ scope.row.realLoad + "%" }}
            <span class="color1">{{
              "(" + scope.row.realLoadWorkDay + "人日)"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          prop="planCost"
          sortable
          label="计划投入"
          width="150"
        >
        </el-table-column>
        <el-table-column
          fixed
          prop="realCost"
          sortable
          label="实际投入"
          width="150"
        >
        </el-table-column>
        <!-- 滑动的内容块 start  -->
        <!-- 绝绝子代码 之 取余 显示label -->
          <!-- <el-table-column
            v-for="(item,i) in  projectTable.projectUserList[0].projectUserScheduleList"
            :label="i%2===1?'计划负荷':'实际负荷'"
            width="120"
        >
          <span v-if="i%2===1"> {{ item.planLoad   }}</span>
          <span v-else> {{ item.realLoad  }}</span>                            
        </el-table-column>   -->
           <!-- 比较完整的一版本0 -->

        <!-- <el-table-column
          v-for="(item, i) in labelArr"
          :label="item.label"
          :key="i"
          width="100"
        >
          <template slot-scope="scope">{{ scope.row.projectUserScheduleList[i] | toObject('plan') }}</template>
        </el-table-column> -->
          <!-- 比较完整的一版本1 -->
         <!-- <el-table-column
            prop="projectUserScheduleList"
            sortable
            label="实际投入"
            width="50"
        >
          <template slot-scope="scope">
              <div v-for="(item,i) in scope.row.projectUserScheduleList">
                {{ item.realLoad}}
              </div>
          </template>
        </el-table-column> -->

          <!-- 比较完整的一版本2  可以看出部分问题的一段   动态生成 遇到了 无法解析label的个数 因为每个人安排的周数不一致，有的多有的少-->

        <!-- <template v-for="(ScheduleList,i) in projectTable.projectUserList[0].projectUserScheduleList"> 
                     <el-table-column
                      prop="ScheduleList[i].planLoad"
                      label="计划负荷"
                      width="120"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="ScheduleList[i].realLoad"
                      label="实际负荷"
                      width="120"
                    >
                    </el-table-column>
              
            
           </template>   -->
          <!-- 比较完整的一版本3 -->

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
    <div class="titleBar">项目信息修改
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
    </div>
     <div class="whiteBox" style="  padding: 1%">
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
import { queryInfoById,queryProjectAudit,updateAuditProById  } from "@/api/proManager/proManager";
export default {
  name: "ProDetail",
  components: {},
  props: {},
  data: () => ({
    checkFormData: {
      // console.log(index, row);
      // projectId://项目id
      // startTime://统计开始时间
      // endTime://统计结束时间
      // countScope://统计范围 1.全部，2.仅我负责，3.仅部门成员
      projectId: "",
      startTime: null,
      endTime: "",
      countScope: undefined,
    },
    projectName: "",
    countScopeOptions: [], //统计范围 1.全部，2.仅我负责，3.仅部门成员
    countScopeInit: "",
    projectTable: [],
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
  },
  mounted() {
    /*------------------额外的初始化查询的判断------------------------------*/
    // 额外的判断 页面初始化 判断用户的角色  isJurisdiction 判断当前的值是否存在 返回true or false
    // 部门主管 deptdirector  3
    // 项目主管 projectdirector 2
    // 项目监管 管理员 projectsupervision || admin ==>  1
    // let deptdirector = this.isJurisdiction("deptdirector"); // 部门主管
    // let projectdirector = this.isJurisdiction("projectdirector"); // 项目主管
    // let projectsupervision = this.isJurisdiction("projectsupervision"); // 项目监管
    // let admin = this.isJurisdiction("admin"); // 管理员
    // let countScopeOptionsTemp = [];
    //    if (projectdirector) {
    //   // 项目主管
    //   this.countScopeInit = 2
    //   countScopeOptionsTemp.push({
    //     label: "仅我负责",
    //     value: 2,
    //   });
    // }
    // if (deptdirector) {
    //   // 部门主管
    //   this.countScopeInit = 3
    //   countScopeOptionsTemp.push({
    //     label: "仅部门成员",
    //     value: 3,
    //   });
    // }

    // if (projectsupervision || admin) {
    //   // 项目监管
    //   this.countScopeInit = 1
    //   countScopeOptionsTemp.push({
    //     label: "全部",
    //     value: 1,
    //   });
    // }
    // this.countScopeOptions = countScopeOptionsTemp;
    // this.checkFormData.countScope = this.countScopeInit
    /*------------------额外的初始化查询的判断------------------------------*/
    this.init();
    this.proAuditInit();
  },
  methods: {
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
      // this.checkFormData.startTime = this.$route.query.startTime
      // this.checkFormData.endTime = this.$route.query.endTime
      this.checkFormData.projectId = this.$route.query.projectId;
      this.checkFormData.countScope = this.$route.query.countScope;
      queryInfoById(this.checkFormData).then((res) => {
        this.projectTable = res.data;
        this.projectTable.projectUserList = res.data.projectUserList;
        // 把最长的 放置在第一条 因为需要用第一条的生成 label
        res.data.projectUserList.sort((a,b)=>{
           return b.projectUserScheduleList.length - a.projectUserScheduleList.length 
        })

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
    // 总计的计算方法
    totalOutYear(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        // console.log(column);
        // 第一行现实 合计
        if (index === 0) {
          sums[index] = "总计";
          return;
        }
        if (index === 2 || index === 3) {
          sums[index] = "--";
        }
        const values = data.map((item) => Number(item[column.property]));
        // 总计核心代码块
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          if (
            column.property == "planLoad"||
            column.property == "realLoad"
                    
          ) {
            sums[index] += "%";
          } else if (
            column.property == "planLoadWorkDay"||column.property == "realLoadWorkDay"
          ) {
            sums[index] += "人日）";
          } else {
            sums[index] = "--";
          }
          // 总计核心代码块
        }
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
</style>
