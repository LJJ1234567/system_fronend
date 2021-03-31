<template>

  <div>
    <el-image :src="src" lazy>
      <div slot="placeholder" class="image-slot">
        加载中<span class="dot">...</span>
      </div>
   </el-image>
  </div>
</template>

<script>
  export default{
    name:'empty',
    data(){
      return{
        src: require('@/assets/img/empty7.png')
      }
    }
  }
</script>

<style scoped="scoped">
  
</style>
