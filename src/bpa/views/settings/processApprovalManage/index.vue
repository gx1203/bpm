<template>
  <div id="processAppovalManage">
    <el-table :data="processList" stripe class="main_tab">
      <el-table-column :label="number" type="index">
      </el-table-column>
      <el-table-column prop="name" :label="approvalName">
      </el-table-column>
      <el-table-column :label="directExecution">
        <template slot-scope="scope">
          <el-radio class="margin-t15 nolabel" v-model="scope.row.choosed" label="direct"
            @change="saveChagne(scope.$index)"></el-radio>
        </template>
      </el-table-column>
      <el-table-column :label="internalSystemApproval">
        <template slot-scope="scope">
          <el-radio class="margin-t15 nolabel" v-model="scope.row.choosed" label="bpm"
            @change="saveChagne(scope.$index)"></el-radio>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="externalSystemApproval">
        <template slot-scope="scope">
          <el-radio class="margin-t15 nolabel" v-model="scope.row.choosed" label="directbpm"
            @change="saveChagne(scope.$index)"></el-radio>
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
import { saveProcess, requireProcess } from '@/bpa/api/settings/processApprovalManage'
export default {
  data () {
    return {
      processList: [],
      number: this.$t("bpa_number"),
      approvalName: this.$t("approvalName"),
      directExecution: this.$t("directExecution"),
      internalSystemApproval: this.$t("internalSystemApproval"),
      externalSystemApproval: this.$t("externalSystemApproval"),
      modifyTheSuccess: this.$t("hintText.modifyTheSuccess"),
    }
  },
  mounted () {
    this.getProcesslists()
  },
  methods: {
    saveChagne (index) {
      saveProcess({
        'id': this.processList[index].id,
        'name': this.processList[index].name,
        'choosed': this.processList[index].choosed
      }).then(res => {
        if (!res) return false
        this.$message({
          type: 'success',
          message: this.modifyTheSuccess
        })
      })
    },
    getProcesslists () {
      requireProcess({
        'filters': []
      }).then(res => {
        if (!res) return false
        this.processList = res.list
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#processAppovalManage {
  box-sizing: border-box;
  height: 100%;
  padding: 10px 30px 10px 10px;
  overflow-x: hidden;
  .nolabel {
    /deep/ .el-radio__label {
      display: none;
    }
  }
}
</style>
