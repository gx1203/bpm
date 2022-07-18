<template>
  <!-- <div> -->
   <!-- <bas-page-bpm-staging-personal-myCc tableStyle= 'bpmnew' /> -->
  <!-- </div> -->
  <el-card shadow="never" class="card-reset">
    <el-tabs v-model="active" type="card" class='topCustom'>
      <el-tab-pane :label="$t('MyCc')" name="MyCc" class="reset-inner">
        <bas-page-bpm-staging-personal-myCc tableStyle= 'bpmnew' />
      </el-tab-pane>
      <el-tab-pane :label="$t('carboncopyToMe')" name="carboncopyToMe" class="reset-inner">
        <bas-page-bpm-staging-personal-ccMy tableStyle= 'bpmnew' />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>
<script>
export default {
  name: 'myCC',
  components: {
  },
  data() {
    return {
      active: 'MyCc'
    }
  }
}
</script>

<style lang="scss" scoped>
.reset-inner {
  ::v-deep .el-card__body {
    padding: 10px 0 0 0 !important;
  }
}
</style>
