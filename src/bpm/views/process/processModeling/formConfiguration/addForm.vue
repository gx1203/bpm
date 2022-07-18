<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" append-to-body>
    <el-form :model="item" ref="item" :rules="rules" label-width="120px" class="content">
      <el-form-item :label="$t('name2') + '：'" prop="name">
        <el-input clearable v-model="item.name" />
      </el-form-item>
      <el-form-item :label="$t('typeName') + '：'" prop="typenName">
        <el-select clearable v-model="item.typenName" :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('tableName') + '：'" prop="tableName">
        <el-input clearable v-model="item.tableName" />
      </el-form-item>
      <el-form-item :label="$t('copyPage') + '：'">
        <el-select clearable v-model="item.copyView" :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('remarks') + '：'">
        <el-input clearable type="textarea" v-model="item.remark" />
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
      dialogVisible: this.value,
      options: [
        {
          value: "Y",
          label: this.$t('yes')
        },
        {
          value: "N",
          label: this.$t('no')
        }
      ],
      rules: {
        name: [{ required: true, message: this.$t('placeholderText.pleaseEnterName'), trigger: "blur" }],
        typenName: [{ required: true, message: this.$t('placeholderText.pleaseEnter') + this.$t('typeName'), trigger: "blur" }],
        tableName: [{ required: true, message: this.$t('placeholderText.pleaseEnter') + this.$t('tableName'), trigger: "blur" }]
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
.w100 {
  width: 100%;
}
</style>
