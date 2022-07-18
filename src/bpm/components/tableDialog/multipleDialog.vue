<template>
  <el-dialog :title="checkTabData.titleName" :visible.sync="dialogVisible" v-if="dialogVisible" v-loading="loading"
    width="80%" top="10vh" :close-on-click-modal="false" :close-on-press-escape="false" append-to-body>
    <div class="tool-common-wrap" v-if="searchShow">
      <div class="search-wrap" style="float: right;">
        <el-input clearable v-model="searchKey" @keyup.enter.native="quickSearch">
          <span slot="append" @click="quickSearch">{{$t('search')}}</span>
        </el-input>
      </div>
    </div>
    <div v-if="tabShow">
      <!--      :reserve-selection="true"-->
      <el-table :data="content.list" border style="width: 100%;margin-top: 10px;"
        @selection-change="handleSelectionChange" ref="multipleTable" max-height="300" :row-key="getRowKeys">
        <el-table-column type="selection" width="55" fixed align="center">
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
    <div style="margin-top: 10px;">
      <span v-for="(vals, index) in selectedAll" :key="index" class="listItem">
        {{vals.na_me}}
        <i class="el-icon-close" @click="deletple(vals, index)"></i>
      </span>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('confirmButton') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import {getTableData} from '@/bpm/api/process/processModeling/classificationModel'
  import {getInfosByLink} from "@/bpm/api/flow";

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
        { label: '年龄', prop: 'id' },
        { label: '电话', prop: 'phone' },
      ],
      tableData: [
        { name: 'zhangsan', phone: '111', id: '16' },
        { name: 'lisi', phone: '221', id: '18' }
      ],
      content: {},
      details: {},
      dialogVisible: this.value,
      loading: false,
      multipleSelection: [],
      selectedAll: [],
      tabShow: true,
      searchShow: true,
      listIndex: -1,
      iechoEcho: false
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
        this.checkTabData.showValue
        this.selectedAll = []
        if (this.checkTabData.showValue) {
          let showValue = this.checkTabData.showValue.split('&')
          let applyvalue = this.checkTabData.applyvalue.split(',')
          this.selectedAll = showValue.map((item, index) => {
            return {
              na_me: item,
              i_d: applyvalue[index],
            }
          })
        }
        if (this.checkTabData.highLinkField) {
          this.getInfosByLink()
        } else {
          this.quickQueryData()
        }
      } else {
        this.$refs.multipleTable.clearSelection()
      }
      this.dialogVisible = val
    },
    // multipleSelection: {
    //   handler: function (val) {
    //     this.content.list.forEach(item => {
    //       let i = this.selectedAll.map(el => el.na_me).indexOf(item.na_me)
    //       let i2 = val.map(el => el.na_me).indexOf(item.na_me)
    //       if (i !== -1) {
    //         this.selectedAll.splice(i, 1)
    //       }
    //     })
    //     val.forEach(item => {
    //       let i = this.selectedAll.map(el => el.na_me).indexOf(item.na_me)
    //       if (i === -1) {
    //         this.selectedAll.push(item)
    //       }
    //     })
    //   },
    //   deep: true
    // },
    // 'content.list': {
    //   handler: function (val) {
    //     val.forEach(item => {
    //       this.listIndex = this.selectedAll.map(el => el.na_me).indexOf(item.na_me)
    //       if (this.listIndex !== -1) {
    //         this.toggleSelection([item])
    //       }
    //     })
    //   },
    //   deep: true
    // },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    getRowKeys (row) {
      return row.ID || row.id
    },
    deletple (vals, index) {
      // if (this.content.list.map(el => el.na_me).includes(vals.na_me)) {
      //   this.toggleSelection([vals])
      // } else {
      //   this.selectedAll.splice(index, 1)
      // }
      this.iechoEcho = true
      this.content.list.forEach((e, i) => {
        if (e.i_d === this.selectedAll[index].i_d) {
          this.$refs.multipleTable.toggleRowSelection(e, false)
        }
      })
      this.iechoEcho = false
      this.selectedAll.splice(index, 1)
      this.$forceUpdate()
    },
    quickSearch () {
      this.pageNum = 1
      if (this.checkTabData.highLinkField) {
        this.getInfosByLink()
      } else {
        this.quickQueryData()
      }
    },
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
          this.content.list.forEach(element => {
            this.$set(element, 'i_d', element[this.checkTabData.saveField])
            this.$set(element, 'na_me', element[this.checkTabData.showField])
          })
          this.selectedCheck()
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    quickQueryData () {
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
        this.content.list.forEach(element => {
          this.$set(element, 'i_d', element[this.checkTabData.saveField])
          this.$set(element, 'na_me', element[this.checkTabData.showField])
        })
        this.selectedCheck()
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    toggleSelection (rows) {
      this.$nextTick(() => {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          })
        }
      })
    },
    handleSelectionChange (val) {
      if(!this.iechoEcho){
        this.multipleSelection = val
        this.mergeSelected()
      }
    },
    mergeSelected () {
      let ids = this.multipleSelection.map(item => item.i_d)
      let selectedAllIds = this.selectedAll.map(item => item.i_d)
      this.multipleSelection.forEach(val=>{
        if(selectedAllIds.indexOf(val.i_d) === -1){ //如果list不存在选中的则新增
          this.selectedAll.push(val)
        }
      })
      //获取未选中的listid
      let listIds = this.content.list.filter(item => !ids.includes(item.i_d)).map(item=> item.i_d)
      //获取未选中listid对应的obj
      this.selectedAll = this.selectedAll.filter(item => !listIds.includes(item.i_d))
    },
    selectedCheck () {
      this.iechoEcho = true
      this.$refs.multipleTable.clearSelection();
      this.$nextTick(()=>{
        this.content.list.forEach(item => {
          this.selectedAll.forEach(v => {
            if (item.i_d === v.i_d) {
              if (this.$refs.multipleTable) {
                this.$refs.multipleTable.toggleRowSelection(item, true)
              }
            }
          })
        })
        this.iechoEcho = false
        this.$forceUpdate()
      })
    },
    submit () {
      this.$emit('confirm', this.selectedAll)
      this.dialogVisible = false
    },
    cancel () {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.listItem {
  background: #2d42af;
  color: #fff;
  padding: 10px;
  margin: 0 10px 10px 0;
  display: inline-block;
  text-align: center;
  i {
    cursor: pointer;
  }
}
</style>
