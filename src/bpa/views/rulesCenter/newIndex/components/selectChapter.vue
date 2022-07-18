<template>
  <div id="handbookFiles" class="w100" v-if="isDialogsVisible">
    <el-dialog :append-to-body="true" width="1000px" :visible.sync="isDialogsVisible" title="选择制度章节" :close-on-click-modal=false :close-on-press-escape=false>
      <el-row :gutter="10">
        <el-col :span="7">
          <el-scrollbar class="left_tree_wrapper" style="margin-top: 43px;">
            <el-tree ref="tree" class="filter-tree elTree" :props="props" :load="loadNode" node-key="id" lazy :expand-on-click-node="false" :default-expanded-keys="expandedList" @node-click="nodeClick">
              <div slot-scope="{ node, data }" class="custom-tree-node w100">
                <p :title="node.label">
                  {{ node.label }}
                </p>
              </div>
            </el-tree>
          </el-scrollbar>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-input v-model="keyWords" :placeholder="pleaseEnterTitle" :title="pleaseEnterTitle" class="search_component" clearable @keyup.13.native="getList">
            <el-button slot="append" icon="iconfont_search icon-sousuo2" type="primary" @click="getList()" />
          </el-input>
          <div class="chapterCard">
            <h3>选择制度文档</h3>
            <el-scrollbar class="left_tree_wrapper">
              <el-tree class="filter-tree elTree" :props="propsBooks" :data="booksList" node-key="docId" :expand-on-click-node="false" @node-click="nodeClickBooks">
                <div slot-scope="{ node, data }" class="custom-tree-node w100">
                  <p :title="node.label">
                    {{ node.label }}
                  </p>
                </div>
              </el-tree>
            </el-scrollbar>
          </div>
        </el-col>
        <el-col :span="7" :offset="1">
          <div class="chapterCard" style="margin-top: 43px;">
            <h3>选择制度章节</h3>
            <el-scrollbar class="left_tree_wrapper">
              <el-tree class="filter-tree elTree" :props="propsChapters" :data="chaptersList" node-key="docId" :expand-on-click-node="false" @node-click="nodeClickChapters">
                <div slot-scope="{ node, data }" class="custom-tree-node w100">
                  <span style="float: left; margin-top: 1px;">
                    <el-radio v-model="radioNode" :label="data.id" @click="clickRadioNode($event)" @change="changeRadioNode(data)">{{''}}</el-radio>
                  </span>
                  <p :title="node.label">
                    {{ node.label }}
                  </p>
                </div>
              </el-tree>
            </el-scrollbar>
          </div>
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
  queryChapters
} from '@/bpa/api/rulesCenter/handbookFiles'

