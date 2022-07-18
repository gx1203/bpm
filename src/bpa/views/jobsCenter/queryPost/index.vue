<template>
  <div id="responsible" class="pageWrap">
    <div class="pageContent">
      <div class="leftTree" ref="leftTree">
        <el-row>
          <div>
            <bas-search
              :placeholder="$t('placeholderText.pleaseEnterTheContent')"
              v-model="keyWords"
              @fnSearch="filterTree"
            />
          </div>
        </el-row>
        <div class="left_tree_wrapper margin-t10">
          <el-tree
            :props="propss"
            :load="loadNode"
            show-checkbox
            lazy
            node-key="id"
            v-if="controlTree"
            :default-expanded-keys="[grandParentId]"
            highlight-current
            ref="orgTree"
            @check="checkOrg"
          ></el-tree>

          <el-tree
            :data="datas"
            :props="defaultProps"
            show-checkbox
            v-show="!controlTree"
            ref="trees"
            node-key="id"
            default-expand-all
            :default-checked-keys="keyse"
            :filter-node-method="filterNode"
            :expand-on-click-node="false"
            @check="checkOrg"
          >
          </el-tree>
        </div>
      </div>
      <div class="listContent">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="pandect" name="pandect">
            <pandect
              v-if="activeName === 'pandect'"
              :ids="ids"
              :relatelists="relatelists"
              :stationName="stationName"
              :owners="owners"
              :appovers="appovers"
              :notiers="notiers"
              @submit="submit"
            ></pandect>
          </el-tab-pane>
          <el-tab-pane
            :label="jobDuties"
            name="station"
            :disabled="!ids.length ? true : false"
          >
            <station v-if="activeName === 'station'" :ids="ids"></station>
          </el-tab-pane>
          <el-tab-pane
            :label="risk"
            name="risk"
            :disabled="!ids.length ? true : false"
          >
            <risk v-if="activeName === 'risk'" :ids="ids"></risk>
          </el-tab-pane>
          <el-tab-pane
            label="RACI"
            name="raci"
            :disabled="!ids.length ? true : false"
          >
            <raci v-if="activeName === 'raci'" :ids="ids"></raci>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import pandect from './components/pandect.vue'
import station from './components/station.vue'
import risk from './components/risk.vue'
import raci from './components/raci.vue'
import {
  getRelativeOther,
  getOwnersOther,
  getAppoversOther,
  getNotiersOther,
  getJobsList,
  getJobsChildrenList,
  getTotalOrg1Tree
} from '@/bpa/api/jobsCenter'

