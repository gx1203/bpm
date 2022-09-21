// 11.1服务站入站流程 控制隐藏显示
var _this;
var node;
var nodeTabLists;
//测试页面加载完成
function readyP() {
    _this = arguments[0];
    node = arguments[1];
    nodeTabLists = node.nodeTabLists;

    var bizData = node.bizData;
    var key = bizData.DEALERTYPE.value;
    var area1 = node.nodeTabLists[1];
    var area2 = node.nodeTabLists[2];

    if (JSON.stringify(bizData) != "{}") {


        if (key == "1") {
            //只显示 一级入网
            _this.$set(area1, "editstate", "S");
            _this.$set(area2, "editstate", "H");
        } else if (key == "2") {
            // 只显示 二级入网
            _this.$set(area1, "editstate", "H");
            _this.$set(area2, "editstate", "S");
        } else {
            // 全部隐藏
            _this.$set(area1, "editstate", "H");
            _this.$set(area2, "editstate", "H");
        }
    } else {
        // 全部隐藏
        _this.$set(area1, "editstate", "H");
        _this.$set(area2, "editstate", "H");
    }
}