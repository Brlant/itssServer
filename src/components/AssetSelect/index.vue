<template>
  <div class="asset_select">
    <el-popover width="350" placement="bottom-start">
      <div slot="reference">
        <div class="empty">
          <i class="el-icon-circle-plus"></i>
          添加技能标签
        </div>
      </div>
    </el-popover>
  </div>
</template>

<style lang="scss" scoped>
.empty {
  display: flex;
  align-items: center;
  color: rgb(91,142,255);
  cursor: pointer;
  .el-icon-circle-plus {
    margin-right: 5px;
  }
}
</style>
