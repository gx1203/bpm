<template>
  <div>
    <iframe
      :style="WeatherOptions.style"
      :class="WeatherOptions.className"
      :width="WeatherOptions.width"
      :height="WeatherOptions.height"
      :src="iframeUrl"
      allowtransparency="true"
      frameborder="0"
      scrolling="no" />
  </div>
</template>

<script>
export default {
  name: 'PortalWeatherInfo',
  props: {
    WeatherOptions: {
      type: Object,
      default: () => {
        return {
          style: '', // 行内样式
          className: '', // class类
          width: (val) => {
            return val > 300 ? 300 : val
          },
          height: 100,
          fontColor: 'ff0000', // 文字颜色
          align: 'center', // 对齐方式 center left right
          air_quality: '0', // 是否开始空气质量显示 0 / 1
          city_select: '1', // 是否开启城市选择
          showItem: '2', // 显示几天的天气
          iconSize: '0' // 图标大小 0 / 1
        }
      }
    }
  },
  data() {
    return {
      iframeUrl: `//tianqi.2345.com/plugin/widget/index.htm?s=1&z=1&t=${this.WeatherOptions.iconSize}&v=0&d=${this.WeatherOptions.showItem}&bd=0&k=&f=${this.WeatherOptions.fontColor}&ltf=009944&htf=cc0000&q=${this.WeatherOptions.air_quality}&e=${this.WeatherOptions.city_select}&a=1&c=72270&w=290&h=96&align=${this.WeatherOptions.align}`
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
