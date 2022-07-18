<template>
  <div id="frame">
    <el-card style="margin-bottom:20px;">
      <h2 style="font-size: 20px;margin-bottom: 20px;"> {{ $t('commonlyUsedProcess') }} </h2>
      <div class="quickLaunch">
        <div
          class="quickLayout"
          v-for="item in shortList"
          :key="item.id"
          @click="toFlowQuick(item)"
        >
          <div class="circle" :style="'backgroundColor:'+item.color">
            <i class="iconfont" :class="item.icon?item.icon:'icon-zhuanxierizhi'"></i>
          </div>
          <p :title="item.processnamecn">{{item.processnamecn}}</p>
          <el-button
            type="text"
            class="button"
            :title="$t('deleteShortcut')"
            icon="el-icon-delete"
            @click.stop="handleDelShortCut(item.id)"
          ></el-button>
        </div>
        <!-- <el-row :gutter="10" align="center">
          <el-col
            :span="3"
            v-for="(item, index) in shortList"
            :key="index"
            :title="item.processnamecn"
            style="margin:5px 0;"
          >
            <el-button
              @click="toFlowQuick(item)"
              class="textHide btn"
              type="primary"
              plain
            >{{item.processnamecn}}</el-button>
          </el-col>
        </el-row>-->
      </div>
    </el-card>
    <el-card shadow="never" id="apply-create">
      <h2 style="font-size: 20px;margin-bottom: 20px;">{{ $t('allTheProcess') }}</h2>
      <el-form :model="searchForm" size="mini" label-position="left" @submit.native.prevent>
        <el-row>
          <el-col :span="12">
            <el-form-item class="padding-l20" size="medium" label-width="85px" :label="$t('processName') + '：'">
              <div class="tool-common-wrap">
                <div class="search-wrap">
                  <el-input clearable
                    v-model="searchForm.name"
                    style="width:400px"
                    @keyup.enter.native="search"
                  >
                    <span slot="append" @click="search" style="width: 60px;">
                      <i class="iconfont icon-sousuo2"></i>
                    </span>
                  </el-input>
                </div>
                <span v-show="boole" style="margin-left:20px;color:red;">{{ $t('hintText.noRelevantProcess') }}</span>
              </div>
              <!--<el-input clearable type="text" v-model="searchForm.name" clearable></el-input>-->
            </el-form-item>
          </el-col>
          <!--<el-col :span="8">-->
          <!--<el-form-item label-width="20px">-->
          <!--<el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>-->
          <!--</el-form-item>-->
          <!--</el-col>-->
        </el-row>
      </el-form>

      <div id="applyBox">
        <div class="applyItem" v-for="(item1, index1) in applyList" :key="index1">
          <div class="itemContent">
            <!-- {{!item1.hasOwnProperty("LINK") }}
            {{Object.keys(item1).indexOf('LINK')}}-->
            <h2 v-html="item1.name"></h2>
            <div class="applylayout" v-if="item1.processes" style="margin: 10px 20px;">
              <P
                style="cursor: pointer;"
                v-for="(item1, indexs1) in item1.processes"
                :key="indexs1"
                @click="toFlow(item1)"
              >
                <span
                  :title="item1.title?item1.title:item1.processNameCn"
                  v-html="item1.processNameCn"
                ></span>
                <el-button
                  type="text"
                  :title="$t('addToShortcutItems')"
                  style="font-size: 13px"
                  icon="el-icon-circle-plus"
                  @click.stop="handleAddShortCut(item1)"
                ></el-button>
              </P>
            </div>
            <ul>
              <li v-for="(item2, index2) in item1.subNodes" :key="index2">
                <!-- <div class="cont"> -->
                <h3 v-html="item2.name" v-if="!(item2.processes && item2.processes.length === 1 && item2.name === item2.processes[0].processNameCn && (!item2.subNodes || item2.subNodes.length === 0))"></h3>
                <div class="applylayout">
                  <P
                    v-for="(items2, indexs2) in item2.processes"
                    :key="indexs2"
                    style="cursor: pointer;"
                    @click="toFlow(items2)"
                  >
                    <span
                      :title="items2.title?items2.title:items2.processNameCn"
                      v-html="items2.processNameCn"
                    ></span>
                    <el-button
                      type="text"
                      :title="$t('addToShortcutItems')"
                      style="font-size: 13px"
                      icon="el-icon-circle-plus"
                      @click.stop="handleAddShortCut(items2)"
                    ></el-button>
                  </P>
                </div>
                <div class="cont">
                  <div v-for="(item3, index3) in item2.subNodes" :key="index3">
                    <h4 v-html="item3.name" v-if="!item3.modelId && !(item3.processes && item3.processes.length === 1 && item3.name === item3.processes[0].processNameCn && (!item3.subNodes || item3.subNodes.length === 0))"></h4>
                    <div class="applylayout">
                      <P
                        v-for="(items3, indexs3) in item3.processes"
                        :key="indexs3"
                        style="cursor: pointer;"
                        @click="toFlow(items3)"
                      >
                        <span
                          :title="items3.title?items3.title:items3.processNameCn"
                          v-html="items3.processNameCn"
                        ></span>
                        <el-button
                          type="text"
                          :title="$t('addToShortcutItems')"
                          style="font-size: 13px"
                          icon="el-icon-circle-plus"
                          @click.stop="handleAddShortCut(items3)"
                        ></el-button>
                      </P>
                    </div>
                    <div v-for="(item4, index4) in item3.subNodes" :key="index4">
                      <h4 v-html="item4.name" v-if="!(item4.processes && item4.processes.length === 1 && item4.name === item4.processes[0].processNameCn && (!item4.subNodes || item4.subNodes.length === 0))"></h4>
                      <div class="applylayout">
                        <P
                          v-for="(items4, indexs4) in item4.processes"
                          :key="indexs4"
                          style="cursor: pointer;"
                          @click="toFlow(items4)"
                        >
                          <span
                            :title="items4.title?items4.title:items4.processNameCn"
                            v-html="items4.processNameCn"
                          ></span>
                          <el-button
                            type="text"
                            :title="$t('addToShortcutItems')"
                            style="font-size: 13px"
                            icon="el-icon-circle-plus"
                            @click.stop="handleAddShortCut(items4)"
                          ></el-button>
                        </P>
                      </div>
                      <div v-for="(item5, index5) in item4.subNodes" :key="index5">
                        <h4 v-html="item5.name" v-if="!(item5.processes && item5.processes.length === 1 && item5.name === item5.processes[0].processNameCn && (!item5.subNodes || item5.subNodes.length === 0))"></h4>
                        <div class="applylayout">
                          <P
                            v-for="(items5, indexs5) in item5.processes"
                            :key="indexs5"
                            style="cursor: pointer;"
                            @click="toFlow(items5)"
                          >
                          <span
                            :title="items5.title?items5.title:items5.processNameCn"
                            v-html="items5.processNameCn"
                          ></span>
                            <el-button
                              type="text"
                              :title="$t('addToShortcutItems')"
                              style="font-size: 13px"
                              icon="el-icon-circle-plus"
                              @click.stop="handleAddShortCut(items5)"
                            ></el-button>
                          </P>
                        </div>
                        <div v-for="(item6, index6) in item5.subNodes" :key="index6">
                          <h4 v-html="item6.name" v-if="!(item6.processes && item6.processes.length === 1 && item6.name === item6.processes[0].processNameCn && (!item6.subNodes || item6.subNodes.length === 0))"></h4>
                          <div class="applylayout">
                            <P
                              v-for="(items6, indexs6) in item6.processes"
                              :key="indexs6"
                              style="cursor: pointer;"
                              @click="toFlow(items6)"
                            >
                          <span
                            :title="items6.title?items6.title:items6.processNameCn"
                            v-html="items6.processNameCn"
                          ></span>
                              <el-button
                                type="text"
                                :title="$t('addToShortcutItems')"
                                style="font-size: 13px"
                                icon="el-icon-circle-plus"
                                @click.stop="handleAddShortCut(items6)"
                              ></el-button>
                            </P>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <choose-jobs :item="itemData" v-model="dialogVisible" @confirm="saveSuccess"></choose-jobs>
    </el-card>
  </div>
