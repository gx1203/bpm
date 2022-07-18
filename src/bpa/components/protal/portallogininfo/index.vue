<template>
  <div>
    <el-card>
      <el-col :span="10">
        <div class="login-img">
          <img :src="logindata.imageUrl" alt />
        </div>
      </el-col>
      <el-col :span="14">
        <div class="login-title">
          <p>{{ logindata.name }}</p>
          <p
            ref="levelcolor"
            :class="{ 'color1': color.isA, 'color2': color.isB, 'color3': color.isC, 'color4': color.isD, 'color5': color.isE}"
          >{{ logindata.levelname }}</p>
        </div>
      </el-col>
      <div v-show="options.isneedhonor">
        <el-col :span="14" :offset="12">
          <p style="text-indent:10px">{{ logindata.levelscore }}/{{ logindata.levelscoretotal }}</p>
        </el-col>
        <el-col :span="16" :offset="9">
          <div class="login-prog clear-fix">
            <p>{{ logindata.level }}</p>
            <el-progress
              :percentage="percentage"
              :color="customColors"
              :show-text="options.showtext"
            />
          </div>
        </el-col>
      </div>
      <div v-show="!options.isneedhonor">
        <el-col :span="14" :offset="3">
          <p style="text-indent:10px">{{ logindata.levelscore }}/{{ logindata.levelscoretotal }}</p>
        </el-col>
        <el-col :span="24" :offset="1">
          <div class="login-prog clear-fix">
            <p>{{ logindata.level }}</p>
            <el-progress
              :percentage="percentage"
              :color="customColors"
              :show-text="options.showtext"
            />
          </div>
        </el-col>
      </div>
      <div style="clear:both" />
      <div v-show="options.isneedhonor" class="login-link">
        <p @click="gotohonorwall()">
          进入荣誉墙
          <i class="el-icon-arrow-right" />
        </p>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'PortalLogininfo',
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          disabled: false, // true 启用，false禁用
          showtext: true,
          isneedhonor:false,
          customColors: [
            { color: '#f56c6c', percentage: 20 },
            { color: '#e6a23c', percentage: 40 },
            { color: '#6f7ad3', percentage: 100 }
          ]
        }
      }
    },
    logindata: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      customColors: this.options.customColors
        ? this.options.customColors
        : [
            { color: '#f56c6c', percentage: 20 },
            { color: '#e6a23c', percentage: 40 },
            { color: '#5cb87a', percentage: 60 },
            { color: '#1989fa', percentage: 80 },
            { color: '#6f7ad3', percentage: 100 }
          ],
      percentage: 0,
      color: {
        isA: false,
        isB: false,
        isC: false,
        isD: false,
        isE: false
      }
    }
  },
  created() {},
  mounted() {
    if (this.logindata.levelcolor) {
      this.$refs['levelcolor'].style.color = this.logindata.levelcolor
    }
    console.log(this.logindata)
    this.percentage =
      (this.logindata.levelscore / this.logindata.levelscoretotal) * 100
    if (this.logindata.level.split('v')[1] < 3) {
      this.color.isA = true
    } else if (this.logindata.level.split('v')[1] < 5) {
      this.color.isB = true
    } else if (this.logindata.level.split('v')[1] < 7) {
      this.color.isC = true
    } else if (this.logindata.level.split('v')[1] < 9) {
      this.color.isD = true
    } else if (this.logindata.level.split('v')[1] >= 9) {
      this.color.isE = true
    }
  },
  updated() {},
  methods: {
    // 进入荣誉墙
    gotohonorwall() {
      this.$emit('tohonorwall','')
    }
  }
}
</script>

<style scoped>
/*清浮动*/
.clear-fix:after {
  content: '.';
  clear: both;
  display: block;
  height: 0;
  overflow: hidden;
  visibility: hidden;
}
.el-card {
  min-width: 100%;
  font-size: 12px !important;
}
.el-card p {
  margin: 0 !important;
}
.login-img {
  float: left;
  width: 100%;
  height: 100%;
  min-width: 60px;
  min-height: 60px;
  border-radius: 50%;
  overflow: hidden;
}
.login-img img {
  width: 100%;
  height: 100%;
}
.login-title {
  float: left;
  padding: 0 10px;
}
.login-title p {
  margin: 0 10px;
  line-height: 28px;
}
.login-title p:nth-child(2) {
  font-size: 14px;
}
.login-link {
  position: relative;
  top: -13px;
}
.login-link > p {
  color: #2db31e;
  cursor: pointer;
  line-height: 8px;
}
.login-prog > p {
  float: left;
  width: 14%;
}
.login-prog > .el-progress {
  float: left;
  /* margin-top: 3px; */
  width: 86%;
}
.login-prog > div > p {
  color: #a29999;
  line-height: 26px;
  text-indent: 7px;
}
.color1 {
  color: #f56c6c;
}
.color2 {
  color: #e6a23c;
}
.color3 {
  color: #1989fa;
}
.color4 {
  color: #6f7ad3;
}
.color5 {
  color: #f70606;
}
</style>
