<template>
  <div id="groupManage" class="pageWrap">
    <div class="pageContent">
      <div class="leftTree">
        <el-row>
          <bas-search
            :placeholder="enterTheRulesAndRegulations"
            v-model="filterText"
            @fnSearch="abstractSearch"
          />
        </el-row>
        <div class="left_tree_wrapper elTree margin-t10">
          <el-tree
            v-show="!isSearch"
            ref="asyncTree"
            :props="props"
            :is-leaf="isLeaf"
            node-key="id"
            :load="getFilterTreeList"
            :default-expanded-keys="expandedList"
            :expand-on-click-node="false"
            lazy
          >
            <div slot-scope="{ node, data }" class="custom-tree-node">
              <p
                class="grow"
                :title="node.label"
                @click="nodeClick(node, data)"
              >
                {{ node.label }}
              </p>
              <p class="font14 opertionBtn">
                <i
                  class="el-icon-circle-plus-outline add"
                  @click="handlerTreeOperate('add', data, node)"
                />
                <i
                  v-if="node.level !== 1"
                  class="el-icon-edit add"
                  @click="handlerTreeOperate('edit', data, node)"
                />
                <i
                  v-if="node.level !== 1"
                  class="el-icon-delete add"
                  @click="handlerTreeOperate('del', data, node)"
                />
              </p>
            </div>
          </el-tree>
          <el-tree
            v-show="isSearch"
            :props="props"
            :is-leaf="isLeaf"
            node-key="id"
            :data="treeData"
            :default-expanded-keys="expandedList"
            :expand-on-click-node="false"
            lazy
            class="elTree"
          >
            <div slot-scope="{ node, data }" class="custom-tree-node">
              <p
                class="grow"
                :title="node.label"
                @click="nodeClick(node, data)"
              >
                {{ node.label }}
              </p>
              <p class="font14 opertionBtn">
                <i
                  class="el-icon-circle-plus-outline add"
                  @click.stop="handlerTreeOperate('add', data, node)"
                />
                <i
                  v-if="node.level !== 1"
                  class="el-icon-edit add"
                  @click="handlerTreeOperate('edit', data, node)"
                />
                <i
                  v-if="node.level !== 1"
                  class="el-icon-delete add"
                  @click="handlerTreeOperate('del', data, node)"
                />
              </p>
            </div>
          </el-tree>
        </div>
      </div>
      <div class="listContent">
        <el-tabs v-model="activeName">
          <el-tab-pane label="操作记录" name="first" style="padding:10px">
            <el-row :gutter="20">
              <!-- 表格 -->
              <bas-table
                row-key="id"
                :tableList="recordList"
                :headerList="headerList"
                :pages="pages"
                :isShowIndex="true"
                @currentChange="handleCurrentChange"
              >
                <template #search>
                  <div>
                    <el-row class="form-section margin-b10">
                      <el-col :span="10">
                        <bas-search
                          placeholder="请输入制度框架"
                          v-model="keyWords"
                          @fnSearch="singleSearch2('single')"
                        />
                      </el-col>
                      <el-col
                        :span="3"
                        :offset="11"
                        class="search_buttons_wrap"
                      >
                        <el-button
                          type="primary"
                          @click="isHighSearch = !isHighSearch"
                        >
                          {{ $t('advancedQuery') }}
                          <i
                            :class="
                              isHighSearch
                                ? 'el-icon-caret-top'
                                : 'el-icon-caret-bottom'
                            "
                          ></i>
                        </el-button>
                      </el-col>
                    </el-row>
                    <el-collapse-transition>
                      <!-- 高级搜索表格 -->
                      <el-form
                        v-show="isHighSearch"
                        class="search_options_wrap"
                        :model="ruleForm1"
                        label-width="100px"
                      >
                        <el-row>
                          <el-col :span="8">
                            <el-form-item label="操作人" prop="title">
                              <el-input
                                v-model="ruleForm1.operatorname"
                                size="small"
                                class="el-inputs"
                                placeholder="操作人"
                                @keyup.enter.native="submitForm1"
                              />
                            </el-form-item>
                          </el-col>
                          <el-col :span="8">
                            <el-form-item label="制度框架" prop="title">
                              <el-input
                                v-model="ruleForm1.classify"
                                size="small"
                                class="el-inputs"
                                placeholder="制度框架"
                                @keyup.enter.native="submitForm1"
                              />
                            </el-form-item>
                          </el-col>
                          <el-col :span="8">
                            <el-form-item
                              label="操作类型"
                              prop="belongdeptname"
                            >
                              <el-select
                                v-model="ruleForm1.operateitem"
                                :clearable="true"
                                placeholder="请选择操作类型"
                                @change="submitForm1"
                              >
                                <el-option
                                  v-for="item in fileleveloptionss"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                                />
                              </el-select>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="16">
                            <el-form-item label="操作时间">
                              <el-date-picker
                                v-model="ruleForm1.operatetime"
                                value-format="yyyy-MM-dd"
                                size="small"
                                style="width: 100%;"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                @change="submitForm1"
                              />
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <div class="search_buttons_wrap">
                          <el-button
                            type="primary"
                            @click="submitForm1('ruleForm1')"
                          >
                            {{ $t('search') }}
                          </el-button>
                          <el-button
                            type="primary"
                            @click="resetForm1('ruleForm1')"
                          >
                            {{ $t('reset') }}
                          </el-button>
                        </div>
                      </el-form>
                    </el-collapse-transition>
                  </div>
                </template>
              </bas-table>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 添加或删除组织树 -->
    <el-dialog
      :title="
        type == 'add'
          ? addRulesAndRegulationsOrganizationTree
          : editRulesAndRegulationsOrganizationTree
      "
      :visible.sync="isDialogsVisible"
      width="40%"
    >
      <el-form
        ref="orgRef"
        label-width="120px"
        label-position="right"
        :model="orgForm"
        :rules="rules"
      >
        <el-form-item :label="name" prop="name">
          <el-input v-model="orgForm.name" clearable />
        </el-form-item>
        <!-- <el-form-item label="制度框架编码" prop="code">
          <el-input v-model="orgForm.code" disabled />
        </el-form-item> -->
        <!--        <el-form-item label="所属文件级别" prop="folderlevel">-->
        <!--          <el-select v-model="orgForm.folderlevel" placeholder="请选择">-->
        <!--            <el-option-->
        <!--              v-for="item in ennameoptions"-->
        <!--              :key="item.value"-->
        <!--              :label="item.label"-->
        <!--              :value="item.value"-->
        <!--            />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item style="width:100%" label="管理员">-->
        <!--          <el-input v-model="orgForm.username" autocomplete="off" readonly @click.native="getManager" />-->
        <!--        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialogsVisible = false">{{
          $t('cancel')
        }}</el-button>
        <el-button type="primary" @click="handlerConfirm">{{
          $t('confirm')
        }}</el-button>
      </span>
    </el-dialog>
    <bas-organieation
      v-model="organizeDialogManage"
      :is-specified-group-but="false"
      :is-show-bustom-groups-but="false"
      :is-show-post="true"
      :selected-element="selectManage"
      :select-element="['9']"
      :load="false"
      :multiple="true"
      title="系统信息"
      @fnCallBack="getManagerOrg"
    />
  </div>
