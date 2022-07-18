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
            :props="props"
            :isLeaf="isLeaf"
            node-key="id"
            :load="getFilterTreeList"
            :default-expanded-keys="expandedList"
            :expand-on-click-node="false"
            ref="asyncTree"
            lazy>
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <p class="grow" :title="node.label" @click="nodeClick(node, data)" v-if="node.level == 1 || node.level == 2">{{ node.label }}</p>
              <p class="grow" :title="node.label" @click="nodeClick(node, data)" v-else>{{ node.data.code + node.label  }}</p>
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
                  class="el-icon-delete del"
                  @click="handlerTreeOperate('del', data,node)"
                ></i>
              </p>
            </div>
          </el-tree>
          <el-tree
            v-if="isSearch"
            :props="props"
            :isLeaf="isLeaf"
            node-key="id"
            :data="treeData"
            :default-expanded-keys="expandedList"
            :expand-on-click-node="false"
            lazy>
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <p class="grow" :title="node.label"  @click="nodeClick(node, data)">{{ node.label }}</p>
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
                  class="el-icon-delete del"
                  @click="handlerTreeOperate('del', data,node)"
                ></i>
              </p>
            </div>
          </el-tree>
      <!--</el-col>-->
    <!--</el-row>-->

    <!-- 添加或删除组织树 -->
    <el-dialog :title="type == 'add' ? '添加':'修改'" :visible.sync="isDialogsVisible" width="40%">
      <el-form
        label-width="120px"
        label-position="right"
        ref="orgRef"
        :model="orgForm"
        :rules="rules"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="orgForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="orgForm.code" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialogsVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlerConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getRuleIframeTree
} from '@/bpa/api/rulesCenter/handbookFiles'
import { saveTreeInfo, delTreeInfo, getNodeCode } from '@/bpa/api/settings/ruleManage'

export default {
  data () {
    return {
      type: 'add',
      treeData: [],
      isSearch: false,
      filterText: '',
      expandedList: ['9'],
      orgid: '',
      props: {
        label: 'foldername',
        children: 'childList',
        isLeaf: function (data, node) {
          if (data.parent) {
            return false
          } else {
            return true
          }
        }
      },
      isDialogsVisible: false,
      orgForm: {name: '', code: ''},
      rules: {
        name: [{ required: true, message: ' ', trigger: 'blur' }]
      }
    }
  },
  mounted () {
  },
  methods: {
    getFilterTreeList (node, resolve) {
      console.log(node)
      let id = node.data ? node.data.id : '0'
      getRuleIframeTree(id).then(res => {
        if (!res) return false
        if (id === '0') {
          this.expandedList = [res[0].id]
        }
        resolve(res)
      })
    },
    abstractSearch () {
      if (this.filterText) {
        this.isSearch = true
        // abstractSearch({orgname: this.filterText}).then(res => {
        //   this.treeData = res
        // })
      } else {
        this.isSearch = false
      }
    },
    isLeaf (data, node) {
      console.log(data)
      console.log(node)
    },
    nodeClick(node, data) {
      this.$emit('conClick', {
        node: node,
        data: data
      })
    },
    handlerTreeOperate(type, data, node) {
      let me = this
      console.log(type)
      console.log(node)
      console.log(data)
      this.orgForm = {}
      this.type = type
      if (type === 'add') {
        if (data.id !== '5') {
          getNodeCode(data.id).then(res => {
            if (!res) return false
            this.$set(this.orgForm, 'code', res)
          })
        }
        this.orgForm = Object.assign({}, this.orgForm, {
          pid: !data.id ? '' : data.id
        })
        this.isDialogsVisible = true
      } else if (type === 'edit') {
        this.isDialogsVisible = true
        this.orgForm = Object.assign({}, this.orgForm, {
          id: data.id,
          name: data.foldername,
          code: data.code,
          pid: !node.parent.data ? '' : node.parent.data.id
        })
      } else {
        let parentid = node.parent.data.id
        this.$confirm('是否确定删除？', '提示', {
          confirmBtnText: '确定',
          cancelBtnText: '取消',
          type: 'warning'
        }).then(() => {
          delTreeInfo(data.id).then(res => {
            if (!res) return false
            this.$message({
              type: 'success',
              message: '删除成功!'
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
            foldername: !this.orgForm.name ? '' : this.orgForm.name,
            pid: !this.orgForm.pid ? '' : this.orgForm.pid,
            code: !this.orgForm.code ? '' : this.orgForm.code
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
/deep/ .el-tree-node>.el-tree-node__children{
  overflow: visible;
}
.custom-tree-node{
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
    .opertionBtn{
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
  .right-content{
    height: calc(100vh - 160px);
    .el-scrollbar__wrap{
      height: 100%;
    }
    .el-scrollbar__view{
      height: 100%;
    }
  }
  .tree_node {
    height: calc(100vh - 190px) !important;
  }
}
</style>
