<template>
  <el-card shadow="never" class="process-design">
    <el-card shadow="never">
      <el-row>
        <el-col :span="8">
          <el-form ref="item" label-width="120px" class="content">
            <el-form-item :label="$t('processName2')" prop="system">
              <el-select
                filterable
                clearable
                v-model="processId"
                :placeholder="$t('placeholderText.pleaseEnterProcessNameSearch')"
                style="width:100%;"
              >
                <el-option
                  v-for="item in processList"
                  :key="item.processId"
                  :label="item.processNamecn"
                  :value="item.processId"
                >
                  <span style="float: left">{{ item.processNamecn }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <div class="process-design">
      <el-row class="design-row" v-if="isAjaxShow">
        <div class="long-background"></div>
        <el-col :span="4" v-if="!isBpa">
          <div class="design-item">
            <img
              @click="clickHandle('流程设计')"
              src="../../../../assets/img/processDesign/processDesign.png"
              alt
            />
            <div class="design-circle">
              <div class="circle-all">
                <span class="circle-word">1</span>
                <span class="circle-title">流程设计</span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="4" v-if="!isBpa">
          <router-link
            :to="{name: 'modelList',query:{processNamecn:checkProcessData.processNamecn }}"
            class="design-item"
          >
            <img
              @click="clickHandle('流程发布')"
              src="../../../../assets/img/processDesign/issue.png"
              alt
            />
            <div class="design-circle">
              <div class="circle-all">
                <span class="circle-word">2</span>
                <span class="circle-title">流程发布</span>
              </div>
            </div>
          </router-link>
        </el-col>
        <el-col :span="4" v-if="!isBpa">
          <div class="design-item">
            <!-- <router-link :to="{name: 'Classification'}" class="design-item"> -->
            <img
              @click="clickHandle('模型分类')"
              src="../../../../assets/img/processDesign/classiModel.png"
              alt
            />
            <div class="design-circle">
              <div class="circle-all">
                <span class="circle-word">3</span>
                <span class="circle-title">模型分类</span>
              </div>
            </div>
          </div>
          <!-- </router-link> -->
        </el-col>
        <el-col :span="isBpa?8:4">
          <div class="design-item">
            <!-- <router-link :to="{name: 'configurationFlow'}" class="design-item"> -->
            <img
              @click="clickHandle('表单配置')"
              src="../../../../assets/img/processDesign/proceduralModel.png"
              alt
            />
            <div class="design-circle">
              <div class="circle-all">
                <span class="circle-word">{{isBpa?'1':'4'}}</span>
                <span class="circle-title">表单配置</span>
              </div>
            </div>
          </div>
          <!-- </router-link> -->
        </el-col>
        <el-col :span="isBpa?6:4" :offset="isBpa?2:0">
          <div class="design-item">
            <!-- <router-link :to="{name: 'ruleManagement'}" class="design-item"> -->
            <img
              @click="clickHandle('业务规则')"
              src="../../../../assets/img/processDesign/rule.png"
              alt
            />
            <div class="design-circle">
              <div class="circle-all">
                <span class="circle-word">{{isBpa?'2':'5'}}</span>
                <span class="circle-title">业务规则</span>
              </div>
            </div>
          </div>
          <!-- </!-->
        </el-col>
        <el-col :span="4" :offset="isBpa?4:0">
          <div class="design-item">
            <img
              @click="clickHandle('发起权限')"
              src="../../../../assets/img/processDesign/permissions.png"
              alt
            />
            <div class="design-circle">
              <div class="circle-all">
                <span class="circle-word">{{isBpa?'3':'6'}}</span>
                <span class="circle-title">发起权限</span>
              </div>
            </div>
          </div>

          <!-- </router-link> -->
        </el-col>
      </el-row>
    </div>
    <process-guide-dialog title="选择权限" @confirm="checkHandle" v-model="dialogVisible"></process-guide-dialog>
  </el-card>
</template>

<script>
import { getAllocatedProcess } from "@/bpm/api/process/processBasic/process_design";
import processGuideDialog from "./processGuideDialog";
import { getProcessImgType } from "@/bpm/api/app";
export default {
  name: "processDesign",
  components: {
    processGuideDialog
  },
  data() {
    return {
      processId: "",
      isBpa: false,
      isAjaxShow: false,
      checkProcessData: {},
      dialogVisible: false,
      checkProdessData: {},
      processList: []
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData: function() {
      this.isAjaxShow = false
      getAllocatedProcess()
        .then(rt => {
          if (rt.status === "200") {
            this.processList = rt.data;
            return getProcessImgType();
          }
        })
        .then(rt => {
          this.isBpa = rt.data === "bpa";
          this.isAjaxShow = true
        })
        .catch(() => {
        });
    },
    clickHandle: function(typeName) {
      this.processList.forEach(item => {
        if (item.processId === this.processId) {
          this.checkProcessData = item;
        }
      });
      if (typeName === "模型分类") {
        this.$router.push({
          name: "Classification",
          query: {
            pid: this.checkProcessData.pid
          }
        });
      } else if (typeName === "流程设计") {
        this.processDesign();
      } else if (typeName === "表单配置") {
        this.$router.push({
          name: "configurationFlow",
          query: {
            pid: this.checkProcessData.modelId
          }
        });
      } else if (typeName === "控制条件") {
        this.$router.push({
          name: "ruleManagement",
          query: {
            pid: this.checkProcessData.modelId
          }
        });
      } else if (typeName === "业务规则") {
        if (!this.processId) {
          this.$router.push({ name: "ruleManagement" });
        } else {
          let routeData = this.$router.resolve({
            name: "confinBusinessRule",
            query: { processId: this.checkProcessData.processId, type: "edit" }
          });
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
      } else if (typeName === "发起权限") {
        this.$router.push({
          name: "processJobsPermissions",
          query: {
            pid: this.checkProcessData.modelId,
            type: "1"
          }
        });
      }
    },
    processDesign() {
      let href =
        ".." + localStorage.getItem("baseURL") + "/modeler.html?modelId=-1";
      // if(this.checkProcessData.modelId){
      //   href =  ".." + localStorage.getItem("baseURL") + "/modeler.html?modelId="+this.checkProcessData.modelId
      // }
      let a = document.createElement("a");
      // 给创建好的a标签赋值
      a.setAttribute("href", href);
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
    checkHandle(id) {
      if (id === "1") {
        this.$router.push({
          name: "processJobsPermissions",
          query: {
            pid: this.checkProcessData.modelId,
            type: "1"
          }
        });
      } else if (id === "2") {
        this.$router.push({
          name: "roleProcessPermissions",
          query: {
            pid: this.checkProcessData.modelId
          }
        });
      } else if (id === "3") {
        this.$router.push({
          name: "processRolePermissions",
          query: {
            pid: this.checkProcessData.modelId,
            type: "1"
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.process-design {
  min-height: 360px;
  overflow: hidden;
  .design-row {
    position: relative;
    top: 100px;
    left: 30px;
    .long-background {
      background-color: rgba(199, 232, 255, 0.8);
      position: absolute;
      left: 12px;
      top: 30px;
      z-index: 1;
      height: 18px;
      width: 88%;
    }
    .el-col {
      .design-item {
        position: relative;
        z-index: 5;
        img {
          padding-left: 10px;
          cursor: pointer;
        }
        .design-circle {
          /*width: 100%;*/
          min-width: 100px;
          /*height: 100%;*/
          min-height: 30px;
          background: url(../../../../assets/img/processDesign/circle.png)
            no-repeat;
          background-size: 100% 100%;
          position: absolute;
          .circle-all {
            position: relative;
            left: 9px;
            top: 5px;
            font-weight: 600;
            .circle-word {
              color: #ffffff;
              font-size: 18px;
            }
            .circle-title {
              padding-left: 10px;
            }
          }
        }
      }
    }
  }
}
</style>
