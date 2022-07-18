<template>
  <div id="userManage">
    <el-row>
      <el-col :span="6">
        <el-input
          placeholder="请输入内容"
          class="search_component"
          v-model="keyWords"
          clearable
          @keyup.13.native="singleSearch"
        >
          <el-button type="primary"  slot="append" @click="singleSearch"> {{$t('search')}}</el-button>
        </el-input>
      </el-col>
      <el-col :span="18">
        <el-button class="float-r margin-l10" type="primary" @click="resePassord">重置密码</el-button>
        <el-button class="float-r" type="primary" @click="addUsers('add')">添加</el-button>
      </el-col>
    </el-row>
    <el-table :data="userList" @sort-change="sortMethod" class="main_tab">
      <el-table-column :label="$t('number')" type="index"></el-table-column>
      <el-table-column prop="cnname" sortable label="姓名"></el-table-column>
      <el-table-column prop="empuid" sortable label="账号"></el-table-column>
      <el-table-column prop="email" label="邮箱">
        <template slot-scope="scope">{{scope.row.attr.mail}}</template>
      </el-table-column>
      <el-table-column prop="defaultposname" label="岗位"></el-table-column>
      <el-table-column width="80" :label="$t('operation')">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="$t('modify')" placement="top">
            <el-button
              icon="el-icon-edit-outline font16"
              @click="addUsers('modify', scope.row)"
              type="text"
            ></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" :content="$t('delete')" placement="top">
            <el-button icon="el-icon-delete font16" @click="deleteRow(scope.row)" type="text"></el-button>
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
    <!-- 修改密码 -->
    <el-dialog
      title="重置密码"
      :visible.sync="resetDialogFormVisible"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="resepassword" :rules="resetRules" ref="resetRef" label-width="100px">
        <el-form-item label="账号 :" prop="name">
          <el-input clearable v-model="resepassword.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmForm">确定</el-button>
        <el-button @click="resetDialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 添加、修改 -->
    <el-dialog
      :title="!title ? '添加':'修改'"
      :visible.sync="addFormVisible"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="userForm" :rules="userRules" ref="userRef" label-width="100px">
        <el-form-item label="姓名 :" prop="cnname">
          <el-input clearable v-model="userForm.cnname"></el-input>
        </el-form-item>
        <el-form-item label="账号 :" prop="empuid">
          <el-input clearable v-model="userForm.empuid" :disabled="title"></el-input>
        </el-form-item>
        <el-form-item label="邮箱 :" prop="email">
          <el-input clearable v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="岗位 :" prop="defaultposname">
          <el-input clearable
            class="common"
            :value="!this.userForm.defaultposname ? '' : this.userForm.defaultposname.join(',')"
            disabled
          >
            <el-button type="primary" slot="append" @click="groupVisible = true"> {{$t('search')}}</el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmUserForm">确定</el-button>
        <el-button @click="addFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <select-group
      v-model="groupVisible"
      :selected="selected"
      :selectTree="['3']"
      @confirm="confirmAdd"
      :frameworkId="selectMenuId"
    ></select-group>
  </div>
</template>

<script>
import {
  getUserList,
  saveUserInfo,
  delUserInfo
} from '@/bpa/api/settings/userManage'
import paginations from '@/bpa/mixins/pagination_mixin'
import { resetInterface } from '@/bpa/api/settings/resetPassword'
import SelectGroup from '@/bpa/components/SelectGroup.vue'

