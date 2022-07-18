<template>
  <div class="handle-progress">
    <div class="hint-content" v-if="progressNode.applyUserName">
      <p>当前执行规则：{{ progressNode.brName }}</p>
      申请人 <span class="orange">{{ progressNode.applyUserName }} </span> 于
      {{ progressNode.applyDate }} 提交申请，已历时办理
      <span class="orange">{{ progressNode.duration }} </span>。该业务共包含
      <span class="orange">{{ progressNode.nodeNumber }}个 </span> 办理节点，
      <span
        v-if="
          nodelist.filter(items => {
            return items.nodeStatus !== '已完成'
          }).length !== 0
        "
      >
        目前正处于第
        <span class="orange">{{ progressNode.currentNodeNumber }} </span> 个
        <span class="orange">{{ progressNode.currentNode }} </span>节点
        <span v-if="progressNode.nextNode">
          ，下个节点为
          <span class="orange">{{ progressNode.nextNode }}</span> 。
        </span>
        <span v-else>。</span>
      </span>
      <span v-else>已完成办理。</span>
    </div>
    <el-row v-if="processType === 'default'">
      <el-col :span="22">
        <el-steps
          space="200"
          :active="active"
          align-center
          finish-status="success"
        >
          <div
            class="el-step-wrap"
            v-for="(item, index) in nodelist"
            :key="index"
          >
            <el-step :title="item.nodeName">
              <span slot="title" :title="item.nodeName">{{
                item.nodeName
              }}</span>
              <div slot="description" class="desc-content">
                <h3 class="desc-title">
                  <span v-if="item.approvalRemark"
                    >{{ item.approvalRemark }}：</span
                  >
                  <span v-if="item.approveType && index !== 0"
                    >({{ item.approveType }})</span
                  >
                  <el-tooltip
                    v-if="
                      item.nodeUserDtoList &&
                        item.nodeUserDtoList.filter(el => el.canUrge).length > 0
                    "
                    content="催办"
                  >
                    <el-button type="text" @click="handleCuiban">
                      <i
                        class="iconfont icon-cuiban"
                        style="font-size: 20px"
                      ></i>
                    </el-button>
                  </el-tooltip>
                </h3>
                <div
                  class="desc-item"
                  v-for="(item2, index2) in item.nodeUserDtoList"
                  :key="index2"
                >
                  <h4>
                    <!-- <el-tooltip :content="item2.reason" placement="top" effect="light" v-if="item2.reason">
                  <span>{{ item2.approveUserName }}</span>
                </el-tooltip> -->
                    <span>{{ item2.approveUserName }}</span>
                  </h4>
                  <p>{{ $t('handlingTime') }}: {{ item2.applyDate }}</p>
                </div>
              </div>
            </el-step>
            <span class="return-hint" v-if="item.returned && index === 0"
              ><img :src="shenchaImg" alt=""
            /></span>
            <span class="progress-hint" v-if="item.nodeStatus === '进行中'"
              ><img :src="curLocation" alt=""
            /></span>
            <span class="time" v-if="item.handleDuration && index !== 0">{{
              item.handleDuration
            }}</span>
          </div>
        </el-steps>
      </el-col>
      <el-col :span="2" align="center">
        <div class="circle">
          <span style="background: #67c23a;"></span> 已完成
        </div>
        <div class="circle">
          <span style="background: #ed9720;"></span> 进行中
        </div>
        <div class="circle">
          <span style="background: #c9c9c9;"></span> 未完成
        </div>
      </el-col>
    </el-row>
    <el-row v-if="processType === 'oa'">
      <el-col :span="22" class="highland clear-fix">
        <div
          class="step-item"
          v-for="(item, index) in nodelist"
          :key="index"
          :class="[
            {
              'step-start': item.nodeName === '开始',
              'step-start-progress':
                item.nodeName === '开始' && item.nodeStatus === '进行中',
              'step-end': index === nodelist.length - 1,
              'step-end-progress':
                index === nodelist.length - 1 && item.nodeStatus === '进行中',
              'step-end-finished':
                index === nodelist.length - 1 && item.nodeStatus === '已完成',
              'step-finished':
                item.nodeName !== '开始' &&
                index !== nodelist.length - 1 &&
                item.nodeStatus === '已完成',
              'step-progress':
                item.nodeName !== '开始' &&
                index !== nodelist.length - 1 &&
                item.nodeStatus === '进行中',
              'step-unfinished':
                item.nodeName !== '开始' &&
                index !== nodelist.length - 1 &&
                item.nodeStatus === '未完成'
            },
            // 两行10个%10
            {
              'step-float-left': (index % 10 >= 0) & (index % 10 < 4),
              'step-float-right': (index % 10 > 4) & (index % 10 < 9),
              'step-vertical-line':
                index !== 0 && (index % 10 === 4 || index % 10 === 9)
            }
          ]"
        >
          <i class="line" />
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            :disabled="
              !item.nodeUserDtoList || item.nodeUserDtoList.length === 0
            "
          >
            <div class="desc-content">
              <h3 class="desc-title">
                <span v-if="item.approvalRemark"
                  >{{ item.approvalRemark }}：</span
                >
                <span v-if="item.approveType && index !== 0"
                  >({{ item.approveType }})</span
                >
                <el-tooltip
                  v-if="
                    item.nodeUserDtoList &&
                      item.nodeUserDtoList.filter(el => el.canUrge).length > 0
                  "
                  content="催办"
                >
                  <el-button type="text" @click="handleCuiban">
                    <i class="iconfont icon-cuiban" style="font-size: 20px"></i>
                  </el-button>
                </el-tooltip>
              </h3>
              <div
                class="desc-item"
                v-for="(item2, index2) in item.nodeUserDtoList"
                :key="index2"
              >
                <h4>
                  <span>{{ item2.approveUserName }}</span>
                </h4>
                <p v-if="item2.applyDate">
                  {{ $t('handlingTime') }}: {{ item2.applyDate }}
                </p>
              </div>
              <div class="desc-item" v-if="item.nodeStatus === '进行中'">
                <p
                  :class="{
                    timeout: item.timeoutState === 'Y',
                    'will-timeout': item.timeoutState === 'L'
                  }"
                >
                  {{ $t('approvalTimeLimit') }}: {{ item.remainingDate }}
                </p>
              </div>
            </div>
            <div slot="reference" class="step-content">
              <p class="node-name" :title="item.nodeName">
                {{ item.nodeName }}
              </p>
              <p class="node-users" :title="item.nodeUsers">
                {{ item.nodeUsers }}
              </p>
            </div>
          </el-popover>
          <transition name="el-fade-in-linear">
            <div
              class="node-sign-user"
              v-if="
                item.nodeSignUserAfterDtoList &&
                  item.nodeSignUserAfterDtoList.length > 0
              "
              v-show="afternodeSignShow"
            >
              <!--            <ul>-->
              <!--              <li v-for="(val, index1) in item.nodeSignUserDtoList" :key="index1">{{val}}</li>-->
              <!--            </ul>-->
              <p :title="item.afternodeSignUser">
                {{ item.afternodeSignUser }}
              </p>
              <span class="hint">后加签</span>
            </div>
          </transition>
          <transition name="el-fade-in-linear">
            <div
              class="node-sign-user"
              v-if="
                item.nodeSignUserDtoList && item.nodeSignUserDtoList.length > 0
              "
              v-show="nodeSignShow"
            >
              <!--            <ul>-->
              <!--              <li v-for="(val, index1) in item.nodeSignUserDtoList" :key="index1">{{val}}</li>-->
              <!--            </ul>-->
              <p :title="item.nodeSignUser">{{ item.nodeSignUser }}</p>
              <span class="hint">前加签</span>
            </div>
          </transition>

          <span class="progress-hint" v-if="item.nodeStatus === '进行中'"
            ><img :src="curLocationImg" alt=""
          /></span>
          <!--          <span class="return-hint" v-if="item.returned"-->
          <!--            ><img :src="returnImg" alt=""-->
          <!--          /></span>-->
          <span
            class="scdate-hint"
            v-if="item.returnedNumber && item.returnedNumber > 0"
            ><img :src="shenchaImg" alt="" />
            <i>+{{ item.returnedNumber }}</i>
          </span>
          <span
            class="update-hint"
            v-if="item.updateNumber && item.updateNumber > 0"
            ><img :src="updateImg" alt="" />
            <i>+{{ item.updateNumber }}</i>
          </span>

          <span
            class="nodesign-hint"
            style="left:62%"
            v-if="
              item.nodeSignUserDtoList && item.nodeSignUserDtoList.length > 0
            "
            ><img
              :src="nodeSignImg"
              alt=""
              @mouseenter="nodeSignShow = true"
              @mouseleave="nodeSignShow = false"
          /></span>

          <span
            class="nodesign-hint"
            v-if="
              item.nodeSignUserAfterDtoList &&
                item.nodeSignUserAfterDtoList.length > 0
            "
            style="left:37%"
            ><img
              :src="afternodeSignImg"
              alt=""
              @mouseenter="afternodeSignShow = true"
              @mouseleave="afternodeSignShow = false"
          /></span>
        </div>
      </el-col>
      <el-col :span="2" align="center">
        <div class="circle">
          <span style="background: #67c23a;"></span> 已完成
        </div>
        <div class="circle">
          <span style="background: #ed9720;"></span> 进行中
        </div>
        <div class="circle">
          <span style="background: #c9c9c9;"></span> 未完成
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  urge,
  getProgressNode,
  processshowtype
} from '@/bpm/api/staging/personal/apply'
import returnImg from '@/assets/img/return.png'
import updateImg from '@/assets/img/update.png'
import shenchaImg from '@/assets/img/shencha.png'
import curLocationImg from '@/assets/img/curLocation.png'
import nodeSignImg from '@/assets/img/nodeSign-left.png'
import afternodeSignImg from '@/assets/img/nodeSign-right.png'
export default {
  name: 'HandleProgress',
  components: {},
  data() {
    return {
      active: -1,
      progressNode: {},
      nodelist: [],
      processType: 'default',
      updateImg: updateImg,
      shenchaImg: shenchaImg,
      returnImg: returnImg,
      curLocationImg: curLocationImg,
      nodeSignImg: nodeSignImg,
      afternodeSignImg: afternodeSignImg,
      nodeSignShow: false,
      afternodeSignShow: false
    }
  },
  props: {
    instanceId: {
      type: String,
      default: ''
    },
    processId: {
      type: String,
      default: ''
    }
  },
  watch: {
    processId: {
      handler: function(val) {
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
    processshowtype() {
      processshowtype()
        .then(rt => {
          this.processType = rt.data
          this.getProgressNode()
        })
        .catch(() => {})
    },
    getProgressNode() {
      const params = {
        instanceId: this.instanceId,
        bizData: {
          bpmid: this.processId
        }
      }
      getProgressNode(params)
        .then(rt => {
          if (rt.status === '200' && rt.data) {
            this.progressNode = rt.data
            this.nodelist = rt.data.nodelist || []
            // if (this.processType === 'oa' && this.progressNode.returnedNumber && this.progressNode.returnedNumber > 0) {
            //   for (let i = 0; i < this.progressNode.returnedNumber; i++) {
            //     this.nodelist.unshift({
            //       nodeName: "开始",
            //       nodeStatus: "已完成",
            //       returned: true
            //     });
            //   }
            // }
            this.nodelist.unshift({
              nodeName: '开始',
              nodeStatus: '已完成'
            })
            this.nodelist.push({
              nodeName: '结束',
              nodeStatus:
                this.nodelist.filter(items => {
                  return items.nodeStatus !== '已完成'
                }).length !== 0
                  ? '未完成'
                  : '已完成'
            })
            this.nodelist.forEach((item, index) => {
              if (item.nodeStatus === '进行中') {
                this.active = index
              }
              item.nodeUsers =
                item.nodeUserDtoList && item.nodeUserDtoList.length > 0
                  ? item.nodeUserDtoList
                      .map(val => val.approveUserName)
                      .join('&')
                  : ''
              item.nodeSignUser =
                item.nodeSignUserDtoList && item.nodeSignUserDtoList.length > 0
                  ? item.nodeSignUserDtoList.join('&')
                  : ''
              item.afternodeSignUser =
                item.nodeSignUserAfterDtoList &&
                item.nodeSignUserAfterDtoList.length > 0
                  ? item.nodeSignUserAfterDtoList.join('&')
                  : ''
            })
            if (
              this.nodelist.filter(item => item.nodeStatus === '已完成')
                .length === this.nodelist.length
            ) {
              this.active = this.nodelist.length
            }
          } else {
            this.$message.error(rt.message)
          }
          console.log(this.nodelist, 'nodelist')
          this.$loading().close()
        })
        .catch(() => {
          this.$loading().close()
        })
    },
    handleCuiban() {
      this.$confirm(
        this.$t('hintText.areYouSureDeletePush'),
        this.$t('hintText.hint'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          urge(this.instanceId)
            .then(rt => {
              if (rt.status === '200') {
                this.$message.success(this.$t('hintText.operateSuccessfully'))
              }
            })
            .catch(er => {
              this.loading = false
            })
        })
        .catch(() => {})
    }
  },
  mounted() {}
}
</script>

<style type="text/scss" lang="scss" scoped>
/*高地风格*/
.highland {
  padding: 40px 0 50px;
  overflow: hidden;
  $oa-finish-color: #61b121;
  $oa-progress-color: #ed9720;
  $oa-unfinished-color: #b3b3b3;
  $oa-step-width: 160px;
  $oa-step-height: 90px;
  $oa-step-finished-height: $oa-step-height + 10px;
  $oa-step-startend-width: 160px;
  $oa-step-startend-height: 60px;
  $oa-line-height: 120px;
  .step-item {
    float: left;
    width: 20%;
    min-height: 180px;
    position: relative;
    &:before {
      content: '';
      position: absolute;
      top: calc(#{$oa-step-height} / 2 - 2px);
      right: calc(-50% + (#{$oa-step-width} / 2));
      width: calc(
        100% - (#{$oa-step-width} / 2) - (#{$oa-step-startend-width} / 2)
      );
      height: 3px;
      background-color: $oa-finish-color;
    }
    &:after {
      content: '';
      position: absolute;
      top: calc(#{$oa-step-height} / 2 - 8px);
      right: calc(-50% + (#{$oa-step-startend-width} / 2));
      border: solid transparent;
      border-top-width: 7px;
      border-left-width: 14px;
      border-bottom-width: 7px;
      border-left-color: $oa-finish-color;
    }

    &:last-child {
      margin-left: 0;
      &:before {
        display: none;
      }
      &:after {
        display: none;
      }
    }
  }
  .step-float-left {
    float: left;
  }
  .step-float-right {
    float: right;
    &:before {
      right: auto;
      left: calc(-50% + (#{$oa-step-width} / 2));
    }
    &:after {
      right: auto !important;
      left: calc(-50% + (#{$oa-step-width} / 2 - 6px));
      -ms-transform: rotate(180deg);
      -moz-transform: rotate(180deg);
      -webkit-transform: rotate(180deg);
      -o-transform: rotate(180deg);
    }
  }
  .step-vertical-line {
    &:before {
      right: 50% !important;
      left: auto !important;
      top: $oa-line-height/2 !important;
      height: $oa-line-height !important;
      width: 3px !important;
    }
    &:after {
      top: 170px;
      right: calc(50% - 7px) !important;
      left: auto !important;
      -ms-transform: rotate(90deg);
      -moz-transform: rotate(90deg);
      -webkit-transform: rotate(90deg);
      -o-transform: rotate(90deg);
    }
  }
  .step-content {
    display: inline-block;
    width: $oa-step-width;
    height: $oa-step-height;
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
      margin-top: 18px;
      font-weight: 600;
    }
    p.node-users {
      margin-top: 16px;
      font-size: 13px;
    }
  }
  .step-start {
    &:before {
      right: calc(-50% + (#{$oa-step-startend-width} / 2));
      width: calc(100% - #{$oa-step-startend-width});
    }
    &:after {
      right: calc(-50% + (#{$oa-step-startend-width} / 2 - 6px));
    }
    .step-content {
      width: $oa-step-startend-width;
      height: $oa-step-startend-height;
      margin-top: calc((#{$oa-step-height} - #{$oa-step-startend-height}) / 2);
      color: $oa-finish-color;
      font-size: 16px;
      background-image: url(../../../assets/img/step-start1.png);
    }
  }
  .step-start-progress {
    .step-content {
      color: $oa-progress-color;
      background-image: url(../../../assets/img/step-end-progress.png);
    }
  }
  .step-finished {
    &:after {
      right: calc(-50% + (#{$oa-step-width} / 2 - 6px)); // 90-6
    }
    .step-content {
      height: calc(#{$oa-step-finished-height});
      color: $oa-finish-color;
    }
  }
  .step-progress {
    &:before {
      background-color: $oa-progress-color;
      /*background-image: url(../../../assets/img/step-progress-arrows.png);*/
    }
    &:after {
      right: calc(-50% + (#{$oa-step-width} / 2 - 6px)); // 80-6
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
      right: calc(-50% + (#{$oa-step-width} / 2 - 6px)); // 90-6
      border-left-color: $oa-unfinished-color;
    }
    .step-content {
      color: $oa-unfinished-color;
      background-image: url(../../../assets/img/step-unfinished.png);
    }
  }
  .step-float-right.step-end,
  .step-float-right.step-start {
    &:after {
      left: calc(-50% + (#{$oa-step-startend-width} / 2 - 6px));
    }
  }
  .step-vertical-line.step-end,
  .step-vertical-line.step-start {
    &:before {
      top: calc(
        -#{$oa-line-height} + (#{$oa-step-height} - #{$oa-step-startend-height}) /
          2
      ) !important;
    }
    &:after {
      top: 5px;
    }
  }
  .step-end {
    &:before {
      right: calc(-50% + (#{$oa-step-startend-width} / 2));
      width: calc(100% - #{$oa-step-startend-width});
      background-color: $oa-unfinished-color;
    }
    &:after {
      right: calc(-50% + (#{$oa-step-startend-width} / 2 - 6px));
      border-left-color: $oa-unfinished-color;
    }
    .step-content {
      width: $oa-step-startend-width;
      height: $oa-step-startend-height;
      margin-top: calc((#{$oa-step-height} - #{$oa-step-startend-height}) / 2);
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

  .node-sign-user {
    width: 100px;
    margin: 30px auto 0;
    border: 1px solid $oa-progress-color;
    border-radius: 2px;
    font-size: 12px;
    padding: 16px 5px 8px;
    position: relative;
    z-index: 10;
    background-color: #ffffff;
    &:before {
      content: '';
      position: absolute;
      width: 2px;
      height: 30px;
      top: -30px;
      left: calc(50% - 1px);
      background-color: $oa-progress-color;
    }
    &:after {
      content: '';
      position: absolute;
      top: -34px;
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

  .step-finished {
    .node-sign-user {
      margin: 20px auto 0;
      &:before {
        height: 35px;
        top: -35px;
      }
      &:after {
        top: -39px;
      }
    }
  }
  .step-start,
  .step-finished,
  .step-end-finished {
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
  .step-unfinished,
  .step-end {
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
}
.update-hint {
  position: absolute;
  right: 12%;
  top: -24px;
  height: 25px;
  transform: translate(-50%, 0);
  img {
    height: 100%;
  }
  i {
    position: absolute;
    width: 20px;
    font-style: normal;
    color: #d82f2f;
  }
}
.scdate-hint {
  position: absolute;
  left: 15%;
  top: -24px;
  height: 25px;
  transform: translate(-50%, 0);
  img {
    height: 100%;
  }
  i {
    position: absolute;
    width: 20px;
    font-style: normal;
    color: #d82f2f;
  }
}
.return-hint {
  position: absolute;
  left: 25%;
  top: -24px;
  height: 25px;
  transform: translate(-50%, 0);
  img {
    height: 100%;
  }
  i {
    position: absolute;
    width: 20px;
    font-style: normal;
    color: #d82f2f;
  }
}
.step-start,
.step-end {
  .return-hint {
    top: -9px;
  }
  .progress-hint {
    top: -13px;
  }
  .nodesign-hint {
    top: -6px;
  }
}
.progress-hint + .return-hint {
  left: calc(50% - 54px);
}
.progress-hint + .nodesign-hint,
.return-hint + .nodesign-hint {
  left: calc(50% + 25px);
}
.nodesign-hint {
  position: absolute;
  left: 50%;
  top: -20px;
  height: 18px;
  transform: translate(-50%, 0);
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
.timeout {
  color: red;
}
.will-timeout {
  color: red;
}
</style>
