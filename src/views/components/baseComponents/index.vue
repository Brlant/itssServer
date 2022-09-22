<template>
  <div>
    <h3>{{msg}}</h3>
  </div>
</template>
<script>
export default {
  data() {
    return {
        msg:"我是公共组件，后面我会逐渐丰满，添加更多的基础支持"
    }
  },
  mounted() {
    
  },
  methods: {
    
  },
  watch: {
    test: {
      handler(oldVal,newVal) {
        
      },
      deep:true
    }
  },
}
</script>
<style scoped>

</style>