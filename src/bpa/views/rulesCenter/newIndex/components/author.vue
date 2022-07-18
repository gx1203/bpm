<template>
  <div class="w100">
    <el-row class="text-right margin-b15" v-if="isEdit">
      <el-button type="primary" @click="dialogFormVisible = true; isEdit = true; form = { }">
        {{ $t('add') }}
      </el-button>
    </el-row>
    <el-table :data="lists" class="main_tab" stripe>
      <el-table-column v-if="existTabField('number', 'refer')" :label="existTabField('number', '', true)" type="index" />
      <el-table-column v-if="existTabField('itemName', 'refer')" prop="name" :label="existTabField('itemName', '', true)" />
      <el-table-column v-if="existTabField('department', 'refer')" prop="deptname" :label="existTabField('department', '', true)" />
      <el-table-column v-if="existTabField('responsibility', 'refer')" prop="duty" :label="existTabField('responsibility', '', true)" />
      <el-table-column v-if="existTabField('timeLimit', 'refer')" prop="timelimit" :label="existTabField('timeLimit', '', true)">
        <template slot-scope="scope">
          {{ !scope.row.timelimit ? '' : scope.row.timelimit + 'H' }}
        </template>
      </el-table-column>
      <el-table-column v-if="existTabField('creator', 'refer')" prop="username" :label="existTabField('creator', '', true)" />
      <el-table-column v-if="existTabField('creationTime', 'refer')" prop="createon" :label="existTabField('creationTime', '', true)" width="130" />
      <el-table-column v-if="existTabField('status', 'refer')" prop="status" :label="existTabField('status', '', true)">
        <template slot-scope="scope">
          <span>{{ scope.row.status == '2'?'已作废' : '已同步' }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="existTabField('operation', 'refer')&&isEdit" width="160" :label="existTabField('operation', '', true)">
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
      :current-page.sync="pages.pageNum"
      :page-sizes="[10, 15, 20]"
      :page-size="pages.pageSize"
      background
      layout="prev, pager, next, jumper, total"
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
      <el-form ref="form" :model="form" label-width="120px">
        <el-row>
          <el-form-item
            v-if="existTabField('creator', 'refer') && form.id"
            :label="existTabField('creator')"
            prop="username"
            :rules="[
              { required: existTabField('creator', 'necessary'), message: ' ', trigger: 'blur' }
            ]"
          >
            <el-input v-model="form.username" clearable disabled />
          </el-form-item>
          <!-- 创建时间 -->
          <el-form-item
            v-if="existTabField('creationTime', 'refer') && form.id"
            :label="existTabField('creationTime')"
            prop="createon"
            :rules="[
              { required: existTabField('creationTime', 'necessary'), message: ' ', trigger: 'blur' }
            ]"
          >
            <el-date-picker
              v-model="form.createon"
              clearable
              disabled
              value-format="yyyy-MM-dd HH:mm:ss"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <!-- 事项名称 -->
          <el-form-item
            v-if="existTabField('itemName', 'refer')"
            :label="existTabField('itemName')"
            prop="name"
            :rules="[
              { required: existTabField('itemName', 'necessary'), message: ' ', trigger: 'blur' }
            ]"
          >
            <el-input v-model="form.name" clearable :disabled="!isEdit" maxlength="100" />
          </el-form-item>
          <!-- <el-form-item label="流程框架:" prop="relevantsystems">
            <el-input clearable
              v-model="form.relevantsystems"
              @focus="systemHandle"
              :disabled="!isEdit"
            ></el-input>
          </el-form-item> -->
          <!-- 主责部门 -->
          <el-form-item
            v-if="existTabField('department', 'refer')"
            :label="existTabField('department')"
            prop="deptname"
            :rules="[
              { required: existTabField('department', 'necessary'), message: ' ', trigger: 'blur' }
            ]"
          >
            <el-input v-model="form.deptname" clearable :disabled="!isEdit" @focus="focusHandle" />
          </el-form-item>
          <!-- 职责 -->
          <el-form-item
            v-if="existTabField('responsibility', 'refer')"
            :label="existTabField('responsibility')"
            prop="duty"
            :rules="[
              { required: existTabField('responsibility', 'necessary'), message: ' ', trigger: 'blur' }
            ]"
          >
            <el-input v-model="form.duty " clearable type="textarea" :rows="4" :disabled="!isEdit" />
          </el-form-item>
          <!-- 办理时限(H) -->
          <el-form-item
            v-if="existTabField('timeLimit', 'refer')"
            :label="existTabField('timeLimit')"
            prop="timelimit"
            :rules="[
              { required: existTabField('timeLimit', 'necessary'), message: ' ', trigger: 'blur' }
            ]"
          >
            <el-input v-model="form.timelimit" clearable type="number" min="0" :disabled="!isEdit" />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ existTabField('cancel', '', true) }}
        </el-button>
        <el-button type="primary" @click="confirmForm">
          {{ existTabField('confirm', '', true) }}
        </el-button>
      </div>
      <select-group
        v-model="isSelectPersonVisible"
        :select-tree="['2']"
        :show-tree="'1,2,3,4'"
        :selected="selectedPersonList"
        @confirm="handlerSelectPersonComfirm"
      />
    </el-dialog>
  </div>
