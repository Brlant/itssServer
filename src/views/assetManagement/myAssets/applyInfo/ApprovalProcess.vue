<template>
  <div class="approval">
    <div class="heading">
      <div class="left">
        <span class="bar"></span>
        <b>审批进度</b>
      </div>
      <div class="right">
        <el-button type="text" @click="dialogVisible = true">
          查看全部记录
        </el-button>
      </div>
    </div>
    <!-- 审批进度开始 -->
    <el-timeline>
      <el-timeline-item 
        v-for="(activity, index) in flowExamineList" 
        :key="index"
        placement="top"
        :timestamp="activity.createTime"
      >
        <div :style="{color: statusColor[activity.status]}">
          <p>
            {{ activity.taskName }}
            <span v-if="activity.userName">
              : {{ activity.userName }}
            </span>
            <span style="margin-left: 5px">
              {{ commentType[activity.type] }}
            </span>
          </p>
          <p v-if="activity.comment">
            备注 :
            {{ activity.comment }}
          </p>
          <p v-if="activity.flowUploads.length">
            附件 :
            <span 
              class="link"
              v-for="(item, index) in activity.flowUploads"
              :key="index"
              @click="downFlowLoad(item.url)"
            >
              {{ item.name }}
            </span>
          </p>
        </div>
      </el-timeline-item>
    </el-timeline>
    <!-- 审批进度结束 -->
    <!-- 全部记录弹窗 -->
    <el-dialog
      title="全部记录"
      :visible.sync="dialogVisible"
      center
    >
      <el-timeline reverse>
        <el-timeline-item
          v-for="(activity, index) in flowHistoryList"
          :key="index"
          :timestamp="activity.createTime"
        >
          <p>
            {{ activity.taskName }}
            <span v-if="activity.userName">
              : {{ activity.userName }}
            </span>
            <span style="margin-left: 5px">
              {{ commentType[activity.type] }}
            </span>
          </p>
          <p v-if="activity.comment">
            备注 :
            {{ activity.comment }}
          </p>
          <p v-if="activity.flowUploads.length">
            附件 :
            <span 
              class="link"
              v-for="(item, index) in activity.flowUploads"
              :key="index"
              @click="downFlowLoad(item.url)"
            >
              {{ item.name }}
            </span>
          </p>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { flowViewer } from '@/api/assetManagement/myAssets'
import downFile from '@/utils/downFile'

export default {
  data() {
    return {
      dialogVisible: false,
      flowExamineList: [],
      flowHistoryList: [],
      commentType: {
        1: "通过",
        2: "驳回",
        3: "退回",
        4: "委派",
        5: "转办",
        6: "终止",
        7: "抄送",
        8: "向前加签",
        9: "向后加签",
      },
      statusColor: {
        0: '#909399', // pending
        1: '#073dff', // going
        2: '#303133' // finished
      }
    }
  },
  created() {
    this.getFlow()
  },
  methods: {
    getFlow() {
      const params = {
        taskId: this.$route.query.taskId,
        processInstanceId: this.$route.query.processInstanceId,
        deployId: this.$route.query.deployId
      }
      flowViewer(params).then(res => {
        let { 
          flowCommentResGroupList,
          flowCommentResList,
          flowProgressResList,
          taskAttachments,
          variables
        } = res.data

        this.$emit('emitRevoke', variables.revoke)

        // a - 审批进度
        let groupListArr = []
        flowCommentResGroupList.forEach(item => {
          if (item.groupList.length) {
            groupListArr.push(item.groupList[0])
          } else {
            groupListArr.push(item)
          }
        })
        groupListArr.forEach(item => {
          let flowUploads = []
          taskAttachments.forEach(value => {
            if (value.taskId == item.taskId ) {
              flowUploads.push(value)
            }
          })
          item.flowUploads = flowUploads

          item.status = 0
          flowProgressResList.forEach(value => {
            if (item.id == value.id) {
              if (value.completed === false) {
                item.status = 1
              } else if (value.completed === true) {
                item.status = 2
              }
            }
          })
        })
        this.flowExamineList = groupListArr

        // b - 全部记录
        flowCommentResList.forEach(item => {
          let flowUploads = []
          taskAttachments.forEach(value => {
            if (value.taskId == item.taskId ) {
              flowUploads.push(value)
            }
          })
          item.flowUploads = flowUploads
        })
        this.flowHistoryList = flowCommentResList
      })
    },
    // 下载
    downFlowLoad(url) {
      downFile(url)
    }
  }
}
</script>

<style lang="scss" scoped>
.heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  .left {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .bar {
      width: 4px;
      height: 15px;
      background: #333;
      margin-right: 8px;
    }
    b {
      font-size: 15px;
    }
  }
}
.link {
  cursor: pointer;
  color: #073dff;
  text-decoration: underline;
  margin-right: 5px;
}
</style>
