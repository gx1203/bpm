<template>
  <el-dialog v-if="dialogVisible" :append-to-body="true" width="1000px" :visible.sync="dialogVisible" :title="$t('relation')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane :label="$t('toolToMap')" name="first">
        <business-relation :toolsData="currentObj" />
      </el-tab-pane>
      <el-tab-pane :label="$t('associatedNode')" name="second">
        <!-- <div class="tool-common-wrap">
          <div class="search-wrap" style="float: right;">
            <el-input v-model="keyWords" clearable @keyup.enter.native="quickQueryData">
              <span slot="append" @click="quickQueryData">{{ $t('search') }}</span>
            </el-input>
          </div>
        </div> -->
        <el-table
          v-loading="loading"
          :data="tableList"
          stripe
          :header-cell-style="{background: '#E1EAFD !important'}"
          highlight-current-row
          style="width: 100%; margin-top: 10px;"
        >
          <el-table-column :label="$t('number')" type="index" />
          <el-table-column prop="nodeName" :label="$t('node')" show-overflow-tooltip />
          <el-table-column prop="listName" :label="$t('owningProcess')" show-overflow-tooltip />
        </el-table>
        <el-pagination
          style="margin-top: 15px"
          :page-size="pages.pageSize"
          :current-page.sync="pages.pageNum"
          background
          :total="pages.total"
          @current-change="quickQueryData()"
        />
      </el-tab-pane>
    </el-tabs>
    <el-row :gutter="10">
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getNodesByTool
} from "@/bpa/api/resourcelibraryCenter";
import businessRelation from '../businessRelation'

export default {
  components: {
    businessRelation
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    currentObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogVisible: this.value,
      tableList: [],
      loading: false,
      keyWords: '',
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      activeName: 'first'
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
      this.dialogVisible = false
    },
    quickQueryData() {
      this.loading = true
      getNodesByTool({
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        attr: {
          toolId: this.currentObj.id
        }
      }).then(rt => {
        this.loading = false
        this.tableList = rt.list || []
        this.pages.total = rt.total
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
