<template>
  <div class="child-org-content">
    <!--  顶部功能区  -->
    <div class="fuc-layout">
      <el-button
        type="primary"
        :disabled="!delList.length > 0"
        @click="delSelectedData"
        >{{ $t('batchDelete') }}
      </el-button>
      <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
        {{ $t('advancedQuery') }}
        <i
          :class="isPowerSearch ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
        />
      </el-button>
      <el-button type="primary" @click="singleSearch">{{
        $t('refresh')
      }}</el-button>
    </div>
    <!--  高级搜索内容区域  -->
    <div v-show="isPowerSearch" style="clear: right">
      <el-form
        ref="powerSearchForm"
        :model="powerSearchForm"
        label-width="80px"
        size="mini"
        class="power-search"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('orgCode')" prop="code">
              <el-input clearable type="text" v-model="powerSearchForm.code" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('orgName')" prop="name">
              <el-input clearable type="text" v-model="powerSearchForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('organizationType')" prop="type">
              <!--              <el-input clearable type="text" v-model="powerSearchForm.type"/>-->
              <el-select
                v-model="powerSearchForm.type"
                class="w100"
                :placeholder="$t('placeholderText.pleaseSelect')"
              >
                <el-option label="公司" value="1"></el-option>
                <el-option label="部门" value="2"></el-option>
                <el-option label="岗位" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item :label="$t('parentOrganization')" prop="pname">
              <el-input clearable type="text" v-model="powerSearchForm.pname" />
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item :label="$t('state')" prop="description">
              <el-select
                clearable
                v-model="powerSearchForm.description"
                class="w100"
                :placeholder="$t('placeholderText.pleaseSelect')"
              >
                <el-option
                  v-for="item in subtypeList"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="text-r">
            <el-button type="primary" @click="search">{{
              $t('query')
            }}</el-button>
            <el-button type="primary" @click="resetSearch">{{
              $t('reset')
            }}</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!--  主内容表格区域  -->
    <div>
      <el-table
        :data="orgList"
        class="margin-t10"
        stripe
        :header-cell-style="{ background: '#E1EAFD !important' }"
        highlight-current-row
        @selection-change="handleSelectionChange"
        style="width: 100%;margin-top: 20px"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="code" :label="$t('orgCode')"> </el-table-column>
        <el-table-column prop="name" :label="$t('orgName')"> </el-table-column>
        <el-table-column :label="$t('organizationType')">
          <template slot-scope="scope">
            {{
              scope.row.type === '3'
                ? '岗位'
                : scope.row.type === '2'
                ? '部门'
                : '公司'
            }}
          </template>
        </el-table-column>
        <el-table-column prop="pname" :label="$t('parentOrganization')">
        </el-table-column>
        <el-table-column :label="$t('state')">
          <template slot-scope="scope">
            {{ scope.row.description === 'N' ? '失效' : '生效' }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              style="padding:5px"
              @click="viewDetail(scope.row)"
              >{{ $t('view') }}
            </el-button>
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
    </div>
    <el-dialog :visible.sync="isViewDialog" :title="viewTitle">
<!--      <org-info-tab-->
<!--        v-show="detailData.type === '1'"-->
<!--        :selected-id="detailData.type === '1' ? detailData.id : ''"-->
<!--        :show-edit="false"-->
<!--      />-->
<!--      <org-dept-info-tab-->
<!--        v-show="detailData.type === '2'"-->
<!--        :selected-id="detailData.type === '2' ? detailData.id : ''"-->
<!--        :show-edit="false"-->
<!--      />-->
<!--      <org-post-info-tab-->
<!--        v-show="detailData.type === '3'"-->
<!--        :selected-id="detailData.type === '3' ? detailData.id : ''"-->
<!--        :show-edit="false"-->
<!--      />-->
      <org-one-info-tab
        style="margin-top: 10px"
        :selected-id="detailData.id"
      :show-edit="false"/>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryDescendants,
  delSingleDes
} from '@/bpm/api/configManage/institutionalFramework/organization'
import { getDictionaryOption } from '@/bpm/api/process/processModeling/classificationModel'
import paginations from '@/bpa/mixins/pagination_mixin.js'

