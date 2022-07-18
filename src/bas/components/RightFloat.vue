<template>
  <div class="float-box">
    <div class="float-box-left" :class="!zoomState ? 'float-box-bule' : ''" @click="getZoomState">
      <i :class="zoomState ? 'el-icon-caret-right left-but' : 'el-icon-caret-left left-but'" />
    </div>
    <div v-if="zoomState" class="float-box-right">
      <div v-for="item in butList" :key="item.url" class="right-but" @click.stop="pageSwitch(item.url)">
        <img :src="item.imgUrl">
        <div class="but-word">
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import processDesign from '@/assets/img/common/processDesign.png'
import processStart from '@/assets/img/common/processStart.png'
import processApprove from '@/assets/img/common/processApprove.png'
export default {
  name: 'RightFloat',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      butList: [
        {
          name: '流程设计',
          url: '/doorCenter/TheProcessIsv?theProcessIs=true',
          imgUrl: processDesign
        },
        {
          name: '流程审批',
          url: '/staging/personal/approveList',
          imgUrl: processApprove
        },
        {
          name: '流程发起',
          url: '/staging/personal/applyCreate',
          imgUrl: processStart
        }
      ],
      zoomState: true
    }
  },
  computed: {
  },
  watch: {
    // zoomState: {
    //   handler (val) {
    //     if (val) {
    //       setTimeout(() => {
    //         this.zoomState = false
    //       }, 10000)
    //     }
    //   },
    //   immediate: true
    // }
  },
  mounted() {
  },
  methods: {
    // 组件收缩状态切换事件
    getZoomState() {
      this.zoomState = !this.zoomState
    },
    // 页面跳转
    pageSwitch(url) {
      const { href } = this.$router.resolve({
        path: url
      })
      window.open(href, '_blank')
    }
  }
}
</script>
<style lang="scss">

  .float-box{
    position: fixed;
    right: 0;
    top: 52%;
    z-index: 2001;
    height: 251px;
    .float-box-left{
      position: absolute;
      top: 100px;
      left: -19px;
      width: 18px;
      color: #ffffff;
      background: #9e9797;
      border-radius: 4px 0px 0px 4px;
      cursor: pointer;
      .left-but {
        padding: 19px 0;
        text-align: center;
        width: 100%;
      }
    }
    .float-box-bule{
      background: #2d42af;
      color: #fff;
    }
    .float-box-right {
      width: 46px;
      padding: 6px 0;
      color: #151934;
      box-shadow: 0px 0px 9px 1px rgba(0, 0, 0, 0.2);
      background: #FFFFFF;
      float: left;
      .right-but {
        position: relative;
        margin: 0 auto;
        padding: 6px 10px;
        text-align: center;
        cursor: pointer;
        font-size: 12px;
        .but-word {
          line-height: 16px;
          margin-top: -6px;
        }
        .but-icon {
          font-size: 24px;
        }
        img {
          width: 32px;
        }
        &::after {
          content: "";
          position: absolute;
          left: 10px;
          bottom: 0;
          width: calc(100% - 20px);
          height: 1px;
          background: #ffffff;
          transform: scale(1, .5);
        }
        &:last-child {
          &::after {
            display: none;
          }
        }
      }
    }
  }
</style>

