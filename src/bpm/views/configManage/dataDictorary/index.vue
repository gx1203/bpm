<template>
  <el-card shadow="never" class="card-reset">
    <div v-loading="loading">
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
                <quick-query
                  :placeholder="$t('placeholderText.multipleFieldsPlaceholder25')"
                  :isDate="false"
                  ref="quick"
                  @quickSearch="quickSearch"
                />
              </div>
              <div class="btn-wrap">
                <el-upload
                  class="upload-demo"
                  :action="action"
                  name="file"
                  :data="{ dataType: 'datadictionary' }"
                  :headers="headData"
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                  :on-success="uploadSuccess"
                  :on-error="uploadError"
                  style="display: inline-block;margin-right: 10px;"
                >
                  <el-button type="primary">
                    {{ $t('import') }}
                    <!--<i class="el-icon-upload2" />-->
                  </el-button>
                </el-upload>
                <export
                  :filters="filters"
                  :selections="selections"
                  type="datadictionaryExport"
                />
                <el-button type="primary" @click="addList($t('addDataDictionary'))">
                  {{ $t('add') }}
                  <!---->
                </el-button>
                <el-button
                  type="primary"
                  @click="handleAllDelete"
                  :disabled="selections.length === 0"
                >
                  {{ $t('batchDelete') }}
                  <!--<i class="el-icon-circle-close" />-->
                </el-button>
                <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
                  {{ $t('advancedQuery') }}
                  <i
                    :class="
                      isPowerSearch ? 'el-icon-caret-top' : 'el-icon-caret-bottom'
                    "
                  />
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
                  <el-form-item :label="$t('numbering') + '：'">
                    <el-input
                      clearable
                      type="text"
                      v-model="searchForm.dictionaryen"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('name2') + '：'">
                    <el-input
                      clearable
                      type="text"
                      v-model="searchForm.dictionarycn"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('sqlStatement') + '：'">
                    <el-input
                      clearable
                      type="text"
                      v-model="searchForm.customsql"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('expand') + '：'">
                    <el-input
                      clearable
                      type="text"
                      v-model="searchForm.extension"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" class="text-r">
                  <el-button type="primary" @click="search">{{
                    $t('query')
                  }}</el-button>
                  <el-button type="primary" @click="reset">{{ $t('reset') }}</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </template>
        <!-- 编号  -->
        <template #dictionaryen="{ row }">
          <div>{{ row.dictionaryen }}</div>
        </template>
        <!-- 名称  -->
        <template #dictionarycn="{ row }">
          <div>{{ row.dictionarycn }}</div>
        </template>
        <!-- sql语句  -->
        <template #customsql="{ row }">
          <div>{{ row.customsql }}</div>
        </template>
        <!-- 扩展  -->
        <template #extension="{ row }">
          <div>{{ row.extension }}</div>
        </template>
        <!-- 操作 -->
        <template #id="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('editDataDictionary')"
            placement="top"
          >
            <el-button
              type="text"
              @click="addList($t('editDataDictionary'), row)"
            >
              {{ $t('editDataDictionary') }}
            </el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('setUp')"
            placement="top"
          >
            <el-button type="text" @click="setList(row)">{{
              $t('setUp')
            }}</el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('delete')"
            placement="top"
          >
            <el-button type="text" @click="handleDelete(row)">{{
              $t('delete')
            }}</el-button>
          </el-tooltip>
        </template>
      </bas-table>
    </div>

    <data-dictorary-dialog
      v-model="dialogVisible"
      :item="editItem"
      :title="linkTitle"
      @confirm="saveSuccess"
    />
    <set-select-dialog
      v-model="dialogVisibleSet"
      :item="setItemId"
      @confirm="saveSuccess"
    />
  </el-card>
</template>

