export default {
  methods: {
    singleSearch() {
      this.pages.pageNum = 1
      this.getList()
    },
    handleSizeChange(item) {
      // 一页最大显示数量
      this.pages.pageSize = item
      this.getList()
    },
    handleCurrentChange(item) {
      console.log(item)
      this.pages.pageNum = item
      this.getList()
    },
    resetSearch() {
      this.pages.pageNum = 1
      this.searchForm = {}
      this.getList()
    }
  }
}
