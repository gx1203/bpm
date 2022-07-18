<template>
  <el-dialog id="treePositionDialog" :title="title" :visible.sync="dialogVisible">
    <el-form :model="item" ref="item" :rules="rules" label-width="auto" class="content">
      <el-form-item :label="$t('name2') + '：'" prop="name">
        <el-input clearable v-model="item.name" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { saveTree } from "@/bpm/api/configManage/institutionalFramework/position_manage.js";

export default {
  data() {
    return {
      dialogVisible: this.value,
      rules: {
        name: [
          { required: true, message: this.$t('placeholderText.pleaseEnterName'), trigger: "blur" },
          { max: 100, message: "名称超长", trigger: "blur" }
        ]
      }
    };
  },
  components: {},
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    item: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
      if(val && this.title !== "编辑节点") {
        this.item.name = ''
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {};
          if (this.title === "编辑节点") {
            params = this.item;
          } else {
            params = {
              pid: this.item.id,
              type: '6',
              name: this.item.name
            };
          }
          saveTree(params).then(rt => {
            if (rt.status === "200") {
              this.$message.success(this.title === "编辑节点" ? this.$t('hintText.editSuccessfully') : this.$t('hintText.addedSuccess'));
              this.$emit("confirm", this.item);
              this.cancel();
            }
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
  padding: 0 10px;
}
.w100 {
  width: 100%;
}
</style>
