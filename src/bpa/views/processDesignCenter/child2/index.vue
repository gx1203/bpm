<template>
  <div class="w100">
    <iframe ref="iFrame" class="w100 h100" src="./leftMenu/leftMenu.html?lan=CN"></iframe>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  mounted() {
    this.$refs.iFrame.style.height = document.documentElement.clientHeight - 120 + 'px'
  }
}
</script>
