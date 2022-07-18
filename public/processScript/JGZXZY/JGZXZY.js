//测试页面加载完成
var $
function readyP () {
    var _this = arguments[0]
    var nodeTabLists = arguments[1].nodeTabLists
    $ =  arguments[3]
    _this.$message.error('公共加载成功')
    $('#form').before('<div style="color:red">标注</div>')
}
