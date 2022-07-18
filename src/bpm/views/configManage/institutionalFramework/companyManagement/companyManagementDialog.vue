<template>
  <el-dialog
    id="staffManageDialog"
    class="dialog_content_company"
    :title="title"
    :visible.sync="dialogVisible"
  >
    <el-form
      :model="item"
      ref="item"
      :rules="rules"
      label-width="120px"
      class="content"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('companyName') + '：'" prop="name">
            <el-input clearable v-model="item.name" />
          </el-form-item>
          <el-form-item :label="$t('companyCoding') + '：'" prop="code">
            <el-input clearable v-model="item.code"></el-input>
          </el-form-item>
          <el-form-item :label="$t('organizationType') + '：'" prop="hrtype">
            <el-select
              disabled
              clearable
              v-model="item.hrtype"
              class="w100"
              :placeholder="$t('placeholderText.pleaseSelect')"
            >
              <el-option
                v-for="item in hrtypeList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('parentOrganization') + '：'" prop="pname">
            <el-input v-model="item.pname">
              <el-button slot="append" @click="orgHandle">{{
                $t("placeholderText.select")
              }}</el-button>
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('sort') + '：'">
            <el-input
              type="number"
              onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
              v-model="item.rank"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('expirationDate') + '：'">
            <el-date-picker
              type="datetime"
              :picker-options="pickerOptions1"
              v-model="item.expiredate"
            />
          </el-form-item>
          <el-form-item :label="$t('mainBusiness') + '：'">
            <el-input clearable v-model="item.bussscope" />
          </el-form-item>
          <el-form-item :label="$t('state') + '：'" prop="subtype">
            <el-select
              clearable
              v-model="item.subtype"
              class="w100"
              :placeholder="$t('placeholderText.pleaseSelect')"
            >
              <el-option
                v-for="item in subtypeList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t('companyAbbreviation') + '：'"
            prop="shortname"
          >
            <el-input clearable v-model="item.shortname" />
          </el-form-item>
          <el-form-item :label="$t('companyCode') + '：'" prop="companycode">
            <el-input clearable v-model="item.companycode" />
          </el-form-item>
          <el-form-item
            :label="$t('approvalOrganizationClassification') + '：'"
            prop="approvalorgdesc"
          >
            <el-select
              clearable
              v-model="item.approvalorgdesc"
              class="w100"
              :placeholder="$t('placeholderText.pleaseSelect')"
            >
              <el-option
                v-for="item in approvalorgdescList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('parentOrganizationCode') + '：'"
            prop="pcode"
          >
            <el-input clearable v-model="item.pcode" disabled />
          </el-form-item>
          <el-form-item :label="$t('effectiveDate') + '：'">
            <el-date-picker
              type="datetime"
              :picker-options="pickerOptions0"
              v-model="item.effectivedate"
            />
          </el-form-item>
          <el-form-item :label="$t('holdingType') + '：'">
            <el-select
              clearable
              v-model="item.comtype"
              class="w100"
              :placeholder="$t('placeholderText.pleaseSelect')"
            >
              <el-option
                v-for="item in comtypeList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('plate') + '：'">
            <el-input clearable v-model="item.costcenter" />
          </el-form-item>
          <el-form-item :label="$t('personInCharge') + '：'">
            <el-input
              clearable
              v-model="personincharge.name"
              @focus="Suk_fouces"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t("cancelAction") }}</el-button>
      <el-button type="primary" @click="submit('item')">{{
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
      :multiple="multiple"
      :title="orgtitle"
      @fnCallBack="fnBasOrganieationCallBack"
    />
  </el-dialog>
</template>
<script>
import {
  orgSave,
  queryOrgSuperior,
} from "@/bpm/api/configManage/institutionalFramework/org_info";
import { getDictionaryOption } from "@/bpm/api/process/processModeling/classificationModel";
import { getOrgTree } from "@/bpm/api/app";
import BasComponent from "bas-component";
Vue.use(BasComponent);
import "bas-component/lib/BasComponent.css";
export default {
  data() {
    return {
      multiple:false,
      personincharge: { name: "" },
      dialogVisible: this.value,
      organieationShow: false,
      selectedElement: {},
      showElement: [],
      selectElement: ["0", "1", "2"],
      orgtitle: "选择组织",
      rules: {
        name: [
          {
            required: true,
            message: this.$t("placeholderText.pleaseEnterCompanyName"),
            trigger: "blur",
          },
        ],
        shortname: [
          {
            required: true,
            message: this.$t("placeholderText.pleaseEnterCompanyAbbreviation"),
            trigger: "blur",
          },
        ],
        code: [
          {
            required: true,
            message: this.$t("placeholderText.pleaseEnterCompanyCoding"),
            trigger: "blur",
          },
        ],
        companycode: [
          {
            required: true,
            message: this.$t("placeholderText.pleaseEnterCompanyCode"),
            trigger: "blur",
          },
        ],
        hrtype: [
          {
            required: true,
            message: this.$t("placeholderText.pleaseEnterOrganizationType"),
            trigger: "blur",
          },
        ],
        approvalorgdesc: [
          {
            required: true,
            message: this.$t("placeholderText.pleaseEnterApprovalorgdesc"),
            trigger: "blur",
          },
        ],
        pname: [
          {
            required: true,
            message: this.$t("placeholderText.pleaseEnterpName"),
            trigger: "blur",
          },
        ],
        pcode: [
          {
            required: true,
            message: this.$t("placeholderText.pleaseEnterpCode"),
            trigger: "blur",
          },
        ],
        subtype: [
          {
            required: true,
            message: this.$t("placeholderText.pleaseEnterStatus"),
            trigger: "blur",
          },
        ],
      },
      comtypeList: [],
      hrtypeList: [],
      approvalorgdescList: [],
      subtypeList: [],
      pickerOptions0: {
        disabledDate: (time) => {
          if (this.item.expiredate) {
            return (
              time.getTime() >
                new Date(this.item.expiredate).getTime() - 86400000 ||
              time.getTime() < Date.now() - 86400000
            );
          } else {
            return time.getTime() < Date.now() - 86400000;
          }
        },
      },
      pickerOptions1: {
        disabledDate: (time) => {
          if (this.item.effectivedate) {
            return time.getTime() < new Date(this.item.effectivedate).getTime();
          } else {
            return time.getTime() < Date.now() - 86400000;
          }
        },
      },
    };
  },
  components: {},
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
    title: {
      type: String,
      default: false,
    },
  },
  watch: {
    item(val) {
      if (val) {
        this.$set(this.item, "relDtos", []);
      }
    },
    value(val) {
      this.dialogVisible = val;
      if (val) {
        this.getList();
        this.personincharge = { name: "" };
        if (this.item.id) {
          this.getorg();
        }
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    },
  },
  methods: {
    Suk_fouces() {
      this.check = "zrr";
      this.selectElement = ["9"];
      this.multiple = false
      this.organieationShow = true;
    },
    getorg() {
      queryOrgSuperior(this.item.id).then((res) => {
        if (res.data.length > 0) {
          this.$set(this.personincharge, "name", res.data[0].name);
          this.$set(this.personincharge, "memberId", res.data[0].memberId);
          this.item.relDtos.push(this.personincharge)
        } else {
          this.personincharge = { name: "" };
        }
      });
    },
    getList() {
      let list = [
        getDictionaryOption({ dictionaryen: "组织类型" }),
        getDictionaryOption({ dictionaryen: "公司管理-状态" }),
        getDictionaryOption({ dictionaryen: "公司管理-审批组织分类" }),
        getDictionaryOption({ dictionaryen: "公司管理-控股类型" }),
      ];
      Promise.all(list).then((resultList) => {
        this.hrtypeList = resultList[0].data;
        this.subtypeList = resultList[1].data;
        this.approvalorgdescList = resultList[2].data;
        this.comtypeList = resultList[3].data;
      });
    },
    fnBasOrganieationCallBack(data) {
      if (this.check === "org") {
        this.$set(this.item, "pname", data.name.split("&").join(","));
        this.$set(this.item, "pid", data.id);
        this.$set(this.item, "pcode", data.id);
        this.$set(this.item, "attribute2", data.idType);
      } else {
        this.item.relDtos = [];
        this.$set(this.personincharge, "name", data.name.split("&").join(","));
        this.$set(this.personincharge, "pid", data.id);
        this.$set(this.personincharge, "pcode", data.id);
        this.$set(this.personincharge, "attribute2", data.idType);
        this.$set(this.personincharge, "mainPost", true);
        this.$set(this.personincharge, "memberId", data.id);
        console.log(this.personincharge, "this.personincharge");
        this.item.relDtos.push(this.personincharge);
      }
      this.organieationShow = false;
    },
    orgHandle() {
      this.selectedElement = {};
      this.selectedElement = {};
      this.multiple = true
      this.check = "org";
      this.selectElement = ["0", "1", "2"];
      if (this.item.pid) {
        this.getOrgTree(this.item.pid);
      } else {
        this.organieationShow = true;
      }
    },
    getOrgTree(ids) {
      getOrgTree({
        logic: "and",
        filters: [{ key: "id", opt: "IN", type: "S", value: ids }],
        pageNum: 1,
        pageSize: 10000,
      })
        .then((rt) => {
          if (rt.status === "200") {
            this.selectedElement = {
              id: rt.data.list.map((item) => item.id).join(","),
              name: rt.data.list.map((item) => item.name).join("&"),
              idType: rt.data.list
                .map((item) => {
                  return `${item.id}-${item.type}`;
                })
                .join(";"),
            };
            this.organieationShow = true;
          }
        })
        .catch((er) => {});
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.item.type = "1";
          this.item.isdelete = "N";
          orgSave(this.item)
            .then((rt) => {
              if (rt.status === "200") {
                if (this.item.id) {
                  this.$message.success(this.$t("hintText.editedSuccess"));
                } else {
                  this.$message.success(this.$t("hintText.addedSuccess"));
                }
                this.dialogVisible = false;
                this.$emit("confirm", this.item);
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    cancel() {
      this.dialogVisible = false;
    },
  },
  mounted() {},
};
</script>

<style  scoped>
.content {
  margin: 0 auto;
  padding: 0 10px;
  overflow: auto;
}
.w100 {
  width: 100%;
}
</style>
<style lang="scss">
.dialog_content_company {
  .el-dialog {
    width: 76vw;
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
#staffManageDialog {
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
}
</style>

