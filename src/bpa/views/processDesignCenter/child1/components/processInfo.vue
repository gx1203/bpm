<template>
  <div class="w100">
    <el-table :data="infolist" class="main_tab" stripe>
      <el-table-column v-if="existTabField('number', 'refer')" :label="existTabField('number', '', true)" type="index"
        width="50"></el-table-column>
      <el-table-column v-if="existTabField('activityCodes', 'refer')" prop="index" width="80"
        :label="existTabField('activityCodes', '', true)"></el-table-column>
      <el-table-column v-if="existTabField('activityName', 'refer')" prop="name" width="150"
        :label="existTabField('activityName', '', true)"></el-table-column>
      <el-table-column v-if="existTabField('contentAndGuidance', 'refer')" prop="desc" width="200"
        :label="existTabField('contentAndGuidance', '', true)"></el-table-column>
      <el-table-column v-if="existTabField('input', 'refer')" width="150" :label="existTabField('input', '', true)">
        <template slot-scope="scope">
          <p class="showFiles commonpadding alink">
            <span v-for="input in scope.row.input" :key="input.id">
              <a :href="viewFile(input.id)" target="_blank">{{input.newName}}</a>
              <a class="margin-l15" :href="downloadFile(input.id)" target="_blank">
                
              </a>
            </span>
          </p>
        </template>
      </el-table-column>
      <el-table-column v-if="existTabField('output', 'refer')" width="150" :label="existTabField('output', '', true)">
        <template slot-scope="scope">
          <p class="showFiles commonpadding alink">
            <span v-for="output in scope.row.output" :key="output.id">
              <a :href="viewFile(output.id)" target="_blank">{{output.newName}}</a>
              <a class="margin-l15" :href="downloadFile(output.id)" target="_blank">
                
              </a>
            </span>
          </p>
        </template>
      </el-table-column>
      <el-table-column v-if="existTabField('performingRoles', 'refer')" prop="SwimlaneName" width="150"
        :label="existTabField('performingRoles', '', true)"></el-table-column>
      <el-table-column v-if="existTabField('positionOrganization', 'refer')" prop="DeptName"
        :label="existTabField('positionOrganization', '', true)"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import {
  getProcessInfo
} from '@/bpa/api/processDesignCenter'
import { userId, viewFile, downloadFile } from '@/bpa/utils/common'

export default {
  name: 'processInfo',
  data () {
    return {
      infolist: []
    }
  },
  props: {
    showtabfiled: {
      type: Array,
      default: () => []
    },
    bpmid: {
      type: String,
      default: ''
    }
  },
  watch: {
    'showtabfiled' (val) {
      console.log(val,'5555555555')
      this.getInfo()
    }
  },
  computed: {
    download () {
      return this.host + '/attach/download/'
    },
    viewfile () {
      return this.host + '/document/print/'
    }
  },
  methods: {
    // 下载文件
    downloadFile (fileId) {
      return downloadFile(fileId)
    },
    viewFile (fileId) {
      return viewFile(fileId)
    },
    // 判断条件
    existTabField (pname, type, bool) {
      let obj = {}
      this.showtabfiled.forEach(item => {
        if (item.pname === pname) {
          obj = JSON.parse(JSON.stringify(item))
          return false
        }
      })
      let lang = localStorage.getItem("language")
      if (type == 'refer') {
        return !!obj.pname
      } else if (type == 'necessary') {
        return obj.necessary == '1'
      } else {
        return obj.pname && lang === 'cn' ? obj.name + (!bool ? ':' : '') : obj.pname && lang === 'en' ? obj.enname + (!bool ? ':' : '') : ''
      }
    },
    getInfo () {
      getProcessInfo(this.bpmid).then(res => {

        let tempinfo = !res.activityname
          ? []
          : JSON.parse(res.activityname).name
        tempinfo.sort(function (a, b) {
          return a.index > b.index ? 1 : a.index === b.index ? 0 : -1
        })
        console.log(tempinfo,'infolist')

        this.infolist = tempinfo
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/*附件部分*/
.showFiles {
  span {
    line-height: 18px;
    padding: 3px 20px 3px 8px;
    border: 1px solid #519eff;
    display: inline-block;
    vertical-align: top;
    max-width: 130px;
    border-radius: 3px;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  &.alink span {
    padding-right: 35px;
  }
  &.commonpadding span {
    padding: 3px 8px;
  }
  &.commonpadding.alink span {
    padding-right: 20px;
  }
  a:nth-of-type(2) {
    position: absolute;
    right: 17px;
    top: 5px;
  }
  &.commonpadding.alink a:nth-of-type(2) {
    position: absolute;
    right: 5px;
    top: 3px;
  }
  i {
    position: absolute;
    right: 3px;
    top: 5px;
    color: $ico;
  }
  &.processCommon i {
    top: 6px;
  }
}

/*流程支持文件*/
.supportDialog {
  .el-dialog__header {
    .el-button {
      padding: 0 8px;
      margin-right: 15px;
    }
  }
}
</style>
