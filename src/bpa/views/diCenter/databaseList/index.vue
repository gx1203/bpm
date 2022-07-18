<template>
  <div id="database">
    <el-main class="di__main">
      <el-row :span="24" class="margin-b15">
        <el-col :span="5" class="di__router-container" :offset="2">
          <router-link :to="{ path: '/diCenter/home' }" class="di__router">
            <img :src="routerImg" class="w80" alt="图片" />
            <span class="absolute header-database">{{
              $t("operationAndMonitoring")
            }}</span>
          </router-link>
        </el-col>
        <el-col :span="5" class="di__router-container">
          <router-link
            :to="{ name: 'databaselist' }"
            class="di__router base_router"
          >
            <img
              :src="
                route.includes('/diCenter/databaseList')
                  ? routerActiveImg
                  : routerImg
              "
              alt="图片"
              class="w80"
            />
            <span class="absolute header-database1">{{
              $t("indicatorsOfLibrary")
            }}</span>
          </router-link>
        </el-col>
        <el-col :span="5" class="di__router-container">
          <router-link :to="{ name: 'home' }" class="di__router">
            <img :src="routerImg" alt="图片" class="w80" />
            <span class="absolute header-database left143px">{{
              $t("riskControl")
            }}</span>
          </router-link>
        </el-col>
        <el-col :span="5" class="di__router-container">
          <router-link :to="{ name: 'doorCenter' }" class="di__router">
            <img :src="routerImg" alt="图片" class="w80" />
            <span class="absolute header-database2">{{ $t("portal") }}</span>
          </router-link>
        </el-col>
        <el-col :span="2" class="di__router-container">
          <el-button
            type="primary"
            icon="fa fa-reply"
            class="cursor-pointer"
            @click="$router.go(-1)"
            >{{ $t("return") }}</el-button
          >
        </el-col>
      </el-row>
      <el-row :gutter="20" class="base-content">
        <div class="base-content-item clear-fix">
          <el-col :span="5" class="base-col">
            <el-row>
              <el-col :span="20">
                <div class="base-title">{{ $t("KPILibrary") }}</div>
              </el-col>
              <el-col :span="4">
                <!-- <el-button type="text" class="base-button" @click="allOpen">全部展开</el-button> -->
              </el-col>
            </el-row>
            <el-scrollbar class="left_tree_wrapper1 margin-t20">
              <el-tree
                class="filter-tree1"
                :data="treelist"
                :props="props"
                node-key="id"
                :default-expand-all="defaultExpand"
                :expand-on-click-node="false"
                ref="tree2"
                :key="treeKey"
                @node-click="handleCheckChange"
              >
                <div
                  class="custom-tree-node"
                  slot-scope="{ node, data }"
                  @click="handlerNodeClick(data, node)"
                >
                  <p class="grow" :title="node.label">
                    <i
                      v-if="data.type === '流程'"
                      class="fa fa-university fa-2"
                      aria-hidden="true"
                    ></i>
                    <i
                      v-if="data.type === '绩效'"
                      class="fa fa-star fa-2"
                      aria-hidden="true"
                    ></i>
                    {{ node.label }}
                  </p>
                </div>
              </el-tree>
            </el-scrollbar>
          </el-col>
          <el-col :span="19">
            <el-table :data="formList" size="small" class="w100">
              <el-table-column
                type="index"
                :label="number"
                width="50"
                align="center"
              ></el-table-column>
              <!-- <el-table-column
                prop="kpicode"
                :label="indexCoding"
                width="100"
                align="center"
              ></el-table-column> -->
              <el-table-column
                prop="name"
                :label="indexName"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="description"
                :label="description"
                width="100"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="exname"
                :label="KPIValues"
                width="240"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="pvalue1"
                :label="plannedValue1"
                width="100"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="pvalue2"
                :label="plannedValue2"
                width="100"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="threshold"
                :label="thresholdValue"
                width="100"
                align="center"
              ></el-table-column>
            </el-table>
            <el-pagination :current-page="pages.pageNum" :page-size="pages.pageSize" background layout="prev, pager, next, jumper, total" :total="pages.total" class="margin-t15" @current-change="handleCurrentChange" />
          </el-col>
        </div>
      </el-row>
    </el-main>
  </div>
