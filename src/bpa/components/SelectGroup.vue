<template>
  <el-dialog v-if="dialogVisible" :title="selectGroup" class="person_list" :visible.sync="dialogVisible" width="70%"
             :append-to-body="true"
             :close-on-click-modal=false :close-on-press-escape=false :modal-append-to-body=false
  >
    <el-row :gutter="20" class="bpa">
      <el-col :span="9" class="tree_wrap">
        <el-row>
          <el-col :span="16" class="tree_wrap">
            <el-row>
              <el-input clearable :placeholder="pleaseEnterTheContent" :title="pleaseEnterTheContent"
                        class="search_component remove-margin-b" v-model="filterText" @keyup.13.native="abstractSearch"
              >
                <el-button id="btn" @click="abstractSearch" slot="append">{{ $t('search') }}
                </el-button>
              </el-input>
            </el-row>
          </el-col>
        </el-row>
        <el-scrollbar class="tree_node">
          <el-tree :props="props" v-show="!isSearch" :load="getFilterTreeList" show-checkbox check-strictly
                   node-key="id" ref="groupTree" :default-expanded-keys="[grandParentId]" :expand-on-click-node="false"
                   @node-click="handlerNodeClick" :default-checked-keys="defaultChecked"
                   @check-change="handlerNodeChecked" lazy key="1"
          ></el-tree>
          <el-tree v-show="isSearch" :props="searchProps" default-expand-all node-key="id" :data="treeData"
                   ref="groupSearchTree" show-checkbox check-strictly :default-expanded-keys="[grandParentId]"
                   :expand-on-click-node="false"
                   @node-click="handlerNodeClick" :default-checked-keys="defaultChecked"
                   @check-change="handlerNodeChecked" key="2"
          >
          </el-tree>
        </el-scrollbar>
      </el-col>
      <el-col :span="15">
        <el-row>
          <el-col :span="10" class="margin-b10">
            <el-input clearable :placeholder="pleaseEnterTheContent" :title="pleaseEnterTheContent"
                      class="search_component" v-model="keyWords" @keyup.13.native="singleSearch"
            >
              <el-button type="primary" id="btn" slot="append" @click="singleSearch">{{ $t('search') }}
              </el-button>
            </el-input>
          </el-col>
        </el-row>
        <el-table :data="userList" class="main_tab">
          <el-table-column :label="number" type="index"></el-table-column>
          <el-table-column prop="name" :label="name"></el-table-column>
          <el-table-column prop="memberId" :label="account"></el-table-column>
          <el-table-column prop="email" :label="email"></el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="pages.pageNum" :page-size="pages.pageSize" :pager-count="5" background
                       layout="prev, pager, next, jumper, total" :total="pages.total"
        ></el-pagination>
      </el-col>
    </el-row>
    <!--    <div class="selected_list">-->
    <!--      <div class="selected_item" v-for="(item,index) in selectedList" :key="index">-->
    <!--        <span class="name">{{item.name || item.value }}</span>-->
    <!--        <i @click="deleteSelectedItem(item.id)" class="el-icon-close"></i>-->
    <!--      </div>-->
    <!--    </div>-->
    <div style="margin-top: 10px;">
      <span v-for="(item,index) in selectedList" :key="index" class="listItem">
        {{ item.name || item.value }}
        <i @click="deleteSelectedItem(item.id)" class="el-icon-close"></i>
      </span>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelConfirmDialog">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="handlerConfirmDialog">{{ $t("confirm") }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getGroupTreeList, getUserList } from '@/bpa/api/componentsApi'
import { abstractSearch } from '@/bpa/api/settings/groupManage'
import paginations from '@/bpa/mixins/pagination_mixin.js'

