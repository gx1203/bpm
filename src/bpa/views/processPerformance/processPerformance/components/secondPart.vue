<template>
    <div class="w100 h100 secondpart">
      <h6>  {{ZCGetJsonList.chainName}}</h6>
      <div class="chartContet">
        <img src="@/bpa/assets/img/line.png" class="lineMiddle" alt=""/>
        <!-- <p class="footer">总时长: 65.28h</p> -->
        <p class="footer">总时长: {{ZCGetJsonList.sumAvgDurationShow}}</p>
        <div class="left">
          <div class="w100 fishHead">
            <p>
              <!-- 采<br/>购<br/>价<br/>值<br/>链 -->
              {{ZCGetJsonList.chainName}}
            </p>
          </div>
        </div>
        
        <div class="center w100">
          <div class="h100 wst"  ref="contentWidth">
            <div class="top">
            <el-row  class="h100" :gutter="20">
             <el-col  class="h100" v-for="(i,index) in ZCGetJsonList.stagelist" :key='index' v-if="index%2===0" :span=" Math.floor(24/((ZCGetJsonList.stagelist.length+1)/2))">
              <div class="commontop" >
                <div class="rectContent"  >
                  <p><span>{{i.name}}</span></p>
                  <p>流程次数: {{i.extendMap.instanceCount}}</p>
                  <p>阶段时长: {{i.extendMap.avgDuration}}</p>
                  <p>价值链占比： {{i.extendMap.proportion}}</p>
                </div>
                <svg class="dashLine" ref="dashTopHeight" >
                     <line x1="0" y1="100%" x2="48" y2="2" stroke-dasharray="5 5" stroke="#2587be"></line>
                     
                  <g v-for="(item, index) in  i.processDataList" :key="index">
                       <title>查看流程绩效</title> 
                     <line :x1="48 * (23 * (index + 1)) / dashTopHeight" :y1="dashTopHeight - (16 + 23 * index)" :x2="48 * (23 * (index + 1)) / dashTopHeight + 32" :y2="dashTopHeight - (16 + 23 * index)" stroke-dasharray="5 5" stroke="#2587be"></line>
                       <text :x="48 * (23 * (index + 1)) / dashTopHeight + 35" :y="dashTopHeight - (12 + 23 * index)" fill="#fff" class="svg-text"  @click="goUserManager(item)">         
                       {{item.name}}
                      </text>
                  </g>
                </svg>
              </div>
             </el-col>
               </el-row>
          
            </div>
            <div class="bottom">
            <el-row class="h100" :gutter="20">
            <el-col  class="h100" v-for="(i,index) in ZCGetJsonList.stagelist" :key='index' v-if="index%2!==0" :span=" Math.floor(24/((ZCGetJsonList.stagelist.length+1)/2))">
              <div class="commonbottom"  >
                <svg class="dashLine" ref="dashBottomHeight">
                  <line x1="0" y1="0" x2="48" y2="100%" stroke-dasharray="5 5" stroke="#2587be"></line>
                  <g v-for="(item, index) in i.processDataList" :key="index">
                      <title>查看流程绩效</title> 
                     <line :x1="48 * (23 * (index + 1)) / dashBottomHeight" :y1="16 + 23 * index" :x2="48 * (23 * (index + 1)) / dashBottomHeight + 32" :y2="16 + 23 * index" stroke-dasharray="5 5" stroke="#2587be"></line>
                    <text :x="48 * (23 * (index + 1)) / dashBottomHeight + 35" :y="20 + 23 * index" fill="#fff"  class="svg-text" @click="goUserManager(item)">{{item.name}}</text>
                  </g>
                </svg>
                <div class="rectContent">
                     <p><span>{{i.name}}</span></p>
                  <p>流程次数: {{i.extendMap.instanceCount}}</p>
                  <p>阶段时长: {{i.extendMap.avgDuration}}</p>
                  <p>价值链占比： {{i.extendMap.proportion}}</p>
                </div>
              </div>
              </el-col>
             </el-row>
             
            </div>
          </div>
        </div>
        <div class="right">
          <div class="w100 fishend"></div>
        </div>
      </div>
   <el-dialog
      title="流转时间"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose">
       <div class="item-right dialog-centre">
     <!-- <el-tabs  v-model="editableTabsValue">
    <el-tab-pane :label="$t('transferNumber')" name="1">  
              <twisting-number v-if="editableTabsValue === '1'" :item="checkData" />
    </el-tab-pane>
    <el-tab-pane :label="$t('circulationTime')" name="2"> -->
                <twisting-time v-if="editableTabsValue === '2'" :item="checkData" />
    <!-- </el-tab-pane>
    <el-tab-pane :label="$t('deadline')" name="3">        
        <deadline-echar v-if="editableTabsValue === '3'" :item="checkData" />
  </el-tab-pane>
  </el-tabs> -->
    </div>

