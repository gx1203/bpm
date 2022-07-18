<template>
  <el-card shadow="never">
    <div class="tool-common-wrap">
      <div class="btn-wrap">
        <el-button type="primary" @click="handleAdd">
          {{ $t('add') }}
          <!---->
        </el-button>
        <!-- <el-button type="primary" :disabled="selections.length === 0" @click="handleAllDelete">
          {{ $t('batchDelete') }}
          
        </el-button>-->
        <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
          {{ $t('advancedQuery') }}
          <i :class="isPowerSearch?'el-icon-caret-top':'el-icon-caret-bottom'" />
        </el-button>
        <el-button type="primary" @click="getData">
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
          <el-form-item label="单点账号：">
            <el-input clearable type="text" v-model="searchForm.displayname"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="TGPMS账号：">
            <el-input clearable type="text" v-model="searchForm.username"></el-input>
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
    <div id="out-table" v-loading="loading">
      <div class="table-header margin-t10">
        <!-- <el-checkbox v-model="checkAll" class="all-check" /> -->
        <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort" />
      </div>
      <div v-if="content.list && content.list.length!==0">
        <div class="tr" v-for="(item, index) in content.list" :key="index">
          <!-- <div class="tr-title">
          <el-checkbox v-model="item.checked" style="margin-right: 10px" />
          </div>-->
          <el-row class="tr-body" type="flex" align="middle">
            <el-col
              class="td textHide"
              :span="headers[0].span"
              :title="item.displayname"
            >{{item.displayname}}</el-col>
            <el-col
              class="td textHide"
              :span="headers[1].span"
              :title="item.username"
            >{{item.username}}</el-col>
            <el-col style="text-align: center" :span="headers[2].span">
              <el-tooltip class="item" effect="dark" :content="$t('edit')" placement="top">
                <el-button type="text" icon="el-icon-edit" @click="handleEdit(item)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
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
      @current-change="getData"
      :total="content.total"
    ></el-pagination>
    <edit-out-auth-dialog v-model="dialogVisible" :item="editItem" @confirm="saveSuccess" />
  </el-card>
</template>

<script>
import {
  empaccountQuery,
  empaccountDelete
} from "@/bpm/api/process/administrativeTool/tgpms.js";
import EditOutAuthDialog from "./outAuthorizationDialog";
export default {
  components: {
    EditOutAuthDialog
  },
  data() {
    return {
      isPowerSearch: false,
      searchForm: {},
      sort: {},
      page: {
        pageNum: 1,
        pageSize: 10
      },
      content: {},
      filters: [],
      selections: [],
      checkAll: false,
      loading: true,
      dialogVisible: false,
      editItem: {},
      headers: [
        {
          key: "displayname",
          name: "单点账号",
          span: 10
        },
        {
          key: "username",
          name: "TGPMS账号",
          span: 10
        },
        {
          name: this.$t('operation'),
          span: 4
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
    getStatusStr(status) {
      const result = this.statusArr.find(item => item.value === status);
      return result ? result.label : "未知";
    },
    // 获取数据
    getData() {
      this.loading = true;
      this.checkAll = false;
      empaccountQuery({
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
    // 搜索
    search() {
      this.filters = [];
      Object.keys(this.searchForm).forEach(key => {
        const filter = {
          key,
          opt: "LIKE",
          type: "S",
          value: this.searchForm[key]
        };
        if (key === "startDate" || key === "endDate") {
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
    // {{ $t('reset') }}
    rest() {
      this.searchForm = {};
      this.search();
    },
    handleSort(val) {
      this.sort = val;
      this.getData();
    },
    handleDeleteOne(item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: "warning"
      })
        .then(() => {
          empaccountDelete(item.id).then(rt => {
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
        .catch(_ => {});
    },
    handleAdd() {
      this.editItem = {};
      this.dialogVisible = true;
    },
    handleEdit(item) {
      this.editItem = JSON.parse(JSON.stringify(item));
      this.dialogVisible = true;
    },
    saveSuccess(data) {
      if (data) {
        this.getData();
      }
    }
  }
};
</script>

<style type="text/scss" lang="scss" scoped>
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
