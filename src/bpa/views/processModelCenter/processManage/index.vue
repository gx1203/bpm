<template>
  <div id="trainRecords" class="pageWrap">
    <el-form :model="params" label-width="100px">
      <div class="listContent w100 pos-relative">
        <div class="right-content">
          <el-row
            style="position: absolute;top: 0;z-index: 99;width: 100%;background: #fff;"
          >
            <el-col :span="10">
              <el-form-item label="业务板块">
                <el-select
                  style="width: 80%;"
                  clearable
                  v-model="busTemplate"
                  multiple
                  :placeholder="$t('pleaseSelect')"
                >
                  <el-option
                    v-for="item in busTemplate0pt"
                    :key="item.name"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
                <el-button
                  style="padding: 7px 10px;font-size: 12px; border-radius:0;"
                  :loading="downloadLoading"
                  size="mini"
                  type="primary"
                  @click="getList"
                  >{{ $t('search') }}</el-button
                >
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <div class="globalSearch">
                <el-row>
                  <el-col
                    :span="12"
                    style="border-right: 1px solid #d3d3d3;margin-top: 3px;text-align: center;"
                  >
                    <span v-if="searchVal"
                      >{{ searchhead }}/{{ searchLength }}</span
                    >
                  </el-col>
                  <el-col :span="12">
                    <i class="el-icon-arrow-up" @click="retrieval('-')"></i>
                    <i class="el-icon-arrow-down" @click="retrieval('+')"></i>
                  </el-col>
                </el-row>
                <el-input
                  @keyup.enter.native="getList"
                  v-model="searchVal"
                  :placeholder="
                    $t('placeholderText.pleaseEnterSearchContent')
                  "
                >
                </el-input>
              </div>
            </el-col>
            <!-- <el-col :span="2" :offset="1">
              <el-button type="primary">{{$t('GlobalReplacement')}}</el-button>
            </el-col> -->
            <el-col
              :span="4"
              :offset="3"
              style="text-align: right;margin-bottom: 10px"
            >
              <el-button
                :loading="downloadLoading"
                size="mini"
                icon="el-icon-download"
                @click="Excelexport"
                >{{ $t('exportToExcel') }}
              </el-button>
            </el-col>
          </el-row>
          <el-table
            :data="reportConfigList"
            class="main_tab"
            id="tabList"
            style="margin-top: 40px;"
          >
            <el-table-column
              :label="$t('number')"
              type="index"
            ></el-table-column>
            <el-table-column
              width="130"
              :key="item.id"
              v-for="item in reportList"
              :label="item.name"
              :prop="item.pname"
            >
              <template slot-scope="scope">
                <div v-html="scope.row[item.pname]"></div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pages.pageNum"
            :page-size="pages.pageSize"
            background
            layout="prev, pager, next, jumper, total"
            :total="pages.total"
          ></el-pagination>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getCardlist, getAllListMessage } from '@/bpa/api/settings/processCard'
