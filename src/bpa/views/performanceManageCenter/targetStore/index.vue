<template>
  <div id="targetStore">
    <el-row :gutter="20" class="base-content">
      <el-col :span="5" class="base-col left_tree_wrapper1">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText"
          style="padding: 5px"
        >
        </el-input>
        <el-tree
          class="filter-tree1"
          :data="treelist"
          :props="props"
          node-key="id"
          :filter-node-method="filterNode"
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
      </el-col>
      <el-col :span="19">
        <el-input
          v-model="keyWords"
          :placeholder="pleaseEnterRiskName"
          :title="pleaseEnterRiskName"
          class="search_component"
          clearable
          style="magrin-top: 5px"
          @keyup.13.native="handleCurrentChange(1)"
        >
          <el-button
            slot="append"
            type="primary"
            @click="
              pages.pageNum = 1;
              handleCurrentChange(1);
            "
            >{{ $t("search") }}</el-button
          >
        </el-input>
        <el-table
          :data="formList"
          size="small"
          class="w100 table"
          stripe
          border
        >
          <el-table-column
            type="index"
            :label="number"
            width="70"
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
        <el-pagination
          :current-page="pages.pageNum"
          :page-size="pages.pageSize"
          :total="pages.total"
          background
          layout="prev, pager, next, jumper, total"
          @size-change="handleSizeChange"
          @current-change="currentchange"
        />
      </el-col>
    </el-row>
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
import {
  getprocessValue,
  getListIdByModelId,
  queryKpiInBase,
} from "@/bpa/api/processDesignCenter";
// import paginations from '@/bpa/mixins/pagination_mixin'
export default {
  // mixins: [paginations],
  data() {
    return {
      keyWords: "",
      routerImg: routerImg,
      routerActiveImg: routerActiveImg,
      processList: [],
      grandParentId: "",
      treeKey: 0,
      treelist: "",
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
      filterText: "",
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
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      ids: "",
      number: this.$t("bpa_number"),
      indexCoding: this.$t("indexCoding"),
      indexName: this.$t("indexName"),
      description: this.$t("description"),
      KPIValues: this.$t("KPIValues"),
      plannedValue1: this.$t("plannedValue1"),
      plannedValue2: this.$t("plannedValue2"),
      thresholdValue: this.$t("thresholdValue"),
      pleaseEnterRiskName: this.$t("sindexName"),
    };
  },
  watch: {
    filterText(val) {
      // console.log(this.$refs.tree2)
      this.$refs.tree2.filter(val);
    },
  },
  mounted() {
    this.getlist();
  },
  methods: {
    currentchange(val) {
      this.pages.pageNum = val;
      this.handleCheckChange();
    },
    getlist() {
      getTreeD2Dlist().then((res) => {
        if (!res) return false;
        this.treelist = res;
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    getList() {
      getDataBaseList(this.nodeId).then((res) => {
        if (!res) return false;
        this.updateForm = res.data;
      });
    },
    loadNode(node, resolve) {
      // console.log(node)
      // let id = node.data ? node.data.id : '0'
      // console.log(id)
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
        // this.getList()
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
      this.ids = id;
      // 调用获取表格数据的接口
      let obj = {
        fullFilters: [
          {
            filters: [
              {
                key: "listid",
                opt: "EQ",
                type: "S",
                value: id,
              },
            ],
            logic: "and",
          },
          {
            filters: [
              {
                key: "name",
                opt: "LIKE",
                type: "S",
                value: this.keyWords,
                logic: "or",
              },
              {
                key: "exname",
                opt: "LIKE",
                type: "S",
                value: this.keyWords,
                logic: "or",
              },
            ],
            logic: "and",
          },
        ],
        logic: "and",
        logic: "or",
        orderby: "createon",
        pageNum: this.pages.pageNum,
        pageSize: 10,
        sort: "desc",
      };
      queryKpiInBase(obj).then((res) => {
        if (!res) return false;
        this.formList = res.list;
        this.pages.total = res.total;
      });
    },
    handleSizeChange(val) {},
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.pages.pageNum = val;
      let obj = {
        fullFilters: [
          {
            filters: [
              {
                key: "listid",
                opt: "EQ",
                type: "S",
                value: this.ids,
              },
            ],
            logic: "and",
          },
          {
            filters: [
              {
                key: "name",
                opt: "LIKE",
                type: "S",
                value: this.keyWords,
                logic: "or",
              },
              {
                key: "exname",
                opt: "LIKE",
                type: "S",
                value: this.keyWords,
                logic: "or",
              },
            ],
            logic: "and",
          },
        ],
        logic: "and",
        orderby: "createon",
        pageNum: 1,
        pageSize: 10,
        sort: "desc",
      };
      queryKpiInBase(obj).then((res) => {
        if (!res) return false;
        this.formList = res.list;
        this.pages.total = res.total;
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
#targetStore /deep/ .el-scrollbar__wrap {
  padding: 0 !important;
}
.left_tree_wrapper1,
.table {
  max-height: calc(100vh - 160px);
  overflow: auto;
}
.custom-tree-node {
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
  // &:hover,&:focus {
  //   .add {
  //     display: inherit;
  //     color: #39cdfb;
  //   }
  // }
}
</style>
