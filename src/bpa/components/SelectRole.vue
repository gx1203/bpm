<template>
  <el-dialog :title="selecRole"
    class="person_list"
    :visible.sync="dialogVisible"
    width="50%"
    :close-on-click-modal = false
      :close-on-press-escape = false>
    <el-row class="search_wrap">
      <el-col :span="8">
        <el-input clearable v-model="keyWords" class="search_component" @keyup.13.native="singleSearch">
          <el-button  slot="append" @click="singleSearch" type="success">{{$t('search')}}</el-button>
        </el-input>
      </el-col>
    </el-row>
      <el-table :data="personList"
        class="main_tab"
        @selection-change="handleSelectionChange"
        ref="personTable">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" :label="number"></el-table-column>
        <el-table-column prop="name" :label="name" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="pages.size"
        :current-page.sync="pages.page"
        background
        layout="prev, pager, next, jumper, total"
        :total="pages.total">
      </el-pagination>
<!--      <div class="selected_list">-->
<!--        <div class="selected_item" v-for="(item,index) in selectedList" :key="index">-->
<!--          <span class="name">{{item.name}}</span>-->
<!--          <i @click="deleteSelectedItem(item.id)" class="el-icon-close"></i>-->
<!--        </div>-->
<!--      </div>-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="handlerConfirmDialog">{{$t("confirm")}}</el-button>
      </span>
    </el-dialog>
</template>

<script>
import { getUserList } from '@/bpa/api/settings/userManage'
import { rolelist } from '@/bpa/api/componentsApi'
export default {
  name: 'SelectRole',
  data () {
    return {
      dialogVisible: false,
      keyWords: '',
      personList: [],
      selectedList: [],
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      selecRole:this.$t("selecRole"),
      number:this.$t("number"),
      name:this.$t("name"),
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
      this.pages.pageNum = 1
      this.getTabList()
    },
    getTabList () {
      rolelist({
        attr: {menuid: this.roleId},
        orderby: '',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: 'desc',
        logic: 'or',
        filters: [
          {'key': 'cnname', 'opt': 'LIKE', 'type': 'S', 'value': this.keyWords},
          {'key': 'id', 'opt': 'LIKE', 'type': 'S', 'value': this.keyWords}
        ]
      }).then(res => {
        this.pages.total = res.total
        this.personList = res.list
        this.autoSelected(this.personList, this.selectedList)
      })
    },
    initAjax () {
      this.pages.pageNum = 1
      rolelist({
        attr: {menuid: this.roleId},
        filters: [{key: 'name', opt: 'LIKE', type: 'S', value: null}],
        logic: 'or',
        orderby: 'name',
        pageNum: 1,
        pageSize: 10,
        sort: 'desc'
      }).then(res => {
        this.personList = res.list
        this.pages.total = res.total
        this.selectedList = this.selected
        this.autoSelected(this.personList, this.selectedList)
      })
    },
    deleteSelectedItem (id) {
      for (let i = 0; i < this.selectedList.length; i++) {
        if (this.selectedList[i].id === id) {
          this.selectedList.splice(i, 1)
          break
        }
      }
      for (let i = 0; i < this.personList.length; i++) {
        if (this.personList[i].id === id) {
          this.$refs.personTable.toggleRowSelection(this.personList[i])
          break
        }
      }
    },
    handleSizeChange (item) {
      this.pages.pageSize = item
      this.getTabList()
    },
    handleCurrentChange (item) {
      this.pages.pageNum = item
      this.getTabList()
    },
    handleSelectionChange (list) {
      // 先把this.selectedList里面属于本页的数据给删除掉  然后再把选中的column push进this.selectedList里
      for (let i = 0; i < this.personList.length; i++) {
        for (let j = 0; j < this.selectedList.length; j++) {
          if (this.personList[i].id === this.selectedList[j].id) {
            this.selectedList.splice(j, 1)
            break
          }
        }
      }
      this.selectedList.push(...list)
      this.autoSelected(this.personList, this.selectedList)
    },
    autoSelected (personList, selectedList) {
      let result = []
      for (let i = 0; i < personList.length; i++) {
        for (let j = 0; j < selectedList.length; j++) {
          if (personList[i].id === selectedList[j].id) {
            result.push(i)
          }
        }
      }
      this.$nextTick(function () {
        result.map(item => {
          this.$refs.personTable.toggleRowSelection(personList[item], true)
        })
      })
    },
    handlerConfirmDialog () {
      this.$emit('confirm', this.selectedList)
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
