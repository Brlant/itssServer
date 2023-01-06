<template>
  <div class="my-tabs">
    <div class="tabs">
      <div
        v-for="(item, index) in options"
        :key="index"
        :class="{active: index === value}"
      >
        <span class="dot"></span>
        <span class="name" @click="change(index)">
          {{ item.label  }}
        </span>
        <span class="dot"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'options',
    'value'
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
.my-tabs {
  .tabs {
    display: flex;
    >div {
      display: flex;
      align-items: center;
      margin-right: 8px;
      .name {
        cursor: pointer;
        color: #8294AD;
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
</style>
