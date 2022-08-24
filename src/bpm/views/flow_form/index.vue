<template>
  <div class="root processForm" v-loading="pageLoading">
    <remote-script
      v-if="scriptPublic"
      :src="scriptPublic"
      @load="PublicLoad"
    ></remote-script>
    <remote-script
      v-if="scriptPrivatc"
      :src="scriptPrivatc"
      @error="load"
      @load="load"
    ></remote-script>
    <div
      :style="{
        minWidth: isPrint ? '940px' : '1080px',
        width: isPrint ? '940px' : '56vw',
      }"
      class="info"
      ref="companyStyle"
    >
      <div class="head-content">
        <div class="title">
          <!-- <div>
            <div class="logo">
              <img class="logo" :src="logo" alt />
            </div>
            <div class="title-text">{{decodeURIComponent($route.query.name)}}</div>
          </div>
          <div class="title-text" v-if="node.reqno">{{node.reqno}}</div> -->
          <el-row style="width: 100%">
            <el-col :span="18">
              <div class="logo">
                <img class="logo" :src="logo" alt />
              </div>
              <div class="title-text">
                {{ decodeURIComponent($route.query.name) }}
              </div>
              <!-- <span v-if="node.processNodeName !== 'Start' || node.subjectRequired==='Y'"> -->
              <span v-if="node.processNodeName === 'Start'">
                <span v-if="node.subjectRequired === 'Y'">
                  <div class="subject">
                    <el-input
                      clearable
                      v-model="node.subject"
                      :disabled="isSubjectEdit"
                      show-word-limit
                      :prefix-icon="isSubjectEdit ? '' : 'el-icon-edit'"
                      :placeholder="$t('placeholderText.pleaseEnterSubject')"
                    >
                    </el-input>
                    <el-checkbox style="margin-left: 30px;" :false-label="0" :true-label="1" v-model="node.priority">
                      <span style="color: red; font-size: 16px;">{{ $t("urgent") }}</span>
                    </el-checkbox>
                  </div>
                </span>
                <span
                  v-else-if="
                    node.subjectRequired && node.subjectRequired === 'N'
                  "
                >
                </span>
                <span v-else>
                  <div class="subject">
                    <el-input
                      v-model="node.subject"
                      disabled
                      :placeholder="$t('placeholderText.pleaseEnterSubject')"
                    >
                    </el-input>
                    <el-checkbox disabled style="margin-left: 30px;" :false-label="0" :true-label="1"
                                 v-model="node.priority"
                    >
                      <span style="color: red; font-size: 16px;">{{ $t("urgent") }}</span>
                    </el-checkbox>
                  </div>
                </span>
              </span>
              <span v-else>
                <span v-if="node.subjectRequired === 'Y'">
                  <div class="subject">
                    <el-input
                      clearable
                      v-model="node.subject"
                      :disabled="isSubjectEdit"
                      show-word-limit
                      :prefix-icon="isSubjectEdit ? '' : 'el-icon-edit'"
                      :placeholder="$t('placeholderText.pleaseEnterSubject')"
                    >
                    </el-input>
                    <el-checkbox disabled style="margin-left: 30px;" :false-label="0" :true-label="1"
                                 v-model="node.priority"
                    >
                      <span style="color: red; font-size: 16px;">{{ $t("urgent") }}</span>
                    </el-checkbox>
                  </div>
                </span>
                <span v-else>
                  <div class="subject">
                    <el-input
                      v-model="node.subject"
                      disabled
                      :placeholder="$t('placeholderText.pleaseEnterSubject')"
                    >
                    </el-input>
                    <el-checkbox disabled style="margin-left: 30px;" :false-label="0" :true-label="1"
                                 v-model="node.priority"
                    >
                      <span style="color: red; font-size: 16px;">{{ $t("urgent") }}</span>
                    </el-checkbox>
                  </div>
                </span>
              </span>
            </el-col>
            <el-col :span="6" align="right">
              <div id="qrcode"></div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="content" id="form">
        <div class="card1" ref="card1">
          <div class="header">
            <span class="title"> {{ $t("applicantInformation") }}</span>
            <div class="space"></div>
            <el-button v-if="!isPrint" type="text" @click="expand = !expand"
            ><i
              :class="expand ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
            ></i>
              {{ expand ? $t("putAway") : $t("unfold") }}
            </el-button>
          </div>
          <el-form ref="form" label-width="80px">
            <el-col :span="8">
              <el-form-item :label="$t('applicant')">
                <el-input
                  clearable
                  v-if="!isTest"
                  v-show="node.applyUserDto.cnname"
                  readonly
                  v-model="
                    node.applyUserDto.cnname + '(' + node.applyUserDto.id + ')'
                  "
                ></el-input>
                <el-input
                  clearable
                  v-else
                  v-model="testData.name"
                  :placeholder="$t('placeholderText.pleaseSelectApplicant')"
                  readonly
                >
                  <el-button slot="append" @click="orgHandle">{{
                      $t("placeholderText.select")
                    }}
                  </el-button>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('applicationSector')">
                <el-input
                  clearable
                  readonly
                  v-if="!isTest"
                  v-model="node.applyUserDto.department"
                ></el-input>
                <el-select
                  clearable
                  v-else
                  v-model="testData.org"
                  class="w100"
                  :placeholder="$t('placeholderText.pleaseSelect')"
                >
                  <el-option
                    v-for="item in testData.list"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('applicationDate')">
                <el-input
                  clearable
                  readonly
                  v-model="node.applyUserDto.applyDate"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form>
          <div class="card-info">
            <!-- <span>申请时间:{{node.applyUserDto.applyDate | formatDateTime}}</!-->
          </div>
        </div>
        <div>
          <flow-card
            v-for="(item, index) in node.nodeTabLists"
            :data="item"
            :key="index"
            :is-print="isPrint"
            :is-no-start="isNoStart"
            @externalFun="privatelyFun"
            @customBtnClick="customBtnClick"
            v-show="item.editstate !== 'H'"
            v-if="item.istab === '0'"
          />
          <flow-tabs
            :data="tabsList"
            v-if="tabsList.length > 0"
            :is-print="isPrint"
            :is-no-start="isNoStart"
            :errors-show="errorsShow"
          />
        </div>
        <slot name="approve"></slot>
        <slot name="view"></slot>
        <div v-if="!isPrint" class="footer text-r">
          <el-button
            type="cancel"
            class="cancel-btn"
            @click="cancel"
            :disabled="buttonDisabled"
          >
            {{ $t("cancelAction") }}
          </el-button
          >
          <el-button
            type="success"
            class="save-btn"
            @click="handleSave"
            v-if="!isView"
            v-show="!isTest"
            :disabled="buttonDisabled"
          >{{ $t("apply") }}
          </el-button
          >
          <el-button
            type="primary"
            class="submit-btn"
            :class="!isTest ? '' : 'margin-l10'"
            @click="handleSubmit"
            v-if="!isView"
            :disabled="buttonDisabled"
          >{{ !isTest ? $t("submitForm") : $t("startTesting") }}
          </el-button
          >
          <el-button
            style="margin-left: 10px"
            type="primary"
            class="submit-btn"
            :class="!isTest ? '' : 'margin-l10'"
            @click="handleSave"
            v-if="$route.query.productRelease === 'edit'"
          >{{ !isTest ? $t("submitForm") : $t("startTesting") }}
          </el-button
          >
        </div>
      </div>
    </div>
    <div v-if="!isPrint" class="float-banner" :style="floatBannerRight">
      <div v-if="this.$route.query.type === 'edit'">
        <div
          class="btn"
          @click="handleRoute('暂停')"
          v-if="
            node.processInstanceInfo &&
            node.processInstanceInfo.status === '审批中'
          "
        >
          <el-tooltip :content="$t('pause')" effect="dark" placement="top">
            <i class="el-icon-video-pause" style="font-size: 20px" />
          </el-tooltip>
        </div>
        <div
          class="btn"
          @click="handleRoute('启用')"
          v-if="
            node.processInstanceInfo &&
            node.processInstanceInfo.status === '暂停'
          "
        >
          <el-tooltip :content="$t('enable')" effect="dark" placement="top">
            <i class="el-icon-video-play" style="font-size: 20px" />
          </el-tooltip>
        </div>
        <div
          v-if="
            node.processInstanceInfo &&
            node.processInstanceInfo.status !== '已完成' &&
            node.processInstanceInfo.status !== '终止' &&
            node.processInstanceInfo.status !== '暂停'
          "
        >
          <div class="btn" @click="handleRoute('路由')">
            <el-tooltip :content="$t('routing')" effect="dark" placement="top">
              <i class="iconfont icon-luyouqi" style="font-size: 20px" />
            </el-tooltip>
          </div>
          <div class="btn" @click="handleRoute('终止')">
            <el-tooltip
              :content="$t('termination')"
              effect="dark"
              placement="top"
            >
              <i class="iconfont icon-finish" style="font-size: 20px" />
            </el-tooltip>
          </div>
          <div class="btn" @click="handleRoute('保存')">
            <el-tooltip :content="$t('save')" effect="dark" placement="top">
              <i
                class="iconfont icon-gongdanguanli-gongda"
                style="font-size: 20px"
              />
            </el-tooltip>
          </div>
        </div>
      </div>
      <div
        v-if="
          isNoStart &&
          node.instanceId &&
          this.$route.query.type !== 'edit' &&
          this.$route.query.type !== 'collection'
        "
        class="btn"
        @click="collection"
      >
        <el-tooltip :content="$t('collect')" effect="dark" placement="top">
          <i
            :class="[collectionaData.id ? 'collection' : '', 'el-icon-star-on']"
          />
        </el-tooltip>
      </div>
      <div v-if="$route.path == '/processForm/start' || $route.path == '/processForm/approve'">
        <div v-if="riskData.length" class="risk" @click="riskClick">
          <el-tooltip :content="$t('risk')" effect="dark" placement="top">
            <i class="el-icon-warning-outline" />
          </el-tooltip>
        </div>
        <div v-else class="btn" @click="riskClick">
          <el-tooltip :content="$t('risk')" effect="dark" placement="top">
            <i class="el-icon-warning-outline" />
          </el-tooltip>
        </div>
        <div class="btn" @click="systemClick">
          <el-tooltip :content="$t('system')" effect="dark" placement="top">
            <i class="el-icon-document-remove" />
          </el-tooltip>
        </div>
      </div>
      <div class="btn" @click="handlePrintCard($route)" v-if="showPrintCard($route)">
        <el-tooltip :content="$t('printCard')" effect="dark" placement="top">
          <i class="el-icon-bank-card" />
        </el-tooltip>
      </div>
      <div class="btn" @click="handlePrint">
        <el-tooltip :content="$t('print')" effect="dark" placement="top">
          <i class="el-icon-printer" />
        </el-tooltip>
      </div>
      <div class="btn" @click="getInstanceImage">
        <el-tooltip
          :content="$t('viewFlowChart')"
          effect="dark"
          placement="top"
        >
          <i class="iconfont icon-liuchengtu" style="font-size: 24px" />
        </el-tooltip>
      </div>
      <div
        class="btn"
        v-if="node.instanceId && node.preview === 'Y'"
        @click="handlePreview"
      >
        <el-tooltip
          :content="$t('previewApproval')"
          effect="dark"
          placement="top"
        >
          <i class="iconfont icon-chuanyue" style="font-size: 24px" />
        </el-tooltip>
      </div>
      <div class="btn" v-if="node.helpinfo">
        <el-popover
          placement="left"
          v-if="!node.helpinfo.startsWith('http')"
          :title="$t('tips')"
          v-model="isShowHelp"
          width="300"
          trigger="hover"
          :content="node.helpinfo"
        >
          <i slot="reference" class="el-icon-question" />
        </el-popover>
        <el-tooltip
          v-else
          :content="$t('helpCenterClickToJump')"
          effect="dark"
          placement="top"
        >
          <i @click="handleHelp" class="el-icon-question" />
        </el-tooltip>
      </div>
      <div class="btn" @click="handleTop">
        <el-tooltip content="top" effect="dark" placement="top">
          <i class="el-icon-top" />
        </el-tooltip>
      </div>
    </div>
    <process-dialog
      :process="previewApprovers"
      :isBut="isBut"
      :node="node"
      v-model="previewApproversVisible"
      @confirm="confirm"
    ></process-dialog>
    <InstanceImageDialog
      v-model="dialogVisible"
      :instanceId="node.instanceId"
    />
    <bas-organieation
      v-model="organieationShow"
      :selectedElement="selectedElement"
      :isSpecifiedGroupBut="false"
      :isShowBustomGroupsBut="false"
      :multiple="false"
      :selectElement="selectElement"
      :showElement="showElement"
      :title="orgtitle"
      @fnCallBack="fnBasOrganieationCallBack"
    />
    <collection-dialog
      v-model="collectionDialogVisible"
      @confirm="saveCollection"
    />
    <start-instance-image-dialog
      v-model="startDialogVisible"
      :instanceId="node.processName"
    />

    <risk-dialog v-model="riskDialogVisible" :riskData="riskData" />
    <system-dialog v-model="systemDialogVisible" :systemData="systemData" />
    
    <!-- 自定义弹出框组件 HuangXiaoxiao 2022.07.26 -->
    <CustomDialogForm v-model="customDialogFormVisible" :itemColumn="customItemColumn"  @close="customDialogFormVisible = false"/>

    <!-- 证件打印弹出框组件 HuangXiaoxiao 2022.08.22 -->
    <CustomDialogPrintCard v-model="printCardVisible" :nodes="printCardNodes" :routers="printCardRouter" @close="printCardVisible = false"/>
  </div>
