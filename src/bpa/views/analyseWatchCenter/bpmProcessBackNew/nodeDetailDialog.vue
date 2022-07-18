<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="80%"
    top="2vh" class="node-detail">
    <el-tabs type="card"  v-model="activeName"   class='topCustom'>
      <el-tab-pane :label="$t('nodeComparison')" name="1">
        <el-image :src="imgUrl" fit="fill" v-if="imgUrl" :preview-src-list="[imgUrl]">
        </el-image>
        <iframe :src="processUrl" v-if="processUrl" id="ifra" frameborder="0"/>
      </el-tab-pane>
      <el-tab-pane :label="$t('nodeRecord')" name="2">
        <el-table v-loading="pageLoading" :data="tableData" border
          style="margin-bottom: 10px">
          <el-table-column type="index" width="50" :label="number"></el-table-column>
          <el-table-column prop="activityName" :label="nodesInThisProcess" align="center"></el-table-column>
          <el-table-column prop="processCnname" :label="ruleConfigurationNode" align="center">
             <template slot-scope="scope">
                <div>{{scope.row.definded ? ' √ ':''}}</div>
              </template>
          </el-table-column>
          <el-table-column prop="subject" :label="actualOperationNode" align="center">
             <template slot-scope="scope">
                <div>{{scope.row.runned ? ' √ ':''}}</div>
              </template>
          </el-table-column>
          </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import InstanceImagePage from "@/bpm/components/InstanceImagePage";
import {
  getFlowType,
  getProcessImgType,
} from "@/bpm/api/app";
import {
  getProcessRecovery 
} from '@/bpa/api/analyseWatchCenter'
export default {
  components: {
    InstanceImagePage
  },
  data () {
    return {
      activeName: '1',
      dialogVisible: false,
      imgUrl: "",
      processUrl: "",
      processId: "",
      alreadyNameData: "",
      version:'',
      tableData: [],
      pageLoading: false,
      number:this.$t("number"),
      nodesInThisProcess:this.$t("nodesInThisProcess"),
      ruleConfigurationNode:this.$t("ruleConfigurationNode"),
      actualOperationNode:this.$t("actualOperationNode"),
    }
  },
  props: {
    value: {
      type: Boolean
    },
    instanceId:{
      type:String,
      default:''
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
      this.getProcessRecovery()
      if (val) {
        this.processUrl = "";
        this.getType();
      } else {
        this.imgUrl = "";
      }
    },
    dialogVisible (val) {
      this.$emit('input', val)
    },
  },
  methods: {
    getProcessRecovery(){
      this.pageLoading = true
       getProcessRecovery({instanceId:this.instanceId}).then((res) => {
        this.pageLoading = false
        if (!res) return false;
        this.tableData = res;
      })
    },
    getType () {
      let than = this
      than.dialogLoading = true;
      getFlowType(this.instanceId)
        .then(rt => {
          if (rt.status === "200") {
            let _data = rt.data.split(";");
            this.isBusinessFlow = _data[0]
            this.processId = _data[1]
            this.version = _data[2]
            this.alreadyNameData = _data[3]
            than.getInstanceImage();
          }
        })
        .catch(() => {
          than.dialogLoading = false;
        });
    },
    getInstanceImage () {
      let that = this;
      if (!that.processId) return;
      that.dialogLoading = false;
      getProcessImgType().then(rt => {
        if (rt.data === "bpa") {
          that.processUrl = `${process.env.VUE_APP_BPA_URL
            }/leftMenu/processNodeChart/BaseNewPage.html?id=${that.processId
            }&testNameData=${escape(that.alreadyNameData)}&version=${that.version}&instanceId=${that.instanceId}&showChart=yes`
        } else {
          that.dialogLoading = true;
          axios
            .get(
              `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/bpm/process/instanceImage/${this.instanceId}`,
              {
                responseType: "arraybuffer",
                headers: {
                  token: localStorage.getItem("token")
                }
              }
            )
            .then(rt => {
              this.dialogLoading = false;
              this.imgUrl =
                "data:image/png;base64," +
                btoa(
                  new Uint8Array(rt.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ""
                  )
                );
            })
            .catch(() => {
              this.dialogLoading = false;
            });
        }
      });
    },
    close(){
      this.dialogVisible = false
    },
    // confirm () {
    //   this.dialogVisible = false
    //   this.$emit('confirm', true)
    // }
  }
}
</script>

<style lang="scss" scoped>
.node-detail{
  min-width:80vw;
  .el-tabs__content{
    height:70vh;
    min-height:70vh;
  }
  iframe {
    width: calc(100% - 1px);
    border-left: 1px solid #dedede;
    height: 69vh;
  }
  img {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
