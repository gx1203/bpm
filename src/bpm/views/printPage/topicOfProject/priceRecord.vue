<template>
  <div v-loading="load">
    <el-dialog
      title="立项金额修改记录"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <span>这是一段信息</span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      dialogVisible: false,
      load: false
    }
  },
  props: {
    value: {
      type: Boolean
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>

</style>
