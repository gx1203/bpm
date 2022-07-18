<template>
  <div id="groupManage">
    <el-row :gutter="20" class="group_container">
      <el-col :span="4" class="tree_wrap" style="padding-left: 8px;">
        <el-row>
          <el-input placeholder="请输入内容" class="search_component remove-margin-b" v-model="searchInter" clearable @keyup.13.native="searchSystem">
            <el-button type="primary" @click="searchSystem" slot="append">搜索</el-button>
          </el-input>
        </el-row>
        <el-scrollbar class="tree_node">
            <ul class="inside_ul">
                <li class="inside_li" v-for="(item, index) in itList" :key="index" :style="indexInfo === index ? 'color: #0796f9;border-left: 5px solid #0796f9;background: #e6f5fe;font-size: 13px;' : 'font-size: 13px;'">
                    <span :style="indexInfo === index ? 'color: #0796f9;font-size: 13px;' : 'font-size: 13px;'" :title="item.name" @click="insideName(index)">{{item.name}}</span>
                </li>
            </ul>
        </el-scrollbar>
      </el-col>
      <el-col :span="20">
        <el-scrollbar class="right-content">
           <el-row style="margin-bottom: 10px">
             <el-col :span="8">
          <el-input placeholder="相关体系、相关制度" class="search_component remove-margin-b" v-model="keyWords" clearable @keyup.13.native="abstractSearch">
            <el-button type="primary" @click="singleSearch" slot="append">搜索</el-button>
          </el-input>
             </el-col>
             <el-col :span="16">
               <div style="text-align: right;">
                 <span>选择版本：</span>
                <el-select v-model="version" @change="selectVersion" placeholder="请选择">
    <el-option
      v-for="item in optionsList"
      :key="item.id"
      :label="item.versions"
      :value="item.id">
    </el-option>
  </el-select>
               <el-button type="primary" @click="reset">刷新</el-button>
               <el-button type="primary" @click="getExcel">下载</el-button>
               </div>
             </el-col>
        </el-row>
          <el-table
            :data="userList"
            border
            class="main_tab blue-table">
            <el-table-column
              label="序号"
              type="index">
            </el-table-column>
            <el-table-column
              prop="systemname"
              label="相关体系">
            </el-table-column>
            <el-table-column
              prop="listname"
              label="相关制度">
            </el-table-column>
            <el-table-column
              prop="chaptertitle"
              label="三标一体管理手册章节">
            </el-table-column>
            <el-table-column
              prop="processname"
              label="流程名称">
            </el-table-column>
            <el-table-column
              prop="deptname"
              label="主责部门">
            </el-table-column>
            <el-table-column
              prop="fbrq"
              label="流程发布日期">
            </el-table-column>
          </el-table>
          <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="pages.pageNum"
                   :page-size="pages.pageSize"
                   layout="total, prev, pager, next, jumper"
                   :total="pages.total"></el-pagination>
        </el-scrollbar>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getTreeList, abstractSearch } from '@/bpa/api/settings/groupManage'
