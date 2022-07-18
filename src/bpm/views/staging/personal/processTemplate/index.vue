<template>
  <div class="staging-personal-processTemplate-container">
   <bas-page-bpm-staging-personal-processTemplate tableStyle= 'bpmnew' />
  </div>
</template>
<script>
export default {
  name: 'stagingPersonalProcessTemplate',
  components: {
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.staging-personal-processTemplate-container {
  ::v-deep .el-card__body {
    padding: 10px 30px 10px 10px !important;
  }
}
</style>
