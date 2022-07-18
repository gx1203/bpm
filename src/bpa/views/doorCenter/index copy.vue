<template>
  <div id="home" class="w100">
    <!-- 轮播 -->
    <div class="topbar">
      <img class="w100 h100 headerImg" src="../../assets/img/beijlan.png" alt>
      <div class="tooltip-rotate">
        <el-row :gutter="30">
          <el-col :span="13" class="product">
            <p class="description" :title="introduction.content">{{ introduction.content }}</p>
            <!-- <el-button round style="background: transparent;color: white;padding: 5px 20px;">{{$t("detail")}}
            </el-button> -->
            <el-image
              style="width: 65px;position: absolute;height: 25px;left: 15px;bottom: 0px;background: transparent;border-radius: 50%;"
              :src="carouselimg" :preview-src-list="imgList">
            </el-image>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 流程框架 -->
    <div class="process_iframe">
      <h4 class="titleH titleContent1" style="position: absolute;top: -120px;left: 50%;transform: translate(-50%, 0);">
        <img src="../../assets/img/processTitle1.png" alt />
        <div class="titleContent">{{$t("processFramework")}}
        </div>
      </h4>
      <div class="img_wrap">
        <frame-show @outClick="showListView=true"></frame-show>
      </div>
    </div>

    <!-- 分析报告 -->
    <!-- <div class="model_process">
      <div class="modelCenter">
        <h4 class="titleH titleContent1">
          <img src="../../assets/img/processTitle3.png" alt />
          <div class="titleContent">{{$t("analysisReport")}}</div>
          <p class="titleEn">ANALYSIS REPORT</p>
        </h4>
        <div class="model_container">
          <div v-for="(item, index) in reports" :key="item.id" :style="index % 4 === 0 ? '' : 'border-left:0px'"
            class="model">
            <el-row>
              <el-col :span="6">
                <div style="padding: 20px 10px;">
                  <img src="../../assets/img/pdf_icon.png" alt />
                </div>
              </el-col>
              <el-col :span="18">
                <el-row style="padding:10px">
                  <a :href="item.viewurl" target="_blank">
                    <el-col :span="24">
                      <h5 :title="item.periodName" class="modelTitle">{{ item.periodName }}</h5>
                    </el-col>
                  </a>
                  <el-col :span="24">
                    <el-row>
                      <el-col :span="18">
                        <div class="modelTime">{{ item.createon }}</div>
                      </el-col>
                      <el-col :span="6">
                        <div class="modelDownload">
                          <span class="downloadA" download @click.stop="downloadReport(item)">下载</span>
                        </div>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="more" v-if="reports && reports.length > 0">
          <router-link :to="{path: '/analyseWatchCenter/analysisReport'}">{{$t('toViewMore')}}></router-link>
        </div>
        <div v-else class="noData">
          <img :src="nothingImg" alt="">
          <p>{{$t('noData')}}</p>
        </div>
      </div>
    </div> -->

    <!-- 流程学习 -->
    <div class="study_process">
      <div class="processCenter">
        <h4 class="titleH titleContent1">
          <img src="../../assets/img/processTitle2.png" alt />
          <div class="titleContent2">{{$t("processManagementData")}}</div>
        </h4>
        <div class="study_container">
          <div class="study_right">
            <h5 class="manageTitle doBook">
              <div>{{$t("processManagementSpecification")}}</div>
              <div class="line" />
            </h5>
            <div class="study_rightc">
              <el-row v-for="item in specifications" :key="item.id">
                <el-col :span="24" class="overflow-els">
                  <a class="study_link" @click="noView(item)">{{ item.titlename }}</a>
                </el-col>
                <el-col :span="18" style="color:rgba(153,153,153,1)">{{ item.createon }}</el-col>
                <el-col :span="6" class="text_overflow" align="right"
                  style="color:rgba(153,153,153,1;text-align: right;">
                  {{ item.createname }}
                </el-col>
              </el-row>
            </div>
            <div class="more" v-if="specifications && specifications.length > 0">
              <router-link :to="{path: '/doorCenter/processManagementSpecification'}">{{$t('toViewMore')}}</router-link>
            </div>
            <div v-else class="noData">
              <img :src="nothingImg" alt="">
              <p>{{$t('noData')}}</p>
            </div>
          </div>
          <div class="study_right">
            <h5 class="manageTitle">
              <div>{{$t('trainingMaterials')}}</div>
              <div class="line" />
            </h5>
            <div class="study_rightc">
              <el-row v-for="item in studymanage" :key="item.id">
                <el-col :span="24" class="overflow-els">
                  <a class="study_link" @click="noView(item)">{{ item.titlename }}</a>
                </el-col>
                <el-col :span="18" style="color:rgba(153,153,153,1)">{{ item.createon }}</el-col>
                <el-col :span="6" class="text_overflow" align="right"
                  style="color:rgba(153,153,153,1;text-align: right;">
                  {{ item.createname }}
                </el-col>
                <!-- <el-col :span="3">
                  <a :href="downloadFile(item.id)" target="_blank" class="downloadA" download>{{$t('download')}}</a>
                </el-col> -->
              </el-row>
            </div>
            <div class="more" v-if="studymanage && studymanage.length > 0">
              <router-link :to="{path: '/doorCenter/newsManage'}">{{$t('toViewMore')}}</router-link>
            </div>
            <div v-else class="noData">
              <img :src="nothingImg" alt="">
              <p>{{$t('noData')}}</p>
            </div>
          </div>
          <div class="study_right">
            <h5 class="manageTitle doBook">
              <div>{{$t("processTemplate")}}</div>
              <div class="line" />
            </h5>
            <div class="study_rightc">
              <el-row v-for="item in templates" :key="item.id">
                <el-col :span="24" class="overflow-els">
                  <a class="study_link" @click="noView(item)">{{ item.titlename }}</a>
                </el-col>
                <el-col :span="18" style="color:rgba(153,153,153,1)">{{ item.createon }}</el-col>
                <el-col :span="6" class="text_overflow" align="right"
                  style="color:rgba(153,153,153,1;text-align: right;">
                  {{ item.createname }}
                </el-col>
              </el-row>
            </div>
            <div class="more" v-if="templates && templates.length > 0">
              <router-link :to="{path: '/doorCenter/processTemplateManage'}">{{$t('toViewMore')}}</router-link>
            </div>
            <div v-else class="noData">
              <img :src="nothingImg" alt="">
              <p>{{$t('noData')}}</p>
            </div>
          </div>
          <!-- <div class="study_right">
            <h5 class="manageTitle doBook">
              <div>{{$t("operationManual")}}</div>
              <div class="line" />
            </h5>
            <div class="study_rightc">
              <el-row v-for="item in operat" :key="item.id">
                <el-col :span="24" class="overflow-els">
                  <a class="study_link" @click="noView(item)">{{ item.titlename }}</a>
                </el-col>
                <el-col :span="18" style="color:rgba(153,153,153,1)">{{ item.createon }}</el-col>
                <el-col :span="6" class="text_overflow" align="right"
                  style="color:rgba(153,153,153,1;text-align: right;">
                  {{ item.createname }}
                </el-col>
              </el-row>
            </div>
            <div class="more" v-if="operat && operat.length > 0">
              <router-link :to="{path: '/doorCenter/operateBook'}">{{$t('toViewMore')}}</router-link>
            </div>
          </div> -->
        </div>
      </div>
    </div>

    <!-- 系统操作手册 -->
    <!-- <div class="system_process">
      <h4 class="titleH">系统操作手册</h4>
      <div class="system_container">
        <div v-for="item in operat" :key="item.id" class="system">
          <h5>
            <a :href="host + '/attach/download/' + item.id" download>{{ item.newname }}</a>
          </h5>
          <p>通威股份业务流程价值链模型V1.6.xlsx通威股份业务流程价值链模型V1.6.xlsx通威股份业务流程价值链模型V1.6.xlsx通威股份业务流程价值链模型V1.6.xlsx</p>
          <div class="name">
            <p>{{ item.createby}}</p>
            <p>{{ item.createon }}</p>
          </div>
        </div>
      </div>
      <div class="more">
        <router-link :to="{path: '/doorCenter/operateBook'}">更多操作手册</router-link>
      </div>
    </div>-->

    <!-- 模板 -->
    <!-- <div class="model_process">
      <div class="modelCenter">
        <h4 class="titleH titleContent1">
          <img src="../../assets/img/processTitle3.png" alt />
          <div class="titleContent">{{$t("systemTemplate")}}</div>
        </h4>
        <div class="model_container">
          <div v-for="(item, index) in modules" :key="item.id" :style="index % 4 === 0 ? '' : 'border-left:0px'"
            class="model">
            <el-row>
              <el-col :span="6">
                <div style="padding: 20px 10px;">
                  <img src="../../assets/img/pdf_icon.png" alt />
                </div>
              </el-col>
              <el-col :span="18">
                <el-row style="padding:10px">
                  <a @click="noView(item)">
                    <el-col :span="24">
                      <h5 :title="item.titlename" class="modelTitle">{{ item.titlename }}</h5>
                    </el-col>
                  </a>
                  <el-col :span="24">
                    <el-row>
                      <el-col :span="18">
                        <div class="modelTime">{{ item.createon }}</div>
                      </el-col>
                      <el-col :span="6">
                        <div class="modelDownload">
                          <a :href="downloadFile(item.id)" target="_blank" class="downloadA" download
                            @click.stop="''">下载</a>
                        </div>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="more" v-if="modules && modules.length > 0">
          <router-link :to="{path: '/doorCenter/modelProcess'}">{{$t('toViewMore')}}></router-link>
        </div>
      </div>
    </div> -->
    <select-person2 v-model="isSelectPersonVisible" @confirm="handlerSelectPersonComfirm" />

    <el-dialog
      title="列表视图"
      :visible.sync="showListView"
      v-show="showListView" width="80%">
    <list-frame :showHouseBtn="false"/>
    </el-dialog>

  </div>
