<template>
  <el-card id="mobileLoginEchart" shadow="never">
    <el-form :model="searchForm" ref="searchForm" label-width="120px" size="mini">
      <el-row>
        <el-col :span="4">
          <el-form-item :label="$t('checkTheYear') + '：'">
               <el-date-picker
      v-model="searchForm.year"
      type="year"
      :placeholder="$t('placeholderText.selectYear')">
    </el-date-picker>
            <!-- <el-select clearable v-model="searchForm.year" class="w100" :placeholder="$t('placeholderText.pleaseSelect')">
              <el-option
                v-for="item in yearList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select> -->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="tool-common-wrap">
      <div class="btn-wrap">
        <el-button type="primary" @click="refreshData">
           {{ $t('refresh') }}
          <!---->
        </el-button>
      </div>
    </div>
    <div>
      <echar class="echar-line" :option="option" />
    </div>
  </el-card>
</template>
<script>
import echar from "@/bpm/components/echarts/echarts";
export default {
  components: {
    echar
  },
  data() {
    return {
      searchForm: {
        year: new Date()
      },
      option: {}
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.basuser.user;
    }
  },
  mounted () {
      this.initEchar()
  },
  methods: {
    refreshData() {},
    initEchar() {
      this.option = {
        color: ["#2FC25B", "#1890FF", "#004C96"],
        backgroundColor: "#fff",
        tooltip: {
          trigger: "axis"
        },
        grid: {
          left: "50",
          right: "50"
        },
        legend: {
          data: ["2018"]
        },
        toolbox: {
          show: true
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            boundaryGap: true,
            data: [
                '1月',
                '2月',
                '3月',
                '4月',
                '5月',
                '6月',
                '7月',
                '8月',
                '9月',
                '10月',
                '11月',
                '12月'
            ],
            axisLine: {
              lineStyle: {
                color: "#E9E9E9"
              }
            },
            axisLabel: {
              color: "rgba(0,0,0,0.65)"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "登录次数",
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: "rgba(0,0,0,0.65)"
            },
            splitLine: {
              lineStyle: {
                type: "dashed",
                color: "#E9E9E9"
              }
            }
          }
        ],
        series: [
          {
            name: "2018",
            type: "line",
            smooth: false,
            barMaxWidth: "50px",
            data: [10, 12, 21, 54]
          }
        ]
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#mobileLoginEchart {
  .echar-line {
    width: 100%;
    height: 50vh;
  }
}
</style>

