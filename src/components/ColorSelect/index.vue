<template>
  <div class="color_select">
    <div
      class="color_box"
      v-for="(item, index) in color"
      :key="index"
      :style="{background: item}"
      @click="change(index)"
    >
      <i :class="['el-icon-check', {current: index === n}]"></i>
    </div>
  </div>
</template>

<script>
import { color } from './options'

export default {
  props: ['value'],
  data() {
    return {
      color,
      n: -1
    }
  },
  watch: {
    value(val) {
      if (!val) {
        this.n = -1
      } else {
        this.n = color.findIndex(v => v === val)
      }
    }
  },
  methods: {
    change(index) {
      if (this.n === index) return
      this.n = index
      this.$emit('input', color[index])
    }
  }
}
</script>

<style lang="scss" scoped>
.color_select {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  .color_box {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    .el-icon-check {
      color: #fff;
      visibility: hidden;
    }
    .current {
      visibility: visible;
    }
  }
}
</style>