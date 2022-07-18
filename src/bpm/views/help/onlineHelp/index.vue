<template>
  <el-card shadow="never">
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <quick-query ref="quick" :placeholder="$t('placeholderText.multipleFieldsPlaceholder36')" @quickSearch="quickSearch" />
      </div>
      <div class="btn-wrap">
        <el-button v-if="isAdmin" type="primary" @click="handleAdd">
          {{ $t('add') }}
          <!---->
        </el-button>
        <el-button v-if="isAdmin" type="primary" :disabled="selections.length === 0" @click="handleAllDelete">
          {{ $t('batchDelete') }}
          <!---->
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
    <el-form
      v-if="isPowerSearch"
      ref="searchForm"
      class="power-search"
      :model="searchForm"
      label-width="120px"
      size="mini"
      @keyup.enter.native="powerSearch"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('name2') + '：'">
            <el-input v-model="searchForm.title" clearable type="text" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('description') + '：'">
            <el-input v-model="searchForm.description" clearable type="text" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('document') + '：'">
            <el-input v-model="searchForm.filename" clearable type="text" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('uploadTime') + '：'">
            <el-date-picker
              v-model="searchForm.uploadtime"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00','23:59:59']"
              :range-separator="$t('placeholderText.to')"
              :start-placeholder="$t('placeholderText.startDate')"
              :end-placeholder="$t('placeholderText.endDate')"
            />
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
    <div id="out-table" v-loading="loading" class="tableWrap">
      <div v-if="$store.state.app.tableStyle ==='default'">
        <div class="table-header margin-t10">
          <el-checkbox v-if="isAdmin" v-model="checkAll" class="all-check" />
          <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort" />
        </div>
        <div v-if="content.list && content.list.length!==0">
          <div v-for="(item, index) in content.list" :key="index" class="tr">
            <div class="tr-title">
              <el-checkbox v-if="isAdmin" v-model="item.checked" style="margin-right: 10px" />
              <span>{{ $t('uploadTime') }}：{{ item.uploadtime | formatDateTime }}</span>
            </div>
            <el-row class="tr-body" type="flex" align="middle">
              <el-col class="td" :span="headers[0].span">
                {{ item.title }}
              </el-col>
              <el-col class="td" :span="headers[1].span">
                {{ item.description }}
              </el-col>
              <el-col class="td" :span="headers[2].span">
                <el-button type="text" @click.native="downloadFile(item)">
                  {{ item.filename }}
                </el-button>
              </el-col>
              <el-col v-if="isAdmin" style="text-align: center" :span="headers[3].span">
                <el-tooltip class="item" effect="dark" :content="$t('edit')" placement="top">
                  <el-button type="text" @click="handleEdit(item)" >{{ $t('edit') }}</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
                  <el-button type="text" @click="handleDeleteOne(item)" >{{ $t('delete') }}</el-button>
                </el-tooltip>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-else class="text-c pad-10px tr-empty">
          {{ $t('noData') }}
        </div>
      </div>
      <div v-else>
        <el-table
          :data="content.list"
          class="margin-t10"
          stripe
          :header-cell-style="{background: '#E1EAFD !important'}"
          highlight-current-row
          @sort-change="elHandleSort"
          current-row-key="id"
        >
          <el-table-column width="50">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.checked" />
            </template>
            <template slot="header">
              <el-checkbox v-model="checkAll" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('name2')" show-overflow-tooltip sortable prop="title">
            <template slot-scope="scope">
              <div>{{scope.row.title}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('description')" show-overflow-tooltip sortable prop="description">
            <template slot-scope="scope">
              <div>{{scope.row.description}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('document')" show-overflow-tooltip sortable prop="filename">
            <template slot-scope="scope">
                <el-button type="text" @click.native="downloadFile(scope.row)">
                  {{ scope.row.filename }}
                </el-button>
            </template>
          </el-table-column>
          <el-table-column :label="$t('uploadTime')" show-overflow-tooltip sortable prop="uploadtime">
            <template slot-scope="scope">
              <div>{{scope.row.uploadtime | formatDateTime}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('operation')" v-if="isAdmin" width="100">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="$t('edit')" placement="top">
                  <el-button type="text" @click="handleEdit(scope.row)">{{ $t('edit') }}</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
                  <el-button type="text" @click="handleDeleteOne(scope.row)">{{ $t('delete') }}</el-button>
                </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
	    </div>
    </div>
    <el-pagination
      style="margin-top: 15px"
      :page-size="page.pageSize"
      :current-page.sync="page.pageNum"
      background
      :total="content.total"
      @current-change="searchType === 'power' ? getData() : quickQueryData()"
    />
    <online-help-dialog v-model="dialogVisible" :item="editItem" @confirm="saveSuccess" />
  </el-card>
</template>
<script>
import { gethelpList, deleteHelp, hasEditHelpPerm, batchDeleteHelp, quickQueryHelpList } from '@/bpm/api/help/onlineHelp/help'
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import onlineHelpDialog from './onlineHelpDialog'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import axios from 'axios'
export default {
  name: 'HelpDocument',
  components: {
    onlineHelpDialog,
    QuickQuery
  },
  mixins: [SearchListMixin],
  data() {
    return {
      isPowerSearch: false,
      searchForm: {},
      sort: {},
      page: {
        pagenum: 1,
        pagesize: 10
      },
      selections: [],
      checkAll: false,
      isAdmin: true,
      dialogVisible: false,
      editItem: {},
      loading: false,
      headers: [
        {
          key: 'title',
          name: this.$t('name2'),
          span: 6
        },
        {
          key: 'description',
          name: this.$t('description'),
          span: 6
        },
        {
          key: 'filename',
          name: this.$t('document'),
          span: 6
        },
        {
          name: this.$t('operation'),
          span: 6
        }
      ],
      myHeaders: { token: localStorage.getItem('token') }
    }
  },
  watch: {
    'content.list': {
      handler(val) {
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
    checkAll(val) {
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
  mounted() {
    this.getData()
  },
  methods: {
    downloadFile(item) {
      window.location.href = `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/bpm/attachment/download/${item.filepath}?attachmentType=bpm`

      // this.$loading()
      // axios.get(`${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/bpm/attachment/download/${item.filepath}`, {
      //   responseType: 'arraybuffer',
      //   headers: {
      //     ...this.myHeaders
      //   }
      // }).then(rt => {
      //   this.$loading().close()

      //   window.location.href = rt.config.url

      //   // window.open(rt.request.responseURL, '_blank')
      // }).catch(() => {
      //   this.$loading().close()
      // })
    },
    // 快速获取数据
    quickQueryData() {
      // this.loading = true
      this.checkAll = false

      quickQueryHelpList({
        logic: 'or',
        filters: this.filters,
        queryFilter: ['title', 'description', 'filename'],
        ...this.sort,
        ...this.page,
        ...this.quickData
      }).then(rt => {
        rt.data.list.forEach(item => {
          item.checked = false
        })
        this.content = rt.data
        this.loading = false
      })
        .catch(() => {
          this.loading = false
        })
    },
    getStatusStr(status) {
      const result = this.statusArr.find(item => item.value === status)
      return result ? result.label : '未知'
    },
    // 获取数据
    getData() {
      // this.loading = true
      this.checkAll = false
      quickQueryHelpList({
        logic: 'and',
        filters: this.filters,
        ...this.sort,
        ...this.page
      }).then(rt => {
        rt.data.list.forEach(item => {
          item.checked = false
        })
        this.content = rt.data
        return hasEditHelpPerm()
      }).then(rt => {
        if (rt.data === 'N') {
          this.isAdmin = false
          // this.headers = [
          //   {
          //     key: 'title',
          //     name: this.$t('name2'),
          //     span: 8
          //   },
          //   {
          //     key: 'description',
          //     name: '描述',
          //     span: 8
          //   },
          //   {
          //     key: 'filename',
          //     name: '文档',
          //     span: 8
          //   }
          // ]
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleDeleteOne(item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      }).then(() => {
        deleteHelp(item.id).then((rt) => {
          if (rt.status === '200') {
            if (this.searchType === 'power') {
              this.getData()
            } else if (this.searchType === 'quick') {
              this.quickQueryData()
            }
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
      }).catch(_ => {})
    },
    handleAllDelete() {
      this.$confirm(this.$t('hintText.areYouSureDeleteSelectedData'), this.$t('hintText.hint'), {
        type: 'warning'
      }).then(() => {
        batchDeleteHelp(this.selections.map(item => (item.id)).join(','))
          .then((rt) => {
            if (rt.status === '200') {
              if (this.searchType === 'power') {
                this.getData()
              } else if (this.searchType === 'quick') {
                this.quickQueryData()
              }
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
      }).catch(_ => {})
    },
    handleAdd() {
      this.editItem = {}
      this.dialogVisible = true
    },
    handleEdit(item) {
      this.editItem = JSON.parse(JSON.stringify(item))
      this.dialogVisible = true
    },
    saveSuccess(data) {
      if (data) {
        if (this.searchType === 'power') {
          this.getData()
        } else if (this.searchType === 'quick') {
          this.quickQueryData()
        }
      }
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
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
