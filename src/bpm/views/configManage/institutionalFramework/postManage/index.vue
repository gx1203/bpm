<template>
  <el-card shadow="never" class="card-reset">
    <!--    表格-->
    <bas-table
      row-key="id"
      :tableList="content.list"
      :headerList="headerList"
      :pages="page"
      selectType="checkbox"
      @selectionChange="handleSelectionChange"
      @currentChange="currentChange"
    >
    <!-- 自定义搜索区域 -->
      <template #search>
        <div>
          <div class="tool-common-wrap">
            <div class="search-wrap">
              <quick-query ref="quick" :placeholder="$t('placeholderText.multipleFieldsPlaceholder35')" :is-date="false"
                @quickSearch="quickSearch" />
            </div>
            <div class="btn-wrap">
              <el-upload class="upload-demo" :action="action" name="file" :data="{'dataType':'positions'}" :headers="headData"
                :show-file-list='false' :before-upload="beforeAvatarUpload" :on-success="uploadSuccess"
                :on-error="uploadError" style="display: inline-block;margin-right: 10px;">
                <el-button type="primary">
                  {{ $t('import') }}
                  <!--<i class="el-icon-upload2" />-->
                </el-button>
              </el-upload>
              <export :filters="filters" :selections="selections" type="positionsExport" />
              <el-button type="primary" @click="userHandle($t('addPostGroup'))">
                {{ $t('add') }}
                <!---->
              </el-button>
              <el-button type="primary" :disabled="selections.length === 0" @click="handleAllDelete">
                {{ $t('batchDelete') }}
                <!--<i class="el-icon-circle-close" />-->
              </el-button>
              <!-- <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
                {{ $t('advancedQuery') }}
                <i :class="isPowerSearch?'el-icon-caret-top':'el-icon-caret-bottom'" />
              </el-button> -->
              <el-button type="primary" @click="rest">
                {{ $t('refresh') }}
                <!---->
              </el-button>
            </div>
          </div>
          <el-form
            v-if="isPowerSearch"
            class="power-search"
            :model="searchForm"
            label-width="120px"
            @keyup.enter.native="powerSearch"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('processName') + '：'">
                  <el-input
                    v-model="searchForm.processCnname"
                    clearable
                    type="text"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('applicationNumber') + '：'">
                  <el-input v-model="searchForm.reqNo" clearable type="text" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('subject') + '：'">
                  <el-input
                    v-model="searchForm.subject"
                    clearable
                    type="text"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('applicant') + '：'">
                  <el-input
                    v-model="searchForm.drafter"
                    clearable
                    type="text"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('applicationDate') + '：'">
                  <el-date-picker
                    v-model="searchForm.reqDate"
                    type="daterange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                    :range-separator="$t('placeholderText.to')"
                    :start-placeholder="$t('placeholderText.startDate')"
                    :end-placeholder="$t('placeholderText.endDate')"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('receiptTime') + '：'">
                  <el-date-picker
                    v-model="searchForm.assignedDate"
                    type="daterange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                    :range-separator="$t('placeholderText.to')"
                    :start-placeholder="$t('placeholderText.startDate')"
                    :end-placeholder="$t('placeholderText.endDate')"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('agenttype') + '：'">
                  <el-select v-model="searchForm.category" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
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
      <!-- 岗位组名称 -->
      <template #name="{ row }">
        <div>
          {{ row.name }}
        </div>
      </template>
      <!-- 排序 -->
      <template #sortid="{ row }">
        <div>
          {{ row.sortid }}
        </div>
      </template>
      <!-- 等级 -->
      <template #grade="{ row }">
        <div>
          {{ row.grade }}
        </div>
      </template>
      <!-- 备注 -->
      <template #explain="{ row }">
        <div>
          {{ row.explain }}
        </div>
      </template>
      <!-- 操作 -->
      <template #org="{ row }">
        <el-tooltip class="item" :content="$t('edit')" placement="top">
          <el-button type="text" @click="userHandle($t('editPostGroup'),row)" >{{ $t('edit') }}</el-button>
        </el-tooltip>
        <el-tooltip class="item" :content="$t('configurePostGroup')" placement="top">
          <el-button type="text"
            @click="userHandle($t('configurePostGroup'), row)">{{ $t('configurePostGroup') }}</el-button>
        </el-tooltip>
        <el-tooltip class="item" :content="$t('delete')" placement="top">
          <el-button type="text" @click="handleDeleteOne(row)">{{ $t('delete') }}</el-button>
        </el-tooltip>
      </template>
    </bas-table>
    <post-manage-dialog v-model="dialogVisible" :item="editItem" :title="linkTitle" @confirm="saveSuccess" />
    <business-rule-dialog v-model="businessDialogVisible" />
    <!--<configure-Jobs v-model="configureJobsDialogVisible" :itemid="editItem.id" :title="'配置岗位组&#45;&#45;'+editItem.name+'&#45;&#45;所有参数实时保存'" @confirm="saveSuccess" />-->
    <bas-organieation v-model="organieationShow" :selected-element="selectedElement" :is-specified-group-but="false"
      :is-show-bustom-groups-but="false" :select-element="selectElement" :show-element="showElement" :title="orgtitle"
      :multiple="basOrganieationMultiple" @fnCallBack="fnBasOrganieationCallBack" />
  </el-card>
