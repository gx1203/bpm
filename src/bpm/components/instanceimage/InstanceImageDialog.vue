<template>
  <el-dialog
    v-if="dialogVisible"
    class="dialog"
    top="2vh"
    :visible.sync="dialogVisible"
  >
    <div v-loading="dialogLoading">
      <div class="tag-item" :key="index" v-for="(tag, index) in processImgList">
        <el-tag
          :class="tag.active ? 'active' : ''"
          :disable-transitions="true"
          @click="changeActive(tag, index)"
        >
          {{ tag.title }}</el-tag
        >
      </div>
      <div class="instanceImage">
        <el-image
          :src="imgUrl"
          fit="fill"
          v-if="isBusinessFlow === 'bpmFlow' && imgUrl"
          :preview-src-list="[imgUrl]"
        >
        </el-image>
        <iframe
          :src="processUrl"
          v-if="isBusinessFlow === 'bpmFlow' && processUrl"
          id="ifra"
          frameborder="0"
        />
        <div v-if="isBusinessFlow === 'businessProgress'">
          <HandleProgress :instanceId="instanceId" :processId="processId" />
        </div>
        <div class="businessImg" v-if="isBusinessFlow === 'businessUserFlow'">
          <div
            class="business-main"
            v-for="(item, index) in content"
            :key="index"
          >
            <div
              class="business-node border"
              :class="
                item.currentNode
                  ? 'currentNode'
                  : item.approved
                  ? 'approved'
                  : item.overtime
                  ? 'overtime'
                  : ''
              "
            >
              {{ item.namecn }}
            </div>
            <div class="bg">
              <div class="container"></div>
            </div>
          </div>
        </div>
        <div v-else-if="isBusinessFlow === 'approvalRecordList'">
          <el-col :span="24" class="text-r margin-b15">
            <el-button @click="isApprove = !isApprove" type="primary">
              <i class="el-icon-sort"></i>
              {{ !isApprove ? $t('sortByTime') : $t('sortByCategory') }}
            </el-button>
          </el-col>
          <el-table
            v-if="isApprove"
            :data="approvalRecordList"
            border
            stripe
            style="width: 100%;"
            :header-cell-style="{ background: '#E1EAFD !important' }"
          >
            <el-table-column
              prop="processnodename"
              :label="$t('node')"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="usernames"
              align="center"
              :label="$t('name')"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="reason"
              :label="$t('approvalOpinion')"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="result"
              align="center"
              :label="$t('action2')"
              width="120"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('approvalTime')"
              width="120"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span :class="scope.row.isexpire ? 'urge' : ''">{{
                  scope.row.approvalUseDate
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="createdate"
              align="center"
              :label="$t('time')"
              width="120"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.createdate | formatDateTime }}</span>
              </template>
            </el-table-column>
          </el-table>

          <el-col class="approve-table" :span="24" v-else>
            <!-- <div class="table-header">
              <sort-button style="flex-grow: 1" :items="headers" />
            </div> -->
            <div
              v-for="(item, index) in approvalRecordSectionList"
              :key="index"
            >
              <h4 class="text-l" v-if="item.approveCategory">
                {{ item.approveCategory }}
              </h4>
              <el-table
                :data="item.list"
                border
                stripe
                style="width: 100%;"
                :header-cell-style="{ background: '#E1EAFD !important' }"
              >
                <el-table-column
                  prop="processnodename"
                  :label="$t('node')"
                  width="180"
                ></el-table-column>
                <el-table-column
                  prop="usernames"
                  align="center"
                  :label="$t('name')"
                  width="180"
                ></el-table-column>
                <el-table-column
                  prop="reason"
                  :label="$t('approvalOpinion')"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  prop="result"
                  align="center"
                  :label="$t('action2')"
                  width="120"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  align="center"
                  :label="$t('approvalTime')"
                  width="120"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <span :class="scope.row.isexpire ? 'urge' : ''">{{
                      scope.row.approvalUseDate
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="createdate"
                  align="center"
                  :label="$t('time')"
                  width="120"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.createdate | formatDateTime }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <!-- <div v-for="(val, index1) in item.list" :key="index1">
                <el-row class="tr-body" type="flex" align="middle">
                  <el-col class="td text-l" :span="headers[0].span" :title="val.processnodename">{{val.processnodename}}
                  </el-col>
                  <el-col class="td text-c" :span="headers[1].span" :title="val.usernames">{{val.usernames}}</el-col>
                  <el-col class="td text-l" :span="headers[2].span" :title="val.reason">{{val.reason}}</el-col>
                  <el-col class="td text-c" :span="headers[3].span" :title="val.result">{{val.result}}</el-col>
                  <el-col class="td text-c" :span="headers[4].span" :title="val.approvalUseDate"
                    :class="val.isexpire ? 'urge' : ''">{{val.approvalUseDate}}</el-col>
                  <el-col class="td text-c" :span="headers[5].span">{{val.createdate | formatDateTime }}</el-col>
                </el-row>
              </div> -->
            </div>
          </el-col>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import axios from 'axios'
import HandleProgress from './HandleProgress'
import {
  getInstanceNodeInfo,
  getFlowType,
  getProcessImgType,
  getApprovalRecord
} from '@/bpm/api/app'
export default {
  name: 'InstanceImageDialog',
  components: {
    HandleProgress
  },
  data() {
    return {
      imgUrl: '',
      dialogVisible: this.value,
      isBusinessFlow: '',
      dialogLoading: false,
      isApprove: true,
      approvalRecordSectionList: [],
      approvalRecordList: [],
      processUrl: '',
      processId: '',
      alreadyNameData: '',
      content: {},
      processImgList: [],
      headers: [
        {
          name: this.$t('node'),
          span: 4
        },
        {
          name: this.$t('name3'),
          span: 4
        },
        {
          name: this.$t('approvalOpinion'),
          span: 7
        },
        {
          name: this.$t('action2'),
          span: 3
        },
        {
          name: this.$t('approvalTime'),
          span: 3
        },
        {
          name: this.$t('time'),
          span: 3
        }
      ]
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    instanceId: {
      type: String,
      default: ''
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
      if (val) {
        this.processUrl = ''
        this.getType()
      } else {
        this.imgUrl = ''
        this.content = {}
      }
    },
    dialogVisible(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    changeActive(tag, index) {
      console.log()
      this.processImgList.forEach(el => {
        el.active = false
      })
      this.processImgList[index].active = true
      this.isBusinessFlow = this.processImgList[index].type
      console.log(this.isBusinessFlow)
      if (this.isBusinessFlow === 'businessUserFlow') {
        this.getInstanceNodeInfo()
      } else if (this.isBusinessFlow === 'bpmFlow') {
        this.getInstanceImage()
      } else if (this.isBusinessFlow === 'approvalRecordList') {
        this.getApprovalRecord()
      }
    },
    getType() {
      let than = this
      than.dialogLoading = true
      getFlowType(this.instanceId)
        .then(rt => {
          if (rt.status === '200') {
            let _data = rt.data.split(';')
            // than.isBusinessFlow = _data[0];
            // than.processId = _data[1];
            // than.alreadyNameData = _data[2];
            this.isBusinessFlow = _data[0]
            this.processId = _data[1]
            this.version = _data[2]
            this.alreadyNameData = _data[3]
            if (than.isBusinessFlow === 'businessUserFlow') {
              than.processImgList = [
                {
                  title: this.$t('businessProgress'),
                  type: 'businessProgress',
                  active: true
                },
                // 注释掉业务流程图
                // {
                //   title: this.$t('businessFlowchart'),
                //   type: "businessUserFlow",
                //   active: true
                // },
                {
                  title: this.$t('modelingFlowchart'),
                  type: 'bpmFlow',
                  active: true
                },
                {
                  title: this.$t('approvalRecord'),
                  type: 'approvalRecordList'
                }
              ]
              this.getInstanceNodeInfo()
              than.changeActive(than.processImgList[0], 0)
            } else {
              than.processImgList = [
                {
                  title: this.$t('businessProgress'),
                  type: 'businessProgress',
                  active: true
                },
                {
                  title: this.$t('modelingFlowchart'),
                  type: 'bpmFlow'
                  // active: true
                },
                {
                  title: this.$t('approvalRecord'),
                  type: 'approvalRecordList'
                }
              ]
              than.changeActive(than.processImgList[0], 0)
              than.getInstanceImage()
            }
          }
        })
        .catch(() => {
          than.dialogLoading = false
        })
    },
    getInstanceImage() {
      let that = this
      if (!that.processId) return
      that.dialogLoading = false
      getProcessImgType().then(rt => {
        if (rt.data === 'bpa') {
          // that.processUrl = `${process.env.VUE_APP_BPA_URL
          //   }/leftMenu/processChart/BaseNewPage.html?id=${that.processId
          //   }&testNameData=${escape(that.alreadyNameData)}`;
          // that.processUrl = `${
          //   process.env.VUE_APP_BPA_URL
          // }/leftMenu/processChart/BaseNewPage.html?id=${
          //   that.processId
          // }&testNameData=${escape(that.alreadyNameData)}&version=${
          //   that.version
          // }&instanceId=${that.instanceId}&showChart=yes`
          that.processUrl = `${
            process.env.VUE_APP_BPA_URL
          }/leftMenu/processChart/BaseNewPage.html?id=${
            that.processId
          }&testNameData=${escape(that.alreadyNameData)}
          &instanceId=${that.instanceId}&showChart=yes`
          console.log(that.processUrl)
        } else {
          that.dialogLoading = true
          axios
            .get(
              `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/bpm/process/instanceImage/${this.instanceId}`,
              {
                responseType: 'arraybuffer',
                headers: {
                  token: localStorage.getItem('token')
                }
              }
            )
            .then(rt => {
              this.dialogLoading = false
              this.imgUrl =
                'data:image/png;base64,' +
                btoa(
                  new Uint8Array(rt.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ''
                  )
                )
            })
            .catch(() => {
              this.dialogLoading = false
            })
        }
      })
    },
    getApprovalRecord() {
      this.dialogLoading = true
      getApprovalRecord(this.instanceId)
        .then(rt => {
          this.dialogLoading = false
          if (rt.status === '200') {
            rt.data.forEach(item => {
              item.usernames = item.username
              if (item.attribute1 && item.attribute1 !== item.userid) {
                item.usernames = `${item.username}-代-${item.grantorName}`
              }
            })
            this.approvalRecordList = rt.data
            // 把相同部门的放在一起
            this.approvalRecordSectionList = this.approvalRecordList.map(
              item => {
                return {
                  approveCategory: item.approveCategory
                }
              }
            )
            let obj = {}
            this.approvalRecordSectionList = this.approvalRecordSectionList.reduce(
              function(item, next) {
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
                  if (val.attribute1 && val.attribute1 !== val.userid) {
                    val.usernames = `${val.username}-代-${val.grantorName}`
                  }
                  item.list.push(val)
                }
              })
            })
          }
        })
        .catch(() => {
          this.dialogLoading = false
        })
    },
    getInstanceNodeInfo() {
      this.dialogLoading = true
      getInstanceNodeInfo(this.instanceId)
        .then(rt => {
          this.dialogLoading = false
          if (rt.status === '200') {
            this.content = rt.data
          }
        })
        .catch(() => {
          this.dialogLoading = false
        })
    }
  }
}
</script>
<style type="text/scss" lang="scss">
.dialog .el-dialog {
  width: 90% !important;
  min-width: 1150px !important;
}
</style>
<style type="text/scss" lang="scss" scoped>
.el-dialog__wrapper {
  .instanceImage {
    height: 75vh;
    overflow: auto;
    text-align: center;
    padding: 20px 0 40px;
    /deep/ .el-table--border th,
    /deep/ .el-table--border td {
      border-right: 0;
    }
    iframe {
      width: calc(100% - 1px);
      border-left: 1px solid #dedede;
      height: 69vh;
    }
    img {
      // width: 100%;
      max-width: 100%;
      max-height: 100%;
    }
    .businessImg {
      .business-main {
        height: 80px;
        position: relative;
        font-size: 16px;
        top: 0;
        &:first-of-type .border {
          // border-radius: 25px;
        }
        .border {
          border: 2px solid $dc1;
          border-radius: 5px;
        }
        .approved {
          // box-shadow: -1px 0px 3px 1px #3CC83C,0px -1px 3px 1px #3CC83C,1px 0px 3px 1px #3CC83C,0px 1px 3px 1px #3CC83C; ;
          background-color: #0000ff !important;
          color: #fff;
        }
        .currentNode {
          // box-shadow: -1px 0px 3px 1px #3CC83C,0px -1px 3px 1px #3CC83C,1px 0px 3px 1px #3CC83C,0px 1px 3px 1px #3CC83C; ;
          background-color: #009900 !important;
          color: #fff;
        }
        .overtime {
          // box-shadow: -1px 0px 3px 1px #3CC83C,0px -1px 3px 1px #3CC83C,1px 0px 3px 1px #3CC83C,0px 1px 3px 1px #3CC83C; ;
          background-color: #ff0000 !important;
          color: #fff;
        }

        .bg {
          height: 30px;
          width: 5px;
          background-color: #195196;
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
          .container {
            width: 0;
            height: 0;
            border: 10px solid;
            border-color: #195196 transparent transparent transparent;
            position: absolute;
            bottom: -17px;
            left: -8px;
            z-index: 20;
          }
          .container::after {
            content: '';
            position: absolute;
            border: 10px solid;
            border-color: #fff transparent transparent transparent;
          }
        }
        &:last-of-type {
          height: 25px;
          .bg {
            background: none;
            .container {
              border: none;
            }
          }
          // .border {
          //   border-radius: 15px;
          // }
        }
        .business-node {
          background-color: #ededed;
          display: inline-block;
          position: relative;
          top: 0;
          z-index: 10;
          padding: 12px 0;
          width: 160px;
        }
      }
    }
  }
}

