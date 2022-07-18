<template>
  <div id="terminology">
    <el-row :gutter="10">
      <el-col :span="4">
        <el-scrollbar class="left_tree_wrapper">
          <el-tree
            class="filter-tree elTree"
            :props="props"
            node-key="id"
            :data="systemList"
            :default-expanded-keys="[0]"
            :current-node-key="0"
            :expand-on-click-node="false"
            @node-click="nodeClick"
          >
            <div slot-scope="{ node, data }" class="custom-tree-node">
              <p class="grow" :title="node.label">
                {{ node.label }}
              </p>
            </div>
          </el-tree>
        </el-scrollbar>
      </el-col>
      <el-col :span="20">
        <el-row>
          <el-col :span="24">
            <el-input :placeholder="$t('processName2') + '、' + $t('nodeName')"
              :title="$t('processName2') + '、' + $t('nodeName')" class="search_component" v-model="keyWords" clearable @keyup.13.native="search">
              <el-button type="primary"  slot="append" @click="search()"> {{$t('search')}}</el-button>
            </el-input>
            <el-button type="primary" @click="reset" style="float: right; margin-left: 10px;">
              {{ $t('refresh') }}
            </el-button>
            <el-button style="float: right;" @click="isHighSearch = !isHighSearch" type="primary">
              {{ $t("advancedQuery") }}
              <i :class="isHighSearch ? 'el-icon-caret-top' : 'el-icon-caret-bottom'" />
            </el-button>
            <el-button
              style="float: right;"
              type="primary"
              :loading="exportLoading"
              @click="exportFile"
            >导出{{ exportLoading ? '中' : '' }}</el-button>
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
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('processName2')">
                  <el-input v-model="searchForm.processname" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('nodeName')">
                  <el-input v-model="searchForm.nodename" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('nodeDescription')">
                  <el-input v-model="searchForm.description" clearable />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('correlationSystem')">
                  <el-input v-model="searchForm.system" clearable />
                </el-form-item>
              </el-col>
            </el-row>
            <div class="search_buttons_wrap">
              <el-button type="primary" @click="search('high')">{{ $t("search") }}</el-button>
              <el-button type="primary" @click="reset">{{ $t("reset") }}</el-button>
            </div>
          </el-form>
        </el-collapse-transition>
        <el-table :data="terminologyList" class="main_tab" stripe border>
          <el-table-column :label="$t('number')" type="index"></el-table-column>
          <el-table-column prop="processname" :label="$t('processName2')"></el-table-column>
          <el-table-column prop="nodename" :label="$t('nodeName')"></el-table-column>
          <el-table-column prop="description" :label="$t('nodeDescription')"></el-table-column>
          <el-table-column prop="system" :label="$t('correlationSystem')"></el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pages.pageNum"
          :page-size="pages.pageSize" background layout="prev, pager, next, jumper, total" :total="pages.total">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getSystemList, querySystemnodeList } from '@/bpa/api/processModelCenter/terminology'
import paginations from '@/bpa/mixins/pagination_mixin'
import enterTree from '@/bpa/views/settings/wordsManage/components/index.vue'
import axios from "axios";
export default {
  components: {
    enterTree
  },
  data () {
    return {
      props: {
        label: 'name',
        children: 'childList'
      },
      systemList: [
        {
          name: '相关系统',
          id: 0,
          childList: []
        }
      ],
      expandedList: [],
      terminologyList: [],
      isHighSearch: false,
      keyWords: '',
      searchForm: {},
      filters: [],
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      modelname: '',
      exportLoading: false
    }
  },
  mixins: [paginations],
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL;
    }
  },
  mounted () {
    this.getList()
    this.getFilterTreeList()
  },
  methods: {
    exportFile() {
      this.exportLoading = true;
      axios({
        method: "post",
        url: `${this.host}/systemnode/exportList`,
        data: {
          fullFilters: [
            {
              filters: [
                { key: 'system', opt: 'EQ', type: 'S', value: this.modelname}
              ],
              logic: 'and'
            },
            {
              filters: this.filters,
              logic: 'and'
            }
          ],
          logic: 'and',
          orderby: 'createon',
          pageNum: 1,
          pageSize: 9999999,
          sort: 'desc'
        },
        responseType: "blob"
      })
        .then(res => {
          this.exportLoading = false;
          const blob = new Blob([res.data], {
            type: "application/vnd.ms-excel"
          });
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // 兼容TMD IE
            navigator.msSaveBlob(blob, "相关系统.xls");
          } else {
            // 其他浏览器
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.style.display = "none";
            link.href = url;
            link.setAttribute("download", "相关系统.xls");
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(link.href);
          }
        })
        .catch(() => {
          this.exportLoading = false;
        });
    },
    getFilterTreeList() {
      getSystemList().then(res => {
        if (!res) return false
        this.systemList[0].childList = res.map(item => {
          return {
            name: item
          }
        })
      })
    },
    nodeClick(data) {
      this.modelname = data.name === '相关系统' ? '' : data.name
      this.getList()
    },
    reset() {
      this.keyWords = ''
      this.searchForm = {}
      this.search('high')
    },
    search(type) {
      if (type === "high") {
        this.filters = [
          {
            key: "processname",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.processname
          },
          {
            key: "nodename",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.nodename
          },
          {
            key: "description",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.description
          },
          {
            key: "system",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.system
          }
        ];
      } else {
        this.filters = [
          { key: 'processname', opt: 'LIKE', type: 'S', value: this.keyWords, logic: 'or' },
          { key: 'nodename', opt: 'LIKE', type: 'S', value: this.keyWords, logic: 'or' }
        ];
      }
      this.getList();
    },
    getList () {
      querySystemnodeList({
        fullFilters: [
          {
            filters: [
              { key: 'system', opt: 'EQ', type: 'S', value: this.modelname}
            ],
            logic: 'and'
          },
          {
            filters: this.filters,
            logic: 'and'
          }
        ],
        logic: 'and',
        orderby: 'createon',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: 'desc'
      }).then(res => {
        if (!res) return false
        this.terminologyList = res.list
        this.pages.total = res.total
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-tree-node>.el-tree-node__children{
  overflow: visible;
}
.custom-tree-node {
  display: flex;
  align-items: center;
  box-sizing: border-box;

  .grow {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 90px;
  }
}
</style>
