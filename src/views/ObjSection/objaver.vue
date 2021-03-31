<template>
  <div v-if="is_show()">
     <empty></empty>
  </div>
  <div v-else>
    <el-card>
      <div id="aver"></div>
    </el-card>
  </div>
</template>

<script>
  import bus from '../bus.js'
  import empty from '../empty.vue'
	export default{
		name:'objaver',
    data(){
      return {
      	Source:[],
      	Series:[]
      }
    },
    components:{
      empty
    },
    methods:{
      is_show(){
        if (this.Series.length ===0){
          return true
        }else{
          return false
        }
      },
      get_Average(Average){
        let first = ['teachers']
        let teachers = first.concat(Average[1])
        this.Source.push(teachers)
        for(let key in Average[0]){
          let temp = []
          temp.push(key)
          for(let item in Average[0][key]){
            let sum = 0
            for(var i=0;i<Average[0][key][item].length;i++){
              sum+=Average[0][key][item][i]
            }
            temp.push((sum/Average[0][key][item].length))
          }
          this.Source.push(temp)
        }
        var obj_len = Object.keys(Average[0]).length;
        for(let i=0;i<obj_len;i++){
          this.Series.push({
            type: 'line', smooth: true, seriesLayoutBy: 'row',
            emphasis: {focus: 'series'},
          })
        }
        this.Series.push({
            type: 'pie',
            id: 'pie',
            radius: '30%',
            center: ['50%', '25%'],
            emphasis: {focus: 'data'},
            label: {
                formatter: '{b}: {@+'+teachers[1]+'} ({d}%)'
            },
            encode: {
                itemName: 'teachers',
                value: teachers[1],
                tooltip: teachers[1]
            }
        })
      },
      
      show_chart(){
        var myChart = this.$echarts.init(document.getElementById('aver'),'dark')
        	  // myChart.showLoading();
            myChart.setOption({
        		title: {
        		    text: '一级指标下的均值及占比',
                subtext: '数据来源：'+JSON.parse(sessionStorage.getItem('file')),
                padding: 15
        		},
                legend: {
        			padding: 15
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
                tooltip: {
                    trigger: 'axis',
                    showContent: false
                },
                dataset: {
                    source: []
                },
                xAxis: {type: 'category'},
                yAxis: {gridIndex: 0},
                grid: {top: '55%'},
                series: []
            });
        
            myChart.on('updateAxisPointer', function (event) {
                var xAxisInfo = event.axesInfo[0];
                if (xAxisInfo) {
                    var dimension = xAxisInfo.value + 1;
                    myChart.setOption({
                        series: {
                            id: 'pie',
                            label: {
                                formatter: '{b}: {@[' + dimension + ']} ({d}%)'
                            },
                            encode: {
                                value: dimension,
                                tooltip: dimension
                            }
                        }
                    });
                }
            });
            myChart.setOption({
            	dataset: {
            	    source: this.Source,
            	},
            	series: this.Series
            });
      }
    },
    created() {
      let Average = JSON.parse(sessionStorage.getItem('average'))
      if (Average){
        this.get_Average(Average)
      }
      else{
        bus.$on('average',Average2 =>{
          this.get_Average(Average2)
        })
      }
    },
    mounted() {
      if (!this.is_show()){
        this.show_chart()
      }
    }
	}
</script>

<style lang="scss" scoped>
  #aver{
    width: 100%;
    height: 500px;
  }
</style>
