<template>
  <el-card shadow="never">
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <el-select clearable v-model="dateRange">
          <el-option
            v-for="item in dateRangeList"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input clearable v-model="searchKey">
          <span slot="append"><i class="iconfont icon-sousuo2"></i></span>
        </el-input>
      </div>
      <div class="btn-wrap">
        <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
          {{ $t('advancedQuery') }}
          <i :class="isPowerSearch?'el-icon-caret-top':'el-icon-caret-bottom'"/>
        </el-button>
        <el-button type="primary" @click="refreshData">
           {{ $t('refresh') }}
          <!--<i class="el-icon-refresh"/>-->
        </el-button>
      </div>
    </div>
    <el-form
      class="power-search"
      :model="searchForm"
      @keyup.enter.native="search"
      ref="searchForm"
      label-width="120px"
      size="mini"
      v-if="isPowerSearch">
    <el-row>
        <el-col :span="8">
          <el-form-item label="登录名：">
            <el-input clearable type="text" v-model="searchForm.reqNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="中文登录名：">
            <el-input clearable type="text" v-model="searchForm.reqNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="登录时间：">
              <el-date-picker
                v-model="searchForm.updateDate"
                type="daterange"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00','23:59:59']"
                :range-separator="$t('placeholderText.to')"
              :start-placeholder="$t('placeholderText.startDate')"
              :end-placeholder="$t('placeholderText.endDate')">
              </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
       <el-row>
        <el-col :span="8">
          <el-form-item label="设备UDID：">
            <el-input clearable type="text" v-model="searchForm.reqNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否登录成功：">
            <el-select clearable v-model="searchForm.type" class="w100" :placeholder="$t('placeholderText.pleaseSelect')">
            <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="text-r">
          <el-button type="primary" @click="search">{{ $t('query') }}</el-button>
          <el-button type="primary" @click="reset">{{ $t('reset') }}</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="table-header margin-t10">
      <el-checkbox v-model="checkAll" class="all-check"/>
      <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort"/>
    </div>
        <div v-if="content.list && content.list.length!==0">

    <div class="tr" v-for="(item, index) in content.list" :key="index">
      <div class="tr-title">
        <el-checkbox v-model="item.checked" style="margin-right: 10px" />
        <span>登录时间：{{item.createDate | formatDateTime}}</span>
        <!-- <span style="margin-left: 60px">结束时间：{{item.createDate | formatDateTime}}</span>
        <span style="margin-left: 60px">收回时间：{{item.createDate | formatDateTime}}</span> -->
        <!-- <span style="margin-left: 60px">申请单号：{{item.reqNo}}</span> -->
      </div>
      <el-row class="tr-body" type="flex" align="middle">
        <el-col class="td" :span="headers[0].span">{{item.drafter}}</el-col>
        <el-col class="td" :span="headers[1].span">{{item.passReaderUserName}}</el-col>
        <el-col class="td" :span="headers[2].span">{{item.passReaderUserName}}</el-col>
        <el-col class="td" :span="headers[3].span">{{item.passReaderUserName}}</el-col>
        <!-- <el-col style="text-align: center" :span="headers[4].span">
          <el-button type="text" icon="el-icon-edit" @click="addList"></el-button>
          <el-button type="text" icon="el-icon-delete"></el-button>
        </el-col> -->
      </el-row>
    </div>
    </div>
    <div v-else class="text-c pad-10px tr-empty"> {{ $t('noData') }}</div>

    <el-pagination
      style="margin-top: 15px"
      :page-size="page.pageSize"
      :current-page.sync="page.pageNum"
      background
      @current-change="getData"
      :total="content.total"></el-pagination>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      dateRange: '',
      dateRangeList: [
        {
          name: '近一个月',
          value: '1'
        },
        {
          name: '近二个月',
          value: '2'
        },
        {
          name: '近三个月',
          value: '3'
        }
      ],
      searchKey: '',
      typeList: [
        {
          value: "2",
          label: this.$t('yes')
        },
        {
          value: "3",
          label: this.$t('no')
        }
      ],
      loading: false,
      isPowerSearch: false,
      searchForm: {},
      editItem: {},
      linkTitle: '',
      headers: [
        {
          key: 'drafter',
          name: '登录名',
          span: 6
        },
        {
          key: 'passReaderUserName',
          name: '中文登录名',
          span: 6
        },
        {
          key: 'passReaderUserName',
          name: '设备UDID',
          span: 6
        },
        {
          key: 'passReaderUserName',
          name: '是否登录成功',
          span: 6
        }
      ],
      content: {
        list: [{

        }]
      },
      page: {
        pageNum: 1,
        pageSize: 10
      },
      checkAll: ''
    }
  },
  methods:{
    refreshData() {

    },
    addList(item,data) {

    },
    getData() {},
    handleSort(val) {
      this.sort = val
    },
    search() {},
    reset() {}
  }
}
</script>

<style lang="scss" scoped>
  .table-header {
    position: relative;
    background: $bc2;
    display: flex;
    align-items: center;
    .all-check {
        position: absolute;
        left: 20px;
    }
  }
  .w100 {
      width: 100%;
  }

</style>
