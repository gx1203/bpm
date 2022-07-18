<template>
  <el-card shadow="never">
    <div class="item-left">
      <el-tree
        class="elTree"
        style="height:calc(100% - 28px);overflow: auto;"
        :data="nodeList"
        :props="defaultProps"
        @node-click="handleNodeClick"
      />
    </div>
    <div class="item-right">
      <div class="tool-common-wrap">
        <div class="search-wrap">
          <el-select v-model="dateRange" clearable>
            <el-option
              v-for="item in dateRangeList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
          <el-input v-model="searchKey" clearable>
            <span slot="append"><i class="iconfont icon-sousuo2" /></span>
          </el-input>
        </div>
        <div class="btn-wrap">
          <el-button type="primary" @click="addList('添加节点类型配置')">
            添加
            <!--<i class="el-icon-circle-plus-outline"/>-->
          </el-button>
          <el-button type="primary">
            {{ $t('batchDelete') }}
            <!--<i class="el-icon-circle-close"/>-->
          </el-button>
          <el-button type="primary" @click="refreshData">
             {{ $t('refresh') }}
            <!--<i class="el-icon-refresh"/>-->
          </el-button>
        </div>
      </div>
      <div class="table-header margin-t10">
        <el-checkbox v-model="checkAll" class="all-check" />
        <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort" />
      </div>
      <div v-if="content.list && content.list.length!==0">
        <div v-for="(item, index) in content.list" :key="index" class="tr">
          <div class="tr-title">
            <el-checkbox v-model="item.checked" style="margin-right: 10px" />
            <span>{{ $t('applicationDate') }}：{{ item.createDate | formatDateTime }}</span>
            <span style="margin-left: 60px">{{ $t('applicationNumber') }}：{{ item.reqNo }}</span>
          </div>
          <el-row class="tr-body" type="flex" align="middle">
            <el-col class="td" :span="headers[0].span">
              {{ item.drafter }}
            </el-col>
            <el-col class="td" :span="headers[1].span">
              {{ item.passReaderUserName }}
            </el-col>
            <el-col class="td" :span="headers[2].span">
              {{ item.passReadTime }}
            </el-col>
            <el-col style="text-align: center" :span="headers[3].span">
              <el-button type="text" icon="el-icon-edit" @click="addList('编辑节点类型配置',item)" />
              <el-button type="text" icon="el-icon-delete" />
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-else class="text-c pad-10px tr-empty">
         {{ $t('noData') }}
      </div>

      <el-pagination
        style="margin-top: 15px"

        :page-size="page.pageSize"
        :current-page.sync="page.pageNum"
        background
        :total="content.total"
        @current-change="getData"
      />
    </div>
    <add-node-dialog v-model="dialogVisible" :item="editItem" :title="linkTitle" @confirm="saveSuccess" />
  </el-card>
</template>

<script>
import AddNodeDialog from './AddNodeDialog'
export default {
  components: {
    AddNodeDialog
  },
  data() {
    return {
      dateRange: '',
      dateRangeList: [
        {
          name: '近一个月',
          value: '1'
        },
        {
          name: '近二个月',
          value: '2'
        },
        {
          name: '近三个月',
          value: '3'
        }
      ],
      searchKey: '',
      loading: false,
      dialogVisible: false,
      editItem: {},
      linkTitle: '',
      reportList: [],
      num: '',
      value: '',
      checked: '',
      nodeList: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      headers: [
        {
          key: 'drafter',
          name: '中文名称',
          span: 9
        },
        {
          key: 'passReaderUserName',
          name: '英文名',
          span: 7
        },
        {
          key: 'passReadTime',
          name: this.$t('sort'),
          span: 5
        },
        {
          name: this.$t('operation'),
          span: 3
        }
      ],
      content: {
        list: [{

        }]
      },
      page: {
        pageNum: 1,
        pageSize: 10
      },
      checkAll: ''
    }
  },
  methods: {
    refreshData() {

    },
    saveSuccess(data) {
      if (data) {
        // this.getData()
      }
    },
    addList(item, data) {
      if (item === '添加节点类型配置') {
        this.dialogVisible = true
        this.linkTitle = item
        this.editItem = {}
      } else if (item === '编辑节点类型配置') {
        this.dialogVisible = true
        this.linkTitle = item
        this.editItem = data
      }
    },
    handleNodeClick(data) {
    },
    getData() {},
    handleSort(val) {
      this.sort = val
      // this.getData()
    }
  }
}
</script>

<style lang="scss" scoped>
  .item-left {
    float: left;
    width: 20%;
  }
  .item-right {
    float: right;
    width: 78%;
    .table-header {
      position: relative;
      background: $bc2;
      display: flex;
      align-items: center;
      .all-check {
        position: absolute;
        left: 10px;
      }
    }
  }
</style>
