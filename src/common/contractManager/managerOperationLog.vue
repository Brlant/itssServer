<template>
  <div style="min-height: 350px">
    <el-timeline>
      <el-timeline-item v-for="(item, index) in timelineData"
        :key="index">
        <div class="timeline-item-content">
          <div class="timestamp">{{ item.createTime }}</div>
          <div class="status-and-content">
            <div class="content">{{ item.logContent }}</div>
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { queryOperatorById } from '@/api/contractFilesManagement/contractFilesManagement'

export default {
  name: "managerOperationLog",
  props: {
    // tabName: {
    //   type:String,
    //   default:'',
    // },
    contractId: {
      type: String
    }
  },
  watch: {
    // tabName: {
    //   handler(newVal, oldVal) {
    //     console.log('档案信息',newVal);
    //   },
    //   immediate:true,
    //   deep: true,
    // },
    contractId(val) {
      val && this.queryOperationLog(val);
    }
  },
  data() {
    return {
      timelineData: []
    };
  },
  mounted() {
    this.queryOperationLog(this.contractId);
  },
  methods: {
    queryOperationLog() {
      queryOperatorById({ contractId: this.contractId }).then(res => {
        this.timelineData = res.data;
      })
    }
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
