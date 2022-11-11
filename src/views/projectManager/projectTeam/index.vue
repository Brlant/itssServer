<template>
  <div class="app-containers app-container">
    <div class="pageTitle cls">
      <div class="leftTitle">
        项目组管理
        <div class="rightBtns">
          <!-- 必须是项目主管的角色 -->
          <el-button
            size="mini"
            type="primary"
            v-if="isJurisdiction('projectdirector', 'admin')"
             v-hasPermi="['projectManager:addTeam:add']"
              @click="add"
          >
            <span
              >新建项目组</span
            >
          </el-button>

          <!-- <el-button size="mini" type="success">导出Excel</el-button> -->
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
              @change="pickerChange"
            >
            </el-date-picker>
          </el-form-item>
          <!-- </el-col>
          
            <el-col :span="5"> -->
          <el-form-item label="搜索">
            <el-input
              v-model="searchForm.projectName"
              @blur="query"
              placeholder="请输入项目名称"
              clearable
            ></el-input>
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
        class="myTable"
        border
        style="width: 100%"
        max-height="650"
        :span-method="arraySpanMethod"
      >
        <el-table-column
          sortable
          fixed
          label="项目组"
          min-width="120"
          prop="projectGroupName"
        >
        <template slot-scope="scope">
          <span @click="detailProject(scope.$index, scope.row)">{{scope.row.projectGroupName}}</span>
        </template>
        </el-table-column>
        <el-table-column
          fixed
          sortable
          label="负责人"
          width="100"
          prop="userName"
        >
        </el-table-column>
        <el-table-column
          fixed
          sortable
          label="开始日期"
          width="120"
          prop="startDate"
        >
        </el-table-column>
        <el-table-column
          fixed
          sortable
          label="结束日期"
          width="120"
          prop="endDate"
        >
          <!-- <template slot-scope="scope">
            {{ scope.row.projectEndTime  }}
          </template> -->
        </el-table-column>
        <el-table-column prop="ysConfig" label="预算配置" width="120">
          <template slot-scope="scope"> {{ scope.row.ysConfig }}人日 </template>
        </el-table-column>
        <el-table-column label="成本预算" width="120" prop="ysCost">
          <template slot-scope="scope">
            {{ scope.row.ysCost }}
          </template>
        </el-table-column>

        <el-table-column label="计划配置已用" width="130" prop="jhConfig">
          <template slot-scope="scope"> {{ scope.row.jhConfig }}人日 </template>
        </el-table-column>
        <el-table-column label="计划预算已用" width="130" prop="jhCost">
          <template slot-scope="scope">
            {{ scope.row.jhCost }}
          </template>
        </el-table-column>
        <el-table-column label="计划当前进度" width="130" prop="jhSchedule">
          <template slot-scope="scope"> {{ scope.row.jhSchedule }}% </template>
        </el-table-column>

        <el-table-column label="实际配置已用" width="130" prop="sjConfig">
          <template slot-scope="scope"> {{ scope.row.sjConfig }}人日 </template>
        </el-table-column>
        <el-table-column label="实际预算已用" width="130" prop="sjCost">
          <template slot-scope="scope"> {{ scope.row.sjCost }} </template>
        </el-table-column>

        <el-table-column label="实际完成工作" width="130" prop="realWork">
          <!-- <template slot-scope="scope">
            {{ scope.row.realWork }}人日
            <el-button
            v-show="isProjectByUser(scope.row)||isJurisdiction('admin')"
              @click.native.prevent="updateRealWork(scope.$index, scope.row)"
              type="text"
              size="mini"
              >更改</el-button
            >
          </template> -->
          <template slot-scope="scope"> {{ scope.row.realWork }} 人日</template>
        </el-table-column>
        <el-table-column label="实际当前进度" width="130" prop="sjSchedule">
          <template slot-scope="scope"> {{ scope.row.sjSchedule }}% </template>
        </el-table-column>

        <el-table-column label="预算偏差" width="130" prop="ysDeviation">
          <template slot-scope="scope">
            <!-- <span :class="['piancha' + scope.row.pianchaActive]">
              {{
                scope.row.pianchaActive == 2
                  ? "-" + scope.row.ysDeviation
                  : scope.row.ysDeviation
              }}
            </span> -->
            <span class="piancha0" v-if="scope.row.ysDeviation == 0">{{
              scope.row.ysDeviation
            }}</span>
            <span class="piancha2" v-if="scope.row.ysDeviation < 0">{{
              scope.row.ysDeviation
            }}</span>
            <span class="piancha1" v-if="scope.row.ysDeviation > 0">{{
              scope.row.ysDeviation
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="进度偏差" width="130" prop="jdSchedule">
          <template slot-scope="scope">
            <span class="piancha0" v-if="scope.row.jdSchedule == 0">{{
              scope.row.jdSchedule
            }}</span>
            <span class="piancha2" v-if="scope.row.jdSchedule < 0">{{
              scope.row.jdSchedule
            }}</span>
            <span class="piancha1" v-if="scope.row.jdSchedule > 0">{{
              scope.row.jdSchedule
            }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope" v-if='scope.row.projectGroupName!="总计"'>
            <!-- v-show="isProjectByUser(scope.row)||isJurisdiction('admin','deptdirector','projectdirector','projectsupervision','operatemanage')" -->
            <el-button
              @click.native.prevent="detailProject(scope.$index, scope.row)"
              type="text"
              size="small"
              v-hasPermi="['projectManager:teamDtail:query']"
            >
              详情
            </el-button>
            <el-button
              @click.native.prevent="toggleActive(scope.$index, scope.row)"
              type="text"
              size="small"
              v-hasPermi="['projectManager:editTeam:edit']"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="small"
              style="color: red"
              @click="del(scope.row)"
              v-hasPermi="['projectManager:editTeam:edit']"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { teamQuery, deleteTeam } from "@/api/proManager/teamMange";
export default {
  data() {
    let startDate = ""; //getMonthStartEnd("start");
    let endDate = ""; //getMonthStartEnd("endD");
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
      countScopeOptions: [], //统计范围 1.全部，2.仅我负责，3.仅部门成员
      countScopeInit: "",
      startDate: "",
      endDate: "",
      projectStatusOptions: [
        {
          label: "全部",
          value: "",
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
        // 开始和结束时间
        projectStartEndTime: "", // [startDate, endDate],
        // 项目开始时间
        projectStartTime: startDate,
        // 项目结束时间
        projectEndTime: endDate,
      },
    };
  },
  mounted() {
    this.query();
  },
  methods: {
    pickerChange(value) {
      console.log(value, "aaaaa");
      this.startDate = value[0];
      this.endDate = value[1];
      this.query();
    },
    query() {
      let data = {
        startDate: this.startDate,
        endDate: this.endDate,
        projectGroupName: this.searchForm.projectName,
      };
      teamQuery(data).then((res) => {
        this.tableData = res.data;
      });
    },
    detailProject(index, row) {
      console.log(index, row);
      // startTime:row.projectStartTime,endTime:getToday()}})
      const obj = {
        path: "/projectManager/teamDetail",
        query: {
          project: row,
          startDate: this.startDate,
          endDate: this.endDate,
        },
      };
      // getToday()
      this.$tab.closeOpenPage(obj);
      //  this.$router.push('/projectManager/team/teamDetail')
    },
    add() {
      const obj = { path: "/projectManager/addTeam" };
      // getToday()
      this.$tab.closeOpenPage(obj);
    },
    del(row) {
      deleteTeam(row.projectGroupId).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg);
          this.query();
        }
      });
    },
    toggleActive(index, row) {
      // this.$router.push('/projectManager/editTeam')
      const obj = { path: "/projectManager/editTeam", query: { project: row } };
      // getToday()
      this.$tab.closeOpenPage(obj);
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      console.log(rowIndex);
      // console.log(this.userData[0].workUserProjectVoList)
      if (rowIndex == this.tableData.length - 1) {
        console.log("qqqqq");
        if (columnIndex === 0) {
          return {
            rowspan: 1,
            colspan: 4,
          };
        } else if (
          columnIndex === 1 ||
          columnIndex === 2 ||
          columnIndex === 3
        ) {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
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
.priority1 {
  color: #f56c6c;
}
.priority2 {
  color: #e6a23c;
}
.priority3 {
  color: #409eff;
}
.priority4 {
  color: #909399;
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
.yuan {
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
.isNew {
  background-image: url("../../../assets/images/newIco.png");
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

.myTable /deep/  .el-table__fixed {
  height: auto !important;
  bottom: 17px !important;
}
</style>
<style lang="scss">
.app-containers {
  thead > :first-child .is-sortable {
    background: #e8e8f4 !important;
  }
  .el-table__fixed-right
    .el-table__fixed-header-wrapper
    tr:last-child
    .is-leaf {
    background: #e8e8f4 !important;
  }
  .myTable .el-table__body-wrapper {
    margin-top: 0px;
    z-index: 2;
  }
  .myTable .el-table__fixed-footer-wrapper tbody td.el-table__cell {
    padding: 9px;
  }
}
</style>
