const onlineExamRoutes = [
  {
    path: '/onlineExam',
    meta: { title: 'onlineExam', isNav: true },
    redirect: '/onlineExam/onlineExam',
    component: resolve => require(['../../views/layout2'], resolve),
    children: [
      {
        name: 'onlineExam',
        path: '/onlineExam/onlineExam', // 在线考试
        meta: { title: 'onlineExam', isNav: true },
        component: resolve => require(['../../views/exam/index.vue'], resolve)
      },
      { // 考试系统试卷
        name: 'TestPaper',
        path: '/onlineExam/examinationTestPaper',
        meta: { title: 'examinationTestPaper', isNav: true },
        component: resolve => require(['../../views/exam/testPaper/index.vue'], resolve)
      },
      { // 考试系统试题
        name: 'TestQuestions',
        path: '/onlineExam/examinationTestQuestions',
        meta: { title: 'examinationTestQuestions', isNav: true },
        component: resolve => require(['../../views/exam/testQuestions/index.vue'], resolve)
      },
      { // 考试系统考试记录
        name: 'Record',
        path: '/onlineExam/examinationRecord',
        meta: { title: 'examinationRecord', isNav: true },
        component: resolve => require(['../../views/exam/examinationRecord/index.vue'], resolve)
      }
    ]
  }, {
    name: 'onlineExamInfo',
    path: '/onlineExamInfo', // 在线考试
    meta: { title: 'onlineExamInfo', isNav: false },
    component: resolve => require(['../../views/exam/onlineExamInfo'], resolve)
  }
]
export default onlineExamRoutes
