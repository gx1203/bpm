<template>
  <el-dialog v-dialogDrag v-if='dialogVisible' :title="$t('flowChart')" :visible.sync="dialogVisible" append-to-body>
    <div class="instanceImage" v-loading="dialogLoading">
      <img :src="imgUrl" alt="">
    </div>
  </el-dialog>
</template>

<script>
import {
  getDefinitionPhoto
} from '@/bpm/api/process/processModeling/process_definition'
export default {
  data () {
    return {
      imgUrl: '',
      dialogVisible: this.value,
      dialogLoading: false
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    instanceId: {
      type: String,
      default: ''
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
      if (val) {
        this.getInstanceImage()
      } else {
        this.imgUrl = ''
      }
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    getInstanceImage () {
      this.dialogLoading = true
      getDefinitionPhoto(this.instanceId)
        .then(rt => {
          this.dialogLoading = false
          this.imgUrl = 'data:image/png;base64,' + btoa(new Uint8Array(rt).reduce((data, byte) => data + String.fromCharCode(byte), ''))
        })
        .catch(() => {
          this.dialogLoading = false
        })
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
  .el-dialog__wrapper {
    .instanceImage {
      min-height: 180px;
      text-align: center;
      padding: 20px 0 40px;
      img {
        // width: 100%;
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
  .el-dialog {
    width: 60%;
  }
</style>
