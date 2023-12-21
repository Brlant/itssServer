<template>
  <div>
    <el-timeline>
      <el-timeline-item v-for="(item, index) in timelineData" :key="index">
        <div class="timeline-item-content">
          <div class="createTime">{{ item.createTime }}</div>
          <div class="status-and-content">
            <div class="content">{{ item.logContent }}</div>
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import {queryOrderLog} from '@/api/pms/order'

export default {
  name: "supplierOperationLog",
  props: {
    orderId: {
      type: String,
      default: '',
    }
  },
  watch: {
    orderId: {
      handler(newVal, oldVal) {
        if (newVal) {
          queryOrderLog(newVal).then(res => {
            this.timelineData = res.data;
          })
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      timelineData: []
    };
  },
  created() {

  }
}
</script>

<style scoped>
@import "~element-ui/lib/theme-chalk/index.css";

.timeline-item-content {
  display: flex;
  align-items: center;
}

.createTime {
  padding: 4px 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-right: 10px;
}

.status-and-content {
  display: flex;
  align-items: center;
}

.status {
  margin-right: 8px;
  font-weight: bold;
}

.content {
  margin-right: 8px;
}
</style>
