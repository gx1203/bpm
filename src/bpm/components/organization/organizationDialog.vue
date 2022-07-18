<template>
  <el-dialog
    class="dialogClass"
    id="organizationDialog"
    title="选择组织"
    :visible.sync="adminDialogVisible"
    append-to-body
  >
    <div class="content">
      <el-row :gutter="10">
        <el-col :span="16">
          <el-radio-group v-model="radio">
            <el-radio :label="1">组织树</el-radio>
            <el-radio :label="2">部门</el-radio>
            <el-radio :label="3">职务</el-radio>
            <el-radio :label="4">系统组</el-radio>
            <el-radio :label="5">自定义组</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="addData('自定义组')">
            添加到自定义组
            <i class="el-icon-circle-plus-outline" />
          </el-button>
          <el-button type="primary" @click="addData('指定组')">
            添加指定组
            <i class="el-icon-circle-plus-outline" />
          </el-button>
        </el-col>
      </el-row> -->
      <!-- <el-row>
        <el-col :span="6">
          <el-input clearable placeholder="输入用户查找" v-model="userName" @keyup.enter.native="searchUser"></el-input>
        </el-col>
      </el-row>
      <el-row class="margin-t10" :gutter="10">
        <el-col :span="8">
          <el-input clearable :placeholder="$t('placeholderText.enterKeywordsFiltering')" v-model="filterText"></el-input>

           <el-tree class="elTree" 
        style="height:500px;overflow: auto;"
        :props="props"
        :data="treeData"
        :load="loadNode"
        :expand-on-click-node="false"
        lazy
        node-key="ID"
        @node-click='handleGetUser'
        @check-change='handleClick'
         show-checkbox
        :check-strictly="true"
        :default-checked-keys="transferData"
        :filter-node-method="filterNode"
        ref="tree">
        <span class="custom-tree-node" slot-scope="{ node, data}">
          <i v-if="data.type === '0'"></i>
          <i v-else-if="data.type === '1'" class="iconfont icon-gongsi"></i>
          <i v-else-if="data.type === '2'" class="iconfont icon-bumen"></i>
          <i v-else-if="data.type === '3'" class="iconfont icon-drxx12"></i>
          <i v-else class="iconfont icon-bumen"></i>
          <span>{{ node.label }}</span>
        </span>
      </el-tree>

