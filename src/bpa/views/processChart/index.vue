<template>
  <div class="w100">
    <iframe ref="iFrame" class="w100 h100" src="./leftMenu/processChart/BaseNewPage.html?id=8BB847623E4C6F35E053697D65B40083&showChart=yes"></iframe>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  created () {
    let self = this
    window.relist = () => {
      self.$router.push('/diCenter/valueChain')
    }
  },
  mounted() {
    this.$refs.iFrame.style.height = document.documentElement.clientHeight + 'px'
  }
}
</script>
