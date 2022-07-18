<template>
  <el-card shadow="never" id="organization" class="card-reset">
    <div class="item-left">
      <el-tree
        class="elTree"
        :props="props"
        :data="treeData"
        :load="loadNode"
        :default-expanded-keys="[grandParentId]"
        style="height:calc(100% - 28px);overflow: auto;"
        lazy
        node-key="id"
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
        :filter-node-method="filterNode"
        @node-drag-end="handleDragEnd"
        ref="tree"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <i v-if="data.type === 'root'" class="iconfont icon-banben"></i>
          <i
            v-if="data.type === 'category'"
            class="iconfont"
            :class="[data.ico ? data.ico : 'icon-liebiao1']"
          ></i>
          <i v-if="data.type === 'item'" class="iconfont" :class="data.ico"></i>
          <span>{{ node.label }}</span>
          <span>
            <el-button
              @click="userHandle($t('addNavigation'), data)"
              v-if="data.type !== 'item'"
              icon="el-icon-circle-plus"
              :title="$t('addNavigation')"
              type="text"
            ></el-button>
            <el-button
              @click="del(data)"
              v-if="node.level > 1"
              icon="el-icon-delete"
              :title="$t('deleteNavigation')"
              type="text"
            ></el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <div class="item-right">
      <el-card shadow="never" class="card-reset-inner">
        <div class="tool-common-wrap">
          <div class="btn-wrap">
            <el-button
              type="primary"
              @click="
                content = {}
                getDepartment()
              "
            >
              {{ $t('refresh') }}
            </el-button>
          </div>
        </div>
        <div v-if="$store.state.app.tableStyle === 'default'">
          <div v-if="content.pid" class="table-header margin-t10">
            <sort-button style="flex-grow: 1" :items="headers" />
          </div>
          <div class="tr" v-if="content.pid">
            <div class="tr-title">&nbsp;</div>
            <el-row class="tr-body" type="flex" align="middle">
              <el-col
                class="td textHide"
                :span="headers[0].span"
                :title="content.id"
                >{{ content.id }}</el-col
              >
              <el-col
                class="td textHide"
                :span="headers[1].span"
                :title="content.name"
                >{{ content.name }}</el-col
              >
              <el-col
                class="td textHide"
                :span="headers[2].span"
                :title="content.url"
                >{{ content.url }}</el-col
              >
              <el-col style="text-align: center" :span="headers[3].span">
                <el-tooltip class="item" :content="$t('editNavigation')">
                  <el-button
                    type="text"
                    @click="userHandle($t('editNavigation'))"
                    >{{ $t('editNavigation') }}</el-button
                  >
                </el-tooltip>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-else>
          <el-table
            :data="[content]"
            class="margin-t10"
            v-if="content.pid"
            stripe
            :header-cell-style="{ background: '#E1EAFD !important' }"
            current-row-key="id"
            :key="content.id"
          >
            <el-table-column label="ID" show-overflow-tooltip prop="id" />
            <el-table-column
              :label="$t('name2')"
              show-overflow-tooltip
              prop="name"
            />
            <el-table-column
              :label="$t('link')"
              show-overflow-tooltip
              prop="url"
            />
            <el-table-column :label="$t('operation')" width="80">
              <template>
                <el-tooltip class="item" :content="$t('editNavigation')">
                  <el-button
                    type="text"
                    @click="userHandle($t('editNavigation'))"
                    >{{ $t('editNavigation') }}</el-button
                  >
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <manage-dialog
          v-model="dialogVisible"
          :title="linkTitle"
          :item="itemData"
          @confirm="saveSuccess"
        />
      </el-card>
    </div>
  </el-card>
</template>
<script>
import manageDialog from './manageDialog'
import {
  deleteFull,
  getAllGroups2,
  getNavigations,
  changepid
} from '@/bpm/api/configManage/navConfig'

