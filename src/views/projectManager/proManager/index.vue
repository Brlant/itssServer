<template>
  <div class="app-containers app-container">
    <div class="pageTitle cls">
      <div class="leftTitle">
        项目管理
        <div class="rightBtns" >
          <!-- 必须是项目主管的角色 -->
          <el-button size="mini" type="primary" v-hasPermi="['projectManager:proManager:create']">
<!--            <router-link :replace="true"  :to="'/projectManager/proManager-auth/addProject'"
              >新建项目</router-link
            >-->
            <span @click="onAddProject">新建项目</span>
          </el-button>

          <el-button size="mini" @click="exportExcelHandel" type="success">导出Excel</el-button>
        </div>
      </div>

      <div class="searchBox">
        <el-form ref="form" :model="searchForm" label-width="80px" inline>
          <!-- <el-row>
            <el-col :span="8"> -->
              <el-form-item label="统计时间">
                <el-date-picker
                  v-model="searchForm.projectStartEndTime"
                  type="daterange"
                  range-separator="-"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="init()"
                >
                </el-date-picker>
              </el-form-item>
            <!-- </el-col>
            <el-col :span="4"> -->
              <el-form-item label="统计范围">
                <el-select
                  v-model="searchForm.countScope"
                  placeholder="请选择统计范围"
                  @change="init()"
                >
                  <el-option
                    v-for="item in scopeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            <!-- </el-col>
            <el-col :span="5"> -->
              <el-form-item label="搜索">
                <el-input
                  v-model="searchForm.projectName"
                  @change="init()"
                  placeholder="请输入项目名称"
                  clearable
                ></el-input>
              </el-form-item>
            <!-- </el-col>
            <el-col :span="3"> -->
              <el-form-item label="状态">
                <el-select
                  v-model="searchForm.projectStatus"
                  @change="init()"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in projectStatusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                    <span :class="[item.value == 4 ? 'color4' : '']">{{
                      item.label
                    }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            <!-- </el-col>
            <el-col :span="3"> -->
              <el-form-item label="优先级">
                <el-select
                  v-model="searchForm.priority"
                  placeholder="请选择"
                  @change="init()"
                >
                  <el-option
                    v-for="item in priorityOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                    <span :class="['priority' + item.value]">{{
                      item.label
                    }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            <!-- </el-col>
          </el-row> -->
        </el-form>
      </div>
    </div>
    <div class="hr"></div>
    <div class="pageTitle cls">
      <el-table
        :data="tableData"
        v-loading="loading"
        show-summary
        :summary-method="totalOutYear"
        class="myTable"
        border
        style="width: 100%"
        max-height="650"
         :row-class-name="rowStyle"
      >
        <el-table-column
          prop="projectName"
          sortable
          fixed
          label="项目"
          min-width="150"
        >
          <template slot-scope="scope">
            <span :class="[scope.row.isNew==1?'isNew':'']"></span>
            <span :class="['yuan','yuan'+scope.row.priority]"></span>
            {{ scope.row.projectName }}
          </template>
        </el-table-column>
        <el-table-column
          prop="projectStatus"
          fixed
          sortable
          label="项目状态"
          width="100"
        >
          <template slot-scope="scope">
            <span :class="[scope.row.projectStatus== 4 ? 'color4' : '']">{{ scope.row.projectStatus | filterProjectStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="projectStartTime"
          fixed
          sortable
          label="开始日期"
          width="120"
        >
          <template slot-scope="scope">
            {{ scope.row.projectStartTime  }}
          </template>
        </el-table-column>
        <el-table-column
          prop="projectEndTime"
          fixed
          sortable
          label="结束日期"
          width="120"
        >
          <template slot-scope="scope">
            {{ scope.row.projectEndTime  }}
          </template>
        </el-table-column>
        <el-table-column prop="ysConfig" label="预算配置" width="120">
          <template slot-scope="scope"> {{ scope.row.ysConfig }}人日 </template>
        </el-table-column>
        <el-table-column prop="ysCost" label="成本预算" width="120" align="right">
          <template slot-scope="scope">
            {{ scope.row.ysCost || scope.row.ysCost==0 ? formatAmount(scope.row.ysCost) : ''}}
          </template>
        </el-table-column>
         <el-table-column prop="costUp" label="成本上限" width="120" align="right">
          <template slot-scope="scope">
            {{ scope.row.costUp || scope.row.costUp==0 ? formatAmount(scope.row.costUp) : ''}}
          </template>
        </el-table-column>

        <el-table-column prop="jhConfig" label="计划配置已用" width="130">
          <template slot-scope="scope"> {{ scope.row.jhConfig }}人日 </template>
        </el-table-column>
        <el-table-column prop="jhCost" label="计划预算已用" width="130" align="right">
          <template slot-scope="scope">
            {{ scope.row.jhCost || scope.row.jhCost == 0 ? formatAmount(scope.row.jhCost) : ''}}
          </template>
        </el-table-column>
        <el-table-column prop="jhSchedule" label="计划当前进度" width="130">
          <template slot-scope="scope"> {{ scope.row.jhSchedule }}% </template>
        </el-table-column>

        <el-table-column prop="sjConfig" label="实际配置已用" width="130">
          <template slot-scope="scope"> {{ scope.row.sjConfig }}人日 </template>
        </el-table-column>
        <el-table-column prop="sjCost" label="实际预算已用" width="130" align="right">
          <template slot-scope="scope"> {{ scope.row.sjCost || scope.row.sjCost == 0 ? formatAmount(scope.row.sjCost) : '' }} </template>
        </el-table-column>

        <el-table-column prop="realWork" label="实际完成工作" width="130">
          <template slot-scope="scope">
            {{ scope.row.realWork }}人日
            <!-- v-show="isProjectByUser(scope.row)||isJurisdiction('admin')" -->
            <el-button
            v-hasPermi="['projectManager:proManager:handle']"
              @click.native.prevent="updateRealWork(scope.$index, scope.row)"
              type="text"
              size="mini"
              >更改</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="sjSchedule" label="实际当前进度" width="130">
          <template slot-scope="scope"> {{ scope.row.sjSchedule }}% </template>
        </el-table-column>

        <el-table-column prop="ysDeviation" label="预算偏差" sortable width="130" align="right">
          <template slot-scope="scope">
             <span :class="['piancha' + scope.row.pianchaActive]" v-if='scope.row.pianchaActive == 2'>
              {{
                scope.row.ysDeviation ||  scope.row.ysDeviation ==0 ? "-" + formatAmount(scope.row.ysDeviation) : ''
              }}
            </span>
             <span :class="['piancha' + scope.row.pianchaActive]" v-else>
              {{
                scope.row.ysDeviation ||  scope.row.ysDeviation ==0 ?  formatAmount(scope.row.ysDeviation) : ''
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="jdSchedule" label="进度偏差" sortable width="130">
          <template slot-scope="scope"> {{ scope.row.jdSchedule }}% </template>
        </el-table-column>

        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
              <!-- v-show="isProjectByUser(scope.row)||isJurisdiction('admin','deptdirector','projectdirector','projectsupervision','operatemanage')" -->
            <el-button
              @click.native.prevent="detailProject(scope.$index, scope.row)"
              type="text"
              size="small"
            >
              详情
            </el-button>
            <el-button
              v-show="isProjectByUser(scope.row)"
              v-hasPermi="['projectManager:proManager:handle']"
              @click.native.prevent="toggleActive(scope.$index, scope.row)"
              type="text"
              size="small"
            >
              <div
                :class="[scope.row.projectStatus == 4 ? 'color2' : 'color4']"
              >
                {{ scope.row.projectStatus == "4" ? "开启" : "终止" }}
              </div>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="init"
      />

    </div>
    <!---------弹出层-------------------------------------->
    <el-dialog :visible.sync="realWorkActive" title="手动记录资源配置"   width="30%">
      <el-form
        ref="realForm"
        :model="realFormData"
        :rules="realrules"
        size="medium"
        label-width="100px"
      >
        <el-form-item label="实际使用" prop="realWork">
          <el-input
            v-model="realFormData.realWork"
            placeholder="请输入实际使用"
            clearable   @input="handleEdit"
            :style="{ width: '100%' }"
          >
            <template slot="append">人日</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="realWorkActive = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
import "moment/locale/zh-cn";
import {
  queryDict,
  searchProjectList,
  updateProjectById,
  updateProjectStatus,exportExcel,
} from "@/api/proManager/proManager";
import { getMonthStartEnd ,getToday} from "@/utils/index";
export default {
  name:"ProManager",
  data() {
    let startDate = ''//getMonthStartEnd("start");
    let endDate = ''//getMonthStartEnd("endD");
    return {
      realWorkActive: false,
      realFormData: {
        realWork: "",
      },
      realrules: {
        realWork: [
          {
            required: true,
            message: "请输入实际使用",
            trigger: "blur",
          },
        ],
      },
      // 弹出层 以上
      tableData: [],
      //countScopeOptions: [], //统计范围 1.全部，2.仅我负责，3.仅部门成员
      scopeOptions: [],//统计范围 1.全部，2.仅我负责，3.仅部门成员
      countScopeInit:'',
      projectStatusOptions: [
        {
          label: "全部",
          value: '',
        },
        {
          label: "进行中",
          value: 1,
        },
        {
          label: "已结束",
          value: 2,
        },
        {
          label: "未开始",
          value: 3,
        },
        {
          label: "已终止",
          value: 4,
        },
      ], //项目状态（1.进行中，2.已结束，3.未开始，4.已终止）
      priorityOptions: [
        {
          label: "最高",
          value: 1,
        },
        {
          label: "高",
          value: 2,
        },
        {
          label: "普通",
          value: 3,
        },
        {
          label: "较低",
          value: 4,
        },
      ],
      searchForm: {
        // 项目名称
        projectName: "",
        // 统计范围 1.全部，2.仅我负责，3.仅部门成员
        countScope: "",
        // 优先级（1.最高，2.高，3.普通，4.较低）
        priority: "",
        // 开始和结束时间
        projectStartEndTime:'',// [startDate, endDate],
        // 项目开始时间
        projectStartTime: startDate,
        // 项目结束时间
        projectEndTime: endDate,
        // 项目状态（1.进行中，2.已结束，3.未开始，4.已终止）
        projectStatus: 1,
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      loading: false
    };
  },
  mounted() {
    let scopeOptions = []
    const all_permission = "*:*:*"; // 我是超管
    const options = [
      { permi: 'projectManager:proManager:viewAllPro', label: '全部', value: 1 },
      { permi: 'projectManager:proManager:viewMyPro', label: '仅我负责', value: 2 },
      { permi: 'projectManager:proManager:viewMemberPro', label: '仅部门成员', value: 3 },
      { permi: '*:*:*', label: '全部', value: 1 }
    ]
    options.forEach(v1 => {
      this.$store.getters.permissions.forEach(v2 => {
        if (v1.permi === v2) {
          scopeOptions.push(v1)
        }
      })
    })
    //console.log(scopeOptions);
    this.scopeOptions = scopeOptions
    //console.log(scopeOptions);
    if (scopeOptions.length) {
      this.searchForm.countScope = parseInt(scopeOptions[0].value)
    }
    // 额外的判断 页面初始化 判断用户的角色  isJurisdiction 判断当前的值是否存在 返回true or false
    // 部门主管 deptdirector  3
    // 项目主管 projectdirector 2
    // 运营管理 operatemanage
    // 项目监管 管理员 projectsupervision || admin ==>  1

    /*------------------额外的初始化查询的判断------------------------------*/
    this.init();
    // console.log(getToday()+"--------");
  },
  methods: {
    // 新建项目
    onAddProject(){
      sessionStorage.removeItem("addProject");
      this.$router.replace("/projectManager/proManager-auth/addProject")
    },

    // 导出
    exportExcelHandel(){
      if(this.searchForm.projectStartEndTime){
         // if(this.searchForm.projectStartEndTime&&this.searchForm.projectStartEndTime.length>0){
         this.searchForm.projectStartTime = this.searchForm.projectStartEndTime[0];
         this.searchForm.projectEndTime = this.searchForm.projectStartEndTime[1];
       }else{
         this.searchForm.projectStartTime = "";
         this.searchForm.projectEndTime = "";
       }
       let params ={
        ...this.searchForm
       }
         exportExcel(params).then((res) => {
          console.log(res);
            let blob = new Blob([res], {
              // type:"application/vnd.ms-excel",
                type: "application/octet-stream;charset=UTF-8",
            });
            console.log(blob);
            let timeString =  moment().format("YYYYMMDDhhmmss");
            const fileName = `项目管理${timeString}.xlsx` // 下载文件名称
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          this.$message.success("导出成功！");

        });
        // /projectManage/project/export
    },

    handleEdit(e) {
      // 只允许输入数字+小数点，小数点后2位，且保证小数点不能为第一位
     let checkPlan = '' + this.realFormData.realWork
      checkPlan = checkPlan
        .replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
        .replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        .replace(/^\./g, '') // 保证第一个为数字而不是.
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
      if (checkPlan.indexOf('.') < 0 && checkPlan !== '') {
        // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        checkPlan = parseFloat(checkPlan) + ''
      } else if (checkPlan.indexOf('.') >= 0) {
        checkPlan = checkPlan
          .replace(/^()*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
      }
      this.realFormData.realWork = checkPlan
},

    handleConfirm() {
      this.$refs["realForm"].validate((valid) => {
        if (!valid) return;
        let params = {
          projectId: this.realFormData.projectId, // 项目id
          realWork: this.realFormData.realWork, // 人日
        };
        updateProjectById(params).then((res) => {
          console.log(res);
          let { msg } = res;
          this.$message.success(msg);
          this.init();
        });
        this.realWorkActive = false;
      });
    },
    /* 实际完成工作的修改 此人的工时 */
    // 手动记录资源配置

    updateRealWork(index, row) {
      this.realWorkActive = true;

      this.realFormData = { ...this.realFormData, ...row };
      this.$refs['realForm'].resetFields()
    },
    /* 开启或者终止  项目详情 */
    toggleActive(index, row) {
      console.log(index, row);
      let params = {
        projectId: row.projectId,
      };
      updateProjectStatus(params).then((res) => {
        console.log(res);
        let { msg } = res;
        this.$message.success(msg);
        this.init();
      });
    },
    /* 查看项目详情 */
    detailProject(index, row) {
      // console.log(index, row);
      // projectId://项目id
      // startTime://统计开始时间
      // endTime://统计结束时间
      // countScope://统计范围 1.全部，2.仅我负责，3.仅部门成员
      // this.$router.push({ path:'/projectManager/proDetails/', query:{ projectId:row.projectId,projectName:row.projectName,countScope:this.searchForm.countScope,
      // startTime:row.projectStartTime,endTime:getToday()}})
       const obj = { path:'/projectManager/proManager-auth/proDetails', query:{ projectId:row.projectId,
       projectName:row.projectName,countScope:this.searchForm.countScope,
            startTime:row.projectStartTime,endTime:row.projectEndTime}};
            // getToday()
      this.$tab.closeOpenPage(obj);

    },
    /*查询字典的接口   暂时没用上*/
    getDictList(dictCode) {
      queryDict(dictCode).then((res) => {
        if (dictCode == "project_phase") {
          this.projectStageOptions = res.data;
        }
        if (dictCode == "project_type") {
          this.projectTypeOptions = res.data;
        }
        if (dictCode == "serivce_obj_type") {
          this.projectServiceOptions = res.data;
        }
        // if(dictCode=="project_priority"){
        //   this.priorityOptions= res.data
        // }
      });
    },
   // 给某一行添加背景色class
    rowStyle({ row, rowIndex }) {
      // 若成本上限小于成本预算，则高亮显示对应行，高亮色色值：# FFE7EA；
      // 若与进度偏差同时满足，则优先高亮提醒进度偏差；
      if(row.isYellow){
        return 'isYellow'
      }else{
        if(row.isPink){
          return "isPink"
        }
        return ''
      }
      // ysCost
    },
    init() {
      // let params = this.clearNullParam({ ...this.searchParame });
      if(this.searchForm.projectStartEndTime){
        // if(this.searchForm.projectStartEndTime&&this.searchForm.projectStartEndTime.length>0){
             this.searchForm.projectStartTime = this.searchForm.projectStartEndTime[0];
        this.searchForm.projectEndTime = this.searchForm.projectStartEndTime[1];
      }else{
        this.searchForm.projectStartTime = "";
        this.searchForm.projectEndTime = "";
      }
      this.loading = true;
      searchProjectList(this.searchForm, this.queryParams.pageNum, this.queryParams.pageSize).then((res) => {
        this.loading = false;
        let { msg } = res;
        // 添加额外的字段，用于展示 预算偏差or 进度偏差是否小于0
        res.rows.map(item=>{
          // item.costUp = 123
          // jdSchedule    ysDeviation
          item.isYellow = false // 默认没有黄色
          item.isPink = false // 默认无粉色
          // 预算偏差or 进度偏差是否小于0
          if(item.jdSchedule<0||item.ysDeviation<0){
            item.isYellow =true // 小于才给黄色
          }
          // 如果 成本上限小于成本预算 则 粉色展示
          if(item.costUp<item.ysCost){
             item.isPink =true // 小于才给粉色
          }
        })
        // this.tableData = res.data;
        this.tableData = res.rows;
        this.total = res.total;
        // this.$message.success(msg);
      }).catch(()=>{
        this.loading = false;
        this.tableData = [];
      });
    },

    totalOutYear(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        // 第一行现实 合计
        if (index === 0) {
          sums[index] = "总计";
          return;
        }
        if (index ===2||index ===3) {
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
            column.property == "ysConfig" ||
            column.property == "jhConfig" ||
            column.property == "sjConfig" ||
            column.property == "realWork"
          ) {
            sums[index] =sums[index].toFixed(2)
            sums[index] += "人日";
          }
          else if (
            column.property == "ysCost" ||
            column.property == "jhCost" ||
            // column.property == "shijiyiyong" ||
            column.property == "sjCost" ||
            column.property == "ysDeviation"
          ) {
            sums[index] =sums[index].toFixed(2)
            sums[index] += "";
          }
          else {
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
<style scoped>
.app-container {
  padding: 0;
}
  /* {
          label: "最高",
          value: 1,
        },
        {
          label: "高",
          value: 2,
        },
        {
          label: "普通",
          value: 3,
        },
        {
          label: "较低",
          value: 4,
        }, */
.priority1{color: #f56c6c;}
.priority2{color: #e6a23c;}
.priority3{color: #409eff;}
.priority4{color: #909399;}
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
.yuan{
  width: 8px;
  height: 8px;
  border-radius: 10px;
  border: none;
  display: inline-block;
  margin-left: 8px;
}
.yuan1 {
  background-color: #f56c6c;
  }
.yuan2 {
  background-color: #e6a23c;
  }
.yuan3 {
  background-color: #409eff;
}
.yuan4 {
  background-color: #909399;
}
.isNew{
  background-image: url('../../../assets/images/newIco.png');
    background-position: left top;
    background-repeat: no-repeat;
    background-size: 20px 20px;
    width: 20px;
    height: 20px;
    left: 2px;
    top: 2px;
    display: inline-block;
    position: absolute;
}
  .myTable
       /deep/  .el-table__fixed{
        height:auto !important;
        bottom:17px !important;


  }

</style>
<style>
 .isYellow{
  background-color:#FFE7EA
  }
  .isPink{
     background-color:#FFE7EA
  }
/***加上这个可以去掉table的hover效果***/
/* .el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
.el-table__body tr.current-row > td,
.el-table__body tr.hover-row.current-row > td,
.el-table__body tr.hover-row.el-table__row--striped.current-row > td,
.el-table__body tr.hover-row.el-table__row--striped > td,
.el-table__body tr.hover-row > td {
  background-color: #FAFAC8 !important;
} */
</style>

<style lang="scss">
  .isYellow{
  background-color:#FAFAC8 !important
  }
  .isPink{
     background-color:#FFE7EA !important
  }
.app-containers{
  .el-table__fixed thead>:first-child  .is-sortable{
    background:#E8E8F4!important;
  }
  .el-table__fixed-right .el-table__fixed-header-wrapper tr:last-child  .is-leaf{
    background:#E8E8F4!important;
  }
  .myTable .el-table__body-wrapper{
        margin-top: 0px;
        z-index:2;
    }
//  .myTable .el-table__fixed-footer-wrapper tbody td.el-table__cell{
//   padding: 9px;
//  }
}
.fontRight{
  text-align: right;
}

</style>
