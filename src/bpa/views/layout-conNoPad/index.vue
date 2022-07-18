<template>
  <div id="main">
    <app-header></app-header>
    <div id="container" class="border-box">
      <router-view :key="key"></router-view>
    </div>
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