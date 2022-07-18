<template>
  <div id="pandect">
    <div class="padding10px h100 pad-t15px">
      <el-scrollbar class="h100">
        <el-row style="width: 97%;margin: 0 10px 10px 10px;">
          <div>
            <div class="title-header">
              {{ $t('jobInformation') }}
            </div>
            <!-- <el-button class="float-r" type="primary" size="mini" @click="getJobs">{{$t("chooseAPosition")}}</el-button> -->
          </div>
          <el-col :span="24" class="title-box" style="min-height:236px">
            <el-row style="padding: 18px;">
              <el-col :span="24">
                <div class="border color-b-b" />
                <div class="title color-b-f">
                  {{ $t('myPost') }}
                </div>
                <div class="word">
                  （{{ this.$t('total')
                  }}<span class="color-b-f"> {{ stationName.length }} </span
                  >{{ this.$t('share') }}）
                  <span
                    v-if="stationName.length > 3"
                    class="more"
                    @click="getMore(1)"
                    >{{ levelIW }}</span
                  >
                </div>
              </el-col>
              <el-col :span="24" class="title-box-bottom">
                <el-row :gutter="24">
                  <el-col
                    v-for="(item, index) in stationName"
                    v-if="index < levelI"
                    :key="index"
                    :span="8"
                    style="height:24px;margin-bottom:10px;display: flex"
                  >
                    <div class="radius color-b-b" />
                    <div :title="item.name" class="title text_overflow_1">
                      {{ item.name }}
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row style="padding: 18px;">
              <el-col :span="24">
                <div class="border color-b-b" />
                <div class="title color-b-f">
                  {{ $t('relatedProcesses') }}
                </div>
                <div class="word">
                  （{{ this.$t('total')
                  }}<span class="color-b-f"> {{ relatelists.length }} </span
                  >{{ this.$t('share') }}）
                  <span
                    v-if="relatelists.length > 3"
                    class="more"
                    @click="getMore(2)"
                    >{{ levelIIW }}</span
                  >
                </div>
              </el-col>
              <el-col :span="24" class="title-box-bottom">
                <el-row :gutter="24">
                  <el-col
                    v-for="(item, index) in relatelists"
                    v-if="index < levelII"
                    :key="index"
                    :span="8"
                    style="height:24px;margin-bottom:10px;display: flex"
                  >
                    <div class="radius color-b-b" />
                    <div :title="item.listname" class="title text_overflow_1">
                      {{ item.listname }}
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row style="padding: 18px;">
              <el-col :span="24">
                <div class="border color-b-b" />
                <div class="title color-b-f">
                  {{ $t('responsible') }}
                </div>
                <div class="word">
                  （{{ this.$t('total')
                  }}<span class="color-b-f"> {{ owners.length }} </span
                  >{{ this.$t('share') }}）
                  <span
                    v-if="owners.length > 3"
                    class="more"
                    @click="getMore(3)"
                    >{{ levelIIIW }}</span
                  >
                </div>
              </el-col>
              <el-col :span="24" class="title-box-bottom">
                <el-row :gutter="24">
                  <el-col
                    v-for="(item, index) in owners"
                    v-if="index < levelIII"
                    :key="index"
                    :span="8"
                    style="height:24px;margin-bottom:10px;display: flex"
                  >
                    <div class="radius color-b-b" />
                    <div :title="item.name" class="title text_overflow_1">
                      {{ item.listname }}
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row style="padding: 18px;">
              <el-col :span="24">
                <div class="border color-b-b" />
                <div class="title color-b-f">
                  {{ $t('approver') }}
                </div>
                <div class="word">
                  （{{ this.$t('total')
                  }}<span class="color-b-f"> {{ appovers.length }} </span
                  >{{ this.$t('share') }}）
                  <span
                    v-if="appovers.length > 3"
                    class="more"
                    @click="getMore(4)"
                    >{{ levelIVW }}</span
                  >
                </div>
              </el-col>
              <el-col :span="24" class="title-box-bottom">
                <el-row :gutter="24">
                  <el-col
                    v-for="(item, index) in appovers"
                    v-if="index < levelIV"
                    :key="index"
                    :span="8"
                    style="height:24px;margin-bottom:10px;display: flex"
                  >
                    <div class="radius color-b-b" />
                    <div :title="item.name" class="title text_overflow_1">
                      {{ item.nodename }} - {{ item.listname }}
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row style="padding: 18px;">
              <el-col :span="24">
                <div class="border color-b-b" />
                <div class="title color-b-f">
                  {{ $t('onlyThose') }}
                </div>
                <div class="word">
                  （{{ this.$t('total')
                  }}<span class="color-b-f"> {{ notiers.length }} </span
                  >{{ this.$t('share') }}）
                  <span
                    v-if="notiers.length > 3"
                    class="more"
                    @click="getMore(5)"
                    >{{ relativeW }}</span
                  >
                </div>
              </el-col>
              <el-col :span="24" class="title-box-bottom">
                <el-row :gutter="24">
                  <el-col
                    v-for="(item, index) in notiers"
                    v-if="index < relative"
                    :key="index"
                    :span="8"
                    style="height:24px;margin-bottom:10px;display: flex"
                  >
                    <div class="radius color-b-b" />
                    <div :title="item.name" class="title text_overflow_1">
                      {{ item.nodename }} - {{ item.listname }}
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <!-- <div class="common">
          <div class="title">
            <h5>{{$t('myPost')}}</h5>
            <el-button class="float-r" type="primary" size="mini" @click="getJobs">{{$t("chooseAPosition")}}</el-button>
          </div>
          <ul class="content">
            <li v-for="item in stationName" :key="item.id">{{item.name}}</li>
          </ul>
        </div>
        <div class="common">
          <div class="title">
            <h5>{{$t("relatedProcesses")}}</h5>
          </div>
          <ul class="content">
            <li v-for="item in relatelists" :key="item.id">{{item.listname}}</li>
          </ul>
        </div>
        <div class="common">
          <div class="title">
            <h5>{{$t("responsible")}}</h5>
          </div>
          <ul class="content">
            <li v-for="item in owners" :key="item.id">
              {{item.nodename}}
              <br />
              {{item.listname}}
            </li>
          </ul>
        </div>
        <div class="common">
          <div class="title">
            <h5>{{$t("approver")}}</h5>
          </div>
          <ul class="content">
            <li v-for="item in appovers" :key="item.id">
              {{item.nodename}}
              <br />
              {{item.listname}}
            </li>
          </ul>
        </div>
        <div class="common">
          <div class="title">
            <h5>{{$t("onlyThose")}}</h5>
          </div>
          <ul class="content">
            <li v-for="item in notiers" :key="item.id">
              {{item.nodename}}
              <br />
              {{item.listname}}
            </li>
          </ul>
        </div> -->
      </el-scrollbar>
      <!-- ===========查询岗位弹框 -->
      <el-dialog
        :title="chooseAPosition"
        :visible.sync="josbsdialogVisible"
        width="30%"
      >
        <el-tree
          ref="orgTree"
          :props="props"
          :load="loadNode"
          show-checkbox
          lazy
          node-key="id"
          :default-expanded-keys="[grandParentId]"
          highlight-current
          @check-change="checkOrg"
        />
        <!-- <el-tag v-for="tag in tags" :key="tag.id" closable effect="dark" type="primary" class="content2"
          @close="handleClose(tag)">{{tag.name}}</el-tag> -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="josbsdialogVisible = false">{{
            $t('cancel')
          }}</el-button>
          <el-button type="primary" @click="submit">{{
            $t('confirm')
          }}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getRelativeOther,
  getOwnersOther,
  getAppoversOther,
  getNotiersOther,
  getJobsList,
  getJobsChildrenList
} from '@/bpa/api/jobsCenter'
export default {
  name: 'Pandect',
  props: {
    ids: {
      type: Array,
      default: () => []
    },
    relatelists: {
      type: Array,
      default: () => []
    },

    owners: {
      type: Array,
      default: () => []
    },
    stationName: {
      type: Array,
      default: () => []
    },
    appovers: {
      type: Array,
      default: () => []
    },
    notiers: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // stationName: [],
      // relatelists: [],
      // owners: [],
      // appovers: [],
      askers: [],
      // notiers: [],
      levelI: 3,
      levelII: 3,
      levelIII: 3,
      levelIV: 3,
      relative: 3,
      levelIW: this.$t('unfold'),
      levelIIW: this.$t('unfold'),
      levelIIIW: this.$t('unfold'),
      levelIVW: this.$t('unfold'),
      relativeW: this.$t('unfold'),
      josbsdialogVisible: false, // 弹框
      tags: [],
      prsopss: [],
      props: {
        label: 'name',
        children: 'subNodes',
        disabled: function(data, node) {
          if (data.type == 3) {
            return false
          }
          return true
        },
        isLeaf: function(data, node) {
          if (data.isParent === 'true') {
            return false
          } else {
            return true
          }
        }
      },
      grandParentId: '',
      chooseAPosition: this.$t('chooseAPosition')
    }
  },
  mounted() {
    // if (this.ids.length > 0) {
    //   this.stationName = JSON.parse(JSON.stringify(this.ids))
    //   const arr = this.stationName.map(item => {
    //     return item.id
    //   })
    //   this.getData(arr.join(','))
    // }
  },
  methods: {
    // 查看更多
    getMore(num) {
      if (num === 1) {
        if (this.levelI === 3) {
          this.levelI = 999
          this.levelIW = this.$t('putAway')
        } else {
          this.levelI = 3
          this.levelIW = this.$t('unfold')
        }
      }
      if (num === 2) {
        if (this.levelII === 3) {
          this.levelII = 999
          this.levelIIW = this.$t('putAway')
        } else {
          this.levelII = 3
          this.levelIIW = this.$t('unfold')
        }
      }
      if (num === 3) {
        if (this.levelIII === 3) {
          this.levelIII = 999
          this.levelIIIW = this.$t('putAway')
        } else {
          this.levelIII = 3
          this.levelIIIW = this.$t('unfold')
        }
      }
      if (num === 4) {
        if (this.levelIV === 3) {
          this.levelIV = 999
          this.levelIVW = this.$t('putAway')
        } else {
          this.levelIV = 3
          this.levelIVW = this.$t('unfold')
        }
      }
      if (num === 5) {
        if (this.relative === 3) {
          this.relative = 999
          this.relativeW = this.$t('putAway')
        } else {
          this.relative = 3
          this.relativeW = this.$t('unfold')
        }
      }
    },
    getData(params) {
      Promise.all([
        getRelativeOther(params),
        getOwnersOther(params),
        getAppoversOther(params),
        getNotiersOther(params)
      ]).then(res => {
        if (!res) return false
        this.relatelists = res[0]
        this.owners = res[1]
        this.appovers = res[2]
        this.notiers = res[3]
      })
    },
    // 查询岗位
    async getJobs() {
      this.josbsdialogVisible = true
      this.tags = JSON.parse(JSON.stringify(this.stationName))
    },
    // 加载子节点事件
    loadNode(node, resolve) {
      const id = node.data ? node.data.id : '0'
      if (id == 0) {
        this.loadfirstnode(resolve)
      } else {
        this.loadChildrnode(node, resolve)
      }
      this.$nextTick(() => {
        this.$refs.orgTree.setCheckedNodes(this.tags)
      })
    },
    // 加载第一级节点
    loadfirstnode(resolve) {
      getJobsList('0').then(res => {
        console.log(res)
        if (!res) return false
        if (res.length > 0) {
          this.grandParentId = res[0].id
          return resolve(res)
        }
      })
    },
    // 加载子节点
    loadChildrnode(node, resolve) {
      const obj = {
        pid: node.data.id,
        type: '0,1,2,3,4'
      }
      getJobsChildrenList(obj).then(res => {
        console.log(res)
        return resolve(res)
      })
    },
    // 点击复选框
    checkOrg(data, isChecked) {
      if (isChecked) {
        this.tags.push(data)
      } else {
        for (let i = 0; i < this.tags.length; i++) {
          if (data.id === this.tags[i].id) {
            this.tags.splice(i, 1)
            break
          }
        }
      }
    },
    handleClose(item) {
      for (let i = 0; i < this.tags.length; i++) {
        if (item.id === this.tags[i].id) {
          this.tags.splice(i, 1)
          this.$refs.orgTree.setCheckedNodes(this.tags)
          break
        }
      }
    },
    // 确认事件
    submit() {
      const arr = this.tags.map(item => {
        return item.id
      })
      this.stationName = JSON.parse(JSON.stringify(this.tags))
      this.tags = []
      this.josbsdialogVisible = false
      this.getData(arr.join(','))
      this.$emit('submit', this.stationName)
    }
  }
}
</script>

