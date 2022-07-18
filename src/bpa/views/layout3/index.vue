<template>
  <div id="main">
    <app-header />
    <div id="container">
      <left-menu @bpmurl="bpmIframeUrl" />
      <div class="view_wrap">
        <div class="bpm-iframe">
          <iframe :src="BPMURL" frameborder="0" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LeftMenu from './LeftMenu'
export default {
  components: {
    LeftMenu
  },
  data() {
    return {
      BPMURL: 'http://test.jiucaiyun.cn/jiucaiyunbpm/#/approveList?username=' + JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
    }
  },
  methods: {
    bpmIframeUrl(val) {
      console.log(val)
      this.BPMURL = val
    }
  }
}
</script>
<style lang="scss" scoped>
#main {
  background-color: $bc2;
}
  .bpm-iframe{
    width: 100%;
    height: 100%;
    iframe{
      width: 100%;
      height: 100%;
    }
  }
</style>
