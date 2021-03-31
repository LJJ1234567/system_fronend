<template>
  <div v-if="is_show()">
    <empty></empty>
  </div>
  <div v-else>
    <el-card class="box-card">
      <el-row :gutter="20" style="width: 100%;">
        <el-col :span="6">当前文件：<span class='blue'>{{this.filename}}</span></el-col>
        <el-col :span="6">有效数据量：
          <span class='blue'>{{get_all(datas)}}/</span>{{this.origin_filelen}}</el-col>
      </el-row>
    </el-card>
    <el-card>
      <el-collapse v-model="activeNames" @change="handleChange"
      v-for="(item,index) in datas" :key="index">
        <el-collapse-item  :name="index+''">
          <template slot="title" >
            <el-row :gutter="20" style="width: 100%;">
              <el-col :span="6">{{item.name}}</el-col>
              <el-col :span="6">数据总量：{{get_count(item)}}</el-col>
              <el-col :span="6">
                占比：{{get_count2(item,datas)}}
              </el-col>
              <el-col :span="6"></el-col>
            </el-row>
          </template>
          <el-card >
            <div class="emos_cirle" style="width: 1220px; height: 500px;"></div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>
  import bus from '../bus.js'
  import empty from '../empty.vue'
  export default {
    name:'subemos',
    data() {
      return {
        filename:'',
        origin_filelen:0,
        activeNames: ['0'],
        datas:[],
        list:[],
        class1:{
          'neg':'消极型',
          'nvi':'无观点型',
          'owe':'不足型',
          'exp':'期望型',
          'pos':'积极型',
        },
      };
    },
    components:{
      empty
    },
    methods: {
      is_show(){
        if (this.datas.length ===0){
          return true
        }else{
          return false
        }
      },
      handleChange(val) {
        // console.log(val);
      },
      get_id(index){
        return index+''
      },
      get_count(item){
        let sum=0
        for(let i in item.class){
          sum+=item.class[i].length
        }
        return sum
      },
      get_all(datas){
        let sum3=0
        for(let item of datas){
          for(let it of item.class){
            sum3+=it.length
          }
        }
        return sum3
      },
      get_count2(item,datas){
        let sum2=0
        let sum1=0
        let result
        for(let i in item.class){
          sum1+=item.class[i].length
        }
        for(let item of datas){
          for(let it of item.class){
            sum2+=it.length
          }
        }
        result= (sum1/sum2)*100
        return result.toFixed(2)+'%'
      },
      // 环形图
      draw_cirle(chartDom,list){
        var myChart = this.$echarts.init(chartDom,'dark');
        var option;
        option = {
            title: {
                text: '评价情感分析',
                subtext: '数据来源:'+JSON.parse(sessionStorage.getItem('subfile')),
                left: 'left'
            },
            toolbox: {
              show: true,
              feature: {
                  mark: {show: true},
                  dataView: {show: true, readOnly: false},
                  restore: {show: true},
                  saveAsImage: {show: true}
              }
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '5%',
                left: 'center'
            },
            series: [
                {
                    name: '情感分析',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '40',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: list
                }
            ]
        };
        option && myChart.setOption(option);
      }
    },
    created() {
      let Class = JSON.parse(sessionStorage.getItem('class'))
      if(Class){
        this.datas=Class
        for(let i of Class){
          // console.log(i)
          for(let j of i.rante){
            Object.defineProperty(j,'name',{value:this.class1[j.name]});
            // console.log(j)
          }
          this.list.push(i.rante)
        }
      }
      else{
        bus.$on('class',res=>{
          console.log('监测class',res)
          this.datas = res
          for(let i of res){
            // console.log(i)
            this.list.push(i.rante)
          }
        })
      }

      this.filename = JSON.parse(sessionStorage.getItem('subfile'))
      this.origin_filelen = JSON.parse(sessionStorage.getItem('text')).length
    },
    mounted() {
      let chartDom = document.getElementsByClassName('emos_cirle')
      for(var i = 0;i < chartDom.length;i++ ){
        this.draw_cirle(chartDom[i],this.list[i])
      }
      // if (!this.is_show()){
      //   this.show_disper()
      // }
    }
  }
</script>

<style>
  .blue{
    color: dodgerblue;
  }
  .el-collapse-item__header{
    background-color:#509FB4 ;
    font-size: 15px;
    color: white;
    padding: 0 10px;
    margin: 5px 0;
  }
</style>
<style lang="scss" scoped="scoped">
  .box-card{
    margin: 10px 0;
  }
  .text {
      font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }
</style>
