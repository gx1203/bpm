<template>
  <div id="pandect">
    <div class="padding10px h100 pad-t15px">
      <el-scrollbar class="h100">
        <!-- <div class="common">
          <div class="title">
            <h5>查询岗位</h5>
            <el-button class="float-r" type="primary" size="mini" @click="getJobs">选择岗位</el-button>
          </div>
          <ul class="content">
            <li v-for="item in stationName" :key="item.ID">{{item.NAME}}</li>
          </ul>
        </div>-->
        <div class="common">
          <div class="title">
            <h5>相关流程</h5>
          </div>
          <ul class="content">
            <li v-for="item in relatelists" :key="item.id">
              <span @click="moreClick(item)">
                <i
                  :class="{'el-icon-arrow-up' : item.isChecked, 'el-icon-arrow-down' : !item.isChecked}"
                ></i>
              </span>
              {{item.listname}}
              <el-button
                type="text"
                icon="el-icon-search"
                class="float-r"
                style="margin-right:20px"
                @click="toDetail(item)"
              ></el-button>
              <div :class="{'li_content' : item.isChecked == true}">
                <el-form :model="processForm" label-width="80px" v-if="item.isChecked == true">
                  <el-row>
                    <el-col :span="7">
                      <el-form-item :label="$t('processName2')">
                        <el-input clearable v-model="item.listname" placeholder="流程名称" readonly></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="7">
                      <el-form-item :label="$t('version')">
                        <el-input clearable v-model="item.listvsersion" placeholder="版本" readonly></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="7">
                      <el-form-item :label="$t('processCoding')">
                        <el-input clearable v-model="item.listcode" placeholder="流程编码" readonly></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="7">
                      <el-form-item label="负责部门">
                        <el-input clearable v-model="item.listorgname" placeholder="负责部门" readonly></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="14">
                      <el-form-item label="适用范围">
                        <el-input clearable v-model="item.listscope" placeholder="适用范围" readonly></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </li>
          </ul>
        </div>
        <div class="common">
          <div class="title">
            <h5>责任者</h5>
          </div>
          <ul class="content">
           <li v-for="item in owners" :key="item.id">
              <span @click="moreClick(item)">
                <i
                  :class="{'el-icon-arrow-up' : item.isChecked, 'el-icon-arrow-down' : !item.isChecked}"
                ></i>
              </span>
            {{item.listname}}
            <el-button
              type="text"
              icon="el-icon-search"
              class="float-r"
              style="margin-right:20px"
              @click="toDetail(item)"
            ></el-button>
            <div :class="{'li_content' : item.isChecked == true}">
              <el-form :model="processForm" label-width="80px" v-if="item.isChecked == true">
                <el-row>
                  <el-col :span="7">
                    <el-form-item :label="$t('processName2')">
                      <el-input clearable v-model="item.listname" placeholder="流程名称" readonly></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item :label="$t('version')">
                      <el-input clearable v-model="item.listvsersion" placeholder="版本" readonly></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item :label="$t('processCoding')">
                      <el-input clearable v-model="item.listcode" placeholder="流程编码" readonly></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="7">
                    <el-form-item label="负责部门">
                      <el-input clearable v-model="item.listorgname" placeholder="负责部门" readonly></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="14">
                    <el-form-item label="适用范围">
                      <el-input clearable v-model="item.listscope" placeholder="适用范围" readonly></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </li>
          </ul>
        </div>
        <div class="common">
          <div class="title">
            <h5>审批者</h5>
          </div>
          <ul class="content">
            <li v-for="item in appovers" :key="item.id">
              <span @click="moreClick(item)">
                <i
                  :class="{'el-icon-arrow-up' : item.isChecked, 'el-icon-arrow-down' : !item.isChecked}"
                ></i>
              </span>
              {{item.nodename}} /
              {{item.listname}}
              <el-button
                type="text"
                icon="el-icon-search"
                class="float-r"
                style="margin-right:20px"
                @click="toDetail(item)"
              ></el-button>
              <div :class="{'li_content' : item.isChecked == true}">
                <el-form :model="processForm" label-width="80px" v-if="item.isChecked == true">
                  <el-row>
                    <el-col :span="7">
                      <el-form-item :label="$t('processName2')">
                        <el-input clearable v-model="item.listname" placeholder="流程名称" readonly></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="7">
                      <el-form-item :label="$t('version')">
                        <el-input clearable v-model="item.listvsersion" placeholder="版本" readonly></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="7">
                      <el-form-item :label="$t('processCoding')">
                        <el-input clearable v-model="item.listcode" placeholder="流程编码" readonly></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="7">
                      <el-form-item label="负责部门">
                        <el-input clearable v-model="item.listorgname" placeholder="负责部门" readonly></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="14">
                      <el-form-item label="适用范围">
                        <el-input clearable v-model="item.listscope" placeholder="适用范围" readonly></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </li>
          </ul>
        </div>
        <div class="common">
          <div class="title">
            <h5>知会者</h5>
          </div>
          <ul class="content">
            <li v-for="item in notiers" :key="item.id">
              <span @click="moreClick(item)">
                <i
                  :class="{'el-icon-arrow-up' : item.isChecked, 'el-icon-arrow-down' : !item.isChecked}"
                ></i>
              </span>
              {{item.nodename}} /
              {{item.listname}}
              <el-button
                type="text"
                icon="el-icon-search"
                class="float-r"
                style="margin-right:20px"
                @click="toDetail(item)"
              ></el-button>
              <div :class="{'li_content' : item.isChecked == true}">
                <el-form :model="processForm" label-width="80px" v-if="item.isChecked == true">
                  <el-row>
                    <el-col :span="7">
                      <el-form-item :label="$t('processName2')">
                        <el-input clearable v-model="item.listname" placeholder="流程名称" readonly></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="7">
                      <el-form-item :label="$t('version')">
                        <el-input clearable v-model="item.listvsersion" placeholder="版本" readonly></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="7">
                      <el-form-item :label="$t('processCoding')">
                        <el-input clearable v-model="item.listcode" placeholder="流程编码" readonly></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="7">
                      <el-form-item label="负责部门">
                        <el-input clearable v-model="item.listorgname" placeholder="负责部门" readonly></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="14">
                      <el-form-item label="适用范围">
                        <el-input clearable v-model="item.listscope" placeholder="适用范围" readonly></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </li>
          </ul>
        </div>
      </el-scrollbar>
    </div>
    <!-- ===========流程卡片 -->
    <process-card2 v-model="isDialogsVisible" :version="version" :modelid="listid" :bpmid="bpmid" :treeId="modelid" :processcode = "processcode" @close="close"></process-card2>
  </div>
