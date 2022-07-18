<template>
  <el-card shadow="never" class="card-reset">
    <!--    表格-->
    <bas-table
      row-key="id"
      :tableList="content.list"
      :headerList="headerList"
      :pages="page"
      selectType="checkbox"
      :headerCellStyle="{background: '#E1EAFD !important'}"
      @selectionChange="handleSelectionChange"
      @currentChange="currentChange">
      <template #search>
        <div>
          <div class="tool-common-wrap">
            <div class="search-wrap">
              <quick-query ref="quick" :placeholder="$t('placeholderText.multipleFieldsPlaceholder34')" :is-date="false"
                @quickSearch="quickSearch" />
            </div>
            <div class="btn-wrap">
              <el-upload class="upload-demo" :action="action" name="file" :data="{'dataType':'fieldLibrary'}"
                :headers="headData" :show-file-list='false' :before-upload="beforeAvatarUpload" :on-success="uploadSuccess"
                :on-error="uploadError" style="display: inline-block;margin-right: 10px;">
                <el-button type="primary">
                  {{ $t('import') }}
                  <!--<i class="el-icon-upload2" />-->
                </el-button>
              </el-upload>
              <export :filters="filters" :selections="selections" type="fieldLibraryExport" />
              <el-button type="primary" @click="addList($t('addFieldLibraryConfiguration'))">
                {{ $t('add') }}
                <!---->
              </el-button>
              <el-button type="primary" :disabled="selections.length === 0" @click="handleAllDelete">
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
          <el-form v-if="isPowerSearch" ref="searchForm" class="power-search" :model="searchForm" label-width="120px"
            size="mini" @keyup.enter.native="powerSearch">
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('fieldName') + '：'">
                  <el-input v-model="searchForm.fieldName" clearable type="text" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('displayText') + '：'">
                  <el-input v-model="searchForm.fieldShowName" clearable type="text" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('fieldType') + '：'">
                  <el-select v-model="searchForm.inputType" clearable class="w100"
                    :placeholder="$t('placeholderText.pleaseSelect')">
                    <el-option v-for="item in typeList" :key="item.value" :label="item.text" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('fieldLength') + '：'">
                  <el-input v-model="searchForm.length" clearable type="text" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('dataSources') + '：'">
                  <el-input v-model="searchForm.datasource" clearable type="text" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('remarks') + '：'">
                  <el-input v-model="searchForm.remark" clearable type="text" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="text-r">
                <el-button type="primary" @click="powerSearch">
                  {{ $t('query') }}
                </el-button>
                <el-button type="primary" @click="rest">
                  {{ $t('reset') }}
                </el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </template>
      <!-- 字段名称  -->
      <template #fieldName="{ row }">
        <div>{{ row.fieldName }}</div>
      </template>
      <!-- 显示文本  -->
      <template #fieldShowName="{ row }">
        <div>{{ row.fieldShowName }}</div>
      </template>
      <!-- 字段类型  -->
      <template #inputType="{ row }">
        <div>{{ getInputType(row.inputType) }}</div>
      </template>
      <!-- 字段长度  -->
      <template #length="{ row }">
        <div>{{ row.length }}</div>
      </template>
      <!-- 数据来源  -->
      <template #datasource="{ row }">
        <div>{{ row.datasource }}</div>
      </template>
      <!-- 备注  -->
      <template #remark="{ row }">
        <div>{{ row.remark }}</div>
      </template>
      <!-- 操作 -->
      <template #id="{ row }">
        <el-button type="text"
            @click="addList($t('editFieldLibraryConfiguration'), row)">{{ $t('editFieldLibraryConfiguration') }}</el-button>
        <el-button type="text" @click="handleDelete(row)">{{ $t('delete') }}</el-button>
      </template>
    </bas-table>
    <field-maintenance-dialog v-model="dialogVisible" :item="editItem" :title="linkTitle" :type-list="typeList"
      @confirm="saveSuccess" />
  </el-card>
