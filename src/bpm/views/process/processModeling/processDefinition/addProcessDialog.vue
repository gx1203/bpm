<template>
  <el-dialog
    :title="$t('uploadFiles')"
    :visible.sync="dialogExport"
    width="30%"
  >
    <el-form v-loading="upLoading" :inline="true">
      <el-form-item :label="$t('processDefinition') + '：'">
        <el-upload
          ref="upload"
          class="disabledManage"
          size="medium"
          action="no"
          :file-list="fileList"
          :auto-upload="false"
          :on-exceed="onExceed"
          :on-change="beforeUpload"
          :http-request="uploadSuccess"
        >
          <el-button type="primary">
            {{ $t('selectTheFile2') }}
          </el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveFile">{{ $t('save') }}</el-button>
      <el-button @click="dialogExport = false">{{ $t('cancelAction') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { saveModelExcel } from '@/bpm/api/process/processModeling/modelList'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogExport: this.value,
      upLoading: false,
      fileList: []
    }
  },
  watch: {
    value(val) {
      this.dialogExport = val
    },
    dialogExport(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    cancel() {
      this.dialogExport = false
      this.$refs.upload.clearFiles()
    },
    saveFile() {
      this.$refs.upload.submit()
    },
    beforeUpload(file, fileList) {
      const isLt2M = file.size / 1024 / 1024 < 100
      const postfix = file.name.replace(/.+\./, '')
      const isPostfix = ['XML'].indexOf(postfix.toUpperCase()) === -1
      if (isPostfix) {
        this.$message.error(this.$t('hintText.pleaseUploadXmlFile'))
        this.$refs.upload.clearFiles()
        return
      }
      if (!isLt2M) {
        this.$message.error(this.$t('hintText.uploadAttachmentSizeCannotExceed'))
        this.$refs.upload.clearFiles()
        return
      }
      this.fileList = fileList.slice(-1)
    },
    uploadSuccess(val) {
      const fd = new FormData()
      fd.append('file', val.file)
      this.upLoading = true
      saveModelExcel(fd).then(res => {
        this.upLoading = false
        this.$message({
          message: this.$t('hintText.releaseSuccess'),
          type: 'success'
        })
        this.$emit('confirm', true)
        this.$refs.upload.clearFiles()
        this.dialogExport = false
      }).catch(e => {
        console.log(e)
        this.upLoading = false
      })
    },
    removeUpload(file, filelist) {
    }
  }
}
</script>
<style lang="scss" scoped>
    .disabledManage {
      display: flex;
    }
    /deep/ .el-list-enter-active,
    /deep/ .el-list-leave-active {
      transition: none;
    }

    /deep/ .el-list-enter,
    /deep/ .el-list-leave-active {
      opacity: 0;
    }
    /deep/ .el-upload-list {
      height: 40px;
    }
</style>

<style scoped>

</style>
