<template>
  <div class="bpmHome" v-loading="loading">
    <el-row :gutter="16">
      <el-col :span="17">
        <el-row :gutter="16">
          <el-col :span="7">
            <el-card shadow="never" class="form-card">
              <div class="postInfo clear-fix">
                <div class="picture">
                  <Avatar></Avatar>
                </div>
                <div class="examine">
                  <div class="title">
                    {{ username }}
                  </div>
                  <div class="circular">
                    <span class="margin-r10">{{ mainuserdata.name }}</span>
                    <span class="tag1">{{ $t("majorposition") }}</span>
                    <span class="morePost" @click="goPost">更多岗位</span>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="17">
            <el-card shadow="never" class="form-card">
              <el-row class="statistics-card">
                <el-col :span="6">
                  <div class="picture">
                    <img :src="require(`@/bpa/assets/img/home/approve.png`)">
                  </div>
                  <div class="examine" @click="goApproveList">
                    <div class="title" :title="$t('TasksOk')">{{ $t("TasksOk") }}</div>
                    <div class="circular">
                      <b>{{ content.total }}</b>
                    </div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="picture">
                    <img :src="require(`@/bpa/assets/img/home/overtime.png`)">
                  </div>
                  <div class="examine" @click="goApproveList">
                    <div class="title" title="已超时">已超时</div>
                    <div class="circular">
                      <b>{{ timeOutData }}</b>
                    </div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="picture">
                    <img :src="require(`@/bpa/assets/img/home/apply.png`)">
                  </div>
                  <div class="examine" @click="goApply">
                    <div class="title" title="未完成申请">未完成申请</div>
                    <div class="circular">
                      <b>{{ applicationList.total }}</b>
                    </div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="picture">
                    <img :src="require(`@/bpa/assets/img/home/collection.png`)">
                  </div>
                  <div class="examine" @click="goCollection">
                    <div class="title" :title="$t('MyFavorite')">{{ $t("MyFavorite") }}</div>
                    <div class="circular">
                      <b>{{ collectList.total }}</b>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
        <!-- 审批待办 -->
        <el-card shadow="never" class="card-padding0 form-card approve-card">
          <approve-todo></approve-todo>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card shadow="never" class="card-padding0 form-card nav-card">
          <div class="card-header">
            <div class="title">
              <b>应用中心</b>
            </div>
            <div class="more" @click="handlerMoreNavigation">
              {{ $t("toViewMore") }}<i class="el-icon-arrow-right" />
            </div>
          </div>
          <el-carousel
            trigger="click"
            height="240px"
            indicator-position="none"
            :autoplay="false"
          >
            <el-carousel-item
              v-for="(ShortcutIcons, index) in ShortcutIconsList"
              :key="index"
            >
              <div class="application-content">
                <div
                  class="block"
                  v-for="item in ShortcutIcons"
                  :key="item.id"
                  :title="item.applistname"
                  @click="navigationLink(item)"
                >
                  <template>
                    <el-image
                      :key="item.appnewimgUrl"
                      :src="item.appnewimgUrl"
                    ></el-image>
                    <div class="title">{{ item.applistname }}</div>
                  </template>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </el-card>
        <el-card shadow="never" class="card-padding0 form-card">
          <apply-create></apply-create>
        </el-card>
      </el-col>
    </el-row>
    <!-- 点击更多 -->
    <el-dialog
      v-show="moreNavigation"
      :title="$t('ApplicationOfTheNavigation')"
      :visible.sync="moreNavigation"
      class="application-dialog"
    >
      <div class="application-content">
        <div
          class="block"
          v-for="item in navigationAllList"
          :key="item.id"
          :title="item.applistname"
          @click="navigationLink(item)"
        >
          <template>
            <el-image
              :key="item.appnewimgUrl"
              :src="item.appnewimgUrl"
              lazy
            ></el-image>
            <!--            <el-avatar shape="square" :size="70" fit="fill" :src="item.appnewimgUrl"/>-->
            <div class="title">{{ item.applistname }}</div>
          </template>
        </div>
      </div>
    </el-dialog>
    <InstanceImageDialog v-model="dialogVisible" :instance-id="instanceId" />
  </div>
</template>

<script>

// 数据初始化
import { findUserMainOrg } from "@/bpa/api/overView";
import {
  queryTodo,
  quickQueryCollection,
  queryCopy,
  queryTimeOutCount
} from "@/bpm/api/bpmHome";
import { quickQueryProcessTraceList } from "@/bpm/api/staging/personal/process_trace";
import { quickQueryApplyList } from "@/bpm/api/staging/personal/apply";
import { getDate } from "@/bpm/utils/utils";

