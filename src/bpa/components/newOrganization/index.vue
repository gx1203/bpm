<template>
  <div id="organization">
    <el-dialog :visible.sync="dialogVisible" :before-close="handleDialogClose" :title="selectOperation" width="60%">
      <el-row class="header">
        <!-- 组织类型选择 -->
        <el-col :span="12">
          <el-radio-group v-model="organizationRadio" @change="changeRadioHandler">
            <el-radio :label="1">{{$t("OrganizationalTree")}}</el-radio>
            <!-- <el-radio :label="2">部门</el-radio>
            <el-radio :label="3">职务</el-radio>
            <el-radio :label="7">系统组</el-radio>
            <el-radio :label="10">自定义组</el-radio> -->
          </el-radio-group>
        </el-col>
        <!-- 自定义组 -->
        <!-- <el-col :span="8" :offset="4">
          <el-button v-show="isShowGroup == true" type="primary" @click="openUpdateGroup">修改组</el-button>
          <el-button type="primary" @click="openGroup('customGroup')">添加到自定义组</el-button>
          <el-button type="primary" @click="openGroup('specifiedGroup')">添加到指定组</el-button>
        </el-col> -->
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-input clearable v-model="searchText" class="search" :placeholder="pleaseEnterTheContent" :title="pleaseEnterTheContent" prefix-icon="el-icon-search"/>
          <!-- :check-strictly="true" 控制多选 -->
          <el-tree
            ref="tree"
            :props="props"
            :data="treeData"
            :filter-node-method="filterTreeNode"
            :load="loadNode"
            :expand-on-click-node="false"
            show-checkbox
            node-key="id"
            lazy
            @node-click="handleNodeClick"
            @check-change="handleCheckChange"/>
        </el-col>
        <el-col :span="10" :offset="4" class="transfer">
          <!-- <div class="transferSearch">
            <el-input clearable v-model="transferSearchText" class="search" placeholder="请输入内容" prefix-icon="el-icon-search" @keyup.enter.native="transferSearch"/>
          </div> -->
          <el-transfer
            :data="transferData"
            v-model="transferVal"
            :filter-method="filterMethod"
            :titles="transferTitles"
            :filter-placeholder="pleaseEnter"
            @change="handleTransferChange">
            <span slot-scope="{ option }">{{ option.label }}</span>
            <el-button v-show="showMore == true" slot="left-footer" @click="loadMore">{{$t("toMore")}}</el-button>
          </el-transfer>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSelectOrg">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="submitSelectOrg">{{$t("confirm")}}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="groupTitle" :visible.sync="addGroupVisible" :show-close="false" width="320px">
      <el-form ref="groupForm" :model="groupForm" :rules="addGroupRules">
        <el-form-item v-if="groupTitle == '自定义组'" prop="name" :label="groupName2" label-width="70px">
          <el-input clearable v-model="groupForm.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item v-else-if="groupTitle == '指定组'" prop="groupId" :label="selectGroup2" label-width="80px">
          <el-select clearable v-model="groupForm.groupId" :placeholder="pleaseSelectASet" :title="pleaseSelectASet">
            <el-option
              v-for="(option, index) in allGroupData"
              :key="index"
              :label="option.name"
              :value="option.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddGroup('groupForm')">{{$t("cancel")}}</el-button>
        <el-button v-if="groupTitle == '自定义组'" type="primary" @click="submitCustomGroupForm('groupForm')">{{$t("confirm")}}</el-button>
        <el-button v-else-if="groupTitle == '指定组'" type="primary" @click="submitAddGroupForm('groupForm')">{{$t("save")}}</el-button>
      </div>
    </el-dialog>
    <updateGroup v-model="updateGroupVisible" :update-group-id="updateGroupId" @updateGroupSuccess="updateGroupSuccess"/>
  </div>
</template>

