<template>
  <el-dialog :title="selectAttachment" class="person_list" :visible.sync="dialogVisible" width="70%"
    :close-on-click-modal=false :close-on-press-escape=false :modal-append-to-body=false append-to-body>
    <el-card shadow="never">
      <el-row class="search_wrap">
        <el-col :span="8">
          <el-input clearable :placeholder="pleaseEnterFileName" v-model="keyWords" class="search_component" @keyup.enter.native="singleSearch">
            <el-button slot="append" size="mini" @click="singleSearch"
              type="success">
               {{$t('search')}}</el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="personList" class="main_tab" stripe border @selection-change="handleSelectionChange"
        ref="personTable" style="margin-top:10px;">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" :label="number"></el-table-column>
        <el-table-column prop="name" :label="fileName" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <a :href="viewFile(scope.row.docid)" target="_blank">{{scope.row.name}}</a>
            <a class="margin-l5" :href="downloadFile(scope.row.docid)" target="_blank">
              
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="createon" :label="uploadTime" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="pages.page" background
        layout="prev, pager, next, jumper, total" :total="pages.total">
      </el-pagination>
      <div>
        <h6>{{$t("publishedDocument")}}</h6>
        <div style="margin-top: 10px;">
          <span v-for="(item, index) in selectedList" :key="index" class="listItem">
            <span class="name">{{item.name}}</span>
            <i @click="deleteSelectedItem(item.id)" class="el-icon-close"></i>
          </span>
        </div>
      </div>
    </el-card>
    <el-card shadow="never" style="padding:0">
      <el-row>
        <el-col :span="3">
          <el-upload ref="upload" :action="action" :show-file-list="false" :on-change="handleChange"
            :file-list="fileList" :on-success="successUpload" :auto-upload="false">
            <el-button slot="trigger" size="mini" type="primary">{{$t("selectTheFile")}}</el-button>
          </el-upload>
        </el-col>
      </el-row>
      <div>
        <h6>{{$t("uploadTheSelectedFile")}}</h6>
        <div style="margin-top: 10px;">
          <span v-for="(item, index) in fileList" :key="index" class="listItem">
            <span class="name">{{item.name}}</span>
            <i @click="deleteReadyUpload(item.uid)" class="el-icon-close"></i>
          </span>
        </div>
      </div>
    </el-card>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{$t("cancel")}}</el-button>
      <el-button type="primary" @click="handlerConfirmDialog">{{$t("confirm")}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getUserList } from '@/bpa/api/settings/userManage'
import { querytRoleUser } from '@/bpa/api/settings/systemRoleManage'
import { getfilelist, uploadFile } from '@/bpa/api/common'
import { userId, viewFile, downloadFile } from '@/bpa/utils/common'

