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
import supplierApi from '@/api/supplier/supplier'

export default {
  name: "supplierOperationLog",
  props: {
    supplierId: {
      type: String,
      default: '',
    }
  },
  watch: {
    supplierId: {
      handler(newVal, oldVal) {
        if (newVal) {
          supplierApi.queryOperatorById(newVal).then(res => {
            console.log('操作日志', res);
            this.timelineData = res.data;
          })
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      timelineData: [
        {
          createTime: '2023-01-01',
          logContent: '内容1'
        },
        {
          createTime: '2023-02-01',
          logContent: '内容2'
        },
        {
          createTime: '2023-03-01',
          logContent: '内容3'
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