export default {
  name: 'navConfig',
  components: {
    manageDialog
  },
  data() {
    return {
      grandParentId: '1',
      loading: false,
      isPowerSearch: false,
      dialogVisible: false,
      linkTitle: '',
      itemData: {},
      parentId: '',
      searchForm: {},
      headers: [
        {
          name: 'ID',
          span: 6
        },
        {
          name: this.$t('name2'),
          span: 7
        },
        {
          name: this.$t('link'),
          span: 8
        },
        {
          name: this.$t('operation'),
          span: 3
        }
      ],
      checkId: '',
      content: {},
      props: {
        label: 'name',
        isLeaf: 'isParent'
      },
      treeData: [],
      editType: '',
      // 表头字段
      headerList: [
        {
          label: '', // 星标
          prop: 'starmark',
          slotName: 'starmark',
          width: 35
        },
        {
          label: this.$t('positionGroupName'), // 岗位组名称
          prop: 'name',
          slotName: 'name',
          sortable: true
        },
        {
          label: this.$t('sort'), // 排序
          prop: 'sortid',
          slotName: 'sortid',
          sortable: true
        },
        {
          label: this.$t('grade'), // 等级
          prop: 'grade',
          sortable: true,
        },
        {
          label: this.$t('remarks'), // 备注
          prop: 'explain',
          slotName: 'explain',
          sortable: true
        },
        {
          label: this.$t('operation'), // 操作
          prop: 'org',
          slotName: 'org',
          sortable: false
        }
      ]
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.basuser.user
    },
    key() {
      return this.$route.fullPath
    }
  },
  mounted() {
    this.getDepartment()
  },
  methods: {
    // 页码改变事件
    currentChange(newPageNum) {
      console.log('newPage', newPageNum)
      this.page.pageNum = newPageNum
      // if (this.searchType === 'power') {
      //   this.getData()
      // } else if (this.searchType === 'quick') {
      //   this.quickQueryData()
      // }
    },
    // 复选框勾选事件
    handleSelectionChange(data) {
      console.log(data)
      this.selections = data
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      let pid = ''
      if (dropNode.data.pid) {
        if (dropType === 'before') {
          pid = dropNode.data.pid
        } else if (dropType === 'inner') {
          pid = dropNode.data.id
        } else {
          return
        }
        changepid(draggingNode.data.id, pid).then(rt => {
          if (rt.status === '200') {
            this.$message.success(this.$t('hintText.addedSuccess'))
          }
        })
      }
    },
    allowDrop(draggingNode, dropNode, type) {
      // if (draggingNode.level > 1) {
      //   return type !== 'inner';
      // } else {
      //   return true;
      // }
    },
    allowDrag(draggingNode) {
      // console.log(draggingNode)
      // if (draggingNode.level === 1) {
      //   return type == 'prev'
      // }
      // return ;
    },
    del(data) {
      let msg = ''
      if (data.type === 'category') {
        msg = this.$t('hintText.areYouSureDeleteNavigationSubitems')
      } else if (data.type === 'item') {
        msg = this.$t('hintText.areYouSureDeleteNavigation')
      } else {
        msg = this.$t('hintText.areYouSureDeleteNavigation')
      }
      this.$confirm(msg, this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          deleteFull(data.id).then(rt => {
            if (rt.status === '200') {
              this.content = {}
              const node = this.$refs.tree.getNode(data.pid) // 通过节点id找到对应树节点对象
              node.loaded = false
              node.expand()
              this.$message({
                message: this.$t('hintText.successfullyDelete'),
                type: 'success'
              })
            } else {
              this.$message({
                message: this.$t('hintText.failToDelete'),
                type: 'error'
              })
            }
          })
        })
        .catch(_ => {})
    },
    getDepartment() {
      getAllGroups2()
        .then(rt => {
          this.treeData = rt.data.filter(item => item.id !== '0')
          console.log('111',this.treeData)
        })
        .catch(er => {
          console.log(er)
        })
    },
    loadNode(node, resolve) {
      if (node.level > 0) {
        getNavigations(node.data.id)
          .then(rt => {
            rt.data.forEach(item => {
              if (item.type === 'item') {
                item.isParent = true
              }
            })
            resolve(rt.data)
          })
          .catch(er => {
            console.log(er)
          })
      }
    },
    handleNodeClick(data) {
      console.log(data)
      this.checkId = data.id
      this.parentId = data.pid
      getAllGroups2()
        .then(rt => {
          this.content = data
        })
        .catch(er => {
          console.log(er)
        })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    userHandle(item, data) {
      this.linkTitle = item
      console.log(item, data)
      this.editType = item
      if (item === this.$t('addNavigation')) {
        this.parentId = data.id
        this.itemData = {
          pid: data.id,
          showtype: 'default',
          type: 'category'
        }
      } else if (item === this.$t('editNavigation')) {
        this.itemData = Object.assign({}, this.content)
      }
      this.dialogVisible = true
    },
    saveSuccess(val) {
      // this.getDepartment();
      const node = this.$refs.tree.getNode(this.itemData.pid) // 通过节点id找到对应树节点对象
      console.log(node, this.parentId)
      node.loaded = false
      node.expand()
      this.content = {}
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
</style>

<style lang="scss" scoped>
#organization ::v-deep > .el-card__body {
  display: flex;
}
.item-left {
  box-sizing: border-box;
  width: 270px;
  padding-right: 20px;
}
.item-right {
  flex: 1;
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
  .w100 {
    width: 100%;
  }
}
</style>