import {
  getInterList, getDetails
} from '@/bpa/api/systemManagementCenter/systemList'
import {
  getFormateDate
} from '@/bpa/utils/common'
import {
  systemProcessRelation
} from '@/bpa/api/systemManagementCenter/systemFlow'
import paginations from '@/bpa/mixins/pagination_mixin'
import axios from 'axios'
export default {
  data () {
    return {
      dialogVisible: false,
      type: 'add',
      treeData: [],
      userList: [],
      isSearch: false,
      filterText: '',
      keyWords: '',
      expandedList: [],
      orgid: '',
      title: '',
      dept: '',
      deptid: '',
      nameList: [],
      pages: {
        pageSize: 8,
        pageNum: 1,
        total: 0
      },
      itList: [],
      indexInfo: '',
      optionsList: [],
      version: '',
      systemid: '',
      searchInter: ''
    }
  },
  mixins: [paginations],
  mounted () {
    this.getInterList()
  },
  methods: {
    getExcel () {
      if (this.version) {
        axios({
          method: 'post',
          url: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/systemProcessRelation/exportPlan`,
          data: {
            attr: {
              systemid: this.version ? this.version : ''
            },
            ...this.params,
            ...this.pages
          },
          headers: {
            token: JSON.parse(localStorage.getItem('portalCurrentUserInfo')).empuid
          },
          responseType: 'arraybuffer'
        })
          .then(res => {
            let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
            var a = document.createElement('a')
            document.body.appendChild(a)
            a.style = 'display: none'
            var url = window.URL.createObjectURL(blob)
            a.download = '体系流程'
            a.href = url
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)
          })
          .catch(() => { })
      } else {
        this.$message.error('请先选择相关体系！！')
      }
    },
    reset () {
      this.keyWords = ''
      this.getList()
    },
    getFilterTreeList (node, resolve) {
      let id = node.data ? node.data.id : '0'
      getTreeList(id).then(res => {
        if (!res) return false
        if (id === '0') {
          this.expandedList = [res[0].id]
        }
        resolve(res)
      })
    },
    abstractSearch () {
      if (this.filterText) {
        this.isSearch = true
        abstractSearch({orgname: this.filterText}).then(res => {
          this.treeData = res
        })
      } else {
        this.isSearch = false
      }
    },
    searchSystem () {
      this.getInterList()
    },
    getInterList() {
      getInterList({
        pageSize: 9999,
        pageNum: 1,
        total: 100,
        filters: [{ key: 'name', opt: 'LIKE', type: 'S', value: this.searchInter ? this.searchInter : '' }]
      }).then((res) => {
        this.itList = res.list
      })
    },
    // 获取当前时间
    getdate() {
      var now = new Date()
      var y = now.getFullYear()
      var m = now.getMonth() + 1
      var d = now.getDate()
      var h = now.getHours()
      var mm = now.getMinutes()
      var ff = now.getSeconds()
      return (
        y +
        '-' +
        (m < 10 ? '0' + m : m) +
        '-' +
        (d < 10 ? '0' + d : d) +
        ' ' +
        (h < 10 ? '0' + h : h) +
        ':' +
        (mm < 10 ? '0' + mm : mm) +
        ':' +
        (ff < 10 ? '0' + ff : ff)
      )
    },
    getList() {
      let obj = {
        attr: {
          systemid: this.version ? this.version : ''
        },
        ...this.params,
        ...this.pages
      }
      systemProcessRelation(obj).then((res) => {
        if (!res) return false
        this.userList = res.list.map(item => {
          if (item.fbrq) {
            item.fbrq = !item.fbrq
              ? ''
              : getFormateDate(new Date(item.fbrq), 'yyyy-MM-dd')
          }
          return item
        })
        this.pages.total = res.total
      })
    },
    insideName (index) {
      this.indexInfo = index
      getDetails(this.itList[index].systemid).then(rt => {
        this.optionsList = this.itList[index].versionList
        this.version = this.optionsList[0].id
        this.getList()
      })
    },
    selectVersion () {
      this.getList()
    },
    singleSearch () {
      this.pages.pageNum = 1
      this.params = {
        filters: [
          { key: 'systemname', opt: 'LIKE', type: 'S', value: this.keyWords },
          { key: 'listname', opt: 'LIKE', type: 'S', value: this.keyWords }
        ],
        logic: 'or'
      }
      this.getList()
    }

  }
}
</script>

<style lang="scss" scoped>
#groupManage {
  .tree_node {
    height: 380px;
  }
  .right-content{
    height: calc(100vh - 160px);
    .el-scrollbar__wrap{
      height: 100%;
    }
    .el-scrollbar__view{
      height: 100%;
    }
  }
  .tree_node {
    height: calc(100vh - 190px) !important;
    .inside_ul {
        .inside_li {
            padding: 6px;
            cursor: pointer;
            &:hover {
                color: #4ba2ef;
                background-color: #F5F7FA;
            }
            span {
                    display: inline-block;
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
            }
        }
    }
  }
}
.card {
  background: white;
  border-bottom: 1px solid $dc1;
  overflow: hidden;
  transition-duration: 0.5s;
  box-sizing: border-box;
  margin-bottom: 10px;
  .header {
    margin-right: 10px;
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
.w100 {
  width: 60% !important;
}
#pdfDom {
  padding: 10px;
}
</style>
