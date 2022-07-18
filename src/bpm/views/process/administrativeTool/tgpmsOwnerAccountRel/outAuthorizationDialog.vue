<template>
  <el-dialog title="查看" :visible.sync="dialogVisible" append-to-body>
    <el-form :model="item" ref="item" label-width="120px" class="content">
      <el-form-item label="DataOwner" >
        <el-input clearable v-model="item.dataowner" readonly></el-input>
      </el-form-item>
      <el-form-item label="插入时间">
        <el-date-picker
          v-model="item.insertdate"
          value-format="timestamp"
          type="datetime"
          readonly
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="修改时间">
        <el-date-picker
          v-model="item.modifydate"
          value-format="timestamp"
          type="datetime"
          readonly
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="插入人">
        <el-input clearable v-model="item.insertuser" readonly></el-input>
      </el-form-item>
      <el-form-item label="修改人">
        <el-input clearable v-model="item.modifyuser" readonly></el-input>
      </el-form-item>
      <el-form-item label="OrgDataOwner">
        <el-input clearable v-model="item.orgdataowner" readonly></el-input>
      </el-form-item>
      <el-form-item label="系统">
        <el-input clearable v-model="item.system" readonly></el-input>
      </el-form-item>
      <el-form-item label="tgpms账号">
        <el-input clearable v-model="item.username" readonly></el-input>
      </el-form-item>
      <choose-user-dialog
        :radioChecked="radioChecked"
        v-model="usersVisible"
        @confirm="handleUser"
      />
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <!-- <el-button type="primary" @click="submit('item')">确 定</el-button> -->
    </span>
  </el-dialog>
</template>

<script>
import { saveProcessToRole } from '@/bpm/api/process/administrativeTool/tgpms.js'
import ChooseUserDialog from '@/bpm/components/user/ChooseUserDialog'
export default {
  name: 'EditOutAuthDialog',
  components: {
    ChooseUserDialog
  },
  data () {
    return {
      dialogVisible: this.value,
      radioChecked: '',
      usersVisible: false,
      processVisible: false,
      rules: {
        displayname: [{ required: true, message: '请选择单点账号', trigger: 'blur' }],
        username: [{ required: true, message: '请输入TGPMS账号', trigger: 'blur' }]
      }
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    chooseUser (id) {
      this.radioChecked = id
      this.usersVisible = true
    },
    chooseProcess () {
      this.processVisible = true
    },
    handleUser (data) {
      this.item.empuid = data.empuid
      this.item.displayname = data.cnname
    },
    submit (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          saveProcessToRole(this.item).then(rt => {
            if (rt.status === '200') {
              this.$message({
                message: this.$t('hintText.saveSuccessfully'),
                type: 'success'
              })
              this.dialogVisible = false
              this.$emit('confirm', true)
            } else {
              this.$message({
                message: this.$t('hintText.failToSave'),
                type: 'error'
              })
            }
          }).catch(() => {
            this.$message({
              message: this.$t('hintText.failToSave'),
              type: 'error'
            })
          })
        }
      })
    },
    cancel () {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
  .content {
    width: 60%;
    margin: auto;
  }
</style>
