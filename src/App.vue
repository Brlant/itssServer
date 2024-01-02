<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'App',
  data() {
    return {
      reviewedId: '', //用户id
    }
  },
  created() {
    if (window.localStorage.getItem('user')) {
      let userInfo = window.localStorage.getItem('user')
      let userInfoParse = JSON.parse(userInfo)
      this.reviewedId = userInfoParse.userId
      this.getUserList();
    }
  },
  methods: {
    getUserList() {
      //更新下角标
      const params = {
        key: "",
        modelName: "",
        reviewedId: this.reviewedId,
        pageNum: 1,
        pageSize: 10,
        promoterId: "",
        queryType: 2
      }

      request.get('pms/examine/my-todo', {params}).then((res) => {
        this.$store.dispatch('updateItem', res.total);
      })
    }
  },
  metaInfo() {
    return {
      title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
      titleTemplate: title => {
        return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE
      }
    }
  }
}
</script>
<style scoped>
#app {
  background: #E8E8F4;
  width: 100%;
  height: 100%;
  /* margin-top: 10px; */
  padding: 0;
}

</style>
<style lang="scss">
// .el-form-item{
//   margin:10px!important;
// }
// .el-row{
//   padding:0px!important;
// }
</style>
