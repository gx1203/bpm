<template>
  <div id="analysisReport">
    <div class="reportWrap">
      <h4 class="reporTitle">
        {{ $t('analysisReport') }}
      </h4>
      <el-row class="margin-b20 searchWrap">
        <el-date-picker
          v-model="yearValue"
          type="year"
          format="yyyy"
          value-format="yyyy"
          :placeholder="$t('placeholderText.selectYear')"
          :title="$t('placeholderText.selectYear')"
          style="width: 100px"
          class="float-l"
        />
        <select-month
          style="vertical-align: middle;"
          class="float-l"
          monthState="8"
          @getSeason="getMonthTime"
        />
        <el-button
          class="float-l"
          type="primary"
          style="margin-left:10px;"
          @click="getData"
          >{{ $t('query') }}</el-button
        >
      </el-row>
      <el-table :data="reportList" size="small" class="w100">
        <el-table-column
          type="index"
          :label="$t('number')"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="报告"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <a
              :href="scope.row.viewurl"
              target="_blank"
              style="color: #3141a9;"
              >{{ scope.row.name }}</a
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="periodName"
          label="报告版本"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="createon"
          label="报告生成时间"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="scope"
          label="报告范围"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button
              style="background-color: #ffffff"
              type="text"
              circle
              icon="el-icon-download"
              @click="downLoad(scope.row)"
            >
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pages.pageNum"
        :page-size="pages.pageSize"
        background
        layout="prev, pager, next, jumper, total"
        :total="pages.total"
        class="margin-t15"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import { queryReport } from '@/bpa/api/analyseWatchCenter'
import selectMonth from '../../../components/SelectMonth.vue'
import { getFormateDate } from '@/bpa/utils/common'
export default {
  components: {
    selectMonth
  },
  data() {
    return {
      yearValue: '',
      monthValue: '',
      reportList: [{}],
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getMonthTime(data) {
      this.monthValue = data
      let yearData
      const date = new Date()
      if (this.monthValue === 12 || this.monthValue === '12') {
        yearData = getFormateDate(
          new Date((date.getFullYear() - 1).toString()),
          'yyyy'
        )
        this.yearValue = yearData
      }
    },
    downLoad(item) {
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/electronicSignature/download/${item.fileId}?attachmentType=bpm`
      console.log(link.href)
      link.setAttribute('download', '')
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(link.href)
    },
    handleCurrentChange(val) {
      this.pages.pageNum = val
      this.getData()
    },
    getData() {
      let obj = {
        filters: [
          { key: 'month_num', opt: 'EQ', type: 'S', value: this.monthValue },
          { key: 'year_num', opt: 'EQ', type: 'S', value: this.yearValue }
        ],
        logic: 'and',
        orderby: 'createon',
        pageNum: this.pages.pageNum,
        pageSize: 10,
        sort: 'desc'
      }
      queryReport(obj).then(res => {
        if (!res) return false
        this.reportList = res.list
        this.pages.total = res.total
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.reportWrap {
  min-height: calc(100vh - 140px);
  margin-top: 20px;
  padding: 30px;
  box-sizing: border-box;
  background: url('../../../assets/img/qietu/zdlcbzh-cd.png') no-repeat;
  // background: url("../../../assets/img/qietu/borderImg.png") no-repeat;
  background-size: 100% 100%;
  .reporTitle {
    line-height: 30px;
    margin: 0 0 20px 20px;
    padding-left: 10px;
    color: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    border-left: 3px solid #00f6ff;
    box-sizing: border-box;
  }
  .searchWrap {
    overflow: hidden;
  }
  /deep/ .el-input__inner {
    background-color: transparent;
  }
}
/deep/.el-table {
  color: #fff;
  background-color: transparent;
  thead {
    color: #3141a9;
    font-weight: 700;
  }
  & td,
  & th.is-leaf {
    border-bottom: 1px solid #4d576f;
  }
  & th,
  & tr {
    background-color: transparent;
  }
  &:before {
    background-color: #4d576f;
  }
}
/deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: rgba(13, 45, 74, 0.5);
}
</style>
