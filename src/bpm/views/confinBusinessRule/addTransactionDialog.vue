<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="40%" append-to-body @close="cancel">
    <div class="title-item"></div>
    <el-form
      :model="item"
      ref="item"
      :rules="rules"
      label-width="140px"
      class="content"
    >
      <el-form-item
        :label="$t('correspondingBusinessTableFields') + '：'"
        prop="field"
      >
        <el-select
          clearable
          v-model="item.field"
          class="w100"
          @change="fieldHandle"
        >
          <el-option
            v-for="item in subjectruleList"
            :key="item.fieldName"
            :label="item.fieldName"
            :value="item.fieldName"
          >
            <span style="float: left"
              >{{ item.fieldShowName }} -- {{ item.fieldName }}</span
            >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('controlFieldName') + '：'" prop="name">
        <el-input clearable v-model="item.name" @input="operatorHandle" />
      </el-form-item>
      <el-form-item :label="$t('formFieldType') + '：'">
        <el-select
          v-model="item.fieldtype"
          placeholder=""
          disabled
          class="w100"
        >
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item
        :label="$t('applicationModule') + '：'"
        prop="applicationmodule"
      >
        <el-checkbox-group
          v-model="addApplicationModuleValue"
          @change="changeApplicationModule"
        >
          <el-checkbox
            v-for="(items, index) in applicationModuleList"
            :key="index"
            :label="items.value"
            >{{ items.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item> -->
      <el-form-item :label="$t('controlTypeField') + '：'" prop="iscontrol">
        <el-select
          clearable
          disabled
          v-model="item.iscontrol"
          @input="operatorHandle"
          @change="iscontrolHandle"
          class="w100"
        >
          <el-option
            v-for="item in selectTypeList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="item.iscontrol === 0"
        :label="$t('conditionType') + '：'"
        prop="controltype"
      >
        <el-select
          clearable
          v-model="item.controltype"
          @change="controlHandle"
          class="w100"
        >
          <el-option
            v-for="item in condition"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="item.iscontrol === 0"
        :label="$t('comparisonLogic') + '：'"
        prop="operator"
      >
        <el-select
          clearable
          v-model="item.operator"
          @change="operatorHandle"
          class="w100"
        >
          <el-option
            v-for="item in compare"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="是否使用下拉框:">
        <el-select clearable v-model="item.useselect" class="w100">
          <el-option
            v-for="item in whether"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>-->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t("cancelAction") }}</el-button>
      <el-button type="primary" @click="submit('item')">{{
        $t("confirm")
      }}</el-button>
    </span>
    <!-- <dictionaryDialog v-model="dialogShow" :item="item.datasource" @confirm="getDictionary" /> -->
  </el-dialog>
</template>

<script>
import { saveOrUpdate } from "@/bpm/api/process/business/rule_management.js";
import { getFieldLists } from "@/bpm/api/process/processModeling/subject_config";
import dictionaryDialog from "@/bpm/components/dictionaryDialog";
import { getDictionaryOption } from "@/bpm/api/process/processModeling/classificationModel";

