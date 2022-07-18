<template>
<div id="treeOrganization">
    <el-input clearable
      :placeholder="$t('placeholderText.enterKeywordsFiltering')"
      v-model="filterText">
    </el-input>
    <div class="treeWrap" style="margin-top: 10px;">
      <el-tree class="elTree"
        v-if="!isMore"
        style="height:calc(100% - 28px);overflow: auto"
        :props="props"
        :data="treeData"
        :load="loadNode"
        lazy
        node-key="ID"
        @node-click='handleClick'
        :filter-node-method="filterNode"
        ref="tree">
        <span class="custom-tree-node" slot-scope="{ node }">
          <span :title="node.label">{{ node.label }}</span>
        </span>
      </el-tree>
      <el-tree class="elTree"
        v-else
        @node-click='handleClick'
        style="height:calc(100% - 28px);overflow: auto"
        :props="props"
        :data="treeData"
        :load="loadNode"
        lazy
        node-key="id"
        show-checkbox
        :filter-node-method="filterNode"
        ref="tree">
        <span class="custom-tree-node" slot-scope="{ node }">
          <span :title="node.label">{{ node.label }}</span>
        </span>
      </el-tree>
    </div>
    </div>
</template>

<script>
import { getMobileProcesstTree } from '../../api/flow/index'
export default {
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
  props: {
    isMore: {
      type: Boolean
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted () {
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
      getMobileProcesstTree({
        pid: -1
      }).then((rt) => {
        // rt.data.forEach(item => {
        //   item.isParent = false
        // })
        this.treeData = rt.data
        this.$emit('confirm', rt.data[0])
        // this.$emit('confirm', this.$refs.tree.getCheckedNodes())
      }).catch((er) => {
        console.log(er)
      })
    },
    toBoolean(val) {
      switch (val.toLowerCase()) {
        case 'y': case 1: case 'yes': return true
        case 'n': case 0: case 'no': case null: return false
        default:return Boolean(val)
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
        getMobileProcesstTree({
          pid: node.data.id,
        }).then((rt) => {
          rt.data.forEach(item => {
            if(item.pid === '0'){
              item.isParent = true
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
