<template>
  <div v-loading="load" class="root">
    <div class="left">
      <div v-show="isLRShow">
        <el-row :gutter="15" align="center">
          <el-collapse v-model="activeNames">
            <el-collapse-item :title="$t('layoutControl')" name="1">
              <draggable
                v-model="form_list"
                :clone="cloneData"
                :options="dragOptions1"
                @start="tabstart"
                @end="draggableEnd"
              >
                <el-col
                  v-for="(item, index) in form_list"
                  :key="index"
                  :span="12"
                  style="margin:5px 0;"
                >
                  <el-button class="textHide btn" plain>
                    {{ item.name }}
                  </el-button>
                </el-col>
              </draggable>
            </el-collapse-item>
            <el-collapse-item :title="$t('formControl')" name="2">
              <draggable
                v-model="input_list"
                :clone="cloneData"
                :options="dragOptions3"
                @start="start"
                @end="draggableEnd"
              >
                <el-col
                  v-for="(item, index) in input_list"
                  :key="index"
                  :span="12"
                  style="margin:5px 0;"
                >
                  <el-button class="textHide btn" plain>
                    {{ item.name }}
                  </el-button>
                </el-col>
              </draggable>
            </el-collapse-item>
            <el-collapse-item :title="$t('dateControl')" name="3">
              <draggable
                v-model="date_list"
                :clone="cloneData"
                :options="dragOptions3"
                @start="startDate"
                @end="draggableEnd"
              >
                <el-col
                  v-for="(item, index) in date_list"
                  :key="index"
                  :span="12"
                  style="margin:5px 0;"
                >
                  <el-button class="textHide btn" plain>
                    {{ item.name }}
                  </el-button>
                </el-col>
              </draggable>
            </el-collapse-item>
            <el-collapse-item
              :title="$t('selectionAndOrganizationOfControls')"
              name="4"
            >
              <draggable
                v-model="org_list"
                :clone="cloneData"
                :options="dragOptions3"
                @start="startOrg"
                @end="draggableEnd"
              >
                <el-col
                  v-for="(item, index) in org_list"
                  :key="index"
                  :span="12"
                  style="margin:5px 0;"
                >
                  <el-button class="textHide btn" plain>
                    {{ item.name }}
                  </el-button>
                </el-col>
              </draggable>
            </el-collapse-item>

            <!-- 其他控件 -->
            <el-collapse-item :title="$t('OtherControls')" name="4">
              <draggable
                v-model="Other_list"
                :clone="cloneData"
                :options="dragOptions3"
                @start="startOther"
                @end="draggableEnd"
              >
                <el-col
                  v-for="(item, index) in Other_list"
                  :key="index"
                  :span="12"
                  style="margin:5px 0;"
                >
                  <el-button class="textHide btn" plain>
                    {{ item.name }}
                  </el-button>
                </el-col>
              </draggable>
            </el-collapse-item>
          </el-collapse>
        </el-row>
      </div>
    </div>
    <div class="center info pos-relative">
      <el-card shadow="always">
        <div v-show="formType !== 'subTableDetail'" class="head-content">
          <div class="title">
            <div>
              <div class="logo">
                <img class="logo" :src="logo" alt />
              </div>
              <div class="title-text">
                {{ node.processShowName }}
              </div>
            </div>
          </div>
        </div>
        <div id="form" class="content">
          <div v-show="formType !== 'subTableDetail'" ref="card1" class="card1">
            <div class="header">
              <span class="title"> {{ $t('applicantInformation') }}</span>
              <div class="space" />
              <el-button type="text" @click="expand = !expand">
                {{ expand ? $t('putAway') : $t('unfold') }}
              </el-button>
            </div>
            <el-form ref="form" label-width="80px">
              <el-col :span="8">
                <el-form-item :label="$t('applicant')">
                  <el-input
                    v-show="node.applyUserDto.cnname"
                    :value="
                      node.applyUserDto.cnname +
                        '(' +
                        node.applyUserDto.id +
                        ')'
                    "
                    readonly
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('applicationSector')">
                  <el-input
                    v-model="node.applyUserDto.department"
                    clearable
                    readonly
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('applicationDate')">
                  <el-input
                    v-model="node.applyUserDto.applyDate"
                    clearable
                    readonly
                  />
                </el-form-item>
              </el-col>
            </el-form>
          </div>
          <div>
            <draggable
              v-model="node.nodeTabLists"
              :options="dragOptions2"
              style="min-height:60px"
            >
              <template v-for="(item, index) in node.nodeTabLists">
                <flow-card
                  v-show="item.visible !== 'H'"
                  v-if="item.istab === '0'"
                  :key="item.key + index"
                  :data="item"
                  :class="{ 'border-0796F9': bgClick === item.key }"
                  :bg-click="bgClick"
                  @click.native="formHandle(item)"
                  @handleDelete="handleDelete"
                  @formHandle="formHandle"
                />
              </template>
              <flow-tabs
                v-if="tabsList.length > 0"
                :bg-click="bgClick"
                :data="tabsList"
                class="tab"
                @handleDelete="handleDelete"
                @formHandle="formHandle"
              />
            </draggable>
          </div>
        </div>
      </el-card>
      <div class="footer text-r">
        <el-button
          v-if="$route.query.id"
          type="cancel"
          class="cancel-btn"
          @click="cancelHandle"
        >
          {{ $t('cancel') }}
        </el-button>
        <el-button
          v-if="isLRShow"
          type="primary"
          class="preview-btn"
          @click="previewHandle"
        >
          {{ $t('preview') }}
        </el-button>
        <el-button
          v-if="isLRShow"
          type="success"
          class="save-btn"
          @click="saveHandle('保存')"
        >
          {{ $t('save') }}
        </el-button>
        <!--        <el-button v-if="isLRShow" type="success" class="save-btn" @click="saveHandle('生成库')">
          {{ $t('generateLibrary') }}
        </el-button>-->
      </div>
    </div>
    <div class="right">
      <el-form v-if="bgClick !== -1" label-width="80px">
        <el-row :gutter="15" class="margin-t15" align="center">
          <el-col>
            <h3>{{ $t('fieldAttributes') }}</h3>
          </el-col>
        </el-row>
        <div v-if="item.isTab">
          <el-form-item
            :label="$t('tabPageTitle') + '：'"
            required
            class="margin-t15"
          >
            <el-input v-model="item.tabname" clearable />
          </el-form-item>
          <el-form-item
            :label="$t('showSeveralColumnsPerRow') + '：'"
            class="margin-t15"
          >
            <el-input
              v-model="item.fieldcol"
              clearable
              type="number"
              min="1"
              onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
            />
          </el-form-item>
          <div v-if="item.name !== '标签页'">
            <el-form-item :label="$t('areaAt') + '：'" class="margin-t15">
              <el-input
                v-model="item.tips"
                readonly
                type="text"
                @click.native="tipsDialogShow($t('areaAt'))"
              />
            </el-form-item>
            <el-col>
              <h3>{{ $t('hide') }}</h3>
            </el-col>
            <el-col :span="24" class="text-r margin-t15">
              <el-button @click="addList">
                {{ $t('add') }}
              </el-button>
            </el-col>
            <el-table
              class="margin-t15"
              :data="hideList"
              stripe
              :header-cell-style="{ background: '#E1EAFD !important' }"
              highlight-current-row
              style="width: 100%;"
            >
              <el-table-column :label="this.$t('showName')">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.fieldShowName"
                    clearable
                    oninput="value=value.replace(/^(0|[1-9][0-9]*)$/g, '')"
                  />
                </template>
              </el-table-column>
              <!-- <el-table-column prop="usernames" align="center" :label="$t('fieldName')" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-input clearable
                    v-model="scope.row.fieldName"
                    @blur="checkName(scope.row,scope.$index)"
                  />
                </template>
              </el-table-column>-->
              <el-table-column
                :label="$t('operation')"
                show-overflow-tooltip
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    icon="el-icon-delete"
                    style="padding:5px"
                    @click="deleData(scope.row)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div v-else>
          <el-form-item
            :label="$t('showName') + '：'"
            required
            class="margin-t15 "
          >
            <el-input
              v-model="item.fieldShowName"
              clearable
              oninput="value=value.replace(/^(0|[1-9][0-9]*)$/g, '')"
            />
          </el-form-item>
          <el-form-item
            :label="$t('fieldName') + '：'"
            class="margin-t15 "
          >
            <el-input
              v-model="item.fieldName"
              clearable
              @blur="checkName(item.fieldName)"
            />
          </el-form-item>

          <el-form-item
            :label="$t('fieldType') + '：'"
            required
            class="margin-t15 "
          >
            <el-select
              v-model="item.inputType"
              clearable
              @change="inputTypeHandle(item.inputType)"
            >
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('isitRequired') + '：'" class="margin-t15">
            <el-radio-group v-model="item.isrequired">
              <el-radio label="required">
                {{ $t('yes') }}
              </el-radio>
              <el-radio label="N">
                {{ $t('no') }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('length') + '：'" class="margin-t15">
            <el-input
              v-model="item.length"
              type="number"
              clearable
              min="1"
              onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
            />
          </el-form-item>
          <el-form-item
            :label="$t('fillingExplanation') + '：'"
            class="margin-t15"
          >
            <el-input
              v-model="item.tips"
              readonly
              type="text"
              @click.native="tipsDialogShow($t('fillingExplanation'))"
            />
          </el-form-item>
          <el-form-item
            :label="$t('whetherTheCascade') + '：'"
            class="margin-t15"
          >
            <el-radio-group v-model="item.ishighLink">
              <el-radio label="1">
                {{ $t('yes') }}
              </el-radio>
              <el-radio label="0">
                {{ $t('no') }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            :label="$t('parentLinkageFieldName') + '：'"
            class="margin-t15"
          >
            <el-select
              v-model="highLinkField"
              :popper-append-to-body="false"
              multiple
              @focus="cascadeFocus(item)"
              @change="highLinkFieldChange($event, item)"
            >
              <el-option
                v-for="(val, index) in cascadeOptions"
                :key="index"
                :label="val.fieldShowName"
                :value="val.fieldName"
                :diabled="item.fieldName === val.fieldName"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="item.inputType === 'number' || item.inputType === 'double'"
            :label="$t('whetherTheCalculate') + '：'"
            class="margin-t15"
          >
            <el-radio-group v-model="item.isCalculation">
              <el-radio label="1">
                {{ $t('yes') }}
              </el-radio>
              <el-radio label="0">
                {{ $t('no') }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="
              tablePid &&
                (item.inputType === 'number' || item.inputType === 'double')
            "
            :label="$t('columnTotal') + '：'"
            class="margin-t15"
          >
            <el-radio-group v-model="item.issum">
              <el-radio label="1">
                {{ $t('yes') }}
              </el-radio>
              <el-radio label="0">
                {{ $t('no') }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('promptMessage') + '：'" class="margin-t15">
            <el-input v-model="item.placeholder" clearable type="text" />
          </el-form-item>
          <el-form-item :label="$t('dataSource') + '：'" class="margin-t15">
            <el-input
              v-model="item.datasource"
              clearable
              readonly
              :disabled="
                item.inputType !== 'select' &&
                  item.inputType !== 'selectMultiple' &&
                  item.inputType !== 'radio' &&
                  item.inputType !== 'checkbox'
              "
              @focus="showDdialog"
            />
          </el-form-item>
          <el-form-item
            v-if="
              item.inputType === 'selectPeopleSingle' ||
                item.inputType === 'selectPeopleMore' ||
                item.inputType === 'selectOrganization' ||
                item.inputType === 'selectOrganizationMore'
            "
            :label="$t('organizationalDataSource') + '：'"
            class="margin-t15"
          >
            <el-button
              type="text"
              :title="$t('configDataSource')"
              icon="el-icon-edit"
              @click="configSelectOrg(item)"
            />
          </el-form-item>
          <el-form-item
            v-if="
              item.inputType === 'multipleDialog' ||
                item.inputType === 'radioDialog'
            "
            :label="$t('configDataSource') + '：'"
            class="margin-t15"
          >
            <el-button
              type="text"
              :title="$t('configDataSource')"
              icon="el-icon-edit"
              @click="configSelectTab(item)"
            />
          </el-form-item>
          <el-form-item
            v-if="
              item.isCalculation === '1' &&
                (item.inputType === 'number' || item.inputType === 'double')
            "
            :label="$t('calculateConfig') + '：'"
            class="margin-t15"
          >
            <el-button
              type="text"
              :title="$t('calculateConfig')"
              icon="el-icon-edit"
              @click="configSelectCalculate(item)"
            />
          </el-form-item>
          <el-form-item
            v-if="item.inputType === 'process'"
            :label="$t('processDecumentsConfig') + '：'"
            class="margin-t15"
          >
            <el-button
              type="text"
              :title="$t('processDecumentsConfig')"
              icon="el-icon-edit"
              @click="configSelecttProcess(item)"
            />
          </el-form-item>
          <el-form-item
            v-if="item.inputType === 'file'"
            :label="$t('defaultFileConfig') + '：'"
            class="margin-t15"
          >
            <el-button
              type="text"
              :title="$t('defaultFileConfig')"
              icon="el-icon-edit"
              @click="configSelectFile(item)"
            />
          </el-form-item>
          <el-form-item :label="$t('defaults') + '：'" class="margin-t15">
            <el-autocomplete
              v-model="item.defaultvalue"
              style="width:100%"
              class="inline-input"
              popper-class="default-class"
              value-key="text"
              :fetch-suggestions="querySearch"
              type="textarea"
              :autosize="{ minRows: 2 }"
              :maxlength="500"
              show-word-limit
            >
              <template slot-scope="{ item }">
                <div class="name">
                  {{ item.text }}
                </div>
              </template>
            </el-autocomplete>
          </el-form-item>
          <el-form-item :label="$t('jsEventType') + '：'" class="margin-t15">
            <el-radio-group v-model="item.eventtype" clearable>
              <el-radio-button
                label="change"
                @click.native.prevent="clickitem('change')"
              >
                change
              </el-radio-button>
              <el-radio-button
                label="blur"
                @click.native.prevent="clickitem('blur')"
              >
                blur
              </el-radio-button>
              <el-radio-button
                label="focus"
                @click.native.prevent="clickitem('focus')"
              >
                focus
              </el-radio-button>
              <el-radio-button
                label="click"
                @click.native.prevent="clickitem('click')"
              >
                click
              </el-radio-button>
              <el-radio-button
                label="input"
                @click.native.prevent="clickitem('input')"
              >
                input
              </el-radio-button>
            </el-radio-group>
            <el-popover placement="top-start" trigger="hover">
              <ul class="eventtype-list">
                <li><b>事件类型：触发当前操作元素的动作</b></li>
                <li>
                  change：改变当前元素的值时触发（常用于下拉框、单选框、复选框）
                </li>
                <li>blur：当前元素失去焦点时触发（常用于文本框）</li>
                <li>focus：当前元素获取焦点时触发（常用于文本框）</li>
                <li>click：点击当前元素时触发（常用于按钮）</li>
                <li>input：用户在当前元素内输入值时触发（常用于文本框）</li>
              </ul>
              <el-button
                slot="reference"
                icon="el-icon-question"
                style="color: #3141a9"
                type="text"
              />
            </el-popover>
          </el-form-item>
          <el-form-item :label="$t('jsEvent') + '：'" class="margin-t15">
            <el-input
              v-model="item.event"
              clearable
              style="width: calc(100% - 20px)"
            />
            <el-popover
              placement="top-start"
              trigger="hover"
              style="margin-left: 5px"
            >
              <ul class="eventtype-list">
                <li>
                  <b
                    >事件类型对应的具体执行方法（当前配置填写的是方法名，具体实现在自定义js中）</b
                  >
                </li>
              </ul>
              <el-button
                slot="reference"
                icon="el-icon-question"
                style="color: #3141a9"
                type="text"
              />
            </el-popover>
            <el-button type="text" @click="customJsEventVisible = true">
              示例
            </el-button>
          </el-form-item>
          <el-form-item :label="$t('howManyColumns') + '：'" class="margin-t15">
            <el-input
              v-model="item.inputcolspan"
              type="number"
              clearable
              min="1"
              :disabled="item.inputType === 'subtable' || item.inputType === 'file' || item.inputType === 'ckeditor'"
              onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
            />
          </el-form-item>
          <dictionaryDialog
            v-model="dialogShow"
            :item="item.datasource"
            @confirm="getDictionary"
          />
        </div>
      </el-form>
    </div>
    <copyDataDialog v-model="copyDataVisible" @confirm="getTabData" />
    <AddtipsDialog
      v-model="tipsDialog"
      :content="tipsContent"
      :title="titleDialog"
      @confirm="getTipsContent"
    />
    <orgDataSource
      v-model="orgDataSourcedialog"
      :item-data="itemData"
      @confirm="handlerOrgDataSource"
    />
    <tableConfig
      v-model="tableConfigdialog"
      :item-data="itemData"
      :node-id="
        node.nodeTabLists && node.nodeTabLists.length > 0
          ? node.nodeTabLists[0].nodeid
          : ''
      "
      @confirm="handlertableConfig"
    />
    <customJsEvent v-model="customJsEventVisible" />
    <columnTotalConfig
      v-model="columnTotalDialog"
      :item-data="itemData"
      :node-id="
        node.nodeTabLists && node.nodeTabLists.length > 0
          ? node.nodeTabLists[0].nodeid
          : ''
      "
      @confirm="handlerColumnTotal"
    />
    <processDocumentsConfig
      v-model="processDocumentsDialog"
      :item-data="itemData"
      :node-id="
        node.nodeTabLists && node.nodeTabLists.length > 0
          ? node.nodeTabLists[0].nodeid
          : ''
      "
      @confirm="handlerProcessDocuments"
    />
    <defaultFileConfig
      v-model="defaultFileDialog"
      :item-data="itemData"
      :node-id="
        node.nodeTabLists && node.nodeTabLists.length > 0
          ? node.nodeTabLists[0].nodeid
          : ''
      "
      @confirm="handlerDefaultFile"
    />
  </div>
</template>
<script>
import { getPinYinFirstCharacter } from '@/utils/pinyin'
import logo from '@/bpm/assets/img/common/logo-sx.png'
import {
  deleteProcessNodeTable,
  deleteProcessNodeTab,
  getDictionaryOption,
  checkFieldKey
} from '@/bpm/api/process/processModeling/classificationModel'
import dictionaryDialog from '@/bpm/components/dictionaryDialog'
import {
  savedragform,
  builddatabaseindragform,
  loaddragformByAnotherProcessid
} from '@/bpm/api/customForm'
import FlowCard from './FlowCard'
import FlowTabs from './FlowTabs'
import copyDataDialog from './copyDataDialog'
import AddtipsDialog from '../../process/processModeling/classificationModel/configurationFlow/flowNode/AddtipsDialog'
import orgDataSource from '@/bpm/components/orgDataSource'
import tableConfig from '@/bpm/components/tableDialog/tableConfig'
import customJsEvent from '@/bpm/components/customJsEvent'
import columnTotalConfig from '@/bpm/components/columnTotalConfig'
import processDocumentsConfig from '@/bpm/components/processDocumentsConfig'
import defaultFileConfig from '@/bpm/components/defaultFileConfig'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapMutations } = createNamespacedHelpers('processDesign')
export default {
  components: {
    dictionaryDialog,
    copyDataDialog,
    FlowCard,
    FlowTabs,
    AddtipsDialog,
    orgDataSource,
    tableConfig,
    customJsEvent,
    columnTotalConfig,
    processDocumentsConfig,
    defaultFileConfig
  },
  props: {
    node: {
      type: Object,
      default: () => ({})
    },
    formType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      typeList: [],
      tipsDialog: false,
      tipsContent: '',
      titleDialog: '',
      logo: logo,
      defaultList: [],
      activeNames: ['1', '2', '3', '4'],
      date_list: [],
      bgClick: -1,
      load: false,
      dialogShow: false,
      copyDataVisible: false,
      orgDataSourcedialog: false,
      tableConfigdialog: false,
      customJsEventVisible: false,
      columnTotalDialog: false,
      processDocumentsDialog: false,
      defaultFileDialog: false,
      count: 0,
      item: {
        isTab: false
      },
      input_list: [],
      org_list: [],
      Other_list: [],
      form_list: [
        {
          tabname: this.$t('areaBlock'),
          key: new Date().getTime(),
          name: this.$t('areaBlock'),
          isdefault: 'N',
          iscontains: 'N',
          istab: '0',
          fieldcol: 2,
          nodeTabLists: [],
          nodeTableLists: []
        },
        {
          fieldcol: 1,
          istab: '1',
          nodeTabLists: [],
          key: new Date().getTime(),
          nodeTableLists: [],
          processversion: '',
          tabname: this.$t('bookmarkPage'),
          name: this.$t('bookmarkPage')
        }
      ],
      expand: true,
      itemData: {},
      nodeTables: [],
      cascadeOptions: [],
      cascadeOptionsAll: [],
      highLinkField: [],
      highLinkFieldName: [],
      tablePid: '',
      fieldNames: []
    }
  },
  computed: {
    ...mapGetters(['processData', 'isCount']),
    tabsList() {
      const i = 0
      return this.node.nodeTabLists.filter(item => {
        if (item.istab === '1') {
          item.key = Math.random()
        }
        return item.istab === '1'
      })
    },
    // 拖拽表单1
    dragOptions1() {
      return {
        animation: 0,
        ghostClass: 'ghost',
        // 分组
        group: {
          name: 'shared1',
          pull: 'clone',
          revertClone: false
        },
        // 禁止拖动排序
        sort: false
      }
    },
    // 拖拽表单3
    dragOptions3() {
      return {
        animation: 0,
        ghostClass: 'ghost',
        // 分组
        group: {
          name: 'shared',
          pull: 'clone',
          revertClone: false
        },
        // 禁止拖动排序
        sort: false
      }
    },
    // 拖拽表单2
    dragOptions2() {
      return {
        animation: 0,
        ghostClass: 'ghost',
        filter: '.tab',
        group: {
          // 只允许放置shared的控件,禁止pull
          put: ['shared1']
        }
      }
    },
    hideList() {
      return this.item.nodeTableLists.filter(
        item => item.inputType === 'hidden'
      )
    },
    isLRShow() {
      return this.$store.state.custom.isLRShow
    }
  },
  watch: {
    expand(val) {
      this.slideToggle(val)
    },
    node: {
      handler(val) {
        if (val) {
          val.applyUserDto.applyDate = this.$options.filters.formatDateTime(
            val.applyUserDto.applyDate
          )
        }
      }
    }
  },
  mounted() {
    this.getFormTypeData()
    getDictionaryOption({
      dictionaryen: 'subparagraphType'
    }).then(rt => {
      rt.data.forEach(element => {
        element.disabled = false
      })
      this.typeList = rt.data
      console.log('🍓typeList', this.typeList.map(item => item.value), [...new Set(this.typeList.map(item => item.value))])
    }).catch(error => console.log(error))
  },
  methods: {
    ...mapMutations(['setIsCount']),
    // 字段类型change事件
    inputTypeHandle(item) {
      if (this.item) {
        if (
          item === 'time' ||
          item === 'date' ||
          item === 'date-edit' ||
          item === 'time-edit'
        ) {
          if (
            this.item.inputType !== 'time' &&
            this.item.inputType !== 'time-edit' &&
            this.item.inputType !== 'date-edit' &&
            this.item.inputType !== 'date'
          ) {
            this.$message.error(this.$t('hintText.DataTypeChangedPleasePerformRelatedOperationsDatabase'))
          }
        } else {
          if (
            this.item.inputType === 'time' ||
            this.item.inputType === 'time-edit' ||
            this.item.inputType === 'date-edit' ||
            this.item.inputType === 'date'
          ) {
            this.$message.error(this.$t('hintText.DataTypeChangedPleasePerformRelatedOperationsDatabase'))
          }
        }
      }
    },
    cascadeFocus(val) {
      this.cascadeOptions = this.cascadeOptionsAll.filter(item => {
        return (
          item.fieldName &&
          (item.inputType !== 'subtable' || item.inputType !== 'treetable')
        )
      })
    },
    highLinkFieldChange(val, item) {
      this.highLinkFieldName = this.cascadeOptions
        .filter(e => val.includes(e.fieldName))
        .map(e => e.fieldShowName)
      this.$set(item, 'highLinkField', val.join())
      this.$set(item, 'highLinkFieldName', this.highLinkFieldName.join())
    },
    getTabData(processId) {
      this.$emit('getTabData', processId)
    },
    tipsDialogShow(title) {
      this.titleDialog = title
      const data = Object.assign({}, this.item)
      this.tipsContent = data.tips
      this.tipsDialog = true
    },
    getTipsContent(data) {
      this.$set(this.item, 'tips', data)
    },
    copyData() {
      this.copyDataVisible = true
      // if (this.bgClick !== -1) {
      //   if (than.item.tabname) {
      //     let index = than.node.nodeTabLists.findIndex(
      //       item => item === than.item
      //     );
      //     if (index !== -1) {
      //       let objData = JSON.parse(JSON.stringify(than.item));
      //       objData.key = new Date().getTime() * Math.random();
      //       objData.id = "";
      //       objData.pid = "";
      //       objData.sort = "";
      //       objData.relationType = "";
      //       objData.fieldName = "";
      //       objData.nodeTabLists.forEach(item => {
      //         item.key = new Date().getTime() * Math.random();
      //         item.id = "";
      //         item.fieldName = "";
      //         item.pid = "";
      //         item.sort = "";
      //         item.relationType = "";
      //         item.nodeTabLists.forEach(item1 => {
      //           item1.key = new Date().getTime() * Math.random();
      //           item1.id = "";
      //           item1.fieldName = "";
      //           item1.pid = "";
      //           item1.sort = "";
      //           item1.relationType = "";
      //           item1.nodeTableLists.forEach(val => {
      //             val.key = new Date().getTime() * Math.random();
      //             val.id = "";
      //             val.fieldName = "";
      //             val.pid = "";
      //             val.sort = "";
      //             val.relationType = "";
      //             if (val.inputType === "subtable") {
      //               val.nodeTableLists.forEach(element => {
      //                 element.id = "";
      //                 element.fieldName = "";
      //                 element.pid = "";
      //                 element.sort = "";
      //                 element.relationType = "";
      //                 element.key = new Date().getTime() * Math.random();
      //               });
      //             }
      //           });
      //         });
      //       });
      //       objData.nodeTableLists.forEach(val => {
      //         val.key = new Date().getTime() * Math.random();
      //         val.id = "";
      //         val.fieldName = "";
      //         val.pid = "";
      //         val.sort = "";
      //         val.relationType = "";
      //         if (val.inputType === "subtable") {
      //           val.nodeTableLists.forEach(element => {
      //             element.key = new Date().getTime() * Math.random();
      //             element.id = "";
      //             element.fieldName = "";
      //             element.pid = "";
      //             element.sort = "";
      //             element.relationType = "";
      //           });
      //         }
      //       });
      //       than.node.nodeTabLists.splice(index + 1, 0, objData);
      //     }
      //   } else {
      //     let objData = JSON.parse(JSON.stringify(than.item));
      //     than.node.nodeTabLists.forEach(item => {
      //       let index = item.nodeTableLists.findIndex(val => val === than.item);
      //       if (index !== -1) {
      //         objData.key = new Date().getTime() * Math.random();
      //         objData.id = "";
      //         objData.fieldName = "";
      //         objData.pid = "";
      //         objData.sort = "";
      //         objData.relationType = "";
      //         if (objData.inputType === "subtable") {
      //           objData.nodeTableLists.forEach(element => {
      //             element.key = new Date().getTime() * Math.random();
      //             element.id = "";
      //             element.fieldName = "";
      //             element.pid = "";
      //             element.sort = "";
      //             element.relationType = "";
      //           });
      //         }
      //         item.nodeTableLists.splice(index + 1, 0, objData);
      //       } else {
      //         item.nodeTabLists.forEach(val => {
      //           let index = val.nodeTableLists.findIndex(
      //             item => item === objData
      //           );
      //           if (index !== -1) {
      //             objData.key = new Date().getTime() * Math.random();
      //             objData.id = "";
      //             objData.fieldName = "";
      //             objData.pid = "";
      //             objData.sort = "";
      //             objData.relationType = "";
      //             if (objData.inputType === "subtable") {
      //               objData.nodeTableLists.forEach(element => {
      //                 element.key = new Date().getTime() * Math.random();
      //                 element.fieldName = "";
      //                 element.id = "";
      //                 element.pid = "";
      //                 element.sort = "";
      //                 element.relationType = "";
      //               });
      //             }
      //             val.nodeTableLists.splice(index + 1, 0, objData);
      //           }
      //         });
      //       }
      //     });
      //   }
      // } else {
      //   this.$message.error("请选择要复制的布局！！");
      // }
    },
    clickitem(e) {
      e === this.item.eventtype
        ? this.$set(this.item, 'eventtype', '')
        : this.$set(this.item, 'eventtype', e)
    },
    cancelHandle() {
      window.opener = null
      window.open('', '_self')
      window.close()
    },
    previewHandle() {
      localStorage.setItem('previewFormData', JSON.stringify(this.node))
      const routeData = this.$router.resolve({
        name: 'processFormPreview',
        query: {
          name: this.node.processShowName
        }
      })
      // window.open(routeData.href, "_blank");
      const a = document.createElement('a')
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
    querySearch(queryString, cb) {
      var defaultList = this.defaultList
      var results = queryString
        ? defaultList.filter(this.createFilter(queryString))
        : defaultList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.text.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      }
    },
    checkName(item, index) {
      let fieldName = ''
      if (index || index === 0) {
        fieldName = item.fieldName.toUpperCase()
      } else {
        fieldName = item.toUpperCase()
      }
      if (fieldName) {
        const reg = /(^_([a-zA-Z0-9]_?)*$)|(^[a-zA-Z](_?[a-zA-Z0-9])*_?$)/
        if (!reg.test(fieldName)) {
          if (index || index === 0) {
            item.fieldName = ''
          } else {
            this.item.fieldName = ''
          }
          this.$message({
            message: this.$t('hintText.fieldNameCannotChineseOrSpecialSymbols'),
            customClass: 'specialSymbolsMessage'
          })
          return
        }
        this.load = true
        checkFieldKey(fieldName)
          .then(rt => {
            this.load = false
            if (rt.data === 'Y') {
              if (index || index === 0) {
                item.fieldName = ''
              } else {
                this.item.fieldName = ''
              }
              this.$message.error(
                this.$t('hintText.theFieldIsNamedKeywordPleaseReRnter')
              )
            } else {
              if (index || index === 0) {
                item.fieldName = fieldName
              } else {
                this.item.fieldName = fieldName
              }
            }
          })
          .catch(er => {
            this.load = false
          })
      }
    },
    start: function(evt) {
      this.input_list[evt.oldIndex].key = new Date().getTime()
    },
    startDate: function(evt) {
      this.date_list[evt.oldIndex].key = new Date().getTime()
    },
    startOrg: function(evt) {
      this.org_list[evt.oldIndex].key = new Date().getTime()
    },
    // 1233333333333333333333333333333333333333333333333333333333
    startOther: function(evt) {
      this.Other_list[evt.oldIndex].key = new Date().getTime()
    },
    tabstart: function(evt) {
      this.form_list[evt.oldIndex].key = new Date().getTime()
    },
    draggableEnd(evt) {
      this.setIsCount(++this.count)
    },
    addList() {
      this.item.nodeTableLists.push({
        key: new Date().getTime() * Math.random(),
        fieldName: '',
        inputType: 'hidden',
        fieldShowName: this.$t('hide'),
        necessary: '0',
        length: 200,
        issavedraft: '1',
        isrequired: 'N',
        eventtype: '',
        event: '',
        editstate: 'W',
        datasource: '',
        defaultvalue: '',
        isedit: '1',
        isCalculation: '0',
        issum: '0',
        nodeTabLists: [],
        nodeoptions: [],
        nodeTableLists: [],
        inputcolspan: 1
      })
    },
    deleData(data) {
      this.$confirm(
        this.$t('hintText.areYouSureDelete'),
        this.$t('hintText.hint'),
        {
          type: 'warning'
        }
      ).then(() => {
        this.load = true
        if (data.id) {
          deleteProcessNodeTable({
            tableId: data.id
          })
            .then(rt => {
              this.load = false
              if (rt.status === '200') {
                this.item.nodeTableLists.splice(
                  this.item.nodeTableLists.findIndex(item => item === data),
                  1
                )
              }
            })
            .catch(er => {
              this.load = false
            })
        } else {
          this.load = false
          this.item.nodeTableLists.splice(
            this.item.nodeTableLists.findIndex(item => item === data),
            1
          )
        }
      })
    },
    showDdialog(i) {
      this.dialogShow = true
    },
    configSelectOrg(item) {
      if (!item.id) {
        this.$message.error(
          this.$t('hintText.pleaseSubmitTheFormInformationFirst')
        )
        return
      }
      this.itemData = JSON.parse(JSON.stringify(item))
      this.orgDataSourcedialog = true
    },
    configSelectTab(item) {
      // if (!item.id) {
      //   this.$message.error(this.$t('hintText.pleaseSubmitTheFormInformationFirst'));
      //   return
      // }
      this.itemData = JSON.parse(JSON.stringify(item))
      this.tableConfigdialog = true
    },
    configSelectCalculate(item) {
      this.itemData = JSON.parse(JSON.stringify(item))
      this.columnTotalDialog = true
    },
    configSelecttProcess(item) {
      this.itemData = JSON.parse(JSON.stringify(item))
      this.processDocumentsDialog = true
    },
    configSelectFile(item, i) {
      this.itemData = JSON.parse(JSON.stringify(item))
      this.defaultFileDialog = true
    },
    handlertableConfig(data) {
      this.$set(this.item, 'saveField', data.saveField)
      this.$set(this.item, 'showField', data.showField)
      this.$set(this.item, 'titleName', data.titleName)
      this.$set(this.item, 'titleTable', data.titleTable)
      this.$set(this.item, 'nodeColumnDtos', data.nodeColumnDtos)
    },
    handlerOrgDataSource() {},
    handlerColumnTotal(list) {
      this.$set(this.item, 'calculationDtos', list)
    },
    handlerProcessDocuments(data) {
      this.$set(this.item, 'datascope', data.datascope)
      this.$set(this.item, 'nodeProcessDtos', data.nodeProcessDtos)
    },
    handlerDefaultFile(list) {
      this.$set(this.item, 'nodeDefaultDocDtos', list)
    },
    getDictionary(data) {
      this.item.datasource = data.dictionaryen
      getDictionaryOption({
        dictionaryen: this.item.datasource
      }).then(res => {
        this.item.nodeoptions = res.data
      })
    },
    savedragform(params) {
      this.load = true
      savedragform(params)
        .then(async rt => {
          this.load = false
          if (rt.status === '200') {
            this.setIsCount(0)
            await this.$emit('savedragform')
            this.bgClick = -1
            // this.$message.success(this.$t('hintText.submittedSuccessfully'))
          }
        })
        .catch(er => {
          this.load = false
        })
    },
    // 获取已存在的fieldName
    getFieldName(node) {
      if (node.nodeTabLists) {
        node.nodeTabLists.forEach(tab => {
          this.getFieldName(tab);
        });
      }
      if (node.nodeTableLists) {
        node.nodeTableLists.forEach(table => {
          this.fieldNames.push(table.fieldName)
          this.getFieldName(table);
        });
      }
    },
    // 自动赋值fieldName
    setFieldName(node) {
      if (node.nodeTabLists) {
        node.nodeTabLists.forEach(tab => {
          this.setFieldName(tab);
        });
      }
      if (node.nodeTableLists) {
        node.nodeTableLists.forEach(table => {
          if(table.fieldName.trim() === '') {
            let result = getPinYinFirstCharacter(table.fieldShowName, '', true)
            // 判断是否重复
            const checkRepeat = (field) => {
              const flag = this.fieldNames.some(currentItem => currentItem === result)
              if(flag) {
                let newNum = Number(field.match(/\d*$/)) + 1
                result = field.split(/\d*$/)[0] + newNum
                checkRepeat(result)
              }
            }
            checkRepeat(result)
            this.fieldNames.push(result)
            table.fieldName = result
          }
          this.setFieldName(table);
        });
      }
    },

    saveHandle(type) {
      this.fieldNames = []
      const params = { ...this.node }
      this.getFieldName(params)
      this.setFieldName(params)
      params.nodeTabLists.forEach(item => {
        item.nodeTableLists.forEach(item2 => {
          if(item2.fieldName.trim() === '') {
            let result = getPinYinFirstCharacter(item2.fieldShowName, '', true)
            // 判断是否重复
            const checkRepeat = (field) => {
              const flag = fieldNames.some(currentItem => currentItem === result)
              if(flag) {
                let newNum = Number(field.match(/\d*$/)) + 1
                result = field.split(/\d*$/)[0] + newNum
                checkRepeat(result)
              }
            }
            checkRepeat(result)
            fieldNames.push(result)
            item2.fieldName = result
          }
        })
      })
      const isIfNulData = this.pamarsFiltration(params.nodeTabLists)
      if (isIfNulData !== true) {
        this.item = isIfNulData
        this.bgClick = isIfNulData.key
        if (!isIfNulData.fieldShowName) {
          this.$message.error(this.$t('hintText.displayNameCannotBeEmpty'))
          return false
        } else if (!isIfNulData.fieldName) {
          this.$message.error(this.$t('hintText.fieldNameCannotBeEmpty'))
          return false
        } else if (
          isIfNulData.ishighLink === '1' &&
          !isIfNulData.highLinkField
        ) {
          this.$message.error(
            this.$t('hintText.parentLinkageFieldCannotBeEmpty')
          )
          return false
        } else if (
          isIfNulData.inputType === 'process' &&
          (!isIfNulData.nodeProcessDtos ||
            isIfNulData.nodeProcessDtos.length === 0)
        ) {
          this.$message.error(
            this.$t(
              'hintText.pleaseSelectTheProcessInTheProcessDocumentConfigurationPage'
            )
          )
          return false
        } else if (isIfNulData.length < 1) {
          this.$message.error(
            this.$t('hintText.theFieldLengthCannotBeLessThan')
          )
          return false
        } else if (
          !isIfNulData.nodeColumnDtos ||
          isIfNulData.nodeColumnDtos.length < 1
        ) {
          this.$message.error(this.$t('dataSourcePrompt'))
          return false
        }
      }
      params.processId = this.$route.query.id
        ? this.$route.query.id
        : this.processData.id
      params.version =
        this.$route.query.version || this.$route.query.version === ''
          ? this.$route.query.version
          : this.processData.version
      params.applyUserDto.applyDate = this.$options.filters.formatDate(
        params.applyUserDto.applyDate
      )
      this.savedragform(params)
    },
    builddatabaseindragform(params) {
      this.pamarsFiltrationDatabase(params.nodeTabLists)
      // const isIfNulData = this.pamarsFiltrationDatabase(params.nodeTabLists)
      // if (isIfNulData !== true) {
      //   this.$message.error(
      //     this.$t('hintText.pleaseSaveTheFormInformationFirst')
      //   )
      //   return false
      // }
      this.load = true
      builddatabaseindragform(params)
        .then(rt => {
          this.load = false
          if (rt.status === '200') {
            this.setIsCount(0)
            this.bgClick = -1
            this.$message.success(this.$t('hintText.operateSuccessfully'))
          }
        })
        .catch(er => {
          this.load = false
        })
    },
    pamarsFiltrationDatabase(list) {
      for (let i = 0; i < list.length; i++) {
        if (!list[i].id) {
          return false
        }
        if (list[i].nodeTableLists.length > 0) {
          for (let j = 0; j < list[i].nodeTableLists.length; j++) {
            const _data = list[i].nodeTableLists[j]
            if (!_data.id) {
              return false
            }
            if (_data.nodeTableLists && _data.nodeTableLists.length > 0) {
              for (let k = 0; k < _data.nodeTableLists.length; k++) {
                const _dataK = _data.nodeTableLists[k]
                if (!_dataK.id) {
                  return false
                }
              }
            }
          }
        }
        if (list[i].nodeTabLists && list[i].nodeTabLists.length > 0) {
          this.pamarsFiltrationDatabase(list[i].nodeTabLists)
        }
      }
      return true
    },
    pamarsFiltration(list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].nodeTableLists.length > 0) {
          for (let j = 0; j < list[i].nodeTableLists.length; j++) {
            const _data = list[i].nodeTableLists[j]
            if (_data.length < 1 || !_data.fieldShowName || !_data.fieldName) {
              return _data
            }
            if (_data.ishighLink === '1' && !_data.highLinkField) {
              return _data
            }
            if (
              _data.inputType === 'process' &&
              (!_data.nodeProcessDtos || _data.nodeProcessDtos.length === 0)
            ) {
              return _data
            }
            if (_data.inputType === 'subtable') {
              if (
                !_data.fieldShowName ||
                !_data.fieldName ||
                _data.length < 1
              ) {
                return _data
              }
            }
            if (_data.nodeTableLists && _data.nodeTableLists.length > 0) {
              for (let k = 0; k < _data.nodeTableLists.length; k++) {
                const _dataK = _data.nodeTableLists[k]
                if (
                  _dataK.length < 1 ||
                  !_dataK.fieldShowName ||
                  !_dataK.fieldName
                ) {
                  return _dataK
                }
                if (
                  _dataK.inputType === 'subtable' &&
                  (!_dataK.fieldShowName ||
                    !_dataK.fieldName ||
                    _dataK.length < 1)
                ) {
                  return _dataK
                }
              }
            }
            if (
              _data.inputType === 'multipleDialog' ||
              _data.inputType === 'radioDialog'
            ) {
              if (!_data.nodeColumnDtos || _data.nodeColumnDtos.length < 1) {
                return _data
              }
            }
          }
        }

        if (list[i].nodeTabLists && list[i].nodeTabLists.length > 0) {
          this.pamarsFiltration(list[i].nodeTabLists)
        }
      }
      return true
    },
    getFormTypeData() {
      getDictionaryOption({
        dictionaryen: 'subparagraphType'
      })
        .then(res => {
          this.input_list = []
          res.data.forEach(item => {
            if (
              item.value !== 'hidden' &&
              item.value !== 'autocomplete' &&
              item.value !== 'treetable' &&
              item.value !== 'date' &&
              item.value !== 'time' &&
              item.value !== 'date-edit' &&
              item.value !== 'time-edit' &&
              item.value !== 'date_limit' &&
              item.value !== 'selectPeopleSingle' &&
              item.value !== 'selectPeopleMore' &&
              item.value !== 'selectOrganization' &&
              item.value !== 'selectOrganizationMore' &&
              item.value !== 'city' &&
              item.value !== 'email' &&
              item.value !== 'rating-1' &&
              item.value !== 'rating-2' &&
              item.value !== 'link' &&
              item.value !== 'project' &&
              item.value !== 'province' &&
              item.value !== 'subtable' &&
              item.value !== 'file' &&
              item.value !== 'ckeditor'
            ) {
              this.input_list.push({
                key: new Date().getTime() * Math.random(),
                name: item.text,
                fieldName: '',
                inputType: item.value,
                fieldShowName: item.text,
                necessary: '0',
                length: 200,
                issavedraft: '1',
                isrequired: 'N',
                eventtype: '',
                event: '',
                editstate: 'R',
                datasource: '',
                defaultvalue: '',
                isedit: '1',
                isCalculation: '0',
                issum: '0',
                nodeTabLists: [],
                nodeoptions: [],
                nodeTableLists: [],
                inputcolspan: 1
              })
            } else if (
              item.value === 'subtable' ||
              item.value === 'file' ||
              item.value === 'ckeditor'
            ) {
              this.input_list.push({
                key: new Date().getTime() * Math.random(),
                name: item.text,
                fieldName: '',
                inputType: item.value,
                fieldShowName: item.text,
                necessary: '0',
                length: 200,
                issavedraft: '1',
                isrequired: 'N',
                eventtype: '',
                event: '',
                editstate: 'R',
                datasource: '',
                defaultvalue: '',
                isedit: '1',
                isCalculation: '0',
                issum: '0',
                nodeTabLists: [],
                nodeoptions: [],
                nodeTableLists: [],
                inputcolspan: ''
              })
            }  else if (

              item.value === 'date' ||
              item.value === 'time' ||
              item.value === 'date-edit' ||
              item.value === 'time-edit' ||
              item.value === 'date_limit'
            ) {
              this.date_list.push({
                key: new Date().getTime() * Math.random(),
                name: item.text,
                fieldName: '',
                inputType: item.value,
                fieldShowName: item.text,
                necessary: '0',
                length: 200,
                issavedraft: '1',
                isrequired: 'N',
                eventtype: '',
                event: '',
                editstate: 'R',
                datasource: '',
                defaultvalue: '',
                isedit: '1',
                isCalculation: '0',
                issum: '0',
                nodeTabLists: [],
                nodeoptions: [],
                nodeTableLists: [],
                inputcolspan: 1
              })
            } else if (
              item.value === 'selectPeopleSingle' ||
              item.value === 'selectPeopleMore' ||
              item.value === 'selectOrganization' ||
              item.value === 'selectOrganizationMore'
            ) {
              this.org_list.push({
                key: new Date().getTime() * Math.random(),
                name: item.text,
                fieldName: '',
                inputType: item.value,
                fieldShowName: item.text,
                necessary: '0',
                length: 200,
                issavedraft: '1',
                isrequired: 'N',
                eventtype: '',
                event: '',
                editstate: 'R',
                datasource: '',
                defaultvalue: '',
                isedit: '1',
                isCalculation: '0',
                issum: '0',
                nodeTabLists: [],
                nodeoptions: [],
                nodeTableLists: [],
                inputcolspan: 1
              })
            } else if (
              item.value === 'city' ||
              item.value === 'email' ||
              item.value === 'rating-1' ||
              item.value === 'rating-2' ||
              item.value === 'link' ||
              item.value === 'project' ||
              item.value === 'province'
            ) {
              this.Other_list.push({
                key: new Date().getTime() * Math.random(),
                name: item.text,
                fieldName: '',
                inputType: item.value,
                fieldShowName: item.text,
                necessary: '0',
                length: 200,
                issavedraft: '1',
                isrequired: 'N',
                eventtype: '',
                event: '',
                editstate: 'R',
                datasource: '',
                defaultvalue: '',
                isedit: '1',
                isCalculation: '0',
                issum: '0',
                nodeTabLists: [],
                nodeoptions: [],
                nodeTableLists: [],
                inputcolspan: 1
              })
            }
          })
          return getDictionaryOption({
            dictionaryen: '表单字段默认值'
          })
        })
        .then(rt => {
          this.defaultList = rt.data
        })
    },
    formHandle(data, i) {
      console.log(data, i)
      this.tablePid = ''
      this.highLinkField = []
      this.highLinkFieldName = []
      this.nodeTables = data.nodeTableLists
      const than = this
      if (i || i === 0) {
        than.item.isTab = false
        if (data.tabname) {
          this.cascadeOptionsAll = data.nodeTableLists
          this.cascadeOptions = JSON.parse(
            JSON.stringify(this.cascadeOptionsAll)
          )
          than.item = data.nodeTableLists[i]
          if (than.item.highLinkField) {
            than.highLinkField = than.item.highLinkField.split(',')
          }
          if (than.item.highLinkFieldName) {
            than.highLinkFieldName = than.item.highLinkFieldName.split(',')
          }
          than.bgClick = than.item.key
        } else {
          than.node.nodeTabLists.forEach(item => {
            item.nodeTableLists.forEach(val => {
              if (val.inputType === 'subtable') {
                const index = val.nodeTableLists.findIndex(
                  item => item === data
                )
                if (index !== -1) {
                  this.cascadeOptionsAll = val.nodeTableLists
                  this.cascadeOptions = JSON.parse(
                    JSON.stringify(this.cascadeOptionsAll)
                  )
                  than.item = val.nodeTableLists[index]
                  this.tablePid = val.id
                  if (than.item.highLinkField) {
                    than.highLinkField = than.item.highLinkField.split(',')
                  }
                  if (than.item.highLinkFieldName) {
                    than.highLinkFieldName = than.item.highLinkFieldName.split(
                      ','
                    )
                  }
                  than.bgClick = than.item.key
                }
              }
            })
            if (item.istab === '1') {
              item.nodeTabLists.forEach(ele => {
                ele.nodeTableLists.forEach(val => {
                  const index = val.nodeTableLists.findIndex(el => el === data)
                  if (index !== -1) {
                    this.cascadeOptionsAll = val.nodeTableLists
                    this.cascadeOptions = JSON.parse(
                      JSON.stringify(this.cascadeOptionsAll)
                    )
                    than.item = val.nodeTableLists[index]
                    this.tablePid = val.id
                    if (than.item.highLinkField) {
                      than.highLinkField = than.item.highLinkField.split(',')
                    }
                    if (than.item.highLinkFieldName) {
                      than.highLinkFieldName = than.item.highLinkFieldName.split(
                        ','
                      )
                    }
                    than.bgClick = than.item.key
                  }
                })
              })
            }
          })
        }
      } else {
        than.item = data
        than.item.isTab = true
        than.bgClick = this.item.key
      }
    },
    deleteProcessNodeTable(id, data, i) {
      this.load = true
      deleteProcessNodeTable({
        tableId: id
      })
        .then(rt => {
          this.load = false
          if (rt.status === '200') {
            data.splice(i, 1)
          }
        })
        .catch(er => {
          this.load = false
        })
    },
    deleteProcessNodeTab(id, data, i) {
      this.load = true
      deleteProcessNodeTab({
        nodeTabId: id
      })
        .then(rt => {
          this.load = false
          if (rt.status === '200') {
            data.splice(i, 1)
          }
        })
        .catch(er => {
          this.load = false
        })
    },
    handleDelete(data) {
      const name = data.tabname ? data.tabname : data.fieldShowName
      // this.$confirm(`您确定要删除${name}吗?`, this.$t('hintText.hint'), {
      this.$confirm(
        this.$t('hintText.areYouSureDelete'),
        this.$t('hintText.hint'),
        {
          type: 'warning'
        }
      ).then(() => {
        this.bgClick = -1
        this.item = {}
        if (data.tabname) {
          const index = this.node.nodeTabLists.findIndex(item => item === data)
          if (index === -1) {
            this.node.nodeTabLists.forEach(item => {
              const i = item.nodeTabLists.findIndex(val => val === data)
              if (i !== -1) {
                if (item.nodeTabLists[i].id) {
                  this.deleteProcessNodeTab(
                    item.nodeTabLists[i].id,
                    item.nodeTabLists,
                    index
                  )
                } else {
                  item.nodeTabLists.splice(index, 1)
                }
              }
            })
          } else {
            if (this.node.nodeTabLists[index].id) {
              this.deleteProcessNodeTab(
                this.node.nodeTabLists[index].id,
                this.node.nodeTabLists,
                index
              )
            } else {
              this.node.nodeTabLists.splice(index, 1)
            }
          }
        } else {
          this.node.nodeTabLists.forEach(item => {
            const index = item.nodeTableLists.findIndex(el => el === data)
            if (index !== -1) {
              if (item.nodeTableLists[index].id) {
                this.deleteProcessNodeTable(
                  item.nodeTableLists[index].id,
                  item.nodeTableLists,
                  index
                )
              } else {
                item.nodeTableLists.splice(index, 1)
              }
            } else {
              if (item.istab === '1') {
                item.nodeTabLists.forEach(ele => {
                  ele.nodeTableLists.forEach(val => {
                    childIndex = val.nodeTableLists.findIndex(el => el === data)
                    if (childIndex !== -1) {
                      if (val.nodeTableLists[childIndex].id) {
                        this.deleteProcessNodeTable(
                          val.nodeTableLists[childIndex].id,
                          val.nodeTableLists,
                          childIndex
                        )
                      } else {
                        val.nodeTableLists.splice(childIndex, 1)
                      }
                    }
                  }) 
                })
              }
              let childIndex = -1
              if (item.nodeTabLists && item.nodeTabLists.length > 0) {
                item.nodeTableLists.forEach(val => {
                  if (val.inputType === 'subtable') {
                    childIndex = val.nodeTableLists.findIndex(el => el === data)
                    if (childIndex !== -1) {
                      if (val.nodeTableLists[childIndex].id) {
                        this.deleteProcessNodeTable(
                          val.nodeTableLists[childIndex].id,
                          val.nodeTableLists,
                          childIndex
                        )
                      } else {
                        val.nodeTableLists.splice(childIndex, 1)
                      }
                    }
                  }
                })
              }
              if (childIndex === -1) {
                if (item.nodeTabLists && item.nodeTabLists.length > 0) {
                  item.nodeTabLists.forEach(val => {
                    childIndex = val.nodeTableLists.findIndex(
                      obj => obj === data
                    )
                    if (childIndex !== -1) {
                      if (val.nodeTableLists[childIndex].id) {
                        this.deleteProcessNodeTable(
                          val.nodeTableLists[childIndex].id,
                          val.nodeTableLists,
                          childIndex
                        )
                      } else {
                        val.nodeTableLists.splice(childIndex, 1)
                      }
                    }
                  })
                } else {
                  item.nodeTableLists.forEach(val => {
                    childIndex = val.nodeTableLists.findIndex(el => el === data)
                    if (childIndex !== -1) {
                      if (val.nodeTableLists[childIndex].id) {
                        this.deleteProcessNodeTable(
                          val.nodeTableLists[childIndex].id,
                          val.nodeTableLists,
                          childIndex
                        )
                      } else {
                        val.nodeTableLists.splice(childIndex, 1)
                      }
                    }
                  })
                }
              }
            }
          })
        }
      }).catch(error => console.log(error))
    },
    cloneData(original) {
      // 添加一个modal标题
      original.modalTitle = original.fieldName || ''
      // 深拷贝对象，防止默认空对象被更改
      return JSON.parse(JSON.stringify(original))
    },
    slideToggle(show) {
      const parent = this.$refs['card1']
      if (show) {
        parent.style.height = '98px'
      } else {
        parent.style.height = '35px'
      }
    },
    handleScroll() {
      this.backTop = window.pageYOffset >= this.height
    }
  }
}
</script>
<style type="text/scss" lang="scss">
.root {
  .card1 {
    .el-input__inner {
      // border: 0;
      // border-bottom: 1px solid #e5e5e5;
    }
  }
  .left {
    .el-collapse-item__header {
      padding-left: 10px;
      font-weight: bold;
    }
  }
  .default-class {
    position: absolute;
    z-index: 1000;
  }
}
</style>

