<template>
  <el-card id="internationalConfig" shadow="never">
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <quick-query
          :placeholder="$t('placeholderText.multipleFieldsPlaceholder21')"
          :isDate="false"
          ref="quick"
          @quickSearch="quickSearch"
        />
      </div>
      <div class="btn-wrap">
        <el-button type="primary" @click="companyHandle('add')">
          {{ $t('add') }}
          <!---->
        </el-button>
        <el-button type="primary" :disabled="selections.length === 0" @click="handleAllDelete">
          {{ $t('batchDelete') }}
          <!--<i class="el-icon-circle-close" />-->
        </el-button>
        <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
          {{ $t('advancedQuery') }}
          <i
            :class="isPowerSearch?'el-icon-caret-top':'el-icon-caret-bottom'"
          />
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
      @keyup.enter.native="search"
      ref="searchForm"
      label-width="120px"
      size="mini"
      v-if="isPowerSearch"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('coding') + '：'">
            <el-input clearable type="text" v-model="searchForm.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('name2') + '：'">
            <el-input clearable type="text" v-model="searchForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('companyAbbreviation') + '：'">
            <el-input clearable type="text" v-model="searchForm.shortname"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('companyCode') + '：'">
            <el-input clearable type="text" v-model="searchForm.companycode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('effectiveDate') + '：'">
            <el-date-picker
              v-model="searchForm.effectivedate"
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
          <el-button type="primary" @click="rest">{{ $t('reset') }}</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="tableWrap" v-loading="loading">
      <div v-if="$store.state.app.tableStyle ==='default'">
        <div class="table-header margin-t10">
          <el-checkbox v-model="checkAll" class="all-check" />
          <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort" />
        </div>
        <div v-if="content.list && content.list.length!==0">
          <div class="tr" v-for="(item, index) in content.list" :key="index">
            <div class="tr-title">
              <el-checkbox v-model="item.checked" style="margin-right: 10px" />
              <span
                v-if="item.effectivedate"
              >{{ $t('effectiveDate') }}：{{item.effectivedate | formatDateTime}}</span>
            </div>
            <el-row class="tr-body" type="flex" align="middle">
              <el-col class="td" :span="headers[0].span">{{item.code}}</el-col>
              <el-col class="td" :span="headers[1].span">{{item.name}}</el-col>
              <el-col class="td" :span="headers[2].span">{{item.shortname}}</el-col>
              <el-col class="td" :span="headers[3].span">{{item.companycode}}</el-col>
              <el-col class="td" :span="headers[4].span">{{item.pname}}</el-col>
              <el-col class="td" :span="headers[5].span">{{item.typeName}}</el-col>
              <el-col class="td" :span="headers[6].span">{{item.subtypeName}}</el-col>
              <el-col style="text-align: center" :span="headers[7].span">
                <el-tooltip class="item" :content="$t('edit')" placement="top">
                  <el-button
                    type="text"
                    icon="el-icon-edit"
                    @click="companyHandle('edit',item)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip class="item" :content="$t('delete')" placement="top">
                  <el-button type="text" icon="el-icon-delete" @click="handleDelete(item)"></el-button>
                </el-tooltip>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-else class="text-c pad-10px tr-empty">{{ $t('noData') }}</div>
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
              <el-checkbox v-model="scope.row.checked" />
            </template>
            <template slot="header">
              <el-checkbox v-model="checkAll" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('coding')" show-overflow-tooltip sortable prop="code" />
          <el-table-column :label="$t('name2')" show-overflow-tooltip sortable prop="name" />
          <el-table-column
            :label="$t('companyAbbreviation')"
            show-overflow-tooltip
            sortable
            prop="shortname"
          />
          <el-table-column
            :label="$t('companyCode')"
            show-overflow-tooltip
            sortable
            prop="companycode"
          />
          <el-table-column
            :label="$t('nameParentOrganization2')"
            show-overflow-tooltip
            prop="pname"
          />
          <el-table-column
            :label="$t('organizationType')"
            show-overflow-tooltip
            sortable
            prop="type"
          >
            <template slot-scope="scope">
              <div>{{scope.row.typeName}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('state')" show-overflow-tooltip sortable prop="subtype">
            <template slot-scope="scope">
              <div>{{scope.row.subtypeName}}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('effectiveDate')"
            show-overflow-tooltip
            sortable
            prop="effectivedate"
          >
            <template slot-scope="scope">
              <div>{{scope.row.effectivedate | formatDateTime}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('operation')" width="100">
            <template slot-scope="scope">
              <el-tooltip class="item" :content="$t('edit')" placement="top">
                <el-button
                  type="text"
                  @click="companyHandle('edit',scope.row)"
                >
                {{ $t('edit') }}
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" :content="$t('delete')" placement="top">
                <el-button type="text" @click="handleDelete(scope.row)">{{ $t('delete') }}</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-pagination
      style="margin-top: 15px"
      :page-size="page.pageSize"
      :current-page.sync="page.pageNum"
      background
      @current-change="searchType === 'power' ? getData() : quickQueryData()"
      :total="content.total"
    ></el-pagination>
    <company-management-dialog
      v-model="dialogVisible"
      :item="editItem"
      :title="linkTitle"
      @confirm="saveSuccess"
    />
  </el-card>
</template>
<script>
import companyManagementDialog from "./companyManagementDialog";
import QuickQuery from "@/bpm/components/quickquery/QuickQuery";
import SearchListMixin from "@/bpm/mixins/search_list_mixin";
import { getDictionaryOption } from "@/bpm/api/process/processModeling/classificationModel";
import { orgInfo } from "@/bpm/api/configManage/institutionalFramework/org_info";
import { deleteTreeAll } from "@/bpm/api/configManage/institutionalFramework/organization";
export default {
  name: "companyManagement",
  mixins: [SearchListMixin],
  components: {
    companyManagementDialog,
    QuickQuery
  },
  data() {
    return {
      headData: {
        token: localStorage.getItem("token")
      },
      action: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/i18n/config/importExcel`,
      loading: false,
      isPowerSearch: false,
      dialogVisible: false,
      businessDialogVisible: false,
      searchForm: {},
      editItem: {},
      linkTitle: "",
      headers: [
        {
          key: "code",
          name: this.$t("coding"),
          span: 3
        },
        {
          key: "name",
          name: this.$t("name2"),
          span: 3
        },
        {
          key: "shortname",
          name: this.$t("companyAbbreviation"),
          span: 3
        },
        {
          key: "companycode",
          name: this.$t("companyCode"),
          span: 3
        },
        {
          key: "pname",
          name: this.$t("pname"),
          span: 6
        },
        {
          key: "hrtype",
          name: this.$t("organizationType"),
          span: 3
        },
        {
          key: "subtype",
          name: this.$t("state"),
          span: 3
        },
        {
          name: this.$t("operation"),
          span: 2
        }
      ],
      content: {
        list: []
      },
      selections: [],
      filters: [],
      page: {
        pageNum: 1,
        pageSize: 10
      },
      checkAll: "",
      orgType: [],
      subtypeList: []
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
  mounted() {
    let list = [
      getDictionaryOption({ dictionaryen: "组织类型" }),
      getDictionaryOption({ dictionaryen: "公司管理-状态" })
    ];
    Promise.all(list).then(resultList => {
      this.orgType = resultList[0].data;
      this.subtypeList = resultList[1].data;
      this.getData();
    });
  },
  methods: {
    handleAllDelete() {
      this.$confirm(
        this.$t("hintText.areYouSureDeleteSelectedData"),
        this.$t("hintText.hint"),
        {
          type: "warning"
        }
      )
        .then(() => {
          this.selections.forEach((item, index) => {
            this.loading = true;
            deleteTreeAll(item.id).then(rt => {
              this.loading = false;
              if (rt.status === "200" && index === this.selections.length - 1) {
                this.$message({
                  message: this.$t("hintText.successfullyDelete"),
                  type: "success"
                });
                if (this.searchType === "power") {
                  this.getData();
                } else if (this.searchType === "quick") {
                  this.quickQueryData();
                }
              }
            });
          });
        })
        .catch(_ => {});
    },
    handleDelete(item) {
      this.$confirm(
        this.$t("hintText.areYouSureDelete"),
        this.$t("hintText.hint"),
        {
          type: "warning"
        }
      )
        .then(() => {
          this.loading = true;
          deleteTreeAll(item.id).then(rt => {
            this.loading = false;
            if (rt.status === "200") {
              this.getData();
              this.$message({
                message: this.$t("hintText.successfullyDelete"),
                type: "success"
              });
              if (this.searchType === "power") {
                this.getData();
              } else if (this.searchType === "quick") {
                this.quickQueryData();
              }
            } else {
              this.$message({
                message: this.$t("hintText.failToDelete"),
                type: "error"
              });
            }
          });
        })
        .catch(() => {});
    },
    companyHandle(item, data) {
      // this.linkTitle = item;
      if (item === 'add') {
        this.linkTitle = this.$t('addCompany')
        this.editItem = {
          hrtype: "1",
          approvalorgdesc:"Company",
          subtype:"Y"
        };
        this.dialogVisible = true;
      } else if (item === 'edit'){
        // data.pName = data.pname;
        this.linkTitle = this.$t('editingCompany')
        this.editItem = Object.assign({}, data);
        this.dialogVisible = true;
      }
    },
    quickQueryData() {
      this.loading = true;
      this.checkAll = false;
      orgInfo({
        logic: "and",
        fullFilters: [
          {
            filters: [
              {
                key: "code",
                logic: "OR",
                opt: "LIKE",
                value: this.quickData.searchData
              },
              {
                key: "name",
                logic: "OR",
                opt: "LIKE",
                value: this.quickData.searchData
              },
              {
                key: "shortname",
                logic: "OR",
                opt: "LIKE",
                value: this.quickData.searchData
              },
              {
                key: "companycode",
                logic: "OR",
                opt: "LIKE",
                value: this.quickData.searchData
              },
              {
                key: "companycode",
                logic: "OR",
                opt: "LIKE",
                value: this.quickData.searchData
              },
              {
                key: "companycode",
                logic: "OR",
                opt: "LIKE",
                value: this.quickData.searchData
              },
              {
                key: "hrtype",
                logic: "OR",
                opt: "LIKE",
                value: this.quickData.searchData
              }
            ],
            logic: "and"
          },
          {
            filters: [
              {
                key: "type",
                logic: "AND",
                opt: "EQ",
                value: "1"
              }
            ]
          },
          {
            filters: this.filters
          }
        ],
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          if (rt.status === "200") {
            rt.data.list.forEach(item => {
              item.checked = false;
              this.orgType.forEach(val => {
                if (item.type === val.value) {
                  item.typeName = val.text;
                }
              });
              this.subtypeList.forEach(val => {
                if (item.subtype === val.value) {
                  item.subtypeName = val.text;
                }
              });
            });
            this.content = rt.data;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getData() {
      this.loading = true;
      this.checkAll = false;
      orgInfo({
        logic: "and",
        fullFilters: [
          {
            filters: [
              {
                key: "type",
                logic: "AND",
                opt: "EQ",
                value: "1"
              },
            ]
          },
          {
            filters: this.filters
          }
        ],
        sort:'createon',
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          if (rt.status === "200") {
            rt.data.list.forEach(item => {
              item.checked = false;
              this.orgType.forEach(val => {
                if (item.type === val.value) {
                  item.typeName = val.text;
                }
              });
              this.subtypeList.forEach(val => {
                if (item.subtype === val.value) {
                  item.subtypeName = val.text;
                }
              });
            });
            this.content = rt.data;
          }
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
        if (key === "effectivedate") {
          filter.type = "D";
          filter.opt = "BETWEEN";
          if (this.searchForm[key] && this.searchForm[key].length !== 0) {
            filter.value = this.searchForm[key]
              ? this.searchForm[key].join("~")
              : null;
          } else {
            filter.value = null;
          }
        }
        this.filters.push(filter);
      });
      this.getData();
    },
    reset() {
      this.searchForm = {};
      this.search();
    },
    saveSuccess(param) {
      if (param) {
        this.getData();
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
#internationalConfig {
  .upload-demo {
    display: inline-block;
    margin-right: 10px;
  }
}
</style>
