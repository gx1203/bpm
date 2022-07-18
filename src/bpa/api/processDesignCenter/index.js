import { fetch, fetch3 } from '@/bpa/utils'
var username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
export function getProcesslist (data) {
  return fetch({
    url: '/modellist/queryCopy',
    method: 'post',
    data
  })
}

// 控制tab title显示隐藏
export function controlField (data) {
  return fetch({
    url: '/dictionary/querySheet',
    method: 'post',
    data
  })
}

// 控制tab显示隐藏
export function tabField (data) {
  return fetch({
    url: '/dictionary/query',
    method: 'post',
    data
  })
}

// 查看流程文档
export function viewProcessDoc (data) {
  return fetch({
    url: '/importWord/word2pdfCopy',
    method: 'post',
    data
  })
}

// 下载流程文档
export function downloadProcessDoc (data) {
  return fetch({
    url: '/importWord/importCopy',
    method: 'post',
    data
  })
}

// 还原流程
export function restoreProcess (data) {
  return fetch({
    url: '/modellist/reverseVersionCopy/' + data,
    method: 'post'
  })
}

// 发布流程
export function publishbpmProcess (data) {
  return fetch({
    url: '/listhistory/saveBPMCopy',
    method: 'post',
    data
  })
}

// 直接发布流程
export function publishProcess (data) {
  return fetch({
    url: '/modellist/releaseCopy',
    method: 'post',
    data
  })
}

// 清空流程
export function clearprocess (data) {
  return fetch({
    url: '/modellist/cleanBpm/' + data,
    method: 'post'
  })
}

// 发布流程
export function processStarted (data) {
  return fetch3({
    url: '/bpm/process/manage/started',
    method: 'post',
    data
  })
}

// 直接作废流程
export function abolishProcess (data) {
  return fetch({
    url: '/modellist/deleteCopy',
    method: 'post',
    data
  })
}

// 作废审批发起流程
export function abolishProcess2 (data1, data2) {
  return fetch({
    url: '/modellist/updateCancellation/' + data1 + '/' + data2,
    method: 'GET'
  })
}

// 流程基本属性
export function processattrs (data) {
  return fetch({
    url: '/modellist/getCopy/' + data,
    method: 'post'
  })
}

// 流程基本属性上面的起点和终点的接口
export function processStartOrEnd (data) {
  return fetch({
    url: '/listhistory/getLastCopy/' + data,
    method: 'post'
  })
}

// 流程基本属性的保存
export function processSaveAttr (data) {
  return fetch({
    url: '/modellist/saveBpm2',
    method: 'post',
    data
  })
}

// 流程支持文件
export function getsupportFile (data) {
  return fetch({
    url: '/modellistdoc/query2',
    method: 'post',
    data
  })
}
// 流程支持文件保存
export function saveFile (data) {
  return fetch({
    url: '/modellistdoc/save2',
    method: 'post',
    data
  })
}
// 流程支持文件删除
export function delSupport (data) {
  return fetch({
    url: '/modellistdoc/deleteCopy/' + data,
    method: 'post'
  })
}

// 流程绩效
export function getprocessValue (data) {
  return fetch({
    url: '/modellist/queryKpi2',
    method: 'post',
    data
  })
}
// 保存流程绩效
export function saveTarget (data) {
  return fetch({
    url: '/modellist/saveKpi2',
    method: 'post',
    data,
    loading: false
  })
}
// 删除流程绩效
export function delTarget (data) {
  return fetch({
    url: '/modellist/deleteKpiCopy/' + data,
    method: 'post',
    loading: false
  })
}

// 关键风险控制点
export function getRisk (data) {
  return fetch({
    url: '/modellist/queryCorekey2',
    method: 'post',
    data
  })
}

// 制度-关键风险控制点
export function getRuleRisk (data) {
  return fetch({
    url: '/dmCorekey/page',
    method: 'post',
    data
  })
}

// 制度-关键风险控制点保存
export function dmCorekeySave (data) {
  return fetch({
    url: '/dmCorekey/save',
    method: 'post',
    data
  })
}
// 制度-关键风险控制点删除
export function dmDelete (id) {
  return fetch({
    url: `/dmCorekey/delete/${id}`,
    method: 'delete'
  })
}

// 关键成功要素
export function getSuccessElement (data) {
  return fetch({
    url: '/succelement/querySuccelement2',
    method: 'post',
    data
  })
}

// 制度-关键成功要素
export function getSucceRisk (data) {
  return fetch({
    url: '/dmSuccelement/page',
    method: 'post',
    data
  })
}

