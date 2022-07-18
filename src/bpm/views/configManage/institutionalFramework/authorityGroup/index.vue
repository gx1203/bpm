<template>
  <el-card id="internationalConfig" shadow="never">
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <quick-query :placeholder="$t('placeholderText.multipleFieldsPlaceholder19')" :isDate="false" ref="quick"
          @quickSearch="quickSearch" />
      </div>
      <div class="btn-wrap">
        <el-button type="primary" @click="companyHandle($t('addSystemGroup'))">
          {{ $t('add') }}
          <!---->
        </el-button>
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
    <el-form class="power-search" :model="searchForm" @keyup.enter.native="search" ref="searchForm" label-width="120px"
      size="mini" v-if="isPowerSearch">
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('name2') + '：'">
            <el-input clearable type="text" v-model="searchForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('description') + '：'">
            <el-input clearable type="text" v-model="searchForm.description"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('organizationType') + '：'">
            <el-select clearable v-model="searchForm.type" class="w100"
              :placeholder="$t('placeholderText.pleaseSelect')">
              <el-option v-for="item in orgType" :key="item.value" :label="item.text" :value="item.value"></el-option>
            </el-select>
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
            </div>
            <el-row class="tr-body" type="flex" align="middle">
              <el-col class="td" :span="headers[0].span">{{item.name}}</el-col>
              <el-col class="td" :span="headers[1].span">{{item.description}}</el-col>
              <el-col class="td" :span="headers[2].span">{{filterType(item.type)}}</el-col>
              <el-col style="text-align: center" :span="headers[3].span">
                <el-tooltip class="item" :content="$t('edit')">
                  <el-button type="text" icon="el-icon-edit" @click="companyHandle($t('editSystemGroup'),item)">
                  </el-button>
                </el-tooltip>
                <el-tooltip class="item" :content="$t('delete')">
                  <el-button type="text" icon="el-icon-delete" @click="handleDelete(item)"></el-button>
                </el-tooltip>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-else class="text-c pad-10px tr-empty"> {{ $t('noData') }}</div>
      </div>
      <div v-else>
        <el-table :data="content.list" class="margin-t10" stripe :header-cell-style="{background: '#E1EAFD !important'}"
          highlight-current-row @sort-change="elHandleSort" current-row-key="id">
          <el-table-column width="50">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.checked" />
            </template>
            <template slot="header">
              <el-checkbox v-model="checkAll" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('name2')" show-overflow-tooltip sortable prop="name" />
          <el-table-column :label="$t('description')" show-overflow-tooltip sortable prop="description" />
          <el-table-column :label="$t('organizationType')" show-overflow-tooltip sortable prop="type">
            <template slot-scope="scope">
              <div>{{filterType(scope.row.type)}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('state')" show-overflow-tooltip sortable prop="delete">
            <template slot-scope="scope">
              <div>{{scope.row.delete ? $t('disable') : $t('enable')}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('operation')" width="100">
            <template slot-scope="scope">
              <el-tooltip class="item" :content="$t('edit')">
                <el-button type="text" @click="companyHandle($t('editSystemGroup'),scope.row)">
                  {{ $t('edit') }}
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" :content="$t('delete')">
                <el-button type="text" @click="handleDelete(scope.row)">{{ $t('delete') }}</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-pagination style="margin-top: 15px" :page-size="page.pageSize" :current-page.sync="page.pageNum" background
      @current-change="searchType === 'power' ? getData() : quickQueryData()" :total="content.total"></el-pagination>
    <authority-group-dialog v-model="dialogVisible" :itemId="editItem.id" :title="linkTitle" @confirm="saveSuccess" />
  </el-card>
</template>
<script>
import authorityGroupDialog from "./authorityGroupDialog";
import QuickQuery from "@/bpm/components/quickquery/QuickQuery";
import SearchListMixin from "@/bpm/mixins/search_list_mixin";
import { getDictionaryOption } from "@/bpm/api/process/processModeling/classificationModel";

import {
  authorityGroup,
  deleteAuthorityGroup
} from "@/bpm/api/configManage/institutionalFramework/authority_group";
import axios from "axios";
export default {
  name: "authorityGroup",
  mixins: [SearchListMixin],
  components: {
    authorityGroupDialog,
    QuickQuery
  },
  data () {
    return {
      loading: false,
      isPowerSearch: false,
      dialogVisible: false,
      businessDialogVisible: false,
      searchForm: {},
      editItem: {},
      linkTitle: "",
      headers: [
        {
          key: "name",
          name: this.$t('name2'),
          span: 4
        },
        {
          key: "description",
          name: this.$t('description'),
          span: 12
        },
        {
          key: "type",
          name: this.$t('organizationType'),
          span: 4
        },
        {
          name: this.$t('operation'),
          span: 4
        }
      ],
      content: {
        list: []
      },
      selections: [],
      orgType: [],
      filters: [],
      page: {
        pageNum: 1,
        pageSize: 10
      },
      checkAll: ""
    };
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
    }
  },
  mounted () {
    getDictionaryOption({ dictionaryen: "系统组-组织类型" }).then(rt => {
      this.orgType = rt.data;
      this.getData();
    });
  },
  methods: {
    handleAllDelete () {
      this.$confirm(this.$t('hintText.areYouSureDeleteSelectedData'), this.$t('hintText.hint'), {
        type: "warning"
      })
        .then(() => {
          this.selections.forEach((item, index) => {
            this.loading = true
            deleteAuthorityGroup(item.id).then(rt => {
              this.loading = false
              if (rt.status === "200" && index === this.selections.length - 1) {
                this.$message({
                  message: this.$t('hintText.successfullyDelete'),
                  type: "success"
                });
                if (this.searchType === "power") {
                  this.getData();
                } else if (this.searchType === "quick") {
                  this.quickQueryData();
                }
              }
            })
          })
        })
        .catch(_ => { });
    },
    filterType (data) {
      let params = "";
      this.orgType.forEach(item => {
        if (data === item.value) {
          params = item.text;
        }
      });
      return params;
    },
    handleDelete (item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          deleteAuthorityGroup(item.id).then(rt => {
            this.loading = false;
            if (rt.status === "200") {
              this.$message({
                message: this.$t('hintText.successfullyDelete'),
                type: "success"
              });
              if (this.searchType === "power") {
                this.getData();
              } else if (this.searchType === "quick") {
                this.quickQueryData();
              }
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
    companyHandle (item, data) {
      this.linkTitle = item;
      if (item === this.$t('addSystemGroup')) {
        this.editItem = {
          hrtype: '7'
        };
        this.dialogVisible = true;
      } else if (item === this.$t('editSystemGroup')) {
        this.editItem = Object.assign({}, data);
        this.dialogVisible = true;
      }
    },
    quickQueryData () {
      this.loading = true;
      this.checkAll = false;
      authorityGroup({
        filters: this.filters,
        fullFilters: [
          {
            filters: [
              {
                key: "name",
                logic: "OR",
                opt: "LIKE",
                value: this.quickData.searchData
              },
              {
                key: "description",
                logic: "OR",
                opt: "LIKE",
                value: this.quickData.searchData
              }
            ],
            logic: "and"
          }
        ],
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          if (rt.status === "200") {
            rt.data.list.forEach(item => {
              this.orgType.forEach(val => {
                if (item.type === val.value) {
                  item.typeName = val.text;
                }
              });
              item.checked = false;
            });
            this.content = rt.data;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getData () {
      this.loading = true;
      this.checkAll = false;
      authorityGroup({
        logic: "and",
        filters: this.filters,
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
            });
            this.content = rt.data;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleSort (val) {
      this.sort = val;
      this.getData();
    },
    search () {
      this.filters = [];
      Object.keys(this.searchForm).forEach(key => {
        const filter = {
          key,
          opt: key === 'type' ? 'EQ' : "LIKE",
          type: "S",
          value: this.searchForm[key]
        };
        this.filters.push(filter);
      });
      this.getData();
    },
    reset () {
      this.searchForm = {};
      this.search();
    },
    saveSuccess (param) {
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
