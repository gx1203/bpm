<template>
  <div v-loading="load">
    <div class="tool-common-wrap">
      <div class="btn-wrap">
        <el-button type="primary" @click="configForm">{{$t('configurationForm')}}</el-button>
        <el-button type="primary" @click="refreshData">
            {{ $t('refresh') }}
          
        </el-button>
      </div>
    </div>
    <el-tabs v-model="editableTabsValue" type="card">
      <el-tab-pane
        :key="index"
        v-for="(item, index) in editableTabs"
        :label="item.title"
        :name="item.name"
      >
        <modify-process
          @treeRefresh="treeRefresh"
          :content="content1"
          :options3="options3"
          :funidList="funidList"
          :treeData="treeData"
          v-if="editableTabsValue === '1'"
        />
        <the-flow-chart :content="content2" :treeData="treeData" v-if="editableTabsValue === '2'" />
        <back-node :content="content3" :treeData="treeData" v-if="editableTabsValue === '3'" />
        <important-node :content="content7" :treeData="treeData" v-if="editableTabsValue === '7'" />
        <external-interface :content="content8" :treeData="treeData" :nodeList="nodeList" :callorderList="callorderList" :nodeData="nodeData" v-if="editableTabsValue === '8'" @confirm="getExternalInterface" />
        <subject-config :formList="formList" @confirm="getSubjectrule" :content="content4" :treeData="treeData" v-if="editableTabsValue === '4'" />
        <number-config
          :content="content5"
          :treeData="treeData"
          :formList="formList"
          @confirm="getReqNoRule"
          v-if="editableTabsValue === '5'"
        />
        <other-info-config
          :content="content6"
          :formList="formList"
          :treeData="treeData"
          @confirm="getOtherInfo"
          v-if="editableTabsValue === '6'"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import modifyProcess from "./modifyProcess";
