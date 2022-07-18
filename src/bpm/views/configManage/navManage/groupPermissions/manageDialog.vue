<template>
  <el-dialog :title="$t('editFunctionItemList')" :visible.sync="dialogVisible" append-to-body>
    <el-row>
      <el-col :span="12">
        <el-input clearable :placeholder="$t('placeholderText.enterKeywordsFiltering')" v-model="filterText"></el-input>
        <div class="treeWrap" style="margin-top: 10px;">
          <el-tree class="elTree"
            style="height: 300px; overflow: auto;"
            :props="props"
            :data="treeData"
            show-checkbox
            :load="loadNode"
            lazy
            node-key="ID"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            ref="tree"
          >
            <span class="custom-tree-node" slot-scope="{ node }">
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit()">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  getNavigationList,
  getChildByPid
} from "@/bpm/api/configManage/components/treeRouter";
export default {
  data() {
    return {
      dialogVisible: this.value,
      checkedData: "",
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
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
      this.getDepartment();
    },
    dialogVisible(val) {
      this.$emit("input", val);
    },
     filterText(val) {
      this.$refs.tree.filter(val);
    }
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
    submit() {
      this.$emit("confirm", this.checkedData);
    },
    cancel() {
      this.dialogVisible = false;
    },
    handleNodeClick(data) {
      this.checkedData = data;
    }
  },
  mounted() {}
};
</script>

<style scoped>
.content {
  height: 50vh;
  width: 60%;
  margin: 0 auto;
  overflow: auto;
}
</style>
