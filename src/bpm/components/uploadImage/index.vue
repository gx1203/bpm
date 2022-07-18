<template>
  <div id="uploadImage">
    <el-upload
      ref="upload_files"
      :class="isShowUpload || uploadFiles.length > 0? 'hidden' : '' "
      :http-request="uploadImg"
      :limit="maxNum"
      :on-exceed="handleExceed"
      :on-success="handleSuccess"
      :on-preview="handlePictureCardPreview"
      :file-list="uploadFiles"
      :on-remove="handleRemove"
      action="#"
      list-type="picture-card">
      <i class="el-icon-plus"/>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img :src="dialogImageUrl" width="100%" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { imgUpload } from '@/bpm/api/app'
export default {
  props: {
    uploadFiles: {
      type: Array,
      default() {
        return []
      }
    },
    maxNum: {
      type: Number,
      default() {
        return 1
      }
    }
  },
  data() {
    return {
      uploadUrl: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/attach/uploadCopy`,
      dialogImageUrl: '',
      dialogVisible: false,
      isShowUpload: false
    }
  },
  methods: {
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      console.log
      console.log(file, fileList)
      this.isShowUpload = false
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePictureCardPreview(file) {
      console.log('preview', file)
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 文件上传成功时的钩子
    handleSuccess(res, file) {
      console.log('上传成功=>', res)
      console.log('上传成功=>', file)
    },
    // 图片上传个数限制提示方法
    handleExceed(files, fileList) {
      this.$message.warning(`最多只允许上传 ${this.maxNum} 张图片！`)
    },
    // 自定义上传图片文件接口
    uploadImg(params) {
      console.log(params)
      const file = params.file,
        fileType = file.type, // 获取文件类型
        filelist = this.$refs.upload_files.uploadFiles, // 已上传文件列表
        isImage = fileType.indexOf('image') != -1 // 判断是否是图片类型
      console.log(this.$refs.upload_files.uploadFiles)
      if (filelist.length > 1) {
        this.$refs.upload_files.uploadFiles.splice(0, 1) // 封面图片只能上传一张
      }
      if (!isImage) {
        console.log('图片格式不对')
        this.$message({
          type: 'warning',
          message: '格式不对，请重新上传'
        })
        this.$refs.upload_files.uploadFiles = [] // 不符合就清空已选择的文件
      } else {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('name', file.name)
        imgUpload(formData).then(res => {
          console.log('--------------------------',res)
          this.$message({
            type: 'success',
            message: '上传成功！'
          })
          if(res.id) {
            this.isShowUpload = true
          }
          this.$emit('uploadCallbackData', res)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hidden /deep/ .el-upload--picture-card {
  display: none !important;
}
</style>
