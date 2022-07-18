<template>
<div>
    <div class="tool-common-wrap">
        <!-- <div class="btn-wrap">
            <el-button type="primary" @click="refreshData">
             {{ $t('refresh') }}<i class="el-icon-refresh"/>
            </el-button>
        </div> -->
    </div>
    <el-tabs v-model="editableTabsValue" type="card">
        <el-tab-pane
        :key="index"
        v-for="(item, index) in editableTabs"
        :label="item.title"
        :name="item.name"
        >
        <mobile-node-config v-if="editableTabsValue === '1'"/>
        <approval-type v-if="editableTabsValue === '2'"/>
        </el-tab-pane>
    </el-tabs>
</div>
</template>

<script>
import mobileNodeConfig from './mobileNodeConfig'
import approvalType from './approvalType'

export default {
  components :{
    mobileNodeConfig,
    approvalType
  },
  data() {
    return {
      editableTabsValue: '1',
      editableTabs: [{
          title: this.$t('mobileNodeConfiguration'),
          name: '1',
        }
      //   , {
      //     title: '审批类型配置',
      //     name: '2',
      // }
      ]
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.basuser.user
    },
    key() {
      return this.$route.fullPath
    }
  },
  methods:{
    refreshData () {
      this.$emit('refreshData')
    },
  }
}
</script>

<style lang="scss" scoped>
  .item-left {
    float: left;
    width: 20%;
  }
  .item-right {
    float: right;
    width: 78%;
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
</style>
