<template>
  <el-dialog
    :title="$t('selectProcess')"
    id="processDialog"
    :visible.sync="dialogVisible"
    append-to-body
    width="60%"
    top="2vh"
  >
    <el-row :gutter="18" v-loading="pageLoading">
      <el-col :span="6" style="height: 400px;overflow: scroll">
        <tree-process-flow ref="tree" type="0" @confirm="handleNodeClick" />
      </el-col>
      <el-col :span="18" style="height: 400px;overflow: scroll">
        <el-transfer
          v-model="transferData"
          :titles="['待选择', '已选择']"
          :data="userData"
          :props="{
                key: 'id',
                label: 'processname'
            }"
        >
          <p slot-scope="{ option }">{{option.processnamecn}}</p>
        </el-transfer>

        <!-- <el-table
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
        </el-table>-->
        <!-- <el-pagination
          background
          v-if="userData && userData.length > 0"
          @current-change="handleCurrentChange"
          :page-size="pageSize"
          :current-page.sync="pageNum"
          :total="userData.total"
        ></el-pagination>-->
      </el-col>
    </el-row>
    <!-- <div style="margin-top: 10px;" v-if="selectIndex !== -1 && !isMore">
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
    </div>-->
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import treeProcessFlow from "../treeProcessType";
import { getProcessInfo } from "@/bpm/api/process/processModeling/process_classification";
export default {
  components: {
    treeProcessFlow
  },
  data() {
    return {
      dialogVisible: false,
      transferData: [],
      highlight: false,
      props: {
        label: "NAME",
        isLeaf: "isParent"
      },
      treeData: [],
      userData: [],
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
    },
    dialogVisible(val) {
      this.$emit("input", val);
    },
    itemList(val) {
      if (this.itemList) {
        this.transferData = this.itemList.map(item => item.id);
        this.userData = this.itemList.map(item => {
          return {
            processnamecn: item.processName,
            id: item.id
          };
        });
      }
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
        rt.data = rt.data.filter(
          item => !this.transferData.some(ele => ele === item.id)
        );
        let dataList = this.userData.filter(item =>
          this.transferData.some(ele => ele === item.id)
        );
        this.userData = [...rt.data, ...dataList];
      });
    },
    confirm() {
      this.dialogVisible = false;
      this.$emit(
        "confirm",
        this.userData.filter(item =>
          this.transferData.some(ele => ele === item.id)
        )
      );
    }
  }
};
</script>


<style lang="scss" >
#processDialog {
  .el-input__inner {
    border: none;
    border-bottom: 1px solid $dc1;
  }
  .text-r {
    button {
      margin: 15px 10px;
    }
  }

  .el-transfer {
    .el-transfer-panel {
      width: calc(50% - 110px);
    }
    .el-checkbox {
      display: block;
    }
  }
}
</style>
</style>
