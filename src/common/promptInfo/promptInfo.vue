<template>
  <el-dialog width="20%" :visible="promptInfoForm" @close="handleClosePrompt">
    <div class="promptMsg">
      你有{{expirationReminder}}条即将到期的合同请及时处理
    </div>
    <div class="Btn">
      <el-button type="primary" @click="goCheck">
        去查看
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'promptInfo',
  props: {
    promptInfoForm: {
      type: Boolean,
    },
    expirationReminder:{
      type:Number,
    }
  },
  data() {
    return {}
  },
  created() {

  },
  methods: {
    /* 关闭消息弹框 */
    handleClosePrompt() {
      this.$emit('handleClosePrompt')
    },
    /* 去查看 */
    goCheck(){
      this.$router.push({
        path:"/contractManagement/contractExpiration"
      })
    }
  },
  mounted() {

  }
}
</script>

<style scoped>
.promptMsg {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}
.Btn{
  margin-top: 80px;
  text-align: center;
}
</style>
