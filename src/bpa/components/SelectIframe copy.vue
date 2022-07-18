<template>
  <el-dialog title="选择组织" class="person_list" :visible.sync="dialogVisible" width="70%" :close-on-click-modal = false :close-on-press-escape = false>
    <el-row :gutter="20" class="group_container">
      <el-col :span="9" class="tree_wrap">
        <el-scrollbar class="tree_node">
          <el-tree
            :props="props"
            :load="getFilterTreeList"
            show-checkbox
            check-strictly
            node-key="id"
            ref="groupTree"
            :expand-on-click-node="false"
            @node-click="handlerNodeClick"
            @check-change="handlerNodeChecked"
            :key="countKey"
            lazy
          ></el-tree>
        </el-scrollbar>
      </el-col>
      <el-col :span="15">
        <el-row>
          <el-col :span="24">
            <el-input clearable placeholder="请输入内容" class="search_component" v-model="keyWords" @keyup.13.native = "singleSearch">
              <el-button type="primary" slot="append" @click="singleSearch"> {{$t('search')}}</el-button>
            </el-input>
          </el-col>
        </el-row>
        <el-table :data="userList" class="main_tab">
          <el-table-column :label="$t('number')" type="index"></el-table-column>
          <el-table-column prop="cnname" label="姓名"></el-table-column>
          <el-table-column prop="empuid" label="账号"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pages.pageNum"
          :page-size="pages.pageSize"
          :pager-count="5"
          background
          layout="prev, pager, next, jumper, total"
          :total="pages.total"
        ></el-pagination>
      </el-col>
    </el-row>
    <div class="selected_list">
      <div class="selected_item" v-for="(item,index) in selectedList" :key="index">
        <span class="name">{{item.name}}</span>
        <i @click="deleteSelectedItem(item.id)" class="el-icon-close"></i>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelConfirmDialog">取消</el-button>
      <el-button type="primary" @click="handlerConfirmDialog">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getUserList, addOrganization } from '@/bpa/api/componentsApi'
