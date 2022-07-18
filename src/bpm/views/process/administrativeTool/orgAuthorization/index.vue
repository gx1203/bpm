<template>
  <el-card shadow="never" class="card-reset">
    <div id="out-table" v-loading="loading">
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
                <quick-query class="pull-left" :placeholder="$t('JurisdictionSearchHint')" ref="quick"
                  @quickSearch="quickSearch" />

              </div>
              <div class="btn-wrap">
                <!-- <el-button  type="primary" @click="isPowerSearch = !isPowerSearch">
                  高级搜索
              </el-button> -->
                <el-upload class="upload-demo" :action="action" name="file" :data="{'dataType':'orgauthorize'}"
                  :headers="headData" :show-file-list='false' :before-upload="beforeAvatarUpload" :on-success="uploadSuccess"
                  :on-error="uploadError" style="display: inline-block;margin-right: 10px;">
                  <el-button type="primary">
                    {{ $t('import') }}
                    <!--<i class="el-icon-upload2" />-->
                  </el-button>
                </el-upload>
                <export :filters="filters" :selections="selections" type="orgauthorize" />

                <el-button type="primary" @click="addList('添加组织授权管理')">
                  {{ $t('add') }}

                </el-button>
                <!-- <el-button type="primary" @click="excelFile">
                导出excel
                <i class="el-icon-download" />
              </el-button> -->
                <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
                  {{ $t('advancedQuery') }}
                  <i :class="isPowerSearch?'el-icon-caret-top':'el-icon-caret-bottom'" />
                </el-button>
                <el-button type="primary" @click="getData">
                  {{ $t('refresh') }}

                </el-button>
              </div>
            </div>
            <el-form class="power-search" :model="searchForm" @keyup.enter.native="search" ref="searchForm"
              label-width="120px" size="mini" v-if="isPowerSearch">
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('authorizer')+'：'">
                    <el-input type="text" v-model="searchForm.accreditName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('agent')+'：'">
                    <el-input type="text" v-model="searchForm.proxyName"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item :label="$t('agentStartTime')+'：'">
                    <el-date-picker v-model="searchForm.startDate" type="daterange" value-format="yyyy-MM-dd HH:mm:ss"
                      :default-time="['00:00:00','23:59:59']" range-separator="~" :start-placeholder="$t('startDate2')"
                      :end-placeholder="$t('endDate2')"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('agentOverTime')+'：'">
                    <el-date-picker v-model="searchForm.endDate" type="daterange" value-format="yyyy-MM-dd HH:mm:ss"
                      :default-time="['00:00:00','23:59:59']" range-separator="~" :start-placeholder="$t('startDate2')"
                      :end-placeholder="$t('endDate2')"></el-date-picker>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item :label="$t('agentAllFlow')+'：'">
                    <el-select v-model="searchForm.isAllProcess" :placeholder="$t('placeholderText.pleaseSelect')"
                      class="w100">
                      <el-option v-for="item in isAllProcessList" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item :label="$t('flow')+'：'">
                    <el-input type="text" v-model="searchForm.processnames"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item :label="$t('SponsorOrganization')+'：'">
                    <el-input type="text" v-model="searchForm.orgnames"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('createTime')+'：'">
                    <el-date-picker v-model="searchForm.createon" type="daterange" value-format="yyyy-MM-dd HH:mm:ss"
                      :default-time="['00:00:00','23:59:59']" range-separator="~" :start-placeholder="$t('startDate2')"
                      :end-placeholder="$t('endDate2')"></el-date-picker>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item :label="$t('creator')+'：'">
                    <el-input type="text" v-model="searchForm.createname"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('changeTheTime')+'：'">
                    <el-date-picker v-model="searchForm.updateon" type="daterange" value-format="yyyy-MM-dd HH:mm:ss"
                      :default-time="['00:00:00','23:59:59']" range-separator="~" :start-placeholder="$t('startDate2')"
                      :end-placeholder="$t('endDate2')"></el-date-picker>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item :label="$t('modifier')+'：'">
                    <el-input type="text" v-model="searchForm.updatename"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item :label="$t('state')+'：'">
                    <el-select v-model="searchForm.status" :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" class="text-r">
                  <el-button type="primary" @click="search">{{$t('basDataConfig.query')}}</el-button>
                  <el-button type="primary" @click="rest">{{$t('basDataConfig.reset')}}</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </template>
        <!-- 授权人 -->
        <template #accreditName="{ row }">
          <div>{{ row.accreditName }}</div>
        </template>
        <!-- 代理人 -->
        <template #proxyName="{ row }">
          <div>{{ row.proxyName }}</div>
        </template>
        <!-- 代理开始时间 -->
        <template #startDate="{ row }">
          <div>{{getFormateDateAction(row.startDate, 'yyyy-MM-dd')}}</div>
        </template>
        <!-- 代理结束时间 -->
        <template #endDate="{ row }">
          <div>{{getFormateDateAction(row.endDate, 'yyyy-MM-dd')}}</div>
        </template>
        <!-- 代理所有流程 -->
        <template #isAllProcess="{ row }">
          <div>{{row.isAllProcess==='Y'?$t('yes'):$t('no')}}</div>
        </template>
        <!-- 不代理的流程 -->
        <template #processnames="{ row }">
          <div>{{row.processnames}}</div>
        </template>
        <!-- 发起人组织 -->
        <template #orgnames="{ row }">
          <div>{{row.orgnames}}</div>
        </template>
        <!-- 创建时间 -->
        <template #createon="{ row }">
          <div>{{row.createon | formatDateTime}}</div>
        </template>
        <!-- 创建人 -->
        <template #createname="{ row }">
          <div>{{row.createname}}</div>
        </template>
        <!-- 修改时间 -->
        <template #updateon="{ row }">
          <div>{{row.updateon | formatDateTime}}</div>
        </template>
        <!-- 修改人 -->
        <template #updatename="{ row }">
          <div>{{row.updatename}}</div>
        </template>
        <!-- 状态 -->
        <template #status="{ row }">
          <div>{{row.status==='Y'?$t('valid'):$t('loseEfficacy')}}</div>
        </template>
        <!-- 操作 -->
        <template #id="{ row }">
          <span style="cursor: pointer;color: #2d42af;text-decoration:underline;"
              @click="viewList('查看组织授权管理',row)">{{ $t('view')}}</span>
            <span style="cursor: pointer;color: #2d42af;text-decoration:underline; margin-left: 6px;"
              :class="row.status == 'N' ? 'isHidden' : ''"
              @click="showInvalid(row)">{{$t('loseEfficacy')}}</span>
        </template>
      </bas-table>
    </div>
    <org-authorization-dialog v-model="dialogVisible" :item="editItem" :title="linkTitle" @confirm="saveSuccess" />
    <org-authorization-dialog-view v-model="dialogVisibleView" :item="editItem" :title="linkTitle" />
    <el-dialog :title="$t('FailureAuthorizationManagement')" :visible.sync="invalidForm">
      <el-form :model="editItem">
        <el-form-item :label="$t('basEmployee.remark')" required :label-width="formLabelWidth">
          <el-input type="textarea" :rows="2" v-model="editItem.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="invalidForm = false">{{$t('closes')}} </el-button>
        <el-button type="primary" @click="subInvalid()">{{$t('loseEfficacy')}}</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>

