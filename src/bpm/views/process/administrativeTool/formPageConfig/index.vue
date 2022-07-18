<template>
  <div class="visualDataConfig">
    <bas-form-page-config :basDragForm="basDragForm" tableStyle="bpmnew" :viewUrl="viewUrl" />
  </div>
</template>
<script>
export default {
  name: 'formPageConfig',
  components: {
  },
  data() {
    return {
      basDragForm: 'basDragForm',
      viewUrl: 'formPagePreview',
    }
  },
  created() {
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
.visualDataConfig {
  ::v-deep .el-card__body {
    padding: 10px 30px 10px 10px !important;
  }
}
</style>
