<template>
  <div id="operateBook">
    <el-row>
      <el-col :span="6">
        <el-input
          :title="inputTitle"
          :placeholder="inputTitle"
          class="search_component"
          v-model="keyWords"
          clearable
          @keyup.13.native="getList"
        >
          <el-button
            type="primary"
            icon="iconfont_search icon-sousuo2"
            slot="append"
            @click="getList"
          ></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-table :data="operat" class="main_tab">
      <el-table-column :label="number" type="index"></el-table-column>
      <el-table-column prop="titlename" :label="title"></el-table-column>
      <el-table-column prop="newname" :label="fileName">
        <template slot-scope="scope">
          <a :href="downloadFile(scope.row.id)" download>{{scope.row.newname}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="createon" :label="uploadTime"></el-table-column>
      <el-table-column prop="createby" :label="heir"></el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pages.pageNum"
      background
      layout="prev, pager, next, jumper, total"
      :total="pages.total"
    ></el-pagination>
  </div>
</template>

<script>
import { getBooksList } from '@/bpa/api/settings/operatingBooksManage'
import paginations from '@/bpa/mixins/pagination_mixin'
import fileOperation from '@/bpa/mixins/fileDownView'
import sortButton from '@/bpa/components/SortButton.vue'

export default {
  components: {
    sortButton
  },
  data() {
    return {
      operat: [],
      keyWords: '',
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      inputTitle: this.$t('placeholderText.enterTitleFileNameHeir'),
      title: this.$t('title'),
      fileName: this.$t('fileName'),
      number: this.$t('number'),
      uploadTime: this.$t('uploadTime'),
      heir: this.$t('heir')
    }
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    }
  },
  mounted() {
    this.getList()
  },
  mixins: [paginations, fileOperation],
  methods: {
    getList() {
      getBooksList({
        attr: {},
        filters: [
          {
            key: 'newname',
            opt: 'LIKE',
            type: 'S',
            value: this.keyWords
          },
          {
            key: 'createby',
            opt: 'LIKE',
            type: 'S',
            value: this.keyWords
          },
          {
            key: 'titlename',
            opt: 'LIKE',
            type: 'S',
            value: this.keyWords
          }
        ],
        logic: 'or',
        orderby: 'createon',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: 'desc'
      }).then(res => {
        if (!res) return false
        this.operat = res.list
        this.pages.total = res.total
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#operateBook {
  width: 100%;
  padding: 15px;
}
</style>
