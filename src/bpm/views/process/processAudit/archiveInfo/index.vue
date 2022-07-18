<template>
  <el-card shadow="never">
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <quick-query placeholder="主题" :isDate="false" ref="quick" @quickSearch="quickSearch" />
      </div>
      <div class="btn-wrap">
        <el-button type="primary" @click="addList('设置归档时间')">
          设置归档时间
          <!--<i class="el-icon-setting" />-->
        </el-button>
        <el-button type="primary" @click="addList('数据归档')">
          数据归档
          <!--<i class="el-icon-setting" />-->
        </el-button>
        <el-button type="primary" @click="addList('归档数据恢复')">
          归档数据恢复
          <!--<i class="el-icon-setting" />-->
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
          <el-form-item :label="$t('applicationNumber') + '：'">
            <el-input clearable type="text" v-model="searchForm.reqNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('subject') + '：'">
            <el-input clearable type="text" v-model="searchForm.reqNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('applicant') + '：'">
            <el-input clearable type="text" v-model="searchForm.reqNo"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('applicationDate') + '：'">
            <el-date-picker
              v-model="searchForm.createDate"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00','23:59:59']"
              :range-separator="$t('placeholderText.to')"
              :start-placeholder="$t('placeholderText.startDate')"
              :end-placeholder="$t('placeholderText.endDate')"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('state') + '：'">
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
        <el-col :span="8">
          <el-form-item :label="$t('processName') + '：'">
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
    <div class="table-header margin-t10">
      <!-- <el-checkbox v-model="checkAll" class="all-check" /> -->
      <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort" />
    </div>
      <div v-if="content.list && content.list.length!==0">

    <div class="tr" v-for="(item, index) in content.list" :key="index">
      <div class="tr-title">
        <!-- <el-checkbox v-model="item.checked" style="margin-right: 10px" /> -->
        <span>{{ $t('applicationDate') }}：{{item.createDate | formatDateTime}}</span>
        <!-- <span style="margin-left: 60px">结束时间：{{item.createDate | formatDateTime}}</span>
        <span style="margin-left: 60px">收回时间：{{item.createDate | formatDateTime}}</span>-->
        <!-- <span style="margin-left: 60px">申请单号：{{item.reqNo}}</span> -->
      </div>
      <el-row class="tr-body" type="flex" align="middle">
        <el-col class="td" :span="headers[0].span">{{item.drafter}}</el-col>
        <el-col class="td" :span="headers[1].span">{{item.passReaderUserName}}</el-col>
        <el-col class="td" :span="headers[2].span">{{item.passReaderUserName}}</el-col>
        <el-col class="td" :span="headers[3].span">{{item.passReaderUserName}}</el-col>
        <!-- <el-col style="text-align: center" :span="headers[4].span">
          <el-button type="text" icon="el-icon-edit" @click="addList"></el-button>
          <el-button type="text" icon="el-icon-delete"></el-button>
        </el-col>-->
      </el-row>
    </div>
    </div>
    <div v-else class="text-c pad-10px tr-empty"> {{ $t('noData') }}</div>

    <el-pagination
      style="margin-top: 15px"

      :page-size="page.pageSize"
      :current-page.sync="page.pageNum"
      background
      @current-change="searchType === 'power' ? getData() : quickQueryData()"
      :total="content.total"
    ></el-pagination>
    <archive-info-dialog
      v-model="dialogVisible"
      :item="editItem"
      :title="linkTitle"
      @confirm="saveSuccess"
    />
  </el-card>
</template>
<script>
import archiveInfoDialog from "./archiveInfoDialog";
import QuickQuery from "@/bpm/components/quickquery/QuickQuery";
import SearchListMixin from "@/bpm/mixins/search_list_mixin";
export default {
  name:'archiveInfo',
  mixins: [SearchListMixin],
  components: {
    archiveInfoDialog,
    QuickQuery
  },
  data() {
    return {
      typeList: [
        {
          value: "流程处理",
          label: "流程处理"
        },
        {
          value: "数据权限",
          label: "数据权限"
        }
      ],
      isPowerSearch: false,
      dialogVisible: false,
      editItem: {},
      linkTitle: "",
      headers: [
        {
          key: "drafter",
          name: this.$t('applicationnumber'),
          span: 3
        },
        {
          key: "passReaderUserName",
          name: this.$t('subject'),
          span: 3
        },
        {
          key: "passReaderUserName",
          name: this.$t('applicant'),
          span: 3
        },
        {
          key: "passReaderUserName",
          name: this.$t('state'),
          span: 3
        },
        {
          key: "passReaderUserName",
          name: this.$t('processName'),
          span: 6
        },
        {
          name: this.$t('operation'),
          span: 3
        },
        {
          name: "审批状态",
          span: 3
        }
      ],
      checkAll: ""
    };
  },
  methods: {
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
    addList(item) {
      this.linkTitle = item;
      this.editItem = {};
      this.dialogVisible = true;
    },
    getData() {
      this.loading = true;
      this.checkAll = false;
      getBusinessGroupTypeList({
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
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    saveSuccess(param) {
      if (this.searchType === "power") {
        this.getData();
      } else if (this.searchType === "quick") {
        this.quickQueryData();
      }
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
</style>
