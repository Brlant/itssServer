<template>
  <div class="app-containers app-container">
    <div class="pageTitle cls">
      <div class="leftTitle">
        项目组管理
        <div class="rightBtns">
          <!-- 必须是项目主管的角色 -->
          <el-button size="mini" type="primary" v-if="isJurisdiction('projectdirector','admin')">
            <span @click='add'  v-hasPermi="['projectManager:addTeam:add']"
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
                
                >
                </el-date-picker>
              </el-form-item>
            <!-- </el-col>
          
            <el-col :span="5"> -->
              <el-form-item label="搜索">
                <el-input
                  v-model="searchForm.projectName"
                  
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
      >
        <el-table-column        
          sortable
          fixed
          label="项目组"
          min-width="120"
          prop='aa'
        >
        </el-table-column>
        <el-table-column
          fixed
          sortable
          label="负责人"
          width="100"
          prop='bb'
        >
        </el-table-column>
        <el-table-column        
          fixed
          sortable
          label="开始日期"
          width="120"
        >
        </el-table-column>
        <el-table-column
        
          fixed
          sortable
          label="结束日期"
          width="120"
        >
          <!-- <template slot-scope="scope">
            {{ scope.row.projectEndTime  }}
          </template> -->
        </el-table-column>
        <el-table-column label="预算配置" width="120">
          <!-- <template slot-scope="scope"> {{ scope.row.ysConfig }}人日 </template> -->
          <template>10</template>
        </el-table-column>
        <el-table-column label="成本预算" width="120">
          <!-- <template slot-scope="scope">
            {{ scope.row.ysCost }}
          </template> -->
            <template>10</template>
        </el-table-column>

        <el-table-column label="计划配置已用" width="130">
          <!-- <template slot-scope="scope"> {{ scope.row.jhConfig }}人日 </template> -->
            <template>10</template>
        </el-table-column>
        <el-table-column label="计划预算已用" width="130">
          <!-- <template slot-scope="scope">
            {{ scope.row.jhCost }}
          </template> -->
            <template>10</template>
        </el-table-column>
        <el-table-column label="计划当前进度" width="130">
          <!-- <template slot-scope="scope"> {{ scope.row.jhSchedule }}% </template> -->
            <template>10</template>
        </el-table-column>

        <el-table-column   label="实际配置已用" width="130">
          <!-- <template slot-scope="scope"> {{ scope.row.sjConfig }}人日 </template> -->
            <template>10</template>
        </el-table-column>
        <el-table-column label="实际预算已用" width="130">
          <!-- <template slot-scope="scope"> {{ scope.row.sjCost }} </template> -->
            <template>10</template>
        </el-table-column>

        <el-table-column label="实际完成工作" width="130">
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
            <template>10</template>
        </el-table-column>
        <el-table-column label="实际当前进度" width="130">
          <!-- <template slot-scope="scope"> {{ scope.row.sjSchedule }}% </template> -->
            <template>10</template>
        </el-table-column>

        <el-table-column label="预算偏差" width="130">
          <!-- <template slot-scope="scope">
            <span :class="['piancha' + scope.row.pianchaActive]">
              {{
                scope.row.pianchaActive == 2
                  ? "-" + scope.row.ysDeviation
                  : scope.row.ysDeviation
              }}
            </span>
          </template> -->
            <template>10</template>
        </el-table-column>
        <el-table-column label="进度偏差" width="130">
          <!-- <template slot-scope="scope"> {{ scope.row.jdSchedule }} </template> -->
            <template>10</template>
        </el-table-column>

        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
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
              style='color:red;'
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
import {
  queryDict,
  searchProjectList,
  updateProjectById,
  updateProjectStatus,
} from "@/api/proManager/proManager";
import { getMonthStartEnd ,getToday} from "@/utils/index";
export default {
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
      tableData: [{aa:'aa',bb:"bb"}],
      countScopeOptions: [], //统计范围 1.全部，2.仅我负责，3.仅部门成员
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
        // 开始和结束时间
        projectStartEndTime:'',// [startDate, endDate],
        // 项目开始时间
        projectStartTime: startDate,
        // 项目结束时间
        projectEndTime: endDate,
      },
    };
  },
  mounted() {
  
 
  },
  methods: {
    detailProject(){
         // startTime:row.projectStartTime,endTime:getToday()}})
       const obj = { path:'/projectManager/teamDetail'};
            // getToday()
      this.$tab.closeOpenPage(obj);
        //  this.$router.push('/projectManager/team/teamDetail')
    },
    add(){
       const obj = { path:'/projectManager/addTeam'};
            // getToday()
      this.$tab.closeOpenPage(obj);
    },
    toggleActive(){
        // this.$router.push('/projectManager/editTeam')
         const obj = { path:'/projectManager/editTeam'};
            // getToday()
      this.$tab.closeOpenPage(obj);
    }
    }
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
<style lang="scss">
.app-containers{
   thead>:first-child  .is-sortable{
    background:#E8E8F4!important;
  }
  .el-table__fixed-right .el-table__fixed-header-wrapper tr:last-child  .is-leaf{
    background:#E8E8F4!important;
  }
  .myTable .el-table__body-wrapper{
        margin-top: 0px;
        z-index:2;
    }
 .myTable .el-table__fixed-footer-wrapper tbody td.el-table__cell{
  padding: 9px;
 }
}


</style>
