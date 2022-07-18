<template>
  <el-card shadow="never">
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <quick-query ref="quick" :placeholder="$t('placeholderText.multipleFieldsPlaceholder29')" :is-date="false" @quickSearch="quickSearch" />
      </div>
      <div class="btn-wrap">
        <el-button type="primary" @click="addList($t('addOrganizationAttributes'))">
          {{ $t('add') }}
          <!---->
        </el-button>
        <el-button
          type="primary"
          :disabled="selections.length === 0"
          @click="handleAllDelete"
        >
          {{ $t('batchDelete') }}
          <!--<i class="el-icon-circle-close"/>-->
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
          <el-form-item :label="$t('attributeName') + '：'">
            <el-input v-model="searchForm.orgattributename" clearable type="text" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('fieldNames') + '：'">
            <el-input v-model="searchForm.orgattributefieldname" clearable type="text" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('remarks') + '：'">
            <el-input v-model="searchForm.orgattributeremark" clearable type="text" />
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
    <div v-loading="loading">
      <div v-if="$store.state.app.tableStyle ==='default'">
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
                <p :title="item.orgattributename">
                  {{ item.orgattributename }}
                </p>
              </el-col>
              <el-col class="td" :span="headers[1].span">
                <p :title="item.orgattributefieldname">
                  {{ item.orgattributefieldname }}
                </p>
              </el-col>
              <el-col class="td" :span="headers[2].span">
                <p :title="item.orgattributeremark">
                  {{ item.orgattributeremark }}
                </p>
              </el-col>
              <el-col style="text-align: center" :span="headers[2].span">
                <el-tooltip class="item" effect="dark" :content="$t('editOrganizationProperties')" placement="top">
                  <el-button type="text" icon="el-icon-edit" @click="addList($t('editOrganizationProperties'),item)" />
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
                  <el-button type="text" @click="getInstanceImage(item.instanceId)">
                    <el-button type="text" icon="el-icon-delete" @click="handleDeleteOne(item)" />
                  </el-button>
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
          <el-table-column :label="$t('attributeName')" show-overflow-tooltip sortable prop="orgattributename">
          </el-table-column>
          <el-table-column :label="$t('fieldNames')" show-overflow-tooltip sortable prop="orgattributefieldname">
          </el-table-column>
          <el-table-column :label="$t('remarks')" show-overflow-tooltip sortable prop="orgattributeremark">
          </el-table-column>
          <el-table-column :label="$t('operation')" width="80">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="$t('editOrganizationProperties')" placement="top">
                <el-button type="text" icon="el-icon-edit" @click="addList($t('editOrganizationProperties'),scope.row)" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
                <el-button type="text" @click="getInstanceImage(scope.row.instanceId)">
                  <el-button type="text" icon="el-icon-delete" @click="handleDeleteOne(scope.row)" />
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-pagination
        style="margin-top: 15px"
        :page-size="page.pageSize"
        :current-page.sync="page.pageNum"
        background
        :total="content.total"
        @current-change="searchType === 'power' ? getData() : quickQueryData()"
      />
    </div>
    <add-organization
      v-model="dialogVisible"
      :item="editItem"
      :title="linkTitle"
      @confirm="saveSuccess"
    />
  </el-card>
</template>
<script>
import addOrganization from './addOrganization'
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import {
  getOrgattributeList,
  getOrgattributeQuickQuery,
  deleteOrgattribute,
  batchDeleteOrgattribute
} from '@/bpm/api/process/processModeling/organization'
export default {
  name: 'Organization',
  components: {
    addOrganization,
    QuickQuery
  },
  mixins: [SearchListMixin],
  data() {
    return {
      dialogVisible: false,
      loading: false,
      isPowerSearch: false,
      searchForm: {},
      linkTitle: '',
      editItem: {},
      headers: [
        {
          key: 'orgattributename',
          name: this.$t('attributeName'),
          span: 8
        },
        {
          key: 'orgattributefieldname',
          name: this.$t('fieldNames'),
          span: 8
        },
        {
          key: 'orgattributeremark',
          name: this.$t('remarks'),
          span: 4
        },
        {
          name: this.$t('operation'),
          span: 4
        }
      ],
      content: {},
      selections: [],
      filters: [],
      sort: {},
      page: {
        pageNum: 1,
        pageSize: 10
      },
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
  mounted() {
    this.getData()
  },
  methods: {
    handleDeleteOne(item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          deleteOrgattribute(item.id).then(rt => {
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
          batchDeleteOrgattribute(
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
      this.loading = true
      this.checkAll = false

      getOrgattributeQuickQuery({
        logic: 'or',
        queryFilter: ['orgattributename', 'orgattributefieldname', 'orgattributeremark'],
        ...this.quickData,
        filters: this.filters,
        ...this.sort,
        ...this.page
      }).then(rt => {
        rt.data.list.forEach(item => {
          item.checked = false
        })
        this.content = rt.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    addList(item, data) {
      if (item === this.$t('addOrganizationAttributes')) {
        this.dialogVisible = true
        this.linkTitle = item
        this.editItem = {}
      } else if (item === this.$t('editOrganizationProperties')) {
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
      getOrgattributeQuickQuery({
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
    },
    handleSort(val) {
      this.sort = val
      this.getData()
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
