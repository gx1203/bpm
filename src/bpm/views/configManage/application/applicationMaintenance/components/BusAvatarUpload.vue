<template>
  <div class="cropper-app">
    <el-upload
      class="upload-banner"
      action=""
      :auto-upload="true"
      :on-change="handleCrop"
      :before-upload="beforeAvatarUpload"
      :show-file-list="false"
    >
      <el-image
        v-if="cropperData.iconUrl"
        :src="cropperData.iconUrl"
        fit="contain"
        class="avatar"
      ></el-image>
      <div v-else class="upload-box">
<!--        <el-button type="primary" class="select-btn">选择图片</el-button>-->
        <i class="el-icon-plus" />
      </div>
      <div slot="tip" style="font-size: 12px; margin-top: 5px;">只能上传jpg/png文件，且不超过2M</div>
    </el-upload>
    <!-- 剪裁组件弹窗 -->
    <cropper-image
      :dialogVisible="showCropper"
      :cropper-option="cropperOption"
      :file-size="fileSize"
      :cropper-style="cropperStyle"
      @close="showCropper = false"
      @uploadCropper="uploadImg"
    />
  </div>
</template>

<script>
import CropperImage from './CropperImage'
import { imgUpload } from "@/bpm/api/app";
export default {
  name: 'CropperDemo',
  components: {
    CropperImage
  },
  props: {
    uploadFiles: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      cropperData: {
        iconUrl: ''
      },
      showCropper: false, // 显示裁剪弹窗
      canCropper: false,
      fileSize: 2, // 限制文件上传大小
      cropperOption: {
        img: '',
        autoCropWidth: 120,
        autoCropHeight: 120
      },
      cropperStyle: {
        width: '240px',
        height: '240px'
      }
    }
  },

  watch: {
    uploadFiles: {
      handler(newVal) {
        console.log('uploadFiles', newVal)
        if(newVal.length > 0) {
          this.cropperOption.img = newVal[newVal.length-1].url
          this.cropperData.iconUrl = newVal[newVal.length-1].url
        } else {
          this.cropperOption.img = ''
          this.cropperData.iconUrl = ''
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleCrop(file) {
      // 点击弹出剪裁框
      this.$nextTick(() => {
        if (this.canCropper) {
          this.cropperOption.img = window.URL.createObjectURL(file.raw)
          this.showCropper = this.canCropper
        }
      })
    },
    beforeAvatarUpload(file) {
      // 上传前校验
      const isJPG =
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2 MB!')
      }
      // 校验通过后显示裁剪框
      this.canCropper = isJPG && isLt2M
      return false
    },
    // 自定义上传方法
    uploadImg(file, data) {
      let fileFormData = new FormData()
      fileFormData.append('file', file)
      // 移除上传组件带来的bug
      // document.getElementsByTagName('body')[0].removeAttribute('style')

      // api.uploadFile(fileFormData, this).then(res => {
      //   this.cropperData.iconUrl = res
      //   this.showCropper = false
      //   this.$message({
      //     message: '操作成功',
      //     type: 'success'
      //   })
      // })
      imgUpload(fileFormData).then(res => {
        this.$message({
          type: 'success',
          message: '上传成功！'
        })
        this.cropperData.iconUrl = data
        this.showCropper = false
        // this.isShowUpload = false
        this.$emit('uploadCallbackData', res)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.cropper-app {
  /deep/ .el-dialog {
    width: max-content;
    max-width: 860px;
    height: 470px;
  }
  /deep/ .el-image__inner {
    overflow: hidden;
    border-radius: 6px;
  }
}

.cropper-app /deep/ .el-upload {
  width: 100px;
  height: 100px;
  border: 0;
}
.upload-box {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #ccc;
  border-radius: 4px;
  overflow: hidden;
}
.el-upload-tips {
  margin-top: 10px;
  font-size: 14px;
  color: #a7aebb;
}
.select-btn {
  margin-top: 50px;
}
.el-icon-plus {
  font-size: 32px;
  font-weight: 400;
}
</style>
