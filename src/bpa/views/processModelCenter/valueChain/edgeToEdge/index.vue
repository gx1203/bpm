<template>
  <div id="edgeToedgeModel" class="pageWrap w100">
    <div class="pageContent">
      <div class="leftTree">
        <div class="tree_node">
          <el-tree
            ref="asyncTree"
            :props="props"
            :is-leaf="isLeaf"
            node-key="id"
            :load="getFilterTreeList"
            :default-expanded-keys="expandedList"
            :expand-on-click-node="false"
            lazy
            class="elTree"
          >
            <div slot-scope="{ node, data }" class="custom-tree-node">
              <p class="grow" :title="node.label" @click="chooseChain(data)">
                {{ node.label }}
              </p>
            </div>
          </el-tree>
        </div>
      </div>
      <div class="listContent">
        <div class="paintChart" :class="{ fullScreen: isFull, '': !isFull }">
          <div class="tools">
            <div class="toolss">
              <el-tooltip
                class="margin-l10 cursor-pointer"
                effect="dark"
                :content="amplification"
                placement="top"
              >
                <div class="tools-item" @click="toolClick('zoomin')">
                  <i class="el-icon-zoom-in" />
                  <span>{{ amplification }}</span>
                </div>
              </el-tooltip>
              <el-tooltip
                class="margin-l10 cursor-pointer"
                effect="dark"
                :content="narrow"
                placement="top"
              >
                <div class="tools-item" @click="toolClick('zoomout')">
                  <i class="el-icon-zoom-out" @click="toolClick('zoomout')" />
                  <span>{{ narrow }}</span>
                </div>
              </el-tooltip>
              <el-tooltip
                class="margin-l10 cursor-pointer"
                effect="dark"
                content="正常"
                placement="top"
              >
                <div class="tools-item" @click="toolClick('normal')">
                  <i class="el-icon-help" aria-hidden="true" />
                  <span>正常</span>
                </div>
              </el-tooltip>
              <el-tooltip
                class="margin-l10 cursor-pointer"
                effect="dark"
                :content="refresh"
                placement="top"
              >
                <div class="tools-item" @click="toolClick('reload')">
                  <i class="el-icon-refresh" aria-hidden="true" />
                  <span>{{ refresh }}</span>
                </div>
              </el-tooltip>
              <el-tooltip
                class="margin-l10 cursor-pointer"
                effect="dark"
                :content="isFull ? reduction : fullScreen"
                placement="top"
              >
                <div class="tools-item" @click="toolClick('fullScreen')">
                  <i class="el-icon-aim" aria-hidden="true" />
                  <span>{{ isFull ? reduction : fullScreen }}</span>
                </div>
              </el-tooltip>
            </div>
            <div class="tools-right">
              <!-- <el-button type="text" @click="processPerformanceClick">{{$t('processPerformance')}}</el-button> -->
              <!-- <el-button type="text" @click="indicatorsOfLibraryClick">{{$t('indicatorsOfLibrary')}}</el-button> -->
            </div>
          </div>
          <div class="content">
            <div
              ref="chartId"
              class="chartContent"
              @mousedown="mouseDownHandleelse($event)"
              @mouseup="mouseUpHandleelse($event)"
            >
              <div ref="kongtiao" class="realChart">
                <div
                  v-for="(item, index) in rightStoreData.stagelist"
                  :key="item.id"
                  :class="
                    index == 0 ? 'stageContent' : 'stageContent margin-l10'
                  "
                  :style="`top: ${chartHeight}px`"
                >
                  <div class="stageChart pos-relative">
                    <div class="w100 h100 textContent" :title="item.name">
                      <p class="h100 w100">
                        {{ item.name }}
                      </p>
                    </div>
                    <div class="leftImgPart" />
                    <div class="rightImgPart" />
                    <!-- 上面的部分 -->
                    <div
                      v-for="(val, idx) in item.upprocesslists"
                      :key="val.id + 'up' + index + idx"
                      class="stageprocess"
                      :class="[
                        {
                          active:
                            curSelectedItem === val.id + 'down' + index + idx
                        }
                      ]"
                      :style="
                        `left: -${(idx + 1) * 20}px; top: -${(idx + 2) * 30}px`
                      "
                    >
                      <p
                        title="单击将进入流程图查看页面！双击将进入流程框架查看页面！"
                        :class="val.isRelease !== 'Y' ? 'cursor-pointer' : 'cursor-pointer release'"
                        @dblclick="addTScoreClick(val)"
                        @click="singleClick(val,index,idx)"
                      >
                        <span>{{ val.sort }}</span>
                        {{ val.name }}
                      </p>
                    </div>
                    <!-- 下面的部分 -->
                    <div
                      v-for="(val, idx) in item.downprocesslists"
                      :key="val.id + 'down' + index + idx"
                      :class="
                        idx == item.downprocesslists.length - 1
                          ? idx == 0
                            ? 'borderTop stageprocess remove-border-b'
                            : 'stageprocess remove-border-b'
                          : idx == 0
                          ? 'stageprocess borderTop'
                          : 'stageprocess'
                      "
                      :style="
                        `left: -${(idx + 1) * 20}px; top: ${(idx + 2) * 30}px`
                      "
                    >
                      <p
                        title="单击将进入流程图查看页面！双击将进入流程框架查看页面！"
                        :class="val.isRelease !== 'Y' ? 'cursor-pointer' : 'cursor-pointer release'"
                        @dblclick="addTScoreClick(val)"
                        @click="singleClick(val,index,idx)"
                      >
                        <span>{{ val.sort }}</span>
                        {{ val.name }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getChainlist,
  getProcessChart,
  getModelModelViewTree
} from '@/bpa/api/valueCenter/edgeToedge'
import { getCommunityList } from '@/bpa/api/processModelCenter/processCommunity'

