<template>
  <div id="groupManage">
    <el-row :gutter="20" class="group_container">
      <el-col :span="4" class="tree_wrap">
        <el-row>
          <el-input placeholder="请输入内容" class="search_component remove-margin-b" v-model="filterText" clearable @keyup.13.native="abstractSearch">
            <el-button type="primary" @click="abstractSearch" slot="append">搜索</el-button>
          </el-input>
        </el-row>
        <!-- <el-scrollbar class="tree_node"> -->
          <el-tree
            v-show="!isSearch"
            :props="props"
            :isLeaf="isLeaf"
            node-key="id"
            :load="getFilterTreeList"
            :default-expanded-keys="expandedList"
            :expand-on-click-node="false"
            ref="asyncTree"
            lazy>
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <p class="grow" :title="node.label" @click="handlerNodeClick(data, node)">{{ node.label }}</p>
            </div>
          </el-tree>
          <el-tree
            v-show="isSearch"
            :props="props"
            :isLeaf="isLeaf"
            node-key="id"
            :data="treeData"
            :default-expanded-keys="expandedList"
            :expand-on-click-node="false"
            lazy>
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <p class="grow" :title="node.label" @click="handlerNodeClick(data, node)">{{ node.label }}</p>
            </div>
          </el-tree>
        <!-- </el-scrollbar> -->
      </el-col>
      <el-col :span="20">
        <el-scrollbar class="right-content">
           <el-row style="margin-bottom: 10px">
             <!-- <el-col :span="8"> -->
          <!-- <el-input placeholder="请输入内容" class="search_component remove-margin-b" v-model="filterText" clearable @keyup.13.native="abstractSearch">
            <el-button type="primary" @click="abstractSearch" slot="append">搜索</el-button>
          </el-input> -->
             <!-- </el-col> -->
             <el-col :span="24">
               <div style="text-align: right;">
                 <span>审核计划：</span>
                 <el-input style="width: 30%" v-model="approvePlan" readonly/>
               <el-button type="primary" :disabled="approveStatus === '1' || approveStatus === '3'" v-if="approveStatus" @click="addResult">{{approveStatus === '0' || approveStatus === '2' ? '审核结果提交':(approveStatus === '1' ? '审核结果审批中':(approveStatus === '3' ? '审核完成' : '')) }}</el-button>
               <el-button type="primary" v-if="approveStatus === '3'" @click="getExcel">导出审核结果</el-button>
               <el-button type="primary" @click="reset">刷新</el-button>
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
              prop="name"
              width="150px"
              label="三标一体管理手册章节">
            </el-table-column>
            <el-table-column
              prop="systemname"
              label="受审体系">
            </el-table-column>
            <!-- <el-table-column
              prop="datas"
              label="受审体系">
            </el-table-column> -->
            <el-table-column
              prop="chapterdetail"
              label="受审体系章节">
            </el-table-column>
            <el-table-column
              prop="persion"
              label="相关负责人">
            </el-table-column>
            <el-table-column
              prop="remarks"
              label="备注">
            </el-table-column>
            <el-table-column
              prop="filesrecording"
              label="文件记录">
              <template slot-scope="scope">
                   <p @click="getRecord(scope.row, scope.$index)" style="color: #4ba2ef;cursor: pointer;">{{scope.row.filesrecording}}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="processrecording"
              label="流程记录">
              <template slot-scope="scope">
                   <p @click="getFlow(scope.row, scope.$index)" style="color: #4ba2ef;cursor: pointer;">{{scope.row.processrecording}}</p>
              </template>
            </el-table-column>
             <el-table-column
              :render-header="renderHeader"
              label="审核记录">
              <template slot-scope="scope">
                <div v-if="scope.row.status === '1' || scope.row.status === '3'">{{scope.row.auditrecording}}</div>
                <div v-else><el-input v-model="scope.row.auditrecording" /></div>
              </template>
            </el-table-column>
            <el-table-column
             :render-header="renderHeader"
              label="审核结果">
              <template slot-scope="scope">
                <div v-if="scope.row.status === '1' || scope.row.status === '3'">{{scope.row.auditresult}}</div>
                <div v-else><el-input v-model="scope.row.auditresult" /></div>
              </template>
            </el-table-column>
            <el-table-column
            width="100px"
            v-if="userList && userList.length > 0 ? (userList[0].status !== '1' && userList[0].status !== '3') : false"
              label="操作">
              <template slot-scope="scope">
                  <el-button
                  v-if="scope.row.status !== '1' && scope.row.status !== '3'"
                   @click="add(scope.row)"
                             class="no-border"
                             type="text"
                             >
                             上传文件记录
                             </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </el-col>
    </el-row>
    <!-- 添加记录文件 -->
     <el-dialog title="记录文件"
               :visible.sync="dialogRecordListVisible"
               width="65%"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <el-form ref="formRecord"
               :model="editFormRecordObj"
               label-width="120px"
               :rules="rulesRecordname">
        <el-row>
          <el-form-item label="文件名称:"
                        prop="name">
            <el-input v-model="editFormRecordObj.name"
                      :disabled="!isEdit2"
                      maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="相关体系:"
                        prop="systemname">
  <el-input v-model="editFormRecordObj.systemname"
                      disabled
                      maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="体系条款:"
                        prop="systemsclause">
            <el-input v-model="editFormRecordObj.systemsclause"
                      disabled
                      @click.native="selectSystem"
                      placeholder="请单击选择"
                      maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="审核年度:"
                        prop="years">
                        <!-- <el-input v-model="editFormRecordObj.years"
                      :disabled="!isEdit2"
                      maxlength="100"></el-input> -->
            <el-date-picker :disabled="!isEdit2"
                            v-model="editFormRecordObj.years"
                            type="year"
                            format="yyyy"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择年度"></el-date-picker>
          </el-form-item>
