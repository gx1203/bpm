<template>
  <el-dialog :title="title" :visible.sync="dialogVisible">
    <el-row :gutter="20">
  <el-col :span="14" :offset="4" class="text-title">
      <div>
      注：三者必填其一，最终折算为天后按照流程完成时间进行归档！
    </div>
  </el-col>
</el-row>
  
    <el-form :model="item" ref="item" label-width="auto" class="content">
      <!-- <el-form-item :label="$t('archiveTime') + '：'" prop="createDate">
        <el-date-picker
          v-model="item.createDate"
          type="date"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item> -->
  
      <el-form-item :label="$t('SetUpIn') + '：'" >
          <el-row>
            <el-col :span="16" >     
              <el-input v-model="item.keepyear" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
maxlength="3" :placeholder="$t('placeholderText.pleaseEnterTheContent')"></el-input> 
            </el-col>
            <el-col :span="6"  :offset="2"> 
               <span class="text-color">一年365天</span>
            </el-col>
          </el-row>
      </el-form-item>

      <el-form-item :label="$t('SetTheMonth') + '：'" >
           <el-row>
            <el-col :span="16" >     
              <el-input v-model="item.keepmonth" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
maxlength="3" :placeholder="$t('placeholderText.pleaseEnterTheContent')"></el-input>
             </el-col>
           <el-col :span="6"  :offset="2"> 
            <span class="text-color">一月30天</span>
          </el-col>
          </el-row>
      </el-form-item>
      <el-form-item :label="$t('SetTheDate') + '：'" >
          <el-row>
            <el-col :span="16" >  
            <el-input v-model="item.keepday" onkeyup="this.value = parseInt(this.value);this.value = this.value.replace(/[^\d.]/g,'');"
maxlength="3" :placeholder="$t('placeholderText.pleaseEnterTheContent')"></el-input>
           </el-col>
          </el-row>
      </el-form-item>
  
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <!-- <el-button type="primary" @click="submit('item')" :disabled="JSON.stringify(data) == "{}"">{{ $t('confirm') }}</el-button> -->
      <el-button type="primary" @click="submit('item')" :disabled="JSON.stringify(item) == '{}'" >{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { saveProcessArchiveKeepDay } from '@/bpm/api/process/processModeling/approve_type'

export default {
  data() {
    return {
      dialogVisible: this.value,
      rules:{
        createDate:[
          {required:true,message: this.$t('placeholderText.pleaseSetArchiveTime'),trigger:'blur'}
        ]
      }
    };
  },
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
        return {};
      }
    },
    title: {
      type: String,
      default: false
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    
    checkHandle () {
      this.peopleDialog = true
    },
    submit(formName) {
      this.$set(this.item,'keepday',this.item.keepday.split(".").join(""))
       this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.item)
          saveProcessArchiveKeepDay(this.item)
            .then(rt => {
              if (rt.status === "200") {
                this.$message({
                  message: this.$t('hintText.saveSuccessfully'),
                  type: "success"
                });
                this.dialogVisible = false;
                this.$emit("confirm", true);
              } else {
                this.$message({
                  message: this.$t('hintText.failToSave'),
                  type: "error"
                });
              }
            })
            .catch(() => {
              this.$message({
                message: this.$t('hintText.failToSave'),
                type: "error"
              });
            });
        }
      });
    },
    cancel() {
      this.dialogVisible = false;
      
    },
  },
  mounted() {
  }
};
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
.text-title{
  margin-bottom: 20px;
  color: red;
}
.text-color{
  color: red;

}
</style>
