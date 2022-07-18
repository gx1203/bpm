<template>
  <div class="w100">
    <el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="existTabField('import', '', true)" name="in"></el-tab-pane>
          <el-tab-pane :label="existTabField('output', '', true)" name="out">
            <!-- <el-row :gutter="10">
              <el-col :span="5">
                <el-scrollbar class="left_tree_wrapper">
                  <el-tree ref="tree" class="filter-tree elTree" :props="props" :load="loadNode" node-key="id" lazy :expand-on-click-node="false" :default-expanded-keys="expandedList" @node-click="nodeClick">
                    <div slot-scope="{ node, data }" class="custom-tree-node w100">
                      <p :title="node.label">
                        {{ node.label }}
                      </p>
                    </div>
                  </el-tree>
                </el-scrollbar>
              </el-col>
              <el-col :span="19">
                <el-table :data="list2Data" class="main_tab">
                  <el-table-column :label="$t('number')" type="index"></el-table-column>
                  <el-table-column prop="content" label="业务对象名称"></el-table-column>
                  <el-table-column prop="sourcefrom" label="末级对象分类"></el-table-column>
                  <el-table-column prop="sourcefrom" label="业务对象描述"></el-table-column>
                  <el-table-column prop="sourcefrom" label="所属文档"></el-table-column>
                  <el-table-column prop="sourcefrom" label="备注"></el-table-column>
                  <el-table-column width="120" :label="$t('operation')">
                    <template slot-scope="scope">
                      <el-tooltip class="item" effect="dark" :content="$t('view')" placement="top">
                        <el-button class="no-border" type="text" icon="el-icon-view" @click="businessDialogVisible = true"></el-button>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row> -->
          </el-tab-pane>
        </el-tabs>
        <el-table :data="lists1" class="main_tab" stripe>
          <el-table-column :label="existTabField('number', '', true)" type="index"></el-table-column>
          <el-table-column prop="docname" :label="existTabField('TheDocumentName', '', true)"></el-table-column>
          <el-table-column prop="bonames" :label="existTabField('BusinessObjectName', '', true)"></el-table-column>
        </el-table>
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="pages.pageNum"
          :page-size="pages.pageSize" background layout="prev, pager, next, jumper, total" :total="pages.total">
        </el-pagination>
    </el-row>

    <!-- 业务对象查看 -->
    <el-dialog class="supportDialog" :title="existTabField('BusinessObjectView', '', true)" width="60%" :visible.sync="businessDialogVisible" :append-to-body="true">
      <el-form label-width="110px" label-position="right" ref="supportRef" :model="supportform" disabled>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item :label="existTabField('BusinessObjectName', '', true)">
              <el-input v-model="supportform.remarks"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="existTabField('NameOfParentObject', '', true)">
              <el-input v-model="supportform.remarks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item :label="existTabField('BusinessObjectDescription', '', true)">
              <el-input v-model="supportform.remarks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item :label="existTabField('remarks', '', true)">
              <el-input type="textarea" v-model="supportform.remarks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-table
          stripe
          :header-cell-style="{background: '#E1EAFD !important'}"
          highlight-current-row
          :data="lists1">
          <el-table-column :label="existTabField('number', '', true)" type="index"></el-table-column>
          <el-table-column prop="name" :label="existTabField('NameOfBusinessActivity', '', true)"></el-table-column>
          <el-table-column prop="createby" :label="existTabField('BusinessActivityDescription', '', true)"></el-table-column>
          <el-table-column prop="createby" :label="existTabField('useTheTools', '', true)"></el-table-column>
          <el-table-column prop="createby" :label="existTabField('remarks', '', true)"></el-table-column>
        </el-table>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="businessDialogVisible = false">{{$t('basProcessTree.cancelAction')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getRevisionSystemList } from '@/bpa/api/componentsApi'
import { deluploadFile } from '@/bpa/api/common'
import {
  queryBoModellist
} from '@/bpa/api/processDesignCenter'
import {
  getRuleIframeTree
} from '@/bpa/api/rulesCenter/handbookFiles'
import {
  getRecordlist
  // getRecordlist2
} from '@/bpa/api/processDesignCenter'
import paginations from '@/bpa/mixins/pagination_mixin'

export default {
  name: 'author',
  data () {
    return {
      activeName: 'in',
      businessDialogVisible: false,
      // 组织树
      props: {
        label: function (data, node) {
          if (data.code) {
            return data.code+ ' '+ data.foldername
          } else {
            return data.foldername
          }
        },
        isLeaf: function (data, node) {
          return data.parent !== true;
        }
      },
      expandedList: [],
      lists1: [],
      list2Data: [],
      recordlist: [],
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      supportform: {},
      supportsrules: {
        fileType: [{ required: true, message: ' ', trigger: 'blur' }],
        remarks: [{ required: true, message: ' ', trigger: 'blur' }],
        supportFile: [{ required: true, message: ' ', trigger: 'blur' }]
      }
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
  mixins: [paginations],
  computed: {
    host () {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    action () {
      return `${this.host}/mangercenterdoc/uploadCopy?username=${this.userid}`
    },
    download () {
      return this.host + '/regulation/download/'
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
  watch: {
    'showtabfiled'(val) {
      console.log(val)
      this.getRecord()
    }
  },
  mounted () {
    this.queryBoModellist(1)
  },
  methods: {
    getRecord() {
      getRecordlist(this.modelid).then(res => {
        console.log(res)
        this.recordlist = res
      })
    },
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
    nodeClick (data) {
      // this.modelid = data.id
      // this.nodeData = data
      // this.getList()
    },
    loadNode (node, resolve) {
      const id = node.data ? node.data.id : '0'
      getRuleIframeTree(id).then(res => {
        console.log(res)
        if (!res) return false
        if (id === '0') {
          this.expandedList = [res[0].id]
          this.$nextTick(() => {
            // this.$refs.tree.setCurrentKey(res[0].id)
            // this.modelid = res[0].id
            // this.type = res[0].foldername
            // this.nodeData = res[0]
            // this.getList()
          })
        }
        resolve(res)
      })
    },
    // 获取流程支持文件
    queryBoModellist (pageNum) {
      queryBoModellist({
        attr: {},
        filters: [
          { key: 'listid', opt: 'EQ', type: 'S', value: this.modelid },
          { key: 'inout', opt: 'EQ', type: 'S', value: this.activeName }
        ],
        orderby: 'createon',
        pageNum: !pageNum ? 1 : this.pages.pageNum,
        pageSize: 10,
        sort: 'desc'
      }).then(res => {
        console.log(res)
        this.lists1 = res.list
        this.pages.total = res.total
      })
    },
    getList2 () {
      getRevisionSystemList({
        pagenum: this.pages.pageNum,
        pagesize: this.pages.pageSize,
        id: this.modelid
      }).then(res => {
        if (!res) return false
        console.log(res)
        this.list2Data = res.list
        console.log(this.list2Data)
      })
    },
    handleClick (tab, event) {
      this.queryBoModellist()
    },
    handleCurrentChange (val) {
      this.pages.pageNum = val
      this.queryBoModellist(val)
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
.fileName {
  color: #409eff;
  cursor: pointer;
}
.fileName2 {
  color: #ccc;
  cursor: pointer;
}
/deep/.el-button:hover, .el-button:focus{
      background-color: #2d42af !important;
     color: #fff !important;
  }
</style>
