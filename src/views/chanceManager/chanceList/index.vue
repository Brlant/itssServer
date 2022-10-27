<template>
  <div class="app-container">
 <div class="searchBox">
        <el-form ref="form" :model="searchForm" label-width="60px" inline>
           <el-row >
            <el-col :span="6" style="text-align:left" >
              机会列表
            </el-col>
             <el-col :offset="8" :span="4" >
              <el-form-item label="搜索">
                <el-input
                  v-model="searchForm.chanceName"
                  @change="init()"
                  placeholder="请输入机会名称"
                  clearable
                ></el-input>
              </el-form-item>
              </el-col>
             <el-col   :span="4" >
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
                    <span :class="[item.value == 4 ? 'color4' : '']">{{
                      item.label
                    }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
             <el-col :span="2" >
                <el-button type="primary" @click="addChance">新增机会</el-button>
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
        <el-table-column
          prop="chanceName"
          fixed
          label="机会名称"
          min-width="120"
        >
          <template slot-scope="scope">
            <span :class="[scope.row.isNew==1?'isNew':'']"></span>
            <span :class="['yuan','yuan'+scope.row.priority]"></span>
            {{ scope.row.chanceName }}
           
          </template>
        </el-table-column>
          <el-table-column
          prop="chanceName"
          fixed
          label="状态"
          width="120"
        >
         </el-table-column>
          <el-table-column
          prop="chanceName"
          label="已转项目"
        >
         </el-table-column>
          <el-table-column
          prop="chanceName"
          label="负责人"
          width="120"
        >
         </el-table-column>
          <el-table-column
          prop="chanceName"
          label="客户"
        >
         </el-table-column>
          <el-table-column
          prop="chanceName"
          label="客户联系人"
        >
         </el-table-column>
          <el-table-column
          prop="chanceName"
          label="客户预算"
        >
         </el-table-column>
          <el-table-column
          prop="chanceName"
          label="成功率"
          width="120"
        >
         </el-table-column>
          <el-table-column
          prop="chanceName"
          label="预计开始日期"
        >
         </el-table-column>
          <el-table-column
          prop="chanceName"
          label="估算工时(人日)"
        >
         </el-table-column>
          <el-table-column
          prop="chanceName"
          label="估计报价"
        >
         </el-table-column>
         <el-table-column
          prop="chanceName"
          label="备注"
        >
         </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
 

export default {
  data() {
    return {
      tableData: [],
         chanceStatusOptions: [
        {
          label: "全部",
          value: '',
        },
        {
          label: "新建",
          value: 1,
        },
        {
          label: "跟进中",
          value: 2,
        },
        {
          label: "已结束",
          value: 3,
        },
        {
          label: "已转项目",
          value: 4,
        },
      ], // 机会状态：1.新建、2.跟进中、3.已结束、4.已转项目
      searchForm: {
        // 机会名称
        chanceName: "",
        // 机会状态：1.新建、2.跟进中、3.已结束、4.已转项目
        chanceStatus: "",
      },
     }
  },
  mounted() {
  },
  methods: {
   init(){
    console.log("init");
   },
   addChance(){
    // 新增 机会
    const obj = { path:'/chanceManager/addChance/'};
    this.$tab.closeOpenPage(obj);
   }
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
 .searchBox{
  padding: 10px 20px;
  margin-top: 10px;
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
</style>
 
