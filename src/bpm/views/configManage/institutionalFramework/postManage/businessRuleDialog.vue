<template>
  <el-dialog
    :title="$t('businessRule')"
    :visible.sync="dialogVisible"
    width="50%"
    append-to-body
    class="userDialog"
    top="2vh"
  >
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
          <el-form-item :label="$t('processName') + '：'">
            <el-input clearable type="text" v-model="searchForm.reqNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('businessRuleName') + '：'">
            <el-input clearable type="text" v-model="searchForm.reqNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('nodeName') + '：'">
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
          v-if="!isMore"
          :data="userData.list"
          border
          :v-loading="pageLoading"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          style="width: 100%; margin-bottom: 10px"
          :highlight-current-row="highlight"
          @row-click="handleSelectedChange"
        >
          <el-table-column prop="cnname" :label="$t('processName')" show-overflow-tooltip></el-table-column>
          <el-table-column prop="cnname" :label="$t('businessRuleName')" show-overflow-tooltip></el-table-column>
          <el-table-column prop="cnname" :label="$t('nodeName')" show-overflow-tooltip></el-table-column>
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
  </el-dialog>
</template>

<script>
import { getTotalOrg1, getDirectUserByOrgid } from "@/bpm/api/flow/index";
export default {
  data() {
    return {
      id: 14246,
      searchForm: {},
      dialogVisible: false,
      highlight: false,
      props: {
        label: "NAME",
        isLeaf: 'isParent'
      },
      treeData: [],
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
        this.getDepartment();
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
    filterNode(value, data) {
      if (!value) return true;
      return data.NAME.indexOf(value) !== -1;
    },
    getDepartment() {
      getTotalOrg1({
        pid: this.id,
        type: "0,1,2,4"
      })
        .then(rt => {
           rt.data.forEach(item => {
          item.isParent = false
        });
          this.treeData = rt.data;
        })
        .catch(er => {
          console.log(er);
        });
    },
    handleNodeClick(data) {
    },
     toBoolean(val){
    　　switch (val.toLowerCase()){
    　　　　case "true": case 1: case "yes": return true;
    　　　　case "false": case 0: case "no": case null: return false;
    　　　　default:return Boolean(val);
    　　}
    },
    loadNode(node, resolve) {
      if (node.level > 0) {
        getTotalOrg1({
          pid: node.data.ID,
          type: "0,1,2,4"
        })
          .then(rt => {
              rt.data.forEach(item => {
          item.isParent = !this.toBoolean(item.isParent)
        });
            resolve(rt.data);
          })
          .catch(er => {
            console.log(er);
          });
      }
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
</style>

<style lang="scss" scoped>
</style>
