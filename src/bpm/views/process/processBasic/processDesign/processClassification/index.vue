<template>
  <div class="process-classification-container">
    <div class="item-left">
      <!-- <el-row>
        <el-input v-model="filterText" clearable :placeholder="$t('placeholderText.enterKeywordsFiltering')"
          class="w100" />
      </el-row>
      <el-tree class="elTree" style="height:calc(100% - 146px);overflow: auto;" :props="props" ref="tree"
        :data="treeData" :load="loadNode" lazy node-key="ID" :expand-on-click-node="false"
        :filter-node-method="filterNode" @node-click="handleNodeClick">
        <span slot-scope="{ node }" class="custom-tree-node">
          <i class="iconfont icon-moxing___" />
          <span>{{ node.label }}</span>
        </span>
      </el-tree> -->
      <BasProcessTree showView="1" type="1" @confirm="handleNodeClick" />
    </div>
    <div class="item-right">
      <classify-handle v-if="isShow" :tree-data="treeDataInfo" @confirm="confirm" @next="nextStep" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
// import BasProcessTree from 'bas-component'
import BasProcessTree from '@/bpm/components/BasProcessTree'
// Vue.use(BasProcessTree)
import {
  getProcessCategoryTree,
  deleteProcessType
} from '@/bpm/api/process/processModeling/process_classification'
import {
  getProcessImgType
} from '@/bpm/api/app'
import classifyHandle from './classifyHandle'
export default {
  name: 'Classification',
  components: {
    classifyHandle,
    BasProcessTree
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
    nextStep () {
      this.$emit('next')
    },
    clickRadioNode (event) {
      if (event) event.preventDefault()
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
  .el-input {
    width: 100%;
  }
}
</style>
<style lang="scss" scoped>
.process-classification-container {
  display: flex;
  height: 100%;
}
.item-left {
  width: 250px;
  margin-right: 20px;
  .el-input {
    width: 100%;
  }
}
.item-right {
  // width: calc(100% - 270px);
  flex: 1;
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