import paginations from '@/bpa/mixins/pagination_mixin.js'
export default {
  name: 'SelectIframe',
  data() {
    let _this = this
    return {
      countKey: 1,
      userList: [],
      keyWords: '',
      selectedList: [],
      grandParentId: '',
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      times: 0,
      dialogVisible: false,
      orgid: '',
      props: {
        label: 'name',
        children: 'zones',
        disabled: function(data, node) {
          if (_this.selectTree.indexOf(data.type) > -1) {
            return false
          }
          return true
        },
        isLeaf: function(data, node) {
          if (data.parent === 'true') {
            return false
          } else {
            return true
          }
        }
      },

      isFirst: true,
      node: '',
      resolve: ''
    }
  },
  mixins: [paginations],
  props: {
    value: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Array,
      default: () => []
    },
    frameworkId: {
      type: String
    },
    /**
     * 需要选择什么type类型的组织树,比如选择岗位则传['3']等
     * */
    selectTree: {
      type: Array,
      default: () => []
    },
    /**
     * 请求组织树
     * 0代表组织树的根部,1代表公司, 2代表部门, 3代表岗位, 4代表科与组
     * */
    showTree: {
      type: String,
      default: '1,2,3,4'
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
      //  禁掉了，点击确认或取消后 会把选中的数组的第一位删掉了
      // this.$nextTick(() => {
      //   this.$refs.groupTree.setCheckedNodes([])
      // })
      if (val) {
        console.log(this.selected)
        this.countKey++
        this.selectedList = this.selected
        console.log(this.selectedList)
      }
    },
    dialogVisible(val) {
      this.$emit('input', val)
      // 关闭组件时，清空树内容，下次打开组件才会重新加载内容
      if (!this.isFirst) {
        this.node.childNodes = []
        this.getFilterTreeList(this.node, this.resolve)
      }
    }
  },
  mounted() {
    this.selectedList = this.selected
  },
  methods: {
    getFilterTreeList(node, resolve) {
      // isFirst 为了保证只在第一次加载的时候进行
      // if (this.isFirst) {
      //   this.node = node
      //   this.resolve = resolve
      //   this.isFirst = false
      // }
      let id = node.data ? node.data.id : '0'
      addOrganization(this.frameworkId).then(res => {
        let temp_list = []
        for (let j = 0; j < this.selected.length; j++) {
          for (let i = 0; i < res.length; i++) {
            if (this.selected[j].id === res[i].id) {
              this.$nextTick(() => {
                console.log(this.selectedList)
                if (!!this.selectedList && !!this.selectedList.length) {
                  this.$refs.groupTree.setCheckedNodes(this.selectedList)
                }
                // 如果有默认选项，默认选中岗位对应的人（企业流程框架用）
                getUserList({
                  attr: { orgid: res[i].id },
                  orderby: '',
                  pageNum: this.pages.pageNum,
                  pageSize: this.pages.pageSize,
                  sort: 'desc',
                  logic: 'or',
                  filters: [
                    {
                      key: 'cnname',
                      opt: 'LIKE',
                      type: 'S',
                      value: this.keyWords
                    },
                    {
                      key: 'empuid',
                      opt: 'LIKE',
                      type: 'S',
                      value: this.keyWords
                    }
                  ]
                }).then(res_t => {
                  console.log(res_t)
                  this.userList = res_t.list
                  this.pages.total = res_t.total
                  res[i].person = this.userList.length ? this.userList[0] : {}
                  temp_list.push(res[i])
                  console.log(temp_list)
                  this.selectedList = temp_list
                  console.log(this.selectedList)
                })
              })
              break
            }
          }
        }

        if (id === '0') {
          this.grandParentId = res[0].id
        }
        if (this.times === 0) {
          // 默认展示做高级树的第一个节点下的所有人员名单
          this.times++
          this.handlerNodeClick(res[0])
        }
        resolve(res)
      })
    },
    // 获取使用者的列表
    getList() {
      getUserList({
        attr: { orgid: this.orgid },
        orderby: '',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: 'desc',
        logic: 'or',
        filters: [
          { key: 'cnname', opt: 'LIKE', type: 'S', value: this.keyWords },
          { key: 'empuid', opt: 'LIKE', type: 'S', value: this.keyWords }
        ]
      }).then(res => {
        this.userList = res.list
        this.pages.total = res.total
      })
    },
    // 节点的点击事件
    handlerNodeClick(data, node) {
      this.orgid = data.id
      this.getList()
    },
    handlerNodeChecked(item, isChecked) {
      if (isChecked) {
        getUserList({
          attr: { orgid: item.ID },
          orderby: '',
          pageNum: this.pages.pageNum,
          pageSize: this.pages.pageSize,
          sort: 'desc',
          logic: 'or',
          filters: [
            { key: 'cnname', opt: 'LIKE', type: 'S', value: this.keyWords },
            { key: 'empuid', opt: 'LIKE', type: 'S', value: this.keyWords }
          ]
        }).then(res => {
          this.userList = res.list
          this.pages.total = res.total
          item.person = this.userList.length ? this.userList[0] : {}
          this.selectedList.push(item)
          console.log(this.selectedList)
        })
      } else {
        this.deleteSelectedItem(item.ID)
      }
    },
    // 取消选中事件
    deleteSelectedItem(id) {
      for (let i = 0; i < this.selectedList.length; i++) {
        if (this.selectedList[i].ID === id) {
          this.selectedList.splice(i, 1)
          break
        }
      }
      this.$refs.groupTree.setCheckedNodes(this.selectedList)
    },
    // 确定的点击事件
    handlerConfirmDialog() {
      console.log(this.selectedList)
      this.$emit('confirm', this.selectedList)
      this.dialogVisible = false
      this.selectedList = ''
    },
    // 取消
    cancelConfirmDialog () {
      this.dialogVisible = false
      this.selectedList = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.tree_node {
  height: 487px;
}
.selected_list {
  margin-top: 10px;
  &::after {
    content: '';
    display: block;
    clear: both;
  }
  .selected_item {
    float: left;
    padding: 4px 6px;
    background: #67c23a;
    border-radius: 3px;
    margin-right: 5px;
    margin-bottom: 5px;
    .name {
      color: #fff;
      font-size: 12px;
      display: inline-block;
      vertical-align: middle;
    }
    i {
      font-size: 12px;
      color: #fff;
      cursor: pointer;
      display: inline-block;
      vertical-align: middle;
    }
    &:after {
      content: '';
      display: inline-block;
      height: 100%;
      vertical-align: middle;
    }
  }
}
</style>
