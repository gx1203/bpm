<template>
  <div id="category" v-loading="loading">
    <el-card id="apply-create" shadow="never" class="clear-fix">
      <div class="classifyNav">
        <el-form size="mini" label-position="left" @submit.native.prevent>
          <el-row>
            <el-col :span="24">
              <el-form-item>
                <div class="tool-common-wrap">
                  <div class="search-wrap">
                    <el-input
                      v-model="searchForm.name"
                      clearable
                      prefix-icon="iconfont icon-sousuo2"
                      :placeholder="$t('placeholderText.pleaseEnterProcessName')"
                      @input="search"
                      @keyup.enter.native="search"
                    />
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="classify-layout">
          <div class="classify-div" @click="classifyHandle($t('commonlyUsedProcess'))">
            <div class="classify-but" :class="activeName.NAME ===$t('commonlyUsedProcess')?'active':''">
              {{ $t('commonlyUsedProcess') }}
            </div>
          </div>
          <div
            v-for="(item, index) in classifyList"
            :key="index"
            class="classify-div"
            @click="classifyHandle(item)"
          >
            <div class="classify-but" :class="activeName.ID ===item.ID ?'active':''">
              {{ item.NAME }}
            </div>
          </div>
        </div>
      </div>
      <div id="applyBox">
        <el-row v-if="activeName.NAME !== $t('commonlyUsedProcess')" :gutter="20" align="center">
          <h3 v-if="searchForm.name === ''">
            {{ activeName.NAME }}
          </h3>
          <el-col v-for="item in applyLists" :key="item.id" :span="6" style="margin:5px 0;">
            <div class="apply" @click="toFlow(item)">
              <div class="apply-icon" :style="'backgroundColor:'+item.color">
                <i class="iconfont" :class="item.icon?item.icon:'icon-zhuanxierizhi'" />
              </div>
              <div
                class="apply-name overflow-els"
                :title="item.processNameCn"
              >
                {{ item.processNameCn }}
              </div>
              <el-button
                type="text"
                class="button"
                :title="$t('addCommonProcesses')"
                icon="el-icon-plus"
                @click.stop="handleAddShortCut(item)"
              />
            </div>
          </el-col>
        </el-row>
        <el-row v-else class="quickLaunch" :gutter="20" align="center">
          <h3 v-if="searchForm.name === ''">
            {{ activeName.NAME }}
          </h3>
          <div v-if="searchForm.name !== ''">
            <el-col v-for="item in applyLists" :key="item.id" :span="6" style="margin:5px 0;">
              <div class="apply" @click="toFlow(item)">
                <div class="apply-icon" :style="'backgroundColor:'+item.color">
                  <i class="iconfont" :class="item.icon?item.icon:'icon-zhuanxierizhi'" />
                </div>
                <div
                  class="apply-name overflow-els"
                  :title="item.processNameCn"
                >
                  {{ item.processNameCn }}
                </div>
                <el-button
                  type="text"
                  class="button"
                  :title="$t('addCommonProcesses')"
                  icon="el-icon-plus"
                  @click.stop="handleAddShortCut(item)"
                />
              </div>
            </el-col>
          </div>
          <div v-if="searchForm.name === ''">
            <el-col v-for="item in shortList" :key="item.id" :span="6" style="margin:5px 0;">
              <div class="apply" @click="toFlowQuick(item)">
                <div class="apply-icon" :style="'backgroundColor:'+item.color">
                  <i class="iconfont" :class="item.icon?item.icon:'icon-zhuanxierizhi'" />
                </div>
                <div
                  class="apply-name overflow-els"
                  :title="item.processnamecn"
                >
                  {{ item.processnamecn }}
                </div>
                <el-button
                  type="text"
                  class="button"
                  :title="$t('deleteCommonProcesses')"
                  icon="el-icon-delete"
                  @click.stop="handleDelShortCut(item.id)"
                />
              </div>
            </el-col>
          </div>
        </el-row>
      </div>
      <choose-jobs v-model="dialogVisible" :item="itemData" @confirm="saveSuccess" />
    </el-card>
  </div>
