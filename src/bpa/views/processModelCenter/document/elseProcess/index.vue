<template>
  <div id="elseProcess">
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
          <el-table-column prop="effectivetime" width="90" :label="$t('effectiveDate')">
            <template slot-scope="scope">
              <span>{{ scope.row.effectivetime.slice(0, 10) }}</span>
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
import { viewFile, downloadFile } from '@/bpa/utils/common'
import sortButton from '@/bpa/components/SortButton.vue'
export default {
  components: {
    sortButton
  },
  mixins: [paginations, fileOperation],
  data () {
    return {
      documentList: [],
      processId: '',
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      headers: [
        {
          key: 'titlename',
          name: '序号',
          span: 2
        },
        {
          key: 'code',
          name: '流程编号',
          span: 3
        },
        {
          key: 'name',
          name: '流程名称',
          span: 3
        },
        {
          key: 'version',
          name: '版本',
          span: 2
        },
        {
          key: 'poname',
          name: '流程责任人',
          span: 3
        },
        {
          key: 'superiorPerson',
          name: '上级流程责任人',
          span: 4
        },
        {
          key: 'filename',
          name: '文件类型',
          span: 2
        },
        {
          name: '文件名',
          span: 2
        },
        {
          key: 'effectivetime',
          name: '生效日期',
          span: 2
        }
      ]
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
    getList () {
      const obj = {
        filters: [
          { key: 'filename', opt: 'LIKE', type: 'S', value: '其他流程相关文件' }
        ],
        orderby: 'effectivetime',
        sort: 'desc',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize
      }
      getDocumentList(obj).then(res => {
        console.log(res)
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
      console.log(this.host)
      getDocumentList({
        filters: [
          {
            key: 'filename',
            opt: 'LIKE',
            type: 'S',
            value: '其他流程相关文件'
          },
          { key: 'modelid', opt: 'LIKE', type: 'S', value: this.processId }
        ],
        logic: 'and',
        orderby: 'effectivetime',
        sort: 'desc',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize
      }).then(res => {
        console.log(res.list)
        if (!res) return false
        this.documentList = res.list
        this.pages.total = res.total
        // console.log(this.documentList)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#elseProcess {
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
