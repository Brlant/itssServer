<template>
  <div class="tab-box">
    <div
      class="tab-item"
      v-for="(item, index) in options"
      :key="index"
    >
      <span 
        :class="{active: index === value}"
        @click="change(index)"
      >
        {{ item }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'value',
    'options'
  ],
  methods: {
    change(index) {
      if (index === this.value) {
        return
      }
      this.$emit('input', index)
      this.$emit('change')
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-box {
  padding: 15px 0;
  display: flex;
  align-items: center;
  .tab-item {
    padding: 0 15px;
    border-right: 1px solid #8294AD;
    line-height: 1;
    &:last-child {
      border-right: 0;
    }
    span {
      color: #8294AD;
      cursor: pointer;
    }
    .active {
      color: #307dff;
    }
  }
}
</style>