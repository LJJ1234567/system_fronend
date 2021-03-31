<template>
  <div class="app-container">
    <div class="item">
      <nx-data-tabs :option="easyDataOption"></nx-data-tabs>
    </div>

    <el-card class="box-card">
      <div class="text item">
          <div id="first_main"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import nxDataTabs  from '@/components/nx-data-tabs/nx-data-tabs'
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  components:{
    nxDataTabs
  },
  data(){
    return {
      easyDataOption: {
        span: 6,
        data: [
          {
            title: '运行天数',
            subtitle: '实时',
            count: 0,
            allcount: 0,
            text: '',
            color: 'rgb(49, 180, 141)',
            key: '运'
          },
          {
            title: '访问次数',
            subtitle: '实时',
            count: 0,
            allcount: 0,
            text: '总访问量:',
            color: 'rgb(56, 161, 242)',
            key: '访'
          },
          {
            title: '客观数据处理量',
            subtitle: '实时',
            count: 0,
            allcount: 0,
            text: '总处理量:',
            color: 'rgb(117, 56, 199)',
            key: '客'
          },
          {
            title: '主观数据处理量',
            subtitle: '实时',
            count: 0,
            allcount: 0,
            text: '总处理量:',
            color: 'rgb(59, 103, 164)',
            key: '主'
          }
        ]
      },

      legend_data:['客观数据处理','主观数据处理'],
      xAxis_data:[],
      Series1:[],
      Series2:[],
      test:''
    }
  },
  created() {
    this.$http.post('base/').then(res =>{
      // console.log(res.data)
      this.easyDataOption.data[0]['count'] = res.data.run_times
      this.easyDataOption.data[0]['allcount'] = res.data.run_times
      this.easyDataOption.data[1]['count'] = res.data.user_visit
      this.easyDataOption.data[1]['allcount'] = res.data.visits
      this.easyDataOption.data[2]['count'] = res.data.user_obj
      this.easyDataOption.data[2]['allcount'] = res.data.objs
      this.easyDataOption.data[3]['count'] = res.data.user_sub
      this.easyDataOption.data[3]['allcount'] = res.data.subs
    })
  },
  methods:{
    network(legend_data,xAxis_data,Series1,Series2){
      var chartDom = document.getElementById('first_main');
      var myChart = this.$echarts.init(chartDom, 'dark');
      var option;
      option = {
          title: {
              text: '服务端响应时间参考(单位：s)'
          },
          tooltip: {
              trigger: 'axis'
          },
          legend: {
              data: legend_data
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          toolbox: {
              show: true,
              feature: {
                  dataView: {show: true, readOnly: false},
                  magicType: {show: true, type: ['line', 'bar']},
                  restore: {show: true},
                  saveAsImage: {show: true}
              }
          },
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data: xAxis_data
          },
          yAxis: {
              type: 'value'
          },
          series: [
              {
                  name: legend_data[0],
                  type: 'line',
                  stack: '总量',
                  smooth: true,
                  data: Series1
              },
              {
                  name: legend_data[1],
                  type: 'line',
                  stack: '总量',
                  smooth: true,
                  data: Series2
              },
          ]
      };
      option && myChart.setOption(option);
    }
  },
  mounted() {
    this.$http.post('response/').then(res =>{
      console.log(res.data)
      let ObjDires = res.data.ObjDire
      let SubDires = res.data.SubDire
      console.log(ObjDires)
      if(Object.keys(ObjDires).length<Object.keys(SubDires).length){
        this.xAxis_data = Object.keys(SubDires)
        this.Series1 = Object.values(ObjDires)
        this.Series2 = Object.values(SubDires)
      }else{
        this.xAxis_data = Object.keys(ObjDires)
        this.Series1 = Object.values(ObjDires)
        this.Series2 = Object.values(SubDires)
      }
      this.network(this.legend_data,this.xAxis_data,this.Series1,this.Series2)
    })

  }
}
</script>


<style lang="scss" scoped>
.item {
  margin-bottom: 10px;
}

.box-card {
  width: 100%;
}

#first_main{
		width: 100%;
		height: 400px;
	}
</style>
<style lang ="scss">
    @import '../../styles/data-display.scss';
    @import '../../styles/data-icons.scss';
    @import '../../styles/data-tabs.scss';
</style>
