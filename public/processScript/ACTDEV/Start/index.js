
//
/*
_this指向vue实例，可调用其相关方法
obj为触发input事件传递过来的相关参数
_this.$store.commit('app/setBizData',{})
*/

//页面加载完成
function ready() {
  let _this = arguments[0]
  let node = arguments[1]
  _this.$message.error('start 加载完成')
}
//自定义事件方法
function handle (){
    let _this = arguments[0]    
    let Obj = arguments[1]
    _this.$message.error('失去焦点'+Obj.AAA)
    _this.$store.commit('app/setBizData',{
        'BBB':{
            showValue:Obj.AAA,
            value:Obj.AAA
        },
        'CCC':{
            showValue:Obj.AAA,
            value:Obj.AAA
        },
        'COMMENTS':{
            showValue:Obj.AAA,
            value:Obj.AAA
        }
    })
}