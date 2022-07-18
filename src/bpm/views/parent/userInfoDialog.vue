<template>
  <el-dialog title="个人信息" :visible.sync="dialogVisible" append-to-body>
    <el-form
      :model="item"
      v-loading="loading"
      :rules="rules"
      ref="item"
      label-width="80px"
    >
      <el-row align="left">
        <el-col :span="12">
          <el-form-item label="中文名称：">{{item.displayname}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="英文名：">{{item.enname}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登录账户：">{{item.empuid}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工号：">{{item.empid}}</el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="手机号码：">{{item.mobilephone}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分机号：">{{item.tel2}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="直属领导：">
            <el-input v-model="item.superiorName" readonly>
              <el-button slot="append" @click="chooseUser">选择</el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="所属组织：">
            <p v-for="(val,index) in item.positionName" :key="index">{{val}}</p>
          </el-form-item>
        </el-col>
      </el-row>

      <select-people :radioChecked="item.superior" v-model="usersVisible" @confirm="handleUser" />
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit('item')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import SelectPeople from "@/views/flow_form/SelectPeople";
import {
  getUserDetails,
  saveAddUser
} from "@/api/configManage/institutionalFramework/post_manage";

export default {
  name: "userInfoDialog",
  components: {
    SelectPeople
  },
  data() {
    return {
      dialogVisible: this.value,
      usersVisible: false,
      loading: false,
      item: {},
      rules: {
        // grantor: [{ required: true, message: "请选择授权人", trigger: "blur" }],
      }
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
      if (val) {
        this.getData();
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    getData() {
      this.loading = true;
      getUserDetails(this.$store.state.app.userInfo.userid)
        .then(rt => {
          this.item = rt.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    chooseUser() {
      this.usersVisible = true;
    },
    handleUser(data) {
      if (this.item.superior === data.map(item => item.id).join(",")) {
        this.$message.error("直属领导不能为自己！！");
        return;
      }
      this.$set(
        this.item,
        "superiorName",
        data.map(item => item.displayname).join(",")
      );
      this.$set(this.item, "superior", data.map(item => item.id).join(","));
      saveAddUser(this.item)
        .then(rt => {
          this.loading = false;
          if (rt.status === "200") {
            this.$message({
              message: this.$t('hintText.saveSuccessfully'),
              type: "success"
            });
            this.usersVisible = false;
            this.dialogVisible = false;
          } else {
            this.$message({
              message: this.$t('hintText.failToSave'),
              type: "error"
            });
          }
        })
        .catch(() => {
          this.loading = false;
          this.$message({
            message: this.$t('hintText.failToSave'),
            type: "error"
          });
        });
    },
    submit(formName) {
      this.dialogVisible = false;
    },
    cancel() {
      this.dialogVisible = false;
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
}
</style>
