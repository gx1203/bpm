<template>
  <el-card shadow="never" v-loading="loading">
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <quick-query :placeholder="$t('name2')" :isDate="false" ref="quick" @quickSearch="quickSearch" />
      </div>
      <div class="btn-wrap">
        <el-button type="primary" @click="rest">
           {{ $t('refresh') }}
          <!---->
        </el-button>
      </div>
    </div>
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
          <el-col class="td" :span="headers[0].span">
            <p :title="item.lastVersionId">{{item.lastVersionId}}</p>
          </el-col>
          <el-col class="td" :span="headers[1].span">
            <p :title="item.id">{{item.id}}</p>
          </el-col>
          <el-col class="td" :span="headers[2].span">
            <p :title="item.name">{{item.name}}</p>
          </el-col>
          <el-col class="td" :span="headers[3].span">
            <p :title="item.category">{{item.category}}</p>
          </el-col>
          <el-col class="td" :span="headers[4].span">
            <p :title="item.lastVersion">{{item.lastVersion}}</p>
          </el-col>
          <el-col class="td" :span="headers[5].span">
            <p :title="item.description">{{item.description}}</p>
          </el-col>
          <!--<el-col class="td" :span="headers[6].span">{{item.passReaderUserName}}</el-col>-->
          <el-col style="text-align: center" :span="headers[6].span">
            <el-tooltip class="item" effect="dark" :content="$t('flowChart')" placement="top">
              <el-button type="text" @click="getProcessDemo(item.lastVersionId)">
                <i class="iconfont icon-liuchengtu" style="font-size: 20px"></i>
              </el-button>
            </el-tooltip>
            <!--<el-button type="text">查看XML</el-button>-->
            <!--<el-button type="text">diagram-viewer</el-button>-->
            <!--<el-button type="text" @click="editProcess(item)">修改</el-button>-->
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
      @current-change="searchType === 'power' ? getData() : quickSearch()"
      :total="content.total"
    ></el-pagination>
    <addProcessDialog v-model="dialogExport" @confirm="handleSuccessExport" />
    <DefinitionImageDialog v-model="dialogVisible" :instanceId="instanceId" />
  </el-card>
</template>
<script>
import { getDefinitionList } from "@/bpm/api/process/processModeling/process_definition";
import addProcessDialog from "./addProcessDialog";
import DefinitionImageDialog from "./DefinitionImageDialog";
import QuickQuery from "@/bpm/components/quickquery/QuickQuery";
import SearchListMixin from "@/bpm/mixins/search_list_mixin";
export default {
  name:'processDefinition',
  mixins: [SearchListMixin],
  components: {
    QuickQuery,
    DefinitionImageDialog,
    addProcessDialog
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      dialogExport: false,
      isPowerSearch: false,
      linkTitle: "",
      editItem: {},
      headers: [
        {
          key: "id",
          name: this.$t('numbering'),
          span: 4
        },
        {
          name: this.$t('code'),
          span: 2
        },
        {
          key: "name",
          name: this.$t('name2'),
          span: 4
        },
        {
          name: this.$t('classify'),
          span: 4
        },
        {
          key: "version",
          name: this.$t('version'),
          span: 2
        },
        {
          name: this.$t('description'),
          span: 4
        },
        {
          name: this.$t('operation'),
          span: 4
        }
      ],
      selections: [],
      checkAll: "",
      instanceId: "",
      name: ""
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
    },
    name(val) {
      if (!val) {
        this.searchType = "quick";
      }
    }
  },
  mounted() {
    this.searchType = "power";
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      this.checkAll = false;
      getDefinitionList({
        // attr: {processid: this.treeData.id},
        attr: {},
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
    quickSearch(val) {
      this.searchType = "quick";
      if (val) {
        this.name = val.searchData;
      }
      this.loading = true;
      this.checkAll = false;
      this.filters = [];
      if (this.name) {
        this.filters = [
          {
            key: "name",
            opt: "LIKE",
            type: "S",
            value: this.name
          }
        ];
      } else {
        this.filters = [];
      }
      let data = {
        attr: {},
        logic: "and",
        filters: this.filters,
        ...this.sort,
        ...this.page
      };
      getDefinitionList(data)
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
    addList(type) {
      this.dialogExport = true;
    },
    getProcessDemo(id) {
      this.instanceId = id;
      this.dialogVisible = true;
    },
    reset() {
      if (this.searchType === "power") {
        this.filters = [];
        this.getData();
      } else if (this.searchType === "quick") {
        this.quickSearch();
      }
    },
    handleSuccessExport(val) {
      console.log(val);
      if (val) {
        this.reset();
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
</style>
