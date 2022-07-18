<!--公用组件：按钮
/**
* 按钮组件
* @desc 显示分页组件
* @author yanzy
* @date 2019.06.12
* @param {String} [paginationObj]
    {
        total: 0, // 总条数
        currentPage: 1, // 当前页
        pageSizes: [], // 每页显示个数选择器的下拉框类名
        pageSize: 5, // 每页显示条数
        layout: 'prev, pager, next, jumper, sizes, total', // 组件布局
        small: false, // 是否显示小型分页
        background: false, // 是否为分页添加背景色
        popperClass: '', // 每页显示个数选择器的下拉框类名
        prevText: '后退1', // 替代图标显示的上一页文字
        nextText: '前进1', // 替代图标显示的下一页文字
        disabled: false, // 是否禁用
        hidePage: false // 只有一页时是否隐藏
    }
* @example 调用示例
    <portal-pagination
    :paginationObj='pagination'
    @handleSizeChange="SizeChange"
    @handleCurrentChange="CurrentChange">
    </portal-pagination>
*/
-->