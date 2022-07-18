<template>
  <div id="main">
    <right-float />
    <app-header />
    <div id="container" v-if="!this.$route.query.theProcessIs">
      <router-view :key="key" />
    </div>
    <div v-else id="containers">
      <router-view :key="key" />
    </div>
    <!-- <app-footer v-if="!this.$route.query.theProcessIs"></app-footer> -->
  </div>
</template>

<script>
export default {
  computed: {
    key() {
      return this.$route.fullPath
    }
  }
}
</script>

<style lang="scss" scoped>
#main {
  background-color: $bc2;
}
#containers {
  background-color: #fff;
  height: 100%;
  display: flex;
  padding-top: 90px;
  overflow: hidden;
}
#container {
  background-color: #fff;
  padding-top: 0 !important;
  height: 100%;
}
</style>
