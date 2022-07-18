<template>
  <div id="station">
    <el-row class="margin-t10">
      <el-col :span="16">
        <bas-search
          :placeholder="$t('placeholderText.multipleFieldsPlaceholder40')"
          v-model="searchKey"
          @fnSearch="quickSearch"
        />
      </el-col>
      <el-col :span="8" class="text-r">
        <el-button type="primary" @click="reset">
          {{ $t("refresh") }}
        </el-button>
      </el-col>
    </el-row>
    <div class="pad-10px pad-t15px h100">
      <el-scrollbar>
        <bas-table
          class="main_tab"
          row-key="id"
          :tableList="processList"
          :headerList="headerList"
          :isShowPagination="false"
        >
          <template #listname="scope">
             <a @click="$router.push('/processDetails/' + scope.row.releaseid)">{{ scope.row.listname }}</a>
          </template>
        </bas-table>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { getStationlists } from '@/bpa/api/jobsCenter'
import axios from 'axios'
export default {
  name: 'Station',
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
          slotName: 'listname',
          minWidth: 180
        },
        {
          label: this.$t('activity'),
          prop: 'nodename',
          minWidth: 180
        },
        {
          label: this.$t('approver_a'),
          prop: 'approers',
          minWidth: 120
        },
        {
          label: this.$t('jobsResponsibility'),
          prop: 'description',
          minWidth: 120
        },
        {
          label: this.$t('settime'),
          prop: 'worktime',
          minWidth: 150
        },
        {
          label: 'RACI',
          prop: 'raci',
          minWidth: 80
        }
      ],
      processList: [],
      process: this.$t("process"),
      approver: this.$t('approver_a'),
      activity: this.$t("activity"),
      jobsResponsibility: this.$t("jobsResponsibility"),
      worktime: this.$t("worktime"),
      settime: this.$t("settime"),
      searchKey:""
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
  methods: {
    quickSearch(){
      let list = []
      let keyWords = this.searchKey.toLowerCase()
      if(keyWords){
        this.processList.filter(item => {
         if((item.listname&&item.listname.toLowerCase().indexOf(keyWords) !== -1) ||(item.approers&&item.approers.toLowerCase().indexOf(keyWords) !== -1)  ||(item.nodename&&item.nodename.toLowerCase().indexOf(keyWords) !== -1 )||(item.description&&item.description.toLowerCase().indexOf(keyWords) !== -1) || (item.raci&&item.raci.toLowerCase().indexOf(keyWords) !== -1)  || (item.worktime&&item.worktime.toLowerCase().indexOf(keyWords) !== -1)){
            list.push(item)
          }
        })
        this.processList = list
      }else{
        this.getProcesslists(this.orgIds)
      }
    },
    getProcesslists (val) {
      getStationlists(val).then(res => {
        if (!res) return false
        this.processList = res
        this.processList.forEach(item => {
          let worktime = item.worktime.split(',')
          item.worktime = (worktime[0] && Number(worktime[0]) > 0 ? `${worktime[0]}天` : '') + (worktime[1] && Number(worktime[1]) > 0 ? `${worktime[1]}小时` : '')
        });
      })
    },
     excelFile() {
      axios({
        method: "get",
        url: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/modelResponsibility/exportWord/${this.orgIds}`,
        headers: {
          token: sessionStorage.getItem("token")
        },
        // responseType: "arraybuffer"
      })
        .then(res => {
          window.open(res.data.data, '_blank')
        })
        .catch(() => {});
    },
    reset() {
      this.searchKey = ""
      this.getProcesslists(this.orgIds)
    },
  }
}
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
#station {
  height: calc(100vh - 220px);
  /deep/ .el-scrollbar__wrap {
    padding: 0 !important;
  }
  .el-scrollbar {
    height: calc(100% - 40px);
  }
}
</style>