export default {
  name: 'SelectGroup',
  data() {
    let _this = this
    return {
      userList: [],
      keyWords: '',
      selectedList: [],
      grandParentId: '',
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      times: 0,
      dialogVisible: false,
      orgid: '',
      props: {
        label: 'name',
        children: 'zones',
        disabled: function(data, node) {
          if (_this.selectTree.indexOf(data.type) > -1) {
            return false
          }
          return true
        },
        isLeaf: function(data, node) {
          if (data.isParent === 'true') {
            return false
          } else {
            return true
          }
        }
      },
      searchProps: {
        label: 'name',
        children: 'subNodes',
        disabled: function(data, node) {
          if (_this.selectTree.indexOf(data.type) > -1) {
            return false
          }
          return true
        },
        isLeaf: function(data, node) {
          if (data.isParent === 'true') {
            return false
          } else {
            return true
          }
        }
      },
      isFirst: true,
      node: '',
      resolve: '',
      isSearch: false,
      treeData: [],
      filterText: '',
      selectGroup: this.$t("selectGroup"),
      number: this.$t("bpa_number"),
      name: this.$t("name"),
      account: this.$t("account"),
      email: this.$t("email"),
      pleaseEnterTheContent: this.$t("placeholderText.pleaseEnterTheContent"),
      defaultChecked: [],
      delBtnBoolean: false,
    }
  },
  mixins: [paginations],
  props: {
    value: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Array,
      default: () => []
    },
    selectGroupSingle: {
      type: Boolean,
      default: false
    },
    /**
     * 需要选择什么type类型的组织树,比如选择岗位则传['3']等
     * */
    selectTree: {
      type: Array,
      default: () => []
    },
    /**
     * 请求组织树
     * 0代表组织树的根部,1代表公司, 2代表部门, 3代表岗位, 4代表科与组
     * */
    showTree: {
      type: String,
      default: '1,2,3,4'
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
      //  禁掉了，点击确认或取消后 会把选中的数组的第一位删掉了
      // this.$nextTick(() => {
      //   this.$refs.groupTree.setCheckedNodes([])
      // })
      if (val) {
        this.selectedList = this.selected
        this.defaultChecked = []
        this.isSearch = false
        this.filterText = ''
      }
    },
    selectedList: {
      handler: function(val) {
        this.defaultChecked = []
        this.selectedList.forEach(element => {
          if (element.ID) {
            element.id = element.ID
            this.defaultChecked.push(element.ID + '')
          } else {
            element.ID = element.id
            this.defaultChecked.push(element.id + '')
          }
        })
        if (this.delBtnBoolean) {
          this.$nextTick(() => {
            this.$refs.groupTree.setCheckedNodes(this.selectedList)
            this.$refs.groupSearchTree.setCheckedNodes(this.selectedList)
          })
        }
      },
      deep: true
    },
    dialogVisible(val) {
      this.$emit('input', val)
      // 关闭组件时，清空树内容，下次打开组件才会重新加载内容
      if (!this.isFirst) {
        this.node.childNodes = []
        this.getFilterTreeList(this.node, this.resolve)
      }
    }
  },
  mounted() {
  },
  methods: {
    //数组去重
    uniqueList(list) {
      const res = new Map()
      return list.filter(item => !res.has(item.memberId) && res.set(item.memberId, 1))
    },

    abstractSearch() {
      if (!this.filterText) {
        this.isSearch = false
        return false
      }
      abstractSearch({ orgname: this.filterText }).then(res => {
        this.isSearch = true
        this.treeData = res
      })
    },
    getFilterTreeList(node, resolve) {
      // isFirst 为了保证只在第一次加载的时候进行
      if (this.isFirst) {
        this.node = node
        this.resolve = resolve
        this.isFirst = false
      }

      let id = node.data ? node.data.id : '0'
      getGroupTreeList({
        pid: id,
        type: this.showTree
      }).then(res => {
        let temp_list = []
        for (let j = 0; j < this.selected.length; j++) {
          for (let i = 0; i < res.length; i++) {
            if (this.selected[j].id === res[i].id) {
              this.$nextTick(() => {
                if (!!this.selectedList && !!this.selectedList.length) {
                  this.$refs.groupTree.setCheckedNodes(this.selectedList)
                  this.$refs.groupSearchTree.setCheckedNodes(this.selectedList)
                }
                // 如果有默认选项，默认选中岗位对应的人（企业流程框架用）
                getUserList({
                  attr: { orgid: res[i].id },
                  orderby: '',
                  pageNum: this.pages.pageNum,
                  pageSize: this.pages.pageSize,
                  sort: 'desc',
                  logic: 'or',
                  filters: [
                    {
                      key: 'cnname',
                      opt: 'LIKE',
                      type: 'S',
                      value: this.keyWords
                    },
                    {
                      key: 'empuid',
                      opt: 'LIKE',
                      type: 'S',
                      value: this.keyWords
                    }
                  ]
                }).then(res_t => {
                  this.userList = res_t.list
                  this.pages.total = res_t.total
                  res[i].person = this.userList.length ? this.userList[0] : {}
                  temp_list.push(res[i])
                  this.selectedList = temp_list
                })
              })
              break
            }
          }
        }

        if (id === '0') {
          this.grandParentId = res[0].id
        }
        console.log(res)
        if (this.times === 0) {
          // 默认展示做高级树的第一个节点下的所有人员名单
          this.times++
          this.handlerNodeClick(res[0])
        }
        resolve(res)
      })
    },
    getList() {
      getUserList({
        attr: { orgid: this.orgid },
        orderby: '',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: 'desc',
        logic: 'or',
        filters: [
          { key: 'cnname', opt: 'LIKE', type: 'S', value: this.keyWords },
          { key: 'empuid', opt: 'LIKE', type: 'S', value: this.keyWords }
        ]
      }).then(res => {
        // this.userList = res.list
        this.userList = this.uniqueList(res.list)
        this.pages.total = res.total
        // this.pages.total = this.userList.length
      })
    },
    handlerNodeClick(data, node) {
      this.orgid = data.id
      this.getList()
    },
    handlerNodeChecked(item, isChecked) {
      this.delBtnBoolean = false
      if (isChecked) {
        getUserList({
          attr: { orgid: item.id },
          orderby: '',
          pageNum: this.pages.pageNum,
          pageSize: this.pages.pageSize,
          sort: 'desc',
          logic: 'or',
          filters: [
            { key: 'cnname', opt: 'LIKE', type: 'S', value: this.keyWords },
            { key: 'empuid', opt: 'LIKE', type: 'S', value: this.keyWords }
          ]
        }).then(res => {
          let userList = res.list
          // this.pages.total = res.total
          item.person = userList.length ? userList[0] : {}
          if (this.selectGroupSingle) {
            this.selectedList = []
            this.delBtnBoolean = true
          }
          this.selectedList.push(item)
          console.log(item)

        }).catch(e => {
          this.$message.error('网络错误！')
        })
      } else {
        this.deleteSelectedItem(item.id)
      }
    },
    deleteSelectedItem(id) {
      this.delBtnBoolean = true
      for (let i = 0; i < this.selectedList.length; i++) {
        if (this.selectedList[i].id == id || this.selectedList[i].ID == id) {
          this.selectedList.splice(i, 1)
          break
        }
      }
    },
    handlerConfirmDialog() {
      // if (!this.selectedList || this.selectedList.length === 0) {
      //   this.$message.error("请选择组织部门");
      //   return
      // }
      this.$emit('confirm', this.selectedList)
      this.dialogVisible = false
      this.selectedList = []
      this.delBtnBoolean = false
    },
    cancelConfirmDialog() {
      this.dialogVisible = false
      this.selectedList = []
      this.delBtnBoolean = false
    }
  }
}
</script>

<style lang="scss" scoped>
.person_list {
  /deep/ .el-dialog {
    margin-top: 5vh !important;
  }
}
.listItem {
  background: #2d42af;
  color: #fff;
  padding: 10px;
  margin: 0 10px 10px 0;
  display: inline-block;
  text-align: center;

  i {
    cursor: pointer;
  }
}

.tree_node {
  height: 427px;
}

.selected_list {
  margin-top: 10px;

  &::after {
    content: "";
    display: block;
    clear: both;
  }

  .selected_item {
    float: left;
    padding: 4px 6px;
    background: #67c23a;
    border-radius: 3px;
    margin-right: 5px;
    margin-bottom: 5px;

    .name {
      color: #fff;
      font-size: 12px;
      display: inline-block;
      vertical-align: middle;
    }

    i {
      font-size: 12px;
      color: #fff;
      cursor: pointer;
      display: inline-block;
      vertical-align: middle;
    }

    &:after {
      content: "";
      display: inline-block;
      height: 100%;
      vertical-align: middle;
    }
  }
}

/deep/ .el-input-group__append {
  color: #fff !important;
  background-color: #2d42af !important;
}

#btn:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}
</style>
