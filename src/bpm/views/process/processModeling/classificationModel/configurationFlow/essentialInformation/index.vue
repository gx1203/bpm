<template>
  <div id="essentialInformation" v-loading="load">
    <div class="tool-common-wrap">
       <el-button type="primary" v-if="tablePid" @click="goBackNodeTable">
          {{ $t('return') }}
          <!---->
        </el-button>

      <div class="btn-wrap">
        <el-button type="primary" @click="getNodeTable">
          {{ $t('refresh') }}
          <!---->
        </el-button>
      </div>
      <el-checkbox v-if="tablePid" v-model="isPopUp" true-label="1" false-label="0" @change="popUpChange">
        {{ $t('theChildTableRowIsPopUpEdited') }}
      </el-checkbox>
      <el-checkbox v-if="tablePid" v-model="isexport" true-label="Y" false-label="N">
        {{ $t('whetherImportOrExport') }}
      </el-checkbox>  
    </div>
    <el-form ref="ruleForm">
      <div class="table">
        <div class="table-wid">
          <el-table
            v-if="tableShow"
            ref="table"
            :data="ruleForm.nodeTables"
            stripe
            :header-cell-style="{background: '#E1EAFD !important'}"
            highlight-current-row
            style="width: 100%"
            height="55vh"
          >
            <el-table-column fixed :label="$t('operation')" width="60">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  :title="$t('delete')"
                  icon="el-icon-delete"
                  @click="handleDeleteOne(scope.row, scope.$index)"
                />
                <el-button
                  v-show="scope.row.inputType === 'subtable'"
                  type="text"
                  :title="$t('addSubform')"
                  icon="el-icon-edit"
                  @click="addNode(scope.row, scope.$index)"
                />
                <el-button
                  v-show="scope.row.inputType === 'selectPeopleSingle' || scope.row.inputType === 'selectPeopleMore' || scope.row.inputType === 'selectOrganization' || scope.row.inputType === 'selectOrganizationMore'"
                  type="text"
                  :title="$t('configDataSource')"
                  icon="el-icon-edit"
                  @click="configSelectOrg(scope.row)"
                />
                <el-button
                  v-show="scope.row.inputType === 'multipleDialog' || scope.row.inputType === 'radioDialog'"
                  type="text"
                  :title="$t('configDataSource')"
                  icon="el-icon-edit"
                  @click="configSelectTab(scope.row, scope.$index)"
                />
                <el-button
                  v-show="scope.row.isCalculation === '1' && (scope.row.inputType === 'number' || scope.row.inputType === 'double')"
                  type="text"
                  :title="$t('calculateConfig')"
                  icon="el-icon-edit"
                  @click="configSelectCalculate(scope.row, scope.$index)"
                />
                <el-button
                  v-show="scope.row.inputType === 'process'"
                  type="text"
                  :title="$t('processDecumentsConfig')"
                  icon="el-icon-edit"
                  @click="configSelectProcess(scope.row, scope.$index)"
                />
                <el-button
                  v-show="scope.row.inputType === 'file'"
                  type="text"
                  :title="$t('defaultFileConfig')"
                  icon="el-icon-edit"
                  @click="configSelectFile(scope.row, scope.$index)"
                />
                <el-checkbox v-show="isShow" v-model="scope.row.checked" />
              </template>
            </el-table-column>
            <el-table-column fixed width="80">
              <template slot="header" slot-scope="scope">
                <span class="red">*</span>{{ $t('index') }}
              </template>
              <template slot-scope="scope">
                <el-input v-model="scope.row.sort" type="number" onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" min="1" @input="checkVal(scope.$index,'sort')" />
              </template>
            </el-table-column>
            <el-table-column width="120">
              <template slot="header" slot-scope="scope">
                <span class="red">*</span>{{ $t('fieldName') }}
              </template>
              <template slot-scope="scope">
                <el-input v-model="scope.row.fieldName" clearable @blur="checkName(scope.$index)" />
              </template>
            </el-table-column>
            <el-table-column prop="inputType" width="120">
              <template slot="header" slot-scope="scope">
                <span class="red">*</span>{{ $t('fieldType') }}
              </template>
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.inputType"
                  clearable
                  @change="inputTypeHandle(scope.row.inputType,scope.$index)"
                >
                  <el-option
                    v-for="item in typeList"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                    :disabled="item.disabled"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column width="120">
              <template slot="header" slot-scope="scope">
                <span class="red">*</span>{{ $t('fieldLength') }}
              </template>
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.length"
                  clearable
                  type="number"
                  min="1"
                  onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
                  @input="checkVal(scope.$index,'length')"
                />
              </template>
            </el-table-column>
            <el-table-column fixed width="140">
              <template slot="header" slot-scope="scope">
                <span class="red">*</span>{{ $t('showName') }}
              </template>
              <template slot-scope="scope">
                <el-input v-model="scope.row.fieldShowName" clearable />
              </template>
            </el-table-column>

            <el-table-column width="120">
              <template slot="header" slot-scope="scope">
                <span class="red">*</span>{{ $t('howManyColumns') }}
              </template>
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.inputcolspan"
                  clearable
                  type="number"
                  min="1"
                  onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
                  @input="checkVal(scope.$index,'inputcolspan')"
                />
              </template>
            </el-table-column>
            <el-table-column width="120">
              <template slot="header" slot-scope="scope">
                <span class="red">*</span>{{ $t('isitRequired') }}
              </template>
              <template slot-scope="scope">
                <el-select v-model="scope.row.isrequired" clearable>
                  <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </template>
            </el-table-column>

            <el-table-column :label="$t('editable')" width="120">
              <template slot-scope="scope">
                <el-select v-model="scope.row.isedit" clearable>
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column v-if="tablePid" :label="$t('whetherTheListIsDisplayed')" width="120">
              <template slot-scope="scope">
                <el-select v-model="scope.row.isShowColumn" clearable :disabled="isPopUp !== '1'">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column :label="$t('fillingExplanation')" width="120">
              <template slot-scope="scope">
                <el-input v-model="scope.row.tips" readonly @click.native="tipsDialogShow(scope.$index)" />
              </template>
            </el-table-column>
            <el-table-column width="120">
              <template slot="header" slot-scope="scope">
                <span class="red">*</span>{{ $t('whetherTheCascade') }}
              </template>
              <template slot-scope="scope">
                <el-select v-model="scope.row.ishighLink">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column :label="$t('parentLinkageFieldName')" width="180">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.highLinkField"
                  multiple
                  @focus="cascadeFocus(scope.row)"
                  @change="highLinkFieldChange($event, scope.row)"
                >
                  <el-option v-for="(item, index) in cascadeOptions" :key="index" :label="item.fieldShowName" :value="item.fieldName" :disabled="scope.row.fieldName === item.fieldName" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column :label="$t('toLock')" width="120">
              <template slot-scope="scope">
                <el-select v-model="scope.row.islock" :disabled="!tablePid" @change="lockChange($event, scope.$index)">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column :label="$t('whetherTheCalculate')" width="120">
              <template slot-scope="scope">
                <el-select v-model="scope.row.isCalculation" :disabled="scope.row.inputType !== 'number' && scope.row.inputType !== 'double'">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column :label="$t('columnTotal')" width="120">
              <template slot-scope="scope">
                <el-select v-model="scope.row.issum" :disabled="!tablePid || (scope.row.inputType !== 'number' && scope.row.inputType !== 'double')">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column :label="$t('promptMessage')" width="120">
              <template slot-scope="scope">
                <el-input v-model="scope.row.placeholder" clearable />
              </template>
            </el-table-column>
            <el-table-column width="120">
              <template slot="header" slot-scope="scope">
                <span class="red">*</span>{{ $t('tableName') }}
              </template>
              <template slot-scope="scope">
                <el-input v-model="scope.row.relationType" clearable />
              </template>
            </el-table-column>

            <el-table-column :label="$t('exportTemplateDefaultValues')" width="200">
              <template slot-scope="scope">
                <el-input v-model="scope.row.templateValue" clearable :disabled="!tablePid" />
              </template>
            </el-table-column>

            <el-table-column :label="$t('defaults')" width="300">
              <template slot-scope="scope">
                <el-input v-if="scope.row.inputType==='number'" v-model.number="scope.row.defaultvalue" clearable />
                <el-input
                  v-else-if="scope.row.inputType==='double' || scope.row.inputType==='rate'"
                  v-model="scope.row.defaultvalue"
                  clearable
                  type="number"
                  onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
                />
                <el-input v-else v-model="scope.row.defaultvalue" clearable />
              </template>
            </el-table-column>

            <el-table-column :label="$t('customWidth')" width="120">
              <template slot-scope="scope">
                <el-input v-model="scope.row.width" clearable type="number" min="10" onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" @blur="checkVal(scope.$index,'width')" />
              </template>
            </el-table-column>
            <el-table-column :label="$t('maxWidth')" width="120">
              <template slot-scope="scope">
                <el-input v-model="scope.row.maxWidth" clearable type="number" min="50" onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" @blur="checkVal(scope.$index,'maxWidth')" />
              </template>
            </el-table-column>

            <el-table-column width="120">
              <template slot="header" slot-scope="scope">
                <span class="red">*</span>{{ $t('controlFlow') }}
              </template>
              <template slot-scope="scope">
                <el-select v-model="scope.row.necessary" clearable>
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </template>
            </el-table-column>

            <el-table-column :label="$t('participateInTheTest')" width="120">
              <template slot-scope="scope">
                <el-select v-model="scope.row.ishidden" clearable>
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column :label="$t('dataSources')" width="120">
              <template slot-scope="scope">
                <el-input v-model="scope.row.datasource" clearable readonly @click.native="showDialog(scope.$index)" />
              </template>
            </el-table-column>
            <el-table-column :label="$t('deleteDataSource')" width="100">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  :title="$t('deleteDataSource')"
                  icon="el-icon-delete"
                  @click="dleDatasource(scope.$index)"
                />
              </template>
            </el-table-column>
            <el-table-column :label="$t('jsEvent')" width="120">
              <template slot-scope="scope">
                <el-input v-model="scope.row.event" clearable />
              </template>
            </el-table-column>
            <el-table-column :label="$t('jsEventType')" width="120">
              <template slot-scope="scope">
                <el-input v-model="scope.row.eventtype" clearable />
              </template>
            </el-table-column>
            <el-table-column :label="$t('numberOfOptions')" width="120">
              <template slot-scope="scope">
                <el-input v-model="scope.row.labelcolspan" clearable />
              </template>
            </el-table-column>
            <el-table-column :label="$t('customStyle')" width="120">
              <template slot-scope="scope">
                <el-input v-model="scope.row.classname" clearable />
              </template>
            </el-table-column>
            <el-table-column :label="$t('customStyleVersionNumber')" width="120">
              <template slot-scope="scope">
                <el-input v-model="scope.row.classstyle" clearable />
              </template>
            </el-table-column>
            <el-table-column :label="$t('operation')" width="60">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  :title="$t('delete')"
                  icon="el-icon-delete"
                  @click="handleDeleteOne(scope.row, scope.$index)"
                />
                <el-button
                  v-show="scope.row.inputType === 'subtable'"
                  type="text"
                  :title="$t('addSubform')"
                  icon="el-icon-edit"
                  @click="addNode(scope.row, scope.$index)"
                />
                <el-button
                  v-show="scope.row.inputType === 'selectPeopleSingle' || scope.row.inputType === 'selectPeopleMore' || scope.row.inputType === 'selectOrganization' || scope.row.inputType === 'selectOrganizationMore'"
                  type="text"
                  :title="$t('configDataSource')"
                  icon="el-icon-edit"
                  @click="configSelectOrg(scope.row)"
                />
                <el-button
                  v-show="scope.row.inputType === 'multipleDialog' || scope.row.inputType === 'radioDialog'"
                  type="text"
                  :title="$t('configDataSource')"
                  icon="el-icon-edit"
                  @click="configSelectTab(scope.row, scope.$index)"
                />
                <el-button
                  v-show="scope.row.isCalculation === '1' && (scope.row.inputType === 'number' || scope.row.inputType === 'double')"
                  type="text"
                  :title="$t('calculateConfig')"
                  icon="el-icon-edit"
                  @click="configSelectCalculate(scope.row, scope.$index)"
                />
                <el-button
                  v-show="scope.row.inputType === 'process'"
                  type="text"
                  :title="$t('processDecumentsConfig')"
                  icon="el-icon-edit"
                  @click="configSelectProcess(scope.row, scope.$index)"
                />
                <el-button
                  v-show="scope.row.inputType === 'file'"
                  type="text"
                  :title="$t('defaultFileConfig')"
                  icon="el-icon-edit"
                  @click="configSelectFile(scope.row, scope.$index)"
                />
              </template>
            </el-table-column>
            <el-table-column :label="$t('remarks')" width="120">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remark" clearable />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-form>
    <div class="text-r">
      <el-button type="primary" @click="addFormList">
        {{ $t('addField') }}
        
      </el-button>
      <el-button type="primary" @click="submit">
        {{ $t('commitAndBuildTheLibrary') }}
      </el-button>
      <!-- <el-button type="primary" @click="initData">
        {{ $t('generateLibrary') }}
      </el-button> -->
      <el-button type="primary" @click="addShow = true">
        {{ $t('fieldLibraryAdded') }}
        
      </el-button>
      <el-cascader
        v-show="isShow"
        v-model="checkTabId"
        :options="selectList"
        class="w100"
        :show-all-levels="false"
        :props="{ checkStrictly: true ,value:'id',label:'value1',children:'child'}"
      />
      <el-button type="primary" @click="replaceTab">
        <span v-show="!isShow">
          {{ $t('replaceTabPage') }}
        </span>
        <span v-show="isShow">
          {{ $t('confirmReplacement') }}
        </span>
      </el-button>
    </div>
    <dictionaryDialog v-model="dialogShow" :item="datasource" @confirm="getDictionary" />
    <addDialog v-model="addShow" :add-word-list="addWordList" @confirm="getAddData" />
    <addOption v-model="addOptionShow" :opt-data="optData" />
    <AddtipsDialog
      v-model="tipsDialog"
      :content="tipsContent"
      :title="$t('fillingExplanation')"
      @confirm="getTipsContent"
    />
    <orgDataSource v-model="orgDataSourcedialog" :item-data="itemData" @confirm="handlerOrgDataSource" />
    <tableConfig v-model="tableConfigdialog" :item-data="itemData" :node-id="ruleForm.nodeId" @confirm="handlertableConfig" />
    <columnTotalConfig v-model="columnTotalDialog" :item-data="itemData" :node-id="ruleForm.nodeId" @confirm="handlerColumnTotal" :mainTableName="ruleForm.tableName" />
    <processDocumentsConfig v-model="processDocumentsDialog" :item-data="itemData" :node-id="ruleForm.nodeId" @confirm="handlerProcessDocuments" />
    <defaultFileConfig v-model="defaultFileDialog" :item-data="itemData" :node-id="ruleForm.nodeId" @confirm="handlerDefaultFile" />
  </div>
