<template>
  <div>
    <el-dialog :title="$t('preview1')" width="85%" :visible.sync="dialogFormVisible" :append-to-body="true"
      :close-on-click-modal="false" :close-on-press-escape="false" v-loading="loading" class="dialog">
      <!-- <el-row class="text-right">
        <el-button @click="getWord">{{$t('refresh')}}</el-button>
      </el-row> -->
      <el-tabs type="border-card" style="box-shadow: none;" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-if="wordData.doc && wordData.doc.length > 0" name="first">
          <!-- <div class="viewDoc">
            <manage-father :data="editContent.childrens" />
          </div> -->
          <span slot="label">
            <el-checkbox v-model="checked"></el-checkbox>
            {{wordData.doc[0].content}}
          </span>
          <div v-for="(tab, index) in wordData.doc" :key="index">
            <h2 class="docTitle" v-if="tab.type === 'title'">{{tab.content}}</h2>
            <p v-else class="letter" :class="{'section': tab.type === 'section'}">
              {{tab.content}}
            </p>
          </div>
        </el-tab-pane>
        <el-tab-pane v-for="(tab, index) in wordData.images" :key="index" :name="'second' + index">
          <span slot="label">
            <el-checkbox v-model="tab.checked" @change="changeBox(index)"></el-checkbox>
            {{tab.name}}
          </span>
          <div>
            <el-image style="width:48%;height:500px;" :z-index="3500" :src="tab.url" :preview-src-list="[tab.url]">
            </el-image>
            <iframe v-if="tab.iframeWordSrc" border="0" width="48%" height="500px" :src="tab.iframeWordSrc"></iframe>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmForm">{{$t('basDataConfig.confirm')}}</el-button>
        <el-button @click="dialogFormVisible = false">{{$t('basScheduledTask.cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import manageFather from './manage_father.vue'
import { queryContent, FlowChartPreviewFile, importFlowWord, saveToModelHistory, importVsdJsonByUrl, importWordSave } from '@/bpa/api/processDesignCenter'

export default {
  components: {
    manageFather
  },
  data () {
    return {
      checked: false,
      loading: false,
      dialogFormVisible: false,
      editContent: {},
      wordData: {},
      checkIndex: '',
      activeName: 'first'
    }
  },
  computed: {
    // host () {
    //   return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    // },
    host3 () {
      return process.env.VUE_APP_HOST_URL
    },
    // baseUrl () {
    //   return process.env.VUE_APP_BASE_URL
    // },
    html () {
      return process.env.VUE_APP_BPA_HTML_URL
    },
    // action () {
    //   return `${this.host}/attach/upload?username=${this.userId}`
    // },
    // imgUrl () {
    //   return `${this.host}/document/print/${this.ids}?username=${this.userId}`
    // }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    modelid: {
      type: String,
      default: ''
    },
    idData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  watch: {
    value (val) {
      if (val) {
        this.dialogFormVisible = true
        this.activeName = 'first'
        this.checkIndex = ''
        this.getWord()
      }
    },
    dialogFormVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    changeBox (index) {
      this.wordData.images.forEach((e, i) => {
        if (index !== i) {
          e.checked = false
        }
      })
    },
    handleClick (tab) {
      if (tab.index === this.checkIndex) return
      this.checkIndex = tab.index
      if (tab.index < 1) return
      let item = this.wordData.images[tab.index - 1]
      if (item.iframeWordSrc) return
      let that = this
      this.loading = true
      importVsdJsonByUrl({
        imageUrl: item.url,
        listId: item.listid,
        style: ''
      }).then(rt => {
        that.$nextTick(() => {
          that.$set(that.wordData.images[tab.index - 1], 'iframeWordSrc', that.host3 + that.html + '/leftMenu/flowChartView/BaseNewPage.html?id=' + item.id + '&listid=' + item.listid + '&isReadAttr=true')
          that.$set(that.wordData.images[tab.index - 1], 'saveId', rt)
        })
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getWord () {
      this.checked = false
      this.wordData = {}
      this.loading = true
      importFlowWord(this.idData).then(res => {
        if (!res) return false
        this.wordData = res
        // if (res.images && res.images.lenght > 0) {
        res.images.forEach(element => {
          element.iframeWordSrc = ''
        })
        // }
        this.loading = false
      }).catch((e) => {
        this.loading = false
      })
    },
    confirmForm () {
      let num = 0
      this.wordData.images.forEach(element => {
        element.checked ? num++ : ''
      })
      if (num < 1 && !this.checked) {
        this.$message('至少勾选一个')
        return
      }
      let arr = this.wordData.images.filter(x => x.checked)
      this.$confirm(arr.length > 0 ? '是否确认保存?' : '是否确认不导入流程图?', '提示', {
        confirmButtonText: this.$t('basScheduledTask.confirm'),
        cancelButtonText: this.$t('basScheduledTask.cancel'),
        type: 'warning'
      }).then(() => {
        this.loading = true
        importWordSave({
          ...this.idData,
          isSaveContent: this.checked ? 'Y' : 'N',
          flowChartId: arr.length > 0 ? arr[0].saveId : '',
          isCover: 'Y'
        }).then(res => {
          this.dialogFormVisible = false
          this.loading = false
          // this.$message({
          //   type: 'success',
          //   message: '保存成功!'
          // })
          const { href } = this.$router.resolve({
            path: "/doorCenter/TheProcessIsv",
            query: {
              theProcessIs: 'true',
              listid: arr.length > 0 ? arr[0].listid : '',
              id: arr.length > 0 ? arr[0].saveId : '',
              name: arr.length > 0 ? arr[0].name : '',
              // state: this.selectedItem.state,
              // code: this.selectedItem.code,
              modelid: this.modelid
            }
          })
          window.open(href, '_blank')
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => { })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog {
  /deep/ .el-tabs__content {
    height: 300px;
    overflow-y: scroll;
  }
}
.docTitle {
  font-size: 20px;
  text-align: center;
  line-height: 32px;
}
.letter {
  word-break: break-all;
  line-height: 22px;
  text-indent: 2.3em;
}
.section {
  font-weight: bold;
  font-size: 16px;
  line-height: 28px;
  text-indent: inherit;
}
</style>
