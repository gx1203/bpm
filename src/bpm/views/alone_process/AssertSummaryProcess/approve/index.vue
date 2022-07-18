<template>
  <flow-form
    :node="node"
    :tabsList="tabsList"
    :comment="approvalComment"
    :submitaction="submitaction"
    @handleSubmit="handleSubmit"
    @handleSave="handleSave"
    isSubjectEdit
    :isNoStart="isNoStart"
    :collectionaData="collectionaData"
  >
    <div slot="approve" style="border-top: 1px solid #e5e5e5;">
      <flow-card :data="approveTypeCardItem" :isMoreCard="true">
        <div slot="card">
          <el-row class="form">
            <el-col class="form-item">
              <el-radio-group v-model="submitaction">
                <el-radio
                  v-for="(item, index) in approveTypeList"
                  :label="item.rightscode"
                  :key="index"
                  @change="changeApproveType(item)"
                >{{item.name}}</el-radio>
              </el-radio-group>
            </el-col>
            <el-col
              :span="8"
              class="form-item"
              v-if="submitaction === 'countersign' || submitaction === 'plusSigned' || submitaction === 'transferPackage'"
            >
              <el-input clearable
                type="text"
                :placeholder="$t('placeholderText.pleaseSelect')"
                v-model="selectedUsers.name"
                reaonly
                @click.native="peopleDialog = true"
              ></el-input>
              <select-people
                :isMore="submitaction !== 'transferPackage'"
                v-model="peopleDialog"
                @confirm="getUser"
              ></select-people>
            </el-col>
            <el-col class="form-item">
              <el-autocomplete
                style="width:100%"
                class="inline-input"
                v-model="approvalComment"
                value-key="remark"
                :fetch-suggestions="querySearch"
                type="textarea"
                :maxlength="300"
                show-word-limit
                placeholder="请填写审批记录..."
              >
                <template slot-scope="{ item }">
                  <div class="name">
                    <el-tooltip :content="$t('delete')" v-if="item.type !== '1'">
                      <el-button type="text" icon="el-icon-delete" @click.stop="handleDelete(item)"></el-button>
                    </el-tooltip>
                    {{ item.remark }}
                  </div>
                </template>
              </el-autocomplete>
              <el-button type="primary" @click="addApproveRecord" class="margin-t10">{{ $t('addToCommonApproval') }}</el-button>
              <!-- <el-input clearable type="textarea" placeholder="请填写审批记录..." v-model="approvalComment"></el-input> -->
            </el-col>
          </el-row>
        </div>
      </flow-card>
      <flow-card :data="approvalRecordCardItem" :isMoreCard="true">
        <div slot="card">
          <el-row class="form">
            <el-col :span="24" class="text-r margin-b15">
              <el-button @click="isApprove=!isApprove" type="primary">
                <i class="el-icon-sort"></i>
                {{!isApprove?$t('sortByTime'):$t('sortByDepartment')}}
              </el-button>
            </el-col>

            <el-table
              v-if="isApprove"
              :data="approvalRecordList"
              border
              style="width: 100%; text-align: center"
            >
              <el-table-column prop="processnodename" :label="$t('node')" show-overflow-tooltip></el-table-column>
              <el-table-column prop="usernames" :label="$t('name')" show-overflow-tooltip></el-table-column>
              <el-table-column prop="result" :label="$t('action2')" show-overflow-tooltip></el-table-column>
              <el-table-column prop="createdate" :label="$t('time')" width="180" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.createdate | formatDateTime}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="reason" :label="$t('remarks')" show-overflow-tooltip></el-table-column>
            </el-table>
            <el-col class="approve-table" :span="24" v-else>
              <div class="table-header">
                <sort-button style="flex-grow: 1" :items="headers" />
              </div>
              <div v-for="(item, index) in approvalRecordSectionList" :key="index">
                <h4 v-if="item.approveCategory">{{item.approveCategory}}</h4>
                <div v-for="(val, index1) in item.list" :key="index1">
                  <el-row class="tr-body" type="flex" align="middle">
                    <el-col class="td text-c" :span="headers[0].span">{{val.processnodename}}</el-col>
                    <el-col class="td text-c" :span="headers[1].span">{{val.usernames}}</el-col>
                    <el-col class="td text-c" :span="headers[2].span">{{val.result}}</el-col>
                    <el-col class="td text-c" :span="headers[3].span">{{val.createdate | formatDateTime }}</el-col>
                    <el-col class="td text-c" :span="headers[4].span" :title="val.reason">{{val.reason}}</el-col>
                  </el-row>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </flow-card>
    </div>
  </flow-form>
