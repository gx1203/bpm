<template>
  <div id="handbookFiles" class="pageWrap w100">
    <div class="pageContent">
      <div class="leftTree">
        <div style="margin-bottom: 10px">
          <!-- <el-input
            placeholder="请输入内容"
            v-model="inputSearch"
            placeholder="请输入内容"
            @keyup.13.native="filterTree"
          >
            <el-button
              slot="append"
              class.stop="searchTree"
              @click="filterTree"
            >
              搜索
            </el-button>
          </el-input> -->
          <bas-search
            placeholder="请输入内容"
            v-model="inputSearch"
            @fnSearch="filterTree"
          />
        </div>
        <div class="left_tree_wrapper">
          <div class="con" :span="20">
            <el-tree
              v-show="!controlTree"
              ref="tree"
              class="filter-tree elTree"
              :props="props"
              :load="loadNode"
              node-key="id"
              lazy
              :expand-on-click-node="false"
              :default-expanded-keys="expandedList"
              @node-click="nodeClick"
            >
              <div slot-scope="{ node }" class="custom-tree-node w100">
                <p :title="node.label">
                  {{ node.label }}
                </p>
              </div>
            </el-tree>
            <el-tree
              class="filter-tree elTree"
              v-show="controlTree"
              :props="props"
              :default-expand-all="true"
              :data="treelist"
              @node-click="nodeClick"
            >
              <div slot-scope="{ node, data }" class="custom-tree-node w100">
                <p :title="node.label">
                  {{ node.label }}
                </p>
              </div>
            </el-tree>
          </div>
        </div>
      </div>
      <div class="listContent">
        <div class="rightPart">
          <!-- 表格 -->
          <bas-table
            row-key="id"
            :table-list="booksList"
            :header-list="headerList"
            :pages="pages"
            :is-show-index="true"
            @currentChange="handleCurrentChange"
          >
            <!-- 搜索和高级搜索 -->
            <template #search>
              <div>
                <el-row class="form-section margin-b10">
                  <el-col :span="8">
                    <bas-search
                      placeholder="请输入制度名称"
                      v-model="keyWords"
                      @fnSearch="singleSearch('single')"
                    />
                    <!--<el-button class="high_search" type="primary" @click="isHighSearch=!isHighSearch">-->
                    <!--高级-->
                    <!--<i :class="isHighSearch?'el-icon-caret-top' : 'el-icon-caret-bottom'" />-->
                    <!--</el-button>-->
                  </el-col>
                  <el-col
                    :offset="14"
                    :span="2"
                    class="search_buttons_wrap high-level-search"
                  >
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
                      />
                    </el-button>
                    <el-button
                      v-if="level !== 1"
                      type="primary"
                      @click="addDialog"
                    >
                      {{ $t('newAdd') }}
                    </el-button>
                  </el-col>
                </el-row>
                <el-collapse-transition>
                  <el-form
                    v-show="isHighSearch"
                    class="search_options_wrap"
                    style="margin-top: 15px;"
                    :model="searchForm"
                    label-width="100px"
                  >
                    <el-row>
                      <el-col :span="8">
                        <el-form-item label="制度名称">
                          <el-input v-model="searchForm.title" clearable />
                        </el-form-item>
                      </el-col>
                      <!--                拟制人-->
                      <!--                <el-col :span="8">-->
                      <!--                  <el-form-item :label="artificialPerson">-->
                      <!--                    <el-input v-model="searchForm.authorname" clearable />-->
                      <!--                  </el-form-item>-->
                      <!--                </el-col>-->
                      <el-col :span="8">
                        <el-form-item :label="releasePeople">
                          <el-input
                            v-model="searchForm.provideruser"
                            clearable
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item :label="state">
                          <el-select v-model="searchForm.status" clearable>
                            <el-option
                              v-for="item in statusOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <!--              <el-row>-->
                    <!--                <el-col :span="8">-->
                    <!--                  <el-form-item :label="state">-->
                    <!--                    <el-select v-model="searchForm.status" clearable>-->
                    <!--                      <el-option :label="newAdd" value="1" />-->
                    <!--                      <el-option label="征集意见中" value="9" />-->
                    <!--                      <el-option label="已征求意见" value="10" />-->
                    <!--                      <el-option label="征求意见已退回" value="11" />-->
                    <!--                      <el-option label="作废审批中" value="8" />-->
                    <!--                      <el-option label="发布审批中" value="12" />-->
                    <!--                      <el-option label="作废已拒绝" value="13" />-->
                    <!--                      <el-option label="发布已拒绝" value="6" />-->
                    <!--                      &lt;!&ndash;                    <el-option :label="$t('beingProcessed')" value="2"></el-option>&ndash;&gt;-->
                    <!--                      <el-option :label="published" value="3" />-->
                    <!--                      <el-option :label="$t('underRevision')" value="4" />-->
                    <!--                      &lt;!&ndash;                    <el-option :label="$t('haveBeenVoided')" value="5"></el-option>&ndash;&gt;-->
                    <!--                    </el-select>-->
                    <!--                  </el-form-item>-->
                    <!--                </el-col>-->
                    <!--                <el-col :span="8">-->
                    <!--                  <el-form-item :label="department">-->
                    <!--                    <el-input v-model="searchForm.deptname" maxlength="50" clearable />-->
                    <!--                  </el-form-item>-->
                    <!--                </el-col>-->
                    <!--                <el-col :span="8">-->
                    <!--                  <el-form-item :label="classificationSystem">-->
                    <!--                    <el-input v-model="searchForm.system" clearable />-->
                    <!--                  </el-form-item>-->
                    <!--                </el-col>-->
                    <!--              </el-row>-->
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
                      <el-button type="primary" @click="reset">
                        {{ $t('reset') }}
                      </el-button>
                    </div>
                  </el-form>
                </el-collapse-transition>
              </div>
            </template>

            <!-- 制度名称 -->
            <template #title="{ row }">
              <el-link
                type="primary"
                :underline="false"
                @click="toJumpDetail(row)"
              >
                {{ row.title }}
              </el-link>
            </template>

            <!-- 上传时间 -->
            <template #uploadon="{ row }">
              <div>
                {{ row.uploadon | formatDateTime }}
              </div>
            </template>

            <!-- 文档名称 -->
            <template #docId="{ row }">
              <el-link
                type="primary"
                :underline="false"
                target="_blank"
                :href="viewFile(row.docId)"
              >
                {{ row.filename }}
              </el-link>
              <br />
              <el-link type="primary" :href="downloadUrl(row.docId)">
                <i class="el-icon-download" />
              </el-link>
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

            <!-- 状态 -->
            <template #status="{ row }">
              {{ row.status | regState }}
            </template>

            <!-- 操作 -->
            <template #default="{ row }">
              <el-tooltip
                v-if="['3', '8', '12', '14'].includes(row.status)"
                class="item"
                effect="dark"
                :content="view"
                placement="top"
              >
                <!-- 发布审批中 查看按钮-->
                <el-button type="text" @click="getDetails(row, false)">
                  {{ view }}
                </el-button>
              </el-tooltip>
              <el-tooltip
                v-if="['8', '12'].includes(row.status)"
                class="item"
                effect="dark"
                :content="$t('approvalAgain')"
                placement="top"
              >
                <el-button type="text" @click="publishReg(row, 'approvalAgain')">
                  {{ $t('approvalAgain') }}
                </el-button>
              </el-tooltip>
              <el-tooltip
                v-if="
                  !!row.authorname[0]
                    ? row.authorname[0].userid == userid
                      ? ['1', '4', '6', '10', '11', '13'].includes(row.status)
                      : false
                    : false
                "
                class="item"
                effect="dark"
                :content="modify"
                placement="top"
              >
                <!-- class="no-border" icon="el-icon-edit" circle -->
                <el-button type="text" @click="getDetails(row)">
                  {{ modify }}
                </el-button>
              </el-tooltip>
              <el-tooltip
                v-if="['3', '14'].includes(row.status)"
                class="item"
                effect="dark"
                content="修订"
                placement="top"
              >
                <el-button type="text" @click="getDetails(row)">
                  {{ '修订' }}
                </el-button>
              </el-tooltip>
              <el-tooltip
                v-if="['1', '4', '6', '10', '11', '14'].includes(row.status)"
                class="item"
                effect="dark"
                :content="publish"
                placement="top"
              >
                <!-- icon="el-icon-s-promotion" -->
                <el-button
                  class=""
                  type="text"
                  @click="publishReg(row, 'publish')"
                >
                  {{ publish }}
                </el-button>
              </el-tooltip>
              <el-tooltip
                v-if="['1', '4'].includes(row.status)"
                class="item"
                effect="dark"
                :content="delete2"
                placement="top"
              >
                <!-- icon="el-icon-delete" -->
                <el-button class="" type="text" @click="deleteRow(row.docId)">
                  {{ delete2 }}
                </el-button>
              </el-tooltip>
              <el-tooltip
                v-if="['3', '13', '14'].includes(row.status)"
                class="item"
                effect="dark"
                :content="invalid"
                placement="top"
              >
                <!-- icon="el-icon-error"
                  circle -->
                <el-button
                  class=""
                  type="text"
                  @click="abolishRow(row, 'abolish')"
                >
                  {{ invalid }}
                </el-button>
              </el-tooltip>
            </template>
          </bas-table>
        </div>
      </div>
    </div>

    <!-- 查看历史版本弹窗 -->
    <el-dialog
      title="历史版本"
      :visible.sync="isDialogVisible"
      :before-close="handleClose"
      width="45%"
    >
      <div>
        <el-table
          :data="historyTableData"
          border
          style="width: 100%"
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column
            prop="title"
            label="制度名称"
            width="150"
            style="color: #72b7fe !important"
          >
            <template slot-scope="scope">
              <router-link
                target="_blank"
                :to="'/rulesDetail/' + scope.row.docId + '/' + scope.row.revId"
              >
                {{ scope.row.title }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column prop="version" label="版本" width="100" />
          <el-table-column prop="createon" label="发布时间" />
          <el-table-column prop="status" label="状态" width="50">
            <template slot-scope="scope">
              {{ scope.row.status | regState }}
            </template>
          </el-table-column>
          <el-table-column prop="relationProcess[0].code" label="关联流程">
            <template slot-scope="scope">
              <a @click="jumpProcess(scope.row)"
                >{{ scope.row.relationProcess[0].code
                }}{{ scope.row.relationProcess[0].name }}</a
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="history-btn">
          <el-row>
            <el-button @click="closeHistory">
              取 消
            </el-button>
            <el-button type="primary" @click="closeHistory">
              确 定
            </el-button>
          </el-row>
        </div>
      </div>
    </el-dialog>

    <process-card
      v-model="isDialogsVisible"
      :node-data="nodeData"
      :version="version"
      :modelid="modelid"
      :bpmid="bpmid"
      :tree-id="modelid"
      :edit-item="editItem"
      :is-edit="cardEdit"
      @close="close"
      @confirm="getList"
    />
    <choose-jobs
      v-model="dialogVisible"
      :item="itemData"
      @confirm="saveSuccess"
    />
    <!-- 制度发布弹框 -->
    <publish-dialog
      ref="publishDialog"
      :publish-dialog-visible.sync="publishDialogVisible"
      :currentPublishData="currentPublishData"
      @confirmPublishDialog="confirmPublishDialog"
    />
  </div>
</template>

<script>
import {
  getBooksList,
  saveBooks,
  deleteBooks,
  getDetails,
  pblishRefuse,
  abolishRefuse,
  getSystem,
  getRuleIframeTree,
  getReviewCommentsStart,
  getRelationalProcessList,
  saveRelationalProcessIds,
  noticeRelationalProcessManagers
} from '@/bpa/api/rulesCenter/handbookFiles'

import { getUserRoleName } from '@/bpa/api/user'
import paginations from '@/bpa/mixins/pagination_mixin'
import fileOperation from '@/bpa/mixins/fileDownView'
import { getFormateDate } from '@/bpa/utils/common'
import { createNamespacedHelpers } from 'vuex'
import {
  searchRulestree,
  getRegulationHistory
} from '@/bpa/api/processModelCenter/rulesAndRegulations/detail'
import { getModelapprove } from '@/bpa/api/processDesignCenter/index'
import { updateStatusRule } from '@/bpa/api/common'
import { getPost } from '@/bpm/api/process/administrativeTool/agents_change'
import chooseJobs from '@/bpm/views/staging/personal/applyCreate/chooseJobs'
import PublishDialog from './components/publishDialog.vue'

// 控制流程审批的方式
import { requireProcess } from '@/bpa/api/settings/processApprovalManage'
import { getWordJpg } from '@/bpa/api/processModelCenter/processCommunity'
import processCard from './components/processCard.vue'
import processCard3 from '../../processDesignCenter/child1/components/processCard-langji'
import processIn from '../../processDesignCenter/child1/components/processIn'
import chartIdentify from '../../processDesignCenter/child1/components/chartIdentify'
import correlationSupport from '../../processDesignCenter/child1/components/correlationSupport'

// const userInfo = createNamespacedHelpers('userInfo')
export default {
  components: {
    processCard,
    chooseJobs,
    PublishDialog
  },
  mixins: [paginations, fileOperation],
  data() {
    return {
      currentPublishData: {}, // 当前要发布的行数据
      publishType: 'direct',
      publishDialogVisible: false, // 是否显示制度发布提示弹框
      // 表头字段
      headerList: [
        {
          label: this.$t('systemName2'), // 制度名称
          prop: 'title',
          slotName: 'title'
        },
        {
          label: this.$t('version'), // 版本
          prop: 'version',
          width: 70
        },
        {
          label: this.$t('uploadTime'), // 上传时间
          prop: 'uploadon',
          slotName: 'uploadon'
        },
        {
          label: this.$t('NameOfTheFramework'), // 框架名称
          prop: 'frameName'
        },
        {
          label: this.$t('releasePeople'), // 发布人
          prop: 'provideruser'
        },
        {
          label: this.$t('TheDocumentName'), // 文档名称
          prop: 'docId',
          slotName: 'docId'
        },
        {
          label: this.$t('AssociatedProcess'), // 关联流程
          prop: 'relationProcess',
          slotName: 'relationProcess'
        },
        {
          label: this.$t('state'), // 状态
          prop: 'status',
          slotName: 'status'
        },
        {
          label: this.$t('operation'), // 操作
          prop: 'default',
          slotName: 'default',
          tooltip: 'false',
          width: 150
        }
      ],
      statusOptions: [
        { label: '新建', value: '1' },
        { label: '修改中', value: '4' },
        { label: '发布审批中', value: '12' },
        { label: '已发布', value: '3' },
        { label: '修订中', value: '14' },
        { label: '作废审批中', value: '8' }
      ],
      // 组织树
      props: {
        label: function(data, node) {
          // if (data.code) {
          //   return data.code+ ' '+ data.foldername
          // } else {
          return data.foldername
          // }
        },
        isLeaf: function(data, node) {
          return data.parent !== true
        }
      },

      // 弹窗的数据
      itemData: [],
      dialogVisible: false,
      paramsData: {},
      docid: '',
      docId: '',
      type: '',
      docno: '',
      modelid: '',
      booksList: [],
      treelist: [],
      controlTree: false,
      historyTableData: [],
      expandedList: [],
      keyWords: '',
      relationProcess: '',
      showhistoryBtn: false,
      isDialogVisible: false,
      inputSearch: '',
      isHighSearch: false,
      fileList: [],
      searchForm: {
        title: '',
        enname: '',
        provideruser: '',
        authorname: '',
        docAuthorDis: '',
        deptname: '',
        system: '',
        status: '',
        fordertype: '',
        effectivedate: ''
      },
      editFormObj: {
        effectiveDate: '',
        checkList: []
      },
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      rules: {
        docTitle: [{ required: true, message: ' ', trigger: 'blur' }],
        enname: [{ required: true, message: ' ', trigger: 'blur' }],
        effectiveDate: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      textMaxLength: 50, // 文本框最大字数限制
      areaMaxLength: 1000, // 文本框最大字数限制
      // 体系分类
      sysLists: [],
      // 判断是否修改主文档
      referMainDoc: false,
      processType: '',
      titleName: '',
      pleaseEnterTitle: this.$t('placeholderText.pleaseEnterTitle'),
      chineseTitle: this.$t('chineseTitle'),
      englishTitle: this.$t('englishTitle'),
      releasePeople: this.$t('releasePeople'),
      artificialPerson: this.$t('artificialPerson'),
      state: this.$t('state'),
      department: this.$t('department'),
      classificationSystem: this.$t('classificationSystem'),
      effectiveDate: this.$t('uploadTime'), // this.$t('effectiveDate'),
      startDate: this.$t('placeholderText.startDate'),
      endDate: this.$t('placeholderText.endDate'),
      number: this.$t('bpa_number'),
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
      view: this.$t('view'),
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
      invalidSuccess: this.$t('hintText.invalidSuccess'),
      nodeData: {},
      isDialogsVisible: false,
      editItem: {},
      bpmid: '',
      level: 1,
      filters: [],
      loading: false,
      itempid: [],
      cardEdit: true
    }
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    username() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .cnname
    },
    userid() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .empuid
    },
    action() {
      return `${this.host}/regulation/upload?username=${this.userid}`
    },
    // ...userInfo.mapGetters(['getUserAuthor']),
    download() {
      return this.host + '/regulation/download/'
    }
  },
  mounted() {
    // 获取当前登录人权限
    // this.requireAuthoriy()
    // h获取体系分类
    this.getSystem()
    // 审批方式
    this.getprocessType()
  },
  methods: {
    // 页码改变事件
    currentChange(newPageNum) {
      this.page.pageNum = newPageNum
      if (this.searchType === 'power') {
        this.getData()
      } else {
        this.quickQueryData()
      }
    },
    // stateAction(row){
    //   if(row.status == "9"){
    //     return "征集意见中"
    //   } else if(row.status == "10"){
    //     return "已征求意见"
    //   }else if(row.status == "1"){
    //     return "新建"
    //   }else if(row.status == "2"){
    //     return "审批"
    //   }else if(row.status == "3"){
    //     return "发布"
    //   }else if(row.status == "4"){
    //     return "修改"
    //   }else if(row.status == "5"){
    //     return "作废"
    //   }else if(row.status == "6"){
    //     return "发布已拒绝"
    //   }else if(row.status == "7"){
    //     return "已征集"
    //   }else if(row.status == "8"){
    //   return "作废审批中"
    //   }else if(row.status == "11"){
    //     return "征求意见已退回"
    //   }
    //   // console.log(row)
    // },
    // 发起意见
    async getReviewCommentsStart(row) {
      await this.$confirm('您将要征集意见,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          getReviewCommentsStart(row.docId).then(res => {})
          this.$message({
            type: 'success',
            message: '已征集意见!'
          })
        })
        .catch(err => {
          this.$message({
            type: 'info',
            message: '已取消征集意见'
          })
        })
      setTimeout(() => {
        this.getList()
      }, 2000)
      this.$forceUpdate()
    },

    closeHistory() {
      this.isDialogVisible = false
      this.showhistoryBtn = true
    },
    // 查看流程详情
    toReadRuleDetail() {},
    // 查看历史版本
    seeHistoryVison(docno) {
      // this.historyPages = "1";
      // relationProcess = this.relationProcess.code
      this.docno = docno
      this.isDialogVisible = true
      const obj = {
        orderby: 'createon',
        sort: 'desc',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        // filters: [{ key: "listid", opt: "LIKE", type: "S", value: id }],
        filters: [{ key: 'docno', opt: 'EQ', type: 'S', value: this.docno }]
      }
      getRegulationHistory(obj).then(res => {
        if (!res) return false
        this.historyTableData = res.list
        this.pages.total = res.total
        this.showhistoryBtn = true
      })
      this.getList()
    },
    // 关闭历史版本对话框
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => {
        this.isDialogVisible = false
        done()
      })
      this.showhistoryBtn = true
      this.getList()
    },

    // 搜索制度树
    filterTree() {
      if (!this.inputSearch) {
        this.controlTree = false
        return false
      }
      searchRulestree({
        foldername: this.inputSearch
      }).then(res => {
        if (!res) return false
        this.controlTree = true
        this.treelist = res
      })
    },

    close(data) {
      // console.log(data)
      // if (data.type === 'paint') {
      //   this.showProcessEditor = true
      //   let count = 0
      //   this.lisdata.forEach((item, idx) => {
      //     if (item.id === data.data.split(',')[0]) {
      //       count++
      //       this.chartmodel = item.id
      //     }
      //   })
      //   if (!count) {
      //     this.lisdata.push({
      //       name: this.selectedItem.name,
      //       id: data.data.split(',')[0],
      //       listid: data.data.split(',')[1],
      //       treeId: this.modelid,
      //       state: this.selectedItem.state,
      //       processNum: this.selectedItem.code
      //     })
      //     this.chartmodel = data.data.split(',')[0]
      //   }
      //   let username = localStorage.getItem('portalCurrentUserInfo')
      //     ? JSON.parse(localStorage.getItem('portalCurrentUserInfo')).cnname
      //     : ''
      //   this.iframeSrc = `./leftMenu/BaseNewPage.html?id=${data.data.split(',')[0]
      //   }&listid=${data.data.split(',')[1]}&treeId=${this.modelid
      //   }&processName=${this.selectedItem.name
      //   }&username=${username}&processNum=${this.selectedItem.code}&state=${this.selectedItem.state
      //   }&isRead=no`
      //   console.log(this.iframeSrc)
      // } else {
      //   this.processlistpage = 1
      //   this.getList()
      // }
    },
    // ...userInfo.mapActions(['requireAuthoriy']),
    downloadUrl(fileid) {
      return `${this.host}/regulation/download/${fileid}?username=${this.userid}`
    },
    nodeClick(data, node) {
      this.modelid = data.id
      this.type = data.foldername
      this.nodeData = data
      this.level = node.level
      this.keyWords = ''
      this.singleSearch('single')
    },
    loadNode(node, resolve) {
      const id = node.data ? node.data.id : '0'
      getRuleIframeTree(id).then(res => {
        if (!res) return false
        resolve(res)
        if (node.level === 0 || (node.level < 2 && res.length === 1)) {
          this.expandedList = [res[0].id]
        }
        if (node.level === 1 && res.length > 0) {
          if (node.level === 1) {
            this.level = node.level + 1
          }
          this.$nextTick(() => {
            if (this.$refs.tree) {
              this.$refs.tree.setCurrentKey(res[0].id)
              this.modelid = res[0].id
              this.type = res[0].foldername
              this.nodeData = res[0]
              this.getList()
            }
          })
        }
      })
    },
    // 控制流程审批的方式
    getprocessType() {
      requireProcess({
        filters: [
          { key: 'name', opt: 'LIKE', type: 'S', value: '手册及体系文件' }
        ]
      }).then(res => {
        if (!res) return false
        this.processType = res.list[0]?.choosed || ''
      })
    },
    addDialog() {
      // this.listid = data.id
      // this.bpmid = data.bpmid
      // this.version = data.version
      // this.selectedItem = JSON.parse(JSON.stringify(data))
      this.cardEdit = true
      this.isDialogsVisible = true
      this.editItem = {
        docId: new Date().getTime() + '',
        type: 'add'
      }
      // this.titleName = this.addRulesAndRegulations
      // this.dialogVisible = true
      // this.referMainDoc = false
      // this.fileList = []
      // this.editFormObj = {
      //   docTitle: '',
      //   enname: '',
      //   effectiveDate: '',
      //   checkList: []
      // }
    },
    singleSearch(type) {
      this.pages.pageNum = 1
      if (type === 'single') {
        this.filters = [
          { key: 'title', opt: 'LIKE', type: 'S', value: this.keyWords }
        ]
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
            opt: 'EQ',
            type: 'S',
            value: this.searchForm.status
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
      }
      this.getList()
    },
    // 高级搜索
    // highSearch() {
    //   this.pages.pageNum = 1
    //   const obj = {
    //     attr: { folderid: this.modelid },
    //     orderby: 'createon',
    //     pageNum: 1,
    //     pageSize: 10,
    //     sort: 'desc',
    //     logic: 'and',
    //     filters: [
    //       {
    //         key: 'title',
    //         opt: 'LIKE',
    //         type: 'S',
    //         value: this.searchForm.title
    //       },
    //       // {
    //       //   key: 'enname',
    //       //   opt: 'LIKE',
    //       //   type: 'S',
    //       //   value: this.searchForm.enname
    //       // },
    //       // 发布人
    //       {
    //         key: 'provideruser',
    //         opt: 'LIKE',
    //         type: 'S',
    //         value: this.searchForm.provideruser
    //       },
    //       // 拟制人
    //       {
    //         key: 'authorname',
    //         opt: 'LIKE',
    //         type: 'S',
    //         value: this.searchForm.authorname
    //       },
    //       // 部门
    //       {
    //         key: 'deptname',
    //         opt: 'LIKE',
    //         type: 'S',
    //         value: this.searchForm.deptname
    //       },
    //       // 状态
    //       {
    //         key: 'status',
    //         opt: 'LIKE',
    //         type: 'S',
    //         value: this.searchForm.status
    //       },
    //       // 体系分类
    //       {
    //         key: 'system',
    //         opt: 'LIKE',
    //         type: 'S',
    //         value: this.searchForm.system
    //       },
    //       // 生效日期
    //       {
    //         key: 'effectivedate',
    //         opt: 'BETWEEN',
    //         type: 'D',
    //         value:
    //             this.searchForm.value1 && this.searchForm.value1.length
    //               ? this.searchForm.value1[0] + ' 00:00:00' + '~' + this.searchForm.value1[1] + ' 23:59:59'
    //               : ''
    //       }
    //     ]
    //   }
    //   getBooksList(obj).then(res => {
    //     if (!res) return false
    //     this.booksList = res.list.map(item => {
    //       item.effectiveion = !item.effectiveion
    //         ? ''
    //         : getFormateDate(item.effectiveion, 'yyyy-MM-dd')
    //       return item
    //     })
    //     this.pages.total = res.total
    //   })
    // },
    reset() {
      this.pages.pageNum = 1
      this.searchForm = {
        title: '',
        enname: '',
        provideruser: '',
        docAuthorDis: '',
        status: '',
        name: '',
        value1: []
      }
      this.filters = []
      this.getList()
    },
    async getList() {
      console.log(this.filters)
      this.loading = true
      const obj = {
        orderby: 'createon',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: 'desc',
        logic: 'and',
        filters: this.filters,
        attr: { folderid: this.modelid }
      }
      await getBooksList(obj).then(res => {
        if (!res) return false
        this.booksList = res.list.map(item => {
          item.effectiveion = !item.effectiveion
            ? ''
            : getFormateDate(item.effectiveion, 'yyyy-MM-dd')
          return item
        })
        this.pages.total = res.total
      })
      this.loading = false
    },
    // 确认添加
    saveBooks() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // 生效日期验证
          if (this.editFormObj.effectiveDate.length === 0) {
            this.$message({
              type: 'warning',
              message: this.dateNotSelected
            })
            return
          }
          // 主文档验证
          if (this.fileList.length !== 1) {
            this.$message({
              type: 'warning',
              message: this.pleaseUploadtheMainDocument
            })
            return
          }
          const obj = {
            docId: !this.editFormObj.docId ? '' : this.editFormObj.docId,
            docTitle: this.editFormObj.docTitle,
            fileId: this.referMainDoc ? this.fileList[0].fileId : '',
            inDate: getFormateDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
            folderDocumentList: [{ documentid: '', folderid: this.modelid }],
            enname: this.editFormObj.enname,
            signerlist: [{ userid: this.userid, cnname: this.username }],
            system: this.editFormObj.checkList.toString(),
            effectiveDate: !this.editFormObj.effectiveDate
              ? ''
              : getFormateDate(
                  this.editFormObj.effectiveDate,
                  'yyyy-MM-dd hh:mm:ss'
                )
          }
          saveBooks(obj).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: this.saveSuccessfully
              })
              this.dialogVisible = false
              this.getList()
            }
          })
        } else {
          this.$message({
            type: 'warning',
            message: this.requiredFieldsCannotBeEmpty
          })
        }
      })
    },
    deleteFile() {
      this.fileList = []
    },
    // 删除表格某一行数据
    deleteRow(id) {
      this.$confirm(this.areYouSureDelete, this.hint, {
        confirmButtonText: this.confirm,
        cancelButtonText: this.cancel,
        type: 'warning'
      })
        .then(() => {
          deleteBooks(id).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: this.successfullyDelete
              })
              this.getList()
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 作废
    abolishRow(item, type) {
      const me = this
      this.docId = item.docId
      this.$confirm(
        this.areYouSureYouWantToInvalidateThisInformation,
        this.hint,
        {
          confirmButtonText: this.confirm,
          cancelButtonText: this.cancel,
          type: 'warning'
        }
      )
        .then(() => {
          getModelapprove('6').then(res => {
            if (res.choosed === 'bpm') {
              this.paramsData = {
                processName: item.processName,
                PROJECTNAME: item.projectName,
                name: item.processNameCn
              }
              getPost(this.$store.state.basuser.user.id).then(rt => {
                if (rt.status === '200') {
                  if (rt.data && rt.data.length > 0) {
                    if (rt.data.length > 1) {
                      this.itemData = rt.data
                      this.dialogVisible = true
                    } else if (rt.data.length === 1) {
                      window.open(
                        window.location.origin +
                          window.location.pathname +
                          `#/processForm/start?name=%E5%88%B6%E5%BA%A6%E4%BD%9C%E5%BA%9F%E5%AE%A1%E6%89%B9%E6%B5%81%E7%A8%8B&processName=ZDZFSPLC&projectName=ZDZFSPLC&pid=${this.itempid}&docid=${this.docId}`,
                        '_blank'
                      )
                    }
                  }
                }
              })
            } else if (res.choosed === 'direct') {
              updateStatusRule({
                id: item.docId,
                status: 5
              }).then(res => {
                if (!res) return false
                this.$message({
                  type: 'success',
                  message: this.invalidSuccess
                })
                this.keyWords = ''
                this.reset()
              })
            }
          })

          // getPost(this.$store.state.basuser.user.id).then((rt) => {
          //   if (rt.status === '200') {
          //     if (rt.data && rt.data.length > 0)
          //       if (rt.data.length > 1) {
          //         this.itemData = rt.data
          //         this.dialogVisible = true
          //       } else {
          //                   getModelapprove('6').then((res) => {
          //   console.log(window.location)
          //   switch (true) {
          //     case res.choosed === 'bpm':
          //       window.open(
          //         window.location.origin +
          //           `/#/processForm/start?name=%E5%88%B6%E5%BA%A6%E4%BD%9C%E5%BA%9F%E5%AE%A1%E6%89%B9%E6%B5%81%E7%A8%8B&processName=ZDZFSPLC&projectName=ZDZFSPLC&docid=${item.docId}`,
          //         '_blank'
          //       )
          //       // getStartProcessForm(item.docid).then(res => {
          //       //   console.log(res)
          //       // })
          //       // if (item.status == 7) {
          //       //   abolishRefuse({
          //       //     docid: item.docId,
          //       //     type: 'docid',
          //       //     userid: userId,
          //       //     newdocid: item.docId
          //       //   }).subscribe(res => {
          //       //     let openUrl = `${process.env.URL_BAS_HOST}${Base64.encode(
          //       //       userId + '●password1'
          //       //     )}&param=${Base64.encode(res.url + '&lang=zh-CN')}`
          //       //     window.open(openUrl)
          //       //   })
          //       // } else {
          //       //   let urlStr = `/bpm/creater-process!apply.action?processname=Departmentdutiesprocess&processnodename=Start&projectname=departmentdutiesprocess&defaultOrganization=39390&baProcessId=${item.docId}&state=5&lang=zh-CN`
          //       //   let openUrl = `${process.env.URL_BAS_HOST}${Base64.encode(
          //       //     userId + '●password1'
          //       //   )}&param=${Base64.encode(urlStr)}`
          //       //   window.open(openUrl)
          //       // }

          //       break
          //     case res.choosed === 'direct':
          //       updateStatusRule({
          //         id: item.docId,
          //         status: 5,
          //       }).then((res) => {
          //         if (!res) return false
          //         this.$message({
          //           type: 'success',
          //           message: this.invalidSuccess,
          //         })
          //         this.keyWords = ''
          //         this.reset()
          //       })
          //       break
          //   }
          // })
          //     }
          //     }
        })

        .catch(err => {
          console.log(err)
        })
      // })
    },
    saveSuccess(item, type) {
      this.itempid = item[0].id
      // this.toHref(this.paramsData, data[0].id)
      if (this.type === 'publish' || this.type === 'approvalAgain') {
        window.open(
          window.location.origin +
            window.location.pathname +
            `#/processForm/start?name=%E5%88%B6%E5%BA%A6%E5%8F%91%E5%B8%83%E5%AE%A1%E6%89%B9%E6%B5%81%E7%A8%8B&processName=ZDFBSPLC&projectName=ZDFBSPLC&pid=${item[0].id}&docid=${this.docid}`,
          '_blank'
          // window.location.origin +
          //   `/#/processForm/start?name=%E5%88%B6%E5%BA%A6%E5%8F%91%E5%B8%83%E5%AE%A1%E6%89%B9%E6%B5%81%E7%A8%8B&processName=ZDFBSPLC&projectName=ZDFBSPLC&pid=${item[0].id}&docid=${this.docid}`,
          // '_blank'
        )
      } else {
        window.open(
          window.location.origin +
            window.location.pathname +
            `#/processForm/start?name=%E5%88%B6%E5%BA%A6%E4%BD%9C%E5%BA%9F%E5%AE%A1%E6%89%B9%E6%B5%81%E7%A8%8B&processName=ZDZFSPLC&projectName=ZDZFSPLC&pid=${item[0].id}&docid=${this.docId}`,
          '_blank'
          // window.location.origin +
          //   `/#/processForm/start?name=%E5%88%B6%E5%BA%A6%E4%BD%9C%E5%BA%9F%E5%AE%A1%E6%89%B9%E6%B5%81%E7%A8%8B&processName=ZDZFSPLC&projectName=ZDZFSPLCpid=${item[0].id}&docid=${this.docId}`,
          //   '_blank'
        )
      }
    },

    // 修改功能
    getDetails(item, edit = true) {
      this.editItem = JSON.parse(JSON.stringify(item))
      this.isDialogsVisible = true
      this.cardEdit = edit
      // console.log(id)
      // this.referMainDoc = false
      // getDetails(id).then(res => {
      //   console.log(res)
      //   if (!res) return false
      //   this.editFormObj = res
      //   this.dialogVisible = true
      //   this.titleName = this.editRulesAndRegulations
      //   this.editFormObj = Object.assign({}, this.editFormObj, {
      //     docTitle: res.title,
      //     effectiveDate: getFormateDate(
      //       res.effectiveion,
      //       'yyyy-MM-dd'
      //     ),
      //     docId: res.docId,
      //     checkList: !res.system ? [] : res.system.split(',')
      //   })
      //   this.fileList = res.docFile.map(item => {
      //     return {
      //       filename: item.originalname,
      //       filesize: item.fileSize + 'B',
      //       downloadUrl: item.downloadUrl,
      //       status: this.$t('uploaded'),
      //       fileId: res.docId
      //     }
      //   })
      //   console.log(this.fileList)
      // })
    },
    handlerFileUploadSuccess(res) {
      if (this.fileList.length === 1) {
        this.$message({
          type: 'warning',
          message: this.pleaseDeleteItAndUploadItAgain
        })
      } else {
        if (res.code === 200) {
          this.referMainDoc = true
          this.fileList.push({
            filename: res.data.newName,
            filesize: res.data.size + 'B',
            downloadUrl: this.host + '/regulation/download/' + res.data.id,
            status: this.$t('uploaded'),
            fileId: res.data.id
          })
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('hintText.attachmentUploadedfailed')
          })
        }
      }
    },
    // 发布
    showPublishDialog(rowData) {
      console.log(rowData)
      this.$confirm(this.type === 'approvalAgain' ? this.$t('areYouSureToResubmitTheProcessForApproval') : this.areYouSureYouWantToRelease, this.hint, {
        confirmButtonText: this.confirm,
        cancelButtonText: this.cancel,
        type: 'warning'
      })
        .then(() => {
          this.currentPublishData = rowData
          // 显示制度发布提示弹框
          this.publishDialogVisible = true
          this.$refs.publishDialog.getRelationalProcessList(rowData.docId)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    confirmPublishDialog(currentPublishData) {
      if (this.publishType === 'bpm') {
        getPost(this.$store.state.basuser.user.id).then(rt => {
          if (rt.status === '200') {
            if (rt.data && rt.data.length > 0) {
              if (rt.data.length > 1) {
                this.itemData = rt.data
                this.dialogVisible = true
              } else {
                window.open(
                  window.location.origin +
                    window.location.pathname +
                    `#/processForm/start?name=%E5%88%B6%E5%BA%A6%E5%8F%91%E5%B8%83%E5%AE%A1%E6%89%B9%E6%B5%81%E7%A8%8B&processName=ZDFBSPLC&projectName=ZDFBSPLC&pid=${this.itempid}&docid=${this.docid}`,
                  '_blank'
                  //       // window.location.origin +
                  //       //   `/#/processForm/start?name=%E5%88%B6%E5%BA%A6%E5%8F%91%E5%B8%83%E5%AE%A1%E6%89%B9%E6%B5%81%E7%A8%8B&processName=ZDFBSPLC&projectName=ZDFBSPLC&pid=${item[0].id}&docid=${this.docid}`,
                  //       // '_blank'
                )
              }
            }
          }
        })
      } else {
        updateStatusRule({
          id: currentPublishData.docId,
          status: 3
        }).then(async res => {
          if (!res) return false
          // 制度发布成功后, 通知关联流程发布人
          const processPublishers = JSON.parse(
            localStorage.getItem('processPublishers')
          )
          this.$message({
            type: 'success',
            message: this.releaseSuccess
          })
          this.keyWords = ''
          this.reset()
          if (processPublishers.processid.length) {
            processPublishers.processid = processPublishers.processid.join(',')
            // 调用接口, 通知关联流程发布人
            const result = await saveRelationalProcessIds(processPublishers)
            const response = await noticeRelationalProcessManagers(currentPublishData.docId)
          }
        })
      }
    },
    // 发布事件
    publishReg(item, type) {
      this.type = type
      this.docid = item.docId
      const me = this
      getModelapprove('6').then(res => {
        if (!res) {
          this.$message({
            message: '数据有误！',
            type: 'error'
          })
          return
        }
        if (res.choosed === 'bpm') {
          this.paramsData = {
            processName: item.processName,
            PROJECTNAME: item.projectName,
            name: item.processNameCn
          }
          this.publishType = 'bpm'
          this.showPublishDialog(item)
        } else if (res.choosed === 'direct') {
          this.publishType = 'direct'
          this.showPublishDialog(item)
        }
      })
      // this.paramsData = {
      //   processName: item.processName,
      //   PROJECTNAME: item.projectName,
      //   name: item.processNameCn,
      // }
      // getPost(this.$store.state.basuser.user.id).then((rt) => {
      //   if (rt.status === '200') {
      //     if (rt.data && rt.data.length > 0) {
      //       if (rt.data.length > 1) {
      //         this.itemData = rt.data
      //         this.dialogVisible = true
      //       } else {
      //         getModelapprove('6').then((res) => {
      //           console.log(res)
      //           console.log(item)
      //           switch (true) {
      //             case res.choosed === 'bpm':
      //               window.open(
      //                 window.location.origin +
      //                   `/#/processForm/start?name=%E5%88%B6%E5%BA%A6%E5%8F%91%E5%B8%83%E5%AE%A1%E6%89%B9%E6%B5%81%E7%A8%8B&processName=ZDFBSPLC&projectName=ZDFBSPLC&docid=${item.docId}`,
      //                 '_blank'
      //               )

      //               // if (item.status == 6) {
      //               //   pblishRefuse({
      //               //     docid: item.docId,
      //               //     type: 'docid',
      //               //     userid: userId,
      //               //     newdocid: item.docId
      //               //   }).subscribe(res => {
      //               //     let openUrl = `${process.env.URL_BAS_HOST}${Base64.encode(
      //               //       userId + '●password1'
      //               //     )}&param=${Base64.encode(res.url + '&lang=zh-CN')}`
      //               //     window.open(openUrl)
      //               //   })
      //               // } else {
      //               //   let urlStr = `/bpm/creater-process!apply.action?processname=Manualsystemprocess&processnodename=Start&projectname=manualsystemprocess&defaultOrganization=39390&baProcessId=${
      //               //     item.docId
      //               //   }&state=${item.status == 1 ? 3 : 4}&lang=zh-CN`
      //               //   let openUrl = `${process.env.URL_BAS_HOST}${Base64.encode(
      //               //     userId + '●password1'
      //               //   )}&param=${Base64.encode(urlStr)}`
      //               //   window.open(openUrl)
      //               // }
      //               break
      //             case me.choosed === 'direct':
      //               console.log(item)
      //               updateStatusRule({
      //                 id: item.docId,
      //                 status: 3,
      //               }).then((res) => {
      //                 if (!res) return false
      //                 this.$message({
      //                   type: 'success',
      //                   message: this.releaseSuccess,
      //                 })
      //                 this.keyWords = ''
      //                 this.reset()
      //               })
      //               break
      //           }
      //         })
      //       }
      //     }
      //   }
      // })
    },
    // 文本框字数限制
    descInput1(editFormObj) {
      if (this.editFormObj.docTitle.length > this.textMaxLength) {
        this.$message({
          message: this.fieldNameShouldNotExceedFiftyWords,
          type: 'error'
        })
      }
    },
    descInput2(editFormObj) {
      if (this.editFormObj.enname.length > this.textMaxLength) {
        this.$message({
          message: this.fieldNameShouldNotExceedFiftyWords,
          type: 'error'
        })
      }
    },
    // 获取体系分类
    getSystem() {
      getSystem({
        attr: {},
        filters: [
          {
            key: 'RULE_IS_VISIBLE',
            opt: 'EQ',
            type: 'S',
            value: 'Y'
          }
        ],
        logic: '',
        orderby: '',
        pageNum: 1,
        pageSize: 10000,
        sort: ''
      }).then(res => {
        this.sysLists = res
      })
    },
    jumpProcess(row) {
      if (row.relationProcess[0].isJump == 'Y') {
        this.$router.push(
          '/processDetails/' + row.relationProcess[0].releasedProcessId
        )
      } else {
        this.$message({
          message: '该流程未发布',
          type: '该流程未发布'
        })
      }
    },
    toJumpDetail(row) {
      if (row.version == 'V202100') {
        return this.$message({
          showClose: true,
          message: '该制度未发布,不可跳转!!',
          type: 'error'
        })
      } else {
        this.$router.push('/rulesDetail/' + row.docId + '/' + row.revId)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search_buttons_wrap {
  display: flex;
  justify-content: flex-end;
}

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

  .con {
    width: 100%;
  }

  .custom-tree-node {
    // width: calc(100% - 24px);
    // width: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;

    p {
      max-width: 100%;
      // overflow: hidden;
      // text-overflow: ellipsis;
    }
  }
}

.rightPart {
  height: 100% !important;
}

/deep/ .el-scrollbar__thumb {
  background-color: rgba(153, 153, 153, 0.3);
  padding: 0;
  margin-left: 2px;
  margin-bottom: 2px;
}

/deep/ .el-input-group__append,
.el-input-group__prepend {
  background-color: #2d42af;
  color: white;
}

.searchTree {
  cursor: pointer !important;
}

.history-btn {
  text-align: right;
  margin-top: 16px;
}

.high-level-search {
  padding-right: 15px;
}

.el-dialog .el-dialog__body {
  text-align: center;
}

.clear-padding {
  padding-right: 0 !important;
}

.el-scrollbar__wrap {
  overflow-x: hidden;
}

// .clear-left-padding{
//   padding-left: 0!important;
// }
.form-section {
}

.main_tab {
  margin-top: 15px;
}

/deep/ .el-table {
  border: 0;
}
</style>
