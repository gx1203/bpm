<template>
  <div>
    <flow-form
      :node="node"
      :tabsList="tabsList"
      @handleSubmit="handleSubmit"
      @handleSave="handleSave"
      :isNoStart="isNoStart"
    />
    <el-dialog
      :title="
        isDraftAndTemp ? $t('chooseSaveFormType') : $t('saveFormInformation')
      "
      :visible.sync="dialogVisible"
      width="450px"
    >
      <el-form>
        <el-form-item v-if="isDraftAndTemp">
          <el-radio-group v-model="saveType">
            <el-radio label="1" border>{{ $t('draftBox') }}</el-radio>
            <el-radio label="2" border>{{ $t('template') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="
            saveType === '1'
              ? $t('draftBoxName')
              : $t('template') + ' ' + $t('name2')
          "
          v-if="saveType"
        >
          <el-input clearable v-model="draftName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{
          $t('cancelAction')
        }}</el-button>
        <el-button type="primary" @click="saveForm">{{
          $t('confirm')
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FlowForm from '../../flow_form'
import { saveRelationalProcessIds } from '@/bpa/api/rulesCenter/handbookFiles'
import {
  getStartProcessForm,
  startProcess,
  saveDraft,
  saveStencil
} from '../../../api/flow'
import { createNamespacedHelpers } from 'vuex'

const { mapMutations } = createNamespacedHelpers('app')
export default {
  components: {
    FlowForm
  },
  data() {
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
      // isLoadData: '',
      // isLoad: '',
    }
  },
  mounted() {
    document.title = this.$route.query.name
    this.getStartProcessForm()
    this.isDraftAndTempHandel()
  },
  methods: {
    isDraftAndTempHandel() {
      if (this.$route.query.draftId) {
        this.saveType = '1'
        this.isDraftAndTemp = false
      } else if (this.$route.query.stencilId) {
        this.saveType = '2'
        this.isDraftAndTemp = false
      } else {
        this.isDraftAndTemp = true
      }
    },
    ...mapMutations([
      'setNodeData',
      'setBizData',
      'setButtonDisabled',
      'setTemporaryBizData'
    ]),
    getStartProcessForm() {
      this.$loading()
      getStartProcessForm(
        {
          bizId: this.$route.query.bizId || '',
          positionId: this.$route.query.pid || '',
          draftId: this.$route.query.draftId || '',
          processName: this.$route.query.processName,
          processNodeName: 'Start',
          projectName: this.$route.query.projectName,
          stencilId: this.$route.query.stencilId || '',
          userId: this.$store.state.basuser.user.id,
          docId: this.$route.query.docid
        },
        this.$route.query.listId,
        this.$route.query.modelid,
        this.$route.query.version,
        this.$route.query.docid
      )
        .then(rt => {
          this.$loading().close()
          this.node = rt.data
          // this.node.applyUserDto.department =  this.$route.query.dname
          this.tabsList = this.node.nodeTabLists.filter(item => {
            return item.istab === '1'
          })
          this.setNodeData(this.node)
          this.setBizData(this.node.bizData)
          this.setTemporaryBizData(this.node.bizData)

          this.isLoadData = true
        })
        .catch(() => {
          this.$loading().close()
        })
    },
    // load () {
    //   this.isLoad = true
    // },
    handleSave(data) {
      this.dialogVisible = true
      if (this.$route.query.draftId || this.$route.query.stencilId) {
        this.draftName = this.node.draftName
      } else {
        this.draftName = this.node.subject
      }
      this.data = data
    },
    saveForm() {
      if (this.saveType === '1') {
        if (!this.draftName) {
          this.$message.error('请输入草稿箱名称！！')
          return false
        }
        if (this.draftName && this.draftName.length > 200) {
          this.$message.error('草稿箱名称长度不能超过200个字符！！')
          return false
        }
        this.$loading()
        saveDraft({
          bizData: this.data,
          businessId: this.node.bizId,
          createPositionId: this.node.positionId,
          draftName: this.draftName,
          id: this.$route.query.draftId || '',
          processName: this.node.processName,
          subject: this.node.subject,
          userId: this.node.userId
        })
          .then(rt => {
            this.$message({
              // message: '保存草稿成功',
              message: this.$t('hintText.saveSuccessfully'),
              type: 'success'
            })
            localStorage.setItem('isReloadDrafts', true)
            window.opener = null
            // window.open("", "_self");
            // window.close();
            this.$loading().close()
            this.dialogVisible = false
          })
          .catch(() => {
            this.$loading().close()
          })
      } else {
        if (!this.draftName) {
          this.$message.error('请输入模板名称！！')
          return false
        }
        if (this.draftName && this.draftName.length > 200) {
          this.$message.error('模板名称长度不能超过200个字符！！')
          return
        }
        this.$loading()
        saveStencil({
          bizData: this.data,
          businessId: this.node.bizId,
          createPositionId: this.node.positionId,
          draftName: this.draftName,
          id: this.$route.query.stencilId || '',
          processName: this.node.processName,
          subject: this.node.subject,
          userId: this.node.userId
        })
          .then(rt => {
            this.$message({
              // message: '保存模板成功',
              message: this.$t('hintText.saveSuccessfully'),
              type: 'success'
            })
            localStorage.setItem('isReloadTemplate', true)
            window.opener = null
            window.open('', '_self')
            window.close()
            this.$loading().close()
            this.dialogVisible = false
          })
          .catch(() => {
            this.$loading().close()
          })
      }
    },
    handleSubmit(data) {
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
        priority: this.node.priority,
        userId: this.node.userId
      })
        .then(async rt => {
          // 制度发布成功后, 通知关联流程发布人
          const processPublishers = JSON.parse(
            localStorage.getItem('processPublishers')
          )
          console.log(processPublishers)
          if (processPublishers !== null && processPublishers.processid.length) {
            processPublishers.processid = processPublishers.processid.join(',')
            // 调用接口, 通知关联流程发布人
            const res = await saveRelationalProcessIds(processPublishers)
            console.log('🍓调用接口, 通知关联流程发布人', res)
          }
          let that = this
          this.$message({
            message: this.$t('hintText.submittedSuccessfully'),
            type: 'success',
            duration: 2000,
            onClose() {
              that.$router.back()
              that.setButtonDisabled(false)
            }
          })
          localStorage.setItem("isReload", true);
          localStorage.setItem('isReloadDrafts', true)
          window.opener = null
          window.open('', '_self')
          window.close()
          this.$loading().close()
        })
        .catch(() => {
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

<style type="text/scss" lang="scss" scoped></style>
