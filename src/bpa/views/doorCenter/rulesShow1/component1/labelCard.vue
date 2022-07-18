<template>
  <div class="wrapaaa">
    <div class="label-qy">
      <div class="label-senced">
        <dg-page :list="getList" :color="labelColor"></dg-page>
      </div>
    </div>
  </div>
</template>
<script>
import DgPage from './dg.vue'
export default {
  components: { DgPage },
  props: {
    getLabData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    labelColor: {
      type: String,
      default: ''
    },
    carName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      getList: JSON.parse(JSON.stringify(this.getLabData))
    }
  },
  // 监听数据
  watch: {
    getLabData: {
      handler: function(val) {
        this.getList = val
        this.$set(this.getList, 'changeTime', Date.parse(new Date())) // 刷新数据
      },
      deep: true
    }
  },
  updated() {
    console.log(this.getList)
  },
  methods: {
    getListItem(data) {
      this.getList.show = !this.getList.show
    }
  }
}
</script>

<style scoped lang="scss">
.active {
  color: red;
}
.margins {
  margin-top: 30px;
}
.el-wrap-flex {
  display: flex;
  justify-content: flex-start;
}
.flex {
  display: flex;
  justify-content: flex-start;
}
.wrapaaa {
  .label-qy {
    display: flex;
    justify-content: flex-start;
    .label-senced > div:first-child {
      margin-top: 0 !important;
    }
  }
}

/* 超出后隐藏，显示.... */
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.img-width {
  width: 30px;
  height: 15px;
}

/* 点击的节点 */
.node {
  display: block;
  border-radius: 50%;
  border: 1px solid #40a9ff;
  color: #40a9ff;
  cursor: pointer;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
}

.node-items {
  display: flex;
  justify-content: flex-start;
  margin-left: 5px;

  img {
    padding-top: 4px;
  }
}
</style>
