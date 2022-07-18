<template>
  <div id="processHasBeenDestoryed">
    <el-row>
      <el-col :span="8">
        <el-input :placeholder="$t('placeholderText.pleaseEnterProcessName')" class="search_component"
          v-model="keyWords" clearable @keyup.13.native="singleSearch">
          <el-button type="primary"  slot="append" @click="singleSearch"> {{$t('search')}}</el-button>
        </el-input>
      </el-col>
      <el-col :span="16">
        <span>{{$t('sortord')}}：</span>
        <el-button  class="commonSort" :class="{'active': orderby === 'createon' && sort === 'asc'}" 
          @click="filterSearch('createon', 'asc')">{{$t('earliestTime')}}</el-button>
        <el-button  class="commonSort" :class="{'active': orderby === 'createon' && sort === 'desc'}"
           @click="filterSearch('createon', 'desc')">{{$t('latestTime')}}</el-button>
        <el-button  class="commonSort" :class="{'active': orderby === 'goodactionnum'}" 
          @click="filterSearch('goodactionnum', 'desc')">{{$t('thumbUpQuantity')}}</el-button>
        <el-button  class="commonSort" :class="{'active': orderby === 'badactionnum'}" 
          @click="filterSearch('badactionnum', 'desc')">{{$t('beingAmount')}}</el-button>
        <el-button  class="commonSort" :class="{'active': orderby === 'commentnum'}" 
          @click="filterSearch('commentnum', 'desc')">{{$t('commentOnTheAmount')}}</el-button>
        <el-button  class="commonSort" :class="{'active': orderby === 'browsernum'}" 
          @click="filterSearch('browsernum', 'desc')">{{$t('referToTheAmount')}}</el-button>
      </el-col>
    </el-row>
    <el-table :data="processList" class="main_tab" stripe border>
      <el-table-column :label="$t('processname')">
        <template slot-scope="scope">
          <a @click="$router.push('/processDetailsDestroy/' + scope.row.id)">{{scope.row.code}}{{scope.row.name}}</a>
        </template>
      </el-table-column>
      <el-table-column :label="$t('creator')" prop="submitname"></el-table-column>
      <el-table-column :label="$t('time')" prop="createon"></el-table-column>
      <el-table-column :label="$t('description')" prop="description"></el-table-column>
      <el-table-column :label="$t('reviseContents')">
        <template slot-scope="scope">
          <span>{{!scope.row.modelReviseHistoryDtos ? '':scope.row.modelReviseHistoryDtos.map(item => item.content).join('; ')}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('processResponsibility2')" prop="bponame"></el-table-column>
      <el-table-column :label="$t('version')">
        <template slot-scope="scope">
          <span>{{scope.row.version}}</span><br />
          <el-link v-show="!showhistoryBtn && scope.row.version != 'V1.0'" type="primary"
            @click="checkHistory(scope.row.listid)">{{$t('viewHistoryVersion')}}</el-link>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <p>
            <span class="item">
              <i class="el-icon-view"></i>
              <span>{{scope.row.browsernum}}</span>
            </span>
            <span class="item">
              <i class="el-icon-s-comment"></i>
              <span>{{scope.row.commentnum}}</span>
            </span>
            <span class="item">
              <i class="icon iconfont icon-zan" style="color:#999"></i>
              <span>{{scope.row.goodactionnum}}</span>
            </span>
            <span class="item">
              <i class="icon iconfont icon-cai" style="color:#999"></i>
              <span>{{scope.row.badactionnum}}</span>
            </span>
          </p>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="process_list">
      <el-row class="process_item" :gutter="20" v-for="(item, index) in processList" :key="index">
        <el-col :span="10" class="left">
          <p @click="$router.push('/processDetailsDestroy/' + item.id)">{{item.code}}{{item.name}}</p>
          <p style="word-wrap:break-word">{{item.description}}</p>
          <p>{{$t('processResponsibility2')}}：{{item.bponame}}</p>
        </el-col>
        <el-col :span="7" class="center">
          <p>
            <i class="el-icon-user-solid"></i>
            <span>{{item.submitname}}</span>
          </p>
          <p>{{item.createon}}</p>
          <p>
            <span>{{$t('version')}}：{{item.version}}</span>
            <el-link type="primary" v-show="!showhistoryBtn && item.version != 'V1.0'"
              @click="checkHistory(item.listid)">{{$t('viewHistoryVersion')}}</el-link>
          </p>
        </el-col>
        <el-col :span="7" class="right">
          <p>
            &nbsp;
          </p>
          <p>&nbsp;</p>
          <p>
            <span class="item">
              <i class="el-icon-view"></i>
              <span>{{item.browsernum}}</span>
            </span>
            <span class="item">
              <i class="el-icon-s-comment"></i>
              <span>{{item.commentnum}}</span>
            </span>
            <span class="item">
              <i class="icon iconfont icon-zan" style="color:#999"></i>
              <span>{{item.goodactionnum}}</span>
            </span>
            <span class="item">
              <i class="icon iconfont icon-cai" style="color:#999"></i>
              <span>{{item.badactionnum}}</span>
            </span>
          </p>
        </el-col>
      </el-row>
    </div> -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pages.pageNum"
      :page-size="pages.pageSize" background layout="prev, pager, next, jumper, total" :total="pages.total">
    </el-pagination>
  </div>
</template>

<script>
import {
  getProcessList,
  queryReleasedelRev,
  queryReleasedel
} from '@/bpa/api/processModelCenter/processHasBeenDestoryed'
import paginations from '@/bpa/mixins/pagination_mixin'
import '@/bpa/assets/fonts/font_zan/iconfont.css'
import '@/bpa/assets/fonts/font_zan/iconfont.eot'
import '@/bpa/assets/fonts/font_zan/iconfont.ttf'
import '@/bpa/assets/fonts/font_zan/iconfont.svg'
export default {
  data () {
    return {
      type:'',
      hisid:'',
      processList: [],
      orderby: 'createon',
      sort: 'asc',
      keyWords: '',
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      localStorage: localStorage,
      showhistoryBtn: false,
    }
  },
  mixins: [paginations],
  mounted () {
    this.getList()
  },
  methods: {
    handleCurrentChange(item){
      this.pages.pageNum = item
      if(this.type == 'his'){
        let obj = {
        orderby: 'createon',
        sort: 'asc',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        filters: [
          {
            key: 'listid',
            opt: 'LIKE',
            type: 'S',
            value: this.hisid
          }
        ]
      }
        queryReleasedelRev(obj).then(res => {
        if (!res) return false
        this.processList = res.list
        this.pages.total = res.total
        this.showhistoryBtn = true
      })
      }else{
        this.getList()
      }
      },
    singleSearch () {
      this.type = ''
      this.pages.pageNum = 1
      let obj = {
        orderby: 'createon',
        sort: this.sort,
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        attr: { attr1: 'value1', attr2: 'value2' },
        filters: [{ key: 'name', opt: 'LIKE', type: 'S', value: this.keyWords }]
      }
      queryReleasedel(obj).then(res => {
        console.log(res)
        if (!res) return false
        this.processList = res.list
        this.pages.total = res.total
      })
    },
    getList () {
      this.type = ''
      let obj = {
        orderby: this.orderby,
        sort: this.sort,
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        attr: { attr1: 'value1', attr2: 'value2' },
        filters: [{ key: 'name', opt: 'LIKE', type: 'S', value: this.keyWords }]
      }
      getProcessList(obj).then(res => {
        if (!res) return false
        this.processList = res.list
        this.pages.total = res.total
        this.showhistoryBtn = false
      })
    },
    checkHistory (id) {
      this.pages.pageNum = 1
      this.type = 'his'
      this.hisid = id
      let obj = {
        orderby: 'createon',
        sort: 'asc',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        filters: [
          {
            key: 'listid',
            opt: 'LIKE',
            type: 'S',
            value: id
          }
        ]
      }
      queryReleasedelRev(obj).then(res => {
        if (!res) return false
        this.processList = res.list
        this.pages.total = res.total
        this.showhistoryBtn = true
      })
    },
    filterSearch (orderby, sort) {
      this.orderby = orderby
      this.sort = sort
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.commonSort {
  &.active {
    background: #2d42af !important;
    border-color: #2d42af !important;
    color: #fff !important;
  }
}
.process_list {
  .process_item {
    border: 1px solid #f6f6f6;
    border-bottom: none;
    &:hover {
      background: #f6f6f6;
    }
    &:last-child {
      border-bottom: 1px solid #f6f6f6;
    }
    .left,
    .center,
    .right {
      p {
        color: #999;
        // display: none;
        i {
          font-size: 14px;
        }
      }
      p:first-child {
        line-height: 30px;
      }
      p:nth-child(2) {
        line-height: 18px;
        font-size: 13px;
      }
      p:last-child {
        line-height: 30px;
        font-size: 14px;
      }
    }
    .left {
      p:first-child {
        font-size: 14px;
        font-weight: 700;
        color: #4ba2ef;
        line-height: 30px;
        cursor: pointer;
      }
    }
    .right {
      text-align: right;
      p:first-child {
        font-size: 14px;
      }
      p:last-child {
        .item {
          padding-right: 5px;
          cursor: pointer;
          &:hover {
            color: #4ba2ef;
          }
          &:last-child {
            padding: 0;
          }
        }
      }
    }
  }
}
</style>
