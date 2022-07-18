<template>
  <el-dialog v-loading="loading" :title="title" :visible.sync="dialogVisible" append-to-body>
    <el-form :model="item" label-width="80px" :rules="rules" ref="item" >
      <el-form-item :label="$t('name2') + '：'" prop="name" style="width:60%;">
        <el-input onkeydown="if(event.keyCode==32||event.keyCode==188||event.keyCode==222){return false;}" clearable type="text" v-model="item.name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { saveBtType } from '../../api/confinBusinessRule'
export default {
  name: 'processRolesDialog',
  data () {
    return {
      dialogVisible: false,
      loading: false,
      rules: {
        name: [
          { required: true, message: this.$t('placeholderText.pleaseEnterName'), trigger: 'blur' },
          { max: 100, message: this.$t('name2') + this.$t('superLong'), trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    value: {
      type: Boolean
    },
    title: {
      type: String
    },
    item: {
      type: Object,
      default: () => {
        return {}
      }
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
    submit (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          saveBtType(this.item).then((rt) => {
            if (rt.status === '200') {
              this.$message.success(this.$t('hintText.operateSuccessfully'))
              this.dialogVisible = false
              this.$emit('confirm', this.item)
              this.loading = false
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
