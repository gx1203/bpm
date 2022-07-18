<template>
  <div id="trainRecords">
    <el-row :gutter="20">
      <el-col :span="5">
        <process-iframe @click_="handlerProcessIframeNodeClick"></process-iframe>
      </el-col>
      <el-col :span="19">
        <el-scrollbar class="right-content">
          <el-table :data="recordsList" class="main_tab" stripe border>
            <el-table-column :label="$t('number')" type="index"></el-table-column>
            <el-table-column prop="code" :label="$t('processNumber')"></el-table-column>
            <el-table-column prop="name" :label="$t('processName2')"></el-table-column>
            <el-table-column prop="createon" width="130" :label="$t('processReleaseTime')"></el-table-column>
            <el-table-column prop="version" :label="$t('version')"></el-table-column>
            <el-table-column prop="bponame" width="100" :label="$t('processResponsibility')"></el-table-column>
            <el-table-column prop="upbponame" width="120" :label="$t('superiorProcessResponsibility')">
            </el-table-column>
            <el-table-column :label="$t('uploadTime')" width="130">
              <template slot-scope="scope">{{scope.row.createon}}</template>
            </el-table-column>
            <el-table-column :label="$t('description')">
              <template slot-scope="scope">{{scope.row.description}}</template>
            </el-table-column>
            <el-table-column :label="$t('trainingRecord')" width="150">
              <template slot-scope="scope">
                <span class="margin-r5 margin-b5 showFiles" v-for="item in scope.row.doclist" :key="item.id"
                  :title="item.name">
                  <a class="font-link" :href="viewFile(item.docid)" target="_blank">{{item.name}}</a>
                  <a class="margin-l5 font-link" :href="downloadFile(item.docid)" target="_blank">
                    <b class="el-icon-download"></b>
                  </a>
                </span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('operation')">
              <template slot-scope="scope" v-if="referAuthority(scope.row)">
                <a class="font16" @click="openFileUp(scope.row)">
                  <i class="el-icon-upload2"></i>
                </a>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pages.pageNum" :page-size="pages.pageSize" background
            layout="prev, pager, next, jumper, total" :total="pages.total"></el-pagination>
        </el-scrollbar>
      </el-col>
    </el-row>
    <el-dialog :title="$t('addTrainingRecordEvidence')" :visible.sync="dialogVisible" width="50%" @close="closeDialog"
      :close-on-click-modal="false">
      <el-form ref="trainedFile" :model="addTrained" label-width="80px" :rules="rules">
        <el-form-item :label="$t('processName2')">
          <el-input v-model="processName" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('description')">
          <el-input clearable type="textarea" rows="4" resize="none" v-model="addTrained.remarks"></el-input>
        </el-form-item>
        <el-form-item :label="$t('attachment')">
          <el-row>
            <el-col :span="19">
              <p class="w100 minH30px">
                <span class="fileItem" v-for="(item, index) in fileList" :key="item.docId">
                  {{item.docTitle}}
                  <i class="el-icon-close" @click.stop="deleteUploadFile(item, index)"></i>
                </span>
              </p>
            </el-col>
            <el-col :span="4" :offset="1">
              <el-upload :action="action" accept=".xls, .xlsx, .png, .jpg, .jpeg, .txt" :before-upload="beforeUpload"
                :show-file-list="false" :on-success="handlerFileUploadSuccess">
                <el-button size="mini" slot="trigger" type="primary">{{$t('selectAttachment')}}</el-button>
              </el-upload>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="saveBooks('trainedFile')">{{$t("confirm")}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTrainList,
  uploadRecords,
  delRecords,
  getstation
} from '@/bpa/api/processModelCenter/trainRecords'
import paginations from '@/bpa/mixins/pagination_mixin'
import fileOperation from '@/bpa/mixins/fileDownView'
import { viewFile, downloadFile } from '@/bpa/utils/common'
import { uploadFile, deluploadFile } from '@/bpa/api/common'
import cookie from 'js-cookie'
export default {
  data () {
    return {
      processName: '',
      recordsList: [],
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      paramsId: '',
      params: {
        id: ''
      },
      dialogVisible: false,
      addTrained: {
        remarks: ''
      },
      rules: {
        remarks: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      // 上传文件
      fileList: [],
      userId: cookie.get('username'),
      stationList: [],
      stationList2: ''
    }
  },
  computed: {
    host () {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    action () {
      return `${this.host}/attach/upload?username=${this.userId}`
    },
    download () {
      return this.host + '/attach/download/'
    },
    viewfile () {
      return this.host + '/document/print/'
    }
  },
  mixins: [paginations, fileOperation],
  mounted () {
    this.getList()
    this.getstation()
  },
  methods: {
    getList () {
      let obj = {
        filters: [{ key: 'modelid', value: this.params.id }],
        orderby: 'createon',
        sort: 'desc',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize
      }
      getTrainList(obj, 1).then(res => {
        console.log(res)
        console.log(res.list[0])
        if (!res) return false
        this.recordsList = res.list
        this.pages.total = res.total
      })
    },
    // 查询当前登录人的职责岗位
    getstation () {
      getstation(this.userId).then(res => {
        if (!res) return false
        console.log(res)
        if (res.length != 0) {
          res.forEach(item => {
            this.stationList.push(item.id)
          })
          this.stationList2 = this.stationList.join()
          console.log(this.stationList2)
        }
      })
    },
    handlerProcessIframeNodeClick (data) {
      this.params.id = data.id
      this.paramsId = data.id
      console.log(this.paramsId)
      this.getList()
    },
    // 上传培训记录
    openFileUp (item) {
      this.paramsId = item.listid
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.trainedFile.clearValidate()
      })
      this.fileList = JSON.parse(JSON.stringify(item)).doclist.map(obj => {
        return {
          docId: obj.docid,
          docTitle: obj.name,
          downloadUrl: this.host + '/attach/download/' + obj.docid,
          folderDocumentList: [{ documentid: obj.docid, folderid: 'AAAAA' }], // 培训记录写死了'AAAAA'
          provideruser: this.userId,
          revId: obj.docid,
          viewUrl: this.host + '/document/print/' + obj.docid,
          id: obj.id
        }
      })
      this.processName = item.name
      this.addTrained.remarks = !this.fileList.length
        ? ''
        : JSON.parse(JSON.stringify(item)).doclist[0].description
    },
    // 删除培训记录
    closeDialog () {
      this.getList()
    },
    saveBooks (formName) {
      // this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //     if (this.fileList.length === 0) {
      //       this.$message({
      //         type: 'warning',
      //         message: '请上传附件！'
      //       })
      //       return false
      //     }
      if (this.fileList.length > 0) {
        for (let i = 0; i < this.fileList.length; i++) {
          uploadRecords({
            description: this.addTrained.remarks,
            docid: this.fileList[i].docId,
            folderid: 'AAAAA',
            downloadUrl: this.fileList[i].downloadUrl,
            viewUrl: this.fileList[i].viewUrl,
            modelid: this.params.id ? this.params.id : this.paramsId,
            name: this.fileList[i].docTitle
          }).then(res => {
            if (!res) return false
            if (i == this.fileList.length - 1) {
              this.$message({
                type: 'success',
                message: this.$t('hintText.saveSuccessfully')
              })
              this.addTrained = Object.assign({}, this.addTrained, {
                remarks: ''
              })
              this.fileList = []
              this.dialogVisible = false
              this.pages.pageNum = 1
              this.getList()
            }
          })
        }
      } else {
        this.dialogVisible = false
        this.pages.pageNum = 1
        this.getList()
      }
      //   } else {
      //     this.$message({
      //       type: 'warning',
      //       message: '填写必填项！'
      //     })
      //     return false
      //   }
      // })
    },
    handlerFileUploadSuccess (data) {
      console.log(data)
      uploadFile({
        docId: data.id,
        docTitle: data.newName,
        downloadUrl: this.host + '/attach/download/' + data.id,
        folderDocumentList: [{ documentid: data.id, folderid: 'AAAAA' }], // 培训记录写死了'AAAAA'
        provideruser: this.userId,
        revId: !data.revId ? data.id : data.revId,
        viewUrl: this.host + '/document/print/' + data.id
      }).then(res => {
        console.log(res)
        this.fileList.push({
          docId: data.id,
          docTitle: data.newName,
          downloadUrl: this.host + '/attach/download/' + data.id,
          folderDocumentList: [{ documentid: data.id, folderid: 'AAAAA' }], // 培训记录写死了'AAAAA'
          provideruser: this.userId,
          revId: !data.revId ? data.id : data.revId,
          viewUrl: this.host + '/document/print/' + data.id
        })
      })
    },
    deleteUploadFile (item, index) {
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
    referAuthority (item) {
      if (item.bpo || item.upbpoid) {
        if (
          this.stationList2.includes(item.bpo) == true ||
          this.stationList2.includes(item.upbpoid) == true
        ) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    // 上传文件之前的判断文件类型
    beforeUpload (file) {
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
    }
  }
}
</script>

<style lang="scss" scoped>
#trainRecords {
  .fileItem {
    position: relative;
    display: inline-block;
    vertical-align: top;
    padding: 0 20px 0 5px;
    margin-bottom: 5px;
    margin-right: 5px;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
    i {
      position: absolute;
      right: 2px;
      top: 0;
      bottom: 0;
      margin: auto;
      height: 14px;
      cursor: pointer;
    }
  }
  .right-content {
    height: calc(100vh - 160px);
    .el-scrollbar__wrap {
      height: 100%;
    }
    .el-scrollbar__view {
      height: 100%;
    }
  }
  /*附件部分*/
  .showFiles {
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
    box-sizing: border-box;
    a:nth-of-type(2) {
      position: absolute;
      right: 5px;
      top: 5px;
    }
    i {
      position: absolute;
      right: 3px;
      top: 5px;
      color: $ico;
    }
  }
  /deep/ .el-table__fixed-right {
    height: 100% !important;
  }
  /deep/ .el-tree-node__content {
    font-size: 13px !important;
    align-items:stretch !important;
   }
}
</style>
