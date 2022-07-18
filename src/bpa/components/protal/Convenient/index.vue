<template>
  <div class="msg-convenient">
    <div class="msg-title">
      <span><i class="el-icon-menu" />&nbsp;便捷操作</span>
    </div>
    <el-row :gutter="5">
      <el-col v-for="(data,index) in datalist" :key="index" :span="data.type">
        <div class="hover" @click="godestination(data.name)">
          <i :class="data.style" class="icss" />
          <span>{{ data.name }}</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'Convenient',
  props: {},
  data() {
    return {
      datalist: [
        { name: '北京', type: 8, style: 'el-icon-upload' },
        { name: '上海', type: 8, style: 'el-icon-headset' },
        { name: '深圳', type: 8, style: 'el-icon-umbrella' },
        { name: '成都', type: 8, style: 'el-icon-coordinate' },
        { name: '九寨沟', type: 16, style: 'el-icon-magic-stick' },
        { name: '长沙', type: 8, style: 'el-icon-guide' },
        { name: '武汉', type: 8, style: 'el-icon-toilet-paper' },
        { name: '三亚', type: 8, style: 'el-icon-present' }
      ]
    }
  },
  methods: {
    // 便捷列表点击事件
    godestination(data) {
      this.$message({
        message: data,
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
.msg-convenient{
  width: 99%;
  font-size: 14px;
}
.msg-title{
  margin-bottom: 10px;
  border-bottom: 3px solid #e4e7ed;
}
.msg-title span{
  display: inline-block;
  height: 30px;
  line-height: 30px;
  position: relative;
  top: 3px;
  border-bottom: 3px solid #46A9D3;
}
.el-icon-menu{
  color: #46A9D3;
}
.icss{
  font-size: 50px;
  display: block;
}
.hover{
  min-width: 80px;
  min-height: 80px;
  color: #FFF;
  margin: 2px 0;
  padding: 5px 0;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  background-color: #46A9D3;
}
.hover:hover{
  box-shadow: 0 0 8px #888;
  text-shadow: 0 0 20px #fff;
  background-color: #FE6902;
}
</style>
