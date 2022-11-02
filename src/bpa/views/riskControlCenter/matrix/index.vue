<template>
  <div id="riskControlMatrix" class="pageWrap">
    <div class="listContent w100">
      <!-- 表格 -->
      <bas-table
        row-key="id"
        :tableList="booksList"
        :headerList="headerList"
        :pages="pages"
        :isShowIndex="true"
        @currentChange="handleCurrentChange"
      >
        <!-- 搜索和功能按钮区 -->
        <template #search>
          <div>
            <el-row class="margin-b10">
              <el-col :span="12">
                <bas-search
                  :placeholder="pleaseEnterRiskName"
                  v-model="keyWords"
                  @fnSearch="
                    pages.pageNum = 1
                    getList()
                  "
                />
                <!--<el-button class="high_search" @click="isHighSearch=!isHighSearch" type="primary">-->
                <!--高级-->
                <!--<i :class="isHighSearch?'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>-->
                <!--</el-button>-->
              </el-col>
              <el-col :span="12" class="search_buttons_wrap">
                <el-button type="primary" @click="Suk_export">
                  {{ $t('export') }}
                </el-button>
                <el-button
                  type="primary"
                  @click="isHighSearch = !isHighSearch"
                  style="margin-right:10px"
                >
                  {{ $t('advancedQuery') }}
                  <i
                    :class="
                      isHighSearch ? 'el-icon-caret-top' : 'el-icon-caret-bottom'
                    "
                  ></i>
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
                    <!-- <el-form-item :label="processFrameworkName">
                <el-input v-model="searchForm.processName" clearable />
              </el-form-item> -->
                    <el-form-item :label="processName2">
                      <el-input v-model="searchForm.processName" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="riskNumber">
                      <el-input v-model="searchForm.riskNumber" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="riskName">
                      <el-input v-model="searchForm.riskName" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="controlNumber">
                      <el-input v-model="searchForm.controlNumber" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="controlName">
                      <el-input v-model="searchForm.controlName" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="responsibilityDepartment">
                      <el-input
                        v-model="searchForm.responsibilityDepartment"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <!--        <el-row>-->
                <!--          <el-col :span="8">-->
                <!--            <el-form-item :label="$t(compilationBasis)">-->
                <!--              <el-input v-model="searchForm.remark" clearable />-->
                <!--            </el-form-item>-->
                <!--          </el-col>-->
                <!--          <el-col :span="8">-->
                <!--            <el-form-item :label="$t(implementationBasis)">-->
                <!--              <el-input v-model="searchForm.testprogram" clearable />-->
                <!--            </el-form-item>-->
                <!--          </el-col>-->
                <!--        </el-row>-->
                <div class="search_buttons_wrap">
                  <el-button type="primary" @click="highSearch">
                    {{ $t('search') }}
                  </el-button>
                  <el-button type="primary" @click="reset">
                    {{ $t('reset') }}
                  </el-button>
                </div>
              </el-form>
            </el-collapse-transition>
          </div>
        </template>
      </bas-table>
    </div>
  </div>
</template>

<script>
import { getRiskControlList } from '@/bpa/api/riskControlCenter/index.js'
import paginations from '@/bpa/mixins/pagination_mixin'
import { createNamespacedHelpers } from 'vuex'
import axios from 'axios'
const { mapMutations, mapActions } = createNamespacedHelpers('app')

