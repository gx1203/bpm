<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" append-to-body>
    <el-form :model="item" ref="item" v-loading='loading' label-width="auto" class="content">
      <el-form-item label="设备唯一编号：">
        {{item.device_channelid}}
      </el-form-item>
      <el-form-item label="设备登陆用户ID：">
        {{item.user_id}}
      </el-form-item>
      <el-form-item label="是否禁用：">
        <el-switch v-model="item.status" active-value="Y" inactive-value="N"></el-switch>
      </el-form-item>
      <el-form-item label="登录时间：">
        {{item.login_date|formatDateTime}}
      </el-form-item>
      <el-form-item label="最后推送时间：">
        {{item.push_date|formatDateTime}}
      </el-form-item>
      <el-form-item label="平台类型：">
        {{item.platform}}
      </el-form-item>
      <el-form-item label="设备channelID：">
        {{item.device_userid}}
      </el-form-item>
      <el-form-item :label="$t('remarks') + '：'">
       <el-input clearable type="textarea" v-model="item.remark"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  saveMobile
} from "@/bpm/api/process/mobileConfig/device_management";
export default {
  data() {
    return {
      loading: false,
      dialogVisible: this.value,
    };
  },
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
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    submit(formName) {
      this.loading = true;
      saveMobile(this.item)
        .then(rt => {
          if (rt.status === "200") {
            this.$message.success(this.$t('hintText.addedSuccess'));
            this.dialogVisible = false;
            this.$emit("confirm", this.item);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    cancel() {
      this.dialogVisible = false;
    }
  },
  mounted() {
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
.w100{
  width: 100%;
}
</style>