</el-dialog>
    </div>
</template>

<script>
import $ from 'jquery'
import twistingNumber from '@/bpm/views/monitor/processMonitoring/runningAnalysis/twistingNumber'
import twistingTime from '@/bpm/views/monitor/processMonitoring/runningAnalysis/twistingTime'
import deadlineEchar from '@/bpm/views/monitor/processMonitoring/runningAnalysis/deadlineEchar'
export default {
  name: 'secondPart',
    components: {
    twistingNumber,
    twistingTime,
    deadlineEchar
  },
  data() {
    return {
      dashTopHeight: 1,
      dashBottomHeight: 1,
      dialogVisible: false,
      checkData: {},
      editableTabsValue:'2',
      data:{
        'name':'采购价值链',
        list:[
           {
             titel:'供应商',
             processNo:64,
             TheStageTime:'64.2h',
             ValueChainRatio:'42%',
              children:['12.2 设备类资产购置审批申请']
           },
           {
             titel:'供应商1',
             processNo:64,
             TheStageTime:'64.2h',
             ValueChainRatio:'42%',
              children:['12.2 设备类资产购置审批申请']
           },
           {
             titel:'供应商2',
             processNo:64,
             TheStageTime:'64.2h',
             ValueChainRatio:'42%',
              children:['12.2 设备类资产购置审批申请']
           },
           {
             titel:'供应商3',
             processNo:64,
             TheStageTime:'64.2h',
             ValueChainRatio:'42%',
              children:['12.2 设备类资产购置审批申请']
           }
        ]
      }
    }
  },  
  props:["ZCGetJsonList"],
  // props:{
  //     ZCGetJsonList: {
  //     type: Object,
  //   },
  // },
  watch: {
    ZCGetJsonList: {
      handler () {
        this.$nextTick(() => {
          this.compitedHeight()
        })
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    window.onresize = () => {
      this.compitedHeight()
    }
    let topWidth = $('.commontop').length * 226
    let bottomWidth = $('.commonbottom').length * 270
    this.$refs.contentWidth.style.width = `${topWidth > bottomWidth ? topWidth : bottomWidth}px`
    console.log(topWidth > bottomWidth ? topWidth : bottomWidth)
  },
  methods: {
   handleClose(){
    this. dialogVisible=false
    this.editableTabsValue='2'
   },
   
   goUserManager(i){
     if(!i.extendMap){
       this.$message('无流程');
      return
     }
          console.log('iiiiiiiiiiiii',i.extendMap.processId);

      this. dialogVisible= true
       let data={
         id:i.extendMap.processId,
         backgroundColor:'#0b173e'
       }
      this.checkData = data
//      let routeData = this.$router.resolve({
//    name: "searchGoods",
//    query: params,
//    params:{catId:params.catId}
// });

    //   let routeData =this.$router.resolve({ 
    //     name:'runningAnalysis',
    //     query: {
    //      processname:i.extendMap.processName,
    //      processNameCn:i.extendMap.processNameCn
    //     }
    //     })
    // window.open(routeData.href, '_blank');
   },
    compitedHeight () {
      this.dashTopHeight = $(this.$refs.dashTopHeight).height()
      this.dashBottomHeight = $(this.$refs.dashBottomHeight).height()
    }
  }
}
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}
.secondpart {
  padding: 0 29px;
  background: url('../../../../assets/img/bg-Img1.png') center center no-repeat;
  background-size: 100% 100%;
  
  h6 {
    font-size: 16px;
    color: #a9ddee;
    font-weight: 100;
    line-height: 38px;
    width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .chartContet {
    height: calc(100% - 50px);
    position: relative;
    padding: 0 44px 0 67px;
    .left{
      width: 67px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      .fishHead {
        width: 100%;
        min-height: 260px;
        background: url('../../../../assets/img/leftCircle.png') center center no-repeat;
        background-size: 100% 100%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        p {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-25%, -50%);
          font-size: 18px;
          font-weight: bold;
          color: #fff;
           width: 30px;  
           margin: 0 auto;  
           line-height: 24px;  
          //  height: 180px;
           writing-mode: vertical-lr;/*从左向右 从右向左是 writing-mode: vertical-rl;*/ 
            overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          letter-spacing:0.3em;
        }
      }
    }
    .center {
      height: 100%;
      /deep/ .el-scrollbar__view {
        height: 100%;
      }
      .top, .bottom{
        position: relative;
      }
      .top {
        height: calc(50% - 7px);
        margin-bottom: 14px;
        .commontop{
          display: inline-block;
          vertical-align: top;
          width: 250px;
          height: 100%;
        }
      }
      .bottom {
        height: calc(50% - 50px);
        .commonbottom{
          display: inline-block;
          vertical-align: top;
          width: 230px;
          height: 100%;
          margin-left: 24px;
        }
      }
      .dashLine{
        width: 100%;
        height: calc(100% - 70px);
      }
      .rectContent{
        width: 190px;
        margin-left: 48px;
        color: #17d3de;
        height: 66px;
        border: 1px solid #05406d;
        padding: 5px 10px 5px 42px;
        line-height: 18px;
            margin-left: 50px;
        position: relative;
        p:nth-of-type(1){
          width: 66px;
          height: 66px;
          padding: 12px;
          font-size: 14px;
          color: #fff;
          position: absolute;
          left: -33px;
          top: 0;
          background-color: #067ade;
          border-radius: 50%;
          display: inline-block;
          vertical-align: middle;
          span{
            display: inline-block;
            vertical-align: middle;
          }
          &:after {
            content: '';
            display: inline-block;
            vertical-align: middle;
            height: 100%;
            width: 0;
          }
        }
      }
    }
    .right {
      width: 44px;
      height: 100%;
      position: absolute;
      right: 0;
      top: 0;
      overflow: hidden;
      .fishend{
        width: 0;
        height: 0;
        border: 124px solid #203382;
        border-left-color: transparent;
        border-bottom-color: transparent;
        border-top-color: transparent;
        border-right-width: 44px;
        border-left-width: 44px;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .lineMiddle {
      display: block;
      width: calc(100% - 111px);
      height: 14px;
      position: absolute;
      left: 67px;
      top: 50%;
      transform: translateY(-50%);
    }
    .footer {
      position: absolute;
      text-align: center;
      bottom: 0;
      left: 67px;
      background: url("../../../../assets/img/include.png") no-repeat center center;
      background-size: 100% 100%;
      width: calc(100% - 111px);
      height: 32px;
      line-height: 44px;
      color: #fff;
    }
  }
  .wst{
    width:100% !important;
    }
    .svg-text{
     cursor:pointer;
      font-size: 14px;
      color: red;
    }
    .svg-text:hover {
      fill:#17d3de;
    }
   /deep/  .el-dialog__body {
      background-color: #0b173e;
    }
     /deep/ .el-dialog__header{
      background-color: #0b173e;
    }
     /deep/  .el-dialog__title{
      color: #fff;
    }
     /deep/ .el-tabs__item{
       color: #fff;
     }
    /deep/ .is-active{
        color: #067ade;
     }
     
}

</style>
