<template>
  <el-dialog id="staffManageDialog"  class="dialog_content_area"  :title="title" :visible.sync="dialogVisible">
    <el-form :model="item" ref="item" :rules="rules" label-width="120px" class="content">
      <el-row  :gutter="20">
        <el-col :span="12">
           <el-form-item :label="$t('areaName') + '：'" prop="name">
            <el-input clearable v-model="item.name" />
          </el-form-item>
          <el-form-item :label="$t('parentOrganization') + '：'" prop="pname">
            <el-input clearable v-model="item.pname">
              <el-button slot="append" @click="orgHandle">选择</el-button>
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('organizationType') + '：'"  prop="hrtype">
            <el-select
              disabled
              clearable
              v-model="item.hrtype"
              class="w100"
              :placeholder="$t('placeholderText.pleaseSelect')"
            >
              <el-option
                v-for="item in hrtypeList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('effectiveDate') + '：'">
            <el-date-picker
              type="datetime"
              :picker-options="pickerOptions0"
              v-model="item.effectivedate"
            />
          </el-form-item>
          <el-form-item :label="$t('state') + '：'" prop="subtype">
            <el-select
              clearable
              v-model="item.subtype"
              class="w100"
              :placeholder="$t('placeholderText.pleaseSelect')"
            >
              <el-option
                v-for="item in subtypeList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('areaCoding') + '：'" prop="code">
            <el-input clearable v-model="item.code"></el-input>
          </el-form-item>
          <el-form-item :label="$t('parentOrganizationCode') + '：'"  prop="pcode">
            <el-input clearable v-model="item.pcode" />
          </el-form-item>
            <el-form-item :label="$t('sort') + '：'">
            <el-input
              clearable
              type="number"
              onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
              v-model="item.rank"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('expirationDate') + '：'">
            <el-date-picker type="datetime" :picker-options="pickerOptions1" v-model="item.expiredate" />
          </el-form-item>
        </el-col>
      </el-row> 
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
    <bas-organieation
      v-model="organieationShow"
      :selectedElement="selectedElement"
      :isSpecifiedGroupBut="false"
      :isShowBustomGroupsBut="false"
      :selectElement="selectElement"
      :showElement="showElement"
      :title="orgtitle"
      @fnCallBack="fnBasOrganieationCallBack"
    />
  </el-dialog>
</template>
<script>
import { getOrgTree } from "@/bpm/api/app";
import { orgSave } from "@/bpm/api/configManage/institutionalFramework/org_info";
import { getDictionaryOption } from "@/bpm/api/process/processModeling/classificationModel";

import BasComponent from "bas-component";
Vue.use(BasComponent);
import "bas-component/lib/BasComponent.css";
export default {
  data() {
    return {
      dialogVisible: this.value,
      organieationShow: false,
      selectedElement: {},
      showElement: [],
      selectElement: ["0", "1", "2"],
      orgtitle: "选择组织",
      rules: {
        name: [
          {
            required: true,
            message: this.$t("placeholderText.pleaseEnterAreaName"),
            trigger: "blur"
          }
        ],
        code:[
          {
            required: true,
            message: this.$t("placeholderText.pleaseEnterAreaCoding"),
            trigger: "blur"
          }
        ],
        pname: [
          {
            required: true,
            message: this.$t("placeholderText.pleaseEnterpName"),
            trigger: "blur"
          }
        ],
        pcode:[
           {
            required: true,
            message: this.$t("placeholderText.pleaseEnterpCode"),
            trigger: "blur"
          }
        ],
        hrtype:[
          {
            required: true,
            message: this.$t("placeholderText.pleaseEnterOrganizationType"),
            trigger: "blur"
          }
        ],
        subtype:[
          {  
            required: true,
            message: this.$t("placeholderText.pleaseEnterStatus"),
            trigger: "blur"
          }
        ]
      },
      comtypeList: [],
      hrtypeList: [],
      approvalorgdescList: [],
      subtypeList: [],
      pickerOptions0: {
        disabledDate: time => {
          if (this.item.expiredate) {
            return (
              time.getTime() >
                new Date(this.item.expiredate).getTime() - 86400000 ||
              time.getTime() < Date.now() - 86400000
            );
          } else {
            return time.getTime() < Date.now() - 86400000;
          }
        }
      },
      pickerOptions1: {
        disabledDate: time => {
          if (this.item.effectivedate) {
            return time.getTime() < new Date(this.item.effectivedate).getTime();
          } else {
            return time.getTime() < Date.now() - 86400000;
          }
        }
      }
    };
  },
  components: {},
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
      if (val) {
        this.getList();
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
     getList() {
      let list = [
        getDictionaryOption({ dictionaryen: "组织类型" }),
        getDictionaryOption({ dictionaryen: "公司管理-状态" })
      ];
      Promise.all(list).then(resultList => {
        this.hrtypeList = resultList[0].data;
        this.subtypeList = resultList[1].data;
      });
    },
    fnBasOrganieationCallBack(data) {
      this.$set(this.item, "pname", data.name.split("&").join(","));
      this.$set(this.item, "pid", data.id);
      this.$set(this.item, "pcode", data.id);
      this.$set(this.item, "attribute2", data.idType);
      this.organieationShow = false;
    },
    orgHandle() {
      // this.selectedElement = {};
      // if (this.item.pcode) {
      //   let list = this.item.surrogate.split(",").join("&");
      //   this.selectedElement = {
      //     id: this.item.pcode.split(","),
      //     name: list,
      //     idType: this.item.attribute2.join(";")
      //   };
      // }
      // this.organieationShow = true;

       this.selectedElement = {};
      if (this.item.pid) {
        this.getOrgTree(this.item.pid);
      } else {
        this.organieationShow = true;
      }
    },
     getOrgTree(ids) {
      getOrgTree({
        logic: "and",
        filters: [{ key: "id", opt: "IN", type: "S", value: ids }],
        pageNum: 1,
        pageSize: 10000,
      })
        .then(rt => {
          if (rt.status === "200") {
            this.selectedElement = {
              id: rt.data.list.map(item => item.id).join(","),
              name: rt.data.list.map(item => item.name).join("&"),
              idType: rt.data.list
                .map(item => {
                  return `${item.id}-${item.type}`;
                })
                .join(";")
            };
            this.organieationShow = true;
          }
        })
        .catch(er => {});
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          this.item.type = "5";
          this.item.isdelete = "N";
          orgSave(this.item)
            .then(rt => {
              if (rt.status === "200") {
                if(this.item.id){
                   this.$message.success(this.$t("hintText.editedSuccess"));
                }else{
                   this.$message.success(this.$t("hintText.addedSuccess"));
                }
                this.dialogVisible = false;
                this.$emit("confirm", this.item);
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    cancel() {
      this.dialogVisible = false;
    }
  },
  mounted() {}
};
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
.dialog_content_area{
   .el-dialog{
      width:76vw;
      height:64vh;
      padding:20px 30px;
      box-sizing: border-box;
      .el-dialog__body{
        width:100%;
        .el-date-editor.el-input{
          width:23vw;
        }
      }
    }
}
#staffManageDialog {
  .avatar-uploader .el-upload {
    border: 1px dashed $dc1;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>

