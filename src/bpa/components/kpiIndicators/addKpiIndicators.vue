<template>
  <el-dialog class="addKpiIndicators" :title="editItem.id ? existTabField('editIndicators', '', true) : existTabField('addIndicators', '', true)" :visible.sync="dialogVisible" :append-to-body="true" @close="closeDialog">
    <el-form label-width="110px" label-position="right" ref="processRef" :model="targetform" :rules="targetrules">
      <el-form-item v-if="existTabField('targetNameDialog', 'refer')" :label="existTabField('targetNameDialog')" prop="name">
        <el-input v-model="targetform.name"></el-input>
      </el-form-item>
      <el-form-item v-if="existTabField('descDialog', 'refer')" :label="existTabField('descDialog')" prop="description">
        <el-input type="textarea" v-model="targetform.description" autosize resize="none"></el-input>
      </el-form-item>
      <!--<el-form-item v-if="existTabField('kpiValue', 'refer')" :label="existTabField('kpiValue')" prop="target">-->
      <!--  <el-input type="number" v-model="targetform.target"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item v-if="existTabField('comments', 'refer')" :label="existTabField('comments')" prop="remark">
        <el-input type="textarea" autosize  v-model="targetform.remark" resize="none"></el-input>
      </el-form-item>
      <div class="setExpress-wrapper">
        <el-form-item class="set-item" :label="$t('KPIValues')" prop="exname">
          <el-input disabled type="textarea" autosize v-model="targetform.exname" resize="none"></el-input>
        </el-form-item>
        <el-button class="setExpress" @click="setexpressFlag = true">{{$t('SetFormula')}}</el-button>
      </div>
      <el-form-item :label="$t('plannedValue1')" prop="pvalue1">
        <el-input type="number" v-model="targetform.pvalue1"></el-input>
      </el-form-item>
      <el-form-item :label="$t('plannedValue2')" prop="pvalue2">
        <el-input type="number" v-model="targetform.pvalue2"></el-input>
      </el-form-item>
      <el-form-item :label="$t('ThresholdMinMax')" prop="threshold">
        <el-input type="number" v-model="targetform.threshold"></el-input>
      </el-form-item>
      <el-form-item label="图例">
        <el-row>
          <el-col :span="11">
            <p class="targetSign bg-lightGreen">计划值1 < KPI值</p>
          </el-col>
          <el-col :span="11" :offset="1">
            <p class="targetSign bg-yellow">计划值2 < KPI值 ≤ 计划值1</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <p class="targetSign bg-red">阈值 < KPI值 ≤ 计划值2</p>
          </el-col>
          <el-col :span="11" :offset="1">
            <p class="targetSign bg-lightGray">KPI值 ≤ 阈值</p>
          </el-col>
        </el-row>
      </el-form-item>
<!--      <div class="form-group">-->
<!--        <label class="control-label bg-transparent">图例</label>-->
<!--        <div>-->
<!--          <el-row>-->
<!--            <el-col :span="11">-->
<!--              <p class="targetSign bg-lightGreen">计划值1 < KPI值</p>-->
<!--            </el-col>-->
<!--           <el-col :span="11" :offset="1">-->
<!--              <p class="targetSign bg-yellow">计划值2 < KPI值 ≤ 计划值1</p>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--          <el-row>-->
<!--            <el-col :span="11">-->
<!--              <p class="targetSign bg-red">阈值 < KPI值 ≤ 计划值2</p>-->
<!--            </el-col>-->
<!--            <el-col :span="11" :offset="1">-->
<!--              <p class="targetSign bg-lightGray">KPI值 ≤ 阈值</p>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--        </div>-->
<!--      </div>-->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{$t("cancel")}}</el-button>
      <el-button type="primary" @click="confirmProcess">{{$t("confirm")}}</el-button>
    </span>
    <setFormulaDialog v-model="setexpressFlag" @confirm='getFormulaValue' :kpiValue='this.targetform.exname'/>
  </el-dialog>
