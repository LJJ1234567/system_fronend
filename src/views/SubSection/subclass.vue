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
      v-for="(item,index) in datas" :key='index'>
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
          <div v-for="clas in item.class">
            <el-card class="box-card" height="100">
              <div slot="header" class="clearfix">
                <el-row :gutter="20" class="text">
                  <el-col :span="6">
                    评价类别：{{class_trasfrom(clas)}}
                  </el-col>
                  <el-col :span="6">
                    当前分类量：{{clas.length}}
                  </el-col>
                  <el-col :span="12">
                    评价数据总量：{{get_count(item)}}
                  </el-col>
                </el-row>
              </div>
              <div>
                <el-table
                  :data="clas"
                  style="width: 100%"
                  height="250"
                  max-height="250"
                  >
                  <el-table-column
                    type="index"
                    label="序号">
                  </el-table-column>
                  <el-table-column
                    :prop="get_class(clas)"
                    label="内容"
                    >
                  </el-table-column>
                </el-table>

              </div>
            </el-card>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>
  import bus from '../bus.js'
  import empty from '../empty.vue'
  export default {
    data() {
      return {
        filename:'',
        origin_filelen:0,
        activeNames: ['0'],
        datas:[],
        class_name:'',
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
      // 获取评价属性
      get_class(clas){
        for(let k in clas[0]){
          return k
        }
      },
      class_trasfrom(clas){
        for(let k in clas[0]){
          return this.class1[k]
        }
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

    },

    created() {
      let Class = JSON.parse(sessionStorage.getItem('class'))
      if(Class){
        this.datas=Class
      }
      else{
        bus.$on('class',res=>{
          console.log('监测class',res)
          this.datas = res
        })
      }
      this.filename = JSON.parse(sessionStorage.getItem('subfile'))
      this.origin_filelen = JSON.parse(sessionStorage.getItem('text')).length
    },
    mounted() {
      // if (!this.is_show()){
      //   this.show_disper()
      // }
    }
  }
</script>

<style>
  .el-collapse-item__header{
    background-color:#7fc0d1 ;
    font-size: 15px;
    color: white;
    padding: 0 10px;
    margin: 5px 0;
  }
</style>
<style lang="scss" scoped="scoped">
  .blue{
    color: dodgerblue;
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