<style type="text/scss" lang="scss" scoped>
.collection {
  color: #ffff00;
}
.eventtype-list {
  li {
    line-height: 24px;
  }
}
.root {
  width: 100%;
  height: 100vh;
  background: #fff;
  overflow: hidden;
  display: flex;
}
.left {
  width: 300px;
  height: 100vh;
  padding: 0 10px 10px;
  overflow: auto;
  float: left;
  border: 1px solid $dc1;

  .btn {
    width: 100%;
    padding: 5px 3px !important;
  }
}
.right {
  width: 300px;
  height: 100vh;
  float: right;
  overflow: auto;
  border: 1px solid $dc1;
  padding: 0 10px 10px;
}
.center {
  height: 100%;
  padding: 0 10px 10px;
  float: left;
  overflow: auto;
  flex: 1;
  .el-card {
    overflow: auto;
    .el-card__body {
      min-width: 960px;
    }
  }
}

.head-content {
  margin: 0 auto;
  padding: 15px 0px;
  background: $bc1;
  // border-left: 1px solid $dc1;
  // border-right: 1px solid $dc1;
  .title {
    margin-bottom: 15px;
    margin-left: 15px;
    margin-right: 15px;
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    .logo {
      float: left;
      margin-right: 10px;
      img {
        height: 36px;
      }
    }

    .title-text {
      height: 36px;
      line-height: 36px;
      overflow: hidden;
      font-size: 16px;
    }
  }
}
.content {
  background: $bc1;
  border: 1px dotted $dc1;
  padding-bottom: 54px;
  .border-0796F9 {
    border: 1px solid #2d42af;
  }
  .errors {
    background: #ffffcc;
    padding: 10px;
    margin: 10px;
    p {
      color: $danger;
      font-size: 14px;
      font-weight: bold;
    }
  }

  .card1 {
    padding: 0 5px 15px 15px;
    background: white;
    border-bottom: 1px solid $dc1;
    overflow: hidden;
    transition-duration: 0.5s;
    box-sizing: border-box;
    // height: 70px;
    .header {
      margin-right: 10px;
      display: flex;
      .title {
        height: 35px;
        line-height: 35px;
        color: $tc1;
        font-weight: bold;
      }
      .space {
        flex-grow: 1;
      }
    }
    .card-info {
      display: flex;
      justify-content: space-between;
      padding-right: 10px;
      padding-left: 15px;
      // .space {
      //   flex-grow: 1;
      // }
      // span {
      //   padding: 5px;
      // }
    }
  }

  .cancel-btn {
    background: $bc2;
    margin: 15px 0;
    width: 80px;
  }
  .save-btn {
    width: 80px;
    margin: 15px 10px;
  }
  .submit-btn {
    // background: $bc4;
    margin: 15px 0;
    width: 80px;
  }
}

