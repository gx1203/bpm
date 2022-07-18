//
/*
_this指向vue实例，可调用其相关方法
obj为触发input事件传递过来的相关参数
_this.$store.commit('app/setBizData',{})
*/
//存储类型list
var grantee = []
let _data = {}
let _pono = ''
let payee = [] //收款单位
let node = {} //全部的表单
let payDetailList = [] //全部的支付明细
let payType = '' //支付类型
let _projectParams = {} //选中的项目
let contractList = [] //合同list
let dataowner = [] //dataowner list

//初始化数据
function initData() {
  let _this = arguments[0]
  _this.$store.commit('app/setBizData', {
    "CONTRAACTNAME": {
      showValue: '',
      value: ''
    },
    "SEARCHDATA": { //清空搜索条件
      showValue: '',
      value: ''
    },
    "CONTRACTOR": {
      showValue: '',
      value: ''
    },
    "PARTYUNIT": { //乙方单位
      showValue: '',
      value: ''
    },
    "RECEIVINGUNIT": {
      showValue: '',
      value: ''
    },
    "PAYINGBANK": {
      showValue: '',
      value: ''
    },
    "BANKACCOUNT": {
      showValue: '',
      value: ''
    },
    "CONTRACTTOTAL": {
      showValue: '',
      value: ''
    },
    "PAYINGADDRESS": {
      showValue: '',
      value: ''
    },
    "FINALMONEY": {
      showValue: '',
      value: ''
    },
    "AMOUNTPAID": {
      showValue: '',
      value: ''
    },
    "TPAYMENTMONEYS": {
      showValue: '',
      value: '',
    },
    "SURPLUSMONEY": {
      showValue: '',
      value: '',
    },
    "TPAYMENTMONEYB": {
      showValue: '',
      value: ''
    },
    "CHILDTYPE": {
      showValue: '进度款支付单',
      value: '进度款支付单'
    },
    "BANKACCOUNT": {
      showValue: '',
      value: ''
    },

    "OTHERDEDUCTIONS": {
      showValue: '',
      value: ''
    },
    "ADVANCEMONEY": {
      showValue: '',
      value: ''
    },
    "WITHHOLDINGTAX": {
      showValue: '',
      value: ''
    },
    "RESERVEMONEY": {
      showValue: '',
      value: ''
    },
    "VATINPUTTAX": {
      showValue: '',
      value: ''
    },
    "PREPAYMENT": {
      showValue: '',
      value: ''
    },
    "PAYMENTRETENTIONMONEY": {
      showValue: '',
      value: ''
    },

    "PAYMENTNO": {
      showValue: '',
      value: ''
    },
    "DETAIL": {
      showValue: '',
      value: ''
    },
    "PAYINGBANK": {
      showValue: '',
      value: ''
    },
    "ACTUALMONETS": {
      showValue: '',
      value: ''
    },
    "ACTUALMONETSB": {
      showValue: '',
      value: ''
    }
  })
}
//获取项目名称
function getProject() {
  let _this = arguments[0]
  let dataHandle = arguments[1]
  if (JSON.stringify(node.bizData) === "{}") {
    initData(_this)
  }
  const loading = _this.$loading();
  myAjax({
    url: '/bpm/empaccount/getSystemProject',
    method: 'GET',
  }).then(function (rt) {
    loading.close();
    if (rt.status === '200') {
      grantee = rt.data
      dataHandle.forEach(function (item) {
        if (item.fieldName === 'PROJECTNAME') {
          item.nodeoptions = grantee.map(function (item) {
            return {
              text: item.system,
              value: item.system
            }
          })
          if (!item.applyvalue) {
            item.applyvalue = item.nodeoptions[0].value
            _this.$store.commit('app/setTemporaryBizData', {
              'PROJECTNAME': {
                showValue: item.nodeoptions[0].value,
                value: item.nodeoptions[0].value,
              }
            })
          }
        }
      })
      getDataOwner(_this, dataHandle)
    }
  })
}

