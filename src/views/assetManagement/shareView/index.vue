<template>
  <div :style="'height:' + height">
    <iframe
      v-if="url"
      :src="url"
      frameborder="no"
      style="width: 100%; height: 100%"
      scrolling="auto"
    />
  </div>
</template>

<script>
import iFrame from "@/components/iFrame/index";

export default {
  name: "index",
  components: {iFrame},
  data() {
    return {
      height: document.documentElement.clientHeight - 105 + "px;",
      url: ''
    };
  },
  created() {
    const userId = this.$store.state.user.user.userId
    this.url = process.env.BASE_URL + 'jmreport/shareView/799142645696233472?userId=' + userId
  },
  mounted() {
    window.addEventListener('resize', this.setHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setHeight);
  },
  methods: {
    setHeight() {

      this.height = document.documentElement.clientHeight - 105 + "px;";
    }
  }
}
</script>

<style scoped lang="scss">

</style>
