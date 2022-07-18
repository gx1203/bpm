<template>
  <el-card id="internationalConfig" class="card-reset" shadow="never" v-loading="pageLoading">
    <!--    表格-->
    <bas-table
      row-key="id"
      :tableList="content.list"
      :headerList="headerList"
      :pages="page"
      selectType="checkbox"
      @selectionChange="handleSelectionChange"
      @currentChange="currentChange">
      <template #search>
        <div>
          <div class="tool-common-wrap">
            <div class="search-wrap">
              <quick-query :placeholder="$t('placeholderText.multipleFieldsPlaceholder24')" :isDate="false" ref="quick" @quickSearch="quickSearch" />
            </div>
            <div class="btn-wrap">
              <el-upload
                class="upload-demo"
                :action="action"
                name="file"
                :headers="headData"
                :show-file-list='false'
                :before-upload="beforeAvatarUpload"
                :on-success="uploadSuccess"
                :on-error="uploadError"
              >
                <el-button type="primary">
                  {{ $t('import') }}
                  <!--<i class="el-icon-upload2" />-->
                </el-button>
              </el-upload>
              <el-tooltip :content="$t('hintText.exportResultsForAllData')" placement="top">
                <el-button type="primary" @click="excelFile">
                  {{ $t('export') }}
                  <!--<i class="el-icon-download" />-->
                </el-button>
              </el-tooltip>
              <!-- <el-button type="primary" @click="syncData">
                同步模块数据
                <i class="el-icon-refresh-left" />
              </el-button> -->
              <el-button type="primary" @click="userHandle($t('addInternationalizationModuleConfiguration'))">
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
              <el-col :span="8">
                <el-form-item :label="$t('simplifiedChinese') + '：'">
                  <el-input clearable type="text" v-model="searchForm.simplifiedchinese"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('traditionalChinese') + '：'">
                  <el-input clearable type="text" v-model="searchForm.chinesetraditional"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('english') + '：'">
                  <el-input clearable type="text" v-model="searchForm.english"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('german') + '：'">
                  <el-input clearable type="text" v-model="searchForm.german"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('japanese') + '：'">
                  <el-input clearable type="text" v-model="searchForm.japanese"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('italian') + '：'">
                  <el-input clearable type="text" v-model="searchForm.italian"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="text-r">
                <el-button type="primary" @click="search">{{ $t('query') }}</el-button>
                <el-button type="primary" @click="reset">{{ $t('reset') }}</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </template>
      <!-- 简体中文 -->
      <template #simplifiedchinese="{ row }">
        <div>{{ row.simplifiedchinese }}</div>
      </template>
      <!-- 繁体 -->
      <template #chinesetraditional="{ row }">
        <div>{{ row.chinesetraditional }}</div>
      </template>
      <!-- 英文 -->
      <template #english="{ row }">
        <div>{{ row.english }}</div>
      </template>
      <!-- 德文 -->
      <template #german="{ row }">
        <div>{{ row.german }}</div>
      </template>
      <!-- 日文 -->
      <template #japanese="{ row }">
        <div>{{ row.japanese }}</div>
      </template>
      <!-- 意大利 -->
      <template #italian="{ row }">
        <div>{{ row.italian }}</div>
      </template>
      <!-- 操作 -->
      <template #id="{ row }">
        <el-tooltip class="item" :content="$t('edit')" placement="top">
          <el-button type="text" @click="userHandle($t('editInternationalizationModuleConfiguration'),row)">{{ $t('edit') }}</el-button>
        </el-tooltip>
        <el-tooltip class="item" :content="$t('delete')" placement="top">
          <el-button type="text" @click="handleDelete(row)">{{ $t('delete') }}</el-button>
        </el-tooltip>
      </template>
    </bas-table>
    <international-config-dialog
      v-model="dialogVisible"
      :item="editItem"
      :title="linkTitle"
      @confirm="saveSuccess"
    />
  </el-card>
