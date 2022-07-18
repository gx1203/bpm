<template>
  <el-dialog
    :title="$t('selectPersonnel')"
    class="SelectPeople"
    :visible.sync="dialogVisible"
     append-to-body
    width="80%"
    top="2vh">
    <el-row :gutter="18">
      <el-col :span="6">
        <treeOrganization :isForm='isForm'  @confirm="handleNodeClick" />
      </el-col>
      <el-col :span="18">
        <el-row class="searchIcon">
          <el-col :span="8">
            <el-input clearable @keyup.enter.native="getUser(checkTree.id ? checkTree.id : treeData[0].id)" placeholder="请输入内容" v-model="searchName" class="input-with-select" style="color:#fff;background-color: #2d42af;">
              <el-button @click="getUser(checkTree.id ? checkTree.id : treeData[0].id)" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
        </el-row>
        <el-table
          v-if="!isMore"
          :data="content.list"
          border
          v-loading="pageLoading"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          style="width: 100%; margin: 10px 0"
          :highlight-current-row="highlight"
          @row-click="handleSelectedChange">
          <el-table-column :label="$t('placeholderText.select')" width="100" align="center">
            <template slot-scope="scope">
              <el-radio v-model="selectIndex" :label="scope.$index">{{''}}</el-radio>
            </template>
          </el-table-column>
          <el-table-column
            prop="empuid"
            label="工号"
             align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="displayname"
            :label="$t('name')"
             align="center"
            show-overflow-tooltip>
          </el-table-column>
            <el-table-column
            prop="deptName"
            :label="$t('department')"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
            <el-table-column
            prop="positionName"
            :label="$t('post')"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <el-table
          v-else
          :data="content.list"
          v-loading="pageLoading"
          border
          :header-cell-style="{'text-align':'center'}"
          style="width: 100%; margin: 10px 0"
          ref="multipleTable"
          tooltip-effect="dark"
          :row-key="getRowKey"
          @selection-change	="handleSelectionChange">
          <el-table-column
            type="selection"
            :reserve-selection="true"
            align="center"
            width="100">
          </el-table-column>
           <el-table-column
            prop="empuid"
            label="工号"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="displayname"
            :label="$t('name')"
            align="center"
            show-overflow-tooltip>
          </el-table-column>

          <el-table-column
            prop="deptName"
            :label="$t('department')"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
            <el-table-column
            prop="positionName"
            :label="$t('post')"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          v-if="content.list && content.list.length > 0"
          @current-change="handleCurrentChange"
          :page-size="pageSize"
          :current-page.sync="pageNum"
          :total="content.total">
        </el-pagination>
      </el-col>
    </el-row>
    <div style="margin-top: 10px;" v-if="selectIndex !== -1 && !isMore">
      <span class="checkList">
        {{content.list[selectIndex].displayname}}<i @click="close" style="margin-left:5px;cursor: pointer;font-weight: 600;" class="el-icon-close"></i>
      </span>
    </div>
    <div style="margin-top: 10px;" v-if="isMore">
      <span class="checkList" v-for="(item, index) in userAll" :key="index" style="margin:0 10px 10px 0;">
        {{item.displayname}}<el-button @click="del(index)" icon="el-icon-delete" type="text" :title="$t('delete')" style="color: #fff;margin-left: 5px;"></el-button>
      </span>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getAllRootTree, findOrgUsers ,getAllRootTreeByUser } from '@/bpm/api/configManage/institutionalFramework/organization'