export default {
  name: 'SelectFile',
  data () {
    return {
      dialogVisible: false,
      keyWords: '',
      personList: [],
      selectedList: [],
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      fileList: [],
      pleaseEnterFileName:this.$t("pleaseEnterFileName"),
      selectAttachment: this.$t("selectAttachment"),
      number: this.$t("number"),
      fileName: this.$t("fileName"),
      uploadTime: this.$t("uploadTime"),
    }
  },
  computed: {
    host () {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    action () {
      return `${this.host}/attach/upload?username=${userId}`
    },
    download () {
      return this.host + '/attach/download/'
    },
    viewfile () {
      return this.host + '/document/print/'
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    pageId: {
      type: String,
      default: ''
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
      this.keyWords = ''
      this.selectedList = []
      this.pages = {
        pageSize: 10,
        pageNum: 1,
        total: 0
      }
      if (val) {
        this.getTabList()
      }
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  mouted () {
    console.log(this.host)
    console.log(this.download)
    console.log(this.viewfile)
  },
  methods: {
    // 下载文件
    downloadFile (fileId) {
      return downloadFile(fileId)
    },
    // 预览文件
    viewFile (fileId) {
      return viewFile(fileId)
    },
    singleSearch () {
      this.pages.pageNum = 1
      this.getTabList()
    },
    getTabList () {
      getfilelist({
        'attr': {},
        'filters': [
          { 'key': 'name', 'opt': 'LIKE', 'type': 'S', 'value': this.keyWords },
          { 'key': 'state', 'opt': 'LIKE', 'type': 'S', 'value': '0' }
        ],
        'pageNum': this.pages.pageNum,
        'pageSize': this.pages.pageSize,
        'orderby': 'createon',
        'sort': 'desc'
      }).then(res => {
        this.pages.total = res.total
        this.personList = res.list
        this.autoSelected(this.personList, this.selectedList)
      })
    },
    deleteSelectedItem (id) {
      for (let i = 0; i < this.selectedList.length; i++) {
        if (this.selectedList[i].id === id) {
          this.selectedList.splice(i, 1)
          break
        }
      }
      for (let i = 0; i < this.personList.length; i++) {
        if (this.personList[i].id === id) {
          this.$refs.personTable.toggleRowSelection(this.personList[i])
          break
        }
      }
    },
    handleCurrentChange (item) {
      this.pages.pageNum = item
      this.getTabList()
    },
    autoSelected (personList, selectedList) {
      let result = []
      for (let i = 0; i < personList.length; i++) {
        for (let j = 0; j < selectedList.length; j++) {
          if (personList[i].id === selectedList[j].id) {
            result.push(i)
          }
        }
      }
      this.$nextTick(function () {
        result.map(item => {
          this.$refs.personTable.toggleRowSelection(personList[item], true)
        })
      })
    },
    handleSelectionChange (list) {
      // 先把this.selectedList里面属于本页的数据给删除掉  然后再把选中的column push进this.selectedList里
      for (let i = 0; i < this.personList.length; i++) {
        for (let j = 0; j < this.selectedList.length; j++) {
          if (this.personList[i].id === this.selectedList[j].id) {
            this.selectedList.splice(j, 1)
            break
          }
        }
      }
      this.selectedList.push(...list)
      this.selectedList.sort((a, b) => {
        return a.createon < b.createon ? 1 : (a.createon === b.createon ? 0 : -1)
      })
    },
    handlerConfirmDialog () {
      console.log(this.fileList)
      if (this.fileList.length > 0) {
        this.$refs.upload.submit()
        return false
      } else {
        this.$emit('confirm', {
          selectedList: this.selectedList,
          uploadfiles: []
        })
        this.dialogVisible = false
      }
    },
    handleChange (file, fileList) {
      this.fileList = fileList
      console.log(this.fileList)
    },
    deleteReadyUpload (uid) {
      for (let i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].uid === uid) {
          this.fileList.splice(i, 1)
        }
      }
    },
    // 上传文件
    async successUpload (response, file, fileList) {
      let last = fileList[fileList.length - 1]
      let res = await uploadFile({
        docId: response.id,
        docTitle: response.newName,
        downloadUrl: this.host + '/attach/download/' + response.id,
        folderDocumentList: [{ documentid: response.id, folderid: this.pageId }],
        provideruser: userId,
        revId: !response.revId ? response.id : response.revId,
        viewUrl: this.host + '/document/print/' + response.id
      })
      if (last.response) {
        let arr = fileList.map((item) => { return item.response })
        this.$emit('confirm', {
          selectedList: this.selectedList,
          uploadfiles: arr
        })
        this.fileList = []
        this.dialogVisible = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.listItem {
  background: #2d42af;
  color: #fff;
  padding: 6px;
  margin: 0 10px 10px 0;
  display: inline-block;
  text-align: center;
  i {
    cursor: pointer;
  }
}
.person_list {
  /deep/ .el-table--border th,
  /deep/ .el-table--border td {
    border-right: 0;
  }
  /deep/ th {
    background: #e1eafd;
  }
  /deep/ .el-input-group__append {
    background-color: #2d42af;
    border-color: #2d42af;
    color: #fff;
  }
  /deep/ .el-input__inner {
    border-color: #2d42af;
  }
}
  /deep/.el-card__body{
  padding:  0 20px;
}
.selected_list {
  margin-top: 4px;
  &::after {
    content: "";
    display: block;
    clear: both;
  }
  .selected_item {
    float: left;
    padding: 4px 6px;
    background: #67c23a;
    border-radius: 3px;
    margin-right: 5px;
    margin-bottom: 5px;
    .name {
      color: #fff;
      font-size: 12px;
      display: inline-block;
      vertical-align: middle;
    }
    i {
      font-size: 12px;
      color: #fff;
      cursor: pointer;
      display: inline-block;
      vertical-align: middle;
    }
    &:after {
      content: "";
      display: inline-block;
      height: 100%;
      vertical-align: middle;
    }
  }
}
</style>
