<template>
  <div id="processOutput">
    <el-row :gutter="20">
      <el-col :span="5">
        <process-iframe @click_="handlerProcessIframeNodeClick" />
      </el-col>
      <el-col :span="19">
        <!-- <el-scrollbar class="right-content"> -->
        <el-table :data="documentList" class="main_tab" stripe border>
          <el-table-column :label="$t('number')" type="index" />
          <el-table-column prop="code" :label="$t('processNumber')" />
          <el-table-column prop="name" :label="$t('processName2')" />
          <el-table-column prop="version" :label="$t('version')" />
          <el-table-column prop="poname" width="100" :label="$t('processResponsibility')" />
          <el-table-column prop="superiorPerson" width="120" :label="$t('superiorProcessResponsibility')">
            <template slot-scope="scope">
              <span v-for="(v, index) in scope.row.upmanagerlist" :key="index">{{ v.value }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="filename" :label="$t('fileType')" />
          <el-table-column :label="$t('fileName')">
            <template slot-scope="scope">
              <a target="_blank" :href="viewFile(scope.row.url)">{{ scope.row.docname }}</a>
              <el-tooltip class="item margin-l5" effect="dark" :content="$t('download')" placement="top">
                <a :href="downloadFile(scope.row.url)" download>
                  <i class="el-icon-download" />
                </a>
              </el-tooltip>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="effectivetime" width="90" :label="$t('effectiveDate')" /> -->
          <el-table-column :label="$t('effectiveDate')" width="90">
            <template slot-scope="scope">
              <span>{{scope.row.effectivetime.slice(0,10)}}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :current-page="pages.pageNum" :page-size="pages.pageSize" background
          layout="prev, pager, next, jumper, total" :total="pages.total" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
        <!-- </el-scrollbar> -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getDocumentList } from '@/bpa/api/processModelCenter/document'
import paginations from '@/bpa/mixins/pagination_mixin'
import fileOperation from '@/bpa/mixins/fileDownView'
export default {
  mixins: [paginations, fileOperation],
  data () {
    return {
      documentList: [],
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 100
      }
    }
  },
  computed: {
    host () {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList (id) {
      const obj = {
        filters: [
          { key: 'filename', opt: 'LIKE', type: 'S', value: '流程输出文件' }
        ],
        orderby: 'effectivetime',
        sort: 'desc',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize
      }
      getDocumentList(obj).then(res => {
        if (!res) return false
        this.documentList = res.list
        this.pages.total = res.total
        res.list.forEach(item => {
          console.log(item.upmanagerlist)
          item.upmanagerlist.map(item2 => {
            console.log(item2.value)
            this.$set(item, 'superiorPerson', item2.value)
            console.log(item)
          })
        })
      })
    },
    handlerProcessIframeNodeClick (data) {
      this.processId = data.id
      // this.getList()
      getDocumentList({
        filters: [
          { key: 'filename', opt: 'LIKE', type: 'S', value: '流程输出文件' },
          { key: 'modelid', opt: 'LIKE', type: 'S', value: this.processId }
        ],
        logic: 'and',
        orderby: 'effectivetime',
        sort: 'desc',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize
      }).then(res => {
        if (!res) return false
        this.documentList = res.list
        this.pages.total = res.total
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#processOutput {
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
    align-items:stretch !important;
   }
</style>
