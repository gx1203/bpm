<template>
  <el-card shadow="never">
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <quick-query :isDate="false" ref="quick" @quickSearch="quickSearch" />
      </div>
      <div class="btn-wrap">
        <el-button type="primary" @click="addList('添加配置模块')">
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
    <el-form
      class="power-search"
      :model="searchForm"
      @keyup.enter.native="powerSearch"
      ref="searchForm"
      label-width="120px"
      size="mini"
      v-if="isPowerSearch"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('name2') + '：'">
            <el-input clearable type="text" v-model="searchForm.reqNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('type') + '：'">
            <el-input clearable type="text" v-model="searchForm.reqNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="SQL：">
            <el-select clearable v-model="searchForm.type" class="w100" :placeholder="$t('placeholderText.pleaseSelect')">
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="URL：">
            <el-input clearable type="text" v-model="searchForm.reqNo"></el-input>
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
    <div v-loading="loading">
      <div class="table-header margin-t10">
        <el-checkbox v-model="checkAll" class="all-check" />
        <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort" />
      </div>
      <div v-if="content.list && content.list.length!==0">

      <div class="tr" v-for="(item, index) in content.list" :key="index">
        <div class="tr-title">
          <el-checkbox v-model="item.checked" style="margin-right: 10px" />
          <!-- <span>{{ $t('applicationDate') }}：{{item.createDate | formatDateTime}}</span> -->
          <!-- <span style="margin-left: 60px">结束时间：{{item.createDate | formatDateTime}}</span>
          <span style="margin-left: 60px">收回时间：{{item.createDate | formatDateTime}}</span>-->
          <!-- <span style="margin-left: 60px">申请单号：{{item.reqNo}}</span> -->
        </div>
        <el-row class="tr-body" type="flex" align="middle">
          <el-col class="td" :span="headers[0].span">{{item.drafter}}</el-col>
          <el-col class="td" :span="headers[1].span">{{item.passReaderUserName}}</el-col>
          <el-col class="td" :span="headers[2].span">{{item.passReaderUserName}}</el-col>
          <el-col class="td" :span="headers[3].span">{{item.passReaderUserName}}</el-col>
          <el-col style="text-align: center" :span="headers[4].span">
            <el-button type="text" icon="el-icon-edit" @click="addList('编辑配置模块', item)"></el-button>
            <el-button type="text" icon="el-icon-delete" @click="handleDeleteOne(item)"></el-button>
          </el-col>
        </el-row>
      </div>
      </div>
      <div v-else class="text-c pad-10px tr-empty"> {{ $t('noData') }}</div>

    </div>
    <el-pagination
      style="margin-top: 15px"

      :page-size="page.pageSize"
      :current-page.sync="page.pageNum"
      background
      @current-change="searchType === 'power' ? getData() : quickQueryData()"
      :total="content.total"
    ></el-pagination>
    <config-module-dialog
      v-model="dialogVisible"
      :item="editItem"
      :title="linkTitle"
      @confirm="saveSuccess"
    />
  </el-card>
</template>
<script>
import configModuleDialog from './configModuleDialog'
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
export default {
  mixins: [SearchListMixin],
  components: {
    configModuleDialog,
    QuickQuery
  },
  data () {
    return {
      typeList: [
        {
          value: '2',
          label: '流程处理'
        },
        {
          value: '3',
          label: '数据权限'
        }
      ],
      isPowerSearch: false,
      dialogVisible: false,
      editItem: {},
      linkTitle: '',
      headers: [
        {
          key: 'drafter',
          name: this.$t('name2'),
          span: 5
        },
        {
          key: 'passReaderUserName',
          name: this.$t('type'),
          span: 5
        },
        {
          key: 'passReaderUserName',
          name: 'SQL',
          span: 5
        },
        {
          key: 'passReaderUserName',
          name: 'URL',
          span: 5
        },
        {
          name: this.$t('operation'),
          span: 4
        }
      ],
      selections: [],
      checkAll: ''
    }
  },
  methods: {
    handleDeleteOne (item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          deleteBusinessGroupType(item.id).then(rt => {
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
    handleAllDelete () {
      this.$confirm(this.$t('hintText.areYouSureDeleteSelectedData'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          batchDeleteBusinessGroupType(
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
    quickQueryData () {
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
    addList (item, data) {
      if (item === '添加配置模块') {
        this.dialogVisible = true
        this.linkTitle = item
        this.editItem = {
          type: '1'
        }
      } else if (item === '编辑配置模块') {
        this.dialogVisible = true
        this.linkTitle = item
        this.editItem = data
      }
    },
    getData () {
      this.loading = true
      this.checkAll = false
      getBusinessGroupTypeList({
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
    saveSuccess (param) {
      if (this.searchType === 'power') {
        this.getData()
      } else if (this.searchType === 'quick') {
        this.quickQueryData()
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
.w100 {
  width: 100%;
}
</style>
