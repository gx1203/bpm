<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    id="allocationDialog"
    class="userDialog"
    append-to-body
    top="2vh"
    custom-class="w642"
    v-loading="pageLoading"
  >
  <div>
      <el-form
      class="power-search"
      label-width="120px"
      size="mini"
    >
      <el-row align="left" :gutter="10">
        <el-col :span="8">
          <el-input clearable type="text" v-model="name" @keyup.enter.native="search" :placeholder="$t('placeholderText.pleaseEnterName')"></el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="search">{{ $t('query') }}</el-button>
          <el-button type="primary" @click="reset">{{ $t('reset') }}</el-button>
        </el-col>
        <el-col :span="11" style="text-align: right;">
          <el-button type="primary" @click="userHandle">
            {{ $t('add') }}
            
          </el-button>
          <el-button type="primary" :disabled="multipleSelection.length < 1" @click="removeRole">
            {{ $t('batchDelete') }}
            <i class="el-icon-circle-close" />
          </el-button>
          <el-button type="primary" @click="getUser">
             {{ $t('refresh') }}
            
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row :gutter="18">
      <el-col :span="24" >
        <el-table
          :data="userData.list"
          border
          :header-cell-style="{'text-align':'center',background: '#E1EAFD !important'}"
          style="width: 100%; margin-bottom: 10px"
          ref="multipleTable"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            prop="displayname"
            align="center"
            :label="$t('name2')"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            :label="$t('operation')"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tooltip class="item" :content="$t('delete')">
                  <el-button @click="delOne(scope.row)" type="text" icon="el-icon-delete"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          v-if="userData.list && userData.list.length > 0"
          @current-change="handleCurrentChange"
          :page-size="pageSize"
          :current-page.sync="pageNum"
          :total="userData.total"
        ></el-pagination>
      </el-col>
    </el-row>
  </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{ $t('cancelAction') }}</el-button>
    </span>
    <bas-organieation
      v-model="addDialogVisible"
      :selectedElement="selectedElement"
      :isSpecifiedGroupBut="false"
      :isShowBustomGroupsBut="false"
      :selectElement="selectElement"
      :showElement="showElement"
      :title="$t('selectPersonnel')"
      @fnCallBack="getFlow"/>
  </el-dialog>
</template>

<script>
// import organizationDialog from '@/bpm/components/organization/organizationDialog'
import BasComponent from 'bas-component'
Vue.use(BasComponent)
import 'bas-component/lib/BasComponent.css'
// import SelectPeople from '@/bpm/views/flow_form/SelectPeople'
import { removeUserFromRole, findRoleUsers, userAutoToRole, removeRoleUser } from '@/bpm/api/configManage/authorityManage/roleManage'
export default {
  components: {
    // SelectPeople
    // organizationDialog
  },
  data () {
    return {
      dialogVisible: false,
      addDialogVisible: false,
      selectedElement: {},
      showElement:[],
      selectElement: ["9"],
      orgtitle: this.$t('placeholderText.selectAgent'),
      userData: {},
      pageLoading: false,
      multipleSelection: [],
      pageSize: 10,
      pageNum: 1,
      name: ''
    }
  },
  props: {
    value: {
      type: Boolean
    },
    item: {
      type: Object
    },
    title: {
      type: String
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
      if (val) {
        this.name = ''
        this.getUser()
      }
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    removeRole () {
      let users = []
      this.multipleSelection.forEach(element => {
        users.push({
          'roleId': this.item.id,
          'objectId':element.id
        })
      })
      this.$confirm(this.$t('hintText.areYouSureDeleteSelectedData'), this.$t('hintText.hint'), {
        type: 'warning'
      }).then(() => {
        removeRoleUser(users).then(rt => {
          if (rt.status === '200') {
            this.getUser()
            this.$message({
              message: this.$t('hintText.successfullyDelete'),
              type: 'success'
            })
          } else {
            this.$message({
              message: this.$t('hintText.failToDelete'),
              type: 'error'
            })
          }
        })
      }).catch(_ => {})
    },
    delOne (item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      }).then(() => {
        removeUserFromRole({
          'roleId': this.item.id,
          'objectId': item.id
        }).then(rt => {
          if (rt.status === '200') {
            this.getUser()
            this.$message({
              message: this.$t('hintText.successfullyDelete'),
              type: 'success'
            })
          } else {
            this.$message({
              message: this.$t('hintText.failToDelete'),
              type: 'error'
            })
          }
        })
      }).catch(_ => {})
    },
    userHandle () {
      this.addDialogVisible = true
      this.linkTitle = '新增组织'
    },
    confirm () {
      this.dialogVisible = false
    },
    getFlow (data) {
      let users = []
      if(!data.id){
        this.$message.error('请选择人员')
        return
      }
      data.id.split(',').forEach(element => {
        users.push({
          'roleId': this.item.id,
          'objectId': element
        })
      })
        this.pageLoading = true
        userAutoToRole(users).then(rt => {
          if (rt.status === '200') {
            this.addDialogVisible =  false
            this.$message.success(this.$t('hintText.operateSuccessfully'))
            this.getUser()
          }
        }).catch(er => {
          console.log(er)
          this.pageLoading = false
        })
    },
    getUser () {
      this.pageLoading = true
      findRoleUsers(this.item.id, {
        'filters': [
          {
            'key': 'displayname',
            'opt': 'LIKE',
            'type': 'S',
            'value': this.name
          }
        ],
        'logic': 'and',
        'pageNum': this.pageNum,
        'pageSize': this.pageSize
      }).then(rt => {
        this.pageLoading = false
        this.userData = rt.data
      })
    },
    handleCurrentChange (val) {
      this.getUser()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    search () {
      this.pageNum = 1
      this.getUser()
    },
    reset () {
      this.pageNum = 1
      this.name = ''
      this.getUser()
    }
  }
}
</script>
<style lang="scss">

#allocationDialog{
  .el-form-item {
    margin-bottom: 0;
  }
  .w642{
   min-width:642px
  }
}
</style>

<style lang="scss" scoped>
</style>
