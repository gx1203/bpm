<template>
  <div id="elseProcess" class="pageWrap">
    <div class="pageContent">
      <div class="leftTree">
        <process-iframe
          @click_="handlerProcessIframeNodeClick"
        ></process-iframe>
      </div>
      <div class="listContent">
        <div class="right-content">
          <bas-table
            row-key="serial"
            :tableList="documentList"
            :headerList="headerList"
            :pages="pages"
            :isShowIndex="true"
            @currentChange="handleCurrentChange"
          >
            <!-- 搜索和功能按钮区域 -->
            <template #search>
              <div>
                <el-row class="margin-b10">
                  <el-col :span="24">
                    <bas-search
                      :placeholder="
                        $t('placeholderText.pleaseEnterProcessName')
                      "
                      v-model="keyWords"
                      @fnSearch="search('')"
                    />
                    <el-button
                      style="float: right;"
                      @click="isHighSearch = !isHighSearch"
                      type="primary"
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
                  </el-col>
                </el-row>
                <el-collapse-transition>
                  <!-- 高级搜索表格 -->
                  <el-form
                    v-show="isHighSearch"
                    class="search_options_wrap"
                    :model="searchForm"
                    label-width="100px"
                  >
                    <el-row>
                      <el-col :span="8">
                        <el-form-item label="文件类型">
                          <el-select v-model="searchForm.filename" clearable>
                            <el-option
                              v-for="item in fileTypeOptions"
                              :key="item.label"
                              :label="item.label"
                              :value="item.value"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="生效日期">
                          <el-date-picker
                            clearable
                            value-format="yyyy-MM-dd"
                            v-model="searchForm.effectivetime"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                          ></el-date-picker>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <div class="search_buttons_wrap">
                      <el-button
                        type="primary"
                        @click="
                          pages.pageNum = 1
                          search('high')
                        "
                        >{{ $t('search') }}</el-button
                      >
                      <el-button type="primary" @click="reset()">{{
                        $t('reset')
                      }}</el-button>
                    </div>
                  </el-form>
                </el-collapse-transition>
              </div>
            </template>
            <!-- 文件名 -->
            <template #docname="{ row }">
              <el-link
                type="primary"
                :underline="false"
                :href="downloadFile(row.url)"
                download
                >{{ row.docname }}</el-link
              >
            </template>

            <!-- 生效日期 -->
            <template #effectivetime="{ row }">
              {{ row.effectivetime | formatDate }}
            </template>
          </bas-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDocumentList } from '@/bpa/api/processModelCenter/document'
import paginations from '@/bpa/mixins/pagination_mixin'
import fileOperation from '@/bpa/mixins/fileDownView'
import { viewFile, downloadFile } from '@/utils/common'
export default {
  data() {
    return {
      headerList: [
        {
          label: this.$t('processNumber'), // 流程编号
          prop: 'code'
        },
        {
          label: this.$t('processName2'), // 流程名
          prop: 'name'
        },
        {
          label: this.$t('version'), // 版本
          prop: 'version',
          width: 50
        },
        {
          label: this.$t('processManager'), // 流程管理员
          prop: 'poname'
        },
        {
          label: this.$t('superiorProcessResponsibility'), // 上级流程责任人
          prop: 'superiorPerson',
          width: 120
        },
        {
          label: this.$t('fileType'), // 文件类型
          prop: 'filename'
        },
        {
          label: this.$t('fileName'), // 文件名
          slotName: 'docname',
          width: 200
        },
        {
          label: this.$t('effectiveDate'), // 生效日期
          slotName: 'effectivetime'
        }
      ],
      reloadpage: true,
      documentList: [],
      processId: '',
      isHighSearch: false,
      fileTypeOptions: [
        {
          label: '体系分类标准条款',
          value: '体系分类标准条款'
        },
        {
          label: '流程输出文件',
          value: '流程输出文件'
        },
        {
          label: '流程输入文件',
          value: '流程输入文件'
        },
        {
          label: '信息表单',
          value: '信息表单'
        },
        {
          label: '信息文档',
          value: '信息文档'
        },
        {
          label: '其他流程相关文件',
          value: '其他流程相关文件'
        }
      ],
      keyWords: '',
      searchForm: {},
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 100
      }
    }
  },
  computed: {
    host() {
      return process.env.HOST_URL + process.env.BASE_URL
    }
  },
  mixins: [paginations, fileOperation],
  mounted() {
    // this.search('')
  },
  methods: {
    getList() {
      if (!this.keyWords) {
        this.search('high')
      } else {
        this.search('')
      }
    },
    reset() {
      this.pages.pageNum = 1
      this.searchForm = {}
      this.getList()
    },
    getFileList(filters, logic) {
      let obj = {
        filters: filters,
        logic: logic,
        orderby: 'effectivetime',
        sort: 'desc',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize
      }
      getDocumentList(obj).then(res => {
        if (!res) return false
        res.list.forEach(item => {
          item.upmanagerlist.map(item2 => {
            this.$set(item, 'superiorPerson', item2.value)
          })
          // item.effectivetime = getFormateDate(
          //   new Date(item.effectivetime),
          //   'yyyy-MM-dd'
          // )
        })
        this.documentList = res.list
        this.pages.total = res.total
      })
    },
    handlerProcessIframeNodeClick: function(data) {
      this.processId = data.id
      // this.getList()
      this.search('')
      // getDocumentList({
      //   filters: [
      //     {
      //       key: "filename",
      //       opt: "LIKE",
      //       type: "S",
      //       value: "其他流程相关文件"
      //     },
      //     { key: "modelid", opt: "LIKE", type: "S", value: this.processId }
      //   ],
      //   logic: "and",
      //   orderby: "effectivetime",
      //   sort: "desc",
      //   pageNum: this.pages.pageNum,
      //   pageSize: this.pages.pageSize
      // }).then(res => {
      //   console.log(res.list);
      //   if (!res) return false;
      //   this.documentList = res.list;
      //   this.pages.total = res.total;
      //   // console.log(this.documentList)
      // });
    },
    handleCurrentChange(item) {
      console.log(item)
      this.pages.pageNum = item
      console.log(this.pages.pageNum, 'this.pages.pageNum')
      this.getList()
    },
    // 搜索的点击事件
    search(type) {
      let filters = []
      if (this.processId) {
        filters.push({
          key: 'modelid',
          opt: 'LIKE',
          type: 'S',
          value: this.processId
        })
      }
      let logic = 'or'
      if (type === 'high') {
        this.keyWords = ''
        filters = [
          {
            key: 'filename',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.filename ? this.searchForm.filename : ''
          },
          {
            key: 'effectivetime',
            opt: 'BETWEEN',
            type: 'D',
            value: this.searchForm.effectivetime
              ? this.searchForm.effectivetime[0] +
                ' 00:00:00' +
                '~' +
                this.searchForm.effectivetime[1] +
                ' 23:59:59'
              : ''
          }
        ].concat(filters)
        logic = 'and'
      } else {
        filters = [
          // { key: 'code', opt: 'LIKE', type: 'S', value: this.keyWords },
          { key: 'name', opt: 'LIKE', type: 'S', value: this.keyWords }
        ].concat(filters)
        logic = 'or'
      }
      this.getFileList(filters, logic)
    }
  }
}
</script>

<style lang="scss" scoped>
#elseProcess {
  background-color: white;
  .right-content {
    height: calc(100vh - 160px);
    .el-scrollbar__wrap {
      height: 100%;
    }
    .el-scrollbar__view {
      height: 100%;
    }
  }
}
/deep/ .el-tree-node__content {
  font-size: 13px !important;
  align-items: stretch !important;
}
</style>
