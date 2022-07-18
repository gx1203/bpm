<template>
  <div class="root" v-loading="pageLoading">
    <div :style="'width:' + (isPrint ? '940px' : '1080px')" class="info">
      <div class="head-content">
        <div class="title">
          <div class="logo">
            <img class="logo" :src="logo" alt />
          </div>
          <div class="title-text">
            <!--参观接待申请流程单-->
            {{ decodeURIComponent($route.query.name) }}
          </div>
        </div>
        <span v-if="node.subjectshow === 'Y'">
          <div class="subject">
            <el-input
              clearable
              v-model="node.subject"
              :disabled="isSubjectEdit"
              :prefix-icon="isSubjectEdit ? '' : 'el-icon-edit'"
              :placeholder="$t('placeholderText.pleaseEnterSubject')"
            >
            </el-input>
          </div>
        </span>
      </div>
      <div class="content" id="form">
        <div class="card1" ref="card1" v-if="node.applyUserDt">
          <div class="header">
            <span class="title"> {{ $t('applicantInformation') }}</span>
            <div class="space"></div>
            <el-button
              v-if="!isPrint"
              type="text"
              @click="isShow('card1', 'expand')"
            >
              {{ expand ? $t('putAway') : $t('unfold') }}</el-button
            >
          </div>
          <el-form ref="form" label-width="80px">
            <el-col :span="8">
              <el-form-item :label="$t('applicant')">
                <el-input
                  clearable
                  readonly
                  v-show="node.applyUserDto.cnname"
                  v-model="
                    node.applyUserDto.cnname + '(' + node.applyUserDto.id + ')'
                  "
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('applicationSector')">
                <el-input
                  clearable
                  readonly
                  v-model="node.applyUserDto.department"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('applicationDate')">
                <el-input
                  clearable
                  readonly
                  v-model="node.applyUserDto.applyDate"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form>
          <div class="card-info"></div>
        </div>
        <div>
          <div class="card" ref="card">
            <div class="header">
              <span class="title">申报明细</span>
              <div class="space"></div>
              <el-button
                v-if="!isPrint"
                type="text"
                class="collapse-btn"
                @click="isShow('card', 'payinfo')"
              >
                {{ payinfo ? $t('putAway') : $t('unfold') }}</el-button
              >
            </div>
            <el-row class="form">
              <el-col :span="12" class="form-item">
                <div class="form-item-head">
                  <span>申报编号</span>
                </div>
                <div class="form-item-value">
                  <div>
                    <div class="flow-item">
                      <el-input clearable disabled v-model="item.PAYNO" />
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-row :span="24">
              <div class="sub-table">
                <div class="sub-table-head" v-if="!isPrint">
                  <span>&nbsp;</span>
                  <div class="fill"></div>
                  <el-button
                    type="text"
                    v-if="node.processNodeName === '会审'"
                    icon="el-icon-download"
                    @click="excelFile"
                    >{{ $t('export') }}</el-button
                  >
                  <el-button
                    type="text"
                    v-if="!isNoStart"
                    icon="el-icon-circle-plus"
                    @click="addSubTableItem"
                  >
                    {{ $t('add') }}</el-button
                  >
                </div>
                <div class="sub-table-body">
                  <table>
                    <tr>
                      <th style="width: 50px">序号</th>
                      <th>资产名称</th>
                      <th>使用部门</th>
                      <th>申报数量</th>
                      <th>申购单价</th>
                      <th>申报金额</th>
                      <th>申报事项</th>
                      <th
                        v-if="
                          node.processNodeName !== 'Start' &&
                            node.processNodeName !== '资产汇总'
                        "
                      >
                        初审意见
                      </th>
                      <th
                        v-if="
                          node.processNodeName === '会审' ||
                            node.processNodeName === '财务部门审核' ||
                            node.processNodeName === '财务领导审核' ||
                            node.processNodeName === '集团公司分管领导审核' ||
                            node.processNodeName === '归档' ||
                            node.processNodeName === 'End'
                        "
                      >
                        审批意见
                      </th>
                      <th
                        v-if="
                          node.processNodeName === '会审' ||
                            node.processNodeName === '财务部门审核' ||
                            node.processNodeName === '财务领导审核' ||
                            node.processNodeName === '集团公司分管领导审核' ||
                            node.processNodeName === '归档' ||
                            node.processNodeName === 'End'
                        "
                      >
                        审批单价
                      </th>
                      <th
                        v-if="
                          node.processNodeName === '会审' ||
                            node.processNodeName === '财务部门审核' ||
                            node.processNodeName === '财务领导审核' ||
                            node.processNodeName === '集团公司分管领导审核' ||
                            node.processNodeName === '归档' ||
                            node.processNodeName === 'End'
                        "
                      >
                        审批数量
                      </th>
                      <th
                        v-if="
                          node.processNodeName === '会审' ||
                            node.processNodeName === '财务部门审核' ||
                            node.processNodeName === '财务领导审核' ||
                            node.processNodeName === '集团公司分管领导审核' ||
                            node.processNodeName === '归档' ||
                            node.processNodeName === 'End'
                        "
                      >
                        预算限额
                      </th>
                      <th>{{ $t('operating') }}</th>
                    </tr>
                    <tbody>
                      <tr v-for="(val, index1) in item.PAYLIST" :key="index1">
                        <td>{{ index1 + 1 }}</td>
                        <td>{{ val.STDNAME }}</td>
                        <td>{{ val.USERDEPARTMENT }}</td>
                        <td>{{ val.QUANTITYDECLARATIONS }}</td>
                        <td>{{ val.PURCHASEUNITPRICE }}</td>
                        <td>{{ val.AMOUNTDECLARED }}</td>
                        <td>{{ val.DECLARATIONMATTERS }}</td>
                        <td
                          v-if="
                            node.processNodeName !== 'Start' &&
                              node.processNodeName !== '资产汇总'
                          "
                        >
                          {{ val.PREOPTION }}
                        </td>
                        <td
                          v-if="
                            node.processNodeName === '会审' ||
                              node.processNodeName === '财务部门审核' ||
                              node.processNodeName === '财务领导审核' ||
                              node.processNodeName === '集团公司分管领导审核' ||
                              node.processNodeName === '归档' ||
                              node.processNodeName === 'End'
                          "
                        >
                          {{ val.APPROVALOPTION === '1' ? '同意' : '不同意' }}
                        </td>
                        <td
                          v-if="
                            node.processNodeName === '会审' ||
                              node.processNodeName === '财务部门审核' ||
                              node.processNodeName === '财务领导审核' ||
                              node.processNodeName === '集团公司分管领导审核' ||
                              node.processNodeName === '归档' ||
                              node.processNodeName === 'End'
                          "
                        >
                          {{ val.APPROVALPRICE }}
                        </td>
                        <td
                          v-if="
                            node.processNodeName === '会审' ||
                              node.processNodeName === '财务部门审核' ||
                              node.processNodeName === '财务领导审核' ||
                              node.processNodeName === '集团公司分管领导审核' ||
                              node.processNodeName === '归档' ||
                              node.processNodeName === 'End'
                          "
                        >
                          {{ val.APPROVALCOUNT }}
                        </td>
                        <td
                          v-if="
                            node.processNodeName === '会审' ||
                              node.processNodeName === '财务部门审核' ||
                              node.processNodeName === '财务领导审核' ||
                              node.processNodeName === '集团公司分管领导审核' ||
                              node.processNodeName === '归档' ||
                              node.processNodeName === 'End'
                          "
                        >
                          {{ val.BUDGET }}
                        </td>
                        <td style="width: 75px">
                          <el-button
                            icon="el-icon-edit"
                            type="text"
                            title="更多"
                            @click="editHandle(index1)"
                            style="margin: 0 10px;"
                          ></el-button>
                          <el-button
                            icon="el-icon-delete"
                            type="text"
                            :disabled="isNoStart"
                            :title="$t('delete')"
                            @click="delItem(index1)"
                            style="margin: 0 10px;"
                          ></el-button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </el-row>
          </div>
        </div>
        <div>
          <div class="card" ref="card2">
            <div class="header">
              <span class="title">合计</span>
              <div class="space"></div>
              <el-button
                v-if="!isPrint"
                type="text"
                class="collapse-btn"
                @click="isShow('card2', 'total')"
              >
                {{ total ? $t('putAway') : $t('unfold') }}</el-button
              >
            </div>
            <el-row
              v-if="
                node.processNodeName === '会审' ||
                  node.processNodeName === '财务部门审核' ||
                  node.processNodeName === '财务领导审核' ||
                  node.processNodeName === '集团公司分管领导审核' ||
                  node.processNodeName === '归档' ||
                  node.processNodeName === 'End'
              "
            >
              <div class="sub-table">
                <div class="sub-table-body">
                  <table>
                    <tr>
                      <th style="width: 50px">序号</th>
                      <th>使用部门</th>
                      <th>申报数量</th>
                      <th>申报金额</th>
                      <th>审批数量</th>
                      <th>预算限额</th>
                    </tr>
                    <tbody>
                      <tr
                        v-for="(val, index1) in propertyTotalList"
                        :key="index1"
                      >
                        <td>{{ index1 + 1 }}</td>
                        <td>{{ val.property }}</td>
                        <td>{{ val.amount }}</td>
                        <td>{{ val.money }}</td>
                        <td>{{ val.approveAmount }}</td>
                        <td>{{ val.approveMoney }}</td>
                      </tr>
                      <tr>
                        <td>合计：</td>
                        <td>{{ propertyListTotal.property }}</td>
                        <td>{{ propertyListTotal.amount }}</td>
                        <td>{{ propertyListTotal.money }}</td>
                        <td>
                          {{
                            propertyListTotal.approveAmount
                              ? propertyListTotal.approveAmount
                              : '-'
                          }}
                        </td>
                        <td>{{ propertyListTotal.approveMoney }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </el-row>
            <el-row v-else class="form">
              <el-col :span="12" class="form-item">
                <div class="form-item-head">
                  <span>申报数量</span>
                </div>
                <div class="form-item-value">
                  <div>
                    <div class="flow-item">
                      <el-input
                        clearable
                        disabled
                        v-model="item.TOTALQUANTITYDECLARED"
                      />
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="12" class="form-item">
                <div class="form-item-head">
                  <span>申报金额</span>
                </div>
                <div class="form-item-value">
                  <div>
                    <div class="flow-item">
                      <el-input
                        clearable
                        disabled
                        v-model="item.DECLAREDTOTALPRICE"
                      />
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div>
          <div class="card" ref="card3">
            <div class="header">
              <span class="title">附件信息</span>
              <div class="space"></div>
              <el-button
                v-if="!isPrint"
                type="text"
                class="collapse-btn"
                @click="isShow('card3', 'fileexpand')"
              >
                {{ fileexpand ? $t('putAway') : $t('unfold') }}</el-button
              >
            </div>
            <el-row class="form">
              <div class="file-list">
                <div class="file-list-head" v-if="!isPrint">
                  <span>&nbsp;</span>
                  <div class="fill"></div>
                  <el-upload
                    class="upload-demo"
                    :action="action"
                    :disabled="item.editstate === 'R'"
                    :with-credentials="true"
                    :headers="myHeaders"
                    :before-upload="beforeAvatarUpload"
                    multiple
                    :data="{ username: this.$store.state.basuser.user.userid }"
                    :on-success="onSuccess"
                  >
                    <el-button
                      type="text"
                      :disabled="isNoStart"
                      icon="el-icon-upload2"
                      >添加附件</el-button
                    >
                  </el-upload>
                  <el-button
                    type="text"
                    icon="el-icon-download"
                    @click="downLoadMoreFlie(item.FILELIST)"
                    style="margin-left: 10px;"
                    >批量下载</el-button
                  >
                  <el-button
                    type="text"
                    icon="el-icon-delete"
                    :disabled="isNoStart"
                    @click="deleteMoreFlie(item.FILELIST)"
                    style="margin-left: 10px;"
                    >{{ $t('batchDelete') }}
                  </el-button>
                </div>
                <div class="file-list-body">
                  <el-table
                    :data="item.FILELIST"
                    @selection-change="seleFileList"
                    ref="multipleTable"
                    border
                    style="width: 100%"
                  >
                    <el-table-column
                      type="selection"
                      width="60"
                    ></el-table-column>
                    <el-table-column
                      prop="newName"
                      :label="$t('fileName')"
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <p style="text-align: left;">{{ scope.row.newName }}</p>
                        <!-- <el-button
                              type="text"
                              @click="open(scope.row)"
                            >{{scope.row.newName}}</el-button> -->
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="size"
                      label="文件大小"
                      width="160"
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <span>{{
                          (scope.row.size / 1024 / 1024).toFixed(2) + 'Mb'
                        }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="type"
                      label="附件类型"
                      width="160"
                      show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column
                      prop="uploadUser"
                      label="上传者"
                      width="160"
                      show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column
                      :label="$t('operation')"
                      width="120"
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <el-button
                          type="text"
                          :title="$t('download')"
                          icon="el-icon-download"
                          @click="downloadFile(scope.row)"
                        ></el-button>
                        <el-button
                          type="text"
                          :disabled="isNoStart"
                          :title="$t('delete')"
                          icon="el-icon-delete"
                          @click="deleteFlie(scope.$index, scope.row)"
                        ></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-row>
          </div>
        </div>
        <slot name="approve"></slot>
        <slot name="view"></slot>
        <div v-if="!isPrint" class="footer text-r">
          <el-button
            type="cancel"
            class="cancel-btn"
            @click="cancel"
            :disabled="buttonDisabled"
            >{{ $t('cancel') }}
          </el-button>
          <el-button
            type="success"
            class="save-btn"
            @click="handleSave"
            v-if="!isView"
            :disabled="buttonDisabled"
          >
            {{ $t('save') }}</el-button
          >
          <el-button
            type="primary"
            class="submit-btn"
            @click="handleSubmit"
            v-if="!isView"
            :disabled="buttonDisabled"
          >
            提交表单</el-button
          >
        </div>
      </div>
    </div>
    <div v-if="!isPrint" class="float-banner">
      <div v-if="this.$route.query.type === 'edit'">
        <div
          class="btn"
          @click="handleRoute('暂停')"
          v-if="
            node.processInstanceInfo &&
              node.processInstanceInfo.status === '审批中'
          "
          style="font-size:12px;"
        >
          <span>暂停</span>
        </div>
        <div
          class="btn"
          @click="handleRoute('启用')"
          v-if="
            node.processInstanceInfo &&
              node.processInstanceInfo.status === '暂停'
          "
          style="font-size:12px;"
        >
          <span>启用</span>
        </div>
        <div
          v-if="
            node.processInstanceInfo &&
              node.processInstanceInfo.status !== '已完成'
          "
        >
          <div class="btn" @click="handleRoute('路由')" style="font-size:12px;">
            <span>路由</span>
          </div>
          <div class="btn" @click="handleRoute('终止')" style="font-size:12px;">
            <span>终止</span>
          </div>
          <div class="btn" @click="handleRoute('保存')" style="font-size:12px;">
            <span>保存</span>
          </div>
        </div>
      </div>
      <div
        v-if="
          isNoStart &&
            this.$route.query.type !== 'edit' &&
            this.$route.query.type !== 'collection'
        "
        class="btn"
        @click="collection"
      >
        <i
          :class="[collectionaData.id ? 'collection' : '', 'el-icon-star-on']"
        />
      </div>
      <div class="btn" @click="handlePrint">
        <el-tooltip :content="$t('print')">
          <i class="el-icon-printer" />
        </el-tooltip>
      </div>
      <div
        class="btn"
        v-if="node.processNodeName !== 'Start'"
        @click="handlePreview"
      >
        <el-tooltip :content="$t('previewApproval')">
          <i class="iconfont icon-chuanyue" style="font-size:24px" />
        </el-tooltip>
      </div>
      <div class="btn" v-if="node.helpinfo">
        <el-popover
          placement="left"
          :title="$t('tips')"
          v-model="isShowHelp"
          width="300"
          trigger="hover"
          :content="node.helpinfo"
        >
          <i slot="reference" class="el-icon-question" />
        </el-popover>
      </div>
      <div class="btn" @click="handleTop">
        <el-tooltip content="top">
          <i class="el-icon-top" />
        </el-tooltip>
      </div>
    </div>
    <process-dialog
      v-model="dialogVisible"
      :node="node"
      :isNoStart="isNoStart"
      :item="editItem"
      title="申报详情"
      @confirm="saveSuccess"
    />
    <preview-dialog
      :process="previewApprovers"
      v-model="previewApproversVisible"
      @confirm="confirm"
      :isBut="isBut"
    >
    </preview-dialog>
  </div>
</template>
<script>
import logo from '@/bpm/assets/img/common/logo-blue.png'
import axios from 'axios'
import { on, off, scrollTop } from '@/bpm/utils/backtop'
import { deleteCollection, saveCollection } from '@/bpm/api/flow'
import {
  cancelinstance,
  executeProcessInstance
} from '@/bpm/api/process/administrativeTool/flowManagement.js'
import { createNamespacedHelpers } from 'vuex'
import processDialog from '../processDialog'
import previewDialog from '@/bpm/components/processDialog'

import { fetch } from '@/bpm/utils'
import moment from 'moment-mini'
const { mapGetters, mapMutations } = createNamespacedHelpers('app')
export default {
  components: {
    processDialog,
    previewDialog
  },
  data() {
    return {
      logo: logo,
      pageLoading: false,
      dialogVisible: false,
      data: {},
      isBut: false,
      isShowHelp: false,
      errors: [],
      propertyTotalList: [],
      previewApprovers: {},
      previewApproversVisible: false,
      propertyListTotal: {
        money: 0,
        amount: 0,
        approveAmount: 0,
        approveMoney: 0
      },
      isPrint: false,
      expand: true,
      PAYLISTIndex: -1,
      data: {},
      item: {
        FILELIST: [],
        PAYLIST: []
      },
      editItem: {},
      payinfo: true,
      total: true,
      fileexpand: true,
      multFile: [],
      myHeaders: { token: localStorage.getItem('token') },
      action: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/attach/upload`
    }
  },
  props: {
    node: {
      type: Object,
      default: () => ({})
    },
    tabsList: {
      type: Array,
      default: () => []
    },
    isSubjectEdit: {
      type: Boolean,
      default: false
    },
    isNoStart: {
      type: Boolean,
      default: false
    },
    isView: {
      type: Boolean,
      default: false
    },
    submitaction: {
      type: String,
      default: ''
    },
    comment: {
      type: String,
      default: ''
    },
    collectionaData: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapGetters(['buttonDisabled'])
  },
  watch: {
    'node.nodeTabLists': {
      handler(val) {
        if (val) {
          this.node.applyUserDto.applyDate = this.$options.filters.formatDateTime(
            this.node.applyUserDto.applyDate
          )
          this.initData()
          if (
            this.node.processNodeName === '会审' ||
            this.node.processNodeName === '财务部门审核' ||
            this.node.processNodeName === '财务领导审核' ||
            node.processNodeName === '集团公司分管领导审核' ||
            this.node.processNodeName === '归档' ||
            this.node.processNodeName === 'End'
          ) {
            this.propertyTotal()
          }
          if (this.node.helpinfo) {
            this.$notify({
              title: '温馨提示',
              message: this.node.helpinfo,
              duration: 0
            })
          }
          this.isLoadData = true
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    ...mapMutations(['setErrorsShow', 'setButtonDisabled']),
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.$message.error(
          this.$t('hintText.uploadAttachmentSizeCannotExceed')
        )
      }
      return isLt2M
    },
    handleRoute(type) {
      if (type === '保存') {
      } else if (type === '终止') {
        this.$loading()
        cancelinstance(this.node.instanceId)
          .then(rt => {
            this.$loading().close()
            if (rt.status === '200') {
              window.opener = null
              window.open('', '_self')
              window.close()
            }
          })
          .catch(er => {
            this.$loading().close()
          })
      } else if (type === '暂停') {
        this.$loading()
        executeProcessInstance({
          handleType: 'EHM-001',
          instanceId: this.node.instanceId
        })
          .then(rt => {
            this.$loading().close()
            if (rt.status === '200') {
              window.opener = null
              window.open('', '_self')
              window.close()
            }
          })
          .catch(er => {
            this.$loading().close()
          })
      } else if (type === '启用') {
        this.$loading()
        executeProcessInstance({
          handleType: 'EHM-002',
          instanceId: this.node.instanceId
        })
          .then(rt => {
            this.$loading().close()
            if (rt.status === '200') {
              window.opener = null
              window.open('', '_self')
              window.close()
            }
          })
          .catch(er => {
            this.$loading().close()
          })
      } else if (type === '路由') {
        let routeData = this.$router.resolve({
          name: 'processRouting',
          query: {
            instanceId: this.node.instanceId
          }
        })
        let a = document.createElement('a')
        // 给创建好的a标签赋值
        a.setAttribute('href', routeData.href)
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
        // window.open(routeData.href, "_blank");
      }
    },
    initData() {
      let _bizData = this.node.bizData
      let _this = this
      if (_bizData && JSON.stringify(_bizData) !== '{}') {
        _bizData.PAYLIST.forEach((item, i) => {
          _this.item.PAYLIST[i] = {}
          if (this.isNoStart) {
            _this.item.PAYLIST[i].ID = item.ID.showValue
          }
          _this.item.PAYLIST[i].ASSERTID = item.ASSERTID.showValue
          _this.item.PAYLIST[i].STDNAME = item.STDNAME.showValue
          _this.item.PAYLIST[i].NUMBEROFCONFIGURATIONS =
            item.NUMBEROFCONFIGURATIONS.showValue
          _this.item.PAYLIST[i].QUANTITYDECLARATIONS =
            item.QUANTITYDECLARATIONS.showValue
          _this.item.PAYLIST[
            i
          ].PURCHASEUNITPRICE = _this.$options.filters.formatNumber(
            item.PURCHASEUNITPRICE.showValue,
            2,
            1
          )
          _this.item.PAYLIST[
            i
          ].AMOUNTDECLARED = _this.$options.filters.formatNumber(
            item.AMOUNTDECLARED.showValue,
            2,
            1
          )
          if (item.APPROVALPRICE && item.APPROVALPRICE.showValue) {
            _this.item.PAYLIST[
              i
            ].APPROVALPRICE = _this.$options.filters.formatNumber(
              item.APPROVALPRICE.showValue,
              2,
              1
            )
          }
          if (item.BUDGET && item.BUDGET.showValue) {
            _this.item.PAYLIST[i].BUDGET = _this.$options.filters.formatNumber(
              item.BUDGET.showValue,
              2,
              1
            )
          }
          _this.item.PAYLIST[i].DECLARATIONMATTERS =
            item.DECLARATIONMATTERS.showValue
          _this.item.PAYLIST[i].SERVICEROOM = item.SERVICEROOM.showValue
          _this.item.PAYLIST[i].ASSETCODING = item.ASSETCODING.showValue
          _this.item.PAYLIST[i].EXITCODING = item.EXITCODING.showValue
          _this.item.PAYLIST[i].ENABLATIONTIME = moment(
            item.ENABLATIONTIME.showValue
          ).format('YYYY-MM-DD')
          _this.item.PAYLIST[i].BRAND = item.BRAND.showValue || ''
          _this.item.PAYLIST[i].USERSBY = item.USERSBY.showValue
          _this.item.PAYLIST[i].ADMINISTRATORS = item.ADMINISTRATORS.showValue
          _this.item.PAYLIST[i].REASONSFORDECLARATION =
            item.REASONSFORDECLARATION.showValue
          _this.item.PAYLIST[i].USERDEPARTMENT = item.USERDEPARTMENT.showValue

          if (item.PREOPTION && item.PREOPTION.showValue) {
            _this.item.PAYLIST[i].PREOPTION = item.PREOPTION.showValue
          } else {
            _this.item.PAYLIST[i].PREOPTION = '同意'
          }
          if (item.APPROVALOPTION && item.APPROVALOPTION.showValue) {
            _this.item.PAYLIST[i].APPROVALOPTION = item.APPROVALOPTION.value
          } else {
            _this.item.PAYLIST[i].APPROVALOPTION = '1'
          }
          if (item.APPROVALPRICE && item.APPROVALPRICE.showValue) {
            _this.item.PAYLIST[i].APPROVALPRICE = item.APPROVALPRICE.showValue
          }
          if (item.APPROVALCOUNT && item.APPROVALCOUNT.showValue) {
            _this.item.PAYLIST[i].APPROVALCOUNT = item.APPROVALCOUNT.showValue
          }
          // _this.item.PAYLIST[i].APPROVALPRICE = item.APPROVALPRICE.showValue || '';
          // _this.item.PAYLIST[i].APPROVALCOUNT = item.APPROVALCOUNT.showValue;

          _this.item.PAYLIST[i].PROCUREMENTAUTHORITY =
            item.PROCUREMENTAUTHORITY.showValue
        })
        _this.item.PAYNO = _bizData.PAYNO.showValue
        _this.item.TOTALQUANTITYDECLARED =
          _bizData.TOTALQUANTITYDECLARED.showValue
        _this.item.DECLAREDTOTALPRICE = this.$options.filters.formatNumber(
          _bizData.DECLAREDTOTALPRICE.showValue,
          2,
          1
        )
        _this.item.FILELIST = _bizData.FILELIST || []
      }
    },
    propertyTotal() {
      // 把相同部门的放在一起
      let approvalRecordSectionList = Array.from(
        new Set(this.item.PAYLIST.map(item => item.USERDEPARTMENT))
      )
      this.propertyTotalList = []
      this.propertyListTotal = {
        money: 0,
        amount: 0,
        approveAmount: 0,
        approveMoney: 0
      }
      approvalRecordSectionList.forEach(val => {
        let amount = 0
        let money = 0
        let approveAmount = 0
        let approveMoney = 0
        this.item.PAYLIST.forEach(item => {
          if (val === item.USERDEPARTMENT) {
            amount += this.$options.filters.delcommafy(
              item.QUANTITYDECLARATIONS
            )
            money += this.$options.filters.delcommafy(item.AMOUNTDECLARED)
            approveAmount += this.$options.filters.delcommafy(
              item.APPROVALCOUNT || 0
            )
            approveMoney += this.$options.filters.delcommafy(item.BUDGET || 0)
          }
        })
        this.propertyListTotal = {
          amount: this.$options.filters.formatNumber(
            this.$options.filters.delcommafy(this.propertyListTotal.amount) +
              amount,
            0,
            1
          ),
          money: this.$options.filters.formatNumber(
            this.$options.filters.delcommafy(this.propertyListTotal.money) +
              money,
            2,
            1
          ),
          approveAmount: this.$options.filters.formatNumber(
            this.$options.filters.delcommafy(
              this.propertyListTotal.approveAmount
            ) + approveAmount,
            0,
            1
          ),
          approveMoney: this.$options.filters.formatNumber(
            this.$options.filters.delcommafy(
              this.propertyListTotal.approveMoney
            ) + approveMoney,
            2,
            1
          )
        }
        this.propertyTotalList.push({
          amount: this.$options.filters.formatNumber(amount, 0, 1),
          money: this.$options.filters.formatNumber(money, 2, 1),
          approveAmount: this.$options.filters.formatNumber(
            approveAmount,
            0,
            1
          ),
          approveMoney: this.$options.filters.formatNumber(approveMoney, 2, 1),
          property: val
        })
      })
      // let obj = {}
      // this.approvalRecordSectionList = approvalRecordSectionList.reduce(
      //   function (item, next) {
      //     obj[next.approveCategory]
      //       ? ''
      //       : (obj[next.approveCategory] = true && item.push(next))
      //     return item
      //   },
      //   []
      // )
      // this.approvalRecordSectionList.forEach(item => {
      //   item.list = []
      //   this.approvalRecordList.forEach(val => {
      //     if (item.approveCategory === val.approveCategory) {
      //       item.list.push(val)
      //     }
      //   })
      // })
    },
    collection() {
      if (this.collectionaData.id) {
        deleteCollection(this.collectionaData.id).then(rt => {
          if (rt.status === '200') {
            this.$message.success('取消成功')
            this.collectionaData = {}
          }
        })
      } else {
        saveCollection({
          drafter: this.node.drafter,
          id: this.node.id,
          instanceId: this.node.instanceId,
          processCnname: this.node.processCnname,
          reqDate: this.node.reqDate,
          reqNo: this.node.reqno,
          service: this.node.service,
          status: this.node.status,
          subject: this.node.subject,
          userId: this.node.userId
        }).then(rt => {
          if (rt.status === '200') {
            this.$message.success('收藏成功')
            this.$set(this.collectionaData, 'id', rt.data.id)
          }
        })
      }
    },
    cancel() {
      // this.$router.back()
      window.opener = null
      window.open('', '_self')
      window.close()
    },
    handleSave() {
      this.data = {}
      this.errors = []
      this.getFormData()
      if (
        this.node.subjectshow === 'Y' &&
        this.node.subjectRequired === 'Y' &&
        !this.node.subject
      ) {
        this.$message.error('主题不能为空')
        return
      } else if (
        this.node.subjectshow === 'Y' &&
        this.node.subjectRequired === 'Y' &&
        this.node.subject.length > 200
      ) {
        this.$message.error('主题长度不能超过200个字符！')
        return
      }
      this.$emit('handleSave', this.data)
    },
    handleSubmit() {
      this.errors = []
      if (
        this.node.subjectshow === 'Y' &&
        this.node.subjectRequired === 'Y' &&
        !this.node.subject
      ) {
        this.$message.error('主题不能为空')
        return
      } else if (
        this.node.subjectshow === 'Y' &&
        this.node.subjectRequired === 'Y' &&
        this.node.subject.length > 200
      ) {
        this.$message.error('主题长度不能超过200个字符！')
        return
      }
      if (
        this.errors.length === 0 ||
        this.submitaction === 'noAgreed' ||
        this.submitaction === 'anyActivityBtn' ||
        this.submitaction === 'reApplyBtn' ||
        this.submitaction === 'cancelBtn' ||
        this.submitaction === 'returnToBtn'
      ) {
        if (this.isLoad && typeof eval(window['submit']) === 'function') {
          window['submit'](this, this.data).then(rt => {
            if (!rt) return
            this.submitForm()
          })
        } else {
          this.submitForm()
        }
      } else {
        this.$message({
          showClose: true,
          message: `${this.errors[0].fieldShowName}不能为空`,
          type: 'error'
        })
        this.setErrorsShow(true)
      }
    },
    submitForm() {
      if (this.$route.query.taskId) {
        if (!this.submitaction) {
          this.$message('请选择审批意见')
          return
        }
        if (
          this.submitaction === 'noAgreed' ||
          this.submitaction === 'anyActivityBtn' ||
          this.submitaction === 'reApplyBtn' ||
          this.submitaction === 'cancelBtn' ||
          this.submitaction === 'returnToBtn'
        ) {
          if (!this.comment) {
            this.$message('请填写审批记录')
            return
          }
        }
      }

      if (this.node.processNodeName === 'Start') {
        this.previewApprovers = {
          processName: this.node.processName,
          defaultPositionId: this.node.defaultPositionId,
          userId: this.$store.state.basuser.user.userid,
          bizData: this.data
        }
        this.isBut = true
        this.previewApproversVisible = true
      } else {
        this.$confirm('是否确认提交?', this.$t('hintText.hint'), {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(() => {
            this.data = {}
            this.getFormData()
            this.setButtonDisabled(true)
            this.$emit('handleSubmit', this.data)
          })
          .catch(() => {
            this.setButtonDisabled(false)
            this.$message({
              type: 'info',
              message: '已取消提交'
            })
          })
      }
    },
    handlePreview() {
      this.previewApprovers = {
        instanceId: this.node.instanceId
      }
      this.isBut = false
      this.previewApproversVisible = true
    },
    confirm(isSave) {
      if (isSave) {
        this.data = {}
        this.getFormData()
        this.setButtonDisabled(true)
        this.$emit('handleSubmit', this.data)
      }
    },
    excelFile() {
      this.getFormData()
      axios({
        method: 'post',
        url: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/assertsummary/exportExcel`,
        data: this.data.PAYLIST,
        headers: {
          token: localStorage.getItem('token')
        },
        responseType: 'blob'
      })
        .then(res => {
          let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob)
          } else {
            var a = document.createElement('a')
            document.body.appendChild(a)
            a.style = 'display: none'
            var url = window.URL.createObjectURL(blob)
            a.href = url
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)
          }
          // let url = window.URL.createObjectURL(blob);
          // window.location.href = url;
        })
        .catch(() => {})
    },
    handlePrint() {
      if (
        this.node.defaultPrint === 'Y' &&
        this.node.processNodeName !== 'Start'
      ) {
        let routeData = this.$router.resolve({
          name: this.node.processName + 'Print',
          query: {
            instanceId: this.node.instanceId
          }
        })
        let a = document.createElement('a')
        // 给创建好的a标签赋值
        a.setAttribute('href', routeData.href)
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
        // window.open(routeData.href, "_blank");
      } else {
        this.isPrint = true
        this.$nextTick(() => {
          window.print()
          this.isPrint = false
        })
      }
    },
    getFormData() {
      this.editItem = {}
      this.data = Object.assign({}, this.item)
      this.data.DECLAREDTOTALPRICE = this.$options.filters.delcommafy(
        this.data.DECLAREDTOTALPRICE
      )
      this.data.PAYLIST.forEach(item => {
        item.PURCHASEUNITPRICE = this.$options.filters.delcommafy(
          item.PURCHASEUNITPRICE
        )
        item.AMOUNTDECLARED = this.$options.filters.delcommafy(
          item.AMOUNTDECLARED
        )
        item.BUDGET = this.$options.filters.delcommafy(item.BUDGET)
        item.APPROVALPRICE = this.$options.filters.delcommafy(
          item.APPROVALPRICE
        )
      })
      if (this.data.FILELIST.length > 0) {
        this.data.FILELIST = this.data.FILELIST.map(item => item.id).join(',')
      }
    },
    dateConversion: time => {
      let date = new Date(time + 8 * 3600 * 1000)
      let nyr = date.toJSON().substr(0, 10)
      let sfm = date.toJSON().substr(11, 8)
      return sfm === '00:00:00' ? nyr : `${nyr} ${sfm}`
    },
    isShow(c, el) {
      this[el] = !this[el]
      this.slideToggle(c, this[el])
    },
    slideToggle(c, show) {
      const parent = this.$refs[c]
      if (show) {
        parent.style.overflow = 'hidden'
        parent.style.height = 40 + parent.lastElementChild.offsetHeight + 'px'
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          parent.style.overflow = 'auto'
          parent.style.height = 'auto'
        }, 500)
      } else {
        parent.style.overflow = 'hidden'
        parent.style.height = 40 + parent.lastElementChild.offsetHeight + 'px'
        setTimeout(() => {
          parent.style.overflow = 'hidden'
          parent.style.height = '35px'
        }, 10)
      }
    },
    handleTop() {
      // 回到顶部
      const sTop = document.documentElement.scrollTop || document.body.scrollTop
      scrollTop(window, sTop, 0, this.duration, this.timing)
      document.getElementById('app').scrollTop = 0
    },
    handleScroll() {
      this.backTop = window.pageYOffset >= this.height
    },
    saveSuccess(data) {
      if (this.PAYLISTIndex != -1) {
        this.item.PAYLIST[this.PAYLISTIndex] = data
      } else {
        this.item.PAYLIST.push(data)
      }
      this.handleTotal()
    },
    handleTotal() {
      if (this.item.PAYLIST && this.item.PAYLIST.length > 0) {
        this.item.TOTALQUANTITYDECLARED = this.item.PAYLIST.map(
          item => item.QUANTITYDECLARATIONS
        ).reduce(function(num, item, index) {
          let total = Number(num)
          if (!isNaN(item)) {
            total += Number(item)
          }
          return total
        })
        let sum = this.item.PAYLIST.map(item =>
          this.$options.filters.delcommafy(item.AMOUNTDECLARED)
        ).reduce(function(num, item, index) {
          let total = Number(num)
          if (!isNaN(item)) {
            total += Number(item)
          }
          return total.toFixed(2)
        })
        this.item.DECLAREDTOTALPRICE = this.$options.filters.formatNumber(
          sum,
          2,
          1
        )
      } else {
        this.item.TOTALQUANTITYDECLARED = 0
        this.item.DECLAREDTOTALPRICE = 0
      }
      if (
        this.node.processNodeName === '会审' ||
        this.node.processNodeName === '财务部门审核' ||
        this.node.processNodeName === '财务领导审核' ||
        node.processNodeName === '集团公司分管领导审核' ||
        this.node.processNodeName === '归档' ||
        this.node.processNodeName === 'End'
      ) {
        this.propertyTotal()
      }
    },
    editHandle(index) {
      this.PAYLISTIndex = index
      this.editItem = Object.assign({}, this.item.PAYLIST[index])
      this.dialogVisible = true
    },
    delItem(index) {
      this.item.PAYLIST.splice(index, 1)
      this.handleTotal()
    },
    addSubTableItem() {
      this.PAYLISTIndex = -1
      this.dialogVisible = true
      this.editItem = {
        PROCUREMENTAUTHORITY: '信息中心',
        APPROVALOPTION: '1',
        USERDEPARTMENT: this.node.applyUserDto.department,
        PREOPTION: '同意'
      }
      // this.item.PAYLIST.push({});
    },
    onSuccess(res) {
      this.item.FILELIST.push(res)
    },
    downLoadMoreFlie() {
      if (this.multFile.length !== 0) {
        this.$loading()
        axios
          .get(
            `${process.env.VUE_APP_HOST_URL}${
              process.env.VUE_APP_BASE_URL
            }/bpm/attachment/download/batch/${this.multFile.join()}?attachmentType=bpm`,
            {
              responseType: 'arraybuffer',
              headers: {
                ...this.myHeaders
              }
            }
          )
          .then(rt => {
            this.$loading().close()
            window.location.href = rt.config.url

            // window.location.href = rt.request.responseURL
          })
          .catch(() => {
            this.$loading().close()
          })
      } else {
        this.$message({
          message: '请选择要下载的附件',
          type: 'error'
        })
      }
    },
    downloadFile(item) {
      this.$loading()
      axios
        .get(
          `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/bpm/attachment/download/${item.id}?attachmentType=bpm`,
          {
            responseType: 'arraybuffer',
            headers: {
              ...this.myHeaders
            }
          }
        )
        .then(rt => {
          this.$loading().close()
          window.location.href = rt.request.responseURL
        })
        .catch(() => {
          this.$loading().close()
        })
    },
    deleteFlie(index, item) {
      this.$confirm(
        `您确定要删除【${item.newName}】吗?`,
        this.$t('hintText.hint'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          this.item.FILELIST.splice(index, 1)
        })
        .catch(_ => {})
    },
    deleteMoreFlie(rows) {
      if (this.multFile.length !== 0) {
        this.$confirm('确认删除吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(() => {
            for (let i = rows.length - 1; i >= 0; i--) {
              if (this.multFile.includes(rows[i].id)) {
                rows.splice(i, 1)
              }
            }
            this.$refs.multipleTable.clearSelection()
          })
          .catch(() => {})
      } else {
        this.$message({
          message: '请选择要删除的附件',
          type: 'error'
        })
      }
    },
    seleFileList(val) {
      this.multFile = val.map(item => item.id)
    }
  },
  mounted() {
    window.myAjax = fetch
    this.setErrorsShow(false)
    on(window, 'scroll', this.handleScroll)
    on(window, 'resize', this.handleScroll)
  },
  beforeDestroy() {
    off(window, 'scroll', this.handleScroll)
    off(window, 'resize', this.handleScroll)
  }
}
</script>
<style type="text/scss" lang="scss">
.root {
  .card1 {
    .el-input__inner {
      // border: 0;
      border-bottom: 1px solid #e5e5e5;
    }
  }
}
</style>

