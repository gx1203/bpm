<template>
  <el-container>
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
    <el-main style="padding: 0 10px;">
      <div class="searcharea clear-fix">
        <!-- 搜索 -->
        <div class="msg-secu">
          <el-input clearable
            v-model="ruleForm.subject"
            size="small"
            placeholder="请输入内容"
            class="input-with-select"
          >
            <el-button
              slot="append"
              type="primary"
              icon="el-icon-search"
              @click="submitForm('ruleForm')"
            />
          </el-input>
          <el-button size="mini" type="primary" @click="advancedsearch">
            高级查询
            <i v-if="plusIcon" class="el-icon-caret-bottom el-icon--right" />
            <i v-if="!plusIcon" class="el-icon-caret-top el-icon--right" />
          </el-button>
        </div>
        <!-- 高级搜索 -->
        <div v-if="isShow" class="msg-form">
          <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="标题" prop="title">
              <el-input clearable v-model="ruleForm.title" size="small" class="el-inputs" placeholder="标题" />
            </el-form-item>
            <el-form-item :label="$t('TheDocumentName')" prop="name">
              <el-input clearable v-model="ruleForm.name" size="small" class="el-inputs" :placeholder="$t('TheDocumentName')" />
            </el-form-item>
            <el-form-item :label="$t('heir')" prop="uploadName">
              <el-input clearable
                v-model="ruleForm.uploadName"
                size="small"
                class="el-inputs"
                :placeholder="$t('heir')"
              />
            </el-form-item>
            <el-form-item label="提供者" prop="publishName">
              <el-input clearable
                v-model="ruleForm.publishName"
                size="small"
                class="el-inputs"
                placeholder="提供者"
              />
            </el-form-item>
            <el-form-item label="格式" prop="format">
              <el-select clearable v-model="ruleForm.format" size="small" placeholder="请选择格式">
                <el-option
                  v-for="item in formatlist"
                  :key="item.id"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="文号" prop="docno">
              <el-input clearable v-model="ruleForm.docno" size="small" class="el-inputs" placeholder="文号" />
            </el-form-item>
            <el-form-item label="标签" prop="label">
              <el-input clearable v-model="ruleForm.label" size="small" class="el-inputs" placeholder="标签" />
            </el-form-item>
            <el-form-item label="维度" prop="dimension">
              <el-input clearable
                v-model="ruleForm.dimension"
                readonly
                size="small"
                class="el-inputs"
                placeholder="请选择维度"
                @click.native="godimension"
              />
            </el-form-item>
            <el-form-item label="收藏时间" prop="createon" style="width: 100%;">
              <el-date-picker clearable
                v-model="ruleForm.createon"
                value-format="yyyy-MM-dd"
                size="small"
                style="width: 100%;"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
            <el-form-item style="width: 100%;">
              <el-button size="small" @click="resetForm('ruleForm')">重置</el-button>
              <el-button size="small" type="primary" @click="submitForm('ruleForm')">立即搜索</el-button>
            </el-form-item>
          </el-form>
          <div style="clear: both;" />
          <!-- 维度 -->
          <el-dialog :visible.sync="dialogVisible" title="选择维度" width="28%">
            <div>
              <protal-tree3 @func="getMsgFormSon" />
            </div>
          </el-dialog>
        </div>
      </div>
      <div v-loading="listLoading" class="tablewarp">
        <transition name="el-zoom-in-left">
          <el-aside v-show="showtree" width="220px">
            <protal-tree2 />
          </el-aside>
        </transition>
        <el-main>
          <i
            :class="showtree?'el-icon-d-arrow-left':'el-icon-d-arrow-right'"
            @click="showtree=!showtree"
          />
          <el-table ref="filterTable" :data="tableData" class="thetable" size="small">
            <el-table-column prop="title" label="标题" sortable show-overflow-tooltip>
              <template slot-scope="scope" show-overflow-tooltip>
                <div
                  class="titleact"
                  @click="todetial(scope.$index, scope.row)"
                >{{ scope.row.title }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="applyusername"
              :label=
              sortable
              width="200"
              show-overflow-tooltip
            />
            <el-table-column
              prop="accepttime"
              label="收藏时间"
              sortable
              width="160"
              show-overflow-tooltip
            />
          </el-table>
          <portal-pagination
            id="pagination"
            :pagination-obj="pagination"
            @handleSizeChange="SizeChange"
            @handleCurrentChange="CurrentChange"
          />
        </el-main>
      </div>
    </el-main>
    <el-aside width="20%" class="msg-aside">
      <div class="msg-title">热门知识推荐</div>
      <el-table
        :data="tableData1"
        :default-sort="{prop: 'date', order: 'descending'}"
        style="width: 100%;"
        size="small"
        class="msg-table"
      >
        <el-table-column prop="title" label="标题" show-overflow-tooltip />
        <el-table-column prop="name" :label="$t('heir')"  />
      </el-table>
    </el-aside>
  </el-container>
</template>

<script>
import KnowTreeIndex from '../components/tree1'
import PortalLoginInfo from '@/bpa/components/protal/portallogininfo'
import userImg from '@/bpa/assets/img/user.png'

import PortalPagination from '@/bpa/components/protal/Pagination'
import ProtalTree3 from '@/bpa/components/protal/ProtalTree/index3'
import ProtalTree2 from '@/bpa/components/protal/ProtalTree/index2'
export default {
  name: 'KnowLedgeFavorite',
  components: {
    KnowTreeIndex,
    PortalLoginInfo,
    PortalPagination,
    ProtalTree3,
    ProtalTree2
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
      listLoading: false,
      tableData: [],
      pagination: {
        total: 10, // 总条数
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
      tasklist: [],
      // 搜索
      isShow: false,
      plusIcon: true,
      input: '',
      dialogVisible: false,
      showtree: false,
      msgFormSon: [],
      ruleForm: {
        subject: '',
        title: '',
        name: '',
        uploadName: '',
        publishName: '',
        docno: '',
        recipientName: '',
        format: '',
        dimension: '',
        label: '',
        createon: '',
        invalidTime: ''
      },
      formatlist: [
        { name: '文档', value: 'doc', id: '1' },
        { name: '工作表', value: 'xls', id: '2' },
        { name: '演示文稿', value: 'ppt', id: '3' },
        { name: 'PDF', value: 'pdf', id: '4' },
        { name: '文本文档', value: 'txt', id: '5' },
        { name: '图片', value: 'jpg', id: '6' },
        { name: '网页文件', value: 'html', id: '7' }
      ],
      tableData1: [
        {
          name: '小强1号',
          title: '标题标题1标题标题1标题标题1'
        },
        {
          name: '小强2号',
          title: '标题标题2'
        },
        {
          name: '小强3号',
          title: '标题标题3'
        },
        {
          name: '小强4号',
          title: '标题标题4'
        },
        {
          name: '小强5号',
          title: '标题标题5'
        }
      ]
    }
  },
  methods:{
    // 获取数据
    getProcesswaiting() {
      this.listLoading = true
      getProcesswaiting({
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        filters: []
      })
        .then(res => {
          this.tableData = res.data.list
          // this.tableData = []
          this.tasklist = res.data.tasklist
          this.pagination.total = res.data.count
          this.$message.success('查询成功')
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
        .catch(err => {
          console.log(err)
        })
    },
    SizeChange(val) {
      this.pagination.currentPage = val
      // this.getProcesswaiting()
    },
    CurrentChange(val) {
      this.pagination.currentPage = val
      // this.getProcesswaiting()
    },
    // 所有任务
    alltask() {
      this.isalltype = 1
      this.swiperinfo.swiperActive = 'swiper-css'
      this.ruleForm.taskname = 'all'
      console.log(this.isalltype)
    },
    // 单选任务
    choosedtype(val) {
      this.isalltype = 0
      this.swiperinfo.swiperActive = 'swiper-active'
      this.ruleForm.taskname = val.name
    },
    // 高级搜索
    advancedsearch() {
      this.isShow = !this.isShow
      this.plusIcon = !this.plusIcon
    },
    // 立即搜索
    submitForm(formName) {
      console.log(this.ruleForm)
      // this.getProcesswaiting()
    },
    //  重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.ruleForm.subject = ''
      // this.getProcesswaiting()
    },
    // 查看详细
    todetial(index, data) {
      this.$message.warning(data.title + '明细')
    },
    // 维度
    godimension() {
      this.dialogVisible = true
    },
    // 获取树的勾选数据
    getMsgFormSon(data) {
      this.dialogVisible = false
      console.log(data)
      this.msgFormSon = data
      console.log(this.msgFormSon)
      const arry = []
      for (let i = 0; i < this.msgFormSon.length; i++) {
        arry.push(this.msgFormSon[i].name)
      }
      this.ruleForm.dimension = arry.toString(',')
      console.log(this.ruleForm.dimension)
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
  /*清浮动*/
.clear-fix:after {
  content: '.';
  clear: both;
  display: block;
  height: 0;
  overflow: hidden;
  visibility: hidden;
}
.el-container {
  margin: 10px;
}
.el-main {
  padding: 0;
}
.thetable {
  width: 100%;
  // min-height: 450px;
}
.typelist {
  font-size: 13px;
  font-weight: 300;
  margin-bottom: 10px;
  border-bottom: 1px solid #efefef;
}
.typelist .typelist-tiact {
  line-height: 22px;
  font-weight: 500;
  text-indent: 10px;
  cursor: pointer;
  border-bottom: 2px solid #0e67ec;
}
.typelist .typelist-ti {
  line-height: 22px;
  font-weight: 300;
  text-indent: 10px;
  border-bottom: 2px solid #fff;
  cursor: pointer;
}
.titleact {
  cursor: pointer;
}
.titleact:hover {
  color: #0e67ec;
}
.msg-title {
  text-align: center;
  height: 40px;
  line-height: 40px;
  font-weight: 600;
  background-color: #e4e7ed;
  font-size: 15px;
}
.msg-aside {
  margin: 10px;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
.tablewarp {
  display: flex;
  width: 100%;
}

// 搜索样式
.searcharea {
  margin-bottom: 10px;
}
.searcharea .msg-secu {
  height: 40px;
  line-height: 40px;
}
.searcharea .input-with-select {
  width: 250px;
  margin-right: 20px;
}
.searcharea .msg-form {
  width: 100%;
  margin: 10px 0;
  box-sizing: border-box;
  // border-radius: 2px;
  padding: 10px 50px 10px 10px;
  background-color: rgb(239, 242, 247);
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
.searcharea .el-form-item {
  margin-bottom: 10px;
  width: 50%;
  float: left;
}
.searcharea .el-select{
  width: 100%;
}
.searcharea .msg-form .el-button {
  float: right;
  margin-left: 20px;
}
</style>
<style  scoped>
.typelist >>> .swiper-css {
  line-height: 22px;
  text-align: center;
  cursor: pointer;
  border-bottom: 2px solid #fff;
}
.typelist >>> .swiper-css:hover {
  color: #0e9aec;
}
.typelist >>> .swiper-active {
  line-height: 22px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  border-bottom: 2px solid #0e67ec;
}
.typelist >>> .swiper-button-prev {
  height: 10px;
  top: 114%;
}
.typelist >>> .swiper-button-next {
  height: 10px;
  top: 114%;
}
</style>

