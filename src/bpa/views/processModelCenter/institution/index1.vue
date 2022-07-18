<template>
  <div id="handbookFiles" class="w100">
    <el-row :gutter="10">
      <el-col :span="4">
        <el-scrollbar class="left_tree_wrapper">
          <el-tree
            ref="tree"
            class="filter-tree elTree"
            :props="props"
            :load="loadNode"
            :default-expanded-keys="expandedList"
            node-key="id"
            lazy
            :expand-on-click-node="false"
          >
            <div slot-scope="{ node, data }" class="custom-tree-node w100">
              <p :title="node.label" @click="nodeClick(node, data)">
                {{ node.label }}
              </p>
            </div>
          </el-tree>
        </el-scrollbar>
      </el-col>
      <el-col :span="20">
        <!--<el-scrollbar class="rightPart">-->
        <el-row>
          <el-col :span="12">
            <el-input
              v-model="keyWords"
              placeholder="请输入制度名称"
              :title="pleaseEnterTitle"
              class="search_component"
              clearable
              @keyup.13.native="singleSearch('single')"
            >
              <el-button
                slot="append"
                type="primary"
                @click="singleSearch('single')"
              > {{$t('search')}}</el-button>
            </el-input>
            <!--<el-button class="high_search" @click="isHighSearch=!isHighSearch" type="primary">-->
            <!--高级-->
            <!--<i :class="isHighSearch?'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>-->
            <!--</el-button>-->
          </el-col>
          <el-col :span="12" class="search_buttons_wrap">
            <el-button type="primary" @click="isHighSearch=!isHighSearch">
              {{ $t("advancedQuery") }}
            <i :class="isHighSearch?'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>
            </el-button>
            <!-- <el-button type="primary">添加</el-button> -->
          </el-col>
        </el-row>
        <el-collapse-transition>
          <el-form v-show="isHighSearch" class="search_options_wrap" :model="searchForm" label-width="100px">
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('systemName')">
                  <el-input v-model="searchForm.title" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="artificialPerson">
                  <el-input v-model="searchForm.authorname" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="releasePeople">
                  <el-input v-model="searchForm.provideruser" clearable />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="state">
                  <el-select v-model="searchForm.status" clearable>
                    <el-option :label="newAdd" value="1" />
                    <!--                    <el-option :label="$t('beingProcessed')" value="2"></el-option>-->
                    <el-option :label="published" value="3" />
                    <el-option :label="$t('underRevision')" value="4" />
                    <!--                    <el-option :label="$t('haveBeenVoided')" value="5"></el-option>-->
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="department">
                  <el-input v-model="searchForm.deptname" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="classificationSystem">
                  <el-input v-model="searchForm.system" clearable />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="effectiveDate">
                  <el-date-picker v-model="searchForm.value1" value-format="yyyy-MM-dd" type="daterange" range-separator="-" :start-placeholder="startDate" :end-placeholder="endDate" />
                </el-form-item>
              </el-col>
            </el-row>
            <div class="search_buttons_wrap">
              <el-button type="primary" @click="singleSearch('high')">
                {{ $t("search") }}
              </el-button>
              <el-button type="primary" @click="resetSearch">
                {{ $t("reset") }}
              </el-button>
            </div>
          </el-form>
        </el-collapse-transition>
        <el-table :data="regulationList" class="main_tab" stripe border v-loading="loading" element-loading-spinner="el-icon-loading"> 
          <el-table-column :label="number" type="index" />
          <el-table-column label="制度名称" prop="title" />
          <el-table-column prop="version" :label="version" width="50" />
          <el-table-column prop="uploadon" :label="uploadTime" />
          <el-table-column :label="department">
            <template slot-scope="scope">
              <span v-for="(item, index) in scope.row.deptname" :key="index">{{ item.value }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="artificialPerson" width="60">
            <template slot-scope="scope">
              <span v-for="(item, index) in scope.row.authorname" :key="index">{{ item.cnname }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="frameName" :label="$t('NameOfTheFramework')" />
          <el-table-column prop="system" :label="classificationSystem" />
          <el-table-column prop="effectiveion" :label="effectiveDate" width="90" />
          <el-table-column prop="provideruser" :label="releasePeople" width="60" />
          <el-table-column :label="$t('TheDocumentName')">
            <template slot-scope="scope">
              <a target="_blank" :href="viewFile(scope.row.docId)">{{ scope.row.filename }}</a>
              <el-tooltip class="item margin-l5" effect="dark" :content="download2" placement="top">
                <a :href="downloadUrl(scope.row.docId)">
                  <i class="el-icon-download" />
                </a>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :label="$t('AssociatedProcess')">
            <template slot-scope="scope">
              <span>{{ scope.row.relationProcess && scope.row.relationProcess.length > 0 ? scope.row.relationProcess.map(item => item.name.indexOf(item.code) === -1 ? (item.code + item.name) : item.name).join("&") : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="state">
            <template slot-scope="scope">
              {{ scope.row.status | regState }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="pages.pageNum"
          :page-size="pages.pageSize"
          background
          layout="prev, pager, next, jumper, total"
          :total="pages.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
        <!--</el-scrollbar>-->
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getRuleIframeTree } from '@/bpa/api/rulesCenter/handbookFiles'
import { getRegulationList } from '@/bpa/api/processModelCenter/institution'
import paginations from '@/bpa/mixins/pagination_mixin'
import fileOperation from '@/bpa/mixins/fileDownView'
import { getFormateDate } from '@/bpa/utils/common'
export default {
  mixins: [paginations, fileOperation],
  data() {
    return {
      // 组织树
      expandedList: [],
      props: {
        label: function(data, node) {
          // if (data.code) {
          //   return data.code+ ' '+ data.foldername
          // } else {
          return data.foldername
          // }
        },
        isLeaf: function(data, node) {
          if (data.parent === true) {
            return false
          } else {
            return true
          }
        }
      },
      modelid: '',
      loading: false,
      regulationList: [],
      keyWords: '',
      isHighSearch: false,
      searchForm: {
        title: '',
        enname: '',
        provideruser: '',
        authorname: '',
        docAuthorDis: '',
        deptname: '',
        system: '',
        status: '',
        fordertype: '',
        effectivedate: ''
      },
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      filters: [
        { key: 'title', opt: 'LIKE', type: 'S', value: '' },
        { key: 'enname', opt: 'LIKE', type: 'S', value: '' },
        { key: 'provideruser', opt: 'LIKE', type: 'S', value: '' },
        { key: 'status', opt: 'LIKE', type: 'S', value: 5 },
        { key: 'foldertype', opt: 'LIKE', type: 'S', value: '' },
        { key: 'deptname', opt: 'LIKE', type: 'S', value: '' },
        { key: 'authorname', opt: 'LIKE', type: 'S', value: '' },
        { key: 'system', opt: 'LIKE', type: 'S', value: '' },
        { key: 'effectivedate', opt: 'LE', type: 'D', value: '' }
      ],
      pleaseEnterTitle: this.$t('placeholderText.pleaseEnterTitle'),
      chineseTitle: this.$t('chineseTitle'),
      englishTitle: this.$t('englishTitle'),
      releasePeople: this.$t('releasePeople'),
      artificialPerson: this.$t('artificialPerson'),
      department: this.$t('department'),
      classificationSystem: this.$t('classificationSystem'),
      number: this.$t('bpa_number'),
      titleChinese: this.$t('titleChinese'),
      titleEnglish: this.$t('titleEnglish'),
      version: this.$t('version'),
      uploadTime: this.$t('uploadTime'),
      classify: this.$t('classify'),
      releaseDate: this.$t('releaseDate'),
      titleOfEnglishAndChinese: this.$t('titleOfEnglishAndChinese'),
      invalidTime: this.$t('invalidTime'),
      state: this.$t('state'),
      effectiveDate: this.$t('effectiveDate'),
      startDate: this.$t('placeholderText.startDate'),
      endDate: this.$t('placeholderText.endDate'),
      fileName: this.$t('fileName'),
      fileSize: this.$t('fileSize'),
      uploadStatus: this.$t('uploadStatus'),
      operation: this.$t('operation'),
      addRulesAndRegulations: this.$t('addRulesAndRegulations'),
      editRulesAndRegulations: this.$t('editRulesAndRegulations'),
      chooseDate: this.$t('placeholderText.chooseDate'),
      mainDocument: this.$t('bpa_mainDocument'),
      download2: this.$t('download'),
      publish: this.$t('publish'),
      modify: this.$t('modify'),
      delete2: this.$t('delete'),
      invalid: this.$t('invalid'),
      dateNotSelected: this.$t('hintText.dateNotSelected'),
      pleaseUploadtheMainDocument: this.$t('hintText.pleaseUploadtheMainDocument'),
      saveSuccessfully: this.$t('hintText.saveSuccessfully'),
      fieldNameShouldNotExceedFiftyWords: this.$t('hintText.fieldNameShouldNotExceedFiftyWords'),
      releaseSuccess: this.$t('hintText.releaseSuccess'),
      areYouSureYouWantToRelease: this.$t('hintText.areYouSureYouWantToRelease'),
      hint: this.$t('hintText.hint'),
      pleaseDeleteItAndUploadItAgain: this.$t('hintText.pleaseDeleteItAndUploadItAgain'),
      requiredFieldsCannotBeEmpty: this.$t('hintText.requiredFieldsCannotBeEmpty'),
      areYouSureYouWantToInvalidateThisInformation: this.$t('hintText.areYouSureYouWantToInvalidateThisInformation'),
      areYouSureDelete: this.$t('hintText.areYouSureDelete'),
      successfullyDelete: this.$t('hintText.successfullyDelete'),
      confirm: this.$t('confirm'),
      cancel: this.$t('cancel'),
      uploaded: this.$t('uploaded'),
      newAdd: this.$t('newAdd'),
      published: this.$t('published'),
      invalidSuccess: this.$t('hintText.invalidSuccess')
    }
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    userid() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .empuid
    }
  },
  mounted() { },
  methods: {
    downloadUrl(fileid) {
      return `${this.host}/regulation/download/${fileid}?username=${this.userid}`
    },
    nodeClick(node, data) {
      const self = this
      self.modelid = data.id
      this.getList()
    },
    loadNode(node, resolve) {
      const id = node.data ? node.data.id : '0'
      getRuleIframeTree(id).then(res => {
        console.log(res)
        if (!res) return false
        console.log(id)
        if (id === '0') {
          this.expandedList = [res[0].id]
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(res[0].id)
            this.modelid = res[0].id
            this.getList()
          })
        }
        resolve(res)
      })
    },
    // 重置搜索
    resetSearch() {
      this.pages.pageNum = 1
      this.searchForm = {}
      this.filters = [
        { key: 'title', opt: 'LIKE', type: 'S', value: '' },
        { key: 'enname', opt: 'LIKE', type: 'S', value: '' },
        { key: 'provideruser', opt: 'LIKE', type: 'S', value: '' },
        { key: 'status', opt: 'LIKE', type: 'S', value: 5 },
        { key: 'foldertype', opt: 'LIKE', type: 'S', value: '' },
        { key: 'deptname', opt: 'LIKE', type: 'S', value: '' },
        { key: 'authorname', opt: 'LIKE', type: 'S', value: '' },
        { key: 'system', opt: 'LIKE', type: 'S', value: '' },
        { key: 'effectivedate', opt: 'LE', type: 'D', value: '' }
      ]
      this.getList()
    },
    // 单个搜索
    singleSearch(type) {
      this.pages.pageNum = 1
      if (type === 'single') {
        this.filters = [
          { key: 'title', opt: 'LIKE', type: 'S', value: this.keyWords },
          { key: 'enname', opt: 'LIKE', type: 'S', value: '' },
          { key: 'provideruser', opt: 'LIKE', type: 'S', value: '' },
          { key: 'status', opt: 'LIKE', type: 'S', value: 5 },
          { key: 'foldertype', opt: 'LIKE', type: 'S', value: '' },
          { key: 'deptname', opt: 'LIKE', type: 'S', value: '' },
          { key: 'authorname', opt: 'LIKE', type: 'S', value: '' },
          { key: 'system', opt: 'LIKE', type: 'S', value: '' },
          { key: 'effectivedate', opt: 'LE', type: 'D', value: '' }
        ]
      } else {
        this.filters = [
          {
            key: 'title',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.title
          },
          // {
          //   key: 'enname',
          //   opt: 'LIKE',
          //   type: 'S',
          //   value: this.searchForm.enname
          // },
          // 发布人
          {
            key: 'provideruser',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.provideruser
          },
          // 拟制人
          {
            key: 'authorname',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.authorname
          },
          // 部门
          {
            key: 'deptname',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.deptname
          },
          // 状态
          {
            key: 'status',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.status
          },
          // 体系分类
          {
            key: 'system',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.system
          },
          // 生效日期
          {
            key: 'effectivedate',
            opt: 'BETWEEN',
            type: 'D',
            value:
              this.searchForm.value1 && this.searchForm.value1.length
                ? this.searchForm.value1[0] + ' 00:00:00' + '~' + this.searchForm.value1[1] + ' 23:59:59'
                : ''
          }
        ]
      }

      this.getList()
    },
    async getList() {
      this.loading = true
      const obj = {
        orderby: 'createon',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: 'desc',
        attr: { folderid: this.modelid },
        filters: this.filters
      }
      await getRegulationList(obj).then(res => {
        if (!res) return false
        this.regulationList = res.list.map(item => {
          item.effectiveion = !item.effectiveion
            ? ''
            : getFormateDate(item.effectiveion, 'yyyy-MM-dd')
          return item
        })
        this.pages.total = res.total
      })
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.left_tree_wrapper.el-scrollbar {
  height: calc(100vh - 160px) !important;
  .custom-tree-node {
    width: calc(100% - 24px);
    display: flex;
    align-items: center;
    box-sizing: border-box;
    p {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
.rightPart {
  height: calc(100vh - 160px) !important;
}
</style>
