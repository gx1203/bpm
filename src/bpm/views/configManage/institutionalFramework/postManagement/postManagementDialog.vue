<template>
  <el-dialog id="staffManageDialog"  class="dialog_content_post"  :title="title" :visible.sync="dialogVisible">
    <el-form :model="item" ref="item" :rules="rules" label-width="120px" class="content">
      <el-row  :gutter="20">
        <el-col :span="12">
           <el-form-item :label="$t('postnameinlist') + '：'" prop="name">
            <el-input clearable v-model="item.name" />
          </el-form-item>
          <el-form-item :label="$t('parentOrganization') + '：'" prop="pname">
            <el-input v-model="item.pname" readonly>
              <el-button slot="append" @click="orgHandle('org')">{{ $t('placeholderText.select') }}</el-button>
            </el-input>
          </el-form-item>
           <el-form-item :label="$t('organizationType') + '：'" prop="hrtype">
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
          <el-form-item :label="$t('state') + '：'"  prop="subtype">
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
           <el-form-item :label="$t('postcodeinlist') + '：'"  prop="code">
            <el-input clearable v-model="item.code"></el-input>
          </el-form-item>
           <el-form-item :label="$t('parentOrganizationCode') + '：'" prop="pcode">
            <el-input clearable v-model="item.pcode" disabled />
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
      <el-form-item :label="$t('includeMembers') + '：'">
        <el-button @click="orgHandle('user')">{{ $t('add') }}</el-button>
        <table
          border="1"
          cellspacing="0"
          style="margin: 15px 0;text-align: center;width: 100%;border-collapse:collapse;border: 1px solid #dedede;"
        >
          <thead style="background: #E1EAFD !important">
            <tr>
              <td>{{ $t('name3') }}</td>
              <td>{{ $t('loginAccount') }}</td>
              <td>{{ $t('workNumber') }}</td>
              <!-- <td>{{ $t('type') }}</td> -->
              <td>{{ $t('operation') }}</td>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(data,index) in item.members"
              :key="index"
              style="line-height: 16px;height: 30px;font-size: 13px;"
            >
              <td>
                <el-input clearable v-model="data.name" disabled style="padding:5px;width: 91%;"></el-input>
              </td>
               <td>
                <el-input clearable v-model="data.memberId" disabled style="padding:5px;width: 91%;"></el-input>
              </td>
               <td>
                <el-input clearable v-model="data.jobNumber" disabled style="padding:5px;width: 91%;"></el-input>
              </td>
              <!-- <td>
                <el-select v-model="data.type" style="padding:5px;width: 91%;" disabled>
                  <el-option
                    v-for="item in orgType"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </td> -->
              <td>
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  style="padding:5px"
                  @click="deleData(index)"
                ></el-button>
              </td>
            </tr>
          </tbody>
        </table>
      </el-form-item>
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
import { orgSave } from "@/bpm/api/configManage/institutionalFramework/org_info";
import { getDictionaryOption } from "@/bpm/api/process/processModeling/classificationModel";
import {
  getOrgInfo
} from "@/bpm/api/configManage/institutionalFramework/org_info";
import { getOrgTree } from "@/bpm/api/app";
import {
  findOrgUsers,
  assignUsers
} from "@/bpm/api/configManage/institutionalFramework/organization";
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
      selectElement: [],
      // selectElement: ["0"，"1","2"],
      isTypeOeg: "",
      orgtitle: "选择组织",
      rules: {
         name: [
          {
            required: true,
            message: this.$t("placeholderText.pleaseEnterPostName"),
            trigger: "blur"
          }
        ],
        code:[
          {
            required: true,
            message: this.$t("placeholderText.pleaseEnterPostCode"),
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
      item: {
        members: []
      },
      comtypeList: [],
      hrtypeList: [],
      approvalorgdescList: [],
      subtypeList: [],
      orgType: [],
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
    itemId: {
      type: String,
      default: ""
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
        this.item = {
          hrtype: "3",
          subtype: "Y",
          members: []
        };
        this.getList();
        this.getData();
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    deleData(index) {
      this.$confirm(
        this.$t("hintText.areYouSureDelete"),
        this.$t("hintText.hint"),
        {
          type: "warning"
        }
      ).then(() => {
        this.item.members.splice(index, 1);
      });
    },
    getList() {
      let list = [
        getDictionaryOption({ dictionaryen: "组织类型" }),
        getDictionaryOption({ dictionaryen: "公司管理-状态" }),
        getDictionaryOption({ dictionaryen: "组织类型" })
      ];
      Promise.all(list).then(resultList => {
        this.hrtypeList = resultList[0].data;
        this.subtypeList = resultList[1].data;
        this.orgType = resultList[2].data;
      });
    },
    getData() {
      if (this.itemId) {
        getOrgInfo(this.itemId).then(rts => {
          this.item = rts.data;
          findOrgUsers(
            {
              logic: "and",
              filters: [],
              pageNum: 1,
              pageSize: 10000
            },
            this.itemId,
            false
          )
            .then(rt => {
              if (
                rt.status === "200" &&
                rt.data &&
                rt.data.list &&
                rt.data.list.length > 0
              ) {
                this.$set(
                  this.item,
                  "members",
                  rt.data.list.map(item => {
                    return {
                      jobNumber: item.attr.jobNumber,
                      memberId: item.memberId,
                      name: item.name,
                      type: item.type
                    };
                  })
                );
                // console.log(this.item);
              }
            })
            .catch(() => {});
        })
      }
    },
    fnBasOrganieationCallBack(data) {
      if (this.isTypeOeg === "org") {
        this.$set(this.item, "pname", data.name.split("&").join(","));
        this.$set(this.item, "pid", data.id);
        this.$set(this.item, "pcode", data.id);
      } else {
        let list = [];
        if (data.idType) {
          data.idType.split(";").forEach((item, index) => {
            let nameType = "";
            this.hrtypeList.forEach(val => {
              if (item.split("-")[1] === val.value) {
                nameType = val.text;
              }
            });
            list.push({
              memberId: item.split("-")[0],
              jobNumber: data.attrs[index].jobNumber,
              name: data.name.split("&")[index],
              type: item.split("-")[1]
            });
          });
        }
        this.$set(this.item, "members", list);
      }
      this.organieationShow = false;
    },
    orgHandle(type) {
      this.selectedElement = {};
      this.isTypeOeg = type;
      if (type === "org") {
        // this.selectElement = ["0", "1", "2"];
        this.selectElement = ["2"];
        this.orgtitle = "选择组织";
        if (this.item.pid) {
          this.getOrgTree(this.item.pid);
        } else {
          this.organieationShow = true;
        }
      } else {
        this.selectElement = ["9"];
        this.orgtitle = "选择人员";
        if (this.item && this.item.members && this.item.members.length > 0) {
          this.selectedElement = {
            id: this.item.members.map(item => item.memberId).join(","),
            name: this.item.members.map(item => item.name).join("&"),
            idType: this.item.members
              .map(item => {
                return item.memberId + "-" + item.type;
              })
              .join(";"),
            attrs: this.item.members.map(item => {
              return {
                jobNumber: item.jobNumber
              }
            })
          };
        }
        this.organieationShow = true;
      }
    },
    getOrgTree(ids) {
      getOrgTree({
        logic: "and",
        filters: [{ key: "id", opt: "IN", type: "S", value: ids }],
        pageNum: 1,
        pageSize: 10000
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
          this.item.type = "3";
          this.item.isdelete = "N";
          orgSave(this.item)
            .then(rt => {
              if (rt.status === "200") {
                if (this.item.members && this.item.members.length > 0) {
                  let members = this.item.members.map(item => {
                    return {
                      groupId: rt.data.id,
                      memberId: item.memberId
                    };
                  });
                  assignUsers(members)
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
                } else {
                  if(this.item.id){
                   this.$message.success(this.$t("hintText.editedSuccess"));
                  }else{
                    this.$message.success(this.$t("hintText.addedSuccess"));
                  }
                  this.dialogVisible = false;
                  this.$emit("confirm", this.item);
                }
              } else {
                this.loading = false;
              }
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
    height: 64vh;
    margin: 0 auto;
    padding: 0 10px;
    overflow: auto;
  }
  .w100 {
    width: 100%;
  }
</style>
<style lang="scss">
.dialog_content_post{
  .el-dialog{
        width:76vw;
        height:88vh;
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

