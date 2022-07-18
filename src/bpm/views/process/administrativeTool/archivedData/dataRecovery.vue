<template>
    <el-dialog :title="title" :visible.sync="dialogVisible1">
    <el-row :gutter="20">
    <el-col :span="15" :offset="4" class="text-title">
      <div>
      注：确认恢复！则将所选编码下的所有表单全部恢复，可再工作台模块查看！
     </div>
    </el-col>
</el-row>
  
    <el-form :model="item" ref="item" label-width="auto" class="content" >
      <el-form-item :label="$t('ArchiveCoding') + '：'" >
         <el-select v-model="archivenum" filterable placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.archivenum"
          :value="item.id">
        </el-option>
      </el-select>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <!-- <el-button type="primary" @click="submit('item')" :disabled="!item.createDate">{{ $t('confirm') }}</el-button> -->
      <el-button type="primary" @click="submit('item')"  :disabled="!archivenum">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getarchiveRecord,dataRecoverys,dataRecoveryByInstid } from '@/bpm/api/process/processModeling/approve_type'

export default {
 data() {
    return {
        dialogVisible1: this.value,
        page:{
          pageNum: 1,
          pageSize: 10000
        },
        options: [],
        archivenum: '',
        item:{}
    }
  },
  components: {
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
 
    title: {
      type: String,
      default: false
    },
  
  },
  watch: {
    value(val) {
      this.dialogVisible1 = val;
       if (val) {
        this.getarchiveRecord();
      }
    },
    dialogVisible1(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    getarchiveRecord(){
     getarchiveRecord({
        ...this.page
      })
        .then(rt => {
          console.log(rt);
         this.options=rt.data.list
        })
    },
    checkHandle () {
      this.peopleDialog = true
    },
    submit(formName) {     
                        console.log(this.archivenum)

    
            this.$refs[formName].validate(valid => {
                if (valid) {
                  console.log(this.item)
                  dataRecoverys({id:this.archivenum})
                    .then(rt => {
                      if (rt.status === "200") {
                        this.$message({
                          message: this.$t('hintText.saveSuccessfully'),
                          type: "success"
                        });
                        this.dialogVisible1 = false;
                        this.$emit("confirm", true);
                              this.archivenum = '';

                      } else {
                        this.$message({
                          message: this.$t('hintText.failToSave'),
                          type: "error"
                        });
                              this.archivenum = '';

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
      this.dialogVisible1 = false;
      this.archivenum = '';
    },
  },
  
}
</script>

<style>
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

</style>