<template>
  <div id="modifyFlowNode" v-loading="load">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="140px"
    >
      <div ref="card1" class="card1" :class="[basic ? 'h-auto' : '']">
        <div class="header">
          <span class="title">
            {{ $t("basicConfiguration") }}
          </span>
          <div class="space" />
          <el-button type="text" @click="isShow('card1', 'basic')">
            {{ basic ? $t("putAway") : $t("unfold") }}
          </el-button>
        </div>
        <div class="card-info">
          <el-row>
            <el-col :span="10">
              <el-form-item :label="$t('processName2') + '：'">
                <el-input
                  v-model="ruleForm.processinfoname"
                  clearable
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-form-item :label="$t('nodeName') + '：'">
                <el-input v-model="ruleForm.activityname" clearable disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <!-- <el-form-item :label="$t('tableName') + '：'" v-if="ruleForm.activityname !== 'Start'" >
                <el-input clearable v-model="ruleForm.tablename"></el-input>
              </el-form-item>-->
              <!-- 表名称 -->
              <el-form-item v-show="ruleForm.activityname === 'Start'" :label="$t('tableName') + '：'" prop="tablename">
                <el-input
                  v-model="ruleForm.tablename"
                  clearable
                  :class="[
                    ruleForm.activityname === 'Start' ? 'isrequired w90' : 'w90',
                  ]"
                  @input="$refs.ruleForm.validateField(['tablename'])"
                />
                <el-tooltip placement="bottom">
                  <div slot="content">{{$t('tablenamePromptText')}}</div>
                  <i type="primary" class="el-icon-question bpaAll-icon" style="color:blue;"/>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8" :offset="2">
              <el-form-item :label="$t('sort') + '：'" prop="sortid">
                <el-input
                  v-model="ruleForm.sortid"
                  type="number"
                  clearable
                  on-keypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
                />
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item :label="$t('approvalType') + '：'" prop="approvetype">
                <el-select
                  v-model="ruleForm.approvetype"
                  clearable
                  :placeholder="$t('placeholderText.pleaseSelect')"
                  class="w100"
                >
                  <el-option
                    v-for="item in approveTypeList"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-form-item :label="$t('parallelAutomaticPassRate') + '：'"  prop="percentofpass">
                <el-input-number
                  :min="1" :max="100"
                  :controls="false"
                  v-model="ruleForm.percentofpass"
                  :placeholder="$t('hintText.pleaseEnterIntegerGreaterThan0To100')"
                  clearable
                  class="w90"
                ></el-input-number>
                <el-tooltip placement="bottom">
                  <div slot="content">{{$t('parallelAutomaticPassRateExplain')}}</div>
                  <i type="primary" class="el-icon-question bpaAll-icon" style="color:blue;"/>
                  <!-- <el-button size='mini' type="primary" icon="el-icon-question" circle></el-button> -->
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div ref="card" class="card1">
        <div class="header">
          <span class="title">
            {{ $t("advancedConfiguration") }}
          </span>
          <div class="space" />
          <el-button type="text" @click="isShow('card', 'expand')">
            {{ expand ? $t("putAway") : $t("unfold") }}
          </el-button>
        </div>
        <div class="card-info">
          <!-- <el-row>
            <el-col :span="8" :offset="2">
              <el-form-item :label="$t('nodeType') + '：'">
                <el-select
                  v-model="ruleForm.isapplicant"
                  clearable
                  :placeholder="$t('placeholderText.pleaseSelect')"
                  class="w100"
                >
                  <el-option
                    v-for="item in nodeTypeList"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="2">
              <el-form-item
                v-if="ruleForm.activityname === 'End'"
                :label="$t('nodeParameters') + '：'"
              >
                <el-input v-model="ruleForm.parameter" clearable />
              </el-form-item>
              <el-form-item
                v-else
                :label="$t('nodeParameters') + '：'"
                prop="parameter"
              >
                <el-input v-model="ruleForm.parameter" clearable />
              </el-form-item>
            </el-col>
          </el-row> -->
          <el-row>
            <el-col :span="10">
              <el-form-item :label="$t('nodeProperties') + '：'" prop="businesstype">
                <el-select
                  v-model="ruleForm.businesstype"
                  :placeholder="$t('placeholderText.pleaseSelect')"
                  class="w90"
                >
                  <el-option
                    v-for="item in businesstypeList"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  />
                </el-select>
                <el-tooltip placement="bottom">
                  <div slot="content">{{ $t('hintText.onlyApprovalNodeParticipateseProcessAnalysisReportStatistics') }}</div>
                  <i type="primary" class="el-icon-question bpaAll-icon" style="color:blue;"/>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-form-item :label="$t('customCode') + '：'">
                <el-select
                  v-model="ruleForm.personalcode"
                  clearable
                  :placeholder="$t('placeholderText.pleaseSelect')"
                  :popper-append-to-body="false"
                  class="w90"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-tooltip placement="bottom">
                  <div slot="content">{{$t('customCodePromptText')}}</div>
                  <i type="primary" class="el-icon-question bpaAll-icon" style="color:blue;"/>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item :label="$t('customPage') + '：'">
                <el-select
                  v-model="ruleForm.isdefined"
                  clearable
                  :placeholder="$t('placeholderText.pleaseSelect')"
                  :popper-append-to-body="false"
                  class="w90"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-tooltip placement="bottom">
                  <div slot="content">{{$t('customPagePromptText')}}</div>
                  <i type="primary" class="el-icon-question bpaAll-icon" style="color:blue;"/>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-form-item :label="$t('nodeEnglishName') + '：'">
                <el-input class="w90" v-model="ruleForm.activityinfo" clearable />
                <el-tooltip placement="bottom">
                  <div slot="content">{{$t('nodeEnglishNamePromptText')}}</div>
                  <i type="primary" class="el-icon-question bpaAll-icon" style="color:blue;"/>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="8" :offset="2">
              <el-form-item :label="$t('description') + '：'">
                <el-input v-model="ruleForm.description" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="2">
              <el-form-item :label="$t('pageTitle') + '：'">
                <el-input v-model="ruleForm.tasktitle" clearable />
              </el-form-item>
            </el-col>
          </el-row> -->

          <el-row>
            <el-col :span="10" style="position: relative">
              <el-form-item :label="$t('approvalPeriod') + '：'">
                <el-input class="w90"
                  v-model="ruleForm.deadline"
                  @input="checkVal"
                  clearable
                  maxlength="10"
                  placeholder
                />
                <el-tooltip placement="bottom">
                  <div slot="content">{{$t('approvalPeriodPromptText')}}</div>
                  <i type="primary" class="el-icon-question bpaAll-icon" style="color:blue;"/>
                </el-tooltip>
              </el-form-item>
              <div style="color: red; float: right;">
                ({{ $t("approvalDeadlineFormat") }}：'XXXDXXHXXM'，{{
                  $t("xIsANumber")
                }})
              </div>
            </el-col>
            <!-- <el-col :span="10" :offset="1">
              <el-form-item :label="$t('nodeType') + '：'">
                <el-select
                  v-model="ruleForm.nodetypeid"
                  clearable
                  :placeholder="$t('placeholderText.pleaseSelect')"
                  :popper-append-to-body="false"
                  class="w100"
                >
                  <el-option
                    v-for="item in nodeTypeListTwo"
                    :key="item.id"
                    :label="item.namecn"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item :label="$t('texting') + '：'">
                <el-select
                  v-model="ruleForm.autoapprovewhenexpire"
                  clearable
                  :placeholder="$t('placeholderText.pleaseSelect')"
                  class="w90"
                  :disabled="!ruleForm.deadline"
                  :popper-append-to-body="false"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-tooltip placement="bottom">
                  <div slot="content">{{$t('textingPromptText')}}</div>
                  <i type="primary" class="el-icon-question bpaAll-icon" style="color:blue;"/>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-form-item :label="$t('whetherToAllowRepeatedSkips') + '：'">
                <el-select
                  v-model="ruleForm.iscanskip"
                  clearable
                  :placeholder="$t('placeholderText.pleaseSelect')"
                  :popper-append-to-body="false"
                  class="w90"
                >
                  <el-option
                    v-for="item in options5"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-tooltip placement="bottom">
                  <div slot="content">{{$t('whetherToAllowRepeatedSkipsPromptText')}}</div>
                  <i type="primary" class="el-icon-question bpaAll-icon" style="color:blue;"/>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item
                :label="$t('whetherThereIsAnInitiationOperation') + '：'"
              >
                <el-select
                  v-model="ruleForm.iscancreate"
                  clearable
                  :placeholder="$t('placeholderText.pleaseSelect')"
                  :popper-append-to-body="false"
                  class="w90"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-tooltip placement="bottom">
                  <div slot="content">{{$t('whetherThereIsAnInitiationOperationPromptText')}}</div>
                  <i type="primary" class="el-icon-question bpaAll-icon" style="color:blue;"/>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8" :offset="2">
              <el-form-item :label="$t('helpType') + '：'">
                <el-select
                  v-model="ruleForm.helptype"
                  clearable
                  :placeholder="$t('placeholderText.pleaseSelect')"
                  class="w100"
                >
                  <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row>
            <!-- <el-col :span="8" :offset="2">
              <el-form-item :label="$t('form') + '：'">
                <el-input v-model="ruleForm.formid" clearable />
              </el-form-item>
            </el-col> -->
            <el-col :span="10">
              <el-form-item :label="$t('nodeSuspendRuleHour') + '：'">
                <el-input-number
                  :precision="1"
                  :controls="false"
                  v-model="ruleForm.supendhours"
                  :placeholder="$t('hintText.pleaseEnterOnlyOneDecimalPoint')"
                  clearable
                  class="w90"
                ></el-input-number>
                <el-tooltip placement="bottom">
                  <div slot="content">{{$t('nodeSuspendRuleHourPromptText')}}</div>
                  <i type="primary" class="el-icon-question bpaAll-icon" style="color:blue;"/>
                </el-tooltip>
              </el-form-item>
            </el-col>

            <!-- <el-col :span="8" :offset="2">
              <el-form-item :label="$t('flowchartNodeType') + '：'">
                <el-select
                  v-model="ruleForm.processflownodetype"
                  clearable
                  :placeholder="$t('placeholderText.pleaseSelect')"
                  class="w100"
                >
                  <el-option
                    v-for="item in options3"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item :label="$t('form') + '：'">
