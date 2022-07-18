<template>
  <el-dialog
    title="制度发布提示"
    :visible="publishDialogVisible"
    width="60%"
    @close="handleClose"
  >
    <el-table
      v-if="relationalProcessList.length"
      :data="relationalProcessList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column prop="code" label="流程框架编码" />
      <el-table-column prop="name" label="流程名称" />
      <el-table-column prop="bponame" label="流程责任人" />
      <el-table-column prop="orgname" label="主责部门" />
      <el-table-column prop="version" label="版本" />
      <el-table-column label="生效日期">
        <template slot-scope="{ row }">
          <div>
            {{ row.effectiveon | formatDate }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="{ row }">
          <div>
            {{ row.state | designState }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-alert
      v-else
      title="该制度没有关联流程, 请点击 '确定' 按钮继续发布."
      type="warning"
      :closable="false"
    ></el-alert>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getRelationalProcessList } from '@/bpa/api/rulesCenter/handbookFiles'
export default {
  created() {
    localStorage.removeItem('processPublishers')
  },
  props: {
    publishDialogVisible: {
      type: Boolean,
      default: false
    },
    currentPublishData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      selectedRows: '', // 选中的流程列表
      relationalProcessList: [] // 制度关联的流程列表
    }
  },
  methods: {
    async getRelationalProcessList(docId) {
      this.currentDocId = docId
      const result = await getRelationalProcessList(docId)
      this.relationalProcessList = result
    },
    handleClose() {
      this.$emit('update:publishDialogVisible', false)
    },
    handleSelectionChange(val) {
      console.log(val)
      this.selectedRows = val.map(item => item.id)
    },
    confirm() {
      // 把选中的数据保存的浏览器, 制度发布后, 通知流程发布人
      const processPublishers = {
        docId: this.currentDocId,
        processid: this.selectedRows
      }
      localStorage.setItem(
        'processPublishers',
        JSON.stringify(processPublishers)
      )
      this.$emit('confirmPublishDialog', this.currentPublishData)
      this.handleClose()
    }
  }
}
</script>
<style></style>
