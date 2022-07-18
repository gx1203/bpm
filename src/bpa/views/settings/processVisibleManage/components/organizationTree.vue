<template>
  <div class="w100">
    <el-dialog class="distribution" :visible.sync="isDialogsVisible" title="选择组织" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-scrollbar class="h300px">
        <ul id="chooserOrganizationTree" class="ztree left" />
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
import '../../../../../../static/ztree/zTreeStyle.css'
import '../../../../../../static/ztree/jquery-1.4.4.min.js'
import '../../../../../../static/ztree/jquery.ztree.core.js'
import '../../../../../../static/ztree/jquery.ztree.excheck.min.js'
export default {
  name: 'OrganizationTree',
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
      oldCheckedData: {},
      settings: {
        async: {
          enable: true,
          contentType: 'application/json',
          otherParam: self.ajaxFun,
          url: url + '/select/user/cqp/getTotalOrg1'
        },
        check: {
          enable: true, // true / false 分别表示 显示 / 不显示 复选框或单选框
          chkboxType: { 'Y': 'ps', 'N': 'ps' },
          nocheckInherit: false,
          autoCheckTrigger: false
        },
        data: {
          key: {
            name: 'NAME'
          },
          simpleData: {
            enable: true,
            idKey: 'ID',
            pIdKey: 'PID',
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
      }
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
        this.grequireTree()
      }
    },
    isDialogsVisible(val) {
      this.$emit('input', val)
    }
  },
  mounted() {
  },
  methods: {
    grequireTree() {
      const self = this
      getGroupTreeList({
        pid: 0,
        type: '0,1,2,3,4'
      }).then(res => {
        this.sendState = this.disData.checkname ? this.disData.checkname : '{"orglist":[]}'
        this.orginalChecktion = this.disData.orgname ? JSON.parse(this.disData.orgname).orglist : []
        this.oldCheckedData = this.disData.orgname ? (JSON.parse(this.disData.orgname).oldCheckedData ? JSON.parse(this.disData.orgname).oldCheckedData : {}) : {}
        const storeTempArr = self.sendState ? JSON.parse(self.sendState).orglist : []
        for (var j = 0; j < storeTempArr.length; j++) {
          if (res[0].ID === storeTempArr[j].id) {
            if (storeTempArr[j].halfChecked) {
              res[0].halfCheck = true
              res[0].checked = true
            } else {
              res[0].checked = true
            }
          }
        }
        const zTree = $.fn.zTree.init($('#chooserOrganizationTree'), self.settings, res[0])
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
        pid: treeNode.ID,
        type: '0,1,2,3,4'
      }
    },
    onNodeCreated(event, treeId, treeNode) {
      const self = this
      const zTree = $.fn.zTree.getZTreeObj('chooserOrganizationTree')
      const storeTempArr = JSON.parse(self.sendState).orglist
      if (treeNode.TYPE != 0 && (!zTree.getNodesByParam('ID', treeNode.PID, null)[0].halfCheck && zTree.getNodesByParam('ID', treeNode.PID, null)[0].checked)) {
        treeNode.checked = true
      } else if (treeNode.TYPE != 0 && !zTree.getNodesByParam('ID', treeNode.PID, null)[0].checked) {
        treeNode.checked = false
      } else {
        for (var j = 0; j < storeTempArr.length; j++) {
          if (treeNode.ID === storeTempArr[j].id) {
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
      const zTree = $.fn.zTree.getZTreeObj('chooserOrganizationTree')
      const storeTempArr = JSON.parse(self.sendState).orglist
      if (treeNode.TYPE == 0 && treeNode.halfCheck == true) {
        treeNode.halfCheck = false
        for (var j = 0; j < storeTempArr.length; j++) {
          if (zTree.getNodesByParam('ID', storeTempArr[j].id, null).length) {
            zTree.getNodesByParam('ID', storeTempArr[j].id, null)[0].halfCheck = false
          }
        }
      }
      this.lookForFatherBeCheck(treeNode)
    },
    onExpand(event, treeId, treeNode) {
      const zTree = $.fn.zTree.getZTreeObj('chooserOrganizationTree')
      if (treeNode.children.length > 0 && treeNode.TYPE === '0') {
        for (var i = 0; i < treeNode.children.length; i++) {
          zTree.expandNode(treeNode.children[i], true, false, false, false) // 默认展开第一级节点
        }
      }
    },
    lookForFatherBeCheck(treeNode) {
      const zTree = $.fn.zTree.getZTreeObj('chooserOrganizationTree')
      treeNode.halfCheck = false
      if (zTree.getNodesByParam('ID', treeNode.ID, null)[0].TYPE === '0') {
        return false
      } else {
        return this.lookForFatherBeCheck(zTree.getNodesByParam('ID', treeNode.PID, null)[0])
      }
    },
    onCheck(event, treeId, treeNode) {
      const self = this
      const zTree = $.fn.zTree.getZTreeObj('chooserOrganizationTree')
      const tempArr = []
      const arr = []
      let initArr = {}
      const sortArr = []
      console.log(self.sendState)
      const storeArr = JSON.parse(self.sendState).orglist

      // 取消选中该节点的部分
      if (!treeNode.checked && !zTree.getNodesByParam('ID', treeNode.PID, null).length) {
        self.orginalChecktion = []
        return false
      }

      // 选中该节点的部分
      for (var i = 0; i < zTree.getCheckedNodes().length; i++) {
        if (zTree.getCheckedNodes()[i].TYPE === '0') {
          initArr = zTree.getCheckedNodes()[i]
        }
        if (zTree.getCheckedNodes()[i].TYPE !== '1' && zTree.getCheckedNodes()[i].TYPE !== '0') {
          arr.push(zTree.getCheckedNodes()[i])
        }
      }

      if (initArr.TYPE === '0' && !initArr.getCheckStatus().half) {
        self.orginalChecktion = []
        self.orginalChecktion.push({ id: initArr.ID, name: initArr.NAME, pname: '', pid: '' })
        return
      } else {
        for (var j = 0; j < arr.length; j++) {
          self.loopFather(arr[j], arr, tempArr)
        }
      }
      var temp = []
      for (var idx = 0; idx < tempArr.length; idx++) {
        var objTemp = {
          pid: self.lookForFather(tempArr[idx]).pid,
          pname: self.lookForFather(tempArr[idx]).pname,
          name: tempArr[idx].NAME,
          id: tempArr[idx].ID,
          neighbourname: tempArr[idx].TYPE == 3 ? (zTree.getNodesByParam('ID', tempArr[idx].PID, null)[0].TYPE == 1 ? tempArr[idx].NAME : zTree.getNodesByParam('ID', tempArr[idx].PID, null)[0].NAME) : tempArr[idx].NAME,
          neighbourid: tempArr[idx].TYPE == 3 ? (zTree.getNodesByParam('ID', tempArr[idx].PID, null)[0].TYPE == 1 ? tempArr[idx].ID : zTree.getNodesByParam('ID', tempArr[idx].PID, null)[0].ID) : tempArr[idx].ID
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
          name: temp[h].name,
          neighbourname: temp[h].neighbourname,
          neighbourid: temp[h].neighbourid
        }
      }

      const idsArr = self.referId(storeArr, JSON.parse(JSON.stringify(self.oldCheckedData)))
      for (var t in idsArr) {
        obj[t] = idsArr[t]
      }

      for (var keey in obj) {
        if (obj[keey].neighbourid == obj[keey].id) {
          obj[keey].neighbourid = ''
          obj[keey].neighbourname = ''
        }
      }

      for (var keyyIn in obj) {
        if (obj[obj[keyyIn].neighbourid]) {
          delete obj[keyyIn]
        }
      }

      // 岗位归类除了他的父级是TYPE== 1类型的
      const positionObj = {}
      for (var key in obj) {
        if (!obj[key].neighbourid) {
          positionObj[key] = JSON.parse(JSON.stringify(obj[key]))
        } else {
          if (positionObj[obj[key].neighbourid]) {
            positionObj[obj[key].neighbourid].id.push(key)
            positionObj[obj[key].neighbourid].name.push(obj[key].name)
          } else {
            positionObj[obj[key].neighbourid] = {
              id: [key],
              name: [obj[key].name],
              pid: obj[key].pid,
              pname: obj[key].pname,
              neighbourid: obj[key].neighbourid,
              neighbourname: obj[key].neighbourname
            }
          }
        }
      }

      for (var key in positionObj) {
        if (Object.prototype.toString.call(positionObj[key].id) === '[object Array]') {
          positionObj[key].id = positionObj[key].id.join(','),
          positionObj[key].name = positionObj[key].neighbourname + '(' + positionObj[key].name.join(',') + ')'
        }
      }

      // 临时存储
      const tempObj = {}
      for (var key in positionObj) {
        if (tempObj[positionObj[key].pid]) {
          tempObj[positionObj[key].pid].id.push(key)
          tempObj[positionObj[key].pid].name.push(positionObj[key].name)
        } else {
          tempObj[positionObj[key].pid] = {
            id: [key],
            name: [positionObj[key].name],
            pid: positionObj[key].pid,
            pname: positionObj[key].pname
          }
        }
      }
      const tempObjArr = []
      for (var key in tempObj) {
        tempObj[key].id = tempObj[key].id.join(',')
        tempObj[key].name = tempObj[key].name.join(',') == tempObj[key].pname ? tempObj[key].pname : (tempObj[key].pname + '(' + tempObj[key].name.join(',') + ')')
        tempObjArr.push(tempObj[key])
      }

      self.orginalChecktion = [].concat(tempObjArr)
      self.oldCheckedData = JSON.parse(JSON.stringify(obj))
    },
    lookForFather(value) {
      const zTree = $.fn.zTree.getZTreeObj('chooserOrganizationTree')
      const self = this
      if (zTree.getNodesByParam('ID', value.PID, null)[0].TYPE === '1' || zTree.getNodesByParam('ID', value.PID, null)[0].TYPE === '0') {
        return {
          pid: zTree.getNodesByParam('ID', value.PID, null)[0].TYPE === '1' ? (value.TYPE == 3 ? zTree.getNodesByParam('TYPE', '0', null)[0].ID : value.ID) : '',
          pname: zTree.getNodesByParam('ID', value.PID, null)[0].TYPE === '1' ? (value.TYPE == 3 ? zTree.getNodesByParam('TYPE', '0', null)[0].NAME : value.NAME) : ''
        }
      } else {
        return self.lookForFather(zTree.getNodesByParam('ID', value.PID, null)[0])
      }
    },
    loopFather(value, arr, tempArr) {
      const self = this
      var index = ''
      for (var k = 0; k < arr.length; k++) {
        if (value.PID === arr[k].ID) {
          if (!arr[k].getCheckStatus().half) {
            index = k
          }
        }
      }
      if (index === '') {
        if (!value.getCheckStatus().half) {
          var count = 0
          for (var m = 0; m < tempArr.length; m++) {
            if (tempArr[m].ID === value.ID) {
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
      const zTree = $.fn.zTree.getZTreeObj('chooserOrganizationTree')
      const self = this
      if (!zTree.getNodesByParam('ID', value.id, null).length) {
        for (let t = 0; t < arr.length; t++) {
          if (arr[t].id == value.id) {
            let pidContent = ''
            for (let o = 0; o < arr.length; o++) {
              if (arr[o].id == arr[t].pid) {
                pidContent = o
                break
              }
            }
            return self.loopDelFather(arr[pidContent], arr)
          }
        }
      } else if (
        (!!zTree.getNodesByParam('ID', value.id, null).length && !zTree.getNodesByParam('ID', value.id, null)[0].checked) ||
        (!!zTree.getNodesByParam('ID', value.id, null).length && zTree.getNodesByParam('ID', zTree.getNodesByParam('ID', value.id, null)[0].PID, null)[0].checked && !zTree.getNodesByParam('ID', zTree.getNodesByParam('ID', value.id, null)[0].PID, null)[0].getCheckStatus().half)
      ) {
        return true
      } else {
        return false
      }
    },
    // 判断该节点是否存在
    referId(storeArr, deleteArr) {
      const zTree = $.fn.zTree.getZTreeObj('chooserOrganizationTree')
      const self = this
      const obj = JSON.parse(JSON.stringify(deleteArr))
      for (var key in obj) {
        if (self.loopDelFather(obj[key], storeArr) || !!zTree.getNodesByParam('ID', obj[key].id, null).length && !!zTree.getNodesByParam('ID', obj[key].id, null)[0].getCheckStatus().half) {
          delete obj[key]
        }
      }
      return obj
    },
    // 确认选择
    confirmChoose() {
      const self = this
      const zTree = $.fn.zTree.getZTreeObj('chooserOrganizationTree')
      const checkedArr = zTree.getCheckedNodes()
      const storeArr = !JSON.parse(self.sendState).orglist ? [] : JSON.parse(self.sendState).orglist

      for (var i = 0; i < checkedArr.length; i++) {
        var count = 0
        for (var k = 0; k < storeArr.length; k++) {
          if (storeArr[k].id == checkedArr[i].ID) {
            storeArr[k] = {
              id: checkedArr[i].ID,
              checked: !checkedArr[i].getCheckStatus().half,
              halfChecked: !!checkedArr[i].getCheckStatus().half,
              name: checkedArr[i].NAME,
              pid: checkedArr[i].PID
            }
            count++
            break
          }
        }
        if (!count) {
          storeArr.push({
            id: checkedArr[i].ID,
            checked: !checkedArr[i].getCheckStatus().half,
            halfChecked: !!checkedArr[i].getCheckStatus().half,
            name: checkedArr[i].NAME,
            pid: checkedArr[i].PID
          })
        }
      }
      // 暂存选中的状态
      const tempStore = []
      for (var m = 0; m < storeArr.length; m++) {
        var checkNode = zTree.getNodesByParam('ID', storeArr[m].id, null)
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
        'orginalChecktion': JSON.stringify({ 'orglist': self.orginalChecktion, 'oldCheckedData': self.oldCheckedData })
      })
    },
    loopFatherConfirm(value, arr) {
      const self = this
      const zTree = $.fn.zTree.getZTreeObj('chooserOrganizationTree')
      if (!zTree.getNodesByParam('ID', value.id, null).length) {
        for (var t = 0; t < arr.length; t++) {
          if (arr[t].id == value.pid) {
            return self.loopFatherConfirm(arr[t], arr)
          }
        }
      } else if (!!zTree.getNodesByParam('ID', value.id, null).length && !zTree.getNodesByParam('ID', value.id, null)[0].checked) {
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