.el-dialog {
  .urge {
    color: #ea3c40 !important;
  }
  .tag-item {
    display: inline-block;
    .el-tag {
      position: relative;
      vertical-align: bottom;
      height: 40px;
      line-height: 40px;
      margin: 0;
      padding: 0 24px;
      border: 1px solid #e0e0e0;
      border-left: none;
      border-radius: 0;
      font-size: 14px;
      font-weight: 600;
      color: $tc1;
      background-color: #f0f0f0;
      cursor: pointer;
      /deep/ .el-icon-close {
        width: 20px;
        height: 20px;
        line-height: 21px;
        text-align: center;
        font-size: 20px;
        color: #717171;
        &:hover {
          background-color: transparent;
        }
      }
    }
    .el-tag.active {
      position: relative;
      background-color: #ffffff;
      border-bottom-color: transparent;
      &:before {
        content: '';
        position: absolute;
        top: -1px;
        left: 0;
        right: 0;
        height: 2px;
        background-color: $active-color;
      }
    }
    &:first-child .el-tag {
      border-left: 1px solid #e0e0e0;
    }
    &:first-child .el-tag.active {
      border-left-color: transparent;
    }
  }
  .approve-table {
    // border-left: 1px solid $dc1;
    // border-top: 1px solid $dc1;
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
}
</style>
