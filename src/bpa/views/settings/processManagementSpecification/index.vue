<template>
  <div id="processManagementSpecification">
    <el-row class="tool-bar">
      <el-col :span="6">
        <el-input v-model="keyWords" :title="enterTitleFileNameHeir" :placeholder="enterTitleFileNameHeir"
          class="search_component" clearable @keyup.13.native="getList">
          <el-button slot="append" type="primary"
            @click="pages.pageNum = 1;getList()">{{$t('search')}}</el-button>
        </el-input>
      </el-col>
      <el-col :span="6" :offset="12" class="search_buttons_wrap">
        <el-button type="primary" @click="dialogVisible=true">{{$t("add")}}</el-button>
        <el-button type="primary" @click="mutipleDleteFiles" :disabled="selectionList.length === 0">{{$t("bpa_batchDelete")}}</el-button>
      </el-col>
    </el-row>
    <el-table :data="booksList" class="main_tab" stripe @selection-change="handleSelectionChange">
      <el-table-column type="selection" />
      <el-table-column :label="number" type="index" />
      <el-table-column prop="titlename" :label="title" show-overflow-tooltip />
      <el-table-column :label="fileName" show-overflow-tooltip>
        <template slot-scope="scope">
          <a :href="downloadFile(scope.row.id)" download>{{scope.row.newname}}</a>
        </template>
      </el-table-column>
      <el-table-column :label="uploadTime" show-overflow-tooltip>
        <template v-slot="slotProps">
          {{ slotProps.row.createon | formatDateTime }}
        </template>
      </el-table-column>
      <el-table-column prop="createby" :label="heir" show-overflow-tooltip />
      <el-table-column prop="address" :label="operation">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="delete2" placement="top">
            <el-button type="text" @click="deleteRow(scope.row.id)" >{{ delete2 }}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="pages.pageNum" :page-size="pages.pageSize" :total="pages.total" background
      layout="prev, pager, next, jumper, total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    <el-dialog :visible.sync="dialogVisible" :title="$t('addProcessManagementSpecification')" width="65%">
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
                <el-button type="text" @click="deleteFile">{{ delete2 }}</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="download2" placement="top">
                <a :href="downloadFile(scope.row.fileId)" download>
                  <el-button type="text" >{{ download2 }}</el-button>
                </a>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="save">{{$t("confirm")}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryProcessManagementCopy,
  saveProcessManagementCopy,
  deleteProcessManagementCopy
} from '@/bpa/api/settings/processManagementSpecification'
import { fileUploadUrl } from '@/bpa/api/componentsApi'
import paginations from '@/bpa/mixins/pagination_mixin'
import fileOperation from '@/bpa/mixins/fileDownView'
export default {
  mixins: [paginations, fileOperation],
  data () {
    return {
      editFormObj: { titlename: '' },
      modelRules: {
        titlename: [{ required: true, message: ' ', trigger: 'blur' }]
        // termdetail: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      selectionList: [],
      fileList: [],
      fileUploadUrl,
      booksList: [],
      dialogVisible: false,
      keyWords: '',
      form: {},
      filters: [],
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      textMaxLength: 50, // 文本框最大字数限制
      enterTitleFileNameHeir: this.$t("placeholderText.enterTitleFileNameHeir"),
      number: this.$t("bpa_number"),
      title: this.$t("bpa_title"),
      fileName: this.$t("fileName"),
      fileSize: this.$t("fileSize"),
      uploadStatus: this.$t("uploadStatus"),
      uploadTime: this.$t("uploadTime"),
      heir: this.$t("heir"),
      operation: this.$t("operation"),
      mainDocument: this.$t("bpa_mainDocument"),
      systemOperationManualUpload: this.$t("systemOperationManualUpload"),
      delete2: this.$t("delete"),
      download2: this.$t("download"),
      pleaseUploadtheMainDocument: this.$t("hintText.pleaseUploadtheMainDocument"),
      saveSuccessfully: this.$t("hintText.saveSuccessfully"),
      failToSave: this.$t("hintText.failToSave"),
      requiredFieldsCannotBeEmpty: this.$t("hintText.requiredFieldsCannotBeEmpty"),
      pleaseDeleteItAndUploadItAgain: this.$t("hintText.pleaseDeleteItAndUploadItAgain"),
      pleaseSelectDeleteItem: this.$t("hintText.pleaseSelectDeleteItem"),
      areYouSureYouWantToDeleteInBatches: this.$t("hintText.areYouSureYouWantToDeleteInBatches"),
      areYouSureDelete: this.$t("hintText.areYouSureDelete"),
      hint: this.$t("hintText.hint"),
      successfullyDelete: this.$t("hintText.successfullyDelete"),
      confirm: this.$t("confirm"),
      cancel: this.$t("cancel"),
    }
  },
  computed: {
    host () {
      return process.env.HOST_URL
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
      queryProcessManagementCopy({
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
        this.booksList = res.list
        this.pages.total = res.total
      })
    },
    save () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.fileList.length !== 1) {
            this.$message({
              type: 'warning',
              message: this.pleaseUploadtheMainDocument
            })
            return
          }
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
          saveProcessManagementCopy(obj).then(res => {
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
          // this.$message({
          //   type: 'warning',
          //   message: this.requiredFieldsCannotBeEmpty
          // })
          if (!this.editFormObj.titlename) {
            this.$message({
              type: 'warning',
              message: `${this.$t("bpa_title")} ${this.$t("hintText.cannotBeEmpty")}`
            })
            return
          }
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
        deleteProcessManagementCopy(idlist.toString()).then(res => {
          this.$message({
            type: 'success',
            message: this.successfullyDelete
          })
          this.pages.pageNum = 1
          this.getList()
        })
      })
    },
    deleteRow (idliststr) {
      this.$confirm(this.areYouSureDelete, this.hint, {
        confirmBtnText: this.confirm,
        cancelBtnText: this.cancel,
        type: 'warning'
      }).then(() => {
        deleteProcessManagementCopy(idliststr).then(res => {
          this.$message({
            type: 'success',
            message: this.successfullyDelete
          })
          this.pages.pageNum = 1
          this.getList()
        })
      })
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
#processManagementSpecification{
  background-color: white;
  height: 100%;
  box-sizing: border-box;
  padding: 10px 30px 10px 10px;
  overflow-x: hidden;
  .tool-bar {
    margin-bottom: 10px;
  }
}
</style>
