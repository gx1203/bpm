<template>
  <div class="processPerformance">
    <div class="w100 title pos-relative">
      <img src="@/bpa/assets/img/title.png" alt="">
      <h5>
        <text-gradient :title="processPerformance" :bold="'bold'" />
        <!-- <span class="cursor-pointer" @click="$router.push('/diCenter/databaseList')">{{ $t("indicatorsOfLibrary") }}</span> -->
      </h5>
      <!-- <el-button type="primary" icon="fa fa-reply" class="cursor-pointer" @click="back">
        {{ $t("return") }}
      </el-button> -->
      <el-dropdown class="submenu" trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          <i class="fa fa-bars" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="/processPerformance/processPerformance">
            {{ $t("procurementProcess") }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="w100 h100">
      <router-view :key="key" />
    </div>
  </div>
</template>

<script>
import textGradient from '@/bpa/components/textGradient.vue'
export default {
  components: {
    textGradient
  },
  data() {
    return {
      title: '流程绩效',
      processPerformance: this.$t('processPerformance')
    }
  },
  computed: {
    key() {
      return this.$route.fullPath
    }
  },
  mounted() {
  },
  methods: {
    handleCommand(data) {
      this.$router.push(data)
    },
    back() {
      // if (this.key === '/processPerformance/home') {
        this.$router.push('/doorCenter')
      // } else {
        // this.$router.push('/processPerformance/home')
      // }
    }
  }
}
</script>
<style lang="scss" scoped>
.processPerformance {
    width: 100%;
    min-height: 700px;
    height: 100vh;
    background: url('../../assets/img/bg.png') center center no-repeat;
    background-size: cover;
    overflow: hidden;
    .title {
        img {
            display: block;
            margin: 0 auto;
            height: 86px;
            width: 1188px;
        }
        h5 {
            display: inline-block;
            vertical-align: top;
            position: absolute;
            left: 0;
            right: 0;
            margin: auto;
            top: 8px;
            height: 45px;
            width: 368px;
            text-align: center;
            span {
                position: absolute;
                top: -2px;
                right: -42%;
                font-size: 27px;
                color: #107aa4;
                font-weight: normal;
                display: inline-block;
                vertical-align: top;
                width: 164px;
            }
        }
        .el-button {
            position: absolute;
            top: 28px;
            right: 18px;
            background-color: transparent;
            border-color: #294695;
            border-radius: 0;
            color: #37b2d5;
            padding: 12px;
            font-size: 14px;
            /deep/ i {
                margin-right: 9px;
            }
        }
        .submenu {
            position: absolute;
            top: 28px;
            left: 18px;
            .el-dropdown-link {
                padding: 4px 4px 2px;
                border: 1px solid #294695;
                display: inline-block;
                vertical-align: top;
                i {
                    color: #43dbff;
                    font-size: 32px;
                }
            }
        }
    }
}
</style>
