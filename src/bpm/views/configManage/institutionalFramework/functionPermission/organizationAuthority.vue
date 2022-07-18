<template>
  <el-card shadow="never" class="mainContent card-reset-inner">
    <div class="item-left">
      <el-tree ref="tree" :load="loadNodeOr" lazy :props="props" node-key="id" check-strictly
               @node-click="handleCheckChange1"
      >
        <span class="custom-tree-node" slot-scope="{ node, data}" style="font-size: 13px;">
          <i v-if="data.type === '0'"></i>
          <i v-else-if="data.type === '1'" class="iconfont icon-gongsi"></i>
          <i v-else-if="data.type === '2'" class="iconfont icon-bumen"></i>
          <i v-else-if="data.type === '3'" class="iconfont icon-drxx12"></i>
          <i v-else></i>
          <span>{{ node.label }}</span>
        </span>
      </el-tree>
      <!--      <el-tree class="elTree" ref="tree" :load="loadNodeJob" lazy :props="props" node-key="id" check-strictly-->
      <!--               @node-click="handleCheckChange2"-->
      <!--      >-->
      <!--      </el-tree>-->
      <!--      <el-tree class="elTree" ref="tree" :load="loadNodeAu" lazy :props="props" node-key="id" check-strictly-->
      <!--               @node-click="handleCheckChange3"-->
      <!--      >-->
      <!--      </el-tree>-->
      <el-tree class="elTree" ref="tree" :load="loadNodeRo" lazy :props="props" node-key="id" check-strictly
               @node-click="handleCheckChange4"
      >
      </el-tree>
    </div>
    <div class="item-right" v-if="!!treeData.id">
      <!--    表格-->
        <bas-table
          row-key="id"
          :tableList="content.list"
          :headerList="headerList"
          :pages="page"
          selectType="checkbox"
          @selectionChange="handleSelectionChange"
          @currentChange="currentChange">
          <template #search>
            <div class="tool-common-wrap">
              <div class="search-wrap">
                <quick-query class="pull-left" :placeholder="$t('placeholderText.multipleFieldsPlaceholder39')" ref="quick"
                            @quickSearch="quickSearch" :is-date="false"
                />
                <el-button type="primary" style="margin-left:5px;" class="high_search"
                          @click="isPowerSearch = !isPowerSearch"
                >
                  {{ $t("advancedQuery") }}<i :class="isHighSearch?'el-icon-caret-top' : 'el-icon-caret-bottom'" />
                </el-button>
              </div>

              <div class="btn-wrap">
                <el-button type="primary" @click="userHandle($t('edit'))">
                  {{ $t("edit") }}

                </el-button>
                <el-button type="primary" :disabled="selections.length === 0" @click="handleAllDelete">
                  {{ $t("batchDelete") }}
                </el-button>
              </div>
            </div>
            <el-form class="power-search" :model="searchForm" @keyup.enter.native="powerSearch" label-width="120px"
                    v-if="isPowerSearch"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('menuName') + '：'">
                    <el-input type="text" v-model="searchForm.name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('previousMenu') + '：'">
                    <el-input type="text" v-model="searchForm.pname"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" class="text-r">
                  <el-button type="primary" @click="powerSearch">{{ $t("query") }}</el-button>
                  <el-button type="primary" @click="rest">{{ $t("reset") }}</el-button>
                </el-col>
              </el-row>
            </el-form>
          </template>
          <!-- 菜单ID -->
          <template #id="{ row }">
            <div>{{ row.id }}</div>
          </template>
          <!-- 菜单名称 -->
          <template #name="{ row }">
            <div>{{ row.name }}</div>
          </template>
          <!-- 菜单链接 -->
          <template #navigationCustom="{ row }">
            <div>{{ row.navigationCustom }}</div>
          </template>
          <!-- 菜单排序 -->
          <template #sort="{ row }">
            <div>{{ row.sort }}</div>
          </template>
          <!-- 上级菜单 -->
          <template #pname="{ row }">
            <div>{{ row.pname }}</div>
          </template>
          <!-- 操作 -->
          <template #pid="{ row }">
            <el-button type="text" @click="handleDeleteOne(row)">
              <span style="color:#2d42af;text-decoration:underline;">{{ $t("delete") }}</span>
            </el-button>
          </template>
        </bas-table>
      <!-- <el-pagination class="margin-t15" :page-size="page.pageSize" :current-page.sync="page.pageNum" background
                     @current-change="searchType === 'power' ? getData() : quickQueryData()" :total="content.total"
      ></el-pagination> -->
      <tree v-model="treeDialog" :item="editItem" @confirm="confirm" />
    </div>
  </el-card>
