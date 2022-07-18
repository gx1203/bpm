<template>
  <div id="systemList">
    <div style="padding: 15px">
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="内部管理体系"
            class="search_component"
            v-model="keyWords"
            clearable
            @keyup.13.native="singleSearch"
          >
            <el-button type="primary" slot="append" @click="singleSearch"
              >搜索</el-button
            >
          </el-input>
        </el-col>
        <el-col :span="16" class="search_buttons_wrap">
          <el-button type="primary" @click="addDialog">添加</el-button>
          <el-button type="primary" @click="reset">刷新</el-button>
        </el-col>
      </el-row>
      <div class="systemListMain">
        <el-row :gutter="20">
          <el-table :data="booksList" border class="main_tab blue-table">
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="内部管理体系" prop="systemname" />
            <el-table-column label="关联体系" prop="relationName" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="getDetails(scope.row.relationkey, '修改', scope.row)"
                  type="text"
                  >编辑</el-button
                >
                <el-button @click="deleteRow(scope.row.relationkey)" type="text"
                  >删除</el-button
                >
                <el-button
                  @click="showItem(scope.row.relationkey, scope.$index)"
                  type="text"
                  >{{ scope.row.showConnect ? '收起' : '展开' }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pages.pageNum"
        :page-size="pages.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="pages.total"
      ></el-pagination>

      <el-row style="margin-top: 10px" v-if="showConnect">
        <el-table
          :data="sysItemList"
          border
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'left' }"
          class="main_tab blue-table"
        >
          <el-table-column
            align="left"
            :width="item.name === '操作' ? '150px' : ''"
            v-for="(item, index) in headers"
            :key="index"
            :label="item.name"
          >
            <template slot-scope="scope">
              <div v-if="item.name === '操作'">
                <!-- <el-tooltip class="item"
                            effect="dark"
                            content="编辑"
                            placement="top"> -->
                <el-button
                  @click="aboutAll(scope.row, scope.$index, item, index)"
                  class="no-border"
                  v-if="scope.row[1].id"
                  type="text"
                >
                  编辑
                </el-button>
                <!-- </el-tooltip>
                <el-tooltip class="item"
                            effect="dark"
                            content="删除"
                            v-if="scope.row[1].id"
                            placement="top"> -->
                <el-button
                  @click="deleteItemRow(scope.row[0].chapterkey)"
                  class="no-border"
                  v-if="scope.row[1].id"
                  type="text"
                >
                  删除
                  <!-- <i style="font-size: 12px" class="el-icon-delete"></i> -->
                </el-button>
                <!-- </el-tooltip> -->
                <!-- <el-tooltip class="item"
                            effect="dark"
                            v-if="!scope.row[1].id"
                            content="关联"
                            placement="top"> -->
                <el-button
                  @click="aboutAll(scope.row, scope.$index, item, index)"
                  class="no-border"
                  v-if="!scope.row[1].id"
                  type="text"
                >
                  关联
                  <!-- <i style="font-size: 12px" class="el-icon-paperclip"></i> -->
                </el-button>
                <!-- </el-tooltip> -->
              </div>
              <div style="text-align: left" v-else>
                {{ scope.row[index].content ? scope.row[index].content : '' }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
    <!-- 添加体系关联 -->
    <el-dialog
      title="体系关联"
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="form"
        :model="editFormObj"
        label-width="120px"
        :rules="rules"
      >
        <el-row>
          <el-form-item label="内部管理体系:" prop="systemid">
            <el-select
              @change="handleSelect"
              :disabled="!isEdit"
              v-model="editFormObj.systemid"
              placeholder="请选择"
            >
              <el-option
                v-for="item in itList"
                :key="item.id"
                :label="item.datas"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关联体系:" prop="standard">
            <el-button type="primary" @click="selectList">选择体系</el-button>
          </el-form-item>
          <el-table :data="editFormObj.standardDtoList" class="main_tab">
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="体系名称" prop="systemname" />
            <el-table-column label="体系执行标准" prop="standard" />
             <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="deteleAdd(scope.$index)" type="text"
                  >删除</el-button
                >                
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" v-if="isEdit" @click="saveNotice"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 选择体系 -->
    <el-dialog
      title="选择体系"
      :visible.sync="dialogSelectVisible"
      width="50%"
      @opened="handleOpened"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form>
        <el-row>
          <el-table
            border
            ref="multipleTable"
            class="main_tab blue-table"
            :row-key="getRowKeys"
            @selection-change="handleSelectionChange"
            :data="dataList"
          >
            <el-table-column
              type="selection"
              :reserve-selection="true"
              width="55"
            >
            </el-table-column>
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="体系名称" prop="name"> </el-table-column>
            <el-table-column label="体系执行标准" prop="standard">
            </el-table-column>
            <el-table-column label="颁布单位" prop="dept"> </el-table-column>
            <el-table-column label="颁布日期" prop="issue"> </el-table-column>
          </el-table>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSelectVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveNoticeSelect">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 体系条款关联 -->
    <el-dialog
      title="体系条款关联"
      :visible.sync="dialogAboutVisible"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="formabout" :model="editFormAboutObj" label-width="120px">
        <el-row>
          <el-form-item label="内部管理体系:" prop="systemname">
            <el-select
              :disabled="!isEdit"
              v-model="editFormAboutObj.systemname"
              placeholder="请选择"
            >
              <el-option
                v-for="item in itList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关联体系:"> </el-form-item>
          <el-row
            v-for="(item, index) in editFormAboutObj.aboutList"
            :key="index"
            style="margin-bottom: 10px"
          >
            <el-col :span="8" style="min-height: 50px">
              <el-button
                @click.native="openTree(item, index)"
                style="width: 90%"
                type="primary"
              >
                <span
                  :title="item.systemname"
                  style="
                    display: inline-block;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    width: 100%;
                  "
                  >{{ item.systemname }}</span
                ><br /><span
                  style="
                    display: inline-block;
                    margin-top: 5px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                  "
                  :title="item.standard"
                  >{{ item.standard }}</span
                ></el-button
              >
            </el-col>
            <el-col :span="16">
              <el-input
                v-model="item.content"
                @click.native="openTree(item, index)"
                type="textarea"
              />
            </el-col>
          </el-row>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAboutVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAbout">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 体系章节树弹框 -->
    <el-dialog
      title="选择体系条款"
      class="tree_list"
      :visible.sync="dialogTreeVisible"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row :gutter="20" class="group_container">
        <el-col :span="24" class="tree_wrap">
          <!-- <el-scrollbar class="tree_node"> -->
          <el-tree
            :highlight-current="true"
            :data="menusTree"
            node-key="id"
            :props="defaultoutProps"
            :default-checked-keys="grandParentId"
            show-checkbox
            :expand-on-click-node="false"
            :check-strictly="true"
            @check="handleNodeCheck"
            ref="menuTree"
          ></el-tree>
          <!-- </el-scrollbar> -->
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTreeVisible = false">取消</el-button>
        <el-button type="primary" @click="handlerConfirmDialog">确定</el-button>
      </span>
    </el-dialog>
    <select-group
      v-model="isSelectPersonVisible"
      :selectTree="['1', '2']"
      :showTree="'1,2,3,4'"
      :selected="selectedPersonList"
      @confirm="handlerSelectPersonComfirm"
    ></select-group>
  </div>
</template>

<script>
import { getInterList } from '@/bpa/api/systemManagementCenter/fileManagement'
import { getWbSystemListOut } from '@/bpa/api/systemManagementCenter/systemList'
import { getSystemTree } from '@/bpa/api/systemManagementCenter/systemAuditplan'
import {
  systemConnectioon,
  deleteByRelationkey,
  saveSystemConnectioon,
  getByRelationkey,
  getListByRelationkey,
  saveSysList,
  deleteByChapterkey,
} from '@/bpa/api/systemManagementCenter/systemConnection'
import paginations from '@/bpa/mixins/pagination_mixin'
import fileOperation from '@/bpa/mixins/fileDownView'
import { getFormateDate } from '@/bpa/utils/common'
import { createNamespacedHelpers } from 'vuex'
const userInfo = createNamespacedHelpers('userInfo')
export default {
  data() {
    return {
      booksList: [],
      selectedPersonList: [],
      keyWords: '',
      isSelectPersonVisible: false,
      params: {},
      dialogVisible: false,
      isEdit: false,
      searchForm: {
        name: '',
        username: '',
        content: '',
        createon: '',
      },
      editFormObj: {
        standardDtoList: [],
        systemid: ''
      },
      pages: {
        pageSize: 8,
        pageNum: 1,
        total: 100,
      },
      rules: {
        name: [{ required: true, message: ' ', trigger: 'blur' }],
        departmentname: [{ required: true, message: ' ', trigger: 'blur' }],
        content: [{ required: true, message: ' ', trigger: 'blur' }],
        systemid: [{ required: true, message: ' ', trigger: 'change' }],
        standard: [{ required: true, message: ' ', trigger: 'blur' }],
      },
      textMaxLength: 50, // 文本框最大字数限制
      areaMaxLength: 1000, // 文本框最大字数限制
      // 体系分类
      sysLists: [],
      reason: '',
      nameList: [],
      itList: [],
      itSetList: ['一级文件', '二级文件', '三级文件'],
      itList1: [],
      expandedList: [],
      userList: [],
      dialogSelectVisible: false,
      multipleSelection: [],
      dataList: [],
      editoutFormObj: {},
      allSysList: [],
      sysItemList: [],
      headers: [],
      showConnect: false,
      editFormAboutObj: {},
      dialogAboutVisible: false,
      menusTree: [],
      defaultoutProps: {
        children: 'sectionChildrens',
        label: 'content',
      },
      grandParentId: [],
      dialogTreeVisible: false,
      grandParentName: [],
      indexInfo: '',
      showData: '',
    }
  },
  mixins: [paginations, fileOperation],
  computed: {
    host() {
      return process.env.HOST_URL + process.env.BASE_URL
    },
    username() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .cnname
    },
    userid() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .empuid
    },
    action() {
      return `${this.host}/attach/upload2?username=${this.userid}`
    },
    ...userInfo.mapGetters(['getUserAuthor']),
    download() {
      return this.host + '/attach/download/'
    },
  },
  mounted() {
    this.getList()
    this.getInterList()
  },
  methods: {
    //删除添加的体系文件
    deteleAdd(index) {
      this.editFormObj.standardDtoList.splice(index, 1);
    },
    addDialog() {
      this.dialogVisible = true
      this.isEdit = true
      this.allSysList = []
      this.editFormObj = {
        standardDtoList: [],
      }
      this.getwbSystemList()
    },
    // 获取当前时间
    getdate() {
      var now = new Date()
      var y = now.getFullYear()
      var m = now.getMonth() + 1
      var d = now.getDate()
      var h = now.getHours()
      var mm = now.getMinutes()
      var ff = now.getSeconds()
      return (
        y +
        '-' +
        (m < 10 ? '0' + m : m) +
        '-' +
        (d < 10 ? '0' + d : d) +
        ' ' +
        (h < 10 ? '0' + h : h) +
        ':' +
        (mm < 10 ? '0' + mm : mm) +
        ':' +
        (ff < 10 ? '0' + ff : ff)
      )
    },
    singleSearch() {
      this.pages.pageNum = 1
      this.params = {
        filters: [
          { key: 'systemname', opt: 'LIKE', type: 'S', value: this.keyWords },
        ],
        logic: 'or',
      }
      this.getList()
    },
    handlerSelectPersonComfirm(list) {
      this.$set(
        this.editFormObj,
        'deptname',
        list
          .map((item) => {
            return item.name
          })
          .toString()
      )
      this.$set(
        this.editFormObj,
        'deptid',
        list
          .map((item) => {
            return item.id
          })
          .join(',')
      )
    },
    reset() {
      this.pages.pageNum = 1
      this.keyWords = ''
      this.params = {}
      this.getList()
    },
    getList() {
      let obj = {
        ...this.params,
        ...this.pages,
      }
      systemConnectioon(obj).then((res) => {
        if (!res) return false
        this.booksList = res.list.map((item) => {
          item.showConnect = false
          return item
        })
        this.showConnect = false
        this.pages.total = res.total
      })
    },
    // 确认添加
    saveNotice() {
      // this.$refs['form'].validate((valid) => {
      //   if (valid) {
        console.log(this.editFormObj.systemid)
        if(this.editFormObj.systemid === undefined){
          this.$message.error('请选择内部管理体系')
          return false
        }
          if (this.editFormObj.standardDtoList.length === 0) {
            this.$message.error('请选择关联体系')
            return false
          }
      //   }
      // })
            if (this.allSysList && this.allSysList.length > 0) {
            for (let i = 0; i < this.allSysList.length; i++) {
              if (this.allSysList[i].type === 'N') {
                this.allSysList[i].systemname = this.editFormObj.systemname
                this.allSysList[i].systemid = this.editFormObj.systemid
                this.allSysList[i].version = this.editFormObj.version
                this.allSysList[i].sort = 0
                this.editFormObj.standardDtoList.push(this.allSysList[i])
              }
            }
            for (let i = 0; i < this.editFormObj.standardDtoList.length; i++) {
              if (this.editFormObj.standardDtoList[i].type === 'W') {
                this.editFormObj.standardDtoList[i].sort = i + 1
              }
            }
            saveSystemConnectioon(this.editFormObj.standardDtoList).then(
              (rt) => {
                this.$message.success('保存成功')
                this.getList()
                this.dialogVisible = false
              }
            )
          } else {
            this.editFormObj.standardDtoList.push({
              systemname: this.editFormObj.systemname,
              systemid: this.editFormObj.systemid,
              version: this.editFormObj.version,
              type: this.editFormObj.type,
            })
            for (let i = 0; i < this.editFormObj.standardDtoList.length; i++) {
              if (this.editFormObj.standardDtoList[i].type === 'W') {
                this.editFormObj.standardDtoList[i].sort = i + 1
              } else if (this.editFormObj.standardDtoList[i].type === 'N') {
                this.editFormObj.standardDtoList[i].sort = 0
              }
            }
            saveSystemConnectioon(this.editFormObj.standardDtoList).then(
              (rt) => {
                this.$message.success('保存成功')
                this.getList()
                this.dialogVisible = false
              }
            )
          }
    },
    // 删除表格某一行数据
    deleteRow(id) {
      this.$confirm('确认要删除该条信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteByRelationkey(id).then((res) => {
            this.$message({
              type: 'success',
              message: '删除成功！',
            })
            this.getList()
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getDetails(id) {
      this.allSysList = []
      this.editFormObj = {
        standardDtoList: [],
      }
      getByRelationkey(id).then((res) => {
        if (!res) return false
        this.allSysList = res
        this.isEdit = true
        for (let i = 0; i < this.allSysList.length; i++) {
          if (this.allSysList[i].type === 'N') {
            this.editFormObj.systemid = this.allSysList[i].systemid
            this.editFormObj.systemname = this.allSysList[i].systemname
            this.editFormObj.type = this.allSysList[i].type
            this.editFormObj.version = this.allSysList[i].version
            this.editFormObj.id = this.allSysList[i].id
          } else {
            this.editFormObj.standardDtoList.push(this.allSysList[i])
          }
        }
        this.getwbSystemList()
        this.dialogVisible = true
        this.editFormObj = Object.assign({}, this.editFormObj)
      })
    },
    getInterList() {
      getInterList({
        pageSize: 9999,
        pageNum: 1,
        total: 100,
      }).then((res) => {
        this.itList = res.list
      })
    },
    handleSelect() {
      let data = this.itList.find((i) => i.id === this.editFormObj.systemid)
      this.editFormObj.systemname = data.name
      this.editFormObj.datas = data.datas
      this.editFormObj.version = data.versions
      this.editFormObj.type = 'N'
    },
    getRowKeys(row) {
      return row.id
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getwbSystemList() {
      getWbSystemListOut({
        pageNum: 1,
        pageSize: 9999,
      }).then((res) => {
        if (!res) return false
        this.dataList = res.list.map((item) => {
          if (item.issue) {
            item.issue = !item.issue
              ? ''
              : getFormateDate(new Date(item.issue), 'yyyy-MM-dd hh:mm:ss')
          }
          return item
        })
      })
    },
    selectList() {
      this.dialogSelectVisible = true
    },
    handleOpened() {
      this.multipleSelection = []
      for (let a = 0; a < this.editFormObj.standardDtoList.length; a++) {
        if (this.editFormObj.standardDtoList[a].systemid) {
          let nameList = {
            name: this.editFormObj.standardDtoList[a].systemname,
            standard: this.editFormObj.standardDtoList[a].standard,
            id: this.editFormObj.standardDtoList[a].systemid,
          }
          this.multipleSelection.push(nameList)
          for (let i = 0; i < this.dataList.length; i++) {
            if (
              this.editFormObj.standardDtoList[a].systemid ===
              this.dataList[i].id
            ) {
              this.$refs.multipleTable.toggleRowSelection(
                this.dataList[i],
                true
              )
            }
          }
        }
      }
    },
    saveNoticeSelect() {
          if (
            this.editFormObj.standardDtoList &&
            this.editFormObj.standardDtoList.length > 0
          ) {
            let data = this.editFormObj.standardDtoList.map((b) => b.systemid)
            let data1 = this.multipleSelection.map((b) => b.id)
            let _list = JSON.parse(
              JSON.stringify(this.editFormObj.standardDtoList)
            )
            for (let i = 0; i < _list.length; i++) {
              if (!data1.includes(_list[i].systemid)) {
                this.editFormObj.standardDtoList.splice(i, 1)
              }
            }
            for (let i = 0; i < this.multipleSelection.length; i++) {
              if (!data.includes(this.multipleSelection[i].id)) {
                this.editFormObj.standardDtoList.push({
                  systemname: this.multipleSelection[i].name,
                  standard: this.multipleSelection[i].standard
                    ? this.multipleSelection[i].standard
                    : '',
                  systemid: this.multipleSelection[i].id,
                  type: 'W',
                })
              }
            }
          } else {
            for (let i = 0; i < this.multipleSelection.length; i++) {
              this.editFormObj.standardDtoList.push({
                systemname: this.multipleSelection[i].name,
                standard: this.multipleSelection[i].standard,
                systemid: this.multipleSelection[i].id,
                type: 'W',
              })
            }
          }
          this.$refs.multipleTable.clearSelection()
          this.dialogSelectVisible = false
    },
    showItem(data, index) {
      this.booksList[index].showConnect = !this.booksList[index].showConnect
      this.showConnect = this.booksList[index].showConnect
      this.showData = data
      if (this.showConnect) {
        getListByRelationkey(data).then((rt) => {
          this.headers = []
          this.sysItemList = []
          for (let i = 0; i < rt.length; i++) {
            if (rt[i][0].isParent !== 'Y') {
              this.sysItemList.push(rt[i])
            }
            for (let a = 0; a < rt[i].length; a++) {
              if (rt[i][a].isParent === 'Y') {
                this.headers.push({
                  id: rt[i][a].systemid,
                  name: rt[i][a].systemname,
                  key: 'content',
                  standard: rt[i][a].standard,
                  sort: rt[i][a].sort,
                })
              }
            }
          }
          this.headers.push({
            id: '',
            key: '',
            name: '操作',
            standard: '',
            sort: '',
          })
          this.showConnect = true
        })
      }
    },
    aboutAll(item, index, itemall, indexall) {
      this.editFormAboutObj.aboutList = []
      this.editFormAboutObj.systemname0 = this.headers[0].name
      this.editFormAboutObj.chapterid0 = item[0].chapterid
      this.editFormAboutObj.chapterkey0 = item[0].chapterkey
      this.editFormAboutObj.id0 = item[0].id
      this.editFormAboutObj.isParent0 = item[0].isParent
      this.editFormAboutObj.relationkey0 = item[0].relationkey
      this.editFormAboutObj.sort0 = item[0].sort
      this.editFormAboutObj.standard0 = this.headers[0].standard
      this.editFormAboutObj.systemid0 = this.headers[0].id
      this.editFormAboutObj.systemname = item[0].content
      this.editFormAboutObj.type0 = item[0].type
      for (let i = 0; i < this.headers.length; i++) {
        if (i > 0 && this.headers[i].name !== '操作') {
          item[i].systemname = this.headers[i].name
          item[i].standard = this.headers[i].standard
          item[i].systemid = this.headers[i].id
          item[i].type = 'W'
          item[i].sort = this.headers[i].sort
          this.editFormAboutObj.aboutList.push(item[i])
        }
      }
      this.dialogAboutVisible = true
    },
    openTree(item, index) {
      this.indexInfo = index
      getSystemTree(item.systemid).then((res) => {
        if (res) {
          this.menusTree = [res]
          this.grandParentId = [item.chapterid]
          this.grandParentContent = [
            {
              id: item.chapterid,
              content: item.content,
            },
          ]
          this.dialogTreeVisible = true
        } else {
          this.$message.error('还未上传文件，请上传后再关联')
        }
      })
    },
    handleNodeCheck(
      checkedNodes,
      checkedKeys,
      halfCheckedNodes,
      halfCheckedKeys
    ) {
      this.grandParentId = checkedKeys.checkedKeys
      this.grandParentName = checkedKeys.checkedNodes
    },
    handlerConfirmDialog() {
      if (this.grandParentId && this.grandParentId.length === 1) {
        this.editFormAboutObj.aboutList[this.indexInfo].chapterid =
          this.grandParentId[0]
        this.editFormAboutObj.aboutList[this.indexInfo].content =
          this.grandParentName[0].content
        this.dialogTreeVisible = false
      } else {
        this.$message.error('请选择一条体系条款！！')
      }
    },
    saveAbout() {
      let _list = [
        {
          systemname: this.editFormAboutObj.systemname0,
          chapterid: this.editFormAboutObj.chapterid0,
          chapterkey: this.editFormAboutObj.chapterkey0,
          id: this.editFormAboutObj.id0,
          isParent: this.editFormAboutObj.isParent0,
          relationkey: this.editFormAboutObj.relationkey0,
          sort: this.editFormAboutObj.sort0,
          standard: this.editFormAboutObj.standard0,
          systemid: this.editFormAboutObj.systemid0,
          type: this.editFormAboutObj.type0,
          content: this.editFormAboutObj.systemname,
        },
      ]
      for (let i = 0; i < this.editFormAboutObj.aboutList.length; i++) {
        _list.push(this.editFormAboutObj.aboutList[i])
      }
      saveSysList(_list).then((rt) => {
        this.$message.success('关联成功')
        getListByRelationkey(this.showData).then((rt) => {
          this.headers = []
          this.sysItemList = []
          for (let i = 0; i < rt.length; i++) {
            if (rt[i][0].isParent !== 'Y') {
              this.sysItemList.push(rt[i])
            }
            for (let a = 0; a < rt[i].length; a++) {
              if (rt[i][a].isParent === 'Y') {
                this.headers.push({
                  id: rt[i][a].systemid,
                  name: rt[i][a].systemname,
                  key: 'content',
                  standard: rt[i][a].standard,
                  sort: rt[i][a].sort,
                })
              }
            }
          }
          this.headers.push({
            id: '',
            key: '',
            name: '操作',
            standard: '',
            sort: '',
          })
          this.showConnect = true
        })
        this.dialogAboutVisible = false
      })
    },
    deleteItemRow(id) {
      this.$confirm('确认要解除关联吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteByChapterkey(id).then((res) => {
            this.$message({
              type: 'success',
              message: '解除关联成功！',
            })
            getListByRelationkey(this.showData).then((rt) => {
              this.headers = []
              this.sysItemList = []
              for (let i = 0; i < rt.length; i++) {
                if (rt[i][0].isParent !== 'Y') {
                  this.sysItemList.push(rt[i])
                }
                for (let a = 0; a < rt[i].length; a++) {
                  if (rt[i][a].isParent === 'Y') {
                    this.headers.push({
                      id: rt[i][a].systemid,
                      name: rt[i][a].systemname,
                      key: 'content',
                      standard: rt[i][a].standard,
                      sort: rt[i][a].sort,
                    })
                  }
                }
              }
              this.headers.push({
                id: '',
                key: '',
                name: '操作',
                standard: '',
                sort: '',
              })
              this.showConnect = true
            })
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .el-tree-node > .el-tree-node__children {
  overflow: visible;
}
.custom-tree-node {
  height: 100%;
  position: relative;
  .opertionBtn {
    position: absolute;
    right: 10px;
    top: 0;
    bottom: 0;
    min-width: 50px;
    display: flex;
    display: none;
    justify-content: space-between;
    align-items: center;
    i {
      display: inline-block;
      height: 14px;
      padding: 0;
      margin: 0;
      &:hover {
        background: none;
        font-weight: bold;
      }
    }
  }
  &:hover {
    .opertionBtn {
      display: flex;
    }
  }
}
.custom-tree-node {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  .grow {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 70px;
  }
  .add {
    color: $tc5;
    padding: 5px;
    display: none;
    &:hover {
      background: $dc1;
    }
  }
  .del {
    color: $tc4;
    padding: 5px;
    display: none;
    &:hover {
      background: $dc1;
    }
  }
  &:hover {
    .add {
      display: inherit;
    }
    .del {
      display: inherit;
    }
  }
}
#systemList {
  .systemListMain {
    &Info {
      height: 250px;
      display: flex;
      align-items: center;
      & > div {
        flex: auto;
      }
    }
    &Crad {
      padding: 10px;
      height: 300px;
      border: 3px solid $bc5;
      position: relative;
      top: 0;
      .status {
        position: absolute;
        background-color: #fa6f03;
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        top: -15px;
        left: -20px;
        font-weight: bold;
      }
      h2 {
        font-size: 16px;
      }
      &Top {
        display: flex;
        border-bottom: 1px solid $bc5;
        div {
          flex: 1;
          padding: 10px;
        }
        div:last-child {
          border-left: 1px solid $bc5;
        }
        .info {
          display: flex;
          flex-direction: column;
          flex-flow: column-reverse;
          p,
          h3 {
            width: 100%;
          }
        }
      }
      .info {
        height: 80px;
        h3 {
          line-height: 30px;
        }
        p {
          color: $bc5;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          line-clamp: 3;
          -webkit-box-orient: vertical;
        }
      }
      &Bottom {
        display: flex;
        div {
          flex: 1;
          padding: 10px;
        }
        div:last-child {
          border-left: 1px solid $bc5;
        }
      }
    }
  }
}
</style>
