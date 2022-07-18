<template>
  <el-container>
    <el-aside width="200px" style="background: #f5f5f5">
      <know-tree-index/>
    </el-aside>
    <el-main>
      <!-- 搜索 -->
      <div class="msg-secu">
        <el-input clearable v-model="inputVal" size="small" placeholder="请输入内容" class="input-with-select">
          <el-button slot="append" type="primary" icon="el-icon-search" @click="search" />
        </el-input>
        <el-button size="mini" type="primary" @click="isShow = !isShow, plusIcon = !plusIcon">高级查询
          <i v-if="plusIcon" class="el-icon-caret-bottom el-icon--right" />
          <i v-if="!plusIcon" class="el-icon-caret-top el-icon--right" />
        </el-button>
        <span class="msg-delete">
          <el-button type="primary" plain size="mini" icon="el-icon-refresh">刷新</el-button>
        </span>
      </div>
      <!-- 高级搜索 -->
      <transition name="el-zoom-in-top">
        <div v-if="isShow" class="msg-form">
          <el-form
            ref="ruleForm1"
            :model="ruleForm1"
            label-width="100px"
            class="demo-ruleForm">
            <el-form-item label="标题" prop="name0">
              <el-input clearable v-model="ruleForm1.name0" size="small" class="el-inputs" placeholder="标题"/>
            </el-form-item>
            <el-form-item :label="$t('TheDocumentName')" prop="name1">
              <el-input clearable v-model="ruleForm1.name1" size="small" class="el-inputs" :placeholder="$t('TheDocumentName')" />
            </el-form-item>
            <el-form-item label="标签" prop="name2">
              <el-input clearable v-model="ruleForm1.name2" size="small" class="el-inputs" placeholder="标签"/>
            </el-form-item>
            <el-form-item label="提供者" prop="name3">
              <el-input clearable v-model="ruleForm1.name3" size="small" class="el-inputs" placeholder="提供者" />
            </el-form-item>
            <el-form-item label="格式" prop="name4">
              <el-input clearable v-model="ruleForm1.name4" size="small" class="el-inputs" placeholder="格式" />
            </el-form-item>
            <el-form-item label="文号" prop="name5">
              <el-input clearable v-model="ruleForm1.name5" size="small" class="el-inputs" placeholder="文号" />
            </el-form-item>
            <el-form-item label="维度" prop="name6" style="width: 100%;">
              <el-input clearable v-model="ruleForm1.name6" readonly size="small" class="el-inputs" placeholder="选择维度" @click.native="godimension"/>
            </el-form-item>
            <el-form-item :label="$t('uploadTime')" prop="name7" style="width: 100%;">
              <el-date-picker clearable
                v-model="ruleForm1.name7"
                value-format="yyyy-MM-dd"
                size="small"
                style="width: 100%;"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期" />
            </el-form-item>
            <el-form-item style="width: 100%;">
              <el-button size="small" type="primary" @click="submitForm1('ruleForm1')">立即搜索</el-button>
              <el-button size="small" @click="resetForm1('ruleForm1')">重置</el-button>
            </el-form-item>
          </el-form>
          <div style="clear: both;" />
        </div>
      </transition>
      <!-- 列表 -->
      <el-table
        v-loading="Listloading"
        :data="tableData"
        :default-sort = "{prop: 'date', order: 'descending'}"
        style="width: 100%;"
        size="small"
        class="msg-table"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50"/>
        <el-table-column type="index" label="#" />
        <el-table-column label="标题" sortable show-overflow-tooltip>
          <template slot-scope="scope">
            <router-link :to="{name: 'documentDetail'}">{{ scope.row.title }}</router-link>
          </template>
        </el-table-column>
        <el-table-column prop="dimension" label="删除人" sortable />
        <el-table-column prop="date" label="日期" sortable width="180" />
      </el-table>
      <portal-pagination
        :pagination-obj="pagination"
        class="msg-pages"
        @handleSizeChange="SizeChange"
        @handleCurrentChange="CurrentChange" />
    </el-main>
    <el-aside width="300px">
      <div>
        <portal-login-info
          :options = "logininfoset"
          :logindata = "logininfo"
          @tohonorwall = 'tohonorwall'
        />
        <div class="button-warrper">
          <el-button class="upload-button">上传文档</el-button>
        </div>
        <div>
          <knowledge-router :router-list="routerList"/>
        </div>
      </div>
    </el-aside>
  </el-container>
</template>

<script>
import KnowTreeIndex from '../components/tree'
import PortalLoginInfo from '@/bpa/components/protal/portallogininfo'
import PortalPagination from '@/bpa/components/protal/Pagination'
import KnowledgeRouter from './components/routerList'
import userImg from '@/bpa/assets/img/user.png'

import { getComments } from '@/bpa/api/cmsCenter/protalscore'
export default {
  name: 'KnowLedgeIndex',
  components: {
    KnowTreeIndex,
    PortalLoginInfo,
    KnowledgeRouter,
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
        ],
        isneedhonor:true
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
      routerList: [
        {
          imgUrl: '', // 图片展示
          pathName: 'favorite', // 路由的name属性值
          name: '我的收藏' // 路径的展示名称
        },
        {
          imgUrl: '', // 图片展示
          pathName: 'share', // 路由的name属性值
          name: '我的分享' // 路径的展示名称
        },
        {
          imgUrl: '', // 图片展示
          pathName: 'recycle', // 路由的name属性值
          name: '回收站' // 路径的展示名称
        },
        {
          imgUrl: '', // 图片展示
          pathName: 'upload', // 路由的name属性值
          name: '我的上传' // 路径的展示名称
        },
        {
          imgUrl: '', // 图片展示
          pathName: 'shareTo', // 路由的name属性值
          name: '分享给我' // 路径的展示名称
        },
        {
          imgUrl: '', // 图片展示
          pathName: 'permission', // 路由的name属性值
          name: '权限列表' // 路径的展示名称
        },
        {
          imgUrl: '', // 图片展示
          pathName: 'manage', // 路由的name属性值
          name: '知识管理' // 路径的展示名称
        },
        {
          imgUrl: '', // 图片展示
          pathName: 'honor', // 路由的name属性值
          name: '荣誉墙' // 路径的展示名称
        }
      ],
      tableData: [],
      inputVal: '', // 搜索框的值
      Listloading: false, // 加载动画
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
      // 高级搜索的字段
      ruleForm1: {
        name0: '',
        name1: '',
        name2: '',
        name3: '',
        name4: '',
        name5: '',
        name6: '',
        name7: ''
      },
      isShow: false,
      plusIcon: true
    }
  },
  created() {
    this.fun()
  },
  methods: {
    // 获取评论数据
    fun() {
      getComments({
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        filters: []
      })
        .then(res => {
          console.log(res.data)
          this.Listloading = false
          this.tableData = res.data.tableData
          this.pagination.total = res.data.count
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 搜索
    search() {
      this.fun()
    },
    // 勾选
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    },
    // 批量删除
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
    // 分页
    SizeChange(val) {
      console.log(val)
      this.pagination.currentPage = val
      this.fun()
    },
    CurrentChange(val) {
      console.log(val)
      this.pagination.currentPage = val
      this.fun()
    },
    tohonorwall(){
      this.$router.push('honor')
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
</style>
