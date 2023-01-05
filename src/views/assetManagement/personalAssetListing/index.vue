<template>
  <div class="personal">
    <!-- 头部 -->
    <div class="heading">
      <div class="tabs">
        <div
          v-for="(item, index) in tabs"
          :key="index"
          :class="{active: index === n}"
        >
          <span class="dot"></span>
          <span class="name" @click="change(index)">
            {{ item }}
          </span>
          <span class="dot"></span>
        </div>
      </div>
      <div class="btns">
        <el-button type="primary">批量归还</el-button>
        <el-button type="primary">资产申领</el-button>
        <el-button type="primary">资产借用</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabs: ['个人资产', '已领耗材', '我的申请'],
      n: 0
    }
  },
  methods: {
    // tab切换
    change(index) {
      if (this.n === index) {
        return
      }
      this.n = index
    }
  }
}
</script>

<style lang="scss" scoped>
.personal {
  .heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .tabs {
      display: flex;
      >div {
        display: flex;
        align-items: center;
        margin-right: 8px;
        .name {
          cursor: pointer;
          margin: 0 6px;
        }
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
      }
      .active {
        .name {
          color: #3d70ff;
        }
        .dot {
          background: #3d70ff;
        }
      }
    }
  }
}
</style>