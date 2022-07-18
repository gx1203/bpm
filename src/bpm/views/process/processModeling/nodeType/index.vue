<template>
  <el-card shadow="never" class="card-reset">
    <div class="item-left">
      <!-- <tree-process type="1" @confirm="handleNodeClick" /> -->
      <BasProcessTree showView="1" @confirm="handleNodeClick" />
    </div>
    <div class="item-right" v-if="isShow">
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
                <!-- <quick-query :isDate="false" ref="quick" :isData="false" @quickSearch="quickSearch" /> -->
              </div>
              <div class="btn-wrap">
                <el-button type="primary" @click="addList($t('addNodeTypeConfiguration'))">
                  {{ $t('add') }}
                  <!--<i class="el-icon-circle-plus-outline" />-->
                </el-button>
                <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
                  {{ $t('advancedQuery') }}
                  <i :class="isPowerSearch?'el-icon-caret-top':'el-icon-caret-bottom'" />
                </el-button>
                <el-button type="primary" :disabled="selections.length === 0" @click="handleAllDelete">
                  {{ $t('batchDelete') }}
                  <!--<i class="el-icon-circle-close"/>-->
                </el-button>
                <el-button type="primary" @click="reset">
                  {{ $t('refresh') }}
                  <!---->
                </el-button>
              </div>
            </div>
            <el-form class="power-search" :model="searchForm" @keyup.enter.native="search" ref="searchForm"
              label-width="120px" size="mini" v-if="isPowerSearch">
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('chineseName') + '：'">
                    <el-input clearable type="text" v-model="searchForm.namecn"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('englishName2') + '：'">
                    <el-input clearable type="text" v-model="searchForm.nameen"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('sort') + '：'">
                    <el-input type="text" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
                      v-model="searchForm.sort"></el-input>
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
        <!-- 中文名称  -->
        <template #namecn="{ row }">
          <div>{{ row.namecn }}</div>
        </template>
        <!-- 英文名称  -->
        <template #nameen="{ row }">
          <div>{{ row.nameen }}</div>
        </template>
        <!-- 排序  -->
        <template #sort="{ row }">
          <div>{{ row.sort }}</div>
        </template>
        <!-- 操作 -->
        <template #id="{ row }">
          <el-button type="text" @click="addList($t('editNodeTypeConfiguration'),row)">
            {{ $t("edit") }}
          </el-button>
          <el-button type="text" @click="handleDeleteOne(row)">{{ $t("delete") }}</el-button>
        </template>
      </bas-table>
    </div>
    <add-node-dialog v-model="dialogVisible" :item="editItem" :title="linkTitle" @confirm="saveSuccess" />
  </el-card>
</template>

<script>
import Vue from 'vue'
import BasProcessTree from 'bas-component'
Vue.use(BasProcessTree)
import AddNodeDialog from "./AddNodeDialog";
// import treeProcess from "@/bpm/components/treeProcessFlow";
import QuickQuery from "@/bpm/components/quickquery/QuickQuery";
import SearchListMixin from "@/bpm/mixins/search_list_mixin";
import {
  getNodeTypeList,
  deleteNodeType,
  batchDeleteNodeType
} from "@/bpm/api/process/processModeling/node_type";
export default {
  name: 'stagingPersonalNodeType',
  mixins: [SearchListMixin],
  components: {
    AddNodeDialog,
    QuickQuery,
    // treeProcess
  },
  data () {
    return {
      dialogVisible: false,
      editItem: {},
      linkTitle: "",
      isShow: false,
      isPowerSearch: false,
      treeData: {},
      headers: [
        {
          key: "namecn",
          name: this.$t('chineseName'),
          span: 9
        },
        {
          key: "nameen",
          name: this.$t('englishName2'),
          span: 7
        },
        {
          key: "sort",
          name: this.$t('sort'),
          span: 5
        },
        {
          name: this.$t('operation'),
          span: 3
        }
      ],
      searchForm: {},
      filters: [],
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      sort: {},
      content: {
        total: 0
      },
      selections: [],
      checkAll: "",
      // 表头字段
      headerList: [
        {
          label: this.$t('chineseName'), // 中文名称
          prop: 'namecn',
          slotName: 'namecn',
          sortable: true
        },
        {
          label: this.$t('englishName2'), // 英文名字
          prop: 'nameen',
          slotName: 'nameen',
          sortable: true
        },
        {
          label: this.$t('sort'), // 排序
          prop: 'sort',
          slotName: 'sort',
          sortable: true
        },
        {
          label: this.$t('operation'), // 操作
          prop: 'id',
          slotName: 'id',
          sortable: false,
          width: "80"
        }
      ]
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
    handleDeleteOne (item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: "warning"
      })
        .then(() => {
          deleteNodeType(item.id).then(rt => {
            if (rt.status === "200") {
              this.getData();
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
    handleAllDelete () {
      this.$confirm(this.$t('hintText.areYouSureDeleteSelectedData'), this.$t('hintText.hint'), {
        type: "warning"
      })
        .then(() => {
          batchDeleteNodeType(
            this.selections.map(item => item.id).join(",")
          ).then(rt => {
            if (rt.status === "200") {
              this.getData();
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
    saveSuccess (data) {
      if (data) {
        this.getData();
      }
    },
    addList (item, data) {
      if (item === this.$t('addNodeTypeConfiguration')) {
        this.dialogVisible = true;
        this.linkTitle = item;
        this.editItem = {
          processName: this.treeData.name,
          processid: this.treeData.id
        };
      } else if (item === this.$t('editNodeTypeConfiguration')) {
        this.dialogVisible = true;
        this.linkTitle = item;
        data.processName = this.treeData.name
        data.processid = this.treeData.id
        this.editItem = Object.assign({}, data);
      }
    },
    handleNodeClick (data) {
      this.treeData = data
      if (data.type !== '1') {
        this.isShow = false
      } else {
        this.getData()
        this.isShow = true
      }
    },
    getData () {
      this.loading = true;
      this.checkAll = false;
      getNodeTypeList({
        attr: { processid: this.treeData.id },
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
    search () {
      this.filters = []
      Object.keys(this.searchForm).forEach(key => {
        const filter = {
          key,
          opt: 'LIKE',
          type: 'S',
          value: this.searchForm[key]
        }
        this.filters.push(filter)
      })
      this.getData()
    },
    reset () {
      this.searchForm = {}
      this.search()
    },
    handleSort (val) {
      this.sort = val
      this.getData()
    }
  }
};
</script>

<style lang="scss" scoped>
.card-reset {
  height: 100%;
  ::v-deep > .el-card__body {
    display: flex;
  }
}
.item-left {
  width: 250px;
  height: 100%;
  margin-right: 20px;
}
.item-right {
  flex: 1;
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
