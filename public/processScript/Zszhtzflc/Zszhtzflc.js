
//公共加载方法
function readyP() {
    var _this = arguments[0];
    var _data = arguments[1];
    var nodeTabLists = arguments[1].nodeTabLists;
    if(_this.$http){
        _this.$http({
            url: '/zszpayment/getProjectList',
            method: 'GET',
        }).then(function (rt) {
            let list = []
            for (let i = 0; i< rt.data.length; i++) {
                list.push({
                    text: rt.data[i].projectName,
                    value: rt.data[i].projectCode
                })
                for (let i = 0; i < nodeTabLists.length; i++) {
                    for (let j = 0; j < nodeTabLists[i].nodeTableLists.length; j++) {
                        let _data = nodeTabLists[i].nodeTableLists[j]
                        if(_data.fieldName === 'XMBH'){
                            _data.nodeoptions = list
                        }
                    }
                }
            }
            if(_data.bizData.XMBH && _data.bizData.XMBH.value ){
                gteContractHandle(_this ,_data)
            }
        })
    }
}

//获取合同信息
function gteContractHandle() {
    var _this = arguments[0];
    var _data = arguments[1];
    var nodeTabLists = arguments[1].nodeTabLists;
    if (_this.$http) {
        _this.$http({
            url: '/zszpayment/getPoList/' + _data.bizData.XMBH.value,
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
