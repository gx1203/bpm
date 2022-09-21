<template>
  <div class="card" ref="card" :key="key">
    <div v-if="data.tabname" class="header">
      <span class="title">{{data.tabname}}</span>
      <div class="space" v-html="data.tips"></div>
      <el-button v-if="!isPrint" type="text" class="collapse-btn" @click="expand = !expand">
        <i :class="expand ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i> {{expand ? $t('putAway') : $t('unfold')}}</el-button>
    </div>
    <slot name="card" v-if="isMoreCard"></slot>
    <el-row class="form myFormStyle" v-if="!isMoreCard">
      <el-col v-for="(item, index) in data.nodeTableLists" :key="index" v-if="item.editstate !== 'H'" class="form-item"
        v-show="(item.inputType !== 'hidden' && !isSubTableDetail) || (item.inputType !== 'hidden' && isSubTableDetail && item.inputType !== 'subtable')"
        :span="(item.inputType !== 'subtable' && item.inputType !== 'file' && item.inputType !== 'project' && 
          item.inputType !== 'ckeditor') ? 24 / data.fieldcol * item.inputcolspan : 24">
        <div
          v-if="item.inputType !== 'subtable' && item.inputType !== 'file' && item.inputType !== 'project' && item.inputType !== 'button'  && item.fieldShowName"
          class="form-item-head">
          <span v-if="item.isrequired === 'required' && item.editstate === 'W'" style="color: red">*</span>
          <span>{{item.fieldShowName}}：</span>
        </div>
        <sub-table v-if="item.inputType === 'subtable'" :item="item" @externalFun="externalFun" :bizData="bizData"
          :is-print="isPrint" :is-no-start="isNoStart" @customBtnClick="customBtnClick"/>
        <file-list v-else-if="item.inputType === 'file'" :item="item" :bizData="bizData" :is-print="isPrint"
          :is-no-start="isNoStart" />
        <project v-else-if="item.inputType === 'project'" :item="item" :bizData="bizData" :is-print="isPrint" :is-no-start="isNoStart" />
        <div class="text-r" style="margin-right: 15px" v-else-if="item.inputType === 'button'">
          <el-button type="text" @click="item.eventtype ==='click' && externalFun(item.event)" :is-print="isPrint"
            :is-no-start="isNoStart">{{item.fieldShowName}}</el-button>
        </div>
        <!--:class="errorsShow && !item.applyvalue && item.isrequired === 'required' && !isPrint ? 'err' : ''"-->
        <div v-else class="form-item-value">
          <flow-item :item="item" :pItem="data.nodeTableLists" :is-print="isPrint" @externalFun="externalFun" />
          <p class="checkText"
            v-if="(errorsShow || subTableDetailsErrorShow) && item.editstate === 'W' && item.isrequired === 'required' && !isPrint && ((item.inputType === 'nokt' && !item.value) || (item.inputType !== 'nokt' && !item.applyvalue))"
            style="color: red" :title="item.fieldShowName + $t('hintText.canNotEmpty')">
            {{item.fieldShowName}}{{ $t('hintText.canNotEmpty') }}</p>
          <p class="checkText"
            v-else-if="(errorsShow || subTableDetailsErrorShow) && item.editstate === 'W' && !isPrint && (item.inputType === 'nokt' && String(item.showValue).length > item.length || item.inputType !== 'nokt' && String(item.applyvalue).length > item.length)"
            style="color: red" :title="item.fieldShowName+'不能超过'+item.length+'个字符'">
            {{item.fieldShowName}}不能超过{{item.length}}个字符</p>
        </div>
      </el-col>
      <span v-for="(item, index) in data.nodeTableLists" :key="index" v-if="item.editstate === 'H'" class="form-item"
        style="display:none">
        <file-list v-if="item.inputType === 'file'" :item="item" :bizData="bizData" />
        <sub-table v-else-if="item.inputType === 'subtable'" @externalFun="externalFun" :item="item" :bizData="bizData"
          :is-print="isPrint" :is-no-start="isNoStart" @customBtnClick="customBtnClick"/>
        <flow-item v-else-if="item.inputType!== 'subtable'" :pItem="data.nodeTableLists" :item="item"
          :is-print="isPrint" @externalFun="externalFun" />
      </span>
    </el-row>
    <div v-for="(item, index) in data.nodeTabLists" :key="index" v-if="!isMoreCard">
      <flow-tabs1 :data="tabsList" v-if="item.istab === '1'" :is-no-start="isNoStart" :is-print="isPrint" />
      <flow-card :data="item" v-if="item.istab === '0'" :is-no-start="isNoStart" :is-print="isPrint" />
    </div>
  </div>
</template>

<script>
import SubTable from "./SubTable";
import FileList from "./FileList";
import FlowItem from "./FlowItem";
import FlowTabs1 from "./FlowTabs1";
import Project from "./Project";
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("app");
export default {
  name: "FlowCard",
  components: {
    SubTable,
    FileList,
    FlowItem,
    FlowTabs1,
    Project
  },
  data () {
    return {
      key: 0,
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
    isPrint: {
      type: Boolean
    },
    isMoreCard: {
      type: Boolean,
      default: false
    },
    isNoStart: {
      type: Boolean,
      default: false
    },
    isSubTableDetail: {
      type: Boolean,
      default: false
    },
    subTableDetailsErrorShow: {
      type: Boolean,
      default: false
    },
    bizData2: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapGetters(["bizData", "errorsShow", "nodeDataObj"])
  },
  watch: {
    data: {
      handler (val) {
        // if(val){
        //   val.nodeTableLists.forEach((item)=>{
        //     this.shiftData(item,this.bizData)
        //   })
        // }
        if (val.nodeTabLists && val.nodeTabLists.length > 0) {
          this.tabsList = val.nodeTabLists.filter(item => {
            return item.istab === "1";
          });
        }
      },
      immediate: true
    },
    expand (val) {
      this.slideToggle(val);
    }
  },
  methods: {
    // index: 索引值
    // bizData : 本行数据
    // column 按钮属性
    customBtnClick(data){
      this.$emit("customBtnClick",data);
    },
    externalFun (type) {
      this.$emit("externalFun", type);
    },
    slideToggle (show) {
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
  border-bottom: 1px solid $dc1;
  transition-duration: 0.5s;
  box-sizing: border-box;
  .header {
    margin-right: 15px;
    display: flex;
    .title {
      height: 35px;
      line-height: 35px;
      color: $tc1;
      font-weight: bold;
    }
    .space {
      flex-grow: 1;
      padding: 10px 20px;
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
      margin-bottom: 24px;
      .form-item-head {
        min-width: 145px;
        padding-right: 15px;
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
