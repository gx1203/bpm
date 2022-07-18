<template>
  <el-dialog v-if="dialogVisible" :title="title" :visible.sync="dialogVisible" :close-on-click-modal=false :close-on-press-escape=false append-to-body>
    <div class="content">
      <el-form :model="item" ref="item" :rules="rules" label-width="120px">
<!--        <el-form-item :label="$t('type') + '：'" prop="type">-->
<!--          <el-select-->
<!--            clearable-->
<!--            v-model="item.type"-->
<!--            :placeholder="$t('placeholderText.pleaseSelect')"-->
<!--            class="w100"-->
<!--            @change="fnTable"-->
<!--          >-->
<!--            <el-option-->
<!--              v-for="val in options"-->
<!--              :key="val.value"-->
<!--              :label="val.label"-->
<!--              :value="val.value"-->
<!--            />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item :label="$t('chartName') + '：'" prop="name">
          <el-input clearable v-model="item.name" />
        </el-form-item>
        <el-form-item :label="$t('englishNameReport') + '：'" prop="nameEn">
          <el-input clearable v-model="item.nameEn" />
        </el-form-item>
        <el-form-item :label="$t('tableName') + '：'" prop="tableName">
          <el-input clearable v-model="item.tableName" :disabled="item.type === 'process'" />
        </el-form-item>
        <el-form-item :label="$t('owningProcess') + '：'" prop="processName">
          <el-input clearable v-model="item.processName" :disabled="true"/>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { saveChart } from "@/bpm/api/process/processModeling/chart_config";
import { getProcessTablename } from '@/bpm/api/process/processModeling/report_config'
export default {
  data() {
    return {
      dialogVisible: this.value,
      rules: {
        type: [
          { required: true, message: this.$t('placeholderText.pleaseSelect') + this.$t('type'), trigger: 'change' }
        ],
        name: [
          { required: true, message: this.$t('placeholderText.pleaseEnter') + this.$t('chartName'), trigger: 'blur' }
        ],
        nameEn: [
          { required: true, message: this.$t('placeholderText.pleaseEnter') + this.$t('englishNameReport'), trigger: 'blur' }
        ],
        tableName: [
          { required: true, message: this.$t('placeholderText.pleaseEnter') + this.$t('tableName'), trigger: ['blur', 'change'] }
        ]
      },
      options: [
        {
          value: 'process',
          label: this.$t('processReport')
        },
        {
          value: 'other',
          label: this.$t('otherReports')
        }
      ]
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
      if (val) {
        this.fnTable()
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    fnTable() {
      if (this.item.type === 'process' && !this.item.tableName) {
        getProcessTablename(this.item.processId).then(rt => {
          if (rt.status === '200') {
            this.$set(this.item, 'tableName', rt.data)
          }
        })
      }
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          saveChart(this.item)
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
    console.log(this.item);
  }
};
</script>

<style lang="scss" scoped>
.el-dialog__wrapper {
  /deep/ .el-dialog__body {
    height: 50vh;
    overflow-y: auto;
    overflow-x: hidden;
    .content {
      width: 60%;
      margin: 0 auto;
    }
  }
}
</style>
