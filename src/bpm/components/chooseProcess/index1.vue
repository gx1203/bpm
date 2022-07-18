<template>
  <el-dialog :title="$t('selectProcess')" :visible.sync="dialogVisible" append-to-body width="80%" top="2vh">
    <el-row :gutter="18">
      <el-col :span="6" style="height: 400px;overflow: scroll">
        <tree-process-flow ref="tree" type="0" @confirm="handleNodeClick" />
      </el-col>
      <el-col :span="18" style="height: 400px;overflow: scroll">
        <el-table
          v-if="!isMore"
          :data="userData"
          border
          :v-loading="pageLoading"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          style="width: 100%; margin-bottom: 10px"
          :highlight-current-row="highlight"
          @row-click="handleSelectedChange"
        >
          <el-table-column :label="$t('placeholderText.select')" width="100" align="center">
            <template slot-scope="scope">
              <el-radio v-model="selectIndex" :label="scope.$index">{{''}}</el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="processnamecn" :label="$t('processName2')" show-overflow-tooltip></el-table-column>
          <el-table-column prop="processname" label="流程英文名称" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-table
          v-else
          :data="userData"
          :v-loading="pageLoading"
          border
          :header-cell-style="{'text-align':'center'}"
          style="width: 100%; margin-bottom: 10px"
          ref="multipleTable"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center" width="100"></el-table-column>
          <el-table-column
            prop="processnamecn"
            align="center"
            :label="$t('processName2')"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="processname" label="流程英文名称" show-overflow-tooltip></el-table-column>
        </el-table>
        <!-- <el-pagination
          background
          v-if="userData && userData.length > 0"
          @current-change="handleCurrentChange"
          :page-size="pageSize"
          :current-page.sync="pageNum"
          :total="userData.total"
        ></el-pagination> -->
      </el-col>
    </el-row>
    <div style="margin-top: 10px;" v-if="selectIndex !== -1 && !isMore">
      <span style="color:#FFFFFF;background:#3792D8;display: inline-block;padding: 5px 10px;">
        {{userData[selectIndex].processnamecn}}
        <i
          @click="close"
          style="margin-left:5px;cursor: pointer;font-weight: 600;"
          class="el-icon-close"
        ></i>
      </span>
    </div>
    <div style="margin-top: 10px;" v-if="isMore">
      <span
        v-for="item in multipleSelection"
        :key="item.id"
        style="color:#FFFFFF;background:#3792D8;display: inline-block;padding: 5px 10px;margin-right:10px;"
      >{{item.processnamecn}}</span>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import treeProcessFlow from "../treeProcessFlow";
import {
  getProcessInfo
} from "@/bpm/api/process/processModeling/process_classification";
export default {
  components:{
    treeProcessFlow
  },
  data() {
    return {
      id: 14246,
      orgid: 14246,
      dialogVisible: false,
      highlight: false,
      props: {
        label: "NAME",
        isLeaf: "isParent"
      },
      treeData: [],
      userData: {},
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
    },
    itemList: {
      type: Array
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
      if (val) {
        // this.getDepartment();
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    handleNodeClick(data) {
      this.getProcess(data.id);
    },
    getProcess(id) {
      this.pageLoading = true;
      getProcessInfo(id).then(rt => {
        this.pageLoading = false;
        this.userData = rt.data;
        if (this.isMore && this.itemList) {
          this.check();
        }
      });
    },
    check() {
      let _this = this;
      setTimeout(() => {
        _this.userData.forEach(item => {
          _this.itemList.forEach(v => {
            if (item.userid === v) {
              if (_this.$refs.multipleTable) {
                _this.$refs.multipleTable.toggleRowSelection(item, true);
              }
            }
          });
        });
      }, 100);
    },
    handleCurrentChange(val) {
      this.selectIndex = -1;
      this.getProcess();
    },
    handleSelectedChange(val) {
      if (val) {
        this.highlight = true;
        this.selectIndex = this.userData.findIndex(
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
    confirm() {
      this.dialogVisible = false;
      if (this.isMore) {
        this.$emit("confirm", this.multipleSelection);
      } else {
        if (this.selectIndex > -1) {
          this.$emit("confirm", [this.userData[this.selectIndex]]);
        } else {
          this.$emit("confirm", []);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
