<template>
  <el-dialog
    :title="$t('selectTheFile2')"
    append-to-body
    :visible.sync="dialogVisible"
    width="30%">
    <el-form :inline="true" v-loading="upLoading">
      <el-upload
      <el-upload
          class="disabledManage"
          size="medium"
          action="no"
          ref="upload"
          :file-list="fileList"
          :auto-upload="false"
          :on-change="beforeUpload"
        accept=".xml"
        :http-request="uploadSuccess">
        <el-button type="primary">{{ $t('selectTheFile2') }}</el-button>
      </el-upload>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveFile">{{ $t('save') }}</el-button>
        <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      </span>
  </el-dialog>
</template>

<script>
import { saveModelExcel} from '@/bpm/api/process/processModeling/modelList'
export default {
  data () {
    return {
      dialogVisible: this.value,
      upLoading: false,
      fileList: []
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
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
    cancel () {
      this.$refs.upload.clearFiles()
      this.dialogVisible = false
    },
    saveFile () {
      this.$refs.upload.submit()
    },
    beforeUpload (file, fileList) {
      const isLt2M = file.size / 1024 / 1024 < 100;
      let postfix = file.name.replace(/.+\./, "");
      const isPostfix = ["XML"].indexOf(postfix.toUpperCase()) === -1;
      if (isPostfix) {
        this.$message.error(this.$t('hintText.pleaseUploadXmlFile'));
        this.$refs.upload.clearFiles()
        return
      }
      if (!isLt2M) {
        this.$message.error(this.$t('hintText.uploadAttachmentSizeCannotExceed'));
        this.$refs.upload.clearFiles()
        return
      }
      this.fileList = fileList.slice(-1);
    },
    uploadSuccess (val) {
      let fd = new FormData()
      fd.append('file', val.file)
      this.upLoading = true
      saveModelExcel(fd).then(res => {
        this.upLoading = false
        if (res.status === '500') {
          this.$message.error(this.$t('hintText.pleaseImportFileCorrectFormat'))
        } else if (!res) {
          this.$message({
            message: this.$t('hintText.importedSuccessfully'),
            type: 'success'
          })
          this.upLoading = false
          this.dialogVisible = false
          this.$refs.upload.clearFiles()
          this.$emit('confirm', this.dialogVisible)
        }
      }).catch(e => {
        console.log(e)
        this.upLoading = false
      })
    },
    removeUpload (file, filelist) {
    }
  }
}
</script>

<style scoped>

</style>
