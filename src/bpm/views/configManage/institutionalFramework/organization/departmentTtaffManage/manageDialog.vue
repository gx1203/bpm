<template>
  <el-dialog id="staffManageDialog" :title="title" :visible.sync="dialogVisible">
    <el-form :model="item" ref="item" label-width="auto" class="content">
      <el-form-item v-if="title==='计划生效'" required :label="$t('effectiveDate') + '：'">
        <el-date-picker v-model="item.createDate" type="date" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('expirationDate') + '：'" required>
        <el-date-picker v-model="item.endDate" type="date" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: this.value
    };
  },
  components: {},
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
      if (this.title === "计划生效") {
        if (!this.item.createDate) {
          this.$message.error(this.$t('pleaseEnterEffectiveDatePlan'))
          return;
        }
      }
      if (!this.item.endDate) {
        this.$message.error(this.$t('pleaseEnterPlanExpirationDate'))
        return;
      }
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
