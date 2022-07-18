<template>
  <div
    :ref="treeRefName"
    :class="treeClassName"
    :style="scroll ? 'overflow: scroll' : ''"
  >
    <div
      v-for="item in convertData"
      :key="item.id"
      :class="[
        isChild ? 'process-tree-childNodes-row' : 'process-tree-roots',
        isChild && item.isLong ? 'long-with-line' : '',
      ]"
      :style="rootStyle"
    >
      <span
        :class="{
          'process-tree-node':
            item.children !== null && item.children.length >= 1,
          level2: item.level == '2' || item.level == '1',
          level3: item.level == '3',
          level4: item.level == '4',
          level5: item.level == '5',
          level6: item.level == '6' || item.level == '7' || item.level == '8',
        }"
        @click="
          topage(item);
          checkchild(item);
        "
      >
        <img
          v-if="item.tagss"
          src="../../../../assets/img/liuchen.png"
          style="float: left; padding: 0px 6px 0px 10px; width: 18px"
          alt=""
        />
        <span
          :class="{
            'float-width': item.tagss,
            'text-decoration': item.tags || item.tagss,
          }"
          :title="item.area"
        >
          <i class="el-icon-star-on" v-if="item.boname"></i
          ><i class="el-icon-s-flag" v-if="item.nodename"></i
          >{{ item.boname ? "业务对象:" + item.boname : ""
          }}{{ item.nodename || "" }}{{ item.area
          }}{{ item.childrenCount ? "(" + item.childrenCount + ")" : "" }}
          <span
            v-if="item.showMap !== undefined && item.showMap"
            class="node"
            @click.stop="changeShow(item)"
            >-</span
          >
          <span
            v-if="item.showMap !== undefined && !item.showMap"
            class="nodeadd"
            @click.stop="changeShow(item)"
            >+</span
          >
          <span v-if="item.chains.length !== 0" class="i-icon">
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('ViewProcessPerformance')"
              placement="top-start"
            >
              <el-popover placement="right" width="200" trigger="hover">
                <el-button
                  v-for="(i, index) in item.chains"
                  @click.stop="GVC(i.id)"
                  :key="index"
                  >{{ i.name }}</el-button
                >
                <i slot="reference" class="el-icon-data-line"></i>
              </el-popover>
              <!-- <i v-if="item.chains.length==1" slot="reference" class="el-icon-data-line" @click="GVC(item.chains[0].id)"></i>  -->
            </el-tooltip>
          </span>
        </span>
      </span>
      <div
        v-if="
          item.children &&
          item.children !== null &&
          (item.showMap === undefined ? true : item.showMap)
        "
        :class="[
          item.children.length > 1 ? 'multiply-node' : '',
          item.children.length == 1 ? 'single-node' : '',
        ]"
        class="process-tree-childNodes"
      >
        <div>
          <div
            v-for="(child, index) in item.children"
            :key="index"
            :class="[child.isLong ? 'long-with-line' : '']"
            class="process-tree-childNodes-row"
          >
            <div v-if="child.isLong" class="line" />
            <span
              :class="{
                'process-tree-node':
                  child.children !== null && child.children.length >= 1,
                level2: item.level == '2' || item.level == '1',
                level3: item.level == '3',
                level4: item.level == '4',
                level5: item.level == '5',
                level6:
                  item.level == '6' || item.level == '7' || item.level == '8',
              }"
              @click="
                topage(child);
                checkchild(child);
              "
            >
              <img
                v-if="child.tagss"
                src="../../../../assets/img/liuchen.png"
                style="float: left; padding: 0px 6px 0px 10px; width: 18px"
                alt=""
              />
              <span
                :class="{
                  'float-width': child.tagss,
                  'text-decoration': child.tags || child.tagss,
                }"
                :title="child.area"
              >
                <i class="el-icon-star-on" v-if="child.boname"></i
                ><i class="el-icon-s-flag" v-if="child.nodename"></i
                >{{ child.boname ? "业务对象:" + child.boname : ""
                }}{{ child.nodename || "" }}{{ child.area }}
                <span
                  v-if="child.showMap !== undefined && child.showMap"
                  class="node"
                  @click.stop="changeShow(child)"
                  >-</span
                >
                <span
                  v-if="child.showMap !== undefined && !child.showMap"
                  class="nodeadd"
                  @click.stop="changeShow(child)"
                  >+</span
                >
                <span v-if="child.chains.length !== 0" class="i-icon">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('ViewProcessPerformance')"
                    placement="top-start"
                  >
                    <el-popover placement="right" width="200" trigger="hover">
                      <el-button
                        v-for="(i, index) in child.chains"
                        @click.stop="GVC(i.id)"
                        :key="index"
                        >{{ i.name }}</el-button
                      >
                      <i slot="reference" class="el-icon-data-line"></i>
                    </el-popover>
                  </el-tooltip>
                </span>
              </span>
            </span>
            <div
              v-if="
                child.children &&
                child.children !== null &&
                (child.showMap === undefined ? true : child.showMap)
              "
              :class="[
                child.children.length > 1 ? 'multiply-node' : '',
                child.children.length == 1 ? 'single-node' : '',
              ]"
              class="process-tree-childNodes"
            >
              <processTree :data="child.children || []" :is-child="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getCommunityList,
  getNodeByListid2,
  getBoByListAndKey,
} from "@/bpa/api/processModelCenter/processCommunity";
export default {
  name: "ProcessTree",
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
    isChild: {
      type: Boolean,
      default: false,
    },
    scroll: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      num: 0,
      convertData: this.convert(JSON.parse(JSON.stringify(this.data))),
      rootStyle: {},
    };
  },
  computed: {
    treeRefName() {
      return this.isChild ? "childTree" : "baseTree";
    },
    treeClassName() {
      return this.isChild ? "" : "process-tree";
    },
  },
  watch: {
    data() {
      this.convertData = this.convert(JSON.parse(JSON.stringify(this.data)));
    },
  },
  methods: {
    checkchild(item) {
      console.log(item);
      if (item.nocan == false) {
        return false;
      }
      if (item.nodeid) {
      } else {
        getNodeByListid2(item.listid).then((res) => {
          this.$set(item, "nocan", false);
          if (res && res.length > 0) {
            res.forEach((ele, key) => {
              this.$set(ele, "children", []);
              this.$set(ele, "chains", []);
              this.$set(ele, "level", "3");
            });
            item.children.push(...res);
          }
        });
      }
      getBoByListAndKey(item.listid, item.nodeid).then((res) => {
        this.$set(item, "nocan", false);
        if (res && res.length > 0) {
          res.forEach((ele, key) => {
            this.$set(ele, "children", []);
            this.$set(ele, "chains", []);
            this.$set(ele, "level", "3");
          });
          item.children.push(...res);
        }
      });
      this.$forceUpdate();
    },
    GVC(e) {
      let { href } = this.$router.resolve({
        path: "/processPerformance/processPerformance",
        query: {
          id: e,
        },
      });
      window.open(href, "_blank");
    },
    // 展开收起事件
    changeShow(doc) {
      this.convertData.map((child, index) => {
        if (doc.id === child.id) {
          this.$set(
            this.convertData[index],
            "showMap",
            !this.convertData[index].showMap
          ); // 刷新数据
        } else {
          if (child.children !== null && child.children.length > 0) {
            child.children.map((childs, indexs) => {
              if (doc.id === childs.id) {
                this.$set(
                  this.convertData[index].children[indexs],
                  "showMap",
                  !this.convertData[index].children[indexs].showMap
                ); // 刷新数据
              }
            });
          }
        }
      });
    },
    initDomWidth() {
      let leafs = document.getElementsByClassName("leaf-node");
      leafs = Array.from(leafs);
      leafs = leafs.map((i) => {
        const total = this.getOffset(i, "offsetLeft");
        return total;
      });
      this.rootStyle = { width: Math.max(...leafs) * 1.5 + "px" };
    },
    topage(item) {
      let _this = this;
      getCommunityList({
        filters: [
          {
            key: "modelid",
            value: item.id,
          },
        ],
        orderby: "createon",
        sort: "desc",
        pageNum: 1,
        pageSize: 5,
      },1).then((res) => {
        if (!!res.list && res.list.length > 0) {
          _this
            .$confirm(
              this.$t("hintText.WhetherToViewTheProcessCommunity"),
              this.$t("hintText.hint"),
              {
                confirmButtonText: this.$t("confirm"),
                cancelButtonText: this.$t("cancel"),
                type: "warning",
              }
            )
            .then(() => {
              _this.$router.push("/processDetails/" + res.list[0].id);
              window.open(urls, "_blank");
            })
            .catch((err) => {});
        } else {
          _this.$message({
            message: this.$t("hintText.notBeenPublishedAndCannotBeAccessed"),
            type: "warining",
          });
        }
      });
      // if (item.tags) {
      //   var url = '#/rulesAbolishDetail/' + item.id + '/null'
      //   window.open(url, '_blank')
      //   return false
      // } else if (item.tagss) {
      //   var urls = '#/processDetails/' + item.id
      //   window.open(urls, '_blank')
      // } else {
      //   const { href } = this.$router.resolve({
      //     path: '/rulesCenter/ruleView',
      //     query: {
      //       parent: item.parents
      //     }})
      //   window.open(href, '_blank')
      // }
    },
    getOffset(obj, offsetDir) {
      var realNum = obj[offsetDir];
      var positionParent = obj.offsetParent; // 获取上一级定位元素对象
      while (positionParent != null) {
        realNum += positionParent[offsetDir];
        positionParent = positionParent.offsetParent;
      }
      return realNum;
    },
    convert(arr) {
      return arr.map((item) => {
        if (item.children && item.children.length > 0) {
          item.children = this.convert(item.children);
        }
        return item;
      });
    },
    isLeaftNode(data) {
      return data.children && data.children.length > 0 ? "" : "leaf-node";
    },
  },
};
</script>

