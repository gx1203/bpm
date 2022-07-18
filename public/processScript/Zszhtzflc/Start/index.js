//获取合同信息
function projectHandel() {
    var _this = arguments[0];
    var _data = arguments[1];
    var nodeTabLists = arguments[2].nodeTabLists;
    _this.$store.commit('app/setBizData',{
        PAYINGBANK: {
            showValue:'',
            value:''
        },
        ORGANIZER: {
            showValue:'',
            value:''
        },
        BANKACCOUNT: {
            showValue:'',
            value:''
        },
        CONTRACTVALUE: {
            showValue:'',
            value:''
        },
        AMOUNTPAID: {
            showValue:'',
            value:''
        },
        SETTLEMENTPRICE: {
            showValue:'',
            value:''
        },
        HTXX: {
            showValue:'',
            value:''
        }
    })
    if (_this.$http) {
        _this.$http({
            url: '/zszpayment/getPoList/' + _data.XMBH,
            method: 'GET',
        }).then(function (rt) {
            let list = []
            for (let i = 0; i < rt.data.length; i++) {
                list.push({
                    text: rt.data[i].poName,
                    value: rt.data[i].poCode
                })
                for (let i = 0; i < nodeTabLists.length; i++) {
                    for (let j = 0; j < nodeTabLists[i].nodeTableLists.length; j++) {
                        let _data = nodeTabLists[i].nodeTableLists[j]
                        if (_data.fieldName === 'HTXX') {
                            _data.nodeoptions = list
                        }
                    }
                }
            }
        })
    }
}


function ready() {
    var _this = arguments[0];
    _this.$message.error('加载完成')
}
//获取合同明细
function contractHandel() {
    var _this = arguments[0];
    var _data = arguments[1];
    if (_this.$http) {
        _this.$http({
            url: '/zszpayment/getPoDetail/' + _data.HTXX,
            method: 'GET',
        }).then(function (rt) {
            let obj = rt.data
            let list = []
            for (let i = 0; i < rt.data.length; i++) {
                list.push({
                    text: rt.data[i].poName,
                    value: rt.data[i].poCode
                })
            }
            _this.$store.commit('app/setBizData',{
                PAYINGBANK: {
                    showValue:obj.payingbank,
                    value:obj.payingbank
                },
                ORGANIZER: {
                    showValue:obj.organizer,
                    value:obj.organizer
                },
                BANKACCOUNT: {
                    showValue:obj.bankaccount,
                    value:obj.bankaccount
                },
                CONTRACTVALUE: {
                    showValue:obj.contractvalue,
                    value:obj.contractvalue
                },
                AMOUNTPAID: {
                    showValue:obj.amountpaid,
                    value:obj.amountpaid
                },
                SETTLEMENTPRICE: {
                    showValue:obj.settlementprice,
                    value:obj.settlementprice
                }
            })
        })
    }

}

//经办人信息
function userHandel() {
    var _this = arguments[0];
    var _data = arguments[1];
    if(!_data.JBR){
        _this.$store.commit('app/setBizData',{
            JBRBM: {
                showValue:'',
                value:''
            }
        })
        return
    }
    if (_this.$http) {
        _this.$http({
            url: '/zszpayment/getDeptNameByUserId/' + _data.JBR,
            method: 'GET',
        }).then(function (rt) {
            let obj = rt.data
            _this.$store.commit('app/setBizData',{
                JBRBM: {
                    showValue:obj,
                    value:obj
                }
            })
        })
    }
    
}

//获取经办人部门编号
function depaHandel() {
    var _this = arguments[0];
    var _data = arguments[1];
    if(!_data.JBRBM2){
        _this.$store.commit('app/setBizData',{
            BMBH: {
                showValue:'',
                value:''
            }
        })
        return
    }
    if (_this.$http) {
        _this.$http({
            url: '/zszpayment/getDeptCodeByDeptId/' + _data.JBRBM2,
            method: 'GET',
        }).then(function (rt) {
            let obj = rt.data
            _this.$store.commit('app/setBizData',{
                BMBH: {
                    showValue:obj,
                    value:obj
                }
            })
        })
    }
    
}

//计算金额
function countHandel() {
    let _this = arguments[0];
    debugger
    let _tableList = arguments[1].SUBTAB_ZHENGSZ;
    let BCYFJE = 0
    let _list = []
    for (let i = 0; i < _tableList.length; i++) {
        if (_tableList[i].UNITPRICE && _tableList[i].NUM) {
            _tableList[i].TOTLEPRICE  = Number(_tableList[i].UNITPRICE) * Number(_tableList[i].NUM)
            BCYFJE += _tableList[i].TOTLEPRICE 
        }
        _list.push({
            UNITPRICE:{
                showValue: _tableList[i].UNITPRICE || '',
                value: _tableList[i].UNITPRICE|| '',
            },
            BOQ:{
                showValue: _tableList[i].BOQ|| '',
                value: _tableList[i].BOQ|| '',
            },
            BOQDESC:{
                showValue: _tableList[i].BOQDESC|| '',
                value: _tableList[i].BOQDESC|| '',
            },
            UNIT:{
                showValue: _tableList[i].UNIT|| '',
                value: _tableList[i].UNIT|| '',
            },
            UNITPRICE:{
                showValue: _tableList[i].UNITPRICE|| '',
                value: _tableList[i].UNITPRICE|| '',
            },
            NUM:{
                showValue: _tableList[i].NUM|| '',
                value: _tableList[i].NUM|| '',
            },
            TOTLEPRICE:{
                showValue: _tableList[i].TOTLEPRICE|| '',
                value: _tableList[i].TOTLEPRICE|| '',
            },
        })
    }
    _this.$store.commit('app/setBizData',{
        SUBTAB_ZHENGSZ: _list,
        BCYFJE:{
            showValue: BCYFJE,
            value: BCYFJE
        },
        BCSFJE:{
            showValue: _this.$options.filters.digitUppercase(BCYFJE),
            value: _this.$options.filters.digitUppercase(BCYFJE),
        }
    })
        
}

//提交验证
function submit() {
    let _this = arguments[0]
    let _data = arguments[1]
    return new Promise(function (resolve, reject) {
        if (_this.$http) {
            _this.$http({
                url: '/zszpayment/validatePo/' + _data.ZFBH+'/'+_data.HTXX,
                method: 'GET',
            }).then(function (rt) {
                let obj = rt.data
                if(rt.data){
                    resolve(true);
                }else{
                    resolve(false);
                    _this.$message.error('合同信息不存在！！')
                }
            })
        }
    });
}