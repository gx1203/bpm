<template>
  <el-card shadow="never" v-loading="loading" class=" card-reset-inner">
    <!--    表格-->
    <bas-table
      row-key="id"
      :tableList="content.list"
      :headerList="headerList"
      :pages="page"
      selectType="checkbox"
      @selectionChange="handleSelectionChange"
      @currentChange="currentChange"
    >
    <!-- 自定义搜索区域 -->
      <template #search>
        <div>
           <div class="tool-common-wrap">
              <!-- <div class="search-wrap">
                <quick-query :placeholder="$t('placeholderText.multipleFieldsPlaceholder26')" ref="quick" @quickSearch="quickSearch" />
              </div> -->
              <div class="btn-wrap">
                <el-button type="primary" @click="addList">
                  {{ $t('add') }}
                  <!---->
                </el-button>
                <el-button
                  type="primary"
                  :disabled="selections.length === 0"
                  @click="userHandle(null,'批量移除')"
                >
                  {{ $t('bulkRemoval') }}
                  <!---->
                </el-button>
                <el-button type="primary" @click="rest">
                  {{ $t('refresh') }}
                  <!---->
                </el-button>
              </div>
            </div>
            <div v-if="$store.state.app.tableStyle ==='default'">
              <div class="table-header margin-t10">
                <el-checkbox v-model="checkAll" class="all-check" />
                <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort" />
              </div>
              <div v-if="content.list && content.list.length!==0">
              <div class="tr" v-for="(item, index) in content.list" :key="index">
                <div class="tr-title">
                  <el-checkbox v-model="item.checked" style="margin-right: 10px" />
                </div>
                <el-row class="tr-body" type="flex" align="middle">
                  <el-col class="td textHide" :span="headers[0].span" :title="item.userid">{{item.userid}}</el-col>
                  <el-col class="td textHide" :span="headers[1].span" :title="item.cnname">{{item.cnname}}</el-col>
                  <el-col class="td textHide" :span="headers[2].span" :title="item.email">{{item.email}}</el-col>
                  <el-col class="td textHide" :span="headers[3].span" :title="item.phone">{{item.phone}}</el-col>
                  <el-col style="text-align: center" :span="headers[4].span">
                    <el-tooltip class="item" :content="$t('remove')">
                      <el-button type="text" @click="userHandle(item,'移除')">
                        <i class="el-icon-remove"></i>
                      </el-button>
                    </el-tooltip>
                  </el-col>
                </el-row>
              </div>
              </div>
              <div v-else class="text-c pad-10px tr-empty"> {{ $t('noData') }}</div>
            </div>
        </div>
      </template>
      <!-- 工号 -->
      <template #userid="{ row }">
        <div>
          {{ row.userid }}
        </div>
      </template>
      <!-- 中文名称 -->
      <template #cnname="{ row }">
        <div>
          {{ row.cnname }}
        </div>
      </template>
      <!-- 邮件 -->
      <template #email="{ row }">
        <div>
          {{ row.email }}
        </div>
      </template>
      <!-- 电话 -->
      <template #phone="{ row }">
        <div>
          {{ row.phone }}
        </div>
      </template>
      <!-- 操作 -->
      <template #pid="{ row }">
        <el-tooltip class="item" :content="$t('remove')">
          <el-button type="text" @click="userHandle(row,'移除')">
            <i class="el-icon-remove"></i>
          </el-button>
        </el-tooltip>
      </template>
    </bas-table>
    <bas-organieation
      v-model="organieationShow"
      :selectedElement="selectedElement"
      :isSpecifiedGroupBut="false"
      :isShowBustomGroupsBut="false"
      :selectElement="selectElement"
      :showElement="showElement"
      :title="orgtitle"
      @fnCallBack="fnBasOrganieationCallBack"/>

  </el-card>
