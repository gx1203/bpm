<template>
  <div class="w100">
    <el-row class="text-right margin-b15" v-if="isEdit">
      <el-button type="primary" @click="dialogFormVisible = true; form = { }">
        {{ existTabField('add', '', true) }}
      </el-button>
    </el-row>
    <el-table :data="risklist" class="main_tab" stripe>
      <el-table-column
        v-if="existTabField('number', 'refer')"
        :label="existTabField('number', '', true)"
        type="index"
        width="50"
      />
      <el-table-column
        v-if="existTabField('riskIdentifier', 'refer')"
        prop="code"
        width="80"
        :label="existTabField('riskIdentifier', '', true)"
      />
      <el-table-column
        v-if="existTabField('riskName', 'refer')"
        prop="risk"
        width="160"
        :label="existTabField('riskName', '', true)"
      />
      <el-table-column
        v-if="existTabField('controlelement', 'refer')"
        prop="descr"
        :label="existTabField('controlelement', '', true)"
      />
      <el-table-column
        v-if="existTabField('controlNum', 'refer')"
        prop="controlno"
        width="80"
        :label="existTabField('controlNum', '', true)"
      />
      <el-table-column
        v-if="existTabField('controlName', 'refer')"
        prop="controlname"
        width="160"
        :label="existTabField('controlName', '', true)"
      />
      <el-table-column
        v-if="existTabField('controlDemand', 'refer')"
        prop="controlreq"
        width="160"
        :label="existTabField('controlDemand', '', true)"
      />
      <el-table-column
        v-if="existTabField('ownerdept', 'refer')"
        prop="department"
        width="160"
        :label="existTabField('ownerdept', '', true)"
      />
      <el-table-column
        v-if="existTabField('formationAccording', 'refer')"
        prop="basis"
        width="160"
        :label="existTabField('formationAccording', '', true)"
      />
      <el-table-column
        v-if="existTabField('testIvdence', 'refer')"
        prop="evidence"
        width="160"
        :label="existTabField('testIvdence', '', true)"
      />
      <el-table-column width="160" :label="$t('operation')" v-if="isEdit">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="existTabField('modify', '', true)"
            placement="top"
          >
            <el-button class="no-border" icon="el-icon-edit" circle @click="getDetails(scope.row)" />
          </el-tooltip>
          <el-tooltip effect="dark" :content="existTabField('delete', '', true)" placement="top">
            <el-button class="no-border" icon="el-icon-delete" circle @click="deleteRow(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="keypages.pageNum"
      background
      layout="prev, pager, next, jumper, total"
      :total="keypages.total"
      @current-change="handleKeyChange"
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
        <!--风险编号-->
        <el-form-item
          v-if="existTabField('riskIdentifier', 'refer')"
          :label="existTabField('riskIdentifier')"
          prop="code"
          :rules="[
            { required: existTabField('riskIdentifier', 'necessary'), message: ' ', trigger: 'blur' }
          ]"
        >
          <el-input v-model="form.code" />
        </el-form-item>
        <!--风险名称-->
        <el-form-item
          v-if="existTabField('riskName', 'refer')"
          :label="existTabField('riskName')"
          prop="risk"
          :rules="[
            { required: existTabField('riskName', 'necessary'), message: ' ', trigger: 'blur' }
          ]"
        >
          <el-input v-model="form.risk" />
        </el-form-item>
        <!--风险描述-->
        <el-form-item
          v-if="existTabField('controlelement', 'refer')"
          :label="existTabField('controlelement', '', true)"
          prop="descr"
          :rules="[
            { required: existTabField('controlelement', 'necessary'), message: ' ', trigger: 'blur' }
          ]"
        >
          <el-input v-model="form.descr" type="textarea" rows="4" resize="none" />
        </el-form-item>
        <!--控制编号-->
        <el-form-item
          v-if="existTabField('controlNum', 'refer')"
          :label="existTabField('controlNum', '', true)"
          prop="controlno"
          :rules="[
            { required: existTabField('controlNum', 'necessary'), message: ' ', trigger: 'blur' }
          ]"
        >
          <el-input v-model="form.controlno" />
        </el-form-item>
        <!--控制名称-->
        <el-form-item
          v-if="existTabField('controlName', 'refer')"
          :label="existTabField('controlName', '', true)"
          prop="controlname"
          :rules="[
            { required: existTabField('controlName', 'necessary'), message: ' ', trigger: 'blur' }
          ]"
        >
          <el-input v-model="form.controlname" />
        </el-form-item>
        <!--控制要求-->
        <el-form-item
          v-if="existTabField('controlDemand', 'refer')"
          :label="existTabField('controlDemand', '', true)"
          prop="controlreq"
          :rules="[
            { required: existTabField('controlDemand', 'necessary'), message: ' ', trigger: 'blur' }
          ]"
        >
          <el-input v-model="form.controlreq" />
        </el-form-item>
        <!--责任部门-->
        <el-form-item
          v-if="existTabField('ownerdept', 'refer')"
          :label="existTabField('ownerdept', '', true)"
          prop="department"
          :rules="[
            { required: existTabField('ownerdept', 'necessary'), message: ' ', trigger: 'blur' }
          ]"
        >
          <el-input v-model="form.department" />
        </el-form-item>
        <!--编制依据-->
        <el-form-item
          v-if="existTabField('formationAccording', 'refer')"
          :label="existTabField('formationAccording', '', true)"
          prop="basis"
          :rules="[
            { required: existTabField('formationAccording', 'necessary'), message: ' ', trigger: 'blur' }
          ]"
        >
          <el-input v-model="form.basis" />
        </el-form-item>
        <!--实施证据-->
        <el-form-item
          v-if="existTabField('testIvdence', 'refer')"
          :label="existTabField('testIvdence', '', true)"
          prop="evidence"
          :rules="[
            { required: existTabField('testIvdence', 'necessary'), message: ' ', trigger: 'blur' }
          ]"
        >
          <el-input v-model="form.evidence" />
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
import { getRuleRisk, dmCorekeySave, dmDelete } from '@/bpa/api/processDesignCenter'