const userInfo = createNamespacedHelpers('userInfo')
export default {
  mixins: [paginations],
  data() {
    return {
      headerList: [
        {
          label: this.$t('processFrameNumber'), // 流程框架编号
          prop: 'list_code'
        },
        {
          label: this.$t('processName2'), // 流程名称
          prop: 'name'
        },
        {
          label: this.$t('processNode'), // 流程节点
          prop: 'nodeName'
        },
        {
          label: this.$t('riskNumber'), // 风险编号
          prop: 'code'
        },
        {
          label: this.$t('riskName'), // 风险名称
          prop: 'kcpname'
        },
        {
          label: this.$t('riskDescription'), // 风险描述
          prop: 'controlelement'
        },
        {
          label: this.$t('controlNumber'), // 控制编号
          prop: 'targetcomprate'
        },
        {
          label: this.$t('controlName'), // 控制名称
          prop: 'processtarget'
        },
        {
          label: this.$t('controlRequirements'), // 控制要求
          prop: 'risk'
        },
        {
          label: this.$t('responsibilityDepartment'), // 责任部门
          prop: 'sampleselect'
        }
      ],
      booksList: [],
      keyWords: '',
      isHighSearch: false,
      searchForm: {
        processName: '',
        riskNumber: '',
        riskName: '',
        controlNumber: '',
        controlName: '',
        responsibilityDepartment: '',
        remark: '',
        testprogram: ''
      },
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      pleaseEnterRiskName: this.$t('placeholderText.pleaseEnterRiskName'),
      processName2: this.$t('processName2'),
      processNode: this.$t('processNode'),
      riskNumber: this.$t('riskNumber'),
      riskName: this.$t('riskName'),
      controlNumber: this.$t('controlNumber'),
      controlName: this.$t('controlName'),
      number: this.$t('bpa_number'),
      processFrameNumber: this.$t('processFrameNumber'),
      processName2: this.$t('processName2'),
      riskNumber: this.$t('riskNumber'),
      riskName: this.$t('riskName'),
      riskDescription: this.$t('riskDescription'),
      controlNumber: this.$t('controlNumber'),
      controlName: this.$t('controlName'),
      controlRequirements: this.$t('controlRequirements'),
      responsibilityDepartment: this.$t('responsibilityDepartment'),
      compilationBasis: this.$t('compilationBasis'),
      implementationBasis: this.$t('implementationBasis')
    }
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    username() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .cnname
    },
    userid() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .empuid
    },
    action() {
      return `${this.host}/mangercenterdoc/uploadCopy?username=${this.userid}`
    },
    ...userInfo.mapGetters(['getUserAuthor']),
    download() {
      return this.host + '/attach/download/'
    }
  },
  mounted() {
    this.getList()
    // 获取当前登录人权限
    this.requireAuthoriy()
  },
  methods: {
    Suk_export() {
      let obj = {
        code: this.searchForm.riskNumber,
        controlelement: '',
        kcpname: this.searchForm.riskName || this.keyWords,
        list_code: '',
        name: this.searchForm.processName, // 流程名称
        pagenum: this.pages.pageNum,
        pagesize: this.pages.pageSize,
        processtarget: this.searchForm.controlName,
        remark: '',
        risk: '',
        sampleselect: this.searchForm.responsibilityDepartment,
        targetcomprate: this.searchForm.controlNumber,
        testprogram: this.searchForm.testprogram,
        remark: this.searchForm.remark
      }
      axios({
        method: 'post',
        url: `${this.host}/modellist/exportRiskControl`,
        data: obj,
        responseType: 'blob',
        timeout: 60000000
      })
        .then(res => {
          const blob = new Blob([res.data], {
            type: 'application/vnd.ms-excel'
          })
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // 兼容TMD IE
            navigator.msSaveBlob(blob, this.downloadName)
          } else {
            // 其他浏览器
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', '北汽重卡BPM-风险矩阵.xls')
            document.body.appendChild(link)
            link.click()
            window.URL.revokeObjectURL(link.href)
          }
        })
        .catch(() => {
          this.exportLoading = false
        })
    },
    ...mapActions(['requireAuthoriy']),
    // ...userInfo.mapActions(['requireAuthoriy']),
    // 高级搜索
    highSearch() {
      this.pages.pageNum = 1
      const obj = {
        code: this.searchForm.riskNumber,
        controlelement: '',
        kcpname: this.keyWords || this.searchForm.riskName,
        list_code: '',
        name: this.searchForm.processName, // 流程名称
        pagenum: this.pages.pageNum,
        pagesize: this.pages.pageSize,
        processtarget: this.searchForm.controlName,
        remark: '',
        risk: '',
        sampleselect: this.searchForm.responsibilityDepartment,
        targetcomprate: this.searchForm.controlNumber,
        testprogram: this.searchForm.testprogram,
        remark: this.searchForm.remark
      }
      if (this.keyWords) {
        obj.kcpname = this.keyWords
      }
      getRiskControlList(obj).then(res => {
        if (!res) return false
        console.log(res)
        this.booksList = res.list
        this.pages.total = res.total
      })
    },
    reset() {
      this.pages.pageNum = 1
      this.searchForm = {
        processName: '',
        riskNumber: '',
        riskName: '',
        controlNumber: '',
        controlName: '',
        responsibilityDepartment: '',
        testprogram: '',
        remark: ''
      }
      this.getList()
    },
    getList() {
      const obj = {
        code: this.searchForm.riskNumber,
        controlelement: '',
        kcpname: this.keyWords,
        list_code: '',
        name: this.searchForm.processName, // 流程名称
        pagenum: this.pages.pageNum,
        pagesize: this.pages.pageSize,
        processtarget: this.searchForm.controlName,
        remark: '',
        risk: '',
        sampleselect: this.searchForm.responsibilityDepartment,
        targetcomprate: this.searchForm.controlNumber,
        testprogram: this.searchForm.testprogram,
        remark: this.searchForm.remark
      }
      getRiskControlList(obj).then(res => {
        if (!res) return false
        console.log(res)
        this.booksList = res.list
        this.booksList.forEach(item => {
          item.controlelement = item.controlelement + item.controlelement
        })
        this.pages.total = res.total
        console.log(this.booksList)
      })
    }
  }
}
</script>
<style scope lang="scss">
#riskControlMatrix {
  background-color: white;
}
.el-tooltip__popper {
  max-width: 70%;
}
</style>