//获取dataowner
function getDataOwner() {
  let _this = arguments[0]
  let dataHandle = arguments[1]
  let _bizData = _this.$store.state.app.temporaryBizData
  if (!_bizData.PROJECTNAME || !_bizData.PROJECTNAME.value) return;
  _projectParams = grantee.find(function (item) {
    return item.system = _bizData.PROJECTNAME.value
  })
  const loading = _this.$loading();
  myAjax({
    url: '/contractPayment/getDataOwnerByUserName',
    method: 'POST',
    data:_projectParams
  }).then(function (rt) {
    loading.close();
    if (rt.status === '200') {
      if(rt.data){
        dataowner = JSON.parse(rt.data)
        dataHandle.forEach(function (item) {
          if (item.fieldName === 'DATAOWNERNAME') {
            item.nodeoptions = dataowner.map(function (item) {
              return {
                text: item.DATA_OWNER+'-'+item.DESCRIPTION+'-'+item.FLAG,
                value: item.DATA_OWNER+'-'+item.DESCRIPTION+'-'+item.FLAG,
              }
            })
            if (!item.applyvalue) {
              item.applyvalue = item.nodeoptions[0].value
            }
            _this.$store.commit('app/setTemporaryBizData', {
              'DATAOWNER': {
                showValue:item.applyvalue.split('-')[0],
                value: item.applyvalue.split('-')[0],
              }
            })
            setTimeout(function(){
              _this.$store.commit('app/setBizData', {
                'DATAOWNER': {
                  showValue:item.applyvalue.split('-')[0],
                  value: item.applyvalue.split('-')[0],
                }
              })
            },0)
            myAjax({
              url: '/contractPayment/updateDateOwner'+'/'+_projectParams.username+'/'+ item.applyvalue.split('-')[0] +'/'+_projectParams.system,
              method: 'POST'
            })
          }
        })
        if (JSON.stringify(node.bizData) === "{}") {
          setTimeout(function(){
            _this.$store.commit('app/setBizData', {
              "CONTRACTCODE": {
                showValue: '',
                value: ''
              },
              "PAYMENTDETAIL": []
            })
          },0)
        }
        getContract(_this, dataHandle)
      } else {
        _this.$message.error('当前用户不存在数据拥有者！！')
        return
      }
    }
  })
}
//获取合同编号
function getContract() {
  let _this = arguments[0]
  let dataHandle = arguments[1]
  let _bizData = _this.$store.state.app.temporaryBizData
  if (!_bizData.PROJECTNAME || !_bizData.PROJECTNAME.value) return;
  project = _bizData.PROJECTNAME.value
  _this.$store.commit('app/setBizData', {
    'PROJECTCODE': {
      showValue: _bizData.PROJECTNAME.value,
      value: _bizData.PROJECTNAME.value,
    }
  })
  _projectParams = grantee.find(function (item) {
    return item.system = _bizData.PROJECTNAME.value
  })
  const loading = _this.$loading();
  myAjax({
    url: '/contractPayment/getContractDetail',
    method: 'POST',
    data: {
      system:_projectParams.system,
      username:_projectParams.username,
      dataowner:_bizData.DATAOWNER.value
    }
  }).then(function (rt) {
    loading.close();
    if (rt.status === '200') {
      contractList = JSON.parse(rt.data)
      if (contractList) {
        dataHandle.forEach(function (item) {
          if (item.fieldName === 'CONTRACTCODE') {
            item.nodeoptions = contractList.map(function (item) {
              return {
                text: item.po_no,
                value: item.po_no
              }
            })
          }
        })
      } else {
        dataHandle.forEach(function (item) {
          if (item.fieldName === 'CONTRACTCODE') {
            item.nodeoptions = []
          }
        })
      }
      if (JSON.stringify(node.bizData) === "{}") {
        initData(_this)
      } else {
        getContractInfo(_this, dataHandle)
      }
    }
  })
}
//获取支付
function getContractInfo() {
  let _this = arguments[0]
  let _bizData = _this.$store.state.app.temporaryBizData
  _pono = _this.$store.state.app.temporaryBizData.CONTRACTCODE.value
  if (!_pono) {
    node.bizData = {}
    return
  }
  _data = contractList.find(function (item) {
    return _pono === item.po_no
  })
  const loading = _this.$loading();
  myAjax({
    url: '/contractPayment/getPaymentDetail',
    method: 'POST',
    data: {
      "REQUEST": {
        "HEAD": {
          "BIZTRANSACTIONID": "BPM_CTG_011011_" + new Date().getTime(),
          "COUNT": "1",
          "CONSUMER": "ERP",
          "SRVLEVEL": "1",
          "ACCOUNT": "",
          "PASSWORD": "",
          "SYSTEM": _projectParams.system
        },
        "LIST": [{
          "PROJECT": _bizData.PROJECTNAME.value,
          // "DATAOWNER": _data.data_owner,
          "DATAOWNER": _bizData.DATAOWNER.value,
          "PONO": _pono
        }]
      }
    }
  }).then(function (rt) {
    loading.close();
    if (rt.status === '200') {
      let _dataContractInfo = JSON.parse(rt.data).DATA
      let _boq = []
      console.log(_dataContractInfo)
      if (_dataContractInfo) {
        if (_dataContractInfo.PAYMENT_DETAILS_LIST !== '') {
          payDetailList = _dataContractInfo.PAYMENT_DETAILS_LIST
          payDetailList.forEach(function (item) {
            let sum = ''
            let money = ''
            if (item.UNIT_OF_MEASURE === 'LOT') {
              sum = item.PARTANUM = 1
            }
            if (item.SUB_VENDOR === _dataContractInfo.COMPANY) {
              if(_bizData.PAYMENTDETAIL){
                _bizData.PAYMENTDETAIL.forEach(function(val){
                  if(val.BOQNAME && val.BOQNAME.value && val.BOQNAME.value === item.PO_ITEM){
                    if(val.PARTANUM && val.PARTANUM.value){
                      sum = delcommafy(val.PARTANUM.value)
                    }
                    if(val.PARTAMONEY && val.PARTAMONEY.value){
                      money = val.PARTAMONEY.value
                    }
                  }
                })
              }
              _boq.push({
                BOQNAME: {
                  showValue: item.PO_ITEM,
                  value: item.PO_ITEM
                },
                BOQDETAIL: {
                  showValue: item.BOQ_DESC,
                  value: item.BOQ_DESC
                },
                UNITCODE: {
                  showValue: item.UNIT_OF_MEASURE,
                  value: item.UNIT_OF_MEASURE
                },
                UNIT: {
                  showValue: item.DESCRIPTION_10 + '（' + item.UNIT_OF_MEASURE + '）',
                  value: item.DESCRIPTION_10 + '（' + item.UNIT_OF_MEASURE + '）'
                },
                PARTANUM: {
                  showValue: sum,
                  value: sum
                },
                PARTAMONEY: {
                  showValue: money,
                  value: money
                },
                UNITPRICE: {
                  showValue: item.PTD_COMMITMENT_RATE,
                  value: formatNumber(item.PTD_COMMITMENT_RATE, 2, 1)
                }
              })
            }
          })
        }
        if (_dataContractInfo.ACCOUNT_LIST != '') {
          let hash = {}
          payee = _dataContractInfo.ACCOUNT_LIST.reduce(function (item, next) {
            hash[next.SUB_VENDOR] ? '' : hash[next.SUB_VENDOR] = true && item.push(next)
            return item
          }, [])
        }
        node.nodeTabLists.forEach(function (item) {
          item.nodeTableLists.forEach(function (val) {
            if (val.fieldName === 'RECEIVINGUNIT') {
              if (payee.length === 0) {
                val.nodeoptions = []
              } else {
                val.nodeoptions = payee.map(function (item) {
                  return {
                    text: item.SUB_VENDOR_DESC,
                    value: item.SUB_VENDOR_DESC
                  }
                })
              }
            }
          })
        })
        let _defaultDepartment = payee.find(function (item) {
          return item.SUB_VENDOR === _dataContractInfo.COMPANY
        })
        _dataContractInfo.PTD_PAID_AMT = _dataContractInfo.PTD_PAID_AMT ? Number(_dataContractInfo.PTD_PAID_AMT) : 0
        if (JSON.stringify(node.bizData) === "{}") {
          node.bizData = {}
          initData(_this)
          setTimeout(function(){
            _this.$store.commit('app/setBizData', {
              "CONTRAACTNAME": { //合同描述
                showValue: _dataContractInfo.PO_DESC,
                value: _dataContractInfo.PO_DESC
              },
              // "DATAOWNER": {
              //   showValue: _data.data_owner,
              //   value: _data.data_owner
              // },
              // "DATAOWNER": {
              //   showValue: _projectParams.username,
              //   value: _projectParams.username
              // },
              "PARTYUNIT": { //乙方单位
                showValue: _dataContractInfo.DESCRIPTION_6,
                value: _dataContractInfo.DESCRIPTION_6
              },
              'PARTYUNITCODE': { //乙方单位编码
                showValue: _dataContractInfo.COMPANY,
                value: _dataContractInfo.COMPANY
              },
              'CONTRACTORCODE': { //承办单位编码 '暂时和乙方单位code一样'
                showValue: _dataContractInfo.COMPANY,
                value: _dataContractInfo.COMPANY
              },
              'RECEIVINGUNITCODE': { //收款单位编码 
                showValue: _defaultDepartment.SUB_VENDOR,
                value: _defaultDepartment.SUB_VENDOR
              },
              "CONTRACTOR": { //承办单位
                showValue: _dataContractInfo.DESCRIPTION_5,
                value: _dataContractInfo.DESCRIPTION_5
              },
              "RECEIVINGUNIT": { //收款单位
                showValue: _defaultDepartment.SUB_VENDOR_DESC,
                value: _defaultDepartment.SUB_VENDOR_DESC
              },
              "PAYINGBANK": { //汇入银行
                showValue: _defaultDepartment.BANK_ACCOUNT_NAME,
                value: _defaultDepartment.BANK_ACCOUNT_NAME
              },
              "BANKACCOUNT": { //
                showValue: _defaultDepartment.BANK_ACCOUNT_NO,
                value: _defaultDepartment.BANK_ACCOUNT_NO
              },
              "CONTRACTTOTAL": { //合同总价
                showValue: _dataContractInfo.ORIGINAL_AMT,
                value: formatNumber(_dataContractInfo.ORIGINAL_AMT, 2, 1)
              },
              // "PAYINGADDRESS": {//汇入地点
              //     showValue: _data.SHIP_TO_ADDRESS,
              //     value: _data.SHIP_TO_ADDRESS
              // },
              "FINALMONEY": { //合同当前总金额
                showValue: _dataContractInfo.PTD_COMMIT_AMT,
                value: formatNumber(_dataContractInfo.PTD_COMMIT_AMT, 2, 1)
              },
              "AMOUNTPAID": { //累计支付金额
                showValue: _dataContractInfo.COST1,
                value: formatNumber(Number(_dataContractInfo.COST1), 2, 1)
              },
              "PAYMENTDETAIL": _boq
            })
          },0)
          node.nodeTabLists[2].nodeTableLists[0].switch = true
        } else{
          node.bizData = {}
          setTimeout(function(){
            _this.$store.commit('app/setBizData', {
              "PAYMENTDETAIL": _boq
            })
          },0)
          node.nodeTabLists[2].nodeTableLists[0].switch = false
        }
      }
    }
    if(_this.$route.query.taskId){
      setTimeout(function(){
        searchSwitch(_this, node.nodeTabLists[2].nodeTableLists)
      },0)
    }
  })
}
//页面加载完成
function ready() {
  let _this = arguments[0]
  node = arguments[1]
  node.nodeTabLists.forEach(function (val) {
    val.nodeTableLists.forEach(function (item) {
      if (item.fieldName === 'PREPAYMENT' || item.fieldName === 'PAYMENTRETENTIONMONEY') {
        item.value = ''
        item.inputType = 'hidden'
        item.showValue = ''
      }
      if (item.fieldName === 'PREPAYMENT') {
        item.inputcolspan = 2
      }
    })
  });
  getProject(_this, node.nodeTabLists[0].nodeTableLists)
}

