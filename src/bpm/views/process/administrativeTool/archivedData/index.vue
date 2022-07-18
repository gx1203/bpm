<template>
  <el-card shadow="never" class="card-reset">
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
             <div class="tool-common-wrap">
                <div class="search-wrap">
                  <!-- <quick-query :placeholder="$t('processName2')" :isDate="false" ref="quick" @quickSearch="quickSearch" /> -->
                  <quick-query :placeholder="$t('outAuthView.OrderNumberSubjectApplicantProcessNameStatus')" :isDate="false"
                    ref="quick" @quickSearch="quickSearch" />
                </div>
                <div class="btn-wrap">
                  <el-button type="primary" @click="recovery('批量')">
                    {{ $t('BatchRecovery') }}
                    <!--<i class="el-icon-s-tools" />-->
                  </el-button>
                  <el-button type="primary" @click="addList">
                    {{ $t('setArchiveTime') }}
                    <!--<i class="el-icon-s-tools" />-->
                  </el-button>
                  <el-button type="primary" @click="setarchive">
                    {{ $t('dataArchiving') }}
                    <!--<i class="el-icon-box" />-->
                  </el-button>
                  <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
                    {{ $t('advancedQuery') }}
                    <i :class="isPowerSearch?'el-icon-caret-top':'el-icon-caret-bottom'" />
                  </el-button>
                  <el-button type="primary" @click="rest">
                    {{ $t('refresh') }}
                    <!---->
                  </el-button>
                </div>
              </div>
              <el-form class="power-search" :model="searchForm" @keyup.enter.native="powerSearch" ref="searchForm"
                label-width="120px" size="mini" v-if="isPowerSearch">
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="$t('processName2') + '：'">
                      <el-input clearable type="text" v-model="searchForm.processnamecn"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('applicationNumber') + '：'">
                      <el-input clearable type="text" v-model="searchForm.reqno"></el-input>
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
                    <el-form-item :label="$t('subject') + '：'">
                      <el-input clearable type="text" v-model="searchForm.subject"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('applicationDate') + '：'">
                      <el-date-picker v-model="searchForm.reqdate" type="daterange" value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time="['00:00:00','23:59:59']" :range-separator="$t('placeholderText.to')"
                        :start-placeholder="$t('placeholderText.startDate')" :end-placeholder="$t('placeholderText.endDate')">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('endDate2') + '：'">
                      <el-date-picker v-model="searchForm.finishDate" type="daterange" value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time="['00:00:00','23:59:59']" :range-separator="$t('placeholderText.to')"
                        :start-placeholder="$t('placeholderText.startDate')" :end-placeholder="$t('placeholderText.endDate')">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="$t('archiveDate') + '：'">
                      <el-date-picker v-model="searchForm.archiveDate" type="daterange" value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time="['00:00:00','23:59:59']" :range-separator="$t('placeholderText.to')"
                        :start-placeholder="$t('placeholderText.startDate')" :end-placeholder="$t('placeholderText.endDate')">
                      </el-date-picker>
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
        <template #processnamecn="{ row }">
          <div>{{ row.processnamecn }}</div>
        </template>
        <!-- 申请人 -->
        <template #drafter="{ row }">
          <div>{{ row.drafter }}</div>
        </template>
        <!-- 申请单号 -->
        <template #reqno="{ row }">
          <div>{{ row.reqno }}</div>
        </template>
        <!-- 主题 -->
        <template #subject="{ row }">
          <div>{{ row.subject }}</div>
        </template>
        <!-- 申请时间 -->
        <template #reqdate="{ row }">
          <div>{{ row.reqdate | formatDateTime }}</div>
        </template>
        <!-- 结束时间 -->
        <template #finishDate="{ row }">
          <div>{{ row.finishDate | formatDateTime }}</div>
        </template>
        <!-- 归档时间 -->
        <template #archiveDate="{ row }">
          <div>{{ row.archiveDate | formatDateTime }}</div>
        </template>
        <!-- 归档记录编码 -->
        <template #archiveNum="{ row }">
          <div>{{ row.archiveNum }}</div>
        </template>
        <!-- 操作 -->
        <template #archiveId="{ row }">
          <el-tooltip class="item" :content="$t('dataRecovery')" placement="top">
              <el-button type="text" @click="recoverys(row)">{{ $t('dataRecovery') }}</el-button>
            </el-tooltip>
        </template>
      </bas-table>

    <!-- <el-pagination style="margin-top: 15px" :page-size="page.pageSize" :current-page.sync="page.pageNum" background
      @current-change="searchType === 'power' ? getData() : quickQueryData()" :total="content.total"></el-pagination> -->
    <archived-data-dialog v-model="dialogVisible" :item="editItem" :title="linkTitle" @confirm="saveSuccess" />
    <data-recovery v-model="dialogVisible1" :title="linkTitle1" @confirm="saveSuccess"></data-recovery>
  </el-card>
</template>

<script>
import archivedDataDialog from "./archivedDataDialog";
import dataRecovery from "./dataRecovery";
import QuickQuery from "@/bpm/components/quickquery/QuickQuery";
import SearchListMixin from "@/bpm/mixins/search_list_mixin";
import { getprocessArchive, setarchive, dataRecoveryByInstid } from '@/bpm/api/process/processModeling/approve_type'

