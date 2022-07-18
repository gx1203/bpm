<template>
  <el-dialog id="staffManageDialog" :title="title" :visible.sync="dialogVisible" @close="closeDialog">
    <el-form :model="item" ref="item" :rules="rules" label-width="120px" class="content">
      <el-form-item :label="$t('moduleName') + '：'" prop="modelname">
        <el-input clearable v-model="item.modelname" />
      </el-form-item>
      <el-form-item :label="$t('querySql') + '：'" prop="searchsql">
        <el-input clearable type="textarea" v-model="item.searchsql" />
        <p> {{ $t('hintText.hint') }} ：{{ $t('SQLStatementQueryResultMustHave') }}“translateName”。</p>
        <el-button type="primary" @click="checkSql"> {{ $t('testSqlStatement') }} </el-button>
      </el-form-item>

      <el-form-item :label="$t('remarks') + '：'" prop="description">
        <el-input clearable type="textarea" v-model="item.description" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { saveManagment, validateSearchModelSQL } from '@/bpm/api/configManage/internationalSql'
export default {
  data () {
    return {
      dialogVisible: this.value,
      rules: {
        modelname: [
          { required: true, message: this.$t('hintText.pleaseEnterTheModuleName'), trigger: 'blur' },
          { max: 250, message: '模块名称超长', trigger: 'blur' },
        ],
        description: [
          { max: 250, message: this.$t('hintText.remarksAreSuperLong'), trigger: 'blur' }
        ],
        searchsql: [
          { required: true, message: this.$t('pleaseWrite') + this.$t('querySql'), trigger: 'blur' }
        ]
      }
    }
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
        return {}
      }
    },
    title: {
      type: String,
      default: ''
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    closeDialog () {
      this.$refs.item.resetFields()
    },
    checkSql () {
      if (this.item.searchsql) {
        validateSearchModelSQL(this.item).then(rt => {
          if (rt.data === 'N') {
            this.$message.error(this.$t('hintText.pleaseEnterCorrectSqlStatement'))
          } else if (rt.data === 'Y') {
            this.$message.success(this.$t('hintText.sqlVerificationSucceeded'))
          }
        })
      } else {
        this.$message.error(this.$t('pleaseWrite') + this.$t('querySql'))
      }
    },
    submit (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          validateSearchModelSQL(this.item).then(res => {
            if (res.data === 'N') {
              this.$message.error(this.$t('hintText.pleaseEnterCorrectSqlStatement'))
              this.loading = false
            } else if (res.data === 'Y') {
              saveManagment(this.item).then(rt => {
                if (rt.status === '200') {
                  this.$message.success(this.$t('hintText.operateSuccessfully'))
                  this.dialogVisible = false
                  this.$emit('confirm', this.item)
                }
                this.loading = false
              }).catch(() => {
                this.loading = false
              })
            }
          })
        }
      })
    },
    cancel () {
      this.dialogVisible = false
    }
  },
  mounted () {
  }
}
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
