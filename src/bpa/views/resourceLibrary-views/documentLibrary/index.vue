<template>
  <div class="w100">
    <el-row :gutter="10">
      <el-col :span="4">
        <div class="left_tree_wrapper">
          <enter-tree @conClick="nodeClick"/>
        </div>
      </el-col>
      <el-col :span="20">
        <el-row>
          <el-col :span="12">
            <el-input
                v-model="keyWords"
                :placeholder="$t('TheDocumentName')"
                :title="$t('TheDocumentName')"
                class="search_component"
                clearable
                @keyup.13.native="getList"
            >
              <el-button
                  slot="append"
                  type="primary"
                  @click="pages.pageNum = 1;getList()"
              >{{ $t('search') }}
              </el-button>
            </el-input>
          </el-col>
          <el-col :span="12" class="search_buttons_wrap">
            <el-button v-if="modelid!==''&&modelid!=6" type="primary" @click="addDialog">
              {{ $t('add') }}
            </el-button>
          </el-col>
        </el-row>
        <el-table :data="modelRepositoryDocList" class="main_tab" stripe border>
          <el-table-column :label="$t('bpa_number')" type="index" width="50"/>
          <el-table-column :label="$t('TheDocumentName')" prop="docname"/>
          <el-table-column :label="$t('Descript')" prop="docdesc"/>
          <el-table-column :label="$t('TheFinalClassificationOfTheText')" prop="foldername"/>
          <el-table-column :label="$t('LevelOfClassification')" prop="oneLeverFolderName"/>
          <el-table-column :label="$t('remarks')" prop="remark"/>
          <el-table-column :label="$t('operating')">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="$t('edit')" placement="top">
                <el-button class="no-border" circle @click="getDetails(scope.row)">{{ $t('edit') }}</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
                <el-button class="no-border" circle @click="deleteRow(scope.row.id)">{{ $t('delete') }}</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>


        <el-dialog
            v-loading="loading"
            :title="showtitle"
            :visible.sync="dialogVisible"
            width="50%"
        >
          <el-form ref="form" :model="editFormObj" label-width="80px" :rules="rules">
            <el-row>
              <el-col :span=12>
                <el-form-item :label="$t('TheDocumentName')" prop="docname">
                  <el-input v-model="editFormObj.docname"/>
                </el-form-item>
              </el-col>
              <el-col :span=12>
                <el-form-item prop="bolistName">
                  <span slot="label"><span style="color:red">* &nbsp;</span>{{ $t('businessObject') }}</span>
                  <el-input disabled
                            :title="bolistName"
                            v-model="bolistName"
                  >
                    <el-button
                        id="btn"
                        slot="append"
                        @click="append"
                    >
                      选择
                    </el-button>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item :label="$t('Descript')" prop="docdesc">
              <el-input v-model="editFormObj.docdesc"/>
            </el-form-item>
            <el-form-item :label="$t('remarks')">
              <el-input style="textarea" :rows="2" v-model="editFormObj.remark"/>
            </el-form-item>
            <el-form-item>
              <span slot="label"><span style="color:red">* &nbsp;</span>{{ $t('TheDocumentInAttachment') }}</span>

              <el-upload
                  :action="action"
                  :on-success="handlerFileUploadSuccess"
                  :on-error="handlerFileUploadError"
                  :before-upload="handlerFileUploadBefore"
                  :show-file-list="false"
              >
                <el-button size="mini" type="primary">
                  {{ $t('bpa_clickUpload') }}
                </el-button>
              </el-upload>

            </el-form-item>

            <!-- <el-table class="main_tab" :data="fileList">
           <el-table-column prop="filename" :label="$t('fileName')"></el-table-column>
           <el-table-column prop="filesize" label="文件大小"></el-table-column>
           <el-table-column prop="status" label="上传状态"></el-table-column>
           <el-table-column :label="$t('operation')">
             <template slot-scope="scope">
               <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
                 <el-button @click="deleteFile" class="no-border" icon="el-icon-delete" circle></el-button>
               </el-tooltip>
               <el-tooltip class="item" effect="dark" content="下载" placement="top">
                 <a :href="downloadUrl(scope.row.fileId)" download>
                   <el-button class="no-border" icon="el-icon-download" circle></el-button>
                 </a>
               </el-tooltip>
             </template>
             </el-table-column>
             </el-table> -->
          </el-form>
          <div class="fileList" v-if="editFormObj.docid">
                        <span class="imgBtn">
                          <a class="font-link">{{ editFormObj.filename }}</a>
                          <a class="margin-l5 font-link" :href="downloadUrl(editFormObj.docid)" target="_blank">
                          <b class="el-icon-download"/>
                          </a>
                          <i class="el-icon-close cursor-pointer" @click="clearImg"/>
                        </span>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false ,resetForm()">{{ $t('cancel') }}</el-button>
            <el-button type="primary" @click="submit()">{{ $t('confirm') }}</el-button>
          </span>
        </el-dialog>
        <el-pagination
            :current-page="pages.pageNum"
            :page-size="pages.pageSize"
            background
            layout="prev, pager, next, jumper, total"
            :total="pages.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>
    <el-dialog
        :title="$t('businessObject')"
        :visible.sync="dialogVisibleOBJ"
        width="80%"
    >
      <el-row>
        <el-col :span="6">
          <el-tree
              ref="asyncTree"
              :props="props"
              :is-leaf="isLeaf"
              node-key="id"
              :load="getFilterTreeList"
              :default-expanded-keys="expandedList"
              :expand-on-click-node="false"
              lazy
          >
            <div slot-scope="{ node, data }" class="custom-tree-node">
              <p class="grow" :title="node.label" @click="nodeClickTree(node, data)">
                {{ node.label }}
              </p>
              <!-- <p v-if="node.level == 1 || node.level == 2" class="grow" :title="node.label" @click="nodeClick(node, data)">
                {{ node.label }}
              </p>
              <p v-else class="grow" :title="node.label" @click="nodeClick(node, data)">
                {{ node.data.code + node.label }}
              </p> -->
              <p class="font14 opertionBtn">
              </p>
            </div>
          </el-tree>
        </el-col>
        <el-col :span="17" :offset="1">
          <el-row>
            <el-col :span="12">
              <el-input
                  v-model="keyWordsTree"
                  :placeholder="$t('BusinessObjectName')"
                  :title="$t('BusinessObjectName')"
                  class="search_component"
                  clearable
                  @keyup.13.native="getLists"
              >
                <el-button
                    slot="append"
                    icon="iconfont_search icon-sousuo2"
                    type="primary"
                    @click="pages.pageNum = 1;getLists()"
                />
              </el-input>
            </el-col>


          </el-row>
          <el-table
              :data="repositorybopageList"
              class="main_tab"
              @selection-change="handleSelectionChange"
              stripe border
          >
            <el-table-column
                type="selection"
                width="55"
            >
            </el-table-column>
            <el-table-column :label="$t('bpa_number')" type="index" width="50"/>
            <el-table-column :label="$t('BusinessObjectName')" prop="boname"/>
            <el-table-column :label="$t('BusinessObjectDescription')" prop="bodesc"/>
            <el-table-column :label="$t('TheFinalClassificationOfTheText')" prop="foldername"/>
            <el-table-column :label="$t('LevelOfClassification')" prop="oneLeverFolderName"/>
            <el-table-column :label="$t('remarks')" prop="remark"/>
          </el-table>
        </el-col>
      </el-row>
      <el-pagination
          :current-page="pagesTree.pageNum"
          :page-size="pagesTree.pageSize"
          background
          layout="prev, pager, next, jumper, total"
          :total="pagesTree.total"
          @size-change="handleSizeChangetree"
          @current-change="handleCurrentChangetree"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="multipleSelection=[],dialogVisibleOBJ = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="doSbu">{{ $t('confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import enterTree from './components/index.vue'
