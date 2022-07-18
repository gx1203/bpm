<template>
  <div id="treeOrganization">
    <el-input
      v-model="filterText"
      clearable
      :placeholder="$t('placeholderText.enterKeywordsFiltering')"
    />
    <div class="treeWrap" style="margin-top: 10px;">
      <el-tree
        v-if="!isMore"
        class="elTree"
        style="height:calc(100% - 28px);overflow: auto"
        :props="props"
        ref="tree"
        :data="treeData"
        :load="loadNode"
        lazy
        :expand-on-click-node="false"
        node-key="ID"
        :filter-node-method="filterNode"
        @node-click="handleClick"
      >
        <span slot-scope="{ node,data }" class="custom-tree-node">
          <i v-if="data.type === '0'" class="iconfont icon-moxing___" />
          <i v-else-if="data.type === '1'" class="iconfont icon-liucheng" />
          <i v-else-if="data.type === '2'" class="iconfont icon-jiedianbangzhu" />
          <i v-else class="iconfont icon-baocunbuju" />
          <span :title="node.label">{{ node.label }}</span>
        </span>
      </el-tree>
      <el-tree
        v-else
        class="elTree"
        style="height:calc(100% - 28px);overflow: auto"
        :props="props"
        :data="treeData"
        :load="loadNode"
        lazy
        node-key="ID"
        show-checkbox
        :filter-node-method="filterNode"
        @node-click="handleClick"
        ref="tree"
      >
        <span slot-scope="{ node,data }" class="custom-tree-node">
          <i v-if="data.type === '0'" class="iconfont icon-moxing___" />
          <i v-else-if="data.type === '1'" class="iconfont icon-liucheng" />
          <i v-else-if="data.type === '2'" class="iconfont icon-jiedianbangzhu" />
          <i v-else class="iconfont icon-baocunbuju" />
          <span :title="node.label">{{ node.label }}</span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
import { getModelTree } from '../../api/flow/index'
export default {
  props: {
    isMore: {
      type: Boolean
    },
    num: {
      type: String
    }
  },
  data() {
    return {
      props: {
        label: 'name',
        isLeaf: 'isParent'
      },
      treeData: [],
      filterText: '',
      radioNode: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
    this.getDepartment()
  },
  methods: {
    clickRadioNode(event) {
      if (event) event.preventDefault()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getDepartment() {
      if (this.$route.query.pid) {
        getModelTree({
          pid: this.$route.query.pid
        }).then((rt) => {
          rt.data.forEach(item => {
            if (Number(this.num) === 1) {
              item.isParent = true
            } else {
              if (item.isParent === 'Y') {
                item.isParent = false
              } else {
                item.isParent = true
              }
            }
          })
          this.treeData = rt.data
        }).catch((er) => {
          console.log(er)
        })
      } else {
        getModelTree({
          pid: 0,
          type: 0
        }).then((rt) => {
          rt.data.forEach(item => {
            if (item.isParent === 'Y') {
              item.isParent = false
            } else {
              item.isParent = true
            }
          })
          this.treeData = rt.data
        }).catch((er) => {
          console.log(er)
        })
      }
    },
    loadNode(node, resolve) {
      let num = ''
      if (node.data.isProcess === 'Y' || node.data.type > 0) {
        num = Number(node.data.type) + 1
      } else {
        num = node.data.type
      }
      if (node.level > 0) {
        getModelTree({
          pid: node.data.id,
          type: num
        }).then((rt) => {
          rt.data.forEach(item => {
            if (this.num && node.level === Number(this.num) - 1) {
              item.isParent = true
            } else {
              if (item.isParent === 'Y') {
                item.isParent = false
              } else {
                item.isParent = true
              }
            }
          })
          resolve(rt.data)
        }).catch((er) => {
          console.log(er)
        })
      }
    },
    handleClick(data) {
      if (this.isMore) {
        this.$emit('confirm', this.$refs.tree.getCheckedNodes())
      } else {
        this.$emit('confirm', data)
      }
    }
  }
}
</script>
<style lang="scss">
#treeOrganization {
  .el-input__inner{
    border: none;
    border-bottom: 1px solid $dc1;
  }
}
</style>

<style lang="scss" scoped>

</style>
