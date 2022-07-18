<template>
  <div id="menusManage">
    <el-row>
      <!--左侧组织树-->
      <el-col :span="6" class="padding-l10px padding-r10px pad-t12px">
        <el-input
          placeholder="请输入内容"
          class="search_component"
          v-model="searchMenu"
          clearable
          @keyup.13.native="getMenuList"
        >
          <el-button type="primary" slot="append" @click="getMenuList"> {{$t('search')}}</el-button>
        </el-input>
        <el-scrollbar class="left_tree_wrapper">
          <el-tree
            :highlight-current="true"
            :data="menusTree"
            :props="defaultProps"
            default-expand-all
            :expand-on-click-node="false"
            ref="tree2"
          >
            <div
              class="custom-tree-node"
              slot-scope="{ node, data }"
              @click="nodeClick(node, data)"
            >
              <div class="grow">
                <p :title="node.label">{{ node.label }}</p>
              </div>
              <p class="font14 opertionBtn">
                <el-tooltip class="item" effect="dark" content="添加菜单按钮" placement="top">
                  <i class="el-icon-plus add" @click.stop="dialogMenu('addBtn', node, data)"></i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="添加子菜单" placement="top">
                  <i
                    class="el-icon-circle-plus-outline add"
                    @click.stop="dialogMenu('add', node, data)"
                  ></i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="$t('modify')" placement="top">
                  <i
                    v-if="data.id != '0'"
                    class="el-icon-edit add"
                    @click.stop="dialogMenu('modify', node, data)"
                  ></i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
                  <i
                    v-if="data.id != '0'"
                    class="el-icon-delete add"
                    @click.stop="dialogMenu('delete', node, data)"
                  ></i>
                </el-tooltip>
              </p>
            </div>
          </el-tree>
        </el-scrollbar>
      </el-col>
      <!-- 右侧列表部分-->
      <el-col :span="18" class="padding-l10px padding-r10px pos-relative">
        <p class="selectMenu">菜单:{{selectMenuName}}</p>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="组织" name="organization">
            <el-row>
              <el-col :span="6">
                <el-input
                  placeholder="请输入内容"
                  class="search_component"
                  v-model="searchOrg"
                  clearable
                  @keyup.13.native="getMenuOrgList()"
                >
                  <el-button
                    type="primary"
                    slot="append"
                    @click="pagesOrg.pageNum = 1;getMenuOrgList()"
                  >搜索</el-button>
                </el-input>
              </el-col>
              <el-col :span="6" :offset="12" class="search_buttons_wrap">
                <el-button type="primary" @click="referMenuSelect('organization')">添加人员组织</el-button>
              </el-col>
            </el-row>
            <el-table :data="tableOrgData" class="main_tab">
              <el-table-column :label="$t('number')" width="80px" type="index"></el-table-column>
              <el-table-column prop="name" label="名称"></el-table-column>
              <el-table-column prop="address" width="80px" :label="$t('operation')">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
                    <el-button
                      class="no-border"
                      icon="el-icon-delete"
                      circle
                      @click="deleteMenu(scope.row.id, 'organization')"
                    ></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @current-change="handleCurrentChangeOrg"
              :current-page.sync="pagesOrg.pageNum"
              :page-size="pagesOrg.pageSize"
              background
              layout="prev, pager, next, jumper, total"
              :total="pagesOrg.total"
            ></el-pagination>
          </el-tab-pane>
          <el-tab-pane label="角色" name="role">
            <el-row>
              <el-col :span="6">
                <el-input
                  placeholder="请输入内容"
                  class="search_component"
                  v-model="searchRole"
                  clearable
                  @keyup.13.native="getMenuRoleList()"
                >
                  <el-button
                    type="primary"
                    slot="append"
                    @click="pagesRole.pageNum = 1;getMenuRoleList()"
                  >搜索</el-button>
                </el-input>
              </el-col>
              <el-col :span="6" :offset="12" class="search_buttons_wrap">
                <el-button type="primary" @click="referMenuSelect('role')">添加角色</el-button>
              </el-col>
            </el-row>
            <el-table :data="tableRoleData" class="main_tab">
              <el-table-column :label="$t('number')" width="80px" type="index"></el-table-column>
              <el-table-column prop="name" label="名称"></el-table-column>
              <el-table-column prop="address" width="80px" :label="$t('operation')">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
                    <el-button
                      class="no-border"
                      icon="el-icon-delete"
                      circle
                      @click="deleteMenu(scope.row.id, 'role')"
                    ></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @current-change="handleCurrentChangeRole"
              :current-page.sync="pagesRole.pageNum"
              :page-size="pagesRole.pageSize"
              background
              layout="prev, pager, next, jumper, total"
              :total="pagesRole.total"
            ></el-pagination>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <!--    添加或修改组织树的弹出框-->
    <el-dialog
      :title="menutitle"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form label-width="110px" :rules="rules" :model="menulist" ref="menulistRef">
        <el-form-item label="父级菜单名称" prop="fatherName">
          <el-input clearable :disabled="true" v-model="menulist.fatherName"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input clearable v-model="menulist.name"></el-input>
        </el-form-item>
        <el-form-item label="英文名称" prop="enname">
          <el-input clearable v-model="menulist.enname"></el-input>
        </el-form-item>
        <el-form-item label="链接" prop="custome">
          <el-input clearable v-model="menulist.custome"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input clearable v-model="menulist.sort"></el-input>
        </el-form-item>
        <el-form-item label="是否要嵌入系统" prop="isChecked">
          <el-radio v-model="menulist.isChecked" :label="true">是</el-radio>
          <el-radio v-model="menulist.isChecked" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="系统ip地址" prop="link" v-show="menulist.isChecked">
          <el-input clearable v-model="menulist.link"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="confirmMenu">{{$t("confirm")}}</el-button>
      </span>
    </el-dialog>
    <!--    角色管理弹出框-->
    <select-role
      v-model="selectPersonVisible"
      :roleId="selectMenuId"
      :selected="selectedData"
      @confirm="confirmAdd"
    ></select-role>
    <select-group
      v-model="groupVisible"
      :selected="[]"
      :selectTree="['0', '1', '2', '4']"
      @confirm="confirmAdd"
    ></select-group>
    <!-- 添加菜单按钮 -->
    <add-btn v-model="addBtnDialogVisible" :menuInfo="menuInfo"></add-btn>
  </div>
