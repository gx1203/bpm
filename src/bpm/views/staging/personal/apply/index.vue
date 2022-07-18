<template>
  <!-- <div>
    <bas-page-bpm-staging-personal-apply tableStyle= 'bpmnew' :host="host" :VUE_APP_BPA_URL="VUE_APP_BPA_URL" />
  </div> -->
  <el-card shadow="never" class="card-reset">
    <el-tabs v-model="active" type="card" class="card-reset-inner">
      <el-tab-pane :label="$t('MyApplication')" name="application">
        <!-- <bas-page-bpm-staging-personal-apply
          tableStyle="bpmnew"
          :host="host"
          :VUE_APP_BPA_URL="VUE_APP_BPA_URL"
        /> -->
        <apply
          tableStyle="bpmnew"
          :host="host"
          :VUE_APP_BPA_URL="VUE_APP_BPA_URL"
        ></apply>
      </el-tab-pane>
      <el-tab-pane :label="$t('processTrace')" name="processMenu">
        <!-- <bas-page-bpm-staging-personal-processTrace
          tableStyle="bpmnew"
          :host="host"
          :VUE_APP_BPA_URL="VUE_APP_BPA_URL"
        /> -->
        <process-trace
          tableStyle="bpmnew"
          :host="host"
          :VUE_APP_BPA_URL="VUE_APP_BPA_URL"
        ></process-trace>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>
<script>
import Apply from './apply.vue'
import ProcessTrace from '../processTrace/processTrace.vue'

export default {
  name: 'stagingPersonalApply',
  components: { Apply, ProcessTrace },
  created() {
    console.log(this.$route)
    if (this.$route.params.active === 'processMenu') {
      console.log(111)
      this.active = 'processMenu'
    }
  },
  data() {
    return {
      active: 'application'
    }
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    VUE_APP_BPA_URL() {
      return process.env.VUE_APP_BPA_URL
    }
  }
}
</script>

<style scoped lang="scss">
.card-reset-inner /deep/ .el-card__body {
padding: 10px 0 0 0 !important;
}
</style>
