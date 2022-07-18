<template>
  <el-dialog :title="processFrameworkAuthorityManagement" class="tree_list" :visible.sync="dialogVisible" width="70%" :close-on-click-modal = false :close-on-press-escape = false>
    <el-row :gutter="20" class="group_container">
      <el-col :span="9" class="tree_wrap">
        <el-scrollbar class="tree_node">
          <el-tree
            :highlight-current="true"
            :data="menusTree"
            node-key="id"
            :props="defaultProps"
            show-checkbox
            :default-checked-keys="grandParentId"
            :default-expanded-keys="[menusTree[0].id]"
            :expand-on-click-node= "false"
            @node-click="nodeClick"
            @check="handleNodeCheck"
            ref="menuTree"
          ></el-tree>
        </el-scrollbar>
      </el-col>
      <el-col :span="15">
        <el-row>
          <el-button size="mini" v-for="(list, index) in orgMenuList.button" :key="list.id" @click.native="btnClick(list, index)">
            <el-checkbox v-model="list.add === 'Y'">{{list.name}}</el-checkbox>
          </el-button>
        </el-row>
        <!--<el-table :data="orgMenuList"-->
                  <!--border-->
                  <!--class="main_tab"-->
                  <!--ref="multipleTable"-->
                  <!--@selection-change="handleSelectionChange">-->
          <!--<el-table-column-->
            <!--type="selection"-->
            <!--width="55">-->
          <!--</el-table-column>-->
          <!--<el-table-column :label="$t('number')" type="index"></el-table-column>-->
          <!--<el-table-column prop="name" label="按钮名称"></el-table-column>-->
        <!--</el-table>-->
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelConfirmDialog">{{$t("cancel")}}</el-button>
      <el-button type="primary" @click="handlerConfirmDialog">{{$t("confirm")}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getMenuList, addAuthorityToOrg, addAuthorityToRole, addButtonAuthorityToOrg,
  deleteButtonAuthorityFromOrg, addButtonAuthorityToRole, deleteButtonAuthorityFromRole } from '@/bpa/api/settings/menusManage'
