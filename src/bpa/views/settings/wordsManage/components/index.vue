<template>
  <div id="groupManage">
    <el-tree
      v-if="!isSearch"
      ref="tree"
      :props="props"
      node-key="id"
      :load="getFilterTreeList"
      :default-expanded-keys="expandedList"
      :expand-on-click-node="false"
      class="filter-tree elTree"
      lazy
    >
      <div slot-scope="{ node, data }" class="custom-tree-node">
        <p class="grow" :title="node.label" @click="nodeClick(node, data)">
          {{ node.label }}
        </p>
        <p class="font14 opertionBtn" v-if="isOperation">
          <el-tooltip :open-delay="1000" class="item" effect="dark" :content="$t('add')" placement="top">
            <i
              class="el-icon-circle-plus-outline add"
              @click="handlerTreeOperate('add', data, node)"
            />
          </el-tooltip>
          <el-tooltip :open-delay="1000" class="item" effect="dark" :content="$t('modify')" placement="top">
            <i
              v-if="node.level !== 1"
              class="el-icon-edit add"
              @click="handlerTreeOperate('edit', data, node)"
            />
          </el-tooltip>
          <el-tooltip :open-delay="1000" class="item" effect="dark" :content="$t('delete')" placement="top">
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
            @click.stop="handlerTreeOperate('add', data,node)"
          />
          <i
            v-if="node.level !== 1"
            class="el-icon-edit add"
            @click="handlerTreeOperate('edit', data,node)"
          />
          <i
            v-if="node.level !== 1"
            class="el-icon-delete del"
            @click="handlerTreeOperate('del', data,node)"
          />
        </p>
      </div>
    </el-tree>
    <!-- 添加或删除组织树 -->
    <el-dialog :title="type == 'add' ? $t('add'): $t('modify')" :visible.sync="isDialogsVisible" v-if="isDialogsVisible" width="40%">
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
        <el-button @click="isDialogsVisible = false">{{ $t("cancel") }}</el-button>
        <el-button type="primary" @click="handlerConfirm">{{ $t("confirm") }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  queryEnterpriseStandardFolderTreeId
} from '@/bpa/api/rulesCenter/handbookFiles'
import { getNodeCode } from '@/bpa/api/settings/ruleManage'
import {
  foldertree,
  foldertreeSaveCopy,
  foldertreeDeleteCopy
} from '@/bpa/api/resourcelibraryCenter'
export default {
  data() {
    return {
      type: 'add',
      treeData: [],
      isSearch: false,
      filterText: '',
      expandedList: [],
      orgid: '',
      props: {
        label: 'foldername',
        children: 'childList',
        isLeaf: function(data, node) {
          if (data.parent) {
            return false
          } else {
            return true
          }
        }
      },
      isDialogsVisible: false,
      orgForm: { name: '', code: '' },
      rules: {
        name: [{ required: true, message: ' ', trigger: 'blur' }]
      }
    }
  },
  props: {
    isOperation: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
  },
  methods: {
    async getFilterTreeList(node, resolve) {
      console.log(node)
      const id = node.data ? node.data.id : '4'
      foldertree(id).then(res => {
        if (!res) return false
        if (node.level === 0 || (node.level < 2 && res.length === 1)) {
          this.expandedList = [res[0].id]
        }
        if (node.level === 1 && res.length > 0) {
          this.$nextTick(() => {
            if (this.$refs.tree) {
              this.$refs.tree.setCurrentKey(res[0].id)
            }
          })
          this.$emit('conClick', {
            node: node,
            data: res[0]
          })
        }
        resolve(res)
      })
    },
    nodeClick(node, data) {
      this.$emit('conClick', {
        node: node,
        data: data
      })
    },
    handlerTreeOperate(type, data, node) {
      const me = this
      console.log(type, node, data)
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
        const parentid = node.parent.data.id
        this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }).then(() => {
          foldertreeDeleteCopy(data.id).then(res => {
            if (!res) return false
            this.$message({
              type: 'success',
              message: this.$t('hintText.successfullyDelete')
            })
            const node = this.$refs.tree.getNode(parentid) // 通过节点id找到对应树节点对象
            node.loaded = false
            node.expand()
          })
        })
      }
    },
    handlerConfirm() {
      this.$refs.orgRef.validate(valid => {
        if (valid) {
          foldertreeSaveCopy({
            id: !this.orgForm.id ? '' : this.orgForm.id,
            foldername: !this.orgForm.name ? '' : this.orgForm.name,
            pid: !this.orgForm.pid ? '' : this.orgForm.pid,
            // code: !this.orgForm.code ? '' : this.orgForm.code
          }).then(res => {
            if (!res) return false
            this.$message({
              type: 'success',
              message: !this.orgForm.id ? this.$t('hintText.addedSuccess') : this.$t('hintText.modifyTheSuccess')
            })
            this.isDialogsVisible = false
            if (!this.orgForm.pid) return false
            const node = this.$refs.tree.getNode(this.orgForm.pid) // 通过节点id找到对应树节点对象
            node.loaded = false
            node.expand()
          })
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('hintText.requiredFieldsCannotBeEmpty')
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.elTree{
  font-size: 13px;
}
/deep/ .el-tree-node>.el-tree-node__children{
  overflow: visible;
}
.custom-tree-node{
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
    .opertionBtn{
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
    color: $tc5;
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
