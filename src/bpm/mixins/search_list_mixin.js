export default {
  data() {
    return {
      loading: false,
      isPowerSearch: false,
      searchForm: {},
      searchType: 'power',
      filters: [],
      quickData: {},
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      sort: {},
      content: {
        total: 0
      },
      isDateList: [
        'reqDate',
        'createon',
        'updateon',
        'assignedDate',
        'passReadTime',
        'startTime',
        'passReadTime',
        'prevFireTime',
        'uploadtime',
        'changedate',
        'createDate',
        'createtime',
        'updateDate',
        'updatedate',
        'deleteDate',
        'reqdate',
        'receipttime',
        'creationdate',
        'reqdate',
        'operationTime',
        'rtime'
      ]
    }
  },
  methods: {
    // 单个搜索
    quickSearch(data) {
      this.quickData = data
      this.searchType = 'quick'
      this.page.pageNum = 1
      this.filters = []
      // this.filterData(data)
      this.quickQueryData()
    },
    // 高级搜索
    powerSearch() {
      this.searchType = 'power'
      this.page.pageNum = 1
      if (this.$refs.quick) {
        this.$refs.quick.quickReset() // 清除快速查询
      }
      this.filterData(this.searchForm)
      this.getData()
    },
    // 搜索过滤
    filterData(obj) {
      this.filters = []
      Object.keys(obj).forEach(key => {
        const filter = {
          key,
          opt: 'LIKE',
          type: 'S',
          value: obj[key]
        }
        if (this.isDateList.includes(key)) {
          filter.type = 'D'
          filter.opt = 'BETWEEN'
          if (obj[key] && obj[key].length !== 0) {
            // let time = new Date(obj[key][1])
            // time = time.setDate(time.getDate() + 1)
            // time = new Date(time)
            // obj[key][1] = time.toLocaleDateString().replace(/\//g, '-')
            filter.value = obj[key] ? obj[key].join('~') : null
          } else {
            filter.value = null
          }
        }
        if (filter.value) {
          this.filters.push(filter)
        }
      })
    },
    // 重置
    rest() {
      this.searchKey = ''
      this.page.pageNum = 1
      this.dateRange = {
        value: '',
        list: []
      }
      this.searchForm = {}
      this.powerSearch()
    },
    elHandleSort(data) {
      if (data.order) {
        this.sort.orderby = data.prop
        this.sort.sort = data.order === 'descending' ? 'desc' : 'asc'
      } else {
        this.sort = {}
      }
      if (this.searchType === 'power') {
        this.getData()
      } else if (this.searchType === 'quick') {
        this.quickQueryData()
      }
    },
    handleSort(val) {
      if (val.sort) {
        this.sort = val
      } else {
        this.sort = {}
      }
      if (this.searchType === 'power') {
        this.getData()
      } else if (this.searchType === 'quick') {
        this.quickQueryData()
      }
    }
  }
}
