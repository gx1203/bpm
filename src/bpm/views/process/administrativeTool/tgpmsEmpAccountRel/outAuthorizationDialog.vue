<template>
  <el-dialog title="添加" :visible.sync="dialogVisible" append-to-body>
    <el-form :model="item" :rules="rules" ref="item" label-width="120px" class="content">
      <el-form-item label="单点账号" prop="displayname">
        <el-input clearable v-model="item.displayname" readonly>
          <el-button slot="append" @click="chooseUser(item.empuid)">选择</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="TGPMS账号" prop="username">
        <el-input clearable v-model="item.username"></el-input>
      </el-form-item>
      <el-form-item label="系统" prop="system">
        <el-select clearable v-model="item.system" :placeholder="$t('placeholderText.pleaseSelect')" style="width:100%;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.text"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <choose-user-dialog
        :radioChecked="radioChecked"
        v-model="usersVisible"
        @confirm="handleUser"
      /> -->
      <select-people :radioChecked="radioChecked" v-model="usersVisible" @confirm="handleUser" />
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { saveProcessToRole } from '@/bpm/api/process/administrativeTool/tgpms.js'
import { getDictionaryOption } from '@/bpm/api/process/processModeling/classificationModel.js'
import SelectPeople from '@/bpm/views/flow_form/SelectPeople';

export default {
  name: 'EditOutAuthDialog',
  components: {
    SelectPeople
    // ChooseUserDialog
  },
  data () {
    return {
      dialogVisible: this.value,
      radioChecked: '',
      usersVisible: false,
      processVisible: false,
      rules: {
        displayname: [{ required: true, message: '请选择单点账号', trigger: 'blur' }],
        username: [{ required: true, message: '请输入TGPMS账号', trigger: 'blur' }],
        system: [{ required: true, message: '请选择系统', trigger: 'blur' }]
      },
      options: []
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
  mounted () {
    getDictionaryOption({
      dictionaryen: 'systemCode'
    }).then(rt => {
      this.options = rt.data
    })
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
      this.item.empuid = data.map(item=>item.empuid).join()
      this.item.displayname =data.map(item=>item.displayname).join()
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
