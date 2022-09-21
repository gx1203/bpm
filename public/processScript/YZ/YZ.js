//4.1 隐藏
var _this;
var node;
var nodeTabLists;
//测试页面加载完成
function readyP() {
    _this = arguments[0];
    node = arguments[1];
    nodeTabLists = node.nodeTabLists;

    console.log(node);
    // console.log(nodeTabLists);

    //   var key0 = "PDYCNYGQYK";
    var key0_applyValue = nodeTabLists[0].nodeTableLists[0].applyvalue;
    var key0_showValue = nodeTabLists[0].nodeTableLists[0].showValue;

    if (key0_applyValue == 'A' || key0_showValue == 'A') {
        _this.$set(nodeTabLists[1], "editstate", "S");
        _this.$set(nodeTabLists[2], "editstate", "H");
    } else if (key0_applyValue == 'B' || key0_showValue == 'B') {
        _this.$set(nodeTabLists[1], "editstate", "H");
        _this.$set(nodeTabLists[2], "editstate", "S");
    } else {
        _this.$set(nodeTabLists[1], "editstate", "H");
        _this.$set(nodeTabLists[2], "editstate", "H");
    }

    var key1_applyValue = nodeTabLists[3].nodeTableLists[0].applyvalue;
    var key1_showValue = nodeTabLists[3].nodeTableLists[0].showValue;

    var showNodesObj1 =  nodeTabLists[3].nodeTableLists[1];
    var showNodesObj2 =  nodeTabLists[3].nodeTableLists[2];

    if (key1_applyValue == 'A' || key1_showValue == 'A') {
        _this.$set(showNodesObj1, "editstate", "R");
        _this.$set(showNodesObj2, "editstate", "H");
    } else if (key1_applyValue == 'B' || key1_showValue == 'B') {
        _this.$set(showNodesObj1, "editstate", "H");
        _this.$set(showNodesObj2, "editstate", "R");
    } else {
        _this.$set(showNodesObj1, "editstate", "H");
        _this.$set(showNodesObj2, "editstate", "H");
    }
}

function yzInput(){
    console.log(111111);
}