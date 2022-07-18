<template>
  <el-container class="msg-conten">
    <el-aside width="200px" style="background: #f5f5f5">
      <div style="padding:5px;">
        <portal-login-info
          :options = "logininfoset"
          :logindata = "logininfo"
          style="width: 99%;"
        />
        <div class="button-warrper">
          <el-button class="upload-button">上传文档</el-button>
        </div>
      </div>
      <know-tree-index/>
    </el-aside>
    <el-aside width="85%" style="padding: 0 10px;">
      <!-- 搜索 -->
      <div class="msg-secu">
        <el-input clearable v-model="input" size="small" placeholder="请输入内容" class="input-with-select">
          <el-button slot="append" type="primary" icon="el-icon-search" @click="search" />
        </el-input>
        <span class="msg-delete">
          <el-button type="primary" size="mini" icon="el-icon-circle-close" @click="alldelete">批量删除</el-button>
          <el-button type="primary" size="mini" icon="el-icon-copy-document" @click="restore">还原</el-button>
        </span>
      </div>
      <!-- 列表 -->
      <el-table
        :data="tableData"
        :default-sort = "{prop: 'date', order: 'descending'}"
        style="width: 100%;"
        size="small"
        class="msg-table"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" />
        <el-table-column type="index" label="#" />
        <el-table-column prop="title" label="标题" sortable show-overflow-tooltip />
        <el-table-column prop="dimension" label="删除人" sortable />
        <el-table-column prop="date" label="日期" sortable width="180" />
      </el-table>
      <portal-pagination
        :pagination-obj="pagination"
        class="msg-pages"
        @handleSizeChange="SizeChange"
        @handleCurrentChange="CurrentChange" />
    </el-aside>
  </el-container>
</template>
<script>
import KnowTreeIndex from '../components/tree1'
import PortalLoginInfo from '@/bpa/components/protal/portallogininfo'
import userImg from '@/bpa/assets/img/user.png'

import PortalPagination from '@/bpa/components/protal/Pagination'
// import { getComments } from '@/bpa/api/common/protal/protalscore'
export default {
  name: 'KnowLedgeIndex',
  components: {
    KnowTreeIndex,
    PortalLoginInfo,
    PortalPagination
  },
  data() {
    return {
      logininfoset: {
        disabled: true, // true 启用，false禁用
        showtext: true,
        customColors: [
          { color: '#f56c6c', percentage: 20 },
          { color: '#e6a23c', percentage: 40 },
          { color: '#6f7ad3', percentage: 100 }
        ]
      },
      logininfo: {
        imageUrl: userImg,
        name: '黄金龙',
        levelname: '黄金荣耀', // 当前等级称谓
        level: 'Lv5', // 当前level
        levelscore: '48', // 当前level最低分
        levelscoretotal: '64', // 当前level最高分
        levelcolor: 'blue' // 等级称谓颜色
      },
      isShow: false,
      input: '',
      msgFormSon: [],
      tableData: [],
      multipleSelection: [],
      pagination: {
        total: 0, // 总条数
        currentPage: 1, // 当前页
        pageSizes: [5, 10, 15], // 每页显示个数选择器的下拉框类名
        pageSize: 10, // 每页显示条数
        layout: '->, prev, pager, next, jumper, sizes', // 组件布局
        small: false, // 是否显示小型分页
        background: true, // 是否为分页添加背景色
        popperClass: '', // 每页显示个数选择器的下拉框类名
        prevText: '<', // 替代图标显示的上一页文字
        nextText: '>', // 替代图标显示的下一页文字
        disabled: false, // 是否禁用
        hidePage: false // 只有一页时是否隐藏
      }
    }
  },
  mounted() {
    // this.fun()
  },
  methods: {
    // 获取列表数据
    fun() {
      getComments({
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        filters: []
      })
        .then(res => {
          console.log(res.data)
          this.tableData = res.data.tableData
          this.pagination.total = res.data.count
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 搜索
    search() {
      // this.fun()
    },
    // 勾选
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    },
    alldelete() {
      if (this.multipleSelection.length === 0) {
        this.$message('请选择需要删除项')
      } else {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      }
    },
    restore() {},
    SizeChange(val) {
      console.log(val)
      this.pagination.currentPage = val
      // this.fun()
    },
    CurrentChange(val) {
      console.log(val)
      this.pagination.currentPage = val
      // this.fun()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../mixin/search-box';
  .button-warrper{
    padding:20px 0;
    display: flex;
    justify-content: center;
    .upload-button{
      padding: 10px 60px;
      background-color: #66b1ff;
    }
  }
  .input-with-select{
    width: 250px;
    margin-right: 20px;
  }
.msg-conten{
  margin: 10px;
}
.el-aside{
  width: 100%;
  // padding: 10px;
  // border: 1px solid #ddd;
  // border-radius: 4px;
  // box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}
.msg-title{
  text-align: center;
  height: 40px;
  line-height: 40px;
  font-weight: 600;
  background-color: #e4e7ed;
  font-size: 15px;
}
.input-with-select{
  width: 250px;
  margin-right: 20px;
}
.msg-secu{
  height: 40px;
  line-height: 40px;
}
.msg-aside{
  margin: 10px;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
}
.msg-pages{
  margin-top: 20px;
}
.msg-delete{
  float: right;
}
</style>
