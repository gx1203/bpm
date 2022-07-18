<template>
  <el-popover
  placement="bottom"
  width="400"
  trigger="click">
  <div class="colors_wrap">
    <div class="color" @click="setBgColors(item)" v-for="(item,index) in colors" :key="index" :style="'background:#'+item+';'"></div>
  </div>
  <el-button slot="reference">激活</el-button>
  </el-popover>
</template>

<script>
const colors = ['4ba2ef', '0f0', '00f']
export default {
  name: 'ThemeChange',
  data () {
    return {
      colors
    }
  },
  mounted () {
    this.setBgColors()
  },
  methods: {
    setBgColors (color) {
      color = color || this.colors[0]
      document.body.classList = []
      document.body.classList.add('custom-' + color)
    }
  }
}
</script>

<style lang="scss" scoped>
.colors_wrap {
  height: 50px;
  padding: 12px;
  .color {
    height: 30px;
    width: 50px;
    margin-right: 10px;
    float: left;
  }
}
</style>
