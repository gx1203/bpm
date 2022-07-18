<template>
  <div class="pad20 document w100">
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/processModelCenter/ruleContentCheck' }">制度内容查询</el-breadcrumb-item>
        <el-breadcrumb-item>制度详情页</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="tagContent margin-t15">
        <h5>标签内容：</h5>
        <p></p>
    </div>
    <div class="docontent">

    </div>
  </div>
</template>

<script>
export default {
  data () {
    return  {

    }
  },
  computed: {
    id () {
      console.log(this.$route.params.id)
      return this.$route.params.id
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}
.tagContent {
    line-height: 24px;
    font-size: 14px;
    color: #333;
    min-height: 24px;
    position: relative;
    padding-left: 75px;
    h5 {
        width: 70px;
        position: absolute;
        left: 0;
        top: 0;
        font-weight: normal;
    }
}
.docontent {
  height: calc(100vh - 214px);
  overflow: auto;
}
</style>
