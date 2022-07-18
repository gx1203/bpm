<template>
  <el-card shadow="never" class="card-reset">
    <el-tabs v-model="active" type="card" class='topCustom'>
      <el-tab-pane :label="$t('pendingChanges')" name="organization">
        <agents-change/>
      </el-tab-pane>
      <el-tab-pane :label="$t('jobChange')" name="function">
        <jobs-change/>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>
<script>
import agentsChange from '@/bpm/views/process/administrativeTool/agentsChange';
import jobsChange from '@/bpm/views/process/administrativeTool/jobsChange';
export default {
  components: {
    agentsChange,
    jobsChange
  },
  data () {
    return {
      active: 'organization',
      commonTitle: '功能权限管理'
    };
  },
  mounted () { },
  methods: {
    rest () {
      if (this.active == 'organization') {
        this.$refs.organizationAuthority.rest();
      } else {
        this.$refs.functionPermission.rest();
      }
    }
  }
};
</script>

<style scoped>
/* .topCustom {
  background: #f5f5f5;
} */

.urge {
  color: #ea3c40;
  font-weight: 600;
}
.all-check {
  position: absolute;
  left: 10px;
  top: 10px;
}

.el-tabs {
  /* margin-top: 49px; */
}
</style>
<style lang="scss">
#toDoTasks {
  .tag {
    .el-tag {
      position: relative;
      cursor: pointer;
      vertical-align: bottom;
      height: 33px;
      line-height: 33px;
      margin: 0;
      padding: 0 24px;
      border: 1px solid #e0e0e0;
      border-left: none;
      border-radius: 0;
      font-size: 14px;
      font-weight: 600;
      color: $tc1;
      background-color: #f0f0f0;
      cursor: pointer;
      /deep/ .el-icon-close {
        width: 20px;
        height: 20px;
        line-height: 21px;
        text-align: center;
        font-size: 20px;
        color: #717171;
        &:hover {
          background-color: transparent;
        }
      }
    }
    .el-tag.active {
      position: relative;
      background-color: #ffffff;
      border-bottom-color: transparent;
      &:before {
        content: "";
        position: absolute;
        top: -1px;
        left: 0;
        right: 0;
        height: 2px;
        background-color: $active-color;
      }
    }
    &:first-child .el-tag {
      border-left: 1px solid #e0e0e0;
    }
    &:first-child .el-tag.active {
      border-left-color: transparent;
    }
    .el-divider--horizontal {
      margin: 5px 0;
    }
  }
}
.el-tabs--card > .el-tabs__header {
  /*background: #fff;*/
  margin: 0;
  border-bottom: 1px solid $active-color !important;
  .el-tabs__nav {
    border-radius: 6px 6px 0 0;
    /*以下两句样式是为了处理通威标签页样式*/
    background-color: white;
    border-bottom: 1px solid $active-color !important;
  }
  .el-tabs__item {
    padding: 0 28px !important;
  }
  .el-tabs__item.is-active {
    color: #fff;
    background: $active-color;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
    /*为了处理通威标签页样式*/
    border-bottom-color: $active-color !important;
  }
}
</style>
