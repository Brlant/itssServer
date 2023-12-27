<template>
  <div style="min-height: 350px">
    <el-timeline>
      <el-timeline-item v-for="(item, index) in timelineData"
        :key="index"
        :color="item.color">
        <div class="timeline-item-content">
          <div class="timeline-item-header">
            <div class="status">{{ item.modelNode }}</div>
            <div class="timestamp">{{ item.updateTime || item.createTime }}</div>
          </div>
          <div style="display: flex; min-height: 60px;">
            <div class="content">
              <div>
                {{ item.reviewedName }}
              </div>
              <div>
                {{ item.nodeContent }}
              </div>
            </div>
            <div v-if="item.remark" class="content-right">
              {{ `不通过原因: ${item.remark}`}}
            </div>
          </div>

        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { queryExamineById } from '@/api/contractFilesManagement/contractFilesManagement'

export default {
  name: "managerAuditInfo",
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
      val && this.queryAuditInfo(val);
    }
  },
  data(){
    return{
      timelineData: []
    }
  },
  mounted() {
    this.queryAuditInfo(this.contractId);
  },
  methods: {
    queryAuditInfo() {
      queryExamineById({ contractId: this.contractId }).then(res => {
        this.timelineData = res.data.map(row => {
          if(row.nodeStatus === 1) {
            row.color = 'green';
          }
          return row;
        });
      })
    }
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