</template>
<script>
import Vue from 'vue'
import postManageDialog from './postManageDialog'
import businessRuleDialog from './businessRuleDialog'
import configureJobs from './configureJobs'
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import Export from '@/bpm/components/export/Export'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import axios from 'axios'
import {
  getPositionsList,
  deletePositions,
  deleteAllPositions,
  getPostInfos,
  savePostOrg
} from '@/bpm/api/configManage/institutionalFramework/post_manage'
import BasComponent from 'bas-component'
Vue.use(BasComponent)
import 'bas-component/lib/BasComponent.css'
export default {
  name: 'PostManage',
  components: {
    postManageDialog,
    QuickQuery,
    configureJobs,
    businessRuleDialog,
    Export
  },
  mixins: [SearchListMixin],
  data () {
    return {
      headData: {
        token: localStorage.getItem('token')
      },
      action: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/datamanage/dataImport`,
      organieationShow: false,
      selectedElement: {},
      showElement: [],
      selectElement: ['3'],
      orgtitle: this.$t('configurePostGroup'),
      basOrganieationMultiple: true,
      isPowerSearch: false,
      dialogVisible: false,
      businessDialogVisible: false,
      editItem: {},
      linkTitle: '',
      postidList: [],
      headers: [
        {
          key: 'name',
          name: this.$t('positionGroupName'),
          span: 5
        },
        {
          key: 'sortid',
          name: this.$t('sort'),
          span: 5
        },
        {
          key: 'grade',
          name: this.$t('grade'),
          span: 5
        },
        {
          key: 'explain',
          name: this.$t('remarks'),
          span: 5
        },
        {
          name: this.$t('operation'),
          span: 4
        }
      ],
      selections: [],
      checkAll: '',
      // 表头字段
      headerList: [
        {
          label: '', // 星标
          prop: 'starmark',
          slotName: 'starmark',
          width: 35
        },
        {
          label: this.$t('positionGroupName'), // 岗位组名称
          prop: 'name',
          slotName: 'name',
          sortable: true
        },
        {
          label: this.$t('sort'), // 排序
          prop: 'sortid',
          slotName: 'sortid',
          sortable: true
        },
        {
          label: this.$t('grade'), // 等级
          prop: 'grade',
          sortable: true,
        },
        {
          label: this.$t('remarks'), // 备注
          prop: 'explain',
          slotName: 'explain',
          sortable: true
        },
        {
          label: this.$t('operation'), // 操作
          prop: 'org',
          slotName: 'org',
          sortable: false
        }
      ],
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
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
      if (this.searchType === 'power') {
        this.getData()
      } else if (this.searchType === 'quick') {
        this.quickQueryData()
      }
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
        url: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/datamanage/positionsExport`,
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
        link.setAttribute('download', '岗位组.json')
        document.body.appendChild(link)
        link.click()
      }).catch(() => {
        this.pageLoading = false
      })
    },
    handleDeleteOne (item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          deletePositions(item.id).then(rt => {
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
              this.$message({
                message: this.$t('hintText.failToDelete'),
                type: 'error'
              })
            }
          })
        })
        .catch(_ => { })
    },
    handleAllDelete () {
      this.$confirm(this.$t('hintText.areYouSureDeleteSelectedData'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          deleteAllPositions(
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
    quickQueryData () {
      this.loading = true
      this.checkAll = false

      getPositionsList({
        logic: 'or',
        filters: this.filters,
        queryFilter: ['name', 'sortid', 'grade', 'explain'],
        ...this.quickData,
        ...this.sort,
        ...this.page
      }).then(rt => {
        rt.data.list.forEach(item => {
          item.checked = false
        })
        this.page.total = rt.data.total
        this.content = rt.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    userHandle (item, data) {
      this.linkTitle = item
      if (item === this.$t('addPostGroup')) {
        this.editItem = {}
        this.dialogVisible = true
      } else if (item === this.$t('editPostGroup')) {
        this.editItem = Object.assign({}, data)
        this.dialogVisible = true
      } else if (item === '查看所属业务规则') {
        this.businessDialogVisible = true
      } else if (item === this.$t('configurePostGroup')) {
        this.editItem = data
        getPostInfos(data.id).then(rt => {
          const postInfos = rt.data
          this.selectedElement = {}
          const nameList = []
          const idType = []
          this.postidList = []
          if (postInfos && postInfos.length > 0) {
            for (let i = 0; i < postInfos.length; i++) {
              nameList.push(postInfos[i].name)
              this.postidList.push(postInfos[i].id)
              idType.push(postInfos[i].id + '-3')
            }
            this.selectedElement = {
              id: this.postidList,
              name: nameList.join('&'),
              idType: idType.join(';')
            }
          }
          this.organieationShow = true
        }).catch(er => {
          this.selectedElement = {}
          this.organieationShow = true
        })
      }
    },
    getData () {
      this.loading = true
      this.checkAll = false
      getPositionsList({
        logic: 'and',
        filters: this.filters,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          rt.data.list.forEach(item => {
            item.checked = false
          })
          this.page.total = rt.data.total
          this.content = rt.data
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
    },
    fnBasOrganieationCallBack (data) {
      const addPostidList = []
      const deletePostidList = []
      let ids = data.id.split(',')
      if (data.id.length === 0) {
        ids = []
      }
      savePostOrg({
        'id': this.editItem.id,
        'orgids': ids
      })
        .then(rt => {
          if (rt.status === '200') {
            this.organieationShow = false
            this.$message({
              message: this.$t('hintText.saveSuccessfully'),
              type: 'success'
            })
          } else {
            this.$message({
              message: this.$t('hintText.failToSave'),
              type: 'error'
            })
          }
        })
        .catch(() => {
          this.$message({
            message: this.$t('hintText.failToSave'),
            type: 'error'
          })
        })
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
