<template>
  <div id="systemRoleManage">
    <el-row>
      <el-col :span="6">
        <el-input
          placeholder="请输入内容"
          class="search_component"
          v-model="input3"
          clearable
          @keyup.13.native="getList"
        >
          <el-button type="primary"  slot="append" @click="getList"> {{$t('search')}}</el-button>
        </el-input>
      </el-col>
      <el-button
        type="primary"
        size="small"
        class="float-r margin-r10"
        @click="openaddRoledialog('addRoleForm')"
      >添加</el-button>
    </el-row>
    <el-table :data="roleList" class="main_tab">
      <el-table-column :label="$t('number')" type="index" width="50px"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="description" :label="$t('description')" width="300px"></el-table-column>
      <el-table-column prop="createon" label="添加时间" width="150px"></el-table-column>
      <el-table-column prop="address" :label="$t('operation')" width="150px">
        <template slot-scope="scope">
          <!-- <el-tooltip
            class="item"
            effect="dark"
            content="流程框架权限管理"
            placement="top"
          >
            <el-button class="no-border" @click="frameworkPermissions(scope.row)" icon="el-icon-s-tools" circle></el-button>
          </el-tooltip>-->
          <el-tooltip class="item" effect="dark" content="菜单权限管理" placement="top">
            <el-button
              class="no-border"
              @click="authorityMage(scope.row)"
              icon="el-icon-key"
              circle
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('modify')"
            placement="top"
            v-if="scope.row.showButton"
          >
            <el-button class="no-border" @click="editRole(scope.row.id)" icon="el-icon-edit" circle></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="选择员工"
            placement="top"
            v-if="scope.row.id != '945522'"
          >
            <el-button
              class="no-border"
              @click="handlerSelectPerson(scope.row.id)"
              icon="el-icon-user-solid"
              circle
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('delete')"
            placement="top"
            v-if="scope.row.showButton"
          >
            <el-button
              class="no-border"
              @click="deleteRole(scope.row.id)"
              icon="el-icon-delete"
              circle
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pages.pageNum"
      :page-size="pages.pageSize"
      background
      layout="prev, pager, next, jumper, total"
      :total="pages.total"
    ></el-pagination>
    <!-- 修改角色的弹框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="dialogVisible "
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form label-width="80px" :model="addRoleForm" :rules="rules" ref="addRoleForm">
        <el-form-item label="名称" prop="name">
          <el-input clearable v-model="roleInfo.name" maxlength="50" autofocus="true"></el-input>
        </el-form-item>
        <el-form-item :label="$t('description')" class="label-height-auto" prop="description">
          <el-input clearable
            type="textarea"
            resize="none"
            rows="5"
            v-model="roleInfo.description"
            maxlength="500"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible  = false">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="handlerSaveRole">{{$t("confirm")}}</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色的弹框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoledialog "
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form label-width="80px" :model="addRoleForm" :rules="rules" ref="addRoleForm">
        <el-form-item label="名称" prop="name">
          <el-input clearable v-model="addRoleForm.name" maxlength="50" autofocus="true"></el-input>
        </el-form-item>
        <el-form-item :label="$t('description')" class="label-height-auto" prop="description">
          <el-input clearable
            type="textarea"
            resize="none"
            rows="5"
            v-model="addRoleForm.description"
            maxlength="500"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('addRoleForm')">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="addRole">{{$t("confirm")}}</el-button>
      </span>
    </el-dialog>
    <show-roles v-model="selectPersonVisible" :rowId="operateId"></show-roles>
    <!-- 权限管理 -->
    <authority-role v-model="authoroleVisible" :selectInfo="selectInfo" type="role"></authority-role>
    <!-- 流程框架权限管理 -->
    <framework-manage v-model="frameworkManageVisible" type="role"></framework-manage>
  </div>
</template>

