<template>
  <el-card shadow="never" id="organization">
    <div class="item-left">
      <el-tree
        class="elTree"
        :props="props"
        :data="treeData"
        :load="loadNode"
        style="height: 100%;overflow: auto;"
        lazy
        node-key="id"
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
        :filter-node-method="filterNode"
        ref="tree"
      ></el-tree>
    </div>
    <div class="item-right" v-if="isShow">
      <el-card shadow="never">
        <div class="tool-common-wrap">
          <div class="btn-wrap">
            <el-button type="primary" @click="userHandle($t('addOrganization'))">
              {{ $t('add2') }}
              
            </el-button>
            <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
              {{ $t('advancedQuery') }}
              <i :class="isPowerSearch?'el-icon-caret-top':'el-icon-caret-bottom'" />
            </el-button>
            <el-button type="primary" @click="getData">
               {{ $t('refresh') }}
              
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
              <el-form-item :label="$t('name2') + '：'">
                <el-input clearable type="text" v-model="searchForm.reqNo"></el-input>
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
        <div v-loading="loading">
          <div v-if="$store.state.app.tableStyle ==='default'">
            <div class="table-header margin-t10">
              <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort" />
            </div>
            <div v-if="content.list && content.list.length!==0">
              <div class="tr" v-for="(item, index) in content.list" :key="index">
                <div class="tr-title">&nbsp;</div>
                <el-row class="tr-body" type="flex" align="middle">
                  <el-col class="td" :span="headers[0].span">{{item.drafter}}</el-col>
                  <el-col class="td" :span="headers[1].span">{{item.passReaderUserName}}</el-col>
                  <el-col style="text-align: center" :span="headers[2].span">
                    <el-tooltip class="item" :content="$t('delete')">
                      <el-button type="text" icon="el-icon-delete" @click="userHandle($t('delete'), item)"></el-button>
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
              <el-table-column :label="$t('name2')" show-overflow-tooltip sortable prop="passReaderUserName" />
              <el-table-column :label="$t('type')" show-overflow-tooltip sortable prop="passReaderUserName" />
              <el-table-column :label="$t('operation')"  width="150">
                <template slot-scope="scope">
                  <el-tooltip class="item" :content="$t('edit')">
                      <el-button type="text" icon="el-icon-edit" @click="userHandle($t('edit'), scope.row)"></el-button>
                    </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <organization-dialog
          v-model="dialogVisible"
          :title="linkTitle"
          :item="itemData"
          @confirm="saveSuccess"
        />
      </el-card>
    </div>
  </el-card>
</template>
<script>
import treeRouter from "../../components/treeRouter";
import organizationDialog from "@/bpm/components/organization/organizationDialog";
import { getNavigations } from "@/bpm/api/configManage/navConfig";

export default {
  components: {
    treeRouter,
    organizationDialog
  },
  data() {
    return {
      filterText: "",
      isShow: false,
      loading: false,
      isPowerSearch: false,
      dialogVisible: false,
      linkTitle: "",
      itemData: {},
      searchForm: {},
      headers: [
        {
          key: "passReaderUserName",
          name: this.$t('name2'),
          span: 8
        },
        {
          key: "passReaderUserName",
          name: this.$t('type'),
          span: 8
        },
        {
          name: this.$t('operation'),
          span: 8
        }
      ],
      selections: [],
      filters: [],
      content: {
        list: []
      },
      props: {
        label: "name",
        isLeaf: "isParent"
      },
      treeData: []
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.basuser.user;
    },
    key() {
      return this.$route.fullPath;
    }
  },
  mounted() {
    this.getDepartment();
  },
  methods: {
    getDepartment() {
      getNavigations(0)
        .then(rt => {
          this.treeData = rt.data;
        })
        .catch(er => {
          console.log(er);
        });
    },
    loadNode(node, resolve) {
      if (node.level > 0) {
        getNavigations(node.data.id)
          .then(rt => {
            rt.data.forEach(item => {
              if (item.type === "item") {
                item.isParent = true;
              }
            });
            resolve(rt.data);
          })
          .catch(er => {
            console.log(er);
          });
      }
    },
    handleNodeClick(data) {
      this.isShow = true;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    saveSuccess(value) {},
    getData() {
      this.loading = true;
      getAuthroleList({
        logic: "and",
        filters: this.filters,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          if (rt.status === "200") {
            rt.data.list.forEach(item => {
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
    handleSort(val) {
      this.sort = val;
      this.getData();
    },
    userHandle(item, data) {
      this.linkTitle = item;
      this.dialogVisible = true;
    },
    saveSuccess(data) {
      if (data) {
        this.getData();
      }
      this.dialogVisible = false;
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
        this.filters.push(filter);
      });
      this.getData();
    },
    reset() {
      this.searchForm = {};
      this.getData();
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  }
};
</script>
<style lang="scss">
#organization {
  .item-left {
    .el-input__inner {
      border: none;
      border-bottom: 1px solid $dc1;
    }
  }
}
</style>
<style lang="scss" scoped>
.item-left {
  float: left;
  width: 20%;
}
.item-right {
  float: right;
  width: 78%;
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
}
</style>
