<template>
  <el-dialog
    width="90%"
    :title="title"
    :visible.sync="picdialogVisible"
    class="box"
    ref="box"
  >
    <!-- :render-content="renderContent" -->
    <div
      ref="scroll_div"
      style="width: 100%; overflow-x: auto; text-align: center"
    >
      <vue2-org-tree
        :data="data"
        id="dialog"
        :props="props"
        :horizontal="false"
        @on-expand="onExpand"
        collapsable
        :render-content="renderContent"
        class="tree"
      />
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="Suk_exportimg" type="primary">{{
        $t("export")
      }}</el-button>
      <el-button @click="cancel">{{ $t("close1") }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { queryPath } from "@/bpm/api/configManage/institutionalFramework/organization";
import html2canvas from "html2canvas";
export default {
  components: {},
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    headdata: {
      type: Object,
      default: () => {
        return {};
      },
    },
    title: {
      type: String,
      default: "",
    },
    groupid: { type: String, default: "" },
    groupdata: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      labelClassName: "bg-blue",
      data: {},
      props: { label: "name", children: "subNodes", expand: "expand" },
      picdialogVisible: this.value,
    };
  },
  watch: {
    value(val) {
      this.picdialogVisible = val;
      if (val) {
        this.queryPath();
      }
    },
    picdialogVisible(val) {
      this.$emit("input", val);
    },
  },

  methods: {
    Suk_exportimg() {
      window.pageYoffset = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      this.$refs.scroll_div.scrollLeft = this.$refs.scroll_div.scrollWidth;
      setTimeout(() => {
        html2canvas(document.getElementById("dialog"), {}).then((canvas) => {
          const a = document.createElement("a");
          a.href = canvas.toDataURL("image/png");
          a.download = this.data.name;
          a.click();
        });
      }, 0);
    },
    renderContent(h, data) {
      return (
        <span>
          {data.name}
          <span
            style={
              data.type == "top"
                ? "display:inline-block;border-left:1px solid #fff;position: absolute;width: 100px;background: #409eff;height: 42px;top: 0;line-height: 42px;margin-left: 13px;"
                : ""
            }
          >
            {data.type == "top" ? new Date().getFullYear() : ""}
          </span>
        </span>
      );
    },
    toggleExpand(data) {
      var _this = this;
      if (Array.isArray(data)) {
        data.forEach(function (item) {
          _this.$set(item, "expand", true);
          if (item.subNodes) {
            _this.toggleExpand(item.subNodes, true);
          }
        });
      } else {
        this.$set(data, "expand", true);
        if (data.subNodes) {
          _this.toggleExpand(data.subNodes, true);
        }
      }
    },
    collapse(list) {
      var _this = this;
      list.forEach(function (child) {
        if (child.expand) {
          child.expand = false;
        }
        child.children && _this.collapse(child.children);
      });
    },
    onExpand(e, data) {
      if ("expand" in data) {
        data.expand = !data.expand;
        if (!data.expand && data.children) {
          this.collapse(data.children);
        }
      } else {
        this.$set(data, "expand", true);
      }
    },
    queryPath() {
      queryPath(this.groupid).then((res) => {
        let obj = {
          name: this.headdata.name + "架构图",
          time: this.headdata.createon,
          type: "top",
          subNodes: res.data,
        };
        this.data = obj;
        this.labelClassName = "bg-blue";
        this.toggleExpand(this.data);
      });
    },
    cancel() {
      this.picdialogVisible = false;
    },
  },
};
</script>

<style lang="scss">
.box {
  .el-dialog__body {
    // display: flex;
    // justify-content: center;
    // align-items: center;
  }
}
.org-tree-node-label {
  color: #fff;
  background-color: #409eff;
}
.bg-blue {
}
.classgw {
  display: inline-block;
  width: 15px;
  margin: 0 auto;
  word-wrap: break-word; /*英文的时候需要加上这句，自动换行*/
  word-break: break-all;
}
.classnorm {
  display: inline-block;
  white-space: nowrap;
}
</style>