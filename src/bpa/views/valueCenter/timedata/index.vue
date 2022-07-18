<template>
  <div class="w100">
    <iframe ref="iFrameTime" class="w100 h100" src="./leftMenu/processChart/BaseNewPage.html?id=2141&listid=7D36536AC5DD6356E0530701A8C0D2D1&treeId=79957553BD303978E053BF1A13ACD486&processName=构建愿景和战略&username=付大鹏&processNum=1.0&isRead=yes"></iframe>
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
      if (self.$refs.iFrameTime.getAttribute('class').indexOf('fullEditor') > -1) {
        self.$refs.iFrameTime.classList.remove('fullEditor')
      } else {
        self.$refs.iFrameTime.classList.add('fullEditor')
      }
    }
  },
  mounted() {
    this.$refs.iFrameTime.style.height = document.documentElement.clientHeight - 160 + 'px'
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
