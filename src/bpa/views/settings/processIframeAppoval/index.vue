<template>
  <div id="processIframeAppoval">
    <el-row>
      <!--左侧组织树-->
      <el-col :span="6" class="padding-l10px padding-r10px">
        <el-scrollbar class="left_tree_wrappe">
          <process-iframe @click_="handlerProcessIframeNodeClick"></process-iframe>
        </el-scrollbar>
      </el-col>
      <!-- 右侧列表部分-->
      <el-col :span="18" class="padding-l10px padding-r10px pos-relative">
        <el-scrollbar class="right-content">
          <el-table :data="tableList" class="main_tab">
            <el-table-column :label="$t('number')" width="50px" type="index"></el-table-column>
            <el-table-column prop="subject" :label="$t('subject')"></el-table-column>
            <el-table-column prop="processnodename" :label="$t('approvalNodeName')"></el-table-column>
            <el-table-column prop="username" :label="$t('approver')"></el-table-column>
            <el-table-column prop="approvaltime" :label="$t('approvalTime1')"></el-table-column>
            <el-table-column prop="approvaloperation" :label="$t('approvalOperation')"></el-table-column>
            <el-table-column prop="remark" :label="$t('remarks')"></el-table-column>
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
  </div>
</template>
<script>
import { getTableList } from '@/bpa/api/settings/processIframeAppoval'
import paginations from '@/bpa/mixins/pagination_mixin'
export default {
  data() {
    return {
      tableList: [],
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      params: {
        id: ''
      }
    }
  },
  mixins: [paginations],
  methods: {
    getList(data) {
      let obj = {
        attr: {},
        orderby: 'createon',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: 'desc',
        logic: 'and',
        filters: [
          {
            key: 'baprocessid',
            opt: 'LIKE',
            type: 'S',
            value: this.params.id
          }
        ]
      }
      getTableList(obj).then(res => {
        this.tableList = res.list
        this.pages.total = res.total
      })
    },
    handlerProcessIframeNodeClick(data) {
      this.params.id = data.id
      this.getList()
    },
    // 添加菜单的确定
    confirmMenu() {},
    handleClick(tab, event) {
      console.log(tab, event)
    },
    nodeClick(node, data) {
      let self = this
      self.selectMenuName = data.label
    }
  }
}
</script>

<style scoped lang="scss">
#processIframeAppoval {
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
