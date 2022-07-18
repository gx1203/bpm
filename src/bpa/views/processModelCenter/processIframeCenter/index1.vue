<template>
  <div class="w100 pos-relative" id="processIframeCenter">
    <div class="processCount" v-if="showCount">
      <p>
        <span>{{countProcess.totalnum}}</span>
        <br />流程数目
      </p>
      <hr />
      <p>
        <span>{{countProcess.releasenum}}</span>
        <br />流程发布数目
      </p>
    </div>
    <iframe
      ref="iFrame"
      v-if="!showProcessTree"
      class="w100 h100"
      src="./leftMenu/processFramework/BaseNewPage.html?id=AAA&listid=7D36536AC5DD6356E0530701A8C0D2D1&treeId=79957553BD303978E053BF1A13ACD486&processName=构建愿景和战略&username=付大鹏&processNum=1.0&isRead=yes"
    ></iframe>
    <div id="process_tree_wrapper" class="process-tree-wrapper" v-show="showProcessTree">
      <div class="toolbox">
        <el-tooltip class="font22 margin-r5" effect="dark" :content="$t('amplification')" placement="top-start">
          <i class="el-icon-zoom-in cursor-pointer vertical-middle" @click="modifyScreen('zoomIn')"></i>
        </el-tooltip>
        <el-tooltip class="font22 margin-r5" effect="dark" :content="$t('narrow')" placement="top-start">
          <i
            class="el-icon-zoom-out cursor-pointer vertical-middle"
            @click="modifyScreen('zoomOut')"
          ></i>
        </el-tooltip>
        <el-tooltip class="font22 margin-r5" effect="dark" :content="$t('rotate')" placement="top-start">
          <i class="el-icon-refresh cursor-pointer vertical-middle" @click="modifyScreen('rotate')"></i>
        </el-tooltip>
        <el-tooltip class="font22 margin-r5" effect="dark" :content="$t('fullScreen')" placement="top-start">
          <span
            class="el-icon-rank cursor-pointer vertical-middle"
            @click="modifyScreen('fullscreen')"
          ></span>
        </el-tooltip>
        <el-tooltip class="font22 margin-r5" effect="dark" :content="$t('returnList')" placement="top-start">
          <i class="el-icon-back cursor-pointer vertical-middle" @click="modifyScreen('back')"></i>
        </el-tooltip>
      </div>
      <div id="process_tree" ref="processTree" class="process-tree w100"></div>
    </div>
  </div>
</template>

<script>
// 引入echarts
import echarts from "echarts";

import $ from "jquery";

import {
  getProcessTree,
  getProcessCount
} from "@/bpa/api/processModelCenter/processIframeCenter";

