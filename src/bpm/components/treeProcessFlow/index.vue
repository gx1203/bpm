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
        :expand-on-click-node="false"
        node-key="ID"
        @node-click='handleClick'
        :filter-node-method="filterNode"
        ref="tree">
        <span class="custom-tree-node" slot-scope="{ node,data }">
          <i class="iconfont icon-moxing___" v-if="data.type === '0'"></i>
          <i v-else-if="data.type === '1'" class="iconfont icon-liucheng"></i>
          <i v-else-if="data.type === '2'" class="iconfont icon-jiedianbangzhu"></i>
          <i v-else class="iconfont icon-baocunbuju"></i>
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
        node-key="ID"
        show-checkbox
        :filter-node-method="filterNode"
        ref="tree">
        <span class="custom-tree-node" slot-scope="{ node,data }">
          <i class="iconfont icon-moxing___" v-if="data.type === '0'"></i>
          <i v-else-if="data.type === '1'" class="iconfont icon-liucheng"></i>
          <i v-else-if="data.type === '2'" class="iconfont icon-jiedianbangzhu"></i>
          <i v-else class="iconfont icon-baocunbuju"></i>
          <span :title="node.label">{{ node.label }}</span>
        </span>
      </el-tree>
    </div>
    </div>
</template>

<script>
import { getModelTree } from '../../api/flow/index'
export default {
  data () {
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
    },
    type: {
      type: String
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted () {
    this.getDepartment()
  },
  methods: {
    clickRadioNode (event) {
      if (event) event.preventDefault()
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getDepartment () {
    if(this.$route.query.pid){
         getModelTree({
          pid: this.$route.query.pid
        }).then((rt) => {
          rt.data.forEach(item => {
             if (item.type === this.type ) {
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

      }else{
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
    loadNode (node, resolve) {
      let num = ''
      if ((node.data.isProcess === 'Y' || node.data.type > 0) && this.type !=='0' ) {
        num = Number(node.data.type) + 1
      } else {
        num = node.data.type
      }
      // if(node.data.isProcess === 'N' && Number(this.type) >= Number(node.data.type)){
      //    num = node.data.type
      // } else{
      //   resolve([])
      //   return false
      // }
      if (node.level > 0) {
        getModelTree({
          pid: node.data.id,
          type: num
        }).then((rt) => {
          rt.data.forEach(item => {
            if(this.type === '0'){
            // console.log(node.data.isProcess === 'Y')
            //   if (item.isProcess === 'Y') {
            //      item.isParent = true
            //   }else{
            //      item.isParent = false
            //   }
            }else if (item.type === this.type ) {
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
    handleClick (data) {
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
