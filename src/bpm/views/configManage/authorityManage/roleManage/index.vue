<template>
  <el-card shadow="never" class="card-reset">
    <!--    表格-->
    <bas-table
      row-key="id"
      :tableList="content.list"
      :headerList="headerList"
      :pages="page"
      selectType="checkbox"
      @selectionChange="handleSelectionChange"
      @currentChange="currentChange">
      <template #search>
        <div>
          <div class="tool-common-wrap">
            <div class="search-wrap" style="display:none;">
              <quick-query ref="quick" :is-date="false" @quickSearch="quickSearch" />
            </div>
            <div class="btn-wrap">
              <el-upload class="upload-demo" :action="action" name="file" :data="{'dataType':'role'}" :headers="headData"
                :show-file-list='false' :before-upload="beforeAvatarUpload" :on-success="uploadSuccess"
                :on-error="uploadError" style="display: inline-block;margin-right: 10px;">
                <el-button type="primary">
                  {{ $t('import') }}
                  <!--<i class="el-icon-upload2" />-->
                </el-button>
              </el-upload>
              <export :filters="filters" :selections="selections" type="roleExport" />
              <el-button type="primary" @click="userHandle($t('addingRoles'))">
                {{ $t('add') }}
                <!---->
              </el-button>
              <el-button type="primary" :disabled="selections.length===0" @click="handleAllDelete">
                {{ $t('batchDelete') }}
                <!--<i class="el-icon-circle-close" />-->
              </el-button>
              <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
                {{ $t('advancedQuery') }}
                <i :class="isPowerSearch?'el-icon-caret-top':'el-icon-caret-bottom'" />
              </el-button>
              <el-button type="primary" @click="rest">
                {{ $t('refresh') }}
                <!---->
              </el-button>
            </div>
          </div>
          <el-form v-if="isPowerSearch" ref="searchForm" class="power-search" :model="searchForm" label-width="120px"
            size="mini" @keyup.enter.native="powerSearch">
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('name2') + '：'">
                  <el-input clearable v-model="searchForm.name" type="text" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="text-r">
                <el-button type="primary" @click="powerSearch">
                  {{ $t('query') }}
                </el-button>
                <el-button type="primary" @click="rest">
                  {{ $t('reset') }}
                </el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </template>
      <!-- 名称 -->
      <template #name="{ row }">
        <div>{{ row.name }}</div>
      </template>
      <!-- 默认 -->
      <template #defaults="{ row }">
        <div>{{ row.defaults === 1 ? $t('yes') : $t('no') }}</div>
      </template>
      <!-- 禁用 -->
      <template #delete="{ row }">
        <div>{{ row.delete === 1 ? $t('yes') : $t('no') }}</div>
      </template>
      <!-- 操作 -->
      <template #updateon="{ row }">
        <el-tooltip class="item" :content="$t('assignMembers')" placement="top"
                    v-show="row.name!=='普通用户'">
          <el-button type="text" @click="userHandle($t('assignMembers'),row)">{{ $t('assignMembers') }}</el-button>
        </el-tooltip>
        <el-tooltip class="item" :content="$t('assignPermissions')" placement="top" :style="row.name==='普通用户'?'margin-left:0px':''">
          <el-button type="text" @click="userHandle($t('assignPermissions'),row)">{{ $t('assignPermissions') }}</el-button>
        </el-tooltip>
        <el-tooltip class="item" :content="$t('edit')" placement="top"
                    v-show="row.name !== '超级管理员'&&row.name!=='普通用户'&&row.name!=='流程管理员'">
          <el-button type="text" @click="userHandle($t('editRole'),row)">{{ $t('edit') }}</el-button>
        </el-tooltip>
        <el-tooltip class="item" :content="$t('delete')" placement="top"
                    v-show="row.name !== '超级管理员'&&row.name!=='普通用户'&&row.name!=='流程管理员'">
          <el-button type="text" @click="handleDelete(row)">{{ $t('delete') }}</el-button>
        </el-tooltip>
      </template>
    </bas-table>

    <role-manage-dialog v-model="dialogVisible" :item="editItem" :title="linkTitle" @confirm="saveSuccess" />
    <tree v-model="treeDialog" :title="editItem.name+'--'+ $t('permissionSettings')" :item="editItem" />
    <allocation-dialog v-model="businessDialogVisible" :title="editItem.name+'--'+ $t('assignMembers')"
      :item="editItem" />
  </el-card>
