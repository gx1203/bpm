<template>
  <div class="selectMonth">
    <el-popover
      v-model="isMonthShow"
      placement="bottom"
      width="360"
      trigger="click">
      <div ref="monthFocus" class="month">
        <el-row>
          <el-col :span="5" class="monthSeaaon">
            <div v-for="(item,index) in season" :key="index">
              <p :class="isActiveShow == index+13?'isActive':''" class="seaonItem" @click="getSeason(item)">{{ item.label }}</p>
            </div>
          </el-col>
          <el-col :span="19">
            <div class="monthMonth">
              <div
                v-for="(item,index) in month"
                :key="index"
                :class="isActiveShow == index+1?'isActive':''"
                class="monthItem"
                @click="getSeason(item)"
              >{{ item.label }}</div>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-input clearable
        slot="reference"
        v-model="monthValue"
        size="mini "
        placeholder="选择月"
        clearable
      />
    </el-popover>
  </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
var season = [
  { label: '一季度', value: '13' },
  {
    label: '二季度',
    value: '14'
  },
  {
    label: '三季度',
    value: '15'
  },
  {
    label: '四季度',
    value: '16'
  },
  {
    label: '上半年',
    value: '17'
  },
  {
    label: '下半年',
    value: '18'
  },
  {
    label: '全年',
    value: '19'
  }
]
var month = [
  {
    label: '1月',
    value: '1'
  },
  {
    label: '2月',
    value: '2'
  },
  {
    label: '3月',
    value: '3'
  },
  {
    label: '4月',
    value: '4'
  },
  {
    label: '5月',
    value: '5'
  },
  {
    label: '6月',
    value: '6'
  },
  {
    label: '7月',
    value: '7'
  },
  {
    label: '8月',
    value: '8'
  },
  {
    label: '9月',
    value: '9'
  },
  {
    label: '10月',
    value: '10'
  },
  {
    label: '11月',
    value: '11'
  },
  {
    label: '12月',
    value: '12'
  }
]
const screenStart = createNamespacedHelpers('screenStart')
export default {
  name: 'SelectMonth',
  // props: {
  //   monthValue: {
  //     type: String,
  //     default: ''
  //   }
  // },
  data() {
    return {
      season,
      month,
      isActiveShow: 0,
      isMonthShow: false,
      monthValue: '',
      monthData: ''
    }
  },
  computed: {
    route() {
      return this.$route.fullPath
    },
    ...screenStart.mapState(['Process'])
  },
  mounted() {
    console.log(localStorage.getItem('monthValue'), typeof (localStorage.getItem('monthValue')), 6666)
    if (localStorage.getItem('monthValue') !== null) {
      this.monthValue = localStorage.getItem('monthValue') + '月'
      this.monthData = localStorage.getItem('monthValue')
      this.$emit('getSeason', this.monthData)
    } else {
      this.getLastMonth()
    }
  },
  methods: {
    getLastMonth() {
      var myDate = new Date()
      var month = myDate.getMonth()
      if (month === 0) {
        month = 12
      }
      this.monthValue = month + '月'
      this.monthData = month
      this.isActiveShow = this.monthData
      this.$emit('getSeason', this.monthData)
    },
    getSeason(item) {
      this.monthValue = item.label
      this.monthData = item.value
      this.isMonthShow = false
      this.isActiveShow = this.monthData
      this.$emit('getSeason', this.monthData)
    }
  }
}
</script>
<style scoped lang="scss">
.monthInput {
  position: relative;
}
.focusClass {
  display: block;
}
.month {
  font-size: 12px;
  color: grey;
  .monthMonth {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    text-align: center;
    justify-content: space-around;
    .monthItem {
      width: 25%;
      cursor: pointer;
      line-height: 86px;
      box-sizing: border-box;
    }
    :hover{
        color: blue;
      }
  }
  .monthSeaaon{
      height: 272px;
      border-right: 1px solid lightgrey;
      line-height: 38px;
      .seaonItem{
          cursor: pointer;
      }
      :hover{
        color: blue;
      }
  }
  .isActive{
    color: blue;
  }
}
.el-input{
  width: 200px;
}

</style>
