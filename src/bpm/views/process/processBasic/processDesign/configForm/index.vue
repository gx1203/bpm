<template>
  <el-card shadow="never" id="configForm" v-loading="pageLoading">
    <el-row class="configForm">
      <el-col :span="12" class="button">
        <!-- <el-upload class="upload-demo"
         :action="action"
         name="file"
         ref="upload"
         :headers="headData"
         :show-file-list='false'
         :file-list="fileList"
         :before-upload="beforeAvatarUpload"
         :on-success="uploadSuccess"
         :on-error="uploadError"
          style="display: inline-block;margin-right: 10px;">
          <el-button type="primary">
            {{ $t('import') }}
          </el-button>
        </el-upload>
        <el-button type="primary" @click="handleClick($t('downloadTemplate'))">
          {{ $t('downloadTemplate') }}
        </el-button> -->
        <el-button type="primary" v-if="!$route.query.id" @click="handleClick($t('manualConfigurationForm'))">
          {{ $t('manualConfigurationForm') }}
        </el-button>
        <el-button type="primary" @click="handleClick($t('copy'))">
          {{ $t('copy') }}
        </el-button>
        <el-button type="primary" @click="handleClick($t('fieldPermissions'))">
          {{ $t('fieldPermissions') }}
        </el-button>
        <el-button type="primary" @click="handleClick($t('refresh'))">
          {{ $t('refresh') }}
        </el-button>
      </el-col>
      <el-col :span="24">
        <el-tabs v-model="editableTabsValue" type="card">
          <el-tab-pane key="1" :label="$t('configurationForm')" name="1">
            <custom-form :processData="processData" :nodeData="nodeData" ref="custom"></custom-form>
          </el-tab-pane>
          <el-tab-pane key="2" :label="$t('themeRules')"  name="2">
            <subject-config :content="content2" :formList="formList" :treeData="processData" @confirm="getSubjectrule" />
          </el-tab-pane>
          <el-tab-pane key="3" :label="$t('numberingRules')" name="3">
            <number-config :content="content3" :formList="formList" :treeData="processData" @confirm="getReqNoRule" />
          </el-tab-pane>
          <!-- <el-tab-pane key="4" :label="$t('otherInformation')" name="4">
            <other-info-config
              :content="content4"
              :formList="formList"
              :treeData="processData"
              @confirm="getOtherInfo"
            />
          </el-tab-pane> -->
        </el-tabs>
      </el-col>
    </el-row>
    <field-permissions-dialog v-model="dialogVisible" :id="processData.id" :treeData="{ version: processData.version}" :title="$t('fieldPermissions')" />
  </el-card>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapMutations, mapGetters } = createNamespacedHelpers("processDesign");
