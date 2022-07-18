
<template>
    <div class="com-charts" :class="className" ref="charts"></div>
</template>
<script>
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line') // 线图
require('echarts/lib/chart/bar') // 柱图
require('echarts/lib/chart/pie') // 饼图
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
require('echarts/lib/component/title')
export default {
  name: 'echarts',
  props: {
    option: {
      type: Object,
      default: {}
    },
    className: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      myecharts: ''
    }
  },
  mounted () {
    this.myecharts = echarts.init(this.$refs.charts)
    this.myecharts.setOption(this.option)
    const that = this
    window.addEventListener('resize', function () {
      that.myecharts.resize()
    })
    this.myecharts.on(
      'click',
      (param) => {
        this.$emit('echartsClick', param)
      }
    )
  },
  watch: {
    option: {
      handler (newName, oldName) {
        this.myecharts = echarts.init(this.$refs.charts)
        this.myecharts.setOption(this.option)
      },
      deep: true
    }
  }
}
</script>

<style>
.com-charts canvas,.com-charts div:first-of-type{
    width: 100%!important;
}
</style>
