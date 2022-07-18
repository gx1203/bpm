<template>
  <el-card shadow="never">
    <div class="tool-common-wrap">
      <div class="search-wrap" style="display:none;">
        <quick-query ref="quick" @quickSearch="quickSearch" />
      </div>
      <div class="btn-wrap">
        <el-button type="primary" @click="excelFile">
          {{ $t('export') }}
          <!--<i class="el-icon-download" />-->
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
    <el-form class="power-search" :model="searchForm" @keyup.enter.native="powerSearch" ref="searchForm"
      label-width="100px" size="mini" v-if="isPowerSearch">
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('operator') + '：'">
            <el-input clearable type="text" v-model="searchForm.createbyname"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('operationTime') + '：'">
            <el-date-picker v-model="searchForm.createon" clearable type="daterange" value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00','23:59:59']" :range-separator="$t('placeholderText.to')"
              :start-placeholder="$t('placeholderText.startDate')" :end-placeholder="$t('placeholderText.endDate')"
              style="width: 210px !important;"></el-date-picker>
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
      <div>
        <el-table :data="content.list" class="margin-t10" stripe :header-cell-style="{background: '#E1EAFD !important'}"
          highlight-current-row @sort-change="elHandleSort" current-row-key="id">
          <!-- <el-table-column width="40">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.checked" />
            </template>
            <template slot="header">
              <el-checkbox v-model="checkAll" />
            </template>
          </el-table-column> -->
          <el-table-column :label="$t('ReplacementInstructions')" show-overflow-tooltip prop="remarks">
          </el-table-column>
          <el-table-column :label="$t('operator')" show-overflow-tooltip prop="createbyname" width="120">
          </el-table-column>
          <el-table-column :label="$t('operationTime')" show-overflow-tooltip prop="createon" width="120">
          </el-table-column>
          <el-table-column :label="$t('operation')" width="80">
            <template slot-scope="scope">
              <el-tooltip :content="$t('delete')" placement="top">
                <el-button type="text" icon="el-icon-delete" style="font-size: 16px;"
                  @click="handleDeleteOne(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip :content="$t('view')" placement="top">
                <el-button type="text" icon="el-icon-view" style="font-size: 16px;"
                  @click="showReplaceDialog(scope.row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-pagination style="margin-top: 15px" :page-size="page.pageSize" :current-page.sync="page.pageNum" background
      @current-change="searchType === 'power' ? getData() : quickQueryData()" :total="content.total">
    </el-pagination>
    <replaceDialog v-model="dialogVisible" :viewId="viewId" />
  </el-card>
</template>

<script>
import QuickQuery from "@/bpm/components/quickquery/QuickQuery";
import SearchListMixin from "@/bpm/mixins/search_list_mixin";
import replaceDialog from "./replaceDialog";
import axios from "axios";
import { createNamespacedHelpers } from "vuex";
const { mapMutations, mapGetters } = createNamespacedHelpers("processDesign");
import {
  queryReplaceList,
  deleteReplace,
  batchDelete
} from "../../api/confinBusinessRule";
export default {
  name: "businessTable",
  mixins: [SearchListMixin],
  components: {
    QuickQuery,
    replaceDialog
  },
  computed: {
    ...mapGetters(["processData"])
  },
  data () {
    return {
      isReadonly: this.$route.query.type === "edit" || this.type === "edit",
      isPowerSearch: false,
      dialogVisible: false,
      selections: [],
      checkAll: "",
      viewId: ''
    };
  },
  props: {
    treeData: {
      type: Object
    },
    states: {
      type: String
    }
  },
  watch: {
    "content.list": {
      handler (val) {
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
    checkAll (val) {
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
    },
    treeData (val) {
      if (val.type === "1") {
        this.getData();
      }
    },
    states (val) {
      console.log(val)
      this.getData()
    }
  },
  methods: {
    showReplaceDialog (item) {
      this.viewId = item.id
      this.dialogVisible = true
    },
    excelFile () {
      let processId = this.$route.query.processId
        ? this.$route.query.processId
        : this.processData.id;
      let _this = this;
      axios({
        method: "post",
        url: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/businessRuleManage/exportReplace`,
        data: {
          logic: "and",
          processId: processId,
          treeId: this.treeData.id,
          filters: this.filters,
          ...this.sort,
          ...this.page
        },
        headers: {
          token: localStorage.getItem("token")
        },
        responseType: "blob"
      })
        .then(res => {
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, `业务规则替换记录` + ".xls");
          } else {
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            var url = window.URL.createObjectURL(blob);
            a.download = `业务规则替换记录`;
            a.href = url;
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
          }
        })
        .catch(() => { });
    },
    handleDeleteOne (data) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: "warning"
      })
        .then(() => {
          // let canshu = `${data.brtreeid}?userId=${this.$store.state.basuser.user.id}&type=2`;
          deleteReplace(data.id).then(rt => {
            if (rt.status === "200") {
              this.$emit("confirm", (this.isRef = !this.isRef));
              if (this.searchType === "power") {
                this.getData();
              } else if (this.searchType === "quick") {
                this.quickQueryData();
              }
              this.$message({
                message: this.$t('hintText.successfullyDelete'),
                type: "success"
              });
            }
          });
        })
        .catch(_ => { });
    },
    handleAllDelete () {
      this.$confirm(this.$t('hintText.areYouSureDeleteSelectedData'), this.$t('hintText.hint'), {
        type: "warning"
      })
        .then(() => {
          batchDelete({
            ids: this.selections.map(item => item.brtreeid)
          }).then(rt => {
            if (rt.status === "200") {
              this.$emit("confirm", (this.isRef = !this.isRef));
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
        .catch(_ => { });
    },
    quickQueryData () {
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
    getData () {
      this.loading = true;
      this.checkAll = false;
      queryReplaceList({
        processId: this.$route.query.processId
          ? this.$route.query.processId
          : this.processData.id,
        version: this.$route.query.version || this.$route.query.version === ''
          ? this.$route.query.version
          : this.processData.version,
        treeId: this.treeData.id,
        logic: "and",
        filters: this.filters,
        ...this.sort,
        ...this.page
      }).then(rt => {
        rt.data.list.forEach(item => {
          item.checked = false;
        });
        this.content = rt.data;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
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
      left: 10px;
    }
  }
}
.textHide {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.topCustom {
  /deep/ .el-tabs__content {
    margin-top: 20px;
  }
  /deep/ .el-tabs__header {
    margin: 0;
    border-bottom: 1px solid $active-color !important;
  }
  /deep/ .el-tabs__nav {
    border-radius: 6px 6px 0 0;
    background-color: white;
    border-bottom: 1px solid $active-color !important;
  }
  /deep/ .el-tabs__item {
    padding: 0 28px !important;
  }
  /deep/ .el-tabs__item.is-active {
    color: #fff;
    background: $active-color;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
    border-bottom-color: $active-color !important;
  }
}
</style>
