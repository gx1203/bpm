<template>
  <el-card shadow="never">
    <div class="item-left">
      <treeProcess type="1" @confirm="handleNodeClick"/>
    </div>
    <div class="item-right" v-if="treeData.type === '1'">
      <div class="tool-common-wrap">
        <div class="search-wrap">
          <quick-query :isDate="false" ref="quick" @quickSearch="quickSearch" />
        </div>
        <div class="btn-wrap">
          <el-button type="primary" @click="addList('添加控制条件')">
            {{ $t('add') }}
            <!---->
          </el-button>
          <el-button type="primary" @click="handleAllDelete" :disabled="selections.length === 0">
            {{ $t('batchDelete') }}
            <!--<i class="el-icon-circle-close" />-->
          </el-button>
          <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
            {{ $t('advancedQuery') }}
            <i :class="isPowerSearch?'el-icon-caret-top':'el-icon-caret-bottom'" />
          </el-button>
          <el-button type="primary" @click="rest">
             {{ $t('refresh') }}
            <!---->
          </el-button>
        </div>
      </div>
      <el-form
        class="power-search"
        :model="searchForm"
        @keyup.enter.native="pageNum = 1; getData()"
        ref="searchForm"
        label-width="150px"
        size="mini"
        v-if="isPowerSearch"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="控制字段名称：">
              <el-input clearable type="text" v-model="fieldname"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="控制字段列名：">
              <el-input clearable type="text" v-model="fieldkey"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="控制字段对应业务表：">
              <el-input clearable type="text" v-model="fieldtablename"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="控制字段类型:">
              <el-select clearable v-model="fieldtype" class="w100">
                <el-option
                  v-for="item in selectTypeList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="text-r">
            <el-button type="primary" @click="pageNum = 1; getData()">{{ $t('query') }}</el-button>
            <el-button type="primary" @click="rest">{{ $t('reset') }}</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div v-loading="loading">
        <div class="table-header margin-t10">
          <el-checkbox v-model="checkAll" class="all-check" />
          <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort" />
        </div>
      <div v-if="content.list && content.list.length!==0">

        <div class="tr" v-for="(item, index) in content.list" :key="index">
          <el-row class="tr-body" type="flex" align="middle">
            <el-col :span="1">
              <el-checkbox v-model="item.checked" style="margin-left: 10px" />
            </el-col>
            <el-col class="td" :span="headers[0].span">{{treeData.name}}</el-col>
            <el-col class="td" :span="headers[1].span">{{item.fieldname}}</el-col>
            <el-col class="td" :span="headers[2].span">{{item.fieldkey}}</el-col>
            <el-col class="td" :span="headers[3].span">{{item.fieldtablename}}</el-col>
            <el-col class="td" v-if="item.fieldtype === 'date'" :span="headers[4].span">日期</el-col>
            <el-col class="td" v-if="item.fieldtype === 'double'" :span="headers[4].span">数值</el-col>
            <el-col class="td" v-if="item.fieldtype === 'string'" :span="headers[4].span">字符串</el-col>
            <el-col style="text-align: center" :span="headers[5].span">
              <el-button type="text" icon="el-icon-edit" @click="addList('编辑控制条件',item)"></el-button>
              <el-button type="text" icon="el-icon-delete" @click="handleDeleteOne(item)"></el-button>
            </el-col>
          </el-row>
        </div>
        </div>
      <div v-else class="text-c pad-10px tr-empty"> {{ $t('noData') }}</div>

      </div>
      <el-pagination
        style="margin-top: 15px"

        :page-size="pageSize"
        :current-page.sync="pageNum"
        background
        @current-change="getData()"
        :total="content.total"
      ></el-pagination>
    </div>
    <add-transaction-dialog
      v-model="dialogVisible"
      :item="editItem"
      :title="linkTitle"
      @confirm="saveSuccess"
    />
  </el-card>
</template>

