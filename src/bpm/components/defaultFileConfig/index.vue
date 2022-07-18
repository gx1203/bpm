<template>
  <el-dialog v-if="dialogVisible" :append-to-body="true" width="1000px" :visible.sync="dialogVisible" :title="$t('defaultFileConfig')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form ref="form" :model="formData" label-width="80px">
      <el-row class="margin-b10">
        <span class="red" style="margin-right: 3px;">{{ $t('hintText.defaultFilesNote') }}</span>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('defaultFile')">
            <el-upload
              class="upload-demo"
              :action="action"
              :with-credentials='true'
              :headers="myHeaders"
              :before-upload="beforeAvatarUpload"
              multiple
              :data="{ username: this.$store.state.basuser.user.id }"
              :show-file-list="false"
              :on-success="onSuccess"
            >
              <el-button type="primary" icon="el-icon-upload2">{{ $t('addAttachments') }}</el-button>
            </el-upload>
            <p class="fileList">
              <span v-for="(item, index) in fileList" :key="index">
                <a class="font-link">{{ item.docname }}</a>
                <i class="el-icon-close cursor-pointer" @click="deleteFlie(index)" />
              </span>
            </p>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    itemData: {
      type: Object,
      default() {
        return {}
      }
    },
    nodeId: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      dialogVisible: this.value,
      formData: {},
      fileList: [],
      myHeaders: {token: localStorage.getItem('token')},
      action: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/attach/upload?attachmentType=bpm`
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
      if (val) {
        if (this.itemData.nodeDefaultDocDtos && this.itemData.nodeDefaultDocDtos.length > 0) {
          this.fileList = this.itemData.nodeDefaultDocDtos
        }
      } else {
        this.fileList = []
      }
    },
    dialogVisible(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    deleteFlie(index) {
      this.fileList.splice(index, 1)
    },
    beforeAvatarUpload(file){
      const isLt2M = file.size / 1024 / 1024 < 100;
        if (!isLt2M) {
          this.$message.error(this.$t('hintText.uploadAttachmentSizeCannotExceed'))
        }
        return isLt2M;
    },
    onSuccess (res) {
      this.fileList.push({
        docname: res.newName,
        docid: res.id
      })
    },
    submit() {
      this.$emit('confirm', this.fileList)
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
/*附件部分*/
.fileList {
  margin-top: 6px;
  span {
    display: inline-block;
    line-height: 24px;
    height: 24px;
    padding: 0 4px;
    margin-right: 5px;
    margin-bottom: 5px;
    border: 1px solid $active-color;
    border-radius: 4px;
    font-size: 12px;
    color: $active-color;
    .font-link {
      color: $active-color;
    }
    i {
      margin-left: 4px;
      font-size: 15px;
      vertical-align: middle;
    }
  }
}
</style>
