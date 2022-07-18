<template>
  <el-card shadow="never">
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <quick-query ref="quick" :placeholder="$t('name2')" :is-date="false" @quickSearch="quickSearch" />
      </div>
      <div class="btn-wrap">
        <el-button type="primary" @click="addList($t('addFormPage'))">
          {{ $t('add') }}
          <!---->
        </el-button>
        <el-button
          type="primary"
          :disabled="selections.length === 0"
          @click="handleAllDelete"
        >
          {{ $t('batchDelete') }}
          <!--<i class="el-icon-circle-close"-->
          <!--:disabled="selections.length === 0"-->
          <!--@click="handleAllDelete"-->
          <!--/>-->
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
            <el-input v-model="searchForm.reqNo" clearable type="text" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('typeName') + '：'">
            <el-input v-model="searchForm.subject" clearable type="text" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('tableName') + '：'">
            <el-input v-model="searchForm.subject" clearable type="text" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('remarks') + '：'">
            <el-input v-model="searchForm.reqNo" clearable type="text" />
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
    <div class="table-header margin-t10">
      <el-checkbox v-model="checkAll" class="all-check" />
      <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort" />
    </div>
    <div v-if="content.list && content.list.length!==0">
      <div v-for="(item, index) in content.list" :key="index" class="tr">
        <div class="tr-title">
          <el-checkbox v-model="item.checked" style="margin-right: 10px" />
        <!-- <span>{{ $t('applicationDate') }}：{{item.createDate | formatDateTime}}</span> -->
        <!-- <span style="margin-left: 60px">申请单号：{{item.reqNo}}</span> -->
        </div>
        <el-row class="tr-body" type="flex" align="middle">
          <el-col class="td" :span="headers[0].span">
            <p :title="item.drafter">
              {{ item.drafter }}
            </p>
          </el-col>
          <el-col class="td" :span="headers[1].span">
            <p :title="item.passReaderUserName">
              {{ item.passReaderUserName }}
            </p>
          </el-col>
          <el-col class="td" :span="headers[2].span">
            <p :title="item.passReaderUserName">
              {{ item.passReaderUserName }}
            </p>
          </el-col>
          <el-col class="td" :span="headers[3].span">
            <p :title="item.passReaderUserName">
              {{ item.passReaderUserName }}
            </p>
          </el-col>
          <el-col class="td" :span="headers[4].span">
            <p :title="item.passReaderUserName">
              {{ item.passReaderUserName }}
            </p>
          </el-col>
          <el-col style="text-align: center" :span="headers[5].span">
            <el-tooltip class="item" effect="dark" :content="$t('editFormPage')" placement="top">
              <el-button type="text" icon="el-icon-edit" @click="addList($t('editFormPage'),item)" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
              <el-button type="text" icon="el-icon-delete" @click="handleDeleteOne(item)" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="$t('configurationPage')" placement="top">
              <el-button type="primary">
                {{ $t('configurationPage') }}
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="$t('generateLibrary')" placement="top">
              <el-button type="primary">
                {{ $t('generateLibrary') }}
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="$t('preview')" placement="top">
              <el-button type="primary">
                {{ $t('preview') }}
              </el-button>
            </el-tooltip>
          </el-col>
        </el-row>
      </div>
    </div>
    <div v-else class="text-c pad-10px tr-empty">
       {{ $t('noData') }}
    </div>

    <el-pagination
      style="margin-top: 15px"

      :page-size="page.pageSize"
      :current-page.sync="page.pageNum"
      background
      :total="content.total"
      @current-change="searchType === 'power' ? getData() : quickQueryData()"
    />
    <add-form v-model="dialogVisible" :item="editItem" :title="linkTitle" @confirm="saveSuccess" />
  </el-card>
</template>
<script>
import addForm from './addForm'
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
export default {
  name: 'FormConfiguration',
  components: {
    addForm,
    QuickQuery
  },
  mixins: [SearchListMixin],
  data() {
    return {
      dialogVisible: false,
      isPowerSearch: false,
      linkTitle: '',
      editItem: {},
      headers: [
        {
          key: 'drafter',
          name: this.$t('name2'),
          span: 8
        },
        {
          key: 'passReaderUserName',
          name: this.$t('type'),
          span: 4
        },
        {
          key: 'passReaderUserName',
          name: this.$t('typeName'),
          span: 8
        },
        {
          key: 'passReaderUserName',
          name: this.$t('tableName'),
          span: 8
        },
        {
          name: this.$t('remarks'),
          span: 8
        },
        {
          name: this.$t('operation'),
          span: 18
        }
      ],
      selections: [],
      checkAll: ''
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
  methods: {
    handleDeleteOne(item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          deleteApproveType(item.id).then(rt => {
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
        })
        .catch(_ => {})
    },
    handleAllDelete() {
      this.$confirm(this.$t('hintText.areYouSureDeleteSelectedData'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          batchDeleteApproveType(
            this.selections.map(item => item.id).join(',')
          ).then(rt => {
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
        })
        .catch(_ => {})
    },
    quickQueryData() {
      // this.loading = true
      // quickQueryCenterList({
      //   logic: 'or',
      //   filters: this.filters,
      //   ...this.sort,
      //   ...this.page
      // }).then(rt => {
      //   this.content = rt.data
      //   this.loading = false
      // }).catch(() => {
      //   this.loading = false
      // })
    },
    addList(item, data) {
      if (item === this.$t('addFormPage')) {
        this.dialogVisible = true
        this.linkTitle = item
        this.editItem = {}
      } else if (item === this.$t('editFormPage')) {
        this.dialogVisible = true
        this.linkTitle = item
        this.editItem = Object.assign({}, data)
      }
    },
    saveSuccess(data) {
      if (data) {
        if (this.searchType === 'power') {
          this.getData()
        } else if (this.searchType === 'quick') {
          this.quickQueryData()
        }
      }
    },
    getData() {
      this.loading = true
      this.checkAll = false
      getApproveTypeList({
        logic: 'and',
        filters: this.filters,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          rt.data.list.forEach(item => {
            item.checked = false
          })
          this.content = rt.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
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
