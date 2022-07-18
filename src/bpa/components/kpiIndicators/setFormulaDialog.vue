<template>
  <el-dialog
    title="设定公式"
    :visible.sync="setexpressFlag"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    @close="closeDialog"
  >
    <div class="modalDialogSetting dialog-content">
      <div class="dialog_body tabsContent">
        <div class="dialog_wrapper clearfix">
          <div class="left">
            <div class="organization active common">公式</div>
            <!--<div class="usually common">子节点</div>-->
          </div>
          <div class="w500px">
            <div class="showExpression">
              <el-form
                ref="formulaForm"
                :model="formulaForm"
                :rules="formulaRules"
                label-width="120px"
                class="form-horizontal"
              >
                <el-form-item label="计算符">
                  <el-radio-group
                    v-model="formulaForm.evaluator"
                    @change="getEvaluatorValue"
                    size="small"
                  >
                    <el-radio-button label="+">+</el-radio-button>
                    <el-radio-button label="-">-</el-radio-button>
                    <el-radio-button label="*">*</el-radio-button>
                    <el-radio-button label="/">/</el-radio-button>
                    <el-radio-button label="()">()</el-radio-button>
                    <el-radio-button label="sum()">sum()</el-radio-button>
                    <el-radio-button label="avg()">avg()</el-radio-button>
                    <el-radio-button label="max()">max()</el-radio-button>
                    <el-radio-button label="min()">min()</el-radio-button>
                    <el-radio-button label="count()">count()</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="业务字段" prop="businessField">
                  <el-select
                    v-model="formulaForm.businessField"
                    @change="getBusiness"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in businessOptions"
                      :key="item.efield"
                      :label="item.field"
                      :value="item.field"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="流程字段" prop="businessField">
                  <el-select
                    v-model="formulaForm.processField"
                    @change="getProcess"
                    placeholder="请选择"
                    :required="true"
                  >
                    <el-option
                      v-for="item in processOptions"
                      :key="item.efield"
                      :label="item.field"
                      :value="item.field"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="总指标" prop="processField">
                  <el-input
                    type="textarea"
                    ref="textarea"
                    v-model="formulaForm.delivery"
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="showExpression"></div>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit('formulaForm')">确定</el-button>
      <el-button type="primary" @click="reset">重置</el-button>
      <el-button @click="setexpressFlag = false">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  getBusinessValue,
  getProcessValue,
  saveVckpiformula
} from '@/bpa/api/processDesignCenter'
export default {
  data() {
    return {
      businessOptions: [],
      processOptions: [],
      setexpressFlag: this.value,
      formulaForm: {
        evaluator: '',
        businessField: '',
        processField: '',
        delivery: ''
      },
      formulaRules: {
        businessField: [{ required: true, message: ' ', trigger: 'change' }],
        processField: [{ required: true, message: ' ', trigger: 'change' }],
        delivery: [{ required: true, message: ' ', trigger: 'change' }]
      }
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    kpiValue: {
      type: String,
      default: ''
    }
  },
  watch: {
    value(val) {
      this.setexpressFlag = val
      if (val) {
        this.formulaForm.delivery = this.kpiValue
        this.getProcessOptions()
        this.getBusinessOptions()
      } else {
      }
    },

    setexpressFlag(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    closeDialog() {
      this.formulaForm.processField = ''
      this.$refs.formulaForm.resetFields()
    },
    reset() {
      this.formulaForm.processField = ''
      this.$refs.formulaForm.resetFields()
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let obj = {
            id: '',
            formula: this.formulaForm.delivery
          }
          saveVckpiformula(obj).then(res => {
            if (res) {
              this.$message.success('保存成功！')
              this.setexpressFlag = false
              this.$emit('confirm', this.formulaForm.delivery)
            }
          })
        }
      })
    },
    async insertAtCursor(item) {
      // var myValue = "[" + item + "]";
      var myValue = item
      const myField = this.$refs.textarea.$el.children[0]

      if (myField.selectionStart || myField.selectionStart === 0) {
        var startPos = myField.selectionStart
        var endPos = myField.selectionEnd
        this.formulaForm.delivery = myValue
        this.formulaForm.delivery =
          myField.value.substring(0, startPos) +
          myValue +
          myField.value.substring(endPos, myField.value.length)
        await this.$nextTick() // 这句是重点, 圈起来,不加的话后面两步有问题
        myField.focus()
        myField.setSelectionRange(
          endPos + myValue.length,
          endPos + myValue.length
        )
      } else {
        this.formulaForm.delivery += myValue
      }
    },
    getEvaluatorValue() {
      this.insertAtCursor(this.formulaForm.evaluator)
    },
    getBusiness() {
      this.insertAtCursor('[' + this.formulaForm.businessField + ']')
    },
    getProcess() {
      this.insertAtCursor('[' + this.formulaForm.processField + ']')
    },
    getProcessOptions() {
      getBusinessValue().then(res => {
        this.businessOptions = res
      })
    },
    getBusinessOptions() {
      getProcessValue().then(res => {
        this.processOptions = res
      })
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
.modalDialogSetting {
  /deep/ .el-radio-button__inner {
    border-left: 1px solid #dcdfe6;
    margin-right: 5px;
    box-shadow: 0px 0 0 0 #3141a9;
    border-radius: 4px;
  }
}

.form-group {
  display: flex;
}
.control-label {
  padding-right: 12px;
  flex: 0 0 110px;
  text-align: right;
  box-sizing: border-box;
}
/*流程绩效的图例*/
.targetSign {
  width: 318px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  -moz-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
  margin-bottom: 10px;
}
.bg-lightGreen {
  background-color: rgba(208, 225, 125, 1);
}
.bg-yellow {
  background-color: rgba(255, 255, 0, 1);
}
.bg-red {
  background-color: rgba(255, 0, 0, 1);
}
.bg-lightGray {
  background-color: rgba(204, 204, 204, 1);
}
.setExpress-wrapper {
  display: flex;
}
.set-item {
  flex: 1;
  margin-right: 10px;
}
.setExpress {
  height: 30px;
  width: 70px;
}
.btn-primary {
  color: #fff;
  background-color: #337ab7;
  border-color: #2e6da4;
}
.btn-sm {
  padding: 5px 10px;
  font-size: 12px;
  line-height: 1.5;
  border-radius: 3px;
}
.btn {
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-image: none;
  border: 1px solid transparent;
  border-radius: 4px;
}
.dialog_body {
  font-size: 14px;
  color: #606266;
  padding: 0 25px;
}
.dialog_wrapper {
  padding-top: 10px;
  border-top: 1px solid #cfcfcf;
  /* width: 580px; */
}
.dialog_wrapper .left {
  width: 40px;
  float: left;
}
.dialog_wrapper .left .organization,
.dialog_wrapper .left .station,
.dialog_wrapper .left .dept,
.dialog_wrapper .left .usually,
.dialog_wrapper .left .persons {
  font-size: 16px;
  width: 30px;
  height: auto;
  padding: 10px 0;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  text-align: center;
  margin-bottom: 5px;
  border-radius: 4px;
  -moz-border-radius: 4px;
  -webkit-border-radius: 4px;
  cursor: pointer;
  cursor: -ms-pointer;
}
.clearfix {
  *zoom: 1;
}

.clearfix:after {
  content: '\200B';
  display: block;
  height: 0;
  clear: both;
}
.dialog_wrapper .left .organization.active,
.dialog_wrapper .left .station.active,
.dialog_wrapper .left .dept.active,
.dialog_wrapper .left .usually.active,
.dialog_wrapper .left .persons.active {
  color: #fff;
  background-color: #337ab7;
  border-color: #337ab7;
}

.dialog_wrapper .center {
  width: 180px;
  height: 300px;
  padding: 5px;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  border: 1px solid #cfcfcf;
  float: left;
  margin-right: 10px;
}
.dialog_wrapper .another_center {
  width: 220px;
}
.dialog_wrapper .center .form-control {
  height: 28px;
}
.dialog_wrapper .center .input-group-addon {
  font-size: 12px;
}
.dialog_wrapper .center .treeContent {
  height: 252px;
  margin-top: 10px;
  overflow: auto;
}
.dialog_wrapper .center .centerContent {
  display: none;
}
.dialog_wrapper .center .centerContent.block {
  display: block;
}
.dialog_wrapper .center .centerContent p {
  margin: 0;
  line-height: 23px;
}
.dialog_wrapper .center .centerContent p:hover {
  color: #3c7ab7;
}
.dialog_wrapper .center .centerContent p.active {
  color: #3c7ab7;
}
.dialog_wrapper .center .form-group {
  margin-bottom: 5px;
}
.dialog_wrapper .center .form-group label {
  line-height: 28px;
  margin: 0;
}

.dialog_wrapper .right {
  width: 350px;
  height: 300px;
  border: 1px solid #cfcfcf;
  float: left;
  position: relative;
}
.modalDialogProcess .right {
  /* width: 300px; */
  height: 300px;
  border: 1px solid #cfcfcf;
  float: left;
  position: relative;
}
.dialog_wrapper .right .tableShow {
  padding-bottom: 45px;
}
.dialog_footer {
  padding: 10px 20px 20px;
}
.modalDialogSetting .calculator button {
  margin-bottom: 5px;
  margin-right: 5px;
}
.modalDialogSetting .showExpression {
  display: none;
  height: 300px;
  overflow-y: auto;
}
.modalDialogSetting .showExpression:nth-of-type(1) {
  display: block;
}
.modalDialogSetting .w500px .showExpression .attr-table-inp {
  width: 100%;
  border: 1px solid #cfcfcf;
  border-radius: 5px;
  outline: none;
  display: block;
  box-sizing: border-box;
}
/deep/.el-button:hover,
.el-button:focus {
  background-color: #2d42af !important;
  color: #fff !important;
}
</style>
