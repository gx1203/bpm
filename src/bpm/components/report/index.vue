<template>
  <el-card shadow="never" class="card-reset-inner">
    <div class="tool-common-wrap">
      <div class="btn-wrap">
        <el-button
          type="primary"
          @click="excelFile"
          :disabled="searchFormList.length === 0"
        >
          {{ $t('exportToExcel') }}
          <!--<i class="el-icon-download" />-->
        </el-button>
        <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
          {{ $t('advancedQuery') }}
          <i
            :class="
              isPowerSearch ? 'el-icon-caret-top' : 'el-icon-caret-bottom'
            "
          />
        </el-button>
        <el-button type="primary" @click="getData">
          {{ $t('refresh') }}
          <!---->
        </el-button>
      </div>
    </div>
    <el-form
      class="power-search"
      :model="searchForm"
      @keyup.enter.native="search"
      ref="searchForm"
      label-width="120px"
      size="mini"
      v-if="isPowerSearch"
    >
      <el-row>
        <el-col
          :span="8"
          style="height:47px"
          v-for="(item, index) in searchFormList"
          :key="index"
        >
          <el-form-item v-if="item.type === 'STRING'" :label="item.showname">
            <el-input
              clearable
              type="text"
              v-if="!item.dsList"
              :placeholder="$t('pleaseWrite') + item.showname"
              v-model="item.value"
            ></el-input>
            <el-select
              v-else
              filterable
              clearable
              multiple
              v-model="item.value"
              :placeholder="$t('pleaseWrite') + item.showname"
              style="width:100%;"
            >
              <el-option
                v-for="val in item.dsList"
                :key="val.value"
                :label="val.text"
                :value="val.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="item.type === 'NUMBER'" :label="item.showname">
            <el-input
              type="number"
              v-if="!item.dsList"
              :placeholder="$t('pleaseWrite') + item.showname"
              v-model="item.value"
            ></el-input>
          </el-form-item>
          <el-form-item v-else-if="item.type === 'DATE'" :label="item.showname">
            <el-date-picker
              v-model="item.value"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              :range-separator="$t('placeholderText.to')"
              :start-placeholder="$t('placeholderText.startDate')"
              :end-placeholder="$t('placeholderText.endDate')"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="text-r">
          <el-button type="primary" @click="search">{{
            $t('query')
          }}</el-button>
          <el-button type="primary" @click="rest">{{ $t('reset') }}</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div id="out-table" class="tableWrap margin-t10">
      <el-table
        v-loading="loading"
        :data="content.list"
        style="width: 100%"
        border
        :header-cell-style="{ background: '#E1EAFD' }"
        @sort-change="handleSort"
      >
        <el-table-column
          v-for="(item, index) in headers"
          :key="index"
          :prop="item.key"
          :label="item.name"
          sortable="custom"
          min-width="180"
        >
          <template slot-scope="scope">
            <div
              class="link"
              @click="toFlow(scope.row)"
              v-if="item.linkshow === 'Y'"
            >
              {{ getTime(item,scope.row[item.key]) }}
            </div>
            <div v-else>{{ getTime(item,scope.row[item.key]) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          v-if="data.report && data.report.type === 'process'"
          :label="$t('flowChart')"
          width="100"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="getInstanceImage(scope.row.INSTID)">
              <i class="iconfont icon-liuchengtu" style="font-size: 20px"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      style="margin-top: 15px"
      :page-size="page.pageSize"
      :current-page.sync="page.pageNum"
      background
      @current-change="getData"
      :total="content.total"
    ></el-pagination>
    <InstanceImageDialog v-model="dialogVisible" :instanceId="instanceId" />
    <!-- <p class="text-r">
      导出选项：
      <el-button type="text" icon="el-icon-sold-out">Excel</el-button>
    </p>-->
  </el-card>
</template>
<script>
import { getSearchResult } from '@/bpm/api/monitor/report'
import { getFormateDate } from '@/bpm/utils/common'
import axios from 'axios'
import InstanceImageDialog from '@/bpm/components/instanceimage/InstanceImageDialog'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('app')
export default {
  components: {
    InstanceImageDialog
  },
  data() {
    return {
      isPowerSearch: false,
      searchForm: {},
      dialogVisible: false,
      sort: {},
      page: {
        pagenum: 1,
        pagesize: 10
      },
      content: {},
      instanceId: '',
      filters: [],
      loading: false,
      editItem: {},
      searchFormList: [],
      tableList: [],
      headers: [],
      nodes: {}
    }
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters(['curModule'])
  },
  watch: {
    data: {
      handler: function(val) {
        console.log(val)
        if (val.searchList && val.showList && val.report) {
          let subNodes = []
          this.getPath(this.curModule.subNodes, subNodes)
          this.nodes = subNodes.find(
            item => item.url === `projectApproval?id=${this.$route.query.id}`
          )
          this.searchFormList = JSON.parse(JSON.stringify(val.searchList))
          this.tableList = JSON.parse(JSON.stringify(val.showList))
          this.headers = []
          this.tableList.forEach(item => {
            if (item.fieldname !== 'REQNO') {
              this.headers.push({
                key: item.fieldname,
                name: item.showname,
                linkshow: item.linkshow,
                type: item.type,
                // width: 'width:330px',
                span: 4
              })
            }
          })
          console.log('tableList', this.tableList)
          console.log('headers', this.headers)
          if (val.report.type === 'process') {
            // this.headers.push({
            //   name: "流程图",
            //   span: 3
            // });
          }
          this.getData()
        }
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    getFormateDate,
    getTime(headersitem,value) {
      if (value && headersitem.type === 'DATE') {
        return this.getFormateDate(new Date(value), 'yyyy-MM-dd hh:mm:ss')
      }
      return value
    },
    getPath(list, subNodes) {
      for (let i = 0, len = list.length; i < len; i++) {
        let item = list[i]
        subNodes.push(item)
        if (item.subNodes && item.subNodes.length > 0) {
          this.getPath(item.subNodes, subNodes)
        }
      }
    },
    toFlow(item) {
      let routeData = {}
      routeData = this.$router.resolve({
        name: 'processFormView',
        query: {
          name: item.processCnname,
          instanceId: item.INSTID
        }
      })
      // window.open(routeData.href, "_blank");
      let a = document.createElement('a')
      // 给创建好的a标签赋值
      a.setAttribute('href', routeData.href)
      // 设置css 隐藏属性
      a.setAttribute('style', 'display:none')
      // 设置 a标签为新窗口打开
      a.setAttribute('target', '_blank')
      // 将设置好的a标签，添加到 body 内
      document.body.appendChild(a)
      // 模拟点击
      a.click()
      // 移除a标签
      a.parentNode.removeChild(a)
    },
    excelFile() {
      axios({
        method: 'post',
        url: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/report/exportSearchResult/${this.$route.query.id}`,
        data: {
          attr: {
            menuId: this.nodes.id
          },
          logic: 'and',
          filters: this.filters,
          ...this.sort
        },
        headers: {
          token: sessionStorage.getItem('token')
        },
        responseType: 'arraybuffer'
      })
        .then(res => {
          console.log(res)
          let _this = this
          let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(
              blob,
              _this.data.report.name + '.xls'
            )
          } else {
            var a = document.createElement('a')
            document.body.appendChild(a)
            a.style = 'display: none'
            var url = window.URL.createObjectURL(blob)
            a.download = _this.data.report.name
            a.href = url
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)
          }
        })
        .catch(() => {})
    },
    getInstanceImage(id) {
      this.instanceId = id
      this.dialogVisible = true
    },
    // 获取数据
    getData() {
      this.loading = true
      getSearchResult({
        id: this.$route.query.id,
        data: {
          attr: {
            menuId: this.nodes.id
          },
          logic: 'and',
          filters: this.filters,
          ...this.sort,
          ...this.page
        }
      })
        .then(rt => {
          this.loading = false
          this.content = rt.data || []
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleSort(column) {
      let sort = ''
      if (column.order === 'ascending') {
        sort = 'asc'
      } else if (column.order === 'descending') {
        sort = 'desc'
      }
      let val = {
        orderby: column.prop,
        sort: sort
      }
      this.sort = val
      this.getData()
    },
    // 搜索
    search() {
      this.filters = []
      Object.keys(this.searchFormList).forEach(key => {
        const filter = {
          key: this.searchFormList[key].fieldname,
          opt: 'LIKE',
          type: 'S',
          value: this.searchFormList[key].value
        }

        if (this.searchFormList[key].dsList) {
          filter.opt = 'IN'
          filter.type = 'S'
          filter.value =
            this.searchFormList[key].value.length !== 0
              ? this.searchFormList[key].value.join(',')
              : ''
        }
        if (this.searchFormList[key].type === 'DATE') {
          filter.type = 'D'
          filter.opt = 'BETWEEN'
          filter.value = this.searchFormList[key].value
            ? this.searchFormList[key].value.join('~')
            : ''
        }
        this.filters.push(filter)
      })
      this.getData()
    },
    // 重置
    rest() {
      Object.keys(this.searchFormList).forEach(key => {
        this.$set(this.searchFormList[key], 'value', '')
      })
      this.search()
    }
  }
}
</script>
<style type="text/scss" lang="scss" scoped>
.table-header {
  position: relative;
  background: $bc2;
  display: flex;
  align-items: center;
  .all-check {
    position: absolute;
    left: 10px;
    top: 10px;
  }
}

#out-table {
  overflow: auto;
}
.td {
  display: inline-block;
}
</style>
<style type="text/scss" lang="scss">
#out-table {
  .el-table .ascending .sort-caret.ascending {
    border-bottom-color: red;
  }
  .el-table .descending .sort-caret.descending {
    border-top-color: red;
  }
}
</style>
