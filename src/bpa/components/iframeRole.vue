<template>
  <el-dialog :title="selecRole"
    class="person_list"
    :visible.sync="dialogVisible"
    width="50%"
    :close-on-click-modal = false
    :close-on-press-escape = false
    append-to-body
  >
    <el-row class="search_wrap">
      <el-col :span="8">
        <el-input clearable v-model="keyWords" class="search_component" @keyup.13.native="singleSearch">
          <el-button slot="append"  @click="singleSearch" type="success">{{$t('search')}}</el-button>
        </el-input>
      </el-col>
    </el-row>
      <el-table :data="personList"
        class="main_tab"
        @selection-change="handleSelectionChange"
        ref="personTable">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" :label="number"></el-table-column>
        <el-table-column prop="name" :label="roleName" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
<!--      <el-pagination-->
<!--        @size-change="handleSizeChange"-->
<!--        @current-change="handleCurrentChange"-->
<!--        :page-size="pages.size"-->
<!--        :current-page.sync="pages.page"-->
<!--        background-->
<!--        layout="prev, pager, next, jumper, total"-->
<!--        :total="pages.total">-->
<!--      </el-pagination>-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="handlerConfirmDialog">{{$t("confirm")}}</el-button>
      </span>
    </el-dialog>
</template>

<script>
import { addRole } from '@/bpa/api/componentsApi'
export default {
  name: 'iframeRole',
  data () {
    return {
      dialogVisible: false,
      keyWords: '',
      personList: [],
      personListAll: [],
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      roleList: [],
      selecRole:this.$t("selecRole"),
      number:this.$t("number"),
      roleName:this.$t("roleName"),
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    roleId: {
      type: String,
      default: ''
    },
    selected: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
      if (val) {
        this.initAjax()
      } else {
        this.keyWords = ''
        this.selectedList = []
        this.pages = {
          pageSize: 10,
          pageNum: 1,
          total: 0
        }
      }
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    singleSearch () {
      // this.pages.pageNum = 1
      // this.getTabList()
      this.personList = this.personListAll.filter(item => item.name.includes(this.keyWords))
    },
    getTabList () {
      // 获取接口数据
      addRole(this.roleId).then(res => {
        console.log(res)
        this.personList = res
      })
    },
    initAjax () {
      this.pages.pageNum = 1
      addRole(this.roleId).then(res => {
        console.log(res)
        this.personListAll = res
        this.personList = JSON.parse(JSON.stringify(this.personListAll))
        this.pages.total = res.length
      })
    },
    // 页码的点击事件
    handleSizeChange (item) {
      this.pages.pageSize = item
      this.getTabList()
    },
    handleCurrentChange (item) {
      this.pages.pageNum = item
      this.getTabList()
    },
    handleSelectionChange (list) {
      this.roleList = list
    },
    handlerConfirmDialog () {
      console.log(this.roleList)
      this.$emit('confirm', this.roleList)
      this.dialogVisible = false
    }
  }
}
</script>

<!--<style lang="scss" scoped>-->
<!--.selected_list {-->
<!--  margin-top: 10px;-->
<!--  &::after {-->
<!--    content: '';-->
<!--    display: block;-->
<!--    clear: both;-->
<!--  }-->
<!--  .selected_item {-->
<!--    float: left;-->
<!--    padding: 4px 6px;-->
<!--    background: #67c23a;-->
<!--    border-radius: 3px;-->
<!--    margin-right: 5px;-->
<!--    margin-bottom: 5px;-->
<!--    .name {-->
<!--    color: #fff;-->
<!--    font-size: 12px;-->
<!--    display: inline-block;-->
<!--    vertical-align: middle;-->
<!--    }-->
<!--    i {-->
<!--      font-size: 12px;-->
<!--      color: #fff;-->
<!--      cursor: pointer;-->
<!--      display: inline-block;-->
<!--      vertical-align: middle;-->
<!--    }-->
<!--    &:after {-->
<!--      content: '';-->
<!--      display: inline-block;-->
<!--      height: 100%;-->
<!--      vertical-align: middle;-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</style>-->
