<template>
  <div id="nodeAlias">
    <el-form :model="ruleForm" ref="ruleForm">
      <div v-if="$store.state.app.tableStyle ==='default'">
        <el-row type="flex" class="header" align="middle">
          <el-col :span="4">{{ $t('company') }}</el-col>
          <el-col :span="10" class>
            {{ $t('administrator') }}
          </el-col>
        </el-row>
        <el-row type="flex" align="middle" class="margin-t10" v-for="(item, index) in ruleForm.nodeList" :key="item.key">
          <el-col :span="4">
              <el-input clearable class="calculative" type="type" @focus="companyDialog(index)" v-model="item.deptName"></el-input>
          </el-col>
          <el-col :span="10">
              <el-input clearable class="calculative" type="textarea" @focus="adminHandle(index)" v-model="item.userName"></el-input>
          </el-col>
        </el-row>
      </div>
      <div v-else>
        <el-table
          :data="ruleForm.nodeList"
          class="margin-t10"
          stripe
          :header-cell-style="{background: '#E1EAFD !important'}"
          highlight-current-row
          current-row-key="id"
        >
          <el-table-column :label="$t('company')" show-overflow-tooltip prop="deptName">
            <template slot-scope="scope">
              <el-input clearable class="calculative" type="type" @focus="companyDialog(scope.$index)" v-model="scope.row.deptName"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('administrator')" show-overflow-tooltip prop="userName">
            <template slot-scope="scope">
              <el-input clearable class="calculative" type="textarea" @focus="adminHandle(scope.$index)" v-model="scope.row.userName"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <div class="text-r">
      <el-button :title="$t('addProcessManager')" icon="el-icon-circle-plus-outline"  @click="addFormList()">{{ $t('addManager') }}</el-button>
      <el-button type="primary" @click="subHandle">{{ $t('submit') }}</el-button>
    </div>
    <select-org :isMore="false" v-model="dialogVisible" @confirm="saveSuccess" ></select-org>
    <select-people :userAll="userAll" :isMore="true" v-model="adminDialogVisible" @confirm="adminSuccess"/>
  </div>
</template>
<script>
import { now } from 'moment-mini'
import selectPeople from '../../../../flow_form/SelectPeople'
import SelectOrg from '@/bpm/views/flow_form/SelectOrganization'

import {
  saveDeptAdmin,
  getDeptAdmin
} from '@/bpm/api/process/processModeling/institutional_framework'

export default {
  name: 'nodeAlias',
  computed: {},
  components: {
    SelectOrg,
    selectPeople
  },
  props: {
    treeData: {
      type: Object
    }
  },
  data () {
    return {
      dialogVisible: false,
      adminDialogVisible: false,
      userAll: [],
      ruleForm: {
        nodeList: [{
          key: Date.now()

        }]
      },
      nodeListIndex: 0,
      adminListIndex: 0
    }
  },
  methods: {
    // 删除字段
    handleDeleteOne (k) {
      this.ruleForm.nodeList.splice(
        this.ruleForm.nodeList.findIndex(item => item.key === k.key),
        1
      )
    },
    saveSuccess (data) {
      if (data) {
        this.$set(this.ruleForm.nodeList[this.nodeListIndex], 'deptName', data[0].NAME)
        this.$set(this.ruleForm.nodeList[this.nodeListIndex], 'deptid', data[0].ID)
      }
      this.dialogVisible = false
    },
    adminSuccess (data) {
      if (data) {
        this.$set(this.ruleForm.nodeList[this.adminListIndex], 'userName', data.map(item => item.cnname).join('、'))
        this.$set(this.ruleForm.nodeList[this.adminListIndex], 'userids', data.map(item => item.empuid).join(','))
      }
      this.adminDialogVisible = false
    },
    emptyHandle (index) {
      this.$set(this.ruleForm.nodeList[index], 'adminList', [])
      this.$forceUpdate()
    },
    companyDialog (index) {
      this.nodeListIndex = index
      this.dialogVisible = true
    },
    adminHandle (index) {
      let that = this
      that.adminListIndex = index
       that.userAll = [];
        if (that.ruleForm.nodeList[index].userids) {
           that.ruleForm.nodeList[index].userids.split(",").forEach((data, i) => {
            that.userAll.push({
              id: data,
              empuid: data,
              cnname: that.ruleForm.nodeList[index].userName.split(",")[i],
              displayname: that.ruleForm.nodeList[index].userName.split(",")[i]
            });
          });
        }
      that.adminDialogVisible = true
    },
    subHandle () {
      this.loading = true
      this.ruleForm.nodeList.forEach(item => {
        item.processid = this.treeData.id
      })
      for (let i = 0, len = this.ruleForm.nodeList.length; i < len; i++) {
        let item = this.ruleForm.nodeList[i]
        if (!item.deptid) {
          this.$message({
            message: this.$t('company') + ' ' + this.$t('hintText.cannotBeEmpty'),
            type: 'error'
          })
          return
        }
        if (!item.userids) {
          this.$message({
            message: this.$t('administrator') + ' ' + this.$t('hintText.cannotBeEmpty'),
            type: 'error'
          })
          return
        }
      }
      saveDeptAdmin(this.ruleForm.nodeList)
        .then(rt => {
          if (rt.status === '200') {
            this.$message({
              message: this.$t('hintText.saveSuccessfully'),
              type: 'success'
            })
            this.loading = false
            this.getData()
          } else {
            this.loading = false
            this.$message({
              message: this.$t('hintText.failToSave'),
              type: 'error'
            })
          }
        })
        .catch(() => {
          this.loading = false
          this.$message({
            message: this.$t('hintText.failToSave'),
            type: 'error'
          })
        })
    },
    getData () {
      this.loading = true
      getDeptAdmin(this.treeData.id)
        .then(rt => {
          this.loading = false
          this.ruleForm.nodeList = rt.data
        })
        .catch(err => {
          this.$message.error(err.message)
          this.loading = false
        })
    },
    // 添加字段
    addFormList () {
      this.ruleForm.nodeList.push({
        key: Date.now()
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style lang="scss">
#nodeAlias {
  .el-form-item__content {
    padding: 7px;
  }
  .el-input__inner {
  }
  .text-r {
    button {
      margin: 15px 10px;
    }
  }
  .admin-div {
    button{
        margin-left: 15px;
    }
  }
}
</style>
<style lang="scss" scoped>
#nodeAlias {
  .header {
    font-size: 12px;
    color: $tc1;
    background: $bc2;
    margin-top: 20px;
    .el-col {
      padding: 10px;
    }
  }
  .admin-div {
      display: flex;
      overflow: hidden;
      align-items: center;
      .border{
        border: 1px solid $dc1;
        padding: 5px 10px;
        min-height: 24px;
      }
      div{
        width: calc(100% - 180px);
        max-height: 140px;
        overflow: auto;
        button{
            margin-left: 15px;
        }
        p{
            height: 28px;
            line-height: 28px;
            &:hover{
                background-color: $bc2;
            }
        }
      }
  }
  .calculative {
      width: calc(100% - 30px)
  }
}
</style>
