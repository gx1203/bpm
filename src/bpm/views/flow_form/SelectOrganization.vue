<template>
  <el-dialog title="选择组织" class="SelectPeople" append-to-body :visible.sync="dialogVisible" width="60%" top="15vh">
    <el-input clearable :placeholder="$t('placeholderText.enterKeywordsFiltering')" v-model="filterText"></el-input>
    <div class="treeWrap" style="margin-top: 10px;">
      <div v-if="isFilter">
       <el-tree
          class="elTree"
          v-if="!isMore"
          style="height: 300px; overflow: auto;"
          :props="props"
          :data="treeData"
          :load="loadNode"
          key="0"
          :expand-on-click-node="false"
          lazy
          node-key="id"
          ref="tree"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span v-if="data.type === '0'">({{ $t('organization') }})</span>
            <span v-else-if="data.type === '1'">({{ $t('company') }})</span>
            <span v-else-if="data.type === '2'">({{ $t('department') }})</span>
            <span v-else>({{ $t('post') }})</span>
            <span style="float: left; margin-top: 1px;">
              <el-radio
                v-model="radioNode"
                :label="data.id"
                :disabled="data.type === '0'"
                @click="clickRadioNode($event)"
                @change="changeRadioNode(data)"
              >{{''}}</el-radio>
            </span>
          </span>
        </el-tree>
        <el-tree
        class="elTree"
        v-else
        style="height: 300px; overflow: auto;"
        :props="props"
        :data="treeData"
        :load="loadNode"
        key="1"
        :expand-on-click-node="false"
        lazy
        @check-change='handleClickCheckbox'
        :check-strictly="isStrictly"
        :default-checked-keys="checkDataIds"
        node-key="id"
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
      <div v-else>
        <el-tree
          class="elTree"
          v-if="!isMore"
          style="height: 300px; overflow: auto;"
          :props="props"
          :data="treeData"
          key="2"
          default-expand-all
          :expand-on-click-node="false"
          node-key="id"
          ref="tree"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span v-if="data.type === '0'">({{ $t('organization') }})</span>
            <span v-else-if="data.type === '1'">({{ $t('company') }})</span>
            <span v-else-if="data.type === '2'">({{ $t('department') }})</span>
            <span v-else>({{ $t('post') }})</span>
            <span style="float: left; margin-top: 1px;">
              <el-radio
                v-model="radioNode"
                :label="data.id"
                @click="clickRadioNode($event)"
                @change="changeRadioNode(data)"
              >{{''}}</el-radio>
<!--              :disabled="data.type === '0'"-->
            </span>
          </span>
        </el-tree>
        <el-tree
        class="elTree"
        v-else
        style="height: 300px; overflow: auto;"
        :props="props"
        :data="treeData"
        key="3"
        :expand-on-click-node="false"
        default-expand-all
        @check-change='handleClickCheckbox'
        :check-strictly="isStrictly"
        :default-checked-keys="checkDataIds"
        node-key="id"
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

    </div>
      <div style="margin-top: 10px;" v-if="organizeItem.name && !isMore">
      <span class="checkList">
        {{organizeItem.name}}<i @click="close" style="margin-left:5px;cursor: pointer;font-weight: 600;" class="el-icon-close"></i>
      </span>
    </div>
    <div style="margin-top: 10px;" v-if="isMore && orgAllList && orgAllList.length > 0 ">
      <span class="checkList" v-for="(item, index) in orgAllList" :key="index" style="margin:0 10px 10px 0;">
        {{item.name}}<el-button @click="del(index)" icon="el-icon-delete" type="text" :title="$t('delete')" style="color: #fff;margin-left: 5px;"></el-button>
      </span>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false;organizeItem='';orgAllList=[]">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getAllRootTree,searchQueryTree, getChildren } from '@/bpm/api/configManage/institutionalFramework/organization.js'
export default {
  data () {
    return {
      id: 14246,
      dialogVisible: false,
      checkDataIds:[],
      isFilter:true,
      props: {
        label: 'name',
        isLeaf: 'isParent',
        children: 'subNodes'
      },
      treeData: [],
      orgAllList:[],
      filterText: '',
      radioNode: '',
      organizeItem: {}
    }
  },
  props: {
    value: {
      type: Boolean
    },
    isMore: {
      type: Boolean
    },
    isStrictly: {
      type: Boolean,
      default: false
    },
    power: {
      type: String,
      default: ''
    },
    checkData: {
      type: Array,
      default: ()=>[]
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
      if (val) {
        this.filterText = ''
        if (!this.isMore) {
          this.radioNode = ''
          if(this.checkData.length !== 0){
            this.radioNode = this.checkData[0].id
          }
        } else{
          this.orgAllList = []
          this.checkDataIds = []
          this.orgAllList = JSON.parse(JSON.stringify(this.checkData))
          this.checkDataIds = this.checkData.map(item=>item.id)
        }
        this.getDepartment()
      }
    },
    dialogVisible (val) {
      this.$emit('input', val)
    },
    filterText (val) {
      this.filterFun()
    }
  },
  methods: {
      disabledFun(list){
      list.forEach(item=>{
        // item.disabled = item.type === '0'
        if(item.subNodes.length > 0){
          this.disabledFun(item.subNodes)
        }
      })
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
      _this.checkDataIds = _this.orgAllList.map(item=>item.id)
    },
    clickRadioNode (event) {
      if (event) event.preventDefault()
    },
    changeRadioNode (data) {
      this.organizeItem = data
    },
    close (i) {
      this.organizeItem = {}
      this.radioNode = ''
    },
    del (index) {
      this.orgAllList.splice(index, 1)
      let ids = this.orgAllList.map(item=>item.id)
      this.$refs.tree.setCheckedKeys(ids)
      this.$forceUpdate()
    },
    filterNode (value, data) {
      if (!value) return true
      return data.NAME.indexOf(value) !== -1
    },
    getDepartment () {
      if(this.power && this.power !== ''){
          let powerList = this.power.split(',')
          let _pid = ''
          if(powerList.length >= 6){
            _pid = powerList[4]
          }else{
            _pid = powerList[powerList.length-1]
          }
          getChildren(_pid).then((rt) => {
            rt.data.forEach(item => {
              item.NAME = item.name
              item.ID = item.id
              item.TYPE = item.type
              // item.disabled = item.type === '0'
            })
            this.treeData = rt.data
          }).catch((er) => {
            console.log(er)
          })
      }else{
        getAllRootTree().then((rt) => {
            rt.data.forEach(item => {
              // item.isParent = false
              item.NAME = item.name
              item.ID = item.id
              item.TYPE = item.type
              // item.disabled = item.type === '0'
            })
            this.treeData = rt.data
        }).catch((er) => {
          console.log(er)
        })
      }
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
        getChildren(node.data.id).then((rt) => {
          rt.data.forEach(item => {
            item.NAME = item.name
            item.ID = item.id
            item.TYPE = item.type
            // item.isParent = !this.toBoolean(item.isParent)
          })
          resolve(rt.data)
        }).catch((er) => {
          console.log(er)
        })
      }
    },
    confirm () {
      this.dialogVisible = false
      if (this.isMore) {
        this.$emit('confirm', this.orgAllList)
      } else {
        this.$emit('confirm', [this.organizeItem])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .checkList {
    color:#FFFFFF;
    background:#3792D8;
    display: inline-block;
    padding: 5px 10px;
  }
</style>
