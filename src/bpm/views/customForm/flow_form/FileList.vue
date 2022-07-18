<template>
  <div class="file-list">
    <div v-if="!isChild" class="file-list-head">
<!--      && item.editstate === 'W'-->
      <span v-if="item.isrequired === 'required'" style="color: red">*</span>
      <span>{{item.fieldShowName}}</span>
      <div class="fill"></div>
      <el-upload
        class="upload-demo"
        :action="action"
        :disabled="item.editstate==='R'"
        :with-credentials='true'
        :headers="myHeaders"
        :before-upload="beforeAvatarUpload"
        multiple
        :data="{username:this.$store.state.basuser.user.userid}"
        :on-success="onSuccess"
      >
        <el-button type="text" :disabled="item.editstate==='R'" icon="el-icon-upload2">添加附件</el-button>
      </el-upload>
      <el-button
        type="text"
        icon="el-icon-download"
        @click="downLoadMoreFlie(item.fileList)"
        v-if="!isPrint"
        style="margin-left: 10px;"
      >{{ $t('batchDownload') }}</el-button>
      <el-button
        type="text"
        icon="el-icon-delete"
        @click="deleteMoreFlie(item.fileList)"
        v-if="!isPrint"
        :disabled="item.editstate==='R'"
        style="margin-left: 10px;"
      >{{ $t('batchDelete') }}</el-button>
    </div>
    <div class="file-list-body">
      <el-table
        :data="item.fileList"
        @selection-change="seleFileList"
        ref="multipleTable"
        border
        style="width: 100%"
      >
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column prop="newName" :label="$t('fileName')" show-overflow-tooltip>
            <template slot-scope="scope">
              <!-- <p style="text-align: left;">{{scope.row.newName}}</p> -->
            <p style="text-align: left;" :title="scope.row.newName"><el-button
              type="text"
              style="text-align: left;"
              @click="open(scope.row)"
            >{{scope.row.newName}}</el-button></p>
          </template>
        </el-table-column>
        <el-table-column prop="size" :label="$t('fileSize')" width="160" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{(scope.row.size/1024/1024).toFixed(2) + "Mb"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" :label="$t('attachmentType')" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column prop="uploadUser" :label="$t('uploadedBy')" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$t('operation')" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button
              type="text"
             :title="$t('download')"
              icon="el-icon-download"
              @click="downloadFile(scope.row)"
            ></el-button>
            <el-button
              type="text"
              :title="$t('delete')"
              :disabled="item.editstate==='R'"
              icon="el-icon-delete"
              @click="deleteFlie(scope.$index, scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'FileList',
  components: {},
  data () {
    return {
      fileList: [],
      multFile: [],
      myHeaders: {token: sessionStorage.getItem('token')},
      action: `${process.env.HOST_URL}${process.env.BASE_URL}/attach/upload?attachmentType=bpm`
    }
  },
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    bizData: {
      type: Object,
      default: () => ({})
    },
    isChild: {
      type: Boolean,
      default: false
    },
    isPrint: {
      type: Boolean
    },
    isNoStart: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    'item.fileList': {
      handler (val) {
        this.item.applyvalue = val.map(item => item.id).join()
      },
      deep: true
    }
  },
  methods: {
     beforeAvatarUpload(file){
      const isLt2M = file.size / 1024 / 1024 < 100;
        if (!isLt2M) {
          this.$message.error(this.$t('hintText.uploadAttachmentSizeCannotExceed'));
        }
        return isLt2M;
    },
    initData (val) {
      if (!val.fileList) {
        this.$set(val, 'fileList', [])
      }
      Object.keys(this.bizData).forEach(key => {
        if (key === val.fieldName) {
          console.log(1)
          this.$set(val, 'fileList', this.bizData[key])
        }
      })
    },
    onSuccess (res) {
      this.item.fileList.push(res)
    },
    downLoadMoreFlie () {
      if (this.multFile.length !== 0) {
        this.$loading()
        axios
          .get(
            `${
              process.env.HOST_URL
            }${process.env.BASE_URL}/bpm/attachment/download/batch/${this.multFile.join()}?attachmentType=bpm`,
            {
              responseType: 'arraybuffer',
              headers: {
                ...this.myHeaders
              }
            }
          )
          .then(rt => {
            this.$loading().close()
        window.location.href = rt.config.url

            // window.location.href = rt.request.responseURL
          })
          .catch(() => {
            this.$loading().close()
          })
      } else {
        this.$message({
          message: this.$t('hintText.pleaseSelectAttachmentDownload'),
          type: 'error'
        })
      }
    },
    downloadFile (item) {
      window.location.href = `${process.env.HOST_URL}${process.env.BASE_URL}/bpm/attachment/download/${item.id}?attachmentType=bpm`
    },
    deleteFlie (index, item) {
      // this.$confirm(`您确定要删除【${item.newName}】吗?`, this.$t('hintText.hint'), {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          this.item.fileList.splice(index, 1)
        })
        .catch(_ => {})
    },
    deleteMoreFlie (rows) {
      if (this.multFile.length !== 0) {
        this.$confirm(this.$t('hintText.areYouSureDelete'), {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel')
        })
          .then(() => {
            for (let i = rows.length - 1; i >= 0; i--) {
              if (this.multFile.includes(rows[i].id)) {
                rows.splice(i, 1)
              }
            }
            this.$refs.multipleTable.clearSelection()
          })
          .catch(() => {})
      } else {
        this.$message({
          message: this.$t('hintText.pleaseSelectAttachmentDelete'),
          type: 'error'
        })
      }
    },
   openNTKO(row) {
      var datatochildcmd = 4;
      var v1 = Math.random();
      let _this = this;
      var ntkoed = ntkoBrowser.ExtensionInstalled();
      let _href =
        window.location.origin + window.location.pathname + "static/ntko";
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
        ntkoBrowser.openWindow(
          _href +
            "/editindex.html?cmd=" +
            datatochildcmd +
            "&item=" +
            row.newName +
            "&id=" +
            row.id +
            "&type=" +
            false +
            "&href=" +
            process.env.HOST_URL +
            process.env.BASE_URL +
            "&v1=" +
            v1
        );
      } else {
        this.$message.error(
          "请使用IE9+浏览器，并检查浏览器选项中的安全设置！！"
        );
      }
      window.ntkoSendDataToChildtext = function(ab) {
        ntkoBrowser.ntkoSendDataToChild(
          _href +
            "editindex.html?cmd=" +
            datatochildcmd +
            "&item=" +
            row.newName +
            "&type=" +
            false +
            "&href=" +
            process.env.HOST_URL +
            process.env.BASE_URL +
            "&v1=" +
            v1,
          row.id
        );
      };
      window.ntkoCloseEvent = function() {
        // alert("跨浏览器插件应用程序窗口已关闭!");
      };
      window.OnData = function(id, name) {
        _this.item.value = id;
        _this.item.showValue = name;
      };
    },
    openPDF(row) {
      let url =
        window.location.origin +
        window.location.pathname +
        "/static/pdf/web/viewer.html?file=" +
        encodeURIComponent(
          `${process.env.HOST_URL}${process.env.BASE_URL}/bpm/attachment/download/${row.id}?attachmentType=bpm`
        );
      // window.open(routeData.href, "_blank");
      let a = document.createElement("a");
      // 给创建好的a标签赋值
      a.setAttribute("href", url);
      // 设置css 隐藏属性
      a.setAttribute("style", "display:none");
      // 设置 a标签为新窗口打开
      a.setAttribute("target", "_blank");
      // 将设置好的a标签，添加到 body 内
      document.body.appendChild(a);
      // 模拟点击
      a.click();
      // 移除a标签
      a.parentNode.removeChild(a);
    },
    openIMG(item) {
      let routeData = this.$router.resolve({
        name: "previewImg",
        query: {
          id: item.id
        }
      });
      // window.open(routeData.href, "_blank");
      let a = document.createElement("a");
      // 给创建好的a标签赋值
      a.setAttribute("href", routeData.href);
      // 设置css 隐藏属性
      a.setAttribute("style", "display:none");
      // 设置 a标签为新窗口打开
      a.setAttribute("target", "_blank");
      // 将设置好的a标签，添加到 body 内
      document.body.appendChild(a);
      // 模拟点击
      a.click();
      // 移除a标签
      a.parentNode.removeChild(a);
    },
    open(row) {
      if (
        ["DOC", "DOCX", "XLS", "XLSX", "TXT"].indexOf(
          row.type.toUpperCase()
        ) !== -1
      ) {
        this.openNTKO(row);
      } else if ("PDF".indexOf(row.type.toUpperCase()) !== -1) {
        this.openPDF(row);
      } else if (["JPG", "PNG", "GIF" ,'JPEG'].indexOf(row.type.toUpperCase()) !== -1) {
        this.openIMG(row);
      } else {
        this.$message.error("该文件不支持预览!!!!");
      }
    },
    seleFileList (val) {
      this.multFile = val.map(item => item.id)
    }
  },
  mounted () {
    this.initData(this.item)
  }
}
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
    align-items: flex-end;
    margin-bottom: 10px;
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
</style>
