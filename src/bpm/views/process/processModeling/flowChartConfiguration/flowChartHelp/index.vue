<template>
  <div id="flowChartHelp" v-loading="loading">
    <div class="tool-common-wrap">
      <div class="btn-wrap">
        <el-button type="primary" @click="getData">
           {{ $t('refresh') }}
          
        </el-button>
      </div>
    </div>
    <el-form :model="ruleForm" ref="ruleForm">
      <div class="card1" ref="card1">
        <div class="card-info">
          <el-form :model="ruleForm" ref="ruleForm" label-width="120px">
            <el-row>
              <el-col :span="10" :offset="2">
                <el-form-item :label="$t('modifier') + '：'">
                  <el-input clearable v-model="ruleForm.pmodifyuser" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10" :offset="2">
                <el-form-item :label="$t('changeTheTime') + '：'">
                  <el-input clearable v-model="ruleForm.pmodifydate" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10" :offset="2" v-if="treeData.type==='2'">
                <el-form-item :label="$t('nodeType') + '：'">
                  <el-select clearable v-model="ruleForm.processflownodetype " :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
                    <el-option
                      v-for="item in selectList"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10" :offset="2" v-if="treeData.type==='1'">
                <el-form-item :label="$t('processManager2') + '：'">
                  <el-input clearable type="textarea" v-model="ruleForm.adminUserName" @focus="adminHandle"></el-input>
                  <!-- <div class="admin-div">
                    <div>
                      <p v-for="(v, index) in adminList" :key="index">{{v.cnname}}</p>
                    </div>
                    <el-button title="选择" type="primary" @click="adminHandle">选择</el-button>
                    <el-button title="清空" @click="emptyHandle">清空</el-button>
                  </div>-->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10" :offset="2">
                <el-form-item label>
                  <el-input clearable type="textarea" v-model="ruleForm.helpcontent"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="text-r">
              <el-button type="primary" @click="subHandle">{{ $t('submit') }}</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </el-form>
    <select-people
      :itemList="peopleList"
      :userAll="userAll"
      :isMore="true"
      v-model="adminDialogVisible"
      @confirm="adminSuccess"
    />
  </div>
</template>
<script>
// import adminDialog from '../../../components/adminDialog'
import selectPeople from '../../../../flow_form/SelectPeople'
import {
  getProcessData,
  getProcessNodeData,
  saveProcessData,
  saveProcessNodeData
} from '@/bpm/api/process/processModeling/flow_chart_configuration'

import { getDictionaryOption } from '@/bpm/api/process/processModeling/classificationModel'

// import { getOptionListById } from "@/bpm/api/configManage/dataDictorary";
export default {
  name: 'flowChartHelp',
  computed: {},
  components: {
    selectPeople
  },
  data () {
    return {
      adminDialogVisible: false,
      loading: false,
      peopleList: [],
      ruleForm: {},
      selectList: [],
      value: '',
      adminList: [],
      userAll: []
    }
  },
  props: {
    treeData: {
      type: Object
    }
  },
  watch: {
    treeData (val) {
      this.getData()
    }
  },
  methods: {
    getData () {
      if (this.treeData.type === '2') {
        this.loading = true
        getProcessNodeData(this.treeData.id)
          .then(rt => {
            this.loading = false
            this.ruleForm = Object.assign({}, rt.data)
            this.ruleForm.pmodifyuser = this.ruleForm.nmodifyuser
            this.ruleForm.pmodifydate = this.ruleForm.nmodifydate
            return getDictionaryOption({
              dictionaryen: '节点类型'
            })
          })
          .then(rt => {
            if (rt.status === '200') {
              this.selectList = rt.data
            }
            this.loading = false
          })
          .catch(err => {
            this.$message.error(err.message)
            this.loading = false
          })
      } else if (this.treeData.type === '1') {
        getProcessData(this.treeData.id)
          .then(rt => {
            this.loading = false
            this.ruleForm = rt.data
          })
          .catch(err => {
            this.$message.error(err.message)
            this.loading = false
          })
      }
    },
    subHandle () {
      if (this.treeData.type === '2') {
        this.loading = true
        this.ruleForm.nmodifyuser = this.$store.state.basuser.user.id
        saveProcessNodeData(this.ruleForm)
          .then(rt => {
            if (rt.status === '200') {
              this.loading = false
              this.getData()
              this.$message({
                message: this.$t('hintText.saveSuccessfully'),
                type: 'success'
              })
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
      } else if (this.treeData.type === '1') {
        this.loading = true
        this.ruleForm.pmodifyuser = this.$store.state.basuser.user.id
        // this.ruleForm.adminUserIds = this.adminList
        //   .map(item => item.userid)
        //   .join(',')
        saveProcessData(this.ruleForm)
          .then(rt => {
            if (rt.status === '200') {
              this.loading = false
              this.getData()
              this.$message({
                message: this.$t('hintText.saveSuccessfully'),
                type: 'success'
              })
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
      }
    },
    adminSuccess (data) {
      if (data) {
        this.ruleForm.adminUserName = data.map(item => item.cnname).join('、')
        this.ruleForm.adminUserIds = data.map(item => item.id).join(',')
      }
      this.adminDialogVisible = false
    },
    // emptyHandle(index) {
    //   this.adminList = [];
    //   this.$forceUpdate();
    // },
    adminHandle () {
      this.userAll = []
      this.peopleList = []
      if (this.ruleForm.adminUserIds) {
        this.peopleList = this.ruleForm.adminUserIds.split(',')
        let list = this.ruleForm.adminUserIds.split(',')
        let val = this.ruleForm.adminUserName.split(',')
        for (let i = 0; i < list.length; i++) {
          this.userAll.push({
            displayname: val[i],
            cnname: val[i],
            empuid: list[i],
            id: list[i]
          })
        }
      }
      this.adminDialogVisible = true
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style lang="scss">
#flowChartHelp {
  .el-input__inner {
    border: none;
    border-bottom: 1px solid $dc1;
  }
  .text-r {
    button {
      margin: 15px 10px;
    }
  }
  .admin-div {
    button {
      margin-left: 15px;
    }
  }
}
</style>
<style lang="scss" scoped>
#flowChartHelp {
  .w100 {
    width: 100%;
  }
  .card1 {
    padding: 0 5px 15px 15px;
    background: white;
    overflow: hidden;
    transition-duration: 0.5s;
    box-sizing: border-box;
    height: auto;
    .header {
      margin-right: 10px;
      border-bottom: 1px solid $dc1;
      margin-bottom: 10px;
      display: flex;
      .title {
        height: 35px;
        line-height: 35px;
        color: $tc1;
        font-weight: bold;
      }
      .space {
        flex-grow: 1;
      }
    }
  }
  .admin-div {
    display: flex;
    overflow: hidden;
    align-items: center;
    border: 1px solid $dc1;
    border-radius: 3px;
    padding: 5px;
    div {
      width: calc(100% - 120px);
      max-height: 140px;
      overflow: auto;
      button {
        margin-left: 15px;
      }
      p {
        height: 28px;
        line-height: 28px;
        &:hover {
          background-color: $bc2;
        }
      }
    }
  }
}
</style>
