<template>
  <el-dialog :title="title" :visible.sync="dialogVisible">
    <el-form :model="item" ref="item" :rules="rules" label-width="auto" class="content">
      <div v-if="title !== '设置归档时间'">
        <el-form-item :label="$t('startTime') + '：'" prop="createDate">
          <el-date-picker v-model="item.createDate" type="date" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('endTime') + '：'" prop="endDate">
          <el-date-picker v-model="item.endDate" type="date" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
      </div>
      <div v-else>
        <el-form-item :label="$t('archiveTime') + '：'" prop="filingTime">
          <el-date-picker v-model="item.filingTime" type="date" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
let filingTime = [
  {
    required: true,
    message: "请输入归档时间",
    trigger: ["blur", "change"]
  }
];
let createDate = [
  {
    required: true,
    message: "请输入开始时间",
    trigger: ["blur", "change"]
  }
];
let endDate = [
  {
    required: true,
    message: "请输入结束时间",
    trigger: ["blur", "change"]
  }
];
export default {
  data() {
    return {
      dialogVisible: this.value,
      rules: {}
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
    },
    dialogVisible(val) {
      this.$emit("input", val);
    },
    'title': function(val) {
      this.rules = {};
      if (val === "设置归档时间") {
        Object.assign(this.rules, {
          filingTime
        });
        setTimeout(() => {
          this.$refs.item.resetFields()
          // this.$refs.item.validateField(["filingTime"]);
        }, 0);
      } else {
        Object.assign(this.rules, {
          createDate,
          endDate
        });
        setTimeout(() => {
          this.$refs.item.resetFields()
          // this.$refs.item.validateField(["createDate",'endDate']);
        }, 0);
      }
    }
  },
  methods: {
    submit(formName) {},
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
.w100 {
  width: 100%;
}
</style>
