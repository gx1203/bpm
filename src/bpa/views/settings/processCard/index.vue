<template>
  <div id="processCard">
    <el-tabs
      type="card"
      class="topCustom"
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane label="流程卡片字段维护" name="process">
        <el-row gutter="20">
          <!-- 新增加树 -->
          <el-col :span="6">
            <div class="left_tree_wrapper margin-t20">
              <el-tree
                ref="asyncTree"
                class="filter-tree elTree"
                :data="treeData"
                :props="defaultProps"
                :default-expanded-keys="['0']"
                @node-click="handleNodeClick"
                node-key="id"
                :highlight-current="true"
                :expand-on-click-node="false"
              >
                <div slot-scope="{ node, data }" class="custom-tree-node">
                  <span :class="data.pid ? 'process_02' : 'process_01'"></span>
                  <p
                    :class="{ green: data.release === 'Y' }"
                    :title="node.label"
                  >
                    {{ node.label }}
                  </p>
                  <p class="font14 opertionBtn">
                    <i
                      v-if="node.level === 1"
                      class="el-icon-circle-plus-outline btn"
                      @click="addTabField()"
                    />
                    <i
                      v-if="node.level !== 1"
                      class="el-icon-edit btn"
                      @click="addTabField(data)"
                    />
                    <i
                      v-if="node.level !== 1"
                      class="el-icon-delete btn"
                      @click="deleteTabField(data.id)"
                    />
                  </p>
                </div>
              </el-tree>
            </div>
          </el-col>
          <el-col :span="18">
            <!--    表格-->
            <bas-table
              row-key="id"
              :tableList="tableCardlist"
              :headerList="headerList"
              :pages="pages"
              :isShowIndex="true"
              @currentChange="currentChange">
              <template #search>
                <div>
                  <el-row style="margin: 10px 0 15px;">
                    <el-col :span="16" v-show="!isHighSearch">
                      <el-input
                        clearable
                        :title="enterSettingsProcessCard"
                        :placeholder="enterSettingsProcessCard"
                        class="search_component"
                        v-model="searchContent"
                        @keyup.enter.native="getData('singleSelect')"
                      >
                        <el-button
                          type="primary"
                          slot="append"
                          @click="getData('singleSelect')"
                        >
                          {{ $t('search') }}
                        </el-button>
                      </el-input>
                    </el-col>
                    <!--<el-button class="high_search" type="primary" @click="isHighSearch=!isHighSearch">-->
                    <!--高级-->
                    <!--<i :class="isHighSearch?'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>-->
                    <!--</el-button>-->
                    <!-- 根据提交Bug需求,暂时隐藏添加按钮 -->
                    <el-col :span="8" class="search_buttons_wrap" style="float: right;">
                      <el-button type="primary" @click="toggleSearch">
                        {{ $t('advancedQuery') }}
                        <i
                          :class="
                            isHighSearch
                              ? 'el-icon-caret-bottom'
                              : 'el-icon-caret-top'
                          "
                        ></i>
                      </el-button>
                      <el-button type="primary" @click="reportConfig()"
                        >报表权限配置
                      </el-button>
                      <el-button v-if="isAdmin" type="primary" @click="addfield()"
                        >{{ $t('add') }}
                      </el-button>
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
                          <el-form-item :label="fieldNames">
                            <el-input clearable v-model="searchForm.name"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item :label="state">
                            <el-select clearable v-model="searchForm.state">
                              <el-option :label="$t('all')" value="" />
                              <el-option :label="invisible" value="0" />
                              <el-option :label="visible" value="1" />
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item :label="belongsLabel">
                            <el-input
                              clearable
                              v-model="searchForm.blgLabel"
                            ></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <div class="search_buttons_wrap">
                        <el-button type="primary" @click="getData('highSelect')"
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
              <!-- 字段名称 -->
              <template #name="{ row }">
                <div>{{ row.name }}</div>
              </template>
              <!-- 状态 -->
              <template #state="{ row }">
                <div>{{
                    row.state == '1'
                      ? $t('bpa_visible')
                      : $t('bpa_invisible')
                  }}</div>
              </template>
              <!-- 所属标签 -->
              <template #sheetname="{ row }">
                <div>{{row.sheetname}}</div>
              </template>
              <!-- 是否必读 -->
              <template #necessary="{ row }">
                <div>{{
                    !row.necessary
                      ? ''
                      : row.necessary == 1
                      ? $t('yes')
                      : $t('no')
                  }}</div>
              </template>
              <!-- 操作 -->
              <template #updateby="{ row }">
                 <el-tooltip
                    class="item"
                    effect="dark"
                    :content="edit"
                    placement="top"
                  >
                    <!-- icon="el-icon-edit"
                      circle
                      class="no-border" -->
                    <el-button @click="addfield(row)" type="text"
                      >{{ edit }}
                    </el-button>
                  </el-tooltip>
                  <!-- 根据提交Bug需求,暂时隐藏删除按钮 -->
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="delete2"
                    placement="top"
                  >
                    <el-button
                      @click="delField(row.id)"
                      type="text"
                      v-if="isAdmin"
                      >{{ delete2 }}
                    </el-button>
                  </el-tooltip>
              </template>
            </bas-table>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="制度卡片字段维护" name="system">
        <el-row gutter="20">
          <!-- 新增加树 -->
          <el-col :span="6">
            <div class="left_tree_wrapper margin-t20">
              <el-tree
                ref="asyncTree"
                class="filter-tree elTree"
                :data="treeData"
                :props="defaultProps"
                :default-expanded-keys="['0']"
                @node-click="handleNodeClick"
                node-key="id"
                :highlight-current="true"
                :expand-on-click-node="false"
              >
                <div slot-scope="{ node, data }" class="custom-tree-node">
                  <span :class="data.pid ? 'process_02' : 'process_01'"></span>
                  <p
                    :class="{ green: data.release === 'Y' }"
                    :title="node.label"
                  >
                    {{ node.label }}
                  </p>
                  <p class="font14 opertionBtn">
                    <i
                      v-if="node.level === 1"
                      class="el-icon-circle-plus-outline btn"
                      @click="addTabField()"
                    />
                    <i
                      v-if="node.level !== 1"
                      class="el-icon-edit btn"
                      @click="addTabField(data)"
                    />
                    <i
                      v-if="node.level !== 1"
                      class="el-icon-delete btn"
                      @click="deleteTabField(data.id)"
                    />
                  </p>
                </div>
              </el-tree>
            </div>
          </el-col>
          <el-col :span="18">
            <!--    表格-->
            <bas-table
              row-key="systemid"
              :tableList="tableCardlist"
              :headerList="headerList"
              :pages="pages"
              :isShowIndex="true"
              @currentChange="systemCurrentChange">
              <template #search>
                <div>
                  <el-row style="margin: 10px 0 15px;">
                    <el-col :span="16" v-show="!isHighSearch">
                      <el-input
                        clearable
                        :title="enterSettingsProcessCard"
                        :placeholder="enterSettingsProcessCard"
                        class="search_component"
                        v-model="searchContent"
                        @keyup.enter.native="getData('singleSelect')"
                      >
                        <el-button
                          type="primary"
                          slot="append"
                          @click="getData('singleSelect')"
                        >
                          {{ $t('search') }}
                        </el-button>
                      </el-input>
                    </el-col>
                    <!--<el-button class="high_search" type="primary" @click="isHighSearch=!isHighSearch">-->
                    <!--高级-->
                    <!--<i :class="isHighSearch?'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>-->
                    <!--</el-button>-->
                    <!-- 根据提交Bug需求,暂时隐藏添加按钮 -->
                    <el-col :span="8" class="search_buttons_wrap" style="float: right;">
                      <el-button type="primary" @click="toggleSearch">
                        {{ $t('advancedQuery') }}
                        <i
                          :class="
                            isHighSearch
                              ? 'el-icon-caret-bottom'
                              : 'el-icon-caret-top'
                          "
                        ></i>
                      </el-button>
                      <el-button type="primary" v-if="isAdmin" @click="addfield()"
                        >{{ $t('add') }}
                      </el-button>
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
                          <el-form-item :label="fieldNames">
                            <el-input clearable v-model="searchForm.name"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item :label="state">
                            <el-select clearable v-model="searchForm.state">
                              <el-option :label="$t('all')" value="" />
                              <el-option :label="invisible" value="0" />
                              <el-option :label="visible" value="1" />
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item :label="belongsLabel">
                            <el-input
                              clearable
                              v-model="searchForm.blgLabel"
                            ></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <div class="search_buttons_wrap">
                        <el-button type="primary" @click="getData('highSelect')"
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
              <!-- 字段名称 -->
              <template #name="{ row }">
                <div>{{ row.name }}</div>
              </template>
              <!-- 状态 -->
              <template #state="{ row }">
                <div>{{
                    row.state == '1'
                      ? $t('bpa_visible')
                      : $t('bpa_invisible')
                  }}</div>
              </template>
              <!-- 所属标签 -->
              <template #sheetname="{ row }">
                <div>{{row.sheetname}}</div>
              </template>
              <!-- 是否必读 -->
              <template #necessary="{ row }">
                <div>{{
                    !row.necessary
                      ? ''
                      : row.necessary == 1
                      ? $t('yes')
                      : $t('no')
                  }}</div>
              </template>
              <!-- 操作 -->
              <template #updateby="{ row }">
                 <el-tooltip
                    class="item"
                    effect="dark"
                    :content="edit"
                    placement="top"
                  >
                    <!-- icon="el-icon-edit"
                      circle
                      class="no-border" -->
                    <el-button @click="addfield(row)" type="text"
                      >{{ edit }}
                    </el-button>
                  </el-tooltip>
                  <!-- 根据提交Bug需求,暂时隐藏删除按钮 -->
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="delete2"
                    placement="top"
                  >
                    <el-button
                      @click="delField(row.id)"
                      type="text"
                      v-if="isAdmin"
                      >{{ delete2 }}
                    </el-button>
                  </el-tooltip>
              </template>
            </bas-table>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <!-- <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="pages.pageNum"
      :page-size="pages.pageSize"
      background
      layout="prev, pager, next, jumper, total"
      :total="pages.total"
    >
    </el-pagination> -->
    <!--    添加或者修改字段-->
    <el-dialog
      :title="addProcessCardLabelField"
      :visible.sync="dialogVisible"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <p slot="title">
        <span class="el-dialog__title">{{addProcessCardLabelField}}</span><span class="red">（添加新字段需要由开发人员添加，否则不生效）</span>
      </p>
      <el-form
        label-width="120px"
        ref="fieldlist"
        :rules="rules"
        :model="fieldlist"
      >
        <el-form-item :label="fieldNames" prop="name">
          <el-input
            clearable
            v-model="fieldlist.name"
            maxlength="100"
          ></el-input>
        </el-form-item>
        <el-form-item :label="englishFieldName" prop="enname">
          <el-input
            onchange="this.value=this.value.replace(/[^a-zA-Z\s!\?.,。，]/g,'')"
            clearable
            v-model="fieldlist.enname"
            maxlength="100"
          ></el-input>
        </el-form-item>
        <el-form-item :label="matchesFieldName" prop="pname">
          <el-input
            clearable
            v-model="fieldlist.pname"
            maxlength="100"
            :disabled="isEdit"
          ></el-input>
        </el-form-item>
        <el-form-item :label="belongsLabel" prop="sheetname">
          <el-select :disabled="isEdit" clearable v-model="fieldlist.sheetname">
            <el-option
              v-for="item in tableTabCardlist"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="isitRequired" prop="necessary">
          <el-select clearable v-model="fieldlist.necessary">
            <el-option :label="no" value="0"></el-option>
            <el-option :label="yes" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="state" prop="state">
          <el-select
            :disabled="fieldlist.dicttype === '3'"
            v-model="fieldlist.state"
          >
            <el-option :label="invisible" value="0"></el-option>
            <el-option :label="visible" value="1"></el-option>
          </el-select>
        </el-form-item>
        <!--   类型     -->
        <el-form-item :label="keyTypeName" prop="dicttype">
          <el-select v-model="fieldlist.dicttype">
            <el-option
              v-for="item in legendCategoryOptions"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('sort')" prop="rank">
          <el-input-number v-model="fieldlist.rank" controls-position="right" :min="1"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="confirmField('fieldlist')">{{
          $t('confirm')
        }}</el-button>
      </span>
    </el-dialog>

    <!--    添加或者修改字段-->
    <el-dialog
      :title="addProcessCardTabfield"
      :visible.sync="dialogVisibles"
      width="40%"
      :rules="rules"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <p slot="title">
        <span class="el-dialog__title">{{addProcessCardTabfield}}</span><span class="red">（添加新字段需要由开发人员添加，否则不生效）</span>
      </p>
      <el-form
        ref="tabfieldlist"
        label-width="120px"
        :rules="rules"
        :model="tabfieldlist"
      >
        <el-form-item :label="fieldNames" prop="name">
          <el-input v-model="tabfieldlist.name" clearable maxlength="50" />
        </el-form-item>
        <el-form-item :label="englishFieldName" prop="enname">
          <el-input
            v-model="tabfieldlist.enname"
            onchange="this.value=this.value.replace(/[^a-zA-Z\s!\?.,。，]/g,'')"
            clearable
            maxlength="50"
          />
        </el-form-item>
        <el-form-item :label="$t('matchesLabelName')" prop="sort">
          <el-input
            v-model="tabfieldlist.sort"
            clearable
            maxlength="50"
            :disabled="fieldtitle == '修改'"
          />
        </el-form-item>
        <el-form-item :label="state" prop="state">
          <el-select v-model="tabfieldlist.state" clearable>
            <el-option :label="invisible" value="0" />
            <el-option :label="visible" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('sort')" prop="rank">
          <el-input-number v-model="tabfieldlist.rank" controls-position="right" :min="1"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibles = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="confirmTabField('tabfieldlist')">{{
          $t('confirm')
        }}</el-button>
      </span>
    </el-dialog>
    <report-config
      v-model="reportDialogVisible"
      @cancelConfirm="cancelConfirmReport"
    ></report-config>
  </div>
