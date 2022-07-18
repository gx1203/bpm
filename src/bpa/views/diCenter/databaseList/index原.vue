<template>
  <div id="database">
    <el-main class="di__main">
      <el-row :span="24" class="margin-b15">
        <el-col :span="6" class="di__router-container">
          <router-link
            :to="{path: '/diCenter/home'}"
            class="di__router"
          >
            <img :src="routerImg" class="w80" alt="图片" >
            <span class="absolute header-database">运营监控</span>
          </router-link>
        </el-col>
        <el-col :span="6" class="di__router-container">
          <router-link :to="{name: 'databaselist'}" class="di__router base_router">
            <img :src="route.includes('/diCenter/databaseList')?routerActiveImg : routerImg" alt="图片" class="w80">
            <span class="absolute header-database1">指标库</span>
          </router-link>
        </el-col>
        <el-col :span="6" class="di__router-container">
          <router-link :to="{name: 'home'}" class="di__router">
            <img :src="routerImg" alt="图片" class="w80" />
            <span class="absolute header-database left143px">风控</span>
          </router-link>
        </el-col>
        <el-col :span="6" class="di__router-container">
          <router-link :to="{name: 'doorCenter'}" class="di__router">
            <img :src="routerImg" alt="图片" class="w80">
            <span class="absolute header-database2">门户</span>
          </router-link>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="base-content">
        <div class="base-content-item clear-fix">
          <el-col :span="6" class="base-col">
            <el-row>
              <el-col :span="20">
                <div class="base-title">KPI指标库</div>
              </el-col>
              <el-col :span="4">
                <!-- <el-button type="text" class="base-button" @click="allOpen">全部展开</el-button> -->
              </el-col>
            </el-row>
            <el-scrollbar class="left_tree_wrapper1 margin-t20">
              <el-tree
                class="filter-tree1"
                :props="props"
                :load="loadNode"
                node-key="id"
                lazy
                :default-expand-all="defaultExpand"
                :default-expanded-keys="[grandParentId]"
                :expand-on-click-node="false"
                ref="tree2"
                :key="treeKey"
              >
                <div class="custom-tree-node" slot-scope="{ node, data }" @click="handlerNodeClick(data, node)">
                  <p class="grow" :title="node.label">
                    <i v-if="data.type === '流程'" class="fa fa-university fa-2" aria-hidden="true"></i>
                    <i v-if="data.type === '绩效'" class="fa fa-star fa-2" aria-hidden="true"></i>
                    {{ node.label }}
                  </p>
                </div>
              </el-tree>
            </el-scrollbar>
          </el-col>
          <el-col :span="18" >
            <el-scrollbar class="right-content1">
              <div v-if="!nodeCode">
                <el-row class="right-base margin-b15">
                  <el-col :span="24" class="margin-b15">
                    <span>流程编码</span>
                    <el-input v-model="updateForm1.code" disabled></el-input>
                  </el-col>
                  <el-col :span="24" class="margin-b15">
                    <span>流程名称</span>
                    <el-input v-model="updateForm1.name"  disabled></el-input>
                  </el-col>
                  <el-col :span="24" class="margin-b15">
                    <span>上级流程</span>
                    <el-input v-model="updateForm1.lastname"  disabled></el-input>
                  </el-col>
                </el-row>
              </div>
              <div v-if="nodeCode">
                <el-row class="right-base">
                  <el-col :span="24" class="margin-b15">
                    <span>指标编码</span>
                    <el-input clearable v-model="updateForm.kpicode" disabled></el-input>
                  </el-col>
                  <el-col :span="24" class="margin-b15">
                    <span>指标名称</span>
                    <el-input clearable v-model="updateForm.kpiname"  disabled></el-input>
                  </el-col>
                  <el-col :span="24" class="margin-b15">
                    <span style="margin-bottom: 29px;">描述</span>
                    <el-input clearable v-model="updateForm.description"  type="textarea" disabled></el-input>
                  </el-col>
                  <el-col :span="24" class="margin-b15">
                    <span>KPI值</span>
                    <el-input clearable v-model="updateForm.exname"  disabled></el-input>
                  </el-col>
                  <el-col :span="24" class="margin-b15">
                    <span>计划值1</span>
                    <el-input clearable v-model="updateForm.pvalue1"  disabled></el-input>
                  </el-col>
                  <el-col :span="24" class="margin-b15">
                    <span>计划值2</span>
                    <el-input clearable v-model="updateForm.pvalue2"  disabled></el-input>
                  </el-col>
                  <el-col :span="24" class="margin-b15">
                    <span>阈值(MinMax）</span>
                    <el-input clearable v-model="updateForm.threshold"  disabled></el-input>
                  </el-col>
                  <el-col :span="24" class="margin-b15">
                    <span class="float-l">图例</span>
                    <div class="float-l">
                      <p class="targetSign bg-lightGreen margin-b10">计划值1 < KPI值</p>
                      <p class="targetSign bg-yellow margin-b10">计划值2 < KPI值 ≤ 计划值1</p>
                      <p class="targetSign bg-red margin-b10">阈值 < KPI值 ≤ 计划值2</p>
                      <p class="targetSign bg-lightGray margin-b10">KPI值 ≤ 阈值</p>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-scrollbar>
          </el-col>
        </div>
      </el-row>
    </el-main>
  </div>
</template>
<script>
import routerImg from '@/bpa/assets/img/qietu/router.png'
import routerActiveImg from '@/bpa/assets/img/qietu/router_active.png'
import {
  getTreelist,
  getDataBaseList
} from '@/bpa/api/diCenter'
export default {
  data() {
    return {
      routerImg: routerImg,
      routerActiveImg: routerActiveImg,
      processList: [],
      grandParentId: '',
      treeKey: 0,
      props: {
        label: 'name',
        isLeaf: function(data, node) {
          if (data.isparent === true) {
            return false
          } else {
            return true
          }
        }
      },
      updateForm: {
        id: '',
        kpicode: '',
        kpiname: '',
        description: '',
        exname: '',
        pvalue1: '',
        pvalue2: '',
        threshold: '',
        vcid: ''
      },
      updateForm1: {
        code: '',
        name: '',
        lastname: ''
      },
      node: '',
      resolve: '',
      nodeCode: '',
      defaultExpand: false,
      childrenlist: []
    }
  },
  mounted() {
  },
  methods: {
    getList() {
      getDataBaseList(this.nodeId).then(res => {
        console.log(res)
        this.updateForm = res
      })
    },
    loadNode(node, resolve) {
      console.log(node)
      let id = node.data ? node.data.id : '0'
      console.log(id)
      getTreelist(id).then(res => {
        console.log(res)
        if (id === '0') {
          this.grandParentId = res[0].id
        }
        resolve(res)
      })
    },
    handlerNodeClick(data, node) {
      this.nodeId = data.id
      console.log(data.type)
      if (data.type == '流程') {
        this.nodeCode = false
        this.updateForm1.name = data.name
        if (node.parent.data) {
          this.updateForm1.lastname = node.parent.data.name
        }
      } else {
        this.nodeCode = true
        this.getList()
      }
    },
    allOpen() {
      this.defaultExpand = true
      ++this.treeKey
    }
  },
  computed: {
    route() {
      return this.$route.fullPath
    }
  }
}
</script>

<style lang="scss" scoped>
  .custom-tree-node {
    width: calc(100% - 24px);
    display: flex;
    align-items: center;
    box-sizing: border-box;
    .grow {
      max-width: 100%;
      min-width: 60%;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 70px;
    }
    .add {
      color: $tc5;
      padding: 5px;
      display: none;
    }
    &:hover,&:focus {
      .add {
        display: inherit;
        color: #39cdfb;
      }
    }
  }
  #database {
    width: 100%;
    height: calc(100vh);
    background: url("../../../assets/img/qietu/beijing.png") no-repeat center center;
    background-size: 100% 100%;
    .di__router-container {
      :hover {
        span {
          color: #39cdfb;
        }
      }
      span {
        color: #2e77bb;
        font-size: 22px;
      }
      position: relative;
      span {
        left: 128px;
        top: 18px;
      }
    }
    .di__router {
      padding-left: 30px;
      /*background: url("") no-repeat;*/
      background-size: 100% 100%;
    }
    .absolute {
      position: absolute;
      z-index: 2;
    }
    .base_router {
      span {
        color: #39cdfb;
      }
    }
    .header-database {
      left: 125px!important;
    }
    .header-database.left143px{
      left: 143px!important;
    }
    .header-database1 {
      left: 135px!important;
    }
    .header-database2 {
      left: 146px!important;
    }
    .base-content {
      border: 1px solid #1d4f7e;
      border-radius: 3px;
      margin: 0 22px !important;
      /*box-shadow: 5px 5px 10px #1d4f7e;*/
      box-shadow: #1d4f7e 0px 0px 15px 5px inset;
      .base-content-item {
        padding: 20px;
        .base-button {
          color: #00d6e6;
        }
      }
    }
    .left_tree_wrapper1.el-scrollbar {
      height: calc(100vh - 210px) !important;
      /*background: #23356d;*/
      .el-scrollbar__wrap {
        overflow: auto!important;
      }
    }
    .button-base {
      .el-button {
        background: #169bd5;
        border: 1px solid #3378b9;
        color: #00d6e6;
        &:hover,&:focus {
          color: #39cdfb;
        }
      }
    }
    .base-title {
      color: #3276b5;
      font-size: 19px;
    }
  }
  .targetSign{
    width: 318px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    -moz-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
    -webkit-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
  }
  .bg-lightGreen {
      background-color: rgba(208, 225, 125, 1);
  }
  .bg-yellow{
    background-color: rgba(255, 255, 0, 1);
  }
  .bg-red {
    background-color: rgba(255, 0, 0, 1);
  }
  .bg-lightGray {
    background-color: rgba(204, 204, 204, 1);
  }
</style>
