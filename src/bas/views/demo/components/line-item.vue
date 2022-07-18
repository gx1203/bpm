<template>
  <div class="line-item">
    <el-card>
      <header class="line-item-header">
        <h3>{{ item.title }}</h3>
      </header>
      <main class="line-item-main">
        <div class="line-item-left">
          <template v-for="category in item.categories">
            <div :key="category.name" class="category">
              <span class="name">{{ category.name }}</span>
              <span>&nbsp;:&nbsp;</span>
              <span class="count">{{ category.count }}</span>
              <span>&nbsp;</span>
              <span class="unit">{{ category.unit }}</span>
            </div>
          </template>
        </div>
        <div ref="lineItem" class="line-item-right" />
      </main>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  mounted() {
    const lineItemChart = echarts.init(this.$refs.lineItem)
    const option = {
      title: {
        text: '近6个月状态分布',
        textStyle: {
          color: '#ccc',
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Series1', 'Series2', 'Series3'],
        bottom: 2,
        textStyle: {
          color: '#ccc'
        }
      },
      grid: {
        top: '20%',
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1月', '2月', '3月', '4月', '5月', '6月'],
        axisLine: {
          lineStyle: {
            color: '#ccc'
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#ccc'
          }
        }
      },
      series: [
        {
          name: 'Series1',
          type: 'line',
          stack: 'Total',
          data: [20, 22, 101, 134, 90, 230]
        },
        {
          name: 'Series2',
          type: 'line',
          stack: 'Total',
          data: [150, 232, 201, 154, 190, 330]
        },
        {
          name: 'Series3',
          type: 'line',
          stack: 'Total',
          data: [320, 332, 301, 334, 390, 330]
        }
      ]
    }
    lineItemChart.setOption(option)
  }
}
</script>

<style lang="scss" scoped>
.line-item {
  color: #fff;
  width: 32%;
  height: 30%;
  background-color: #222b45;
  .el-card {
    color: #fff;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    background-color: #222b45;
    ::v-deep .el-card__body {
      height: 100%;
      width: 100%;
      // background-color: skyblue;
      box-sizing: border-box;
      padding: 0;
    }
    .line-item-header {
      height: 40px;
      // background-color: pink;
      color: #ccc;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
    }
    .line-item-main {
      height: calc(100% - 40px);
      display: flex;
      // background-color: orange;
      .line-item-left {
        width: 35%;
        // background-color: greenyellow;
        font-size: 16px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        .category {
          .name {
            color: #409eff;
          }
          .count {
            color: #eb5174;
          }
          .unit {
            color: #ccc;
          }
        }
      }
      .line-item-right {
        flex: 1;
        // background-color: #fff;
      }
    }
  }
}
</style>
