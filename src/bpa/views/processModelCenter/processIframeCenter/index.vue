<template>
  <div class="w100 pos-relative pageWrap" id="processIframeCenter" ref="iframeCenter">
    <div class="w100 h100" v-show="!showNewFrame">
      <!-- <el-button @click="showProcessTree = true;getProcessTreeChart('7999B5E7EFDB1D3CE053BF1A13AC64F3')">切换</el-button> -->
      <!-- <div class="processCount" v-if="showCount">
        <p>
          <span>{{ countProcess.totalnum }}</span
          ><br />{{ $t('numberOfProcesses2') }}
        </p>
        <hr />
        <p>
          <span>{{ countProcess.releasenum }}</span
          ><br />{{ $t('numberOfProcessReleases') }}
        </p>
      </div> -->
      <!-- 框架图部分 -->
      <div
        ref="iFrame"
        v-if="!showProcessTree"
        class="paintChart"
        :class="{ fullScreen: isFull, '': !isFull }"
      >
        <div class="tools">
          <el-tooltip
            class="margin-l10 cursor-pointer"
            effect="dark"
            :content="$t('amplification')"
            placement="top"
          >
            <i class="el-icon-zoom-in" @click="toolIframeClick('zoomin')"></i>
          </el-tooltip>
          <el-tooltip
            class="margin-l10 cursor-pointer"
            effect="dark"
            :content="$t('narrow')"
            placement="top"
          >
            <i class="el-icon-zoom-out" @click="toolIframeClick('zoomout')"></i>
          </el-tooltip>
          <el-tooltip
            class="margin-l10 cursor-pointer"
            effect="dark"
            :content="$t('normalProportion')"
            placement="top"
          >
            <i
              class="el-icon-help"
              aria-hidden="true"
              @click="toolIframeClick('normal')"
            ></i>
          </el-tooltip>
          <el-tooltip
            class="margin-l10 cursor-pointer"
            effect="dark"
            :content="$t('listView')"
            placement="top"
          >
            <i class="el-icon-s-operation" @click="toolIframeClick('list')"></i>
          </el-tooltip>
          <el-tooltip
            class="margin-l10 cursor-pointer"
            effect="dark"
            :content="isFull ? reduction : fullScreen"
            placement="top"
          >
            <i
              class="el-icon-aim"
              aria-hidden="true"
              @click="toolIframeClick('fullScreen')"
            ></i>
          </el-tooltip>
        </div>
        <div class="content">
          <div class="chartContent">
            <frame-show
              class="div-center"
              ref="kongtiao"
              :clickable="false"
              @treeclick="treeclick"
            ></frame-show>
          </div>
        </div>
      </div>

      <!-- 树形图部分 -->
      <div
        id="process_tree_wrapper"
        class="process-tree-wrapper"
        v-if="showProcessTree"
      >
        <div class="toolbox">
          <!-- <el-tooltip class="font22 margin-r5" effect="dark" :content="$t('amplification')" placement="top-start">
            <i class="el-icon-zoom-in cursor-pointer vertical-middle" @click="modifyScreen('zoomIn')"></i>
          </el-tooltip>
          <el-tooltip class="font22 margin-r5" effect="dark" :content="$t('narrow')" placement="top-start">
            <i class="el-icon-zoom-out cursor-pointer vertical-middle" @click="modifyScreen('zoomOut')"></i>
          </el-tooltip>
          <el-tooltip class="font22 margin-r5" effect="dark" :content="$t('rotate')" placement="top-start">
            <i class="el-icon-refresh cursor-pointer vertical-middle" @click="modifyScreen('rotate')"></i>
          </el-tooltip> -->
          <el-tooltip
            class="font22 margin-r5"
            effect="dark"
            :content="$t('fullScreen')"
            placement="top-start"
          >
            <span
              class="el-icon-rank cursor-pointer vertical-middle"
              @click="modifyScreen('fullscreen')"
            ></span>
          </el-tooltip>
          <el-tooltip
            class="font22 margin-r5"
            effect="dark"
            :content="$t('returnList')"
            placement="top-start"
          >
            <i
              class="el-icon-back cursor-pointer vertical-middle"
              @click="modifyScreen('back')"
            ></i>
          </el-tooltip>
        </div>
        <!-- <el-scrollbar  :class="[processUrl?'el-scrollbara':'el-scrollbars']">
          <div id="process_tree" ref="processTree" class="process-tree w100" @contextmenu.prevent=""></div>
        </el-scrollbar>
          <div v-if="processUrl" style="position: fixed; bottom: 70%; font-size:30px;  right: 2%;" @click="processUrl=''"><i class="el-icon-close"></i></div>
          <div v-if="processUrl" style="width: 100%; height: 100%; margin: 10px;" >
           <div class="toolslist">
              <el-tooltip class="item" effect="dark" :content="$t('restore')" placement="right">
                <i class="fa fa-crosshairs" @click.stop="toolclicks('restore')"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('amplification')" placement="right">
                <i class="fa fa-search-plus" @click.stop="toolclicks('zoomin')"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('narrow')" placement="right">
                <i class="fa fa-search-minus" @click.stop="toolclicks('zoomout')"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('fullScreen')" placement="right">
                <i class="fa fa-arrows-alt" @click.stop="toolclicks('full')"></i>
              </el-tooltip>
            </div>
          <img  ref="processImg" :src="processUrl" style=" width: 100%; height: 100%;  border: 1px solid #666;" />
          </div> -->

        <rulesShow :attrid="attrid" :displaymode="displaymode"></rulesShow>
      </div>
    </div>
    <!-- 列表视图部分 -->
    <el-scrollbar
      class="w100 h100 remove-padding"
      :class="{ 'full-show': isFull }"
      v-if="showNewFrame"
      ref="scrollbar"
    >
      <new-frame
        v-model="showNewFrame"
        :scaleTo="scaleTo"
        :selectClass="selectClass"
      ></new-frame>
      <div class="toolslist">
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('houseView')"
          placement="right"
        >
          <i
            class="el-icon-location"
            v-if="showHouseBtn"
            @click.stop="toolclick('home')"
          ></i>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('normalProportion')"
          placement="right"
        >
          <i class="el-icon-help" @click.stop="toolclick('restore')"></i>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('amplification')"
          placement="right"
        >
          <i class="el-icon-zoom-in" @click.stop="toolclick('zoomin')"></i>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('narrow')"
          placement="right"
        >
          <i class="el-icon-zoom-out" @click.stop="toolclick('zoomout')"></i>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('fullScreen')"
          placement="right"
        >
          <i class="el-icon-aim" @click.stop="toolclick('full')"></i>
        </el-tooltip>
        <!-- <el-tooltip class="item" effect="dark" :content="$t('classification')" placement="right">
          <el-dropdown trigger="click" @command="command">
            <span class="el-dropdown-link">
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="2">{{$t('levelOne')}}</el-dropdown-item>
              <el-dropdown-item command="3">{{$t('levelTwo')}}</el-dropdown-item>
              <el-dropdown-item command="4">{{$t('levelThree')}}</el-dropdown-item>
              <el-dropdown-item command="5">{{$t('levelFour')}}</el-dropdown-item>
              <el-dropdown-item command="6">{{$t('levelFive')}}</el-dropdown-item>
              <el-dropdown-item command="7">{{$t('levelSix')}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-tooltip> -->
      </div>
      <div class="leveBut">
        <el-button
          @click="selectLeve('2')"
          :class="{ isActive: selectClass === '2' }"
          type="primary"
          >{{ $t('levelOne') }}
        </el-button>
        <el-button
          @click="selectLeve('3')"
          :class="{ isActive: selectClass === '3' }"
          type="primary"
          >{{ $t('levelTwo') }}
        </el-button>
        <el-button
          @click="selectLeve('4')"
          :class="{ isActive: selectClass === '4' }"
          type="primary"
          >{{ $t('levelThree') }}
        </el-button>
        <el-button
          @click="selectLeve('5')"
          :class="{ isActive: selectClass === '5' }"
          type="primary"
          >{{ $t('levelFour') }}
        </el-button>
        <el-button
          @click="selectLeve('6')"
          :class="{ isActive: selectClass === '6' }"
          type="primary"
          >{{ $t('levelFive') }}
        </el-button>
        <el-button
          @click="selectLeve('7')"
          :class="{ isActive: selectClass === '7' }"
          type="primary"
          >{{ $t('levelSix') }}
        </el-button>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
// 引入echarts
import echarts from 'echarts'

import $ from 'jquery'

import {
  getProcessTree,
  getProcessCount
} from '@/bpa/api/processModelCenter/processIframeCenter'

import {
  getCommunityList,
  getWordJpg
} from '@/bpa/api/processModelCenter/processCommunity'
import rulesShow from '@/bpa/views/doorCenter/rulesShow'
import newFrame from './pages/newFramework/index.vue'
// import frameShow from '@/bpa/components/NewProcessFrame'
import frameShow from '@/bpa/components/processFrameShow2.vue'

export default {
  data() {
    return {
      attrid: '',
      displaymode: '',
      processUrl: '',
      drawerclick: true,
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
      scaleTos: 100,
      processSelectid: '',
      showNewFrame: false,
      scaleTo: 1,
      isFull: false,
      selectClass: '7',
      storeratio: 1,
      showProcessEditor: false,
      iframeSrc: '',
      bpmid: 'A6C5951404EA3DABE0531701A8C05653',
      listid: '7D2E5C8AED566BC0E0530701A8C0EDC9',
      reduction: this.$t('reduction'),
      fullScreen: this.$t('fullScreen')
    }
  },
  props: {
    showHouseBtn: {
      type: Boolean,
      default: true
    }
  },
  components: {
    newFrame,
    frameShow,
    rulesShow
  },
  computed: {
    orgTreeoptions() {
      let _this = this
      return {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
          formatter(params) {
            let [inputname, outputnam] = [[], []]
            if (params.data.imputlist && params.data.imputlist.length > 0) {
              params.data.imputlist.forEach(obj => {
                inputname.push(obj.code + obj.name)
              })
              inputname = inputname.join('、')
            }
            if (params.data.outlist && params.data.outlist.length > 0) {
              params.data.outlist.forEach(obj => {
                outputnam.push(obj.code + obj.name)
              })
              outputnam = outputnam.join('、')
            }
            let res = ''
            if (params.data.name) {
              res = `${_this.$t('name')}：${params.data.name}`
              // res = '名称：' + params.data.name
            }
            if ($.trim(inputname)) {
              res += `</br>${_this.$t('upstreamProcess')}：${inputname}`
              // res += '</br>上游流程：' + inputname
            }
            if ($.trim(outputnam)) {
              res += `</br>${_this.$t('downstreamProcess')}：${inputname}`
              // res += '</br>下游流程：' + outputnam
            }
            return res
          }
        },
        series: [
          {
            type: 'tree',
            top: '20',
            bottom: '20',
            left: '30%',
            roam: true,
            orient: _this.treeOrient,
            zoom: _this.treeScaleTo,
            scaleLimit: {
              min: 0.7
            },
            expandAndCollapse: false,
            symbol: require('@/assets/img/enterindex.png'),
            symbolSize: [170, 50],
            symbolRotate: _this.treeOrient === 'vertical' ? -90 : 0,
            label: {
              normal: {
                position: 'inside',
                verticalAlign: 'middle',
                // show:true,
                // padding: [18, 28, 18, 32],
                // backgroundColor:'#459df5',
                align: 'center',
                offset: _this.treeOrient === 'vertical' ? [0, 30] : [10, 0],
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
                curveness: 0.8
              }
            },
            initialTreeDepth: 4,
            data: _this.processFrameList,
            animationDuration: 150,
            animationDurationUpdate: 550
          }
        ]
      }
    },
    host() {
      return process.env.HOST_URL
    },
    html() {
      return process.env.HTML_URL
    }
  },
  created() {
    // 需要外部调用的方法
    let _this = this
    // 获取组织树
    window['getProcessTree'] = processid => {
      _this.showProcessTree = true
      _this.getProcessTreeChart(processid)
      _this.processSelectid = processid
    }
    // 全屏
    window.onFullScreen = () => {
      if (
        _this.$refs.iframeCenter.getAttribute('class').indexOf('fullEditor') >
        -1
      ) {
        _this.$refs.iframeCenter.classList.remove('fullEditor')
      } else {
        _this.$refs.iframeCenter.classList.add('fullEditor')
      }
      if (!_this.showProcessTree) {
        return false
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
      console.log(this.showProcessTree)
      this.getProcessTreeChart(this.$route.query.attrid)
    }
    // this.getprocessCount()
  },
  methods: {
    // 操作按钮
    toolclicks(type) {
      console.log('typetype', type)
      let self = this
      switch (true) {
        case type === 'restore':
          self.scaleTos = 100
          this.$refs.processImg.style = 'height:' + self.scaleTo + '%;'
          this.$refs.processImg.style = 'width:' + self.scaleTo + '%;'
          break
        case type === 'zoomin':
          self.scaleTo += 5
          this.$refs.processImg.style = 'height:' + self.scaleTo + '%;'
          this.$refs.processImg.style = 'width:' + self.scaleTo + '%;'
          break
        case type === 'zoomout':
          self.scaleTo -= 5
          this.$refs.processImg.style = 'height:' + self.scaleTo + '%;'
          this.$refs.processImg.style = 'width:' + self.scaleTo + '%;'
          break
        case type === 'full':
          this.isFull = !this.isFull
          break
        // case type === 'print':
        //   window.open(
        //     self.host +
        //       self.html +
        //       '/leftMenu/printpreview.html?id=' +
        //       self.processProps2.bpmid +
        //       '&listid=' +
        //       self.processProps.listid
        //   )
        //   break
        // case type === 'eye':
        //   window.open(
        //     self.host +
        //       self.html +
        //       '/leftMenu/BaseNewPage.html?id=' +
        //       self.processProps2.bpmid +
        //       '&listid=' +
        //       self.processProps.listid + '&isReadAttr=true'
        //   )
        // break
      }
    },
    // 1111111111111111
    modifyScreen(type) {
      let _this = this
      if (_this.treeOption) {
        _this.treeOption.clear()
      }
      switch (true) {
        case type === 'zoomIn':
          _this.treeScaleTo = (_this.treeScaleTo * 100 + 3) / 100
          _this.treeOption.setOption(_this.orgTreeoptions, true)
          break
        case type === 'zoomOut':
          _this.treeScaleTo = (_this.treeScaleTo * 100 - 3) / 100
          _this.treeOption.setOption(_this.orgTreeoptions, true)
          break
        case type === 'rotate':
          if (_this.treeOrient === 'vertical') {
            _this.treeOrient = 'horizontal'
            _this.$refs.processTree.style.height =
              _this.processFrameList[0].children.length * 80 + 'px'
            _this.$refs.processTree.style.width = '100%'
          } else {
            _this.treeOrient = 'vertical'
            _this.$refs.processTree.style.height = '100%'
            _this.$refs.processTree.style.width =
              _this.processFrameList[0].children.length * 80 + 'px'
          }
          _this.treeOption.resize()
          _this.treeOption.setOption(_this.orgTreeoptions, true)
          break
        case type === 'fullscreen':
          window.onFullScreen()
          break
        case type === 'back':
          _this.showProcessTree = false
          break
        case type === 'editorAPQC':
          window.onFullScreen()
          break
      }
    },
    // 统计流程树数目
    getprocessCount() {
      let _this = this
      getProcessCount().then(res => {
        if (!res) return false
        _this.countProcess = {
          totalnum: res.totalnum,
          releasenum: res.releasenum
        }
      })
    },
    async getProcessData(processid, status) {
      let response = await getProcessTree({ id: processid, state: status })
      return new Promise((resolve, reject) => {
        resolve(response)
      })
    },
    async getProcessTreeChart(processid) {
      let _this = this
      let response = await _this.getProcessData(processid, '0')
      _this.$refs.processTree.style.height =
        response.children.length * 80 + 'px'
      _this.treeOption = echarts.init(_this.$refs.processTree)
      let index = 0
      for (let i = 0; i < response.children.length; i++) {
        if (
          !!response.children[i].children &&
          response.children[i].children.length > 0
        ) {
          index = i
          break
        }
      }
      let res = await Promise.all([
        this.initFrameData([response]),
        this.initFrameData(response.children),
        this.initFrameData(
          response.children && response.children.length > 0
            ? response.children[index].children
            : null
        )
      ])
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
        if (!params.data.id || !params.data.isparent) {
          console.log('左键')
          console.log('params.dataparams.dataparams.data', params.data)

          getWordJpg({
            id: params.data.releaseId,
            json: '',
            listid: params.data.listid,
            name: '',
            num: '',
            version: params.data.version,
            userid: JSON.parse(
              localStorage.getItem('portalCurrentUserInfo') || {}
            ).name
          }).then(res => {
            if (!res) return false
            if (this.processUrl == res.url) {
              this.processUrl = ''
              return
            }
            this.processUrl = res.url
          })
          return
        }
        console.log(params.data.children)
        if (!params.data.children) {
          let response = await _this.getProcessData(
            params.data.id,
            params.data.level
          )
          console.log()
          let res = await this.initFrameData(response.children)
          _this.lookforsameId(_this.processFrameList, params.data.id, res, 0)
        } else {
          this.processUrl = ''
          _this.lookforsameId(
            _this.processFrameList,
            params.data.id,
            [],
            params.data.children.length
          )
        }
        if (_this.treeOption) {
          _this.treeOption.clear()
        }
        _this.treeOption.setOption(_this.orgTreeoptions, true)
      })
      // 右击组织树
      _this.treeOption.on('contextmenu', function(parmas) {
        if (parmas.data.id) {
          console.log(111)
          getCommunityList(
            {
              filters: [
                {
                  key: 'modelid',
                  value: parmas.data.id
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
                  this.$t('hintText.WhetherToViewTheProcessCommunity'),
                  this.$t('hintText.hint'),
                  {
                    confirmButtonText: this.$t('confirm'),
                    cancelButtonText: this.$t('cancel'),
                    type: 'warning'
                  }
                )
                .then(() => {
                  _this.$router.push(
                    '/processDetails/' +
                      res.list[0].id +
                      '/' +
                      res.list[0].listid +
                      '/' +
                      res.list[0].version
                  )
                })
                .catch(err => {})
            } else {
              _this.$message({
                message: this.$t(
                  'hintText.notBeenPublishedAndCannotBeAccessed'
                ),
                type: 'warining'
              })
            }
          })
        }
      })
    },
    getBase64Image(img) {
      var canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      var ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, img.width, img.height)
      var ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
      var dataURL = canvas.toDataURL('image/' + ext)
      return dataURL
    },
    // 判断是否有上下级, 上下游流程
    initFrameData(initdata) {
      if (!initdata) return false
      initdata.forEach(obj => {
        console.log(obj)
        obj.collapsed = false
        obj.name = obj.name.replace(/[ ]/g, '')
        obj.name = obj.name.replace(/[\r\n]/g, '')
        if (obj.name.length > 10 && obj.name.indexOf('\n') == -1) {
          obj.name = obj.name.substr(0, 9) + '\n' + obj.name.substr(9)
        }
        console.log('objobjobj', obj)
        if (obj.level == '1') {
          obj.symbol =
            'image://' + require('../../../../assets/img/enterindex.png')
          // obj.symbol = '../../../../assets/img/enterindex.png'
          obj.label = {
            position: ['45%', '45%']
          }
        } else if (obj.level == '2') {
          obj.label = { normal: { offset: [18, 0] } }
          if (obj.isparent) {
            if (obj.imputlist && obj.outlist) {
              obj.symbol =
                'image://' +
                require('../../../../assets/img/enterprise01all.png')
              // obj.symbol = '../../../../assets/img/enterprise01all.png'
              console.log('obj.symbolobj.symbolobj.symbol', obj.symbol)
            } else if (obj.imputlist && !obj.outlist) {
              obj.symbol =
                'image://' +
                require('../../../../assets/img/enterprise01in_c.png')
              // obj.symbol = '../../../../assets/img/enterprise01in_c.png'
            } else if (!obj.imputlist && obj.outlist) {
              obj.symbol =
                'image://' +
                require('../../../../assets/img/enterprise01out_c.png')
              // obj.symbol = '../../../../assets/img/enterprise01out_c.png'
            } else if (!obj.imputlist && !obj.outlist) {
              obj.symbol =
                'image://' + require('../../../../assets/img/enterprise01c.png')
              //  obj.symbol = '../../../../assets/img/enterprise01c.png'
            }
          } else {
            if (obj.imputlist && obj.outlist) {
              obj.symbol =
                'image://' +
                require('../../../../assets/img/enterprise01inout.png')
              // obj.symbol = '../../../../assets/img/enterprise01inout.png'
            } else if (obj.imputlist && !obj.outlist) {
              obj.symbol =
                'image://' +
                require('../../../../assets/img/enterprise01in.png')
              // obj.symbol = '../../../../assets/img/enterprise01in.png'
            } else if (!obj.imputlist && obj.outlist) {
              obj.symbol =
                'image://' +
                require('../../../../assets/img/enterprise01out.png')
              // obj.symbol = '../../../../assets/img/enterprise01out.png'
            } else if (!obj.imputlist && !obj.outlist) {
              obj.symbol =
                'image://' + require('../../../../assets/img/enterprise01.png')
              console.log('mmp')
              // obj.symbol = '../../../../assets/img/enterprise01.png'
            }
          }
        } else if (obj.level == '3') {
          if (obj.isparent) {
            if (obj.imputlist && obj.outlist) {
              obj.symbol =
                'image://' +
                require('../../../../assets/img/enterprise02all.png')
              // obj.symbol = '../../../../assets/img/enterprise02all.png'
            } else if (obj.imputlist && !obj.outlist) {
              obj.symbol =
                'image://' +
                require('../../../../assets/img/enterprise02in_c.png')
              // obj.symbol = '../../../../assets/img/enterprise02in_c.png'
              enterprise02all
            } else if (!obj.imputlist && obj.outlist) {
              obj.symbol =
                'image://' +
                require('../../../../assets/img/enterprise02out_c.png')
              // obj.symbol = '../../../../assets/img/enterprise02out_c.png'
            }
            if (!obj.imputlist && !obj.outlist) {
              obj.symbol =
                'image://' + require('../../../../assets/img/enterprise02c.png')
              // obj.symbol = '../../../../assets/img/enterprise02c.png'
            }
          } else {
            if (obj.imputlist && obj.outlist) {
              obj.symbol =
                'image://' +
                require('../../../../assets/img/enterprise02inout.png')
              // obj.symbol = '../../../../assets/img/enterprise02inout.png'
            } else if (obj.imputlist && !obj.outlist) {
              obj.symbol =
                'image://' +
                require('../../../../assets/img/enterprise02in.png')
              // obj.symbol = '../../../../assets/img/enterprise02in.png'
            } else if (!obj.imputlist && obj.outlist) {
              obj.symbol =
                'image://' +
                require('../../../../assets/img/enterprise02out.png')
              // obj.symbol = '../../../../assets/img/enterprise02out.png'
            } else if (!obj.imputlist && !obj.outlist) {
              obj.symbol =
                'image://' + require('../../../../assets/img/enterprise02.png')
              // obj.symbol = '../../../../assets/img/enterprise02.png'
            }
          }
        } else if (obj.level == '4') {
          if (obj.isparent) {
            if (obj.imputlist && obj.outlist) {
              obj.symbol =
                'image://' +
                require('../../../../assets/img/enterprise03all.png')
              // obj.symbol = '../../../../assets/img/enterprise03all.png'
            } else if (obj.imputlist && !obj.outlist) {
              obj.symbol =
                'image://' +
                require('../../../../assets/img/enterprise03in_c.png')
              // obj.symbol = '../../../../assets/img/enterprise03in_c.png'
            } else if (!obj.imputlist && obj.outlist) {
              obj.symbol =
                'image://' +
                require('../../../../assets/img/enterprise03out_c.png')
              // obj.symbol = '../../../../assets/img/enterprise03out_c.png'
            } else if (!obj.imputlist && !obj.outlist) {
              obj.symbol =
                'image://' + require('../../../../assets/img/enterprise03c.png')
              // obj.symbol = '../../../../assets/img/enterprise03c.png'
            }
          } else {
            if (obj.imputlist && obj.outlist) {
              obj.symbol =
                'image://' +
                require('../../../../assets/img/enterprise03inout.png')
              // obj.symbol = '../../../../assets/img/enterprise03inout.png'
            } else if (obj.imputlist && !obj.outlist) {
              obj.symbol =
                'image://' +
                require('../../../../assets/img/enterprise03in.png')
              // obj.symbol = '../../../../assets/img/enterprise03in.png'
            } else if (!obj.imputlist && obj.outlist) {
              obj.symbol =
                'image://' +
                require('../../../../assets/img/enterprise03out.png')
              // obj.symbol = '../../../../assets/img/enterprise03out.png'
            } else if (!obj.imputlist && !obj.outlist) {
              obj.symbol =
                'image://' + require('../../../../assets/img/enterprise03.png')
              // obj.symbol = '../../../../assets/img/enterprise03.png'
            }
          }
        } else if (obj.level == '5') {
          if (obj.isparent) {
            if (obj.imputlist && obj.outlist) {
              obj.symbol =
                'image://' +
                require('../../../../assets/img/enterprise04all.png')
              // obj.symbol = '../../../../assets/img/enterprise04all.png'
            } else if (obj.imputlist && !obj.outlist) {
              obj.symbol =
                'image://' +
                require('../../../../assets/img/enterprise04in_c.png')
              // obj.symbol = '../../../../assets/img/enterprise04in_c.png'
            } else if (!obj.imputlist && obj.outlist) {
              obj.symbol =
                'image://' +
                require('../../../../assets/img/enterprise04out_c.png')
              // obj.symbol = '../../../../assets/img/enterprise04out_c.png'
            } else if (!obj.imputlist && !obj.outlist) {
              obj.symbol =
                'image://' + require('../../../../assets/img/enterprise04c.png')
              // obj.symbol = '../../../../assets/img/enterprise04c.png'
            }
          } else {
            if (obj.imputlist && obj.outlist) {
              obj.symbol =
                'image://' +
                require('../../../../assets/img/enterprise04inout.png')
              // obj.symbol = '../../../../assets/img/enterprise04inout.png'
            } else if (obj.imputlist && !obj.outlist) {
              obj.symbol =
                'image://' +
                require('../../../../assets/img/enterprise04in.png')
              // obj.symbol = '../../../../assets/img/enterprise04in.png'
            } else if (!obj.imputlist && obj.outlist) {
              obj.symbol =
                'image://' +
                require('../../../../assets/img/enterprise04out.png')
              // obj.symbol = '../../../../assets/img/enterprise04out.png'
            } else if (!obj.imputlist && !obj.outlist) {
              obj.symbol =
                'image://' + require('../../../../assets/img/enterprise04.png')
              // obj.symbol = '../../../../assets/img/enterprise04.png'
            }
          }
        } else if (obj.level == '6') {
          if (obj.isparent) {
            if (obj.imputlist && obj.outlist) {
              obj.symbol =
                'image://' +
                require('../../../../assets/img/enterprise05all.png')
              // obj.symbol = '../../../../assets/img/enterprise05all.png'
            } else if (obj.imputlist && !obj.outlist) {
              obj.symbol =
                'image://' +
                require('../../../../assets/img/enterprise05in_c.png')
              // obj.symbol = '../../../../assets/img/enterprise05in_c.png'
            } else if (!obj.imputlist && obj.outlist) {
              obj.symbol =
                'image://' +
                require('../../../../assets/img/enterprise05out_c.png')
              // obj.symbol = '../../../../assets/img/enterprise05out_c.png'
            } else if (!obj.imputlist && !obj.outlist) {
              obj.symbol =
                'image://' + require('../../../../assets/img/enterprise05c.png')
              // obj.symbol = '../../../../assets/img/enterprise05c.png'
            }
          } else {
            if (obj.imputlist && obj.outlist) {
              obj.symbol =
                'image://' +
                require('../../../../assets/img/enterprise05inout.png')
              // obj.symbol = '../../../../assets/img/enterprise05inout.png'
            } else if (obj.imputlist && !obj.outlist) {
              obj.symbol =
                'image://' +
                require('../../../../assets/img/enterprise05in.png')
              // obj.symbol = '../../../../assets/img/enterprise05in.png'
            } else if (!obj.imputlist && obj.outlist) {
              obj.symbol =
                'image://' +
                require('../../../../assets/img/enterprise05out.png')
              // obj.symbol = '../../../../assets/img/enterprise05out.png'
            } else if (!obj.imputlist && !obj.outlist) {
              obj.symbol =
                'image://' + require('../../../../assets/img/enterprise05.png')
              // obj.symbol = '../../../../assets/img/enterprise05.png'
            }
          }
        }
      })
      return new Promise((resolve, reject) => {
        resolve(initdata)
      })
    },
    // 寻找id
    lookforsameId(initdata, id, children, length) {
      console.log(initdata)
      initdata.forEach(obj => {
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
          // this.isFull = !this.isFull
          window.onFullScreen()
          break
        case type === 'home':
          this.isFull = false
          this.scaleTo = 1
          this.showNewFrame = false
          break
      }
    },
    selectLeve(data) {
      this.selectClass = data
    },
    command(data) {
      this.selectClass = data
    },
    treeclick(item) {
      window['getProcessTree'](item.id)
      this.attrid = item.id
      this.displaymode = item.displaymode
    },
    toolIframeClick(type) {
      switch (true) {
        case type === 'zoomin':
          this.storeratio = (this.storeratio * 10 + 1) / 10
          this.$refs.kongtiao.$refs.frameShow.style.transform =
            'scale(' + this.storeratio + ')'
          break
        case type === 'zoomout':
          if (this.storeratio === 0.2) {
            this.$message({
              type: 'warning',
              message: this.$t('hintText.scaledToTheMinimumCanNotGoAnyLower')
            })
            return false
          }
          this.storeratio = (this.storeratio * 10 - 1) / 10
          this.$refs.kongtiao.$refs.frameShow.style.transform =
            'scale(' + this.storeratio + ')'
          break
        case type === 'normal':
          this.storeratio = 1
          this.$refs.kongtiao.$refs.frameShow.style.transform =
            'scale(' + this.storeratio + ')'
          break
        case type === 'list':
          this.showNewFrame = true
          break
        case type === 'fullScreen':
          window.onFullScreen()
          break
        case type === 'editorAPQC':
          this.showProcessTree = false
          this.showNewFrame = false
          this.showProcessEditor = !this.showProcessEditor
          // this.iframeSrc = `./leftMenu/BaseNewPage.html`
          this.iframeSrc =
            this.host +
            this.html +
            '/leftMenu/BaseNewPage.html?id=' +
            this.bpmid +
            '&listid=' +
            this.listid +
            '&isReadAttr=' +
            true
          console.log(this.iframeSrc)
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-scrollbar__wrap {
  padding: 0px !important;
}
.div-center {
  margin: 0 auto;
}
#processIframeCenter {
  .leveBut {
    position: absolute;
    top: 5px;
    right: 15px;
    /deep/ .el-button--primary {
      color: #ffffff;
      background-color: #8f9bde;
      border-color: #8f9bde;
    }
    .isActive {
      background-color: #2d42af !important;
      border-color: #2d42af !important;
    }
  }
  height: 100%;
  .processCount {
    position: absolute;
    top: 90px;
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
  .paintChart {
    height: calc(100vh - 160px);
    background-color: #e6e6e6;
    border: 1px solid #d2d2d2;
    user-select: none;
    &.fullScreen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .tools {
      font-size: 20px;
      color: #8a8a8a;
      height: 40px;
      line-height: 40px;
      background-color: #fafafa;
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
      height: calc(100% - 60px);
      .chartContent {
        height: 100%;
        background-color: #ffffff;
        position: relative;
        overflow: auto;
      }
    }
  }

  #process_tree_wrapper {
    height: calc(100vh - 160px);
    .el-scrollbara {
      height: calc(100vh - 890px);

      /deep/ .el-scrollbar__view {
        height: 65%;
      }
    }
    .el-scrollbars {
      height: calc(100vh - 185px);

      /deep/ .el-scrollbar__view {
        height: 65%;
      }
    }
  }

  &.fullEditor {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100% !important;
    z-index: 2000;
    background-color: #fff;
    #process_tree_wrapper {
      height: 100% !important;
      .el-scrollbar {
        height: calc(100vh - 25px) !important;
      }
    }
    .paintChart {
      height: 100%;
    }
  }
  .el-scrollbar.remove-padding {
    /deep/ .el-scrollbar__wrap {
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
/deep/.process-tree {
  padding-top: 100px !important;
}
/deep/.continer-btn {
  top: 10px;
}
/deep/ .continer-top {
  top: 10px;
}
</style>