// import OrgInfoTab from './orgCompanyInfoTab'
// import OrgDeptInfoTab from './orgDeptInfoTab'
// import OrgPostInfoTab from './orgPostInfoTab'
import OrgOneInfoTab from './orgOneInfoTab'
export default {
  name: 'childOrgInfoTab',
  components: {
    // OrgPostInfoTab,
    // OrgDeptInfoTab,
    // OrgInfoTab
    OrgOneInfoTab
  },
  mixins: [paginations],
  props: {
    selected: {
      type: Object,
      default: () => {
        return {
          id: '',
          type: ''
        }
      }
    }
  },
  watch: {
    selected: {
      handler(val) {
        this.singleSearch()
      },
      immediate: true
    }
  },
  data() {
    return {
      isPowerSearch: false,
      isViewDialog: false,
      viewTitle: '',
      detailData: {},
      powerSearchForm: {
        code: '',
        name: '',
        type: '',
        pname: '',
        subtype: '',
        description: ''
      },
      subtypeList: [],
      orgList: [],
      delList: [],
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      }
    }
  },
  mounted() {
    // this.singleSearch()
    this.getEditSelectData()
  },
  methods: {
    search() {
      this.singleSearch()
    },
    resetSearch() {
      this.$refs.powerSearchForm.resetFields()
      this.singleSearch()
    },
    /*表格选中*/
    handleSelectionChange(selected) {
      this.delList = selected
    },
    viewDetail(data) {
      this.detailData = data
      // console.log('🍊', this.detailData)
      this.isViewDialog = true
    },
    /*获取选择框情况下，下拉内容*/
    getEditSelectData() {
      let selectListReq = [
        // getDictionaryOption({dictionaryen: "组织类型"}),
        getDictionaryOption({ dictionaryen: '公司管理-状态' })
        // getDictionaryOption({dictionaryen: "公司管理-审批组织分类"}),
        // getDictionaryOption({dictionaryen: "公司管理-控股类型"}),
      ]
      Promise.all(selectListReq).then(res => {
        // this.hrtypeList = res[0].data
        this.subtypeList = res[0].data
        // this.approvalorgdescList = res[2].data
        // this.comtypeList = res[3].data
      })
    },
    /*删除数据*/
    delSelectedData() {
      let delListReq = []

      this.delList.forEach(item => {
        delListReq.push(delSingleDes(item.id))
      })

      Promise.all(delListReq)
        .then(res => {
          let resList = res.filter(ritem => {
            return ritem.status === '200'
          })
          if (resList.length === delListReq.length) {
            this.$message.success(this.$t('delSuccess'))
          } else {
            this.$message.info(`成功删除[${resList.length}]个`)
          }
        })
        .catch(err => {})
    },
    /*主数据获取*/
    getList() {
      if (!this.selected.id) return;
      let params = {
        attr: {},
        filters: [
          {
            key: 'code',
            opt: 'LIKE',
            type: 'S',
            value: this.powerSearchForm.code
          },
          {
            key: 'name',
            opt: 'LIKE',
            type: 'S',
            value: this.powerSearchForm.name
          },
          {
            key: 'type',
            opt: 'EQ',
            type: 'S',
            value: this.powerSearchForm.type
          },
          {
            key: 'pname',
            opt: 'LIKE',
            type: 'S',
            value: this.powerSearchForm.pname
          },
          {
            key: 'description',
            opt: 'EQ',
            type: 'S',
            value: this.powerSearchForm.description
          }
        ],
        fullFilters: [],
        logic: 'and',
        orderby: '',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: ''
      }
      queryDescendants(this.selected.id,params).then(rt => {
        if (rt.status === '200') {
          this.orgList = rt.data.list
          this.pages.total = rt.data.total
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.child-org-content {
  .fuc-layout {
    float: right;
    padding: 10px;
  }
}
</style>
