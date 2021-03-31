<template>
  <div class="data-tabs">
    <el-row :span="24">
      <el-col :span="span" v-for="(item,index) in data" :key="index">
        <div class="item" :style="{background:item.color}">
          <div class="item-header">
            <p>{{item.title}}</p>
            <span>{{item.subtitle}}</span>
          </div>
          <div class="item-body">
            <h2><nx-count-up :start="item.count" :end="item.count"/></h2>
          </div>
          <div class="item-footer">
            <el-row :gutter="20">
              <el-col :span="8">
                <div>{{item.text}}</div>
              </el-col>
              <el-col :span="16">
                <span>{{item.allcount}}</span>
              </el-col>
            </el-row>
          </div>
          <p class="item-tip">{{item.key}}</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import nxCountUp from '@/components/nx-count-up/index.vue'
export default {
  components: {
    nxCountUp
  },
  name: 'nx-data-tabs',
  data() {
    return {
      span: this.option.span || 6,
      data: this.option.data || []
    }
  },
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
