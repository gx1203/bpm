<template>
  <el-card shadow="never" class="process-model-container">
    <div class="item-left">
      <!-- <treeProcess ref="tree" @confirm="handleNodeClick"/> -->
      <BasProcessTree isVersion showView="2" filterType="button" ref="tree" :pid="$route.query.pid" :version="$route.query.version" @confirm="handleNodeClick" @switchVersion="switchVersion" />
    </div>
    <div class="item-right">
      <workflow-configuration @treeRefresh="treeRefresh" :treeData="treeData" v-if="isShow === '1'" />
      <flow-node @treeRefresh="treeRefresh" :treeData="treeData" v-if="isShow === '2'" />
      <essential-information :treeData="treeData" v-if="isShow >= '3'" />
    </div>
  </el-card>
</template>

<script>
import workflowConfiguration from './workflowConfiguration'
import flowNode from './flowNode'
import essentialInformation from './essentialInformation'
import BasProcessTree from '@/bpm/components/BasProcessTree'
export default {
  name: 'configurationFlow',
  components: {
    workflowConfiguration,
    flowNode,
    essentialInformation,
    BasProcessTree
  },
  data () {
    return {
      isShow: '0',
      treeData: {}
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.basuser.user
    },
    key () {
      return this.$route.fullPath
    }
  },
  methods: {
    handleNodeClick (data) {
      console.log(data)
      this.treeData = data
      this.isShow = data.type
    },
    switchVersion (data) {
      this.treeData = data
      this.isShow = '0'
      this.$nextTick(() => {
        this.isShow = '1'
      })
    },
    treeRefresh () {
      this.$refs.tree.treeRefresh()
    }
  }
}
</script>
<style lang="scss" scoped>
.process-model-container {
  box-sizing: border-box;
  height: 100%;
  ::v-deep > .el-card__body {
    height: 100%;
    box-sizing: border-box;
    padding: 10px 30px 10px 10px !important;
    display: flex;
  }
}
.item-left {
  box-sizing: border-box;
  width: 250px;
  height: 100% !important;
  margin-right: 20px;
  // overflow: auot;
}
.item-right {
  width: calc(100% - 270px);
  .table-header {
    position: relative;
    background: $bc2;
    display: flex;
    align-items: center;
    .all-check {
      position: absolute;
      left: 20px;
    }
  }
}
</style>
