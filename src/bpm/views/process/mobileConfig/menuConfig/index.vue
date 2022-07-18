<template>
  <el-card shadow="never">
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <quick-query :isDate="false" ref="quick" @quickSearch="quickSearch" />
      </div>
      <div class="btn-wrap">
        <el-button type="primary" @click="addList('添加菜单模块')">
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
          <el-form-item :label="$t('sort') + '：'">
            <el-input clearable type="number" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"  v-model="searchForm.sort"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="移动模块名称：">
            <el-input clearable type="text" v-model="searchForm.menuname"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="网页加载项：">
            <el-select clearable v-model="searchForm.iswebview" :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="移动端显示：">
            <el-select clearable v-model="searchForm.isShow" :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
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
      </div>
      <el-row class="tr-body" type="flex" align="middle">
        <el-col class="td" :span="headers[0].span">{{item.sort}}</el-col>
        <el-col class="td" :span="headers[1].span">{{item.menuname}}</el-col>
        <el-col class="td" :span="headers[2].span">{{item.iswebview==='Y'?'是':'否'}}</el-col>
        <el-col class="td" :span="headers[3].span">{{item.isShow==='Y'?'是':'否'}}</el-col>
        <el-col class="td" :span="headers[4].span">{{item.iconurl}}</el-col>
        <el-col class="td" :span="headers[5].span">&nbsp;{{item.webviewurl}}</el-col>
        <el-col style="text-align: center" :span="headers[6].span">
          <el-button type="text" icon="el-icon-edit" @click="addList('编辑菜单模块',item)"></el-button>
          <el-button type="text" icon="el-icon-delete" @click="handleDeleteOne(item)"></el-button>
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
    <menu-config-dialog
      v-model="dialogVisible"
      :item="editItem"
      :title="linkTitle"
      @confirm="saveSuccess"
    />
  </el-card>
</template>

<script>
import menuConfigDialog from "./menuConfigDialog";
import QuickQuery from "@/bpm/components/quickquery/QuickQuery";
import SearchListMixin from "@/bpm/mixins/search_list_mixin";
import {
  getMobileMenuList,
  deleteMobileMenu,
  quickQueryCenterList,
  batchDeleteMobileMenu
} from "@/bpm/api/process/mobileConfig/menu_config";
export default {
  mixins: [SearchListMixin],
  components: {
    menuConfigDialog,
    QuickQuery
  },
  data() {
    return {
      options: [
        {
          value: "Y",
          label: this.$t('yes')
        },
        {
          value: "N",
          label: this.$t('no')
        }
      ],
      loading: false,
      isPowerSearch: false,
      dialogVisible: false,
      searchForm: {},
      editItem: {},
      linkTitle: "",
      headers: [
        {
          key: "sort",
          name: this.$t('sort'),
          span: 3
        },
        {
          key: "menuname",
          name: "移动模块名称",
          span: 4
        },
        {
          key: "iswebview",
          name: "网页加载项",
          span: 3
        },
        {
          key: "isShow",
          name: "移动端显示",
          span: 3
        },
        {
          key: "iconurl",
          name: "图标地址",
          span: 4
        },
        {
          key: "webviewurl",
          name: "链接地址",
          span: 4
        },
        {
          name: this.$t('operation'),
          span: 3
        }
      ],
      content: {
        list: []
      },
      filters: [],
      sort: {},
      selections: [],
      page: {
        pageNum: 1,
        pageSize: 10
      },
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
  mounted() {
    this.getData();
  },
  methods: {
    handleDeleteOne(item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: "warning"
      })
        .then(() => {
          deleteMobileMenu(item.menuid).then(rt => {
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
    handleAllDelete() {
      this.$confirm(this.$t('hintText.areYouSureDeleteSelectedData'), this.$t('hintText.hint'), {
        type: "warning"
      })
        .then(() => {
          batchDeleteMobileMenu(
            this.selections.map(item => item.menuid).join(",")
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
        .catch(_ => {});
    },
    quickQueryData() {
      this.loading = true
      quickQueryCenterList({
        logic: 'or',
        filters: this.filters,
        ...this.sort,
        ...this.page
      }).then(rt => {
        this.content = rt.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    saveSuccess(data) {
      if (data) {
        this.getData();
      }
    },
    addList(item, data) {
      if (item === "{{ $t('add') }}菜单模块") {
        this.dialogVisible = true;
        this.linkTitle = item;
        this.editItem = {};
      } else if (item === "编辑菜单模块") {
        this.dialogVisible = true;
        this.linkTitle = item;
        this.editItem = Object.assign({},data);
      }
    },
    getData() {
      this.loading = true;
      this.checkAll = false;
      getMobileMenuList({
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