export default {
  components: {
    dictionaryDialog,
  },
  data() {
    return {
      item: {
        iscontrol: 0
      },
      addApplicationModuleValue: [],
      dialogVisible: this.value,
      subjectruleList: [],
      dialogShow: false,
      rules: {
        name: [
          {
            required: true,
            message: this.$t("placeholderText.pleaseEnterName"),
            trigger: "change",
          },
        ],
        field: [
          {
            required: true,
            message:
              this.$t("pleaseWrite") +
              this.$t("correspondingBusinessTableFields"),
            trigger: "change",
          },
        ],
        applicationmodule: [
          {
            required: true,
            message: this.$t("pleaseSelect") + this.$t("applicationModule"),
            trigger: "change",
          },
        ],
        iscontrol: [
          {
            required: true,
            message: this.$t("pleaseSelect") + this.$t("isItAControlType"),
            trigger: "change",
          },
        ],
        controltype: [
          {
            required: true,
            message: this.$t("pleaseSelect") + this.$t("conditionType"),
            trigger: "change",
          },
        ],
        operator: [
          {
            required: true,
            message: this.$t("pleaseSelect") + this.$t("comparisonLogic"),
            trigger: "change",
          },
        ],
      },
      selectTypeList: [
        {
          name: this.$t("controlConditionField"),
          value: 0,
        },
        {
          name: this.$t("specialField"),
          value: 1,
        },
      ],
      condition: [
        {
          name: this.$t("customCondition"),
          value: 0,
        },
        {
          name: this.$t("rangeCondition"),
          value: 1,
        },
      ],
      applicationModuleList: [
        // {
        //   name: this.$t('allHave'),
        //   value: "0"
        // },
        {
          name: this.$t("businessRule"),
          value: "1",
        },
        {
          name: this.$t("businessAuth"),
          value: "2",
        },
      ],
      compare: [
        {
          name: "Max≧Value＞Min",
          value: 1,
        },
        {
          name: "Max≧Value≧Min",
          value: 2,
        },
        {
          name: "Max＞Value≧Min",
          value: 3,
        },
        {
          name: "Max＞Value＞Min",
          value: 4,
        },
      ],
      whether: [
        {
          name: this.$t("no"),
          value: "N",
        },
        {
          name: this.$t("yes"),
          value: "Y",
        },
      ],
      typeList: [],
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    treeData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    editItem: {
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
  watch: {
    value(val) {
      this.dialogVisible = val;
      if (val) {
        this.item = Object.assign({}, this.editItem);
        console.log(this.item,'item');
        if (this.item.id) {
          this.addApplicationModuleValue =
            this.item.applicationmodule === "0"
              ? ["1", "2"]
              : this.item.applicationmodule === ""
              ? []
              : this.item.applicationmodule.split(",");
        } else {
          this.addApplicationModuleValue = [];
        }
        /// 默认为控制类别
        this.item.iscontrol = 0
        this.checkType();
      }
      this.$refs.item?.resetFields()
    },
    dialogVisible(val) {
      this.$emit("input", val);
    },
    treeData(val) {
      if (this.item.id) {
        this.getFieldLists();
      }
    },
    item(val) {
      if (this.item.processid) {
        getFieldLists(this.item.processid, {
          version: this.treeData.version
        })
          .then((rt) => {
            if (rt.status === "200") {
              this.subjectruleList = rt.data;
            }
          })
          .catch((er) => {
            this.load = false;
          });
      }
    },
    addApplicationModuleValue: {
      handler(val) {
        this.$set(
          this.item,
          "applicationmodule",
          val.join(",") === "1,2"
            ? "0"
            : val.join(",") === "2,1"
            ? "0"
            : val.join(",")
        );
      },
      deep: true,
    },
  },
  mounted() {
    if (this.treeData.id) {
      this.getFieldLists(this.item.processid);
    }
    getDictionaryOption({
      dictionaryen: "subparagraphType",
    }).then((rt) => {
      this.typeList = rt.data;
    });
  },
  methods: {
    changeApplicationModule(val) {
      this.$set(
        this.item,
        "applicationmodule",
        val.join(",") === "1,2"
          ? "0"
          : val.join(",") === "2,1"
          ? "0"
          : val.join(",")
      );
    },
    iscontrolHandle() {
      this.$set(this.item, "controltype", "");
      this.$set(this.item, "operator", "");
    },
    fieldHandle() {
      this.subjectruleList.forEach((item) => {
        if (item.fieldName === this.item.field) {
          this.item.name = item.fieldShowName;
          this.item.fieldtype = item.inputType;
        }
      });
    },
    getFieldLists(id) {
      if (id) {
        getFieldLists(id, {
          version: this.treeData.version
        })
        .then((rt) => {
          if (rt.status === "200") {
            this.subjectruleList = rt.data;
          }
        })
        .catch((er) => {
          this.load = false;
        });
      }
    },
    operatorHandle() {
      this.$forceUpdate();
    },
    controlHandle() {
      this.item.operator = "";
      this.checkType();
    },
    checkType() {
      if (this.item.controltype === 0) {
        this.compare = [
          {
            name: this.$t("equal"),
            value: 5,
          },
          {
            name: this.$t("noequal"),
            value: 6,
          },
          {
            name: this.$t("contained"),
            value: 7,
          },
          {
            name: this.$t("contain"),
            value: 8,
          },
        ];
      } else {
        this.compare = [
          {
            name: "Max≧Value＞Min",
            value: 1,
          },
          {
            name: "Max≧Value≧Min",
            value: 2,
          },
          {
            name: "Max＞Value≧Min",
            value: 3,
          },
          {
            name: "Max＞Value＞Min",
            value: 4,
          },
        ];
      }
      this.$forceUpdate();
    },
    submit(formName) {
      let _this = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.item.iscontrol === 1) {
            _this.item.operator = "";
            _this.item.controltype = "";
          }
          this.typeList.forEach((item) => {
            if (this.item.fieldtype === item.value) {
              this.item.fieldtypecn = item.text;
            }
          });
          _this.item = {
            ..._this.item,
            version: this.treeData.version
          };
          // 默认选择业务规则
          _this.item.applicationmodule = '1'
          // console.log(_this.item)
          saveOrUpdate(_this.item)
            .then((rt) => {
              if (rt.status === "200") {
                this.$message.success(this.$t("hintText.saveSuccessfully"));
                this.dialogVisible = false;
                this.$emit("confirm", true);
              }
            })
            .catch(() => {});
        }
      });
    },
    cancel() {
      this.addApplicationModuleValue = []
      this.dialogVisible = false;
      this.$refs.item.resetFields()
    }
  },
};
</script>
<style scoped>
.w100 {
  width: 100%;
}
.title-item {
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 24px;
}
</style>
