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
              <div class="btn-wrap">
                <el-upload class="upload-demo" :action="action" name="file" :data="{'dataType':'middledesc'}"
                  :headers="headData" :show-file-list='false' :before-upload="beforeAvatarUpload" :on-success="uploadSuccess"
                  :on-error="uploadError" style="display: inline-block;margin-right: 10px;">
                  <el-button type="primary">
                    {{ $t('import') }}
                    <!--<i class="el-icon-upload2" />-->
                  </el-button>
                </el-upload>
                <export :filters="filters" :selections="selections" type="middledescExport" />
                <el-button type="primary" @click="addList($t('addBusinessRoles'))">
                  {{ $t('add') }}
                  <!--<i class="el-icon-circle-plus-outline"/>-->
                </el-button>
                <el-button type="primary" :disabled="selections.length === 0" @click="handleAllDelete">
                  {{ $t('batchDelete') }}
                  <!--<i class="el-icon-circle-close"/>-->
                </el-button>
                <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
                  {{ $t('advancedQuery') }}
                  <i :class="isPowerSearch?'el-icon-caret-top':'el-icon-caret-bottom'"/>
                </el-button>
                <el-button type="primary" @click="getData">
                  {{ $t('refresh') }}
                  <!--<i class="el-icon-refresh"/>-->
                </el-button>
              </div>
            </div>
            <el-form class="power-search" :model="searchForm" @keyup.enter.native="search" ref="searchForm" label-width="120px"
              size="mini" v-if="isPowerSearch">
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('businessRoleName') + '：'">
                    <el-input clearable type="text" v-model="searchForm.tablename"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('correspondingBusinessTable') + '：'">
                    <el-input clearable type="text" v-model="searchForm.tablevalue"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('businessRoleDescription') + '：'">
                    <el-input clearable type="text" v-model="searchForm.tabledesc"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" class="text-r">
                  <el-button type="primary" @click="search">{{ $t('query') }}</el-button>
                  <el-button type="primary" @click="reset">{{ $t('reset') }}</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </template>
        <!-- 业务角色名称 -->
        <template #tablename="{ row }">
          <div>{{ row.tablename }}</div>
        </template>
        <!-- 对应业务表 -->
        <template #tablevalue="{ row }">
          <div>{{ row.tablevalue }}</div>
        </template>
        <!-- 业务角色描述 -->
        <template #tabledesc="{ row }">
          <div>{{ row.tabledesc }}</div>
        </template>
        <!-- 操作 -->
        <template #id="{ row }">
          <el-tooltip class="item" effect="dark" :content="$t('editBusinessRole')" placement="top">
            <el-button type="text" @click="addList($t('editBusinessRole'),row)">
              {{ $t('editBusinessRole') }}
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
            <el-button type="text" @click="handleDelete(row)">{{ $t('delete') }}</el-button>
          </el-tooltip>
        </template>
      </bas-table>
    </div>
    <!-- <el-pagination style="margin-top: 15px" :page-size="page.pageSize" :current-page.sync="page.pageNum" background
      @current-change="getData()" :total="content.total"></el-pagination> -->
    <business-role-dialog v-model="dialogVisible" :itemId="editItem" :title="linkTitle" @confirm="saveSuccess" />
  </el-card>
</template>

<script>
import businessRoleDialog from './businessRoleDialog'
import Export from '@/bpm/components/export/Export'
import { getMiddleList, batchDeleteMiddle, deleteMiddle } from '@/bpm/api/process/business/business_role.js'
import SearchListMixin from '@/bpm/mixins/search_list_mixin.js'
import axios from 'axios'
export default {
  name: 'businessRole',
  mixins: [SearchListMixin],
  components: {
    businessRoleDialog,
    Export
  },
  data () {
    return {
      headData: {
        token: localStorage.getItem('token')
      },
      action: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/datamanage/dataImport`,
      loading: false,
      isPowerSearch: false,
      dialogVisible: false,
      searchForm: {},
      editItem: '',
      linkTitle: '',
      headers: [
        {
          key: 'tablename',
          name: this.$t('businessRoleName'),
          span: 4
        },
        {
          key: 'tablevalue',
          name: this.$t('correspondingBusinessTable'),
          span: 7
        },
        {
          key: 'tabledesc',
          name: this.$t('businessRoleDescription'),
          span: 7
        },
        {
          name: this.$t('operation'),
          span: 3
        }
      ],
      selections: [],
      filters: [],
      content: {
        list: [{}]
      },
      sort: {},
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      checkAll: '',
      // 表头字段
      headerList: [
        {
          label: this.$t('businessRoleName'), // 业务角色名称
          prop: 'tablename',
          slotName: 'tablename',
          sortable: true
        },
        {
          label: this.$t('correspondingBusinessTable'), // 对应业务表
          prop: 'tablevalue',
          slotName: 'tablevalue',
          sortable: true
        },
        {
          label: this.$t('businessRoleDescription'), // 业务角色描述
          prop: 'tabledesc',
          slotName: 'tabledesc',
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
      this.getData()
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
        url: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/datamanage/middledescExport`,
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
        link.setAttribute('download', '业务角色.json')
        document.body.appendChild(link)
        link.click()
      }).catch(() => {
        this.pageLoading = false
      })
    },
    handleDelete (item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      }).then(() => {
        deleteMiddle(item.id).then((rt) => {
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
      }).catch(_ => { })
    },
    handleAllDelete () {
      this.$confirm(this.$t('hintText.areYouSureDeleteSelectedData'), this.$t('hintText.hint'), {
        type: 'warning'
      }).then(() => {
        batchDeleteMiddle(this.selections.map(item => (item.id)).join(','))
          .then((rt) => {
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
      }).catch(_ => { })
    },
    saveSuccess (data) {
      if (data) {
        this.getData()
      }
    },
    addList (item, data) {
      if (item === this.$t('addBusinessRoles')) {
        this.dialogVisible = true
        this.linkTitle = item
        this.editItem = ''
      } else if (item === this.$t('editBusinessRole')) {
        this.dialogVisible = true
        this.linkTitle = item
        this.editItem = data.id
      }
    },
    getData () {
      this.loading = true
      this.checkAll = false
      getMiddleList({
        logic: 'and',
        filters: this.filters,
        ...this.sort,
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
    handleSort (val) {
      this.sort = val
      this.getData()
    },
    search () {
      this.filters = []
      Object.keys(this.searchForm).forEach(key => {
        const filter = {
          key,
          opt: 'LIKE',
          type: 'S',
          value: this.searchForm[key]
        }
        if (key === 'startDate' || key === 'endDate') {
          filter.type = 'D'
          filter.opt = 'BETWEEN'
          filter.value = this.searchForm[key] ? this.searchForm[key].join('~') : ''
        }
        this.filters.push(filter)
      })
      this.getData()
    },
    reset () {
      this.searchForm = {}
      this.search()
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
</style>
