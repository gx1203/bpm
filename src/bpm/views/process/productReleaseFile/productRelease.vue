<template>
  <el-card shadow="never">
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <quick-query ref="quick" placeholder="版本号、版本概要" :is-date="false" type="inputPleseholder"
          @quickSearch="quickSearch" />
      </div>
      <div class="btn-wrap">
        <el-button type="primary" @click="addLists">
          {{ $t('add') }}
        </el-button>
        <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
          {{ $t('advancedQuery') }}
          <i :class="isPowerSearch?'el-icon-caret-top':'el-icon-caret-bottom'" />
        </el-button>
        <el-button type="primary" @click="rest">
          {{ $t('refresh') }}
        </el-button>
      </div>
    </div>
    <el-form v-if="isPowerSearch" ref="searchForm" class="power-search" :model="searchForm" label-width="120px"
      size="mini" @keyup.enter.native="powerSearch">
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('versionNumber')+'：'">
            <el-input v-model="searchForm.vnumber" clearable type="text" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('VersionSummary')+'：'">
            <el-input v-model="searchForm.vsummary" clearable type="text" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('releaseTime')+'：'">
            <!-- <el-input v-model="searchForm.rtime" clearable type="text" /> -->
            <!-- <el-date-picker
              v-model="searchForm.rtime"
              value-format="yyyy-MM-dd HH:mm:ss"
              :range-separator="$t('placeholderText.to')"
              :start-placeholder="$t('placeholderText.startDate')"
              :end-placeholder="$t('placeholderText.endDate')"
            ></el-date-picker> -->
            <el-date-picker
              v-model="searchForm.rtime"
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
        <el-col :span="8">
          <el-form-item :label="$t('issuer'+'：')">
            <el-input v-model="searchForm.cnname" clearable type="text" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('remarks')+'：'">
            <el-input v-model="searchForm.remarks" clearable type="text" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('state')+'：'">
            <el-input v-model="searchForm.status" clearable type="text" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="text-r">
          <el-button type="primary" @click="powerSearch">
            {{ $t('query') }}
          </el-button>
          <el-button type="primary" @click="rest">
            {{ $t('reset') }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <div v-if="$store.state.app.tableStyle ==='default'">
      <div class="table-header margin-t10">
        <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort" />
      </div>
      <div v-if="content.list && content.list.length!==0">
        <div v-for="(item, index) in content.list" :key="index" class="tr">
          <div class="tr-title" style="padding:5px 10px;">
          </div>
          <el-row class="tr-body" type="flex" align="middle">
            <el-col class="td" :span="headers[0].span">
              {{ item.vnumber }}
            </el-col>
            <el-col class="td" :span="headers[1].span">
              {{ item.vsummary }}
            </el-col>
            <el-col class="td" :span="headers[2].span">
              {{ getInputType(item.rtime) }}
            </el-col>
            <el-col class="td" :span="headers[3].span">
              {{ item.cnname }}
            </el-col>
            <el-col class="td" :span="headers[4].span">
              {{ item.remarks }}
            </el-col>
            <el-col class="td" :span="headers[5].span">
              {{ item.status }}
            </el-col>
            <el-col style="text-align: center" :span="headers[6].span">
              <!-- <el-button type="text" icon="el-icon-edit" @click="editList(item)" />
              <el-button type="text" icon="el-icon-delete" @click="handleDelete(item)" /> -->
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-else class="text-c pad-10px tr-empty">
        {{ $t('noData') }}
      </div>
    </div>
    <div v-else>
      <el-table :data="content.list" class="margin-t10" stripe :header-cell-style="{background: '#E1EAFD !important'}"
        highlight-current-row @sort-change="elHandleSort" current-row-key="id">
        <el-table-column width="50">
        </el-table-column>
        <el-table-column :label="$t('versionNumber')" show-overflow-tooltip prop="vnumber">
        </el-table-column>
        <el-table-column :label="$t('VersionSummary')" show-overflow-tooltip prop="vsummary">
        </el-table-column>
        <el-table-column :label="$t('releaseTime')" show-overflow-tooltip  prop="rtime">
        </el-table-column>
        <el-table-column :label="$t('issuer')" show-overflow-tooltip  prop="cnname">
        </el-table-column>
        <el-table-column :label="$t('remarks')" show-overflow-tooltip  prop="remarks">
        </el-table-column>
        <el-table-column :label="$t('state')" show-overflow-tooltip  prop="status">
        </el-table-column>
        <el-table-column :label="$t('operating')" width="120">
          <template slot-scope="scope">
            <el-tooltip class="item" content="查看" v-if="scope.row.status === '审批中'">
              <el-button type="text" @click="editList(scope.row)">查看</el-button>
            </el-tooltip>
            <el-tooltip class="item" content="编辑" v-else>
              <el-button type="text" style="padding: 0 5px 0 5px" @click="editList(scope.row)">编辑</el-button>
            </el-tooltip>
            <el-tooltip class="item" content="删除">
               <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination style="margin-top: 15px" :page-size="page.pageSize" :current-page.sync="page.pageNum" background
      :total="content.total" @current-change="searchType === 'power' ? getData() : quickQueryData()" />
     <!-- 弹出下拉选择框 -->
    <choose-jobs :item="itemData" v-model="dialogVisible" @confirm="saveSuccess"></choose-jobs>
  </el-card>
</template>

<script>
// 搜索
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import Export from '@/bpm/components/export/Export'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import { getFieldLibraryList, deleteFieldLibraryList, deleteAllFieldLibraryList, getProcessVersionList, deleteProductReleaseInfo} from '@/bpm/api/process/advancedConfig/field_maintenance.js'
import { getDictionaryOption } from '@/bpm/api/process/processModeling/classificationModel'
import { checkProcessDefaultPage } from "@/bpm/api/flow/index";
// 弹出下拉选择框
import chooseJobs from "@/bpm/views/staging/personal/applyCreate/chooseJobs";
import { getPost } from "@/bpm/api/process/administrativeTool/agents_change";
import { getApplyList, getShortCutList,
  addToShortCut,
  postionList,
  delShortCut } from "@/bpm/api/staging/personal/apply_create";
  // 状态
  import {
  activate,
  query
} from '@/bpm/api/process/administrativeTool/processActive'
import axios from 'axios'

window.addEventListener('storage', function(e) {
  if (e.key === 'isReload' && e.newValue === 'true') {
    window.getData()
  }
})
export default {
  name: 'productRelease',
  components: {
    // fieldMaintenanceDialog,
    QuickQuery,
    Export,
    chooseJobs
  },
  mixins: [SearchListMixin],
  data () {
    return {
      pathEdit: {},
      dialogVisible: false,
      itemData: [],
      paramsData: {},
      headData: {
        token: localStorage.getItem('token')
      },
      action: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/datamanage/dataImport`,
      typeList: [],
      loading: false,
      isPowerSearch: false,
      searchForm: {},
      editItem: {},
      linkTitle: '',
      headers: [
        {
          name: this.$t('vnumber'),
          span: 3
        },
        {
          name: this.$t('vsummary'),
          span: 3
        },
        {
          name: this.$t('rtime'),
          span: 3
        },
        {
          key: 'length',
          name: this.$t('cnname'),
          span: 3
        },
        {
          key: 'datasource',
          name: this.$t('remarks'),
          span: 5
        },
        {
          key: 'remark',
          name: this.$t('status'),
          span: 4
        },
        {
          name: this.$t('operation'),
          span: 3
        }
      ],
      selections: [],
      checkAll: ''
    }
  },
  watch: {
    'content.list': {
      handler (val) {
        if (this.content.list && this.content.list.length !== 0) {
          this.checkAll = true
          this.selections = []
          for (let i = 0; i < this.content.list.length; i++) {
            if (!this.content.list[i].checked) {
              this.checkAll = false
            } else {
              this.selections.push(this.content.list[i])
            }
          }
        }
      },
      deep: true
    },
    checkAll (val) {
      if (this.content.list) {
        if (val) {
          this.content.list.forEach(item => {
            item.checked = val
          })
        } else if (this.selections.length === this.content.list.length) {
          this.content.list.forEach(item => {
            item.checked = val
          })
        }
      }
    }
  },
  mounted () {
    window.getData = this.getData
    this.getData()
  },
  methods: {
    beforeAvatarUpload (file) {
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
    uploadSuccess (file) {
      this.pageLoading = false
      if (file.status === '200') {
        this.$message.success(this.$t('hintText.importedSuccessfully'))
        this.getData()
      } else {
        this.$message.error(this.$t('hintText.importFileError'))
      }
    },
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
    excelFile () {
      this.pageLoading = true
      axios({
        method: 'post',
        url: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/datamanage/fieldLibraryExport`,
        data: {
          filters: [...this.filters, ...[{ 'key': 'id', 'value': (this.selections.map(x => x.id)).join(','), 'opt': 'IN' }]]
        },
        headers: {
          token: localStorage.getItem('token')
        },
        responseType: 'blob'
      }).then(res => {
        this.pageLoading = false
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
        let url = window.URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', '字段库维护.json')
        document.body.appendChild(link)
        link.click()
      }).catch(() => {
        this.pageLoading = false
      })
    },
    // 快捷搜索
    quickQueryData () {
      this.loading = true
      this.checkAll = false
      getProcessVersionList({
        logic: 'or',
        filters: this.filters,
        queryFilter: ['vnumber', 'vsummary', 'rtime', 'cnname', 'remarks', 'status'],
        ...this.quickData,
        ...this.sort,
        ...this.page,
        orderby: 'rtime',
        'sort': 'desc',
      }).then(rt => {
        console.log(rt);
        rt.data.list.forEach(item => {
          item.checked = false
        })
        this.content = rt.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getInputType (status) {
      const result = this.typeList.find(item => item.value === status)
      return result ? result.text : '未知'
    },
    handleAllDelete () {
      this.$confirm(this.$t('hintText.areYouSureDeleteSelectedData'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          deleteAllFieldLibraryList(
            this.selections.map(item => item.id).join(',')
          ).then(rt => {
            if (rt.status === '200') {
              this.getData()
              this.$message({
                message: this.$t('hintText.successfullyDelete'),
                type: 'success'
              })
            } else {
              this.$message({
                message: this.$t('hintText.failToDelete'),
                type: 'error'
              })
            }
          })
        })
        .catch(_ => { })
    },
    handleDelete (item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      }).then(() => {
          deleteProductReleaseInfo(item.bizId).then(rt => {
            console.log(rt);
            if (rt.status === '200') {
              this.getData()
              this.$message({
                message: this.$t('hintText.successfullyDelete'),
                type: 'success'
              })
            } else {
              this.$message({
                message: this.$t('hintText.failToDelete'),
                type: 'error'
              })
            }
          })
        })
        .catch(_ => { })
    },
    saveSuccess(data) {
      this.toHref(this.paramsData, data[0].id);
    },
    // 点击添加 弹出下拉框
    addLists () {
      getPost(this.$store.state.basuser.user.id).then(rt => {
        if (rt.status === "200") {
          if (rt.data && rt.data.length > 0) {
            if (rt.data.length > 1) {
              this.itemData = rt.data;
              this.dialogVisible = true;
            } else {
              this.toHref(this.paramsData, rt.data[0].id);
            }
          } else {
            this.$message.error(this.$t('hintText.postMissingContactAdministrator'));
          }
        }
      });
    },
    editList (item) {
      let routeData = ''
      if (item.status === '审批中') {
        routeData = this.$router.resolve({
              name: "processFormView",
              query: {
                name: '产品发布流程',
                instanceId: item.instanceId,
              }
        })
        // 已完成调用流程激活
      } else {
        // activate({ instid: item.instanceId, processNodeName: 'Start' }).then(rt => {
        //   console.log(rt);
        //     if (rt.status === '200') {
        //       this.$message({
        //         message: this.$t('hintText.processActivatedSuccessfully'),
        //         type: 'success'
        //       })
        //       this.getData()
        //     } 
        // })
        // 跳转
        routeData = this.$router.resolve({
          name: "processFormView",
          query: {
             name: '产品发布流程',
            instanceId: item.instanceId,
            type: 'edit',
            productRelease: "edit"
          }
        })
      } 
      
      // window.open(routeData.href, "_blank");
      let a = document.createElement("a");
      // 给创建好的a标签赋值
      a.setAttribute("href", routeData.href);
      // 设置css 隐藏属性
      a.setAttribute("style", "display:none");
      // 设置 a标签为新窗口打开
      a.setAttribute("target", "_blank");
      // 将设置好的a标签，添加到 body 内
      document.body.appendChild(a);
      // 模拟点击
      a.click();
      // 移除a标签
      a.parentNode.removeChild(a);
    },
    
    // 点击确定跳转
    toHref(item, pid) {
      let routeData = this.$router.resolve({
          name: "processFormStart",
          query: {
            name: '产品发布流程',
            processName: 'CPFBLC',
            projectName: 'CPFBLC',
            // defOrg: item.defOrg,
            pid: pid
          }
        });
      // window.open(routeData.href, "_blank");
      let a = document.createElement("a");
      // 给创建好的a标签赋值
      a.setAttribute("href", routeData.href);
      // 设置css 隐藏属性
      a.setAttribute("style", "display:none");
      // 设置 a标签为新窗口打开
      a.setAttribute("target", "_blank");
      // 将设置好的a标签，添加到 body 内
      document.body.appendChild(a);
      // 模拟点击
      a.click();
      // 移除a标签
      a.parentNode.removeChild(a);
    },
    
    getData() {
      this.loading = true
      this.checkAll = false
      this.filters.forEach(item => {
        if (item.key === 'inputType') {
          item.opt = 'EQ'
        }
      })
      getProcessVersionList({
        logic: 'and',
        filters: this.filters,
        ...this.sort,
        ...this.page
      }).then(rt => {
          console.log(rt);
          if (rt.status === '200') {
            rt.data.list.forEach(item => {
              item.checked = false
            })
            this.content = rt.data
            getDictionaryOption({
              dictionaryen: 'subparagraphType'
            }).then((res) => {
              this.typeList = res.data
              console.log();
              this.content.list.forEach(element => {
                this.typeList.forEach(item => {
                  if (element.inputType === item.value) {
                    element.typeName = item.text
                  }
                })
              })
            })
          }
          this.loading = false
      })
        .catch(() => {
          this.loading = false
        })
    },
    // saveSuccess (param) {
    //   if (param) {
    //     if (this.searchType === 'power') {
    //       this.getData()
    //     } else if (this.searchType === 'quick') {
    //       this.quickQueryData()
    //     }
    //   }
    // }
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