</template>
<script>
import fieldMaintenanceDialog from './fieldMaintenanceDialog'
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import Export from '@/bpm/components/export/Export'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import { getFieldLibraryList, deleteFieldLibraryList, deleteAllFieldLibraryList } from '@/bpm/api/process/advancedConfig/field_maintenance.js'
import { getDictionaryOption } from '@/bpm/api/process/processModeling/classificationModel'
import axios from 'axios'
export default {
  name: 'FieldMaintenance',
  components: {
    fieldMaintenanceDialog,
    QuickQuery,
    Export
  },
  mixins: [SearchListMixin],
  data () {
    return {
      headData: {
        token: localStorage.getItem('token')
      },
      action: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/datamanage/dataImport`,
      typeList: [],
      loading: false,
      isPowerSearch: false,
      dialogVisible: false,
      searchForm: {},
      editItem: {},
      linkTitle: '',
      headers: [
        {
          name: this.$t('fieldName'),
          span: 3
        },
        {
          name: this.$t('displayText'),
          span: 3
        },
        {
          name: this.$t('fieldType'),
          span: 3
        },
        {
          key: 'length',
          name: this.$t('fieldLength'),
          span: 3
        },
        {
          key: 'datasource',
          name: this.$t('dataSources'),
          span: 5
        },
        {
          key: 'remark',
          name: this.$t('remarks'),
          span: 4
        },
        {
          name: this.$t('operation'),
          span: 3
        }
      ],
      selections: [],
      checkAll: '',
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      // 表头字段
      headerList: [
        {
          label: this.$t('fieldName'), // 字段名
          prop: 'fieldName',
          slotName: 'fieldName',
          sortable: false
        },
        {
          label: this.$t('displayText'), // 显示文本
          prop: 'fieldShowName',
          slotName: 'fieldShowName',
          sortable: false
        },
        {
          label: this.$t('fieldType'), // 字段类型
          prop: 'inputType',
          slotName: 'inputType',
          sortable: false
        },
        {
          label: this.$t('fieldLength'), // 字段长度
          prop: 'length',
          slotName: 'length',
          sortable: true
        },
        {
          label: this.$t('dataSources'), // 来源数据
          prop: 'datasource',
          slotName: 'datasource',
          sortable: true
        },
        {
          label: this.$t('remarks'), // 备注
          prop: 'remark',
          slotName: 'remark',
          sortable: true
        },
        {
          label: this.$t('operation'), // 操作
          prop: 'id',
          slotName: 'id',
          sortable: false,
          width: "150"
        }
      ]
    }
  },
  watch: {
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
    }
  },
  mounted () {
    this.getData()
    console.log('🍌', this.$route)
    if(this.$route.query.isShowAddDialog === 'true') {
      this.linkTitle = this.$t('addFieldLibraryConfiguration')
      this.editItem = {}
      this.dialogVisible = true
    }
  },
  methods: {
    // 页码改变事件
    currentChange(newPageNum) {
      console.log('newPage', newPageNum)
      this.page.pageNum = newPageNum
      this.searchType === 'power' ? this.getData() : this.quickQueryData()
    },
    // 复选框勾选事件
    handleSelectionChange(data) {
      console.log(data)
      this.selections = data
    },
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 100;
      let postfix = file.name.replace(/.+\./, "");
      const isPostfix = ['JSON'].indexOf(postfix.toUpperCase()) === -1
      if (isPostfix) {
        this.$message.error(this.$t('hintText.pleaseUploadJsonFile'))
      }
      if (!isLt2M) {
        this.$message.error(this.$t('hintText.uploadAttachmentSizeCannotExceed'))
      }
      if (!isPostfix && isLt2M) {
        this.pageLoading = true

      }
      return !isPostfix && isLt2M
    },
    uploadSuccess (file) {
      this.pageLoading = false
      if (file.status === '200') {
        this.$message.success(this.$t('hintText.importedSuccessfully'))
        this.getData()
      } else {
        this.$message.error(this.$t('hintText.importFileError'))
      }
    },
    uploadError (err) {
      console.log(err)
      console.log(err.message)
      this.pageLoading = false
      // if (err.message) {
      //   let data = JSON.parse(err.message)
      //   this.$message.error(data.message)
      // } else {
      //   this.$message.error(this.$t('hintText.importFailed'))
      // }
      this.$message.error(this.$t('hintText.importFileError'))
    },
    excelFile () {
      this.pageLoading = true
      axios({
        method: 'post',
        url: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/datamanage/fieldLibraryExport`,
        data: {
          filters: [...this.filters, ...[{ 'key': 'id', 'value': (this.selections.map(x => x.id)).join(','), 'opt': 'IN' }]]
        },
        headers: {
          token: localStorage.getItem('token')
        },
        responseType: 'blob'
      }).then(res => {
        this.pageLoading = false
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
        let url = window.URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', '字段库维护.json')
        document.body.appendChild(link)
        link.click()
      }).catch(() => {
        this.pageLoading = false
      })
    },
    quickQueryData () {
      this.loading = true
      this.checkAll = false

      getFieldLibraryList({
        logic: 'or',
        filters: this.filters,
        queryFilter: ['fieldName', 'fieldShowName', 'inputType', 'length', 'datasource', 'remark'],
        ...this.quickData,
        ...this.sort,
        ...this.page
      }).then(rt => {
        rt.data.list.forEach(item => {
          item.checked = false
        })
        this.content = rt.data
        this.page.total = rt.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getInputType (status) {
      const result = this.typeList.find(item => item.value === status)
      return result ? result.text : '未知'
    },
    handleAllDelete () {
      this.$confirm(this.$t('hintText.areYouSureDeleteSelectedData'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          deleteAllFieldLibraryList(
            this.selections.map(item => item.id).join(',')
          ).then(rt => {
            if (rt.status === '200') {
              this.getData()
              this.$message({
                message: this.$t('hintText.successfullyDelete'),
                type: 'success'
              })
            } else {
              this.$message({
                message: this.$t('hintText.failToDelete'),
                type: 'error'
              })
            }
          })
        })
        .catch(_ => { })
    },
    handleDelete (item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          deleteFieldLibraryList(item.id).then(rt => {
            if (rt.status === '200') {
              this.getData()
              this.$message({
                message: this.$t('hintText.successfullyDelete'),
                type: 'success'
              })
            } else {
              this.$message({
                message: this.$t('hintText.failToDelete'),
                type: 'error'
              })
            }
          })
        })
        .catch(_ => { })
    },
    addList (item, data) {
      this.linkTitle = item
      if (item === this.$t('editFieldLibraryConfiguration')) {
        this.editItem = Object.assign({}, data)
      } else {
        this.editItem = {}
      }
      this.dialogVisible = true
    },
    getData () {
      this.loading = true
      this.checkAll = false
      this.filters.forEach(item => {
        if (item.key === 'inputType') {
          item.opt = 'EQ'
        }
      })
      getFieldLibraryList({
        logic: 'and',
        filters: this.filters,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          if (rt.status === '200') {
            rt.data.list.forEach(item => {
              item.checked = false
            })
            this.content = rt.data
            this.page.total = rt.data.total
            getDictionaryOption({
              dictionaryen: 'subparagraphType'
            }).then((res) => {
              this.typeList = res.data
              this.content.list.forEach(element => {
                this.typeList.forEach(item => {
                  if (element.inputType === item.value) {
                    element.typeName = item.text
                  }
                })
              })
            })
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    saveSuccess (param) {
      if (param) {
        if (this.searchType === 'power') {
          this.getData()
        } else if (this.searchType === 'quick') {
          this.quickQueryData()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table-header {
  position: relative;
  background: $bc2;
  display: flex;
  align-items: center;
  .all-check {
    position: absolute;
    left: 20px;
  }
}
.w100 {
  width: 100%;
}
</style>
