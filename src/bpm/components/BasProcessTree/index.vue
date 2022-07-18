<template>
  <div id="processTree">
    <el-row v-if="filterType === 'button'">
      <el-input
        :placeholder="$t('basProcessTree.enterKeywordsFiltering')"
        class="search_component remove-margin-b"
        v-model="filterText"
        clearable
        @keyup.13.native="filterTree"
      >
        <el-button slot="append" @click.stop="filterTree">
          {{ $t("search") }}
        </el-button>
      </el-input>
    </el-row>
    <el-input
      v-else
      class="filter-input"
      clearable
      :placeholder="$t('basProcessTree.enterKeywordsFiltering')"
      v-model="filterText"
    >
    </el-input>
    <div class="treeWrap" style="margin-top: 10px">
      <div v-if="showView === '1'">
        <el-tree
          class="elTree"
          :props="props"
          :data="treeData"
          :expand-on-click-node="false"
          node-key="id"
          @node-click="handleClick"
          @node-expand="handleExpand"
          :filter-node-method="filterNode"
          ref="tree"
        >
          <div class="custom-tree-node" slot-scope="{ node, data }">
            <i class="iconfont icon-moxing___" v-if="data.type === '0'"></i>
            <i v-else-if="data.type === '1'" class="iconfont icon-liucheng"></i>
            <i
              v-else-if="data.type === '2'"
              class="iconfont icon-jiedianbangzhu"
            ></i>
            <i v-else class="iconfont icon-baocunbuju"></i>
            <span :title="node.label + '(' + data.num + ')'" v-if="isShowNum"
              >{{ node.label }}({{ data.num }})</span
            >
            <span :title="node.label" v-else>{{ node.label }}</span>
            <span v-if="isEdit">
              <el-button
                icon="el-icon-edit"
                :title="$t('basProcessTree.editNode')"
                type="text"
                @click.stop="add(data, $t('basProcessTree.editNode'))"
              />
              <!-- <el-button v-show="!isBpa" v-if="data.grade < 4" icon="el-icon-circle-plus"
              :title="$t('basProcessTree.addChildNode')" type="text"
              @click.stop="add(data,$t('basProcessTree.addChildNode'))" /> -->
              <el-button
                v-show="!isBpa"
                v-if="data.pid != 0"
                icon="el-icon-delete"
                :title="$t('basProcessTree.deleteCurrentNode')"
                type="text"
                @click.stop="handleDelete(data)"
              />
            </span>
            <div class="processVersion" v-if="data.type === '1' && isVersion">
              <el-dropdown
                class="international"
                @command="handleSetVersion($event, data)"
              >
                <span class="el-dropdown-link">
                  <span>{{ data.showVersion }}</span>
                  <i class="el-icon-arrow-down" />
                </span>
                <el-dropdown-menu class="dropdownMenu" slot="dropdown">
                  <el-dropdown-item
                    v-for="item in data.versionList || []"
                    :key="item.id"
                    :disabled="data.showVersion === item.version"
                    :command="item"
                    style="font-size: 12px"
                    >{{ item.version }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </el-tree>
      </div>
      <div v-if="showView === '2'">
        <el-tree
          class="elTree"
          :props="props"
          :data="treeData"
          :expand-on-click-node="false"
          node-key="id"
          @node-click="handleClick"
          @node-expand="handleExpand"
          :load="loadNode"
          :filter-node-method="filterNode"
          :default-expanded-keys="defaultKeys"
          v-show="treeShow"
          lazy
          ref="tree"
          key="1"
        >
          <div class="custom-tree-node" slot-scope="{ node, data }">
            <i class="iconfont icon-moxing___" v-if="data.type === '0'"></i>
            <i v-else-if="data.type === '1'" class="iconfont icon-liucheng"></i>
            <i
              v-else-if="data.type === '2'"
              class="iconfont icon-jiedianbangzhu"
            ></i>
            <i v-else class="iconfont icon-baocunbuju"></i>
            <span :title="node.label + '(' + data.num + ')'" v-if="isShowNum"
              >{{ node.label }}({{ data.num }})</span
            >
            <span :title="node.label" v-else>{{ node.label }}</span>
            <span v-if="isEdit">
              <el-button
                icon="el-icon-edit"
                :title="$t('basProcessTree.editNode')"
                type="text"
                @click.stop="add(data, $t('basProcessTree.editNode'))"
              />
              <el-button
                v-show="!isBpa"
                v-if="data.pid != 0"
                icon="el-icon-delete"
                :title="$t('basProcessTree.deleteCurrentNode')"
                type="text"
                @click.stop="handleDelete(data)"
              />
            </span>
            <div class="processVersion" v-if="data.type === '1' && isVersion">
              <el-dropdown
                class="international"
                @command="handleSetVersion($event, data)"
              >
                <span class="el-dropdown-link">
                  <span>{{ data.showVersion }}</span>
                  <i class="el-icon-arrow-down" />
                </span>
                <el-dropdown-menu class="dropdownMenu" slot="dropdown">
                  <el-dropdown-item
                    v-for="item in data.versionList || []"
                    :key="item.id"
                    :disabled="data.showVersion === item.version"
                    :command="item"
                    style="font-size: 12px"
                    >{{ item.version }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        
        
        </el-tree>
        <el-tree
          class="elTree"
          :props="props"
          :data="treeData"
          :expand-on-click-node="false"
          node-key="id"
          @node-click="handleClick"
          @node-expand="handleExpand"
          :filter-node-method="filterNode"
          :default-expanded-keys="defaultKeys"
          v-show="!treeShow"
          lazy
          ref="tree"
        >
          <div class="custom-tree-node" slot-scope="{ node, data }">
            <i class="iconfont icon-moxing___" v-if="data.type === '0'"></i>
            <i v-else-if="data.type === '1'" class="iconfont icon-liucheng"></i>
            <i
              v-else-if="data.type === '2'"
              class="iconfont icon-jiedianbangzhu"
            ></i>
            <i v-else class="iconfont icon-baocunbuju"></i>
            <span :title="node.label + '(' + data.num + ')'" v-if="isShowNum"
              >{{ node.label }}({{ data.num }})</span
            >
            <span :title="node.label" v-else>{{ node.label }}</span>
            <span v-if="isEdit">
              <el-button
                icon="el-icon-edit"
                :title="$t('basProcessTree.editNode')"
                type="text"
                @click.stop="add(data, $t('basProcessTree.editNode'))"
              />
              <el-button
                v-show="!isBpa"
                v-if="data.pid != 0"
                icon="el-icon-delete"
                :title="$t('basProcessTree.deleteCurrentNode')"
                type="text"
                @click.stop="handleDelete(data)"
              />
            </span>
            <div class="processVersion" v-if="data.type === '1' && isVersion">
              <el-dropdown
                class="international"
                @command="handleSetVersion($event, data)"
              >
                <span class="el-dropdown-link">
                  <span>{{ data.showVersion }}</span>
                  <i class="el-icon-arrow-down" />
                </span>
                <el-dropdown-menu class="dropdownMenu" slot="dropdown">
                  <el-dropdown-item
                    v-for="item in data.versionList || []"
                    :key="item.id"
                    :disabled="data.showVersion === item.version"
                    :command="item"
                    style="font-size: 12px"
                    >{{ item.version }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </el-tree>
      </div>
      <div v-if="showView === '3'">
        <el-tree
          class="elTree"
          ref="tree"
          :props="props"
          :data="treeData"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          node-key="id"
          @node-click="handleClick"
        >
          <div slot-scope="{ node, data }" class="custom-tree-node">
            <i v-if="data.type === '0'" class="iconfont icon-moxing___" />
            <i v-else-if="data.type === '1'" class="iconfont icon-liucheng" />
            <i
              v-else-if="data.type === '2'"
              class="iconfont icon-jiedianbangzhu"
            />
            <i v-else class="iconfont icon-baocunbuju" />
            <span :title="data.modelname + '(' + data.num + ')'"
              >{{ data.modelname }}({{ data.num }})</span
            >
            <div class="processVersion" v-if="data.type === '1' && isVersion">
              <el-dropdown
                class="international"
                @command="handleSetVersion($event, data)"
              >
                <span class="el-dropdown-link">
                  <span>{{ data.showVersion }}</span>
                  <i class="el-icon-arrow-down" />
                </span>
                <el-dropdown-menu class="dropdownMenu" slot="dropdown">
                  <el-dropdown-item
                    v-for="item in data.versionList || []"
                    :key="item.id"
                    :disabled="data.showVersion === item.version"
                    :command="item"
                    style="font-size: 12px"
                    >{{ item.version }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </el-tree>
      </div>
      <classify-handle-dialog
        v-model="dialogVisible"
        :title="linkTitle"
        :item="itemData"
        :urlSeting="urlSeting"
        @confirm="getDepartment"
      />
    </div>
  </div>
</template>

<script>
import classifyHandleDialog from "./classifyHandleDialog";
export default {
  name: "BasProcessTree",
  components: {
    classifyHandleDialog
  },
  props: {
    showView: {
      type: String,
      default: "2"
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    type: {
      type: String
    },
    isShowNum: {
      type: Boolean,
      default: false
    },
    pid: {
      type: String
    },
    isVersion: {
      type: Boolean,
      default: false
    },
    version: {
      type: String,
      default: ""
    },
    urlSeting: {
      type: Object,
      default() {
        return {
          // getModelTree: "/process/model/getAllTree",
          getModelTree: "/processModel/getBusinessRuleAllTree",
          getTreeChildren: "/processModel/getModelTree",
          deleteCategoryTree: "/process/model/delete/",
          diagramShowType: "businessrule/ruleconfig/diagram-show-type",
          saveCategoryTree: "/process/model/saveForBpa",
          getModelTreeNum: "/monitor/getModelTree",
          queryTree: "/process/model/queryTree/"
        };
      }
    },
    // 搜索框的类型: button
    filterType: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      dialogVisible: false,
      linkTitle: "",
      itemData: {},
      props: {
        label: "modelname",
        isLeaf: function(data) {
          return data.isParent !== "Y";
        }
      },
      treeData: [],
      selectNode: {},
      filterText: "",
      isBpa: false,
      defaultKeys: [],
      versionList: [],
      treeShow: true
    };
  },
  watch: {
    filterText() {
      if (this.filterType !== "button") {
        if (this.showView === "2" && !this.pid) {
          this.filterFun();
        } else {
          this.$refs.tree.filter(this.filterText);
        }
      }
    }
  },
  mounted() {
    if (this.$route.query.processname) {
      this.filterText = "财务";
    }
    if (this.pid) {
      this.queryPidTree();
    } else {
      this.getDepartment();
    }
  },
  methods: {
    filterTree() {
      if (this.showView === "2" && !this.pid) {
        this.filterFun();
      } else {
        this.$refs.tree.filter(this.filterText);
      }
    },
    handleExpand(data) {
      if (data.children && data.children.length > 0 && this.isVersion) {
        let processList = data.children.filter(item => item.type === "1");
        processList.forEach(item => {
          this.getVeriosn(item);
        });
      }
    },
    handleSetVersion(val, data) {
      this.$set(data, "version", val.isnewest === "Y" ? "" : val.version); // 最新版本需要传空
      this.$set(data, "showVersion", val.version);
      this.$set(data, "bpaVersion", val.bpaVersion);
      this.$refs.tree.setCurrentKey(data.id);
      const node = this.$refs.tree.getNode(data.id);
      node.loaded = false;
      node.expand();
      this.$emit("switchVersion", data);
    },
    getVeriosn(item) {
      this.loading = true;
      this.$http({
        url: `/bpm/processversion/quickQuery`,
        method: "POST",
        data: {
          logic: "and",
          filters: [
            {
              key: "processname",
              opt: "EQ",
              type: "S",
              value: item.processname
            },
            {
              key: "history",
              opt: "EQ",
              type: "S",
              value: "Y"
            }
          ],
          orderby: "version is null,version+0, createtime",
          pageNum: 1,
          pageSize: 100000
        }
      })
        .then(rt => {
          if (rt.data.list.length > 0) {
            this.$set(item, "versionList", rt.data.list || []);
            if (this.version) {
              this.$set(item, "version", this.version);
              this.$set(item, "showVersion", this.version);
            }
            if (!item.version) {
              let versionObj = item.versionList.find(
                val => val.isnewest === "Y"
              );
              this.$set(item, "version", ""); // 最新版本需要传空
              this.$set(item, "showVersion", versionObj.version); // 真实版本号，用于显示
              this.$set(item, "bpaVersion", versionObj.bpaVersion);
            }
          }
        })
        .catch(() => {});
    },
    queryPidTree() {
      let than = this;
      if (than.$http) {
        than
          .$http({
            url: `${than.urlSeting.getTreeChildren}`,
            method: "POST",
            data: {
              pid: this.pid
            }
          })
          .then(rt => {
            if (than.type) {
              than.treeData = than.convert(rt.data);
            } else {
              than.treeData = rt.data;
            }
            this.$nextTick(() => {
              if (than.treeData && than.treeData.length > 0 && than.isVersion) {
                this.getVeriosn(than.treeData[0]);
              }
            });
          })
          .catch(er => {
            console.log(er);
          });
      }
    },
    //组织树搜索
    filterFun() {
      let than = this;
      if (than.filterText) {
        this.defaultKeys = [];
        if (than.$http) {
          than
            .$http({
              url: than.urlSeting.queryTree + than.filterText,
              method: "get"
            })
            .then(rt => {
              this.defaultKeys = []
              than.treeData = rt.data;
              rt.data.forEach(element => {
                this.defaultKeys.push(element.id);
              });
              if (!this.filterText || this.filterText === '') {
                this.treeShow = false
              } else {
                this.treeShow = true
                this.setDefaultKeysList(than.treeData)
              }
            })
            .catch(er => {
              console.log(er);
            });
        }
      } else {
        this.defaultKeys = [];
        this.getDepartment();
      }
    },
    setDefaultKeysList (children) {
      if (children && children.length > 0) {
        children.forEach(element => {
          this.defaultKeys.push(element.id)
          this.setDefaultKeysList(element.children)
        });
      }
    },
    convert(arr) {
      // 根据type过滤
      const newArr = arr.filter(item => item.type < this.type);
      return newArr.map(item => {
        if (item.children) {
          item.children = this.convert(item.children);
        }
        return item;
      });
    },
    getDepartment() {
      let than = this;
      if (than.$http) {
        if (this.showView === "3") {
          than
            .$http({
              url: `${than.urlSeting.getModelTreeNum}`,
              method: "GET"
            })
            .then(rt => {
              if (than.type) {
                than.treeData = than.convert(rt.data);
              } else {
                than.treeData = rt.data;
              }
            })
            .catch(er => {
              console.log(er);
            });
        } else {
          than
            .$http({
              url: `${than.urlSeting.getModelTree}`,
              method: "GET"
            })
            .then(rt => {
              if (than.type) {
                than.treeData = than.convert(rt.data);
              } else {
                than.treeData = rt.data;
              }
            })
            .catch(er => {
              console.log(er);
            });
        }
        if (this.isEdit) {
          than
            .$http({
              url: `${than.urlSeting.diagramShowType}`,
              method: "get"
            })
            .then(rt => {
              this.isBpa = rt.data === "bpa";
            })
            .catch(er => {
              console.log(er);
            });
        }
      }
    },
    loadNode(node, resolve) {
      console.log(node);
      let than = this;
      if (node.level > 0) {
        if (node.data.children && node.data.children.length > 0) {
          resolve(node.data.children);
        } else {
          let num = "";
          if (
            (node.data.isProcess === "Y" || node.data.type > 0) &&
            than.type !== "0"
          ) {
            num = Number(node.data.type) + 1;
          } else {
            num = node.data.type;
          }
          if (than.$http) {
            than
              .$http({
                url: `${than.urlSeting.getTreeChildren}`,
                method: "POST",
                data: {
                  pid: node.data.id,
                  type: num,
                  version: node.data.version
                }
              })
              .then(rt => {
                rt.data.forEach(item => {
                  item.modelname = item.name;
                  // if (than.type === "0") {
                  //   // console.log(node.data.isProcess === 'Y')
                  //   //   if (item.isProcess === 'Y') {
                  //   //      item.isParent = true
                  //   //   }else{
                  //   //      item.isParent = false
                  //   //   }
                  // } else if (item.type === than.type) {
                  //   item.isParent = true;
                  // } else {
                  //   if (item.isParent === "Y") {
                  //     item.isParent = false;
                  //   } else {
                  //     item.isParent = true;
                  //   }
                  // }
                  if (item.type === than.type) {
                    item.isParent = "N";
                  }
                });
                let arr = [];
                if (than.type) {
                  arr = than.convert(rt.data);
                } else {
                  arr = rt.data;
                }
                resolve(arr);
              })
              .catch(er => {
                console.log(er);
              });
          }
        }
      }
    },
    clickRadioNode(event) {
      if (event) event.preventDefault();
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.modelname.indexOf(value) !== -1;
    },
    toBoolean(val) {
      switch (val.toLowerCase()) {
        case "y":
        case 1:
        case "yes":
          return true;
        case "n":
        case 0:
        case "no":
        case null:
          return false;
        default:
          return Boolean(val);
      }
    },
    add(item, data) {
      if (data === this.$t("basProcessTree.editNode")) {
        this.itemData = Object.assign({}, item);
      } else {
        this.itemData = {
          pid: item.id
        };
      }
      console.log(this.itemData);
      this.linkTitle = data;
      this.dialogVisible = true;
    },
    handleDelete(data) {
      this.$confirm(
        this.$t("basProcessTree.areYouSureDelete"),
        this.$t("basProcessTree.hint"),
        {
          type: "warning"
        }
      )
        .then(() => {
          let than = this;
          if (than.$http) {
            than
              .$http({
                url: than.urlSeting.deleteCategoryTree + data.id,
                method: "GET"
              })
              .then(rt => {
                if (rt.status === "200") {
                  than.$message({
                    message: than.$t("basProcessTree.successfullyDelete"),
                    type: "success"
                  });
                  than.getDepartment1();
                } else {
                  than.$message({
                    message: than.$t("basProcessTree.failToDelete"),
                    type: "error"
                  });
                }
              });
          }
        })
        .catch(_ => {});
    },
    handleClick(data, node) {
      data.name = data.modelname;
      let bpamodel = {};
      if (data.type === "1") {
        this.$set(bpamodel, "bpamodelid", node.parent.data.bpamodelid);
      }
      let datas = { ...bpamodel, ...data };
      console.log("datadata", datas);
      this.$emit("confirm", datas);
      this.selectNode = node;
      if (this.isMore) {
        console.log(this.$refs.tree.getCheckedNodes());
        this.$emit("confirm", this.$refs.tree.getCheckedNodes());
      }
    },
    treeRefresh() {
      this.selectNode.loaded = false;
      this.selectNode.expand();
    }
  }
};
</script>
<style lang="scss">
#processTree {
  .filter-input {
    .el-input__inner {
      border: none;
      border-bottom: 1px solid rgb(229, 229, 229);
    }
  }
}
</style>

<style lang="scss" scoped>
.search_component {
  margin-bottom: 15px;
  width: 100% !important;
  max-width: 240px;
  vertical-align: middle;
  /deep/ .el-input__inner {
    border: 1px solid #2d42af;
  }
  /deep/.el-input-group__append {
    background-color: #2d42af;
    border-color: #2d42af;
    &:hover {
      background-color: #5768bf;
      border-color: #5768bf;
    }
    span {
      color: #fff;
    }
  }
}
.elTree {
  height: calc(100% - 28px);
  overflow: auto;
}
.elTree .el-tree-node.is-current > .el-tree-node__content,
.elTree /deep/ .el-tree-node.is-current > .el-tree-node__content {
  background-color: #eff4f9;
  color: #2d42af;
  font-weight: 600;
}
.processVersion {
  display: inline-block;
  margin-left: 10px;
  .el-dropdown-link {
    color: $bc4;
  }
  .international {
    cursor: pointer;
  }
}
.el-dropdown-menu {
  max-height: 300px;
  overflow: auto;
}
</style>