<style type="text/scss" lang="scss" scoped>
.collection {
  color: #ffff00;
}
.root {
  min-height: 100%;
}
.info {
  margin: 0 auto;
}
.head-content {
  margin: 0 auto;
  padding: 15px 0px;
  background: $bc1;
  border-left: 1px solid $dc1;
  border-right: 1px solid $dc1;

  .title {
    margin-bottom: 15px;
    margin-left: 15px;
    overflow: hidden;

    .logo {
      float: left;
      margin-right: 10px;
      img {
        height: 36px;
      }
    }

    .title-text {
      height: 36px;
      line-height: 36px;
      overflow: hidden;
      font-size: 16px;
    }
  }
}
.content {
  background: $bc1;
  border: 1px solid $dc1;
  padding-bottom: 54px;

  .errors {
    background: #ffffcc;
    padding: 10px;
    margin: 10px;
    p {
      color: $danger;
      font-size: 14px;
      font-weight: bold;
    }
  }

  .card1 {
    padding: 0 5px 15px 15px;
    background: white;
    border-bottom: 1px solid $dc1;
    overflow: hidden;
    transition-duration: 0.5s;
    box-sizing: border-box;
    // height: 70px;
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
    .card-info {
      display: flex;
      justify-content: space-between;
      padding-right: 10px;
      padding-left: 15px;
      // .space {
      //   flex-grow: 1;
      // }
      // span {
      //   padding: 5px;
      // }
    }
  }

  .cancel-btn {
    background: $bc2;
    margin: 15px 0;
    width: 80px;
  }
  .save-btn {
    width: 80px;
    margin: 15px 10px;
  }
  .submit-btn {
    background: $bc4;
    margin: 15px 0;
    width: 80px;
  }
}