export default {
  components: {
    pandect,
    station,
    risk,
    raci
  },
  data() {
    return {
      keyWords: '',
      stationName: [],
      keyse: [],
      relatelists: [],
      owners: [],
      appovers: [],
      notiers: [],
      datas: [],
      tags: [],
      grandParentId: '',
      controlTree: true,
      // 右侧tab默认的选中
      activeName: 'pandect',
      ids: [],
      pandect: this.$t('pandect'),
      jobDuties: this.$t('jobDuties'),
      risk: this.$t('risk'),
      propss: {
        label: 'name',
        children: 'subNodes',
        disabled: function(data, node) {
          if (data.type == 3) {
            return false
          }
          return true
        },
        isLeaf: function(data, node) {
          if (data.isParent === 'true') {
            return false
          } else {
            return true
          }
        }
      },
      defaultProps: {
        children: 'subNodes',
        label: 'name',
        disabled: function(data, node) {
          if (data.type == 3) {
            return false
          }
          return true
        }
      }
    }
  },
  //  watch: {
  //     keyWords(val) {
  //       this.$refs.trees.filter(val);
  //       console.log(val);
  //     }
  //   },
  mounted() {
    console.log('ids', this.ids)
    if (this.ids.length > 0) {
      this.stationName = JSON.parse(JSON.stringify(this.ids))
      let arr = this.stationName.map(item => {
        return item.id
      })
      this.getData(arr.join(','))
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },

    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
    },
    getData(params) {
      if (params) {
        Promise.all([
          getRelativeOther(params),
          getOwnersOther(params),
          getAppoversOther(params),
          getNotiersOther(params)
        ]).then(res => {
          if (!res) return false
          this.relatelists = res[0]
          this.owners = res[1]
          this.appovers = res[2]
          this.notiers = res[3]
        })
      }
    },
    // 查询岗位
    async getJobs() {
      this.josbsdialogVisible = true
      this.tags = JSON.parse(JSON.stringify(this.stationName))
    },
    // 加载子节点事件
    loadNode(node, resolve) {
      let id = node.data ? node.data.id : '0'
      if (id == 0) {
        this.loadfirstnode(resolve)
      } else {
        this.loadChildrnode(node, resolve)
      }
      this.$nextTick(() => {
        this.$refs.orgTree.setCheckedNodes(this.tags)
      })
    },
    // 加载第一级节点
    loadfirstnode(resolve) {
      getJobsList('0').then(res => {
        console.log(res)
        if (!res) return false
        if (res.length > 0) {
          this.grandParentId = res[0].id
          console.log(this.grandParentId)
          return resolve(res)
        }
      })
    },
    // 加载子节点
    loadChildrnode(node, resolve) {
      let obj = {
        pid: node.data.id,
        type: '0,1,2,3,4'
      }
      getJobsChildrenList(obj).then(res => {
        console.log(res)
        return resolve(res)
      })
    },
    // 点击复选框
    checkOrg(data, isChecked) {
      // console.log(data, isChecked);
      // if (isChecked) {
      //   this.tags.push(data)
      // } else {
      //   for (let i = 0; i < this.tags.length; i++) {
      //     if (data.id === this.tags[i].id) {
      //       this.tags.splice(i, 1)
      //       break
      //     }
      //   }
      // }

      if (this.controlTree) {
        this.tags = this.$refs.orgTree.getCheckedNodes()
      } else {
        this.tags = this.$refs.trees.getCheckedNodes()
      }
      // console.log('🍓', this.tags)
      if (this.tags.length > 0) {
        let arr
        arr = this.tags.map(item => {
          return item.id
        })
        // 筛选出需要显示的数据
        let temp = this.tags.filter(item => {
          return item.type === 3 || item.type === '3'
        })
        this.stationName = JSON.parse(JSON.stringify(temp))
        // debugger
        this.ids = this.stationName
        this.getData(arr.join(','))
        console.log('arr', arr)
        this.keyse = arr
      } else {
        this.activeName = 'pandect'
        this.relatelists = []
        this.owners = []
        this.appovers = []
        this.notiers = []
        this.stationName = []
        this.keyse = []
      }

      this.submit(this.stationName)
    },
    handleClose(item) {
      for (let i = 0; i < this.tags.length; i++) {
        if (item.id === this.tags[i].id) {
          this.tags.splice(i, 1)
          this.$refs.orgTree.setCheckedNodes(this.tags)
          break
        }
      }
    },
    handleClick(tab, event) {
      let self = this
      if (tab.name === 'organization') {
        self.getMenuOrgList()
      } else if (tab.name === 'role') {
        self.getMenuRoleList()
      }
    },

    filterTree() {
      if (this.controlTree) {
        this.controlTree = false
        let p = new Promise(rej => {
          getTotalOrg1Tree({}).then(res => {
            this.datas = res
            rej()
          })
        })
        p.then(result => {
          this.$refs.trees.filter(this.keyWords)
          return
        })
      }
      this.$refs.trees.filter(this.keyWords)

      console.log(' this.keyse', this.keyse)
    },

    handleCheckChange() {},
    submit(data) {
      this.ids = data
      console.log('data', data)
    }
  }
}
</script>

<style scoped lang="scss">
#responsible {
  background-color: white;
  /deep/ .el-tabs__header {
    margin: 0;
  }
}

/deep/ .el-tabs__item {
  font-size: 16px !important;
}

.listContent {
  flex: 1;
  overflow-y: auto;
}

.content {
  width: 100%;
  display: flex;
  overflow: hidden;
}
</style>
