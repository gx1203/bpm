<template>
  <div id="processIframeManage" class="pageWrap" v-loading="pageLoading">
    <div class="pageContent">
      <el-row style="margin-bottom: 14px">
        <div class="header-l">
          <div class="buton">版本信息：</div>
          <div
            v-for="item in frameVersionList"
            :key="item.id"
            class="buton"
            :class="{ 'active-buton': activeId == item.id }"
            plain
            @click="getFrameVersion(item.id)"
          >
            {{ item.pre }}{{ item.version }}
          </div>
        </div>
        <div class="header-r">
          <el-upload
            v-if="
              treeNode.level === 2 &&
                frameVersionList.length > 0 &&
                frameVersionList[0].id === activeId
            "
            class="inline-block margin-l10 margin-r10"
            accept=".xlsx,.xls"
            :action="action"
            :on-success="handlerSuccess"
            :before-upload="beforeAvatarUpload"
            :show-file-list="false"
          >
            <el-button type="primary">导入</el-button>
          </el-upload>
          <el-button
            v-if="treeData.isparent"
            type="primary"
            :loading="exportLoading"
            @click="exportFile"
            >导出{{ exportLoading ? '中' : '' }}
          </el-button>
          <!--          <el-button type="primary" :loading="downloadLoading" @click="downloadFile">-->
          <!--            {{ downloadLoading ? '下载中' : '下载模板' }}-->
          <!--          </el-button>-->
          <el-button type="primary" @click="upgradeVersion">升级版本</el-button>
        </div>
      </el-row>
      <div class="leftTree" ref="leftTree">
        <el-row>
          <bas-search
            :placeholder="placeholderTitle"
            class="remove-margin-b"
            v-model="searchTree"
            @fnSearch="filterTree"
          />
        </el-row>
        <div class="left_tree_wrapper margin-t10">
          <el-tree
            v-show="!controlTree"
            v-if="reload"
            ref="asyncTree"
            draggable
            @node-drag-end="handleDragEnd"
            @node-drag-start="handleDragStart"
            @node-drag-leave="nodeDragLeave"
            @node-expand="nodeExpand"
            :allow-drag="allowDrag"
            :allow-drop="allowDrop"
            class="filter-tree elTree"
            :props="props"
            :load="loadNode"
            node-key="id"
            lazy
            :default-expanded-keys="grandParentId"
            :expand-on-click-node="false"
            :highlight-current="true"
            @node-click="handlerNodeClick"
          >
            <div
              :class="data.isVisible === '0' ? 'disabled' : ''"
              slot-scope="{ node, data }"
              class="custom-tree-node"
            >
              <span :class="data.pid ? 'process_02' : 'process_01'" />
              <!-- <p class="grow" :title="node.label">{{ node.label }}</p> -->
              <p
                :class="{
                  green: data.release === 'Y',
                  red: data.spstate === '1'
                }"
                :title="node.label"
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
              <p v-if="activeId === '0'" class="font14 opertionBtn">
                <i
                  v-if="data.adder == '1' && node.level < 7"
                  class="el-icon-circle-plus-outline add"
                  @click="handlerTreeOperate('add', data, node)"
                />
                <i
                  v-if="
                    data.id != '79957553BD2F3978E053BF1A13ACD486' &&
                      data.updater == '1'
                  "
                  class="el-icon-edit add"
                  @click="handlerTreeOperate('edit', data, node)"
                />
                <i
                  v-if="
                    data.id != '79957553BD2F3978E053BF1A13ACD486' &&
                      data.deleter == '1'
                  "
                  class="el-icon-delete add"
                  @click="handlerTreeOperate('del', data, node)"
                />
              </p>
            </div>
          </el-tree>
          <el-tree
            ref="treeFilter"
            v-show="controlTree"
            class="filter-tree"
            :props="props"
            :default-expand-all="true"
            :expand-on-click-node="false"
            :data="treelist"
            node-key="id"
            @node-click="handlerNodeClick"
          >
            <div
              :class="data.isVisible === '0' ? 'disabled' : ''"
              slot-scope="{ node, data }"
              class="custom-tree-node"
            >
              <span :class="data.pid ? 'process_02' : 'process_01'" />
              <!-- <p class="grow" :title="node.label">{{ node.label }}</p> -->
              <p
                :class="{
                  green: data.release === 'Y',
                  red: data.spstate === '1'
                }"
                :title="node.label"
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
              <p v-if="activeId === '0'" class="font14 opertionBtn">
                <i
                  v-if="data.adder == '1' && node.level < 7"
                  class="el-icon-circle-plus-outline add"
                  @click="handlerTreeOperate('add', data, node)"
                />
                <i
                  v-if="
                    data.id != '79957553BD2F3978E053BF1A13ACD486' &&
                      data.updater == '1'
                  "
                  class="el-icon-edit add"
                  @click="handlerTreeOperate('edit', data, node)"
                />
                <i
                  v-if="
                    data.id != '79957553BD2F3978E053BF1A13ACD486' &&
                      data.deleter == '1'
                  "
                  class="el-icon-delete add"
                  @click="handlerTreeOperate('del', data, node)"
                />
              </p>
            </div>
          </el-tree>
        </div>
      </div>
      <div class="listContent">
        <div class="right-content">
          <!-- 表格 -->
          <bas-table
            row-key="id"
            :tableList="processList"
            :headerList="headerList"
            :pages="pages"
            :isShowIndex="true"
            @currentChange="handleCurrentChange"
          >
            <!-- 搜索和操作按钮区域 -->
            <template #search>
              <div>
                <el-row class="margin-b10">
                  <el-col :span="12">
                    <bas-search
                      :placeholder="placeholderTitle2"
                      v-model="keyWords"
                      @fnSearch="search('')"
                    />
                    <!--<el-button class="high_search" type="primary" @click="isHighSearch=!isHighSearch">-->
                    <!--高级-->
                    <!--<i :class="isHighSearch?'el-icon-caret-top' : 'el-icon-caret-bottom'" />-->
                    <!--</el-button>-->
                    <!--<el-button class="float-r" type="primary" @click="frameWorkClick">-->
                    <!--框架列数配置-->
                    <!--</el-button>-->
                    <!--<el-button class="float-r" type="primary" @click="isHighSearch=!isHighSearch">-->
                    <!--{{$t("advancedQuery")}}-->
                    <!--</el-button>-->
                  </el-col>
                  <el-col :span="12" class="search_buttons_wrap">
                    <el-button
                      type="primary"
                      @click="isHighSearch = !isHighSearch"
                      >{{ $t('advancedQuery') }}
                      <i
                        :class="
                          isHighSearch
                            ? 'el-icon-caret-top'
                            : 'el-icon-caret-bottom'
                        "
                      ></i>
                    </el-button>

                    <el-button
                      type="primary"
                      @click="frameWorkClick"
                      v-if="activeId === '0' && treeNode.level === 2"
                    >
                      {{ $t('frameColumnNumberConfiguration') }}
                    </el-button>
                  </el-col>
                </el-row>
                <el-collapse-transition>
                  <!-- 高级搜索表格 -->
                  <el-form
                    v-show="isHighSearch"
                    class="search_options_wrap"
                    :model="searchForm"
                    label-width="100px"
                  >
                    <el-row>
                      <el-col :span="8">
                        <el-form-item :label="processFrameworkName">
                          <el-input v-model="searchForm.classify" clearable />
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item :label="workNumber">
                          <el-input v-model="searchForm.operator" clearable />
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item :label="operatorName">
                          <el-input
                            v-model="searchForm.operatorname"
                            clearable
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="8">
                        <el-form-item :label="operationTime">
                          <el-date-picker
                            v-model="searchForm.operatetime"
                            value-format="yyyy-MM-dd"
                            type="date"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item :label="operationType">
                          <el-select v-model="searchForm.status" clearable>
                            <el-option
                              v-for="item in searchoptions"
                              :key="item.label"
                              :label="item.label"
                              :value="item.value"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <div class="search_buttons_wrap">
                      <el-button type="primary" @click="search('high')"
                        >{{ $t('search') }}
                      </el-button>
                      <el-button type="primary" @click="reset()"
                        >{{ $t('reset') }}
                      </el-button>
                    </div>
                  </el-form>
                </el-collapse-transition>
              </div>
            </template>
            <!-- 操作类型 -->
            <template #status="{ row}">{{ row.status | filterType }} </template>
          </bas-table>
        </div>
      </div>
    </div>
    <select-group
      v-model="isGroupVisible"
      :select-tree="['3']"
      :show-tree="'1,2,3,4'"
      :selected="selectedIDIframe"
      @confirm="handlerGroupSelect"
    />
    <el-dialog
      v-if="isDialogsVisible"
      :title="editFormtitle"
      :visible.sync="isDialogsVisible"
      width="40%"
    >
      <el-form
        ref="editRef"
        label-width="120px"
        label-position="right"
        :model="editForm"
        :rules="rules"
      >
        <el-form-item :label="superiorProcessName">
          <el-input v-model="editForm.name" disabled />
        </el-form-item>
        <el-form-item :label="architectureCoding" v-if="showCode">
          <el-input v-model="editForm.code" disabled />
        </el-form-item>
        <el-form-item :label="processFrameworkName" prop="iframeName">
          <el-input v-model="editForm.iframeName" clearable />
        </el-form-item>
        <!-- <el-form-item :label="englishNameOfProcess" prop="enName">
          <el-input v-model="editForm.enName" clearable />
        </el-form-item> -->
        <!-- <el-form-item :label="systemName" prop="rulename">
          <el-input v-model="editForm.rulename" clearable/>
        </el-form-item>
        <el-form-item :label="systemCode" prop="rulecode">
          <el-input v-model="editForm.rulecode" clearable/>
        </el-form-item> -->
        <!-- <el-form-item :label="systemWriter">
          <el-input
            v-model="editForm.ruleperson"
            clearable
            :placeholder="placeholderTitle3"
            :title="editForm.person"
            @focus="showChoose('rule')"
          />
        </el-form-item> -->
        <el-form-item :label="processManager">
          <el-input
            v-model="editForm.person"
            :placeholder="placeholderTitle3"
            :title="editForm.person"
            @focus="showChoose('person')"
          />
        </el-form-item>
        <!-- <el-form-item :label="consultant">
          <el-input
            v-model="editForm.consultmanager"
            :placeholder="placeholderTitle3"
            :title="editForm.consultmanager"
            @focus="showChoose('consultmanager')"
          />
        </el-form-item>
        <el-form-item :label="processCoding">
          <el-input v-model="editForm.processcode" clearable />
        </el-form-item> -->
        <el-form-item
          v-if="processLevelShow"
          :label="processLevel"
          prop="typeid"
        >
          <el-select
            v-model="editForm.typeid"
            clearable
            :placeholder="pleaseSelect"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('frameworkAuthority')">
          <el-button type="primary" @click="clickpermissionSetting">{{
            $t('setting')
          }}</el-button>
        </el-form-item>
        <!-- <el-form-item
          :label="$t('type')"
          v-if="this.playBoxType == 'add' ? datarank < 4 : datarank < 5"
          prop="systematic"
        >
          <el-select
            v-model="editForm.systematic"
            clearable
            :placeholder="pleaseSelect"
          >
            <el-option
              v-for="item in typeList"
              :key="item.pname"
              :label="item.name"
              :value="item.pname"
            />
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item
          v-if="editForm.systematic == 'function' && !showWayif == 0"
          :label="$t('showWay')"
          prop="displaymode"
        >
          <el-select
            v-model="editForm.displaymode"
            clearable
            :placeholder="pleaseSelect"
            :style="showWayif == 2 ? 'width:75%;margin-right:5px;' : ''"
          >
            <el-option
              v-if="showWayif == 1"
              v-for="item in showWaylist"
              :key="item.pname"
              :label="item.name"
              :value="item.pname"
            />
            <el-option
              v-if="showWayif == 2"
              v-for="item in showWaylist1"
              :key="item.pname"
              :label="item.name"
              :value="item.pname"
            />
          </el-select>
          <el-checkbox v-if="showWayif == 2" v-model="checked"
            >级联下级</el-checkbox
          >
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancalConfirm()">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="handlerConfirm">{{
          $t('confirm')
        }}</el-button>
      </span>
    </el-dialog>

    <!-- 框架列数配置 -->
    <el-dialog
      :title="frameColumnNumberConfiguration"
      :visible.sync="isListVisible"
      width="40%"
    >
      <el-form label-width="120px" label-position="right" :model="frameForm">
        <el-form-item :label="strategic">
          <el-select
            v-model="frameForm.strategy"
            clearable
            disabled
            :placeholder="pleaseSelect"
          >
            <el-option label="1" value="1" />
            <el-option label="4" value="4" />
            <el-option label="5" value="5" />
            <el-option label="6" value="6" />
          </el-select>
        </el-form-item>
        <el-form-item :label="mainOperating">
          <el-select
            v-model="frameForm.main"
            clearable
            :placeholder="pleaseSelect"
          >
            <el-option label="4" value="4" />
            <el-option label="5" value="5" />
            <el-option label="6" value="6" />
          </el-select>
        </el-form-item>
        <el-form-item :label="support">
          <el-select
            v-model="frameForm.support"
            clearable
            :placeholder="pleaseSelect"
          >
            <el-option label="4" value="4" />
            <el-option label="5" value="5" />
            <el-option label="6" value="6" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isListVisible = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="saveFrame">{{
          $t('confirm')
        }}</el-button>
      </span>
    </el-dialog>
    <permission-setting
      v-model="permissionSettingVisible"
      :permissionList="permissionList"
      :treeData="treeData"
      @confirm="handlePermission"
    />
  </div>
