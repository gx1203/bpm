<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" append-to-body>
    <el-form :model="item" ref="item" v-loading="loading" :rules="rules" label-width="80px" class="content">
      <el-form-item :label="$t('numbering') + '：'" prop="dictionaryen">
        <el-input clearable :disabled="item.id ? true : false" v-model="item.dictionaryen"  />
      </el-form-item>
      <el-form-item :label="$t('name2') + '：'"  prop="dictionarycn">
        <el-input clearable v-model="item.dictionarycn"  />
      </el-form-item>
      <el-form-item :label="$t('sqlStatement2') + '：'" >
        <el-input clearable v-model="customsqlBase"  style="width: 64.5%"/>
        <el-button @click="checkSql" type="primary" style="margin-left: 10px;">{{ $t('testSqlStatement') }}</el-button>
      </el-form-item>
      <el-form-item :label="$t('expand') + '：'" prop="extension">
        <el-input clearable v-model="item.extension"  />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {saveDictorary, validateSearchModelSQL} from '@/bpm/api/configManage/dataDictorary'
import { BASE64CODE } from '@/bpm/utils/common'
export default {
  data () {
    return {
      dialogVisible: this.value,
      loading: false,
      customsqlBase: '',
      rules: {
        dictionaryen: [
          { required: true, message: this.$t('placeholderText.pleaseEnterNumber'), trigger: 'blur' }
        ],
        dictionarycn: [
          { required: true, message: this.$t('placeholderText.pleaseEnterName'), trigger: 'blur' }
        ],
        extension:[{ max: 255, message: '扩展超长', trigger: 'blur' }]
      }
    }
  },
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
      if (val) {
        this.customsqlBase = this.item.customsql
      } else {
        this.customsqlBase = ''
      }
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    checkSql () {
      if (this.customsqlBase) {
        this.item.customsql = BASE64CODE().encode(this.customsqlBase)
        validateSearchModelSQL({
          customsql: this.item.customsql
        }).then(rt => {
          if (rt.data === 'N') {
            this.$message.error(this.$t('hintText.pleaseEnterCorrectSqlStatement'))
          }else{
            this.$message.success(this.$t('hintText.sqlVerificationSucceeded'))
          }
        })
      }
    },
    submit (formName) {
      let then = this
      then.$refs[formName].validate(valid => {
        if (valid) {
          then.loading = true
          if (then.customsqlBase) {
            this.item.customsql = BASE64CODE().encode(this.customsqlBase)
            validateSearchModelSQL({
              customsql: this.item.customsql
            }).then(rt => {
              if (rt.data === 'N') {
                then.loading = false
                then.$message.error(this.$t('hintText.pleaseEnterCorrectSqlStatement'))
              } else if (rt.data === 'Y') {
                saveDictorary(then.item).then(rt => {
                  if (rt.status === '200') {
                    then.$message.success(this.$t('hintText.operateSuccessfully'))
                    then.dialogVisible = false
                    then.$emit('confirm', then.item)
                  }else {
                    then.$message.error(rt.message?rt.message:this.$t('hintText.operationFailure'))
                  }
                  then.loading = false
                }).catch(() => {
                  then.loading = false
                  then.$message.error(this.$t('hintText.operationFailure'))
                })
              }
            })
          } else {
            let params = Object.assign({},then.item)
            if(params.customsql === ''){
              delete params.customsql
            }
            saveDictorary(params).then(rt => {
              if (rt.status === '200') {
                then.$message.success(this.$t('hintText.operateSuccessfully'))
                then.dialogVisible = false
                then.$emit('confirm', then.item)
              }else {
                then.$message.error(rt.message?rt.message:this.$t('hintText.operationFailure'))
              }
              then.loading = false
            }).catch(() => {
              then.loading = false
              then.$message.error(this.$t('hintText.operationFailure'))
            })
          }
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
  }

</style>
