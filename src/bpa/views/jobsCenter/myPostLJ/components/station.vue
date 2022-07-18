<template>
  <div id="station">
    <div class="pad-10px pad-t15px h100">
      <el-row>
        <el-col :span="4" :offset="20" style="text-align: right;margin-bottom: 10px">
          <el-button
            :loading="downloadLoading"
            size="mini"
            type="primary"
            plain
            icon="el-icon-download"
            @click="WordExport"
          >导出</el-button>
        </el-col>
      </el-row>
      <el-scrollbar class="h100">
        <el-table
          :data="resultData"
          :span-method="objectSpanMethod"
          border
          class="main_tab">
          <el-table-column
            prop="undefined"
            width="150"
            label="工作项目">
          </el-table-column>
          <el-table-column
            prop="nodename"
            width="100"
            label="工作内容">
          </el-table-column>
          <el-table-column
            prop="worktimerequire"
            label="工作时间要求">
          </el-table-column>
          <el-table-column
            prop="workresults"
            label="工作成果">
          </el-table-column>
          <el-table-column
            prop="workResultsFileDto"
            :label="$t('attachment')">
            <template slot-scope="scope">
              <p v-if="scope.row.workResultsFileDto && scope.row.workResultsFileDto.length > 0" v-for="(item, index) in scope.row.workResultsFileDto"
                   :key="index"
                   :value="item.newName">
                <a :href="viewFile(item.id)" target="_blank">{{item.newName}}</a>
                <a class="margin-l5" :href="downloadFile(item.id)" target="_blank">
                  
                </a>
              </p>
            </template>
          </el-table-column>
          <el-table-column
            prop="listname"
            label="相关流程或制度">
          </el-table-column>
          <el-table-column
            prop="raci"
            width="80"
            label="RACI">
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { getStationlists, exportWord } from '@/bpa/api/jobsCenter'
import { viewFile, downloadFile} from '@/bpa/utils/common'
import fileOperation from '@/bpa/mixins/fileDownView'
export default {
  name: 'station',
  data() {
    return {
      processList: [],
      resultData: [],
      downloadLoading: false,
      tHeader: ['工作项目', '工作内容', '工作时间要求', '工作成果', '相关流程或制度', 'RACI'],
      filterVal: ['undefined', 'nodename', '', '', '', 'raci']
    }
  },
  mixins: [fileOperation],
  computed: {
    userid() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .empuid
    },
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    }
  },
  props: {
    orgIds: {
      type: String,
      default: ''
    }
  },
  watch: {
    orgIds: {
      handler (obj) {
        console.log(obj)
        if (obj) {
          this.getProcesslists(obj)
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    getProcesslists (val) {
      getStationlists(val).then(res => {
        if (!res) return false
        this.resultData = res
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) { // 对第一列 第二列 进行合并
      // if (columnIndex === 1 || columnIndex === 0) {
      if (columnIndex === 0) {
        // 当 当前行与上一行内容相同时 返回0 0 意味消除 并且listid一样
        if (rowIndex > 0 && row['undefined'] === this.resultData[rowIndex - 1]['undefined'] && row['listid'] === this.resultData[rowIndex - 1]['listid']) {
          return {
            rowspan: 0,
            colspan: 0
          }
        } else {
          let rows = 1
          // 反之 查询相同的内容有多少行 进行合并
          for (let i = rowIndex; i < this.resultData.length - 1; i++) {
            // console.log(row[column.property])
            if (row['undefined'] === this.resultData[i + 1]['undefined'] && row['listid'] === this.resultData[i + 1]['listid']) {
              rows++
            }
          }
          // 返回相同内容的行数
          return {
            rowspan: rows,
            colspan: 1
          }
        }
      }
    },
    // 导出excel
    Excelexport() {
      console.log(this.resultData)
      this.downloadLoading = true
      import('@/bpa/vendor/Export2Excel').then(excel => {
        const tHeader = this.tHeader
        const filterVal = this.filterVal
        const data = this.formatJson(filterVal, this.resultData)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '我的岗位'
        })
        setTimeout(() => {
          this.downloadLoading = false
        }, 2 * 1000)
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          // if (j === 'timestamp') {
          //   return parseTime(v[j])
          // } else {
          //   return v[j]
          // }
          return v[j]
        })
      )
    },
    WordExport () {
      exportWord(this.orgIds).then(res => {
        window.open(res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  *{
    box-sizing: border-box;
  }
  #station {
    height: calc(100vh - 200px);
    /deep/ .el-scrollbar__wrap{
      padding: 0!important;
    }
  }
</style>
