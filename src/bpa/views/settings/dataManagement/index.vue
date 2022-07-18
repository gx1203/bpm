<template>
  <div id="dataManagement">
    <el-row style="margin-bottom: 10px;">
      <el-col :span="12" align="left">
        <div class="globalSearch">
          <i class="el-icon-search" @click="search"></i>
          <el-input v-model="searchVal" @keyup.enter.native="search"
            :placeholder="$t('placeholderText.pleaseEnterSearchContent')"></el-input>
        </div>
      </el-col>
      <el-col :span="12" align="right">
        <el-button type="primary" @click="dialogVisible = true">{{$t('GlobalReplacement')}}</el-button>
      </el-col>
    </el-row>
    <div class="tabList" v-for="(item, index) in classList" :key="index">
      <h2>{{item.businessTypeName}}（{{item.total}}）</h2>
      <el-table :data="item.attachments" class="main_tab" stripe border>
        <el-table-column :label="$t('title')" align="left">
          <template slot-scope="scope">
            <div style="text-align:left;">
              <a :href="viewFile(scope.row.id)" target="_blank">{{scope.row.fileName}}</a>
              <!-- <a
                @click="noView({viewurl: 'http://demo.jiucaiyun.cn:8880/view/url?url=http%3A%2F%2Fjiucaiyunbpm.jiucaiyun.cn%2Fbpabpmapi%2Fbpm%2Fattachment%2FcommonDownload%2F695146548698566656%3Fusername%3D00041956'})">{{ scope.row.fileName }}</a> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('uploadTime')" width="140" prop="createDate"></el-table-column>
        <el-table-column :label="$t('heir')" width="140npm run dev" prop="userName"></el-table-column>
        <el-table-column :label="$t('operating')" width="140">
          <template slot-scope="scope">
            <!-- <el-button type="text">{{$t('preview1')}}</el-button> -->
            <el-button type="text" @click="onlineEdit(scope.row)">{{$t('onlineCompiler')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <iframe :src="wordIframe" frameborder="0" style="display: none;" />
    <el-pagination v-if="pages.total > 0" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="pages.pageNum" :page-size="pages.pageSize" background layout="prev, pager, next, jumper, total"
      :total="pages.total">
    </el-pagination>
    <div v-else style="line-height: 100px;text-align: center;">暂无数据</div>
    <replacement v-model="dialogVisible" />
  </div>
</template>

<script>
import { attachmentSearch } from '@/bpa/api/settings/dataManagement'
import paginations from '@/bpa/mixins/pagination_mixin'
import fileOperation from '@/bpa/mixins/fileDownView'
import replacement from './replacement'
export default {
  components: {
    replacement
  },
  data () {
    return {
      dialogVisible: false,
      wordIframe: '',
      classList: [],
      searchVal: '',
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  mixins: [paginations, fileOperation],
  mounted () {
    this.getList()
  },
  methods: {
    search () {
      this.pages.pageNum = 1
      this.getList()
    },
    onlineEdit (item) {
      this.wordIframe = ''
      this.$nextTick(() => {
        this.wordIframe = `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/pageOffice/index?type=esedit&ids=${item.id}&username=${this.$store.state.basuser.user.id}&serverContextPath=${process.env.VUE_APP_BASE_URL}`
      })
    },
    getList () {
      attachmentSearch({
        keyWord: this.searchVal,
        page: this.pages.pageNum,
        pageSize: this.pages.pageSize
      }).then(res => {
        res.list.forEach(element => {
          element.attachments.forEach(e => {
            if (e.createDate) {
              e.createDate = e.createDate.split('.')[0].replace(/T/, ' ')
            }
          })
        })
        this.classList = res.list
        this.pages.total = res.total
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#dataManagement {
  padding: 20px;
  h2 {
    font-size: 15px;
    line-height: 40px;
  }
  .globalSearch {
    width: 250px;
    position: relative;
    /deep/ .el-input__inner {
      border-radius: 50px;
      padding-right: 35px;
    }
    i {
      position: absolute;
      right: 10px;
      top: 0;
      z-index: 9;
      padding: 6px;
      font-size: 15px;
      color: #a1a4ad;
      cursor: pointer;
    }
  }
  .el-breadcrumb {
    padding: 10px 0;
  }
  .home {
    /deep/ .el-breadcrumb__inner {
      color: #000;
      font-size: 16px;
      font-weight: 600;
    }
  }
}
</style>
