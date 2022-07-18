<template>
  <el-dialog :title="$t('selectNode')" :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" append-to-body>
    <div class="treeWrap" style="margin-top: 10px;">
      <tree-collection isMore @changeRadio="changeRadio"></tree-collection>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{ $t('closes') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import treeCollection from "@/bpm/components/treeCollection";
export default {
  components: {
    treeCollection
  },
  data() {
    return {
      dialogVisible: false,
      radioData: {}
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
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  mounted() {},
  methods: {
    changeRadio(data) {
      this.radioData = data
    },
    confirm() {
      this.$emit("confirm", this.radioData);
    }
  }
};
</script>
<style lang="scss">
#collectionDialog {
  .el-input__inner {
    border: none;
    border-bottom: 1px solid $dc1;
  }
}
</style>

<style lang="scss" scoped>
</style>