</template>

<script>
import {
  queryJob,
  deleteTree
} from "@/bpm/api/configManage/institutionalFramework/position_manage";
import QuickQuery from "@/bpm/components/quickquery/QuickQuery";
import treePosition from "@/bpm/components/treePosition";
import SearchListMixin from "@/bpm/mixins/search_list_mixin";
// import ElPage from "@/components/elPage/elPage";
import tree from "./tree";
import {
  deleteNavigationPermission,
  getAllRootTreeJob,
  getChildrenJob,
  getAllRootTreeOr,
  authorityGroup,
  getAuthroleList,
  queryNavigationPermission
} from "@/bpm/api/configManage/institutionalFramework/function_permission";
import { getChildren } from "@/bpm/api/configManage/institutionalFramework/organization";

export default {
  mixins: [SearchListMixin],
  name: "positionManage",
  components: {
    QuickQuery,
    treePosition,
    // ElPage,
    tree
  },
  data() {
    return {
      // 表头字段
      headerList: [
        {
          label: '', // 星标
          prop: 'starmark',
          slotName: 'starmark',
          width: 35
        },
        {
          label: this.$t('menuID'), // ID
          prop: 'id',
          slotName: 'id',
          sortable: false
        },
        {
          label: this.$t('menuName'), // 菜单名称
          prop: 'name',
          slotName: 'name',
          sortable: false
        },
        {
          label: this.$t('menuLinks'), // 菜单链接
          prop: 'navigationCustom',
          slotName: 'navigationCustom',
          sortable: false
        },
        {
          label: this.$t('sortMenu'), // 菜单排序
          prop: 'sort',
          slotName: 'sort',
          sortable: false
        },
        {
          label: this.$t('previousMenu'), // 上级菜单
          prop: 'pname',
          slotName: 'pname',
          sortable: false
        },
        {
          label: this.$t('operation'), // 操作
          prop: 'pid',
          slotName: 'pid',
          sortable: false
        }
      ],
      props: {
        label: function(data, node) {
          console.log("🍓", data);
          if (data.id === "001") {
            return "组织";
          } else {
            return data.name;
          }

        },
        isLeaf: "leaf"
      },
      propsDimension: {
        label: "name",
        // isLeaf: 'leaf'
        isLeaf: function(data, node) {
          if (data.parent) {
            return false;
          } else {
            return true;
          }
        }
      },
      dialogVisible: false,
      treeData: {},
      selections: [],
      checkAll: false,
      treeStatus: "",
      editItem: {},
      treeDialog: false,
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      isHighSearch: false
    };
  },
  watch: {
    "content.list": {
      handler(val) {
        if (this.content.list && this.content.list.length !== 0) {
          this.checkAll = true;
          this.selections = [];
          for (let i = 0; i < this.content.list.length; i++) {
            if (!this.content.list[i].checked) {
              this.checkAll = false;
            } else {
              this.selections.push(this.content.list[i]);
            }
          }
        }
      },
      deep: true
    },
    checkAll(val) {
      if (this.content.list) {
        if (val) {
          this.content.list.forEach(item => {
            item.checked = val;
          });
        } else if (this.selections.length === this.content.list.length) {
          this.content.list.forEach(item => {
            item.checked = val;
          });
        }
      }
    }
  },
  mounted() {
  },
  methods: {
    // 页码改变事件
    currentChange(newPageNum) {
      console.log('newPage', newPageNum)
      this.page.pageNum = newPageNum
      if (this.searchType === 'power') {
        this.getData()
      } else {
        this.quickQueryData()
      }
    },
    // 复选框勾选事件
    handleSelectionChange(val) {
      this.selections = val;
      console.log(val)
    },
    //编辑成功后返回
    confirm() {
      this.getData();
    },

    //组织权限管理 编辑按钮
    userHandle() {
      this.editItem = this.treeData;
      this.treeDialog = true;
    },

    //选中
    handleCheckChange1(data) {
      //如果是第一层的时候不加载
      if (data.id == "001") {
      } else {
        this.treeData = data;
        this.getData();
      }
    },

    handleCheckChange2(data) {
      if (data.id != "002") {
        this.treeData = data;
        this.getData();
      }
    },

    handleCheckChange3(data) {
      if (data.id != "003") {
        this.treeData = data;
        //系统组默认为7
        this.treeData.type = "7";
        this.getData();
      }
    },

    handleCheckChange4(data) {
      if (data.id != "003") {
        this.treeData = data;
        //角色默认为8
        this.treeData.type = "8";
        this.getData();
      }
    },

    //角色组
    loadNodeRo(node, resolve) {
      if (node.level === 0) {
        let treeDataJobShow = [{ "name": "角色", "id": "004" }];
        resolve(treeDataJobShow);
      } else {
        if (node.data.id == "004") {
          getAuthroleList({ pageNum: 1, pageSize: 99999 })
            .then(rt => {
              resolve(rt.data.list);
            })
            .catch(er => {
              console.log(er);
            });
        } else {
          resolve([]);
        }
      }
    },

    //系统组树
    loadNodeAu(node, resolve) {
      if (node.level === 0) {
        let treeDataJobShow = [{ "name": "系统组", "id": "003" }];
        resolve(treeDataJobShow);
      } else {
        if (node.data.id == "003") {
          authorityGroup({ pageNum: 1, pageSize: 99999 })
            .then(rt => {
              resolve(rt.data.list);
            })
            .catch(er => {
              console.log(er);
            });
        } else {
          resolve([]);
        }
      }
    },

    //职务树
    loadNodeJob(node, resolve) {
      if (node.level === 0) {
        let treeDataJobShow = [{ "name": "职务", "id": "002" }];
        resolve(treeDataJobShow);
      } else {
        if (node.data.id == "002") {
          getAllRootTreeJob()
            .then(rt => {
              resolve(rt.data);
            })
            .catch(er => {
              console.log(er);
            });
        } else {
          getChildrenJob(node.data.id)
            .then(rt => {
              resolve(rt.data);
            })
            .catch(er => {
              console.log(er);
            });
        }
      }
    },

    //组织树
    loadNodeOr(node, resolve) {
      if (node.level === 0) {
        // 第一次加载根节点
        let showArr = [{ "name": "默认维度", "id": "001" }];
        return resolve(showArr);
      } else {
        if (node.data.id == "001") {
          getAllRootTreeOr()
            .then(rt => {
              resolve(rt.data);
            })
            .catch(er => {
              console.log(er);
            });
        } else {
          getChildren(node.data.id)
            .then(rt => {
              resolve(rt.data);
            })
            .catch(er => {
              console.log(er);
            });
        }
      }
    },

    //分页切换
    elPageChange(data) {
      this.page.pageNum = data.pageNum;
      this.page.pageSize = data.pageSize;
      this.searchType === "power" ? this.getData() : this.quickQueryData();
    },

    // 快速获取数据
    quickQueryData() {
      let quickArr = [];
      this.loading = true;
      let queryFilterArr = ["name", "pname"];
      queryFilterArr.forEach((item) => {
        const filterObj = {
          key: item,
          opt: "LIKE",
          type: "S",
          value: this.quickData.searchData
        };
        quickArr.push(filterObj);
      });
      queryNavigationPermission(this.treeData.type === "0" ? "org" : this.treeData.type === "1" ? "org" : this.treeData.type === "2" ? "org" : this.treeData.type === "3" ? "org" : this.treeData.type === "4" ? "org" : this.treeData.type === "5" ? "org" : this.treeData.type === "6" ? "job" : this.treeData.type === "7" ? "group" : "8", this.treeData.id, {
        attr: {
          // "relatedid": this.treeData.id,
          // "relatedtype": this.treeData.type,
          // "additionalProp3": ""
        },
        logic: "or",
        filters: quickArr,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          rt.data.list.forEach(item => {
            item.checked = false;
          });
          this.page.total = rt.data.total
          this.content = rt.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 获取数据
    getData() {
      this.loading = true;
      queryNavigationPermission(this.treeData.type === "0" ? "org" : this.treeData.type === "1" ? "org" : this.treeData.type === "2" ? "org" : this.treeData.type === "3" ? "org" : this.treeData.type === "4" ? "org" : this.treeData.type === "5" ? "org" : this.treeData.type === "6" ? "job" : this.treeData.type === "7" ? "group" : "8", this.treeData.id, {
        attr: {
          // "relatedid": this.treeData.id,
          // "relatedtype": this.treeData.type,
          // "additionalProp3": ""
        },
        logic: "and",
        filters: this.filters,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          rt.data.list.forEach(item => {
            item.checked = false;
          });
          this.page.total = rt.data.total
          this.content = rt.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    //  删除一个
    handleDeleteOne(item) {
      console.log(this.treeData);
      this.treeStatus = "";
      this.$confirm(this.$t("hintText.areYouSureDeleteSelectedData"), this.$t("hintText.hint"), {
        type: "warning"
      })
        .then(() => {
          item.relatedid = this.treeData.id;
          item.resourceid = item.id;
          deleteNavigationPermission([item]).then(() => {
            this.treeStatus = "1";
            if (this.searchType === "power") {
              this.getData();
            } else if (this.searchType === "quick") {
              this.quickQueryData();
            }
          });
        })
        .catch(_ => {
        });
    },

    //  批量删除
    handleAllDelete() {
      this.$confirm(this.$t("hintText.areYouSureDeleteSelectedData"), this.$t("hintText.hint"), {
        type: "warning"
      })
        .then(() => {
          this.selections.forEach(element => {
            element.relatedid = this.treeData.id;
            element.resourceid = element.id;
          });
          deleteNavigationPermission(this.selections).then(
            rt => {
              if (rt.status === "200") {
                if (this.searchType === "power") {
                  this.getData();
                } else if (this.searchType === "quick") {
                  this.quickQueryData();
                }
                this.$message({
                  message: this.$t("hintText.successfullyDelete"),
                  type: "success"
                });
              } else {
                this.$message({
                  message: this.$t("hintText.failToDelete"),
                  type: "error"
                });
              }
            }
          );
        })
        .catch(_ => {
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.card-reset-inner {
  padding-top: 10px;
  ::v-deep > .el-card__body {
    display: flex;
  }
}
.elTree {
  font-size: 13px;

  /deep/ .el-tree-node.is-current > .el-tree-node__content .custom-tree-node {
    font-weight: 600;
    color: #2d42af;
  }

  /deep/ .custom-tree-node {
    color: #666;
  }
}

.tool-common-wrap {
  overflow: hidden;

  .search-wrap {
    float: left;
    overflow: hidden;

    .pull-left {
      float: left;
    }

    .pull-right {
      float: right;
      line-height: 28px;
      margin-left: 25px;
      text-decoration: underline;
      color: #2d42af;
    }
  }
}

.item-left {
  width: 250px;
  height: 100%;
  margin-right: 20px;
}

.item-right {
  flex: 1;
  .table-header {
    position: relative;
    background: $bc2;
    display: flex;
    align-items: center;

    .all-check {
      position: absolute;
      left: 10px;
    }
  }
}

.el-table__row .link {
  color: #2d42af;
  text-decoration: underline;
}

.el-table__row .cell div {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bpa .high_search {
  margin-bottom: 0;
}
</style>