import theFlowChart from "./theFlowChart";
import backNode from "./backNode";
import subjectConfig from "./subjectConfig";
import numberConfig from "./numberConfig";
import otherInfoConfig from "./otherInfoConfig";
import importantNode from "./importantNode";
import externalInterface from "./externalInterface";
import {
  getProcessModeData,
  getProcessConfigNode,
  getProcessConfigBackNode,
  getProcessImportantNodeDatas,
  queryEsbServiceConfig
} from "@/bpm/api/process/processModeling/classificationModel";
import { getSubjectrule, getFieldList } from "@/bpm/api/process/processModeling/subject_config";
import { getAllFunction, getDictionaryOption } from "@/bpm/api/process/processModeling/classificationModel";
import { getlinkProjectList } from "@/bpm/api/configManage/link/link_configuration.js";
import { getReqNoRule } from "@/bpm/api/process/processModeling/number_config";
import { getModelTree } from "@/bpm/api/flow";
import { loaddragform } from '@/bpm/api/customForm';
export default {
  components: {
    modifyProcess,
    theFlowChart,
    subjectConfig,
    otherInfoConfig,
    backNode,
    numberConfig,
    importantNode,
    externalInterface
  },
  props: {
    treeData: {
      type: Object
    }
  },
  data() {
    return {
      load: false,
      editableTabsValue: "1",
      editableTabs: [
        {
          title: this.$t('modifyProcessInformation'),
          name: "1",
          content: "修改流程信息"
        },
        {
          title: this.$t('configurationFlowchart'),
          name: "2"
        },
        // {
        //   title: this.$t('configureTheReturnNode'),
        //   name: "3"
        // },
        {
          title: this.$t('configureTheImportantNode'),
          name: "7"
        },
        // {
        //   title: this.$t('configureTheExternalInterface'),
        //   name: "8"
        // },
        {
          title: this.$t('themeRules'),
          name: "4"
        },
        {
          title: this.$t('numberingRules'),
          name: "5"
        },
        // {
        //   title: this.$t('otherInformation'),
        //   name: "6"
        // }
      ],
      nodeData: {},
      callorderList: [],
      nodeList: [],
      formList: [],
      options3: [],
      funidList: [],
      content1: {},
      content2: [],
      content3: [],
      content4: [],
      content5: [],
      content6: [],
      content7: [],
      content8: []
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.basuser.user;
    },
    key() {
      return this.$route.fullPath;
    }
  },
  watch: {
    editableTabsValue(val) {
      console.log(val)
      if (val === "1") {
        this.getModeData();
      } else if (val === "2") {
        this.getNode();
      } else if (val === "3") {
        this.getBackNode();
      } else if (val === "4") {
        this.getSubjectrule();
      } else if (val === "5") {
        this.getReqNoRule();
      } else if (val === "6") {
        this.getOtherInfo();
      } else if (val === "7") {
        this.getImportantNode();
      } else if (val === "8") {
        this.getModelTree();
        this.getTabData();
        this.getExternalInterface();
      }
    },
    treeData(val) {
      this.editableTabsValue = "1";
      this.getModeData();
    }
  },
  mounted() {
    this.getModeData();
    this.getCallorder();
  },
  methods: {
    getOtherInfo() {
      this.load = true;
      getSubjectrule({
        attr: {
          version: this.treeData.version
        },
        filters: [
          {
            key: "processid",
            opt: "LIKE",
            type: "S",
            value: this.treeData.id
          },
          {
            key: "generatetype",
            opt: "LIKE",
            type: "S",
            value: "2"
          }
        ],
        orderby: "sortid",
        sort: "asc"
      })
        .then(rt => {
          this.load = false;
          if (rt.status === "200") {
            this.load = false;
            this.content6 = rt.data.list;
            this.getFieldList();
          }
        })
        .catch(er => {
          this.load = false;
        });
    },
    getFieldList() {
      getFieldList(this.treeData.id, {
        version: this.treeData.version
      })
        .then(rt => {
          if (rt.status === "200") {
            this.formList = rt.data.filter(
              item => item.inputType !== "file" && item.inputType !== "nokt"
            );
          }
        })
        .catch(er => {
          this.load = false;
        });
    },
    configForm() {
      let routeData = this.$router.resolve({
        name: "customForm",
        query: {
          id: this.treeData.id,
          version: this.treeData.version
        }
      });
      // window.opconfigFormen(routeData.href, "_blank");
      let a = document.createElement("a");
      // 给创建好的a标签赋值
      a.setAttribute("href", routeData.href);
      // 设置css 隐藏属性
      a.setAttribute("style", "display:none");
      // 设置 a标签为新窗口打开
      a.setAttribute("target", "_blank");
      // 将设置好的a标签，添加到 body 内
      document.body.appendChild(a);
      // 模拟点击
      a.click();
      // 移除a标签
      a.parentNode.removeChild(a);
    },
    treeRefresh() {
      this.$emit("treeRefresh");
    },
    getBackNode() {
      this.load = true;
      getProcessConfigBackNode({
        id: this.treeData.id,
        pid: this.treeData.pid,
        type: this.treeData.type,
        version: this.treeData.version
      })
        .then(rt => {
          this.load = false;
          this.content3 = rt.data;
        })
        .catch(er => {
          this.load = false;
        });
    },
    getImportantNode() {
      this.load = true;
      getProcessImportantNodeDatas({
        id: this.treeData.id,
        pid: this.treeData.pid,
        type: this.treeData.type,
        version: this.treeData.version
      })
        .then(rt => {
          this.load = false;
          this.content7 = rt.data;
        })
        .catch(er => {
          this.load = false;
        });
    },
    getExternalInterface() {
      this.load = true;
      queryEsbServiceConfig({
        pagenum: 1,
        pagesize: 99999,
        filters: [{
          key: 'processid',
          opt: 'EQ',
          type: 'S',
          value: this.treeData.id
        }]
      })
        .then(rt => {
          this.load = false;
          if (rt.status === '200' && rt.data) {
            this.content8 = rt.data.list || [];
            this.content8.forEach(item => {
              let obj = this.callorderList.find(val => val.value === item.callorder)
              this.$set(item, 'callordername', obj && obj.text ? obj.text : item.callorder)
            })
          }
        })
        .catch(er => {
          this.load = false;
        });
    },
    getModelTree() {
      getModelTree({
        pid: this.treeData.id,
        type: 2
      }).then(rt => {
        this.nodeList = rt.data || []
      })
    },
    getCallorder () {
      getDictionaryOption({
        dictionaryen: '调用顺序'
      }).then(rt => {
        this.callorderList = rt.data || []
      })
    },
    getTabData () {
      console.log('😀1')
      loaddragform(this.treeData.id, {
        version: this.treeData.version
      }).then(rt => {
        if (rt.status === "200") {
          this.nodeData = rt.data;
          console.log('😀3', this.nodeData)
        }
      }).catch(() => {
      });
    },
    getReqNoRule() {
      this.load = true;
      getReqNoRule({
        attr: {
          version: this.treeData.version
        },
        filters: [
          {
            key: "processid",
            opt: "LIKE",
            type: "S",
            value: this.treeData.id
          }
        ],
        orderby: "sort",
        sort: "asc"
      })
        .then(rt => {
          this.load = false;
          if (rt.status === "200") {
            this.load = false;
            this.content5 = rt.data.list;
          }
        })
        .catch(er => {
          this.load = false;
        });
    },
    getSubjectrule() {
      this.load = true;
      getSubjectrule({
        attr: {
          version: this.treeData.version
        },
        filters: [
          {
            key: "processid",
            opt: "LIKE",
            type: "S",
            value: this.treeData.id
          },
          {
            key: "generatetype",
            opt: "LIKE",
            type: "S",
            value: "1"
          }
        ],
        orderby: "sortid",
        sort: "asc"
      })
        .then(rt => {
          this.load = false;
          if (rt.status === "200") {
            this.load = false;
            this.content4 = rt.data.list;
            this.getFieldList();
          }
        })
        .catch(er => {
          this.load = false;
        });
    },
    getModeData() {
      this.load = true;
      getProcessModeData({
        id: this.treeData.id,
        pid: this.treeData.pid,
        type: this.treeData.type,
        version: this.treeData.version
      })
        .then(rt => {
          this.load = false;
          this.content1 = rt.data;
          return getAllFunction();
        })
        .then(rt => {
          this.funidList = rt.data;
          return getlinkProjectList({
            logic: "and",
            pageNum: 1,
        pageSize: 10000,
          });
        })
        .then(rt => {
          this.options3 = rt.data.list;
          this.getFieldList();
        })
        .catch(er => {
          this.load = false;
        });
    },
    getNode() {
      this.load = true;
      getProcessConfigNode({
        id: this.treeData.id,
        pid: this.treeData.pid,
        type: this.treeData.type,
        version: this.treeData.version
      })
        .then(rt => {
          this.load = false;
          this.content2 = rt.data;
        })
        .catch(er => {
          this.load = false;
        });
    },
    refreshData() {
      if (this.editableTabsValue === "1") {
        this.getModeData();
      } else if (this.editableTabsValue === "2") {
        this.getNode();
      } else if (this.editableTabsValue === "3") {
        this.getBackNode();
      } else if (this.editableTabsValue === "4") {
        this.getSubjectrule();
      } else if (this.editableTabsValue === "5") {
        this.getReqNoRule();
      } else if (this.editableTabsValue === "6") {
        this.getOtherInfo();
      } else if (this.editableTabsValue === "7") {
        this.getImportantNode();
      } else if (this.editableTabsValue === "8") {
        this.getModelTree();
        this.getTabData();
        this.getExternalInterface();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.item-left {
  float: left;
  width: 20%;
}
.item-right {
  float: right;
  width: 78%;
  .table-header {
    position: relative;
    background: $bc2;
    display: flex;
    align-items: center;
    .all-check {
      position: absolute;
      left: 20px;
    }
  }
}
</style>
