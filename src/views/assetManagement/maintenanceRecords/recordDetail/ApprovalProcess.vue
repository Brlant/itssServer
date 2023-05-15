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

    <!--  预览附件弹框  -->
    <el-dialog
      :visible.sync="attachmentDialog"
      class="attachment"
      fullscreen
    >
      <div>
        <iframe :src="attachmentUrl" frameborder="0" width="100%" height="100%"></iframe>
      </div>
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
      current: -1,
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
      },
      list: [],

      attachmentDialog: false, // 预览附件
      attachmentUrl: '', // 附件地址
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
          flowProcDefRes,
          flowProgressResList,
          taskAttachments
        } = res.data

        this.list = JSON.parse(flowProcDefRes.json).list

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
    getAttribute() {
      const { id } = this.flowExamineList.find(item => item.status == 1)
      const { attribute } = this.list.find(item => item.id == id)
      return attribute
    },
    // 下载
    downFlowLoad(url) {
      if (url) {
        let lowerCase = url.toLowerCase()
        if (lowerCase.includes('.jpg') || lowerCase.includes('.png') || lowerCase.includes('.pdf')) {
          // this.attachmentUrl = url;
          // this.attachmentUrl = this.convertUrl(url)
          const substringUrl = url.substring(url.indexOf('/itss') + 1, url.length)
          this.attachmentUrl = process.env.BASE_URL + substringUrl
          this.attachmentDialog = true;
        } else {
          downFile(url)
        }
      }
    },

    convertUrl(path){
      let reg = /^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i
      path = path.replace(reg, "https://$2$3$4$5$6");
      return path
    },
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
.current {
  color: #073dff;
}
.link {
  cursor: pointer;
  color: #073dff;
  text-decoration: underline;
  margin-right: 5px;
}

::v-deep .attachment {
  .el-dialog.is-fullscreen {
    .el-dialog__header {
      padding-bottom: 0;

      .el-dialog__headerbtn {
        top: 12px;
      }
    }

    .el-dialog__body {
      div {
        height: calc(100vh - 120px);
      }
    }
  }
}
</style>
