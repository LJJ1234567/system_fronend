<template>
  <div v-if="is_show()">
    <empty></empty>
  </div>
  <div v-else class="row">
  	<el-card class="box-card" v-for="(item,index) in list" :key ="index">
  	  <div class="leida"></div>
  	</el-card>
  </div>
</template>

<script>
  import bus from '../bus.js'
  import empty from '../empty.vue'
	export default{
		name:'objleida',
    data(){
      return{
        list:[
        			// [
        			// 	{name:'教学',value:[0.9,0.6,0.8,0.7,0.7,0.5,0.9,0.6,0.8,0.7]},
        			// 	{name:'师德',value:[0.8,0.9,0.7,0.6,0.7,0.5,0.8,0.9,0.7,0.6,]},
        			// 	{name:'0.6标准',value:[0.6,0.6,0.6,0.6,0.6,0.6,0.6,0.6,0.6,0.6]},
        			// ],
        			// [
        			// 	{name:'教学',value:[0.5,0.6,0.7,0.8,0.9,0.9,0.9,0.4,0.5,0.6]},
        			// 	{name:'师德',value:[0.5,0.6,0.8,0.6,0.9,0.7,0.8,0.8,0.7,0.9]},
        			// 	{name:'0.6标准',value:[0.6,0.6,0.6,0.6,0.6,0.6,0.6,0.6,0.6,0.6]},
        			// ],
        		],
          Teachers:[],
        	legend_data:['0.6标准'],
        	// legend_data:['0.6标准','教学','师德'],
        	indicator_data:[
        					// {text: "指标1/指标11/",max: 1},
        					// {text: "指标2/指标11/",max: 1},
        					// {text: "指标3/指标11/",max: 1},
        					// {text: "指标4/指标11/",max: 1},
        					// {text: "指标5/指标11/",max: 1},
        					// {text: "指标6/指标11/",max: 1},
        					// {text: "指标7/指标11/",max: 1},
        					// {text: "指标8/指标11/",max: 1},
        					// {text: "指标9/指标11/",max: 1},
        					// {text: "指标10/指标20/",max: 1},
        	]
        }
    },
    components:{
      empty
    },
    methods:{
      get_Leida(Info){
        // 获取教师名
        this.Teachers = Info[1]
        let all=[]
        let indics = []
        for(let key in Info[0]){
        	let temp = []
        	this.legend_data.push(key)
        	let JsonInfo = JSON.parse(Info[0][key])
        	// console.log(JsonInfo)
        	for(let i in JsonInfo){
        		let item = {}
        		// ind.push(Object.keys(JsonInfo[i]))
        		item['value'] = Object.values(JsonInfo[i])
        		item['name'] = key
        		temp.push(item)
        	}
        	all.push(temp)
        	indics.push(Object.keys(JsonInfo[0]))
        }

        function indicator(data){
        	let temp = []
        	let led = []
        	for(let i=0;i<data.length;i++){
        		temp.push(data[i].length)
        	}
        	let max_len = Math.max.apply(null,temp)
        	// console.log(max_len)
        	for(let i=0;i<max_len;i++){
        		let item = {}
        		let str_name = ''
        		for(let j=0;j<data.length;j++){
        			str_name+=data[j][i]+'/'
        			// console.log(str_name)
        		}
        		item['text'] = str_name
        		item['max'] = 1
        		led.push(item)
        	}
        	return led
        }

        this.indicator_data = indicator(indics)
        let stand = []
        for(let k=0;k<this.indicator_data.length;k++){
        	stand.push(0.6)
        }

        function chart_data(data,stand){
        	let len = data.length
        	let son_len = data[0].length
        	let new_data = []
        	for(let j=0;j<son_len;j++){
        		let item=[]
        		for(let i=0;i<len;i++){
        			item.push(data[i][j])
        		}
        		item.push({
        			value: stand,
        			name: '0.6标准'
        		})
        		new_data.push(item)
        	}
        	return new_data
        }
        this.list = chart_data(all,stand)
      },
      is_show(){
        if (this.list.length ===0){
          return true
        }else{
          return false
        }
      },
      show_leida(){
        var leidaChart = document.getElementsByClassName('leida'); // 对应地使用ByClassName
        for(var i = 0;i < leidaChart.length;i++ ){
          let myChart = this.$echarts.init(leidaChart[i],'dark');
          myChart.setOption({
        	title: {
        		  text: this.Teachers[i],
        		  subtext: '数据来源：'+JSON.parse(sessionStorage.getItem('file'))
        		},
        		tooltip: {
        		  trigger: 'axis'
        		},
        		legend: {
        		  orient: 'vertical',
        		  x: 'right',
        		  y: 'bottom',
        		  data: this.legend_data
        		},
        		toolbox: {
        		  show: true,
        		  feature: {
        			mark: { show: true },
        			dataView: { show: true, readOnly: false },
        			restore: { show: true },
        			saveAsImage: { show: true }
        		  }
        		},
        		polar: [
        		  {
                indicator: this.indicator_data,
                radius: 120
        		  }
        		],
        		calculable: true,
        		series: [
        		  {
        			name: '教师评价综合指标',
        			type: 'radar',
        			data: this.list[i]
        		  }
        		]
        	})
        }
      }
    },
    created() {
      let Leida = JSON.parse(sessionStorage.getItem('leida'))
      if (Leida){
        this.get_Leida(Leida)
      }
      else{
        bus.$on('leida',Leida=>{
          this.get_Leida(Leida)
        })
      }
    },
    mounted() {
      if (!this.is_show()){
        this.show_leida()
      }
    }
	}
</script>

<style lang="scss" scoped>
  .box-card{
  	width: 630px;
  	float: left;
  	margin:0px;
  	margin: 10px;
  }
  .leida{
  	width: 100%;
  	height: 400px;
  }
  .el-card__body{
  	padding: 0;
  }
</style>