<!-- 
           <el-tree class="elTree"
        @check-change='handleClick'
        style="height: calc(100% - 200px); overflow: auto;"
        :props="props"
        :data="treeData"
        :expand-on-click-node="false"
        :load="loadNode"
        lazy
        node-key="ID"
        show-checkbox
        :check-strictly="true"
        :default-checked-keys="transferData"
        :filter-node-method="filterNode"
        ref="tree"> -->
      <!-- </el-tree> -->
    </el-col>
        <el-col :span="16">
          <el-transfer
            :titles="['选择用户','已选对象']"
            @change="transferMove"
            :props="{
              key: 'ID',
              label: 'NAME'
            }"
            v-model="transferData"
            :data="generateData"
          >
          <div slot-scope="{ option }" class="item_selected_explain">
            <div>
              <p v-if="option.TYPE === '0'" class="sOrgIco9"><span></span>{{ option.NAME }}</p>
              <p v-else-if="option.TYPE === '1'" class="sOrgIco1"><span></span>{{ option.NAME }}</p>
              <p v-else-if="option.TYPE === '2'" class="sOrgIco2"><span></span>{{ option.NAME }}</p>
              <p v-else-if="option.TYPE === '3'" class="sOrgIco3"><span></span>{{ option.NAME }}</p>
              <p v-else-if="option.TYPE === '4'" class="sOrgIco4"><span></span>{{ option.NAME }}</p>
              <p v-else-if="option.TYPE === '5'" class="sOrgIco5"><span></span>{{ option.NAME }}</p>
              <p v-else-if="option.TYPE === '6'" class="sOrgIco6"><span></span>{{ option.NAME }}</p>
              <p v-else-if="option.TYPE === '7'" class="sOrgIco7"><span></span>{{ option.NAME }}</p>
              <p v-else-if="option.TYPE === '8'" class="sOrgIco8"><span></span>{{ option.NAME }}</p>
              <p v-else-if="option.TYPE === '9'" class="sOrgIco9"><span></span>{{ option.NAME }}</p>
              <p v-else-if="option.TYPE === '10'" class="sOrgIco10"><span></span>{{ option.NAME }}</p>
            </div>
          </div>
          </el-transfer>
          <div class="margin-t10">
            <ul class="item_selected_explain">
                <li class="sOrgIco1">
                  <span></span>公司
                </li>
                <li class="sOrgIco2">
                  <span></span>部门
                </li>
                <li class="sOrgIco3">
                  <span></span>岗位
                </li>
                <li class="sOrgIco4">
                  <span></span>事业部
                </li>
                <li class="sOrgIco5">
                  <span></span>片区
                </li>
                <li class="sOrgIco6">
                  <span></span>职务
                </li>
                <li class="sOrgIco7">
                  <span></span>系统组
                </li>
                <li class="sOrgIco8">
                  <span></span>角色
                </li>
                <li class="sOrgIco9">
                  <span></span>用户
                </li>
                <li class="sOrgIco10">
                  <span></span>自定义组
                </li>
              </ul>
              </div>
        </el-col>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit()">{{ $t('confirm') }}</el-button>
    </span>
    <add-group-dialog
      v-model="addDialogVisible"
      :item="editItem"
      :title="linkTitle"
      @confirm="saveSuccess"
    />
  </el-dialog>
</template>
<script>
import addGroupDialog from './addGroupDialog'
// import { getFirstOrg, getTotalOrg1 } from '../../api/flow/index'
import { getAllRootTree, getChildren } from '@/bpm/api/configManage/institutionalFramework/organization.js'