<style scoped lang="scss">
* {
  box-sizing: border-box;
}
#pandect {
  height: calc(100vh - 200px);
  /deep/ .el-scrollbar__wrap {
    padding: 0 !important;
  }
  .title-header {
    min-width: 111px;
    height: 38px;
    background: #b7bfea;
    border-radius: 10px 10px 0px 0px;
    // font-weight: bold;
    color: #2d42af;
    font-size: 15px;
    text-align: center;
    line-height: 42px;
    float: left;
    padding: 0px 8px;
  }
  .title-box {
    min-height: 136px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 8px 0px rgba(196, 204, 213, 1);
    border-radius: 0px 10px 10px 10px;
    .border {
      width: 4px;
      height: 24px;
      border-radius: 2px;
      float: left;
      margin-top: 3px;
    }
    .title {
      font-size: 14px;
      float: left;
      margin-left: 20px;
      line-height: 30px;
    }
    .word {
      font-size: 14px;
      line-height: 30px;
    }
    .more {
      text-decoration: underline;
      color: rgba(45, 65, 175, 1);
      float: right;
      cursor: pointer;
    }
    .color-l-b {
      background: rgba(27, 197, 199, 1);
    }
    .color-b-b {
      background: rgba(45, 65, 175, 1);
    }
    .color-sb-b {
      background: rgba(91, 111, 209, 1);
    }
    .color-l-f {
      color: rgba(27, 197, 199, 1);
    }
    .color-b-f {
      color: rgba(45, 65, 175, 1);
    }
    .color-sb-f {
      color: rgba(91, 111, 209, 1);
    }
    .title-box-bottom {
      border-bottom: 1px solid rgba(237, 237, 237, 1);
      padding: 10px 20px;
      .radius {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        float: left;
        margin-top: 7px;
      }
      .title {
        font-size: 14px;
        text-decoration: underline;
        color: rgba(135, 135, 135, 1);
        float: left;
        margin-left: 12px;
      }
    }
  }
  .common {
    line-height: 32px;
    margin-bottom: 25px;
    .title {
      border-bottom: 1px solid #ddd;
    }
    h5 {
      font-weight: 500;
      display: inline-block;
      vertical-align: top;
      border-bottom: 1px solid #308ae6;
      position: relative;
      bottom: -1px;
    }
    .content {
      li {
        display: inline-block;
        vertical-align: bottom;
        width: 30%;
        min-height: 30px;
        line-height: 30px;
        margin-right: 10px;
        word-break: break-all;
        padding: 5px 0;
        border-bottom: 1px dashed #ddd;
      }
    }
  }
  .content2 {
    margin: 10px 10px 0 0;
  }
  .el-tree {
    height: 280px;
    overflow: auto;
    /deep/ .el-tree-node__label {
      margin-left: 5px;
    }
  }
}
</style>
