<template>
  <el-card shadow="never" id="organization">
    <div class="item-left">
      <tree-organization @confirm="handleNodeClick" />
    </div>
    <div class="item-right" v-if="isShow">
      <el-card shadow="never">
        <div class="tool-common-wrap">
          <div class="btn-wrap">
            <el-button type="primary" @click="userHandle($t('edit'))">
              {{ $t('edit') }}
              <i class="el-icon-edit" />
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
            <el-col :span="8">
              <el-form-item :label="$t('link') + '：'">
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
                <el-col class="td" :span="headers[2].span">{{item.passReaderUserName}}</el-col>
                <el-col style="text-align: center" :span="headers[3].span">
                  <el-tooltip class="item" :content="$t('edit')">
                    <el-button type="text" icon="el-icon-edit" @click="userHandle($t('edit'), item)"></el-button>
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
            <el-table-column label="ID" show-overflow-tooltip sortable prop="id" />
            <el-table-column :label="$t('name2')" show-overflow-tooltip sortable prop="passReaderUserName" />
            <el-table-column :label="$t('link')" show-overflow-tooltip sortable prop="passReaderUserName" />
            <el-table-column :label="$t('operation')"  width="150">
              <template slot-scope="scope">
                <el-tooltip class="item" :content="$t('edit')">
                    <el-button type="text" icon="el-icon-edit" @click="userHandle($t('edit'), scope.row)"></el-button>
                  </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <manage-dialog
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
import treeOrganization from "@/bpm/components/treeOrganization";
import manageDialog from "./manageDialog";
export default {
  components: {
    treeOrganization,
    manageDialog
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
          key: "drafter",
          name: "ID",
          span: 6
        },
        {
          key: "passReaderUserName",
          name: this.$t('name2'),
          span: 6
        },
        {
          key: "passReaderUserName",
          name: this.$t('link'),
          span: 6
        },
        {
          name: this.$t('operation'),
          span: 6
        }
      ],
      content: {
        list: []
      }
    };
  },
  methods: {
    handleNodeClick(data) {
      this.isShow = true;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    saveSuccess(value) {},
    refreshData() {},
    getData() {},
    handleSort(val) {
      this.sort = val;
    },
    userHandle(item, data) {
      this.linkTitle = item;
      this.dialogVisible = true;
    },
    saveSuccess(data) {
      if (data) {
      }
      this.dialogVisible = false;
    },
    search() {},
    reset() {}
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
