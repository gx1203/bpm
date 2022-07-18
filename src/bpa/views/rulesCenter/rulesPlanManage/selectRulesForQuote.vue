<template>
  <div id="handbookFiles" class="w100" v-if="isDialogsVisible">
    <el-dialog :append-to-body="true" width="1000px" :visible.sync="isDialogsVisible" title="选择制度" :close-on-click-modal=false :close-on-press-escape=false>
      <el-row :gutter="10">
        <el-col :span="6">
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
        <el-col :span="18">
          <!--<el-scrollbar class="rightPart">-->
          <el-row>
            <el-col :span="12">
              <el-input v-model="keyWords" :placeholder="pleaseEnterTitle" :title="pleaseEnterTitle" class="search_component" clearable @keyup.13.native="getList">
                <el-button slot="append" icon="iconfont_search icon-sousuo2" type="primary" @click="search" />
              </el-input>
            </el-col>
          </el-row>
          <!-- 信息表格 -->
          <el-table
            v-if="!isMore"
            :data="booksList"
            class="main_tab"
            stripe
            :header-cell-style="{background: '#E1EAFD !important'}"
            highlight-current-row
            @current-change="handleCurrentChange">
            <el-table-column :label="number" type="index" width="50" />
            <el-table-column label="制度名称" prop="title" show-overflow-tooltip />
            <el-table-column prop="version" :label="version" show-overflow-tooltip width="50" />
            <el-table-column prop="uploadon" :label="uploadTime" show-overflow-tooltip />
            <el-table-column prop="frameName" :label="$t('NameOfTheFramework')" show-overflow-tooltip />
            <el-table-column prop="system" :label="classificationSystem" show-overflow-tooltip />
            <el-table-column prop="effectiveion" :label="effectiveDate" show-overflow-tooltip width="90" />
            <el-table-column prop="provideruser" :label="releasePeople" show-overflow-tooltip width="60" />
            <el-table-column label="选择" width="60" align="center">
              <template slot-scope="scope">
                <el-radio v-model="selectIndex" :label="scope.$index" class="radioEmpty">{{''}}</el-radio>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            v-else
            :data="booksList"
            class="main_tab"
            ref="multipleTable"
            stripe
            :header-cell-style="{background: '#E1EAFD !important'}"
            highlight-current-row
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" fixed align="center">
            </el-table-column>
            <el-table-column :label="number" type="index" width="50" />
            <el-table-column label="制度名称" prop="title" show-overflow-tooltip />
            <el-table-column prop="version" :label="version" show-overflow-tooltip width="50" />
            <el-table-column prop="uploadon" :label="uploadTime" show-overflow-tooltip />
            <el-table-column prop="frameName" :label="$t('NameOfTheFramework')" show-overflow-tooltip />
            <el-table-column prop="system" :label="classificationSystem" show-overflow-tooltip />
            <el-table-column prop="effectiveion" :label="effectiveDate" show-overflow-tooltip width="90" />
            <el-table-column prop="provideruser" :label="releasePeople" show-overflow-tooltip width="60" />
          </el-table>
          <el-pagination style="margin-top: 10px;" :current-page.sync="pages.pageNum" :page-sizes="[10, 15, 20]" :page-size="pages.pageSize" background layout="prev, pager, next, jumper, total" :total="pages.total" @current-change="getList()" />
          <!--</el-scrollbar>-->
        </el-col>
      </el-row>
      <div style="margin-top: 10px;">
        <span v-for="(item, index) in selectedAll" :key="index" class="listItem">
          {{item.title }}
          <i @click="deleteSelectedItem(index)" class="el-icon-close"/>
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialogsVisible = false">{{ $t('cancelAction') }}</el-button>
        <el-button type="primary" @click="submit">{{ $t('confirmButton') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBooksList,
  queryReleasedCopy,
  getRuleIframeTree
} from '@/bpa/api/rulesCenter/handbookFiles'
import paginations from '@/bpa/mixins/pagination_mixin'
import fileOperation from '@/bpa/mixins/fileDownView'
import {getFormateDate} from '@/bpa/utils/common'
// import { filter } from 'vue/types/umd'

export default {
  mixins: [paginations, fileOperation],
  data () {
    return {
      // 组织树
      props: {
        label: function (data, node) {
          // if (data.code) {
          //   return data.code+ ' '+ data.foldername
          // } else {
          return data.foldername
          // }
        },
        isLeaf: function (data, node) {
          return data.parent !== true;
        }
      },
      modelid: '',
      booksList: [],
      expandedList: [],
      keyWords: '',
      type: '',
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      pleaseEnterTitle: this.$t('placeholderText.pleaseEnterTitle'),
      releasePeople: this.$t('releasePeople'),
      classificationSystem: this.$t('classificationSystem'),
      effectiveDate: this.$t('effectiveDate'),
      number: this.$t('bpa_number'),
      version: this.$t('version'),
      uploadTime: this.$t('uploadTime'),
      nodeData: {},
      isDialogsVisible: false,
      multipleSelection: [],
      selectedAll: [],
      selectIndex: -1,
      iechoEcho: false,
       filters: [
        { key: "title", opt: "LIKE", type: "S", value: "" },
        { key: "enname", opt: "LIKE", type: "S", value: "" },
        { key: "provideruser", opt: "LIKE", type: "S", value: "" },
        { key: "status", opt: "LIKE", type: "S", value: "" },
        { key: "foldertype", opt: "LIKE", type: "S", value: "" },
        { key: "deptname", opt: "LIKE", type: "S", value: "" },
        { key: "authorname", opt: "LIKE", type: "S", value: "" },
        { key: "system", opt: "LIKE", type: "S", value: "" },]
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    isMore: {
      type: Boolean,
      default: true
    },
    ruleSelected: {
      type: Array,
      default () {
        return []
      }
    }
  },
  mounted () {
    this.getList()
  },
  watch: {
    value (val) {
      this.isDialogsVisible = val
      if (val) {
        this.iechoEcho = true
        this.selectedAll = JSON.parse(JSON.stringify(this.ruleSelected))
      } else {
        this.pages.pageNum = 1
        if(this.isMore){
          this.$refs.multipleTable.clearSelection();
        }
      }
    },
    isDialogsVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    search(){
      this.pages.pageNum = 1
      this.filters = [
          { key: "title", opt: "LIKE", type: "S", value: this.keyWords },
        ];
      this.getList()
    },
    deleteSelectedItem (index) {
      this.iechoEcho = true
      this.booksList.forEach((e, i) => {
        if (e.docId === this.selectedAll[index].docId) {
          this.$refs.multipleTable.toggleRowSelection(e, false)
        }
      })
      this.iechoEcho = false
      this.selectedAll.splice(index, 1)
      this.$forceUpdate()
    },
    nodeClick (data) {
      this.modelid = data.id
      this.type = data.foldername
      this.nodeData = data
      this.getList()
    },
    loadNode (node, resolve) {
      const id = node.data ? node.data.id : '0'
      getRuleIframeTree(id).then(res => {
        if (!res) return false
        if (id === '0') {
          this.expandedList = [res[0].id]
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(res[0].id)
            this.modelid = res[0].id
            this.type = res[0].foldername
            this.nodeData = res[0]
            this.getList()
          })
        }
        resolve(res)
      })
    },
    // 单选
    handleCurrentChange (val) {
      if (val) {
        this.selectIndex = this.booksList.findIndex(item => item.docId === val.docId)
      }
    },
    // 多选
    handleSelectionChange (val) {
      console.log(this.multipleSelection)
      if(!this.iechoEcho){
        this.multipleSelection = val
        this.mergeSelected()
      }
    },
    mergeSelected () {
      let ids = this.multipleSelection.map(item => item.docId)
      let selectedAllIds = this.selectedAll.map(item => item.docId)
      this.multipleSelection.forEach(val=>{
        if(selectedAllIds.indexOf(val.docId) === -1){ //如果list不存在选中的则新增
          this.selectedAll.push(val)
        }
      })
      //获取未选中的listid
      let listIds = this.booksList.filter(item => !ids.includes(item.docId)).map(item=> item.docId)
      //获取未选中listid对应的obj
      let checkList = this.selectedAll.filter(item => !listIds.includes(item.docId));
      console.log(checkList)
      this.selectedAll = checkList
    },
    selectedCheck () {
      this.iechoEcho = true
      this.$refs.multipleTable.clearSelection();
      this.$nextTick(()=>{
        this.booksList.forEach(item => {
          this.selectedAll.forEach(v => {
            if (item.docId === v.docId) {
              if (this.$refs.multipleTable) {
                this.$refs.multipleTable.toggleRowSelection(item, true)
              }
            }
          })
        })
        this.iechoEcho = false
        this.$forceUpdate()
      })
    },
    getList() {
      let obj = {
        orderby:  'createon',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: 'desc',
        attr: { folderid: this.modelid },
        filters: [
          { key:"effectivedate",opt:"LE",type:"D",value:getFormateDate(new Date(), "yyyy-MM-dd hh:mm:ss")},
          { key: "status", opt: "EQ", type: "S", value: "3" },
          { key: "title", opt: "LIKE", type: "S", value: this.keyWords },

        ],
        logic: "and",
      };
      queryReleasedCopy(obj).then((res) => {
        console.log(obj);
        console.log(res);
        if (!res) return false;
        this.booksList = res.list.map((item) => {
          item.effectiveion = !item.effectiveion
            ? ""
            : getFormateDate(item.effectiveion, "yyyy-MM-dd");
          return item;
        });
        this.pages.total = res.total;
        if (this.isMore && this.selectedAll) {
          this.selectedCheck()
        }
      });
      
    },
    submit () {
      if (this.isMore) {
        const data = JSON.parse(JSON.stringify(this.selectedAll))
        this.$emit('confirm', data)
      } else {
        if (this.selectIndex >= 0) {
          const data = JSON.parse(JSON.stringify(this.booksList[this.selectIndex]))
          this.$emit('confirm', data)
        }
      }
      this.isDialogsVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .listItem {
    background: $active-color;
    color: #fff;
    padding: 10px;
    margin: 0 10px 10px 0;
    display: inline-block;
    text-align: center;
    i {
      cursor: pointer;
    }
  }
  .search_component {
    margin-bottom: 15px;
    max-width: 240px;
    vertical-align: middle;
    /deep/ .el-input__inner{
      border-color: #2d42af;
    }
    /deep/ .el-input-group__append {
      background-color: #2d42af;
      border-color: #2d42af;
      &:hover {
        background-color: #5768bf;
        border-color: #5768bf;
      }
      span {
        color: #fff;
      }
    }
  }
  .left_tree_wrapper.el-scrollbar {
    height: 450px!important;
    .custom-tree-node {
      width: calc(100% - 24px);
      display: flex;
      align-items: center;
      box-sizing: border-box;
      p {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .rightPart {
    height: calc(100vh - 160px) !important;
  }
</style>
