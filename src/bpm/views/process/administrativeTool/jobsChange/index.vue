<template>
  <el-card shadow="never" class="card-reset-inner">
    <div v-loading="loading">
       <!--    表格-->
      <bas-table
        row-key="id"
        :tableList="content.list"
        :headerList="headerList"
        :pages="page"
        :isShowIndex="false"
        @selectionChange="handleSelectionChange"
        @currentChange="currentChange">
        <template #search>
          <div>
            <div class="tool-common-wrap">
              <div class="search-wrap">
                <!-- <quick-query :isDate="false" ref="quick" @quickSearch="quickSearch" /> -->
              </div>
              <div class="btn-wrap">
                <el-button type="primary" @click="addList($t('addJobChange'))">
                  {{ $t('add') }}

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
                  <el-form-item :label="$t('changeUser') + '：'">
                    <el-input clearable type="text" v-model="searchForm.oldusername"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('post') + '：'">
                    <el-input clearable type="text" v-model="searchForm.postname"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('replaceUser') + '：'">
                    <el-input clearable type="text" v-model="searchForm.newusername"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('owningProcess') + '：'">
                    <el-input clearable type="text" v-model="searchForm.processnames"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('modifiedDate') + '：'">
                    <el-date-picker
                      v-model="searchForm.changedate"
                      type="daterange"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      :default-time="['00:00:00','23:59:59']"
                      :range-separator="$t('placeholderText.to')"
                    :start-placeholder="$t('placeholderText.startDate')"
                    :end-placeholder="$t('placeholderText.endDate')"
                    ></el-date-picker>
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
        <!-- 变更用户 -->
        <template #olduser="{ row }">
          <div>{{ row.olduser }}</div>
        </template>
        <!-- 替换用户 -->
        <template #newuser="{ row }">
          <div>{{ row.newuser }}</div>
        </template>
        <!-- 所属流程-->
        <template #processnames="{ row }">
          <div>{{ row.processnames }}</div>
        </template>
        <!-- 修改日期-->
        <template #changedate="{ row }">
          <div>{{ row.changedate | formatDate }}</div>
        </template>
      </bas-table>
    </div>
    <jobs-change-dialog
      v-model="dialogVisible"
      :item="editItem"
      :title="linkTitle"
      @confirm="saveSuccess"
    />
  </el-card>
</template>

<script>
import jobsChangeDialog from "./jobsChangeDialog";
import { getBpmUserChange } from "@/bpm/api/process/administrativeTool/agents_change";
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
export default {
  mixins: [SearchListMixin],
  components: {
    jobsChangeDialog
  },
  data() {
    return {
      loading: false,
      editItem: {},
      isPowerSearch: false,
      dialogVisible: false,
      searchForm: {},
      editItem: {},
      linkTitle: "",
      headers: [
        {
          key: "olduser",
          name: this.$t('changeUser'),
          span: 6
        },
        {
          key: "post",
          name: this.$t('post'),
          span: 6
        },
        {
          key: "newuser",
          name: this.$t('replaceUser'),
          span: 6
        },
        {
          key: "processnames",
          name: this.$t('owningProcess'),
          span: 6
        }
      ],
      content: {
        list: []
      },
      filters: [],
      sort: {},
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      checkAll: "",
      // 表头字段
      headerList: [
        {
          label: this.$t('changeUser'), // 变更用户
          prop: 'olduser',
          slotName: 'olduser',
          sortable: true
        },
        {
          label: this.$t('replaceUser'), // 替换用户
          prop: 'newuser',
          slotName: 'newuser',
          sortable: true
        },
        {
          label: this.$t('owningProcess'), // 所属流程
          prop: 'processnames',
          slotName: 'processnames',
          sortable: true
        },
        {
          label: this.$t('modifiedDate'), // 修改日期
          prop: 'changedate',
          slotName: 'changedate',
          sortable: true
        }
      ]
    };
  },
  mounted() {
    this.getData();
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
    quickQueryData() {
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
    saveSuccess(data) {
      if (data) {
        this.getData();
      }
    },
    addList(item, data) {
      if (item === this.$t('addJobChange')) {
        this.dialogVisible = true;
        this.linkTitle = item;
        this.editItem = {};
      }
    },
    getData() {
      this.loading = true;
      this.checkAll = false;
      if (this.filters.findIndex(item => item.key === "type") < 0) {
        this.filters.push({ key: "type", opt: "LIKE", type: "S", value: "2" });
      }

      getBpmUserChange({
        logic: "and",
        filters: this.filters,
        ...this.sort,
        ...this.page
      })
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
        if (key === "changedate") {
          filter.type = "D";
          filter.opt = "BETWEEN";
          filter.value = this.searchForm[key]
            ? this.searchForm[key].join("~")
            : "";
        }
        this.filters.push(filter);
      });
      this.getData();
    },
    reset() {
      this.searchForm = {};
      this.search();
    }
  }
};
</script>

<style lang="scss" scoped>
.topCustom .card-reset-inner {
  ::v-deep > .el-card__body {
    padding: 10px 0 0 0!important;
  }
}

.card-reset-inner {
  ::v-deep > .el-card__body {
    padding: 10px 30px 10px 10px !important;
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
.w100 {
  width: 100%;
}
</style>
