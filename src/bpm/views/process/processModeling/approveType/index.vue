<template>
  <el-card shadow="never" class="card-reset">
    <div v-loading="loading">
      <!--    表格-->
      <bas-table
        row-key="id"
        :tableList="content.list"
        :headerList="headerList"
        :pages="page"
        selectType="checkbox"
        :headerCellStyle="{background: '#E1EAFD !important'}"
        @selectionChange="handleSelectionChange"
        @currentChange="currentChange">
        <template #search>
          <div>
            <div class="tool-common-wrap">
              <div class="search-wrap">
                <quick-query
                  :placeholder="$t('placeholderText.multipleFieldsPlaceholder28')"
                  :isDate="false"
                  ref="quick"
                  @quickSearch="quickSearch"
                />
              </div>
              <div class="btn-wrap">
                <el-button type="primary" @click="addList($t('addApprovalType'))">
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
                  <el-form-item :label="$t('authorityName') + '：'">
                    <el-input clearable type="text" v-model="searchForm.name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('sort') + '：'">
                    <el-input
                      type="number"
                      onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
                      v-model="searchForm.sort"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('permissionCode') + '：'">
                    <el-input clearable type="text" v-model="searchForm.rightscode"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="outComes：">
                    <el-input clearable type="text" v-model="searchForm.outcomes"></el-input>
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
          </div>
        </template>
        <!-- 权限名称  -->
        <template #name="{ row }">
          <div>{{ row.name }}</div>
        </template>
        <!-- 排序  -->
        <template #sort="{ row }">
          <div>{{ row.sort }}</div>
        </template>
        <!-- 权限代码  -->
        <template #rightscode="{ row }">
          <div>{{ row.rightscode }}</div>
        </template>
         <!-- outComes  -->
        <template #outcomes="{ row }">
          <div>{{ row.outcomes }}</div>
        </template>
        <!-- 备注  -->
        <template #remark="{ row }">
          <div>{{ row.remark }}</div>
        </template>
        <!-- 操作 -->
        <template #id="{ row }">
          <el-tooltip class="item" effect="dark" :content="$t('edit')" placement="top">
            <el-button type="text" @click="addList($t('editApprovalType'),row)">{{ $t('edit') }}</el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
            <el-button type="text" @click="handleDeleteOne(row)">{{ $t('delete') }}</el-button>
          </el-tooltip>
        </template>
      </bas-table>
    </div>
    <add-type-dialog
      v-model="dialogVisible"
      :item="editItem"
      :title="linkTitle"
      @confirm="saveSuccess"
    />
  </el-card>
</template>

<script>
import AddTypeDialog from "./AddTypeDialog";
import QuickQuery from "@/bpm/components/quickquery/QuickQuery";
import SearchListMixin from "@/bpm/mixins/search_list_mixin";
import {
  getApproveTypeList,
  deleteApproveType,
  batchDeleteApproveType,
  getApproveQuickQuery
} from "@/bpm/api/process/processModeling/approve_type";
export default {
  name:'stagingPersonalApproveType',
  mixins: [SearchListMixin],
  components: {
    AddTypeDialog,
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
          key: "name",
          name: this.$t('authorityName'),
          span: 6
        },
        // {
        //   key: "url",
        //   name: "URL",
        //   span: 7
        // },
        {
          key: "sort",
          name: this.$t('sort'),
          span: 5
        },
        {
          key: "rightscode",
          name: this.$t('permissionCode'),
          span: 5
        },
        {
          key: "outcomes",
          name: "outComes",
          span: 5
        },
        {
          key: "remark",
          name: this.$t('remarks'),
          span: 5
        },
        {
          name: this.$t('operation'),
          span: 3
        }
      ],
      selections: [],
      checkAll: "",
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      // 表头字段
      headerList: [
        {
          label: this.$t('authorityName'), // 权限名称
          prop: 'name',
          slotName: 'name',
          sortable: true
        },
        {
          label: this.$t('sort'), // 排序
          prop: 'sort',
          slotName: 'sort',
          sortable: true
        },
        {
          label: this.$t('permissionCode'), // 权限代码
          prop: 'rightscode',
          slotName: 'rightscode',
          sortable: true
        },
        {
          label: this.$t('outComes'), // outComes
          prop: 'outcomes',
          slotName: 'outcomes',
          sortable: true
        },
        {
          label: this.$t('remarks'), // 备注
          prop: 'remark',
          slotName: 'remark',
          sortable: true
        },
        {
          label: this.$t('operation'), // 操作
          prop: 'id',
          slotName: 'id',
          sortable: false
        }
      ]
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
    this.getData();
  },
  methods: {
    // 页码改变事件
    currentChange(newPageNum) {
      console.log('newPage', newPageNum)
      this.page.pageNum = newPageNum
      this.searchType === 'power' ? this.getData() : this.quickQueryData()
    },
    // 复选框勾选事件
    handleSelectionChange(data) {
      console.log(data)
      this.selections = data
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
      this.loading = true;
      getApproveQuickQuery({
        logic: "or",
        filters: this.filters,
        queryFilter: ["name","url","sort", "rightscode","outcomes"],
        ...this.quickData,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          this.content = rt.data;
          this.page.total = rt.data.total
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    saveSuccess(data) {
      if (data) {
        if (this.searchType === "power") {
          this.getData();
        } else if (this.searchType === "quick") {
          this.quickQueryData();
        }
      }
    },
    addList(item, data) {
      if (item === this.$t('addApprovalType')) {
        this.dialogVisible = true;
        this.linkTitle = item;
        this.editItem = {};
      } else if (item === this.$t('editApprovalType')) {
        this.dialogVisible = true;
        this.linkTitle = item;
        this.editItem = Object.assign({}, data);
      }
    },
    getData() {
      this.loading = true;
      this.checkAll = false;
      getApproveQuickQuery({
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
</style>
