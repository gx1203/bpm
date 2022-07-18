<template>
  <div class="overview">
    <div class="main" v-loading="loading">
      <div class="content m_r">
        <div class="conbox">
          <div class="title">
            <p class="left_t">
              <span class="tit">{{ $t("myPost") }}</span>
              <span class="num">({{ userdata.length + 1 }})</span>
            </p>
            <p class="right_t" @click="$router.push('/jobsCenter/myPost')">
              <span>{{ $t("toMore") }}</span>
              <i class="el-icon-arrow-right"></i>
            </p>
          </div>
          <div class="con">
            <div class="con_left">
              <img src="./img/logo.png" alt="" />
              <span class="zg">{{ mainuserdata.name }}</span>
              <span class="tag1">{{ $t("majorposition") }}</span>
            </div>
            <div class="con_right">
              <div
                v-if="userdata.length > 0"
                v-for="(item, index) in userdata.slice(0, 3)"
                :key="index"
                class="alignbox"
              >
                <i class="el-icon-user"></i>
                <span class="m">{{ item.name }}</span>
                <span class="tag">{{ $t("parttimejob") }}</span>
              </div>
              <!-- <div>
                <i class="el-icon-user"></i>
                <span class="m">人事关系专员</span>
                <span class="tag">兼岗</span>
              </div>
              <div>
                <i class="el-icon-user"></i>
                <span class="m">人事关系专员</span>
                <span class="tag">兼岗</span>
              </div> -->
            </div>
          </div>
        </div>
        <div class="conbox" style="height: 228px">
          <div class="title">
            <p class="left_t">
              <span class="tit">{{ $t("noticenotice") }}</span>
              <span class="num">({{ infodata.length }})</span>
            </p>
            <p class="right_t">
              <span>{{ $t("toMore") }}</span>
              <i class="el-icon-arrow-right"></i>
            </p>
          </div>
          <div v-if="infodata.length>0" class="t_con" v-for="(item, index) in infodata" :key="index + 1">
            <div class="t_con_left">
              <p>{{ item.titlename }}</p>
            </div>
            <div class="t_con_right">
              <p>{{ item.createon }}</p>
            </div>
          </div>
          <div class="t_con" v-if="infodata.length==0">
            <div class="imgbox">
              <img class="noimg" src="./img/no.png" alt="" />
              <p>暂时没有文档管理</p>
            </div>
          </div>
        </div>
        <div class="conbox" style="height: 228px">
          <div class="title">
            <p class="left_t">
              <span class="tit">{{ $t("latestdocuments") }}</span>
              <span class="num"></span>
            </p>
            <p class="right_t">
              <span>{{ $t("toMore") }}</span>
              <i class="el-icon-arrow-right"></i>
            </p>
          </div>
          <div class="t_con">
            <div class="imgbox">
              <img class="noimg" src="./img/no.png" alt="" />
              <p>暂时没有文档管理</p>
            </div>
          </div>
        </div>
      </div>
      <div class="content m_r">
        <div class="box">
          <dutyBox :data="dutydata"></dutyBox>
        </div>
        <div class="box">
          <dutyBox :data="kpidata"></dutyBox>
        </div>
      </div>
      <div class="content m_r">
        <div class="box">
          <dutyBox :data="lcdata"></dutyBox>
        </div>
        <div class="box">
          <dutyBox :data="fxdata"></dutyBox>
        </div>
      </div>
      <div class="content m_r">
        <div class="box">
          <dutyBox :data="zddata"></dutyBox>
        </div>
        <div class="box">
          <dutyBox :data="bzdata"></dutyBox>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getStationlists } from "@/bpa/api/jobsCenter";
