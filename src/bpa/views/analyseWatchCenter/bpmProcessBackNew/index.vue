<template>
  <div id="database">
    <el-row :gutter="20" class="base-content">
      <el-col :span="5" class="base-col left_tree_wrapper1">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText"
          style="padding: 5px"
        >
        </el-input>
        <el-tree
          class="filter-tree"
          :data="treelist"
          :props="props"
          node-key="id"
          :filter-node-method="filterNode"
          :default-expand-all="defaultExpand"
          :expand-on-click-node="false"
          ref="tree2"
          :key="treeKey"
          @node-click="handleCheckChange"
        >
          <div
            class="custom-tree-node"
            slot-scope="{ node, data }"
            @click="handlerNodeClick(data, node)"
          >
            <p class="grow" :title="node.label">
              <i
                v-if="data.type === '流程'"
                class="fa fa-university fa-2"
                aria-hidden="true"
              ></i>
              <i
                v-if="data.type === '绩效'"
                class="fa fa-star fa-2"
                aria-hidden="true"
              ></i>
              {{ node.label }}
            </p>
          </div>
        </el-tree>
      </el-col>
      <el-col :span="19">
        <el-main class="di__main">
          <el-row>
            <el-col :span="24">
              <el-input
                :placeholder="pleaseEnterTheContent"
                :title="pleaseEnterTheContent"
                class="search_component search_input"
                v-model="keyWords"
                clearable
                @keyup.13.native="quickQueryData"
              >
                <el-button
                  type="primary"
                  slot="append"
                  style="backgroundcolor:transparent"
                  class="search_button"
                  icon="iconfont_search icon-sousuo2"
                  @click="quickQueryData"
                ></el-button>
              </el-input>
              <el-button
                class="high_search"
                style="margin-bottom:5px"
                type="primary"
                @click="isHighSearch = !isHighSearch"
              >
                {{ $t('advancedQuery') }}
                <i
                  :class="
                    isHighSearch ? 'el-icon-caret-top' : 'el-icon-caret-bottom'
                  "
                ></i>
              </el-button>
            </el-col>
          </el-row>
          <el-collapse-transition>
            <!-- 高级搜索表格 -->
            <el-form
              v-show="isHighSearch"
              class="search_options_wrap"
              :model="searchForm"
              label-width="100px"
            >
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-form-item :label="applicationNumber">
                    <el-input clearable v-model="searchForm.reqNo"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="processName2">
                    <el-input
                      clearable
                      v-model="searchForm.processCnname"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="subject">
                    <el-input clearable v-model="searchForm.subject"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-form-item :label="operationTime">
                    <el-date-picker
                      v-model="searchForm.reqDate"
                      type="daterange"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      :default-time="['00:00:00', '23:59:59']"
                      :range-separator="$t('placeholderText.to')"
                      :start-placeholder="$t('placeholderText.startDate')"
                      :end-placeholder="$t('placeholderText.endDate')"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="applicant">
                    <el-input clearable v-model="searchForm.drafter"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="applicationStatus">
                    <el-select
                      clearable
                      type="text"
                      :placeholder="$t('placeholderText.pleaseSelect')"
                      class="w100"
                      v-model="searchForm.status"
                    >
                      <el-option :label="$t('all')" value=""></el-option>
                      <el-option
                        :label="$t('beingProcessed')"
                        value="审批中"
                      ></el-option>
                      <el-option
                        :label="$t('completed')"
                        value="已完成"
                      ></el-option>
                      <el-option :label="$t('pause')" value="暂停"></el-option>
                      <el-option
                        :label="$t('invalid')"
                        value="作废"
                      ></el-option>
                      <el-option
                        :label="$t('terminated')"
                        value="已终止"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-form-item :label="state">
                    <el-select
                      clearable
                      v-model="searchForm.brStatus"
                      :placeholder="$t('placeholderText.pleaseSelect')"
                    >
                      <el-option
                        v-for="item in applicationList"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="search_buttons_wrap">
                <el-button type="primary" @click="searchGetData">{{
                  $t('search')
                }}</el-button>
                <el-button
                  type="primary"
                  @click="
                    searchForm = {}
                    searchGetData()
                  "
                  >{{ $t('reset') }}</el-button
                >
              </div>
            </el-form>
          </el-collapse-transition>
          <div class="showContent">
            <el-table :data="tableData" size="small">
              <el-table-column
                prop="brStatus"
                :label="state"
                align="center"
                width="50"
              >
                <template slot-scope="scope">
                  <div class="parents">
                    <div
                      :class="
                        scope.row.brStatus === '1'
                          ? 'stateRoundGreen'
                          : 'stateRound'
                      "
                    ></div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="reqNo"
                :label="applicationNumber"
                align="center"
                min-width="110"
              ></el-table-column>
              <el-table-column
                prop="processCnname"
                :label="processName2"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="subject"
                show-overflow-tooltip
                :label="subject"
                align="center"
                min-width="200"
              ></el-table-column>
              <el-table-column prop="reqDate" :label="appDate" align="center">
                <template slot-scope="scope">
                  <div>{{ scope.row.reqDate | formatDateTime }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="drafter"
                :label="applicant"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="status"
                :label="examinationAndApprovalStatus"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="operation"
                :label="operation"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    plain
                    size="mini"
                    @click="processNodeView(scope.row)"
                    >{{ $t('view') }}</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              style="margin-top: 15px"
              :page-size="page.pageSize"
              :current-page.sync="page.pageNum"
              background
              @current-change="
                searchType === 'power' ? searchGetData() : quickQueryData()
              "
              :total="pageTotal"
            ></el-pagination>
          </div>
        </el-main>
      </el-col>
    </el-row>
    <node-detail-dialog v-model="dialogVisible" :instanceId="instanceId" />
  </div>
</template>
<script>
import nodeDetailDialog from './nodeDetailDialog.vue'
import '@/bpa/assets/fonts/font_weather/iconfont.css'
import '@/bpa/assets/fonts/font_weather/iconfont.eot'
import '@/bpa/assets/fonts/font_weather/iconfont.ttf'
import '@/bpa/assets/fonts/font_weather/iconfont.svg'
import { getTreeD2Dlist } from '@/bpa/api/diCenter'
import { recoveryOfProcessSearching } from '@/bpa/api/analyseWatchCenter'
// 引入echarts
import echarts from 'echarts'
export default {
  components: {
    nodeDetailDialog
  },
  data() {
    return {
      instanceId: '',
      dialogVisible: false,
      applicationList: [
        { value: '1', text: this.$t('normal') },
        { value: '0', text: this.$t('abnormal') }
      ],
      searchType: 'power',
      filterText: '',
      treeKey: 0,
      treelist: [],
      props: {
        label: 'name',
        children: 'childrenlist',
        isLeaf: function(data, node) {
          if (data.isparent === true) {
            return false
          } else {
            return true
          }
        }
      },
      defaultExpand: false,
      nodeId: '',
      ids: '',
      filters: [],
      formList: [],
      page: {
        pageNum: 1,
        pageSize: 10
      },
      pageTotal: 0,
      value: '全部',
      // 表格的数据
      tableData: [],
      // 高级搜索
      isHighSearch: false,
      searchForm: {},
      // 搜索关键词
      keyWords: '',
      pleaseEnterTheContent: this.$t('placeholderText.pleaseEnterTheContent'),
      applicationNumber: this.$t('applicationNumber'),
      processName2: this.$t('processName2'),
      subject: this.$t('subject'),
      operationTime: this.$t('operationTime'),
      startDate: this.$t('placeholderText.startDate'),
      endDate: this.$t('placeholderText.endDate'),
      applicant: this.$t('applicant'),
      applicationStatus: this.$t('applicationStatus'),
      state: this.$t('state'),
      appDate: this.$t('appDate'),
      examinationAndApprovalStatus: this.$t('examinationAndApprovalStatus'),
      operation: this.$t('operation')
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  mounted() {
    this.getlist()
  },
  methods: {
    getlist() {
      getTreeD2Dlist().then(res => {
        if (!res) return false
        this.treelist = res
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 快速获取数据
    quickQueryData() {
      if (!this.ids) return false
      this.searchType = 'quick'
      this.loading = true
      let obj = {
        logic: 'or',
        queryFilter: [
          'reqNo',
          'subject',
          'drafter',
          'drafterId',
          'processCnname',
          'status'
        ],
        searchData: this.keyWords,
        filters: this.filters,
        ...this.page
      }
      recoveryOfProcessSearching(this.ids, obj)
        .then(res => {
          if (!res) return false
          this.tableData = res.list
          this.pageTotal = res.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleCheckChange(data) {
      // 获取到选中节点的id
      // let id = this.$refs.tree2.getCurrentKey();
      // this.ids = id;
      this.ids = data.id
      // 调用获取表格数据的接口

      let obj = {
        logic: 'or',
        queryFilter: [
          'reqNo',
          'subject',
          'drafter',
          'drafterId',
          'processCnname',
          'status'
        ],
        filters: this.filters,
        searchData: this.keyWords,
        ...this.page
      }
      recoveryOfProcessSearching(data.id, obj).then(res => {
        if (!res) return false
        this.tableData = res.list
        this.pageTotal = res.total
      })
    },
    searchGetData() {
      if (!this.ids) return false
      this.searchType = 'power'
      this.filters = []
      Object.keys(this.searchForm).forEach(key => {
        const filter = {
          key,
          opt: 'LIKE',
          type: 'S',
          value: this.searchForm[key]
        }
        if (key === 'reqDate') {
          filter.type = 'D'
          filter.opt = 'BETWEEN'
          if (this.searchForm[key] && this.searchForm[key].length !== 0) {
            filter.value = this.searchForm[key]
              ? this.searchForm[key].join('~')
              : null
          } else {
            filter.value = null
          }
        }
        this.filters.push(filter)
      })
      let obj = {
        filters: this.filters,
        logic: 'and',
        pageNum: 1,
        pageSize: 10
      }
      recoveryOfProcessSearching(this.ids, obj)
        .then(res => {
          if (!res) return false
          this.tableData = res.list
          this.pageTotal = res.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    handlerNodeClick(data, node) {
      // this.nodeId = data.id;
      // if (data.type == "流程") {
      //   this.nodeCode = false;
      //   this.updateForm1.name = data.name;
      //   if (node.parent.data) {
      //     this.updateForm1.lastname = node.parent.data.name;
      //   }
      // } else {
      //   this.nodeCode = true;
      //   // this.getList()
      // }
    },
    processNodeView(row) {
      this.instanceId = row.instanceId
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
#database {
  width: 100%;
  background-size: 100% 100%;
  .left_tree_wrapper1 {
    min-height: 70vh;
    max-height: calc(100vh - 160px);
    overflow: auto;
    background: #ffffff;
    .filter-tree {
      margin-top: 20px;
      .custom-tree-node {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        background: #ffffff !important;
        .grow {
          max-width: 100%;
          min-width: 60%;
          overflow: hidden;
          text-overflow: ellipsis;
          padding-right: 70px;
          background: #ffffff !important;
        }
      }
    }
  }
  .di__main {
    .search_input {
      margin-top: 10px;
      .search_button {
        background-color: transparent !important;
      }
    }
    .search_options_wrap {
      background-color: transparent;
    }
    /deep/ .search_component .el-input-group__append {
      background-color: transparent;
    }
    /deep/ .active.el-button--primary.is-plain {
      background-color: #409eff;
      color: #fff;
      border-color: #409eff;
    }
    /deep/.el-pagination button:disabled {
      background-color: transparent;
    }
    /deep/ .el-table {
      color: #fff;
      background-color: transparent;
      thead {
        color: #3141a9;
        font-weight: 700;
      }
      & td,
      & th.is-leaf {
        border-bottom: 1px solid #4d576f;
      }
      & th,
      & tr {
        background-color: transparent;
      }
      &:before {
        background-color: #4d576f;
      }
      & td a {
        color: #fff;
      }
      & td {
        a:hover {
          color: skyblue;
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }
    /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
      background-color: rgba(13, 45, 74, 0.5);
    }
    a,
    a:link,
    a:visited,
    a:hover,
    a:active {
      // color: #333;
      text-decoration: none;
      cursor: pointer;
    }
    .showContent {
      width: 100%;
      height: calc(100vh - 160px);
      .el-button {
        background-color: transparent;
        color: #fff;
      }
      .parents {
        height: 20px;
        position: relative;
        .stateRound {
          width: 10px;
          height: 10px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: red;
          border-radius: 10px;
        }
        .stateRoundGreen {
          width: 10px;
          height: 10px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: green;
          border-radius: 10px;
        }
      }
    }
  }
}
</style>
