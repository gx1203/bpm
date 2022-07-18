<template>
  <el-dialog :title="reportAuthorityConfiguration" class="person_list" :visible.sync="dialogVisible" width="70%" @closed="cancelConfirmDialog">
    <el-row :gutter="20" class="group_container">
      <el-col :span="24">
        <el-table :data="reportConfigList" class="main_tab">
          <el-table-column :label="number" type="index"></el-table-column>
          <el-table-column prop="name" :label="fieldNames"></el-table-column>
          <el-table-column prop="condition" :label="whetherTheListIsDisplayed">
            <template slot="header" slot-scope="scope">
              <el-checkbox :indeterminate="isIndeterminate" v-model="isList" @change="changeIsList(scope.row)">{{$t("whetherTheListIsDisplayed")}}</el-checkbox>
            </template>
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.condition" @change="changeStatus(scope.row, 'condition')"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="status" :label="ifTheExport">
            <template slot="header" slot-scope="scope">
              <el-checkbox :indeterminate="isIndeterminateStatus" v-model="isExport" @change="changeIsExport(scope.row)">{{$t("ifTheExport")}}</el-checkbox>
            </template>
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.status" @change="changeStatus(scope.row, 'status')"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="status" :label="sort">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.rank" controls-position="right" :min="1"></el-input-number>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelConfirmDialog">{{$t("cancel")}}</el-button>
      <el-button type="primary" @click="submitConfirmDialog">{{$t("confirm")}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getCardlist, saveField, dictionarySaveList } from '@/bpa/api/settings/processCard'
