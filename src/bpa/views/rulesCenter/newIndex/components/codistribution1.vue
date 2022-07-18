<template>
  <div class="w100">
    <el-dialog class="distribution" :visible.sync="isDialogsVisible" title="选择组织" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row :gutter="20">
        <el-col :span="16" class="tree_wrap">
          <el-row>
            <el-input
              pleaseEnterTheContent
              v-model="filterText"
              :placeholder="$t('placeholderText.pleaseEnterTheContent')"
              class="search_component remove-margin-b"
              clearable
              @keyup.13.native="abstractSearch"
            >
              <el-button slot="append" type="primary" @click="abstractSearch">
                {{$t("search")}}
              </el-button>
            </el-input>
          </el-row>
        </el-col>
      </el-row>
      <el-scrollbar class="h300px">
        <ul v-if="!isSearch" id="cochooserOrganizationTree" class="ztree left" />
        <ul v-if="isSearch" id="searchOrganizationTree" class="ztree left" />
      </el-scrollbar>
      <el-scrollbar class="h60px margin-t20">
        <p :title="checkData">
          {{ checkData }}
        </p>
      </el-scrollbar>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialogsVisible = false">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="confirmChoose">{{$t("confirm")}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getGroupTreeList
} from '@/bpa/api/componentsApi'
import { abstractSearch } from '@/bpa/api/jobsCenter'
import { userId } from '@/bpa/utils/common'
import '../../../../../../static/ztree/zTreeStyle.css'
import '../../../../../../static/ztree/jquery-1.4.4.min.js'
import '../../../../../../static/ztree/jquery.ztree.core.js'
import '../../../../../../static/ztree/jquery.ztree.excheck.min.js'
export default {
  name: 'Codistribution',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    disData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const self = this
    const url = process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    return {
      isDialogsVisible: false,
      sendState: '',
      orginalChecktion: [],
      settings: {
        async: {
          enable: true,
          contentType: 'application/json',
          otherParam: self.ajaxFun,
          url: url + '/select/user/cqp/getTotalOrg1Copy?username=' + userId
        },
        check: {
          enable: true, // true / false 分别表示 显示 / 不显示 复选框或单选框
          chkboxType: { 'Y': 'ps', 'N': 'ps' },
          nocheckInherit: false,
          autoCheckTrigger: false
        },
        data: {
          key: {
            name: 'name'
          },
          simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'pid',
            rootPId: 0
          }
        },
        view: {
          showIcon: false
        },
        callback: {
          onNodeCreated: self.onNodeCreated,
          beforeCheck: self.beforeCheck,
          onCheck: self.onCheck,
          onExpand: self.onExpand
        }
      },
      searchSettings: {
        async: {
          enable: true,
          contentType: 'application/json',
          otherParam: self.ajaxFun,
          url: url + '/select/user/cqp/getTotalOrgByNameCopy?username=' + userId
        },
        check: {
          enable: true, // true / false 分别表示 显示 / 不显示 复选框或单选框
          chkboxType: { 'Y': 'ps', 'N': 'ps' },
          nocheckInherit: false,
          autoCheckTrigger: false
        },
        data: {
          key: {
            name: 'name',
            children: 'subNodes'
          },
          simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'pid',
            rootPId: 0
          }
        },
        view: {
          showIcon: false
        },
        callback: {
          onCheck: self.onSearchCheck
        }
      },
      filterText: '',
      isSearch: false,
      firstZTreeData: [],
    }
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    checkData() {
      return this.orginalChecktion.map(item => { return item.name }).join(',')
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.isDialogsVisible = val
        this.filterText = ''
        this.isSearch = false
        console.log('++++++++++++++++++++++++++++')
        this.abstractSearch()
      }
    },
    isDialogsVisible(val) {
      this.$emit('input', val)
    }
  },
  mounted() {
    // this.grequireTree()
    // this.abstractSearch()
  },
  methods: {
    abstractSearch() {
      const self = this
      if (this.filterText) {
        this.isSearch = true
        abstractSearch({ orgname: this.filterText }).then(res => {
          // this.treeData = res
          console.log(res)
          console.log('==============================')
          if (!res) return false

          this.sendState = this.disData.bpmDto.coorgstate ? this.disData.bpmDto.coorgstate : '{"orglist":[]}'
          this.orginalChecktion = this.disData.bpmDto.codistribution ? JSON.parse(this.disData.bpmDto.codistribution).orglist : []
          const storeTempArr = self.sendState ? JSON.parse(self.sendState).orglist : []
          for (var j = 0; j < storeTempArr.length; j++) {
            if (res[0].id === storeTempArr[j].id) {
              if (storeTempArr[j].halfChecked) {
                res[0].halfCheck = true
                res[0].checked = true
              } else {
                res[0].checked = true
              }
            }
          }
          const zTree = $.fn.zTree.init($('#searchOrganizationTree'), self.searchSettings, res)
          // 让第一个父节点展开
          const nodes = zTree.getNodes()
          if (nodes.length > 0) {
            for (var i = 0; i < nodes.length; i++) {
              zTree.expandNode(nodes[i], true, false, false, true) // 默认展开第一级节点
            }
          }
        })
      } else {
        this.isSearch = false
        this.grequireTree()
      }
    },
    grequireTree() {
      console.log(this.disData.bpmDto.coorgstate, this.disData.bpmDto.codistribution)
      const self = this
      getGroupTreeList({
        pid: 0,
        type: '0,1,2,4'
      }).then(res => {
        console.log(res)
        this.firstZTreeData = res
        if (!res) return false
        this.sendState = this.disData.bpmDto.coorgstate ? this.disData.bpmDto.coorgstate : '{"orglist":[]}'
        this.orginalChecktion = this.disData.bpmDto.codistribution ? JSON.parse(this.disData.bpmDto.codistribution).orglist : []
        const storeTempArr = self.sendState ? JSON.parse(self.sendState).orglist : []
        for (var j = 0; j < storeTempArr.length; j++) {
          if (res[0].id === storeTempArr[j].id) {
            if (storeTempArr[j].halfChecked) {
              res[0].halfCheck = true
              res[0].checked = true
            } else {
              res[0].checked = true
            }
          }
        }
        const zTree = $.fn.zTree.init($('#cochooserOrganizationTree'), self.settings, res[0])
        // 让第一个父节点展开
        const nodes = zTree.getNodes()
        if (nodes.length > 0) {
          for (var i = 0; i < nodes.length; i++) {
            zTree.expandNode(nodes[i], true, false, false, true) // 默认展开第一级节点
          }
        }
      })
    },
    ajaxFun(treeid, treeNode) {
      return {
        pid: treeNode.id,
        type: '0,1,2,4'
      }
    },
    onNodeCreated(event, treeId, treeNode) {
      const self = this
      const zTree = $.fn.zTree.getZTreeObj('cochooserOrganizationTree')
      const storeTempArr = JSON.parse(self.sendState).orglist
      if (treeNode.type != 0 && (zTree.getNodesByParam('id', treeNode.pid, null)[0] && !zTree.getNodesByParam('id', treeNode.pid, null)[0].halfCheck && zTree.getNodesByParam('id', treeNode.pid, null)[0].checked)) {
        treeNode.checked = true
      } else if (treeNode.type != 0 && zTree.getNodesByParam('id', treeNode.pid, null)[0] && !zTree.getNodesByParam('id', treeNode.pid, null)[0].checked) {
        treeNode.checked = false
      } else {
        for (var j = 0; j < storeTempArr.length; j++) {
          if (treeNode.id === storeTempArr[j].id) {
            if (storeTempArr[j].halfChecked) {
              treeNode.halfCheck = true
              treeNode.checked = true
            } else {
              treeNode.checked = true
            }
            break
          }
        }
      }
      zTree.updateNode(treeNode)
    },
    beforeCheck(treeId, treeNode) {
      const self = this
      const zTree = $.fn.zTree.getZTreeObj('cochooserOrganizationTree')
      const storeTempArr = JSON.parse(self.sendState).orglist
      if (treeNode.type == 0 && treeNode.halfCheck == true) {
        treeNode.halfCheck = false
        for (var j = 0; j < storeTempArr.length; j++) {
          if (zTree.getNodesByParam('id', storeTempArr[j].id, null).length) {
            zTree.getNodesByParam('id', storeTempArr[j].id, null)[0].halfCheck = false
          }
        }
      }
      this.lookForFatherBeCheck(treeNode)
    },
    onExpand(event, treeId, treeNode) {
      const zTree = $.fn.zTree.getZTreeObj('cochooserOrganizationTree')
      if (treeNode.children.length > 0 && treeNode.type === '0') {
        for (var i = 0; i < treeNode.children.length; i++) {
          zTree.expandNode(treeNode.children[i], true, false, false, false) // 默认展开第一级节点
        }
      }
    },
    lookForFatherBeCheck(treeNode) {
      if (treeNode) {
        const zTree = $.fn.zTree.getZTreeObj('cochooserOrganizationTree')
        treeNode.halfCheck = false
        if (zTree.getNodesByParam('id', treeNode.id, null)[0].type === '0') {
          return false
        } else {
          return this.lookForFatherBeCheck(zTree.getNodesByParam('id', treeNode.pid, null)[0])
        }
      }
    },
    onCheck(event, treeId, treeNode) {
      const self = this
      const zTree = $.fn.zTree.getZTreeObj('cochooserOrganizationTree')
      const tempArr = []
      const arr = []
      let initArr = {}
      const sortArr = []
      console.log(self.sendState)
      const storeArr = JSON.parse(self.sendState).orglist

      // 取消选中该节点的部分
      if (!treeNode.checked && !zTree.getNodesByParam('id', treeNode.pid, null).length) {
        self.orginalChecktion = []
        return false
      }

      // 选中该节点的部分
      for (var i = 0; i < zTree.getCheckedNodes().length; i++) {
        if (zTree.getCheckedNodes()[i].type === '0') {
          initArr = zTree.getCheckedNodes()[i]
        }
        if (zTree.getCheckedNodes()[i].type !== '1' && zTree.getCheckedNodes()[i].type !== '0') {
          arr.push(zTree.getCheckedNodes()[i])
        }
      }
      if (initArr.type === '0' && !initArr.getCheckStatus().half) {
        self.orginalChecktion = []
        self.orginalChecktion.push({ id: initArr.id, name: initArr.name, pname: '', pid: '' })
        return
      } else {
        for (var j = 0; j < arr.length; j++) {
          self.loopFather(arr[j], arr, tempArr)
        }
      }
      console.log(self.orginalChecktion, tempArr)
      tempArr.forEach(item => {
        item.id = item.id
        item.name = item.name
        item.halfChecked = item.halfCheck
      })
      const dataId = []
      const dataName = []
      for (const k in tempArr) {
        dataId.push(tempArr[k].id)
        dataName.push(tempArr[k].name)
      }
      self.orginalChecktion = [{
        id: dataId.join(','),
        name: '(' + dataName.join(',') + ')',
        pname: '',
        pid: ''
      }]
      // 父级元素
      const parentData = []
      tempArr.forEach(item => {
        if (item.UP) {
          parentData.push(item.UP)
        }
      })
      const concatData = Array.from(new Set(tempArr.concat(parentData)))
      concatData.forEach(item => {
        item.id = item.id
        item.name = item.name
      })
      搜索的时候初始化
      this.disData.bpmDto.coorgstate = JSON.stringify({ 'orglist': [{
        'id': this.firstZTreeData[0].id,
        'checked': false,
        'halfChecked': true,
        'name': this.firstZTreeData[0].name,
        'pid': 0
      }, ...concatData] })
      this.disData.bpmDto.codistribution = JSON.stringify({ 'orglist': [{
        id: dataId.join(','),
        name: '(' + dataName.join(',') + ')',
        pname: '',
        pid: ''
      }] })
      var temp = []
      for (var idx = 0; idx < tempArr.length; idx++) {
        var objTemp = {
          pid: self.lookForFather(tempArr[idx]).pid,
          pname: self.lookForFather(tempArr[idx]).pname,
          name: tempArr[idx].name,
          id: tempArr[idx].id
        }
        if (((!tempArr[idx].getCheckStatus().half && !tempArr[idx].halfCheck) || tempArr[idx].halfCheck) && tempArr[idx].checked) {
          temp.push(objTemp)
        }
      }

      var obj = {}
      for (var h = 0; h < temp.length; h++) {
        obj[temp[h].id] = {
          pid: temp[h].pid,
          pname: temp[h].pname,
          id: temp[h].id,
          name: temp[h].name
        }
      }

      for (var i = 0; i < self.orginalChecktion.length; i++) {
        var tempIds = (self.orginalChecktion[i].id + '').split(',')
        var tempIdsArr = []
        if (tempIds.length > 1) {
          for (var m = 0; m < tempIds.length; m++) {
            if (!zTree.getNodesByParam('id', tempIds[m], null).length) {
              var idsArr = self.referId(storeArr, JSON.parse(JSON.stringify(self.orginalChecktion[i])))
              for (var t in idsArr) {
                obj[t] = idsArr[t]
              }
            }
          }
        } else {
          if (!zTree.getNodesByParam('id', tempIds[0], null).length) {
            var idsArr = self.referId(storeArr, JSON.parse(JSON.stringify(self.orginalChecktion[i])))
            for (var t in idsArr) {
              obj[t] = idsArr[t]
            }
          }
        }
      }

      // 临时存储
      var tempObj = {}
      for (var key in obj) {
        if (tempObj[obj[key].pid]) {
          tempObj[obj[key].pid].id.push(key)
          tempObj[obj[key].pid].name.push(obj[key].name)
        } else {
          tempObj[obj[key].pid] = {
            id: [key],
            name: [obj[key].name],
            pid: obj[key].pid,
            pname: obj[key].pname
          }
        }
      }
      var tempObjArr = []
      for (var key in tempObj) {
        tempObj[key].id = tempObj[key].id.join(',')
        tempObj[key].name = tempObj[key].name == tempObj[key].pname ? tempObj[key].name.join(',') : (tempObj[key].pname + '(' + tempObj[key].name.join(',') + ')')
        tempObjArr.push(tempObj[key])
      }
      console.log(tempObjArr)
      self.orginalChecktion = [].concat(tempObjArr)
    },
    onSearchCheck(event, treeId, treeNode) {
      const self = this
      const zTree = $.fn.zTree.getZTreeObj('searchOrganizationTree')
      const tempArr = []
      const arr = []
      let initArr = {}
      const sortArr = []
      // 选中该节点的部分
      for (var i = 0; i < zTree.getCheckedNodes().length; i++) {
        if (zTree.getCheckedNodes()[i].type === '0') {
          initArr = zTree.getCheckedNodes()[i]
        }
        if (zTree.getCheckedNodes()[i].type !== '1' && zTree.getCheckedNodes()[i].type !== '0') {
          arr.push(zTree.getCheckedNodes()[i])
        }
      }

      tempArr = JSON.parse(JSON.stringify((arr)))
      if (initArr.type === '0') {
        self.orginalChecktion = []
        self.orginalChecktion.push({ id: initArr.id, name: initArr.name, pname: '', pid: '' })
      } else {
        // for (var j = 0; j < arr.length; j++) {
        //   tempArr.push(arr[j])
        //   // tempArr = JSON.parse(JSON.stringify())
        //   // self.loopFather(arr[j], arr, tempArr)
        // }
      }

      const zTree2 = $.fn.zTree.getZTreeObj('cochooserOrganizationTree')
      const tempArr2 = []
      const arr2 = []
      let initArr2 = {}
      // 选中该节点的部分
      for (var ii = 0; ii < zTree2.getCheckedNodes().length; ii++) {
        if (zTree2.getCheckedNodes()[ii].type === '0') {
          initArr2 = zTree2.getCheckedNodes()[ii]
        }
        if (zTree2.getCheckedNodes()[ii].type !== '1' && zTree2.getCheckedNodes()[ii].type !== '0') {
          arr2.push(zTree2.getCheckedNodes()[ii])
        }
      }
      for (var jj = 0; jj < arr2.length; jj++) {
        tempArr2.push(arr2[jj])
      }
      let arrData = Array.from(new Set(tempArr2.concat(tempArr)))
      // 父级元素
      const parentData = []
      arrData.forEach(item => {
        if (item.UP && item.UP.length > 0) {
          parentData.push({
            id: item.id,
            name: item.name
          })
        }
      })
      arrData = Array.from(new Set(arrData.concat(parentData)))
      let dataId = []
      let dataName = []
      for (const k in arrData) {
        dataId.push(arrData[k].id)
        dataName.push(arrData[k].name)
      }
      dataId = Array.from(new Set(dataId))
      dataName = Array.from(new Set(dataName))
      self.orginalChecktion = [{
        id: dataId.join(','),
        name: '(' + dataName.join(',') + ')',
        pname: '',
        pid: ''
      }]
      arrData.forEach(item => {
        item.id = item.id
        item.name = item.name
      })
      搜索的时候初始化
      this.disData.bpmDto.coorgstate = JSON.stringify({ 'orglist': [{
        'id': this.firstZTreeData[0].id,
        'checked': false,
        'halfChecked': true,
        'name': this.firstZTreeData[0].name,
        'pid': 0
      }, ...arrData] })
      this.disData.bpmDto.codistribution = JSON.stringify({ 'orglist': [{
        id: dataId.join(','),
        name: dataName.length > 0 ? '(' + dataName.join(',') + ')' : '',
        pname: '',
        pid: ''
      }] })
      console.log(self.orginalChecktion, tempArr, tempArr2)
    },
    lookForFather(value) {
      const zTree = $.fn.zTree.getZTreeObj('cochooserOrganizationTree')
      const self = this
      if (zTree.getNodesByParam('id', value.pid, null)[0].type === '1' || zTree.getNodesByParam('id', value.pid, null)[0].type === '0') {
        return {
          pid: zTree.getNodesByParam('id', value.pid, null)[0].type === '1' ? value.id : '',
          pname: zTree.getNodesByParam('id', value.pid, null)[0].type === '1' ? value.name : ''
        }
      } else {
        return self.lookForFather(zTree.getNodesByParam('id', value.pid, null)[0])
      }
    },
    loopFather(value, arr, tempArr) {
      const self = this
      var index = ''
      for (var k = 0; k < arr.length; k++) {
        if (value.pid === arr[k].id) {
          if (!arr[k].getCheckStatus().half) {
            index = k
          }
        }
      }
      if (index === '') {
        if (!value.getCheckStatus().half) {
          var count = 0
          for (var m = 0; m < tempArr.length; m++) {
            if (tempArr[m].id === value.id) {
              count++
            }
          }
          if (!count) {
            tempArr.push(value)
          }
        }
      } else {
        return self.loopFather(arr[index], arr, tempArr)
      }
    },
    // 判断该节点的父级是否选中
    loopDelFather(value, arr) {
      const zTree = $.fn.zTree.getZTreeObj('cochooserOrganizationTree')
      const self = this
      if (!zTree.getNodesByParam('id', value.id, null).length) {
        for (var t = 0; t < arr.length; t++) {
          if (arr[t].id == value.id) {
            let pidContent = ''
            for (var o = 0; o < arr.length; o++) {
              if (arr[o].id == arr[t].pid) {
                pidContent = o
                break
              }
            }
            return self.loopDelFather(arr[pidContent], arr)
          }
        }
      } else if (!!zTree.getNodesByParam('id', value.id, null).length && !zTree.getNodesByParam('id', value.id, null)[0].checked) {
        return true
      } else {
        return false
      }
    },
    // 判断该节点是否存在
    referId(storeArr, deleteArr) {
      const obj = {}
      const self = this
      const strlength = deleteArr.name.length - 1
      deleteArr.id = (deleteArr.id + '').split(',')
      deleteArr.name = deleteArr.name == deleteArr.pname ? [deleteArr.name] : deleteArr.name.substring(0, strlength).split(deleteArr.pname + '(')[1].split(',')
      for (let j = 0; j < deleteArr.id.length; j++) {
        obj[deleteArr.id[j]] = {
          id: deleteArr.id[j],
          name: deleteArr.name[j],
          pid: deleteArr.pid,
          pname: deleteArr.pname
        }
      }
      for (var key in obj) {
        if (self.loopDelFather(obj[key], storeArr)) {
          delete obj[key]
        }
      }
      return obj
    },
    // 确认选择
    confirmChoose() {
      const self = this
      const zTree = $.fn.zTree.getZTreeObj('cochooserOrganizationTree')
      const checkedArr = zTree.getCheckedNodes()
      console.log(JSON.parse(self.sendState).orglist)
      const storeArr = !JSON.parse(self.sendState).orglist ? [] : JSON.parse(self.sendState).orglist

      for (var i = 0; i < checkedArr.length; i++) {
        var count = 0
        for (var k = 0; k < storeArr.length; k++) {
          if (storeArr[k].id == checkedArr[i].id) {
            storeArr[k] = {
              id: checkedArr[i].id,
              checked: !checkedArr[i].getCheckStatus().half,
              halfChecked: !!checkedArr[i].getCheckStatus().half,
              name: checkedArr[i].name,
              pid: checkedArr[i].pid
            }
            count++
            break
          }
        }
        if (!count) {
          storeArr.push({
            id: checkedArr[i].id,
            checked: !checkedArr[i].getCheckStatus().half,
            halfChecked: !!checkedArr[i].getCheckStatus().half,
            name: checkedArr[i].name,
            pid: checkedArr[i].pid
          })
        }
      }
      // 暂存选中的状态
      const tempStore = []
      for (var m = 0; m < storeArr.length; m++) {
        var checkNode = zTree.getNodesByParam('id', storeArr[m].id, null)
        if (!!checkNode.length && (checkNode[0].halfCheck || checkNode[0].checked)) {
          tempStore.push(storeArr[m])
        } else if (!checkNode.length && self.loopFatherConfirm(storeArr[m], storeArr)) {
          tempStore.push(storeArr[m])
        }
      }
      this.sendState = JSON.stringify({ 'orglist': tempStore })
      this.isDialogsVisible = false
      this.$emit('confirm', {
        'sendState': self.sendState,
        'orginalChecktion': JSON.stringify({ 'orglist': self.orginalChecktion })
      })
    },
    loopFatherConfirm(value, arr) {
      const self = this
      const zTree = $.fn.zTree.getZTreeObj('cochooserOrganizationTree')
      if (!zTree.getNodesByParam('id', value.id, null).length) {
        for (var t = 0; t < arr.length; t++) {
          if (arr[t].id == value.pid) {
            return self.loopFatherConfirm(arr[t], arr)
          }
        }
      } else if (!!zTree.getNodesByParam('id', value.id, null).length && !zTree.getNodesByParam('id', value.id, null)[0].checked) {
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<style lang="scss">
.ztree li span.button.chk.type1{
  display:none!important;
}
.distribution{
  .h60px{
    height: 60px;
  }
  .h300px{
    height: 300px;
  }
}
</style>