</template>

<script>
import { getFormateDate } from '../../utils/common'
import { newSche, getEvents, getIntroduction } from '@/bpa/api/doorCenter'
import { getStudyList } from '@/bpa/api/settings/processStudyManage'
import { getNoticeList } from '@/bpa/api/settings/noticeManage'
// import { getModuleList } from '@/bpa/api/settings/modulesManage'
import { queryReport } from "@/bpa/api/analyseWatchCenter";
import { queryProcessManagementCopy } from '@/bpa/api/settings/processManagementSpecification'
import { queryProcessTemplateCopy } from '@/bpa/api/settings/processTemplateManage'
// import { getBooksList } from '@/bpa/api/settings/operatingBooksManage'

import frameShow from '@/bpa/components/processFrameShow2.vue'
import listFrame from '@/bpa/views/processModelCenter/processIframeCenter/index.vue'

import carouselimg from '@/bpa/assets/img/transparent.png'
import img5 from '@/assets/img/carousel/carousel5.jpg'
import img6 from '@/assets/img/carousel/carousel6.jpg'
import img7 from '@/assets/img/carousel/carousel7.jpg'
import img8 from '@/assets/img/carousel/carousel8.jpg'
import img9 from '@/assets/img/carousel/carousel9.jpg'
import img10 from '@/assets/img/carousel/carousel10.jpg'
import img11 from '@/assets/img/carousel/carousel11.jpg'
import img12 from '@/assets/img/carousel/carousel12.jpg'
import img13 from '@/assets/img/carousel/carousel13.jpg'
import img14 from '@/assets/img/carousel/carousel14.jpg'
import img15 from '@/assets/img/carousel/carousel15.jpg'
import img16 from '@/assets/img/carousel/carousel16.jpg'
import img17 from '@/assets/img/carousel/carousel17.jpg'
import img18 from '@/assets/img/carousel/carousel18.jpg'
import img19 from '@/assets/img/carousel/carousel19.jpg'
import nothingImg from '@/assets/img/nothing.png'