.float-banner {
  position: fixed;
  right: calc(50% - 590px);
  bottom: 100px;
  width: 40px;

  .btn {
    width: 30px;
    height: 30px;
    margin-top: 5px;
    background: rgba(120, 120, 120, 0.3);
    text-align: center;
    line-height: 30px;
    font-size: 20px;
    color: white;
    cursor: pointer;
  }
}
.footer {
  position: fixed;
  z-index: 100;
  bottom: 0;
  height: 54px;
  line-height: 54px;
  right: 400px;
}
.sub-table {
  /*display: table-cell;*/
  vertical-align: middle;
  padding-right: 10px;
  width: 100%;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
  &-head {
    display: flex;
    align-items: flex-end;
    margin-bottom: 10px;
    .fill {
      flex-grow: 1;
    }
  }
  &-body {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    overflow-x: auto;
    border: solid 1px $dc1;
    table {
      min-width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
    }
    th {
      background: #f5f5f5;
      padding: 7px 10px;
      text-align: center;
    }
    tbody {
      td {
        text-align: center;
        padding: 20px 10px 20px;
        position: relative;
        /deep/ .el-input {
          min-width: 130px;
        }
        .checkText {
          position: absolute;
          bottom: 2px;
          font-size: 12px;
        }
      }
    }
  }
}
/deep/ .el-form-item__label {
  padding: 0 4px 0 0;
}
</style>

<style type="text/scss" lang="scss">
.subject {
  margin-left: 15px;
}
.subject input.el-input__inner {
  // border: 0;
  // border-bottom: 1px solid $dc1;
  width: 40%;

  &:focus {
    border-bottom: 1px solid $bc3;
  }
}
.specialSymbolsMessage.el-message {
  top: 140px !important;
}
</style>
