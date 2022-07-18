<template>
  <div id="modifyProcess" v-loading="load">
    <el-form :model="content" :rules="rules" ref="form" label-width="120px">
      <div class="card1" :class="[basic?'h-auto':'']" ref="card1">
        <div class="header">
          <span class="title">
            {{ $t('basicConfiguration') }}
          </span>
          <div class="space"></div>
          <el-button type="text" @click="isShow('card1','basic')">{{basic ? $t('putAway') : $t('unfold')}}</el-button>
        </div>
        <div class="card-info">
          <el-row>
            <el-col :span="8" :offset="2">
              <el-form-item :label="$t('modelClassification') + '：'">
                <el-input clearable v-model="ruleForm.modelName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="2">
              <el-form-item :label="$t('processName2') + '：'">
                <el-input clearable v-model="ruleForm.processname" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="2">
              <el-form-item :label="$t('processChineseName') + '：'" prop="processnamecn">
                <el-input class="w90" clearable v-model="ruleForm.processnamecn"></el-input>
                <el-tooltip placement="bottom">
                  <div slot="content">{{ $t('hintText.displanameforprocessinitiationandapproval') }}</div>
                  <i type="primary" class="el-icon-question bpaAll-icon" style="color:blue;"/>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="2">
              <el-form-item :label="$t('processPackageName') + '：'">
                <el-input class="w90" clearable v-model="ruleForm.spacename"></el-input>
                <el-tooltip placement="bottom">
                  <div slot="content">{{ $t('hintText.forcustomcodedevelopment') }}</div>
                  <i type="primary" class="el-icon-question bpaAll-icon" style="color:blue;"/>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8" :offset="2">
              <el-form-item :label="$t('flowChart') + '：'" prop="flowtype">
                <el-select clearable v-model="ruleForm.flowtype" :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
                  <el-option
                    v-for="item in options4"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="2">
              <el-form-item :label="$t('businessRule') + '：'" prop="isbusinessrole">
                <el-select clearable v-model="ruleForm.isbusinessrole" :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
                  <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
            <el-col :span="8" :offset="2">
              <el-form-item :label="$t('sort') + '：'" prop="sort">
                <el-input class="w90" clearable
                  type="number"
                  onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
                  v-model="ruleForm.sort"
                ></el-input>
                <el-tooltip placement="bottom">
                  <div slot="content">{{ $t('hintText.sortingofpromptsforapplicationcreationpage') }}</div>
                  <i type="primary" class="el-icon-question bpaAll-icon" style="color:blue;"/>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" :offset="2">
              <el-form-item :label="$t('iconBg') + '：'">
                <el-color-picker class="w90" v-model="ruleForm.color"></el-color-picker>
                <el-tooltip placement="bottom">
                  <div slot="content">{{ $t('hintText.thecoloroftheiconusedtoapplytocreatethepage') }}</div>
                  <i type="primary" class="el-icon-question bpaAll-icon" style="color:blue;"/>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="2">
              <el-form-item :label="$t('icon') + '：'">
                <el-popover class="popover" width="300" trigger="focus" v-model="isIconShow">
                  <!--<el-row class="icon">-->
                    <!--<el-col :span="24">-->
                      <ul>
                        <li v-for="(item, index) in iconList" :key="index">
                          <i
                            class="iconfont"
                            @click="selectIcon(item.className)"
                            :class="item.className"
                          ></i>
                        </li>
                      </ul>
                    <!--</el-col>-->
                  <!--</el-row>-->
                  <span slot="reference">
                    <el-input clearable v-model="ruleForm.icon" />
                  </span>
                </el-popover>
                <el-tooltip placement="bottom">
                  <div slot="content">{{ $t('hintText.iconstyleusedtoapplytocreateapage') }}</div>
                  <i type="primary" class="el-icon-question bpaAll-icon" style="color:blue;"/>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="card1" ref="card">
        <div class="header">
          <span class="title">{{ $t('advancedConfiguration') }}</span>
          <div class="space"></div>
          <el-button type="text" @click="isShow('card','expand')">{{expand ? $t('putAway') : $t('unfold')}}</el-button>
        </div>
        <div class="card-info">
          <!-- <el-row>
            <el-col :span="8" :offset="2">
              <el-form-item :label="$t('templateNode') + '：'">
                <el-input clearable v-model="ruleForm.templatenode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="2">
              <el-form-item :label="$t('frontPage') + '：'">
                <el-select clearable v-model="ruleForm.ispreposepage" :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row> -->
          <!-- <el-row>
            <el-col :span="8" :offset="2">
              <el-form-item :label="$t('handleTheFormBusinessYourself') + '：'">
                <el-select clearable v-model="ruleForm.userdefined" :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="2">
              <el-form-item :label="$t('projectName') + '：'">
                <el-select clearable v-model="ruleForm.linkproject" :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
                  <el-option
                    v-for="item in options3"
                   :key="item.projectTypeCode"
                    :label="item.projectTypeName"
                    :value="item.projectTypeCode"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row> -->

          <!-- <el-row>
            <el-col :span="8" :offset="2">
              <el-form-item :label="$t('whetherWebServiceInitiated') + '：'">
                <el-select clearable v-model="ruleForm.iswebservice" :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="2">
              <el-form-item :label="$t('modelDriven') + '：'">
                <el-select clearable v-model="ruleForm.ismodeldriven" :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>  -->
          <!-- <el-row v-show="ruleForm.ismodeldriven === 'Y'">
            <el-col :span="8" :offset="2">
              <el-form-item :label="$t('entityClassName') + '：'">
                <el-input clearable v-model="ruleForm.entityname"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="2">
              <el-form-item :label="$t('serviceName') + '：'">
                <el-input clearable v-model="ruleForm.defaultservice"></el-input>
              </el-form-item>
            </el-col>
          </el-row> -->
          <!-- <el-row v-show="ruleForm.iswebservice === 'Y'">
            <el-col :span="8" :offset="2">
              <el-form-item :label="$t('namespaces') + '：'">
                <el-input clearable v-model="ruleForm.functionname"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="2">
              <el-form-item :label="$t('functionName') + '：'">
                <el-input clearable v-model="ruleForm.functionname"></el-input>
              </el-form-item>
            </el-col>
          </el-row> -->
          <!-- <el-row>
            <el-col :span="8" :offset="2">
              <el-form-item :label="$t('processModel') + '：'">
                <el-select clearable v-model="ruleForm.processmode" :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
                  <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="2">
              <el-form-item :label="$t('functionalClassification') + '：'">
                <el-select clearable v-model="ruleForm.funid" :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
                  <el-option
                    v-for="item in funidList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row> -->
          <!-- <el-row>
            <el-col :span="8" :offset="2">
              <el-form-item :label="$t('projectName2') + '：'">
                <el-input clearable v-model="ruleForm.projectname"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="2">
              <el-form-item :label="$t('dragPageName') + '：'">
                <el-input
                  @click.native="formPage = true"
                  clearable
                  v-model="ruleForm.configformName"
                  readonly
                ></el-input>
              </el-form-item>
            </el-col>
            
          </el-row> -->
          <el-row>
            <!-- <el-col :span="8" :offset="2">
              <el-form-item :label="$t('helpType') + '：'">
                <el-select clearable v-model="ruleForm.helptype" :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
                  <el-option
                    v-for="item in options5"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
             <el-col :span="8" :offset="2">
              <el-form-item :label="$t('fourEyesPrinciple') + '：'">
                <el-select class="w90" clearable v-model="ruleForm.skyeye" :placeholder="$t('placeholderText.pleaseSelect')">
                  <el-option 
                    v-for="item in options7"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-tooltip placement="bottom">
                  <div slot="content">{{ $t('hintText.ifthereareanytwoadjacentapproversafteractivationitisnotallowedtoinitiate') }}</div>
                  <i type="primary" class="el-icon-question bpaAll-icon" style="color:blue;"/>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8" :offset="2">
              <el-form-item label="复制流程：" >
                <el-button @click="userHandle('复制流程')">选择流程复制</el-button>
              </el-form-item>
            </el-col>-->
          </el-row>
          <!-- <el-row>
            <el-col :span="8" :offset="2">
              <el-form-item :label="$t('mobileCamera') + '：'">
                <el-select clearable v-model="ruleForm.ismobilepic" :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="2">
              <el-form-item :label="$t('processType') + '：'">
                <el-select clearable v-model="ruleForm.isAutomationProcess" :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
                  <el-option
                    v-for="item in options6"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row> -->
          <!-- <el-row>
            <el-col :span="8" :offset="2">
              <el-form-item :label="$t('customPrinting') + '：'">
                <el-select clearable v-model="ruleForm.definePrint" :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row> -->
          <!-- <el-row>
            <el-col :span="20" :offset="2">
              <el-form-item :label="$t('helpContent') + '：'">
                <el-input clearable type="textarea" v-model="ruleForm.helpcontent"></el-input>
              </el-form-item>
            </el-col>
          </el-row> -->
          <el-row>
            <el-col :span="20" :offset="2">
              <el-form-item :label="$t('processManager2') + '：'">
                <el-input class="w90"
                  type="textarea"
                  clearable
                  @focus="handelCkeckAdmian"
                  v-model="ruleForm.adminUserNames"
                ></el-input>
                <el-tooltip placement="bottom">
                  <div slot="content">{{ $t('hintText.usedwhentheprocessnodelacksanapproveritwillautomaticallyflowtotheprocessadministratorforprocessing') }}</div>
                  <i type="primary" class="el-icon-question bpaAll-icon" style="color:blue;"/>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
    <div class="text-r">
      <el-button type="primary" @click="saveForm('form')">{{ $t('submit') }}</el-button>
      <el-button type="primary" @click="emptyConfig">{{ $t('clearConfiguration') }}</el-button>
      <el-button type="primary" @click="userHandle($t('fieldPermissions'))">{{ $t('fieldPermissions') }}</el-button>
      <el-button type="primary" @click="exportPro">{{ $t('exportProcess') }}</el-button>
      <el-upload
        style="display: inline-block;"
        class="upload-demo"
        ref="upload"
        :action="action"
        :with-credentials="true"
        :headers="myHeaders"
        :before-upload="beforeAvatarUpload"
        :auto-upload="true"
        :file-list.sync="fileList"
        :show-file-list="false"
        :multiple="false"
        :on-success="onSuccess"
        :on-error="onError"
      >
        <el-button slot="trigger" type="primary">{{ $t('importProcess') }}</el-button>
      </el-upload>
      <!-- <el-button type="primary" @click="releaseProcessHandle">{{ $t('synchronizationprocess') }}</el-button> -->
      <el-tooltip placement="bottom">
        <div slot="content">{{ $t('hintText.Theprocesscanbesynchronizedtootherenvironments') }}</div>
        <i type="primary" class="el-icon-question bpaAll-icon" style="color:blue;"/>
      </el-tooltip>
    </div>
    <field-permissions-dialog
      v-model="dialogVisible"
      :id="ruleForm.processId"
      :title="linkTitle"
      :treeData="treeData"
    />
    <select-process-dialog v-model="processDialog" :title="processTitle" />
    <formPageDialog v-model="formPage" @confirm="getFormName" />
    <bas-organieation
      v-model="organieationShow"
      :selectedElement="selectedElement"
      :isSpecifiedGroupBut="false"
      :isShowBustomGroupsBut="false"
      :selectElement="selectElement"
      :showElement="showElement"
      :title="orgtitle"
      @fnCallBack="fnBasOrganieationCallBack"/>
    <release-process-dialog v-model="releaseProcessDialog" :processId="content.processId"/>

  </div>
