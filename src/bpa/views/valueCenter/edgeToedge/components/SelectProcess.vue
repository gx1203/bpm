<template>
  <el-dialog
    title="选择流程"
    :visible="processDialogVisible"
    v-if="processDialogVisible"
    width="40%"
    :before-close="handleClose">
    <el-row class="margin-b10">
      <bas-search
        :placeholder="$t('placeholderText.pleaseEnterTheContent')"
        v-model="keyWords"
        @fnSearch="search"
      />
    </el-row>

    <el-row>
      <el-scrollbar style="height: 350px;">
          <el-tree
            v-show="lazyShow"
            :props="defaultProps"
            check-strictly
            :load="loadNode"
            node-key="id"
            lazy
            show-checkbox
            ref="lazyProcessTree"
            @check-change="handleCheckChange"
            :default-expanded-keys="[grandParentId]"
            :expand-on-click-node="false"
          >
          </el-tree>
          <el-tree
            v-show="searchShow"
            :props="defaultProps"
            :data="treelist"
            node-key="id"
            show-checkbox
            ref="searchProcessTree"
            @check-change="handleCheckChange"
            :expand-on-click-node="false"
            :default-expand-all="true">
          </el-tree>
      </el-scrollbar>

    </el-row>
    <span slot="footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getProcessIframeTree, searchProcessIframeTree1 } from "@/bpa/api/componentsApi";

export default {
  created() {
    this.selectedList = this.selected
  },
  props: {
    processDialogVisible: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      keyWords: '', // 搜索关键词
      lazyShow: true, // 是否显示懒加载树
      defaultProps: { // 默认属性配置
        label: 'name',
        isLeaf: function (data, node) {
          if (data.isparent === true) {
            return false
          } else {
            return true
          }
        },
        disabled (data) {
          return data.isVisible === '0';
        }
      },
      searchShow: false,
      grandParentId: '', // 默认展开的节点
      // defaultCheckedKeys: [], // 选择节点key
      selectedList: [], // 选中节点数组
      treelist: [], // 普通树数据源
      node: null,
      resolve: null
    };
  },
  watch: {
    // keyWords(val) {
    //   if(val.trim().length === 0) {
    //     this.$refs.searchProcessTree.setCheckedKeys([])
    //     this.treelist = []
    //     this.selectedList = []
    //     this.searchShow = false
    //     this.lazyShow = true
    //     this.$nextTick(() => {
    //       this.loadNode(this.node, this.resolve)
    //     })
    //     console.log(this.$refs.searchProcessTree)
    //   }
    // }
  },
  methods: {
    // 弹框确定事件
    confirm() {
      this.$emit('confirm', this.selectedList)
      this.handleClose()
    },
    // 弹框关闭事件
    handleClose() {
      this.keyWords = ''
      this.selectedList = []
      this.$emit('update:processDialogVisible',  false)
    },
    // 搜索方法
    search() {
      // if(this.keyWords.trim().length === 0) return this.$message.warning('请输入关键词')
      if (!this.keyWords) {
        this.lazyShow = true
        this.searchShow = false
        return false;
      }
      this.lazyShow = false
      this.searchShow = true
      this.treelist = []
      this.selectedList = []
      searchProcessIframeTree1({
        name: this.keyWords,
        moduletype: 'rulemanagement',
        id: this.grandParentId
      }).then(res => {
        if (!res) return false;
        this.treelist = res
      })
    },
    //懒加载数据
    loadNode (node, resolve) {
      console.log(node, node.level)
      if(node.level === 0) {
        this.node = node
        this.resolve = resolve
      }
      let id = node.data ? node.data.id : '0'
      getProcessIframeTree(id).then(res => {
        if (id === '0') {
          this.grandParentId = res[0].id
        }
        resolve(res)
      })
    },
    // 节点选中状态发生变化时的回调
    handleCheckChange(data, checked) {
      console.log('节点选中状态发生变化时的回调')
      console.log(data.id, checked)
      if (checked) {
        this.selectedList = []
        if (this.lazyShow) {
          this.$refs.lazyProcessTree.setCheckedKeys([data.id])
        } else {
          this.$refs.searchProcessTree.setCheckedKeys([data.id])
        }

        // this.defaultCheckedKeys = [data.id]
        this.selectedList.push({
          id: data.id,
          name: data.name,
          sort: ''
        })
      } else {
        if(this.selectedList.length === 0 || data.id !== this.selectedList[0].id) return
        // this.selectedList = this.selectedList.filter(item => item.id !== data.id)

        if (this.lazyShow) {
          this.$refs.lazyProcessTree.setCheckedKeys([])
        } else {
          this.$refs.searchProcessTree.setCheckedKeys([])
        }
        this.selectedList = []
      }
    }
  }
};
</script>
