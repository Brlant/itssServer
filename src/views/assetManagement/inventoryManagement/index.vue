<template>
  <div class="inventory">
    <div class="heading">
      <span class="title">
        盘点任务列表
      </span>
      <div class="btns">
        <div class="item">
          <span>发起盘点</span>
        </div>
        <div class="item" @click='countSet'>
          <span>盘点设置</span>
        </div>
      </div>
    </div>
    <!-- 表格部分 -->
    <el-table
      :data="tableData"
      border
      @row-click="goDetail"
    >
      <el-table-column 
        align="center"
        label="盘点ID"
      />
      <el-table-column 
        align="center"
        label="创建人"
      />
      <el-table-column 
        align="center"
        label="创建时间"
      />
      <el-table-column 
        align="center"
        label="完成时间"
      />
      <el-table-column 
        align="center"
        label="涉及资产类型"
      />
      <el-table-column 
        align="center"
        label="涉及资产状态"
      />
      <el-table-column 
        align="center"
        label="备注"
      />
      <el-table-column 
        align="center"
        label="当前状态"
      />
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [{}]
    }
  },
  methods: {
    goDetail() {
      this.$router.push({
        path: '/assetManagement/inventoryManagement-auth/detail'
      })
    },
    countSet(){
      this.$router.push({
        path: '/assetManagement/inventoryManagement-auth/countingSettings'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.inventory {
  background: #fff;
  padding: 15px 10px;
  .heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    .title {
      font-size: 18px;
    }
    .btns {
      display: flex;
      align-items: center;
      .item {
        padding: 0 10px;
        border-right: 1px solid #037dff;
        line-height: 1;
        &:last-child {
          border-right: 0;
          padding-right: 0;
        }
        span {
          color: #037dff;
          cursor: pointer;
        }
      }
    }
  }
}
</style>