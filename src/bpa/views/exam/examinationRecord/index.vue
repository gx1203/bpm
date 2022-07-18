<template>
  <div id="systemRoleManage">
    <div class="tool-common-wrap">
      <div class="search-wrap">
      <!-- <el-col :span="6"> -->
        <el-input
          v-model="stuffName"
          :placeholder="$t('testSystem.personName')"
          class="search_component"
          clearable
          @keyup.13.native="getList"
        >
          <el-button slot="append" type="primary" @click="getList">{{$t('testSystem.search')}}</el-button>
        </el-input>
          </div>
                <div class="btn-wrap">

        <el-button class="search_component" type="primary" @click="isHighSearch=!isHighSearch">
          {{$t('advancedQuery')}}
          <i :class="isHighSearch?'el-icon-caret-top' : 'el-icon-caret-bottom'"/>
        </el-button>
                </div>
      <!-- </el-col> -->
    </div>
    <el-collapse-transition>
      <!-- 高级搜索表格 -->
      <el-form
        v-show="isHighSearch"
        ref="ruleForm1"
        :model="searchForm"
        class="search_options_wrap"
        label-width="100px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('testSystem.name')" prop="stuffName">
              <el-input v-model="searchForm.stuffName" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('testSystem.NameOfTestPaper')" prop="testName">
              <el-input v-model="searchForm.testName" clearable/>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="制度流程名称">
              <el-input v-model="searchForm.codeName" clearable/>
            </el-form-item>
          </el-col> -->
        </el-row>
        <div class="search_buttons_wrap">
          <el-button type="primary" @click="search('high')">{{$t('testSystem.search')}}</el-button>
          <el-button type="primary" @click="resetForm1()">{{$t('testSystem.reset')}}</el-button>
        </div>
      </el-form>
    </el-collapse-transition>
    <el-table :data="roleList" border class="main_tab">
      <el-table-column :label="$t('bpa_number')" type="index" width="50px"/>
      <el-table-column prop="stuffName" :label="$t('testSystem.personName')"/>
      <el-table-column prop="department" :label="$t('testSystem.department')"/>
      <el-table-column prop="testName" :label="$t('testSystem.NameOfTestPaper')"/>
      <!-- <el-table-column prop="codeName" label="编号及名称"/> -->
      <el-table-column prop="score" :label="$t('testSystem.testScore')"/>
      <el-table-column prop="passScore" :label="$t('testSystem.QualifiedCutoffline')"/>
      <el-table-column prop="qualified" :label="$t('testSystem.whetherBeQualifiedOrNot')">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="20">{{ scope.row.qualified === 1 ? $t('testSystem.qualified') : $t('testSystem.disqualification') }}</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column prop="createTime"  :label="$t('testSystem.testTime')"/>
    </el-table>
    <el-pagination background
      :total="pages.total"
      :current-page="pages.pageNum"
      :page-size="pages.pageSize"
      layout="total, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { queryScoreInfo } from '@/bpa/api/examination'
import paginations from '@/bpa/mixins/pagination_mixin.js'
import { getFormateDate } from '@/bpa/utils/common'
export default {
  components: {
  },
  mixins: [paginations],
  data() {
    return {
      isHighSearch: false,
      stuffName: '',
      searchForm: {
        stuffName: '',
        testName: ''
      },
      testPaperAdd: false,
      testPaperForm: {},
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      roleList: [],
      rules: {
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    //  重置
    resetForm1() {
      this.searchForm.stuffName = ''
      this.searchForm.testName = ''
      // this.$refs[formName].resetFields()
      this.getList()
    },
    search() {
      this.getList()
    },
    // 获取考试类型列表
    getList() {
      // const obj = {
      //   startPage: this.pages.pageNum,
      //   pageSize: this.pages.pageSize,
      //   stuffName: this.stuffName,
      //   done: '',
      //   stuffId: '',
      //   testId: '',
      //   testName: this.searchForm.testName
      // }
      const obj = {
        // 'attr': '',
        // 'orderby': 'createTime',
        'pageNum': this.pages.pageNum,
        'pageSize': this.pages.pageSize,
        'sort': 'desc',
        'logic': 'and',
        'filters': [
          { 'key': 'testName', 'opt': 'LIKE', 'type': 'S', 'value': this.stuffName },
          { 'key': 'stuffName', 'opt': 'LIKE', 'type': 'S', 'value': this.searchForm.stuffName },
          { 'key': 'testName', 'opt': 'LIKE', 'type': 'S', 'value': this.searchForm.testName }
          // { 'key': 'codeName', 'opt': 'LIKE', 'type': 'S', 'value': this.searchForm.codeName }
        ]
      }
      queryScoreInfo(obj).then(res => {
        console.log(res)
        this.roleList = res.list.map(item => {
          item.createTime = getFormateDate(new Date(item.createTime), 'yyyy-MM-dd hh:mm:ss')
          return item
        })
        this.pages.total = res.total
      })
    }
  }
}
</script>
