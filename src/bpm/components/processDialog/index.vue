<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="80%"
    top="2vh" class="preview-approval">
    <el-tabs type="card"  v-model="activeName"   class='topCustom'>
      <el-tab-pane :label="$t('previewApproval')" name="1">
        <div style="max-height: 60vh;overflow: auto;position:relative;">
          <p v-if="isShowTip" style="color:red;margin-bottom:10px;">{{$t('remindTipApproval')}}</p>
          <el-table
          v-loading="pageLoading"
          :data="content"
          border
          style="margin-bottom: 10px">
            <el-table-column
              prop="processNode.activityname"
              :label="$t('approvalNode')">
            </el-table-column>
            <!-- <el-table-column
              prop="userNames"
              :label="$t('approver')">
            </el-table-column> -->
            <el-table-column
              prop="userNames"
              :label="$t('approver')">
              <template slot-scope="scope">
                  <div :class="{'red-control': scope.row.noApprovalUser}">
                    {{ scope.row.userNames}}
                  </div>
                </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('flowChart')" name="2">
        <instance-image-page v-model="dialogVisibleImage" :instanceId="process.processName" :bpaVersion="bpaVersion" />
      </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">{{ $t('cancelAction') }}</el-button>
      <el-button v-if='isBut' type="primary" @click="confirm">{{ $t('submit') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getPreviewApproversList } from '@/bpm/api/flow/index'
import InstanceImagePage from "@/bpm/components/InstanceImagePage";
import {
  getProcessQuickQuery
} from "@/bpm/api/process/processModeling/process_manage";
export default {
  components: {
    InstanceImagePage
  },
  data () {
    return {
      activeName: '1',
      dialogVisible: false,
      dialogVisibleImage: false,
      content: [],
      pageLoading: false,
      isShowTip:false,
      noApprovalUserList:[],
      bpaVersion: ''
    }
  },
  props: {
    value: {
      type: Boolean
    },
    isBut:{
      type:Boolean
    },
    process: {
      type: Object,
      default:{}
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
      if (val) {
        this.getData()
        this.getVeriosn()
      }
    },
    dialogVisible (val) {
      this.$emit('input', val)
    },
    activeName(val){
      if(val == '1'){
         this.getData()
        this.dialogVisibleImage = false
      }else{
       this.dialogVisibleImage = true
      }
    }
  },
  methods: {
    getVeriosn() {
      getProcessQuickQuery({
        filters: [
          {
            key: "processname",
            opt: "EQ",
            type: "S",
            value: this.process.processName
          },
          {
            key: "history",
            opt: "EQ",
            type: "S",
            value: "Y"
          }
        ],
        pageNum: 1,
        pageSize: 100000
      })
        .then(rt => {
          if (rt.data.list.length > 0) {
            this.versionList = rt.data.list || [];
            let versionObj = this.versionList.find(
              val => val.isnewest === "Y"
            );
            if (versionObj) {
              this.bpaVersion = versionObj.bpaVersion
            }
          }
        })
        .catch(() => {
        });
    },
    getData () {
      this.pageLoading = true
      this.content=[]
        getPreviewApproversList(this.process)
        .then(rt => {
          if(rt.status === '200'){
            this.content = rt.data;
            this.noApprovalUserList = rt.data.filter(item => item.noApprovalUser===true||!item.userNames)
            if(this.noApprovalUserList.length>0){
               this.isShowTip = true
            }else{
               this.isShowTip = false
            }
            
          }else{
            this.$message.error(rt.message)
          }
          this.pageLoading = false;
        })
        .catch(() => {
          this.pageLoading = false;
        });
    },
    close(){
      this.dialogVisible = false
    },
    confirm () {
      this.dialogVisible = false
      this.$emit('confirm', true)
     
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-approval{
  .red-control{
    color:red;
  }
}
</style>
