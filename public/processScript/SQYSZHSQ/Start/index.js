function checkuser(_this, obj) {
    var re = /^(?![^a-zA-Z]+$)(?!\D+$)/; //判断字符串是否为数字和字母组合     
    if (!re.test(obj.ACCOUNT)) {
        _this.$message.error('只能以字母开头，只能是字母+数字组合')
        return false;
    }
    var ree = /[a-zA-Z]/g
    if (!ree.test(obj.ACCOUNT[0])) {
        _this.$message.error('只能以字母开头，只能是字母+数字组合')
        return false;
    }
    // if (!re.test(obj.ACCOUNT)) {
    //     _this.$message.error('只能以字母开头，只能是字母+数字组合')
    //     return false;
    // } else {
    //     _this.$message('ok')
    //     return true;
    // }
}