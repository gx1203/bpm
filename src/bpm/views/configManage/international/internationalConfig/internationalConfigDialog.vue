<template>
  <el-dialog id="staffManageDialog" :title="title" :visible.sync="dialogVisible" @close="closeDialog">
    <el-form :model="item" ref="item" :rules="rules" label-width="140px" class="content">
      <el-form-item :label="$t('simplifiedChinese') + '：'" prop="simplifiedchinese">
        <el-input clearable v-model="item.simplifiedchinese"/>
      </el-form-item>
      <el-form-item :label="$t('traditionalChinese') + '：'" >
        <el-input clearable v-model="item.chinesetraditional" />
      </el-form-item>
      <el-form-item :label="$t('english') + '：'" >
        <el-input clearable v-model="item.english" />
      </el-form-item>
      <el-form-item :label="$t('german') + '：'" >
        <el-input clearable v-model="item.german" />
      </el-form-item>
      <el-form-item :label="$t('japanese') + '：'" >
        <el-input clearable v-model="item.japanese" />
      </el-form-item>
       <el-form-item :label="$t('italian') + '：'" >
        <el-input clearable v-model="item.italian" />
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
  saveZation
} from "@/bpm/api/configManage/internationalConfig";
export default {
  data() {
    return {
      dialogVisible: this.value,
      rules: {
         simplifiedchinese: [
          { required: true, message: this.$t('placeholderText.pleaseEnter') + this.$t('simplifiedChinese'), trigger: "blur" }
        ],
      }
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
    closeDialog () {
      this.$refs.item.resetFields()
    },
    submit(formName) {
        this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          saveZation(this.item)
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
  padding: 0 10px;
}
.w100 {
  width: 100%;
}
</style>
<style lang="scss">
#staffManageDialog {
  .avatar-uploader .el-upload {
    border: 1px dashed $dc1;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>

