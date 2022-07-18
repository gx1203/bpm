
const printPage = [
  {
    path: '/printPage/topicOfProject',
    name: 'TopicOfProjectPrint',
    meta: { title: '投资立项审批表' },
    component: resolve => require(['../views/printPage/topicOfProject'], resolve)
  },
  {
    path: '/printPage/contractPaymentProcess',
    name: 'CtgContractPaymentProcessPrint',
    meta: { title: '合同支付打印' },
    component: resolve => require(['../views/printPage/contractPaymentProcess'], resolve)
  }
]

export default printPage
