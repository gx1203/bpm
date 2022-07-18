<template>
  <div id="processDetails">
    <el-row :gutter="10">
      <el-col :span="16">
        <div class="left_top">
          <el-row>
            <el-col :span="20">
              <p class="title">{{!processProps.code ? '' : (processProps.code + processProps.name)}}</p>
            </el-col>
            <el-col :span="4" class="text_right">
              <el-button type="primary" @click="$router.back()">{{$t('returnList')}}</el-button>
            </el-col>
          </el-row>
          <el-row class="margin-t5 margin-b5">
            <el-col :span="12" class="line_middle">
              <span>{{processProps.submitname}}</span>
              <i class="icon iconfont icon-shijian"></i>
              <span>{{ processProps2.effectivetime }}</span>
            </el-col>
            <el-col :span="12" class="text_right line_middle font16">
              <span class="item margin-r10">
                <i class="icon iconfont icon-yanjing1"></i>
                <span>{{processProps2.browsernum}}</span>
              </span>
              <span class="item margin-r10">
                <i class="icon iconfont icon-comment"></i>
                <span>{{processProps2.commentnum}}</span>
              </span>
              <span class="item margin-r10">
                <i
                  @click="handlerGoodAndBad('good')"
                  :class="['icon', 'iconfont', 'icon-zan', processProps2.actionstate === '1' ? 'active' : '']"
                ></i>
                <span>{{processProps2.goodactionnum}}</span>
              </span>
              <span class="item">
                <i
                  @click="handlerGoodAndBad('bad')"
                  :class="['icon', 'iconfont', 'icon-iconfontzan', processProps2.actionstate === '2' ? 'active' : '']"
                ></i>
                <span>{{processProps2.badactionnum}}</span>
              </span>
            </el-col>
          </el-row>
          <div class="jpg_wrapper" :class="{'full-show': isFull}">
            <div class="w100 h100 imgContainer">
              <img ref="processImg" :src="jpgSrc" alt />
            </div>
            <div class="toolslist">
              <i class="fa fa-crosshairs" @click.stop="toolclick('restore')"></i>
              <i class="fa fa-search-plus" @click.stop="toolclick('zoomin')"></i>
              <i class="fa fa-search-minus" @click.stop="toolclick('zoomout')"></i>
              <i class="fa fa-arrows-alt" @click.stop="toolclick('full')"></i>
              <i class="fa fa-print" @click.stop="toolclick('print')"></i>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="right_top">
          <el-row class="border_btm">
            <el-col :span="12" class="title">{{$t('processProperties')}}</el-col>
            <el-col :span="12" class="download">
              <i class="icon iconfont icon-word"></i>
              <span class="cursor-pointer" @click="viewProcessDoc">{{$t('processFile')}}</span>
              <i @click="getImportWord" class="icon iconfont icon-xiazai"></i>
            </el-col>
          </el-row>
          <p>
            <span
              class="process_title"
            >{{!processProps.code ? '' : (processProps.code + processProps.name)}}</span>
            <span class="process_version">{{!processProps.version ? '' : processProps.version}}</span>
          </p>
          <p>
            <span class="tt">{{$t('releaseDate')}}</span>
            <span>{{processProps.effectivetime | forDate}}</span>
          </p>
          <p>
            <span class="tt">{{$t('processResponsibility')}}</span>
            <span>{{!processProps.managerList ? '':processProps.managerList.map(item => item.value).join(',')}}</span>
          </p>
          <p>
            <span class="tt">{{$t('superiorProcessResponsibility')}}</span>
            <span>{{!processProps.upmanagerList ? '':processProps.upmanagerList.map(item => item.value).join(',')}}</span>
          </p>
          <p>
            <span class="tt">{{$t('artificialPerson')}}</span>
            <span>{{processProps.signername}}</span>
          </p>
          <p>
            <span class="tt">{{$t('applicableOrganization')}}</span>
            <span>{{processProps.orgname}}</span>
          </p>
          <p>
            <span class="tt">{{$t('applicableScope')}}</span>
            <span>{{processProps.scope}}</span>
          </p>
          <p>
            <span class="tt">{{$t('classificationSystem')}}</span>
            <span>{{syslists.join(',')}}</span>
            <!-- <i class="icon iconfont icon-xiazai"></i> -->
          </p>
          <p class="ProcessDocumentation clear-fix">
            <span class="tt">{{$t('processDoc')}}</span>
            <span class="float-r more" style="color: rgb(51, 122, 183);" v-if="docList.length > 1" @click="moreClick()">
              {{ cur ? $t('putAway'):$t('toMore') }}
            </span>
          </p>
          <p class="ProcessDocumentation2 clear-fix" v-show="!cur" v-if="docList.length > 0">
            <span class="file">
              {{!docList[0] ? '':(docList[0].foldername + '-' + docList[0].name)}}
              <i
                @click="downloadFile(docList[0].docid)"
                class="icon iconfont icon-xiazai"
              ></i>
            </span>
          </p>
          <p class="ProcessDocumentation2 clear-fix" v-show="cur">
            <span class="scroll">
              <span v-for="doc in docList" :key="doc.id" class="file">
              {{doc.foldername + '-' + doc.name}}
              <i
                @click="downloadFile(doc.docid)"
                class="icon iconfont icon-xiazai"
              ></i>
            </span>
            </span>
          </p>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="16">
        <div class="left_btm">
          <p style="line-height:30px;">
            <span style="color:red;">{{commentList.length}}</span>{{$t('comments')}}
          </p>
          <el-input clearable
            type="textarea"
            resize="none"
            :rows="3"
            v-model.trim="commontText"
            maxlength="500"
            @input="descInputText"
          ></el-input>
          <span class="tips"></span>
          <span class="text">限制{{remnant2}}/{{$t('lessThan1000Words')}}</span>
          <p style="margin-top: 10px;">
            <el-button type="primary" @click="sendComment">{{$t('makeComments')}}</el-button>
          </p>
          <el-scrollbar class="comment_container">
            <div
              v-for="item in commentList"
              :key="item.id"
              style="border-bottom: 1px solid #f6f6f6;padding-bottom: 10px;"
            >
              <div class="comment_item">
                <div class="comment_header">{{item.createby}}</div>
                <div class="comment_text">{{item.description}}</div>
                <div class="comment_footer">
                  <div>
                    <span>{{item.createon | formateDate}}</span>
                    <span
                      class="delete"
                      v-if="item.createon = username || getUserAuthor.indexOf('3') > -1 || getUserAuthor.indexOf('1') > -1"
                      @click="deleteComment('comment', item.id)"
                    >删除</span>
                    <span class="reply" @click="showReply('replyInput', item.id)">
                      <i class="icon iconfont icon-comment"></i>{{$t('reply')}}
                    </span>
                  </div>
                  <div
                    class="reply_input_wrapper"
                    v-show="replyInput.isShow && currentId === item.id"
                  >
                    <el-input clearable v-model.trim="replyInput.text" maxlength="50" @input="descInput"></el-input>
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
              </div>
              <div class="reply_wrapper" v-for="reply in item.reply" :key="reply.id">
                <div class="reply_header">
                  <span>{{reply.commonname}}</span>{{$t('reply')}}
                  <span>{{reply.replyname}}</span>
                </div>
                <div class="reply_text">{{reply.description}}</div>
                <div class="reply_footer">
                  <div>
                    <span>{{reply.createon | formateDate}}</span>
                    <span
                      class="delete"
                      v-if="reply.replyby == username || getUserAuthor.indexOf('3') > -1 || getUserAuthor.indexOf('1') > -1"
                      @click="deleteComment('reply', reply.id)"
                    >删除</span>
                    <span class="reply" @click="showReply('replyInput2', reply.id)">
                      <i class="icon iconfont icon-comment"></i>{{$t('reply')}}
                    </span>
                  </div>
                  <div
                    class="reply_input_wrapper"
                    v-show="replyInput2.isShow && currentId === reply.id"
                  >
                    <el-input clearable v-model.trim="replyInput2.text" maxlength="50" @input="descInput"></el-input>
                    <span class="tips2"></span>
                    <span class="text">{{$t('limit50Words')}}</span>
                    <el-button
                      class="reply_input"
                      type="primary"
                      plain
                      @click="replyComment('replyInput2', item)"
                    >{{$t('replyToComment')}}</el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="right_btm">
          <div class="header_title">{{$t('recentReleaseProcess')}}</div>
          <div class="process_item" v-for="item in recentPublishedList" :key="item.id">
            <p
              class="title"
              @click="$router.push('/processDetails/' + item.id)"
            >{{item.code + item.name + ' ' + item.version}}</p>
            <p>
              <span>{{item.browsernum}}{{$t('peopleVisit')}}</span>
              <span>{{item.signername}}</span>
              <span>{{item.effectiveon | forDate}}</span>
            </p>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getProcessProps,
  getProcessProps2,
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
import username from '@/bpa/utils/fetch.js'
import { createNamespacedHelpers } from 'vuex'
const userInfo = createNamespacedHelpers('userInfo')
export default {
  data() {
    return {
      commontText: '',
      syslists: [],
      processProps: {},
      processProps2: {},
      commentList: [],
      docList: [],
      recentPublishedList: [],
      jpgSrc: '',
      currentId: '',
      replyInput: {
        text: '',
        isShow: false
      },
      replyInput2: {
        text: '',
        isShow: false
      },
      // 放大倍数
      scaleTo: 100,
      isFull: false,
      username: !localStorage.getItem('portalCurrentUserInfo')
        ? ''
        : JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
          .empuid,
      isFull: false,
      // remnant1: 0, // 文本框输入字数
      remnant2: 0, // 文本域输入字数
      // remnant3: 0, // 文本框输入字数
      areaMaxLength: 1000, // 文本域最大字数限制
      textMaxLength: 50, // 文本框最大字数限制
      cur: false
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    },
    host() {
      return process.env.HOST_URL
    },
    html() {
      return process.env.HTML_URL
    },
    ...userInfo.mapGetters(['getUserAuthor'])
  },
  mounted() {
    this.addComments()
    this.getProcessProps()
    this.queryComment()
    this.getRecentPublished()
    console.log(this.getUserAuthor)
  },
  methods: {
    async addComments() {
      await addComments(this.id)
      this.getProcessProps2()
    },
    getProcessProps2() {
      getProcessProps2({ filters: [{ key: 'id', value: this.id }] }, 1).then(
        res => {
          if (!res) return
          this.processProps2 = res.list[0]
          console.log(this.processProps2)
          this.getWordJpg()
          this.getProcessDoc()
        }
      )
    },
    getProcessProps() {
      let self = this
      getProcessProps(this.id).then(res => {
        if (!res) return false
        console.log(res)
        this.processProps = res.bpmDto
        this.syslists = []
        this.processProps.syslist.forEach(item => {
          if (!self.syslists.includes(item.typename)) {
            self.syslists.push(item.typename)
          }
        })
      })
    },
    queryComment() {
      queryComment({
        filters: [{ key: 'listid', value: this.id }],
        orderby: 'createon',
        sort: 'asc',
        pageNum: 1,
        pageSize: 99999
      }).then(res => {
        if (!res) return
        console.log(res.list)
        this.commentList = res.list
      })
    },
    getWordJpg() {
      getWordJpg({
        id: this.processProps2.bpmid,
        json: '',
        listid: this.processProps2.listid,
        name: '',
        num: '',
        userid: JSON.parse(localStorage.getItem('portalCurrentUserInfo') || {})
          .name
      }).then(res => {
        this.jpgSrc = res.url
      })
    },
    getImportWord() {
      getImportWord({
        id: this.processProps2.bpmid,
        json: '',
        listid: this.processProps2.listid,
        name: '',
        num: '',
        userid: JSON.parse(localStorage.getItem('portalCurrentUserInfo') || {})
          .name
      }).then(res => {
        let aEle = document.createElement('a')
        aEle.setAttribute('href', res)
        aEle.setAttribute('target', 'blank')
        aEle.click()
      })
    },
    viewProcessDoc() {
      viewProcessDoc({
        id: this.processProps2.bpmid,
        json: '',
        listid: this.processProps2.listid,
        name: '',
        num: '',
        userid: JSON.parse(localStorage.getItem('portalCurrentUserInfo') || {})
          .name
      }).then(res => {
        console.log(res)
        window.open(res)
      })
    },
    // 获取流程文档
    getProcessDoc() {
      getProcessDoc({
        attr: {},
        filters: [
          {
            key: 'modelid',
            opt: 'LIKE',
            type: 'S',
            value: this.processProps2.bpmid
          }
        ],
        orderby: 'createon',
        sort: 'desc',
        pageNum: 1,
        pageSize: 99999
      }).then(res => {
        console.log(res.list)
        this.docList = res.list
      })
    },
    // 下载流程文档
    downloadFile(id) {
      // console.log(username)
      // console.log(id)
      // console.log(id)
      let self = this
      let aEle = document.createElement('a')
      aEle.setAttribute('href', self.host + '/bpa/attach/download/' + id + '?username=' + this.processProps2.createby)
      aEle.click()
    },
    // 发表评论
    sendComment() {
      if (this.commontText === '') {
        this.$message({
          type: 'error',
          message: this.$t('hintText.youDidNotEnterAnyText')
        })
        return
      }
      let obj = {
        description: this.commontText,
        listid: this.id
      }
      saveComment(obj).then(res => {
        if (!res) return
        this.$message({
          type: 'success',
          message: this.$t('hintText.commentOnSuccess')
        })
        this.queryComment()
        this.getProcessProps2()
        this.commontText = ''
      })
    },
    // 回复评论
    showReply(type, id) {
      this[type].isShow = true
      this[type].text = ''
      this.currentId = id
    },
    replyComment(type, item) {
      let obj = {
        commentid: item.id,
        commonby: JSON.parse(
          localStorage.getItem('portalCurrentUserInfo') || {}
        ).name,
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
      })
    },
    // 删除评论
    deleteComment(type, id) {
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
        }
      })
    },
    // 点赞与踩
    handlerGoodAndBad(type) {
      let promise
      if (type === 'good') {
        promise = goodAction(this.id)
      } else {
        promise = badAction(this.id)
      }
      promise.then(message => {
        this.$message({
          type: 'success',
          message
        })
        this.getProcessProps2()
      })
    },
    getRecentPublished() {
      getRecentPublished({
        orderby: 'createon',
        sort: 'desc',
        pageNum: 1,
        pageSize: 5
      }, 1).then(res => {
        this.recentPublishedList = res.list
      })
    },
    // 操作按钮
    toolclick(type) {
      let self = this
      switch (true) {
        case type === 'restore':
          self.scaleTo = 100
          this.$refs.processImg.style = 'height:' + self.scaleTo + '%;'
          break
        case type === 'zoomin':
          self.scaleTo += 5
          this.$refs.processImg.style = 'height:' + self.scaleTo + '%;'
          break
        case type === 'zoomout':
          if (self.scaleTo === 50) {
            self.$message({
              type: 'warning',
              message: this.$t('hintText.scaledToTheMinimumCanNotGoAnyLower1')
            })
            return false
          }
          self.scaleTo -= 5
          this.$refs.processImg.style = 'height:' + self.scaleTo + '%;'
          break
        case type === 'full':
          this.isFull = !this.isFull
          break
        case type === 'print':
          window.open(
            self.host +
              self.html +
              '/leftMenu/printpreview.html?id=' +
              self.processProps2.bpmid +
              '&listid=' +
              self.processProps.listid
          )
          break
      }
    },
    // 文本框字数限制
    descInput() {
      // var txtVal3 = this.replyInput2.text.length
      // this.remnant1 = txtVal3
      // if (this.replyInput2.text.length > this.textMaxLength) {
      //   this.replyInput2.length = String(this.replyInput2.length).slice(0, this.textMaxLength)
      // }
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
        txtVal2 = this.commontText.length
        this.remnant2 = txtVal2
      }
    },
    // 更多的点击
    moreClick() {
      this.cur = !this.cur
    }
  }
}
</script>