</template>
<script>
import {
  getApplyList,
  getShortCutList,
  addToShortCut,
  postionList,
  delShortCut
} from "../../../../api/staging/personal/apply_create";
import { checkProcessDefaultPage } from "../../../../api/flow/index";

import { getPost } from "@/bpm/api/process/administrativeTool/agents_change";
import chooseJobs from "./chooseJobs";
export default {
  name: "stagingPersonalApplyCreate",
  data() {
    return {
      dialogVisible: false,
      itemData: [],
      searchForm: {
        name: ""
      },
      shortShow: false,
      paramsData: {},
      applyList: [],
      shortList: [],
      applyLists: [],
      boole: false
    };
  },
  watch: {
    "searchForm.name"(val) {
      this.boole = false;
    }
  },
  components: {
    chooseJobs
  },
  methods: {
    applyListF(list) {
      let _this = this;
      list.forEach(item => {
        if (item.LINK && item.LINK !== "notfind") {
          _this.applyLists.push({
            SYSTEM: item.SYSTEM,
            URLNAME: item.URLNAME,
            LINK: item.LINK,
            PID: item.PID,
            ID: item.ID,
            TYPE: item.TYPE,
            PROJECTNAME: item.PROJECTNAME,
            NAME: item.NAME
          });
        }
        if (item.subNodes && item.subNodes.length > 0) {
          _this.applyListF(item.subNodes);
        }
      });
    },
    search() {
      if (!this.searchForm.name) return;
      this.applyList = JSON.parse(JSON.stringify(this.applyListAll));
      let _boole = false;
      this.applyList.forEach(item1 => {
        if (item1.subNodes) {
          item1.subNodes.forEach(item2 => {
            if (item2.processes) {
              item2.processes.forEach(items2 => {
                if (
                  String(items2.processNameCn).indexOf(this.searchForm.name) >
                  -1
                ) {
                  _boole = true;
                  items2.title = items2.processNameCn;
                  items2.processNameCn = items2.processNameCn.replace(
                    new RegExp(items2.processNameCn, "gm"),
                    `<font class='search-text'>${items2.processNameCn}</font>`
                  );
                }
              });
            }
            if (item2.subNodes) {
              item2.subNodes.forEach(item3 => {
                if (item3.subNodes) {
                  item3.subNodes.forEach(item4 => {
                    item4.processes.forEach(items4 => {
                      if (
                        String(items4.processNameCn).indexOf(
                          this.searchForm.name
                        ) > -1
                      ) {
                        _boole = true;
                        items4.title = items4.processNameCn;
                        items4.processNameCn = items4.processNameCn.replace(
                          new RegExp(items4.processNameCn, "gm"),
                          `<font class='search-text'>${items4.processNameCn}</font>`
                        );
                      }
                    });
                  });
                }
                if (item3.processes) {
                  item3.processes.forEach(items3 => {
                    if (
                      String(items3.processNameCn).indexOf(
                        this.searchForm.name
                      ) > -1
                    ) {
                      _boole = true;
                      items3.title = items3.processNameCn;
                      items3.processNameCn = items3.processNameCn.replace(
                        new RegExp(items3.processNameCn, "gm"),
                        `<font class='search-text'>${items3.processNameCn}</font>`
                      );
                    }
                  });
                }
              });
            }
          });
        }
        if (item1.processes) {
          item1.processes.forEach(items1 => {
            if (
              String(items1.processNameCn).indexOf(this.searchForm.name) > -1
            ) {
              _boole = true;
              items1.title = items1.processNameCn;
              items1.processNameCn = items1.processNameCn.replace(
                new RegExp(items1.processNameCn, "gm"),
                `<font class='search-text'>${items1.processNameCn}</font>`
              );
            }
          });
        }
      });
      if (!_boole) {
        this.boole = true;
      } else {
        this.boole = false;
      }
      if (this.applyList.length > 0) {
        this.$nextTick(() => {
          this.waterFall();
        });
      }
    },
    filterList() {},
    getData() {
      getApplyList().then(rt => {
        this.applyListAll = rt.data;
        this.applyList = JSON.parse(JSON.stringify(this.applyListAll));
        // this.applyListAll = Object.assign([],this.applyList)
        this.$nextTick(() => {
          this.waterFall();
        });
      });
      getShortCutList().then(rt => {
        this.shortList = rt.data;
      });
    },
    handleAddShortCut(item) {
      item.processNameCn =
        item.processNameCn.indexOf("<font class='search-text'>") !== -1
          ? item.processNameCn.match(
              /<font class='search-text'>(\S*)<\/font>/
            )[1]
          : item.processNameCn;
      addToShortCut({
        processid: item.id,
        processname: item.processName,
        processnamecn: item.processNameCn
      })
        .then(rt => {
          console.log(rt);
          if (rt.status === "200") {
            this.$message.success(this.$t('hintText.addedSuccess'));
          } else {
            this.$message({
              message: rt.message
            });
          }
          this.getData();
        })
        .catch(err => {
          // this.$message.error(err.message)
        });
    },
    handleDelShortCut(id) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: "warning"
      })
        .then(() => {
          delShortCut(id).then(() => {
            this.$message.success(this.$t('hintText.addedSuccess'));
            this.getData();
          });
        })
        .catch(_ => {});
    },
    saveSuccess(data) {
      this.toHref(this.paramsData, data[0].id);
    },
    toFlowQuick(item) {
      item = {
        processNameCn: item.processnamecn,
        processName: item.processname,
        projectName: item.attribute3
      };

      this.toFlow(item);
    },
    toFlow(item) {
      this.paramsData = {
        processName: item.processName,
        PROJECTNAME: item.projectName,
        name: item.processNameCn
      };
      getPost(this.$store.state.basuser.user.id).then(rt => {
        if (rt.status === "200") {
          if (rt.data && rt.data.length > 0) {
            if (rt.data.length > 1) {
              this.itemData = rt.data;
              this.dialogVisible = true;
            } else {
              this.toHref(this.paramsData, rt.data[0].id);
            }
          } else {
            this.$message.error(this.$t('hintText.postMissingContactAdministrator'));
          }
        }
      });
      // this.$router.push({
      //   name: 'processFormStart',
      //   query: {
      //     name: item.name,
      //     processName: item.URLNAME,
      //     projectName: item.PROJECTNAME,
      //     defOrg: item.defOrg
      //   }
      // })
    },
    toHref(item, pid) {
      let routeData = "";
      checkProcessDefaultPage({
        processName: item.processName,
        instanceId: item.instanceId
      }).then(rt => {
        if (rt.status === "200") {
          item.name =
            item.name.indexOf("<font class='search-text'>") !== -1
              ? item.name.match(/<font class='search-text'>(\S*)<\/font>/)[1]
              : item.name;
          if (rt.data.isDefaultPage === "Y") {
            routeData = this.$router.resolve({
              name: item.processName + "Start",
              query: {
                name: item.name,
                processName: item.processName,
                projectName: item.PROJECTNAME,
                pid: pid
              }
            });
          } else {
            routeData = this.$router.resolve({
              name: "processFormStart",
              query: {
                name: item.name,
                processName: item.processName,
                projectName: item.PROJECTNAME,
                defOrg: item.defOrg,
                pid: pid
              }
            });
          }
          // window.open(routeData.href, "_blank");
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
        }
      });
    },
    waterFall() {
      const applyBox = document.getElementById("applyBox");
      const items = applyBox.children;
      if (items.length < 1) return;
      const gap = 0;
      // 1- 确定列数  = 页面的宽度 / 图片的宽度
      const pageWidth = this.getClient().width;
      const itemWidth = items[0].offsetWidth;
      const columns = parseInt(pageWidth / (itemWidth + gap));
      // applyBox.style.width = columns * (itemWidth + gap) + 'px'
      const arr = [];
      let maxHeight = 0;
      for (let i = 0; i < items.length; i++) {
        if (i < columns) {
          // 2- 确定第一行
          items[i].style.top = 0;
          items[i].style.left = (itemWidth + gap) * i + "px";
          arr.push(items[i].offsetHeight);
          if (items[i].offsetHeight > maxHeight) {
            maxHeight = items[i].offsetHeight;
          }
        } else {
          // 其他行
          // 3- 找到数组中最小高度  和 它的索引
          let minHeight = arr[0];
          let index = 0;
          for (let j = 0; j < arr.length; j++) {
            if (minHeight > arr[j]) {
              minHeight = arr[j];
              index = j;
            }
          }
          // 4- 设置下一行的第一个盒子位置
          // top值就是最小列的高度 + gap
          items[i].style.top = arr[index] + gap + "px";
          // left值就是最小列距离左边的距离
          items[i].style.left = items[index].offsetLeft + "px";

          // 5- 修改最小列的高度
          // 最小列的高度 = 当前自己的高度 + 拼接过来的高度 + 间隙的高度
          arr[index] = arr[index] + items[i].offsetHeight + gap;
          // chenbo add fix height
          if (arr[index] > maxHeight) {
            maxHeight = arr[index];
          }
        }
        // chenbo add fix height
        applyBox.style.height = maxHeight + "px";
      }
    },
    getClient() {
      let inwidth = document.getElementById("apply-create");
      return {
        width: inwidth.innerWidth || inwidth.clientWidth,
        height:
          window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight
      };
    }
  },
  mounted() {
    this.getData();
    window.onresize = () => {
      if (this.applyList.length > 0) {
        this.waterFall();
      }
    };
  },
  destroyed() {
    window.onresize = null;
  }
};
</script>

