<template>
  <div class="treeWrap" style="margin-top: 10px;">
    <div id="treePosition">
      <el-input clearable :placeholder="$t('placeholderText.enterKeywordsFiltering')" v-model="filterText"></el-input>&nbsp;
      <el-tree
        class="elTree"
        v-if="isFilter"
        :props="props"
        :data="treeData"
        :load="loadNode"
        :expand-on-click-node="false"
        lazy
        node-key="id"
        @node-click="handleClick"
        key="1"
        :check-strictly="true"
        ref="tree"
        style="height:calc(100% - 28px);overflow: auto;"
      >
        <span class="custom-tree-node" slot-scope="{ node, data}">
          <span>{{ node.label }}</span>
          <span>
            <el-button @click.stop="add(data, node,'编辑节点')" icon="el-icon-edit" :title="$t('editNode')" type="text"></el-button>
            <el-button
              @click.stop="add(data, node,'增加节点')"
              icon="el-icon-circle-plus"
              title="增加节点"
              type="text"
            ></el-button>
            <el-button v-if="data.id !== '1'" @click.stop="del(data)" icon="el-icon-delete" :title="$t('delete')" type="text"></el-button>
          </span>
        </span>
      </el-tree>
      <el-tree
        class="elTree"
        v-else
        style="max-height:500px;overflow: auto;"
        :props="props"
        :data="treeData"
        :expand-on-click-node="false"
        node-key="id"
        key="2"
        @node-click="handleClick"
        default-expand-all
        :check-strictly="true"
        ref="tree"
      >
         <span class="custom-tree-node" slot-scope="{ node, data}">
        <span>{{ node.label }}</span>
        <span>
          <el-button @click.stop="add(data, node,'编辑节点')" icon="el-icon-edit" :title="$t('editNode')" type="text"></el-button>
          <el-button
            @click.stop="add(data, node,'增加节点')"
            icon="el-icon-circle-plus"
            title="增加节点"
            type="text"
          ></el-button>
          <el-button v-if="data.id !== '1'" @click.stop="del(data)" icon="el-icon-delete" :title="$t('delete')" type="text"></el-button>
        </span>
        </span>
      </el-tree>
    </div>
    <tree-position-dialog
      v-model="dialogVisible"
      :title="linkTitle"
      :item="itemData"
      @confirm="refTree"
    />
  </div>
</template>

<script>
import {
  getAllRootTree,
  getChildren,
  queryTree,
  deleteTree
} from "@/bpm/api/configManage/institutionalFramework/position_manage.js";
import treePositionDialog from "./treePositionDialog";

export default {
  components: {
    treePositionDialog
  },
  data() {
    return {
      dialogVisible: false,
      checkDataIds: [],
      isFilter: true,
      itemData: {},
      filterText: '',
      linkTitle: "",
      props: {
        label: "name",
        children: 'subNodes'
      },
      treeData: [],
      selectNode: {},
      orgAllList: []
    };
  },
  props: {
    value: {
      type: Boolean
    }
  },
  watch: {
    filterText(val) {
      this.filterFun();
    }
  },
  mounted() {
    this.getJobTree();
  },
  methods: {
    filterFun() {
      if (this.filterText) {
        queryTree(this.filterText)
          .then(rt => {
            this.treeData = rt.data;
            this.isFilter = false;
          })
          .catch(er => {});
      } else {
        this.isFilter = true;
        this.getJobTree();
      }
    },
    handleClick(data, node) {
      this.selectNode = node
      this.$emit("confirm", data);
    },
    refNode(item) {
      if (item.pid) {
        let node = this.$refs.tree.getNode(item.pid); // 通过节点id找到对应树节点对象
        node.loaded = false;
        node.expand(); // 主动调用展开节点方法，重新查询该节点下的所有子节点
      } else {
        this.getJobTree()
      }
    },
    refTree(data) {
      let node = this.$refs.tree.getNode(this.itemData.id); // 通过节点id找到对应树节点对象
      data.pid = node.data.id;
      if (this.linkTitle === "编辑节点") {
        this.$set(node.data, "name", data.name);
      } else {
        data.pid = this.itemData.id;
        this.refNode(data);
      }
    },
    add(item, node, data) {
      console.log(node)
      this.linkTitle = data;
      this.itemData = Object.assign({}, item);
      this.dialogVisible = true;
    },
    del(item, data) {
      this.$confirm("您确定要删除当前节点吗?", this.$t('hintText.hint'), {
        type: "warning"
      })
        .then(() => {
          deleteTree(item.id).then(rt => {
            if (rt.status === "200") {
              this.$message.success(this.$t('hintText.successfullyDelete'));
              this.refNode(item);
              this.$emit("deleteSuccess");
            }
          });
        })
        .catch(_ => {});
    },
    getJobTree() {
      let than = this;
      getAllRootTree()
        .then(rt => {
          than.treeData = rt.data;
        })
        .catch(er => {
          console.log(er);
        });
    },
    loadNode(node, resolve) {
      if (node.level > 0) {
        getChildren(node.data.id)
          .then(rt => {
            resolve(rt.data);
          })
          .catch(er => {
            console.log(er);
          });
      }
    },
    confirm() {
      this.dialogVisible = false;
      this.$emit("confirm");
    },
    treeRefresh () {
      this.selectNode.loaded = false
      this.selectNode.expand()
    }
  }
};
</script>
<style lang="scss">
#treePosition {
  .el-input__inner {
    border: none;
    border-bottom: 1px solid $dc1;
  }
}
</style>
