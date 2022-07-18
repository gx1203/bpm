<template>
  <el-card shadow="never">
    <div class="item-left">
      <treeProcessFlow type="1" @confirm="handleNodeClick"/>
    </div>
    <div class="item-right" v-loading="load" v-show="treeData.type === '1'">
        <div id="classifyHandle">
            <div class="tool-common-wrap">
                <div class="btn-wrap">
                    <el-button type="primary" @click="refreshData">
                     {{ $t('refresh') }}<i class="el-icon-refresh"/>
                    </el-button>
                </div>
            </div>
            <el-form>
                <div class="card1" ref="card1">
                    <div class="header">
                        <span class="title">权限配置</span>
                    </div>
                    <div class="card-info">
                        <el-button type="primary" @click="handleCheckAllChange">
                            全选/反选
                        </el-button>
                        <el-row>
                            <el-checkbox-group v-model="checkedCities">
                                <el-col :span="8" v-for="(item, index) in list" :key="index" style="margin-top: 10px;overflow: hidden;">
                                    <el-checkbox :label="item.id" :key="item.id" :title="item.name">{{item.name}}</el-checkbox>
                                </el-col>
                            </el-checkbox-group>
                        </el-row>
                        <div class="text-r">
                            <el-button type="primary" @click="submit">
                            提交
                            </el-button>
                        </div>
                    </div>
                </div>
            </el-form>
        </div>
    </div>
  </el-card>
</template>

<script>
import treeProcessFlow from '@/bpm/components/treeProcessFlow'
import { getAllRole, getProcessConfigNode, saveProcessToRole } from '@/bpm/api/process/administrativeTool/processRolePermissions.js'
export default {
  name:'processRolePermissions',
  components: {
    treeProcessFlow
  },
  data () {
    return {
      load: false,
      list: [],
      checkedCities: [],
      checkAll: false,
      treeData: {}
    }
  },
  methods: {
    submit () {
      this.load = true
      saveProcessToRole({
        'processId': this.treeData.id,
        'roleId': this.checkedCities
      }).then((rt) => {
        this.load = false
        if (rt.status === '200') {
          this.$message.success(this.$t('hintText.saveSuccessfully'))
        }
      }).catch((er) => {
        this.load = false
      })
    },
    getRole () {
      this.load = true
      getAllRole().then((rt) => {
        this.load = false
        if (rt.status === '200') {
          this.list = rt.data
        }
      }).catch((er) => {
        this.load = false
      })
    },
    getProcessConfig () {
      getProcessConfigNode(this.treeData.id).then((rt) => {
        if (rt.status === '200' && rt.data.roleId) {
          if (this.list.length === rt.data.roleId.length) {
            this.checkAll = true
          } else {
            this.checkAll = false
          }
          this.checkedCities = rt.data.roleId
        }
      })
    },
    handleNodeClick (data) {
      this.treeData = data
      if (data.type === '1') {
        this.getRole()
        this.getProcessConfig()
      }
    },
    handleCheckAllChange () {
      this.checkAll = !this.checkAll
      if (this.checkAll) {
        this.checkedCities = this.list.map(x => x.id)
      } else {
        this.checkedCities = []
      }
    },
    refreshData () {
      this.getRole()
      this.getProcessConfig()
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