</template>
<script>
import {
  getApplyList,
  getShortCutList,
  addToShortCut,
  postionList,
  delShortCut
} from '@/bpm/api/staging/personal/apply_create'
import { checkProcessDefaultPage } from '@/bpm/api/flow/index'

import { getPost } from '@/bpm/api/process/administrativeTool/agents_change'
import chooseJobs from './chooseJobs'
export default {
  components: {
    chooseJobs
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      itemData: [],
      classifyList: [],
      activeName: {
        NAME: this.$t('commonlyUsedProcess')
      },
      searchForm: {
        name: ''
      },
      shortShow: false,
      paramsData: {},
      applyList: [],
      shortList: [],
      applyLists: [],
      boole: false
    }
  },
  watch: {},
  mounted() {
    this.getData()
  },
  destroyed() {
    window.onresize = null
  },
  methods: {
    applyListF(list) {
      const _this = this
      list.forEach(item => {
        if (item.processes && item.processes.length > 0) {
          _this.applyLists = [..._this.applyLists, ...item.processes]
        }
        if (item.subNodes && item.subNodes.length > 0) {
          _this.applyListF(item.subNodes)
        }
      })
    },
    classifyHandle(item) {
      let than = this;
      than.searchForm.name = "";
      if (item === this.$t('commonlyUsedProcess')) {
        than.activeName = {
          NAME: this.$t('commonlyUsedProcess')
        };
        than.applyLists = than.applyList;
      } else {
        than.activeName = item;
        than.applyLists = [];
        let _list = this.applyListAll.find(item => {
          return item.id == than.activeName.ID;
        });
        if (_list && _list.processes && _list.processes.length > 0) {
          than.applyLists = [...than.applyLists, ..._list.processes];
        }
        than.applyListF(_list.subNodes || []);
      }
    },
    search() {
      let than = this;
      if (!than.searchForm.name) {
        than.applyLists = [];
        let _list = this.applyListAll.find(item => {
          return item.id == than.activeName.ID;
        });
        if (_list && _list.processes && _list.processes.length > 0) {
          than.applyLists = [...than.applyLists, ..._list.processes];
        }
        than.applyListF(_list.subNodes || []);
      } else {
        than.applyLists = than.applyList.filter(item => {
          return item.processNameCn.indexOf(than.searchForm.name) !== -1;
        });
      }
    },
    getData() {
      this.loading = true
      getApplyList().then(rt => {
        this.applyListAll = rt.data
        this.applyLists = []
        this.classifyList = []
        this.applyListF(this.applyListAll)
        this.applyList = JSON.parse(JSON.stringify(this.applyLists))
        this.classifyList = this.applyListAll.map(item => {
          return {
            NAME: item.name,
            ID: item.id
          }
        })
        this.search()
      })
      getShortCutList().then(rt => {
        this.loading = false
        this.shortList = rt.data
      })
    },
    handleAddShortCut(item) {
      addToShortCut({
        processid: item.id,
        processname: item.processName,
        processnamecn: item.processNameCn
      })
        .then(rt => {
          if (rt.status === '200') {
            this.$message.success(this.$t('hintText.addedSuccess'))
            this.getData()
          } else {
            this.$message.error(rt.message)
          }
        })
        .catch(err => {
          // this.$message.error(err.message)
        })
    },
    handleDelShortCut(id) {
      delShortCut(id).then(() => {
        this.$message.success(this.$t('hintText.addedSuccess'))
        this.getData()
      })
    },
    saveSuccess(data) {
      this.toHref(this.paramsData, data[0].id)
    },
    toFlowQuick(item) {
      item = {
        processNameCn: item.processnamecn,
        processName: item.processname,
        projectName: item.attribute3
      }
      this.toFlow(item)
    },
    toFlow(item) {
      this.paramsData = {
        NAME: item.processNameCn,
        URLNAME: item.processName,
        PROJECTNAME: item.projectName
      }
      getPost(this.$store.state.basuser.user.id).then(rt => {
        if (rt.status === '200') {
          if (rt.data && rt.data.length > 0) {
            if (rt.data.length > 1) {
              this.itemData = rt.data
              this.dialogVisible = true
            } else {
              this.toHref(this.paramsData, rt.data[0].id)
            }
          } else {
            this.$message.error(this.$t('hintText.postMissingContactAdministrator'))
          }
        }
      })
    },
    toHref(item, pid) {
      let routeData = ''
      checkProcessDefaultPage({
        processName: item.URLNAME,
        instanceId: item.instanceId
      }).then(rt => {
        if (rt.status === '200') {
          if (rt.data.isDefaultPage === 'Y') {
            routeData = this.$router.resolve({
              name: item.processName + 'Test',
              query: {
                name: item.NAME,
                processName: item.URLNAME,
                projectName: item.PROJECTNAME,
                pid: pid
              }
            })
          } else {
            routeData = this.$router.resolve({
              name: 'processFormTest',
              query: {
                name: item.NAME,
                processName: item.URLNAME,
                projectName: item.PROJECTNAME,
                defOrg: item.defOrg,
                pid: pid
              }
            })
          }
          // window.open(routeData.href, "_blank");
          const a = document.createElement('a')
          // 给创建好的a标签赋值
          a.setAttribute('href', routeData.href)
          // 设置css 隐藏属性
          a.setAttribute('style', 'display:none')
          // 设置 a标签为新窗口打开
          a.setAttribute('target', '_blank')
          // 将设置好的a标签，添加到 body 内
          document.body.appendChild(a)
          // 模拟点击
          a.click()
          // 移除a标签
          a.parentNode.removeChild(a)
        }
      })
    }
  }
}
</script>
<style type="text/scss" lang="scss">
#category {
  .apply {
    height: 48px;
    line-height: 48px;
    padding: 10px;
    border: 1px solid $dc1;
    position: relative;
    border-radius: 10px;
    cursor: pointer;
    overflow: hidden;
    display: flex;
    &:hover {
      background-color: #eeeeee;
      .button {
        color: #fff;
        display: inline-block !important;
      }
    }
    .button {
      display: none !important;
      position: absolute;
      color: #fff;
      background-color: #0066cc !important;
      height: 72px;
      width: 50px;
      transform: rotate(-45deg);
      top: -29px;
      right: -25px;
      i {
        font-size: 16px;
        position: absolute;
        transform: rotate(45deg);
        bottom: 30px;
        left: 3px;
      }
    }

    .apply-icon {
      display: inline-block;
      border-radius: 8px;
      color: #fff;
      height: 48px;
      width: 48px;
      line-height: 48px;
      text-align: center;
      background-color: $bc4;
      .iconfont {
        font-size: 26px;
      }
    }
    .apply-name {
      display: inline-block;
      width: calc(100% - 60px);
      padding-left: 10px;
      overflow: hidden;
      font-size: 16px;
    }
  }
  #apply-create {
    .quickLaunch {
      .button {
        background-color: red !important;
      }
    }
    #applyBox {
      position: relative;
      flex: 1;
      height: calc(100vh - 300px);
      overflow-y: auto;
      overflow-x: hidden;
      margin: 0 auto;
      h3 {
        margin: 10px;
        font-size: 16px;
        border-left: 5px solid $bc4;
        padding-left: 10px;
      }
    }
    .el-card__body {
      display: flex;
    }
    .classifyNav {
      box-sizing: border-box;
      width: 270px;
      padding-right: 20px;
      .classify-layout {
        height: calc(100vh - 350px);
        overflow: auto;
      }
      .classify-div {
        height: 30px;
        line-height: 30px;
        .classify-but {
          font-size: 14px;
          border-radius: 5px;
          padding: 0 10px;
          cursor: pointer;
          &:hover {
            background-color: #eeeeee;
          }
        }
        .classify-but.active {
          background-color: $bc4;
          color: #fff;
        }
      }
    }
  }
}
.search-wrap {
  width: 100%;
  input {
    width: 100%;
  }
}
</style>