</template>
<script>
import internationalConfigDialog from './internationalConfigDialog'
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import {
  getZationList,
  deleteZation,
  deleteAllZation,
  initSpBasSync
} from '@/bpm/api/configManage/internationalConfig'
import axios from 'axios'
export default {
  name:'internationalConfig',
  mixins: [SearchListMixin],
  components: {
    internationalConfigDialog,
    QuickQuery
  },
  data () {
    return {
      headData: {
        token: localStorage.getItem('token')
      },
      action: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/i18n/config/importExcel`,
      loading: false,
      pageLoading: false,
      isPowerSearch: false,
      dialogVisible: false,
      businessDialogVisible: false,
      searchForm: {},
      editItem: {},
      linkTitle: '',
      headers: [
        {
          key: 'simplifiedchinese',
          name: this.$t('simplifiedChinese'),
          span: 4
        },
        {
          key: 'chinesetraditional',
          name: this.$t('traditionalChinese'),
          span: 4
        },
        {
          key: 'english',
          name: this.$t('english'),
          span: 4
        },
        {
          key: 'german',
          name: this.$t('german'),
          span: 4
        },
        {
          key: 'japanese',
          name: this.$t('japanese'),
          span: 4
        },
         {
          key: 'italian',
          name: this.$t('italian'),
          span: 4
        },
        {
          name: this.$t('operation'),
          span: 4
        }
      ],
      content: {
        list: [{}]
      },
      selections: [],
      filters: [],
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      checkAll: '',
      // 表头字段
      headerList: [
        {
          label: this.$t('simplifiedChinese'), // 简体中午
          prop: 'simplifiedchinese',
          slotName: 'simplifiedchinese',
          sortable: true
        },
        {
          label: this.$t('traditionalChinese'), // 繁体
          prop: 'chinesetraditional',
          slotName: 'chinesetraditional',
          sortable: true
        },
        {
          label: this.$t('english'), // 英文
          prop: 'english',
          slotName: 'english',
          sortable: true
        },
        {
          label: this.$t('german'), // 德文
          prop: 'german',
          slotName: 'german',
          sortable: true
        },
        {
          label: this.$t('japanese'), // 日文
          prop: 'japanese',
          slotName: 'japanese',
          sortable: true
        },
        {
          label: this.$t('italian'), // 意大利
          prop: 'italian',
          slotName: 'italian',
          sortable: true
        },
        {
          label: this.$t('operation'), // 意大利
          prop: 'id',
          slotName: 'id',
          sortable: false
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
  },
  methods: {
    // 页码改变事件
    currentChange(newPageNum) {
      console.log('newPage', newPageNum)
      this.page.pageNum = newPageNum
      this.getData()
    },
    // 复选框勾选事件
    handleSelectionChange(data) {
      console.log(data)
      this.selections = data
    },
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 100;
      let postfix = file.name.replace(/.+\./, "");
      const isPostfix = ['XLS'].indexOf(postfix.toUpperCase()) === -1
      if (isPostfix) {
        this.$message.error(this.$t('hintText.pleaseUploadXlsFile'))
      }
      if (!isLt2M) {
        this.$message.error(this.$t('hintText.uploadAttachmentSizeCannotExceed'))
      }
      if (!isPostfix && isLt2M) {
        this.pageLoading = true

      }
      return !isPostfix && isLt2M
    },
    syncData () {
      initSpBasSync().then(rt => {
        if (rt.status === '200') {
          this.$message.success(this.$t('hintText.operateSuccessfully'))
        } else {
          this.$message.error(rt.message)
        }
      })
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
        url: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/i18n/config/exportExcel`,
        data: {
          logic: 'and',
          filters: this.filters,
          ...this.sort,
          ...this.page
        },
        headers: {
          token: localStorage.getItem('token')
        },
        responseType: 'blob'
      }).then(res => {
        this.pageLoading = false
        let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'})
        let url = window.URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', '国际化配置.xls')
        document.body.appendChild(link)
        link.click()
      }).catch(() => {
        this.pageLoading = false
      })
    },
    handleAllDelete () {
      this.$confirm(this.$t('hintText.areYouSureDeleteSelectedData'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          deleteAllZation(
            this.selections.map(item => item.id)
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
        .catch(_ => {})
    },
    handleDelete (item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          deleteZation(item.id).then(rt => {
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
        .catch(_ => {})
    },
    userHandle (item, data) {
      this.linkTitle = item
      if (item === this.$t('addInternationalizationModuleConfiguration')) {
        this.editItem = {}
        this.dialogVisible = true
      } else if (item === this.$t('editInternationalizationModuleConfiguration')) {
        this.editItem = Object.assign({}, data)
        this.dialogVisible = true
      }
    },
    quickQueryData () {
      this.loading = true
      this.checkAll = false
      getZationList({
        logic: 'or',
        filters: [{ 'key': 'simplifiedchinese', 'opt': 'LIKE', 'type': 'S', 'value': this.quickData.searchData },
          { 'key': 'chinesetraditional', 'opt': 'LIKE', 'type': 'S', 'value': this.quickData.searchData },
          { 'key': 'english', 'opt': 'LIKE', 'type': 'S', 'value': this.quickData.searchData },
          { 'key': 'german', 'opt': 'LIKE', 'type': 'S', 'value': this.quickData.searchData },
          { 'key': 'japanese', 'opt': 'LIKE', 'type': 'S', 'value': this.quickData.searchData },
          { 'key': 'italian', 'opt': 'LIKE', 'type': 'S', 'value': this.quickData.searchData }
          ],
        // filters: this.filters,
        // queryFilter: ['simplifiedchinese', 'chinesetraditional', 'english', 'german', 'japanese'],
        // ...this.quickData,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          if (rt.status === '200') {
            rt.data.list.forEach(item => {
              item.checked = false
            })
            this.content = rt.data
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    getData () {
      this.loading = true
      this.checkAll = false
      getZationList({
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
            console.log(rt)
            this.content = rt.data
            this.page.total = rt.data.total
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleSort (val) {
      this.sort = val
      this.getData()
    },
    search () {
      this.filters = []
      Object.keys(this.searchForm).forEach(key => {
        const filter = {
          key,
          opt: 'LIKE',
          type: 'S',
          value: this.searchForm[key]
        }
        this.filters.push(filter)
      })
      this.getData()
    },
    reset () {
      this.searchForm = {}
      this.search()
    },
    saveSuccess (param) {
      if (param) {
        this.getData()
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
#internationalConfig{
    .upload-demo {
        display: inline-block;
        margin-right: 10px;
    }
}
</style>