// 制度-关键成功要素保存
export function dmSuccelementSave (data) {
  return fetch({
    url: '/dmSuccelement/save',
    method: 'post',
    data
  })
}
// 制度-关键成功要素删除
export function dmSuccelement (id) {
  return fetch({
    url: `/dmSuccelement/delete/${id}`,
    method: 'delete'
  })
}

// 制度-权限执行表
export function getDmDeptJuridiction (data) {
  return fetch({
    url: '/dmDeptJuridiction/page',
    method: 'post',
    data
  })
}

// 制度-权限执行表保存
export function dmDeptJuridictionSave (data) {
  return fetch({
    url: '/dmDeptJuridiction/save',
    method: 'post',
    data
  })
}
// 制度-权限执行表删除
export function dmDeptJuridiction (id) {
  return fetch({
    url: `/dmDeptJuridiction/delete/${id}`,
    method: 'delete'
  })
}

// 业务规则
export function getRulelist (data) {
  return fetch({
    url: '/modellist/queryRule2',
    method: 'post',
    data
  })
}

export function saveRulefile (data) {
  return fetch({
    url: '/modellist/saveRule2',
    method: 'post',
    data
  })
}

// 删除业务规则
export function delRuleFile (data) {
  return fetch({
    url: '/modellist/deleteRuleCopy/' + data,
    method: 'post'
  })
}

// 流程活动说明
export function getProcessInfo (data) {
  return fetch({
    url: '/listhistory/getLastCopy/' + data,
    method: 'post'
  })
}

// 审批记录
export function getRecordlist (data) {
  return fetch({
    url: '/processDuration/selectByProcessCardCopy/' + data,
    method: 'get'
  })
}

// 朗基-审批记录
// export function getRecordlist2(data) {
//   return fetch3({
//     url: '/common/parameter/getApproveFqRecord/' + data,
//     method: 'GET'
//   })
// }
// 体系文件分类
export function getSystemList (data) {
  return fetch({
    url: '/systemClassify/querySystemClassify',
    method: 'post',
    data
  })
}

// 根据字典名称code获取字典值
export function getDictionaryOption(params) {
  return fetch({
    url: '/datadictionary/getDictionaryOption',
    method: 'GET',
    params
  })
}

// 流程导入
export function importProcessJson (code, data) {
  return fetch({
    url: '/modellist/importProcessJson/' + code + '/' + data,
    method: 'get'
  })
}

// 流程导出
export function exportProcessJsonToTxt (data) {
  return fetch({
    url: '/modellist/exportProcessJsonToTxt/' + data,
    method: 'get'
  })
}

// 流程图导入
export function importProcessChartJson (code, data) {
  return fetch({
    url: '/listhistory/importProcessChartJson/' + code + '/' + data,
    method: 'get'
  })
}

// 流程图导出
export function exportProcessChartJsonToTxt (data) {
  return fetch({
    url: '/listhistory/exportProcessChartJsonToTxt/' + data,
    method: 'get'
  })
}
// 判断是否显示修订内容里的添加功能
export function getModifyVersionsIsShowAdd (id, versions) {
  return fetch({
    url: `/reviseHistory/ifShowAdd/${id}/${versions}`,
    method: 'get'
  })
}

// 修订内容查询
export function getmodifyContent (data) {
  return fetch({
    url: '/reviseHistory/queryReviseHistory/' + data,
    method: 'get'
  })
}

// 修订内容保存
export function saveModifyContent (data) {
  return fetch({
    url: '/reviseHistory/save',
    method: 'post',
    data
  })
}

// 修订内容的删除
export function delContent (data) {
  return fetch({
    url: '/reviseHistory/delete/' + data,
    method: 'get'
  })
}

// 智能识别
export function chartIdentify (data) {
  return fetch({
    url: '/listhistory/importVsdJson/' + data.listid + '/' + data.id + '/' + data.style,
    method: 'Get',
    loading: true
  })
}

// word智能识别
export function wordIdentify (data) {
  return fetch({
    url: '/listhistory/importFlowChartFromWord/' + data.listid + '/' + data.id + '/' + data.style,
    method: 'Get',
    loading: true
  })
}

// word智能识别 y预览前先保存
export function wordSaveToModelFlowChart (data) {
  return fetch({
    url: '/listhistory/saveToModelFlowChart/' + data.id + '/' + data.style,
    method: 'Get',
    loading: true
  })
}

// 查询在线编辑内容
export function queryContent (data) {
  return fetch({
    url: '/modelInstitutionContent/queryByListid/' + data,
    method: 'GET'
  })
}