<!--                <el-input v-model="ruleForm.formid" clearable />-->
                <el-input class="w90" v-model="ruleForm.formname" @focus="isShowLinkPage" />
                <el-tooltip placement="bottom">
                  <div slot="content">{{$t('formPromptText')}}</div>
                  <i type="primary" class="el-icon-question bpaAll-icon" style="color:blue;"/>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8" :offset="2">
                        <el-form-item label="处理方式：" >
                          <el-select clearable v-model="ruleForm.tasktitle" :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
                                <el-option
                                v-for="item in options4"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
            </el-col>-->
            <!-- urginglimit -->
            <el-col :span="10" :offset="1">
              <el-form-item :label="$t('urginglimit') + '：'">
                <el-select
                  clearable
                  v-model="ruleForm.urgelimit"
                  :placeholder="$t('placeholderText.pleaseSelect')"
                  :popper-append-to-body="false"
                  class="w90"
                >
                  <el-option
                    v-for="item in limitoptions"
                    :key="item.value + 1"
                    :label="item.text"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <el-tooltip placement="bottom">
                  <div slot="content">{{$t('urginglimitPromptText')}}</div>
                  <i type="primary" class="el-icon-question bpaAll-icon" style="color:blue;"/>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item :label="$t('batchapproval')">
                <el-select
                  clearable
                  v-model="ruleForm.isapprovedlist"
                  :placeholder="$t('placeholderText.pleaseSelect')"
                  :popper-append-to-body="false"
                  class="w90"
                >
                  <el-option
                    v-for="item in isapprovedlistoptions"
                    :key="item.value + 2"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <el-tooltip placement="bottom">
                  <div slot="content">{{$t('batchapprovalPromptText')}}</div>
                  <i type="primary" class="el-icon-question bpaAll-icon" style="color:blue;"/>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item :label="$t('helpContent') + '：'">
                <el-input class="w90"
                  v-model="ruleForm.helpcontent"
                  clearable
                  type="textarea"
                />
                <el-tooltip placement="bottom">
                  <div slot="content">{{$t('helpContentPromptText')}}</div>
                  <i type="primary" class="el-icon-question bpaAll-icon" style="color:blue;"/>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="20" :offset="2">
              <el-form-item
                :label="$t('businessControl')"
                :title="
                  $t(
                    'usedForTheParameterConfigurationOfTheBusinessSystemBbasedOnTheActiveNodeGenerallyJson'
                  )
                "
              >
                <el-input
                  v-model="ruleForm.controlfield"
                  type="textarea"
                  clearable
                  maxlength="1000"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row> -->
        </div>
      </div>
    </el-form>
    <el-row>
      <div class="text-r">
        <!-- <el-button @click>删除该节点</el-button> -->
        <el-button type="primary" @click="saveForm('ruleForm')">
          {{ $t("submit") }}
        </el-button>
        <!-- <el-button type="primary" @click>生成自定义页面</el-button> -->
      </div>
    </el-row>
    <choose-form-page v-model="formPageDialog" @confirm="handleFormPage" />
  </div>
