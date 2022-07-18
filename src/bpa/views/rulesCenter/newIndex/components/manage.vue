<template>
  <div class="w100">
    <div style="display:flex;justify-content:flex-end;" v-if="isEdit">
      <el-row style="flex:1">
      <el-button type="primary" @click.native="seeFullContent">全文预览
      </el-button>
      <el-button type="primary" @click.native="seeCentent">制度正文</el-button>
    </el-row>
    <el-row class="text-right" style="flex:1">
      <!-- 刷新 -->
      <!-- <el-button @click="queryContent">{{ $t("refresh") }}</el-button> -->
      <!-- 编辑 -->
       <!-- :disabled="!editContent.content && !editContent.childrens" -->
      <el-button
        @click="officeClick('edit')"
        >{{ $t("edit") }}</el-button
      >
      <!-- 引用 -->
      <el-button @click="selectRules" >{{ $t("quote") }}</el-button>
      <!-- word上传 -->
      <el-upload
        :action="action"
        accept=".doc,.docx"
        :on-success="handlerFileUploadSuccess"
        :show-file-list="false"
        class="inline-block margin-r10 margin-l10"
      >
        <el-button size="mini">{{ $t("UploadTheWord") }}</el-button>
      </el-upload>
      <!-- 新建 -->
      <el-button type="primary" @click="officeClick('new')">{{
        $t("newAdd")
      }}</el-button>
    </el-row>
    </div>

    <div class="iframeWord">
      <iframe :src="wordIframe" frameborder="0"></iframe>
      <div class="viewDoc">
        <h1 class="docTitle">
          {{ editContent.content }}
        </h1>
        <manage-father :data="editContent.childrens" />
      </div>
    </div>
    <!-- 选择流程 -->
    <!-- <select-process
      v-model="isSelectVisible"
      :processlists="processlists"
      :modelId="treeId"
      :selectType="true"
      @confirm="confirmprocess"
    ></select-process> -->
    <!-- 选择规章制度 -->

    <selectRulesForQuote v-model="rulesVisible" :ruleSelected="ruleSelected" @confirm="selectRuleConfirm" />

  </div>
</template>
<script>
import { getGroupTreeList } from "@/bpa/api/componentsApi";
// import { queryContent } from '@/bpa/api/processDesignCenter'
import {
  manageContentMethods,
  getRegulationById
} from "@/bpa/api/rulesCenter/handbookFiles";
// import selectProcess from "./selectProcess.vue";

import manageFather from "./manage_father.vue";
// import selectRulesForQuote from "./selectRulesForQuote.vue";
import data from '../../../../../bpm/views/home/data';

