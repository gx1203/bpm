<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" append-to-body>
    <el-form :model="item" ref="item" :rules="rules" label-width="auto" class="content">
      <el-form-item label="业务组名称:" prop="name">
        <el-input clearable v-model="item.name" />
      </el-form-item>
      <el-form-item label="业务组描述:" prop="description">
        <el-input clearable v-model="item.description" />
      </el-form-item>
      <el-form-item label="对应业务类型:" prop="typeid">
        <el-select clearable v-model="item.typeid" class="w100">
          <el-option
            v-for="item in selectTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { saveBusinessGroup } from '@/bpm/api/process/business/business_group_manage'
import { getBusinessGroupTypeList } from '@/bpm/api/process/business/business_group_type'
export default {
  data () {
    return {
      dialogVisible: this.value,
      selectTypeList: [],
      rules: {
        name: [
          { required: true, message: '请输入业务组名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入业务组描述', trigger: 'blur' }
        ],
        typeid: [
          { required: true, message: '请选择对应业务类型', trigger: 'blur' }
        ]
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
    },
    title: {
      type: String,
      default: ''
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
      if (val) {
        this.getData()
      }
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    getData () {
      getBusinessGroupTypeList()
        .then(rt => {
          if (rt.status === '200') {
            this.selectTypeList = rt.data.list
          }
        })
        .catch(() => {})
    },
    submit (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          saveBusinessGroup(this.item)
            .then(rt => {
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
            })
            .catch(() => {
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
  },
  mounted () {
  }
}
</script>

<style scoped>
.content {
  height: 50vh;
  width: 60%;
  margin: 0 auto;
  overflow: auto;
}
.w100 {
  width: 100%;
}
</style>
