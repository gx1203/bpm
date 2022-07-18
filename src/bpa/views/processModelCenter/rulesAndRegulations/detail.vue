<template>
  <div id="processDetails">
    <el-row :gutter="10">
      <el-col :span="16">
        <div class="left_top">
          <el-row class="margin-b15" style="border-radius: 10px;padding: 20px;background: #fff;margin-bottom: 20px;">
            <el-col :span="20">
              <p class="title">{{!docInfo.docTitle ? '' : docInfo.docTitle}}</p>
            </el-col>
<!--            <el-col :span="4">-->
<!--              <el-button type="primary" style="float:right" @click="goBack">{{$t("returnList")}}</el-button>-->
<!--            </el-col>-->
          </el-row>


          <el-row class="margin-t5" style="background-color:white;font-size:12px;padding: 0 20px;transform:translateY(-25px);border-radius:15px;">
            <el-col :span="19"
                    class="line_middle">
              <span>{{docInfo.docAuthorDis}}</span>
              <!-- <span style="margin-right:3px">管理员</span> -->
              <i class="el-icon-time"  style="margin:0 5px; font-size: 14px;" ></i>
              <!-- <i class="icon iconfont icon-shijian" /> -->
              <span>{{ docInfo.createDate }}</span>
              <!-- <span>2021-05-08 12:00:00</span> -->
            </el-col>
            <el-col :span="5"
                    :data="tableList"
                    class="text_right line_middle font16" style="font-size:12px;text-align:right;">
              <span class="item margin-r10">
                <i class="el-icon-view"></i>
                <span>{{tableList.readSum}}</span>
                <!-- <span>2</span> -->
              </span>
              <span class="item margin-r10">
                <i class="el-icon-s-comment" />
                <span>{{tableList.discuss}}</span>

              </span>
              <span class="item margin-r10">
                <i @click="handlerGoodAndBad('good')"
                   :class="['icon', 'iconfont', 'icon-zan', tableList.actionstate === '0' ? 'active' : '']" style="color:#333;transform:translateY(-2px)"></i>
                <!-- <i class="el-icon-thumb"></i> -->
                <span>{{tableList.goodactionnum}}</span>

              </span>
              <span class="item">
                <i
                  :class="['icon', 'iconfont', 'icon_ceshi', 'icon-cai', tableList.actionstate === '1' ? 'active' : '']" style="color:#333"
                  @click="handlerGoodAndBad('bad')"
                />
                <span>{{ tableList.badactionnum }}</span>
              </span>
            </el-col>
          </el-row>

          <div class="jpg_wrapper" :class="{'full-show': isFull}" >
            <div class="fullscreen-btn">
              <i class="fa fa-arrows-alt" @click.stop="toolclick" :title="isFull ? $t('exitFullScreen') : $t('fullScreen')"/>
            </div>
            <div class="w100 h100 imgContainer" v-if="!!docInfo.docId">
              <iframe border="0" class="w100 h100"
                :src="host+'/document/printnew/'+docInfo.docId + '/' + docInfo.originalName"></iframe>
            </div>
          </div>
        </div>

    <div class="crics">
     <el-row :gutter="10" style="margin-left:20px;width:90%">
      <el-col>
        <div class="left_btm">
          <p style="line-height:30px;">
            <span style="color:red;">{{commentList.length}}</span>{{ $t('comments') }}
          </p>
          <el-input clearable
                    type="textarea"
                    resize="none"
                    :rows="3"
                    maxlength="1000"
                    v-model.trim="commontText"
                    @input="descInputText"
                    >
                    <!-- @input="descInputText" -->
            </el-input>
          <span class="tips"></span>
          <span class="text">{{$t('limit')}}{{remnant2}}/{{$t('lessThan1000Words')}}</span>
          <p style="margin-top: 10px;">
            <el-button type="primary"
                       @click="sendComment">{{$t('makeComments')}}</el-button>
          </p>
          <el-scrollbar class="comment_container">
            <div v-for="item in commentList"
                 :key="item.id"
                 style="border-bottom: 1px solid #f6f6f6;padding-bottom: 10px;">
              <div class="comment_item">
                <div class="comment_header">{{item.createby}}</div>
                <div class="comment_text">{{item.description}}</div>
                <div class="comment_footer">
                  <div>
                    <span>{{item.createon | formateDate}}</span>
                    <span
                      v-if="item.createid===userid"
                      class="delete"
                      @click="deleteComment('comment', item.id)"
                    >{{$t('delete')}}</span>
                    <span class="reply" @click="showReply('replyInput', item.id)">
                      <i class="icon iconfont icon-comment"></i>{{$t('reply')}}
                    </span>
                  </div>
                  <div
                    class="reply_input_wrapper"
                    v-show="replyInput.isShow && currentId === item.id"
                  >
                    <el-input clearable v-model.trim="replyInput.text" maxlength="50"></el-input>
                    <span class="tips2"></span>
                    <span class="text">{{$t('limit50Words')}}</span>
                    <el-button
                      class="reply_input"
                      type="primary"
                      plain
                      @click="replyComment('replyInput', item)"
                    >{{$t('replyToComment')}}</el-button>
                  </div>
                </div>
                <div class="reply_wrapper"
                   v-for="(reply,index) in item.reply"
                   :key="index">
                <div class="reply_header">
                  <span>{{reply.commonname}}</span>{{ $t('reply') }}
                  <span>{{reply.replyname}}</span>
                </div>
                <div class="reply_text">{{reply.description}}</div>
                <div class="reply_footer">
                  <div>
                    <span>{{reply.createon | formateDate}}</span>
                    <span class="delete"
                          v-if="reply.createby===userid"
                          @click="deleteComment('reply', reply.id)">删除</span>
                    <span class="reply"
                          @click="showReply('replyInput2', reply.id)">
                      <i class="icon iconfont icon-comment"></i>{{ $t('reply') }}
                    </span>
                  </div>
                  <div class="reply_input_wrapper"
                       v-show="replyInput2.isShow && currentId === reply.id">
                    <el-input v-model.trim="replyInput2.text"
                              maxlength="50"
                              ></el-input>
                    <span class="tips2"></span>
                    <span class="textarea">限制50字以内</span>
                    <el-button class="reply_input"
                               type="primary"
                               plain
                               @click="replyComment('replyInput2', item)">回复评论</el-button>
                  </div>
                </div>
               </div>
              </div>

            </div>
          </el-scrollbar>
        </div>
      </el-col>
    </el-row>
    </div>
      </el-col>
      <el-col :span="8">
        <div class="right_top">
          <el-row class="border_btm">
            <div class="right-top-title">
              <i class="el-icon-tickets margin-r5"></i>{{$t("basicAttributes")}}
            </div>
          </el-row>
          <p>
            <span class="tt">{{$t("title")}}:</span>
            <span>{{docInfo.docTitle}}</span>
          </p>
          <p>
            <span class="tt">{{$t("uploadTime")}}:</span>
            <span>{{docInfo.createDate}}</span>
          </p>
          <p>
            <span class="tt">{{$t("releaseTime")}}:</span>
            <span>{{docInfo.effectiveDate | forDate}}</span>
          </p>
          <p>
            <span class="tt">{{$t("version")}}:</span>
            <span>{{docInfo.version}}</span>
          </p>
          <p>
            <span class="tt">{{$t("department")}}:</span>
            <span>{{!docInfo.orglist ? '':docInfo.orglist.map(item => item.value).join(",")}}</span>
          </p>
          <p>
            <span class="tt">{{$t("artificialPerson")}}:</span>
            <span>{{!docInfo.signerlist ? '':docInfo.signerlist.map(item => item.cnname).join(",")}}</span>
          </p>
          <p>
            <span class="tt">{{$t("releasePeople")}}:</span>
            <span>{{docInfo.provideruser}}</span>
          </p>
          <!-- <p>
            <span class="tt">{{$t("classificationSystem")}}:</span>
            <span>{{docInfo.system}}</span>
          </p> -->
          <!-- <el-row class="border_btm">
            <el-col :span="24" class="title">
              <i class="el-icon-tickets margin-r5"></i>{{$t("classify")}}
            </el-col>
            <el-col :span="24">
              {{!docInfo.folderDocumentList ? '':(docInfo.folderDocumentList[0].folderid === '5002' ? '规章管理中心/部门职责、其他':'规章管理中心/手册体系文件')}}
            </el-col>
          </el-row> -->
          <!-- <el-row class="border_btm">
            <el-col :span="24" class="title">
              <i class="el-icon-tickets margin-r5"></i>{{$t("otherVersions")}}
            </el-col>
            <el-col :span="24">
              <p v-for="item in docInfo.revisionHistory" :key="item.docId">
                <router-link :to="'/rulesDetail/'+item.docId+'/'+item.revId">
                  <a :class="{'active':(docInfo.revlabel === item.revlabel)}">{{item.revlabel}}</a>
                </router-link>
              </p>
            </el-col>
          </el-row> -->
          <!-- <el-row class="border_btm">
            <el-col :span="24" class="title">
              <i class="el-icon-tickets margin-r5"></i>{{$t("attachment")}}
            </el-col>
            <el-col :span="24" class="font-blue">
              <a :href="viewFile(docInfo.docId,docInfo.originalName)" target="_blank">{{docInfo.originalName}}</a>
              <i class="el-icon-download margin-l5" @click="downloadDoc"></i>
            </el-col>
          </el-row> -->
        </div>
        <div v-if="docInfo.revisionHistory && docInfo.revisionHistory.length !== 0" class="ruleDetails-right-middle">
          <div class="ruleDetails-right-top-title">
            <i class="el-icon-tickets margin-r5"></i>历史版本
          </div>
              <div v-for="(item, index) in docInfo.revisionHistory" v-if="index < 3" :key="index">
                <div class="ruleDetails-right-top-words">
                    <span style="font-weight: bold;margin-right: 12px;">{{ item.revlabel }}</span>
                    <a v-if="item.docTitle" :href="'#rulesDetail/' + item.docId  + '/' + item.revId" :title="item.docTitle" target="_blank">
                      <span class="word">{{ item.docTitle }}
                      </span>
                    </a>
                </div>
                <div/>
              </div>
              <div v-if="docInfo.revisionHistory.length > 3" class="span-st">
                <span
                  class="more"
                  @click="historyDialog = true"
                >查看更多...</span
                >
              </div>
        </div>
        <div v-if="docInfo.relationProcess && docInfo.relationProcess.length !== 0" class="ruleDetails-right-bottom">
          <div class="ruleDetails-right-top-title">
            <i class="el-icon-tickets margin-r5"></i>相关流程
          </div>
          <div style="display:flex;position: relative;min-height:80px">
                <div class="proceeLeftBorder" />
                <div class="relationMargin">
                  <div v-if="docInfo.relationProcess.length > 0" class="relationProcess ">
                    <div class="relationRuleName">
                      <div class="relationRuleNameTop">
                        <div class="relationRuleNameText">制度</div>
                        <div class="relationRuleNameCircle" />
                      </div>
                      <div style="margin:0 19px">
                        {{ !docInfo.docTitle ? "" : docInfo.docTitle }}
                      </div>
                    </div>
                    <el-row
                      v-for="(item, index) in docInfo.relationProcess"
                      v-if="index < processNum"
                      :key="index"
                    >
                      <div class="relationProcessName" @click="toDetail(item)">
                        <div class="relationProcessLine" />
                        <div class="relationProcessWord">
                          <svg
                            t="1599648530956"
                            class="icon"
                            viewBox="0 0 1024 1024"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            p-id="2493"
                            width="16"
                            height="16"
                          >
                            <path
                              d="M724.032 640V568H299.904V640H416v288h-320V640h116.032V480h256V395.584H352V96h320v299.584H555.968V480h256V640H928v288h-320V640h116.032z m115.968 88h-144v112h144v-112z m-512 0h-144v112h144v-112z m112-544v123.584h144V184h-144z"
                              fill="#13227a"
                              p-id="2494"
                            />
                          </svg>
                          <span class="word"> {{ item.name }}</span>
                        </div>
                      </div>
                    </el-row>
                  </div>
                </div>
              </div>
              <div v-if="docInfo.relationProcess.length > 2" class="span-st">
                <span class="more" @click="openMore(1)">{{ processW }}</span>
              </div>
        </div>
        <div class="ruleDetails-right-middle">
          <div class="ruleDetails-right-top-title" v-if="docInfo.dmCorekeyList && docInfo.dmCorekeyList.length !== 0">
            <i class="el-icon-tickets margin-r5"></i>关键风险控制点
          </div>
          <div v-for="(item, index) in docInfo.dmCorekeyList" :key="index">
            <div class="ruleDetails-right-top-wordss">
              <span>{{ (index+1) + '、' +item.risk  +'（'+ item.code + '）'}}</span>
            </div>
            <div/>
          </div>
          <div class="ruleDetails-right-top-title" v-if="docInfo.dmDocList && docInfo.dmDocList.length !== 0">
            <i class="el-icon-tickets margin-r5"></i>制度支持文件
          </div>
          <div v-for="(item, index) in docInfo.dmDocList" :key="index">
            <div class="ruleDetails-right-top-wordss">
              <el-link
                type="primary"
                :underline="false"
                target="_blank"
                :href="viewFile(item.docid)"
              >
                {{ (index+1) + '、' +item.name }}
              </el-link>
            </div>
            <div/>
          </div>
          <!-- <div class="ruleDetails-right-top-title" v-if="docInfo.newsDtosList && docInfo.newsDtosList.length !== 0">
            <i class="el-icon-tickets margin-r5"></i>相关企业标准
          </div> -->
          <div v-for="(item, index) in docInfo.newsDtosList" :key="index">
            <span></span>
            <div class="ruleDetails-right-top-wordss">
              <span>{{index+1}}、{{item.enname}}（{{item.title}}）</span>
            </div>
            <div/>
          </div>
        </div>
      </el-col>
    </el-row>


    <!-- <el-row :gutter="10" class="margin-t15">
      <el-col :span="24">
        <div class="padding10px bg-white">
          <el-table
            :data="tableList"
            border
            class="main_tab">
            <el-table-column
              :label="$t('number')"
              type="index">
            </el-table-column>
            <el-table-column
              :label="$t('subject')">
            </el-table-column>
            <el-table-column
              prop="enname"
              :label="$t('approvalNodeName')">
            </el-table-column>
            <el-table-column
              prop="version"
              :label="$t('approver')">
            </el-table-column>
            <el-table-column
              prop="createon"
              :label="$t('approvalTime1')">
            </el-table-column>
            <el-table-column :label="$t('approvalOperation')">
            </el-table-column>
            <el-table-column
              :label="$t('remarks')">
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>-->

    <!-- 历史版本 -->
    <el-dialog
      :visible.sync="historyDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="历史版本"
      width="65%"
    >
      <div>
        <el-table :data="docInfo.revisionHistory" border class="main_tab">
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column prop="docTitle" label="文件标题" min-width="250px">
            <template slot-scope="scope">
              <a :href="'#/rulesDetail/'+scope.row.docId+'/'+scope.row.revId" target="_blank">
                <p>{{ scope.row.docTitle }}</p>
              </a>
            </template>
          </el-table-column>
          <el-table-column prop="revlabel" label="版本" width="140">
            <template v-if="scope.row.revlabel" slot-scope="scope"
              >{{ scope.row.revlabel }}</template
            >
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="historyDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="historyDialog = false"
        >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 针对某一段进行评论 -->
    <!-- <el-dialog
      :title="$t('addComments')"
      :visible.sync="dialogFormVisible"
      width="50%"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="commentsRef" :model="commentsform" :rules="commentsrules" label-width="100px">
        <el-form-item :label="$t('commentsContent') + ' :'" prop="commontText" class="label-height-auto">
          <el-input
            v-model.trim="commentsform.commontText"
            type="textarea"
            resize="none"
            :rows="5"
            maxlength="1000"
            :placeholder="$t('placeholderText.pleaseEnterCommentsContent')"
          />
          <span class="text">{{ $t('limit') }}{{ commentsform.commontText.length }}/{{ $t('lessThan1000Words') }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmForm">
          {{ $t('confirm') }}
        </el-button>
        <el-button @click="dialogFormVisible = false">
          {{ $t('cancel') }}
        </el-button>
      </div>
    </el-dialog> -->

    <!-- 针对某一段添加标签 -->
    <!-- <el-dialog
      title="创建标签"
      :visible.sync="targetdialogFormVisible"
      width="50%"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="targetRef" :model="targetform" :rules="targetrules" label-width="100px">
        <el-form-item label="标签内容 :" prop="commontText" class="label-height-auto">
          <el-input
            v-model.trim="targetform.commontText"
            type="textarea"
            resize="none"
            :rows="5"
            maxlength="1000"
            placeholder="请输入标签内容"
          />
          <span class="text">限制{{ targetform.commontText.length }}/{{ $t('lessThan1000Words') }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="targetconfirmForm">
          {{ $t('confirm') }}
        </el-button>
        <el-button @click="targetdialogFormVisible = false">
          {{ $t('cancel') }}
        </el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import {
  getDocInfos,
  getTableInfo,
  getReadNum
} from '@/bpa/api/processModelCenter/rulesAndRegulations/detail'
import { queryReleasedCopy } from "@/bpa/api/rulesCenter/handbookFiles"
import {
  saveComment,
  queryComment,
  saveCommentReply,
  deleteComment,
  deleteCommentReply,
  getWordJpg,
  goodAction,
  badAction,
  getImportWord,
  viewProcessDoc,
  getProcessDoc,
  getRecentPublished,
  addComments
} from '@/bpa/api/processModelCenter/processCommunity'
import { downloadFile2 } from '@/bpa/utils/common'
import '@/bpa/assets/fonts/font_zan/iconfont.css'
import '@/bpa/assets/fonts/font_zan/iconfont.eot'
import '@/bpa/assets/fonts/font_zan/iconfont.ttf'
import '@/bpa/assets/fonts/font_zan/iconfont.svg'
import fileOperation from '@/bpa/mixins/fileDownView'
export default {
  mixins: [fileOperation],
  data () {
    return {
      userid:JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').id,
      replyInput2: {
        text: '',
        isShow: false
      },
      replyInput: {
        text: '',
        isShow: false
      },
      currentId: '',
      historyDialog: false,
      docInfo: {
        revisionHistory: []
      },
      processNum: 3,
      processW: '更多',
      tableList: [],
      commontText:'',
      remnant2: 0, // 文本域输入字数
      commentList:[],
      isFull:false,
      areaMaxLength:'',
      textMaxLength: 50,
    }
  },
  computed: {
    host () {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    docId () {
      return this.$route.params.docid
    },
    revId () {
      return this.$route.params.revId
    }
  },
  mounted () {
    this.getReadNum()
    this.getDocData()
    this.queryComment()
    this.getList()
    // this.getTablelist()
    console.log(this.userid)

  },
  methods: {

    //调用阅读数接口

  getReadNum(){

  getReadNum(this.docId).then(res=>{

  })
  },

    // 放大文件
    toolclick(){
      this.isFull = !this.isFull
    },


    // 下载文件
    downloadFile (fileId) {
      return downloadFile2(fileId)
    },
    // 流程详情
    toDetail(item) {
      var url = '#/processDetails/' + item.id
      window.open(url, '_blank')
    },
    openMore(id) {
      if (id === 1) {
        if (this.processNum === 3) {
          this.processNum = 999
          this.processW = '收起'
        } else {
          this.processNum = 3
          this.processW = '更多'
          console.log(this.processW)
        }
      }
    },
    //评论功能------------------
     descInput() {

      var txtVal3 = this.replyInput2.text.length
      this.remnant1 = txtVal3
      if (this.replyInput2.text.length > this.textMaxLength) {
        this.replyInput2.length = String(this.replyInput2.length).slice(0, this.textMaxLength)
      }
      var txtVal1 = this.replyInput.text.length
       this.remnant1 = txtVal1
       if (this.replyInput.text.length > this.textMaxLength) {
         this.replyInput.length = String(this.replyInput.length).slice(
           0,
           this.textMaxLength
         )
       }
     },

    // 文本域字数限制
    descInputText() {
      var txtVal2 = this.commontText.length
      this.remnant2 = txtVal2
      if (this.commontText.length > this.areaMaxLength) {
        this.commontText.length = String(this.commontText.length).slice(
          0,
          this.areaMaxLength
        )
        console.log(txtVal2)
        txtVal2 = this.commontText.length
        this.remnant2 = txtVal2
      }
    },
    // 发表评论
    sendComment () {
      if (this.commontText === '') {
        this.$message({
          type: 'error',
          message: '您未输入任何文字'
        })
        return
      }
      console.log(222222222222222222)
      let obj = {
        description: this.commontText,
        listid: this.docId
      }
      saveComment(obj).then(res => {
        if (!res) return
        this.$message({
          type: 'success',
          message: '评论成功！'
        })
        this.queryComment()
        this.getDocData()
        this.commontText = ''
        this.remnant2 = 0
      })
    },

    queryComment () {
      queryComment({
        filters: [{ key: 'listid', value: this.docId }],
        orderby: 'createon',
        sort: 'desc',
        pageNum: 1,
        pageSize: 99999
      }).then(res => {
        if (!res) return false
        console.log(res.list)
        res.list.forEach(item => {
          console.log(item.createid)
        })
        console.log(res.list)
        this.commentList = JSON.parse(JSON.stringify(res.list))
        console.log(this.commentList)
      })
    },
    // 回复评论
    showReply(type, id) {
      this[type].isShow = true
      this[type].text = ''
      this.currentId = id
      console.log(id)
    },
    replyComment(type, item) {
      // console.log(type, item)
      // console.log(this[type].text)
        if (this[type].text === '') {
        this.$message({
          type: 'error',
          message: '您未输入任何文字'
        })
        return
      }
      let obj = {
        commentid: item.id,
        // commonby: JSON.parse(
        //   localStorage.getItem('portalCurrentUserInfo') || {}
        // ).name,
        commonby: this.userid,
        description: this[type].text,
        replyby: item.createid
      }

      // return
      saveCommentReply(obj).then(res => {
        if (!res) return
        this.$message({
          type: 'success',
          message: this.$t('hintText.replyCommentsSuccessful')
        })
        this[type].isShow = false
        this.queryComment()
        this.getDocData()
      })

    },

    // 删除评论
    deleteComment(type, id) {
      console.log(id)
      // console.log(this.getUserAuthor)
      let promise
      if (type === 'comment') {
        promise = deleteComment(id)
      } else {
        promise = deleteCommentReply(id)
      }
      promise.then(res => {
        if (res) {
          this.$message({
            type: 'success',
            message: this.$t('hintText.commentsDeletedSuccessfully')
          })
          this.queryComment()
          this.getList()

        }
      })
    },

    // 点赞与踩
    handlerGoodAndBad(type) {
      let promise
      if (type === 'good') {
        promise = goodAction(this.docId)
      } else {
        promise = badAction(this.docId)
      }
      promise.then(message => {
        if(message === '踩成功') {
           message = this.$t('hintText.goodorbad1')
        }
        else if (message === '取消踩成功') {
          message = this.$t('hintText.goodorbad2')
        }else if (message === '不能同时点赞和踩') {
          message = this.$t('hintText.goodorbad3')
        }else if (message === '点赞成功') {
          message = this.$t('hintText.goodorbad4')
        }else if (message === '取消点赞成功') {
          message = this.$t('hintText.goodorbad5')
        }else if (message === '请勿重复点踩') {
          message = this.$t('hintText.goodorbad6')
        }else if (message === '请勿重复点赞') {
          message = this.$t('hintText.goodorbad7')
        }
        this.$message({
          type: 'success',
          message
        })
        this.getList()
      })

    },

    getList(){
      const obj = {
        orderby: "createon",
        pageNum: 1,
        pageSize: 9999,
        sort: "desc",
        filters: [
          { key: "id", opt: "EQ", type: "S", value: this.docId},
        ],
        logic: "and",
      };
      queryReleasedCopy(obj).then((res) => {
        console.log(obj);
        console.log(res);
        if (!res) return false;
        if (res.list && res.list.length > 0) {
          this.tableList = res.list[0]
        }
      });
    },
    getDocData () {
      getDocInfos(this.docId, this.revId).then(res => {
        console.log(res)
        if (!res) return false
        this.docInfo = res
      })
    },
    downloadDoc () {
      window.open(this.downloadFile(this.docInfo.docId))
    },
    getTablelist () {
      getTableInfo(this.docId).then(res => {
        console.log(res)
        if (!res) return false
        this.tableList = res
      })
    },
    goBack () {
      this.$router.push({ name: 'ruleView' })
      // this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
#processDetails {
  height: 100%;
  flex: 1;
  padding: 10px;
  background: #f9fafd;
  overflow: hidden;
  color: #5a5a5a;
  .jpg_wrapper {
    height: 69vh;
    background-color: #fff;
  }
  .text_right {
    text-align: right;
  }
  .left_top {
    height: 100%;
    padding: 0 15px;
    background: #f9fafd;
    .title {
      font-size: 20px;
      font-weight: 500;
    }
  }
  .font-blue {
    color: #52a2ef;
    a {
      color: #52a2ef;
    }
  }
  .right_top {
    height: 224px;
    background: #fff;
    padding: 15px;
    border-radius: 10px;
    .border_btm {
      .active {
        color: #52a2ef;
      }
      .right-top-title{
        font-size: 14px;
        font-weight: bold;
        color: #4c4c4c;
        font-size: 14px;
        border-bottom: 1px solid #ededed;
        margin-bottom: 8px;
        padding-bottom: 8px;
      }
    }
    .title {
      color: #4c4c4c;
      font-size: 14px;
      height: 30px;
      line-height: 30px;
      font-weight: bold;
    }
    .download {
      text-align: right;
      height: 30px;
      span,
      .icon {
        display: inline-block;
        vertical-align: middle;
        font-size: 20px;
        color: #f9a700;
      }
      span {
        font-weight: bold;
        font-size: 16px;
        // color: #000;
      }
      .icon-xiazai {
        color: #000;
        cursor: pointer;
      }
      &:after {
        content: "";
        display: inline-block;
        vertical-align: middle;
        height: 100%;
      }
    }
    p {
      line-height: 24px;
      span {
        font-size: 14px;
      }
    }
  }
  .ruleDetails-right-middle {
    background: rgba(255, 255, 255, 1);
    border-radius: 10px;
    margin-top: 20px;
    margin-bottom: 20px;
    padding-bottom: 12px;
  }
  .ruleDetails-right-top-title {
    font-size: 14px;
    font-weight: bold;
    color: #4c4c4c;
    font-size: 14px;
    margin: 0px 19px 8px 19px;
    padding: 14px 0 8px 0;
    border-bottom: 1px solid rgba(237, 237, 237, 1);
  }
  .ruleDetails-right-top-titles {
    font-size: 14px;
    font-weight: bold;
    color: #4c4c4c;
    font-size: 14px;
    margin: 0px 19px;
    padding: 10px 0;
  }
  .ruleDetails-right-top-wordss {
    margin: 0px 24px;
    font-size: 14px;
    color: rgba(102, 102, 102, 1);
  }
  .ruleDetails-right-top-words {
    margin: 0px 24px;
    font-size: 14px;
    padding-top: 4px;
    color: rgba(102, 102, 102, 1);
  }
  .word {
    border-bottom: 1px solid rgba(45, 66, 175, 1);
    color: rgba(45, 66, 175, 1);
    cursor: pointer;
  }
  .line {
    margin: 0px 19px;
    padding-top: 12px;
    border-bottom: 1px solid rgba(237, 237, 237, 1);
  }
  .more {
    font-size: 14px;
    font-weight: 400;
    color: #bbbbbb;
    line-height: 30px;
    cursor: pointer;
  }
.span-st {
  width: 100px;
  height: 30px;
  border: 1px solid #bbbbbb;
  border-radius: 20px;
  text-align: center;
  margin: auto;
  margin-top: 12px;
}

.proceeLeftBorder {
  position: absolute;
  width: 1px;
  top: 20px;
  // min-height: 100px;
  left: 24px;
  height: 72%;
  background: lightgray;
}
.relationProcess {
  // border-left:1px solid lightgray;
  margin-left: 15px;
  margin-top: 10px;
  .relationRuleName {
    position: relative;
    .relationRuleNameTop {
      .relationRuleNameText {
        border: 1px solid #17c1c4;
        border-radius: 2px;
        padding: 0px 3px;
        font-size: 10px;
        color: #17c1c4;
        position: absolute;
        left: -16px;
        // top: -15px;
      }
    }
    .relationRuleNameCircle {
      position: absolute;
      left: -4px;
      width: 6px;
      height: 6px;
      top: 15px;
      border-radius: 6px;
      background: #17c1c4;
    }
  }
  .relationProcessLine {
    position: absolute;
    width: 40px;
    height: 1px;
    top: 15px;
    background: lightgray;
  }
  .relationProcessName {
    position: relative;
    color: rgba(45, 66, 175, 1);
    // border-bottom: 1px solid rgba(45,66,175,1);
  }
  .relationProcessWord {
    line-height: 36px;
    margin-left: 50px;
    //  border-bottom:1px solid rgba(45, 66, 175, 1);
    color: rgba(45, 66, 175, 1);
    cursor: pointer;
  }
}
.relationMargin {
  // margin-top: 20px;
  margin-left: 10px;
}
  .ruleDetails-right-bottom {
    min-height: 180px;
    background: rgba(255, 255, 255, 1);
    border-radius: 10px;
    margin-top: 20px;
    padding-bottom: 12px;
  }
}
.crics{
  width: 97%;
  margin: 0 auto;
  border-radius: 15px;
  background-color: white;
  margin-top:80px
}
.fullscreen-btn {
  font-size: 20px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 3px;
  box-sizing: border-box;
  i {
    cursor: pointer;
  }
}
.full-show {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%!important;
  z-index: 999;
  .fullscreen-btn {
    margin-top: 50px;
  }
}
  .line_middle {
      height: 30px;
      span,
      i {
        display: inline-block;
        vertical-align: middle;
        &.active {
          color: red;
        }
      }
      &:after {
        content: "";
        display: inline-block;
        height: 100%;
        vertical-align: middle;
      }
    }
.left_btm {
    height: 400px;
    background: #fff;
    margin-top: 10px;
    padding: 15px;
    box-sizing: border-box;
    .comment_item {
      font-size: 14px;
      margin-top: 20px;
      .comment_header {
        color: #6495e0;
        line-height: 24px;
      }
      .comment_text {
        font-size: 16px;
        line-height: 30px;
      }
      .comment_footer {
        text-align: right;
        span:first-child {
          float: left;
        }
        span.delete {
          color: #999;
          cursor: pointer;
        }
        span.reply {
          color: #999;
          margin-left: 5px;
          cursor: pointer;
        }
      }
    }
    .reply_wrapper {
      padding-left: 15px;
      .reply_header {
        font-size: 14px;
        line-height: 24px;
        span {
          color: #6495e0;
          margin: 0 10px;
        }
      }
      .reply_text {
        margin-left: 10px;
        font-size: 16px;
        line-height: 30px;
      }
      .reply_footer {
        text-align: right;
        // line-height: 24px;
        padding-left: 10px;
        span {
          font-size: 14px;
          line-height: 24px;
        }
        span:first-child {
          float: left;
        }
        span.delete {
          color: #999;
          cursor: pointer;
        }
        span.reply {
          color: #999;
          margin-left: 5px;
          cursor: pointer;
        }
      }
    }
    .reply_input_wrapper {
      margin: 10px 0;
      position: relative;
      .text {
        position: absolute;
        top: 3px;
        right: 82px;
        color: #8994a0;
      }
      .reply_input {
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }
  .comment_container{
    width: 100%;
  }
  // .active {
  //         color: red!important;
  //       }
 /deep/.el-icon-s-comment:before {
  font-size: 16px;
}
/deep/.el-icon-view:before{
   font-size: 16px;
}
</style>
