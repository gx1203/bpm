<template>
  <el-dialog
    title="成员授权分配"
    :visible.sync="dialogVisible"
    id="allocationDialog"
    class="userDialog"
    width="50%"
    append-to-body
    top="2vh"
  >
  <div class="tool-common-wrap">
      <div class="btn-wrap">
        <el-button type="primary" @click="userHandle">
          新增组织
          <!---->
        </el-button>
        <el-button type="primary">
          {{ $t('batchDelete') }}
          <!--<i class="el-icon-circle-close" />-->
        </el-button>
        <el-button type="primary">
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
    <el-row :gutter="18">
      <el-col :span="24" style="height: 400px;">
        <el-table
          :data="userData.list"
          :v-loading="pageLoading"
          border
          :header-cell-style="{'text-align':'center'}"
          style="width: 100%; margin-bottom: 10px"
          ref="multipleTable"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            prop="cnname"
            align="center"
            :label="$t('name2')"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="sex"
            label="类型"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{userData.list[scope.$index].sex === '0' ? '男' : '女'}}</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('operation')"
            align="center"
            show-overflow-tooltip>
            <template>
              <el-tooltip class="item" :content="$t('delete')">
                  <el-button type="text" icon="el-icon-delete"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          v-if="userData.list && userData.list.length > 0"
          @current-change="handleCurrentChange"
          :page-size="pageSize"
          :current-page.sync="pageNum"
          :total="userData.total"
        ></el-pagination>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('confirm') }}</el-button>
    </span>
      <organization-dialog v-model="addDialogVisible" @confirm="getFlow"></organization-dialog>
  </el-dialog>
</template>

<script>
import organizationDialog from '@/bpm/components/organization/organizationDialog'
import { getDirectUserByOrgid } from "@/bpm/api/flow/index";
export default {
  components: {
    organizationDialog
  },
  data() {
    return {
      id: 14246,
      searchForm: {},
      dialogVisible: false,
      addDialogVisible: false,
      highlight: false,
      props: {
        label: "NAME"
      },
      linkTitle: {},
      userData: {},
      filterText: "",
      selectIndex: -1,
      pageLoading: false,
      multipleSelection: [],
      pageSize: 8,
      pageNum: 1
    };
  },
  props: {
    value: {
      type: Boolean
    },
    isMore: {
      type: Boolean
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
      if (val) {
        this.getUser();
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    userHandle () {
      this.addDialogVisible = true
      this.linkTitle = '新增组织'
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.NAME.indexOf(value) !== -1;
    },
    confirm() {
      this.dialogVisible = false
      this.$emit('confirm', this.multipleSelection)
    },
    handleNodeClick(data) {
    },
    getFlow(data) {
    },
    getUser() {
      this.pageLoading = true;
      getDirectUserByOrgid({
        attr: {
          orgid: 40436
        },
        logic: "or",
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        filters: []
      }).then(rt => {
        this.pageLoading = false;
        this.userData = rt.data;
      });
    },
    handleCurrentChange(val) {
      this.selectIndex = -1;
      this.getUser();
    },
    handleSelectedChange(val) {
      if (val) {
        this.highlight = true;
        this.selectIndex = this.userData.list.findIndex(
          item => item.cnname === val.cnname
        );
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    close(i) {
      this.highlight = false;
      this.selectIndex = -1;
    },
    search() {},
    reset() {}
  }
};
</script>
<style lang="scss">

#allocationDialog{
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>

<style lang="scss" scoped>
</style>
