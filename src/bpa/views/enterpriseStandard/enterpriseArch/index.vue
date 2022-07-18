<template>
  <div id="enterpriseArch" class="w100">
    <el-row :gutter="10">
      <el-col :span="24">
        <!--<el-scrollbar class="left_tree_wrapper">-->
          <process-frame-show2 :id="chooseId" :system-list="systemList" />
        <!--</el-scrollbar>-->
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getRegulationTreeId
} from '@/bpa/api/doorCenter'
import { getResponsibilitiesList } from '@/bpa/api/processModelCenter/rulesAndRegulations/responsibilities'
import processFrameShow2 from './components/processFrameShow2'
export default {
  name: 'enterpriseArch',
  components: {
    processFrameShow2
  },
  data() {
    return {
      chooseId: '9',
      systemList: {}, // 房子数据
      // 新闻管理
      newsmanage: {},
      // 流程学习
      studymanage: [],
      operat: []
    }
  },
  computed: {
    host() {
      return process.env.HOST_URL + process.env.BASE_URL
    },
    username() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .cnname
    },
    userid() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .empuid
    }
  },
  mounted() {
    this.getRegulationTreeId()
  },
  methods: {
    getRegulationTreeId() {
      getRegulationTreeId(this.chooseId).then((res) => {
        this.systemList = {
          main: res.main,
          strategy: [{
            foldername: '企业标准体系',
            id: '9'
          }],
          topStrategy: res.strategy,
          support: res.support
        }
      })
    },
    // getRuleData() {
    //   if (this.ruleData.length === 0) {
    //     Promise.all([
    //       getResponsibilitiesList({
    //         orderby: 'createon',
    //         pageNum: 1,
    //         pageSize: 5,
    //         sort: 'desc',
    //         attr: { folderid: '10584' },
    //         filters: this.filters,
    //         logic: 'and'
    //       })
    //     ]).then((res) => {
    //       this.studymanage = res[0].list // 流程制度
    //     })
    //   } else {
    //     this.newsmanage = [] // 架构管理
    //     this.studymanage = [] // 流程制度
    //     this.operat = [] // 权责手册
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
.left_tree_wrapper.el-scrollbar {
  height: calc(100vh - 160px) !important;
  .custom-tree-node {
    width: calc(100% - 24px);
    display: flex;
    align-items: center;
    box-sizing: border-box;
    p {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
.rightPart {
  height: calc(100vh - 160px) !important;
}
/deep/ .iconClass {
  /*color: #409EFF;*/
}
.el-scrollbar__bar.is-horizontal>div{
  width: auto;
}
</style>
