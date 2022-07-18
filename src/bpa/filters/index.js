import { getFormateDate } from '../utils/common'
const filters = [
  /*
    数字千分位
   */
  {
    name: 'number',
    filter(value) {
      let res = value.toString().replace(/\d+/, n => {
        // 先提取整数部分
        return n.replace(/(\d)(?=(\d{3})+$)/g, $1 => {
          return `${$1},`
        })
      })
      return res
    }
  },
  // 时间戳转成yyyy-MM-dd hh:mm:ss形式
  {
    name: 'formateDate',
    filter(value) {
      return !value
        ? ''
        : getFormateDate(new Date(value), 'yyyy-MM-dd hh:mm:ss')
    }
  },
  // 时间戳转成yyyy-MM-dd形式
  {
    name: 'forDate',
    filter(value) {
      return !value ? '' : getFormateDate(new Date(value), 'yyyy-MM-dd')
    }
  },
  // 审批状态
  {
    name: 'filterType',
    filter(value) {
      switch (value) {
        case '1':
          return '新建审批中'
        case '2':
          // return '新建审批通过'
          return '新增'
        case '3':
          return '新建审批失败'
        case '4':
          return '修改审批中'
        case '5':
          // return '修改审批通过'
          return '修改'
        case '6':
          return '修改审批失败'
        case '7':
          return '作废审批中'
        case '8':
          return '作废审批通过'
        case '9':
          return '作废审批失败'
      }
    }
  },
  // 规章制度中心的状态
  {
    name: 'regState',
    filter(value) {
      switch (value) {
        case '1':
          return '新建'
        case '2':
          return '审批中'
        case '3':
          return '已发布'
        case '4':
          return '修改中'
        case '5':
          return '已作废'
        case '6':
          return '发布审批已退回'
        case '7':
          return '已征集'
        case '8':
          return '作废审批中'
        case '9':
          return '征集意见中'
        case '10':
          return '已征求意见'
        case '11':
          return '征求意见已退回'
        case '12':
          return '发布审批中'
        case '13':
          return '作废审批已退回'
        case '14':
          return '修订中'
      }
    }
  },
  // 流程设计器的状态
  {
    name: 'designState',
    filter(value) {
      switch (value) {
        case '1':
          return '已发布'
        case '2':
          return '新建'
        case '3':
          return '作废'
        case '4':
          return '锁定'
        case '5':
          return '修改中'
        case '6':
          return '发布审批中'
        case '7':
          return '发布已拒绝'
        case '8':
          return '作废审批中'
        case '10':
          return '修订中'
        case 'Y':
          return '启用'
        case 'N':
          return '禁用'
      }
    }
  }
]

export default function(Vue) {
  filters.forEach(filter => {
    Vue.filter(filter.name, filter.filter)
  })
}
