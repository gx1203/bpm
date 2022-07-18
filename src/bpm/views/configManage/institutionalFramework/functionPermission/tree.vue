<template>
  <el-dialog v-loading="load" id='roleTree' :title="$t('edit')" :visible.sync="dialogVisible">
    <el-tree class="elTree" :props="props" :data="treeData" default-expanded-keys="['1']" node-key="id"
      show-checkbox check-strictly @check-change="checkChange" @check="clickDeal" ref="tree">
<!--      :default-checked-keys="checkList"-->
      <span class="custom-tree-node" slot-scope="{ node, data}">
        <i v-if="data.type === 'root'" class="iconfont icon-banben"></i>
        <i v-if="data.type === 'category'" class="iconfont" :class="[data.ico?data.ico:'icon-liebiao1']"></i>
        <i v-if="data.type === 'item'" class="iconfont" :class="data.ico"></i>
        <span>{{ node.label }}</span>
      </span>
    </el-tree>
    <!-- <el-tree ref="tree" class="elTree" :props="props" :data="treeData" node-key="id" :expand-on-click-node="false"
      show-checkbox @node-click="handleNodeClick" @check-change="checkChange" check-strictly>
      <span slot-scope="{ node, data}" class="custom-tree-node">
        <i v-if="data.type === 'root'" class="iconfont icon-banben" />
        <i v-if="data.type === 'category'" class="iconfont" :class="[data.ico?data.ico:'icon-liebiao1']" />
        <i v-if="data.type === 'item'" class="iconfont" :class="data.ico" />
        <span>{{ node.label }}</span>
      </span>
    </el-tree> -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{$t('cancel')}}</el-button>
      <el-button type="primary" @click="submit()">{{$t('confirm')}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  getNavAll,
  getAllGroups2,
  getNavigations,
  getNavAll2,
  getRolePermissions
} from '@/bpm/api/configManage/navConfig'
import { reAssignPermissions, queryNavigationPermission } from '@/bpm/api/configManage/institutionalFramework/function_permission'
export default {
  data () {
    return {
      load: false,
      dialogVisible: this.value,
      props: {
        label: 'name',
        children: 'subNodes'
      },
      treeData: [],
      checkList: []
    }
  },
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
  watch: {
    value (val) {
      this.dialogVisible = val
      if (val) {
        this.getDepartment()
        this.checkList = []
      }
    },
    dialogVisible (val) {
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
    async getDepartment () {
      this.load = true
      const res = await Promise.all([
        getAllGroups2(),
        getNavAll2(1)
      ])
      console.log('res', res)
      const data = res[0].data[0]
      console.log('data', data)
      data.subNodes = res[1].data
      console.log(data)
      this.treeData = [data]
      this.load = false
    },
    loadNode (node, resolve) {
      console.log('懒加载', node)
      if (node.level == 0) {
        getNavigations(0)
          .then(rt => {
            resolve(rt.data)
          })
          .catch(er => {
            console.log(er)
          })
      } else {
        getNavigations(node.data.id)
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
    // checkChange (data, bool) {
    //   if (bool) {
    //     console.log('选择', data)
    //     if (this.checkList.indexOf(data.id) < 0) {
    //       this.checkList.push(data.id)
    //     }
    //   } else {
    //     console.log('取消', data)
    //     this.checkList.forEach((val, idx) => {
    //       if (data.id == val) {
    //         this.checkList.splice(idx, 1)
    //       }
    //     })
    //   }
    //   //    let _bool = false
    //   //    this.$refs.tree.getCheckedNodes().forEach(item=>{
    //   //      if(item.pid === data.pid){
    //   //        _bool = true
    //   //      }
    //   //    })
    //   //    if(!bool && data.subNodes.length>0){
    //   //      data.subNodes.forEach(item=>{
    //   //        this.$refs.tree.setChecked(item.id,false)
    //   //      })
    //   //    }
    //   //    this.$refs.tree.setChecked(data.pid,_bool)
    // },
    // getDepartment () {
    //   this.load = true
    //   queryNavigationPermission(this.item.id)
    //     .then(res => {
    //       this.$refs.tree.setCheckedKeys([])
    //       res.data.list.forEach(element => {
    //         this.checkList.push(element.resourceid)
    //       })
    //       this.load = false
    //     }).catch((er) => {
    //       this.load = false
    //       console.log(er)
    //     })
    // },
    submit () {
      let relDtos = []
      //    this.$refs.tree.getCheckedKeys().forEach(element => {
      //      relDtos.push(element)
      //    })
      console.log('最终提交的数据', this.checkList)

      //    this.$refs.tree.getHalfCheckedKeys().forEach(element => {
      //      relDtos.push({
      //        resourceid: element,
      //        relatedid: this.item.id,
      //        module: 'nav',
      //        type: 'include',
      //        mark: 'N'
      //      })
      //    })
      //    this.$refs.tree.getCheckedKeys().forEach(element => {
      //      relDtos.push({
      //        resourceid: element,
      //        relatedid: this.item.id,
      //        module: 'nav',
      //        type: 'include',
      //        mark: 'Y'
      //      })
      //    })
      this.load = true
      // let perms = this.checkList.map(item => {
      let perms = this.$refs.tree.getCheckedKeys().map(item => {
        return {
          resourceid: item,
          // relatedid: item,
          module: 'nav',
          type: 'include'
        }
      })
      reAssignPermissions({
        'perms': perms,
        'id': this.item.id,
        'type': this.item.type === '0' ? 'org' : this.item.type === '1' ? 'org' : this.item.type === '2' ? 'org' : this.item.type === '3' ? 'org' : this.item.type === '4' ? 'org' : this.item.type === '5' ? 'org' : this.item.type === '6' ? 'job' : this.item.type === '7' ? 'group' : '8'
      }).then(rt => {
        this.load = false
        if (rt.status === '200') {
          this.dialogVisible = false
          this.$message.success(this.$t("hintText.operateSuccessfully"))
          this.$emit('confirm', true)
        }
      }).catch(er => {
        this.load = false
      })
    },
    cancel () {
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