import customForm from "@/bpm/views/customForm";
import fieldPermissionsDialog from "@/bpm/views/process/processModeling/classificationModel/configurationFlow/workflowConfiguration/fieldPermissionsDialog";
import {
  getSubjectrule,
  getFieldList
} from "@/bpm/api/process/processModeling/subject_config";
import { getReqNoRule } from "@/bpm/api/process/processModeling/number_config";
import numberConfig from "@/bpm/views/process/processModeling/classificationModel/configurationFlow/workflowConfiguration/numberConfig";
import subjectConfig from "@/bpm/views/process/processModeling/classificationModel/configurationFlow/workflowConfiguration/subjectConfig";
import otherInfoConfig from "@/bpm/views/process/processModeling/classificationModel/configurationFlow/workflowConfiguration/otherInfoConfig";
import axios from 'axios'
export default {
  components: {
    numberConfig,
    subjectConfig,
    fieldPermissionsDialog,
    otherInfoConfig,
    customForm
  },
  watch: {
    editableTabsValue(val, newVal) {
      if (val === "2") {
        this.getSubjectrule();
      } else if (val === "3") {
        this.getReqNoRule();
      } else if (val === "4") {
        this.getOtherInfo();
      }
    }
  },
  computed: {
    ...mapGetters(["processData", "isCount"]),
    action () {
      return `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/processNodeConfig/loaddragform-by-excel/${this.processData.id}`
    }
  },
  data() {
    return {
      pageLoading: false,
      headData: {
        token: localStorage.getItem('token')
      },
      editableTabsValue: "1",
      content2: [],
      content4: [],
      formList: [],
      dialogVisible: false,
      content3: [],
      nodeData: null,
      fileList: []
    };
  },
  mounted() {
    if (this.$route.query.id) {
      this.setProcessData({
        id: this.$route.query.id,
        modelid: this.$route.query.modelid
      });
    }
  },
  methods: {
    ...mapMutations(["setProcessData","setIsCount"]),
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 100;
      if (!isLt2M) {
        this.$message.error(this.$t('hintText.uploadAttachmentSizeCannotExceed'))
      }
      if (isLt2M) {
        this.pageLoading = true
      }
      return isLt2M
    },
    uploadSuccess (file) {
      this.pageLoading = false
      if (file.status === '200') {
        this.$message.success(this.$t('hintText.importedSuccessfully'))
        this.nodeData = file.data
        this.setIsCount(100000)
      } else {
        this.$message.error(this.$t('hintText.importFileError'))
      }
    },
    uploadError (err) {
      // this.pageLoading = false
      // console.log(this.action)
      // this.$confirm('123', this.$t('hintText.hint'), {
      //   confirmButtonText: this.$t('confirm'),
      //   cancelButtonText: this.$t('cancel'),
      //   type: 'warning'
      // }).then(() => {
      //   console.log(this.$refs.upload)
      //   this.$refs.upload.submit()
      // }).catch(() => {})
      this.pageLoading = false
      if (err.message) {
        let data = JSON.parse(err.message)
        if (data.status === '600') {
          this.$confirm(data.message, this.$t('hintText.hint'), {
            confirmButtonText: this.$t('confirm'),
            cancelButtonText: this.$t('cancel'),
            type: 'warning'
          }).then(() => {
            this.$refs.upload.submit()
          }).catch(() => {})
          return
        }
      }
      this.$message.error(this.$t('hintText.importFileError'))
    },
    excelFile () {
      location.href = `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/datamanage/datadictionaryExport`
    },
    handleClick(type) {
      if (this.isCount > 0) {
        this.$confirm(this.$t('hintText.theContentFormChangedAreYouSureAboutOperation'), this.$t('hintText.hint'), {
          type: "warning"
        }).then(() => {
          this.setIsCount(0);
          if (type === this.$t('manualConfigurationForm')) {
            this.$router.push({
              path: "/process/processClassification/configurationFlow",
              query: {
                pid: this.processData.modelid,
                version: this.processData.version || ''
              }
            });
          } else if (type === this.$t('copy')) {
            this.$refs.custom.copyData();
          } else if (type === this.$t('downloadTemplate')) {
            this.downloadProcessNodeConfig();
          } else if (type === this.$t('fieldPermissions')) {
            this.dialogVisible = true;
          } else if (type === this.$t('refresh')) {
            if (this.editableTabsValue === "1") {
              this.$refs.custom.getStartProcessForm();
            } else if (this.editableTabsValue === "2") {
              this.getSubjectrule();
            } else if (this.editableTabsValue === "3") {
              this.getReqNoRule();
            } else if (this.editableTabsValue === "4") {
              this.getOtherInfo();
            }
          } else if (type === this.$t('import')) {

          }
        })
      } else {
        if (type === this.$t('manualConfigurationForm')) {
          this.$router.push({
            path: "/process/processClassification/configurationFlow",
            query: {
              pid: this.processData.modelid,
              version: this.processData.version || ''
            }
          });
        } else if (type === this.$t('copy')) {
          this.$refs.custom.copyData();
        } else if (type === this.$t('downloadTemplate')) {
          this.downloadProcessNodeConfig();
        } else if (type === this.$t('fieldPermissions')) {
          this.dialogVisible = true;
        } else if (type === this.$t('refresh')) {
          if (this.editableTabsValue === "1") {
            this.$refs.custom.getStartProcessForm();
          } else if (this.editableTabsValue === "2") {
            this.getSubjectrule();
          } else if (this.editableTabsValue === "3") {
            this.getReqNoRule();
          } else if (this.editableTabsValue === "4") {
            this.getOtherInfo();
          }
        }
      }
    },
    downloadProcessNodeConfig () {
      axios({
        method: 'get',
        url: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/processNodeConfig/download`,
        data: {
        },
        headers: {
          token: localStorage.getItem('token')
        },
        responseType: 'blob'
      }).then(res => {
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
        let url = window.URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', '模板.xls')
        document.body.appendChild(link)
        link.click()
      }).catch(() => {
        this.pageLoading = false
      })
    },
    getOtherInfo() {
      this.load = true;
      getSubjectrule({
        attr: {
          version: this.processData.version
        },
        filters: [
          {
            key: "processid",
            opt: "LIKE",
            type: "S",
            value: this.processData.id
          },
          {
            key: "generatetype",
            opt: "LIKE",
            type: "S",
            value: "2"
          }
        ],
        orderby: "sortid",
        sort: "asc"
      })
        .then(rt => {
          this.load = false;
          if (rt.status === "200") {
            this.load = false;
            this.content4 = rt.data.list;
            this.getFieldList();
          }
        })
        .catch(er => {
          this.load = false;
        });
    },
    getFieldList() {
      getFieldList(this.processData.id, {
        version: this.processData.version
      })
        .then(rt => {
          if (rt.status === "200") {
            this.formList = rt.data.filter(
              item => item.inputType !== "file" && item.inputType !== "nokt"
            );
          }
        })
        .catch(er => {
          this.load = false;
        });
    },
    getReqNoRule() {
      this.load = true;
      getReqNoRule({
        attr: {
          version: this.processData.version
        },
        filters: [
          {
            key: "processid",
            opt: "LIKE",
            type: "S",
            value: this.processData.id
          }
        ],
        orderby: "sort",
        sort: "asc"
      })
        .then(rt => {
          this.load = false;
          if (rt.status === "200") {
            this.load = false;
            this.content3 = rt.data.list;
             this.getFieldList();
          }
        })
        .catch(er => {
          this.load = false;
        });
    },
    getSubjectrule() {
      this.load = true;
      getSubjectrule({
        attr: {
          version: this.processData.version
        },
        filters: [
          {
            key: "processid",
            opt: "LIKE",
            type: "S",
            value: this.processData.id
          },
          {
            key: "generatetype",
            opt: "LIKE",
            type: "S",
            value: "1"
          }
        ],
        orderby: "sortid",
        sort: "asc"
      })
        .then(rt => {
          this.load = false;
          if (rt.status === "200") {
            this.load = false;
            this.content2 = rt.data.list;
             this.getFieldList();
          }
        })
        .catch(er => {
          this.load = false;
        });
    }
  }
};
</script>
<style lang="scss">
#configForm {
  .configForm {
    position: relative;
    left: 0;
    .button {
      text-align: right;
      position: absolute;
      right: 50px;
      top: 10px;
      z-index: 1000;
    }
  }
}
</style>
