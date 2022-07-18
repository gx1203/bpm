<template>
  <div class="w100">
    <el-row class="text-right" v-if="isEdit">
      <el-button type="primary" @click="dialogFormVisible = true; form = { }">
        {{ existTabField('add', '', true) }}
      </el-button>
      <el-button type="primary" :disabled="!selectData.length" @click="batchDel">
        {{ existTabField('batchDelete', '', true) }}
      </el-button>
    </el-row>
    <el-table :data="lists" border stripe class="main_tab margin-t15" @selection-change="handleSelectionChange">
      <el-table-column  v-if="isEdit" type="selection" width="55" :selectable="selectable" />
      <el-table-column v-if="existTabField('number', 'refer')" :label="existTabField('number', '', true)" type="index" />
      <el-table-column :data="booksList" v-if="existTabField('revisedVersion', 'refer')" prop="version" :label="existTabField('revisedVersion', '', true)" width="80" />
      <el-table-column v-if="existTabField('reviser', 'refer')" prop="createbyname" :label="existTabField('reviser', '', true)" />
      <el-table-column v-if="existTabField('theRevision0fTime', 'refer')" prop="createon" :label="existTabField('theRevision0fTime', '', true)">
        <template slot-scope="scope">
          {{ getFormateDate(new Date(scope.row.createon), 'yyyy-MM-dd') }}
        </template>
      </el-table-column>
      <el-table-column v-if="existTabField('reviseContents', 'refer')" prop="content" :label="existTabField('reviseContents', '', true)" />
    </el-table>
    <el-pagination
      :current-page.sync="pages.pageNum"
      :page-sizes="[10, 15, 20]"
      :page-size="pages.pageSize"
      background
      layout="prev, pager, next, jumper"
      :total="pages.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 修订内容 -->
    <el-dialog
      :title="existTabField('add', '', true)"
      :visible.sync="dialogFormVisible"
      width="50%"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="resetRef" :model="form" label-width="100px">
        <!-- 修订版本 -->
        <el-form-item
          :data="booksList"
          v-if="existTabField('revisedVersion', 'refer')"
          :label="existTabField('revisedVersion')"

        >
          <el-input v-model="versionAddOne" disabled />
        </el-form-item>
        <!-- 修订人 -->
        <el-form-item
          v-if="existTabField('reviser', 'refer')"
          :label="existTabField('reviser')"
          prop="username"
          :rules="[
            { required: existTabField('reviser', 'necessary'), message: ' ', trigger: 'blur' }
          ]"
        >
          <el-input v-model="username" disabled />
        </el-form-item>
        <!-- 修订内容 -->
        <el-form-item
          v-if="existTabField('reviseContents', 'refer')"
          :label="existTabField('reviseContents')"
          prop="desc"
          :rules="[
            { required: existTabField('reviseContents', 'necessary'), message: ' ', trigger: 'blur' }
          ]"
        >
          <el-input v-model="form.desc" type="textarea" rows="4" resize="none" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ existTabField('cancel', '', true) }}
        </el-button>
        <el-button type="primary" @click="confirmForm">
          {{ existTabField('confirm', '', true) }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getmodifyContent,
  saveModifyContent,
  delContent
} from '@/bpa/api/processDesignCenter'
import paginations from '@/bpa/mixins/pagination_mixin'

import { getFormateDate } from '@/bpa/utils/common'
import { getBooksList } from '@/bpa/api/rulesCenter/handbookFiles'
import { getDeptRegularList } from '@/bpa/api/processModelCenter/rulesAndRegulations/responsibilities'

export default {
  name: 'ModifyRecord',
  revisedContentPages:'',
  mixins: [paginations],
  props: {
    showtabfiled: {
      type: Array,
      default: () => []
    },
    modelid: {
      type: String,
      default: ''
    },
    version: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      booksList:[],
      dialogFormVisible: false,
      form: {},
      selectData: [],
      rules: {
        desc: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      username: JSON.parse(
        localStorage.getItem('portalCurrentUserInfo') || '{}'
      ).cnname,
      lists: [],
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      versionNumber: null
    }
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    action() {
      return `${this.host}/mangercenterdoc/uploadCopy?username=${this.userid}`
    },
    getFormateDate() {
      return getFormateDate
    },
    versionAddOne() {
      let s1 = this.version.slice(0 ,1)
      let s2 = this.version.slice(1 ,this.version.length)
      this.versionNumber = Number(s2) + 1
      return (s1 || 'V') + this.versionNumber
    }
  },
  mounted() {
    this.getMainList()
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
      const lang = localStorage.getItem('language')
      if (type === 'refer') {
        return !!obj.pname
      } else if (type === 'necessary') {
        return obj.necessary === '1'
      } else {
        return obj.pname && lang === 'cn' ? obj.name + (!bool ? ':' : '') : obj.pname && lang === 'en' ? obj.enname + (!bool ? ':' : '') : obj.enname + (!bool ? ":" : "")
      }
    },
    selectable(row) {
      let num = Number(row.version.slice(1 ,row.version.length))
      if (num === this.versionNumber) {
        return 1
      } else {
        return 0
      }
    },
    getList() {
      getmodifyContent(this.modelid).then(res => {
        console.log(res)
        this.lists = res
      })
    },
    handleSelectionChange(data) {
      this.selectData = data
    },
    confirmForm() {
      this.$refs.resetRef.validate(valid => {
        console.log(valid)
        if (valid) {
          saveModifyContent({
            id: '',
            version: this.versionAddOne,
            content: this.form.desc,
            listid: this.modelid
          }).then(res => {
            this.$message({
              type: 'success',
              message: this.existTabField('addedSuccess', '', true)
            })
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
    batchDel() {
      this.$confirm('确认要删除选中的信息吗?', this.$t('hintText.hint'), {
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

    //调用制度管理表格
     getMainList() {
      const obj = {
        orderby: 'createon',
        // pageNum: this.pages.pageNum,
        // pageSize: this.pages.pageSize,
        sort: 'desc',
        logic: 'or',
        filters: this.filters,
        // attr: { folderid: this.modelid }
      }
      getBooksList(obj).then(res => {
        if (!res) return false
        this.booksList = res.list[0]
        // this.booksList = res.list[0].map(item => {
        //   item.effectiveion = !item.effectiveion
        //     ? ''
        //     : getFormateDate(item.effectiveion, 'yyyy-MM-dd')
        //   return item
        // })
        // this.pages.total = res.total
        console.log(this.booksList)
        this.getList()
      })
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
