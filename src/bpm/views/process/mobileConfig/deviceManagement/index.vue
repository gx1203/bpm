<template>
  <el-card shadow="never">
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <quick-query :isDate="false" ref="quick" @quickSearch="quickSearch" />
      </div>
      <div class="btn-wrap">
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
          <el-form-item label="设备唯一编号：">
            <el-input clearable type="text" v-model="searchForm.device_channelid"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备登录用户：">
            <el-input clearable type="text" v-model="searchForm.user_id"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="平台类型：">
            <el-input clearable type="text" v-model="searchForm.platform"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="登录时间：">
            <el-date-picker
              v-model="searchForm.login_date"
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
          <el-form-item label="最后推送时间：">
            <el-date-picker
              v-model="searchForm.push_date"
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
            <el-select clearable v-model="searchForm.status" :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
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
          <el-form-item :label="$t('remarks') + '：'">
            <el-input clearable type="text" v-model="searchForm.remark"></el-input>
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
      <el-checkbox v-model="checkAll" class="all-check" />
      <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort" />
    </div>
      <div v-if="content.list && content.list.length!==0">

    <div class="tr" v-for="(item, index) in content.list" :key="index">
      <div class="tr-title">
        <el-checkbox v-model="item.checked" style="margin-right: 10px" />
        <span>登录时间：{{item.login_date | formatDateTime}}</span>
        <span style="margin-left: 60px">最后推送时间：{{item.push_date | formatDateTime}}</span>
      </div>
      <el-row class="tr-body" type="flex" align="middle">
        <el-col class="td" :span="headers[0].span">{{item.device_channelid}}</el-col>
        <el-col class="td" :span="headers[1].span">{{item.user_id}}</el-col>
        <el-col class="td" :span="headers[2].span">{{item.platform}}</el-col>
        <el-col class="td" :span="headers[3].span">{{item.status==="N"?'禁用':'启用'}}</el-col>
        <el-col class="td" :span="headers[4].span">{{item.remark}}</el-col>
        <el-col style="text-align: center" :span="headers[5].span">
          <el-switch v-model="item.status" active-value="Y" inactive-value="N" @change="isDisable(item)"></el-switch>
          <el-tooltip :content="$t('edit')">
            <el-button type="text" icon="el-icon-edit" @click="addList(item)"></el-button>
          </el-tooltip >
          <!-- <el-button type="text" icon="el-icon-delete"></el-button> -->
        </el-col>
      </el-row>
    </div>
    </div>
      <div v-else class="text-c pad-10px tr-empty"> {{ $t('noData') }}</div>

    <el-pagination
      style="margin-top: 15px"
      :page-size="page.pageSize"
      :current-page.sync="page.pageNum"
      background
      @current-change="getData"
      :total="content.total"
    ></el-pagination>
        <device-management-dialog
      v-model="dialogVisible"
      :item="editItem"
      :title="linkTitle"
      @confirm="saveSuccess"
    />
  </el-card>
</template>

<script>
import QuickQuery from "@/bpm/components/quickquery/QuickQuery";
import SearchListMixin from "@/bpm/mixins/search_list_mixin";
import deviceManagementDialog from "./deviceManagementDialog";
import {
  getMobileList,
  deleteMobile,
  batchDeleteMobile,
  saveMobile
} from "@/bpm/api/process/mobileConfig/device_management";
export default {
  mixins: [SearchListMixin],
  components: {
    QuickQuery,
    deviceManagementDialog
  },
  data() {
    return {
      options: [
        {
          value: "Y",
          label: "已启用"
        },
        {
          value: "N",
          label: "已禁用"
        }
      ],
      isPowerSearch: false,
      dialogVisible: false,
      editItem: {},
      linkTitle: "",
      headers: [
        {
          key: "device_channelid",
          name: "设备唯一编号",
          span: 7
        },
        {
          key: "user_id",
          name: "设备登陆用户",
          span: 7
        },
        {
          key: "platform",
          name: "平台类型",
          span: 7
        },
        {
          key: "status",
          name: this.$t('state'),
          span: 7
        },
        {
          key: "remark",
          name:  this.$t('remarks'),
          span: 7
        },
        {
          name: this.$t('operation'),
          span: 7
        }
      ],
      selections: [],
      checkAll: ""
    };
  },
  methods: {
    handleDeleteOne(item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: "warning"
      })
        .then(() => {
          deleteMobile(item.menuid).then(rt => {
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
          batchDeleteMobile(
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
    addList(data) {
        this.dialogVisible = true;
        this.linkTitle = '编辑移动设备管理';
        this.editItem = Object.assign({}, data);
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
    isDisable(item) {
      saveMobile(item)
        .then(rt => {
          if (rt.status === "200") {
            this.$message({
              message: this.$t('hintText.saveSuccessfully'),
              type: "success"
            });
            if (this.searchType === "power") {
              this.getData();
            } else if (this.searchType === "quick") {
              this.quickQueryData();
            }
          } else {
            item.status = item.status ==='Y'?'N':'Y'
            this.$message({
              message: this.$t('hintText.failToSave'),
              type: "error"
            });
          }
        })
        .catch(() => {
          item.status = item.status ==='Y'?'N':'Y'
        });
    },
    getData() {
      this.loading = true;
      this.checkAll = false;
      getMobileList({
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
