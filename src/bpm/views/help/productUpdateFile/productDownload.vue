<template>
  <el-dialog title="注：确定下载！将打包获取当前版本至更新版本内所有版本内容" :visible.sync="dialogVisible" class="dialog">
    <el-form  ref="item" label-width="140px" class="content">
      <el-form-item label="选择更新版本：" required>
            <el-input clearable type="text"  v-model="item.vnumber" disabled/>
      </el-form-item>
      <el-form-item label="当前版本" required>
        <el-select clearable v-model="versionId" class="w100">
          <el-option v-for="ite in version" :key="ite.key" :label="ite.value" :value="ite.key" >
            <span style="float: left">{{ ite.value }}</span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="cancel"> {{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="submit()"> {{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getProductUpdateList, ProductUpdateDownload } from '@/bpm/api/help/onlineHelp/help'
import axios from 'axios'
export default {
  data() {
    return {
      dialogVisible: this.value,
      versionId: '',
      positionList: {}
    };
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
    version: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
      if(val){
          this.positionList= this.version
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    // 点击确定下载
    submit(formName) {
      console.log('aaaaaaaaaaaa');
      console.log(this.version);
      console.log(this.item)
      if(!this.versionId){
        console.log('bbbbbbbbbb');
          this.$message.error('请选择版本号')
          return false
      } else if (!this.item.file) {
        console.log('没有文件');
         this.$message.error('此版本没有文件')
          return false
      } else {
        if (this.item.file) {
          console.log('ccccccccc');
          axios({
            method: 'get',
            url: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/bpm/productRelease/manage/batchDownloadFile?newVnumber=${this.item.bizId}&curVnumber=${this.versionId}&attachmentType=bpm`,
            headers: {
              token: localStorage.getItem('token')
            },
            responseType: 'blob'
          }).then(res => {
            // this.pageLoading = false
            console.log('sss');
            let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
            if (window.navigator && window.navigator.msSaveOrOpenBlob) { // 兼容TMD IE
              navigator.msSaveBlob(blob, this.item.vnumber + '.zip')
            } else { // 其他浏览器
              let url = window.URL.createObjectURL(blob)
              let link = document.createElement('a')
              link.style.display = 'none'
              link.href = url
              link.setAttribute('download', this.item.vnumber + '.zip')
              document.body.appendChild(link)
              link.click()
              window.URL.revokeObjectURL(link.href); //释放掉blob对象
            }
          }).catch(() => {
            // this.pageLoading = false
          })
            
        } else {

        }
      }
    },
    cancel() {
      this.dialogVisible = false
    },
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__title{
  color: red;
}
.content {
  height: 30vh;
  width: 60%;
  margin: 0 auto;
  overflow: auto;
}
.w100 {
  width: 100%;
}
</style>