.float-banner {
  position: fixed;
  right: calc(50% - 590px);
  bottom: 100px;
  width: 40px;

  .btn {
    width: 30px;
    height: 30px;
    margin-top: 5px;
    background: rgba(120, 120, 120, 0.3);
    text-align: center;
    line-height: 30px;
    font-size: 20px;
    color: white;
    cursor: pointer;
  }
}
.footer {
  position: fixed;
  z-index: 100;
  bottom: 0;
  width: 1080px;
}
.card {
  padding: 0 0 15px 15px;
  background: white;
  border-bottom: 1px solid $dc1;
  transition-duration: 0.5s;
  box-sizing: border-box;
  .header {
    margin-right: 15px;
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
    /*.collapse-btn {*/
    /*flex-grow: 1;*/
    /*text-align: right;*/
    /*}*/
  }
  .form {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 15px;
    .form-item {
      margin-bottom: 24px;
      .form-item-head {
        min-width: 88px;
        padding-right: 15px;
        display: table-cell;
        vertical-align: middle;
        text-align: right;

        span {
          line-height: 28px;
        }
      }
      .form-item-value {
        width: 100%;
        display: table-cell;
        vertical-align: middle;
        padding-right: 15px;
        position: relative;
        .checkText {
          position: absolute;
          bottom: -18px;
        }
      }
      .form-item-value.err {
        /deep/ .flow-item input.el-input__inner {
          border-bottom: 1px solid red;
        }
      }
    }
  }
}
.print-text {
  border: 1px solid $dc1;
  min-height: 28px;
  line-height: 28px;
  padding: 0 15px;
  box-sizing: border-box;
}
.bag {
  background: #f5f7fa;
}
.sub-table {
  /*display: table-cell;*/
  vertical-align: middle;
  padding-right: 10px;
  width: 100%;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
  &-head {
    display: flex;
    align-items: flex-end;
    margin-bottom: 10px;
    .fill {
      flex-grow: 1;
    }
  }
  &-body {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    overflow-x: auto;
    // border: solid 1px $dc1;
    table {
      min-width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
    }
    th {
      background: #f5f5f5;
      padding: 7px 10px;
      text-align: center;
      border: 1px solid #ebeef5;
    }
    tbody {
      td {
        text-align: center;
        padding: 10px 5px;
        position: relative;
        border: 1px solid #ebeef5;
        /deep/ .el-input {
          min-width: 130px;
        }
        .checkText {
          position: absolute;
          bottom: 2px;
          font-size: 12px;
        }
      }
    }
  }
}
.file-list {
  padding-right: 10px;
  width: 100%;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
  &-head {
    display: flex;
    align-items: flex-end;
    margin-bottom: 10px;
    .fill {
      flex-grow: 1;
    }
    .upload-demo {
      /deep/ .el-upload-list {
        display: none;
      }
    }
  }
  &-body {
    .el-table {
      /deep/ th,
      /deep/ td {
        padding: 7px 0;
        text-align: center;
        .cell {
          line-height: 16px;
        }
      }
      /deep/ .el-table__body-wrapper {
        .el-table__empty-block {
          min-height: 30px;
          .el-table__empty-text {
            line-height: 30px;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>

<style type="text/scss" lang="scss">
.flow-item input.el-input__inner {
  // border: 0;
  border-bottom: 1px solid $dc1;

  &:focus {
    border-bottom: 1px solid $bc3;
  }
}
.subject {
  margin-left: 15px;
}
.subject input.el-input__inner {
  // border: 0;
  // border-bottom: 1px solid $dc1;
  width: 40%;

  &:focus {
    border-bottom: 1px solid $bc3;
  }
}
</style>
