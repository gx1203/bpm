<template>
  <div id="station">
    <div class="pad-10px pad-t15px h100">
      <el-scrollbar class="h100">
        <el-table
          :data="processList"
          border
          class="main_tab">
          <el-table-column
            prop="listname"
            width="150"
            label="流程">
          </el-table-column>
          <el-table-column
            prop="nodename"
            width="100"
            label="活动">
          </el-table-column>
          <el-table-column
            label="风险">
            <template slot-scope="scope">
              <p class="w100 field" v-if="!!scope.row.modelListCorekeyDto.code">
                <span>风险编号:</span>
                <span>{{scope.row.modelListCorekeyDto.code}}</span>
              </p>
              <p class="w100 field" v-if="!!scope.row.modelListCorekeyDto.kcpname">
                <span>风险名称:</span>
                <span>{{scope.row.modelListCorekeyDto.kcpname}}</span>
              </p>
              <p class="w100 field" v-if="!!scope.row.modelListCorekeyDto.controlelement">
                <span>风险描述:</span>
                <span>{{scope.row.modelListCorekeyDto.controlelement}}</span>
              </p>
              <p class="w100 field" v-if="!!scope.row.modelListCorekeyDto.targetcomprate">
                <span>控制编号:</span>
                <span>{{scope.row.modelListCorekeyDto.targetcomprate}}</span>
              </p>
              <p class="w100 field" v-if="!!scope.row.modelListCorekeyDto.processtarget">
                <span>控制名称:</span>
                <span>{{scope.row.modelListCorekeyDto.processtarget}}</span>
              </p>
              <p class="w100 field" v-if="!!scope.row.modelListCorekeyDto.risk">
                <span>控制要求:</span>
                <span>{{scope.row.modelListCorekeyDto.risk}}</span>
              </p>
              <p class="w100 field" v-if="!!scope.row.modelListCorekeyDto.testprogram">
                <span>实施证据:</span>
                <span>{{scope.row.modelListCorekeyDto.testprogram}}</span>
              </p>
              <p class="w100 field" v-if="!!scope.row.modelListCorekeyDto.sampleselect">
                <span>责任部门:</span>
                <span>{{scope.row.modelListCorekeyDto.sampleselect}}</span>
              </p>
              <p class="w100 field" v-if="!!scope.row.modelListCorekeyDto.remark">
                <span>编制依据:</span>
                <span>{{scope.row.modelListCorekeyDto.remark}}</span>
              </p>
            </template>
          </el-table-column>
          <el-table-column
            prop="raci"
            width="80"
            label="RACI">
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { risklists } from '@/bpa/api/settings/responsibilities'

export default {
  name: 'risk',
  data() {
    return {
      processList: []
    }
  },
  computed: {
    userid() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .empuid
    }
  },
  mounted() {
    this.getProcesslists()
  },
  methods: {
    getProcesslists () {
      console.log(this.userid)
      risklists(this.userid).then(res => {
        if (!res) return false
        this.processList = res
      })
    }
  }
}
</script>

<style lang="scss" scoped>
*{
  box-sizing: border-box;
}
#station {
  height: calc(100vh - 200px);
  /deep/ .el-scrollbar__wrap{
      padding: 0!important;
  }
  .field{
    padding: 0 0 5px;
    position: relative;
    span{
      display: inline-block;
      vertical-align: top;
    }
    span:nth-of-type(1) {
      width: 70px;
      position: absolute;
      top: 0;
      left: 0;
      text-align: right;
    }
    span:nth-of-type(2) {
      width: 100%;
      padding-left: 75px;
      text-align: left;
    }
  }
}
</style>
