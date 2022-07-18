<template>
  <el-card shadow="never">
    <div class="item-left">
      <!-- <tree-process type='1' ref="tree" @confirm="handleNodeClick" /> -->
      <BasProcessTree showView="1" @confirm="handleNodeClick" />
    </div>
    <div class="item-right">
      <div class="tool-common-wrap">
        <div class="btn-wrap">
          <el-button type="primary" @click="refreshData">
            {{ $t('refresh') }}
            
          </el-button>
        </div>
      </div>
      <el-tabs v-model="editableTabsValue" v-if="isShow" type="card">
        <el-tab-pane :key="index" v-for="(item, index) in editableTabs" :label="item.title" :name="item.name">
          <node-alias :treeData="treeData" v-if="editableTabsValue === '1'" />
          <process-manager :treeData="treeData" v-if="editableTabsValue === '2'" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-card>
</template>
<script>
import Vue from 'vue'
import BasProcessTree from 'bas-component'
Vue.use(BasProcessTree)
// import treeProcess from "@/bpm/components/treeProcessFlow";
import nodeAlias from './nodeAlias/nodeAlias'
import processManager from './nodeAlias/processManager'
export default {
  name: 'institutionalFramework',
  components: {
    nodeAlias,
    // treeProcess,
    processManager
  },
  data () {
    return {
      treeData: {},
      isShow: false,
      editableTabsValue: '',
      editableTabs: [{
        title: this.$t('configureNodeAlias'),
        name: '1'
      }, {
        title: this.$t('processManager2'),
        name: '2'
      }],
    };
  },
  methods: {
    handleNodeClick (data) {
      if (data.type === "1") {
        this.treeData = data;
        this.editableTabsValue = '1'
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    },
    refreshData () {
      this.isShow = false
      this.$refs.tree.getDepartment()
    },
  }
};
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
