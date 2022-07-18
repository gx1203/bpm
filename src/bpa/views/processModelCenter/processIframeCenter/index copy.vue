<template>
  <div class="w100 pos-relative" id="processIframeCenter" ref="iframeCenter">
    <div class="w100 h100" v-show="!showNewFrame">
      <!-- <el-button @click="showProcessTree = true;getProcessTreeChart('7999B5E7EFDB1D3CE053BF1A13AC64F3')">切换</el-button> -->
      <div class="processCount" v-if="showCount">
        <p>
          <span>{{countProcess.totalnum}}</span><br/>流程数目
        </p>
        <hr>
        <p>
          <span>{{countProcess.releasenum}}</span><br/>流程发布数目
        </p>
      </div>
      <iframe ref="iFrame"  v-if="!showProcessTree" class="w100 h100" src="./leftMenu/processFramework/BaseNewPage.html?id=AAA&listid=7D36536AC5DD6356E0530701A8C0D2D1&treeId=79957553BD303978E053BF1A13ACD486&processName=构建愿景和战略&username=付大鹏&processNum=1.0&isRead=yes&page=framework"></iframe>
      <div id="process_tree_wrapper" class="process-tree-wrapper" v-if="showProcessTree">
        <div class="toolbox">
          <el-tooltip class="font22 margin-r5" effect="dark" :content="amplification" placement="top-start">
            <i class="el-icon-zoom-in cursor-pointer vertical-middle" @click="modifyScreen('zoomIn')"></i>
          </el-tooltip>
          <el-tooltip class="font22 margin-r5" effect="dark" :content="$t('narrow')" placement="top-start">
            <i class="el-icon-zoom-out cursor-pointer vertical-middle" @click="modifyScreen('zoomOut')"></i>
          </el-tooltip>
          <el-tooltip class="font22 margin-r5" effect="dark" :content="$t('rotate')" placement="top-start">
            <i class="el-icon-refresh cursor-pointer vertical-middle" @click="modifyScreen('rotate')"></i>
          </el-tooltip>
          <el-tooltip class="font22 margin-r5" effect="dark" :content="$t('fullScreen')" placement="top-start">
            <span class="el-icon-rank cursor-pointer vertical-middle" @click="modifyScreen('fullscreen')"></span>
          </el-tooltip>
          <el-tooltip class="font22 margin-r5" effect="dark" :content="$t('returnList')" placement="top-start">
            <i class="el-icon-back cursor-pointer vertical-middle" @click="modifyScreen('back')"></i>
          </el-tooltip>
        </div>
        <el-scrollbar class="w100 h100">
          <div id="process_tree" ref="processTree" class="process-tree w100" @contextmenu.prevent=""></div>
        </el-scrollbar>
      </div>
    </div>
    <el-scrollbar class="w100 h100 remove-padding" :class="{'full-show': isFull}" v-if="showNewFrame" ref="scrollbar">
      <new-frame v-model="showNewFrame" :scaleTo="scaleTo" :selectClass="selectClass"></new-frame>
      <div class="toolslist">
        <el-tooltip class="item" effect="dark" :content="$t('houseView')" placement="right">
          <i class="fa fa-home" @click.stop="toolclick('home')"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="$t('restore')" placement="right">
          <i class="fa fa-crosshairs" @click.stop="toolclick('restore')"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="amplification" placement="right">
          <i class="fa fa-search-plus" @click.stop="toolclick('zoomin')"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="$t('narrow')" placement="right">
          <i class="fa fa-search-minus" @click.stop="toolclick('zoomout')"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="$t('fullScreen')" placement="right">
          <i class="fa fa-arrows-alt" @click.stop="toolclick('full')"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="$t('classification')" placement="right">
          <el-dropdown trigger="click" @command="command">
            <span class="el-dropdown-link">
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="2">一级</el-dropdown-item>
              <el-dropdown-item command="3">二级</el-dropdown-item>
              <el-dropdown-item command="4">三级</el-dropdown-item>
              <el-dropdown-item command="5">四级</el-dropdown-item>
              <el-dropdown-item command="6">五级</el-dropdown-item>
              <el-dropdown-item command="7">六级</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-tooltip>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
// 引入echarts
import echarts from 'echarts'

import $ from 'jquery'

import { getProcessTree, getProcessCount } from '@/bpa/api/processModelCenter/processIframeCenter'

import { getCommunityList } from '@/bpa/api/processModelCenter/processCommunity'

import newFrame from './pages/newFramework/index.vue'

