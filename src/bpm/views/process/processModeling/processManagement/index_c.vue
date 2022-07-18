<template>
  <el-card shadow="never" id="processManagement">
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <quick-query
          :placeholder="$t('placeholderText.multipleFieldsPlaceholder27')"
          :isDate="false"
          ref="quick"
          @quickSearch="quickSearch"
        />
      </div>
      <div class="btn-wrap">
        <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
          {{ $t('advancedQuery') }}
          <i :class="isPowerSearch?'el-icon-caret-top':'el-icon-caret-bottom'" />
        </el-button>
        <!-- <el-button type="primary" @click="synchronization">
          同步
          <i class="el-icon-user-solid" />
        </el-button> -->
        <el-button type="primary" @click="rest">
           {{ $t('refresh') }}
          <!--<i class="el-icon-refresh" />-->
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
          <el-form-item :label="$t('processChineseName') + '：'">
            <el-input clearable type="text" v-model="searchForm.processnamecn"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('processName2') + '：'">
            <el-input clearable type="text" v-model="searchForm.processname"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('versionNumber') + '：'">
            <el-input clearable type="text" v-model="searchForm.version"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('defaultPage') + '：'">
            <el-select clearable type="text" v-model="searchForm.isdefault" class="w100">
              <el-option value="Y" :label="$t('yes')"></el-option>
              <el-option value="N" :label="$t('no')"></el-option>
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
      <div v-if="$store.state.app.tableStyle ==='default'">
        <!--<sort-button :items="headers" @sort="handleSort" />-->
        <div class="table-header margin-t10">
          <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort" />
        </div>
        <div v-if="content.list && content.list.length!==0">
          <div class="tr" v-for="(item, index) in content.list" :key="index">
            <div class="tr-title">&nbsp;
            </div>
            <el-row class="tr-body" type="flex" align="middle">
              <el-col class="td" :span="headers[0].span">
                <p :title="item.processnamecn">{{item.processnamecn}}</p>
              </el-col>
              <el-col class="td" :span="headers[1].span">
                <p :title="item.processname">{{item.processname}}</p>
              </el-col>
              <el-col class="td" :span="headers[2].span">
                <p :title="item.version">{{item.version}}</p>
              </el-col>
              <el-col class="td" :span="headers[3].span">
                <p :title="item.createtime">{{item.createtime | formatDateTime }}</p>
              </el-col>
              <el-col class="td" :span="headers[4].span">
                <el-switch
                  v-model="item.isdefault"
                  active-value="Y"
                  inactive-value="N"
                  @change="isDefault(item)"
                ></el-switch>
                <!-- {{item.isdefault==='N'?'否':'是'}} -->
              </el-col>
              <el-col style="text-align: center" :span="headers[5].span">
                <el-tooltip class="item" effect="dark" :content="$t('flowChart')" placement="top">
                  <el-button
                          type="text"
                          style="font-size: 18px"
                          icon="iconfont icon-liuchengtu"
                          @click="getInstanceImage(item.processname)"
                  ></el-button>
                </el-tooltip>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-else class="text-c pad-10px tr-empty"> {{ $t('noData') }}</div>
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
          <el-table-column :label="$t('processChineseName')" show-overflow-tooltip sortable prop="processnamecn">
          </el-table-column>
          <el-table-column :label="$t('processName2')" show-overflow-tooltip sortable prop="processname">
          </el-table-column>
          <el-table-column :label="$t('versionNumber')" show-overflow-tooltip sortable prop="version">
          </el-table-column>
          <el-table-column :label="$t('createTime')" show-overflow-tooltip sortable prop="createtime">
            <template slot-scope="scope">
              <span>{{scope.row.createtime | formatDateTime }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('defaultPage')" show-overflow-tooltip sortable prop="isdefault">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isdefault"
                active-value="Y"
                inactive-value="N"
                @change="isDefault(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column :label="$t('flowChart')" width="80">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="$t('flowChart')" placement="top">
                <el-button
                  type="text"
                  style="font-size: 18px"
                  icon="iconfont icon-liuchengtu"
                  @click="getInstanceImage(scope.row.processname)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-pagination
      class="margin-t15"
      :page-size="page.pageSize"
      :current-page.sync="page.pageNum"
      background
      @current-change="searchType === 'power' ? getData() : quickQueryData()"
      :total="content.total"
    ></el-pagination>
    <instance-image-dialog v-model="dialogVisible" :instanceId="instanceId" />
  </el-card>
</template>
<script>
import QuickQuery from "@/bpm/components/quickquery/QuickQuery";
import SearchListMixin from "@/bpm/mixins/search_list_mixin";
import InstanceImageDialog from "@/bpm/components/startInstanceImage/InstanceImageDialog";
import {
  getProcessVersionList,
  getProcessQuickQuery,
  saveProcess,
  sysnVersion
} from "@/bpm/api/process/processModeling/process_manage";
export default {
  name:'stagingPersonalProcessManagement',
  mixins: [SearchListMixin],
  components: {
    QuickQuery,
    InstanceImageDialog
  },
  data() {
    return {
      dialogVisible: false,
      instanceId: "",
      searchForm: {},
      headers: [
        {
          key: "processnamecn",
          name: this.$t('processChineseName'),
          span: 5
        },
        {
          key: "processname",
          name: this.$t('processName2'),
          span: 5
        },
        {
          key: "version",
          name: this.$t('versionNumber'),
          span: 3
        },
        {
          key: "createtime",
          name: this.$t('createTime'),
          span: 5
        },
        {
          key: "isdefault",
          name: this.$t('defaultPage'),
          span: 3
        },
        {
          name: this.$t('flowChart'),
          span: 3
        }
      ]
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    isDefault(item) {
      saveProcess(item)
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
            item.isdefault = item.isdefault === "Y" ? "N" : "Y";
            this.$message({
              message: this.$t('hintText.failToSave'),
              type: "error"
            });
          }
        })
        .catch(() => {
          item.isdefault = item.isdefault === "Y" ? "N" : "Y";
        });
    },
    quickQueryData() {
      this.loading = true;
      getProcessQuickQuery({
        logic: "or",
        filters: this.filters,
        queryFilter: ["processnamecn", "processname", "version", "isdefault"],
        ...this.quickData,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          this.content = rt.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    synchronization() {
      sysnVersion()
        .then(rt => {
          if (rt.status === "200") {
            this.$message({
              message: this.$t('hintText.syncSuccessfully'),
              type: "success"
            });
          } else {
            this.$message({
              message: this.$t('hintText.syncFailed'),
              type: "error"
            });
          }
        })
        .catch(() => {
          this.$message({
            message: this.$t('hintText.syncFailed'),
            type: "error"
          });
        });
    },
    getData() {
      this.loading = true;
      this.checkAll = false;
      getProcessQuickQuery({
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
    getInstanceImage(id) {
      this.instanceId = id;
      this.dialogVisible = true;
    }
  }
};
</script>

<style lang="scss" scoped>
#processManagement {
  .w100 {
    width: 100%;
  }
}
</style>
