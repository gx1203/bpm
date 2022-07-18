<!--公用组件：省市区级联
/**
* 按钮组件
* @desc 显示地区级联（使用的是懒加载方式，和一般的级联不通用）
* @author yanzy
* @date 2019.08.15
* @param {String} [paginationObj]
    {
        value: '' // 绑定值(值不能双向绑定)
        placeholder: '你瞅啥',
        disabled: false, // 禁用
        size: 'mini', // medium / small / mini 说的是整体的放大缩小比例
        clearable: false, // 是否支持清空选项
        showAllLevels: true, // 输入框中是否显示选中值的完整路径
        separator: '-', // 选项分隔符与showAllLevels不能同时生效
        popperClass: '', // 自定义浮层类名(在顶层设置样式)
        selectClass: '', // 自定义select样式
        leaf: 4 // 展示箭头层级
    }
* @example 调用示例
    <ec-area-picker
      :options="options"
      @chosedArea="fun"/>
*/
-->