import {
  modelRepositoryDocquery,
  modelRepositoryDocsave,
  modelRepositoryDocDelete,
  getBoListByDocid
} from '@/bpa/api/resourcelibraryCenter'
import {
  queryRepositoryDocFolderTreeId,
  foldertree,
  foldertreeSaveCopy,
  foldertreeDeleteCopy
} from '@/bpa/api/resourcelibraryCenter'
import {
  repositorybopage,
  repositorybosave,
  repositoryboDelete,
  repositoryboget
} from '@/bpa/api/resourcelibraryCenter'

export default {
  components: {
    enterTree
  },
  data() {
    return {
      multipleSelection: [],
      keyWordsTree: '',
      modelidTree: '',
      props: {
        label: 'foldername',
        children: 'childList',
        isLeaf: function(data, node) {
          if (data.parent) {
            return false
          } else {
            return true
          }
        }
      },
      repositorybopageList: [],
      bolistName: '',
      expandedList: ['7'],
      keyWords: '',
      dialogVisibleOBJ: false,
      addFileList: [],
      showtitle: this.$t('DocumentAdd'),
      fileList: [],
      dialogVisible: false,
      documentLibraryList: [],
      editFormObj: {
        docid: ''
      },
      loading: false,
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      pagesTree: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      modelid: '',
      type: '',
      rules: {
        docname: [{ required: true, message: ' ', trigger: 'blur' }],
        docdesc: [{ required: true, message: ' ', trigger: 'blur' }]
        // bolistName: [{ required: true, message: ' ', trigger: 'blur' }],
      },
      // 判断是否修改主文档
      referMainDoc: false,
      modelRepositoryDocList: []
    }
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    username() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
          .cnname
    },
    userid() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
          .empuid
    },
    action() {
      return `${this.host}/regulation/upload?username=${this.userid}`
    }
  },
  mounted() {
    this.modelRepositoryDocquery()
  },
  methods: {
    clearImg() {
      this.loading = true
      this.editFormObj.docid = ''
      this.editFormObj.filename = ''
      this.loading = false

    },
    handleSizeChangetree() {
    },
    handleCurrentChangetree(e) {
      this.pagesTree.pageNum = e
      this.repositorybopage()
    },
    isLeaf(data, node) {
      console.log(data)
      console.log(node)
    },
    getLists() {
      this.repositorybopage()
    },
    nodeClickTree(node, data) {
      console.log('nodedata', node, data)
      this.modelidTree = data.id
      this.repositorybopage()
    },
    repositorybopage() {
      const obj = {
        orderby: 'createon',
        pageNum: this.pagesTree.pageNum,
        pageSize: this.pagesTree.pageSize,
        sort: 'desc',
        filters: [
          { key: 'boname', opt: 'LIKE', type: 'S', value: this.keyWordsTree },
          { key: 'folderid', opt: 'EQ', type: 'S', value: this.modelidTree == 7 ? '' : this.modelidTree }
        ]
        // attr: { folderid: this.modelid }
      }
      repositorybopage(obj).then(res => {
        console.log(res)
        this.pagesTree.total = res.total
        this.repositorybopageList = res.list
      })
    },
    clickDel() {
      this.editFormObj = {
        docid: ''
      }
      this.bolistName = ''
    },
    doSbu() {
      this.editFormObj.bolist = this.multipleSelection
      this.bolistName = this.multipleSelection.map(item => item.boname).join()
      this.dialogVisibleOBJ = false
      console.log(this.bolistName)
    },
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val

    },
    // 树
    async getFilterTreeList(node, resolve) {
      console.log(node)
      // let response
      // if (!node.data) {
      //   response = await queryEnterpriseStandardFolderTreeId()
      // }
      const id = node.data ? node.data.id : '3'
      foldertree(id).then(res => {
        if (!res) return false
        if (id === '0') {
          this.$emit('conClick', {
            node: node,
            data: res[0]
          })
          this.expandedList = [res[0].id]
          console.log('this.expandedList', this.expandedList)
        }

        resolve(res)
      })
    },

    append() {
      this.dialogVisibleOBJ = true
      this.repositorybopage()
    },
    getList() {
      this.modelRepositoryDocquery()
    },
    downloadUrl(fileid) {
      return `${this.host}/regulation/download/${fileid}?username=${this.userid}`
    },
    addDialog() {
      this.showtitle = this.$t('DocumentAdd')
      this.dialogVisible = true
      this.bolistName = ''
      this.editFormObj = {
        docid: ''
      }
    },
    //   修改
    getDetails(id) {
      this.showtitle = this.$t('DocumentAlter')
      getBoListByDocid(id.id).then(res => {
        console.log(res)
        this.editFormObj = res
        if (!res.docid) {
          this.editFormObj.docid = ''
        }
        console.log(' this.editFormObj', this.editFormObj)
        this.bolistName = res.bolist.map(item => item.boname).join()
        this.dialogVisible = true
      })
    },
    //   删除
    deleteRow(id) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
          .then(() => {
            modelRepositoryDocDelete(id).then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: this.$t('hintText.successfullyDelete')
                })
                this.modelRepositoryDocquery()
              }
            })
          })
          .catch(err => {
            console.log(err)
          })
    },
    // 上传前
    handlerFileUploadBefore(res) {
      console.log(res)
      this.loading = true
    },
    // 上传失败
    handlerFileUploadError(err, file, fileList) {
      this.loading = false
      this.$message({
        type: 'warning',
        message: this.$t('hintText.attachmentUploadedfailed')
        // message: '主文档上传失败'
      })
    },
    handlerFileUploadSuccess(res) {
      console.log(res)
      this.loading = false
      if (this.editFormObj.docid) {
        this.$message({
          type: 'warning',
          message: this.$t('hintText.pleaseDeleteItAndUploadItAgain')
        })
      } else {
        this.editFormObj.docid = res.data.id
        console.log(this.editFormObj.docid)
        this.editFormObj.filename = res.data.newName
        console.log('this.editFormObj', this.editFormObj)
      }
    },
    modelRepositoryDocquery() {
      const obj = {
        orderby: 'createon',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: 'desc',
        filters: [
          { key: 'docname', opt: 'LIKE', type: 'S', value: this.keyWords },
          { key: 'folderid', opt: 'EQ', type: 'S', value: this.modelid }
        ]
        // attr: { folderid: this.modelid }
      }
      modelRepositoryDocquery(obj).then(res => {
        this.pages.total = res.total
        this.modelRepositoryDocList = res.list
        console.log('this.modelRepositoryDocList', this.modelRepositoryDocList)
      })
    },

    handleSizeChange() {
    },
    handleCurrentChange(e) {
      console.log(e)
      this.pages.pageNum = e
      this.modelRepositoryDocquery()
    },
    submit() {
      console.log('this.bolistName', this.bolistName)
      console.log('this.editFormObj', this.editFormObj)
      this.$refs['form'].validate(valid => {
        if (valid && this.bolistName && this.editFormObj.docid) {
          let obj = {
            ...this.editFormObj,
            folderid: this.editFormObj.folderid ? this.editFormObj.folderid : this.modelid
          }
          modelRepositoryDocsave(obj).then(res => {
            console.log(res)
            if (!res) return false
            this.dialogVisible = false
            this.modelRepositoryDocquery()

          })
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('hintText.requiredFieldsCannotBeEmpty')
          })
        }
      })
    },
    resetForm() {
      this.$refs['form'].resetFields()
      this.editFormObj = {}
      console.log(this.editFormObj)
    },
    nodeClick(obj) {
      console.log(obj.node, obj.data)
      const self = this
      if (obj.data) {
        self.modelid = obj.data.id == 6 ? '' : obj.data.id
        self.type = obj.data.foldername
      }
      console.log(self.modelid)
      console.log(obj.data.foldername)
      this.modelRepositoryDocquery()
    }
  }
}
</script>

<style lang="scss" scoped>
// /deep/.el-button:hover, .el-button:focus{
//       background-color: #2d42af !important;
//      color: #fff !important;
//   }
// /deep/.el-input-group__append>.el-button:hover, .el-button:focus{
//       background-color: #2d42af !important;
//   }
/deep/ .el-tree-node__content {
  font-size: 13px !important;
  align-items: stretch !important;
}

#btn {
  background-color: #2d42af !important;
  color: #fff !important;

}

.imgBtn {
  display: inline-block;
  line-height: 24px;
  height: 24px;
  padding: 0 4px;
  border: 1px solid #2d42af;
  border-radius: 4px;
  font-size: 12px;
}

.left_tree_wrapper {
  width: 100%;
  overflow: auto;
  height: calc(100vh - 208px) !important
}

</style>
