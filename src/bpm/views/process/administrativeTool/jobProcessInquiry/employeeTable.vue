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
            label-width="60px"
            size="mini"
            v-if="isPowerSearch"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('loginAccount') + '：'">
                  <el-input clearable type="text" v-model="searchForm.memberId"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('workNumber') + '：'">
                  <el-input clearable type="text" v-model="searchForm.name"></el-input>
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
      <template #memberId="{ row }">
        <div>{{ row.memberId }}</div>
      </template>
      <template #name="{ row }">
        <div>{{ row.name }}</div>
      </template>
    </bas-table> -->
    <div class="tool-common-wrap">
      <div class="btn-wrap">
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
      label-width="60px"
      size="mini"
      v-if="isPowerSearch"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('loginAccount') + '：'">
            <el-input clearable type="text" v-model="searchForm.memberId"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('workNumber') + '：'">
            <el-input clearable type="text" v-model="searchForm.name"></el-input>
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
        <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort" />
      </div>
      <div v-if="content.list && content.list.length!==0">
        <div class="tr" v-for="(item, index) in content.list" :key="index">
          <div class="tr-title">
            <span>&nbsp;</span>
          </div>
          <el-row class="tr-body" type="flex" align="middle">
            <el-col class="td" :span="headers[0].span">{{item.memberId}}</el-col>
            <el-col class="td" :span="headers[1].span">{{item.name}}</el-col>
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
        <el-table-column :label="$t('loginAccount')" sortable prop="memberId">
        </el-table-column>
        <el-table-column :label="$t('name')" sortable prop="name">
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
import { findOrgUsers } from "@/bpm/api/configManage/institutionalFramework/organization";
export default {
  components: {},
  data() {
    return {
      searchKey: "",
      loading: false,
      isPowerSearch: false,
      searchForm: {},
      filters:[],
      headers: [
        {
          key: "memberId",
          name: this.$t('loginAccount'),
          span: 12
        },
        {
          key: "name",
          name: this.$t('workNumber'),
          span: 12
        },
      ],
      content: {
        list: [{}]
      },
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      checkAll: "",
      // 表头字段
      headerList: [
        {
          label: this.$t('loginAccount'), // 流程名称
          prop: 'memberId',
          slotName: 'memberId',
          sortable: true,
          tooltip: false
        },
        {
          label: this.$t('name'), // 节点名称
          prop: 'name',
          slotName: 'name',
          sortable: true,
          tooltip: false
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
        if (val.type === "3" && this.editableTabsValue === "2") {
          this.getData();
        }
      },
      immediate: true
    }
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
    getData() {
      this.loading = true;
      this.checkAll = false;
      findOrgUsers(
        {
          logic: "and",
          filters: this.filters,
          ...this.page,
          ...this.sort
        },
        this.treeData.id,
        false
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
      this.search();
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