<el-form-item label="发布人:"
                        prop="username">
            <el-input v-model="editFormRecordObj.username"
                      disabled
                      maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="发布时间:"
                        prop="createdate">
            <el-date-picker disabled
                            v-model="editFormRecordObj.createdate"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期"></el-date-picker>
          </el-form-item>
            <upload-files :isexct="isEdit2" :labelName="name2" :limitNum="limitNums2"
                        :fileList='fileList2' @confirmUploadFilesList="uploadFilesList2"></upload-files>
        </el-row>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogRecordListVisible = false">取 消</el-button>
        <el-button type="primary"
                   v-if="isEdit2"
                   @click="saveNotice2">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 体系章节树弹框 -->
    <el-dialog title="选择体系条款" class="tree_list" :visible.sync="dialogTreeVisible" width="50%" :close-on-click-modal = false :close-on-press-escape = false>
    <el-row :gutter="20" class="group_container">
      <el-col :span="9" class="tree_wrap">
        <!-- <el-scrollbar class="tree_node"> -->
          <el-tree
            :highlight-current="true"
            :data="menusTree"
            node-key="id"
            :props="defaultoutProps"
            :default-checked-keys="grandParentId"
            show-checkbox
            :expand-on-click-node= "false"
            :check-strictly="true"
            @check="handleNodeCheck"
            ref="menuTree"
            style="padding:10px"
          ></el-tree>
        <!-- </el-scrollbar> -->
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogTreeVisible = false">取消</el-button>
      <el-button type="primary" @click="handlerConfirmDialog">确定</el-button>
    </span>
  </el-dialog>
  <!-- 流程记录 -->
     <el-dialog title="流程记录详情"
               :visible.sync="dialogRecordListVisible1"
               width="65%"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <el-form ref="formRecord"
               label-width="120px">
               <el-table
            :data="flowList"
            border
            class="main_tab blue-table">
            <el-table-column
             type="index"
              width="80px"
              label="序号">
            </el-table-column>
            <el-table-column
              prop="processname"
              width="150px"
              label="流程名称">
              <template slot-scope="scope">
                   <p style="color: #4ba2ef;cursor: pointer;" @click="getFlowItem(scope.row, scope.$index)">{{scope.row.processname}}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="count"
              label="运行次数">
            </el-table-column>
            <el-table-column
              prop="overcount"
              label="已完成">
            </el-table-column>
            <el-table-column
              prop="approvecount"
              label="审批中">
            </el-table-column>
          </el-table>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogRecordListVisible1 = false">取 消</el-button>
      </span>
    </el-dialog>
     <!-- 文件记录 -->
      <el-dialog title="文件记录详情"
               :visible.sync="dialogFlowVisible"
               width="65%"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <el-form ref="formRecord"
               label-width="120px">
               <el-table
            :data="filesList"
            border
            class="main_tab blue-table">
            <el-table-column
             type="index"
              width="80px"
              label="序号">
            </el-table-column>
            <el-table-column
              prop="name"
              width="150px"
              label="文件名称">
              <template slot-scope="scope">
                <a :href="viewFile(scope.row.fileids)" target="_blank">{{scope.row.name}}</a>
                   <!-- <p style="color: #4ba2ef;cursor: pointer;" @click="getRecordDetails(scope.row, scope.$index)">{{scope.row.name}}</p> -->
              </template>
            </el-table-column>
            <el-table-column
              prop="deptname"
              label="部门">
            </el-table-column>
            <el-table-column
              prop="username"
              label="上传人">
            </el-table-column>
            <el-table-column
              prop="createdate"
              label="上传时间">
            </el-table-column>
          </el-table>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogFlowVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 查看流程列表 -->
    <el-dialog title="流程详情"
               :visible.sync="dialogFlowItemVisible"
               width="85%"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <el-form ref="formRecord"
            :model="editFormRecordObj1"
               label-width="120px">
               <el-row style="margin-bottom: 10px">
                 <el-col :span="16">
                      <el-input placeholder="申请单号、主题、申请人" class="search_component remove-margin-b" v-model="filterDetails" clearable @keyup.13.native="searchFlowDetails">
            <el-button type="primary" @click="searchFlowDetails" slot="append">搜索</el-button>
          </el-input>
                 </el-col>
                   <el-col :span="8" style="text-align: right;">
                   <el-button @click="isShowSearch = !isShowSearch" type="primary">高级查询
                       <i :class="isShowSearch?'el-icon-folder-remove':'el-icon-folder-add'" />
                   </el-button>
                   </el-col>
               </el-row>
               <el-row v-if="isShowSearch" style="padding: 15px;border: 1px solid #e5e5e5;border-radius: 1px;margin: 10px 0;">
                   <el-col :span="8">
          <el-form-item label="申请单号：">
            <el-input type="text" v-model="editFormRecordObj1.reqno"></el-input>
          </el-form-item>
        </el-col>
                <el-col :span="8">
          <el-form-item label="主题：">
            <el-input type="text" v-model="editFormRecordObj1.subject"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请人：">
            <el-input type="text" v-model="editFormRecordObj1.drafter"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请日期：">
            <el-date-picker
              v-model="editFormRecordObj1.reqdate"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00','23:59:59']"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态：">
            <el-select v-model="editFormRecordObj1.status" placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
         <el-col :span="24" style="text-align: right">
          <el-button type="primary" @click="powerSearch">查询</el-button>
          <el-button type="primary" @click="rest">重置</el-button>
        </el-col>
               </el-row>
               <div v-loadig="detailLoading">
               <el-table
            :data="flowDetailList"
            v-loading = "pictLoading"
            border
            class="main_tab blue-table">
            <el-table-column
             type="index"
              width="80px"
              label="序号">
            </el-table-column>
            <el-table-column
              prop="reqno"
              label="申请单号">
            </el-table-column>
            <el-table-column
              prop="subject"
              width="150px"
              label="主题">
              <template slot-scope="scope">
                   <p style="color: #4ba2ef;cursor: pointer;" @click="openBpm(scope.row, scope.$index)">{{scope.row.subject}}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="drafter"
              label="申请人">
            </el-table-column>
            <el-table-column
              label="申请时间">
              <template slot-scope="scope">
                <span>{{scope.row.reqdate}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="assignees"
              label="审批人">
            </el-table-column>
            <el-table-column
              prop="processnodename"
              label="当前节点">
            </el-table-column>
             <el-table-column
              prop="status"
              label="状态">
            </el-table-column>
             <el-table-column
              prop="processnamecn"
              label="流程名">
            </el-table-column>
          </el-table>
              <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="pages.pageNum"
                   :page-size="pages.pageSize"
                   layout="total, prev, pager, next, jumper"
                   :total="pages.total"></el-pagination>
               </div>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogFlowItemVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 记录文件详情 -->
     <el-dialog title="记录文件"
               :visible.sync="dialogRecordListDetailsVisible"
               width="65%"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <el-form ref="formRecord"
               :model="editFormRecordDetailsObj"
               label-width="120px">
        <el-row>
          <el-form-item label="文件名称:"
                        prop="name">
            <el-input v-model="editFormRecordDetailsObj.name"
                      disabled
                      maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="相关体系:"
                        prop="systemname">
            <el-select disabled v-model="editFormRecordDetailsObj.systemname" placeholder="请选择">
    <el-option
      v-for="item in itList"
      :key="item.id"
      :label="item.name"
      :value="item.name">
    </el-option>
  </el-select>
          </el-form-item>
          <el-form-item label="体系条款:"
                        prop="systemsclause">
            <el-input v-model="editFormRecordDetailsObj.systemsclause"
                      disabled
                      placeholder="请单击选择"
                      maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="审核年度:"
                        prop="years">
                        <el-input v-model="editFormRecordDetailsObj.years"
                      disabled
                      maxlength="100"></el-input>
          </el-form-item>
<el-form-item label="发布人:"
                        prop="username">
            <el-input v-model="editFormRecordDetailsObj.username"
                      disabled
                      maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="发布时间:"
                        prop="createdate">
            <el-date-picker disabled
                            v-model="editFormRecordDetailsObj.createdate"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期"></el-date-picker>
          </el-form-item>
            <upload-files :isexct="false" :labelName="name2" :limitNum="limitNums2"
                        :fileList='fileList2'></upload-files>
        </el-row>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogRecordListDetailsVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getTreeList, abstractSearch } from '@/bpa/api/settings/groupManage'
