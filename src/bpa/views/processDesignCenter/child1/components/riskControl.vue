<template>
  <div class="w100">
    <el-row>
      <el-col :span="24">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="相关风险" name="first">
            <el-row class="margin-b15">
              <el-col :span="4" :offset="20" class="clear-fix">
                <el-button class="float-r" type="primary">关联</el-button>
              </el-col>
            </el-row>
            <el-table :data="lists1" class="main_tab" stripe>
              <el-table-column :label="existTabField('number', '', true)" type="index"></el-table-column>
              <el-table-column prop="name" :label="existTabField('riskName', '', true)"></el-table-column>
              <el-table-column prop="deptname" :label="existTabField('controlelement', '', true)"></el-table-column>
              <el-table-column prop="duty" :label="existTabField('ownerdept', '', true)"></el-table-column>
              <el-table-column prop="timelimit" :label="existTabField('risklevel', '', true)"></el-table-column>
              <el-table-column width="80" :label="existTabField('operation', '', true)">
                <template slot-scope="scope">
                  <el-tooltip v-if="scope.row.foldername === '其他流程相关文件'" class="item" effect="dark"
                    :content="$t('delete')" placement="top">
                    <el-button class="no-border" icon="el-icon-delete" type="text" @click="delFile(scope.row)">
                    </el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :current-page.sync="pages.pageNum" :page-sizes="[10, 15, 20]" :page-size="pages.pageSize" background
              layout="prev, pager, next, jumper, total" :total="pages.total"></el-pagination>
          </el-tab-pane>
          <el-tab-pane :label="existTabField('controlmeasures', '', true)" name="second">
            <el-row class="margin-b15">
              <el-col :span="4" :offset="20" class="clear-fix">
                <el-button class="float-r" type="primary">关联</el-button>
              </el-col>
            </el-row>
            <el-table :data="lists2" class="main_tab">
              <el-table-column :label="existTabField('number', '', true)" type="index"></el-table-column>
              <el-table-column :label="existTabField('controlName', '', true)" prop="content"></el-table-column>
              <el-table-column :label="existTabField('controlDemand', '', true)"  prop="sourcefrom"></el-table-column>
              <el-table-column :label="existTabField('controlmeasures', '', true)" prop="username"></el-table-column>
              <el-table-column :label="existTabField('ownerdept', '', true)" prop="deptname"></el-table-column>
              <el-table-column :label="existTabField('operation', '', true)" width="80">
                <template slot-scope="scope">
                  <el-tooltip v-if="scope.row.foldername === '其他流程相关文件'" class="item" effect="dark"
                    :content="$t('delete')" placement="top">
                    <el-button class="no-border" icon="el-icon-delete" type="text"></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import paginations from '@/bpa/mixins/pagination_mixin'
import {
  getRecordlist
  // getRecordlist2
} from '@/bpa/api/processDesignCenter'

const filetypes = [
  {
    label: '流程输出文件',
    id: '7A88687D266A3D7CE053BF1A13ACD2C3'
  },
  {
    label: '其他流程相关文件',
    id: '7A88EC3856C446EBE053BF1A13ACC390'
  },
  {
    label: '输入',
    id: '7B4DBBED904B1C5DE053BF1A13AC64F1'
  },
  {
    label: '输出',
    id: '7B4DBBED904E1C5DE053BF1A13AC64F1'
  },
  {
    label: 'QMS',
    id: '7B000C586A5D3A31E053BF1A13AC8D0A'
  },
  {
    label: 'EMS',
    id: '7B000D65C18D3A0DE053BF1A13AC5F6B'
  },
  {
    label: 'OHSAS',
    id: '7B000C586A603A31E053BF1A13AC8D0A'
  },
  {
    label: 'EnMs',
    id: '7B3D9B5F12664172E053BF1A13AC131E'
  },
  {
    label: '业务规则',
    id: '7BC636EDF11967C0E0530701A8C06A7D'
  },
  {
    label: '流程输入文件',
    id: '6CCAFE3781CA4875E053BF1A13AC0E97'
  }
]
export default {
  name: 'author',
  data () {
    return {
      activeName: 'first',
      isFileVisible: false,
      lists1: [],
      lists2: [],
      lists3: [],
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      // 文件类型
      filetypes,
      // 业务规则
      isruleVisible: false,
      isGroupVisible: false,
      // 组件附件的调用参数
      forlderId: '7A88EC3856C446EBE053BF1A13ACC390',
      recordlist: []
    }
  },
  props: {
    showtabfiled: {
      type: Array,
      default: () => []
    },
    treeId: {
      type: String,
      default: ''
    },
    modelid: {
      type: String,
      default: ''
    },
    bpmid: {
      type: String,
      default: ''
    },
    version: {
      type: String,
      default: ''
    }
  },
  watch: {
    'showtabfiled'(val) {
      console.log(val)
      this.getRecord()
    }
  },
  mixins: [paginations],
  computed: {
    host () {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    action () {
      return `${this.host}/mangercenterdoc/uploadCopy?username=${this.userid}`
    },
    download () {
      return this.host + '/attach/download/'
    },
    viewfile () {
      return this.host + '/document/print/'
    },
    userid () {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .empuid
    },
    username () {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .cnname
    }
  },
  mounted () {
    console.log(this.treeId)
    console.log(this.modelid)
  },
  methods: {
    handleClick () { },
    // 判断条件
    existTabField(pname, type, bool) {
      let obj = {}
      this.showtabfiled.forEach(item => {
        if (item.pname === pname) {
          obj = JSON.parse(JSON.stringify(item))
          return false
        }
      })
      if (type == 'refer') {
        // console.log(!!obj.pname)
        return !!obj.pname
      } else if (type == 'necessary') {
        return obj.necessary == '1'
      } else {
        return !obj.pname ? '' : obj.name + (!bool ? ':' : '')
      }
    },
    getRecord() {
      getRecordlist(this.modelid).then(res => {
        console.log(res)
        this.recordlist = res
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.minHeight28 {
  min-height: 28px;
}
.minHeight35 {
  min-height: 35px;
}
.el-dialog__header {
  .el-button {
    padding: 0 8px;
    margin-right: 15px;
  }
}
</style>
