<template>
  <div id="treeOrganization">
    <el-input
      :placeholder="$t('orgName') + '、' + $t('orgCode')"
      clearable
      maxlength="20"
      v-model="filterText"
      style="width: 100%"
    >
    </el-input>
    <div class="treeWrap" style="margin-top: 10px">
      <el-tree
        class="elTree"
        v-if="isFilter"
        style="height: calc(100% - 28px); overflow: auto"
        :props="props"
        :data="treeData"
        :load="loadNode"
        :expand-on-click-node="false"
        lazy
        key="0"
        node-key="id"
        @node-click="handleClick"
        ref="tree"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <i v-if="data.type === '0'"></i>
          <i v-else-if="data.type === '1'" class="iconfont icon-gongsi"></i>
          <i v-else-if="data.type === '2'" class="iconfont icon-bumen"></i>
          <i v-else-if="data.type === '3'" class="iconfont icon-drxx12"></i>
          <i v-else class="iconfont icon-bumen"></i>
          <span>{{ node.label }}</span>
          <div class="exportbox" v-if="useexport" title="导出" @click="Suk_export(node, data)">
            <!-- <p class="export">{{ $t("export") }}</p> -->
            <i class="el-icon-upload eicon"></i>
          </div>
        </span>
      </el-tree>
      <el-tree
        class="elTree"
        v-else
        style="height: calc(100% - 28px); overflow: auto"
        :props="props"
        :data="treeData"
        :expand-on-click-node="false"
        key="1"
        node-key="id"
        default-expand-all
        @node-click="handleClick"
        ref="tree"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <i v-if="data.type === '0'"></i>
          <i v-else-if="data.type === '1'" class="iconfont icon-gongsi"></i>
          <i v-else-if="data.type === '2'" class="iconfont icon-bumen"></i>
          <i v-else-if="data.type === '3'" class="iconfont icon-drxx12"></i>
          <i v-else class="iconfont icon-bumen"></i>
          <span>{{ node.label }}</span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
import {
  getAllRootTree,
  getChildren,
  searchQueryTree,
} from "@/bpm/api/configManage/institutionalFramework/organization.js";
import axios from "axios";

export default {
  data() {
    return {
      props: {
        label: "name",
        // isLeaf: "isParent",
        isLeaf: function (data, node) {
          if (data.parent) {
            return false
          } else {
            return true
          }
        },
        children: "subNodes",
      },
      isFilter: true,
      treeData: [],
      filterText: "",
      radioNode: "",
      organizeItem: {},
    };
  },
  props: {
    useexport:{
      type:Boolean,
      default:false
    },
    isMore: {
      type: String,
    },
    type: {
      type: String,
      default: "4",
    },
  },
  watch: {
    filterText(val) {
      this.filterFun();
    },
  },
  mounted() {
    this.filterText = "";
    this.getDepartment();
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL;
    },
  },
  methods: {
    // 导出
    Suk_export(node, data) {
      axios({
        method: "post",
        url: `${this.host}/postProcess/exportOrg/${data.id}`,
        data: {},
        responseType: "blob",
        timeout: 60000000,
      })
        .then((res) => {
          const blob = new Blob([res.data], {
            type: "application/vnd.ms-excel",
          });
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // 兼容TMD IE
            navigator.msSaveBlob(blob, this.downloadName);
          } else {
            // 其他浏览器
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.style.display = "none";
            link.href = url;
            link.setAttribute("download", '九彩云BPM岗位节点匹配');
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(link.href);
          }
        })
        .catch(() => {
          this.exportLoading = false;
        });
      // this.$loading()
      // exportOrg({
      //   orgId: this.treeData.id || '',
      // }).then(rt => {
      //   this.$loading().close()
      //   this.isLoadData = true
      // }).catch(() => {
      //   this.$loading().close()
      // })
    },
    filterFun() {
      if (this.filterText) {
        searchQueryTree(this.filterText)
          .then((rt) => {
            this.treeData = rt.data;
            this.isFilter = false;
          })
          .catch((er) => {});
      } else {
        this.isFilter = true;
        this.getDepartment();
      }
    },
    handleClick(data) {
      this.$emit("confirm", data);
    },
    getDepartment() {
      getAllRootTree()
        .then((rt) => {
          rt.data.forEach((item) => {
            item.NAME = item.name;
            item.ID = item.id;
            item.TYPE = item.type;
          });
          this.treeData = rt.data;
        })
        .catch((er) => {
          console.log(er);
        });
    },
    toBoolean(val) {
      switch (val.toLowerCase()) {
        case "true":
        case 1:
        case "yes":
          return true;
        case "false":
        case 0:
        case "no":
        case null:
          return false;
        default:
          return Boolean(val);
      }
    },
    loadNode(node, resolve) {
      if (node.level > 0) {
        getChildren(node.data.ID)
          .then((rt) => {
            let _list = [];
            rt.data.forEach((item) => {
              item.NAME = item.name;
              item.ID = item.id;
              item.TYPE = item.type;
              if (item.type <= this.type) {
                _list.push(item);
              }
            });
            resolve(_list);
          })
          .catch((er) => {
            console.log(er);
          });
      }
    },
  },
};
</script>
<style lang="scss">
#treeOrganization {
  .el-input__inner {
    border: none;
    border-bottom: 1px solid $dc1;
  }
  .elTree{
    font-size: 13px;
    /deep/ .el-tree-node.is-current > .el-tree-node__content .custom-tree-node {
      font-weight: 600;
      color: #2d42af;
    }
    /deep/ .custom-tree-node {
      color: #666;
    }
  }
}
</style>

<style lang="scss" scoped>
.exportbox {
  display: inline-block;
  margin-left: 5px;
  .eicon {
  }
}
.export {
  font-weight: 600;
  margin-left: 5px;
  display: inline-block;
  margin-right: 5px;
}
.exportbox:hover {
  color: #409eff;
}
</style>