</template>
<script>
import roleManageDialog from './roleManageDialog'
import allocationDialog from './allocationDialog'
import tree from './tree'
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import Export from '@/bpm/components/export/Export'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import axios from 'axios'
import {
  getAuthroleList,
  deleteRole,
  batchDeleteRole
} from '@/bpm/api/configManage/authorityManage/roleManage'
export default {
  components: {
    roleManageDialog,
    allocationDialog,
    QuickQuery,
    tree,
    Export
  },
  mixins: [SearchListMixin],
  data () {
    return {
      headData: {
        token: localStorage.getItem('token')
      },
      action: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/datamanage/dataImport`,
      loading: false,
      isPowerSearch: false,
      dialogVisible: false,
      businessDialogVisible: false,
      treeDialog: false,
      searchForm: {},
      editItem: {},
      linkTitle: '',
      headers: [
        {
          key: 'name',
          name: this.$t('name2'),
          span: 5
        },
        {
          key: 'type',
          name: this.$t('type'),
          span: 5
        },
        {
          key: 'defaults',
          name: this.$t('default'),
          span: 5
        },
        {
          key: 'delete',
          name: this.$t('disable'),
          span: 5
        },
        {
          name: this.$t('operation'),
          span: 4
        }
      ],
      content: {
        list: [{}]
      },
      // 表头字段
      headerList: [
        {
          label: '', // 星标
          prop: 'starmark',
          slotName: 'starmark',
          width: 35
        },
        {
          label: this.$t('name2'), // 名称
          prop: 'name',
          slotName: 'name',
          sortable: true
        },
        {
          label: this.$t('default'), // 默认
          prop: 'defaults',
          slotName: 'defaults',
          sortable: true
        },
        {
          label: this.$t('disable'), // 禁用
          prop: 'delete',
          slotName: 'delete',
          sortable: true
        },
        {
          label: this.$t('operation'), // 操作
          prop: 'updateon',
          slotName: 'updateon',
          sortable: false
        }
      ],
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      filters: [],
      selections: [],
      checkAll: ''
    }
  },
  watch: {
    'content.list': {
      handler (val) {
        if (this.content.list && this.content.list.length !== 0) {
          this.checkAll = true
          this.selections = []
          for (let i = 0; i < this.content.list.length; i++) {
            if (!this.content.list[i].checked) {
              this.checkAll = false
            } else {
              this.selections.push(this.content.list[i])
            }
          }
        }
      },
      deep: true
    },
    checkAll (val) {
      if (this.content.list) {
        if (val) {
          this.content.list.forEach(item => {
            item.checked = val
          })
        } else if (this.selections.length === this.content.list.length) {
          this.content.list.forEach(item => {
            item.checked = val
          })
        }
      }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 页码改变事件
    currentChange(newPageNum) {
      console.log('newPage', newPageNum)
      this.page.pageNum = newPageNum
      // if (this.searchType === 'power') {
        this.getData()
      // } else if (this.searchType === 'quick') {
      //   this.quickQueryData()
      // }
    },
    // 复选框勾选事件
    handleSelectionChange(data) {
      console.log(data)
      this.selections = data
    },
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 100;
      let postfix = file.name.replace(/.+\./, "");
      const isPostfix = ['JSON'].indexOf(postfix.toUpperCase()) === -1
      if (isPostfix) {
        this.$message.error(this.$t('hintText.pleaseUploadJsonFile'))
      }
      if (!isLt2M) {
        this.$message.error(this.$t('hintText.uploadAttachmentSizeCannotExceed'))
      }
      if (!isPostfix && isLt2M) {
        this.pageLoading = true

      }
      return !isPostfix && isLt2M
    },
    uploadSuccess (file) {
      this.pageLoading = false
      if (file.status === '200') {
        this.$message.success(this.$t('hintText.importedSuccessfully'))
        this.getData()
      } else {
        this.$message.error(this.$t('hintText.importFileError'))
      }
    },
    uploadError (err) {
      console.log(err)
      console.log(err.message)
      this.pageLoading = false
      // if (err.message) {
      //   let data = JSON.parse(err.message)
      //   this.$message.error(data.message)
      // } else {
      //   this.$message.error(this.$t('hintText.importFailed'))
      // }
      this.$message.error(this.$t('hintText.importFileError'))
    },
    excelFile () {
      this.pageLoading = true
      axios({
        method: 'post',
        url: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/datamanage/roleExport`,
        data: {
          filters: [...this.filters, ...[{ 'key': 'id', 'value': (this.selections.map(x => x.id)).join(','), 'opt': 'IN' }]]
        },
        headers: {
          token: localStorage.getItem('token')
        },
        responseType: 'blob'
      }).then(res => {
        this.pageLoading = false
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
        let url = window.URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', '角色管理.json')
        document.body.appendChild(link)
        link.click()
      }).catch(() => {
        this.pageLoading = false
      })
    },
    handleAllDelete () {
      this.$confirm(this.$t('hintText.areYouSureDeleteSelectedData'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          batchDeleteRole(this.selections.map(item => item.id)).then(rt => {
            if (rt.status === '200') {
              this.getData()
              this.$message({
                message: this.$t('hintText.successfullyDelete'),
                type: 'success'
              })
            } else {
              this.$message({
                message: this.$t('hintText.failToDelete'),
                type: 'error'
              })
            }
          })
        })
        .catch(_ => { })
    },
    handleDelete (item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          deleteRole(item.id).then(rt => {
            if (rt.status === '200') {
              this.getData()
              this.$message({
                message: this.$t('hintText.successfullyDelete'),
                type: 'success'
              })
            } else {
              this.$message({
                message: this.$t('hintText.failToDelete'),
                type: 'error'
              })
            }
          })
        })
        .catch(_ => { })
    },
    userHandle (item, data) {
      this.linkTitle = item
      if (item === this.$t('addingRoles')) {
        this.editItem = {}
        this.dialogVisible = true
      } else if (item === this.$t('editRole')) {
        this.editItem = Object.assign({}, data)
        this.dialogVisible = true
      } else if (item === this.$t('assignMembers')) {
        this.editItem = Object.assign({}, data)
        this.businessDialogVisible = true
      } else if (item === this.$t('assignPermissions')) {
        this.editItem = Object.assign({}, data)
        this.treeDialog = true
      }
    },
    getData () {
      this.loading = true
      this.checkAll = false
      getAuthroleList({
        logic: 'and',
        filters: this.filters,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          if (rt.status === '200') {
            rt.data.list.forEach(item => {
              item.checked = false
            })
            this.page.total = rt.data.total
            this.content = rt.data
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    saveSuccess (param) {
      this.getData()
    }
  }
}
</script>
<style lang="scss" scoped>
.margin-t10 {
  /deep/ .el-table__header {
    width: 100% !important;
  }
  /deep/ .el-table__body {
    width: 100% !important;
  }
}
.table-header {
  position: relative;
  background: $bc2;
  display: flex;
  align-items: center;
  .all-check {
    position: absolute;
    left: 20px;
  }
}
.w100 {
  width: 100%;
}
</style>
