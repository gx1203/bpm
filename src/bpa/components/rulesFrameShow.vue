<template>
  <div id="frameShow" ref="frameShowHead">
    <div ref="frameShow" class="w100 trans-origin">
      <div class="box-header">
        <div class="box-header-box">
          <div v-for="item in systemList.strategy" :key="item.id" class="box-header-wrod" @click="nodeClick(item)">
            <span class="bottom-border">{{ item.foldername }}</span>
          </div>
        </div>
      </div>
      <div class="box-middle">
        <el-row style="margin-left:52px;">
          <el-col v-for="(item, index) in systemList.main" :key="item.id" :span="5" :offset="systemList.main.length === 3 ? (index % 4 === 0 ? 3 : 1) : systemList.main.length === 4 ? (index % 4 === 0 ? 0 : 1) : 0">
            <div class="box-middle-box" @click="nodeClick(item)">
              <span class="bottom-border" :title="item.foldername">{{ item.foldername }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="box-bottom">
        <el-row>
          <el-col v-for="(item, index) in systemList.support" :key="item.id" :span="4" :offset="index % 5 === 0 ? 0 : 1" class="box-bottom-box">
            <div style="height:100%">
              <div :title="item.foldername" class="box-bottom-box-top" @click="nodeClick(item)"><span class="bottom-border">{{ item.foldername }}</span></div>
              <div class="box-bottom-box-bottom">
                <el-row>
                  <el-col :span="12">
                    <el-row>
                      <el-col :span="24" class="margin-10 box-bottom-box-bottom-num">{{ item.ruleCounts }}</el-col>
                      <el-col :span="24" class="">制度数量</el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="12">
                    <el-row>
                      <el-col :span="24" class="margin-10 box-bottom-box-bottom-num">{{ item.processCounts }}</el-col>
                      <el-col :span="24" class="">{{$t('AssociatedProcess')}}</el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { getRegulationTreeId, queryRegulationFolderTreeId } from '@/bpa/api/doorCenter'
export default {
  name: 'FrameShow',
  props: {
    id: {
      type: String,
      default: '1'
    },
    clickable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      data: {
        strategy: [{ code: '', name: '', ename: '' }]
      },
      bgstyle: {},
      rack: {
        support: 0,
        main: 7
      },
      // yewuList: [],
      // guanliList: [],
      systemList: {
        main: [
        ]
      },
      chooseId: '5'
    }
  },
  watch: {
    id(newValue, oldValue) {
      console.log(newValue)
    }
  },
  mounted() {
    // this.getRegulationTreeId()
    this.queryRegulationFolderTreeId()
  },
  methods: {
    queryRegulationFolderTreeId() {
      queryRegulationFolderTreeId().then((res) => {
        if (!res) return false
        console.log(res)
        this.chooseId = res
        if (this.chooseId) {
          this.getRegulationTreeId()
        }
      })
    },
    getRegulationTreeId() {
      getRegulationTreeId(this.chooseId).then((res) => {
        this.systemList = res
        this.systemList.strategy = res.main.slice(0,1) || []
      })
    },
    // 制度框架跳转页面
    nodeClick(item) {
      if (this.clickable) {
        this.$emit('treeclick', item)
        return false
      }
      const routes = this.$router.resolve({
        path: '/doorCenter/rulesShow',
        query: { attrid: item.id }
      })
      window.open(routes.href, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
#frameShow {
  width: 1200px;
  margin-bottom: 20px;
  .trans-origin {
    transform-origin: left top;
    .bottom-border{
      border-bottom: 1px solid #fff
    }
    .margin-10{
      margin-top:12px
    }
    .margin-8{
      margin-top:4px
    }
    .box-header {
      width: 0;
      height: 0;
      border-left: 600px solid transparent;
      border-right: 600px solid transparent;
      border-bottom: 155px solid rgba(45,66,175,0.5);
      margin: 0 auto;
      position: relative;
      .box-header-box{
        width: 640px;
        height: 48px;
        position: relative;
        top: 64px;
        left: -320px;
      }
      .box-header-wrod {
        width: 268px;
        height: 60px;
        cursor: pointer;
        // float: left;
        background: #f27611;
        margin: 0 auto;
        color: #fff;
        line-height: 54px;
        text-align: center;
        border: 2px solid #fff;
        border-radius: 10px;
        font-size:24px;
      }
    }
    .box-middle{
      width: 1200px;
      // min-height: 128px;
      margin: 0 auto;
      background: rgba(45,66,175,0.35);
      margin-top: 2px;
      padding: 36px 0px 12px;
      .box-middle-box{
        cursor: pointer;
        background: #1bc5c7;
        height: 60px;
        font-size:24px;
        color: #fff;
        line-height: 52px;
        text-align: center;
        border: 2px solid #fff;
        border-radius: 10px;
        padding:0 10px;
        margin-bottom: 24px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .box-bottom{
      width: 1200px;
      min-height: 240px;
      margin: 0 auto;
      background: rgba(45,66,175,0.2);
      padding: 42px 4.4%;
      .box-bottom-box{
        // background: #2d42af;
        height: 115px;
        color: #fff;
        text-align: center;
        border: 2px solid #fff;
        -webkit-border-top-left-radius: 10px;
        -webkit-border-top-right-radius: 10px;
        margin-bottom:24px;
        .box-bottom-box-top{
          cursor: pointer;
          height:39%;
          background:rgba(92,111,210,1);
          line-height: 42px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 0 10px;
          font-size:18px;
          -webkit-border-top-left-radius: 10px;
          -webkit-border-top-right-radius: 10px;
        }
        .box-bottom-box-bottom{
          height:61%;
          background: rgba(45,66,175,1);
          .box-bottom-box-bottom-num{
            font-size:24px;
            font-weight:bold;
          }
        }
      }
    }
  }
  * {
    box-sizing: border-box;
  }
  .w20 {
    width: calc(100% / 4) !important;
  }
  .conmon {
    display: flex;
    .commonPart_title {
      width: 106px;
      background-color: rgb(48, 79, 255);
      display: flex;
      flex-direction: column;
      margin-top: 12px;
      margin-right: 35px;
      box-sizing: border-box;
      box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.5);
      height: 128px;
      display: table;
      // border: 1px solid #677dfe;
      border: 1px solid rgb(0, 102, 153);
      div {
        color: #fff;
        font-size: 30px;
        font-weight: 700;
        text-align: center;
        letter-spacing: 5px;
      }
    }
    .commonPart_title_item {
      display: table-cell;
      vertical-align: middle;
    }
    .commonPart {
      margin-top: 12px;
      width: calc(100% - 141px);
    }
  }
  .commonFlex {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .conmon2 {
    display: flex;
    .commonPart_title2 {
      display: table;
      width: 106px;
      margin: 8px 0;
      background-color: rgb(16, 149, 242);
      margin-right: 35px;
      box-sizing: border-box;
      box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.5);
      // border: 1px solid #677dfe;
      border: 1px solid rgb(0, 102, 153);
      .commonPart_title2_item {
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        height: 400px;
        color: #fff;
        font-size: 30px;
        font-weight: 700;
        letter-spacing: 5px;
      }
    }
    .commonPart {
      width: calc(100% - 141px);
    }
  }
  .container_item {
    height: 140px;
    font-size: 20px;
    line-height: 120px;
    padding-left: 12px;
     text-align: center;
    box-sizing: border-box;
    color: #036;
    font-weight: bold;
    display: inline-block;
    vertical-align: middle;
    position: relative;
    z-index: 0;
    overflow: hidden;
    // margin: 12px 0px 5px 0px;
    cursor: pointer;
    // background: url("../assets/img/flow02.png") no-repeat center;
    // background-size:cover;
    img {
      width: 100%;
      height: 100%;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
    }
  }
  .container > :first-child {
    // background: url("../assets/img/flow01.png") no-repeat center;
    // background-size:cover;
  }
  .thirdHeight {
    height: 80px;
    line-height: 80px;
    font-size: 20px;
    background: rgb(214, 236, 255);
    border: 1px solid rgb(0, 102, 153);
    box-shadow: 0px 10px 10px 0px rgba(16, 149, 242, 0.1);
  }
  .commonNode {
    text-align: center;
    box-sizing: border-box;
    color: #555;
    display: inline-block;
    vertical-align: middle;
    position: relative;
    z-index: 0;
    overflow: hidden;
    margin: 12px 0px 5px 0px;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
    }
    span {
      word-break: break-all;
      display: inline-block;
      vertical-align: middle;
    }
    &:after {
      content: "";
      width: 0;
      height: 100%;
      display: inline-block;
      vertical-align: middle;
    }
    .item_name {
      color: rgb(0, 51, 102);
      font-weight: 700;
      position: relative;
      top: -2px;
      left: 5px;
    }
    .item_code {
      color: rgb(0, 51, 102);
      font-weight: 700;
      position: relative;
      top: -2px;
    }
  }
  .content {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .container {
    display: flex;
    flex-wrap: wrap;
    display: -webkit-flex;
    .container_item {
      flex: 1;
    }
  }
}
</style>
