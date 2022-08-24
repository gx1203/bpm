var _this
var node
//测试页面加载完成
function readyP() {
  _this = arguments[0];
  node = arguments[1];
}

function selectChange() {
  let _this = arguments[0]
  let thisNode = arguments[2]

  var key = "XLK11"; // 监听的对象 fieldName
  var disKey = ["WBK12","WBK22"]; // 需要判断是否禁用的对象 fieldName
  var nodeTableLists = thisNode.nodeTabLists[0].nodeTableLists;

  nodeTableLists.forEach((item, index) => {
    // 判断是否是需要找的数据
    if (item.fieldName == key && item.inputType == 'select') {

      var remark = item.remark;
      var applyvalue = item.applyvalue;
      var showValue = item.showValue;

      // 判断是否是存在remark
      if (typeof (remark) != 'undefined') {
        var remarkArr = remark.split(",");

        let flag = remarkArr.findIndex(item => item == applyvalue);
        let flag2 = remarkArr.findIndex(item => item == showValue);

        if (flag > -1 || flag2 > -1) {
          // 循环禁用输入框，赋值为空
          disKey.forEach((disItem) => {
            nodeTableLists.forEach((subItem) => {
              if (subItem.fieldName == disItem) {
                _this.$set(subItem, "editstate", "R");
                _this.$set(subItem, "applyvalue", "");
                _this.$set(subItem, "showValue", "");
              }
            })
          })
        }else{
          // 循环解除禁用的输入框
          disKey.forEach((disItem) => {
            nodeTableLists.forEach((subItem) => {
              if (subItem.fieldName == disItem) {
                _this.$set(subItem, "editstate", "W");
              }
            })
          })
        }

      }
    }
  });

}

