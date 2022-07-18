<template>
  <div id="frameShow" ref="frameShowHead">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="tab in tabList"
        :key="tab.id"
        :label="tab.name"
        :name="tab.id"
      >
      </el-tab-pane>
    </el-tabs>
    <div ref="frameShow" class="w100 trans-origin">
      <div v-if="styles == 1">
        <div class="box-header out-click"
             id="click-header-1"
             @click="outOnClick($event)"
             v-if="data.strategy.length !== 0">
          <div class="box-header-box">
            <div class="box-header-wrod">
              <div class="bottom-border" @click="nodeClickS(data.strategy[0])">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="data.strategy[0].code + data.strategy[0].name"
                  placement="top"
                >
                  <span v-if="data.strategy && data.strategy.length > 0">
                    {{ data.strategy[0].code + data.strategy[0].name }}<br/>
                    {{ data.strategy[0].enname }}
                  </span>
                </el-tooltip>
                <i
                  v-if="data.strategy[0].systematic == 'valueChain'"
                  class="el-icon-data-line"
                ></i>
              </div>
              <!-- <div class="box-bottom-box-bottom"  @click="nodeClick(data.strategy[0])"> -->
              <div class="box-bottom-box-bottom">
                <el-row>
                  <el-col :span="12">
                    <el-popover
                      v-if="data.strategy[0].ruleCounts > 1"
                      placement="right"
                      trigger="click"
                    >
                      <el-table :data="ruleData">
                        <el-table-column label="关联制度">
                          <template slot-scope="scope">
                            <p @click="toDetail(scope)">
                              {{ scope.row.zhiduname }}
                            </p>
                          </template>
                        </el-table-column>
                      </el-table>
                      <el-row slot="reference">
                        <div @click="showData(data.strategy[0])">
                          <el-col
                            :span="24"
                            class="margin-10 box-bottom-box-bottom-num"
                          >
                            <span
                            >{{ data.strategy[0].ruleCounts }}</span
                            >
                          </el-col>
                          <el-col :span="24" class="box-bottom-box-bottom-word">关联制度</el-col>
                        </div>
                      </el-row>
                    </el-popover>
                    <el-row v-else>
                      <div @click="toDetail(data.strategy[0])">
                        <el-col
                          :span="24"
                          class="margin-10 box-bottom-box-bottom-num"
                        >
                          <span
                          >{{ data.strategy[0].ruleCounts }}</span
                          >
                        </el-col>
                        <el-col :span="24" class="box-bottom-box-bottom-word">关联制度</el-col>
                      </div>
                    </el-row>
                  </el-col>
                  <el-col :span="12">
                    <div @click="nodeClickS(data.strategy[0])">
                      <el-row>
                        <el-col
                          :span="24"
                          class="margin-10 box-bottom-box-bottom-num"
                        >{{ data.strategy[0].processCounts }}
                        </el-col
                        >
                        <el-col :span="24" class="box-bottom-box-bottom-word"
                        >流程数量
                        </el-col
                        >
                      </el-row>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </div>
        <div class="box-middle out-click" @click="outOnClick($event)" v-if="data.main.length !== 0">
          <el-row :gutter="5" class="out-click">
            <el-col
              v-for="(item, index) in data.main"
              :key="item.id"
              :span="4"
              :class="{ w20: rack.main == 5 }"
            >
              <div class="box-middle-box">
                <div class="bottom-border" @click="nodeClickS(item)">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="item.code + item.name"
                    placement="top"
                  >
                    <span>
                      {{ item.code + item.name }}
                      <!-- <br />{{item.enname}} -->
                    </span>
                  </el-tooltip>
                  <i
                    v-if="item.systematic == 'valueChain'"
                    class="el-icon-data-line"
                  ></i>
                </div>

                <div class="box-bottom-box-bottom">
                  <el-row>
                    <el-col :span="12">
                      <el-popover
                        v-if="item.ruleCounts > 1"
                        placement="right"
                        trigger="click"
                      >
                        <el-table :data="ruleData">
                          <el-table-column label="关联制度">
                            <template slot-scope="scope">
                              <p @click="toDetail(scope)">
                                {{ scope.row.zhiduname }}
                              </p>
                            </template>
                          </el-table-column>
                        </el-table>
                        <el-row slot="reference">
                          <div @click="showData(item)">
                            <el-col
                              :span="24"
                              class="margin-10 box-bottom-box-bottom-num"
                            >
                              <span>{{
                                  item.ruleCounts
                                }}</span>
                            </el-col>
                            <el-col :span="24" class="box-bottom-box-bottom-word">
                              关联制度
                            </el-col>
                          </div>
                        </el-row>
                      </el-popover>
                      <el-row v-else>
                        <div @click="toDetail(item)">
                          <el-col
                            :span="24"
                            class="margin-10 box-bottom-box-bottom-num"
                          >
                            <span>{{
                                item.ruleCounts
                              }}</span>
                          </el-col>
                          <el-col :span="24" class="box-bottom-box-bottom-word">
                            关联制度
                          </el-col>
                        </div>
                      </el-row>
                    </el-col>
                    <el-col :span="12">
                      <div @click="nodeClickS(item)">
                        <el-row>
                          <el-col
                            :span="24"
                            class="margin-10 box-bottom-box-bottom-num"
                          >{{ item.processCounts }}
                          </el-col
                          >
                          <el-col :span="24" class="box-bottom-box-bottom-word"
                          >流程数量
                          </el-col
                          >
                        </el-row>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="box-bottom out-click" @click="outOnClick($event)" v-if="data.support.length !== 0">
          <el-row :gutter="5" class="out-click">
            <el-col
              v-for="(item, index) in data.support"
              :key="item.id"
              :span="4"
              :class="{ w20: rack.support == 5 }"
              class="box-bottom-box"
            >
              <div style="height: 100%">
                <div class="box-bottom-box-top" @click="nodeClickS(item)">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="item.code + item.name"
                    placement="top"
                  >
                    <span class="bottom-border"
                    >{{ item.code + item.name }}<br/>
                      {{ item.enname }}</span
                    >
                  </el-tooltip>
                  <i
                    v-if="item.systematic == 'valueChain'"
                    class="el-icon-data-line"
                  ></i>
                </div>
                <div class="box-bottom-box-bottom">
                  <el-row>
                    <el-col :span="12">
                      <el-popover
                        v-if="item.ruleCounts > 1"
                        placement="right"
                        trigger="click"
                      >
                        <el-table :data="ruleData">
                          <el-table-column label="关联制度">
                            <template slot-scope="scope">
                              <p @click="toDetail(scope)">
                                {{ scope.row.zhiduname }}
                              </p>
                            </template>
                          </el-table-column>
                        </el-table>
                        <el-row slot="reference">
                          <div @click="showData(item)">
                            <el-col
                              :span="24"
                              class="margin-10 box-bottom-box-bottom-num"
                            >
                              <span>{{
                                  item.ruleCounts
                                }}</span>
                            </el-col>
                            <el-col :span="24" class="box-bottom-box-bottom-word">
                              关联制度
                            </el-col>
                          </div>
                        </el-row>
                      </el-popover>
                      <el-row v-else>
                        <div @click="toDetail(item)">
                          <el-col
                            :span="24"
                            class="margin-10 box-bottom-box-bottom-num"
                          >
                            <span>{{
                                item.ruleCounts
                              }}</span>
                          </el-col>
                          <el-col :span="24" class="box-bottom-box-bottom-word">
                            关联制度
                          </el-col>
                        </div>
                      </el-row>
                    </el-col>
                    <el-col :span="12">
                      <div @click="nodeClickS(item)">
                        <el-row>
                          <el-col
                            :span="24"
                            class="margin-10 box-bottom-box-bottom-num"
                          >{{ item.processCounts }}
                          </el-col
                          >
                          <el-col :span="24" class="">流程数量</el-col>
                        </el-row>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-if="styles == 2">
        <div class="f-box-header out-click" @click="outOnClick($event)" v-if="data.strategy.length !== 0">
          <div class="f-box-header-box">
            <div
              class="f-box-header-wrod"
              @click="nodeClickS(data.strategy[0])"
            >
              {{ data.strategy[0].name }}
            </div>
            <el-row type="flex" class="row-bg1" justify="space-around    ">
              <div
                v-for="(i, y) in data.strategy[0].subNodes"
                :key="y + 1"
                v-if="y < 3"
              >
                <el-col>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="i.name"
                    placement="top"
                  >
                    <div class="strategy-item" @click="nodeClickS(i)">
                      <div>
                        {{ i.name }}
                      </div>
                    </div>
                  </el-tooltip>
                </el-col>
              </div>
            </el-row>
            <el-scrollbar id="scrollbar_title">
              <el-row type="flex" class="row-bg">
                <div
                  v-for="(i, y) in data.strategy[0].subNodes"
                  :key="y + 2"
                  v-if="y > 2"
                >
                  <el-col style="margin-left: 15px">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="i.name"
                      placement="top"
                    >
                      <div class="strategy-item" @click="nodeClickS(i)">
                        <div>
                          {{ i.name }}
                        </div>
                      </div>
                    </el-tooltip>
                  </el-col>
                </div>
              </el-row>
            </el-scrollbar>
          </div>
        </div>
        <div class="f-box-middle out-click" @click="outOnClick($event)" v-if="data.main.length != 0">
          <el-scrollbar id="scrollbarN">
            <div class="f-box-middle-title">
              <div
                class="f-box-middle-item"
                v-for="(item, index) in data.main"
                :key="index + 1"
              >
                <el-col class="f-box-middle-item-title">
                  <span class="f-box-middle-item-span">
                    <span @click="nodeClickS(item)" style="position: relative">
                      {{ item.name }}
                      <i class="f-triangle-downsSpan"></i>
                    </span>
                  </span>
                  <el-scrollbar id="scrollbar">
                    <div
                      class="f-box-middle-item-item"
                      style="position: relative; display: flex"
                    >
                      <div
                        class="f-box-middle-div"
                        v-for="i in item.subNodes"
                        :key="i + 1"
                      >
                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="i.name"
                          placement="top"
                        >
                          <span @click="nodeClickS(i)">
                            {{ i.name }}
                          </span>
                        </el-tooltip>
                      </div>
                    </div>
                    <div
                      class="f-xian"
                      v-if="index !== data.main.length - 1"
                      style="
                        border-right: 1px solid #2994cf;
                        margin-right: -2px;
                      "
                    ></div>
                  </el-scrollbar>
                </el-col>
              </div>
            </div>
          </el-scrollbar>
          <div
            v-if="data.support.length != 0"
            style="
              display: flex;
              justify-content: space-around;
              border-top: 1px solid #2994cf;
            "
          >
            <div class="f-triangle-downsSpans"></div>
            <div class="f-triangle-downsSpans"></div>
            <div class="f-triangle-downsSpans"></div>
            <div class="f-triangle-downsSpans"></div>
          </div>
        </div>
        <div class="f-box-bottom out-click" @click="outOnClick($event)" v-if="data.support.length != 0">
          <div style="display: flex; justify-content: space-around">
            <div class="f-triangle-downsbottom"></div>
            <div class="f-triangle-downsbottom"></div>
            <div class="f-triangle-downsbottom"></div>
            <div class="f-triangle-downsbottom"></div>
          </div>
          <div class="f-box-bottom-title" @click="nodeClickS(data.support[0])">
            {{ data.support[0].name }}
          </div>
          <div style="padding: 10px 0">
            <el-row v-for="(item, index) in data.support" :key="index + 3">
              <el-col
                v-for="(i, index) in item.subNodes"
                :key="i.id"
                :span="4"
                class="f-alertDialog"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="i.name"
                  placement="top"
                >
                  <div class="serve-text" @click="nodeClickS(i)">
                    <span>
                      {{ i.name }}
                    </span>
                  </div>
                </el-tooltip>
              </el-col>
            </el-row>
          </div>
        </div>
        <div
          class="f-imgs"
          v-if="
            data.strategy.length !== 0 ||
            data.main.length !== 0 ||
            data.support.length !== 0
          "
        >
          <img src="../../bpa/assets/img/f-bottom.jpg" alt=""/>
        </div>
      </div>
    </div>
    <div v-if="styles == 3">
      <iframe
        class="w100 iframeProcess"
        id="iframeUrlId"
        :src="iframeSrc"
      ></iframe>
    </div>
  </div>