</template>

<script>
import $ from "jquery";
import QRCode from "qrcodejs2"; // 引入qrcode
import logo from "@/bpm/assets/img/common/logo-blue.png";
import FlowCard from "./FlowCard";
import FlowTabs from "./FlowTabs";
import RiskDialog from "./RiskDialog";
import SystemDialog from "./SystemDialog";

import CustomDialogForm from '@/bpm/components/customDialogForm';
import CustomDialogPrintCard from '@/bpm/components/customDialogPrintCard';

import { on, off, scrollTop } from "@/bpm/utils/backtop";
import processDialog from "@/bpm/components/processDialog";
import {
  deleteCollection,
  saveCollection,
  saveProcess,
  getSystemJson,
  getRiskJson,
  getMyJsonCopyForStart,
  getMyJsonCopyForApprove
} from "../../api/flow";
import {
  cancelinstance,
  executeProcessInstance
} from "@/bpm/api/process/administrativeTool/flowManagement.js";
import InstanceImageDialog from "@/bpm/components/instanceimage/InstanceImageDialog";
import { getPostById } from "@/bpm/api/process/administrativeTool/agents_change";
import collectionDialog from "@/bpm/components/collectionDialog";
import startInstanceImageDialog from "@/bpm/components/startInstanceImage/InstanceImageDialog";
import BasComponent from "bas-component";

