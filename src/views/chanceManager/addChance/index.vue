<template>
  <div class="app-container">
    <div class="titleBar">机会列表</div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="日期" width="180"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="address" label="地址"> </el-table-column>
      <el-table-column label="QA">
        <template slot-scope="scope">
          <span v-if="scope.row.qnumber != ''">
            {{ scope.row.qnumber }}
          </span>
          <span v-else><i class="el-icon-loading"></i> </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      qaList: [
        {id:1, qaNumber: 123 },
        {id:2, qaNumber: 223 },
        {id:3, qaNumber: 323 },
        {id:4, qaNumber: 423 },
      ],
    };
  },
  mounted() {
    setTimeout(() => {
      this.init();
    }, 1200);
  },
  methods: {
    init() {
      // 假装我是Axios
      this.tableData.push(
        {
          date: "2016-05-02",
          name: "王小虎1",
          address: "上海市普陀区金沙江路 1518 弄",
          qnumber: "",
          id:1
        },
        {
          date: "2016-05-04",
          name: "王小虎2",
          address: "上海市普陀区金沙江路 1517 弄",
          qnumber: "",
          id:2
        },
        {
          date: "2016-05-01",
          name: "王小虎3",
          address: "上海市普陀区金沙江路 1519 弄",
          qnumber: "",
          id:3
        },
        {
          date: "2016-05-03",
          name: "王小虎4",
          address: "上海市普陀区金沙江路 1516 弄",
          qnumber: "",
          id:4
        }
      );
      // 假装请求成功后
      setTimeout(() => {
        this.tableData.map((item, i) => {
          this.qaList.map((jtem, j) => {
            if(item.id==jtem.id){
              item.qnumber = jtem.qaNumber;
            }
          });
        });
      }, 1300);
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
