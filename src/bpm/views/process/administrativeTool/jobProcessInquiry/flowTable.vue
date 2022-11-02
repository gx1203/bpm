<template>
  <el-card shadow="never" id="card-reset-inner">
    <!--    表格-->
    <!-- <bas-table
      row-key="id"
      :tableList="content.list"
      :headerList="headerList"
      :pages="page"
      :isShowIndex="false"
      :headerCellStyle="{background: '#E1EAFD !important'}"
      @selectionChange="handleSelectionChange"
      @currentChange="currentChange">
      <template #search>
        <div>
          <div class="tool-common-wrap">
            <div class="btn-wrap">
              <el-button type="primary" @click="Suk_export">
                {{ $t('export') }}
              </el-button>
              <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
                {{ $t('advancedQuery') }}
                <i :class="isPowerSearch?'el-icon-caret-top':'el-icon-caret-bottom'" />
              </el-button>
              <el-button type="primary" @click="getData">
                {{ $t('refresh') }}
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
                <el-form-item :label="$t('processName2') + '：'">
                  <el-input clearable type="text" v-model="searchForm.processnamecn"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('nodeName') + '：'">
                  <el-input clearable type="text" v-model="searchForm.nodename"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="text-r">
                <el-button type="primary" @click="search">{{ $t('query') }}</el-button>
                <el-button type="primary" @click="reset">{{ $t('reset') }}</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </template>
      <template #processnamecn="{ row }">
        <div>{{ row.processnamecn }}</div>
      </template>
      <template #nodename="{ row }">
        <div>{{ row.nodename }}</div>
      </template>
    </bas-table> -->
    <div class="tool-common-wrap">
      <div class="btn-wrap">
        <el-button type="primary" @click="Suk_export">
          {{ $t('export') }}
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
          <el-form-item :label="$t('processName2') + '：'">
            <el-input clearable type="text" v-model="searchForm.processnamecn"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('nodeName') + '：'">
            <el-input clearable type="text" v-model="searchForm.nodename"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="text-r">
          <el-button type="primary" @click="search">{{ $t('query') }}</el-button>
          <el-button type="primary" @click="reset">{{ $t('reset') }}</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div v-if="$store.state.app.tableStyle ==='default'">
      <div class="table-header margin-t10">
        <!-- <el-checkbox v-model="checkAll" class="all-check"/> -->
        <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort" />
      </div>
      <div v-if="content.list && content.list.length!==0">
        <div class="tr" v-for="(item, index) in content.list" :key="index">
          <div class="tr-title">
            <!-- <el-checkbox v-model="item.checked" style="margin-right: 10px" /> -->
            <span>&nbsp;</span>
          </div>
          <el-row class="tr-body" type="flex" align="middle">
            <el-col class="td" :span="headers[0].span">{{item.processnamecn}}</el-col>
            <el-col class="td" :span="headers[1].span">{{item.nodename}}</el-col>
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
        <el-table-column :label="$t('processName2')" sortable prop="processnamecn">
        </el-table-column>
        <el-table-column :label="$t('nodeName')" sortable prop="nodename">
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      style="margin-top: 15px"
      :page-size="page.pageSize"
      :current-page.sync="page.pageNum"
      background
      @current-change="getData"
      :total="content.total"
    ></el-pagination>
  </el-card>
</template>
<script>
import { query } from "@/bpm/api/process/administrativeTool/job_processInquiry";
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import exportOrg from "@/bpm/api/configManage/plan/index"
import axios from "axios";
export default {
  mixins: [SearchListMixin],
  data() {
    return {
      searchKey: "",
      loading: false,
      isPowerSearch: false,
      searchForm: {},
      headers: [
        {
          key: "processnamecn",
          name: this.$t('processName2'),
          span: 12
        },
        {
          key: "nodename",
          name: this.$t('nodeName'),
          span: 12
        }
      ],
      content: {},
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      checkAll: "",
      // 表头字段
      headerList: [
        {
          label: this.$t('processName2'), // 流程名称
          prop: 'processnamecn',
          slotName: 'processnamecn',
          sortable: true
        },
        {
          label: this.$t('nodeName'), // 节点名称
          prop: 'nodename',
          slotName: 'nodename',
          sortable: true
        }
      ]
    };
  },
  props: {
    editableTabsValue: {
      type: String,
      defaul: ""
    },
    treeData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  watch: {
    treeData: {
      handler(val) {
        if (val.type === "3" && this.editableTabsValue === '1') {
          this.getData();
        }
      },
      immediate: true
    }
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL;
    },
  },
  methods: {
    // 页码改变事件
    currentChange(newPageNum) {
      console.log('newPage', newPageNum)
      this.page.pageNum = newPageNum
      this.getData()
    },
    // 复选框勾选事件
    handleSelectionChange(data) {
      console.log(data)
      this.selections = data
    },
    // 导出
    Suk_export(){
      axios({
        method: "post",
        url: `${this.host}/postProcess/exportOrg/${this.treeData.id}`,
        data: {},
        responseType: "blob",
        timeout: 60000000
      })
        .then(res => {
          const blob = new Blob([res.data], {
            type: "application/vnd.ms-excel"
          });
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // 兼容TMD IE
            navigator.msSaveBlob(blob, this.downloadName);
          } else {
            // 其他浏览器
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.style.display = "none";
            link.href = url;
            link.setAttribute("download", "北汽重卡BPM岗位节点匹配");
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(link.href);
          }
        })
        .catch(() => {
          this.exportLoading = false;
        });
      // this.$loading()
      // exportOrg({
      //   orgId: this.treeData.id || '',
      // }).then(rt => {
      //   this.$loading().close()
      //   this.isLoadData = true
      // }).catch(() => {
      //   this.$loading().close()
      // })
    },
    getData() {
      this.loading = true;
      this.checkAll = false;
      query(
        {
          logic: "and",
          filters: this.filters,
          ...this.sort,
          ...this.page
        },
        this.treeData.id
      )
        .then(rt => {
          rt.data.list.forEach(item => {
            item.checked = false;
          });
          this.content = rt.data;
          this.page.total = rt.data.total
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleSort(val) {
      this.sort = val;
      this.getData();
    },
    search() {
      this.filters = [];
      Object.keys(this.searchForm).forEach(key => {
        const filter = {
          key,
          opt: "LIKE",
          type: "S",
          value: this.searchForm[key]
        };
        this.filters.push(filter);
      });
      this.getData();
    },
    reset() {
      this.searchForm = {};
      this.getData();
    }
  }
};
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
#card-reset-inner {
  padding-top: 10px;
}
</style>
