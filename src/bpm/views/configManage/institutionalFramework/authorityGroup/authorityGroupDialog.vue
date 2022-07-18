<template>
  <el-dialog
    id="authorityGroupDialog"
    v-loading="load"
    :title="title"
    :visible.sync="dialogVisible"
  >
    <el-form
      :model="item"
      ref="item"
      label-position="left"
      :rules="rules"
      label-width="auto"
    >
      <el-row>
        <el-col :span="10" :offset="1">
          <el-form-item :label="$t('name2') + '：'" prop="name">
            <el-input clearable v-model="item.name" />
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item :label="$t('organizationType') + '：'" prop="type">
            <el-select
              clearable
              v-model="item.type"
              class="w100"
              :placeholder="$t('placeholderText.pleaseSelect')"
            >
              <el-option
                v-for="item in orgType"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="21" :offset="1">
          <el-form-item :label="$t('description') + '：'">
            <el-input
              clearable
              v-model="item.description"
              autocomplete="off"
              :autosize="{ minRows: 2 }"
              show-word-limit
              type="textarea"
            />
          </el-form-item>
        </el-col>

        <el-col :span="10" :offset="1">
          <el-form-item :label="$t('state') + '：'" prop="delete">
            <el-select
              clearable
              v-model="item.delete"
              class="w100"
              :placeholder="$t('placeholderText.pleaseSelect')"
            >
              <el-option
                v-for="item in subtypeList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="21" :offset="1">
          <el-form-item :label="$t('includeMembers') + '：'">
            <el-button @click="orgHandle">{{ $t("add") }}</el-button>
            <table
              border="1"
              cellspacing="0"
              style="
                margin: 15px 0;
                text-align: center;
                width: 100%;
                border-collapse: collapse;
                border: 1px solid #dedede;
              "
            >
              <thead style="background: #e1eafd !important">
                <tr>
                  <td>{{ $t("name2") }}</td>
                  <td>{{ $t("type") }}</td>
                  <td>{{ $t("operation") }}</td>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(data, index) in item.members"
                  :key="index"
                  style="line-height: 16px; height: 30px; font-size: 13px"
                >
                  <td>
                    <el-input
                      clearable
                      v-model="data.name"
                      disabled
                      style="padding: 5px; width: 91%"
                    ></el-input>
                  </td>
                  <td>
                    <el-select
                      v-model="data.type"
                      style="padding: 5px; width: 91%"
                      disabled
                    >
                      <el-option
                        v-for="item in orgType"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </td>
                  <td>
                    <el-button
                      type="text"
                      icon="el-icon-delete"
                      style="padding: 5px"
                      @click="deleData(index)"
                    >
                    </el-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </el-form-item>
        </el-col>
        <el-col :span="21" :offset="1">
          <el-form-item :label="$t('condition') + '：'">
            <div>
              <el-button @click="conditionsHandle">{{ $t("add") }}</el-button>
            </div>
            <el-radio-group v-model="item.isParent">
              <el-radio label="and">
                {{ $t("satisfy") }}
                <span class="required">{{ $t("allHave") }}</span>
                {{ $t("conditionsAndSubCombinations") }}
              </el-radio>
              <el-radio label="or">
                {{ $t("satisfy") }}
                <span class="required">{{ $t("either") }}</span>
                {{ $t("conditionOrSubCombination") }}
              </el-radio>
            </el-radio-group>
            <el-table
              :data="item.conditions"
              border
              tooltip-effect="dark"
              :header-cell-style="{ background: '#E1EAFD !important' }"
              style="width: 100%; margin: 15px 0"
            >
              <el-table-column
                :label="$t('controlType')"
                show-overflow-tooltip
                align="center"
              >
                <template slot-scope="scope">
                  <el-select
                    clearable
                    v-model="scope.row.attribute"
                    class="w100"
                    :placeholder="$t('placeholderText.pleaseSelect')"
                  >
                    <el-option
                      v-for="item in typeList"
                      :key="item.id"
                      :label="item.orgattributename"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('conditionType')"
                show-overflow-tooltip
                align="center"
              >
                <template slot-scope="scope">
                  <el-select
                    clearable
                    v-model="scope.row.type"
                    class="w100"
                    :placeholder="$t('placeholderText.pleaseSelect')"
                  >
                    <el-option
                      v-for="item in judgingList"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center">
                <template slot="header">
                  <span class="required">*</span>
                  {{ $t("conditionalResult") }}
                </template>
                <template slot-scope="scope">
                  <el-input clearable v-model="scope.row.result"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('operation')"
                show-overflow-tooltip
                align="center"
                width="120"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    icon="el-icon-delete"
                    @click="deleConditions(scope.$index)"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
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
      :isSpecifiedGroupBut="false"
      :isShowBustomGroupsBut="false"
      :showElement="showElement"
      :selectedElement="selectedElement"
      :selectElement="selectElement"
      :title="orgtitle"
      @fnCallBack="fnBasOrganieationCallBack"
    />
  </el-dialog>
