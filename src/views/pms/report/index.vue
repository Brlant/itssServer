<template>
  <div class="report">
    <iframe :src="jumpUrl" importance="high" allowFullScreen="true"
            :style="{height: scrollerHeight,width:'100%'}"></iframe>
  </div>
</template>

<script>
import request   from '@/utils/request'
export default {
  name: 'PmsReport',
  data() {
    return {
      jumpUrl: '',
      key: '',
    }
  },
  computed: {
    scrollerHeight: function () {
      return (window.innerHeight - 60 - 56) + 'px';
    },
  },
  watch: {
    '$route': {
      handler(router) {
        // console.log(router)
        this.key = router.name
        if (this.key) {
          this.jumpUrl = ''
          request.get(`/pms/hengshi/getUrlByKey?key=${this.key}`).then(url => {
            this.jumpUrl = url
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.report {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}
</style>