Vue.use(BasComponent);
import "bas-component/lib/BasComponent.css";
import { createNamespacedHelpers } from "vuex";
import { fetch } from "@/bpm/utils";
import moment from "moment-mini";

const { mapGetters, mapMutations } = createNamespacedHelpers("app");

export default {
  components: {
    FlowCard,
    processDialog,
    InstanceImageDialog,
    collectionDialog,
    startInstanceImageDialog,
    FlowTabs,
    RiskDialog,
    SystemDialog,
    CustomDialogForm,
    CustomDialogPrintCard
  },
  data() {
    return {
      // 自定义弹出框
      customItemColumn:{},
      customDialogFormVisible: false,
      // 证件打印弹出框
      printCardNodes:{},
      printCardRouter:{},
      printCardVisible:false,
      //以下为原组件参数
      logo: logo,
      pageLoading: false,
      organieationShow: false,
      selectedElement: {},
      showElement: [],
      selectElement: ["9"],
      orgtitle: this.$t("selectApplicant"),
      testData: {
        list: []
      },
      // specifyNodeVisible: false,
      specifyNodeVisible: false,
      startDialogVisible: false,
      collectionDialogVisible: false,
      floatBannerRight: {},
      subject_error: "",
      isBut: false,
      dialogVisible: false,
      data: {},
      errors: [],
      errorsShow: false,
      isShowHelp: false,
      isPrint: false,
      expand: true,
      scriptPublic: "",
      scriptPrivatc: "",
      previewApproversVisible: false,
      previewApprovers: {},
      // tabsList: [],
      isLoadData: "",
      isLoad: "",
      isPublicLoad: "",
      qrcodeShow: false,
      positionIdInfo: "",
      userIdInfo: "",
      riskDialogVisible: false,
      systemDialogVisible: false,
      riskData: [],
      systemData: []
    };
  },
  props: {
    node: {
      type: Object,
      default: () => ({})
    },
    tabsList: {
      type: Array,
      default: () => []
    },
    isSubjectEdit: {
      type: Boolean,
      default: false
    },
    isNoStart: {
      type: Boolean,
      default: false
    },
    isView: {
      type: Boolean,
      default: false
    },
    submitaction: {
      type: String,
      default: ""
    },
    returnToNode: {
      type: String,
      default: ""
    },
    comment: {
      type: String,
      default: ""
    },
    collectionaData: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapGetters(["buttonDisabled", "bizData", "isTest", "customError"])
  },
  watch: {
    expand(val) {
      this.slideToggle(val);
    },
    node: {
      handler(val) {
        if (val) {
          this.qrcode(val);
          val.applyUserDto.applyDate = this.$options.filters.formatDateTime(
            val.applyUserDto.applyDate
          );
          this.isLoadData = true;
          if (val.bpaprocessid && val.processNodeName) {
            if (this.$route.path == "/processForm/approve") {
              this.getMyJsonCopyForApprove();
            }
          }
        }
      },
      deep: true,
      immediate: true
    },
    "node.processName": {
      handler(val) {
        this.$nextTick(function() {
          this.importScript();
        });
      },
      deep: true,
      immediate: true
    },
    "node.bpaprocessid": {
      handler(val) {
        if (val) {
          this.$nextTick(function() {
            if (this.$route.path == "/processForm/start") {
              this.getMyJsonCopyForStart();
              this.getSystemJson();
            } else if (this.$route.path == "/processForm/approve") {
              this.getSystemJson();
            }
          });
        }
      },
      deep: true,
      immediate: true
    },
    isLoadData: {
      handler(val) {
        this.externalFun();
      },
      deep: true,
      immediate: true
    },
    isLoad: {
      handler(val) {
        this.externalFun();
      },
      deep: true,
      immediate: true
    },
    isPublicLoad: {
      handler(val) {
        this.externalPFun();
      },
      deep: true,
      immediate: true
    },
    "node.helpinfo": {
      handler(val) {
        if (val) {
          if (val.indexOf("http") === -1) {
            this.$nextTick(function() {
              this.$notify({
                title: this.$t("tips"),
                dangerouslyUseHTMLString: true,
                message: `<span style="white-space: pre-line;">${val}</span>`,
                duration: 0
              });
            });
          }
        }
      }
    }
  },
  mounted() {

    window.myAjax = fetch;
    let _this = this;
    _this.setErrorsShow(false);
    _this.$nextTick(function() {
      window.onresize = () => {
        _this.companyStyle();
      };
      _this.companyStyle();
    });
    on(window, "scroll", this.handleScroll);
    on(window, "resize", this.handleScroll);

  },
  methods: {
    ...mapMutations(["setErrorsShow", "setButtonDisabled", "setIsTest"]),
    customBtnClick(data){
      // console.error(JSON.stringify(data));
      this.customItemColumn = data;
      this.customDialogFormVisible = true;
    },
    qrcode(val) {
      if (!this.qrcodeShow && val.instanceId) {
        this.positionIdInfo = val.applyUserDto.positionId;
        this.userIdInfo = val.applyUserDto.id;
        this.qrcodeShow = true;
        this.$nextTick(() => {
          let qrcode = new QRCode("qrcode", {
            width: 80,
            height: 80,
            text: val.instanceId, // 二维码地址
            colorDark: "#000",
            colorLight: "#fff"
          });
        });
      }
    },
    privatelyFun(type) {
      this.getFormDataIsNull(this.node, this.data);
      window[type](this, this.data, this.node);
    },
    fnBasOrganieationCallBack(data) {
      this.$set(this.testData, "name", data.name.split("&").join(","));
      this.$set(this.testData, "id", data.id);
      this.$set(this.testData, "idType", data.idType);
      this.organieationShow = false;
      this.$set(this.testData, 'list', "");
      this.$set(this.testData, 'org', "");
      getPostById(data.id).then((rt) => {
        if (rt.status === "200") {
          if (rt.data && rt.data.length > 0) {
            this.testData.list = rt.data;
            this.testData.org = rt.data[0].id;
          } else {
            this.$message.error(
              this.$t("hintText.postMissingContactAdministrator")
            );
          }
        }
      });
    },
    orgHandle() {
      this.selectedElement = {};
      if (this.testData.id) {
        let list = this.testData.name.split(",").join("&");
        this.selectedElement = {
          id: this.testData.id.split(","),
          name: list,
          idType: this.testData.idType
        };
      }
      this.organieationShow = true;
    },
    handleHelp() {
      let a = document.createElement("a");
      // 给创建好的a标签赋值
      a.setAttribute("href", this.node.helpinfo);
      // 设置css 隐藏属性
      a.setAttribute("style", "display:none");
      // 设置 a标签为新窗口打开
      a.setAttribute("target", "_blank");
      // 将设置好的a标签，添加到 body 内
      document.body.appendChild(a);
      // 模拟点击
      a.click();
      // 移除a标签
      a.parentNode.removeChild(a);
    },
    handleRouteSave(data) {
      this.$loading();
      saveProcess({
        bizData: this.data,
        instanceId: this.node.instanceId,
        subject: this.node.subject,
        priority: this.node.priority,
        type: "edit",
        userId: this.node.userId,
        targetActivityName: this.node.targetActivityName,
        taskId: this.node.taskId
      })
        .then((rt) => {
          this.$message({
            message: this.$t("hintText.saveSuccessfully"),
            type: "success"
          });
          localStorage.setItem("isReloadDrafts", true);
          window.opener = null;
          window.open("", "_self");
          window.close();
          this.$loading().close();
        })
        .catch(() => {
          this.$loading().close();
        });
    },
    handleRoute(type) {
      if (type === "保存") {
        this.data = {};
        this.errors = [];
        this.errorsShow = false;
        this.getFormData(this.node, this.data);
        if (this.node.subjectRequired === "Y" && !this.node.subject) {
          this.subject_error = this.$t("hintText.subjectCannotEmpty");
          this.$message.error(this.$t("hintText.subjectCannotEmpty"));
          return;
        } else if (
          this.node.subjectRequired === "Y" &&
          this.node.subject.length > 200
        ) {
          this.subject_error = "主题长度不能超过200个字符！";
          this.$message.error("主题长度不能超过200个字符！");
          return;
        }
        this.subject_error = "";
        if (this.isLoad && typeof eval(window["submit"]) === "function") {
          window["submit"](this, this.data, true).then((rt) => {
            if (!rt) return;
            this.handleRouteSave();
          });
        } else {
          this.handleRouteSave();
        }
      } else if (type === "终止") {
        this.$loading();
        cancelinstance(this.node.instanceId)
          .then((rt) => {
            this.$loading().close();
            if (rt.status === "200") {
              localStorage.setItem("isReload", true);
              window.opener = null;
              window.open("", "_self");
              window.close();
            }
          })
          .catch((er) => {
            this.$loading().close();
          });
      } else if (type === "暂停") {
        this.$loading();
        executeProcessInstance({
          handleType: "EHM-001",
          instanceId: this.node.instanceId
        })
          .then((rt) => {
            this.$loading().close();
            if (rt.status === "200") {
              localStorage.setItem("isReload", true);
              window.opener = null;
              window.open("", "_self");
              window.close();
            }
          })
          .catch((er) => {
            this.$loading().close();
          });
      } else if (type === "启用") {
        this.$loading();
        executeProcessInstance({
          handleType: "EHM-002",
          instanceId: this.node.instanceId
        })
          .then((rt) => {
            this.$loading().close();
            if (rt.status === "200") {
              localStorage.setItem("isReload", true);
              window.opener = null;
              window.open("", "_self");
              window.close();
            }
          })
          .catch((er) => {
            this.$loading().close();
          });
      } else if (type === "路由") {
        let routeData = this.$router.resolve({
          name: "processRouting",
          query: {
            instanceId: this.node.instanceId
          }
        });
        let a = document.createElement("a");
        // 给创建好的a标签赋值
        a.setAttribute("href", routeData.href);
        // 设置css 隐藏属性
        a.setAttribute("style", "display:none");
        // 设置 a标签为新窗口打开
        a.setAttribute("target", "_blank");
        // 将设置好的a标签，添加到 body 内
        document.body.appendChild(a);
        // 模拟点击
        a.click();
        // 移除a标签
        a.parentNode.removeChild(a);
        // window.open(routeData.href, "_blank");
      }
    },
    saveCollection(data) {
      if (!data.id) {
        this.$message.error(this.$t("hintText.pleaseSelectFavoriteNode"));
        return false;
      }
      saveCollection({
        drafter: this.node.drafter,
        id: this.node.id,
        instanceId: this.node.instanceId,
        processCnname: this.node.processCnname,
        reqDate: this.node.reqDate,
        reqNo: this.node.reqno,
        service: this.node.service,
        status: this.node.status,
        subject: this.node.subject,
        priority: this.node.priority,
        leveltype: "3",
        pid: data.id,
        userId: this.node.userId
      }).then((rt) => {
        if (rt.status === "200") {
          this.$message.success(this.$t("hintText.collectionSuccess"));
          this.$set(this.collectionaData, "id", rt.data.id);
          this.collectionDialogVisible = false;
        }
      });
    },
    collection() {
      if (this.collectionaData.id) {
        deleteCollection(this.collectionaData.id).then((rt) => {
          if (rt.status === "200") {
            this.$message.success(this.$t("hintText.cancelSuccess"));
            this.collectionaData = {};
          }
        });
      } else {
        this.collectionDialogVisible = true;
      }
    },
    getInstanceImage() {
      if (this.node.instanceId) {
        this.dialogVisible = true;
      } else {
        this.startDialogVisible = true;
      }
    },
    cancel() {
      window.opener = null;
      window.open("", "_self");
      window.close();
    },
    externalFun() {
      if (this.isLoad && this.isLoadData) {
        window["ready"](
          this,
          this.node,
          process.env.HOST_URL + process.env.BASE_URL,
          $
        );
      }
    },
    externalPFun() {
      // 公共的加载方法
      if (this.isPublicLoad && this.isLoadData) {
        window["readyP"](
          this,
          this.node,
          process.env.HOST_URL + process.env.BASE_URL,
          $
        );
      }
    },
    PublicLoad() {
      this.isPublicLoad = true;
    },
    load() {
      this.isLoad = true;
    },
    handleSave() {
      this.data = {};
      this.errors = [];
      this.errorsShow = false;
      this.getFormData(this.node, this.data);
      if (this.node.subjectRequired === "Y" && !this.node.subject) {
        this.subject_error = this.$t("hintText.subjectCannotEmpty");
        this.$message.error(this.$t("hintText.subjectCannotEmpty"));
        return;
      } else if (
        this.node.subjectRequired === "Y" &&
        this.node.subject.length > 200
      ) {
        this.subject_error = "主题长度不能超过200个字符！";
        this.$message.error("主题长度不能超过200个字符！");
        return;
      }
      this.subject_error = "";
      let savelenerrors = this.errors.filter((item) => item.applyvalue);
      console.log("🍓this.data", this.data);
      if (savelenerrors.length > 0) {
        this.$message({
          showClose: true,
          message: `${savelenerrors[0].fieldShowName}不能超过${savelenerrors[0].length}个字符`,
          type: "error"
        });
      } else {
        if (this.customError.length > 0) {
          this.$message({
            showClose: true,
            message: `${this.customError[0].fieldShowName}：${this.customError[0].errorHint}`,
            type: "error"
          });
          return;
        }
        if (this.isLoad && typeof eval(window["submit"]) === "function") {
          window["submit"](this, this.data, true).then((rt) => {
            if (!rt) return;
            this.$emit("handleSave", this.data);
          });
        } else {
          this.$emit("handleSave", this.data);
        }
      }
    },
    handleSubmit() {
      this.data = {};
      this.errors = [];
      this.getFormData(this.node, this.data);
      if (this.node.subjectRequired === "Y" && !this.node.subject) {
        this.$message.error(this.$t("hintText.subjectCannotEmpty"));
        this.subject_error = this.$t("hintText.subjectCannotEmpty");
        return;
      } else if (
        this.node.subjectRequired === "Y" &&
        this.node.subject.length > 200
      ) {
        this.subject_error = "主题长度不能超过200个字符！";
        this.$message.error("主题长度不能超过200个字符！");
        return;
      }
      this.subject_error = "";
      if (
        this.errors.length === 0 ||
        this.submitaction === "noAgreed" ||
        this.submitaction === "anyActivityBtn" ||
        this.submitaction === "reApplyBtn" ||
        this.submitaction === "cancelBtn" ||
        this.submitaction === "transferPackage" ||
        this.submitaction === "returnToBtn"
      ) {
        if (this.customError.length > 0) {
          this.$message({
            showClose: true,
            message: `${this.customError[0].fieldShowName}：${this.customError[0].errorHint}`,
            type: "error"
          });
          return;
        }
        this.submitForm();
      } else {
        if (this.errors[0].applyvalue) {
          this.$message({
            showClose: true,
            message: `${this.errors[0].fieldShowName}超长`,
            type: "error"
          });
        } else {
          this.$message({
            showClose: true,
            message:
              `${this.errors[0].fieldShowName}` +
              this.$t("hintText.cannotBeEmpty"),
            type: "error"
          });
        }
        this.setErrorsShow(true);
      }
    },
    handlePreview() {
      this.previewApprovers = {
        instanceId: this.node.instanceId
      };
      this.isBut = false;
      this.previewApproversVisible = true;
    },
    submitForm() {
      if (this.$route.query.taskId) {
        if (!this.submitaction) {
          this.$message(this.$t("hintText.pleaseSelectApprovalComments"));
          return;
        }
        if (this.submitaction === "returnToBtn") {
          if (this.node.returnToList) {
            if (this.returnToNode !== "") {
              this.$confirm(
                this.$t("hintText.confirmToSubmit"),
                this.$t("hintText.hint"),
                {
                  confirmButtonText: this.$t("confirm"),
                  cancelButtonText: this.$t("cancel")
                }
              )
                .then(() => {
                  this.saveAjax();
                })
                .catch(() => {
                  this.setButtonDisabled(false);
                  this.$message({
                    type: "info",
                    message: this.$t("hintText.unSubmitted")
                  });
                });
            } else {
              this.$message.error(
                this.$t("hintText.pleaseSelectNodeForReview")
              );
              return;
            }
          } else {
            this.$message.error(
              this.$t("hintText.pleaseAssignCurrentReturnNode")
            );
          }
          return;
        }
        if (
          this.submitaction === "noAgreed" ||
          this.submitaction === "anyActivityBtn" ||
          this.submitaction === "reApplyBtn" ||
          this.submitaction === "cancelBtn" ||
          this.submitaction === "returnSpecifiedNode"
        ) {
          if (!this.comment) {
            this.$message(this.$t("hintText.pleaseFillApprovalRecord"));
            return;
          }
        }
      }
      if (this.node.processNodeName === "Start") {
        if (typeof eval(window["submit"]) === "function") {
          window["submit"](this, this.data, false).then((rt) => {
            if (!rt) return;
            this.data = {};
            this.errors = [];
            this.errorsShow = false;
            this.getFormData(this.node, this.data);
            this.previewApprovers = {
              instanceId: this.node.instanceId,
              processName: this.node.processName,
              positionId: this.node.positionId,
              userId: this.$store.state.basuser.user.id,
              bizData: this.data
            };
            this.isBut = true;
            if (this.isTest) {
              if (!this.testData.id) {
                this.$message.error(
                  this.$t("placeholderText.pleaseSelectApplicant")
                );
                return;
              }
              if (!this.testData.org) {
                this.$message.error(
                  this.$t("hintText.pleaseSelectApplicationDepartment")
                );
                return;
              }
              this.previewApprovers.positionId = this.testData.org;
              this.previewApprovers.userId = this.testData.id;
              this.isBut = false;
            }
            this.previewApproversVisible = true;
          });
        } else {
          this.previewApprovers = {
            instanceId: this.node.instanceId,
            processName: this.node.processName,
            positionId: this.node.positionId,
            userId: this.$store.state.basuser.user.id,
            bizData: this.data
          };
          this.isBut = true;
          if (this.isTest) {
            if (!this.testData.id) {
              this.$message.error(
                this.$t("placeholderText.pleaseSelectApplicant")
              );
              return;
            }
            if (!this.testData.org) {
              this.$message.error(
                this.$t("hintText.pleaseSelectApplicationDepartment")
              );
              return;
            }
            this.previewApprovers.positionId = this.testData.org;
            this.previewApprovers.userId = this.testData.id;
            this.isBut = false;
          }
          this.previewApproversVisible = true;
        }
      } else {
        this.previewApproversVisible = true;
        this.previewApprovers = {
          instanceId: this.node.instanceId,
          positionId: this.positionIdInfo,
          processName: this.node.processName,
          // userId: this.$store.state.basuser.user.id,
          userId: this.userIdInfo,
          bizData: this.data
        };
        this.isBut = true;
      }
    },
    confirm(isSave, selectUser) {
      this.node.selectUser = selectUser;
      if (isSave) {
        this.saveAjax();
      }
    },
    checkSpecifyNode(node) {
      this.node.targetActivityName = node;
      this.saveAjax();
    },
    saveAjax() {
      this.setButtonDisabled(true);
      this.$emit("handleSubmit", this.data);
    },
    getMyJsonCopyForStart() {
      getMyJsonCopyForStart(this.node.bpaprocessid)
        .then(rt => {
          if (rt.code === 200) {
            this.riskData = rt.data.keyControl.map(item => {
              return {
                ...item,
                nodeName: rt.data.name
              };
            });
          }
        })
        .catch(er => {
        });
    },
    getMyJsonCopyForApprove() {
      getMyJsonCopyForApprove(this.node.bpaprocessid, this.node.processNodeName)
        .then(rt => {
          if (rt.code === 200) {
            this.riskData = rt.data.keyControl.map(item => {
              return {
                ...item,
                nodeName: rt.data.name
              };
            });
          }
        })
        .catch(er => {
        });
    },
    riskClick() {
      this.riskDialogVisible = true;
    },
    getSystemJson() {
      getSystemJson(this.node.bpaprocessid)
        .then(rt => {
          if (rt.code === 200) {
            this.systemData = rt.data.bpmDto.zhiduList;
          }
        })
        .catch(er => {
        });
    },
    systemClick() {
      this.systemDialogVisible = true;
    },
    // 判断是否展示[打印证件]功能按钮
    showPrintCard(thisRouter){
      // console.log(thisRouter);
      var tag = false;
      var query = thisRouter.query;
      var keyArr = ['CMZ1','出门证','WJWZCMZ','外借物资出门证']
      if(typeof(query) != 'undefined'){
        var key = query.processName;
        var key2 = query.name;

        let flag = keyArr.findIndex(item => item == key);
        let flag2 = keyArr.findIndex(item => item == key2);
        if(flag > -1 || flag2 > -1){
          tag = true;
        }
      }
      return tag;
    },
    // 打印证件功能按钮
    handlePrintCard(thisRouter){
      this.printCardVisible = true;
      this.printCardNodes = JSON.parse(JSON.stringify(this.node));
      this.printCardRouter = JSON.parse(JSON.stringify(thisRouter.query));
    },
    handlePrint() {
      if (this.node.defaultPrint === "Y" && this.node.instanceId) {
        let routeData = this.$router.resolve({
          name: this.node.processName + "Print",
          query: {
            instanceId: this.node.instanceId
          }
        });
        let a = document.createElement("a");
        // 给创建好的a标签赋值
        a.setAttribute("href", routeData.href);
        // 设置css 隐藏属性
        a.setAttribute("style", "display:none");
        // 设置 a标签为新窗口打开
        a.setAttribute("target", "_blank");
        // 将设置好的a标签，添加到 body 内
        document.body.appendChild(a);
        // 模拟点击
        a.click();
        // 移除a标签
        a.parentNode.removeChild(a);
        // window.open(routeData.href, "_blank");
      } else {
        this.isPrint = true;
        this.$nextTick(() => {
          window.print();
          this.isPrint = false;
        });
      }
    },
    getFormDataIsNull(node, data) {
      if (node.nodeTabLists) {
        node.nodeTabLists.forEach((tab) => {
          this.getFormDataIsNull(tab, data);
        });
      }
      if (node.rows) {
        data[node.fieldName] = [];
        // data['tableName'] = node.relationType
        node.rows.forEach((row) => {
          const rowData = {};
          data[node.fieldName].push(rowData);
          this.getFormDataIsNull(row, rowData);
        });
      } else if (node.nodeTableLists) {
        node.nodeTableLists.forEach((table) => {
          // if (table.applyvalue) {
          if (table.inputType === "date" || table.inputType === "date-edit") {
            data[table.fieldName] = table.applyvalue
              ? moment(table.applyvalue).format("YYYY-MM-DD")
              : "";
          } else if (
            table.inputType === "time" ||
            table.inputType === "time-edits"
          ) {
            data[table.fieldName] = table.applyvalue
              ? moment(table.applyvalue).format("YYYY-MM-DD HH:mm:ss")
              : "";
          } else if (table.inputType === "double") {
            if (table.applyvalue) {
              data[table.fieldName] = String(
                this.$options.filters.delcommafy(table.applyvalue)
              );
            }
          } else if (table.inputType === "search-switch") {
            if (table.applyvalue) {
              data[table.fieldName] = "";
            }
          } else if (table.inputType === "nokt") {
            if (table.value && table.value !== "undefined") {
              data[table.fieldName] = table.value;
            }
          } else {
            data[table.fieldName] = table.applyvalue;
          }
          // }
          // data['tableName'] = table.relationType

          if (table.inputType !== "hidden" && table.editstate === "W") {
            if (
              table.isrequired === "required" &&
              table.inputType === "subtable" &&
              table.rows.length < 1
            ) {
              this.errors.push(table);
            } else if (table.inputType !== "subtable") {
              if (table.inputType === "nokt") {
                if (
                  (!table.value || table.value === "undefined") &&
                  table.isrequired === "required"
                ) {
                  this.errors.push(table);
                  return;
                }
              }
              if (
                table.inputType !== "ckeditor" &&
                table.inputType !== "project"
              ) {
                if (
                  table.applyvalue &&
                  table.applyvalue.length > table.length
                ) {
                  this.errors.push(table);
                }
              }
            }
          }
          this.getFormDataIsNull(table, data);
        });
      }
    },
    getFormData(node, data) {
      if (node.nodeTabLists) {
        node.nodeTabLists.forEach((tab) => {
          this.getFormData(tab, data);
        });
      }
      if (node.rows) {
        data[node.fieldName] = [];
        // data['tableName'] = node.relationType
        node.rows.forEach((row) => {
          const rowData = {};
          data[node.fieldName].push(rowData);
          this.getFormData(row, rowData);
        });
      } else if (node.nodeTableLists) {
        node.nodeTableLists.forEach((table) => {
          if (table.applyvalue) {
            if (table.inputType === "date" || table.inputType === "date-edit") {
              data[table.fieldName] = moment(table.applyvalue).format(
                "YYYY-MM-DD"
              );
            } else if (
              table.inputType === "time" ||
              table.inputType === "time-edits" ||
              table.inputType === "time-edit"
            ) {
              data[table.fieldName] = moment(table.applyvalue).format(
                "YYYY-MM-DD HH:mm:ss"
              );
            } else if (table.inputType === "double") {
              if (table.applyvalue) {
                data[table.fieldName] = this.$options.filters.delcommafy(
                  table.applyvalue
                );
              }
            } else if (table.inputType === "search-switch") {
              if (table.applyvalue) {
                data[table.fieldName] = "";
              }
            } else {
              data[table.fieldName] = table.applyvalue;
            }
          }
          if (table.inputType === "nokt") {
            if (table.value && table.value !== "undefined") {
              data[table.fieldName] = table.value;
            }
          }
          // data['tableName'] = table.relationType
          if (table.inputType !== "hidden" && table.editstate === "W") {
            if (
              table.isrequired === "required" &&
              table.inputType === "subtable" &&
              table.rows.length < 1
            ) {
              this.errors.push(table);
            } else if (table.inputType !== "subtable") {
              if (table.inputType === "nokt") {
                if (!table.value && table.isrequired === "required") {
                  this.errors.push(table);
                  return;
                }
              } else {
                if (!table.applyvalue && table.isrequired === "required") {
                  this.errors.push(table);
                  return;
                }
              }
              if (
                table.inputType !== "ckeditor" &&
                table.inputType !== "project"
              ) {
                if (
                  table.applyvalue &&
                  table.applyvalue.length > table.length
                ) {
                  this.errors.push(table);
                }
              }
            }
          }
          this.getFormData(table, data);
        });
      }
    },
    dateConversion: (time) => {
      let date = new Date(time + 8 * 3600 * 1000);
      let nyr = date.toJSON().substr(0, 10);
      let sfm = date.toJSON().substr(11, 8);
      return sfm === "00:00:00" ? nyr : `${nyr} ${sfm}`;
    },
    slideToggle(show) {
      const parent = this.$refs["card1"];
      if (show) {
        parent.style.height = "98px";
      } else {
        parent.style.height = "35px";
      }
    },
    handleTop() {
      // 回到顶部
      const sTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      scrollTop(window, sTop, 0, this.duration, this.timing);
      document.getElementById("app").scrollTop = 0;
    },
    handleScroll() {
      this.backTop = window.pageYOffset >= this.height;
    },
    // ajax请求 判断文件是否存在
    isExistsScript(url) {
      var xmlhttp;
      if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest(); //其他浏览器
      } else if (window.ActiveXObject) {
        try {
          xmlhttp = new ActiveXObject("Msxml2.XMLHTTP"); //旧版IE
        } catch (e) {
        }
        try {
          xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); //新版IE
        } catch (e) {
        }
        if (!xmlhttp) {
          window.alert("不能创建XMLHttpRequest对象");
        }
      }
      xmlhttp.open("GET", url, false);
      xmlhttp.send();
      // console.log(xmlhttp);
      return xmlhttp.readyState === 4 && xmlhttp.status === 200;
    },
    importScript() {
      if (this.node.processName) {
        let baseUrl =
          window.location.origin + window.location.pathname + "/processScript/";
        let scriptPublic =
          this.node.processName + "/" + this.node.processName + ".js";
        let scriptPrivatc =
          this.node.processName + "/" + this.node.scriptName + "/index.js";
        const ctx = require.context(
          "../../../../public/processScript/",
          true,
          /\.js$/
        );
        if (ctx.keys().includes("./" + scriptPublic)) {
          this.scriptPublic =
            baseUrl + scriptPublic + "?v=" + new Date().getTime();
        }
        if (ctx.keys().includes("./" + scriptPrivatc)) {
          this.scriptPrivatc =
            baseUrl + scriptPrivatc + "?v=" + new Date().getTime();
        }
      }
    },
    companyStyle() {
      this.floatBannerRight = {
        right:
          document.documentElement.clientWidth / 2 -
          this.$refs.companyStyle.clientWidth / 2 -
          50 +
          "px"
      };
    }
  },
  beforeDestroy() {
    off(window, "scroll", this.handleScroll);
    off(window, "resize", this.handleScroll);
    this.setIsTest(false);
  }
};
</script>
<style type="text/scss" lang="scss">
.root {
  .card1 {
    .el-input__inner {
      // border: 0;
      // border-bottom: 1px solid #e5e5e5;
    }
  }
}
</style>

<style type="text/scss" lang="scss" scoped>
.iconfont {
  margin: 0 !important;
}

.collection {
  color: #ffff00;
}

.root {
  min-height: 100%;
}

.info {
  margin: 0 auto;
}

.head-content {
  margin: 0 auto;
  padding: 15px 0px;
  background: $bc1;
  border-left: 1px solid $dc1;
  border-right: 1px solid $dc1;

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
  border: 1px solid $dc1;
  padding-bottom: 54px;

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
  bottom: 100px;
  right: calc(50% - 580px);
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

  .btn:hover {
    background-color: #2d42af !important;
  }

  .risk {
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

  .risk:hover {
    background-color: #FFB90F !important;
  }
}

.footer {
  position: fixed;
  z-index: 100;
  bottom: 0;
  min-width: 1080px;
  width: 56vw;
  padding: 0 15px;
  box-sizing: border-box;
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
</style>

<style type="text/scss" lang="scss">
.subject {
  margin-left: 15px;
  margin-top: 20px;

  .el-input {
    width: 80% !important;
  }

  input.el-input__inner {
    // border: 0;
    // border-bottom: 1px solid $dc1;
    width: 100%;

    &:focus {
      border-bottom: 1px solid $bc3;
    }
  }
}
</style>