</template>
<script>
import FlowForm from '../flow_form'
import FlowCard from '@/bpm/views/flow_form/FlowCard'
import SelectPeople from '@/bpm/views/flow_form/SelectPeople'
import {
  getApproveProcessForm,
  approveProcess,
  saveProcess,
  getApprovalRemark,
  saveApprovalRemark,
  deleteApprovalRemark,
  getbyinstanceid
} from '@/bpm/api/flow'
import { createNamespacedHelpers } from 'vuex'
const { mapMutations } = createNamespacedHelpers('app')
export default {
  components: {
    FlowForm,
    FlowCard,
    SelectPeople
  },
  data () {
    return {
      node: {
        applyUserDto: {},
        nodeTabLists: []
      },
      headers: [
        {
          name: '节点',
          span: 6
        },
        {
          name: '姓名',
          span: 6
        },
        {
          name: '动作',
          span: 6
        },
        {
          name: '时间',
          span: 6
        },
        {
          name: this.$t('remarks'),
          span: 6
        }
      ],
      tabsList: [],
      isApprove: true,
      approveTypeList: [],
      approvalRecordList: [],
      approvalRecordSectionList: [],
      expand: true,
      submitaction: '',
      approvalComment: '',
      selectedUsers: {
        name: '',
        id: ''
      },
      approveTypeCardItem: {
        tabname: this.$t('approvalOperation'),
        nodeTabLists: []
      },
      approvalRecordCardItem: {
        tabname: this.$t('historicalApprovalRecord'),
        nodeTabLists: []
      },
      restaurants: [],
      spanArr: [],
      peopleDialog: false,
      isNoStart: this.$route.query.category !== 'MORE_APPLY',
      collectionaData: {}
    }
  },
  watch: {
    submitaction (val) {
      for (let key in this.selectedUsers) {
        this.selectedUsers[key] = ''
      }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    ...mapMutations(['setBizData', 'setButtonDisabled', 'setTemporaryBizData']),
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      // if(){
      // }
    },
    handleDelete (item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          deleteApprovalRemark(item.id).then(rt => {
            if (rt.status === '200') {
              this.$message({
                message: this.$t('hintText.successfullyDelete'),
                type: 'success'
              })
              this.getApprovalRemark()
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
    createFilter (queryString) {
      return restaurant => {
        return (
          restaurant.remark.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        )
      }
    },
    addApproveRecord () {
      if (!this.approvalComment) {
        this.$message.error('请输入审批记录！！')
        return
      } else if (this.approvalComment.length > 300) {
        this.$message.error('请输入300以内的字符！！')
        return
      }
      saveApprovalRemark({
        type: '2',
        sort: ++this.restaurants[this.restaurants.length - 1].sort,
        userid: this.$store.state.basuser.user.id,
        remark: this.approvalComment
      })
        .then(rt => {
          if (rt.status === '200') {
            this.$message({
              message: this.$t('hintText.saveSuccessfully'),
              type: 'success'
            })
            this.getApprovalRemark()
          } else {
            this.$message({
              message: rt.message,
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
    getApprovalRemark () {
      getApprovalRemark({
        attr: {
          userid: this.$store.state.basuser.user.id
        }
      })
        .then(rt => {
          this.restaurants = rt.data.list
        })
        .catch(() => {
          this.$loading().close()
        })
    },
    querySearch (queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    getData () {
      this.$loading()
      getApproveProcessForm({
        taskId: this.$route.query.taskId,
        userId: this.$store.state.basuser.user.id
      })
        .then(rt => {
          this.$loading().close()
          this.node = rt.data
          this.tabsList = this.node.nodeTabLists.filter(item => {
            return item.istab === '1'
          })
          this.approveTypeList = this.node.approveTypeList
          this.approveTypeList.forEach(item => {
            if (item.rightscode === 'agreed') {
              this.submitaction = item.rightscode
              this.approvalResult = item.name
            } else {
              this.submitaction = this.approveTypeList[0].rightscode
              this.approvalResult = this.approveTypeList[0].name
            }
          })
          this.node.approvalRecordList.forEach(item=>{
              item.usernames = item.username
              if(item.attribute1 && item.attribute1 !== item.userid){
                item.usernames = `${item.username}-代-${item.grantorName}`
              }
          });
          this.approvalRecordList = this.node.approvalRecordList

          // 把相同部门的放在一起
          this.approvalRecordSectionList = this.approvalRecordList.map(item => {
            return {
              approveCategory: item.approveCategory
            }
          })
          let obj = {}
          this.approvalRecordSectionList = this.approvalRecordSectionList.reduce(
            function (item, next) {
              obj[next.approveCategory]
                ? ''
                : (obj[next.approveCategory] = true && item.push(next))
              return item
            },
            []
          )
          this.approvalRecordSectionList.forEach(item => {
            item.list = []
            this.approvalRecordList.forEach(val => {
              if (item.approveCategory === val.approveCategory) {
                val.usernames = val.username
                if(val.attribute1 && val.attribute1 !== val.userid){
                  val.usernames = `${val.username}-代-${val.grantorName}`
                }
                item.list.push(val)
              }
            })
          })

          this.setBizData(this.node.bizData)
          this.setTemporaryBizData(this.node.bizData)
          this.getApprovalRemark()
          this.getCollection(this.node.instanceId)
        })
        .catch(() => {
          this.$loading().close()
        })
    },
    getCollection (id) {
      getbyinstanceid(id).then(rt => {
        this.collectionaData = rt.data
      })
    },
    changeApproveType (item) {
      this.approvalResult = item.name
    },
    handleSave (data) {
      this.$loading()
      saveProcess({
        bizData: data,
        instanceId: this.node.instanceId,
        subject: this.node.subject,
        userId: this.node.userId
      })
        .then(rt => {
          this.$message({
            message: this.$t('hintText.saveSuccessfully'),
            type: 'success'
          })
          localStorage.setItem('isReloadDrafts', true)
          window.opener = null;
          window.open("", "_self");
          window.close();
          this.$loading().close()
        })
        .catch(() => {
          this.$loading().close()
        })
    },
    handleSubmit (data) {
      this.$loading()
      approveProcess({
        bizData: data,
        applyUserId: this.node.applyUserDto.id,
        approvalComment: this.approvalComment,
        approvalResult: this.submitaction,
        selectedUsers: this.selectedUsers.id,
        subject: this.node.subject,
        submitaction: this.approvalResult,
        targetActivityName: this.node.targetActivityName,
        taskId: this.node.taskId,
        userId: this.node.userId,
        index: this.$route.query.index
      })
        .then(rt => {
          let that = this
          this.$message({
            message: this.$t('hintText.submittedSuccessfully'),
            type: 'success',
            duration: 2000,
            onClose () {
              that.$router.back()
              that.setButtonDisabled(false)
            }
          })
          localStorage.setItem('isReload', true)
          window.opener = null;
          window.open("", "_self");
          window.close();
          this.$loading().close()
        })
        .catch(() => {
          this.setButtonDisabled(false)
          this.$loading().close()
        })
    },
    getUser (data) {
      this.selectedUsers.name = data.map(item => item.cnname).join('、')
      this.selectedUsers.id = data.map(item => item.empuid).join(',')
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.approve-table {
  border-left: 1px solid $dc1;
  border-top: 1px solid $dc1;
  .table-header {
    color: #333;
    font-weight: bold;
    margin-top: 0px;
  }
  h4 {
    height: 36px;
    line-height: 36px;
    border-right: 1px solid $dc1;
    border-bottom: 1px solid $dc1;
    padding: 0 7px;
    color: $active-color;
  }
  .tr-body {
    .td {
      height: 36px;
      line-height: 36px;
      border-right: 1px solid $dc1;
      border-bottom: 1px solid $dc1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0 7px;
      color: #666;
      font-size: 12px;
    }
  }
}
.form.el-row {
  padding-right: 15px;
  .form-item {
    margin-bottom: 15px;
  }
}
.el-table {
  /deep/ th,
  /deep/ td {
    text-align: center;
  }
}
</style>
