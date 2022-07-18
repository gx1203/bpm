import { fetch } from '@/bpa/utils'

// 添加科目
export function addSubject(data) {
  return fetch({
    url: '/exam/subject/addSubject',
    method: 'post',
    data
  })
}
// 提交试卷
export function answerTest(data) {
  return fetch({
    url: '/exam/answer/answerTest',
    method: 'post',
    data
  })
}
// 修改科目
export function changeSubjectInfo(data) {
  return fetch({
    url: '/exam/subject/changeSubjectInfo',
    method: 'post',
    data
  })
}
// 获取科目
export function querySubject(data) {
  return fetch({
    url: '/exam/subject/querySubject',
    method: 'post',
    data
  })
}
// 删除科目
export function delSubjectById(data) {
  return fetch({
    url: '/exam/subject/delSubjectById?ids=' + data,
    method: 'get'
  })
}
// 根据科目获取试题
export function queryQuestions(id, page, size) {
  return fetch({
    url: '/exam/question/queryQuestions/' + id + '/' + page + '/' + size,
    method: 'get'
  })
}
// 创建试卷
export function createTest(data) {
  return fetch({
    url: '/exam/test/createTest',
    method: 'post',
    data
  })
}

// 获取试卷列表
export function queryTestPapers(data) {
  return fetch({
    url: '/exam/test/queryTestPapers',
    method: 'post',
    data
  })
}
// 查找自己所有的试卷
export function queryMyAllTest() {
  return fetch({
    url: '/exam/answer/queryMyAllTest',
    method: 'get'
  })
}
// 试卷详细信息
export function queryTestDetails(data) {
  return fetch({
    url: '/exam/answer/queryTestDetails',
    method: 'post',
    data
  })
}
// 删除试卷
export function deleteTestPapers(data) {
  return fetch({
    url: '/exam/test/deleteTestPapers/' + data,
    method: 'get'
  })
}
// 查询考试成绩
export function queryScoreInfo(data) {
  return fetch({
    url: '/exam/test/queryScoreInfo',
    method: 'post',
    data
  })
}

// 获取考试题详情
// /exam/test/getTestPapersDetailsInfo/{id}
export function getTestPapersDetailsInfo(data) {
  return fetch({
    url: '/exam/test/getTestPapersDetailsInfo/' + data,
    method: 'get'
  })
}
// 修改试卷
export function editQuestions(data) {
  return fetch({
    url: '/exam/test/editTest',
    method: 'post',
    data
  })
}
