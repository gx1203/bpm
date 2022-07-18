<template>
  <div class="handle-progress">
    <div class="hint-content" v-if="progressNode.applyUserName">
      <p>当前执行规则：{{progressNode.brName}}</p>
      申请人 <span class="orange">{{progressNode.applyUserName}} </span> 于 {{progressNode.applyDate}} 提交申请，已历时办理 <span
        class="orange">{{progressNode.duration}} </span>。该业务共包含 <span class="orange">{{progressNode.nodeNumber}}个
      </span> 办理节点，
      <span v-if="nodelist.filter(items => { return items.nodeStatus !== '已完成' }).length!==0">
        目前正处于第 <span class="orange">{{progressNode.currentNodeNumber}} </span> 个 <span
          class="orange">{{progressNode.currentNode}} </span>节点
        <span v-if="progressNode.nextNode">
          ，下个节点为 <span class="orange">{{progressNode.nextNode}}</span> 。
        </span>
        <span v-else>。</span>
      </span>
      <span v-else>已完成办理。</span>
    </div>
    <el-row v-if="processType === 'default'">
      <el-col :span="22">
        <el-steps space="200" :active="active" align-center finish-status="success">
          <div class="el-step-wrap" v-for="(item, index) in nodelist" :key="index">
            <el-step :title="item.nodeName">
              <span slot="title" :title="item.nodeName">{{item.nodeName}}</span>
              <div slot="description" class="desc-content">
                <h3 class="desc-title">
                  <span v-if="item.approvalRemark">{{item.approvalRemark}}：</span>
                  <span v-if="item.approveType && index !== 0">({{ item.approveType }})</span>
                  <el-tooltip v-if="item.nodeUserDtoList && item.nodeUserDtoList.filter(el => el.canUrge).length > 0" content="催办">
                    <el-button type="text" @click="handleCuiban">
                      <i class="iconfont icon-cuiban" style="font-size: 20px"></i>
                    </el-button>
                  </el-tooltip>
                </h3>
                <div class="desc-item" v-for="(item2, index2) in item.nodeUserDtoList" :key="index2">
                  <h4>
                    <!-- <el-tooltip :content="item2.reason" placement="top" effect="light" v-if="item2.reason">
                  <span>{{ item2.approveUserName }}</span>
                </el-tooltip> -->
                    <span>{{ item2.approveUserName }}</span>
                  </h4>
                  <p>办理时间：{{ item2.applyDate }}</p>
                </div>
              </div>
            </el-step>
            <span class="return-hint" v-if="progressNode.returned && index === 0"><img :src="hongqi" alt=""></span>
            <span class="progress-hint" v-if="item.nodeStatus === '进行中'"><img :src="curLocation" alt=""></span>
            <span class="time" v-if="item.handleDuration && index !== 0">{{ item.handleDuration }}</span>
          </div>
        </el-steps>
      </el-col>
      <el-col :span="2" align="center">
        <div class="circle"><span style="background: #67c23a;"></span> 已完成</div>
        <div class="circle"><span style="background: #ed9720;"></span> 进行中</div>
        <div class="circle"><span style="background: #c9c9c9;"></span> 未完成</div>
      </el-col>
    </el-row>
    <el-row v-if="processType === 'oa'">
      <el-col :span="22" class="highland clear-fix">
        <div class="step-item" v-for="(item, index) in nodelist" :key="index" :class="index === 0 && item.nodeStatus === '进行中' ? 'step-start step-start-progress' : index === 0 ? 'step-start' : index === nodelist.length - 1 && item.nodeStatus === '进行中' ? 'step-end step-end-progress' : index === nodelist.length - 1 && item.nodeStatus === '已完成' ? 'step-end step-end-finished' : index === nodelist.length - 1 ? 'step-end' : item.nodeStatus === '已完成' ? 'step-finished' : item.nodeStatus === '进行中' ? 'step-progress' : item.nodeStatus === '未完成' ? 'step-unfinished' : ''">
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            :disabled="!item.nodeUserDtoList || item.nodeUserDtoList.length === 0">
            <div class="desc-content">
              <h3 class="desc-title">
                <span v-if="item.approvalRemark">{{item.approvalRemark}}：</span>
                <span v-if="item.approveType && index !== 0">({{ item.approveType }})</span>
                <el-tooltip v-if="item.nodeUserDtoList && item.nodeUserDtoList.filter(el => el.canUrge).length > 0" content="催办">
                  <el-button type="text" @click="handleCuiban">
                    <i class="iconfont icon-cuiban" style="font-size: 20px"></i>
                  </el-button>
                </el-tooltip>
              </h3>
              <div class="desc-item" v-for="(item2, index2) in item.nodeUserDtoList" :key="index2">
                <h4>
                  <span>{{ item2.approveUserName }}</span>
                </h4>
                <p>办理时间：{{ item2.applyDate }}</p>
              </div>
            </div>
            <div slot="reference" class="step-content">
              <p class="node-name" :title="item.nodeName">{{item.nodeName}}</p>
              <p class="node-users" :title="item.nodeUsers">{{item.nodeUsers}}</p>
            </div>
          </el-popover>
          <div class="node-sign-user" v-if="item.nodeSignUserDtoList && item.nodeSignUserDtoList.length > 0">
