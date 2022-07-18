<template>
  <el-card shadow="never">
    <div class="tool-common-wrap">
      <div class="btn-wrap">
        <el-button type="primary" @click="addList($t('addProjectLink'))">
          {{ $t('add') }}
          <!---->
        </el-button>
        <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
          {{ $t('advancedQuery') }}
          <i :class="isPowerSearch?'el-icon-caret-top':'el-icon-caret-bottom'" />
        </el-button>
        <el-button type="primary" @click="getData">
           {{ $t('refresh') }}
          <!---->
        </el-button>
      </div>
    </div>
    <el-form
      class="power-search"
      :model="searchForm"
      @keyup.enter.native="search"
      ref="searchForm"
      label-width="120px"
      size="mini"
      v-if="isPowerSearch"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('projectName2') + '：'">
            <el-input clearable type="text" v-model="searchForm.project_Type_Code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('projectDisplayName') + '：'">
            <el-input clearable type="text" v-model="searchForm.project_Type_Name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="text-r">
          <el-button type="primary" @click="search">
            {{ $t('query') }}
          </el-button>
          <el-button type="primary" @click="reset">
            {{ $t('reset') }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <div id="out-table" v-loading="loading">
      <div v-if="$store.state.app.tableStyle ==='default'">
        <div class="table-header margin-t10">
          <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort" />
        </div>
        <div v-if="content.list && content.list.length!==0">

        <div class="tr" v-for="(item, index) in content.list" :key="index">
          <div class="tr-title">
            &nbsp;
          </div>
          <el-row class="tr-body" type="flex" align="middle">
            <el-col class="td" :span="headers[0].span">{{item.projectTypeCode}}</el-col>
            <el-col class="td" :span="headers[1].span">{{item.projectTypeName}}</el-col>
            <el-col style="text-align: center" :span="headers[2].span">
              <el-tooltip class="item" effect="dark" :content="$t('editProjectLink')" placement="top">
                <el-button type="text" @click="addList($t('editProjectLink'),item)">{{ $t('editProjectLink') }}</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
                <el-button type="text" @click="deleteList(item)">{{ $t('delete') }}</el-button>
              </el-tooltip>
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
          <el-table-column :label="$t('projectName2')" show-overflow-tooltip sortable prop="projectTypeCode">
            <template slot-scope="scope">
              <div>{{scope.row.projectTypeCode}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('projectDisplayName')" show-overflow-tooltip sortable prop="projectTypeName">
            <template slot-scope="scope">
              <div>{{scope.row.projectTypeName}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('operation')"  width="150">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="$t('editProjectLink')" placement="top">
                <el-button type="text" @click="addList($t('editProjectLink'),scope.row)">{{ $t('editProjectLink') }}</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
                <el-button type="text" @click="deleteList(scope.row)">{{ $t('delete') }}</el-button>
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
      @current-change="getData"
      :total="content.total"
    ></el-pagination>
    <link-configuration-dialog
      v-model="dialogVisible"
      :item="editItem"
      :title="linkTitle"
      @confirm="saveSuccess"
    />
  </el-card>
</template>

<script>
import LinkConfigurationDialog from './LinkConfigurationDialog'
import {
  getlinkProjectList,
  deleteLinkProject
} from '@/bpm/api/configManage/link/link_configuration.js'
export default {
  name:'projectLinkConfiguration',
  components: {
    LinkConfigurationDialog
  },
  inject: ['reload'],
  data () {
    return {
      dialogVisible: false,
      loading: false,
      filters: [],
      isPowerSearch: false,
      searchForm: {},
      linkTitle: '',
      editItem: {},
      headers: [
        {
          key: 'projectTypeCode',
          name: this.$t('projectName2'),
          span: 10
        },
        {
          key: 'projectTypeName',
          name: this.$t('projectDisplayName'),
          span: 10
        },
        {
          name: this.$t('operation'),
          span: 4
        }
      ],
      content: {
        list: []
      },
      page: {
        pageNum: 1,
        pageSize: 10
      },
      selections: [],
      checkAll: ''
    }
  },
  mounted () {
    this.getData()
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
  methods: {
    deleteList (item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          deleteLinkProject(item.id).then(rt => {
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
        })
        .catch(_ => {})
    },
    reset () {
      this.searchForm = {}
      this.search()
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
        this.filters.push(filter)
      })
      this.getData()
    },
    addList (item, data) {
      this.linkTitle = item
      this.editItem ={}
      if (item === this.$t('addProjectLink')) {
        this.editItem = {
          linkProjectLinkList: []
        }
      } else if (item === this.$t('editProjectLink')) {
        this.editItem = JSON.parse(JSON.stringify(data))
      }
      this.dialogVisible = true
    },
    saveSuccess (data) {
      if (data) {
        this.getData()
      }
    },
    getData () {
      this.loading = true
      this.checkAll = false
      getlinkProjectList({
        logic: 'and',
        filters: this.filters,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          if (rt.status === '200') {
            rt.data.list.forEach(item => {
              item.checked = false
            })
            this.content = rt.data
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleSort (val) {
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
