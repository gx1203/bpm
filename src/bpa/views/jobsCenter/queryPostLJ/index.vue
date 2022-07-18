<template>
  <div id="responsible">
    <el-row :gutter="20">
      <el-col :span="5" class="tree_wrap">
        <el-row>
          <el-input
            placeholder="请输入内容"
            class="search_component remove-margin-b"
            v-model="filterText"
            clearable
            @keyup.13.native="abstractSearch"
          >
            <el-button type="primary" @click="abstractSearch" slot="append">搜索</el-button>
          </el-input>
        </el-row>
        <el-scrollbar class="tree_node">
          <el-tree
            v-show="!isSearch"
            :props="props"
            :isLeaf="isLeaf"
            node-key="ID"
            :load="getFilterTreeList"
            :default-expanded-keys="expandedList"
            :expand-on-click-node="false"
            :check-on-click-node="true"
            ref="asyncTree"
            show-checkbox
            @node-click="handlerNodeClick"
            @check="handlerNodeChecked"
            lazy
          >
          </el-tree>
          <el-tree
            v-show="isSearch"
            :props="searchProps"
            :isLeaf="isLeaf"
            default-expand-all
            show-checkbox
            node-key="ID"
            :data="treeData"
            ref="menuTree"
            :default-expanded-keys="expandedList"
            :expand-on-click-node="false"
            :check-on-click-node="true"
            @node-click="handlerNodeClick"
            @check="handlerNodeChecked"
          >
          </el-tree>
        </el-scrollbar>
      </el-col>
      <el-col :span="19">
        <el-form :model="searchForm" label-width="80px" style="    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 12px 0 4px 0;">
          <el-row>
            <el-col :span="7" :offset="1">
              <el-form-item :label="$t('processName2')">
                <el-input clearable v-model="searchForm.listname" placeholder="流程名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="1">
              <el-form-item label="负责部门">
                <el-input clearable v-model="searchForm.listorgname" placeholder="负责部门"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="体系">
                <el-select clearable v-model="searchForm.typename" :placeholder="$t('pleaseSelect')" style="width: 100%">
                  <el-option
                    v-for="item in typeNameOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="总览" name="pandect">
            <!-- <pandect v-if="activeName === 'pandect'" :ids="ids" @submit="submit"></pandect> -->
            <pandect v-if="activeName === 'pandect'" :idArr="ids" :searchForm="searchForm"></pandect>
          </el-tab-pane>
          <el-tab-pane label="工作职责" name="station" :disabled="!ids.length ? true:false">
            <station v-if="activeName === 'station'" :idArr="ids"></station>
          </el-tab-pane>
          <el-tab-pane label="风险" name="risk" :disabled="!ids.length ? true:false">
            <risk v-if="activeName === 'risk'" :idArr="ids"></risk>
          </el-tab-pane>
          <el-tab-pane label="RACI" name="raci" :disabled="!ids.length ? true:false">
            <raci v-if="activeName === 'raci'" :idArr="ids"></raci>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import pandect from './components/pandect.vue'
