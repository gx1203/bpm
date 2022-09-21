//11.3 服务站基本信息变更流程
var _this;
var node;
var nodeTabLists;
//测试页面加载完成
function readyP() {
    _this = arguments[0];
    node = arguments[1];
    nodeTabLists = node.nodeTabLists;

    var bizData = node.bizData;

    // 参数定义：
    // 0：key1
    // 1:key2
    // 3:key1所属下标
    // 4:key2所属下标
    // 5:在哪个表单结构中
    var keyObject = [['NAME', 'ANAME', 1, 2, 2],
    ['SHORTNAME', 'ASHORTNAME', 3, 4, 2],
    ['MANAGER', 'AMANAGER', 5, 6, 2],
    ['REPAIRQUALIFICATION', 'AREPAIRQUALIFICATION', 7, 8, 2],
    ['HASBRANCH', 'AHASBRANCH', 9, 10, 2],
    ['DANGEROUSREPAIRQUALIFICATION', 'ADANGEROUSREPAIRQUALIFICATION', 11, 12, 2],
    ['BRANDSCOPE', 'ABRANDSCOPE', 3, 4, 2],
    ['COMPETITIVEBRANDSCOPE', 'ACOMPETITIVEBRANDSCOPE', 3, 4, 2],
    ['PARKINGAREA', 'APARKINGAREA', 3, 4, 2],
    ['REPAIRINGAREA', 'AREPAIRINGAREA', 3, 4, 2],
    ['EMPLOYEENUMBER', 'AEMPLOYEENUMBER', 3, 4, 2],
    ['PARTWAREHOUSEAREA', 'APARTWAREHOUSEAREA', 3, 4, 2],
    ['GEOGRAPHICPOSITION', 'AGEOGRAPHICPOSITION', 3, 4, 2],
    ['OWNERCOMPANY', 'AOWNERCOMPANY', 3, 4, 2],
    ['MAINBUSINESSAREAS', 'AMAINBUSINESSAREAS', 3, 4, 2],
    ['ANDBUSINESSAREAS', 'AANDBUSINESSAREAS', 3, 4, 2],
    ['BUILDTIME', 'ABUILDTIME', 3, 4, 2],
    ['TRAFFICRESTRICTIONSDESCRIBE', 'ATRAFFICRESTRICTIONSDESCRIBE', 3, 4, 2],
    ['MANAGERPHONENUMBER', 'AMANAGERPHONENUMBER', 3, 4, 2],
    ['MANAGERMOBILE', 'AMANAGERMOBILE', 3, 4, 2],
    ['MANAGERMAIL', 'AMANAGERMAIL', 3, 4, 2],
    ['RECEPTIONROOMAREA', 'ARECEPTIONROOMAREA', 3, 4, 2],
    ['ISVEHICLESALESINVOICE', 'AISVEHICLESALESINVOICE', 3, 4, 2],
    ['ISPARTSSALESINVOICE', 'AISPARTSSALESINVOICE', 3, 4, 2],
    ['TAXREGISTEREDNUMBER', 'ATAXREGISTEREDNUMBER', 3, 4, 2],
    ['INVOICETITLE', 'AINVOICETITLE', 3, 4, 2],
    ['INVOICETYPE', 'AINVOICETYPE', 3, 4, 2],
    ['TAXPAYERQUALIFICATION', 'ATAXPAYERQUALIFICATION', 3, 4, 2],
    ['INVOICEAMOUNTQUOTA', 'AINVOICEAMOUNTQUOTA', 3, 4, 2],
    ['TAXREGISTEREDADDRESS', 'ATAXREGISTEREDADDRESS', 3, 4, 2],
    ['TAXREGISTEREDPHONE', 'ATAXREGISTEREDPHONE', 3, 4, 2],
    ['BANKNAME', 'ABANKNAME', 3, 4, 2],
    ['BANKACCOUNT', 'ABANKACCOUNT', 3, 4, 2],
    ['INVOICETAX', 'AINVOICETAX', 3, 4, 2],
    ['LINKMAN', 'ALINKMAN', 3, 4, 2],
    ['CONTACTNUMBER', 'ACONTACTNUMBER', 3, 4, 2],
    ['FAX', 'AFAX', 3, 4, 2],
    ['STATUS', 'ASTATUS', 3, 4, 2],
    ['CUSTOMERCODE', 'ACUSTOMERCODE', 3, 4, 2],
    ['SUPPLIERCODE', 'ASUPPLIERCODE', 3, 4, 2],
    ['FOUNDDATE', 'AFOUNDDATE', 3, 4, 2],
    ['REGIONID', 'AREGIONID', 3, 4, 2],
    ['PROVINCENAME', 'APROVINCENAME', 3, 4, 2],
    ['CITYNAME', 'ACITYNAME', 3, 4, 2],
    ['COUNTYNAME', 'ACOUNTYNAME', 3, 4, 2],
    ['CITYLEVEL', 'ACITYLEVEL', 3, 4, 2],
    ['CONTACTPERSON', 'ACONTACTPERSON', 3, 4, 2],
    ['CONTACTMOBILE', 'ACONTACTMOBILE', 3, 4, 2],
    ['CONTACTPHONE', 'ACONTACTPHONE', 3, 4, 2],
    ['CONTACTMAIL', 'ACONTACTMAIL', 3, 4, 2],
    ['COMPANYFAX', 'ACOMPANYFAX', 3, 4, 2],
    ['CONTACTPOSTCODE', 'ACONTACTPOSTCODE', 3, 4, 2],
    ['BUSINESSADDRESS', 'ABUSINESSADDRESS', 3, 4, 2],
    ['REGISTERCODE', 'AREGISTERCODE', 3, 4, 2],
    ['REGISTERNAME', 'AREGISTERNAME', 3, 4, 2],
    ['REGISTERCAPITAL', 'AREGISTERCAPITAL', 3, 4, 2],
    ['FIXEDASSET', 'AFIXEDASSET', 3, 4, 2],
    ['REGISTERDATE', 'AREGISTERDATE', 3, 4, 2],
    ['CORPORATENATURE', 'ACORPORATENATURE', 3, 4, 2],
    ['LEGALREPRESENTATIVE', 'ALEGALREPRESENTATIVE', 3, 4, 2],
    ['LEGALREPRESENTTEL', 'ALEGALREPRESENTTEL', 3, 4, 2],
    ['IDDOCUMENTTYPE', 'AIDDOCUMENTTYPE', 3, 4, 2],
    ['IDDOCUMENTNUMBER', 'AIDDOCUMENTNUMBER', 3, 4, 2],
    ['REGISTEREDADDRESS', 'AREGISTEREDADDRESS', 3, 4, 2],
    ['BUSINESSSCOPE', 'ABUSINESSSCOPE', 3, 4, 2],
    ['REMARK', 'AREMARK', 3, 4, 2],
    ['BUSINESSADDRESSLONGITUDE', 'ABUSINESSADDRESSLONGITUDE', 3, 4, 2],
    ['BUSINESSADDRESSLATITUDE', 'ABUSINESSADDRESSLATITUDE', 3, 4, 2],
    ['DISTANCE', 'ADISTANCE', 3, 4, 2],
    ['MINSERVICECODE', 'AMINSERVICECODE', 3, 4, 2],
    ['MINSERVICENAME', 'AMINSERVICENAME', 3, 4, 2]];

    if (JSON.stringify(bizData) != "{}") {

        keyObject.forEach((item, index) => {

            var thisRgb = rgb();



            // 普通类型数据对比
            var key1 = bizData[item[0]];
            var key2 = bizData[item[1]];

            if (typeof key1 !== 'undefined' || typeof key2 !== 'undefined') {

                if (key1.value != key2.value) {

                    var document1 = $(`.myFormStyleDiv .card:nth-child(${item[4]}) .myFormStyle .form-item:nth-child(${item[2]})`);
                    var document2 = $(`.myFormStyleDiv .card:nth-child(${item[4]}) .myFormStyle .form-item:nth-child(${item[3]})`);

                    document1.css('backgroundColor', thisRgb);
                    document1.css('padding', '4px');
                    document2.css('backgroundColor', thisRgb);
                    document2.css('padding', '4px');
                }
            }

        })
    }
}

//rgb颜色随机
function rgb() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    var rgb = 'rgb(' + r + ',' + g + ',' + b + ', 30%)';
    return rgb;
}