// 路由缓存管理
export default {
    computed: {
        keepAliveConf(){
          return this.$store.state.app.keepAliveList;
        }
    },
    watch:{
      keepAliveConf(e){
        let name = this.$route.name;
        // 监听缓存列表的变化，如果缓存列表中没有当前的路由或组件则在缓存中销毁该实例
        if(!e.split(',').includes(name)) {
          // this.$destroy()
        }
      }
    },
}