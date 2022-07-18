<template>
  <div id="onlineExam">
    <el-row style="width:100%;height:100%">
      <el-col :span="24" class="box" >
          <el-col v-for="item in roleList" :span="4"  :key="item.id" class="onlineExam-box">
            <el-row class="floating" style="">
              <el-col :span="5" :offset="19" class="floating-state">
                <div class="box-con" :style="item.done ===false ? 'background:#999': 'background:#ec7259' ">
                <span>{{ item.done === false ? $t('testSystem.notDone') : $t('testSystem.haveFinished') }}</span>
                </div>
               </el-col>
              <el-col :span="22" :offset="2" class="floating-testName">
                  <span :title="item.testName">
                    {{ item.testName }}
                  </span>
               </el-col>
              <el-col :span="22" :offset="2"  class="floating-No">{{$t('testSystem.total')}}：<span>{{ item.totalScore }}</span></el-col>
              <el-col :span="24"   class="floating-click">
                <el-button style="width:100%" type="primary" size="small"  @click="goQuestion(item)">{{$t('testSystem.ToDoTheTopic')}}</el-button>
              </el-col>
            </el-row>
          </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { queryMyAllTest } from '@/bpa/api/examination'
import { getFormateDate } from '@/bpa/utils/common'
export default {
  components: {
  },
  data() {
    return {
      roleList: [],
      questionObj: {
        questions: []
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 获取考试类型列表
    getList() {
      queryMyAllTest().then(res => {
        console.log(res)
        res.sort((a, b) => a.createTime - b.createTime).reverse()
        this.roleList = res.map(item => {
          item.createTime = getFormateDate(new Date(item.createTime), 'yyyy-MM-dd hh:mm:ss')
          return item
        })
      })
    },
    // 处理题的差异
    goQuestion(val) {
      // this.questionObj.times = val.times // 倒计时
      // this.questionObj.subjectId = val.subjectId
      this.questionObj.testId = val.testId
      // this.questionObj.testName = val.testName
      // this.questionObj.totalScore = val.totalScore
      // this.questionObj.questions = val.questions.map(item => {
      //   var subject = {
      //     questionContent: []
      //   }
      //   subject.id = item.id
      //   subject.type = item.type
      //   subject.singleScore = item.singleScore
      //   subject.questionTitle = item.questionTitle
      //   subject.subjectId = item.subjectId
      //   subject.answer = ''
      //   if (item.type === 2) {
      //     subject.answer = []
      //   }
      //   if (item.type !== 3) {
      //     console.log(item.questionContent,777)
      //     if (item.questionContent.indexOf('|') !== -1) {
      //       item.questionContent.split('|').map(items => {
      //         console.log(items, '1111')
      //         subject.questionContent.push({ name: items })
      //       })
      //     } else {
      //       subject.questionContent = item.questionContent
      //     }
      //   } else {
      //     subject.questionContent = ''
      //   }
      //   return subject
      // })
     const routes = this.$router.resolve({
        name: 'onlineExamInfo',
        query: { info: this.questionObj.testId }
      })
      window.open(routes.href, '_blank')
    }
  }
}
</script>
<style lang="scss" scoped>
#onlineExam {
  width: 100%;
  min-height: calc(100vh - 148px);
  .onlineExam-box{
    background-color: rgb(249, 249, 249);
    // height: 180px;
    margin-top:20px;
    margin: 20px 22px 0 22px;
    .floating-state{
        height: 44px;
        position: relative;
        overflow: hidden;
        font-size: 12px;
        color: #fff;
        .box-con{
          width: 60px;
          height: 60px;
          position: absolute;
          top: -30px;
          right: -30px;
          transform: rotate(45deg);
            span{
                position: absolute;
                bottom: 0;
                display: block;
                width: 60px;
                text-align: center;
                transform: rotate(-4deg);
           }
        }
     }
     .floating-testName{
       font-size: 14px;
       font-weight:bold;
       overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
     }
     .floating-No{
      padding-top: 20px;
      font-size: 14px;
      span{
      color: #ec7259;
      }
     }
     .floating-click{
       padding:20px;
     }
  }
}
</style>
