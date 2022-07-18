<template>
  <el-card id="organization" shadow="never" class="card-reset">
    <div class="item-left" :class="isfullScreen ? 'fullScreen' : ''">
      <div class="fullScreen_layout">
        <el-row type="flex">
          <el-input
            class="organization-search-input"
            clearable
            maxlength="20"
            v-model="filterText"
            :placeholder="$t('orgName') + '、' + $t('orgCode')"
          />
          <!-- <el-button type="primary" @click="addDimensionality">
            {{ $t('dimension') }} </el-button
          >&nbsp; -->
          <el-tooltip>
            <span v-if="!isfullScreen" slot="content"> CTRL+F11 </span>
            <span v-else slot="content"> ESC </span>
            <i
              class="iconfont icon-quanping font28"
              :class="isfullScreen ? 'icon-guanbiquanping' : 'icon-quanping'"
              @click="fullScreen"
            />
          </el-tooltip>
        </el-row>
        <div style="height: calc(100vh - 300px); overflow: auto">
          <el-tree
            v-if="isFilter"
            key="1"
            class="elTree"
            ref="tree"
            :props="props"
            :data="treeData"
            :load="loadNode"
            highlight-current
            lazy
            node-key="id"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
            draggable
            :allow-drag="allowDrag"
            :allow-drop="allowDrop"
            @node-drop="handleDrop"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <i v-if="data.type === '0'" />
              <i v-else-if="data.type === '1'" class="iconfont icon-gongsi" />
              <i v-else-if="data.type === '2'" class="iconfont icon-bumen" />
              <i v-else-if="data.type === '3'" class="iconfont icon-drxx12" />
              <i v-else class="iconfont icon-bumen" />
              <span>{{ node.label }}</span>
              <span>
                <el-button
                  icon="el-icon-edit"
                  :title="$t('hintText.editCurrentEntry')"
                  type="text"
                  v-if="data.type === '0'"
                  @click.stop="add(data, $t('hintText.editCurrentEntry'))"
                />
                <el-button
                  v-if="data.type !== '3'"
                  icon="el-icon-circle-plus"
                  :title="$t('hintText.addSubentry')"
                  type="text"
                  @click.stop="add(data, $t('hintText.addSubentry'))"
                />
                <el-button
                  v-if="data.type !== '0'"
                  icon="el-icon-delete"
                  :title="$t('hintText.deleteCurrentEntry')"
                  type="text"
                  @click.stop="del(data, $t('hintText.currentEntry'))"
                />
                <!-- <el-button
                  v-if="data.type != 0 && data.type !== '3'"
                  icon="el-icon-circle-close"
                  :title="$t('hintText.deleteCurrentEntryAndChildNodes')"
                  type="text"
                  @click.stop="del(data, $t('childNode'))"
                /> -->
              </span>
            </span>
          </el-tree>
          <el-tree
            v-else
            key="2"
            class="elTree"
            ref="tree"
            :props="props"
            :data="treeData"
            highlight-current
            default-expand-all
            node-key="id"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
            draggable
            :allow-drag="allowDrag"
            :allow-drop="allowDrop"
            @node-drop="handleDrop"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <i v-if="data.type === '0'" />
              <i v-else-if="data.type === '1'" class="iconfont icon-gongsi" />
              <i v-else-if="data.type === '2'" class="iconfont icon-bumen" />
              <i v-else-if="data.type === '3'" class="iconfont icon-drxx12" />
              <i v-else class="iconfont icon-bumen" />
              <span>{{ node.label }}</span>
              <span>
                <el-button
                  icon="el-icon-edit"
                  :title="$t('hintText.editCurrentEntry')"
                  type="text"
                  v-if="data.type === '0'"
                  @click.stop="add(data, $t('hintText.editCurrentEntry'))"
                />
                <el-button
                  icon="el-icon-circle-plus"
                  :title="$t('hintText.addSubentry')"
                  type="text"
                  @click.stop="add(data, $t('hintText.addSubentry'))"
                />
                <el-button
                  v-if="data.type != 0"
                  icon="el-icon-delete"
                  :title="$t('hintText.deleteCurrentEntry')"
                  type="text"
                  @click.stop="del(data, $t('hintText.currentEntry'))"
                />
                <!-- <el-button
                  v-if="data.type != 0"
                  icon="el-icon-circle-close"
                  :title="$t('hintText.deleteCurrentEntryAndChildNodes')"
                  type="text"
                  @click.stop="del(data, $t('childNode'))"
                /> -->
              </span>
            </span>
          </el-tree>
        </div>
      </div>
    </div>
    <div v-show="checkData.type" class="item-right">
      <div class="tool-wrap">
        <el-upload
          class="margin-r10"
          style="display: inline-block"
          accept=".xlsx,.xls"
          :action="action"
          :data="{
            id: this.checkData.id
          }"
          :on-success="handlerSuccess"
          :before-upload="beforeAvatarUpload"
          :show-file-list="false"
          :headers="myHeaders"
          :disabled="checkData.type !== '0'"
        >
          <el-button type="primary" @click="isUpload"> 导入 </el-button>
        </el-upload>
        <el-button type="primary" :loading="exportLoading" @click="exportFile"
          >导出{{ exportLoading ? '中' : '' }}</el-button
        >
        <el-button
          type="primary"
          :loading="downloadLoading"
          @click="downloadFile"
        >
          {{ downloadLoading ? '下载中' : '下载模板' }}
        </el-button>
        <el-button type="primary" @click="tocanvans"> 架构图 </el-button>
      </div>
      <el-tabs v-model="editableTabsValue" type="card">
        <el-tab-pane :label="$t('hintText.orgTabOrgInfo')" name="1">
      <!--
      <org-info-tab
            ref="OrgInfoTab"
            v-show="checkData.type === '1'"
            :selected-id="checkData.type === '1' ? checkData.id : ''"
          />
          <org-dept-info-tab
            v-show="checkData.type === '2'"
            :selected-id="checkData.type === '2' ? checkData.id : ''"
          />
          <org-post-info-tab
            v-show="checkData.type === '3'"
            :selected-id="checkData.type === '3' ? checkData.id : ''"
          />
          -->
          <org-one-info-tab
            v-show="checkData.type !== '0'"
            :selected-id="checkData.id"/>
        </el-tab-pane>
        <el-tab-pane :label="$t('hintText.subordinateOrganization')" name="2">
          <child-org-info-tab ref="childOrgInfoTab" :selected="checkData" />
        </el-tab-pane>
        <el-tab-pane :label="$t('hintText.orgTabMember')" name="3">
          <departmentTtaffManage
            ref="departmentTtaffManage"
            :check-data="checkData"
            is-handle="1"
          />
        </el-tab-pane>

        <!--        <el-tab-pane :label="$t('hintText.usersUnderCurrentNode')" name="1">-->
        <!--          <departmentTtaffManage-->
        <!--            :check-data="checkData"-->
        <!--            :is-handle="editableTabsValue"-->
        <!--          />-->
        <!--        </el-tab-pane>-->
        <!--        <el-tab-pane-->
        <!--          :label="$t('hintText.manageUsersUnderCurrentNode')"-->
        <!--          name="2"-->
        <!--          v-if="checkData.type === '3'"-->
        <!--        >-->
        <!--          <departmentTtaffManage-->
        <!--            :check-data="checkData"-->
        <!--            :is-handle="editableTabsValue"-->
        <!--          />-->
        <!--        </el-tab-pane>-->
      </el-tabs>
    </div>
    <pic-dialog
      v-model="picdialogVisible"
      :headdata="headdata"
      :groupid="checkData.id"
    ></pic-dialog>
    <organization-dialog
      v-model="dialogVisible"
      :title="linkTitle"
      :item="itemData"
      @confirm="refTree"
    />
    <addChild
      v-model="addDialog"
      :title="linkTitle"
      :detail="itemData"
      @confirm="refTree"
    />
  </el-card>
