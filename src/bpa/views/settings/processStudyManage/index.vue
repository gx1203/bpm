<template>
  <div id="processStudyManage">
    <el-row>
      <el-col :span="6">
        <el-input v-model="keyWords" :title="enterTitleFileNameHeir" :placeholder="enterTitleFileNameHeir"
          class="search_component" clearable @keyup.13.native="getList">
          <el-button slot="append"  type="primary"
            @click="pages.pageNum = 1;getList()">{{$t('search')}}</el-button>
        </el-input>
      </el-col>
      <el-col :span="6" :offset="12" class="search_buttons_wrap">
        <el-button type="primary" @click="dialogVisible=true">{{$t("add")}}</el-button>
        <!-- <el-upload
          :action="fileUploadUrl"
          :on-success="(res) => {handleUpload('success', res)}"
          :on-error="(err) => {handleUpload('error', err)}"
          :show-file-list="false"
          class="upload-demo">
          <el-button type="primary">附件上传</el-button>
        </el-upload>-->
        <el-button type="primary" @click="mutipleDleteFiles" :disabled="selectionList.length === 0">{{$t("bpa_batchDelete")}}</el-button>
      </el-col>
    </el-row>
    <el-table :data="studyList" class="main_tab" stripe @selection-change="handleSelectionChange">
      <el-table-column :label="number" type="selection" />
      <el-table-column :label="number" type="index" />
      <el-table-column prop="titlename" :label="title" />
      <el-table-column prop="newname" :label="fileName">
        <template slot-scope="scope">
          <a :href="downloadFile(scope.row.id)" download>{{scope.row.newname}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="createon" :label="uploadTime" />
      <el-table-column prop="createby" :label="heir" />
      <el-table-column prop="address" :label="operation">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="delete2" placement="top">
             <!-- class="no-border" icon="el-icon-delete" circle -->
            <el-button type="text" @click="deleteRow(scope.row.id)" >{{ delete2 }}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="pages.pageNum" :page-size="pages.pageSize" :total="pages.total" background
      layout="prev, pager, next, jumper, total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    <el-dialog :visible.sync="dialogVisible" :title="$t('addTrainingMaterials')" width="65%">
      <el-form ref="form" :model="editFormObj" :rules="modelRules" label-width="80px">
        <el-form-item :label="title" prop="titlename">
          <el-input clearable v-model="editFormObj.titlename" maxlength="50" show-word-limit @input="descInput" />
        </el-form-item>
        <el-form-item :label="mainDocument" required>
          <el-upload :action="fileUploadUrl" :on-success="(res) => {handleUpload('success', res)}"
            :on-error="(err) => {handleUpload('error', err)}" :show-file-list="false" class="upload-demo">
            <el-button size="mini" type="primary">{{$t("bpa_clickUpload")}}</el-button>
          </el-upload>
        </el-form-item>
        <el-table :data="fileList" class="main_tab" stripe border>
          <el-table-column prop="filename" :label="fileName" />
          <el-table-column prop="filesize" :label="fileSize" />
          <el-table-column prop="status" :label="uploadStatus" />
          <el-table-column :label="operation">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="delete2" placement="top">
                <!-- class="no-border" icon="el-icon-delete" circle -->
                <el-button type="text" @click="deleteFile" >{{ delete2 }}</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="download2" placement="top">
                <!-- class="no-border" icon="el-icon-download" circle -->
                <a :href="downloadFile(scope.row.fileId)" download>
                  <el-button type="text">{{ download2 }}</el-button>
                </a>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="saveBooks">{{$t("confirm")}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getStudyList,
  fileUploadStep2,
  deleteStudyItem
} from '@/bpa/api/settings/processStudyManage'
import paginations from '@/bpa/mixins/pagination_mixin'
import fileOperation from '@/bpa/mixins/fileDownView'
import { fileUploadUrl } from '@/bpa/api/componentsApi'
export default {
  mixins: [paginations, fileOperation],
  data () {
    return {
      fileUploadUrl,
      studyList: [],
      editFormObj: { titlename: '' },
      modelRules: {
        titlename: [{ required: true, message: ' ', trigger: 'blur' }]
        // termdetail: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      fileList: [],
      dialogVisible: false,
      selectionList: [],
      keyWords: '',
      form: {},
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      enterTitleFileNameHeir: this.$t("placeholderText.enterTitleFileNameHeir"),
      number: this.$t("bpa_number"),
      title: this.$t("bpa_title"),
      fileName: this.$t("fileName"),
      uploadTime: this.$t("uploadTime"),
      heir: this.$t("heir"),
      operation: this.$t("operation"),
      uploadTrainingMaterials: this.$t("uploadTrainingMaterials"),
      mainDocument: this.$t("bpa_mainDocument"),
      fileSize: this.$t("fileSize"),
      uploadStatus: this.$t("uploadStatus"),
      delete2: this.$t("delete"),
      download2: this.$t("download"),
      pleaseUploadtheMainDocument: this.$t("hintText.pleaseUploadtheMainDocument"),
      saveSuccessfully: this.$t("hintText.saveSuccessfully"),
      failToSave: this.$t("hintText.failToSave"),
      requiredFieldsCannotBeEmpty: this.$t("hintText.requiredFieldsCannotBeEmpty"),
      pleaseDeleteItAndUploadItAgain: this.$t("hintText.pleaseDeleteItAndUploadItAgain"),
      pleaseSelectDeleteItem: this.$t("hintText.pleaseSelectDeleteItem"),
      areYouSureDelete: this.$t("hintText.areYouSureDelete"),
      hint: this.$t("hintText.hint"),
      confirm: this.$t("confirm"),
      cancel: this.$t("cancel"),
      areYouSureYouWantToDeleteInBatches: this.$t("hintText.areYouSureYouWantToDeleteInBatches"),
      successfullyDelete: this.$t("hintText.successfullyDelete"),
    }
  },
  computed: {
    host () {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    }
  },
  watch: {
    dialogVisible: {
      handler: function(val) {
        if (val) {
          this.editFormObj.titlename = ''
          this.fileList = []
        }
      }
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    deleteFile () {
      this.fileList = []
    },
    getList () {
      getStudyList({
        attr: {},
        orderby: 'createon',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: 'desc',
        logic: 'or',
        filters: [
          { key: 'newname', opt: 'LIKE', type: 'S', value: this.keyWords },
          { key: 'createby', opt: 'LIKE', type: 'S', value: this.keyWords },
          { key: 'titlename', opt: 'LIKE', type: 'S', value: this.keyWords }
        ]
      }).then(res => {
        this.studyList = res.list
        this.pages.total = res.total
      })
    },
    saveBooks (type, res) {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.fileList.length !== 1) {
            this.$message({
              type: 'warning',
              message: this.pleaseUploadtheMainDocument
            })
            return
          }
          if ((type = 'success')) {
            const obj = {
              titlename: this.editFormObj.titlename,
              actrueurl: this.fileListData.actrueUrl,
              currentdate: this.fileListData.currentDate,
              docsize: this.fileListData.size,
              downloadurl: this.fileListData.downloadUrl,
              id: this.fileListData.id,
              localpath: this.fileListData.localPath,
              newname: this.fileListData.newName,
              oldname: this.fileListData.oldName,
              revid: this.fileListData.revId,
              type: this.fileListData.type,
              uploaduser: this.fileListData.uploadUser,
              viewurl: this.fileListData.viewUrl
            }
            fileUploadStep2(obj).then(res => {
              this.$message({
                type: 'success',
                message: this.saveSuccessfully
              })
              this.getList()
              this.dialogVisible = false
              this.editFormObj.titlename = ''
              this.fileList = []
            })
          } else {
            this.$message({
              type: 'warning',
              message: this.failToSave
            })
          }
        } else {
          if (!this.editFormObj.titlename) {
            this.$message({
              type: 'warning',
              message: `${this.$t("bpa_title")} ${this.$t("hintText.cannotBeEmpty")}`
            })
            return
          }
          // this.$message({
          //   type: 'warning',
          //   message: this.requiredFieldsCannotBeEmpty
          // })
        }
      })
    },
    handleUpload (type, res) {
      if (this.fileList.length === 1) {
        this.$message({
          type: 'warning',
          message: this.pleaseDeleteItAndUploadItAgain
        })
      } else {
        this.fileList.push({
          filename: res.data.newName,
          filesize: res.data.size + 'B',
          downloadUrl: this.host + '/tmportal/attach/download/' + res.data.id,
          status: this.$t("uploaded"),
          fileId: res.data.id
        })
      }
      this.fileListData = res.data
    },
    handleSelectionChange (list) {
      this.selectionList = list
      console.log(this.selectionList)
    },
    mutipleDleteFiles () {
      if (this.selectionList.length === 0) {
        this.$message({
          type: 'warning',
          message: this.pleaseSelectDeleteItem
        })
        return
      }
      this.$confirm(this.areYouSureYouWantToDeleteInBatches, this.hint, {
        confirmBtnText: this.confirm,
        cancelBtnText: this.cancel
      }).then(res => {
        const idlist = this.selectionList.map(item => {
          return item.id
        })
        deleteStudyItem(idlist.toString()).then(res => {
          this.$message({
            type: 'success',
            message: this.successfullyDelete
          })
          this.pages.pageNum = 1
          this.getList()
        })
      })
    },
    deleteRow (id) {
      this.$confirm(this.areYouSureDelete, this.hint, {
        confirmBtnText: this.confirm,
        cancelBtnText: this.cancel,
        type: 'warning'
      })
        .then(res => {
          deleteStudyItem(id).then(res => {
            this.$message({
              type: 'success',
              message: this.successfullyDelete
            })
            this.pages.pageNum = 1
            this.getList()
          })
        })
        .catch(err => { })
    },
    // 文本框字数限制
    descInput () {
      var txtVal1 = this.editFormObj.titlename.length
      this.remnant1 = txtVal1
      if (txtVal1 > this.textMaxLength) {
        this.editFormObj.titlename.length = String(
          this.editFormObj.titlename.length
        ).slice(0, this.textMaxLength)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#processStudyManage{
  box-sizing: border-box;
  height: 100%;
  padding: 10px 30px 10px 10px;
  overflow-x: hidden;
}
.main_tab {
  margin-top: 10px;
}
</style>
