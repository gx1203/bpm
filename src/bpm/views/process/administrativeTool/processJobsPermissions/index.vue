<template>
  <!-- <el-card shadow="never"> -->
    <!-- <div class="item-left"> -->
      <!-- <treeProcessFlow ref="tree" type="1" @confirm="handleNodeClick" /> -->
      <!-- <BasProcessTree showView="1" @confirm="handleNodeClick" />
    </div>
    <div class="item-right" v-if="isShow" v-loading="loading">
      <my-table :treeData="treeData" ref="table"></my-table>
    </div>
  </el-card> -->
  <el-card shadow="never" class="card-reset">
    <el-tabs v-model="active" type="card" class='topCustom card-reset-inner'>
      <el-tab-pane :label="$t('processinitiationauthority')" name="organization" class="process-start">
        <div class="item-left">
          <!-- <treeProcessFlow ref="tree" type="1" @confirm="handleNodeClick" /> -->
          <BasProcessTree showView="1" @confirm="handleNodeClick" />
        </div>
        <div class="item-right" v-if="isShow" v-loading="loading">
          <my-table :treeData="treeData" ref="table"></my-table>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('roleprocesspermissions')" name="function">
        <role-process-permissions/>
        <!-- <function-permission ref="functionPermission"></function-permission> -->
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>
<script>
// import treeProcessFlow from "@/bpm/components/treeProcessFlow";
import Vue from 'vue'
import BasProcessTree from 'bas-component'
import roleProcessPermissions from '../roleProcessPermissions'
Vue.use(BasProcessTree)
import myTable from "./table"
export default {
  name: "processJobsPermissions",
  components: {
    // treeProcessFlow,
    myTable,
    roleProcessPermissions
  },
  data () {
    return {
      loading: false,
      num: '5',
      isShow: false,
      treeData: {},
      active: 'organization'
    };
  },
  mounted () {
    if (this.$route.query.type) {
      this.num = this.$route.query.type;
    } else {
      this.num = "5";
    }
  },
  methods: {
    handleNodeClick (data) {
      this.treeData = data;
      if (data.type === "1") {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.process-version-container {
  box-sizing: border-box;
  height: 100%;
  ::v-deep .el-card__body {
    padding: 10px 30px 10px 10px !important;
  }
}
.process-start {
  padding-top: 10px;
  display: flex;
}
.item-left {
  box-sizing: border-box;
  width: 250px;
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
  .w100 {
    width: 100%;
  }
  ::v-deep .el-card__body {
    padding: 0px !important;
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
