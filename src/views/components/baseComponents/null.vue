<template>
  <div class="app-container">
   
  </div>
</template>
<script>
 

export default {
  name:"Nulla",
  data() {
    return {
     }
  },
  mounted() {
  },
  methods: {
   
  },

  beforeCreate() {
    document
      .querySelector("body,html")
      .setAttribute("style", "background-color:#E8E8F4;");
  },

  beforeDestroy() {
    document.querySelector("body,html").removeAttribute("style");
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  padding: 0;
}
 
.priority4 {
  color: #909399;
}
.priority3 {
  color: #409eff;
}
.priority2 {
  color: #e6a23c;
}
.priority1 {
  color: #f56c6c;
}
</style>
 
