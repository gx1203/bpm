<template>
  <div class="process-version-container">
    <bas-page-bpm-process-processModeling-processManagement />
  </div>
</template>
<script>
export default {
  name: "processManagement",
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.process-version-container {
  box-sizing: border-box;
  height: 100%;
  ::v-deep .el-card__body {
    padding: 10px 30px 10px 10px !important;
  }
}
</style>
