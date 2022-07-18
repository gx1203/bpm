<template>
  <el-dialog :title="risk" :visible.sync="dialogVisible" append-to-body  width="60%">
      <el-table
          :data="riskData"
          class="margin-t10"
          stripe
          :header-cell-style="{background: '#E1EAFD !important'}"
          highlight-current-row
          current-row-key="id"
        >
          <el-table-column :label="nodeName" show-overflow-tooltip prop="nodeName" />
          <el-table-column :label="riskName" show-overflow-tooltip prop="kcpname" />
          <el-table-column :label="riskDescription" show-overflow-tooltip prop="controlelement" />
      </el-table>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: this.value,
      risk:this.$t('risk'),
      nodeName:this.$t('nodeName'),
      riskName:this.$t('riskName'),
      riskDescription:this.$t('riskDescription'),
    };
  },
  props: {
    value: {
      type: Boolean,
      default: true
    },
    riskData:{
      type: Array,
      default: () => [],
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
  }
};
</script>
<style  type="text/scss" lang="scss" scoped>
</style>
