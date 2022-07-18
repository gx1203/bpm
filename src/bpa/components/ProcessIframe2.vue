<template>
<el-scrollbar class="left_tree_wrapper">
  <el-input clearable :placeholder="pleaseEnterTheContent" :title="pleaseEnterTheContent" class="search_component" v-model="keyWords" @keyup.13.native="filterTree">
    <el-button type="primary" slot="append" @click.stop="filterTree"> {{$t('search')}}</el-button>
  </el-input>
  <el-tree
    v-show="!controlTree"
    :props="props"
    :load="loadNode"
    node-key="id"
    lazy
    :default-expanded-keys="[grandParentId]"
    :expand-on-click-node="false"
    @node-click="handlerNodeClick"
    :render-content="renderContent">
  </el-tree>
  <el-tree
    v-show="controlTree"
    :props="props"
    :default-expand-all="true"
    :data="treelist"
    @node-click="handlerNodeClick"
    :render-content="renderContent">
  </el-tree>
</el-scrollbar>
</template>
<script>
import { getProcessIframeTree, searchProcessIframeTree, getNodePermissions } from '@/bpa/api/componentsApi'
export default {
  name: 'ProcessIframe',
  data() {
    return {
      controlTree: false,
      treelist: [],
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
      pleaseEnterTheContent:this.$t("placeholderText.pleaseEnterTheContent"),
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
          <span class="process_01"></span>
          <span class="text">{node.label}</span>
        </span>)
      let dom2 = (
        <span class="custom-tree-node">
          <span class="process_02"></span>
          <span class="text">{node.label}</span>
        </span>)
      if (data.pid) {
        return dom2
      }
      return dom1
    },
    handlerNodeClick (data, node, type) {
      console.log(data)
      console.log(node)
      console.log(type)
      this.$emit('click_', data)
      // let obj = {'filters': [{'key': data.id, 'opt': 'LIKE', 'type': 'S', 'value': ''},
      //   {'key': 0, 'opt': 'LIKE', 'type': 'S', 'value': '0'}]}
      // getNodePermissions(obj).then(res => {
      //   console.log(res)
      //   this.$emit('click_', res.list)
      // })
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
