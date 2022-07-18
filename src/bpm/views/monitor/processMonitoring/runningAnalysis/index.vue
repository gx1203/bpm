<template>
  <el-card shadow="never">
    <div class="tool-common-wrap">
      <div class="btn-wrap">
        <el-button type="primary" @click="getDepartment();checkData={}">
          {{ $t('refresh') }}
          <!--<i class="el-icon-refresh"/>-->
        </el-button>
      </div>
    </div>
    <div class="item-left">
      <!-- <el-tree class="elTree" ref="tree" style="height:calc(100% - 28px);overflow: auto;" :props="props"
        :data="treeData" :load="loadNode" :expand-on-click-node="false" lazy node-key="ID"
        @node-click="handleNodeClick">
        <span slot-scope="{ node,data }" class="custom-tree-node">
          <i v-if="data.type === '0'" class="iconfont icon-moxing___" />
          <i v-else-if="data.type === '1'" class="iconfont icon-liucheng" />
          <i v-else-if="data.type === '2'" class="iconfont icon-jiedianbangzhu" />
          <i v-else class="iconfont icon-baocunbuju" />
          <span :title="data.name+'('+data.num+')'">{{ data.name }}({{ data.num }})</span>
        </span>
      </el-tree> -->
      <BasProcessTree showView="3" @confirm="handleNodeClick" />
    </div>
    <div v-if="checkData.type === '1'" class="item-right">
      <el-tabs v-model="editableTabsValue" type="card">
        <el-tab-pane :label="$t('transferNumber')" name="1">
          <twisting-number v-if="editableTabsValue === '1'" :item="checkData" />
        </el-tab-pane>
        <el-tab-pane :label="$t('circulationTime')" name="2">
          <twisting-time v-if="editableTabsValue === '2'" :item="checkData" />
        </el-tab-pane>
        <el-tab-pane :label="$t('deadline')" name="3">
          <deadline-echar v-if="editableTabsValue === '3'" :item="checkData" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-card>
</template>

<script>
import Vue from 'vue'
import BasProcessTree from 'bas-component'
Vue.use(BasProcessTree)
import twistingNumber from './twistingNumber'
import twistingTime from './twistingTime'
import deadlineEchar from './deadlineEchar'
import { getMonitorTree } from '@/bpm/api/monitor/index.js'
export default {
  name: 'RunningAnalysis',
  components: {
    twistingNumber,
    twistingTime,
    deadlineEchar
  },
  data () {
    return {
      props: {
        label: 'name',
        isLeaf: 'isParent'
      },
      treeData: [],
      checkData: {},
      editableTabsValue: '1',
      ruleForm: {}
    }
  },
  mounted () {
    this.getDepartment()
    if(this.$route.query.processname){
      let data={id:"667261671802425344"}
      this.handleNodeClick (data)
      this.editableTabsValue='2'
    }
  },
  methods: {
    getDepartment () {
      getMonitorTree(0).then((rt) => {
        rt.data.forEach(item => {
          item.isParent = item.isParent === 'N'
        })
        this.treeData = rt.data
      }).catch((er) => {
        console.log(er)
      })
    },
    loadNode (node, resolve) {
      if (node.level > 0) {
        getMonitorTree(node.data.id).then((rt) => {
          rt.data.forEach(item => {
            item.isParent = item.isParent === 'N'
          })
          resolve(rt.data)
        }).catch((er) => {
          console.log(er)
        })
      }
    },
    handleNodeClick (data) {
      console.log('data',data);
      console.log('editableTabsValue',this.editableTabsValue);
      this.checkData = data
    },
    handleCheckAllChange () {
      if (this.checkedCities.length === this.cities.length) {
        this.checkedCities = []
      } else {
        this.checkedCities = this.cities
      }
    }
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
