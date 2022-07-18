<template>
  <el-dialog id="staffManageDialog" :title="title" :visible.sync="dialogVisible">
    <el-form :model="item" ref="item" :rules="rules" label-width="auto" class="content">
      <el-form-item label="登录账号:" prop="empuid">
        <el-input clearable v-model="item.empuid" :disabled="!!item.id" />
      </el-form-item>
      <el-form-item label="工号:" prop="empid">
        <el-input clearable v-model="item.empid" />
      </el-form-item>
      <el-form-item :label="$t('chineseName') + '：'" prop="cnname">
        <el-input clearable v-model="item.cnname" />
      </el-form-item>

      <el-form-item :label="$t('englishName') + '：'" prop="enname">
        <el-input clearable v-model="item.enname" />
      </el-form-item>

      <el-form-item label="显示名称:" prop="displayname">
        <el-input clearable v-model="item.displayname" />
      </el-form-item>

      <el-form-item label="性别:" prop="sex">
        <el-radio v-model="item.sex" label="1">男</el-radio>
        <el-radio v-model="item.sex" label="0">女</el-radio>
      </el-form-item>

      <el-form-item label="邮件:" prop="email">
        <el-input clearable v-model="item.email" />
      </el-form-item>

      <el-form-item label="邮箱密码:" prop="emailpassword">
        <el-input clearable v-model="item.emailpassword" />
      </el-form-item>
      <el-form-item :label="$t('state') + '：'">
        <el-select clearable v-model="item.status" class="w100" :placeholder="$t('placeholderText.pleaseSelect')">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="身份证号:" prop="icnum">
        <el-input clearable v-model="item.icnum" />
      </el-form-item>
      <el-form-item :label="$t('phone') + '：'" prop="phone">
        <el-input clearable v-model="item.phone" />
      </el-form-item>

      <el-form-item label="手机短号1:" prop="phone1_s">
        <el-input clearable v-model="item.phone1_s" />
      </el-form-item>

      <el-form-item label="电话2:" prop="phone2">
        <el-input clearable v-model="item.phone2" />
      </el-form-item>
      <el-form-item label="手机短号2:" prop="phone2_s">
        <el-input clearable v-model="item.phone2_s" />
      </el-form-item>
      <el-form-item label="传真号码:" prop="faxnumber">
        <el-input clearable v-model="item.faxnumber" />
      </el-form-item>
      <el-form-item label="分机号码:" prop="extension">
        <el-input clearable v-model="item.extension" />
      </el-form-item>
      <el-form-item label="地区:" prop="area">
        <el-input clearable v-model="item.area" />
      </el-form-item>
      <el-form-item label="出生省份:" prop="province_birth">
        <el-input clearable v-model="item.province_birth" />
      </el-form-item>
      <el-form-item label="籍贯:" prop="origin">
        <el-input clearable v-model="item.origin" />
      </el-form-item>
      <el-form-item label="家庭住址:" prop="homeaddress">
        <el-input clearable v-model="item.homeaddress" />
      </el-form-item>
      <el-form-item label="家庭地址邮编:" prop="zzip">
        <el-input clearable v-model="item.zzip" />
      </el-form-item>
      <el-form-item label="户口地址:" prop="hukoaddress">
        <el-input clearable v-model="item.hukoaddress" />
      </el-form-item>
      <el-form-item label="其他地址:" prop="oth2address">
        <el-input clearable v-model="item.oth2address" />
      </el-form-item>
      <el-form-item label="永久地址:" prop="permaddress">
        <el-input clearable v-model="item.permaddress" />
      </el-form-item>
      <el-form-item label="居住地邮编:" prop="zzip2">
        <el-input clearable v-model="item.zzip2" />
      </el-form-item>
      <el-form-item label="个人传真号码:" prop="homefax">
        <el-input clearable v-model="item.homefax" />
      </el-form-item>
      <el-form-item label="个人邮箱:" prop="homeemail">
        <el-input clearable v-model="item.homeemail" />
      </el-form-item>
      <el-form-item label="家庭电话:" prop="homemobile">
        <el-input clearable v-model="item.homemobile" />
      </el-form-item>
      <el-form-item label="默认部门:">
        <!-- <el-input clearable v-model="item.deptName" @click.native="checktype = '部门';peopleDialog = true"/> -->
        <el-input clearable v-model="item.deptName" disabled />
      </el-form-item>
      <el-form-item label="默认岗位:">
        <!-- <el-input clearable v-model="item.defaultposname" @click.native="checkPost"/> -->
        <el-input clearable v-model="item.defaultposname" disabled />
      </el-form-item>
      <el-form-item label="办公室电话:" prop="officephone">
        <el-input clearable v-model="item.officephone" />
      </el-form-item>
      <el-form-item :label="$t('mobilePhone') + '：'" prop="mobilephone">
        <el-input clearable v-model="item.mobilephone" />
      </el-form-item>
      <el-form-item label="固定电话2:" prop="tel2">
        <el-input clearable v-model="item.tel2" />
      </el-form-item>
      <el-form-item label="工资卡卡号:" prop="payrollcardnumber">
        <el-input clearable v-model="item.payrollcardnumber" />
      </el-form-item>
      <el-form-item label="开户行:" prop="bank">
        <el-input clearable v-model="item.bank" />
      </el-form-item>
      <!-- <el-form-item label="密码:">
        <el-input clearable v-model="item.password" />
      </el-form-item>-->
      <el-form-item label="个人说明:" prop="personaldesc">
        <el-input clearable type="textarea" v-model="item.personaldesc" />
      </el-form-item>
      <el-form-item :label="$t('remarks') + '：'" prop="remark">
        <el-input clearable type="textarea" v-model="item.remark" />
      </el-form-item>

      <!-- <el-form-item label="头像管理:">
        <el-upload
          class="avatar-uploader"
          :limit="1"
          :action="action"
          :auto-upload="true"
          :show-file-list="false"
          :headers="myHeaders"
          :with-credentials="true"
          :on-success="uploadFile"
          :before-upload="beforeAvatarUpload"
          name="file"
          ref="upload"
          accept="image/jpeg, image/gif, image/png, image/bmp"
        >
          <img v-if="headeUrl" :src="headeUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <p slot="tip">请上传大小为180X200px以上的图片</p>
        </el-upload>
      </el-form-item>
      <el-form-item label="电子签名:">
        <el-upload
          class="avatar-uploader"
          :limit="1"
          :action="action"
          :auto-upload="true"
          :show-file-list="false"
          :headers="myHeaders"
          :with-credentials="true"
          name="file"
          :on-success="uploadFile1"
          :before-upload="beforeAvatarUpload"
          ref="upload"
          accept="image/jpeg, image/gif, image/png, image/bmp"
        >
          <img v-if="signatureUrl" :src="signatureUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <p slot="tip">请上传大小为180X200px以上的图片</p>
        </el-upload>
      </el-form-item> -->
      <el-form-item :label="$t('role') + '：'">
        <el-checkbox-group v-model="item.checkedRoleIds">
          <el-checkbox
            v-for="role in roleList"
            :key="role.id"
            :label="role.id"
            name="role"
          >{{role.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
    <!-- <SelectOrganization v-model="peopleDialog" @confirm="getUser" :organationList="organationList"/> -->
  </el-dialog>
</template>
<script>
import positionDialog from "./positionDialog";
import SelectOrganization from "../../../flow_form/SelectOrganization";
import {
  getUserDetails,
  saveAddUser
} from "@/bpm/api/configManage/institutionalFramework/post_manage";
import { getAuthroleList } from "@/bpm/api/configManage/authorityManage/roleManage";
export default {
  data() {
    return {
      action: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/attach/upload?attachmentType=bpm`,
      dialogVisible: this.value,
      peopleDialog: false,
      myHeaders: { token: localStorage.getItem("token") },
      positionDialog: false,
      signatureUrl: "",
      headeUrl: "",
      item: {
        checkedRoleIds: []
      },
      checktype: "",
      typeList: [
        {
          value: "1",
          label: "在职"
        },
        {
          value: "2",
          label: "离职"
        }
      ],
      roleList: [],
      rules: {
        empuid: [
          { required: true, message: "请输入登录账号", trigger: "blur" },
          { max: 50, message: "登录账号超长", trigger: "blur" }

        ],
        empid: [{ required: true, message: "请输入工号", trigger: "blur" },
          { max: 100, message: "工号超长", trigger: "blur" }],
        cnname: [
          { required: true, message: "请输入中文名称", trigger: "blur" },
          { max: 100, message: "中文名称超长", trigger: "blur" }
        ],
        enname: [
          { required: true, message: "请输入英文名称", trigger: "blur" },
          { max: 100, message: "中文名称超长", trigger: "blur" }
        ],
        displayname: [
          { required: true, message: "请输入显示名称", trigger: "blur" },
          { max: 300, message: "显示名称超长", trigger: "blur" }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { max: 100, message: "邮箱地址超长", trigger: "blur" }],

        phone2_s: [{ max: 10, message: "手机短号2超长", trigger: "blur"  }],
        phone2: [{ max: 10, message: "电话2超长", trigger: "blur"  }],
        phone1_s: [{ max: 10, message: "手机短号1超长", trigger: "blur"  }],
        phone: [{ max: 50, message: "电话超长", trigger: "blur"  }],
        icnum: [{ max: 100, message: "身份证号超长", trigger: "blur"  }],
        emailpassword: [{ max: 50, message: "邮箱密码超长", trigger: "blur"  }],
        faxnumber: [{ max: 50, message: "传真号码超长", trigger: "blur"  }],
        extension: [{ max: 50, message: "分机号码超长", trigger: "blur"  }],
        area: [{ max: 30, message: "地区超长", trigger: "blur"  }],
        province_birth: [{ max: 100, message: "出生省份超长", trigger: "blur"  }],
        origin: [{ max: 100, message: "籍贯超长", trigger: "blur"  }],
        homeaddress: [{ max: 800, message: "家庭地址超长", trigger: "blur"  }],
        zzip: [{ max: 10, message: "家庭地址邮编超长", trigger: "blur"  }],
        hukoaddress: [{ max: 100, message: "户口地址超长", trigger: "blur"  }],
        oth2address: [{ max: 100, message: "其他地址超长", trigger: "blur"  }],
        permaddress: [{ max: 100, message: "永久地址超长", trigger: "blur"  }],
        zzip2: [{ max: 10, message: "居住地邮编超长", trigger: "blur"  }],
        homefax: [{ max: 50, message: "个人传真号码超长", trigger: "blur"  }],
        homeemail: [{ max: 100, message: "个人邮箱超长", trigger: "blur"  }],
        homemobile: [{ max: 30, message: "家庭电话超长", trigger: "blur"  }],
        officephone: [{ max: 30, message: "办公室电话超长", trigger: "blur"  }],
        mobilephone: [{ max: 30, message: "移动电话超长", trigger: "blur"  }],
        tel2: [{ max: 30, message: "固定电话2超长", trigger: "blur"  }],
        payrollcardnumber: [{ max: 30, message: "工资卡卡号超长", trigger: "blur"  }],
        bank: [{ max: 100, message: "开户行超长", trigger: "blur"  }],
        personaldesc: [{ max: 1500, message: "个人说明超长", trigger: "blur"  }],
        remark: [{ max: 2000, message: "备注超长", trigger: "blur"  }]
      },
      organationList: {}
    };
  },
  components: {
    SelectOrganization,
    positionDialog
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    detail: {
      type: Object,
      default: () => {
        return {};
      }
    },
    title: {
      type: String,
      default: ""
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.getRole();
        if (this.detail.id) {
          this.getUserDet();
        } else {
          this.item = {
            checkedRoleIds: []
          };
        }
      }

      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 100;
      if (!isLt2M) {
        this.$message.error(this.$t('hintText.uploadAttachmentSizeCannotExceed'));
      }
      return isLt2M;
    },
    getUserDet() {
      getUserDetails(this.detail.id).then(rt => {
        if (rt.status === "200") {
          if (!rt.data.checkedRoleIds) {
            rt.data.checkedRoleIds = [];
          }
          this.item = rt.data;
        }
      });
    },
    // 文件上传
    uploadFile(res, file) {
      this.headeUrl = URL.createObjectURL(file.raw);
    },
    uploadFile1(res, file) {
      this.signatureUrl = URL.createObjectURL(file.raw);
    },
    getRole() {
      getAuthroleList({
        logic: "and",
        filters: [{key: "delete", opt: "EQ", type: "S", value: "0"}]
      })
        .then(rt => {
          this.roleList = rt.data.list;
        })
        .catch(() => {});
    },
    getUser(data) {
      if (this.checktype === "部门" && data[0].TYPE === "2") {
        this.item.deptid = data[0].ID;
        this.item.deptName = data[0].NAME;
      } else if (this.checktype === "岗位" && data[0].TYPE > "2") {
        this.item.defaultposname = data[0].NAME;
        this.item.defaultpos = data[0].ID;
      } else {
        this.$message("请选择对应的部门或岗位");
      }
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // if (!this.item.deptName) {
          //   this.$message.error('请选择部门！！')
          //   return
          // } else if (!this.item.defaultposname) {
          //   this.$message.error(this.$t('hintText.pleaseChoosePosition'))
          //   return
          // }
          saveAddUser(this.item)
            .then(rt => {
              if (rt.status === "200") {
                this.$message({
                  message: this.$t('hintText.saveSuccessfully'),
                  type: "success"
                });
                this.dialogVisible = false;
                this.$emit("confirm", true);
              } else {
                this.$message({
                  message: this.$t('hintText.failToSave'),
                  type: "error"
                });
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
      this.dialogVisible = false;
    },
    checkPost() {
      this.checktype = "岗位";
      this.peopleDialog = true;
      this.organationList = {};
    }
  }
};
</script>
<style scoped>
.content {
  height: 50vh;
  width: 60%;
  margin: 0 auto;
  overflow: auto;
  padding: 0 10px;
}
.w100 {
  width: 100%;
}
</style>
<style lang="scss">
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