<style lang="scss" scoped>
#processDetails {
  flex: 1;
  padding: 10px;
  background: #f9fafd;
  overflow: hidden;
  .jpg_wrapper {
    background-color: #fff;
    .toolslist {
      position: absolute;
      bottom: 15px;
      right: 15px;
      i {
        text-align: center;
        font-size: 26px;
        color: #8994a0;
        cursor: pointer;
        display: block;
        margin-top: 10px;
      }
      i:nth-of-type(4) {
        font-size: 22px;
      }
    }
    &.full-show {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 999;
    }
  }
  .text_right {
    text-align: right;
  }
  .left_top {
    height: 400px;
    padding: 15px;
    background: #fff;
    .title {
      font-size: 22px;
      font-weight: 400;
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
  }
  .right_top {
    height: 400px;
    background: #fff;
    padding: 15px;
    position: relative;
    .border_btm {
      border-bottom: 1px solid #ccc;
      margin-bottom: 10px;
    }
    .title {
      font-size: 16px;
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
      line-height: 30px;
      span {
        font-size: 14px;
      }
      .icon {
        margin-left: 10px;
        color: #6495e0;
      }
      span:first-child {
        font-size: 14px;
        color: #ccc;
        padding-right: 10px;
        &.process_title {
          color: #000;
          font-size: 16px;
        }
      }
      .process_version {
        font-size: 16px;
        padding-left: 20px;
      }
    }
    .ProcessDocumentation {
      position: absolute;
      margin-bottom: 10px;
      span {
        display: block;
      }
      .more {
        margin-left: 300px;
        cursor: pointer;
      }

    }
    .ProcessDocumentation2 {
      position: absolute;
      margin-top: 25px;
      span {
        display: block;
      }
      .scroll {
        display: block;
        white-space: nowrap;
        overflow-y: scroll;
        height: 90px;

      }
      .file {
        color: #000;
        // float: left;
        margin-left: 20px;
        white-space: nowrap;
      }
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
  .right_btm {
    height: 400px;
    margin-top: 10px;
    background: #fff;
    padding: 15px;
    box-sizing: border-box;
    .header_title {
      font-size: 16px;
      line-height: 30px;
      font-weight: bold;
      padding-bottom: 10px;
      border-bottom: 1px solid #f6f6f6;
    }
    .process_item {
      border-bottom: 1px solid #f6f6f6;
      padding: 10px 10px 5px;
      p:first-child {
        color: #6495e0;
        line-height: 25px;
        font-size: 14px;
        cursor: pointer;
      }
      p:last-child {
        text-align: right;
        line-height: 25px;
        span {
          font-size: 14px;
        }
        span:first-child {
          float: left;
        }
      }
    }
  }
}
</style>
