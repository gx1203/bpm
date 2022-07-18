<template>
  <el-card shadow="never" class="card-reset-inner">
    <div class="item-left">
      <el-tree
        class="elTree"
        :data="tree"
        style="height:calc(100% - 28px);overflow: auto;"
        :props="props"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
      />
    </div>
    <div v-if="treeData.id" v-loading="loading" class="item-right">
      <el-card shadow="never" class="card-reset-inner">
        <div class="tool-common-wrap">
          <div class="search-wrap">
            <quick-query
              ref="quick"
              :placeholder="$t('placeholderText.multipleFieldsPlaceholder33')"
              :is-date="false"
              @quickSearch="quickSearch"
            />
          </div>
          <div class="btn-wrap">
            <el-button type="primary" :disabled="selections.length === 0" @click="handleDel('all')">
              {{ $t('batchAllocation') }}
              <i class="el-icon-folder-checked" />
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
              <el-form-item :label="$t('processName') + '：'">
                <el-input v-model="searchForm.processname" clearable type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('processChineseName') + '：'">
                <el-input v-model="searchForm.processnamecn" clearable type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('state') + '：'">
                <el-select v-model="searchForm.isConfig" clearable :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
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
        <div v-if="$store.state.app.tableStyle ==='default'">
          <div class="table-header margin-t10">
            <el-checkbox v-model="checkAll" class="all-check" />
            <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort" />
          </div>
          <div v-if="content.list && content.list.length!==0">
            <div v-for="(item, index) in content.list" :key="index" class="tr">
              <div class="tr-title">
                <el-checkbox
                  v-model="item.checked"
                  :disabled="item.isConfig === 'Y'"
                  style="margin-right: 10px"
                />
              </div>
              <el-row class="tr-body" type="flex" align="middle">
                <el-col
                  class="td textHide"
                  :span="headers[0].span"
                  :title="item.processId"
                >
                  {{ item.processId }}
                </el-col>
                <el-col
                  class="td textHide"
                  :span="headers[1].span"
                  :title="item.processname"
                >
                  {{ item.processname }}
                </el-col>
                <el-col
                  class="td textHide"
                  :span="headers[2].span"
                  :title="item.processnamecn"
                >
                  {{ item.processnamecn }}
                </el-col>
                <el-col
                  class="td textHide"
                  :span="headers[3].span"
                >
                  {{ item.isConfig === 'Y' ? $t('allocated') : $t('unassigned') }}
                </el-col>
                <el-col style="text-align: center" :span="headers[4].span">
                  <el-tooltip v-if="item.isConfig === 'Y'" class="item" effect="dark" :content="$t('cancelDistribution')">
                    <el-button type="text" @click="handleDeleteOne(item)">{{ $t('cancelDistribution') }}</el-button>
                  </el-tooltip>
                  <el-tooltip v-else class="item" effect="dark" :content="$t('distribution')">
                    <el-button
                      type="text"
                      @click="handleDel('one',item)"
                    >{{ $t('distribution') }}</el-button>
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
                <el-checkbox v-model="scope.row.checked" :disabled="scope.row.isConfig === 'Y'" />
              </template>
              <template slot="header">
                <el-checkbox v-model="checkAll" />
              </template>
            </el-table-column>
            <el-table-column label="ID" show-overflow-tooltip prop="processId">
            </el-table-column>
            <el-table-column :label="$t('processName')" show-overflow-tooltip sortable prop="processname">
            </el-table-column>
            <el-table-column :label="$t('processChineseName')" show-overflow-tooltip sortable prop="processnamecn">
            </el-table-column>
            <el-table-column :label="$t('state')" show-overflow-tooltip prop="isConfig">
              <template slot-scope="scope">
                <span>{{ scope.row.isConfig === 'Y' ? $t('allocated') : $t('unassigned') }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('operation')" width="120">
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.isConfig === 'Y'" class="item" effect="dark" :content="$t('cancelDistribution')">
                  <el-button type="text" @click="handleDeleteOne(scope.row)">{{ $t('cancelDistribution') }}</el-button>
                </el-tooltip>
                <el-tooltip v-else class="item" effect="dark" :content="$t('distribution')">
                  <el-button
                    type="text"
                    @click="handleDel('one',scope.row)"
                  >{{ $t('distribution') }}</el-button>
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
      </el-card>
    </div>
  </el-card>
</template>

<script>
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import {
  getAllRole,
  getProcessRole,
  delProcessRole,
  saveRoleToProcess
} from '@/bpm/api/process/administrativeTool/processRolePermissions.js'
export default {
  name: 'RoleProcessPermissions',
  components: {
    QuickQuery
  },
  mixins: [SearchListMixin],
  data() {
    return {
      loading: false,
      isPowerSearch: false,
      treeData: {},
      options: [
        {
          value: 'Y',
          label: this.$t('allocated')
        },
        {
          value: 'N',
          label: this.$t('unassigned')
        }
      ],
      headers: [
        {
          name: 'ID',
          span: 5
        },
        {
          key: 'processname',
          name: this.$t('processName'),
          span: 5
        },
        {
          key: 'processnamecn',
          name: this.$t('processChineseName'),
          span: 5
        },
        {
          name: this.$t('state'),
          span: 5
        },
        {
          name: this.$t('operation'),
          span: 4
        }
      ],
      selections: [],
      checkAll: '',
      tree: [],
      props: {
        label: 'name'
      }
    }
  },
  watch: {
    'content.list': {
      handler(val) {
        const newArr = this.content.list.filter(x => x.isConfig !== 'Y')
        if (
          this.content.list &&
          this.content.list.length !== 0 &&
          newArr.length > 0
        ) {
          this.checkAll = true
          this.selections = []
          for (let i = 0; i < newArr.length; i++) {
            if (!newArr[i].checked) {
              this.checkAll = false
            } else {
              this.selections.push(newArr[i])
            }
          }
        }
      },
      deep: true
    },
    checkAll(val) {
      if (this.content.list) {
        const newArr = this.content.list.filter(x => x.isConfig !== 'Y')
        if (val) {
          this.content.list.forEach(item => {
            if (item.isConfig !== 'Y') {
              item.checked = val
            }
          })
        } else if (this.selections.length === newArr.length) {
          this.content.list.forEach(item => {
            if (item.isConfig !== 'Y') {
              item.checked = val
            }
          })
        }
      }
    }
  },
  mounted() {
    this.getRole()
  },
  methods: {
    getRole() {
      getAllRole().then(rt => {
        if (rt.status === '200') {
          this.tree = rt.data
        }
      })
    },
    handleDeleteOne(item) {
      this.loading = true
      delProcessRole(this.treeData.id, item.processId)
        .then(rt => {
          this.loading = false
          if (rt.status === '200') {
            this.$message.success(this.$t('hintText.cancelDistributionOfSuccess'))
            this.getData()
          }
        })
        .catch(er => {
          this.loading = false
        })
    },
    handleDel(type, item) {
      let ids = []
      if (type === 'all') {
        ids = this.selections.map(x => {
          return { processId: x.processId }
        })
      } else {
        ids = [{ 'processId': item.processId }]
      }
      this.loading = true
      saveRoleToProcess({
        processId: ids,
        roleId: this.treeData.id
      })
        .then(rt => {
          this.loading = false
          if (rt.status === '200') {
            this.$message.success(this.$t('hintText.distributionOfSuccess'))
            this.getData()
            this.checkAll = false
          }
        })
        .catch(er => {
          this.loading = false
        })
    },
    quickQueryData() {
      this.loading = true
      this.checkAll = false

      getProcessRole({
        logic: 'or',
        roleId: this.treeData.id,
        filters: this.filters,
        queryFilter: ['processId', 'processname', 'processnamecn'],
        ...this.quickData,
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
    saveSuccess(data) {
      if (data) {
        this.getData()
      }
    },
    getData() {
      this.loading = true
      getProcessRole({
        roleId: this.treeData.id,
        logic: 'and',
        filters: this.filters,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          rt.data.list.forEach(element => {
            element.checked = false
          })
          this.content = rt.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleNodeClick(data) {
      this.treeData = data
      this.filters = []
      this.sort = {}
      this.getData()
    }
  }
}
</script>
<style lang="scss" scoped>
.card-reset-inner {
  ::v-deep > .el-card__body {
    padding: 10px 0 0 0 !important;
    display: flex;
  }
}

.item-left {
  width: 250px;
  height: 100%;
  margin-right: 20px;
}
.item-right {
  flex: 1;
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
  .card-reset-inner {
    ::v-deep > .el-card__body {
      padding: 0 0 0 !important;
      display: block;
    }
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
// .w100 {
//   width: 100%;
// }
.card1 {
  padding: 0 5px 15px 15px;
  background: white;
  overflow: hidden;
  transition-duration: 0.5s;
  box-sizing: border-box;
  height: auto;
  .header {
    margin-right: 10px;
    border-bottom: 1px solid $dc1;
    margin-bottom: 10px;
    display: flex;
    .title {
      height: 35px;
      line-height: 35px;
      color: $tc1;
      font-weight: bold;
    }
    .space {
      flex-grow: 1;
    }
  }
}
</style>
