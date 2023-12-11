<template>
  <div>
    <el-timeline>
      <el-timeline-item v-for="(item, index) in timelineData" :key="index">
        <div class="timeline-item-content">
          <div class="timestamp">{{ item.timestamp }}</div>
          <div class="status-and-content">
            <div class="status">{{ item.status }}</div>
            <div class="content">{{ item.content }}</div>
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  name: "entryOperationLog",
  props: {
    tabName: {
      type: String,
      default: '',
    }
  },
  watch: {
    tabName: {
      handler(newVal, oldVal) {
        console.log('操作日志', newVal);
      },
      immediate: true,
      deep: true,
    }
  },
  data() {
    return {
      timelineData: [
        {
          timestamp: '2023-01-01',
          status: '审核通过',
          content: '内容1'
        },
        {
          timestamp: '2023-02-01',
          status: '审核中',
          content: '内容2'
        },
        {
          timestamp: '2023-03-01',
          status: '审核不通过',
          content: '内容3'
        }
      ]
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

.timestamp {
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
