<template>
  <div id="nodeAlias">
    <el-form v-loading="loading">
      <div v-if="$store.state.app.tableStyle ==='default'">
        <el-row type="flex" class="header" align="middle">
          <el-col :span="4">{{ $t('processNode') }}</el-col>
          <el-col :span="4" class>
            {{ $t('nodeAlias') }}
          </el-col>
          <el-col :span="16">{{ $t('organization3') }}</el-col>
        </el-row>
        <el-row
          type="flex"
          class="border-b"
          align="middle"
          v-for="(item, index) in ruleForm"
          :key="item.id"
        >
          <el-col :span="4">
            {{item.activityname}}
          </el-col>
          <el-col :span="4">
            <el-input clearable class="calculative" type="type" v-model="item.nodealias"></el-input>
          </el-col>
          <el-col :span="16">
            <node-alias-tree :treeData="treeNode" @confirm="handleNodeClick($event,index)" :items="item.orgnodeid" />
          </el-col>
        </el-row>
      </div>
      <div v-else>
        <el-table
          :data="ruleForm"
          class="margin-t10"
          stripe
          :header-cell-style="{background: '#E1EAFD !important'}"
          highlight-current-row
          current-row-key="id"
        >
          <el-table-column :label="$t('processNode')" show-overflow-tooltip prop="activityname" width="140">
          </el-table-column>
          <el-table-column :label="$t('nodeAlias')" show-overflow-tooltip prop="nodealias" width="140">
            <template slot-scope="scope">
              <el-input clearable class="calculative" type="type" v-model="scope.row.nodealias"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('organization3')" show-overflow-tooltip prop="sort">
            <template slot-scope="scope">
              <node-alias-tree :treeData="treeNode" @confirm="handleNodeClick($event, scope.$index)" :items="scope.row.orgnodeid" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <div class="text-r">
      <el-button type="primary" @click="subHandle">{{ $t('submit') }}</el-button>
    </div>
  </div>
</template>
<script>
import { now } from 'moment-mini'
import nodeAliasTree from './nodeAliasTree'
import {
  saveNodeAlias,
  getNodeAlias
} from '@/bpm/api/process/processModeling/institutional_framework'
import { getAllRootTree } from '@/bpm/api/configManage/institutionalFramework/organization.js'

export default {
  name: 'nodeAlias',
  computed: {},
  components: {
    nodeAliasTree
  },
  data () {
    return {
      loading: false,
      // radio: "",
      dialogVisible: false,
      ruleForm: [],
      treeNode: []
    }
  },
  props: {
    treeData: {
      type: Object
    }
  },
  watch: {
    treeData: {
      handler: function (val, oldval) {
        this.getNodeAlias()
      }
    }
  },
  methods: {
    subHandle () {
      let data = this.ruleForm
      for (let index = 0; index < data.length; index++) {
        if(data[index].nodealias && data[index].nodealias.length>100 ){
          this.$message.error(`${data[index].activityname}节点别名超长`)
          return
        }
      }
      this.loading = true
      saveNodeAlias(this.ruleForm)
        .then(rt => {
          if (rt.status === '200') {
            this.$message({
              message: this.$t('hintText.saveSuccessfully'),
              type: 'success'
            })
            this.loading = false
            this.getNodeAlias()
          } else {
            this.loading = false
            this.$message({
              message: this.$t('hintText.failToSave'),
              type: 'error'
            })
          }
        })
        .catch(() => {
          this.loading = false
          this.$message({
            message: this.$t('hintText.failToSave'),
            type: 'error'
          })
        })
    },
    getNodeAlias () {
      this.loading = true
      getNodeAlias(this.treeData.id)
        .then(rt => {
          this.loading = false
          this.ruleForm = rt.data.map(item => {
            item.processnodeid = item.id.toString()
            item.nodealias = item.nodealias === '0' ? '' : item.nodealias
            return item
          })
          return getAllRootTree()
        })
        .then((rt) => {
          rt.data.forEach(item => {
          // item.isParent = false
            item.NAME = item.name
            item.ID = item.id
            item.TYPE = item.type
          })
          this.treeNode = rt.data
        })
        .catch(err => {
          this.$message.error(err.message)
          this.loading = false
        })
    },
    handleNodeClick (data, index) {
      this.ruleForm[index].orgnodeid = data.map(item => item.ID).join(',')
    }
  },
  mounted () {
    this.getNodeAlias()
  }
}
</script>
<style lang="scss">
#nodeAlias {
  .el-form-item__content {
    padding: 7px;
  }
  .el-input__inner {
    border: none;
    border-bottom: 1px solid $dc1;
  }
  .text-r {
    button {
      margin: 15px 10px;
    }
  }
}
</style>
<style lang="scss" scoped>
#nodeAlias {
  .border-b {
    border-bottom: 1px solid $dc1;
  }
  .header {
    font-size: 12px;
    color: $tc1;
    background: $bc2;
    margin-top: 20px;
    .el-col {
      padding: 10px;
    }
  }
  .calculative {
    width: calc(100% - 30px);
  }
}
</style>
