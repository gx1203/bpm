<template>
  <div v-loading="loading" id="categoryone">
    <el-card shadow="never" class="clear-fix card-reset" id="apply-create">
      <div class="item-left">
        <el-form size="mini" label-position="left" @submit.native.prevent>
          <el-row>
            <el-col :span="24">
              <el-form-item>
                <div class="tool-common-wrap">
                  <div class="search-wrap">
                    <el-input
                      style="width: 250px;"
                      clearable
                      prefix-icon="iconfont icon-sousuo2"
                      v-model="filterText"
                      :placeholder="
                        $t('placeholderText.pleaseEnterSearchContent')
                      "
                      @keyup.enter.native="searchProcess"
                    >
                      <span slot="append" @click="searchProcess">{{$t('search')}}</span>
                    </el-input>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- <div class="classify-layout">
          <div
            class="classify-div"
            @click="classifyHandle($t('commonlyUsedProcess'))"
          >
            <div
              class="classify-but"
              :class="
                activeName.NAME === $t('commonlyUsedProcess') ? 'active' : ''
              "
            >
              {{ $t("commonlyUsedProcess") }}
            </div>
          </div>
          <div
            class="classify-div"
            v-for="(item, index) in classifyList"
            :key="index"
            @click="classifyHandle(item, index)"
          >
            <div
              class="classify-but overflow-els"
              :title="item.name"
              :class="activeName.ID === item.id ? 'active' : ''"
            >
              {{ item.name }}
            </div>
          </div>
        </div> -->
        <!-- <el-input clearable
          :placeholder="$t('placeholderText.enterKeywordsFiltering')"
          v-model="filterText">
        </el-input> -->
        <div class="treeWrap" style="margin-top: 10px;">
          <!-- <el-input clearable
            :placeholder="$t('placeholderText.enterKeywordsFiltering')"
            v-model="filterText">
          </el-input> -->
          <div class="common-process" :class="isHighlight ? 'common-process-active' : ''" @click="handleHighlight">{{ $t('commonProcess') }}</div>
          <el-tree
            node-key="id"
            class="filter-tree"
            :data="categoryList"
            :props="defaultProps"
            :default-expanded-keys="defaultExpandedKeys"
            highlight-current
            @node-click='handleClick'
            :filter-node-method="filterNode"
            ref="tree">
            <div class="custom-tree-node w100" slot-scope="{ node }">
                <p
                  :title="node.label"
                  style="font-size: 13px"
                >
                  {{node.label}}
                </p>
            </div>
          </el-tree>
        </div>
      </div>
      <div id="applyBox">
        <el-row
          v-if="activeName.NAME !== $t('commonlyUsedProcess')"
          :gutter="20"
          align="center"
          class="tool-common-wrap"
        >
          <h3>{{ activeName.NAME }}
            <div class="search-wrap">
              <el-input
                clearable
                prefix-icon="iconfont icon-sousuo2"
                v-model="searchForm.name"
                @keyup.enter.native="searchHandle"
                :placeholder="$t('placeholderText.pleaseEnterProcessName')"
              >
                <span slot="append" @click="searchHandle">{{$t('search')}}</span>
              </el-input>
            </div>
          </h3>
          <el-col
            :span="8"
            v-for="item in applyLists"
            :key="item.id"
            style="margin: 5px 0"
          >
            <div class="apply" @click="toFlow(item)">
              <div class="apply-icon" :style="'backgroundColor:' + item.color">
                <i
                  class="iconfont"
                  :class="item.icon ? item.icon : 'icon-zhuanxierizhi'"
                ></i>
              </div>
              <div class="apply-name overflow-els" :title="item.processNameCn">
                {{item.code}}{{ item.processNameCn }}
              </div>
              <el-button
                type="text"
                class="button"
                :title="$t('addCommonProcesses')"
                icon="el-icon-plus"
                @click.stop="handleAddShortCut(item)"
              ></el-button>
            </div>
          </el-col>
        </el-row>
        <!-- 常用流程 -->
        <el-row v-else class="quickLaunch tool-common-wrap" :gutter="20" align="center">
          <h3>{{ activeName.NAME }}
            <div class="search-wrap">
              <el-input
                clearable
                prefix-icon="iconfont icon-sousuo2"
                v-model="searchForm.name"
                @keyup.enter.native="searchHandle"
                :placeholder="$t('placeholderText.pleaseEnterProcessName')"
              >
                <span slot="append" @click="searchHandle">{{$t('search')}}</span>
              </el-input>
            </div>
          </h3>
          <!-- <div v-if="searchForm.name !== ''">
            <el-col
              :span="8"
              v-for="item in applyLists"
              :key="item.id"
              style="margin: 5px 0"
            >
              <div class="apply" @click="toFlow(item)">
                <div
                  class="apply-icon"
                  :style="'backgroundColor:' + item.color"
                >
                  <i
                    class="iconfont"
                    :class="item.icon ? item.icon : 'icon-zhuanxierizhi'"
                  ></i>
                </div>
                <div
                  class="apply-name overflow-els"
                  :title="item.processNameCn"
                >
                  {{ item.processNameCn }}
                </div>
                <el-button
                  type="text"
                  class="button"
                  :title="$t('addCommonProcesses')"
                  icon="el-icon-plus"
                  @click.stop="handleAddShortCut(item)"
                ></el-button>
              </div>
            </el-col>
          </div> -->
          <div>
            <el-col
              :span="8"
              v-for="item in shortList"
              :key="item.id"
              style="margin: 5px 0"
            >
              <div class="apply" @click="toFlowQuick(item)">
                <div
                  class="apply-icon"
                  :style="'backgroundColor:' + item.color"
                >
                  <i
                    class="iconfont"
                    :class="item.icon ? item.icon : 'icon-zhuanxierizhi'"
                  ></i>
                </div>
                <div
                  class="apply-name overflow-els"
                  :title="item.processnamecn"
                >
                  {{ item.processnamecn }}
                </div>
                <el-button
                  type="text"
                  class="button"
                  :title="$t('deleteCommonProcesses')"
                  icon="el-icon-delete"
                  @click.stop="handleDelShortCut(item.id)"
                ></el-button>
              </div>
            </el-col>
          </div>
        </el-row>
      </div>
      <choose-jobs
        :item="itemData"
        v-model="dialogVisible"
        @confirm="saveSuccess"
      ></choose-jobs>
    </el-card>
    <el-card shadow="never" class='commonUserProcess card-reset' style="height: 100%">
      <p class='commonHeader'><i class="el-icon-edit"></i>{{$t("commonlyUsedProcess")}}</p>
      <el-row>
        <el-col
              :span="24"
              v-for="item in shortList"
              :key="item.id"
            >
              <div class="apply" @click="toFlowQuick(item)">
                <div
                  class="apply-name overflow-els"
                  :title="item.processnamecn"
                >
                  {{ item.processnamecn }}
                </div>
                <i class="el-icon-delete"
                :title="$t('deleteCommonProcesses')"
                  @click.stop="handleDelShortCut(item.id)">
                </i>
              </div>
            </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import chooseJobs from "./chooseJobs";

