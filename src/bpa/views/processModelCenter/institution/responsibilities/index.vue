<template>
  <div id="responsibilities">
    <el-row>
      <el-col :span="24">
        <el-input
          placeholder="请输入标题"
          class="search_component"
          v-model="keyWords"
          clearable
          @keyup.13.native="singleSearch('single')"
        >
          <el-button type="primary"  slot="append" @click="singleSearch('single')"> {{$t('search')}}</el-button>
        </el-input>
        <el-button class="high_search" @click="isHighSearch=!isHighSearch" type="primary">
          高级查询
          <i :class="isHighSearch?'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>
        </el-button>
      </el-col>
    </el-row>
    <el-collapse-transition>
      <el-form
        v-show="isHighSearch"
        class="search_options_wrap"
        :model="searchForm"
        label-width="100px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="中文标题">
              <el-input clearable v-model="searchForm.title" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="英文标题">
              <el-input clearable v-model="searchForm.enname" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="拟制人">
              <el-input clearable v-model="searchForm.authorname" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="8">
            <el-form-item label="发布人">
              <el-input clearable v-model="searchForm.provideruser" clearable></el-input>
            </el-form-item>
          </el-col>-->
          <el-col :span="8">
            <el-form-item label="部门">
              <el-input clearable v-model="searchForm.deptname" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="search_buttons_wrap">
          <el-button type="primary" @click="singleSearch('high')">搜索</el-button>
          <el-button type="primary" @click="resetSearch">重置</el-button>
        </div>
      </el-form>
    </el-collapse-transition>
    <el-table :data="regulationList" class="main_tab">
      <el-table-column :label="$t('number')" type="index"></el-table-column>
      <el-table-column prop="name" label="标题中英文">
        <template slot-scope="scope">
          <router-link :to="'/rulesAbolishDetail/'+scope.row.docId+'/'+scope.row.revId">
            <p>{{scope.row.title}}</p>
            <p>{{scope.row.enname}}</p>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="version" :label="$t('version')"></el-table-column>
      <el-table-column prop="createon" :label="$t('uploadTime')"></el-table-column>
      <el-table-column prop="name" label="部门">
        <template slot-scope="scope">
          <span v-for="item in scope.row.deptname" :key="item.id">{{item.value}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="provideruser" label="拟制人"></el-table-column>
      <el-table-column prop="foldertype" label="分类"></el-table-column>
      <el-table-column prop="updateon" label="作废时间"></el-table-column>
      <!-- <el-table-column prop="address" :label="$t('operation')">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
            <el-button class="no-border" icon="el-icon-delete" circle></el-button>
          </el-tooltip>
        </template>
      </el-table-column>-->
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
  </div>
</template>

<script>
import { getRegulationList } from '@/bpa/api/processModelCenter/institution'
import paginations from '@/bpa/mixins/pagination_mixin'
export default {
  data() {
    return {
      regulationList: [],
      keyWords: '',
      isHighSearch: false,
      searchForm: {},
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      filters: [
        { key: 'title', opt: 'LIKE', type: 'S', value: '' },
        { key: 'enname', opt: 'LIKE', type: 'S', value: '' },
        { key: 'provideruser', opt: 'LIKE', type: 'S', value: '' },
        { key: 'status', opt: 'LIKE', type: 'S', value: 5 },
        { key: 'foldertype', opt: 'LIKE', type: 'S', value: '' },
        { key: 'deptname', opt: 'LIKE', type: 'S', value: '' },
        { key: 'authorname', opt: 'LIKE', type: 'S', value: '' },
        { key: 'system', opt: 'LIKE', type: 'S', value: '' },
        { key: 'effectivedate', opt: 'LE', type: 'D', value: '' }
      ]
    }
  },
  mixins: [paginations],
  mounted() {
    this.getList()
  },
  methods: {
    resetSearch() {
      this.pages.pageNum = 1
      this.searchForm = {}
      this.filters = [
        { key: 'title', opt: 'LIKE', type: 'S', value: '' },
        { key: 'enname', opt: 'LIKE', type: 'S', value: '' },
        { key: 'provideruser', opt: 'LIKE', type: 'S', value: '' },
        { key: 'status', opt: 'LIKE', type: 'S', value: 5 },
        { key: 'foldertype', opt: 'LIKE', type: 'S', value: '' },
        { key: 'deptname', opt: 'LIKE', type: 'S', value: '' },
        { key: 'authorname', opt: 'LIKE', type: 'S', value: '' },
        { key: 'system', opt: 'LIKE', type: 'S', value: '' },
        { key: 'effectivedate', opt: 'LE', type: 'D', value: '' }
      ]
      this.getList()
    },
    singleSearch(type) {
      this.pages.pageNum = 1
      if (type === 'single') {
        this.filters = [
          { key: 'title', opt: 'LIKE', type: 'S', value: this.keyWords },
          { key: 'enname', opt: 'LIKE', type: 'S', value: '' },
          { key: 'provideruser', opt: 'LIKE', type: 'S', value: '' },
          { key: 'status', opt: 'LIKE', type: 'S', value: 5 },
          { key: 'foldertype', opt: 'LIKE', type: 'S', value: '' },
          { key: 'deptname', opt: 'LIKE', type: 'S', value: '' },
          { key: 'authorname', opt: 'LIKE', type: 'S', value: '' },
          { key: 'system', opt: 'LIKE', type: 'S', value: '' },
          { key: 'effectivedate', opt: 'LE', type: 'D', value: '' }
        ]
        console.log(this.filters)
      } else {
        this.filters = [
          {
            key: 'title',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.title
          },
          {
            key: 'enname',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.enname
          },
          {
            key: 'provideruser',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.provideruser
          },
          { key: 'status', opt: 'LIKE', type: 'S', value: 5 },
          {
            key: 'foldertype',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.foldertype
          },
          {
            key: 'deptname',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.deptname
          },
          {
            key: 'authorname',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.authorname
          },
          {
            key: 'system',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.system
          },
          {
            key: 'effectivedate',
            opt: 'LE',
            type: 'D',
            value: this.searchForm.effectivedate
          }
        ]
      }
      this.getList()
    },
    getList() {
      let obj = {
        orderby: 'createon',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: 'desc',
        attr: { folderid: '5002' },
        filters: this.filters
      }
      getRegulationList(obj).then(res => {
        if (!res) return false
        this.regulationList = res.list
        this.pages.total = res.total
      })
    }
  }
}
</script>
