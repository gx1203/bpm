<template>
  <div>
    <flow-form :node="node" :tabsList="tabsList" @handleSubmit="handleSubmit" :isNoStart="isNoStart"/>
  </div>
</template>

<script>
import FlowForm from '../../flow_form'
import { getStartProcessForm, startProcess, saveDraft, saveStencil } from '../../../api/flow'
import {createNamespacedHelpers} from 'vuex'
const { mapMutations } = createNamespacedHelpers('app')
export default {
  components: {
    FlowForm
  },
  data () {
    return {
      node: {
        applyUserDto: {},
        nodeTabLists: []
      },
      isNoStart: false,
      isDraftAndTemp: false,
      data: {},
      tabsList: [],
      dialogVisible: false,
      saveType: '1',
      draftName: ''
    }
  },
  mounted () {
    document.title = this.$route.query.name
    this.setIsTest(true)
    this.getStartProcessForm()
  },
  methods: {
    ...mapMutations(['setNodeData','setBizData', 'setButtonDisabled', 'setTemporaryBizData', 'setIsTest']),
    getStartProcessForm () {
      this.$loading()
      getStartProcessForm({
        bizId: this.$route.query.bizId || '',
        positionId: this.$route.query.pid || '',
        draftId: this.$route.query.draftId || '',
        processName: this.$route.query.processName,
        processNodeName: 'Start',
        projectName: this.$route.query.projectName,
        stencilId: this.$route.query.stencilId || '',
        userId: this.$store.state.basuser.user.id
      }).then(rt => {
        this.$loading().close()
        this.node = rt.data
        // this.node.applyUserDto.department =  this.$route.query.dname
        this.tabsList = this.node.nodeTabLists.filter(item => {
          return item.istab === '1'
        })
        this.setNodeData(this.node);
        this.setBizData(this.node.bizData)
        this.setTemporaryBizData(this.node.bizData)
        
        this.isLoadData = true
      }).catch(() => {
        this.$loading().close()
      })
    },
    handleSubmit (data) {
      this.$loading()
      startProcess({
        bizData: data,
        bizId: this.node.bizId,
        createCompanyId: '',
        createDeptId: '',
        positionId: this.node.positionId,
        draftId: this.node.draftId,
        processName: this.node.processName,
        processNodeName: this.node.processNodeName,
        projectName: this.node.projectName,
        reqno: '',
        stencilId: this.node.bizId,
        subject: this.node.subject,
        userId: this.node.userId
      }).then(rt => {
        let that = this
        this.$message({
          message: this.$t('hintText.submittedSuccessfully'),
          type: 'success',
          duration: 2000,
          onClose () {
            that.$router.back()
            that.setButtonDisabled(false)
          }
        })
        localStorage.setItem('isReloadDrafts', true)
        window.opener = null;
        window.open("", "_self");
        window.close();
        this.$loading().close()
      }).catch(() => {
        if (typeof eval(window['submitErrorBack']) === 'function') {
          window['submitErrorBack'](this, data)
        }
        this.setButtonDisabled(false)
        this.$loading().close()
      })
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
</style>
