<template>
    <div v-if="is_show()">
     <empty></empty>
    </div>
    <div v-else>
      <el-card>
        <div id="disper"></div>
      </el-card>
    </div>
</template>

<script>
  import bus from '../bus.js'
  import empty from '../empty.vue'
	export default{
		name:'objdisper',
    data(){
      return{
        legend_data:[],
        xAxis_data:[],
        Series:[],
      }
    },
    components:{
      empty
    },
    created() {
      let Change = JSON.parse(sessionStorage.getItem('change'))
      if(Change){
        this.legend_data = Object.keys(Change[0])
        this.xAxis_data = Change[1]
        function series (obj_data){
          let all_series = []
          for(let key in obj_data){
            all_series.push({
              name:key,
              type:'line',
              stack:'总量',
              data:obj_data[key]
            })
          }
          return all_series
        }
        this.Series=series(Change[0])
      }
      else{
        bus.$on('change',Change=>{
          console.log('监听on')
          this.legend_data = Object.keys(Change[0])
          this.xAxis_data = Change[1]
          function series (obj_data){
            let all_series = []
            for(let key in obj_data){
              all_series.push({
                name:key,
                type:'line',
                stack:'总量',
                data:obj_data[key]
              })
            }
            return all_series
          }
          this.Series=series(Change[0])
        })
      }
    },
    methods:{
      is_show(){
        if (this.Series.length ===0){
          return true
        }else{
          return false
        }
      },
      show_disper(){
        let mychart = this.$echarts.init(document.getElementById('disper'),'dark')
        mychart.setOption({
        	title: {
        	    text: '评价离散性分析',
              subtext: '数据来源：'+JSON.parse(sessionStorage.getItem('file')),
        			padding: 15
        	    },
        	    tooltip: {
        	        trigger: 'axis'
        	    },
        	    legend: {
        	        data: this.legend_data,
                  padding: 15
        	    },
        	    grid: {
        	        left: '3%',
        	        right: '4%',
        	        bottom: '3%',
        	        containLabel: true
        	    },
        		dataZoom: [
                {   // 这个dataZoom组件，默认控制x轴。
                    type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                    start: 0,      // 左边在 10% 的位置。
                    end: 50         // 右边在 60% 的位置。
                }
        		  ],
        	    toolbox: {
        	            show: true,
        	            feature: {
        	                dataZoom: {
        	                    yAxisIndex: 'none'
        	                },
        	                dataView: {readOnly: false},
        	                magicType: {type: ['line', 'bar']},
        	                restore: {},
        	                saveAsImage: {}
        	            }
        	        },
        	    xAxis: {
        	        type: 'category',
        	        boundaryGap: false,
        	        data: this.xAxis_data
        	    },
        	    yAxis: {
        	        type: 'value'
        	    },
        	    series: this.Series
          })
      }
    },
    mounted() {
      if (!this.is_show()){
        this.show_disper()
      }
    },

	}
</script>

<style lang="scss" scoped>
  #disper{
    width: 100%;
    height: 500px;
  }

</style>