import { getFirstProcess } from '@/bpa/api/doorCenter'
import paginations from '@/bpa/mixins/pagination_mixin'
import fileOperation from '@/bpa/mixins/fileDownView'
import { viewFile, downloadFile } from '@/bpa/utils/common'
import { uploadFile, deluploadFile } from '@/bpa/api/common'
import cookie from 'js-cookie'
export default {
  data() {
    return {
      searchhead: 0,
      searchLength: 0,
      dialogVisible: false,
      searchVal: '',
      downloadLoading: false,
      tHeader: [],
      filterVal: [],
      reportConfigList: [],
      reportList: [],
      reportAllList: [],
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      busTemplate0pt: [],
      busTemplate: [],
      params: {
        id: '',
        pagenum: 1,
        keyWord: '',
        pagesize: 10
      },
      allParams: {
        attr: {},
        filters: [
          { key: 'name', opt: 'LIKE', type: 'S', value: '流程基本属性' },
          { key: 'state', opt: 'LIKE', type: 'S', value: '' },
          { key: 'sheetname', opt: 'LIKE', type: 'S', value: '流程基本属性' },
          { key: 'type', opt: 'LIKE', type: 'S', value: '0' }
        ],
        logic: 'or',
        orderby: 'rank',
        pageNum: 1,
        pageSize: 10000,
        sort: 'desc'
      },
      userId: cookie.get('username')
    }
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    action() {
      return `${this.host}/attach/upload?username=${this.userId}`
    },
    download() {
      return this.host + '/attach/download/'
    },
    viewfile() {
      return this.host + '/document/print/'
    }
  },
  mixins: [paginations, fileOperation],
  mounted() {
    this.getList()
    this.getAllList()
    this.getALLExportList()
    this.getTemplateList()
  },
  methods: {
    retrieval(type) {
      if (this.searchLength > 0) {
        if (type === '+') {
          if (this.searchhead < this.searchLength) {
            this.searchhead += 1
          } else {
            this.searchhead = 1
          }
        } else {
          if (this.searchhead <= 1) {
            this.searchhead = this.searchLength
          } else {
            this.searchhead -= 1
          }
        }
        const elements = document.getElementsByClassName('seachGlo')
        for (let index = 0; index < this.searchLength; index++) {
          elements[index].classList.remove('seachGloActive')
        }
        elements[this.searchhead - 1].classList.add('seachGloActive')
        elements[this.searchhead - 1].scrollIntoView(false)
      }
    },
    replaceTxt(val) {
      return val.replace(
        new RegExp(this.searchVal, 'g'),
        '<a class="seachGlo" >' + this.searchVal + '</a>'
      )
    },
    getList() {
      // 获取表格内的数据
      this.params.keyWord = this.searchVal
      this.params.id = this.busTemplate.join(',')
      this.params.pagenum = this.pages.pageNum
      this.params.pagesize = this.pages.pageSize
      getAllListMessage(this.params).then(res => {
        if (this.searchVal) {
          res.list.forEach(element => {
            for (let key in element) {
              element[key] = this.replaceTxt(element[key])
            }
          })
        }
        this.reportConfigList = res.list
        this.pages.total = res.total
        this.$nextTick(() => {
          const elements = document.getElementsByClassName('seachGlo')
          this.searchLength = elements.length
          // 刷新数据后重置
          this.searchhead = 0
          for (let index = 0; index < this.searchLength; index++) {
            elements[index].classList.remove('seachGloActive')
          }
        })
      })
    },
    getTemplateList() {
      getFirstProcess().then(res => {
        if (!res) return false
        console.log(res)
        this.busTemplate0pt = res
      })
    },
    getALLExportList() {
      // 获取所有的表头
      getAllListMessage({
        id: '',
        pagenum: 1,
        pagesize: 1000
      }).then(res => {
        console.log('🍓1', res)
        this.reportAllList = res.list
      })
    },
    // 获取所有的表头
    getAllList() {
      // 获取表格内的数据
      getCardlist(this.allParams).then(res => {
        // this.reportAllList = res.list
        this.reportList = []
        this.tHeader = []
        this.filterVal = []
        res.list.forEach(item => {
          if (item.condition === 'Y') {
            this.reportList.push(item)
          }
          // if (item.status === 'Y') {
          //   this.tHeader.push(item.name)
          //   this.filterVal.push(item.pname)
          // }
          this.tHeader.push(item.name)
          this.filterVal.push(item.pname)
        })
        this.reportList = this.sortarr(this.reportList)
        console.log(this.reportList)
      })
    },
    sortarr(arr) {
      for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
          /**
           * 比较第j位和j+1的initial值
           * 如果j位的initial值比j+1位的initial值大，那么他们的位置发生交换
           * 如果j位的initial值比j+1位的initial值小，那么位置不变
           */
          if (Number(arr[j].rank) > Number(arr[j + 1].rank)) {
            var temp = arr[j]
            arr[j] = arr[j + 1]
            arr[j + 1] = temp
          }
        }
      }
      return arr
    },
    // 导出excel
    Excelexport() {
      this.getAllList()
      this.downloadLoading = true
      import('@/bpa/vendor/Export2Excel').then(excel => {
        const multiHeader = [[]]
        const tHeader = this.tHeader
        const filterVal = this.filterVal
        const data = this.formatJson(filterVal, this.reportAllList)
        console.log(Math.floor(tHeader.length / 2))
        for (let R = 0; R < tHeader.length; R++) {
          if (R === Math.floor(tHeader.length / 2)) {
            multiHeader[0].push('表单模板')
          } else {
            multiHeader[0].push('')
          }
        }
        excel.export_json_to_excel({
          multiHeader,
          header: tHeader,
          data,
          filename: '流程台账'
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
    }
  }
}
</script>

<style lang="scss" scoped>
#trainRecords {
  background-color: white;
  position: relative;
  .globalSearch {
    position: relative;
    /deep/ .el-row {
      right: 0;
      position: absolute;
      width: 130px;
      z-index: 9;
      top: 0;
    }
    /deep/ .el-input__inner {
      // height: 35px;
      padding-right: 140px;
    }
    i {
      margin-left: 2px;
      padding: 6px;
      font-size: 16px;
      cursor: pointer;
    }
  }
  /deep/ .seachGlo {
    background: yellow;
    color: #000;
  }
  /deep/ .seachGloActive {
    background: #fbb36d;
    color: #000;
  }
  .fileItem {
    position: relative;
    display: inline-block;
    vertical-align: top;
    padding: 0 20px 0 5px;
    margin-bottom: 5px;
    margin-right: 5px;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
    i {
      position: absolute;
      right: 2px;
      top: 0;
      bottom: 0;
      margin: auto;
      height: 14px;
      cursor: pointer;
    }
  }
  .right-content {
    height: 100%;
    /*.el-scrollbar__wrap{*/
    /*height: 100%;*/
    /*}*/
    /*.el-scrollbar__view{*/
    /*height: 100%;*/
    /*}*/
  }
  /*附件部分*/
  .showFiles {
    line-height: 18px;
    padding: 3px 20px 3px 8px;
    border: 1px solid #519eff;
    display: inline-block;
    vertical-align: top;
    max-width: 130px;
    border-radius: 3px;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    a:nth-of-type(2) {
      position: absolute;
      right: 5px;
      top: 5px;
    }
    i {
      position: absolute;
      right: 3px;
      top: 5px;
      color: $ico;
    }
  }
}
</style>
