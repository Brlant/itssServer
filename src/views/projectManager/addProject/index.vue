<template>
  <div class="app-container">
    
  </div>
</template>
<script>
export default {
  data() {
    return {
       
    }
  },
   
  methods: {
    
  },

  beforeCreate() {
    document.querySelector("body,html").setAttribute("style", "background-color:#E8E8F4;")
  },

  beforeDestroy() {
    document.querySelector("body,html").removeAttribute("style")
  },
}
</script>
<style scoped>
.app-container{
  padding: 0;
}
 
</style>
