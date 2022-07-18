<template>
  <el-card shadow="never">
    <div class="item-left">
      <!-- <tree-process type="2" @confirm="handleNodeClick"/> -->
      <BasProcessTree showView="2" type="3" @confirm="handleNodeClick" />
    </div>
    <div class="item-right">
      <flow-chart-help v-if="isShow" :treeData="treeData" />
    </div>
  </el-card>
</template>
<script>
import Vue from 'vue'
import BasProcessTree from 'bas-component'
Vue.use(BasProcessTree)
import flowChartHelp from './flowChartHelp'
// import treeProcess from "@/bpm/components/treeProcessFlow";
export default {
  name: 'flowChartConfiguration',
  components: {
    flowChartHelp,
    // treeProcess
  },
  data () {
    return {
      treeData: {},
      isShow: false
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
      if (data.type === '1' || data.type === '2') {
        this.treeData = Object.assign({}, data)
        this.isShow = true
      } else {
        this.isShow = false
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.item-left {
  float: left;
  width: 20%;
}
.item-right {
  float: right;
  width: 78%;
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
