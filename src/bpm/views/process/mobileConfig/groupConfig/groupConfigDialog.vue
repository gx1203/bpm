<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" append-to-body>
    <el-form :model="item" ref="item" v-loading='loading' :rules="rules" label-width="auto" class="content">
      <el-form-item label="移动模块名称:" prop="menuname">
        <el-input clearable v-model="item.menuname" />
      </el-form-item>
      <el-form-item :label="$t('sort') + '：'" prop="sort">
        <el-input clearable v-model="item.sort" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"  type="number"/>
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
  saveMobileGroup
} from "@/bpm/api/process/mobileConfig/group_config";
export default {
  data() {
    return {
      loading: false,
      dialogVisible: this.value,
      rules: {
        menuname: {required: true, message: '请输入移动模块名称！！', trigger: 'blur'},
        sort: {required: true, message: '请输入排序！！', trigger: 'blur'}
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
          saveMobileGroup(this.item)
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
.w100{
  width: 100%;
}
</style>
