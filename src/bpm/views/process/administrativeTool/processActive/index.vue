<template>
  <el-card shadow="never">
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <quick-query ref="quick" :placeholder="$t('subject')" :is-date="false" @quickSearch="quickSearch" />
      </div>
      <div class="btn-wrap">
        <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
          {{ $t('advancedQuery') }}
          <i :class="isPowerSearch?'el-icon-caret-top':'el-icon-caret-bottom'" />
        </el-button>
        <el-button type="primary" @click="rest">
          {{ $t('refresh') }}
          
        </el-button>
      </div>
    </div>
    <el-form v-if="isPowerSearch" ref="searchForm" class="power-search" :model="searchForm" label-width="120px"
      size="mini" @keyup.enter.native="powerSearch">
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('applicationNumber') + '：'">
            <el-input v-model="searchForm.reqno" clearable type="text" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('subject') + '：'">
            <el-input v-model="searchForm.subject" clearable type="text" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('applicant') + '：'">
            <el-input v-model="searchForm.drafter" clearable type="text" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('applicationDate') + '：'">
            <el-date-picker v-model="searchForm.reqdate" type="daterange" value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00','23:59:59']" :range-separator="$t('placeholderText.to')"
              :start-placeholder="$t('placeholderText.startDate')" :end-placeholder="$t('placeholderText.endDate')" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('state') + '：'">
            <el-input v-model="searchForm.status" clearable type="text" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('processName') + '：'">
            <el-input v-model="searchForm.processnamecn" clearable type="text" />
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
          <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort" />
        </div>
        <div v-if="content.list && content.list.length!==0">
          <div v-for="(item, index) in content.list" :key="index" class="tr">
            <div class="tr-title">
              <span>{{ $t('applicationDate') }}：{{ item.reqdate | formatDateTime }}</span>
            </div>
            <el-row class="tr-body" type="flex" align="middle">
              <el-col class="td" :span="headers[0].span">
                {{ item[headers[0].key] }}
              </el-col>
              <el-col class="td" :span="headers[1].span">
                {{ item[headers[1].key] }}
              </el-col>
              <el-col class="td" :span="headers[2].span">
                {{ item[headers[2].key] }}
              </el-col>
              <el-col class="td" :span="headers[3].span">
                {{ item[headers[3].key] }}
              </el-col>
              <el-col class="td" :span="headers[4].span">
                {{ item[headers[4].key] }}
              </el-col>
              <el-col class="td" :span="headers[5].span">
                <el-tooltip class="item" effect="dark" :content="$t('activation')" placement="top">
                  <el-button type="primary" @click="handleActivate(item)">
                    {{ $t('activation') }}
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
        <el-table :data="content.list" class="margin-t10" stripe :header-cell-style="{background: '#E1EAFD !important'}"
          highlight-current-row @sort-change="elHandleSort" current-row-key="id">
          <el-table-column :label="$t('applicationNumber')" show-overflow-tooltip sortable prop="reqno">
          </el-table-column>
          <el-table-column :label="$t('subject')" show-overflow-tooltip sortable prop="subject">
          </el-table-column>
          <el-table-column :label="$t('applicant')" show-overflow-tooltip sortable prop="drafter">
          </el-table-column>
          <el-table-column :label="$t('applicationDate')" show-overflow-tooltip sortable prop="reqdate">
            <template slot-scope="scope">
              <span>{{scope.row.reqdate | formatDateTime}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('state')" show-overflow-tooltip sortable prop="status">
          </el-table-column>
          <el-table-column :label="$t('processName')" show-overflow-tooltip sortable prop="processnamecn">
          </el-table-column>
          <el-table-column :label="$t('operation')" width="80">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="$t('activation')" placement="top">
                <el-button type="primary" @click="handleActivate(scope.row)">
                  {{ $t('activation') }}
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-pagination style="margin-top: 15px" :page-size="page.pageSize" :current-page.sync="page.pageNum" background
      :total="content.total" @current-change="searchType === 'power' ? getData() : quickQueryData()" />
  </el-card>
</template>

<script>
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import {
  activate,
  query
} from '../../../../api/process/administrativeTool/processActive'

export default {
  components: {
    QuickQuery
  },
  mixins: [SearchListMixin],
  data () {
    return {
      isPowerSearch: false,
      headers: [
        {
          key: 'reqno',
          name: this.$t('applicationNumber'),
          span: 4
        },
        {
          key: 'subject',
          name: this.$t('subject'),
          span: 4
        },
        {
          key: 'drafter',
          name: this.$t('applicant'),
          span: 4
        },
        {
          key: 'status',
          name: this.$t('state'),
          span: 4
        },
        {
          key: 'processnamecn',
          name: this.$t('processName'),
          span: 4
        },
        {
          name: this.$t('operation'),
          span: 4
        }
      ],
      quickSearchFilters: [
        {
          'key': 'reqno',
          'opt': 'LIKE',
          'type': 'S',
          'value': ''
        },
        {
          'key': 'subject',
          'opt': 'LIKE',
          'type': 'S',
          'value': ''
        },
        {
          'key': 'drafter',
          'opt': 'LIKE',
          'type': 'S',
          'value': ''
        },
        {
          'key': 'processnamecn',
          'opt': 'LIKE',
          'type': 'S',
          'value': ''
        },
        {
          'key': 'status',
          'opt': 'LIKE',
          'type': 'S',
          'value': ''
        }
      ]
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    handleActivate (item) {
      this.$confirm(this.$t('hintText.areYouSureYouWantActivate'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          activate({ instid: item.instid, processNodeName: 'Start' }).then(rt => {
            if (rt.status === '200') {
              this.$message({
                message: this.$t('hintText.processActivatedSuccessfully'),
                type: 'success'
              })
              this.getData()
            } else {
              this.$message({
                message: this.$t('hintText.processActivationFailed'),
                type: 'error'
              })
            }
          })
        })
        .catch(_ => { })
    },
    getData () {
      this.loading = true
      query({
        orderby: 'reqdate',
        sort: 'desc',
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
    quickQueryData () {
      this.loading = true
      for (let i = 0; i < this.quickSearchFilters.length; i++) {
        this.quickSearchFilters[i].value = this.quickData.searchData
      }

      query({
        logic: 'or',
        filters: this.quickSearchFilters,
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
.w100 {
  width: 100%;
}
</style>
