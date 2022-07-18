<template>
  <el-dialog
    :title="$t('selectPersonnel')"
    :visible.sync="dialogVisible"
    width="80%"
    append-to-body
    top="2vh">
    <el-row :gutter="18">
      <el-col :span="6" style="height: 400px;overflow: scroll">
        <el-input clearable
          :placeholder="$t('placeholderText.enterKeywordsFiltering')"
          v-model="filterText">
        </el-input>
        <el-tree class="elTree"
          :props="props"
          :data="treeData"
          :load="loadNode"
          lazy
          node-key="id"
          :filter-node-method="filterNode"
          ref="tree"
          @node-click="handleNodeClick">
        </el-tree>
      </el-col>
      <el-col :span="18" style="height: 400px;overflow: scroll">
        <el-table
          v-if="!isMore"
          :data="userData.list"
          border
          :v-loading="pageLoading"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          style="width: 100%; margin-bottom: 10px"
          :highlight-current-row="highlight"
          ref="table"
          @row-click="handleSelectedChange">
          <el-table-column :label="$t('placeholderText.select')" width="100" align="center">
            <template slot-scope="scope">
              <el-radio v-model="selectIndex" :label="scope.$index">{{''}}</el-radio>
            </template>
          </el-table-column>
          <el-table-column
            prop="cnname"
            :label="$t('name2')"
            width="100"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="sex"
            :label="$t('gender')"
            width="100"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{userData.list[scope.$index].sex === '0' ? '男' : '女'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="deptname"
            :label="$t('department')"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="orgname"
            :label="$t('post')"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <el-table
          v-else
          :data="userData.list"
          :v-loading="pageLoading"
          border
          :header-cell-style="{'text-align':'center'}"
          style="width: 100%; margin-bottom: 10px"
          ref="multipleTable"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            prop="cnname"
            align="center"
            :label="$t('name2')"
            width="100"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="sex"
            :label="$t('gender')"
            align="center"
            width="100"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{userData.list[scope.$index].sex === '0' ? '男' : '女'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="deptname"
            align="center"
            :label="$t('department')"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="orgname"
            align="center"
            :label="$t('post')"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :page-size="pageSize"
          :current-page.sync="pageNum"
          :total="userData.total">
        </el-pagination>
      </el-col>
    </el-row>
    <div style="margin-top: 10px;" v-if="selectIndex !== -1 && !isMore">
      <span style="color:#FFFFFF;background:#3792D8;display: inline-block;padding: 5px 10px;">
        {{userData.list[selectIndex].cnname}}<i @click="close" style="margin-left:5px;cursor: pointer;font-weight: 600;" class="el-icon-close"></i>
      </span>
    </div>
    <div style="margin-top: 10px;" v-if="isMore">
      <span v-for="item in multipleSelection" :key="item.id" style="color:#FFFFFF;background:#3792D8;display: inline-block;padding: 5px 10px;margin-right:10px;">
        {{item.cnname}}
      </span>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getFirstOrg, getTotalOrg1, getDirectUserByOrgid } from '@/bpm/api/flow/index'
export default {
  data() {
    return {
      id: 14246,
      orgid: 14246,
      dialogVisible: false,
      highlight: false,
      props: {
        label: 'NAME',
        isLeaf: 'isParent'
      },
      treeData: [],
      userData: {},
      filterText: '',
      selectIndex: -1,
      pageLoading: false,
      multipleSelection: [],
      pageSize: 8,
      pageNum: 1
    }
  },
  props: {
    value: {
      type: Boolean
    },
    redio:{
      type:Number
    },
    isMore: {
      type: Boolean
    },
    itemList: {
      type: Array
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
      if (val) {
        this.selectIndex = -1,
        this.getDepartment()
      }
    },
    dialogVisible(val) {
      this.$emit('input', val)
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.NAME.indexOf(value) !== -1
    },
    toBoolean(val){
    　　switch (val.toLowerCase()){
    　　　　case "true": case 1: case "yes": return true;
    　　　　case "false": case 0: case "no": case null: return false;
    　　　　default:return Boolean(val);
    　　}
    },
    getDepartment() {
      getFirstOrg().then((rt) => {
         rt.data.forEach(item => {
          item.isParent = false
        });
        this.treeData = rt.data
        if (this.treeData.length > 0) {
          this.getUser(this.treeData[0].ID)
        }
      }).catch((er) => {
        console.log(er)
      })
    },
    handleNodeClick(data) {
      this.getUser(data.ID)
    },
    loadNode(node, resolve) {
      if (node.level > 0) {
        getTotalOrg1({
          pid: node.data.ID,
          type: '0,1,2,3'
        }).then((rt) => {
          rt.data.forEach(item => {
          item.isParent = !this.toBoolean(item.isParent)
        });
          resolve(rt.data)
        }).catch((er) => {
          console.log(er)
        })
      }
    },
    getUser(id) {
      this.pageLoading = true
      getDirectUserByOrgid({
        attr: {
          orgid: id
        },
        logic: 'or',
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        filters: []
      }).then((rt) => {
        this.pageLoading = false
        this.userData = rt.data
        if(this.isMore && this.itemList){
          this.check()
        }
      })
    },
    check () {
      let _this = this
      setTimeout(() => {
        _this.userData.list.forEach(item => {
          _this.itemList.forEach(v => {
            if (item.userid === v) {
              if ( _this.$refs.multipleTable) {
                _this.$refs.multipleTable.toggleRowSelection(item, true);
              }
            }
          });
        });
      }, 100);
    },
    handleCurrentChange(val) {
      this.selectIndex = -1
      this.getUser()
    },
    handleSelectedChange(val) {
      if (val) {
        this.highlight = true
        this.selectIndex = this.userData.list.findIndex(item => item.cnname === val.cnname)
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    close(i) {
      this.highlight = false
      this.selectIndex = -1
    },
    confirm() {
      this.dialogVisible = false
      if (this.isMore) {
        this.$emit('confirm', this.multipleSelection)
      } else {
        if (this.selectIndex > -1) {
          this.$emit('confirm', [this.userData.list[this.selectIndex]])
        } else {
          this.$emit('confirm', [])
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