<style scoped>
.process-tree {
  padding-top: 110px;
  /* overflow: scroll; */
  /* padding-bottom: 27px; */
  width: 100%;
  padding-right: 0;
  font-size: 0;
  line-height: 0;
}
.process-tree-roots {
  width: 182%;
  margin-bottom: 20px;
}
.single-node::before {
  content: "";
  display: block;
  position: absolute;
  width: 23px;
  height: 2px;
  background: rgba(203, 221, 238, 1);
  left: -23px;
  top: 50%;
}
.multiply-node::before {
  content: "";
  display: block;
  position: absolute;
  width: 2px;
  height: 100%;
  background: rgba(203, 221, 238, 1);
  left: -22px;
  top: 0;
}

.process-tree-node {
  position: relative;
  padding: 12px 10px;
  border-radius: 2px;
  color: #fff;
  display: inline-block;
  cursor: pointer;
  min-width: 80px;
  text-align: center;
  font-size: 12px;
  line-height: 1.8em;
  vertical-align: middle;
  min-height: 20px;
  width: 210px;
}
.process-tree-node::after {
  content: "";
  display: block;
  width: 37px;
  height: 2px;
  background: rgba(203, 221, 238, 1);
  position: absolute;
  left: 100%;
  top: 49%;
}
.leaf-node::after {
  display: none;
}

