<template>
  <div>
    <el-timeline>
      <el-timeline-item v-for="(item, index) in timelineData" :key="index"   :color="item.nodeStatus === 0?'gray':'green'" >
        <div class="timeline-item-content">
          <div class="timeline-item-header">
            <div class="status">{{ item.modelNode }}</div>
            <div class="timestamp">{{ item.updateTime }}</div>
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
            <div class="content-right">
              {{item.remark}}
            </div>
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { getExamineInfo} from '@/api/auditCenter/initiated/initiated'

export default {
  name: "auditInfo",
  props: ['detailsRow'],
  watch: {
    detailsRow: {
      handler(newVal, oldVal) {
        if (newVal.relationId && newVal.modelType){
          let params = {
            id: newVal.relationId,
            type: newVal.modelType
          }
          getExamineInfo(params).then(res => {
            this.timelineData = res.data
          })
        }
      },
      immediate: true,
      deep: true,
    }
  },
  data(){
    return{
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
