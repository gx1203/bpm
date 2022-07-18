<template>
  <div id="processGroupManage">
    <el-row class="margin-b10">
      <el-col :span="6">
        <!-- <el-input clearable placeholder="请输入内容" class="search_component" v-model="input3" clearable>
          <el-button type="primary" icon="iconfont_search icon-sousuo2" slot="append"></el-button>
        </el-input> -->
        <h1 class="tabTitle">审批角色</h1>
      </el-col>
      <el-col :span="6" :offset="12" class="search_buttons_wrap">
        <el-button type="primary" @click="newRow">添加人员</el-button>
        <el-button type="primary" @click="mutipleDelete">批量删除</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="chooselist"
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
        label="业务负责人">
      </el-table-column>
      <el-table-column
        label="负责部门">
        <template slot-scope="scope">
          <span class="blue_bg" v-for="item in scope.row.depts" :key="item.id">{{item.value}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        :label="$t('operation')">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="$t('modify')" placement="top">
            <el-button class="no-border" @click="editRow(scope.row, scope.$index)" icon="el-icon-edit" circle></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
            <el-button class="no-border" icon="el-icon-delete" circle @click="deleteRow(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pages.pageNum"
      :page-sizes="[10, 15, 20]"
      :page-size="pages.pageSize"
      background
      layout="prev, pager, next, jumper, total"
      :total="pages.total">
    </el-pagination> -->
    <el-dialog
      title="修改"
      :visible.sync="dialogVisible"
      width="40%"
      :close-on-click-modal = false
      :close-on-press-escape = false>
      <el-form label-width="120px" ref="addGroupForm">
        <el-form-item label="业务负责人" prop="name">
          <el-input clearable v-model="formObj.name" @focus="isSelectPersonVisible=true" placeholder="请选择用户"></el-input>
        </el-form-item>
        <el-form-item label="负责部门" prop="dept">
          <el-input clearable v-model="formObj.dept" @focus="isSelectGroupVisible=true" placeholder="请选择部门"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="handlerDialogConfirm">{{$t("confirm")}}</el-button>
      </span>
    </el-dialog>
    <select-person2 v-model="isSelectPersonVisible" :selected="selectedPersonList" @confirm="handlerpersonConfirm"></select-person2>
    <select-group v-model="isSelectGroupVisible" :selected="selectedGroupList" :selectTree="['0', '2', '4']" :showTree="'1,2,4'" @confirm="handlerGroupConfirm"></select-group>
  </div>
</template>

<script>
import { getGroupList, deleteGroup, addGroup } from '@/bpa/api/settings/processGroupManage'
// import paginations from '@/bpa/mixins/pagination_mixin'
export default {
  data () {
    return {
      chooselist: [],
      isSelectPersonVisible: false,
      isSelectGroupVisible: false,
      dialogVisible: false,
      input3: '',
      selectionList: [],
      formObj: {
        name: '',
        dept: ''
      },
      operateType: '',
      selectedPersonList: [],
      selectedGroupList: []
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      getGroupList().then(res => {
        this.chooselist = res.chooselist
      })
    },
    addGroup (data) {
      addGroup(data).then(res => {
        this.$message({
          type: 'success',
          message: `${this.operateType === 'new' ? '添加' : '修改'}成功！`
        })
        this.dialogVisible = false
        this.getList()
      })
    },
    handlerpersonConfirm (list) {
      this.selectedPersonList = list
      this.formObj.name = list[0].cnname
    },
    handlerGroupConfirm (list) {
      this.selectedGroupList = list
      console.log(this.selectedGroupList)
      let result = ''
      for (let i = 0; i < list.length; i++) {
        result += (list[i].NAME + ',')
      }
      result = result.slice(0, -1)
      this.formObj.dept = result
    },
    handlerDialogConfirm () {
      if (this.selectedPersonList.length === 0 || this.selectedGroupList.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择用户或部门！'
        })
        return
      }
      let resultObj = {}
      if (this.operateType === 'new') {
        resultObj = this.selectedPersonList[0]
        resultObj.depts = this.selectedGroupList.map(item => {
          return {
            empuid: '',
            id: item.ID,
            relid: '',
            sort: null,
            type: item.TYPE,
            userid: '',
            value: item.NAME
          }
        })
        this.chooselist.push(resultObj)
      } else {
        resultObj = this.chooselist[this.operateIndex]
        for (let i in this.selectedPersonList[0]) {
          for (let j in resultObj) {
            if (i === j) {
              resultObj[i] = this.selectedPersonList[0][j]
            }
          }
        }
        resultObj.depts = this.selectedGroupList.map(item => {
          return {
            empuid: '',
            id: item.ID,
            relid: '',
            sort: null,
            type: item.TYPE,
            userid: '',
            value: item.NAME
          }
        })
      }
      this.$set(this.chooselist, this.operateIndex, resultObj)
      this.addGroup({
        chooselist: this.chooselist,
        enname: 'oragizer'
      })
      this.selectedPersonList = []
      this.selectedGroupList = []
    },
    handleSelectionChange (list) {
      this.selectionList = list
    },
    mutipleDelete () {
      if (this.selectionList.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择删除项！'
        })
        return
      }
      let idlist = this.selectionList.map(item => {
        return item.id
      })
      this.deleteRow(idlist.toString())
    },
    newRow () {
      this.operateType = 'new'
      this.dialogVisible = true
      this.formObj = {}
      this.selectedPersonList = []
      this.selectedGroupList = []
    },
    editRow (row, index) {
      this.operateType = 'edit'
      this.operateIndex = index
      this.dialogVisible = true
      this.formObj.name = row.cnname
      let result = ''
      for (let i = 0; i < row.depts.length; i++) {
        result += (row.depts[i].value + ',')
      }
      result = result.slice(0, -1)
      this.formObj.dept = result
      this.selectedPersonList = [row]
      console.log(row)
      this.selectedGroupList = row.depts.map(item => {
        return {
          ID: item.id,
          TYPE: item.type,
          NAME: item.value
        }
      })
    },
    deleteRow (id) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        confirmBtnText: '确定',
        cancelBtnText: '取消'
      }).then(res => {
        deleteGroup(id).then(res => {
          this.$message({
            type: 'success',
            message: this.$t('hintText.successfullyDelete')
          })
          this.getList()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#processGroupManage {
  .tabTitle{
    font-size: 18px;
    color: #303133;
  }
}

.blue_bg {
  display: inline-block;
  margin: 2px;
  line-height: 14px;
  font-size: 12px;
  padding: 5px 10px;
  background: #4ba2ef;
  color: #fff;
  border-radius: 4px;
}
</style>
