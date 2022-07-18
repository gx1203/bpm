<template>
  <el-card shadow="never" class="card-reset">
    <div class="item-left">
      <tree-organization @confirm="handleNodeClick" :useexport="true"/>
    </div>
    <div v-if="editableTabsValue" class="item-right">
      <el-tabs v-model="editableTabsValue" type="card">
        <el-tab-pane
          key="1"
          :label="$t('currentJobConfigurationProcessInformation')"
          name="1"
        >
          <flow-table v-if="editableTabsValue === '1'" :tree-data="treeData" :editable-tabs-value="editableTabsValue" />
        </el-tab-pane>
        <el-tab-pane
          key="2"
          :label="$t('employeesCurrentPosition')"
          name="2"
        >
          <employee-table v-if="editableTabsValue === '2'" :tree-data="treeData" :editable-tabs-value="editableTabsValue" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-card>
</template>
<script>
import flowTable from './flowTable'
import employeeTable from './employeeTable'
import treeOrganization from '@/bpm/components/treeOrganization'
export default {
  components: {
    flowTable,
    treeOrganization,
    employeeTable
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeData: {},
      editableTabsValue: '',
      editableTabs: [{
        title: this.$t('currentJobConfigurationProcessInformation'),
        name: '1'
      }, {
        title: this.$t('employeesCurrentPosition'),
        name: '2'
      }],
      ruleForm: {}
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.basuser.user
    }
  },
  methods: {
    handleNodeClick(data) {
      this.treeData = data
      if (data.type === '3') {
        this.editableTabsValue = '1'
      } else {
        this.editableTabsValue = ''
      }
    },
    handleCheckAllChange() {
      if (this.checkedCities.length === this.cities.length) {
        this.checkedCities = []
      } else {
        this.checkedCities = this.cities
      }
    },
    refreshData() {
    }
  }
}
</script>
<style lang="scss" scoped>
  .card-reset {
    ::v-deep > .el-card__body {
      display: flex;
    }
  }
  .item-left {
    width: 250px;
    height: 100%;
    margin-right: 20px;
  }
  .item-right {
    flex: 1;
    .table-header {
      position: relative;
      background: $bc2;
      display: flex;
      align-items: center;
      .all-check {
        position: absolute;
        left: 20px;
      }
    }
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
</style>