</template>
<script>
import routerImg from "@/bpa/assets/img/qietu/router.png";
import routerActiveImg from "@/bpa/assets/img/qietu/router_active.png";
import {
  getTreelist,
  getDataBaseList,
  getFormList,
  getTreeD2Dlist,
} from "@/bpa/api/diCenter";
import { queryKpiInBase } from "@/bpa/api/processDesignCenter";
export default {
  data() {
    return {
      treelist: "",
      routerImg: routerImg,
      routerActiveImg: routerActiveImg,
      processList: [],
      grandParentId: "",
      treeKey: 0,
      props: {
        label: "name",
        children: "childrenlist",
        isLeaf: function (data, node) {
          if (data.isparent === true) {
            return false;
          } else {
            return true;
          }
        },
      },
      updateForm: {
        id: "",
        kpicode: "",
        kpiname: "",
        description: "",
        exname: "",
        pvalue1: "",
        pvalue2: "",
        threshold: "",
        vcid: "",
      },
      updateForm1: {
        code: "",
        name: "",
        lastname: "",
      },
      node: "",
      resolve: "",
      nodeCode: "",
      defaultExpand: false,
      childrenlist: [],
      formList: [],
      number: this.$t("bpa_number"),
      indexCoding: this.$t("indexCoding"),
      indexName: this.$t("indexName"),
      description: this.$t("description"),
      KPIValues: this.$t("KPIValues"),
      plannedValue1: this.$t("plannedValue1"),
      plannedValue2: this.$t("plannedValue2"),
      thresholdValue: this.$t("thresholdValue"),
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
    };
  },
  mounted() {
    this.getD2d();
  },
  methods: {
    getD2d() {
      getTreeD2Dlist().then((res) => {
        if (!res) return false;
        this.treelist = res;
      });
    },
    getList() {
      getDataBaseList(this.nodeId).then((res) => {
        if (!res) return false;
        this.updateForm = res;
      });
    },
    handleCurrentChange(val) {
      this.pages.pageNum = val
      this.handleCheckChange()
    },
    handlerNodeClick(data, node) {
      this.nodeId = data.id;
      if (data.type == "流程") {
        this.nodeCode = false;
        this.updateForm1.name = data.name;
        if (node.parent.data) {
          this.updateForm1.lastname = node.parent.data.name;
        }
      } else {
        this.nodeCode = true;
        // this.getList();
      }
    },
    allOpen() {
      this.defaultExpand = true;
      ++this.treeKey;
    },
    handleCheckChange() {
      // alert(111)
      // 获取到选中节点的id
      let id = this.$refs.tree2.getCurrentKey();
      // 调用获取表格数据的接口
      let obj = {
        filters: [{ key: "listid", value: id }],
        orderby: "createon",
        pageNum: this.pages.pageNum,
        pageSize: 10,
        sort: "desc",
      };
      queryKpiInBase(obj).then((res) => {
        if (!res) return false;
        this.formList = res.list;
        this.pages.total = res.total
      });
    },
  },
  computed: {
    route() {
      return this.$route.fullPath;
    },
  },
};
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
  &:hover,
  &:focus {
    .add {
      display: inherit;
      color: #39cdfb;
    }
  }
}
#database {
  width: 100%;
  height: calc(100vh);
  background: url("../../../assets/img/qietu/beijing.png") no-repeat center
    center;
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
    .el-button {
      position: absolute;
      top: 28px;
      right: 18px;
      background-color: transparent;
      border-color: #294695;
      border-radius: 0;
      color: #37b2d5;
      padding: 12px;
      font-size: 14px;
      /deep/ i {
        margin-right: 9px;
      }
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
    left: 125px !important;
  }
  .header-database.left143px {
    left: 143px !important;
  }
  .header-database1 {
    left: 135px !important;
  }
  .header-database2 {
    left: 146px !important;
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
      overflow: auto !important;
    }
  }
  .button-base {
    .el-button {
      background: #169bd5;
      border: 1px solid #3378b9;
      color: #00d6e6;
      &:hover,
      &:focus {
        color: #39cdfb;
      }
    }
  }
  .base-title {
    color: #3276b5;
    font-size: 19px;
  }
}
.targetSign {
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
.bg-yellow {
  background-color: rgba(255, 255, 0, 1);
}
.bg-red {
  background-color: rgba(255, 0, 0, 1);
}
.bg-lightGray {
  background-color: rgba(204, 204, 204, 1);
}
/deep/.el-table {
  color: #fff;
  background-color: transparent;
  thead {
    color: #fff;
    font-weight: 700;
  }
  & td,
  & th.is-leaf {
    border-bottom: 1px solid #4d576f;
  }
  & th,
  & tr {
    background-color: transparent;
  }
  &:before {
    background-color: #4d576f;
  }
}
/deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: rgba(13, 45, 74, 0.5);
}
</style>
