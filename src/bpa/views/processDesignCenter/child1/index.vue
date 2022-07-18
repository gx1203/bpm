<template>
  <div id="processDesignCenter" class="pageWrap">
    <div class="content">
      <div class="leftTree" ref="leftTree">
        <el-row>
          <bas-search
            :placeholder="
              $t('placeholderText.pleaseEnterEnterpriseProcessArchitecture')
            "
            class="remove-margin-b"
            v-model="keyWords"
            @fnSearch="filterTree"
          />
        </el-row>
        <div class="left_tree_wrapper margin-t10">
          <el-tree
            ref="tree"
            class="filter-tree"
            :props="props"
            :load="loadNode"
            node-key="id"
            lazy
            v-show="!controlTree"
            :default-expanded-keys="grandParentId"
            :expand-on-click-node="false"
            @node-click="treeNodeClick"
          >
            <div
              :class="data.isVisible === '0' ? 'disabled' : ''"
              class="custom-tree-node w100"
              slot-scope="{ node, data }"
            >
              <span :class="data.pid ? 'process_02' : 'process_01'"></span>
              <p
                :class="{ green: data.release === 'Y' }"
                @click="nodeClick(node, data)"
                :title="node.label"
                style="font-size: 13px"
              >
                {{
                  node.label +
                    '(' +
                    data.childrenReleaseCount +
                    '/' +
                    data.childrenCount +
                    ')'
                }}
              </p>
            </div>
          </el-tree>
          <el-tree
            class="filter-tree"
            ref="treeFilter"
            node-key="id"
            :props="props"
            :data="treelist"
            v-show="controlTree"
            :default-expand-all="true"
            :expand-on-click-node="false"
            @node-click="treeNodeClick"
          >
            <div
              :class="data.isVisible === '0' ? 'disabled' : ''"
              class="custom-tree-node w100"
              slot-scope="{ node, data }"
            >
              <span :class="data.pid ? 'process_02' : 'process_01'"></span>
              <p
                :class="{ green: data.release === 'Y' }"
                @click="nodeClick(node, data)"
                :title="node.label"
                style="font-size: 13px"
              >
                {{
                  node.label +
                    '(' +
                    data.childrenReleaseCount +
                    '/' +
                    data.childrenCount +
                    ')'
                }}
              </p>
            </div>
          </el-tree>
        </div>
      </div>
      <div class="listContent">
        <div ref="rightRef" class="w100 rightIframe">
          <bas-table
            v-show="!showProcessEditor"
            row-key="id"
            :tableList="processList"
            :headerList="headerList"
            :pages="pages"
            :isShowIndex="true"
            @currentChange="handleCurrentChange"
          >
            <!-- 搜索区域 -->
            <template #search>
              <el-row class="margin-b10">
                <el-col :span="10">
                  <bas-search
                    :placeholder="
                      $t('placeholderText.pleaseEnterProcessNameOrCode')
                    "
                    class="remove-margin-b"
                    v-model="searchKey"
                    @fnSearch="getList"
                  />
                </el-col>
                <el-col :span="14" class="text-r">
                  <el-button type="primary" @click="goProcessDesign">
                    {{ $t('newAdd') }}
                  </el-button>
                </el-col>
              </el-row>
            </template>
            <!-- 生效日期 -->
            <template #effectiveon="{ row }">{{
              row.effectiveon | formatDate
            }}</template>

            <!-- 状态 -->
            <template #state="{ row }">{{ row.state | designState }}</template>

            <!-- 操作 -->
            <template #default="{ row }">
              <div
                v-if="['1', '5', '6', '8', '10'].includes(row.state)"
                class="btn-item"
              >
                <el-button
                  class="no-border"
                  type="text"
                  @click="openCard(row, 'view')"
                >
                  {{ $t('view') }}
                </el-button>
                <i class="i-item" v-if="!['3'].includes(row.state)" />
              </div>
              <div
                v-if="['6', '8'].includes(row.state)"
                class="btn-item"
              >
                <el-button
                  class="no-border"
                  type="text"
                  @click.native="operatingprocess(row, 'approvalAgain')"
                >
                  {{ $t('approvalAgain') }}
                </el-button>
              </div>
              <div v-if="row.state == '2'" class="btn-item">
                <el-button
                  class="no-border"
                  type="text"
                  @click="openCard(row, 'add')"
                >
                  {{ $t('newAdd') }}
                </el-button>
                <i class="i-item" />
              </div>
              <div
                class="btn-item"
                v-if="['5', '7', '9', '11', '12'].includes(row.state)"
              >
                <el-button
                  class="no-border"
                  @click="openCard(row, 'modify')"
                  type="text"
                >
                  {{ $t('modify') }}
                </el-button>
                <i class="i-item" />
              </div>
              <div class="btn-item" v-if="['1', '10'].includes(row.state)">
                <el-button
                  class="no-border"
                  @click="openCard(row, 'modify')"
                  type="text"
                >
                  {{ $t('revise') }}
                </el-button>
                <i class="i-item" />
              </div>
              <!-- <div
                class="btn-item"
                v-if="
                  ['1', '2', '5', '7', '9', '10', '11', '12'].includes(
                    row.state
                  )
                "
              >
                <el-button
                  class="no-border"
                  @click="drawingCard(row, 'drawing')"
                  type="text"
                >
                  {{ $t('drawing') }}</el-button
                >
                <i class="i-item" />
              </div> -->
              <el-dropdown v-if="!['3', '6', '8'].includes(row.state)">
                <span class="el-dropdown-link">
                  {{ $t('toMore') }}<i class="el-icon-arrow-down"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-if="['5', '7', '9', '10', '12'].includes(row.state)"
                    @click.native="operatingprocess(row, 'bpaPublish')"
                  >
                    <span class="eldropdown">
                      {{ $t('publish') }}
                    </span>
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="row.state == '1'"
                    @click.native="operatingprocess(row, 'abolish')"
                  >
                    <span class="eldropdown">{{ invalidi18n }}</span>
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click.native="processDoc(row, 'view')"
                    v-if="!['1', '2', '5', '6', '8', '10'].includes(row.state)"
                  >
                    <span class="eldropdown">{{ $t('DocPreview') }}</span>
                  </el-dropdown-item>
                  <!-- <el-dropdown-item
                        @click.native="chartIdentify(row, 'img')"
                      >
                        <span class="eldropdown">{{
                          $t("ImageResolution")
                        }}</span>
                      </el-dropdown-item> -->

                  <!-- <el-dropdown-item
                        @click.native="chartIdentify(row, 'word')"
                      >
                        <span class="eldropdown">{{ $t("WordParsing") }}</span>
                      </el-dropdown-item> -->
                  <el-dropdown-item
                    v-show="row.state !== '6' && row.state !== '8'"
                    @click.native="processCardIn(row)"
                  >
                    <span class="eldropdown">{{ processImageImport }}</span>
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-show="row.state !== '6' && row.state !== '8'"
                    @click.native="processIn(row)"
                  >
                    <span class="eldropdown">{{ processImport }}</span>
                  </el-dropdown-item>
                  <!-- <el-dropdown-item
                        @click.native="chartIdentify(row, 'viso')"
                      >
                        <span class="eldropdown">{{
                          $t("intelligentIdentification")
                        }}</span>
                      </el-dropdown-item> -->
                  <el-dropdown-item
                    @click.native="processDoc(row, 'download')"
                    v-if="!['1', '2', '5', '6', '8', '10'].includes(row.state)"
                  >
                    <span class="eldropdown">{{ $t('DocumentDownload') }}</span>
                  </el-dropdown-item>

                  <el-dropdown-item
                    v-if="['7', '9', '11', '12'].includes(row.state)"
                    @click.native="operatingprocess(row, 'clear')"
                  >
                    <span class="eldropdown">{{ emptyi18n }}</span>
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click.native="toBack(row)"
                    v-if="['5', '7', '9', '10', '11', '12'].includes(row.state)"
                  >
                    <span class="eldropdown">{{ restorei18n }}</span>
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click.native="processOut(row)"
                    v-if="row.state === '1'"
                  >
                    <span class="eldropdown">{{ processExport }}</span>
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click.native="processCardOut(row)"
                    v-if="row.state === '1'"
                  >
                    <span class="eldropdown">{{ processImageExport }}</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </bas-table>

          <div v-if="showProcessEditor" class="w100 h100 bg-white" ref="iFrame">
            <el-tabs
              v-model="chartmodel"
              type="card"
              closable
              @tab-remove="removeTab"
              @tab-click="tabClick"
            >
              <el-tab-pane
                :key="item.id"
                v-for="item in lisdata"
                :label="item.name"
                :name="item.id"
              ></el-tab-pane>
            </el-tabs>
            <iframe
              class="w100 h100 iframeProcess"
              id="iframeUrlId"
              :src="iframeSrc"
            ></iframe>
          </div>
        </div>
      </div>
    </div>

    <process-card
      v-model="isDialogsVisible"
      :version="version"
      :modelid="listid"
      :bpmid="bpmid"
      :treeId="modelid"
      :processcode="processcode"
      :modules="modules"
      :processState="processState"
      :currentCardType="currentCardType"
      @close="close"
    ></process-card>
    <process-in
      v-model="processDialogsVisible"
      :processMethod="processMethod"
      :processId="processId"
      :processState="processState"
      @confirm="processConfirm"
    ></process-in>

    <!-- 智能识别 -->
    <chart-identify
      v-model="chartDialogsVisible"
      :modelid="listid"
      :bpmid="bpmid"
      :upType="upType"
      @closeChart="closeChart"
    >
    </chart-identify>
    <!-- 发布版本的弹框 -->
    <!-- <el-dialog title="请选择发布版本" :visible.sync="versionDialogVisible" width="50%">
      <el-table :data="gridData">
        <el-table-column type="selection" label="日期" width="150"></el-table-column>
        <el-table-column property="name" label="版本号" width="200"></el-table-column>
        <el-table-column property="address" label="更新时间"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="resetPublish">重新部署</el-button>
        <el-button type="primary" @click="Publish">部 署</el-button>
        <el-button @click="versionDialogVisible = false">{{$t("cancel")}}</el-button>
      </div>
    </el-dialog>-->
    <choose-jobs
      :item="itemData"
      v-model="dialogVisible"
      @confirm="saveSuccess"
    ></choose-jobs>
    <publish-process-version
      :item="versionObj"
      v-model="processVersionDialog"
      @confirm="publishVersion"
    ></publish-process-version>
  </div>
