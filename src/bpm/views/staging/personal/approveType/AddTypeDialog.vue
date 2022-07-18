<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" append-to-body>
    <el-form :model="item" ref="item" label-width="80px" class="content">
      <el-form-item :label="$t('authorityName') + '：'" required>
        <el-input clearable v-model="item.grantor"  />
      </el-form-item>
      <el-form-item label="URL:" required>
        <el-input clearable v-model="item.grantor"  />
      </el-form-item>
      <el-form-item :label="$t('sort') + '：'" required>
        <el-input clearable v-model="item.grantor" type="number" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" />
      </el-form-item>
      <el-form-item :label="$t('permissionCode') + '：'" required>
        <el-input clearable v-model="item.grantor"  />
      </el-form-item>
      <el-form-item label="outComes:" required>
        <el-input clearable v-model="item.grantor"  />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: this.value
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {
        return {}
      }
    },
    title: {
      type: String,
      default: false
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
    },
    dialogVisible(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    submit(formName) {

    },
    cancel() {
      this.dialogVisible = false
    }
  },
  mounted() {
  }
}
</script>

<style scoped>
  .content {
    height: 50vh;
    width: 60%;
    margin: 0 auto;
    overflow: auto;
  }

</style>
