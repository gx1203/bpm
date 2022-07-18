<template>
  <div id="station">
    <div class="pad-10px pad-t15px h100">
      <el-scrollbar class="h100">
        <bas-table
          class="main_tab"
          row-key="id"
          :tableList="processList"
          :headerList="headerList"
          :isShowPagination="false"
        >
          <template #risk="scope">
            <el-tooltip placement="top">
              <div slot="content" class="riskTooltip">
                <p v-if="!!scope.row.modelListCorekeyDto.code" class="w100 field">
                  <span>{{$t("riskNumber")}}：</span>
                  <span>{{ scope.row.modelListCorekeyDto.code }}；</span>
                </p>
                <p v-if="!!scope.row.modelListCorekeyDto.kcpname" class="w100 field">
                  <span>{{$t("riskName")}}：</span>
                  <span>{{ scope.row.modelListCorekeyDto.kcpname }}；</span>
                </p>
                <p v-if="!!scope.row.modelListCorekeyDto.controlelement" class="w100 field">
                  <span>{{$t("riskDescription")}}：</span>
                  <span>{{ scope.row.modelListCorekeyDto.controlelement }}；</span>
                </p>
                <p v-if="!!scope.row.modelListCorekeyDto.targetcomprate" class="w100 field">
                  <span>{{$t("controlNumber")}}：</span>
                  <span>{{ scope.row.modelListCorekeyDto.targetcomprate }}；</span>
                </p>
                <p v-if="!!scope.row.modelListCorekeyDto.processtarget" class="w100 field">
                  <span>{{$t("controlName")}}：</span>
                  <span>{{ scope.row.modelListCorekeyDto.processtarget }}；</span>
                </p>
                <p v-if="!!scope.row.modelListCorekeyDto.risk" class="w100 field">
                  <span>{{$t("controlRequirements")}}：</span>
                  <span>{{ scope.row.modelListCorekeyDto.risk }}；</span>
                </p>
                <p v-if="!!scope.row.modelListCorekeyDto.testprogram" class="w100 field">
                  <span>{{$t("TheImplementationOfEvidence")}}：</span>
                  <span>{{ scope.row.modelListCorekeyDto.testprogram }}；</span>
                </p>
                <p v-if="!!scope.row.modelListCorekeyDto.sampleselect" class="w100 field">
                  <span>{{$t("responsibilityDepartment")}}：</span>
                  <span>{{ scope.row.modelListCorekeyDto.sampleselect }}；</span>
                </p>
                <p v-if="!!scope.row.modelListCorekeyDto.remark" class="w100 field">
                  <span>{{$t("compilationBasis")}}：</span>
                  <span>{{ scope.row.modelListCorekeyDto.remark }}；</span>
                </p>
              </div>            
              <div class="riskContent">
                <p v-if="!!scope.row.modelListCorekeyDto.code" class="w100 field">
                  <span>{{$t("riskNumber")}}：</span>
                  <span>{{ scope.row.modelListCorekeyDto.code }}；</span>
                </p>
                <p v-if="!!scope.row.modelListCorekeyDto.kcpname" class="w100 field">
                  <span>{{$t("riskName")}}：</span>
                  <span>{{ scope.row.modelListCorekeyDto.kcpname }}；</span>
                </p>
                <p v-if="!!scope.row.modelListCorekeyDto.controlelement" class="w100 field">
                  <span>{{$t("riskDescription")}}：</span>
                  <span>{{ scope.row.modelListCorekeyDto.controlelement }}；</span>
                </p>
                <p v-if="!!scope.row.modelListCorekeyDto.targetcomprate" class="w100 field">
                  <span>{{$t("controlNumber")}}：</span>
                  <span>{{ scope.row.modelListCorekeyDto.targetcomprate }}；</span>
                </p>
                <p v-if="!!scope.row.modelListCorekeyDto.processtarget" class="w100 field">
                  <span>{{$t("controlName")}}：</span>
                  <span>{{ scope.row.modelListCorekeyDto.processtarget }}；</span>
                </p>
                <p v-if="!!scope.row.modelListCorekeyDto.risk" class="w100 field">
                  <span>{{$t("controlRequirements")}}：</span>
                  <span>{{ scope.row.modelListCorekeyDto.risk }}；</span>
                </p>
                <p v-if="!!scope.row.modelListCorekeyDto.testprogram" class="w100 field">
                  <span>{{$t("TheImplementationOfEvidence")}}：</span>
                  <span>{{ scope.row.modelListCorekeyDto.testprogram }}；</span>
                </p>
                <p v-if="!!scope.row.modelListCorekeyDto.sampleselect" class="w100 field">
                  <span>{{$t("responsibilityDepartment")}}：</span>
                  <span>{{ scope.row.modelListCorekeyDto.sampleselect }}；</span>
                </p>
                <p v-if="!!scope.row.modelListCorekeyDto.remark" class="w100 field">
                  <span>{{$t("compilationBasis")}}：</span>
                  <span>{{ scope.row.modelListCorekeyDto.remark }}；</span>
                </p>
              </div>
            </el-tooltip>
          </template>
        </bas-table>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { risklists } from '@/bpa/api/jobsCenter'

export default {
  name: 'Risk',
  props: {
    orgIds: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 表头字段
      headerList: [
        {
          label: this.$t('process'),
          prop: 'listname',
          minWidth: 150
        },
        {
          label: this.$t('activity'),
          prop: 'nodename',
          minWidth: 150
        },
        {
          label: this.$t('risk'),
          prop: 'risk',
          slotName: 'risk',
          minWidth: 280,
          tooltip: 'false'
        },
        {
          label: 'RACI',
          prop: 'raci',
          minWidth: 80
        }
      ],
      processList: [],
      process: this.$t('process'),
      activity: this.$t('activity'),
      risk: this.$t('risk')
    }
  },
  computed: {
    userid () {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .empuid
    }
  },
  watch: {
    orgIds: {
      handler (obj) {
        if (obj) {
          this.getProcesslists(obj)
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted () { },
  methods: {
    getProcesslists (obj) {
      risklists(obj).then(res => {
        if (!res) return false
        this.processList = res
      })
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
#station {
  height: calc(100vh - 200px);
  /deep/ .el-scrollbar__wrap {
    padding: 0 !important;
  }
  .riskContent {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .field {
    display: inline;
    position: relative;
  }
}
.riskTooltip {
  min-width: 300px;
  max-width: 800px;
  p {
    line-height: 18px;
    margin-bottom: 5px;
    &:last-child {
      margin: 0;
    }
  }
}
</style>