</template>
<script>
// import Dialogs from './Dialogs.vue'
import {
  getProcessTreeNodeCode,
  getProcessTreesave,
  getProcessTreesaveT,
  getProcessTreeupdate,
  getProcessTreeupdateT,
  getProcessTreedelete,
  getProcessTreeofprincipal,
  getProcessLevel,
  dictionaryQuery,
  getWhetherDelete
} from '@/bpa/api/componentsApi'
import {
  queryOperateLog,
  queryFrameVersionList,
  getProcessIframeTree,
  upgradeVersion,
  searchProcessIframeTree,
  exportFrameVersion,
  uploadFrameVersion,
  cascadeSaveDisplaymode,
  frameMove
} from '@/bpa/api/settings/processIframeManage'
import {
  getNodePermissions,
  saveProcessFrameworkAuth
} from '@/bpa/api/settings/processFrameworkAuthority'
import { getCardlist } from '@/bpa/api/settings/processCard'

import { getFormateDate } from '@/bpa/utils/common'

import paginations from '@/bpa/mixins/pagination_mixin.js'

// 控制流程审批的方式
import { requireProcess } from '@/bpa/api/settings/processApprovalManage'

import { getNum, saveNum } from '@/bpa/api/common'

import permissionSetting from './permissionSetting'

import axios from 'axios'

