<template>
  <el-dialog title="选择人员"
    class="person_list"
    :visible.sync="dialogVisible"
    width="70%"
    :close-on-click-modal = false
    :close-on-press-escape = false>
    <el-row :gutter="20" class="group_container">
      <el-col :span="9" class="tree_wrap">
        <el-scrollbar class="tree_node">
          <el-tree
            :props="props"
            :load="getFilterTreeList"
            check-strictly
            node-key="ID"
            ref="groupTree"
            :default-expanded-keys="[grandParentId]"
            :expand-on-click-node="false"
            @node-click="handlerNodeClick"
            @check-change="handlerNodeChecked"
            lazy>
          </el-tree>
        </el-scrollbar>
      </el-col>
      <el-col :span="15">
        <el-row>
          <el-col :span="24">
            <el-input clearable placeholder="请输入内容" class="search_component" v-model="keyWords">
              <el-button type="primary"  slot="append" @click="singleSearch"> {{$t('search')}}</el-button>
            </el-input>
          </el-col>
        </el-row>
        <el-table
          :data="personList"
          ref="personTable"
          border
          @selection-change="handleSelectionChange"
          class="main_tab">
          <el-table-column
            :label="$t('number')"
            type="selection">
          </el-table-column>
          <el-table-column
            :label="$t('number')"
            type="index">
          </el-table-column>
          <el-table-column
            prop="cnname"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="empuid"
            label="账号">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="email"
            label="邮箱">
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pages.pageNum"
          :page-size="pages.pageSize"
          :pager-count="5"
          background
          layout="prev, pager, next, jumper, total"
          :total="pages.total">
        </el-pagination>
      </el-col>
    </el-row>
    <div class="selected_list">
      <div class="selected_item" v-for="(item,index) in selectedList" :key="index">
        <span class="name">{{item.cnname}}({{item.empuid}})</span>
        <i @click="deleteSelectedItem(item.empuid)" class="el-icon-close"></i>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取消</el-button>
    <el-button type="primary" @click="handlerConfirmDialog">确定</el-button>
  </span>
</el-dialog>
</template>

