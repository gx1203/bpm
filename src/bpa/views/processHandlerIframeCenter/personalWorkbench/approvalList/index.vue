<template>
  <div class="view_wrap">
    <div class="bpm-iframe">
      <iframe :src="BPMURL" frameborder="0"/>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      BPMURL: 'http://180.101.125.130/bpm/#/approveList?username=' + JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
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
  .bpm-iframe{
    width: 100%;
    height: calc(100vh - 165px);
    iframe{
      width: 100%;
      height: 100%;
    }
  }
</style>
