// 出门证
var _this;
var node;
var nodeTabLists;
//测试页面加载完成
function readyP() {
    _this = arguments[0];
    node = arguments[1];
    nodeTabLists = node.nodeTabLists;

    console.log(node);
    
    var applyUserId = node.applyUserDto.id;

    var setDataNodes = nodeTabLists[2].nodeTableLists[1];

    _this.$set(setDataNodes, "applyvalue", applyUserId);
    _this.$set(setDataNodes, "showValue", applyUserId);

}