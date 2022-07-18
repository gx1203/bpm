<template>
  <div id="responsible">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="总览" name="pandect">
        <pandect v-if="activeName === 'pandect'" @confirm="confirmId"></pandect>
      </el-tab-pane>
      <el-tab-pane label="工作职责" name="station">
        <station v-if="activeName === 'station'" :orgIds="orgId"></station>
      </el-tab-pane>
      <el-tab-pane label="风险" name="risk">
        <risk v-if="activeName === 'risk'" :orgIds="orgId"></risk>
      </el-tab-pane>
      <el-tab-pane label="RACI" name="raci">
        <raci v-if="activeName === 'raci'" :orgIds="orgId"></raci>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import pandect from './components/pandect.vue'
import station from './components/station.vue'
import risk from './components/risk.vue'
import raci from './components/raci.vue'
export default {
  components: {
    pandect,
    station,
    risk,
    raci
  },
  data () {
    return {
      // 右侧tab默认的选中
      activeName: 'pandect',
      orgId: ''
    }
  },
  mounted () {
  },
  watch: {
    orgId (val) {
      if (val) {
      }
    }
  },
  methods: {
    confirmId (item) {
      this.orgId = item
      console.log(this.orgId)
    },
    handleClick (tab, event) {
      let self = this
      if (tab.name === 'organization') {
        self.getMenuOrgList()
      } else if (tab.name === 'role') {
        self.getMenuRoleList()
      }
    }
  }
}
</script>

<style scoped lang="scss">
#responsible{
  /deep/ .el-tabs__header{
    margin: 0;
  }
}
</style>
