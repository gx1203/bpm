<template>
  <el-card shadow="never" v-loading="loading">
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <quick-query :placeholder="$t('name2')" :isDate="false" ref="quick" @quickSearch="quickSearchPage" />
      </div>
      <div class="btn-wrap">
        <!--<el-button type="primary" @click="isPowerSearch = !isPowerSearch">-->
        <!--{{ $t('advancedQuery') }}-->
        <!--<i :class="isPowerSearch?'el-icon-caret-top':'el-icon-caret-bottom'" />-->
        <!--</el-button>-->
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
    <!--<el-form-item :label="$t('numbering') + '：'">-->
    <!--<el-input clearable type="text" v-model="searchForm.deploymetId"></el-input>-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--<el-col :span="8">-->
    <!--<el-form-item :label="$t('name2') + '：'">-->
    <!--<el-input clearable type="text" v-model="searchForm.name"></el-input>-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--<el-col :span="8">-->
    <!--<el-form-item label="部署时间：">-->
      <!--<el-date-picker-->
        <!--v-model="searchForm.deploymetDate"-->
        <!--type="date"-->
        <!--value-format="yyyy-MM-dd"-->
        <!--placeholder="选择部署时间">-->
      <!--</el-date-picker>-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <!--<el-row>-->
    <!--<el-col :span="8">-->
    <!--<el-form-item label="分类：">-->
    <!--<el-input clearable type="text" v-model="searchForm.version"></el-input>-->
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
    <div class="table-header margin-t10">
      <!--<el-checkbox v-model="checkAll" class="all-check" />-->
      <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort" />
    </div>
      <div v-if="content.list && content.list.length!==0">

    <div class="tr" v-for="(item, index) in content.list" :key="index">
      <div class="tr-title">
        <!--<el-checkbox v-model="item.checked" style="margin-right: 10px" />-->
      </div>
      <el-row class="tr-body" type="flex" align="middle">
        <el-col class="td" :span="headers[0].span"><p :title="item.id">{{item.id}}</p></el-col>
        <el-col class="td" :span="headers[1].span"><p :title="item.name">{{item.name}}</p></el-col>
        <el-col class="td" :span="headers[2].span"><p :title="item.deploymentTime | formatDateTimess">{{item.deploymentTime | formatDateTimess}}</p></el-col>
        <el-col class="td" :span="headers[3].span"><p :title="item.category">{{item.category}}</p></el-col>
        <el-col style="text-align: center" :span="headers[4].span">
          <el-button type="text" @click="deleteDeployed(item.id)">删除</el-button>
          <!--<el-button type="text" @click="seeList(item.deploymetId)">查看资源</el-button>-->
        </el-col>
      </el-row>
    </div>
    </div>
    <div v-else class="text-c pad-10px tr-empty"> {{ $t('noData') }}</div>

    <el-pagination
      style="margin-top: 15px"
      :page-size="page.pageSize"
      :current-page.sync="page.pageNum"
      background
      @current-change="searchType === 'power' ? getData() : quickSearch()"
      :total="content.total"
    ></el-pagination>
  </el-card>
</template>
<script>
import {
  getDeployedList,
  deleteDeployedList
} from '@/bpm/api/process/processModeling/deployed_manifest'
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
export default {
  name:'deployedManifest',
  mixins: [SearchListMixin],
  components: {
    QuickQuery
  },
  data () {
    return {
      loading: false,
      dialogVisible: false,
      isPowerSearch: false,
      linkTitle: '',
      editItem: {},
      headers: [
        {
          key: 'id',
          name: '编号',
          span: 6
        },
        {
          key: 'name',
          name: this.$t('name2'),
          span: 4
        },
        {
          key: 'deploymentTime',
          name: '部署时间',
          span: 4
        },
        {
          key: 'category',
          name: '分类',
          span: 4
        },
        {
          name: this.$t('operation'),
          span: 6
        }
      ],
      selections: [],
      checkAll: '',
      name: ''
    }
  },
  watch: {
  //   'content.list': {
  //     handler (val) {
  //       if (this.content.list && this.content.list.length !== 0) {
  //         this.checkAll = true
  //         this.selections = []
  //         for (let i = 0; i < this.content.list.length; i++) {
  //           if (!this.content.list[i].checked) {
  //             this.checkAll = false
  //           } else {
  //             this.selections.push(this.content.list[i])
  //           }
  //         }
  //       }
  //     },
  //     deep: true
  //   },
  //   checkAll (val) {
  //     if (this.content.list) {
  //       if (val) {
  //         this.content.list.forEach(item => {
  //           item.checked = val
  //         })
  //       } else if (this.selections.length === this.content.list.length) {
  //         this.content.list.forEach(item => {
  //           item.checked = val
  //         })
  //       }
  //     }
  //   }
    name (val) {
      if (!val) {
        this.searchType = 'quick'
      }
    }
  },
  mounted () {
    this.searchType = 'power'
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
          orderby: 'deploymentTime',
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
      getDeployedList(data)
        .then(rt => {
          rt.data.list.forEach(item => {
            item.checked = false
            item.deploymetDate = Number(item.deploymetDate)
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
            orderby: 'deploymentTime',
            sort: 'desc',
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
      getDeployedList(data)
        .then(rt => {
          rt.data.list.forEach(item => {
            item.checked = false
            item.deploymetDate = parseInt(item.deploymetDate)
          })
          this.content = rt.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    deleteDeployed (id) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          deleteDeployedList(id).then(rt => {
            console.log(rt)
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
    reset() {
      this.page.pageNum = 1
      if (this.searchType === 'power') {
        this.filters = []
        this.getData()
      } else if (this.searchType === 'quick') {
        this.quickSearch()
      }
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
