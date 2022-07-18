<template>
  <el-dialog :title="title" :visible.sync="dialogVisible">
    <el-form :model="item" ref="item" :rules="rules" label-width="auto" class="content">
      <el-form-item :label="$t('fieldNames') + '：'" prop="fieldName">
        <el-input clearable v-model="item.fieldName" @blur="checkName"/>
      </el-form-item>
      <el-form-item :label="$t('displayText') + '：'" prop="fieldShowName">
        <el-input clearable v-model="item.fieldShowName" />
      </el-form-item>
      <el-form-item :label="$t('fieldType') + '：'" prop="inputType">
        <el-select clearable v-model="item.inputType" class="w100" :placeholder="$t('placeholderText.pleaseSelect')">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('fieldLength') + '：'" prop="length">
        <el-input
          v-model="item.length"
          onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
          type="number"
        />
      </el-form-item>
      <el-form-item :label="$t('dataSources') + '：'">
        <el-input clearable v-model="item.datasource" @focus="dialogShow=true"/>
      </el-form-item>
      <el-form-item :label="$t('jsEvent') + '：'" prop="event">
        <el-input clearable v-model="item.event" />
      </el-form-item>
      <el-form-item :label="$t('jsEventType') + '：'"  prop="eventtype">
        <el-input clearable v-model="item.eventtype" />
      </el-form-item>
      <el-form-item :label="$t('isitRequired') + '：'" prop="isrequired">
        <el-select clearable v-model="item.isrequired" class="w100" :placeholder="$t('placeholderText.pleaseSelect')">
          <el-option
            v-for="item in requiredList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('customStyleClass') + '：'">
        <el-input clearable v-model="item.clssstyle" />
      </el-form-item>
      <el-form-item :label="$t('customStyle') + '：'">
        <el-input clearable v-model="item.classname" />
      </el-form-item>
      <el-form-item :label="$t('remarks') + '：'">
        <el-input clearable type="textarea" v-model="item.remark" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
    <dictionaryDialog v-model="dialogShow" :item="item.datasource" @confirm="getDictionary" />
  </el-dialog>
</template>
<script>
import { saveFieldLibraryList } from "@/bpm/api/process/advancedConfig/field_maintenance.js";
import dictionaryDialog from '@/bpm/components/dictionaryDialog'
import {
  checkFieldKey
} from '@/bpm/api/process/processModeling/classificationModel'
export default {
  data() {
    var validateLength = (rule, value, callback) => {
      if (Number.isInteger(Number(value)) && Number(value) > 0) {
        callback();
      }else if(value.length>10){
        callback(new Error(this.$t('hintText.fieldIsTooLong')));
      } else {
        callback(new Error(this.$t('hintText.pleaseEnterIntegerGreaterThan0')));
      }
    };
    return {
      dialogVisible: this.value,
      dialogShow: false,
      requiredList: [
        {
          value: "required",
          label: this.$t('yes')
        },
        {
          value: "N",
          label: this.$t('no')
        }
      ],
      rules: {
        fieldName: [
          { required: true, message: this.$t('placeholderText.enterSettingsProcessTabCard'), trigger: "blur" },
        ],
        fieldShowName: [
          { required: true, message: this.$t('placeholderText.pleaseEnter') + this.$t('displayText'), trigger: "blur" }
        ],
        inputType: [
          { required: true, message: this.$t('placeholderText.pleaseSelect') + this.$t('fieldType'), trigger: "blur" }
        ],
        length: [
          { required: true, message: this.$t('placeholderText.pleaseEnter') + this.$t('fieldLength'), trigger: "blur" },
          { validator: validateLength, trigger: "blur" }
        ],
        isrequired: [
          { required: true, message: this.$t('placeholderText.pleaseSelect') + this.$t('isitRequired'), trigger: "blur" }
        ],
        event: [
          { max: 200, message: this.$t('jsEvent') + this.$t('superLong'), trigger: "blur" }
        ],
        eventtype: [
          { max: 200, message: this.$t('jsEventType') + this.$t('superLong'), trigger: "blur" }
        ]

      }
    };
  },
  components: {
    dictionaryDialog
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {
        return {};
      }
    },
    title: {
      type: String,
      default: ""
    },
    typeList: {
      type: Array
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
     getDictionary (data) {
      this.item.datasource = data.dictionaryen
    },
     checkName () {
      this.item.fieldName = this.item.fieldName.toUpperCase()
      let reg = /(^_([a-zA-Z0-9]_?)*$)|(^[a-zA-Z](_?[a-zA-Z0-9])*_?$)/
      if (!reg.test(this.item.fieldName)) {
        this.item.fieldName = ''
        this.$message(this.$t('hintText.cannotEnterChineseCharactersAndSomeSpecialSymbols'))
        return
      }
      checkFieldKey(this.item.fieldName).then(rt => {
        if (rt.data === 'Y') {
          this.item.fieldName = ''
          this.$message.error(this.$t('hintText.theFieldIsNamedKeywordPleaseReRnter'))
        }
      })
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          saveFieldLibraryList(this.item)
            .then(rt => {
              if (rt.status === "200") {
                this.$message.success(this.$t('hintText.addedSuccess'))
                this.dialogVisible = false;
                this.$emit("confirm", this.item);
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          this.$message({
            showClose: true,
            type: 'warning',
            message: this.$t('hintText.pleaseEnterCompleteInfo')
          })
        }
      });
    },
    cancel() {
      this.dialogVisible = false;
    }
  },
  mounted() {
  }
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