import {
  getFileList, getProcessList
} from '@/bpa/api/systemManagementCenter/operationRecord'
import {
  saverecordingdm,
  getInterList,
  getrecordingdmList
} from '@/bpa/api/systemManagementCenter/fileManagement'
import {
  getListById, saveResult
} from '@/bpa/api/systemManagementCenter/systemExamine'
import uploadFiles from './uploadFiles'
import { getDetailByOrgid, getSystemTree } from '@/bpa/api/systemManagementCenter/systemAuditplan'
import axios from 'axios'
import {
  viewFile
} from '@/bpa/utils/common'
export default {
  components: {
    uploadFiles
  },
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
      props: {
        label: 'name',
        children: 'zones',
        isLeaf: function (data, node) {
          if (data.isParent === 'true') {
            return false
          } else {
            return true
          }
        }
      },
      title: '',
      dept: '',
      deptid: '',
      typeStatus: '',
      nameList: [],
      dialogHistoryVisible: false,
      dialogTreeVisible: false,
      menusTree: [],
      defaultProps: {
        children: 'sectionChildrens',
        label: 'content'
      },
      grandParentId: [],
      indexInfo: '',
      grandParentContent: [],
      selectedPersonList: [],
      defaultoutProps: {
        children: 'children',
        label: 'title'
      },
      editFormRecordObj: {},
      dialogRecordListVisible: false,
      dialogRecordListVisible1: false,
      rulesRecordname: {
        name: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      isEdit2: false,
      fileList2: [],
      name2: '附件',
      limitNums2: 1,
      itList: [],
      approvePlan: '',
      approvePlanid: '',
      multipleSelection: [],
      approveStatus: '',
      optionsList: [],
      flowDetailList: [],
      filters: [],
      pages: {
        pageSize: 8,
        pageNum: 1,
        total: 0
      },
      dataname: '',
      detailLoading: false,
      flowList: [],
      editFormRecordDetailsObj: '',
      dialogFlowVisible: false,
      dialogFlowItemVisible: false,
      editFormRecordObj1: {},
      isShowSearch: false,
      pictLoading: false,
      dialogRecordListDetailsVisible: false,
      filesList: [],
      filterDetails: '',
      options: [
        {
          value: '审批中',
          label: '审批中'
        },
        {
          value: '已完成',
          label: '已完成'
        },
        {
          value: '暂停',
          label: '暂停'
        },
        {
          value: '终止',
          label: '终止'
        }
      ]
    }
  },
  mounted () {
    this.getInterList()
  },
  computed: {
    userid() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .empuid
    }
  },
  methods: {
    // 预览文件
    viewFile (fileId) {
      return viewFile(fileId)
    },
    getFlow (item, index) {
      if (item.processrecording > 0) {
        getProcessList(item.nameid).then(rt => {
          this.flowList = rt
          this.dialogRecordListVisible1 = true
        })
      } else {
        this.$message.error('当前暂无流程记录')
      }
    },
    getRecord (item, index) {
      if (item.filesrecording > 0) {
        this.dialogFlowVisible = true
        getFileList(item.nameid).then(rt => {
          this.filesList = rt
        })
      } else {
        this.$message.error('当前暂无文件记录')
      }
    },
    getFlowItem (item, index) {
      this.pages.pageNum = 1
      this.dataname = item.processname
      this.editFormRecordObj1 = {
        reqdate: []
      }
      this.flowDetailList = []
      this.paramDetails = {
        logic: 'or',
        filters: [
          {key: 'processnamecn', opt: 'LIKE', type: 'S', value: this.dataname},
          {key: 'reqdate', opt: 'BETWEEN', type: 'D', value: this.editFormRecordObj1.reqdate && this.editFormRecordObj1.reqdate.length > 0 ? this.editFormRecordObj1.reqdate[0] + '~' + this.editFormRecordObj1.reqdate[1] : ''},
          {key: 'status', opt: 'LIKE', type: 'S', value: this.editFormRecordObj1.status ? this.editFormRecordObj1.status : ''},
          {key: 'subject', opt: 'LIKE', type: 'S', value: this.editFormRecordObj1.subject ? this.editFormRecordObj1.subject : ''},
          {key: 'drafter', opt: 'LIKE', type: 'S', value: this.editFormRecordObj1.drafter ? this.editFormRecordObj1.drafter : ''},
          {key: 'reqno', opt: 'LIKE', type: 'S', value: this.editFormRecordObj1.reqno ? this.editFormRecordObj1.reqno : ''}
        ],
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize
      }
      this.getFlowDetail()
      this.dialogFlowItemVisible = true
    },
    powerSearch() {
      this.pages.pageNum = 1
      this.filterDetails = ''
      this.paramDetails = {
        logic: 'and',
        filters: [
          {key: 'processnamecn', opt: 'LIKE', type: 'S', value: this.dataname},
          {key: 'reqdate', opt: 'BETWEEN', type: 'D', value: this.editFormRecordObj1.reqdate && this.editFormRecordObj1.reqdate.length > 0 ? this.editFormRecordObj1.reqdate[0] + '~' + this.editFormRecordObj1.reqdate[1] : ''},
          {key: 'status', opt: 'LIKE', type: 'S', value: this.editFormRecordObj1.status ? this.editFormRecordObj1.status : ''},
          {key: 'subject', opt: 'LIKE', type: 'S', value: this.editFormRecordObj1.subject ? this.editFormRecordObj1.subject : ''},
          {key: 'drafter', opt: 'LIKE', type: 'S', value: this.editFormRecordObj1.drafter ? this.editFormRecordObj1.drafter : ''},
          {key: 'reqno', opt: 'LIKE', type: 'S', value: this.editFormRecordObj1.reqno ? this.editFormRecordObj1.reqno : ''}
        ],
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize
      }
      this.getFlowDetail()
    },
    rest() {
      this.editFormRecordObj1 = {
        reqdate: []
      }
      this.filterDetails = ''
      this.paramDetails = {
        logic: 'or',
        filters: [
          {key: 'processnamecn', opt: 'LIKE', type: 'S', value: this.dataname},
          {key: 'reqdate', opt: 'BETWEEN', type: 'D', value: this.editFormRecordObj1.reqdate && this.editFormRecordObj1.reqdate.length > 0 ? this.editFormRecordObj1.reqdate[0] + '~' + this.editFormRecordObj1.reqdate[1] : ''},
          {key: 'status', opt: 'LIKE', type: 'S', value: this.editFormRecordObj1.status ? this.editFormRecordObj1.status : ''},
          {key: 'subject', opt: 'LIKE', type: 'S', value: this.editFormRecordObj1.subject ? this.editFormRecordObj1.subject : ''},
          {key: 'drafter', opt: 'LIKE', type: 'S', value: this.editFormRecordObj1.drafter ? this.editFormRecordObj1.drafter : ''},
          {key: 'reqno', opt: 'LIKE', type: 'S', value: this.editFormRecordObj1.reqno ? this.editFormRecordObj1.reqno : ''}
        ],
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize
      }
      this.pages.pageNum = 1
      this.getFlowDetail()
    },
    getFlowDetail () {
      this.pictLoading = true
      axios({
        method: 'post',
        url: `${process.env.BPM_APP_HOST_URL}${process.env.BPM_HTML_URL}/rpa/process/getProcessManageList/query?username=` + JSON.parse(localStorage.getItem('portalCurrentUserInfo')).empuid,
        data: this.paramDetails,
        headers: {
          token: JSON.parse(localStorage.getItem('portalCurrentUserInfo')).empuid
        }
      })
        .then(res => {
          this.flowDetailList = res.data.data.list
          this.pages.total = res.data.data.total
          this.pictLoading = false
        })
        .catch(() => {
          this.pictLoading = false
        })
    },
    handleSizeChange (val) {
      this.pages.pageNum = val
      if (this.filterDetails) {
        this.paramDetails = {
          logic: 'or',
          filters: [
            {key: 'processnamecn', opt: 'LIKE', type: 'S', value: this.dataname}
          ],
          queryFilter: ['reqno', 'subject', 'drafter', 'assignees', 'processnodename', 'processnamecn'],
          searchData: this.filterDetails,
          pageNum: this.pages.pageNum,
          pageSize: this.pages.pageSize
        }
      } else {
        this.paramDetails = {
          logic: 'or',
          filters: [
            {key: 'processnamecn', opt: 'LIKE', type: 'S', value: this.dataname},
            {key: 'reqdate', opt: 'BETWEEN', type: 'D', value: this.editFormRecordObj1.reqdate && this.editFormRecordObj1.reqdate.length > 0 ? this.editFormRecordObj1.reqdate[0] + '~' + this.editFormRecordObj1.reqdate[1] : ''},
            {key: 'status', opt: 'LIKE', type: 'S', value: this.editFormRecordObj1.status ? this.editFormRecordObj1.status : ''},
            {key: 'subject', opt: 'LIKE', type: 'S', value: this.editFormRecordObj1.subject ? this.editFormRecordObj1.subject : ''},
            {key: 'drafter', opt: 'LIKE', type: 'S', value: this.editFormRecordObj1.drafter ? this.editFormRecordObj1.drafter : ''},
            {key: 'reqno', opt: 'LIKE', type: 'S', value: this.editFormRecordObj1.reqno ? this.editFormRecordObj1.reqno : ''}
          ],
          pageNum: this.pages.pageNum,
          pageSize: this.pages.pageSize
        }
      }
      this.getFlowDetail()
    },
    searchFlowDetails () {
      this.editFormRecordObj1 = {
        reqdate: []
      }
      this.paramDetails = {
        logic: 'or',
        filters: [
          {key: 'processnamecn', opt: 'LIKE', type: 'S', value: this.dataname}
        ],
        queryFilter: ['reqno', 'subject', 'drafter', 'assignees', 'processnodename', 'processnamecn'],
        searchData: this.filterDetails,
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize
      }
      this.getFlowDetail()
    },
    getRecordDetails(item, index) {
      getrecordingdmList(item.id).then((res) => {
        if (!res) return false
        this.editFormRecordDetailsObj = res
        this.fileList2 = [{
          filename: res.list ? res.list.originalName : '',
          filesize: res.list ? res.list.fileSize + 'B' : '',
          downloadUrl: this.host + '/attach/download/' + res.fileids,
          status: '已上传',
          fileId: res.fileids ? res.fileids : ''
        }]
        this.dialogRecordListDetailsVisible = true
        this.editFormRecordDetailsObj = Object.assign({}, this.editFormRecordDetailsObj)
      })
    },
    handleCurrentChange (val) {
      this.pages.pageNum = val
      if (this.filterDetails) {
        this.paramDetails = {
          logic: 'or',
          filters: [
            {key: 'processnamecn', opt: 'LIKE', type: 'S', value: this.dataname}
          ],
          queryFilter: ['reqno', 'subject', 'drafter', 'assignees', 'processnodename', 'processnamecn'],
          searchData: this.filterDetails,
          pageNum: this.pages.pageNum,
          pageSize: this.pages.pageSize
        }
      } else {
        this.paramDetails = {
          logic: 'or',
          filters: [
            {key: 'processnamecn', opt: 'LIKE', type: 'S', value: this.dataname},
            {key: 'reqdate', opt: 'BETWEEN', type: 'D', value: this.editFormRecordObj1.reqdate && this.editFormRecordObj1.reqdate.length > 0 ? this.editFormRecordObj1.reqdate[0] + '~' + this.editFormRecordObj1.reqdate[1] : ''},
            {key: 'status', opt: 'LIKE', type: 'S', value: this.editFormRecordObj1.status ? this.editFormRecordObj1.status : ''},
            {key: 'subject', opt: 'LIKE', type: 'S', value: this.editFormRecordObj1.subject ? this.editFormRecordObj1.subject : ''},
            {key: 'drafter', opt: 'LIKE', type: 'S', value: this.editFormRecordObj1.drafter ? this.editFormRecordObj1.drafter : ''},
            {key: 'reqno', opt: 'LIKE', type: 'S', value: this.editFormRecordObj1.reqno ? this.editFormRecordObj1.reqno : ''}
          ],
          pageNum: this.pages.pageNum,
          pageSize: this.pages.pageSize
        }
      }
      this.getFlowDetail()
    },
    openBpm (item) {
      let a = document.createElement('a')
      // 给创建好的a标签赋值
      a.setAttribute('href', process.env.BPM_URL + '/#/processForm/view?name=' + item.processnamecn + '&instanceId=' + item.instid + '&username=' + this.userid)
      // 设置css 隐藏属性
      a.setAttribute('style', 'display:none')
      // 设置 a标签为新窗口打开
      a.setAttribute('target', '_blank')
      // 将设置好的a标签，添加到 body 内
      document.body.appendChild(a)
      // 模拟点击
      a.click()
      // 移除a标签
      a.parentNode.removeChild(a)
    },
    renderHeader (cerateElement, { column }) {
      return cerateElement('div', [
        cerateElement('span', {
          domProps: {
            innerHTML: '*'
          },
          style: {
            color: 'red',
            fontSize: '16px',
            marginLeft: '5px'
          }
        }),
        cerateElement('span', column.label)
      ])
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
    handlerNodeClick (data, node) {
      this.userList = []
      this.dept = data.name
      this.deptid = data.id
      this.approveStatus = ''
      this.approvePlan = ''
      getDetailByOrgid(data.id).then(res => {
        this.approvePlan = res.name
        this.approvePlanid = res.id
        getListById(res.id).then(rt => {
          this.userList = rt
          for (let i = 0; i < this.userList.length; i++) {
            this.userList[i].pid = res.id
          }
          if (rt && rt.length > 0) {
            this.approveStatus = rt[0].status
          }
        })
      })
    },
    reset() {
      if (this.deptid) {
        this.approveStatus = ''
        this.approvePlan = ''
        getDetailByOrgid(this.deptid).then(res => {
          this.approvePlan = res.name
          this.approvePlanid = res.id
          getListById(res.id).then(rt => {
            this.userList = rt
            for (let i = 0; i < this.userList.length; i++) {
              this.userList[i].pid = res.id
            }
            if (rt && rt.length > 0) {
              this.approveStatus = rt[0].status
            }
          })
        })
      }
    },
    isLeaf (data, node) {
    },
    handleSelect2 () {
      let data = this.itList.find(i => i.id === this.editFormRecordObj.systemid)
      this.editFormRecordObj.systemname = data.name
    },
    getInterList() {
      getInterList({
        pageSize: 9999,
        pageNum: 1,
        total: 100
      }).then((res) => {
        this.itList = res.list
      })
    },
    add (item) {
      console.log(item)
      if (!item.name) {
        this.$message.error('当前未关联内部体系章节，请关联后在上传文件记录')
        return false
      }
      this.title = ''
      this.isEdit2 = true
      this.fileList2 = []
      this.editFormRecordObj = {
        deptid: this.deptid,
        deptname: this.dept,
        createdate: this.getdate(),
        status: '4',
        systemname: item.nname,
        datas: item.nname,
        systemid: item.nid,
        systemsclause: item.name,
        systemsclauseid: item.nameid,
        username: JSON.parse(localStorage.getItem('portalCurrentUserInfo')).cnname,
        userid: JSON.parse(localStorage.getItem('portalCurrentUserInfo')).empuid
      }
      this.dialogRecordListVisible = true
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
    // 菜单权限按钮的id
    handleNodeCheck(checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys) {
      this.grandParentId = checkedKeys.checkedKeys
      this.grandParentContent = checkedKeys.checkedNodes
    },
    handlerConfirmDialog () {
      if (this.grandParentId && this.grandParentId.length === 1) {
        this.editFormRecordObj.systemsclauseid = this.grandParentId[0]
        this.editFormRecordObj.systemsclause = this.grandParentContent[0].title
        this.dialogTreeVisible = false
      } else {
        this.$message.error('请选择一条体系条款！！')
      }
    },
    handlerSelectPersonComfirm (list) {
      let self = this
      self.$set(self.editFormObj.children[self.personIndex].children[self.personIndex1], 'persionid', list
        .map(item => {
          return item.empuid
        })
        .join(','))
      self.$set(self.editFormObj.children[self.personIndex].children[self.personIndex1], 'persion', list
        .map(item => {
          return item.cnname
        })
        .join(','))
      self.$forceUpdate()
    },
    uploadFilesList2 (data) {
      this.fileList2 = data.fileList || []
      this.editFormRecordObj.fileids = this.fileList2[0].fileId
    },
    addResult () {
      for (let i = 0; i < this.userList.length; i++) {
        if (!this.userList[i].auditrecording) {
          this.$message.error('第' + Number(i + 1) + '行，审核记录不能为空！！')
          return false
        }
        if (!this.userList[i].auditresult) {
          this.$message.error('第' + Number(i + 1) + '行，审核结果不能为空！！')
          return false
        }
      }
      if (this.approveStatus === '0' || this.approveStatus === '2') {
        saveResult(this.userList).then((res) => {
          this.$message({
            type: 'success',
            message: '成功发起审核结果审批申请！'
          })
          this.approveStatus = ''
          getDetailByOrgid(this.deptid).then(res => {
            getListById(res.id).then(rt => {
              this.userList = rt
              for (let i = 0; i < this.userList.length; i++) {
                this.userList[i].pid = res.id
              }
              if (rt && rt.length > 0) {
                this.approveStatus = rt[0].status
              }
            })
          })
        })
      }
    },
    selectSystem () {
      if (this.editFormRecordObj.systemid) {
        this.grandParentId = []
        this.grandParentContent = []
        getSystemTree(this.editFormRecordObj.systemid).then(res => {
          this.menusTree = [res]
          this.grandParentId = [this.editFormRecordObj.systemsclauseid]
          this.grandParentContent = [{
            id: this.editFormRecordObj.systemsclauseid,
            content: this.editFormRecordObj.systemsclause
          }]
          this.dialogTreeVisible = true
        })
      } else {
        this.$message.error('请先选择相关体系！！')
      }
    },
    saveNotice2() {
      this.$refs['formRecord'].validate((valid) => {
        if (valid) {
          if (!this.editFormRecordObj.fileids) {
            this.$message.error('请上传附件')
            return false
          }
          saverecordingdm(this.editFormRecordObj).then((res) => {
            this.$message({
              type: 'success',
              message: '保存成功！'
            })
            this.dialogRecordListVisible = false
            this.approveStatus = ''
            getDetailByOrgid(this.deptid).then(res => {
              getListById(res.id).then(rt => {
                this.userList = rt
                for (let i = 0; i < this.userList.length; i++) {
                  this.userList[i].pid = res.id
                }
                if (rt && rt.length > 0) {
                  this.approveStatus = rt[0].status
                }
              })
            })
          })
        }
      })
    },
    getExcel () {
      if (this.deptid) {
        axios({
          method: 'post',
          url: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/systemOperationAudit/export`,
          data: this.userList,
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
            a.download = '体系运行审核结果'
            a.href = url
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)
          })
          .catch(() => { })
      } else {
        this.$message.error('请先选择相关体系！！')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-tree-node>.el-tree-node__children{
  overflow: visible;
}
.custom-tree-node{
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
    .opertionBtn{
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
