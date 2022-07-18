<template>
  <el-card shadow="never" class="container card-padding0">
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <el-tab-pane label="流程文件" name="latestProcess">
        <process-community-table
          ref="processCommunityTable"
        ></process-community-table>
      </el-tab-pane>
      <el-tab-pane label="制度文件" name="latestSystem">
        <system-community-table
          ref="systemCommunityTable"
        ></system-community-table>
      </el-tab-pane>
    </el-tabs>
    <div class="more" @click="toMore">
      {{ $t("toViewMore") }}<i class="el-icon-arrow-right" />
    </div>
  </el-card>
</template>

<script>
import ProcessCommunityTable from "./components/ProcessCommunityTable";
import SystemCommunityTable from "./components/SystemCommunityTable";

export default {
  components: {
    ProcessCommunityTable,
    SystemCommunityTable
  },
  data() {
    return {
      activeName: "latestProcess"
    };
  },
  methods: {
    toMore() {
      if (this.activeName === "latestProcess") {
        this.$router.push('/processCenter/processModelCenter/processCommunity')
        return
      }
      this.$router.push('/managementElements/system/ruleView')
    },
    tabClick(tab) {
      this.activeName = tab.name;
    }
    
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 365px;
  margin: 0 !important;
  position: relative;

  /deep/ .el-tabs__item {
    color: #8A8C99 !important;
  }

  /deep/ .el-tabs__item.is-active {
    color: #2d42af !important;
  }
}

.el-tabs  {
  /deep/ .el-tabs__header {
    margin-bottom: 10px;
  }
}

.el-tabs {
  /deep/ .el-tabs__header {
    .el-tabs__nav-wrap {
      &::after {
        height: 1px;
      }
    }
    .el-tabs__nav-scroll {
      padding: 0 14px;
      
    }
    .el-tabs__item {
      height: 50px;
      line-height: 50px;
      font-weight: bold;
      font-size: 14px;
    }
  }
}

$km: 16px;

/deep/ .card-list {
  li {
    padding: 0 $km;
    display: flex;
    align-items: center;
    .card-content {
      flex: 1;
      height: 50px;
      line-height: 50px;
      overflow: hidden;
      display: flex;
      align-items: center;
      .card-detail {
        flex: 1;
        width: 55%;
        p {
          display: inline-block;
          color: #151934;
          font-size: 13px;
          font-weight: 400;
          max-width: calc(100% - 200px);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          vertical-align: middle;
          cursor: pointer;
          &:hover {
            color: #2d42af;
            text-decoration: underline;
          }
        }
        span {
          margin-left: 12px;
        }
      }
      .card-tool {
        flex: 1;
        text-align: right;
        > span {
          margin-left: 20px;
          color: #9898A4;
        }
        .el-button {
          margin-left: 20px;
          padding-left: 20px;
          padding-right: 20px;
        }
      }
    }
  }
}

/deep/ .tag {
  display: inline-block;
  line-height: 20px;
  color: #293D9E;
  padding: 0 12px;
  border-radius: 4px;
  font-size: 12px;
  background: #E5EBFF;
}
/deep/.tagRed {
  display: inline-block;
  line-height: 16px;
  color: #ffffff;
  padding: 0 8px;
  border-radius: 8px;
  font-size: 12px;
  background: #F33F3F;
  font-weight: normal;
}
.more {
  position: absolute;
  right: $km;
  top: 15px;
}
</style>
