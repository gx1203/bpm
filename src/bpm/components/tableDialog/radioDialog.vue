<template>
  <el-dialog :title="checkTabData.titleName" :visible.sync="dialogVisible" v-loading="loading" width="80%" top="10vh"
    :close-on-click-modal="false" :close-on-press-escape="false" append-to-body>
    <div class="tool-common-wrap" v-if="searchShow">
      <div class="search-wrap" style="float: right;">
        <el-input clearable v-model="searchKey" @keyup.enter.native="quickSearch">
          <span slot="append" @click="quickSearch">{{$t('search')}}</span>
        </el-input>
      </div>
    </div>
    <div v-if="tabShow">
      <el-table :data="content.list" border style="width: 100%;margin-top: 10px;" @current-change="changeTable"
        ref="multipleTable" max-height="300">
        <el-table-column label="" width="50" fixed align="center">
          <template slot-scope="scope">
            <el-radio v-model="selectIndex" :label="scope.$index">{{''}}</el-radio>
          </template>
        </el-table-column>
        <template v-for="(item,index) in headArr">
          <el-table-column :key="index" :label="item.cnname" v-if="item.isshow === '1'" min-width="150" align="center">
            <template slot-scope="scope">
              <span>
                {{scope.row[item.columnName]}}
              </span>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <el-pagination style="margin-top: 15px" :page-size="pageSize" :current-page.sync="pageNum" background
        @current-change="quickQueryData()" :total="content.total"></el-pagination>
    </div>
    <div v-else style="text-align: center;">{{$t('noData')}}</div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('confirmButton') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getTableData } from '@/bpm/api/process/processModeling/classificationModel'
import { getInfosByLink } from "@/bpm/api/flow";
export default {
  components: {
  },
  data () {
    return {
      searchKey: '',
      pageNum: 1,
      pageSize: 5,
      headArr: [
        { label: '姓名', prop: 'name' },
        { label: '年龄', prop: 'age' },
        { label: '电话', prop: 'phone' },
      ],
      tableData: [
        { name: 'zhangsan', phone: '111', age: '16', id: '1' },
        { name: 'lisi', phone: '221', age: '18', id: '2' }
      ],
      details: {},
      content: {},
      dialogVisible: this.value,
      loading: false,
      selectIndex: -1,
      tabShow: true,
      searchShow: true
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    checkTabData: {
      type: Object,
      default () {
        return {}
      }
    },
    pItem: {
      type: Array,
      default: () => ([])
    }
  },
  watch: {
    value (val) {
      if (val) {
        this.pageNum = 1
        if (this.checkTabData.highLinkField) {
          this.getInfosByLink()
        } else {
          this.quickQueryData()
        }
      } else {
        this.selectIndex = -1
      }
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    getInfosByLink () {
      let pinfo = []
      this.pItem.forEach(element => {
        if (this.checkTabData.highLinkField.split(",").includes(element.fieldName)) {
          // 上级字段 已选的值
          if (element.applyvalue) {
            element.applyvalue.split(",").forEach(el => {
              pinfo.push({
                pvalue: el
              })
            })
          }
        }
      })
      this.selectIndex = -1
      this.loading = true;
      getInfosByLink({
        attr: {
          tableId: this.checkTabData.id,
          search: this.searchKey,
          pinfo: JSON.stringify(pinfo)
        },
        pageNum: 1,
        pageSize: 100000
      }).then(rt => {
        if (rt.status === "200" && rt.data) {
          rt.data.configData.forEach(element => {
            if (element.columnType === 'datetime') {
              rt.data.pageData.list.forEach(row => {
                if (row[element.columnName]) {
                  if (row[element.columnName].indexOf('.') > -1) {
                    row[element.columnName] = row[element.columnName].split('.')[0]
                    row[element.columnName] = row[element.columnName].replace(/T/g, ' ')
                  }
                }
              })
            }
          })
          this.details = rt.data
          this.content = rt.data.pageData
          this.headArr = rt.data.configData
          this.content.list.forEach((element, index) => {
            this.$set(element, 'i_d', element[this.checkTabData.saveField])
            this.$set(element, 'na_me', element[this.checkTabData.showField])
            if (element.i_d === this.checkTabData.applyvalue) {
              this.selectIndex = index
            }
          })
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    changeTable (val) {
      if (val) {
        this.selectIndex = val.ID ? this.content.list.findIndex(item => item.ID === val.ID) : this.content.list.findIndex(item => item.id === val.id)
      }
    },
    quickSearch () {
      this.pageNum = 1
      if (this.checkTabData.highLinkField) {
        this.getInfosByLink()
      } else {
        this.quickQueryData()
      }
    },
    quickQueryData () {
      this.selectIndex = -1
      this.loading = true;
      getTableData({
        'attr': {
          'tableId': this.checkTabData.id,
          'search': this.searchKey
        },
        'pageNum': this.pageNum,
        'pageSize': this.pageSize
      }).then(rt => {
        rt.data.configData.forEach(element => {
          if (element.columnType === 'datetime') {
            rt.data.pageData.list.forEach(row => {
              if (row[element.columnName]) {
                if (row[element.columnName].indexOf('.') > -1) {
                  row[element.columnName] = row[element.columnName].split('.')[0]
                  row[element.columnName] = row[element.columnName].replace(/T/g, ' ')
                }
              }
            })
          }
        })
        this.details = rt.data
        this.content = rt.data.pageData
        this.headArr = rt.data.configData
        let num = 0
        let num1 = 0
        this.headArr.forEach(element => {
          if (element.isshow === '1') {
            num++
          }
          if (element.istj === '1') {
            num1++
          }
        })
        this.tabShow = num > 0
        this.searchShow = num1 > 0
        this.content.list.forEach((element, index) => {
          this.$set(element, 'i_d', element[this.checkTabData.saveField])
          this.$set(element, 'na_me', element[this.checkTabData.showField])
          if (element.i_d === this.checkTabData.applyvalue) {
            this.selectIndex = index
          }
        })
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    submit () {
      console.log(this.content.list[this.selectIndex])
      let takeOutData = this.headArr.filter(item => item.relationFieldId) // 需要带出的数据
      this.$emit('confirm', this.content.list[this.selectIndex], takeOutData)
      this.dialogVisible = false
    },
    cancel () {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
</style>
