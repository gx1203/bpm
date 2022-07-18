<template>
  <el-dialog :title="$t('selectProcess')" class="person_list" :visible.sync="dialogVisible" width="50%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-row :gutter="20" class="group_container">
      <el-col :span="24" class="tree_wrap">
        <el-scrollbar class="tree_node nopadding">
          <el-tree
              v-show="!controlTree"
              :props="props"
              :load="loadNode"
              node-key="id"
              lazy
              show-checkbox
              ref="processTree"
              @check-change="handleCheckChange"
              :default-expanded-keys="[grandParentId]"
              :expand-on-click-node="false"
              :default-checked-keys="defaultChecked.map(item => (!item.id ? '':item.id))"
              :render-content="renderContent">
          </el-tree>
        </el-scrollbar>
      </el-col>
    </el-row>
    <div class="selected_list">
      <div class="selected_item" v-for="(item,index) in selectedList" :key="index">
        <span class="name">{{item.name}}</span>
        <i @click="deleteSelectedItem(item.id)" class="el-icon-close"></i>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false;$emit('input', false)">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getProcessIframeTree, searchProcessIframeTree } from '@/bpm/api/analyseWatchCenter'
export default {
  name: 'selectProcess',
  data() {
    return {
      dialogVisible: false,
      controlTree: false,
      treelist:[],
      keyWords: '',
      grandParentId: '',
      props: {
        label: 'name',
        isLeaf: function (data, node) {
          if (data.isparent === true) {
            return false
          } else {
            return true
          }
        }
      },
      selectedList: [],
      defaultChecked: []
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
      if (val) {
        this.selectedList = this.selected
        this.defaultChecked = this.selected
      }
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    loadNode (node, resolve) {
      let id = node.data ? node.data.id : '0'
      getProcessIframeTree(id).then(res => {
        if (id === '0') {
          this.grandParentId = res[0].id
        }
        resolve(res)
      })
    },
    renderContent(h, { node, data, store }) {
      let dom1 = (
        <span class="custom-tree-node">
          <span class="text margin-l5">{node.label}</span>
        </span>)
      let dom2 = (
        <span class="custom-tree-node">
          <span class="text margin-l5">{node.label}</span>
        </span>)
        if (data.pid) {
          return dom2
        }
        return dom1
    },
    filterTree () {
      if (!this.keyWords) {
        this.controlTree = false
        return false
      }
      searchProcessIframeTree({
        name: this.keyWords
      }).then(res => {
        this.controlTree = true
        this.treelist = res
      })
    },
    confirm () {
      this.dialogVisible = false
      this.$refs.processTree.setCheckedKeys([])
      this.$emit('input', false)
      this.$emit('confirm', this.selectedList)
    },
    // 选择组织树
    handleCheckChange (data, checked) {
      console.log(data)
      console.log(checked)
      if (checked) {
        this.defaultChecked = []
        this.$refs.processTree.setCheckedKeys(this.selectedList.map(item => item.id), false)
        this.$refs.processTree.setCheckedKeys([data.id])
        this.selectedList = []
        this.selectedList.push({
          id: data.id,
          name: data.name,
          sort: ''
        })
      } else {
        this.selectedList = this.selectedList.filter(item => {
          return item.id != data.id
        })
        console.log(this.selectedList)
      }
    },
    // 取消选择
    deleteSelectedItem (id) {
      this.selectedList = this.selectedList.filter(item => {
        return item.id != id
      })
      this.$refs.processTree.setCheckedKeys([id], false)
    }
  }
}
</script>

<style lang="scss" scoped>
.tree_node {
  height: 230px;
}
.selected_list {
  max-height: 70px;
  overflow: auto;
  margin-top: 10px;
  &::after {
    content: '';
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
      content: '';
      display: inline-block;
      height: 100%;
      vertical-align: middle;
    }
  }
}
</style>
