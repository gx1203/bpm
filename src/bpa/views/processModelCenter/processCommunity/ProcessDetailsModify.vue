<template>
  <div id="processDetails">
    <el-row :gutter="10">
      <el-col :span="18">
        <div class="left_top">
          <el-row>
            <el-col :span="20">
              <p class="title">
                {{
                  !processProps.code
                    ? ''
                    : processProps.code + processProps.name
                }}
              </p>
            </el-col>
<!--            <el-col :span="4" class="text_right">-->
<!--              <el-button type="primary" @click="goBack">-->
<!--                {{ $t('returnList') }}-->
<!--              </el-button>-->
<!--            </el-col>-->
          </el-row>
          <el-row class="margin-t5">
            <el-col :span="12" class="line_middle">
              <span>{{ processProps.submitname }}</span>
              <i class="icon iconfont icon-shijian" />
              <span>{{ processProps2.effectivetime }}</span>
            </el-col>
            <el-col :span="12" class="text_right line_middle font16">
              <span class="item margin-r10">
                <!-- <i class="icon iconfont icon-yanjing1" /> -->
                <i class="el-icon-view" />
                <span>查看 {{ processProps2.browsernum }}</span>
              </span>
              <span class="item margin-r10">
                <i class="el-icon-s-comment" />
                <!-- <i class="icon iconfont icon-comment" /> -->
                <span>评论 {{ processProps2.commentnum }}</span>
              </span>
              <span class="item margin-r10">
                <i
                  :class="[
                    'icon',
                    'iconfont',
                    'icon-zan',
                    'icon_ceshi',
                    processProps2.actionstate === '1' ? 'active' : ''
                  ]"
                  @click="handlerGoodAndBad('good')"
                />
                <span>赞 {{ processProps2.goodactionnum }}</span>
              </span>
              <span class="item">
                <i
                  :class="[
                    'icon',
                    'iconfont',
                    'icon_ceshi',
                    'icon-cai',
                    processProps2.actionstate === '2' ? 'active' : ''
                  ]"
                  @click="handlerGoodAndBad('bad')"
                />
                <span>踩 {{ processProps2.badactionnum }}</span>
              </span>
            </el-col>
          </el-row>
          <el-row class="margin-t5 margin-b5">
            <!--            <el-col :span="12" class="line_middle">-->
            <!--              <el-select clearable v-model="tagvalue" :placeholder="$t('pleaseSelect')">-->
            <!--                <el-option-->
            <!--                  v-for="item in options"-->
            <!--                  :key="item.value"-->
            <!--                  :label="item.label"-->
            <!--                  :value="item.value"-->
            <!--                />-->
            <!--              </el-select>-->
            <!--            </el-col>-->
            <!-- <el-col :span="12" class="text_right line_middle font16">
              <el-button type="primary" @click="openDialog('comments')">评论</el-button>
              <el-button type="primary" @click="openDialog('target')">标签</el-button>
              <el-button type="primary" @click="openDialog('note')">注释</el-button>
            </el-col> -->
          </el-row>
          <div class="jpg_wrapper" :class="{ 'full-show': isFull }">
            <div class="imgContainer">
              <img ref="processImg" :src="jpgSrc" alt />
            </div>
            <div class="toolslist">
              <!-- <el-tooltip class="item" effect="dark" content="显示复选框" placement="right">
                <i class="fa fa-check-circle-o" @click.stop="toolclick('check')"></i>
              </el-tooltip> -->
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('viewOriginalImage')"
                placement="right"
              >
                <div class="flex">
                  <i class="fa fa-eye" @click.stop="toolclick('eye')" />
                  <p>{{ $t('viewOriginalImage') }}</p>
                </div>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('restore')"
                placement="right"
              >
                <div class="flex">
                  <i
                    class="fa fa-crosshairs"
                    @click.stop="toolclick('restore')"
                  />
                  <p>{{ $t('restore') }}</p>
                </div>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                :content="amplification"
                placement="right"
              >
                <div class="flex">
                  <i
                    class="fa fa-search-plus"
                    @click.stop="toolclick('zoomin')"
                  />
                  <p>{{ amplification }}</p>
                </div>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('narrow')"
                placement="right"
              >
                <div class="flex">
                  <i
                    class="fa fa-search-minus"
                    @click.stop="toolclick('zoomout')"
                  />
                  <p>{{ $t('narrow') }}</p>
                </div>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('fullScreen')"
                placement="right"
              >
                <div class="flex">
                  <i class="fa fa-arrows-alt" @click.stop="toolclick('full')" />
                  <p>{{ $t('fullScreen') }}</p>
                </div>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('print')"
                placement="right"
              >
                <div class="flex">
                  <i class="fa fa-print" @click.stop="toolclick('print')" />
                  <p>{{ $t('print') }}</p>
                </div>
              </el-tooltip>
            </div>
          </div>
        </div>
        <div class="left_btm">
          <p style="line-height: 30px">
            <span style="color: red">{{ commentList.length }}</span
            >{{ $t('comments') }}
          </p>
          <el-input
            v-model.trim="commontText"
            clearable
            type="textarea"
            resize="none"
            :rows="3"
            maxlength="1000"
            @input="descInputText"
          />
          <span class="tips" />
          <span class="text"
            >限制{{ remnant2 }}/{{ $t('lessThan1000Words') }}</span
          >
          <p style="margin-top: 10px">
            <el-button type="primary" @click="sendComment">
              {{ $t('makeComments') }}
            </el-button>
          </p>
          <el-scrollbar class="comment_container">
            <div
              v-for="item in commentList"
              :key="item.id"
              style="border-bottom: 1px solid #f6f6f6; padding-bottom: 10px"
            >
              <div class="comment_item">
                <div class="comment_header">
                  {{ item.createby }}
                </div>
                <div class="comment_text">
                  {{ item.description }}
                </div>
                <div class="comment_footer">
                  <div>
                    <span>{{ item.createon | formateDate }}</span>
                    <!--        item.createid === username || getUserAuthor.indexOf('3') > -1 || getUserAuthor.indexOf('1') > -1-->
                    <span
                      class="delete"
                      @click="deleteComment('comment', item.id)"
                      >删除</span
                    >
                    <span
                      class="reply"
                      @click="showReply('replyInput', item.id)"
                    >
                      <i class="icon iconfont icon-comment" />{{ $t('reply') }}
                    </span>
                  </div>
                  <div
                    v-show="replyInput.isShow && currentId === item.id"
                    class="reply_input_wrapper"
                  >
                    <el-input
                      v-model.trim="replyInput.text"
                      clearable
                      maxlength="50"
                      @input="descInput"
                    />
                    <span class="tips2" />
                    <span class="text">{{ $t('limit50Words') }}</span>
                    <el-button
                      class="reply_input"
                      type="primary"
                      plain
                      @click="replyComment('replyInput', item)"
                    >
                      回复评论
                    </el-button>
                  </div>
                </div>
              </div>
              <div
                v-for="reply in item.reply"
                :key="reply.id"
                class="reply_wrapper"
              >
                <div class="reply_header">
                  <span>{{ reply.commonname }}</span
                  >{{ $t('reply') }}
                  <span>{{ reply.replyname }}</span>
                </div>
                <div class="reply_text">
                  {{ reply.description }}
                </div>
                <div class="reply_footer">
                  <div>
                    <span>{{ reply.createon | formateDate }}</span>
                    <!--        v-if="reply.commonby === username  || getUserAuthor.indexOf('3') > -1 || getUserAuthor.indexOf('1') > -1"-->
                    <span
                      class="delete"
                      @click="deleteComment('reply', reply.id)"
                      >删除</span
                    >
                    <span
                      class="reply"
                      @click="showReply('replyInput2', reply.id)"
                    >
                      <i class="icon iconfont icon-comment" />{{ $t('reply') }}
                    </span>
                  </div>
                  <div
                    v-show="replyInput2.isShow && currentId === reply.id"
                    class="reply_input_wrapper"
                  >
                    <el-input
                      v-model.trim="replyInput2.text"
                      clearable
                      maxlength="50"
                      @input="descInput"
                    />
                    <span class="tips2" />
                    <span class="textarea">{{ $t('limit50Words') }}</span>
                    <el-button
                      class="reply_input"
                      type="primary"
                      plain
                      @click="replyComment('replyInput2', item)"
                    >
                      回复评论
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="right_top">
          <el-row class="border_btm">
            <el-col :span="12" class="title">
              {{ $t('processProperties') }}
            </el-col>
            <!-- <el-col :span="12" class="download">
              <i class="icon iconfont icon-word" />
              <span class="cursor-pointer" @click="viewProcessDoc">{{
                $t("processFile")
              }}</span>
              <i class="icon iconfont icon-xiazai" @click="getImportWord" />
            </el-col> -->
          </el-row>
          <p>
            <span class="tt">{{ $t('title') }}:</span>
            <span class="process_title">{{
              !processProps.code ? '' : processProps.code + processProps.name
            }}</span>
          </p>
          <p>
            <span class="tt">{{ $t('releaseDate') }}:</span>
            <span>{{ processProps.effectivetime }}</span>
          </p>
          <p>
            <span class="tt">{{ $t('version') }}:</span>
            <span>{{ !processProps.version ? '' : processProps.version }}</span>
          </p>
          <p>
            <span class="tt">{{ $t('processResponsibility') }}:</span>
            <span>{{
              !processProps.managerList
                ? ''
                : processProps.managerList.map(item => item.value).join(',')
            }}</span>
          </p>
          <p>
            <span class="tt">{{ $t('superiorProcessResponsibility') }}:</span>
            <span>{{
              !processProps.upmanagerList
                ? ''
                : processProps.upmanagerList.map(item => item.value).join(',')
            }}</span>
          </p>
          <p>
            <span class="tt">{{ $t('artificialPerson') }}:</span>
            <span>{{ processProps.signername }}</span>
          </p>
          <p>
            <span class="tt">{{ $t('applicableOrganization') }}:</span>
            <span>{{ processProps.orgname }}</span>
          </p>
          <p>
            <span class="tt">{{ $t('applicableScope') }}:</span>
            <span>{{ processProps.scope }}</span>
          </p>
          <!-- <p>
            <span class="tt">{{ $t("classificationSystem") }}:</span>
            <span>{{ syslists.join(",") }}</span> -->
          <!-- <i class="icon iconfont icon-xiazai"></i> -->
          <!-- </p> -->
          <!-- <p class="clear-fix">
            <span class="tt">{{ $t("processDoc") }}:</span>
            <span
              v-if="docList.length > 1"
              class="float-r more cursor-pointer"
              style="color: rgb(51, 122, 183)"
              @click="moreClick()"
            >
              {{ cur ? $t("putAway") : $t("toMore") }}
            </span>
          </p> -->
          <p v-show="!cur" v-if="docList.length > 0" class="font-gray file">
            <span>
              <el-link
                type="primary"
                :underline="false"
                target="_blank"
                :href="viewFile(docList[0].docid)"
                >{{
                  !docList[0]
                    ? ''
                    : docList[0].foldername + '-' + docList[0].name
                }}</el-link
              >
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('download')"
                placement="top"
              >
                <el-button
                  type="text"
                  icon="el-icon-download"
                  @click="downloadFile(docList[0].docid)"
                />
              </el-tooltip>
            </span>
          </p>
          <!--流程文件-->
          <p
            :span="12"
            class="download"
            style="display:flex;align-items: center;"
          >
            <!--            <i class="icon iconfont icon-word"/>-->
            <img
              :src="fileImg"
              alt="文件"
              style="margin-right: 3px;width:16px"
            />
            <span class="cursor-pointer" @click="viewProcessDoc">{{
              $t('processFile')
            }}</span>
            <i
              class=" el-icon-download"
              @click="getImportWord"
              style="margin-left:10px;font-size:16px;cursor:pointer;color:#6495e0"
            />
          </p>
          <el-scrollbar v-show="cur" class="ProcessDocumentation2 clear-fix">
            <p v-for="doc in docList" :key="doc.id" class="file">
              <span>
                <el-link
                  type="primary"
                  :underline="false"
                  target="_blank"
                  :href="viewFile(doc.docid)"
                  >{{ doc.foldername + '-' + doc.name }}</el-link
                >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="$t('download')"
                  placement="top"
                >
                  <el-button
                    type="text"
                    icon="el-icon-download"
                    @click="downloadFile(doc.docid)"
                  />
                </el-tooltip>
              </span>
            </p>
          </el-scrollbar>
        </div>
        <div v-if="zhiduList.length > 0" class="ruleDetails-right-bottom">
          <div class="ruleDetails-right-top-title">相关制度</div>
          <!--       移除相关制度竖线后调整高度，目前先移除改属性：   min-height: 80px-->
          <div
            v-for="(child, index1) in zhiduList"
            :key="index1"
            style="display: flex; position: relative;margin-left:10px; "
          >
            <!--      移除相关制度竖线      -->
            <!--            <div class="proceeLeftBorder"/>-->
            <div class="relationMargin">
              <div v-if="zhiduList.length > 0" class="relationProcess">
                <div class="relationRuleName">
                  <div class="relationRuleNameTop">
                    <div class="relationRuleNameText">制度</div>
                    <!--        移除相关制度的竖线起始点            -->
                    <!--                    <div class="relationRuleNameCircle" />-->
                  </div>
                  <div
                    class="relationRuleNameContent"
                    @click="
                      $router.push('/rulesDetail/' + child.zhiduId + '/' + '-1')
                    "
                  >
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
                    <span class="word">{{ child.zhiduName }}</span>
                  </div>
                </div>
                <el-row
                  v-for="(item, index) in child.zhangjieList"
                  :key="index"
                >
                  <!-- @click="$router.push('/rulesDetail/' + item.id + '/' + '-1')" -->
                  <template v-if="index < processNum">
                    <div class="relationProcessName">
                      <div class="relationProcessLine" />
                      <div class="relationProcessWord">
                        <span class="word"> {{ item.zhangjieName }}</span>
                      </div>
                    </div>
                  </template>
                </el-row>
              </div>
            </div>
          </div>
          <div v-if="zhiduList.length > 2" class="span-st">
            <span class="more" @click="openMore(1)">{{ processW }}</span>
          </div>
        </div>
        <div class="ruleDetails-right-middle">
          <div
            v-if="
              processProps.dmCorekeyList &&
                processProps.dmCorekeyList.length !== 0
            "
            class="ruleDetails-right-top-title"
          >
            关键风险控制点
          </div>
          <div v-for="(item, index) in processProps.dmCorekeyList" :key="index">
            <div class="ruleDetails-right-top-wordss">
              <span>{{
                index + 1 + '、' + item.kcpname + '（' + item.code + '）'
              }}</span>
            </div>
            <div />
          </div>
          <div
            v-if="processProps.dmDocList && processProps.dmDocList.length !== 0"
            class="ruleDetails-right-top-title"
          >
            流程支持文件
          </div>
          <div v-for="(item, index) in processProps.dmDocList" :key="index">
            <div class="ruleDetails-right-top-wordss">
              <span>{{ index + 1 + '、' + item.name }}</span>
            </div>
            <div />
          </div>
          <div
            v-if="
              processProps.newsDtosList &&
                processProps.newsDtosList.length !== 0
            "
            class="ruleDetails-right-top-title"
          >
            相关企业标准
          </div>
          <div v-for="(item, index) in processProps.newsDtosList" :key="index">
            <div class="ruleDetails-right-top-wordss">
              <span>{{
                index + 1 + '、' + item.enname + '（' + item.title + '）'
              }}</span>
            </div>
            <div />
          </div>
        </div>
        <div class="right_btm">
          <div class="header_title">
            {{ $t('recentReleaseProcess') }}
          </div>
          <div
            v-for="item in recentPublishedList"
            :key="item.id"
            class="process_item"
          >
            <p class="title" @click="goProcessDetails(item)">
              {{ item.code + item.name + ' ' + item.version }}
            </p>
            <p>
              <span>{{ item.browsernum }}{{ $t('peopleVisit') }}</span>
              <span>{{ item.submitname }}</span>
              <span>{{ item.effectivetime }}</span>
            </p>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8" />
      <el-col :span="8" />
      <el-col :span="8" :offset="16">
        <el-row>
          <el-col
            v-if="ProcessOfDocument.length > 0"
            :span="24"
            class="ruleDetails-right-bottom"
          >
            <div class="ruleDetails-right-top-title">
              相关制度
              <span
                v-if="ProcessOfDocument.length > 2"
                class="more"
                @click="openMores"
                >{{ recentWs }}</span
              >
            </div>
            <el-row
              v-for="(item, index) in ProcessOfDocument"
              :key="item.id"
              class="ruleDetails-right-bottom-line"
            >
              <template v-if="index < recentNums">
                <div
                  class="ruleDetails-right-top-wordss"
                  @click="$router.push('/rulesDetail/' + item.id + '/' + '-1')"
                >
                  {{ $t('systemName') }}}:<span
                    class="word"
                    style="margin-left: 6px"
                    >{{ item.name }}</span
                  >
                </div>
              </template>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <!-- 针对某一段进行评论 -->
    <el-dialog
      :title="$t('addComments')"
      :visible.sync="dialogFormVisible"
      width="50%"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="commentsRef"
        :model="commentsform"
        :rules="commentsrules"
        label-width="100px"
      >
        <el-form-item
          :label="$t('commentsContent') + ' :'"
          prop="commontText"
          class="label-height-auto"
        >
          <el-input
            v-model.trim="commentsform.commontText"
            type="textarea"
            resize="none"
            :rows="5"
            maxlength="1000"
            :placeholder="$t('placeholderText.pleaseEnterCommentsContent')"
          />
          <span class="text"
            >{{ $t('limit') }}{{ commentsform.commontText.length }}/{{
              $t('lessThan1000Words')
            }}</span
          >
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
    </el-dialog>

    <!-- 针对某一段添加标签 -->
    <el-dialog
      title="创建标签"
      :visible.sync="targetdialogFormVisible"
      width="50%"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="targetRef"
        :model="targetform"
        :rules="targetrules"
        label-width="100px"
      >
        <el-form-item
          label="标签内容 :"
          prop="commontText"
          class="label-height-auto"
        >
          <el-input
            v-model.trim="targetform.commontText"
            type="textarea"
            resize="none"
            :rows="5"
            maxlength="1000"
            placeholder="请输入标签内容"
          />
          <span class="text"
            >限制{{ targetform.commontText.length }}/{{
              $t('lessThan1000Words')
            }}</span
          >
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
    </el-dialog>
  </div>
