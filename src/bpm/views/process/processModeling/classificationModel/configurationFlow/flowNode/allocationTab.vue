<template>
  <div id="allocationTab">
    <el-form ref="ruleForm" :model="ruleForm" label-width="120px">
      <el-row class="margin-b15">
        <el-col :span="8" :offset="2">
          <el-upload
            action="/api/file/certification/file"
            :before-upload="beforeAvatarUpload"
            list-type="text"
          >
            <el-button type="primary">
              {{ $t('uploadAttachment') }}
            </el-button>
          </el-upload>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-button type="primary" @click="saveForm">
            {{ $t('operation') }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'AllocationTab',
  data() {
    return {
      ruleForm: {}
    }
  },
  methods: {
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.$message.error(this.$t('hintText.uploadAttachmentSizeCannotExceed'))
      }
      return isLt2M
    },
    saveForm() {
    }
  }
}
</script>
<style lang="scss">
    #allocationTab{
        .el-form-item__label{
            color: $tc1;
            font-size: 12px;
        }
        .el-input__inner{
            border: none;
            border-bottom: 1px solid $dc1;
        }
        .text-r {
            button {
                margin: 15px 10px;
            }
        }
    }
</style>
<style lang="scss" scoped>
    #allocationTab{
        .w100{
            width: 100%;
        }
    }
</style>
