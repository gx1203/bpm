<template>
  <flow-form :node="node" :collectionaData="collectionaData" :tabsList="tabsList" @handleSubmit="handleSubmit" :isView="true" isSubjectEdit :isNoStart="true">
    <div slot="view" style="border-top: 1px solid #e5e5e5;">
    </div>
  </flow-form>
</template>

<script>
import FlowForm from '../../flow_form'
import FlowCard from '../../flow_form/FlowCard'
import { getViewProcessForm, getbyinstanceid } from '../../../api/flow'
import {createNamespacedHelpers} from 'vuex'
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
      peopleDialog: false,
      collectionaData: {}
    }
  },
  mounted () {
    document.title = this.$route.query.name
    this.getData()
  },
  methods: {
    ...mapMutations(['setNodeData','setBizData', 'setTemporaryBizData']),
    getData () {
        this.node = JSON.parse(localStorage.getItem('previewFormData'))
        this.tabsList = this.node.nodeTabLists.filter(item => {
          return item.istab === '1'
        })
        this.setBizData(this.node.bizData)
        this.setNodeData(this.node)
        this.setTemporaryBizData(this.node.bizData)
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
        userId: this.node.userId
      }).then(rt => {
        let that = this
        this.$message({
          message: this.$t('hintText.submittedSuccessfully'),
          type: 'success',
          duration: 1000,
          onClose () {
            that.$router.back()
          }
        })
        this.$loading().close()
      }).catch(() => {
        this.$loading().close()
      })
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.approve-table {
  border-left: 1px solid $dc1;
  border-top: 1px solid $dc1;
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
    /deep/ th, /deep/ td {
      text-align: center;
    }
  }
</style>
