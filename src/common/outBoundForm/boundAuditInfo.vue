<template>
  <div>
    <el-timeline>
      <el-timeline-item v-for="(item, index) in timelineData" :key="index" :color="item.color">
        <div class="timeline-item-content">
          <div class="timeline-item-header">
            <div class="status">{{ item.modelNode }}</div>
            <div class="timestamp" v-show="item.time">{{ item.time }}</div>
          </div>
          <div style="display: flex">
            <div class="content">
              <div>
                {{ item.reviewedName }}
              </div>
              <div>
                {{ item.nodeContent }}
              </div>
            </div>
            <div class="content-right" v-show="item.remark">
              不通过原因：{{ item.remark }}
            </div>
          </div>

        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import {queryOrderAuditLog} from '@/api/pms/order'

export default {
  name: "supplierAuditInfo",
  props: {
    orderId: {
      type: String,
      default: '',
    }
  },
  watch: {
    orderId: {
      handler(newVal) {
        if (newVal) {
          queryOrderAuditLog(newVal,1).then(res => {
            this.timelineData = res.data.map(item => {
              return {
                time: item.updateTime || item.createTime,
                modelNode: item.modelNode,
                nodeStatus: item.nodeStatus,
                nodeContent: item.nodeContent,
                color: item.nodeStatus === 0? "#E4E7ED" : "green",
                reviewedName: item.reviewedName,
                remark: item.remark,
              }
            })
          })
        }
      },
      immediate: true,
    }
  },
  data() {
    return {
      timelineData: []
    }
  },
  created() {

  }
}
</script>

<style scoped>
@import "~element-ui/lib/theme-chalk/index.css";

.timestamp {
  padding: 4px 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.timeline-dot.green {
  color: green !important;
}

.status {
  margin-right: 8px;
  font-weight: bold;
}

.timeline-item-content {

}

.timeline-item-header {
  display: flex;
  align-items: center;
  margin-right: 20px; /* 调整左右间距 */
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  width: 250px;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #797979;
  border-radius: 5px;
}
.content-right{
  margin-top: 16px;
  font-size: 12px;
  width: auto;
  box-sizing: border-box;
  padding: 10px;
}
</style>
