// 格式说明
var data = {
    // 页面标题
    pageTitle: '',
    data: [{
        //标签页名称
        tabsTitle: '',
        // 区块类目
        area: [{
            areaTitle: '',// 区块标题,填写则展示标题，不填写不展示
            areaType: '', //form 表单，table 表格
            // 根据 areaType 类型 在页面展示不同的数据
            // areaType 为 form 则 数据携带这种格式
            areaData: [{
                formTitle:'', // 表单标题，可不填
                //表单结构
                formColumn:[{
                    type: 'text', //展示类型：text 文本；textarea 文本域；link 超链接，image 图片
                    label: '企业名称', //字段说明
                    key: 'a', //表单数据key值，对应formData中的key
                    unit: '',  //单位(说明)，只对text link有效。 text时 表示单位；link时 表示附件说明
                    isShow: true,  //是否在页面中显示。true 显示，false 不显示
                    gridOccupancy: 1 // 栅格占比 1~24 
                }],
                //表单数据
                // image 类型 需要返回 字符串数组
                formData:{
                    a:'aaaa', //对应formColumn中的key
                    b:'bbbb',
                }
            }],
            // areaType 为 table 则 数据携带这种格式
            areaData: [{
                //表格名称
                tableTitle: '',
                //表头配置
                tableColumn: [{
                    prop: 'date', //接收字段
                    label: '日期', //展示表头
                    isShow:true, //是否展示列 true 显示，false 不显示
                },
                {
                    prop: 'name',
                    label: '姓名',
                    isShow: false,
                },
                {
                    prop: 'address',
                    label: '地址',
                    isShow:true,
                }],
                //表格数据
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄',
                },
                {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄',
                }]
            }]
        }]
    }]
}

import testDataForm from './testDataForm';

const data1 = {
    pageTitle: '供应商资源管理',
    data: testDataForm.testDataForm1
}

const data2 = {
    pageTitle: '供应商资源管理',
    data: testDataForm.testDataForm2
}

export default {
    data1,
    data2
};