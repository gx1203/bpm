<template>
  <el-dialog id="roleTree" v-loading="load" :title="title" :visible.sync="dialogVisible">
    <el-tree
      ref="tree"
      class="elTree"
      :props="props"
      :data="treeData"
      node-key="id"
      :expand-on-click-node="false"
      show-checkbox
      @node-click="handleNodeClick"
      @check-change="checkChange"
      @check="clickDeal"
      check-strictly
      :default-expanded-keys="grandParentId"
    >
      <span slot-scope="{ node, data}" class="custom-tree-node">
        <i v-if="data.type === 'root'" class="iconfont icon-banben" />
        <i
          v-if="data.type === 'category'"
          class="iconfont"
          :class="[data.ico?data.ico:'icon-liebiao1']"
        />
        <i v-if="data.type === 'item'" class="iconfont" :class="data.ico" />
        <span>{{ node.label }}</span>
      </span>
    </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit()">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  assignPermissions,
  findPermissions,
  removePermissions,
  reAssignPermissions
} from '@/bpm/api/configManage/authorityManage/roleManage'
import {
  getIsAdmin,
  getNavAll,
  getAllGroups2,
  getNavigations,
  getNavAll2,
  getRolePermissions
} from '@/bpm/api/configManage/navConfig'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },

    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      load: false,
      dialogVisible: this.value,
      props: {
        label: 'name',
        children: 'subNodes'
      },
      treeData: [],
      checkList: [],
      checkId: '',
      content: {},
      grandParentId: ['1'],
      isClickSelected: false
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
      if (val) {
        this.getDepartment()
        console.log(this.item)
        this.checkList = []
      }
    },
    dialogVisible(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    checkChange(data, checked, indeterminate) {
      let _bool = false
      this.$refs.tree.getCheckedNodes().forEach(item => {
        if (item.pid === data.pid) {
          _bool = true
        }
      })
      if (data.subNodes) {
        if (!checked && data.subNodes.length > 0) {
          data.subNodes.forEach(item => {
            this.$refs.tree.setChecked(item.id, false)
          })
          this.$refs.tree.setChecked(data.pid, _bool)
        }
      } else {
        this.$refs.tree.setChecked(data.pid, _bool)
      }
    },
    clickDeal(currentObj, treeStatus) {
      // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
      const selected = treeStatus.checkedKeys.indexOf(currentObj.id) // -1未选中
      this.isClickSelected = selected
      // 选中
      if (selected !== -1) {
        //
        // this.selectedChildren(currentObj)
        // 统一处理子节点为相同的勾选状态
        this.uniteChildSame(currentObj, true)

        // 子节点只要被选中父节点就被选中
        this.selectedParent(currentObj, true)
      } else {
        // 未选中 处理子节点全部未选中
        if (currentObj.subNodes && currentObj.subNodes.length !== 0) {
          this.uniteChildSame(currentObj, false)
        }
      }
    },
    // 统一处理父节点为选中
    selectedParent(currentObj, isSelected) {
      this.$refs.tree.setChecked(currentObj.id, isSelected)
      const currentNode = this.$refs.tree.getNode(currentObj)
      if (currentNode.level !== 1) {
        this.selectedParent(currentNode.parent.data, isSelected)
      }
    },
    // 统一处理子节点为相同的勾选状态
    uniteChildSame(treeList, isSelected) {
      this.$refs.tree.setChecked(treeList.id, isSelected)
      const subNodes = treeList.subNodes ? treeList.subNodes.length : 0
      if (subNodes) {
        for (let i = 0; i < subNodes; i++) {
          this.uniteChildSame(treeList.subNodes[i], isSelected)
        }
      }
    },
    // 统一处理子节点为选中
    selectedChildren(currentObj) {
      const currentNode = this.$refs.tree.getNode(currentObj)
      // console.log(currentNode)
      currentNode.childNodes.map(item => {
        if (item.key !== undefined) {
          this.$refs.tree.setChecked(item, true)
          this.selectedChildren(item)
        }
      })
    },
    async getDepartment() {
      this.load = true
      const res = await Promise.all([
        getAllGroups2(),
        getNavAll2(0),         //业务流程管理-非管理员
        getNavAll2(1),         //业务流程分析
        getNavAll(0),           //业务流程管理-管理员
        getNavAll(1),           //业务流程分析
      ])
      // const data1 = res[0].data
      const data1 = []
      res[0].data.forEach((item, index) => {
        if (item.id != '0') {
          data1.push(item)
        }
      })
      // console.log(data1)
      // data1[0].subNodes = res[1].data
       getIsAdmin()
        .then(rt => {
          if(rt.data === false){ //非管理员
            // data1[0].subNodes = res[1].data
            // data1[1].subNodes = res[2].data
            data1[0].subNodes = res[2].data
          }else{
            // data1[0].subNodes = res[3].data
            // data1[1].subNodes = res[4].data
            data1[0].subNodes = res[4].data
          }
          console.log(data1)
          this.treeData = data1
          this.load = false
        })
        .catch(er => {
          console.log(er)
        })
      findPermissions(this.item.id).then(res => {
        if (!res) return false
        // console.log(res.data)
        if (res.status == '200') {
          const ids = res.data.map(value => {
            if (value.mark === 'Y') {
              if (value.resourceid) {
                return value.resourceid
              }
            }
            // return value.resourceid
          })
          ids.forEach((item, index) => {
            if (item == undefined) {
              ids.splice(index, 1)
            }
          })
          // console.log(ids)
          this.$refs.tree.setCheckedKeys(ids)
        }
      })
      // this.load = false
      // getAllGroups2()
      //   .then(rt => {
      //     this.treeData = rt.data
      //     return findPermissions(this.item.id)
      //   })
      //   .then(res => {
      //     console.log(res)
      //     this.$refs.tree.setCheckedKeys([])
      //     res.data.forEach(element => {
      //       if (element.mark === 'Y') {
      //         this.checkList.push(element.resourceid)
      //       }
      //     })
      //     this.load = false
      //   })
      //   .catch(er => {
      //     this.load = false
      //     console.log(er)
      //   })
    },
    loadNode(node, resolve) {
      if (node.level > 0) {
        getNavAll2(node.data.id)
          .then(rt => {
            rt.data.forEach(item => {
              if (item.type === 'item') {
                item.isParent = true
              }
            })
            resolve(rt.data)
          })
          .catch(er => {
            console.log(er)
          })
      }
    },
    handleNodeClick(data, node) {
      console.log(data)
      console.log(node)
      this.checkId = data.id
      getAllGroups2()
        .then(rt => {
          this.content = data
        })
        .catch(er => {
          console.log(er)
        })
    },
    submit() {
      const relDtos = []
      console.log(this.$refs.tree.getHalfCheckedKeys())
      console.log(this.$refs.tree.getCheckedKeys())
      this.$refs.tree.getHalfCheckedKeys().forEach(element => {
        console.log(element)
        relDtos.push({
          resourceid: element,
          relatedid: this.item.id,
          module: 'nav',
          type: 'include',
          mark: 'N'
        })
      })
      this.$refs.tree.getCheckedKeys().forEach(element => {
        console.log(element)
        relDtos.push({
          resourceid: element,
          relatedid: this.item.id,
          module: 'nav',
          type: 'include',
          mark: 'Y'
        })
      })
      this.load = true
      reAssignPermissions({
        perms: relDtos,
        id: this.item.id,
        roleId: this.item.id,
        type: '8'
      })
        .then(rt => {
          this.load = false
          if (rt.status === '200') {
            this.dialogVisible = false
            this.$message.success(this.$t('hintText.operateSuccessfully'))
            this.$emit('confirm', true)
          }
        })
        .catch(er => {
          this.load = false
        })
    },
    cancel() {
      this.dialogVisible = false
    }
  }
}
</script>

<style  lang="scss" scoped>
.content {
  height: 50vh;
  width: 60%;
  margin: 0 auto;
  overflow: auto;
  padding: 0 10px;
}

.w100 {
  width: 100%;
}
</style>
<style lang="scss">
#roleTree {
  .custom-tree-node {
    .iconfont {
      margin-left: 10px;
    }
  }
}
</style>
