<template>
  <div id="reminderConfig" v-loading="loading">
    <el-row>
      <el-col :span="3">
        <h2 style="margin-bottom: 20px;">{{$t('reminderConfiguration')}}</h2>
      </el-col>
      <el-col :span="21">
        <span style="color:red;">{{$t('remindTip')}}</span>
      </el-col>
    </el-row>
    <el-form ref="ruleForm" :model="content" label-width="130px">
      <el-form-item :label="$t('receiveTask') + '：'">
        <el-row>
          <el-col :span="20">
            <el-checkbox-group v-model="content.textingchecked">
              <el-checkbox :label="val.value" v-for="(val, index) in options" :key="index">{{val.text}}</el-checkbox>
            </el-checkbox-group>
          </el-col>
          <el-col :span="4" align="right">
            <el-button type="text" @click="dialogVisible = true">示例</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('remindTheContent') + '：'" :required="content.textingchecked.length>0">
        <el-input v-model="content.notificationcontent" type="textarea" />
      </el-form-item>
    </el-form>
    <h2 style="margin-bottom: 20px;">{{$t('timeoutTask')}}</h2>
    <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;">
      <el-table-column align="center" width="180">
        <template slot="header" slot-scope="scope">
          <span class="red">*</span>{{$t('remindFrequency')}}
        </template>
        <template slot-scope="scope">
          <el-select clearable @change="changeType(scope.$index)" v-model="scope.row.notificationfrequency">
            <el-option v-for="item in typeList" :key="item.value" :label="item.text" :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100">
        <template slot-scope="scope">
          <!-- onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" -->
          <el-input v-model="scope.row.notificationtimelimit" :disabled="scope.row.notificationfrequency === '10'"
            type="number" @blur="checkVal(scope.$index)"></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" width="180">
        <template slot="header" slot-scope="scope">
          <span class="red">*</span>{{$t('remindWay')}}
        </template>
        <template slot-scope="scope">
          <el-select clearable v-model="scope.row.notificationmode" multiple>
            <el-option v-for="item in options" :key="item.value" :label="item.text" :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
          <span class="red">*</span>{{$t('remindContent')}}
        </template>
        <template slot-scope="scope">
          <el-input type="text" v-model="scope.row.notificationcontent"></el-input>
        </template>
      </el-table-column>
      <el-table-column :label="$t('operation')" width="60" align="center">
        <template slot-scope="scope">
          <el-button type="text" :title="$t('delete')" icon="el-icon-delete"
            @click="handleDeleteOne(scope.row,scope.$index)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align:right;">
      <el-button @click="add">{{ $t('addRule') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('confirm') }}</el-button>
    </div>
    <el-dialog title="示例" :visible.sync="dialogVisible">
      <el-form label-width="130px">
        <el-form-item label="即时/提前提醒：">
          <div>您于 ${接收时间} 接收 ${申请人} ${申请时间} 发起流程单号为 ${申请单号} 的 ${流程名称} ，主题为 ${主题}，请及时审批，逾期将会列入绩效考核！</div>
        </el-form-item>
        <el-form-item label="逾期提醒：">
          <div>您于 ${接收时间} 接收 ${申请人} ${申请时间} 发起流程单号为 ${申请单号} 的 ${流程名称}
            ，主题为 ${主题}，逾期 ${逾期时间} 小时，已被记入绩效考核，请尽快处理！</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t('cancel')}}</el-button>
        <el-button type="primary" @click="dialogVisible = false">{{$t('confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDictionaryOption,
  batchSave,
  queryProcessNodeConfig,
  saveProcessNodeConfig,
  deleteProcessNodeConfig,
  updateProcessNode
} from "@/bpm/api/process/processModeling/classificationModel";
export default {
  data () {
    return {
      loading: false,
      dialogVisible: false,
      tableData: [],
      typeList: [],
      options: [],
      num: 0
    }
  },
  props: {
    content: {
      type: Object,
      default () {
        return {}
      }
    },
    treeData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  watch: {
    num (val) {
      if (val > 2) {
        this.loading = false
      }
    }
  },
  methods: {
    checkVal (i) {
      if (this.tableData[i].notificationtimelimit <= 0 || this.tableData[i].notificationtimelimit >= 100) {
        this.tableData[i].notificationtimelimit = ''
      }
    },
    changeType (i) {
      if (this.tableData[i].notificationfrequency === '10') {
        this.$set(this.tableData[i], 'notificationtimelimit', '')
      }
    },
    submit () {
      console.log(this.content)
      if (!this.content.deadline) {
        this.$message(this.$t('remindConfig'))
        return
      }
      let obj = Object.assign({}, this.content)
      obj.textingchecked = obj.textingchecked.join(',')
      if (this.content.textingchecked.length > 0) {
        if (!this.content.notificationcontent) {
          this.$message(this.$t('remindContentCheck'))
          return
        }
      }
      for (let index = 0; index < this.tableData.length; index++) {
        const element = this.tableData[index]
        console.log(element)
        if (element.notificationfrequency === '10') {
          if (!element.notificationcontent || !element.notificationfrequency || element.notificationmode.length < 1) {
            this.$message(`请将第${index + 1}行信息填写完整`)
            return
          }
        } else {
          if (!element.notificationcontent || !element.notificationfrequency || !element.notificationtimelimit || element.notificationmode.length < 1) {
            this.$message(`请将第${index + 1}行信息填写完整`)
            return
          }
        }
      }
      this.loading = true
      updateProcessNode({
        ...obj,
        version: this.treeData.version
      }).then(rt => {
        if (rt.status === '200') {
          let canshu = JSON.parse(JSON.stringify(this.tableData))
          canshu.forEach(element => {
            element.notificationmode = element.notificationmode.join(',')
          })
          batchSave(this.treeData.id, canshu).then(rt => {
            this.$message.success(this.$t('hintText.submittedSuccessfully'))
          })
        }
        this.loading = false
      }).catch(er => {
        this.loading = false
      })
    },
    add () {
      if (!this.content.deadline) {
        this.$message(this.$t('remindConfig'))
        return
      }
      console.log(this.content)
      this.tableData.push({
        notificationcontent: '',
        notificationfrequency: '',
        notificationtimelimit: '',
        notificationmode: [],
        processnodeid: this.treeData.id
      })
    },
    handleDeleteOne (item, index) {
      this.tableData.splice(index, 1)
    },
    getOptions () {
      this.num = 0
      this.loading = true
      getDictionaryOption({
        dictionaryen: "NotificationFrequency"
      }).then(rt => {
        this.num++
        this.typeList = rt.data
      })
      getDictionaryOption({
        dictionaryen: "NotificationMode"
      }).then(rt => {
        this.num++
        this.options = rt.data
      })
      queryProcessNodeConfig({
        attr: {
          version: this.treeData.version
        },
        'filters': [
          { 'key': 'processnodeid', 'opt': 'EQ', 'type': 'S', 'value': this.treeData.id }
        ],
        'pageSize': 10000
      }).then(rt => {
        this.num++
        if (rt.data.list && rt.data.list.length > 0) {
          rt.data.list.forEach(element => {
            element.notificationmode = element.notificationmode.split(',')
          })
          this.tableData = rt.data.list
        } else {
          this.tableData = []
        }
      })
    }
  },
  mounted () {
    this.getOptions()
  }
};
</script>

<style lang="scss" scoped>
#reminderConfig {
  padding: 0 5px 15px 15px;
  /deep/.el-table__header th {
    background: rgb(225, 234, 253) !important;
    border-bottom: 1px solid #ebeef5;
  }
  /deep/ .el-input__inner {
    // border: none;
    border-bottom: 1px solid #e5e5e5;
  }
}
</style>
