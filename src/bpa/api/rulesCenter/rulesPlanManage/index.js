
import { fetch } from '@/bpa/utils'
var username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
// 获取评估报告list
export function getReportList (data) {
    return fetch({
      url: '/assessmentReport/page?username=' + username,
      method: 'post',
      data
    })
  }
// 制度流程上报
export function updateStatus (data) {
  return fetch({
    url: `/assessmentReport/updateStatus`,
    method: 'post',
    data
  })
}
// 计划制定 汇总上报
export function updateStatusPlan (data) {
  return fetch({
    url: `/institution/updateStatus`,
    method: 'post',
    data
  })
}

  // 重新发起流程
export function restart (data) {
    return fetch({
      url: '/assessmentReport/restart',
      method: 'post',
      data
    })
  }
  
  // 上报选岗位
  export function updateSelect (id) {
    return fetch({
      url: `/getPostInfo/getPostInfo/${id}`,
      method: 'GET'
    })
  }
  
  // 获取体系分类
  export function getSystem (data) {
    return fetch({
      url: '/systemClassify/querySystemClassify',
      method: 'post',
      data
    })
  }

  export function getReportQueryAllAssessmentList (data) {
    return fetch({
      url: '/assessmentReport/queryAllAssessment?username=' + username,
      method: 'post',
      data
    })
  }
  
  export function getIds (data) {
    return fetch({
      url: '/modellistannotation/getId?username=' + username,
      method: 'post',
      data
    })
  }
  
  // 获取
  
  // 获取评估报告list
  export function getReportQueryAllList (data) {
    return fetch({
      url: '/assessmentReport/queryAll?username=' + username,
      method: 'post',
      data
    })
  }
  
  // 获取保存评估报告
  export function saveReport (data) {
    return fetch({
      url: '/assessmentReport/save',
      method: 'post',
      data
    })
  }
  
  export function deleteReport (id) {
    return fetch({
      url: `/assessmentReport/delete/${id}`,
      method: 'delete'
    })
  }
  export function getDetails (id) {
    return fetch({
      url: '/assessmentReport/get/' + id,
      method: 'get'
    })
  }

// 获取计划制定list
export function getPlanTrackingList (data) {
  return fetch({
    url: '/planTracking/query?username=' + username,
    method: 'post',
    data
  })
}

export function queryForTk (data) {
  return fetch({
    url: '/planTracking/queryForTk?username=' + username,
    method: 'post',
    data
  })
}

// 导出
export function exportPlan (data) {
  return fetch({
    url: '/planTracking/exportPlan?username=' + username,
    method: 'post',
    responseType: 'blob',
    data
  })
}
// 修编计划
export function savePlanTracking (data) {
  return fetch({
    url: '/planTracking/report',
    method: 'post',
    data
  })
}

export function planTracking (id) {
  return fetch({
    url: `/planTracking/urge//${id}`,
    method: 'get'
  })
}

export function getDetailss (id) {
  return fetch({
    url: '/institution/get/' + id,
    method: 'get'
  })
}
// 上报
export function updateStatusTracking (id) {
  return fetch({
    url: `/institution/updateStatus/${id}`,
    method: 'GET'
  })
}

//计划汇总模块
// 获取计划制定list
export function getInstitutionList (data) {
  return fetch({
    url: '/institution/query?username=' + username,
    method: 'post',
    data
  })
}

// 判断是否有报告
export function isHzById (ids) {
  return fetch({
    url: '/institution/isHzById/' + ids + '?username=' + username,
    method: 'get'
  })
}

export function getDetailByModelIds (data) {
  return fetch({
    url: '/institution/getDetailByModelIds?username=' + username,
    method: 'post',
    data
  })
}

// 判断是否有报告
export function getDetailByids (ids) {
  return fetch({
    url: '/institution/getDetailByids/' + ids + '?username=' + username,
    method: 'get'
  })
}
// 计划制定 判断是否有报告
export function getPlanDetailByids (ids) {
  return fetch({
    url: '/assessmentReport/getDetailByids/' + ids + '?username=' + username,
    method: 'get'
  })
}
// export function getInstitutionQueryAllPlanList (data) {
//   return fetch({
//     url: '/institution/queryAllPlan?username=' + username,
//     method: 'post',
//     data
//   })
// }

export function getInstitutionQueryAllPlanList (data) {
  return fetch({
    url: '/institution/queryAllPlan?username=' + username,
    method: 'post',
    data
  })
}

export function restartProcess (data) {
  return fetch({
    url: '/institution/restartProcess?username=' + username,
    method: 'post',
    data
  })
}

// 获取计划制定list
export function getInstitutionQueryForHZList (data) {
  return fetch({
    url: '/institution/queryForHZ?username=' + username,
    method: 'post',
    data
  })
}

// 获取保存计划制定
export function saveInstitution (data) {
  return fetch({
    url: '/institution/save',
    method: 'post',
    data
  })
}

export function deleteInstitution (id) {
  return fetch({
    url: `/institution/delete/${id}`,
    method: 'delete'
  })
}
