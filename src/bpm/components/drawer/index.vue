<template>
  <el-drawer
    :title="$t('settingInfo')"
    :visible.sync="usersVisible"
    direction="ltr"
    :before-close="handleClose"
    :class="themeColor"
    id="drawer"
  >
    <div class="padding-20">
      <el-tabs v-model="activeName" type="card" :stretch="true">
        <el-tab-pane :label="$t('setTheme')" name="theme">
          <theme v-if="activeName === 'theme'" />
        </el-tab-pane>
        <el-tab-pane :label="$t('setCommonApprovalNotes')" name="approve">
          <approval-records v-if="activeName==='approve'" />
        </el-tab-pane>
        <!--<el-tab-pane label="国际化" name="global">-->
          <!--<global v-if="activeName==='global'" />-->
        <!--</el-tab-pane>-->
      </el-tabs>
    </div>
  </el-drawer>
</template>
<script>
import approvalRecords from "../approvalRecords";
import theme from "../theme";
import global from "../global";
export default {
  name: "drawer",
  components: {
    theme,
    approvalRecords
  },
  data() {
    return {
      usersVisible: false,
      activeName: "theme",
      approvalRemarkList: [],
      themeColor: ""
    };
  },
  props: {
    value: {
      type: Boolean
    }
  },
  watch: {
    value(val) {
      this.usersVisible = val;
      this.activeName = "theme";
    },
    usersVisible(val) {
      this.$emit("input", val);
    }
  },
  mounted() {
    this.themeColor = this.$store.state.app.themeColor;
  },
  methods: {
    handleClose() {
      this.usersVisible = false;
      this.activeName = "";
    }
  }
};
</script>
<style lang="scss" scoped>
#drawer {
  .padding-20 {
    padding: 20px;
  }
}
</style>
<style lang="scss">
#drawer {
  #el-drawer__title {
    span {
      font-size: 14px;
      color: #333;
      font-weight: bold;
    }
  }
  :focus {
    outline: 0;
  }
}
</style>
