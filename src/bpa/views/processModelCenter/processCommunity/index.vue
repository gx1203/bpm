<template>
  <div id="processCommunity" class="pageWrap">
    <div class="pageContent">
      <div class="leftTree">
        <process-iframe
          v-if="reload"
          @click_="handlerProcessIframeNodeClick"
        ></process-iframe>
      </div>
      <div class="listContent">
        <div class="right-content">
          <bas-table
            row-key="id"
            :tableList="processList"
            :headerList="headerList"
            :pages="pages"
            @currentChange="handleCurrentChange"
          >
            <!-- 搜索和功能按钮区 -->
            <template #search>
              <div>
                <el-row class="margin-b10">
                  <el-col :span="6" @keyup.13="singleSearch2">
                    <bas-search
                      :placeholder="
                        $t('placeholderText.pleaseEnterProcessName')
                      "
                      v-model="keyWords"
                      @fnSearch="singleSearch2"
                    />
                  </el-col>
                  <!--    排序按钮        -->
                  <el-col :offset="1" :span="14">
                    <span>{{ $t('sortord') }}：</span>
                    <el-button
                      class="commonSort"
                      :class="{
                        active: orderby === 'effectiveon' && sort === 'asc'
                      }"
                      @click="filterSearch('effectiveon', 'asc')"
                      >{{ $t('earliestTime') }}
                    </el-button>
                    <el-button
                      class="commonSort"
                      :class="{
                        active: orderby === 'effectiveon' && sort === 'desc'
                      }"
                      @click="filterSearch('effectiveon', 'desc')"
                      >{{ $t('latestTime') }}
                    </el-button>
                    <el-button
                      class="commonSort"
                      :class="{ active: orderby === 'goodactionnum' }"
                      @click="filterSearch('goodactionnum', 'desc')"
                      >{{ $t('thumbUpQuantity') }}
                    </el-button>
                    <el-button
                      class="commonSort"
                      :class="{ active: orderby === 'badactionnum' }"
                      @click="filterSearch('badactionnum', 'desc')"
                      >{{ $t('beingAmount') }}
                    </el-button>
                    <el-button
                      class="commonS  ort"
                      :class="{ active: orderby === 'commentnum' }"
                      @click="filterSearch('commentnum', 'desc')"
                      >{{ $t('commentOnTheAmount') }}
                    </el-button>
                    <el-button
                      class="commonSort"
                      :class="{ active: orderby === 'browsernum' }"
                      @click="filterSearch('browsernum', 'desc')"
                      >{{ $t('referToTheAmount') }}
                    </el-button>
                  </el-col>
                  <el-col :span="3">
                    <el-button
                      type="primary"
                      @click="moreInfoShow = !moreInfoShow"
                    >
                      {{ $t('advancedQuery') }}
                      <i
                        :class="
                          moreInfoShow
                            ? 'el-icon-caret-bottom'
                            : 'el-icon-caret-top'
                        "
                      ></i>
                    </el-button>
                  </el-col>
                </el-row>
                <div v-show="moreInfoShow">
                  <el-form
                    class="search_options_wrap"
                    style="padding: 10px 10px 10px 0 !important"
                    :model="moreInfo"
                    label-width="100px"
                  >
                    <el-row>
                      <el-col :span="8">
                        <el-form-item label="状态">
                          <el-select
                            v-model="moreInfo.optionsItem"
                            placeholder="请选择"
                          >
                            <el-option
                              v-for="item in options"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <div class="search_buttons_wrap">
                      <el-button type="primary" @click="getList()">
                        {{ $t('search') }}
                      </el-button>
                      <!--                <el-button type="default" @click="resetAction">-->
                      <!--                  {{ $t("reset") }}-->
                      <!--                </el-button>-->
                    </div>
                  </el-form>
                </div>
              </div>
            </template>

            <!-- 流程名 -->
            <template #name="{ row }">
              <router-link
                style="color: #2d42af"
                target="_blank"
                :to="{ path: `/processDetails/${row.id}` }"
                >{{ row.code }}{{ row.name }}</router-link
              >
            </template>

            <!-- 时间 -->
            <template #time="{ row }">
              {{ row.effectiveon | formatDateTime }}
            </template>

            <!-- 修订内容 -->
            <template #reason="{ row }">
              <span>{{
                !row.modelReviseHistoryDtos
                  ? ''
                  : row.modelReviseHistoryDtos
                      .map(item => item.content)
                      .join('; ')
              }}</span>
            </template>

            <!-- 版本 -->
            <template #version="{ row }">
              <span>{{ row.version }}</span>
              <br />
              <el-link
                v-show="!showhistoryBtn && row.version != 'V1.0'"
                type="primary"
                @click="checkHistory(row.listid)"
                >{{ $t('viewHistoryVersion') }}
              </el-link>
            </template>

            <!-- 查阅 -->
            <template #default="{ row }">
              <p>
                <span class="item margin-r5">
                  <i class="el-icon-view"></i>
                  <span>{{ row.browsernum }}</span>
                </span>
                <span class="item">
                  <i class="el-icon-s-comment"></i>
                  <span>{{ row.commentnum }}</span>
                </span>
              </p>
              <p>
                <span class="item margin-r5">
                  <i class="icon iconfont icon-zan" style="color:#999"></i>
                  <span>{{ row.goodactionnum }}</span>
                </span>
                <span class="item">
                  <i class="icon iconfont icon-cai" style="color:#999"></i>
                  <span>{{ row.badactionnum }}</span>
                </span>
              </p>
            </template>
          </bas-table>
        </div>
      </div>
    </div>
    <el-dialog :title="headTitle" :visible.sync="dialogVisible" width="65%">
      <el-table :data="recordsList" class="main_tab">
        <el-table-column :label="$t('number')" type="index"></el-table-column>
        <el-table-column
          prop="subject"
          :label="$t('subject')"
        ></el-table-column>
        <el-table-column
          prop="processnodename"
          :label="$t('approvalNodeName')"
        ></el-table-column>
        <el-table-column
          prop="username"
          :label="$t('approver')"
        ></el-table-column>
        <el-table-column
          prop="approvaltime"
          width="100"
          :label="$t('approvalTime1')"
        ></el-table-column>
        <el-table-column
          prop="approvaloperation"
          width="120"
          :label="$t('approvalOperation')"
        ></el-table-column>
        <el-table-column prop="remark" :label="$t('remarks')"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="dialogVisible = false">{{
          $t('confirm')
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCommunityList,
  getCommunityhistoryList,
  getRecentabolished1,
  getRelease,
  getRecords
} from '@/bpa/api/processModelCenter/processCommunity'
import { getProcessIframeTree } from '@/bpa/api/componentsApi'
import paginations from '@/bpa/mixins/pagination_mixin'
import '@/bpa/assets/fonts/font_zan/iconfont.css'
import '@/bpa/assets/fonts/font_zan/iconfont.eot'
import '@/bpa/assets/fonts/font_zan/iconfont.ttf'
import '@/bpa/assets/fonts/font_zan/iconfont.svg'

export default {
  data() {
    return {
      headerList: [
        {
          label: this.$t('processname'),
          slotName: 'name'
        },
        {
          label: this.$t('creator'),
          prop: 'submitname'
        },
        {
          label: this.$t('time'),
          slotName: 'time'
        },
        {
          label: this.$t('description'),
          prop: 'description'
        },
        {
          label: this.$t('reviseContents'),
          slotName: 'reason'
        },
        {
          label: this.$t('version'),
          slotName: 'version'
        },
        {
          label: this.$t('refer'),
          slotName: 'default'
        }
      ],
      reload: true,
      showhistoryBtn: false,
      processList: [],
      orderby: 'effectiveon',
      sort: 'desc',
      keyWords: '',
      headTitle: '',
      recordsList: [],
      selectid: '',
      dialogVisible: false,
      moreInfoShow: false,
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      moreInfo: {
        optionsItem: '1'
      },
      options: [
        {
          label: '已发布',
          value: '1'
        },
        {
          label: '已作废',
          value: '2'
        }
      ]
    }
  },
  mixins: [paginations],
  mounted() {
    // this.getList()
  },
  methods: {
    checkRecords(row) {
      this.headTitle = row.code + row.name
      getRecords(row.instid).then(res => {
        if (!res) return false
        this.dialogVisible = true
        this.recordsList = res
      })
    },
    singleSearch2() {
      this.pages.pageNum = 1
      let obj = {
        orderby: this.orderby,
        filters: [
          { key: 'name', opt: 'LIKE', type: 'S', value: this.keyWords },
          { key: 'modelid', opt: 'LIKE', type: 'S', value: this.selectid }
        ],
        sort: this.sort,
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize
      }
      this.getList(obj)
    },
    checkHistory(id) {
      this.pages.pageNum = 1
      let obj = {
        orderby: 'createon',
        sort: 'desc',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        filters: [{ key: 'listid', opt: 'LIKE', type: 'S', value: id }]
      }
      if (this.moreInfo.optionsItem === '1') {
        getCommunityhistoryList(obj).then(res => {
          console.log('🍇')
          if (!res) return false
          this.processList = res.list
          this.pages.total = res.total
          this.showhistoryBtn = true
        })
      } else {
        getRecentabolished1(obj).then(res => {
          console.log('🍇')
          if (!res) return false
          this.processList = res.list
          this.pages.total = res.total
          this.showhistoryBtn = true
        })
      }
    },
    getList(obj) {
      console.log(obj, 'obj')
      obj = obj || {
        orderby: this.orderby,
        sort: this.sort,
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        filters: [
          { key: 'name', opt: 'LIKE', type: 'S', value: this.keyWords },
          { key: 'modelid', value: this.selectid }
        ],
        attr: { attr1: 'value1', attr2: 'value2' }
      }
      getCommunityList(obj, this.moreInfo.optionsItem).then(res => {
        if (!res) return false
        this.processList = res.list
        this.pages.total = res.total
        this.showhistoryBtn = false
      })
    },
    filterSearch(orderby, sort) {
      this.orderby = orderby
      this.sort = sort
      this.getList()
    },
    handlerProcessIframeNodeClick(data) {
      console.log(data)
      if (data.id == '79957553BD2F3978E053BF1A13ACD486') {
        this.selectid = ''
      } else {
        this.selectid = data.id
      }
      if (!data.id) {
        this.selectid = ''
      }
      let obj = {
        filters: [{ key: 'modelid', value: this.selectid }],
        orderby: this.orderby,
        sort: this.sort,
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize
      }
      this.getList(obj)
    }
  }
}
</script>
<style lang="scss" scoped>
#processCommunity {
  background-color: white;
}
// /deep/ .el-form-item__label {
//    padding: 0 5px 0 0 !important;
//  }
.subtitle {
  font-size: 14px;
  color: #4ba2ef;
  position: relative;
  min-height: 20px;

  h5 {
    width: 63px;
    position: absolute;
    top: 0;
    left: 10px;
  }

  p {
    width: 100%;
    box-sizing: border-box;
    padding-left: 65px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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

    /deep/ .el-link {
      vertical-align: top;
    }

    p {
      color: #999;
      font-size: 14px;
      line-height: 30px;
    }

    .desc {
      p {
        line-height: 20px;
        word-break: break-all;
      }
    }

    .left {
      p {
        font-weight: 700;
        color: #4ba2ef;
        cursor: pointer;
      }
    }

    .center {
      p span:nth-of-type(1),
      p i {
        font-weight: 700;
        color: #4ba2ef;
      }
    }

    .right {
      text-align: right;
    }
  }
}

#processCommunity {
  .commonSort {
    &.active {
      background: #2d42af !important;
      border-color: #2d42af !important;
      color: #fff !important;
    }
  }
}

/deep/ .el-tree-node__content {
  font-size: 13px !important;
  align-items: stretch !important;
}

.more-info {
  border: 1px solid #eeeeee;
  padding: 10px;
  margin-bottom: 10px;
}
span.item i {
  font-size: 13px !important;
  margin-right: 3px;
}
</style>