</template>
<script>
import dictionaryDialog from './dictionaryDialog'
import addDialog from './addDialog'
import addOption from './addOption'
import AddtipsDialog from '../flowNode/AddtipsDialog'
import orgDataSource from '@/bpm/components/orgDataSource'
import tableConfig from '@/bpm/components/tableDialog/tableConfig'
import columnTotalConfig from '@/bpm/components/columnTotalConfig'
import processDocumentsConfig from '@/bpm/components/processDocumentsConfig'
import defaultFileConfig from '@/bpm/components/defaultFileConfig'
import {
  initDataSourceColumn,
  getProcessNodeTable,
  saveProcessNodeTable,
  deleteProcessNodeTable,
  getDictionaryOption,
  checkFieldKey,
  getTabTree,
  updateTableToTab
} from '@/bpm/api/process/processModeling/classificationModel'
export default {
  name: 'EssentialInformation',
  components: {
    dictionaryDialog,
    addDialog,
    addOption,
    AddtipsDialog,
    orgDataSource,
    tableConfig,
    columnTotalConfig,
    processDocumentsConfig,
    defaultFileConfig
  },
  props: {
    treeData: {
      type: Object
    }
  },
  data() {
    return {
      tipsDialog: false,
      tipsContent: '',
      tipsIndex: '',
      load: false,
      dialogShow: false,
      optData: {},
      addOptionShow: false,
      addShow: false,
      orgDataSourcedialog: false,
      tableConfigdialog: false,
      columnTotalDialog: false,
      processDocumentsDialog: false,
      defaultFileDialog: false,
      ruleForm: {},
      initFormList: [],
      options: [
        {
          value: '1',
          label: this.$t('yes')
        },
        {
          value: '0',
          label: this.$t('no')
        }
      ],
      options1: [
        {
          value: 'required',
          label: this.$t('yes')
        },
        {
          value: 'N',
          label: this.$t('no')
        }
      ],
      typeList: [],
      datasource: '',
      versions: [],
      checkIndex: '',
      checkTabIndex: '',
      tablePid: '',
      isChild: '',
      selectList: [],
      isShow: false,
      checkTabId: '',
      addWordList: [],
      tableShow: true,
      itemData: {}, // 当前选中行
      cascadeOptions: [], // 上级级联数据列表
      nodeTabs: [],
      isexport: 'N', // 是否导入导出
      isPopUp: '0', // 是否子表行弹出编辑
      nodeTabsInfo:{
        nodeTabId: "",
        tablePid: ""
      }
    }
  },
  computed: {},
  watch: {
    treeData(val) {
      this.tablePid = ''
      this.isChild = ''
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
      this.$refs.table.doLayout()
      this.getNodeTable()
      this.typeList.forEach(element => {
        element.disabled = false
      })
    }
  },
  mounted() {
    this.nodeTabsInfo.nodeTabId = this.treeData.id
    this.nodeTabsInfo.tablePid = this.tablePid
    this.nodeTabsInfo = { ...this.nodeTabsInfo }
    this.getNodeTable()
    getDictionaryOption({
      dictionaryen: 'subparagraphType'
    }).then(rt => {
      rt.data.forEach(element => {
        element.disabled = false
      })
      this.typeList = rt.data
    })
  },
  methods: {
    popUpChange(item) {
      if (item === '0') {
        this.ruleForm.nodeTables.forEach((val, i) => {
          val.isShowColumn = ''
        })
      }
    },
    lockChange(item, index) {
      if (item === '1') {
        this.ruleForm.nodeTables.forEach((val, i) => {
          if (index !== i) {
            val.islock = '0'
          }
        })
      }
    },
    cascadeFocus(val) {
      this.cascadeOptions = this.ruleForm.nodeTables.filter(item => {
        return item.fieldName && (item.inputType !== 'subtable' || item.inputType !== 'treetable')
      })
    },
    highLinkFieldChange(val, item) {
      const highLinkFieldName = this.cascadeOptions.filter(e => val.includes(e.fieldName)).map(e => e.fieldShowName)
      this.$set(item, 'highLinkFieldName', highLinkFieldName)
    },
    tipsDialogShow(i) {
      const data = Object.assign({}, this.ruleForm.nodeTables[i])
      this.tipsContent = data.tips
      this.tipsIndex = i
      this.tipsDialog = true
    },
    getTipsContent(data) {
      this.$set(this.ruleForm.nodeTables[this.tipsIndex], 'tips', data)
    },
    replaceTab() {
      this.isShow = true
      if (this.isShow) {
        const arr = this.ruleForm.nodeTables.filter(x => x.checked)
        const tableIds = arr.map(x => x.id)
        if (!this.checkTabId) {
          this.$message(this.$t('hintText.pleaseSelectTheTabLabelToBeReplaced'))
          return
        }
        if (tableIds.length < 1) {
          this.$message(this.$t('hintText.pleaseSelectTheFieldToBeReplaced'))
          return
        }
        this.load = true
        updateTableToTab({
          tabId: this.checkTabId[this.checkTabId.length - 1],
          tableIds: tableIds
        })
          .then(rt => {
            this.load = false
            if (rt.status === '200') {
              this.$message.success(this.$t('hintText.addedSuccess'))
              this.getNodeTable()
            }
          })
          .catch(er => {
            this.load = false
          })
      }
    },
    checkVal(index, name) {
      if (name === 'sort' && this.ruleForm.nodeTables[index].sort < '1') {
        this.ruleForm.nodeTables[index].sort = 1
      } else if (
        name === 'length' &&
        this.ruleForm.nodeTables[index].length < '1'
      ) {
        this.ruleForm.nodeTables[index].length = 1
      } else if (
        name === 'inputcolspan' &&
        this.ruleForm.nodeTables[index].inputcolspan < '1'
      ) {
        this.ruleForm.nodeTables[index].inputcolspan = 1
      } else if (
        name === 'width' && this.ruleForm.nodeTables[index].width &&
        this.ruleForm.nodeTables[index].width < 10
      ) {
        this.ruleForm.nodeTables[index].width = 10
      } else if (
        name === 'maxWidth' && this.ruleForm.nodeTables[index].maxWidth &&
        this.ruleForm.nodeTables[index].maxWidth < 50
      ) {
        this.ruleForm.nodeTables[index].maxWidth = 50
      }
    },
    checkName(index) {
      this.ruleForm.nodeTables[index].fieldName = this.ruleForm.nodeTables[
        index
      ].fieldName.toUpperCase()
      const reg = /(^_([a-zA-Z0-9]_?)*$)|(^[a-zA-Z](_?[a-zA-Z0-9])*_?$)/
      if (!reg.test(this.ruleForm.nodeTables[index].fieldName)) {
        this.ruleForm.nodeTables[index].fieldName = ''
        this.$message(this.$t('hintText.cannotEnterChineseCharactersAndSomeSpecialSymbols'))
        return
      }
      checkFieldKey(this.ruleForm.nodeTables[index].fieldName).then(rt => {
        if (rt.data === 'Y') {
          this.ruleForm.nodeTables[index].fieldName = ''
          this.$message.error(this.$t('hintText.theFieldIsNamedKeywordPleaseReRnter'))
        }
      })
    },
    addOption(item) {
      this.optData = item
      this.optData.treeId = this.treeData.id
      this.addOptionShow = true
    },
    addNode(item, index) {
      this.isChild = item.inputType
      this.tablePid = item.id
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
      this.$refs.table.doLayout()
      this.getNodeTable()
      this.typeList.forEach(element => {
        if (element.value === 'ckeditor' || element.value === 'file') {
          element.disabled = this.isChild === 'subtable'
        }
      })
    },
    inputTypeHandle(item, index) {
      const initFormList = JSON.parse(JSON.stringify(this.initFormList))
      if (initFormList[index]) {
        if (
          item === 'time' ||
          item === 'date' ||
          item === 'date-edit' ||
          item === 'time-edit'
        ) {
          if (
            initFormList[index].inputType !== 'time' &&
            initFormList[index].inputType !== 'time-edit' &&
            initFormList[index].inputType !== 'date-edit' &&
            initFormList[index].inputType !== 'date'
          ) {
            this.$message.error(this.$t('hintText.DataTypeChangedPleasePerformRelatedOperationsDatabase'))
          }
        } else {
          if (
            initFormList[index].inputType === 'time' ||
            initFormList[index].inputType === 'time-edit' ||
            initFormList[index].inputType === 'date-edit' ||
            initFormList[index].inputType === 'date'
          ) {
            this.$message.error(this.$t('hintText.DataTypeChangedPleasePerformRelatedOperationsDatabase'))
          }
        }
      }
      if (item !== 'number' && item !== 'double') {
        this.$set(this.ruleForm.nodeTables[index], 'isCalculation', '0')
        this.$set(this.ruleForm.nodeTables[index], 'issum', '0')
      }
    },
    checkField() {
      this.nodeTabs = JSON.parse(JSON.stringify(this.ruleForm.nodeTables))
      this.nodeTabs.forEach(item => {
        if (item.calculationDtos && item.calculationDtos.length > 0) {
          item.calculationDtos.forEach(el => {
            delete el.fieldCnname
          })
        }
      })
      let flag = false
      let flag1 = false
      this.nodeTabs.forEach(element => {
        if (!element.processversion || element.processversion.length < 1) {
          element.processversion = null
        }
        if (!element.fieldName || !element.length || !element.relationType) {
          flag = true
        }
        if (element.highLinkField) {
          element.highLinkField = element.highLinkField.join(',')
        }
        if (element.highLinkFieldName) {
          element.highLinkFieldName = element.highLinkFieldName.join(',')
        }
        if (element.inputType === 'multipleDialog' || element.inputType === 'radioDialog') {
          if (!element.nodeColumnDtos || element.nodeColumnDtos.length < 1) {
            flag1 = true
          }
        }
      })
      if (flag) {
        this.$message(this.$t('hintText.fieldNameFieldLengthTableNameCannotBeEmpty'))
        return false
      }
      if (flag1) {
        this.$message(this.$t('dataSourcePrompt'))
        return false
      }
      for (let index = 0; index < this.nodeTabs.length; index++) {
        if (this.nodeTabs[index].sort && String(this.nodeTabs[index].sort).length > 10) {
          this.$message.error(`索引${this.nodeTabs[index].sort}索引超长！！`)
          return false
        } else if (this.nodeTabs[index].length && this.nodeTabs[index].length.length > 100) {
          this.$message.error(`索引${this.nodeTabs[index].sort}字段长度超长！！`)
          return false
        } else if (this.nodeTabs[index].fieldShowName && this.nodeTabs[index].fieldShowName.length > 20) {
          this.$message.error(`索引${this.nodeTabs[index].sort}显示文本超长！！`)
          return false
        } else if (this.nodeTabs[index].relationType && this.nodeTabs[index].relationType.length > 200) {
          this.$message.error(`索引${this.nodeTabs[index].sort}表名称超长！！`)
          return false
        } else if (this.nodeTabs[index].inputcolspan && this.nodeTabs[index].inputcolspan.length > 10) {
          this.$message.error(`索引${this.nodeTabs[index].sort}占几列超长！！`)
          return false
        } else if (this.nodeTabs[index].event && this.nodeTabs[index].event.length > 50) {
          this.$message.error(`索引${this.nodeTabs[index].sort}js事件超长！！`)
          return false
        } else if (this.nodeTabs[index].eventtype && this.nodeTabs[index].eventtype.length > 50) {
          this.$message.error(`索引${this.nodeTabs[index].sort}js事件类型超长！！`)
          return false
        } else if (this.nodeTabs[index].remark && this.nodeTabs[index].remark.length > 10) {
          this.$message.error(`索引${this.nodeTabs[index].sort}备注超长！！`)
          return false
        } else if (this.nodeTabs[index].labelcolspan && this.nodeTabs[index].labelcolspan.length > 10) {
          this.$message.error(`索引${this.nodeTabs[index].sort}选项个数超长！！`)
          return false
        }
      }
      if (this.tablePid && this.isPopUp === '1' && this.nodeTabs.filter(item => item.isShowColumn === '1').length === 0) {
        this.$message.error(`是否列表显示至少有一个字段为是`)
        return false
      }
      for (let i = 0, len = this.nodeTabs.length; i < len; i++) {
        if (this.nodeTabs[i].ishighLink === '1' && !this.nodeTabs[i].highLinkField) {
          this.$message.error(`索引${this.nodeTabs[i].sort}：上级联动字段名不能为空`)
          return false
        }
        if (this.nodeTabs[i].inputType === 'process' && (!this.nodeTabs[i].nodeProcessDtos || this.nodeTabs[i].nodeProcessDtos.length === 0)) {
          this.$message.error(this.$t('hintText.pleaseSelectTheProcessInTheProcessDocumentConfigurationPage'))
          return false
        }
      }
      return true
    },
    goBackNodeTable(){
      this.tablePid = ""
      this.load = true
      this.versions = []
      this.versions.push({
        label: this.$t('noVersionNumber'),
        value: ''
      })
      getProcessNodeTable({
        nodeTabId: this.nodeTabsInfo.nodeTabId,
        tablePid: this.nodeTabsInfo.tablePid,
        version: this.treeData.version
      })
        .then(rt => {
          this.load = false
          if (rt.status === '200') {
            // this.nodeTabsInfo = rt.data
            rt.data.nodeTables.forEach(element => {
              element.checked = false
              if (element.highLinkField) {
                element.highLinkField = element.highLinkField.split(',')
              }
              if (element.highLinkFieldName) {
                element.highLinkFieldName = element.highLinkFieldName.split(',')
              }
            })
            this.initFormList = JSON.parse(JSON.stringify(rt.data.nodeTables))
            this.ruleForm = rt.data
            if (this.nodeTabsInfo.tablePid) {
              this.isexport = rt.data.export
              this.isPopUp = rt.data.isPopUp
            }
            this.cascadeOptions = this.ruleForm.nodeTables
            this.isShow = false
            this.checkTabId = ''
            this.$nextTick(() => {
              this.$refs.table.doLayout()
            })
            getTabTree(rt.data.nodeId).then(res => {
              if (res.status === '200') {
                this.selectList = res.data
              }
            })
            if (rt.data.versions && rt.data.versions.length > 0) {
              rt.data.versions.forEach(element => {
                this.versions.push({
                  label: element,
                  value: element
                })
              })
            }
          }
        })
        .catch(er => {
          this.load = false
        })
    },
    getNodeTable() {
      this.load = true
      this.versions = []
      this.versions.push({
        label: this.$t('noVersionNumber'),
        value: ''
      })
      getProcessNodeTable({
        nodeTabId: this.treeData.id,
        tablePid: this.tablePid
      })
        .then(rt => {
          this.load = false
          if (rt.status === '200') {
            rt.data.nodeTables.forEach(element => {
              element.checked = false
              if (element.highLinkField) {
                element.highLinkField = element.highLinkField.split(',')
              }
              if (element.highLinkFieldName) {
                element.highLinkFieldName = element.highLinkFieldName.split(',')
              }
            })
            this.initFormList = JSON.parse(JSON.stringify(rt.data.nodeTables))
            this.ruleForm = rt.data
            if (this.tablePid) {
              this.isexport = rt.data.export
              this.isPopUp = rt.data.isPopUp
            }
            this.cascadeOptions = this.ruleForm.nodeTables
            this.isShow = false
            this.checkTabId = ''
            this.$nextTick(() => {
              this.$refs.table.doLayout()
            })
            getTabTree(rt.data.nodeId, {
              version: this.treeData.version
            }).then(res => {
              if (res.status === '200') {
                this.selectList = res.data
              }
            })
            if (rt.data.versions && rt.data.versions.length > 0) {
              rt.data.versions.forEach(element => {
                this.versions.push({
                  label: element,
                  value: element
                })
              })
            }
          }
        })
        .catch(er => {
          this.load = false
        })
    },
    initData() {
      if (!this.checkField()) {
        return false
      }
      this.load = true
      initDataSourceColumn({
        formId: this.ruleForm.formId,
        nodeTabId: this.ruleForm.nodeTabId,
        nodeTables: this.nodeTabs,
        tablePid: this.tablePid,
        export: this.tablePid ? this.isexport : '',
        isPopUp: this.tablePid ? this.isPopUp : '',
        version: this.treeData.version
      })
        .then(rt => {
          this.load = false
          if (rt.status === '200') {
            this.$message.success(this.$t('hintText.addedSuccess'))
          }
        })
        .catch(er => {
          this.load = false
        })
    },
    submit() {
      if (!this.checkField()) {
        return false
      }
      this.load = true
      saveProcessNodeTable({
        formId: this.ruleForm.formId,
        nodeTabId: this.ruleForm.nodeTabId,
        nodeTables: this.nodeTabs,
        tablePid: this.tablePid,
        export: this.tablePid ? this.isexport : '',
        isPopUp: this.tablePid ? this.isPopUp : '',
        version: this.treeData.version
      })
        .then(rt => {
          this.load = false
          if (rt.status === '200') {
            this.$message.success(this.$t('hintText.submittedSuccessfully'))
            this.getNodeTable()
            this.initData()
          }
        })
        .catch(er => {
          this.load = false
        })
    },
    // 删除字段
    handleDeleteOne(item, index) {
      if (item.id) {
        this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
          type: 'warning'
        })
          .then(() => {
            deleteProcessNodeTable({
              tableId: item.id
            })
              .then(rt => {
                if (rt.status === '200') {
                  this.ruleForm.nodeTables.forEach(el => {
                    if (el.highLinkField) {
                      const i = el.highLinkField.indexOf(item.fieldName)
                      if (i > -1) {
                        el.highLinkField.splice(i, 1)
                        el.highLinkFieldName.splice(i, 1)
                      }
                    }
                  })
                  this.ruleForm.nodeTables.splice(index, 1)
                }
              })
              .catch(er => {
                this.load = false
              })
          })
          .catch(_ => { })
      } else {
        this.ruleForm.nodeTables.forEach(el => {
          if (el.highLinkField) {
            const i = el.highLinkField.indexOf(item.fieldName)
            if (i > -1) {
              el.highLinkField.splice(i, 1)
              el.highLinkFieldName.splice(i, 1)
            }
          }
        })
        this.ruleForm.nodeTables.splice(index, 1)
      }
    },
    // 添加字段
    addFormList() {
      let relationType = this.isChild !== 'subtable' ? this.ruleForm.tableName : this.isChild === 'subtable' && this.ruleForm.nodeTables.length > 0 ? this.ruleForm.nodeTables[0].relationType : ''
      this.ruleForm.nodeTables.push({
        inputcolspan: '1',
        necessary: '0',
        ishidden: '1',
        isrequired: 'N',
        ishighLink: '0',
        islock: '0',
        isCalculation: '0',
        issum: '0',
        isedit: '1',
        inputType: 'text',
        length: 200,
        sort: (this.ruleForm.nodeTables.length + 1) * 10,
        relationType: relationType
      })
    },
    showDialog(i) {
      this.checkIndex = i
      this.datasource = this.ruleForm.nodeTables[this.checkIndex].datasource
      this.dialogShow = true
    },
    dleDatasource(i) {
      this.ruleForm.nodeTables[i].datasource = ''
    },
    getDictionary(data) {
      this.$set(this.ruleForm.nodeTables[this.checkIndex], 'datasource', data.dictionaryen)
    },
    getAddData(data) {
      this.addWordList = data
      this.addWordList.forEach(element => {
        delete element.id
        element.inputcolspan = '1'
        element.necessary = '0'
        element.ishidden = '1'
        element.isedit = '1'
        element.sort = (this.ruleForm.nodeTables.length + 1) * 10
        element.relationType =
          this.isChild === 'subtable' ? '' : this.ruleForm.tableName

        this.ruleForm.nodeTables.push(element)
      })
      this.submit()
    },
    configSelectOrg(item) {
      if (!item.id) {
        this.$message.error(this.$t('hintText.pleaseSubmitTheFormInformationFirst'))
        return
      }
      this.itemData = JSON.parse(JSON.stringify(item))
      this.orgDataSourcedialog = true
    },
    configSelectTab(item, i) {
      // if (!item.id) {
      //   this.$message.error(this.$t('hintText.pleaseSubmitTheFormInformationFirst'));
      //   return
      // }
      this.checkTabIndex = i
      this.itemData = JSON.parse(JSON.stringify(item))
      this.tableConfigdialog = true
    },
    configSelectCalculate(item, i) {
      this.checkTabIndex = i
      this.itemData = JSON.parse(JSON.stringify(item))
      this.columnTotalDialog = true
    },
    configSelectProcess(item, i) {
      this.checkTabIndex = i
      this.itemData = JSON.parse(JSON.stringify(item))
      this.processDocumentsDialog = true
    },
    configSelectFile(item, i) {
      this.checkTabIndex = i
      this.itemData = JSON.parse(JSON.stringify(item))
      this.defaultFileDialog = true
    },
    handlerOrgDataSource() {
    },
    handlertableConfig(data) {
      this.ruleForm.nodeTables[this.checkTabIndex].saveField = data.saveField
      this.ruleForm.nodeTables[this.checkTabIndex].showField = data.showField
      this.ruleForm.nodeTables[this.checkTabIndex].titleName = data.titleName
      this.ruleForm.nodeTables[this.checkTabIndex].titleTable = data.titleTable
      this.ruleForm.nodeTables[this.checkTabIndex].nodeColumnDtos = data.nodeColumnDtos
      console.log(this.ruleForm.nodeTables)
    },
    handlerColumnTotal(list) {
      this.$set(this.ruleForm.nodeTables[this.checkTabIndex], 'calculationDtos', list)
    },
    handlerProcessDocuments(data) {
      this.$set(this.ruleForm.nodeTables[this.checkTabIndex], 'datascope', data.datascope)
      this.$set(this.ruleForm.nodeTables[this.checkTabIndex], 'nodeProcessDtos', data.nodeProcessDtos)
    },
    handlerDefaultFile(list) {
      this.$set(this.ruleForm.nodeTables[this.checkTabIndex], 'nodeDefaultDocDtos', list)
    }
  }
}
</script>
<style lang="scss">
#essentialInformation {
  .el-form-item__content {
    padding: 7px;
  }
  .el-table__fixed {
    height: calc(100% - 10px) !important;
  }
  .el-input__inner {
    border: none;
    border-bottom: 1px solid $dc1;
  }
  .text-r {
    button {
      margin: 15px 10px;
    }
  }
}
</style>
<style lang="scss" scoped>
#essentialInformation {
  .tool-common-wrap {
    margin-bottom: 10px;
    .el-checkbox {
      float: right;
      line-height: 24px;
      margin-right: 10px;
      /deep/ .el-checkbox__label {
        padding-left: 5px;
      }
    }
  }
  .red {
    color: red;
    vertical-align: sub;
  }
  .header {
    font-size: 12px;
    color: $tc1;
    background: $bc2;
    margin-top: 20px;
    .el-col {
      padding: 10px;
    }
  }
}
</style>
