import {
  viewFile,
  viewFile2,
  downloadFile,
  downloadFile2
} from '@/utils/common'
export default {
  methods: {
    noView(item) {
      if (item.viewurl !== '' && item.viewurl) {
        window.open(item.viewurl)
      } else {
        if (!this.isAssetTypeAnImage(item.newname)) {
          this.$message({
            type: 'warning',
            message: '该文件格式暂不支持预览，请下载到本地打开!'
          })
          return false
        } else {
          window.open(this.viewFile(item.id))
        }
      }

    },
    // noUpload(item) {
    //   if (!this.isAssetTypeAnImage(item.newname)) {
    //     this.$message({
    //       type: 'warning',
    //       message: '目前仅支持图片、文本、表格文件格式上传！'
    //     })
    //     return false
    //   } else {

    //   }
    // },
    isAssetTypeAnImage(filename) {
      // 获取最后一个.的位置
      let index = filename.lastIndexOf('.')
      // 获取后缀
      let ext = filename.substr(index + 1)
      return ['png', 'jpg', 'jpeg', 'pdf', 'xls', 'xlsx', 'doc', 'docx', 'ppt', 'pptx', 'pdf', 'txt'].indexOf(ext.toLowerCase()) !== -1
    },
    // 下载文件
    downloadFile(fileId) {
      return downloadFile(fileId)
    },
    // 下载规章制度
    downloadFile2(fileId) {
      return downloadFile2(fileId)
    },
    // 预览文件
    viewFile(fileId) {
      return viewFile(fileId)
    },
    // 预览文件
    viewFile2(fileId, fileName) {
      return viewFile(fileId, fileName)
    },
  }
}