<!--            <ul>-->
<!--              <li v-for="(val, index1) in item.nodeSignUserDtoList" :key="index1">{{val}}</li>-->
<!--            </ul>-->
            <p :title="item.nodeSignUser">{{item.nodeSignUser}}</p>
            <span class="hint">加签</span>
          </div>
          <span class="return-hint" v-if="progressNode.returned && index === 0"><img :src="hongqi" alt=""></span>
          <span class="progress-hint" v-if="item.nodeStatus === '进行中'"><img :src="curLocation" alt=""></span>
        </div>
      </el-col>
      <el-col :span="2" align="center">
        <div class="circle"><span style="background: #67c23a;"></span> 已完成</div>
        <div class="circle"><span style="background: #ed9720;"></span> 进行中</div>
        <div class="circle"><span style="background: #c9c9c9;"></span> 未完成</div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { urge, getProgressNode, processshowtype } from '@/bpm/api/staging/personal/apply'
import hongqi from '@/assets/img/hongqi.png'
import curLocation from '@/assets/img/curLocation.png'
export default {
  name: 'HandleProgress',
  components: {},
  data () {
    return {
      active: -1,
      progressNode: {},
      nodelist: [],
      processType: 'default',
      hongqi: hongqi,
      curLocation: curLocation,
      show: false
    }
  },
  props: {
    instanceId: {
      type: String,
      default: ''
    }
  },
  watch: {
    instanceId: {
      handler: function (val) {
        if (val) {
          this.$nextTick(() => {
            this.processshowtype()
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    processshowtype () {
      processshowtype().then(rt => {
        this.processType = rt.data
        this.getProgressNode()
      }).catch(() => {
      })
    },
    getProgressNode () {
      getProgressNode({
        instanceId: this.instanceId
      }).then(rt => {
        if (rt.status === '200' && rt.data) {
          this.progressNode = rt.data
          this.nodelist = rt.data.nodelist || []
          this.nodelist.unshift({
            nodeName: '开始',
            nodeStatus: '已完成'
          })
          this.nodelist.push({
            nodeName: '结束',
            nodeStatus: this.nodelist.filter(items => { return items.nodeStatus !== '已完成' }).length !== 0 ? '未完成' : '已完成'
          })
          this.nodelist.forEach((item, index) => {
            if (item.nodeStatus === '进行中') {
              this.active = index
            }
            item.nodeUsers = item.nodeUserDtoList && item.nodeUserDtoList.length > 0 ? item.nodeUserDtoList.map(val => val.approveUserName).join('&') : ''
            item.nodeSignUser = item.nodeSignUserDtoList && item.nodeSignUserDtoList.length > 0 ? item.nodeSignUserDtoList.join('&') : ''
          })
          if (this.nodelist.filter(item => item.nodeStatus === '已完成').length === this.nodelist.length) {
            this.active = this.nodelist.length
          }
        } else {
          this.$message.error(rt.message)
        }
        this.$loading().close()
      }).catch(() => {
        this.$loading().close()
      })
    },
    handleCuiban () {
      this.$confirm(this.$t('hintText.areYouSureDeletePush'), this.$t('hintText.hint'), {
        type: 'warning'
      }).then(() => {
        urge(this.instanceId).then(rt => {
          if (rt.status === '200') {
            this.$message.success(this.$t('hintText.operateSuccessfully'))
          }
        }).catch(er => {
          this.loading = false
        })
      }).catch(() => { })
    }
  },
  mounted () {
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
/*高地风格*/
.highland {
  overflow: auto;
  white-space: nowrap;
  display: flex;
  min-height: 50px;
  padding: 40px 0 50px;
  $oa-finish-color: #61b121;
  $oa-progress-color: #ed9720;
  $oa-unfinished-color: #b3b3b3;
  .step-item {
    position: relative;
    flex: 1;
    min-width: 240px;

    &:before {
      content: '';
      position: absolute;
      /*top: 34px;*/
      top: 48px;
      right: calc(50% + 90px); //180/2
      width: calc(100% - 140px); // 90+50
      /*height: 12px;*/
      height: 3px;
      background-color: $oa-finish-color;
      /*background-size: 100% 100%;*/
      /*background-repeat: no-repeat;*/
      /*background-image: url(../../../assets/img/step-finished-arrows.png);*/
    }
    &:after {
      content: '';
      position: absolute;
      top: 42px;
      right: calc(50% + 44px); // 50-6
      border: solid transparent;
      border-top-width: 7px;
      border-left-width: 14px;
      border-bottom-width: 7px;
      border-left-color: $oa-finish-color;
    }

    &:first-child {
      margin-left: 0;
      &:before {
        display: none;
      }
      &:after {
        display: none;
      }
    }
  }
  .step-content {
    display: inline-block;
    width: 180px;
    height: 100px;
    padding: 0 13px;
    box-sizing: border-box;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url(../../../assets/img/step-finished.png);
    position: relative;
    z-index: 10;
    p {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    p.node-name {
      margin-top: 22px;
      font-weight: 600;
    }
    p.node-users {
      margin-top: 16px;
      font-size: 13px;
    }
  }
  .step-start {
    .step-content {
      /*width: 100px;*/
      width: 140px;
      height: 60px;
      margin-top: 20px;
      color: $oa-finish-color;
      font-size: 16px;
      background-image: url(../../../assets/img/step-start1.png);
    }
  }
  .step-start-progress {
    .step-content {
      /*width: 100px;*/
      color: $oa-progress-color;
      background-image: url(../../../assets/img/step-end-progress.png);
    }
  }
  .step-finished {
    &:after {
      right: calc(50% + 84px); // 90-6
    }
    .step-content {
      height: 110px;
      color: $oa-finish-color;
    }
  }
  .step-progress {
    &:before {
      background-color: $oa-progress-color;
      /*background-image: url(../../../assets/img/step-progress-arrows.png);*/
    }
    &:after {
      right: calc(50% + 84px); // 80-6
      border-left-color: $oa-progress-color;
    }
    .step-content {
      color: $oa-progress-color;
      background-image: url(../../../assets/img/step-progress.png);
    }
  }
  .step-unfinished {
    &:before {
      background-color: $oa-unfinished-color;
      /*background-image: url(../../../assets/img/step-unfinished-arrows.png);*/
    }
    &:after {
      right: calc(50% + 84px); // 90-6
      border-left-color: $oa-unfinished-color;
    }
    .step-content {
      color: $oa-unfinished-color;
      background-image: url(../../../assets/img/step-unfinished.png);
    }
  }
  .step-end {
    &:before {
      right: calc(50% + 70px);
      width: calc(100% - 140px);
      background-color: $oa-unfinished-color;
      /*background-image: url(../../../assets/img/step-unfinished-arrows.png);*/
    }
    &:after {
      right: calc(50% + 64px);
      border-left-color: $oa-unfinished-color;
    }
    .step-content {
      /*width: 100px;*/
      width: 140px;
      height: 60px;
      margin-top: 20px;
      color: $oa-unfinished-color;
      font-size: 16px;
      background-image: url(../../../assets/img/step-end1.png);
    }
  }
  .step-end-progress {
    &:before {
      background-color: $oa-progress-color;
    }
    &:after {
      border-left-color: $oa-progress-color;
    }
    .step-content {
      color: $oa-progress-color;
      background-image: url(../../../assets/img/step-end-progress.png);
    }
  }
  .step-end-finished {
    &:before {
      background-color: $oa-finish-color;
    }
    &:after {
      border-left-color: $oa-finish-color;
    }
    .step-content {
      color: $oa-finish-color;
      background-image: url(../../../assets/img/step-start1.png);
    }
  }

  .step-finished {
    .node-sign-user {
      &:before {
        height: 65px;
        top: -65px;
      }
      &:after {
        top: -69px;
      }
    }
  }
  .step-start, .step-finished, .step-end-finished {
    .node-sign-user {
      border: 1px solid $oa-finish-color;
      &:before {
        background-color: $oa-finish-color;
      }
      &:after {
        border-bottom-color: $oa-finish-color;
      }
      span.hint {
        color: $oa-finish-color;
        border: 1px solid $oa-finish-color;
        background-color: #ffffff;
      }
    }
  }
  .step-unfinished, .step-end {
    .node-sign-user {
      border: 1px solid $oa-unfinished-color;
      &:before {
        background-color: $oa-unfinished-color;
      }
      &:after {
        border-bottom-color: $oa-unfinished-color;
      }
      span.hint {
        color: $oa-unfinished-color;
        border: 1px solid $oa-unfinished-color;
        background-color: #ffffff;
      }
    }
  }

  .node-sign-user {
    width: 100px;
    margin: 50px auto 0;
    border: 1px solid $oa-progress-color;
    border-radius: 2px;
    font-size: 12px;
    padding: 16px 5px 8px;
    position: relative;
    &:before {
      content: '';
      position: absolute;
      width: 2px;
      height: 50px;
      top: -50px;
      left: calc(50% - 1px);
      background-color: $oa-progress-color;
    }
    &:after {
      content: '';
      position: absolute;
      top: -54px;
      left: calc(50% - 5px);
      border: solid transparent;
      border-right-width: 5px;
      border-bottom-width: 10px;
      border-left-width: 5px;
      border-bottom-color: $oa-progress-color;
    }
    li {
      line-height: 20px;
    }
    span.hint {
      position: absolute;
      top: -11px;
      right: calc(50% - 24px);
      width: 46px;
      line-height: 20px;
      color: $oa-progress-color;
      border: 1px solid $oa-progress-color;
      border-radius: 12px;
      background-color: #fff4e5;
      box-sizing: border-box;
    }
    p {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
.return-hint {
  position: absolute;
  left: 50%;
  top: -5px;
  height: 25px;
  img {
    height: 100%;
  }
}
.progress-hint {
  position: absolute;
  left: 50%;
  top: -28px;
  height: 30px;
  transform: translate(-50%, 0);
  img {
    height: 100%;
  }
}
/*标准风格*/
.circle {
  margin-bottom: 20px;
  span {
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    vertical-align: text-bottom;
  }
}
.hint-content {
  padding: 15px;
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 14px;
  text-align: left;
  .orange {
    color: #ff9c21;
  }
}
.el-steps {
  overflow: auto;
  padding: 50px 0 10px;
}
.el-step-wrap {
  position: relative;
  min-width: 200px;
  flex: 1;
  span.time {
    position: absolute;
    top: 30px;
    left: 0;
    transform: translate(-50%, 0);
  }
  &:last-of-type {
    /deep/ .el-step {
      .el-step__head {
        .el-step__line {
          display: none !important;
        }
      }
    }
  }
  /deep/ .el-step {
    padding-top: 40px;
    position: relative;
    width: 100%;
    max-width: 100% !important;
    .el-step__head {
      color: #ffffff;
      border: none;
      min-height: 32px;
      .el-step__line {
        display: block;
        .el-step__line-inner {
          width: 0 !important;
        }
      }
      .el-step__icon {
        width: auto;
        height: auto;
        line-height: normal;
        border: none;
        .el-step__icon-inner {
          width: 22px;
          height: 22px;
          line-height: 22px;
          border-radius: 50%;
        }
      }
    }
    /*已完成*/
    $finish-color: #67c23a; // #00cc00;
    .el-step__head.is-finish {
      .el-step__line {
        background-color: $finish-color;
      }
      .el-step__icon {
        .el-step__icon-inner {
          background-color: $finish-color;
        }
      }
    }
    .el-step__head.is-success {
      .el-step__line {
        background-color: $finish-color;
      }
      .el-step__icon {
        .el-step__icon-inner {
          background-color: $finish-color;
        }
      }
    }
    /*当前*/
    $process-color: #ed9720; // #f70033; // #ff9900
    .el-step__head.is-process {
      .el-step__icon {
        padding: 3px;
        border: 1px solid $process-color;
        position: relative;
        top: -3px;
        .el-step__icon-inner {
          background-color: $process-color;
        }
      }
    }
    .el-step__title.is-process {
      color: $process-color !important;
    }
    .el-step__description.is-process {
      .desc-content {
        .desc-title {
          color: $process-color;
        }
      }
    }
    /*当前*/
    .el-step__head.is-wait {
      .el-step__icon {
        .el-step__icon-inner {
          background-color: #c9c9c9;
        }
      }
    }
    .el-step__main {
      .el-step__title {
        position: absolute;
        top: 0;
        width: 100%;
        color: #333333;
        font-size: 14px;
        font-weight: 600;
        height: 38px;
        line-height: 38px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .el-step__description {
        margin-top: 12px;
        font-size: 12px;
        padding: 0;
      }
    }
  }
}
.desc-content {
  color: #333333;
  font-size: 12px;
  h3 {
    height: 24px;
    line-height: 24px;
    .el-button--text {
      padding: 0;
    }
  }
  .desc-item {
    width: 180px;
    margin: 6px auto 0;
    text-align: left;
    h4 {
      height: 24px;
      line-height: 24px;
      span {
        cursor: pointer;
      }
    }
  }
}
</style>