.process-tree-childNodes {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  margin-left: 59px;
  top: -0.5px;
}
.process-tree-childNodes > div {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.multiply-node .process-tree-childNodes-row::before {
  content: "";
  display: block;
  position: absolute;
  width: 20px;
  height: 2px;
  background: rgba(203, 221, 238, 1);
  left: -20px;
  top: 50%;
}
.multiply-node .process-tree-childNodes-row:first-child::after,
.multiply-node .process-tree-childNodes-row:last-child::after {
  content: "";
  position: absolute;
  display: block;
  width: 4px;
  height: 50%;
  background: #fff;
  left: -23px;
}
.multiply-node .long-with-line:first-child::after,
.multiply-node .long-with-line:last-child::after {
  left: -166px;
}
.multiply-node .process-tree-childNodes-row:first-child::after {
  top: 0px;
}
.multiply-node .process-tree-childNodes-row:last-child::after {
  bottom: -4px;
}

.process-tree-childNodes-row {
  position: relative;
  margin-bottom: 10px;
}
.process-tree-childNodes-row:last-child {
  margin-bottom: 0;
}

.long-with-line {
  margin-left: 142px;
}
.line {
  position: absolute;
  width: 142px;
  height: 2px;
  background-color: rgba(203, 221, 238, 1);
  top: 50%;
  left: -161px;
}
.level2 {
  background-color: #2d42af;
  cursor: pointer;
  position: relative;
  padding: 12px 10px;
  border-radius: 2px;
  color: #fff;
  display: inline-block;
  cursor: pointer;
  min-width: 80px;
  text-align: left;
  font-size: 12px;
  line-height: 1.8em;
  vertical-align: middle;
  min-height: 20px;
  width: 210px;
}
.level3 {
  background-color: #2d42af;
  cursor: pointer;
  position: relative;
  padding: 12px 10px;
  border-radius: 2px;
  color: #fff;
  display: inline-block;
  cursor: pointer;
  min-width: 80px;
  text-align: left;
  font-size: 12px;
  line-height: 1.8em;
  vertical-align: middle;
  min-height: 20px;
  width: 210px;
}
.level4 {
  background-color: #5264bf;
  cursor: pointer;
  position: relative;
  padding: 12px 10px;
  border-radius: 2px;
  color: #fff;
  display: inline-block;
  cursor: pointer;
  min-width: 80px;
  text-align: left;
  font-size: 12px;
  line-height: 1.8em;
  vertical-align: middle;
  min-height: 20px;
  width: 210px;
}
.level5 {
  background-color: #7084cc;
  cursor: pointer;
  position: relative;
  padding: 12px 10px;
  border-radius: 2px;
  color: #fff;
  display: inline-block;
  cursor: pointer;
  min-width: 80px;
  text-align: left;
  font-size: 12px;
  line-height: 1.8em;
  vertical-align: middle;
  min-height: 20px;
  width: 210px;
}
.level6 {
  background-color: #9aaad9;
  cursor: pointer;
  position: relative;
  padding: 12px 10px;
  border-radius: 2px;
  color: #fff;
  display: inline-block;
  cursor: pointer;
  min-width: 80px;
  text-align: left;
  font-size: 12px;
  line-height: 1.8em;
  vertical-align: middle;
  min-height: 20px;
  width: 210px;
}
.float-width {
  float: left;
  width: 172px;
}
.text-decoration {
  /* text-decoration:underline;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; */
}
.node {
  text-align: center;
  background: #fff;
  border-radius: 50%;
  border: 1.5px solid #2d42af;
  color: #2d42af;
  cursor: pointer;
  width: 16px;
  height: 16px;
  line-height: 14px;
  margin-right: 10px;
  position: absolute;
  right: -38px;
  top: 34%;
  z-index: 999;
  font-size: 18px;
}
.nodeadd {
  text-align: center;
  background: #fff;
  border-radius: 50%;
  border: 1.5px solid #2d42af;
  color: #2d42af;
  cursor: pointer;
  width: 16px;
  height: 16px;
  line-height: 16.5px;
  margin-right: 10px;
  position: absolute;
  right: -38px;
  top: 34%;
  z-index: 999;
  font-size: 18px;
}
.i-icon {
  position: absolute;
  right: 4px;
  bottom: 4px;
}
</style>
