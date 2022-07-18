<template>
  <div id="AnalysisHeader" class="w100 bpaAnalysis">
    <el-row :gutter="20">
      <div class="run">
        <div v-for="(item,index) in headerList" :key="index" class="runItem" >
          <el-tooltip :content="item.title" placement="bottom">
            <div :style="'background:'+ item.color" class="runItemBox">
              <div class="runItemBox-left">
                <div class="runItemBox-left-top">
                  {{ item.num }}
                </div>
                <div class="runItemBox-left-bottom">
                  {{ item.name }}
                  <i class="el-icon-warning-outline" style="margin-left:2px"/>
                </div>
              </div>
              <div class="runItemBox-right">
                <i :class="item.ico"/>
              </div>
            </div>
          </el-tooltip>

        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
export default {
  props: ['headerList'],
  data() {
    return {
      value: ''
    }
  },
  computed: {

  },
  mounted() {

  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
#AnalysisHeader {
    // width: 1320px;
    margin: 0 auto;
     color: #fff;
  .operationEcharts{
    width:100%;
    height: 450px;
  }
  .padding10{
      padding: 10px;
  }
  .flexBox{
      display: flex;
      justify-content: space-between
  }
  .processBar{
      height: 400px
  }
  .positionBar{
      height: 400px;
  }
  .details{
      padding-right: 10px;
      a{
          color: #fff;
      }
  }
  .process{
    display: flex;
    justify-content: space-between;
  }
  .datePicker{
        padding: 10px;
      }
   .pieTitle{
    margin-top: 20px;
    color: #FFFFFF;
    width:100%;
    height:36px;
    background:rgba(9,38,95,1);
    border:1px solid rgba(0,69,125,1);
    font-size:14px;
    padding-left: 10px;
    box-sizing: border-box;
    font-family:Microsoft YaHei;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:36px;

  }
  .run{
    display: flex;
    text-align: center;
    justify-content: space-around;
    .runItem{
      width: 15%;
      height: 94px;
      padding: 4px;
      border: 1px solid #0c5f9c;
      border-radius: 3px;
      background: linear-gradient(to left, rgba(6, 239, 255, 1), rgba(6, 239, 255, 1)) left top no-repeat,
      linear-gradient(to bottom, rgba(6, 239, 255, 1), rgba(6, 239, 255, 1)) left top no-repeat,
      linear-gradient(to left, rgba(6, 239, 255, 1), rgba(6, 239, 255, 1)) right top no-repeat,
      linear-gradient(to bottom, rgba(6, 239, 255, 1), rgba(6, 239, 255, 1)) right top no-repeat,
      linear-gradient(to left, rgba(6, 239, 255, 1), rgba(6, 239, 255, 1)) left bottom no-repeat,
      linear-gradient(to bottom, rgba(6, 239, 255, 1), rgba(6, 239, 255, 1)) left bottom no-repeat,
      linear-gradient(to left, rgba(6, 239, 255, 1), rgba(6, 239, 255, 1)) right bottom no-repeat,
      linear-gradient(to left, rgba(6, 239, 255, 1), rgba(6, 239, 255, 1)) right bottom no-repeat;
        /*设置大小*/
      background-size: 1px 7px, 7px 1px, 1px 7px, 7px 1px;
      .runItemBox{
        width: 100%;
        height: 100%;
        .runItemBox-left{
          width: 74%;
          height: 100%;
          float: left;
          .runItemBox-left-top{
            font-size: 32px;
            font-weight: 600;
            padding-left: 16px;
            margin-top: 9%;
            text-align: left;
          }
          .runItemBox-left-bottom{
            font-size: 12px;
            padding-left: 12px;
            text-align: left;
            margin-top: 5px;
          }
        }
        .runItemBox-right{
          width: 25%;
          height: 100%;
          float: left;
          font-size: 48px;
          padding-top: 8%;
        }
      }
    }
  }
   .operationEcharts{
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    border:1px solid rgba(0,69,125,1);
  }
  p.common-part {
    padding: 15px 10px;
    width: 60%;
    margin: 0 auto;
    span:nth-of-type(1) {
      line-height: 40px;
    }
    span {
      display: block;
      text-align: center;
    }
    span:nth-of-type(2) {
      cursor: pointer;
    }
    span:nth-of-type(2):hover {
      color: #4a9bfb;
    }
  }
  .border-bottom1 {
    border-bottom: 1px solid #e6e6e6;
  }
  .fontRed {
    color: #f8704c;
  }
  .fontBlue {
    color: #6aaeff;
  }
  .fontLightBlue {
    color: #4cd6a0;
  }
  .pblish-i {
    position: absolute;
    top: 11px;
    right: 0;
    padding-right: 2px;
    padding-left: 60px;
  }
  .pblish-i1 {
    top: 5px;
  }
  .colorC {
    color: #ccc;
  }
  .titlehover {
    cursor: pointer;
    color: #4a9bfb;
  }
  .titlehover:hover {
    color: #3e7dca;
  }
}
</style>
