<template>
  <div id="terminology" class="pageWrap">
    <div class="pageContent">
      <div class="leftTree">
        <div class="left_tree_wrapper">
          <enter-tree @conClick="nodeClick" :isOperation="false" />
        </div>
      </div>
      <div class="listContent">
        <el-row class="margin-b10">
          <el-col :span="8">
            <bas-search
              :placeholder="$t('placeholderText.pleaseEnterTheProcessCodeProcessNameAndTermInterpretation')"
              v-model="keyWords"
              @fnSearch="singleSearch"
            />
          </el-col>
        </el-row>
        <el-table :data="terminologyList" class="main_tab" stripe>
          <el-table-column :label="$t('number')" type="index"></el-table-column>
          <el-table-column prop="code" :label="$t('processNumber')"></el-table-column>
          <el-table-column prop="term" :label="$t('termName')"></el-table-column>
          <el-table-column prop="termdetail" :label="$t('termExplanation')"></el-table-column>
          <el-table-column :label="$t('createTime')">
            <template v-slot="slotProps">
              {{slotProps.row.createon | formatDateTime}}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pages.pageNum"
          :page-size="pages.pageSize" background layout="prev, pager, next, jumper, total" :total="pages.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getTerminologyList } from '@/bpa/api/processModelCenter/terminology'
import paginations from '@/bpa/mixins/pagination_mixin'
import enterTree from '@/bpa/views/settings/wordsManage/components/index.vue'
export default {
  components: {
    enterTree
  },
  data () {
    return {
      terminologyList: [],
      isHighSearch: false,
      keyWords: '',
      searchForm: {},
      form: {},
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      modelid: ''
    }
  },
  mixins: [paginations],
  mounted () {
    this.getList()
  },
  methods: {
    nodeClick(node) {
      this.modelid = node.data.id === '8' ? '' : node.data.id
      this.getList()
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
#terminology {
  background-color: white;
}
</style>