</template>
<script>
// import Dialogs from './Dialogs.vue'
import {
  getProcessIframeTree,
  getProcessTreeNodeCode,
  searchProcessIframeTree,
  getDownloadAuthByModelId,
  searchProcessIframeTreeNew,
  searchProcessIframeTree1
} from '@/bpa/api/componentsApi'
import {
  getProcesslist,
  viewProcessDoc,
  downloadProcessDoc,
  restoreProcess,
  publishProcess,
  publishbpmProcess,
  abolishProcess,
  abolishProcess2,
  clearprocess,
  saveReview,
  saveReview2,
  jobsList,
  processStarted,
  importProcessJson,
  exportProcessJsonToTxt,
  importProcessChartJson,
  exportProcessChartJsonToTxt,
  releaseVerification,
  getModelapprove,
  queryProcessDesignListInfo
} from '@/bpa/api/processDesignCenter'
import { getstation } from '@/bpa/api/jobsCenter'
import { getPost } from '@/bpm/api/process/administrativeTool/agents_change'
import cookie from 'js-cookie'
import moment from 'moment'
import processCard from './components/processCard.vue'
import processCard3 from './components/processCard-langji.vue'
import processIn from './components/processIn.vue'
import chartIdentify from './components/chartIdentify'
import correlationSupport from './components/correlationSupport'
import sortButton from '@/bpa/components/SortButton.vue'
import axios from 'axios'
// 控制流程审批的方式
import { requireProcess } from '@/bpa/api/settings/processApprovalManage'
import chooseJobs from '@/bpm/views/staging/personal/applyCreate/chooseJobs'
import publishProcessVersion from './components/publishProcessVersion'
import {
  getWordJpg,
  getCommunityhistoryList
} from '@/bpa/api/processModelCenter/processCommunity'
import { processSaveAttr } from '@/bpa/api/processDesignCenter'
export default {
  components: {
    processCard,
    processCard3,
    processIn,
    chartIdentify,
    correlationSupport,
    sortButton,
    chooseJobs,
    publishProcessVersion
  },
  data() {
    return {
      // 表头字段
      headerList: [
        {
          label: this.$t('architectureCoding'), // 流程编码
          prop: 'code',
          width: 100
        },
        {
          label: this.$t('processName2'), // 流程名称
          prop: 'name'
        },
        {
          label: this.$t('processManager'), // 流程责任人
          prop: 'bponame',
          width: 90
        },
        {
          label: this.$t('ManagerDept'), // 主责部门
          prop: 'orgname'
        },
        {
          label: this.$t('version'), // 版本
          prop: 'version',
          width: 50
        },
        {
          label: this.$t('effectiveDate'), // 生效日期
          prop: 'effectiveon',
          slotName: 'effectiveon'
        },
        {
          label: this.$t('state'), // 状态
          prop: 'state',
          slotName: 'state'
        },
        {
          label: this.$t('operation'), // 操作
          prop: 'default',
          slotName: 'default',
          width: 160
        }
      ],
      currentCardType: 'modify',
      operationType: '',
      versionList: [],
      upType: '',
      jpgSrc: [],
      imgsShow: false,
      dialogVisible: false,
      itemData: [],
      bpmListId: '',
      //国际化
      pleaseEnterTheContent: this.$t('placeholderText.pleaseEnterTheContent'),
      bpa_number: this.$t('bpa_number'),
      architectureCoding: this.$t('architectureCoding'),
      systemName: this.$t('systemName'),
      processName2: this.$t('processName2'),
      processManager: this.$t('processManager'),
      ManagerDept: this.$t('ManagerDept'),
      versioni18n: this.$t('version'),
      effectiveDatei18n: this.$t('effectiveDate'),
      statei18n: this.$t('state'),
      operationi18n: this.$t('operation'),
      processDocPreview: this.$t('processDocPreview'),
      IntelligentImageRecognition: this.$t('IntelligentImageRecognition'),
      downloadProcessDoc: this.$t('downloadProcessDoc'),
      newAddi18n: this.$t('newAdd'),
      modifyi18n: this.$t('AttributeChanges'),
      bpapublishi18n: 'bpa ' + this.$t('publish'),
      bpmpublishi18n: 'bpm ' + this.$t('publish'),
      invalidi18n: this.$t('invalid'),
      emptyi18n: this.$t('empty'),
      restorei18n: this.$t('restore'),
      processExport: this.$t('processExport'),
      processImageExport: this.$t('processImageExport'),
      processImport: this.$t('processImport'),
      processImageImport: this.$t('processImageImport'),
      // 展示流程设计器
      chartmodel: '',
      showProcessEditor: false,
      modifyProcessId: '',
      processList: [],
      processListObj: {},
      processlistpage: 1,
      modelid: '',
      listid: '',
      bpmid: '',
      keyWords: '',
      treelist: [],
      grandParentId: [],
      isDialogsVisible: false,
      processDialogsVisible: false,
      processMethod: '',
      processId: '',
      processState: '',
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      props: {
        label: 'name',
        isLeaf: function(data, node) {
          if (data.isparent === true) {
            return false
          } else {
            return true
          }
        }
      },
      // iframe地址
      iframeSrc: '',
      // 列表的行
      selectedItem: {},
      lisdata: [],
      controlTree: false,
      defaultSelected: true,
      // 流程编码
      processcode: '',
      // 模块
      modules: '',
      userId: cookie.get('username'),
      process_bpa_publish: '',
      process_review: '',
      process_invalid: '',
      version: '',
      chartDialogsVisible: false,
      jobsArray: [],
      shadeShow: true,
      searchKey: '',
      processVersionDialog: false,
      versionObj: {},
      versionId: ''
    }
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    html() {
      return process.env.VUE_APP_BPA_HTML_URL
    },
    bpmurl() {
      return process.URL_BAS_HOST
    },
    userInfo() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
    },
    userid() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .empuid
    },
    username() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .cnname
    },
    // 岗位id处理
    postId() {
      return this.jobsArray.join(',') || ''
    },
    host2() {
      return process.env.VUE_APP_HOST_URL
    }
  },
  filters: {
    dateFm: function(el) {
      return moment(el).format('YYYY-MM-DD')
    }
  },
  created() {
    // 流程发布获取值
    this.getprocessType()
    // this.getJobsList()
    let self = this
    // 全屏
    window.onFullScreen = () => {
      if (self.$refs.iFrame.getAttribute('class').indexOf('fullEditor') > -1) {
        self.$refs.iFrame.classList.remove('fullEditor')
      } else {
        self.$refs.iFrame.classList.add('fullEditor')
      }
    }
    // 返回列表
    window.exitFullScreen = () => {
      if (self.$refs.iFrame.getAttribute('class').indexOf('fullEditor') > -1) {
        self.$refs.iFrame.classList.remove('fullEditor')
      }
      self.clearIframeInter()
      self.showProcessEditor = false
      self.getList()
    }
    // bpa发布
    window.openBpmUrl = (state, listid, bpmid, type, version) => {
      if (this.process_bpa_publish === 'bpm') {
        /* ------------------走发布流程代码---------------------开始 */
        // let lang = '';
        // if (translateCookie() === 'en') {
        //   lang = 'JnJlcXVlc3RfbG9jYWxlPWVu';
        // } else if (translateCookie() === 'zh-CN') {
        //   lang = 'JnJlcXVlc3RfbG9jYWxlPXpoX0NO';
        // }
        // if (state == '3' || state == '4') {
        //   let urlStr = '/bpm/creater-process!apply.action?processname=SPLCProcess&processnodename=Start&projectname=SPLCProject&defaultOrganization=39390&baProcessId='+listid+'&state=' + (state == 3 ? 3:4);
        //   let str = self.bpmurl + window.localStorage.getItem('loginInfo')+'&param=';
        //   window.open(str + Base64.encode(urlStr) + lang);
        // }
        // else if (state == '5') {
        //   let urlStr = '/bpm/creater-process!apply.action?processname=ZFLCProcess&processnodename=Start&projectname=ZFLCProject&defaultOrganization=39390&baProcessId='+listid;
        //   let str = self.bpmurl  + window.localStorage.getItem('loginInfo')+'&param=';
        //   window.open(str + Base64.encode(urlStr) + lang);
        // } else if (state == '7' || state == '8') {
        //   $.ajax({
        //     type: 'post',
        //     data: JSON.stringify({
        //       'docid': listid,
        //       'type': 'process',
        //       'userid': getCookie('username')
        //     }),
        //     dataType: 'json',
        //     contentType: 'application/json;charset=UTF-8',
        //     url: 'http://http://10.226.57.77/tmportal/regulationBpm/getBpmUrl ',
        //     success: function (data) {
        //       let urlStr = data.url;
        //       let str = url  + window.localStorage.getItem('loginInfo')+'&param=';
        //       window.open(str + Base64.encode(urlStr) + lang);
        //     }
        //   })
        // }
        getstation(this.userid).then(res => {
          if (!res) return false
          processStarted({
            bizData: { FBLCBPAID: listid },
            positionId: res[0].id,
            processName: '流程发布审批',
            processNodeName: 'Start',
            projectName: 'Lcfbsp',
            subject: '流程发布审批',
            userId: this.userid
          }).then(res => {
            if (!res) return false
            this.$message({
              type: 'sucess',
              message: '发布成功!'
            })
          })
        })
        /* ------------------直接走发布流程代码---------------------结束 */
      } else if (this.process_bpa_publish === 'direct') {
        publishProcess({
          id: listid,
          templateVersion: version
        }).then(res => {
          if (!res) return false
          this.$message({
            type: 'success',
            message: this.$t('hintText.releaseSuccess')
          })
          self.processlistpage = 1
          self.getList()
        })
        // 外部系统审核
      } else if (this.process_bpa_publish === 'directbpm') {
        /* ------------------发布调用bpm的接口---------------------开始 */
        // publishbpmProcess({
        //   listid: bpmid,
        //   swimid: listid
        // }).then(res => {
        //   console.log(res)
        //   this.$message({
        //     type: 'success',
        //     message: '发布成功!'
        //   })
        // })
        /* ------------------发布调用bpm的接口---------------------结束 */
      }
    }
    // bpm发布
    window.openBpmUrl4 = (state, listid, bpmid, type) => {
      if (this.process_bpm_publish === 'bpm') {
        /* ------------------走发布流程代码---------------------开始 */
        // let lang = '';
        // if (translateCookie() === 'en') {
        //   lang = 'JnJlcXVlc3RfbG9jYWxlPWVu';
        // } else if (translateCookie() === 'zh-CN') {
        //   lang = 'JnJlcXVlc3RfbG9jYWxlPXpoX0NO';
        // }
        // if (state == '3' || state == '4') {
        //   let urlStr = '/bpm/creater-process!apply.action?processname=SPLCProcess&processnodename=Start&projectname=SPLCProject&defaultOrganization=39390&baProcessId='+listid+'&state=' + (state == 3 ? 3:4);
        //   let str = self.bpmurl + window.localStorage.getItem('loginInfo')+'&param=';
        //   window.open(str + Base64.encode(urlStr) + lang);
        // }
        // else if (state == '5') {
        //   let urlStr = '/bpm/creater-process!apply.action?processname=ZFLCProcess&processnodename=Start&projectname=ZFLCProject&defaultOrganization=39390&baProcessId='+listid;
        //   let str = self.bpmurl  + window.localStorage.getItem('loginInfo')+'&param=';
        //   window.open(str + Base64.encode(urlStr) + lang);
        // } else if (state == '7' || state == '8') {
        //   $.ajax({
        //     type: 'post',
        //     data: JSON.stringify({
        //       'docid': listid,
        //       'type': 'process',
        //       'userid': getCookie('username')
        //     }),
        //     dataType: 'json',
        //     contentType: 'application/json;charset=UTF-8',
        //     url: 'http://http://10.226.57.77/tmportal/regulationBpm/getBpmUrl ',
        //     success: function (data) {
        //       let urlStr = data.url;
        //       let str = url  + window.localStorage.getItem('loginInfo')+'&param=';
        //       window.open(str + Base64.encode(urlStr) + lang);
        //     }
        //   })
        // }
        getstation(this.userid).then(res => {
          if (!res) return false
          processStarted({
            bizData: { FBLCBPAID: listid },
            positionId: res[0].id,
            processName: '流程发布审批',
            processNodeName: 'Start',
            projectName: 'Lcfbsp',
            subject: '流程发布审批',
            userId: this.userid
          }).then(res => {
            if (!res) return false
            this.$message({
              type: 'sucess',
              message: this.$t('hintText.releaseSuccess')
            })
          })
        })
        /* ------------------直接走发布流程代码---------------------结束 */
      } else if (this.process_bpm_publish === 'direct') {
        publishProcess({
          id: listid
        }).then(res => {
          if (!res) return false
          this.$message({
            type: 'success',
            message: this.$t('hintText.releaseSuccess')
          })
          self.processlistpage = 1
          self.getList()
        })
        // 外部系统审核
      } else if (this.process_bpm_publish === 'directbpm') {
        /* ------------------发布调用bpm的接口---------------------开始 */
        // publishbpmProcess({
        //   listid: bpmid,
        //   swimid: listid
        // }).then(res => {
        //   console.log(res)
        //   this.$message({
        //     type: 'success',
        //     message: '发布成功!'
        //   })
        // })
        /* ------------------发布调用bpm的接口---------------------结束 */
      }
    }
    // 作废
    window.openBpmUrl2 = (state, listid, bpmid, type) => {
      // 直接走作废流程
      if (this.process_invalid === 'direct') {
        abolishProcess({ id: listid }).then(res => {
          if (!res) return false
          this.$message({
            type: 'success',
            message: this.$t('hintText.invalidSuccess')
          })
          self.processlistpage = 1
          self.getList()
        })
        /* ------------------走bpm的作废流程---------------------结束 */
      } else if (this.process_invalid === 'bpm') {
        abolishProcess2(listid, this.postId).then(res => {
          if (!res) return false
          this.$message({
            type: 'success',
            message: this.$t('hintText.invalidSuccess')
          })
          self.processlistpage = 1
          self.getList()
        })
        // 外部系统审核
      } else if (this.process_invalid === 'directbpm') {
        /* ------------------发布调用bpm的接口---------------------开始 */
        // publishbpmProcess({
        //   listid: bpmid,
        //   swimid: listid
        // }).then(res => {
        //   console.log(res)
        //   this.$message({
        //     type: 'success',
        //     message: '发布成功!'
        //   })
        // })
        /* ------------------发布调用bpm的接口---------------------结束 */
      }
    }
    // 评审
    window.openBpmUrl3 = (state, listid, bpmid, type) => {
      // 直接走评审流程
      if (this.process_review === 'direct') {
        saveReview2(listid).then(res => {
          if (!res) return false
          this.$message({
            type: 'success',
            message: this.$t('hintText.reviewSuccess')
          })
          self.processlistpage = 1
          self.getList()
        })
      } else if (this.process_review === 'bpm') {
        // listId:流程id和postId:岗位id bpmid
        saveReview(listid, this.postId).then(res => {
          if (!res) return false
          this.$message({
            type: 'success',
            message: this.$t('hintText.reviewing')
          })
          self.processlistpage = 1
          self.getList()
        })
        // 外部系统审核
      } else if (this.process_review === 'directbpm') {
        /* ------------------发布调用bpm的接口---------------------开始 */
        // publishbpmProcess({
        //   listid: bpmid,
        //   swimid: listid
        // }).then(res => {
        //   console.log(res)
        //   this.$message({
        //     type: 'success',
        //     message: '发布成功!'
        //   })
        // })
        /* ------------------发布调用bpm的接口---------------------结束 */
      }
    }
  },
  mounted() {
    this.$refs.rightRef.style.height =
      document.documentElement.clientHeight - 160 + 'px'
    window.onresize = () => {
      if (this.$refs.rightRef) {
        this.$refs.rightRef.style.height =
          document.documentElement.clientHeight - 160 + 'px'
      }
    }
    if (this.$route.query.id) {
      this.modelid = this.$route.query.id
      this.getList()
    }
  },
  methods: {
    goProcessDesign() {
      const { href } = this.$router.resolve({
        path: '/doorCenter/TheProcessIsv?theProcessIs=true'
      })
      window.open(href, '_blank')
    },
    Suk_export(row) {
      axios({
        method: 'get',
        url: `${this.host}/modellist/export2oa/${row.id}`,
        data: {},
        responseType: 'blob',
        timeout: 60000000
      })
        .then(res => {
          const blob = new Blob([res.data], {
            type: 'application/xml'
          })
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // 兼容TMD IE
            navigator.msSaveBlob(blob, this.downloadName)
          } else {
            // 其他浏览器
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', row.name)
            document.body.appendChild(link)
            link.click()
            window.URL.revokeObjectURL(link.href)
          }
        })
        .catch(() => {
          this.exportLoading = false
        })
    },
    versionListClck(item) {
      this.$router.push('/processDetails/' + item.id)
    },
    clickImg() {
      this.imgsShow = !this.imgsShow
    },
    // 控流程发布的方式
    getprocessType() {
      requireProcess({
        filters: []
      }).then(res => {
        if (!res) return false
        // bpa发布
        let index1 = res.list.findIndex(
          v =>
            v.name === this.bpapublishi18n ||
            v.name === this.bpapublishi18n + ' '
        )
        // 流程评审
        let index2 = res.list.findIndex(v => v.name === '流程评审')
        // 流程作废
        let index3 = res.list.findIndex(v => v.name === '流程作废')
        // bpm发布
        let index4 = res.list.findIndex(
          v =>
            v.name === this.bpmpublishi18n ||
            v.name === this.bpmpublishi18n + ' '
        )
        if (index1 != -1) {
          this.process_bpa_publish = res.list[index1].choosed
        } else {
          this.process_bpa_publish = 'direct'
        }
        if (index2 != -1) {
          this.process_bpm_publish = res.list[index1].choosed
        } else {
          this.process_bpm_publish = 'direct'
        }
        if (index3 != -1) {
          this.process_review = res.list[index1].choosed
        } else {
          this.process_review = 'direct'
        }
        if (index4 != -1) {
          this.process_invalid = res.list[index1].choosed
        } else {
          this.process_invalid = 'direct'
        }
      })
    },
    // 获取当前登录人的岗位信息
    // getJobsList() {
    //   jobsList(this.userid).then(res => {
    //     if (!res) return false
    //     if (res.data.length > 0) {
    //       res.data.forEach(item => {
    //         this.jobsArray.push(item.pid)
    //       })
    //     }
    //   })
    // },
    getList() {
      let self = this
      self.versionList = []
      self.imgsShow = false
      queryProcessDesignListInfo(self.modelid, {
        fullFilters: [
          {
            filters: [
              {
                key: 'code',
                opt: 'LIKE',
                type: 'S',
                value: self.searchKey,
                logic: 'or'
              },
              {
                key: 'name',
                opt: 'LIKE',
                type: 'S',
                value: self.searchKey,
                logic: 'or'
              }
            ],
            logic: 'and'
          }
        ],
        logic: 'and',
        pageNum: self.processlistpage,
        pageSize: 10,
        sort: 'desc'
      }).then(res => {
        this.processList = []
        this.pages.total = 0
        // if (!res.list.length) {
        //   return this.$message.error('无权限查看')
        // }
        if (res.list.length > 0) {
          this.modules = res.list[0].modules
        }
        if (res.list[0] && res.list[0].processcode) {
          this.processcode = res.list[0].processcode
        } else {
          this.processcode = ''
        }
        // res.list.map((item, index) => {
        //   item.state = "6"
        // })
        this.processList = res.list
        this.processListObj = this.processList[0]
        this.pages.total = res.total

        // this.getWordJpg();
        // if (this.processListObj.version !== "V1.0") {
        //   this.checkHistory(this.processListObj.id);
        // }
      })
      // getProcesslist({
      //   filters: [{ key: "modelid", value: self.modelid }],
      //   orderby: "createon",
      //   pageNum: self.processlistpage,
      //   pageSize: 10,
      //   sort: "desc",
      // }).then((res) => {
      //   this.processList = [];
      //   this.pages.total = 0;
      //   if (!res) return false;
      //   if (res.list.length > 0) {
      //     this.modules = res.list[0].modules;
      //   }
      //   if (res.list[0].processcode) {
      //     this.processcode = res.list[0].processcode;
      //   } else {
      //     this.processcode = "";
      //   }
      //   this.processList = res.list;
      //   this.processListObj = this.processList[0];
      //   this.pages.total = res.total;
      //   this.getWordJpg();
      //   if (this.processListObj.version !== "V1.0") {
      //     this.checkHistory(this.processListObj.id);
      //   }
      // });
    },
    getList1() {
      this.versionList = []
      ;(this.imgsShow = false),
        queryProcessDesignListInfo(this.modelid, {
          fullFilters: [
            {
              filters: [
                {
                  key: 'code',
                  opt: 'LIKE',
                  type: 'S',
                  value: this.searchKey,
                  logic: 'or'
                },
                {
                  key: 'name',
                  opt: 'LIKE',
                  type: 'S',
                  value: this.searchKey,
                  logic: 'or'
                }
              ],
              logic: 'and'
            }
          ],
          logic: 'and',
          pageNum: 1,
          pageSize: 1000000,
          sort: 'desc'
        }).then(res => {
          this.processList = []
          this.pages.total = 0
          if (!res) return false
          if (res.list.length > 0) {
            this.modules = res.list[0].modules
          }
          if (res.list[0].processcode) {
            this.processcode = res.list[0].processcode
          } else {
            this.processcode = ''
          }
          this.processList = res.list
          this.processListObj = this.processList[0]
          this.pages.total = res.total
        })
    },
    getWordJpg() {
      this.jpgSrc = []
      getWordJpg({
        id: this.processListObj.bpmid,
        json: '',
        listid: this.processListObj.id,
        name: '',
        num: '',
        version: this.processListObj.version,
        userid: JSON.parse(localStorage.getItem('portalCurrentUserInfo') || {})
          .name
      }).then(res => {
        if (!res) return false
        if (res.url) {
          this.jpgSrc.push(res.url)
        }
      })
    },
    checkHistory(id) {
      this.pages.pageNum = 1
      let obj = {
        orderby: 'createon',
        sort: 'desc',
        pageNum: this.pages.pageNum,
        pageSize: 999,
        filters: [{ key: 'listid', opt: 'LIKE', type: 'S', value: id }]
      }
      getCommunityhistoryList(obj).then(res => {
        if (!res) return false
        this.versionList = res.list
      })
    },
    openCard(data, type) {
      console.log('打开属性修改', data)
      this.listid = data.id
      this.bpmid = data.bpmid
      this.version = data.version
      this.selectedItem = JSON.parse(JSON.stringify(data))
      this.processState = data.state
      this.currentCardType = type
      if (type === 'view') {
        window.open(
          this.host2 +
            this.html +
            '/leftMenu/BaseNewPage.html?id=' +
            this.bpmid +
            '&listid=' +
            this.listid +
            '&isReadAttr=true'
        )
        return
      }
      if (type === 'add' || type === 'modify') {
        const formData = {
          // id: data.bpmid,
          bpo: data.bpo,
          bponame: data.bponame,
          code: data.code,
          listid: data.id,
          modelid: data.id,
          signer: this.userid,
          signername: this.username,
          version: data.version,
          name: data.name,
          modelInstitution: {}
        }
        console.log('🍓🐶formData', formData)
        processSaveAttr(formData).then(async res => {
          if (!res) return false
          await this.getList()
          const query = {
            theProcessIs: 'true',
            id: res.split(',')[0],
            listid: this.listid,
            name: this.selectedItem.name,
            state: this.selectedItem.state,
            code: this.selectedItem.code,
            modelid: data.modelid
          }
          console.log('🍓🐶query', query)
          const { href } = this.$router.resolve({
            path: '/doorCenter/TheProcessIsv',
            query
          })
          window.open(href, '_blank')
        })
        return
      }
      this.isDialogsVisible = true
    },
    treeNodeClick(data) {
      if (data.isVisible === '0') {
        let ref = this.controlTree ? 'treeFilter' : 'tree'
        this.$refs[ref].setCurrentKey(this.modelid)
      }
    },
    nodeClick(node, data) {
      if (data.isVisible === '0') return
      this.clearIframeInter()
      let self = this
      self.modelid = data.id
      this.showProcessEditor = false
      this.processlistpage = 1
      this.defaultSelected = false
      this.searchKey = ''
      self.getList()
    },
    loadNode(node, resolve) {
      let _this = this
      let id = node.data ? node.data.id : '0'
      getProcessIframeTree(id).then(res => {
        if (!res) return false
        // if (id === '0') {
        //   this.grandParentId.push(res[0].id)
        // } else if (res.length == 1) {
        //   this.grandParentId.push(res[0].id)
        // }

        // 此处看不懂，为啥获取 route query ，该页面又不是被跳转页面,this.$route.query.code总是为undefined
        /** if (this.defaultSelected && !!this.$route.query.code) {
          let arr = []
          let tmp = this.$route.query.code.split('.').map((item, index) => {
            arr.push(item)
            return arr.length === 1 ? item + '.0' : arr.join('.')
          })
          res = res.map((item, index) => {
            if (tmp.includes(item.code)) {
              this.grandParentId.push(item.id)
            }
            console.log(item.name, item)
            if (item.childrenCount == 2) {
              this.grandParentId.push(item.id)
            }
            // if (item.code === this.$route.query.code) {
              _this.$nextTick(() => {
                _this.$refs['tree'].setCurrentKey(item.id)
                _this.modelid = item.id
                _this.version = item.version
                _this.getList()
              })
            // }
            return item
          })
        } **/
        // 重写此处逻辑
        // if (this.defaultSelected && id === '0') {
        //   res.forEach((item, index) => {
        //     _this.$nextTick(() => {
        //       if (_this.$refs['tree']) {
        //         _this.$refs['tree'].setCurrentKey(item.id)
        //         _this.modelid = item.id
        //         _this.version = item.version
        //         _this.getList()
        //       }
        //     })
        //   })
        // }
        if (node.level === 0 || (node.level < 2 && res.length === 1)) {
          this.grandParentId = [res[0].id]
        }
        if (node.level === 1 && res.length > 0) {
          this.$nextTick(() => {
            if (this.$refs.tree) {
              this.$refs.tree.setCurrentKey(res[0].id)
              this.modelid = res[0].id
              this.version = res[0].version
              this.getList()
            }
          })
        }
        resolve(res)
      })
    },
    filterTree() {
      if (!this.keyWords) {
        this.controlTree = false
        return false
      }
      // searchProcessIframeTree({
      //   name: this.keyWords,
      // }).then((res) => {
      //   if (!res) return false;
      //   this.controlTree = true;
      //   this.treelist = res;
      // });
      searchProcessIframeTree1({
        name: this.keyWords,
        moduletype: 'rulemanagement',
        id: this.grandParentId.length > 0 ? this.grandParentId[0] : ''
      }).then(res => {
        this.controlTree = true
        this.treelist = res
      })
      // searchProcessIframeTreeNew(this.keyWords).then(res => {
      //   if (!res) return false
      //   this.controlTree = true
      //   this.treelist = res
      // })
    },
    handleCurrentChange(value) {
      this.processlistpage = value
      this.getList()
    },
    toDrawingCard(query) {
      const { href } = this.$router.resolve({
        path: '/doorCenter/TheProcessIsv',
        query: query
      })
      window.open(href, '_blank')
    },
    // 跳转至绘图
    drawingCard(item, type) {
      if (item.state === '2') {
        processSaveAttr({
          // id: item.bpmid,
          bpo: item.bpo,
          bponame: item.bponame,
          code: item.code,
          listid: item.id,
          modelid: item.id,
          signer: this.userid,
          signername: this.username,
          version: item.version,
          name: item.name,
          modelInstitution: {}
        }).then(res => {
          if (!res) return false
          this.getList()
          this.toDrawingCard({
            theProcessIs: 'true',
            id: res.split(',')[0],
            listid: item.id,
            name: item.name,
            state: item.state,
            code: item.code,
            modelid: this.modelid
          })
        })
      } else {
        this.toDrawingCard({
          theProcessIs: 'true',
          id: item.bpmid,
          listid: item.id,
          name: item.name,
          state: item.state,
          code: item.code,
          modelid: this.modelid
        })
      }
    },
    close(data) {
      console.log(data)
      if (data.type === 'paint') {
        this.getList()
        this.toDrawingCard({
          theProcessIs: 'true',
          id: data.data.split(',')[0],
          listid: data.data.split(',')[1],
          name: this.selectedItem.name,
          state: this.selectedItem.state,
          code: this.selectedItem.code,
          modelid: this.modelid
        })
        // this.showProcessEditor = true;
        // let count = 0;
        // this.lisdata.forEach((item, idx) => {
        //   if (item.id === data.data.split(",")[0]) {
        //     count++;
        //     this.chartmodel = item.id;
        //   }
        // });
        // if (!count) {
        //   this.lisdata.push({
        //     name: this.selectedItem.name,
        //     id: data.data.split(",")[0],
        //     listid: data.data.split(",")[1],
        //     treeId: this.modelid,
        //     state: this.selectedItem.state,
        //     processNum: this.selectedItem.code,
        //   });
        //   this.chartmodel = data.data.split(",")[0];
        // }
        // let username = localStorage.getItem("portalCurrentUserInfo") ? JSON.parse(localStorage.getItem("portalCurrentUserInfo")).cnname : "";
        // this.iframeSrc = `./leftMenu/BaseNewPage.html?id=${data.data.split(",")[0]
        //   }&listid=${data.data.split(",")[1]}&treeId=${this.modelid
        //   }&processName=${this.selectedItem.name
        //   }&username=${username}&processNum=${this.selectedItem.code}&state=${this.selectedItem.state
        //   }&isRead=no`;
      } else {
        // this.processlistpage = 1
        this.getList()
      }
    },
    // l流程图识别跳转
    closeChart(data) {
      this.showProcessEditor = true
      this.lisdata = [
        {
          name: this.selectedItem.name,
          id: this.bpmid,
          listid: this.listid,
          treeId: this.modelid,
          state: this.selectedItem.state,
          processNum: this.selectedItem.code
        }
      ]
      this.iframeSrc = data
    },
    removeTab(data) {
      this.clearIframeInter()
      let index = 0
      this.lisdata.forEach((item, idx) => {
        if (item.id === data) {
          index = idx
          return false
        }
      })
      this.lisdata.splice(index, 1)
      if (this.lisdata.length === 0) {
        this.showProcessEditor = false
      } else {
        let index = this.lisdata.length - 1
        this.chartmodel = this.lisdata[index].id
        let username = localStorage.getItem('portalCurrentUserInfo')
          ? JSON.parse(localStorage.getItem('portalCurrentUserInfo')).cnname
          : ''
        this.iframeSrc = `./leftMenu/BaseNewPage.html?id=${this.lisdata[index].id}&listid=${this.lisdata[index].listid}&treeId=${this.modelid}&processName=${this.lisdata[index].name}&username=${username}&processNum=${this.lisdata[index].code}&state=${this.lisdata[index].state}&isRead=no`
      }
    },
    tabClick() {
      this.clearIframeInter()
      let index = 0
      this.lisdata.forEach((item, idx) => {
        if (item.id === this.chartmodel) {
          index = idx
        }
      })
      let username = localStorage.getItem('portalCurrentUserInfo')
        ? JSON.parse(localStorage.getItem('portalCurrentUserInfo')).cnname
        : ''
      this.iframeSrc = `./leftMenu/BaseNewPage.html?id=${this.lisdata[index].id}&listid=${this.lisdata[index].listid}&treeId=${this.modelid}&processName=${this.lisdata[index].name}&username=${username}&processNum=${this.lisdata[index].code}&state=${this.lisdata[index].state}&isRead=no`
    },
    // 流程文档
    processDoc(data, type) {
      if (type === 'download') {
        getModelapprove('5').then(res => {
          if (!res) return false
          if (res.choosed === 'direct') {
            downloadProcessDoc({
              id: data.bpmid,
              json: '',
              listid: data.id,
              name: '',
              num: '',
              userid: '',
              language: 'zh-CN'
            }).then(res => {
              if (!res) return false
              window.open(res)
            })
          } else {
            getDownloadAuthByModelId(data.modelid, this.userId).then(res => {
              if (res === '0') {
                this.$confirm(
                  '您暂无此流程文档的下载权限，是否确认申请？',
                  '提示',
                  {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }
                )
                  .then(() => {
                    window.open(
                      `${window.location.origin}${window.location.pathname}#/processForm/start?name=%E6%96%87%E6%A1%A3%E6%9D%83%E9%99%90%E5%AE%A1%E6%89%B9&processName=WDQXSP&projectName=WDQXSP&modelid=${data.modelid}&version=${data.version}`
                    )
                  })
                  .catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消'
                    })
                  })
              } else if (res === '1') {
                downloadProcessDoc({
                  id: data.bpmid,
                  json: '',
                  listid: data.id,
                  name: '',
                  num: '',
                  userid: '',
                  language: 'zh-CN'
                }).then(res => {
                  if (!res) return false
                  window.open(res)
                })
              } else {
                this.$message({
                  type: 'warning',
                  message: '当前文档的申请权限正在审批中，暂不可下载！'
                })
              }
            })
          }
        })
      } else if (type === 'view') {
        viewProcessDoc({
          id: data.bpmid,
          json: '',
          listid: data.id,
          name: '',
          num: '',
          userid: '',
          language: 'zh-CN'
        }).then(res => {
          if (!res) return false
          window.open(res)
        })
      }
    },
    // 还原
    toBack(data) {
      this.$confirm(
        this.$t('doYouWantToRestoreProcess'),
        this.$t('hintText.hint'),
        {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }
      ).then(() => {
        restoreProcess(data.id).then(res => {
          if (!res) return false
          this.$message({
            type: 'success',
            message: this.$t('restoreSuccess')
          })
          this.processlistpage = 1
          this.getList()
        })
      })
    },
    // 流程导入
    processIn(row) {
      this.processDialogsVisible = true
      this.processMethod = this.$t('processImport')
      this.processId = row.id
    },
    // 流程导出
    processOut(row) {
      window.open(
        this.host +
          '/modellist/exportProcessJsonToTxt/' +
          row.modelid +
          `?username=${this.userId}`
      )
      // exportProcessJsonToTxt(this.modelid).then(res => {
      //   if (!res) return false
      //   this.$message({
      //     type: 'success',
      //     message: '导出成功!'
      //   })
      // })
    },
    // 流程图导入
    processCardIn(row) {
      this.processDialogsVisible = true
      this.processMethod = this.$t('processImageImport')
      this.processId = row.id
      this.processState = row.state
    },
    // 流程图导出
    processCardOut(row) {
      window.open(
        this.host +
          '/listhistory/exportProcessChartJsonToTxt/' +
          row.modelid +
          `?username=${this.userId}`
      )
      // exportProcessChartJsonToTxt(this.modelid).then(res => {
      //   if (!res) return false
      //   this.$message({
      //     type: 'success',
      //     message: '导出成功!'
      //   })
      // })
    },
    processConfirm(data) {
      this.getList()
    },
    toFlow() {
      getPost(this.$store.state.basuser.user.id).then(rt => {
        if (rt.status === '200') {
          if (rt.data && rt.data.length > 0) {
            if (rt.data.length > 1) {
              this.itemData = rt.data
              this.dialogVisible = true
            } else {
              this.toHref(rt.data[0].id)
            }
          } else {
            this.$message.error(
              this.$t('hintText.postMissingContactAdministrator')
            )
          }
        }
      })
    },
    saveSuccess(data) {
      this.toHref(data[0].id)
    },
    toHref(pid) {
      let routeData = null
      if (this.operationType === 'abolish') {
        routeData = this.$router.resolve({
          name: 'processFormStart',
          query: {
            name: '流程作废审批流程',
            processName: 'LCFZSPLC',
            projectName: 'LCFZSPLC',
            pid: pid,
            listId: this.bpmListId
          }
        })
      } else {
        routeData = this.$router.resolve({
          name: 'processFormStart',
          query: {
            name: '流程审批管理流程',
            processName: 'LCSPGLLC',
            projectName: 'LCSPGLLC',
            pid: pid,
            listId: this.bpmListId
          }
        })
      }

      // window.open(routeData.href, "_blank");
      let a = document.createElement('a')
      // 给创建好的a标签赋值
      a.setAttribute('href', routeData.href)
      // 设置css 隐藏属性
      a.setAttribute('style', 'display:none')
      // 设置 a标签为新窗口打开
      a.setAttribute('target', '_blank')
      // 将设置好的a标签，添加到 body 内
      document.body.appendChild(a)
      // 模拟点击
      a.click()
      // 移除a标签
      a.parentNode.removeChild(a)
    },
    publishVersion(data) {
      window.openBpmUrl(
        data.state,
        data.bpaprocessid,
        data.bpmid,
        'direct',
        data.isnewest === 'Y' ? '' : data.version
      )
    },
    // 流程操作
    operatingprocess(data, type) {
      this.operationType = type
      this.versionId = data.bpmid
      this.versionObj = data
      if (type === 'bpaPublish') {
        getModelapprove('4').then(res => {
          if (!res) return false
          if (res.choosed === 'direct') {
            // if (data.version === 'V0.0') {
            //   this.$confirm(
            //     this.$t('doYouWantToPublishProcess'),
            //     this.$t('hintText.hint'),
            //     {
            //       confirmButtonText: this.$t('confirm'),
            //       cancelButtonText: this.$t('cancel'),
            //       type: 'warning'
            //     }
            //   ).then(() => {
            //     window.openBpmUrl(data.state, data.id, data.bpmid, 'direct')
            //   })
            // } else {
            //   // 显示流程版本弹窗
            //   this.processVersionDialog = true
            // }
            this.$confirm(
              this.$t('doYouWantToPublishProcess'),
              this.$t('hintText.hint'),
              {
                confirmButtonText: this.$t('confirm'),
                cancelButtonText: this.$t('cancel'),
                type: 'warning'
              }
            ).then(() => {
              window.openBpmUrl(data.state, data.id, data.bpmid, 'direct')
            })
          } else {
            this.bpmListId = data.id
            releaseVerification(data.id).then(res => {
              if (res) {
                this.toFlow()
              }
            })
          }
        })
      } else if (type === 'approvalAgain') {
        getModelapprove('4').then(res => {
          if (!res) return false
          if (res.choosed === 'direct') {
            this.$confirm(
              this.$t('areYouSureToResubmitTheProcessForApproval'),
              this.$t('hintText.hint'),
              {
                confirmButtonText: this.$t('confirm'),
                cancelButtonText: this.$t('cancel'),
                type: 'warning'
              }
            ).then(() => {
              window.openBpmUrl(data.state, data.id, data.bpmid, 'direct')
            })
          } else {
            this.bpmListId = data.id
            releaseVerification(data.id).then(res => {
              if (res) {
                this.toFlow()
              }
            })
          }
        })
      } else if (type === 'bpmPublish') {
        // if (data.state === "1") {
        //   this.$message.error(
        //     this.$t("hintText.aPublishedProcessCannotBePublishedAgain")
        //   );
        //   return;
        // }
        this.$confirm(
          this.$t('doYouWantToPublishProcess'),
          this.$t('hintText.hint'),
          {
            confirmButtonText: this.$t('confirm'),
            cancelButtonText: this.$t('cancel'),
            type: 'warning'
          }
        ).then(() => {
          window.openBpmUrl4(data.state, data.id, data.bpmid, 'direct')
        })
      } else if (type === 'abolish') {
        getModelapprove('4').then(res => {
          if (!res) return false
          if (res.choosed === 'direct') {
            this.$confirm(
              this.$t('doYouWantToCancelProcess'),
              this.$t('hintText.hint'),
              {
                confirmButtonText: this.$t('confirm'),
                cancelButtonText: this.$t('cancel'),
                type: 'warning'
              }
            ).then(() => {
              window.openBpmUrl2(data.state, data.id, data.bpmid, 'direct')
            })
          } else {
            this.bpmListId = data.id
            releaseVerification(data.id).then(res => {
              if (res) {
                this.toFlow()
              }
            })
          }
        })
      } else if (type === 'clear') {
        this.$confirm(
          this.$t('doYouWantToClearProcess'),
          this.$t('hintText.hint'),
          {
            confirmButtonText: this.$t('confirm'),
            cancelButtonText: this.$t('cancel'),
            type: 'warning'
          }
        ).then(() => {
          clearprocess(data.id).then(res => {
            if (!res) return false
            this.$message({
              type: 'sucess',
              message: this.$t('processCardClearSuccess')
            })
            if (Number(data.version.slice(1, 2)) != 0) {
              this.getList()
            } else {
              this.$set(data, 'state', 2)
              this.getList()
            }
          })
        })
      } else if (type === 'review') {
        this.$confirm(
          this.$t('doYouWantToReviewProcess'),
          this.$t('hintText.hint'),
          {
            confirmButtonText: this.$t('confirm'),
            cancelButtonText: this.$t('cancel'),
            type: 'warning'
          }
        ).then(() => {
          window.openBpmUrl3(data.state, data.id, data.bpmid, 'direct')
        })
      }
    },
    // 清空iframe内部的定时器
    clearIframeInter() {
      if (cookie.get('storeChangeState')) {
        cookie.remove('storeChangeState')
      }
      if (
        !!document.getElementById('iframeUrlId') &&
        !!document.getElementById('iframeUrlId').contentWindow.iframeInterval
      ) {
        document.getElementById('iframeUrlId').contentWindow.iframeInterval()
      }
    },
    // 智能识图
    chartIdentify(item, i) {
      this.upType = i
      this.listid = item.id
      this.bpmid = item.bpmid
      this.chartDialogsVisible = true
    }
  },
  beforeDestroy() {
    this.clearIframeInter()
  }
}
</script>