export default {
  name: "manage",
  components: {
    // selectProcess,
    manageFather,
    // selectRulesForQuote
    selectRulesForQuote: () => import('./selectRulesForQuote.vue')
  },
  data() {
    return {
      rulesVisible: false,
      isSelectVisible: false,
      processlists: [],
      wordIframe: "",
      editContent: {},
      docId: "",
      ruleSelected: [],

    };
  },
  props: {
    treeId: {
      type: String,
      default: "",
    },
    // dmId: {
    //   type: String,
    //   default: "",
    // },
    docid: {
      type: String,
      default: "",
    },
    fileid: {
      type: String,
      default: "",
    },
    attrsForm:{
      type: Object,
      default: "",
    },
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL;
    },
    base_url() {
      return process.env.VUE_APP_BASE_URL;
    },
    action() {
      return `${this.host}/regulation/upload?username=${this.userid}`;
      // return `${this.host}/mangercenterdoc/uploadCopy?username=${this.userid}`
    },
    userid() {
      return JSON.parse(localStorage.getItem("portalCurrentUserInfo") || "{}")
        .empuid;
    },
  },
  mounted() {
    this.queryContent();
  },
  watch: {},
  methods: {
    selectRules(){
      this.ruleSelected = []
      this.rulesVisible = true
    },
    selectRuleConfirm(arr) {
      console.log(arr);
      if (arr[0].rules == "N") {
        this.$message({
          message: "该流程目前暂时没有制度文件",
          type: "error",
        });
        return false;
      }
      this.wordIframe = "";
      this.processlists = JSON.parse(JSON.stringify(arr));
      console.log(this.processlists);
      // console.log(dmId);
      let iframe = `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/pageOffice/dmIndex?type=cite&fromDmId=${this.docid}&toDmId=${this.docid}&username=${this.userid}&serverContextPath=${this.base_url}`;
      // if (!this.wordIframe) {
      //   this.wordIframe = iframe
      //   return false
      // }
      this.$confirm("确认替换已有的编辑内容吗?", this.$t("hintText.hint"), {
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
        type: "warning",
      }).then(() => {
        this.wordIframe = iframe;
        console.log(this.wordIframe)
      });
    },

    //全局预览接口
    seeFullContent(){
      console.log("0000000000000")
      this.wordIframe = "";
      let iframe = `${this.host}/document/print/${this.docid}`;
      window.open(iframe)
      console.log(iframe, '_blank')
      // if (!this.wordIframe) {
      //   this.wordIframe = iframe
      //   return false
      // }
      // console.log(this.docid)
      // this.$confirm("确认要查看全文吗?", this.$t("hintText.hint"), {
      //   confirmButtonText: this.$t("confirm"),
      //   cancelButtonText: this.$t("cancel"),
      //   type: "warning",
      // }).then(() => {
      //   this.wordIframe = iframe;
      // });
    },

    seeCentent(){
      this.queryContent()

    },
    handlerFileUploadSuccess(res) {
      console.log(res);
      let iframe = `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/pageOffice/dmIndex?type=upload&dmId=${this.docid}&fileId=${res.data.id}&username=${this.userid}&serverContextPath=${this.base_url}`;
      console.log(res.data.id);
      // console.log(fileid)
      // if (!this.wordIframe) {
      //   this.wordIframe = iframe
      //   return false
      // }
      this.$confirm("确认替换已有的编辑内容吗?", this.$t("hintText.hint"), {
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
        type: "warning",
      }).then(() => {
        console.log(res);
        // console.log(this.fileid);
        this.wordIframe = iframe;
        // console.log(this.wordIframe)
      });
    },
    officeClick(type) {
      console.log(type);
      console.log(this.wordIframe);
      this.wordIframe = "";
      switch (true) {
        case type === "new":
          let iframe = `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/pageOffice/dmIndex?type=new&dmId=${this.docid}&username=${this.userid}&serverContextPath=${this.base_url}`;
          // if (!this.wordIframe) {
          //   this.wordIframe = iframe
          //   return false
          // }
          this.$confirm("确认替换已有的编辑内容吗?", this.$t("hintText.hint"), {
            confirmButtonText: this.$t("confirm"),
            cancelButtonText: this.$t("cancel"),
            type: "warning",
          }).then(() => {
            this.wordIframe = iframe;
          });
          console.log(fileid)
          console.log(this.fileid)
          break;
        case type === "edit":
      this.$nextTick(() => {
        getRegulationById(this.docid).then(res => {
          console.log(res)
          if (!res) return false
          if ((!this.attrsForm.fileList || this.attrsForm.fileList.length === 0) && res.docFile && res.docFile.length > 0) {
            this.attrsForm.fileList.push({
              originalname: res.docFile[0].originalname,
              filesize: res.docFile[0].fileSize + 'B',
              downloadUrl: this.host + '/regulation/download/' + res.docFile[0].id,
              status: this.$t('uploaded'),
              id: res.docFile[0].id
            })
          }
          const fileId = res.tempfileid ? res.tempfileid : this.attrsForm.fileList && this.attrsForm.fileList.length > 0 ? this.attrsForm.fileList[0].id : res.fileId ? res.fileId : ''
          this.wordIframe = `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/pageOffice/dmIndex?type=edit&dmId=${this.docid}&fileId=${fileId}&username=${this.$store.state.basuser.user.id}&serverContextPath=${process.env.VUE_APP_BASE_URL}`
        })
      })
          // this.wordIframe = `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/pageOffice/dmIndex?type=edit&dmId=${this.docid}&fileId=${fileid}&username=${this.$store.state.basuser.user.id}&serverContextPath=${process.env.VUE_APP_BASE_URL}`;
          break;
      }
    },
    // 获取在线编辑的数据
    queryContent() {
      manageContentMethods(this.docid).then((res) => {
        if (!res) return false;
        console.log(res);
        this.editContent = res;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.iframeWord {
  width: 100%;
  height: 500px;
  padding-top: 15px;
  iframe {
    width: 100%;
    height: inherit;
    display: none;
  }
  .viewDoc {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .docTitle {
    font-size: 20px;
    text-align: center;
    line-height: 32px;
  }
}
.text-right{
  text-align: right;
}
.el-button{
  background-color: #2D42AF;
  color: white;
}
</style>
