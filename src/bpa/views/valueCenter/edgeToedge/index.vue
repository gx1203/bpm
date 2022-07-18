<template>
  <div id="edgeToedge" class="pageWrap w100" @click="rightContextMenu = false">
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
              <p class="font14 opertionBtn">
                <i
                  v-if="node.level === 1"
                  class="el-icon-circle-plus-outline add"
                  @click="newChain(node)"
                />
                <i
                  v-if="node.level !== 1"
                  class="el-icon-edit add"
                  @click="editChain('modify', data, node)"
                />
                <i
                  v-if="node.level !== 1"
                  class="el-icon-delete add"
                  @click="editChain('delete', data, node)"
                />
              </p>
            </div>
          </el-tree>
        </div>
      </div>
      <div class="listContent">
        <div class="paintChart" :class="{ fullScreen: isFull, '': !isFull }">
          <div class="tools">
            <el-row>
              <el-col :span="7">
                <div id="toolss">
                  <el-tooltip
                    class="margin-l10 cursor-pointer"
                    effect="dark"
                    :content="amplification"
                    placement="top"
                  >
                    <div class="tools-item" @click="toolClick('zoomin')">
                      <i class="el-icon-zoom-in"></i>
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
                      <i class="el-icon-zoom-out" />
                      <span>{{ narrow }}</span>
                    </div>
                  </el-tooltip>
                  <el-tooltip
                    class="margin-l10 cursor-pointer"
                    effect="dark"
                    :content="$t('normal')"
                    placement="top"
                  >
                    <div class="tools-item" @click="toolClick('normal')">
                      <i class="el-icon-help" aria-hidden="true" />
                      <span>{{ $t('normal') }}</span>
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
                    content="保存"
                    placement="top"
                  >
                    <div class="tools-item" @click="saveStage">
                      <i
                        class="iconfont icon-gongdanguanli-gongda"
                        style="font-size: 18px; margin-right: 0px"
                        aria-hidden="true"
                      />
                      <span>保存</span>
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
                  <el-tooltip
                    class="margin-l10 cursor-pointer"
                    effect="dark"
                    :content="publish"
                    placement="top"
                  >
                    <div class="tools-item" @click="publishChart">
                      <i class="el-icon-upload" aria-hidden="true" />
                      <span>{{ publish }}</span>
                    </div>
                  </el-tooltip>
                </div>
              </el-col>
              <el-col :span="17">
                <div class="btns">
                  <!-- <el-button size="mini" type="primary" @click="viewallKpi">{{
                    $t("allkpi")
                  }}</el-button> -->
                  <el-button size="mini" @click="newStage('btn')">{{
                    $t('addPhase')
                  }}</el-button>
                  <!--            <el-button size="mini" @click="autoSort">{{$t("automaticSorting")}}</el-button>-->
                  <!-- <el-button size="mini" @click="viewKpi">KPI指标</el-button> -->
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="content">
            <div
              class="chartContent"
              ref="chartId"
              @mousedown="mouseDownHandleelse($event)"
              @mouseup="mouseUpHandleelse($event)"
            >
              <div class="realChart" ref="kongtiao">
                <div
                  :class="
                    index == 0 ? 'stageContent' : 'stageContent margin-l10'
                  "
                  :style="`top: ${chartHeight}px`"
                  v-for="(item, index) in rightStoreData.stagelist"
                  :key="item.id"
                >
                  <div class="stageChart pos-relative">
                    <div
                      class="w100 h100 textContent"
                      :title="item.name"
                      @contextmenu.prevent="rightClick($event, 'stage', index)"
                    >
                      <p class="h100 w100">{{ item.name }}</p>
                    </div>
                    <div class="leftImgPart"></div>
                    <div class="rightImgPart"></div>
                    <div class="stageprocess upNew remove-border-b">
                      <p>
                        <span
                          class="cursor-pointer"
                          @click.prevent="addProcess('up', index, 'btn')"
                          >+</span
                        >
                      </p>
                    </div>
                    <div
                      :class="
                        item.downprocesslists.length == 0
                          ? 'stageprocess downNew remove-border-b'
                          : 'stageprocess downNew'
                      "
                    >
                      <p>
                        <span
                          class="cursor-pointer"
                          @click.prevent="addProcess('down', index, 'btn')"
                          >+</span
                        >
                      </p>
                    </div>
                    <!-- 上面的部分 -->
                    <div
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
                      v-for="(val, idx) in item.upprocesslists"
                      :key="val.id + 'up' + index + idx"
                    >
                      <p
                        :title="val.name"
                        :class="val.isRelease !== 'Y' ? 'cursor-pointer' : 'cursor-pointer release'"
                        @contextmenu.prevent="
                          rightClick($event, 'processUp', index, idx)
                        "
                        @click="handlerProcess(val, index, idx)"
                        @dblclick="toDesign(val)"
                      >
                        <span>{{ val.sort }}</span>
                        {{ val.name }}
                      </p>
                    </div>
                    <!-- 下面的部分 -->
                    <div
                      class="stageprocess"
                      :class="[
                        {
                          'remove-border-b':
                            idx == item.downprocesslists.length - 1
                        },
                        {
                          active:
                            curSelectedItem === val.id + 'down' + index + idx
                        }
                      ]"
                      :style="
                        `left: -${(idx + 1) * 20}px; top: ${(idx + 2) * 30}px`
                      "
                      v-for="(val, idx) in item.downprocesslists"
                      :key="val.id + 'down' + index + idx"
                    >
                      <p
                        :title="val.name"
                        :class="val.isRelease !== 'Y' ? 'cursor-pointer' : 'cursor-pointer release'"
                        @contextmenu.prevent="
                          rightClick($event, 'processDown', index, idx)
                        "
                        @click="handlerProcess(val, index, idx)"
                        @dblclick="toDesign(val)"
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

    <!-- 添加总指标 -->
    <el-dialog
      :title="allkpi"
      :visible.sync="allkpiDialogVisible"
      width="900px"
    >
      <allkpi-mode
        ref="addalljzlkpi"
        :value="true"
        :processVallist="allkpidata"
        v-if="allkpiDialogVisible"
      ></allkpi-mode>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allkpiDialogVisible = false">{{
          $t('cancel')
        }}</el-button>
        <el-button type="primary" @click="confirmallkpi()">{{
          $t('confirm')
        }}</el-button>
      </span>
    </el-dialog>

    <!-- 添加价值链 -->
    <el-dialog :title="valueChain" :visible.sync="dialogVisible" width="900px">
      <el-form
        label-width="120px"
        ref="chainlist"
        :rules="rules"
        :model="chainlist"
      >
        <el-form-item :label="valueChainName" prop="name">
          <el-input clearable v-model="chainlist.name"></el-input>
        </el-form-item>
      </el-form>
      <!-- <kpi-mode
        ref="addjzlkpi"
        :value="true"
        :processVallist="jzlkpidata"
        v-if="dialogVisible"
      ></kpi-mode> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="confirmChain()">{{
          $t('confirm')
        }}</el-button>
      </span>
    </el-dialog>

    <!-- 添加阶段 -->
    <el-dialog :title="phase" :visible.sync="stagedialogVisible" width="900px">
      <el-form
        label-width="120px"
        ref="stageform"
        :rules="stagerules"
        :model="stageform"
      >
        <el-form-item :label="phaseName" prop="name">
          <el-input clearable v-model="stageform.name"></el-input>
        </el-form-item>
      </el-form>
      <!-- <kpi-mode
        :processVallist="jdkpidata"
        v-if="stagedialogVisible"
        ref="addjdkpi"
        :value="true"
        :curSelectedId="curSelectedId"
      ></kpi-mode> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="stagedialogVisible = false">{{
          $t('cancel')
        }}</el-button>
        <el-button type="primary" @click="confirmStage()">{{
          $t('confirm')
        }}</el-button>
      </span>
    </el-dialog>

    <!-- 选择流程模态框 -->
        <select-process
          :processDialogVisible.sync="processDialogVisible"
          :selected="storeProcessData"
          @confirm="confirmAction"
        ></select-process>
    <kpi-indicators-list
      v-model="kpiDialogVisible"
      v-if="kpiDialogVisible"
      :curSelectedId="curSelectedId"
      :kpitype="kpitype"
    ></kpi-indicators-list>

    <ul class="rightMenu" ref="rightMenuRef" v-show="rightContextMenu">
      <li @click="modifyStage">{{ $t('modify') }}</li>
      <li @click="deleteStage">{{ $t('delete') }}</li>
      <li @click="insert">{{ $t('insert') }}</li>
    </ul>
  </div>