<script>
import updateGroup from './updateGroup'
import {
  getAllRootTree,
  getAllDepartment,
  getAllJobClass,
  getAllJob,
  getAllSystemGroup,
  getAllCustomGroup,
  getAllGroup,
  ajaxGroupSave,
  getGroupInfo,
  getChildren,
  findOrgUsers,
  addGroupmember,
  getDepartmentList
} from '@/bpa/api/newOrganization'
export default {
  name: 'NewOrganization',
  components: {
    updateGroup
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    onlyOne: {
      type: Boolean,
      default: false
    },
    startChoice: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      updateGroupVisible: false,
      updateGroupId: '', // 修改组ID
      dialogVisible: false,
      isShowGroup: false,
      organizationRadio: 1, // 默认选中的组织
      searchText: '', // 树形结构过滤文本
      treeData: [],
      props: {
        label: 'name',
        isLeaf: 'leaf'
      },
      seletcdNode: [], // tree复选框选中节点
      cloneTreeData: [], // 拼接的TREE数据
      transferData: [], // 穿梭框数据
      transferVal: [], // 右边穿梭框数据
      transferTitles: ['选择用户', '已选对象'],
      transferSearchText: '',
      showMore: false, // 是否显示更多按钮
      pagesData: {
        pageNum: 1,
        pageSize: 100
        // orderby: 'sort',
        // sort: 'asc' // orderby有值时生效
      },
      standardType: [
        { name: '维度', typeId: '0' },
        { name: '公司', typeId: '1' },
        { name: '部门', typeId: '2' },
        { name: '岗位', typeId: '3' },
        { name: '事业部', typeId: '4' },
        { name: '片区', typeId: '5' },
        { name: '职务', typeId: '6' },
        { name: '系统组', typeId: '7' },
        { name: '角色', typeId: '8' },
        { name: '用户', typeId: '9' },
        { name: '自定义组', typeId: '10' }
      ],
      groupForm: {
        groupId: ''
      },
      groupTitle: '',
      addGroupRules: {
        name: [
          { required: true, message: '请输入组名', trigger: 'blur' }
        ],
        groupId: [
          { required: true, message: '请选择组', trigger: 'change' }
        ]
      },
      allGroupData: [],
      addGroupVisible: false, // 添加组弹窗
      filterMethod(query, items) {
        return items.label.indexOf(query) > -1
      },
      selectOperation:this.$t("selectOperation"),
      pleaseEnterTheContent:this.$t("placeholderText.pleaseEnterTheContent"),
      pleaseEnter:this.$t("placeholderText.pleaseEnter"),
      pleaseSelectASet:this.$t("placeholderText.pleaseSelectASet"),
      groupName2:this.$t("groupName2"),
      selectGroup2:this.$t("selectGroup2"),
      cannotAddGroups:this.$t("hintText.cannotAddGroups"),
      selectTheGroupThatYouWantToModify:this.$t("hintText.selectTheGroupThatYouWantToModify"),
      noMembersHaveBeenAddedToThisGroupAreYouSureToAddThisGroup:this.$t("hintText.noMembersHaveBeenAddedToThisGroupAreYouSureToAddThisGroup"),
      hint:this.$t("hintText.hint"),
      Undeleted:this.$t("hintText.Undeleted"),
      addedSuccess:this.$t("hintText.addedSuccess"),
      addGroupMembers:this.$t("hintText.addGroupMembers"),
      confirm:this.$t("confirm"),
      cancel:this.$t("cancel"),
    }
  },
  watch: {
    value(val) {
      // console.log(val)
      this.dialogVisible = val
      this.initAllRootTree() // 初始化数据
    },
    dialogVisible(val) {
      this.$emit('input', val)
    },
    searchText(val) {
      this.$refs.tree.filter(val)
    },
    onlyOne(val) {
      console.log(this.onlyOne)
    },
    startChoice(val) {
      this.startChoice = val
    }
  },
  mounted() {
    localStorage.removeItem('selectedTransferVal')
    localStorage.removeItem('currentClickNode')
  },
  methods: {
    // 获取系统组织中所有的根树
    initAllRootTree() {
      getAllRootTree().then(res => {
        console.log('所有根节点=>', res)
        res = res.data.data
        res.forEach(item => {
          item.leaf = false
          item.type = item.type,
          item.customType = '组织树'
          item.key = this.standardType[0].typeId + item.id
          item.disabled = true
        })
        this.treeData = res
        this.transferData = this.hasTransferData()
      })
    },
    // 获取部门数据
    initAllDepartment() {
      // 默认Tree结构
      this.treeData = [{
        name: '所有部门',
        leaf: true,
        disabled: true,
        customType: '部门'
      }]
      const data = {
        'filters': [
          {
            'key': 'type',
            'opt': 'EQ',
            'type': 'S',
            'value': '2'
          }
        ],
        'pageNum': this.pagesData.pageNum,
        'pageSize': this.pagesData.pageSize,
        'logic': 'and'
      }
      const backupData = this.hasTransferData()
      getAllDepartment(data).then(res => {
        console.log('部门=>', res)
        res.list.forEach(item => {
          backupData.push({
            label: item.name,
            key: this.standardType[2].typeId + item.id,
            id: item.id,
            type: item.type,
            customType: '部门'
          })
        })
        this.transferData = this.filterTransferData(backupData)

        this.showMore = res.pages > 1

        // 备份当前点击节点信息，便于穿梭框更多按钮使用
        const currentClickNode = {
          pages: res.pages, // 总页数
          nextPage: res.nextPage, // 下一页页码
          pageSize: res.pageSize,
          pageNum: res.pageNum,
          filters: data.filters,
          customType: '部门'
        }
        localStorage.setItem('currentClickNode', JSON.stringify(currentClickNode))
      })
    },
    // 获取所有岗位分类
    initGetAllJobClass() {
      getAllJobClass(this.pagesData).then(res => {
        console.log('岗位=>', res)
        res.list.forEach(item => {
          item.leaf = false
          // item.ID = item.id
          item.leaf = true
          item.disabled = true
          item.customType = '岗位'
        })
        this.treeData = res.list
        // this.transferData = this.hasTransferData()
        this.initGetAllJob(this.pagesData)
      })
    },
    // 获取职务
    initGetAllJob(val) {
      console.log(val)
      const searchData = {
        pageNum: this.pagesData.pageNum,
        pageSize: this.pagesData.pageSize,
        filters: [
          {
            'key': 'pid',
            'opt': 'EQ',
            'type': 'S',
            'value': val.id
          }
        ]
      }
      getAllJob(searchData).then(res => {
        console.log('职务=>', res)
        const backupData = this.hasTransferData() // 首次加载时会默认加载全部职务， 点击时会加载对应岗位下职务，防止数据重复
        res.list.forEach((item, index) => {
          backupData.push({
            label: item.name,
            key: this.standardType[6].typeId + item.id,
            id: item.id,
            customType: '职务',
            type: this.standardType[6].typeId
          })
        })
        this.transferData = this.filterTransferData(backupData)

        this.showMore = res.pages > 1
        // 备份当前点击节点信息，便于穿梭框更多按钮使用
        const currentClickNode = {
          pages: res.pages, // 总页数
          nextPage: res.nextPage, // 下一页页码
          pageSize: res.pageSize,
          pageNum: res.pageNum,
          customType: '职务',
          filters: searchData.filters || []
        }
        localStorage.setItem('currentClickNode', JSON.stringify(currentClickNode))
      })
    },
    // 获取系统组
    initGetAllSystemGroup() {
      this.showMore = false
      getAllSystemGroup(this.pagesData).then(res => {
        console.log('系统组=>', res)
        res.list.forEach(item => {
          item.leaf = false
          // item.ID = item.id
          item.id = item.id
          item.leaf = true
          item.customType = '系统组'
          item.key = this.standardType[7].typeId + item.id
        })
        this.treeData = res.list
        this.transferData = this.hasTransferData()
      })
    },
    // 获取自定义组
    initGetAllCustomGroup() {
      this.showMore = false
      getAllCustomGroup({
        pageNum: this.pagesData.pageNum,
        pageSize: this.pagesData.pageSize,
        filters: [{
          'key': 'status',
          'opt': 'EQ',
          'type': 'S',
          'value': '启用'
        }]
      }).then(res => {
        console.log('自定义组=>', res)
        res.list.forEach(item => {
          item.leaf = false
          // item.ID = item.id
          item.id = item.id
          item.leaf = true
          item.customType = '自定义组'
          item.key = this.standardType[10].typeId + item.id
        })
        this.treeData = res.list
        this.transferData = this.hasTransferData()
      })
    },
    // 选择组织类型单选框
    changeRadioHandler(val) {
      console.log('组织类型单选框选中值=>', val)
      this.transferSearchText = '' // 穿梭框搜索文本
      switch (val) {
        case 1:
          this.isShowGroup = false
          this.initAllRootTree()
          this.transferTitles[0] = '选择用户'
          break
        case 2:
          this.isShowGroup = false
          this.transferTitles[0] = '选择部门'
          this.initAllDepartment()
          break
        case 3:
          this.isShowGroup = false
          this.transferTitles[0] = '选择职务'
          this.initGetAllJobClass()
          break
        case 7:
          this.isShowGroup = false
          this.transferTitles[0] = '选择成员'
          this.initGetAllSystemGroup()
          break
        case 10:
          this.isShowGroup = true
          this.transferTitles[0] = '选择成员'
          this.initGetAllCustomGroup()
          break
        default:
          break
      }
    },
    // tree复选框勾选操作
    handleCheckChange(data, checked, indeterminate) {
      // tree复选框勾选时往transfer中添加数据
      if (checked) {
        const backupData = this.hasTransferData() // 本地备份数据

        if (this.onlyOne) {
          this.transferVal = [data.key]
          this.transferData = [{ // 新选中数据
            id: data.id,
            label: data.name,
            key: data.key,
            type: data.type,
            customType: data.customType
          }]
          this.$refs.tree.setCheckedNodes([{ id: data.id, label: data.name }])
        } else {
          backupData.push({ // 新选中数据
            id: data.id,
            label: data.name,
            key: data.key,
            type: data.type,
            customType: data.customType
          })
          this.transferData = this.filterTransferData(backupData)
          this.transferVal.push(data.key)
        }

        localStorage.setItem('selectedTransferVal', JSON.stringify(this.transferData)) // 本地备份已选中的数据
      } else {
        // tree复选框取消时
        this.transferData = this.transferData.filter(item => {
          return item.key != data.key
        })
        this.transferVal = this.transferVal.filter(item => {
          return item != data.key
        })

        localStorage.setItem('selectedTransferVal', JSON.stringify(this.transferData))
      }

      console.log(data, checked, indeterminate)
    },
    // 点击tree节点
    handleNodeClick(node) {
      console.log('点击节点=>', node)
      return

      if (node.customType == '部门') return // 部门下的节点不能点击

      // 查询组织下的用户
      if (node.customType == '组织树') {
        getDepartmentList({
          pageNum: this.pagesData.pageNum,
          pageSize: this.pagesData.pageSize,
          filters: [{
            'key': 'pid',
            'opt': 'EQ',
            'type': 'S',
            'value': node.id
          }, {
            'key': 'type',
            'opt': 'EQ',
            'type': 'S',
            'value': '3'
          }],
          logic: 'and'
        }).then(res => {
          console.log(res)
          const backupData = this.hasTransferData() // 本地备份数据
          res.list.forEach((item, index) => {
            backupData.push({ // 新加入数据
              label: item.name,
              id: item.id,
              key: item.id
            })
            this.transferData = this.filterTransferData(backupData)
          })

          this.showMore = res.pages > 1

          // 备份当前点击节点信息，便于穿梭框更多按钮使用
          const currentClickNode = {
            id: node.id,
            name: node.name,
            customType: node.customType,
            pages: res.pages, // 总页数
            nextPage: res.nextPage, // 下一页页码
            pageSize: res.pageSize,
            pageNum: res.pageNum
          }
          localStorage.setItem('currentClickNode', JSON.stringify(currentClickNode))
        })
      } else if (node.customType == '岗位') {
        this.initGetAllJob(node)
      } else if (node.customType == '系统组' || node.customType == '自定义组') {
        getGroupInfo(node.id).then(res => {
          console.log(res)
          const backupData = this.hasTransferData() // 本地备份数据
          res.groupMemberFbcList.forEach((item) => {
            backupData.push({ // 新加入数据
              label: item.name,
              key: item.type + item.itemid, // 这里用itemID是防止在 组里有成员时 还可以添加相同成员
              id: item.id,
              itemid: item.itemid,
              type: item.type,
              groupid: item.groupid
            })
          })
          this.transferData = this.filterTransferData(backupData)
        })
      }
    },
    // 组织树搜索过滤
    filterTreeNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 递归方法 生成 json tree 数据
    getJsonTree(data, parentId) {
      var itemArr = []
      for (var i = 0; i < data.length; i++) {
        var node = data[i]
        if (node.pid == parentId) {
          var newNode = {}
          newNode.id = node.id
          newNode.name = node.name
          newNode.children = this.getJsonTree(data, node.id)
          itemArr.push(newNode)
        }
      }
      return itemArr
    },
    // tree懒加载
    loadNode(node, resolve) {
      console.log(node)
      if (node.level > 0) {
        getChildren(node.data.id).then((rt) => {
          const resArr = []
          rt.forEach(item => {
            item.leaf = false
            item.customType = '组织树' // 组织下面的机构点击时需要获取用户信息
            item.key = this.standardType[1].typeId + item.id
            item.disabled = item.type != this.startChoice
            if (this.startChoice != '3') {
              if (this.startChoice == '1' ? item.type == '2' || item.type == '3' : item.type == '3' || item.type == '4') {
                resArr.push(item.type)
              }
            }
          })
          if (resArr.length === rt.length) {
            rt = []
          }
          resolve(rt)
        }).catch((er) => {
          console.log(er)
        })
      }
    },
    // 穿梭框右侧列表元素变化时触发
    handleTransferChange(val, arrow) {
      const backupData = []
      this.transferData.filter((item, index) => {
        val.forEach(e => {
          if (e == item.key) {
            backupData.push(item)
          }
        })
      })
      localStorage.setItem('selectedTransferVal', JSON.stringify(backupData))
      console.log(backupData)
    },
    hasTransferData() {
      const backupData = JSON.parse(localStorage.getItem('selectedTransferVal'))
      if (backupData && backupData.length > 0) {
        return backupData
      } else {
        return []
      }
    },
    // 过滤掉transferData重复数据
    filterTransferData(tar) {
      const obj = {}
      tar = tar.reduce((cur, next) => { // 过滤掉重复数据
        obj[next.key] ? '' : obj[next.key] = true && cur.push(next)
        return cur
      }, [])
      return tar
    },
    // 关闭整个组件弹窗
    handleDialogClose(done) {
      this.organizationRadio = 1
      localStorage.removeItem('selectedTransferVal')
      localStorage.removeItem('currentClickNode')
      this.$emit('changeOnlyOne', false)
      done()
    },
    // 打开添加组弹窗
    openGroup(type) {
      const backupData = this.hasTransferData()
      for (const item of backupData) {
        if (item.type && item.type == 'sys' || item.type == 'cus') {
          this.$message({
            message: this.cannotAddGroups,
            type: 'info'
          })
          return
        }
      }

      switch (type) {
        case 'customGroup':
          this.groupTitle = '自定义组'
          break
        case 'specifiedGroup':
          {
            this.groupTitle = '指定组'
            const data = {
              pageSize: 200,
              pageNum: this.pagesData.pageNum,
              filters: [{
                'key': 'status',
                'opt': 'EQ',
                'type': 'S',
                'value': '启用'
              }],
              // "orderby": "sort",
              // "sort": "desc",
              orgtype: 'ALL'
            }
            getAllGroup(data).then(res => {
              console.log(res)
              this.allGroupData = res.list
            })
          }
          break
        default:
          break
      }
      this.addGroupVisible = true
    },
    // 打开修改组窗口
    openUpdateGroup() {
      const data = this.hasTransferData().filter(item => {
        return item.type == 'cus'
      })
      if (data.length == 0 || data.length > 1) {
        this.$message({
          message: this.selectTheGroupThatYouWantToModify,
          type: 'info'
        })
        return
      }

      this.updateGroupId = data[0].id
      this.updateGroupVisible = true

      console.log(this.updateGroupId)
    },
    // 添加自定义组
    submitCustomGroupForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const backupData = this.hasTransferData()
          for (const item of backupData) {
            if (item.type && item.type == 'sys' || item.type == 'cus') {
              this.$message({
                message: this.cannotAddGroups,
                type: 'info'
              })
              return
            }
          }
          const groupMemberFbcList = []
          if (backupData.length == 0) {
            this.$confirm(this.noMembersHaveBeenAddedToThisGroupAreYouSureToAddThisGroup, this.hint, {
              confirmButtonText: this.confirm,
              cancelButtonText: this.cancel,
              type: 'warning'
            }).then(() => {
              const filters = []
            }).catch(() => {
              this.$message({
                type: 'info',
                message: this.Undeleted
              })
            })
          } else {
            backupData.forEach(item => {
              groupMemberFbcList.push({
                name: item.label,
                type: item.type,
                itemid: item.id
              })
            })
          }
          console.log(groupMemberFbcList)
          ajaxGroupSave({
            name: this.groupForm.name,
            type: 'cus',
            status: '启用',
            groupMemberFbcList: groupMemberFbcList
          }).then(res => {
            console.log(res)
            this.$message({
              message: this.addedSuccess,
              type: 'success'
            })
            this.addGroupVisible = false
            this.organizationRadio = 10
            this.initGetAllCustomGroup()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 添加到指定组
    submitAddGroupForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('kkk')
          console.log(this.groupForm)
          const data = {
            groupMemberFbcList: []
          }
          const backupData = this.hasTransferData()
          backupData.forEach(item => {
            data.groupMemberFbcList.push({
              name: item.label,
              itemid: item.id,
              type: item.type
            })
          })
          data.id = this.groupForm.groupId
          if (data.groupMemberFbcList.length == 0) {
            this.$message({
              message: this.addGroupMembers,
              type: 'info'
            })
            return
          }
          addGroupmember(data).then(res => {
            console.log(res)
            this.$message({
              message: this.addedSuccess,
              type: 'success'
            })
            this.addGroupVisible = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消添加组后 重置表单
    cancelAddGroup(formName) {
      this.addGroupVisible = false
      this.$refs[formName].resetFields()
    },
    // 穿梭框加载更多
    loadMore() {
      const clickNode = JSON.parse(localStorage.getItem('currentClickNode')) // 备份的最近一次点击时tree节点的数据
      if (clickNode.pages <= 1 || clickNode.nextPage == 0) { // 总页数小于1或者已经点击到最后一页
        this.showMore = false
        return
      }

      switch (this.organizationRadio) {
        case 1: // 组织树
          findOrgUsers({
            'orgid': clickNode.id,
            pageSize: clickNode.pageSize,
            pageNum: clickNode.nextPage
          }).then(res => {
            console.log(res)
            clickNode.nextPage = res.nextPage
            clickNode.pageNum = res.pageNum
            clickNode.pages = res.pages
            localStorage.setItem('currentClickNode', JSON.stringify(clickNode))

            res.list.forEach((item, index) => {
              this.transferData.push({ // 新加入数据
                label: item.allname,
                id: item.empuid,
                key: this.standardType[9].typeId + index + new Date().getTime()
              })
            })
          })
          break
        case 2: // 部门
          getAllDepartment({
            pageSize: clickNode.pageSize,
            pageNum: clickNode.nextPage,
            filters: clickNode.filters
          }).then(res => {
            console.log(res)
            clickNode.nextPage = res.nextPage
            clickNode.pageNum = res.pageNum
            clickNode.pages = res.pages
            localStorage.setItem('currentClickNode', JSON.stringify(clickNode))

            res.list.forEach((item, index) => {
              this.transferData.push({ // 新加入数据
                label: item.name,
                key: this.standardType[2].typeId + item.id,
                id: item.id,
                type: item.type,
                customType: '部门'
              })
            })
          })
          break
        case 3: // 职务
          getAllJob({
            pageSize: clickNode.pageSize,
            pageNum: clickNode.nextPage,
            filters: clickNode.filters
          }).then(res => {
            console.log(res)
            clickNode.nextPage = res.nextPage
            clickNode.pageNum = res.pageNum
            clickNode.pages = res.pages
            localStorage.setItem('currentClickNode', JSON.stringify(clickNode))

            res.list.forEach((item, index) => {
              this.transferData.push({ // 新加入数据
                label: item.name,
                id: item.id,
                key: this.standardType[6].typeId + item.id
              })
            })
          })
          break
        default:
          break
      }
    },
    // 修改组后更新界面
    updateGroupSuccess(val) {
      if (typeof val === 'string') {
        // 删除了组
        let backupData = this.hasTransferData()
        backupData = backupData.filter(item => {
          return item.id != val // 把已删除的组从本地存储数据中删除
        })
        this.transferData = backupData
        localStorage.setItem('selectedTransferVal', JSON.stringify(backupData)) // 同步更新本地数据
        console.log(backupData)
      }
      this.initGetAllCustomGroup()
    },
    // 穿梭框搜索
    transferSearch() {
      const clickNode = JSON.parse(localStorage.getItem('currentClickNode')) // 备份的最近一次点击时tree节点的数据
      const backupData = this.hasTransferData() // 本地备份数据
      this.showMore = false
      switch (this.organizationRadio) {
        case 1: // 组织树
        {
          let data
          if (!clickNode || clickNode.customType != '组织树') {
            data = {
              'filters': [{
                'key': 'cnname',
                'opt': 'LIKE',
                'type': 'S',
                'value': this.transferSearchText
              }]
            }
          } else if (clickNode && clickNode.customType == '组织树') {
            data = {
              'filters': [{
                'key': 'cnname',
                'opt': 'LIKE',
                'type': 'S',
                'value': this.transferSearchText
              }],
              attr: {
                orgid: clickNode.id
              }
            }
          }

          findOrgUsers(data).then(res => {
            console.log(res)
            if (res.list.length == 0) {
              this.$message(this.noRelevantDataWasSearched)
              return
            }
            res.list.forEach((item, index) => {
              backupData.push({ // 新加入数据
                label: item.allname,
                id: item.empuid,
                key: this.standardType[9].typeId + index + new Date().getTime()
              })
              this.transferData = this.filterTransferData(backupData)
            })
          })
          break
        }
        case 2: // 部门
          getAllDepartment({
            'filters': [{
              'key': 'type',
              'opt': 'EQ',
              'type': 'S',
              'value': '2'
            }, {
              'key': 'name',
              'opt': 'LIKE',
              'type': 'S',
              'value': this.transferSearchText
            }],
            logic: 'and'
          }).then(res => {
            res.list.forEach(item => {
              backupData.push({
                label: item.name,
                key: this.standardType[2].typeId + item.id,
                id: item.id,
                type: item.type,
                customType: '部门'
              })
            })
            this.transferData = this.filterTransferData(backupData)
          })
          break
        case 3: // 职务
          let dataJob = {}
          if (!clickNode.filters[0].value) {
            dataJob = {
              filters: [{
                'key': 'pid',
                'opt': 'EQ',
                'type': 'S',
                'value': ''
              }, {
                'key': 'name',
                'opt': 'LIKE',
                'type': 'S',
                'value': this.transferSearchText
              }],
              logic: 'and'
            }
          } else {
            dataJob = {
              filters: [{
                'key': 'pid',
                'opt': 'EQ',
                'type': 'S',
                'value': clickNode.filters[0].value
              }, {
                'key': 'name',
                'opt': 'LIKE',
                'type': 'S',
                'value': this.transferSearchText
              }],
              logic: 'and'
            }
          }

          getAllJob(dataJob).then(res => {
            res.list.forEach((item, index) => {
              backupData.push({
                label: item.name,
                key: this.standardType[6].typeId + item.id,
                id: item.id,
                customType: '职务'
              })
            })
            this.transferData = this.filterTransferData(backupData)
          })
          break
        default:
          // 系统组和自定义组
          const sysData = this.transferData.filter(item => {
            if (item.label.search(this.transferSearchText) != -1) {
              return item
            }
          })
          this.transferData = this.filterTransferData(backupData.concat(sysData))
          console.log(sysData)
          break
      }
    },
    // 取消选择
    cancelSelectOrg() {
      this.organizationRadio = 1
      localStorage.removeItem('selectedTransferVal')
      localStorage.removeItem('currentClickNode')
      this.$emit('changeOnlyOne', false)
      this.dialogVisible = false
    },
    // 最终选择结果
    submitSelectOrg() {
      console.log('最终选择结果', this.hasTransferData())
      this.organizationRadio = 1
      if (this.onlyOne) { // 只能选一个岗位的情况
        this.$emit('getTransferData', this.hasTransferData()[0])
      } else {
        let sendParentVal = this.hasTransferData().map(item => item.id)
        let sendParentName = this.hasTransferData().map(item => item.label)
        sendParentVal = sendParentVal.join(',')
        sendParentName = sendParentName.join('/')
        this.$emit('getTransferList', sendParentVal)
        this.$emit('getTransferNameList', sendParentName)
      }

      this.$emit('changeOnlyOne', false)
      localStorage.removeItem('selectedTransferVal')
      localStorage.removeItem('currentClickNode')
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
#organization {
  /deep/ .el-dialog {
    max-width: 800px;
  }
  .header {
    margin-bottom: 40px;
  }
  .el-transfer {
    /deep/ .el-transfer__buttons {
      width: 14%;
      padding: 0;
      .el-button {
        display: block;
        margin: 0 auto;
      }
      .el-button+.el-button {
        margin-top: 10px;
      }
    }
    /deep/ .el-transfer-panel {
      min-width: 200px;
      width: 43%;
    }
    /deep/ .el-transfer-panel:first-child,
    /deep/ .el-transfer__buttons {
      display: none;
    }
  }
  .el-tree {
    max-height: 400px;
    overflow-y: scroll;
  }
  .search {
    margin-bottom: 10px;
  }
  .transferSearch {
    width: 40%;
  }
}
</style>
