<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" v-if="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" append-to-body  @close="closeDialog">
    <el-form
      :model="item"
      ref="item"
      v-loading="loading"
      :rules="rules"
      label-width="90px"
      class="content"
      :disabled="title === $t('viewDatabase')"
    >
      <el-form-item :label="$t('tableName') + '：'" prop="tableName">
        <el-input clearable v-model="item.tableName" />
      </el-form-item>
      <el-form-item :label="$t('tableType') + '：'" prop="isMainTable">
        <el-radio-group v-model="item.isMainTable">
          <el-radio label="0">{{$t('mainTable')}}</el-radio>
          <el-radio label="1">{{$t('subtabulation')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('mainTableName') + '：'" prop="mainTableName">
        <el-input clearable v-model="item.mainTableName" :disabled="item.isMainTable === '0'" />
      </el-form-item>
      <!-- <el-form-item :label="$t('subtableName') + '：'" prop="subtableName">
        <el-input clearable v-model="item.subtableName" />
      </el-form-item> -->
      <el-form-item :label="$t('state') + '：'" prop="isDelete">
        <el-radio-group v-model="item.isDelete">
          <el-radio label="0">{{$t('valid')}}</el-radio>
          <el-radio label="1">{{$t('loseEfficacy')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('tableRemark') + '：'" prop="tableComment">
        <el-input clearable v-model="item.tableComment" type="textarea" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t("cancelAction") }}</el-button>
      <el-button type="primary" @click="submit('item', false)" v-if="title !== $t('viewDatabase')">{{ $t("onlySave") }}</el-button>
      <el-button type="primary" @click="submit('item', true)" v-if="title !== $t('viewDatabase')">{{
        $t("confirmAndGenerate")
      }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {  saveManageTable } from "@/bpm/api/configManage/database";
// import { BASE64CODE } from "@/bpm/utils/common";
export default {
  data() {
    return {
      dialogVisible: this.value,
      loading: false,
      rules: {
        tableName: [
          {
            required: true,
            message: this.$t("placeholderText.pleaseEnterTableName"),
            trigger: "blur",
          }
        ],
        isDelete: [
          {
            required: true,
            message: this.$t("placeholderText.pleaseSelectState"),
            trigger: "change",
          }
        ],
        isMainTable: [
          {
            required: true,
            message: this.$t("placeholderText.pleaseSelectTableType"),
            trigger: "change",
          }
        ],
        mainTableName: [
          {
            required: false,
            message: this.$t("placeholderText.pleaseEnterMainTableName"),
            trigger: "blur"
          }
        ]
      },
      oldTableName: ''
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: () => {
        return {
        };
      },
    },
    title: {
      type: String,
      default: "",
    },
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
      if (val) {
        this.oldTableName = this.item.tableName
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    },
    'item.isMainTable'(val, oldVal) {
      if (oldVal === '1' && val === '0') {
        this.item.mainTableName = ''
      }
      this.rules.mainTableName[0].required = val === '1'
    }
  },
  methods: {
    closeDialog () {
      this.$refs.item.resetFields()
    },
    submit(formName, create) {
      let then = this;
      then.$refs[formName].validate((valid) => {
        if (valid) {
          then.loading = true;
          then.item.create = create;
          then.item.action = this.title === this.$t('editDatabase') ? 'update' : 'save'
          then.$set(then.item, 'oldTableName', then.oldTableName)
          saveManageTable(then.item).then((rt) => {
            if (rt.status === "200") {
              then.$message.success(this.$t("hintText.operateSuccessfully"));
              then.dialogVisible = false;
              then.$emit("confirm", then.item);
            } else {
              this.$message.error(rt.message);
            }
            then.loading = false;
          }).catch(() => {
            then.loading = false;
          });
        }
      });
    },
    cancel() {
      this.dialogVisible = false;
    },
  },
  mounted() {
    console.log('🍓🍓🍓', this.item)
  },
};
</script>

<style lang="scss" scoped>
  .el-dialog__wrapper {
    /deep/ .el-dialog {
      .el-dialog__body {
        height: 50vh;
        overflow: auto;
        .content {
          width: 60%;
          margin: 0 auto;
        }
      }
    }
  }
</style>
