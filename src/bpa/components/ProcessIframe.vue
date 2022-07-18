<template>
  <div class="tree_wrapper">
    <bas-search
      :placeholder="pleaseEnterEnterpriseProcessArchitecture"
      v-model="keyWords"
      @fnSearch="filterTree"
    />
    <div class="left_tree_wrapper margin-t10">
      <el-tree
        ref="tree"
        v-show="!controlTree"
        :props="props"
        :load="loadNode"
        node-key="id"
        lazy
        :default-expanded-keys="grandParentId"
        :expand-on-click-node="false"
        @node-click="handlerNodeClick"
         class="elTree"
      >
        <div :class="data.isVisible === '0' ? 'disabled' : ''" class="custom-tree-node w100" slot-scope="{ node, data }">
          <p :class="{ green: data.release === 'Y' }" :title="node.label">
            {{
              node.label +
              "(" +
              data.childrenReleaseCount +
              "/" +
              data.childrenCount +
              ")"
            }}
          </p>
        </div>
      </el-tree>
      <el-tree
        ref="treeFilter"
        v-show="controlTree"
        :props="props"
        :data="treelist"
        node-key="id"
        :expand-on-click-node="false"
        @node-click="handlerNodeClick"
        :default-expand-all="true"
      >
        <div :class="data.isVisible === '0' ? 'disabled' : ''" class="custom-tree-node w100" slot-scope="{ node, data }">
          <p :class="{ green: data.release === 'Y' }" :title="node.label">
            {{
              node.label +
              "(" +
              data.childrenReleaseCount +
              "/" +
              data.childrenCount +
              ")"
            }}
          </p>
        </div>
      </el-tree>
    </div>
  </div>
</template>
<script>
import {
  getProcessIframeTree,
  searchProcessIframeTree,
  searchProcessIframeTreeNew,
  searchProcessIframeTree1
} from "@/bpa/api/componentsApi";
export default {
  name: "ProcessIframe",
  data() {
    return {
      controlTree: false,
      treelist: [],
      keyWords: "",
      grandParentId: [],
      props: {
        label: "name",
        isLeaf: function (data, node) {
          if (data.isparent === true) {
            return false;
          } else {
            return true;
          }
        },
      },
      pleaseEnterEnterpriseProcessArchitecture: this.$t(
        "placeholderText.pleaseEnterEnterpriseProcessArchitecture"
      ),
      modelid: null
    };
  },
  methods: {
    loadNode(node, resolve) {
      const id = node.data ? node.data.id : "0";
      getProcessIframeTree(id, 'rulecommunity').then((res) => {
        if (!res) return false
        if (node.level === 0 || (node.level < 2 && res.length === 1)) {
          this.grandParentId = [res[0].id]
        }
        if (node.level === 1 && res.length > 0) {
          this.$nextTick(() => {
            if (this.$refs.tree) {
              this.$refs.tree.setCurrentKey(res[0].id)
              this.modelid = res[0].id
              this.$emit("click_", res[0]);
            }
          })
        }
        resolve(res);
      });
    },
    renderContent(h, { node, data, store }) {
      const dom1 = (
        <span class="custom-tree-node">
          <span class="process_01"></span>
          <span class="text">{node.label}</span>
        </span>
      );
      const dom2 = (
        <span class="custom-tree-node">
          <span class="process_02"></span>
          <span class="text">{node.label}</span>
        </span>
      );
      if (data.pid) {
        return dom2;
      }
      return dom1;
    },
    handlerNodeClick(data) {
      if (data.isVisible === '0') {
        let ref = this.controlTree ? 'treeFilter' : 'tree'
        this.$refs[ref].setCurrentKey(this.modelid)
        return
      }
      this.modelid = data.id
      this.$emit("click_", data);
    },
    filterTree() {
      if (!this.keyWords) {
        this.controlTree = false;
        return false;
      }
      searchProcessIframeTree1({
        name: this.keyWords,
        moduletype: 'rulecommunity',
        id: this.grandParentId.length > 0 ? this.grandParentId[0] : ''
      }).then((res) => {
        this.controlTree = true;
        this.treelist = res;
      });
      // searchProcessIframeTree({
      //   name: this.keyWords,
      // }).then((res) => {
      //   console.log(res,'res')
      //   this.controlTree = true;
      //   this.treelist = res;
      // });
      // searchProcessIframeTreeNew(this.keyWords).then((res) => {
      //   if (!res) return false;
      //   this.controlTree = true;
      //   this.treelist = res;
      // });
    },
  },
};
</script>

<style lang="scss" scoped>
.elTree{
  font-size: 13px;
}
.tree_wrapper {
  height: 100%;
}
.left_tree_wrapper {
  width: 100%;
  overflow: auto;
  font-size: 13px;
  /deep/ .el-tree-node__content {
    width: 100%;
  }
  /deep/ .el-tree-node > .el-tree-node__children {
    overflow: visible;
  }
  .green {
    color: green;
  }
  /deep/
    .el-tree-node.is-current
    > .el-tree-node__content
    .custom-tree-node
    .green {
    color: #2d42af;
  }
  /deep/ .el-tree-node.is-current > .el-tree-node__content .custom-tree-node {
    font-weight: 600;
    color: #2d42af;
  }
  /deep/ .custom-tree-node {
    color: #666;
  }
  .custom-tree-node.disabled, .custom-tree-node.disabled * {
    color: #bbb !important;
    font-weight: normal !important;
    cursor: not-allowed !important;
    background-color: transparent !important;
  }
}
</style>
