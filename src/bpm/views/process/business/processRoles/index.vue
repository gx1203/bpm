<template>
  <el-card shadow="never" class="card-reset">
    <div v-loading="loading">
      <!--    表格-->
      <bas-table
        row-key="id"
        :tableList="content.list"
        :headerList="headerList"
        :pages="page"
        selectType="checkbox"
        :headerCellStyle="{background: '#E1EAFD !important'}"
        @selectionChange="handleSelectionChange"
        @currentChange="currentChange">
        <template #search>
          <div>
            <div class="tool-common-wrap">
              <div class="search-wrap">
                <quick-query :placeholder="$t('placeholderText.multipleFieldsPlaceholder31')" :isDate="false" ref="quick"
                  @quickSearch="quickSearch" />
              </div>
              <div class="btn-wrap">
                <el-upload class="upload-demo" :action="action" name="file" :data="{'dataType':'processrole'}"
                  :headers="headData" :show-file-list='false' :before-upload="beforeAvatarUpload" :on-success="uploadSuccess"
                  :on-error="uploadError" style="display: inline-block;margin-right: 10px;">
                  <el-button type="primary">
                    {{ $t('import') }}
                    <!--<i class="el-icon-upload2" />-->
                  </el-button>
                </el-upload>
                <export :filters="filters" :selections="selections" type="processroleExport" />
                <el-button type="primary" @click="addList($t('addProcessRole'))">
                  {{ $t('add') }}
                  <!---->
                </el-button>
                <el-button type="primary" :disabled="selections.length === 0" @click="handleAllDelete">
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
            <el-form class="power-search" :model="searchForm" @keyup.enter.native="powerSearch" ref="searchForm"
              label-width="120px" size="mini" v-if="isPowerSearch">
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('approvalRole') + '：'">
                    <el-input clearable type="text" v-model="searchForm.people"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('name3') + '：'">
                    <el-input clearable type="text" v-model="searchForm.rolesuser"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('remarks') + '：'">
                    <el-input clearable type="text" v-model="searchForm.remark"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" class="text-r">
                  <el-button type="primary" @click="powerSearch">{{ $t('query') }}</el-button>
                  <el-button type="primary" @click="rest">{{ $t('reset') }}</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </template>
        <!-- 审批角色 -->
        <template #people="{ row }">
          <div>{{ row.people }}</div>
        </template>
        <!-- 姓名 -->
        <template #rolesuser="{ row }">
          <div>{{ row.rolesuser }}</div>
        </template>
        <!-- 备注 -->
        <template #remark="{ row }">
          <div>{{ row.remark }}</div>
        </template>
        <!-- 操作 -->
        <template #id="{ row }">
          <el-tooltip class="item" effect="dark" :content="$t('editProcessRole')" placement="top">
            <el-button type="text" @click="addList($t('editProcessRole'),row)">
              {{ $t('editProcessRole') }}
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
            <el-button type="text" @click="handleDeleteOne(row)">{{ $t('delete') }}</el-button>
          </el-tooltip>
        </template>
      </bas-table>
    </div>
    <!-- <el-pagination style="margin-top: 15px" :page-size="page.pageSize" :current-page.sync="page.pageNum" background
      @current-change="getData" :total="content.total"></el-pagination> -->
    <process-roles-dialog v-model="dialogVisible" :itemId="editItem" :title="linkTitle" :userList="userList"
      @confirm="saveSuccess" />
  </el-card>
</template>

