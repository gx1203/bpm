<template>
  <el-dialog :title="$t('releaseProcess')" :visible.sync="dialogVisible"  append-to-body   class="dialog_content_release">
    <el-form  :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px"  class="content">
       <el-form-item :label="$t('releaseProcess') + '：'" prop="processIdUrl">
          <el-select clearable v-model="ruleForm.processIdUrl" :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
            <el-option
              v-for="item in releaseProcessList"
              :key="item.envUrl"
              :label="item.envName"
              :value="item.envUrl"
            ></el-option>
          </el-select>
        </el-form-item>
    </el-form>
     <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('ruleForm')">
        {{ $t('oneClickRelease') }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>  
import { releaseProcessData, deployReleaseProcessData } from "@/bpm/api/process/processModeling/classificationModel";
export default {
  data () {
    return {
      dialogVisible: this.value,
      releaseProcessList:[],
      ruleForm:{},
      selectProcessInfo:{},
      rules:{
        processIdUrl:''
      }
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    processId:{
      type:String,
      default:''
    }
  },
  watch: {
    value (val) {
        this.dialogVisible = val
        this.releaseProcessData()
    },
    dialogVisible (val) {
      this.$emit('input', val)
    },
  },
  methods: {
    releaseProcessData(){
      releaseProcessData()
        .then(rt => {
          if (rt.status === "200") {
            this.releaseProcessList = rt.data
          }
        })
        .catch(er => {
        });
    },
     submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          deployReleaseProcessData({processId:this.processId, url:this.ruleForm.processIdUrl})
            .then(rt => {
              if (rt.status === "200") {
                this.$message.success(this.$t("hintText.releaseSuccess"));
                this.dialogVisible = false;
              }
            })
            .catch(() => {
            });
        }
      });
    },
    cancel() {
      this.dialogVisible = false;
    }
  },
  mounted () {
  }
}
</script>

<style scoped>
 .content {
    margin: 0 auto;
    padding: 0 10px;
    overflow: auto;
  }
  .w100 {
    width: 100%;
  }
</style>

<style lang="scss">
.dialog_content_release{
  .el-dialog{
      width:50vw;
      height:60vh;
      padding:30px;
      box-sizing: border-box;
      .el-dialog__body{
        width:100%;
      }
    }
}

</style>
