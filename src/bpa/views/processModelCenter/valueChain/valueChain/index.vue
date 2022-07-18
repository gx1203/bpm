<template>
  <div class="w100">
    <iframe ref="iFrameVal" class="w100 h100" src="./leftMenu/valueChainPublish/BaseNewPage.html?id=2142&listid=2140&treeId=79957553BD303978E053BF1A13ACD486&processName=构建愿景和战略&username=付大鹏&processNum=1.0&isRead=yes"></iframe>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  created () {
    let self = this
    window.onFullScreen = () => {
      if (self.$refs.iFrameVal.getAttribute("class").indexOf('fullEditor') > -1 ) {
        self.$refs.iFrameVal.classList.remove("fullEditor")
      } else {
        self.$refs.iFrameVal.classList.add("fullEditor")
      }
    }
  },
  mounted() {
    this.$refs.iFrameVal.style.height = document.documentElement.clientHeight - 160 + 'px'
  }
}
</script>

<style lang="scss" scoped>
  .fullEditor{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%!important;
    z-index: 99999;
  }
</style>
