<template>
  <div id="treeOrganization">
    <el-input clearable :placeholder="$t('placeholderText.enterKeywordsFiltering')" v-model="filterText"></el-input>
    <div class="treeWrap" style="margin-top: 10px;">
      <el-tree class="elTree"
        style="height: 300px; overflow: auto;"
        :props="props"
        :data="treeData"
        :load="loadNode"
        lazy
        node-key="ID"
        @node-click="handleClick"
        :filter-node-method="filterNode"
        ref="tree"
      >
        <span class="custom-tree-node" slot-scope="{ node }">
          <span>{{ node.label }}</span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
import {
  getNavigationList,
  getChildByPid
} from "@/bpm/api/configManage/components/treeRouter";
export default {
  data() {
    return {
      id: 14246,
      props: {
        label: "name",
        isLeaf: "parent"
      },
      treeData: [],
      filterText: ""
    };
  },
  props: {
    isMore: {
      type: Boolean
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.getDepartment();
  },
  methods: {
    clickRadioNode(event) {
      if (event) event.preventDefault();
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    getDepartment() {
      getNavigationList()
        .then(rt => {
          rt.data.forEach(item => {
            item.parent = !item.parent;
          });
          this.treeData = rt.data;
        })
        .catch(er => {
          console.log(er);
        });
    },
    loadNode(node, resolve) {
      if (node.level > 0) {
        getChildByPid(node.data.id)
          .then(rt => {
            rt.data.forEach(item => {
              item.parent = !item.parent;
            });
            resolve(rt.data);
          })
          .catch(er => {
            console.log(er);
          });
      }
    },
    handleClick(data) {
      this.$emit("confirm", data);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
