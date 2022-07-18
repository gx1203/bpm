<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" append-to-body>
    <el-form :model="item" ref="item" :rules="rules" label-width="80px" class="content">
      <el-form-item label="审批名称:" prop="name">
        <el-input clearable v-model="item.name" />
      </el-form-item>
      <el-form-item :label="$t('role') + '：'" prop="role">
        <el-input clearable v-model="item.role" />
      </el-form-item>
      <el-form-item label="参数:" prop="params">
        <el-input clearable v-model="item.params" />
      </el-form-item>
      <el-form-item label="URL:" prop="url">
        <el-input clearable v-model="item.url" />
      </el-form-item>
      <el-form-item :label="$t('sort') + '：'" prop="sort">
        <el-input clearable v-model="item.sort" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"  type="number" />
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
  saveApproveFixed
} from "@/bpm/api/process/processModeling/fixed_approval";
export default {
  data() {
    return {
      dialogVisible: this.value,
      rules: {
        name: [{ required: true, message: "请输入审批名称", trigger: "blur" }],
        role: [{ required: true, message: "请输入角色", trigger: "blur" }],
        sort: [{ required: true, message: this.$t('placeholderText.pleaseInputSort'), trigger: "blur" }],
        params: [{ required: true, message: "请输入参数", trigger: "blur" }],
        url: [{ required: true, message: "请输入URL", trigger: "blur" }]
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
          saveApproveFixed(this.item)
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
    },
    addList() {
      this.item.dataList.push({
        name: ""
      });
    },
    deleData(index) {
      this.item.dataList.splice(index, 1);
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
</style>
