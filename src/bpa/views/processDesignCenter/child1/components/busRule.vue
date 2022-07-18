<template>
  <div class="w100">
    <el-row class="margin-b15">
      <el-col :span="6" :offset="18" class="clear-fix">
        <el-button
          class="float-r margin-l10"
          v-if="existTabField('batchDelete', 'refer')"
          :disabled="selrulelist.length == 0 || !noEditing"
          @click="delRule"
        >
          {{ existTabField("batchDelete", "", true) }}</el-button
        >
        <el-button :disabled="!noEditing"
          class="float-r"
          type="primary"
          v-if="existTabField('addAttach', 'refer')"
          @click="
            resetrules();
            isruleVisible = true;
          "
          >{{ existTabField("addAttach", "", true) }}</el-button
        >
      </el-col>
    </el-row>
    <el-table
      :data="rulelist"
      class="main_tab"
      @selection-change="handleruleChange"
      stripe
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column
        :label="existTabField('number', '', true)"
        type="index"
        width="50"
      ></el-table-column>
      <el-table-column
        prop="rule"
        width="200"
        :label="existTabField('rule', '', true)"
      ></el-table-column>
      <el-table-column
        v-if="existTabField('file', 'refer')"
        :label="existTabField('file', '', true)"
      >
        <template slot-scope="scope">
          <p class="showFiles commonpadding alink">
            <span
              class="margin-r5 margin-b5"
              v-for="file in scope.row.attatch"
              :key="file.id"
            >
              <a :href="viewFile(file.id)" target="_blank">{{ file.name }}</a>
              <a
                class="margin-l15"
                :href="downloadFile(file.id)"
                target="_blank"
              >
                
              </a>
            </span>
          </p>
        </template>
      </el-table-column>
      <!-- <el-table-column width="120" :label="$t('operation')">
        <template slot-scope="scope">
          <el-tooltip v-if="true" class="item" effect="dark" :content="$t('delete')" placement="top">
            <el-button class="no-border" icon="el-icon-delete" type="text"></el-button>
          </el-tooltip>
        </template>
      </el-table-column> -->
    </el-table>
    <el-pagination
      @current-change="handleRuleChange"
      :current-page="rulepages.pageNum"
      background
      layout="prev, pager, next, jumper, total"
      :total="rulepages.total"
    ></el-pagination>

    <!-- 业务规则 -->
    <el-dialog
      :title="existTabField('addBusinessRules', '', true)"
      :visible.sync="isruleVisible"
      :append-to-body="true"
    >
      <el-form
        label-width="110px"
        label-position="right"
        ref="ruleRef"
        :model="ruleform"
        :rules="rulerules"
      >
        <el-form-item
          class="label-height-auto"
          v-if="existTabField('ruleDialog', 'refer')"
          :label="existTabField('ruleDialog')"
          prop="rule"
        >
          <el-input
            type="textarea"
            v-model="ruleform.rule"
            rows="6"
            resize="none"
          ></el-input>
        </el-form-item>
        <el-form-item
          class="label-height-auto"
          v-if="existTabField('c_attachmentRule', 'refer')"
          :label="existTabField('c_attachmentRule')"
          prop="ruleFile"
        >
          <el-row>
            <el-col :span="20" class="minHeight28">
              <p class="showFiles processCommon">
                <span
                  class="margin-r10 margin-b10"
                  v-for="(item, index) in ruleform.ruleFile"
                  :key="item.id"
                >
                  {{ item.name }}
                  <i
                    class="el-icon-close cursor-pointer"
                    @click="delRuleFile(item, index)"
                  ></i>
                </span>
              </p>
            </el-col>
            <el-col :span="4">
              <el-button class="float-r" @click="isGroupVisible = true">{{
                $t("placeholderText.select")
              }}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isruleVisible = false">{{ $t("cancel") }}</el-button>
        <el-button type="primary" @click="saveRule">{{
          $t("confirm")
        }}</el-button>
      </span>
    </el-dialog>

    <!-- 添加附件 -->
    <select-file
      v-model="isGroupVisible"
      :pageId="forlderId"
      @confirm="handlerSelect"
    ></select-file>
  </div>
</template>
<script>
import {
  getRulelist,
  saveRulefile,
  delRuleFile,
} from "@/bpa/api/processDesignCenter";

import { deluploadFile } from "@/bpa/api/common";

import fileOperation from "@/bpa/mixins/fileDownView";

