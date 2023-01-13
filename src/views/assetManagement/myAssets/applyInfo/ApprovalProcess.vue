<template>
  <div class="approval">
    <div class="heading">
      <div class="left">
        <span class="bar"></span>
        <b>资产信息</b>
      </div>
      <div class="right">
        <el-button type="text">
          查看全部记录
        </el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
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
  }
</style>
