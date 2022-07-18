<template>
  <el-dialog :title="$t('signature')" :visible.sync="dialogVisible" width="98%" v-loading="load" append-to-body>
    <iframe :src="iframeSrc" frameborder="0"></iframe>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="cancel">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getSignature } from "@/bpm/api/flow";

export default {
  data () {
    return {
      dialogVisible: this.value,
      iframeSrc: '',
      load: false
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
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
      if (val) {
        this.getSignature()
      }
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    getSignature () {
      let that = this
      that.iframeSrc = ''
      that.load = true
      getSignature(that.item.id).then(rt => {
        that.load = false
        if (rt.status === '200') {
          that.$nextTick(() => {
            that.iframeSrc = rt.data.pageUrl
          })
        }
      }).catch(er => {
        that.load = false
      })
    },
    cancel () {
      this.dialogVisible = false
    }
  },
  mounted () {
  }
}
</script>

<style scoped>
iframe {
  height: 600px;
  width: 100%;
  overflow: scroll;
}
</style>