export default {
  name: 'reportConfig',
  data() {
    return {
      dialogVisible: false,
      params: {'attr': {},
        'filters': [{'key': 'name', 'opt': 'LIKE', 'type': 'S', 'value': '流程基本属性'},
          {'key': 'state', 'opt': 'LIKE', 'type': 'S', 'value': ''},
          { key: 'type', opt: 'LIKE', type: 'S', value: '0' },
          {'key': 'sheetname', 'opt': 'LIKE', 'type': 'S', 'value': '流程基本属性'}],
        'logic': 'or',
        'orderby': 'createon',
        'pageNum': 1,
        'pageSize': 10000,
        'sort': 'desc'},
      reportConfigList: [],
      isExport: false,
      isList: false,
      isIndeterminate: true,
      isIndeterminateStatus: true,
      reportAuthorityConfiguration:this.$t("reportAuthorityConfiguration"),
      number:this.$t("bpa_number"),
      fieldNames:this.$t("fieldNames"),
      whetherTheListIsDisplayed:this.$t("whetherTheListIsDisplayed"),
      ifTheExport:this.$t("ifTheExport"),
      sort:this.$t("sort"),
      theSortCannotHaveDuplicate:this.$t("hintText.theSortCannotHaveDuplicate"),
      dataSavedSuccessfully:this.$t("hintText.dataSavedSuccessfully"),

    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
      if (val) {
        this.getCardlist()
      }
    }
  },
  mounted() {
  },
  methods: {
    getCardlist() {
      // 获取表格内的数据
      getCardlist(this.params).then(res => {
        console.log(res)
        res.list.forEach(list => {
          if (list.condition === 'Y') {
            list.condition = true
          } else {
            list.condition = false
          }
          if (list.status === 'Y') {
            list.status = true
          } else {
            list.status = false
          }
        })
        this.reportConfigList = res.list
        let conditionNum = 0
        let statusNum = 0
        this.reportConfigList.forEach(item => {
          if (item.condition === true) {
            conditionNum++
          }
          if (item.status === true) {
            statusNum++
          }
          console.log(conditionNum, this.reportConfigList.length)
        })
        console.log(conditionNum, this.reportConfigList.length)
        if (conditionNum === this.reportConfigList.length) {
          this.isList = true
          this.isIndeterminate = false
        } else {
          this.isList = false
          this.isIndeterminate = true
        }
        if (statusNum === this.reportConfigList.length) {
          this.isExport = true
          this.isIndeterminateStatus = false
        } else {
          this.isExport = false
          this.isIndeterminateStatus = true
        }
        console.log(this.isList, this.isExport)
      })
    },
    changeStatus (row, type) {
      // if (row.condition) {
      //   row.condition = 'Y'
      // } else {
      //   row.condition = 'N'
      // }
      // if (row.status) {
      //   row.status = 'Y'
      // } else {
      //   row.status = 'N'
      // }
      // saveField(row).then(res => {
      //   this.getCardlist()
      // })
      let typeNum = 0
      if (type === 'condition') {
        this.reportConfigList.forEach(item => {
          if (item.condition) {
            typeNum++
          }
        })
        if (typeNum === this.reportConfigList.length) {
          this.isList = true
          // this.isIndeterminate = false
        } else {
          this.isList = false
          // this.isIndeterminate = true
        }
        this.isIndeterminate = typeNum > 0 && typeNum < this.reportConfigList.length
      } else if (type === 'status') {
        this.reportConfigList.forEach(item => {
          if (item.status) {
            typeNum++
          }
        })
        if (typeNum === this.reportConfigList.length) {
          this.isExport = true
          // this.isIndeterminateStatus = false
        } else {
          this.isExport = false
          // this.isIndeterminateStatus = true
        }
        this.isIndeterminateStatus = typeNum > 0 && typeNum < this.reportConfigList.length
      }
    },
    // 是否列表全选
    changeIsList (row) {
      // dictionarySaveList([{
      //   condition: this.isList ? 'Y' : 'N'
      // }]).then(res => {
      //   this.getCardlist()
      // })
      if (this.isList) {
        this.reportConfigList.forEach(item => {
          item.condition = true
        })
      } else {
        this.reportConfigList.forEach(item => {
          item.condition = false
        })
      }
      this.isIndeterminate = false
    },
    // 是否导出全选
    changeIsExport (row) {
      // dictionarySaveList([{
      //   status: this.isExport ? 'Y' : 'N'
      // }]).then(res => {
      //   this.getCardlist()
      // })
      if (this.isExport) {
        this.reportConfigList.forEach(item => {
          item.status = true
        })
      } else {
        this.reportConfigList.forEach(item => {
          item.status = false
        })
      }
      this.isIndeterminateStatus = false
    },
    cancelConfirmDialog () {
      this.dialogVisible = false
      this.$emit('cancelConfirm', '')
    },
    submitConfirmDialog () {
      let rankNum = false
      this.reportConfigList.forEach((item, index1) => {
        this.reportConfigList.forEach((list, index2) => {
          if (item.rank && item.rank !== 'null' && list.rank && list.rank !== 'null' && item.rank === list.rank && index1 !== index2) {
            console.log(item.rank, list.rank)
            rankNum = true
          }
        })
      })
      if (rankNum) {
        this.$message({
          type: 'warning',
          message: this.theSortCannotHaveDuplicate
        })
        return
      }
      this.dialogVisible = false
      this.$emit('cancelConfirm', '')
      let reportConfigList = JSON.parse(JSON.stringify(this.reportConfigList))
      reportConfigList.forEach(item => {
        if (item.condition) {
          item.condition = 'Y'
        } else {
          item.condition = 'N'
        }
        if (item.status) {
          item.status = 'Y'
        } else {
          item.status = 'N'
        }
      })
      dictionarySaveList(reportConfigList).then(res => {
        this.$message({
          type: 'success',
          message: this.dataSavedSuccessfully
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tree_node {
  height: 487px;
}
.selected_list {
  margin-top: 10px;
  &::after {
    content: '';
    display: block;
    clear: both;
  }
  .selected_item {
    float: left;
    padding: 4px 6px;
    background: #67c23a;
    border-radius: 3px;
    margin-right: 5px;
    margin-bottom: 5px;
    .name {
      color: #fff;
      font-size: 12px;
      display: inline-block;
      vertical-align: middle;
    }
    i {
      font-size: 12px;
      color: #fff;
      cursor: pointer;
      display: inline-block;
      vertical-align: middle;
    }
    &:after {
      content: '';
      display: inline-block;
      height: 100%;
      vertical-align: middle;
    }
  }
}
</style>