// import { getButtonList } from '@/bpa/api/componentsApi'
import paginations from '@/bpa/mixins/pagination_mixin.js'
export default {
  name: 'authorityRole',
  data() {
    return {
      titleName: '流程框架权限管理',
      orgMenuList: {
        id: '',
        button: []
      },
      grandParentId: [],
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      dialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      menusTree: [
        {id: ''}
      ],
      menuTreeParams: {
        attr: {relatedid: ''},
        orderby: '',
        pageNum: 1,
        pageSize: 100000,
        sort: 'desc',
        logic: 'or',
        filters: []
      },
      btnSelection: [],
      processFrameworkAuthorityManagement:this.$t("processFrameworkAuthorityManagement"),
      saveSuccessfully:this.$t("hintText.saveSuccessfully"),
      addedSuccess:this.$t("hintText.addedSuccess"),
      successfullyDelete:this.$t("hintText.successfullyDelete"),
    }
  },
  mixins: [paginations],
  props: {
    value: {
      type: Boolean,
      default: false
    },
    selectInfo: {
      type: Object,
      default: () => {
        return {
          name: ''
        }
      }
    },
    type: {
      type: String,
      default: ''
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
      if (val) {
        this.orgMenuList = {
          id: '',
          button: []
        }
        this.btnSelection = []
        this.getMenuList()
        console.log(this.type)
      }
    },
    dialogVisible(val) {
      this.$emit('input', val)
    }
  },
  mounted() {
    console.log(this.selectId)
  },
  methods: {
    // 获取组织树的数据
    getMenuList () {
      console.log(this.selectInfo)
      this.menuTreeParams.attr.relatedid = this.selectInfo.id
      getMenuList(this.menuTreeParams).then(res => {
        this.menusTree = res
        this.grandParentId = []
        this.selectId(res)
      })
    },
    // 选中的菜单ID
    selectId (data) {
      data.forEach(item => {
        if (item.add === 'Y' && (!item.children || item.children.length === 0)) {
          this.grandParentId.push(item.id)
        }
        if (item.children) {
          this.selectId(item.children)
        }
      })
    },
    handlerConfirmDialog () {
      this.type === 'org' ? this.orgConfirm() : this.type === 'role' ? this.menuConfirm() : ''
      this.dialogVisible = false
    },
    // 组织按钮保存
    orgConfirm () {
      console.log(this.grandParentId)
      let grandParentId = ''
      this.grandParentId.forEach(item => {
        grandParentId += (item + ',')
      })
      grandParentId = grandParentId.slice(0, -1)
      console.log(grandParentId)
      addAuthorityToOrg({
        relatedid: this.selectInfo.id,
        relatedtype: 8,
        resourceid: grandParentId
      }).then(res => {
        this.$message({
          type: 'success',
          message: this.saveSuccessfully
        })
      })
    },
    // 菜单按钮保存
    menuConfirm () {
      console.log(this.grandParentId)
      // let grandParentId = ''
      // this.grandParentId.forEach(item => {
      //   grandParentId += (item + ',')
      // })
      // grandParentId = grandParentId.slice(0, -1)
      let grandParentId = []
      this.grandParentId.forEach(item => {
        grandParentId.push({
          resourceid: item
        })
      })
      console.log(grandParentId)
      addAuthorityToRole({
        roleId: this.selectInfo.id,
        type: 8,
        perms: grandParentId
      }).then(res => {
        this.$message({
          type: 'success',
          message: this.saveSuccessfully
        })
      })
    },
    cancelConfirmDialog () {
      this.dialogVisible = false
    },
    // 点击
    nodeClick (data, node, row) {
      this.getButtonList(data)
    },
    // 获取组织 角色按钮
    getButtonList (data) {
      this.orgMenuList = data
    },
    // 菜单权限按钮的ID
    handleNodeCheck(checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys) {
      console.log(checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys)
      this.grandParentId = checkedKeys.checkedKeys
    },
    // // 选择
    // handleSelectionChange(val) {
    //   this.btnSelection = val
    // }
    // 按钮权限
    btnClick (data) {
      this.type === 'org' ? this.orgBtnAuthority(data) : this.type === 'role' ? this.roleBtnAuthority(data) : ''
    },
    // 组织按钮的权限配置
    orgBtnAuthority (data) {
      data.add === 'Y' ? this.delOrgBtnAuthority(data) : this.addOrgBtnAuthority(data)
    },
    // 组织按钮权限添加
    addOrgBtnAuthority (data) {
      addButtonAuthorityToOrg({
        relatedid: this.selectInfo.id,
        relatedtype: 8,
        buttonid: data.id
      }).then(res => {
        console.log(res)
        this.getAgainMenuList()
        this.$message({
          type: 'success',
          message: this.addedSuccess
        })
      })
    },
    // 组织按钮权限删除
    delOrgBtnAuthority (data) {
      deleteButtonAuthorityFromOrg({
        relatedid: this.selectInfo.id,
        buttonid: data.id
      }).then(res => {
        this.getAgainMenuList()
        this.$message({
          type: 'success',
          message: this.successfullyDelete
        })
      })
    },
    // 角色按钮的权限配置
    roleBtnAuthority (data) {
      data.add === 'Y' ? this.delRoleBtnAuthority(data) : this.addRoleBtnAuthority(data)
    },
    // 角色按钮权限添加
    addRoleBtnAuthority (data) {
      addButtonAuthorityToRole({
        relatedid: this.selectInfo.id,
        relatedtype: 8,
        buttonid: data.id
      }).then(res => {
        console.log(res)
        this.getAgainMenuList()
        this.$message({
          type: 'success',
          message: this.addedSuccess
        })
      })
    },
    // 角色按钮权限删除
    delRoleBtnAuthority (data) {
      deleteButtonAuthorityFromRole({
        relatedid: this.selectInfo.id,
        buttonid: data.id
      }).then(res => {
        this.getAgainMenuList()
        this.$message({
          type: 'success',
          message: this.successfullyDelete
        })
      })
    },
    // 添加 删除 后重新获取组织树的数据
    getAgainMenuList () {
      this.menuTreeParams.attr.relatedid = this.selectInfo.id
      getMenuList(this.menuTreeParams).then(res => {
        this.updateSelectMenu(res)
      })
    },
    // 更新当前选中的菜单ID下的菜单按钮
    updateSelectMenu (data) {
      data.forEach(item => {
        if (item.id === this.orgMenuList.id) {
          this.orgMenuList = item
          console.log(this.orgMenuList)
        }
        if (item.children) {
          this.updateSelectMenu(item.children)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tree_node {
  height: 487px;
  /deep/ .el-checkbox{
    margin-right: 5px;
  }
}
</style>
