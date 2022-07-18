<template>
  <div id="home" class="w100">
    <!-- 轮播 -->
    <el-carousel height="400px">
      <el-carousel-item class="h100" v-for="item in 1" :key="item">
        <img class="w100 h100" src="../../assets/img/slide.png" alt />
        <div class="tooltip-rotate">
          <p class="bigLogo">{{newsmanage.newname}}</p>
          <!-- <p class="font20 margin-t20">推动流程管理变革 提升企业流程成熟度</p>
          <p class="font20 line-height35">实现业务流程驱动</p>-->
          <div class="more">
            <router-link :to="{path: '/doorCenter/newsManage'}">更多新闻</router-link>
            <i class="icon iconfont icon-youjiantou"></i>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
    <!-- 公告 -->
    <div class="notice_container">
      <div class="notice_wrap clear-fix">
        <div class="notice notice_more">
          <p class="gonggao">公告</p>
          <div class="more">
            <router-link :to="{path: '/doorCenter/noticeManage'}">更多</router-link>
            <i class="icon iconfont icon-youjiantou"></i>
          </div>
        </div>
        <div class="notice" v-for="item in 4" :key="item.id">
          <p
            class="title text_overflow_1"
          >{{!studymanage[item - 1] ? '' : studymanage[item - 1].newname}}</p>
          <!-- <p class="content text_overflow_2">业务流程管理平台项目于2019-06-20正式启动关于业务流程管理平台关于业务流程管理平台</p> -->
          <p class="date">{{!studymanage[item - 1] ? '' : studymanage[item - 1].createon}}</p>
        </div>
        <!-- <div class="notice">
          <p class="title text_overflow_1">关于业务流程管理平台关于业务流程管理平台</p>
          <p class="content text_overflow_2">业务流程管理平台项目于2019-06-20正式启动关于业务流程管理平台关于业务流程管理平台</p>
          <p class="date">2019-06-12</p>
        </div>
        <div class="notice">
          <p class="title text_overflow_1">关于业务流程管理平台关于业务流程管理平台</p>
          <p class="content text_overflow_2">业务流程管理平台项目于2019-06-20正式启动关于业务流程管理平台关于业务流程管理平台</p>
          <p class="date">2019-06-12</p>
        </div>
        <div class="notice">
          <p class="title text_overflow_1">关于业务流程管理平台关于业务流程管理平台</p>
          <p class="content text_overflow_2">业务流程管理平台项目于2019-06-20正式启动关于业务流程管理平台关于业务流程管理平台</p>
          <p class="date">2019-06-12</p>
        </div>-->
      </div>
    </div>
    <!-- 日常工作 -->
    <!-- <div class="daily_task">
      <h4>日常工作</h4>
      <el-row>
        <el-col :span="4">
          <div class="task_item">
            <div class="num">24</div>
          </div>
          <p>过期</p>
        </el-col>
        <el-col :span="4">
          <div class="task_item">
            <div class="num">24</div>
          </div>
          <p>过期</p>
        </el-col>
        <el-col :span="4">
          <div class="task_item">
            <div class="num">24</div>
          </div>
          <p>过期</p>
        </el-col>
        <el-col :span="4">
          <div class="task_item">
            <div class="num">24</div>
          </div>
          <p>过期</p>
        </el-col>
        <el-col :span="4">
          <div class="task_item">
            <div class="num">24</div>
          </div>
          <p>过期</p>
        </el-col>
        <el-col :span="4">
          <div class="task_item">
            <div class="num">24</div>
          </div>
          <p>过期</p>
        </el-col>
      </el-row>
    </div>-->
    <!-- 流程框架 -->
    <div class="process_iframe">
      <h4>流程框架</h4>
      <div class="img_wrap">
        <iframe
          class="w100"
          src="./leftMenu/processFramework/BaseNewPage.html?id=79957553BD2F3978E053BF1A13ACD486&listid=7D36536AC5DD6356E0530701A8C0D2D1&treeId=79957553BD303978E053BF1A13ACD486&processName=构建愿景和战略&username=付大鹏&processNum=1.0&isRead=yes&showHead=yes"
          frameborder="0"
          height="800px"
        ></iframe>
      </div>
    </div>
    <!-- 快捷应用 -->
    <!-- <div class="fast_application">
      <h4>快捷应用</h4>
      <div class="app_list clear-fix">
        <div class="app_item">
          <div class="app_wrap">
            <img src="../../assets/img/app_logo01.png" alt="">
          </div>
          <p>请假</p>
        </div>
        <div class="app_item">
          <div class="app_wrap">
            <img src="../../assets/img/app_logo02.png" alt="">
          </div>
          <p>出差</p>
        </div>
        <div class="app_item">
          <div class="app_wrap">
            <img src="../../assets/img/app_logo03.png" alt="">
          </div>
          <p>报销</p>
        </div>
        <div class="app_item">
          <div class="app_wrap">
            <img src="../../assets/img/app_logo04.png" alt="">
          </div>
          <p>采购</p>
        </div>
        <div class="app_item plus">
          <div class="app_wrap">
            <img src="../../assets/img/plus.png" alt="">
          </div>
          <p>添加应用</p>
        </div>
      </div>
    </div>-->
    <!-- 日程安排 -->
    <div class="daily_set">
      <h4>日程安排</h4>
      <div class="daily_container">
        <div class="daily_left">
          <div class="first_step clear-fix">
            <div class="step_left">
              <div class="round">
                <span></span>
              </div>
            </div>
            <div class="step_right">
              <p>{{checkedDate}}</p>
              <p class="week">{{checkedweek}}</p>
            </div>
          </div>
          <el-scrollbar class="calendar">
            <div class="step clear-fix" v-for="(item,index) in eventList" :key="index">
              <div class="step_left">
                <div class="time">
                  <span>{{ item.date }}</span>
                </div>
              </div>
              <div class="step_right">
                <el-tooltip class="item" effect="dark" :content="item.event" placement="top">
                  <p class="info text_overflow_1">{{ item.event }}</p>
                </el-tooltip>
              </div>
            </div>
            <div class="last_step clear-fix">
              <div class="step_left">
                <div class="arrow_down">
                  <i class="icon iconfont icon-xiangxiajiantou"></i>
                </div>
              </div>
              <div class="step_right">
                <p>暂无</p>
              </div>
            </div>
          </el-scrollbar>
        </div>
        <div class="daily_right">
          <div class="select_month clear-fix">
            <label for="visibility" class="left">
              <span>{{getFormateDate(value2, 'yyyy 年 MM 月')}}</span>
              <i class="icon iconfont icon-xiangxia"></i>
            </label>
            <el-date-picker clearable
              id="visibility"
              class="visibility"
              v-model="value2"
              type="month"
              format="yyyy年MM月"
              placeholder="选择月"
            ></el-date-picker>
            <el-radio-group class="select_month_week_Type" v-model="radio1">
              <el-radio-button label="month">月</el-radio-button>
              <!--              <el-radio-button label="week">周</el-radio-button>-->
            </el-radio-group>
          </div>
          <calendar :date="value2" :checkedDate="checkedDate" @click="handlerDateClick"></calendar>
          <div class="work_list clear-fix">
            <div class="work_item">
              <p class="text">待完成</p>
              <p class="num">10</p>
            </div>
            <div class="work_item ff8100">
              <p class="text">已完成</p>
              <p class="num">10</p>
            </div>
            <div class="work_item ff6a6d">
              <p class="text">未完成</p>
              <p class="num">10</p>
            </div>
            <div class="work_item gray">
              <p class="text">全部任务</p>
              <p class="num">10</p>
            </div>
            <div class="work_item plus">
              <div class="icon_wrap" @click="dialogVisible=true">
                <i class="icon iconfont icon-plus"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 新建日程 -->
    <el-dialog title="新建日程" :visible.sync="dialogVisible" width="50%">
      <el-form label-width="120px" :model="form" :rules="rules" ref="formRuleRef">
        <el-form-item label="日程主题：" prop="title">
          <el-input clearable v-model="form.title"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间：" prop="startdate">
              <el-date-picker clearable
                v-model="form.startdate"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间：" prop="enddate">
              <el-date-picker clearable
                v-model="form.enddate"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="全天事件：" prop="isallday">
          <el-radio-group v-model="form.isallday">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="提醒方式：" prop="remind">
              <el-select clearable v-model="form.remind" :placeholder="$t('pleaseSelect')">
                <el-option
                  v-for="(item,index) in warningType"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="重复方式：" prop="isrepeat">
              <el-select clearable v-model="form.isrepeat" :placeholder="$t('pleaseSelect')">
                <el-option
                  v-for="(item,index) in repeatType"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="其它参与人：" prop="participantname">
          <el-input clearable v-model="form.participantname" @focus="isSelectPersonVisible=true"></el-input>
        </el-form-item>
        <el-form-item label="日程详情：" prop="content">
          <el-input clearable type="textarea" :rows="4" v-model="form.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="newSche">{{$t("confirm")}}</el-button>
      </span>
    </el-dialog>
    <select-person2 v-model="isSelectPersonVisible" @confirm="handlerSelectPersonComfirm"></select-person2>
  </div>
