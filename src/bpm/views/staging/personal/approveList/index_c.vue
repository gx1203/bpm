<template>
  <el-card shadow="never">
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <quick-query
          ref="quick"
          :placeholder="$t('placeholderText.toDoTasksPlaceholder')"
          @quickSearch="quickSearch"
        />
      </div>
      <div class="btn-wrap">
        <el-button
          :disabled="selections.length === 0"
          type="primary"
          @click="commentVisible = true"
        >
          {{ $t("batchApproval") }}
          <!--<i class="el-icon-finished" />-->
        </el-button>
        <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
          {{ $t("advancedQuery") }}
          <i
            :class="
              isPowerSearch ? 'el-icon-caret-top' : 'el-icon-caret-bottom'
            "
          />
        </el-button>
        <el-button type="primary" @click="rest">
          {{ $t("refresh") }}
          <!---->
        </el-button>
      </div>
    </div>
    <el-form
      v-if="isPowerSearch"
      class="power-search"
      :model="searchForm"
      label-width="120px"
      @keyup.enter.native="powerSearch"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('processName') + '：'">
            <el-input
              v-model="searchForm.processCnname"
              clearable
              type="text"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('applicationNumber') + '：'">
            <el-input v-model="searchForm.reqNo" clearable type="text" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('subject') + '：'">
            <el-input v-model="searchForm.subject" clearable type="text" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('applicant') + '：'">
            <el-input v-model="searchForm.drafter" clearable type="text" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('applicationDate') + '：'">
            <el-date-picker
              v-model="searchForm.reqDate"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              :range-separator="$t('placeholderText.to')"
              :start-placeholder="$t('placeholderText.startDate')"
              :end-placeholder="$t('placeholderText.endDate')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('receiptTime') + '：'">
            <el-date-picker
              v-model="searchForm.assignedDate"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              :range-separator="$t('placeholderText.to')"
              :start-placeholder="$t('placeholderText.startDate')"
              :end-placeholder="$t('placeholderText.endDate')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('agenttype') + '：'">
            <el-select v-model="searchForm.category" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="text-r">
          <el-button type="primary" @click="powerSearch">
            {{ $t("query") }}
          </el-button>
          <el-button type="primary" @click="rest">
            {{ $t("reset") }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <div v-loading="loading" class="tableWrap">
      <div v-if="$store.state.app.tableStyle === 'default'">
        <div class="table-header margin-t10">
          <el-checkbox v-model="checkAll" class="all-check" />
          <sort-button
            style="flex-grow: 1"
            :items="headers"
            @sort="handleSort"
          />
        </div>
        <div v-if="content.list && content.list.length !== 0">
          <div v-for="(item, index) in content.list" :key="index" class="tr">
            <div class="tr-title">
              <el-checkbox v-model="item.checked" />
              <span>
                {{ $t("applicationDate") }}：{{
                  item.reqDate | formatDateTime
                }}</span
              >
              <span style="margin-left: 60px"
                >{{ $t("receiptTime") }}：{{
                  item.assignedDate | formatDateTime
                }}</span
              >
              <span style="margin-left: 60px">
                {{ $t("applicationNumber") }}：
                <el-button
                  class="w65 overflow-els"
                  type="text"
                  :title="item.reqNo"
                  @click="toFlow(item)"
                  >{{ item.reqNo }}</el-button
                >
              </span>
              <span
                v-if="item.comments"
                style="margin-left: 60px"
                :title="item.comments"
                class="tr-title-comments"
              >
                {{ item.comments }}
              </span>
            </div>
            <el-row class="tr-body" type="flex" align="middle">
              <el-col
                class="td textHide link"
                :class="item.urge === 'Y' ? 'urge' : ''"
                :span="headers[0].span"
                :title="item.subject"
                @click.native="toFlow(item)"
              >
                {{ item.subject }}
              </el-col>
              <el-col
                class="td textHide"
                :span="headers[1].span"
                :title="item.drafter"
              >
                {{ item.drafter }}
              </el-col>
              <el-col
                class="td textHide"
                :span="headers[2].span"
                :title="item.activityName"
              >
                {{ item.activityName }}
              </el-col>
              <el-col
                class="td textHide"
                :span="headers[3].span"
                :title="item.processCnname"
              >
                <el-button type="text" @click="toFlow(item)">
                  {{ item.processCnname }}
                </el-button>
              </el-col>
              <el-col style="text-align: center" :span="headers[4].span">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="$t('flowChart')"
                  placement="top"
                >
                  <el-button
                    type="text"
                    @click="getInstanceImage(item.instanceId)"
                  >
                    <i
                      class="iconfont icon-liuchengtu"
                      style="font-size: 20px"
                    />
                  </el-button>
                </el-tooltip>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-else class="text-c pad-10px tr-empty">
          {{ $t("noData") }}
        </div>
      </div>
      <div v-else>
        <el-table
          :data="content.list"
          class="margin-t10"
          stripe
          :header-cell-style="{ background: '#E1EAFD !important' }"
          highlight-current-row
          @sort-change="elHandleSort"
          current-row-key="taskId"
          @select-all="selectall"
        >
          <el-table-column width="50">
            <template slot-scope="scope">
              <el-checkbox
                :disabled="
                  scope.row.isapprovedlist === 'N' || !scope.row.isapprovedlist
                "
                v-model="scope.row.checked"
              />
            </template>
            <template slot="header">
              <el-checkbox v-model="checkAll" @change="selectall" />
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('applicationNumber')"
            show-overflow-tooltip
            sortable
            prop="reqNo"
          >
            <template slot-scope="scope">
              <div class="link" @click="toFlow(scope.row)">
                {{ scope.row.reqNo }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('subject')"
            show-overflow-tooltip
            sortable
            prop="subject"
          >
            <template slot-scope="scope">
              <div
                class="link"
                :class="scope.row.urge === 'Y' ? 'urge' : ''"
                @click="toFlow(scope.row)"
              >
                {{ scope.row.subject }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('applicant')"
            show-overflow-tooltip
            sortable
            prop="drafter"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.drafter }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('applicationDate')"
            show-overflow-tooltip
            sortable
            prop="reqDate"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.reqDate | formatDateTime }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('approvalNode')"
            show-overflow-tooltip
            sortable
            prop="activityName"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.activityName }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('agenttype')"
            show-overflow-tooltip
            sortable
            prop="category"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.category | formatcategory }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('receiptTime')"
            show-overflow-tooltip
            sortable
            prop="assignedDate"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.assignedDate | formatDateTime }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('processName')"
            show-overflow-tooltip
            sortable
            prop="processCnname"
          >
            <template slot-scope="scope">
              <div class="link" @click="toFlow(scope.row)">
                {{ scope.row.processCnname }}
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('flowChart')" width="80">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="getInstanceImage(scope.row.instanceId)"
              >
                <el-tooltip :content="$t('view')" placement="top">
                  <i
                    class="iconfont icon-liuchengtu item-liuchengtu"
                    style="font-size: 20px"
                  />
                </el-tooltip>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-pagination
      class="margin-t15"
      :page-size="page.pageSize"
      :current-page.sync="page.pageNum"
      background
      :total="content.total"
      @current-change="searchType === 'power' ? getData() : quickQueryData()"
    />
    <InstanceImageDialog v-model="dialogVisible" :instance-id="instanceId" />
    <approvalComment
      v-model="commentVisible"
      :item="selections"
      @confirm="getData"
    />
  </el-card>
