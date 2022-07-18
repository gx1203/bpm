<template>
  <div class="w100">
    <el-row>
      <el-col :span="24">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="existTabField('relatedAccessory', '', true)" name="first">
            <el-row class="margin-b15">
              <el-col :span="4" :offset="20" class="clear-fix">
                <el-button class="float-r" @click="resetsupport();isFileVisible = true" type="primary">{{$t('selectAttachment')}}</el-button>
              </el-col>
            </el-row>
            <el-table :data="lists1" class="main_tab" stripe>
              <el-table-column :label="existTabField('ordinal', '', true)" type="index"></el-table-column>
              <!-- <el-table-column prop="name" :label="$t('fileName')"></el-table-column> -->

              <el-table-column prop="name" :label="existTabField('fileName', '', true)">
                <template slot-scope="scope">
                  <a :href="viewFileHandle(scope.row.docid)" target="_blank">{{scope.row.name}}</a>
                  <!-- <a class="margin-l5" :href="downloadFileHandle(scope.row.docid)" target="_blank">
                    
                  </a>-->
                </template>
              </el-table-column>

              <el-table-column prop="createby" :label="existTabField('uploader', '', true)"></el-table-column>
              <el-table-column prop="createon" :label="existTabField('uploadTime', '', true)"></el-table-column>
              <el-table-column prop="foldername" :label="existTabField('fileType', '', true)"></el-table-column>
              <el-table-column prop="description" :label="existTabField('Comments', '', true)"></el-table-column>
              <el-table-column width="80" :label="$t('operation')">
                <template slot-scope="scope">
                  <el-tooltip v-if="scope.row.foldername === $t('OtherDocumentsRelatedToTheProcess')" class="item" effect="dark"
                    :content="$t('delete')" placement="top">
                    <el-button :disabled="!noEditing" class="no-border" icon="el-icon-delete" type="text" @click="delFile(scope.row)">
                    </el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page.sync="pages.pageNum"
              :page-size="pages.pageSize"
              background
              layout="prev, pager, next, jumper, total"
              :total="pages.total"
            ></el-pagination>
          </el-tab-pane>
          <el-tab-pane :label="$t('BasedOnTheRevisionOfThe')" name="second">
            <el-table :data="list2Data" class="main_tab">
              <el-table-column :label="$t('number')" type="index"></el-table-column>
              <el-table-column prop="content" :label="$t('informationContent')"></el-table-column>
              <el-table-column prop="sourcefrom" :label="$t('informationSource')"></el-table-column>
              <el-table-column prop="username" :label="$t('creator')"></el-table-column>
              <el-table-column prop="deptname" :label="$t('CreateADepartment')"></el-table-column>
              <el-table-column prop="createon" :label="$t('createTime')"></el-table-column>
              <el-table-column prop="status" :label="$t('state')">
                <template slot-scope="scope">
                  <span>{{scope.row.status == '2'?$t('haveBeenVoided') : $t('HaveSynchronous')}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('relevantDOcument')">
                <template slot-scope="scope">
                  <span
                    :class="{'fileName':scope.row.status == '1','fileName2':scope.row.status == '2'}"
                    @click="previewFile(scope.row)"
                  >{{scope.row.docFile[0].originalName}}</span>
                  <span>
                    <i
                      class="el-icon-download"
                      :class="{'fileName':scope.row.status == '1','fileName2':scope.row.status == '2'}"
                      @click="downloadFile(scope.row)"
                    ></i>
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <!-- 相关附件弹框 -->
    <el-dialog
      class="supportDialog"
      width="60%"
      :visible.sync="isFileVisible"
      :before-close="handlesupportClose"
      :append-to-body="true"
    >
      <template slot="title">
        <div class="clear-fix">
          <span class="font14">{{$t('AddingSupportFiles')}}</span>
          <!-- <el-button class="float-r" size="large" type="text" @click="savesupport">保存</el-button> -->
        </div>
      </template>
      <el-form label-width="110px" label-position="right" ref="supportRef" :model="supportform" :rules="supportsrules">
        <el-form-item :label="$t('fileType')+':'" prop="fileType">
          <el-select v-model="supportform.fileType" :placeholder="$t('pleaseSelect')" disabled>
            <el-option
              v-for="item in filetypes"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('remarks')" prop="remarks">
          <el-input type="textarea" rows="5" resize="none" v-model="supportform.remarks"></el-input>
        </el-form-item>
        <el-form-item :label="$t('attachment')" prop="supportFile">
          <el-row>
            <el-col :span="20" class="minHeight28">
              <p class="showFiles processCommon">
                <span
                  class="margin-b5 margin-r5"
                  style="    background: #2d42af; color: white;"
                  v-for="(item, index) in supportform.supportFile"
                  :key="item.docid"
                >
                  {{item.name}}
                  <i
                    class="el-icon-close cursor-pointer"
                    @click="delsupportFile(item, index)"
                  ></i>
                </span>
              </p>
            </el-col>
            <el-col :span="4">
              <el-button :disabled="!noEditing" class="float-r" @click="isGroupVisible = true">{{$t('select')}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
       <span slot="footer" class="dialog-footer">
    <el-button @click="isFileVisible = false">{{$t('cancel')}}</el-button>
    <el-button :disabled="!noEditing" type="primary" @click="savesupport">{{$t('confirm')}}</el-button>
  </span>
    </el-dialog>

    <!-- 添加附件 -->
    <select-file v-model="isGroupVisible" :pageId="forlderId" @confirm="handlerSelect"></select-file>
  </div>
</template>
<script>
import { getRevisionSystemList } from "@/bpa/api/componentsApi";
import { deluploadFile } from "@/bpa/api/common";
import {
  delSupport,
  saveFile,
  saveRulefile,
  getsupportFile
} from "@/bpa/api/processDesignCenter";
import {
  getRecordlist
  // getRecordlist2
} from '@/bpa/api/processDesignCenter'
import paginations from "@/bpa/mixins/pagination_mixin";

import { viewFile, downloadFile } from "@/bpa/utils/common";

const filetypes = [
  {
    label: "流程输出文件",
    id: "7A88687D266A3D7CE053BF1A13ACD2C3"
  },
  {
    label: "其他流程相关文件",
    id: "7A88EC3856C446EBE053BF1A13ACC390"
  },
  {
    label: "输入",
    id: "7B4DBBED904B1C5DE053BF1A13AC64F1"
  },
  {
    label: "输出",
    id: "7B4DBBED904E1C5DE053BF1A13AC64F1"
  },
  {
    label: "QMS",
    id: "7B000C586A5D3A31E053BF1A13AC8D0A"
  },
  {
    label: "EMS",
    id: "7B000D65C18D3A0DE053BF1A13AC5F6B"
  },
  {
    label: "OHSAS",
    id: "7B000C586A603A31E053BF1A13AC8D0A"
  },
  {
    label: "EnMs",
    id: "7B3D9B5F12664172E053BF1A13AC131E"
  },
  {
    label: "业务规则",
    id: "7BC636EDF11967C0E0530701A8C06A7D"
  },
  {
    label: "流程输入文件",
    id: "6CCAFE3781CA4875E053BF1A13AC0E97"
  }
];
export default {
  name: "author",
  data() {
    return {
      activeName: "first",
      isFileVisible: false,
      lists1: [],
      list2Data: [],
      lists3: [],
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      supportDelFile: [],
      supportform: {
        fileType: "7A88EC3856C446EBE053BF1A13ACC390",
        remarks: "",
        supportFile: []
      },
      recordlist: [],
      supportsrules: {
        fileType: [{ required: true, message: " ", trigger: "blur" }],
        remarks: [{ required: true, message: " ", trigger: "blur" }],
        supportFile: [{ required: true, message: " ", trigger: "blur" }]
      },
      // 文件类型
      filetypes,
      // 业务规则
      isruleVisible: false,
      isGroupVisible: false,
      // 组件附件的调用参数
      forlderId: "7A88EC3856C446EBE053BF1A13ACC390",
      viewFileUrl: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/document/print/`,
      downloadFileUrl: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/regulation/download/`
    };
  },
  props: {
    showtabfiled: {
      type: Array,
      default: () => []
    },
    treeId: {
      type: String,
      default: ""
    },
    modelid: {
      type: String,
      default: ""
    },
    bpmid: {
      type: String,
      default: ""
    },
    version: {
      type: String,
      default: ""
    },
    noEditing: {
      type: Boolean,
      default: false,
    }
  },
  mixins: [paginations],
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL;
    },
    action() {
      return `${this.host}/mangercenterdoc/uploadCopy?username=${this.userid}`;
    },
    download() {
      return this.host + "/regulation/download/";
    },
    viewfile() {
      return this.host + "/document/print/";
    },
    userid() {
      return JSON.parse(localStorage.getItem("portalCurrentUserInfo") || "{}")
        .empuid;
    },
    username() {
      return JSON.parse(localStorage.getItem("portalCurrentUserInfo") || "{}")
        .cnname;
    }
  },
  watch: {
    'showtabfiled'(val) {
      console.log(val)
      this.getRecord()
    }
  },
  mounted() {
    this.getSupportFile(1);
  },
  methods: {
    // 判断条件
    existTabField(pname, type, bool) {
      let obj = {}
      this.showtabfiled.forEach(item => {
        if (item.pname === pname) {
          obj = JSON.parse(JSON.stringify(item))
          return false
        }
      })
      if (type == 'refer') {
        // console.log(!!obj.pname)
        return !!obj.pname
      } else if (type == 'necessary') {
        return obj.necessary == '1'
      } else {
        return !obj.pname ? '' : obj.name + (!bool ? ':' : '')
      }
    },
    getRecord() {
      getRecordlist(this.modelid).then(res => {
        console.log(res)
        this.recordlist = res
      })
    },
    // 下载文件
    downloadFileHandle(fileId) {
      return downloadFile(fileId);
    },
    // 预览文件
    viewFileHandle(fileId) {
      return viewFile(fileId);
    },
    // 获取流程支持文件
    getSupportFile(pageNum) {
      getsupportFile({
        attr: {},
        filters: [{ key: "modelid", value: this.modelid }],
        orderby: "createon",
        pageNum: !pageNum ? 1 : this.pages.pageNum,
        pageSize: 10,
        sort: "desc"
      }).then(res => {
        console.log("初始化数据", res);
        this.lists1 = res.list;
        this.pages.total = res.total;
      });
    },
    getList2() {
      getRevisionSystemList({
        pagenum: this.pages.pageNum,
        pagesize: this.pages.pageSize,
        id: this.modelid
      }).then(res => {
        if (!res) return false;
        console.log(res);
        this.list2Data = res.list;
        console.log(this.list2Data);
      });
    },
    getList3() {
      console.log(1);
    },
    handleClick(tab, event) {
      console.log(tab);
      let self = this;
      if (tab.name == "second") {
        self.getList2();
      } else if (tab.name == "third") {
        self.getList3();
      }
    },
    handleCurrentChange(val) {
      this.pages.pageNum = val;
      this.getSupportFile(val);
    },
    // 上传附件
    resetsupport() {
      this.supportform = {
        fileType: "7A88EC3856C446EBE053BF1A13ACC390",
        remarks: "",
        supportFile: []
      };
    },
    // 弹出框关闭
    async handlesupportClose(done) {
      let self = this;
      if (self.supportDelFile.length > 0) {
        let res = await this.deletefile(self.supportDelFile.join(","));
      }
      done();
    },
    // 删除document接口的文件
    async deletefile(ids) {
      let res = await deluploadFile(ids);
      return new Promise((resolve, reject) => {
        resolve();
      });
    },
    delFile(item) {
      console.log(item);
      this.$confirm("确认要删除该文件?", this.$t("hintText.hint"), {
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
        type: "warning"
      })
        .then(async () => {
          let res = await delSupport(item.id);
          let res2 = await deluploadFile(item.docid);
          let pages = this.pages.pageNum;
          console.log(pages);
          this.getSupportFile(pages);
          this.$message({
            type: "success",
            message: this.$t("hintText.successfullyDelete")
          });
        })
        .catch(() => {});
    },
    savesupport() {
      let self = this;
      this.$refs.supportRef.validate(valid => {
        if (valid) {
          saveFile({
            doclist: [
              {
                description: this.supportform.remarks,
                docs: this.supportform.supportFile,
                folderid: this.supportform.fileType,
                modelid: this.modelid
              }
            ]
          }).then(res => {
            console.log(res);
            this.$message({
              message: "添加成功!",
              type: "success"
            });
            this.getSupportFile(1);
            self.isFileVisible = false;
          });
        } else {
          this.$message({
            message: "备注或者附件不能为空!",
            type: "warning"
          });
          return false;
        }
      });
    },
    delsupportFile(item, index) {
      this.supportform.supportFile.splice(index, 1);
      if (!!item.type && item.type === "upload") {
        this.supportDelFile.push(item.docid);
      }
    },
    saveRule() {
      let self = this;
      this.$refs.supportRef.validate(valid => {
        if (valid) {
          saveRulefile({
            attatch: this.ruleform.ruleFile,
            bpo: "diq",
            listid: this.modelid,
            param1: "翟青/一汽-大众汽车有限公司",
            rule: this.ruleform.rule
          }).then(res => {
            console.log(res);
            self.isruleVisible = false;
            this.$message({
              message: "添加成功!",
              type: "success"
            });
            this.getRule(1);
          });
        } else {
          this.$message({
            message: "规则或者附件不能为空!",
            type: "warning"
          });
          return false;
        }
      });
    },
    handlerSelect(obj) {
      console.log(obj);
      let self = this;
      console.log(111);
      if (obj.selectedList.length > 0) {
        obj.selectedList.forEach(item => {
          self.supportform.supportFile.push({
            name: item.name,
            docid: item.docid
          });
        });
      }
      if (obj.uploadfiles.length > 0) {
        obj.uploadfiles.forEach(item => {
          self.supportform.supportFile.push({
            name: item.newName,
            docid: item.id
          });
        });
      }
    },
    previewFile(value) {
      console.log(value);
      if (value.status == "2") {
        this.$message({
          message: "该修编依据已作废，暂时不支持预览和下载",
          type: "warning"
        });
        return false;
      } else {
        let fileUrl = this.viewFileUrl + value.document[0].ID;
        console.log(fileUrl);
        window.open(fileUrl, "_blank");
      }
    },
    downloadFile(value) {
      console.log(value);
      if (value.status == "2") {
        this.$message({
          message: "该修编依据已作废，暂时不支持预览和下载",
          type: "warning"
        });
        return false;
      } else {
        let fileUrl = this.downloadFileUrl + value.docFile[0].id;
        window.open(fileUrl, "_blank");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.minHeight28 {
  min-height: 28px;
}
.minHeight35 {
  min-height: 35px;
}
.el-dialog__header {
  .el-button {
    padding: 0 8px;
    margin-right: 15px;
  }
}
.fileName {
  color: #409eff;
  cursor: pointer;
}
.fileName2 {
  color: #ccc;
  cursor: pointer;
}
/deep/.el-button:hover,
.el-button:focus {
  background-color: #2d42af !important;
  color: #fff !important;
}
</style>
