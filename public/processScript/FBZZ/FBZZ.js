//11.3 服务站基本信息变更流程
var _this
var node
var nodeTabLists
//测试页面加载完成
function readyP() {
  _this = arguments[0]
  node = arguments[1]
  nodeTabLists = node.nodeTabLists

  var bizData = node.bizData

  // 参数定义：
  // 0：key1
  // 1:key2
  // 3:key1所属下标
  // 4:key2所属下标
  // 5:在哪个表单结构中
  var keyObject = [
    ['O_CLZTXX','N_CLZTXX',1,2,2],
    ['O_WZHGZBH','N_WZHGZBH',3,4,2],
    ['O_DPHGZBH','N_DPHGZBH',5,6,2],
    ['O_CLZZQYMC','N_CLZZQYMC',7,8,2],
    ['O_CLMC','N_CLMC',9,10,2],
    ['O_CLPP','N_CLPP',11,12,2],
    ['O_ZZLLYXS','N_ZZLLYXS',13,14,2],
    ['O_EDZZL','N_EDZZL',15,16,2],
    ['O_EDZK','N_EDZK',17,18,2],
    ['O_JSSZCRS','N_JSSZCRS',19,20,2],
    ['O_BGCAZZDYXZZL','N_BGCAZZDYXZZL',21,22,2],
    ['O_ZGCS','N_ZGCS',23,24,2],
    ['O_CPSCDZ','N_CPSCDZ',25,26,2],
    ['O_CLSCDWMC','N_CLSCDWMC',27,28,2],
    ['O_CLXH','N_CLXH',29,30,2],
    ['O_DPXH','N_DPXH',31,32,2],
    ['O_DPID','N_DPID',33,34,2],
    ['O_CSYS','N_CSYS',35,36,2],
    ['O_CLSBDH','N_CLSBDH',37,38,2],
    ['O_FDJH','N_FDJH',39,40,2],
    ['O_FDJXH','N_FDJXH',41,42,2],
    ['O_RLZL','N_RLZL',43,44,2],
    ['O_PFBZ','N_PFBZ',45,46,2],
    ['O_PL','N_PL',47,48,2],
    ['O_GL','N_GL',49,50,2],
    ['O_YH','N_YH',51,52,2],
    ['O_WKC','N_WKC',53,54,2],
    ['O_WKK','N_WKK',55,56,2],
    ['O_WKG','N_WKG',57,58,2],
    ['O_HXNBC','N_HXNBC',59,60,2],
    ['O_HXNBK','N_HXNBK',61,62,2],
    ['O_HXNBG','N_HXNBG',63,64,2],
    ['O_QLJ','N_QLJ',65,66,2],
    ['O_HLJ','N_HLJ',67,68,2],
    ['O_LTS','N_LTS',69,70,2],
    ['O_LTGG','N_LTGG',71,72,2],
    ['O_GBTHPS','N_GBTHPS',73,74,2],
    ['O_ZJ','N_ZJ',75,76,2],
    ['O_ZH','N_ZH',77,78,2],
    ['O_ZS','N_ZS',79,80,2],
    ['O_ZXXS','N_ZXXS',81,82,2],
    ['O_ZZL','N_ZZL',83,84,2],
    ['O_ZBZL','N_ZBZL',85,86,2],
    ['O_ZQYZZL','N_ZQYZZL',87,88,2],
    ['O_CLZZRQ','N_CLZZRQ',89,90,2],
    ['O_BZ','N_BZ',91,92,2],
    ['O_ZXZS','N_ZXZS',93,94,2],
    ['O_CDDBZ','N_CDDBZ',95,96,2],
    ['O_QYBZ','N_QYBZ',97,98,2],
    ['O_CPH','N_CPH',99,100,2],
    ['O_PC','N_PC',101,102,2],
    ['O_GGSXRQ','N_GGSXRQ',103,104,2],
    ['O_HPFYY','N_HPFYY',105,106,2],
    ['O_BRAND','N_BRAND',107,108,2],
    ['O_PZXLH','N_PZXLH',109,110,2],
    ['O_FDJSCCJ','N_FDJSCCJ',111,112,2],
    ['O_ZWPS','N_ZWPS',113,114,2],
    ['O_CLLX','N_CLLX',115,116,2],
    ['O_MZMLNCXBJ','N_MZMLNCXBJ',117,118,2],
    ['O_VEHICLECODE','N_VEHICLECODE',119,120,2],
    ['O_VINCXBSHBG','N_VINCXBSHBG',121,122,2],
    ['O_SFSYCXNF','N_SFSYCXNF',123,124,2],
    ['O_ZYCMSBS','N_ZYCMSBS',125,126,2]
  ]

  if (JSON.stringify(bizData) != '{}') {
    keyObject.forEach((item, index) => {
      var thisRgb = '#6495ED'

      // 普通类型数据对比
      var key1 = bizData[item[0]]
      var key2 = bizData[item[1]]

      if (typeof key1 !== 'undefined' || typeof key2 !== 'undefined') {
        if (key1.value != key2.value) {
          var document1 = $(
            `.myFormStyleDiv .card:nth-child(${item[4]}) .myFormStyle .form-item:nth-child(${item[2]})`
          )
          var document2 = $(
            `.myFormStyleDiv .card:nth-child(${item[4]}) .myFormStyle .form-item:nth-child(${item[3]})`
          )

          document1.css('backgroundColor', thisRgb)
          document1.css('padding', '4px')
          document2.css('backgroundColor', thisRgb)
          document2.css('padding', '4px')
        }
      }
    })
  }
}

//rgb颜色随机
function rgb() {
  var r = Math.floor(Math.random() * 256)
  var g = Math.floor(Math.random() * 256)
  var b = Math.floor(Math.random() * 256)
  var rgb = 'rgb(' + r + ',' + g + ',' + b + ', 30%)'
  return rgb
}
