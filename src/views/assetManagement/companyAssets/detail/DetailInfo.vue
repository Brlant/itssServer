<template>
  <div class="info">
    <el-row>
      <!-- 动态渲染展示条目 -->
      <el-col
        v-for="(item, index) in list"
        :key="index"
        :span="span"
      >
        <div class="item">
          <span class="label">
            {{ item.label }}：
          </span>
          <span class="value">
            {{ info[item.name] }}
          </span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: [
    'info',
    'list'
  ],
  data() {
    return {
      span: 6
    }
  }
}
</script>

<style lang="scss" scoped>
.info {
  font-size: 14px;
  .item {
    padding: 10px;
    .star {
      color: #F52551;
    }
    .label {
      color: #8294AD;
    }
  }
}
</style>