<script>
import DataDictoraryDialog from './DataDictoraryDialog'
import SetSelectDialog from './SetSelectDialog'
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import Export from '@/bpm/components/export/Export'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import axios from 'axios'
import {
  getDictoraryList,
  deleteDictorary,
  deleteAllDictorary
} from '@/bpm/api/configManage/dataDictorary'
export default {
  name: 'dataDictorary',
  components: {
    DataDictoraryDialog,
    SetSelectDialog,
    QuickQuery,
    Export
  },
  mixins: [SearchListMixin],
  data() {
    return {
      headData: {
        token: localStorage.getItem('token')
      },
      // 加主机和端口本地开发会报错  ${process.env.VUE_APP_HOST_URL}
      action: `${process.env.VUE_APP_BASE_URL}/datamanage/dataImport`,
      loading: false,
      dialogVisible: false,
      isPowerSearch: false,
      dialogVisibleSet: false,
      reportList: [
        {
          starttime: 'dsgds'
        }
      ],
      editItem: {},
      linkTitle: '',
      searchForm: {},
      setItemId: '',
      headers: [
        {
          key: 'dictionaryen',
          name: this.$t('numbering'),
          span: 3
        },
        {
          key: 'dictionarycn',
          name: this.$t('name2'),
          span: 6
        },
        {
          key: 'customsql',
          name: this.$t('sqlStatement'),
          span: 6
        },
        {
          key: 'extension',
          name: this.$t('expand'),
          span: 5
        },
        {
          name: this.$t('operation'),
          span: 4
        }
      ],
      selections: [],
      filters: [],
      content: {
        list: [{}]
      },
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      checkAll: '',
      // 表头字段
      headerList: [
        {
          label: this.$t('numbering'), // 编号
          prop: 'dictionaryen',
          slotName: 'dictionaryen',
          sortable: false
        },
        {
          label: this.$t('name2'), // 名称
          prop: 'dictionarycn',
          slotName: 'dictionarycn',
          sortable: false
        },
        {
          label: this.$t('sqlStatement'), // sql语句
          prop: 'customsql',
          slotName: 'customsql',
          sortable: false
        },
        {
          label: this.$t('expand'), // 扩展
          prop: 'extension',
          slotName: 'extension',
          sortable: true
        },
        {
          label: this.$t('operation'), // 操作
          prop: 'id',
          slotName: 'id',
          sortable: false,
          width: "180"
        }
      ]
    }
  },
  mounted() {
    this.getData()
    console.log('🍓🍓this.$route', this.$route)
    if(this.$route.query.showDictionaryDialog) {
      this.addList(this.$t('addDataDictionary'))
    }
  },
  watch: {
    'content.list': {
      handler(val) {
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
    checkAll(val) {
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
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 100
      let postfix = file.name.replace(/.+\./, '')
      const isPostfix = ['JSON'].indexOf(postfix.toUpperCase()) === -1
      if (isPostfix) {
        this.$message.error(this.$t('hintText.pleaseUploadJsonFile'))
      }
      if (!isLt2M) {
        this.$message.error(
          this.$t('hintText.uploadAttachmentSizeCannotExceed')
        )
      }
      if (!isPostfix && isLt2M) {
        this.loading = true
      }
      return !isPostfix && isLt2M
    },
    uploadSuccess(file) {
      console.log('🍓上传成功后', file)
      this.loading = false
      if (file.status === '200') {
        this.$message.success(this.$t('hintText.importedSuccessfully'))
        this.getData()
      } else {
        // this.$message.error(this.$t('hintText.importFileError'))
        this.$message.error(file.message)
      }
    },
    uploadError(err) {
      this.loading = false
      // if (err.message) {
      //   let data = JSON.parse(err.message)
      //   this.$message.error(data.message)
      // } else {
      //   this.$message.error(this.$t('hintText.importFailed'))
      // }
      this.$message.error(this.$t('hintText.importFileError'))
    },
    excelFile() {
      this.pageLoading = true
      axios({
        method: 'post',
        url: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/datamanage/datadictionaryExport`,
        data: {
          filters: [
            ...this.filters,
            ...[
              {
                key: 'id',
                value: this.selections.map(x => x.id).join(','),
                opt: 'IN'
              }
            ]
          ]
        },
        headers: {
          token: localStorage.getItem('token')
        },
        responseType: 'blob'
      })
        .then(res => {
          this.pageLoading = false
          let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
          let url = window.URL.createObjectURL(blob)
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '数据字典.json')
          document.body.appendChild(link)
          link.click()
        })
        .catch(() => {
          this.pageLoading = false
        })
    },
    saveSuccess(data) {
      if (data) {
        this.getData()
      }
    },
    handleAllDelete() {
      this.$confirm(
        this.$t('hintText.areYouSureDeleteSelectedData'),
        this.$t('hintText.hint'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          this.loading = true
          deleteAllDictorary(
            this.selections.map(item => item.id).join(',')
          ).then(rt => {
            if (rt.status === '200') {
              if (this.searchType === 'power') {
                this.getData()
              } else if (this.searchType === 'quick') {
                this.quickQueryData()
              }
              this.$message({
                message: this.$t('hintText.successfullyDelete'),
                type: 'success'
              })
            } else {
              this.loading = false
              this.$message({
                message: this.$t('hintText.failToDelete'),
                type: 'error'
              })
            }
          })
        })
        .catch(_ => {
          this.loading = false
        })
    },
    handleDelete(item) {
      this.$confirm(
        this.$t('hintText.areYouSureDelete'),
        this.$t('hintText.hint'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          this.loading = true
          deleteDictorary(item.id).then(rt => {
            if (rt.status === '200') {
              if (this.searchType === 'power') {
                this.getData()
              } else if (this.searchType === 'quick') {
                this.quickQueryData()
              }
              this.$message({
                message: this.$t('hintText.successfullyDelete'),
                type: 'success'
              })
            } else {
              this.loading = false
              this.$message({
                message: this.$t('hintText.failToDelete'),
                type: 'error'
              })
            }
          })
        })
        .catch(_ => {
          this.loading = false
        })
    },
    addList(item, data) {
      if (item === this.$t('addDataDictionary')) {
        this.dialogVisible = true
        this.linkTitle = item
        this.editItem = {}
      } else if (item === this.$t('editDataDictionary')) {
        this.dialogVisible = true
        this.linkTitle = item
        this.editItem = Object.assign({}, data)
      }
    },
    setList(item) {
      this.dialogVisibleSet = true
      this.setItemId = item.id
    },
    quickQueryData() {
      this.loading = true
      this.checkAll = false
      let filters = [
        {
          key: 'dictionaryen',
          opt: 'LIKE',
          type: 'S',
          value: this.quickData.searchData
        },
        {
          key: 'dictionarycn',
          opt: 'LIKE',
          type: 'S',
          value: this.quickData.searchData
        }
      ]
      getDictoraryList({
        logic: 'or',
        filters: filters,
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
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    getData() {
      this.loading = true
      this.checkAll = false
      getDictoraryList({
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
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleSort(val) {
      this.sort = val
      this.getData()
    },
    search() {
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
    reset() {
      this.searchForm = {}
      this.search()
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
</style>
