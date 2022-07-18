<template>
  <div class="logout">
     <el-card class="logout-main">
        <el-row>
            <el-col :span="4" class="text-c logout-icon">
                <i class="iconfont icon-gou"></i>
            </el-col>
            <el-col class="logout-text" :span="20">
                <h3>注销成功</h3>
                <p>您已成功退出流程管理平台，谢谢使用！！</p>
                <p>请手动关闭整个浏览器（如果您打开多个页签，请保存其他页签正在处理的工作）。</p>
            </el-col>
        </el-row>
     </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
     
    };
  },
  methods: {
  
  }
};
</script>
<style lang="scss" scoped>
.logout{
    display: flex;
    justify-content: center;
    height: 100vh;
    .logout-main{
        margin-top: 200px;
        width: 680px;
        height: 150px;
        border-radius: 12px;
    }
    .logout-icon{
        .iconfont {
            font-size: 50px;
        }
        color: $bc4;
        margin-top: 20px;
    }
    .logout-text{
        h3{
          color: $bc4;
          font-size: 18px;
          height: 38px;
          line-height: 38px;
        }
        p{
            height: 24px;
            line-height: 24px;
            font-size: 14px;
            color: $tc1;
        }
    }

}
</style>
