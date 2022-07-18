<template>
  <div id="edgeToedge" class="w100" @click="rightContextMenu = false">
    <el-row>
      <el-row>
        <el-button style="margin-bottom: 10px" @click="$router.push('/analyseWatchCenter/bpmProcessBack')">返回上一级</el-button>
      </el-row>
      <el-col class="remove-margin-r">
        <div :class="{'fullScreen': isFull, '': !isFull}" class="paintChart">
          <div class="tools">
            <el-tooltip
              class="margin-l10 cursor-pointer"
              effect="dark"
              :content="$t('amplification')"
              placement="top"
            >
              <i class="el-icon-zoom-in" @click="toolClick('zoomin')"/>
            </el-tooltip>
            <el-tooltip
              class="margin-l10 cursor-pointer"
              effect="dark"
              :content="$t('narrow')"
              placement="top"
            >
              <i class="el-icon-zoom-out" @click="toolClick('zoomout')"/>
            </el-tooltip>
            <el-tooltip
              class="margin-l10 cursor-pointer"
              effect="dark"
              :content="$t('normalProportion')"
              placement="top"
            >
              <i class="fa fa-crosshairs" aria-hidden="true" @click="toolClick('normal')"/>
            </el-tooltip>
            <el-tooltip
              class="margin-l10 cursor-pointer"
              effect="dark"
              content="刷新"
              placement="top"
            >
              <i class="el-icon-refresh" @click="toolClick('reload')"/>
            </el-tooltip>
            <el-tooltip
              class="margin-l10 cursor-pointer"
              effect="dark"
              :content="$t('save')"
              placement="top"
            >
              <i class="fa fa-floppy-o" aria-hidden="true" @click="saveStage"/>
            </el-tooltip>
            <el-tooltip
              :content="isFull ? '还原' : $t('fullScreen')"
              class="margin-l10 cursor-pointer"
              effect="dark"
              placement="top"
            >
              <i class="fa fa-arrows-alt" aria-hidden="true" @click="toolClick('fullScreen')"/>
            </el-tooltip>
            <el-tooltip
              class="margin-l10 cursor-pointer"
              effect="dark"
              content="发布"
              placement="top"
            >
              <i class="el-icon-upload" aria-hidden="true" @click="publishChart"/>
            </el-tooltip>
            <el-button size="mini" @click="newStage">添加阶段</el-button>
            <el-button size="mini" @click="autoSort">自动排序</el-button>
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
                  :class="[index == 0 ? 'stageContent' : 'stageContent margin-l10',{'worse': index % 3 == 0}]"
                  :style="`top: ${chartHeight}px`"
                  :key="item.id"
                >
                  <div class="stageChart pos-relative">
                    <div
                      :title="item.name"
                      class="w100 h100 textContent"
                      @contextmenu.prevent="rightClick($event, 'stage', index)"
                    >
                      <p class="h100 w100">{{ item.name }}</p>
                      <span/>
                    </div>
                    <div class="leftImgPart"/>
                    <div class="rightImgPart"/>
                    <div class="stageprocess upNew remove-border-b">
                      <p>
                        <span class="cursor-pointer" @click.prevent="addProcess('up', index)">+</span>
                      </p>
                    </div>
                    <div
                      :class="item.downprocesslists.length == 0 ? 'stageprocess downNew remove-border-b':'stageprocess downNew'"
                    >
                      <p>
                        <span class="cursor-pointer" @click.prevent="addProcess('down', index)">+</span>
                      </p>
                    </div>
                    <!-- 上面的部分 -->
                    <div class="stageprocessUp">
                      <div
                        v-for="(val, idx) in item.upprocesslists"
                        :class="[index %2 == 1 ? 'stageprocess' : 'stageprocess stageprocessmore']"
                        :style="`left: -${(idx + 1) * 20}px; top: -${(idx + 2) * 30}px`"
                        :key="val.id + 'up' + index + idx">
                        <p
                          :title="val.name"
                          class="cursor-pointer"
                          @contextmenu.prevent="rightClick($event, 'processUp', index, idx)"
                          @dblclick="toDesign(val)"
                        >
                          <span>{{ val.sort }}</span>
                          {{ val.name }}
                        </p>
                      </div>
                      <span/>
                    </div>
                    <!-- 下面的部分 -->
                    <div class="stageprocessDown">
                      <div
                        v-for="(val, idx) in item.downprocesslists"
                        :class="[idx == (item.downprocesslists.length - 1) ? 'stageprocess remove-border-b' : 'stageprocess',index %3 == 0 ? 'stageprocess' : 'stageprocess stageprocessmore']"
                        :style="`left: -${(idx + 1) * 20}px; top: ${(idx + 2) * 30}px`"
                        :key="val.id + 'down' + index + idx"
                      >
                        <p
                          :title="val.name"
                          @contextmenu.prevent="rightClick($event, 'processDown', index, idx)"
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
      </el-col>
    </el-row>

    <!-- 添加价值链 -->
    <el-dialog :visible.sync="dialogVisible" title="价值链" width="40%">
      <el-form ref="chainlist" :rules="rules" :model="chainlist" label-width="120px">
        <el-form-item label="价值链名称" prop="name">
          <el-input clearable v-model="chainlist.name"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('cancelAction') }}</el-button>
        <el-button type="primary" @click="confirmChain()">{{ $t('confirm') }}</el-button>
      </span>
    </el-dialog>

    <!-- 添加阶段 -->
    <el-dialog :visible.sync="stagedialogVisible" title="阶段" width="40%">
      <el-form ref="stageform" :rules="stagerules" :model="stageform" label-width="120px">
        <el-form-item label="阶段名称" prop="name">
          <el-input clearable v-model="stageform.name"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="stagedialogVisible = false">{{ $t('cancelAction') }}</el-button>
        <el-button type="primary" @click="confirmStage()">{{ $t('confirm') }}</el-button>
      </span>
    </el-dialog>

    <!-- 选择流程模态框 -->
    <select-process v-model="processDialogVisible" :selected="storeProcessData" @confirm="confirm"/>

    <ul v-show="rightContextMenu" ref="rightMenuRef" class="rightMenu">
      <li @click="modifyStage">修改</li>
      <li @click="deleteStage">删除</li>
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
  publishChain
} from '@/bpm/api/analyseWatchCenter/index.js'