import station from './components/station.vue'
import risk from './components/risk.vue'
import raci from './components/raci.vue'
import { abstractSearch, getTreeList, getRelative } from '@/bpa/api/jobsCenter'
export default {
  components: {
    pandect,
    station,
    risk,
    raci
  },
  data() {
    return {
      // 右侧tab默认的选中
      activeName: 'pandect',
      ids: [],
      selectedId: [],
      filterText: '',
      isSearch: false,
      props: {
        label: 'name',
        children: 'zones',
        isLeaf: function (data, node) {
          if (data.isParent === 'true') {
            return false
          } else {
            return true
          }
        }
      },
      searchProps: {
        label: 'name',
        children: 'subNodes',
        isLeaf: function (data, node) {
          if (data.isParent === 'true') {
            return false
          } else {
            return true
          }
        }
      },
      expandedList: [],
      treeData: [],
      searchForm: {},
      typeNameOptions: [{
        label: '全部',
        value: ''
      }, {
        label: 'EMS',
        value: 'EMS'
      }, {
        label: 'OHSAS',
        value: 'OHSAS'
      }, {
        label: 'ISMS',
        value: 'ISMS'
      }, {
        label: 'RMS',
        value: 'RMS'
      }, {
        label: 'EnMs',
        value: 'EnMs'
      }, {
        label: 'QMS',
        value: 'QMS'
      }],
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  mounted() {},
  methods: {
    // 树形数据
    getFilterTreeList (node, resolve) {
      let id = node.data ? node.data.ID : '0'
      getTreeList(id).then(res => {
        if (!res) return false
        if (id === '0') {
          this.expandedList = [res[0].ID]
        }
        resolve(res)
      })
    },
    handleClick(tab, event) {
      let self = this
      if (tab.name === 'organization') {
        self.getMenuOrgList()
      } else if (tab.name === 'role') {
        self.getMenuRoleList()
      }
    },
    // submit(data) {
    //   this.ids = data
    // },
    // ==========
    abstractSearch () {
      if (this.filterText) {
        this.isSearch = true
        abstractSearch({orgname: this.filterText}).then(res => {
          this.treeData = res
        })
      } else {
        this.isSearch = false
      }
    },
    isLeaf (data, node) {
      console.log(data)
      console.log(node)
    },
    deepSee (list) {
      if (list && list.length > 0) {
        list.forEach((item, index) => {
          this.selectedId.push(list.ID)
          if (index === list.length - 1) {
            this.ids = Array.from(new Set(this.selectedId))
            console.log(this.ids)
          }
          if (item.isParent) {
            getTreeList(item.ID).then(res => {
              if (!res) return false
              if (item.ID === '0') {
                this.expandedList = [res[0].ID]
              }
              if (item.isParent) {
                this.deepSee(res)
              }
            })
          }
        })
      }
    },
    handlerNodeChecked(checkedNodes, checkedKeys) {
      this.selectedId = []
      console.log(checkedNodes, checkedKeys)
      if (checkedKeys.checkedKeys) {
        this.selectedId = checkedKeys.checkedKeys
      }
      if (checkedKeys.checkedNodes && checkedKeys.checkedNodes.length > 0) {
        checkedKeys.checkedNodes.forEach((item, index) => {
          if (item.isParent === 'true') {
            getTreeList(item.ID).then(res => {
              if (res && res.length > 0) {
                res.forEach((list, index2) => {
                  this.selectedId.push(list.ID)

                  getTreeList(list.ID).then(resp => {
                    if (resp && resp.length > 0) {
                      resp.forEach((list3, index3) => {
                        this.selectedId.push(list3.ID)

                        getTreeList(list3.ID).then(resps => {
                          if (resps && resps.length > 0) {
                            resps.forEach((list4, index4) => {
                              this.selectedId.push(list4.ID)
                              if (index === checkedKeys.checkedNodes.length - 1 && index2 === res.length - 1 && index3 === resp.length - 1 && index4 === resps.length - 1) {
                                this.ids = Array.from(new Set(this.selectedId))
                              }
                            })
                          } else {
                            if (index === checkedKeys.checkedNodes.length - 1 && index2 === res.length - 1 && index3 === resp.length - 1) {
                              this.ids = Array.from(new Set(this.selectedId))
                            }
                          }
                        })
                      })
                    } else {
                      if (index === checkedKeys.checkedNodes.length - 1 && index2 === res.length - 1) {
                        this.ids = Array.from(new Set(this.selectedId))
                      }
                    }
                  })
                })
              } else {
                if (index === checkedKeys.checkedNodes.length - 1) {
                  this.ids = Array.from(new Set(this.selectedId))
                }
              }
            })
          } else {
            if (index === checkedKeys.checkedNodes.length - 1) {
              this.ids = Array.from(new Set(this.selectedId))
            }
          }
        })
      } else if (checkedKeys.checkedNodes.length === 0) {
        this.ids = []
      }
    },
    handlerNodeClick(data, node) {
      this.orgid = data.ID
      // this.getList()
    }
  }
}
</script>

<style scoped lang="scss">
#responsible {
  /deep/ .el-tabs__header {
    margin: 0;
  }
}
.tree_wrap {
  overflow: auto;
  overflow-x: overlay;
  height: calc(100vh - 208px) !important;
  /deep/ .el-tree-node__content{
    width: 100%;
  }
  /deep/ .el-tree-node>.el-tree-node__children {
    overflow: visible;
  }
}
</style>
