<template>
  <el-pagination
    :current-page.sync="paginationObj.currentPage"
    :page-sizes="paginationObj.pageSizes"
    :page-size="paginationObj.pageSize"
    :layout="paginationObj.layout"
    :total="paginationObj.total"
    :small="paginationObj.small"
    :background="paginationObj.background"
    :popper-class="paginationObj.popperClass"
    :prev-text="paginationObj.prevText"
    :next-text="paginationObj.nextText"
    :disabled="paginationObj.disabled"
    :hide-on-single-page="paginationObj.hidePage"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>
<script>
export default {
  name: 'PortalPagination',
  props: {
    paginationObj: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: () => {
        return {
          total: 0, // 总条数
          currentPage: 1, // 当前页
          pageSizes: [], // 每页显示个数选择器的下拉框类名
          pageSize: 5, // 每页显示条数
          layout: '"prev, pager, next, jumper, total"', // 组件布局
          small: false, // 是否显示小型分页
          background: true, // 是否为分页添加背景色
          popperClass: '', // 每页显示个数选择器的下拉框类名
          prevText: '后退1', // 替代图标显示的上一页文字
          nextText: '前进1', // 替代图标显示的下一页文字
          disabled: false, // 是否禁用
          hidePage: false // 只有一页时是否隐藏
        }
      }
    }
  },
  data() {
    return {
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val)
    },
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val)
    }
  }
}
</script>

