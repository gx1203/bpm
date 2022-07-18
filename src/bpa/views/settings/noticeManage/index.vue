<template>
  <div id="noticeManage">
    <el-row>
      <el-col :span="6">
        <el-input
          v-model="keyWords"
          placeholder="请输入内容"
          class="search_component"
          clearable
          @keyup.13.native="getList"
        >
          <el-button slot="append" type="primary" @click="pages.pageNum = 1;getList()">搜索</el-button>
        </el-input>
      </el-col>
      <el-col :span="6" :offset="12" class="search_buttons_wrap">
        <!-- <el-upload
          :action="fileUploadUrl"
          :on-success="(res) => {handleUpload('success', res)}"
          :on-error="(err) => {handleUpload('error', err)}"
          :show-file-list="false"
        class="upload-demo">-->
        <el-button type="primary" @click="dialogVisible=true">附件上传</el-button>
        <!-- </el-upload> -->
        <el-button type="primary" @click="mutipleDleteFiles">批量删除</el-button>
      </el-col>
    </el-row>
    <el-table :data="noticeList" class="main_tab" @selection-change="handleSelectionChange">
      <el-table-column type="selection" />
      <el-table-column :label="$t('number')" type="index" />
      <el-table-column prop="titlename" label="标题" />
      <el-table-column prop="newname" :label="$t('fileName')">
        <template slot-scope="scope">
          <a :href="downloadFile(scope.row.id)" download>{{scope.row.newname}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="createon" :label="$t('uploadTime')" />
      <el-table-column prop="createby" :label="$t('heir')"  />
      <el-table-column prop="address" :label="$t('operation')">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
            <el-button
              class="no-border"
              icon="el-icon-delete"
              circle
              @click="deleteRow(scope.row.id)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="pages.pageNum"
      :page-size="pages.pageSize"
      :total="pages.total"
      background
      layout="prev, pager, next, jumper, total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog :visible.sync="dialogVisible" title="流程公告上传" width="65%">
      <el-form ref="form" :model="editFormObj" :rules="modelRules" label-width="80px">
        <el-form-item label="标题" prop="titlename">
          <el-input clearable v-model="editFormObj.titlename" maxlength="50" @input="descInput" />
        </el-form-item>
        <el-form-item label="主文档">
          <span slot="label">
            <span style="color: red">*</span>主文档
          </span>
          <el-upload
            :action="fileUploadUrl"
            :on-success="(res) => {handleUpload('success', res)}"
            :on-error="(err) => {handleUpload('error', err)}"
            :show-file-list="false"
            class="upload-demo"
          >
            <el-button size="mini" type="primary">{{$t("bpa_clickUpload")}}</el-button>
          </el-upload>
        </el-form-item>
        <el-table :data="fileList" class="main_tab">
          <el-table-column prop="filename" :label="$t('fileName')" />
          <el-table-column prop="filesize" label="文件大小" />
          <el-table-column prop="status" label="上传状态" />
          <el-table-column :label="$t('operation')">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
                <el-button class="no-border" icon="el-icon-delete" circle @click="deleteFile" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="下载" placement="top">
                <a :href="downloadFile(scope.row.fileId)" download>
                  <el-button class="no-border" icon="el-icon-download" circle />
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
  getNoticeList,
  deleteNoticeItem,
  fileUploadStep2
} from '@/bpa/api/settings/noticeManage'
import paginations from '@/bpa/mixins/pagination_mixin'
import fileOperation from '@/bpa/mixins/fileDownView'
import { fileUploadUrl } from '@/bpa/api/componentsApi'
export default {
  mixins: [paginations, fileOperation],
  data() {
    return {
      editFormObj: { titlename: '' },
      modelRules: {
        titlename: [{ required: true, message: ' ', trigger: 'blur' }]
        // termdetail: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      fileList: [],
      fileUploadUrl,
      noticeList: [],
      dialogVisible: false,
      keyWords: '',
      selectionList: [],
      form: {},
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      textMaxLength: 50 // 文本框最大字数限制
    }
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    deleteFile() {
      this.fileList = []
    },
    getList() {
      getNoticeList({
        attr: {},
        filters: [
          { key: 'newname', opt: 'LIKE', type: 'S', value: this.keyWords },
          { key: 'createby', opt: 'LIKE', type: 'S', value: this.keyWords },
          { key: 'titlename', opt: 'LIKE', type: 'S', value: this.keyWords }
        ],
        logic: 'or',
        orderby: 'createon',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: 'desc'
      }).then(res => {
        this.noticeList = res.list
        this.pages.total = res.total
      })
    },
    saveBooks(type, res) {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.fileList.length !== 1) {
            this.$message({
              type: 'warning',
              message: '请上传主文档！'
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
                message: '保存成功！'
              })
              this.getList()
              this.dialogVisible = false
              this.editFormObj.titlename = ''
              this.fileList = []
            })
          } else {
            this.$message({
              type: 'warning',
              message: '保存失败！'
            })
          }
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('hintText.theRequiredFieldsMustNotBeEmpty')
          })
        }
      })
    },
    handleUpload(type, res) {
      if (this.fileList.length === 1) {
        this.$message({
          type: 'warning',
          message: this.$t('hintText.pleaseDeleteItAndUploadItAgain')
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
    handleSelectionChange(list) {
      this.selectionList = list
    },
    mutipleDleteFiles() {
      if (this.selectionList.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择删除项！'
        })
        return
      }
      this.$confirm('您确定要批量删除吗?', this.$t('hintText.hint'), {
        confirmBtnText: '确定',
        cancelBtnText: '取消'
      }).then(res => {
        const idlist = this.selectionList.map(item => {
          return item.id
        })
        deleteNoticeItem(idlist.toString()).then(res => {
          this.$message({
            type: 'success',
            message: this.$t('hintText.successfullyDelete')
          })
          this.pages.pageNum = 1
          this.getList()
        })
      })
    },
    deleteRow(id) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        confirmBtnText: '确定',
        cancelBtnText: '取消'
      })
        .then(res => {
          deleteNoticeItem(id).then(res => {
            this.$message({
              type: 'success',
              message: this.$t('hintText.successfullyDelete')
            })
            this.pages.pageNum = 1
            this.getList()
          })
        })
        .catch(err => {})
    },
    // 文本框字数限制
    descInput() {
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
