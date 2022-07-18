<template>
  <div class="msg-conten">
    <div v-if="options.isShow=='1'" class="block">
      <el-rate v-model="value1" :colors="colors" show-text />
      <el-button class="buts" type="primary" size="mini" @click="submit">提交</el-button>
    </div>
    <div v-if="options.isShow=='2'" class="msg-score">
      <el-rate v-model="options.value" disabled text-color="#ff9900" size="small" score-template="{value}" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'PortalScore',
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          value: 0, // 评分 1-5分
          isShow: '1' // 状态 1 显示可操作评分 状态 2 显示不可操作评分
        }
      }
    }
  },
  data() {
    return {
      value1: 0,
      isShow: true,
      colors: ['#99A9BF', '#F7BA2A', '#FF9900']
    }
  },
  mounted() {
    // this.fun()
  },
  methods: {
    submit() {
      this.options.value = this.value1
      console.log('评分：', this.value1)
      this.$message({
        message: '恭喜你，这是一条成功消息',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
* {
  font-size: 14px;
}
.msg-conten {
  width: 350px;
}
.msg-score {
  margin: 10px 0;
}
.demonstration {
  float: left;
}
.buts {
  float: right;
  margin-top: 5px;
}
</style>
