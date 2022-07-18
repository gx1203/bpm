<template>
  <div class="treeWrap">
    <el-tree
      class="elTree"
      v-if="!isMore"
      style="height:calc(100% - 28px);overflow: auto;"
      :props="props"
      :data="treeData"
      :load="loadNode"
      :expand-on-click-node="false"
      :default-expanded-keys="['1']"
      @node-click='handleClick'
      lazy
      node-key="id"
      ref="tree"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button v-if="data.leveltype !== '1'" @click.stop="add(data,$t('editNode'))" icon="el-icon-edit" :title="$t('editNode')" type="text"></el-button>
          <el-button
            @click.stop="add(data, $t('addNode'))"
            icon="el-icon-circle-plus"
            :title="$t('addNode')"
            type="text"
          ></el-button>
          <el-button
            @click.stop="del(data)"
            icon="el-icon-delete"
            v-if="data.leveltype !== '1'"
            :title="$t('delete')"
            type="text"
          ></el-button>
        </span>
      </span>
    </el-tree>
    <el-tree
      class="elTree"
      v-else
      style="height:calc(100% - 28px);overflow: auto;"
      :props="props"
      :data="treeData"
      :load="loadNode"
      :expand-on-click-node="false"
      :default-expanded-keys="['1']"
      @node-click='handleClick'
      lazy
      node-key="id"
      ref="tree"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span  class="padding-l15">
          <el-button v-if="data.leveltype !== '1'" @click.stop="add(data, $t('editNode'))" icon="el-icon-edit" :title="$t('editNode')" type="text"></el-button>
          <el-button
            @click.stop="add(data,$t('addNode'))"
            icon="el-icon-circle-plus"
            :title="$t('addNode')"
            type="text"
          ></el-button>
          <el-button
            @click.stop="del(data)"
            icon="el-icon-delete"
            v-if="data.leveltype !== '1'"
            :title="$t('delete')"
            type="text"
          ></el-button>
        </span>
        <span style="float: left; margin-top: 1px;">
          <el-radio
            v-model="radioNode"
            :label="data.id"
            :disabled="data.leveltype === '1'"
            @click="clickRadioNode($event)"
            @change="changeRadioNode(data)"
          >{{''}}</el-radio>
        </span>
      </span>
    </el-tree>
    <tree-collection-dialog
      v-model="dialogVisible"
      :title="linkTitle"
      :item="itemData"
      @confirm="refTree"
    />
  </div>
</template>

<script>
import {
  getCollectionTree,
  deleteCollection,
  saveTree,
  getSubTree
} from "@/bpm/api/staging/personal/collection.js";
import treeCollectionDialog from "./treeCollectionDialog";

export default {
  components: {
    treeCollectionDialog
  },
  data() {
    return {
      dialogVisible: false,
      checkDataIds: [],
      isFilter: true,
      itemData: {},
      linkTitle: "",
      props: {
        label: "subject"
      },
      treeData: [],
      orgAllList: [],
      radioNode: "",
      organizeItem: {}
    };
  },
  props: {
    value: {
      type: Boolean
    },
    isMore: {
      type: Boolean
    }
  },
  mounted() {
    this.getCollectionTree();
  },
  methods: {
    handleClick(data) {
      this.$emit('confirm', data)
    },
    refNode(item) {
      let node = this.$refs.tree.getNode(item.pid); // 通过节点id找到对应树节点对象
      node.loaded = false;
      node.expand(); // 主动调用展开节点方法，重新查询该节点下的所有子节点
    },
    refTree(data) {
      let node = this.$refs.tree.getNode(this.itemData.id); // 通过节点id找到对应树节点对象
      data.pid = node.data.id;
      if (this.linkTitle === this.$t('editNode')) {
        this.$set(node.data, "subject", data.subject);
      } else {
        data.pid = this.itemData.id
        this.refNode(data);
      }
    },
    add(item, data) {
      this.linkTitle = data;
      this.itemData = Object.assign({}, item);
      this.dialogVisible = true;
    },
    del(item, data) {
      this.$confirm(this.$t('hintText.areYouSureYouWantToDeleteCurrentNode'), this.$t('hintText.hint'), {
        type: "warning"
      })
        .then(() => {
          deleteCollection(item.id).then(rt => {
            if (rt.status === "200") {
              this.refNode(item);
              this.$message.success(this.$t('hintText.successfullyDelete'));
            }
          });
        })
        .catch(_ => {});
    },
    clickRadioNode(event) {
      if (event) event.preventDefault();
    },
    changeRadioNode(data) {
      this.$emit('changeRadio', data)
    },
    close(i) {
      this.organizeItem = {};
      this.radioNode = "";
    },
    getCollectionTree() {
      getCollectionTree()
        .then(rt => {
          rt.data = [rt.data];
          rt.data.forEach(item => {
            item.disabled = item.type === "1";
          });
          this.treeData = rt.data;
        })
        .catch(er => {
          console.log(er);
        });
    },
    loadNode(node, resolve) {
      if (node.level > 0) {
        getSubTree(node.data.id)
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
      if (this.isMore) {
        this.$emit("confirm");
      } else {
        this.$emit("confirm", this.organizeItem);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.checkList {
  color: #ffffff;
  background: #3792d8;
  display: inline-block;
  padding: 5px 10px;
}
</style>
