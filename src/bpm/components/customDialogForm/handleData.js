

// function doData(type, data, dialogIndex) {
//     // console.log(type);
//     // console.log(JSON.stringify(data));

//     var nodeTableLists = data.nodeTableLists;
//     var dataTemp = {
//         pageTitle: data.tabname,
//         data: [],
//     };

//     // 根据弹出框页面处理对应的数据内容
//     switch (type) {
//         case "基本情况调查表":
//             nodeTableLists.forEach((element, index) => {
//                 console.warn("index:" + index);
//                 console.log(element.rows[dialogIndex]);
//                 var thisRowsData = element.rows[dialogIndex].nodeTableLists;
//                 // console.warn("index:" + index);
//                 // console.warn(thisRowsData);
//                 var thisAreaIndex = 0;
//                 var tabData = {
//                     tabsTitle: element.fieldShowName,
//                     area: [],
//                 }

//                 thisRowsData.forEach((row, rowIndex) => {
//                     var areaTemp = {
//                         areaTitle: row.inputType == 'subtable' ? row.fieldShowName : element.fieldShowName,
//                         areaType: row.inputType == 'subtable' ? 'table' : 'form',
//                         Column: [],
//                         Data: []
//                     };
//                     if (rowIndex == 0) {
//                         tabData.area.push(areaTemp);
//                     } else {
//                         var thisType = row.inputType == 'subtable' ? 'table' : 'form';

//                         var isAlikeType = thisType == tabData.area[thisAreaIndex].areaType;
//                         if (!isAlikeType) {
//                             thisAreaIndex++;
//                             tabData.area.push(areaTemp);
//                         }
//                     }
//                     //当前区域
//                     if (tabData.area[thisAreaIndex].areaType == 'table') {
//                         //添加表格数据

//                         // 表格结构
//                         var tableColumn = row.nodeTableLists;
//                         tableColumn.forEach(item => {
//                             tabData.area[thisAreaIndex].Column.push({
//                                 prop: item.fieldName,
//                                 label: item.fieldShowName,
//                                 isShow: true,
//                             });
//                         });

//                         // 表格数据
//                         var tableData = row.rows;
//                         tableData.forEach((tableItem) => {
//                             tabData.area[thisAreaIndex].Data.push(MyRender(tableItem.nodeTableLists));
//                         });


//                     } else {
//                         //添加表单数据
//                         tabData.area[thisAreaIndex].Column.push({
//                             type: row.inputType,
//                             label: row.fieldShowName,
//                             value: row.showValue,
//                             unit: '',
//                             isShow: true,
//                             gridOccupancy: 12
//                         });
//                     }

//                     // 结束循环，返回数据
//                     if (rowIndex == thisRowsData.length - 1) {
//                         dataTemp.data.push(tabData);
//                         console.error(dataTemp);
//                     }

//                 });

//             });
//             break;
//         case "供应商推荐表":
//             nodeTableLists.forEach((element, index) => {
//                 var tabData = {
//                     tabsTitle: element.fieldShowName,
//                     area: [{
//                         areaTitle: element.fieldShowName,
//                         areaType: 'form',
//                         areaData: [{
//                             Title: '',
//                             Column: []
//                         }],
//                     }],
//                 }
//                 var thisRowsData = element.rows[dialogIndex].nodeTableLists;

//                 thisRowsData.forEach((row, rowIndex) => {
//                     tabData.area[0].areaData[0].Column.push({
//                         type: row.inputType,
//                         label: row.fieldShowName,
//                         value: row.showValue,
//                         unit: '',
//                         isShow: true,
//                         gridOccupancy: 12
//                     });


//                     if (rowIndex == thisRowsData.length - 1 && index == nodeTableLists.length - 1) {
//                         dataTemp.data.push(tabData);
//                     }
//                 });
//             });
//             break;
//     }


//     return dataTemp;
// }

function doData2(type, data, dialogIndex) {
    // console.log(type);
    // console.log(JSON.stringify(data));

    var nodeTableLists = data.nodeTableLists;
    var dataTemp = {
        pageTitle: data.tabname,
        data: [],
    };

    nodeTableLists.forEach((element, index) => {
        // console.warn("index:" + index);
        // console.warn(element.rows[dialogIndex]);
        if (typeof (element.rows[dialogIndex]) != 'undefined') {

            var thisRowsData = element.rows[dialogIndex].nodeTableLists;

            // console.warn(thisRowsData);
            var thisAreaIndex = 0;
            var tabData = {
                tabsTitle: element.fieldShowName,
                area: [],
            }

            thisRowsData.forEach((row, rowIndex) => {
                var areaTemp = {
                    areaTitle: row.inputType == 'subtable' ? row.fieldShowName : element.fieldShowName,
                    areaType: row.inputType == 'subtable' ? 'table' : 'form',
                    Column: [],
                    Data: []
                };
                if (rowIndex == 0) {
                    tabData.area.push(areaTemp);
                } else {
                    var thisType = row.inputType == 'subtable' ? 'table' : 'form';

                    // 判断当前row类型 和 area 区域类型是否相同
                    // 主要用来区分 form 和 table 之间的数据
                    //若接连都是table,则 分别创建area区域，避免两个子表之间相互串通
                    var isAlikeType = thisType == tabData.area[thisAreaIndex].areaType;
                    var isAlikeTable = (thisType == 'table' && tabData.area[thisAreaIndex].areaType == 'table');
                    // console.error("isAlikeTable:" + isAlikeTable);
                    if (isAlikeType == false || isAlikeTable == true) {
                        thisAreaIndex++;
                        tabData.area.push(areaTemp);
                    }
                }
                //当前区域
                if (tabData.area[thisAreaIndex].areaType == 'table') {
                    //添加表格数据

                    // 表格结构
                    var tableColumn = row.nodeTableLists;
                    tableColumn.forEach(item => {
                        tabData.area[thisAreaIndex].Column.push({
                            type: item.inputType,
                            prop: item.fieldName,
                            label: item.fieldShowName,
                            isShow: true,
                            peg: item.remark || null
                        });
                    });

                    // 表格数据
                    var tableData = row.rows;
                    tableData.forEach((tableItem) => {
                        tabData.area[thisAreaIndex].Data.push(MyRender(tableItem.nodeTableLists));
                    });


                } else {
                    //添加表单数据
                    tabData.area[thisAreaIndex].Column.push({
                        type: row.inputType,
                        label: row.fieldShowName,
                        value: row.showValue,
                        unit: '',
                        isShow: true,
                        peg: row.remark || null,
                        gridOccupancy: 12
                    });
                }

                // 结束循环，返回数据
                if (rowIndex == thisRowsData.length - 1) {
                    dataTemp.data.push(tabData);
                    // console.error(dataTemp);
                }

            });

        }
    });

    return dataTemp;
}

function MyRender(array) {
    let obj = {};
    array.forEach((v,) => {
        obj[v.fieldName] = v.showValue
    })

    return obj;
    // console.log(obj);
}

export default doData2;