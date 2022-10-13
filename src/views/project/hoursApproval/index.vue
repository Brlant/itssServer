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
          <details-mode v-else :detailDatas='detailData' @datailParent='detailMode'></details-mode>
          <!-- 详情模式 -->
        </div>
    </div>
</template>
<script>
import compactMode from './compactMode'
import detailsMode from './detailsMode'
import moment from "moment";
import "moment/locale/zh-cn";
import { approvalItems,approvalMonth } from '@/api/workproject/approval.js'
export default {
  components:{
    compactMode,detailsMode
  },
   data() {
      return {
       n:0,
       parentData:{},
       query:{},
       queryDetail:{},
       detailData:[]

      };
    },
    created(){
       this.query={time:moment().format('YYYY-MM-DD'),name:''}
        this.queryDetail={startDate:moment().format('YYYY-MM-DD'),endDate:moment().format('YYYY-MM-DD'),status:0}    
       this.searchTest(this.query)
      
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      check(index){
        if(index == 0){
            this.n=0
          this.searchTest(this.query)
        }else{
          this.n=1
          this.detailMode(this.queryDetail)
        }
      },
      //精简模式
      searchTest({time,name}){
        let data={
          projectName:name,
          workDate:time
        }
         approvalItems(data).then(res=>{
          if(res.data){
              this.parentData=res.data
          }
          

        })
      },
      search(val){
        console.log(val)
        this.searchTest(val)
       
      },
    //详情模式
    detailMode(data){
      approvalMonth(data).then(res=>{
        if(res.code==200){
          if(res.data){
            this.detailData=res.data
          }
          
        }
      })
    }
    }
   
}
</script>
<style lang='scss' scope>
.approval{
  .header{
    margin-bottom:10px;
    padding:0 10px;
    span{
        margin-right:10px;
      }
    .curren{
      color:#3D7DFF;
    }

}

}


</style>
