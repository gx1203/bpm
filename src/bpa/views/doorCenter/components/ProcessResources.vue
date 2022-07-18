<template>
  <el-card shadow="never" class="card-padding0 container">
    <div class="card-header margin-b10">
      <div class="title">
        <b>资料中心</b>
      </div>
      <div class="more" @click="toMore">
        {{ $t("toViewMore") }}<i class="el-icon-arrow-right" />
      </div>
    </div>
    <ul v-if="currentList.length > 0" class="card-list">
      <li v-for="(item, index) in currentList" :key="index">
        <div class="card-content">
          <div class="card-detail">
            <p>{{ item.titlename }}</p>
          </div>
          <div class="card-tool">
            <span>{{ item.createon }}</span>
          </div>
        </div>
      </li>
    </ul>
    <div v-else class="noData">
      <img :src="nothingImg" alt="" />
      <p>{{ $t("noData") }}</p>
    </div>
  </el-card>
</template>

<script>
import nothingImg from "@/assets/img/nothing.png";
import { queryProcessManagementCopy } from "@/bpa/api/settings/processManagementSpecification";

export default {
  data() {
    return {
      nothingImg: nothingImg,
      activeName: "processManageRules",
      currentList: []
    };
  },
  mounted() {
    this.getManagementSpecifications()
  },
  methods: {
    toMore() {
      this.$router.push("/doorCenter/processManagementSpecification");
    },
    // 获取流程管理规范
    async getManagementSpecifications() {
      const queryData = {
        attr: {},
        filters: [],
        logic: "or",
        orderby: "createon",
        pageNum: 1,
        pageSize: 6,
        sort: "desc"
      };
      const res = await queryProcessManagementCopy(queryData);
      console.log("流程管理规范", res);
      this.currentList = res.list;
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 365px;
  margin: 0 !important;
  /deep/ .card-list {
    li {
      padding: 0 16px;
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
          width: 50%;
          p {
            display: inline-block;
            color: #151934;
            font-size: 13px;
            font-weight: 400;
            max-width: 100%;
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
}
.noData {
  line-height: 30px;
  color: #999999;
  text-align: center;
  font-size: 14px;
  margin: 100px 0;
  img {
    width: 180px;
  }
}
</style>
