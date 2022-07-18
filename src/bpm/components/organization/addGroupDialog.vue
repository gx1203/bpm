<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" append-to-body>
    <el-form :model="item" ref="item" label-width="auto" class="content padding-r10px">
      <el-form-item v-if="title === '自定义组'" label="组名:" required>
        <el-input clearable v-model="item.name"/>
      </el-form-item>
      <el-form-item v-if="title === '指定组'" label="组名:" required>
        <el-select clearable v-model="typeData" :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
        <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
        </el-option>
      </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit(item)">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: this.value,
      peopleDialog: false,
      options: [],
      typeData: ''
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
    submit(formName) {
      this.$emit('confirm', formName)
    },
    cancel() {
      this.dialogVisible = false;
    },
  },
  mounted() {
  }
};
</script>

<style scoped>
.content {
  height: auto;
  width: 60%;
  margin: 0 auto;
  overflow: auto;
}
.w100 {
  width: 100%;
}
</style>
