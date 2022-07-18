<template>
  <div id="groupManage">
    <!--<el-row :gutter="20" class="group_container">-->
    <!--<el-col :span="24" class="tree_wrap">-->
    <!--<el-row>-->
    <!--<el-input placeholder="请输入内容" class="search_component remove-margin-b" v-model="filterText" clearable @keyup.13.native="abstractSearch">-->
    <!--<el-button type="primary" @click="abstractSearch" slot="append">搜索</el-button>-->
    <!--</el-input>-->
    <!--</el-row>-->
    <el-tree
      v-if="!isSearch"
      ref="asyncTree"
      :props="props"
      :is-leaf="isLeaf"
      node-key="id"
      :load="getFilterTreeList"
      :default-expanded-keys="expandedList"
      :expand-on-click-node="false"
      lazy
    >
      <div slot-scope="{ node, data }" class="custom-tree-node">
        <p class="grow" :title="node.label" @click="nodeClick(node, data)">
          {{ node.label }}
        </p>
        <!-- <p v-if="node.level == 1 || node.level == 2" class="grow" :title="node.label" @click="nodeClick(node, data)">
          {{ node.label }}
        </p>
        <p v-else class="grow" :title="node.label" @click="nodeClick(node, data)">
          {{ node.data.code + node.label }}
        </p> -->
        <p class="font14 opertionBtn">
          <el-tooltip
            :open-delay="1000"
            class="item"
            effect="dark"
            :content="$t('add')"
            placement="top"
          >
            <i
              class="el-icon-circle-plus-outline add"
              @click="handlerTreeOperate('add', data, node)"
            />
          </el-tooltip>
          <el-tooltip
            :open-delay="1000"
            class="item"
            effect="dark"
            :content="$t('modify')"
            placement="top"
          >
            <i
              v-if="node.level !== 1"
              class="el-icon-edit add"
              @click="handlerTreeOperate('edit', data, node)"
            />
          </el-tooltip>
          <el-tooltip
            :open-delay="1000"
            class="item"
            effect="dark"
            :content="$t('delete')"
            placement="top"
          >
            <i
              v-if="node.level !== 1"
              class="el-icon-delete del"
              @click="handlerTreeOperate('del', data, node)"
            />
          </el-tooltip>
        </p>
      </div>
    </el-tree>
    <el-tree
      v-if="isSearch"
      :props="props"
      :is-leaf="isLeaf"
      node-key="id"
      :data="treeData"
      :default-expanded-keys="expandedList"
      :expand-on-click-node="false"
      lazy
    >
      <div slot-scope="{ node, data }" class="custom-tree-node">
        <p class="grow" :title="node.label" @click="nodeClick(node, data)">
          {{ node.label }}
        </p>
        <p class="font14 opertionBtn">
          <i
            class="el-icon-circle-plus-outline add"
            @click.stop="handlerTreeOperate('add', data, node)"
          />
          <i
            v-if="node.level !== 1"
            class="el-icon-edit add"
            @click="handlerTreeOperate('edit', data, node)"
          />
          <i
            v-if="node.level !== 1"
            class="el-icon-delete del"
            @click="handlerTreeOperate('del', data, node)"
          />
        </p>
      </div>
    </el-tree>
    <!--</el-col>-->
    <!--</el-row>-->

    <!-- 添加或删除组织树 -->
    <el-dialog
      :title="type == 'add' ? $t('add') : $t('modify')"
      :visible.sync="isDialogsVisible"
      width="40%"
    >
      <el-form
        ref="orgRef"
        label-width="120px"
        label-position="right"
        :model="orgForm"
        :rules="rules"
      >
        <el-form-item :label="$t('name')" prop="name">
          <el-input v-model="orgForm.name" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialogsVisible = false">{{
          $t("cancel")
        }}</el-button>
        <el-button type="primary" @click="handlerConfirm">{{
          $t("confirm")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getRuleIframeTree,
  queryEnterpriseStandardFolderTreeId,
} from "@/bpa/api/rulesCenter/handbookFiles";
import {
  saveTreeInfo,
  delTreeInfo,
  getNodeCode,
} from "@/bpa/api/settings/ruleManage";
import {
  queryRepositoryDocFolderTreeId,
  foldertree,
  foldertreeSaveCopy,
  foldertreeDeleteCopy,
  getCountByfolderid,
} from "@/bpa/api/resourcelibraryCenter";
export default {
  data() {
    return {
      type: "add",
      treeData: [],
      isSearch: false,
      filterText: "",
      expandedList: ["7"],
      orgid: "",
      props: {
        label: "foldername",
        children: "childList",
        isLeaf: function (data, node) {
          if (data.parent) {
            return false;
          } else {
            return true;
          }
        },
      },
      isDialogsVisible: false,
      orgForm: { name: "", code: "" },
      rules: {
        name: [{ required: true, message: " ", trigger: "blur" }],
      },
      parentId: "",
    };
  },
  mounted() {},
  methods: {
    async getFilterTreeList(node, resolve) {
      console.log(node);
      // let response
      // if (!node.data) {
      //   response = await queryEnterpriseStandardFolderTreeId()
      // }
      const id = node.data ? node.data.id : "3";
      foldertree(id).then((res) => {
        if (!res) return false;
        if (id === "0") {
          this.$emit("conClick", {
            node: node,
            data: res[0],
          });
          this.expandedList = [res[0].id];
          console.log("this.expandedList", this.expandedList);
        }

        resolve(res);
      });
    },
    abstractSearch() {
      if (this.filterText) {
        this.isSearch = true;
        // abstractSearch({orgname: this.filterText}).then(res => {
        //   this.treeData = res
        // })
      } else {
        this.isSearch = false;
      }
    },
    isLeaf(data, node) {
      console.log(data);
      console.log(node);
    },
    nodeClick(node, data) {
      this.$emit("conClick", {
        node: node,
        data: data,
      });
    },
    handlerTreeOperate(type, data, node) {
      const me = this;
      console.log(type);
      console.log(node);
      console.log(data);
      this.orgForm = {};
      this.type = type;
      if (type === "add") {
        if (data.id !== "5") {
          getNodeCode(data.id).then((res) => {
            if (!res) return false;
            this.$set(this.orgForm, "code", res);
          });
        }
        this.orgForm = Object.assign({}, this.orgForm, {
          pid: !data.id ? "" : data.id,
        });
        this.isDialogsVisible = true;
      } else if (type === "edit") {
        this.isDialogsVisible = true;
        this.orgForm = Object.assign({}, this.orgForm, {
          id: data.id,
          name: data.foldername,
          code: data.code,
          pid: !node.parent.data ? "" : node.parent.data.id,
        });
      } else {
        getCountByfolderid(data.id).then((res) => {
          if (res > 0) {
            this.$message({
              type: "warning",
              message: this.$t("hintText.fallhave"),
            });
          } else {
            const parentid = node.parent.data.id;
            this.$confirm(
              this.$t("hintText.areYouSureDelete"),
              this.$t("hintText.hint"),
              {
                confirmButtonText: this.$t("confirm"),
                cancelButtonText: this.$t("cancel"),
                type: "warning",
              }
            ).then(() => {
              foldertreeDeleteCopy(data.id).then((res) => {
                if (!res) return false;
                this.$message({
                  type: "success",
                  message: this.$t("hintText.successfullyDelete"),
                });
                const node = this.$refs.asyncTree.getNode(parentid); // 通过节点id找到对应树节点对象
                node.loaded = false;
                node.expand();
              });
            });
          }
        });
      }
    },
    handlerConfirm() {
      this.$refs.orgRef.validate((valid) => {
        if (valid) {
          foldertreeSaveCopy({
            id: !this.orgForm.id ? "" : this.orgForm.id,
            foldername: !this.orgForm.name ? "" : this.orgForm.name,
            pid: !this.orgForm.pid ? "" : this.orgForm.pid,
            // code: !this.orgForm.code ? '' : this.orgForm.code
          }).then((res) => {
            if (!res) return false;
            this.$message({
              type: "success",
              message: !this.orgForm.id
                ? this.$t("hintText.addedSuccess")
                : this.$t("hintText.modifyTheSuccess"),
            });
            this.isDialogsVisible = false;
            if (!this.orgForm.pid) return false;
            const node = this.$refs.asyncTree.getNode(this.orgForm.pid); // 通过节点id找到对应树节点对象
            node.loaded = false;
            node.expand();
            this.$emit("edit");
          });
        } else {
          this.$message({
            type: "warning",
            message: this.$t("hintText.requiredFieldsCannotBeEmpty"),
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-tree-node > .el-tree-node__children {
  overflow: visible;
}
.custom-tree-node {
  height: 100%;
  position: relative;
  max-width: 200px;
  .opertionBtn {
    position: absolute;
    right: 30px;
    top: 0;
    bottom: 0;
    min-width: 50px;
    display: flex;
    // display: none;
    opacity: 0;
    justify-content: space-between;
    align-items: center;
    i {
      display: inline-block;
      height: 14px;
      padding: 0;
      margin: 0;
      &:hover {
        background: none;
        font-weight: bold;
      }
    }
  }
  &:hover {
    .opertionBtn {
      // display: flex;
      opacity: 1;
    }
  }
}

.custom-tree-node {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  .grow {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 90px;
  }
  .add {
    color: $tc5;
    padding: 5px;
    display: none;
    &:hover {
      background: $dc1;
    }
  }
  .del {
    color: $tc4;
    padding: 5px;
    display: none;
    &:hover {
      background: $dc1;
    }
  }
  &:hover {
    .add {
      display: inherit;
    }
    .del {
      display: inherit;
    }
  }
}
#groupManage {
  .tree_node {
    height: 380px;
  }
  .right-content {
    height: calc(100vh - 160px);
    .el-scrollbar__wrap {
      height: 100%;
    }
    .el-scrollbar__view {
      height: 100%;
    }
  }
  .tree_node {
    height: calc(100vh - 190px) !important;
  }
}
</style>
