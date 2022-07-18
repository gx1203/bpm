<template>
  <el-card shadow="never" id="organization" class="card-reset">
    <div class="item-left">
         <tree-organization type='2' @confirm="handleNodeClick"/>
    </div>
    <div class="item-right" v-if="isShow">
        <department-ttaff-manage :treeData='treeData'/>
    </div>
  </el-card>
</template>
<script>
import departmentTtaffManage from './departmentTtaffManage/index'
import treeOrganization from "@/bpm/components/treeOrganization";
export default {
  name:'organizationManager',
  components: {
    departmentTtaffManage,
    treeOrganization
  },
  data () {
    return {
      isShow:false,
      treeData:{}
    }
  },
  mounted () {

  },
  methods: {
    handleNodeClick(data) {
      this.treeData = data
      this.isShow = true
    }
  },

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
  .el-tree {
    width: 100%;
    overflow: scroll;
  }

  .el-tree /deep/ .el-tree-node {
    display: table;
    min-width: 100%;
  }
</style>