export default {
  data () {
    return {
      // 组织树
      props: {
        label: function (data, node) {
          // if (data.code) {
          //   return data.code+ ' '+ data.foldername
          // } else {
          return data.foldername
          // }
        },
        isLeaf: function (data, node) {
          return data.parent !== true;
        }
      },
      propsBooks: {
        label: 'title',
        isLeaf: 'leaf'
      },
      propsChapters: {
        label: 'content',
        children: 'subNodes',
        isLeaf: 'leaf'
      },
      modelid: '',
      booksList: [],
      chaptersList: [],
      expandedList: [],
      keyWords: '',
      pleaseEnterTitle: this.$t('placeholderText.pleaseEnterTitle'),
      titleOfEnglishAndChinese: this.$t('titleOfEnglishAndChinese'),
      version: this.$t('version'),
      uploadTime: this.$t('uploadTime'),
      fileName: this.$t('fileName'),
      fileSize: this.$t('fileSize'),
      uploadStatus: this.$t('uploadStatus'),
      operation: this.$t('operation'),
      classify: this.$t('classify'),
      addRulesAndRegulations: this.$t('addRulesAndRegulations'),
      editRulesAndRegulations: this.$t('editRulesAndRegulations'),
      chooseDate: this.$t('placeholderText.chooseDate'),
      mainDocument: this.$t('bpa_mainDocument'),
      download2: this.$t('download'),
      publish: this.$t('publish'),
      modify: this.$t('modify'),
      delete2: this.$t('delete'),
      invalid: this.$t('invalid'),
      dateNotSelected: this.$t('hintText.dateNotSelected'),
      pleaseUploadtheMainDocument: this.$t('hintText.pleaseUploadtheMainDocument'),
      saveSuccessfully: this.$t('hintText.saveSuccessfully'),
      fieldNameShouldNotExceedFiftyWords: this.$t('hintText.fieldNameShouldNotExceedFiftyWords'),
      releaseSuccess: this.$t('hintText.releaseSuccess'),
      areYouSureYouWantToRelease: this.$t('hintText.areYouSureYouWantToRelease'),
      hint: this.$t('hintText.hint'),
      pleaseDeleteItAndUploadItAgain: this.$t('hintText.pleaseDeleteItAndUploadItAgain'),
      requiredFieldsCannotBeEmpty: this.$t('hintText.requiredFieldsCannotBeEmpty'),
      areYouSureYouWantToInvalidateThisInformation: this.$t('hintText.areYouSureYouWantToInvalidateThisInformation'),
      areYouSureDelete: this.$t('hintText.areYouSureDelete'),
      successfullyDelete: this.$t('hintText.successfullyDelete'),
      confirm: this.$t('confirm'),
      cancel: this.$t('cancel'),
      uploaded: this.$t('uploaded'),
      newAdd: this.$t('newAdd'),
      published: this.$t('published'),
      invalidSuccess: this.$t('hintText.invalidSuccess'),
      isDialogsVisible: false,
      chaptersItem: {},
      radioNode: ''
    }
  },
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
  computed: {
    host () {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    username () {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .cnname
    },
    userid () {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .empuid
    },
    action () {
      return `${this.host}/regulation/upload?username=${this.userid}`
    },
    // ...userInfo.mapGetters(['getUserAuthor']),
    download () {
      return this.host + '/regulation/download/'
    }
  },
  mounted () {
  },
  watch: {
    value (val) {
      if (val) {
        this.radioNode = ''
        this.chaptersList = []
        this.booksList = []
        this.isDialogsVisible = val
      }
    },
    isDialogsVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    submit () {
      this.$emit('confirm', this.chaptersItem)
      this.isDialogsVisible = false
    },
    nodeClick (data) {
      this.modelid = data.id
      this.getList()
    },
    nodeClickBooks (data) {
      console.log(data)
      // this.queryChapters('1614850561388')
      this.queryChapters(data.docId)
    },
    nodeClickChapters (data) {
      this.radioNode = data.id
      this.chaptersItem = data
    },
    clickRadioNode (event) {
      if (event) event.preventDefault()
    },
    loadNode (node, resolve) {
      const id = node.data ? node.data.id : '0'
      getRuleIframeTree(id).then(res => {
        console.log(res)
        if (!res) return false
        console.log(id)
        if (id === '0') {
          this.expandedList = [res[0].id]
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(res[0].id)
            this.modelid = res[0].id
            this.getList()
          })
        }
        resolve(res)
      })
    },
    getList () {
      const obj = {
        orderby: 'createon',
        pageNum: 1,
        pageSize: 1000000,
        sort: 'desc',
        logic: 'or',
        filters: [
          { key: 'title', opt: 'LIKE', type: 'S', value: this.keyWords }
        ],
        attr: { folderid: this.modelid }
      }
      getBooksList(obj).then(res => {
        if (!res) return false
        this.booksList = res.list
        if (this.booksList && this.booksList.length > 0) {
          this.queryChapters(this.booksList[0].docId)
        }
      })
    },
    queryChapters (id) {
      queryChapters(id).then(res => {
        if (!res) return false
        this.chaptersList = res
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .chapterCard {
    border: 1px solid #dedede;
    h3 {
      background-color: #eff4f9;
      color: #327ab7;
      font-weight: 600;
      line-height: 36px;
      padding: 0 10px;
    }
  }
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
    height: 300px !important;
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