</template>

<script>
import {
  getDictionaryOption
} from '@/bpa/api/componentsApi'
import {
  getTabCardlist,
  saveTabField,
  deleteTabField
} from '@/bpa/api/settings/processTabCard'
import {
  getCardlist,
  saveField,
  deleteField
} from '@/bpa/api/settings/processCard'
import reportConfig from './components/reportConfig'
import { getIsAdmin } from '@/bpm/api/configManage/navConfig'

export default {
  components: {
    reportConfig
  },
  data() {
    return {
      // 表头字段
      headerList: [
        {
          label: this.$t('fieldNames'), // 字段名称
          prop: 'name',
          slotName: 'name',
          sortable: false
        },
        {
          label: this.$t('state'), // 状态
          prop: 'state',
          slotName: 'state',
          sortable: false
        },
        {
          label: this.$t('belongsLabel'), // 所属标签
          prop: 'sheetname',
          slotName: 'sheetname',
          sortable: false
        },
        {
          label: this.$t('isitRequired'), // 是否必选
          prop: 'necessary',
          slotName: 'necessary',
          sortable: false
        },
        {
          label: this.$t('operation'), // 操作
          prop: 'updateby',
          slotName: 'updateby',
          sortable: false
        }
      ],
      activeName: 'process',
      fieldNames: this.$t('fieldNames'),
      state: this.$t('state'),
      keyTypeName: this.$t('type'),
      addProcessCardTabfield: this.$t('addProcessCardTabfield'),
      fieldNameShouldNotExceedFiftyWords: this.$t(
        'hintText.fieldNameShouldNotExceedFiftyWords'
      ),
      dataSavedSuccessfully: this.$t('hintText.dataSavedSuccessfully'),
      requiredFieldsCannotBeEmpty: this.$t(
        'hintText.requiredFieldsCannotBeEmpty'
      ),
      successfullyDelete: this.$t('hintText.successfullyDelete'),
      visible: this.$t('bpa_visible'),
      invisible: this.$t('bpa_invisible'),
      areYouSureDelete: this.$t('hintText.areYouSureDelete'),
      hint: this.$t('hintText.hint'),
      cancel: this.$t('cancel'),
      reportDialogVisible: false,
      treeData: [
        {
          name: '所有标签',
          id: '0',
          children: []
        }
      ],
      // 树
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      isEdit: false,
      // 标签页的字段
      tableTabCardlist: [],
      // 控制显示隐藏弹出框
      dialogVisible: false,
      dialogVisibles: false,
      curTreeId: '',
      params: {
        attr: {},
        filters: [
          { key: 'name', opt: 'LIKE', type: 'S', value: '' },
          { key: 'state', opt: 'LIKE', type: 'S', value: '' },
          { key: 'sheetname', opt: 'LIKE', type: 'S', value: null },
          { key: 'sheetid', opt: 'EQ', type: 'S', value: '' },
          { key: 'type', opt: 'LIKE', type: 'S', value: '0' }
        ],
        logic: 'and',
        orderby: 'rank',
        pageNum: 1,
        pageSize: 10,
        sort: 'asc'
      },
      tableCardlist: [],
      isHighSearch: false,
      searchContent: '',
      searchForm: {
        blgLabel: '',
        name: '',
        state: ''
      },
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      fieldtitle: '添加流程卡片标签内字段',
      // 弹出框的变量部分
      fieldlist: {
        name: '',
        enname: '',
        pname: '',
        sheetname: '',
        necessary: '',
        state: '',
        dicttype: ''
      },
      tabfieldlist: {
        name: '',
        enname: '',
        sort: '',
        state: '',
        sheetType: '',
        id: ''
      },
      // 弹出框的必填规则
      rules: {
        name: [{ required: true, message: ' ', trigger: 'blur' }],
        enname: [{ required: true, message: ' ', trigger: 'blur' }],
        pname: [{ required: true, message: ' ', trigger: 'blur' }],
        sheetname: [{ required: true, message: ' ', trigger: 'blur' }],
        necessary: [{ required: false, message: ' ', trigger: 'blur' }],
        state: [{ required: true, message: ' ', trigger: 'blur' }],
        dicttype: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      addProcessCardLabelField: '',
      textMaxLength: 100, // 文本框最大字数限制
      enterSettingsProcessCard: this.$t(
        'placeholderText.enterSettingsProcessCard'
      ),
      belongsLabel: this.$t('belongsLabel'),
      isitRequired: this.$t('isitRequired'),
      englishFieldName: this.$t('englishFieldName'),
      matchesFieldName: this.$t('matchesFieldName'),
      yes: this.$t('yes'),
      no: this.$t('no'),
      edit: this.$t('modify'),
      delete2: this.$t('delete'),
      fieldNameShouldNotExceedOneHundredWords: this.$t(
        'hintText.fieldNameShouldNotExceedOneHundredWords'
      ),
      confirm: this.$t('confirm'),
      isAdmin: false,
      legendCategoryOptions: []
    }
  },
  mounted() {
    this.getData()
    this.getTabData()
    this.Suk_getIsAdmin()
    this.getDictionaryOption()
  },
  methods: {
    // 页码改变事件
    currentChange(newPageNum) {
      console.log('newPage', newPageNum)
      this.pages.pageNum = newPageNum
      this.params.pageNum = newPageNum
      this.getData()
    },
    systemCurrentChange(newPageNum) {
      console.log('newPage', newPageNum)
      this.pages.pageNum = newPageNum
      this.params.pageNum = newPageNum
      this.getData()
    },
    // 切换高级搜索
    toggleSearch() {
      this.isHighSearch = !this.isHighSearch
      if(this.isHighSearch) {
        this.searchContent = ''
      } else {
        this.searchForm = {
          blgLabel: '',
          name: '',
          state: ''
        }
      }
    },
    Suk_getIsAdmin() {
      getIsAdmin()
        .then(rt => {
          if (rt.data === false) {
            //非管理员
            this.isAdmin = false
          } else {
            this.isAdmin = true
          }
        })
        .catch(er => {
          console.log(er)
        })
    },
    // 获取数据字典
    getDictionaryOption() {
      getDictionaryOption({
        dictionaryen: '字段维护类型'
      }).then(res => {
        this.legendCategoryOptions = res
      })
    },
    resetSearchForm() {
      this.searchContent = ''
      this.searchForm = {
        blgLabel: '',
        name: '',
        state: ''
      }
      this.curTreeId = ''
      this.pages.pageNum = 1
      this.params = {
        attr: {},
        filters: [
          { key: 'name', opt: 'LIKE', type: 'S', value: '' },
          { key: 'state', opt: 'LIKE', type: 'S', value: '' },
          { key: 'sheetname', opt: 'LIKE', type: 'S', value: null },
          { key: 'sheetid', opt: 'EQ', type: 'S', value: '' },
          { key: 'type', opt: 'LIKE', type: 'S', value: '0' }
        ],
        logic: 'and',
        orderby: 'createon',
        pageNum: 1,
        pageSize: 10,
        sort: 'desc'
      }
    },
    handleClick(tab, event) {
      // tab栏切换时重置搜索表单
      this.resetSearchForm()
      this.isHighSearch = false
      this.getData()
      this.getTabData()
    },
    // 标签树
    handleNodeClick(data, node) {
      this.curTreeId = data.id === '0' ? '' : data.id
      this.getData()
    },
    /*
      获取标签页内列表数据
     */
    getData(type) {
      let self = this
      this.params.filters[4].value = this.activeName === 'process' ? '0' : '1'
      if (type === 'highSelect') {
        this.params.filters[0].value = this.searchForm.name
        this.params.filters[1].value = this.searchForm.state
        this.params.filters[2].value = this.searchForm.blgLabel
        this.params.logic = 'and'
        this.pages.pageNum = 1
        this.params.pageNum = 1
      } else if (type === 'singleSelect') {
        this.params.filters[0].value = this.searchContent
        this.params.filters[1].value = ''
        this.params.logic = 'and'
        this.pages.pageNum = 1
        this.params.pageNum = 1
      }
      this.params.filters[3].value = this.curTreeId
      // 获取表格内的数据
      getCardlist(this.params).then(res => {
        console.log(res)
        self.tableCardlist = res.list
        self.pages.total = res.total
      })
    },
    /*
      获取标签页内列表数据
     */
    getTabData() {
      let self = this
      getTabCardlist({
        attr: {},
        filters: [
          {
            key: 'sheetType',
            opt: 'LIKE',
            type: 'S',
            value: this.activeName === 'process' ? '0' : '1'
          }
        ],
        logic: 'or',
        orderby: 'rank',
        pageNum: 1,
        pageSize: 10000,
        sort: 'asc'
      }).then(res => {
        console.log(res)
        this.treeData[0].children = res.list
        console.log(this.treeData)
        console.log(this.treeData[0].children[0].name)
        self.tableTabCardlist = res.list
        // console.log(self.tableTabCardlist);
      })
    },

    /*
      重置高级搜索的条件
     */
    reset() {
      let self = this
      this.$set(self.searchForm, 'name', '')
      this.$set(self.searchForm, 'state', '')
      this.$set(self.searchForm, 'blgLabel', '')
      this.params.filters[0].value = this.searchForm.name
      this.params.filters[1].value = this.searchForm.state
      this.params.filters[2].value = this.searchForm.blgLabel
      this.$set(this.pages, 'pageNum', 1)
      this.params.pageNum = 1
      this.getData()
    },
    handleCurrentChange(val) {
      this.params.pageNum = val
      this.getData()
    },
    /*item
      弹出添加或者修改的对话框
     */
    // 报表权限配置
    reportConfig() {
      this.reportDialogVisible = true
    },
    cancelConfirmReport(data) {
      this.reportDialogVisible = false
    },
    // 弹出添加或者修改 标签页
    addTabField(item) {
      let self = this
      if (self.$refs.tabfieldlist) {
        self.$refs.tabfieldlist.clearValidate()
      }
      self.tabfieldlist = {
        name: '',
        enname: '',
        sort: '',
        state: '',
        sheetType: '',
        id: '',
        rank: ''
      }
      if (!item) {
        ;(self.addProcessCardTabfield = this.$t('addProcessCardTabfield')),
          (self.fieldtitle = '添加')
        if (this.activeName === 'process') {
          this.addProcessCardTabfield = this.$t('addProcessCardTabfield')
        } else {
          this.addProcessCardTabfield = '添加制度卡片标签页字段'
        }
      } else {
        if (this.activeName === 'process') {
          this.modifyProcessCardTabfield = this.$t('modifyProcessCardTabfield')
        } else {
          this.addProcessCardLabelField = '修改制度卡片标签页字段'
        }
        self.fieldtitle = '修改'
        self.tabfieldlist = {
          name: item.name,
          enname: item.enname,
          sort: item.sort,
          state: item.state,
          id: item.id,
          rank: item.rank
        }
      }
      console.log(self.tabfieldlist)
      self.dialogVisibles = true
    },
    /*
      标签页 弹出框确认
     */
    confirmTabField(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.tabfieldlist.name.length > this.textMaxLength) {
            this.$message({
              type: 'warning',
              message: this.fieldNameShouldNotExceedFiftyWords
            })
            return false
          } else if (this.tabfieldlist.enname.length > this.textMaxLength) {
            this.$message({
              type: 'warning',
              message: this.fieldNameShouldNotExceedFiftyWords
            })
            return false
          }
          saveTabField(
            {
              id: this.tabfieldlist.id,
              name: this.tabfieldlist.name,
              enname: this.tabfieldlist.enname,
              sort: this.tabfieldlist.sort,
              sheetType: this.activeName === 'process' ? '0' : '1',
              state: this.tabfieldlist.state,
              rank: this.tabfieldlist.rank
            },
            this.userid
          ).then(res => {
            this.$message({
              type: 'success',
              message: this.dataSavedSuccessfully
            })
            this.getTabData()
            this.dialogVisibles = false
          })
        } else {
          this.$message({
            type: 'warning',
            message: this.requiredFieldsCannotBeEmpty
          })
        }
      })
    },
    /*
      删除字段
     */
    deleteTabField(id) {
      this.$confirm(this.areYouSureDelete, this.hint, {
        confirmButtonText: this.confirm,
        cancelButtonText: this.cancel,
        type: 'warning'
      })
        .then(() => {
          deleteTabField(id).then(res => {
            this.$message({
              type: 'success',
              message: this.successfullyDelete
            })
            this.getTabData()
          })
        })
        .catch()
    },
    // 弹出添加或者修改 字段
    addfield(item) {
      console.log(item)
      if (item) {
        this.isEdit = true
      } else {
        this.isEdit = false
      }
      let self = this
      if (self.$refs.fieldlist) {
        self.$refs.fieldlist.clearValidate()
      }
      self.fieldlist = {
        name: '',
        enname: '',
        pname: '',
        sheetname: '',
        state: '',
        id: '',
        necessary: '',
        dicttype: '',
        rank: ''
      }
      if (!item) {
        self.fieldtitle = '添加'
        if (this.activeName === 'process') {
          this.addProcessCardLabelField = this.$t('addProcessCardLabelField')
        } else {
          this.addProcessCardLabelField = '添加制度卡片标签内字段'
        }
      } else {
        if (this.activeName === 'process') {
          this.addProcessCardLabelField = this.$t('modifyProcessCardTabfield')
        } else {
          this.addProcessCardLabelField = '修改制度卡片标签内字段'
        }
        self.fieldtitle = '修改'
        self.fieldlist = {
          name: item.name,
          enname: item.enname,
          pname: item.pname,
          sheetname: item.sheetid,
          state: item.state,
          id: item.id,
          type: item.type,
          necessary: item.necessary,
          dicttype: item.dicttype,
          rank: item.rank
        }
      }
      self.dialogVisible = true
    },
    /*
      字段 弹出框确认
     */
    confirmField(formName, fieldlist) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.fieldlist.name.length > this.textMaxLength) {
            this.$message({
              type: 'warning',
              message: this.fieldNameShouldNotExceedOneHundredWords
            })
            return false
          } else if (this.fieldlist.enname.length > this.textMaxLength) {
            this.$message({
              type: 'warning',
              message: this.fieldNameShouldNotExceedOneHundredWords
            })
            return false
          } else if (this.fieldlist.pname.length > this.textMaxLength) {
            this.$message({
              type: 'warning',
              message: this.fieldNameShouldNotExceedOneHundredWords
            })
            return false
          }
          saveField({
            id: this.fieldlist.id,
            name: this.fieldlist.name,
            enname: this.fieldlist.enname,
            type: this.activeName === 'process' ? '0' : '1',
            state: this.fieldlist.state,
            sheetid: this.fieldlist.sheetname,
            pname: this.fieldlist.pname,
            necessary: this.fieldlist.necessary,
            dicttype: this.fieldlist.dicttype,
            rank: this.fieldlist.rank
          }).then(res => {
            this.$message({
              type: 'success',
              message: this.dataSavedSuccessfully
            })
            this.dialogVisible = false
            this.getData()
          })
        } else {
          this.$message({
            type: 'warning',
            message: this.requiredFieldsCannotBeEmpty
          })
        }
      })
    },
    /*
      删除字段
     */
    delField(id) {
      this.$confirm(this.areYouSureDelete, this.hint, {
        confirmButtonText: this.confirm,
        cancelButtonText: this.cancel,
        type: 'warning'
      })
        .then(() => {
          deleteField(id).then(res => {
            this.$message({
              type: 'success',
              message: this.successfullyDelete
            })
            this.getData()
          })
        })
        .catch()
    }
  }
}
</script>

<style lang="scss" scoped>
#processCard {
  box-sizing: border-box;
  height: 100%;
  padding: 10px 30px 10px 10px;
  overflow: hidden;
}
.green {
  color: green;
}

.custom-tree-node {
  // width: calc(100% - 24px);
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding-right: 60px;

  .btn {
    color: $tc5;
    padding: 1px;
    display: none;
    &:hover {
      font-weight: bold;
    }
  }

  &:hover {
    .btn {
      display: inline-block;
    }
  }
  .opertionBtn {
    margin-left: 10px;
  }
}

.el-table {
  margin-top: 15px;
}
.search_buttons_wrap {
  display: flex;
  justify-content: flex-end;
}
.search_component {
  width: 50%;
}
.el-input-number {
  /deep/ input {
    text-align: left;
  }
}
</style>
