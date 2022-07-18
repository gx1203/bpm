<template>
  <div class="staging-personal-drafts-container">
   <bas-page-bpm-staging-personal-drafts tableStyle= 'bpmnew' />
  </div>
</template>
<script>
export default {
  name: 'stagingPersonalDrafts',
  components: {
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.staging-personal-drafts-container {
  ::v-deep .el-card__body {
    padding: 10px 30px 10px 10px !important;
  }
}
</style>
