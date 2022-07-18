<template>
  <el-container class="msg-conten">
    <el-aside width="200px" style="background: #f5f5f5;">
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
    <!-- 左侧隐藏菜单 -->
    <transition name="el-zoom-in-left">
      <el-aside v-if="isCollapse" width="220px" class="msg-left">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="组织架构" name="first">
            <el-tree :data="data" :props="defaultProps" class="overhide" @node-click="handleNodeClick1">
              <span slot-scope="{ node, data}" class="span-ellipsis">
                <span :title="data.label">{{ data.label }}</span>
              </span>
            </el-tree>
          </el-tab-pane>
          <el-tab-pane label="常用" name="second">
            <el-tree :data="data1" :props="defaultProps" @node-click="handleNodeClick2" />
          </el-tab-pane>
        </el-tabs>
      </el-aside>
    </transition>
    <span>
      <i v-if="isCollapse" class="el-icon-d-arrow-left icon" @click="lefthide" />
      <i v-if="!isCollapse" class="el-icon-d-arrow-right icon" @click="leftshow" />
    </span>
    <el-main class="msg-rigth">
      <!-- 搜索 -->
      <div class="msg-secu">
        <el-input clearable v-model="input" size="small" placeholder="请输入内容" class="input-with-select">
          <el-button slot="append" type="primary" icon="el-icon-search" @click="search" />
        </el-input>
        <span class="msg-delete">
          <el-button type="primary" plain size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
        </span>
      </div>
      <!-- 列表 -->
      <el-table
        v-loading="loading"
        :data="personnellist"
        :default-sort = "{prop: 'date', order: 'descending'}"
        style="width: 100%;"
        size="small"
        class="msg-table">
        <el-table-column type="index" label="#" />
        <el-table-column prop="name" label="姓名" sortable />
        <el-table-column prop="Department" label="部门" sortable show-overflow-tooltip />
        <el-table-column prop="position" label="职位" sortable show-overflow-tooltip />
        <el-table-column prop="gender" label="性别" sortable />
        <el-table-column prop="telephone" label="联系电话" sortable />
        <el-table-column prop="state" :label="$t('operation')" sortable width="100">
          <template slot-scope="scope">
            <el-button v-if="scope.row.state=='1'" type="text" size="mini" class="msg-add" @click="handleClick2(scope.row)">添加常用</el-button>
            <el-button v-if="scope.row.state=='2'" type="text" size="mini" class="msg-cancel" @click="handleClick1(scope.row)">取消常用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <portal-pagination
        :pagination-obj="pagination"
        class="msg-pages"
        @handleSizeChange="SizeChange"
        @handleCurrentChange="CurrentChange" />
    </el-main>
  </el-container>
</template>
<script>
import KnowTreeIndex from '../components/tree1'
import PortalLoginInfo from '@/bpa/components/protal/portallogininfo'
import userImg from '@/bpa/assets/img/user.png'

import PortalPagination from '@/bpa/components/protal/Pagination'
// import { getComments } from '@/bpa/api/common/protalscore'
export default {
  name: 'AddressList',
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
      loading: false,
      isCollapse: true,
      activeName: 'first',
      msgFormSon: [],
      personnellist: [],
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
      },
      data: [],
      data1: [
        { label: '我的关注' },
        { label: '我的部门' }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  mounted() {
    // this.fun()
    // this.gettreedata()
  },
  methods: {
    // 获取左侧tree数据
    gettreedata() {
      getComments('')
        .then(res => {
          console.log(res.data)
          this.data = res.data.treedata
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取列表数据
    fun() {
      this.loading = true
      getComments({
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        filters: []
      })
        .then(res => {
          console.log(res.data)
          this.personnellist = res.data.personnellist
          this.pagination.total = res.data.count
          this.loading = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 搜索
    search() {
      // this.fun()
    },
    // 取消常用
    handleClick1(row) {
      console.log(row)
      this.$message({
        message: '取消成功',
        type: 'success'
      })
    },
    // 添加常用
    handleClick2(row) {
      console.log(row)
      this.$message({
        message: '添加成功',
        type: 'success'
      })
    },
    // 刷新
    refresh() {
      // this.fun()
      this.$message({
        message: '刷新成功',
        type: 'success'
      })
    },
    // 左侧隐藏
    lefthide() {
      this.isCollapse = false
    },
    // 左侧显示
    leftshow() {
      this.isCollapse = true
    },
    // 左侧table切换
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 左侧tree点击事件
    handleNodeClick1(data) {
      console.log(data)
    },
    handleNodeClick2(data) {
      console.log(data)
    },
    // 分页
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
.icon{
  position: relative;
  top: 10px;
  left: 10px;
  color: #199edb;
  font-size: 14px;
  font-weight: 600;
}
.msg-left{
  padding: 0 0 0 5px;
  border-right: 2px solid #e4e7ed;
}
.msg-rigth{
  padding: 0 20px;
}
.msg-pages{
  margin-top: 20px;
}
.msg-delete{
  float: right;
}
.msg-cancel{
  color: #E6A23C;
}
.msg-add{
  color: #199edb;
}
.overhide{
  width: 200px;
  overflow: auto;
}
.span-ellipsis{
  font-size: 14px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>