export default {
  data() {
    return {
      isHighlight: true, // 高亮常用流程
      selectIndex: "",
      activeBoolean: false,
      dialogVisible: false,
      loading: false,
      itemData: [],
      classifyList: [],
      activeName: {
        NAME: this.$t("commonlyUsedProcess"),
      },
      searchForm: {
        name: "",
      },
      shortShow: false,
      paramsData: {},
      applyList: [],
      shortList: [],
      applyLists: [],
      shortHttpList: [],
      searchType: 'commonly',
      boole: false,
      applyListAll: [],
      categoryList: [],
      defaultExpandedKeys: [],
      isMore: false,
      defaultProps: {
        label: 'name',
        // isLeaf: 'isParent',
        children: 'subNodes'
      },
      treeData: [],
      filterText: '',
    };
  },
  watch: {
    'searchForm.name' (val) {
      // this.searchHandle()
    }
  },
  components: {
    chooseJobs,
  },
  mounted() {
    this.getData();
  },
  methods: {
    handleCategoryData(item, index) {
      this.selectIndex = index;
      this.activeName.NAME = item.name;
      this.activeName.ID = item.id;
      this.classifyList = this.categoryList[index].subNodes;
      this.applyLists = this.categoryList[index].processes;
      this.classifyHandle(this.$t("commonlyUsedProcess"));
    },
    applyListF(list) {
      let _this = this;
      list.forEach((item) => {
        if (item.processes && item.processes.length > 0) {
          _this.applyLists = [..._this.applyLists, ...item.processes];
        }
        if (item.subNodes && item.subNodes.length > 0) {
          _this.applyListF(item.subNodes);
        }
      });
    },
    classifyHandle(item, index) {
      console.log(item);
      let than = this;
      than.searchForm.name = "";
      if (item === this.$t("commonlyUsedProcess")) {
        than.activeName = {
          NAME: this.$t("commonlyUsedProcess"),
        };
        than.applyLists = than.applyList;
      } else {
        // than.activeName = item;
        than.activeName.NAME = item.name;
        than.activeName.ID = item.id;
        than.applyLists = item.processes;
        // than.applyLists = [];
        // let _list = this.applyListAll.find(item => {
        //   return item.id == than.activeName.ID;
        // });
        // if (_list && _list.processes && _list.processes.length > 0) {
        //   than.applyLists = [...than.applyLists, ..._list.processes];
        // }
        // than.applyListF(_list.subNodes || []);
      }
    },
    searchHandle() {
      let list = [];
      let keyWords = this.searchForm.name.toLowerCase();
      // if(this.activeName.NAME !==$t('commonlyUsedProcess'))
      console.log(keyWords, this.applyList, this.activeName.ID,this.searchType)
      if (keyWords) {
        //  this.applyLists = this.applyLists.filter(item => item.processNameCn == this.searchForm.name)
        if (this.searchType === 'generally') {
          this.applyList.filter((item) => {
            if (item.processNameCn && item.processNameCn.toLowerCase().indexOf(keyWords) !== -1) {
              list.push(item);
            }
          });
          this.applyLists = list;
        } else {
          this.applyLists.filter((item) => {
            if (item.processNameCn && item.processNameCn.toLowerCase().indexOf(keyWords) !== -1) {
              item.processnamecn = item.processNameCn
              item.processname = item.processName
              item.attribute3 = item.projectName
              list.push(item);
            }
          });
          this.shortList = list
        }
        console.log(this.shortHttpList)
        console.log(this.applyLists)
      } else {
        if (this.searchType === 'generally') {
          this.applyLists = this.applyList.filter((item) => {
            return item.processNameCn.indexOf(keyWords) !== -1;
          });
        } else {
          this.shortList = this.shortHttpList.filter((item) => {
            return item.processnamecn.indexOf(keyWords) !== -1;
          });
        }
      }
    },
    // searchHandleCopy() {
    //   let than = this;
    //   if (!than.searchForm.name) {
    //     than.applyLists = [];
    //     let _list = this.applyListAll.find((item) => {
    //       return item.id == than.activeName.ID;
    //     });
    //     if (_list && _list.processes && _list.processes.length > 0) {
    //       than.applyLists = [...than.applyLists, ..._list.processes];
    //     }
    //     than.applyListF(_list.subNodes || []);
    //   } else {
    //     than.applyLists = than.applyList.filter((item) => {
    //       return item.processNameCn.indexOf(than.searchForm.name) !== -1;
    //     });
    //   }
    // },
    getData() {
      this.loading = true;
      this.$http({
        url: `/bpm/createnav/applyForCreation`,
        method: "GET"
      }).then((res) => {
        
        // HuangXiaxiao 2022.10.19 业务办理平台--申请创建--根据账号角色权限，显示/隐藏部分流程
        
        // 查询用户的角色 
        this.$http({
          url: `/userModel/get/` + this.$store.state.basuser.user.id,
          method: "GET"
        }).then((rt) => {
          // 管理员 角色代码
          var adminCode = "637476";
          if(rt.status == "200") {
            var checkedRoleIds = rt.data.checkedRoleIds || [];
            var indexOffset = checkedRoleIds.indexOf(adminCode);
            if(indexOffset < 0){
              //不是管理员 ，隐藏部分流程操作
              var hideName = "外部流程发起";
              res.data.forEach((obj,objIndex) => {
                if(obj.name != hideName) {
                  this.categoryList.push(obj);
                }
              });
              if(this.categoryList.length) {
                this.defaultExpandedKeys = [this.categoryList[0].id]
              }
              // console.log('🍓categoryList', this.categoryList)
            }else{
              this.categoryList = res.data;
              if(this.categoryList.length) {
                this.defaultExpandedKeys = [this.categoryList[0].id]
              }
              // console.log('🍓categoryList', this.categoryList)
            }

            

          }
        });

      });
      this.$http({
        url: `/bpm/createnav/initiate-list`,
        method: "GET"
      }).then((rt) => {
        this.applyListAll = rt.data;
        console.log(this.applyListAll)
        this.applyLists = [];
        // this.classifyList = [];
        this.applyListF(this.applyListAll);
        this.applyList = JSON.parse(JSON.stringify(this.applyLists));
        console.log('🍓applyList', this.applyList)
        // this.classifyList = this.applyListAll.map((item) => {
        //   return {
        //     NAME: item.name,
        //     ID: item.id,
        //   };
        // });
        // this.searchHandle();
      });
      // this.$http({
      //   url: `/bpm/createnav/initiate-list`,
      //   method: "GET"
      // }).then((rt) => {
      //   this.applyListAll = rt.data;
      //   this.applyLists = [];
      //   this.classifyList = [];
      //   this.applyListF(this.applyListAll);
      //   this.applyList = JSON.parse(JSON.stringify(this.applyLists));
      //   this.classifyList = this.applyListAll.map((item) => {
      //     return {
      //       NAME: item.name,
      //       ID: item.id,
      //     };
      //   });
      //   // this.searchHandle();
      // });
      this.$http({
        url: `/bpm/createnav/query`,
        method: "POST"
      }).then((rt) => {
        this.loading = false;
        console.log(rt.data)
        this.shortList = rt.data;
        this.shortHttpList = rt.data
      });
    },
    searchProcess () {
      this.$refs.tree.filter(this.filterText)
    },
    filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
    },
    handleHighlight() {
      this.isHighlight = true
      this.activeName.NAME = '常用流程'
      this.searchForm.name = ''
      this.searchType = 'commonly'
      this.getData();
    },
    handleClick(data, treeItem) {
      this.isHighlight = false
      this.searchType = 'generally'
      this.searchForm.name = ''
      if (treeItem.level === 2) {
        this.activeName.NAME = data.name;
        this.activeName.ID = data.id;
        this.applyLists = data.processes;
        this.applyList = data.processes;
        // this.classifyHandle(this.$t("commonlyUsedProcess"));
      }
    },
    handleAddShortCut(item) {
      this.$http({
        url: `bpm/createnav/save`,
        method: "POST",
        data: {
          userid: this.$store.state.basuser.user.id,
          processid: item.id,
          processname: item.processName,
          processnamecn: item.processNameCn
        }
      })
        .then((rt) => {
          if (rt.status === "200") {
            this.$message.success(this.$t("hintText.operateSuccessfully"));
            // this.handleHighlight()
            // this.getData();
          } else {
            this.$message.error(rt.message);
          }
        })
        .catch((err) => {
          // this.$message.error(err.message)
        });
    },
    handleDelShortCut(id) {
      this.$http({
        url: `bpm/createnav/delete/${id}`,
        method: "DELETE"
      }).then(() => {
        this.$message.success(this.$t("hintText.operateSuccessfully"));
        this.getData();
      });
    },
    saveSuccess(data) {
      this.toHref(this.paramsData, data[0].id);
    },
    toFlowQuick(item) {
      console.log(item)
      item = {
        processNameCn: item.processnamecn,
        processName: item.processname,
        projectName: item.attribute3,
      };
      this.toFlow(item);
    },
    toFlow(item) {
      console.log(item)
      this.paramsData = {
        NAME: item.processNameCn,
        URLNAME: item.processName,
        PROJECTNAME: item.projectName,
      };
      this.$http({
        url: `/userModel/getCurrentUserPost`,
        method: "GET"
      }).then((rt) => {
        if (rt.status === "200") {
          if (rt.data && rt.data.length > 0) {
            if (rt.data.length > 1) {
              this.itemData = rt.data;
              this.dialogVisible = true;
            } else {
              this.toHref(this.paramsData, rt.data[0].id);
            }
          } else {
            this.$message.error(
              this.$t("hintText.postMissingContactAdministrator")
            );
          }
        }
      });
    },
    toHref(item, pid) {
      let routeData = "";
      this.$http({
        url: `/bpm/process/checkProcessDefaultPage`,
        method: "POST",
        data: {
          processName: item.URLNAME,
          instanceId: item.instanceId,
        }
      }).then((rt) => {
        if (rt.status === "200") {
          console.log(rt)
          if (rt.data.isDefaultPage === "Y") {
            routeData = this.$router.resolve({
              name: item.URLNAME + "Start",
              query: {
                name: item.NAME,
                processName: item.URLNAME,
                projectName: item.PROJECTNAME,
                defOrg: item.defOrg,
                dname: dname,
                pid: pid,
              },
            });
          } else {
            routeData = this.$router.resolve({
              name: "processFormStart",
              query: {
                name: item.NAME,
                processName: item.URLNAME,
                projectName: item.PROJECTNAME,
                defOrg: item.defOrg,
                pid: pid,
              },
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
  },
  destroyed() {
    window.onresize = null;
  },
};
</script>
<style type="text/scss" lang="scss">
#categoryone {
  height: 100%;
  // position: relative;
  .item-left {
    width: 270px;
    padding: 0 20px 0 0 !important;
    height: calc(100vh - 170px);
    box-sizing: border-box;
    border-right: 1px solid #D7D7D7;
    .el-form-item--mini.el-form-item {
      margin-bottom: 0px
    }
  }
  .commonUserProcess {
    // position: absolute;
    // top: 0px;
    // right: 0px;
    // width: 250px;
    float: right;
    width: 23%;
    height: 302px;
    // overflow: auto;
    .el-card__body {
      .commonHeader {
        font-size: 16px;
        color: #fff;
        height: 40px;
        line-height: 40px;
        padding-left: 22px;
        background: #2D42AF;
        opacity: 1;
        border-radius: 2px 2px 0px 0px
      }
      .row {
        height: 262px;
        overflow: auto;
      }
      .apply {
        box-sizing: border-box;
        height: 37px;
        line-height: 37px;
        padding: 0px 0px 0px 22px;
        border: 0;
        border-radius: 0px;
        .apply-name {
          padding-left: 0px;
          font-size: 14px;
          color: #666666;
        }
        i {
          display: none;
          line-height: 37px;
          padding-left: 28px;
          color: #E53B3B;
        }
        &:hover {
          background-color: #F3F3F3;
          i {
            display: inline-block;
          }
        }
      }
    }
  }
  .apply {
    height: 48px;
    line-height: 48px;
    padding: 10px;
    border: 1px solid $dc1;
    position: relative;
    border-radius: 10px;
    cursor: pointer;
    overflow: hidden;
    display: flex;
    &:hover {
      background-color: #eeeeee;
      .button {
        color: #fff;
        display: inline-block !important;
      }
    }
    .button {
      display: none !important;
      position: absolute;
      color: #fff;
      background-color: #0066cc !important;
      height: 72px;
      width: 50px;
      transform: rotate(-45deg);
      top: -29px;
      right: -25px;
      i {
        font-size: 16px;
        position: absolute;
        transform: rotate(45deg);
        bottom: 30px;
        left: 3px;
      }
    }

    .apply-icon {
      display: inline-block;
      border-radius: 8px;
      color: #fff;
      height: 48px;
      width: 48px;
      line-height: 48px;
      text-align: center;
      background-color: $bc4;
      .iconfont {
        font-size: 26px;
      }
    }
    .apply-name {
      display: inline-block;
      width: calc(100% - 60px);
      padding-left: 10px;
      overflow: hidden;
      font-size: 16px;
    }
  }
  #apply-create {
    // width: 870px;
    width: 77%;
    display: inline-block;
    .left-nav {
      width: 50px;
      height: 500px;
      overflow-y: scroll;
      margin-right: 10px;
      box-sizing: border-box;
      .left-title {
        color: #ffffff;
        font-size: 14px;
        text-align: center;
        li {
          padding: 10px 4px;
          border-bottom: 1px solid #ffffff;
          word-wrap: break-word;
          word-break: normal;
          background: #eeeeee;
          color: #838383;
          // background:#d1cfcf;
        }
        li:hover,
        li.active {
          color: #fff;
          background: #2d42af;
          cursor: pointer;
        }
      }
    }
    .left-nav::-webkit-scrollbar {
      width: 5px;
      height: 10px;
      /**/
    }
    .left-nav::-webkit-scrollbar-track {
      background: #eee;
      border-radius: 2px;
    }
    .left-nav::-webkit-scrollbar-thumb {
      background: #bfbfbf;
      border-radius: 10px;
    }
    .left-nav::-webkit-scrollbar-thumb:hover {
      background: #bfbfbf;
    }
    .left-nav::-webkit-scrollbar-corner {
      background: #179a16;
    }
    .quickLaunch {
      .button {
        background-color: red !important;
      }
    }
    #applyBox {
      position: relative;
      flex: 1;
      height: calc(100vh - 300px);
      overflow-y: auto;
      overflow-x: hidden;
      margin: 0 auto;
      padding: 0 12px;
      h3 {
        margin: 10px;
        font-size: 16px;
        // border-left: 5px solid $bc4;
        border-left: none!important;;
        padding-left: 10px;
        padding-bottom: 14px;
        overflow: auto;
        border-bottom: 1px solid #D7D7D7;
        .search-wrap {
          float: right;
          // .el-input {
          //   width: 175px;
          //   float: right;
          // }
        }
        &:before{
              content: "";
              display: block;
              width: 5px;
              height: 20px;
              background: $bc4;
              position: absolute;
              left: 10px;
              top: 12px;
        }
      }
    }
    .el-card__body {
      display: flex;
      padding-left: 0;
      padding-right: 10px;
    }
    .classifyNav {
      width: 180px;
      margin-right: 20px;
      padding: 5px 10px;
      .classify-layout {
        height: calc(100vh - 350px);
        overflow: auto;
      }
      .classify-div {
        height: 30px;
        line-height: 30px;
        .classify-but {
          font-size: 14px;
          border-radius: 5px;
          padding: 0 10px;
          cursor: pointer;
          &:hover {
            background-color: #eeeeee;
          }
        }
        .classify-but.active {
          background-color: $bc4;
          color: #fff;
        }
      }
    }
  }
}
.common-process {
  background-color: #fff;
  color: #666666;
  padding: 3px 24px;
  font-size: 13px;
  cursor: pointer;
}
.common-process-active {
  background-color: #2d42af;
  color: #fff;
}
///deep/ .is-current .el-tree-node__content {
//  background-color: #2d42af !important;
//}
</style>
<style type="text/scss" lang="scss" scoped>
.filter-tree {
  /deep/ .el-tree-node.is-current > .el-tree-node__content {
    background-color: #2d42af !important;
    .custom-tree-node {
      color: #fff;
    }
  }
  /deep/ .custom-tree-node {
    display: flex;
    align-items: center;
    box-sizing: border-box;
  }
}
</style>
