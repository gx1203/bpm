<template>
  <div id="home">
    <div class="leftNav">
      <el-scrollbar v-show="zoomState">
        <ul>
          <li
            v-for="(sub, index) in userMenu"
            :key="sub.id"
            @click="goTab(sub)"
            >
              <span><img :src="platformImg[index % 4]" alt=""></span>
              <p>{{ sub.name }}</p>
            </li>
        </ul>
      </el-scrollbar>
      <div class="zoomButton" :class="!zoomState ? 'float-box-bule' : ''" @click="getZoomState">
        <i :class="zoomState ? 'el-icon-caret-left' : 'el-icon-caret-right'" />
      </div>
    </div>
    <div class="homeContent">
      <div class="first">
        <first-section></first-section>
      </div>

      <div class="second">
        <el-row :gutter="20">
          <el-col :span="17">
            <latest-release></latest-release>
          </el-col>
          <el-col :span="7">
            <process-resources></process-resources>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import FirstSection from "./components/FirstSection";
import ProcessResources from "./components/ProcessResources";
import LatestRelease from "./components/LatestRelease";
import platform1 from '@/bpa/assets/img/home/design.png'
import platform2 from '@/bpa/assets/img/home/display.png'
import platform3 from '@/bpa/assets/img/home/handle.png'
import platform4 from '@/bpa/assets/img/home/analyse.png'
import { mapState, createNamespacedHelpers } from 'vuex'
const { mapMutations } = createNamespacedHelpers('app')
window.addEventListener('storage', function(e) {
  if (e.key === 'isReload' && e.newValue === 'true') {
    localStorage.setItem('isReload', false)
    window.location.reload();
  }
})
export default {
  components: {
    FirstSection,
    ProcessResources,
    LatestRelease
  },
  data() {
    return {
      platformImg: [platform1, platform2, platform3, platform4],
      zoomState: true
    };
  },
  computed: {
    ...mapState({
      userMenu: state => state.userInfo.userMenu.filter(item => item.url !== '/doorCenter')
    })
  },
  mounted() {
  },
  methods: {
    ...mapMutations(['setActiveIndex']),
    getZoomState() {
      this.zoomState = !this.zoomState
    },
    goTab(item) {
      console.log('ðitem', item)
      const firstChild = this.getFirstChild(item)
      console.log('ðfirstChild', firstChild)
      if (item.name === '流程中心' || item.name === '流程分析') {
        this.$router.push({ path: firstChild.url }).catch(e => e)
      } else if (
        item.name === '系统管理' ||
        item.name === '岗位职责' ||
        item.name === '规章制度'
      ) {
        this.$router.push({ name: firstChild.url }).catch(e => e)
      } else {
        if(firstChild.url) {
          this.$router.push({ path: firstChild.url }).catch(e => e)
        } else {
          this.$router.push({ name: firstChild.url }).catch(e => e)
        }
      }
      this.setActiveIndex(firstChild.name)
    },
    getFirstChild(item) {
      if(item.type === 'item') {
        return item
      } else {
        if (!item.subNodes || item.subNodes.length === 0) {
          return item
        }
        if (
          item.subNodes.length > 1 &&
          item.subNodes[0].url === '/bpmHome/businessAdminHome'
        ) {
          return this.getFirstChild(item.subNodes[1])
        }
        return this.getFirstChild(item.subNodes[0])
      }

    }
  }
};
</script>

<style lang="scss" scoped>
#home {
  background-color: #F1F5F8;
  width: 100%;
  height: calc(100vh - 66px);
  box-sizing: border-box;
  .leftNav {
    float: left;
    height: 100%;
    text-align: center;
    background-color: #ffffff;
    border-right: 1px solid #E8EEFA;
    position: relative;
    .zoomButton {
      position: absolute;
      top: 50%;
      right: -14px;
      z-index: 10;
      width: 12px;
      padding: 12px 0;
      margin-top: -20px;
      text-align: center;
      border-radius: 0px 4px 4px 0px;
      border: 1px solid #E8EEFA;
      border-left: none;
      background: #fff;
      cursor: pointer;
    }
    .el-scrollbar {
      height: 100%;
      width: 160px;
    }
    /deep/ .el-scrollbar__wrap {
      overflow: auto;
    }
    ul {
      li {
        margin: 24px 0;
        cursor: pointer;
        img {
          width: 50px;
        }
        p {
          font-size: 14px;
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  .homeContent {
    height: 100%;
    padding: 16px;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
  }

  /deep/ .card-padding0 {
    .el-card__body {
      padding: 0;
    }
  }

  /deep/ .el-card {
    margin-bottom: 16px;
    border: 1px solid #E8EEFA !important;
    border-radius: 8px;
    /deep/ .el-card__body {
      padding: 24px 16px;
    }
  }

  /deep/ .card-header {
    height: 50px;
    line-height: 50px;
    padding: 0 14px;
    position: relative;
    border-bottom: 1px solid #EBEBF4;
    display: flex;
    justify-content: space-between;
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      height: 20px;
      width: 4px;
      margin-top: -10px;
      background-color: $active-color;
    }

    div.title {
      display: inline-block;
      b {
        font-size: 14px;
      }
    }
  }

  /deep/ .more {
    color: #8A8C99;
    cursor: pointer;
  }

  .first {
    width: 100%;
    display: flex;

    .left {
      width: 70%;
    }

    .right {
      margin-left: 15px;
      width: 30%;
    }
  }
}
</style>
