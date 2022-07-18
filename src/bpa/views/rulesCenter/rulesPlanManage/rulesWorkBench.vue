<template>
  <div id="workbench">
    <el-row>
      <el-form :model="searchForm" label-width="auto">
        <el-col :span="4">
          <el-form-item label="年度:">
            <el-date-picker
              v-model="searchForm.year"
              type="year"
              value-format="yyyy"
              format="yyyy"
              placeholder="选择年"
            />
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <!-- 信息表格 -->
    <el-card>
      <div slot="header" class="clearfix card-header">
        <span>制度一览表</span>
        <el-button
          style="float: right; padding: 4px 0"
          @click="clickHaddle"
          type="text"
          >查看更多<i class="el-icon-arrow-right el-icon--right"></i
        ></el-button>
      </div>
      <el-table :data="booksList" border class="main_tab">
        <el-table-column label="序号" width="55" type="index"></el-table-column>
        <el-table-column prop="title" label="制度名称">
          <template slot-scope="scope">
            <router-link :to="'/rulesDetail/' + scope.row.docId + '/' + scope.row.revId">
            {{scope.row.title}}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          label="制度编码"
          width="160"
          prop="systemCode"
        ></el-table-column>
        <el-table-column
          prop="writtenName"
          width="160"
          label="制度编写人"
        ></el-table-column>
        <el-table-column
          prop="orgname"
          width="160"
          label="主责部门"
        ></el-table-column>
        <el-table-column
          prop="version"
          width="80"
          label="版本"
        ></el-table-column>
        <el-table-column prop="state" width="200" label="状态">
          <template slot-scope="scope">
            <div class="status">
              <span v-if="scope.row.status === '1'" class="coloreccf47"></span>
              <span
                v-else-if="scope.row.status === '2'"
                class="color177EE6"
              ></span>
              <span
                v-else-if="scope.row.status === '3'"
                class="color6159FF"
              ></span>
              <span
                v-else-if="scope.row.status === '4'"
                class="colorB6EC69"
              ></span>
              <span
                v-else-if="scope.row.status === '6'"
                class="colorB6EC70"
              ></span>
              <span
                v-else-if="scope.row.status === '7'"
                class="colorB6EC71"
              ></span>
              <span
                v-else-if="scope.row.status === '9'"
                class="colorB6EC72"
              ></span>
              <span
                v-else-if="scope.row.status === '10'"
                class="colorB6EC73"
              ></span>
              <span v-else class="color57ddf8"></span>
              {{ scope.row.status | regState }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 我的待办 -->
    <el-row class="margin-t20" :gutter="20">
      <el-col :span="24">
        <el-card>
          <div slot="header" class="clearfix card-header my-card">
            <span
              class="pad-b5px margin-r20"
              :class="activeName === '我的待办' ? 'active' : ''"
              @click="
                activeName = '我的待办';
                getDataList();
              "
              >我的待办</span
            >
            <span
              class="pad-b5px margin-r20"
              :class="activeName === '我的已办' ? 'active' : ''"
              @click="
                activeName = '我的已办';
                getDataList();
              "
              >我的已办</span
            >
            <span
              class="pad-b5px margin-r20"
              :class="activeName === '我的申请' ? 'active' : ''"
              @click="
                activeName = '我的申请';
                getDataList();
              "
              >我的申请</span
            >
            <span
              class="pad-b5px margin-r20"
              :class="activeName === '征求意见跟踪表' ? 'active' : ''"
              @click="
                activeName = '征求意见跟踪表';
                getDataList();
              "
              >征求意见跟踪表</span
            >
            <el-button
              style="float: right; padding: 4px 0"
              @click="clickApplyHandle"
              type="text"
              >查看更多<i class="el-icon-arrow-right el-icon--right"></i
            ></el-button>
          </div>
          <div class="card-main" v-for="(item, index) in dataList" :key="index">
            <el-link @click="toFlow(item)">{{ item.subject }}</el-link>
            <p class="apply-info">
              <span v-if="activeName !== '征求意见跟踪表'"
                >提交人：{{ item.drafter }}</span
              >
              <span v-else>提交人：{{ item.username }}</span>
              <span v-if="activeName === '我的待办'"
                >发起时间：{{ item.assignedDate | forDate }}</span
              >
              <span
                v-if="activeName === '我的已办' || activeName === '我的申请'"
                >发起时间：{{ item.reqDate | forDate }}</span
              >
              <span v-if="activeName === '征求意见跟踪表'"
                >发起时间：{{ item.reqdate | forDate }}</span
              >
            </p>
          </div>
        </el-card>
      </el-col>
      <!-- <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix card-header">
            <span class="pad-5px">我的待阅</span>
            <el-button style="float: right; padding: 4px 0" type="text"
              >查看更多<i class="el-icon-arrow-right el-icon--right"></i
            ></el-button>
          </div>
          <div class="card-main">
            <el-link>评估上报</el-link>
            <p class="apply-info">
              <span>提交人：</span>
              <span>发起时间：</span>
            </p>
          </div>
          <div class="card-main">
            <el-link>评估上报</el-link>
            <p class="apply-info">
              <span>提交人:</span>
              <span>发起时间:</span>
            </p>
          </div>
        </el-card>
      </el-col> -->
    </el-row>
  </div>
</template>

<script>
import {
  getList,
  queryReleasedCopy,
  getBooksList
} from '@/bpa/api/rulesCenter/handbookFiles'
import paginations from '@/bpa/mixins/pagination_mixin'
import fileOperation from '@/bpa/mixins/fileDownView'
import { createNamespacedHelpers } from 'vuex'
import axios from 'axios'
const userInfo = createNamespacedHelpers('userInfo')
export default {
  data() {
    return {
      searchForm: {},
      booksList:[],
      activeName: '我的待办',
      dataList: [],
    //   loading: {},
      selectedPersonList: [],
      keyWords: '',
      isSelectPersonVisible: false,
      params: {
        orderby: 'createon',
        sort: 'desc'
      },
      dialogVisible: false,
      isEdit: false,
      searchForm: {},
      editFormObj: {},
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      rules: {
        subject: [{ required: true, message: ' ', trigger: 'blur' }],
        departmentname: [{ required: true, message: ' ', trigger: 'blur' }],
        content: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      textMaxLength: 50, // 文本框最大字数限制
      areaMaxLength: 1000, // 文本框最大字数限制
      // 体系分类
      sysLists: [],
      filters: [],


    };
  },
  computed:{
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL;
    },
    action() {
      return `${this.host}/regulation/upload?username=${this.userid}`;
    },
    download() {
      return this.host + "/regulation/download/";
    },
    viewfile() {
      return this.host + "/document/print/";
    },
    userid() {
      return JSON.parse(localStorage.getItem("portalCurrentUserInfo") || "{}")
        .empuid;
    },
    username() {
      return JSON.parse(localStorage.getItem("portalCurrentUserInfo") || "{}")
        .cnname;
    },
  },
  mounted(){
     this.getList()
  },
  methods:{
     toFlow (item) {
      let routeData = ''
      if (this.activeName === '我的待办') {
        routeData = `${process.env.BPM_URL}/#/processForm/approve?processName=${item.projectName}&taskId=${item.taskId}`
      } else if (this.activeName === '我的已办' || this.activeName === '我的申请') {
        routeData = `${process.env.BPM_URL}/#/processForm/view?instanceId=${item.instanceId}`
      } else if (this.activeName === '征求意见跟踪表') {
        routeData = `${process.env.BPM_URL}/#/processForm/view?instanceId=${item.instid}`
      }
      // window.open(routeData.href, "_blank");
      let a = document.createElement('a')
      // 给创建好的a标签赋值
      a.setAttribute('href', routeData)
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
    },
    clickHaddle () {
      this.$router.replace('/rulesCenter/ruleView')
    },
    clickApplyHandle () {
      if (this.activeName === '我的待办') {
        this.$router.replace('/staging/personal/approveList')
      } else if (this.activeName === '我的已办') {
        this.$router.replace('/staging/personal/approveList')
      } else if (this.activeName === '我的申请') {
        this.$router.replace('/staging/personal/approveList')
      } else if (this.activeName === '征求意见跟踪表') {
        this.$router.replace('/staging/personal/approveList')
      }
    },
    handlerSelectPersonComfirm (list) {
      this.$set(this.editFormObj, 'departmentname', list
        .map(item => {
          return item.NAME
        })
        .toString())
      this.$set(this.editFormObj, 'departmentid', list
        .map(item => {
          return item.ID
        })
        .join(','))
    },
    // getDetails (item) {
    //   this.$router.push({
    //     name: 'sysProcessDesign',
    //     query: {
    //       id: item.docId
    //     }
    //   })
    // },

    //我的待办
    myBeingTodoList () {
      axios({
        method: 'post',
        url: `${this.host}/unified-task/query-todo?username=${JSON.parse(localStorage.getItem('portalCurrentUserInfo')).empuid}`,
        data: {
          pageNum: 1,
          pageSize: 10,
          // filters: [],
          logic: 'and',
          attr: { platform: 'PC' }
        },
        headers: {
          token: JSON.parse(localStorage.getItem('portalCurrentUserInfo')).empuid
        }
      }).then(res => {
        this.loading.close()
        if (res.data.status === '200') {
          this.dataList = res.data.data.list
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((e) => {
        this.loading.close()
        this.$message.error('内部错误!')
      })
    },

    //我的已办
    getTrackingTask () {
      axios({
        method: 'post',
        url: `${this.host}/bpm/processquery/v2/mySponsor?username=${JSON.parse(localStorage.getItem('portalCurrentUserInfo')).empuid}`,
        data: {
          pageNum: 1,
          pageSize: 10,
          logic: 'and',
          filters:[{"key":"status","opt":"LIKE","type":"S","value":"已完成"}]
        },
        headers: {
          token: JSON.parse(localStorage.getItem('portalCurrentUserInfo')).empuid
        }
      }).then(res => {
        this.loading.close()
        if (res.data.status === '200') {
          this.dataList = res.data.data.list
        } else {
          this.$message.error(res.data.message)
        }
      })
        .catch((e) => {
          this.loading.close()
          this.$message.error('内部错误!')
        })
    },

    //意见到跟踪表
    getQuery () {
      axios({
        method: 'post',
        url: `${this.host}/bpm/processquery/v2/todo?username=${JSON.parse(localStorage.getItem('portalCurrentUserInfo')).empuid}`,
        data: {
          pageNum: 1,
          pageSize: 10,
          logic: 'and',
          filters:[{"key":"processCnname","opt":"LIKE","type":"S","value":"征求意见"}],
          attr:{"platform":"PC"}
        },
        headers: {
          token: JSON.parse(localStorage.getItem('portalCurrentUserInfo')).empuid
        }
      }).then(res => {
        this.loading.close()
        if (res.data.status === '200') {
          this.dataList = res.data.data.list
        } else {
          this.$message.error(res.data.message)
        }
      })
        .catch((e) => {
          this.loading.close()
          this.$message.error('内部错误!')
        })
    },

    //我的申请
    getMyApplication () {
      axios({
        method: 'post',
        url: `${this.host}/bpm/processquery/v2/mySponsor?username=${JSON.parse(localStorage.getItem('portalCurrentUserInfo')).empuid}`,
        data: {
          pageNum: 1,
          pageSize: 10,
          logic: 'and',
          filters:[],
        },
        headers: {
          token: JSON.parse(localStorage.getItem('portalCurrentUserInfo')).empuid
        }
      }).then(res => {
        this.loading.close()
        if (res.data.status === '200') {
          this.dataList = res.data.data.list
        } else {
          this.$message.error(res.data.message)
        }
      })
        .catch((e) => {
          this.loading.close()
          this.$message.error('内部错误!')
        })
    },
    getWorkBench (obj) {
      obj ={orderby: "createon",
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: "desc",
        logic: "or",
        filters: this.filters,
        attr: { folderid: this.modelid },
      };
      getBooksList(obj).then(res => {
        if (!res) return false
        this.booksList = res.list
      })
    },
    getDataList () {
      this.loading = this.$loading({
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      if (this.activeName === '我的待办') {
        this.myBeingTodoList()
      } else if (this.activeName === '我的已办') {
        this.getTrackingTask()
      } else if (this.activeName === '我的申请') {
        this.getMyApplication()
      } else if (this.activeName === '征求意见跟踪表') {
        this.getQuery()
      }
    },
    getList () {
      this.getDataList()
      this.getWorkBench()
    }
  }
};
</script>

<style lang="scss" scoped>
#workbench {
  padding: 20px;
  .el-card__header {
    padding: 12px 10px;
    border-radius: 2px 2px 0px 0px;
    .card-header {
      border-left: 4px solid #2D42AF;
      padding-left: 5px;
      > span {
        font-size: 15px;
        font-weight: bold;
        color: #333333;
        margin-right: 30px;
      }
      .el-button--text {
        font-size: 12px;
        font-weight: 300;
        color: #999999;
      }
    }
    .my-card {
      &.card-header {
        border: none;
      }
      > span {
        border-bottom: 2px solid transparent;
        cursor: pointer;
      }
      > span.active {
        color: #2D42AF;
        width: 30px;
        border-bottom: 2px solid #2D42AF;
      }
    }
    background: #f5f5f5;
  }
  .card-main {
    border: 1px solid $dc1;
    background-color: #f7fbff;
    border-radius: 5px;
    &:hover {
      border-color: #2D42AF;
    }
    height: 50px;
    font-size: 14px;
    font-weight: 400;
    padding: 10px;
    margin-bottom: 5px;
    &:last-of-type {
      margin-bottom: 0;
    }
    .el-link {
      margin-top: 7px;
      font-size: 14px;
      color: #333333;
      &:hover {
        color: #2D42AF;
      }
    }
    .apply-info {
      margin-top: 7px;
      display: flex;
      color: #666;
      justify-content: space-between;
    }
  }
  .main_tab {
    th {
      height: 40px;
      background: #e5f2ff;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
    }
    .status {
      span {
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
      }
      .coloreccf47 {
        background: #eccf47;
      }
      .color177EE6 {
        background: #2D42AF;
      }
      .color6159FF {
        background: #6159ff;
      }
      .colorB6EC69 {
        background: #b6ec69;
      }
      .color57ddf8 {
        background: #57ddf8;
      }
      .colorB6EC70{
        background: pink;
      }
      .colorB6EC71{
        background: orange;
      }
      .colorB6EC72{
        background: tomato;
      }
      .colorB6EC73{
        background: purple;
      }
    }
  }
}
</style>