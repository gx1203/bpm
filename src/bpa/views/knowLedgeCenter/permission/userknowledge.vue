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
    <el-aside width="85%" style="padding: 10px;">
      <!-- 搜索 -->
      <div class="msg-secu">
        <el-input clearable v-model="input" size="small" placeholder="请输入内容" class="input-with-select">
          <el-button slot="append" type="primary" icon="el-icon-search" @click="search" />
        </el-input>
        <el-button size="mini" type="primary" @click="advancedsearch">高级
          <i v-if="plusIcon" class="el-icon-caret-bottom el-icon--right" />
          <i v-if="!plusIcon" class="el-icon-caret-top el-icon--right" />
        </el-button>
        <span style="float: right;">
          <portal-export :options="exportdata"/>
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
            <el-form-item label="用户名称" prop="name0">
              <el-input clearable v-model="ruleForm1.name0" size="small" class="el-inputs" placeholder="用户名称"/>
            </el-form-item>
            <el-form-item label="标题" prop="name3">
              <el-input clearable v-model="ruleForm1.name3" size="small" class="el-inputs" placeholder="用户名称"/>
            </el-form-item>
            <el-form-item label="维度" prop="name1">
              <el-input clearable v-model="ruleForm1.name1" readonly size="small" class="el-inputs" placeholder="选择维度" @click.native="godimension"/>
            </el-form-item>
            <el-form-item label="权限范围" prop="name2" style="width: 75%;">
              <el-checkbox-group v-model="ruleForm1.name2">
                <el-checkbox label="知识查看" name="name2" />
                <el-checkbox label="知识上传" name="name2" />
                <el-checkbox label="知识删除" name="name2" />
                <el-checkbox label="知识分享" name="name2" />
                <el-checkbox label="附件下载" name="name2" />
                <el-checkbox label="附件打印" name="name2" />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item style="width: 25%;">
              <el-button size="small" type="primary" @click="submitForm1('ruleForm1')">立即搜索</el-button>
              <el-button size="small" @click="resetForm1('ruleForm1')">重置</el-button>
            </el-form-item>
          </el-form>
          <div style="clear: both;" />
        </div>
      </transition>
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
        <el-table-column prop="name" label="用户名称" sortable show-overflow-tooltip />
        <el-table-column prop="title" label="标题" sortable show-overflow-tooltip />
        <el-table-column prop="Dimension" label="维度" sortable show-overflow-tooltip />
        <el-table-column prop="ckstate" label="查看" sortable width="80" />
        <el-table-column prop="gxstate" label="更新" sortable width="80" />
        <el-table-column prop="xzstate" label="下载" sortable width="80" />
        <el-table-column prop="scstate" label="删除" sortable width="80" />
        <el-table-column prop="dystate" label="打印" sortable width="80" />
        <el-table-column prop="fxstate" label="分享" sortable width="80" />
      </el-table>
      <portal-pagination
        :pagination-obj="pagination"
        style="margin-top: 20px;"
        @handleSizeChange="SizeChange"
        @handleCurrentChange="CurrentChange" />
    </el-aside>
    <!-- 维度 -->
    <el-dialog
      :visible.sync="dialogVisible"
      title="选择维度"
      width="28%">
      <div>
        <ProtalTree3 @func="getMsgFormSon" />
      </div>
    </el-dialog>
  </el-container>
</template>
<script>
import KnowTreeIndex from '../components/tree1'
import PortalLoginInfo from '@/bpa/components/protal/portallogininfo'
import userImg from '@/bpa/assets/img/user.png'

import PortalPagination from '@/bpa/components/protal/Pagination'
// import { getComments } from '@/bpa/api/common/protalscore'
import ProtalTree3 from '@/bpa/components/protal/ProtalTree/index3'
import PortalExport from '@/bpa/components/protal/PortalExport'
export default {
  name: 'UserDocument',
  components: {
    KnowTreeIndex,
    PortalLoginInfo,
    ProtalTree3,
    PortalPagination,
    PortalExport
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
      plusIcon: true,
      dialogVisible: false,
      msgFormSon: [],
      tableData: [],
      multipleSelection: [],
      exportdata: {
        tHeader: ['用户名称', '维度', '维度查看', '知识上传'],
        filterVal: ['name', 'Dimension', 'wdstate', 'zsstate'],
        exportdata: []
      },
      ruleForm1: {
        name0: '',
        name1: '',
        name3: '',
        name2: []
      },
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
          this.tableData = res.data.userDocumentlist
          this.exportdata.exportdata = this.tableData
          this.pagination.total = res.data.count
        })
        .catch(err => {
          console.log(err)
        })
    },
    search() {
      // this.fun()
    },
    // 高级搜索
    advancedsearch() {
      this.isShow = !this.isShow
      this.plusIcon = !this.plusIcon
    },
    // 立即搜索
    submitForm1(formName) {
      console.log(this.ruleForm1)
    },
    //  重置
    resetForm1(formName) {
      this.$refs[formName].resetFields()
    },
    // 导出
    goexport() {
      // this.fun()
      this.$message({
        message: '导出成功',
        type: 'success'
      })
    },
    // 勾选
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
      console.log(this.multipleSelection)
      if (this.multipleSelection.length === 0) {
        this.$message('全部导出')
        this.exportdata.exportdata = this.tableData
      } else {
        this.$message('只导出选中')
        this.exportdata.exportdata = this.multipleSelection
      }
    },
    // 维度
    godimension() {
      this.dialogVisible = true
    },
    // 获取树的勾选数据
    getCheckedNodes() {
      this.dialogVisible = false
      this.ruleForm1.name1 = []
      for (let i = 0; i < this.msgFormSon.length; i++) {
        this.ruleForm1.name1.push(this.msgFormSon[i].name)
      }
      console.log(this.ruleForm1.name1)
    },
    getMsgFormSon(data) {
      this.dialogVisible = false
      console.log(data)
      this.msgFormSon = data
      console.log(this.msgFormSon)
      this.ruleForm1.name1 = []
      for (let i = 0; i < this.msgFormSon.length; i++) {
        this.ruleForm1.name1.push(this.msgFormSon[i].name)
      }
      console.log(this.ruleForm1.name1)
    },
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
.el-form-item {
  margin-bottom: 10px;
  width: 33%;
  float: left;
}
.msg-form{
  width: 100%;
  margin: 10px 0;
  // border-radius: 2px;
  padding: 10px 50px 10px 10px;
  background-color: rgb(239, 242, 247);
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
}
</style>
