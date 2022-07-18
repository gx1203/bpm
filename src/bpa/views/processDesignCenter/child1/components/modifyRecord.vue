<template>
  <div class="w100">
    <el-row class="text-right">
      <el-button :disabled="!noEditing" v-if="showAddButton" type="primary"  @click="companyHandle('add')">{{$t('add')}}</el-button>
      <el-button :disabled="!selectData.length || !noEditing" @click="batchDel">{{existTabField('batchDelete', '', true)}}</el-button>
    </el-row>
    <el-table :data="lists" border stripe class="main_tab margin-t15" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="60"></el-table-column>
      <el-table-column type="index" :label="existTabField('number', '', true)" width="60"></el-table-column>
      <el-table-column prop="version" :label="existTabField('revisedVersion', '', true)" min-width="120"></el-table-column>
      <el-table-column prop="createbyname" :label="existTabField('reviser', '', true)" min-width="130"></el-table-column>
      <el-table-column prop="createon" :label="existTabField('TheRevision0fTime', '', true)"  min-width="130">
        <template slot-scope="scope">{{getFormateDate(new Date(scope.row.createon), 'yyyy-MM-dd')}}</template>
      </el-table-column>
      <el-table-column prop="content" :label="existTabField('reviseContents', '', true)"></el-table-column>
      <el-table-column :label="existTabField('operation', '', true)" min-width="120">
          <template slot-scope="scope">
            <el-tooltip class="item"  :content="existTabField('edit', '', true)" placement="top">
              <el-button :disabled="!noEditing"
                type="text"
                icon="el-icon-edit"
                @click="companyHandle('edit',scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" :content="existTabField('delete', '', true)" placement="top">
              <el-button :disabled="!noEditing" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page.sync="pages.pageNum" :page-sizes="[10, 15, 20]" :page-size="pages.pageSize" background
      layout="prev, pager, next, jumper, total" :total="pages.total"></el-pagination>
    <!-- 修订内容 -->
    <el-dialog :title="linkTitle" :visible.sync="dialogFormVisible" width="50%" :append-to-body="true"
      :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="form" :rules="rules" ref="resetRef" label-width="100px">
        <el-form-item :label="existTabField('revisedVersion', '', true)">
          <el-input v-model="version" disabled></el-input>
        </el-form-item>
        <el-form-item  :label="existTabField('reviser', '', true)">
          <el-input v-model="username" disabled></el-input>
        </el-form-item>
        <el-form-item :label="existTabField('reviseContents', '', true)" prop="content">
          <el-input v-model="form.content" type="textarea" rows="4" resize="none"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{existTabField('cancelAction', '', true) }}</el-button>
        <el-button type="primary" @click="confirmForm">{{existTabField('confirm', '', true) }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getModifyVersionsIsShowAdd,
  getmodifyContent,
  saveModifyContent,
  delContent
} from '@/bpa/api/processDesignCenter'
import paginations from '@/bpa/mixins/pagination_mixin'
import {
  getRecordlist
  // getRecordlist2
} from '@/bpa/api/processDesignCenter'
import { getFormateDate } from '@/bpa/utils/common'

export default {
  name: 'modifyRecord',
  data () {
    return {
      recordlist: [],
      showAddButton:false,
      linkTitle:"",
      linkType:'',
      dialogFormVisible: false,
      form: {
        content:''
      },
      selectData: [],
      rules: {
        content: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      username: JSON.parse(
        localStorage.getItem('portalCurrentUserInfo') || '{}'
      ).cnname,
      lists: [],
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      }
    }
  },
  props: {
    modelid: {
      type: String,
      default: ''
    },
    showtabfiled: {
      type: Array,
      default: () => []
    },
    version: {
      type: String,
      default: ''
    },
    noEditing: {
      type: Boolean,
      default: false,
    }
  },
  mixins: [paginations],
  computed: {
    host () {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    action () {
      return `${this.host}/mangercenterdoc/uploadCopy?username=${this.userid}`
    },
    getFormateDate () {
      return getFormateDate
    }
  },
  watch: {
    'showtabfiled'(val) {
      this.getRecord()
    }
  },
  mounted () {
    this.getList()
    this.getVersionsIsShow()
  },
  methods: {
    // 判断条件
    existTabField(pname, type, bool) {
      let obj = {}
      this.showtabfiled.forEach(item => {
        if (item.pname === pname) {
          obj = JSON.parse(JSON.stringify(item))
          return false
        }
      })
      if (type == 'refer') {
        return !!obj.pname
      } else if (type == 'necessary') {
        return obj.necessary == '1'
      } else {
        return !obj.pname ? '' : obj.name + (!bool ? ':' : '')
      }
    },
    getRecord() {
      getRecordlist(this.modelid).then(res => {
        this.recordlist = res
      })
    },
    getList () {
      getmodifyContent(this.modelid).then(res => {
        this.lists = res
        if(this.lists.length>0){
          this.showAddButton = false
        }else{
          this.showAddButton = true
        }
      })
    },
    getVersionsIsShow(){
       getModifyVersionsIsShowAdd(this.modelid,this.version).then(res => {
        if(res){
          this.showAddButton = true
        }else{
          this.showAddButton = false
        }
      })
    },
    handleSelectionChange (data) {
      this.selectData = data
    },
    companyHandle(item, data) {
      this.linkType = item
      this.dialogFormVisible = true
      if (item === 'add') {
        this.linkTitle = this.$t('add')
        this.form.content = ""
        this.from = {}
      } else if (item === 'edit'){
        this.linkTitle = this.$t('edit')
        this.from = Object.assign({}, data);
        this.form.content = data.content
        this.from = {...this.from}
      }
    },
    confirmForm () {
      this.$refs.resetRef.validate(valid => {
        if (valid) {
          saveModifyContent({
            id: this.from.id||'',
            version: this.version,
            content: this.form.content,
            listid: this.modelid
          }).then(res => {
            if (!res) return false
              if( this.linkType === 'edit'){
                this.$message.success(this.$t("hintText.editedSuccess"));
              }else{
                this.$message.success(this.$t("hintText.addedSuccess"));
              }
              this.showAddButton = false
              this.dialogFormVisible = false
              this.pages.pageNum = 1
              this.getList()
          })
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('hintText.theRequiredFieldsMustNotBeEmpty')
          })
        }
      })
    },
    batchDel () {
      this.$confirm(
        this.$t("hintText.areYouSureDeleteSelectedData"),
        this.$t('hintText.hint'),
        {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
        .then(() => {
          delContent(this.selectData.map(item => item.id).join(',')).then(
            res => {
              if (!res) return false
              this.$message({
                type: 'success',
                message: this.$t('hintText.successfullyDelete')
              })
              this.pages.pageNum = 1
              this.getList()
            }
          )
        })
        .catch(() => {
          console.log('取消')
        })
    },
    handleDelete(item) {
      this.$confirm(
        this.$t("hintText.areYouSureDelete"),
        this.$t("hintText.hint"),
        {
          type: "warning"
        }
      )
        .then(() => {
          delContent(item.id).then(
            res => {
              if (!res) return false
              this.$message({
                type: 'success',
                message: this.$t('hintText.successfullyDelete')
              })
              this.showAddButton = true
              this.pages.pageNum = 1
              this.getList()
            }
          )
        })
        .catch(() => {});
    },
  }
}
</script>

<style lang="scss" scoped>
.el-button:focus, .el-button:hover{
  background-color: #2d42af!important;
    color: #fff!important;
}
</style>
