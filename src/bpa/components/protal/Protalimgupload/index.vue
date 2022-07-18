<template>
  <div class="he">
    <el-upload
      ref="upload"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :auto-upload="autoUpload"
      class="avatar-uploader"
      action="https://jsonplaceholder.typicode.com/posts/"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" width="50%" title="裁剪图片">
      <div style="width: 100%; height:300px; border: 1px solid gray; display: inline-block;">
        <vue-cropper
          ref="cropper"
          :img="options.img"
          :output-size="options.size"
          :output-type="options.outputType"
          :info="true"
          :full="options.full"
          :can-move="options.canMove"
          :can-movebox="options.canMoveBox"
          :original="options.original"
          :auto-crop="options.autoCrop"
          :fixed="options.fixed"
          :fixed-number="options.fixedNumber"
          :center-box="options.centerBox"
          :info-true="options.infoTrue"
          :fixed-box="options.fixedBox"
          drag-mode="crop"
          alt="Source Image"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t("cancel")}}</el-button>
        <el-button type="info" style="margin-right: 40px;" @click="cropImage">裁剪</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
// import { saveimg } from '@/bpa/api/common'

export default {
  name: 'Portalimgupload',
  components: {
    VueCropper
  },
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          disabled: false, // true 启用，false禁用
          img: '', // 裁剪图片的地址
          info: true, // 裁剪框的大小信息
          outputSize: 0.8, // 裁剪生成图片的质量
          outputType: 'jpeg', // 裁剪生成图片的格式
          canScale: false, // 图片是否允许滚轮缩放
          autoCrop: true, // 是否默认生成截图框
          autoCropWidth: 10, // 默认生成截图框宽度
          autoCropHeight: 20, // 默认生成截图框高度
          fixedBox: true, // 固定截图框大小 不允许改变
          fixed: false, // 是否开启截图框宽高固定比例
          fixedNumber: [7, 5], // 截图框的宽高比例
          full: true, // 是否输出原图比例的截图
          canMoveBox: false, // 截图框能否拖动
          original: false, // 上传图片按照原始比例渲染
          centerBox: false, // 截图框是否被限制在图片里面
          infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        }
      }
    },
    logindata: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      imageUrl: '',
      cropImg: '',
      dialogVisible: false,
      autoUpload: true,
      fileList: []
    }
  },
  watch: {
    imageUrl(value) {
      if (value) {
        this.$nextTick(function() {
          this.options.img = this.imageUrl
        })
      }
    }
  },
  created() {},
  mounted() {},
  updated() {},
  methods: {
    // 图片上传 赋值 校验
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.$refs.cropper.startCrop()
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      if (isJPG && isLt2M) {
        this.dialogVisible = true
        // this.$refs.cropper.startCrop()
      }
      return isJPG && isLt2M
    },
    cropImage() {
      this.$refs.cropper.getCropData(data => {
        // do something
        this.imageUrl = data
        // console.log(data)
      })
      this.dialogVisible = false
      this.submitUpload()
    },
    submitUpload() {
      // saveimg(this.imageUrl)
      //   .then(res => {
      //     this.imageUrl = res.data.logininfo.imageUrl
      //   })
      //   .catch(err => {
      //     console.log(err)
      //   })
    }
  }
}
</script>

<style scoped>
.he >>> .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.he >>> .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.he >>> .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 148px;
  height: 148px;
  line-height: 148px;
  text-align: center;
}
.he >>> .avatar {
  width: 148px;
  height: 148px;
  display: block;
}
</style>
