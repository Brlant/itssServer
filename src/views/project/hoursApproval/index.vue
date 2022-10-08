<template>
    <div class='approval'>
        <div class='header'>
            <span @click="check(0)" :class='{curren:n==0}'>精简模式</span>
            <span>|</span>
            <span @click='check(1)' :class='{curren:n==1}'>详情模式</span>           
        </div>
        <div>
          <!-- 精简模式 -->
          <compact-mode @parentSearch='search' v-if="n==0" :childData='parentData'></compact-mode>
          <!-- 详情模式 -->
        </div>
    </div>
</template>
<script>
import compactMode from './compactMode'
import moment from "moment";
import "moment/locale/zh-cn";
import { approvalItems } from '@/api/workproject/approval.js'
export default {
  components:{
    compactMode
  },
   data() {
      return {
       n:0,
       parentData:{}

      };
    },
    created(){
       let query={time:moment().format('YYYY-MM-DD'),name:''}
     
       this.searchTest(query)
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      check(index){
        if(index == 0){
            this.n=0
        }else{
          this.n=1
        }
      },
      searchTest({time,name}){
        let data={
          projectName:name,
          workDate:time
        }
         approvalItems(data).then(res=>{
          this.parentData=res.data

        })
      },
      search(val){
        console.log(val)
        this.searchTest(val)
       
      }
    }
   
}
</script>
<style lang='scss' scope>
.approval{
  .header{
    margin-bottom:20px;
    span{
        margin-right:10px;
      }
    .curren{
      color:#547cb8;
    }

}

}


</style>
