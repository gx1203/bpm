<template>
  <el-dialog
    v-loading="load"
    :title="$t('approvalOperation')"
    :visible.sync="dialogVisible"
  >
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      :rules="rules"
      label-width="auto"
      class="content"
    >
      <el-form-item label="操作:" prop="approvalComment">
        <el-radio-group v-model="ruleForm.submitaction">
          <el-radio label="同意">{{ $t("agree") }}</el-radio>
          <el-radio label="驳回">{{ $t("rejected") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审批意见:" prop="approvalComment">
        <el-input
          clearable
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="ruleForm.approvalComment"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t("cancelAction") }}</el-button>
      <el-button type="primary" @click="submit('ruleForm')">{{
        $t("confirm")
      }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { approvedList } from "@/bpm/api/staging/personal/approve_list";
import {
  getProcessEfficiency,
  getProcessEfficiencyList,
} from "@/bpm/api/monitor/index.js";
export default {
  data() {
    return {
      dialogVisible: this.value,
      load: false,
      ruleForm: {
        approvalComment: "",
      },
      rules: {
        approvalComment: [
          { required: true, message: "请输入审批意见", trigger: "blur" },
        ],
      },
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit("input", val);
    },
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let list = [];
          this.item.forEach((e) => {
            list.push({
              applyUserId: e.drafterId,
              approvalComment: this.ruleForm.approvalComment,
              approvalResult:
                this.ruleForm.submitaction == "同意" ? "AGREED" : "RETRIAL",
              subject: e.subject,
              submitaction: this.ruleForm.submitaction,
              taskId: e.taskId,
              userId: this.$store.state.app.userInfo.id,
              index: e.index,
            });
          });
          this.load = true;
          getProcessEfficiencyList(list)
            .then((rt) => {
              this.load = false;
              if (rt.status === "200") {
                this.$message.success(this.$t("hintText.operateSuccessfully"));
                this.dialogVisible = false;
                this.$emit("confirm", true);
              }
            })
            .catch((er) => {
              this.load = false;
            });
        }
      });
    },
    cancel() {
      this.dialogVisible = false;
    },
  },
};
</script>

<style scoped>
</style>
