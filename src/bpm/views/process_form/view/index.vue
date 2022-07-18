<template>
  <flow-form :node="node" :collectionaData="collectionaData" :tabsList="tabsList" @handleSubmit="handleSubmit" @handleSave="handleSave"
    :isView="true" isSubjectEdit :isNoStart="true">
    <div slot="view" style="border-top: 1px solid #e5e5e5;">
      <flow-card :data="importantNodesCardItem" :is-more-card="true" v-if="approvalRecordList.filter(item => item.isimportant === 'Y').length > 0">
        <div slot="card">
          <el-row class="form">
            <el-table :data="approvalRecordList.filter(item => item.isimportant === 'Y')" :header-cell-style="{background: '#E1EAFD !important'}" border stripe style="width: 100%; text-align: center">
              <el-table-column prop="processnodename" :label="$t('node')" show-overflow-tooltip />
              <el-table-column prop="username" :label="$t('name')" show-overflow-tooltip />
              <el-table-column prop="result" :label="$t('action2')" show-overflow-tooltip />
              <el-table-column prop="createdate" :label="$t('time')" width="180" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.createdate | formatDateTime }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="reason" :label="$t('remarks')" show-overflow-tooltip />
            </el-table>
          </el-row>
        </div>
      </flow-card>
      <flow-card :data="approvalRecordCardItem" :isMoreCard="true">
        <div slot="card">
          <el-row class="form">
            <el-col :span="24" class="text-r margin-b15">
              <el-button @click="isApprove=!isApprove" type="primary">
                <i class="el-icon-sort"></i>
                {{!isApprove?$t('sortByTime'):$t('sortByDepartment')}}
              </el-button>
            </el-col>
            <el-table v-if="isApprove" :data="approvalRecordList" border stripe
              :header-cell-style="{background: '#E1EAFD !important'}" style="width: 100%; text-align: center">
              <el-table-column prop="processnodename" :label="$t('node')" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="username" :label="$t('name')" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="result" :label="$t('action2')" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="createdate" :label="$t('time')" width="180" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.createdate | formatDateTime}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="reason" :label="$t('remarks')" show-overflow-tooltip>
              </el-table-column>
            </el-table>
            <el-col class="approve-table" :span="24" v-else>
              <!-- <div class="table-header">
                <sort-button style="flex-grow: 1" :items="headers" />
              </div> -->
              <div v-for="(item, index) in approvalRecordSectionList" :key="index">
                <h4 v-if="item.approveCategory">{{item.approveCategory}}</h4>
                <!-- <div v-for="(val, index1) in item.list" :key="index1">
                  <el-row class="tr-body" type="flex" align="middle">
                    <el-col class="td text-c" :span="headers[0].span">{{val.processnodename}}</el-col>
                    <el-col class="td text-c" :span="headers[1].span">{{val.username}}</el-col>
                    <el-col class="td text-c" :span="headers[2].span">{{val.result}}</el-col>
                    <el-col class="td text-c" :span="headers[3].span">{{val.createdate | formatDateTime }}</el-col>
                    <el-col class="td text-c" :span="headers[4].span" :title="val.reason">{{val.reason}}</el-col>
                  </el-row>
                </div> -->
                <el-table :data="item.list" :header-cell-style="{background: '#E1EAFD !important'}" border stripe
                  style="width: 100%; text-align: center">
                  <el-table-column prop="processnodename" :label="$t('node')" show-overflow-tooltip />
                  <el-table-column prop="username" :label="$t('name')" show-overflow-tooltip />
                  <el-table-column prop="result" :label="$t('action2')" show-overflow-tooltip />
                  <el-table-column prop="createdate" :label="$t('time')" width="180" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span>{{ scope.row.createdate | formatDateTime }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="reason" :label="$t('remarks')" show-overflow-tooltip />
                </el-table>
              </div>
            </el-col>
          </el-row>
        </div>
      </flow-card>
    </div>
  </flow-form>
</template>

<script>
import FlowForm from '../../flow_form'
import FlowCard from '../../flow_form/FlowCard'
import { getViewProcessForm, getbyinstanceid, approveProcess, saveProcess } from '../../../api/flow'
import { activate } from '@/bpm/api/process/administrativeTool/processActive'
import { createNamespacedHelpers } from 'vuex'
const { mapMutations } = createNamespacedHelpers('app')
export default {
  components: {
    FlowForm,
    FlowCard
  },
  data () {
    return {
      node: {
        applyUserDto: {},
        nodeTabLists: []
      },
      headers: [
        {
          name: '节点',
          span: 6
        },
        {
          name: '姓名',
          span: 6
        },
        {
          name: '动作',
          span: 6
        },
        {
          name: '时间',
          span: 6
        },
        {
          name: this.$t('remarks'),
          span: 6
        }
      ],
      isApprove: true,
      approvalRecordSectionList: [],
      tabsList: [],
      approveTypeList: [],
      approvalRecordList: [],
      expand: true,
      submitaction: '',
      approvalComment: '',
      selectedUsers: {
        name: '',
        id: ''
      },
      approvalRecordCardItem: {
        tabname: this.$t('historicalApprovalRecord'),
        nodeTabLists: []
      },
      importantNodesCardItem: {
        tabname: this.$t('approvalOpinionsOnImportantNodes'),
        nodeTabLists: []
      },
      peopleDialog: false,
      collectionaData: {}
    }
  },
  mounted () {
    document.title = this.$route.query.name
    this.getData()
  },
  methods: {
    ...mapMutations(['setNodeData', 'setBizData', 'setTemporaryBizData']),
    getData () {
      this.$loading()
      getViewProcessForm({
        instanceId: this.$route.query.instanceId,
        userId: this.$store.state.basuser.user.id,
        type: this.$route.query.type
      }).then(rt => {
        this.$loading().close()
        this.node = rt.data
        this.getCollection(this.node.instanceId)
        this.tabsList = this.node.nodeTabLists.filter(item => {
          return item.istab === '1'
        })
        this.approveTypeList = this.node.approveTypeList
        this.approvalRecordList = Object.assign([], this.node.approvalRecordList)

        this.approvalRecordSectionList = this.approvalRecordList.map(item => {
          return {
            approveCategory: item.approveCategory
          }
        })
        let obj = {}
        this.approvalRecordSectionList = this.approvalRecordSectionList.reduce(
          function (item, next) {
            obj[next.approveCategory]
              ? ''
              : (obj[next.approveCategory] = true && item.push(next))
            return item
          },
          []
        )
        this.approvalRecordSectionList.forEach(item => {
          item.list = []
          this.approvalRecordList.forEach(val => {
            if (item.approveCategory === val.approveCategory) {
              item.list.push(val)
            }
          })
        })
        this.setBizData(this.node.bizData)
        this.setNodeData(this.node)
        this.setTemporaryBizData(this.node.bizData)
      }).catch(() => {
        this.$loading().close()
      })
    },
    getCollection (id) {
      getbyinstanceid(id).then(rt => {
        this.collectionaData = rt.data
      })
    },
    handleSubmit (data) {
      this.$loading()
      approveProcess({
        bizData: data,
        applyUserId: this.node.applyUserDto.id,
        approvalComment: this.approvalComment,
        approvalResult: this.approvalResult,
        selectedUsers: this.selectedUsers.id,
        subject: this.node.subject,
        submitaction: this.submitaction,
        targetActivityName: this.node.targetActivityName,
        taskId: this.node.taskId,
        userId: this.node.userId,
        positionId: this.node.applyUserDto.positionId // 新加  产品发布编辑 需要 positionId
      }).then(rt => {
        let that = this
        // 新加判断  产品发布编辑 需要
        if (this.$route.query.productRelease === 'edit') {
          this.activateProcess()
        } else {
          this.$message({
            message: this.$t('hintText.submittedSuccessfully'),
            type: 'success',
            duration: 1000,
            onClose () {
              that.$router.back()
            }
          })
          this.$loading().close()
        }
      }).catch(() => {
        this.$loading().close()
      })
    },
    handleSave (data) {
      this.$loading()
      saveProcess({
        bizData: data,
        instanceId: this.node.instanceId,
        subject: this.node.subject,
        userId: this.node.userId,
        targetActivityName: this.node.targetActivityName,
        taskId: this.node.taskId
      })
        .then(rt => {
          this.activateProcess()
        })
        .catch(() => {
          this.$loading().close()
        })
    },
    activateProcess () {
      activate({
        instid: this.node.instanceId,
        processNodeName: 'Start'
      }).then(rt => {
        console.log(rt);
          if (rt.status === '200') {
            let that = this
            this.$message({
              message: this.$t('hintText.processActivatedSuccessfully'),
              type: 'success',
              duration: 1000,
              onClose () {
                that.$router.back()
              }
            })
            localStorage.setItem('isReload', true)
            window.opener = null
            window.open('', '_self')
            window.close()
            this.$loading().close()
          }
      })
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.approve-table {
  // border-left: 1px solid $dc1;
  // border-top: 1px solid $dc1;
  .table-header {
    color: #333;
    font-weight: bold;
    margin-top: 0px;
  }
  h4 {
    height: 36px;
    line-height: 36px;
    border-right: 1px solid $dc1;
    border-bottom: 1px solid $dc1;
    padding: 0 7px;
    color: $active-color;
  }
  .tr-body {
    .td {
      height: 36px;
      line-height: 36px;
      border-right: 1px solid $dc1;
      border-bottom: 1px solid $dc1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0 7px;
      color: #666;
      font-size: 12px;
    }
  }
}
.form.el-row {
  padding-right: 15px;
  .form-item {
    margin-bottom: 15px;
  }
}
.el-table {
  /deep/ th,
  /deep/ td {
    text-align: center;
    border-right: 0;
  }
}
</style>
