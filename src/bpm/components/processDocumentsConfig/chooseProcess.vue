<template>
  <el-dialog v-if="dialogVisible" :append-to-body="true" width="1000px" :visible.sync="dialogVisible" :title="$t('processSelection')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-row :gutter="10">
      <div class="tool-common-wrap">
        <div class="search-wrap" style="float: right;">
          <el-input v-model="searchKey" clearable @keyup.enter.native="quickQueryData">
            <span slot="append" @click="quickQueryData">{{ $t('search') }}</span>
          </el-input>
        </div>
      </div>
      <!-- 信息表格 -->
      <el-table
        v-if="!isMore"
        v-loading="loading"
        :data="tableList"
        stripe
        :header-cell-style="{background: '#E1EAFD !important'}"
        highlight-current-row
        style="width: 100%; margin-top: 10px;"
        @current-change="handleCurrentChange"
      >
        <el-table-column :label="$t('number')" type="index" />
        <el-table-column prop="processnamecn" :label="$t('processName2')" show-overflow-tooltip />
        <el-table-column prop="currentframe" :label="$t('itBelongsToTheFinalFrame')" show-overflow-tooltip />
        <el-table-column prop="topframe" :label="$t('subordinateLevelFramework')" show-overflow-tooltip />
        <el-table-column :label="$t('select')" width="60" align="center">
          <template slot-scope="scope">
            <el-radio v-model="selectIndex" :label="scope.$index" class="radioEmpty">
              {{ '' }}
            </el-radio>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-else
        :data="tableList"
        stripe
        :header-cell-style="{background: '#E1EAFD !important'}"
        highlight-current-row
        style="width: 100%; margin-top: 10px;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" fixed align="center" />
        <el-table-column :label="$t('number')" type="index" />
        <el-table-column prop="processnamecn" :label="$t('processName2')" show-overflow-tooltip />
        <el-table-column prop="currentframe" :label="$t('itBelongsToTheFinalFrame')" show-overflow-tooltip />
        <el-table-column prop="topframe" :label="$t('subordinateLevelFramework')" show-overflow-tooltip />
      </el-table>
      <el-pagination
        style="margin-top: 15px"
        :page-size="pages.pageSize"
        :current-page.sync="pages.pageNum"
        background
        :total="pages.total"
        @current-change="quickQueryData()"
      />
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  queryProcessList
} from '@/bpm/api/process/processModeling/classificationModel'

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    isMore: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialogVisible: this.value,
      tableList: [],
      loading: false,
      searchKey: '',
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      multipleSelection: [],
      selectIndex: -1
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.dialogVisible = val
        if (val) {
          this.quickQueryData()
        }
      }
    },
    dialogVisible(val) {
      this.$emit('input', val)
    }
  },
  mounted() {
  },
  methods: {
    submit() {
      if (this.isMore) {
        const data = JSON.parse(JSON.stringify(this.multipleSelection))
        this.$emit('confirm', data)
      } else {
        if (this.selectIndex >= 0) {
          const data = JSON.parse(JSON.stringify(this.tableList[this.selectIndex]))
          this.$emit('confirm', data)
        }
      }
      this.dialogVisible = false
    },
    // 单选
    handleCurrentChange(val) {
      if (val) {
        this.selectIndex = this.tableList.findIndex(item => item.modelid === val.modelid)
      }
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    quickQueryData() {
      this.loading = true
      queryProcessList({
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        attr: {
          searchParam: this.searchKey
        }
      }).then(rt => {
        this.loading = false
        if (rt.data && rt.status === '200') {
          this.tableList = rt.data.list || []
          this.pages.total = rt.data.total
        }
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