import fileOperation from '@/bpa/mixins/fileDownView'
export default {
  name: 'RiskNecessary',
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
        code: [{ required: true, message: ' ', trigger: 'blur' }],
        risk: [{ required: true, message: ' ', trigger: 'blur' }],
        descr: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      risklist: [],
      keypages: {
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
    modeltype(val) {
      if (val === '3') {
        console.log(val)
        console.log(this.modelid)
        this.getRisklist(1)
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
        return obj.pname && lang === 'cn' ? obj.name + (!bool ? ':' : '') : obj.pname && lang === 'en' ? obj.enname + (!bool ? ':' : '') : ''
      }
    },
    // 获取关键风险控制点
    getRisklist(pageNum) {
      getRuleRisk({
        filters: [{ key: 'dmid', value: this.modelid }],
        orderby: 'code',
        pageNum: !pageNum ? 1 : pageNum,
        pageSize: 10,
        sort: 'asc'
      }).then(res => {
        console.log(res)
        this.risklist = res.list
        this.keypages.total = res.total
      })
    },
    handleKeyChange(val) {
      this.keypages.pageNum = val
      this.getRisklist(val)
    },
    getDetails(row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogFormVisible = true
    },
    deleteRow(row) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      }).then(() => {
        dmDelete(row.id).then(res => {
          this.$message({
            type: 'success',
            message: this.$t('hintText.successfullyDelete')
          })
          this.keypages.pageNum = 1
          this.getRisklist(1)
        })
      }).catch(() => { })
    },
    confirmForm() {
      this.$refs.resetRef.validate(valid => {
        console.log(valid)
        if (valid) {
          dmCorekeySave({
            ...this.form,
            dmid: this.modelid
          }).then(res => {
            this.$message({
              type: 'success',
              message: this.existTabField('addedSuccess', '', true)
            })
            this.dialogFormVisible = false
            this.keypages.pageNum = 1
            this.getRisklist(1)
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
/deep/.el-button:hover, .el-button:focus,.el-button:active{
      background-color: #2d42af !important;
      color: #fff !important;
  }
</style>