import { createNamespacedHelpers } from 'vuex'
import fileOperation from '@/bpa/mixins/fileDownView'

const userInfo = createNamespacedHelpers('userInfo')
const warningType = [
  {
    label: '正点',
    value: '1'
  },
  {
    label: '提前15分钟',
    value: '2'
  },
  {
    label: '提前30分钟',
    value: '3'
  },
  {
    label: '提前1小时',
    value: '4'
  },
  {
    label: '提前2小时',
    value: '5'
  },
  {
    label: '提前1天',
    value: '6'
  },
  {
    label: '提前2天',
    value: '7'
  },
  {
    label: '不提醒',
    value: '9'
  }
]
const repeatType = [
  {
    label: '不重复',
    value: '0'
  },
  {
    label: '按天重复',
    value: '1'
  },
  {
    label: '按周重复',
    value: '2'
  },
  {
    label: '按月重复',
    value: '3'
  },
  {
    label: '按年重复',
    value: '4'
  }
]
const weeks = [
  '星期日',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六'
]
export default {
  components: {
    frameShow,
    listFrame
  },
  data () {
    return {
      carouselimg: carouselimg,
      imgList: [img5, img6, img7, img8, img9, img10, img11, img12, img13, img14, img15, img16, img17, img18, img19],
      nothingImg: nothingImg,
      radio1: 'month',
      isSelectPersonVisible: false,
      value2: new Date(),
      eventList: [],
      checkedDate: getFormateDate(new Date(), 'yyyy 年 MM 月 dd 日'),
      checkedweek: weeks[new Date().getDay()],
      dialogVisible: false,
      showListView:false,
      warningType,
      repeatType,
      form: {
        name: 1,
        remind: 2,
        isrepeat: 0
      },
      rules: {
        content: [{ required: true, message: ' ', trigger: 'blur' }],
        enddate: [
          { type: 'date', required: true, message: ' ', trigger: 'change' }
        ],
        isallday: [{ required: true, message: ' ', trigger: 'change' }],
        isrepeat: [{ required: true, message: ' ', trigger: 'change' }],
        participantname: [{ required: true, message: ' ', trigger: 'input' }],
        remind: [{ required: true, message: ' ', trigger: 'change' }],
        remindtime: [{ required: true, message: ' ', trigger: 'change' }],
        startdate: [
          { type: 'date', required: true, message: ' ', trigger: 'change' }
        ],
        title: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      // 新闻管理
      newsmanage: {},
      // 流程学习
      studymanage: [],
      modules: [], // 系统模板
      reports: [], // 分析报告
      specifications: [], // 流程管理规范
      templates: [], // 流程模板
      operat: [],
      introduction: ''
    }
  },
  created () {
    const _this = this
    window['toPageProcess'] = processid => {
      _this.$router.push({
        path: '/processModelCenter/processIframeCenter',
        query: { attrid: processid }
      })
    }
  },
  // eslint-disable-next-line vue/order-in-components
  computed: {
    // ...userInfo.mapGetters(['getUserMenu']),
    host () {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    }
  },
  mixins: [fileOperation],
  mounted () {
    this.requiredData()
    this.getIntroductions()
  },
  methods: {
    getFormateDate,
    getIntroductions () {
      getIntroduction({}).then(res => {
        this.introduction = res[0]
        console.log(res)
      })
    },
    requiredData () {
      Promise.all([
        getStudyList({
          attr: {},
          orderby: 'createon',
          pageNum: 1,
          pageSize: 5,
          sort: 'desc',
          logic: 'or',
          filters: []
        }),
        getNoticeList({
          attr: {},
          filters: [],
          logic: 'or',
          orderby: 'createon',
          pageNum: 1,
          pageSize: 4,
          sort: 'desc'
        }),
        // getModuleList({
        //   attr: {},
        //   filters: [],
        //   logic: 'or',
        //   orderby: 'createon',
        //   pageNum: 1,
        //   pageSize: 8,
        //   sort: 'desc'
        // }),
        queryReport({
          attr: {},
          filters: [],
          logic: 'or',
          orderby: 'createon',
          pageNum: 1,
          pageSize: 4,
          sort: 'desc'
        }),
        queryProcessManagementCopy({
          attr: {},
          filters: [],
          logic: 'or',
          orderby: 'createon',
          pageNum: 1,
          pageSize: 5,
          sort: 'desc'
        }),
        queryProcessTemplateCopy({
          attr: {},
          filters: [],
          logic: 'or',
          orderby: 'createon',
          pageNum: 1,
          pageSize: 5,
          sort: 'desc'
        })
        // 操作手册
        // getBooksList({
        //   attr: {},
        //   filters: [],
        //   logic: 'or',
        //   orderby: 'createon',
        //   pageNum: 1,
        //   pageSize: 5,
        //   sort: 'desc'
        // })
      ]).then(res => {
        console.log(res)
        if (!res) return false
        this.newsmanage = res[1].list
        this.studymanage = res[0].list
        // this.modules = res[2].list
        this.reports = res[2].list
        this.specifications = res[3].list
        this.templates = res[4].list
        // this.operat = res[5].list
      })
    },
    handlerDateClick (v) {
      console.log(v)
      this.checkedDate = getFormateDate(new Date(v), 'yyyy 年 MM 月 dd 日')
      this.checkedweek = weeks[new Date(v).getDay()]
      getEvents(v).then(res => {
        if (!res) return false
        this.eventList = res
      })
    },
    handlerSelectPersonComfirm (list) {
      this.form.participantname = list
        .map(item => {
          return item.cnname
        })
        .toString()
    },
    newSche () {
      this.$refs.formRuleRef.validate(valid => {
        if (valid) {
          newSche(this.form).then(res => {
            if (!res) return false
            if (res) {
              this.$message({
                type: 'success',
                message: '新建日程成功！'
              })
              this.dialogVisible = false
            }
          })
        }
      })
    },
    downloadReport (item) {
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/electronicSignature/download/${item.fileId}?attachmentType=bpm`;
      console.log(link.href);
      link.setAttribute("download", "");
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(link.href);
    }
  }
}
</script>

<style lang="scss" scoped>
#home {
  .borderLineLefts {
    position: absolute;
    left: 36%;
    width: 155px;
    border-bottom: 2px solid #cccccc;
    .borderCircle {
      position: absolute;
      right: 0;
      top: -2px;
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 6px;
      background: #cccccc;
    }
  }
  .topbar {
    position: relative;
    margin-bottom: 100px;
  }
  .bpaDetails {
    width: 1000px;
    height: 210px;
    position: absolute;
    background: url("../../assets/img/detailBg.png") no-repeat;
    background-size: cover;
    z-index: 20;
    box-sizing: border-box;
    left: 50%;
    transform: translate(-50%);
    margin-top: -100px;
    padding: 20px;
    h4 {
      font-size: 20px;
      line-height: 50px;
      text-align: center;
      color: #fff;
      display: inline-block;
      vertical-align: top;
      border-bottom: 3px solid #fff;
      box-sizing: border-box;
      margin-right: 15px;
    }
    span {
      display: inline-block;
      vertical-align: top;
      overflow: hidden;
      height: 30px;
      line-height: 50px;
      margin-top: 20px;
    }
    .content {
      margin-top: 10px;
      color: #fff;
    }
    .enname {
      color: grey;
      font-size: 16px;
    }
    p {
      line-height: 36px;
      font-size: 14px;
      text-indent: 2em;
    }
  }
  .borderLineRight {
    position: absolute;
    right: 36%;
    width: 155px;
    border-bottom: 2px solid #cccccc;
    .borderCircle {
      position: absolute;
      left: 0;
      top: -2px;
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 6px;
      background: #cccccc;
    }
  }
  .modelBorderL {
    left: 37%;
  }
  .modelBorderR {
    right: 37%;
  }
  .processBorderL {
    left: 33%;
  }
  .processBorderR {
    right: 33%;
  }
  .tooltip-rotate {
    position: absolute;
    top: 140px;
    left: 0;
    right: 0;
    bottom: 0;
    width: 60%;
    margin: 0 auto;
    color: #fff;
    /deep/ .el-image-viewer__img {
      transform: scale(1.5) rotate(0deg);
    }
    .description {
      font-size: 13px;
      margin-bottom: 15px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
    .bigLogo {
      border: 1px solid rgba(84, 189, 255, 1);
      font-size: 30px;
      text-align: center;
      border-radius: 23px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
      line-height: 46px;
      width: 305px;
      // text-shadow: 0 5px 10px #2d2d2d;
    }
    .more {
      margin-top: 50px;
      font-size: 18px;
      color: #fff;
      display: inline-block;
      vertical-align: top;
      padding: 8px 0;
      border-bottom: 1px solid #fff;
      a {
        color: #fff;
      }
      i {
        font-size: 18px;
      }
    }
  }
  .titleH {
    // position: relative;
    font-size: 30px;
    font-family: "Microsoft YaHei";
    font-weight: 400;
    margin-bottom: 30px;
    padding-top: 40px;
    color: rgba(41, 40, 41, 1);
    line-height: 55px;
    text-align: center;
  }
  .titleEnglish {
    margin-bottom: 40px;
    text-align: center;
    font-size: 14px;
    font-family: Arial;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: 16px;
  }
  .manageTitle {
    text-align: center;
    font-size: 22px;
    font-family: "Microsoft YaHei";
    font-weight: 400;
    height: 50px;
    color: rgba(255, 255, 255, 1);
    line-height: 50px;
    background: url("../../assets/img/rule.png");
  }
  .downloadA {
    color: #2d42af;
  }
  .lookMore {
    a {
      padding-bottom: 5px;
      border-bottom: 1px solid #ffffff;
    }
  }
  .more {
    text-align: center;
    font-size: 14px;
    font-family: "Microsoft YaHei";
    font-weight: 400;
    line-height: 55px;
    margin: 15px 0;
    a {
      color: #fff;
      padding: 8px 90.61px;
      background: #2d42af;
      border-radius: 5px;
    }
  }
  .doBook {
    background: url("../../assets/img/operate.png");
  }
  .orgmanage {
    background: url("../../assets/img/org.png");
  }
  .notice_container {
    height: 135px;
    background-color: rgba(45, 66, 175, 1);
    .notice_wrap {
      width: 1200px;
      border-right: 1px solid #77b4db;
      border-left: 1px solid #77b4db;
      margin: 0 auto;
      .notice {
        width: 20%;
        height: 135px;
        padding: 15px 20px;
        float: left;
        box-sizing: border-box;
        border-left: 1px solid #77b4db;
        color: #fff;
        position: relative;
        &:first-child {
          border-left: 0;
        }
        &_more {
          text-align: center;
          .gonggao {
            font-size: 40px;
            color: #fff;
          }
          .more {
            display: inline-block;
            padding-bottom: 5px;
            margin-top: 10px;
            cursor: pointer;
            font-size: 18px;
            border-bottom: 1px solid #fff;
            a,
            .icon {
              font-size: 18px;
              color: #fff;
            }
          }
        }
        .title {
          font-size: 16px;
          line-height: 26px;
          font-family: "Microsoft YaHei";
          font-weight: 400;
          a {
            color: #ffffff;
          }
        }
        .content {
          font-size: 14px;
          line-height: 20px;
          margin-bottom: 10px;
          color: rgba(255, 255, 255, 0.8);
          margin: 5px 0 12px 0;
        }
        .date {
          width: 100%;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
          position: absolute;
          bottom: 10px;
          left: 15px;
          font-weight: 400;
          line-height: 26px;
        }
        .noticeDownload {
          position: absolute;
          bottom: 17px;
          right: 45px;
          a {
            color: rgba(255, 255, 255, 0.5);
          }
        }
      }
    }
  }
  .daily_task {
    background: #fff;
    padding: 0 60px 56px;

    .task_item {
      width: 130px;
      padding: 10px 0;
      margin: 0 auto;
      background: #e8f4ff;
      border-radius: 5px;
      .num {
        width: 90px;
        height: 90px;
        margin: 0 auto;
        line-height: 90px;
        text-align: center;
        border-radius: 50%;
        font-size: 50px;
        font-weight: bold;
        color: #fff;
      }
    }
    p {
      font-size: 22px;
      line-height: 54px;
      text-align: center;
    }
  }
  .process_iframe {
    min-height: 667px;
    // margin: 24px 0;
    position: relative;
    background-image: url("../../assets/img/map_bg.png");
    background-size: cover;
    background-repeat: no-repeat;
    .img_wrap {
      max-width: 1200px;
      margin: 0 auto;
      img {
        display: block;
        max-width: 100%;
        margin: 0 auto;
      }
    }
  }
  .fast_application {
    background: #fff;
    padding-bottom: 78px;

    .app_list {
      padding: 0 65px;
      .app_item {
        width: 20%;
        float: left;
        &.plus {
          .app_wrap {
            width: 150px;
            height: 150px;
            border-radius: 8px;
            background-color: #e8f4ff;
            img {
              width: 80px;
              height: 80px;
              max-width: 80px;
              max-height: 80px;
            }
          }
        }
        .app_wrap {
          width: 150px;
          height: 150px;
          margin: 0 auto;
          position: relative;
          img {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            display: block;
            max-width: 60px;
            max-height: 60px;
          }
        }
        p {
          font-size: 24px;
          text-align: center;
          margin-top: 20px;
          margin-bottom: 0;
        }
      }
    }
  }
  .daily_set {
    background: #f5f5f5;
    padding-bottom: 80px;
    h4 {
      margin: 0;
      // padding: 64px 0 56px;
      font-size: 30px;
      font-weight: normal;
      text-align: center;
    }
    .daily_container {
      width: 1240px;
      margin: 0 auto;
      border-radius: 10px;
      background: #fff;
      overflow: hidden;
      position: relative;
      .daily_left {
        width: 445px;
        background-color: #4291d6;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        padding-top: 150px;
        .first_step {
          height: 50px;
          .step_left {
            width: 90px;
            height: 50px;
            float: left;
            position: relative;
            text-align: center;
            &:after {
              content: "";
              display: block;
              width: 1px;
              height: 25px;
              background: #fff;
              position: absolute;
              left: 50%;
              top: 46px;
              margin-left: -1px;
            }
            .round {
              display: inline-block;
              padding: 3px;
              border-radius: 50%;
              margin-top: 30px;
              border: 1px solid #fff;
              span {
                display: block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #fff;
              }
            }
          }
          .step_right {
            float: left;
            width: 355px;
            height: 50px;
            p {
              color: #fff;
              margin: 0;
              height: 25px;
              line-height: 25px;
              font-size: 14px;
              &.week {
                font-size: 22px;
              }
            }
          }
        }
        .step {
          .step_left {
            width: 90px;
            height: 50px;
            float: left;
            position: relative;
            text-align: center;
            &:before {
              content: "";
              display: inline-block;
              vertical-align: middle;
              height: 100%;
              clear: both;
            }
            &:after {
              content: "";
              display: block;
              width: 1px;
              height: 50px;
              background: #fff;
              position: absolute;
              left: 50%;
              top: 37px;
              margin-left: -1px;
            }
            .time {
              display: inline-block;
              vertical-align: middle;
              height: 24px;
              line-height: 24px;
              padding: 0 10px;
              border-radius: 12px;
              color: #fff;
              font-size: 14px;
              background: #24a6ff;
            }
          }
          .step_right {
            float: left;
            width: 355px;
            height: 50px;
            .info {
              box-sizing: border-box;
              height: 20px;
              line-height: 20px;
              color: #fff;
              font-size: 16px;
              margin-top: 15px;
              padding-right: 20px;
              max-width: 100%;
              display: inline-block;
              vertical-align: top;
            }
          }
        }
        .last_step {
          .step_left {
            width: 90px;
            height: 50px;
            text-align: center;
            float: left;
            .arrow_down {
              display: inline-block;
              width: 36px;
              height: 36px;
              margin-top: 7px;
              box-sizing: border-box;
              background: #4291d6;
              border-radius: 50%;
              border: 1px solid #fff;
              text-align: center;
              position: relative;
              z-index: 2;
              .icon {
                font-size: 24px;
                color: #fff;
                display: inline-block;
                vertical-align: middle;
              }
              &:after {
                content: "";
                display: inline-block;
                height: 100%;
                vertical-align: middle;
              }
            }
          }
          .step_right {
            height: 50px;
            p {
              height: 50px;
              line-height: 50px;
              color: #fff;
              font-size: 16px;
              padding-right: 20px;
            }
          }
        }
      }
      .daily_right {
        width: 795px;
        padding: 0 50px;
        padding-top: 35px;
        margin-left: 445px;
        box-sizing: border-box;
        .select_month {
          .left {
            display: block;
            height: 40px;
            float: left;
            span {
              display: inline-block;
              vertical-align: middle;
              line-height: 40px;
              color: #333;
              font-size: 30px;
            }
            .icon {
              color: #cdcdcd;
              display: inline-block;
              margin-left: 10px;
              cursor: pointer;
            }
            &:after {
              content: "";
              display: inline-block;
              height: 100%;
              vertical-align: middle;
            }
          }
          .visibility {
            width: 0;
            padding: 0;
            margin-left: -200px;
          }
          .select_month_week_Type {
            float: right;
            margin-top: 6px;
          }
        }
        .work_list {
          padding: 20px 0;
          .work_item {
            width: 20%;
            float: left;
            &.ff8100 {
              p {
                color: #ff8100;
              }
            }
            &.ff6a6d {
              p {
                color: #ff6a6d;
              }
            }
            &.gray {
              p {
                color: #666666;
              }
            }
            &.plus {
              height: 80px;
              padding-top: 15px;
              box-sizing: border-box;
              .icon_wrap {
                width: 50px;
                height: 50px;
                margin: 0 auto;
                background-color: #24a6ff;
                border-radius: 50%;
                text-align: center;
                cursor: pointer;
                .icon {
                  display: inline-block;
                  vertical-align: middle;
                  font-size: 24px;
                  color: #fff;
                }
                &:after {
                  content: "";
                  display: inline-block;
                  height: 100%;
                  vertical-align: middle;
                }
              }
            }
            p {
              text-align: center;
              color: #24a6ff;
              line-height: 40px;
            }
            .text {
              font-size: 12px;
            }
            .num {
              font-size: 30px;
            }
          }
        }
      }
    }
  }
  .study_process {
    position: relative;
    background: rgba(237, 244, 254, 1);
    padding-bottom: 80px;
    .processCenter {
      width: 1280px;
      margin: 0 auto;
    }
    .study_left {
      width: 337px;
      height: 400px;
      img {
        width: 100%;
      }
    }
    .study_container {
      display: flex;
      width: 1200px;
      justify-content: space-between;
      margin: 0 auto;
      overflow: hidden;
      position: relative;
      .study_right {
        width: 32%;
        background: #ffffff;
        box-sizing: border-box;
        top: 18px;
        overflow: hidden;
        border-radius: 10px;
        .line {
          width: 50px;
          height: 3px;
          background: rgba(237, 237, 237, 1);
          margin: 0 auto;
        }
        .text_overflow {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .study_rightc {
        padding: 0 20px;
        font-size: 14px;
        font-family: "Microsoft YaHei";
        font-weight: 400;
        color: rgba(51, 50, 51, 1);
        line-height: 36px;
        > :nth-child(2n) {
          background: #fcfcfc;
        }
        .el-row {
          padding: 0px 10px;
          border-bottom: 1px solid #eeeeee;
          .study_link {
            &:hover {
              color: $active-color;
            }
          }
        }
      }
    }
  }
  .system_process {
    background: #ffffff;
    width: 1280px;
    margin: 0 auto;
    // padding-bottom: 80px;
    .system_container {
      width: 88%;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      color: rgb(22, 21, 21);
      .system {
        width: 33.3%;
        padding: 5px 10px;
        box-sizing: border-box;
        position: relative;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(229, 229, 229, 1);

        h5 {
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          line-height: 55px;
        }
        p {
          font-size: 12px;
          font-family: "Microsoft YaHei";
          font-weight: 400;
          line-height: 22px;
          opacity: 0.8;
        }
        .name {
          margin-top: 10px;
          display: flex;
          font-size: 12px;
          font-family: " Microsoft YaHei";
          font-weight: 400;
          line-height: 22px;
          opacity: 0.6;
          justify-content: space-between;
        }
      }
      > :first-child {
        background: linear-gradient(
          90deg,
          rgba(29, 132, 212, 1),
          rgba(29, 80, 212, 1)
        );
        a {
          color: rgba(255, 255, 255, 1);
        }
      }
      > :nth-child(3) {
        background: linear-gradient(
          90deg,
          rgba(29, 132, 212, 1),
          rgba(29, 80, 212, 1)
        );
        a {
          color: rgba(255, 255, 255, 1);
        }
      }
      > :nth-child(5) {
        background: linear-gradient(
          90deg,
          rgba(63, 194, 216, 1),
          rgba(0, 136, 187, 1)
        );
        a {
          color: rgba(255, 255, 255, 1);
        }
      }
      .more {
        text-align: center;
        font-size: 14px;
        font-family: "Microsoft YaHei";
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        line-height: 55px;
      }
    }

    .more {
      text-align: center;
      font-size: 14px;
      font-family: "Microsoft YaHei";
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      line-height: 55px;
    }
  }
  .model_process {
    background: #ffffff;
    // padding-bottom: 80px;
    position: relative;
    .modelCenter {
      width: 1280px;
      margin: 0 auto;
    }
    .model_container {
      width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      color: rgba(102, 102, 102, 1);
      .model {
        // text-align: center;
        margin-bottom: 20px;
        // padding: 30px 0px;
        box-sizing: border-box;
        width: 25%;
        // margin-right: 10px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(229, 229, 229, 1);
      }
      .model:nth-of-type(4n) {
        margin-right: 0;
      }
      a :hover {
        color: #2d42af;
        text-decoration: underline;
      }
    }
    .modelTitle {
      font-size: 14px;
      font-family: "Microsoft YaHei";
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 64px;
      overflow: hidden; /*超出部分隐藏*/
      text-overflow: ellipsis; /*超出部分显示省略号*/
      white-space: nowrap; /*规定段落中的文本不进行换行 */
    }
    .modelTime {
      font-size: 14px;
      font-family: "Microsoft YaHei";
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
    }
    .modelDownload {
      // margin-top: 20px;
      .downloadA {
        font-size: 12px;
        border: 1px solid #2d42af;
        color: #2d42af;
        padding: 2px 6px;
        border-radius: 4px;
        cursor: pointer;
      }
    }
  }
  .titleContent1 {
    position: relative;
    .titleContent {
      position: absolute;
      width: 250px;
      height: 50px;
      background-color: #fff;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 20px;
      font-weight: 700;
    }
    .titleEn {
      position: absolute;
      width: 250px;
      height: 30px;
      line-height: 30px;
      background-color: #fff;
      top: calc(50% + 40px);
      left: 50%;
      -webkit-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      font-size: 14px;
      color: #bbb;
    }
    .titleContent2 {
      position: absolute;
      width: 342px;
      height: 50px;
      background-color: #edf4fe;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 20px;
      font-weight: 700;
    }
  }
  .noData {
    line-height: 30px;
    color: #999999;
    text-align: center;
    font-size: 14px;
    margin: 100px 0;
    img {
      width: 180px;
    }
  }
  /deep/.el-dialog__wrapper{
    /*//IE 滚动条不显示*/
    -ms-overflow-style: none;
    /*//Firefox浏览器 滚动条不显示*/
    scrollbar-width: none;
    /*Chrome 等滚动条不显示*/
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
