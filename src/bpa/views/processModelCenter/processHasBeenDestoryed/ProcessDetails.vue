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
              <el-button type="primary" @click="goBack">{{$t('returnList')}}</el-button>
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
                <i class="el-icon-view"></i>
                <span>{{processProps2.browsernum}}</span>
              </span>
              <span class="item margin-r10">
                <i class="el-icon-s-comment"></i>
                <span>{{processProps2.commentnum}}</span>
              </span>
              <span class="item margin-r10">
                <i
                  :class="['icon', 'iconfont', 'icon-cai','icon_ceshi', processProps2.actionstate === '1' ? 'active' : '']"
                ></i>
                <span>{{processProps2.goodactionnum}}</span>
              </span>
              <span class="item">
                <i
                  :class="['icon', 'iconfont', 'icon_ceshi', 'icon-zan', processProps2.actionstate === '2' ? 'active' : '']"
                ></i>
                <span>{{processProps2.badactionnum}}</span>
              </span>
            </el-col>
          </el-row>
          <div class="jpg_wrapper" :class="{'full-show': isFull}">
            <div class="w100 h100 imgContainer">
              <img ref="processImg" :src="jpgSrc" alt />
            </div>
            <!-- <div class="toolslist">
              <i class="fa fa-crosshairs" @click.stop="toolclick('restore')"></i>
              <i class="fa fa-search-plus" @click.stop="toolclick('zoomin')"></i>
              <i class="fa fa-search-minus" @click.stop="toolclick('zoomout')"></i>
              <i class="fa fa-arrows-alt" @click.stop="toolclick('full')"></i>
              <i class="fa fa-print" @click.stop="toolclick('print')"></i>
            </div>-->
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="right_top">
          <el-row class="border_btm">
            <el-col :span="12" class="title">{{$t('processProperties')}}</el-col>
            <el-col :span="12" class="download">
              <!-- <i class="icon iconfont icon-word"></i>
              <span>流程文件</span>
              <i @click="getImportWord" class="icon iconfont icon-xiazai"></i>-->
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
            <span>{{processProps.effectiveon | forDate}}</span>
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
          <p v-if="syslists.length > 0">
            <span class="tt">{{$t('classificationSystem')}}</span>
            <span>{{syslists.join(',')}}</span>
            <!-- <i class="icon iconfont icon-xiazai"></i> -->
          </p>
          <p v-if="docList.length > 0" class="ProcessDocumentation clear-fix">
            <span class="tt">{{$t('processDoc')}}</span>
            <span
              class="float-r more"
              style="color: rgb(51, 122, 183);"
              @click="moreClick()"
              v-if="docList.length > 1"
            >{{ cur ? $t('putAway'):$t('toMore') }}</span>
          </p>
          <p class="ProcessDocumentation2 clear-fix" v-show="!cur || !docList[0]">
            <span class="file">
              {{!docList[0] ? '':(docList[0].foldername + '-' + docList[0].name)}}
              <i
              v-if="docList.length > 0"
                @click="downloadFile(doc.docid)"
                class="icon iconfont icon-xiazai"
              ></i>
            </span>
          </p>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="16">
        <div class="left_btm">
           <!-- 按照需求先隐藏这个 -->
          <!-- <el-table :data="tableData" class="w100">
            <el-table-column type="index" :label="$t('number')" width="50"></el-table-column>
            <el-table-column prop="date" :label="$t('subject')" width="180"></el-table-column>
            <el-table-column prop="name" :label="$t('approvalNodeName')" width="180"></el-table-column>
            <el-table-column prop="address" :label="$t('approver')"></el-table-column>
            <el-table-column prop="address" :label="$t('approvalTime1')"></el-table-column>
            <el-table-column prop="address" :label="$t('approvalOperation')"></el-table-column>
            <el-table-column prop="address" :label="$t('remarks')"></el-table-column>
          </el-table> -->
        </div>
      </el-col>
      <el-col :span="8">
        <div class="right_btm">
          <div class="header_title">{{$t('recentlyInvalidatedProcess')}}</div>
          <div class="process_item" v-for="item in recentPublishedList" :key="item.id">
            <p
              class="title"
              @click="$router.push('/processDetailsDestroy/' + item.id)"
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
  getProcessDoc,
  getRecentabolished,
  addComments
} from '@/bpa/api/processModelCenter/processCommunity';
import '@/bpa/assets/fonts/font_zan/iconfont.css'
import '@/bpa/assets/fonts/font_zan/iconfont.eot'
import '@/bpa/assets/fonts/font_zan/iconfont.ttf'
import '@/bpa/assets/fonts/font_zan/iconfont.svg'
export default {
  data() {
    return {
      tableData: [],
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
    }
  },
  mounted() {
    this.addComments()
    this.getProcessProps()
    this.queryComment()
    this.getRecentabolished()
    this.getProcessDoc()
  },
  methods: {
    async addComments() {
      await addComments(this.id)
      this.getProcessProps2()
    },
    getProcessProps2() {
      getRecentabolished({ filters: [{ key: 'id', value: this.id }] }, 1).then(
        res => {
          if (!res) return
          this.processProps2 = res.list[0]
          this.getWordJpg()
        }
      )
    },
    getProcessProps() {
      getProcessProps(this.id).then(res => {
        if (!res) return false
        console.log(res)
        this.processProps = res.bpmDto
        this.syslists = []
        this.processProps.syslist.forEach(item => {
          if (!this.syslists.includes(item.typename)) {
            this.syslists.push(item.typename)
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
        version:this.processProps2.version+"N",
        userid: JSON.parse(localStorage.getItem('portalCurrentUserInfo') || {})
          .name
      }).then(res => {
        if (!res) return false
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
        if (!res) return false
        let aEle = document.createElement('a')
        aEle.setAttribute('href', res)
        aEle.setAttribute('target', 'blank')
        aEle.click()
      })
    },
    // 获取流程文档
    getProcessDoc() {
      getProcessDoc({
        attr: {},
        filters: [{ key: 'modelid', opt: 'LIKE', type: 'S', value: this.id }],
        orderby: 'createon',
        sort: 'desc',
        pageNum: 1,
        pageSize: 99999
      }).then(res => {
        if (!res) return false
        this.docList = res.list
      })
    },
    // 下载流程文档
    downloadFile(id) {
      let self = this
      let aEle = document.createElement('a')
      aEle.setAttribute('href', self.host + '/attach/download/' + id)
      aEle.click()
    },
    getRecentabolished() {
      getRecentabolished({
        orderby: 'createon',
        sort: 'desc',
        pageNum: 1,
        pageSize: 5
      }).then(res => {
        if (!res) return false
        this.recentPublishedList = res.list
      })
    },
    // 更多的点击
    moreClick() {
      this.cur = !this.cur
    },
    goBack() {
      this.$router.push({ name: 'processHasBeenDestoryed' })
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
  /deep/ .el-table thead {
    color: #5d5d5d;
  }
  /deep/ .el-table th > .cell {
    text-align: center;
  }
  .jpg_wrapper {
    height: 333px;
    position: relative;
    .imgContainer{
      overflow: auto;
      height: 100%;
    }
    img {
      display: block;
      height: 100%;
    }
  }
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
    .icon_ceshi {
    color: #000;
  }
}
</style>