</template>
<script>
import {
  getProcessesSearch,
  getOwnersOther,
  getAppoversOther,
  getNotiersOther,
  getJobsList,
  getJobsChildrenList
} from '@/bpa/api/jobsCenter'
import processCard2 from './../../../processDesignCenter/child1/components/processCard2'
export default {
  name: 'pandect',
  components: {
    processCard2
  },
  data() {
    return {
      stationName: [],
      relatelists: [],
      owners: [],
      appovers: [],
      askers: [],
      notiers: [],
      josbsdialogVisible: false, // 弹框
      tags: [],
      props: {
        label: 'NAME',
        children: 'subNodes',
        disabled: function(data, node) {
          if (data.TYPE == 3) {
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
      ids: [],
      moreProcess: false,
      processForm: {},
      isDialogsVisible: false,
      version: '',
      listid: '',
      bpmid: '',
      modelid: '',
      processcode: ''
    }
  },
  props: {
    idArr: {
      type: Array,
      default: () => []
    },
    searchForm: {
      type: Object,
      default: () => {
        return {
          listname: '',
          listorgname: '',
          typename: ''
        }
      }
    }
  },
  watch: {
    idArr: {
      handler: function(newVal, oldVal) {
        console.log(newVal)
        this.ids = newVal
        if (newVal && newVal.length > 0) {
          this.getData(newVal.join(','))
        } else {
          this.getData(null)
        }
      },
      deep: true,
      immediate: true
    },
    searchForm: {
      handler(obj) {
        if (obj) {
          this.getData(this.idArr.join(',') || null, obj)
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    getData(params, searchForm) {
      searchForm = searchForm || {}
      console.log(searchForm)
      Promise.all([
        getProcessesSearch({
          // listname: '',
          // listorgname: '',
          postids: params || '',
          ...searchForm
          // typename: ''
        }),
        getOwnersOther(Object.keys(searchForm).length === 0 ? params : null),
        getAppoversOther(Object.keys(searchForm).length === 0 ? params : null),
        getNotiersOther(Object.keys(searchForm).length === 0 ? params : null)
      ]).then(res => {
        if (!res) return false
        res[0].forEach(val => {
          val.isChecked = false
        })
        res[1].forEach(val => {
          val.isChecked = false
        })
        res[2].forEach(val => {
          val.isChecked = false
        })
        res[3].forEach(val => {
          val.isChecked = false
        })
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
      let id = node.data ? node.data.ID : '0'
      if (id == 0) {
        this.loadfirstnode(resolve)
      } else {
        this.loadChildrnode(node, resolve)
      }
      this.$nextTick(() => {
        this.$refs.orgTree.setCheckedNodes(this.tags)
      })
    },
    moreClick(value) {
      value.isChecked = !value.isChecked
    },
    toDetail(val) {
      console.log(val)
      this.version = val.listvsersion
      this.listid = val.listid
      this.bpmid = val.id
      this.modelid = val.modelList ? val.modelList.modelid : ''
      this.processcode = val.listcode
      this.isDialogsVisible = true
    },
    close() {
      this.isDialogsVisible = false
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
        display: block;
        // vertical-align: bottom;
        width: 100%;
        min-height: 30px;
        line-height: 30px;
        margin: 10px 0px;
        word-break: break-all;
        padding: 5px 0px;
        box-sizing: border-box;
        background-color: #f7f7f9;
        span {
          color: #63b0f1;
          display: inline-block;
          font-size: 14px;
          width: 30px;
          height: 30px;
          cursor: pointer;
          padding: 0 10px
        }
        .li_content {
          width: 100%;
          height: 90px;
          background-color: #fff;
          padding: 10px 0px;
        }
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
