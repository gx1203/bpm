<template>
  <el-dialog v-loading="loading" :title="title" :visible.sync="dialogVisible" append-to-body>
    <div class="content">
      <el-form ref="item" :model="item" label-width="120px">
        <el-form-item :label="$t('type') + '：'" prop="type">
          <span slot="label">
            <i style="color: red"> * </i> {{ $t('type') }}
          </span>
          <el-select clearable v-model="item.type" :placeholder="$t('placeholderText.pleaseSelect')" class="w100" @change="fnTable">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('reportName') + '：'" prop="name">
          <span slot="label">
            <i style="color: red"> * </i> {{ $t('reportName') }}
          </span>
          <el-input clearable v-model="item.name" />
        </el-form-item>
        <el-form-item :label="$t('englishNameReport') + '：'" prop="nameen">
          <span slot="label">
            <i style="color: red"> * </i> {{ $t('englishNameReport') }}
          </span>
          <el-input clearable v-model="item.nameen" />
        </el-form-item>
        <el-form-item :label="$t('tableName') + '：'" prop="tablename">
          <span slot="label">
            <i v-if="item.type !== 'process'" style="color: red"> * </i> {{ $t('tableName') }}
          </span>
          <el-input clearable v-model="item.tablename" :disabled="item.type === 'process'" />
        </el-form-item>

        <el-form-item :label="$t('owningProcess') + '：'" prop="processName">
          <el-input clearable v-model="item.processName" :disabled="true" />
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
import {
  saveReport,
  getProcessTablename
} from '@/bpm/api/process/processModeling/report_config'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {
        return {}
      }
    },
    title: {
      type: String,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: this.value,
      loading: false,
      rules: {
        name: [{ required: true, message: '', messages: this.$t('placeholderText.pleaseEnter') + this.$t('reportName'), trigger: 'blur' }],
        nameen: [
          { required: true, message: '', messages: this.$t('placeholderText.pleaseEnter') + this.$t('englishNameReport'), trigger: 'blur' }
        ],
        tablename: [
          { required: true, message: '', messages: this.$t('placeholderText.pleaseEnter') + this.$t('tableName'), trigger: 'blur' }
        ],
        type: [{ required: true, message: '', messages: this.$t('placeholderText.pleaseSelect') + this.$t('reportType'), trigger: 'change' }]
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
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
      if (val) {
        this.fnTable()
      }
    },
    dialogVisible(val) {
      this.$emit('input', val)
    }
  },
  mounted() {
    console.log(this.item)
  },
  methods: {
    fnTable() {
      const than = this
      // than.item.tablename.disabled = false
      this.rules.tablename = [
        { required: true, message: '', messages: this.$t('placeholderText.pleaseEnter') + this.$t('tableName'), trigger: 'blur' }
      ]
      console.log(than.item)
      if (than.item.type === 'process') {
        // than.item.tablename.disbled = true
        this.rules.tablename = ''
        than.item.tablename = ''
        getProcessTablename(than.item.processid).then(rt => {
          if (rt.status === '200') {
            than.$set(than.item, 'tablename', rt.data)
            than.$forceUpdate()
          }
        })
      }
    },
    submit(formName) {
      // this.$refs[formName].validate(valid => {
      //   if (valid) {
      for (const key in this.rules) {
        console.log(key, this.rules[key], this.item[key])
        if (this.rules[key] && this.rules[key].length > 0 && !this.item[key]) {
          this.$message({
            message: this.rules[key][0].messages,
            type: 'warning'
          })
          return
        }
      }
      this.loading = true
      saveReport(this.item)
        .then(rt => {
          this.loading = false
          if (rt.status === '200') {
            this.$message({
              message: this.$t('hintText.saveSuccessfully'),
              type: 'success'
            })
            this.dialogVisible = false
            this.$emit('confirm', true)
          } else {
            this.$message({
              message: this.$t('hintText.failToSave'),
              type: 'error'
            })
          }
        })
        .catch(() => {
          this.loading = false
          this.$message({
            message: this.$t('hintText.failToSave'),
            type: 'error'
          })
        })
      //   }
      // })
    },
    cancel() {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
.content {
  height: 50vh;
  width: 60%;
  margin: 0 auto;
  overflow: auto;
}
</style>
