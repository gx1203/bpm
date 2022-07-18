<template>
  <el-card shadow="never">
    <div class="item-left">
      <tree-organization @confirm="handleNodeClick" />
    </div>
    <div class="item-right">
      <div class="tool-common-wrap">
        <div class="search-wrap">
          <quick-query :isDate="false" ref="quick" @quickSearch="quickSearch" />
        </div>
        <div class="btn-wrap">
          <el-button
                  type="primary"
                     :disabled="selections.length === 0"
                     @click="handleAllDelete">
            {{ $t('batchDelete') }}
            <!--<i-->
              <!--class="el-icon-circle-close"-->
              <!--:disabled="selections.length === 0"-->
              <!--@click="handleAllDelete"-->
            <!--/>-->
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
            <el-form-item :label="$t('ruleName') + '：'">
              <el-input clearable type="text" v-model="searchForm.reqNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('ruleDescription') + '：'">
              <el-input clearable type="text" v-model="searchForm.reqNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('organization2') + '：'">
              <el-input clearable type="text" v-model="searchForm.subject"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="所属业务组：">
              <el-input clearable type="text" v-model="searchForm.subject"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否无条件审批：">
              <el-input clearable type="text" v-model="searchForm.subject"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('creator') + '：'">
              <el-input clearable type="text" v-model="searchForm.subject"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('changeTheTime') + '：'">
              <el-date-picker
                v-model="searchForm.reqDate"
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
            <span>修改时间：{{item.createDate | formatDateTime}}</span>
            <!--  <span style="margin-left: 60px">申请单号：{{item.reqNo}}</span> -->
          </div>
          <el-row class="tr-body" type="flex" align="middle">
            <el-col class="td" :span="headers[0].span">{{item.drafter}}</el-col>
            <el-col class="td" :span="headers[1].span">{{item.passReaderUserName}}</el-col>
            <el-col class="td" :span="headers[2].span">{{item.passReadTime}}</el-col>
            <el-col class="td" :span="headers[3].span">{{item.passReadTime}}</el-col>
            <el-col class="td" :span="headers[4].span">{{item.passReadTime}}</el-col>
            <el-col class="td" :span="headers[5].span">{{item.passReadTime}}</el-col>
            <el-col style="text-align: center" :span="headers[6].span">
              <el-button type="text" icon="el-icon-delete" @click="handleDeleteOne(item)"></el-button>
              <el-button type="primary">复制</el-button>
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
    </div>
  </el-card>
</template>
<script>
import treeOrganization from "@/bpm/components/treeOrganization";
import QuickQuery from "@/bpm/components/quickquery/QuickQuery";
import SearchListMixin from "@/bpm/mixins/search_list_mixin";
export default {
  mixins: [SearchListMixin],
  components: {
    treeOrganization,
    QuickQuery
  },
  data() {
    return {
      isPowerSearch: false,
      dialogVisible: false,
      editItem: {},
      linkTitle: "",
      headers: [
        {
          key: "drafter",
          name: this.$t('ruleName'),
          span: 5
        },
        {
          key: "passReaderUserName",
          name: this.$t('ruleDescription'),
          span: 5
        },
        {
          key: "passReadTime",
          name: this.$t('organization2'),
          span: 5
        },
        {
          key: "passReadTime",
          name: "所属业务组",
          span: 5
        },
        {
          key: "passReadTime",
          name: "是否无条件审批",
          span: 5
        },
        {
          key: "创建人",
          name: "条件类型",
          span: 5
        },
        {
          name: this.$t('operation'),
          span: 8
        }
      ],
      selections: [],
      checkAll: ""
    };
  },
  methods: {
    saveSuccess(data) {
      if (data) {
        this.getData();
      }
    },
    handleNodeClick(data) {
      console.log(data);
    },
    getData() {
      this.loading = true;
      this.checkAll = false;
      getApproveTypeList({
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

    handleDeleteOne(item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: "warning"
      })
        .then(() => {
          deleteApproveType(item.id).then(rt => {
            if (rt.status === "200") {
              if (this.searchType === "power") {
                this.getData();
              } else if (this.searchType === "quick") {
                this.quickQueryData();
              }
              this.$message({
                message: this.$t('hintText.successfullyDelete'),
                type: "success"
              });
            } else {
              this.$message({
                message: this.$t('hintText.failToDelete'),
                type: "error"
              });
            }
          });
        })
        .catch(_ => {});
    },
    handleAllDelete() {
      this.$confirm(this.$t('hintText.areYouSureDeleteSelectedData'), this.$t('hintText.hint'), {
        type: "warning"
      })
        .then(() => {
          batchDeleteApproveType(
            this.selections.map(item => item.id).join(",")
          ).then(rt => {
            if (rt.status === "200") {
              if (this.searchType === "power") {
                this.getData();
              } else if (this.searchType === "quick") {
                this.quickQueryData();
              }
              this.$message({
                message: this.$t('hintText.successfullyDelete'),
                type: "success"
              });
            } else {
              this.$message({
                message: this.$t('hintText.failToDelete'),
                type: "error"
              });
            }
          });
        })
        .catch(_ => {});
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
    }
  },
  watch: {
    "content.list": {
      handler(val) {
        if (this.content.list && this.content.list.length !== 0) {
          this.checkAll = true;
          this.selections = [];
          for (let i = 0; i < this.content.list.length; i++) {
            if (!this.content.list[i].checked) {
              this.checkAll = false;
            } else {
              this.selections.push(this.content.list[i]);
            }
          }
        }
      },
      deep: true
    },
    checkAll(val) {
      if (this.content.list) {
        if (val) {
          this.content.list.forEach(item => {
            item.checked = val;
          });
        } else if (this.selections.length === this.content.list.length) {
          this.content.list.forEach(item => {
            item.checked = val;
          });
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.item-left {
  float: left;
  width: 20%;
}
.w100 {
  width: 100%;
}
.item-right {
  float: right;
  width: 78%;
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
}
</style>
