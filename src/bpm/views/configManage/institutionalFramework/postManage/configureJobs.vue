<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" append-to-body>
  <el-card shadow="never" id="configureJobs">
    <div class="margin-t10" v-loading='loading'>
      <!-- <el-form>
        <el-form-item :label="$t('judgmentLogic') + '：'">
          <el-radio-group v-model="radio">
            <el-radio :label="1">
              满足
              <span class="required">所有</span> 条件和子组合
            </el-radio>
            <el-radio :label="2">
              满足
              <span class="required">任一</span> 条件或者子组合
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>-->
      <!-- <el-checkbox v-model="checkAll" class="all-check" /> -->
      <!-- <el-table :data="content.list" border tooltip-effect="dark" style="width:100%;margin:15px 0;">
        <el-table-column :label="$t('controlType')" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <el-select clearable v-model="scope.row.type" class="w100" :placeholder="$t('placeholderText.pleaseSelect')">
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column :label="$t('conditionType')" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <el-select clearable v-model="scope.row.type" class="w100" :placeholder="$t('placeholderText.pleaseSelect')">
              <el-option
                v-for="item in judgingList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center">
          <template slot="header">
            <span class="required">*</span>
            条件结果
          </template>
          <template slot-scope="scope">
            <el-input clearable v-model="scope.row.name"></el-input>
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')" show-overflow-tooltip align="center" width="120">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-delete" @click="deleteList(scope.$index)"></el-button>
          </template>
        </el-table-column>
      </el-table>-->
      <el-input clearable class="margin-b10 w120" :placeholder="$t('placeholderText.enterKeywordsFiltering')" v-model="filterText"></el-input>
      <el-tree class="elTree"
        v-if="isFilter"
        style="height: 400px; overflow: auto;"
        :props="props"
        :data="treeData"
        :load="loadNode"
        key="0"
        :default-checked-keys="checkList"
        :default-expanded-keys="checkList"
        @check-change	= "checkHandle"
        show-checkbox
        check-strictly
        lazy
        node-key="id"
        :filter-node-method="filterNode"
        ref="tree"
      >
        <span class="custom-tree-node" slot-scope="{ node, data}">
          <span>{{ node.label }}</span>
          <span v-if="data.type === '0'">({{ $t('organization') }})</span>
          <span v-else-if="data.type === '1'">({{ $t('company') }})</span>
          <span v-else-if="data.type === '2'">({{ $t('department') }})</span>
          <span v-else>({{ $t('post') }})</span>
        </span>
      </el-tree>
       <el-tree class="elTree"
        v-else
        style="height: 400px; overflow: auto;"
        :props="props"
        :data="treeData"
        :default-expand-all="true"
        key="1"
        :default-checked-keys="checkList"
        :default-expanded-keys="checkList"
        @check-change	= "checkHandle"
        show-checkbox
        check-strictly
        node-key="id"
        :filter-node-method="filterNode"
        ref="tree"
      >
        <span class="custom-tree-node" slot-scope="{ node, data}">
          <span>{{ node.label }}</span>
          <span v-if="data.type === '0'">({{ $t('organization') }})</span>
          <span v-else-if="data.type === '1'">({{ $t('company') }})</span>
          <span v-else-if="data.type === '2'">({{ $t('department') }})</span>
          <span v-else>({{ $t('post') }})</span>
        </span>
      </el-tree>
      <!-- <div class="text-r">
        <el-button type="primary" @click="saveData">{{ $t('save') }}</el-button>
      </div> -->

    </div>
    <!-- <div style="margin-top: 10px;" v-if="checkData && checkData.length > 0">
      <span class="checkList" v-for="(item, index) in checkData" :key="index">
       {{item.name}}<i @click="close(index)" style="margin-left:5px;cursor: pointer;font-weight: 600;" class="el-icon-close"></i>
      </span>
    </div> -->
  </el-card>
   <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible=false; checkData = []">{{ $t('shutDown') }}</el-button>
      <!--<el-button type="primary" @click="saveData">确 定</el-button>-->
    </span>
  </el-dialog>
