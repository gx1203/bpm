<template>
  <el-dialog :title="$t('executeTest')" :visible.sync="dialogVisible" width="600px" top="10vh" :close-on-click-modal="false" :close-on-press-escape="false" append-to-body>
    <el-form v-loading="loading" ref="item" :model="item"  label-width="80px" class="content">
      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('organization3')">
            <el-input v-model="item.orgnames" type="textarea" style="width:calc( 100% - 50px)" readonly @focus="handleOrg()" />
            <el-button @click.prevent="removeOrg">
              {{ $t('empty') }}
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="测试名称">
            <el-input v-model="testname" type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('startTesting') }}</el-button>
    </span>
    <organization-dialog
      v-model="isOrganization"
      :check-data="orgObj"
      :is-strictly="true"
      :is-more="true"
      :title="$t('chooseAnOrganization')"
      @confirm="getOrganization"
    />
  </el-dialog>
</template>

<script>
import organizationDialog from '@/bpm/views/flow_form/SelectOrganization'
import { addAuto } from '@/bpm/api/process/automatedTest'
export default {
  name: 'executeTestDialog',
  components: {
    organizationDialog
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    testProcessId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      testname:'',
      dialogVisible: this.value,
      isOrganization: false,
      orgObj: [],
      loading: false,
      errList: [{
        value: '-1',
        label: this.$t('abnormalResult')
      }, {
        value: '1',
        label: this.$t('allResults')
      }],
      item: {
        orgnames: '',
        orgids: ''
      }
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
      if (!val) {
        this.item.orgnames = ''
        this.item.orgids = ''
        this.testname = ''
      }
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  mounted() {
  },
  methods: {
    removeOrg() {
      this.item.orgnames = ''
      this.item.orgids = ''
    },
    handleOrg() {
      this.orgObj = []
      let list = []
      if (this.item.orgnames) {
        list = this.item.orgnames.split(',')
        this.item.orgids.split(',').forEach((item, i) => {
          this.orgObj.push({
            id: item,
            name: list[i]
          })
        })
      }
      this.isOrganization = true
    },
    getOrganization(data) {
      console.log(data)
      this.item.orgnames = data.map(item => item.name).join(',')
      this.item.orgids = data.map(item => item.id).join(',')
      this.isOrganization = false
    },
    submit(formName) {
      const that = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          var obj = {
            testname: this.testname,
            testorgid: this.item.orgids,
            testorgname: this.item.orgnames,
            testprocessid: this.testProcessId
          }
          addAuto(obj).then(res => {
            if (res.status === '200') {
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.cancel()
              this.removeOrg()
              this.$emit('confirm')
            } else {
               this.$message({
                type: 'warning',
                message: '添加失败'
              })
            }
          })
        }
      })
    },
    cancel() {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
</style>