<script>
import processRolesDialog from './processRolesDialog'
import {
  getProcessRolesList,
  deleteProcessRoles,
  batchDeleteProcessRoles,
  getQuickQueryList
} from '@/bpm/api/process/business/process_roles'
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import Export from '@/bpm/components/export/Export'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import axios from 'axios'
export default {
  mixins: [SearchListMixin],
  name: 'processRoles',
  components: {
    processRolesDialog,
    QuickQuery,
    Export
  },
  data () {
    return {
      headData: {
        token: localStorage.getItem('token')
      },
      action: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/datamanage/dataImport`,
      isPowerSearch: false,
      dialogVisible: false,
      editItem: '',
      linkTitle: '',
      headers: [
        {
          key: 'people',
          name: this.$t('approvalRole'),
          span: 4
        },
        {
          key: 'rolesuser',
          name: this.$t('name3'),
          span: 7
        },
        {
          key: 'remark',
          name: this.$t('remarks'),
          span: 7
        },
        {
          name: this.$t('operation'),
          span: 3
        }
      ],
      selections: [],
      checkAll: '',
      userList: [],
      options: [
        {
          value: 'excel',
          name: 'excel'
        },
        {
          value: 'json',
          name: 'json'
        }
      ],
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      // 表头字段
      headerList: [
        {
          label: this.$t('approvalRole'), // 审批角色
          prop: 'people',
          slotName: 'people',
          sortable: true
        },
        {
          label: this.$t('name3'), // 姓名
          prop: 'rolesuser',
          slotName: 'rolesuser',
          sortable: true
        },
        {
          label: this.$t('remarks'), // 备注
          prop: 'remark',
          slotName: 'remark',
          sortable: true
        },
        {
          label: this.$t('operation'), // 操作
          prop: 'id',
          slotName: 'id',
          sortable: false,
          width: "150"
        }
      ]
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
      this.searchType === 'power' ? this.getData() : this.quickQueryData()
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
        url: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/datamanage/processroleExport`,
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
        link.setAttribute('download', '流程角色.json')
        document.body.appendChild(link)
        link.click()
      }).catch(() => {
        this.pageLoading = false
      })
    },
    handleDeleteOne (item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteProcessRoles(item.id).then(rt => {
          if (rt.status === '200') {
            this.loading = false
            if (this.searchType === 'power') {
              this.getData()
            } else if (this.searchType === 'quick') {
              this.quickQueryData()
            }
            this.$message.success(this.$t('hintText.successfullyDelete'))
          } else {
            this.loading = false
          }
        })
      }).catch(_ => {
        this.loading = false
      })
    },
    handleAllDelete () {
      this.$confirm(this.$t('hintText.areYouSureDeleteSelectedData'), this.$t('hintText.hint'), {
        type: 'warning'
      }).then(() => {
        this.loading = true
        batchDeleteProcessRoles(this.selections.map(item => item.id).join(',')).then((rt) => {
          this.loading = false
          if (rt.status === '200') {
            if (this.searchType === 'power') {
              this.getData()
            } else if (this.searchType === 'quick') {
              this.quickQueryData()
            }
            this.$message.success(this.$t('hintText.successfullyDelete'))
          }
        }).catch((er) => {
          this.loading = false
        })
      }).catch(_ => {
        this.loading = false
      })
    },
    quickQueryData () {
      this.loading = true
      this.checkAll = false

      getQuickQueryList({
        logic: 'and',
        filters: this.filters,
        queryFilter: ['people', 'rolesuser', 'remark'],
        ...this.sort,
        ...this.quickData,
        ...this.page
      }).then(rt => {
        rt.data.list.forEach(item => {
          item.checked = false
        })
        this.content = rt.data
        this.page.total = rt.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    saveSuccess (data) {
      if (data) {
        if (this.searchType === 'power') {
          this.getData()
        } else if (this.searchType === 'quick') {
          this.quickQueryData()
        }
      }
    },
    addList (item, val) {
      if (item === this.$t('addProcessRole')) {
        this.dialogVisible = true
        this.linkTitle = item
        this.editItem = ''
      } else if (item === this.$t('editProcessRole')) {
        this.dialogVisible = true
        this.linkTitle = item
        this.editItem = val.id
        this.userList = []
        // this.userList.push({
        //   displayname: item.
        //  empuid
        // })
      }
    },
    getData () {
      console.log(123);
      this.loading = true
      this.checkAll = false
      this.quickQueryData ()
    //   getQuickQueryList({
    //     logic: 'and',
    //     filters: this.filters,
    //     ...this.sort,
    //     ...this.page
    //   })
    //     .then(rt => {
    //       rt.data.list.forEach(item => {
    //         item.checked = false
    //       })
    //       this.content = rt.data
    //       this.loading = false
    //     })
    //     .catch(() => {
    //       this.loading = false
    //     })
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>