</template>
<script>
import Vue from 'vue'
import fieldPermissionsDialog from "./fieldPermissionsDialog";
import selectProcessDialog from "./processDialog";
import releaseProcessDialog from "./releaseProcessDialog";
import formPageDialog from "./formPageDialog";
import axios from "axios";
import FileSaver from "file-saver";
import {
  updateProcess,
  getAllFunction,
  clearProcessConfigData
} from "@/bpm/api/process/processModeling/classificationModel";
import BasComponent from 'bas-component'
Vue.use(BasComponent)
import 'bas-component/lib/BasComponent.css'
export default {
  name: "modifyProcess",
  components: {
    fieldPermissionsDialog,
    selectProcessDialog,
    formPageDialog,
    releaseProcessDialog
  },
  props: {
    content: {
      type: Object
    },
    funidList: {
      type: Array,
      default: () => []
    },
    options3: {
      type: Array,
      default: () => []
    },
    treeData: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    iconList() {
      return this.$store.state.icon.iconList;
    }
  },
  data() {
    return {
      processData:{},
      releaseProcessDialog:false,
      organieationShow:false,
      selectedElement: {},
      showElement:[],
      selectElement: ["9"],
      orgtitle:'选择管理员',
      fileList: [],
      action: "",
      myHeaders: { token: localStorage.getItem("token") },
      formPage: false,
      load: false,
      isIconShow: false,
      ruleForm: {},
      rules: {
        sort: [{ required: true, message: this.$t('hintText.sortCannotBeEmpty'), trigger: "blur" }],
        processnamecn: [
          { required: true, message: this.$t('hintText.theChineseNameOfTheProcessCannotBeEmpty'), trigger: "blur" }
        ],
        flowtype: [
          { required: true, message: this.$t('hintText.flowchartCannotBeEmpty'), trigger: "chang" }
        ],
        isbusinessrole: [
          { required: true, message: this.$t('hintText.businessRulesCannotBeEmpty'), trigger: "chang" }
        ]
      },
      expand: false,
      basic: true,
      dialogVisible: false,
      processDialog: false,
      linkTitle: "",
      processTitle: "",
      options: [
        {
          value: "Y",
          label: this.$t('yes')
        },
        {
          value: "N",
          label: this.$t('no')
        }
      ],
    
      options1: [
        {
          value: "other",
          label: "other"
        },
        {
          value: "OA",
          label: "OA"
        }
      ],
      options2: [
        {
          value: "Y",
          label: this.$t('need')
        },
        {
          value: "N",
          label: this.$t('notNeeded')
        }
      ],
      options4: [
        {
          value: "bpmFlow",
          label: this.$t('modelingFlowchart')
        },
        {
          value: "businessUserFlow",
          label: this.$t('businessFlowchart')
        }
      ],
      options5: [
        {
          value: "content",
          label: "content"
        },
        {
          value: "url",
          label: "url"
        }
      ],
      options6: [
        {
          value: 2,
          label: this.$t('customProcess')
        },
        {
          value: 1,
          label: this.$t('freeFlow')
        },
        {
          value: 0,
          label: this.$t('developmentProcess')
        }
      ],
        options7: [
        {
          value: "1",
          label: this.$t('yes')
        },
        {
          value: "0",
          label: this.$t('no')
        }
      ],
    };
  },
  watch: {
    content(val) {
       this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
      this.ruleForm = val;
      this.action = `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/processMigrate/import/${val.processname}/${this.treeData.bpamodelid}`;
    }
  },
  mounted(){
    
  },
  methods: {
    selectIcon(className) {
      this.ruleForm.icon = className;
      this.isIconShow = false;
    },
    handelCkeckAdmian() {
      this.selectedElement = {};
      if (this.ruleForm.adminUserIds) {
        let list = this.ruleForm.adminUserNames.split("、").join("&");
        let idType = []
        this.ruleForm.adminUserIds.split(",").forEach((item, i) => {
          idType.push(`${item}-9`)
        });
        this.selectedElement = {
          id: this.ruleForm.adminUserIds.split(","),
          name: list,
          idType: idType.join(";"),
        }
      }
      this.organieationShow = true
    },
    emptyConfig() {
      this.$confirm(this.$t('hintText.areYouSureToClearTheFormFieldConfiguration'), this.$t('hintText.hint'), {
        type: "warning"
      })
        .then(() => {
          this.load = true;
          clearProcessConfigData(this.content.processId, {
            version: this.treeData.version
          })
            .then(rt => {
              this.load = false;
              if (rt.status === "200") {
                this.$emit("treeRefresh");
                this.$message.success(this.$t('hintText.operateSuccessfully'));
              }
            })
            .catch(er => {
              this.load = false;
            });
        })
        .catch(_ => {});
    },
    beforeAvatarUpload(file) {
      const isTXT = file.type === "text/plain";
      const isLt2M = file.size / 1024 / 1024 < 100;
      if (!isLt2M) {
        this.$message.error(this.$t('hintText.uploadAttachmentSizeCannotExceed'));
      }
      if (!isTXT) {
        this.$message.error(this.$t('hintText.theImportProcessCanOnlyBeInTXTFormat'));
      }

      return isTXT && isLt2M;
    },
    onError(file) {
      this.$message.error(this.$t('hintText.importFailed'));
    },
    onSuccess(file) {
      if (file.status === "200") {
        this.$message.success(this.$t('hintText.importedSuccessfully'));
        this.$parent.$parent.$parent.getModeData();
      } else {
        this.$message.success(file.message);
      }
    },
    exportPro() {
      this.$loading();
      axios({
        method: "post",
        url: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/processMigrate/export/${this.ruleForm.processId}`,
        headers: {
          token: localStorage.getItem("token")
        },
        responseType: "blob"
      })
        .then(res => {
          this.$loading().close();
          let blob = new Blob([res.data], { type: "" });
          FileSaver.saveAs(blob, `${this.ruleForm.processnamecn}.txt`);
        })
        .catch(() => {
          this.$loading().close();
        });
    },
    getFormName(data) {
      console.log(data);
      this.ruleForm.configformName = data.dictionarycn;
    },
    saveForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.ruleForm.processnamecn.length > 200) {
            this.$message.error(this.$t('processChineseName') + this.$t('superLong'))
            return false;
          } else if (this.ruleForm.spacename.length.length > 200) {
            this.$message.error(this.$t('processPackageName') + this.$t('superLong'))
            return false;
          } else if (this.ruleForm.sort && String(this.ruleForm.sort).length > 10) {
            this.$message.error(this.$t('sortingIsTooLong'))
            return false;
          } else if (this.ruleForm.templatenode.length > 200) {
            this.$message.error(this.$t('templateNode') + this.$t('superLong'))
            return false;
          }
          this.load = true;
          updateProcess({
            ...this.ruleForm,
            version: this.treeData.version
          })
            .then(rt => {
              this.load = false;
              if (rt.status === "200") {
                this.$message.success(this.$t('hintText.submittedSuccessfully'));
              }
            })
            .catch(er => {
              this.load = false;
            });
        }
      });
    },
    userHandle(type) {
      if (type === this.$t('fieldPermissions')) {
        this.linkTitle = type;
        this.dialogVisible = true;
      } else if (type === this.$t('copyProcess')) {
        this.processTitle = type;
        this.processDialog = true;
      }
    },
    releaseProcessHandle(){
      this.releaseProcessDialog = true
    },
    refreshData() {},
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
    fnBasOrganieationCallBack(data) {
      this.ruleForm.adminUserIds = data.id;
      this.ruleForm.adminUserNames = data.name.split('&').join("、");
      this.organieationShow = false;

    },
  }
};
</script>
<style lang="scss">
#modifyProcess {
  .popover{
    .el-input{
      width: 90%;
    }
  }
  .avatar-uploader .el-upload {
    border: 1px dashed $dc1;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
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
.el-popover li {
  display: inline-block;
  vertical-align: top;
}
.el-popover li i {
  width: 30px;
  height: 30px;
  line-height: 30px;
  list-style: none;
  display: block;
  text-align: center;
  margin-top: 10px;
  cursor: pointer;
  -webkit-transition: font-size 0.25s linear, width 0.25s linear;
  -moz-transition: font-size 0.25s linear, width 0.25s linear;
  transition: font-size 0.25s linear, width 0.25s linear;
}

.el-popover li:hover i {
  font-size: 30px;
}
#modifyProcess {
  .w100 {
    width: 100%;
  }
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
  .h-auto {
    height: auto;
  }
}
.w90 {
  width: 90% !important;
}

</style>