<script>
import addTransactionDialog from './addTransactionDialog'
import treeProcess from '@/bpm/components/treeProcessFlow'
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import { getMiddleList, deleteRule, batchDelete } from '@/bpm/api/process/business/business.js'
export default {
  mixins: [SearchListMixin],
  components: {
    addTransactionDialog,
    treeProcess,
    QuickQuery
  },
  data () {
    return {
      isPowerSearch: false,
      selectTypeList: [
        {
          name: '日期',
          value: 'date'
        },
        {
          name: '字符串',
          value: 'string'
        },
        {
          name: '数值',
          value: 'double'
        }
      ],
      dialogVisible: false,
      editItem: {},
      linkTitle: '',
      headers: [
        {
          name: this.$t('processName2'),
          span: 9
        },
        {
          key: 'fieldname',
          name: '控制字段名称',
          span: 7
        },
        {
          key: 'fieldkey',
          name: '控制字段对于列名',
          span: 5
        },
        {
          key: 'fieldtablename',
          name: '控制字段对应业务表',
          span: 5
        },
        {
          key: 'fieldtype',
          name: '控制字段类型',
          span: 5
        },
        {
          name: this.$t('operation'),
          span: 3
        }
      ],
      selections: [],
      checkAll: false,
      treeData: {},
      pageNum: 1,
      pageSize: 10,
      content: {},
      fieldname: '',
      fieldkey: '',
      fieldtablename: '',
      fieldtype: ''
    }
  },
  watch: {
    treeData (val) {
      if (val.type === '1') {
        this.getData()
      }
    },
    'content.list': {
      handler (val) {
        if (this.content.list && this.content.list.length !== 0) {
          this.checkAll = true
          this.selections = []
          for (let i = 0; i < this.content.list.length; i++) {
            if (!this.content.list[i].checked) {
              this.checkAll = false
            } else {
              this.selections.push(this.content.list[i].id)
            }
          }
        }
      },
      deep: true
    },
    checkAll (val) {
      if (this.content.list) {
        if (val) {
          this.content.list.forEach(item => {
            item.checked = val
          })
        } else if (this.selections.length === this.content.list.length) {
          this.content.list.forEach(item => {
            item.checked = val
          })
        }
      }
    }
  },
  methods: {
    handleAllDelete () {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      }).then(() => {
        this.loading = true
        batchDelete(this.selections).then((rt) => {
          this.loading = false
          if (rt.status === '200') {
            this.$message.success(this.$t('hintText.successfullyDelete'))
            this.getData()
          }
        })
      }).catch(_ => {
        this.loading = false
      })
    },
    rest () {
      this.fieldname = ''
      this.fieldkey = ''
      this.fieldtablename = ''
      this.fieldtype = ''
      this.getData()
    },
    handleDeleteOne (item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteRule(item.id).then((rt) => {
          this.loading = false
          if (rt.status === '200') {
            this.$message.success(this.$t('hintText.successfullyDelete'))
            this.getData()
          }
        })
      }).catch(_ => {
        this.loading = false
      })
    },
    saveSuccess (data) {
      this.getData()
    },
    addList (item, data) {
      if (item === '添加控制条件') {
        this.dialogVisible = true
        this.linkTitle = item
        this.editItem = {processid: this.treeData.id}
      } else if (item === '编辑控制条件') {
        this.dialogVisible = true
        this.linkTitle = item
        this.editItem = Object.assign({}, data)
      }
    },
    handleNodeClick (data) {
      this.treeData = data
    },
    getData () {
      this.loading = true
      getMiddleList({
        'attr': {},
        'filters': [
          {
            'key': 'processid',
            'opt': 'EQ',
            'type': 'S',
            'value': this.treeData.id
          }, {
            'key': 'fieldname',
            'opt': 'LIKE',
            'type': 'S',
            'value': this.fieldname
          }, {
            'key': 'fieldkey',
            'opt': 'LIKE',
            'type': 'S',
            'value': this.fieldkey
          }, {
            'key': 'fieldtablename',
            'opt': 'LIKE',
            'type': 'S',
            'value': this.fieldtablename
          }, {
            'key': 'fieldtype',
            'opt': 'LIKE',
            'type': 'S',
            'value': this.fieldtype
          }
        ],
        'logic': '',
        'pageNum': this.pageNum,
        'pageSize': this.pageSize,
        ...this.sort
      }).then((rt) => {
        this.loading = false
        rt.data.list.forEach(element => {
          element.checked = false
        })
        this.content = rt.data
      }).catch((er) => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.item-left {
  float: left;
  width: 20%;
}
.w100 {
  width: 100%;
}
.item-right {
  float: right;
  width: 78%;
  .table-header {
    position: relative;
    background: $bc2;
    display: flex;
    align-items: center;
    .all-check {
      position: absolute;
      left: 10px;
    }
  }
}
</style>
