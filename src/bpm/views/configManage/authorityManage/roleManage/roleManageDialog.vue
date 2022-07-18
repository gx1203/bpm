<template>
  <el-dialog id="staffManageDialog" append-to-body :title="title" :visible.sync="dialogVisible" v-loading="dialogLoading">
    <el-form ref="item" :model="item" :rules="rules" label-width="120px" class="content">
      <el-form-item :label="$t('characterName') + '：'" prop="name">
        <el-input clearable v-model="item.name" />
      </el-form-item>
<!--      <el-form-item :label="$t('type') + '：'" prop="type">-->
<!--        <el-input clearable v-model="item.type" />-->
<!--      </el-form-item>-->
      <el-form-item :label="$t('remarks') + '：'">
        <el-input clearable v-model="item.description" type="textarea" />
      </el-form-item>
      <el-form-item :label="$t('isDefaultRole') + '：'">
        <el-switch v-model="item.defaults" :active-value="active" :inactive-value="inactive" />
      </el-form-item>
      <el-form-item :label="$t('whetherToDisable') + '：'">
        <el-switch v-model="item.delete" :active-value="active" :inactive-value="inactive" />
      </el-form-item>
      <!-- <el-form-item label="权限设置:">
      </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" :disabled="submitDisabled" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { saveRole } from '@/bpm/api/configManage/authorityManage/roleManage'
export default {
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
  data() {
    return {
      dialogVisible: false,
      active: 1,
      inactive: 0,
      rules: {
        name: [
          { required: true, message: this.$t('placeholderText.pleaseEnter') + this.$t('characterName'), trigger: 'blur' },
          { max: 100, message: this.$t('characterName') + this.$t('superLong'), trigger: 'blur' }],
        type: [
          { max: 20, message: this.$t('type') + this.$t('superLong'), trigger: 'blur' }]
      },
      submitDisabled: false,
      dialogLoading: false
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
    },
    dialogVisible(val) {
      this.$emit('input', val)
    }
  },
  mounted() {
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.submitDisabled = true
          this.dialogLoading = true
          saveRole(this.item).then(rt => {
            if (rt.status === '200') {
              this.dialogVisible = false
              this.$message.success(`${this.title}成功`)
              this.$emit('confirm', true)
            }
            this.submitDisabled = false
            this.dialogLoading = false
          }).catch(() => {
            this.submitDisabled = false
            this.dialogLoading = false
          })
        }
      })
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
  padding: 0 10px;
}
.w100 {
  width: 100%;
}
</style>
<style lang="scss">