export default {
  components: {
    // Dialogs
    permissionSetting
  },
  mixins: [paginations],
  data() {
    return {
      headerList: [
        {
          label: this.$t('operationTime'), // 操作时间
          prop: 'operatetime'
        },
        {
          label: this.$t('operationType'), // 操作类型
          prop: 'status',
          slotName: 'status'
        },
        {
          label: this.$t('processFrameworkName'), // 流程框架名称
          prop: 'classify'
        },
        {
          label: this.$t('workNumber'), // 工号
          prop: 'operator'
        },
        {
          label: this.$t('operatorName'), // 操作人姓名
          prop: 'operatorname'
        }
      ],
      reload: true,
      checked: false,
      showCode: true,
      datarank: '',
      playBoxType: '',
      showWayif: 0,
      showWaylist: [],
      showWaylist1: [],
      typeList: [],
      treeData: {},
      treeNode: {},
      activeId: '',
      showType: '',
      // 暂存将要添加的组织树
      treeTempId: '',
      controlTree: false,
      processList: [],
      keyWords: '',
      searchTree: '',
      treelist: [],
      grandParentId: [],
      isHighSearch: false,
      isDialogsVisible: false,
      isGroupVisible: false,
      searchForm: {},
      editForm: {
        name: '',
        code: '',
        iframeName: '',
        enName: '',
        processcode: '',
        person: '',
        consultmanager: '',
        consultmanagerList: [],
        selectperson: [],
        rank: '',
        // 流程层级的开关字段
        switch: false,
        typeid: '',
        // 流程选项
        processoptions: '',
        rulename: '',
        rulecode: '',
        ruleperson: '',
        systematic: 'function',
        displaymode: ''
      },
      // 流程层级的选项options
      options: '',
      // 流程选项的options2
      options2: [
        {
          id: 1,
          name: '业务流程'
        },
        {
          id: 2,
          name: '管理流程'
        }
      ],
      editFormtitle: '',
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
      rules: {
        iframeName: [{ required: true, message: ' ', trigger: 'blur' }],
        typeid: [{ required: true, message: ' ', trigger: 'blur' }],
        enName: [{ required: false, message: ' ', trigger: 'blur' }],
        // systematic: [{ required: true, message: " ", trigger: "blur" }],
        displaymode: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      // searchoptions: [
      //   {
      //     label: '新建审批中',
      //     value: '1'
      //   },
      //   {
      //     label: '新建审批通过',
      //     value: '2'
      //   },
      //   {
      //     label: '新建审批失败',
      //     value: '3'
      //   },
      //   {
      //     label: '修改审批中',
      //     value: '4'
      //   },
      //   {
      //     label: '修改审批通过',
      //     value: '5'
      //   },
      //   {
      //     label: '修改审批失败',
      //     value: '6'
      //   },
      //   {
      //     label: '作废审批中',
      //     value: '7'
      //   },
      //   {
      //     label: '作废审批通过',
      //     value: '8'
      //   },
      //   {
      //     label: '作废审批失败',
      //     value: '9'
      //   }
      // ],
      searchoptions: [
        {
          label: this.$t('all'),
          value: ''
        },
        {
          label: '新增',
          value: '2'
        },
        {
          label: '修改',
          value: '5'
        }
      ],
      updatenewForm: {
        code: '',
        custom: '',
        ename: '',
        processcode: '',
        ico: '',
        managerList: [],
        consultmanagerList: [],
        name: '',
        parentname: '',
        pid: '',
        remark: '',
        sort: '',
        status: '',
        vtmpmanager: '',
        rank: '',
        updatenewForm: ''
      },
      updateForm: {
        ename: '',
        processcode: '',
        id: '',
        name: '',
        managerList: [],
        rank: ''
      },
      selectedID: [],
      selectedID2: [],
      selectedID3: [],
      selectedIDIframe: [],
      isFirst: true,
      node: '',
      resolve: '',
      filters: [
        { key: 'status', opt: 'LIKE', type: 'S', value: this.keyWords },
        { key: 'operator', opt: 'LIKE', type: 'S', value: this.keyWords },
        { key: 'classify', opt: 'LIKE', type: 'S', value: this.keyWords },
        { key: 'operatetime', opt: 'BETWEEN', type: 'D', value: this.keyWords },
        { key: 'operatorname', opt: 'LIKE', type: 'S', value: this.keyWords }
      ],
      logic: 'or',
      processType: '',
      // 框架列数配置
      isListVisible: false,
      frameVersionList: [],
      frameForm: {
        main: '',
        strategy: '',
        support: ''
      },
      placeholderTitle: this.$t(
        'placeholderText.pleaseEnterEnterpriseProcessArchitecture'
      ),
      placeholderTitle2: this.$t(
        'placeholderText.enterSettingsProcessIframeMassage'
      ),
      placeholderTitle3: this.$t('chooseAPosition'),
      processFrameworkName: this.$t('processFrameworkName'),
      name: this.$t('name'),
      workNumber: this.$t('workNumber'),
      operationType: this.$t('operationType'),
      operationTime: this.$t('operationTime'),
      startDate: this.$t('placeholderText.startDate'),
      endDate: this.$t('placeholderText.endDate'),
      number: this.$t('number'),
      operatorName: this.$t('operatorName'),
      superiorProcessName: this.$t('superiorProcessName'),
      architectureCoding: this.$t('architectureCoding'),
      englishNameOfProcess: this.$t('englishNameOfProcess'),
      systemName: this.$t('systemName'),
      systemCode: this.$t('systemCode'),
      systemWriter: this.$t('systemWriter'),
      processManager: this.$t('processManager'),
      consultant: this.$t('consultant'),
      processCoding: this.$t('processCoding'),
      processLevel: this.$t('processLevel'),
      pleaseSelect: this.$t('pleaseSelect'),
      frameColumnNumberConfiguration: this.$t('frameColumnNumberConfiguration'),
      strategic: this.$t('strategic'),
      mainOperating: this.$t('mainOperating'),
      support: this.$t('support'),
      addTheEnterpriseProcessFramework: this.$t(
        'addTheEnterpriseProcessFramework'
      ),
      editTheEnterpriseProcessFramework: this.$t(
        'editTheEnterpriseProcessFramework'
      ),
      frameColumnNumberConfigurationChangeSuccessful: this.$t(
        'hintText.frameColumnNumberConfigurationChangeSuccessful'
      ),
      areYouSureDelete: this.$t('hintText.areYouSureDelete'),
      hint: this.$t('hintText.hint'),
      successfullyDelete: this.$t('hintText.successfullyDelete'),
      addedSuccess: this.$t('hintText.addedSuccess'),
      confirm: this.$t('confirm'),
      cancel: this.$t('cancel'),
      processLevelShow: false,
      exportLoading: false,
      downloadLoading: false,
      action: '',
      leaveNode: '',
      permissionSettingVisible: false,
      permissionList: [],
      permissionInitList: [], // 最开始数据，用于判断是否是删除，是否新增
      pageLoading: false,
      treeId: ''
    }
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    // action() {
    //   return `${this.host}/frameVersion/upload?username=${this.userid}`;
    // },
    userid() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .empuid
    }
  },
  watch: {
    // "editForm.code": {
    //   handler(val) {
    //     if (val) {
    //       this.processLevelShow = true;
    //       // if (val.endsWith(".0") && val.split(".").length > 2) {
    //       //    console.log(val.endsWith(".0"));
    //       //    console.log(val.split(".").length );
    //       //   this.processLevelShow = true;
    //       // } else {
    //       //   this.processLevelShow = false;
    //       // }
    //     } else {
    //       this.processLevelShow = false;
    //     }
    //   },
    //   immediate: true,
    // }
  },
  mounted() {
    this.queryFrameVersionList()
    // 审批方式
    this.getprocessType()
    this.dictionaryQuery()
  },
  methods: {
    clickpermissionSetting() {
      this.permissionSettingVisible = true
    },
    handlePermission(list) {
      this.permissionList = list
    },
    // 获取table数据
    async getTableList() {
      let queryData = {
        filters: [
          { key: 'modelid', opt: 'EQ', type: 'S', value: this.treeData.id }
        ],
        pageNum: 1,
        pageSize: 10000
      }
      const res = await getNodePermissions(queryData)
      if (!res) {
        return this.$message.error('获取列表数据失败')
      }
      this.permissionList = res.list
      this.permissionInitList = JSON.parse(JSON.stringify(this.permissionList))
    },
    //清空咨询人输入框
    resetConsultant() {
      this.editForm.person = ''
      this.selectedIDIframe = []
      this.editForm.rulemanagerList = []
    },
    //清空流程管理员输入框
    resetProcessManager() {
      this.editForm.consultmanager = ''
      this.selectedIDIframe = []
      this.editForm.rulemanagerList = []
    },
    nodeExpand(data, node, el) {
      console.log(data, 'data')
      console.log(node, 'node')
      console.log(el, 'el')
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.level == 1 || (dropNode.level == 2 && type !== 'inner')) {
        return false
      } else {
        return true
      }
      // if (draggingNode.level == 2) {
      //   return type == "inner";
      // } else {
      //   return true;
      // }
    },
    allowDrag(draggingNode) {
      if (draggingNode.level > 2) {
        return true
      } else {
        return false
      }
    },
    nodeDragLeave(draggingNode, leaveNode, ev) {
      // this.leaveNode = leaveNode
      // console.log(leaveNode,'leaveNode')
      // console.log(ev,'ev')
    },
    handleDragStart(Node, ev) {
      this.leaveNode = Node.data.pid
    },
    refNode(item) {
      let node = this.$refs.asyncTree.getNode(item) // 通过节点id找到对应树节点对象
      node.loaded = false
      node.expand() // 主动调用展开节点方法，重新{{ $t('query') }}该节点下的所有子节点
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      let obj = {
        treeId: draggingNode.data.id, //当前的拖拽的id
        toId: dropNode.data.id, //目标的id
        opt: dropType
      }
      if (dropType !== 'inner' && dropNode.level < 2) {
        return false
      }
      if (dropType == 'none') {
        return false
      }
      // 确定拖动
      this.$confirm(
        `将移动${draggingNode.label}到${dropNode.label}${
          dropType == 'inner'
            ? '的子级'
            : dropType == 'before'
            ? '的上方'
            : '的下方'
        }`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          frameMove(obj)
            .then(res => {
              if (res == '框架名称重复!') {
                this.reload = false
                this.reload = true
              }
              if (res) {
                this.$message({
                  message: '框架拖动完成，已重新编码！',
                  type: 'success'
                })
                setTimeout(() => {
                  // 这是修改之前的父数据
                  let pnode = this.$refs.asyncTree.getNode(this.leaveNode)
                  let parr = pnode.childNodes
                  console.log(pnode, 'pnode')
                  console.log(dropNode, 'dropNode')
                  // getProcessIframeTree(this.leaveNode, this.activeId).then(res => {
                  //   parr.forEach((item, index) => {
                  //     item.data = res[index];
                  //   });
                  this.$set(dropNode, 'expanded', false)
                  this.$set(draggingNode, 'expanded', false)
                  this.refNode(dropNode.parent.data.id)
                  this.refNode(pnode)
                  // });
                }, 500)
              }
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          let pnode = this.$refs.asyncTree.getNode(this.leaveNode)
          this.refNode(pnode)
          this.refNode(dropNode.parent.data.id)
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    associateSubordinates() {
      cascadeSaveDisplaymode({
        displaymode: this.editForm.displaymode,
        pid: this.treeData.id,
        systematic: this.editForm.systematic
      }).then(rt => {
        if (rt.code === 200) {
          // this.$message.success(this.$t("hintText.operateSuccessfully"))
        }
      })
    },
    dictionaryQuery() {
      let obj = {
        attr: {},
        filters: [
          { key: 'name', opt: 'LIKE', type: 'S', value: '' },
          { key: 'state', opt: 'LIKE', type: 'S', value: '' },
          { key: 'sheetname', opt: 'LIKE', type: 'S', value: null },
          { key: 'sheetid', opt: 'EQ', type: 'S', value: '698742894307332096' },
          { key: 'type', opt: 'LIKE', type: 'S', value: '0' }
        ],
        logic: 'and',
        orderby: 'createon',
        pageNum: 1,
        pageSize: 10,
        sort: 'desc'
      }
      this.showWaylist = []
      this.showWaylist1 = []
      dictionaryQuery(obj).then(res => {
        // this.showWaylist = res.list;
        res.list.forEach(item => {
          if (item.enname == 'roomDetails') {
            this.showWaylist.push(item)
          } else if (item.enname == 'roomStyle') {
            this.showWaylist.push(item)
          } else if (item.enname == 'custom') {
            this.showWaylist1.push(item)
          } else if (item.enname == 'treeShape') {
            this.showWaylist1.push(item)
          }
        })
      })
    },
    getCardlist() {
      let obg = {
        attr: {},
        filters: [
          { key: 'name', opt: 'LIKE', type: 'S', value: '' },
          { key: 'state', opt: 'LIKE', type: 'S', value: '' },
          { key: 'sheetname', opt: 'LIKE', type: 'S', value: null },
          { key: 'sheetid', opt: 'EQ', type: 'S', value: '694060745117421568' },
          { key: 'type', opt: 'LIKE', type: 'S', value: '0' }
        ],
        logic: 'and',
        orderby: 'createon',
        pageNum: 1,
        pageSize: 100,
        sort: 'desc'
      }
      getCardlist(obg).then(res => {
        this.typeList = res.list
      })
    },
    exportFile() {
      this.exportLoading = true
      const activeId = this.activeId !== '' ? this.activeId : '0'
      axios({
        method: 'post',
        url: `${this.host}/frameVersion/export`,
        data: {
          frameVersionId: activeId,
          treeId: this.treeData.id
        },
        responseType: 'blob',
        timeout: 60000000
      })
        .then(res => {
          this.exportLoading = false
          const blob = new Blob([res.data], {
            type: 'application/vnd.ms-excel'
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
            link.setAttribute('download', '流程框架.xls')
            document.body.appendChild(link)
            link.click()
            window.URL.revokeObjectURL(link.href)
          }
        })
        .catch(() => {
          this.exportLoading = false
        })
    },
    beforeAvatarUpload(file) {
      const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (extension !== 'xlsx' && extension !== 'xls') {
        this.$message({
          type: 'warning',
          message: '请上传.xlsx/.xls 文件'
        })
        return false
      }
    },
    handlerSuccess(res) {
      if (res.code === 200 && res.data) {
        if (!res.data.doesNotRepeat && res.data.repeatNode) {
          this.$confirm(
            `${res.data.repeatNode} 等框架名称已存在,可能会出现重名，${this.$t(
              'hintText.doYouWantToContinueImporting'
            )}`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
            .then(() => {
              this.uploadFrameVersion(res.data)
            })
            .catch(() => {})
        } else {
          this.uploadFrameVersion(res.data)
        }
      } else {
        this.$message({
          type: 'warning',
          message: this.$t('hintText.attachmentUploadedfailed')
        })
      }
    },
    uploadFrameVersion(data) {
      uploadFrameVersion(data).then(res => {
        if (res) {
          this.$message({
            type: 'success',
            message: this.$t('hintText.importSuccessful')
          })
          this.activeId = ''
          this.isFirst = true
          this.node.childNodes = []
          this.queryFrameVersionList()
          this.loadNode(this.node, this.resolve)
        }
      })
    },
    downloadFile() {
      this.downloadLoading = true
      axios({
        method: 'get',
        url: `${this.host}/frameVersion/download`,
        responseType: 'blob',
        timeout: 60000000
      })
        .then(res => {
          this.downloadLoading = false
          const blob = new Blob([res.data], {
            type: 'application/vnd.ms-excel'
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
            link.setAttribute('download', '流程框架模板.xls')
            document.body.appendChild(link)
            link.click()
            window.URL.revokeObjectURL(link.href)
          }
        })
        .catch(() => {
          this.downloadLoading = false
        })
    },
    showChoose(type) {
      this.showType = type
      this.selectedIDIframe = []
      // 制度编写人
      if (type === 'rule') {
        // if (this.editFormtitle === this.editTheEnterpriseProcessFramework) {
        const list2 = this.editForm.rulemanagerList || []
        // const temp2 = [];
        this.selectedID2 = []
        for (let i = 0; i < list2.length; i++) {
          // temp2.push(list2[i].value);
          this.selectedID2.push({
            id: parseInt(list2[i].empuid),
            name: list2[i].value,
            person: {
              cnname: list2[i].cnname,
              empid: list2[i].userid
            }
          })
        }
        this.selectedIDIframe = JSON.parse(JSON.stringify(this.selectedID2))
        // }
        this.isGroupVisible = true
      }
      //流程责任人
      if (type === 'person') {
        let list = []
        if (this.editFormtitle === this.addTheEnterpriseProcessFramework) {
          list = this.updatenewForm.managerList
        } else if (
          this.editFormtitle === this.editTheEnterpriseProcessFramework
        ) {
          list = this.updateForm.managerList
        }
        this.selectedID = []
        for (let i = 0; i < list.length; i++) {
          this.selectedID.push({
            id: parseInt(list[i].empuid),
            name: list[i].value,
            person: {
              cnname: list[i].cnname,
              empid: list[i].userid
            }
          })
        }
        this.selectedIDIframe = JSON.parse(JSON.stringify(this.selectedID))
        this.isGroupVisible = true
      }
      //咨询人
      if (type === 'consultmanager') {
        // if (this.editFormtitle === this.editTheEnterpriseProcessFramework) {
        let list3 = this.editForm.consultmanagerList || []
        this.selectedID3 = []
        for (let i = 0; i < list3.length; i++) {
          this.selectedID3.push({
            id: parseInt(list3[i].empuid),
            name: list3[i].value,
            person: {
              cnname: list3[i].cnname,
              empid: list3[i].userid
            }
          })
        }
        this.selectedIDIframe = JSON.parse(JSON.stringify(this.selectedID3))
        // }
        this.isGroupVisible = true
      }
    },
    // 框架列数配置
    frameWorkClick() {
      getNum({}).then(res => {
        if (!res) return false
        this.isListVisible = true
        res.list.forEach(item => {
          if (item.id == 'support') {
            this.frameForm.support = item.name
          }
          if (item.id == 'main') {
            this.frameForm.main = item.name
          }
          if (item.id == 'strategy') {
            this.frameForm.strategy = item.name
          }
        })
      })
    },
    saveFrame() {
      Promise.all([
        saveNum({ id: 'main', name: this.frameForm.main, checked: null }),
        saveNum({ id: 'support', name: this.frameForm.support, checked: null })
      ]).then(res => {
        if (!res[0] && !res[1]) return false
        this.$message({
          type: 'success',
          message: this.frameColumnNumberConfigurationChangeSuccessful
        })
        this.isListVisible = false
      })
    },
    // 控制流程审批的方式
    getprocessType() {
      requireProcess({
        filters: [{ key: 'name', opt: 'LIKE', type: 'S', value: '框架审批' }]
      }).then(res => {
        if (!res) return false
        this.processType = res.list[0].choosed
      })
    },
    getList() {
      queryOperateLog({
        attr: {},
        frameVersionId: this.activeId,
        orderby: 'createon',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: 'desc',
        fullFilters: [
          {
            filters: [
              {
                key: 'operatecontent',
                opt: 'EQ',
                type: 'S',
                value: this.treeId
              }
            ],
            logic: 'and'
          },
          {
            filters: this.filters,
            logic: 'and'
          }
        ],
        logic: 'and'
      }).then(res => {
        const processList = res.list
        processList.map(item => {
          item.operatetime = getFormateDate(
            item.operatetime,
            'yyyy-MM-dd hh:mm:ss'
          )
        })
        this.processList = processList
        this.pages.total = res.total
      })
    },
    // 获取历史版本
    queryFrameVersionList() {
      queryFrameVersionList().then(res => {
        if (this.activeId === '' && res.length > 0) {
          this.activeId = res[0].id
        }
        this.frameVersionList = res
        // this.getList()
      })
    },
    // 升级版本
    upgradeVersion() {
      this.$confirm('您确定要升级吗', this.hint, {
        confirmBtnText: this.confirm,
        cancelBtnText: this.cancel,
        type: 'warning'
      }).then(() => {
        upgradeVersion().then(res => {
          this.$message({
            type: 'success',
            message: '升级成功！'
          })
          this.queryFrameVersionList()
        })
      })
    },
    getFrameVersion(id) {
      this.activeId = id
      this.isFirst = true
      this.node.childNodes = []
      this.loadNode(this.node, this.resolve)
    },
    // 搜索的点击事件
    search(type) {
      if (type === 'high') {
        this.filters = [
          {
            key: 'status',
            opt: 'LIKE',
            type: 'S',
            logic: 'and',
            value: this.searchForm.status
          },
          {
            key: 'operator',
            opt: 'LIKE',
            type: 'S',
            logic: 'and',
            value: this.searchForm.operator
          },
          {
            key: 'classify',
            opt: 'LIKE',
            type: 'S',
            logic: 'and',
            value: this.searchForm.classify
          },
          {
            key: 'operatetime',
            opt: 'LIKE',
            type: 'S',
            logic: 'and',
            value: this.searchForm.operatetime
          },
          {
            key: 'operatorname',
            opt: 'LIKE',
            type: 'S',
            logic: 'and',
            value: this.searchForm.operatorname
          }
        ]
        this.logic = 'and'
      } else {
        this.filters = [
          { key: 'status', opt: 'LIKE', type: 'S', logic: 'or', value: '' },
          { key: 'operator', opt: 'LIKE', type: 'S', logic: 'or', value: this.keyWords },
          { key: 'classify', opt: 'LIKE', type: 'S', logic: 'or', value: this.keyWords },
          { key: 'operatetime', opt: 'BETWEEN', type: 'D', logic: 'or', value: '' },
          { key: 'operatorname', opt: 'LIKE', type: 'S', logic: 'or', value: this.keyWords }
        ]
        this.logic = 'or'
      }
      this.getList()
    },
    reset() {
      this.searchForm = Object.assign({}, this.searchForm, {
        status: '',
        operator: '',
        classify: '',
        operatetime: '',
        operatorname: ''
      })
      this.filters = [
        {
          key: 'status',
          opt: 'LIKE',
          type: 'S',
          logic: 'and',
          value: this.searchForm.status
        },
        {
          key: 'operator',
          opt: 'LIKE',
          type: 'S',
          logic: 'and',
          value: this.searchForm.operator
        },
        {
          key: 'classify',
          opt: 'LIKE',
          type: 'S',
          logic: 'and',
          value: this.searchForm.classify
        },
        { key: 'operatetime', opt: 'BETWEEN', type: 'D', logic: 'and', value: '' },
        {
          key: 'operatorname',
          opt: 'LIKE',
          type: 'S',
          logic: 'and',
          value: this.searchForm.operatorname
        }
      ]
      this.getList()
    },
    loadNode(node, resolve) {
      // isFirst 为了保证只在第一次加载的时候进行
      if (this.isFirst) {
        this.node = node
        this.resolve = resolve
        this.isFirst = false
      }
      const id = node.data ? node.data.id : '0'
      const activeId = this.activeId !== '' ? this.activeId : '0'
      getProcessIframeTree(id, activeId).then(res => {
        // if (id === '0' && res.length > 0) {
        //   this.grandParentId = []
        //   this.grandParentId.push(res[0].id)
        // } else if (res.length == 1) {
        //   this.grandParentId.push(res[0].id)
        // }
        if (node.level === 0 || (node.level < 2 && res.length === 1)) {
          this.grandParentId = [res[0].id]
        }
        if (node.level === 1 && res.length > 0) {
          this.$nextTick(() => {
            if (this.$refs.asyncTree) {
              this.$refs.asyncTree.setCurrentKey(res[0].id)
              this.treeId = res[0].id
              this.treeData = res[0]
              this.getList()
            }
          })
        }
        resolve(res)
      })
    },
    filterTree() {
      if (!this.searchTree) {
        this.controlTree = false
        return false
      }
      searchProcessIframeTree({
        name: this.searchTree,
        frameVersionId: this.activeId
      }).then(res => {
        if (!res) return false
        this.controlTree = true
        this.treelist = res
      })
    },
    handlerNodeClick(data, node) {
      console.log(data)
      if (data.isVisible === '0') {
        let ref = this.controlTree ? 'treeFilter' : 'asyncTree'
        this.$refs[ref].setCurrentKey(this.treeData.id)
        return
      }
      this.treeData = Object.assign({}, data)
      this.treeId = data.id
      this.treeNode = node
      this.action = `${this.host}/frameVersion/verifyUpload/${this.treeData.id}`
      this.getList()
    },
    handlerTreeOperate(type, data, node) {
      this.permissionList = []
      this.getCardlist()
      this.dictionaryQuery()
      this.datarank = data.rank
      this.playBoxType = type
      console.log(data)
      const me = this
      if (data.spstate === '1' && data.operation === 'insert') {
        this.$message({
          message: '该流程新增审批中，暂不可操作！',
          type: 'warning'
        })
        return false
      }
      if (data.spstate === '1' && data.operation === 'update') {
        this.$message({
          message: '该流程修改审批中，暂不可操作！',
          type: 'warning'
        })
        return false
      }
      if (data.spstate === '1') {
        this.$message({
          message: '该流程正在审批中，暂不可操作！',
          type: 'warning'
        })
        return false
      }
      if (this.playBoxType == 'add') {
        this.showCode = node.level !== 1
        if (data.rank == 1) {
          this.processLevelShow = false
          this.showWayif = 1
        } else if (data.rank == 2) {
          this.showWayif = 2
          this.processLevelShow = true
        } else if (data.rank == 3) {
          this.processLevelShow = false
          this.showWayif = 2
        } else {
          this.showWayif = 0
          this.processLevelShow = false
        }
      } else if (this.playBoxType == 'edit') {
        console.log('--', node)
        this.showCode = node.level !== 2
        if (data.rank == 2) {
          this.processLevelShow = false
          this.showWayif = 1
        } else if (data.rank == 3) {
          this.showWayif = 2
          this.processLevelShow = true
        } else if (data.rank == 4) {
          this.showWayif = 2
          this.processLevelShow = false
        } else {
          this.showWayif = 0
          this.processLevelShow = false
        }
      } else {
        this.processLevelShow = false
        this.showWayif = 0
      }
      // 判断是否出现流程层级字段
      // if (data.code.substr(2, 1) || data.code.substr(3, 1) === '0') {
      //   this.editForm.switch = true
      // } else {
      //   this.editForm.switch = false
      // }
      if (node.data.rank === 3) {
        this.editForm.switch = true
      } else {
        this.editForm.switch = false
      }
      // 获取流程层级的选项字段
      getProcessLevel().then(res => {
        this.options = res
      })
      if (type === 'add') {
        this.treeTempId = data.id
        this.selectedID = []
        this.selectedID2 = []
        this.selectedID3 = []
        this.updatenewForm.pid = data.id
        this.updatenewForm.status = data.state
        this.updatenewForm.parentname = data.name
        this.updatenewForm.rank = node.level + 1
        getProcessTreeNodeCode(data.id).then(res => {
          console.log(node.level, 'node.level')

          this.isDialogsVisible = true
          this.checked = false
          this.editForm.name = data.name
          this.editForm.iframeName = ''
          this.editForm.enName = ''
          this.editForm.processcode = ''
          this.editForm.code = res.code
          this.editForm.person = ''
          this.editForm.ruleperson = ''
          this.editForm.consultmanager = ''
          this.editForm.rulecode = ''
          this.editForm.rulename = ''
          this.editForm.systematic = ''
          this.editForm.displaymode = ''
          this.editFormtitle = this.addTheEnterpriseProcessFramework
          this.editForm.typeid = ''
          this.editForm.processoptions = ''
          this.updatenewForm.code = res.code
          this.updatenewForm.rank = node.level + 1
          if (res.code.substr(2, 1) || res.code.substr(3, 1) == 0) {
            this.editForm.rank = 2
          }
          if (data.id == '79957553BD2F3978E053BF1A13ACD486') {
            this.$set(this.editForm, 'businessLayer', true)
            this.editForm.businessLayer = true
            this.editForm.code = ''
          } else {
            this.$set(this.editForm, 'businessLayer', false)
            this.editForm.businessLayer = false
          }
          this.getTableList()
        })
      } else if (type === 'edit') {
        if (
          (node.data.rank === 3 && node.data.code.substr(2, 1)) ||
          node.data.code.substr(3, 1) == 0
        ) {
          this.editForm.switch = true
        }
        this.treeTempId = node.parent.data.id
        this.updateForm.id = data.id
        this.updateForm.ename = data.ename
        this.updateForm.processcode = data.processcode
        this.updateForm.rank = node.level
        this.updatenewForm.rank = node.level
        this.isDialogsVisible = true
        this.checked = false
        this.editForm.name = node.parent.data.name
        this.editForm.code = data.code
        this.editForm.iframeName = data.name.replace(/\d+(\.\d+)+/g, '')
        this.editForm.enName = data.ename
        this.editForm.processcode = data.processcode
        this.editFormtitle = this.editTheEnterpriseProcessFramework
        this.editForm.rank = node.level
        this.editForm.typeid = data.typeid
        this.editForm.processoptions = data.processoptions
        this.editForm.ruleperson = ''
        this.editForm.consultmanager = ''
        this.editForm.rulecode = data.rulecode
        this.editForm.rulename = data.rulename
        this.editForm.systematic = data.systematic
        this.editForm.displaymode = data.displaymode

        getProcessTreeofprincipal(data.id).then(res => {
          // 上一次保存数据
          let jsondata = {}
          if (res.operation === 'insert' || res.operation === 'updata') {
            jsondata = JSON.parse(res.jsontext)
          } else {
            jsondata = res
          }
          this.editForm.enName = jsondata.ename
          this.editForm.iframeName = jsondata.name
          this.updateForm.managerList = jsondata.managerList
          this.editForm.processcode = jsondata.processcode
          this.editForm.systematic = jsondata.systematic
          this.editForm.displaymode = jsondata.displaymode
          this.editForm.rulecode = jsondata.rulecode
          this.editForm.rulename = jsondata.rulename
          this.editForm.systematic = jsondata.systematic
          this.editForm.displaymode = jsondata.displaymode
          this.$set(this.updateForm, 'spstate', res.spstate)
          this.$set(this.editForm, 'spstate', res.spstate)
          this.$set(this.updateForm, 'spinstid', res.spinstid)
          this.$set(this.editForm, 'spinstid', res.spinstid)
          const list = jsondata.managerList
          const temp = []
          for (let i = 0; i < list.length; i++) {
            temp.push(list[i].value)
            this.selectedID.push({
              ID: parseInt(list[i].empuid),
              name: list[i].value,
              person: {
                cnname: list[i].cnname,
                empid: list[i].userid
              }
            })
          }
          this.editForm.person = temp.toString(',')
          this.editForm.rulemanagerList = jsondata.rulemanagerList || []
          this.$set(this.editForm, 'rulemanagerList', jsondata.rulemanagerList)
          this.$set(
            this.editForm,
            'consultmanagerList',
            jsondata.consultmanagerList
          )
          this.$set(this.editForm, 'managerList', jsondata.managerList)
          const list2 = this.editForm.rulemanagerList
          const temp2 = []
          for (let i = 0; i < list2.length; i++) {
            temp2.push(list2[i].value)
            this.selectedID2.push({
              ID: parseInt(list2[i].empuid),
              NAME: list2[i].value
            })
          }
          this.editForm.ruleperson = temp2.toString(',')
          this.editForm.consultmanagerList = jsondata.consultmanagerList || []
          const list3 = this.editForm.consultmanagerList
          const temp3 = []
          for (let i = 0; i < list3.length; i++) {
            temp3.push(list3[i].value)
            this.selectedID3.push({
              ID: parseInt(list3[i].empuid),
              NAME: list3[i].value,
              person: {
                cnname: list3[i].cnname,
                empid: list3[i].userid
              }
            })
          }
          this.editForm.consultmanager = temp3.toString(',')
          this.getTableList()
        })
      } else {
        const parentId = node.parent.data.id
        // this.$confirm(this.areYouSureDelete, this.hint, {
        //   confirmBtnText: this.confirm,
        //   cancelBtnText: this.cancel,
        //   type: "warning"
        // }).then(() => {
        //   const id = data.id;
        //   getProcessTreedelete(id).then(res => {
        //     if (res) {
        //       this.$message({
        //         type: "success",
        //         message: "删除流程框架审批流程发起成功"
        //       });
        //       const node = this.$refs.asyncTree.getNode(parentId); // 通过节点id找到对应树节点对象
        //       node.loaded = false;
        //       node.expand();
        //     }
        //   });
        // });
        this.getWhetherDeleteAction(type, data, node)
      }
    },
    // 判断是否删除
    getWhetherDeleteAction(type, data, node) {
      console.log(data)
      getWhetherDelete(data.id).then(res => {
        if (res) {
          console.log(res)
          if (res.code === 200) {
            this.httpDeleteAction(type, data, node)
          } else {
            this.$confirm(res.msg, this.hint, {
              confirmBtnText: this.confirm,
              cancelBtnText: this.cancel,
              type: 'warning'
            }).then(() => {
              this.httpDeleteAction(type, data, node)
            })
          }
        }
      })
      // this.$confirm("您确定要升级吗", this.hint, {
      //   confirmBtnText: this.confirm,
      //   cancelBtnText: this.cancel,
      //   type: "warning"
      // }).then(() => {
      // });
    },
    // 删除httpAction
    httpDeleteAction(type, data, node) {
      const parentId = node.parent.data.id
      this.$confirm(this.areYouSureDelete, this.hint, {
        confirmBtnText: this.confirm,
        cancelBtnText: this.cancel,
        type: 'warning'
      }).then(() => {
        const id = data.id
        getProcessTreedelete(id).then(res => {
          if (res) {
            this.$message({
              type: 'success',
              // message: '删除流程框架审批流程发起成功'
              message: '删除成功'
            })
            const node = this.$refs.asyncTree.getNode(parentId) // 通过节点id找到对应树节点对象
            node.loaded = false
            node.expand()
          }
        })
      })
    },
    //这是选择组件点击确定的返回
    handlerGroupSelect(list) {
      // 制度编写人
      if (this.showType === 'rule') {
        const str = []
        this.editForm.rulemanagerList = []
        for (let i = 0; i < list.length; i++) {
          const managerList = {
            cnname: '',
            empuid: '',
            id: '',
            loadChildren: '',
            modelid: '',
            pid: '',
            sort: 0,
            type: '',
            userid: '',
            value: ''
          }
          managerList.cnname = list[i].person.name
          managerList.empuid = list[i].id
          managerList.pid = list[i].pid
          managerList.type = list[i].type
          managerList.userid = list[i].person.memberId
          managerList.value = list[i].name
          str.push(list[i].name)
          managerList.modelid = this.updateForm.id
          this.editForm.rulemanagerList.push(managerList)
        }
        this.editForm.ruleperson = str.toString(',')
        return false
      }
      if (this.showType === 'consultmanager') {
        let str1 = []
        this.editForm.consultmanagerList = []
        for (let i = 0; i < list.length; i++) {
          const managerList = {
            cnname: '',
            empuid: '',
            id: '',
            loadChildren: '',
            modelid: '',
            pid: '',
            sort: 0,
            type: '',
            userid: '',
            value: ''
          }
          managerList.cnname = list[i].person.name
          managerList.empuid = list[i].id
          managerList.pid = list[i].pid
          managerList.type = list[i].type
          managerList.userid = list[i].person.memberId
          managerList.value = list[i].name
          str1.push(list[i].name)
          managerList.modelid = this.updateForm.id
          this.editForm.consultmanagerList.push(managerList)
        }
        this.editForm.consultmanager = str1.toString(',')
        return false
      }
      this.editForm.selectperson = []
      this.updateForm.managerList = []
      this.updatenewForm.managerList = []
      const temp = []
      for (let i = 0; i < list.length; i++) {
        temp.push(list[i].name)
      }
      this.editForm.person = temp.toString(',')
      this.editForm.selectperson = list
      this.isGroupVisible = false
      if (this.editFormtitle === this.addTheEnterpriseProcessFramework) {
        const tempvtm = []
        for (let i = 0; i < this.editForm.selectperson.length; i++) {
          const managerList = {
            cnname: '',
            empuid: '',
            loadChildren: '',
            modelid: '',
            pid: '',
            sort: 0,
            type: '',
            userid: '',
            value: ''
          }
          managerList.cnname = this.editForm.selectperson[i].person.name
          managerList.empuid = this.editForm.selectperson[i].id
          managerList.pid = this.editForm.selectperson[i].pid
          managerList.type = this.editForm.selectperson[i].type
          managerList.userid = this.editForm.selectperson[i].person.memberId
          managerList.value = this.editForm.selectperson[i].name
          tempvtm.push(
            this.editForm.selectperson[i].person.name +
              '/' +
              this.editForm.selectperson[i].name
          )
          this.updatenewForm.managerList.push(managerList)
        }
        this.updatenewForm.vtmpmanager = tempvtm.toString(',')
      } else if (
        this.editFormtitle === this.editTheEnterpriseProcessFramework
      ) {
        // 如果重新编辑，用新数据
        this.updateForm.consultmanagerList = []
        for (let i = 0; i < this.editForm.selectperson.length; i++) {
          const consultmanagerList = {
            cnname: '',
            empuid: '',
            id: '',
            loadChildren: '',
            modelid: '',
            pid: '',
            sort: 0,
            type: '',
            userid: '',
            value: ''
          }
          consultmanagerList.cnname = this.editForm.selectperson[i].person.name
          consultmanagerList.empuid = this.editForm.selectperson[i].id
          consultmanagerList.pid = this.editForm.selectperson[i].pid
          consultmanagerList.type = this.editForm.selectperson[i].type
          consultmanagerList.userid = this.editForm.selectperson[
            i
          ].person.memberId
          consultmanagerList.value = this.editForm.selectperson[i].name
          consultmanagerList.modelid = this.updateForm.id
          this.updateForm.consultmanagerList.push(consultmanagerList)
        }
        // 如果重新编辑，用新数据
        this.updateForm.managerList = []
        for (let i = 0; i < this.editForm.selectperson.length; i++) {
          const managerList = {
            cnname: '',
            empuid: '',
            id: '',
            loadChildren: '',
            modelid: '',
            pid: '',
            sort: 0,
            type: '',
            userid: '',
            value: ''
          }
          managerList.cnname = this.editForm.selectperson[i].person.name
          managerList.empuid = this.editForm.selectperson[i].id
          managerList.pid = this.editForm.selectperson[i].pid
          managerList.type = this.editForm.selectperson[i].type
          managerList.userid = this.editForm.selectperson[i].person.memberId
          managerList.value = this.editForm.selectperson[i].name
          managerList.modelid = this.updateForm.id
          this.updateForm.managerList.push(managerList)
        }
      }
    },
    handlerConfirm() {
      const me = this
      if (
        this.playBoxType == 'add' &&
        this.datarank == 1 &&
        this.editForm.systematic == 'valueChain'
      ) {
        this.$message({
          message: '框架不能选择价值链',
          type: 'warning'
        })
        return false
      }
      if (
        this.playBoxType == 'edit' &&
        this.datarank == 2 &&
        this.editForm.systematic == 'valueChain'
      ) {
        this.$message({
          message: '框架不能选择价值链',
          type: 'warning'
        })
        return false
      }
      this.$refs.editRef.validate(valid => {
        if (valid) {
          this.isDialogsVisible = false
          this.savedate()
          // switch (true) {
          //   case me.processType === "bpm":
          //     break;
          //   case me.processType === "direct":
          //     break;
          // }
        } else {
        }
      })
    },
    savedate() {
      if (this.showWayif == 2 && this.checked) {
        this.associateSubordinates()
      }
      if (this.editFormtitle === this.addTheEnterpriseProcessFramework) {
        this.updatenewForm.ename = this.editForm.enName
        this.updatenewForm.name = this.editForm.iframeName
        this.updatenewForm.processcode = this.editForm.processcode
        this.updatenewForm.systematic = this.editForm.systematic
        // this.updatenewForm.push()
        this.$set(this.updatenewForm, 'typeid', this.editForm.typeid)
        this.$set(
          this.updatenewForm,
          'processoptions',
          this.editForm.processoptions
        )
        // 正式用，先提交流程，流程结束后真正保存
        // getProcessTreesaveT(this.updatenewForm).then(res => {
        //   console.log(res)
        //   let url = "http://180.101.125.105:7011/bas/oAuth?"
        //   window.open(url)
        // })
        // 测试用，不走流程直接保存
        this.updatenewForm.rulemanagerList = !this.editForm.rulemanagerList
          ? []
          : JSON.parse(JSON.stringify(this.editForm.rulemanagerList))
        this.updatenewForm.consultmanagerList = !this.editForm
          .consultmanagerList
          ? []
          : JSON.parse(JSON.stringify(this.editForm.consultmanagerList))
        this.updatenewForm.rulename = this.editForm.rulename
        this.updatenewForm.rulecode = this.editForm.rulecode

        this.updatenewForm.displaymode =
          this.editForm.systematic == 'function'
            ? this.editForm.displaymode
            : ''
        console.log(this.editForm, 'this.editForm')
        if (this.editForm.businessLayer == true) {
          this.$set(this.updatenewForm, 'businessLayer', true)
          this.$set(this.updatenewForm, 'code', '')
        }
        // 当输入框清空后, 保存时置空对应数据
        if (this.editForm.person === '') {
          this.updatenewForm.managerList = []
        }
        // 当输入框清空后, 保存时置空对应数据
        if (this.editForm.consultmanager === '') {
          this.updatenewForm.consultmanagerList = []
        }
        getProcessTreesave(this.updatenewForm).then(res => {
          if (!res) return false
          if (res) {
            this.$message({
              type: 'success',
              message: res
            })
            this.saveProcessFrameworkAuth(res)
          }
          // if (res === "新增流程框架审批流程发起成功") {
          //   this.$message({
          //     type: "success",
          //     message: "新增流程框架审批流程发起成功",
          //   });
          // } else {
          //   this.$message({
          //     type: "success",
          //     message: "新增流程框架审批流程发起成功",
          //   });
          // }

          this.updatenewForm.managerList = []
          this.updatenewForm.managerList = []
          this.updatenewForm.rulemanagerList = []
          this.editForm.rulemanagerList = []
          this.updatenewForm.consultmanagerList = []
          this.editForm.consultmanagerList = []
          const node = this.$refs.asyncTree.getNode(this.treeTempId) // 通过节点id找到对应树节点对象
          node.loaded = false
          node.expand()
        })
      } else if (
        this.editFormtitle === this.editTheEnterpriseProcessFramework
      ) {
        this.updateForm.ename = this.editForm.enName
        this.updateForm.name = this.editForm.iframeName
        this.updateForm.processcode = this.editForm.processcode
        this.$set(this.updateForm, 'typeid', this.editForm.typeid)
        this.$set(
          this.updateForm,
          'processoptions',
          this.editForm.processoptions
        )
        // 正式用，先提交流程，流程结束后真正保存
        // getProcessTreeupdateT(this.updateForm).then(res => {
        //   console.log(res)
        //   let url = "http://180.101.125.105:7011/bas/oAuth?"
        //   window.open(url)
        // })
        this.updateForm.rulemanagerList = !this.editForm.rulemanagerList
          ? []
          : JSON.parse(JSON.stringify(this.editForm.rulemanagerList))
        this.updateForm.consultmanagerList = !this.editForm.consultmanagerList
          ? []
          : JSON.parse(JSON.stringify(this.editForm.consultmanagerList))
        this.updateForm.rulename = this.editForm.rulename
        this.updateForm.parentname = this.editForm.name
        this.updateForm.code = this.editForm.code
        this.updateForm.rulecode = this.editForm.rulecode
        this.updateForm.systematic = this.editForm.systematic
        this.updateForm.spstate = this.editForm.spstate
        this.updateForm.displaymode =
          this.editForm.systematic == 'function'
            ? this.editForm.displaymode
            : ''
        // 测试用，不走流程直接保存
        // 当输入框清空后, 保存时置空对应数据
        if (this.editForm.person === '') {
          this.updateForm.managerList = []
        }
        // 当输入框清空后, 保存时置空对应数据
        if (this.editForm.consultmanager === '') {
          this.updateForm.consultmanagerList = []
        }
        getProcessTreeupdate(this.updateForm)
          .then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: res
              })
              this.saveProcessFrameworkAuth()
            }
            this.updateForm.managerList = []
            this.updateForm.rulemanagerList = []
            this.editForm.rulemanagerList = []
            this.updateForm.consultmanagerList = []
            this.editForm.consultmanagerList = []
            const node = this.$refs.asyncTree.getNode(this.treeTempId) // 通过节点id找到对应树节点对象
            node.loaded = false
            node.expand()
          })
          .catch(err => {
            console.log(err)
            this.$message({
              type: 'error',
              message: '框架名称重复!'
            })
          })
      }
      this.selectedID = []
      this.selectedID2 = []
      this.selectedID3 = []
    },
    saveProcessFrameworkAuth(id) {
      this.pageLoading = true


      // 新增的没有id，编辑的传id，删除的isDelete=true
      
      // 删除的数据
      let relatedids = this.permissionList.map(el => el.relatedid)
      let deletePermission = this.permissionInitList.filter(item => !relatedids.includes(item.relatedid)).map(item => {
        return {
          isDelete: true,
          ...item
        }
      })
      let subRelated = this.permissionList.map(item => {
        let obj = this.permissionInitList.find(el => el.relatedid === item.relatedid) || {}
        return {
          ...obj,
          ...item
        }
      })
      let permissionList = [...deletePermission, ...subRelated]

      if (this.playBoxType == 'add' && id) {
        permissionList.forEach(item => {
          item.modelid = id
          if (item.id) delete item.id
          if (item.modelListAuth) delete item.modelListAuth
        })
      }
      permissionList.forEach(item => {
        item.lookover = item.lookover ? '1' : '0'
        item.adder = item.adder ? '1' : '0'
        item.updater = item.updater ? '1' : '0'
        item.deleter = item.deleter ? '1' : '0'
        item.rulemanagementlookover = item.rulemanagementlookover ? '1' : '0'
        item.rulecommunitylookover = item.rulecommunitylookover ? '1' : '0'
      })
      saveProcessFrameworkAuth(permissionList)
        .then(rt => {
          this.$message.success(this.$t('hintText.operateSuccessfully'))
          this.pageLoading = false
        })
        .catch(() => {})
    },
    cancalConfirm() {
      this.isDialogsVisible = false
      this.processLevelShow = false
      this.selectedID = []
      this.selectedID2 = []
      this.selectedID3 = []
    }
  }
}
</script>
<style lang="scss" scoped>
.green {
  color: green;
}

.red {
  color: #f56c6c;
}

.custom-tree-node {
  // width: calc(100% - 24px);
  display: flex;
  align-items: center;
  box-sizing: border-box;

  .grow {
    // max-width: 100%;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // padding-right: 70px;
  }

  .add {
    color: $tc5 !important;
    padding: 2px;
    display: none;
    cursor: pointer !important;

    &:hover {
      background: $dc1;
    }
  }

  .del {
    color: $tc4;
    padding: 2px;
    display: none;

    &:hover {
      background: $dc1;
    }
  }

  &:hover {
    .add {
      display: inline-block;
    }

    .del {
      display: inline-block;
    }
  }
}

#processIframeManage {
  background-color: white;
  .header-l {
    float: left;
    width: calc(100% - 240px);

    .buton {
      float: left;
      margin-right: 10px;
      color: #000;
      font-family: Arial, 微软雅黑, 'Microsoft Sans Serif';
      font-size: 12px;
      cursor: pointer;
    }

    .active-buton {
      color: #2d42af;
    }
  }

  .header-r {
    float: right;
  }

  /deep/
    .el-tree-node.is-current
    > .el-tree-node__content
    .custom-tree-node
    .green {
    color: #2d42af;
    font-size: 13px;
  }

  /deep/ .el-tree-node.is-current > .el-tree-node__content .custom-tree-node {
    color: #2d42af;
    font-size: 13px;
  }

  /deep/ .custom-tree-node {
    color: #666;
    padding-right: 60px;
    font-size: 13px;
  }

  .custom-tree-node.disabled,
  .custom-tree-node.disabled * {
    color: #bbb;
    font-weight: normal !important;
    cursor: not-allowed;
    background-color: transparent !important;
  }

  .right-content {
    height: 100%;

    /deep/ .el-scrollbar__wrap {
      height: 100%;
      padding: 0 !important;
    }

    .el-scrollbar__view {
      height: 100%;
    }
  }

  .opertionBtn {
    margin-left: 15px;
  }

  .left_tree_wrapper {

    /deep/ .el-tree-node__content {
      width: 100%;
    }

    /deep/ .el-tree-node > .el-tree-node__children {
      overflow: visible;
    }
  }
}
</style>
