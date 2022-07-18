<template>
  <div id="pandect">
    <div class="padding10px h100 pad-t15px">
      <el-scrollbar class="h100">
        <div class="common">
          <div class="title">
            <h5>我的岗位</h5>
          </div>
          <ul class="content">
            <li v-for="item in stationName" :key="item.id">{{item.name}}</li>
          </ul>
        </div>
        <div class="common">
          <div class="title">
            <h5>相关流程</h5>
          </div>
          <ul class="content">
            <li v-for="item in relatelists" :key="item.id">{{item.listname}}</li>
          </ul>
        </div>
        <div class="common">
          <div class="title">
            <h5>责任者</h5>
          </div>
          <ul class="content">
            <li v-for="item in owners" :key="item.id">
              {{item.nodename}}
              <br />
              {{item.listname}}
            </li>
          </ul>
        </div>
        <div class="common">
          <div class="title">
            <h5>审批者</h5>
          </div>
          <ul class="content">
            <li v-for="item in appovers" :key="item.id">
              {{item.nodename}}
              <br />
              {{item.listname}}
            </li>
          </ul>
        </div>
        <!-- <div class="common">
                <div class="title">
                    <h5>咨询者</h5>
                </div>
                <ul class="content">
                    <li v-for="item in askers" :key="item.id">{{item.nodename}}<br/>{{item.listname}}</li>
                </ul>
        </div>-->
        <div class="common">
          <div class="title">
            <h5>知会者</h5>
          </div>
          <ul class="content">
            <li v-for="item in notiers" :key="item.id">
              {{item.nodename}}
              <br />
              {{item.listname}}
            </li>
          </ul>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import {
  getstation,
  getRelative,
  getOwners,
  getAppovers,
  getNotiers
} from "@/bpa/api/jobsCenter";
export default {
  name: "pandect",
  data() {
    return {
      stationName: [],
      relatelists: [],
      owners: [],
      appovers: [],
      askers: [],
      notiers: []
    };
  },
  computed: {
    userid() {
      return JSON.parse(localStorage.getItem("portalCurrentUserInfo") || "{}")
        .name;
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      getstation(this.userid).then(res => {
        if (!res) return false
        this.stationName = res
        let params = res.map(item => {
          return item.id
        }).join(',')
        this.$emit('confirm', params)
        return Promise.all([
          getRelative(params),
          getOwners(params),
          getAppovers(params),
          getNotiers(params)
        ])
      }).then(res => {
        if (!res) return false
        this.relatelists = res[0]
        this.owners = res[1]
        this.appovers = res[2]
        this.notiers = res[3]
      }).catch(err => {
        console.log(err)
      })
    }
  }
};
</script>

<style scoped lang="scss">
* {
  box-sizing: border-box;
}
#pandect {
  height: calc(100vh - 200px);
  /deep/ .el-scrollbar__wrap {
    padding: 0 !important;
  }
  .common {
    line-height: 32px;
    margin-bottom: 25px;
    .title {
      border-bottom: 1px solid #ddd;
    }
    h5 {
      font-weight: 500;
      display: inline-block;
      vertical-align: top;
      border-bottom: 1px solid #308ae6;
      position: relative;
      bottom: -1px;
    }
    .content {
      li {
        display: inline-block;
        vertical-align: bottom;
        width: 30%;
        min-height: 30px;
        line-height: 30px;
        margin-right: 10px;
        word-break: break-all;
        padding: 5px 0;
        border-bottom: 1px dashed #ddd;
      }
    }
  }
}
</style>