</template>
<script>
import { getDmDeptJuridiction, dmDeptJuridictionSave, dmDeptJuridiction } from '@/bpa/api/processDesignCenter'
import paginations from '@/bpa/mixins/pagination_mixin'

export default {
  name: 'Author',
  mixins: [paginations],
  props: {
    showtabfiled: {
      type: Array,
      default: () => []
    },
    treeId: {
      type: String,
      default: ''
    },
    modelid: {
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
        name: [{ required: true, message: ' ', trigger: 'blur' }],
        relevantsystems: [{ required: true, message: ' ', trigger: 'blur' }],
        deptname: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      isEdit: false,
      isSelectPersonVisible: false,
      selectedPersonList: [],
      lists: [],
      pages: {
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
    action() {
      return `${this.host}/mangercenterdoc/uploadCopy?username=${this.userid}`
    }
  },
  mounted() {
    console.log(this.treeId)
    this.getList()
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
        return obj.pname && lang === 'cn' ? obj.name + (!bool ? ':' : '') : obj.pname && lang === 'en' ? obj.enname + (!bool ? ':' : '') : ''
      }
    },
    getList() {
      getDmDeptJuridiction({
        pagenum: this.pages.pageNum,
        pagesize: this.pages.pageSize,
        'filters': [{
          'key': 'relevantsystemsid',
          'opt': 'EQ',
          'type': 'S',
          'value': this.modelid
        }]
      }).then(res => {
        console.log(res)
        if (!res) return false
        this.lists = res.list
        this.pages.total = res.total
      })
    },
    handleCurrentChange(val) {
      this.pages.pageNum = val
      this.getList()
    },
    handleSizeChange() { },
    // tableRowClassName({row, rowIndex}) {
    //   console.log(row.status)
    //   console.log(rowIndex)
    //   if (row.status === '2') {
    //     return 'warning-row'
    //   }
    // }
    getDetails(row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogFormVisible = true
      this.isEdit = true
    },
    deleteRow(row) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      }).then(() => {
        dmDeptJuridiction(row.id).then(res => {
          this.$message({
            type: 'success',
            message: this.$t('hintText.successfullyDelete')
          })
          this.pages.pageNum = 1
          this.getList()
        })
      }).catch(() => { })
    },
    focusHandle() {
      this.selectedPersonList = []
      if (this.form.deptid) {
        this.form.deptid.split(',').forEach((item, index) => {
          this.selectedPersonList.push({
            name: this.form.deptname
              ? this.form.deptname.split(',')[index]
              : '',
            id: Number(item)
          })
        })
      }
      this.isSelectPersonVisible = true
    },
    handlerSelectPersonComfirm(list) {
      this.form.deptid = list
        .map(item => {
          return item.id
        })
        .toString()
      this.form.deptname = list
        .map(item => {
          return item.name
        })
        .join(',')
      this.isSelectPersonVisible = false
    },
    confirmForm() {
      this.$refs.form.validate(valid => {
        console.log(valid)
        if (valid) {
          dmDeptJuridictionSave({
            ...this.form,
            relevantsystemsid: this.modelid
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
            message: this.$t('hintText.requiredFieldsCannotBeEmpty')
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-table .warning-row {
  background: #e4e7ed;
}
</style>
