<template>
  <div id="responsible">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="总览" name="pandect">
        <pandect v-if="activeName === 'pandect'"></pandect>
      </el-tab-pane>
      <el-tab-pane label="工作职责" name="station">
        <station v-if="activeName === 'station'"></station>
      </el-tab-pane>
      <el-tab-pane label="风险" name="risk">
        <risk v-if="activeName === 'risk'"></risk>
      </el-tab-pane>
      <el-tab-pane label="RACI" name="raci">
        <raci v-if="activeName === 'raci'"></raci>
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
      activeName: 'pandect'
    }
  },
  mounted () {
  },
  methods: {
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
