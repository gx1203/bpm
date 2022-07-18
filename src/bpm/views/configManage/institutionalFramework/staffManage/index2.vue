<template>
  <el-card shadow="never">
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <quick-query ref="quick" placeholder="登录名、工号、姓名、英文名、邮件、电话" :is-date="false" @quickSearch="quickSearch" />
      </div>
      <div class="btn-wrap">
        <el-button type="primary" @click="addList('添加员工信息')">
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
    <div v-loading="loading">
      <el-form
        v-if="isPowerSearch"
        ref="searchForm"
        class="power-search"
        :model="searchForm"
        label-width="120px"
        size="mini"
        @keyup.enter.native="powerSearch"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="登录名：">
              <el-input clearable v-model="searchForm.empuid" type="text" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('workNumber') + '：'">
              <el-input clearable v-model="searchForm.empid" type="text" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('name3') + '：'">
              <el-input clearable v-model="searchForm.cnname" type="text" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('englishName') + '：'">
              <el-input clearable v-model="searchForm.enname" type="text" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('mail') + '：'">
              <el-input clearable v-model="searchForm.email" type="text" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('phone') + '：'">
              <el-input clearable v-model="searchForm.phone" type="text" />
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
      <div class="table-header margin-t10">
        <el-checkbox v-model="checkAll" style="left: 10px;" class="all-check" />
        <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort" />
      </div>
      <div v-if="content.list && content.list.length!==0">
        <div v-for="(item, index) in content.list" :key="index" class="tr">
          <div class="tr-title" style="padding:8px 10px;">
            <el-checkbox v-model="item.checked" />
          </div>
          <el-row class="tr-body" type="flex" align="middle">
            <el-col class="td textHide" :span="headers[0].span" :title="item.empuid">
              {{ item.empuid }}
            </el-col>
            <el-col class="td textHide" :span="headers[1].span" :title="item.empid">
              {{ item.empid }}
            </el-col>
            <el-col class="td textHide" :span="headers[2].span" :title="item.cnname">
              {{ item.cnname }}
            </el-col>
            <el-col class="td textHide" :span="headers[3].span" :title="item.enname">
              {{ item.enname }}
            </el-col>
            <el-col class="td textHide" :span="headers[4].span" :title="item.email">
              {{ item.email }}
            </el-col>
            <el-col class="td textHide" :span="headers[5].span" :title="item.phone">
              {{ item.phone }}
            </el-col>
            <el-col style="text-align: center" :span="headers[6].span">
              <el-tooltip class="item" content="查看">
                <el-button type="text" @click="addList('查看员工信息',item)">
                  <i class="iconfont icon-check-line" />
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" :content="$t('edit')">
                <el-button type="text" icon="el-icon-edit" @click="addList('编辑员工信息',item)" />
              </el-tooltip>
              <el-tooltip class="item" :content="$t('delete')">
                <el-button type="text" icon="el-icon-delete" @click="handleDeleteOne(item)" />
              </el-tooltip>
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-else class="text-c pad-10px tr-empty">
         {{ $t('noData') }}
      </div>

      <el-pagination
        style="margin-top: 15px"

        :page-size="page.pageSize"
        :current-page.sync="page.pageNum"
        background
        :total="content.total"
        @current-change="searchType === 'power' ? getData() : quickQueryData()"
      />
      <staff-manage-dialog
        v-model="dialogVisible"
        :detail="editItem"
        :title="linkTitle"
        @confirm="saveSuccess"
      />
    </div>
    <staff-manage-info v-model="staffManageInfoDialog" :detail="editItem" :title="linkTitle" />
  </el-card>
</template>
<script>
import staffManageDialog from './staffManageDialog'
import staffManageInfo from './staffManageInfo'
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import { getUserList, deleteUser, deleteUsers } from '@/bpm/api/configManage/institutionalFramework/post_manage'
export default {
  name: 'StaffManage',
  components: {
    staffManageDialog,
    staffManageInfo,
    QuickQuery
  },
  mixins: [SearchListMixin],
  data() {
    return {
      isPowerSearch: false,
      dialogVisible: false,
      staffManageInfoDialog: false,
      editItem: {},
      linkTitle: '',
      headers: [
        {
          key: 'empuid',
          name: '登录名',
          span: 3
        },
        {
          key: 'empid',
          name: '工号',
          span: 3
        },
        {
          key: 'cnname',
          name: '姓名',
          span: 4
        },
        {
          key: 'enname',
          name: '英文名',
          span: 4
        },
        {
          key: 'email',
          name: '邮件',
          span: 4
        },
        {
          key: 'phone',
          name: '电话',
          span: 3
        },
        {
          name: this.$t('operation'),
          span: 3
        }
      ],
      selections: [],
      checkAll: ''
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
  mounted() {
    this.getData()
  },
  methods: {
    handleDeleteOne(item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      }).then(() => {
        deleteUser(item.id).then(rt => {
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
      }).catch(_ => {})
    },
    handleAllDelete() {
      const ids = this.selections.map(item => item.id)
      this.$confirm(this.$t('hintText.areYouSureDeleteSelectedData'), this.$t('hintText.hint'), {
        type: 'warning'
      }).then(() => {
        deleteUsers(ids).then(rt => {
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
      }).catch(_ => {})
    },
    quickQueryData() {
      this.loading = true
      this.checkAll = false

      getUserList({
        logic: 'or',
        filters: this.filters,
        queryFilter: ['empuid', 'cnname', 'email', 'empid', 'enname', 'phone'],
        ...this.quickData,
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
    },
    addList(item, data) {
      this.linkTitle = item
      if (item === '添加员工信息') {
        this.editItem = {}
        this.dialogVisible = true
      } else if (item === '编辑员工信息') {
        this.editItem = Object.assign({}, data)
        this.dialogVisible = true
      } else {
        this.editItem = data
        this.staffManageInfoDialog = true
      }
    },
    getData() {
      this.loading = true
      this.checkAll = false
      getUserList({
        logic: 'and',
        filters: this.filters,
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
    },
    saveSuccess(param) {
      if (param) {
        if (this.searchType === 'quick') {
          this.quickQueryData()
        } else {
          this.getData()
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
