<template>
  <div id="pandect">
    <div class="padding10px h100 pad-t15px">
      <el-scrollbar class="h100">
        <el-row style="width: 97%;margin: 0 10px 10px 10px;">
          <div class="title-header">{{$t('jobInformation')}}</div>
          <el-col :span="24" class="title-box" style="min-height:236px">
            <el-row style="padding: 18px;">
              <el-col :span="24">
                <div class="border color-b-b" />
                <div class="title color-b-f">{{$t('myPost')}}</div>
                <div class="word" >
                  （{{this.$t("total")}}<span class="color-b-f"> {{ stationName.length }} </span>{{this.$t("share")}}）
                  <span v-if="stationName.length > 3" class="more" @click="getMore(1)">{{ levelIW }}</span>
                </div>
              </el-col>
              <el-col :span="24" class="title-box-bottom">
                <el-row :gutter="24">
                  <el-col v-for="(item, index) in stationName" :span="8" :key="index" v-if="index < levelI"
                    style="height:24px;margin-bottom:10px;display: flex">
                    <div class="radius color-b-b" />
                    <div :title="item.name" class="title text_overflow_1" style="font-size:13px;cursor:text">
                      {{ item.name }}
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row style="padding: 18px;">
              <el-col :span="24">
                <div class="border color-b-b" />
                <div class="title color-b-f">{{$t('relatedProcesses')}}</div>
                <div class="word">
                  （{{this.$t("total")}}<span class="color-b-f"> {{ relatelists.length }} </span>{{this.$t("share")}}）
                  <span v-if="relatelists.length > 3" class="more" @click="getMore(2)">{{ levelIIW }}</span>
                </div>
              </el-col>
              <el-col :span="24" class="title-box-bottom">
                <el-row :gutter="24">
                  <el-col v-for="(item, index) in relatelists" :span="8" :key="index" v-if="index < levelII"
                    style="height:24px;margin-bottom:10px;display: flex">
                    <div class="radius color-b-b" />
                    <div :title="item.listname" class="title text_overflow_1" @click="Suk_tosq(item)" style="font-size:13px">
                      {{ item.listname }}
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row style="padding: 18px;">
              <el-col :span="24">
                <div class="border color-b-b" />
                <div class="title color-b-f">{{$t('responsible')}}</div>
                <div class="word">
                  （{{this.$t("total")}}<span class="color-b-f"> {{ owners.length }} </span>{{this.$t("share")}}）
                  <span v-if="owners.length > 3" class="more" @click="getMore(3)">{{ levelIIIW }}</span>
                </div>
              </el-col>
              <el-col :span="24" class="title-box-bottom">
                <el-row :gutter="24">
                  <el-col v-for="(item, index) in owners" :span="8" :key="index" v-if="index < levelIII"
                    style="height:24px;margin-bottom:10px;display: flex">
                    <div class="radius color-b-b" />
                    <div :title="item.name" class="title text_overflow_1" @click="Suk_tosq(item)" style="font-size:13px;cursor: pointer;">
                      {{ item.listname }}
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row style="padding: 18px;">
              <el-col :span="24">
                <div class="border color-b-b" />
                <div class="title color-b-f">{{$t('approver')}}</div>
                <div class="word">
                  （{{this.$t("total")}}<span class="color-b-f"> {{ appovers.length }} </span>{{this.$t("share")}}）
                  <span v-if="appovers.length > 3" class="more" @click="getMore(4)">{{ levelIVW }}</span>
                </div>
              </el-col>
              <el-col :span="24" class="title-box-bottom">
                <el-row :gutter="24">
                  <el-col v-for="(item, index) in appovers" :span="8" :key="index" v-if="index < levelIV"
                    style="height:24px;margin-bottom:10px;display: flex">
                    <div class="radius color-b-b" />
                    <div :title="item.name" class="title text_overflow_1" @click="Suk_tosq(item)" style="font-size:13px;cursor: pointer;">
                      {{ item.nodename }} - {{ item.listname }}
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row style="padding: 18px;">
              <el-col :span="24">
                <div class="border color-b-b" />
                <div class="title color-b-f">{{$t('onlyThose')}}</div>
                <div class="word">
                  （{{this.$t("total")}}<span class="color-b-f"> {{ notiers.length }} </span>{{this.$t("share")}}）
                  <span v-if="notiers.length > 3" class="more" @click="getMore(5)">{{ relativeW }}</span>
                </div>
              </el-col>
              <el-col :span="24" class="title-box-bottom">
                <el-row :gutter="24">
                  <el-col v-for="(item, index) in notiers" :span="8" :key="index" v-if="index < relative"
                    style="height:24px;margin-bottom:10px;display: flex">
                    <div class="radius color-b-b" />
                    <div :title="item.name" class="title text_overflow_1" style="font-size:13px;cursor: pointer;">
                      {{ item.nodename }} - {{ item.listname }}
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
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
} from '@/bpa/api/jobsCenter'
export default {
  name: 'Pandect',
  data () {
    return {
      stationName: [],
      relatelists: [],
      owners: [],
      appovers: [],
      askers: [],
      notiers: [],
      levelI: 3,
      levelII: 3,
      levelIII: 3,
      levelIV: 3,
      relative: 3,
      levelIW: this.$t("unfold"),
      levelIIW: this.$t("unfold"),
      levelIIIW: this.$t("unfold"),
      levelIVW: this.$t("unfold"),
      relativeW: this.$t("unfold"),
    }
  },
  computed: {
    userid () {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .empuid
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    Suk_tosq(val){
      if(val.listid){
        this.$router.push({
          path:'/processDetails/'+val.listid
        })
      }else{
        this.$message({
          message:'查找不到',
          type:'info'
        })
      }

    },
    // 查看更多
    getMore (num) {
      if (num === 1) {
        if (this.levelI === 3) {
          this.levelI = 999;
          this.levelIW = this.$t("putAway");
        } else {
          this.levelI = 3;
          this.levelIW = this.$t("unfold");
        }
      }
      if (num === 2) {
        if (this.levelII === 3) {
          this.levelII = 999;
          this.levelIIW = this.$t("putAway");
        } else {
          this.levelII = 3;
          this.levelIIW = this.$t("unfold");
        }
      }
      if (num === 3) {
        if (this.levelIII === 3) {
          this.levelIII = 999;
          this.levelIIIW = this.$t("putAway");
        } else {
          this.levelIII = 3;
          this.levelIIIW = this.$t("unfold");
        }
      }
      if (num === 4) {
        if (this.levelIV === 3) {
          this.levelIV = 999;
          this.levelIVW = this.$t("putAway");
        } else {
          this.levelIV = 3;
          this.levelIVW = this.$t("unfold");
        }
      }
      if (num === 5) {
        if (this.relative === 3) {
          this.relative = 999;
          this.relativeW = this.$t("putAway");
        } else {
          this.relative = 3;
          this.relativeW = this.$t("unfold");
        }
      }
    },
    getData () {
      getstation(this.userid).then(res => {
        if (!res) return false
        this.stationName = res
        const params = res.map(item => {
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
}
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
  .title-header {
    min-width: 111px;
    height: 38px;
    background: #b7bfea;
    border-radius: 10px 10px 0px 0px;
    // font-weight: bold;
    color: #2d42af;
    font-size: 15px;
    text-align: center;
    line-height: 42px;
    float: left;
    padding: 0px 8px;
  }
  .title-box {
    min-height: 136px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 8px 0px rgba(196, 204, 213, 1);
    border-radius: 0px 10px 10px 10px;
    .border {
      width: 4px;
      height: 24px;
      border-radius: 2px;
      float: left;
      margin-top: 3px;
    }
    .title {
      font-size: 14px;
      float: left;
      margin-left: 20px;
      line-height:30px
    }
    .word {
      font-size: 14px;
      line-height: 30px;
    }
    .more {
      text-decoration: underline;
      color: rgba(45, 65, 175, 1);
      float: right;
      cursor: pointer;
    }
    .color-l-b {
      background: rgba(27, 197, 199, 1);
    }
    .color-b-b {
      background: rgba(45, 65, 175, 1);
    }
    .color-sb-b {
      background: rgba(91, 111, 209, 1);
    }
    .color-l-f {
      color: rgba(27, 197, 199, 1);
    }
    .color-b-f {
      color: rgba(45, 65, 175, 1);
    }
    .color-sb-f {
      color: rgba(91, 111, 209, 1);
    }
    .title-box-bottom {
      border-bottom: 1px solid rgba(237, 237, 237, 1);
      padding: 10px 20px;
      .radius {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        float: left;
        margin-top: 7px;
      }
      .title {
        font-size: 14px;
        text-decoration: underline;
        color: rgba(135, 135, 135, 1);
        float: left;
        margin-left: 12px;
        cursor:pointer;
      }
    }
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
