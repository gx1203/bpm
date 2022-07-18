<template>
  <el-dialog
    :visible="dialogVisible"
    width="width"
    append-to-body
    @close="dialogCancel"
    @open="dialogOpen"
  >
    <template #title>
      <div>
        <span class="title">{{ title }}</span>
      </div>
    </template>
    <el-row>
      <!-- 树形控件 -->
      <el-col>
        <!-- 懒加载树 -->
        <el-tree
          v-if="currentTreeType === 'lazyTree'"
          ref="lazyTree"
          node-key="id"
          :props="lazyProps"
          :load="loadNode"
          lazy
          :check-strictly="checkStrictly"
          :highlight-current="highlightCurrent"
          :expand-on-click-node="expandOnClickNode"
          :default-expanded-keys="expandedKeys"
          :default-checked-keys="checkedKeys"
          :show-checkbox="showCheckbox"
          @check-change="handleCheckChange"
          @node-click="handleNodeClick"
        >
          <template #default="{ data }">
            <div>{{ data.name }}</div>
          </template>
        </el-tree>
        <!-- 普通树 -->
        <el-tree
          v-else
          ref="tree"
          node-key="id"
          :data="treeList"
          :props="props"
          :check-strictly="checkStrictly"
          :highlight-current="highlightCurrent"
          :expand-on-click-node="expandOnClickNode"
          :default-expanded-keys="expandedKeys"
          :default-checked-keys="checkedKeys"
          :show-checkbox="showCheckbox"
          @check-change="handleCheckChange"
          @node-click="handleNodeClick"
        >
          <template #default="{ node, data }">
            <div @click="show(node, data)">{{ data.name }}</div>
          </template>
        </el-tree>
      </el-col>
    </el-row>
    <!-- 对以选中的节点进行展示 -->
    <el-divider v-if="checkedNodes.length"></el-divider>
    <div class="tag-box">
      <el-tag
        v-for="checkedNode in checkedNodes"
        :key="checkedNode.id"
        :disable-transitions="true"
        effect="dark"
        size="large"
        closable
        @close="handleRemove(checkedNode)"
        >{{ checkedNode.code + checkedNode.name }}</el-tag
      >
    </div>
    <template #footer>
      <div class="footer">
        <el-button @click="dialogCancel">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="dialogConfirm">{{
          $t('confirm')
        }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import { getProcessIframeTree } from '@/bpa/api/componentsApi/index.js'

export default {
  name: 'SelectPublishedProcess',
  created() {},
  mounted() {},
  props: {
    // 是否显示对话框
    dialogVisible: {
      type: Boolean,
      default: false
    },
    // 对话框宽度
    width: {
      type: String,
      default: '50%'
    },
    title: {
      type: String,
      default() {
        return this.$t('selectProcess')
      }
    },
    // 是否显示复选框
    showCheckbox: {
      type: Boolean,
      default: true
    },
    // 是否高亮显示激活节点
    highlightCurrent: {
      type: Boolean,
      default: true
    },
    checkStrictly: {
      type: Boolean,
      default: true
    },
    // 点击当前节点时打开其子节点
    expandOnClickNode: {
      type: Boolean,
      default: false
    },
    // 默认展开节点
    defaultExpandedKeys: {
      type: Array,
      default() {
        return []
      }
    },
    // 默认选中节点
    defaultCheckedKeys: {
      type: Array,
      default() {
        return []
      }
    },
    defaultCheckedNodes: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      currentTreeType: 'lazyTree',
      treeList: [],
      // 树默认配置
      props: {
        label: 'label',
        children: 'children',
        disabled: function(data, node) {
          return data.isSelect === 'N' || node.level === 2
        },
        isLeaf: data => !data.isparent
      },
      // 懒加载树默认配置
      lazyProps: {
        label: 'name',
        children: 'children',
        disabled: function(data, node) {
          return data.isSelect === 'N' || node.level === 2
        },
        isLeaf: data => !data.isparent
      },
      checkedKeys: [],
      expandedKeys: [],
      checkedNodes: []
    }
  },
  mounted() {},
  methods: {
    handleRemove(tag) {
      const id = tag.id
      this.checkedNodes = this.checkedNodes.filter(item => item.id !== id)
      if (this.currentTreeType === 'lazyTree') {
        this.$refs.lazyTree.setCheckedNodes(this.checkedNodes)
      } else {
        this.$refs.tree.setCheckedNodes(this.checkedNodes)
      }
    },
    // 对话框打开事件
    dialogOpen() {
      if (this.defaultExpandedKeys.length) {
        this.expandedKeys = JSON.parse(JSON.stringify(this.defaultExpandedKeys))
      }
      if (this.defaultCheckedKeys.length) {
        this.checkedKeys = [
          ...new Set([
            ...this.checkedKeys,
            JSON.parse(JSON.stringify(this.defaultCheckedKeys))
          ])
        ]
      }
      if (this.defaultCheckedNodes.length) {
        this.checkedKeys = [
          ...new Set([
            ...this.checkedKeys,
            JSON.parse(
              JSON.stringify(this.defaultCheckedNodes.map(item => item.id))
            )
          ])
        ]
        this.checkedNodes = JSON.parse(JSON.stringify(this.defaultCheckedNodes))
      }
      if (this.$refs.lazyTree || this.$refs.tree) {
        this.$nextTick(() => {
          if (this.currentTreeType === 'lazyTree') {
            this.$refs.lazyTree.setCheckedNodes(this.checkedNodes)
          } else {
            this.$refs.tree.setCheckedNodes(this.checkedNodes)
          }
        })
      }
    },
    // 对话框取消和关闭事件
    dialogCancel() {
      this.resetChecked()
      this.$emit('update:dialogVisible', false)
    },
    // 点击确认按钮
    async dialogConfirm() {
      let selectedNodes = []
      if (this.currentTreeType === 'lazyTree') {
        selectedNodes = this.$refs.lazyTree.getCheckedNodes()
      } else {
        selectedNodes = this.$refs.tree.getCheckedNodes()
      }
      let allNodes = [...this.checkedNodes, ...selectedNodes]
      const ids = [...new Set(allNodes.map(item => item.id))]
      let newNodes = []
      ids.forEach(id => {
        if(!newNodes.map(item => item.id).includes(id)) {
          newNodes.push(allNodes.filter(item1 => item1.id === id)[0])
        }
      })
      await this.$emit('publishedProcessDialogConfirm', newNodes)
      this.$emit('update:dialogVisible', false)
    },
    // 节点点击事件
    handleNodeClick(data) {
      console.log(data)
    },
    // 勾选节点事件
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
      const flag = this.checkedNodes.map(item => item.id).includes(data.id)
      if (checked) {
        if (!flag) {
          this.checkedNodes.unshift(data)
        }
      } else {
        if (flag) {
          this.checkedNodes = this.checkedNodes.filter(
            item => item.id !== data.id
          )
        }
      }
    },
    // 懒加载事件
    async loadNode(node, resolve) {
      let id = node.data?.id || '0'
      let res = await getProcessIframeTree(id, 'rulemanagement')
      if (node.level === 0) {
        this.expandedKeys = res.map(item => item.id)
      }
      // 定义根据流程状态排除项
      const externals = ['2']
      res = res.filter(item => !externals.includes(item.id))
      // 返回树数据
      await resolve(res)
      this.$nextTick(() => {
        if (this.currentTreeType === 'lazyTree') {
          this.$refs.lazyTree.setCheckedNodes(this.checkedNodes)
        } else {
          this.$refs.tree.setCheckedNodes(this.checkedNodes)
        }
      })
    },
    // 清空选中节点
    resetChecked() {
      if (this.currentTreeType === 'lazyTree') {
        this.$refs.lazyTree.setCheckedNodes([])
      } else {
        this.$refs.tree.setCheckedNodes([])
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  font-size: 16px;
}
.footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.tag-box {
  .el-tag {
    margin: 5px 10px;
  }
}
</style>
