<template>
  <el-dialog id="confitionControlTypeDialog" :title="title" :visible.sync="dialogVisible" append-to-body>
    <div class="item-right">
      <div class="tool-common-wrap">
        <!-- <div class="search-wrap" style="width: 100%;text-align: right;margin-bottom: 10px;">
          <quick-query :isDate="false" ref="quick" @quickSearch="quickSearch" />
        </div> -->
        <div class="btn-wrap">
          <!-- <el-button type="primary" @click="addList($t('businessRulesRecycleBin'))">
            {{ $t('businessRulesRecycleBin') }}
          </el-button>
          <el-button type="primary" @click="addList($t('configureBusinessRules'))">
            {{ $t('configureBusinessRules') }}
          </el-button> -->
          <el-button v-show="selectInfo.dialogType !== 'add'" type="primary" @click="addList($t('addControlConditions'))">
            {{ $t('add') }}
            <!---->
          </el-button>
          <el-button type="primary" v-show="selectInfo.dialogType !== 'add'" :disabled="selections.length === 0" @click="handleAllDelete">
            {{ $t('batchDelete') }}
            <!--<i class="el-icon-circle-close" />-->
          </el-button>
          <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
            {{ $t('advancedQuery') }}
            <i :class="isPowerSearch?'el-icon-caret-top':'el-icon-caret-bottom'" />
          </el-button>
          <el-button type="primary" @click="getData">
            {{ $t('refresh') }}
            <!---->
          </el-button>
        </div>
      </div>
      <el-form class="power-search" :model="searchForm" @keyup.enter.native="getData" ref="searchForm"
        label-width="125px" size="mini" v-if="isPowerSearch">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('isItAControlType') + '：'">
              <el-select disabled clearable v-model="searchForm.iscontrol" class="w100">
                <el-option v-for="item in selectTypeList" :key="item.value" :label="item.name" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('controlFieldName') + '：'">
              <el-input clearable type="text" v-model="searchForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('correspondingBusinessTableFields') + '：'">
              <el-input clearable type="text" v-model="searchForm.field"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('conditionType') + '：'">
              <el-select clearable v-model="searchForm.controltype" class="w100">
                <el-option v-for="item in condition" :key="item.value" :label="item.name" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="8">
            <el-form-item :label="$t('applicationModule') + '：'">
               <el-checkbox-group v-model="searchForm.applicationmodule" @change="changeApplicationModule">
                <el-checkbox
                  v-for="(item, index) in applicationModuleList"
                  :key="index"
                  :label="item.value"
                >{{ item.name }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="text-r">
            <el-button type="primary" @click="getData">{{ $t('query') }}</el-button>
            <el-button type="primary" @click="searchForm = {};getData()">{{ $t('reset') }}</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div v-loading="loading">
        <el-table :data="content.list" class="margin-t10" stripe
            :header-cell-style="{background: '#E1EAFD !important'}" highlight-current-row @sort-change="elHandleSort"
            current-row-key="id">
            <el-table-column width="50">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.checked" />
              </template>
              <template slot="header">
                <el-checkbox v-model="checkAll" />
              </template>
            </el-table-column>
            <!-- <el-table-column :label="$t('processID')" show-overflow-tooltip prop="processid">
            </el-table-column> -->
            <!-- <el-table-column :label="$t('processName')" show-overflow-tooltip prop="processName">
            </el-table-column> -->
            <el-table-column :label="$t('controlFieldName')" show-overflow-tooltip sortable prop="name" min-width="115">
            </el-table-column>
            <el-table-column :label="$t('isItAControlType')" show-overflow-tooltip sortable prop="iscontrol" min-width="125">
              <template slot-scope="scope">
                <span>{{scope.row.iscontrol === 0 ? $t('controlField') : scope.row.iscontrol === 1 ? $t('specialField') : scope.row.iscontrol}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('formFieldType')" show-overflow-tooltip sortable prop="fieldtypecn" min-width="115">
            </el-table-column>
            <el-table-column :label="$t('correspondingBusinessTableFields')" show-overflow-tooltip sortable prop="field" min-width="125">
            </el-table-column>
             <el-table-column :label="$t('applicationModule')" show-overflow-tooltip sortable prop="applicationmodule" min-width="90">
               <template slot-scope="scope">
                 {{ applicationModuleFilter(scope.row.applicationmodule) }}
               </template>
            </el-table-column>
            <el-table-column :label="$t('conditionType')" show-overflow-tooltip sortable prop="controltype" min-width="90">
              <template slot-scope="scope">
                <span v-if="scope.row.controltype === 1 && scope.row.iscontrol !== 1">{{ $t('rangeCondition') }}</span>
                <span v-if="scope.row.controltype === 0 && scope.row.iscontrol !== 1">{{ $t('customCondition') }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('comparisonLogic')" show-overflow-tooltip sortable prop="operator" min-width="90">
              <template slot-scope="scope">
                <span>{{getComparisonLogic(scope.row)}}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="selectInfo.dialogType !== 'add'" :label="$t('operation')" width="60">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-edit" @click="addList($t('editControlConditions'),scope.row)">
                </el-button>
                <el-button type="text" icon="el-icon-delete" @click="handleDeleteOne(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        <el-pagination style="margin-top: 15px" :page-size="page.pageSize" :current-page.sync="page.pageNum" background
          @current-change="searchType === 'power' ? getData() : quickQueryData()" :total="content.total">
        </el-pagination>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="handleClick">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { queryList, deleteControl, batchDelete } from '@/bpm/api/process/business/rule_management.js'
import addTransactionDialog from '../process/business/ruleManagement/addTransactionDialog'
export default {
  name: "confitionControlTypeDialog",
  components: {
    addTransactionDialog
  },
  data () {
    return {
      isPowerSearch: false,
      dialogVisible: this.value,
      businessRoleList: [],
      props: {
        label: 'tablename'
      },
      treeData: [],
      searchForm:{
        applicationmodule:[],
        iscontrol: ''
      },
      selectTypeList: [
        {
          name: this.$t('controlField'),
          value: 0
        },
        {
          name: this.$t('specialField'),
          value: 1
        }
      ],
      condition: [
        {
          name: this.$t('customCondition'),
          value: 0
        },
        {
          name: this.$t('rangeCondition'),
          value: 1
        }
      ],
      applicationModuleValue: "",
      applicationModuleList:[
        //  {
        //   name: this.$t('allHave'),
        //   value: "0"
        // },
         {
          name: this.$t('businessRule'),
          value: "1"
        },
        {
          name: this.$t('businessAuth'),
          value: "2"
        }
      ],
      dialogVisible: false,
      editItem: {},
      linkTitle: '',
      headers: [
        {
          name: this.$t('processID'),
          span: 2
        },
        {
          name: this.$t('processName'),
          span: 3
        },
        {
          key: 'iscontrol',
          name: this.$t('isItAControlType'),
          span: 3
        },
        {
          key: 'name',
          name: this.$t('controlFieldName'),
          span: 3
        },
        {
          key: 'fieldtypecn',
          name: this.$t('formFieldType'),
          span: 3
        },
        {
          key: 'field',
          name: this.$t('correspondingBusinessTableFields'),
          span: 3
        },
        {
          key: 'applicationmodule',
          name: this.$t('applicationModule'),
          span: 2
        },
        {
          key: 'controltype',
          name: this.$t('conditionType'),
          span: 2
        },
        {
          name: this.$t('operation'),
          span: 3
        }
      ],
      selections: [],
      checkAll: '',
      treeData: {},
      filters:[],
      loading: false,
      content: {
        list: []
      },
      page: {
        pageNum: 1,
        pageSize: 10
      },
      searchType: 'power',
      selectInfo: {},
      compare: [
        {
          name: "Max≧Value＞Min",
          value: 1,
        },
        {
          name: "Max≧Value≧Min",
          value: 2,
        },
        {
          name: "Max＞Value≧Min",
          value: 3,
        },
        {
          name: "Max＞Value＞Min",
          value: 4,
        },
        {
          name: this.$t("equal"),
          value: 5,
        },
        {
          name: this.$t("noequal"),
          value: 6,
        },
        {
          name: this.$t("contained"),
          value: 7,
        },
        {
          name: this.$t("contain"),
          value: 8,
        }
      ]
    }
  },
  filters:{},
  components: {},
  props: {
    value: {
      type: Boolean,
      default: false
    },
    businessRoleIds: {
      type: String,
      default: ''
    },
    title: {
      type: String
    },
    selectItem: {
      type: Object
    }
  },
  watch: {
    selectItem (val) {
      this.selectInfo = val
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
              this.selections.push(this.content.list[i])
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
    },
    treeData: {
      handler (val) {
        if (val.type === '1') {
          this.getData()
        }
      },
      deep: true 
    },
    value (val) {
      if (val) {
        this.businessRoleList = []
        this.getData()
      }
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    // 返回比较逻辑
    getComparisonLogic(item) {
      var name = ''
      for (let i = 0; i < this.compare.length; i++) {
        let dic = this.compare[i]
        if (item.operator === dic.value) {
          name = dic.name
        }
      }
      return name
    },
    applicationModuleFilter (val) {
      switch(val){
        case '0':
          // return `${ this.$t('allHave')}`
          return this.$t('businessRule') + ',' + this.$t('businessAuth')
          break;
        case '1':
          return this.$t('businessRule')
           break;
        case '2':
          return this.$t('businessAuth')
           break;
        case '1,2':
          return this.$t('businessRule') + ',' + this.$t('businessAuth')
           break;
        // default:
        //   return val 
      }
    },
    elHandleSort() {

    },
    cancel () {
      this.dialogVisible = false
    },
    handleClick (data) {
      this.$emit('confirm', this.selections)
      this.cancel()
    },
    handleDeleteOne (item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteControl(item.id).then(rt => {
          if (rt.status === '200') {
            this.loading = false
            if (this.searchType === 'power') {
              this.getData()
            } else if (this.searchType === 'quick') {
              this.quickQueryData()
            }
            this.$message.success(this.$t('hintText.successfullyDelete'))
          } else {
            this.loading = false
          }
        })
      }).catch(_ => {
        this.loading = false
      })
    },
    handleAllDelete () {
      this.$confirm(this.$t('hintText.areYouSureDeleteSelectedData'), this.$t('hintText.hint'), {
        type: 'warning'
      }).then(() => {
        this.loading = true
        batchDelete(this.selections).then((rt) => {
          this.loading = false
          if (rt.status === '200') {
            if (this.searchType === 'power') {
              this.getData()
            } else if (this.searchType === 'quick') {
              this.quickQueryData()
            }
            this.$message.success(this.$t('hintText.successfullyDelete'))
          }
        }).catch((er) => {
          this.loading = false
        })
      }).catch(_ => {
        this.loading = false
      })
    },
    quickQueryData () {
    },
    saveSuccess (data) {
      if (data) {
        this.getData()
      }
    },
    addList (item, data) {
      if (item === this.$t('addControlConditions')) {
        this.dialogVisible = true
        this.linkTitle = item
        this.editItem = {
          processid: this.treeData.id,
          applicationmodule:[],
          controltype: '',
          operator: '',
          linkTitle: this.linkTitle
        }
        this.$emit('addTransaction', this.editItem)
      } else if (item === this.$t('editControlConditions')) {
        this.dialogVisible = true
        this.linkTitle = item
        this.editItem = Object.assign({}, {applicationmodule:''}, data)
        this.editItem = {...this.editItem}
        this.editItem.linkTitle = this.linkTitle
        this.$emit('addTransaction', this.editItem)
      } else {
        let routeData = ''
        if (item === this.$t('configureBusinessRules')) {
          routeData = this.$router.resolve({ name: 'confinBusinessRule', query: { processId: this.treeData.id, version: this.treeData.version || '', bpaVersion: this.treeData.bpaVersion, type: 'edit' } })
        } else if (item === this.$t('businessRulesRecycleBin')) {
          routeData = this.$router.resolve({ name: 'confinBusinessRule', query: { processId: this.treeData.id, version: this.treeData.version || '', bpaVersion: this.treeData.bpaVersion, type: 'look' } })
        }
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
        // window.open(routeData.href, "_blank");
      }
    },
    handleNodeClick (data) {
      this.treeData = data
    },
    changeApplicationModule(val){
      this.applicationModuleValue =  val.join(",") === "1,2" ? "0" : val.join(",") === "2,1" ? '0' : val.join(",")
    },
    getData () {
      console.log(this.selectInfo)
      this.loading = true
      this.checkAll = false
      queryList({
        attr: {
          version: this.treeData.version
        },
        logic: 'and',
        filters: [
          {
            'key': 'processid',
            'opt': 'EQ',
            'type': 'S',
            'value': this.selectInfo.processid
          }, {
            'key': 'iscontrol',
            'opt': 'LIKE',
            'type': 'S',
            'value': '0' // 只展示控制类型的
          }, {
            'key': 'name',
            'opt': 'LIKE',
            'type': 'S',
            'value': this.searchForm.name
          }, {
            'key': 'field',
            'opt': 'LIKE',
            'type': 'S',
            'value': this.searchForm.field
          }, 
          {
            'key': 'applicationmodule',
            'opt': 'LIKE',
            'type': 'S',
            'value': this.applicationModuleValue  
          }, 
          {
            'key': 'controltype',
            'opt': 'LIKE',
            'type': 'S',
            'value': this.searchForm.controltype
          }, {
            'key': 'tablename',
            'opt': 'LIKE',
            'type': 'S',
            'value': this.searchForm.tablename
          }
        ],
        ...this.sort,
        ...this.page
      }).then(rt => {
        rt.data.list.forEach(item => {
          item.checked = false
        })
        this.content = rt.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>

#confitionControlTypeDialog {
  /deep/ .el-dialog{
    width: 80%;
  }
  .item-right {
    // float: right;
    // width: 78%;
    .table-header {
      position: relative;
      background: $bc2;
      display: flex;
      align-items: center;
      .all-check {
        position: absolute;
        left: 10px;
      }
      .td {
        text-align: left;
      }
    }
  }
}
</style>
