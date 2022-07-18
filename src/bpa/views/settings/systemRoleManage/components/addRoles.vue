<template>
  <div id="addRolePart">
    <el-dialog title="添加成员信息" :visible.sync="dialogVisible" @close="closeDialog" width="50%">
      <el-row>
        <el-col :span="12">
          <el-input
            placeholder="请输入内容"
            class="search_component"
            v-model="input3"
            clearable
            @keyup.13.native="getList"
          >
            <el-button type="primary"  slot="append" @click.stop="pages.pageNum = 1;getList();"> {{$t('search')}}</el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="roleList" class="main_tab">
        <el-table-column :label="$t('number')" type="index"></el-table-column>
        <el-table-column prop="displayname" label="姓名"></el-table-column>
        <el-table-column prop="empuid" label="账号"></el-table-column>
        <el-table-column width="80px" :label="$t('operation')">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="添加" placement="top">
              <el-button @click="addRow(scope.row)" class="no-border" icon="el-icon-plus" circle></el-button>
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
  </div>
</template>

<script>
import {
  showMemberInfo,
  addMemberInfo
} from '@/bpa/api/settings/systemRoleManage'
import paginations from '@/bpa/mixins/pagination_mixin'
export default {
  name: 'addRoles',
  data() {
    return {
      roleList: [],
      dialogVisible: false,
      input3: '',
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
      showMemberInfo({
        attr: {
          roleid: this.rowId
        },
        filters: [
          { key: 'cnname', opt: 'LIKE', type: 'S', value: this.input3 },
          { key: 'empuid', opt: 'LIKE', type: 'S', value: this.input3 }
        ],
        logic: 'or',
        orderby: '',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: 'desc'
      }).then(res => {
        this.roleList = res.list
        this.pages.total = res.total
      })
    },
    addRow(item) {
      addMemberInfo({
        userId: item.empuid,
        roleId: this.rowId
      }).then(res => {
        this.$message({
          type: 'success',
          message: '添加成功!'
        })
        this.pages.pageNum = 1
        this.getList()
      })
    },
    closeDialog(done) {
      this.$emit('confirm', '')
    }
  }
}
</script>