export default {
  data() {
    return {
      timer: null, // 这里定义timer为null

      isFull: false,
      // 存储缩放比例
      storeratio: 1,
      // 保存刚进入该页面的ref="chartId"的高度
      chartHeight: 0,
      chainValue: [],
      rightStoreData: {
        chainId: '',
        chainName: '',
        stagelist: []
      },
      moveDataelse: {
        x: null,
        y: null
      },
      amplification: this.$t('amplification'),
      narrow: this.$t('narrow'),
      normalProportion: this.$t('normalProportion'),
      refresh: this.$t('refresh'),
      reduction: this.$t('reduction'),
      fullScreen: this.$t('fullScreen'),
      pleaseSelecttheFirstValueChainProcessAndThenOperate: this.$t(
        'hintText.pleaseSelecttheFirstValueChainProcessAndThenOperate'
      ),
      scaledToTheMinimumCanNotGoAnyLower: this.$t(
        'hintText.scaledToTheMinimumCanNotGoAnyLower'
      ),
      notBeenPublishedAndCannotBeAccessed: this.$t(
        'hintText.notBeenPublishedAndCannotBeAccessed'
      ),
      WhetherToViewTheProcessCommunity: this.$t(
        'hintText.WhetherToViewTheProcessCommunity'
      ),
      hint: this.$t('hintText.hint'),
      confirm: this.$t('confirm'),
      cancel: this.$t('cancel'),
      WhetherToViewProcessPerformance: this.$t(
        'WhetherToViewProcessPerformance'
      ),
      props: {
        label: 'name',
        children: 'childList',
        isLeaf: function(data, node) {
          if (data.parent) {
            return false
          } else {
            return true
          }
        }
      },
      expandedList: [],
      treeData: [],
      // 选中树结构头部，则隐藏按钮
      isSelectFirst: false,
      curSelectedItem: '',
    }
  },
  mounted() {
    if (sessionStorage.getItem('chains')) {
      this.chainValue = JSON.parse(sessionStorage.getItem('chains'))
      let data = {
        chainId: JSON.parse(sessionStorage.getItem('chains'))[0].id
      }
      this.getChartContent(data)
    } else {
      this.getChainlist()
    }
    this.chartHeight = (document.body.clientHeight - 220) / 2
    document.onmouseup = () => {
      window.onmousemove = null
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem('chains')
  },
  methods: {
    isLeaf(data, node) {
      console.log(data)
      console.log(node)
    },
    handlerTreeOperate(type, data, node) {
      const me = this
      console.log(type, type === 'edit')
      console.log(node)
      console.log(data)
    },
    getFilterTreeList(node, resolve) {
      const id = node.data ? node.data.id : '0'
      getModelModelViewTree(id).then(res => {
        console.log(res)
        if (!res) return false
        if (node.level === 0 || (node.level < 2 && res.length === 1)) {
          this.expandedList = [res[0].id]
        }
        if (node.level === 1 && res.length > 0) {
          this.$nextTick(() => {
            if (this.$refs.asyncTree) {
              this.$refs.asyncTree.setCurrentKey(res[0].id)
              this.rightStoreData.chainId = res[0].id
              this.rightStoreData.chainName = res[0].name
              this.getChartContent(this.rightStoreData)
            }
          })
        }
        resolve(res)
      })
    },
    processPerformanceClick() {
      this.$router.push({
        path: '/processPerformance/processPerformance',
        query: { pid: 2 }
      })
    },
    indicatorsOfLibraryClick() {
      this.$router.push({ path: '/analyseWatchCenter/databaseList' })
    },
    // 拖拽---------------------开始
    mouseDownHandleelse(event) {
      this.moveDataelse.x = event.pageX - this.$refs.kongtiao.offsetLeft
      this.moveDataelse.y = event.pageY - this.$refs.kongtiao.offsetTop
      event.currentTarget.style.cursor = 'move'
      window.onmousemove = this.mouseMoveHandleelse
    },
    mouseMoveHandleelse(event) {
      const moveLeft = event.pageX - this.moveDataelse.x + 'px'
      const moveTop = event.pageY - this.moveDataelse.y + 'px'
      this.$refs.kongtiao.style.left = moveLeft
      this.$refs.kongtiao.style.top = moveTop
    },
    mouseUpHandleelse(event) {
      window.onmousemove = null
      event.currentTarget.style.cursor = 'move'
    },
    // 拖拽---------------------结束
    // 设置宽度和高度---------------------开始
    setRealWidthHeight(data) {
      console.log(data)
      if (!data.stagelist.length) return false
      this.$refs.kongtiao.style.width =
        data.stagelist.length * 140 + (data.stagelist.length - 1) * 10 + 'px'
      // this.$refs.kongtiao.style.top = moveTop
    },
    // 设置宽度和高度---------------------结束
    getChainlist() {
      getChainlist({
        release: 'Y'
      }).then(res => {
        console.log(res)
        if (!res) return false
        this.chainValue = res.map((item, index) => {
          item.checked = false
          return item
        })
        console.log(this.chainValue)
        if (this.chainValue.length !== 0) {
          this.chainValue[0].checked = true
          this.chooseChain(this.chainValue[0])
        }
      })
    },
    chooseChain(obj) {
      const self = this
      const arr = this.chainValue.map(item => {
        item.checked = false
        if (item.id === obj.id) {
          item.checked = true
          self.rightStoreData.chainId = JSON.parse(JSON.stringify(item)).id
          self.rightStoreData.chainName = JSON.parse(JSON.stringify(item)).name
        }
        return item
      })
      this.$set(this, 'chainValue', arr)
      this.getChartContent(self.rightStoreData)
    },
    getChartContent(data) {
      getProcessChart({
        id: data.chainId,
        state: 'Y'
      }).then(res => {
        console.log(res)
        if (!res) return false
        this.rightStoreData = res
        this.setRealWidthHeight(res)
      })
    },
    // 工具栏的操作部分
    toolClick(type) {
      if (!this.rightStoreData.chainId) {
        this.$message({
          type: 'warning',
          message: this.pleaseSelecttheFirstValueChainProcessAndThenOperate
        })
        return false
      }
      switch (true) {
        case type === 'zoomin':
          this.storeratio = (this.storeratio * 10 + 1) / 10
          this.$refs.kongtiao.style.transform = 'scale(' + this.storeratio + ')'
          break
        case type === 'zoomout':
          if (this.storeratio === 0.2) {
            this.$message({
              type: 'warning',
              message: this.scaledToTheMinimumCanNotGoAnyLower
            })
            return false
          }
          this.storeratio = (this.storeratio * 10 - 1) / 10
          this.$refs.kongtiao.style.transform = 'scale(' + this.storeratio + ')'
          break
        case type === 'normal':
          this.storeratio = 1
          this.$refs.kongtiao.style.transform = 'scale(' + this.storeratio + ')'
          break
        case type === 'reload':
          this.storeratio = 1
          this.$refs.kongtiao.style.transform = 'scale(' + this.storeratio + ')'
          this.getChartContent(this.rightStoreData)
          break
        case type === 'fullScreen':
          this.isFull = !this.isFull
          break
      }
    },
    // 单击进入详情
    singleClick(item, index, idx) {
      const thet = this
      console.log('====')
      this.curSelectedItem = item.id + 'down' + index + idx
      this.curSelectedId = item.id
      clearTimeout(thet.timer) // 首先要清除定时器
      thet.timer = setTimeout(function() {
        // thet.toPage(item)
      }, 300) // 定时器时间s
    },
    addTScoreClick(item) {
      clearTimeout(this.timer) // 清除定时器，然后在后面直接写双击事件的逻辑
      // this.$confirm(
      //   this.$t('hintText.aboutToEnterTheProcessFrameworkViewPage'),
      //   this.hint,
      //   {
      //     confirmButtonText: this.confirm,
      //     cancelButtonText: this.cancel,
      //     type: 'warning'
      //   }
      // )
      //   .then(() => {
      //     const routeUrl = this.$router.resolve({
      //       path: '/doorCenter/rulesShow',
      //       query: { attrid: item.id }
      //     })
      //     window.open(routeUrl.href, '_blank')
      //   })
      //   .catch(err => {})
      if (item.isRelease && item.isRelease === 'N') {
        this.$message({
          message: this.notBeenPublishedAndCannotBeAccessed,
          type: 'warining'
        })
        return
      }
      this.toPage(item)
    },

    toPage(item) {
      const _this = this
      getCommunityList(
        {
          filters: [
            {
              key: 'modelid',
              value: item.id
            }
          ],
          orderby: 'createon',
          sort: 'desc',
          pageNum: 1,
          pageSize: 5
        },
        1
      ).then(res => {
        console.log(res)
        if (!!res.list && res.list.length > 0) {
          _this
            .$confirm(
              this.$t('hintText.comingToViewTheFlowChartPage'),
              this.hint,
              {
                confirmButtonText: this.confirm,
                cancelButtonText: this.cancel,
                type: 'warning'
              }
            )
            .then(() => {
              let routerUrl = _this.$router.resolve(
                '/processDetails/' + res.list[0].id
              )
              window.open(routerUrl.href, '_blank')
            })
            .catch(err => {})
        } else {
          _this.$message({
            message: this.notBeenPublishedAndCannotBeAccessed,
            type: 'warining'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#edgeToedgeModel {
  background-color: white;
  .tree_node {
    // height: 380px;
    // width: 100%;
    // overflow: auto;
    // /deep/ .el-tree-node>.el-tree-node__children{
    //   overflow: visible;
    // }
    .elTree{
      font-size: 13px;
      /deep/ .el-tree-node.is-current > .el-tree-node__content .custom-tree-node {
        font-weight: 600;
        color: #2d42af;
      }
      /deep/ .custom-tree-node {
        color: #666;
      }
    }
    .custom-tree-node {
      height: 100%;
      position: relative;
      .opertionBtn {
        position: absolute;
        right: 10px;
        top: 0;
        bottom: 0;
        min-width: 35px;
        display: flex;
        display: none;
        justify-content: space-between;
        align-items: center;
        i {
          display: inline-block;
          height: 14px;
          padding: 0;
          margin: 0;
          &:hover {
            background: none;
            font-weight: bold;
          }
        }
      }
      &:hover {
        .opertionBtn {
          display: flex;
        }
      }
    }
    .custom-tree-node {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      .grow {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 70px;
      }
      .add {
        color: $tc5;
        padding: 5px;
        display: none;
        &:hover {
          background: $dc1;
        }
      }
      .del {
        color: $tc4;
        padding: 5px;
        display: none;
        &:hover {
          background: $dc1;
        }
      }
      &:hover {
        .add {
          display: inherit;
        }
        .del {
          display: inherit;
        }
      }
    }
  }
  .firstChain {
    min-height: 30px;
    li {
      line-height: 30px;
      padding: 0 8px;
      font-size: 14px;
      cursor: pointer;
      position: relative;
      .label {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .tools {
        color: #555555;
        display: none;
        position: absolute;
        top: 0;
        right: 10px;
        .el-icon-edit:hover {
          color: #427efc;
          font-weight: bold;
        }
        .el-icon-delete:hover {
          color: #fb1c1c;
          font-weight: bold;
        }
      }
    }
    li:hover {
      .label {
        color: #409eff;
      }
      .tools {
        display: block;
      }
    }
    li.active {
      color: #409eff;
    }
  }
  .paintChart {
    height: calc(100vh - 180px);
    background-color: #e6e6e6;
    border: 1px solid #d2d2d2;
    user-select: none;
    &.fullScreen {
      position: fixed;
      top: 90px;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .tools {
      font-size: 20px;
      color: #8a8a8a;
      height: 40px;
      display: flex;
      justify-content: space-between;
      // line-height: 40px;
      background-color: #fafafa;
      padding-top: 3px;
      .toolss {
        display: flex;
        .tools-item {
          display: flex;
          flex-direction: column;
          height: 40px;
          text-align: center;
          i {
            display: block;
          }
          span {
            display: block;
            font-size: 12px;
          }
        }
      }
      .tools-right {
        line-height: 40px;
      }
      .tools-right .el-button:hover {
        background-color: #fafafa !important;
        color: #2d42af !important;
      }

      .el-button {
        padding: 5px 8px;
        font-size: 12px;
        margin-left: 15px;
        position: relative;
        top: -3px;
      }
    }
    .content {
      padding: 10px;
      height: calc(100% - 44px);
      box-sizing: border-box;
      .chartContent {
        height: 100%;
        background-color: #ffffff;
        position: relative;
        overflow: hidden;
      }
      .realChart {
        position: absolute;
        top: 15%;
        left: 105px;
        transform-origin: left top;
        transform: scale(1);
        .stageContent {
          display: inline-block;
          position: relative;
          left: 0;
          .stageChart {
            width: 140px;
            height: 30px;
            text-align: center;
            line-height: 30px;
            color: #ffffff;
            background-color: #409eff;
            .textContent {
              padding: 0 13px;
              box-sizing: border-box;
            }
            p {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .leftImgPart {
            position: absolute;
            top: 0;
            left: 0;
            height: 0;
            width: 0;
            border: 15px solid #fff;
            border-top-color: transparent;
            border-right-width: 0;
            border-bottom-color: transparent;
            border-left-width: 10px;
          }
          .rightImgPart {
            position: absolute;
            top: 0;
            right: 0;
            height: 0;
            width: 0;
            border: 15px solid #fff;
            border-left-width: 10px;
            border-left-color: transparent;
            border-right-width: 0;
          }
        }
        .stageprocess.active {
          color: #409eff;
          .release{
            color: #409eff;
          }
        }
        .stageprocess {
          width: 140px;
          height: 30px;
          color: #333333;
          display: inline-block;
          position: absolute;
          border-bottom: 1px solid #ff5800;
          .release{
            color: #008000;
          }
          &.borderTop {
            border-top: 1px solid #ff5800;
          }
          p {
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            span {
              width: 16px;
              height: 16px;
              display: inline-block;
              color: #fff;
              text-align: center;
              vertical-align: middle;
              line-height: 16px;
              border-radius: 10px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              background-color: #409eff;
              margin-right: 5px;
            }
          }
        }
        .upNew {
          left: 0px;
          top: -30px;
          p {
            text-align: center;
          }
        }
        .downNew {
          left: 0px;
          top: 30px;
          p {
            text-align: center;
            span {
              color: #ff5800;
              border: 1px solid #ff5800;
              background-color: #fff;
            }
          }
        }
      }
    }
  }
  .rightMenu {
    position: fixed;
    top: 0;
    left: 0;
    padding: 6px 0;
    margin: 0;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    li {
      font-size: 14px;
      padding: 0 20px;
      position: relative;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #606266;
      height: 34px;
      line-height: 34px;
      box-sizing: border-box;
      cursor: pointer;
      &:hover {
        background-color: #f5f7fa;
      }
    }
  }
}
</style>
