<template>
  <el-card shadow="1">
    <div>
      <!--    表格-->
      <bas-table
        row-key="id"
        :tableList="content.list"
        :headerList="headerList"
        :pages="page"
        :isShowIndex="false"
        :headerCellStyle="{background: '#E1EAFD !important'}"
        @selectionChange="handleSelectionChange"
        @currentChange="currentChange">
        <template #search>
          <div>
             <el-row>
                <el-col :span="14">
                  <div style="margin-bottom: 20px">
                    <el-radio-group v-model="activeName" size="medium" @change='activeNameChange'  >
                      <el-radio-button v-for="item in myarchivedList" :label="item.key"  :key="item.key">{{$t(item.name)}}</el-radio-button>
                      <!-- <el-radio-button :label="$t('processTrace')"></el-radio-button>
                      <el-radio-button :label="$t('MyCc')"></el-radio-button>
                      <el-radio-button :label="$t('carboncopyToMe')"></el-radio-button>          -->
                    </el-radio-group>
                  </div>
                  </el-col>
                <el-col :span="4" :offset="6">
                <div class="btn-wrap" style="text-align: right;">
                    <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
                      {{ $t('advancedQuery') }}
                      <i :class="isPowerSearch?'el-icon-caret-top':'el-icon-caret-bottom'" />
                    </el-button>
                    <el-button type="primary" @click="rest">
                      {{ $t('refresh') }}
                    </el-button>
                  </div>
                  </el-col>
              </el-row>
              <div class="tool-common-wrap">
                  <div class="search-wrap">
                      <quick-query
                      :placeholder="$t('outAuthView.OrderNumberSubjectApplicantProcessNameStatus')"
                      :isDate="false"
                      ref="quick"
                      @quickSearch="quickSearch"
                    />
                  </div>
                  
              </div>
              <el-form
                class="power-search"
                :model="searchForm"
                @keyup.enter.native="powerSearch"
                ref="searchForm"
                label-width="120px"
                size="mini"
                v-if="isPowerSearch"
              >
                <el-row>
                
                  <el-col :span="8">
                    <el-form-item :label="$t('processName2') + '：'">
                      <el-input clearable type="text" v-model="searchForm.processNameCn"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('subject') + '：'">
                      <el-input clearable type="text" v-model="searchForm.subject"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('applicant') + '：'">
                      <el-input clearable type="text" v-model="searchForm.drafter"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                
                  <el-col :span="8">
                    <el-form-item :label="$t('applicationDate') + '：'">
                      <el-date-picker
                        v-model="searchForm.reqDate"
                        type="daterange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time="['00:00:00','23:59:59']"
                        :range-separator="$t('placeholderText.to')"
                        :start-placeholder="$t('placeholderText.startDate')"
                        :end-placeholder="$t('placeholderText.endDate')"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('endDate2') + '：'">
                      <el-date-picker
                        v-model="searchForm.endDate"
                        type="daterange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time="['00:00:00','23:59:59']"
                        :range-separator="$t('placeholderText.to')"
                        :start-placeholder="$t('placeholderText.startDate')"
                        :end-placeholder="$t('placeholderText.endDate')"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                    <el-col :span="8">
                    <el-form-item :label="$t('ArchiveCoding') + '：'">
                      <el-input clearable type="text" v-model="searchForm.archiveNum"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="$t('archiveDate') + '：'">
                      <el-date-picker
                        v-model="searchForm.archiveDate"
                        type="daterange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time="['00:00:00','23:59:59']"
                        :range-separator="$t('placeholderText.to')"
                        :start-placeholder="$t('placeholderText.startDate')"
                        :end-placeholder="$t('placeholderText.endDate')"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="text-r">
                    <el-button type="primary" @click="quickQueryData">{{ $t('query') }}</el-button>
                    <el-button type="primary" @click="rest">{{ $t('reset') }}</el-button>
                  </el-col>
                </el-row>
              </el-form>
          </div>
        </template>
        <!-- ID -->
        <template #instid="{ row }">
          <div>{{ row.instid }}</div>
        </template>
        <!-- 流程名称 -->
        <template #processNameCn="{ row }">
          <div>{{ row.processNameCn }}</div>
        </template>
        <!-- 申请人 -->
        <template #drafter="{ row }">
          <div>{{ row.drafter }}</div>
        </template>
        <!-- 申请单号 -->
        <template #reqNo="{ row }">
          <div>{{ row.reqNo }}</div>
        </template>
        <!-- 主题 -->
        <template #subject="{ row }">
          <div>{{ row.subject }}</div>
        </template>
        <!-- 申请时间 -->
        <template #reqDate="{ row }">
          <div>{{ row.reqDate | formatDateTime }}</div>
        </template>
        <!-- 结束时间 -->
        <template #endDate="{ row }">
          <div>{{ row.endDate | formatDateTime }}</div>
        </template>
        <!-- 归档时间 -->
        <template #archiveDate="{ row }">
          <div>{{ row.archiveDate | formatDateTime }}</div>
        </template>
      </bas-table>
    </div>
  </el-card>
</template>
<script>

import QuickQuery from "@/bpm/components/quickquery/QuickQuery";
import SearchListMixin from "@/bpm/mixins/search_list_mixin";
import { getArchiveList } from "@/bpm/api/process/administrativeTool/myarchivedData";
window.addEventListener("storage", function(e) {
  if (e.key === "isReload" && e.newValue === "true") {
    if (window.searchType === "power") {
      window.getData();
    } else {
      window.quickQueryData();
    }
  }
});
export default {
    mixins: [SearchListMixin],
    components: {
    QuickQuery,  
    },

  data() {
    return {
    activeName:'wdsq',
    myarchivedList:[
      {
        name:this.$t('MyApplication'),
        key:'wdsq'
      },
      {
        name:this.$t('processTrace'),
        key:'lcgz'
      },
      {
        name:this.$t('MyCc'),
        key:'wdcs'
      },
      {
        name:this.$t('carboncopyToMe'),
        key:'csdw'
      },
    ]
    };
  },
   mounted() {
    this.getData();
  },
  methods: {
    activeNameChange(){
      console.log(this.activeName);
      this. getData()
    },
  // 搜索
        
    quickQueryData () {
      this.filters = [];
      this.page.pageNum = 1;
      Object.keys(this.searchForm).forEach(key => {
        const filter = {
          key,
          opt: "LIKE",
          type: "S",
          value: this.searchForm[key]
        };
        if (
          key === "processNameCn" ||
          key === "subject" ||
          key === "drafter" ||
          key === "archiveNum"
        ) {

           filter.type = 'S'
          filter.opt = 'LIKE'
          filter.value = this.searchForm[key]
       
        }
          if (key === 'reqDate' || key === 'endDate' ||  key === 'archiveDate') {
          filter.type = 'D'
          filter.opt = 'BETWEEN'
          filter.value = this.searchForm[key]
            ? this.searchForm[key].join('~')
            : ''
        }
        this.filters.push(filter);
      });
      this.getData();
    },
        getData() {
      this.loading = true;
      this.checkAll = false;
      getArchiveList({
        type:this.activeName,
        logic: "and",
        queryFilter: [
          "instid",
          "processNameCn",
          'drafter',
          'subject',
          'reqNo'
        ],
        ...this.quickData,
        filters: this.filters,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          console.log('rt---------',rt);
          // rt.data.list.forEach(item => {
          //   item.checked = false;
          // });
          this.content = rt.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
         });
       }
      }
};
</script>
<style lang="scss" scoped>
 /deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
background-color: #2d42af;
}
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