</template>
<script>
import {
  getRuleIframeTree,
  queryFolderTreeOperateLog,
  getBooksList
} from '@/bpa/api/rulesCenter/handbookFiles'
import { getFormateDate } from '@/utils/common'
import {
  saveTreeInfo,
  delTreeInfo,
  getCopy,
  getOrderCode
} from '@/bpa/api/settings/ruleManage'
import { searchRulestree } from '@/bpa/api/processModelCenter/rulesAndRegulations/detail'

export default {
  data() {
    return {
      // 表头字段
      headerList: [
        {
          label: this.$t('operator'), // 操作人
          prop: 'operatorname',
          width: 120
        },
        {
          label: this.$t('systemFramework'), // 制度框架
          prop: 'classify'
        },
        {
          label: this.$t('operationType'), // 操作类型
          prop: 'operateitem',
          width: 120
        },
        {
          label: this.$t('operationTime'), // 操作时间
          prop: 'operatetime',
          width: 160
        }
      ],
      type: 'add',
      treeId: '',
      activeName: 'first',
      ruleForm1: {
        operatorname: '',
        operateitem: '',
        operatetime: '',
        classify: ''
      },
      ennameoptions: [
        {
          value: '1',
          label: '一级文件'
        },
        {
          value: '2',
          label: '二级文件'
        },
        {
          value: '3',
          label: '三级文件'
        },
        {
          value: '4',
          label: '四级文件'
        }
      ],
      fileleveloptionss: [
        {
          value: '新增',
          label: '新增'
        },
        {
          value: '修改',
          label: '修改'
        },
        {
          value: '删除',
          label: '删除'
        }
      ],
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      recordList: [],
      isShow: false,
      organizeDialogManage: false,
      isHighSearch: false,
      selectManage: {},
      managerList: [],
      plusIcon: true,
      keyWords: '',
      treeData: [],
      isSearch: false,
      filterText: '',
      expandedList: [],
      orgid: '',
      props: {
        label: function(data, node) {
          // if (data.code) {
          //   return data.code+ ' '+ data.foldername
          // } else {
          return data.foldername
          // }
        },
        children: 'childList',
        isLeaf: function(data, node) {
          if (data.parent) {
            return false
          } else {
            return true
          }
        }
      },
      isDialogsVisible: false,
      orgForm: { name: '' },
      rules: {
        name: [{ required: true, message: ' ', trigger: 'blur' }]
        // code: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      enterTheRulesAndRegulations: this.$t(
        'placeholderText.enterTheRulesAndRegulations'
      ),
      addRulesAndRegulationsOrganizationTree: this.$t(
        'addRulesAndRegulationsOrganizationTree'
      ),
      editRulesAndRegulationsOrganizationTree: this.$t(
        'editRulesAndRegulationsOrganizationTree'
      ),
      name: this.$t('name2'),
      areYouSureDelete: this.$t('hintText.areYouSureDelete'),
      hint: this.$t('hintText.hint'),
      successfullyDelete: this.$t('hintText.successfullyDelete'),
      requiredFieldsCannotBeEmpty: this.$t(
        'hintText.requiredFieldsCannotBeEmpty'
      ),
      confirm: this.$t('confirm'),
      cancel: this.$t('cancel'),
      add2: this.$t('add'),
      edit2: this.$t('edit'),
      success: this.$t('success'),
      filter: []
    }
  },
  mounted() {
    this.queryFolderTreeOperateLog()
  },
  methods: {
    // 处理选人组件返回数据
    getSelectArr(data) {
      console.log(data)
      const chooseIds = data.id.split(',')
      const chooseIdTypes = data.idType.split(';')
      const chooseNames = data.name.split('&')
      const arr = []
      const chooseIdType = chooseIdTypes.map(item => {
        // var index = item.lastIndexOf('\-')
        // item = item.substring(index + 1, item.length)
        // return item
        return item.split('-')
      })
      for (var i = 0; i < chooseIds.length; i++) {
        arr[i] = {
          chooseIds: chooseIds[i],
          chooseNames: chooseNames[i],
          chooseIdTypes: chooseIdType[i][1]
        }
      }
      return arr
    },
    getManager() {
      this.organizeDialogManage = true
      this.selectManage = {}
      var nameArr = []
      var idTypeArr = []
      var idArr = []
      // 判断长度
      if (this.managerList.length > 0) {
        this.managerList.map(item => {
          nameArr.push(item.username)
          idTypeArr.push(item.userid + '-9')
          idArr.push(item.userid)
        })
        this.selectManage = {
          name: nameArr.join('&'),
          idType: idTypeArr.join(';'),
          id: idArr.join(',')
        }
      }
      console.log(this.managerList, this.selectManage, 444)
    },
    // 获取管理员
    getManagerOrg(data) {
      this.managerList = this.getSelectArr(data)
      console.log(this.managerList)
      this.managerNames = this.managerList
        .map(item => {
          return item.chooseNames
        })
        .toString()
      this.managerList.map(item => {
        item.username = item.chooseNames
        item.userid = item.chooseIds
        this.$set(item, 'folderName', this.orgForm.folderName)
      })
      this.orgForm.username = this.managerNames
      this.organizeDialogManage = false
      // console.log(this.managerNames)
    },
    nodeClick(node, data) {
      console.log(node, data)
      this.treeId = data.id
      this.keyWords = ''
      this.resetForm1()
    },
    singleSearch2(type) {
      this.pages.pageNum = 1
      this.filter = [
        {
          key: 'classify',
          opt: 'LIKE',
          type: 'S',
          value: this.keyWords
        }
      ]
      this.queryFolderTreeOperateLog()
    },
    handleSizeChanges(item) {
      this.pages.pageSize = item
      this.queryFolderTreeOperateLog()
    },
    handleCurrentChange(item) {
      this.pages.pageNum = item
      this.queryFolderTreeOperateLog()
    },
    // 高级搜索
    submitForm1() {
      this.pages.pageNum = 1
      this.filter = [
        {
          key: 'operatorname',
          opt: 'LIKE',
          type: 'S',
          value: this.ruleForm1.operatorname
        },
        {
          key: 'operateitem',
          opt: 'LIKE',
          type: 'S',
          value: this.ruleForm1.operateitem
        },
        {
          key: 'operatetime',
          opt: 'BETWEEN',
          type: 'D',
          value: this.ruleForm1.operatetime
            ? this.ruleForm1.operatetime[0] +
              ' 00:00:00' +
              '~' +
              this.ruleForm1.operatetime[1] +
              ' 23:59:59'
            : ''
        },
        {
          key: 'classify',
          opt: 'LIKE',
          type: 'S',
          value: this.ruleForm1.classify
        }
      ]
      this.queryFolderTreeOperateLog()
    },
    // 重置按钮
    resetForm1() {
      this.ruleForm1 = {
        operatorname: '',
        operateitem: '',
        operatetime: '',
        classify: ''
      }
      this.submitForm1()
    },
    // 获取操作记录
    queryFolderTreeOperateLog() {
      const obj = {
        attr: {},
        filters: [
          {
            key: 'operatecontent',
            opt: 'LIKE',
            type: 'S',
            value: this.treeId
          },
          ...this.filter
        ],
        logic: 'and',
        orderby: 'operatetime',
        pageNum: this.pages.pageNum || 1,
        pageSize: this.pages.pageSize,
        sort: 'desc'
      }
      queryFolderTreeOperateLog(obj).then(res => {
        this.recordList = res.list.map(item => {
          item.operatetime = getFormateDate(
            new Date(item.operatetime),
            'yyyy-MM-dd hh:mm:ss'
          )
          return item
        })
        this.pages.total = res.total
      })
    },
    queryNodeClick() {
      const obj = {
        attr: {},
        filters: [
          {
            key: 'operatecontent',
            opt: 'LIKE',
            type: 'S',
            value: this.treeId
          },
          {
            key: 'operatorname',
            opt: 'LIKE',
            type: 'S',
            value: this.ruleForm1.operatorname
          },
          {
            key: 'operateitem',
            opt: 'LIKE',
            type: 'S',
            value: this.ruleForm1.operateitem
          },
          {
            key: 'operatetime',
            opt: 'BETWEEN',
            type: 'D',
            value: this.ruleForm1.operatetime
              ? this.ruleForm1.operatetime[0] +
                ' 00:00:00' +
                '~' +
                this.ruleForm1.operatetime[1] +
                ' 23:59:59'
              : ''
          },
          {
            key: 'classify',
            opt: 'LIKE',
            type: 'S',
            value: this.ruleForm1.classify
          }
        ],
        logic: 'and',
        orderby: 'operatetime',
        pageNum: this.pages.pageNum || 1,
        pageSize: this.pages.pageSize,
        sort: 'desc'
      }
      queryFolderTreeOperateLog(obj).then(res => {
        this.recordList = res.list.map(item => {
          item.operatetime = getFormateDate(
            new Date(item.operatetime),
            'yyyy-MM-dd hh:mm:ss'
          )
          return item
        })
        this.pages.total = res.total
      })
    },
    getFilterTreeList(node, resolve) {
      const id = node.data ? node.data.id : '0'
      getRuleIframeTree(id).then(res => {
        if (!res) return false
        if (node.level === 0 || (node.level < 2 && res.length === 1)) {
          this.expandedList = [res[0].id]
        }
        if (node.level === 1 && res.length > 0) {
          this.$nextTick(() => {
            if (this.$refs.asyncTree) {
              this.$refs.asyncTree.setCurrentKey(res[0].id)
              this.treeId = res[0].id
              this.queryNodeClick()
            }
          })
        }
        resolve(res)
      })
    },
    abstractSearch() {
      if (this.filterText) {
        this.isSearch = true
        searchRulestree({ foldername: this.filterText }).then(res => {
          this.treeData = res
        })
      } else {
        this.isSearch = false
      }
    },
    isLeaf(data, node) {
      console.log(data)
      console.log(node)
    },
    handlerTreeOperate(type, data, node) {
      const me = this
      console.log(type, type === 'edit')
      console.log(node)
      console.log(data)
      this.orgForm = {}
      this.type = type
      if (type === 'add') {
        this.managerList = []
        this.isDialogsVisible = true
        getOrderCode(data.id).then(res => {
          this.orgForm = Object.assign({}, this.orgForm, {
            pid: !data.id ? '' : data.id,
            code: res
          })
        })
      } else if (type === 'edit') {
        getCopy(data.id).then(res => {
          this.managerList = res.managerList ? res.managerList : []
          this.orgForm = Object.assign({}, this.orgForm, {
            id: res.id,
            name: res.foldername.replace(res.code, ''),
            code: res.code,
            pid: !node.parent.data ? '' : node.parent.data.id,
            rulecode: res.rulecode,
            folderlevel: res.folderlevel ? res.folderlevel : '',
            managerList: this.managerList,
            username: this.managerList
              .map(item => {
                return item.username
              })
              .join(',')
          })
        })
        this.isDialogsVisible = true
      } else {
        const parentid = node.parent.data.id
        this.$confirm(this.areYouSureDelete, this.hint, {
          confirmBtnText: this.confirm,
          cancelBtnText: this.cancel,
          type: 'warning'
        }).then(() => {
          const obj = {
            attr: { folderid: data.id },
            orderby: 'createon',
            pageNum: 1,
            pageSize: 10,
            sort: 'desc',
            logic: 'and',
            filters: []
          }
          getBooksList(obj).then(res => {
            if (res.total !== 0) {
              this.$confirm(
                '本层框架下已关联制度（可在制度管理模块查看对应层级下的制度），是否确认删除？',
                this.hint,
                {
                  confirmBtnText: this.confirm,
                  cancelBtnText: this.cancel,
                  type: 'warning'
                }
              ).then(() => {
                delTreeInfo(data.id).then(res => {
                  if (!res) return false
                  this.$message({
                    type: 'success',
                    message: this.successfullyDelete
                  })
                  const node = this.$refs.asyncTree.getNode(parentid) // 通过节点id找到对应树节点对象
                  node.loaded = false
                  node.expand()
                  this.queryFolderTreeOperateLog()
                })
              })
            } else {
              delTreeInfo(data.id).then(res => {
                if (!res) return false
                this.$message({
                  type: 'success',
                  message: this.successfullyDelete
                })
                const node = this.$refs.asyncTree.getNode(parentid) // 通过节点id找到对应树节点对象
                node.loaded = false
                node.expand()
                this.queryFolderTreeOperateLog()
              })
            }
          })
        })
      }
    },
    handlerConfirm() {
      this.$refs.orgRef.validate(valid => {
        if (valid) {
          saveTreeInfo({
            id: !this.orgForm.id ? '' : this.orgForm.id,
            foldername: !this.orgForm.name ? '' : this.orgForm.name,
            code: this.orgForm.code,
            folderlevel: this.orgForm.folderlevel,
            managerList: this.managerList,
            pid: !this.orgForm.pid ? '' : this.orgForm.pid
          }).then(res => {
            if (!res) return false
            this.$message({
              type: 'success',
              message:
                (!this.orgForm.id ? this.add2 : this.edit2) + this.success + '!'
            })
            this.isDialogsVisible = false
            if (!this.orgForm.pid) return false
            const node = this.$refs.asyncTree.getNode(this.orgForm.pid) // 通过节点id找到对应树节点对象
            node.loaded = false
            node.expand()
            this.queryFolderTreeOperateLog()
          })
        } else {
          this.$message({
            type: 'warning',
            message: this.requiredFieldsCannotBeEmpty
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.elTree {
  font-size: 13px;
  /deep/ .el-tree-node.is-current > .el-tree-node__content .custom-tree-node {
    font-weight: 600;
    color: #2d42af;
  }
  /deep/ .custom-tree-node {
    color: #666;
  }
}
/deep/ .el-tree-node > .el-tree-node__children {
  overflow: visible;
}
.custom-tree-node {
  height: 100%;
  position: relative;
  .opertionBtn {
    position: absolute;
    right: 10px;
    top: 0;
    bottom: 0;
    min-width: 50px;
    display: flex;
    display: none;
    justify-content: space-between;
    align-items: center;
    i {
      display: inline-block;
      height: 14px;
      padding: 0;
      margin: 0;
      &:hover {
        background: none;
        font-weight: bold;
      }
    }
  }
  &:hover {
    .opertionBtn {
      display: flex;
    }
  }
}
.custom-tree-node {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  .grow {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 70px;
  }
  .add {
    color: $tc5;
    padding: 5px;
    display: none;
    &:hover {
      background: $dc1;
    }
  }
  .del {
    color: $tc4;
    padding: 5px;
    display: none;
    &:hover {
      background: $dc1;
    }
  }
  &:hover {
    .add {
      display: inherit;
    }
    .del {
      display: inherit;
    }
  }
}
#groupManage {
  background-color: white;
  .right-content {
    height: calc(100vh - 160px);
    .el-scrollbar__wrap {
      height: 100%;
    }
    .el-scrollbar__view {
      height: 100%;
    }
  }
}
</style>