</template>
<script>
import {
  saveAuthorityGroup,
  getAuthorityGroup,
} from "@/bpm/api/configManage/institutionalFramework/authority_group";
import { getDictionaryOption } from "@/bpm/api/process/processModeling/classificationModel";
import { getOrgattributeQuickQuery } from "@/bpm/api/process/processModeling/organization";
import BasComponent from "bas-component";
Vue.use(BasComponent);
import "bas-component/lib/BasComponent.css";
export default {
  data() {
    return {
      dialogVisible: this.value,
      organieationShow: false,
      load: false,
      selectedElement: {},
      selectElement: ["0", "1", "2", "3", "4", "5", "6", "9"],
      showElement: [
        {
          key: "1",
          name: this.$t("OrganizationalTree"),
        },
        {
          key: "2",
          name: this.$t("department"),
        },
        {
          key: "6",
          name: this.$t("position"),
        },
      ],
      judgingList: [
        {
          text: "===",
          value: "Eqs",
        },
        {
          text: "!==",
          value: "nes",
        },
        {
          text: this.$t("contained"),
          value: "subOf",
        },
        {
          text: this.$t("contain"),
          value: "content",
        },
      ],
      typeList: [],
      orgtitle: this.$t("selectOrganizational"),
      orgType: [],
      subtypeList: [
        {
          text: this.$t("enable"),
          value: false,
        },
        {
          text: this.$t("disable"),
          value: true,
        },
      ],
      item: {
        members: [],
        conditions: [],
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t("placeholderText.pleaseEnterName"),
            trigger: "blur",
          },
          { max: 200, message: "名称超长！！", trigger: "blur" },
        ],
        type: [
          {
            required: true,
            message:
              this.$t("organizationType") + this.$t("hintText.cannotBeEmpty"),
            trigger: "blur",
          },
        ],
        delete: [
          {
            required: true,
            message: this.$t("placeholderText.pleaseSelectStatus"),
            trigger: "blur",
          },
        ],
      },
    };
  },
  components: {},
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    itemId: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: false,
    },
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
      if (val) {
        this.item = {
          members: [],
          isParent: "and",
          delete: true,
          owner: "7",
          conditions: [],
        };
        this.getData();
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    },
  },
  methods: {
    getData() {
      let than = this;
      this.load = true;
      getDictionaryOption({ dictionaryen: "系统组-组织类型" })
        .then((rt) => {
          than.orgType = rt.data;
          return getOrgattributeQuickQuery({
            pageNum: 1,
            pageSize: 10000
          });
          than.load = false;
        })
        .then((data) => {
          than.typeList = data.data.list;
          than.load = false;
          if (than.itemId && than.itemId !== "") {
            getAuthorityGroup(than.itemId).then((rts) => {
              than.item = rts.data;
              if (than.item.conditions.length > 0) {
                than.$set(than.item, "isParent", than.item.conditions[0].logic);
              }
            });
          }
        });
    },
    deleData(index) {
      this.item.members.splice(index, 1);
    },
    conditionsHandle() {
      this.item.conditions.push({});
    },

    deleConditions(index) {
      this.item.conditions.splice(index, 1);
    },
    fnBasOrganieationCallBack(data) {
      let list = [];
      if (data.idType) {
        data.idType.split(";").forEach((item, index) => {
          let nameType = "";
          this.orgType.forEach((val) => {
            if (item.split("-")[1] === val.value) {
              nameType = val.text;
            }
          });
          list.push({
            memberId: item.split("-")[0],
            // nameType: `${data.name.split("&")[index]}(${nameType})`,
            name: data.name.split("&")[index],
            type: item.split("-")[1],
          });
        });
      }

      this.$set(this.item, "members", list);
      this.organieationShow = false;
    },
    orgHandle() {
      this.selectedElement = {};
      if (this.item.members.length > 0) {
        this.selectedElement = {
          id: this.item.members.map((item) => item.memberId).join(","),
          name: this.item.members.map((item) => item.name).join("&"),
          idType: this.item.members
            .map((item) => {
              return item.memberId + "-" + item.type;
            })
            .join(";"),
        };
      }
      this.organieationShow = true;
    },
    submit(formName) {
      let than = this;
      than.$refs[formName].validate((valid) => {
        if (valid) {
          if (than.item.conditions.length > 0) {
            let bool = false;
            than.item.conditions.forEach((item) => {
              item.logic = than.item.isParent;
              if (!item.attribute || !item.type || !item.result) {
                bool = true;
              }
            });
            if (bool) {
              than.$message.error(
                this.$t("hintText.pleaseFillCompleteConditions")
              );
              return false;
            }
          }
          let isOrg = ["0", "1", "2", "3", "4", "5"];
          than.item.members.forEach((item) => {
            if (isOrg.indexOf(item.type) !== -1) {
              item.provider = "orgMemberProvider";
            } else if (item.type === "6") {
              item.provider = "jobMemberProvider";
            } else if (item.type === "9") {
              item.provider = "userMemberProvider";
            }
          });
          than.loading = true;
          than.item.owner = than.$store.state.app.userInfo.id;
          saveAuthorityGroup(than.item)
            .then((rt) => {
              if (rt.status === "200") {
                if (than.item.id) {
                  than.$message.success(this.$t("hintText.editedSuccess"));
                } else {
                  than.$message.success(this.$t("hintText.addedSuccess"));
                }
                than.dialogVisible = false;
                than.$emit("confirm", than.item);
              }
              than.loading = false;
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

<style scoped>
.content {
  height: 50vh;
  width: 60%;
  margin: 0 auto;
  overflow: auto;
  padding: 0 10px;
}
.w100 {
  width: 100%;
}
</style>
<style lang="scss">
#authorityGroupDialog {
}
</style>

