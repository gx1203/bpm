<template>
  <el-card shadow="never" id="organization" class="card-reset-inner">
    <div class="item-left">
      <!-- <el-tree class="elTree" :props="props" :load="loadNode" lazy @node-click="handleCheckChange" node-key="id"
        check-strictly ref="tree">
        <span class="custom-tree-node" slot-scope="{ node, data}">
          <i v-if="data.type === 'root'" class="iconfont icon-banben"></i>
          <i v-if="data.type === 'category'" class="iconfont" :class="[data.ico?data.ico:'icon-liebiao1']"></i>
          <i v-if="data.type === 'item'" class="iconfont" :class="data.ico"></i>
          <span>{{ node.label }}</span>
        </span>
      </el-tree> -->
      <el-tree ref="tree" class="elTree" :props="props" :default-expanded-keys="defaultExpandedKeys" :data="treeData"
               node-key="id" @node-click="handleCheckChange"
               check-strictly
      >
        <span class="custom-tree-node" slot-scope="{ node, data}">
          <i v-if="data.type === 'root'" class="iconfont icon-banben"></i>
          <i v-if="data.type === 'category'" class="iconfont" :class="[data.ico?data.ico:'icon-liebiao1']"></i>
          <i v-if="data.type === 'item'" class="iconfont" :class="data.ico"></i>
          <span>{{ node.label }}</span>
        </span>
      </el-tree>
    </div>
    <div class="item-right" v-if="!!checkData.id">

      <el-card shadow="never" class="card-reset-inner card-reset-inner-reset">
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
            <div>
              <div class="tool-common-wrap">
                <div class="search-wrap">
                  <quick-query class="pull-left" :placeholder="$t('placeholderText.multipleFieldsPlaceholder38')" ref="quick"
                              :isDate="false" @quickSearch="quickSearch"
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
                    <el-form-item :label="$t('name') + '：'">
                      <el-input type="text" v-model="searchForm.relatedName"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('type') + '：'">
                      <el-input type="text" v-model="searchForm.relatedTypeName"></el-input>
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
            </div>
          </template>
          <!-- 名称 -->
          <template #relatedName="{ row }">
            <div>{{ row.relatedName }}</div>
          </template>
          <!-- 类型 -->
          <template #relatedTypeName="{ row }">
            <div>{{ row.relatedTypeName }}</div>
          </template>
          <!-- 操作 -->
          <template #resourceid="{ row }">
            <el-button type="text" @click="handleDeleteOne(row)">
              <span style="color:#2d42af;text-decoration:underline;">{{ $t("delete") }}</span>
            </el-button>
          </template>
        </bas-table>
      </el-card>
    </div>
    <bas-organieation v-model="organieationShow" :selectedElement="selectedElement" :isSpecifiedGroupBut="false"
                      :isShowBustomGroupsBut="false" :selectElement="selectElement" :showElement="showElement"
                      :load="false"
                      :multiple="basOrganieationMultiple"
                      @fnCallBack="fnBasOrganieationCallBack"
    />
  </el-card>
</template>
<script>
import {
  getIsAdmin,
  getNavAll,
  getAllGroups,
  getNavigations,
  changepid,
  getAllGroups2,
  getNavAll2,
  getRolePermissions
} from "@/bpm/api/configManage/navConfig";
import {
  assignPermissions,
  findPermissions,
  removePermissions,
  reAssignPermissions
} from "@/bpm/api/configManage/authorityManage/roleManage";
import {
  queryRelated,
  deleteNavigationPermission,
  reAssignPermForRes
} from "@/bpm/api/configManage/institutionalFramework/function_permission";
import BasComponent from "bas-component";
import QuickQuery from "@/bpm/components/quickquery/QuickQuery";
// import ElPage from '@/components/elPage/elPage'
import { createNamespacedHelpers } from "vuex";
import SearchListMixin from "@/bpm/mixins/search_list_mixin";

