<!--公用组件：导出按钮
/**
* 按钮组件
* @desc 导出按钮
* @author zhangyuting
* @date 2019.06.12
    https://panjiachen.github.io/vue-element-admin-site/zh/feature/component/excel.html#excel-%E5%AF%BC%E5%87%BA
    https://segmentfault.com/a/1190000012117303
* @安装依赖  npm install xlsx file-saver -S
            npm install script-loader -S -D
            npm install xlsx --save 
  引入文件   src//vendor/Export2Excel.js
*
* @param {String} [] // swiper 参数
    {
      tHeader: ['组织名称', '维度', '维度查看', '知识上传'],  // 首行标题名称
      filterVal: ['title', 'applyusername', 'accepttime', 'accepttime'],  // 导出数据对应的字段
      exportdata: []  // 所需要导出的数据
    }
* @example 调用示例
    <portal-export :options="exportdata"/>
*/
-->