</template>

<script>
import { getDownloadAuthByModelId } from '@/bpa/api/componentsApi'
import { getModelapprove } from '@/bpa/api/processDesignCenter'
import { downloadProcessDoc } from '@/bpa/api/processDesignCenter'
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
import fileOperation from '@/bpa/mixins/fileDownView'
import { createNamespacedHelpers } from 'vuex'
import '@/bpa/assets/fonts/font_zan/iconfont.css'
import '@/bpa/assets/fonts/font_zan/iconfont.eot'
import cookie from 'js-cookie'
import '@/bpa/assets/fonts/font_zan/iconfont.ttf'
import '@/bpa/assets/fonts/font_zan/iconfont.svg'

const { mapMutations } = createNamespacedHelpers('app')
export default {
  mixins: [fileOperation],
  data() {
    return {
      modelid: '',
      commontText: '',
      recentNums: 3,
      recentWs: '更多',
      processNum: 3,
      processW: '更多',
      syslists: [],
      processProps: {},
      processProps2: {},
      commentList: [],
      docList: [],
      ProcessOfDocument: [],
      zhiduList: [],
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
      version: '',
      // 放大倍数
      scaleTo: 100,
      username: !localStorage.getItem('portalCurrentUserInfo')
        ? ''
        : JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
            .name,
      isFull: false,
      remnant2: 0, // 文本域输入字数
      areaMaxLength: 1000, // 文本域最大字数限制
      textMaxLength: 50, // 文本框最大字数限制
      cur: false,
      moveDataelse: {
        x: null,
        y: null
      },
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      tagvalue: '',
      // 评论弹出框部分
      dialogFormVisible: false,
      commentsform: {
        commontText: ''
      },
      commentsrules: {
        commontText: [
          { required: true, message: ' ', trigger: 'blur' },
          { max: 1000, message: ' ', trigger: 'blur' }
        ]
      },
      // 标签弹出框部分
      targetdialogFormVisible: false,
      targetform: {
        commontText: ''
      },
      targetrules: {
        commontText: [
          { required: true, message: ' ', trigger: 'blur' },
          { max: 1000, message: ' ', trigger: 'blur' }
        ]
      },
      amplification: this.$t('amplification'),
      fileImg: require('@/assets/img/common/ic_file_doc_1x.png')
    }
  },
  computed: {
    // userInfo() {
    //   return this.$store.getters.getUserAuthor()
    // },
    id() {
      return this.$route.params.id
    },
    host() {
      return process.env.VUE_APP_HOST_URL
    },
    baseUrl() {
      return process.env.VUE_APP_BASE_URL
    },
    html() {
      return process.env.VUE_APP_BPA_HTML_URL
    }
  },
  watch: {
    jpgSrc(newVal, oldVal) {
      this.jpgSrc = newVal
    },
    processProps2: {
      handler(newVal, oldVal) {
        console.log(newVal)
        if (newVal) {
          this.getWordJpg()
          this.getProcessDoc()
        }
      },
      deep: true
    }
  },
  mounted() {
    this.addComments()
    this.getProcessProps()
    this.queryComment()
    this.getRecentPublished()
    console.log(this.$store)
    // this.getUserAuthor()
  },
  methods: {
    ...mapMutations(['getUserAuthor']),
    async addComments() {
      await addComments(this.id)
      this.getProcessProps2()
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
    openMores() {
      if (this.recentNums === 3) {
        this.recentNums = 999
        this.recentWs = '收起'
      } else {
        this.recentNums = 3
        this.recentWs = '更多'
      }
    },
    getProcessProps2() {
      getProcessProps2({ filters: [{ key: 'id', value: this.id }] }, 1).then(
        res => {
          if (!res) return
          this.processProps2 = res.list[0]
          this.getWordJpg()
          this.getProcessDoc()
        }
      )
    },
    getProcessProps() {
      const self = this
      getProcessProps(this.id).then(res => {
        if (!res) return false
        this.processProps = res.bpmDto
        this.modelid = res.modelid
        this.version = res.bpmDto.version
        // if (res.bpmDto.systemid) {
        //   res.bpmDto.systemid.split(',').forEach((item, index) => {
        //     this.ProcessOfDocument.push({
        //       name: res.bpmDto.systemcn
        //         ? res.bpmDto.systemcn.split(',')[index]
        //         : '',
        //       id: item
        //     })
        //   })
        // }
        this.zhiduList = res.bpmDto.zhiduList || []
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
    getWordJpg() {
      getWordJpg({
        id: this.processProps2.bpmid,
        json: '',
        listid: this.processProps2.listid,
        name: '',
        num: '',
        version: this.processProps2.version,
        userid: JSON.parse(localStorage.getItem('portalCurrentUserInfo') || {})
          .name
      }).then(res => {
        if (!res) return false
        this.$nextTick(() => {
          this.jpgSrc = res.url
        })
      })
    },
    getImportWord() {
      // getImportWord({
      //   id: this.processProps2.bpmid,
      //   json: '',
      //   listid: this.processProps2.listid,
      //   name: '',
      //   num: '',
      //   userid: JSON.parse(localStorage.getItem('portalCurrentUserInfo') || {})
      //     .name
      // }).then(res => {
      //   if (!res) return false
      //   const aEle = document.createElement('a')
      //   aEle.setAttribute('href', res)
      //   aEle.setAttribute('target', 'blank')
      //   aEle.click()
      // })
      getModelapprove('5').then(res => {
        if (!res) return false
        if (res.choosed === 'direct') {
          downloadProcessDoc({
            id: this.processProps2.bpmid,
            json: '',
            listid: this.processProps2.listid,
            name: '',
            num: '',
            userid: JSON.parse(
              localStorage.getItem('portalCurrentUserInfo') || {}
            ).name,
            language: 'zh-CN'
          }).then(res => {
            if (!res) return false
            window.open(res)
          })
        } else {
          getDownloadAuthByModelId(this.modelid, cookie.get('username')).then(
            res => {
              console.log(res, 'res')
              if (res === '0') {
                this.$confirm(
                  '您暂无此流程文档的下载权限，是否确认申请？',
                  '提示',
                  {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }
                )
                  .then(() => {
                    window.open(
                      `${window.location.origin}${window.location.pathname}#/processForm/start?name=%E6%96%87%E6%A1%A3%E6%9D%83%E9%99%90%E5%AE%A1%E6%89%B9&processName=WDQXSP&projectName=WDQXSP&modelid=${this.modelid}&version=${this.version}`
                    )
                  })
                  .catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消'
                    })
                  })
              } else if (res === '1') {
                downloadProcessDoc({
                  id: this.processProps2.bpmid,
                  json: '',
                  listid: this.processProps2.listid,
                  name: '',
                  num: '',
                  userid: JSON.parse(
                    localStorage.getItem('portalCurrentUserInfo') || {}
                  ).name,
                  language: 'zh-CN'
                }).then(res => {
                  if (!res) return false
                  window.open(res)
                })
              } else {
                this.$message({
                  type: 'warning',
                  message: '当前文档的申请权限正在审批中，暂不可下载！'
                })
              }
            }
          )
        }
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
        if (!res) return false
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
        if (!res) return false
        this.docList = res.list
      })
    },
    // 下载流程文档
    downloadFile(id) {
      // console.log(username)
      // console.log(id)
      // console.log(id)
      const self = this
      const aEle = document.createElement('a')
      aEle.setAttribute(
        'href',
        self.host +
          self.baseUrl +
          '/attach/download/' +
          id +
          '?username=' +
          this.processProps2.createby
      )
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
      const obj = {
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
        this.remnant2 = 0
      })
    },
    // 回复评论
    showReply(type, id) {
      this[type].isShow = true
      this[type].text = ''
      this.currentId = id
    },
    replyComment(type, item) {
      console.log(type, item)
      const obj = {
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
        if (message === '踩成功') {
          message = this.$t('hintText.goodorbad1')
        } else if (message === '取消踩成功') {
          message = this.$t('hintText.goodorbad2')
        } else if (message === '不能同时点赞和踩') {
          message = this.$t('hintText.goodorbad3')
        } else if (message === '点赞成功') {
          message = this.$t('hintText.goodorbad4')
        } else if (message === '取消点赞成功') {
          message = this.$t('hintText.goodorbad5')
        } else if (message === '请勿重复点踩') {
          message = this.$t('hintText.goodorbad6')
        } else if (message === '请勿重复点赞') {
          message = this.$t('hintText.goodorbad7')
        }
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
        if (!res) return false
        this.recentPublishedList = res.list
      })
    },
    // 操作按钮
    toolclick(type) {
      const self = this
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
        case type === 'eye':
          window.open(
            self.host +
              self.html +
              '/leftMenu/BaseNewPage.html?id=' +
              self.processProps2.bpmid +
              '&listid=' +
              self.processProps.listid +
              '&isReadAttr=true'
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
    },

    // 新加的评论，标签，注释
    openDialog(type) {
      switch (true) {
        case type === 'comments':
          this.dialogFormVisible = true
          this.commentsform.commontText = ''
          this.$nextTick(() => {
            this.$refs.commentsRef.clearValidate()
          })
          break
        case type === 'target':
          this.targetdialogFormVisible = true
          this.targetform.commontText = ''
          this.$nextTick(() => {
            this.$refs.targetRef.clearValidate()
          })
          break
      }
    },
    // 评论弹出框
    confirmForm() {},
    // 标签弹出框
    targetconfirmForm() {},
    goBack() {
      this.$router.go(-1)
    },
    goProcessDetails(item) {
      // this.$router.push('/processDetails/' + item.id)
      const Url = this.$router.resolve({path: `/processDetails/${item.id}`})
      window.open(Url.href, '_blank')
      document.documentElement.scrollTop = 0
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
    height: 420px;
    position: relative;

    .imgContainer {
      overflow: auto;
      height: 100%;
      display: flex;
      justify-content: center;
    }

    img {
      display: block;
      height: 100%;
      // width: 88%;
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
    height: 470px;
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
        content: '';
        display: inline-block;
        height: 100%;
        vertical-align: middle;
      }
    }
  }

  .right_top {
    // height: 470px;
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
      // text-align: right;
      height: 30px;

      span,
      .icon {
        display: inline-block;
        vertical-align: middle;
        font-size: 20px;
        color: #6495e0; //#f9a700;
        text-decoration: underline;
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
        content: '';
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
        // color: #ccc;
        padding-right: 4px;

        &.process_title {
          color: #000;
          font-size: 16px;
        }
      }

      &.font-gray {
        padding-left: 20px;

        span {
          color: #333;
        }
      }

      .process_version {
        font-size: 16px;
        padding-left: 20px;
      }
    }

    .ProcessDocumentation2 {
      overflow: hidden;
      box-sizing: border-box;
      padding-left: 20px;
      height: 85px;

      /deep/ .el-scrollbar__wrap {
        overflow-x: hidden;
        overflow-y: auto;
      }
    }

    p.file {
      width: 100%;
      line-height: 30px;
      font-size: 14px;

      span {
        color: #333;
        position: relative;
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 30px;
        display: inline-block;
        vertical-align: top;
        box-sizing: border-box;
      }

      .el-button {
        position: absolute;
        right: 10px;
        line-height: 30px;
        padding: 0;
        font-size: 14px;
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
    // height: 400px;
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

  .proceeLeftBorder {
    position: absolute;
    width: 1px;
    top: 20px;
    // min-height: 100px;
    left: 24px;
    height: calc(100% - 20px);
    background: lightgray;
  }

  .relationProcess {
    // border-left:1px solid lightgray;
    margin-left: 15px;
    // margin-top: 10px;
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

      .relationRuleNameContent {
        margin: 0 19px;
        color: rgba(45, 66, 175, 1);
        cursor: pointer;
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
      /*color: rgba(45, 66, 175, 1);*/
      // border-bottom: 1px solid rgba(45,66,175,1);
    }

    .relationProcessWord {
      line-height: 36px;
      margin-left: 50px;
      //  border-bottom:1px solid rgba(45, 66, 175, 1);
      /*color: rgba(45, 66, 175, 1);*/
      /*cursor: pointer;*/
    }
  }

  .relationMargin {
    // margin-top: 20px;
    margin-left: 10px;
  }

  .ruleDetails-right-bottom {
    min-height: 181px;
    background: rgba(255, 255, 255, 1);
    // border-radius:10px;
    margin-top: 10px;
    padding-bottom: 14px;
  }

  .ruleDetails-right-top-title {
    font-size: 16px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    margin: 0px 19px;
    padding: 18px 0 10px 0;
    margin-bottom: 10px;
    border-bottom: 1px solid rgba(237, 237, 237, 1);
  }

  .more {
    font-size: 14px;
    font-weight: 400;
    color: #bbbbbb;
    line-height: 30px;
    cursor: pointer;
  }

  .ruleDetails-right-middle {
    min-height: 146px;
    background: rgba(255, 255, 255, 1);
    border-radius: 10px;
    margin-top: 20px;
    margin-bottom: 20px;
    padding-bottom: 12px;
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
    padding-top: 6px;
  }

  .ruleDetails-right-top-words {
    margin: 0px 24px;
    font-size: 14px;
    padding-top: 8px;
    color: rgba(102, 102, 102, 1);
  }

  .line {
    margin: 0px 19px;
    padding-top: 12px;
    border-bottom: 1px solid rgba(237, 237, 237, 1);
  }
}

.flex {
  color: #8994a0;
  text-align: center;
}

.el-scrollbar__wrap {
  z-index: 99999;
}
</style>