</template>
<script>
import {
  getMenuList,
  singleMenusInfo,
  saveMenu,
  deleteMenu,
  menuOrg,
  menuRole,
  saveOrgMenu,
  deleteOrgMenu,
  deleteRoleMenu
} from '@/bpa/api/settings/menusManage'

import addBtn from './components/addBtn.vue'

export default {
  data() {
    return {
      // 角色管理部分
      selectPersonVisible: false,
      groupVisible: false,
      selectMenuId: '',
      searchOrg: '',
      searchRole: '',
      tableOrgData: [],
      tableRoleData: [],
      selectedData: [],
      // 右侧tab默认的选中
      activeName: 'organization',
      selectMenuName: '',
      searchMenu: '',
      menutitle: '添加',
      // 添加菜单的模态框的样式
      dialogVisible: false,
      menulist: {
        fatherName: '',
        name: '',
        enname: '',
        link: '',
        custome: '',
        isChecked: false,
        sort: '',
        pid: '',
        id: ''
      },
      pagesOrg: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      pagesRole: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      menusTree: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 弹出框的必填规则
      rules: {
        name: [{ required: true, message: ' ', trigger: 'blur' }],
        enname: [{ required: true, message: ' ', trigger: 'blur' }],
        custome: [{ required: true, message: ' ', trigger: 'blur' }],
        sort: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      // 菜单树的参数
      menuTreeParams: {
        attr: { menuname: '' },
        orderby: '',
        pageNum: 1,
        pageSize: 100000,
        sort: 'desc',
        logic: 'or',
        filters: []
      },
      addBtnDialogVisible: false,
      menuInfo: {}
    }
  },
  mounted() {
    this.getMenuList()
  },
  components: {
    addBtn
  },
  methods: {
    // 获取组织树的数据
    getMenuList() {
      let self = this
      self.menuTreeParams.attr.menuname = self.searchMenu
      getMenuList(self.menuTreeParams).then(res => {
        if (!res) return false
        if (res.length > 0) {
          res[0].id = '0'
        }
        self.menusTree = res
      })
    },
    // 对菜单的操作
    dialogMenu(type, node, data) {
      let self = this
      self.menulist = {
        fatherName: '',
        name: '',
        enname: '',
        link: '',
        custome: '',
        isChecked: false,
        sort: '',
        pid: '',
        id: ''
      }
      switch (true) {
        case type === 'modify':
          self.menutitle = '修改'
          this.dialogVisible = true
          singleMenusInfo(data.id).then(res => {
            if (!res) return false
            self.menulist = {
              fatherName: res.pname,
              name: res.name,
              enname: res.enname,
              custome: res.custom,
              isChecked: res.choosed === 'true',
              link: res.iframe,
              sort: res.sort,
              pid: res.pid,
              id: res.id
            }
          })
          break
        case type === 'add':
          self.menutitle = '添加'
          this.dialogVisible = true
          self.menulist.fatherName = data.name
          self.menulist.pid = data.id
          break
        case type === 'delete':
          console.log(node, data)
          this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
            confirmButtonText: this.$t('confirm'),
            cancelButtonText: this.$t('cancel'),
            type: 'warning'
          })
            .then(() => {
              deleteMenu(data.id, {
                custom: data.custome,
                enname: data.enname,
                id: data.id,
                name: data.name,
                parentname: node.parent.label,
                pid: data.pid,
                pname: node.parent.label,
                sort: data.sort
              }).then(res => {
                if (!res) return false
                self.$message({
                  message: this.$t('hintText.successfullyDelete'),
                  type: 'success'
                })
                self.getMenuList()
              })
            })
            .catch(err => {
              self.$message({
                message: '取消删除!',
                type: 'warning'
              })
            })
          break
        case type === 'addBtn':
          this.menuInfo = data
          this.addBtnDialogVisible = true
          break
      }
    },
    searchMenuList() {
      console.log(1212)
    },
    // 添加菜单的确定
    confirmMenu() {
      let self = this
      this.$refs['menulistRef'].validate(valid => {
        if (valid) {
          if (this.menulist.isChecked && !self.menulist.link) {
            this.$message({
              type: 'warning',
              message: '未填写潜入系统的ip地址!'
            })
            return false
          }
          saveMenu({
            iframe: !self.menulist.isChecked ? '' : self.menulist.link,
            choosed: self.menulist.isChecked ? 'true' : 'false',
            custom: self.menulist.custome,
            enname: self.menulist.enname,
            id: self.menulist.id,
            name: self.menulist.name,
            parentname: self.menulist.fatherName,
            pid: self.menulist.pid,
            pname: self.menulist.fatherName,
            sort: self.menulist.sort,
            status: '1'
          }).then(res => {
            if (!res) return false
            self.$message({
              message: '保存成功!',
              type: 'success'
            })
            self.dialogVisible = false
            self.getMenuList()
          })
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('hintText.theRequiredFieldsMustNotBeEmpty')
          })
        }
      })
    },
    handleClick(tab, event) {
      let self = this
      if (tab.name === 'organization') {
        self.getMenuOrgList()
      } else if (tab.name === 'role') {
        self.getMenuRoleList()
      }
    },
    nodeClick(node, data) {
      let self = this
      self.selectMenuName = data.name
      if (self.activeName === 'organization') {
        self.selectMenuId = data.id
        self.getMenuOrgList()
      } else if (self.activeName === 'role') {
        self.selectMenuId = data.id
        self.getMenuRoleList()
      }
    },
    referMenuSelect(type) {
      if (!this.selectMenuId) {
        this.$message({
          message: '请选择一个流程框架树再进行操作!',
          type: 'warning'
        })
        return false
      }
      if (type === 'organization') {
        this.groupVisible = true
      } else {
        this.selectPersonVisible = true
      }
    },
    confirmAdd(data) {
      let self = this
      if (!data.length) {
        return false
      }
      let ids = data.map((item, index, arr) => {
        return self.activeName === 'organization' ? item.id : item.id
      })
      saveOrgMenu({
        relatedid: ids.join(','),
        relatedType: self.activeName === 'organization' ? 0 : 8,
        resourceid: self.selectMenuId
      }).then(res => {
        self.$message({
          message: '添加成功!',
          type: 'success'
        })
        if (self.activeName === 'organization') {
          self.getMenuOrgList()
        } else {
          self.getMenuRoleList()
        }
      })
    },
    deleteMenu(id, type) {
      let self = this
      if (!self.selectMenuId) {
        self.$message({
          message: '请选择一个流程框架树再进行操作!',
          type: 'waining'
        })
        return false
      }
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
        .then(() => {
          deleteOrgMenu({
            relatedid: id,
            relatedType: type === 'organization' ? 0 : 8,
            resourceid: self.selectMenuId
          }).then(res => {
            self.$message({
              message: this.$t('hintText.successfullyDelete'),
              type: 'success'
            })
            if (type === 'organization') {
              self.getMenuOrgList()
            } else {
              self.getMenuRoleList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    /*
      组织部分的分页
     */
    getMenuOrgList() {
      let self = this
      menuOrg({
        attr: { menuid: self.selectMenuId },
        filters: [
          { key: 'name', opt: 'LIKE', type: 'S', value: self.searchOrg }
        ],
        logic: 'or',
        orderby: 'name',
        pageNum: self.pagesOrg.pageNum,
        pageSize: self.pagesOrg.pageSize,
        sort: 'desc'
      }).then(res => {
        if (!res) return false
        self.tableOrgData = res.list
        self.pagesOrg.total = res.total
      })
    },
    handleCurrentChangeOrg(data) {
      let self = this
      self.pagesOrg.pageNum = data
      self.getMenuOrgList()
    },
    /*
      角色部分
     */
    handleCurrentChangeRole(data) {
      let self = this
      self.pagesRole.pageNum = data
      self.getMenuRoleList()
    },
    getMenuRoleList() {
      let self = this
      menuRole({
        attr: { menuid: self.selectMenuId },
        filters: [
          { key: 'name', opt: 'LIKE', type: 'S', value: self.searchRole }
        ],
        logic: 'or',
        orderby: 'name',
        pageNum: self.pagesRole.pageNum,
        pageSize: self.pagesRole.pageSize,
        sort: 'desc'
      }).then(res => {
        if (!res) return false
        self.tableRoleData = res.list
        self.selectedData = JSON.parse(JSON.stringify(res.list))
        self.pagesRole.total = res.total
      })
    }
  }
}
</script>

<style scoped lang="scss">
#menusManage {
  .custom-tree-node {
    width: calc(100% - 24px);
    position: relative;
    height: 100%;
    line-height: 26px;
    .grow {
      width: 100%;
      padding-right: 80px;
      box-sizing: border-box;
      p {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .opertionBtn {
      opacity: 0;
      position: absolute;
      right: 10px;
      top: 0;
      transition: 0.3s;
    }
  }
  .el-tree-node__content:hover {
    .opertionBtn {
      opacity: 1;
    }
  }
  .selectMenu {
    position: absolute;
    top: 0;
    right: 10px;
    line-height: 40px;
    font-size: 14px;
    letter-spacing: 2px;
  }
}
</style>
