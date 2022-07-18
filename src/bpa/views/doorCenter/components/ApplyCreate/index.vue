<template>
  <div class="container">
    <div class="card-header">
      <div class="title">
        <b>{{ "常用流程" }}</b>
      </div>
      <div class="more" @click="viewMore">
        {{ $t("toViewMore") }}<i class="el-icon-arrow-right" />
      </div>
    </div>
    <el-carousel
      trigger="click"
      indicator-position="none"
      :autoplay="false"
    >
      <el-carousel-item
        v-for="(ShortcutIcons, index) in ShortcutIconsList"
        :key="index"
      >
        <el-row class="carousel-content">
          <el-col :span="12" v-for="item in ShortcutIcons" :key="item.id">
            <div class="item" @click="toFlowQuick(item)">
              <div class="img">
                <img :src="require(`@/bpa/assets/img/home/applyCreate.png`)">
              </div>
              <div class="title" :title="item.processnamecn">
                {{ item.processnamecn }}
              </div>
              <div class="arrowRight">
                <img :src="require(`@/bpa/assets/img/home/arrowRight.png`)">
              </div>
            </div>
          </el-col>
        </el-row>
      </el-carousel-item>
    </el-carousel>

    <select-post
      :item="itemData"
      v-model="dialogVisible"
      @confirm="saveSuccess"
    ></select-post>
  </div>
</template>

<script>
import { getShortCutList } from "@/bpm/api/staging/personal/apply_create.js";

import SelectPost from "./components/SelectPost";
import { getPost } from "@/bpm/api/process/administrativeTool/agents_change";
import { checkProcessDefaultPage } from "@/bpm/api/flow";

export default {
  components: {
    SelectPost
  },
  created() {
    this.getShortCutList();
  },
  data() {
    return {
      shortList: [],
      dialogVisible: false,
      itemData: [],
      paramsData: {}
    };
  },
  computed: {
    ShortcutIconsList() {
      let size = 8;
      let arrs = [];
      if (this.shortList.length) {
        for (let i = 0; i < this.shortList.length; i++) {
          if (arrs.length === 0 || arrs[arrs.length - 1].length === size) {
            arrs.push([]);
          }
          arrs[arrs.length - 1].push(this.shortList[i]);
        }
      }
      return arrs;
    }
  },
  methods: {
    // 获取常用流程
    getShortCutList() {
      getShortCutList().then(rt => {
        this.shortList = rt.data || [];
      });
    },
    // 查看更多
    viewMore() {
      this.$router.push("/staging/personal/applyCreate");
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
        NAME: item.processNameCn,
        URLNAME: item.processName,
        PROJECTNAME: item.projectName
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
            this.$message.error(
              this.$t("hintText.postMissingContactAdministrator")
            );
          }
        }
      });
    },
    toHref(item, pid) {
      let routeData = "";

      checkProcessDefaultPage({
        processName: item.URLNAME,
        instanceId: item.instanceId
      }).then(rt => {
        if (rt.status === "200") {
          if (rt.data.isDefaultPage === "Y") {
            routeData = this.$router.resolve({
              name: item.URLNAME + "Start",
              query: {
                name: item.NAME,
                processName: item.URLNAME,
                projectName: item.PROJECTNAME,
                defOrg: item.defOrg,
                dname: dname,
                pid: pid
              }
            });
          } else {
            routeData = this.$router.resolve({
              name: "processFormStart",
              query: {
                name: item.NAME,
                processName: item.URLNAME,
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
    // 选择岗位确认事件
    saveSuccess(data) {
      this.toHref(this.paramsData, data[0].id);
    }
  }
};
</script>

<style lang="scss" scoped>
.el-carousel {
  padding: 8px;
}
/deep/ .el-carousel__arrow--right {
  right: 0;
  color: #fff;
  background-color: #a8a8a8;
}

/deep/ .el-carousel__arrow--left {
  left: 0;
  color: #fff;
  background-color: #a8a8a8;
}

.container {
  height: 322px;
  box-sizing: border-box;

  .carousel-content {

    .item {
      height: 44px;
      margin: 10px;
      padding: 0 10px;
      background: #F4F5F9;
      border-radius: 4px;
      display: flex;
      align-items: center;

      .img {
        width: 32px;
        height: 32px;
        margin-right: 8px;
        img {
          width: 100%;
        }
      }

      .arrowRight {
        width: 16px;
        img {
          width: 100%;
          vertical-align: middle;
        }
      }

      .title {
        flex: 1;
        height: 40px;
        line-height: 40px;
        color: #151934;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .item:hover {
      cursor: pointer;
      background-color: #eeeeee;
    }
  }
}
</style>