</template>
<script>
import departmentTtaffManage from './departmentTtaffManage/index'
import organizationDialog from './organizationDialog'
import picDialog from './picDialog'
import addChild from './addChildNew'
// import { , getTotalOrg1 } from '@/bpm/api/flow/index'
import {
  getAllRootTree,
  getChildren,
  deleteTreeOne,
  deleteTreeAll,
  searchQueryTree,
  moveTree,
  queryPath,
  disableOrgTree,
  findOrgUsers
} from '@/bpm/api/configManage/institutionalFramework/organization'
import axios from 'axios'
// import OrgInfoTab from './components/orgCompanyInfoTab'
// import OrgDeptInfoTab from './components/orgDeptInfoTab'
// import OrgPostInfoTab from './components/orgPostInfoTab'
import OrgOneInfoTab from './components/orgOneInfoTab'
import ChildOrgInfoTab from './components/childOrgInfoTab'
export default {
  name: 'InstitutionalOrganization',
  components: {
    ChildOrgInfoTab,
    // OrgPostInfoTab,
    // OrgDeptInfoTab,
    // OrgInfoTab,
    OrgOneInfoTab,
    picDialog,
    departmentTtaffManage,
    organizationDialog,
    addChild
  },
  data() {
    return {
      headdata: {},
      filterText: '',
      isFilter: true,
      isfullScreen: false,
      editableTabsValue: '1',
      dialogVisible: false,
      addDialog: false,
      picdialogVisible: false,
      linkTitle: '',
      itemData: {},
      props: {
        label: 'name',
        // isLeaf: 'isParent',
        isLeaf: function (data, node) {
          if (data.parent) {
            return false
          } else {
            return true
          }
        },
        children: 'subNodes'
      },
      treeData: [],
      radioNode: '',
      checkData: {},
      checkNode: {},
      checkResolve: {},
      exportLoading: false,
      downloadLoading: false,
      myHeaders: { token: localStorage.getItem('token') }
    }
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    action() {
      return `${this.host}/orgTreeExtend/upload`
    }
  },
  watch: {
    filterText(val) {
      this.filterFun()
    }
  },
  mounted() {
    this.getDepartment()
    // 监听键盘按键事件
    const self = this
    this.$nextTick(function() {
      document.addEventListener('keyup', function(e) {
        if (e.keyCode == 27 && self.isfullScreen) {
          self.isfullScreen = false
          return
        }
        if (e.ctrlKey && e.keyCode == 122) {
          self.isfullScreen = true
          return false
        }
      })
    })
  },
  methods: {
    tocanvans() {
      this.picdialogVisible = true
    },
    isUpload() {
      if (this.checkData.type !== '0') {
        this.$message({
          type: 'warning',
          message: '请选择维度'
        })
      }
    },
    beforeAvatarUpload(file) {
      const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (extension !== 'xlsx' && extension !== 'xls') {
        this.$message({
          type: 'warning',
          message: '请上传.xlsx/.xls 文件'
        })
        return false
      }
    },
    handlerSuccess(rt) {
      console.log(rt)
      if (rt.status === '200' && rt.data) {
        this.getDepartment()
      } else {
        this.$message({
          type: 'warning',
          message: this.$t('hintText.attachmentUploadedfailed')
        })
      }
    },
    exportFile() {
      if (this.checkData.type !== '0') {
        this.$message({
          type: 'warning',
          message: '请选择维度'
        })
        return
      }
      this.exportLoading = true
      axios({
        method: 'post',
        url: `${this.host}/orgTreeExtend/export`,
        data: {
          id: this.checkData.id
        },
        responseType: 'blob'
      })
        .then(res => {
          console.log(res)
          this.exportLoading = false
          const blob = new Blob([res.data], {
            type: 'application/vnd.ms-excel'
          })
          console.log(blob)
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // 兼容TMD IE
            navigator.msSaveBlob(blob, this.downloadName)
          } else {
            // 其他浏览器
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', this.checkData.name + '.xls')
            document.body.appendChild(link)
            link.click()
            window.URL.revokeObjectURL(link.href)
          }
        })
        .catch(err => {
          this.exportLoading = false
        })
    },
    downloadFile() {
      this.downloadLoading = true
      axios({
        method: 'get',
        url: `${this.host}/orgTreeExtend/download`,
        responseType: 'blob'
      })
        .then(res => {
          this.downloadLoading = false
          const blob = new Blob([res.data], {
            type: 'application/vnd.ms-excel'
          })
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // 兼容TMD IE
            navigator.msSaveBlob(blob, this.downloadName)
          } else {
            // 其他浏览器
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', '九彩云BPM组织机构导入导出模板.xls')
            document.body.appendChild(link)
            link.click()
            window.URL.revokeObjectURL(link.href)
          }
        })
        .catch(() => {
          this.downloadLoading = false
        })
    },
    fullScreen() {
      this.isfullScreen = !this.isfullScreen
    },
    allowDrag(draggingNode) {
      return draggingNode.data.type !== '0'
    },
    allowDrop(draggingNode, dropNode) {
      return dropNode.data.type !== '0'
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log(draggingNode, dropNode, dropType, ev)
      moveTree(
        draggingNode.data.id,
        dropType === 'inner' ? dropNode.data.id : dropNode.parent.data.id
      ).then(rt => {
        if (rt.status === '200') {
          this.$message.success(this.$t('hintText.moveSuccessfully'))
          let data = {
            pid:
              dropType === 'inner' ? dropNode.data.id : dropNode.parent.data.id
          }
          this.refNode(data)
        }
      })
    },
    add(item, data) {
      this.itemData = Object.assign({}, item)
      this.linkTitle = data
      if (data === this.$t('hintText.editCurrentEntry') && item.type === '0') {
        this.dialogVisible = true
      } else {
        this.addDialog = true
      }
    },
    del(item, data) {
      if (data === this.$t('hintText.currentEntry')) {
        this.$confirm(
          this.$t('hintText.areYouSureYouWantToDeleteCurrentEntry'),
          this.$t('hintText.hint'),
          {
            type: 'warning'
          }
        )
          .then(async () => {
            let rt = await getChildren(item.id)
            if (rt.data && rt.data.length !== 0) {
              this.$message.error(
                this.$t(
                  'hintText.theCurrentEntryHasSubEntriesNotAllowedToDeleted'
                )
              )
              return false
            }
            let res = await findOrgUsers({}, item.id, false)
            if (res.data && res.data.list.length !== 0) {
               this.$message.error('当前组织下存在人员不允许删除！！')
                return false
            }
            let resp = await disableOrgTree(item.id)
            if (resp.status === '200') {
              this.$message.success(this.$t('hintText.successfullyDelete'))
              this.refNode(item)
              if (item.id === this.checkData.id) {
                this.checkData ={}
              }
            }
          })
          .catch(() => {})
      } else if (data === this.$t('childNode')) {
        this.$confirm(
          this.$t('hintText.areYouSureYouWantToDeleteCurrentNodeAndChildNodes'),
          this.$t('hintText.hint'),
          {
            type: 'warning'
          }
        )
          .then(() => {
            disableOrgTree(item.id).then(rt => {
              if (rt.status === '200') {
                this.$message.success(this.$t('hintText.successfullyDelete'))
                this.refNode(item)
              }
            })
          })
          .catch(_ => {})
      }
    },
    refNode(item) {
      console.log(item)
      if (item.type == 0) {
        this.getDepartment()
      } else {
        const node = this.$refs.tree.getNode(item.pid) // 通过节点id找到对应树节点对象
        node.loaded = false
        node.expand() // 主动调用展开节点方法，重新{{ $t('query') }}该节点下的所有子节点
      }
    },
    refTree(data) {
      console.log(data)
      if (data.type === '0') {
        this.isFilter = true
        this.filterText = ''
        this.filterFun()
      }
      if (this.isFilter) {
        const node = this.$refs.tree.getNode(this.itemData.id) // 通过节点id找到对应树节点对象
        this.$set(data, 'pid', node.data.id)
        if (this.linkTitle === this.$t('hintText.editCurrentEntry')) {
          this.$set(node.data, 'name', data.name)
        } else {
          this.$refs.tree.append(data, node)
          this.refNode(data)
        }
      } else {
        this.filterFun()
      }
      // console.log(this.$refs.childOrgInfoTab)
      this.$refs.childOrgInfoTab.getList()
      // this.$refs.OrgInfoTab.getCompanyData()
      this.$refs.departmentTtaffManage.getData()
    },
    clickRadioNode(event) {
      if (event) event.preventDefault()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getDepartment() {
      getAllRootTree()
        .then(rt => {
          // rt.data.forEach(item => {
          //   item.isParent = false
          // })
          this.treeData = rt.data
        })
        .catch(er => {
          console.log(er)
        })
    },
    toBoolean(val) {
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
    loadNode(node, resolve) {
      this.checkNode = node
      this.checkResolve = resolve
      if (node.level > 0) {
        getChildren(node.data.id)
          .then(rt => {
            // rt.data.forEach(item => {
            //   item.isParent = !this.toBoolean(item.isParent)
            // })
            resolve(rt.data)
          })
          .catch(er => {
            console.log(er)
          })
      }
    },
    handleNodeClick(data) {
      console.log(data)
      this.headdata = data
      // this.checkData = {}
      this.checkData = data
      // if (data.type === '3') {
      //   // this.checkData.type = 1
      //   this.checkData = data
      // }
    },
    addDimensionality() {
      this.linkTitle = this.$t('addDimension')
      this.itemData = {
        type: '0'
      }
      this.dialogVisible = true
    },
    filterFun() {
      if (this.filterText) {
        searchQueryTree(this.filterText)
          .then(rt => {
            this.treeData = rt.data
            this.isFilter = false
          })
          .catch(er => {})
      } else {
        this.isFilter = true
        this.getDepartment()
      }
    }
  }
}
</script>
<style lang="scss">
#organization {
  .elTree{
    font-size: 13px;
    /deep/ .el-tree-node.is-current > .el-tree-node__content .custom-tree-node {
      font-weight: 600;
      color: #2d42af;
    }
    /deep/ .custom-tree-node {
      color: #666;
    }
  }
  .item-left {
    .el-input__inner {
      border: none;
      border-bottom: 1px solid $dc1;
    }
  }
}
.el-tabs--card > .el-tabs__header {
  /*background: #fff;*/
  margin: 0;
  border-bottom: 1px solid $active-color !important;
  .el-tabs__nav {
    border-radius: 6px 6px 0 0;
    /*以下两句样式是为了处理通威标签页样式*/
    background-color: white;
    border-bottom: 1px solid $active-color !important;
  }
  .el-tabs__item {
    padding: 0 28px !important;
  }
  .el-tabs__item.is-active {
    color: #fff;
    background: $active-color;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
    /*为了处理通威标签页样式*/
    border-bottom-color: $active-color !important;
  }
}
</style>
<style lang="scss" scoped>
.item-left {
  position: relative;
  .organization-search-input {
    width: 225px;
    margin-right: 5px;
    margin-bottom: 10px
  }
  .font28 {
    font-size: 24px;
    line-height: 28px;
    cursor: pointer;
    color: #2d42af;
  }
}
#organization {
  ::v-deep > .el-card__body {
    display: flex;
  }
  .item-left {
    box-sizing: border-box;
    width: 250px;
    margin-right: 20px
  }
  .item-right {
    flex: 1;
  }
  .fullScreen {
    position: fixed;
    top: 60px;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #fff;
    z-index: 1000;
    .fullScreen_layout {
      margin: 20px 10px;
    }
  }
}
.item-right {
  position: relative;
  .tool-wrap {
    position: absolute;
    right: 0;
    z-index: 100;
  }
  .table-header {
    position: relative;
    background: $bc2;
    display: flex;
    align-items: center;
    .all-check {
      position: absolute;
      left: 20px;
    }
  }
}
.el-tree {
  width: 100%;
  /*overflow: scroll;*/
  /deep/ .el-button {
    margin-left: 5px !important;
  }
}

.el-tree /deep/ .el-tree-node {
  display: table;
  min-width: 100%;
}
</style>
