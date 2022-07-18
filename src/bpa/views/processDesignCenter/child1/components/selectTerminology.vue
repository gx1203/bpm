<template>
  <div v-if="isDialogsVisible" id="terminology" class="w100">
    <el-dialog :append-to-body="true" width="1000px" :visible.sync="isDialogsVisible" title="选择术语" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-scrollbar class="left_tree_wrapper">
            <enter-tree @conClick="nodeClick" :isOperation="false" />
          </el-scrollbar>
        </el-col>
        <el-col :span="18">
          <el-row>
            <el-col :span="8">
              <el-input :placeholder="$t('placeholderText.pleaseEnterTheProcessCodeProcessNameAndTermInterpretation')"
                :title="$t('placeholderText.pleaseEnterTheProcessCodeProcessNameAndTermInterpretation')" class="search_component" v-model="keyWords" clearable
                @keyup.13.native="singleSearch">
                <el-button  slot="append" @click="singleSearch"> {{$t('search')}}</el-button>
              </el-input>
            </el-col>
          </el-row>
          <!-- 信息表格 -->
          <el-table
            v-if="!isMore"
            :data="terminologyList"
            class="main_tab"
            stripe
            :header-cell-style="{background: '#E1EAFD !important'}"
            highlight-current-row
            @current-change="handleCurrentChange"
          >
            <el-table-column :label="$t('number')" type="index"></el-table-column>
            <el-table-column prop="code" :label="$t('processNumber')" show-overflow-tooltip></el-table-column>
            <el-table-column prop="term" :label="$t('termName')" show-overflow-tooltip></el-table-column>
            <el-table-column prop="termdetail" :label="$t('termExplanation')" show-overflow-tooltip></el-table-column>
            <el-table-column prop="createon" :label="$t('releaseTime')" show-overflow-tooltip></el-table-column>
            <el-table-column label="选择" width="60" align="center">
              <template slot-scope="scope">
                <el-radio v-model="selectIndex" :label="scope.$index" class="radioEmpty">
                  {{ '' }}
                </el-radio>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            v-else
            :data="terminologyList"
            class="main_tab"
            stripe
            :header-cell-style="{background: '#E1EAFD !important'}"
            highlight-current-row
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" fixed align="center" />
            <el-table-column :label="$t('number')" type="index"></el-table-column>
            <el-table-column prop="code" :label="$t('processNumber')" show-overflow-tooltip></el-table-column>
            <el-table-column prop="term" :label="$t('termName')" show-overflow-tooltip></el-table-column>
            <el-table-column prop="termdetail" :label="$t('termExplanation')" show-overflow-tooltip></el-table-column>
            <el-table-column prop="createon" :label="$t('releaseTime')" show-overflow-tooltip></el-table-column>
            <el-table-column label="选择" width="60" align="center">
              <template slot-scope="scope">
                <el-radio v-model="selectIndex" :label="scope.$index" class="radioEmpty">
                  {{ '' }}
                </el-radio>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="margin-top: 10px;"
            :current-page.sync="pages.pageNum"
            :page-sizes="[10, 15, 20]"
            :page-size="pages.pageSize"
            background
            layout="prev, pager, next, jumper, total"
            :total="pages.total"
            @current-change="getList()"
          />
          <!--</el-scrollbar>-->
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialogsVisible = false">{{ $t('cancelAction') }}</el-button>
        <el-button type="primary" @click="submit">{{ $t('confirmButton') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBooksList,
  getRuleIframeTree,
  queryEnterpriseStandardFolderTreeId
} from '@/bpa/api/rulesCenter/handbookFiles'
import paginations from '@/bpa/mixins/pagination_mixin'
import fileOperation from '@/bpa/mixins/fileDownView'
import { getFormateDate } from '@/bpa/utils/common'
import enterTree from '@/bpa/views/settings/wordsManage/components/index.vue'
import { getTerminologyList } from '@/bpa/api/processModelCenter/terminology'

export default {
  components: {
    enterTree
  },
  mixins: [paginations, fileOperation],
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
      modelid: '',
      terminologyList: [],
      keyWords: '',
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      isDialogsVisible: false,
      multipleSelection: [],
      selectIndex: -1
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.isDialogsVisible = val
      } else {
        this.pages.pageNum = 1
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
      if (this.isMore) {
        const data = JSON.parse(JSON.stringify(this.multipleSelection))
        this.$emit('confirm', data)
      } else {
        if (this.selectIndex >= 0) {
          const data = JSON.parse(JSON.stringify(this.terminologyList[this.selectIndex]))
          this.$emit('confirm', data)
        }
      }
      this.isDialogsVisible = false
    },
    nodeClick(node, data) {
      this.modelid = node.data.id === '8' ? '' : node.data.id
      this.getList()
    },
    // 单选
    handleCurrentChange(val) {
      if (val) {
        this.selectIndex = this.terminologyList.findIndex(item => item.id === val.id)
      }
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getList () {
      getTerminologyList({
        fullFilters: [
          {
            filters: [
              { key: 'folderid', opt: 'EQ', type: 'S', value: this.modelid}
            ],
            logic: 'and'
          },
          {
            filters: [
              { key: 'term', opt: 'LIKE', type: 'S', value: this.keyWords, logic: 'or' },
              { key: 'termdetail', opt: 'LIKE', type: 'S', value: this.keyWords, logic: 'or' },
              { key: 'code', opt: 'LIKE', type: 'S', value: this.keyWords, logic: 'or' }
            ],
            logic: 'and'
          }
        ],
        logic: 'and',
        orderby: 'createon',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: 'desc'
      }).then(res => {
        if (!res) return false
        this.terminologyList = res.list
        this.pages.total = res.total
      })
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
