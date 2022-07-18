<template>
  <div id="processVisibleManage">
    <el-row :gutter="20">
      <!--左侧组织树-->
      <el-col :span="6">
        <el-scrollbar class="left_tree_wrapper">
          <process-iframe @click_="handlerProcessIframeNodeClick"></process-iframe>
        </el-scrollbar>
      </el-col>
      <!-- 右侧列表部分-->
      <el-col :span="18">
        <el-scrollbar class="right-content">
          <el-table :data="tableList" class="main_tab">
            <el-table-column :label="$t('number')" type="index"></el-table-column>
            <el-table-column prop="name" :label="$t('processName2')"></el-table-column>
            <el-table-column prop="version" :label="$t('version')"></el-table-column>
            <el-table-column prop="bponame" :label="$t('processResponsibility')"></el-table-column>
            <el-table-column prop="submitby" :label="$t('issuer')"></el-table-column>
            <el-table-column label="可见人员">
              <template slot-scope="scope">
                <span
                  class="overflow-els"
                  :title="scope.row.orgnameFormat"
                >{{scope.row.orgnameFormat}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="updateuser" label="修改人"></el-table-column>
            <el-table-column prop="createon" label="修改时间"></el-table-column>
            <el-table-column label="修改原因">
              <template slot-scope="scope">
                <p class="text_overflow_2">{{scope.row.updatereason}}</p>
              </template>
            </el-table-column>
            <el-table-column :label="$t('operation')">
              <template slot-scope="scope">
                <el-button
                  @click="showEditDialog(scope.$index)"
                  v-if="scope.$index === 0"
                  type="text"
                >修改</el-button>
                <el-button @click="showDesDialog(scope.$index)" type="text">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pages.pageNum"
            :page-size="pages.pageSize"
            background
            layout="prev, pager, next, jumper, total"
            :total="pages.total"
          ></el-pagination>
        </el-scrollbar>
      </el-col>
    </el-row>

    <!-- 查看详情对话框 -->
    <description-dialog :itemData="singleItemData" v-model="descriptionModal" />
    <!-- 编辑对话框 -->
    <edit-dialog @reInitReq="getList" :itemData="singleItemData" v-model="editModal" />
  </div>
</template>
<script>
import EditDialog from './components/editDialog.vue'
import DescriptionDialog from './components/descriptionDialog.vue'
import {
  getTableList,
  getViewableSelectList
} from '@/bpa/api/settings/processVisibleManage'
export default {
  components: {
    EditDialog,
    DescriptionDialog
  },
  data() {
    return {
      descriptionModal: false,
      editModal: false,
      tableList: [],
      selectMenuName: '',
      filterText: '',
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      params: {
        code: ''
      },
      singleItemData: {}
    }
  },
  methods: {
    showDesDialog(index) {
      this.descriptionModal = true
      this.singleItemData = this.tableList[index]
    },
    showEditDialog(index) {
      this.editModal = true
      this.singleItemData = this.tableList[index]
    },
    getList() {
      let obj = {
        attr: {},
        orderby: 'createon',
        pageNum: this.pages.pageNum,
        pageSize: 10,
        sort: 'desc',
        logic: 'and',
        filters: [
          { key: 'code', opt: 'LIKE', type: 'S', value: this.params.code }
        ]
      }
      Promise.all([
        getTableList(obj),
        getViewableSelectList({
          attr: {},
          orderby: 'createon',
          pageNum: 1,
          pageSize: 10,
          sort: 'desc'
        })
      ]).then(res => {
        res[0].list = res[0].list.map(item => {
          res[1].list.forEach(val => {
            if (val.typeid == item.typeid) {
              item.orgname = val.authorityname
              return false
            }
          })
          return item
        })
        this.tableList = res[0].list
        this.pages.total = res[0].total
        this.formatOrgname()
      })
    },
    async formatOrgname() {
      let orgnameList = this.tableList.map(item => {
        try {
          let temp = JSON.parse(item.orgname)
          if (temp instanceof Array) {
            return String(temp.map(item => item.name))
          } else if (temp instanceof Object) {
            return String(temp.orglist[0].name)
          }
        } catch (err) {
          return item.orgname
        }
      })
      this.tableList.map((item, index) => {
        item.orgnameFormat = orgnameList[index]
      })
    },
    handlerProcessIframeNodeClick(data) {
      this.params.code = data.code
      this.getList()
    },
    nodeClick(node, data) {
      let self = this
      self.selectMenuName = data.label
    },
    /*
      组织部分的分页
     */
    handleSizeChange(val) {
      this.pages.pageNum = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.pages.pageNum = val
      this.getList()
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  }
}
</script>

<style scoped lang="scss">
#processVisibleManage {
  .right-content {
    height: calc(100vh - 160px);
    .el-scrollbar__wrap {
      height: 100%;
    }
    .el-scrollbar__view {
      height: 100%;
    }
  }
  .left_tree_wrapper.el-scrollbar {
    height: calc(100vh - 180px) !important;
  }
}
</style>
