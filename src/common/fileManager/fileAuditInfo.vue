<template>
  <div>
    <el-timeline>
      <el-timeline-item v-for="(item, index) in timelineData" :key="index"   :color="item.color">
        <div class="timeline-item-content">
          <div class="timeline-item-header">
            <div class="status">{{ item.modelNode }}</div>
            <div class="timestamp" v-show="item.updateTime">{{ item.updateTime }}</div>
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
            <!--            <div class="content-right" v-show="item.nodeStatus == 2">-->
            <!--              不通过原因：{{ item.remark }}-->
            <!--            </div>-->
          </div>

        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import filesApi from '@/api/Files/files'
export default {
  name: "fileAuditInfo",
  props: {
    goodsId: {
      type: String,
    }
  },
  watch: {
    goodsId: {
      handler(newVal, oldVal) {
        if(newVal){
          filesApi.checkFiles({goodsId: newVal}).then(res=>{
            this.timelineData = res.data.map(item => {
              return {
                updateTime: item.updateTime || item.createTime,
                modelNode: item.modelNode,
                nodeStatus: item.nodeStatus,
                nodeContent: item.nodeContent,
                color: item.nodeStatus === 0? "#E4E7ED" : "green",
                // color: !item.updateTime || new Date(item.updateTime).getTime() > new Date().getTime() ? "#E4E7ED" : "green",
                reviewedName: item.reviewedName,
                remark: item.remark,
              }
            })
          })
        }
      },
      immediate: true,
      deep: true,
    }
  },
  data(){
    return{
      timelineData: [
        {
          timestamp: '2023-01-01',
          status: '审核通过',
          content: '内容1',
          color:"green",
        },
        {
          timestamp: '2023-02-01',
          status: '审核中',
          content: '内容2',
          color:"green",
        },
        {
          timestamp: '2023-03-01',
          status: '审核不通过',
          content: '内容3',
          color:"#E4E7ED",
        }
      ]
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
