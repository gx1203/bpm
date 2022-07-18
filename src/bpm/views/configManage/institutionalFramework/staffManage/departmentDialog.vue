<template>
  <el-dialog
    title="选择部门"
    :visible.sync="dialogVisible"
    width="50%"
    append-to-body
    class="userDialog"
    top="2vh">
    <el-row :gutter="18">
      <el-col :span="24" style="height: 400px;overflow: auto;">
        <el-tree class="elTree"
          :props="props"
          :data="treeData"
          :load="loadNode"
          lazy
          node-key="ID"
          @node-click='handleNodeClick'
          :filter-node-method="filterNode"
          ref="tree">
          <span class="custom-tree-node" slot-scope="{ node, data}">
            <span>{{ node.label }}</span>
            <span v-if="data.TYPE === '0'">({{ $t('organization') }})</span>
            <span v-else-if="data.TYPE === '1'">({{ $t('company') }})</span>
            <span v-else-if="data.TYPE === '2'">({{ $t('department') }})</span>
            <span v-else>({{ $t('post') }})</span>
          </span>
        </el-tree>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getTotalOrg1, getDirectUserByOrgid } from '@/bpm/api/flow/index'
export default {
  data () {
    return {
      id: 14246,
      dialogVisible: false,
      highlight: false,
      props: {
        label: 'NAME',
        isLeaf: 'isParent'
      },
      treeData: [],
      userData: {},
      filterText: '',
      selectIndex: -1,
      pageLoading: false,
      multipleSelection: [],
      pageSize: 8,
      pageNum: 1
    }
  },
  props: {
    value: {
      type: Boolean
    },
    isMore: {
      type: Boolean
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
      if (val) {
        this.getDepartment()
        this.getUser()
      }
    },
    dialogVisible (val) {
      this.$emit('input', val)
    },
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.NAME.indexOf(value) !== -1
    },
    getDepartment () {
      getTotalOrg1({
        pid: this.id,
        type: '0,1,2,4'
      }).then((rt) => {
        rt.data.forEach(item => {
          item.isParent = false
        })
        this.treeData = rt.data
      }).catch((er) => {
        console.log(er)
      })
    },
    handleNodeClick (data) {
      this.$emit('confirm', data)
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
        getTotalOrg1({
          pid: node.data.ID,
          type: '0,1,2,4'
        }).then((rt) => {
          rt.data.forEach(item => {
            item.isParent = !this.toBoolean(item.isParent)
          })
          resolve(rt.data)
        }).catch((er) => {
          console.log(er)
        })
      }
    },
    getUser () {
      this.pageLoading = true
      getDirectUserByOrgid({
        attr: {
          orgid: 40436
        },
        logic: 'or',
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        filters: []
      }).then((rt) => {
        this.pageLoading = false
        this.userData = rt.data
      })
    },
    handleCurrentChange (val) {
      this.selectIndex = -1
      this.getUser()
    },
    handleSelectedChange (val) {
      if (val) {
        this.highlight = true
        this.selectIndex = this.userData.list.findIndex(item => item.cnname === val.cnname)
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    close (i) {
      this.highlight = false
      this.selectIndex = -1
    },
    confirm () {
      this.dialogVisible = false
      if (this.isMore) {
        this.$emit('confirm', this.multipleSelection)
      } else {
        if (this.selectIndex > -1) {
          this.$emit('confirm', [this.userData.list[this.selectIndex]])
        } else {
          this.$emit('confirm', [])
        }
      }
    }
  }
}
</script>
<style lang="scss">
  .userDialog{
    .el-input__inner{
      // border: 0;
      border-bottom: 1px solid #e5e5e5;
    }
  }
</style>

<style lang="scss" scoped>

</style>