</template>
<script>
import { getAllRootTree, getChildren, searchQueryTree } from '@/bpm/api/configManage/institutionalFramework/organization.js'
import {
  getPostGroup,
  savePositionsCondition,
  savePostOrg,
  delpostorg,
  savepostorgs,
  getPostIds
} from '@/bpm/api/configManage/institutionalFramework/post_manage'
export default {
  components: {},
  data () {
    return {
      loading: false,
      radio: 1,
      typeList: [],
      content: {
        list: [{}]
      },
      dialogVisible: this.value,
      checkList: [],
      isFilter: true,
      checkedData: {},
      props: {
        label: 'name',
        isLeaf: 'isParent',
        children: 'subNodes'
      },
      treeData: [],
      filterText: '',
      checkData: []
    }
  },
  props: {
    itemid: {
      type: String
    },
    title: {
      type: String
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    filterText (val) {
      this.filterFun()
    },
    value (val) {
      this.dialogVisible = val
      if (val) {
        this.filterText=''
        this.checkData = []
        this.getDepartment()
      }
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
   checkHandle(node,isCheck){
     this.checkData = this.$refs.tree.getCheckedNodes()
     if(isCheck){
       this.saveCheck(node)
     }else{
       this.delCheck(node)
     }
   },
   delCheck(item){
    delpostorg({
         'postId': this.itemid,
         'orgId':item.id
      })
        .then(rt => {
        })
        .catch(() => {
          this.$message({
            message: this.$t('hintText.failToSave'),
            type: 'error'
          })
        })
   },
   saveCheck(item){
       savepostorgs({
         'postId': this.itemid,
         'orgId':item.id
      })
        .then(rt => {
        })
        .catch(() => {
          this.$message({
            message: this.$t('hintText.failToSave'),
            type: 'error'
          })
        })
   },
    saveData () {
      savePostOrg({
        orgids:  Array.from(new Set([...this.checkList,...this.$refs.tree.getCheckedKeys()])),
        id: this.itemid
      })
        .then(rt => {
          if (rt.status === '200') {
            this.$message({
              message: this.$t('hintText.saveSuccessfully'),
              type: 'success'
            })
            this.dialogVisible = false
            this.$emit('confirm', true)
          } else {
            this.$message({
              message: this.$t('hintText.failToSave'),
              type: 'error'
            })
          }
        })
        .catch(() => {
          this.$message({
            message: this.$t('hintText.failToSave'),
            type: 'error'
          })
        })
    },
    // deleteList(index) {
    //   this.content.list.splice(index, 1);
    // },
    clickRadioNode (event) {
      if (event) event.preventDefault()
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getDepartment () {
      this.loading = true
      getAllRootTree()
        .then(rt => {
          rt.data.forEach(item => {
            // item.isParent = false
            item.id = Number(item.id)
            if (item.type !== '3') {
              item.disabled = true
            }
          })
          this.treeData = rt.data
          return getPostIds(this.itemid)
        })
        .then(rt => {
          this.loading = false
          this.$refs.tree.setCheckedKeys([])
          this.checkList = rt.data.map(item=>Number(item))
          // this.treeData = rt.data;
        })
        .catch(er => {
          this.loading = false
          console.log(er)
        })
    },
    toBoolean (val) {
      switch (val.toLowerCase()) {
        case 'true':
        case 1:
        case 'yes':
          return true
        case 'false':
        case 0:
        case 'no':
        case null:
          return false
        default:
          return Boolean(val)
      }
    },
    filterFun(){
      if(this.filterText){
        searchQueryTree(this.filterText).then(rt => {
          this.treeData = rt.data;
          this.isFilter = false;
        }).catch(er => {
        });
      }else{
        this.isFilter = true;
        this.getDepartment()
      }
    },
    loadNode (node, resolve) {
      if (node.level > 0) {
        getChildren(node.data.id)
          .then(rt => {
            if (rt.data && rt.data.length > 0) {
              for (let i = 0; i < this.checkList.length; i++) {
                rt.data.map(item => {
                  if (item.type === '3') {
                    if (Number(item.id) === this.checkList[i]) {
                      this.checkData.push({
                        id: item.id,
                        pid: item.pid,
                        name: item.name
                      })
                    }
                  }
                })
              }
            }
            rt.data.forEach(item => {
              // item.isParent = !this.toBoolean(item.isParent)
              item.id = Number(item.id)
              if (item.type !== '3') {
                item.disabled = true
              }
            })
            resolve(rt.data)
          })
          .catch(er => {
            console.log(er)
          })
      }
    },
    close (index) {
      this.checkData.splice(index, 1)
      let ids = this.checkData.map(item => item.id)
      this.$refs.tree.setCheckedKeys(ids)
      this.$forceUpdate()
    }
    // handleNodeClick(data) {
    //   this.checkedData = data;
    // }
  }
}
</script>

<style lang="scss" scoped>
.table-header {
  position: relative;
  background: $bc2;
  display: flex;
  align-items: center;
  .all-check {
    position: absolute;
    left: 10px;
    top:10px;
  }
}
.w120{
  width: 280px;
}
.w100 {
  width: 100%;
}
.checkList {
  color:#FFFFFF;
  background:#3792D8;
  display: inline-block;
  padding: 5px 10px;
  margin: 8px;
}
</style>
<style lang="scss">
#configureJobs{
  .el-input__inner {
    // border: none;
    border-bottom: 1px solid #e5e5e5;
}
}
</style>
