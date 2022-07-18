<template>
  <div class="attachment-wrapper">
    <div class="header">
      <div class="title">
        附件列表
        <span v-if="required" style="color:red;">*</span>
      </div>
      <el-upload
        :show-file-list="false"
        :before-upload="handleChange"
        class="upload"
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
      >
        <el-button class="scan" size="small" type="primary">
          <i class="el-icon-plus" />浏览
        </el-button>
      </el-upload>
    </div>
    <div class="content">
      <el-table
        :data="fileList"
        style="width: 100%"
      >
        <el-table-column
          :label="$t('fileName')"
          show-overflow-tooltip
          width="150"
        >
          <template slot-scope="scope">
            <span style="width:150px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{ scope.row.showName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :sort-method="sortChange"
          label="文件大小"
          sortable
          prop="size"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.showSize }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('fileType')"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.showSuffix }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          width="180"
        >
          <template slot-scope="scope">
            <el-progress v-if="scope.row.loading" :percentage="scope.row.percent" :show-text="false" style="width:100px;"/>
            <div v-else class="progress-result">
              <span :class="scope.row.showStateClass" class="circle"/>
              <span>{{ scope.row.showState }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')">
          <template slot-scope="scope">
            <span :class="scope.row.showStateClass" class="upload-operator" @click="handleUpload(scope.$index, scope.row)">
              上传
            </span>
            <span :class="scope.row.showStateClass" class="delete-operator" @click="handleDelete(scope.$index, scope.row)">
              删除
            </span>
            <span :class="scope.row.showStateClass" class="download-operator" @click="handleDownload(scope.$index, scope.row)">
              下载
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'UploadAttachment',
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    // 是否必须
    required: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      fileList: [],
      forbiddenFileType: ['exe', 'bat', 'dll', 'sh']
    }
  },
  watch: {
    list: {
      handler(value) {
        if (!value || value.length === 0) {
          return
        }
        this.fileList = JSON.parse(value)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleChange(file) {
      console.log(file)
      const name = file.name
      const index = name.lastIndexOf('.')
      const type = name.substring(index + 1, name.length)
      if (this.forbiddenFileType.indexOf(type) !== -1) {
        this.$message({
          message: '不允许上传可执行文件',
          type: 'error'
        })
        return false
      }
      this.formatFileData(file)
      this.fileList.push(file)
      return false
    },
    formatFileData(file) {
      const name = file.name
      const index = name.lastIndexOf('.')
      file.showName = name.substring(0, index)
      file.showSuffix = name.substring(index + 1, name.length)
      const kb = file.size / 1024
      if (kb > 1024) {
        file.showSize = (kb / 1024).toFixed(1) + 'MB'
      } else {
        file.showSize = kb.toFixed(1) + 'KB'
      }
      file.showState = '等待上传'
      file.percent = 0
      file.loading = false
    },
    formatUploadData(file, file_id) {
      file.showState = '已上传'
      file.showStateClass = 'file-upload'
      file.loading = false
      file.file_id = file_id
      return file
    },
    uploadPercent(file, percent) {
      file.percent = percent
      return file
    },
    handleUpload(index, fileObj) {
      this.$message('就当上传了')
      // 防止重复点击
      if (fileObj.loading) {
        return
      }
      fileObj.loading = true
    },
    handleDownload(index, fileObj) {
      console.log(fileObj)
      if (!fileObj.file_id) {
        return
      }
    },
    handleDelete(index, fileObj) {
      this.fileList.splice(index, 1)
    },
    // 获取已上传的文件数据
    getFileList() {
      const result = this.fileList.filter((item) => {
        return Boolean(item.file_id)
      })
      console.log(result)
      return result
    },
    // 验证是否有没上传或者上传失败文件
    getAllFileList() {
      for (let i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].loading) {
          return {
            status: true,
            msg: '有文件正在上传，确定提交吗？'
          }
        }
        if (!this.fileList[i].file_id) {
          return {
            status: true,
            msg: '有文件未上传或者上传失败，确定提交吗？'
          }
        }
      }
    },
    sortChange(a, b) {
      return a.size - b.size
    }
  }
}
</script>
<style lang="scss">
.attachment-wrapper {
  .header {
    display: flex;
    flex-direction: row;
    height: 60px;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e9e9e9;
    .title {
      font-size: 16px;
      color: #000000;
      font-weight: bold;
      height: 100%;
      line-height: 70px;
    }
  }
  .cell,
  .progress-result {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-shrink: 0;
  }
  .circle {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #f05053;
    margin-right: 8px;
  }
  .circle.file-upload {
    background: #6cd400;
  }
  .upload-operator {
    color: #62bbff;
    font-size: 14px;
    padding-right: 8px;
    border-right: 1px solid #e9e9e9;
    cursor: pointer;
  }
  .upload-operator.file-upload {
    display: none;
  }
  .delete-operator {
    color: #ed4012;
    font-size: 14px;
    padding-left: 8px;
    padding-right: 8px;
    cursor: pointer;
  }
  .delete-operator.file-upload {
    padding-left: 0;
  }
  .download-operator.file-upload {
    display: block;
  }
  .download-operator {
    display: none;
    color: #ff9a00;
    font-size: 14px;
    padding-left: 8px;
    border-left: 1px solid #e9e9e9;
    cursor: pointer;
  }
}
</style>
