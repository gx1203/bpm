<template>
  <el-card shadow="never" class="card-reset">
    <div class="item-left">
      <tree-mobile-process ref="tree" @confirm="handleNodeClick" />
    </div>
    <div class="item-right">
      <div class="tool-common-wrap">
        <div class="btn-wrap">
              <el-button type="primary" @click="refreshData">
               {{ $t('refresh') }}
                <!--<i class="el-icon-refresh"/>-->
              </el-button>
        </div>
      </div>
      <div v-if="isShow">
        <config-process :treeData="treeData" @confim="refreshData" v-if="treeData.type === 'root'" />
        <mobile-node :treeData="treeData" @refreshData="refreshData" v-else-if="treeData.type === 'procesnode'" />
        <el-tabs v-else-if="treeData.type === 'proces'" v-model="editableTabsValue" type="card">
          <el-tab-pane
            :key="index"
            v-for="(item, index) in editableTabs"
            :label="item.title"
            :name="item.name"
          >
            <mobile-node-config :treeData="treeData" v-if="editableTabsValue === '1'" />
            <approval-type :treeData="treeData" v-if="editableTabsValue === '2'" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </el-card>
</template>

<script>
import treeMobileProcess from "@/bpm/components/treeMobileProcess";
import mobileNodeConfig from "./mobileNode/mobileNodeConfig";
import approvalType from "./mobileNode/approvalType";
import configProcess from "./mobileNode/configProcess";
import mobileNode from "./mobileNode/mobileNode";

export default {
  name:'mobileProcess',
  components: {
    treeMobileProcess,
    approvalType,
    configProcess,
    mobileNode,
    mobileNodeConfig
  },
  data() {
    return {
      isShow: false,
      editableTabsValue: "1",
      treeData: {},
      editableTabs: [
        {
          title: this.$t('mobileNodeConfiguration'),
          name: "1"
        },
        // {
        //   title: "审批类型配置",
        //   name: "2"
        // }
      ]
    };
  },
  methods: {
    handleNodeClick(data) {
      this.treeData = Object.assign({}, data);
      this.isShow = true;
    },
    refreshData(data) {
      if (data) {
        this.$refs.tree.getDepartment();
        // this.isShow = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.card-reset {
  ::v-deep > .el-card__body {
    display: flex;
  }
}
.item-left {
  width: 250px;
  height: 100%;
  margin-right: 20px;
}
.item-right {
  // width: calc(100% - 270px);
  flex: 1;
  height: 100%;
  overflow-y: scroll;
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
