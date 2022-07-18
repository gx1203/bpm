<template>
  <div class="full-calendar">
    <FullCalendar
      ref="fullCalendar"
      :header="{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      }"
      :button-text="buttonText"
      :plugins="calendarPlugins"
      :weekends="calendarWeekends"
      :events="calendarEvents"
      :event-limit="true"
      class="demo-app-calendar"
      default-view="dayGridMonth"
      locale="zh-cn"
      event-limit-text="更多"
      @dateClick="handleDateClick"
      @eventClick="handleEventClick"
    />
    <!-- 新建日程 -->
    <el-dialog
      :visible.sync="dialogVisible"
      title="新建日程"
      width="665px">
      <el-form ref="formRuleRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="日程主题：" prop="title">
          <el-input clearable v-model="form.title"/>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间：" prop="start">
              <el-date-picker clearable
                v-model="form.start"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间：" prop="end">
              <el-date-picker clearable
                v-model="form.end"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="日程详情：" prop="content">
          <el-input clearable :rows="4" v-model="form.content" type="textarea"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeForm">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="newSche">{{$t("confirm")}}</el-button>
        <!--<el-button type="primary" @click="testClick1">测试1</el-button>-->
        <!--<el-button type="primary" @click="testClick2">测试2</el-button>-->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
export default {
  name: 'Calendar',
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data() {
    return {
      buttonText: {
        today: '今天',
        month: '月',
        week: '周',
        day: '天',
        list: '列表'
      },
      calendarPlugins: [ // plugins must be defined in the JS
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin // needed for dateClick
      ],
      calendarWeekends: true,
      calendarEvents: [ // initial event data
        // { title: '例子', start: '2019-09-09', end: '2019-09-10', data: { title: '宿舍水电费', start: '2019-09-09', end: '2019-09-10', content: '我说的方式发生的' }}
      ],
      // test1: [
      //   { title: '例子', start: '2019-09-09', end: '2019-09-10', data: { title: '宿舍水电费', start: '2019-09-09', end: '2019-09-10', content: '我说的方式发生的' }}
      // ],
      // test2: [
      //   { title: '例子2', start: '2019-09-12', end: '2019-09-15', data: { title: '大富大贵', start: '2019-09-12', end: '2019-09-15', content: '打滚' }}
      // ],
      form: {
        title: '',
        start: '',
        end: '',
        content: ''
      },
      rules: {
        content: [{ required: true, message: ' ', trigger: 'blur' }],
        // end: [{ type: 'date', required: true, message: ' ', trigger: 'change' }],
        // start: [{ type: 'date', required: true, message: ' ', trigger: 'change' }],
        title: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      dialogVisible: false
    }
  },
  methods: {
    // getCalendarEvents(info, successCallback, failureCallback) {
    //   console.log('1111', info)
    //   const events = [
    //     ...this.calendarEvents,
    //     {
    //       title: info.startStr,
    //       start: info.start.valueOf()
    //     }
    //   ]
    //   successCallback(events)
    // },
    // testClick1() {
    //   this.calendarEvents = this.test1
    // },
    // testClick2() {
    //   this.calendarEvents = this.test2
    // },
    toggleWeekends() {
      this.calendarWeekends = !this.calendarWeekends // update a property
    },
    gotoPast() {
      const calendarApi = this.$refs.fullCalendar.getApi() // from the ref="..."
      calendarApi.gotoDate('2019-08-01') // call a method on the Calendar object
    },
    handleDateClick(arg) {
      console.log({ arg })
      this.dialogVisible = true
      for (const key in this.form) {
        this.form[key] = ''
      }
    },
    closeForm() {
      this.dialogVisible = false
      this.$refs.formRuleRef.resetFields()
    },
    handleEventClick(info) {
      console.log(info)
      console.log('events:', this.calendarEvents)
      this.dialogVisible = true
      // alert('Event: ' + info.event.title)
    },
    newSche() {
      console.log('form:', this.form)
      const PARAMS = JSON.parse(JSON.stringify(this.form))
      this.calendarEvents.push({
        title: PARAMS.title,
        start: PARAMS.start,
        end: PARAMS.end,
        data: PARAMS
      })
      console.log('events:', this.calendarEvents)
      this.$message({
        type: 'success',
        message: '新建日程成功！'
      })
      this.dialogVisible = false
      // this.$refs.formRuleRef.resetFields()
    }
  }
}
</script>

<style lang='scss'>
@import './main.css';
@import './day.css';
@import './time.css';
.full-calendar {
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
  .el-date-editor.el-input{
    width: 100%;
  }
  .demo-app-calendar {
    margin: 0 auto;
    max-width: 900px;
  }
}
</style>

