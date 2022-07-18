<template>
  <div id="passManage">
    <div class="clear-fix">
      <el-button class="float-r" type="primary" @click="add">添加</el-button>
    </div>
    <el-table :data="tableList" class="main_tab margin-t15">
      <el-table-column :label="$t('number')" type="index"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="checked" label="url地址"></el-table-column>
      <el-table-column :label="$t('operation')">
        <template slot-scope="scope">
          <el-button
            @click="showEditDialog(scope.row, 'modeify')"
            type="text"
          >修改</el-button>
          <el-button
            @click="showEditDialog(scope.row, 'del')"
            type="text"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="titleName"
      :visible.sync="dialogFormVisible"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="form" :rules="rules" ref="resetRef" label-width="100px" >
          <el-form-item label="名称 :" prop="name">
            <el-input clearable v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="url地址 :" prop="url">
            <el-input clearable v-model="form.url" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirmForm">确定</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { querylink, deleteLengend } from '@/bpa/api/settings/resetPassword'
import { saveLegend } from '@/bpa/api/settings/changeDesgin'

export default {
  data () {
    return {
      dialogFormVisible: false,
      tableList: [],
      form: {},
      rules: {
        name: [
          { required: true, message: ' ', trigger: 'blur' }
        ],
        url: [
          { required: true, message: ' ', trigger: 'blur' }
        ]
      },
      titleName:'添加系统地址'
    }
  },
  mounted () {
    this.getdata()
  },
  methods: {
    add () {
      this.form = {}
      this.titleName = '添加系统地址'
      this.dialogFormVisible = true
    },
    getdata () {
      querylink({}).then(res => {
        console.log(res)
        if (!res) return false
        let arr = []
        res.list.forEach(item => {
          if (item.id != 1 && item.id !== 'support' && item.id !== 'strategy' && item.id !== 'main') {
            arr.push(item)
          }
        })
        this.tableList = arr
      })
    },
    showEditDialog (data, type) {
      if (type == 'del') {
        this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }).then(res => {
          deleteLengend(data.id).then(res => {
            console.log(res)
            if (!res) return false
            this.$message({
              type: 'success',
              message: this.$t('hintText.successfullyDelete')
            })
            this.getdata()
          })
        }).catch(err => {
          console.log(err)
        })
        return false
      } else {
        this.titleName = '修改系统地址'
      }
      this.form = Object.assign({}, this.form, {
        name: data.name,
        url: data.checked,
        id: data.id
      })
      this.dialogFormVisible = true
    },
    confirmForm () {
      this.$refs.resetRef.validate((valid) => {
        console.log(valid)
        if (valid) {
          saveLegend({
            'id': !this.form.id ? '' : this.form.id,
            'name': this.form.name,
            'checked': this.form.url
          }).then(res => {
            console.log(res)
            if (!res) return false
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.dialogFormVisible = false
            this.getdata()
          })
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('hintText.theRequiredFieldsMustNotBeEmpty')
          })
        }
      })
    },
    resetForm () {
      this.$confirm('确认要重置已填写的信息吗?', this.$t('hintText.hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(res => {
        this.resepassword = {}
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