//获取银行信息
function getBank() {
  let _this = arguments[0]
  let _bizData = _this.$store.state.app.temporaryBizData
  let _value = ''
  if (_bizData.RECEIVINGUNIT && _bizData.RECEIVINGUNIT.value) {
    _value = _bizData.RECEIVINGUNIT.value
  }
  let backData = {}
  let _boq = []
  payee.forEach(function (item) {
    if (item.SUB_VENDOR_DESC === _value) {
      backData = item
    }
  })
  payDetailList.forEach(function (item) {
    if (item.UNIT_OF_MEASURE === 'LOT') {
      item.PARTANUM = 1
    }
    if (item.SUB_VENDOR === backData.SUB_VENDOR) {
      _boq.push({
        BOQNAME: {
          showValue: item.PO_ITEM,
          value: item.PO_ITEM
        },
        BOQDETAIL: {
          showValue: item.BOQ_DESC,
          value: item.BOQ_DESC
        },
        UNITCODE: {
          showValue: item.UNIT_OF_MEASURE,
          value: item.UNIT_OF_MEASURE
        },
        UNIT: {
          showValue: item.DESCRIPTION_10 + '（' + item.UNIT_OF_MEASURE + '）',
          value: item.DESCRIPTION_10 + '（' + item.UNIT_OF_MEASURE + '）'
        },
        PARTANUM: {
          showValue: item.PARTANUM,
          value: item.PARTANUM
        },
        UNITPRICE: {
          showValue: item.PTD_COMMITMENT_RATE,
          value: formatNumber(item.PTD_COMMITMENT_RATE, 2, 1)
        }
      })
    }
  })
  _this.$store.commit('app/setBizData', {
    "BANKACCOUNT": {
      showValue: backData.BANK_ACCOUNT_NO,
      value: backData.BANK_ACCOUNT_NO
    },
    "PAYINGBANK": {
      showValue: backData.BANK_ACCOUNT_NAME,
      value: backData.BANK_ACCOUNT_NAME
    },

    "RECEIVINGUNITCODE": {
      showValue: backData.SUB_VENDOR,
      value: backData.SUB_VENDOR
    },
    "PAYMENTDETAIL": _boq
  })
}

