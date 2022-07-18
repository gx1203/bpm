<template>
  <el-dialog
    title="添加人员"
    width="70%"
    :visible.sync="addPersonDialogVisible"
    :before-close="handleClose"
  >
    <el-row type="flex" justify="end">
      <el-col :span="4" class="text-right">
        <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
          {{ $t('advancedQuery') }}
          <i
            :class="
              isPowerSearch ? 'el-icon-caret-top' : 'el-icon-caret-bottom'
            "
          />
        </el-button>
      </el-col>
    </el-row>

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
          <el-form-item :label="$t('loginAccount') + '：'" prop="empuid">
            <el-input
              clearable
              type="text"
              v-model="searchForm.empuid"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('name3') + '：'" prop="displayname">
            <el-input
              clearable
              type="text"
              v-model="searchForm.displayname"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('englishName') + '：'" prop="enname">
            <el-input
              clearable
              type="text"
              v-model="searchForm.enname"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('mail') + '：'" prop="email">
            <el-input
              clearable
              type="text"
              v-model="searchForm.email"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('phone') + '：'" prop="phone">
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
    <el-table
      :data="persons"
      class="margin-t10"
      stripe
      :header-cell-style="{ background: '#E1EAFD !important' }"
      highlight-current-row
      current-row-key="empuid"
    >
      <el-table-column
        :label="$t('loginAccount')"
        show-overflow-tooltip
        prop="empuid"
      />
      <el-table-column
        :label="$t('name3')"
        show-overflow-tooltip
        prop="cnname"
      />
      <el-table-column
        :label="$t('englishName')"
        show-overflow-tooltip
        prop="enname"
      />
      <el-table-column
        :label="$t('phone')"
        show-overflow-tooltip
        prop="phone"
      />
      <el-table-column
        :label="$t('email')"
        show-overflow-tooltip
        prop="email"
      />
      <el-table-column :label="$t('operation')" width="60">
        <template v-if="scope.row.assigned !== 'Y'" slot-scope="scope">
          <el-tooltip class="item" :content="$t('add')">
            <el-button type="text" @click="addPerson(scope.row)">
              <i class="el-icon-circle-plus"></i>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @current-change="handleCurrentChange"
      :current-page="pageInfo.pageNum"
      :page-size="pageInfo.pageSize"
      layout="total, prev, pager, next"
      :total="pageInfo.total"
    >
    </el-pagination>
    <!-- <span slot="footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span> -->
  </el-dialog>
</template>

<script>
import { assignUser } from '@/bpm/api/configManage/institutionalFramework/organization'
import { getUserList } from '@/bpm/api/configManage/institutionalFramework/post_manage'
export default {
  props: {
    addPersonDialogVisible: {
      type: Boolean,
      default: false
    },
    orgId: {
      type: String
    }
  },
  data() {
    return {
      persons: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      isPowerSearch: false,
      searchForm: {
        empuid: '',
        displayname: '',
        enname: '',
        email: '',
        phone: ''
      },
      filters: []
    }
  },
  watch: {
    addPersonDialogVisible: {
      handler(val) {
        console.log(val)
        if (val) {
          this.getPersons()
        }
      },
      immediate: true
    },
    searchForm: {
      handler(val) {
        console.log(val)
        if (
          val.empuid === '' &&
          val.displayname === '' &&
          val.enname === '' &&
          val.email === '' &&
          val.phone === ''
        ) {
          this.filters = []
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:addPersonDialogVisible', false)
      this.$emit('close')
    },
    // 获取人员列表
    async getPersons() {
      const res = await getUserList({
        attr: {
          orgId: this.orgId
        },
        logic: 'and',
        filters: this.filters,
        ...this.pageInfo
      })
      // console.log(res.data.list)
      this.pageInfo.total = res.data.total
      this.persons = res.data.list
    },
    // 添加人员
    async addPerson(rowData) {
      const res = await assignUser({
        groupId: this.orgId,
        mainPost: true,
        memberId: rowData.id
      })
      if (res.status === '200') {
        this.$message.success(this.$t('hintText.addedSuccess'))
        this.getPersons()
      } else {
        this.$message.success(this.$t('hintText.operationFailure'))
      }
    },
    // 页码改变事件
    handleCurrentChange(newPageNum) {
      this.pageInfo.pageNum = newPageNum
      this.getPersons()
    },
    // 搜索
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
      this.pageInfo.pageNum = 1
      this.getPersons()
    },
    // 重置搜索表单
    reset() {
      this.$refs.searchForm.resetFields()
      this.filters = []
      this.pageInfo.pageNum = 1
      this.getPersons()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-pagination {
  margin-top: 15px;
}
</style>
