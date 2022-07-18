<template>
  <div v-loading="load" class="flow-node-container">
    <div class="tool-common-wrap">
      <div class="btn-wrap">
        <el-button type="primary" @click="refreshData">
          {{ $t('refresh') }}
          <!--<i class="el-icon-refresh"/>-->
        </el-button>
      </div>
    </div>
    <el-tabs v-model="editableTabsValue" type="card">
      <el-tab-pane v-for="(item, index) in editableTabs" v-if="item.show" :key="index" :label="item.title"
        :name="item.name">
        <modify-flow-node v-if="editableTabsValue === '1'" :content="content" :tree-data="treeData"
          @confirm="getNode" />
        <child-nodes @treeRefresh="treeRefresh" v-if="editableTabsValue === '2'" :content="content1" :tree-data="treeData" />
        <approve-type v-if="editableTabsValue === '3'" :content="content2" :tree-data="treeData" />
        <allocation-tab v-if="editableTabsValue === '4'" :content="content3" :tree-data="treeData" />
        <reminderConfig v-if="editableTabsValue === '5'" :content="content4" :treeData="treeData" />
        <rigid-soft-node v-if="editableTabsValue === '6'" :content="content5"  :treeData="treeData"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import modifyFlowNode from './modifyFlowNode'
import childNodes from './childNodes'
import approveType from './approveType'
import allocationTab from './allocationTab'
import reminderConfig from './reminderConfig'
import rigidSoftNode from './rigidSoftNode'

import { getProcessNodeData, getProcessNodeTab, getProcessApproval } from '@/bpm/api/process/processModeling/classificationModel'
export default {
  components: {
    modifyFlowNode,
    allocationTab,
    approveType,
    childNodes,
    reminderConfig,
    rigidSoftNode
  },
  props: {
    treeData: {
      type: Object
    }
  },
  data () {
    return {
      load: false,
      editableTabsValue: '1',
      editableTabs: [
        {
          title: this.$t('changeNodeInformation'),
          name: '1'
        },
        {
          title: this.$t('gameteNodeTabPage'),
          name: '2'
        },
        {
          title: this.$t('approvalTypeConfiguration'),
          name: '3'
        },
        {
          title: this.$t('reminderConfiguration'),
          name: '5'
        },
        // {
        //   title: this.$t('rigidSoftNodeConfiguration'),
        //   name: '6'
        // },
        //  {
        //   title: '分配字段tab页',
        //   name: '4'
        // }
      ],
      content: {},
      content1: {},
      content2: {},
      content3: {},
      content4: {},
      content5: {},
      isNameStart: false
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.basuser.user
    },
    key () {
      return this.$route.fullPath
    }
  },
  watch: {
    editableTabsValue (val) {
      console.log(val)
      if (val === '1') {
        this.getNode()
      } else if (val === '2') {
        this.getNodeTab()
      } else if (val === '3') {
        this.getApprovalData()
      } else if (val === '4') {
      }else if (val === '6') {
        this.getNode()
      }
    },
    treeData (val) {
      this.editableTabsValue = '1'
      this.isShow()
      this.getNode()
    }
  },
  mounted () {
    this.isShow()
    this.getNode()
  },
  methods: {
    treeRefresh() {
      this.$emit("treeRefresh");
    },
    isShow () {
      console.log(this.treeData)
      this.editableTabs[0].show = true
      this.editableTabs[3].show = true
      this.editableTabs[1].show = this.treeData.name !== 'End'
      this.editableTabs[2].show = this.treeData.name !== 'Start' && this.treeData.name !== 'End'
      if (this.treeData.name === 'Start') {
        this.editableTabs[1].show = true
      } else {
        this.editableTabs[1].show = false
      }
      console.log(this.editableTabs)
      // this.editableTabs[3].show = this.treeData.name !== 'End'
      // this.editableTabs[4].show = true
    },
    getApprovalData () {
      this.load = true
      getProcessApproval({
        'processNodeId': this.treeData.id,
        version: this.treeData.version
      }).then((rt) => {
        this.load = false
        this.content2 = rt.data
      }).catch((er) => {
        this.load = false
      })
    },
    getNode () {
      this.load = true
      getProcessNodeData({
        'id': this.treeData.id,
        'pid': this.treeData.pid,
        'type': this.treeData.type,
        'version': this.treeData.version
      }).then((rt) => {
        this.load = false
        rt.data.textingchecked = rt.data.textingchecked ? rt.data.textingchecked.split(',') : []
        this.content = rt.data
        this.content4 = Object.assign({}, rt.data)
        this.content5 = Object.assign({}, rt.data)
      }).catch((er) => {
        this.load = false
      })
    },
    getNodeTab () {
      this.load = true
      getProcessNodeTab({
        'processNodeId': this.treeData.id,
        'tabpid': '',
        version: this.treeData.version
      }).then((rt) => {
        this.load = false
        this.content1 = rt.data
        this.content1.processNodeId = this.treeData.id
      }).catch((er) => {
        this.load = false
      })
    },
    refreshData () {
      if (this.editableTabsValue === '1') {
        this.getNode()
      } else if (this.editableTabsValue === '2') {
        this.getNodeTab()
      } else if (this.editableTabsValue === '3') {
        this.getApprovalData()
      } else if (this.editableTabsValue === '4') {
      }else if (this.editableTabsValue === '6'){
        this.getNode()
      }
    },
    handleNodeClick (data) {
    }
  }
}
</script>

<style lang="scss" scoped>
.flow-node-container {
  height: 100%;
  overflow: auto;
}
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
