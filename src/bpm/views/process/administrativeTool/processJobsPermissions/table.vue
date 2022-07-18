<template>
  <el-card v-loading="loading" shadow="never">
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <quick-query v-show="false" ref="quick" :is-date="false" @quickSearch="quickSearch" />
      </div>
      <div class="btn-wrap">
        <el-button type="primary" @click="fnAdd">
          {{ $t('add') }}
          
        </el-button>
        <el-button type="primary" :disabled="selections.length === 0" @click="handleAllDelete">
          {{ $t('batchDelete') }}
          
        </el-button>
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
          <el-form-item :label="$t('name2') + '：'">
            <el-input v-model="searchForm.showname" clearable type="text" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('type') + '：'">
            <el-select v-model="searchForm.type" clearable :placeholder="$t('placeholderText.pleaseSelect')"
              class="w100">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
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
    <div style="min-height: calc(100vh - 500px);">
      <div v-if="$store.state.app.tableStyle ==='default'">
        <div class="table-header margin-t10">
          <el-checkbox v-model="checkAll" class="all-check" />
          <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort" />
        </div>
        <div v-if="content.list && content.list.length!==0">
          <div v-for="(item, index) in content.list" :key="index" class="tr">
            <div class="tr-title">
              <el-checkbox v-model="item.checked" style="margin-right: 10px" />
            </div>
            <el-row class="tr-body" type="flex" align="middle">
              <el-col class="td textHide" :span="headers[0].span" :title="item.showname">
                {{ item.showname }}
              </el-col>
              <el-col v-if="item.type === '0'" class="td" :span="headers[1].span">
                {{ $t('organization') }}
              </el-col>
              <el-col v-else-if="item.type === '1'" class="td" :span="headers[1].span">
                {{ $t('company') }}
              </el-col>
              <el-col v-else-if="item.type === '2'" class="td" :span="headers[1].span">
                {{ $t('department') }}
              </el-col>
              <el-col v-else-if="item.type === '3'" class="td" :span="headers[1].span">
                {{ $t('post') }}
              </el-col>
              <el-col v-else-if="item.type === '8'" class="td" :span="headers[1].span">
                {{ $t('role') }}
              </el-col>
              <el-col v-else-if="item.type === '9'" class="td" :span="headers[1].span">
                {{ $t('user') }}
              </el-col>
              <el-col style="text-align: center" :span="headers[2].span">
                <el-tooltip class="item" effect="dark" :content="$t('delete')">
                  <el-button type="text" @click="handleDeleteOne(item)">{{ $t('delete') }}</el-button>
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
          <el-table-column width="40">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.checked" />
            </template>
            <template slot="header">
              <el-checkbox v-model="checkAll" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('name2')" show-overflow-tooltip sortable prop="showname">
          </el-table-column>
          <el-table-column :label="$t('type')" show-overflow-tooltip sortable prop="type">
            <template slot-scope="scope">
              <span>{{scope.row.type === '0' ? $t('organization') : scope.row.type === '1' ? $t('company') : scope.row.type === '2' ? $t('department') : scope.row.type === '3' ? $t('post') : scope.row.type === '8' ? $t('role') : scope.row.type === '9' ? $t('user') : scope.row.type === '11' ? $t('processRole') : ''}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('operation')" width="120" align="center">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="$t('delete')">
                <el-button type="text" @click="handleDeleteOne(scope.row)">{{ $t('delete') }}</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-pagination style="margin-top: 15px" :page-size="page.pageSize" :current-page.sync="page.pageNum" background
      :total="content.total" @current-change="searchType === 'power' ? getData() : quickQueryData()" />
    <bas-organieation v-model="organieationShow" :selected-element="selectedElement" :is-specified-group-but="false"
      :is-show-bustom-groups-but="false" :select-element="selectElement" :show-element="showElement" :title="orgtitle"
      :multiple="basOrganieationMultiple" @fnCallBack="fnBasOrganieationCallBack" />
  </el-card>
</template>

<script>
import Vue from 'vue'
import treeProcessFlow from '@/bpm/components/treeProcessFlow'
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import {
  deletePost,
  savePost,
  getPostRole,
  getPermissionByProcessid,
  deleteList
} from '@/bpm/api/process/administrativeTool/processRolePermissions.js'

import BasComponent from 'bas-component'
Vue.use(BasComponent)
import 'bas-component/lib/BasComponent.css'

export default {
  name: 'ProcessJobsPermissionsTable',
  components: {
    treeProcessFlow,
    QuickQuery
  },
  mixins: [SearchListMixin],
  props: {
    treeData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      loading: false,
      isPowerSearch: false,
      num: '',
      options: [
        {
          value: "0",
          label: this.$t('organization')
        },
        {
          value: '1',
          label: this.$t('company')
        },
        {
          value: '2',
          label: this.$t('department')
        },
        {
          value: '3',
          label: this.$t('post')
        },
        {
          value: '8',
          label: this.$t('role')
        },
        {
          value: '9',
          label: this.$t('user')
        },
        {
          value: '11',
          label: this.$t('processRole')
        }
      ],
      headers: [
        {
          key: 'showname',
          name: this.$t('name2'),
          span: 12
        },
        {
          key: 'type',
          name: this.$t('type'),
          span: 4
        },
        {
          name: this.$t('operation'),
          span: 8
        }
      ],
      selections: [],
      isShow: false,
      checkAll: '',
      organieationShow: false,
      selectedElement: {},
      showElement: [
        {
          key: '1',
          name: this.$t('organization')
        },
        {
          key: '8',
          name: this.$t('role')
        },
        {
          key: "11",
          name: this.$t("processRole")
        }
      ],
      selectElement: ['0', '1', '2', '3', '4', '5', '9', '8', '11'],
      orgtitle: this.$t('addOrganizationalStaff'),
      basOrganieationMultiple: true
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
    treeData: {
      handler (val) {
        this.getData()
      },
      deep: true
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    handleDeleteOne (item) {
      this.$confirm(this.$t('hintText.areYouSureDeleteDataPleaseChooseCarefully'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          deletePost(item.id)
            .then(rt => {
              this.loading = false
              if (rt.status === '200') {
                this.$message.success(this.$t('hintText.successfullyDelete'))
                this.getData()
              }
            })
            .catch(er => {
              this.loading = false
            })
        })
        .catch(_ => { })
    },
    handleAllDelete () {
      this.$confirm(this.$t('hintText.areYouSureDeleteDataPleaseChooseCarefully'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          const ids = this.selections.map(x => x.id)
          deleteList(ids)
            .then(rt => {
              this.loading = false
              if (rt.status === '200') {
                this.$message.success(this.$t('hintText.successfullyDelete'))
                this.getData()
              }
            })
            .catch(er => {
              this.loading = false
            })
        })
        .catch(_ => { })
    },
    fnAdd () {
      this.loading = true
      getPermissionByProcessid(
        this.$route.query.id ? this.$route.query.id : this.treeData.id
      )
        .then(rt => {
          this.loading = false
          if (rt.status === '200') {
            if (rt.data) {
              this.selectedElement = rt.data
            } else {
              this.selectedElement = {}
            }
            this.organieationShow = true
          }
        })
        .catch(er => {
          this.loading = false
        })
    },
    fnBasOrganieationCallBack (data) {
      if (data.id.length > 0) {
        const list = []
        const names = data.name.split('&')
        const idTypes = data.idType.split(';')
        for (let i = 0; i < idTypes.length; i++) {
          const idtype = idTypes[i].split('-')
          list.push({
            name: names[i],
            refid: idtype[0],
            type: idtype[1]
          })
        }
        savePost({
          processid: this.$route.query.id
            ? this.$route.query.id
            : this.treeData.id,
          result: list
        })
          .then(rt => {
            if (rt.status === '200') {
              this.organieationShow = false
              this.$message({
                message: this.$t('hintText.addedSuccess'),
                type: 'success'
              })
              this.getData()
            } else {
              this.$message({
                message: this.$t('hintText.failToAdd'),
                type: 'error'
              })
            }
          })
          .catch(() => {
            this.$message({
              message: this.$t('hintText.failToAdd'),
              type: 'error'
            })
          })
      }
    },
    getData () {
      this.loading = true
      this.checkAll = false
      const canshu = [
        {
          key: 'processid',
          opt: 'EQ',
          type: 'S',
          value: this.$route.query.id ? this.$route.query.id : this.treeData.id
        }
      ]
      getPostRole({
        logic: 'and',
        filters: [...this.filters, ...canshu],
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
.w100 {
  width: 100%;
}
</style>