<script>
import {
  getRoleList,
  editRole,
  deleteRole,
  saveRole
} from '@/bpa/api/settings/systemRoleManage'
import { getFormateDate } from '@/bpa/utils/common.js'
import paginations from '@/bpa/mixins/pagination_mixin'
import showRoles from './components/showRoles.vue'
import authorityRole from '@/bpa/components/authorityRole.vue'
import frameworkManage from '@/bpa/components/frameworkManage.vue'
export default {
  components: {
    showRoles,
    authorityRole,
    frameworkManage
  },
  data() {
    return {
      roleList: [],
      dialogVisible: false,
      selectPersonVisible: false,
      authoroleVisible: false,
      frameworkManageVisible: false,
      selectInfo: {},
      input3: '',
      roleInfo: {
        name: '',
        description: ''
      },
      operateId: '',
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      // remnant1: 0, // 文本框输入字数
      // remnant2: 0, // 文本域输入字数
      areaMaxLength: 1000, // 文本域最大字数限制
      textMaxLength: 50, // 文本框最大字数限制
      showButton: true,
      rules: {
        name: [{ required: true, message: '  ', trigger: 'blur' }],
        description: [{ required: true, message: '  ', trigger: 'blur' }]
      },
      // 添加角色的弹框
      addRoledialog: false,
      addRoleForm: {
        name: '',
        description: ''
      }
    }
  },
  mixins: [paginations],
  mounted() {
    this.getList()
  },
  methods: {
    authorityMage(item) {
      console.log(item)
      this.selectInfo = JSON.parse(JSON.stringify(item))
      this.authoroleVisible = true
    },
    frameworkPermissions(item) {
      console.log(item)
      this.frameworkManageVisible = true
    },
    getList() {
      getRoleList({
        attr: {},
        filters: [
          { key: 'name', opt: 'LIKE', type: 'S', value: this.input3 },
          { key: 'type', opt: 'LIKE', type: 'S', value: null },
          { key: 'createon', opt: 'GE', type: 'D', value: null },
          { key: 'createon', opt: 'LE', type: 'D', value: null }
        ],
        logic: 'or',
        orderby: 'createon',
        pageNum: this.pages.pageNum || 1,
        pageSize: this.pages.pageSize,
        sort: 'desc'
      }).then(res => {
        console.log(res)
        res.list = res.list.map(item => {
          if (item.id === '945522' || item.id === '637476') {
            item.showButton = false
          } else {
            item.showButton = true
          }
          return item
        })
        let roleList = res.list
        roleList.map(item => {
          item.createon = item.createon
            ? getFormateDate(item.createon, 'yyyy-MM-dd hh:mm')
            : ''
        })
        this.roleList = roleList
        this.pages.total = res.total
      })
    },
    // 打开添加角色弹框
    openaddRoledialog(addRoleForm) {
      if (this.$refs[addRoleForm] !== undefined) {
        this.$nextTick(() => {
          this.$refs[addRoleForm].resetFields()
        })
      }
      this.addRoleForm.name = ''
      this.addRoleForm.description = ''
      this.addRoledialog = true
    },
    editRole(id) {
      editRole(id).then(res => {
        this.roleInfo = res
        this.dialogVisible = true
      })
    },
    // 修改角色功能
    handlerSaveRole() {
      if (this.roleInfo.description.length > this.areaMaxLength) {
        this.dialogVisible = true
        this.$message({
          message: '警告哦，描述不能超过1000字符哦',
          type: 'error'
        })
      } else if (this.roleInfo.name.length > this.textMaxLength) {
        this.dialogVisible = true
        this.$message({
          message: '警告哦，名称不能超过50字符哦',
          type: 'error'
        })
      } else {
        saveRole(this.roleInfo).then(res => {
          console.log(res)
          if (!res) return
          this.dialogVisible = false
          this.getList()
          this.$message({
            type: 'success',
            message: '修改角色成功！'
          })
        })
      }
      this.dialogVisible = false
      this.getList()
    },
    handlerSelectPerson(id) {
      this.operateId = id
      this.selectPersonVisible = true
    },
    handlerPersonComfirm(list) {
      console.log(list)
    },
    // 删除功能
    deleteRole(id) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), '警告', {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
        .then(() => {
          // 发送请求
          deleteRole({
            id: id
          }).then(res => {
            this.$message({
              type: 'success',
              message: this.$t('hintText.successfullyDelete')
            })
            this.getList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 添加功能
    addRole() {
      this.$refs['addRoleForm'].validate(valid => {
        if (valid) {
          if (this.addRoleForm.name.length > this.textMaxLength) {
            this.$message({
              message: this.$t('hintText.termNameWarning'),
              type: 'error'
            })
            return false
          } else if (this.addRoleForm.description.length > this.areaMaxLength) {
            this.$message({
              message: '警告哦，术语解释不能超过1000字符哦',
              type: 'error'
            })
            return false
          }
          saveRole({
            name: this.addRoleForm.name,
            description: this.addRoleForm.description
          }).then(res => {
            if (!res) return false
            // console.log(res)
            this.getList()
            this.addRoledialog = false
            this.addRoleForm.name = ''
            this.addRoleForm.description = ''
          })
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('hintText.theRequiredFieldsMustNotBeEmpty')
          })
        }
      })
    },
    // guanbi 关闭添加角色弹框
    closeAddRole() {
      this.addRoleForm.name = ''
      this.addRoleForm.description = ''
      this.addRoledialog = false
    },
    resetForm(addRoleForm) {
      this.$nextTick(() => {
        this.$refs[addRoleForm].resetFields()
      })
      this.addRoledialog = false
    }
  }
}
</script>
