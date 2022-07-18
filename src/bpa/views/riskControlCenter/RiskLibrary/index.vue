<template>
  <div id="riskLibrary" class="pageWrap w100">
    <div class="pageContent">
      <div class="leftTree">
        <div class="left_tree_wrapper">
          <enter-tree @conClick="nodeClick" />
        </div>
      </div>
      <div class="listContent">
        <!-- 表格 -->
        <bas-table
          row-key="id"
          :tableList="modelRepositoryRiskList"
          :headerList="headerList"
          :pages="pages"
          selectType="checkbox"
          @selectionChange="handleSelectionChange"
          :isShowIndex="true"
          @currentChange="handleCurrentChange"
        >
          <!-- 搜索和功能按钮区域 -->
          <template #search>
            <div>
              <el-row class="margin-b10">
                <el-col :span="10">
                  <bas-search
                    :placeholder="$t('riskName')"
                    v-model="keyWords"
                    @fnSearch="
                      pages.pageNum = 1
                      getList()"
                  />
                </el-col>
                <el-col :span="14" class="search_buttons_wrap">
                  <div style="display: flex; justify-content: flex-end;">
                    <el-button type="primary" @click="Suk_down">
                      {{ $t('downloadTemplate') }}
                    </el-button>
                    <el-upload
                      v-if="modelid !== '' && modelid != 11"
                      class="upload-demo"
                      :action="action"
                      name="file"
                      :headers="headData"
                      :show-file-list="false"
                      :before-upload="beforeAvatarUpload"
                      :on-success="uploadSuccess"
                      style="display: inline-block; margin: 0 10px"
                    >
                      <el-button type="primary">
                        {{ $t('import') }}
                        <!--<i class="el-icon-download" />-->
                      </el-button>
                    </el-upload>
                    <!-- <el-button type="primary" @click="Suk_import">
                    {{ $t("import") }}
                  </el-button> -->
                    <el-button type="primary" @click="Suk_export">
                      {{ $t('export') }}
                    </el-button>
                    <el-button
                      type="primary"
                      @click="batchDelete"
                      :disabled="!idList"
                    >
                      {{ $t('bpa_batchDelete') }}
                    </el-button>
                    <el-button
                      type="primary"
                      @click="isHighSearch = !isHighSearch"
                    >
                      {{ $t('advancedQuery') }}
                      <i
                        :class="
                          isHighSearch
                            ? 'el-icon-caret-top'
                            : 'el-icon-caret-bottom'
                        "
                      ></i>
                    </el-button>
                    <el-button
                      v-if="modelid !== '' && modelid != 11"
                      type="primary"
                      @click="addDialog"
                    >
                      {{ $t('newAdd') }}
                    </el-button>
                  </div>
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
                      <!-- <el-form-item :label="processName2">
                  <el-input v-model="searchForm.processName" clearable />
                </el-form-item> -->
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
                    <el-col :span="8">
                      <el-form-item :label="controlNumber">
                        <el-input
                          v-model="searchForm.controlNumber"
                          clearable
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
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
                    <!-- <el-col :span="8">
                      <el-form-item :label="$t(implementationBasis)">
                        <el-input v-model="searchForm.testprogram" clearable />
                      </el-form-item>
                    </el-col> -->
                  </el-row>
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

          <!-- 发布时间 -->
          <template #createonShow="{ row }">
            {{ row.createonShow | formatDateTime }}
          </template>

          <!-- 操作 -->
          <template #default="{ row }">
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('edit')"
              placement="top"
            >
              <!-- class="no-border" icon="el-icon-edit" circle  -->
              <el-button type="text" @click="getDetails(row)">{{
                $t('edit')
              }}</el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('delete')"
              placement="top"
            >
              <!-- class="no-border" icon="el-icon-delete" circle -->
              <el-button type="text" @click="deleteRow(row.id)">{{
                $t('delete')
              }}</el-button>
            </el-tooltip>
          </template>
        </bas-table>
      </div>
    </div>
    <el-dialog :title="showtitle" :visible.sync="dialogVisible" width="30%">
      <el-form
        ref="form"
        :model="editFormObj"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item :label="$t('RiskNumber')" prop="code">
          <el-input v-model="editFormObj.code" />
        </el-form-item>
        <el-form-item :label="$t('TheNameOfTheRisk')" prop="kcpname">
          <el-input v-model="editFormObj.kcpname" />
        </el-form-item>
        <el-form-item :label="$t('riskDescription')" prop="controlelement">
          <el-input
            type="textarea"
            :rows="3"
            v-model="editFormObj.controlelement"
          />
        </el-form-item>
        <el-form-item :label="$t('controlNumber')" prop="targetcomprate">
          <el-input v-model="editFormObj.targetcomprate" />
        </el-form-item>
        <el-form-item :label="$t('controlName')" prop="processtarget">
          <el-input v-model="editFormObj.processtarget" />
        </el-form-item>
        <el-form-item :label="$t('controlRequirements')" prop="risk">
          <el-input v-model="editFormObj.risk" />
        </el-form-item>
        <!-- <el-form-item :label="$t('TheImplementationBasis')" prop="testprogram">
          <el-input v-model="editFormObj.testprogram" />
        </el-form-item> -->
        <el-form-item
          :label="$t('responsibilityDepartment')"
          prop="sampleselect"
        >
          <el-input v-model="editFormObj.sampleselect" readonly>
            <el-button slot="append" @click="orgHandle('org')">{{
              $t('placeholderText.select')
            }}</el-button>
          </el-input>
          <!-- <el-input v-model="editFormObj.sampleselect" /> -->
        </el-form-item>
        <!-- <el-form-item :label="$t('compilationBasis')" prop="remark">
          <el-input v-model="editFormObj.remark" />
        </el-form-item> -->
        <el-form-item :label="$t('remarks')">
          <el-input
            type="textarea"
            :rows="3"
            v-model="editFormObj.riskcomment"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click=";(dialogVisible = false), (editFormObj = {})">{{
          $t('cancel')
        }}</el-button>
        <el-button type="primary" @click="submit()">{{
          $t('confirm')
        }}</el-button>
      </span>
      <bas-organieation
        v-model="organieationShow"
        :selectedElement="selectedElement"
        :isSpecifiedGroupBut="false"
        :isShowBustomGroupsBut="false"
        :selectElement="selectElement"
        :showElement="showElement"
        title="选择部门"
        @fnCallBack="fnBasOrganieationCallBack"
      />
    </el-dialog>
  </div>
