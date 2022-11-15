<template>
  <div class="app-container">
    <div class="searchBox">
      <el-form ref="form" :model="searchForm" label-width="60px" inline>
        <el-row>
          <el-col :span="6" style="text-align: left"> 机会列表 </el-col>
          <el-col :offset="6" :span="5">
            <el-form-item label="搜索">
              <el-input
                v-model="searchForm.chanceName"
                @change="init()"
                placeholder="请输入机会名称"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态">
              <el-select
                v-model="searchForm.chanceStatus"
                @change="init()"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in chanceStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <span :class="[item.value == 4 ? 'color4' : '']">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button type="primary"  v-hasPermi="['chanceManage:chance:create']" @click="addChance">新增机会</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- <div class="hr"></div> -->
    <div class="pageTitle cls">
      <el-table
        :data="tableData"
        class="myTable"
        border
        style="width: 100%"
        max-height="650"
      >
        <!-- @row-click="clickRow" -->
        <el-table-column prop="chanceName"  fixed="left" label="机会名称" min-width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.projectId"  class="priority4">{{ scope.row.chanceName }}</span>
            <span v-else class="priority3" style="cursor: pointer;"  v-hasPermi="['chanceManage:chance:all','chanceManage:chance:duty']"  @click="clickRow(scope.row)">
            <span   :class="['yuan', 'yuan' + scope.row.priority]"></span>
               {{ scope.row.chanceName }}
               </span>
          </template>
        </el-table-column>
        <el-table-column prop="chanceStatus" fixed="left" label="状态" width="80">
           <template slot-scope="scope">
            {{ scope.row.chanceStatus|filterChanceStatus }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="已转项目"  width="160">
            <template slot-scope="scope">
            
                 <router-link class="priority3" :to="{path:'/projectManager/proManager-auth/proDetails/', query:{ projectId:scope.row.projectId,projectName:scope.row.projectName,countScope:countScope}}">{{ scope.row.projectName}}</router-link>
             
             
            </template>
        </el-table-column>
        <el-table-column prop="chanceUserName" label="负责人" width="120"> </el-table-column>
        <el-table-column prop="customer" label="客户" width="300"> </el-table-column>
        <el-table-column prop="customerLink" label="客户联系人" width="180">
           <template slot-scope="scope">
            {{ scope.row.customerLink+"("+scope.row.tel+")" }}
          </template>
        </el-table-column>
        <el-table-column prop="budget" label="客户预算" width="120"> </el-table-column>
        <el-table-column prop="successRate" label="成功率" width="120"> </el-table-column>
        <el-table-column prop="expectStartTime" label="预计开始日期" width="120"> </el-table-column>
        <el-table-column prop="expectWork" label="估算工时(人日)" width="120"> </el-table-column>
        <el-table-column prop="expectOffer" label="估计报价" width="120"> </el-table-column>
        <el-table-column prop="remark" label="备注" width="220"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import {
 getChanceList,// 字典查询 传入字典名称
  queryDict 
} from "@/api/chanceManager/chanceManager";
export default {
  data() {
    return {
      countScope:"",// 统计范围
      scopeOptions:[],
      tableData: [
        {
          chanceName: "", //          机会名称
          chanceStatus: "", //          机会状态：1.新建、2.跟进中、3.已结束、4.已转项目
          priority: "", //          优先级（1.最高;2.高，3.普通，4.较低）
          projectId:null, //      已转项目
          projectName:null, //      已转项目
          chanceUserId: "",//       机会负责人id
          chanceUserName:"", //          机会负责人
          customer: "", //          客户
          customerLink: "", //          客户联系人
          tel: "", //          联系方式
          budget: "", //          客户预算
          successRate: "", //          成功率
          expectStartTime: "", //          预计开始时间
          expectEndTime: "", //          预计结束时间
          expectWork: "", //          预计工时（人日）
          expectOffer: "", //          预计报价
          chanceService: "", //          服务对象(1.对内;2.对外)
          remark: "", //          备注
        },
      ],

      chanceConfigList: [
        {
          postId: "", //职位id
          areaId: "", //区域id
          gradeId: "", //等级id
          skillIdList: "", //技能id
          startTime: "", //开始时间
          endTime: "", //结束时间
          workTime: "", //总工时
          workDay: "", //总人日（工作日*工时/8）
          planLoad: "", //计划负荷
          expectedCost: "", //预计成本
          chanceConfigScheduleList: [], //
          week: "", //周数
          startTime: "", //开始时间
        },
      ],
      chanceConfigScheduleList: [
        {
          week: "", //周数
          startTime: "", //开始时间
          endTime: "", //结束时间
          workTime: "", //工时
          weekDay: "", //工作日
          planLoad: "", //计划负荷
        },
      ],
      chanceStatusOptions: [
        { label: "全部", value: "" },
        { label: "新建",value: 1,},
        {label: "跟进中",value: 2,},
        { label: "已结束",value: 3,},
        { label: "已转项目", value: 4,},
      ], // 机会状态：1.新建、2.跟进中、3.已结束、4.已转项目
      searchForm: {
        // 机会名称
        chanceName: "",
        // 机会状态：1.新建、2.跟进中、3.已结束、4.已转项目
        chanceStatus: "",
      },
    };
  },
  
  mounted() {
    // 额外的判断 页面初始化 判断用户的角色  isJurisdiction 判断当前的值是否存在 返回true or false
    // 部门主管 deptdirector  3
    // 项目主管 projectdirector 2
    // 运营管理 operatemanage
    // 项目监管 管理员 projectsupervision || admin ==>  1
    let scopeOptions = []
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
    this.scopeOptions = scopeOptions
    console.log(scopeOptions);
    if (scopeOptions.length) {
      this.countScope = scopeOptions[0].value
    }
    /*------------------额外的初始化查询的判断------------------------------*/
    this.init()
  },
  methods: {
    init() {
      console.log("init");
      getChanceList(this.searchForm).then((res)=>{
          this.tableData = res.data
      })
    },
    // 单击行 查看详情
    clickRow(row, column, event){
      // console.log(row);
       // 点击单行进入详情页
      const obj = { path: "/chanceManager/chanceManager-auth/chanceDetails",query:{"chanceId":row.chanceId} };
      this.$tab.closeOpenPage(obj);
    },
    addChance() {
      // 新增 机会
      const obj = { path: "/chanceManager/chanceManager-auth/addChance" };
      this.$tab.closeOpenPage(obj);
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
.searchBox {
  padding: 20px 30px 0px 30px;
  margin-top: 10px;
}
.pageTitle{
  padding:0px 14px 34px 14px;

}
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

</style>