import treeOrganization from '@/bpm/components/treeOrganization'
export default {
  components: {
    treeOrganization
  },
  data () {
    return {
      id: 14246,
      orgid: 14246,
      dialogVisible: false,
      highlight: false,
      content: {},
      props: {
        label: 'NAME',
        isLeaf: 'isParent'
      },
      treeData: [],
      selectIndex: -1,
      pageLoading: false,
      iechoEcho:false,
      multipleSelection: [],
      pageSize: 10,
      pageNum: 1,
      searchName: '',
      checkTree: {}
    }
  },
  props: {
    value: {
      type: Boolean
    },
    isMore: {
      type: Boolean
    },
    isForm:{
      type : String,
      default: 'noForm'
    },
    itemList: {
      type: Array
    },
    radioChecked:{
      type : String,
      default: ''
    },
    userAll: {
      type: Array,
      default () {
        return []
      }
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
      if (val) {
        this.$nextTick(()=>{
          if(this.isMore){
            this.$refs.multipleTable.clearSelection();
          }
        })
        this.iechoEcho = true
        this.pageNum = 1
        this.multipleSelection = JSON.parse(JSON.stringify(this.userAll))
        this.getDepartment()
      }
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
     getRowKey (row) {
      return row.id
    },
    defaultCheck () {
      if(this.radioChecked){
        this.selectIndex = this.content.list.findIndex(item => item.empuid === this.radioChecked)
      }else{
        this.selectIndex = -1
      }
    },
    del (index) {
      this.iechoEcho = true
      this.content.list.forEach((e, i) => {
        if (e.empuid === this.userAll[index].empuid) {
          this.$refs.multipleTable.toggleRowSelection(e,false)
        }
      })
      this.iechoEcho = false
      this.userAll.splice(index, 1)
      this.$forceUpdate()
    },
    mergeUser () {
      let _this = this
      let _ids = _this.content.list.map(item=>item.empuid)
      let _userIds = _this.multipleSelection.map(item=>item.empuid)
      let _userAllIds = _this.userAll.map(item=>item.empuid)
      _this.multipleSelection.forEach(val=>{
        if(_userAllIds.indexOf(val.empuid) === -1){ //如果list不存在选中的则新增
          _this.userAll.push(val)
        }
      })
      // let _list = _this.content.list.filter(item=>!_this.multipleSelection.some(ele=>ele.empuid!==item.empuid))
      //获取未选中的listid
      let _listIds = _this.content.list.filter(item => !_userIds.includes(item.empuid)).map(item=> item.empuid)
      //获取未选中listid对应的obj
      let checkList = _this.userAll.filter(item => !_listIds.includes(item.empuid));
      console.log(checkList)
      _this.userAll = checkList

    },

    getDepartment () {
      this.selectIndex = -1
      getAllRootTreeByUser(this.isForm).then((rt) => {
        if (rt.data.length > 0) {
          rt.data.forEach(item => {
            item.NAME = item.name
            item.ID = item.id
            item.TYPE = item.type
          })
          this.treeData = rt.data
          this.getUser(this.treeData[0].id)
        }
      }).catch((er) => {
        console.log(er)
      })
    },
    handleNodeClick (data) {
      this.checkTree = data
      this.getUser(data.id)
    },
    getUser (id) {
      this.pageLoading = true
      let _this = this
      findOrgUsers({
        logic: 'or',
        filters: [
          {'key': 'displayname',
            'opt': 'LIKE',
            'type': 'S',
            'value': _this.searchName
          },
          {'key': 'empuid',
            'opt': 'LIKE',
            'type': 'S',
            'value': _this.searchName
          }
        ],
        pageNum: _this.pageNum,
        pageSize: _this.pageSize
      }, id, false).then(rt => {
        rt.data.list.forEach(e => {
          e.cnname = e.displayname
        })
        _this.content = rt.data
        if (_this.isMore && _this.itemList) {
          _this.check()
        }
        if (_this.isMore && _this.userAll) {
          _this.userCheck()
        }
        if (!_this.isMore && _this.radioChecked) {
          _this.defaultCheck()
        }
        _this.pageLoading = false
      }).catch(() => {
        _this.pageLoading = false
      })
    },
    check () {
      let _this = this
      this.$nextTick(()=>{
        _this.content.list.forEach(item => {
          _this.itemList.forEach(v => {
            if (item.empuid === v) {
              if (_this.$refs.multipleTable) {
                _this.$refs.multipleTable.toggleRowSelection(item, true)
              }
            }
          })
        })
      })
    },
    userCheck () {
      let _this = this
      this.iechoEcho = true
      _this.$refs.multipleTable.clearSelection();
        this.$nextTick(()=>{
        _this.content.list.forEach(item => {
            _this.userAll.forEach(v => {
              if (item.empuid === v.empuid) {
                if (_this.$refs.multipleTable) {
                  _this.$refs.multipleTable.toggleRowSelection(item, true)
                }
              }
            })
          })
          this.iechoEcho = false
        this.$forceUpdate()
    })
    },

    handleCurrentChange (val) {
      this.selectIndex = -1
      this.getUser(this.checkTree.id ? this.checkTree.id : this.treeData[0].id)
      // this.mergeUser()
    },
    handleSelectedChange (val) {
      if (val) {
        this.highlight = true
        this.selectIndex = this.content.list.findIndex(item => item.displayname === val.displayname)
      }
    },
    handleSelectionChange (val,row) {
      if(!this.iechoEcho){
        this.multipleSelection = val
        this.mergeUser()
      }
    },
    close (i) {
      this.highlight = false
      this.selectIndex = -1
    },
    confirm () {
      if (this.isMore) {
        this.$emit('confirm', this.userAll)
      } else {
        if (this.selectIndex > -1) {
          this.$emit('confirm', [this.content.list[this.selectIndex]])
        } else {
          this.$emit('confirm', [])
        }
      }
    }
  }
}
</script>
<style lang="scss">
  .SelectPeople{
    .flow-item input.el-input__inner{
      border: 1px solid $dc1
    }
  }
</style>

<style lang="scss" scoped>
  .SelectPeople .checkList {
    color:#FFFFFF;
    background:#3792D8;
    display: inline-block;
    padding: 5px 10px;
  }
  // .searchIcon {
  //   & /deep/ .el-input-group__append {
  //     color: rgb(255, 255, 255);
  //     background-color: rgb(7, 150, 249);
  //     border: 0;
  //   }
  //   & /deep/ .el-input__inner{
  //     color: #2d42af;
  //     border: 1px solid #2d42af;
  //     border-top-left-radius: 2px;
  //   }
  //
