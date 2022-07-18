<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" append-to-body @close="closeDialog">
    <el-form :model="item" ref="item" :rules="rules" label-width="140px" class="content">
      <el-form-item :label="$t('authorityName') + '：'" prop="name">
        <el-input clearable v-model="item.name" />
      </el-form-item>
      <!-- <el-form-item label="URL:" prop="url">
        <el-input clearable v-model="item.url" />
      </el-form-item> -->
      <el-form-item :label="$t('sort') + '：'" prop="sort">
        <el-input v-model="item.sort" onKeypress="return(/^\d+$/.test(String.fromCharCode(event.keyCode)))"  type="number"/>
      </el-form-item>
      <el-form-item :label="$t('permissionCode') + '：'" prop="rightscode">
        <el-input clearable v-model="item.rightscode" />
      </el-form-item>
      <el-form-item label="outComes:" prop="outcomes">
        <el-input clearable v-model="item.outcomes" />
      </el-form-item>
      <el-form-item :label="$t('remarks')" prop="remark">
        <el-input clearable v-model="item.remark" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { saveApproveType } from "@/bpm/api/process/processModeling/approve_type";
export default {
  data() {
     var validateRightscode = (rule, value, callback) => {
        if (value.toString().length > 10) {
          callback(new Error(this.$t('hintText.sortExceedsLengthLimit')));
        } else {
          callback();
        }
      };
    return {
      dialogVisible: this.value,
      rules: {
        name: [
          { required: true, message: this.$t('placeholderText.pleaseEnter') + this.$t('authorityName'), trigger: "blur" }
        ],
        sort: [
          { required: true, message: this.$t('placeholderText.pleaseInputSort'), trigger: "blur" },
          { validator: validateRightscode, trigger: 'blur' }
        ],
        rightscode: [
          { required: true, message: this.$t('placeholderText.pleaseEnter') + this.$t('permissionCode'), trigger: "blur" },
          {max: 50, message: this.$t('permissionCode') + this.$t('superLong'), trigger: 'blur' }
        ],
        outcomes: [
          { required: true, message: this.$t('placeholderText.pleaseEnter') + "outComes", trigger: "blur" },
          {max: 50, message: 'outComes' + this.$t('superLong'), trigger: 'blur' }
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
        return {};
      }
    },
    title: {
      type: String,
      default: false
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
    closeDialog () {
      this.$refs.item.resetFields()
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.item.url = '#'
          saveApproveType(this.item)
            .then(rt => {
              if (rt.status === "200") {
                this.$message({
                  message: this.$t('hintText.saveSuccessfully'),
                  type: "success"
                });
                this.dialogVisible = false;
                this.$emit("confirm", true);
              } else {
                this.$message({
                  message: this.$t('hintText.failToSave'),
                  type: "error"
                });
              }
            })
            .catch(() => {
              this.$message({
                message: this.$t('hintText.failToSave'),
                type: "error"
              });
            });
        }
      });
    },
    cancel() {
      this.dialogVisible = false;
    }
  }
};
</script>

<style scoped>
.content {
  height: 50vh;
  width: 60%;
  margin: 0 auto;
  overflow: auto;
}
</style>
