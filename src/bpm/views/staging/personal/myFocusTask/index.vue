<template>
  <div class="staging-personal-focusTask-container">
   <bas-page-bpm-staging-personal-focusTask tableStyle= 'bpmnew' :host="host" :VUE_APP_BPA_URL="VUE_APP_BPA_URL" />
  </div>
</template>
<script>
export default {
  name: 'StagingPersonalFocusTask',
  data() {
    return {
    }
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL;
    },
    VUE_APP_BPA_URL() {
      return process.env.VUE_APP_BPA_URL;
    }
  }
}
</script>

<style lang="scss" scoped>
.staging-personal-focusTask-container {
  ::v-deep .el-card__body {
    padding: 10px 30px 10px 10px !important;
  }
}
</style>