<script>
import { getGroupTreeList, getUserList } from '@/bpa/api/componentsApi'
import { querytRoleUser } from '@/bpa/api/settings/systemRoleManage'
export default {
  name: 'SelectPerson2',
  data () {
    return {
      personList: [],
      keyWords: '',
      selectedList: [],
      grandParentId: '',
      times: 0,
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      times: 0,
      dialogVisible: false,
      orgid: '0',
      props: {
        label: 'NAME',
        isLeaf: function (data, node) {
          if (data.isParent === 'true') {
            return false
          } else {
            return true
          }
        }
      }
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    roleId: {
      type: String,
      default: '0'
    },
    selected: {
      type: Array,
      default: () => []
    }
  },
  mounted () {
    this.selectedList = JSON.parse(JSON.stringify(this.selected))
  },
  watch: {
    value (val) {
      this.dialogVisible = val
      if (val) {
        this.getList()
        this.selectedList = JSON.parse(JSON.stringify(this.selected))
      } else {
        this.keyWords = ''
        this.selectedList = []
        this.pages = {
          pageSize: 10,
          pageNum: 1,
          total: 0
        }
      }
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    singleSearch () {
      this.pages.pageNum = 1
      this.getList()
    },
    getFilterTreeList (node, resolve) {
      let id = node.data ? node.data.ID : '0'
      getGroupTreeList({
        pid: id,
        type: '1,2,3,4'
      }).then(res => {
        res.map(item => {
          item.ID = item.id
          item.NAME = item.name
        })
        if (this.times === 0) { // 默认展示做高级树的第一个节点下的所有人员名单
          this.times++
          this.handlerNodeClick(res[0])
        }
        if (id === '0') {
          this.grandParentId = res[0].ID
        }
        resolve(res)
      })
    },
    getList () {
      getUserList({'attr': {'orgid': this.orgid}, 'orderby': '', 'pageNum': this.pages.pageNum, 'pageSize': this.pages.pageSize, 'sort': 'desc', 'logic': 'or', 'filters': [{'key': 'cnname', 'opt': 'LIKE', 'type': 'S', 'value': this.keyWords}, {'key': 'empuid', 'opt': 'LIKE', 'type': 'S', 'value': this.keyWords}]}).then(res => {
        res.list.map(item => {
          item.cnname  = item.name
          item.empuid = item.memberId
        })
        this.personList = res.list
        this.pages.total = res.total
        if (this.selectedList.length === 0) {
          // this.getSelectList()
        } else {
          this.autoSelected(this.personList, this.selectedList)
        }
      })
    },
    getSelectList () {
      this.pages.pageNum = 1
      querytRoleUser({attr: {roleid: this.roleId}, pageNum: 1, pageSize: 9999, logic: 'or', filters: [{'key': 'cnname', 'opt': 'LIKE', 'type': 'S', 'value': null}, {'key': 'empuid', 'opt': 'LIKE', 'type': 'S', 'value': null}]})
        .then(res => {
          res.list.map(item => {
            item.cnname  = item.displayname
          })
          this.selectedList = res.list
          this.autoSelected(this.personList, this.selectedList)
        })
    },
    handlerNodeClick (data, node) {
      this.orgid = data.ID
      this.getList()
    },
    handlerNodeChecked (item, isChecked) {
      if (isChecked) {
        this.selectedList.push(item)
      } else {
        this.deleteSelectedItem(item.ID)
      }
    },
    deleteSelectedItem (empuid) {
      console.log(this.selectedList)
      for (let i = 0; i < this.selectedList.length; i++) {
        if (this.selectedList[i].empuid === empuid) {
          this.selectedList.splice(i, 1)
          break
        }
      }
      for (let i = 0; i < this.personList.length; i++) {
        if (this.personList[i].empuid === empuid) {
          this.$refs.personTable.toggleRowSelection(this.personList[i])
          break
        }
      }
    },
    handleSizeChange (item) {
      this.pages.pageSize = item
      this.getList()
    },
    handleCurrentChange (item) {
      this.pages.pageNum = item
      this.getList()
    },
    handleSelectionChange (list) {
      // 先把this.selectedList里面属于本页的数据给删除掉  然后再把选中的column push进this.selectedList里
      for (let i = 0; i < this.personList.length; i++) {
        for (let j = 0; j < this.selectedList.length; j++) {
          if (this.personList[i].empuid === this.selectedList[j].empuid) {
            this.selectedList.splice(j, 1)
            break
          }
        }
      }
      this.selectedList.push(...list)
      this.autoSelected(this.personList, this.selectedList)
    },
    autoSelected (personList, selectedList) {
      let result = []
      for (let i = 0; i < personList.length; i++) {
        for (let j = 0; j < selectedList.length; j++) {
          if (personList[i].empuid === selectedList[j].empuid) {
            result.push(i)
          }
        }
      }
      this.$nextTick(function () {
        result.map(item => {
          this.$refs.personTable.toggleRowSelection(personList[item], true)
        })
      })
    },
    handlerConfirmDialog () {
      if (!this.selectedList || this.selectedList.length === 0) {
        this.$message.error("请选择部门领导审批人！");
        return
      }
      this.$emit('confirm', this.selectedList)
      this.dialogVisible = false
      this.selectedPersonList = []
    }
  }
}
</script>

<style lang="scss" scoped>
.tree_node {
  height: 487px;
}
.selected_list {
  margin-top: 10px;
  &::after {
    content: '';
    display: block;
    clear: both;
  }
  .selected_item {
    float: left;
    padding: 4px 6px;
    background: #67c23a;
    border-radius: 3px;
    margin-right: 5px;
    margin-bottom: 5px;
    .name {
      color: #fff;
      font-size: 12px;
      display: inline-block;
      vertical-align: middle;
    }
    i {
      font-size: 12px;
      color: #fff;
      cursor: pointer;
      display: inline-block;
      vertical-align: middle;
    }
    &:after {
      content: '';
      display: inline-block;
      height: 100%;
      vertical-align: middle;
    }
  }
}
</style>
