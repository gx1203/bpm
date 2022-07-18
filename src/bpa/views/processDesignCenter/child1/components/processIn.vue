<template>
  <div class="w100">
    <!-- 选择组织的dialog -->
    <el-dialog
      class="distribution"
      :visible.sync="processDialogsVisible"
      :title="processMethods"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="trainedFile" label-width="90px">
        <el-form-item class="nessaryFile" :label="$t('attachment')">
          <el-row>
            <el-col :span="19">
              <p class="w100 minH30px">
                <span class="fileItem" v-for="(item, index) in fileList" :key="item.docId">
                  {{item.docTitle}}
                  <i
                    class="el-icon-close"
                    @click.stop="deleteUploadFile(item, index)"
                  ></i>
                </span>
              </p>
            </el-col>
            <el-col :span="4" :offset="1">
              <el-upload
                :action="action"
                accept=".xls, .xlsx, .png, .jpg, .jpeg, .txt"
                :before-upload="beforeUpload"
                :show-file-list="false"
                :on-success="handlerFileUploadSuccess"
              >
                <el-button size="mini" slot="trigger" type="primary">{{$t('selectAttachment')}}</el-button>
              </el-upload>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="$t('hint')"  v-if=" this.processMethod !== this.$t('processImport')" >
          <el-row>
            <el-col :span="24">
              <p style="color:red;padding-bottom:10px;line-height: 26px;">{{$t('hintText.editAndSaveTheProcessCardBeforeImportingTheFlowchart')}}</p>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="processDialogsVisible = false">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="confirmChoose">{{$t("confirm")}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getProcessIframeTree } from '@/bpa/api/componentsApi'
import {
  importProcessJson,
  importProcessChartJson
} from '@/bpa/api/processDesignCenter'
import { uploadFile, deluploadFile } from '@/bpa/api/common'
import cookie from 'js-cookie'
export default {
  name: 'selectProcess',
  data() {
    let self = this
    return {
      processDialogsVisible: false,
      processMethods: '',
      processCodeId: '',
      processCodeState:'',
      // 上传文件
      fileList: [],
      userId: cookie.get('username')
    }
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    action() {
      return `${this.host}/attach/upload?username=${this.userId}`
    }
  },
  mounted() {},
  props: {
    value: {
      type: Boolean,
      default: false
    },
    processMethod: {
      type: String,
      default: ''
    },
    processId: {
      type: String,
      default: ''
    },
    processState: {
      type: String,
      default: ''
    },
  },
  watch: {
    value(val) {
      if (val) {
        this.processDialogsVisible = val
      } else {
        this.fileList = []
      }
    },
    processDialogsVisible(val) {
      this.$emit('input', val)
    },
    processMethod(val) {
      if (val) {
        this.processMethods = val
      }
    },
    processId(val) {
      if (val) {
        this.processCodeId = val
      }
    },
    processState(val) {
      if (val) {
        this.processCodeState = val
      }
    },
  },
  methods: {
    // 上传文件之前的判断文件类型
    beforeUpload(file) {
      console.log(file.name)
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'xls'
      const extension1 = testmsg === 'xlsx'
      const extension2 = testmsg === 'png'
      const extension3 = testmsg === 'jpg'
      const extension4 = testmsg === 'jpeg'
      // const extension5 = testmsg === 'pdf'
      const extension6 = testmsg === 'txt'
      if (
        !extension &&
        !extension1 &&
        !extension2 &&
        !extension3 &&
        !extension4 &&
        !extension6
      ) {
        this.$message({
          message: this.$t('hintText.uploadFileOnlySupportPictureTextTableFileType'),
          type: 'warning'
        })
        return false
      }
    },
    handlerFileUploadSuccess(data) {
      uploadFile({
        docId: data.id,
        docTitle: data.newName,
        downloadUrl: this.host + '/attach/download/' + data.id,
        folderDocumentList: [{ documentid: data.id, folderid: 'PROCEID' }], // 培训记录写死了'AAAAA'
        provideruser: this.userId,
        revId: !data.revId ? data.id : data.revId,
        viewUrl: this.host + '/document/print/' + data.id
        }).then(res => {
          console.log(res)
          this.fileList = [
            {
              docId: data.id,
              docTitle: data.newName,
              downloadUrl: this.host + '/attach/download/' + data.id,
              folderDocumentList: [{ documentid: data.id, folderid: 'PROCEID' }], // 培训记录写死了'AAAAA'
              provideruser: this.userId,
              revId: !data.revId ? data.id : data.revId,
              viewUrl: this.host + '/document/print/' + data.id
            }
          ]
        })
    },
    deleteUploadFile(item, index) {
      deluploadFile(item.docId).then(res => {
        if (!res) return false
        if (item.id) {
          delRecords(item.id).then(res => {
            this.$message({
              type: 'success',
              message: this.$t('hintText.successfullyDelete')
            })
            this.fileList.splice(index, 1)
          })
        } else {
          this.$message({
            type: 'success',
            message: this.$t('hintText.successfullyDelete')
          })
          this.fileList.splice(index, 1)
        }
      })
    },
    confirmChoose() {
      if (this.fileList.length === 0) {
        this.$message({
          type: 'warning',
          message: this.$t('hintText.pleaseUploadTheAttachmentFirst')
        })
        return
      }
      if (this.processMethods === this.$t("processImport")) {
        importProcessJson(this.processCodeId, this.fileList[0].docId).then(
          res => {
            if (!res) return false
            this.$message({
              type: 'success',
              message: this.$t('hintText.importSuccessful')
            })
            this.processDialogsVisible = false
            this.$emit('confirm', '')
          }
        )
      } else if (this.processMethods === this.$t("processImageImport")) {
        if (this.processCodeState === '2'){
            this.$message({
              type: 'warning',
              message: this.$t('hintText.editAndSaveTheProcessCardBeforeImportingTheFlowchart')
            })
            return 
        }
        importProcessChartJson(this.processCodeId, this.fileList[0].docId).then(
          res => {
            console.log(res)
            if (!res) return false
            this.$message({
              type: 'success',
              message: this.$t('hintText.importSuccessful')
            })
            this.processDialogsVisible = false
            this.$emit('confirm', '')
          }
        )
      }
    }
  }
}
</script>

<style lang="scss">
/*附件部分*/
.showFiles {
  span {
    line-height: 18px;
    padding: 3px 20px 3px 8px;
    border: 1px solid #519eff;
    display: inline-block;
    vertical-align: top;
    max-width: 130px;
    border-radius: 3px;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  &.commonpadding span {
    padding: 3px 8px;
  }
  i {
    position: absolute;
    right: 3px;
    top: 5px;
    color: $ico;
  }
  &.processCommon i {
    top: 6px;
  }
}
.ztree li span.button.chk.type1 {
  display: none !important;
}
.distribution {
  .h70px {
    height: 70px;
  }
  .h300px {
    height: 300px;
  }
}
</style>
