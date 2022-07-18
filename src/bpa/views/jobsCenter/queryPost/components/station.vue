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
import { getStationlistsOther } from "@/bpa/api/jobsCenter";

export default {
  name: "station",
  data() {
    return {
      // 表头字段
      headerList: [
        {
          label: this.$t('process'),
          prop: 'listname',
          slotName: 'listname'
        },
        {
          label: this.$t('activity'),
          prop: 'nodename'
        },
        {
          label: this.$t('approver_a'),
          prop: 'approers'
        },
        {
          label: this.$t('jobsResponsibility'),
          prop: 'description'
        },
        {
          label: this.$t('settime'),
          prop: 'worktime'
        },
        {
          label: 'RACI',
          prop: 'raci'
        }
      ],
      processList: [],
      process: this.$t("process"),
      approver: this.$t("approver_a"),
      activity: this.$t("activity"),
      jobsResponsibility: this.$t("jobsResponsibility"),
      worktime: this.$t("settime"),
      orgIds: "",
      searchKey: ""
    };
  },
  props: {
    ids: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    ids: {
      handler(val) {
        let arr = val.map(item => {
          return item.id;
        });
        if (arr) {
          this.getProcesslists(arr.join(","));
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.orgIds = this.ids.map(item => {
      return item.id;
    }).join(",");
  },
  methods: {
    quickSearch() {
      let list = [];
      let keyWords = this.searchKey.toLowerCase();
      if (keyWords) {
        this.processList.filter(item => {
          if ((item.listname && item.listname.toLowerCase().indexOf(keyWords) !== -1) || (item.approers && item.approers.toLowerCase().indexOf(keyWords) !== -1) || (item.nodename && item.nodename.toLowerCase().indexOf(keyWords) !== -1) || (item.description && item.description.toLowerCase().indexOf(keyWords) !== -1) || (item.raci && item.raci.toLowerCase().indexOf(keyWords) !== -1) || (item.worktime && item.worktime.toLowerCase().indexOf(keyWords) !== -1)) {
            list.push(item);
          }
        });
        this.processList = list;
      } else {
        this.getProcesslists(this.orgIds);
      }
    },
    getProcesslists(params) {
      getStationlistsOther(params).then(res => {
        if (!res) return false;
        this.processList = res;
        this.processList.forEach(item => {
          let worktime = item.worktime.split(',')
          item.worktime = (worktime[0] && Number(worktime[0]) > 0 ? `${worktime[0]}天` : '') + (worktime[1] && Number(worktime[1]) > 0 ? `${worktime[1]}小时` : '')
        });
      });
    },
    reset() {
      this.searchKey = "";
      this.getProcesslists(this.orgIds);
    }
  }
};
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
  .el-scrollbar {
    height: calc(100% - 40px);
  }
}
</style>
