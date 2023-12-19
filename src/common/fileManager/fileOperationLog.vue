<template>
  <div>
    <el-timeline>
      <el-timeline-item v-for="(item, index) in timelineData" :key="index">
        <div class="timeline-item-content">
          <div class="timestamp">{{ item.createTime }}</div>
          <div class="status-and-content">
            <div class="status">{{ item.createBy }}</div>
            <div class="content">{{ item.logContent }}</div>
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import filesApi from '@/api/Files/files'
export default {
  name: "operationLog",
  props: {
    goodsId: {
      type: String,
    }
  },
  watch: {
    goodsId: {
      handler(newVal, oldVal) {
        if(newVal){
          filesApi.getFilesLog({goodsId: newVal}).then(res=>{
            this.timelineData = res.data;
          })
        }
      },
      immediate: true,
      deep: true,
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