<style lang="scss" scoped>
#processDesignCenter {
  background-color: white;
  padding: 10px 25px 10px 10px;
  height: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}
.eldropdown {
  display: inline-block;
  color: #2d42af;
  line-height: 26px;
  width: 60px;
}
#processDesignCenter {
  font-size: 14px;
  .green {
    color: green;
  }
  /deep/
    .el-tree-node.is-current
    > .el-tree-node__content
    .custom-tree-node
    .green {
    color: #2d42af;
  }
  /deep/ .el-tree-node.is-current > .el-tree-node__content .custom-tree-node {
    font-weight: 600;
    color: #2d42af;
  }
  /deep/ .custom-tree-node {
    color: #666;
  }
  flex: 1;
  overflow: hidden;
  .content {
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;
  }
  .leftTree {
    .drag-handle {
      position: absolute;
      top: 0;
      right: -3px;
      width: 6px;
      height: 30px;
      z-index: 999;
      background-color: #ddd;
    }
  }
  .listContent {
    flex: 1;
    overflow-y: auto;
    .el-dropdown-link {
      cursor: pointer;
      color: #2d42af;
    }
  }
  .custom-tree-node {
    // width: calc(100% - 24px);
    display: flex;
    align-items: center;
    box-sizing: border-box;
  }
  .custom-tree-node.disabled,
  .custom-tree-node.disabled * {
    color: #bbb !important;
    font-weight: normal !important;
    cursor: not-allowed !important;
    background-color: transparent !important;
  }
  .right-content {
    // height: calc(100vh - 160px);
    .el-tabs__item {
      padding: 0 10px;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
    }
  }
  .left_tree_wrapper {
    width: 100%;
    height: calc(100% - 40px);
    overflow: auto;
    /deep/ .el-tree-node__content {
      width: 100%;
    }
    /deep/ .el-tree-node > .el-tree-node__children {
      overflow: visible;
    }
  }
  /*附件部分*/
  .showFiles {
    span {
      line-height: 18px;
      padding: 3px 20px 3px 8px;
      border: 1px solid #519eff;
      display: inline-block;
      vertical-align: top;
      max-width: 130px;
      border-radius: 3px;
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &.commonpadding span {
      padding: 3px 8px;
    }
    i {
      position: absolute;
      right: 3px;
      top: 5px;
      color: $ico;
    }
    &.processCommon i {
      top: 6px;
    }
  }

  .minHeight28 {
    min-height: 28px;
  }
  .font16 {
    /deep/ i {
      font-size: 16px;
    }
  }

  /*流程卡片*/
  .processCard {
    .slotTitle {
      position: absolute;
      top: 13px;
      right: 35px;
      z-index: 999;
    }
    .el-dialog__body {
      padding: 0;
    }
    .el-tabs.el-tabs--top {
      box-shadow: none;
      border: 0;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
    .systemCard {
      .el-card__header {
        .el-button {
          padding: 3px 0;
        }
      }
    }
  }
  /deep/ .el-image-viewer__close {
    top: 40px !important;
    right: 10% !important;
    width: 40px;
    height: 40px;
    font-size: 40px;
  }
  /*流程支持文件*/
  .supportDialog {
    .el-dialog__header {
      .el-button {
        padding: 0 8px;
        margin-right: 15px;
      }
    }
  }
  /*流程设计器全屏*/
  .fullEditor {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 99999;
  }
  .iframeProcess {
    /*height: calc(100% - 46px);*/
    height: calc(100vh - 100px);
  }
}
@font-face {
  font-family: 'iconfont';
  src: url('../../../assets/fonts/fontProcess/iconfont.eot?t=1587708556364'); /* IE9 */
  src: url('../../../assets/fonts/fontProcess/iconfont.eot?t=1587708556364#iefix')
      format('embedded-opentype'),
    /* IE6-IE8 */
      url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAVcAAsAAAAACrgAAAUQAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDXgqHdIYoATYCJAMcCxAABCAFhG0HcxsTCVFUT0JkXydwm/NwrUpMTFEhXcyOnGz0JM1RdIetePzYVyLTxN+a0+Cffr927vN1TaJxu4ZiWItUEtNpgdKZ7pHp/3/n8h+BG9k83x7JAZFd6adNKQ0NwekJM2En5E24TeSVwWk9ycmav7jrAkhaJ63DE/EDvwXwWwTg1PQKVLRYLUH/rg9s/AWns/EX/oBriuVtcg0QoLG/AQTq/+e6Oej/HEu9KIy2/Nd2KgeYFXSLpOHeKIEGFFW0N8CBbWIT05nArogt+uKLj0Mgb8xSKjf3z6HJoeMENGehC82ahxshSbKHnktjtGIohS89AOA1/X39gFFNMHwEPek8bASw/BwF/PpXKI5eYduFAO0qsGADcNCyN/IMzisbFXnnbxq4A5QlRnjaHDv9Ln13rv7UJ2m1lFl7bf/yDM8KUIpkKYrYp2rAZxbKIHwWMjh87mUw+JrL4PH1l8Hir7ZyV9Hx6DLoAuVACwG7jRSIOwKXjZcJCGHGQkUodLoEtULF4sPEtA3e48nSNCV8GoDRJAviLEkD3GQuYcGwLZYgTWOUkKA0zdP4DDmFTeZS1JRCC94sbyEIxTxZgTMKQuN1ZAuJaQd4szKEtYlEK3XlConhcss9SgDtLiLbCHkfg7MiUUsfk3NrvBw0U2uioVbCQsvgljrx9jpNolaXoIaFBiIVyVrqtAzRiplr1JT4EZrWmYNm4WageR7ZZg5RrUQ7COMd2YxF7gRCTvbd20jLPPaysplwkzd2AhDW5a5oIj1VLT3Qd+7O58zklIWSsYErLFWsuYK2lm9vZ+/s5Ozt5e3u5i/vujTsZS7tONdufw2y14ktn2WefFt27U+3QKy31ncF48i4QKzzK5WWWB4z7wWwcXRcYHAKCZnVxjLbXt6r7yJksT9r622inVxs+i6O6Me79roYXWxotpc0yMcygp47tQOJJhPIhEmiLFT2HGtH2032n9uW9RtdOap07kzdc0HHgYDqoqAD6RBcdMq6MPW0K4aXLQHbVXjf+n5JcUlJ0oba3jt9+l60O2cN3IU4usxERUfFTqZ3skgaSwI0iUYvUv2iQ0J461Br3pCMvDwaNgK03EQgRB6KLL+VIJIHt7FFpA+kSMQb8YXlZc7GxZrv7uEibx1izdV3uQBEQlzi+JHQ4mjXo6TNI5uKo4mDxSHFgutohVMkPbbAD5rz//8w9AF8ZCHHEeNDZSYrJ6UkKZ2wMlZFE2XTwvH2dq0W2o7TKDyjB9miH0CmYACYM7RIOXQaOjYCyKqwrfrjHsZ/9Mgr2fyahR/zuo9LwwM5lVWFWeDfZwXW/k214CLn6skbY3vm8FAEojcifM0u8rwC/pyJur/tbC24FyRplWBEI7CSCdJhN+AVbCFIdpC3tnV1QYNUoTgHrHwJIFXfYJS9g1X1i3TYMXht/xBUq0DeQzBxy4JZrL0m0dUYEO+OMJ/nNPDrdtZ/iqFJXVnVp+xLlIrlybA3aNa3MEe5xRnqOhxpTQmVPCObwtMwTTkpJI/R171I62K236d9X9TzeQZtJxJyaShAeO4QjI/L0Xhtrd36+VMoZKRccmRaR/4SkhS2c2KoZwAgtyw5NO25jCrXQiNaKlEE1Xq5DLEphVDKFY4o+g+KIZ/WEy0oFWb1peUoaukdb8te521AHr0uBkZWTl5BUYk0Z8aPMA9bKnLjc+7YHdaoZEo3bplba5+5NyzixnBmPNT0mFRjvO4xN48ZAA==')
      format('woff2'),
    url('../../../assets/fonts/fontProcess/iconfont.woff?t=1587708556364')
      format('woff'),
    url('../../../assets/fonts/fontProcess/iconfont.ttf?t=1587708556364')
      format('truetype'),
    /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
      url('../../../assets/fonts/fontProcess/iconfont.svg?t=1587708556364#iconfont')
      format('svg'); /* iOS 4.1- */
}
.iconfont {
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.icon-liucheng:before {
  content: '\e61a';
}
.i-item {
  border-right: 1px solid #606266;
  height: 13px;
  margin: 5px;
}
.btn-item {
  display: inline-block;
}
.no-border {
  border: none;
  border-radius: 0px;
  padding-bottom: 2px;
}
// .no-border:hover {
//   border-bottom: 1px solid !important;
//   color: #2d42af !important;
//   font-weight: bold !important;
//   background-color: transparent !important;
// }
.el-card {
  margin-top: 20px;
}
.tottom-text {
  position: relative;
}
.flow-details {
  padding: 20px;
  .click—top {
    cursor: pointer;
    position: absolute;
    text-align: center;
    left: calc(50% - 17px);
    top: -50px;
    z-index: 999;
    img {
      width: 10px;
      height: 10px;
    }
    span {
      margin-left: 4px;
      font-size: 14px;
      color: #666;
    }
  }
  .card-btn {
    color: #ffffff !important;
    background-color: #2d42af !important;
    border-color: #2d42af !important;
  }
  .property-card {
    margin: 20px 0;
    .up-left,
    .up-right {
      display: flex;
      align-items: center;
    }
    .up-left div:last-child,
    .up-right div:last-child {
      font-size: 14px;
      margin-left: 8px;
    }
    .upimg,
    .upword {
      cursor: pointer;

      width: 80px;
      height: 80px;
      background: #fafafa;
      border: 1px dashed #c9c9c9;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .upimg:first-child,
    .upword:first-child {
      color: #c9c9c9;
      font-size: 34px;
    }
    .upimg-item,
    .upword-item {
      color: #c9c9c9;
      font-size: 14px !important;
    }
    .gap {
      margin-top: 10px;
    }
    .tooltip_item {
      float: right;
      color: #2d42af;
    }
    .flow-property-left {
      height: 100%;
      border-left: 4px solid #2d42af;
      padding-left: 6px;
      font-weight: 700;
      font-size: 15px;
    }
    .flow-property-btn {
      text-align: right;
    }
  }
}
.is-rotates {
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
}
.clearfix {
  span {
    display: inline-block;
    font-weight: 700;
    font-size: 15px;
  }
}
.gaps {
  margin-top: 10px;
  padding: 0px 10px;
  font-size: 14px;
  span {
    display: inline-block;
    color: #666;
  }
}
.title-content {
  text-align: center;
  font-weight: 700;
  color: #000;
  font-family: Arial, 微软雅黑, 'Microsoft Sans Serif';
  font-size: 24px;
}
.title-right {
  text-align: right;
  span {
    color: #2d42af;
  }
}
.shade {
  width: 100%;
  height: 342px;
  position: absolute;
  background: #999;
  opacity: 0.1;
}

.shade-show {
  width: 100%;
  height: 100%;
  position: absolute;
  background: #999;
  opacity: 0.1;
  z-index: 2;
}
/*.shade-show:hover {*/
/*  display: none;*/
/*}*/
.elimgs {
  cursor: pointer !important;
  padding-top: 20px !important;
}
.property-imgs {
  position: relative;
  margin: -20px;
}
.bj_imgS {
  height: 100%;
  text-align: center;
}
.bj_imgH {
  height: 280px;
  text-align: center;
  .remark-text {
    font-size: 14px;
    color: #b3b3b3;
  }
}
.footr {
  text-align: right;
}
.el-link.el-link--primary {
  margin-left: 20px;
  color: #2d42af !important;
  font-size: 14px;
}
/deep/ .el-link--primary:after {
  color: #2d42af !important;
}
.el-button--success.is-plain {
  background: #ffffff;
  border: 1px solid #dcdfe6;
  color: #666666;
}
</style>