// 流程社区详情-查询在线编辑内容
export function queryContent2 (data1, data2) {
  return fetch({
    url: '/modelInstitutionContent/queryByListid/' + data1 + '/' + data2 + '/Y',
    method: 'GET'
  })
}

// 预览文件
export function PreviewFile (id) {
  return fetch({
    url: '/document/print/' + id,
    method: 'GET',
    loading: true
  })
}

// 流程图预览文件
export function FlowChartPreviewFile (listid) {
  return fetch({
    url: '/modelFlowChart/queryByListid/' + listid,
    method: 'GET',
    loading: true
  })
}

// 流程图预览文件保存
export function saveToModelHistory (flowChartId, isCover) {
  return fetch({
    url: '/modelFlowChart/saveToModelHistory/' + flowChartId + '/' + isCover,
    method: 'GET',
    loading: true
  })
}

// 评审审批发起流程
export function saveReview (data1, data2) {
  return fetch({
    url: '/modellist/ReviewTheApproval/' + data1 + '/' + data2,
    method: 'GET'
  })
}

// 评审直接审批
export function saveReview2 (data) {
  return fetch({
    url: '/modellist/hasAssessed/' + data,
    method: 'GET'
  })
}

// 获取岗位信息
export function jobsList (data) {
  return fetch({
    url: '/getPostInfo/getPostInfo/' + data,
    method: 'GET'
  })
}
// 获取流程公式
export function saveVckpiformula (data) {
  return fetch({
    url: '/vckpiformula/save?username=' + username,
    method: 'post',
    data
  })
}
// 获取流程公式
export function getBusinessValue () {
  return fetch({
    url: '/vckpiformula/queryField/bizfield',
    method: 'get',
    loading: false
  })
}
// 获取流程公式
export function getProcessValue () {
  return fetch({
    url: '/vckpiformula/queryField/flowfield',
    method: 'get',
    loading: false
  })
}

export function getListIdByModelId (id) {
  return fetch({
    url: `/modellistjson/getListIdByModelId/${id}`,
    method: 'GET',
    loading: false
  })
}

// 查询bo列表接口
export function queryBoModellist (data) {
  return fetch({
    url: `/modellistbo/queryBoUnique`,
    method: 'post',
    data
  })
}

// 查询tools列表接口
export function queryToolsModellist (data) {
  return fetch({
    url: `/modellisttools/queryTools`,
    method: 'post',
    data
  })
}

//
export function releaseVerification (listId) {
  return fetch({
    url: `/modellist/releaseVerification/${listId}`,
    method: 'get'
  })
}

//获取地区
export function getDistrictList () {
  return fetch({
    url: `/district/getDistrictList`,
    method: 'get'
  })
}

export function getModelapprove (id) {
  return fetch({
    url: `/modelapprove/get/${id}`,
    method: 'get'
  })
}

// 流程绩效gai
export function queryKpiInBase (data) {
  return fetch({
    url: '/modellist/queryKpiInBase',
    method: 'post',
    data
  })
}

// 流程绩效gai
export function queryAllKpiInChain (data) {
  return fetch({
    url: '/modellist/queryAllKpiInChain',
    method: 'post',
    data
  })
}

// 体系分类选择章节
export function querySectionBySystemId (systemId) {
  return fetch({
    url: '/systemChapterRelation/getTree/' + systemId,
    method: 'GET'
  })
}
// word解析
export function importFlowWord (data) {
  return fetch({
    url: `/listhistory/importFlowWord`,
    method: 'post',
    data
  })
}
export function importVsdJsonByUrl (data) {
  return fetch({
    url: `/listhistory/importVsdJsonByUrl`,
    method: 'post',
    data
  })
}
export function importWordSave (data) {
  return fetch({
    url: `/listhistory/importWordSave`,
    method: 'post',
    data
  })
}
export function queryProcessDesignListInfo (id, data) {
  return fetch({
    url: `/modellist/queryProcessDesignListInfo/${id}`,
    method: 'post',
    data
  })
}

export function vsdToJpgByImage (data) {
  return fetch({
    url: `/flow_detector/vsdToJpgByImage/`,
    method: 'post',
    data
  })
}

// 解析url的 接口 /listhistory/importVsdJsonByUrl
export function parseVisoFile (data) {
  return fetch({
    url: `/listhistory/parseVisoFile`,
    method: 'post',
    data
  })
}

// 查询流程版本
export function getProcessVersionList (data) {
  return fetch({
    url: '/listrelease/queryRelease',
    method: 'post',
    data
  })
}
