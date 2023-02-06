<template>
  <div class="detail">
    <!-- 头部 -->
    <div class="heading">
      <div class="left">
        <i class="el-icon-arrow-left"></i>
        <div class="wrap">
          <div class="item">
            <span class="name">盘点任务编号：</span>
            <span class="value">
              111
            </span>
          </div>
          <div class="item">
            <span class="name">创建时间：</span>
            <span class="value">
              111
            </span>
          </div>
          <div class="item">
            <span class="name">创建人：</span>
            <span class="value">
              111
            </span>
          </div>
          <div class="item">
            <span class="name">备注：</span>
            <span class="value">
              111
            </span>
          </div>
        </div>
      </div>
      <el-button type="text">
        查看盘点范围
      </el-button>
    </div>
    <!-- tab部分 -->
    <div class="tab-box">
      <my-tabs 
        v-model="tab"
        :options="tabOptions"
        @change="change"
      />
    </div>
    <!-- 表格部分 -->
    <div class="main">
      
    </div>
  </div>
</template>

<script>
import MyTabs from '@/components/MyTabs'

export default {
  components: {
    MyTabs
  },
  data() {
    return {
      tabOptions: [
        { label: '保管人确认', value: 0 }
      ],
      tab: 0
    }
  },
  methods: {
    change() {

    }
  }
}
</script>

<style lang="scss" scoped>
.detail {
  .heading {
    background: #fff;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      align-items: center;
      i {
        cursor: pointer;
        margin-right: 8px;
      }
      .wrap {
        display: flex;
        .item {
          font-size: 14px;
          margin-right: 50px;
          .name {
            color: #8294ad;
          }
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
  .tab-box {
    padding: 10px 15px;
  }
}
</style>