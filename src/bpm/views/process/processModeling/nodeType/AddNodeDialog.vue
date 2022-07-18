<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" append-to-body>
    <el-form :model="item" ref="item" :rules="rules" label-width="100px" class="content">
      <el-form-item :label="$t('chineseName') + '：'" prop="namecn">
        <el-input clearable v-model="item.namecn" />
      </el-form-item>
      <el-form-item :label="$t('englishName2') + '：'" prop="nameen">
        <el-input clearable v-model="item.nameen" />
      </el-form-item>
      <el-form-item :label="$t('sort') + '：'" prop="sort">
        <el-input type="number" onKeypress="return(/^\d+$/.test(String.fromCharCode(event.keyCode)))"  v-model="item.sort" />
      </el-form-item>
      <el-form-item :label="$t('owningProcess') + '：'" prop="processName">
        <el-input v-model="item.processName" :disabled="true"/>
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
  saveNodeType
} from "@/bpm/api/process/processModeling/node_type";
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
        namecn: [{ required: true, message: this.$t('placeholderText.pleaseEnter') + this.$t('chineseName'), trigger: "blur" }],
        nameen: [{ required: true, message: this.$t('placeholderText.pleaseEnter') + this.$t('englishName2'), trigger: "blur" }],
        sort: [
          { required: true, message: this.$t('placeholderText.pleaseInputSort'), trigger: "blur" },
          { validator: validateRightscode, trigger: 'blur' }

        ],
        processName: [{ required: true, message: this.$t('placeholderText.pleaseEnter') + this.$t('owningProcess'), trigger: "blur" }]
      }
    };
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
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          saveNodeType(this.item)
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
  },
  mounted() {
  }
};
</script>

<style scoped>
/* .content {
  height: 50vh;
  width: 60%;
  margin: 0 auto;
  overflow: auto;
} */
</style>