import { createId } from '@/bpm/utils/common'
import selectProcess from './components/selectProcess.vue'
export default {
  components: {
    selectProcess
  },
  data() {
    return {
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
        name: ''
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
      default: 0
    }
  },
  mounted() {
    this.getChainlist()
    this.chartHeight = (document.body.clientHeight - 220) / 2
    document.onmouseup = () => {
      window.onmousemove = null
    }
  },
  methods: {
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
        const self = this
        const arr = this.chainValue[0]
        this.chainValue[0].checked = true
        self.rightStoreData.chainId = JSON.parse(
          JSON.stringify(this.chainValue[0])
        ).id
        self.rightStoreData.chainName = JSON.parse(
          JSON.stringify(this.chainValue[0])
        ).name
      }

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
        state: 'N'
      }).then(res => {
        console.log(res)
        if (!res) return false
        this.rightStoreData = res
        this.setRealWidthHeight(res)
      })
    },
    newChain() {
      this.chainlist = {}
      this.dialogVisible = true
    },
    confirmChain() {
      this.$refs.chainlist.validate(valid => {
        if (valid) {
          this.dialogVisible = false
          newChain({
            id: this.chainlist.id,
            name: this.chainlist.name
          }).then(res => {
            console.log(res)
            if (!res) return false
            this.$message({
              type: 'success',
              message: this.chainlist.id ? '修改成功!' : '添加成功!'
            })
            this.getChainlist()
          })
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('hintText.theRequiredFieldsMustNotBeEmpty')
          })
        }
      })
    },
    editChain(type, item) {
      switch (true) {
        case type === 'modify':
          console.log(item)
          this.dialogVisible = true
          this.$set(this.chainlist, 'name', item.name)
          this.$set(this.chainlist, 'id', item.id)
          console.log(this.chainlist)
          break
        case type === 'delete':
          this.$confirm(
            '删除该一级价值链, 他下面的所有的内容会删除, 确认删除吗?',
            this.$t('hintText.hint'),
            {
              confirmButtonText: this.$t('confirm'),
              cancelButtonText: this.$t('cancel'),
              type: 'warning'
            }
          ).then(() => {
            deleteChain(item.id)
              .then(res => {
                if (!res) return false
                this.$message({
                  type: 'success',
                  message: this.$t('hintText.successfullyDelete')
                })
                this.getChainlist()
              })
              .catch(err => {})
          })
          break
      }
    },
    // 添加阶段
    newStage() {
      if (!this.rightStoreData.chainId) {
        this.$message({
          type: 'warning',
          message: '请先选择一级价值链流程, 再进行添加阶段!'
        })
        return false
      }
      this.referprocesstype = 'stageAdd'
      this.stageform = {}
      this.stagedialogVisible = true
    },
    confirmStage() {
      this.$refs.stageform.validate(valid => {
        if (valid) {
          if (this.referprocesstype === 'stageAdd') {
            this.rightStoreData.stagelist.push({
              id: `STAGE${createId(8, 6)}${
                this.rightStoreData.stagelist.length
              }`,
              name: this.stageform.name,
              upprocesslists: [],
              downprocesslists: [],
              sort: this.rightStoreData.stagelist.length
            })
            this.setRealWidthHeight(this.rightStoreData)
          } else {
            const arr = JSON.parse(JSON.stringify(this.rightStoreData.stagelist))
            arr[this.storeAddIdx].name = this.stageform.name
            this.$set(this.rightStoreData, 'stagelist', arr)
          }
          this.stagedialogVisible = false
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('hintText.theRequiredFieldsMustNotBeEmpty')
          })
        }
      })
    },
    // 添加流程
    addProcess(type, index) {
      this.storeAddIdx = index
      this.referprocesstype = 'processAdd'
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
    confirm(processArr) {
      if (!processArr.length) return false
      if (this.typeSelect == 'up') {
        if (this.referprocesstype == 'processUp') {
          const obj = JSON.parse(
            JSON.stringify(this.rightStoreData.stagelist[this.storeAddIdx])
          )
          obj.upprocesslists[this.processidx] = processArr[0]
          this.$set(this.rightStoreData.stagelist, this.storeAddIdx, obj)
        } else {
          const obj = JSON.parse(
            JSON.stringify(this.rightStoreData.stagelist[this.storeAddIdx])
          )
          obj.upprocesslists.push(processArr[0])
          this.$set(this.rightStoreData.stagelist, this.storeAddIdx, obj)
        }
      } else {
        if (this.referprocesstype == 'processDown') {
          const obj = JSON.parse(
            JSON.stringify(this.rightStoreData.stagelist[this.storeAddIdx])
          )
          obj.downprocesslists[this.processidx] = processArr[0]
          this.$set(this.rightStoreData.stagelist, this.storeAddIdx, obj)
        } else {
          const obj = JSON.parse(
            JSON.stringify(this.rightStoreData.stagelist[this.storeAddIdx])
          )
          obj.downprocesslists.push(processArr[0])
          this.$set(this.rightStoreData.stagelist, this.storeAddIdx, obj)
        }
      }
      console.log(this.rightStoreData)
    },
    // 自动排序
    autoSort() {
      const tempArr = JSON.parse(JSON.stringify(this.rightStoreData.stagelist))
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
          message: '请先选择一级价值链流程, 再进行操作!'
        })
        return false
      }
      if (!this.rightStoreData.stagelist.length) {
        this.$message({
          type: 'warning',
          message: '请先编辑, 再进行保存!'
        })
        return false
      }
      const tempArr = JSON.parse(JSON.stringify(this.rightStoreData.stagelist))
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
      saveStageProcess(this.rightStoreData).then(res => {
        if (!res) return false
        console.log(res)
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
      })
    },
    // 保存画图数据
    publishChart() {
      if (!this.rightStoreData.chainId) {
        this.$message({
          type: 'warning',
          message: '请先选择一级价值链流程, 再进行操作!'
        })
        return false
      }
      if (!this.rightStoreData.stagelist.length) {
        this.$message({
          type: 'warning',
          message: '请先编辑, 再进行发布!'
        })
        return false
      }
      this.$confirm(
        '确定发布价值链' + this.rightStoreData.chainName + '吗?',
        this.$t('hintText.hint'),
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
              message: '发布成功!'
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
          message: '请先选择一级价值链流程, 再进行操作!'
        })
        return false
      }
      switch (true) {
        case type === 'zoomin':
          this.storeratio = (this.storeratio * 10 + 1) / 10
          this.$refs.kongtiao.style.transform =
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
          this.$refs.kongtiao.style.transform =
            'scale(' + this.storeratio + ')'
          break
        case type === 'normal':
          this.storeratio = 1
          this.$refs.kongtiao.style.transform =
            'scale(' + this.storeratio + ')'
          break
        case type === 'reload':
          this.storeratio = 1
          this.$refs.kongtiao.style.transform =
            'scale(' + this.storeratio + ')'
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
    // 修改
    modifyStage() {
      const type = this.referprocesstype
      this.rightContextMenu = false
      switch (true) {
        case type == 'processUp':
          this.typeSelect = 'up'
          const item = JSON.parse(JSON.stringify(this.rightStoreData)).stagelist
          this.storeProcessData = [
            item[this.storeAddIdx].upprocesslists[this.processidx]
          ]
          this.processDialogVisible = true
          break
        case type == 'processDown':
          this.typeSelect = 'down'
          const val = JSON.parse(JSON.stringify(this.rightStoreData)).stagelist
          this.storeProcessData = [
            val[this.storeAddIdx].downprocesslists[this.processidx]
          ]
          console.log(this.storeProcessData)
          this.processDialogVisible = true
          break
        case type == 'stage':
          this.referprocesstype = 'modifyStage'
          const value = JSON.parse(JSON.stringify(this.rightStoreData)).stagelist
          this.stageform.name = value[this.storeAddIdx].name
          this.stagedialogVisible = true
          break
      }
    },
    toDesign(item) {
      const { href } = this.$router.resolve({ path: '/processChart', query: { id: '' }})
      window.open(href, '_blank')
    },
    // 删除
    deleteStage() {
      const type = this.referprocesstype
      this.rightContextMenu = false
      switch (true) {
        case type == 'processUp':
          const item = JSON.parse(JSON.stringify(this.rightStoreData)).stagelist
          this.$confirm(
            '确认删除阶段' +
              item[this.storeAddIdx].name +
              '下的流程' +
              item[this.storeAddIdx].upprocesslists[this.processidx].name +
              '吗?',
            this.$t('hintText.hint'),
            {
              confirmButtonText: this.$t('confirm'),
              cancelButtonText: this.$t('cancel'),
              type: 'warning'
            }
          )
            .then(() => {
              item[this.storeAddIdx].upprocesslists.splice(this.processidx, 1)
              this.$set(this.rightStoreData, 'stagelist', item)
            })
            .catch(err => {
              console.log(err)
            })
          break
        case type == 'processDown':
          const val = JSON.parse(JSON.stringify(this.rightStoreData)).stagelist
          this.$confirm(
            '确认删除阶段' +
              val[this.storeAddIdx].name +
              '下的流程' +
              val[this.storeAddIdx].downprocesslists[this.processidx].name +
              '吗?',
            this.$t('hintText.hint'),
            {
              confirmButtonText: this.$t('confirm'),
              cancelButtonText: this.$t('cancel'),
              type: 'warning'
            }
          )
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
          this.$confirm(
            '如果删除的话,他下面所选择的所有流程也会被删除,确认删除阶段' +
              value[this.storeAddIdx].name +
              '吗?',
            this.$t('hintText.hint'),
            {
              confirmButtonText: this.$t('confirm'),
              cancelButtonText: this.$t('cancel'),
              type: 'warning'
            }
          )
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
      height: calc(100% - 40px);
      position: relative;
      .chartContent {
        height: calc(100% - 20px);
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
            background-color: skyblue;
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
        .worse {
          .stageChart {
            background-color: #fb1c1c;
          }
        }
        .stageprocess {
          width: 140px;
          height: 30px;
          color: #333333;
          display: inline-block;
          position: absolute;
          border-bottom: 1px solid skyblue;
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
              background-color: skyblue;
              margin-right: 5px;
            }
          }
        }
        .stageprocessmore {
          color: #fb1c1c;
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
              color: skyblue;
              border: 1px solid skyblue;
              background-color: #fff;
            }
          }
        }
      }
      .circle {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #fb1c1c;
        float: left;
      }
      .circle1 {
        position: absolute;
        top: 245px;
        left: 460px;
      }
      .circle2 {
        position: absolute;
        top: 45px;
        left: 370px;
      }
      .circle3 {
        position: absolute;
        top: 110px;
        left: 535px;
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