export default {
  data() {
    return {
      processFrameList: [],
      treeScaleTo: 1,
      showCount: true,
      treeOption: "",
      treeOrient: "horizontal",
      showProcessTree: false,
      countProcess: {
        totalnum: 0,
        releasenum: 0
      }
    };
  },
  computed: {
    orgTreeoptions() {
      let _this = this;
      return {
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove",
          formatter(params) {
            let [inputname, outputnam] = [[], []];
            if (params.data.imputlist && params.data.imputlist.length > 0) {
              params.data.imputlist.forEach(obj => {
                inputname.push(obj.code + obj.name);
              });
              inputname = inputname.join("、");
            }
            if (params.data.outlist && params.data.outlist.length > 0) {
              params.data.outlist.forEach(obj => {
                outputnam.push(obj.code + obj.name);
              });
              outputnam = outputnam.join("、");
            }
            let res = "";
            if (params.data.name) {
              res = "名称：" + params.data.name;
            }
            if ($.trim(inputname)) {
              res += "</br>上游流程：" + inputname;
            }
            if ($.trim(outputnam)) {
              res += "</br>下游流程：" + outputnam;
            }
            return res;
          }
        },
        series: [
          {
            type: "tree",
            top: "20",
            bottom: "20",
            left: "7%",
            roam: true,
            orient: _this.treeOrient,
            zoom: _this.treeScaleTo,
            scaleLimit: {
              min: 0.8
            },
            expandAndCollapse: false,
            data: _this.processFrameList,
            symbol: "image://./assets/img/images/enterprise05.jpg",
            symbolSize: [150, 50],
            label: {
              normal: {
                position: "inside",
                verticalAlign: "middle",
                align: "center",
                offset: [10, 0],
                width: 110,
                fontSize: 12,
                rich: {
                  box: {
                    align: "center"
                  }
                }
              },
              leaves: {
                position: "inside",
                verticalAlign: "middle",
                align: "center"
              }
            },
            lineStyle: {
              normal: {
                color: "#3692d3",
                width: 2,
                curveness: 0.7
              }
            },
            initialTreeDepth: 6,
            expandAndCollapse: false,
            animationDuration: 150,
            animationDurationUpdate: 550
          }
        ]
      };
    }
  },
  created() {
    // 需要外部调用的方法
    let _this = this;
    // 获取组织树
    window["getProcessTree"] = processid => {
      _this.showProcessTree = true;
      _this.getProcessTree(processid);
    };
    // 改变状态
    window["changeIframe"] = () => {
      _this.showProcessTree = false;
    };
  },
  mounted() {
    this.$refs.iFrame.style.height =
      document.documentElement.clientHeight - 160 + "px";
    if (this.$route.query.id) {
      this.showProcessTree = true;
      this.getProcessTree(this.$route.query.id);
    }
    // this.getProcessTree('79957553BD303978E053BF1A13ACD486')
    this.getprocessCount();
  },
  methods: {
    modifyScreen(type) {
      let _this = this;
      switch (true) {
        case type === "zoomIn":
          _this.treeScaleTo = (_this.treeScaleTo * 100 + 3) / 100;
          _this.treeOption.setOption(_this.orgTreeoptions, true);
          break;
        case type === "zoomOut":
          _this.treeScaleTo = (_this.treeScaleTo * 100 - 3) / 100;
          _this.treeOption.setOption(_this.orgTreeoptions, true);
          break;
        case type === "rotate":
          _this.treeOrient =
            _this.treeOrient === "vertical" ? "horizontal" : "vertical";
          _this.treeOption.setOption(_this.orgTreeoptions, true);
          break;
        case type === "fullscreen":
          break;
        case type === "back":
          _this.showProcessTree = false;
          _this.$nextTick(() => {
            _this.$refs.iFrame.style.height =
              document.documentElement.clientHeight - 160 + "px";
          });
          break;
      }
    },
    // 统计流程树数目
    getprocessCount() {
      let _this = this;
      getProcessCount().then(res => {
        if (!res) return false
        _this.countProcess = {
          totalnum: res.totalnum,
          releasenum: res.releasenum
        };
      });
    },
    async getProcessData(processid, status) {
      let response = await getProcessTree({ id: processid, state: status });
      return new Promise((resolve, reject) => {
        resolve(response);
      });
    },
    async getProcessTree(processid) {
      let _this = this;
      let response = await _this.getProcessData(processid, "0");
      _this.$refs.processTree.style.height =
        response.children.length * 80 + "px";
      _this.treeOption = echarts.init(_this.$refs.processTree);

      let index = 0;
      for (let i = 0; i < response.children.length; i++) {
        if (
          !!response.children[i].children &&
          response.children[i].children.length > 0
        ) {
          index = i;
          break;
        }
      }
      let res = await Promise.all([
        this.initFrameData([response]),
        this.initFrameData(response.children),
        this.initFrameData(response.children[index].children)
      ]);
      res[1][0].children = res[2];
      res[0][0].children = res[1];
      _this.processFrameList = res[0];
      _this.treeOption.setOption(_this.orgTreeoptions, true);
      _this.treeOption.on("click", async params => {
        if (!params.data.id || !params.data.isparent) return false;
        if (!params.data.children) {
          let response = await _this.getProcessData(
            params.data.id,
            params.data.level
          );
          let res = await this.initFrameData(response.children);
          _this.lookforsameId(_this.processFrameList, params.data.id, res, 0);
        } else {
          _this.lookforsameId(
            _this.processFrameList,
            params.data.id,
            [],
            params.data.children.length
          );
        }
        _this.treeOption.setOption(_this.orgTreeoptions, true);
      });
    },
    // 判断是否有上下级, 上下游流程
    initFrameData(initdata) {
      initdata.forEach(obj => {
        obj.collapsed = false;
        obj.name = obj.name.replace(/[ ]/g, "");
        obj.name = obj.name.replace(/[\r\n]/g, "");
        if (obj.name.length > 10 && obj.name.indexOf("\n") == -1) {
          obj.name = obj.name.substr(0, 9) + "\n" + obj.name.substr(9);
        }
        if (obj.level == "1") {
          obj.symbol = `image://${require("@/bpa/assets/img/enterindex.png")}`;
          obj.label = {
            position: ["45%", "45%"]
          };
        } else if (obj.level == "2") {
          obj.label = { normal: { offset: [18, 0] } };
          if (obj.isparent) {
            if (obj.imputlist && obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise01all.png")}`;
            } else if (obj.imputlist && !obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise01in_c.png")}`;
            } else if (!obj.imputlist && obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise01out_c.png")}`;
            } else if (!obj.imputlist && !obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise01c.png")}`;
            }
          } else {
            if (obj.imputlist && obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise01inout.png")}`;
            } else if (obj.imputlist && !obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise01in.png")}`;
            } else if (!obj.imputlist && obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise01inout.png")}`;
            } else if (!obj.imputlist && !obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise01.png")}`;
            }
          }
        } else if (obj.level == "3") {
          if (obj.isparent) {
            if (obj.imputlist && obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise02all.png")}`;
            } else if (obj.imputlist && !obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise02in_c.png")}`;
            } else if (!obj.imputlist && obj.outlist) {
              obj.symbol = "image://./assets/img/enterprise02out_c.png";
            }
            if (!obj.imputlist && !obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise02c.png")}`;
            }
          } else {
            if (obj.imputlist && obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise02inout.png")}`;
            } else if (obj.imputlist && !obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise02in.png")}`;
            } else if (!obj.imputlist && obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise02inout.png")}`;
            } else if (!obj.imputlist && !obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise02.png")}`;
            }
          }
        } else if (obj.level == "4") {
          if (obj.isparent) {
            if (obj.imputlist && obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise03all.png")}`;
            } else if (obj.imputlist && !obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise03in_c.png")}`;
            } else if (!obj.imputlist && obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise03out_c.png")}`;
            } else if (!obj.imputlist && !obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise03c.png")}`;
            }
          } else {
            if (obj.imputlist && obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise03inout.png")}`;
            } else if (obj.imputlist && !obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise03in.png")}`;
            } else if (!obj.imputlist && obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise03inout.png")}`;
            } else if (!obj.imputlist && !obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise03.png")}`;
            }
          }
        } else if (obj.level == "5") {
          if (obj.isparent) {
            if (obj.imputlist && obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise04all.png")}`;
            } else if (obj.imputlist && !obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise04in_c.png")}`;
            } else if (!obj.imputlist && obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise04out_c.png")}`;
            } else if (!obj.imputlist && !obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise04c.png")}`;
            }
          } else {
            if (obj.imputlist && obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise04inout.png")}`;
            } else if (obj.imputlist && !obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise04in.png")}`;
            } else if (!obj.imputlist && obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise04inout.png")}`;
            } else if (!obj.imputlist && !obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise04.png")}`;
            }
          }
        } else if (obj.level == "6") {
          if (obj.isparent) {
            if (obj.imputlist && obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise05all.png")}`;
            } else if (obj.imputlist && !obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise05in_c.png")}`;
            } else if (!obj.imputlist && obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise05out_c.png")}`;
            } else if (!obj.imputlist && !obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise05c.png")}`;
            }
          } else {
            if (obj.imputlist && obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise05inout.png")}`;
            } else if (obj.imputlist && !obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise05in.png")}`;
            } else if (!obj.imputlist && obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise05inout.png")}`;
            } else if (!obj.imputlist && !obj.outlist) {
              obj.symbol = `image://${require("@/bpa/assets/img/enterprise05.png")}`;
            }
          }
        }
      });
      return new Promise((resolve, reject) => {
        resolve(initdata);
      });
    },
    // 寻找id
    lookforsameId(initdata, id, children, length) {
      initdata.forEach(obj => {
        if (obj.id === id) {
          if (length > 0) {
            obj.collapsed = !obj.collapsed;
            return false;
          }
          obj.collapsed = false;
          obj.children = children;
          return false;
        } else if (obj.children && obj.children.length > 0) {
          return this.lookforsameId(obj.children, id, children, length);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#processIframeCenter {
  .processCount {
    position: absolute;
    top: 20px;
    right: 15px;
    padding: 8px 8px 15px 8px;
    background-color: #fff;
    margin: 0;
    left: auto;
    border: 1px solid #97a7a7;
    z-index: 999;
    p {
      margin-bottom: 0;
      text-align: center;
      font-size: 12px;
      span {
        color: #4b7486;
        font-size: 18px;
        line-height: 36px;
        font-weight: bold;
      }
      hr {
        margin: 20px 10px 10px;
        border-color: #e8edf0;
      }
    }
  }
}
</style>
