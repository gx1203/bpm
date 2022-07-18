<template>
  <div id="calendar">
    <ul class="calendar_head">
      <li>周日</li>
      <li>周一</li>
      <li>周二</li>
      <li>周三</li>
      <li>周四</li>
      <li>周五</li>
      <li>周六</li>
    </ul>
    <div class="calendar_body">
      <div :class="['day', item.status === 3 ? 'others' : '', item.status === 1 ? 'checkedToday' : ( item.status === 4 ? 'active' : '')]"
      v-for="(item,index) in daysList" :key="index">
        <span class="text" @click="handlerDateClick(item, index)">{{ item.day }}</span>
        <span :class="['slot', item.color === 'red' ? 'red' : '', item.color === 'green' ? 'green' : '', item.color === 'yellow' ? 'yellow' : '']"></span>
      </div>
    </div>
  </div>
</template>

<script>
import {getFormateDate} from '../utils/common'
import { getEventDays } from '@/bpa/api/doorCenter'
export default {
  name: 'Calendar',
  data () {
    return {
      daysList: [],
      eventList: []
    }
  },
  computed: {
    checkedDateFormat () {
      if (!this.checkedDate) {
        return ''
      }
      let checkdate = this.checkedDate.replace(/\s[\u4E00-\u9FA5]\s?/g, '/').split('/')
      return `${checkdate[0]}/${checkdate[1]}/${checkdate[2]}`
    }
  },
  props: {
    date: {
      type: Date,
      default: () => new Date()
    },
    checkedDate: {
      type: String,
      default: ''
    }
  },
  watch: {
    date: {
      handler (date) {
        date = getFormateDate(new Date(date), 'yyyy/MM') || ''
        this.getEventDays(date)
      },
      immediate: true
    }
  },
  mounted () {
    // this.init()
    // this.getEventDays()
  },
  methods: {
    getFormateDate,
    async handlerDateClick (item, idx) {
      if (item.status === 3) {
        return false
        let date = this.date
        let month = date.getMonth()
        if (item.day > 7) {
          date.setMonth(month - 1)
        } else {
          date.setMonth(month + 1)
        }
        let datalist = this.daysList
        datalist.forEach((item, index) => {
          if (item.date === this.getFormateDate(date, 'yyyy/MM/dd')) {
            // console.log(item.date)
            console.log(this.getFormateDate(date, 'yyyy/MM/dd'))
            this.$nextTick(() => {
              // console.log(index)
              this.$set(this.daysList, index, Object.assign({}, item, {
                status: 4
              }))
            })
            return false
          }
        })
      } else if (item.status === 1 || item.status === 2) {
        this.daysList = this.daysList.map((item, index) => {
          let currentYear = new Date().getFullYear()
          let currentMonth = new Date().getMonth() < 9 ? `0${new Date().getMonth() + 1}` : (new Date().getMonth() + 1)
          let currentDay = new Date().getDate() < 10 ? `0${new Date().getDate()}` : (new Date().getDate())
          if (index === idx) {
            item.status = 4
          } else if (item.date === `${currentYear}/${currentMonth}/${currentDay}`) {
            item.status = 1
          } else if (item.status != 3) {
            item.status = 2
          }
          return item
        })
      }
      let yearMonth = this.getFormateDate(this.date, 'yyyy-MM-')
      let day = item.day >= 10 ? item.day.toString() : '0' + item.day.toString()
      this.$emit('click', yearMonth + day)
    },
    // 获取某月展示的所有天数以及上月和下月部分天数
    getTheDaysOfMonth (date) {
      // 每执行一次此函数都要把之前的清理掉
      // console.log(date)
      date = new Date(date)
      this.daysList = []
      date = this.getFormateDate(date, 'yyyy/MM/dd')
      let fullYear = date.split('/')[0]
      let month = date.split('/')[1]
      let day = date.split('/')[2]
      let currentDate = new Date()
      let firstDayWeek = new Date(fullYear + '/' + month + '/01').getDay() // 获取这月第一天的星期
      let daysOfMonth = [31, this.isLeapYear(fullYear) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      let week = firstDayWeek
      // 动态添加当月的信息到this.daysList
      for (var i = 1; i < daysOfMonth[month - 1] + 1; i++) {
        let status = 2
        // 是否当天
        if (parseInt(day) === i && parseInt(month) === (currentDate.getMonth() + 1) && parseInt(fullYear) === currentDate.getFullYear()) {
          status = 4
        }
        this.daysList.push({
          date: `${fullYear}/${month}/${i < 10 ? ('0' + i) : i}`,
          day: i,
          // 星期：值为0~6
          week,
          // 日期的状态 1为当日，2为非当日，3为当月非当天，4为操作日
          status,
          color: ''
        })
        week++
      }
      // 添加这页属于上个月的最后几天
      let forwardDaysLen = firstDayWeek
      let nextDaysLen = 7 - this.daysList.length % 7 - firstDayWeek
      let forwardMonth = daysOfMonth[month - 1]
      if (nextDaysLen < 0) {
        nextDaysLen = 14 - this.daysList.length % 7 - firstDayWeek
      }
      for (let i = forwardMonth; i > forwardMonth - forwardDaysLen; i--) {
        this.daysList.unshift({
          date: `${parseInt(month) - 1 < 1 ? (parseInt(fullYear) - 1) : fullYear}/${parseInt(month) - 1 < 1 ? 12 : this.referMax(parseInt(month) - 1)}/${i < 10 ? ('0' + i) : i}`,
          day: i,
          week: '',
          status: 3
        })
      }
      for (let i = 1; i <= nextDaysLen; i++) {
        this.daysList.push({
          date: `${parseInt(month) + 1 > 12 ? (parseInt(fullYear) + 1) : fullYear}/${parseInt(month) + 1 > 12 ? '01' : this.referMax(parseInt(month) + 1)}/${i < 10 ? ('0' + i) : i}`,
          day: i,
          week: ++week,
          status: 3
        })
      }
      return new Promise((resolve, reject) => {
        resolve(this.daysList)
      })
    },
    // 判断是否为闰年
    isLeapYear (fullYear) {
      if (fullYear % 4 === 0 && (fullYear % 100 !== 0 || fullYear % 400 === 0)) {
        return true
      } else {
        return false
      }
    },
    getEventDays (date = getFormateDate(new Date(), 'yyyy/MM/dd')) {
      date = date.split('/')[0] + '-' + date.split('/')[1]
      getEventDays(date).then(res => {
        this.getTheDaysOfMonth(this.date).then(daylist => {
          this.daysList = daylist.map(item => {
            if ((item.status === 1 || item.status === 2) && res.indexOf(item.day.toString()) > -1) {
              item.color = 'red'
            }
            item.status = item.status === 3 ? item.status : 2
            if (item.date === this.checkedDateFormat) {
              item.status = 4
            }
            if (item.date === getFormateDate(new Date(), 'yyyy/MM/dd') && item.date !== this.checkedDateFormat) {
              item.status = 1
            }
            return item
          })
          this.$emit('click', getFormateDate(new Date(this.checkedDateFormat), 'yyyy-MM-dd'))
        })
      })
    },
    referMax (value) {
      return value > 9 ? value : `0${value}`
    }
  }
}
</script>

<style lang="scss" scoped>
#calendar {
  min-width: 500px;
  border-bottom: 1px solid #e6e6e6;
  .calendar_head {
    border-bottom: 1px solid #e6e6e6;
    padding: 20px 0;
    li {
      width: calc(100% / 7);
      text-align: center;
      line-height: 40px;
      font-size: 14px;
      float: left;
      color: #333333;
      -webkit-user-select:none;
      -moz-user-select:none;
      -ms-user-select:none;
      user-select:none;
    }
    &:after {
      content: '';
      display: block;
      clear: both;
    }
  }
  .calendar_body {
    padding: 20px 0;
    &:after {
      content: '';
      display: block;
      clear: both;
    }
    .day {
      width: calc(100% / 7);
      line-height: 54px;
      font-size: 14px;
      color: #333333;
      text-align: center;
      float: left;
      cursor: pointer;
      position: relative;
      .text {
        display: inline-block;
        width: 38px;
        height: 38px;
        line-height: 38px;
      }
      .slot {
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: transparent;
        position: absolute;
        left: 50%;
        margin-left: -3px;
        bottom: 0px;
        &.red {
          background-color: #ff3e18;
        }
        &.yellow {
          background-color: #e2ba24;
        }
        &.green {
          background-color: #1c98e6;
        }
      }
      &.others {
        color: #b3b3b3;
      }
      &.active {
        .text {
          background-color: #24a6ff;
          border-radius: 50%;
          color: #fff;
        }
      }
      &.checkedToday {
        .text{
          border-radius: 50%;
          color: #24a6ff;
          border: 1px solid #24a6ff;
        }
      }
    }
  }
}
</style>
