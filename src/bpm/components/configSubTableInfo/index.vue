<template>
  <el-dialog
    title="子表详情"
    :visible.sync="dialogVisible"
    width="1020px"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <custom-form :processData="{}" formType="subTableDetail" ref="custom"></custom-form>
  </el-dialog>
</template>

<script>
  import customForm from "@/bpm/views/customForm";
  export default {
    components: {
      customForm
    },
    data() {
      return {
        dialogVisible: false
      };
    },
    props: {
      value: {
        type: Boolean
      }
    },
    watch: {
      value(val) {
        this.dialogVisible = val;
      },
      dialogVisible(val) {
        this.$emit("input", val);
      }
    }
  };
</script>


<style lang="scss" >
</style>