</template>

<script>
const warningType = [
  {
    label: "正点",
    value: "1"
  },
  {
    label: "提前15分钟",
    value: "2"
  },
  {
    label: "提前30分钟",
    value: "3"
  },
  {
    label: "提前1小时",
    value: "4"
  },
  {
    label: "提前2小时",
    value: "5"
  },
  {
    label: "提前1天",
    value: "6"
  },
  {
    label: "提前2天",
    value: "7"
  },
  {
    label: "不提醒",
    value: "9"
  }
];
const repeatType = [
  {
    label: "不重复",
    value: "0"
  },
  {
    label: "按天重复",
    value: "1"
  },
  {
    label: "按周重复",
    value: "2"
  },
  {
    label: "按月重复",
    value: "3"
  },
  {
    label: "按年重复",
    value: "4"
  }
];
const weeks = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六"
];

import { getFormateDate } from "../../utils/common";
import { newSche, getEvents } from "@/bpa/api/doorCenter";
import { getStudyList } from "@/bpa/api/settings/processStudyManage";
import { getNoticeList } from "@/bpa/api/settings/noticeManage";

export default {
  data() {
    return {
      radio1: "month",
      isSelectPersonVisible: false,
      value2: new Date(),
      eventList: [],
      checkedDate: getFormateDate(new Date(), "yyyy 年 MM 月 dd 日"),
      checkedweek: weeks[new Date().getDay()],
      dialogVisible: false,
      warningType,
      repeatType,
      form: {
        name: 1,
        remind: 2,
        isrepeat: 0
      },
      rules: {
        content: [{ required: true, message: " ", trigger: "blur" }],
        enddate: [
          { type: "date", required: true, message: " ", trigger: "change" }
        ],
        isallday: [{ required: true, message: " ", trigger: "change" }],
        isrepeat: [{ required: true, message: " ", trigger: "change" }],
        participantname: [{ required: true, message: " ", trigger: "input" }],
        remind: [{ required: true, message: " ", trigger: "change" }],
        remindtime: [{ required: true, message: " ", trigger: "change" }],
        startdate: [
          { type: "date", required: true, message: " ", trigger: "change" }
        ],
        title: [{ required: true, message: " ", trigger: "blur" }]
      },
      // 新闻管理
      newsmanage: {},
      // 流程学习
      studymanage: []
    };
  },
  created() {
    let _this = this;
    window["toPageProcess"] = processid => {
      _this.$router.push({
        path: "/processModelCenter/processIframeCenter",
        query: { attrid: processid }
      });
    };
  },
  mounted() {
    this.requiredData();
  },
  methods: {
    getFormateDate,
    requiredData() {
      Promise.all([
        getStudyList({
          attr: {},
          orderby: "createon",
          pageNum: 1,
          pageSize: 5,
          sort: "desc",
          logic: "or",
          filters: []
        }),
        getNoticeList({
          attr: {},
          filters: [],
          logic: "or",
          orderby: "createon",
          pageNum: 1,
          pageSize: 4,
          sort: "desc"
        })
      ]).then(res => {
        console.log(res);
        this.newsmanage = res[0].list[0];
        this.studymanage = res[1].list;
      });
    },
    handlerDateClick(v) {
      console.log(v);
      this.checkedDate = getFormateDate(new Date(v), "yyyy 年 MM 月 dd 日");
      this.checkedweek = weeks[new Date(v).getDay()];
      getEvents(v).then(res => {
        this.eventList = res;
      });
    },
    handlerSelectPersonComfirm(list) {
      this.form.participantname = list
        .map(item => {
          return item.cnname;
        })
        .toString();
    },
    newSche() {
      this.$refs.formRuleRef.validate(valid => {
        if (valid) {
          newSche(this.form).then(res => {
            if (res) {
              this.$message({
                type: "success",
                message: "新建日程成功！"
              });
              this.dialogVisible = false;
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#home {
  .tooltip-rotate {
    position: absolute;
    top: 83px;
    left: 65px;
    color: #fff;
    .bigLogo {
      font-size: 35px;
      font-weight: bold;
      letter-spacing: 3px;
      text-shadow: 0 5px 10px #2d2d2d;
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
  .notice_container {
    height: 135px;
    background-color: #3c93cc;
    padding: 0 65px;
    .notice_wrap {
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
            border-bottom: 1px solid #fff;
            a,
            .icon {
              font-size: 22px;
              color: #fff;
            }
          }
        }
        .title {
          font-size: 16px;
          line-height: 20px;
          font-family: "微软雅黑";
          font-weight: bold;
        }
        .content {
          font-size: 14px;
          line-height: 20px;
          margin-bottom: 10px;
          color: rgba(255, 255, 255, 0.8);
          margin: 5px 0 12px 0;
        }
        .date {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          position: absolute;
          bottom: 10px;
          left: 15px;
        }
      }
    }
  }
  .daily_task {
    background: #fff;
    padding: 0 60px 56px;
    h4 {
      font-size: 30px;
      font-weight: normal;
      text-align: center;
      padding: 75px 0 50px;
    }
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
    background: #f5f5f5;
    padding-bottom: 78px;
    h4 {
      margin: 0;
      padding: 64px 0 56px;
      font-size: 30px;
      font-weight: normal;
      text-align: center;
    }
    .img_wrap {
      max-width: 1000px;
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
    h4 {
      margin: 0;
      padding: 64px 0 56px;
      font-size: 30px;
      font-weight: normal;
      text-align: center;
    }
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
      padding: 64px 0 56px;
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
}
</style>
