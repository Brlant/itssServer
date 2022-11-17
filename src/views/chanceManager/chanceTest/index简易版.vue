<template>
  <div class="app-container">
    <h1>{{this.tableData}}</h1>
    <hr>
     <h1>{{nextEdit}}</h1>
   
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
      nextEdit:false,
      tableData:"",
      searchForm:{},
      getChanceHandel:null,
      res1:null,
      res2:null,
    };
  },
  
  mounted() {
    
    this.getData()
  },
  methods: {
    getData(){
      console.log("run");
      this.init()
    },
   async init() {
        // const chain = Promise.resolve()
        // chain.then(handelA).then(handelB)
      let res1 = await getChanceList(this.searchForm) // A 方法
      let res2 = await queryDict("post_type")         // B 方法
      console.log(res1.data[0].chanceName);
      console.log(res2.data[0].dictLabel);
    },
        
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