import { findUserOrg, findUserMainOrg, querynotify } from "@/bpa/api/overView";
import { getTrainList } from "@/bpa/api/processModelCenter/trainRecords";
import { queryAllKpiInChain } from "@/bpa/api/processDesignCenter";
import { getRiskControlList } from "@/bpa/api/riskControlCenter/index.js";
import { getResponsibilitiesList } from "@/bpa/api/processModelCenter/rulesAndRegulations/responsibilities";
import { getBooksList } from "@/bpa/api/rulesCenter/handbookFiles";
import dutyBox from "./dutybox";
export default {
  components: {
    dutyBox,
  },
  data() {
    return {
      loading: false,
      bzdata: {
        title: this.$t("enterprisestandard"),
        num: "",
        list: "",
        prop: "foldertype",
        moreurl: "/enterpriseStandard/enterpriseManage",
      },
      zddata: {
        title: this.$t("mysystem"),
        num: "",
        list: "",
        prop: "title",
        click: true,
        moreurl: "/rulesCenter/ruleView",
        detailname: "rulesDetail",
      },
      fxdata: {
        title: this.$t("riskControlPoint"),
        num: "",
        list: "",
        prop: "kcpname",
        moreurl: "/riskControlCenter/matrix",
      },
      lcdata: {
        title: this.$t("myprocess"),
        num: "",
        list: "",
        prop: "name",
        click: true,
        moreurl: "/processModelCenter/processCommunity",
        detailname: "processDetails",
      },
      dutydata: {
        title: this.$t("myjobresponsibilities"),
        num: "",
        list: "",
        prop: "nodename",
        moreurl: "/jobsCenter/myPost",
      },
      kpidata: {
        title: this.$t("KPIIndex"),
        num: "",
        list: "",
        prop: "name",
        moreurl: "/performCenter/targetStore",
      },
      userdata: [],
      userid: "",
      mainuserdata: "",
      infodata: "",
    };
  },
  computed: {},
  mounted() {
    queryAllKpiInChain({
      pageNum: 1,
      pageSize: 10,
    }).then((res) => {
      this.kpidata.list = res.list;
      this.kpidata.num = res.total;
    });
    this.userid = JSON.parse(
      localStorage.getItem("portalCurrentUserInfo") || "{}"
    ).empuid;
    // this.getProcesslists();
    this.findUserMainOrg();
    this.Suk_querynotify();
    this.Suk_getprocessValue();
    this.getLC();
    this.getrisk();
    this.getResponsibilitiesList();
    this.getbook();
  },
  methods: {
    getbook() {
      this.loading = true;
      getBooksList({
        orderby: "createon",
        pageNum: 1,
        pageSize: 10,
        sort: "desc",
        filters: [
          {
            key: "title",
            opt: "LIKE",
            type: "S",
            value: "",
          },
          {
            key: "provideruser",
            opt: "LIKE",
            type: "S",
            value: "",
          },
          {
            key: "authorname",
            opt: "LIKE",
            type: "S",
            value: "",
          },
          {
            key: "status",
            opt: "LIKE",
            type: "S",
            value: "",
          },
          {
            key: "deptname",
            opt: "LIKE",
            type: "S",
            value: "",
          },
          {
            key: "effectivedate",
            opt: "BETWEEN",
            type: "D",
            value: "",
          },
        ],
        attr: {
          folderid: "9",
        },
      }).then((res) => {
        if (!res) return false;
        this.bzdata.list = res.list;
        this.bzdata.num = res.total;
      });
      this.$nextTick(() => {
        this.loading = false;
      });
    },
    getResponsibilitiesList() {
      let obj = {
        pageNum: 1,
        pageSize: 10,
        filters: [{}],
      };
      getResponsibilitiesList(obj).then((res) => {
        if (!res) return false;
        this.zddata.list = res.list;
        this.zddata.num = res.total;
      });
    },
    getrisk() {
      getRiskControlList({
        pagenum: 1,
        pagesize: 10,
      }).then((res) => {
        if (!res) return false;
        this.fxdata.list = res.list;
        this.fxdata.num = res.total;
      });
    },
    getLC() {
      let obj = {
        filters: [{ key: "modelid", value: "" }],
        orderby: "createon",
        sort: "desc",
        pageNum: 1,
        pageSize: 10,
      };
      getTrainList(obj, 1).then((res) => {
        if (!res) return false;
        this.lcdata.list = res.list;
        this.lcdata.num = res.total;
      });
    },
    Suk_getprocessValue() {},
    Suk_querynotify() {
      querynotify().then((res) => {
        if (!res) return false;
        this.infodata = res.list;
      });
    },
    findUserMainOrg() {
      findUserMainOrg(this.userid).then((res) => {
        if (!res) return false;
        this.mainuserdata = res;
        this.findUserOrg();
      });
    },
    findUserOrg() {
      let _this = this;
      findUserOrg(this.userid).then((res) => {
        if (!res) return false;
        console.log(this.mainuserdata);
        console.log(res);
        let arr = [];
        res.forEach((item, index) => {
          if (this.mainuserdata.id == item.id) {
            res.splice(index, 1);
          }
          arr.push(item.id)
        });
        console.log(arr,'arr')
        this.getProcesslists(arr)
        this.userdata = res;
      });
    },
    getProcesslists(item) {
      let str = "";
      item.forEach((item) => {
        str += item + ",";
      });
      getStationlists(str).then((res) => {
        if (!res) return false;
        this.dutydata.list = res;
        this.dutydata.num = res.length;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.overview {
  background: #f5f5f5;
  width: 100%;
}
.main {
  width: 95%;
  margin: 20px auto;
  display: flex;
  .m_r {
    margin-right: 20px;
  }
  .content {
    width: 25%;
  }
  .conbox {
    width: 100%;
    height: 207px;
    border-radius: 4px;
    background: #fff;
    margin-top: 20px;
    overflow: hidden;
    .t_con {
      display: flex;
      justify-content: space-between;
      padding: 6px 17px;
      .imgbox {
        width: 100%;
        text-align: center;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 17px;
        letter-spacing: 0px;
        color: #999999;
        .noimg {
          margin-top: 20px;
        }
      }

      .t_con_left {
        font-size: 14px;
        color: #333;
      }
      .t_con_right {
        font-size: 14px;
        color: #666666;
      }
    }
    .con {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 159px;
      .con_right {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        width: 315px;
        .alignbox {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .m {
          width: 85px;
          display: inline-block;
          font-size: 14px;
          margin: 0 10px;
          color: #333333;
          text-align: left;
          overflow: hidden; /*超出部分隐藏*/
          white-space: nowrap; /*不换行*/
          text-overflow: ellipsis; /*超出部分文字以...显示*/
        }
        .tag {
          font-size: 12px;
          letter-spacing: 0px;
          color: #298aff;
          padding: 2px 8px;
          background: #e5efff;
          border-radius: 10px;
        }
      }
      .con_left {
        width: 210px;
        min-width: 138px;
        display: flex;
        align-items: center;
        flex-direction: column;
        .tag1 {
          font-size: 12px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 17px;
          letter-spacing: 0px;
          color: #2d42af;
          padding: 2px 8px;
          border-radius: 10px;
          background: #e5eaff;
          margin-top: 5px;
        }
        .zg {
          width: 165px;
          margin-top: 5px;
          font-size: 14px;
          font-weight: 600;
          line-height: 17px;
          text-align: center;
          letter-spacing: 0px;
          color: #333333;
          overflow: hidden; /*超出部分隐藏*/
          white-space: nowrap; /*不换行*/
          text-overflow: ellipsis; /*超出部分文字以...显示*/
        }
        img {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          overflow: hidden;
        }
      }
      .con_right {
        border-left: 2px solid #f5f5f5;
        text-align: center;
        height: 100px;
        justify-content: space-around;
      }
    }
    .title {
      height: 47px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ebebeb;
      padding: 0 10px;

      .right_t {
        font-size: 12px;
        color: #999999;
        &:hover {
          color: #333;
          cursor: pointer;
        }
      }
      .left_t {
        font-weight: 600;
        &::before {
          content: "";
          border-left: 4px solid #2d42af;
        }
      }

      .tit {
        font-size: 15px;
        color: #333333;
        margin-left: 10px;
      }
    }
  }
}
</style>