export default {
  name: "busRule",
  data() {
    return {
      isruleVisible: false,
      rulelist: [],
      rulepages: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      ruleform: {
        rule: "",
        ruleFile: [],
      },
      rulerules: {
        rule: [{ required: true, message: " ", trigger: "blur" }],
        ruleFile: [{ required: true, message: " ", trigger: "blur" }],
      },
      selrulelist: [],
      isGroupVisible: false,
      forlderId: "7BC636EDF11967C0E0530701A8C06A7D",
    };
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL;
    },
    download() {
      return this.host + "/attach/download/";
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
    },
  },
  props: {
    showtabfiled: {
      type: Array,
      default: () => [],
    },
    modelid: {
      type: String,
      default: "",
    },
    noEditing: {
      type: Boolean,
      default: false,
    }
  },
  mixins: [fileOperation],
  watch: {
    showtabfiled(val) {
      console.log(val);
      this.getRule(1);
    },
  },
  methods: {
    // 判断条件
    existTabField(pname, type, bool) {
      let obj = {};
      this.showtabfiled.forEach((item) => {
        if (item.pname === pname) {
          obj = JSON.parse(JSON.stringify(item));
          return false;
        }
      });
      let lang = localStorage.getItem("language");
      if (type == "refer") {
        return !!obj.pname;
      } else if (type == "necessary") {
        return obj.necessary == "1";
      } else {
        return obj.pname && lang === "cn"
          ? obj.name + (!bool ? ":" : "")
          : obj.pname && lang === "en"
          ? obj.enname + (!bool ? ":" : "")
          : obj.enname + (!bool ? ":" : "");
      }
    },
    getRule(pageNum) {
      getRulelist({
        filters: [{ key: "listid", value: this.modelid }],
        orderby: "createon",
        pageNum: !pageNum ? 1 : pageNum,
        pageSize: 10,
        sort: "desc",
      }).then((res) => {
        console.log(res);
        this.rulelist = res.list;
        this.rulepages.total = res.total;
      });
    },
    handleRuleChange(val) {
      this.rulepages.pageNum = val;
      this.getRule(val);
    },
    delRuleFile(item, index) {
      this.ruleform.ruleFile.splice(index, 1);
      if (!!item.type && item.type === "upload") {
        this.deletefile(item.docid);
      }
    },
    saveRule() {
      let self = this;
      this.$refs.ruleRef.validate((valid) => {
        if (valid) {
          saveRulefile({
            attatch: this.ruleform.ruleFile,
            bpo: "diq",
            listid: this.modelid,
            param1: "翟青/一汽-大众汽车有限公司",
            rule: this.ruleform.rule,
          }).then((res) => {
            console.log(res);
            self.isruleVisible = false;
            this.$message({
              message: this.existTabField("addedSuccessfully", "", true),
              type: "success",
            });
            this.getRule(1);
          });
        } else {
          this.$message({
            message: this.existTabField(
              "rulesOrAttachmentsCannotBeEmpty",
              "",
              true
            ),
            type: "warning",
          });
          return false;
        }
      });
    },
    resetrules() {
      this.ruleform = {
        rule: "",
        ruleFile: [],
      };
    },
    handleruleChange(val) {
      this.selrulelist = val;
    },
    delRule() {
      let arr = this.selrulelist.map((item) => {
        return item.id;
      });

      this.$confirm(
        this.existTabField("areYouSureDeleteTheSelectedRule", "", true),
        this.$t("hintText.hint"),
        {
          confirmButtonText: this.$t("confirm"),
          cancelButtonText: this.$t("cancel"),
          type: "warning",
        }
      )
        .then(async () => {
          let res = await delRuleFile(arr.join(","));
          this.getRule(this.rulepages.pageNum);
          this.$message({
            type: "success",
            message: this.$t("hintText.successfullyDelete"),
          });
        })
        .catch(() => {});
    },
    // 删除document接口的文件
    async deletefile(ids) {
      let res = await deluploadFile(ids);
      return new Promise((resolve, reject) => {
        resolve();
      });
    },
    handlerSelect(obj) {
      let self = this;
      console.log(111);
      obj.uploadfiles.map((item) => {
        this.ruleform.ruleFile.push({
          attatchid: item.id,
          docid: item.id,
          id: item.id,
          name: item.newName,
          url: this.host + item.downloadUrl,
          type: "upload",
        });
      });
      obj.selectedList.map((item) => {
        let rulecount = 0;
        for (let i = 0; i < this.ruleform.ruleFile.length; i++) {
          let temp = this.ruleform.ruleFile[i];
          if (temp.id === item.id) {
            rulecount++;
          }
        }
        if (!rulecount) {
          this.ruleform.ruleFile.push({
            attatchid: item.docid,
            docid: item.docid,
            id: item.id,
            name: item.name,
            url: this.host + "/attach/download/" + item.docid,
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/*附件部分*/
.showFiles {
  span {
    line-height: 18px;
    padding: 3px 20px 3px 8px;
    border: 1px solid #519eff;
    display: inline-block;
    vertical-align: top;
    max-width: 130px;
    border-radius: 3px;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  &.alink span {
    padding-right: 35px;
  }
  &.commonpadding span {
    padding: 3px 8px;
  }
  &.commonpadding.alink span {
    padding-right: 20px;
  }
  a:nth-of-type(2) {
    position: absolute;
    right: 17px;
    top: 5px;
  }
  &.commonpadding.alink a:nth-of-type(2) {
    position: absolute;
    right: 5px;
    top: 3px;
  }
  i {
    position: absolute;
    right: 3px;
    top: 5px;
    color: $ico;
  }
  &.processCommon i {
    top: 6px;
  }
}

.minHeight28 {
  min-height: 28px;
}
/deep/.el-button:hover,
.el-button:focus {
  background-color: #2d42af !important;
  color: #fff !important;
}
</style>
