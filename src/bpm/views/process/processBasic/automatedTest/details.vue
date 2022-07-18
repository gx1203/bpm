<template>
  <el-dialog title="详情" :visible.sync="dialogVisibles" width="900px" height="50%" top="1vh" :close-on-click-modal="false" :close-on-press-escape="false" append-to-body>
    <el-row class="margin-b10">
      <el-col :span="12">
        <el-select v-model="teststatus" placeholder="请选择" @change="getData">
          <el-option label="显示全部" value=""/>
          <el-option label="异常结果" value="0"/>
        </el-select>
      </el-col>
      <el-col :span="12" class="nodestatusWrap">
        <p><i class="nodestatus0"/><span>异常点</span></p>
        <p><i class="nodestatus2 margin-l10"/><span>节点未勾选</span></p>
      </el-col>
    </el-row>
    <div class="tableWrap" v-loading="loading">
      <el-table
        :data="content.list"
        stripe
        :header-cell-style="{background: '#E1EAFD !important'}"
        highlight-current-row
        current-row-key="id">
        <el-table-column prop="org" label="组织机构" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="pos" label="岗位" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="drafter" label="申请人" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="conditiondesc" label="控制条件" show-overflow-tooltip>
        </el-table-column>
        <template v-if="content.list.length > 0 && content.list[0].recordNodeDtoList">
          <el-table-column v-for="(item, index) in content.list[0].recordNodeDtoList" :key="index" :label="item.nodename" show-overflow-tooltip>
            <template slot-scope="scope">
              <i v-if="scope.row.recordNodeDtoList[index].nodestatus === '0' || scope.row.recordNodeDtoList[index].nodestatus === '2'" :class="'nodestatus' + scope.row.recordNodeDtoList[index].nodestatus"/>
              <span v-else>{{ scope.row.recordNodeDtoList[index].approvers }}</span>
            </template>
          </el-table-column>
        </template>
        <el-table-column :label="$t('operating')" width="80">
          <template slot-scope="scope">
            <el-tooltip content="直接修改">
              <el-button type="text" icon="el-icon-edit" @click="goRule(scope.row)"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      class="margin-t15"
      :page-size="page.pageSize"
      :current-page.sync="page.pageNum"
      background
      @current-change="getData()"
      :total="content.total"
    ></el-pagination>
  </el-dialog>
</template>
<script>
import { getAutoRecord } from '@/bpm/api/process/automatedTest'
export default {
  name: 'Details',
  data() {
    return {
      dialogVisibles: false,
      loading: false,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      content: {
        list: []
      },
      teststatus: '0'
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    editItem: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    value(val) {
      this.dialogVisibles = val
      if (val) {
        this.teststatus = '0'
        this.getData()
      }
    },
    dialogVisibles(val) {
      this.$emit('input', val)
    }
  },
  mounted() {
  },
  methods: {
    getData() {
      this.loading = true
      getAutoRecord({
        logic: 'and',
        filters: [
          {
            key: 'testid',
            opt: 'EQ',
            type:'S',
            value: this.editItem.id
          },
          {
            key: 'teststatus',
            opt: 'EQ',
            type:'S',
            value: this.teststatus
          }
        ],
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize
      }).then(rt => {
        this.loading = false
        this.content = rt.data
      }).catch(() => {
        this.loading = false
      })
    },
    goRule (item) {
      let routeData = this.$router.resolve({ name: 'confinBusinessRule', query: { processId: this.editItem.testprocessid, brid: item.brid, type: 'edit', isBusinessRule: true } })
      let a = document.createElement('a')
      // 给创建好的a标签赋值
      a.setAttribute('href', routeData.href)
      // 设置css 隐藏属性
      a.setAttribute('style', 'display:none')
      // 设置 a标签为新窗口打开
      a.setAttribute('target', '_blank')
      // 将设置好的a标签，添加到 body 内
      document.body.appendChild(a)
      // 模拟点击
      a.click()
      // 移除a标签
      a.parentNode.removeChild(a)
      // window.open(routeData.href, "_blank");
    }
  }
}
</script>

<style lang="scss" scoped>
  .nodestatusWrap {
    text-align: right;
    p {
      display: inline-block;
      span {
        margin-left: 5px;
        font-size: 12px;
      }
    }
  }
  .nodestatus0 {
    display: inline-block;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 1px solid #f5f5f5;
    background-color: #ff0000;
    vertical-align: middle;
  }
  .nodestatus2 {
    display: inline-block;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 1px solid #f5f5f5;
    background-color: #ffff00;
    vertical-align: middle;
  }
</style>
