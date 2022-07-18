<template>
  <el-card shadow="never">
    <div v-if="this.$route.query.type === 'edit' || type==='edit'" class="title">
      {{ $t('processRuleManagement') }}
    </div>
    <div v-if="this.$route.query.type === 'look' || type==='look'" class="title">
      {{ $t('businessRulesRecycleBin') }}
    </div>
    <div class="item-left">
      <tree-org :is-ref="isRef" :type="type" @confirm="handleNodeClick" @removeOrg="isTableShow=true;isBusinessRule=false" />
    </div>
    <div class="item-right">
      <business-table v-show="isTableShow" :is-ref="isRef" :type="type" :tree-data="treeData" @confirm="refTree" :processData="processData" />
      <business-rule v-show="isBusinessRule" :tree-data="treeData" :type="type" :processData="processData" />
    </div>
  </el-card>
</template>

<script>
import treeOrg from './treeOrg'
import businessTable from './businessTable'
import businessRule from './businessRule'
import { createNamespacedHelpers } from "vuex";
const { mapMutations } = createNamespacedHelpers("processDesign");
export default {
  name: 'ConfinBusinessRule',
  components: {
    treeOrg,
    businessRule,
    businessTable
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    processData: {
      type: Object,
      default:()=>{}
    }
  },
  data() {
    return {
      isTableShow: false,
      isBusinessRule: false,
      treeData: {},
      isRef: false
    }
  },
  mounted() {
    if (this.$route.query.brid) {
      this.isBusinessRule = this.$route.query.isBusinessRule
      this.treeData = {
        id: this.$route.query.brid,
        brid: this.$route.query.brid,
        processId: this.$route.query.processId,
        type: '2'
      }
      this.setProcessData({
        id: this.$route.query.processId
      })
    }
  },
  methods: {
    ...mapMutations(["setProcessData"]),
    handleNodeClick(data) {
      console.log(data)
      this.treeData = data
      if (data.type === '1') {
        this.isTableShow = true
        this.isBusinessRule = false
      } else {
        this.isTableShow = false
        this.isBusinessRule = true
      }
    },
    refTree(data) {
      this.isRef = data
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  color: #2d42af;
  font-size: 14px;
  font-weight: 600;
  border-bottom: 2px solid;
  padding-bottom: 10px;
  margin-bottom: 10px;
}
.item-left {
  float: left;
  width: 20%;
}
.w100 {
  width: 100%;
}
.item-right {
  float: right;
  width: 78%;
  overflow: auto;
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