</template>
<script>
import Vue from 'vue'
import {
  saveBusinessRulePower,
  getUserList,
  deleteUser
} from "@/bpm/api/configManage/institutionalFramework/organization_manager";
import QuickQuery from "@/bpm/components/quickquery/QuickQuery";
import SearchListMixin from "@/bpm/mixins/search_list_mixin";
import BasComponent from 'bas-component'
Vue.use(BasComponent)
import 'bas-component/lib/BasComponent.css'
export default {
  mixins: [SearchListMixin],
  components: {
    QuickQuery
  },
  data() {
    return {
      organieationShow:false,
      selectedElement: {},
      showElement:[],
      selectElement: ["9"],
      orgtitle:this.$t('chooseAnAdministrator'),
      loading: false,
      searchForm: {},
      isPowerSearch: false,
      headers: [
        {
          key: "userid",
          name: this.$t('workNumber'),
          span: 6
        },
        {
          key: "cnname",
          name: this.$t('chineseName'),
          span: 6
        },
        {
          key: "email",
          name: this.$t('mail'),
          span: 6
        },
        {
          key: "phone",
          name: this.$t('phone'),
          span: 6
        },
        {
          name: this.$t('operation'),
          span: 4
        }
      ],
      selections: [],
      content: {
        list: [{}]
      },
      checkAll: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      // 表头字段
      headerList: [
        {
          label: '', // 星标
          prop: 'starmark',
          slotName: 'starmark',
          width: 35
        },
        {
          label: this.$t('workNumber'), // 工号
          prop: 'userid',
          slotName: 'userid',
          sortable: true
        },
        {
          label: this.$t('chineseName'), // 中文名称
          prop: 'cnname',
          slotName: 'cnname',
          sortable: true
        },
        {
          label: this.$t('mail'), // 邮件
          prop: 'email',
          sortable: true,
        },
        {
          label: this.$t('phone'), // 电话
          prop: 'phone',
          slotName: 'phone',
          sortable: true
        },
        {
          label: this.$t('operation'), // 操作
          prop: 'pid',
          slotName: 'pid',
          sortable: false
        }
      ]
    };
  },
  props: {
    treeData: {
      type: Object,
      default: {}
    }
  },
  watch: {
    treeData(val) {
      this.quickQueryData();
    },
    "content.list": {
      handler(val) {
        if (this.content.list && this.content.list.length !== 0) {
          this.checkAll = true;
          this.selections = [];
          for (let i = 0; i < this.content.list.length; i++) {
            if (!this.content.list[i].checked) {
              this.checkAll = false;
            } else {
              this.selections.push(this.content.list[i]);
            }
          }
        }
      },
      deep: true
    },
    checkAll(val) {
      if (this.content.list) {
        if (val) {
          this.content.list.forEach(item => {
            item.checked = val;
          });
        } else if (this.selections.length === this.content.list.length) {
          this.content.list.forEach(item => {
            item.checked = val;
          });
        }
      }
    }
  },
  mounted() {
    this.quickQueryData();
  },
  methods: {
    // 页码改变事件
    currentChange(newPageNum) {
      console.log('newPage', newPageNum)
      this.page.pageNum = newPageNum
      if (this.searchType === 'power') {
        this.getData()
      } else {
        this.quickQueryData()
      }
    },
    // 复选框勾选事件
    handleSelectionChange(val) {
      this.selections = val;
      console.log(val)
    },
    addList() {
      this.selectedElement = {};
      this.organieationShow = true;
    },
    // 快速获取数据
    quickQueryData() {
      this.loading = true;
      getUserList({
        attr: {
          organizationid: this.treeData.id
        },
        logic: "or",
        filters: [
          {
            key: "searchStr",
            opt: "LIKE",
            type: "S",
            value: this.quickData.searchData
          }
        ],
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          this.page.total = rt.data.total
          this.content = rt.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getData() {
      this.loading = true;
      getUserList({
        attr: {
          organizationid: this.treeData.id
        },
        logic: "and",
        filters: this.filters,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          rt.data.list.forEach(item => {
            item.checked = false;
          });
          this.page.total = rt.data.total
          this.content = rt.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleSort(val) {
      this.sort = val;
      this.quickQueryData();
    },
    userHandle(item, type) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: "warning"
      })
        .then(() => {
          let _params = "";
          if (type === "移除") {
            _params = item.userid;
          } else {
            _params = this.selections.map(item => item.userid).join(",");
          }
          this.loading = true;
          deleteUser({
            orgid: this.treeData.id,
            params: _params
          })
            .then(rt => {
              this.loading = false;
              if (rt.status === "200") {
                this.$message.success(this.$t('hintText.removedSuccessfully'));
                this.quickQueryData();
              } else {
                this.$message.success(this.$t('hintText.removalFailed'));
              }
            })
            .catch(er => {
              this.loading = false;
            });
        })
        .catch(_ => {});
    },
    search() {
      this.filters = [];
      Object.keys(this.searchForm).forEach(key => {
        const filter = {
          key,
          opt: "LIKE",
          type: "S",
          value: this.searchForm[key]
        };
        this.filters.push(filter);
      });
      this.quickQueryData();
    },
    reset() {
      this.searchForm = {};
      this.search();
    },
    fnBasOrganieationCallBack(data) {
      if(data.id&&data.id.length>0){
        console.log(data.id.split(","))
        this.loading = true;
        saveBusinessRulePower({
          userIds: data.id.split(","),
          pid: this.treeData.pid || 0,
          organizationid: this.treeData.id
        }).then(rt => {
          this.loading = false;
          if (rt.status === "200") {
            this.$message.success(this.$t('hintText.addedSuccess'));
            this.organieationShow = false;
            this.quickQueryData();
          } else {
            this.$message.success(this.$t('hintText.operationFailure'));
          }
        })
        .catch(er => {
          this.loading = false;
        });
      }
    },
  }
};
</script>
<style lang="scss" scoped>
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
</style>
