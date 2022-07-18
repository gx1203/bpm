<template>
  <el-dialog :title="$t('goOutAuthorization')" :visible.sync="dialogVisible" append-to-body>
    <el-form ref="item" v-loading="loading" :model="item" :rules="rules" label-width="100px" class="content">
      <el-form-item :label="$t('authorizer') + '：'" prop="grantor">
        <el-input v-model="item.grantor" clearable readonly />
      </el-form-item>
      <el-form-item :label="$t('agent') + '：'" prop="surrogate">
        <el-input v-model="item.surrogate" clearable readonly>
          <el-button slot="append" @click="chooseUser">
            {{ $t('placeholderText.select') }}
          </el-button>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('selectProcess') + '：'" required>
        <el-select
          v-model="item.processIds"
          filterable
          clearable
          multiple
          :placeholder="$t('placeholderText.pleaseEnterProcessNameSearch')"
          style="width:100%;"
        >
          <el-option
            v-for="val in processList"
            :key="val.processId"
            :label="val.processNamecn"
            :value="val.processId"
          >
            <span style="float: left">{{ val.processNamecn }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('startTime') + '：'" prop="startDate">
        <el-date-picker v-model="item.startDate" type="datetime" :picker-options="pickerOptions0" />
      </el-form-item>
      <el-form-item :label="$t('endTime') + '：'" prop="endDate">
        <el-date-picker v-model="item.endDate" type="datetime" :picker-options="pickerOptions1" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
    <bas-organieation
      v-model="organieationShow"
      :selected-element="selectedElement"
      :is-specified-group-but="false"
      :multiple="false"
      :is-show-bustom-groups-but="false"
      :isShowPost="true"
      :select-element="selectElement"
      :show-element="showElement"
      :title="orgtitle"
      @fnCallBack="fnBasOrganieationCallBack"
    />
  </el-dialog>
</template>

<script>
import Vue from 'vue'
import { saveOutAuth, getOutAuthDetail } from '@/bpm/api/staging/tool/out_auth'
import { getAllocatedProcess } from '@/bpm/api/process/processBasic/process_design'
import BasComponent from 'bas-component'
Vue.use(BasComponent)
import 'bas-component/lib/BasComponent.css'

export default {
  name: 'EditOutAuthDialog',
  components: {
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
  data() {
    return {
      organieationShow: false,
      selectedElement: {},
      showElement: [],
      selectElement: ['9'],
      orgtitle: '选择代理人',
      dialogVisible: this.value,
      processVisible: false,
      processList: [],
      loading: false,
      rules: {
        grantor: [{ required: true, message: this.$t('placeholderText.pleaseSelectAuthorizer'), trigger: 'blur' }],
        surrogate: [
          {
            required: true,
            message: this.$t('placeholderText.pleaseSelectAgent'),
            trigger: ['blur', 'change']
          }
        ],
        startDate: [
          { required: true, message: this.$t('placeholderText.pleaseSelectStartTime'), trigger: 'change' }
        ],
        endDate: [
          { required: true, message: this.$t('placeholderText.pleaseSelectEndTime'), trigger: 'change' }
        ]
      },
      pickerOptions0: {
        disabledDate: time => {
          if (this.item.endDate) {
            return (time.getTime() > new Date(this.item.endDate).getTime() - 86400000 ||
              time.getTime() < Date.now() - 86400000)
          } else {
            return time.getTime() < Date.now() - 86400000
          }
        }
      },
      pickerOptions1: {
        disabledDate: time => {
          if (this.item.startDate) {
            return time.getTime() < new Date(this.item.startDate).getTime()
          } else {
            return time.getTime() < Date.now() - 86400000
          }
        }
      }
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
      if (val) {
        this.getData()
      }
    },
    dialogVisible(val) {
      this.$emit('input', val)
    }
  },
  mounted() {
    console.log(this.item)
  },
  methods: {
    getData() {
      getAllocatedProcess()
        .then(rt => {
          this.loading = false
          if (rt.status === '200') {
            this.processList = rt.data
          }
        })
        .catch(() => {
          this.loading = false
        })
      if (!this.item.id) return
      this.loading = true
      getOutAuthDetail(this.item.id)
        .then(rt => {
          rt.data.processIds = rt.data.processList
            .map(item => item.id)
          this.item = rt.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    chooseUser() {
      this.selectedElement = {}
      if (this.item.surrogateUid) {
        const list = this.item.surrogate.split(',').join('&')
        const idType = []
        this.item.surrogateUid.split(',').forEach((item, i) => {
          idType.push(`${item}-9`)
        })
        this.selectedElement = {
          id: this.item.surrogateUid.split(','),
          name: list,
          idType: idType.join(';')
        }
      }
      this.organieationShow = true
    },
    chooseProcess() {
      this.processVisible = true
    },
    submit(formName) {
      const that = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!that.item.processIds || that.item.processIds.length === 0) {
            that.$message.error(this.$t('placeholderText.pleaseSelectProcess'))
            return
          }
          if (new Date(that.item.startDate).getTime() > new Date(that.item.endDate).getTime()) {
            that.$message.error(this.$t('hintText.startTimeShouldBeBeforeEndTime'))
            return
          }
          const _processList = []
          that.processList.forEach(item => {
            that.item.processIds.forEach(val => {
              if (val === item.processId) {
                _processList.push({
                  id: val,
                  processName: item.processNamecn
                })
              }
            })
          })
          that.item.status = ''
          that.loading = true
          saveOutAuth({
            applicationName: 'BPM',
            creatorUid: that.$store.state.basuser.user.userid,
            ...that.item,
            processList: _processList,
            isdelete: 'N'
          })
            .then(rt => {
              that.loading = false
              if (rt.status === '200') {
                that.$message({
                  message: this.$t('hintText.saveSuccessfully'),
                  type: 'success'
                })
                that.dialogVisible = false
                that.$emit('confirm', true)
              } else {
                that.$message({
                  message: this.$t('hintText.failToSave'),
                  type: 'error'
                })
              }
            })
            .catch(() => {
              that.loading = false
              that.$message({
                message: this.$t('hintText.failToSave'),
                type: 'error'
              })
            })
        }
      })
    },
    fnBasOrganieationCallBack(data) {
      this.$set(this.item, 'surrogate', data.name.split('&').join(','))
      this.$set(this.item, 'surrogateUid', data.id)
      this.organieationShow = false
    },
    cancel() {
      this.dialogVisible = false
    }
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
</style>
