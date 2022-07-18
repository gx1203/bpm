<template>
  <el-dialog
    title="选择用户"
    :visible.sync="usersVisible"
    append-to-body>
    <el-row>
      <el-col :offset="16" :span="8">
        <el-input clearable placeholder="请输入搜索内容" v-model="searchKey">
          <el-button slot="append" icon="el-icon-search" @click="searchName"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-table
      :data="userlist"
      border
      :v-loading="pageLoading"
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'center'}"
      highlight-current-row
      style="width: 100%; margin: 10px 0px"
      @current-change="handleSelectedChange">
      <el-table-column :label="$t('placeholderText.select')" width="100" align="center">
        <template slot-scope="scope">
          <el-radio v-model="selectIndex" :label="scope.$index">{{''}}</el-radio>
        </template>
      </el-table-column>
      <el-table-column
        prop="cnname"
        :label="$t('name2')"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="sex"
        :label="$t('gender')"
        width="100"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{userlist[scope.$index].sex === '0' ? '男' : '女'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="deptname"
        :label="$t('department')"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="orgname"
        :label="$t('post')"
        show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @current-change="handleCurrentChange"
      :page-size="pageUsers.pageSize"
      :current-page.sync="pageUsers.pagenum"
      :total="pageUsers.totalCount">
    </el-pagination>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="usersVisible = false">{{ $t('cancelAction') }}</el-button>
      <el-button size="mini" type="primary" @click="submit">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getDirectUserByOrgid,getAllUsersInfo } from '../../api/flow'
export default {
  name: 'ChooseUserDialog',
  data() {
    return {
      usersVisible: false,
      pageLoading: false,
      searchKey: '',
      userlist: [],
      selectIndex: -1,
      pageUsers: {
        pageSize: 5,
        pagenum: 1,
        paginationShow: true,
        totalCount: 0
      }
    }
  },
  props: {
    value: {
      type: Boolean
    },
    radioChecked:{
      type : String,
      default: ''
    }
  },
  watch: {
    value(val) {
      this.usersVisible = val
      if(val){
        this.defaultCheck()
      }
    },
    usersVisible(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    defaultCheck () {
      if(this.radioChecked){
        this.selectIndex = this.userlist.findIndex(item => item.userid === this.radioChecked)

      }else{
          this.selectIndex = -1
      }
    },
    handleCurrentChange(val) {
      this.requserlist()
    },
    handleSelectedChange(val) {
      if (val) {
        this.selectIndex = this.userlist.findIndex(item => item.userid === val.userid)
      }
    },
    searchName() {
      this.requserlist()
    },
    requserlist() {
      this.selectIndex = -1
      this.pageLoading = true
      let postDatas = {
        logic: 'or',
        pagenum: this.pageUsers.pagenum,
        count: this.pageUsers.pageSize,
        filters: [
          {
            key:'cnname',
            opt: 'LIKE',
            type: 'S',
            value: this.searchKey
          }
        ]
      }
      getAllUsersInfo(postDatas).then((rt) => {
        if (rt.status === '200') {
          if (rt.data.list) {
            this.userlist = rt.data.list
          }
          this.pageUsers.totalCount = rt.data.total
        }
        this.pageLoading = false
      }).catch(_ => {
        this.pageLoading = false
      })
    },
    submit() {
      if (this.selectIndex >= 0) {
        const data = JSON.parse(JSON.stringify(this.userlist[this.selectIndex]))
        this.$emit('confirm', data)
      }
      this.usersVisible = false
    }
  },
  mounted() {
    this.requserlist()
  }
}
</script>

<style scoped>

</style>
