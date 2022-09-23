// 11.2服务站退网业务流程 控制区域块显示（新增、变更）
var _this;
var node;
var nodeTabLists;
//测试页面加载完成
function readyP() {
    _this = arguments[0];
    node = arguments[1];
    console.log(node);

    var bizData = node.bizData;
    var key = bizData.DEALERTYPE.value;
    var area = node.nodeTabLists[1];

    if (JSON.stringify(bizData) != "{}") {
        if (key == "2") {
            //只显示 新增
            _this.$set(area, "editstate", "S");
        }else {
            // 全部隐藏
            _this.$set(area, "editstate", "H");
        }
    } else {
        // 全部隐藏
        _this.$set(area, "editstate", "H");
    }
}