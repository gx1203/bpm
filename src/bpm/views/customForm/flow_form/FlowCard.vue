<template>
  <div class="card" ref="card">
    <div v-if="data.tabname" class="header pos-relative">
      <span class="title">{{data.tabname}}</span>
      <div class="space"></div>
      <el-button type="text" class="collapse-btn" @click="expand = !expand">{{expand ? $t('putAway') : $t('unfold')}}</el-button>
      <el-button
        type="text"
        v-if="isLRShow"
        class="red delete-but"
        @click.stop="handleDelete(data)"
      >
        <i class="el-icon-delete" />
      </el-button>
    </div>
    <el-row class="form">
      <draggable
        v-model="data.nodeTableLists"
        :options="dragOptions2"
        style="display: flex;
    width: 100%;
    flex-wrap: wrap;
    min-height: 60px;"
      >
        <el-col
          v-for="(item, index) in data.nodeTableLists"
          :key="index"
          v-if="item.editstate !== 'H'"
          class="form-item pos-relative"
          @click.native.stop="formHandle(data,index)"
          :class="{'bg-outline':bgClick=== item.key}"
          v-show="item.inputType !== 'hidden'"
          :span="(item.inputType !== 'subtable' && item.inputType !== 'file' && item.inputType !== 'ckeditor') ? 24 / data.fieldcol * item.inputcolspan : 24"
        >
          <div
            v-if="item.inputType !== 'subtable' && item.inputType !== 'file' && item.fieldShowName"
            class="form-item-head"
          >
            <span v-if="item.isrequired === 'required'" style="color: red">*</span>
            <span>{{item.fieldShowName}}：</span>
          </div>
          <sub-table
            v-if="item.inputType === 'subtable'"
            :item="item"
            style="margin-bottom: 20px;"
            :bgClick="bgClick"
            @formHandle="formHandle($event,index)"
            @handleDelete="handleDelete"
            :bizData="bizData"
          />
          <file-list v-else-if="item.inputType === 'file'" :item="item" :bizData="bizData" />
          <div class="text-r" style="margin-right: 15px" v-else-if="item.inputType === 'button'">
            <el-button type="text">{{item.fieldShowName}}</el-button>
          </div>
          <div v-else class="form-item-value">
            <flow-item :item="item" :bizData2="bizData[item.fieldName]" />
          </div>
          <el-button
            type="text"
            v-if="isLRShow"
            class="red delete-but"
            @click.stop="handleDelete(item)"
          >
            <i class="el-icon-delete" />
          </el-button>
        </el-col>
      </draggable>
    </el-row>
  </div>
</template>

<script>
import SubTable from "./SubTable";
import FileList from "./FileList";
import FlowItem from "./FlowItem";
import FlowTabs1 from "./FlowTabs1";
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("app");
export default {
  name: "FlowCard",
  components: {
    SubTable,
    FileList,
    FlowItem,
    FlowTabs1
  },
  data() {
    return {
      expand: true,
      timer: null,
      tabsList: []
    };
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    bgClick: {
      type: [Number, String],
      default: -1
    }
  },
  computed: {
    ...mapGetters(["bizData", "errorsShow", "nodeDataObj"]),
    // 拖拽表单2
    dragOptions2() {
      return {
        animation: 0,
        ghostClass: "ghost",
        group: {
          // 只允许放置shared的控件,禁止pull
          put: ["shared"]
        }
      };
    },
    isLRShow() {
      return this.$store.state.custom.isLRShow;
    }
  },
  watch: {
    data: {
      handler(val) {
        this.tabsList = val.nodeTabLists.filter(item => {
          return item.istab === "1";
        });
      },
      immediate: true
    },
    expand(val) {
      this.slideToggle(val);
    }
  },
  methods: {
    handleDelete(item) {
      this.$emit("handleDelete", item);
    },
    handleTableDelete(item) {
      this.$emit("handleTableDelete", item);
    },
    formHandle(data, index) {
      this.$emit("formHandle", data, index);
    },
    slideToggle(show) {
      const parent = this.$refs["card"];
      if (show) {
        parent.style.overflow = "hidden";
        parent.style.height = 40 + parent.lastElementChild.offsetHeight + "px";
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          parent.style.overflow = "auto";
          parent.style.height = "auto";
        }, 500);
      } else {
        parent.style.overflow = "hidden";
        parent.style.height = 40 + parent.lastElementChild.offsetHeight + "px";
        setTimeout(() => {
          parent.style.overflow = "hidden";
          parent.style.height = "35px";
        }, 10);
      }
    }
  }
};
</script>

<style type="text/scss" lang="scss" scoped>
.card {
  padding: 0 0 15px 15px;
  background: white;
  border-bottom: 1px dotted $dc1;
  transition-duration: 0.5s;
  box-sizing: border-box;
  .red {
    color: red;
  }
  .delete-but {
    position: absolute;
    top: 5px;
    opacity: 0;
    right: 5px;
  }
  .pos-relative:hover .delete-but {
    opacity: 1;
  }
  .header {
    margin-right: 15px;
    display: flex;
    .delete-but {
      top: 5px;
      opacity: 0;
      right: 25px;
    }
    .title {
      height: 35px;
      line-height: 35px;
      color: $tc1;
      font-weight: bold;
    }
    .space {
      flex-grow: 1;
    }
    /*.collapse-btn {*/
    /*flex-grow: 1;*/
    /*text-align: right;*/
    /*}*/
  }
  .form {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 15px;
    .form-item {
      padding: 12px 2px;
      .form-item-head {
        min-width: 100px;
        padding-right: 10px;
        display: table-cell;
        vertical-align: middle;
        text-align: right;

        span {
          line-height: 28px;
        }
      }
      .form-item-value {
        width: 100%;
        display: table-cell;
        vertical-align: middle;
        padding-right: 15px;
        position: relative;
        .checkText {
          width: 90%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          position: absolute;
          bottom: -18px;
        }
      }
      .form-item-value.err {
        /deep/ .flow-item input.el-input__inner {
          border-bottom: 1px solid red;
        }
      }
    }
  }
}
</style>
