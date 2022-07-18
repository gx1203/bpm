<template>
  <el-card shadow="never" v-loading="loading">
    <div class="tool-common-wrap" v-if="isHandle !== '2'">
      <div class="btn-wrap">
        <el-button
          type="primary"
          v-if="checkData.type === '3'"
          @click="showAddPersonDialog"
          >{{ $t('addMember') }}</el-button
        >
        <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
          {{ $t('advancedQuery') }}
          <i
            :class="
              isPowerSearch ? 'el-icon-caret-top' : 'el-icon-caret-bottom'
            "
          />
        </el-button>
        <el-button type="primary" @click="getData">
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
          <el-form-item :label="$t('loginAccount') + '：'">
            <el-input
              clearable
              type="text"
              v-model="searchForm.empuid"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('name3') + '：'">
            <el-input
              clearable
              type="text"
              v-model="searchForm.displayname"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="isHandle === '2'">
          <el-form-item :label="$t('englishName') + '：'">
            <el-input
              clearable
              type="text"
              v-model="searchForm.enname"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="isHandle === '2'">
          <el-form-item :label="$t('mail') + '：'">
            <el-input
              clearable
              type="text"
              v-model="searchForm.email"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="isHandle === '2'">
          <el-form-item :label="$t('phone') + '：'">
            <el-input
              clearable
              type="text"
              v-model="searchForm.phone"
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
    <div v-if="$store.state.app.tableStyle === 'default'">
      <div class="table-header margin-t10">
        <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort" />
      </div>
      <div v-if="content.list && content.list.length !== 0">
        <div class="tr" v-for="(item, index) in content.list" :key="index">
          <div class="tr-title" v-if="isHandle === '2'">
            &nbsp;
            <!-- <span>生效日期：{{item.createDate | formatDateTime}}</span>
            <span style="margin-left: 60px">失效日期：：{{item.createDate | formatDateTime}}</span>-->
          </div>
          <div class="tr-title" v-else>&nbsp;</div>
          <el-row class="tr-body" type="flex" align="middle">
            <el-col
              class="td textHide"
              :span="headers[0].span"
              :title="item.empuid"
              >{{ item.empuid }}</el-col
            >
            <el-col
              class="td textHide"
              :span="headers[1].span"
              :title="item.displayname"
              >{{ item.displayname }}</el-col
            >
            <el-col
              class="td textHide"
              v-if="isHandle === '2'"
              :span="headers[2].span"
              :title="item.enname"
              >{{ item.enname }}</el-col
            >
            <el-col
              class="td textHide"
              v-if="isHandle === '2'"
              :span="headers[4].span"
              :title="item.phone"
              >{{ item.phone }}</el-col
            >
            <el-col
              class="td textHide"
              v-if="isHandle === '2'"
              :span="headers[3].span"
              :title="item.email"
              >{{ item.email }}</el-col
            >
            <el-col
              v-if="
                isHandle === '2' &&
                  checkData.type === '3' &&
                  item.assigned !== 'Y'
              "
              style="text-align: center"
              :span="headers[5].span"
            >
              <el-tooltip class="item" :content="$t('add')">
                <el-button type="text" @click="userHandle(item, '添加')">
                  <i class="el-icon-circle-plus"></i>
                </el-button>
              </el-tooltip>
            </el-col>
            <el-col
              v-else-if="isHandle === '1' && checkData.type === '3'"
              style="text-align: center"
              :span="headers[2].span"
            >
              <el-tooltip class="item" :content="$t('remove')">
                <el-button type="text" @click="userHandle(item, '移除')">
                  <i class="el-icon-remove"></i>
                </el-button>
              </el-tooltip>
            </el-col>
            <el-col :span="4" v-else></el-col>
          </el-row>
        </div>
      </div>
      <div v-else class="text-c pad-10px tr-empty">{{ $t('noData') }}</div>
    </div>
    <div v-else>
      <el-table
        :data="content.list"
        class="margin-t10"
        stripe
        :header-cell-style="{ background: '#E1EAFD !important' }"
        highlight-current-row
        @sort-change="elHandleSort"
        current-row-key="empuid"
      >
        <el-table-column
          :label="$t('loginAccount')"
          show-overflow-tooltip
          sortable
          prop="empuid"
        />
        <el-table-column
          :label="$t('name3')"
          show-overflow-tooltip
          sortable
          prop="name"
        />
        <el-table-column
          v-if="isHandle === '2'"
          :label="$t('englishName')"
          show-overflow-tooltip
          sortable
          prop="enname"
        />
        <el-table-column
          v-if="isHandle === '2'"
          :label="$t('phone')"
          show-overflow-tooltip
          sortable
          prop="phone"
        />
        <el-table-column
          v-if="isHandle === '2'"
          :label="$t('email')"
          show-overflow-tooltip
          sortable
          prop="email"
        />
        <el-table-column :label="$t('operation')" width="60">
          <template slot-scope="scope">
            <div
              v-if="
                isHandle === '2' &&
                  checkData.type === '3' &&
                  scope.row.assigned !== 'Y'
              "
            >
              <el-tooltip class="item" :content="$t('add')">
                <el-button type="text" @click="userHandle(scope.row, '添加')">
                  <i class="el-icon-circle-plus"></i>
                </el-button>
              </el-tooltip>
            </div>
            <div v-if="isHandle === '1' && checkData.type === '3'">
              <el-tooltip class="item" :content="$t('remove')">
                <el-button type="text" @click="userHandle(scope.row, '移除')">
                  <i class="el-icon-remove"></i>
                </el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      style="margin-top: 15px"
      :page-size="page.pageSize"
      :current-page.sync="page.pageNum"
      background
      @current-change="getData"
      :total="content.total"
    ></el-pagination>
    <manage-dialog
      v-model="dialogVisible"
      :title="linkTitle"
      :item="itemData"
      @confirm="saveSuccess"
    />
    <el-dialog :visible.sync="addDialogShow" :title="$t('addMember')">
      <!--      递归调用组件本身-->
      <index :check-data="checkData" is-handle="2" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogShow = false">{{
          $t('cancelAction')
        }}</el-button>
        <!--      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>-->
      </span>
    </el-dialog>
    <add-person-dialog
      :addPersonDialogVisible.sync="addPersonDialogVisible"
      :orgId="checkData.id"
      @close="getData"
    ></add-person-dialog>
  </el-card>
