<template>
  <el-dialog id="staffManageDialog" :title="title" :visible.sync="dialogVisible">
    <el-form :model="item" ref="item"  label-width="120px" class="content">
      <el-form-item label="客户端信息:">
        <el-input type="input" disabled :title="item.clientInfo" v-model="item.clientInfo" />
      </el-form-item>
      <el-form-item label="客户端IP:">
        <el-input type="input" disabled :title="item.clientIp" v-model="item.clientIp" />
      </el-form-item>
      <el-form-item label="事件类型:">
        <el-input type="input " disabled :title="item.eventType" v-model="item.eventType" />
      </el-form-item>
      <el-form-item label="路径:">
        <el-input type="input" disabled :title="item.path" v-model="item.path" />
      </el-form-item>
      <el-form-item label="描述:">
        <el-input type="textarea" disabled :title="item.description" v-model="item.description" />
      </el-form-item>
      <el-form-item label="服务端IP:">
        <el-input type="input" disabled :title="item.serverIp" v-model="item.serverIp" />
      </el-form-item>
      <el-form-item label="操作用户:">
        <el-input type="input" disabled :title="item.userName" v-model="item.userName" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="close">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: this.value,
    };
  },
  components: {

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
    close() {
       this.dialogVisible = false;
      this.$emit('closeDiaLog')
    },
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
