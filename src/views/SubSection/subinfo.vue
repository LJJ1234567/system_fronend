<template>
  <div v-if="is_show()">
    <empty></empty>
  </div>
	<div v-else>信息抽取</div>
</template>

<script>
  import bus from '../bus.js'
  import empty from '../empty.vue'
	export default{
		name:'subinfo',
    data(){
      return {

      }
    },

	}
</script>

<style> 
</style>
