<template>
  <div id="groupManage">
    <el-row :gutter="20" class="group_container">
      <el-col :span="6" class="tree_wrap">
        <el-row>
          <el-input
            placeholder="请输入内容"
            class="search_component remove-margin-b"
            v-model="filterText"
            clearable
            @keyup.13.native="abstractSearch"
          >
            <el-button type="primary" @click="abstractSearch" slot="append">搜索</el-button>
          </el-input>
        </el-row>
        <el-scrollbar class="tree_node">
          <el-tree
            v-show="!isSearch"
            :props="props"
            :isLeaf="isLeaf"
            node-key="id"
            :load="getFilterTreeList"
            :default-expanded-keys="expandedList"
            :expand-on-click-node="false"
            ref="asyncTree"
            lazy
          >
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <p
                class="grow"
                :title="node.label"
                @click="handlerNodeClick(data, node)"
              >{{ node.label }}</p>
              <p class="font14 opertionBtn">
                <i
                  class="el-icon-circle-plus-outline add"
                  @click="handlerTreeOperate('add', data,node)"
                ></i>
                <i
                  v-if="node.level !== 1"
                  class="el-icon-edit add"
                  @click="handlerTreeOperate('edit', data,node)"
                ></i>
                <i
                  v-if="node.level !== 1"
                  class="el-icon-delete add"
                  @click="handlerTreeOperate('del', data,node)"
                ></i>
              </p>
            </div>
          </el-tree>
          <el-tree
            v-show="isSearch"
            :props="searchProps"
            :isLeaf="isLeaf"
            default-expand-all
            node-key="id"
            :data="treeData"
            :default-expanded-keys="expandedList"
            :expand-on-click-node="false"
          >
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <p
                class="grow"
                :title="node.label"
                @click="handlerNodeClick(data, node)"
              >{{ node.label }}</p>
              <p class="font14 opertionBtn">
                <i
                  class="el-icon-circle-plus-outline add"
                  @click.stop="handlerTreeOperate('add', data,node)"
                ></i>
                <i
                  v-if="node.level !== 1"
                  class="el-icon-edit add"
                  @click="handlerTreeOperate('edit', data,node)"
                ></i>
                <i
                  v-if="node.level !== 1"
                  class="el-icon-delete add"
                  @click="handlerTreeOperate('del', data,node)"
                ></i>
              </p>
            </div>
          </el-tree>
        </el-scrollbar>
      </el-col>
      <el-col :span="18">
        <el-scrollbar class="right-content">
          <el-row>
            <el-col :span="18">
              <el-input
                placeholder="请输入内容"
                class="search_component"
                v-model="keyWords"
                clearable
                @keyup.13.native="singleSearch"
              >
                <el-button type="primary"  slot="append" @click="singleSearch"> {{$t('search')}}</el-button>
              </el-input>
            </el-col>
            <!-- <el-col :span="3">
              <el-button class="float-r" type="primary" @click="frameworkManage">流程框架权限管理</el-button>
            </el-col>-->
            <el-col :span="6">
              <el-button class="float-r" type="primary" @click="authorManage">菜单权限管理</el-button>
            </el-col>
          </el-row>
          <el-table :data="userList" class="main_tab">
            <el-table-column :label="$t('number')" type="index"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="memberId" label="账号"></el-table-column>
            <el-table-column prop="email" label="邮箱">
              <template slot-scope="scope">{{scope.row.attr.mail}}</template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pages.pageNum"
            :page-size="pages.pageSize"
            background
            layout="prev, pager, next, jumper, total"
            :total="pages.total"
          ></el-pagination>
        </el-scrollbar>
      </el-col>
    </el-row>
    <!-- 权限管理 -->
    <authority-role v-model="authoroleVisible" :selectInfo="selectInfo" type="org"></authority-role>

    <!-- 添加或删除组织树 -->
    <el-dialog :title="type == 'add' ? '添加':'修改'" :visible.sync="isDialogsVisible" width="40%">
      <el-form
        label-width="120px"
        label-position="right"
        ref="orgRef"
        :model="orgForm"
        :rules="rules"
      >
        <el-form-item label="组织名称" prop="name">
          <el-input clearable v-model="orgForm.name"></el-input>
        </el-form-item>
        <el-form-item label="组织类型" prop="type">
          <el-select clearable v-model="orgForm.type" :placeholder="$t('pleaseSelect')">
            <el-option label="部门" value="2"></el-option>
            <el-option label="岗位" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialogsVisible = false">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="handlerConfirm">{{$t("confirm")}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getTreeList,
  abstractSearch,
  getUserList,
  saveTreeInfo,
  delTreeInfo
} from '@/bpa/api/settings/groupManage'
import paginations from '@/bpa/mixins/pagination_mixin.js'
import authorityRole from '@/bpa/components/authorityRole.vue'
export default {
  data() {
    return {
      type: 'add',
      treeData: [],
      userList: [],
      isSearch: false,
      filterText: '',
      keyWords: '',
      expandedList: [],
      searchForm: {},
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      orgid: '',
      props: {
        label: 'name',
        children: 'zones',
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
        isLeaf: function(data, node) {
          if (data.isParent === 'true') {
            return false
          } else {
            return true
          }
        }
      },
      selectInfo: {},
      authoroleVisible: false,
      frameworkVisible: false,

      isDialogsVisible: false,
      orgForm: {},
      rules: {
        name: [{ required: true, message: ' ', trigger: 'blur' }],
        type: [{ required: true, message: ' ', trigger: 'change' }]
      }
    }
  },
  mixins: [paginations],
  components: {
    authorityRole
  },
  mounted() {
    this.getList()
  },
  methods: {
    getFilterTreeList(node, resolve) {
      let id = node.data ? node.data.id : '0'
      getTreeList(id).then(res => {
        if (!res) return false
        if (id === '0') {
          this.expandedList = [res[0].id]
          this.orgid = res[0].id
          this.selectInfo = {
            name: res[0].name,
            id: res[0].id
          }
          this.getList()
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
        if (!res) return false
        this.userList = res.list
        this.pages.total = res.total
      })
    },
    abstractSearch() {
      if (this.filterText) {
        this.isSearch = true
        abstractSearch({ orgname: this.filterText }).then(res => {
          this.treeData = res
        })
      } else {
        this.isSearch = false
      }
    },
    handlerNodeClick(data, node) {
      console.log(data)
      this.orgid = data.id
      this.selectInfo = {
        name: data.name,
        id: data.id
      }
      this.getList()
    },
    isLeaf(data, node) {
      console.log(data)
      console.log(node)
    },
    authorManage() {
      if (!this.selectInfo.name) {
        this.$message({
          type: 'warning',
          message: '请选择组织,再进行操作'
        })
        return false
      }
      this.authoroleVisible = true
    },
    // 流程框架权限管理
    frameworkManage() {
      if (!this.selectInfo.name) {
        this.$message({
          type: 'warning',
          message: '请选择组织,再进行操作'
        })
        return false
      }
      this.authoroleVisible = true
    },
    handlerTreeOperate(type, data, node) {
      let me = this
      console.log(type)
      console.log(node)
      console.log(data)
      this.type = type
      this.orgForm = {}
      if (type === 'add') {
        this.isDialogsVisible = true
        this.orgForm = Object.assign({}, this.orgForm, {
          parentname: !data.name ? '' : data.name,
          pid: !data.id ? '' : data.id
        })
      } else if (type === 'edit') {
        this.isDialogsVisible = true
        this.orgForm = Object.assign({}, this.orgForm, {
          id: data.id,
          name: data.name,
          type: data.type,
          parentname: !node.parent.data ? '' : node.parent.data.name,
          pid: !node.parent.data ? '' : node.parent.data.id
        })
      } else {
        let parentid = node.parent.data.id
        this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
          confirmBtnText: '确定',
          cancelBtnText: '取消',
          type: 'warning'
        }).then(() => {
          delTreeInfo(data.id).then(res => {
            // console.log(res)
            // if (!res) return false
            this.$message({
              type: 'success',
              message: this.$t('hintText.successfullyDelete')
            })
            let node = this.$refs.asyncTree.getNode(parentid) // 通过节点id找到对应树节点对象
            node.loaded = false
            node.expand()
          })
        })
      }
    },
    handlerConfirm() {
      this.$refs.orgRef.validate(valid => {
        if (valid) {
          saveTreeInfo({
            id: !this.orgForm.id ? '' : this.orgForm.id,
            name: !this.orgForm.name ? '' : this.orgForm.name,
            parentname: !this.orgForm.parentname ? '' : this.orgForm.parentname,
            pid: !this.orgForm.pid ? '' : this.orgForm.pid,
            type: !this.orgForm.type ? '' : this.orgForm.type
          }).then(res => {
            if (!res) return false
            this.$message({
              type: 'success',
              message: !this.orgForm.id ? '添加' : '修改' + '成功!'
            })
            this.isDialogsVisible = false
            if (!this.orgForm.pid) return false
            let node = this.$refs.asyncTree.getNode(this.orgForm.pid) // 通过节点id找到对应树节点对象
            node.loaded = false
            node.expand()
          })
        } else {
          this.$message({
            type: 'warning',
            message: '必填字段未填!'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-tree-node > .el-tree-node__children {
  overflow: visible;
}
/deep/ .el-scrollbar__thumb {
  width: 40%;
}
.custom-tree-node {
  height: 100%;
  position: relative;
  .opertionBtn {
    position: absolute;
    right: 10px;
    top: 0;
    bottom: 0;
    min-width: 50px;
    display: flex;
    display: none;
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
      display: flex;
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
    padding-right: 70px;
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
