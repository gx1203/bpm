<template>
  <div class="ruleContent">
    <div class="searchpart" :class="{'h24px': !moreclick}">
      <h5>热门搜索：</h5>
      <ul class="detailcontent">
        <li
          v-for="(item, index) in tags"
          :key="index"
          @click="serachTag(item, index)"
        >{{item.value}}</li>
      </ul>
      <el-button type="text" class="moreBtn" @click="moreClick">更多</el-button>
    </div>
    <el-row class="margin-t15">
      <el-col :span="8">
        <el-input
          placeholder="请输入内容"
          class="search_component"
          v-model="keyWords"
          clearable
          @keyup.13.native="singleSearch"
        >
          <el-button type="primary" slot="append" @click="singleSearch"> {{$t('search')}}</el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-table :data="tableList" class="main_tab">
      <el-table-column :label="$t('systemName')">
        <template slot-scope="scope">
          <router-link :to="'/ruleDoc/' + scope.row.name">{{scope.row.name}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="制度流程负责人"></el-table-column>
      <el-table-column prop="date" width="100" :label="$t('releaseTime')"></el-table-column>
      <el-table-column prop="name" width="80" :label="$t('versionNumber')"></el-table-column>
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
import paginations from '@/bpa/mixins/pagination_mixin'

export default {
  data() {
    return {
      tags: [
        { value: '标签1' },
        { value: '标签2' },
        { value: '标签3' },
        { value: '标签4' },
        { value: '标签5' }
      ],
      moreclick: false,
      keyWords: '',
      tableList: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      }
    }
  },
  mixins: [paginations],
  mounted() {},
  methods: {
    serachTag(item, idx) {
      this.keyWords = item.value
    },
    moreClick() {
      this.moreclick = !this.moreclick
    },
    getList() {}
  }
}
</script>

<style lang='scss' scoped>
* {
  box-sizing: border-box;
}
.searchpart {
  line-height: 24px;
  font-size: 14px;
  color: #333;
  min-height: 24px;
  position: relative;
  padding: 0 35px 0 75px;
  overflow: hidden;
  &.h24px {
    height: 24px;
  }
  h5 {
    width: 70px;
    position: absolute;
    left: 0;
    top: 0;
  }
  .moreBtn {
    width: 30px;
    position: absolute;
    right: 0;
    top: 0;
  }
  .detailcontent {
    li {
      padding: 0 8px;
      display: inline-block;
      vertical-align: top;
      margin-right: 5px;
      cursor: pointer;
    }
  }
}
</style>
