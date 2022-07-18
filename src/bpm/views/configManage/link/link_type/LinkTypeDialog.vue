<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" append-to-body>
    <el-form :model="item" :rules="rules" ref="item" label-width="auto" class="content">
      <el-form-item :label="$t('linkTypeID') + '：'" prop="linkTypeCode">
        <el-input v-model="item.linkTypeCode" :disabled="!!item.linkTypeCode"/>
      </el-form-item>
      <el-form-item :label="$t('linkTypeName') + '：'" prop="linkTypeName">
        <el-input clearable v-model="item.linkTypeName" />
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
  saveLinkType
} from "@/bpm/api/configManage/link/link_type.js";
export default {
  data() {
    return {
      dialogVisible: this.value,
      rules: {
        linkTypeCode: [
          { required: true, message: "请输入链接类型ID", trigger: "blur" },
          { max: 255, message: "链接类型ID超长", trigger: "blur" }
        ],
        linkTypeName: [
          { required: true, message: "请输入链接类型名称", trigger: "blur" },
          { max: 255, message: "链接类型名称超长", trigger: "blur" }
        ]
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
          this.loading = true;
          saveLinkType(this.item)
            .then(rt => {
              if (rt.status === "200") {
                this.$message.success(this.$t('hintText.addedSuccess'));
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
}
</style>
