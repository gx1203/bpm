<template>
  <el-dialog :append-to-body="true" width="600px" :visible.sync="isDialogsVisible" :title="$t('hintText.hint')" :close-on-click-modal="false" :close-on-press-escape="false">
    <p class="margin-b15" style="color: #333333;">
      <i class="el-icon-warning font20 margin-r10" style="color: #e6a23c;"></i>
      {{ $t("hintText.defaultVersionHint1") }} {{ defaultVersion.version }}，{{ $t("hintText.defaultVersionHint2") }}
    </p>
    <el-table
      :data="versionList"
      class="main_tab"
      stripe
      :header-cell-style="{ background: '#E1EAFD !important' }"
      max-height="400"
      highlight-current-row
      @current-change="handleCurrentChange"
    >
      <el-table-column label="选择" width="60" align="center">
        <template slot-scope="scope">
          <el-radio v-model="selectIndex" :label="scope.$index" class="radioEmpty">
            {{ '' }}
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="version" :label="$t('version')" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createtime" :label="$t('versionReleaseTime')" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.createtime | formatDateTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isDialogsVisible = false">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('confirmButton') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getProcessQuickQuery } from "@/bpm/api/process/processModeling/process_manage";
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      versionList: [],
      isDialogsVisible: false,
      selectIndex: -1,
      defaultVersion: {}
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.selectIndex = -1
        this.defaultVersion = {}
        this.isDialogsVisible = val
        this.getList()
      }
    },
    isDialogsVisible(val) {
      this.$emit('input', val)
    }
  },
  mounted() {
  },
  methods: {
    submit() {
      if (this.selectIndex >= 0) {
        const data = JSON.parse(JSON.stringify(this.versionList[this.selectIndex]))
        this.$emit('confirm', data)
        this.isDialogsVisible = false
      } else {
        this.$message.error(
          this.$t("hintText.pleaseSelectTheHistoricalVersion")
        );
      }
    },
    // 单选
    handleCurrentChange(val) {
      if (val) {
        this.selectIndex = this.versionList.findIndex(item => item.id === val.id)
      }
    },
    getList () {
      this.loading = true;
      getProcessQuickQuery({
        logic: "and",
        filters: [
          { key: "bpaprocessid", opt: "EQ", type: "S", value: this.item.id },
          {
            key: "history",
            opt: "EQ",
            type: "S",
            value: "Y"
          }
        ],
        pageNum: 1,
        pageSize: 100000
      })
        .then(rt => {
          if (rt.status === '200' && rt.data) {
            this.versionList = rt.data.list || [];
            this.loading = false;
            this.selectIndex = this.versionList.findIndex(item => item.isdefault === 'Y')
            if (this.selectIndex >= 0) {
              this.defaultVersion = this.versionList[this.selectIndex]
            }
          }
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
}
</script>

<style lang="scss" scoped>
  .search_component {
    margin-bottom: 15px;
    max-width: 240px;
    vertical-align: middle;
    /deep/ .el-input__inner{
      border-color: #2d42af;
    }
    /deep/ .el-input-group__append {
      background-color: #2d42af;
      border-color: #2d42af;
      &:hover {
        background-color: #5768bf;
        border-color: #5768bf;
      }
      span {
        color: #fff;
      }
    }
  }
  .left_tree_wrapper.el-scrollbar {
    height: 450px!important;
    .custom-tree-node {
      width: calc(100% - 24px);
      display: flex;
      align-items: center;
      box-sizing: border-box;
      p {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .rightPart {
    height: calc(100vh - 160px) !important;
  }
</style>
