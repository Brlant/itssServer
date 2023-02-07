<template>
  <div>
    <div class="set-title">
      <i class="el-icon-arrow-left"></i>
      <span>盘点设置</span>
    </div>
    <div
      style='margin:10px 0'
    >
      <span> 
        盘点审批流程 
      </span>
      <span>
         | 
      </span>
      <span> 
        盘点中设置 
      </span>
    </div>
    <div class='process'>
        <count-asset></count-asset>
    </div>
  </div>
</template>
<script>
import countAsset from './countAsset'
export default {
    components:{
        countAsset
    },
    data() {
        return {
            
        }
    }
}
</script>

<style lang="scss" scoped>
.set-title {
  background: #ffffff;
  font-size: 18px;
  height: 40px;
  line-height: 40px;
}
.process {
    background: #fff;
    padding: 10px;
  }
 .left {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .bar {
        width: 4px;
        height: 15px;
        background: #333;
        margin-right: 8px;
      }
      b {
        font-size: 15px;
      }
    }
</style>