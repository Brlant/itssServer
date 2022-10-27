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
      tableData: []
    };
  },
  mounted() {
     setTimeout(() => {
            this.init()
        }, 1200)
  },
  methods: {
      init() {
            // 假装我是Axios
            this.tableData.push({
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄', 
                qnumber: ""
            }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄',
                    qnumber: ""
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄',
                    qnumber: ""
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄',
                    qnumber: ""
                })
           // 假装请求成功后
          setTimeout(()=>{
               this.tableData.map((item,i)=>{
               item.qnumber = "123"
           })
          },1300)     

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
