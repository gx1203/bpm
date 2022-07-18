<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" append-to-body>
    <el-form :model="item" ref="item" label-width="80px" class="content">
      <el-form-item :label="$t('numbering') + '：'" required>
        <el-input clearable v-model="item.grantor"  />
      </el-form-item>
      <el-form-item :label="$t('name2') + '：'" required>
        <el-input clearable v-model="item.grantor"  />
      </el-form-item>
      <el-form-item :label="$t('sqlStatement2') + '：'" >
        <el-input clearable v-model="item.grantor"  style="width: 64.5%"/>
        <el-button type="primary" style="margin-left: 10px;">{{ $t('testSqlStatement') }}</el-button>
      </el-form-item>
      <el-form-item :label="$t('expand') + '：'" >
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

