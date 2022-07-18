<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" append-to-body>
    <el-form :model="item" ref="item" :rules="rules" label-width="auto" class="content">
      <el-form-item :label="$t('type') + '：'" prop="type">
        <el-select clearable v-model="item.type" :disabled="!!item.id" class="w100">
        <el-option
          v-for="item in typeList"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        ></el-option>
      </el-select>
      </el-form-item>
      <el-form-item :label="$t('fieldNames') + '：'" prop="fieldname">
        <el-input clearable v-model="item.fieldname"  />
      </el-form-item>
      <el-form-item :label="$t('fieldType') + '：'" prop="fieldtype">
        <el-select clearable v-model="item.fieldtype" class="w100">
          <el-option
            v-for="item in selectTypeList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
       <el-form-item :label="$t('fieldDescription') + '：'" prop="fielddesc">
        <el-input clearable type="textarea" v-model="item.fielddesc"  />
      </el-form-item>
       <el-form-item :label="$t('fieldValue') + '：'" prop="fieldvalue">
        <el-input clearable v-model="item.fieldvalue" :disabled="!!item.id"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  saveBusinessAttribute
} from "@/bpm/api/process/business/service_attribute";
export default {
  data() {
    return {
      dialogVisible: this.value,
      selectTypeList: [
        {
          name: this.$t('date'),
          value: "date"
        },
        {
          name: this.$t('string'),
          value: "string"
        },
        {
          name: this.$t('value'),
          value: "number"
        }
      ],
      typeList: [
        {
          name: this.$t('post'),
          value: "0"
        },
        {
          name: this.$t('user'),
          value: "1"
        }
      ],
      rules: {
        type: [
          { required: true, message: this.$t('placeholderText.pleaseChooseTheType'), trigger: "blur" }

        ],
        fieldname: [
          { required: true, message: this.$t('placeholderText.enterSettingsProcessTabCard'), trigger: "blur" },
          { max: 50, message: this.$t('fieldNames') + this.$t('superLong'), trigger: "blur" }

        ],
        fieldtype: [
          { required: true, message: this.$t('placeholderText.pleaseSelect') + this.$t('fieldType'), trigger: "blur" }
        ],
        fielddesc: [
          { required: true, message: this.$t('placeholderText.pleaseEnter') + this.$t('fieldDescription'), trigger: "blur" },
          { max: 50, message: this.$t('fieldDescription') + this.$t('superLong'), trigger: "blur" }
        ],
        fieldvalue: [
          { required: true, message: this.$t('placeholderText.pleaseEnter') + this.$t('fieldValue'), trigger: "blur" }
        ]
      }
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {
        return {}
      }
    },
    title: {
      type: String,
      default: false
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
    },
    dialogVisible(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    submit(formName) {
       this.$refs[formName].validate(valid => {
        if (valid) {
          saveBusinessAttribute(this.item)
            .then(rt => {
              if (rt.status === "200") {
                this.$message({
                  message: this.$t('hintText.saveSuccessfully'),
                  type: "success"
                });
                this.dialogVisible = false;
                this.$emit("confirm", true);
              }
            })
            .catch(() => {
            });
        }
      });
    },
    cancel() {
      this.dialogVisible = false
    }
  }
}
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
