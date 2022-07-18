<template>
  <el-card shadow="never">
    <div class="item-left">
      <!-- <el-row>
        <el-input v-model="filterText" clearable :placeholder="$t('placeholderText.enterKeywordsFiltering')" />
      </el-row>
      <el-tree class="elTree" style="height:calc(100% - 28px);overflow: auto;" :props="props" ref="tree"
        :data="treeData" :load="loadNode" lazy node-key="ID" :expand-on-click-node="false"
        :filter-node-method="filterNode" @node-click="handleNodeClick">
        <span slot-scope="{ node, data}" class="custom-tree-node">
          <i class="iconfont icon-moxing___" />
          <span>{{ node.label }}</span>
          <span>
            <el-button icon="el-icon-edit" :title="$t('editNode')" type="text" @click.stop="add(data,$t('editNode'))" />
            <el-button v-show="!isBpa" v-if="data.grade < 4" icon="el-icon-circle-plus" :title="$t('addChildNode')"
              type="text" @click.stop="add(data,addChildNode)" />
            <el-button v-show="!isBpa" v-if="data.pid!=0" icon="el-icon-delete" :title="$t('deleteCurrentNode')"
              type="text" @click.stop="handleDeleteOne(data)" />
          </span>
        </span>
      </el-tree> -->
      <BasProcessTree showView="1" type="1" :isEdit="true" @confirm="handleNodeClick" />
    </div>
    <div class="item-right">
      <classify-handle v-if="isShow" :tree-data="treeDataInfo" @confirm="confirm" />
    </div>
    <classify-handle-dialog v-model="dialogVisible" :title="linkTitle" :item="itemData" @confirm="getDepartment" />
  </el-card>
</template>

<script>
// import { getProcessBaseTreeVo } from "@/bpm/api/flow/index";
import Vue from 'vue'
// import BasProcessTree from '@/bpm/components/BasProcessTree'
import BasProcessTree from 'bas-component'
Vue.use(BasProcessTree)
import {
  getProcessCategoryTree,
  deleteProcessType
} from '@/bpm/api/process/processModeling/process_classification'
import {
  getProcessImgType
} from '@/bpm/api/app'
import classifyHandleDialog from './classifyHandleDialog'
import classifyHandle from './classifyHandle'
export default {
  name: 'Classification',
  components: {
    classifyHandleDialog,
    classifyHandle
  },
  data () {
    return {
      isShow: false,
      dialogVisible: false,
      treeDataInfo: {},
      linkTitle: '',
      isBpa: false,
      props: {
        label: 'modelname',
        isLeaf: 'isParent'
      },
      treeData: [],
      itemData: {},
      filterText: ''
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.basuser.user
    },
    key () {
      return this.$route.fullPath
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
    add (item, data) {
      if (data === this.$t('editNode')) {
        this.itemData = Object.assign({}, item)
      } else {
        this.itemData = {
          pid: item.id
        }
      }
      this.linkTitle = data
      this.dialogVisible = true
    },
    clickRadioNode (event) {
      if (event) event.preventDefault()
    },
    handleDeleteOne (data) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          deleteProcessType(data.id).then(rt => {
            if (rt.status === '200') {
              this.$message({
                message: this.$t('hintText.successfullyDelete'),
                type: 'success'
              })
              this.getDepartment()
            } else {
              this.$message({
                message: this.$t('hintText.failToDelete'),
                type: 'error'
              })
            }
          })
        })
        .catch(_ => { })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.modelname.indexOf(value) !== -1
    },
    getDepartment () {
      if (this.$route.query.pid) {
        getProcessCategoryTree({
          pid: this.$route.query.pid
        })
          .then(rt => {
            rt.data.forEach(item => {
              item.isParent = !this.toBoolean(item.isParent)
            })
            this.treeData = rt.data
          })
          .catch(er => {
            console.log(er)
          })
      } else {
        getProcessCategoryTree({
          pid: 0,
          type: 0
        })
          .then(rt => {
            rt.data.forEach(item => {
              item.isParent = !this.toBoolean(item.isParent)
            })
            this.treeData = rt.data
          })
          .catch(er => {
            console.log(er)
          })
      }
      getProcessImgType().then(rt => {
        this.isBpa = rt.data === 'bpa'
      })
        .catch(er => {
        })
    },
    toBoolean (val) {
      switch (val.toLowerCase()) {
        case 'y':
        case 1:
        case 'yes':
          return true
        case 'n':
        case 0:
        case 'no':
        case null:
          return false
        default:
          return Boolean(val)
      }
    },
    loadNode (node, resolve) {
      let num = ''
      if (node.data.isProcess === 'Y' || node.data.type > 0) {
        num = Number(node.data.type) + 1
      } else {
        num = node.data.type
      }
      if (node.level > 0) {
        getProcessCategoryTree({
          pid: node.data.id,
          type: 0
        })
          .then(rt => {
            rt.data.forEach(item => {
              item.isParent = !this.toBoolean(item.isParent)
            })
            resolve(rt.data)
          })
          .catch(er => {
            console.log(er)
          })
      }
    },
    confirm () {
      this.$refs.tree.getDepartment()
      this.isShow = false
    },
    handleNodeClick (data) {
      this.treeDataInfo = data
      this.isShow = true
    }
  }
}
</script>
<style lang="scss">
.item-left {
  .el-input__inner {
    border: none;
    border-bottom: 1px solid $dc1;
  }
  .el-input {
    width: calc(100% - 90px);
  }
}
</style>
<style lang="scss" scoped>
.item-left {
  float: left;
  width: 20%;
  .el-input__inner {
    border: none;
    border-bottom: 1px solid $dc1;
  }
  .el-input {
    width: calc(100% - 90px);
  }
}
.item-right {
  float: right;
  width: 78%;
  .table-header {
    position: relative;
    background: $bc2;
    display: flex;
    align-items: center;
    .all-check {
      position: absolute;
      left: 20px;
    }
  }
}
</style>
