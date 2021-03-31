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
      <el-collapse v-model="activeNames"
      @change="handleChange"
      v-for="(item,index) in datas"
      :key="index">
        <el-collapse-item :name="index+''">
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
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="focus" ></div>
              </el-col>
              <el-col :span="12">
                <div class="chara"></div>
              </el-col>
            </el-row>
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
    name:'subfocus',
    data() {
      return {
        filename:'',
        origin_filelen:0,
        activeNames: ['0'],
        datas:[],
        list1:[],
        list2:[],
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
      // 1.气泡图-焦点图
      focusChart (data = [], format = [], dom, title, filename) {
        let [maxValue, temp] = [0, []]
        data.forEach(item => {
          temp.push(item[format[1]])
        })
        maxValue = Math.max.apply(null, temp)

        // 气泡颜色数组
        let color = [
          '#FFB600', '#886CFF', '#0084FF',
          '#4CB690','#58B458', '#6C6C6C',
          '#F56161', '#FC754C','#5F5EEC'
        ]
        // 气泡颜色备份
        let bakeColor = [...color]
        // 气泡数据
        let bubbleData  = []
        // 气泡基础大小
        let basicSize = 50
        // 节点之间的斥力因子,值越大,气泡间距越大
        let repulsion = 300
        // 根据气泡数量配置基础大小和斥力因子（以实际情况进行适当调整，使气泡合理分布）
        if (data.length >= 5 && data.length < 10) {
          basicSize = 50
          repulsion = 200
        }
        if (data.length >= 10 && data.length < 20) {
          basicSize = 40
          repulsion = 120
        } else if (data.length >= 20) {
          basicSize = 30
          repulsion = 50
        }

        // 填充气泡数据数组bubbleData
        for (let item of data) {
          // 确保气泡数据条数少于或等于气泡颜色数组大小时，气泡颜色不重复
          if (!bakeColor.length) bakeColor = [...color]
          let colorSet = new Set(bakeColor)
          let curIndex = Math.round(Math.random()*(colorSet.size - 1))
          let curColor = bakeColor[curIndex]
          colorSet.delete(curColor)
          bakeColor = [...colorSet]
          // 气泡大小设置
          let size = (item[format[1]] * basicSize * 2) / maxValue
          if (size < basicSize) size = basicSize

          bubbleData.push({
            "name": item[format[0]],
            "value": item[format[1]],
            "symbolSize": size,
            "draggable": true,
            "itemStyle": {
            "normal": {"color": curColor}
            }
          })
        }
        this.mychart = this.$echarts.init(dom,'dark')
        let bubbleOptions = {
        title: {
            text: title,
            subtext: '数据来源：'+filename
          },
        toolbox:{
         show:true,
         feature:{
            restore:{},
            dataView:{
              show:true,
              title:'数据视图'
            },
            saveAsImage:{}
          },
          right:20
        },
        tooltip: {},
          backgroundColor: '#100C2A',
          animationEasingUpdate: 'bounceIn',
          series: [{
              type: 'graph',
              layout: 'force',
              force: {
                  repulsion: repulsion,
                  edgeLength: 10
              },
              // 是否开启鼠标缩放和平移漫游
              roam: false,
              label: {normal: {show: true}},
              data: bubbleData
          }]
        }
        this.mychart.setOption(bubbleOptions)
        if(filename){
          this.mychart.hideLoading();
        }else{
          this.mychart.showLoading();
        }
      },
    },
    created() {
      let Class = JSON.parse(sessionStorage.getItem('class'))
      if(Class){
        this.datas=Class
        for(let item of Class){
          let load_frous=[]
          let load_chara=[]
            for(let it of item.focus){
              let temp={}
              temp['label'] = it[0]
              temp['amount'] = it[1]
              load_frous.push(temp)
            }
            for(let it of item.chara){
              let temp={}
              temp['label'] = it[0]
              temp['amount'] = it[1]
              load_chara.push(temp)
            }
           this.list1.push(load_frous)
           this.list2.push(load_chara)
        }
      }
      else{
        bus.$on('class',res=>{
          console.log('监测class',res)
          this.datas = res
          for(let item of res){
            let load_frous=[]
            let load_chara=[]
              for(let it of item.focus){
                let temp={}
                temp['label'] = it[0]
                temp['amount'] = it[1]
                load_frous.push(temp)
              }
              for(let it of item.chara){
                let temp={}
                temp['label'] = it[0]
                temp['amount'] = it[1]
                load_frous.push(temp)
              }
             this.list1.push(load_frous)
             this.list2.push(load_chara)
          }
        })
      }

      this.filename = JSON.parse(sessionStorage.getItem('subfile'))
      this.origin_filelen = JSON.parse(sessionStorage.getItem('text')).length
    },
    mounted() {
      let chartDom = document.getElementsByClassName('focus')
      for(var i = 0;i < chartDom.length;i++ ){
        this.focusChart (
        this.list1[i], ['label', 'amount'],
        chartDom[i], '焦点分析',
        sessionStorage.getItem('subfile'))
      }
      let charaDom = document.getElementsByClassName('chara')
      for(var i = 0;i < charaDom.length;i++ ){
        this.focusChart (
        this.list2[i], ['label', 'amount'],
        charaDom[i], '特性分析',
        sessionStorage.getItem('subfile'))
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
    background-color:#7fc0d1 ;
    font-size: 15px;
    color: white;
    padding: 0 10px;
    margin: 5px 0;
  }
</style>
<style lang="scss" scoped="scoped">
  .focus{
  	width: 620px;
  	height: 500px;
  }
  .chara{
  	width: 620px;
  	height: 500px;
  }
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