// 引入头像
import Avatar from "@/bpa/views/doorCenter/components/Avatar";
// 引入审批待办组件
import ApproveTodo from './components/ApproveTodo'
import InstanceImageDialog from "@/bpm/components/instanceimage/InstanceImageDialog";
import ApplyCreate from "@/bpa/views/doorCenter/components/ApplyCreate";
import { mapState } from 'vuex'

window.addEventListener("storage", function(e) {
  if (e.key === "isReload" && e.newValue === "true") {
    window.getData();
  }
});
export default {
  components: {
    InstanceImageDialog,
    ApplyCreate,
    Avatar,
    ApproveTodo
  },
  data() {
    return {

      moreNavigation: false,
      // 导航应用
      navigationList: [],
      navigationAllList: [],
      // 我的收藏
      collectList: {},
      // 我的未完成申请
      applicationList: {},
      // 近一个月内审批总数
      audit: {},
      timeOutData: '',
      content: {
        total: 0,
        list: []
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 8,
        total: 0
      },
      dialogVisible: false,
      instanceId: "",
      loading: false,
      userid: "",
      mainuserdata: {}
    };
  },
  computed: {
    ShortcutIconsList() {
      let size = 6;
      let arrs = [];
      if (this.navigationList.length) {
        for (let i = 0; i < this.navigationList.length; i++) {
          if (arrs.length === 0 || arrs[arrs.length - 1].length === size) {
            arrs.push([]);
          }
          arrs[arrs.length - 1].push(this.navigationList[i]);
        }
      }
      return arrs;
    },
    ...mapState({
      username: state => state.basuser.user.displayname
    })
  },
  watch: {},
  created() {
    this.userid = JSON.parse(
      localStorage.getItem("portalCurrentUserInfo") || "{}"
    ).empuid;
    this.findUserMainOrg();
  },
  mounted() {
    window.getData = this.getData;
    this.getData()
    this.quickQueryProcessTraceList();
    this.quickQueryApplyList();
    this.quickQueryCollection();
    this.queryNavigation(100000);
    this.queryTimeOutCount();
  },
  methods: {
    goProcessTrace() {
      // this.$router.push({
      //   name: 'stagingPersonalProcessTrace',
      //   params: {
      //     searchDate: getDate('month', -2)
      //   }
      // })'
      const date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth();
      let day = date.getDate();
      console.log(year, month, day);

      const start = new Date(year, month - 1, day + 1);
      let startYear = start.getFullYear();
      let startMonth = start.getMonth();
      let startDay = start.getDate();
      console.log(startYear, startMonth, startDay);

      const queryDate = `${startYear}-${(startMonth + 1)
        .toString()
        .padStart(2, "0")}-${startDay
        .toString()
        .padStart(2, "0")} 00:00:00~${year}-${(month + 1)
        .toString()
        .padStart(2, "0")}-${day.toString().padStart(2, "0")} 23:59:59`;
      console.log(queryDate);

      this.$router.push({
        path: "/staging/personal/apply",
        params: {
          active: "processMenu",
          filters: [
            {
              key: "reqDate",
              opt: "BETWEEN",
              type: "D",
              value: queryDate
            }
          ]
        }
      });
    },

    //跳转到我的岗位
    goPost() {
      this.$router.push({ path: "/managementElements/jobsCenter/myPost" });
    },

    // 我的未完成跳转到 我的申请
    goApply() {
      this.$router.push({
        path: "/staging/personal/apply",
        params: {
          active: "application",
          filters: [
            {
              key: "status", //状态字段
              opt: "EQ", //等于
              type: "S",
              value: "审批中"
            }
          ]
        }
      });
    },
    // 我的收藏 跳转我的收藏
    goCollection() {
      this.$router.push("/staging/personal/collection");
    },
    // 我的代办跳转到进一月内 审批
    goApproveList() {
      this.$router.push("/staging/personal/approveList");
    },
    // 待办列表数据
    getData() {
      this.loading = true;
      queryTodo({
        logic: "and",
        attr: {
          platform: "PC"
        },
        ...this.pageInfo
      })
        .then(rt => {
          if (rt.status === "200") {
            this.content = rt.data;
            this.pageInfo.total = rt.data.total;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    findUserMainOrg() {
      findUserMainOrg(this.userid).then(res => {
        if (!res) return false;
        this.mainuserdata = res;
      });
    },
    queryTimeOutCount() {
      queryTimeOutCount(this.$store.state.basuser.user.id).then(res => {
        console.log(res)
        if (res.status === "200") {
          this.timeOutData = res.data;
        }
      })
      .catch(() => {
      });
    },
    // 近一个月内审批总数
    quickQueryProcessTraceList() {
      quickQueryProcessTraceList({
        filters: [],
        logic: "or",
        searchData: "",
        searchDate: getDate("month", -2),
        pageNum: 1,
        pageSize: 1,
        queryFilter: []
      })
        .then(rt => {
          if (rt.status === "200") {
            this.audit = rt.data;
          }
        })
        .catch(() => {
        });
    },

    // 我的未完成
    quickQueryApplyList() {
      quickQueryApplyList({
        logic: "and",
        filters: [
          {
            key: "status",
            opt: "EQ",
            type: "S",
            value: "审批中"
          }
        ],
        pageNum: 1,
        pageSize: 1
      })
        .then(rt => {
          if (rt.status === "200") {
            this.applicationList = rt.data;
          }
        })
        .catch(() => {
        });
    },
    // 我的收藏
    quickQueryCollection() {
      const queryParams = {
        logic:"and",
        filters:[],
        pageNum:1,
        pageSize:1000000,
       }
      quickQueryCollection(queryParams).then(res => {
        if (res.status === "200") {
          this.collectList = res.data;
        }
      }).catch(() => {
      });
    },
    handlerMoreNavigation() {
      this.moreNavigation = true;
      this.queryNavigation(100000);
    },
    // 导航应用
    queryNavigation(pageSize) {
      queryCopy({
        pageSize: pageSize,
        filters: [
          {
            key: "isdelete",
            opt: "EQ",
            type: "S",
            value: "0"
          },
          {
            key: "applistscenarios",
            opt: "LIKE",
            type: "S",
            value: "app"
          }
        ]
      })
        .then(rt => {
          if (rt.status === "200" && rt.data && rt.data.list.length > 0) {
            rt.data.list.forEach(item => {
              this.$set(
                item,
                "appnewimgUrl",
                `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/bpm/attachment/download/${item.appnewimg}?attachmentType=bpm`
              );
            });
            this.navigationAllList = rt.data.list;
            this.navigationList = rt.data.list;
          }
        })
        .catch(() => {
        });
    },
    navigationLink(item) {
      window.open(item.applisturl, "_blank");
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-carousel__arrow--right {
  right: 0;
  color: #fff;
  background-color: #a8a8a8;
}

/deep/ .el-carousel__arrow--left {
  left: 0;
  color: #fff;
  background-color: #a8a8a8;
}

.tag1 {
  font-size: 10px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 17px;
  letter-spacing: 0px;
  color: #2d42af !important;
  padding: 2px 8px;
  border-radius: 10px;
  background: #e5eaff;
}

.bpmHome {
  width: 100%;
}

.form-card {

  .postInfo, .statistics-card {
    height: 68px;
  }

  .picture {
    float: left;
    width: 68px;
    height: 68px;
    display: flex;
    align-items: center;
    img {
      width: 100%;
    }
  }
  .examine {
    float: left;
    width: calc(100% - 68px);
    margin-top: 12px;
    padding-left: 10px;
    box-sizing: border-box;
    .title {
      font-size: 15px;
      margin-bottom: 5px;
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .circular {
      position: relative;
      color: #151934;
      font-size: 12px;
    }
    .morePost {
      position: absolute;
      right: 0;
      top: -48px;
      height: 16px;
      line-height: 16px;
      padding: 0 8px;
      font-size: 12px;
      color: #ffffff;
      background: #F28C27;
      border-radius: 8px;
      cursor: pointer;
    }
  }
}
.statistics-card {

  .picture {
    float: left;
    width: 40px;
  }

  .examine {
    width: calc(100% - 50px);
    padding-left: 16px;
    margin-top: 5px;
    cursor: pointer;

    .title {
      margin-bottom: 8px;
      font-weight: 700;
      font-size: 13px;
    }

    .circular {
      font-size: 30px;
    }
  }
}
.approve-card {
  height: 505px;
}

.application-content {
  margin-top: 16px;
  overflow: hidden;

  .block {
    float: left;
    width: 33.33333%;
    padding: 0 5px;
    margin-bottom: 10px;
    text-align: center;
    box-sizing: border-box;
    cursor: pointer;

    .el-image {
      display: inline-block;
      width: 70px;
      height: 70px;
    }

    .title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 13px;
      line-height: 24px;
      height: 24px;
    }
  }
}

.application-dialog {
  /deep/ .el-dialog {
    width: 770px;

    .el-dialog__body {
      max-height: 70vh;

      .application-content {
        width: 720px;
        margin: 0 auto;

        .block {
          width: 90px;
          padding: 0 10px;
        }
      }
    }
  }
}
</style>