</template>

<script>
import {
  getProcessIframeTree,
  getAuthTreeNode,
  queryModelTrees,
  queryRoomDetails,
  getRuleList,
  getLastReleaseByModelid,
} from "@/bpa/api/componentsApi";
import {getNum} from "@/bpa/api/common";
import {getProcessProps2} from "@/bpa/api/processModelCenter/processCommunity";
import {getProcessTree} from "@/bpa/api/processModelCenter/processIframeCenter";
import {getProcessProps} from "@/bpa/api/processModelCenter/processCommunity";

export default {
  name: "FrameShow",
  data() {
    return {
      ruleData: [],
      iframeSrc: "",
      processProps2: "",
      styles: 1,
      data: {
        strategy: [{code: "", name: [], ename: ""}],
        main: [],
        support: [],
      },
      bgstyle: {},
      rack: {
        support: 0,
        main: 7,
      },
      dataList: {
        main: [],
      },
      tabList: [],
      activeName: ""
    };
  },
  // watch: {
  //   id (newValue, oldValue) {
  //     console.log(newValue)
  //   }
  // },
  props: ["clickable", "displaymode", "attrid"],

  mounted() {
    console.log(this.$route.query.type);

    if (
      this.$route.query.type == "roomStyle" ||
      this.displaymode == "roomStyle"
    ) {
      console.log("shu");
      let attrid = this.$route.query.attrid
        ? this.$route.query.attrid
        : this.attrid;
      queryModelTrees(attrid).then((res) => {
        this.data = res;
        console.log("res", res);
      });
    } else if (
      this.$route.query.type == "roomDetails" ||
      this.displaymode == "roomDetails"
    ) {
      this.styles = 2;
      let attrid = this.$route.query.attrid
        ? this.$route.query.attrid
        : this.attrid;
      queryRoomDetails(attrid).then((res) => {
        console.log("好房子", res);
        this.data = res;
      });
    } else if (
      this.$route.query.type == "custom" ||
      this.displaymode == "custom"
    ) {
      this.styles = 3;

      let attrid = this.$route.query.attrid
        ? this.$route.query.attrid
        : this.attrid;
      let obj = {
        filters: [{key: "modelid", value: attrid}],
        orderby: "createon",
        pageNum: 1,
        pageSize: 10,
        sort: "desc",
      };
      getProcessProps2(obj,1).then((res) => {
        if (!res) return;
        console.log("res.list.length自定义图", res.list.length);
        if (res.list.length == 0) {
          this.$message.error("你还没有自定义图，还需要绘制");
        } else {
          this.processProps2 = res.list[0];
          console.log("列表", res);
          getLastReleaseByModelid(attrid).then((res) => {
            this.iframeSrc =
              "./leftMenu/BaseNewPage.html?id=" +
              this.processProps2.bpmid +
              "&listid=" +
              res.bpmDto.listid +
              "&isReadAttr=true";
          });
        }
      });

      console.log("123213");
    } else {
      this.getTab();
    }
  },

  methods: {
    showData(item) {
      this.ruleData.splice(0, this.ruleData.length)
      getRuleList(item.id).then((res) => {
        res.push({
          zhiduid: '1'
        })
        this.ruleData = res.filter(item => {
          if (item.hasOwnProperty("zhiduname")) {
            return item
          }
        })
      })
    },
    outOnClick(event) {
      console.log(event.target.className.split(" "))
      let classes = event.target.className.split(" ");
      // 若不是点击目标区域则 不响应点击事件
      if (classes[0] === 'out-click' || classes[1] === 'out-click') {
        this.$emit('outClick', {})
      }
    },
    toDetail(item) {
      // if (item.ruleCounts === 0) {
      //   this.$message({
      //     type: "warning",
      //     message: "它没有关联制度",
      //   });
      //   console.log(1)
      // }
      console.log(item)
      if (item.ruleCounts) {
        getRuleList(item.id).then((res) => {
          let urls = `#/rulesDetail/${res[0].zhiduid}/-1`
          window.open(urls, '_blank')
        })
        console.log(2)
      }
      if (item.row) {
        let urls = `#/rulesDetail/${item.row.zhiduid}/-1`
        window.open(urls, '_blank')
        console.log(3)
      }
    },
    handleClick(tab, event) {
      console.log(tab);
      let tabitem = this.tabList.filter((i) => {
        if (tab.label == i.name) {
          return i.displaymode;
        }
      });
      console.log(tabitem);
      if (tabitem.length !== 0) {
        this.styles = tabitem[0].displaymode == "roomDetails" ? 2 : 1;
        console.log(this.styles);
      } else {
        this.styles = 1;
      }
      if (this.styles == 1) {
        this.getdata();
      } else {
        queryRoomDetails(tabitem[0].id).then((res) => {
          console.log(this.styles);

          console.log("好房子", res);
          this.data = res;
        });
      }
    },

    getTab() {
      getProcessIframeTree(0).then((rt) => {
        if (rt && rt.length > 0) {
          getAuthTreeNode(rt[0].id).then((rt) => {
            this.activeName = rt[0].id;
            this.tabList = rt;
            this.getdata();
          });
        }
      });
    },
    async getdata() {
      let res = await getNum({});
      if (!res) return false;
      let obj = {};
      res.list.forEach((item) => {
        if (item.id == "support") {
          obj.support = parseInt(item.name);
        }
        if (item.id == "main") {
          obj.main = parseInt(item.name);
        }
      });
      this.rack = Object.assign({}, this.rack, obj);
      queryModelTrees(this.activeName).then((res) => {
        this.data = res;
      });
    },
    nodeClick(item) {
      // if (this.clickable) {
      //   this.$emit('treeclick', item)
      //   return false
      // }
      // this.$router.push({
      //   path: '/doorCenter/rulesShow',
      //   query: { attrid: item.id, pid : item.pid}
      // })
    },
    nodeClickS(item) {
      console.log("流程结构", item);

      if (item.systematic == "valueChain") {
        if (item.chains.length !== 0) {
          this.$router.push({
            path: "/valueCenter/edgeToedge",
          });
          sessionStorage.setItem("chains", JSON.stringify(item.chains));
        } else {
          this.$message({
            type: "warning",
            message: this.$t("NoValueChainYet"),
          });
        }
      } else {
        console.log(this.clickable);
        if (this.clickable) {
          console.log(123);
          this.$emit("treeclick", item);
          return false;
        }
        if (item.displaymode == "roomStyle") {
          queryModelTrees(item.id).then((res) => {
            console.log("房子", res);
            if (
              res.strategy.length == 0 &&
              res.main.length == 0 &&
              res.support.length == 0
            ) {
              this.$message.error(
                this.$t("TheProcessFrameworkHasNoSubordinates")
              );
            } else {
              this.$router.push({
                path: "/doorCenter/rulesShow",
                query: {
                  attrid: item.id,
                  pid: item.pid,
                  type: item.displaymode ? item.displaymode : "treeShape",
                },
              });
            }
          });
        } else if (item.displaymode == "roomDetails") {
          this.$router.push({
            path: "/doorCenter/rulesShow",
            query: {
              attrid: item.id,
              pid: item.pid,
              type: item.displaymode ? item.displaymode : "treeShape",
            },
          });
        } else {
          getProcessTree({id: item.id, state: "0"}).then((res) => {
            if (res.children.length == 0) {
              this.$message.error(
                this.$t("TheProcessFrameworkHasNoSubordinates")
              );
            } else {
              this.$router.push({
                path: "/doorCenter/rulesShow",
                query: {
                  attrid: item.id,
                  pid: item.pid,
                  type: item.displaymode ? item.displaymode : "treeShape",
                },
              });
            }
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
///deep/ #scrollbar_title .el-scrollbar__thumb{
//  background-color: rgba(153, 153, 153, 1) !important;
//}
/deep/ #scrollbar_title ::-webkit-scrollbar-track {
  background-color: transparent !important;
}

/deep/ #scrollbar_title ::-webkit-scrollbar {
  background-color: transparent !important;
}

#scrollbar_title {
  padding: 2px 0;
}

.strategy-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  border: 1px salmon;
  height: 43px;
  //background: rgb(32, 56, 100);
  text-align: center;
  border: 1px solid #fff;
  border-radius: 6px;
  color: #fff;
  margin: 8px 0;
  cursor: pointer;

  div {
    word-break: break-all;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}

/deep/ ::-webkit-scrollbar {
  height: 6px !important;
}

.f-triangle-downsSpans {
  margin-top: -1px;
  border-left: 16px solid transparent;
  border-right: 16px solid transparent;
  border-top: 13px solid #0e6eb8a1;
  z-index: 999;
}

.f-triangle-downsbottom {
  border-left: 16px solid transparent;
  border-right: 16px solid transparent;
  border-top: 13px solid #fff;
}

.f-box-middle-div:after {
  content: '';
  width: 0;
  height: 0;
  position: absolute;
  top: 50%;
  margin-left: -18px;
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  border-left: 10px solid #29a7e1;
}

.f-box-middle-div:before {
  content: '';
  width: 0;
  height: 0;
  position: absolute;
  top: 50%;
  margin-left: 36px;
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  border-left: 10px solid #0e6eb8;
}

.f-box-middle-div:nth-child(1)::after {
  display: none;
}

//.f-box-middle-div:nth-last-child(2):before{
//  display: none;
//}
.f-box-middle-div:nth-last-child(1):before {
  display: none;
}

//.f-box-middle-item-span:before{
//  content: "";
//  width: 0;
//  height: 0;
//  position: absolute;
//  right: -11px;
//  top: 100%-50%;
//  border-top: 6px solid transparent;
//  border-bottom: 6px solid transparent;
//  border-left: 9px solid #29a7e1;
//}
//.f-xian:before{
//  content: "";
//  width: 0;
//  height: 0;
//  position: absolute;
//  right: -11px;
//  top: 100%-50%;
//  border-top: 6px solid transparent;
//  border-bottom: 6px solid transparent;
//  border-left: 9px solid #29a7e1;
//}
.f-triangle-downsSpan {
  position: absolute;
  border-left: 16px solid transparent;
  border-right: 16px solid transparent;
  border-top: 12px solid #0e6eb8;
  top: 30px;
  left: 22px;
}

.f-triangle-downss {
  width: 0;
  height: 0;
  border-left: 9px solid transparent;
  border-right: 9px solid transparent;
  border-bottom: 11px solid rgba(41, 148, 207, 1);
}

.f-triangle-downs,
.f-triangle-downs1,
.f-triangle-downs2,
.f-triangle-downs3 {
  position: absolute;
  border-left: 9px solid transparent;
  border-right: 9px solid transparent;
  border-top: 11px solid rgba(41, 148, 207, 1);
  top: 160px;
}

.f-triangle-downs {
  right: 316px;
}

.f-triangle-downs1 {
  right: 80px;
}

.f-triangle-downs2 {
  right: -168px;
}

.f-triangle-downs3 {
  right: -316px;
}

.title-item:last-child {
  border: none;
}

/deep/ #scrollbar .el-scrollbar__wrap {
  margin-bottom: -3px !important;
  //overflow-y: hidden;
}

/deep/ #scrollbarN .el-scrollbar__wrap {
  margin-bottom: 4px !important;
  //overflow-y: hidden;
}

.f-box-middle-title
> .f-box-middle-item:first-child
> .f-box-middle-item-item:first-child {
  display: none;
}

#frameShow {
  .f-imgs {
    width: 1200px;
    height: 50px;
    margin: 0 auto;
    margin-top: 10px;
  }

  .f-box-bottom {
    background-color: rgb(41, 167, 225);
    width: 1030px;
    margin: 0 auto;
    margin-top: -12px;
    padding: 0 5px 20px;

    .f-box-bottom-title {
      cursor: pointer;
      text-align: center;
      font-size: 30px;
      color: #e4bf6f;
    }

    .f-alertDialog {
      /* 对话框：一个圆角矩形和一个小三角形 */
      width: 150px;
      cursor: pointer;
      /* height: 40px; */
      background: rgb(206, 234, 243);
      color: rgb(41, 167, 225);
      position: relative;
      text-align: center;
      font-size: 12px;
      margin: 10px;

      span {
        word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }

    .f-alertDialog:before {
      content: '';
      width: 0;
      height: 0;
      position: absolute;
      right: -8px;
      top: 100%-60%;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
      border-left: 9px solid rgb(206, 234, 243);
    }
  }

  .f-box-middle-item-title:before {
    content: '';
    width: 0;
    height: 0;
    position: absolute;
    right: -8px;
    top: 100%-65%;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-left: 9px solid #fff;
  }

  .f-box-middle {
    width: 1020px;
    margin: 0 auto;
    margin-top: 12px;
    margin-bottom: 10px;

    .f-box-middle-item-xian {
      padding-bottom: 10px;

      .f-box-middle-xian {
        padding: 22px 0;
      }
    }

    .f-box-middle-title {
      display: -webkit-box;
      //display: flex;
      //justify-content: space-between;
      font-size: 18px;
      color: rgb(218, 189, 146);
    }

    .f-box-middle-item {
      margin: 0 2px;
      width: 49%;
      flex-direction: row;
    }

    .f-box-middle-item-title {
      text-align: center;
      width: 100%;
      cursor: pointer;

      .f-box-middle-item-span {
        display: block;
        padding: 10px 0;
        background-color: rgb(14, 110, 184);
        color: #ffc037;
        font-size: 20px;
      }
    }
  }

  .f-box-middle-item-item {
    display: flex;
    margin-top: 20px;
    padding-bottom: 10px;
    //border-bottom: 1px solid rgba(41, 148, 207, 1);
    justify-content: flex-start;
  }

  .f-box-middle-div {
    background-color: #0e6eb8;
    color: #fff;
    border-radius: 6px;
    white-space: normal;
    word-break: break-all;
    word-wrap: break-word;
    height: 260px;
    text-align: center;
    padding: 18px;
    width: 56px;
    margin: 0 4px;
    display: flex;
    align-items: center;

    span {
      word-break: break-all;
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 9;
      -webkit-box-orient: vertical;
    }
  }

  .serve-text {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .f-box-header {
    width: 0;
    height: 0;
    border-left: 585px solid transparent;
    border-right: 600px solid transparent;
    border-bottom: 214px solid #29a7e1;
    margin: 0 auto;
    position: relative;

    .f-box-header-box {
      width: 640px;
      height: 48px;
      position: relative;
      top: 48px;
      left: -320px;
    }

    .f-box-header-wrod {
      width: 610px;
      cursor: pointer;
      margin: 0 auto;
      text-align: center;
      //border-bottom: 1px solid #fff;
      font-size: 30px;
      color: #e4bf6f;
      padding-bottom: 19px;
    }

    .f-title {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .f-title > div {
      border-right: 1px solid #fff;
      height: 89px;
      width: 100px;
      text-align: center;
      padding-top: 24px;
    }

    .f-title > div:last-child {
      border-right: none;
    }
  }

  .box-bottom-box-bottom-num {
    font-size: 24px;
    font-weight: bold;
  }

  .box-bottom-box-bottom-word {
    font-size: 14px;
  }

  width: 100%;
  margin-bottom: 20px;

  /deep/ .el-tabs .el-tabs__item {
    color: #000;
    padding: 0 15px;
  }

  /deep/ .el-tabs .is-active {
    color: #409eff;
  }

  .trans-origin {
    transform-origin: left top;

    .bottom-border {
      position: relative;
      display: inline-block;
      white-space: nowrap;
      width: 100%;
      overflow: hidden;
      line-height: 52px;
      text-overflow: ellipsis;
      border-bottom: 1px solid #fff;

      i {
        display: block;
        width: 8px;
        height: 8px;
        font-size: 12px;
        position: absolute;
        right: 8px;
        top: 2px;
      }
    }

    .margin-10 {
      margin-top: 12px;
    }

    .margin-8 {
      margin-top: 4px;
    }

    .box-header {
      width: 0;
      height: 0;
      border-left: 600px solid transparent;
      border-right: 600px solid transparent;
      border-bottom: 184px solid rgba(45, 66, 175, 0.5);
      margin: 0 auto;
      position: relative;

      .box-header-box {
        width: 640px;
        height: 48px;
        position: relative;
        top: 48px;
        left: -320px;
      }

      .box-header-wrod {
        width: 268px;
        height: 120px;
        cursor: pointer;
        // float: left;
        background: #f27611;
        margin: 0 auto;
        color: #fff;
        text-align: center;
        border: 2px solid #fff;
        border-radius: 10px;
        font-size: 24px;
      }
    }

    .box-middle {
      width: 1200px;
      // min-height: 128px;
      margin: 0 auto;
      background: rgba(176, 189, 252, 0.35);
      margin-top: 2px;
      // padding: 36px 0px 12px;
      padding: 42px 4.4%;

      .box-middle-box {
        cursor: pointer;
        background: #1bc5c7;
        height: 120px;
        font-size: 24px;
        color: #fff;
        text-align: center;
        border: 2px solid #fff;
        border-radius: 10px;
        margin-bottom: 24px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .row-bg1 {
      padding: 0 10px;
    }

    .box-bottom {
      width: 1200px;
      min-height: 240px;
      margin: 0 auto;
      background: rgba(45, 66, 175, 0.2);
      padding: 42px 4.4%;

      .box-bottom-box {
        // background: #2d42af;
        height: 115px;
        color: #fff;
        text-align: center;
        border: 2px solid #fff;
        -webkit-border-top-left-radius: 10px;
        -webkit-border-top-right-radius: 10px;
        margin-bottom: 24px;

        .box-bottom-box-top {
          position: relative;
          cursor: pointer;
          height: 39%;
          background: rgba(92, 111, 210, 1);
          line-height: 42px;
          font-size: 18px;
          -webkit-border-top-left-radius: 10px;
          -webkit-border-top-right-radius: 10px;

          i {
            display: block;
            position: absolute;
            font-size: 12px;
            top: 2px;
            right: 8px;
          }
        }

        .box-bottom-box-bottom {
          height: 61%;
          background: rgba(45, 66, 175, 1);

          .box-bottom-box-bottom-num {
            font-size: 24px;
            font-weight: bold;
          }
        }
      }
    }
  }

  * {
    box-sizing: border-box;
  }

  .w20 {
    width: 20% !important;
  }

  .conmon {
    display: flex;

    .commonPart_title {
      width: 106px;
      background-color: rgb(48, 79, 255);
      display: flex;
      flex-direction: column;
      margin-top: 12px;
      margin-right: 35px;
      box-sizing: border-box;
      box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.5);
      height: 128px;
      display: table;
      // border: 1px solid #677dfe;
      border: 1px solid rgb(0, 102, 153);

      div {
        color: #fff;
        font-size: 30px;
        font-weight: 700;
        text-align: center;
        letter-spacing: 5px;
      }
    }

    .commonPart_title_item {
      display: table-cell;
      vertical-align: middle;
    }

    .commonPart {
      margin-top: 12px;
      width: calc(100% - 141px);
    }
  }

  .commonFlex {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .conmon2 {
    display: flex;

    .commonPart_title2 {
      display: table;
      width: 106px;
      margin: 8px 0;
      background-color: rgb(16, 149, 242);
      margin-right: 35px;
      box-sizing: border-box;
      box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.5);
      // border: 1px solid #677dfe;
      border: 1px solid rgb(0, 102, 153);

      .commonPart_title2_item {
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        height: 400px;
        color: #fff;
        font-size: 30px;
        font-weight: 700;
        letter-spacing: 5px;
      }
    }

    .commonPart {
      width: calc(100% - 141px);
    }
  }

  .container_item {
    height: 140px;
    font-size: 20px;
    line-height: 120px;
    padding-left: 12px;
    text-align: center;
    box-sizing: border-box;
    color: #036;
    font-weight: bold;
    display: inline-block;
    vertical-align: middle;
    position: relative;
    z-index: 0;
    overflow: hidden;
    // margin: 12px 0px 5px 0px;
    cursor: pointer;
    // background: url("../assets/img/flow02.png") no-repeat center;
    // background-size:cover;
    img {
      width: 100%;
      height: 100%;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
    }
  }

  .container > :first-child {
    // background: url("../assets/img/flow01.png") no-repeat center;
    // background-size:cover;
  }

  .thirdHeight {
    height: 80px;
    line-height: 80px;
    font-size: 20px;
    background: rgb(214, 236, 255);
    border: 1px solid rgb(0, 102, 153);
    box-shadow: 0px 10px 10px 0px rgba(16, 149, 242, 0.1);
  }

  .commonNode {
    text-align: center;
    box-sizing: border-box;
    color: #555;
    display: inline-block;
    vertical-align: middle;
    position: relative;
    z-index: 0;
    overflow: hidden;
    margin: 12px 0px 5px 0px;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
    }

    span {
      word-break: break-all;
      display: inline-block;
      vertical-align: middle;
    }

    &:after {
      content: '';
      width: 0;
      height: 100%;
      display: inline-block;
      vertical-align: middle;
    }

    .item_name {
      color: rgb(0, 51, 102);
      font-weight: 700;
      position: relative;
      top: -2px;
      left: 5px;
    }

    .item_code {
      color: rgb(0, 51, 102);
      font-weight: 700;
      position: relative;
      top: -2px;
    }
  }

  #iframeUrlId {
    height: calc(100vh - 190px) !important;
  }

  .content {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .container {
    display: flex;
    flex-wrap: wrap;
    display: -webkit-flex;

    .container_item {
      flex: 1;
    }
  }

  .bottom-border:hover {
    text-decoration: underline;
    font-weight: bold;
    transition-duration: 1s;
    transition-property: all;
    transition-timing-function: ease;
    transition-delay: 0s;
  }
  .out-click {
    cursor: pointer;
  }
}
</style>
