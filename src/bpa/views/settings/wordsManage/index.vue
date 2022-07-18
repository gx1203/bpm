<template>
  <div id="wordsManage" class="pageWrap">
    <div class="pageContent">
      <div class="leftTree">
        <div class="left_tree_wrapper">
          <enter-tree @conClick="nodeClick" />
        </div>
      </div>
      <div class="listContent">
        <bas-table
          row-key="id"
          :tableList="wordsList"
          :headerList="headerList"
          :pages="pages"
          selectType="checkbox"
          :selectable="checkSelectable"
          @selectionChange="handleSelectionChange"
          :isShowIndex="true"
          @currentChange="handleCurrentChange"
        >
          <template #search>
            <div>
              <el-row class="margin-b10">
                <el-col :span="6">
                  <bas-search
                    :placeholder="
                      $t(
                        'placeholderText.pleaseEnterTheProcessCodeProcessNameAndTermInterpretation'
                      )
                    "
                    v-model="keyWords"
                    @fnSearch="getList"
                  />
                </el-col>
                <el-col :span="6" :offset="12" class="search_buttons_wrap">
                  <div style="display: flex; justify-content: flex-end;">
                    <el-button type="primary" @click="mutipleDelteRows">{{
                      $t('batchDelete')
                    }}</el-button>
                    <el-button
                      v-if="modelid && modelid !== '8'"
                      type="primary"
                      @click="newRow"
                      >{{ $t('newAdd') }}</el-button
                    >
                  </div>
                </el-col>
              </el-row>
            </div>
          </template>

          <!-- 操作 -->
          <template #default="{ row }">
            <div v-if="!row.code">
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('modify')"
                placement="top"
              >
                <el-button
                  type="text"
                  class="no-border"
                  @click="editRow(row)"
                  >{{ $t('modify') }}</el-button
                >
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('delete')"
                placement="top"
              >
                <el-button
                  type="text"
                  class="no-border"
                  @click="deleteRow(row.id)"
                  >{{ $t('delete') }}</el-button
                >
              </el-tooltip>
            </div>
          </template>
        </bas-table>
      </div>
    </div>
    <!-- 添加术语弹框 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        label-width="120px"
        ref="ruleForm"
        :rules="wordsRules"
        :model="wordsInfo"
      >
        <el-form-item :label="$t('termName')" prop="term">
          <el-input
            clearable
            v-model="wordsInfo.term"
            maxlength="50"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('termExplanation')" prop="termdetail">
          <el-input
            clearable
            v-model="wordsInfo.termdetail"
            maxlength="50"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="handlerSaveClick">{{
          $t('confirm')
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getWordsList,
  deleteWord,
  saveWord
} from '@/bpa/api/settings/wordsManage'
import paginations from '@/bpa/mixins/pagination_mixin'
import enterTree from './components/index.vue'
export default {
  components: {
    enterTree
  },
  data() {
    return {
      // 表头字段
      headerList: [
        {
          label: this.$t('processCoding'),
          prop: 'code'
        },
        {
          label: this.$t('termName'),
          prop: 'term'
        },
        {
          label: this.$t('termExplanation'),
          prop: 'termdetail'
        },
        {
          label: this.$t('createTime'),
          prop: 'createon'
        },
        {
          label: this.$t('operation'),
          prop: 'default',
          slotName: 'default',
          tooltip: 'false'
        }
      ],
      wordsList: [],
      dialogVisible: false,
      keyWords: '',
      wordsInfo: {},
      title: '',
      selectionList: [],
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      wordsRules: {
        term: [{ required: true, message: ' ', trigger: 'blur' }],
        termdetail: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      textMaxLength: 50, // 文本框最大字数限制
      areaMaxLength: 1000, // 文本框最大字数限制
      modelid: ''
    }
  },
  mixins: [paginations],
  mounted() {
    this.getList()
  },
  methods: {
    nodeClick(node) {
      this.modelid = node.data.id === '8' ? '' : node.data.id
      this.getList()
    },
    getList() {
      getWordsList({
        fullFilters: [
          {
            filters: [
              { key: 'folderid', opt: 'EQ', type: 'S', value: this.modelid }
            ],
            logic: 'and'
          },
          {
            filters: [
              {
                key: 'term',
                opt: 'LIKE',
                type: 'S',
                value: this.keyWords,
                logic: 'or'
              },
              {
                key: 'termdetail',
                opt: 'LIKE',
                type: 'S',
                value: this.keyWords,
                logic: 'or'
              },
              {
                key: 'code',
                opt: 'LIKE',
                type: 'S',
                value: this.keyWords,
                logic: 'or'
              }
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
        this.wordsList = res.list
        this.pages.total = res.total
      })
    },
    newRow() {
      this.dialogVisible = true
      this.title = this.$t('addTheTerms')
      this.wordsInfo = {}
    },
    editRow(row) {
      console.log(row)
      this.dialogVisible = true
      this.title = this.$t('modifyTheTerms')
      this.wordsInfo = row
    },
    deleteRow(id) {
      this.$confirm(
        this.$t('hintText.areYouSureDelete'),
        this.$t('hintText.hint'),
        {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          deleteWord(id).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: this.$t('hintText.successfullyDelete')
              })
              this.getList()
            }
          })
        })
        .catch(() => {})
    },
    handlerSaveClick() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          if (this.wordsInfo.term.length > this.textMaxLength) {
            this.$message({
              message: this.$t('hintText.termNameWarning'),
              type: 'error'
            })
            return false
          } else if (this.wordsInfo.termdetail.length > this.textMaxLength) {
            this.$message({
              message: this.$t('hintText.termExplanationWarning'),
              type: 'error'
            })
            return false
          }
          saveWord({
            ...this.wordsInfo,
            folderid: this.wordsInfo.folderid
              ? this.wordsInfo.folderid
              : this.modelid
          }).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: `${this.title}${this.$t('success')}！`
              })
              this.dialogVisible = false
              this.getList()
            }
          })
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('hintText.theRequiredFieldsMustNotBeEmpty')
          })
        }
      })
    },
    handleSelectionChange(list) {
      this.selectionList = list
    },
    mutipleDelteRows() {
      if (this.selectionList.length === 0) {
        this.$message({
          type: 'warning',
          message: this.$t('hintText.pleaseSelectDeleteRow')
        })
        return
      }
      this.$confirm(
        this.$t('hintText.areYouSureDelete'),
        this.$t('hintText.hint'),
        {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          this.selectionList.map(item => {
            deleteWord(item.id).then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: this.$t('hintText.successfullyDelete')
                })
                this.getList()
              }
            })
          })
        })
        .catch(() => {})
    },
    // 选择框禁用
    checkSelectable(row) {
      return !row.code
    }
  }
}
</script>
<style lang="scss" scoped>
#wordsManage {
  background-color: white;
  // padding: 10px;
  // height: calc(100vh - 172px);
  // overflow-x: hidden;
}
// .left_tree_wrapper {
//   width: 100%;
//   overflow: auto;
//   height: calc(100vh - 208px) !important;
// }
</style>
