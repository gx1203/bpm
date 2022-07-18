<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    class="dialog_content_business"
  >
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      :rules="rules"
      label-width="140px"
      class="content"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('processName2') + '：'" prop="processname">
            <el-input
              clearable
              type="text"
              v-model="ruleForm.processname"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('authNode') + '：'" prop="nodename">
            <el-select
              clearable
              v-model="ruleForm.nodename"
              class="w100"
              :placeholder="$t('placeholderText.pleaseSelect')"
              @change="authNodeHandle"
            >
              <el-option
                v-for="item in authNodeData"
                :key="item.id"
                :label="item.activityname"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('agent') + '：'" prop="agentusercn">
            <el-input v-model="ruleForm.agentusercn" readonly>
              <el-button slot="append" @click="orgHandle('agent')">{{
                $t("placeholderText.select")
              }}</el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('authorizer') + '：'" prop="authorizeduser">
            <el-input v-model="ruleForm.authorizedusercn" readonly>
              <el-button slot="append" @click="orgHandle('authorizer')">{{
                $t("placeholderText.select")
              }}</el-button>
            </el-input>
            <!-- <el-select v-model="ruleForm.authorizeduser" placeholder="请选择">
              <el-option
                v-for="item in authoroptions"
                :key="item.value"
                :label="item.cnname"
                :value="item.id"
              >
              </el-option>
            </el-select> -->
            <!-- <el-input v-model="ruleForm.authorizedusercn" > </el-input> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('startTime') + '：'" prop="begintime">
            <el-date-picker
              v-model="ruleForm.begintime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              :range-separator="$t('placeholderText.to')"
              :start-placeholder="$t('placeholderText.startDate')"
              :end-placeholder="$t('placeholderText.endDate')"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('endTime') + '：'" prop="endtime">
            <el-date-picker
              v-model="ruleForm.endtime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              :range-separator="$t('placeholderText.to')"
              :start-placeholder="$t('placeholderText.startDate')"
              :end-placeholder="$t('placeholderText.endDate')"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item :label="$t('judgmentLogic') + '：'" prop="">
            <el-radio-group v-model="ruleForm.judgemethod">
              <el-radio label="0">
                {{ $t("satisfy") }}
                <span>
                  <span class="required">{{ $t("allHave") }}</span>
                  {{ $t("condition") }}
                </span>
              </el-radio>
              <el-radio label="1">
                {{ $t("satisfy") }}
                <span class="required">{{ $t("either") }}</span>
                {{ $t("condition") }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-table
            :data="authJudgeDetailData"
            stripe
            :header-cell-style="{ background: '#E1EAFD !important' }"
            highlight-current-row
            style="width: 100%; margin: 15px 0"
          >
            <el-table-column
              :label="$t('controlFieldName')"
              width="140"
              align="center"
            >
              <template slot-scope="scope">
                <el-select
                  v-show="scope.row.orgattributeid"
                  v-model="scope.row.orgattributeid"
                  @change="selectType(scope.row, scope.$index)"
                  class="w100"
                  :placeholder="$t('placeholderText.pleaseSelect')"
                >
                  <el-option
                    v-for="item in controlsData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <el-select
                  v-show="scope.row.controlid"
                  v-model="scope.row.controlid"
                  @change="selectType(scope.row, scope.$index)"
                  class="w100"
                  :placeholder="$t('placeholderText.pleaseSelect')"
                >
                  <el-option
                    v-for="item in controlsData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('conditionType')"
              width="140"
              align="center"
            >
              <template slot-scope="scope">
                <el-select
                  v-show="scope.row.controltype === 'org'"
                  v-model="scope.row.conditiontype"
                  clearable
                  class="w100"
                  :placeholder="$t('placeholderText.pleaseSelect')"
                >
                  <el-option
                    v-for="item in judgingList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <div v-show="scope.row.controltype === 0">
                  {{ $t("customCondition") }}
                </div>
                <div v-show="scope.row.controltype === 1">
                  {{ $t("rangeCondition") }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot="header">
                <span class="required">*</span>
                {{ $t("conditionalResult") }}
              </template>
              <template slot-scope="scope">
                <div
                  v-if="
                    conditionalResultList[scope.$index] &&
                    conditionalResultList[scope.$index].length >= 0 &&
                    scope.row.controltype === 0
                  "
                >
                  <el-select clearable v-model="scope.row.result" class="w100">
                    <el-option
                      v-for="item in conditionalResultList[scope.$index]"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
                <template v-else>
                  <div v-show="scope.row.controltype === 'org'">
                    <el-input
                      v-model="scope.row.conditionresult"
                      maxlength="100"
                      clearable
                      show-word-limit
                    >
                    </el-input>
                  </div>
                  <div
                    v-show="scope.row.controltype === 0"
                    style="text-align: right"
                  >
                    {{ $t("customResult") }}：
                    <el-input
                      v-model="scope.row.result"
                      maxlength="100"
                      clearable
                      show-word-limit
                      style="width: 50%"
                    ></el-input>
                  </div>
                  <div
                    v-show="scope.row.controltype === 1"
                    style="text-align: right"
                  >
                    <p>
                      {{ $t("max") }}：
                      <el-input
                        :min="scope.row.minval"
                        v-model="scope.row.maxval"
                        clearable
                        maxlength="10"
                        show-word-limit
                        oninput="value=value.replace(/[^\d.-]/g,'')"
                        style="width: 50%"
                      ></el-input>
                    </p>
                    <p>
                      {{ $t("min") }}：
                      <el-input
                        :max="scope.row.maxval"
                        maxlength="10"
                        show-word-limit
                        clearable
                        v-model="scope.row.minval"
                        oninput="value=value.replace(/[^\d.-]/g,'')"
                        style="width: 50%"
                      ></el-input>
                    </p>
                  </div>
                </template>
              </template>
            </el-table-column>
            <el-table-column :label="$t('operation')" align="center" width="60">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  @click="deleteList(scope.$index, 'judgeData')"
                >
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addList('judgeData')">
        {{ $t("addCondition") }}
        
      </el-button>
      <!-- <el-button @click="cancel">{{ $t('cancelAction') }}</el-button> -->
      <el-button type="primary" @click="submit('ruleForm')">{{
        $t("confirm")
      }}</el-button>
    </span>
    <bas-organieation
      v-model="organieationShow"
      :selectedElement="selectedElement"
      :isSpecifiedGroupBut="false"
      :isShowBustomGroupsBut="false"
      :selectElement="selectElement"
      :showElement="showElement"
      :multiple="false"
      :title="orgtitle"
      @fnCallBack="fnBasOrganieationCallBack"
    />
  </el-dialog>
</template>

<script>
import { getOrgTree } from "@/bpm/api/app";
import {
  saveOrUpdate,
  getAuthInfo,
  getAuthInfoDetail,
  getAuthNodeData,
  getAuthControlData,
  getAuthorizedUser,
  getAllNode,
} from "@/bpm/api/staging/tool/business_auth.js";
import BasComponent from "bas-component";
Vue.use(BasComponent);
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    processInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      authoroptions: [],
      authJudgeDetailData: [],
      controlsData: [],
      authNodeData: [],
      dialogVisible: this.value,
      organieationShow: false,
      selectedElement: {},
      showElement: [],
      selectElement: ["9"],
      orgtitle: "选择代理人",
      judgeData: {},
      conditionalResultList: [],
      ruleForm: {
        br: {},
      },
      judgingList: [
        {
          value: "=",
          label: "=",
        },
        {
          value: "!=",
          label: "!=",
        },
        {
          value: "包含",
          label: this.$t("contain"),
        },
        {
          value: "被包含",
          label: this.$t("contained"),
        },
      ],
      rules: {
        processname: [
          {
            required: true,
            message: this.$t("placeholderText.pleaseEnterProcessName"),
            trigger: "blur",
          },
        ],
        nodename: [
          {
            required: true,
            message: this.$t("placeholderText.pleaseSelectAuthNode"),
            trigger: "blur",
          },
        ],
        authorizeduser: [
          {
            required: true,
            message: this.$t("placeholderText.pleaseSelectAuthorizer"),
            trigger: "blur",
          },
        ],
        agentusercn: [
          {
            required: true,
            message: this.$t("placeholderText.pleaseSelectAgent"),
            trigger: "blur",
          },
        ],
        begintime: [
          {
            required: true,
            message: this.$t("placeholderText.pleaseSelectStartTime"),
            trigger: "blur",
          },
        ],
        endtime: [
          {
            required: true,
            message: this.$t("placeholderText.pleaseSelectEndTime"),
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
      if (val) {
        this.ruleForm = this.item;
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    },
    processInfo(val) {
      if (val.id) {
        this.getAuthControlData(val.id);
        this.getAllNode(val.id);
      }
    },
    item(val) {
      this.ruleForm = val;
      if (val.processnodeid) {
        this.checkauthorizeduser(val.processnodeid);
      }
      if (val.id) {
        getAuthInfoDetail(val.id).then((res) => {
          if (res.status === "200") {
            res.data.ruleAuthConditionDtos =
              res.data.ruleAuthConditionDtos === undefined
                ? []
                : res.data.ruleAuthConditionDtos === null
                ? []
                : res.data.ruleAuthConditionDtos;
            this.authJudgeDetailData = res.data.ruleAuthConditionDtos || [];
            if (this.authJudgeDetailData.length === 0) {
              this.authJudgeDetailData = [
                {
                  conditionresult: "",
                  conditiontype: "=",
                  controltype: this.controlsData[0].controltype,
                  controlid: this.controlsData[0].id,
                  maxval: 0,
                  minval: 0,
                  orgattributeid: "",
                  result: "",
                },
              ];
            }
          }
        });
      } else {
        this.authJudgeDetailData = [
          {
            conditionresult: "",
            conditiontype: "=",
            controltype: this.controlsData[0].controltype,
            controlid: this.controlsData[0].id,
            maxval: 0,
            minval: 0,
            orgattributeid: "",
            result: "",
          },
        ];
      }
    },
    authJudgeDetailData: {
      handler: function (val) {
        if (val) {
          this.conditionalResultList = [];
          val.forEach((item, index) => {
            this.conditionalResultList.push([]);
            this.controlsData.forEach((element) => {
              if (item.controlid === element.id) {
                item.conditioninfo = element.operatorStr;
                item.conditiontype = element.controltype;
                item.fieldname = element.name;
                item.controltype = element.controltype;
                item.orgattributeid = "";
                this.conditionalResultList[index] = element.nodeoptions;
              }
            });
          });
        }
      },
      deep: true,
    },
  },
  methods: {
    authNodeHandle(val) {
      this.ruleForm.processnodeid = val;
      this.checkauthorizeduser(val);
    },
    checkauthorizeduser(val) {
      getAuthorizedUser(this.processInfo.id, val).then((res) => {
        this.authoroptions = res.data;
      });
    },
    getAuthControlData(id) {
      getAuthControlData(id).then((res) => {
        if (res.status === "200") {
          this.controlsData = res.data;
        }
      });
    },
    getAllNode(id) {
      getAllNode(id).then((res) => {
        if (res.status === "200") {
          this.authNodeData = res.data;
        }
      });
    },
    orgHandle(val) {
      if (val === "agent") {
        this.checktype = "agent";
        this.selectedElement = {};
        if (this.ruleForm.agentuser) {
          this.getOrgTree(this.ruleForm.agentuser, this.ruleForm.agentusercn);
        } else {
          this.organieationShow = true;
        }
      } else {
        this.checktype = "authorizer";
        this.selectedElement = {};
        if (this.ruleForm.authorizeduser) {
          this.getOrgTree(
            this.ruleForm.authorizeduser,
            this.ruleForm.authorizedusercn
          );
        } else {
          this.organieationShow = true;
        }
      }
    },
    getOrgTree(data, datacn) {
      this.selectedElement = {};
      if (data) {
        let list = datacn.split("、").join("&");
        let idType = [];
        data.split(",").forEach((item, i) => {
          idType.push(`${item}-9`);
        });
        this.selectedElement = {
          id: data.split(","),
          name: list,
          idType: idType.join(";"),
        };
      }
      this.organieationShow = true;
    },
    fnBasOrganieationCallBack(data) {
      if (this.checktype === "agent") {
        this.$set(this.ruleForm, "agentusercn", data.name.split("&").join(","));
        this.$set(this.ruleForm, "agentuser", data.id);
      } else {
        this.$set(
          this.ruleForm,
          "authorizedusercn",
          data.name.split("&").join(",")
        );
        this.$set(this.ruleForm, "authorizeduser", data.id);
      }

      this.organieationShow = false;
    },
    selectType(item, index) {
      // console.log('selectType-item', item)
      // console.log('selectType-index', index)
    },
    addList(type) {
      if (this.controlsData.length !== 0) {
        this.authJudgeDetailData.push({
          conditionresult: "",
          conditiontype: "=",
          controltype: this.controlsData[0].controltype,
          controlid: this.controlsData[0].id,
          maxval: 0,
          minval: 0,
          orgattributeid: "",
          result: "",
        });
      } else {
        this.$message.error(
          this.$t("hintText.pleaseAddControlConditionsFirst")
        );
        return;
      }
    },
    deleteList(index, type) {
      if (type === "judgeData") {
        this.authJudgeDetailData.splice(index, 1);
      } else {
        this.ruleForm.br.orgConditions.splice(index, 1);
      }
    },
    cancel() {
      this.dialogVisible = false;
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (
            new Date(this.ruleForm.begintime).getTime() >
            new Date(this.ruleForm.endtime).getTime()
          ) {
            this.$message.error(
              this.$t("hintText.startTimeShouldBeBeforeEndTime")
            );
            return;
          }
          if (
            new Date().getTime() > new Date(this.ruleForm.endtime).getTime()
          ) {
            this.$message.error(
              this.$t("hintText.endTimeShouldNoBeforeCurrentTime")
            );
            return;
          }
          let arr = this.authJudgeDetailData.filter((item) => {
            return (
              (item.conditiontype === "0" || item.conditiontype === 0) &&
              item.result === ""
            );
          });
          if (arr.length !== 0) {
            this.$message.error(this.$t("hintText.pleaseEnterCompleteInfo"));
            return;
          }

          this.ruleForm = {
            ...this.ruleForm,
            processid: this.processInfo.id,
            ruleAuthConditionDtos: this.authJudgeDetailData,
          };
          this.loading = true;
          saveOrUpdate(this.ruleForm)
            .then((rt) => {
              if (rt.status === "200") {
                if (this.ruleForm.id) {
                  this.$message.success(this.$t("hintText.editedSuccess"));
                } else {
                  this.$message.success(this.$t("hintText.addedSuccess"));
                }
                this.dialogVisible = false;
                this.$emit("confirm", this.ruleForm);
              } else {
                this.$message.error(rt.message);
              }
              this.loading = false;
            })
            .catch((err) => {
              this.loading = false;
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  height: 64vh;
  margin: 0 auto;
  padding: 0 10px;
  overflow: auto;
}
.w100 {
  width: 100%;
}
</style>
<style lang="scss">
.dialog_content_business {
  .el-dialog {
    width: 78vw;
    height: 88vh;
    padding: 20px 30px;
    box-sizing: border-box;
    .el-dialog__body {
      width: 100%;
      .el-date-editor.el-input {
        width: 23vw;
      }
    }
  }
}
</style>