Vue.use(BasComponent);
const { mapGetters } = createNamespacedHelpers("app");
export default {
  mixins: [SearchListMixin],
  components: {
    QuickQuery
    // ElPage
  },
  data() {
    return {
      defaultExpandedKeys: ['1'],
      //  	选人组件相关
      organieationShow: false,
      selectedElement: {},
      selectElement: ["0", "1", "2", "3", "4", "5", "6", "7", "8"],
      showElement: [{
        key: "1",
        name: this.$t("OrganizationalTree")
      },
        //        {
        //          key: "2",
        //          name: this.$t("department")
        //        },
        // {
        //   key: '6',
        //   name: this.$t('duty')
        // },
        // {
        //   key: '7',
        //   name: this.$t('systemGroups')
        // },
        {
          key: "8",
          name: this.$t("role")
        }
        //	        {
        //	          type: "9",
        //	          name: this.$t("user")
        //	        },
        //        {
        //          key: "10",
        //          name: this.$t("customGroups")
        //        },
      ],
      basOrganieationMultiple: true,
      checkAll: false,
      selections: [],
      loading: false,
      searchForm: {},
      headers: [
        {
          name: "ID",
          span: 6
        },
        {
          name: "名称",
          span: 6
        },
        {
          name: "链接",
          span: 6
        },
        {
          name: "操作",
          span: 6
        }
      ],
      checkData: {},
      content: {},
      props: {
        label: "name",
        children: "subNodes"
      },
      treeData: [],
      isHighSearch: false,
      // 表头字段
      headerList: [
        {
          label: '', // 星标
          prop: 'starmark',
          slotName: 'starmark',
          width: 35
        },
        {
          label: this.$t('name'), // 名称
          prop: 'relatedName',
          slotName: 'relatedName',
          sortable: false
        },
        {
          label: this.$t('type'), // 类型
          prop: 'relatedTypeName',
          slotName: 'relatedTypeName',
          sortable: false
        },
        {
          label: this.$t('operation'), // 操作
          prop: 'resourceid',
          slotName: 'resourceid',
          sortable: false
        }
      ],
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
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
  computed: {
    // ...mapGetters(['basOrganieationUrlSeting']),
    userInfo() {
      return this.$store.state.app.userInfo;
    },
    key() {
      return this.$route.fullPath;
    }
  },
  mounted() {
    //  this.getDepartment();
    this.getDepartment();
  },
  methods: {
    // 页码改变事件
    currentChange(newPageNum) {
      console.log('newPage', newPageNum)
      this.page.pageNum = newPageNum
      if (this.searchType === 'power') {
        this.getData()
      } else if (this.searchType === 'quick') {
        this.quickQueryData()
      }
    },
    // 复选框勾选事件
    handleSelectionChange(data) {
      console.log(data)
      this.selections = data
    },
    async getDepartment() {
      this.load = true;
      // const res = await getAllGroups2()
      const res = await Promise.all([
        getAllGroups2(),
        // getNavAll2(0),
        getNavAll2(1),
        // getNavAll(0),
        getNavAll(1)
      ]);
      const treeData = res[0].data.filter(item => item.id === "1");
      getIsAdmin()
        .then(rt => {
          if (rt.data === false) {
            treeData[0].subNodes = res[1].data;
          } else {
            treeData[0].subNodes = res[2].data;
          }
          this.treeData = treeData;
          console.log("llll", this.treeData);
          this.load = false;
        })
        .catch(er => {
          console.log(er);
        });

    },
    // 分页切换
    elPageChange(data) {
      this.page.pageNum = data.pageNum;
      this.page.pageSize = data.pageSize;
      this.searchType === "power" ? this.getData() : this.quickQueryData();
    },
    //  handleDragEnd(draggingNode, dropNode, dropType, ev) {
    //    let pid = "";
    //    if (dropNode.data.pid) {
    //      if (dropType === "before") {
    //        pid = dropNode.data.pid;
    //      } else if (dropType === "inner") {
    //        pid = dropNode.data.id;
    //      } else {
    //        return;
    //      }
    //      changepid(draggingNode.data.id, pid).then(rt => {
    //        if (rt.status === "200") {
    //          this.$message.success("操作成功");
    //        }
    //      });
    //    }
    //  },
    //  getDepartment() {
    //    getNavAll().then((rt) => {
    //      this.treeData = rt.data
    //    }).catch((er) => {
    //      this.load = false
    //      console.log(er)
    //    })
    //  },
    loadNode(node, resolve) {
      if (node.level == 0) {
        getNavigations(0)
          .then(rt => {
            resolve(rt.data);
          })
          .catch(er => {
            console.log(er);
          });
      } else {
        getNavigations(node.data.id)
          .then(rt => {
            rt.data.forEach(item => {
              if (item.type === "item") {
                item.isParent = true;
              }
            });
            resolve(rt.data);
          })
          .catch(er => {
            console.log(er);
          });
      }
    },

    handleCheckChange(data) {
      // console.log(data)
      this.checkData = data;
      this.getData();
    },

    // 选人组件返回
    fnBasOrganieationCallBack(data) {
      console.log("选人组件返回", data);
      let subRelated = [];
      if (data.idType) {
        let dataList = data.idType.split(";");
        dataList.forEach(val => {
          if (val.indexOf("-") == 0) {
            // 目前有些数据id为负数
            val = val.slice(1);
            let val0 = val.split("-")[0];
            let val1 = val.split("-")[1];
            subRelated.push({
              relatedType: val1 === "0" ? "org" : val1 === "9" ? "user" : val1 === "6" ? "job" : val1 === "7" ? "group" : val1,
              relatedid: "-" + val0,
              module: "nav",
              type: "include"
            });
          } else {
            let val0 = val.split("-")[0];
            let val1 = val.split("-")[1];
            subRelated.push({
              relatedType: val1 === "0" ? "org" : val1 === "9" ? "user" : val1 === "6" ? "job" : val1 === "7" ? "group" : val1,
              relatedid: val0,
              module: "nav",
              type: "include"
            });
          }
        });
      }
      this.load = true;
      reAssignPermForRes({
        "id": this.checkData.id,
        "perms": subRelated
      }).then(rt => {
        this.load = false;
        if (rt.status === "200") {
          this.dialogVisible = false;
          this.$message.success(this.$t("hintText.operateSuccessfully"));
          this.getData();
        }
      }).catch(er => {
        this.load = false;
      });

      this.organieationShow = false;
    },

    // 快速获取数据
    quickQueryData() {
      let quickArr = [];
      this.loading = true;
      let queryFilterArr = ["relatedName", "relatedTypeName"];
      queryFilterArr.forEach((item) => {
        const filterObj = {
          key: item,
          opt: "LIKE",
          type: "S",
          value: this.quickData.searchData
        };
        quickArr.push(filterObj);
      });
      queryRelated(this.checkData.id, this.checkData.type, {
        // attr: {
        //   'resourceid': this.checkData.id
        // },
        logic: "or",
        filters: quickArr,
        orderby: "relatedName",
        sort: "desc",
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
      queryRelated(this.checkData.id, this.checkData.type, {
        // attr: {
        //   'resourceid': this.checkData.id
        // },
        logic: "and",
        filters: this.filters,
        orderby: "relatedName",
        sort: "desc",
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          rt.data.list.forEach(item => {
            item.checked = false;
          });
          this.page.total = rt.data.total
          this.content = rt.data;
          console.log(rt.data);
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    userHandle(item, data) {
      console.log("编辑");

      // 查询渲染选人组件
      queryRelated(this.checkData.id, this.checkData.type, {
        // attr: {
        //   'resourceid': this.checkData.id
        // },
        filters: [],
        logic: "and",
        pageNum: 1,
        pageSize: 10000
      })
        .then(rt => {
          if (rt.status === "200") {
            if (rt.data.list && rt.data.list.length > 0) {
              this.selectedElement = {
                id: rt.data.list.map(item => item.relatedid).join(","),
                name: rt.data.list.map(item => item.relatedName).join("&"),
                idType: rt.data.list.map(item => {
                  return `${item.relatedid}-${item.relatedType === "user" ? "9" : item.relatedType === "job" ? "6" : item.relatedType === "group" ? "7" : item.relatedType === "org" ? "0" : item.relatedType}`;
                }).join(";")
              };
            } else {
              this.selectedElement = {};
            }
            this.organieationShow = true;
          }
        })
        .catch(er => {
        });
    },

    //  删除一个
    handleDeleteOne(item) {
      this.treeStatus = "";
      this.$confirm(this.$t("hintText.areYouSureDelete"), this.$t("hint"), {
        type: "warning"
      })
        .then(() => {
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
      let idsArr = [];
      this.$confirm(this.$t("hintText.areYouSureDeleteSelectedData"), this.$t("hint"), {
        type: "warning"
      })
        .then(() => {
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
<style lang="scss">
#organization {
  .item-left {
    .el-input__inner {
      border: none;
      border-bottom: 1px solid $dc1;
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
}
</style>

<style lang="scss" scoped>
.card-reset-inner {
  height: calc(100vh - 160px);
  ::v-deep > .el-card__body {
    display: flex;
  }
}
.card-reset-inner-reset {
  ::v-deep > .el-card__body {
    display: block;
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
  padding-top: 10px;
  box-sizing: border-box;
  width: 250px;
  height: 100% !important;
  margin-right: 20px;
  .elTree {
    height: 100%;
    overflow: auto;
  }
}

.item-right {
  padding-top: 10px;
  flex: 1;
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

  .w100 {
    width: 100%;
  }
}
.bpa .high_search {
  margin-bottom: 0;
}
</style>