</template>

<script>
import {
  getApproveList,
  quickQueryApproveList,
  taskExists,
} from "@/bpm/api/staging/personal/approve_list";
import QuickQuery from "@/bpm/components/quickquery/QuickQuery";
import { checkProcessDefaultPage } from "@/bpm/api/flow/index";
import InstanceImageDialog from "@/bpm/components/instanceimage/InstanceImageDialog";
import SearchListMixin from "@/bpm/mixins/search_list_mixin";
import main from "@/main";
import approvalComment from "./approvalComment";

import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapActions } = createNamespacedHelpers("app");

window.addEventListener("storage", function (e) {
  if (e.key === "isReload" && e.newValue === "true") {
    window.getData();
  }
});
export default {
  components: {
    QuickQuery,
    InstanceImageDialog,
    approvalComment,
  },
  mixins: [SearchListMixin],
  data() {
    return {
      options: [
        {
          value: "TODO",
          label: this.$t("normaltodo"),
        },
        {
          value: "TRANSFER",
          label: this.$t("administrativetodo"),
        },
        {
          value: "MORE_APPROVE",
          label: this.$t("communicationtodo"),
        },
      ],
      headers: [
        {
          key: "subject",
          name: this.$t("subject"),
          span: 6,
        },
        {
          key: "drafter",
          name: this.$t("applicant"),
          span: 5,
        },
        {
          key: "activityName",
          name: this.$t("approvalNode"),
          span: 5,
        },
        {
          key: "processCnname",
          name: this.$t("processName"),
          span: 6,
        },
        {
          name: this.$t("flowChart"),
          span: 2,
        },
      ],
      dialogVisible: false,
      commentVisible: false,
      instanceId: "",
      checkAll: false,
      selections: [],
    };
  },
  filters: {
    formatcategory(val) {
      if (val === "TRANSFER") {
        return main.$t("administrativetodo");
      } else if (val === "MORE_APPROVE") {
        return main.$t("communicationtodo");
      } else {
        return main.$t("normaltodo");
      }
    },
  },
  watch: {
    "content.list": {
      handler(val) {
        if (this.content.list && this.content.list.length !== 0) {
          // this.checkAll = true;
          this.selections = [];
          for (let i = 0; i < this.content.list.length; i++) {
            if (!this.content.list[i].checked) {
              // this.checkAll = false;
            } else {
              this.selections.push(this.content.list[i]);
            }
          }
        }
      },
      deep: true,
    },
    // checkAll(val) {
    //   console.log(this.selections,this.content.list);
    //   console.log(val);
    // },
  },
  mounted() {
    window.getData = this.getData;
    this.getData();
  },
  methods: {
    selectall(val) {
      if (this.content.list) {
        if (this.checkAll == true) {
          this.content.list.forEach((item) => {
            if (item.isapprovedlist == "Y" && item.isapprovedlist) {
              item.checked = this.checkAll;
              this.selections.push(item);
            }
          });
        } else {
          this.content.list.forEach((item) => {
            item.checked = this.checkAll;
            this.selections = [];
          });
        }
      }
    },
    ...mapActions(["requireApproveCount"]),
    // 快速获取数据
    quickQueryData() {
      this.loading = true;
      this.checkAll = false;

      quickQueryApproveList({
        logic: "or",
        attr: {
          platform: "PC",
        },
        filters: this.filters,
        queryFilter: [
          "reqno",
          "subject",
          "drafter",
          "activityName",
          "processCnname",
        ],
        ...this.quickData,
        ...this.sort,
        ...this.page,
      })
        .then((rt) => {
          rt.data.list.forEach((item) => {
            item.checked = false;
            if (item.category) {
              if (item.category === "MORE_APPLY") {
                item.activityName = "退回修改";
              } else if (item.category === "MORE_APPROVE") {
                item.activityName = item.activityName + "-加签";
              }
            }
          });
          this.content = rt.data;
          this.requireApproveCount();
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 获取数据
    getData() {
      this.loading = true;
      this.checkAll = false;
      localStorage.setItem("isReload", false);
      quickQueryApproveList({
        logic: "and",
        attr: {
          platform: "PC",
        },
        filters: this.filters,
        ...this.sort,
        ...this.page,
      })
        .then((rt) => {
          rt.data.list.forEach((item) => {
            if (item.category) {
              if (item.category === "MORE_APPLY") {
                item.activityName = "退回修改";
              } else if (item.category === "MORE_APPROVE") {
                item.activityName = item.activityName + "-加签";
              }
            }
          });
          rt.data.list.forEach((item) => {
            item.checked = false;
          });
          this.content = rt.data;
          this.requireApproveCount();
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    toFlow(item) {
      let routeData = {};
      taskExists(item.taskId, item.index).then((rt) => {
        if (!rt.data) {
          this.$message.error(this.$t("hintText.taskDoesNotExist"));
          return;
        }
        checkProcessDefaultPage({
          processName: item.processId,
          instanceId: item.instanceId,
        }).then((rt) => {
          if (rt.status === "200") {
            if (rt.data.isDefaultPage === "Y") {
              routeData = this.$router.resolve({
                name: item.processId + "Approve",
                query: {
                  name: item.processCnname,
                  taskId: item.taskId,
                  category: item.category,
                  // processName: item.taskdefinitionId,
                  processName: item.processId,
                  index: item.index,
                },
              });
            } else {
              // routeData = this.$router.resolve({
              //   path: item.linkUrl,
              //   query: {
              //     name: item.processCnname,
              //     category: item.category,
              //     processName:item.taskdefinitionId,
              //     taskId: item.taskId
              //   }
              // })
              if (item.linkUrl.startsWith("http")) {
                routeData.href = `${item.linkUrl}?name=${item.processCnname}&category=${item.category}&processName=${item.processId}&taskId=${item.taskId}&index=${item.index}`;
              } else {
                routeData.href = `${
                  window.location.origin +
                  window.location.pathname +
                  item.linkUrl
                }?name=${item.processCnname}&category=${
                  item.category
                }&processName=${item.processId}&taskId=${item.taskId}&index=${
                  item.index
                }`;
              }
            }
            // window.open(routeData.href, "_blank");
            const a = document.createElement("a");
            // 给创建好的a标签赋值
            a.setAttribute("href", routeData.href);
            // 设置css 隐藏属性
            a.setAttribute("style", "display:none");
            // 设置 a标签为新窗口打开
            a.setAttribute("target", "_blank");
            // 将设置好的a标签，添加到 body 内
            document.body.appendChild(a);
            // 模拟点击
            a.click();
            // 移除a标签
            a.parentNode.removeChild(a);
          }
        });
      });
    },
    getInstanceImage(id) {
      this.instanceId = id;
      this.dialogVisible = true;
    },
  },
};
</script>

<style scoped>
.urge {
  color: #ea3c40;
  font-weight: 600;
}
.item-liuchengtu {
  color: #888;
}
.item-liuchengtu:hover {
  color: #2d42af;
}
</style>
