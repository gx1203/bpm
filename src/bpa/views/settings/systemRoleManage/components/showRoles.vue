<template>
  <div id="addRolePart">
    <el-dialog
      title="角色成员信息"
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row>
        <el-col :span="12">
          <el-input
            placeholder="请输入内容"
            class="search_component"
            v-model="input3"
            clearable
            @keyup.13.native="getList"
          >
            <el-button type="primary" slot="append" @click.stop="pages.pageNum = 1;getList();"> {{$t('search')}}</el-button>
          </el-input>
        </el-col>
        <el-col :span="6" :offset="6" class="search_buttons_wrap">
          <el-button type="primary" @click="newRow">添加</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList" class="main_tab">
        <el-table-column :label="$t('number')" type="index"></el-table-column>
        <el-table-column prop="displayname" label="姓名"></el-table-column>
        <el-table-column prop="empuid" label="账号"></el-table-column>
        <el-table-column width="80px" :label="$t('operation')">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
              <el-button
                @click="deleteRow(scope.row)"
                class="no-border"
                icon="el-icon-delete"
                circle
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pages.pageNum"
        :page-size="pages.pageSize"
        background
        layout="prev, pager, next, jumper, total"
        :total="pages.total"
      ></el-pagination>
    </el-dialog>
    <add-roles v-model="selectPersonVisible" :rowId="operateId" @confirm="getList"></add-roles>
  </div>
</template>

<script>
import {
  queryRoleInfo,
  delMemberInfo
} from '@/bpa/api/settings/systemRoleManage'
import paginations from '@/bpa/mixins/pagination_mixin'
import addRoles from './addRoles.vue'
export default {
  name: 'showRoles',
  components: {
    addRoles
  },
  data() {
    return {
      roleList: [],
      dialogVisible: false,
      selectPersonVisible: false,
      input3: '',
      operateId: '',
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      }
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    rowId: {
      type: String,
      default: ''
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.dialogVisible = val
        this.pages.pageNum = 1
        this.getList()
      }
    },
    dialogVisible(val) {
      this.$emit('input', val)
    }
  },
  mixins: [paginations],
  mounted() {},
  methods: {
    getList() {
      queryRoleInfo({
        attr: {
          roleid: this.rowId
        },
        fullFilters: [
          {
            filters: [
              {
                key: 'cnname',
                opt: 'LIKE',
                type: 'S',
                value: this.input3,
                logic: 'or'
              },
              {
                key: 'empuid',
                opt: 'LIKE',
                type: 'S',
                value: this.input3,
                logic: 'or'
              }
            ]
          }
        ],
        logic: 'or',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize
      }).then(res => {
        this.roleList = res.list
        this.pages.total = res.total
      })
    },
    deleteRow(item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
        .then(() => {
          delMemberInfo({
            refid: item.empuid,
            targetid: this.rowId
          }).then(res => {
            this.$message({
              type: 'success',
              message: this.$t('hintText.successfullyDelete')
            })
            this.pages.pageNum = 1
            this.getList()
          })
        })
        .catch(() => {})
    },
    newRow() {
      this.selectPersonVisible = true
      this.operateId = this.rowId
    }
  }
}
</script>
