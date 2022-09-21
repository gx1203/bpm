//4.2 高亮显示
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
    // 5:是否在子表区域(数组)中
    var keyObject = [['BGQWBK', 'BGHWBK', 1, 2, false], ['BGQDXK', 'BGHDXK', 3, 4, false]];

    if (JSON.stringify(bizData) != "{}") {

        keyObject.forEach((item, index) => {

            var thisRgb = rgb();

            // 判断对比的数据是否在子表区域中
            if (item[4] != true) {
                // 普通类型数据对比
                var key1 = bizData[item[0]].value;
                var key2 = bizData[item[1]].value;

                if (key1 != key2) {
                    $(`#myFormStyle .form-item:nth-child(${item[2]})`).css('backgroundColor', thisRgb);
                    $(`#myFormStyle .form-item:nth-child(${item[2]})`).css('padding', '4px');
                    $(`#myFormStyle .form-item:nth-child(${item[3]})`).css('backgroundColor', thisRgb);
                    $(`#myFormStyle .form-item:nth-child(${item[3]})`).css('padding', '4px');
                }
            } else {
                // 子表区域中的数据对比
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