<style type="text/scss" lang="scss">
#frame {
  .search-text {
    color: #ed1111;
    background: #f4f408;
  }
  .quickLaunch {
    .quickLayout {
      width: 115px;
      height: 110px;
      float: left;
      overflow: hidden;
      text-align: center;
      margin-right: 16px;
      cursor: pointer;
      position: relative;
      left: 0;
      &:hover .button {
        display: inline-block;
        i {
          color: red !important;
        }
      }
      .button {
        display: none;
        position: absolute;
        font-size: 16px;
        top: -5px;
        right: 15px;
      }
      .circle {
        width: 50px;
        height: 50px;
        margin: auto;
        background-color: $bc4;
        color: white;
        border-radius: 50%;
        line-height: 50px;
        .iconfont {
          font-size: 26px;
        }
      }
      p {
        margin-top: 8px;
        line-height: 24px;
        font-size: 16px;
      }
    }
  }
  #applyBox {
    position: relative;
    height: 1000px;
    margin: 0 auto;
    .applyItem {
      width: 330px;
      position: absolute;
      padding: 0 20px 10px 20px;
      .itemContent {
        border: 1px solid #dedede;
        border-radius: 3px;
        padding: 0px;
        h2 {
          padding: 7px;
          text-align: center;
          background-color: $bc4;
          color: white;
          font-size: 20px;
        }
        ul li {
          padding: 10px 20px;
          h3 {
            /*margin-top: 3px;*/
            padding: 10px 0;
            font-size: 16px;
          }
          h4 {
            padding: 10px 0;
            /*margin-top: 10px;*/
            height: 20px;
            line-height: 20px;
            font-size: 15px;
          }
          div.cont {
            /*padding: 5px 10px;*/
            // p {
            //   height: 30px;
            //   line-height: 30px;
            //   cursor: pointer;
            //   padding-left: 10px;
            //   &:hover {
            //     text-decoration: underline;
            //   }
            // }
          }
        }
        .applylayout {
          background-color: #f9f9f9;
          border-radius: 3px;
          p {
            line-height: 30px;
            cursor: pointer;
            font-size: 13px;
            color: #333;
            padding-left: 2px;
            &:hover {
              text-decoration: underline;
              button {
                display: inline-block;
              }
            }

            button {
              display: none;
              margin-left: 10px;
            }
          }
          p:first-child {
            padding-top: 5px;
          }
          p:last-child {
            padding-bottom: 5px;
          }
        }
      }
    }
  }
}
</style>