</template>
<script>
import {
  saveTarget
} from '@/bpa/api/processDesignCenter'
import setFormulaDialog from './setFormulaDialog.vue'

export default {
  components: {
    setFormulaDialog
  },
  data() {
    return {
      dialogVisible: this.value,
      targetform: {
        name: '',
        description: '',
        remark: '',
        exname: '',
        pvalue1: '',
        pvalue2: '',
        threshold: ''
      },
      targetrules: {
        name: [{ required: true, message: ' ', trigger: 'blur' }],
        description: [{ required: true, message: ' ', trigger: 'blur' }],
        // target: [{ required: true, message: ' ', trigger: 'blur' }],
        exname: [{ required: true, message: ' ', trigger: 'blur' }],
        pvalue1: [{ required: true, message: ' ', trigger: 'blur' }],
        pvalue2: [{ required: true, message: ' ', trigger: 'blur' }],
        threshold: [{ required: true, message: ' ', trigger: 'blur' }],
      },
      setexpressFlag: false
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    modelid: {
      type: String,
      default: ''
    },
    showtabfiled: {
      type: Array,
      default: () => []
    },
    editItem: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
      if (val) {
        if (this.editItem.id) {
          this.targetform = this.editItem
        } else {
          this.targetform = {
            name: '',
            description: '',
            remark: '',
            exname: '',
            pvalue1: '',
            pvalue2: '',
            threshold: ''
          }
        }
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    closeDialog () {
      this.$refs.processRef.resetFields()
    },
    getFormulaValue(data){
      this.targetform.exname = data
    },
    // 判断条件
    existTabField (pname, type, bool) {
      let obj = {}
      this.showtabfiled.forEach(item => {
        if (item.pname === pname) {
          obj = JSON.parse(JSON.stringify(item))
          return false
        }
      })
      let lang = localStorage.getItem("language")
      if (type == 'refer') {
        return !!obj.pname
      } else if (type == 'necessary') {
        return obj.necessary == '1'
      } else {
        return obj.pname && lang === 'cn' ? obj.name + (!bool ? ':' : '') : obj.pname && lang === 'en' ? obj.enname + (!bool ? ':' : '') : obj.enname + (!bool ? ":" : "")
      }
    },
    confirmProcess () {
      let self = this
      this.$refs.processRef.validate(async valid => {
        if (valid) {
          // let data = {
          //   description: this.targetform.desc,
          //   listid: this.modelid,
          //   name: this.targetform.name,
          //   remark: this.targetform.remark,
          //   target: this.targetform.target,
          // }
          let res = await saveTarget({
            listid: this.modelid,
            ...this.targetform
          })
          if (res) {
            self.dialogVisible = false
            this.$message({
              message: this.existTabField('addedSuccessfully', '', true),
              type: 'success'
            })
            this.$emit("confirm");
          }
        } else {
          this.$message({
            message: this.$t('hintText.theRequiredFieldsMustNotBeEmpty'),
            type: 'warning'
          })
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
  .addKpiIndicators {
    /deep/ .el-dialog__body {
      max-height: 60vh;
      padding: 15px;
    }
  }
  .form-group{
    display: flex;

  }
  .control-label{
    padding-right: 12px;
    flex: 0 0 110px;
    text-align: right;
    box-sizing: border-box;
  }
  /*流程绩效的图例*/
  .targetSign{
    width: 100%;
    height: 35px;
    line-height: 35px;
    text-align: center;
    -moz-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
    -webkit-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
    margin-bottom: 10px;
  }
  .bg-lightGreen{
    background-color: rgba(208, 225, 125, 1);
  }
  .bg-yellow{
    background-color: rgba(255, 255, 0, 1);
  }
  .bg-red{
    background-color: rgba(255, 0, 0, 1);
  }
  .bg-lightGray{
    background-color: rgba(204, 204, 204, 1);
  }
  .setExpress-wrapper{
    display: flex;
  }
  .set-item{
    flex: 1;
    margin-right: 10px;
  }
  .setExpress{
    height: 30px;
    width: 70px;
  }
</style>