</template>

<script>
import enterTree from './components/index.vue'
import axios from 'axios'
import { getOrgTree } from '@/bpm/api/app'
import {
  modelRepositoryRiskQuery,
  modelRepositoryRiskSave,
  modelRepositoryRiskDel,
  modelRepositoryRiskDelete
} from '@/bpa/api/riskControlCenter/index.js'

export default {
  components: {
    enterTree
  },
  data() {
    return {
      headerList: [
        {
          label: this.$t('RiskNumber'), // 风险编号
          prop: 'code'
        },
        {
          label: this.$t('TheNameOfTheRisk'), // 风险名称
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
          label: this.$t('responsibleDepartment'), // 责任部门
          prop: 'sampleselect'
        },
        {
          label: this.$t('releaseTime'), // 发布时间
          prop: 'createonShow',
          slotName: 'createonShow'
        },
        {
          label: this.$t('remarks'), // 备注
          prop: 'riskcomment'
        },
        {
          label: this.$t('operation'),
          prop: 'default',
          slotName: 'default'
        }
      ],
      organieationShow: false,
      selectedElement: {},
      selectElement: ['2'],
      showElement: [],
      headData: {
        token: localStorage.getItem('token')
      },
      isHighSearch: false,
      searchForm: {
        processName: '',
        riskNumber: '',
        riskName: '',
        controlNumber: '',
        controlName: '',
        responsibilityDepartment: '',
        testprogram: ''
      },
      controlName: this.$t('controlName'),
      number: this.$t('bpa_number'),
      processFrameNumber: this.$t('processFrameNumber'),
      processName2: this.$t('processName2'),
      riskNumber: this.$t('riskNumber'),
      riskName: this.$t('riskName'),
      riskDescription: this.$t('riskDescription'),
      controlNumber: this.$t('controlNumber'),
      responsibilityDepartment: this.$t('responsibilityDepartment'),
      compilationBasis: this.$t('compilationBasis'),
      implementationBasis: this.$t('implementationBasis'),
      showtitle: '',
      dialogVisible: false,
      modelRepositoryRiskList: [],
      keyWords: '',
      modelid: '',
      type: '',
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      idList: '',
      editFormObj: {},
      rules: {
        code: [{ required: true, message: ' ', trigger: 'blur' }],
        kcpname: [{ required: true, message: ' ', trigger: 'blur' }],
        processtarget: [{ required: true, message: ' ', trigger: 'blur' }],
        risk: [{ required: true, message: ' ', trigger: 'blur' }],
        controlelement: [{ required: true, message: ' ', trigger: 'blur' }],
        // testprogram: [{ required: true, message: " ", trigger: "blur" }],
        targetcomprate: [{ required: true, message: ' ', trigger: 'blur' }],
        sampleselect: [{ required: true, message: ' ', trigger: 'blur' }]
        // remark: [{ required: true, message: " ", trigger: "blur" }],
      }
    }
  },
  computed: {
    username() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .cnname
    },
    userid() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .empuid
    },
    modelids() {
      return this.modelid
    },
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    action() {
      return `${this.host}/modelRepositoryRisk/importExcel2RiskStorage/${this.modelids}?username=${this.userid}`
    }
  },
  mounted() {
    this.modelRepositoryRiskQuery()
    var lang = navigator.language || navigator.browserLanguage
    console.log('langlanglang', lang)
    // if(/^zh/.test(lang)) {
    //   alert('中文');
    // } else {
    //   alert('不是中文');
    // }
  },
  methods: {
    fnBasOrganieationCallBack(data) {
      // editFormObj.sampleselect
      this.$set(this.editFormObj, 'pname', data.name.split('&').join(','))
      this.$set(this.editFormObj, 'pid', data.id)
      this.$set(this.editFormObj, 'pcode', data.id)
      this.$set(
        this.editFormObj,
        'sampleselect',
        data.name.split('&').join(',')
      )
      this.organieationShow = false
    },
    getOrgTree(ids) {
      getOrgTree({
        logic: 'and',
        filters: [{ key: 'id', opt: 'IN', type: 'S', value: ids }],
        pageNum: 1,
        pageSize: 10000
      })
        .then(rt => {
          if (rt.status === '200') {
            this.selectedElement = {
              id: rt.data.list.map(item => item.id).join(','),
              name: rt.data.list.map(item => item.name).join('&'),
              idType: rt.data.list
                .map(item => {
                  return `${item.id}-${item.type}`
                })
                .join(';')
            }
            this.organieationShow = true
          }
        })
        .catch(er => {})
    },
    orgHandle(type) {
      this.selectedElement = {}
      // this.selectElement = ["0", "1", "2"];
      this.selectElement = ['2']
      this.orgtitle = '选择组织'
      if (this.editFormObj.pid) {
        this.getOrgTree(this.editFormObj.pid)
      } else {
        this.organieationShow = true
      }
    },
    beforeAvatarUpload(file) {},
    uploadSuccess(file) {
      this.pageLoading = false
      if (file.status === '200') {
        this.$message.success(this.$t('hintText.importedSuccessfully'))
        this.getList()
      } else {
        this.$message.error(file.message)
      }
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
        testprogram: ''
      }
      this.getList()
    },
    // 高级搜索
    highSearch() {
      this.pages.pageNum = 1
      const obj = {
        orderby: 'createon',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: 'desc',
        filters: [
          {
            key: 'code',
            opt: 'LIKE',
            type: 'S',
            value: this.keyWords || this.searchForm.riskNumber
          },
          { key: 'folderid', opt: 'EQ', type: 'S', value: this.modelid },
          {
            key: 'kcpname',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.riskName
          },
          {
            key: 'processtarget',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.controlName
          },
          {
            key: 'name',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.processName
          },
          {
            key: 'sampleselect',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.responsibilityDepartment
          },
          {
            key: 'targetcomprate',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.controlNumber
          },
          {
            key: 'testprogram',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.testprogram
          }
        ]
      }
      modelRepositoryRiskQuery(obj).then(res => {
        this.pages.total = res.total
        this.modelRepositoryRiskList = res.list
        console.log(
          'this.modelRepositoryRiskList',
          this.modelRepositoryRiskList
        )
      })
      // getRiskControlList(obj).then(res => {
      //   if (!res) return false
      //   console.log(res)
      //   this.booksList = res.list
      //   this.pages.total = res.total
      // })
    },
    Suk_down() {
      axios({
        method: 'get',
        url: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/modelRepositoryRisk/download`,
        data: {},
        responseType: 'blob'
      }).then(rt => {
        const blob = new Blob([rt.data], { type: 'application/vnd.ms-excel' })
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          // 兼容TMD IE
          navigator.msSaveBlob(blob, `风险库导入模板.xls`)
        } else {
          // 其他浏览器
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', `风险库导入模板.xls`)
          document.body.appendChild(link)
          link.click()
          window.URL.revokeObjectURL(link.href) // 释放掉blob对象
        }
      })
    },
    Suk_export() {
      let obj = {
        orderby: 'createon',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: 'desc',
        filters: [
          {
            key: 'kcpname',
            opt: 'LIKE',
            type: 'S',
            value: this.keyWords || this.searchForm.riskName
          },
          { key: 'folderid', opt: 'EQ', type: 'S', value: this.modelid },
          {
            key: 'code',
            opt: 'LIKE',
            type: 'S',
            value: this.keyWords || this.searchForm.riskNumber
          },
          {
            key: 'processtarget',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.controlName
          },
          {
            key: 'name',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.processName
          },
          {
            key: 'sampleselect',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.responsibilityDepartment
          },
          {
            key: 'targetcomprate',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.controlNumber
          },
          {
            key: 'testprogram',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.testprogram
          }
        ]
      }
      axios({
        method: 'post',
        url: `${this.host}/modelRepositoryRisk/exportRiskStorage`,
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
            link.setAttribute(
              'download',
              '九彩云BPM-' + this.type + '风险库.xls'
            )
            document.body.appendChild(link)
            link.click()
            window.URL.revokeObjectURL(link.href)
          }
        })
        .catch(() => {
          this.exportLoading = false
        })
    },
    batchDelete() {
      this.deleteRow(this.idList)
    },
    handleSelectionChange(val) {
      console.log(val)
      this.idList = val.map(item => item.id).join()
    },
    getList() {
      this.modelRepositoryRiskQuery()
    },

    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let obj = {
            ...this.editFormObj,
            folderid: this.editFormObj.folderid
              ? this.editFormObj.folderid
              : this.modelid
          }
          modelRepositoryRiskSave(obj).then(res => {
            console.log(res)
            if (!res) return false
            this.dialogVisible = false
            this.modelRepositoryRiskQuery()
          })
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('hintText.requiredFieldsCannotBeEmpty')
          })
        }
      })
    },
    handleSizeChange(e) {
      console.log(e)
    },
    handleCurrentChange(e) {
      console.log(e)
      this.pages.pageNum = e
      this.modelRepositoryRiskQuery()
    },
    getDetails(e) {
      console.log(e)
      this.showtitle = this.$t('edit')
      this.dialogVisible = true
      console.log(e)
      modelRepositoryRiskDel(e.id).then(res => {
        console.log(res)
        if (!res) return false
        this.editFormObj = res
      })
    },
    deleteRow(id) {
      this.$confirm(
        this.$t('hintText.areYouSureDelete'),
        this.$t('hintText.hint'),
        {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          modelRepositoryRiskDelete(id).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: this.$t('hintText.successfullyDelete')
              })
              this.modelRepositoryRiskQuery()
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    modelRepositoryRiskQuery() {
      const obj = {
        orderby: 'createon',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: 'desc',
        filters: [
          { key: 'kcpname', opt: 'LIKE', type: 'S', value: this.keyWords },
          { key: 'folderid', opt: 'EQ', type: 'S', value: this.modelid }
        ]
      }
      modelRepositoryRiskQuery(obj).then(res => {
        this.pages.total = res.total
        this.modelRepositoryRiskList = res.list
        console.log(
          'this.modelRepositoryRiskList',
          this.modelRepositoryRiskList
        )
      })
    },
    addDialog() {
      this.showtitle = this.$t('add')
      this.dialogVisible = true
      this.editFormObj = {}
    },

    nodeClick(obj) {
      const self = this
      if (obj.data) {
        self.modelid = obj.data.id
        self.type = obj.data.foldername
      }
      this.modelRepositoryRiskQuery()
    }
  }
}
</script>

<style scope lang="scss">
#riskLibrary {
  background-color: white;
}
</style>
