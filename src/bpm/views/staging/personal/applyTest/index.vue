<template>
  <div>
     <div class="short_Shrink">
      <transition name="el-fade-in-linear">
        <div class="transition-box">
          <el-button
            type="primary"
            :title="shortShow?$t('frame'):$t('classify')"
            icon="iconfont icon-web-icon-"
            circle
            @click="shortShow = !shortShow"
          ></el-button>
        </div>
      </transition>
    </div>
    <category v-if="shortShow"></category>
    <frame v-else/>
  </div>
</template>
<script>
import category from "./category";
import frame from "./frame";
export default {
  data() {
    return {
      shortShow: true
    };
  },
  components: {
    category,
    frame
  },
  methods: {},
  mounted() {},
  destroyed() {}
};
</script>
<style type="text/scss" lang="scss">
  $fixedTop: 188px;
  $fixedRight: 18px;
  $bgColor: $bc4;
 .short_Shrink {
    position: fixed;
    // top: $fixedTop;
    right: $fixedRight;
    cursor: pointer;
    z-index: 10000;
    .el-button {
      padding: 10px;
      background-color: $bgColor;
      border-color: $bgColor;
      i {
        font-size: 16px;
      }
    }
  }
</style>