window.addEventListener("storage", function (e) {
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
    archivedDataDialog,
    dataRecovery,
    QuickQuery
  },
  data () {
    return {
      editItem: {},
      editItem1: {},
      isPowerSearch: false,
      dialogVisible: false,
      dialogVisible1: false,
      linkTitle: "",
      linkTitle1: "",
      headers: [
        {
          key: "drafter",
          name: "ID",
          span: 8
        },
        {
          key: "passReaderUserName",
          name: this.$t('processName2'),
          span: 8
        },
        {
          key: "passReaderUserName",
          name: this.$t('applicant'),
          span: 8
        },
        {
          key: "passReaderUserName",
          name: this.$t('applicationNumber'),
          span: 8
        },
        {
          key: "passReaderUserName",
          name: this.$t('subject'),
          span: 8
        }
      ],
      checkAll: "",
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      // 表头字段
      headerList: [
        {
          label: this.$t('ID'), // ID
          prop: 'instid',
          slotName: 'instid',
          sortable: true
        },
        {
          label: this.$t('processName2'), // 流程名称
          prop: 'processnamecn',
          slotName: 'processnamecn',
          sortable: true
        },
        {
          label: this.$t('applicant'), // 申请人
          prop: 'drafter',
          slotName: 'drafter',
          sortable: true
        },
        {
          label: this.$t('applicationNumber'), // 申请单号
          prop: 'reqno',
          slotName: 'reqno',
          sortable: true
        },
        {
          label: this.$t('subject'), // 主题
          prop: 'subject',
          slotName: 'subject',
          sortable: true
        },
        {
          label: this.$t('applicationDate'), // 申请时间
          prop: 'reqdate',
          slotName: 'reqdate',
          sortable: true
        },
        {
          label: this.$t('endDate2'), // 结束日期
          prop: 'finishDate',
          slotName: 'finishDate',
          sortable: true
        },
        {
          label: this.$t('archiveDate'), // 归档日期
          prop: 'archiveDate',
          slotName: 'archiveDate',
          sortable: true
        },
        {
          label: this.$t('ArchivalRecordCoding'), // 归档记录编码
          prop: 'archiveNum',
          slotName: 'archiveNum',
          sortable: true
        },
        {
          label: this.$t('operation'), // 操作
          prop: 'archiveId',
          slotName: 'archiveId',
          sortable: false
        }
      ]
    };
  },
  mounted () {
    window.getData = this.getData;
    window.quickQueryData = this.quickQueryData;
    this.getData()
  },

  methods: {
    // 页码改变事件
    currentChange(newPageNum) {
      console.log('newPage', newPageNum)
      this.page.pageNum = newPageNum
      this.searchType === 'power' ? this.getData() : this.quickQueryData()
    },
    // 复选框勾选事件
    handleSelectionChange(data) {
      console.log(data)
      this.selections = data
    },
    setarchive () {
      setarchive({
        // "archivedate": "2021-01-22"
      })
        .then(rt => {
          if (rt.status === "200") {
            this.getData()

            this.$message({
              message: this.$t('hintText.saveSuccessfully'),
              type: "success"
            });
          } else {
            this.$message({
              message: this.$t('hintText.failToSave'),
              type: "error"
            });
          }
        })
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
          key === "processnamecn" ||
          key === "drafterid" ||
          key === "drafter" ||
          key === "subject"
        ) {

          filter.type = 'S'
          filter.opt = 'LIKE'
          filter.value = this.searchForm[key]

        }
        if (key === 'reqdate' || key === 'finishDate' || key === 'archiveDate') {
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
    recovery (item) {
      this.dialogVisible1 = true
      this.linkTitle1 = this.$t('ArchiveCoding')
    },
    recoverys (item) {
      this.$confirm('此操作将恢复该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        dataRecoveryByInstid({ instidList: [item.instid] })
          .then(rt => {
            if (rt.status === "200") {
              this.$message({
                message: this.$t('hintText.operateSuccessfully'),
                type: "success"
              });
              this.getData()

            } else {
              this.$message({
                message: this.$t('hintText.operationFailure'),
                type: "error"
              });
              this.getData()

            }
          })
          .catch(() => {
            this.$message({
              message: this.$t('hintText.operationFailure'),
              type: "error"
            });
          });

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });





    },
    saveSuccess (data) {
      if (data) {
        if (this.searchType === "power") {
          this.getData();
        } else if (this.searchType === "quick") {
          this.quickQueryData();
        }
      }
    },
    addList (item, data) {
      this.dialogVisible = true;
      this.linkTitle = this.$t('setArchiveTime')
    },

    getData () {
      this.loading = true;
      this.checkAll = false;
      getprocessArchive({
        logic: "and",
        queryFilter: [
          "processnamecn",
          "drafterid",
          'drafter',
          'subject',
          'reqno'
        ],
        ...this.quickData,
        filters: this.filters,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          // rt.data.list.forEach(item => {
          //   item.checked = false;
          // });
          this.content = rt.data;
          this.page.total = rt.data.total
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
