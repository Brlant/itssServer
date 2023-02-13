<template>
  <div>
    <div class="set-title">
      <i class="el-icon-arrow-left" @click="goBack"></i>
      <span>盘点设置</span>
    </div>
<!--    <div
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

    </div>-->
    <div class="select">
          <span v-for="(data,index) in setList"
                :key='index'
                @click="checkSelect(data,index)">
              <span class="cursor" :class="[{ current: n === index }]">
                {{ data.name }}
              </span>
              <span v-if='index<setList.length-1'>|</span>
          </span>
    </div>
    <div class='process'>
      <count-asset v-if="!isEditCountAsset" @change="changeCountAsset"></count-asset>
      <edit-count-asset v-if="isEditCountAsset" @change="changeCountAsset"></edit-count-asset>
    </div>
  </div>
</template>
<script>
import countAsset from './countAsset'
import editCountAsset from './editCountAsset'

export default {
    components:{
      countAsset,
      editCountAsset
    },
    data() {
        return {
          n: 0,
          setList: [
            {name: '盘点审批流程'},
            // {name: '盘点中设置'}
          ],
          isEditCountAsset: false
        }
    },
  methods:{
    // 返回
    goBack() {
      this.$router.go(-1);
    },

    checkSelect(data,index){
      this.n = index
    },

    changeCountAsset(val){
      this.isEditCountAsset = val
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
.select {
  margin: 10px 0;
  .cursor {
    display: inline-block;
    padding: 0 5px;
    cursor: pointer;
  }
  .current {
    color: #5f94ff;
  }
}
</style>
