<template>
  <div class="">
    <div class="title">
      <div :class="[{ active: n == 0 }]" @click="tabActive(0)">维修记录</div>
      <div :class="[{ active: n == 1 }]" @click="tabActive(1)">报损记录</div>
      <div :class="[{ active: n == 2 }]" @click="tabActive(2)">盘亏记录</div>
    </div>
    <div>
        <repair-record v-if='n==0'></repair-record>
        <scrap-record v-if='n==1'></scrap-record>
        <frmLoss-record v-if='n==2'></frmLoss-record>
    </div>
  </div>
</template>
<script>
import repairRecord from "./repairRecord";
import scrapRecord from "./scrapRecord";
import frmLossRecord from "./frmLossRecord";
export default {
  components: {
    repairRecord,
    scrapRecord,
    frmLossRecord
  },
  data() {
    return {
      n: 0,
    };
  },
  methods: {
    tabActive(index) {
      console.log(111);
      this.n = index;
    },
  },
};
</script>
<style lang="scss" scoped>
.title {
  display: flex;
  justify-content: space-around;
  width: 100%;
  background: #ffffff;
  height:50px;
  line-height: 50px;
  font-size: 20px;
  margin-bottom:10px;
  div {
    width: 33.3%;
    text-align: center;
    cursor: pointer;
  }
  .active {
    color: #1c6cf7;
  }
}
</style>
