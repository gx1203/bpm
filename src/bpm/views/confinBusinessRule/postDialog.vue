<template>
  <el-dialog id="postDialog" :title="title" :visible.sync="dialogVisible">
    <el-row class="content">
      <el-input clearable class="margin-b10 w120" :placeholder="$t('placeholderText.enterKeywordsFiltering')" v-model="filterText"></el-input>
      <div>
      <el-tree
        v-if="isFilter"
        key="0"
        class="elTree"
        style="overflow: auto;"
        :props="props"
        :data="treeData"
        :load="loadNode"
        lazy
        node-key="id"
        @check-change='handleClickCheckbox'
        :default-checked-keys="postList"
        :check-strictly="true"
        show-checkbox
        ref="tree"
      >
        <span class="custom-tree-node" slot-scope="{ node, data}">
          <span>{{ node.label }}</span>
          <span v-if="data.type === '0'">({{ $t('organization') }})</span>
          <span v-else-if="data.type === '1'">({{ $t('company') }})</span>
          <span v-else-if="data.type === '2'">({{ $t('department') }})</span>
          <span v-else>({{ $t('post') }})</span>
        </span>
      </el-tree>
       <el-tree
        class="elTree"
        v-else
        key="1"
        style="overflow: auto;"
        :props="props"
        :data="treeData"
        default-expand-all
        node-key="id"
        @check-change='handleClickCheckbox'
        :default-checked-keys="postList"
        :check-strictly="true"
        show-checkbox
        ref="tree"
      >
        <span class="custom-tree-node" slot-scope="{ node, data}">
          <span>{{ node.label }}</span>
          <span v-if="data.type === '0'">({{ $t('organization') }})</span>
          <span v-else-if="data.type === '1'">({{ $t('company') }})</span>
          <span v-else-if="data.type === '2'">({{ $t('department') }})</span>
          <span v-else>({{ $t('post') }})</span>
        </span>
      </el-tree>
    </div>
    </el-row>
    <div style="margin-top: 10px;" v-if="orgAllList && orgAllList.length > 0 ">
      <span class="checkList" v-for="(item, index) in orgAllList" :key="index" style="margin:0 10px 10px 0;">
        {{item.name}}<el-button @click="del(index)" icon="el-icon-delete" type="text" :title="$t('delete')" style="color: #fff;margin-left: 5px;"></el-button>
      </span>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="handleClick">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getAllRootTree, getChildren, searchQueryTree } from '@/bpm/api/configManage/institutionalFramework/organization.js'

export default {
  data () {
    return {
      dialogVisible: this.value,
      props: {
        label: 'name',
        isLeaf: 'isParent',
        children: 'subNodes'
      },
      orgAllList:[],
      filterText:'',
      isFilter: true,
      postList:[],
      treeData: []
    }
  },
  components: {},
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: false
    },
    checkData: {
      type: Array,
      default: ()=>{return []}
    }
    
  },
  watch: {
    filterText (val) {
      this.filterFun()
    },
    value (val) {
      this.dialogVisible = val
      if(val){
      this.filterText = ''
       this.getDepartment()
       if(this.postList){
          this.orgAllList = []
          this.postList = []
          this.orgAllList = JSON.parse(JSON.stringify(this.checkData))
          this.postList = this.checkData.map(item=>item.id)
        }else{
          this.postList = []
        }
      }
   
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    handleClickCheckbox(node,isCheck){
      let _this = this
      if(isCheck){
        let list = _this.$refs.tree.getCheckedNodes()
        let listIds = _this.orgAllList.map(item=>item.id)
        list.forEach(item=>{
          if(listIds.indexOf(item.id) === -1){
            _this.orgAllList.push(item)
          }
        })
      } else {
        _this.orgAllList = JSON.parse(JSON.stringify(_this.orgAllList)).filter(item=>item.id !== node.id)
      }
      _this.postList = _this.orgAllList.map(item=>item.id)
    },
    disabledFun(list){
      list.forEach(item=>{
        item.disabled = item.type !== '3'
        if(item.subNodes.length > 0){
          this.disabledFun(item.subNodes)
        }
      })
    },
    cancel () {
      this.dialogVisible = false
    },
    clickRadioNode (event) {
      if (event) event.preventDefault()
    },
    filterFun(){
      if(this.filterText){
        searchQueryTree(this.filterText).then(rt => {
          this.treeData = rt.data;
          this.isFilter = false;
          this.disabledFun(this.treeData)
        }).catch(er => {
        });
      }else{
        this.isFilter = true;
        this.getDepartment()
      }
    },
    getDepartment () {
      getAllRootTree().then((rt) => {
        rt.data.forEach(item => {
          // item.isParent = false
          item.NAME = item.name
          item.ID = item.id
          item.TYPE = item.type
          item.disabled = item.type !== '3'
        })
        this.treeData = rt.data
      }).catch((er) => {
        console.log(er)
      })
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
            item.disabled = item.type !== '3'
            // item.isParent = !this.toBoolean(item.isParent)
          })
          resolve(rt.data)
        }).catch((er) => {
          console.log(er)
        })
      }
    },
    del (index) {
      this.orgAllList.splice(index, 1)
      let ids = this.orgAllList.map(item=>item.id)
      this.$refs.tree.setCheckedKeys(ids)
      this.$forceUpdate()
    },
    handleClick (data) {
      // let arr = []
      // this.$refs.tree.getCheckedNodes().forEach(element => {
      //   if (element.TYPE !== '0' && element.TYPE !== '1' && element.TYPE !== '2') {
      //     arr.push(element)
      //   }
      // })
      this.$emit('confirm', this.orgAllList)
    }
  }
}
</script>

<style scoped>
.content {
  height: 50vh;
  width: 60%;
  margin: 0 auto;
  overflow: auto;
  padding: 0 10px;
}
.checkList {
  color:#FFFFFF;
  background:#3792D8;
  display: inline-block;
  padding: 5px 10px;
}
.w100 {
  width: 100%;
}
</style>
<style lang="scss">
#postDialog {
  .avatar-uploader .el-upload {
    border: 1px dashed $dc1;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