import { getUserList } from '../../api/configManage/institutionalFramework/post_manage'
import { findOrgUsers } from '@/bpm/api/configManage/institutionalFramework/organization'
export default {
  components: {
    addGroupDialog
  },
  data () {
    return {
      addDialogVisible: false,
      radio: 1,
      editItem: {},
      linkTitle: '',
      adminDialogVisible: this.value,
      checkedData: '',
      rightDefault: [],
      props: {
        label: 'NAME',
        isLeaf: 'isParent'
      },
      treeData: [],
      filterText: '',
      generateData: [],
      transferData: [],
      orgUser: [],
      filters:[],
      userName: '',
      page: {
        pageNum: 1,
        pageSize: 20
      }
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value (val) {
      this.adminDialogVisible = val
      if (val) {
        this.getDepartment()
        this.generateData = []
        this.transferData = []
        this.filterText = ''
        this.userName = ''
      }
    },
    filterText (val) {
      this.$refs.tree.filter(val)
    },
    adminDialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    searchUser () {
      getUserList({
        filters: [{key: 'empid', opt: 'LIKE', type: 'S', value: this.userName}],
        logic: 'and'
      }).then(rt => {
        if (rt.data.list && rt.data.list.length > 0) {
          rt.data.list.forEach(element => {
            element.NAME = element.cnname
            element.ID = element.id
            element.TYPE = '9'
          })
          this.orgUser = this.orgUser.concat(rt.data.list)
          let obj = {}
          this.orgUser = this.orgUser.reduce((cur, next) => {
            obj[next.id] ? '' : obj[next.id] = true && cur.push(next)
            return cur
          }, [])
          // let arr = [...this.$refs.tree.getCheckedNodes(), ...this.orgUser]
          this.generateData = this.orgUser
        }
      })
    },
    clickRadioNode (event) {
      if (event) event.preventDefault()
    },
    filterNode (value, data) {
      if (!value) return true
      return data.NAME.indexOf(value) !== -1
    },
    getDepartment () {
       getAllRootTree().then((rt) => {
        rt.data.forEach(item => {
          item.NAME = item.name
          item.ID = item.id
          item.TYPE = item.type
        })
        this.treeData = rt.data
      }).catch((er) => {
        console.log(er)
      })
    },
    toBoolean (val) {
      switch (val.toLowerCase()) {
        case 'true': case 1: case 'yes': return true
        case 'false': case 0: case 'no': case null: return false
        default:return Boolean(val)
      }
    },
    loadNode (node, resolve) {
      if (node.level > 0) {
        getChildren(node.data.ID).then((rt) => {
          rt.data.forEach(item => {
            item.NAME = item.name
            item.ID = item.id
            item.TYPE = item.type
          })
          resolve(rt.data)
        }).catch((er) => {
          console.log(er)
        })
      }
    },
    transferMove (data, direction, key) {
      if (direction === 'left') {
        let _list = []
        data.forEach(item => {
          this.generateData.forEach(v => {
            if (item === v.ID) {
              _list.push(v)
            }
          })
        })
        this.$refs.tree.setCheckedNodes(_list)
      }
    },
    handleClick (data) {
      let arr = [...this.$refs.tree.getCheckedNodes(), ...this.orgUser]
      this.generateData = arr
      // this.generateData = this.$refs.tree.getCheckedNodes()
      this.transferData = this.generateData.map(item => item.ID)
    },
    saveSuccess (val) {},
    addData (title) {
      this.addDialogVisible = true
      this.linkTitle = title
      this.editItem = {}
    },
    submit () {
      let _list = []
      this.transferData.forEach(item => {
        this.generateData.forEach(v => {
          if (item === v.ID) {
            _list.push(v)
          }
        })
      })
      this.$emit('confirm', _list)
      this.cancel()
    },
    cancel () {
      this.adminDialogVisible = false
    },
    handleGetUser (item){
      findOrgUsers({
        logic: 'and',
        filters: this.filters,
        ...this.page
      }, item.id, false).then(rt => {
        let _list = rt.data.list.map(item=>{
          return {
            ID:item.id,
            TYPE:'9',
            NAME:item.displayname
          }
        })
        this.generateData =[...this.transferData,..._list]
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  },
  mounted () {}
}
</script>
<style scoped>
.content {
  height: 50vh;
  margin: 0 auto;
  overflow: auto;
  padding: 0 10px;
}
</style>
<style lang="scss">
.dialogClass {
  .el-input__inner {
    border: none;
    border-bottom: 1px solid $dc1;
  }
}
#organizationDialog {
  .el-dialog {
    min-width: 891px;
  }
  .el-transfer-panel{
    width: 220px;
    height: 100%;
  }
  .el-transfer-panel__footer {
    height: auto;
  }
}
</style>
<style lang="scss" scoped>
#organizationDialog {
  .item_selected_explain {
    li,p {
      display: inline-block;
      span {
        display: inline-block;
        margin: 0 3px;
        width: 16px;
        height: 20px;
        background: url("../../assets/img/sOrg_Ico.png") no-repeat;
        margin-bottom: -3px;
      }
    }
    .sOrgIco1 > span {
      background-position: 0 -67px;
    }
    .sOrgIco2 > span {
      background-position: 0 -43px;
    }
    .sOrgIco3 > span {
      background-position: 0 -19px;
    }
    .sOrgIco4 > span {
      background-position: 0 -218px;
    }
    .sOrgIco5 > span {
      background-position: 0 -115px;
    }
    .sOrgIco6 > span {
      background-position: 0 -91px;
    }
    .sOrgIco7 > span {
      background-position: 0 -140px;
    }
    .sOrgIco8 > span {
      background-position: 0 -165px;
    }
    .sOrgIco9 > span {
      background-position: 0 3px;
    }
    .sOrgIco10 > span {
      background-position: 0 -193px;
    }
  }
}
</style>
