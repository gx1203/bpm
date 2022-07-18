<template>
  <div class="blank-container">
    <header>
      <h2>产品数据项目状态汇报</h2>
    </header>
    <main>
      <template v-for="item in items">
        <line-item :key="item.id" :item="item" />
      </template>
    </main>
  </div>
</template>

<script>
import LineItem from './components/line-item.vue'
export default {
  components: {
    LineItem
  },
  data() {
    return {
      items: [
        {
          id: 1,
          title: 'EWO',
          categories: [
            {
              name: '审批EWO',
              count: 4,
              unit: '个'
            },
            {
              name: '变更零件',
              count: 5,
              unit: '条'
            }
          ]
        },
        {
          id: 2,
          title: 'TWO',
          categories: [
            {
              name: '新增TWO',
              count: 6,
              unit: '个'
            },
            {
              name: '关闭TWO',
              count: 2,
              unit: '个'
            },
            {
              name: '在运行TWO',
              count: 7,
              unit: '个'
            }
          ]
        },
        {
          id: 3,
          title: 'Math',
          categories: [
            {
              name: '发布数量',
              count: 5,
              unit: '个'
            },
            {
              name: '总数量',
              count: 10,
              unit: '个'
            },
            {
              name: '按时发布率',
              count: 5,
              unit: '个'
            }
          ]
        },
        {
          id: 4,
          title: 'CRDN-VWO-EWO',
          categories: [
            {
              name: '新增CRDN',
              count: 3,
              unit: '个'
            },
            {
              name: '发布VWO',
              count: 6,
              unit: '个'
            },
            {
              name: '相关EWO',
              count: 5,
              unit: '个'
            }
          ]
        },
        {
          id: 5,
          title: 'CAB',
          categories: [
            {
              name: '项目个数',
              count: 3,
              unit: '个'
            },
            {
              name: '新增EWO',
              count: 6,
              unit: '个'
            },
            {
              name: '通过EWO',
              count: 5,
              unit: '个'
            },
            {
              name: 'HOLD EWO',
              count: 5,
              unit: '个'
            }
          ]
        },
        {
          id: 6,
          title: 'GD&T',
          categories: [
            {
              name: '发布数量',
              count: 8,
              unit: '个'
            },
            {
              name: '总数量',
              count: 12,
              unit: '个'
            },
            {
              name: '按时发布率',
              count: 5,
              unit: '个'
            }
          ]
        },
        {
          id: 7,
          title: 'MPL Auidt',
          categories: [
            {
              name: '在跟踪项目',
              count: 4,
              unit: '个'
            },
            {
              name: '关闭条目',
              count: 3,
              unit: '条'
            },
            {
              name: 'OPEN条目',
              count: 8,
              unit: '条'
            }
          ]
        },
        {
          id: 8,
          title: 'IVVB',
          categories: [
            {
              name: '在跟踪项目',
              count: 3,
              unit: '个'
            },
            {
              name: '发现问题数量',
              count: 5,
              unit: '条'
            },
            {
              name: '问题关闭',
              count: 2,
              unit: '个'
            }
          ]
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.blank-container {
  color: #ccc;
  width: 100vw;
  height: 100vh;
  header {
    width: 100%;
    height: 64px;
    background-color: #222b45;
    display: flex;
    align-items: center;
    justify-content: center;
    h2 {
      font-size: 24px;
    }
  }
  main {
    width: 100vw;
    padding: 15px 25px;
    box-sizing: border-box;
    height: calc(100vh - 64px);
    background-color: #151a30;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
