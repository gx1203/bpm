<template>
  <el-dialog :title="title" :visible.sync="dialogVisible">
    <el-form ref="item" v-loading="loading" :model="item" label-width="auto" class="content">
      <el-form-item :label="$t('changeUser') + '：'" required>
        <el-input v-model="item.oldusername" clearable @click.native="checkHandle('olduser', item.olduser)" />
      </el-form-item>
      <el-form-item :label="$t('replaceUser') + '：'" required>
        <el-input v-model="item.newusername" clearable @click.native="checkHandle('newuser', item.newuser)" />
      </el-form-item>
      <el-form-item :label="$t('process') + '：'">
        <!-- <el-select clearable v-model="item.processid" filterable multiple class="w100" :placeholder="$t('placeholderText.pleaseSelect')">
          <el-option
            v-for="item in processList"
            :key="item.id"
            :label="item.processname"
            :value="item.id"
          >
            <span style="float: left">{{ item.processname }}</span>
          </el-option>
        </el-select>-->
        <table
          cellspacing="0"
          style="margin: 15px 0;text-align: center;width: 100%;border-collapse:collapse;border: 1px solid #e1eafd;"
        >
          <thead style="background: #E1EAFD; font-weight: bold; font-size: 12px">
            <tr>
              <td>{{ $t('processName2') }}</td>
              <td> {{ $t('operation') }} </td>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(data,index) in item.dataList"
              :key="index"
              style="line-height: 16px;height: 30px;font-size: 13px;border-top: 1px solid #e1eafd;"
            >
              <td>{{ data.name }}</td>
              <td>
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  style="padding:5px"
                  @click="deleData(index)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
    <bas-organieation
      v-model="peopleDialog"
      :selected-element="selectedElement"
      :is-specified-group-but="false"
      :multiple="false"
      :is-show-bustom-groups-but="false"
      :select-element="selectElement"
      :show-element="showElement"
      :isShowPost="true"
      :title="orgtitle"
      @fnCallBack="getUser"
    />
    <!-- <select-people :radioChecked="check" v-model="peopleDialog" @confirm="getUser"></select-people> -->
  </el-dialog>
</template>
<script>
// import SelectPeople from "../../../flow_form/SelectPeople";
import {
  saveBpmUserChange,
  getUserProcess
} from '@/bpm/api/process/administrativeTool/agents_change'
import BasComponent from 'bas-component'
Vue.use(BasComponent)
import 'bas-component/lib/BasComponent.css'
export default {
  components: {
    // SelectPeople
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
      default: false
    }
  },
  data() {
    return {
      dialogVisible: this.value,
      peopleDialog: false,
      selectedElement: {},
      showElement: [],
      selectElement: ['9'],
      orgtitle: '',
      checkType: '',
      loading: false,
      processList: []
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
    },
    dialogVisible(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    checkHandle(type, id) {
      this.selectedElement = {}
      if (type === 'olduser') {
        this.orgtitle = this.$t('placeholderText.select') + this.$t('changeUser')
        if (this.item.olduser) {
          this.selectedElement = {
            id: this.item.olduser,
            name: this.item.oldusername,
            idType: `${this.item.olduser}-9`
          }
        }
      } else {
        this.orgtitle = this.$t('placeholderText.select') + this.$t('replaceUser')
        if (this.item.newuser) {
          this.selectedElement = {
            id: this.item.newuser,
            name: this.item.newusername,
            idType: `${this.item.newuser}-9`
          }
        }
      }
      this.checkType = type
      this.peopleDialog = true
    },
    isVerify() {
      if (!this.item.oldusername) {
        this.$message.error(this.$t('placeholderText.select') + this.$t('changeUser'))
        return false
      } else if (!this.item.newusername) {
        this.$message.error(this.$t('placeholderText.select') + this.$t('replaceUser'))
        return false
      } else if (this.item.dataList.length === 0) {
        this.$message.error(this.$t('hintText.processCannotBeEmpty'))
        return false
      }
      // else if (this.item.olduser === this.item.newuser) {
      //   this.$message.error("变更用户和替换用户不能为同一个用户");
      //   return false;
      // }
      return true
    },
    submit(formName) {
      if (!this.isVerify()) return
      this.loading = true
      const _params = Object.assign([], this.item.dataList)
      this.item.processid = _params.map(item => item.id).join(',')
      saveBpmUserChange({
        ...this.item,
        type: '1'
      })
        .then(rt => {
          this.loading = false
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
          this.loading = false
          this.$message({
            message: this.$t('hintText.failToSave'),
            type: 'error'
          })
        })
    },
    cancel() {
      this.dialogVisible = false
    },
    deleData(index) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel')
      }).then(() => {
        this.item.dataList.splice(index, 1)
      })
    },
    getUserProcess() {
      getUserProcess(this.item.olduser).then(rt => {
        if (rt.status === '200') {
          this.item.dataList = rt.data
        }
      })
    },
    getUser(data) {
      this.peopleDialog = false
      if (data) {
        if (this.checkType === 'olduser') {
          this.item.oldusername = data.name
          this.item.olduser = data.id
          if (data.id) {
            this.getUserProcess()
          }
        } else {
          this.item.newusername = data.name
          this.item.newuser = data.id
        }
      }
    }
  }
}
</script>

<style scoped>
.content {
  height: 50vh;
  width: 60%;
  margin: 0 auto;
  overflow-x: hidden;
}
.w100 {
  width: 100%;
}
</style>
