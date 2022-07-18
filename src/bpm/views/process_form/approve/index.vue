<template>
  <flow-form
    :node="node"
    :tabs-list="tabsList"
    :collectiona-data="collectionaData"
    :comment="approvalComment"
    :return-to-node="returnToNode"
    :submitaction="submitaction"
    :is-no-start="true"
    @handleSubmit="handleSubmit"
    @handleSave="handleSave"
  >
    <div slot="approve" style="border-top: 1px solid #e5e5e5">
      <flow-card :data="approveTypeCardItem" :is-more-card="true">
        <div slot="card">
          <el-row class="form">
            <el-col class="form-item">
              <el-radio-group v-model="submitaction">
                <el-radio
                  v-for="(item, index) in approveTypeList"
                  :key="index"
                  :label="item.rightscode"
                  @change="changeApproveType(item)"
                >
                  {{ item.name }}
                </el-radio>
              </el-radio-group>
            </el-col>
            <el-col
              v-if="
                submitaction === 'RETURN_TO' ||
                submitaction === 'RETURN_TO_BACKAPPROVE' ||
                submitaction === 'RETURN_TO_REAPPROVE'
              "
              :span="8"
              class="form-item"
            >
              <el-select
                v-model="returnToNode"
                clearable
                filterable
                placeholder="请选择送审节点"
                style="width: 98%"
              >
                <el-option
                  v-for="val in node.routList"
                  :key="val.ACTIVITYNAME"
                  :label="val.ACTIVITYNAME"
                  :value="val.ACTIVITYNAME"
                >
                  <span style="float: left">{{ val.ACTIVITYNAME }}</span>
                </el-option>
              </el-select>
            </el-col>

            <el-col
              v-if="
                submitaction === 'COUNTERSIGN' ||
                submitaction === 'PLUS_SIGNED' ||
                submitaction === 'TRANSFER' ||
                submitaction === 'AGREED_TRANSFER'
              "
              :span="8"
              class="form-item"
            >
              <el-input
                v-model="selectedUsers.name"
                clearable
                type="text"
                :placeholder="$t('placeholderText.pleaseSelect')"
                reaonly
                @click.native="peopleDialog = true"
              />
              <bas-organieation
                v-model="peopleDialog"
                :selected-element="selectedElement"
                :is-specified-group-but="false"
                :multiple="submitaction !== 'TRANSFER'"
                :is-show-bustom-groups-but="false"
                :select-element="selectElement"
                :show-element="showElement"
                :title="orgtitle"
                @fnCallBack="getUser"
              />
            </el-col>
            <el-col class="form-item">
              <el-autocomplete
                v-model="approvalComment"
                style="width: 100%"
                class="inline-input"
                value-key="remark"
                :fetch-suggestions="querySearch"
                type="textarea"
                :maxlength="300"
                show-word-limit
                placeholder="请填写审批意见..."
              >
                <template slot-scope="{ item }">
                  <div class="name">
                    <el-tooltip
                      v-if="item.type !== '1'"
                      :content="$t('delete')"
                    >
                      <el-button
                        type="text"
                        icon="el-icon-delete"
                        @click.stop="handleDelete(item)"
                      />
                    </el-tooltip>
                    {{ item.remark }}
                  </div>
                </template>
              </el-autocomplete>
              <el-button
                type="primary"
                class="margin-t10"
                @click="addApproveRecord"
              >
                {{ $t("addToCommonApproval") }}
              </el-button>
            </el-col>
          </el-row>
        </div>
      </flow-card>
      <flow-card
        :data="importantNodesCardItem"
        :is-more-card="true"
        v-if="
          approvalRecordList.filter((item) => item.isimportant === 'Y').length >
          0
        "
      >
        <div slot="card">
          <el-row class="form">
            <el-table
              :data="
                approvalRecordList.filter((item) => item.isimportant === 'Y')
              "
              :header-cell-style="{ background: '#E1EAFD !important' }"
              border
              stripe
              style="width: 100%; text-align: center"
            >
              <el-table-column
                prop="processnodename"
                :label="$t('node')"
                show-overflow-tooltip
              />
              <el-table-column
                prop="username"
                :label="$t('name')"
                show-overflow-tooltip
              />
              <el-table-column
                prop="result"
                :label="$t('action2')"
                show-overflow-tooltip
              />
              <el-table-column
                prop="createdate"
                :label="$t('time')"
                width="180"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.createdate | formatDateTime }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="reason"
                :label="$t('remarks')"
                show-overflow-tooltip
              />
            </el-table>
          </el-row>
        </div>
      </flow-card>
      <flow-card :data="approvalRecordCardItem" :is-more-card="true">
        <div slot="card">
          <el-row class="form">
            <el-col :span="24" class="text-r margin-b15">
              <el-button type="primary" @click="isApprove = !isApprove">
                <i class="el-icon-sort" />
                {{ !isApprove ? $t("sortByTime") : $t("sortByDepartment") }}
              </el-button>
            </el-col>

            <el-table
              v-if="isApprove"
              :data="approvalRecordList"
              :header-cell-style="{ background: '#E1EAFD !important' }"
              border
              stripe
              style="width: 100%; text-align: center"
            >
              <el-table-column
                prop="processnodename"
                :label="$t('node')"
                show-overflow-tooltip
              />
              <el-table-column
                prop="username"
                :label="$t('name')"
                show-overflow-tooltip
              />
              <el-table-column
                prop="result"
                :label="$t('action2')"
                show-overflow-tooltip
              />
              <el-table-column
                prop="createdate"
                :label="$t('time')"
                width="180"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.createdate | formatDateTime }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="reason"
                :label="$t('remarks')"
                show-overflow-tooltip
              />
            </el-table>

            <el-col v-else class="approve-table" :span="24">
              <!-- <div class="table-header">
                <sort-button style="flex-grow: 1" :items="headers" />
              </div> -->
              <div
                v-for="(item, index) in approvalRecordSectionList"
                :key="index"
              >
                <h4 v-if="item.approveCategory">
                  {{ item.approveCategory }}
                </h4>
                <el-table
                  :data="item.list"
                  :header-cell-style="{ background: '#E1EAFD !important' }"
                  border
                  stripe
                  style="width: 100%; text-align: center"
                >
                  <el-table-column
                    prop="processnodename"
                    :label="$t('node')"
                    show-overflow-tooltip
                  />
                  <el-table-column
                    prop="username"
                    :label="$t('name')"
                    show-overflow-tooltip
                  />
                  <el-table-column
                    prop="result"
                    :label="$t('action2')"
                    show-overflow-tooltip
                  />
                  <el-table-column
                    prop="createdate"
                    :label="$t('time')"
                    width="180"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">
                      <span>{{ scope.row.createdate | formatDateTime }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="reason"
                    :label="$t('remarks')"
                    show-overflow-tooltip
                  />
                </el-table>
                <!-- <div v-for="(val, index1) in item.list" :key="index1">
                  <el-row class="tr-body" type="flex" align="middle">
                    <el-col class="td text-c" :span="headers[0].span">
                      {{ val.processnodename }}
                    </el-col>
                    <el-col class="td text-c" :span="headers[1].span">
                      {{ val.username }}
                    </el-col>
                    <el-col class="td text-c" :span="headers[2].span">
                      {{ val.result }}
                    </el-col>
                    <el-col class="td text-c" :span="headers[3].span">
                      {{ val.createdate | formatDateTime }}
                    </el-col>
                    <el-col class="td text-c" :span="headers[4].span" :title="val.reason">
                      {{ val.reason }}
                    </el-col>
                  </el-row>
                </div> -->
              </div>
            </el-col>
          </el-row>
        </div>
      </flow-card>
    </div>
  </flow-form>
</template>
<script>
import FlowForm from "../../flow_form";
import FlowCard from "../../flow_form/FlowCard";
import SelectPeople from "../../flow_form/SelectPeople";
import {
  getApproveProcessForm,
  approveProcess,
  saveProcess,
  getApprovalRemark,
  saveApprovalRemark,
  deleteApprovalRemark,
  getbyinstanceid
} from "../../../api/flow";
import { createNamespacedHelpers } from "vuex";

const { mapMutations } = createNamespacedHelpers("app");
export default {
  components: {
    FlowForm,
    FlowCard,
    SelectPeople
  },
  data() {
    return {
      node: {
        applyUserDto: {},
        nodeTabLists: []
      },
      selectedElement: {},
      showElement: [],
      selectElement: ["9"],
      orgtitle: this.$t("selectPersonnel"),
      returnToNode: "",
      headers: [
        {
          name: this.$t("node"),
          span: 6
        },
        {
          name: this.$t("name3"),
          span: 6
        },
        {
          name: this.$t("action2"),
          span: 6
        },
        {
          name: this.$t("time"),
          span: 6
        },
        {
          name: this.$t("remarks"),
          span: 6
        }
      ],
      tabsList: [],
      isApprove: true,
      approveTypeList: [],
      approvalRecordList: [],
      approvalRecordSectionList: [],
      expand: true,
      submitaction: "",
      approvalComment: "",
      selectedUsers: {
        name: "",
        id: ""
      },
      approveTypeCardItem: {
        tabname: this.$t("approvalOperation"),
        nodeTabLists: []
      },
      approvalRecordCardItem: {
        tabname: this.$t("historicalApprovalRecord"),
        nodeTabLists: []
      },
      importantNodesCardItem: {
        tabname: this.$t("approvalOpinionsOnImportantNodes"),
        nodeTabLists: []
      },
      restaurants: [],
      spanArr: [],
      peopleDialog: false,
      collectionaData: {},
      userAll: []
    };
  },
  watch: {
    submitaction(val) {
      for (const key in this.selectedUsers) {
        this.selectedUsers[key] = "";
      }
      if (
        val === "RETURN_TO" ||
        val === "RETURN_TO_BACKAPPROVE" ||
        val === "RETURN_TO_REAPPROVE"
      ) {
        this.returnToNode = this.node.routList[0].ACTIVITYNAME;
      }
    }
  },
  mounted() {
    document.title = this.$route.query.name;
    this.getData();
  },
  methods: {
    ...mapMutations([
      "setNodeData",
      "setBizData",
      "setButtonDisabled",
      "setTemporaryBizData"
    ]),
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // if(){
      // }
    },
    handleDelete(item) {
      this.$confirm(
        this.$t("hintText.areYouSureDelete"),
        this.$t("hintText.hint"),
        {
          type: "warning"
        }
      )
        .then(() => {
          deleteApprovalRemark(item.id).then((rt) => {
            if (rt.status === "200") {
              this.$message({
                message: this.$t("hintText.successfullyDelete"),
                type: "success"
              });
              this.getApprovalRemark();
            } else {
              this.$message({
                message: this.$t("hintText.failToDelete"),
                type: "error"
              });
            }
          });
        })
        .catch((_) => {
        });
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.remark.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    addApproveRecord() {
      if (!this.approvalComment) {
        this.$message.error("请输入审批意见！！");
        return;
      } else if (this.approvalComment.length > 300) {
        this.$message.error("请输入300以内的字符！！");
        return;
      }
      let sort = 0;
      if (this.restaurants.length > 0) {
        sort = ++this.restaurants[this.restaurants.length - 1].sort;
      }
      saveApprovalRemark({
        type: "2",
        sort: sort,
        userid: this.$store.state.basuser.user.id,
        remark: this.approvalComment
      })
        .then((rt) => {
          if (rt.status === "200") {
            this.$message({
              message: this.$t("hintText.saveSuccessfully"),
              type: "success"
            });
            this.getApprovalRemark();
          } else {
            this.$message({
              message: rt.message,
              type: "error"
            });
          }
        })
        .catch(() => {
          this.$message({
            message: this.$t("hintText.failToSave"),
            type: "error"
          });
        });
    },
    getApprovalRemark() {
      getApprovalRemark({
        attr: {
          userid: this.$store.state.basuser.user.id
        }
      })
        .then((rt) => {
          this.restaurants = rt.data.list;
        })
        .catch(() => {
          this.$loading().close();
        });
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    getData() {
      this.$loading();
      getApproveProcessForm({
        taskId: this.$route.query.taskId,
        userId: this.$store.state.basuser.user.id,
        index: this.$route.query.index
      })
        .then((rt) => {
          this.$loading().close();
          this.node = rt.data;

          this.tabsList = this.node.nodeTabLists.filter((item) => {
            return item.istab === "1";
          });
          this.approveTypeList = this.node.approveTypeList;
          this.approveTypeList.forEach((item) => {
            if (item.name === "通过" || item.name === "同意") {
              this.approvalResult = item.name;
            }
            if (item.rightscode === "agreed") {
              this.submitaction = item.rightscode;
              this.approvalResult = item.name;
            } else {
              this.submitaction = this.approveTypeList[0].rightscode;
              this.approvalResult = this.approveTypeList[0].name;
            }
          });
          this.approvalRecordList = this.node.approvalRecordList;

          // 把相同部门的放在一起
          this.approvalRecordSectionList = this.approvalRecordList.map(
            (item) => {
              return {
                approveCategory: item.approveCategory
              };
            }
          );
          const obj = {};
          this.approvalRecordSectionList = this.approvalRecordSectionList.reduce(
            function(item, next) {
              obj[next.approveCategory]
                ? ""
                : (obj[next.approveCategory] = true && item.push(next));
              return item;
            },
            []
          );
          this.approvalRecordSectionList.forEach((item) => {
            item.list = [];
            this.approvalRecordList.forEach((val) => {
              if (item.approveCategory === val.approveCategory) {
                val.usernames = val.username;
                if (val.attribute1 && val.attribute1 !== val.userid) {
                  val.usernames = `${val.username}-代-${val.grantorName}`;
                }
                item.list.push(val);
              }
            });
          });
          this.setBizData(this.node.bizData);
          this.setNodeData(this.node);
          this.setTemporaryBizData(this.node.bizData);
          this.getApprovalRemark();
          this.getCollection(this.node.instanceId);
        })
        .catch(() => {
          this.$loading().close();
        });
    },
    getCollection(id) {
      getbyinstanceid(id).then((rt) => {
        this.collectionaData = rt.data;
      });
    },
    changeApproveType(item) {
      this.selectedElement = {};
      this.approvalResult = item.name;
    },
    handleSave(data) {
      this.$loading();
      saveProcess({
        bizData: data,
        instanceId: this.node.instanceId,
        subject: this.node.subject,
        priority: this.node.priority,
        userId: this.node.userId,
        targetActivityName: this.node.targetActivityName,
        taskId: this.node.taskId
      })
        .then((rt) => {
          this.$message({
            message: this.$t("hintText.saveSuccessfully"),
            type: "success"
          });
          localStorage.setItem("isReloadDrafts", true);
          window.opener = null;
          window.open("", "_self");
          // window.close();
          this.$loading().close();
        })
        .catch(() => {
          this.$loading().close();
        });
    },
    handleSubmit(data) {
      if (
        this.submitaction === "RETURN_TO" ||
        this.submitaction === "RETURN_TO_BACKAPPROVE" ||
        this.submitaction === "RETURN_TO_REAPPROVE"
      ) {
        this.node.targetActivityName = this.returnToNode;
      }
      this.$loading();
      approveProcess({
        bizData: data,
        applyUserId: this.node.applyUserDto.id,
        approvalComment: this.approvalComment,
        approvalResult: this.submitaction,
        selectedUsers: this.selectedUsers.id,
        subject: this.node.subject,
        priority: this.node.priority,
        submitaction: this.approvalResult,
        targetActivityName: this.node.targetActivityName,
        taskId: this.node.taskId,
        userId: this.node.userId,
        index: this.$route.query.index
      })
        .then((rt) => {
          const that = this;
          this.$message({
            message: this.$t("hintText.submittedSuccessfully"),
            type: "success",
            duration: 2000,
            onClose() {
              that.$router.back();
              that.setButtonDisabled(false);
            }
          });
          localStorage.setItem("isReload", true);
          window.opener = null;
          window.open("", "_self");
          window.close();
          this.$loading().close();
        })
        .catch(() => {
          this.setButtonDisabled(false);
          this.$loading().close();
        });
    },
    getUser(data) {
      this.peopleDialog = false;
      this.selectedElement = data;
      this.selectedUsers.name = data.name;
      this.selectedUsers.id = data.id;
    }
  }
};
</script>

<style type="text/scss" lang="scss" scoped>
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
    border-right: 0;
  }
}
</style>
