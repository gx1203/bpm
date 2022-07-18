<template>
  <div id="processManagementSpecification">
    <el-row>
      <el-col :span="6">
        <el-input v-model="keyWords" :title="enterTitleFileNameHeir" :placeholder="enterTitleFileNameHeir"
          class="search_component" clearable @keyup.13.native="getList">
          <el-button slot="append" type="primary"
            @click="pages.pageNum = 1;getList()">{{$t('search')}}</el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-table :data="booksList" class="main_tab" stripe border>
      <el-table-column :label="number" type="index" />
      <el-table-column prop="titlename" :label="title" show-overflow-tooltip />
      <el-table-column :label="fileName" show-overflow-tooltip>
        <template slot-scope="scope">
          <a :href="downloadFile(scope.row.id)" download>{{scope.row.newname}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="createon" :label="uploadTime" show-overflow-tooltip />
      <el-table-column prop="createby" :label="heir" show-overflow-tooltip />
    </el-table>
    <el-pagination :current-page="pages.pageNum" :page-size="pages.pageSize" :total="pages.total" background
      layout="prev, pager, next, jumper, total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
</template>

<script>
import { queryProcessManagementCopy } from '@/bpa/api/settings/processManagementSpecification'
import paginations from '@/bpa/mixins/pagination_mixin'
import fileOperation from '@/bpa/mixins/fileDownView'
export default {
  mixins: [paginations, fileOperation],
  data () {
    return {
      booksList: [],
      keyWords: '',
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      enterTitleFileNameHeir: this.$t("placeholderText.enterTitleFileNameHeir"),
      title:this.$t("title"),
      fileName:this.$t("fileName"),
      number:this.$t("number"),
      uploadTime:this.$t("uploadTime"),
      heir:this.$t("heir")
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      queryProcessManagementCopy({
        attr: {},
        orderby: 'createon',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: 'desc',
        logic: 'or',
        filters: [
          { key: 'newname', opt: 'LIKE', type: 'S', value: this.keyWords },
          { key: 'createby', opt: 'LIKE', type: 'S', value: this.keyWords },
          { key: 'titlename', opt: 'LIKE', type: 'S', value: this.keyWords }
        ]
      }).then(res => {
        this.booksList = res.list
        this.pages.total = res.total
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  #processManagementSpecification {
    width: 100%;
    padding: 15px;
  }
</style>
