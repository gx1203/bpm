    <template>
  <el-card shadow="never">
    <div class="tool-common-wrap">
       <div class="search-wrap">
        <quick-query :isDate="false" ref="quick" @quickSearch="quickSearch" />
      </div>
      <div class="btn-wrap">
        <el-button type="primary" :disabled="selections.length === 0" @click="handleAllDelete">
          {{ $t('batchDelete') }}
          <!--<i class="el-icon-circle-close" />-->
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
          <el-form-item label="组织机构名称：">
            <el-input clearable type="text" v-model="searchForm.reqNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('userName') + '：'">
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
    <div v-loading="loading">
      <div class="table-header margin-t10">
        <el-checkbox v-model="checkAll" class="all-check" />
        <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort" />
      </div>
      <div v-if="content.list && content.list.length!==0">

      <div class="tr" v-for="(item, index) in content.list" :key="index">
        <div class="tr-title">
          <el-checkbox v-model="item.checked" style="margin-right: 10px" />
          <!-- <span>{{ $t('applicationDate') }}：{{item.createDate | formatDateTime}}</span> -->
          <!-- <span style="margin-left: 60px">结束时间：{{item.createDate | formatDateTime}}</span>
          <span style="margin-left: 60px">收回时间：{{item.createDate | formatDateTime}}</span>-->
          <!-- <span style="margin-left: 60px">申请单号：{{item.reqNo}}</span> -->
        </div>
        <el-row class="tr-body" type="flex" align="middle">
          <el-col class="td" :span="headers[0].span">{{item.drafter}}</el-col>
          <el-col class="td" :span="headers[1].span">{{item.passReaderUserName}}</el-col>
          <el-col style="text-align: center" :span="headers[2].span">
            <el-tooltip class="item" :content="$t('delete')">
              <el-button type="text" icon="el-icon-delete" @click="handleDeleteOne(item)"></el-button>
            </el-tooltip>
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
  </el-card>
</template>
<script>
import QuickQuery from "@/bpm/components/quickquery/QuickQuery";
import SearchListMixin from "@/bpm/mixins/search_list_mixin";
export default {
  components:{
    QuickQuery
  },
  mixins: [SearchListMixin],
  data() {
    return {
      isPowerSearch: false,
      dialogVisible: false,
      editItem: {},
      linkTitle: "",
      headers: [
        {
          key: "drafter",
          name: "组织机构名称",
          span: 8
        },
        {
          key: "passReaderUserName",
          name: "用户名",
          span: 8
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
  },
  methods: {
     handleDeleteOne(item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: "warning"
      })
        .then(() => {
          deleteApproveType(item.id).then(rt => {
            if (rt.status === "200") {
              if (this.searchType === 'power') {
              this.getData()
            } else if (this.searchType === 'quick') {
              this.quickQueryData()
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
              if (this.searchType === 'power') {
              this.getData()
            } else if (this.searchType === 'quick') {
              this.quickQueryData()
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