//其他扣款、扣预付款、代扣税金、扣保留金计算应付金额
function accountsPay() {
  let data = arguments[1]
  let _this = arguments[0]
  let _bizData = _this.$store.state.app.temporaryBizData
  let total = 0
  _bizData.PAYMENTDETAIL.forEach(function (item) {
    if (item.PARTAMONEY && item.PARTAMONEY.value) {
      total += Number(delcommafy(item.PARTAMONEY.value))
    }
  })
  if (_bizData.ADVANCEMONEY && _bizData.ADVANCEMONEY.value) {
    total -= delcommafy(_bizData.ADVANCEMONEY.value)
  }
  if (_bizData.OTHERDEDUCTIONS && _bizData.OTHERDEDUCTIONS.value) {
    total -= delcommafy(_bizData.OTHERDEDUCTIONS.value)
  }
  if (_bizData.WITHHOLDINGTAX && _bizData.WITHHOLDINGTAX.value) {
    total -= delcommafy(_bizData.WITHHOLDINGTAX.value)
  }
  if (_bizData.RESERVEMONEY && _bizData.RESERVEMONEY.value) {
    total -= delcommafy(_bizData.RESERVEMONEY.value)
  }
  _this.$store.commit('app/setBizData', {
    "ACTUALMONETS": {
      showValue: total,
      value: formatNumber(total, 2, 1)
    },
    "CHILDTYPE": {
      showValue: payType,
      value: payType
    },
    "ACTUALMONETSB": {
      showValue: digitUppercase(total),
      value: digitUppercase(total)
    }
  })

}
//进度款计算应付金额
function amountTotal1() {
  let dataHandle = arguments[1]
  let _this = arguments[0]
  let total = 0
  dataHandle.forEach(function (val) {
    val.nodeTableLists.forEach(function (item, i) {
      if (item.fieldName === 'PARTAMONEY' && item.applyvalue) {
        total += Number(delcommafy(item.applyvalue))
      }
    })
  })
  let amountPaid = total
  node.nodeTabLists.forEach(function (value) {
    value.nodeTableLists.forEach(function (item) {
      if (item.fieldName === 'ADVANCEMONEY' || item.fieldName === 'OTHERDEDUCTIONS' || item.fieldName === 'WITHHOLDINGTAX' || item.fieldName === 'RESERVEMONEY') {
        if (item.applyvalue) {
          amountPaid -= delcommafy(item.applyvalue)
        }
      }
    })
  })
  setTimeout(function () {
    _this.$store.commit('app/setBizData', {
      "TPAYMENTMONEYS": {
        showValue: total,
        value: formatNumber(total, 2, 1)
      },
      "TPAYMENTMONEYB": {
        showValue: digitUppercase(total),
        value: digitUppercase(total)
      },

      "ACTUALMONETS": {
        showValue: amountPaid,
        value: formatNumber(amountPaid, 2, 1)
      },
      "CHILDTYPE": {
        showValue: payType,
        value: payType
      },
      "ACTUALMONETSB": {
        showValue: digitUppercase(amountPaid),
        value: digitUppercase(amountPaid)
      },
    })
  })
  // let _this = arguments[0]
  // let total = 0
  // let _bizData = _this.$store.state.app.temporaryBizData
  // _bizData.PAYMENTDETAIL.forEach(function (item) {
  //   if (item.PARTAMONEY && item.PARTAMONEY.value) {
  //     total += Number(delcommafy(item.PARTAMONEY.value))
  //   }
  // })
  // let amountPaid = total
  // if (_bizData.ADVANCEMONEY && _bizData.ADVANCEMONEY.value) {
  //   amountPaid -= delcommafy(_bizData.ADVANCEMONEY.value)
  // }
  // if (_bizData.OTHERDEDUCTIONS && _bizData.OTHERDEDUCTIONS.value) {
  //   amountPaid -= delcommafy(_bizData.OTHERDEDUCTIONS.value)
  // }
  // if (_bizData.WITHHOLDINGTAX && _bizData.WITHHOLDINGTAX.value) {
  //   amountPaid -= delcommafy(_bizData.WITHHOLDINGTAX.value)
  // }
  // if (_bizData.RESERVEMONEY && _bizData.RESERVEMONEY.value) {
  //   amountPaid -= delcommafy(_bizData.RESERVEMONEY.value)
  // }
  // setTimeout(function(){
  //   _this.$store.commit('app/setBizData', {
  //     "TPAYMENTMONEYS": {
  //       showValue: total,
  //       value: formatNumber(total, 2, 1)
  //     },
  //     "TPAYMENTMONEYB": {
  //       showValue: digitUppercase(total),
  //       value: digitUppercase(total)
  //     },
  //     "ACTUALMONETS": {
  //       showValue: amountPaid,
  //       value: formatNumber(amountPaid, 2, 1)
  //     },
  //     "CHILDTYPE": {
  //       showValue: payType,
  //       value: payType
  //     },
  //     "ACTUALMONETSB": {
  //       showValue: digitUppercase(amountPaid),
  //       value: digitUppercase(amountPaid)
  //     },
  //   })
  // },0)
}
//setP0artaMoney 计算业主金额
function setPartaMoney() {
  let data = arguments[1]
  let _this = arguments[0]
  // let money = 0
  let index = arguments[2]
  let money = 0
  let unitPrice = 0
  data[index].nodeTableLists.forEach(function (item) {
    if (item.fieldName === 'UNITPRICE') {
      unitPrice = delcommafy(item.applyvalue)
    }
  })
  data[index].nodeTableLists.forEach(function (item) {
    if (item.fieldName === 'PARTANUM') {
      money = formatNumber(item.applyvalue * unitPrice, 2, 1)
    }
    if (item.fieldName === 'PARTAMONEY') {
      // _list[index] = {
      //     PARTAMONEY:{
      //         value: money,
      //         showValue: money,
      //     }
      // }
      item.showValue = money
      if (item.applyvalue) {
        item.applyvalue = money
      } else {
        _this.$set(item, 'applyvalue', money)
      }
    }
  })
  // setTimeout(function(){
  // let _bizData = _this.$store.state.app.temporaryBizData
  // _bizData.PAYMENTDETAIL.forEach(function (item) {
  //   if (item.UNITCODE && item.UNITCODE.value && item.UNITCODE.value !== 'LOT') {
  //     if (item.PARTANUM) {
  //       if(item.PARTANUM.value == 0){
  //         item.PARTAMONEY = {
  //           showValue: '',
  //           value: ''
  //         }
  //       }else{
  //         money = delcommafy(item.UNITPRICE.value) * delcommafy(item.PARTANUM.value)
  //         item.PARTAMONEY = {
  //           showValue: formatNumber(money, 2, 1),
  //           value: formatNumber(money, 2, 1)
  //         }
  //       }
  //     }
  //   }
  // })
  // },0)

  
  amountTotal1(_this, data)
}
//setP0artaMoney 计算业主金额
function setPartaMoneyTwo() {
  // let data = arguments[1]
  // let _this = arguments[0]
  let data = arguments[1]
  let _this = arguments[0]
  let index = arguments[2]
  data[index].nodeTableLists.forEach(function (item) {
    if (item.fieldName === 'PARTAMONEY' && item.applyvalue) {
      item.applyvalue = item.applyvalue
      _this.$set(item, 'applyvalue', item.applyvalue)
    }
  })
  amountTotal1(_this, data)
}
//计算预付款支付单应付金额
function setPrepayment() {
  let data = arguments[1]
  let _this = arguments[0]
  let _bizData = _this.$store.state.app.temporaryBizData
  if (_bizData.PREPAYMENT && _bizData.PREPAYMENT.value) {
    let _money = delcommafy(_bizData.PREPAYMENT.value) || 0
    _this.$store.commit('app/setBizData', {
      "TPAYMENTMONEYS": {
        showValue: _money,
        value: formatNumber(_money, 2, 1)
      },
      "TPAYMENTMONEYB": {
        showValue: _money === 0 ? '零元' : digitUppercase(_money),
        value: _money === 0 ? '零元' : digitUppercase(_money)
      },
      "CHILDTYPE": {
        showValue: payType,
        value: payType
      },
      "ACTUALMONETS": {
        showValue: _money,
        value: formatNumber(_money, 2, 1)
      },
      "ACTUALMONETSB": {
        showValue: _money === 0 ? '零元' : digitUppercase(_money),
        value: _money === 0 ? '零元' : digitUppercase(_money)
      }
    })
  }
}
//计算保留金（其他扣款）支付单应付金额
function setRetainagePay() {
  let _this = arguments[0]
  let _bizData = _this.$store.state.app.temporaryBizData
  if (_bizData.PAYMENTRETENTIONMONEY && _bizData.PAYMENTRETENTIONMONEY.value) {
    let _money = delcommafy(_bizData.PAYMENTRETENTIONMONEY.value) || 0
    _this.$store.commit('app/setBizData', {
      "TPAYMENTMONEYS": {
        showValue: _money,
        value: formatNumber(_money, 2, 1)
      },
      "TPAYMENTMONEYB": {
        showValue: _money === 0 ? '零元' : digitUppercase(_money),
        value: _money === 0 ? '零元' : digitUppercase(_money)
      },
      "CHILDTYPE": {
        showValue: payType,
        value: payType
      },
      "ACTUALMONETS": {
        showValue: _money,
        value: formatNumber(_money, 2, 1)
      },
      "ACTUALMONETSB": {
        showValue: _money === 0 ? '零元' : digitUppercase(_money),
        value: _money === 0 ? '零元' : digitUppercase(_money)
      }
    })
  }
}
function payTypeHandle() {
  let _this = arguments[0]
  let _bizData = _this.$store.state.app.temporaryBizData
  if (_bizData.CHILDTYPE && _bizData.CHILDTYPE.value) {
    payType = _bizData.CHILDTYPE.value
  }
  _this.$store.commit('app/setBizData', {
    "CHILDTYPE": {
      showValue: payType,
      value: payType
    },
  })
  node.nodeTabLists.forEach(function (val) {
    val.nodeTableLists.forEach(function (item) {
      if (item.fieldName === 'PREPAYMENT' || item.fieldName === 'PAYMENTRETENTIONMONEY' || item.fieldName === 'ADVANCEMONEY' || item.fieldName === 'OTHERDEDUCTIONS' || item.fieldName === 'RESERVEMONEY' || item.fieldName === 'WITHHOLDINGTAX') {
        item.inputType = "double"
      }
    })
  })
  if (payType === "预付款支付单") {
    node.nodeTabLists.forEach(function (val) {
      val.nodeTableLists.forEach(function (item) {
        if (item.fieldName === 'PAYMENTRETENTIONMONEY' || item.fieldName === 'ADVANCEMONEY' || item.fieldName === 'OTHERDEDUCTIONS' || item.fieldName === 'RESERVEMONEY' || item.fieldName === 'WITHHOLDINGTAX') {
          item.inputType = 'hidden'
          item.value = ''
          item.showValue = ''
        }
        if (item.fieldName === 'PREPAYMENT') {
          item.inputcolspan = 4
        }
      })
    })

  } else if (payType === "进度款支付单") {
    node.nodeTabLists.forEach(function (val) {
      val.nodeTableLists.forEach(function (item) {
        if (item.fieldName === 'PREPAYMENT' || item.fieldName === 'PAYMENTRETENTIONMONEY') {
          item.inputType = 'hidden'
          item.value = ''
          item.showValue = ''
        }
        if (item.fieldName === 'PREPAYMENT') {
          item.inputcolspan = 2
        }
      })
    })

  } else if (payType === "保留金（其他扣款）支付单") {
    node.nodeTabLists.forEach(function (val) {
      val.nodeTableLists.forEach(function (item) {
        if (item.fieldName === 'PREPAYMENT' || item.fieldName === 'ADVANCEMONEY' || item.fieldName === 'OTHERDEDUCTIONS' || item.fieldName === 'RESERVEMONEY' || item.fieldName === 'WITHHOLDINGTAX') {
          item.inputType = 'hidden'
          item.value = ''
          item.showValue = ''
        }
        if (item.fieldName === 'PAYMENTRETENTIONMONEY') {
          item.inputcolspan = 4
        }
      })
    })

  }
  _this.$store.commit('app/setBizData', {
    "TPAYMENTMONEYS": {
      showValue: 0,
      value: formatNumber(0, 2, 1)
    },
    "CHILDTYPE": {
      showValue: payType,
      value: payType
    },
    "TPAYMENTMONEYB": {
      showValue: digitUppercase(0),
      value: digitUppercase(0)
    },
    "ACTUALMONETS": {
      showValue: 0,
      value: formatNumber(0, 2, 1)
    },
    "ACTUALMONETSB": {
      showValue: digitUppercase(0),
      value: digitUppercase(0)
    }
  })
}
