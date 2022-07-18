<template>
<div id="treeOrganization">
    <div class="treeWrap" style="margin-top: 10px;">
      <el-tree class="elTree"
        style=" overflow: auto;"
        :props="props"
        :data="treeData"
        :load="loadNode"
        lazy
        node-key="ID"
        @check-change='handleClick'
        :filter-node-method="filterNode"
        :check-strictly='true'
        :default-checked-keys="treeCkeck"
        show-checkbox
        ref="tree">
        <span class="custom-tree-node" slot-scope="{ node, data}">
          <span>{{ node.label }}</span>
          <span v-if="data.TYPE === '0'">({{ $t('organization') }})</span>
          <span v-else-if="data.TYPE === '1'">({{ $t('company') }})</span>
          <span v-else-if="data.TYPE === '2'">({{ $t('department') }})</span>
          <span v-else>({{ $t('post') }})</span>
        </span>
      </el-tree>
    </div>
    </div>
</template>
<script>
import { getChildren } from '@/bpm/api/configManage/institutionalFramework/organization.js'
export default {
  data () {
    return {
      props: {
        label: 'NAME',
        isLeaf: 'isParent'
      }
    }
  },
  computed: {
    treeCkeck: function () {
      return this.items.split(',')
    }
  },
  props: {
    items: {
      type: String
    },
    treeData: {
      type: Array
    }
  },

  methods: {
    clickRadioNode (event) {
      if (event) event.preventDefault()
    },
    filterNode (value, data) {
      if (!value) return true
      return data.NAME.indexOf(value) !== -1
    },
    toBoolean (val) {
      switch (val.toLowerCase()) {
        case 'true': case 1: case 'yes': return true
        case 'false': case 0: case 'no': case null: return false
        default:return Boolean(val)
      }
    },
    loadNode (node, resolve) {
      if (node.level > 0) {
        getChildren(node.data.ID).then((rt) => {
          rt.data.forEach(item => {
            item.NAME = item.name
            item.ID = item.id
            item.TYPE = item.type
            // item.isParent = !this.toBoolean(item.isParent)
          })
          resolve(rt.data)
        }).catch((er) => {
          console.log(er)
        })
      }
    },
    handleClick (data) {
      this.$emit('confirm', this.$refs.tree.getCheckedNodes())
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
