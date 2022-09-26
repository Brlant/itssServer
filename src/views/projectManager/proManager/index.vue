<template>
  <div class="app-container">
    <div class="pageTitle cls">
      <div class="leftTitle">
        项目管理
        <div class="rightBtns">
          <el-button size="mini" type="primary">
            <router-link :replace='true' :to="'/ProjectManager/AddProject'">新建项目</router-link>
          </el-button>

          <el-button size="mini" type="success">导出Excel</el-button>
        </div>
      </div>

      <div class="searchBox">
        <el-form ref="form" :model="form" label-width="80px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="统计时间">
                <el-date-picker v-model="form.totalDate" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="统计范围">
                <el-select v-model="form.totalScope" placeholder="请选择统计范围">
                  <el-option label="仅部门成员" value="1"></el-option>
                  <el-option label="仅我负责的项目" value="2"></el-option>
                  <el-option label="全部" value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="搜索">
                <el-input v-model="form.proName" placeholder="请输入项目名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="状态">
                <el-select v-model="form.totalState" placeholder="请选择">
                  <el-option v-for="item in totalStateOptions" :key="item.value" :label="item.label" :value="item.value">
                    <span :class="[item.value == 4 ? 'color4' : '']">{{ item.label }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="优先级">
                <el-select v-model="form.totalLeval" placeholder="请选择">
                  <el-option v-for="item in totalLevalOptions" :key="item.value" :label="item.label" :value="item.value">
                    <span :class="['color' + item.value]">{{ item.label }}</span>
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
      <el-table :data="tableData4" show-summary :summary-method="totalOutYear" border style="width: 100%" max-height="650">
        <el-table-column fixed prop="projectName" sortable label="项目" width="150"> </el-table-column>
        <el-table-column fixed prop="projectStatus" sortable label="项目状态" width="100">
          <template slot-scope="scope">
            {{ scope.row.projectStatus | filterProjectStatus }}
          </template>
        </el-table-column>
        <el-table-column fixed prop="startData" sortable label="开始日期" width="120">
          <template slot-scope="scope">
            {{ scope.row.startData | formatDate }}
          </template>
        </el-table-column>
        <el-table-column fixed prop="endData" sortable  label="结束日期" width="120">
          <template slot-scope="scope">
            {{ scope.row.endData | formatDate }}
          </template>
        </el-table-column>
        <el-table-column prop="yusuanpeizhi" label="预算配置" width="120">
           <template slot-scope="scope">
            {{ scope.row.yusuanpeizhi  }}人日
          </template>
        </el-table-column>
        <el-table-column prop="chengbenyusuan"  label="成本预算" width="120">
           <template slot-scope="scope">
            {{ scope.row.chengbenyusuan }}
          </template>
        </el-table-column>

        <el-table-column prop="jihuapeizhiyiyong"  label="计划配置已用" width="130">
           <template slot-scope="scope">
            {{ scope.row.jihuapeizhiyiyong }}人日
          </template>
        </el-table-column>
          <el-table-column prop="jihuayusuanyiyong"  label="计划预算已用" width="130">
           <template slot-scope="scope">
            {{ scope.row.jihuayusuanyiyong }}
          </template>
        </el-table-column>
        <el-table-column prop="jihuadangqianjindu"  label="计划当前进度" width="130">
           <template slot-scope="scope">
            {{ scope.row.jihuadangqianjindu }}%
          </template>
        </el-table-column>

        <el-table-column prop="shijipeizhiyiyong"  label="实际配置已用" width="130">
           <template slot-scope="scope">
            {{ scope.row.shijipeizhiyiyong }}人日
          </template>
        </el-table-column>
        <el-table-column prop="shijiyusuanyiyong"  label="实际预算已用" width="130">
           <template slot-scope="scope">
            {{ scope.row.shijiyusuanyiyong }}人日
          </template>
        </el-table-column>

        <el-table-column prop="shijiwanchenggongzuo"  label="实际完成工作" width="130">
           <template slot-scope="scope">
            {{ scope.row.shijiwanchenggongzuo }}人日
          </template>
        </el-table-column>
         <el-table-column prop="shijidangqianjindu"  label="实际当前进度" width="130">
           <template slot-scope="scope">
            {{ scope.row.shijidangqianjindu }}%
          </template>
        </el-table-column>

        <el-table-column prop="yusuanpiancha"  label="预算偏差" width="130">
           <template slot-scope="scope">
            <span :class="['piancha'+scope.row.pianchaActive]">
            {{ scope.row.pianchaActive==2?'-'+scope.row.yusuanpiancha:scope.row.yusuanpiancha }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="jindupiancha"  label="进度偏差" width="130">
           <template slot-scope="scope">
            {{ scope.row.jindupiancha }}%
          </template>
        </el-table-column>
      
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click.native.prevent="deleteRow(scope.$index, tableData4)" type="text" size="small">
              详情
            </el-button>
              <el-button @click.native.prevent="deleteRow(scope.$index, tableData4)" type="text" size="small">
              开启
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData4: [
        {
          projectName: "调度大屏(内)",
          projectStatus: "1",
          endData: "1664177454000",
          startData: "1664123454000",

          yusuanpeizhi: "200",
          chengbenyusuan: "3000.00",

          jihuapeizhiyiyong:'50',//计划配置已用
          jihuayusuanyiyong: "50", //计划预算已用          
          jihuadangqianjindu: "25.00", //计划当前进度

          shijipeizhiyiyong: "50", //实际配置已用
          shijiyusuanyiyong: "1200.00", //实际预算已用

          shijiwanchenggongzuo: "50", //实际完成工作
          shijidangqianjindu: "25", // 实际当前进度
          pianchaActive:2, // 0 正常 1 盈利 2 亏损
          yusuanpiancha:'2000.00',
          jindupiancha:'24'
        },
          {
          projectName: "调度大屏(内)",
          projectStatus: "2",
          endData: "1664091054000",
          startData: "1664037054000",

          yusuanpeizhi: "200",
          chengbenyusuan: "3000.00",

          jihuapeizhiyiyong:'50',//计划配置已用
          jihuayusuanyiyong: "50", //计划预算已用          
          jihuadangqianjindu: "25.00", //计划当前进度

          shijipeizhiyiyong: "50", //实际配置已用
          shijiyusuanyiyong: "1200.00", //实际预算已用

          shijiwanchenggongzuo: "50", //实际完成工作
          shijidangqianjindu: "25", // 实际当前进度

            pianchaActive:1, // 0 正常 1 盈利 2 亏损
          yusuanpiancha:'2000.00',
          jindupiancha:'24'
        },
          {
          projectName: "调度大屏(内)",
          projectStatus: "3",
          endData: "1664004654000",
          startData: "1663950654000",

          yusuanpeizhi: "200",
          chengbenyusuan: "3000.00",

          jihuapeizhiyiyong:'50',//计划配置已用
          jihuayusuanyiyong: "50", //计划预算已用          
          jihuadangqianjindu: "25.00", //计划当前进度

          shijipeizhiyiyong: "50", //实际配置已用
          shijiyusuanyiyong: "1200.00", //实际预算已用

          shijiwanchenggongzuo: "50", //实际完成工作
          shijidangqianjindu: "25", // 实际当前进度
             pianchaActive:0, // 0 正常 1 盈利 2 亏损
          yusuanpiancha:'2000.00',
          jindupiancha:'24'
        },
          {
          projectName: "调度大屏(内)",
          projectStatus: "4",
          endData: "1663918254000",
          startData: "1663864254000",

          yusuanpeizhi: "200",
          chengbenyusuan: "3000.00",

          jihuapeizhiyiyong:'50',//计划配置已用
          jihuayusuanyiyong: "50", //计划预算已用          
          jihuadangqianjindu: "25.00", //计划当前进度

          shijipeizhiyiyong: "50", //实际配置已用
          shijiyusuanyiyong: "1200.00", //实际预算已用

          shijiwanchenggongzuo: "50", //实际完成工作
          shijidangqianjindu: "25", // 实际当前进度
             pianchaActive:0, // 0 正常 1 盈利 2 亏损
          yusuanpiancha:'2000.00',
          jindupiancha:'24'
        },
      ],
      totalScopeOptions: [
        { value: "1", label: "仅部门成员" },
        { value: "2", label: "仅我负责的项目" },
        { value: "3", label: "全部" },
      ],
      totalStateOptions: [
        { value: "1", label: "进行中" },
        { value: "2", label: "未开始" },
        { value: "3", label: "已结束" },
        { value: "4", label: "已终止" },
      ],
      totalLevalOptions: [
        { value: "1", label: "低" },
        { value: "2", label: "普通" },
        { value: "3", label: "紧急" },
        { value: "4", label: "非常紧急" },
      ],
      form: {
        totalDate: ["2022-01-01", "2022-12-31"],
        totalScope: "1",
        proName: "",
        totalState: "1",
        totalLeval: "1",
      },
    }
  },
  methods: {
    totalOutYear(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        // 第一行现实 合计
        if (index === 0) {
          sums[index] = '总计';
          return;
        }

        const values = data.map(item => Number(item[column.property]));
        // 总计核心代码块
          if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
                  if (column.property == 'yusuanpeizhi'||column.property == 'jihuapeizhiyiyong'||column.property == 'shijipeizhiyiyong'||column.property == 'jihuayusuanyiyong'||column.property == 'shijiwanchenggongzuo') {
          sums[index]+="人日";
        }
        else if (column.property == 'chengbenyusuan'||column.property == 'shijiyiyong'||column.property == 'shijiyusuanyiyong'||column.property == 'yusuanpiancha') {
          sums[index]+="";
        }
          else{
          sums[index] ="--"
        }
         // 总计核心代码块 
        }
       
      
         
      });
      return sums
    },

  },

  beforeCreate() {
    document.querySelector("body,html").setAttribute("style", "background-color:#E8E8F4;")
  },

  beforeDestroy() {
    document.querySelector("body,html").removeAttribute("style")
  },
}
</script>
<style scoped>
.app-container{
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
.piancha0{
  color: #333;
}
.piancha1{
  color: #26B0A8
}
.piancha2{
  color: #f56c6c
}
</style>
