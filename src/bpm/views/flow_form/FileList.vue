<template>
  <div class="file-list">
    <div v-if="!isChild" class="file-list-head">
      <span v-if="item.isrequired === 'required' && item.editstate === 'W'" style="color: red">*</span>
      <span>{{ item.fieldShowName }}</span>
      <div class="fill"></div>
      <el-upload class="upload-demo" :action="action" :disabled="item.editstate === 'R'" :with-credentials="true"
        :headers="myHeaders" :before-upload="beforeAvatarUpload" multiple
        :data="{ username: this.$store.state.basuser.user.id }" :on-success="onSuccess" v-if="!isPrint">
        <el-button type="text" :disabled="item.editstate === 'R'" icon="el-icon-upload2">{{ $t("addAttachments") }}
        </el-button>
      </el-upload>
      <el-button type="text" icon="el-icon-download" @click="downLoadMoreFlie(item.fileList)" v-if="!isPrint" :disabled="
          (item.fileList && item.fileList.length === 0) ||
          item.editstate === 'D'
        " style="margin-left: 10px">{{ $t("batchDownload") }}</el-button>
      <el-button type="text" icon="el-icon-delete" @click="deleteMoreFlie(item.fileList)" v-if="!isPrint" :disabled="
          item.editstate === 'R' ||
          (item.fileList && item.fileList.length === 0)
        " style="margin-left: 10px">{{ $t("batchDelete") }}</el-button>
    </div>
    <div class="">
      <div v-for="(ele, index) in item.defaultFiles" :key="index + 1" class="showfilelist">
        <p class="filename" @click="Suk_down(ele)">
          {{ ele.newName }}
        </p>
      </div>
    </div>
    <div class="file-list-body">
      <el-table :data="item.fileList" @selection-change="seleFileList" ref="multipleTable" border style="width: 100%">
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column prop="newName" :label="$t('fileName')" show-overflow-tooltip>
          <template slot-scope="scope">
            <p :title="scope.row.newName">{{ scope.row.newName }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="size" :label="$t('fileSize')" width="160" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ (scope.row.size / 1024 / 1024).toFixed(2) + "Mb" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" :label="$t('attachmentType')" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column prop="uploadUser" :label="$t('uploadedBy')" width="160" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :label="$t('operation')" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <!-- <el-button type="text" :title="$t('preview1')" icon="el-icon-view"
              v-if="nodeData.idocViewSetting && signatureStart !== 'Y'" @click="previewFile(scope.row)"></el-button> -->
            <!-- 文件预览 -->
            <!-- <el-button type="text" :title="$t('preview1')" icon="el-icon-view"
               @click="previewFile(scope.row)"></el-button> -->
            <el-button :disabled="item.editstate === 'D'" type="text" :title="$t('download')" icon="el-icon-download"
              @click="downloadFile(scope.row)"></el-button>
            <el-button type="text" :title="$t('delete')" :disabled="item.editstate === 'R'" icon="el-icon-delete"
              v-if="scope.row.docType !== 'default'" @click="deleteFlie(scope.$index, scope.row)"></el-button>
            <el-button @click="signature(scope.row)"
              v-if="item.editstate === 'QZ' && typeList.indexOf(scope.row.type) > -1" type="text"
              icon="el-icon-coordinate" :title="$t('signature')"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <ElectronicSignature v-model="dialogVisible" :item="fileItem" />
  </div>
</template>
<script>
import axios from "axios";
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("app");
import ElectronicSignature from "./ElectronicSignature";
import { getJurisdiction, getSignatureAttachmentId } from "@/bpm/api/flow";

export default {
  name: "FileList",
  components: {
    ElectronicSignature
  },
  data () {
    return {
      myfileList: [],
      fileList: [],
      multFile: [],
      myHeaders: { token: localStorage.getItem("token") },
      action: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/attach/upload?attachmentType=bpm`,
      dialogVisible: false,
      fileItem: {},
      signatureStart: 'N',
      typeList: ['doc', 'docx', 'pdf', 'jpeg', 'png', 'jpg', 'gif', 'tiff', 'html', 'htm', 'xls', 'xlsx']
    };
  },
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    bizData: {
      type: Object,
      default: () => ({}),
    },
    isChild: {
      type: Boolean,
      default: false,
    },
    isPrint: {
      type: Boolean,
    },
    isNoStart: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(["nodeData"]),
  },
  watch: {
    "item.fileList": {
      handler (val) {
        this.item.applyvalue = val.map((item) => item.id).join();
      },
      deep: true,
    },
    "item.uploadFiles": {
      handler (val) {
        if (val && val.length > 0) {
          val.forEach((item) => {
            if (!this.item.fileList.map((el) => el.id).includes(item.id)) {
              this.item.fileList.push(item);
            }
          });
          this.item.fileList.forEach((item) => {
            if (val.map((el) => el.id).includes(item.id)) {
              this.$set(item, "docType", "default");
              this.$set(item, "uploadUser", "默认");
            }
          });
        }
      },
      deep: true,
    },
  },
  methods: {
    signature (item) {
      this.fileItem = item
      this.dialogVisible = true
    },
    Suk_down (item) {
      console.log(this.item);
      if (
        (item.defaultFiles && item.defaultFiles.length === 0) ||
        item.editstate === "D"
      ) {
        this.$message.error("暂无下载权限");
      } else {
        if (
          this.nodeData.processName === "LCSPGLLC" &&
          this.item.fieldName === "LCXGWJ"
        ) {
          window.location.href = `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/attach/download/${item.id}?username=${this.$store.state.basuser.user.id}`;
        } else {
          window.location.href = `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/bpm/attachment/download/${item.id}?attachmentType=bpm`;
        }
      }
    },
    selectEnable (row, rowIndex) {
      return row.docType !== "default";
    },
    previewFile (item) {
      if (this.signatureStart === 'Y') {
        getSignatureAttachmentId(item.id).then(rt => {
          let filename = item.newName
          if (item.id !== rt.data) {
            filename = filename.split('.')
            filename[filename.length - 1] = 'pdf'
            filename = filename.join('.')
          }
          window.open(`${this.nodeData.idocViewServerUrl}${item.id}&name=${filename}`, "_blank")
        })
      } else {
        if (
          this.nodeData.processName === "LCSPGLLC" &&
          this.item.fieldName === "LCXGWJ"
        ) {
          window.open(
            `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/document/print/${item.id}?username=${this.$store.state.basuser.user.id}`,
            "_blank"
          );
        } else {
          window.open(
            `${this.nodeData.idocViewServerUrl}${item.id}&name=${item.newName}`,
            "_blank"
          );
        }
      }
    },
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 100;
      if (!isLt2M) {
        this.$message.error(
          this.$t("hintText.uploadAttachmentSizeCannotExceed")
        );
      }
      return isLt2M;
    },
    initData (val) {
      if (!val.fileList) {
        this.$set(val, "fileList", []);
      }
      if(!this.bizData)return false
      Object.keys(this.bizData).forEach((key) => {
        if (key === val.fieldName) {
          this.$set(val, "fileList", this.bizData[key]);
        }
      });
    },
    onSuccess (res) {
      this.item.fileList.push(res);
    },
    downLoadMoreFlie () {
      if (this.multFile.length !== 0) {
        if (this.signatureStart === 'Y') {
          window.location.href = `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/attach/download/batch/${this.multFile.join()}?attachmentType=bpm`;
        } else {
          if (
            this.nodeData.processName === "LCSPGLLC" &&
            this.item.fieldName === "LCXGWJ"
          ) {
            window.location.href = `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL
              }/attach/download/batch/${this.multFile.join()}?username=${this.$store.state.basuser.user.id
              }`;
          } else {
            this.$loading();
            console.log('🍓1')
            axios
              .get(
                `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL
                }/bpm/attachment/download/batch/${this.multFile.join()}?attachmentType=bpm`,
                {
                  responseType: "arraybuffer",
                  headers: {
                    ...this.myHeaders,
                  },
                }
              )
              .then((rt) => {
                console.log('🍓2')
                this.$loading().close();
                window.location.href = rt.config.url;

                // window.location.href = rt.request.responseURL
              })
              .catch(() => {
                this.$loading().close();
              });
          }
        }
      } else {
        this.$message({
          message: this.$t("hintText.pleaseSelectAttachmentDownload"),
          type: "error",
        });
      }
    },
    downloadFile (item) {
      if (this.signatureStart === 'Y') {
        window.location.href = `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/attach/download/${item.id}?attachmentType=bpm`;
      } else {
        if (
          this.nodeData.processName === "LCSPGLLC" &&
          this.item.fieldName === "LCXGWJ"
        ) {
          window.location.href = `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/attach/download/${item.id}?username=${this.$store.state.basuser.user.id}`;
        } else {
          window.location.href = `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/bpm/attachment/download/${item.id}?attachmentType=bpm`;
        }
      }
      // this.$loading()
      // axios
      //   .get(`${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/bpm/attachment/download/${item.id}`, {
      //     responseType: 'arraybuffer',
      //     headers: {
      //       ...this.myHeaders
      //     }
      //   })
      //   .then(rt => {
      //     this.$loading().close()
      //     // window.location.href = rt.request.responseURL
      //   window.location.href = rt.config.url

      //   })
      //   .catch(() => {
      //     this.$loading().close()
      //   })
    },
    deleteFlie (index, item) {
      // this.$confirm(`您确定要删除【${item.newName}】吗?`, this.$t('hintText.hint'), {
      this.$confirm(
        this.$t("hintText.areYouSureDelete"),
        this.$t("hintText.hint"),
        {
          type: "warning",
        }
      )
        .then(() => {
          this.item.fileList.splice(index, 1);
        })
        .catch((_) => { });
    },
    deleteMoreFlie (rows) {
      if (this.multFile.length == 0) {
        this.$message({
          message: this.$t("hintText.pleaseSelectAttachmentDelete"),
          type: "error",
        });
        return;
      }
      for (let i = rows.length - 1; i >= 0; i--) {
        if (
          this.multFile.includes(rows[i].id) &&
          rows[i].docType === "default"
        ) {
          this.$message({
            message: this.$t("hintText.attachmentsCannotBeDeletedByDefault"),
            type: "error",
          });
          return;
        }
      }
      this.$confirm(this.$t("hintText.areYouSureDelete"), {
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
      })
        .then(() => {
          for (let i = rows.length - 1; i >= 0; i--) {
            if (this.multFile.includes(rows[i].id)) {
              rows.splice(i, 1);
            }
          }
          this.$refs.multipleTable.clearSelection();
        })
        .catch(() => { });
    },
    // open(row) {
    //   let datatochildcmd = 2;
    //   let v1 = Math.random();
    //   var ntkoed = ntkoBrowser.ExtensionInstalled();
    //   if (ntkoed) {
    //       ntkoBrowser.openWindow("http://localhost/newdemo/editindex.html?cmd=" + datatochildcmd + "&v1=" + v1);
    //   } else {
    //       var iTop = ntkoBrowser.NtkoiTop(); //获得窗口的垂直位置;
    //       var iLeft = ntkoBrowser.NtkoiLeft(); //获得窗口的水平位置;
    //       window.open("http://localhost/newdemo/exeindex.html", "", "height=200px,width=500px,top=" + iTop + "px,left=" + iLeft + "px,titlebar=no,toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no");
    //   }
    //   window.ntkoCloseEvent = function() {
    //     alert("跨浏览器插件应用程序窗口已关闭!");
    //   };
    // },
    seleFileList (val) {
      this.multFile = val.map((item) => item.id);
    },
  },
  mounted () {
    this.initData(this.item);
    // 获取电子签章是否开启
    getJurisdiction(this.nodeData.processName).then(rt => {
      this.signatureStart = rt.data.isStart
    })
  },
};
</script>

<style type="text/scss" lang="scss" scoped>
.file-list {
  padding-right: 10px;
  width: 100%;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
  &-head {
    display: flex;
    margin-bottom: 10px;
    align-items: center;
    .fill {
      flex-grow: 1;
    }
    .upload-demo {
      /deep/ .el-upload-list {
        display: none;
      }
    }
  }
  &-body {
    .el-table {
      /deep/ th,
      /deep/ td {
        padding: 7px 0;
        text-align: center;
        .cell {
          line-height: 16px;
        }
      }
      /deep/ .el-table__body-wrapper {
        .el-table__empty-block {
          min-height: 30px;
          .el-table__empty-text {
            line-height: 30px;
            font-size: 12px;
          }
        }
      }
    }
  }
}
.showfilelist {
  display: inline-block;
  width: 33%;
  .filename {
    text-align: left;
    color: #2d42af;
    cursor: pointer;
    padding: 5px 0;
  }
}
</style>
