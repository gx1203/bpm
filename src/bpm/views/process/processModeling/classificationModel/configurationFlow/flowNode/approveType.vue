<template>
  <div id="approveType" v-loading="load">
    <el-form ref="ruleForm" :model="ruleForm" label-width="120px">
      <el-row>
        <el-col :span="10" :offset="2">
          <el-form-item :label="$t('nodeName') + '：'">
            <el-input v-model="ruleForm.processNodeName" clearable disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="2">
          <el-form-item :label="$t('approvalType') + '：'">
            <el-checkbox-group v-model="approvals" @change="handleCheckedCitiesChange">
              <div v-for="item in ruleForm.approveVos" :key="item.id">
                <el-checkbox :label="item.id">
                  {{ item.name }}
                  <span class="sp-in"  v-if="item.code == 'PLUS_SIGNED' && states">{{$t('automaticPassRate')}}%
                    <el-input style="width: 80px;" size="mini" type="number" v-model="processingRate" ></el-input></span>
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col v-if="isShow" :span="10" :offset="2">
          <el-form-item :label="$t('returnableCollectionOfNodes') + '：'">
            <el-checkbox-group v-model="backNodes">
              <div v-for="item in ruleForm.backNodes" :key="item.id">
                <el-checkbox :label="item.id">
                  {{ item.activityname }}
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="10" :offset="2">
        <div class="text-r">
          <el-button type="primary" @click="saveForm">
            {{ $t("submit") }}
          </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { saveApprovalType } from "@/bpm/api/process/processModeling/classificationModel";

export default {
  name: "ApproveType",
  props: {
    content: {
      type: Object,
    },
    treeData: {
      type: Object,
    }
  },
  data() {
    return {
      ruleForm: {},
      approvals: [],
      backNodes: [],
      isShow: false,
      load: false,
      states:false,
      processingRate:'100'
    };
  },
  watch: {
    content(val) {
      this.ruleForm = val;
      val.approveVos.forEach((element) => {
        if (element.isCheck === "Y") {
          this.approvals.push(element.id);
          if (
            element.code === "RETURN_TO" ||
            element.code === "RETURN_TO_BACKAPPROVE" ||
            element.code === "RETURN_TO_REAPPROVE"
          ) {
            this.isShow = true;
          }
        }
      });
      val.backNodes.forEach((element) => {
        if (element.isCheck === "Y") {
          this.backNodes.push(element.id);
        }
      });
    },
    approvals(val) {
      val.forEach((item) => {
        this.ruleForm.approveVos.forEach((element) => {
          if (item === element.id) {
            if (
              element.code !== "RETURN_TO" ||
              element.code !== "RETURN_TO_BACKAPPROVE" ||
              element.code !== "RETURN_TO_REAPPROVE"
            ) {
              this.isShow = true;
            }
          }
          console.log(element.id,'element----------');
           if(element.id =="10007" ){
             if( element.processingRate){
               this.processingRate = element.processingRate
             }else{
                this.processingRate = '100'
             }
           }
        });
           if(item=="10007"){
             this.states = true
          }
      });
    },
    processingRate(e){
        var reg = /^([0-9]{1,2}|100)$/;
      if (!reg.test(e)) {
            this.processingRate = ''
          } else {
            this.processingRate = e
          }
    }
  },
  methods: {
    handleCheckedCitiesChange(e){
        console.log(this.approvals);
         this.states = e.some(function(i){
           return i == '10007';
          })

    },
    saveForm() {
      this.load = true;
      let approvalType=[]
      this.approvals.forEach(i=>{
        approvalType.push(
          {
            id:i,
            processingRate:''
          }
        )
      })
      approvalType.forEach(i=>{
        if(i.id=="10007"){
          i.processingRate = this.processingRate
        }
      })
      saveApprovalType({
        approvalTypeList:approvalType,
        // approvals: this.approvals,
        backNodes: this.backNodes,
        processNodeId: this.ruleForm.processNodeId,
        version: this.treeData.version
      })
        .then((rt) => {
          this.load = false;
          if (rt.status === "200") {
            this.$message.success(this.$t("hintText.submittedSuccessfully"));
          }
        })
        .catch((er) => {
          this.load = false;
        });
    },
  },
};
</script>
<style lang="scss">
#approveType {
  .el-form-item__label {
    color: $tc1;
    font-size: 12px;
  }
  .el-input__inner {
    border: none;
    border-bottom: 1px solid $dc1;
  }
  .text-r {
    button {
      margin: 15px 10px;
    }
  }
}
</style>
<style lang="scss" scoped>
#approveType {
  .w100 {
    width: 100%;
  }
  .sp-in{
   margin-left: 20px;
   color: #666;
  }
}
</style>
