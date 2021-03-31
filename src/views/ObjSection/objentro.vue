<template>
  <div v-if="is_show()">
    <empty></empty>
  </div>
	<div v-else>
    <el-card>
      <div id ="info"></div>
    </el-card>
	</div>
</template>

<script>
	import bus from '../bus.js'
  import empty from '../empty.vue'
	export default{
		name:'objinfo',
		data(){
			return {
				legend_data:[],
				yAxis_data:[],
				Series:[]
			}
		},
    components:{
      empty
    },
    methods:{
      get_Entropy(Entropy){
        this.legend_data = Object.keys(Entropy[0])
        this.yAxis_data = Entropy[1]
        for(let key in Entropy[0]){
        	let all_sum = []
        	for(let item in Entropy[0][key])
        	{
        		let sum = 0
        		for(let i=0;i<item.length;i++){
        			sum+=Entropy[0][key][item][i]
        		}
        		all_sum.push(sum)
        	}
        	this.Series.push(
        	{
        		name: key,
        		type: 'bar',
        		stack: 'total',
        		label: {
        			show: true
        		},
        		emphasis: {
        			focus: 'series'
        		},
        		data: all_sum
        	})
        }
      },
      is_show(){
        if (this.Series.length ===0){
          return true
        }else{
          return false
        }
      },
      show_Entroy(){
        var info = this.$echarts.init(document.getElementById('info'),'dark');
        info.setOption({
        	title: {
        	    text: '一级指标信息熵',
              subtext: '数据来源：'+JSON.parse(sessionStorage.getItem('file')),
        			padding: 15
        	},
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // Use axis to trigger tooltip
                    type: 'shadow'        // 'shadow' as default; can also be 'line' or 'shadow'
                }
            },
            legend: {
                data: this.legend_data,
        		padding: 15
            },
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
        	  dataZoom: [
                {
                    id: 'dataZoomX',
                    type: 'slider',
                    xAxisIndex: [0],

                    filterMode: 'filter'
                },
                {
                    id: 'dataZoomY',
                    type: 'slider',
                    yAxisIndex: [0],

                    filterMode: 'empty'
                }
        	  ],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value'
            },
            yAxis: {
                type: 'category',
                data: this.yAxis_data
            },
            series: this.Series
          })
      }
    },
    created() {
      let Entropy = JSON.parse(sessionStorage.getItem('entropy'))
      if (Entropy){
        this.get_Entropy(Entropy)
      }
      else{
        bus.$on('entropy',Entropy=>{
          this.get_Entropy(Entropy)
        })
      }
    },
		mounted() {
			if (!this.is_show()){
			  this.show_Entroy()
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	#info{
		width: 100%;
		height: 500px;
	}
</style>
