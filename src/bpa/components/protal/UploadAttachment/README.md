<!--公用组件：上传附件 -->
/**
* 按钮组件
* @desc 多附件列表形式展示，可选择
* @author dengxp
* @date 2019.08.20
* @param {Boolean} [required]  default: false是否是必须（只用做来控制是否有小红点）
* @example 调用示例
    <upload-attachment :required="true" ref='attachment'/>
* this.$refs.uploadAttachment.getFileList()   ## 获取已上传的文件信息
* this.$refs.uploadAttachment.getAllFileList()  ## 验证是否有没上传或者上传失败文件
      
