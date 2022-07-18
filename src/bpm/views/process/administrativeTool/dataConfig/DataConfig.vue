<template>
  <!-- <div class="DataConfig">
    <bas-data-config tableStyle="bpmnew" viewUrl='#/config/administrativeTool/dataList/'></bas-data-config>
  </div> -->
  <el-card shadow="never" class="card-reset">
    <el-tabs v-model="active" type="card" class="topCustom">
      <el-tab-pane :label="$t('modulePage')" name="modulePage">
         <bas-data-table-config :basDragForm="basDragForm" tableStyle="bpmnew" :viewUrl="viewUrl"></bas-data-table-config>
      </el-tab-pane>
      <el-tab-pane :label="$t('basicData')" name="basicdata">
         <bas-data-config tableStyle="bpmnew" viewUrl='#/config/administrativeTool/dataList/'></bas-data-config>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>
<script>
//import BasDataConfig  from '../../../../components/BasDataConfig/BasDataConfig'
import Vue from 'vue'
import BasComponent from 'bas-component'
Vue.use(BasComponent)
import 'bas-component/lib/BasComponent.css'

export default {
  name: 'DataConfig',
  components: {
  },
  data() {
    return {
      active: 'modulePage',
      basDragForm:'basDragForm',
      viewUrl:'basDataList'
    }
  }
}
</script>

<style scoped lang="scss">
/deep/ .el-tabs__content {
  padding-top: 10px;
}
.topCustom /deep/ .el-card__body {
  padding: 0 !important;
}
</style>