<template>
  <div class="app-container">
    <div class="pageTitle cls">
      <div class="leftTitle">
        项目管理
        <div class="rightBtns">
          <el-button size="mini" type="primary">
            <router-link :replace="true" :to="'/ProjectManager/AddProject'"
              >新建项目</router-link
            >
          </el-button>

          <el-button size="mini" type="success">导出Excel</el-button>
        </div>
      </div>

      <div class="searchBox">
        <el-form ref="form" :model="searchForm" label-width="80px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="统计时间">
                <el-date-picker
                  v-model="searchForm.projectStartEndTime"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="统计范围">
                <el-select
                  v-model="searchForm.countScope"
                  placeholder="请选择统计范围"
                >
                  <el-option
                    v-for="item in countScopeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="搜索">
                <el-input
                  v-model="searchForm.projectName"
                  placeholder="请输入项目名称"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="状态">
                <el-select v-model="searchForm.projectStatus" placeholder="请选择">
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
            </el-col>
            <el-col :span="3">
              <el-form-item label="优先级">
                <el-select v-model="searchForm.priority" placeholder="请选择">
                  <el-option
                    v-for="item in priorityOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                    <span :class="['color' + item.value]">{{
                      item.label
                    }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="hr"></div>
    <div class="pageTitle cls">
      <el-table
        :data="tableData"
        show-summary
        :summary-method="totalOutYear"
        border
        style="width: 100%"
        max-height="650"
      >
        <el-table-column
          fixed
          prop="projectName"
          sortable
          label="项目"
          width="150"
        >
        </el-table-column>
        <el-table-column
          fixed
          prop="projectStatus"
          sortable
          label="项目状态"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.projectStatus | filterProjectStatus }}
          </template>
        </el-table-column>
        <el-table-column
          fixed
          prop="projectStartTime"
          sortable
          label="开始日期"
          width="120"
        >
          <template slot-scope="scope">
            {{ scope.row.projectStartTime | formatDate }}
          </template>
        </el-table-column>
        <el-table-column
          fixed
          prop="projectEndTime"
          sortable
          label="结束日期"
          width="120"
        >
          <template slot-scope="scope">
            {{ scope.row.projectEndTime | formatDate }}
          </template>
        </el-table-column>
        <el-table-column prop="ysConfig" label="预算配置" width="120">
          <template slot-scope="scope">
            {{ scope.row.ysConfig }}人日
          </template>
        </el-table-column>
        <el-table-column prop="ysCost" label="成本预算" width="120">
          <template slot-scope="scope">
            {{ scope.row.ysCost }}
          </template>
        </el-table-column>

        <el-table-column
          prop="jhConfig"
          label="计划配置已用"
          width="130"
        >
          <template slot-scope="scope">
            {{ scope.row.jhConfig }}人日
          </template>
        </el-table-column>
        <el-table-column
          prop="jhCost"
          label="计划预算已用"
          width="130"
        >
          <template slot-scope="scope">
            {{ scope.row.jhCost }}
          </template>
        </el-table-column>
        <el-table-column
          prop="jhSchedule"
          label="计划当前进度"
          width="130"
        >
          <template slot-scope="scope">
            {{ scope.row.jhSchedule }}%
          </template>
        </el-table-column>

        <el-table-column
          prop="sjConfig"
          label="实际配置已用"
          width="130"
        >
          <template slot-scope="scope">
            {{ scope.row.sjConfig }}人日
          </template>
        </el-table-column>
        <el-table-column
          prop="sjCost"
          label="实际预算已用"
          width="130"
        >
          <template slot-scope="scope">
            {{ scope.row.sjCost }}人日
          </template>
        </el-table-column>

        <el-table-column
          prop="realWork"
          label="实际完成工作"
          width="130"
        >
          <template slot-scope="scope">
            {{ scope.row.realWork }}人日
          </template>
        </el-table-column>
        <el-table-column
          prop="sjSchedule"
          label="实际当前进度"
          width="130"
        >
          <template slot-scope="scope">
            {{ scope.row.sjSchedule }}%
          </template>
        </el-table-column>

        <el-table-column prop="ysDeviation" label="预算偏差" width="130">
          <template slot-scope="scope">
            <span :class="['piancha' + scope.row.pianchaActive]">
              {{
                scope.row.pianchaActive == 2
                  ? "-" + scope.row.ysDeviation
                  : scope.row.ysDeviation
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="jdSchedule" label="进度偏差" width="130">
          <template slot-scope="scope">
            {{ scope.row.jdSchedule }}%
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRow(scope.$index, tableData4)"
              type="text"
              size="small"
            >
              详情
            </el-button>
            <el-button
              @click.native.prevent="deleteRow(scope.$index, tableData4)"
              type="text"
              size="small"
            >
              开启
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import {
  getTimeProcess,
  queryDict,
  addProjectList,
  searchProjectList,
} from "@/api/proManager/proManager";
import { getMonthStartEnd } from "@/utils/index";
export default {
  data() {
    let startDate = getMonthStartEnd('start')
    let endDate = getMonthStartEnd('endD')
    return {
      tableData4: [
        {
          projectName: "调度大屏(内)",
          projectStatus: "1",
          endData: "1664177454000",
          startData: "1664123454000",

          ysConfig: "200",
          ysCost: "3000.00",

          jhConfig: "50", //计划配置已用
          jhCost: "50", //计划预算已用
          jhSchedule: "25.00", //计划当前进度

          sjConfig: "50", //实际配置已用
          sjCost: "1200.00", //实际预算已用

          realWork: "50", //实际完成工作
          sjSchedule: "25", // 实际当前进度
          pianchaActive: 2, // 0 正常 1 盈利 2 亏损
          ysDeviation: "2000.00",
          jdSchedule: "24",
        },
        {
          projectName: "调度大屏(内)",
          projectStatus: "2",
          endData: "1664091054000",
          startData: "1664037054000",

          ysConfig: "200",
          ysCost: "3000.00",

          jhConfig: "50", //计划配置已用
          jhCost: "50", //计划预算已用
          jhSchedule: "25.00", //计划当前进度

          sjConfig: "50", //实际配置已用
          sjCost: "1200.00", //实际预算已用

          realWork: "50", //实际完成工作
          sjSchedule: "25", // 实际当前进度

          pianchaActive: 1, // 0 正常 1 盈利 2 亏损
          ysDeviation: "2000.00",
          jdSchedule: "24",
        },
        {
          projectName: "调度大屏(内)",
          projectStatus: "3",
          endData: "1664004654000",
          startData: "1663950654000",

          ysConfig: "200",
          ysCost: "3000.00",

          jhConfig: "50", //计划配置已用
          jhCost: "50", //计划预算已用
          jhSchedule: "25.00", //计划当前进度

          sjConfig: "50", //实际配置已用
          sjCost: "1200.00", //实际预算已用

          realWork: "50", //实际完成工作
          sjSchedule: "25", // 实际当前进度
          pianchaActive: 0, // 0 正常 1 盈利 2 亏损
          ysDeviation: "2000.00",
          jdSchedule: "24",
        },
        {
          projectName: "调度大屏(内)",
          projectStatus: "4",
          endData: "1663918254000",
          startData: "1663864254000",

          ysConfig: "200",
          ysCost: "3000.00",

          jhConfig: "50", //计划配置已用
          jhCost: "50", //计划预算已用
          jhSchedule: "25.00", //计划当前进度

          sjConfig: "50", //实际配置已用
          sjCost: "1200.00", //实际预算已用

          realWork: "50", //实际完成工作
          sjSchedule: "25", // 实际当前进度
          pianchaActive: 0, // 0 正常 1 盈利 2 亏损
          ysDeviation: "2000.00",
          jdSchedule: "24",
        },
      ],
      tableData: [],
      countScopeOptions:[],
      projectStatusOptions:[],
      priorityOptions:[],
      searchForm: {
        // 项目名称
        projectName: "",
        // 统计范围 1.全部，2.仅我负责，3.仅部门成员
        countScope: "",
        // 优先级（1.最高，2.高，3.普通，4.较低）
        priority: "",
        // 开始和结束时间
        projectStartEndTime: [startDate,endDate],
        // 项目开始时间
        projectStartTime: startDate,
        // 项目结束时间
        projectEndTime: endDate,
        // 项目状态（1.进行中，2.已结束，3.未开始，4.已终止）
        projectStatus: "",
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // let parems = this.clearNullParam({ ...this.searchParame });
      searchProjectList(this.searchForm).then((res) => {
        let { msg } = res;
        this.tableData = res.data;
        this.$message.success(msg);
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
            column.property == "jhCost" ||
            column.property == "realWork"
          ) {
            sums[index] += "人日";
          } else if (
            column.property == "ysCost" ||
            column.property == "shijiyiyong" ||
            column.property == "sjCost" ||
            column.property == "ysDeviation"
          ) {
            sums[index] += "";
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
<style scoped>
.app-container {
  padding: 0;
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
