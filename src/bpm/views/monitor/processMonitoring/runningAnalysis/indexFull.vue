<template>
  <el-card shadow="never" style="background: transparent;height: 80vh">
    <div class="tool-common-wrap bpaAnalysis">

      <div class="btn-wrap">
<!--        <el-button type="primary" @click="isViewDialog=true">-->
<!--          {{ $t('selectProcess') }}-->
<!--        </el-button>-->
<!--        <span class="choose-process-title">{{ $t('selectProcess') }}</span>-->

<!--        <el-popover >-->
<!--          <BasProcessTree showView="3" @confirm="handleNodeClick" />-->
<!--          <div slot="reference" class="choose-process" @click="isViewDialog=true"> {{ checkData.modelname? checkData.modelname:'点击选择'}} </div>-->
<!--        </el-popover>-->


        <el-button type="primary" @click="getDepartment();checkData={}">
          {{ $t('refresh') }}
          <!--<i class="el-icon-refresh"/>-->
        </el-button>
      </div>
    </div>

    <div class="analyse-content">
      <div class="tree-list">
      <el-scrollbar style="height: 100%;">
        <BasProcessTree style="margin:0 10px" showView="3" @confirm="handleNodeClick" />
      </el-scrollbar>
      </div>
      <div v-if="checkData.type === '1'" class="item-right chartsBg1">
        <el-tabs v-model="editableTabsValue" type="card" >
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
    </div>



<!--    <el-dialog :visible.sync="isViewDialog" :title="$t('selectProcess')">-->
<!--      <BasProcessTree showView="3" @confirm="handleNodeClick" />-->
<!--      <span slot="footer" class="dialog-footer">-->
<!--        <el-button type="primary" @click="isViewDialog=false">{{$t('confirm')}}</el-button>-->
<!--      </span>-->
<!--    </el-dialog>-->


  </el-card>
</template>

<script>
import Vue from 'vue'
import BasProcessTree from 'bas-component'
Vue.use(BasProcessTree)
import twistingNumber from './cyber/twistingNumber'
import twistingTime from './cyber/twistingTime'
import deadlineEchar from './cyber/deadlineEchar'
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
      isViewDialog:false,
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
      // console.log('data',data);
      // console.log('editableTabsValue',this.editableTabsValue);
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
.choose-process-title {
  color: #0de8f7;
  font-size: 14px;
}

.analyse-content {
  display: flex;
  flex-direction: row;
  min-height: 50vh;
  justify-content: space-between;
  .tree-list {
    //background: #2e2e2e;
    padding: 10px;
    border-radius: 3px;
    height: 70vh;
    margin-right: 10px;

    /deep/.el-tree {
      background: none !important;

      .is-current {
        &>.el-tree-node__content {
          background: none !important;
          //border: #80bae8 1px solid;
          border-radius: 4px;
          box-shadow: 0px 0px 10px #aacae7 inset;
        }
      }
      .el-tree-node__content {
        &:hover, &:focus{
          background: none !important;
          //border: #80bae8 1px solid;
          border-radius: 4px;
          box-shadow: 0px 0px 10px #98c8ef inset;
        }

      }
      .el-tree-node:focus > .el-tree-node__content {
        background: none;
      }
    }


    /deep/.el-scrollbar__wrap{
      overflow-x: hidden;
    }
  }
}
.choose-process {
  display: inline-block;
  margin: 0 10px 0 5px;
  border: #2d42af 1px solid;
  color: #fff;
  padding:0 10px;
  cursor: pointer;
}
.chartsBg1 {
  height: 540px;
  position: relative;
  background: url("../../../../../bpa/assets/img/qietu/zdlcbzh-cd.png") no-repeat;
  background-size: 100% 100%;
  padding: 24px 36px;
  .operationEcharts {
    padding: 10px 32px;
  }
}

.item-left {
  //float: left;
  //width: 20%;
}
.item-right {
  //float: right;
  //width: 78%;
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

  /deep/.el-tabs__nav{
    background: transparent;
    //border: #0de8f7 1px solid;
    border: none;
    border-radius: 0;
    margin-bottom: 5px;

    .el-tabs__item {
      height: 30px;
      background: transparent;
      border-radius: 0;
      border: #0de8f7 1px solid;
      line-height: 30px;
      color: white;
      &.is-active {
        color: #6b7ed2;
        border-bottom-color:#0de8f7 !important ;
      }
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
<!--<style >-->
<!--/*这里会影响全局的el-popover*/-->
<!-- .el-popover{-->
<!--  max-height: 350px;-->
<!--  overflow: auto;-->
<!--}-->
<!--</style>-->