</template>
<script>
import {
  updateProcessNode,
  getDictionaryOption,
  getNodeTypeListByProcessId,
} from "@/bpm/api/process/processModeling/classificationModel";
import ChooseFormPage from "./chooseFormPage";
const tablename = [
  // { required: true, message: this.$t('tableNameCannotBeEmpty'), trigger: 'blur' }
  { required: true, message: "表名称不能为空", trigger: "blur" },
];

export default {
  name: "ModifyFlowNode",
  components: {
    ChooseFormPage
  },
  props: {
    content: {
      type: Object,
    },
    treeData: {
      type: Object,
    },
  },
  data() {
    return {
      load: false,
      nodeTypeListTwo: [],
      ruleForm: {
        percentofpass: 100,
        businesstype: '',
        autoapprovewhenexpire: "N"
      },
      options: [
        {
          value: "Y",
          label: this.$t("yes"),
        },
        {
          value: "N",
          label: this.$t("no"),
        },
      ],
      options1: [
        {
          value: "N",
          label: this.$t("approval"),
        },
        {
          value: "Y",
          label: this.$t("approver"),
        },
        {
          value: "zh",
          label: this.$t("notify"),
        },
        {
          value: "W",
          label: "webservice",
        },
        {
          value: "L",
          label: this.$t("authority"),
        },
      ],
      options2: [
        {
          value: "content",
          label: "content",
        },
        {
          value: "url",
          label: "url",
        },
      ],
      options3: [],
      limitoptions: [],
      approveTypeList:[],
      isapprovedlistoptions: [
        {
          value: "Y",
          label: "是",
        },
        {
          value: "N",
          label: "否",
        },
      ],
      options4: [
        {
          value: "serial",
          label: "节点内串行",
        },
        {
          value: "single",
          label: "节点内竞争",
        },
        {
          value: "parallel",
          label: "会签",
        },
      ],
      options5: [
        {
          value: "N",
          label: this.$t("noSkip"),
        },
        {
          value: "Y",
          label: this.$t("adjacentNodeSkip"),
        },
        {
          value: "S1",
          label: this.$t("noAdjacentKeepFirstNode"),
        },
        {
          value: "S2",
          label: this.$t("noAdjacentKeepLastNode"),
        },
      ],
      rules: {
        sortid: [
          {
            required: true,
            message: this.$t("hintText.sortCannotBeEmpty"),
            trigger: "blur",
          },
        ],
        parameter: [
          {
            required: true,
            message: this.$t("hintText.nodeParameterCannotBeEmpty"),
            trigger: "blur",
          },
        ],
        approvetype: [
          {
            required: true,
            message: this.$t("hintText.theRequiredFieldsMustNotBeEmpty"),
            trigger: "change",
          },
        ],
        businesstype: [
          {
            required: true,
            message: this.$t("hintText.theRequiredFieldsMustNotBeEmpty"),
            trigger: "change",
          },
        ],
        percentofpass: [
          {
            required: true,
            message: this.$t("hintText.theRequiredFieldsMustNotBeEmpty"),
            trigger: "blur",
          },
        ],
      },
      nodeTypeList: [],
      businesstypeList: [],
      expand: false,
      basic: true,
      formPageDialog: false
    };
  },
  watch: {
    content(val) {
      this.ruleForm = val;
      console.log(this.ruleForm)
      this.$set(this.ruleForm, 'businesstype', this.ruleForm.businesstype || 'approve')
      if (this.ruleForm) {
        this.$refs["ruleForm"].clearValidate();
        if (this.ruleForm.activityname === "Start") {
          Object.assign(this.rules, {
            tablename,
          });
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs["ruleForm"].validateField(["tablename"]);
            });
          }, 0);
        } else {
          Object.assign(this.rules, {
            tablename: [],
          });
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs["ruleForm"].clearValidate(["tablename"]);
            });
          }, 0);
        }
        getNodeTypeListByProcessId(this.ruleForm.processinfoid).then((rt) => {
          this.nodeTypeListTwo = rt.data.list;
        });
      }
    },
  },
  mounted() {
    getDictionaryOption({
      dictionaryen: "nodeBusinessType",
    }).then((rt) => {
      this.businesstypeList = rt.data;
    });
    getDictionaryOption({
      dictionaryen: "bpmNodeType",
    }).then((rt) => {
      this.nodeTypeList = rt.data;
    });
    getDictionaryOption({
      dictionaryen: "节点类型",
    }).then((rt) => {
      this.options3 = rt.data;
    });
    getDictionaryOption({
      dictionaryen: "催办限制",
    }).then((rt) => {
      this.limitoptions = rt.data;
    });
    getDictionaryOption({
      dictionaryen: "审批类型",
    }).then((rt) => {
      this.approveTypeList = rt.data;
    });
  },
  methods: {
    checkVal() {
      if (!this.ruleForm.deadline) {
        this.ruleForm.autoapprovewhenexpire = "N";
      }
    },
    saveForm(formName) {
      this.$refs[formName].validate((valid) => {
        const than = this;
        if (valid) {
          if (than.ruleForm.tablename && than.ruleForm.tablename.length > 200) {
            than.$message.error(this.$t("tableName") + this.$t("superLong"));
            return false;
          } else if (than.ruleForm.sortid && than.ruleForm.sortid.length > 10) {
            than.$message.error(this.$t("sortingIsTooLong"));
            return false;
          } else if (
            than.ruleForm.tasktitle &&
            than.ruleForm.tasktitle.length > 100
          ) {
            than.$message.error(this.$t("pageTitle") + this.$t("superLong"));
            return false;
          } else if (
            than.ruleForm.deadline &&
            than.ruleForm.deadline.length > 200
          ) {
            than.$message.error(
              this.$t("approvalPeriod") + this.$t("superLong")
            );
            return false;
          }
          // else if (than.ruleForm.formid && than.ruleForm.formid.length > 10) {
          //   than.$message.error(this.$t("form") + this.$t("superLong"));
          //   return false;
          // }
          than.load = true;
          let obj = Object.assign({}, than.ruleForm);
          obj.textingchecked = obj.textingchecked.join(",");
          updateProcessNode({
            ...obj,
            version: this.treeData.version
          })
            .then((rt) => {
              than.load = false;
              if (rt.status === "200") {
                this.$emit("confirm", true);
                than.$message.success(
                  this.$t("hintText.submittedSuccessfully")
                );
              }
            })
            .catch((er) => {
              than.load = false;
            });
        }
      });
    },
    isShow(c, el) {
      this[el] = !this[el];
      this.slideToggle(c, this[el]);
    },
    slideToggle(c, show) {
      const parent = this.$refs[c];
      if (show) {
        parent.style.overflow = "hidden";
        parent.style.height = 40 + parent.lastElementChild.offsetHeight + "px";
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          parent.style.overflow = "auto";
          parent.style.height = "auto";
        }, 500);
      } else {
        parent.style.overflow = "hidden";
        parent.style.height = 40 + parent.lastElementChild.offsetHeight + "px";
        setTimeout(() => {
          parent.style.overflow = "hidden";
          parent.style.height = "35px";
        }, 10);
      }
    },
    isShowLinkPage() {
      this.formPageDialog = true;
    },
    handleFormPage(data) {
      this.$set(this.ruleForm, "formname", data.name);
      this.$set(this.ruleForm, "formid", data.id);
    }
  },
};
</script>
<style lang="scss">
#modifyFlowNode {
  .isrequired::before {
    content: "*";
    position: absolute;
    left: -70px;
    color: red;
  }
  .el-form-item__label {
    color: $tc1;
    font-size: 12px;
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
#modifyFlowNode {
  .card1 {
    padding: 0 5px 15px 15px;
    background: white;
    border-bottom: 1px solid $dc1;
    overflow: hidden;
    transition-duration: 0.5s;
    box-sizing: border-box;
    height: 35px;

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
  }
  .w90 {
    width: 90%;
  }
  .w100 {
    width: 100%;
  }
  .h-auto {
    height: auto;
  }
}
</style>
