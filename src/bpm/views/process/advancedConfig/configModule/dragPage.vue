<template>
  <el-dialog
    title="选择页面"
    :visible.sync="dialogVisible"
    width="50%"
    append-to-body
    class="userDialog"
    top="2vh">
    <el-row :gutter="18">
      <el-col :span="24" style="height: 400px;">
        <el-table
          v-if="!isMore"
          :data="userData.list"
          border
          :v-loading="pageLoading"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          style="width: 100%; margin-bottom: 10px"
          :highlight-current-row="highlight"
          @row-click="handleSelectedChange">
          <el-table-column :label="$t('placeholderText.select')" width="100" align="center">
            <template slot-scope="scope">
              <el-radio v-model="selectIndex" :label="scope.$index">{{''}}</el-radio>
            </template>
          </el-table-column>
          <el-table-column
            prop="cnname"
            label="页面名称"
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
            :label="$t('menuName')"
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
import { getTotalOrg1, getDirectUserByOrgid } from '@/bpm/api/flow/index'
export default {
  data() {
    return {
      id: 14246,
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
    isMore: {
      type: Boolean
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
      if (val) {
        this.getDepartment()
        this.getUser()
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
      getTotalOrg1({
        pid: this.id,
        type: '0,1,2,4'
      }).then((rt) => {
          rt.data.forEach(item => {
          item.isParent = false
        });
        this.treeData = rt.data
      }).catch((er) => {
        console.log(er)
      })
    },
    handleNodeClick(data) {
    },
    loadNode(node, resolve) {
      if (node.level > 0) {
        getTotalOrg1({
          pid: node.data.ID,
          type: '0,1,2,4'
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
    getUser() {
      this.pageLoading = true
      getDirectUserByOrgid({
        attr: {
          orgid: 40436
        },
        logic: 'or',
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        filters: []
      }).then((rt) => {
        this.pageLoading = false
        this.userData = rt.data
      })
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
<style lang="scss">
  .userDialog{
    .el-input__inner{
      // border: 0;
      border-bottom: 1px solid #e5e5e5;
    }
  }
</style>

<style lang="scss" scoped>

</style>
