<template>
  <div class="w100">
    <iframe ref="iFrameFolders" class="w100 h100" src="./leftMenu/valueChain/BaseNewPage.html?id=2140&listid=2140&treeId=79957553BD303978E053BF1A13ACD486&processName=构建愿景和战略&username=付大鹏&processNum=1.0&isRead=yes"></iframe>
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
        if (self.$refs.iFrameFolders.getAttribute("class").indexOf('fullEditor') > -1 ) {
          self.$refs.iFrameFolders.classList.remove("fullEditor")
        } else {
          self.$refs.iFrameFolders.classList.add("fullEditor")
        }
      }
    },
    mounted() {
      this.$refs.iFrameFolders.style.height = document.documentElement.clientHeight - 160 + 'px'
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