export default {
  components: {
    SelectGroup
  },
  data() {
    return {
      title: false,
      selectMenuId: '',
      groupVisible: false,
      userList: [],
      keyWords: '',
      orderby: 'cnname',
      sort: 'desc',
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      resetDialogFormVisible: false,
      resepassword: {},
      resetRules: {
        name: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      addFormVisible: false,
      userForm: {
        defaultposid: [],
        defaultposname: []
      },
      userRules: {
        cnname: [{ required: true, message: ' ', trigger: 'blur' }],
        empuid: [{ required: true, message: ' ', trigger: 'blur' }]
      }
    }
  },
  mixins: [paginations],
  mounted() {
    this.getList()
  },
  computed: {
    selected() {
      let arr = !this.userForm.defaultposname
        ? []
        : this.userForm.defaultposname.map((item, index) => {
            return {
              NAME: item,
              ID: this.userForm.defaultposid[index]
            }
          })
      return arr
    }
  },
  methods: {
    getList() {
      getUserList({
        attr: {},
        filters: [
          { key: 'cnname', opt: 'LIKE', type: 'S', value: this.keyWords },
          { key: 'empuid', opt: 'LIKE', type: 'S', value: this.keyWords }
        ],
        logic: 'or',
        orderby: this.orderby,
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: this.sort
      }).then(res => {
        this.userList = res.list
        this.pages.total = res.total
      })
    },
    sortMethod(param) {
      console.log(param)
      this.orderby = param.prop
      this.sort = param.order == 'ascending' ? 'asc' : 'desc'
      this.pages.pageNum = 1
      this.getList()
    },
    resePassord() {
      this.resepassword = {}
      this.resetDialogFormVisible = true
      this.$nextTick(() => {
        if (this.$refs.resetRef) {
          this.$refs.resetRef.clearValidate()
        }
      })
    },
    confirmForm() {
      this.$refs.resetRef.validate(valid => {
        console.log(valid)
        if (valid) {
          resetInterface({
            confirmedPassword: '123456',
            originalPassword: '',
            newPassword: '123456',
            userId: this.resepassword.name
          }).then(res => {
            console.log(res)
            if (!res) return false
            this.$message({
              type: 'success',
              message: '密码修改成功!'
            })
            this.resetDialogFormVisible = false
          })
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('hintText.theRequiredFieldsMustNotBeEmpty')
          })
        }
      })
    },
    addUsers(type, item) {
      this.addFormVisible = true
      this.userForm = {}
      this.title = false
      if (type === 'modify') {
        this.title = true
        this.userForm = Object.assign({}, this.userForm, {
          displayname: item.cnname,
          cnname: item.cnname,
          empuid: item.empuid,
          email: item.email,
          defaultposname: !item.defaultposname
            ? []
            : item.defaultposname.split(','),
          defaultposid: !item.defaultposid
            ? []
            : item.defaultposid.split(',').map(item => parseInt(item))
        })
      }
    },
    confirmUserForm() {
      this.$refs.userRef.validate(valid => {
        console.log(valid)
        if (valid) {
          saveUserInfo({
            empuid: this.userForm.empuid,
            cnname: this.userForm.cnname,
            displayname: this.userForm.cnname,
            email: this.userForm.email,
            defaultposid: !this.userForm.defaultposid
              ? ''
              : this.userForm.defaultposid.join(','),
            defaultposname: !this.userForm.defaultposname
              ? ''
              : this.userForm.defaultposname.join(',')
          }).then(res => {
            if (!res) return false
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
            this.addFormVisible = false
            this.singleSearch()
          })
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('hintText.theRequiredFieldsMustNotBeEmpty')
          })
        }
      })
    },
    deleteRow(item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
        .then(() => {
          delUserInfo(item.id).then(res => {
            if (!res) return false
            this.$message({
              type: 'success',
              message: this.$t('hintText.successfullyDelete')
            })
            this.singleSearch()
          })
        })
        .catch(() => {
          console.log('取消')
        })
    },
    confirmAdd(data) {
      console.log(data)
      let name = data.map(item => item.NAME)
      let ids = data.map(item => item.ID)
      this.userForm = Object.assign(this.userForm, {
        defaultposname: name,
        defaultposid: ids
      })
      console.log(this.userForm)
    }
  }
}
</script>

<style lang="scss" scoped>
.common {
  /deep/ .el-input-group__append .el-button {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
  }
}
</style>
