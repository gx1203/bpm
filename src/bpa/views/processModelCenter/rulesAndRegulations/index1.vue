<template>
  <div id="handbookFiles" class="pageWrap w100">
    <div class="pageContent">
      <div class="leftTree">
        <div style="margin-bottom: 10px">
          <bas-search
            placeholder="请输入内容"
            v-model="inputSearch"
            @fnSearch="filterTree"
          />
        </div>
        <div class="left_tree_wrapper">
          <el-tree
            ref="tree"
            class="filter-tree elTree"
            v-show="!controlTree"
            :props="props"
            :load="loadNode"
            :default-expanded-keys="expandedList"
            node-key="id"
            lazy
            :expand-on-click-node="false"
          >
            <div slot-scope="{ node, data }" class="custom-tree-node w100">
              <p :title="node.label" @click="nodeClick(node, data)">
                {{ node.label }}
              </p>
            </div>
          </el-tree>
          <el-tree
            ref="treeFilter"
            class="filter-tree elTree"
            v-show="controlTree"
            :data="treelist"
            @node-click="handlerNodeClick"
            :props="props"
            :load="loadNode"
            :default-expanded-keys="expandedList"
            node-key="id"
            lazy
            :expand-on-click-node="false"
          >
            <div slot-scope="{ node, data }" class="custom-tree-node w100">
              <p :class="{ green: data.release === 'Y' }" :title="node.label" @click="nodeClick(node, data)">
                {{ node.label }}
              </p>
            </div>
          </el-tree>
        </div>
      </div>
      <div class="listContent">
        <div class="rightPart">
          <!-- 表格 -->
          <bas-table
            row-key="id"
            :tableList="tableList"
            :headerList="headerList"
            :pages="pages"
            :isShowIndex="true"
            @currentChange="handleCurrentChange"
          >
            <!-- 搜索和功能按钮区 -->
            <template #search>
              <div>
                <el-row class="margin-b10">
                  <el-col :span="8">
                    <bas-search
                      placeholder="请输入制度名称"
                      v-model="keyWords"
                      @fnSearch="singleSearch('single')"
                    />
                  </el-col>
                    <!-- <el-col :span="14">
              <span style="mrigin-right: 10px">{{ $t('sortord') }}：</span> -->

                    <!-- 最早时间 -->
                    <!-- <el-button
                class="commonSort"
                :class="{
                  active: orderby === 'effectivedate' && sort === 'asc'
                }"
                @click="filterSearch('effectivedate', 'asc')"
                >{{ $t('earliestTime') }}</el-button
              > -->

                    <!-- 最晚时间 -->
                    <!-- <el-button
                class="commonSort"
                :class="{
                  active: orderby === 'effectivedate' && sort === 'desc'
                }"
                @click="filterSearch('effectivedate', 'desc')"
                >{{ $t('latestTime') }}</el-button
              > -->
                    <!-- 点赞量 -->
                    <!-- <el-button
                class="commonSort"
                :class="{ active: orderby === 'goodactionnum' }"
                @click="filterSearch('goodactionnum', 'desc')"
                >{{ $t('thumbUpQuantity') }}</el-button
              > -->
                    <!-- 评论量 -->
                    <!-- <el-button
                class="commonSort"
                :class="{ active: orderby === 'discuss' }"
                @click="filterSearch('discuss', 'desc')"
                >{{ $t('commentOnTheAmount') }}</el-button
              > -->

                    <!-- 阅读量 -->
                    <!-- <el-button
                class="commonSort"
                :class="{ active: orderby === 'readSum' }"
                @click="filterSearch('readSum', 'desc')"
                >{{ $t('referToTheAmount') }}</el-button
              > -->
                    <!-- </el-col> -->
                    <!--<el-button class="high_search" type="primary" @click="isHighSearch=!isHighSearch">-->
                    <!--高级<i :class="isHighSearch?'el-icon-caret-top' : 'el-icon-caret-bottom'" />-->
                    <!--</el-button>-->
                  <el-col :offset="12" :span="4" class="search_buttons_wrap">
                    <el-button
                      type="primary"
                      @click="isHighSearch = !isHighSearch"
                    >
                      {{ $t('advancedQuery') }}
                      <i
                        :class="
                          isHighSearch
                            ? 'el-icon-caret-top'
                            : 'el-icon-caret-bottom'
                        "
                      ></i>
                    </el-button>
                    <!-- <el-button type="primary">添加</el-button> -->
                  </el-col>
                </el-row>
                <el-collapse-transition>
                  <el-form
                    v-show="isHighSearch"
                    class="search_options_wrap"
                    :model="searchForm"
                    label-width="100px"
                  >
                    <el-row>
                      <el-col :span="8">
                        <el-form-item label="制度名称">
                          <el-input v-model="searchForm.title" clearable />
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item :label="artificialPerson">
                          <el-input v-model="searchForm.authorname" clearable />
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item :label="releasePeople">
                          <el-input
                            v-model="searchForm.provideruser"
                            clearable
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="8">
                        <el-form-item :label="state">
                          <el-select v-model="searchForm.status">
                            <!--                    <el-option :label="newAdd" value="1" />-->
                            <!--                    <el-option :label="$t('beingProcessed')" value="2"></el-option>-->
                            <!--                    <el-option :label="published" value="3" />-->
                            <!--                    <el-option :label="$t('underRevision')" value="4" />-->
                            <!--                    <el-option :label="$t('haveBeenVoided')" value="5"></el-option>-->
                            <el-option :label="published" value="1" />
                            <el-option
                              :label="$t('haveBeenVoided')"
                              value="2"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item :label="department">
                          <el-input v-model="searchForm.deptname" clearable />
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item :label="classificationSystem">
                          <el-input v-model="searchForm.system" clearable />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="8">
                        <el-form-item :label="effectiveDate">
                          <el-date-picker
                            v-model="searchForm.value1"
                            value-format="yyyy-MM-dd"
                            type="daterange"
                            range-separator="-"
                            :start-placeholder="startDate"
                            :end-placeholder="endDate"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <div class="search_buttons_wrap">
                      <el-button type="primary" @click="singleSearch('high')">
                        {{ $t('search') }}
                      </el-button>
                      <el-button type="primary" @click="resetSearch">
                        {{ $t('reset') }}
                      </el-button>
                    </div>
                  </el-form>
                </el-collapse-transition>
              </div>
            </template>
            <!-- 制度名称 -->
            <template #title="{ row }">
              <router-link
                style="color: #2d42af"
                target="_blank"
                :to="'/rulesDetail/' + row.docId + '/' + row.revId"
              >
                {{ row.title }}
              </router-link>
            </template>

            <!-- 查看历史版本 -->
            <template #version="{ row }">
              <div
                >{{ row.version }}
                <span
                  style="color: #2d42af; margin-left: 5px; cursor: pointer;"
                  v-show="row.version && Number(row.version.slice(1, row.version.length) > 1) && !showhistoryBtn && row.version != 'V202101'"
                  @click="checkHistoryRules(row.docno)"
                >
                  {{ $t('viewHistoryVersion') }}
                </span>
              </div>
            </template>

            <!-- 修订内容 -->
            <template #reason="{ row }">
              <span>{{
                !row.reviseContents
                  ? ''
                  : row.reviseContents.map(item => item.content).join('; ')
              }}</span>
            </template>

            <!-- 关联流程 -->
            <template #relationProcess="{ row }">
              <span>{{
                row.relationProcess && row.relationProcess.length > 0
                  ? row.relationProcess
                      .map(item =>
                        item.name.indexOf(item.code) === -1
                          ? item.code + item.name
                          : item.name
                      )
                      .join('&')
                  : ''
              }}</span>
            </template>
          </bas-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getRuleIframeTree,
  queryReleasedCopy
} from '@/bpa/api/rulesCenter/handbookFiles'
import { getFormateDate } from '@/bpa/utils/common'
import paginations from '@/bpa/mixins/pagination_mixin'
import fileOperation from '@/bpa/mixins/fileDownView'
import { getRecentPublished } from '@/bpa/api/processModelCenter/processCommunity'
import {
  searchRulestree,
  getRegulationHistory
} from '@/bpa/api/processModelCenter/rulesAndRegulations/detail'
import '@/bpa/assets/fonts/font_zan/iconfont.css'
import '@/bpa/assets/fonts/font_zan/iconfont.eot'
import '@/bpa/assets/fonts/font_zan/iconfont.ttf'
import '@/bpa/assets/fonts/font_zan/iconfont.svg'
export default {
  mixins: [paginations, fileOperation],
  data() {
    return {
      headerList: [
        {
          label: this.$t('systemName2'), // 制度名称
          slotName: 'title'
        },
        {
          label: this.$t('version'), // 查看历史版本
          slotName: 'version'
        },
        {
          label: this.$t('reviseContents'), // 修订内容
          slotName: 'reason'
        },
        {
          label: this.$t('NameOfTheFramework'), // 框架名称
          prop: 'frameName'
        },
        {
          label: this.$t('effectiveDate'), // 生效日期
          prop: 'effectiveion'
        },
        {
          label: this.$t('releasePeople'), // 发布人
          prop: 'provideruser'
        },
        {
          label: this.$t('AssociatedProcess'), // 关联流程
          slotName: 'relationProcess'
        }
      ],
      loading: false,
      inputSearch: '',
      controlTree: false,
      treelist: [],
      historyPages: '',
      docno: '',
      foldername: {},
      // 组织树
      props: {
        label: function(data, node) {
          // if (data.code) {
          //   return data.code+ ' '+ data.foldername
          // } else {
          console.log(data.foldername)
          return data.foldername

          // }
        },
        isLeaf: function(data, node) {
          if (data.parent === true) {
            return false
          } else {
            return true
          }
        }
      },
      modelid: '',
      showhistoryBtn: false,
      orderby: 'effectivedate',
      sort: 'desc',
      expandedList: [],
      tableList: [],
      keyWords: '',
      isHighSearch: false,
      searchForm: {
        title: '',
        enname: '',
        provideruser: '',
        authorname: '',
        docAuthorDis: '',
        deptname: '',
        system: '',
        status: '1',
        fordertype: '',
        effectivedate: ''
      },
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      filters: [
        { key: 'title', opt: 'LIKE', type: 'S', value: '' },
        { key: 'enname', opt: 'LIKE', type: 'S', value: '' },
        { key: 'provideruser', opt: 'LIKE', type: 'S', value: '' },
        { key: 'status', opt: 'LIKE', type: 'S', value: '' },
        { key: 'foldertype', opt: 'LIKE', type: 'S', value: '' },
        { key: 'deptname', opt: 'LIKE', type: 'S', value: '' },
        { key: 'authorname', opt: 'LIKE', type: 'S', value: '' },
        { key: 'system', opt: 'LIKE', type: 'S', value: '' },
        {
          key: 'effectivedate',
          opt: 'LE',
          type: 'D',
          value: getFormateDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
        }
      ],
      pleaseEnterTitle: this.$t('placeholderText.pleaseEnterTitle'),
      chineseTitle: this.$t('chineseTitle'),
      englishTitle: this.$t('englishTitle'),
      releasePeople: this.$t('releasePeople'),
      artificialPerson: this.$t('artificialPerson'),
      department: this.$t('department'),
      classificationSystem: this.$t('classificationSystem'),
      number: this.$t('bpa_number'),
      titleChinese: this.$t('titleChinese'),
      titleEnglish: this.$t('titleEnglish'),
      version: this.$t('version'),
      uploadTime: this.$t('uploadTime'),
      classify: this.$t('classify'),
      releaseDate: this.$t('releaseDate'),
      state: this.$t('state'),
      effectiveDate: this.$t('effectiveDate'),
      startDate: this.$t('placeholderText.startDate'),
      endDate: this.$t('placeholderText.endDate'),
      titleOfEnglishAndChinese: this.$t('titleOfEnglishAndChinese'),
      fileName: this.$t('fileName'),
      fileSize: this.$t('fileSize'),
      uploadStatus: this.$t('uploadStatus'),
      operation: this.$t('operation'),
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
      pleaseUploadtheMainDocument: this.$t(
        'hintText.pleaseUploadtheMainDocument'
      ),
      saveSuccessfully: this.$t('hintText.saveSuccessfully'),
      fieldNameShouldNotExceedFiftyWords: this.$t(
        'hintText.fieldNameShouldNotExceedFiftyWords'
      ),
      releaseSuccess: this.$t('hintText.releaseSuccess'),
      areYouSureYouWantToRelease: this.$t(
        'hintText.areYouSureYouWantToRelease'
      ),
      hint: this.$t('hintText.hint'),
      pleaseDeleteItAndUploadItAgain: this.$t(
        'hintText.pleaseDeleteItAndUploadItAgain'
      ),
      requiredFieldsCannotBeEmpty: this.$t(
        'hintText.requiredFieldsCannotBeEmpty'
      ),
      areYouSureYouWantToInvalidateThisInformation: this.$t(
        'hintText.areYouSureYouWantToInvalidateThisInformation'
      ),
      areYouSureDelete: this.$t('hintText.areYouSureDelete'),
      successfullyDelete: this.$t('hintText.successfullyDelete'),
      confirm: this.$t('confirm'),
      cancel: this.$t('cancel'),
      uploaded: this.$t('uploaded'),
      newAdd: this.$t('newAdd'),
      published: this.$t('published'),
      invalidSuccess: this.$t('hintText.invalidSuccess')
    }
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    userid() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .empuid
    }
  },
  mounted() {
    // this.getList()
    // this.getLists()
    // this.filterTree()
  },
  methods: {
    //搜索
    checkRecords(row) {
      this.headTitle = row.code + row.name
      getRecords(row.instid).then(res => {
        if (!res) return false
        this.dialogVisible = true
        this.recordsList = res
      })
    },
    // singleSearch2() {
    //   this.pages.pageNum = 1;
    //   let obj = {
    //     orderby: this.orderby,
    //     filters: [
    //       { key: "name", opt: "LIKE", type: "S", value: this.keyWords },
    //       { key: "modelid", opt: "LIKE", type: "S", value: this.selectid },
    //     ],
    //     sort: this.sort,
    //     pageNum: this.pages.pageNum,
    //     pageSize: this.pages.pageSize,
    //   };
    //   this.getList(obj);
    // },
    handlerNodeClick(data) {
      this.$emit('click_', data)
    },

    filterTree() {
      if (!this.inputSearch) {
        this.controlTree = false
        return false
      }
      console.log(this.inputSearch)
      searchRulestree({
        foldername: this.inputSearch
      }).then(res => {
        console.log(res)
        if (!res) return false
        this.controlTree = true
        this.treelist = res
      })

      // this.getList()
    },

    //分页
    handleCurrentChange(value) {
      console.log(this.pages)
      console.log(value)
      this.processlistpage = value
      this.pages.pageNum = value
      if (this.historyPages == '1') {
        this.checkHistoryRules(this.docno)
      } else {
        this.getList()
      }
    },

    //查看历史版本
    checkHistoryRules(docno) {
      this.historyPages = '1'
      this.docno = docno
      let obj = {
        orderby: 'effectivedate',
        sort: 'desc',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        // filters: [{ key: "listid", opt: "LIKE", type: "S", value: id }],
        filters: [{ key: 'docno', opt: 'EQ', type: 'S', value: this.docno }]
      }
      getRegulationHistory(obj).then(res => {
        if (!res) return false
        console.log(res.list)
        this.tableList = res.list
        this.pages.total = res.total
        this.showhistoryBtn = true
      })
      // this.getLists()
    },
    //最早时间，最晚时间，点赞量，评论量，查阅量
    getLists(obj) {
      // console.log(obj)
      obj = obj || {
        orderby: this.orderby,
        sort: this.sort,
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        filters: [
          { key: 'title', opt: 'LIKE', type: 'S', value: this.keyWords },
          { key: 'modelid', value: this.selectid }
        ],
        attr: { folderid: this.modelid, type: this.searchForm.status }
      }
      queryReleasedCopy(obj).then(res => {
        if (!res) return false
        this.tableList = res.list
        this.pages.total = res.total
        this.showhistoryBtn = false
      })
      this.historyPages = ''
    },
    filterSearch(orderby, sort) {
      this.orderby = orderby
      this.sort = sort
      this.getLists()
    },

    downloadUrl(fileid) {
      return `${this.host}/regulation/download/${fileid}?username=${this.userid}`
    },
    nodeClick(node, data) {
      const self = this
      self.modelid = data.id
      this.keyWords = ''
      this.getList()
      this.getLists()
    },
    loadNode(node, resolve) {
      const id = node.data ? node.data.id : '0'
      getRuleIframeTree(id).then(res => {
        console.log(res)
        if (!res) return false
        if (node.level === 0 || (node.level < 2 && res.length === 1)) {
          this.expandedList = [res[0].id]
        }
        if (node.level === 1 && res.length > 0) {
          this.$nextTick(() => {
            if (this.$refs.tree) {
              this.$refs.tree.setCurrentKey(res[0].id)
              this.modelid = res[0].id
              this.getList()
              this.getLists()
            }
          })
        }
        resolve(res)
      })
    },
    singleSearch(type) {
      this.pages.pageNum = 1
      if (type === 'single') {
        this.filters = [
          { key: 'title', opt: 'LIKE', type: 'S', value: this.keyWords }
        ]
        this.historyPages = ''
        this.getLists()
      } else {
        this.filters = [
          {
            key: 'title',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.title
          },
          // {
          //   key: 'enname',
          //   opt: 'LIKE',
          //   type: 'S',
          //   value: this.searchForm.enname
          // },
          // 发布人
          {
            key: 'provideruser',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.provideruser
          },
          // 拟制人
          {
            key: 'authorname',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.authorname
          },
          // 部门
          {
            key: 'deptname',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.deptname
          },
          // 状态
          {
            key: 'status',
            opt: 'LIKE',
            type: 'S',
            value: '' //this.searchForm.status,
          },
          // 体系分类
          {
            key: 'system',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.system
          },
          // 生效日期
          {
            key: 'effectivedate',
            opt: 'BETWEEN',
            type: 'D',
            value:
              this.searchForm.value1 && this.searchForm.value1.length
                ? this.searchForm.value1[0] +
                  ' 00:00:00' +
                  '~' +
                  this.searchForm.value1[1] +
                  ' 23:59:59'
                : ''
          }
        ]
        this.getList()
      }
    },
    // 重置按钮
    resetSearch() {
      this.pages.pageNum = 1
      this.searchForm = {}
      this.filters = [{ key: 'title', opt: 'LIKE', type: 'S', value: '' }]
      this.getList()
    },
    async getList() {
      this.loading = true
      let obj = {
        orderby: this.orderby,
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: this.sort,
        attr: { folderid: this.modelid, type: this.searchForm.status },
        filters: [
          ...this.filters,
          { key: 'status', opt: 'EQ', type: 'S', value: '' }
        ],
        logic: 'and'
      }
      await queryReleasedCopy(obj).then(res => {
        console.log(obj)
        console.log(res)
        if (!res) return false
        this.tableList = res.list.map(item => {
          item.effectiveion = !item.effectiveion
            ? ''
            : getFormateDate(item.effectiveion, 'yyyy-MM-dd')
          return item
        })
        this.pages.total = res.total
      })
      this.loading = false
    },
    handlerProcessIframeNodeClick(data) {
      console.log(data)
      this.selectid = data.id
      if (!data.id) {
        this.selectid = ''
      }
      console.log(obj)
      let obj = {
        filters: [{ key: 'modelid', value: this.selectid }],
        orderby: this.orderby,
        // sort: this.sort,
        sort: 'asc',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize
      }
      this.getList(obj)
    }
  }
}
</script>

<style lang="scss" scoped>
#handbookFiles {
  background-color: white;
  .elTree {
    font-size: 13px;
    /deep/ .el-tree-node.is-current > .el-tree-node__content .custom-tree-node {
      font-weight: 600;
      color: #2d42af;
    }
    /deep/ .custom-tree-node {
      color: #666;
    }
  }
}
.left_tree_wrapper {
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
  height: 100%;
}
/deep/ .el-input-group__append,
.el-input-group__prepend {
  background-color: #2d42af;
  color: white;
}
.read-history {
  color: #48a2ff;
  cursor: pointer;
}
.el-col-14 {
  margin-left: 20px;
}
.searchTree {
  cursor: pointer !important;
}
.active {
  background: #2d42af !important;
  border-color: #2d42af !important;
  color: #fff !important;
}
</style>
