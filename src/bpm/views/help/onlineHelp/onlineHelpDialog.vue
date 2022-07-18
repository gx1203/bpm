<template>
  <el-dialog :title="$t('helpDocument')" :visible.sync="dialogVisible" append-to-body>
    <el-form :model="item" :rules="rules" ref="item" label-width="80px" class="content">
      <el-form-item :label="$t('name2') + '：'" prop="title">
        <el-input clearable v-model="item.title" />
      </el-form-item>
      <el-form-item :label="$t('description') + '：'" prop="description">
        <el-input clearable type="textarea" v-model="item.description" />
      </el-form-item>
      <el-form-item :label="$t('file') + '：'" required>
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="action"
          :headers="myHeaders"
          :auto-upload="true"
          :file-list.sync="fileList"
          :multiple="false"
          :before-upload="beforeAvatarUpload"
          :on-success="onSuccess"
          :on-remove="removeFile"
        >
          <el-button slot="trigger" type="primary">{{ $t('selectTheFile2') }}</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>

import { saveHelp } from '@/bpm/api/help/onlineHelp/help'

export default {
  name: 'onlineHelpDialog',
  components: {},
  data () {
    return {
      dialogVisible: this.value,
      usersVisible: false,
      fileList: [],
      myHeaders: {token: localStorage.getItem('token')},
      action: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/attach/upload?attachmentType=bpm`,
      rules: {
        title: [
          { required: true, message: this.$t('placeholderText.pleaseEnterName'), trigger: 'blur' },
          { max: 255, message: this.$t('name2') + this.$t('superLong'), trigger: "blur" }
        ],
        description: [
          { required: true, message: this.$t('placeholderText.pleaseEnterName') + this.$t('description'), trigger: 'blur' },
          { max: 255, message: this.$t('description') + this.$t('superLong'), trigger: "blur" }
        ]
        // filename: [{ required: true, validator: this.validateFile, message: this.$t('hintText.pleaseUploadAttachment'), trigger: 'change' }]
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
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
      if (this.dialogVisible) {
        if (this.item.filename) {
          this.fileList = [
            {
              name: this.item.filename,
              value: this.item.filepath
            }
          ]
        } else {
          this.fileList = []
        }
      }
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    validateFile: function (rule, value, callback) {
      if (this.$refs.upload.fileList.length < 1) {
        callback(new Error(this.$t('hintText.pleaseSelectFileToUpload')))
      }
    },
    beforeAvatarUpload(file){
      const isLt2M = file.size / 1024 / 1024 < 100;
        if (!isLt2M) {
          this.$message.error(this.$t('hintText.uploadAttachmentSizeCannotExceed'));
        }
        return isLt2M;
    },
    removeFile (file, fileList) {
      this.fileList = fileList
    },
    onSuccess (file) {
      this.fileList = [
        {
          name: file.newName,
          value: ''
        }
      ]
      this.item.filename = file.newName
      this.item.filepath = file.id
      this.$refs.upload.clearFiles()
    },
    chooseUser () {
      this.usersVisible = true
    },
    submit (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.fileList.length < 1) {
            this.$message(this.$t('hintText.pleaseUploadAttachment'))
            return
          }
          saveHelp(this.item)
            .then(rt => {
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
              this.$message({
                message: this.$t('hintText.failToSave'),
                type: 'error'
              })
            })
        }
      })
    },
    cancel () {
      this.dialogVisible = false
    }
  },
  mounted () {
    console.log(this.item)
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