export default {
  data () {
    return {
      processFrameList: [],
      treeScaleTo: 1,
      showCount: true,
      treeOption: '',
      treeOrient: 'horizontal',
      showProcessTree: false,
      countProcess: {
        totalnum: 0,
        releasenum: 0
      },
      processSelectid: '',
      showNewFrame: false,
      scaleTo: 1,
      isFull: false,
      selectClass: '2',
      amplification:this.$t("amplification"),
    }
  },
  components: {
    newFrame
  },
  computed: {
    orgTreeoptions () {
      let _this = this
      return {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
          formatter (params) {
            let [inputname, outputnam] = [[], []]
            if (params.data.imputlist && params.data.imputlist.length > 0) {
              params.data.imputlist.forEach((obj) => {
                inputname.push(obj.code + obj.name)
              })
              inputname = inputname.join('、')
            }
            if (params.data.outlist && params.data.outlist.length > 0) {
              params.data.outlist.forEach((obj) => {
                outputnam.push(obj.code + obj.name)
              })
              outputnam = outputnam.join('、')
            }
            let res = ''
            if (params.data.name) {
              res = '名称：' + params.data.name
            }
            if ($.trim(inputname)) {
              res += '</br>上游流程：' + inputname
            }
            if ($.trim(outputnam)) {
              res += '</br>下游流程：' + outputnam
            }
            return res
          }
        },
        series: [
          {
            type: 'tree',
            top: '20',
            bottom: '20',
            left: '7%',
            roam: true,
            orient: _this.treeOrient,
            zoom: _this.treeScaleTo,
            scaleLimit: {
              min: 0.8
            },
            expandAndCollapse: false,
            symbol: require('@/bpa/assets/img/enterindex.png'),
            symbolSize: [150, 50],
            symbolRotate: _this.treeOrient === 'vertical' ? -90 : 0,
            label: {
              normal: {
                position: 'inside',
                verticalAlign: 'middle',
                align: 'center',
                offset: _this.treeOrient === 'vertical' ? [0, 10] : [10, 0],
                rotate: _this.treeOrient === 'vertical' ? -90 : 0,
                width: 110,
                fontSize: 12,
                rich: {
                  box: {
                    align: 'center'
                  }
                }
              },
              leaves: {
                position: 'inside',
                verticalAlign: 'middle',
                align: 'center'
              }

            },
            lineStyle: {
              normal: {
                color: '#3692d3',
                width: 2,
                curveness: 0.7
              }
            },
            initialTreeDepth: 6,
            data: _this.processFrameList,
            animationDuration: 150,
            animationDurationUpdate: 550
          }
        ]
      }
    }
  },
  created () {
    // 需要外部调用的方法
    let _this = this
    // 获取组织树
    window['getProcessTree'] = (processid) => {
      _this.showProcessTree = true
      _this.getProcessTreeChart(processid)
      _this.processSelectid = processid
    }
    // 全屏
    window.onFullScreen = () => {
      if (_this.$refs.iframeCenter.getAttribute('class').indexOf('fullEditor') > -1) {
        _this.$refs.iframeCenter.classList.remove('fullEditor')
      } else {
        _this.$refs.iframeCenter.classList.add('fullEditor')
      }
      _this.treeOption.resize()
      if (_this.treeOption) {
        _this.treeOption.clear()
      }
      _this.treeOption.setOption(_this.orgTreeoptions, true)
    }
    // 转成列表视图
    window.revertlist = () => {
      _this.showNewFrame = true
    }
  },
  mounted() {
    if (this.$route.query.attrid) {
      this.processSelectid = this.$route.query.attrid
      this.showProcessTree = true
      this.getProcessTreeChart(this.$route.query.attrid)
    }
    this.getprocessCount()
  },
  methods: {
    modifyScreen (type) {
      let _this = this
      if (_this.treeOption) {
        _this.treeOption.clear()
      }
      switch (true) {
        case type === 'zoomIn' :
          _this.treeScaleTo = (_this.treeScaleTo * 100 + 3) / 100
          _this.treeOption.setOption(_this.orgTreeoptions, true)
          break
        case type === 'zoomOut' :
          _this.treeScaleTo = (_this.treeScaleTo * 100 - 3) / 100
          _this.treeOption.setOption(_this.orgTreeoptions, true)
          break
        case type === 'rotate' :
          if (_this.treeOrient === 'vertical') {
            _this.treeOrient = 'horizontal'
            _this.$refs.processTree.style.height = _this.processFrameList[0].children.length * 80 + 'px'
            _this.$refs.processTree.style.width = '100%'
          } else {
            _this.treeOrient = 'vertical'
            _this.$refs.processTree.style.height = '100%'
            _this.$refs.processTree.style.width = _this.processFrameList[0].children.length * 80 + 'px'
          }
          _this.treeOption.resize()
          _this.treeOption.setOption(_this.orgTreeoptions, true)
          break
        case type === 'fullscreen' :
          window.onFullScreen()
          break
        case type === 'back' :
          _this.showProcessTree = false
          break
      }
    },
    // 统计流程树数目
    getprocessCount () {
      let _this = this
      getProcessCount().then(res => {
        if (!res) return false
        _this.countProcess = {
          totalnum: res.totalnum,
          releasenum: res.releasenum
        }
      })
    },
    async getProcessData (processid, status) {
      let response = await getProcessTree({'id': processid, 'state': status})
      return new Promise((resolve, reject) => {
        resolve(response)
      })
    },
    async getProcessTreeChart (processid) {
      let _this = this
      let response = await _this.getProcessData(processid, '0')
      _this.$refs.processTree.style.height = response.children.length * 80 + 'px'
      _this.treeOption = echarts.init(_this.$refs.processTree)
      let index = 0
      for (let i = 0; i < response.children.length; i++) {
        if (!!response.children[i].children && response.children[i].children.length > 0) {
          index = i
          break
        }
      }
      let res = await Promise.all([this.initFrameData([response]), this.initFrameData(response.children), this.initFrameData(response.children[index].children)])
      console.log(res)
      // res[1][0].children = res[2]
      // res[0][0].children = res[1]
      _this.processFrameList = res[0]
      if (_this.treeOption) {
        _this.treeOption.resize()
        _this.treeOption.clear()
      }
      _this.treeOption.setOption(_this.orgTreeoptions, true)
      // 点击组织树
      _this.treeOption.on('click', async params => {
        if (!params.data.id || !params.data.isparent) return false
        if (!params.data.children) {
          let response = await _this.getProcessData(params.data.id, params.data.level)
          let res = await this.initFrameData(response.children)
          _this.lookforsameId(_this.processFrameList, params.data.id, res, 0)
        } else {
          _this.lookforsameId(_this.processFrameList, params.data.id, [], params.data.children.length)
        }
        if (_this.treeOption) {
          _this.treeOption.clear()
        }
        _this.treeOption.setOption(_this.orgTreeoptions, true)
      })
      // 右击组织树
      _this.treeOption.on('contextmenu', function (parmas) {
        if (parmas.data.id) {
          console.log(111)
          getCommunityList({
            'filters': [{
              'key': 'modelid',
              'value': parmas.data.id
            }],
            'orderby': 'createon',
            'sort': 'desc',
            'pageNum': 1,
            'pageSize': 5
          },1).then(res => {
            console.log(res)
            if (!!res.list && res.list.length > 0) {
              _this.$confirm(this.$t('hintText.WhetherToViewTheProcessCommunity'), this.$t('hintText.hint'), {
                confirmButtonText: this.$t('confirm'),
                cancelButtonText: this.$t('cancel'),
                type: 'warning'
              }).then(() => {
                _this.$router.push('/processDetails/' + res.list[0].id)
              }).catch(err => {})
            } else {
              _this.$message({
                message: this.$t('hintText.notBeenPublishedAndCannotBeAccessed'),
                type: 'warining'
              })
            }
          })
        }
      })
    },
    // 判断是否有上下级, 上下游流程
    initFrameData (initdata) {
      console.log(initdata)
      if (!initdata) return false
      initdata.forEach((obj) => {
        obj.collapsed = false
        obj.name = obj.name.replace(/[ ]/g, '')
        obj.name = obj.name.replace(/[\r\n]/g, '')
        if (obj.name.length > 10 && obj.name.indexOf('\n') == -1) {
          obj.name = obj.name.substr(0, 9) + '\n' + obj.name.substr(9)
        }
        if (obj.level == '1') {
          obj.symbol = 'image://' + require('@/bpa/assets/img/enterindex.png')
          obj.label = {
            position: ['45%', '45%']
          }
        } else if (obj.level == '2') {
          obj.label = {normal: {offset: [18, 0]}}
          if (obj.isparent) {
            if (obj.imputlist && obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise01all.png')
              console.log(obj.symbol)
            } else if (obj.imputlist && !obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise01in_c.png')
            } else if (!obj.imputlist && obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise01out_c.png')
            } else if (!obj.imputlist && !obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise01c.png')
            }
          } else {
            if (obj.imputlist && obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise01inout.png')
            } else if (obj.imputlist && !obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise01in.png')
            } else if (!obj.imputlist && obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise01inout.png')
            } else if (!obj.imputlist && !obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise01.png')
            }
          }
        } else if (obj.level == '3') {
          if (obj.isparent) {
            if (obj.imputlist && obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise02all.png')
            } else if (obj.imputlist && !obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise02in_c.png')
            } else if (!obj.imputlist && obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise02out_c.png')
            }
            if (!obj.imputlist && !obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise02c.png')
            }
          } else {
            if (obj.imputlist && obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise02inout.png')
            } else if (obj.imputlist && !obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise02in.png')
            } else if (!obj.imputlist && obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise02inout.png')
            } else if (!obj.imputlist && !obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise02.png')
            }
          }
        } else if (obj.level == '4') {
          if (obj.isparent) {
            if (obj.imputlist && obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise03all.png')
            } else if (obj.imputlist && !obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise03in_c.png')
            } else if (!obj.imputlist && obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise03out_c.png')
            } else if (!obj.imputlist && !obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise03c.png')
            }
          } else {
            if (obj.imputlist && obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise03inout.png')
            } else if (obj.imputlist && !obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise03in.png')
            } else if (!obj.imputlist && obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise03inout.png')
            } else if (!obj.imputlist && !obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise03.png')
            }
          }
        } else if (obj.level == '5') {
          if (obj.isparent) {
            if (obj.imputlist && obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise04all.png')
            } else if (obj.imputlist && !obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise04in_c.png')
            } else if (!obj.imputlist && obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise04out_c.png')
            } else if (!obj.imputlist && !obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise04c.png')
            }
          } else {
            if (obj.imputlist && obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise04inout.png')
            } else if (obj.imputlist && !obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise04in.png')
            } else if (!obj.imputlist && obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise04inout.png')
            } else if (!obj.imputlist && !obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise04.png')
            }
          }
        } else if (obj.level == '6') {
          if (obj.isparent) {
            if (obj.imputlist && obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise05all.png')
            } else if (obj.imputlist && !obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise05in_c.png')
            } else if (!obj.imputlist && obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise05out_c.png')
            } else if (!obj.imputlist && !obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise05c.png')
            }
          } else {
            if (obj.imputlist && obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise05inout.png')
            } else if (obj.imputlist && !obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise05in.png')
            } else if (!obj.imputlist && obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise05inout.png')
            } else if (!obj.imputlist && !obj.outlist) {
              obj.symbol = 'image://' + require('@/bpa/assets/img/enterprise05.png')
            }
          }
        }
      })
      return new Promise((resolve, reject) => {
        resolve(initdata)
      })
    },
    // 寻找id
    lookforsameId (initdata, id, children, length) {
      console.log(initdata)
      initdata.forEach((obj) => {
        if (obj.id === id) {
          if (length > 0) {
            obj.collapsed = !obj.collapsed
            return false
          }
          obj.collapsed = false
          obj.children = children
          return false
        } else if (obj.children && obj.children.length > 0) {
          return this.lookforsameId(obj.children, id, children, length)
        }
      })
    },
    // 工具
    toolclick(type) {
      let self = this
      switch (true) {
        case type === 'restore':
          self.scaleTo = 1
          break
        case type === 'zoomin':
          self.scaleTo = (self.scaleTo * 1000 + 50) / 1000
          break
        case type === 'zoomout':
          console.log(self.scaleTo)
          if (self.scaleTo === 0.1) {
            self.$message({
              type: 'warning',
              message: this.$t('hintText.scaledToTheMinimumCanNotGoAnyLower1')
            })
            return false
          }
          self.scaleTo = (self.scaleTo * 1000 - 50) / 1000
          break
        case type === 'full':
          this.isFull = !this.isFull
          break
        case type === 'home':
          this.isFull = false
          this.scaleTo = 1
          this.showNewFrame = false
          break
      }
      this.$nextTick(() => {
        this.$refs.scrollbar.update()
      })
    },
    command (data) {
      this.selectClass = data
    }
  }
}
</script>