</template>

<script>
import {
  getChainlist,
  newChain,
  deleteChain,
  getProcessChart,
  saveStageProcess,
  publishChain,
  getChainone,
  getModelManagementTree
} from '@/bpa/api/valueCenter/edgeToedge'
import { getProcessTreeofprincipal } from '@/bpa/api/componentsApi'
import { getCommunityList } from '@/bpa/api/processModelCenter/processCommunity'
import '@/bpa/assets/fonts/font_baocun/iconfont.css'

import { createId } from '@/bpa/utils/common'

import SelectProcess from './components/SelectProcess.vue'
import kpiIndicatorsList from '@/bpa/components/kpiIndicators/kpiIndicatorsList.vue'
import kpiMode from '@/bpa/components/kpiIndicators/kpimode.vue'
import allkpiMode from '@/bpa/components/kpiIndicators/allkpimode.vue'
export default {
  data() {
    return {
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
      allkpiDialogVisible: false,
      allkpidata: [],
      kpitype: '',
      jzlkpidata: [],
      jdkpidata: [],
      rightContextMenu: false,
      isFull: false,
      // 存储缩放比例
      storeratio: 1,
      // 保存刚进入该页面的ref="chartId"的高度
      chartHeight: 0,
      dialogVisible: false,
      // 控制选择流程树的模态框的显示隐藏
      processDialogVisible: false,
      // 判断选择的上面的加号，还是下面的
      typeSelect: '',
      // 存储已选择好的流程数据
      storeProcessData: [],
      // 存储点击的是哪个加号
      // cessi
      storeAddIdx: 0,
      chainValue: [],
      chainlist: {
        id: ''
      },
      rules: {
        name: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      // 阶段弹出框
      stagedialogVisible: false,
      stageform: {
        name: '',
        jdkpidata: []
      },
      stagerules: {
        name: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      rightStoreData: {
        chainId: '',
        chainName: '',
        stagelist: []
      },
      // 保存修改流程的index
      processidx: '',
      // 判断是否修改流程
      referprocesstype: '',
      moveDataelse: {
        x: null,
        y: null
      },
      // 默认价值链目录选中值
      default: 0,
      referAdd: '',
      valueChain: this.$t('valueChain'),
      valueChainName: this.$t('valueChainName'),
      phase: this.$t('phase'),
      phaseName: this.$t('phaseName'),
      modify: this.$t('modify'),
      delete2: this.$t('delete'),
      amplification: this.$t('amplification'),
      narrow: this.$t('narrow'),
      allkpi: this.$t('allkpi'),
      normalProportion: this.$t('normalProportion'),
      refresh: this.$t('refresh'),
      save: this.$t('save'),
      reduction: this.$t('reduction'),
      fullScreen: this.$t('fullScreen'),
      publish: this.$t('publish'),
      modifyTheSuccess: this.$t('hintText.modifyTheSuccess'),
      addedSuccess: this.$t('hintText.addedSuccess'),
      requiredFieldsCannotBeEmpty: this.$t(
        'hintText.requiredFieldsCannotBeEmpty'
      ),
      areYouSureDelete: this.$t('hintText.areYouSureDelete'),
      pleaseEditBeforeSaving: this.$t('hintText.pleaseEditBeforeSaving'),
      notBeenPublishedAndCannotBeAccessed: this.$t(
        'hintText.notBeenPublishedAndCannotBeAccessed'
      ),
      determineThePublishingValueChain: this.$t(
        'hintText.determineThePublishingValueChain'
      ),
      determineThePublishingValueChain2: this.$t(
        'hintText.determineThePublishingValueChain2'
      ),
      pleaseSelecttheFirstValueChainProcessAndThenOperate: this.$t(
        'hintText.pleaseSelecttheFirstValueChainProcessAndThenOperate'
      ),
      pleaseSelecttheFirstValueChainProcessAndThenOperate2: this.$t(
        'hintText.pleaseSelecttheFirstValueChainProcessAndThenOperate2'
      ),
      saveSuccessfully: this.$t('hintText.saveSuccessfully'),
      successfullyDelete: this.$t('hintText.successfullyDelete'),
      determineTheReleaseValueChain: this.$t(
        'hintText.determineTheReleaseValueChain'
      ),
      hint: this.$t('hintText.hint'),
      confirm: this.$t('confirm'),
      releaseSuccess: this.$t('hintText.releaseSuccess'),
      curSelectedItem: '',
      curSelectedId: '',
      kpiDialogVisible: false,
      timer: null,
      selectNode: {}
    }
  },
  components: {
    SelectProcess,
    kpiMode,
    kpiIndicatorsList,
    allkpiMode
  },
  mounted() {
    this.getChainlist()
    this.chartHeight = (document.body.clientHeight - 220) / 2
    document.onmouseup = () => {
      window.onmousemove = null
    }
  },
  methods: {
    nodeClick(node, data) {
      console.log(node, data)
      // this.searchKey = data.foldername
      // this.queryNodeClick()
    },
    getFilterTreeList(node, resolve) {
      const id = node.data ? node.data.id : '0'
      getModelManagementTree(id).then(res => {
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
    viewallKpi() {
      getChainone('0').then(res => {
        this.allkpidata = res.modelListKpiDtoList
        this.$nextTick(() => {
          this.allkpiDialogVisible = true
          console.log(this.allkpiDialogVisible)
        })
      })
    },
    // 拖拽---------------------开始
    mouseDownHandleelse(event) {
      this.moveDataelse.x = event.pageX - this.$refs.kongtiao.offsetLeft
      this.moveDataelse.y = event.pageY - this.$refs.kongtiao.offsetTop
      event.currentTarget.style.cursor = 'move'
      window.onmousemove = this.mouseMoveHandleelse
    },
    mouseMoveHandleelse(event) {
      let moveLeft = event.pageX - this.moveDataelse.x + 'px'
      let moveTop = event.pageY - this.moveDataelse.y + 'px'
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
    // 获取价值链的目录
    getChainlist() {
      getChainlist({}).then(res => {
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
      console.log(obj)
      if (this.chainValue.length !== 0) {
        let self = this
        let arr = this.chainValue[0]
        this.chainValue[0].checked = true
        self.rightStoreData.chainId = JSON.parse(
          JSON.stringify(this.chainValue[0])
        ).id
        self.rightStoreData.chainName = JSON.parse(
          JSON.stringify(this.chainValue[0])
        ).name
      }

      let self = this
      let arr = this.chainValue.map(item => {
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
        state: 'N'
      }).then(res => {
        console.log(res)
        if (!res) return false
        this.rightStoreData = res
        this.setRealWidthHeight(res)
      })
    },
    newChain(node) {
      this.selectNode = node
      console.log(node)
      this.chainlist = {}
      this.dialogVisible = true
    },
    confirmallkpi() {
      this.allkpiDialogVisible = false
      newChain({
        id: '0',
        modelListKpiDtoList: this.$refs.addalljzlkpi.processVallist
      }).then(res => {
        console.log(res)
        if (!res) return false
        this.$message({
          type: 'success',
          message: this.chainlist.id ? this.modifyTheSuccess : this.addedSuccess
        })
      })
    },
    confirmChain() {
      this.$refs.chainlist.validate(valid => {
        if (valid) {
          this.dialogVisible = false
          newChain({
            id: this.chainlist.id,
            name: this.chainlist.name,
            pid: '1'
            // modelListKpiDtoList: this.$refs.addjzlkpi.processVallist,
          }).then(res => {
            console.log(res)
            if (!res) return false
            this.$message({
              type: 'success',
              message: this.chainlist.id
                ? this.modifyTheSuccess
                : this.addedSuccess
            })
            const node = this.$refs.asyncTree.getNode(this.selectNode) // 通过节点id找到对应树节点对象
            node.loaded = false
            node.expand()
            this.getChainlist()
          })
        } else {
          this.$message({
            type: 'warning',
            message: this.requiredFieldsCannotBeEmpty
          })
        }
      })
    },
    editChain(type, item, node) {
      console.log(node)
      this.selectNode = node.parent
      switch (true) {
        case type === 'modify':
          // getChainone
          getChainone(item.id).then(res => {
            console.log(res)
            this.$set(this.chainlist, 'name', item.name)
            this.$set(this.chainlist, 'id', item.id)
            this.jzlkpidata = res.modelListKpiDtoList
            this.$nextTick(() => {
              this.dialogVisible = true
            })
          })
          // console.log(item);
          // this.dialogVisible = true;
          // this.$set(this.chainlist, "name", item.name);
          // this.$set(this.chainlist, "id", item.id);
          // console.log(this.chainlist);
          break
        case type === 'delete':
          this.$confirm(this.determineThePublishingValueChain2, this.hint, {
            confirmButtonText: this.$t('confirm'),
            cancelButtonText: this.$t('cancel'),
            type: 'warning'
          }).then(() => {
            deleteChain(item.id)
              .then(res => {
                if (!res) return false
                this.$message({
                  type: 'success',
                  message: this.successfullyDelete
                })
                const node = this.$refs.asyncTree.getNode(this.selectNode) // 通过节点id找到对应树节点对象
                node.loaded = false
                node.expand()
                this.getChainlist()
              })
              .catch(err => {})
          })
          break
      }
    },
    // 添加阶段
    newStage(type) {
      if (!this.rightStoreData.chainId) {
        this.$message({
          type: 'warning',
          message: this.pleaseSelecttheFirstValueChainProcessAndThenOperate2
        })
        return false
      }
      this.referAdd = type
      this.referprocesstype = 'stageAdd'
      ;(this.jdkpidata = []),
        (this.stageform = {
          name: '',
          jdkpidata: []
        })
      this.stagedialogVisible = true
    },
    //阶段
    confirmStage() {
      this.stageform.jdkpidata = JSON.parse(JSON.stringify(this.jdkpidata))
      this.$refs.stageform.validate(valid => {
        console.log(this.stageform, 'this.stageform')
        if (valid) {
          if (this.referprocesstype === 'stageAdd') {
            if (this.referAdd == 'right') {
              let newAdd = {
                id: `STAGE${createId(8, 6)}${
                  this.rightStoreData.stagelist.length
                }`,
                name: this.stageform.name,
                upprocesslists: [],
                downprocesslists: [],
                sort: this.rightStoreData.stagelist.length,
                modelListKpiDtoList: this.stageform.jdkpidata
              }
              if (this.storeAddIdx === 0) {
                this.rightStoreData.stagelist.unshift(newAdd)
              } else {
                let fontArr = this.rightStoreData.stagelist.slice(
                  0,
                  this.storeAddIdx
                )
                let backarr = this.rightStoreData.stagelist.slice(
                  this.storeAddIdx
                )
                this.rightStoreData.stagelist = []
                this.rightStoreData.stagelist = fontArr.concat(newAdd, backarr)
              }
            } else {
              this.rightStoreData.stagelist.push({
                id: `STAGE${createId(8, 6)}${
                  this.rightStoreData.stagelist.length
                }`,
                name: this.stageform.name,
                upprocesslists: [],
                downprocesslists: [],
                sort: this.rightStoreData.stagelist.length,
                modelListKpiDtoList: this.stageform.jdkpidata
              })
            }
            this.setRealWidthHeight(this.rightStoreData)
          } else {
            let arr = JSON.parse(JSON.stringify(this.rightStoreData.stagelist))
            arr[this.storeAddIdx].name = this.stageform.name
            arr[this.storeAddIdx].modelListKpiDtoList = this.stageform.jdkpidata
            this.$set(this.rightStoreData, 'stagelist', arr)
          }
          this.stagedialogVisible = false
        } else {
          this.$message({
            type: 'warning',
            message: this.requiredFieldsCannotBeEmpty
          })
        }
      })
    },
    // 添加流程
    addProcess(type, index, referType) {
      this.storeAddIdx = index
      this.referprocesstype = 'processAdd'
      this.referAdd = referType
      switch (true) {
        case type == 'up':
          this.typeSelect = 'up'
          this.storeProcessData = []
          this.processDialogVisible = true
          break
        case type == 'down':
          this.typeSelect = 'down'
          this.storeProcessData = []
          this.processDialogVisible = true
          break
      }
    },
    // 确认选择的流程
    confirmAction(processArr) {
      console.log(processArr)
      if (!processArr.length) return false
      if (this.typeSelect == 'up') {
        if (this.referprocesstype == 'processUp') {
          let obj = JSON.parse(
            JSON.stringify(this.rightStoreData.stagelist[this.storeAddIdx])
          )
          obj.upprocesslists[this.processidx] = processArr[0]
          this.$set(this.rightStoreData.stagelist, this.storeAddIdx, obj)
        } else {
          let obj = JSON.parse(
            JSON.stringify(this.rightStoreData.stagelist[this.storeAddIdx])
          )
          if (this.referAdd == 'right') {
            if (this.processidx === 0) {
              obj.upprocesslists.unshift(processArr[0])
            } else {
              let fontArr = obj.upprocesslists.slice(0, this.processidx)
              let backarr = obj.upprocesslists.slice(this.processidx)
              obj.upprocesslists = []
              obj.upprocesslists = fontArr.concat(processArr[0], backarr)
            }
          } else {
            obj.upprocesslists.push(processArr[0])
          }
          this.$set(this.rightStoreData.stagelist, this.storeAddIdx, obj)
        }
      } else {
        if (this.referprocesstype == 'processDown') {
          let obj = JSON.parse(
            JSON.stringify(this.rightStoreData.stagelist[this.storeAddIdx])
          )
          obj.downprocesslists[this.processidx] = processArr[0]
          this.$set(this.rightStoreData.stagelist, this.storeAddIdx, obj)
        } else {
          let obj = JSON.parse(
            JSON.stringify(this.rightStoreData.stagelist[this.storeAddIdx])
          )
          if (this.referAdd == 'right') {
            if (this.processidx === 0) {
              obj.downprocesslists.unshift(processArr[0])
            } else {
              let fontArr = obj.downprocesslists.slice(0, this.processidx)
              let backarr = obj.downprocesslists.slice(this.processidx)
              obj.downprocesslists = []
              obj.downprocesslists = fontArr.concat(processArr[0], backarr)
            }
          } else {
            obj.downprocesslists.push(processArr[0])
          }
          this.$set(this.rightStoreData.stagelist, this.storeAddIdx, obj)
        }
      }
      console.log(this.rightStoreData)
    },
    // 自动排序
    autoSort() {
      let tempArr = JSON.parse(JSON.stringify(this.rightStoreData.stagelist))
      let count = 1
      for (let i = 0; i < tempArr.length; i++) {
        for (let j = 0; j < tempArr[i].upprocesslists.length; j++) {
          tempArr[i].upprocesslists[j].sort = count
          count++
        }
        for (let j = 0; j < tempArr[i].downprocesslists.length; j++) {
          tempArr[i].downprocesslists[j].sort = count
          count++
        }
      }
      this.$set(
        this.rightStoreData,
        'stagelist',
        JSON.parse(JSON.stringify(tempArr))
      )
      console.log(tempArr)
    },
    // 保存流程数据
    saveStage() {
      if (!this.rightStoreData.chainId) {
        this.$message({
          type: 'warning',
          message: this.pleaseSelecttheFirstValueChainProcessAndThenOperate
        })
        return false
      }
      if (!this.rightStoreData.stagelist.length) {
        this.$message({
          type: 'warning',
          message: this.pleaseEditBeforeSaving
        })
        return false
      }
      let tempArr = JSON.parse(JSON.stringify(this.rightStoreData.stagelist))
      let count = 1
      for (let i = 0; i < tempArr.length; i++) {
        tempArr[i].sort = i + 1
        for (let j = 0; j < tempArr[i].upprocesslists.length; j++) {
          tempArr[i].upprocesslists[j].sort = count
          count++
        }
        for (let j = 0; j < tempArr[i].downprocesslists.length; j++) {
          tempArr[i].downprocesslists[j].sort = count
          count++
        }
      }
      this.$set(
        this.rightStoreData,
        'stagelist',
        JSON.parse(JSON.stringify(tempArr))
      )
      saveStageProcess(this.rightStoreData).then(res => {
        if (!res) return false
        console.log(res)
        this.$message({
          type: 'success',
          message: this.saveSuccessfully
        })
      })
    },
    // 保存画图数据
    publishChart() {
      if (!this.rightStoreData.chainId) {
        this.$message({
          type: 'warning',
          message: this.pleaseSelecttheFirstValueChainProcessAndThenOperate
        })
        return false
      }
      if (!this.rightStoreData.stagelist.length) {
        this.$message({
          type: 'warning',
          message: this.determineThePublishingValueChain
        })
        return false
      }
      this.$confirm(
        this.determineTheReleaseValueChain +
          this.rightStoreData.chainName +
          '?',
        this.hint,
        {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          publishChain(this.rightStoreData.chainId).then(res => {
            if (!res) return false
            this.$message({
              type: 'success',
              message: this.releaseSuccess
            })
          })
        })
        .catch(err => {
          console.log(err)
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
    // 右键菜单
    rightClick(event, type, index, idx) {
      this.rightContextMenu = true
      console.log(event)
      this.storeAddIdx = index
      this.processidx = idx
      this.referprocesstype = type
      this.$refs.rightMenuRef.style.left = event.clientX + 'px'
      this.$refs.rightMenuRef.style.top = event.clientY + 'px'
    },
    // 插入
    insert() {
      let type = this.referprocesstype
      this.rightContextMenu = false
      switch (true) {
        case type == 'processUp':
          this.addProcess('up', this.storeAddIdx, 'right')
          break
        case type == 'processDown':
          this.addProcess('down', this.storeAddIdx, 'right')
          break
        case type == 'stage':
          this.newStage('right')
          break
      }
    },
    // 修改
    modifyStage() {
      let type = this.referprocesstype
      this.rightContextMenu = false
      switch (true) {
        case type == 'processUp':
          this.typeSelect = 'up'
          let item = JSON.parse(JSON.stringify(this.rightStoreData)).stagelist
          this.storeProcessData = [
            item[this.storeAddIdx].upprocesslists[this.processidx]
          ]
          this.processDialogVisible = true
          break
        case type == 'processDown':
          this.typeSelect = 'down'
          let val = JSON.parse(JSON.stringify(this.rightStoreData)).stagelist
          this.storeProcessData = [
            val[this.storeAddIdx].downprocesslists[this.processidx]
          ]
          console.log(this.storeProcessData)
          this.processDialogVisible = true
          break
        case type == 'stage':
          this.referprocesstype = 'modifyStage'
          let value = JSON.parse(JSON.stringify(this.rightStoreData)).stagelist
          console.log(this.rightStoreData.stagelist, 'stagelist')
          this.stageform.name = value[this.storeAddIdx].name
          this.stageform.jdkpidata = value[this.storeAddIdx].modelListKpiDtoList
          this.jdkpidata = value[this.storeAddIdx].modelListKpiDtoList
          this.stagedialogVisible = true
          break
      }
    },
    toDesign(item) {
      console.log('🍊🍊🍊1', item)
      if (item.isRelease && item.isRelease === 'N') {
        this.$message({
          message: this.notBeenPublishedAndCannotBeAccessed,
          type: 'warining'
        })
        return
      }
      this.toPage(item)
      // clearTimeout(this.timer);
      // getProcessTreeofprincipal(item.id).then(res => {
      //   console.log('🍊🍊🍊2', res)
      //   if (!res) return false

      //   this.$router.push({
      //     path: '/processDesignCenter',
      //     query: {
      //       code: res.code,
      //       id: res.id
      //     }
      //   })
      // })
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
    },
    handlerProcess(val, index, idx) {
      // this.timer = setTimeout(function () {
      this.curSelectedItem = val.id + 'down' + index + idx
      this.curSelectedId = val.id
      // },100);
    },
    viewKpi() {
      this.kpitype = ''
      if (!this.curSelectedId) {
        this.$message({
          message: '请选择流程',
          type: 'error'
        })
        return
      }
      this.kpiDialogVisible = true
    },
    // 删除
    deleteStage() {
      let type = this.referprocesstype
      this.rightContextMenu = false
      switch (true) {
        case type == 'processUp':
          let item = JSON.parse(JSON.stringify(this.rightStoreData)).stagelist
          this.$confirm(this.areYouSureDelete, this.hint, {
            confirmButtonText: this.$t('confirm'),
            cancelButtonText: this.$t('cancel'),
            type: 'warning'
          })
            .then(() => {
              item[this.storeAddIdx].upprocesslists.splice(this.processidx, 1)
              this.$set(this.rightStoreData, 'stagelist', item)
            })
            .catch(err => {
              console.log(err)
            })
          break
        case type == 'processDown':
          let val = JSON.parse(JSON.stringify(this.rightStoreData)).stagelist
          this.$confirm(this.areYouSureDelete, this.hint, {
            confirmButtonText: this.$t('confirm'),
            cancelButtonText: this.$t('cancel'),
            type: 'warning'
          })
            .then(() => {
              val[this.storeAddIdx].downprocesslists.splice(this.processidx, 1)
              this.$set(this.rightStoreData, 'stagelist', val)
            })
            .catch(err => {
              console.log(err)
            })
          break
        case type == 'stage':
          let value = JSON.parse(JSON.stringify(this.rightStoreData)).stagelist
          this.$confirm(this.areYouSureDelete, this.hint, {
            confirmButtonText: this.$t('confirm'),
            cancelButtonText: this.$t('cancel'),
            type: 'warning'
          })
            .then(() => {
              value.splice(this.storeAddIdx, 1)
              value = value.map((item, index) => {
                item.sort = index + 1
                return item
              })
              this.$set(this.rightStoreData, 'stagelist', value)
            })
            .catch(err => {
              console.log(err)
            })
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#edgeToedge {
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
        padding-right: 40px;
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
          color: #427efc;
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
      z-index: 1000;
    }
    #toolss {
      padding-top: 4px;
      display: flex;
      justify-content: space-between;
      .tools-item {
        display: flex;
        flex-direction: column;
        height: 40px;
        text-align: center;
        // min-width: 25px;
        i {
          display: block;
        }
        span {
          display: block;
          font-size: 12px;
        }
      }
    }
    .btns {
      height: 48px;
      line-height: 48px;
      margin-left: 5px;
    }
    .tools {
      font-size: 20px;
      color: #8a8a8a;
      height: 44px;
      line-height: 20px;
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
        top: 0;
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
              color: #fff;
              border: 1px solid #409eff;
              background-color: #409eff;
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