</template>
<script>
import manageDialog from './manageDialog'
import {
  findOrgUsers,
  removeRole,
  assignUser
} from '@/bpm/api/configManage/institutionalFramework/organization'
import { getUserList } from '@/bpm/api/configManage/institutionalFramework/post_manage'
import AddPersonDialog from './AddPersonDialog.vue'

export default {
  name: 'index',
  components: {
    manageDialog,
    AddPersonDialog
  },
  data() {
    return {
      addPersonDialogVisible: false,
      addDialogShow: false,
      loading: false,
      isPowerSearch: false,
      dialogVisible: false,
      linkTitle: '',
      itemData: {},
      searchForm: {},
      headers: [],
      filters: [],
      content: {
        list: [{}]
      },
      page: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  props: {
    isHandle: {
      type: String,
      default: ''
    },
    checkData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    // 显示添加人员对话框
    showAddPersonDialog() {
      this.addPersonDialogVisible = true
    },
    getData() {
      if (!this.checkData.id) return;
      this.loading = true
      if (this.isHandle === '1') {
        findOrgUsers(
          {
            logic: 'and',
            filters: this.filters,
            ...this.sort,
            ...this.page
          },
          this.checkData.id,
          // this.checkData.type !== "3"
          false
        )
          .then(rt => {
            rt.data.list.forEach(item => {
              item.id = item.memberId
              item.empid = item.memberId
              item.empuid = item.memberId
              item.enname = item.memberId
              item.displayname = item.name
              item.cnname = item.name
            })

            this.content = rt.data
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        getUserList({
          attr: {
            orgId: this.checkData.id
          },
          logic: 'and',
          filters: this.filters,
          ...this.sort,
          ...this.page
        })
          .then(rt => {
            this.content = rt.data
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    handleSort(val) {
      this.sort = val
      this.getData()
    },
    userHandle(item, type) {
      this.linkTitle = type
      if (type === '添加') {
        this.loading = true
        assignUser({
          groupId: this.checkData.id,
          mainPost: true,
          memberId: item.id
        })
          .then(rt => {
            if (rt.status === '200') {
              this.$message.success(this.$t('hintText.addedSuccess'))
              this.getData()
            } else {
              this.$message.success(this.$t('hintText.operationFailure'))
            }
          })
          .catch(er => {
            this.loading = false
          })
      } else if (type === '计划生效' || type === '计划失效') {
        this.itemData = {}
        this.dialogVisible = true
      } else if (type === '移除') {
        this.loading = true
        removeRole({
          groupId: this.checkData.id,
          mainPost: true,
          memberId: item.id
        })
          .then(rt => {
            this.loading = false
            if (rt.status === '200') {
              this.$message.success(this.$t('hintText.successfullyDelete'))
              this.getData()
            } else {
              this.$message.success(this.$t('hintText.failToDelete'))
            }
          })
          .catch(er => {
            this.loading = false
          })
      }
    },
    saveSuccess(val) {
      if (val) {
        this.getData()
      }
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
    },
    elHandleSort(data) {
      if (data.order) {
        this.sort.orderby = data.prop
        this.sort.sort = data.order === 'descending' ? 'desc' : 'asc'
      } else {
        this.sort = {}
      }
      this.getData()
    }
  },
  watch: {
    isHandle: {
      handler(val) {
        this.getData()
        // if (this.checkData.type > 0) {
        //   this.getData();
        // }
        if (val === '1') {
          this.headers = [
            {
              key: 'empuid',
              name: this.$t('loginAccount'),
              span: 10
            },
            {
              key: 'displayname',
              name: this.$t('showName'),
              span: 10
            },
            {
              name: this.$t('operation'),
              span: 4
            }
          ]
        } else {
          this.headers = [
            {
              key: 'empuid',
              name: this.$t('loginAccount'),
              span: 4
            },
            {
              key: 'displayname',
              name: this.$t('showName'),
              span: 4
            },
            {
              key: 'enname',
              name: this.$t('englishName'),
              span: 4
            },
            {
              key: 'phone',
              name: this.$t('phone'),
              span: 4
            },
            {
              key: 'email',
              name: this.$t('mail'),
              span: 4
            },
            {
              name: this.$t('operation'),
              span: 4
            }
          ]
        }
      },
      immediate: true
    },
    checkData(val) {
      this.getData()
      // if (val.type > 0) {
      //   this.getData();
      // }
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
