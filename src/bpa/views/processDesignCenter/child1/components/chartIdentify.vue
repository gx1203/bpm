<template>
  <div>
    <el-dialog :title="$t('intelligentIdentification')" :visible.sync="dialogFormVisible" width="50%"
      :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form label-width="100px" style="display:flex;justify-content: space-around;padding-bottom:20px">
        <!--<el-row>-->
        <!--<el-col :span="24">-->
        <!--<el-form-item label="风格:">-->
        <!--<el-radio-group v-model="processStyle">-->
        <!--<el-radio-button label="changhong" />-->
        <!--<el-radio-button label="huangshan" />-->
        <!--<el-radio-button label="langji" />-->
        <!--</el-radio-group>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--</el-row>-->
         <!-- :label="$t('ImageResolution')+':'" -->
        <div class="bbox">
          <div class="sukbox">
            <!--<p class="showFile">-->
            <!--<span v-for="(item, index) in datalist" :key="index">-->
            <!--{{item.name}}-->
            <!--<i class="el-icon-close cursor-pointer" @click="delClick(index)"></i>-->
            <!--</span>-->
            <!--</p>-->
            <el-upload list-type="picture-card" ref="upload" :action="action" :on-change="handleChange" :show-file-list="false"
              :file-list="fileList" :on-success="successUpload" :limit="1" :on-exceed="handleExceed"
              :auto-upload="false">
              <i class="el-icon-plus"></i>
              <!-- <el-button slot="trigger" size="mini" type="primary">{{$t('selectTheFile')}}</el-button> -->
            </el-upload>
            <p>{{ $t('ImageResolution') }}</p>
          </div>
        </div>
        <!-- 上传附件 -->
         <!-- :label="$t('WordParsing')+':'" -->
        <div class="bbox">
          <div class="sukbox">
          <el-upload list-type="picture-card" ref="wordUpload" :action="action" accept=".docx" :on-success="handlerFileUploadSuccess"
            :show-file-list="false">
            <i class="el-icon-plus"></i>
            <!-- <el-button size="mini" type="primary">{{$t('selectTheFile')}}</el-button> -->
          </el-upload>
          <p>{{ $t('WordParsing') }}</p>
          </div>
        </div>
        <!-- viso解析 -->
         <!-- :label="$t('visoparsing')+':'" -->
         <div class="bbox">
          <div class="sukbox">
            <el-upload list-type="picture-card" ref="visoUpload" :action="visoaction" accept=".vsd,.vsdx" :before-upload="beforevisoUpload" :on-success="handlervisoFileUploadSuccess"
              :show-file-list="false">
              <i class="el-icon-plus"></i>
            </el-upload>
            <p>{{ $t('visoparsing') }}</p>
          </div>
         </div>
        
      </el-form>
      <!-- <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="confirmForm">确定</el-button>
            <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>-->
    </el-dialog>

    <!-- 预览 -->
    <el-dialog :title="$t('preview1')" :visible.sync="viewVisible" width="90%" :append-to-body="true"
      :close-on-click-modal="false" :close-on-press-escape="false" v-loading="loading">
      <el-row>
        <div v-if="isviso" style="width: 48%; height: 500px;overflow: scroll;display: inline-block;" >
          <el-image style="width:100%" :src="activeName">
          </el-image>
        </div>
        <iframe v-else border="0" width="48%" height="500px" :src="imgUrl" style="box-sizing:border-box"></iframe>
        <iframe border="0" width="48%" height="500px" :src="iframeSrc"></iframe>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmForm" :disabled="!flowChartId">{{$t('basDataConfig.confirm')}}
        </el-button>
        <el-button @click="viewVisible = false">{{$t('basScheduledTask.cancel')}}</el-button>
      </div>
    </el-dialog>
    <!-- word预览 -->
    <!-- <el-dialog :title="$t('FlowchartList')" :visible.sync="processCartVisible" width="60%" :append-to-body="true"
      :close-on-click-modal="false" :close-on-press-escape="false" v-loading="loading">
      <el-row>
        <el-table :data="wordsList" stripe style="width: 100%">
          <el-table-column type="index" width="50" align="center">
          </el-table-column>
          <el-table-column prop="name" :label="$t('NameOfFlowChart')" width="120" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="preview(scope.$index, scope.row)">{{$t('preview1')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="processCartVisible = false">{{$t('shutDown')}}</el-button>
      </div>
    </el-dialog> -->

    <!-- word流程图预览 -->
    <el-dialog :title="$t('preview1')" :visible.sync="wordViewVisible" width="90%" :append-to-body="true"
      :close-on-click-modal="false" :close-on-press-escape="false" v-loading="loading">
      <el-row>
        <!--<iframe border="0" width="48%" height="500px" :src="wordUrl" style="box-sizing:border-box"></iframe>-->
        <el-image style="width: 48%; height: 500px" :src="wordUrl" :preview-src-list="[wordUrl]">
        </el-image>
        <iframe border="0" width="48%" height="500px" :src="iframeWordSrc"></iframe>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="processCartConfirmForm" :disabled="!flowWordId">
          {{$t('basProcessTree.confirm')}}</el-button>
        <el-button @click="wordViewVisible = false">{{$t('cancel')}}</el-button>
      </div>
    </el-dialog>

    <!-- viso -->
    <el-dialog :title="$t('preview1')" v-loading="sloading" :visible.sync="dialogvisoVisible" width="90%" :append-to-body="true"
      :close-on-click-modal="false" :close-on-press-escape="false">
      <el-tabs v-if="visoimgList" v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane style="height: 500px;overflow-y: auto;" v-for="(item,index) in visoimgList" :key="index" :label="'图片'+index" :name="item">
          <span slot="label">
            <el-checkbox v-model="checked" @change="checked=[],checked.push(item)" :label="item">{{'解析图片'+(index+1)}}</el-checkbox>
          </span>
          <img :src="item" alt="" v-if="item">
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="toiframe" :disabled="checked.length==0">
          {{$t('basProcessTree.confirm')}}</el-button>
        <el-button @click="dialogvisoVisible = false">{{$t('cancel')}}</el-button>
      </div>
    </el-dialog>

    <wordPreview v-model="processCartVisible" :idData="idData" :modelid="modelid" :wordsList="wordsList" />
  </div>
</template>

<script>
import cookie from 'js-cookie'

import { parseVisoFile,chartIdentify, wordIdentify, FlowChartPreviewFile, saveToModelHistory, wordSaveToModelFlowChart,importVsdJsonByUrl, importFlowWord,vsdToJpgByImage } from '@/bpa/api/processDesignCenter'
import wordPreview from './wordPreview'
export default {
  name: 'chartIdentify',
  components: {
    wordPreview
  },
  data () {
    return {
      isviso:false,
      activeimg:'',
      sloading:false,
      checked:[],
      activeName: '',
      visoimgList:{
      },
      dialogvisoVisible:false,
      userId: cookie.get('username'),
      loading: false,
      fileList: [],
      wordFileList: [],
      datalist: [],
      dialogFormVisible: false,
      viewVisible: false,
      host2: `${process.env.HOST_URL + process.env.BASE_URL}`,
      url: '',
      iframeSrc: '',
      iframeSrcJump: '', // 跳转url
      ids: '',
      processStyle: 'changhong',
      flowChartId: '',
      wordsList: [],
      processCartVisible: false,
      iframeWordSrc: '',
      iframeWordSrcJump: '', // 跳转url
      wordViewVisible: false,
      wordUrl: '',
      flowWordId: '',
      idData: {},
      imgFileData: {}
    }
  },
  computed: {
    host () {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    host3 () {
      return process.env.VUE_APP_HOST_URL
    },
    baseUrl () {
      return process.env.VUE_APP_BASE_URL
    },
    html () {
      return process.env.VUE_APP_BPA_HTML_URL
    },
    visoaction(){
      return `${this.host}/listhistory/parseVisoFile`
    },
    action () {
      return `${this.host}/attach/upload?username=${this.userId}`
    },
    imgUrl () {
      return `${this.host}/document/print/${this.ids}?username=${this.userId}`
    }
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
    bpmid: {
      type: String,
      default: ''
    },
    upType: {
      type: String,
      default: ''
    }
  },
  watch: {
    value (val) {
      if (val) {
        this.dialogFormVisible = true
      }
    },
    dialogFormVisible (val) {
      this.$emit('input', val)
      if (!val) {
        this.fileList = []
        this.datalist = []
      }
    }
  },
  methods: {
    beforevisoUpload(){
      this.sloading = true
      this.dialogvisoVisible = true
      // setTimeout(() => {
      //   this.$message({
      //     message:"超时"
      //   })
      //   this.sloading = false
      // }, 30000);
    },
    toiframe(){
      this.dialogvisoVisible = false
      this.dialogFormVisible = false
      this.loading = true
      this.isviso = true
      importVsdJsonByUrl(
        {
          listId:this.modelid,
          imageUrl:this.checked[0],
        }
      ).then(res=>{
        if (!res) {
          let self = this
          this.loading = false
          self.iframeSrc = ''
          self.iframeSrcJump = ''
          return
        }
        this.$message({
          type: 'success',
          message: '导入成功!'
        })
        this.dialogFormVisible = false
        FlowChartPreviewFile(this.modelid).then(resp => {
          console.log(resp)
          this.imgFileData = resp[0]
          this.flowChartId = resp[0].id
          this.iframeSrc = this.host3 +
            this.html +
            '/leftMenu/flowChartView/BaseNewPage.html?id=' +
            this.flowChartId +
            '&listid=' +
            this.modelid + '&isReadAttr=true'
          this.iframeSrcJump = this.host3 +
            this.html +
            '/leftMenu/BaseNewPage.html?id=' +
            this.flowChartId +
            '&listid=' +
            this.modelid + '&isReadAttr=no'
          console.log(this.iframeSrc, this.iframeSrcJump)
          this.loading = false
        }).catch((e) => {
          this.loading = false
        })
        this.viewVisible = true
      })
    },
    handleClick(tab, event){
      
    },
    handleExceed (files, fileList) {
      this.$message.warning({
        type: 'warning',
        message: '只能上传一个文件！'
      })
      this.fileList = []
    },
    handleChange (file, fileList) {
      if (!/\.(jpg|jpeg|png|vsd|vsdx)$/.test(file.name)) {
        this.$message({
          type: 'warning',
          message: '只能上传.jpg, .jpeg, .png, .vsd, .vsdx中任一格式的文件！'
        })
        this.fileList = []
        return false
      }
      this.datalist = JSON.parse(JSON.stringify(fileList))
      this.$refs.upload.submit()
    },
    successUpload (response, file, fileList) {
      let self = this
      this.isviso = false
      this.ids = response.id
      this.loading = true
      chartIdentify({
        listid: this.modelid,
        id: response.id,
        style: this.processStyle
      }).then(res => {
        console.log(res)
        if (!res) {
          this.loading = false
          self.iframeSrc = ''
          self.iframeSrcJump = ''
          return
        }
        this.$message({
          type: 'success',
          message: '导入成功!'
        })
        this.dialogFormVisible = false
        FlowChartPreviewFile(this.modelid).then(resp => {
          console.log(resp)
          this.imgFileData = resp[0]
          this.flowChartId = resp[0].id
          self.iframeSrc = self.host3 +
            self.html +
            '/leftMenu/flowChartView/BaseNewPage.html?id=' +
            self.flowChartId +
            '&listid=' +
            self.modelid + '&isReadAttr=true'
          self.iframeSrcJump = self.host3 +
            self.html +
            '/leftMenu/BaseNewPage.html?id=' +
            self.flowChartId +
            '&listid=' +
            self.modelid + '&isReadAttr=no'
          console.log(self.iframeSrc, self.iframeSrcJump)
          this.loading = false
        }).catch((e) => {
          this.loading = false
        })
      })
      this.viewVisible = true
    },
    // viso解析
    handlervisoFileUploadSuccess(res){
      this.visoimgList = res.data.images
      this.dialogvisoVisible = true
      this.activeName = this.visoimgList[0]
      this.sloading = false
    },
    // word 解析
    handlerFileUploadSuccess (res) {
      this.idData = {
        'listId': this.modelid,
        'fileId': res.id
      }
      this.dialogFormVisible = false
      this.processCartVisible = true

      // this.docFile = [{
      //   filename: res.newName,
      //   filesize: res.size + 'B',
      //   downloadUrl: this.host + '/attach/download/' + res.id,
      //   status: '已上传',
      //   fileId: res.id
      // }]
      // console.log(this.docFile)


      // wordIdentify({
      //   listid: this.modelid,
      //   id: res.id
      //   // style: this.processStyle
      // }).then(res => {
      //   console.log(res)
      //   this.dialogFormVisible = false
      //   this.processCartVisible = true
      //   FlowChartPreviewFile(this.modelid).then(resp => {
      //     console.log(resp)
      //     this.wordsList = resp
      //     this.loading = false
      //   }).catch((e) => {
      //     this.loading = false
      //   })
      // })
    },
    // 预览
    preview (index, row) {
      let self = this
      wordSaveToModelFlowChart({
        id: row.id
        // style: this.processStyle
      }).then(res => {
        FlowChartPreviewFile(row.listid).then(resp => {
          this.wordViewVisible = true
          self.flowWordId = row.id
          this.wordUrl = row.url
          this.iframeWordSrc = self.host3 +
            self.html +
            '/leftMenu/flowChartView/BaseNewPage.html?id=' +
            self.flowWordId +
            '&listid=' +
            row.listid + '&isReadAttr=true'
          console.log(this.iframeWordSrc)
          this.iframeWordSrcJump = self.host3 +
            self.html +
            '/leftMenu/BaseNewPage.html?id=' +
            self.flowWordId +
            '&listid=' +
            row.listid + '&isReadAttr=no'
        })
      })
    },
    // word 保存
    processCartConfirmForm () {
      this.$confirm('是否确认保存?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        saveToModelHistory(this.flowWordId, 'Y').then(res => {
          this.wordViewVisible = false
          this.processCartVisible = false
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.$emit('closeChart', this.iframeWordSrcJump)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    confirmForm () {
      let self = this
      this.$confirm('是否确认保存?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        saveToModelHistory(this.flowChartId, 'Y').then(res => {
          this.viewVisible = false
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          const { href } = this.$router.resolve({
            path: "/doorCenter/TheProcessIsv",
            query: {
              theProcessIs: 'true',
              listid: this.imgFileData.listid,
              id: this.imgFileData.id,
              name: this.imgFileData.name,
              // state: this.selectedItem.state,
              // code: this.selectedItem.code,
              modelid: this.modelid
            }
          })
          window.open(href, '_blank')
          // self.$emit('closeChart', this.iframeSrcJump)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    delClick (idx) {
      this.datalist.splice(idx, 1)
      this.fileList = []
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.uploadcontent {
  // width: 100%;
  padding-bottom: 10px;
  p {
    float: left;
    width: calc(100% - 85px);
    min-height: 29px;
  }
}
.bbox{
  display: inline-block;
}
.sukbox{
  // display: flex;
  p{
    text-align: center;
    padding: 10px;
  }
}
.showFile {
  span {
    line-height: 29px;
    padding: 0 20px 0 8px;
    height: 29px;
    border: 1px solid #519eff;
    display: inline-block;
    vertical-align: top;
    max-width: 100%;
    border-radius: 3px;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    i {
      position: absolute;
      right: 4px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
