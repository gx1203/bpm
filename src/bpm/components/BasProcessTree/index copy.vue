<template>
  <div id="processTree">
    <el-input clearable :placeholder="$t('basProcessTree.enterKeywordsFiltering')" v-model="filterText">
    </el-input>
    <div class="treeWrap" style="margin-top: 10px;">
      <el-tree class="elTree" v-if="showView === '0'" :props="props" :data="treeData" :expand-on-click-node="false"
        node-key="ID" @node-click='handleClick' :load="loadNode" lazy :filter-node-method="filterNode" ref="tree">
        <span class="custom-tree-node" slot-scope="{ node,data }">
          <i class="iconfont icon-moxing___" v-if="data.type === '0'"></i>
          <i v-else-if="data.type === '1'" class="iconfont icon-liucheng"></i>
          <i v-else-if="data.type === '2'" class="iconfont icon-jiedianbangzhu"></i>
          <i v-else class="iconfont icon-baocunbuju"></i>
          <span :title="node.label">{{ node.label }}</span>
        </span>
      </el-tree>
      <el-tree class="elTree" v-if="showView === '1'" :props="props1" ref="tree" :data="treeData" :load="loadNode1" lazy
        node-key="ID" :expand-on-click-node="false" :filter-node-method="filterNode1" @node-click="handleClick">
        <span slot-scope="{ node, data}" class="custom-tree-node">
          <i class="iconfont icon-moxing___" />
          <span>{{ node.label }}</span>
          <span>
            <el-button icon="el-icon-edit" :title="$t('editNode')" type="text" @click.stop="add(data,$t('editNode'))" />
            <el-button v-show="!isBpa" v-if="data.grade < 4" icon="el-icon-circle-plus" :title="$t('addChildNode')"
              type="text" @click.stop="add(data,addChildNode)" />
            <el-button v-show="!isBpa" v-if="data.pid!=0" icon="el-icon-delete" :title="$t('deleteCurrentNode')"
              type="text" @click.stop="handleDelete(data)" />
          </span>
        </span>
      </el-tree>
      <classify-handle-dialog v-model="dialogVisible" :title="linkTitle" :item="itemData" :urlSeting="urlSeting"
        @confirm="getDepartment3" />
      <el-tree class="elTree" v-if="showView === '2'" ref="tree" :props="props" :data="treeData" :load="loadNode2"
        :expand-on-click-node="false" :filter-node-method="filterNode" lazy node-key="ID" @node-click="handleClick">
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <i v-if="data.type === '0'" class="iconfont icon-moxing___" />
          <i v-else-if="data.type === '1'" class="iconfont icon-liucheng" />
          <i v-else-if="data.type === '2'" class="iconfont icon-jiedianbangzhu" />
          <i v-else class="iconfont icon-baocunbuju" />
          <span :title="data.name+'('+data.num+')'">{{ data.name }}({{ data.num }})</span>
        </span>
      </el-tree>
      <el-tree class="elTree" v-if="showView === '3'" :props="props2" :data="treeData" :expand-on-click-node="false"
        node-key="ID" @node-click='handleClick' :load="loadNode3" lazy :filter-node-method="filterNode1" ref="tree">
        <span class="custom-tree-node" slot-scope="{ node,data }">
          <i class="iconfont icon-moxing___" v-if="data.type === '0'"></i>
          <i v-else-if="data.type === '1'" class="iconfont icon-liucheng"></i>
          <i v-else-if="data.type === '2'" class="iconfont icon-jiedianbangzhu"></i>
          <i v-else class="iconfont icon-baocunbuju"></i>
          <span :title="node.label">{{ node.label }}</span>
          <span>
            <el-button icon="el-icon-edit" :title="$t('editNode')" type="text" @click.stop="add(data,$t('editNode'))" />
            <el-button v-show="!isBpa" v-if="data.grade < 4" icon="el-icon-circle-plus" :title="$t('addChildNode')"
              type="text" @click.stop="add(data,addChildNode)" />
            <el-button v-show="!isBpa" v-if="data.pid!=0" icon="el-icon-delete" :title="$t('deleteCurrentNode')"
              type="text" @click.stop="handleDelete(data)" />
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
import classifyHandleDialog from './classifyHandleDialog'
export default {
  name: 'BasProcessTree',
  components: {
    classifyHandleDialog
  },
  props: {
    // showView分类管理可使用1，分析中心-流程分析-运行分析可使用2，其他可使用0
    showView: {
      type: String,
      default: '0'
    },
    // 是否多选
    // isMore: {
    //   type: Boolean
    // },
    // 树所需加载的类型
    type: {
      type: String
    },
    urlSeting: {
      type: Object,
      default () {
        return {
          getModelTree: '/process/model/getAllTree',
          getTreeById: '/process/model/getTreeById/',
          // getModelTree: '/processModel/getModelTree',
          getCategoryTree: '/model/getProcessCategoryTree',
          diagramShowType: 'businessrule/ruleconfig/diagram-show-type',
          deleteCategoryTree: '/model/delete/',
          saveCategoryTree: '/model/saveOrUpdateTree',
          getMonitorTree: '/monitor/getMonitorTree/'
        }
      }
    }
  },
  data () {
    return {
      dialogVisible: false,
      linkTitle: '',
      itemData: {},
      props: {
        label: 'name',
        isLeaf: 'isParent'
      },
      props1: {
        label: 'modelname',
        isLeaf: 'isParent'
      },
      props2: {
        label: 'modelname'
      },
      treeData: [],
      filterText: '',
      radioNode: '',
      isBpa: false
    }
  },
  watch: {
    filterText () {
      this.$refs.tree.filter(this.filterText)
    }
  },
  mounted () {
    this.showView === '0' ? this.getDepartment() :
      this.showView === '1' ? this.getDepartment1() :
        this.showView === '2' ? this.getDepartment2() :
          this.showView === '3' ? this.getDepartment3() : ''
  },
  methods: {
    getDepartment3 () {
      let than = this;
      if (than.$http) {
        than.$http({
          url: `${than.urlSeting.getModelTree}`,
          method: 'GET'
        }).then(rt => {
          than.treeData = rt.data
        }).catch(er => {
          console.log(er)
        })
      }
    },
    loadNode3 (node, resolve) {
      console.log(node)
      let than = this
      if (node.level > 0) {
        if (node.data.children && node.data.children.length > 0) {
          resolve(node.data.children)
        } else {
          console.log(node.data.id)
          if (than.$http) {
            than.$http({
              url: this.urlSeting.getTreeById + node.data.id,
              method: 'GET'
            }).then((rt) => {
              resolve(rt.data)
            }).catch((er) => {
              console.log(er)
            })
          }
        }
      }
    },
    clickRadioNode (event) {
      if (event) event.preventDefault()
    },
    filterNode (value, data, node) {
      console.log(data)
      console.log(node)
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    filterNode1 (value, data) {
      if (!value) return true
      return data.modelname.indexOf(value) !== -1
    },
    getDepartment () {
      let than = this;
      if (than.$http) {
        if (than.$route.query.pid) {
          than.$http({
            url: `${than.urlSeting.getModelTree}`,
            method: 'POST',
            data: {
              pid: than.$route.query.pid
            }
          }).then(rt => {
            rt.data.forEach(item => {
              if (item.type === than.type) {
                item.isParent = true
              } else {
                if (item.isParent === 'Y') {
                  item.isParent = false
                } else {
                  item.isParent = true
                }
              }
            })
            than.treeData = rt.data
          }).catch(er => {
            console.log(er)
          })
        } else {
          than.$http({
            url: `${than.urlSeting.getModelTree}`,
            method: 'POST',
            data: {
              pid: 0,
              type: 0
            }
          }).then(rt => {
            than.treeData = rt.data
          }).catch(er => {
            console.log(er)
          })
        }
      }
    },
    getDepartment1 () {
      let than = this;
      let canshu = {}
      if (than.$http) {
        if (than.$route.query.pid) {
          canshu = {
            pid: than.$route.query.pid
          }
        } else {
          canshu = {
            pid: 0,
            type: 0
          }
        }
        than.$http({
          url: `${than.urlSeting.getCategoryTree}`,
          method: 'POST',
          data: canshu
        }).then(rt => {
          rt.data.forEach(item => {
            item.isParent = !than.toBoolean(item.isParent)
          })
          than.treeData = rt.data
        }).catch(er => {
          console.log(er)
        })
        // than.$http({
        //   url: `${than.urlSeting.diagramShowType}`,
        //   method: 'get'
        // }).then(rt => {
        //   this.isBpa = rt.data === 'bpa'
        // }).catch(er => {
        //   console.log(er)
        // })
      }
    },
    getDepartment2 () {
      let than = this
      if (than.$http) {
        than.$http({
          url: this.urlSeting.getMonitorTree + 0,
          method: 'GET'
        }).then((rt) => {
          rt.data.forEach(item => {
            item.isParent = item.isParent === 'N'
          })
          this.treeData = rt.data
        }).catch((er) => {
          console.log(er)
        })
      }
    },
    loadNode (node, resolve) {
      let than = this;
      let num = ''
      if ((node.data.isProcess === 'Y' || node.data.type > 0) && than.type !== '0') {
        num = Number(node.data.type) + 1
      } else {
        num = node.data.type
      }
      if (than.$http) {
        if (node.level > 0) {
          than.$http({
            url: `${than.urlSeting.getModelTree}`,
            method: 'POST',
            data: {
              pid: node.data.id,
              type: num
            }
          }).then(rt => {
            rt.data.forEach(item => {
              if (this.type === '0') {
                // console.log(node.data.isProcess === 'Y')
                //   if (item.isProcess === 'Y') {
                //      item.isParent = true
                //   }else{
                //      item.isParent = false
                //   }
              } else if (item.type === this.type) {
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
          }).catch(er => {
            console.log(er)
          })
        }
      }
    },
    loadNode1 (node, resolve) {
      let num = ''
      if (node.data.isProcess === 'Y' || node.data.type > 0) {
        num = Number(node.data.type) + 1
      } else {
        num = node.data.type
      }
      if (node.level > 0) {
        let than = this
        if (than.$http) {
          than.$http({
            url: `${than.urlSeting.getCategoryTree}`,
            method: 'POST',
            data: {
              pid: node.data.id,
              type: 0
            }
          }).then(rt => {
            rt.data.forEach(item => {
              item.isParent = !than.toBoolean(item.isParent)
            })
            resolve(rt.data)
          }).catch(er => {
            console.log(er)
          })
        }
      }
    },
    loadNode2 (node, resolve) {
      if (node.level > 0) {
        let than = this
        if (than.$http) {
          than.$http({
            url: this.urlSeting.getMonitorTree + node.data.id,
            method: 'GET'
          }).then((rt) => {
            rt.data.forEach(item => {
              item.isParent = item.isParent === 'N'
            })
            resolve(rt.data)
          }).catch((er) => {
            console.log(er)
          })
        }
      }
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
    handleDelete (data) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      }).then(() => {
        let than = this
        if (than.$http) {
          than.$http({
            url: than.urlSeting.deleteCategoryTree + data.id,
            method: 'GET',
          }).then(rt => {
            if (rt.status === '200') {
              than.$message({
                message: than.$t('hintText.successfullyDelete'),
                type: 'success'
              })
              than.getDepartment1()
            } else {
              than.$message({
                message: than.$t('hintText.failToDelete'),
                type: 'error'
              })
            }
          })
        }
      }).catch(_ => { })
    },
    handleClick (data) {
      console.log(data)
      this.$emit('confirm', data)
      // if (this.isMore) {
      //   console.log(this.$refs.tree.getCheckedNodes())
      //   this.$emit('confirm', this.$refs.tree.getCheckedNodes())
      // } else {
      // }
    }
  }
}
</script>
<style lang="scss">
#processTree {
  .el-input__inner {
    border: none;
    border-bottom: 1px solid rgb(229, 229, 229);
  }
}
</style>

<style lang="scss" scoped>
.elTree {
  height: calc(100% - 28px);
  overflow: auto;
}
.elTree .el-tree-node.is-current > .el-tree-node__content,
.elTree /deep/ .el-tree-node.is-current > .el-tree-node__content {
  background-color: #eff4f9;
  color: #327ab7;
  font-weight: 600;
}
</style>
