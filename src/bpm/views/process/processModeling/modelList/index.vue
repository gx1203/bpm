<template>
  <el-card shadow="never" v-loading="loading">
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <quick-query :isDate="false" ref="quick" :placeholder="$t('name2')" @quickSearch="quickSearchPage" />
      </div>
      <div class="btn-wrap">
        <!--<el-button type="primary" @click="isPowerSearch = !isPowerSearch">-->
        <!--{{ $t('advancedQuery') }}-->
        <!--<i :class="isPowerSearch?'el-icon-caret-top':'el-icon-caret-bottom'" />-->
        <!--</el-button>-->
        <el-button type="primary" @click="addList('新增')">
          {{ $t('add2') }}
          <!---->
        </el-button>
        <el-button type="primary" @click="addExcel">
          {{ $t('import') }}
          <!--<i class="el-icon-document-add" />-->
        </el-button>
        <el-button type="primary" :disabled="selections.length == 0" @click="getAllExcel">
          {{ $t('batchExport') }}
          <!--<i class="el-icon-document-remove" />-->
        </el-button>
        <el-button type="primary" @click="rest">
          {{ $t('refresh') }}
          <!---->
        </el-button>
      </div>
    </div>
    <!--<el-form-->
    <!--class="power-search"-->
    <!--:model="searchForm"-->
    <!--@keyup.enter.native="powerSearch"-->
    <!--ref="searchForm"-->
    <!--label-width="120px"-->
    <!--size="mini"-->
    <!--v-if="isPowerSearch"-->
    <!--&gt;-->
    <!--<el-row>-->
    <!--<el-col :span="8">-->
    <!--<el-form-item :label="$t('coding') + '：'">-->
    <!--<el-input clearable type="text" v-model="searchForm.key"></el-input>-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--<el-col :span="8">-->
    <!--<el-form-item :label="$t('name2') + '：'">-->
    <!--<el-input clearable type="text" v-model="searchForm.name"></el-input>-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--<el-col :span="8">-->
    <!--<el-form-item label="创建时间：">-->
      <!--<el-date-picker-->
        <!--v-model="searchForm.createOn"-->
        <!--type="date"-->
        <!--value-format="yyyy-MM-dd"-->
        <!--placeholder="选择创建时间">-->
      <!--</el-date-picker>-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <!--<el-row>-->
    <!--<el-col :span="8">-->
    <!--<el-form-item :label="$t('changeTheTime') + '：'">-->
      <!--<el-date-picker-->
        <!--v-model="searchForm.updateOn"-->
        <!--type="date"-->
        <!--value-format="yyyy-MM-dd"-->
        <!--placeholder="选择修改时间">-->
      <!--</el-date-picker>-->
    <!--</el-form-item>-->
    <!--</el-col>-->
      <!--<el-col :span="8">-->
        <!--<el-form-item label="部署ID：">-->
          <!--<el-input clearable type="text" v-model="searchForm.id"></el-input>-->
        <!--</el-form-item>-->
      <!--</el-col>-->
    <!--</el-row>-->
    <!--<el-row>-->
    <!--<el-col :span="24" class="text-r">-->
    <!--<el-button type="primary" @click="powerSearch">查询</el-button>-->
    <!--<el-button type="primary" @click="rest">重置</el-button>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <!--</el-form>-->
    <div v-if="$store.state.app.tableStyle ==='default'">
      <div class="table-header margin-t10">
        <el-checkbox v-model="checkAll" class="all-check" />
        <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort" />
      </div>
      <div v-if="content.list && content.list.length!==0">
        <div class="tr" v-for="(item, index) in content.list" :key="index">
          <div class="tr-title">
            <el-checkbox v-model="item.checked" style="margin-right: 10px" />
            <!-- <span>{{ $t('applicationDate') }}：{{item.createDate | formatDateTime}}</span> -->
            <!-- <span style="margin-left: 60px">申请单号：{{item.reqNo}}</span> -->
          </div>
          <el-row class="tr-body" type="flex" align="middle">
            <el-col class="td" :span="headers[0].span"><p :title="item.id">{{item.id}}</p></el-col>
            <el-col class="td" :span="headers[1].span"><p :title="item.name">{{item.name}}</p></el-col>
            <el-col class="td" :span="headers[2].span"><p :title="item.createOn | formatDateTimess">{{item.createOn | formatDateTimess}}</p></el-col>
            <el-col class="td" :span="headers[3].span"><p :title="item.updateOn | formatDateTimess">{{item.updateOn | formatDateTimess}}</p></el-col>
            <el-col class="td" :span="headers[4].span"><p :title="item.deploymentId">{{item.deploymentId}}</p></el-col>
            <el-col style="text-align: center" :span="headers[5].span">
              <el-button type="text" @click="addList('编辑', item)">{{ $t('edit') }}</el-button>
              <el-button type="text" @click="deleteList(item.id)">{{ $t('delete') }}</el-button>
              <el-button type="text" @click="release(item.id)">{{ $t('publish') }}</el-button>
              <el-button type="text" @click="getModelExport(item.id,item.name)">{{ $t('export') }}</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-else class="text-c pad-10px tr-empty"> {{ $t('noData') }}</div>
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
        <el-table-column :label="$t('coding')" show-overflow-tooltip sortable prop="id">
        </el-table-column>
        <el-table-column :label="$t('name2')" show-overflow-tooltip sortable prop="name">
        </el-table-column>
        <el-table-column :label="$t('createTime')" show-overflow-tooltip sortable prop="createOn">
          <template slot-scope="scope">
            <span>{{scope.row.createOn | formatDateTimess}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('changeTheTime')" show-overflow-tooltip sortable prop="updateOn">
          <template slot-scope="scope">
            <span>{{scope.row.updateOn | formatDateTimess}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('deploymentID')" show-overflow-tooltip prop="deploymentId">
        </el-table-column>
        <el-table-column :label="$t('operation')" width="180">
          <template slot-scope="scope">
            <el-button type="text" @click="addList('编辑', scope.row)">{{ $t('edit') }}</el-button>
            <el-button type="text" @click="deleteList(scope.row.id)">{{ $t('delete') }}</el-button>
            <el-button type="text" @click="release(scope.row.id)">{{ $t('publish') }}</el-button>
            <el-button type="text" @click="getModelExport(scope.row.id,scope.row.name)">{{ $t('export') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      style="margin-top: 15px"
      :page-size="page.pageSize"
      :current-page.sync="page.pageNum"
      background
      @current-change="searchType === 'power' ? getData() : quickSearch()"
      :total="content.total"
    ></el-pagination>
    <addModelList v-model="dialogVisible" @confirm="handleSuccessExport" />
  </el-card>
</template>
<script>
import addModelList from './addModelDialog.vue'
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import {
  getModelList,
  deleteModelList,
  outRelease,
  getModelExcel,
  getAllModelExcel
} from '@/bpm/api/process/processModeling/modelList'
// import JSZip from 'jszip'
// import fileSaver from 'file-saver'
import axios from 'axios'

export default {
  name:'modelList',
  mixins: [SearchListMixin],
  components: {
    addModelList,
    QuickQuery
  },
  data () {
    return {
      dialogVisible: false,
      isPowerSearch: false,
      linkTitle: '',
      editItem: {},
      headers: [
        {
          key: 'id',
          name: this.$t('coding'),
          span: 4
        },
        {
          key: 'name',
          name: this.$t('name2'),
          span: 4
        },
        {
          key: 'createOn',
          name: this.$t('createTime'),
          span: 4
        },
        {
          key: 'updateOn',
          name: this.$t('changeTheTime'),
          span: 4
        },
        {
          name: this.$t('deploymentID'),
          span: 4
        },
        {
          name: this.$t('operation'),
          span: 4
        }
      ],
      selections: [],
      checkAll: '',
      loading: false,
      name: ''
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
    },
    name (val) {
      if (!val) {
        this.searchType = 'quick'
      }
    }
  },
  mounted () {
    this.searchType = 'power'
    if(this.$route.query.processNamecn){
        this.filters = [{
            key: 'name',
            opt: 'LIKE',
            type: 'S',
            value: this.$route.query.processNamecn
        }]
    }else{
      this.filters = []
    }
    this.getData()
  },
  methods: {
    getData () {
      this.loading = true
      this.checkAll = false
      if (JSON.stringify(this.sort) === '{}') {
        var data = {
          attr: {},
          logic: 'and',
          filters: this.filters,
          sort: 'desc',
          orderby: 'updateOn',
          ...this.page
        }
      } else {
        var data = {
          attr: {},
          logic: 'and',
          filters: this.filters,
          ...this.sort,
          ...this.page
        }
      }
      getModelList(data)
        .then(rt => {
          rt.data.list.forEach(item => {
            item.checked = false
            item.createOn = parseInt(item.createOn)
            item.updateOn = parseInt(item.updateOn)
          })
          this.content = rt.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    quickSearchPage(data){
      this.page.pageNum = 1
      this.quickSearch(data)
    },
    quickSearch (val) {
      this.searchType = 'quick'
      if (val) {
        this.name = val.searchData
      }
      this.loading = true
      this.checkAll = false
      this.filters = []
      if (this.name) {
        var data = {
          attr: {},
          logic: 'and',
          filters: [{
            key: 'name',
            opt: 'LIKE',
            type: 'S',
            value: this.name
          }],
          ...this.sort,
          ...this.page
        }
      } else {
        if (JSON.stringify(this.sort) === '{}') {
          var data = {
            attr: {},
            logic: 'and',
            filters: [],
            sort: 'desc',
            orderby: 'updateOn',
            ...this.page
          }
        } else {
          var data = {
            attr: {},
            logic: 'and',
            filters: [],
            ...this.sort,
            ...this.page
          }
        }
      }
      getModelList(data)
        .then(rt => {
          rt.data.list.forEach(item => {
            item.checked = false
            item.createOn = parseInt(item.createOn)
            item.updateOn = parseInt(item.updateOn)
          })
          this.content = rt.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    addExcel () {
      this.dialogVisible = true
    },
    addList (type, item) {
      if (type === '新增') {
        let data = '..'+localStorage.getItem('baseURL') +'/modeler.html?modelId=-1'
        window.open(data, '_blank')
      } else if (type === '编辑') {
        let data1 = '..'+localStorage.getItem('baseURL') +'/modeler.html?modelId=' + item.id
        window.open(data1, '_blank')
      }
    },
    deleteList (id) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          deleteModelList(id).then(rt => {
            if (rt.status === '200') {
              this.getData()
              // if (this.searchType === 'power') {
              //   this.getData()
              // } else if (this.searchType === 'quick') {
              //   this.quickQueryData()
              // }
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
    release (id) {
      this.$confirm(this.$t('hintText.areYouSureYouWantToRelease'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          outRelease(id).then(rt => {
            if (rt.status === '200') {
              this.getData()
              // if (this.searchType === 'power') {
              //   this.getData()
              // } else if (this.searchType === 'quick') {
              //   this.quickQueryData()
              // }
              this.$message({
                message: this.$t('hintText.releaseSuccess'),
                type: 'success'
              })
            } else {
              this.$message({
                message: this.$t('hintText.publishFailed'),
                type: 'error'
              })
            }
          })
        })
        .catch(_ => {})
    },
    getModelExport (id, name) {
      this.loading = true
      getModelExcel(id).then(rt => {
        var blob = new Blob([rt], {type: 'application/xml'})
        var downLoadXml = document.createElement('a')
        downLoadXml.download = name
        var href = window.URL.createObjectURL(blob)
        downLoadXml.href = href
        downLoadXml.click()
        window.URL.revokeObjectURL(href)
        this.loading = false
      }).catch(e => {
        console.log(e)
        this.loading = false
      })
    },
    reset () {
      this.page.pageNum = 1
      if (this.searchType === 'power') {
        this.filters = []
        this.getData()
      } else if (this.searchType === 'quick') {
        this.quickSearch()
      }
    },
    handleSuccessExport (val) {
      if (!val) {
        this.getData()
      }
    },
    getAllExcel () {
      let list = this.selections.map(item => item.id).join(',')
      this.loading = true
      getAllModelExcel(list).then(rt => {
        var blob = new Blob([rt], {type: 'application/zip'})
        var downLoadXml = document.createElement('a')
        downLoadXml.download = name
        var href = window.URL.createObjectURL(blob)
        downLoadXml.href = href
        downLoadXml.click()
        window.URL.revokeObjectURL(href)
        this.loading = false
      }).catch(e => {
        console.log(e)
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