<style lang="scss" scoped>
#processIframeCenter{
  height: calc(100vh - 160px);
  .processCount {
    position: absolute;
    top: 20px;
    right: 15px;
    padding: 8px 8px 15px 8px;
    background-color: #fff;
    margin: 0;
    left: auto;
    border: 1px solid #97a7a7;
    z-index: 999;
    p {
      margin-bottom: 0;
      text-align: center;
      font-size: 12px;
      span {
        color: #4b7486;
        font-size: 18px;
        line-height: 36px;
        font-weight: bold;
      }
      hr {
        margin: 20px 10px 10px;
        border-color: #e8edf0;
      }
    }
  }
  #process_tree_wrapper{
    height: calc(100vh - 160px);
    .el-scrollbar{
      height: calc(100vh - 185px);
      /deep/ .el-scrollbar__view {
        height: 100%;
      }
    }
  }
  &.fullEditor{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%!important;
    z-index: 999;
    background-color: #fff;
    #process_tree_wrapper{
      height: 100%!important;
      .el-scrollbar{
        height: calc(100vh - 25px)!important;
      }
    }
  }
  .el-scrollbar.remove-padding{
    /deep/ .el-scrollbar__wrap{
      padding: 0;
    }
  }
  .toolslist {
    position: absolute;
    bottom: 15px;
    right: 15px;
    i {
      text-align: center;
      font-size: 26px;
      color: #8994a0;
      cursor: pointer;
      display: block;
      margin-top: 10px;
    }
    i:nth-of-type(4) {
      font-size: 22px;
    }
  }
  .full-show {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
  }
}
</style>
