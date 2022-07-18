<template>
  <div class="w100">
    <el-row class="text-right margin-b15" v-if="isEdit">
      <el-button type="primary" @click="dialogFormVisible = true; form = { }">
        {{ $t('add') }}
      </el-button>
    </el-row>
    <el-table :data="successKeylist" class="main_tab" stripe>
      <el-table-column
        v-if="existTabField('number', 'refer')"
        :label="existTabField('number', '', true)"
        type="index"
        width="50"
      />
      <el-table-column
        v-if="existTabField('code', 'refer')"
        prop="code"
        width="80"
        :label="existTabField('code', '', true)"
      />
      <el-table-column
        v-if="existTabField('ksfName', 'refer')"
        prop="kcpname"
        :label="existTabField('ksfName', '', true)"
      />
      <el-table-column
        v-if="existTabField('elements', 'refer')"
        prop="controlelement"
        :label="existTabField('elements', '', true)"
      />
      <el-table-column width="160" :label="$t('operation')" v-if="isEdit">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="existTabField('modify', '', true)" placement="top">
            <el-button class="no-border" icon="el-icon-edit" circle @click="getDetails(scope.row)" />
          </el-tooltip>
          <el-tooltip effect="dark" :content="existTabField('delete', '', true)" placement="top">
            <el-button class="no-border" icon="el-icon-delete" circle @click="deleteRow(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="successpages.pageNum"
      background
      layout="prev, pager, next, jumper, total"
      :total="successpages.total"
      @current-change="handleSuccessChange"
    />
    <el-dialog
      :title="existTabField('add', '', true)"
      :visible.sync="dialogFormVisible"
      width="50%"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="resetRef" :model="form" label-width="100px">
        <!-- 名称 -->
        <el-form-item
          v-if="existTabField('ksfName', 'refer')"
          :label="existTabField('ksfName', '', true)"
          prop="kcpname"
          :rules="[
            { required: existTabField('ksfName', 'necessary'), message: ' ', trigger: 'blur' }
          ]"
        >
          <el-input v-model="form.kcpname" />
        </el-form-item>
        <!-- 编号 -->
        <el-form-item
          v-if="existTabField('code', 'refer')"
          :label="existTabField('code', '', true)"
          prop="code"
          :rules="[
            { required: existTabField('code', 'necessary'), message: ' ', trigger: 'blur' }
          ]"
        >
          <el-input v-model="form.code" />
        </el-form-item>
        <!-- 要素 -->
        <el-form-item
          v-if="existTabField('elements', 'refer')"
          :label="existTabField('elements', '', true)"
          prop="controlelement"
          :rules="[
            { required: existTabField('elements', 'necessary'), message: ' ', trigger: 'blur' }
          ]"
        >
          <el-input v-model="form.controlelement" type="textarea" rows="4" resize="none" />
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
import { getSucceRisk, dmSuccelementSave, dmSuccelement } from '@/bpa/api/processDesignCenter'

import fileOperation from '@/bpa/mixins/fileDownView'
export default {
  name: 'KeyElement',
  mixins: [fileOperation],
  props: {
    showtabfiled: {
      type: Array,
      default: () => []
    },
    modelid: {
      type: String,
      default: ''
    },
    modeltype: {
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
      dialogFormVisible: false,
      form: {},
      rules: {
        kcpname: [{ required: true, message: ' ', trigger: 'blur' }]
        // code: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      successKeylist: [],
      successpages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      }
    }
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    download() {
      return this.host + '/attach/download/'
    },
    viewfile() {
      return this.host + '/document/print/'
    },
    userid() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .empuid
    },
    username() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .cnname
    }
  },
  watch: {
    showtabfiled(val) {
      if (this.modeltype === '4') {
        console.log(val)
        this.getSuccesslist(4)
      }
    }
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
      if (type == 'refer') {
        return !!obj.pname
      } else if (type == 'necessary') {
        return obj.necessary == '1'
      } else {
        return obj.pname && lang === 'cn' ? obj.name + (!bool ? ':' : '') : obj.pname && lang === 'en' ? obj.enname + (!bool ? ':' : '') : obj.enname + (!bool ? ":" : "")
      }
    },
    getSuccesslist(pageNum) {
      getSucceRisk({
        filters: [{ key: 'listid', value: this.modelid }],
        orderby: 'code',
        pageNum: !pageNum ? 1 : pageNum,
        pageSize: 10,
        sort: 'asc'
      }).then(res => {
        console.log(res)
        this.successKeylist = res.list
        this.successpages.total = res.total
      })
    },
    handleSuccessChange(val) {
      this.successpages.pageNum = val
      this.getSuccesslist(val)
    },
    getDetails(row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogFormVisible = true
    },
    deleteRow(row) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      }).then(() => {
        dmSuccelement(row.id).then(res => {
          this.$message({
            type: 'success',
            message: this.$t('hintText.successfullyDelete')
          })
          this.successpages.pageNum = 1
          this.getSuccesslist(4)
        })
      }).catch(() => { })
    },
    confirmForm() {
      this.$refs.resetRef.validate(valid => {
        console.log(valid)
        if (valid) {
          dmSuccelementSave({
            ...this.form,
            listid: this.modelid
          }).then(res => {
            this.$message({
              type: 'success',
              message: this.existTabField('addedSuccess', '', true)
            })
            this.dialogFormVisible = false
            this.successpages.pageNum = 1
            this.getSuccesslist(4)
          })
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('hintText.requiredFieldsCannotBeEmpty')
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