import {
  query,
  deleteauthority
} from "@/bpm/api/process/administrativeTool/orgAuthorization.js";
import axios from "axios";
//import orgAuthorizationDialog from "./orgAuthorizationDialog";
import orgAuthorizationDialogView from "./orgAuthorizationDialogView";
import orgAuthorizationDialog from "./orgAuthorizationDialog";
import { save } from "@/bpm/api/process/administrativeTool/orgAuthorization.js";
import QuickQuery from "@/bpm/components/quickquery/QuickQuery";
import SearchListMixin from "@/bpm/mixins/search_list_mixin";
import Export from '@/bpm/components/export/Export';
import { getFormateDate } from '@/bpm/utils/common';

export default {
  mixins: [SearchListMixin],
  name: "orgAuthorization",
  components: {
    orgAuthorizationDialogView,
    orgAuthorizationDialog,
    QuickQuery,
    Export
    // CommonHead
  },
  data () {
    return {
      headData: {
        token: localStorage.getItem('token')

      },
      action: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/datamanage/dataImport`,
      commonTitle: this.$t('OrganizationAuthorizationManagement'),
      formLabelWidth: '120px',
      isPowerSearch: false,
      dialogVisible: false,
      dialogVisibleView: false,
      searchForm: {},
      invalidForm: false,
      sort: {},
      formInvaid: { remarks: '' },
      loading: false,
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      content: {},
      isAllProcessList: [
        {
          value: "Y",
          label: this.$t('yes')
        },
        {
          value: "N",
          label: this.$t('no')
        }
      ],
      options: [
        {
          value: "Y",
          label: this.$t('valid')
        },
        {
          value: "N",
          label: this.$t('loseEfficacy')
        }
      ],
      editItem: {},
      linkTitle: "",
      headers: [
        {
          key: "accreditName",
          name: this.$t('authorizer'),
          span: 2
        },
        {
          key: "proxyName",
          name: this.$t('agent'),
          span: 2
        },
        {
          key: "isAllProcess",
          name: this.$t('agentAllFlow'),
          span: 2
        },
        {
          key: "processnames",
          name: this.$t('flow'),
          span: 3
        },
        {
          key: "orgnames",
          name: this.$t('TheOrganizationOfTheProcessSponsor'),
          span: 3
        },
        {
          key: "createname",
          name: this.$t('creator'),
          span: 2
        },
        {
          key: "updatename",
          name: this.$t('modifier'),
          span: 2
        },
        {
          key: "remark",
          name: this.$t('remarks'),
          span: 4
        },
        {
          key: "status",
          name: this.$t('state'),
          span: 2
        },
        {
          name: this.$t('operating'),
          span: 2
        }
      ],
      filters: [],
      selections: [],
      // 表头字段
      headerList: [
        {
          label: this.$t('authorizer'), // 授权人
          prop: 'accreditName',
          slotName: 'accreditName',
          sortable: true
        },
        {
          label: this.$t('agent'), // 代理人
          prop: 'proxyName',
          slotName: 'proxyName',
          sortable: true
        },
        {
          label: this.$t('agentStartTime'), // 代理开始时间
          prop: 'startDate',
          slotName: 'startDate',
          sortable: true
        },
        {
          label: this.$t('agentOverTime'), // 代理结束时间
          prop: 'endDate',
          slotName: 'endDate',
          sortable: true
        },
        {
          label: this.$t('agentAllFlow'), // 代理所有流程
          prop: 'isAllProcess',
          slotName: 'isAllProcess',
          sortable: true
        },
        {
          label: this.$t('NoagentAllFlow'), // 不代理的流程
          prop: 'processnames',
          slotName: 'processnames',
          sortable: true
        },
        {
          label: this.$t('SponsorOrganization'), // 发起人组织
          prop: 'orgnames',
          slotName: 'orgnames',
          sortable: true
        },
        // {
        //   label: this.$t('createTime'), // 创建时间
        //   prop: 'createon',
        //   slotName: 'createon',
        //   sortable: true
        // },
        // {
        //   label: this.$t('creator'), // 创建人
        //   prop: 'createname',
        //   slotName: 'createname',
        //   sortable: true
        // },
        {
          label: this.$t('changeTheTime'), // 修改时间
          prop: 'updateon',
          slotName: 'updateon',
          sortable: true
        },
        {
          label: this.$t('modifier'), // 修改人
          prop: 'updatename',
          slotName: 'updatename',
          sortable: true
        },
        {
          label: this.$t('state'), // 状态
          prop: 'status',
          slotName: 'status',
          sortable: true
        },
        {
          label: this.$t('operation'), // 意大利
          prop: 'id',
          slotName: 'id',
          sortable: false
        }
      ]
    };
  },
  mounted () {
    this.getData();
  },
  methods: {
    // 获取时间
    getFormateDateAction(value, type) {
      return getFormateDate(new Date(value), type)
    },
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
    beforeAvatarUpload (file) {
      console.log(file);
      const isLt2M = file.size / 1024 / 1024 < 100;
      let postfix = file.name.replace(/.+\./, "");
      const isPostfix = ['JSON'].indexOf(postfix.toUpperCase()) === -1
      if (isPostfix) {
        this.$message.error(this.$t('hintText.pleaseUploadJsonFile'))
      }
      if (!isLt2M) {
        this.$message.error(this.$t('hintText.uploadAttachmentSizeCannotExceed'))
      }
      if (!isPostfix && isLt2M) {
        this.pageLoading = true

      }
      return !isPostfix && isLt2M
    },
    //  excelFile () {
    //   this.pageLoading = true
    //   axios({
    //     method: 'post',
    //     url: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/datamanage/exportExcel`,
    //     data: {
    //       filters: [...this.filters, ...[{ 'key': 'id', 'value': (this.selections.map(x => x.id)).join(','), 'opt': 'IN' }]]
    //     },
    //     headers: {
    //       token: localStorage.getItem('token')
    //     },
    //     responseType: 'blob'
    //   }).then(res => {
    //     this.pageLoading = false
    //     let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
    //     let url = window.URL.createObjectURL(blob)
    //     let link = document.createElement('a')
    //     link.style.display = 'none'
    //     link.href = url
    //     link.setAttribute('download', '组织授权管理.json')
    //     document.body.appendChild(link)
    //     link.click()
    //   }).catch(() => {
    //     this.pageLoading = false
    //   })
    //   },
    uploadError (err) {
      console.log(err)
      console.log(err.message)
      this.pageLoading = false
      // if (err.message) {
      //   let data = JSON.parse(err.message)
      //   this.$message.error(data.message)
      // } else {
      //   this.$message.error(this.$t('hintText.importFailed'))
      // }
      this.$message.error(this.$t('hintText.importFileError'))
    },

    uploadSuccess (file) {
      this.pageLoading = false
      if (file.status === '200') {
        this.$message.success(this.$t('hintText.importedSuccessfully'))
        this.getData()
      } else {
        this.$message.error(this.$t('hintText.importFileError'))
      }
    },

    elPageChange (data) {
      console.log(data);
      console.log(this.searchType);
      this.page.pageNum = data
      this.searchType === 'power' ? this.getData() : this.quickQueryData()
    },
    // 快速获取数据
    quickQueryData () {
      let quickArr = []
      let queryFilterArr = ["accreditName", "proxyName", "processnames", 'createname']
      queryFilterArr.forEach((item) => {
        const filterObj = {
          key: item,
          opt: "LIKE",
          type: "S",
          value: this.quickData.searchData
        };
        quickArr.push(filterObj);
      })
      this.loading = true;
      query({
        logic: "or",
        filters: quickArr,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          this.content = rt.data;
          this.page.total = rt.data.total
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    showInvalid (date) {
      if (date.processids) {
        date.processList = date.processids.split(",");
      } else {
        date.processList = [];
      }
      this.editItem = Object.assign({}, date);
      this.invalidForm = true
    },
    subInvalid () {
      if (this.editItem.remark == '') {
        this.$message({
          message: this.$t('PleaseFillInTheRemarks'),
          type: "error"
        });
        return false
      }
      this.editItem.orgList = []
      this.editItem.orgids.split(";").forEach(item => {
        this.editItem.orgList.push(item.split("-")[0])
      })
      this.editItem.orgids = this.editItem.orgList.join()
      this.editItem.status = 'N'
      save({
        ...this.editItem,
        deleted: "N",
        createby: this.$store.state.app.userInfo.userid
      })
        .then(rt => {
          this.loading = false;
          if (rt.status === "200") {
            this.$message({
              message: this.$t('hintText.saveSuccessfully'),
              type: "success"
            });
            this.invalidForm = false
            this.getData();
          } else {
            this.$message({
              message: this.$t('hintText.failToSave'),
              type: "error"
            });
          }
        })
        .catch(() => {
          this.loading = false;
          this.$message({
            message: this.$t('hintText.failToSave'),
            type: "error"
          });
        });
    },

    elHandleSort (data) {
      if (data.order) {
        this.sort.orderby = data.prop;
        this.sort.sort = data.order === "descending" ? "desc" : "asc";
      } else {
        this.sort = {};
      }
      this.getData();
    },
    // excelFile() {
    //   let _this = this;
    //   axios({
    //     method: "post",
    //     url: `${process.env.HOST_URL}${process.env.BASE_URL}/org-authorize/exportExcel`,
    //     data: {
    //       logic: "and",
    //       filters: this.filters,
    //       ...this.sort,
    //       ...this.page
    //     },
    //     headers: {
    //       token: localStorage.getItem("sxToken")
    //     },
    //     responseType: "blob"
    //   })
    //     .then(res => {
    //       let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
    //       if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    //         window.navigator.msSaveOrOpenBlob(blob, `组织授权记录` + ".xls");
    //       } else {
    //         var a = document.createElement("a");
    //         document.body.appendChild(a);
    //         a.style = "display: none";
    //         var url = window.URL.createObjectURL(blob);
    //         a.download = `组织授权记录`;
    //         a.href = url;
    //         a.click();
    //         a.remove();
    //         window.URL.revokeObjectURL(url);
    //       }
    //     })
    //     .catch(() => {});
    // },
    // 获取数据
    getData () {
      this.loading = true;
      this.checkAll = false;
      query({
        logic: "and",
        filters: this.filters,
        'orderby': 'createon',
        'sort': 'desc',
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          rt.data.list.forEach(item => {
            item.checked = false;
            if (item.processList) {
              item.processName = item.processList
                .map(item => item.processName)
                .join(",");
            }
          });
          this.content = rt.data;
          this.page.total = rt.data.total
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 搜索
    search () {
      this.filters = [];
      this.page.pageNum = 1;
      Object.keys(this.searchForm).forEach(key => {
        const filter = {
          key,
          opt: "LIKE",
          type: "S",
          value: this.searchForm[key]
        };
        if (filter.key === "status") {
          filter.opt = "EQ";
        }
        if (
          key === "startDate" ||
          key === "endDate" ||
          key === "createon" ||
          key === "updateon"
        ) {
          filter.type = "D";
          filter.opt = "BETWEEN";
          filter.value = this.searchForm[key]
            ? this.searchForm[key].join("~")
            : "";
        }
        this.filters.push(filter);
      });
      this.getData();
    },
    // 重置
    rest () {
      this.searchForm = {};
      this.search();
    },
    handleSort (val) {
      this.sort = val;
      this.getData();
    },
    handleDeleteOne (item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: "warning"
      })
        .then(() => {
          deleteauthority(item.id).then(rt => {
            if (rt.status === "200") {
              this.getData();
              this.$message({
                message: this.$t('hintText.successfullyDelete'),
                type: "success"
              });
            } else {
              this.$message({
                message: this.$t('hintText.successfullyDelete'),
                type: "error"
              });
            }
          });
        })
        .catch(_ => { });
    },
    viewList (type, date) {
      if (date.processids) {
        date.processList = date.processids.split(",");
      } else {
        date.processList = [];
      }
      this.editItem = Object.assign({}, date);
      this.dialogVisibleView = true;
    },
    addList (type, date) {
      if (type === "添加组织授权管理") {
        this.editItem = {
          isAllProcess: "Y",
          status: "Y"
        };
      } else {
        if (date.processids) {
          date.processList = date.processids.split(",");
        } else {
          date.processList = [];
        }
        this.editItem = Object.assign({}, date);
      }
      this.dialogVisible = true;
    },
    handleEdit (item) {
      this.editItem = JSON.parse(JSON.stringify(item));
      this.dialogVisible = true;
    },
    handleCancel (item) {
      this.$confirm(this.$t('hintText.areYouSureCancelAuthorization'), this.$t('hintText.hint'), {
        type: "warning"
      }).then(() => {
        item.status = "RECOVERY";
        saveOutAuth(item)
          .then(rt => {
            if (rt.status === "200") {
              this.getData();
              this.$message({
                message: this.$t('hintText.successfulAuthorizationCancellation'),
                type: "success"
              });
            } else {
              this.$message({
                message: this.$t('hintText.FailedToCancelAuthorization2'),
                type: "error"
              });
            }
          })
          .catch(() => {
            this.$message({
              message: this.$t('hintText.FailedToCancelAuthorization2'),
              type: "error"
            });
          });
      });
    },
    saveSuccess (data) {
      if (data) {
        this.getData();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.isHidden {
  display: none;
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

.el-table__row .link {
  color: #2d42af;
  text-decoration: underline;
}

.el-table__row .cell div {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
