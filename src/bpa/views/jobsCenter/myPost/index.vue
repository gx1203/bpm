<template>
  <div id="responsible" class="pageWrap">
    <div class="listContent w100">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="pandect" name="pandect">
          <pandect v-if="activeName === 'pandect'" @confirm="confirmId" />
        </el-tab-pane>
        <el-tab-pane :label="jobDuties" name="station">
          <station v-if="activeName === 'station'" :org-ids="orgId" />
        </el-tab-pane>
        <el-tab-pane :label="risk" name="risk">
          <risk v-if="activeName === 'risk'" :org-ids="orgId" />
        </el-tab-pane>
        <el-tab-pane label="RACI" name="raci">
          <raci v-if="activeName === 'raci'" :org-ids="orgId" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import pandect from "./components/pandect.vue";
import station from "./components/station.vue";
import risk from "./components/risk.vue";
import raci from "./components/raci.vue";
import { getstation } from "@/bpa/api/jobsCenter";
export default {
  components: {
    pandect,
    station,
    risk,
    raci,
  },
  data() {
    return {
      data: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1",
                },
                {
                  id: 10,
                  label: "三级 1-1-2",
                },
              ],
            },
          ],
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1",
            },
            {
              id: 6,
              label: "二级 2-2",
            },
          ],
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1",
            },
            {
              id: 8,
              label: "二级 3-2",
            },
          ],
        },
      ],
      // 右侧tab默认的选中
      activeName: "pandect",
      orgId: "",
      pandect: this.$t("pandect"),
      jobDuties: this.$t("jobDuties"),
      risk: this.$t("risk"),
    };
  },
  mounted() {},
  beforeRouteEnter(to, from, next) {
    if (from.path == "/overView") {
      next((vm) => {
        vm.getData();
      });
    } else {
      next();
    }
  },
  computed: {
    userid() {
      return JSON.parse(localStorage.getItem("portalCurrentUserInfo") || "{}")
        .empuid;
    },
  },
  methods: {
    confirmId(item) {
      this.orgId = item;
      console.log(this.orgId);
    },
    handleClick(tab, event) {
      const self = this;
      if (tab.name === "organization") {
        self.getMenuOrgList();
      } else if (tab.name === "role") {
        self.getMenuRoleList();
      }
    },
    getData() {
      getstation(this.userid).then((res) => {
        if (!res) return false;
        const params = res
          .map((item) => {
            return item.id;
          })
          .join(",");
        this.orgId = params;
        this.activeName = "station";
      });
    },
  },
};
</script>

<style scoped lang="scss">
#responsible {
  background-color: white;
  /deep/ .el-tabs__header {
    margin: 0;
  }
}
/deep/ .el-tabs__item {
  font-size: 16px !important;
}
</style>
